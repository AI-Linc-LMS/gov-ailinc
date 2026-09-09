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
import { INSTRUCTOR_PERSONA, rankedLearners, type DemoPerson } from "../../db/people";
import { COURSES } from "../../db/courses";
import {
  COHORTS,
  MID_PROGRAMME_PAPER,
  atRiskReasons,
  batchMembers,
  facultyCode,
  sessionTitle,
  syllabusCovered,
} from "./admin";
import { nextDemoId } from "../../db/overlay";
import { DEMO_TENANT } from "../../config";
import { iso, isoDaysAgo, isoDaysAhead, minutesAgo, nowMs, ymdDaysAgo, ymdDaysAhead } from "../../clock";
import { seededInt, seededPick } from "../../random";

const MODULE = "instructor";

/**
 * The batches this faculty member is answerable for.
 *
 * Not a second list. `admin.ts` owns every batch the mission runs, and this is
 * the subset led by the signed-in faculty member, so a batch cannot carry one
 * name in the programme officer's table and another in the gradebook. The three
 * exam batches came out of that filter; the trade and enterprise batches are led
 * by the centre trainers and are not this workspace's to show.
 */
const MY_COHORTS = COHORTS.filter((c) => c.leadId === INSTRUCTOR_PERSONA.id);

/**
 * The courses this faculty member owns, read off the catalogue rather than
 * counted by hand. The count used to be the literal 2, which stopped being true
 * the moment the catalogue changed, and a KPI that cannot say what it counted
 * is the one number on the page nobody can check.
 */
function myCourses() {
  return COURSES.filter((c) => c.instructor.id === INSTRUCTOR_PERSONA.id);
}

/**
 * Members of a batch.
 *
 * Delegated to `admin.ts` so a batch that says 28 members opens onto the same 28
 * people in the gradebook and in the programme officer's batch page. The version
 * this replaced sliced a fixed window off the roster and ran off the end, so the
 * completed batch claimed 24 members and listed five, and it appended the
 * signed-in aspirant to every batch, which put her in three at once.
 */
function cohortMembers(cohortId: number, size: number): DemoPerson[] {
  return batchMembers(cohortId, size);
}

/** Everyone this faculty member teaches, deduplicated across their batches. */
function taughtStudents(): DemoPerson[] {
  const seen = new Map<number, DemoPerson>();
  for (const c of MY_COHORTS) {
    for (const p of cohortMembers(c.id, c.size)) seen.set(p.id, p);
  }
  return [...seen.values()];
}

/**
 * Syllabus covered, stable per person.
 *
 * Read from `admin.ts`, which owns the figure, rather than seeded again here.
 * It used to be course 302's completion in this file and a flat 56 in the
 * officer's table, and then a second seeded key of its own, so the same aspirant
 * was a different percentage on every screen that named her. A centre in-charge
 * being rung about a trainee has to be looking at the number the caller is
 * reading out.
 */
function progressOf(p: DemoPerson): number {
  return syllabusCovered(p);
}

/**
 * The band a faculty member triages by.
 *
 * Deliberately wider than the programme officer's at-risk rules, and it stays a
 * separate judgement: an officer escalates a trainee whose documents are pending
 * at the district office, and a faculty member watches one who is behind on the
 * syllabus whether or not any rule has fired. Both are shown here, the band in
 * this column and the officer's rule as the reason beside it.
 */
function statusOf(progress: number, streak: number): "on_track" | "watch" | "at_risk" {
  if (progress < 30 || streak === 0) return "at_risk";
  if (progress < 55) return "watch";
  return "on_track";
}

function studentRow(p: DemoPerson) {
  const progress = progressOf(p);
  const cohort = MY_COHORTS.find((c) => cohortMembers(c.id, c.size).some((m) => m.id === p.id));
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
 *
 * Ids 501 to 507 belong to the schedule in `live-sessions.ts`, which every
 * aspirant also sees. The three rows here that carry those ids take their topic
 * from `sessionTitle`, and their day, hour and batch are copied from the same
 * place: one class showing at 6:30 AM on the aspirant's timetable and 6 PM on
 * the faculty member's is read as two classes, and the ids say they are one.
 * This file must therefore never mint a NEW id in that band. The classes this
 * faculty member has already taken are numbered in the 4xx block below, which
 * is the mission's earlier series and is his alone.
 *
 * `mine` is whether he scheduled the class. He leads these batches, so he can
 * open any room in them, but Group-II polity and the Telangana movement classes
 * are taken by the subject faculty member the aspirant's card names, and this
 * workspace must not offer to delete another person's class.
 */
interface ScheduleRow {
  id: number;
  topic: string;
  /** Signed offset from today. Negative is the past. */
  dayOffset: number;
  hour: number;
  minute: number;
  durationMinutes: number;
  status: "live" | "scheduled" | "ended";
  cohortId: number;
  provider: "meeting" | "webinar";
  recorded: boolean;
  /** Scheduled by this faculty member, so his to edit and to cancel. */
  mine: boolean;
}

const SCHEDULE: ScheduleRow[] = [
  {
    id: 501,
    topic: sessionTitle(501),
    dayOffset: 0,
    hour: 6,
    minute: 30,
    durationMinutes: 60,
    status: "live",
    cohortId: 11,
    provider: "meeting",
    recorded: false,
    mine: false,
  },
  {
    id: 502,
    topic: sessionTitle(502),
    dayOffset: 2,
    hour: 20,
    minute: 0,
    durationMinutes: 90,
    status: "scheduled",
    cohortId: 11,
    provider: "meeting",
    recorded: false,
    mine: false,
  },
  {
    id: 504,
    topic: sessionTitle(504),
    dayOffset: 7,
    hour: 20,
    minute: 0,
    durationMinutes: 75,
    status: "scheduled",
    cohortId: 12,
    provider: "webinar",
    recorded: false,
    mine: true,
  },
  {
    id: 481,
    topic: "Polity revision: fundamental rights, the writs and the questions they carry",
    dayOffset: -3,
    hour: 6,
    minute: 30,
    durationMinutes: 60,
    status: "ended",
    cohortId: 11,
    provider: "meeting",
    recorded: true,
    mine: true,
  },
  {
    id: 476,
    topic: "Previous paper walkthrough: general studies, question by question",
    dayOffset: -8,
    hour: 20,
    minute: 0,
    durationMinutes: 90,
    status: "ended",
    cohortId: 11,
    provider: "meeting",
    recorded: true,
    mine: true,
  },
  {
    id: 470,
    topic: "Banking awareness revision: the last quarter, and what a panel asks about it",
    dayOffset: -14,
    hour: 20,
    minute: 0,
    durationMinutes: 60,
    status: "ended",
    cohortId: 12,
    provider: "webinar",
    recorded: false,
    mine: true,
  },
];

/** The batch a class belongs to, named once, in `admin.ts`. */
function batchName(cohortId: number): string {
  return COHORTS.find((c) => c.id === cohortId)?.name ?? "Not in a batch";
}

/** How many people the batch has, which is how many are registered for its class. */
function batchSize(cohortId: number): number {
  return COHORTS.find((c) => c.id === cohortId)?.size ?? 0;
}

/**
 * A row in the shape `InstructorLiveSession` actually declares.
 *
 * The previous version returned a bare array of loosely-named fields, and the
 * page, which reads `.upcoming` / `.past` / `.past_total` off the response,
 * threw and rendered "Couldn't load your live sessions." Same rule as the ticket
 * handler: a wrong shape takes the route down, a missing one only empties it.
 */
/** How long the class marked live has been running. Matches `live-sessions.ts`. */
const LIVE_STARTED_MINUTES_AGO = 22;

function liveSession(s: ScheduleRow) {
  const ended = s.status === "ended";
  // Registered is the batch, not a number of its own. A class for a batch of 28
  // cannot have 40 people registered for it, and the turnout underneath is a
  // division of these two.
  const registered = batchSize(s.cohortId) || seededInt(`reg:${s.id}`, 18, 40);
  // Nobody has "attended" a class that has not happened, so a scheduled row
  // reports zero and the page hides its turnout block rather than showing 0%.
  const attendance = ended
    ? seededInt(`att:${s.id}`, Math.round(registered * 0.5), Math.round(registered * 0.9))
    : s.status === "live"
      ? Math.min(registered, seededInt(`live:${s.id}`, Math.round(registered * 0.4), registered))
      : 0;
  const hasRecording = ended && s.recorded;

  return {
    id: s.id,
    topic_name: s.topic,
    // The live row is anchored to NOW. This page derives live/scheduled/ended
    // from the clock rather than trusting a status field, so a fixed hour read
    // as "Scheduled" for all but one hour of the day.
    class_datetime:
      s.status === "live"
        ? iso(minutesAgo(LIVE_STARTED_MINUTES_AGO))
        : isoDaysAhead(s.dayOffset, s.hour, s.minute),
    timezone: "Asia/Kolkata",
    duration_minutes: s.durationMinutes,
    join_link: `/instructor/live-sessions?session=${s.id}`,
    is_upcoming: !ended,
    provider: s.provider,
    status: s.status,
    is_zoom: s.provider === "meeting" || s.provider === "webinar",
    is_webinar: s.provider === "webinar",
    is_google_meet: false,
    cohort_name: batchName(s.cohortId),
    password: "",
    // He leads these batches and is on every room as an alternative host, so any
    // class in them can be opened from here. Editing and cancelling are narrower:
    // a subject faculty member's class is not his to move or to delete, and a
    // workspace that offers both is offering an action that should fail.
    hostable: !ended,
    created_by_me: s.mine,
    editable: !ended && s.mine,
    registered,
    attendance,
    turnout: registered > 0 ? Math.round((attendance / registered) * 100) : null,
    has_recording: hasRecording,
    recording_url: hasRecording ? `/instructor/live-sessions?session=${s.id}&recording=1` : "",
  };
}

/**
 * The papers this faculty member has set.
 *
 * One list, read by the gradebook route and by the recent-submissions strip, so
 * a submission can never name a paper that is not on the paper list. Durations
 * are the real ones: an IBPS PO prelims paper is 100 questions in 60 minutes
 * with sectional timing, and a mock that says 45 minutes is teaching the wrong
 * clock. `admin.ts` sends the invitation and result emails for the same two ids.
 */
function assessments() {
  return [
    {
      // Named off the record in `admin.ts`, which the result emails, the officer's
      // drill-down and the aspirant's own scorecard all read, so the gradebook
      // cannot be the one screen calling this paper something else.
      id: MID_PROGRAMME_PAPER.id,
      title: MID_PROGRAMME_PAPER.title,
      slug: "tgpsc-group-2-mid-programme",
      is_draft: false,
      duration_minutes: 90,
      submissions: 24,
      pending_grading: 2,
      avg_score: 71 as number | null,
      created_at: isoDaysAgo(30),
    },
    {
      id: 903,
      title: "IBPS PO Prelims: full mock 3",
      slug: "ibps-po-prelims-full-mock-3",
      is_draft: false,
      duration_minutes: 60,
      submissions: 18,
      pending_grading: 0,
      avg_score: 68 as number | null,
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
      avg_score: null as number | null,
      created_at: isoDaysAgo(4),
    },
  ];
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
    batches: MY_COHORTS.filter((c) => c.status === "active").length,
    courses: myCourses().length,
    students: rows.length,
    active_students: rows.filter((r) => r.status !== "at_risk").length,
    avg_progress: avgProgress,
    completion_rate: Math.round(rows.filter((r) => r.progress >= 80).length / Math.max(1, rows.length) * 100),
    at_risk_count: atRisk.length,
    upcoming_sessions: SCHEDULE.filter((s) => s.status === "scheduled").length,
    live_now: SCHEDULE.filter((s) => s.status === "live").length,
    at_risk: atRisk.slice(0, 6).map((r) => {
      const person = students.find((p) => p.id === r.student_id);
      return {
        student_id: r.student_id,
        name: r.name,
        email: r.email,
        progress: r.progress,
        // The rules that flagged them, not just the flag, and the same rules the
        // programme officer's at-risk table applies, so a trainee is not "missed
        // the last two classes" on one screen and "no activity for a week" on
        // the other. A faculty member can act on either of those today; nobody
        // can act on the word "risk" on its own.
        //
        // Someone this workspace bands as at risk on syllabus alone trips no
        // rule, and says so plainly rather than borrowing one that did not fire.
        reason: person
          ? atRiskReasons(person, r.progress).join("; ") ||
            `Only ${r.progress}% of the syllabus covered`
          : `Only ${r.progress}% of the syllabus covered`,
      };
    }),
    top_performers: rankedLearners()
      .filter((p) => students.some((s) => s.id === p.id))
      .slice(0, 5)
      .map(statStudent),
    cohorts_detailed: MY_COHORTS.map((c) => {
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
    // Projected through `liveSession` rather than re-derived, so the strip on
    // the dashboard and the row on the live-sessions page cannot disagree about
    // when a class starts, how long it runs or how many people are registered.
    schedule: SCHEDULE.map((s) => {
      const row = liveSession(s);
      return {
        id: row.id,
        topic: row.topic_name,
        datetime: row.class_datetime,
        duration_minutes: row.duration_minutes,
        status: row.status,
        registered: row.registered,
        cohort_name: row.cohort_name,
        join_link: row.join_link,
      };
    }),
    // Papers picked from the two that are actually published. The list used to
    // name a "foundation diagnostic" that is on no paper list in this build, so
    // a submission opened onto a paper that does not exist.
    recent_submissions: taughtStudents()
      .slice(0, 6)
      .map((p, i) => ({
        submission_id: 9000 + i,
        student_name: p.full_name,
        assessment_title: seededPick(
          `sub:${p.id}`,
          assessments()
            .filter((a) => !a.is_draft)
            .map((a) => a.title),
        ),
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
    cohorts: MY_COHORTS.filter((c) => c.status === "active").length,
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
    MY_COHORTS.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      start_date: c.status === "completed" ? ymdDaysAgo(210) : ymdDaysAgo(120),
      end_date: c.status === "completed" ? ymdDaysAgo(40) : ymdDaysAhead(90),
      member_count: c.size,
      artifact_count: c.courseIds.length,
    })),

  "GET /instructor/api/cohorts/:cohortId/students/": (req) => {
    const c = MY_COHORTS.find((x) => x.id === Number(req.params.cohortId));
    if (!c) throw notFound("No batch with that record");
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
    if (!p) throw notFound("No aspirant with that record");
    const row = studentRow(p);
    return {
      ...row,
      profile_pic_url: p.profile_pic_url,
      college: p.college,
      courses: COURSES.filter((c) => c.enrolled).map((c) => ({
        id: c.id,
        title: c.title,
        progress: seededInt(`sc:${p.id}:${c.id}`, 4, 98),
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
  "GET /instructor/api/assessments/": () => assessments(),

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
    // The batch this class was actually for. It used to be batch 11 whichever
    // class you opened, so the banking batch's attendance dialog listed the
    // Group-II roster.
    const cohortId = row?.cohortId ?? MY_COHORTS[0].id;
    const members = cohortMembers(cohortId, batchSize(cohortId));
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
      hour: 19,
      minute: 0,
      durationMinutes: Number(body.duration_minutes ?? 60),
      status: "scheduled",
      cohortId: MY_COHORTS[0].id,
      provider,
      recorded: false,
      // Scheduled here, in this session, so it is his to edit and to cancel.
      mine: true,
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
    if (!row) throw notFound("No class with that record");
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
