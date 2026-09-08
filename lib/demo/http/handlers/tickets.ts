/**
 * Support tickets, for all three roles.
 *
 * Written against the real `Ticket` shape rather than an approximation of it.
 * The earlier version returned a bare array of loosely-shaped objects, and the
 * aspirant ticket page read `data.results` off it and took the page down. Worth
 * stating as a rule: for this demo a handler with the WRONG shape is worse than
 * no handler at all, because a missing one degrades to an empty state and a
 * wrong one crashes the route.
 *
 * Statuses are the API's uppercase enum (OPEN / IN_PROGRESS / RESOLVED), and the
 * queue carries a genuine spread (three of each) so the triage columns are not
 * all one colour.
 *
 * WHAT THE QUEUE CONTAINS. This is a state skilling and employment mission, so
 * the tickets are the ones a mission help desk actually receives: a recording
 * that will not play on a low-end handset, a name misspelt on a certificate, a
 * category certificate that will not upload, a trainee who cannot reach her
 * centre on practical day, a bank that returned a loan file, a mock test that
 * froze mid-paper, and an aspirant asking to change the exam track she enrolled
 * in. Nothing here is a bootcamp support ticket about a code editor.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  ADMIN_PERSONA,
  FACULTY,
  INSTRUCTOR_PERSONA,
  STUDENTS,
  STUDENT_PERSONA,
  type DemoPerson,
} from "../../db/people";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import type {
  ResolutionHistoryEntry,
  Ticket,
  TicketCategory,
  TicketStatus,
} from "@/lib/services/ticket.service";

const MODULE = "tickets";

// Aliased to the service's own unions rather than retyped here: the seed and the
// consumer then cannot drift, and `toTicket` is checked against the real `Ticket`.
type Status = TicketStatus;
type Category = TicketCategory;

/**
 * The mission's own six categories, laid over the six category SLUGS the API
 * ships with.
 *
 * `TicketCategory` is a fixed union exported by `lib/services/ticket.service.ts`,
 * and `TICKET_CATEGORY_OPTIONS` in that same file is what fills the category
 * dropdown in the Report Issue dialog and the admin filter. Neither is ours to
 * edit, and the transport contract says exported symbols do not move, so the
 * slugs stay as they are and only what a ticket DISPLAYS changes:
 *
 *   slug          mission category
 *   technical  →  Technical
 *   content    →  Course content
 *   video      →  Certificate
 *   quiz       →  Enrolment
 *   navigation →  Skill centre
 *   other      →  Scheme and other requests
 *
 * Three of those pairings (video, quiz, navigation) are arbitrary: there is no
 * mission meaning to "video" or "navigation", so the leftover categories were
 * placed on the leftover slugs. `other` deliberately keeps a catch-all reading
 * in its label, because it is also the fallback the POST route uses when a
 * ticket arrives with no category at all.
 *
 * Until someone re-contents `TICKET_CATEGORY_OPTIONS`, the two dropdowns still
 * read "Video Help", "Quiz/Assessment Help" and "Navigation Help" while the
 * rows they filter read "Certificate", "Enrolment" and "Skill centre". That is
 * the one visible seam, and it closes in that file, not this one.
 */
const CATEGORY_LABEL: Record<Category, string> = {
  technical: "Technical",
  content: "Course content",
  video: "Certificate",
  quiz: "Enrolment",
  navigation: "Skill centre",
  other: "Scheme and other requests",
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

/**
 * The batches a ticket can belong to.
 *
 * `cohort_name` is a column in the admin queue and a chip on the ticket detail
 * page, so it is per-seed rather than one constant on every row: a solar trainee
 * at Nizamabad filed under a Group-II batch is the kind of detail an evaluator
 * notices. A candidate who has not been placed in a batch yet carries `null`,
 * which the `Ticket` type documents and the queue renders as a dash.
 *
 * The ids match the cohort ids the admin, instructor and cohort-detail handlers
 * use, so a ticket and a batch page never disagree about which batch id 11 is.
 */
const BATCHES: Record<number, string> = {
  11: "Group-II Foundation 2026, Warangal centre",
  12: "Solar PV Installer Batch 7, Nizamabad centre",
  13: "Micro-Enterprise Batch 4, Khammam centre",
};

interface Seed {
  id: number;
  category: Category;
  subject: string;
  description: string;
  status: Status;
  by: DemoPerson;
  assigned?: DemoPerson;
  /** Batch id from `BATCHES`, or omitted for someone not yet in a batch. */
  cohort?: number;
  /** Days before today the ticket was raised. Also drives every other stamp. */
  daysAgo: number;
  /** The resolution showing now. Only read when `status` is RESOLVED. */
  resolution?: string;
  /**
   * A resolution the raiser did not accept, and what they said when they
   * reopened. Present only on a ticket that has been round the loop once, and
   * it is what the `reopened` filter and the reopened chip select on.
   */
  reopen?: { priorResolution: string; details: string };
}

/**
 * Ids descend with age, so the newest ticket carries the highest number. Nothing
 * reads them, but a queue where the ordering of the id column contradicts the
 * ordering of the date column looks like two unrelated datasets.
 */
const SEEDS: Seed[] = [
  {
    id: 4840,
    category: "quiz",
    subject: "Request to move from the Group-II track to SSC CGL",
    description:
      "I enrolled on the Group-II and Group-III foundation track when this batch started and I have kept up with it. I now want to prepare for SSC CGL alongside it, and the two timetables clash on Tuesday and Thursday. Can my enrolment be moved to the SSC track without losing the progress I already have?",
    status: "OPEN",
    by: STUDENT_PERSONA,
    cohort: 11,
    daysAgo: 0,
  },
  {
    id: 4831,
    category: "content",
    subject: "Answer key marks two different options in the Telangana movement set",
    description:
      "In the practice set on the Telangana movement, question 14 accepts only the second option, but the explanation printed under it argues for the fourth. One of the two is wrong and I would like to know which before I revise from these notes.",
    status: "OPEN",
    by: STUDENTS[3],
    assigned: INSTRUCTOR_PERSONA,
    cohort: 11,
    daysAgo: 1,
  },
  {
    id: 4826,
    category: "video",
    subject: "Category certificate upload fails every time",
    description:
      "I have tried uploading my category certificate six times, twice from the centre computer and four times from my phone. The page shows the file name, then comes back to the same screen with no message, and the document list stays empty. The scan is two pages and a little under 3 MB.",
    status: "OPEN",
    by: STUDENTS[19],
    daysAgo: 2,
  },
  {
    id: 4821,
    category: "technical",
    subject: "Recorded class will not play on my phone",
    description:
      "The recording of last week's polity class plays for a few seconds and then stops on a black screen. It plays properly on the centre computer, so it may be my handset, which is an older Android with 2 GB of memory. Is there a lower quality option, or a download I can watch offline?",
    status: "IN_PROGRESS",
    by: STUDENT_PERSONA,
    assigned: ADMIN_PERSONA,
    cohort: 11,
    daysAgo: 3,
  },
  {
    id: 4818,
    category: "navigation",
    subject: "Cannot reach the Nizamabad centre on practical day, asking for a batch transfer",
    description:
      "The practicals are on Wednesday and the first bus from my mandal reaches Nizamabad after eleven, so I miss the first hour every week. If there is a Saturday batch at the same centre, or any batch at Armoor, please move me to it. I do not want to lose the practical hours before the assessment.",
    status: "IN_PROGRESS",
    by: STUDENTS[4],
    assigned: ADMIN_PERSONA,
    cohort: 12,
    daysAgo: 4,
  },
  {
    id: 4812,
    category: "other",
    subject: "Bank returned my MUDRA file, the project report was not accepted",
    description:
      "The branch has sent my application back saying the project report does not show working capital separately from the machinery cost, and that the repayment schedule does not match the production plan. I used the template from the finance module. Can the trainer go through the report with me before I submit it again?",
    status: "IN_PROGRESS",
    by: STUDENTS[25],
    assigned: FACULTY[3],
    cohort: 13,
    daysAgo: 5,
  },
  {
    id: 4805,
    category: "technical",
    subject: "Mock test froze at question 40 and the timer kept running",
    description:
      "The paper stopped responding at question 40 of the Group-II prelims mock. The clock carried on and I lost about eleven minutes before the screen came back. The attempt is on the board but the score is not what I would have finished with.",
    status: "RESOLVED",
    by: STUDENTS[11],
    assigned: ADMIN_PERSONA,
    cohort: 11,
    daysAgo: 7,
    resolution:
      "Reproduced on a slow connection. The paper fetches questions in blocks of twenty and gave no sign that it was waiting for the next block, while the clock kept counting. The clock now pauses while a block loads and the paper shows that it is fetching. Your attempt has been reset so you can take the paper again, and the earlier score has been removed from the board.",
  },
  {
    id: 4795,
    category: "content",
    subject: "Two Paper-III topics are missing from the Group-II plan",
    description:
      "The Group-II syllabus puts both the Telangana economy and the state's development programmes under Paper-III, but the plan only covers the economy topics. Nothing on the development programmes appears anywhere in the module list.",
    status: "RESOLVED",
    by: STUDENT_PERSONA,
    assigned: INSTRUCTOR_PERSONA,
    cohort: 11,
    daysAgo: 9,
    reopen: {
      priorResolution:
        "You are right, the development programmes unit was written but never attached to the module. It is now the last unit of Paper-III and is unlocked for everyone already on the plan.",
      details:
        "The unit is listed now and the four articles open, but the quiz at the end of it loads with no questions in it.",
    },
    resolution:
      "The unit was attached without its question set, which is why the quiz opened empty. Thirty questions are now loaded against it and the quiz has been checked end to end. Nothing you have already completed on Paper-III was affected.",
  },
  {
    id: 4788,
    category: "video",
    subject: "Surname spelt Machela on my certificate instead of Macherla",
    description:
      "The certificate issued at the end of the foundation course at the Warangal centre reads Sandhya Machela. My name is spelt Macherla on my identity documents and on my application. Can it be corrected before I attach it to a recruitment application?",
    status: "RESOLVED",
    by: STUDENT_PERSONA,
    assigned: ADMIN_PERSONA,
    cohort: 11,
    daysAgo: 12,
    resolution:
      "Corrected on your profile and the certificate has been reissued against the same verification number, so any link you have already shared now opens the corrected copy. The certificate takes the name from your profile, so please check the spelling there once before your next course completes.",
  },
];

/**
 * Every timestamp on a ticket, derived from the single `daysAgo` the seed
 * carries so the whole queue ages together and never goes stale.
 *
 * A reopened ticket needs four points in order (raised, resolved, reopened,
 * resolved again). They used to be computed inline as `daysAgo - 2` and
 * `daysAgo - 4`, which put the current resolution two days BEFORE the reopen it
 * was written in answer to, so the thread told its story backwards.
 */
function timeline(s: Seed) {
  const back = (days: number, hour: number, minute: number) =>
    isoDaysAgo(Math.max(0, days), hour, minute);
  const created = back(s.daysAgo, 9, 15);
  const assigned = s.assigned ? back(s.daysAgo, 10, 0) : null;
  const priorResolved = s.reopen ? back(s.daysAgo - 2, 16, 30) : null;
  const reopened = s.reopen ? back(s.daysAgo - 4, 11, 0) : null;
  const resolved =
    s.status === "RESOLVED" ? back(s.daysAgo - (s.reopen ? 6 : 2), 16, 30) : null;
  // Whatever happened last. Read as "last updated" in the aspirant's own list,
  // which used to show a ticket updated a day BEFORE it was resolved.
  const updated = resolved ?? reopened ?? assigned ?? created;
  return { created, assigned, priorResolved, reopened, resolved, updated };
}

function toTicket(s: Seed): Ticket {
  const t = timeline(s);
  const resolved = s.status === "RESOLVED";
  /**
   * PAST resolutions only, which is what the field's type says and what
   * `TicketThread` assumes: it renders every history entry as "Response #n" and
   * then renders `admin_resolution_notes` again underneath as "Latest response".
   * The seed used to put the current resolution in both, so every resolved
   * ticket printed the same paragraph twice with a gap between the copies.
   */
  const history: ResolutionHistoryEntry[] = s.reopen
    ? [
        {
          notes: s.reopen.priorResolution,
          attachments: [],
          resolved_by_id: s.assigned?.id ?? null,
          resolved_by_name: s.assigned?.full_name ?? null,
          resolved_by_email: s.assigned?.email ?? null,
          resolved_at: t.priorResolved,
        },
      ]
    : [];

  return {
    id: s.id,
    category: s.category,
    category_display: CATEGORY_LABEL[s.category],
    subject: s.subject,
    description: s.description,
    status: s.status,
    status_display: STATUS_LABEL[s.status],
    // Attachments stay empty on purpose. The shape is a list of URLs and the
    // list component fetches image URLs on render and opens everything else in a
    // new tab, so a made-up file path would either show a broken thumbnail or
    // send an evaluator to a 404. There is no bundled placeholder file to point
    // at, and the demo has to run offline.
    user_attachments: [],
    admin_resolution_notes: resolved ? (s.resolution ?? "") : "",
    admin_attachments: [],
    course_id: null,
    content_id: null,
    page_url: "/dashboard",
    raised_by: userMini(s.by),
    resolved_by_user: resolved && s.assigned ? userMini(s.assigned) : null,
    cohort: s.cohort ?? null,
    cohort_name: s.cohort ? BATCHES[s.cohort] : null,
    assigned_to_user: s.assigned ? userMini(s.assigned) : null,
    // null assigner with an assignee means the system auto-routed it, which is
    // the real product's convention and worth showing in the triage column.
    assigned_by_user: s.assigned ? userMini(ADMIN_PERSONA) : null,
    assigned_at: t.assigned,
    resolved_at: t.resolved,
    reopened_at: t.reopened,
    resolution_history: history,
    reopen_history: s.reopen
      ? [
          {
            details: s.reopen.details,
            attachments: [],
            reopened_at: t.reopened as string,
            by: "user" as const,
          },
        ]
      : [],
    created_at: t.created,
    updated_at: t.updated,
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
 * `created_at` at the moment the visitor clicked Resolve, and a week later the
 * queue would show a ticket raised "7 days ago" that is really the one they just
 * touched. A patch layers the change over a seed that is still current.
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
 * These were ignored, so every status tab rendered the same list: the page
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
  /** `{ count, page, limit, results }`: the page reads `.results`. */
  "GET /api/clients/:clientId/tickets/my/": (req) => page(mine(), req),

  /** Faculty queue is a bare array, not an envelope. Deliberately different. */
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
    // `other` is the fallback rather than a guess at what the aspirant meant.
    // Its label reads "Scheme and other requests" for exactly this reason.
    const category = (String(body.category ?? "other") as Category) ?? "other";
    const ticket = {
      ...toTicket({
        id: nextDemoId("ticket"),
        category,
        subject: String(body.subject ?? "New request"),
        description: String(body.description ?? ""),
        status: "OPEN",
        by: STUDENT_PERSONA,
        cohort: 11,
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
