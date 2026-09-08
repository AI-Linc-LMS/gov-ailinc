/**
 * Support tickets, for all three roles.
 *
 * Written against the real `Ticket` shape rather than an approximation of it.
 * The earlier version returned a bare array of loosely-shaped objects, and the
 * student ticket page read `data.results` off it and took the page down. Worth
 * stating as a rule: for this demo a handler with the WRONG shape is worse than
 * no handler at all — a missing one degrades to an empty state, a wrong one
 * crashes the route.
 *
 * Statuses are the API's uppercase enum (OPEN / IN_PROGRESS / RESOLVED), and the
 * queue carries a genuine spread so the triage columns are not all one colour.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  ADMIN_PERSONA,
  INSTRUCTOR_PERSONA,
  STUDENTS,
  STUDENT_PERSONA,
  type DemoPerson,
} from "../../db/people";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import type {
  Ticket,
  TicketCategory,
  TicketStatus,
} from "@/lib/services/ticket.service";

const MODULE = "tickets";

// Aliased to the service's own unions rather than retyped here: the seed and the
// consumer then cannot drift, and `toTicket` is checked against the real `Ticket`.
type Status = TicketStatus;
type Category = TicketCategory;

const CATEGORY_LABEL: Record<Category, string> = {
  technical: "Technical",
  content: "Course content",
  video: "Video playback",
  quiz: "Quiz",
  navigation: "Navigation",
  other: "Other",
};

export const STATUS_LABEL: Record<Status, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export function userMini(p: DemoPerson) {
  return {
    id: p.id,
    user_id: p.id,
    email: p.email,
    full_name: p.full_name,
    role: p.role,
  };
}

interface Seed {
  id: number;
  category: Category;
  subject: string;
  description: string;
  status: Status;
  by: DemoPerson;
  assigned?: DemoPerson;
  daysAgo: number;
  resolution?: string;
  /** Was reopened at least once — the `reopened` filter selects on this. */
  reopened?: boolean;
}

const SEEDS: Seed[] = [
  {
    id: 4831,
    category: "content",
    subject: "Cannot submit the module 3 coding problem",
    description:
      "Run passes all the visible cases but Submit reports two hidden cases failing, and I cannot see which ones. Is that expected?",
    status: "OPEN",
    by: STUDENTS[3],
    assigned: INSTRUCTOR_PERSONA,
    daysAgo: 1,
  },
  {
    id: 4821,
    category: "video",
    subject: "Lesson video buffers constantly on college wifi",
    description:
      "The React module video pauses every few seconds on campus. It is fine at home, so it may be our network, but flagging it in case others hit it.",
    status: "IN_PROGRESS",
    by: STUDENT_PERSONA,
    assigned: ADMIN_PERSONA,
    daysAgo: 3,
  },
  {
    id: 4805,
    category: "quiz",
    subject: "Quiz timer kept running after I submitted",
    description:
      "I submitted with about 40 seconds left and the timer carried on counting down on the results screen.",
    status: "RESOLVED",
    by: STUDENTS[11],
    assigned: ADMIN_PERSONA,
    daysAgo: 7,
    resolution:
      "Reproduced and fixed. The countdown was not being cleared on submit; it now stops the moment the paper is handed in. Your score was recorded correctly.",
  },
  {
    id: 4788,
    category: "other",
    subject: "Certificate shows my name without the middle initial",
    description: "Can that be corrected before I share it on LinkedIn?",
    status: "RESOLVED",
    by: STUDENT_PERSONA,
    assigned: ADMIN_PERSONA,
    daysAgo: 12,
    resolution:
      "Updated your profile name and reissued the certificate. The share link is unchanged, so anything you have already posted now shows the corrected name.",
  },
  {
    id: 4776,
    category: "navigation",
    subject: "Resume button on the dashboard opens the wrong lesson",
    description: "It takes me to the first lesson of the module rather than the one I stopped at.",
    status: "OPEN",
    by: STUDENTS[19],
    daysAgo: 2,
  },
  // The signed-in student needs a ticket in EVERY status, or the status tabs on
  // their own page look identical no matter which one is selected.
  {
    id: 4840,
    category: "technical",
    subject: "Coding editor loses my work when I switch language",
    description:
      "I had a working solution in Python, switched the dropdown to JavaScript to compare, and switching back gave me the empty template again.",
    status: "OPEN",
    by: STUDENT_PERSONA,
    daysAgo: 0,
  },
  {
    id: 4812,
    category: "quiz",
    subject: "Hint counter did not go down after I used one",
    description:
      "Spent a hint on the sliding-window quiz and it still showed 3 left afterwards. Not a problem, just looked wrong.",
    status: "RESOLVED",
    by: STUDENT_PERSONA,
    assigned: INSTRUCTOR_PERSONA,
    daysAgo: 9,
    resolution:
      "Good catch. The counter was reading the value from before the spend; it now updates in the same response that returns the hint.",
    reopened: true,
  },
];

function toTicket(s: Seed): Ticket {
  const resolved = s.status === "RESOLVED";
  return {
    id: s.id,
    category: s.category,
    category_display: CATEGORY_LABEL[s.category],
    subject: s.subject,
    description: s.description,
    status: s.status,
    status_display: STATUS_LABEL[s.status],
    user_attachments: [],
    admin_resolution_notes: s.resolution ?? "",
    admin_attachments: [],
    course_id: null,
    content_id: null,
    page_url: "/dashboard",
    raised_by: userMini(s.by),
    resolved_by_user: resolved && s.assigned ? userMini(s.assigned) : null,
    cohort: 11,
    cohort_name: "Autumn 2026: Full-Stack",
    assigned_to_user: s.assigned ? userMini(s.assigned) : null,
    // null assigner with an assignee means the system auto-routed it, which is
    // the real product's convention and worth showing in the triage column.
    assigned_by_user: s.assigned ? userMini(ADMIN_PERSONA) : null,
    assigned_at: s.assigned ? isoDaysAgo(s.daysAgo, 10, 0) : null,
    resolved_at: resolved ? isoDaysAgo(Math.max(0, s.daysAgo - 2), 16, 30) : null,
    reopened_at: s.reopened ? isoDaysAgo(Math.max(0, s.daysAgo - 4), 11, 0) : null,
    resolution_history: resolved && s.resolution
      ? [
          {
            notes: s.resolution,
            attachments: [],
            resolved_by_id: s.assigned?.id ?? null,
            resolved_by_name: s.assigned?.full_name ?? null,
            resolved_by_email: s.assigned?.email ?? null,
            resolved_at: isoDaysAgo(Math.max(0, s.daysAgo - 2), 16, 30),
          },
        ]
      : [],
    reopen_history: s.reopened
      ? [
          {
            details: "Happened again on a different quiz, reopening.",
            attachments: [],
            reopened_at: isoDaysAgo(Math.max(0, s.daysAgo - 4), 11, 0),
            by: "user" as const,
          },
        ]
      : [],
    created_at: isoDaysAgo(s.daysAgo, 9, 15),
    updated_at: isoDaysAgo(Math.max(0, s.daysAgo - 1), 11, 0),
  };
}

/** Tickets the visitor filed this session, newest first. */
function visitorTickets(): Ticket[] {
  return overlay.get<Ticket[]>("tickets:filed", []);
}

/**
 * Field-level triage edits, keyed by ticket id.
 *
 * Kept as a patch rather than a copy of the whole row because the seed is
 * regenerated on every load so its dates stay relative to today (see
 * `lib/demo/clock.ts`). Storing a resolved ticket wholesale would freeze its
 * `created_at` at the moment the salesperson clicked Resolve, and a week later
 * the queue would show a ticket raised "7 days ago" that is really the one they
 * just touched. A patch layers the change over a seed that is still current.
 */
type TicketPatch = Partial<Ticket>;
const PATCH_KEY = "tickets:triage";

function triagePatches(): Record<string, TicketPatch> {
  return overlay.get<Record<string, TicketPatch>>(PATCH_KEY, {});
}

function withPatch(t: Ticket): Ticket {
  const patch = triagePatches()[String(t.id)];
  return patch ? { ...t, ...patch } : t;
}

/** Every ticket in the tenant, visitor-filed first, with triage edits applied. */
export function allTickets(): Ticket[] {
  return [...visitorTickets(), ...SEEDS.map(toTicket)].map(withPatch);
}

export function findTicket(id: number): Ticket {
  const found = allTickets().find((t) => t.id === id);
  if (!found) throw notFound("Ticket not found");
  return found;
}

/**
 * Persist a triage edit and return the row as it now reads.
 *
 * Every mutating ticket route goes through here so that the change survives the
 * redirect back to the queue. Returning the merged row without writing it was
 * the original bug: the detail page showed "Resolved", the list behind it still
 * said "Open", and the demo contradicted itself on screen.
 */
export function patchTicket(id: number, patch: TicketPatch): Ticket {
  const current = findTicket(id);
  const merged: TicketPatch = { ...patch, updated_at: iso(new Date(nowMs())) };
  overlay.update<Record<string, TicketPatch>>(PATCH_KEY, {}, (all) => ({
    ...all,
    [id]: { ...(all[id] ?? {}), ...merged },
  }));
  return { ...current, ...merged };
}

function mine(): Ticket[] {
  return allTickets().filter((t) => t.raised_by?.id === STUDENT_PERSONA.id);
}

type TicketRow = Ticket;

/**
 * Apply the filters the page sends.
 *
 * These were ignored, so every status tab rendered the same list — the page
 * looked like it had stale data when it was really being handed the same
 * unfiltered rows each time.
 */
function applyFilters(rows: TicketRow[], q: URLSearchParams): TicketRow[] {
  const status = q.get("status");
  const category = q.get("category");
  const search = (q.get("search") ?? "").trim().toLowerCase();
  const reopened = q.get("reopened");

  return rows.filter((t) => {
    if (status && t.status !== status) return false;
    if (category && t.category !== category) return false;
    if (reopened === "true" && !t.reopened_at) return false;
    if (
      search &&
      !t.subject.toLowerCase().includes(search) &&
      !t.description.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });
}

function page(rows: TicketRow[], req: { query: URLSearchParams }) {
  const filtered = applyFilters(rows, req.query);
  const p = Number(req.query.get("page") ?? 1);
  const limit = Number(req.query.get("limit") ?? 20);
  const start = (p - 1) * limit;
  return { count: filtered.length, page: p, limit, results: filtered.slice(start, start + limit) };
}

defineRoutes(MODULE, {
  /** `{ count, page, limit, results }` — the page reads `.results`. */
  "GET /api/clients/:clientId/tickets/my/": (req) => page(mine(), req),

  /** Instructor queue is a bare array, not an envelope. Deliberately different. */
  "GET /api/clients/:clientId/tickets/instructor/": (req) =>
    applyFilters(
      allTickets().filter((t) => t.assigned_to_user?.id === INSTRUCTOR_PERSONA.id),
      req.query,
    ),

  "GET /api/clients/:clientId/tickets/admin/": (req) => {
    const rows = allTickets();
    return {
      // Counts are of the WHOLE queue, deliberately: they are the tab badges, so
      // filtering them by the active tab would make every badge read its own
      // count and the others zero.
      ...page(rows, req),
      open_count: rows.filter((t) => t.status === "OPEN").length,
      in_progress_count: rows.filter((t) => t.status === "IN_PROGRESS").length,
      resolved_count: rows.filter((t) => t.status === "RESOLVED").length,
    };
  },

  "GET /api/clients/:clientId/tickets/:ticketId/": (req) =>
    findTicket(Number(req.params.ticketId)),

  "POST /api/clients/:clientId/tickets/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const category = (String(body.category ?? "other") as Category) ?? "other";
    const ticket = {
      ...toTicket({
        id: nextDemoId("ticket"),
        category,
        subject: String(body.subject ?? "New request"),
        description: String(body.description ?? ""),
        status: "OPEN",
        by: STUDENT_PERSONA,
        daysAgo: 0,
      }),
      created_at: iso(new Date(nowMs())),
      updated_at: iso(new Date(nowMs())),
    };
    overlay.unshift("tickets:filed", ticket);
    return ticket;
  },

  /**
   * Generic update. Only status is editable from the UI today, and it is written
   * through the overlay: returning a merged row without persisting it left the
   * queue showing the old status the moment the page reloaded.
   */
  "PATCH /api/clients/:clientId/tickets/:ticketId/": (req) => {
    const found = findTicket(Number(req.params.ticketId));
    const status = String(req.body?.status ?? found.status) as Status;
    return patchTicket(found.id, {
      status,
      status_display: STATUS_LABEL[status] ?? found.status_display,
    });
  },
});
