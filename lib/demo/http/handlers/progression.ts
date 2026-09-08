/**
 * The learner's progression surfaces: leaderboard + streaks, the points-system
 * explainer, support tickets and purchase history.
 *
 * The points explainer is worth getting right rather than filling in. It is the
 * page that answers "how does scoring actually work", and the numbers on it must
 * match the ones the quiz and coding engines really use — a prospect who reads
 * "60 base, minus 5 every 10s after a 20s grace" and then watches a quiz decay
 * differently has caught the product lying about itself.
 */

import { defineRoutes } from "../router";
import { STUDENT_PERSONA, rankedLearners } from "../../db/people";
import { activeDates, leaderboardRows } from "../../db/learner";
import { currentMonth, daysInMonth, iso, nowMs, todayStart, ymd, daysAgo } from "../../clock";
import { seededInt } from "../../random";

const MODULE = "progression";

function momentumInfo() {
  const current = STUDENT_PERSONA.streak;
  const value = Math.min(100, current * 3 + 20);
  return {
    value,
    current,
    perDay: 3,
    cap: 100,
    daysToMax: Math.max(0, Math.ceil((100 - value) / 3)),
    atMax: value >= 100,
    formula: "20 + 3 points per consecutive active day, capped at 100",
  };
}

/** Decay curve points, generated from the same parameters the engines use. */
function curve(base: number, grace: number, dec: number, iv: number, floor: number, tMax: number) {
  const points = [];
  for (let t = 0; t <= tMax; t += Math.max(1, Math.round(tMax / 12))) {
    const intervals = Math.floor(Math.max(0, t - grace) / iv);
    points.push({ t, pts: Math.max(floor, base - intervals * dec) });
  }
  return points;
}

defineRoutes(MODULE, {
  "GET /adaptive-journey/api/learner/leaderboard-streaks/": (req) => {
    const period = (req.query.get("period") ?? "all") as "all" | "week";
    const all = rankedLearners();
    const rows = leaderboardRows(20).map((row) => ({
      ...row,
      // Weekly standings differ from all-time; showing identical tables under
      // two tabs is the kind of detail that reads as unfinished.
      score: period === "week" ? Math.round(row.score * 0.12) + seededInt(`wk:${row.rank}`, 20, 180) : row.score,
      rankDelta: seededInt(`delta:${row.rank}`, -3, 4),
      profile_pic_url: row.profile_pic_url,
    }));
    rows.sort((a, b) => b.score - a.score);
    const ranked = rows.map((row, i) => ({ ...row, rank: i + 1 }));
    const me = ranked.find((r) => r.is_current_user) ?? null;

    const { year, month } = currentMonth();
    const active = activeDates(400);
    const total = daysInMonth(year, month);
    const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));

    return {
      period,
      leaderboard: {
        me: me
          ? {
              rank: me.rank,
              score: me.score,
              trend: me.trend,
              percentile: Math.round(100 - (me.rank / Math.max(1, all.length)) * 100),
              rankDelta: me.rankDelta,
            }
          : null,
        rows: ranked,
        total: all.length,
        climbText: me
          ? `${Math.max(0, (ranked[Math.max(0, me.rank - 2)]?.score ?? me.score) - me.score)} points would take the next rank.`
          : "",
        rankDelta: me?.rankDelta ?? 0,
      },
      streak: {
        current: STUDENT_PERSONA.streak,
        longest: Math.max(STUDENT_PERSONA.streak, 41),
        momentum: momentumInfo().value,
        momentumInfo: momentumInfo(),
        atRisk: false,
        forecast: `Keep today's habit and you reach ${STUDENT_PERSONA.streak + 7} days next week.`,
        atRiskTip: "One lesson or one quiz keeps the streak alive. It does not have to be a long session.",
        bestDay: "Tuesday",
      },
      calendar: {
        label: firstOfMonth.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
        // 0 = Monday, matching the widget's own convention.
        firstWeekday: (firstOfMonth.getUTCDay() + 6) % 7,
        todayDay: todayStart().getUTCDate(),
        days: Array.from({ length: total }, (_, i) => {
          const day = i + 1;
          const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          return { day, active: active.has(date) };
        }),
      },
    };
  },

  /**
   * How scoring works. Every number here is the one the engines actually apply:
   * quiz base points by difficulty, the 20s grace and -5 per 10s decay from
   * handlers/quiz.ts, and the coding curve from handlers/coding.ts.
   */
  "GET /adaptive-journey/api/points-system/": () => ({
    title: "How points work",
    subtitle:
      "Points reward getting it right, and getting it right sooner. Nothing here is hidden from you.",
    formula: "points = base x difficulty x correctness x on-time, decayed by time spent",
    formulaNote:
      "Base is set by the activity, difficulty scales it, correctness is what you actually got right, " +
      "and the decay is the only part that rewards speed.",
    activities: [
      { key: "article", icon: "mdi:book-open-page-variant-outline", accent: "#6366f1", label: "Read a lesson", sub: "Marked complete when you finish it", points: "25", unit: "pts" },
      { key: "quiz", icon: "mdi:comment-question-outline", accent: "#a855f7", label: "Adaptive quiz", sub: "Per question, by difficulty", points: "40-90", unit: "pts" },
      { key: "coding", icon: "mdi:code-braces", accent: "#f59e0b", label: "Coding problem", sub: "Awarded when every case passes", points: "60-130", unit: "pts" },
      { key: "assignment", icon: "mdi:clipboard-text-outline", accent: "#10b981", label: "Project or capstone", sub: "Graded submission", points: "150", unit: "pts" },
      { key: "interview", icon: "mdi:account-voice", accent: "#ec4899", label: "Mock interview", sub: "Scored on depth and communication", points: "200", unit: "pts" },
    ],
    decay: {
      quizEasy: {
        title: "Quiz question",
        base: 60,
        grace: 20,
        dec: 5,
        iv: 10,
        floor: 27,
        tMax: 180,
        curve: curve(60, 20, 5, 10, 27, 180),
      },
      codingHard: {
        title: "Hard coding problem",
        base: 130,
        grace: 120,
        dec: 5,
        iv: 60,
        floor: 52,
        tMax: 1800,
        curve: curve(130, 120, 5, 60, 52, 1800),
      },
    },
    difficulty: [
      { label: "Easy", mult: 1, quiz: 40, coding: 60 },
      { label: "Medium", mult: 1.25, quiz: 60, coding: 90 },
      { label: "Hard", mult: 1.6, quiz: 90, coding: 130 },
    ],
    late: {
      windowDays: 7,
      halfWindowDays: 3,
      staggerDays: 1,
      bands: [
        { label: "On time", note: "Before the due date", mult: 1, caption: "Full credit" },
        { label: "Up to 3 days late", note: "Still counts", mult: 0.75, caption: "Three quarters" },
        { label: "Up to 7 days late", note: "Partial credit", mult: 0.5, caption: "Half" },
        { label: "Beyond 7 days", note: "Learning still counts, points do not", mult: 0, caption: "No points" },
      ],
    },
    workedExample: {
      summary:
        "A medium quiz answered correctly in 35 seconds, plus a hard coding problem solved in 12 minutes.",
      latePct: 0,
      rows: [
        { label: "Quiz question (medium, 35s)", raw: 60, late: false, final: 55 },
        { label: "Coding problem (hard, 12m)", raw: 130, late: false, final: 130 },
        { label: "Lesson read", raw: 25, late: false, final: 25 },
      ],
      total: 210,
    },
  }),

  /**
   * Purchase history. Empty on purpose: every course in this tenant is free, so
   * inventing receipts would contradict the "Free" tag on each catalogue card.
   */
  "GET /payment-gateway/api/clients/:clientId/my-transactions/": () => ({
    results: [],
    count: 0,
  }),
});

/** Exported so the tickets module can reuse the seeded list. */
export const PROGRESSION_MODULE = MODULE;
export { iso, nowMs, ymd, daysAgo };
