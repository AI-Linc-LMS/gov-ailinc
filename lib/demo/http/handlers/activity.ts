/**
 * Activity tracking.
 *
 * `track-time` is a heartbeat: it fires on a timer from every page in the app,
 * including the signed-out auth screens. Unhandled, it was the single loudest
 * thing in the console — a warning every few seconds, on every route, which
 * buries any real error underneath it.
 *
 * The demo accepts the beats and discards them. Time-on-platform is seeded
 * (see the scorecard and heatmap handlers) rather than accumulated live,
 * because a prospect's ten-minute browse must not visibly rewrite a learner
 * profile that says 140 hours.
 */

import { defineRoutes } from "../router";
import { iso, nowMs } from "../../clock";

const MODULE = "activity";

defineRoutes(MODULE, {
  "POST /activity/clients/:clientId/track-time/": () => ({
    status: "ok",
    recorded_at: iso(new Date(nowMs())),
  }),

  /** Content-completion beacons from the article reader and video player. */
  "POST /activity/clients/:clientId/courses/:courseId/content/:contentId/": () => ({
    status: "ok",
  }),

  "GET /activity/clients/:clientId/student/live-attendance/": () => [],

  "POST /activity/clients/:clientId/student/mark-attendance/:activityId/": () => ({
    detail: "Attendance marked.",
  }),

  "GET /activity/clients/:clientId/student/live-sessions/:activityId/recording/": () => ({
    recording_url: null,
    transcript_url: null,
    detail: "No recording is attached to this session.",
  }),
});
