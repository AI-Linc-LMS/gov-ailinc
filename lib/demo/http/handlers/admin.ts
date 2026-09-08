/**
 * The administrator surface.
 *
 * The insights pages are the ones that decide a sale: an administrator is
 * buying visibility into a cohort they cannot watch directly. So every tile
 * carries its `definition` string, exactly as the real API does — these numbers
 * get quoted in meetings, and a figure whose page cannot say what it counted
 * gets read with whichever meaning is most flattering.
 *
 * At-risk students carry the RULES that flagged them, not just a red badge.
 * "At risk" with no reason is a number an administrator cannot act on.
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
import { iso, isoDaysAgo, nowMs, ymd, ymdDaysAgo, ymdDaysAhead, daysAgo } from "../../clock";
import { seededInt, seededPick, seededBool } from "../../random";

const MODULE = "admin";

/** Every learner on the tenant. */
function allStudents(): DemoPerson[] {
  return [STUDENT_PERSONA, ...STUDENTS];
}

function progressOf(p: DemoPerson): number {
  return p.id === STUDENT_PERSONA.id ? 56 : seededInt(`aprog:${p.id}`, 4, 98);
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
 * Students flagged at risk, with the rule that flagged each one.
 *
 * Severity and rules are derived from the same progress and streak values the
 * instructor workspace reads, so the two never disagree about who is struggling.
 */
function atRiskRows() {
  return allStudents()
    .map((p) => {
      const progress = progressOf(p);
      const rules: string[] = [];
      if (progress < 25) rules.push("Below 25% course progress");
      if (p.streak === 0) rules.push("No activity in 7 days");
      if (seededBool(`risk:${p.id}`, 0.18)) rules.push("Two consecutive missed live sessions");
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

const COHORTS = [
  { id: 11, name: "Autumn 2026 — Full-Stack", status: "active", members: 28, capacity: 35 },
  { id: 12, name: "Autumn 2026 — Interview Prep", status: "active", members: 22, capacity: 30 },
  { id: 13, name: "Spring 2026 — Full-Stack", status: "completed", members: 24, capacity: 30 },
];

/**
 * Everyone in the instructor directory, with the approval state each one is in.
 *
 * The teaching staff are approved; the two applicants and one rejection exist so
 * an admin can actually work the queue — approve someone, reject someone, reopen
 * a rejection — instead of looking at three tabs that all say the same thing.
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
  const approved = [INSTRUCTOR_PERSONA, ...FACULTY].map((p, i) => ({
    person: p,
    pending_status: "approved" as const,
    daysAgo: 200 + i * 90,
    reviewedDaysAgo: 195 + i * 90,
    reason: null as string | null,
  }));

  // Applicants are not on the roster: they have signed up but nobody has let them
  // in yet, so they own no courses and teach no cohorts.
  const applicant = (id: number, fullName: string, email: string) => ({
    id,
    full_name: fullName,
    email,
    phone: `+91 ${seededInt(`appl:${id}:a`, 70000, 99999)}${seededInt(`appl:${id}:b`, 10000, 99999)}`,
  });

  const applicants = [
    {
      person: applicant(1201, "Nikhil Chatterjee", "nikhil.chatterjee@ailinc.com"),
      pending_status: "pending" as const,
      daysAgo: 4,
      reviewedDaysAgo: null,
      reason: null as string | null,
    },
    {
      person: applicant(1202, "Sneha Balakrishnan", "sneha.balakrishnan@ailinc.com"),
      pending_status: "pending" as const,
      daysAgo: 9,
      reviewedDaysAgo: null,
      reason: null as string | null,
    },
    {
      person: applicant(1203, "Arjun Sethi", "arjun.sethi@ailinc.com"),
      pending_status: "rejected" as const,
      daysAgo: 26,
      reviewedDaysAgo: 21,
      reason: "No verifiable teaching or industry references. Invited to reapply after a term of TA work.",
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
    // table renders a dash for null — better than a CV link that 404s in front of
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
    subject: "Your week 7 progress at AI Linc",
    taskName: "Weekly progress digest",
    status: "completed",
    daysAgo: 6,
    recipients: 45,
    failed: 0,
    body: "A short summary of what you finished this week, what is still open, and the one thing worth picking up next.",
  },
  {
    taskId: "eml-3b77ea",
    subject: "Placement drive: Razorpay is on campus next Thursday",
    taskName: "Placement announcement",
    status: "completed",
    daysAgo: 11,
    recipients: 45,
    failed: 0,
    body: "Razorpay is hiring for Software Engineer I (Backend). Applications close Tuesday; the shortlist is announced the same evening.",
  },
  {
    taskId: "eml-77a0d1",
    subject: "Reminder: your capstone submission closes Friday",
    taskName: "Deadline reminder",
    status: "sending",
    daysAgo: 0,
    recipients: 28,
    failed: 0,
    body: "Submissions close at 6:00 PM on Friday. Late work is accepted for 48 hours at a 10% penalty.",
  },
  {
    taskId: "eml-51c9b8",
    subject: "Certificate ready: Full-Stack Web Development",
    taskName: "Certificate issued",
    status: "failed",
    daysAgo: 19,
    recipients: 24,
    failed: 3,
    body: "Your certificate is ready to download and share. The verification link stays live permanently.",
  },
];

const ASSESSMENT_EMAIL_JOBS: EmailJobSeed[] = [
  {
    taskId: "aeml-2d41f7",
    subject: "Mid-Programme Assessment opens Monday 10:00 AM",
    taskName: "Assessment invitation",
    status: "completed",
    daysAgo: 8,
    recipients: 28,
    failed: 0,
    assessmentId: 901,
    assessmentTitle: "Full-Stack Engineering — Mid-Programme Assessment",
    body: "You have 90 minutes and one attempt. Run the device check before you start — it takes about a minute.",
  },
  {
    taskId: "aeml-8c0e35",
    subject: "Results published: Unit 2 Test",
    taskName: "Result notification",
    status: "completed",
    daysAgo: 3,
    recipients: 18,
    failed: 0,
    assessmentId: 903,
    assessmentTitle: "Python for Data Science — Unit 2 Test",
    body: "Your score and the per-question breakdown are on your assessment page.",
  },
  {
    taskId: "aeml-4a6b19",
    subject: "You have not started the Mid-Programme Assessment yet",
    taskName: "Non-starter reminder",
    status: "failed",
    daysAgo: 5,
    recipients: 6,
    failed: 2,
    assessmentId: 901,
    assessmentTitle: "Full-Stack Engineering — Mid-Programme Assessment",
    body: "The window closes Sunday at midnight. If something is blocking you, reply to this email.",
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
  // successful ones — a person appearing in both columns is a visible lie.
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

const TICKET_CATEGORIES = [
  { label: "Content", value: 14 },
  { label: "Technical", value: 21 },
  { label: "Account", value: 7 },
  { label: "Live session", value: 9 },
];

defineRoutes(MODULE, {
  // ── Insights ────────────────────────────────────────────────────────────
  "GET /admin-dashboard/api/clients/:clientId/insights/pulse/": (req) => {
    const range = resolveRange(req.query.get("range"));
    const students = allStudents();
    const active = Math.round(students.length * 0.72);

    const buckets = Math.min(range.grain === "day" ? range.days : 12, 30);
    return {
      scope: SCOPE,
      range,
      tiles: {
        active_students: deltaTile(
          active,
          active - 6,
          "Distinct students with at least one recorded activity in the range.",
          { denominator: students.length },
        ),
        items_completed: deltaTile(
          seededInt("pulse:items", 640, 980),
          seededInt("pulse:itemsprev", 560, 900),
          "Lessons, quizzes and coding problems marked complete in the range.",
          { per_active_student: 14 },
        ),
        median_minutes: {
          value: 38,
          definition: "Median minutes per active student per active day. Median, not mean, so one outlier cannot move it.",
          as_of: iso(new Date(nowMs())),
        },
        stale_tickets: {
          value: 3,
          definition: "Support tickets open for more than 72 hours with no staff reply.",
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
        note: "Recomputed hourly. Activity in the last few minutes may not be counted yet.",
      },
    };
  },

  /**
   * `results`, not `rows`. The dashboard reads `atRisk?.results.length` with no
   * optional chaining past the first hop, so returning the wrong key does not
   * degrade — it takes the whole page down with "Cannot read properties of
   * undefined". `rules` is the legend the table renders beside the flags.
   */
  "GET /admin-dashboard/api/clients/:clientId/insights/at-risk/": (req) => {
    const limit = Number(req.query.get("limit") ?? 10);
    return {
      results: atRiskRows().slice(0, limit),
      rules: {
        low_progress: "Below 25% course progress",
        inactive: "No activity in 7 days",
        missed_sessions: "Two consecutive missed live sessions",
      },
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
    const keys = ["Lessons", "Quizzes", "Coding", "Live sessions"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const matrix = days.map((day) => ({
      day,
      hours: Array.from({ length: 24 }, (_, h) => {
        // Evenings are busiest, which is what a part-time cohort actually looks like.
        const evening = h >= 18 && h <= 22 ? 3 : h >= 9 && h <= 17 ? 1.4 : 0.3;
        return Math.round(seededInt(`hm:${day}:${h}`, 0, 12) * evening);
      }),
    }));
    const flat = matrix.flatMap((r) => r.hours);
    const max = Math.max(...flat);

    return {
      scope: SCOPE,
      range,
      mix_over_time: {
        keys,
        series: Array.from({ length: 8 }, (_, i) => ({
          bucket: `W${i + 1}`,
          Lessons: seededInt(`mix:l:${i}`, 40, 120),
          Quizzes: seededInt(`mix:q:${i}`, 20, 80),
          Coding: seededInt(`mix:c:${i}`, 15, 70),
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
        peak: { day: "Tue", hour: 19, count: max, label: "Tuesdays, 7-8pm" },
        timezone: DEMO_TENANT.timezone,
      },
      consistency: {
        bins: [
          { label: "1-2 days", students: 9 },
          { label: "3-5 days", students: 14 },
          { label: "6-10 days", students: 12 },
          { label: "11+ days", students: 10 },
        ],
        median_active_days: 6,
        students: 45,
        of_days: range.days,
      },
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
      activation: "Share of enrolled students who completed at least one item.",
      completion: "Mean completion across enrolled students, not across items.",
      dropoff: "Students still active in each week since their enrolment.",
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
      members: c.members,
      active: Math.round(c.members * 0.74),
      completed: c.status === "completed" ? c.members : Math.round(c.members * 0.12),
      capacity: c.capacity,
      fill_pct: Math.round((c.members / c.capacity) * 100),
    })),
    tickets: {
      opened: 51,
      resolved: 44,
      open_now: 7,
      median_resolution_hours: 19,
      by_category: TICKET_CATEGORIES,
      by_status: [
        { label: "Open", value: 7 },
        { label: "In progress", value: 5 },
        { label: "Resolved", value: 44 },
      ],
      definitions: {
        median_resolution_hours: "Median hours from a ticket being opened to being marked resolved.",
        open_now: "Tickets not yet resolved, regardless of when they were opened.",
      },
    },
    instructors: {
      // All FOUR ratings, plus suppressed/min_responses/note.
      //
      // Omitting pace_rating and overall_rating crashed the whole admin
      // dashboard: RatingCell calls .toFixed() on the value with no guard, so a
      // missing field is a TypeError during render rather than a blank cell.
      // The type declares them nullable — null renders as "no data", undefined
      // throws — so a field that has no value must be explicitly null.
      rows: [INSTRUCTOR_PERSONA, ...FACULTY].map((p, i) => ({
        instructor: p.full_name,
        instructor_profile_id: p.id,
        responses: seededInt(`ir:${p.id}`, 14, 62),
        instructor_rating: Number((4.1 + (i % 3) * 0.25).toFixed(1)),
        content_rating: Number((3.9 + (i % 4) * 0.2).toFixed(1)),
        pace_rating: Number((3.8 + (i % 3) * 0.3).toFixed(1)),
        overall_rating: Number((4.0 + (i % 4) * 0.22).toFixed(1)),
      })),
      suppressed: 1,
      min_responses: 5,
      note: "One instructor is hidden: fewer than 5 responses is too few to average fairly.",
      definition: "Averages of end-of-session feedback, only from sessions with at least five responses.",
    },
  }),

  // ── People and content management ───────────────────────────────────────
  /**
   * Shape is `{ students, pagination, filters_applied }`, not `{ results, count }`.
   *
   * The page reads `data.students.length` directly, so the wrong envelope does
   * not render an empty table — it takes the page down. Worth stating plainly:
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
          progress: progressOf(p),
          points: p.points,
          streak: p.streak,
          courses_enrolled: enrolled,
          cohort: seededPick(`co:${p.id}`, COHORTS.map((c) => c.name)),
          // The rest of the `Student` type. These render as blank cells and an
          // empty CSV column when omitted, which reads as a broken table rather
          // than an unused one.
          total_marks: p.points,
          most_active_course: seededPick(`mac:${p.id}`, COURSES.map((c) => c.title)),
          total_time_spent: { value: seededInt(`tts:${p.id}`, 6, 180), unit: "hours" },
          last_activity_date: isoDaysAgo(seededInt(`lad:${p.id}`, 0, 14)),
          current_streak: p.streak,
          streak_data: Array.from({ length: 7 }, (_, d) => seededBool(`sd:${p.id}:${d}`, 0.55)),
          enrollment_count: enrolled,
          has_saved_resume: true,
          assessment_submissions: seededInt(`sas:${p.id}`, 0, 4),
          activity_summary: {
            total_activities: seededInt(`sact:${p.id}`, 30, 260),
            by_type: {
              article: seededInt(`sact:a:${p.id}`, 4, 60),
              quiz: seededInt(`sact:q:${p.id}`, 2, 40),
              coding: seededInt(`sact:c:${p.id}`, 0, 30),
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
        title: `${m.title} — check your understanding`,
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
      member_count: c.members,
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
   * each showed the same list — the same "stale data in every tab" the ticket page
   * had.
   */
  "GET /admin-dashboard/api/clients/:clientId/instructors/": (req) => {
    const status = req.query.get("status") ?? "pending";
    const rows = instructorDirectory();
    return status === "all" ? rows : rows.filter((r) => r.pending_status === status);
  },

  "GET /instructor/api/admin/instructors/": () =>
    [INSTRUCTOR_PERSONA, ...FACULTY].map((p, i) => ({
      profile_id: p.id,
      name: p.full_name,
      email: p.email,
      instructor_code: `MIT-${p.first_name.slice(0, 2).toUpperCase()}-0${i + 1}`,
      courses: COURSES.filter((c) => c.instructor.id === p.id).map((c) => ({
        id: c.id,
        title: c.title,
        role: "owner",
      })),
      cohorts: i === 0 ? COHORTS.slice(0, 2).map((c) => ({ id: c.id, name: c.name, role: "lead" })) : [],
      live_sessions: i === 0 ? [{ id: 501, title: "Live doubt-clearing: React rendering and effects" }] : [],
    })),

  /**
   * The approval queue's actions. Without these the buttons were live but every
   * click failed — worse than a disabled button, because the prospect tries it.
   * Each writes to the overlay, so the row really does move tabs.
   */
  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/approve/": (req) => {
    const id = Number(req.params.profileId);
    decideInstructor(id, { status: "approved", reason: null });
    return {
      detail: "Instructor approved.",
      profile: instructorDirectory().find((r) => r.id === id),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/reject/": (req) => {
    const id = Number(req.params.profileId);
    const reason = String(req.body?.reason ?? "").trim() || null;
    decideInstructor(id, { status: "rejected", reason });
    return {
      detail: "Instructor rejected.",
      profile: instructorDirectory().find((r) => r.id === id),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/instructors/:profileId/reopen/": (req) => {
    const id = Number(req.params.profileId);
    decideInstructor(id, { status: "pending", reason: null });
    return {
      detail: "Application reopened.",
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
    detail: "Instructor removed. They keep their account as a student.",
  }),

  /** `{ managed_courses, assigned_courses, all_scoped }` — the "view courses" dialog. */
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
   * These returned empty, so the module read as "nothing has ever been sent here"
   * — which for a communications tool is indistinguishable from it not working.
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
      difficulty_distribution: {
        Easy: { total: 4, completed: 4, average_score: 78 },
        Medium: { total: 6, completed: 4, average_score: 70 },
        Hard: { total: 2, completed: 1, average_score: 61 },
      },
      topic_breakdown: ["Backend Engineering", "Algorithms", "Full-Stack Engineering"].map((topic) => {
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
      top_performers: completed.slice(0, 5).map((r) => ({
        student_id: r.student_id,
        student_name: r.student_name,
        student_email: r.student_email,
        interviews_completed: 2,
        average_score: r.score ?? 0,
        highest_score: Math.min(100, (r.score ?? 0) + 6),
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
    enabled_content_types_for_skills: ["quiz", "coding", "assessment"],
  }),

  "GET /admin-dashboard/api/clients/:clientId/students/:studentId/": (req) => {
    const p = allStudents().find((x) => x.id === Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    return {
      id: p.id,
      name: p.full_name,
      email: p.email,
      phone_number: p.phone,
      profile_pic_url: p.profile_pic_url,
      college: p.college,
      is_active: true,
      progress: progressOf(p),
      points: p.points,
      streak: p.streak,
      date_joined: isoDaysAgo(seededInt(`dj:${p.id}`, 20, 200)),
      last_login: isoDaysAgo(seededInt(`ll:${p.id}`, 0, 12)),
      courses: COURSES.filter((c) => c.enrolled).map((c) => ({
        id: c.id,
        title: c.title,
        progress: seededInt(`asc:${p.id}:${c.id}`, 4, 98),
      })),
    };
  },
});

function adminMockInterviews() {
  return allStudents()
    .slice(0, 12)
    .map((p, i) => ({
      id: 8200 + i,
      student_id: p.id,
      student_name: p.full_name,
      student_email: p.email,
      title: seededPick(`mi:${p.id}`, [
        "Backend fundamentals — systems and APIs",
        "Data structures — arrays, hashing and complexity",
        "Full-stack — end-to-end feature design",
      ]),
      topic: seededPick(`mit:${p.id}`, ["Backend Engineering", "Algorithms", "Full-Stack Engineering"]),
      difficulty: seededPick(`mid:${p.id}`, ["Easy", "Medium", "Hard"]),
      status: i < 9 ? "completed" : "scheduled",
      score: i < 9 ? seededInt(`mis:${p.id}`, 48, 92) : null,
      duration_minutes: 30,
      created_at: isoDaysAgo(i + 2),
    }));
}

/** `{ interviews, pagination, filters_applied }` — the envelope the admin list expects. */
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
