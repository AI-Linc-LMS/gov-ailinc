/**
 * Ticket triage, support assignees, and the notification write side.
 *
 * The read half of support lives in `tickets.ts`; this is everything a human
 * clicks. None of it was answered before, which meant admin triage was entirely
 * decorative: Resolve, Mark in progress and Reopen all hit unregistered paths, so
 * the button spun, the toast said "not available in this preview", and the queue
 * never moved. Worse, the two that did nothing were the two an evaluator tries
 * first.
 *
 * Every mutation here goes through `patchTicket`, which writes to the overlay.
 * That is the point: a ticket resolved on the detail page must read RESOLVED in
 * the admin queue behind it, in the student's own list, and after a reload.
 *
 * Shapes are the service's own `Ticket` / `TicketAssignee` / `Notification`
 * types, imported rather than reimplemented, because a triage response that is
 * missing `resolution_history` does not empty the page, it crashes it.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import { findTicket, patchTicket, userMini, STATUS_LABEL } from "./tickets";
import { markNotificationRead, pushNotification } from "./notifications";
import { ADMIN_PERSONA, STUDENT_PERSONA } from "../../db/people";
import { courseById } from "../../db/courses";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { DEMO_TENANT } from "../../config";
import type {
  ResolutionHistoryEntry,
  ReopenHistoryEntry,
  Ticket,
  TicketAssignee,
  TicketStatus,
} from "@/lib/services/ticket.service";

const MODULE = "ticket-actions";

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/* ------------------------------------------------------------------ tickets */

/**
 * Fold the resolution currently on the ticket into its history.
 *
 * The seed already puts a resolved ticket's notes in BOTH `admin_resolution_notes`
 * and `resolution_history[0]` — history is "every resolution, including the one
 * showing now", which is what the detail page renders. So reopening only has to
 * clear the live fields; appending again would print the same resolution twice.
 */
function clearedResolution(): Partial<Ticket> {
  return {
    admin_resolution_notes: "",
    admin_attachments: [],
    resolved_at: null,
    resolved_by_user: null,
  };
}

function reopenedTicket(ticket: Ticket, entry: ReopenHistoryEntry): Ticket {
  return patchTicket(ticket.id, {
    status: "OPEN",
    status_display: STATUS_LABEL.OPEN,
    reopened_at: entry.reopened_at,
    reopen_history: [...ticket.reopen_history, entry],
    ...clearedResolution(),
  });
}

function resolvedTicket(ticket: Ticket, notes: string, attachments: string[]): Ticket {
  const at = iso(new Date(nowMs()));
  const entry: ResolutionHistoryEntry = {
    notes,
    attachments,
    resolved_by_id: ADMIN_PERSONA.id,
    resolved_by_name: ADMIN_PERSONA.full_name,
    resolved_by_email: ADMIN_PERSONA.email,
    resolved_at: at,
  };
  return patchTicket(ticket.id, {
    status: "RESOLVED",
    status_display: STATUS_LABEL.RESOLVED,
    admin_resolution_notes: notes,
    admin_attachments: attachments,
    resolved_at: at,
    resolved_by_user: userMini(ADMIN_PERSONA),
    resolution_history: [...ticket.resolution_history, entry],
  });
}

/* ---------------------------------------------------------------- assignees */

/**
 * People CC'd on every new ticket. Not the same thing as a ticket's assignee:
 * these are plain email addresses an org admin maintains, which is why the shape
 * has no user id and the dialog accepts an address that belongs to nobody on the
 * roster (a shared inbox, typically).
 */
interface AssigneeSeed {
  id: number;
  email: string;
  name: string;
  daysAgo: number;
}

const ASSIGNEE_SEEDS: AssigneeSeed[] = [
  {
    id: 3101,
    email: DEMO_TENANT.supportEmail,
    name: "AI Linc Support Desk",
    daysAgo: 210,
  },
  {
    id: 3102,
    email: ADMIN_PERSONA.email,
    name: ADMIN_PERSONA.full_name,
    daysAgo: 210,
  },
  {
    id: 3103,
    email: "helpdesk@ailinc.com",
    name: "Campus IT Helpdesk",
    daysAgo: 64,
  },
];

const ADDED_KEY = "tickets:assignees:added";
const REMOVED_KEY = "tickets:assignees:removed";

function seededAssignees(): TicketAssignee[] {
  return ASSIGNEE_SEEDS.map((a) => ({
    id: a.id,
    email: a.email,
    name: a.name,
    created_at: isoDaysAgo(a.daysAgo, 10, 30),
  }));
}

function assignees(): TicketAssignee[] {
  const removed = new Set(overlay.get<number[]>(REMOVED_KEY, []));
  const added = overlay.get<TicketAssignee[]>(ADDED_KEY, []);
  return [...added, ...seededAssignees()].filter((a) => !removed.has(a.id));
}

/* ------------------------------------------------------------ notifications */

/** How many learners a broadcast reached, phrased the way the toast reads best. */
function audienceFor(body: Record<string, unknown>): string {
  const target = String(body.target_type ?? "client");
  if (target === "individual") {
    const count = Array.isArray(body.student_ids) ? body.student_ids.length : 0;
    return `${count} ${count === 1 ? "student" : "students"}`;
  }
  if (target === "course") {
    const course = courseById(Number(body.course_id));
    return course ? `everyone enrolled in ${course.title}` : "everyone on the course";
  }
  return `every student at ${DEMO_TENANT.name}`;
}

/**
 * Whether the signed-in learner is in the audience.
 *
 * The bell is shared across personas in this prototype, so a broadcast is only
 * dropped into it when the student persona would genuinely have received it.
 * Showing an admin their own targeted message in someone else's inbox is the
 * kind of detail that makes a prospect stop trusting the rest of the screen.
 */
function reachesStudentPersona(body: Record<string, unknown>): boolean {
  const target = String(body.target_type ?? "client");
  if (target === "individual") {
    const ids = Array.isArray(body.student_ids) ? body.student_ids.map(Number) : [];
    return ids.includes(STUDENT_PERSONA.id);
  }
  if (target === "course") {
    const course = courseById(Number(body.course_id));
    return Boolean(course?.enrolled);
  }
  return true;
}

defineRoutes(MODULE, {
  /**
   * Admin status change. Only OPEN and IN_PROGRESS come through here — resolving
   * has its own endpoint because it carries notes — but OPEN also arrives from
   * the "Reopen" button on a resolved ticket, so it has to run the same
   * resolution-clearing path the student reopen does.
   */
  "PATCH /api/clients/:clientId/tickets/:ticketId/status/": (req) => {
    const ticket = findTicket(Number(req.params.ticketId));
    const status = String(req.body?.status ?? "") as TicketStatus;
    if (!STATUS_LABEL[status]) {
      throw badRequest({ detail: "Choose a valid status for this ticket." });
    }

    if (status === "OPEN" && ticket.status === "RESOLVED") {
      return reopenedTicket(ticket, {
        details: "Reopened by the support team for further investigation.",
        attachments: [],
        reopened_at: iso(new Date(nowMs())),
        by: "admin",
      });
    }

    return patchTicket(ticket.id, { status, status_display: STATUS_LABEL[status] });
  },

  "POST /api/clients/:clientId/tickets/:ticketId/resolve/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const ticket = findTicket(Number(req.params.ticketId));
    const notes = String(body.admin_resolution_notes ?? "").trim();
    // Mirrors the backend's own validation. The page checks this too, but a
    // resolution with an empty note would leave the student's ticket page
    // rendering a "Resolved" panel with nothing in it.
    if (!notes) {
      throw badRequest({
        admin_resolution_notes: ["Tell the student what you did before resolving."],
      });
    }
    return resolvedTicket(ticket, notes, stringList(body.admin_attachments));
  },

  /** Student-side reopen. Carries their explanation, which the admin then reads. */
  "POST /api/clients/:clientId/tickets/:ticketId/reopen/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const ticket = findTicket(Number(req.params.ticketId));
    const details = String(body.additional_details ?? "").trim();
    if (!details) {
      throw badRequest({
        additional_details: ["Describe what is still happening so we can reopen this."],
      });
    }
    if (ticket.status !== "RESOLVED") {
      throw badRequest({ detail: "This ticket is already open." });
    }
    return reopenedTicket(ticket, {
      details,
      attachments: stringList(body.additional_attachments),
      reopened_at: iso(new Date(nowMs())),
      by: "user",
    });
  },

  /** `{count, results}` — the dialog reads `data.results`, not a bare array. */
  "GET /api/clients/:clientId/tickets/assignees/": () => {
    const rows = assignees();
    return { count: rows.length, results: rows };
  },

  "POST /api/clients/:clientId/tickets/assignees/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email.includes("@")) {
      throw badRequest({ email: ["Enter a valid email address."] });
    }
    if (assignees().some((a) => a.email.toLowerCase() === email)) {
      throw badRequest({ detail: `${email} is already on the assignee list.` });
    }
    const created: TicketAssignee = {
      id: nextDemoId("ticket-assignee"),
      email,
      name: String(body.name ?? "").trim() || email.split("@")[0],
      created_at: iso(new Date(nowMs())),
    };
    overlay.unshift(ADDED_KEY, created);
    return created;
  },

  /**
   * Removal is a tombstone rather than a delete, because two of the three rows
   * come from the seed and the seed is rebuilt on every load. Without the
   * tombstone a removed assignee reappears on the next reload.
   */
  "DELETE /api/clients/:clientId/tickets/assignees/:assigneeId/": (req) => {
    const id = Number(req.params.assigneeId);
    if (!assignees().some((a) => a.id === id)) throw notFound("Assignee not found");
    overlay.update<number[]>(REMOVED_KEY, [], (list) =>
      list.includes(id) ? list : [...list, id],
    );
    return { detail: "Assignee removed." };
  },

  /**
   * The bell's mark-as-read. `notifications.ts` registered this path as POST
   * only, but the service sends PATCH, so every click fell through to the
   * unhandled path: the panel closed, the route opened, and the badge silently
   * stayed where it was.
   *
   * Returns the whole notification, which is what the service's type promises.
   */
  "PATCH /notification/api/clients/:clientId/notifications/:notificationId/read/": (req) =>
    markNotificationRead(Number(req.params.notificationId)),

  /** Admin broadcast. Returns `{message}`, which the page shows as its toast. */
  "POST /notification/api/clients/:clientId/admin/send/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!title || !message) {
      throw badRequest({ detail: "A notification needs both a title and a message." });
    }
    const actionUrl = String(body.action_url ?? "").trim() || null;

    if (reachesStudentPersona(body)) {
      pushNotification({ title, message, type: "announcement", actionUrl });
    }
    return { message: `Notification sent to ${audienceFor(body)}.` };
  },
});
