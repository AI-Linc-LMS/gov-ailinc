/**
 * Live sessions.
 *
 * A deliberate spread of states, because the schedule is the point: one session
 * live right now, several upcoming, and past ones with recordings and AI
 * summaries attached. A list where everything is "upcoming" shows a calendar but
 * not the lifecycle.
 *
 * Join links point at the session detail page rather than a real meeting. There
 * is no meeting to join, and a dead Zoom link discovered mid-demo is worse than
 * one that opens the session it belongs to.
 *
 * The schedule is the mission's, so it reads like one: exam classes for the
 * government-jobs section, a trade practical streamed from a district skill
 * centre, an enterprise session with a visiting branch officer. Faculty are
 * taken from the roster by subject, never typed in as literal names, because the
 * last hardcoded host on this screen outlived the roster that contained him.
 *
 * Slots are early morning or evening in Asia/Kolkata. An aspirant on this
 * platform is usually working, farming or at a college during the day, and a
 * timetable full of 11 AM classes is the fastest way to tell an officer that
 * whoever built it has not met the candidate.
 */

import { defineRoutes } from "../router";
import { INSTRUCTOR_PERSONA, FACULTY } from "../../db/people";
import { COURSES } from "../../db/courses";
import { overlay } from "../../db/overlay";
import { iso, isoDaysAgo, isoDaysAhead, minutesAgo, nowMs, ymd, daysAgo, todayStart } from "../../clock";
import { seededInt } from "../../random";

const MODULE = "live-sessions";

interface DemoSession {
  id: number;
  topic: string;
  /** Negative = past, 0 = today, positive = future. */
  dayOffset: number;
  hour: number;
  minute: number;
  durationMinutes: number;
  instructor: string;
  courseId: number;
  /** The batch this sitting belongs to. Shown on the card instead of the course. */
  cohort: { id: number; name: string };
  attended?: boolean;
  live?: boolean;
  summary?: string;
  /**
   * Human recurrence text, or absent for a one-off.
   *
   * It replaced a boolean plus one hardcoded "Every Tuesday, 6:00 PM" for every
   * recurring row. Two problems with that: a weekly drill and a daily class read
   * identically, and the named weekday contradicted the card beside it, because
   * every date here is computed from today and today is not always a Tuesday.
   * Recurrence text therefore never names a weekday.
   */
  recurrence?: string;
}

/** Batches. Ids 11 and 12 are the two exam batches the admin module also lists. */
const BATCH = {
  groupTwo: { id: 11, name: "TGPSC Group-II Batch 2026, Warangal" },
  banking: { id: 12, name: "Banking Batch B-07, Hyderabad" },
  solar: { id: 21, name: "Solar PV Batch S-12, Warangal centre" },
  enterprise: { id: 22, name: "Enterprise Batch E-04, Khammam centre" },
  digital: { id: 23, name: "Digital Literacy Batch D-09, Suryapet centre" },
};

const SESSIONS: DemoSession[] = [
  {
    id: 501,
    // Named the way the catalogue names it (module 302004, "Indian Constitution
    // and polity") and without a paper number. Group-II paper numbering is stable
    // but it is not this file's to assert, and a wrong one is the kind of detail
    // the officers in the room correct out loud.
    topic: "Group-II polity: the amendment procedure, and how the paper asks it",
    dayOffset: 0,
    hour: 6,
    minute: 30,
    durationMinutes: 60,
    instructor: FACULTY[0].full_name,
    courseId: 302,
    cohort: BATCH.groupTwo,
    live: true,
    recurrence: "Every weekday, 6:30 AM",
  },
  {
    id: 502,
    topic: "Telangana movement doubt-clearing: Mulki rules, the Six Point Formula and GO 610",
    dayOffset: 2,
    hour: 20,
    minute: 0,
    durationMinutes: 90,
    instructor: FACULTY[0].full_name,
    courseId: 302,
    cohort: BATCH.groupTwo,
  },
  {
    id: 503,
    // Streamed from the centre, not held online: the trade is taught on a roof.
    // Saying where it happens is the difference between a class and a practical.
    topic: "Solar PV practical: rooftop survey, string sizing and commissioning, live from the Warangal centre",
    dayOffset: 4,
    hour: 7,
    minute: 0,
    durationMinutes: 120,
    instructor: FACULTY[2].full_name,
    courseId: 311,
    cohort: BATCH.solar,
  },
  {
    id: 504,
    // Hung off the banking track on purpose. Interview technique is the faculty
    // persona's own subject and it transfers across exams, but the stage itself
    // has to be real for the batch it is offered to, and the banking selection
    // ends at an interview. Which state recruitments carry an interview has
    // changed more than once, so the seed does not claim one for them.
    topic: "Mock interview panel briefing: how the board scores you, and answering what you do not know",
    dayOffset: 7,
    hour: 20,
    minute: 0,
    durationMinutes: 75,
    instructor: INSTRUCTOR_PERSONA.full_name,
    courseId: 307,
    cohort: BATCH.banking,
  },
  {
    id: 505,
    topic: "IBPS Prelims speed drill: quantitative aptitude under sectional timing",
    dayOffset: -3,
    hour: 19,
    minute: 30,
    durationMinutes: 60,
    instructor: FACULTY[1].full_name,
    courseId: 307,
    cohort: BATCH.banking,
    attended: true,
    summary:
      "Ran three sectional sets against the prelims clock, twenty minutes for quantitative " +
      "aptitude with no carry-over into the other sections. The recurring lesson was selection: " +
      "the candidates who took the data interpretation set first and left the two heaviest " +
      "arithmetic questions unattempted finished with a higher net score than the ones who " +
      "attempted everything. Also covered approximation, and when squaring near a base beats " +
      "long multiplication.",
    recurrence: "Twice a week, 7:30 PM",
  },
  {
    id: 506,
    topic: "SHG credit linkage: building a proposal a branch will read, with a visiting bank officer",
    dayOffset: -8,
    hour: 18,
    minute: 30,
    durationMinutes: 75,
    instructor: FACULTY[3].full_name,
    courseId: 317,
    cohort: BATCH.enterprise,
    attended: true,
    summary:
      "A branch officer walked through what a credit linkage proposal is actually read for: the " +
      "group's grading, the minutes book, the internal lending record and the repayment history. " +
      "Covered the difference between a cash credit limit and a term loan, and why a group asks " +
      "for the limit it can service rather than the largest one it can justify.",
  },
  {
    id: 507,
    topic: "Digital Seva counter: services, records and the end-of-day reconciliation",
    dayOffset: -12,
    hour: 19,
    minute: 0,
    durationMinutes: 45,
    instructor: FACULTY[4].full_name,
    courseId: 315,
    cohort: BATCH.digital,
    attended: false,
    summary:
      "Recording covers the services a centre is authorised to deliver at the counter, the " +
      "register kept against each transaction, and the reconciliation between receipts issued " +
      "and the wallet balance at close of day.",
  },
];

/** How long the session marked `live` has been running when a visitor arrives. */
const LIVE_STARTED_MINUTES_AGO = 22;

function sessionTime(s: DemoSession): string {
  // The live one is anchored to NOW, not to a fixed hour. A prospect opening the
  // demo at 10am would otherwise see a card badged LIVE next to a 6:30am start
  // time, and any page that derives "is it live?" from the clock would disagree
  // with the badge outright.
  if (s.live) return iso(minutesAgo(LIVE_STARTED_MINUTES_AGO));
  return s.dayOffset >= 0
    ? isoDaysAhead(s.dayOffset, s.hour, s.minute)
    : isoDaysAgo(Math.abs(s.dayOffset), s.hour, s.minute);
}

function status(s: DemoSession): "scheduled" | "live" | "ended" {
  if (s.live) return "live";
  return s.dayOffset < 0 ? "ended" : "scheduled";
}

function remindersOn(): number[] {
  return overlay.get<number[]>("live:reminders", [501, 502]);
}

function toApi(s: DemoSession) {
  const course = COURSES.find((c) => c.id === s.courseId);
  const state = status(s);
  const past = state === "ended";

  return {
    id: s.id,
    topic_name: s.topic,
    class_datetime: sessionTime(s),
    duration_minutes: s.durationMinutes,
    is_zoom: true,
    is_google_meet: false,
    zoom_meeting_type: "meeting" as const,
    // Points at the session's own page: there is no meeting to join, and a dead
    // external link found mid-demo is worse than one that goes somewhere real.
    join_link: `/live-sessions?session=${s.id}`,
    zoom_join_url: `/live-sessions?session=${s.id}`,
    zoom_password: null,
    zoom_recording_url: past ? `/live-sessions?session=${s.id}&recording=1` : null,
    zoom_meeting_ended_at: past ? sessionTime(s) : null,
    meeting_status: state,
    // Derived, not a literal: the countdown has to agree with the start time and
    // the duration on the same card.
    time_remaining_minutes:
      state === "live" ? Math.max(0, s.durationMinutes - LIVE_STARTED_MINUTES_AGO) : 0,
    my_attendance: past ? { attended: Boolean(s.attended), duration_seconds: s.attended ? s.durationMinutes * 60 - 180 : 0 } : null,
    zoom_ai_summary: s.summary ?? null,
    zoom_transcript_synced_at: past ? sessionTime(s) : null,
    join_gated: false,
    host_started: state === "live",
    notice_type: null,
    notice_reason: null,
    notice_at: null,
    previous_class_datetime: null,
    google_status: null,
    recording_link: past ? `/live-sessions?session=${s.id}&recording=1` : null,
    has_recording: past,
    course_detail: course ? { id: course.id, title: course.title } : null,
    adaptive_course_detail: course ? { id: course.id, title: course.title } : null,
    cohort_detail: s.cohort,
    instructor: s.instructor,
    attendance_count: seededInt(`att:${s.id}`, 28, 74),
    reminder_enabled: remindersOn().includes(s.id),
    recurrence_summary: s.recurrence ?? null,
    zoom_is_recurring: Boolean(s.recurrence),
    timezone: "Asia/Kolkata",
  };
}

defineRoutes(MODULE, {
  /**
   * How many people are in the meeting right now.
   *
   * `LiveJoinedCount` is `{live, count, source}` and the card reads all three:
   * `source` is what lets it say "unavailable on this plan" honestly instead of
   * printing "0 joined" over a session that clearly has people in it.
   */
  "GET /live-class/api/clients/:clientId/live-activities/:id/live-count/": (req) => {
    const s = SESSIONS.find((x) => x.id === Number(req.params.id));
    if (!s || !s.live) return { live: false, count: null, source: "not_live" as const };
    return {
      live: true,
      // Seeded, not random: the number must not jump every time the card polls.
      count: seededInt(`joined:${s.id}`, 24, 68),
      source: "zoom" as const,
    };
  },

  "GET /live-class/api/clients/:clientId/live-activities/": () =>
    [...SESSIONS]
      .sort((a, b) => new Date(sessionTime(a)).getTime() - new Date(sessionTime(b)).getTime())
      .map(toApi),

  "GET /live-class/api/clients/:clientId/live-activities/:id/": (req) => {
    const s = SESSIONS.find((x) => x.id === Number(req.params.id));
    return s ? toApi(s) : null;
  },

  /** The aspirant's own attendance summary, shown as KPI tiles and a week strip. */
  "GET /live-class/api/clients/:clientId/my-live-stats/": () => {
    const past = SESSIONS.filter((s) => s.dayOffset < 0);
    const attended = past.filter((s) => s.attended).length;
    const held = past.length;

    const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = daysAgo(6 - i);
      const date = ymd(d);
      const onDay = SESSIONS.find((s) => ymd(new Date(sessionTime(s))) === date);
      const isToday = date === ymd(todayStart());
      let state: "none" | "attended" | "missed" | "live" | "upcoming" = "none";
      if (onDay) {
        if (onDay.live) state = "live";
        else if (onDay.dayOffset >= 0) state = "upcoming";
        else state = onDay.attended ? "attended" : "missed";
      }
      return { day: labels[(d.getUTCDay() + 6) % 7], date, state: isToday && onDay?.live ? "live" : state };
    });

    return {
      sessions_attended: attended,
      sessions_held: held,
      attendance_rate: held ? Math.round((attended / held) * 100) : 0,
      cohort_avg_rate: 71,
      live_hours: 14.5,
      recordings_left: past.filter((s) => !s.attended).length,
      week,
    };
  },

  "GET /live-class/api/clients/:clientId/live-activities/:id/materials/": () => [],

  "GET /live-class/api/clients/:clientId/live-activities/:id/recording/": (req) => {
    const s = SESSIONS.find((x) => x.id === Number(req.params.id));
    const past = s ? s.dayOffset < 0 : false;
    return {
      provider: "zoom" as const,
      has_recording: past,
      // Not playable in-app: there is no media file, and offering a player that
      // opens onto nothing is worse than saying the recording lives in Zoom.
      playable_in_app: false,
      recording_link: past ? `/live-sessions?session=${req.params.id}&recording=1` : undefined,
      has_transcript: past,
      has_summary: past,
    };
  },

  /** Per-aspirant reminder toggle, persisted so it survives a reload. */
  "POST /live-class/api/clients/:clientId/live-activities/:id/reminder/": (req) => {
    const id = Number(req.params.id);
    const list = remindersOn();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    overlay.set("live:reminders", next);
    return { reminder_enabled: next.includes(id), updated_at: iso(new Date(nowMs())) };
  },
});
