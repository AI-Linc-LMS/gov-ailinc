/**
 * The programme officer's surface.
 *
 * The insights pages are the ones that decide this: an officer is buying
 * visibility into batches running at centres they cannot visit every week. So
 * every tile carries its `definition` string, exactly as the real API does.
 * These numbers end up in a review meeting and in a district report, and a
 * figure whose page cannot say what it counted gets read with whichever meaning
 * is most flattering.
 *
 * At-risk aspirants carry the RULES that flagged them, not just a red badge.
 * The rules are written as things an officer can act on the same day: nobody
 * can act on "at risk", but a centre in-charge can act on "missed the last two
 * classes" or "documents pending verification".
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  FACULTY,
  INSTRUCTOR_PERSONA,
  STUDENTS,
  STUDENT_PERSONA,
  rankedLearners,
  type DemoPerson,
} from "../../db/people";
import { COURSES } from "../../db/courses";
import { allJobs, toAdminJob } from "../../db/jobs";
import { applyRoster, enrollmentJobs, isRosterActive } from "./account-actions";
import { adaptiveCourseList, legacyAdminCourseList } from "./course-builder";
import { overlay } from "../../db/overlay";
import { DEMO_TENANT } from "../../config";
import { overallProgress } from "../../db/learner";
import { iso, isoDaysAgo, nowMs, ymd, ymdDaysAgo, ymdDaysAhead, daysAgo } from "../../clock";
import { seededInt, seededPick, seededBool } from "../../random";

const MODULE = "admin";

/** Every aspirant and trainee on the tenant. */
function allStudents(): DemoPerson[] {
  return [STUDENT_PERSONA, ...STUDENTS];
}

/**
 * The teaching staff, in one order, and the staff code the mission issues.
 *
 * The code used to be minted here as `MIT-…`, a prefix inherited from the
 * fictional institute this build was forked from, while the faculty dashboard
 * printed a hand-written `MIT-VM-04` and a batch's staff card printed a third
 * variant. Three codes for one person reads as three records. It is derived
 * from this list, in this file, and every surface that shows a code calls
 * `facultyCode`.
 */
const TEACHING_STAFF: readonly DemoPerson[] = [INSTRUCTOR_PERSONA, ...FACULTY];

export function facultyCode(profileId: number): string {
  const index = TEACHING_STAFF.findIndex((p) => p.id === profileId);
  // Someone not on the teaching roster (an applicant, or a person promoted this
  // session) still needs a stable code, so it falls back to their id.
  const serial = index >= 0 ? index + 1 : profileId % 1000;
  return `TSEM/FAC/${String(serial).padStart(3, "0")}`;
}

/**
 * The members of a batch, drawn deterministically from the roster.
 *
 * The roster is smaller than the batches put together, so batches overlap. What
 * matters is that a batch that says 24 members really lists 24 people: the
 * previous version sliced a fixed window and ran off the end of the roster, so
 * the completed batch claimed 24 members and opened onto a list of five. The
 * signed-in aspirant sits in batch 11, which is the batch her dashboard names.
 */
export function batchMembers(cohortId: number, size: number): DemoPerson[] {
  const start = Math.abs((cohortId - 11) * 9) % STUDENTS.length;
  const rotated = [...STUDENTS.slice(start), ...STUDENTS.slice(0, start)];
  const members = cohortId === 11 ? [STUDENT_PERSONA, ...rotated] : rotated;
  return members.slice(0, Math.min(size, members.length));
}

/**
 * Syllabus covered, as a percentage, stable per person.
 *
 * The signed-in aspirant's figure is not a literal. It is the same
 * `overallProgress()` her own dashboard ring shows, so this table, the faculty
 * gradebook and her dashboard cannot print three different numbers for one
 * person. Everyone else is seeded, because the seed holds no per-person
 * progress record to derive from.
 *
 * Exported, and read by the faculty workspace and every drill-down, because it
 * is the one figure a programme officer quotes down a phone line. Each surface
 * used to seed it under its own key, so a trainee the officer's table put at 21%
 * was at 63% in the gradebook the centre in-charge was reading from.
 */
export function syllabusCovered(p: DemoPerson): number {
  return p.id === STUDENT_PERSONA.id ? overallProgress() : seededInt(`aprog:${p.id}`, 4, 98);
}

const RANGES: Record<string, { label: string; days: number; grain: "day" | "week" | "month" }> = {
  "7d": { label: "Last 7 days", days: 7, grain: "day" },
  "30d": { label: "Last 30 days", days: 30, grain: "day" },
  "60d": { label: "Last 60 days", days: 60, grain: "week" },
  "90d": { label: "Last 90 days", days: 90, grain: "week" },
  "6m": { label: "Last 6 months", days: 180, grain: "month" },
  "12m": { label: "Last 12 months", days: 365, grain: "month" },
};

function resolveRange(key: string | null) {
  const r = RANGES[key ?? "30d"] ?? RANGES["30d"];
  return {
    key: key ?? "30d",
    label: r.label,
    grain: r.grain,
    days: r.days,
    start: isoDaysAgo(r.days),
    end: iso(new Date(nowMs())),
  };
}

const SCOPE = { course_id: null, label: "All courses" };

const DAY_PLURAL: Record<string, string> = {
  Mon: "Mondays",
  Tue: "Tuesdays",
  Wed: "Wednesdays",
  Thu: "Thursdays",
  Fri: "Fridays",
  Sat: "Saturdays",
  Sun: "Sundays",
};

/** A 0-23 hour as the tenant reads a clock. 19 becomes "7 PM". */
function clockLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function deltaTile(value: number, previous: number, definition: string, extra: Record<string, number> = {}) {
  const diff = value - previous;
  return {
    value,
    previous,
    diff,
    pct: previous === 0 ? null : Math.round((diff / previous) * 1000) / 10,
    definition,
    ...extra,
  };
}

/**
 * Aspirants flagged at risk, with the rule that flagged each one.
 *
 * Severity and rules are derived from the same progress and streak values the
 * faculty workspace reads, so the two never disagree about who is struggling.
 *
 * Every rule is one a programme officer can act on the same day: ring the
 * centre, ask the in-charge to follow up at home, or send the pending papers to
 * the district office. A rule an officer cannot act on is a badge, not a rule.
 */
export const AT_RISK_RULES = {
  low_progress: "Under a quarter of the syllabus covered",
  inactive: "No activity for a week",
  missed_classes: "Missed the last two classes at the centre",
  mock_declining: "Mock test score fell across the last three attempts",
  documents_pending: "Enrolment documents pending verification",
} as const;

/**
 * Which rules an aspirant trips, in one function.
 *
 * Exported because the faculty workspace flags the same people on the same
 * screens the officer reads, and a trainee whose centre is told "missed the last
 * two classes" while the district report says "documents pending" is two records
 * as far as anyone acting on either is concerned. Progress is passed in rather
 * than recomputed so the caller's figure and the rule agree.
 */
export function atRiskReasons(p: DemoPerson, progress: number): string[] {
  const rules: string[] = [];
  if (progress < 25) rules.push(AT_RISK_RULES.low_progress);
  if (p.streak === 0) rules.push(AT_RISK_RULES.inactive);
  if (seededBool(`risk:missed:${p.id}`, 0.18)) rules.push(AT_RISK_RULES.missed_classes);
  if (seededBool(`risk:mock:${p.id}`, 0.12)) rules.push(AT_RISK_RULES.mock_declining);
  if (seededBool(`risk:docs:${p.id}`, 0.08)) rules.push(AT_RISK_RULES.documents_pending);
  return rules;
}

function atRiskRows() {
  return allStudents()
    .map((p) => {
      const progress = syllabusCovered(p);
      const rules = atRiskReasons(p, progress);
      if (rules.length === 0) return null;
      return {
        student_id: p.id,
        name: p.full_name,
        email: p.email,
        rules,
        reason: rules.join("; "),
        severity: rules.length,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.severity - a.severity);
}

/**
 * Every batch the mission runs, and the only list of them.
 *
 * Named the way a mission names a batch: the notification or trade it prepares
 * for, the centre and district running it, and the intake. A batch called
 * "Autumn 2026" cannot be placed on a district report; "Solar PV Batch S-12,
 * Warangal centre" can.
 *
 * Batches 11 and 12 are the two exam batches the schedule in `live-sessions.ts`
 * names, and 21 to 23 are its three skill centre batches. The names are copied
 * from there rather than written again, because one batch carrying two names on
 * two screens is read as two batches, and a district report cannot reconcile
 * them afterwards.
 *
 * `size` is how many people are actually enrolled and `capacity` how many seats
 * the centre sanctioned, so a fill percentage is a real division rather than an
 * assertion. `leadId` is the faculty member answerable for the batch, which is
 * not always the person who takes a given class in it.
 *
 * Exported because `instructor.ts` (which sees only the exam batches its faculty
 * member leads) and `details.ts` (which opens one) have to read these rows and
 * not their own copies.
 */
export const COHORTS = [
  {
    id: 11,
    name: "TGPSC Group-II Batch 2026, Warangal",
    courseIds: [302],
    leadId: INSTRUCTOR_PERSONA.id,
    centre: "Warangal centre",
    district: "Warangal",
    intake: "January intake",
    status: "active",
    size: 28,
    capacity: 35,
  },
  {
    id: 12,
    name: "Banking Batch B-07, Hyderabad",
    courseIds: [307],
    leadId: INSTRUCTOR_PERSONA.id,
    centre: "Hyderabad centre",
    district: "Hyderabad",
    intake: "February intake",
    status: "active",
    size: 22,
    capacity: 30,
  },
  {
    id: 13,
    name: "TGPSC Group-II Batch 2025, Warangal",
    courseIds: [302],
    leadId: INSTRUCTOR_PERSONA.id,
    centre: "Warangal centre",
    district: "Warangal",
    intake: "July intake",
    status: "completed",
    size: 24,
    capacity: 30,
  },
  {
    id: 21,
    name: "Solar PV Batch S-12, Warangal centre",
    courseIds: [311],
    leadId: FACULTY[2].id,
    centre: "Warangal centre",
    district: "Warangal",
    intake: "rolling intake",
    status: "active",
    size: 26,
    capacity: 30,
  },
  {
    id: 22,
    name: "Enterprise Batch E-04, Khammam centre",
    courseIds: [316, 317],
    leadId: FACULTY[3].id,
    centre: "Khammam centre",
    district: "Khammam",
    intake: "March intake",
    status: "active",
    size: 28,
    capacity: 30,
  },
  {
    id: 23,
    name: "Digital Literacy Batch D-09, Suryapet centre",
    courseIds: [315],
    leadId: FACULTY[4].id,
    centre: "Suryapet centre",
    district: "Suryapet",
    intake: "rolling intake",
    status: "active",
    size: 24,
    capacity: 30,
  },
];

/**
 * The batch the signed-in aspirant sits in. `batchMembers` seats her in it, her
 * dashboard names it, and the faculty gradebook lists her under it.
 */
export const STUDENT_BATCH_ID = 11;

/**
 * The batch a person is counted under, found rather than assigned.
 *
 * This cell used to be a seeded pick over the batch names, so the table could
 * put an aspirant in a batch whose roster does not contain her, and the batch
 * page opened onto a list she was not on. Batches overlap in this seed, so the
 * first one holding her wins, which is also how a mission reports someone who
 * attends two.
 */
function batchOf(p: DemoPerson): string {
  const hit = COHORTS.find((c) => batchMembers(c.id, c.size).some((m) => m.id === p.id));
  return hit ? hit.name : "Not in a batch";
}

/**
 * Who takes which class, mirrored from `live-sessions.ts`.
 *
 * That module owns the schedule and exports nothing, so the ids and titles are
 * repeated here, in one place, and read from here by every surface in this
 * build that names a class. Rename a session there and it is renamed here in
 * the same commit. The row this replaced handed every session to whoever sat
 * first in the staff list and called it "Live doubt-clearing: React rendering
 * and effects", a class that is on no timetable in this build.
 */
const STAFF_SESSIONS: Record<number, ReadonlyArray<{ id: number; title: string }>> = {
  [INSTRUCTOR_PERSONA.id]: [
    {
      id: 504,
      title: "Mock interview panel briefing: how the board scores you, and answering what you do not know",
    },
  ],
  [FACULTY[0].id]: [
    { id: 501, title: "Group-II polity: the amendment procedure, and how the paper asks it" },
    {
      id: 502,
      title: "Telangana movement doubt-clearing: Mulki rules, the Six Point Formula and GO 610",
    },
  ],
  [FACULTY[1].id]: [
    { id: 505, title: "IBPS Prelims speed drill: quantitative aptitude under sectional timing" },
  ],
  [FACULTY[2].id]: [
    {
      id: 503,
      title:
        "Solar PV practical: rooftop survey, string sizing and commissioning, live from the Warangal centre",
    },
  ],
  [FACULTY[3].id]: [
    {
      id: 506,
      title: "SHG credit linkage: building a proposal a branch will read, with a visiting bank officer",
    },
  ],
  [FACULTY[4].id]: [
    { id: 507, title: "Digital Seva counter: services, records and the end-of-day reconciliation" },
  ],
};

/** The title `live-sessions.ts` gives a class, so no other screen renames it. */
export function sessionTitle(id: number): string {
  for (const rows of Object.values(STAFF_SESSIONS)) {
    const hit = rows.find((s) => s.id === id);
    if (hit) return hit.title;
  }
  // Only the ids above are ever asked for. A miss is a programming error rather
  // than a content gap, so it says so instead of rendering an empty card.
  return `Class ${id}`;
}

/**
 * Everyone in the faculty directory, with the approval state each one is in.
 *
 * The teaching staff are approved. The two applicants and one rejection exist so
 * an officer can actually work the queue, approving someone, rejecting someone,
 * reopening a rejection, instead of looking at three tabs that all say the same
 * thing.
 */
type InstructorDecision = { status: "approved" | "rejected" | "pending"; reason: string | null };

/** Decisions the visitor made this session, keyed by profile id. */
function instructorDecisions(): Record<string, InstructorDecision> {
  return overlay.get<Record<string, InstructorDecision>>("instructors:decisions", {});
}

function decideInstructor(id: number, decision: InstructorDecision) {
  overlay.update<Record<string, InstructorDecision>>("instructors:decisions", {}, (current) => ({
    ...current,
    [String(id)]: decision,
  }));
}

function instructorDirectory() {
  const approved = TEACHING_STAFF.map((p, i) => ({
    person: p,
    pending_status: "approved" as const,
    daysAgo: 200 + i * 90,
    reviewedDaysAgo: 195 + i * 90,
    reason: null as string | null,
  }));

  // Applicants are not on the teaching roster: they have applied to take
  // classes at a centre but nobody has cleared them yet, so they own no courses
  // and teach no batches.
  const applicant = (id: number, fullName: string, email: string) => ({
    id,
    full_name: fullName,
    email,
    phone: `+91 ${seededInt(`appl:${id}:a`, 70000, 99999)}${seededInt(`appl:${id}:b`, 10000, 99999)}`,
  });

  const applicants = [
    {
      person: applicant(1201, "Ramesh Bathula", "ramesh.bathula@tsem.gov.in"),
      pending_status: "pending" as const,
      daysAgo: 4,
      reviewedDaysAgo: null,
      reason: null as string | null,
    },
    {
      person: applicant(1202, "Jyothi Peddineni", "jyothi.peddineni@tsem.gov.in"),
      pending_status: "pending" as const,
      daysAgo: 9,
      reviewedDaysAgo: null,
      reason: null as string | null,
    },
    {
      person: applicant(1203, "Karthik Vasala", "karthik.vasala@tsem.gov.in"),
      pending_status: "rejected" as const,
      daysAgo: 26,
      reviewedDaysAgo: 21,
      reason:
        "Trade certificate and centre in-charge endorsement not attached. Invited to reapply with both, and with the ITI experience letter.",
    },
  ];

  const decisions = instructorDecisions();

  return [...approved, ...applicants].map((r) => {
    // A decision the visitor made this session wins over the seed, so approving
    // someone actually moves them out of Pending and into Approved.
    const decided = decisions[String(r.person.id)];
    const status = decided?.status ?? r.pending_status;
    const reason = decided ? decided.reason : r.reason;
    const reviewedDaysAgo = decided ? 0 : r.reviewedDaysAgo;

    return {
    id: r.person.id,
    email: r.person.email,
    full_name: r.person.full_name,
    phone_number: r.person.phone,
    created_at: isoDaysAgo(r.daysAgo),
    pending_status: status,
    pending_reviewed_at: reviewedDaysAgo == null ? null : isoDaysAgo(reviewedDaysAgo),
    pending_rejection_reason: reason,
    assigned_courses:
      status === "approved"
        ? COURSES.filter((c) => c.instructor.id === r.person.id).map((c) => ({ id: c.id, title: c.title }))
        : [],
    // Null everywhere on purpose. There is no PDF in this repo to serve, and the
    // table renders a dash for null, which is better than a CV link that 404s in front of
    // a prospect.
    instructor_cv_url: null,
    };
  });
}

/**
 * Email jobs, shared by the list and the detail drawer.
 *
 * `total_emails` / `successful_count` / `failed_count` are the names the card
 * reads; a job whose counts are absent renders a card with no numbers on it.
 */
interface EmailJobSeed {
  taskId: string;
  subject: string;
  taskName: string;
  // "sending" not "in_progress": the card prints the raw value with a CSS
  // capitalize, so an underscored enum renders as "In_progress" on screen.
  status: "completed" | "failed" | "sending";
  daysAgo: number;
  recipients: number;
  failed: number;
  assessmentId?: number;
  assessmentTitle?: string;
  body: string;
}

const EMAIL_JOBS: EmailJobSeed[] = [
  {
    taskId: "eml-9f21c4",
    subject: `Your week 7 progress at ${DEMO_TENANT.shortName}`,
    taskName: "Weekly progress digest",
    status: "completed",
    daysAgo: 6,
    recipients: 45,
    failed: 0,
    body: "A short summary of what you finished this week, what is still open, and the one thing worth picking up next.",
  },
  {
    taskId: "eml-3b77ea",
    subject: "Placement drive: Suryatej Renewables at the Warangal centre on Thursday",
    taskName: "Placement announcement",
    status: "completed",
    daysAgo: 11,
    recipients: 45,
    failed: 0,
    body:
      "Suryatej Renewables is recruiting rooftop solar technicians from the district skill centres. " +
      "Carry your trade certificate and one photograph. Applications close Tuesday, and the shortlist " +
      "is put up at the centre the same evening.",
  },
  {
    taskId: "eml-77a0d1",
    subject: "Reminder: the mid-programme test window closes Friday",
    taskName: "Deadline reminder",
    status: "sending",
    daysAgo: 0,
    recipients: 28,
    failed: 0,
    body:
      "The window closes at 6:00 PM on Friday. If your connection at home is unreliable, sit the test " +
      "at your centre: the lab is open from 10:00 AM.",
  },
  {
    taskId: "eml-51c9b8",
    subject: "Certificate ready: Solar PV Installer & Rooftop Technician",
    taskName: "Certificate issued",
    status: "failed",
    daysAgo: 19,
    recipients: 24,
    failed: 3,
    body: "Your certificate is ready to download and share. The verification link stays live permanently.",
  },
];

/**
 * The mid-programme test, and what one aspirant scored on it.
 *
 * Paper 901 is the paper the faculty gradebook lists, the invitation and result
 * emails below announce, the learning journey drill-down opens onto and the
 * aspirant's own scorecard reports. Four screens, one sitting, so the record is
 * minted once here instead of being asserted on each of them: her scorecard read
 * 76 while an officer opening her journey read 90, for the same paper on the
 * same day.
 *
 * The signed-in aspirant's mark is authored, the way her streak and her points
 * are authored in the roster, because it is quoted in her achievements and in
 * her percentile. Everyone else is seeded, because the seed holds no per-person
 * result to derive from.
 */
export const MID_PROGRAMME_PAPER = {
  id: 901,
  title: "TGPSC Group-II: mid-programme test",
  totalMarks: 100,
  daysAgo: 18,
} as const;

export function midProgrammeScore(p: DemoPerson): number {
  return p.id === STUDENT_PERSONA.id ? 76 : seededInt(`as:${p.id}`, 48, 94);
}

const ASSESSMENT_EMAIL_JOBS: EmailJobSeed[] = [
  {
    taskId: "aeml-2d41f7",
    subject: "Mid-programme test opens Monday 10:00 AM",
    taskName: "Test invitation",
    status: "completed",
    daysAgo: 8,
    recipients: 28,
    failed: 0,
    assessmentId: MID_PROGRAMME_PAPER.id,
    assessmentTitle: MID_PROGRAMME_PAPER.title,
    body: "You have 90 minutes and one attempt. Run the device check before you start, it takes about a minute.",
  },
  {
    // Paper 903 is the IBPS PO prelims mock the faculty gradebook lists, and the
    // eighteen recipients are its eighteen submissions. This row used to name a
    // constable general studies test under the same id, so one paper had two
    // titles across two screens and neither screen could say which sitting the
    // eighteen results belonged to.
    taskId: "aeml-8c0e35",
    subject: "Results published: IBPS PO Prelims full mock 3",
    taskName: "Result notification",
    status: "completed",
    daysAgo: 3,
    recipients: 18,
    failed: 0,
    assessmentId: 903,
    assessmentTitle: "IBPS PO Prelims: full mock 3",
    body:
      "Your sectional scores and the question by question breakdown are on your test page. " +
      "The sectional timing is the part to read first: a section left short of time costs more " +
      "than a wrong answer inside it.",
  },
  {
    taskId: "aeml-4a6b19",
    subject: "You have not started the mid-programme test yet",
    taskName: "Non-starter reminder",
    status: "failed",
    daysAgo: 5,
    recipients: 6,
    failed: 2,
    assessmentId: MID_PROGRAMME_PAPER.id,
    assessmentTitle: MID_PROGRAMME_PAPER.title,
    body: "The window closes Sunday at midnight. If something is stopping you, reply to this email or tell your centre in-charge.",
  },
];

function emailJob(s: EmailJobSeed) {
  return {
    id: Number(s.taskId.replace(/\D/g, "").slice(0, 6)),
    task_id: s.taskId,
    task_name: s.taskName,
    subject: s.subject,
    status: s.status,
    created_at: isoDaysAgo(s.daysAgo, 9, 0),
    total_emails: s.recipients,
    successful_count: s.recipients - s.failed,
    failed_count: s.failed,
    ...(s.assessmentId ? { assessment_id: s.assessmentId, assessment_title: s.assessmentTitle } : {}),
  };
}

export function emailJobDetail(taskId: string) {
  const s =
    [...EMAIL_JOBS, ...ASSESSMENT_EMAIL_JOBS].find((j) => j.taskId === taskId) ?? EMAIL_JOBS[0];
  const people = allStudents().slice(0, s.recipients);
  const recipient = (p: DemoPerson) => ({ name: p.full_name, email: p.email });
  // The failed ones come off the END of the list so they do not overlap the
  // successful ones. A person appearing in both columns is a visible lie.
  const failed = s.failed > 0 ? people.slice(-s.failed) : [];
  const succeeded = people.slice(0, people.length - failed.length);

  return {
    ...emailJob(s),
    emails: people.map(recipient),
    email_body: s.body,
    successful_emails: succeeded.map(recipient),
    failed_emails: failed.map(recipient),
    email_attachment_url: null,
    email_attachment_name: null,
    completed_at: s.status === "sending" ? null : isoDaysAgo(s.daysAgo, 9, 4),
  };
}

/**
 * Doubt categories, in the six labels `tickets.ts` actually issues.
 *
 * That module lays the mission's own categories over the six category slugs the
 * API declares, so a doubt filed under the `video` slug is shown to everyone as
 * "Certificate" and one under `navigation` as "Skill centre". This chart has to
 * use the same six words, because an officer reads it and then opens the queue
 * to work the rows it counts. It used to name four of the raw slugs instead
 * ("Course content", "Technical", "Navigation", "Quiz"), so two of the four
 * slices named a category no ticket in the queue is ever labelled with.
 *
 * The order and the relative weight follow the queue: technical faults and
 * course content are the two biggest, certificate uploads next, and scheme
 * requests the tail. The six values sum to the doubts opened in the range, which
 * is what the block below divides and subtracts rather than asserting again.
 */
const TICKET_CATEGORIES = [
  { label: "Technical", value: 13 },
  { label: "Course content", value: 12 },
  { label: "Certificate", value: 10 },
  { label: "Enrolment", value: 7 },
  { label: "Skill centre", value: 5 },
  { label: "Scheme and other requests", value: 4 },
];

defineRoutes(MODULE, {
  // ── Insights ────────────────────────────────────────────────────────────
  "GET /admin-dashboard/api/clients/:clientId/insights/pulse/": (req) => {
    const range = resolveRange(req.query.get("range"));
    const students = allStudents();
    const active = Math.round(students.length * 0.72);
    // Held in variables because the per-active-aspirant figure is a division of
    // the two, and it used to be the literal 14 sitting beside a seeded total
    // that could never divide to 14.
    const items = seededInt("pulse:items", 640, 980);
    const itemsPrevious = seededInt("pulse:itemsprev", 560, 900);

    const buckets = Math.min(range.grain === "day" ? range.days : 12, 30);
    return {
      scope: SCOPE,
      range,
      tiles: {
        active_students: deltaTile(
          active,
          active - 6,
          "Distinct aspirants with at least one recorded activity in the range.",
          { denominator: students.length },
        ),
        items_completed: deltaTile(
          items,
          itemsPrevious,
          "Syllabus topics, quizzes and assignments marked complete in the range.",
          { per_active_student: Math.round(items / Math.max(1, active)) },
        ),
        median_minutes: {
          value: 38,
          definition: "Median minutes per active aspirant per active day. Median, not mean, so one outlier cannot move it.",
          as_of: iso(new Date(nowMs())),
        },
        stale_tickets: {
          value: 3,
          definition: "Doubts open for more than 72 hours with no reply from faculty or the centre.",
          as_of: iso(new Date(nowMs())),
        },
      },
      trend: Array.from({ length: buckets }, (_, i) => ({
        bucket: ymd(daysAgo(buckets - 1 - i)),
        active_students: seededInt(`trend:a:${i}`, 12, 34),
        items_completed: seededInt(`trend:i:${i}`, 20, 70),
      })),
      freshness: {
        computed_at: iso(new Date(nowMs())),
        note: "Recomputed hourly. Activity at a centre in the last few minutes may not be counted yet.",
      },
    };
  },

  /**
   * `results`, not `rows`. The dashboard reads `atRisk?.results.length` with no
   * optional chaining past the first hop, so returning the wrong key does not
   * degrade: it takes the whole page down with "Cannot read properties of
   * undefined". `rules` is the legend the table renders beside the flags, and it
   * is the same object the rows are built from, so the legend cannot describe a
   * rule the list is not actually applying.
   */
  "GET /admin-dashboard/api/clients/:clientId/insights/at-risk/": (req) => {
    const limit = Number(req.query.get("limit") ?? 10);
    return {
      results: atRiskRows().slice(0, limit),
      rules: AT_RISK_RULES,
    };
  },

  "GET /admin-dashboard/api/clients/:clientId/insights/leaderboard/": () => ({
    scope: SCOPE,
    rows: rankedLearners()
      .slice(0, 20)
      .map((p, i) => ({
        rank: i + 1,
        student_id: p.id,
        name: p.full_name,
        email: p.email,
        profile_pic_url: p.profile_pic_url,
        points: p.points,
        activities: seededInt(`lbact:${p.id}`, 40, 260),
      })),
    total_ranked: allStudents().length,
    definition: "Ranked by total points earned across every module, all time.",
  }),

  // Wrapped in `results`: the service reads `res.data.results ?? []`, so a bare
  // array silently yields an empty course filter rather than an error.
  "GET /admin-dashboard/api/clients/:clientId/insights/courses/": () => ({
    results: COURSES.map((c) => ({ id: c.id, title: c.title, is_published: true })),
  }),

  "GET /admin-dashboard/api/clients/:clientId/insights/engagement/": (req) => {
    const range = resolveRange(req.query.get("range"));
    // "Assignments", not "Coding". There is no code judge in this product line
    // and no coding item anywhere in the catalogue, so a slice of the mix
    // labelled Coding is a share of nothing.
    const keys = ["Lessons", "Quizzes", "Assignments", "Live sessions"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const matrix = days.map((day) => ({
      day,
      hours: Array.from({ length: 24 }, (_, h) => {
        // Two peaks, because that is when these aspirants are free: an early
        // morning block before work or college, and the evening. The middle of
        // the day is the quietest stretch of the week for a mission whose
        // candidates are working, farming or sitting in a degree college.
        const weight =
          h >= 18 && h <= 22 ? 3 : h >= 5 && h <= 8 ? 2.4 : h >= 9 && h <= 17 ? 1.1 : 0.3;
        return Math.round(seededInt(`hm:${day}:${h}`, 0, 12) * weight);
      }),
    }));
    const flat = matrix.flatMap((r) => r.hours);
    const max = Math.max(...flat);
    // Found in the matrix, not asserted beside it. The label used to name a
    // fixed day and hour next to a count taken from the data, so the two agreed
    // only by luck, and the heatmap's brightest cell was somewhere else.
    const peakRow = matrix.find((r) => r.hours.includes(max)) ?? matrix[0];
    const peakHour = peakRow.hours.indexOf(max);

    return {
      scope: SCOPE,
      range,
      mix_over_time: {
        keys,
        series: Array.from({ length: 8 }, (_, i) => ({
          bucket: `W${i + 1}`,
          Lessons: seededInt(`mix:l:${i}`, 40, 120),
          Quizzes: seededInt(`mix:q:${i}`, 20, 80),
          Assignments: seededInt(`mix:c:${i}`, 15, 70),
          "Live sessions": seededInt(`mix:s:${i}`, 5, 30),
        })),
      },
      mix_total: (() => {
        const values = keys.map((label) => ({ label, value: seededInt(`mt:${label}`, 120, 620) }));
        const total = values.reduce((s, v) => s + v.value, 0);
        return values.map((v) => ({ ...v, pct: Math.round((v.value / total) * 100) }));
      })(),
      hour_matrix: {
        matrix,
        max,
        peak: {
          day: peakRow.day,
          hour: peakHour,
          count: max,
          label: `${DAY_PLURAL[peakRow.day] ?? peakRow.day}, ${clockLabel(peakHour)} to ${clockLabel(peakHour + 1)}`,
        },
        timezone: DEMO_TENANT.timezone,
      },
      consistency: (() => {
        // The bins are a partition of the roster, so the last one is the
        // remainder rather than a fourth independent number. A histogram whose
        // bars sum to something other than the population it names is the tile
        // an officer catches first.
        const total = allStudents().length;
        const head = [
          { label: "1-2 days", students: Math.round(total * 0.2) },
          { label: "3-5 days", students: Math.round(total * 0.31) },
          { label: "6-10 days", students: Math.round(total * 0.27) },
        ];
        const counted = head.reduce((sum, b) => sum + b.students, 0);
        return {
          bins: [...head, { label: "11+ days", students: total - counted }],
          median_active_days: 6,
          students: total,
          of_days: range.days,
          definition: "Aspirants grouped by how many separate days they were active in the range.",
        };
      })(),
    };
  },

  "GET /admin-dashboard/api/clients/:clientId/insights/learning/": (req) => ({
    range: resolveRange(req.query.get("range")),
    scope: SCOPE,
    courses: COURSES.map((c) => {
      const enrolled = c.enrolledCount;
      const started = Math.round(enrolled * (c.enrolled ? 0.82 : 0.34));
      return {
        course_id: c.id,
        title: c.title,
        is_published: true,
        enrolled,
        started,
        never_started: enrolled - started,
        nodes: c.modules.reduce((s, m) => s + m.topics.length, 0),
        completion_pct: c.completion,
        activation_pct: Math.round((started / Math.max(1, enrolled)) * 100),
      };
    }),
    dropoff: COURSES.flatMap((c) =>
      Array.from({ length: 6 }, (_, w) => ({
        course_id: c.id,
        week: w + 1,
        // Monotonically decreasing: a drop-off curve that rises is not a drop-off curve.
        students: Math.round(c.enrolledCount * Math.pow(0.87, w)),
      })),
    ),
    definitions: {
      activation: "Share of enrolled aspirants who completed at least one item.",
      completion: "Mean completion across enrolled aspirants, not across items.",
      dropoff: "Aspirants still active in each week since their enrolment.",
    },
  }),

  "GET /admin-dashboard/api/clients/:clientId/insights/people/": (req) => ({
    scope: SCOPE,
    course_scoped: false,
    range: resolveRange(req.query.get("range")),
    cohorts: COHORTS.map((c) => ({
      cohort_id: c.id,
      name: c.name,
      status: c.status,
      start_date: c.status === "completed" ? ymdDaysAgo(210) : ymdDaysAgo(120),
      end_date: c.status === "completed" ? ymdDaysAgo(40) : ymdDaysAhead(90),
      members: c.size,
      active: Math.round(c.size * 0.74),
      completed: c.status === "completed" ? c.size : Math.round(c.size * 0.12),
      capacity: c.capacity,
      fill_pct: Math.round((c.size / c.capacity) * 100),
    })),
    tickets: (() => {
      // Derived from the categories above instead of asserted alongside them.
      // The status split used to sum to 56 beside an "opened" of 51, so a doubt
      // existed on one row of the same card and not on the other. `in progress`
      // and the open remainder are the counts the doubts queue itself shows.
      const opened = TICKET_CATEGORIES.reduce((sum, c) => sum + c.value, 0);
      const resolved = 44;
      const inProgress = 3;
      return {
        opened,
        resolved,
        open_now: opened - resolved,
        median_resolution_hours: 19,
        by_category: TICKET_CATEGORIES,
        by_status: [
          { label: "Open", value: opened - resolved - inProgress },
          { label: "In progress", value: inProgress },
          { label: "Resolved", value: resolved },
        ],
        definitions: {
          median_resolution_hours: "Median hours from a doubt being raised to being marked resolved.",
          open_now: "Doubts not yet resolved, regardless of when they were raised.",
        },
      };
    })(),
    instructors: (() => {
      // All FOUR ratings, plus suppressed/min_responses/note.
      //
      // Omitting pace_rating and overall_rating crashed the whole admin
      // dashboard: RatingCell calls .toFixed() on the value with no guard, so a
      // missing field is a TypeError during render rather than a blank cell.
      // The type declares them nullable, null renders as "no data" and
      // undefined throws, so a field with no value must be explicitly null.
      const minResponses = 5;
      // The trainer who joined most recently has three responses. The card used
      // to print every staff member and then claim underneath that one was
      // hidden, which is a legend describing a rule the table is not applying.
      const all = TEACHING_STAFF.map((p, i) => ({
        instructor: p.full_name,
        instructor_profile_id: p.id,
        responses: i === TEACHING_STAFF.length - 1 ? 3 : seededInt(`ir:${p.id}`, 14, 62),
        instructor_rating: Number((4.1 + (i % 3) * 0.25).toFixed(1)),
        content_rating: Number((3.9 + (i % 4) * 0.2).toFixed(1)),
        pace_rating: Number((3.8 + (i % 3) * 0.3).toFixed(1)),
        overall_rating: Number((4.0 + (i % 4) * 0.22).toFixed(1)),
      }));
      const rows = all.filter((r) => r.responses >= minResponses);
      const suppressed = all.length - rows.length;
      return {
        rows,
        suppressed,
        min_responses: minResponses,
        note:
          suppressed === 1
            ? `One faculty member is hidden: fewer than ${minResponses} responses is too few to average fairly.`
            : `${suppressed} faculty members are hidden: fewer than ${minResponses} responses is too few to average fairly.`,
        definition:
          "Averages of end-of-class feedback from aspirants and trainees, counting only classes with at least five responses.",
      };
    })(),
  }),

  // ── People and content management ───────────────────────────────────────
  /**
   * Shape is `{ students, pagination, filters_applied }`, not `{ results, count }`.
   *
   * The page reads `data.students.length` directly, so the wrong envelope does
   * not render an empty table: it takes the page down. Worth stating plainly:
   * a handler returning the wrong shape is worse than no handler at all, since
   * a missing one degrades to an empty state and a wrong one crashes.
   */
  "GET /admin-dashboard/api/clients/:clientId/manage-students/": (req) => {
    const search = (req.query.get("search") ?? "").toLowerCase();
    const page = Number(req.query.get("page") ?? 1);
    const limit = Number(req.query.get("limit") ?? 25);
    // applyRoster, not the raw seed: an administrator who deletes a student, or
    // quick-enrols one, must see that in this table on the very next refresh.
    const rows = applyRoster(allStudents())
      .filter((p) => !search || p.full_name.toLowerCase().includes(search) || p.email.toLowerCase().includes(search))
      .map((p) => {
        const enrolled = seededInt(`ce:${p.id}`, 1, 3);
        return {
          id: p.id,
          user_id: p.id,
          name: p.full_name,
          full_name: p.full_name,
          first_name: p.first_name,
          last_name: p.last_name,
          username: p.user_name,
          email: p.email,
          phone_number: p.phone,
          profile_pic_url: p.profile_pic_url,
          college: p.college,
          is_active: isRosterActive(p.id),
          date_joined: isoDaysAgo(seededInt(`dj:${p.id}`, 20, 200)),
          last_login: isoDaysAgo(seededInt(`ll:${p.id}`, 0, 12)),
          progress: syllabusCovered(p),
          points: p.points,
          streak: p.streak,
          courses_enrolled: enrolled,
          cohort: batchOf(p),
          // The rest of the `Student` type. These render as blank cells and an
          // empty CSV column when omitted, which reads as a broken table rather
          // than an unused one.
          total_marks: p.points,
          most_active_course: seededPick(`mac:${p.id}`, COURSES.map((c) => c.title)),
          total_time_spent: { value: seededInt(`tts:${p.id}`, 6, 180), unit: "hours" },
          // Same record as the faculty gradebook's "last active" column and the
          // learning journey's `last_activity_date`, so one aspirant does not
          // read as four days idle on one screen and eleven on the next.
          last_activity_date: isoDaysAgo(seededInt(`ilast:${p.id}`, 0, 9)),
          current_streak: p.streak,
          streak_data: Array.from({ length: 7 }, (_, d) => seededBool(`sd:${p.id}:${d}`, 0.55)),
          enrollment_count: enrolled,
          has_saved_resume: true,
          assessment_submissions: seededInt(`sas:${p.id}`, 0, 4),
          // `coding` stays in the shape (the CSV export writes a column for it)
          // and stays at zero: this catalogue has no coding item in it, so any
          // other number is a count of something that does not exist.
          activity_summary: {
            total_activities: seededInt(`sact:${p.id}`, 30, 260),
            by_type: {
              article: seededInt(`sact:a:${p.id}`, 4, 60),
              quiz: seededInt(`sact:q:${p.id}`, 2, 40),
              coding: 0,
              assessment: seededInt(`sact:s:${p.id}`, 0, 6),
            },
          },
        };
      });

    const start = (page - 1) * limit;
    const paged = rows.slice(start, start + limit);
    return {
      students: paged,
      pagination: {
        current_page: page,
        total_pages: Math.max(1, Math.ceil(rows.length / limit)),
        total_students: rows.length,
        limit,
        has_next: start + limit < rows.length,
        has_previous: page > 1,
      },
      filters_applied: {
        search: search || undefined,
        sort_by: req.query.get("sort_by") ?? undefined,
      },
    };
  },

  // A bare array: EnrollmentJobHistory does `jobs.map(...)` on the response.
  // Empty until the visitor uploads a CSV, and never empty after: a job history
  // that forgets the upload it just accepted is the clearest possible signal
  // that nothing really happened.
  "GET /admin-dashboard/api/clients/:clientId/student-enrollment-jobs/": () => enrollmentJobs(),

  /** Per-course completion, shown as a column on the manage-students table. */
  "GET /admin-dashboard/api/clients/:clientId/course-completion-stats/": () =>
    COURSES.map((c) => ({
      course_id: c.id,
      course_title: c.title,
      enrolled: c.enrolledCount,
      completed: Math.round(c.enrolledCount * (c.completion / 100) * 0.4),
      in_progress: Math.round(c.enrolledCount * 0.5),
      not_started: Math.round(c.enrolledCount * 0.18),
      avg_completion: c.completion,
    })),

  /**
   * Both course lists come from the builder projection rather than straight off
   * the seed, so a course an admin creates is in the very next response. They
   * also carry the per-type counts (`quiz_count`, `article_count`, ...) that the
   * library header sums: those were absent, and summing an absent key printed
   * NaN across the whole stat row.
   */
  "GET /admin-dashboard/api/clients/:clientId/courses/": () => legacyAdminCourseList(),

  "GET /adaptive-quiz/api/admin/courses/": () => adaptiveCourseList(),

  // Bare array: the course list does `jobs.some(...)` to badge a course as generating.
  "GET /adaptive-quiz/api/admin/courses/jobs/": () => [],

  "GET /adaptive-quiz/api/admin/quizzes/": () =>
    COURSES.flatMap((c) =>
      c.modules.slice(0, 2).map((m) => ({
        id: m.id,
        title: `${m.title}: check your understanding`,
        course_id: c.id,
        course_title: c.title,
        question_count: seededInt(`aq:${m.id}`, 8, 20),
        attempts: seededInt(`aqa:${m.id}`, 12, 90),
        avg_score: seededInt(`aqs:${m.id}`, 52, 88),
        is_published: true,
        updated_at: isoDaysAgo(seededInt(`aqu:${m.id}`, 2, 30)),
      })),
    ),

  // A bare array: `listCohorts()` is typed `Promise<CohortListItem[]>` and the
  // page maps over the response directly, so an envelope crashes it.
  "GET /cohort/api/admin/cohorts/": () =>
    COHORTS.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      start_date: c.status === "completed" ? ymdDaysAgo(210) : ymdDaysAgo(120),
      end_date: c.status === "completed" ? ymdDaysAgo(40) : ymdDaysAhead(90),
      member_count: c.size,
      capacity: c.capacity,
      artifact_count: 1,
      created_at: isoDaysAgo(150),
    })),

  /**
   * The instructor directory, split by approval state.
   *
   * Two things were wrong here. The rows were named `name` / `phone` / `joined_at`
   * where `InstructorRow` declares `full_name` / `phone_number` / `created_at`, so
   * the table printed the email in the name column and dashes everywhere else. And
   * the `status` query parameter was ignored, so Pending, Approved and Rejected
   * each showed the same list, the same "stale data in every tab" the ticket page
   * had.
   */
  "GET /admin-dashboard/api/clients/:clientId/instructors/": (req) => {
    const status = req.query.get("status") ?? "pending";
    const rows = instructorDirectory();
    return status === "all" ? rows : rows.filter((r) => r.pending_status === status);
  },

  /**
   * The staff directory the live-class module reads: what each faculty member
   * owns, leads and takes classes for.
   *
   * Every column is derived. Courses come from the catalogue, batches from the
   * `leadId` on the batch itself, and classes from `STAFF_SESSIONS`, which
   * mirrors the schedule. The row this replaced minted an `MIT-` staff code from
   * a fictional institute that is not this tenant, gave every batch and every
   * class to whoever sat first in the list, and titled that class "Live
   * doubt-clearing: React rendering and effects".
   */
  "GET /instructor/api/admin/instructors/": () =>
    TEACHING_STAFF.map((p) => ({
      profile_id: p.id,
      name: p.full_name,
      email: p.email,
      instructor_code: facultyCode(p.id),
      courses: COURSES.filter((c) => c.instructor.id === p.id).map((c) => ({
        id: c.id,
        title: c.title,
        role: "owner",
      })),
      cohorts: COHORTS.filter((c) => c.leadId === p.id).map((c) => ({
        id: c.id,
        name: c.name,
        role: "lead",
      })),
      live_sessions: (STAFF_SESSIONS[p.id] ?? []).map((sn) => ({ id: sn.id, title: sn.title })),
    })),

  /**
   * The approval queue's actions. Without these the buttons were live but every
   * click failed, which is worse than a disabled button, because the prospect tries it.
   * Each writes to the overlay, so the row really does move tabs.
   */
  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/approve/": (req) => {
    const id = Number(req.params.profileId);
    decideInstructor(id, { status: "approved", reason: null });
    return {
      detail: "Approved. They can take classes and open rooms for the batches they are put on.",
      profile: instructorDirectory().find((r) => r.id === id),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/reject/": (req) => {
    const id = Number(req.params.profileId);
    const reason = String(req.body?.reason ?? "").trim() || null;
    decideInstructor(id, { status: "rejected", reason });
    return {
      detail: "Application rejected. They keep their learner account and can reapply.",
      profile: instructorDirectory().find((r) => r.id === id),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/reopen/": (req) => {
    const id = Number(req.params.profileId);
    decideInstructor(id, { status: "pending", reason: null });
    return {
      detail: "Application reopened and back in the pending queue.",
      profile: instructorDirectory().find((r) => r.id === id),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/assign-courses/": (req) => {
    const ids = Array.isArray(req.body?.course_ids) ? (req.body.course_ids as number[]) : [];
    return { detail: `Assigned ${ids.length} ${ids.length === 1 ? "course" : "courses"}.` };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/promote/": (req) => ({
    detail: `Promoted to ${String(req.body?.new_role ?? "admin").replace(/_/g, " ")}.`,
  }),

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/remove/": () => ({
    detail: "Removed from the teaching roster. Their own learner account is untouched.",
  }),

  /** `{ managed_courses, assigned_courses, all_scoped }`: the "view courses" dialog. */
  "GET /admin-dashboard/api/clients/:clientId/instructors/:profileId/courses/": (req) => {
    const id = Number(req.params.profileId);
    const owned = COURSES.filter((c) => c.instructor.id === id).map((c) => ({ id: c.id, title: c.title }));
    return {
      managed_courses: owned,
      assigned_courses: owned,
      all_scoped: COURSES.map((c) => ({ id: c.id, title: c.title })),
    };
  },

  "GET /admin-dashboard/api/clients/:clientId/pending-instructors/": () =>
    instructorDirectory().filter((r) => r.pending_status === "pending"),

  // ── Jobs, emails, tickets ───────────────────────────────────────────────
  // The assessment list and the composer's company catalogue moved to
  // `assessment-admin.ts`. They were literals here while the create, publish and
  // delete handlers lived there, so a paper an administrator created never
  // appeared in the list it was created from.

  /**
   * Sent mail, for both tabs of /admin/emails.
   *
   * These returned empty, so the module read as "nothing has ever been sent here",
   * which for a communications tool is indistinguishable from it not working.
   * The spread is deliberate: a completed send, one still going out, and one that
   * partly failed, because the failure card is the interesting one.
   */
  "GET /admin-dashboard/api/clients/:clientId/email-jobs/": () => EMAIL_JOBS.map(emailJob),

  "GET /admin-dashboard/api/clients/:clientId/assessment-email-jobs/list": () =>
    ASSESSMENT_EMAIL_JOBS.map(emailJob),

  "GET /admin-dashboard/api/clients/:clientId/assessment-email-jobs/:taskId": (req) =>
    emailJobDetail(String(req.params.taskId)),

  "POST /admin-dashboard/api/clients/:clientId/assessment-email-jobs/:taskId/retry/": (req) => ({
    task_id: String(req.params.taskId),
    status: "queued",
    message: "Retrying the failed recipients.",
  }),

  "POST /admin-dashboard/api/clients/:clientId/email-resend-jobs/:taskId/": (req) => ({
    task_id: String(req.params.taskId),
    status: "queued",
    message: "Resend queued.",
  }),

  /**
   * The admin mock-interview list is `{ interviews, pagination, filters_applied }`,
   * NOT a bare array. Returning an array crashed the live-sessions page with
   * "interviews is not iterable", because it destructures the key.
   */
  "GET /admin-dashboard/api/clients/:clientId/mock-interviews": (req) => interviewList(req),
  "GET /admin-dashboard/api/clients/:clientId/mock-interviews/": (req) => interviewList(req),

  /**
   * The dashboard is a DashboardResponse: overview, score/time statistics,
   * difficulty distribution, topic breakdown, daily trend, top performers and
   * recent interviews. The page reads `data.overview.total_interviews` with no
   * guard, so a partial payload takes it down rather than showing blank tiles.
   */
  "GET /admin-dashboard/api/clients/:clientId/mock-interviews/dashboard/": () => {
    const rows = adminMockInterviews();
    const completed = rows.filter((r) => r.status === "completed");
    const scores = completed.map((r) => r.score ?? 0).filter(Boolean).sort((a, b) => a - b);
    const median = scores.length ? scores[Math.floor(scores.length / 2)] : 0;

    return {
      overview: {
        total_interviews: rows.length,
        total_unique_students: rows.length,
        active_students_in_period: Math.round(rows.length * 0.7),
        completion_rate: Math.round((completed.length / Math.max(1, rows.length)) * 100),
        status_breakdown: {
          scheduled: rows.filter((r) => r.status === "scheduled").length,
          in_progress: 0,
          completed: completed.length,
          cancelled: 0,
        },
      },
      score_statistics: {
        average_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        highest_score: scores.length ? scores[scores.length - 1] : 0,
        lowest_score: scores.length ? scores[0] : 0,
        median_score: median,
        total_scored_interviews: scores.length,
      },
      time_statistics: {
        average_time_minutes: 27,
        total_time_spent_minutes: completed.length * 27,
        interviews_with_time_data: completed.length,
      },
      // Counted off the same rows the table below lists. These were three
      // literals that happened to total twelve, so a difficulty an officer
      // filtered by returned a different number of rows than the tile promised.
      difficulty_distribution: Object.fromEntries(
        ["Easy", "Medium", "Hard"].map((level) => {
          const inLevel = rows.filter((r) => r.difficulty === level);
          const done = inLevel.filter((r) => r.status === "completed");
          return [
            level,
            {
              total: inLevel.length,
              completed: done.length,
              average_score: done.length
                ? Math.round(done.reduce((a, b) => a + (b.score ?? 0), 0) / done.length)
                : 0,
            },
          ];
        }),
      ),
      topic_breakdown: INTERVIEW_BOARDS.map(({ topic }) => {
        const inTopic = rows.filter((r) => r.topic === topic);
        const done = inTopic.filter((r) => r.status === "completed");
        return {
          topic,
          total_interviews: inTopic.length,
          completed_interviews: done.length,
          unique_students: inTopic.length,
          average_score: done.length
            ? Math.round(done.reduce((a, b) => a + (b.score ?? 0), 0) / done.length)
            : 0,
        };
      }),
      daily_trend: Array.from({ length: 14 }, (_, i) => ({
        date: ymd(daysAgo(13 - i)),
        created: seededInt(`mitr:c:${i}`, 0, 5),
        completed: seededInt(`mitr:d:${i}`, 0, 4),
      })),
      top_performers: [...completed]
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 5)
        .map((r) => ({
          student_id: r.student_id,
          student_name: r.student_name,
          student_email: r.student_email,
          // One sitting each in this seed. It used to claim two, on a list where
          // each aspirant appears exactly once.
          interviews_completed: completed.filter((x) => x.student_id === r.student_id).length,
          average_score: r.score ?? 0,
          highest_score: r.score ?? 0,
        })),
      recent_interviews: rows.slice(0, 8),
    };
  },

  /**
   * The admin job list.
   *
   * Reads the shared postings rather than its own literal. The literal listed
   * four of the six jobs the learner could see, carried no `is_published` (so
   * every row rendered "Draft"), no location, no courses and no closing date,
   * and could never show a job an administrator had just created. It also
   * ignored the status filter, so every option in the dropdown returned the
   * same four rows.
   */
  "GET /jobs-v2/api/admin/jobs/": (req) => {
    const status = req.query.get("status");
    const results = allJobs()
      .filter((job) => !status || job.status === status)
      .map(toAdminJob);
    return { results, count: results.length };
  },

  // ── Settings ────────────────────────────────────────────────────────────
  // Branding (GET + PATCH + upload) lives in `misc-actions.ts`: the read has to
  // come from the same overlay the save writes, and a read here with the write
  // over there is how the two drift.

  "GET /accounts/clients/:clientId/timezone/": () => ({
    timezone: DEMO_TENANT.timezone,
    display: "India Standard Time (GMT+5:30)",
  }),

  /**
   * Integration credentials. Zoom is answered in `misc-actions.ts` instead: the
   * payload here was `{configured, mode, detail}`, which is not the shape
   * `zoom.service.ts` reads, so the live-sessions page saw an unconfigured
   * tenant and hid the whole integration behind a setup prompt.
   */
  "GET /accounts/clients/:clientId/google-credentials/": () => ({
    configured: false,
    detail: "Google Calendar is not connected in this demo environment.",
  }),
  "GET /accounts/clients/:clientId/razorpay-credentials/": () => ({
    configured: false,
    detail: "Razorpay is not connected in this demo environment.",
  }),

  "GET /admin-dashboard/api/clients/:clientId/scorecard-config/": () => ({
    enabled_modules: [
      "overview",
      "learning_consumption",
      "skills",
      "weak_areas",
      "assessments",
      "mock_interviews",
      "behavioral",
      "comparative",
      "achievements",
    ],
    // No "coding": there is no coding item in this catalogue, so scoring a
    // skill from coding activity would score it from an empty set.
    enabled_content_types_for_skills: ["article", "quiz", "assessment"],
  }),

  "GET /admin-dashboard/api/clients/:clientId/students/:studentId/": (req) => {
    const p = allStudents().find((x) => x.id === Number(req.params.studentId));
    if (!p) throw notFound("No aspirant with that record");
    return {
      id: p.id,
      name: p.full_name,
      email: p.email,
      phone_number: p.phone,
      profile_pic_url: p.profile_pic_url,
      college: p.college,
      is_active: true,
      progress: syllabusCovered(p),
      points: p.points,
      streak: p.streak,
      date_joined: isoDaysAgo(seededInt(`dj:${p.id}`, 20, 200)),
      last_login: isoDaysAgo(seededInt(`ll:${p.id}`, 0, 12)),
      // `sc:`, the key the faculty workspace and the learning journey both read.
      // It used to be a key of its own, so an officer opening an aspirant saw one
      // per-course figure and the faculty member opening the same aspirant saw
      // another.
      courses: COURSES.filter((c) => c.enrolled).map((c) => ({
        id: c.id,
        title: c.title,
        progress: seededInt(`sc:${p.id}:${c.id}`, 4, 98),
      })),
    };
  },
});

/**
 * The interview boards this mission's candidates actually sit.
 *
 * A recruitment interview, a bank's selection interview and the panel a skill
 * centre runs before a placement drive. The list this replaced offered
 * "Backend Engineering" and "Full-Stack Engineering", which is the clearest
 * possible signal that the module was ported from a software LMS and never
 * read again.
 *
 * The titles carry what the board actually asks about and no year-specific
 * claim about any of them.
 */
const INTERVIEW_BOARDS = [
  {
    topic: "TGPSC interview board",
    title: "TGPSC interview board: your background, your district and current affairs",
  },
  {
    topic: "Banking selection interview",
    title: "Banking selection interview: banking awareness, and why this bank",
  },
  {
    topic: "Trade placement panel",
    title: "Trade placement panel: your trade test, safety and readiness for site",
  },
] as const;

/**
 * The mock interview one aspirant has sat, as a record rather than a row.
 *
 * One sitting per person in this seed. Exported because three surfaces count and
 * name the same sittings: this module's list, the learning journey drill-down in
 * `details.ts` and the aspirant's own scorecard in `dashboard.ts`. Each used to
 * assert its own, so a trainee whose row here said "Trade placement panel"
 * opened onto a journey claiming she had sat a TGPSC board, and her scorecard
 * quoted a third score for it.
 *
 * Title and topic come off one record, so a row cannot be a banking interview
 * filed under the trade panel, and the id is derived from the person so one
 * sitting carries one id wherever it is shown.
 */
export function interviewSittingFor(p: DemoPerson) {
  const board = seededPick(`mi:${p.id}`, INTERVIEW_BOARDS);
  // Three of the twelve aspirants on the officer's list have a board still to
  // sit, so the status filter and the breakdown tile have something to separate.
  // Whether a person's board has met is decided here rather than by their row
  // number on that list, so the journey drill-down cannot report a completed
  // sitting for someone the list shows as still waiting.
  const index = allStudents().findIndex((x) => x.id === p.id);
  const pending = index >= 9 && index < 12;
  return {
    id: 82_000 + p.id,
    title: board.title,
    topic: board.topic,
    difficulty: seededPick(`mid:${p.id}`, ["Easy", "Medium", "Hard"]),
    status: pending ? ("scheduled" as const) : ("completed" as const),
    // Always a number, so a caller reading it never has to guard. A board that
    // has not met carries no score on screen, which is the `status` check the
    // rows below make: nobody has marked it yet.
    score: seededInt(`mis:${p.id}`, 48, 92),
    duration_minutes: 30,
  };
}

function adminMockInterviews() {
  return allStudents()
    .slice(0, 12)
    .map((p, i) => {
      const sitting = interviewSittingFor(p);
      const done = sitting.status === "completed";
      return {
        id: sitting.id,
        student_id: p.id,
        student_name: p.full_name,
        student_email: p.email,
        title: sitting.title,
        topic: sitting.topic,
        difficulty: sitting.difficulty,
        status: sitting.status,
        score: done ? sitting.score : null,
        duration_minutes: sitting.duration_minutes,
        created_at: isoDaysAgo(i + 2),
      };
    });
}

/** `{ interviews, pagination, filters_applied }`: the envelope the admin list expects. */
function interviewList(req: { query: URLSearchParams }) {
  const rows = adminMockInterviews();
  const page = Number(req.query.get("page") ?? 1);
  const limit = Number(req.query.get("limit") ?? 20);
  const start = (page - 1) * limit;
  return {
    interviews: rows.slice(start, start + limit),
    pagination: {
      current_page: page,
      total_pages: Math.max(1, Math.ceil(rows.length / limit)),
      total_interviews: rows.length,
      limit,
      has_next: start + limit < rows.length,
      has_previous: page > 1,
    },
    filters_applied: {},
  };
}
