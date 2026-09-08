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
  attended?: boolean;
  live?: boolean;
  summary?: string;
  recurring?: boolean;
}

const SESSIONS: DemoSession[] = [
  {
    id: 501,
    topic: "Live doubt-clearing: React rendering and effects",
    dayOffset: 0,
    hour: 18,
    minute: 0,
    durationMinutes: 60,
    instructor: INSTRUCTOR_PERSONA.full_name,
    courseId: 201,
    live: true,
    recurring: true,
  },
  {
    id: 502,
    topic: "Workshop: designing a REST API you will not regret",
    dayOffset: 2,
    hour: 19,
    minute: 0,
    durationMinutes: 90,
    instructor: INSTRUCTOR_PERSONA.full_name,
    courseId: 201,
  },
  {
    id: 503,
    topic: "pandas clinic: joins, reshaping and the rows that vanish",
    dayOffset: 4,
    hour: 18,
    minute: 30,
    durationMinutes: 60,
    instructor: FACULTY[0].full_name,
    courseId: 202,
  },
  {
    id: 504,
    topic: "Interview prep: talking through a problem out loud",
    dayOffset: 7,
    hour: 20,
    minute: 0,
    durationMinutes: 75,
    instructor: INSTRUCTOR_PERSONA.full_name,
    courseId: 203,
  },
  {
    id: 505,
    topic: "Live doubt-clearing: closures, async and the event loop",
    dayOffset: -3,
    hour: 18,
    minute: 0,
    durationMinutes: 60,
    instructor: INSTRUCTOR_PERSONA.full_name,
    courseId: 201,
    attended: true,
    summary:
      "Covered why closures capture variables rather than values, the microtask queue's priority " +
      "over macrotasks, and worked through three async ordering puzzles. Key question from the " +
      "room: why a for-loop with var logs the same number every time, and how let fixes it.",
    recurring: true,
  },
  {
    id: 506,
    topic: "Databases: indexes and reading an EXPLAIN plan",
    dayOffset: -8,
    hour: 19,
    minute: 0,
    durationMinutes: 75,
    instructor: FACULTY[1].full_name,
    courseId: 201,
    attended: true,
    summary:
      "Walked through three real slow queries and their plans. The recurring lesson: a sequential " +
      "scan is not automatically wrong, and adding an index to every column makes writes slower " +
      "without making reads faster.",
  },
  {
    id: 507,
    topic: "Cohort stand-up: capstone check-in",
    dayOffset: -12,
    hour: 17,
    minute: 30,
    durationMinutes: 45,
    instructor: FACULTY[2].full_name,
    courseId: 201,
    attended: false,
    summary:
      "Each team demoed progress on their capstone. Recording covers the four demos and the " +
      "feedback on scoping.",
  },
];

/** How long the session marked `live` has been running when a visitor arrives. */
const LIVE_STARTED_MINUTES_AGO = 22;

function sessionTime(s: DemoSession): string {
  // The live one is anchored to NOW, not to a fixed hour. A prospect opening the
  // demo at 10am would otherwise see a card badged LIVE next to a 6pm start time,
  // and any page that derives "is it live?" from the clock would disagree with
  // the badge outright.
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
    cohort_detail: { id: 11, name: "Autumn 2026 — Full-Stack" },
    instructor: s.instructor,
    attendance_count: seededInt(`att:${s.id}`, 28, 74),
    reminder_enabled: remindersOn().includes(s.id),
    recurrence_summary: s.recurring ? "Every Tuesday, 6:00 PM" : null,
    zoom_is_recurring: Boolean(s.recurring),
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

  /** The learner's own attendance summary, shown as KPI tiles and a week strip. */
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

  /** Per-student reminder toggle, persisted so it survives a reload. */
  "POST /live-class/api/clients/:clientId/live-activities/:id/reminder/": (req) => {
    const id = Number(req.params.id);
    const list = remindersOn();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    overlay.set("live:reminders", next);
    return { reminder_enabled: next.includes(id), updated_at: iso(new Date(nowMs())) };
  },
});
