/**
 * The faculty workspace.
 *
 * A faculty member's job is triage: who has stopped turning up, what is waiting
 * to be marked, what is on today. So the seed is built around that: a real
 * at-risk list with the reason attached, submissions waiting on review, and a
 * timetable with a class running now. A screen of healthy green numbers shows
 * the layout but not the job.
 *
 * Every aspirant here comes from the shared roster, so a faculty member looking
 * at "Srikanth Bandari, 23%, at risk" is looking at the same person the
 * leaderboard on the aspirant side ranks.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  INSTRUCTOR_PERSONA,
  STUDENTS,
  STUDENT_PERSONA,
  rankedLearners,
  type DemoPerson,
} from "../../db/people";
import { COURSES } from "../../db/courses";
import { facultyCode } from "./admin";
import { nextDemoId } from "../../db/overlay";
import { DEMO_TENANT } from "../../config";
import { iso, isoDaysAgo, isoDaysAhead, minutesAgo, nowMs, ymdDaysAgo, ymdDaysAhead } from "../../clock";
import { seededInt, seededPick } from "../../random";

const MODULE = "instructor";

/**
 * The batches this faculty member teaches.
 *
 * Named the way the mission names a batch: the notification or trade it
 * prepares for, the centre that runs it, and the intake it belongs to. An
 * officer asks for "the Warangal January intake", never for a cohort number,
 * and a batch whose name does not carry its centre cannot be read on a district
 * report. Ids 11 to 13 are shared with `admin.ts` and `details.ts`, which
 * project the same batches for the programme officer, so the three lists must
 * agree name for name.
 */
const COHORTS = [
  {
    id: 11,
    name: "TGPSC Group-II, Warangal centre, Jan intake",
    courseIds: [302],
    size: 28,
    status: "active",
  },
  {
    id: 12,
    name: "TGLPRB Constable, Karimnagar centre, Feb intake",
    courseIds: [305],
    size: 22,
    status: "active",
  },
  {
    id: 13,
    name: "TGPSC Group-II, Warangal centre, Jul intake",
    courseIds: [302],
    size: 24,
    status: "completed",
  },
];

/**
 * The courses this faculty member owns, read off the catalogue rather than
 * counted by hand. The count used to be the literal 2, which stopped being true
 * the moment the catalogue changed, and a KPI that cannot say what it counted
 * is the one number on the page nobody can check.
 */
function myCourses() {
  return COURSES.filter((c) => c.instructor.id === INSTRUCTOR_PERSONA.id);
}

/** Members of a batch, drawn deterministically from the roster. */
function cohortMembers(cohortId: number, size: number): DemoPerson[] {
  const start = (cohortId - 11) * 20;
  return [...STUDENTS.slice(start, start + size), STUDENT_PERSONA].slice(0, size);
}

/** Everyone this faculty member teaches, deduplicated across their batches. */
function taughtStudents(): DemoPerson[] {
  const seen = new Map<number, DemoPerson>();
  for (const c of COHORTS) {
    for (const p of cohortMembers(c.id, c.size)) seen.set(p.id, p);
  }
  return [...seen.values()];
}

/** Syllabus covered, stable per person. */
function progressOf(p: DemoPerson): number {
  return p.id === STUDENT_PERSONA.id
    ? COURSES.find((c) => c.id === 302)?.completion ?? 56
    : seededInt(`iprog:${p.id}`, 8, 96);
}

function statusOf(progress: number, streak: number): "on_track" | "watch" | "at_risk" {
  if (progress < 30 || streak === 0) return "at_risk";
  if (progress < 55) return "watch";
  return "on_track";
}

function studentRow(p: DemoPerson) {
  const progress = progressOf(p);
  const cohort = COHORTS.find((c) => cohortMembers(c.id, c.size).some((m) => m.id === p.id));
  return {
    student_id: p.id,
    name: p.full_name,
    email: p.email,
    phone: p.phone,
    progress,
    avg_score: seededInt(`iscore:${p.id}`, 42, 94),
    points: p.points,
    last_active: isoDaysAgo(seededInt(`ilast:${p.id}`, 0, 9)),
    cohort: cohort?.name ?? "Not in a batch",
    status: statusOf(progress, p.streak),
    courses_count: seededInt(`icc:${p.id}`, 1, 3),
    cohorts_count: 1,
  };
}

function statStudent(p: DemoPerson) {
  return {
    student_id: p.id,
    name: p.full_name,
    email: p.email,
    progress: progressOf(p),
  };
}

/**
 * The faculty member's own timetable.
 *
 * `dayOffset` is signed: negative is the past. Classes that have ended matter as
 * much as the ones to come. They are what fills the Ended tab, the attendance
 * figures and the recording links, and a faculty member with no history reads as
 * one who has never taken a class.
 */
interface ScheduleRow {
  id: number;
  topic: string;
  /** Signed offset from today. Negative is the past. */
  dayOffset: number;
  hour: number;
  status: "live" | "scheduled" | "ended";
  cohort: string;
  provider: "meeting" | "webinar";
  recorded: boolean;
}

const SCHEDULE: ScheduleRow[] = [
  {
    id: 501,
    topic: "Doubt clearing: the Telangana movement and statehood",
    dayOffset: 0,
    hour: 18,
    status: "live",
    cohort: "TGPSC Group-II, Warangal centre, Jan intake",
    provider: "meeting",
    recorded: false,
  },
  {
    id: 502,
    topic: "Revision class: Telangana economy and state schemes",
    dayOffset: 2,
    hour: 19,
    status: "scheduled",
    cohort: "TGPSC Group-II, Warangal centre, Jan intake",
    provider: "meeting",
    recorded: false,
  },
  {
    id: 504,
    topic: "Written test to physical events: how the constable stages fit together",
    dayOffset: 7,
    hour: 20,
    status: "scheduled",
    cohort: "TGLPRB Constable, Karimnagar centre, Feb intake",
    provider: "webinar",
    recorded: false,
  },
  {
    id: 497,
    topic: "Polity: fundamental rights and the writs",
    dayOffset: -3,
    hour: 18,
    status: "ended",
    cohort: "TGPSC Group-II, Warangal centre, Jan intake",
    provider: "meeting",
    recorded: true,
  },
  {
    id: 494,
    topic: "Previous paper walkthrough: general studies, question by question",
    dayOffset: -8,
    hour: 19,
    status: "ended",
    cohort: "TGPSC Group-II, Warangal centre, Jan intake",
    provider: "meeting",
    recorded: true,
  },
  {
    id: 490,
    topic: "Current affairs revision: state schemes of the last quarter",
    dayOffset: -14,
    hour: 20,
    status: "ended",
    cohort: "TGLPRB Constable, Karimnagar centre, Feb intake",
    provider: "webinar",
    recorded: false,
  },
];

/**
 * A row in the shape `InstructorLiveSession` actually declares.
 *
 * The previous version returned a bare array of loosely-named fields, and the
 * page, which reads `.upcoming` / `.past` / `.past_total` off the response,
 * threw and rendered "Couldn't load your live sessions." Same rule as the ticket
 * handler: a wrong shape takes the route down, a missing one only empties it.
 */
function liveSession(s: ScheduleRow) {
  const ended = s.status === "ended";
  const registered = seededInt(`reg:${s.id}`, 18, 40);
  // Nobody has "attended" a class that has not happened, so a scheduled row
  // reports zero and the page hides its turnout block rather than showing 0%.
  const attendance = ended
    ? seededInt(`att:${s.id}`, Math.round(registered * 0.5), Math.round(registered * 0.9))
    : s.status === "live"
      ? seededInt(`live:${s.id}`, 12, Math.min(30, registered))
      : 0;
  const hasRecording = ended && s.recorded;

  return {
    id: s.id,
    topic_name: s.topic,
    // The live row is anchored to NOW. This page derives live/scheduled/ended
    // from the clock rather than trusting a status field, so a fixed evening hour
    // read as "Scheduled" for all but one hour of the day.
    class_datetime:
      s.status === "live" ? iso(minutesAgo(20)) : isoDaysAhead(s.dayOffset, s.hour, 0),
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_link: `/instructor/live-sessions?session=${s.id}`,
    is_upcoming: !ended,
    provider: s.provider,
    status: s.status,
    is_zoom: s.provider === "meeting" || s.provider === "webinar",
    is_webinar: s.provider === "webinar",
    is_google_meet: false,
    cohort_name: s.cohort,
    password: "",
    // This faculty member owns their own timetable, so every row is hostable and
    // editable. A read-only row would show controls a prospect cannot click.
    hostable: !ended,
    created_by_me: true,
    editable: !ended,
    registered,
    attendance,
    turnout: registered > 0 ? Math.round((attendance / registered) * 100) : null,
    has_recording: hasRecording,
    recording_url: hasRecording ? `/instructor/live-sessions?session=${s.id}&recording=1` : "",
  };
}

function dashboard() {
  const students = taughtStudents();
  const rows = students.map(studentRow);
  const atRisk = rows.filter((r) => r.status === "at_risk");
  const avgProgress = Math.round(rows.reduce((s, r) => s + r.progress, 0) / Math.max(1, rows.length));

  return {
    instructor_name: INSTRUCTOR_PERSONA.full_name,
    // The staff code the mission issues, minted in one place (`admin.ts`) so
    // this dashboard, the staff directory and a batch's staff card cannot print
    // three different codes for one person.
    instructor_code: facultyCode(INSTRUCTOR_PERSONA.id),
    is_admin_view: false,
    batches: COHORTS.filter((c) => c.status === "active").length,
    courses: myCourses().length,
    students: rows.length,
    active_students: rows.filter((r) => r.status !== "at_risk").length,
    avg_progress: avgProgress,
    completion_rate: Math.round(rows.filter((r) => r.progress >= 80).length / Math.max(1, rows.length) * 100),
    at_risk_count: atRisk.length,
    upcoming_sessions: SCHEDULE.filter((s) => s.status === "scheduled").length,
    live_now: SCHEDULE.filter((s) => s.status === "live").length,
    at_risk: atRisk
      .slice(0, 6)
      .map((r) => ({ student_id: r.student_id, name: r.name, email: r.email, progress: r.progress })),
    top_performers: rankedLearners()
      .filter((p) => students.some((s) => s.id === p.id))
      .slice(0, 5)
      .map(statStudent),
    cohorts_detailed: COHORTS.map((c) => {
      const members = cohortMembers(c.id, c.size).map(studentRow);
      return {
        id: c.id,
        name: c.name,
        courses: c.courseIds
          .map((id) => COURSES.find((x) => x.id === id))
          .filter((x): x is NonNullable<typeof x> => Boolean(x))
          .map((x) => ({ id: x.id, title: x.title })),
        client_name: DEMO_TENANT.name,
        status: c.status,
        end_date: c.status === "completed" ? isoDaysAgo(40) : isoDaysAhead(90),
        student_count: members.length,
        progress: Math.round(members.reduce((s, m) => s + m.progress, 0) / Math.max(1, members.length)),
        avg_score: Math.round(members.reduce((s, m) => s + (m.avg_score ?? 0), 0) / Math.max(1, members.length)),
        at_risk: members.filter((m) => m.status === "at_risk").length,
      };
    }),
    schedule: SCHEDULE.map((s) => ({
      id: s.id,
      topic: s.topic,
      datetime: s.dayOffset === 0 ? isoDaysAhead(0, s.hour, 0) : isoDaysAhead(s.dayOffset, s.hour, 0),
      duration_minutes: 60,
      status: s.status,
      registered: seededInt(`reg:${s.id}`, 18, 40),
      cohort_name: s.cohort,
      join_link: `/instructor/live-sessions?session=${s.id}`,
    })),
    recent_submissions: taughtStudents()
      .slice(0, 6)
      .map((p, i) => ({
        submission_id: 9000 + i,
        student_name: p.full_name,
        assessment_title: seededPick(`sub:${p.id}`, [
          "TGPSC Group-II: mid-programme test",
          "TGPSC Group-II: foundation diagnostic",
          "TGLPRB Constable: general studies unit test",
        ]),
        // Two awaiting review, so the gradebook has something to do.
        score: i < 2 ? null : seededInt(`subs:${p.id}`, 48, 96),
        review_status: i < 2 ? "pending" : "reviewed",
        completed_at: isoDaysAgo(i + 1, 16, 0),
      })),
    progress_truncated: false,
  };
}

defineRoutes(MODULE, {
  "GET /instructor/api/dashboard/": () => dashboard(),

  "GET /instructor/api/overview/": () => ({
    courses: myCourses().length,
    adaptive_courses: myCourses().length,
    classic_courses: 0,
    cohorts: COHORTS.filter((c) => c.status === "active").length,
    students: taughtStudents().length,
    is_admin_view: false,
  }),

  "GET /instructor/api/courses/": () =>
    COURSES.filter((c) => c.instructor.id === INSTRUCTOR_PERSONA.id).map((c) => ({
      id: c.id,
      kind: "adaptive" as const,
      title: c.title,
      slug: c.slug,
      is_published: true,
      student_count: c.enrolledCount,
      updated_at: isoDaysAgo(seededInt(`iupd:${c.id}`, 1, 14)),
      authored_by_me: true,
      review_status: "approved" as const,
      review_note: "",
    })),

  "GET /instructor/api/cohorts/": () =>
    COHORTS.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      start_date: c.status === "completed" ? ymdDaysAgo(210) : ymdDaysAgo(120),
      end_date: c.status === "completed" ? ymdDaysAgo(40) : ymdDaysAhead(90),
      member_count: c.size,
      artifact_count: c.courseIds.length,
    })),

  "GET /instructor/api/cohorts/:cohortId/students/": (req) => {
    const c = COHORTS.find((x) => x.id === Number(req.params.cohortId));
    if (!c) throw notFound("Cohort not found");
    const members = cohortMembers(c.id, c.size);
    return {
      cohort_id: c.id,
      name: c.name,
      count: members.length,
      results: members.map((p) => ({
        student_id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone,
        status: "active",
        joined_at: isoDaysAgo(seededInt(`join:${p.id}`, 30, 120)),
      })),
    };
  },

  "GET /instructor/api/students/": (req) => {
    const search = (req.query.get("search") ?? "").toLowerCase();
    const status = req.query.get("status") ?? "";
    const page = Number(req.query.get("page") ?? 1);
    const pageSize = Number(req.query.get("page_size") ?? 25);

    let rows = taughtStudents().map(studentRow);
    if (search) {
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(search) || r.email.toLowerCase().includes(search),
      );
    }
    if (status) rows = rows.filter((r) => r.status === status);

    const start = (page - 1) * pageSize;
    return {
      count: rows.length,
      page,
      page_size: pageSize,
      results: rows.slice(start, start + pageSize),
      summary: {
        count: rows.length,
        avg_progress: Math.round(rows.reduce((s, r) => s + r.progress, 0) / Math.max(1, rows.length)),
        avg_score: Math.round(rows.reduce((s, r) => s + (r.avg_score ?? 0), 0) / Math.max(1, rows.length)),
        at_risk: rows.filter((r) => r.status === "at_risk").length,
      },
      cohort_id: null,
    };
  },

  "GET /instructor/api/students/:studentId/": (req) => {
    const p = taughtStudents().find((x) => x.id === Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    const row = studentRow(p);
    return {
      ...row,
      profile_pic_url: p.profile_pic_url,
      college: p.college,
      courses: COURSES.filter((c) => c.enrolled).map((c) => ({
        id: c.id,
        title: c.title,
        progress: seededInt(`sc:${p.id}:${c.id}`, 5, 98),
      })),
      recent_activity: Array.from({ length: 5 }, (_, i) => ({
        label: seededPick(`act:${p.id}:${i}`, [
          "Read a syllabus topic",
          "Submitted an assignment",
          "Took a practice quiz",
          "Attended a live class",
        ]),
        at: isoDaysAgo(i + 1, 15, 0),
      })),
    };
  },

  "POST /instructor/api/students/:studentId/nudge/": () => ({
    detail: "Reminder sent. The aspirant will see it on their dashboard and by email.",
    sent_at: iso(new Date(nowMs())),
  }),

  "POST /instructor/api/cohorts/:cohortId/message/": () => ({
    detail: "Message queued for every active member of this batch.",
  }),

  /**
   * `InstructorAssessment`, and note `duration_minutes` and `pending_grading`.
   * Both were missing, so the gradebook rendered a bare " min" with no number
   * and reported every paper as "up to date" because `undefined` is falsy.
   */
  "GET /instructor/api/assessments/": () => [
    {
      id: 901,
      title: "TGPSC Group-II: mid-programme test",
      slug: "tgpsc-group-2-mid-programme",
      is_draft: false,
      duration_minutes: 90,
      submissions: 24,
      pending_grading: 2,
      avg_score: 71,
      created_at: isoDaysAgo(30),
    },
    {
      id: 903,
      title: "TGLPRB Constable: general studies unit test",
      slug: "tglprb-constable-general-studies-2",
      is_draft: false,
      duration_minutes: 45,
      submissions: 18,
      pending_grading: 0,
      avg_score: 68,
      created_at: isoDaysAgo(22),
    },
    {
      id: 905,
      title: "Current affairs: weekly test 6",
      slug: "current-affairs-weekly-6",
      is_draft: true,
      duration_minutes: 60,
      submissions: 0,
      pending_grading: 0,
      avg_score: null,
      created_at: isoDaysAgo(4),
    },
  ],

  /** `{ upcoming, past, past_total }`: the page destructures all three. */
  "GET /instructor/api/live-sessions/": () => {
    const rows = SCHEDULE.map(liveSession);
    const past = rows
      .filter((r) => !r.is_upcoming)
      .sort((a, b) => b.class_datetime.localeCompare(a.class_datetime));
    return {
      upcoming: rows
        .filter((r) => r.is_upcoming)
        .sort((a, b) => a.class_datetime.localeCompare(b.class_datetime)),
      past,
      past_total: past.length,
    };
  },

  /** `{ registered, attendance, attendees }`: attendees are `AttendeeRow`. */
  "GET /instructor/api/live-sessions/:sessionId/attendance/": (req) => {
    const id = Number(req.params.sessionId);
    const row = SCHEDULE.find((s) => s.id === id);
    const session = row ? liveSession(row) : null;
    const members = cohortMembers(11, 28);
    const attendance = session?.attendance ?? 0;
    return {
      registered: session?.registered ?? members.length,
      attendance,
      // Only the people who actually joined belong in the roster, and the count
      // above has to equal its length or the dialog header contradicts the list.
      attendees: members.slice(0, attendance).map((p) => ({
        name: p.full_name,
        email: p.email,
        duration_minutes: Math.round(seededInt(`attd:${p.id}:${id}`, 600, 3600) / 60),
        source: "zoom" as const,
      })),
    };
  },

  /** `HostLink` is `{ kind, url }`; the page opens `link.url`. */
  "GET /instructor/api/live-sessions/:sessionId/host-link/": (req) => {
    const row = SCHEDULE.find((s) => s.id === Number(req.params.sessionId));
    return {
      kind: row?.provider === "webinar" ? ("panelist" as const) : ("host" as const),
      url: `/instructor/live-sessions?session=${req.params.sessionId}&host=1`,
    };
  },

  "POST /instructor/api/live-sessions/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const provider = body.session_type === "webinar" ? ("webinar" as const) : ("meeting" as const);
    const created = liveSession({
      id: nextDemoId("instructor-session"),
      topic: String(body.topic_name ?? "New class"),
      dayOffset: 1,
      hour: 18,
      status: "scheduled",
      cohort: COHORTS[0].name,
      provider,
      recorded: false,
    });
    return {
      ...created,
      class_datetime: String(body.class_datetime ?? created.class_datetime),
      duration_minutes: Number(body.duration_minutes ?? 60),
      timezone: String(body.timezone ?? "Asia/Kolkata"),
      host_link: {
        kind: provider === "webinar" ? ("panelist" as const) : ("host" as const),
        url: `/instructor/live-sessions?session=${created.id}&host=1`,
      },
    };
  },

  "PATCH /instructor/api/live-sessions/:sessionId/": (req) => {
    const row = SCHEDULE.find((s) => s.id === Number(req.params.sessionId));
    if (!row) throw notFound("Session not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    return {
      ...liveSession(row),
      ...(body.topic_name ? { topic_name: String(body.topic_name) } : {}),
      ...(body.class_datetime ? { class_datetime: String(body.class_datetime) } : {}),
      ...(body.duration_minutes ? { duration_minutes: Number(body.duration_minutes) } : {}),
    };
  },

  "DELETE /instructor/api/live-sessions/:sessionId/": () => ({ detail: "Class cancelled" }),

});
