/**
 * The learner's progression surfaces: leaderboard + streaks, the points-system
 * explainer, support tickets and purchase history.
 *
 * The points explainer is worth getting right rather than filling in. It is the
 * page that answers "how does scoring actually work", and every number on it is
 * the one the quiz engine really applies: an aspirant who reads "60 base, minus 5
 * every 10s after a 20s grace" and then watches a quiz decay differently has
 * caught the product lying about itself.
 *
 * Re-contented for this tenant by DELETING the coding row rather than renaming
 * it. The catalogue has no coding topic (see `db/coding-bank.ts` for why), so a
 * "Coding problem, 60-130 pts" line would have advertised points no aspirant on
 * this instance can earn. The two curves the page draws are now the easy and the
 * hard QUIZ question, both taken straight from `handlers/quiz.ts`.
 *
 * One row is still wrong and cannot be fixed from here: `DifficultyRow` in
 * `lib/types/points-system.ts` requires a `coding` number, and
 * `components/points-system/PointsSystemContent.tsx` prints it as
 * "Quiz N · Coding N". Both are outside this module. The values below are
 * therefore left at what the coding engine would really award, since a wrong
 * number is worse than an unused one, and the column is flagged in the handover.
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
   * How scoring works. Every number here is the one the engine actually applies:
   * the quiz base points by difficulty (40 / 60 / 90) and the 20s grace with
   * -5 per 10s decay, all read off `BASE_POINTS` and `decayCurve` in
   * handlers/quiz.ts.
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
      { key: "calibration", icon: "mdi:target", accent: "#f59e0b", label: "Placement check", sub: "Taken once, when you start a course", points: "100", unit: "pts" },
      { key: "assignment", icon: "mdi:clipboard-text-outline", accent: "#10b981", label: "Assignment or field task", sub: "Graded submission", points: "150", unit: "pts" },
      { key: "interview", icon: "mdi:account-voice", accent: "#ec4899", label: "Mock interview", sub: "Scored on depth and communication", points: "200", unit: "pts" },
    ],
    // The two keys are fixed by `PointsSystem` in lib/types/points-system.ts and
    // by the component that reads `data.decay.quizEasy` / `data.decay.codingHard`
    // by name, neither of which this module owns. What they CARRY is ours, so
    // the second slot draws the hard quiz question rather than a coding problem
    // no course here sets. Both specs match `decayCurve` in handlers/quiz.ts
    // exactly: base 40 for easy and 90 for hard, a 20s grace, then 5 points every
    // 10s down to a floor of 45 per cent of base.
    decay: {
      quizEasy: {
        title: "Easy quiz question",
        base: 40,
        grace: 20,
        dec: 5,
        iv: 10,
        floor: 18,
        tMax: 180,
        curve: curve(40, 20, 5, 10, 18, 180),
      },
      codingHard: {
        title: "Hard quiz question",
        base: 90,
        grace: 20,
        dec: 5,
        iv: 10,
        floor: 41,
        tMax: 180,
        curve: curve(90, 20, 5, 10, 41, 180),
      },
    },
    // `coding` is required by DifficultyRow and rendered by a component this
    // module does not own (see the note at the top of the file). It holds the
    // coding engine's real base points so that the number, if a reader ever sees
    // it, is at least true of the product rather than invented.
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
        { label: "On time", note: "Before the due date, where a batch sets one", mult: 1, caption: "Full credit" },
        { label: "Up to 3 days late", note: "Still counts", mult: 0.75, caption: "Three quarters" },
        { label: "Up to 7 days late", note: "Partial credit", mult: 0.5, caption: "Half" },
        { label: "Beyond 7 days", note: "Learning still counts, points do not", mult: 0, caption: "No points" },
      ],
    },
    // Arithmetic worth checking by hand, because a worked example that does not
    // add up is read as proof that none of the other numbers do either. Medium
    // at 35s: 15s past the grace is one interval, 60 - 5 = 55. Hard at 70s: 50s
    // past the grace is five intervals, 90 - 25 = 65. A lesson does not decay.
    workedExample: {
      summary:
        "A medium quiz question answered correctly in 35 seconds, a hard one in 70 seconds, and a lesson read.",
      latePct: 0,
      rows: [
        { label: "Quiz question (medium, 35s)", raw: 60, late: false, final: 55 },
        { label: "Quiz question (hard, 70s)", raw: 90, late: false, final: 65 },
        { label: "Lesson read", raw: 25, late: false, final: 25 },
      ],
      total: 145,
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
