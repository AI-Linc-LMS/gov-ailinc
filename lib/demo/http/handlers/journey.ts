/**
 * The journey board — a course's week-by-week map, plus its points wallet,
 * leaderboard and streak.
 *
 * One deliberate product choice for the demo: `contentLocked` is false, so every
 * step is open. The real product can gate a week until its predecessor passes,
 * and that is a genuine selling point — but a prospect exploring unsupervised who
 * clicks a locked node has been shown a wall instead of a feature. Progression is
 * still visible (done / current / available reflect real progress); nothing is
 * unreachable.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import type {
  JourneyBoard,
  JourneyNodeView,
  JourneyWeekView,
  PointsWallet,
} from "@/lib/types/adaptive-journey";
import {
  courseById,
  topicsOf,
  type DemoCourse,
  type DemoModule,
  type DemoTopic,
} from "../../db/courses";
import { STUDENT_PERSONA } from "../../db/people";
import { leaderboardRows, activeDates } from "../../db/learner";
import { isoDaysAgo, ymd, daysAgo } from "../../clock";
import { seededInt } from "../../random";

const MODULE = "journey";

/** Points a topic is worth, by the heaviest kind of work it contains. */
function basePointsFor(topic: DemoTopic): number {
  if (topic.kinds.includes("assignment")) return 150;
  if (topic.kinds.includes("coding")) return 90;
  if (topic.kinds.includes("quiz")) return 60;
  return 40;
}

function contentCounts(topic: DemoTopic) {
  return {
    articles: topic.kinds.filter((k) => k === "article").length,
    quizzes: topic.kinds.filter((k) => k === "quiz").length,
    coding: topic.kinds.filter((k) => k === "coding").length,
    videos: topic.kinds.filter((k) => k === "video").length,
  };
}

function nodeFor(topic: DemoTopic, order: number, isCurrent: boolean): JourneyNodeView {
  const base = basePointsFor(topic);
  const status = topic.progress === 100 ? "done" : isCurrent ? "current" : "available";
  const counts = contentCounts(topic);

  return {
    id: topic.id,
    type: "topic",
    title: topic.title,
    order,
    status,
    score: {
      earned: Math.round((base * topic.progress) / 100),
      total: base,
    },
    weight: 1,
    basePoints: base,
    // "always": the board is unlocked for the demo (see the note at the top).
    unlockRule: "always",
    lockReason: null,
    isCalibration: false,
    content: counts,
    itemCount: topic.kinds.length,
    questionCount: counts.quizzes > 0 ? seededInt(`q:${topic.id}`, 6, 12) : 0,
    proctored: false,
    durationMinutes: seededInt(`dur:${topic.id}`, 15, 55),
    ref: { submoduleId: topic.id },
  };
}

function weekFor(
  module: DemoModule,
  index: number,
  currentTopicId: number | null,
): JourneyWeekView {
  let order = 0;
  const nodes = module.topics.map((t) =>
    nodeFor(t, ++order, t.id === currentTopicId),
  );

  const earned = nodes.reduce((sum, n) => sum + n.score.earned, 0);
  const total = nodes.reduce((sum, n) => sum + n.score.total, 0);
  const done = nodes.filter((n) => n.status === "done").length;

  return {
    weekNo: index + 1,
    title: module.title,
    // No schedule, and no penalty strip, because `contentLocked` is false.
    //
    // These were populated at first, and the board rendered "Due Jul 2 - 34d
    // overdue" in red directly beneath its own banner reading "Every step is
    // open - no due dates, no late penalties". Two true-looking statements
    // contradicting each other on one screen is exactly what a prospect
    // notices. An unlocked board has no deadlines, so it shows none.
    schedule: null,
    penaltyStrip: null,
    totals: { earned, total },
    stepsDone: done,
    stepsTotal: nodes.length,
    nodes,
  };
}

function board(course: DemoCourse): JourneyBoard {
  const topics = topicsOf(course);
  const current = topics.find((t) => t.progress < 100) ?? null;

  const weeks = course.modules.map((m, i) => weekFor(m, i, current?.id ?? null));
  const pointsEarned = weeks.reduce((sum, w) => sum + w.totals.earned, 0);
  const pointsTotal = weeks.reduce((sum, w) => sum + w.totals.total, 0);
  const nodesDone = weeks.reduce((sum, w) => sum + w.stepsDone, 0);
  const nodesTotal = weeks.reduce((sum, w) => sum + w.stepsTotal, 0);

  return {
    contentLocked: false,
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      fieldTier: course.completion > 55 ? "intermediate" : "beginner",
      abilityIndex: Math.round(40 + course.completion * 0.55),
      enrolledCount: course.enrolledCount,
      certificateThreshold: course.certificateThreshold,
      certificateEnabled: true,
      certificateTemplateUrl: null,
      certificateTitle: `${course.title} - Certificate of Completion`,
      estHours: course.durationHours,
      sections: course.modules.length,
      items: topics.length,
      completionPct: course.completion,
      startedAt: isoDaysAgo(seededInt(`start:${course.id}`, 40, 150)),
    },
    progressCard: {
      pointsEarned,
      pointsTotal,
      onTimeRate: 0.92,
      nodesDone,
      nodesTotal,
      completionPct: course.completion,
    },
    // Calibration and the exit interview are both already done for this learner:
    // an outstanding calibration gate is the one thing that would stand between a
    // prospect and the course content they came to look at.
    calibration: {
      required: true,
      done: true,
      card: {
        assessmentId: course.id * 10 + 1,
        assessmentSlug: `${course.slug}-calibration`,
        title: `${course.title} - placement check`,
        points: 100,
        durationMinutes: 25,
        questionCount: 20,
        proctored: false,
        configured: true,
        generating: false,
        status: "done",
      },
    },
    interview: {
      required: true,
      done: course.completion >= 60,
      card: {
        templateId: course.id * 10 + 2,
        title: `${course.title} - exit interview`,
        topic: course.tags[0] ?? null,
        difficulty: course.difficulty,
        durationMinutes: 30,
        points: 200,
        configured: true,
        status: course.completion >= 60 ? "done" : "not_started",
      },
    },
    weeks,
  };
}

/** Wallet tier thresholds, mirroring the product's bronze→platinum ladder. */
function tierFor(total: number): { tier: PointsWallet["tier"]; display: string; next: number | null } {
  if (total >= 8000) return { tier: "platinum", display: "Platinum", next: null };
  if (total >= 5000) return { tier: "gold", display: "Gold", next: 8000 };
  if (total >= 2000) return { tier: "silver", display: "Silver", next: 5000 };
  return { tier: "bronze", display: "Bronze", next: 2000 };
}

function wallet(course: DemoCourse): PointsWallet {
  const b = board(course);
  const total = b.progressCard.pointsEarned;
  const { tier, display, next } = tierFor(total);

  const byWeek: Record<string, number> = {};
  b.weeks.forEach((w) => {
    if (w.totals.earned > 0) byWeek[String(w.weekNo)] = w.totals.earned;
  });

  const recent = topicsOf(course)
    .filter((t) => t.progress === 100)
    .slice(-6)
    .map((t, i) => {
      const base = basePointsFor(t);
      return {
        activity_type: t.kinds.includes("coding") ? "coding" : t.kinds.includes("quiz") ? "quiz" : "article",
        difficulty: t.kinds.includes("coding") ? "hard" : "medium",
        base,
        after_decay: base,
        correctness_factor: seededInt(`cf:${t.id}`, 70, 100) / 100,
        late_penalty_mult: 1,
        weight: 1,
        earned: base,
        earned_at: isoDaysAgo(2 + i * 3),
      };
    })
    .reverse();

  return {
    total,
    tier,
    tier_display: display,
    next_tier_threshold: next,
    progress_pct: next ? Math.round((total / next) * 100) : 100,
    by_week: byWeek,
    by_activity_type: {
      article: Math.round(total * 0.3),
      quiz: Math.round(total * 0.28),
      coding: Math.round(total * 0.34),
      video: Math.round(total * 0.08),
    },
    on_time_rate: 0.92,
    recent_events: recent,
    formula: {
      expression: "base x difficulty x correctness x on-time, decayed after the due date",
      difficulty_mult: { easy: 1, medium: 1.25, hard: 1.6 },
    },
    decay_curves: {
      quiz_easy: {
        base: 60,
        grace: 2,
        dec: 0.1,
        iv: 1,
        floor: 20,
        sample: Array.from({ length: 8 }, (_, t) => ({ t, p: Math.max(20, 60 - t * 6) })),
      },
      coding_hard: {
        base: 150,
        grace: 2,
        dec: 0.12,
        iv: 1,
        floor: 50,
        sample: Array.from({ length: 8 }, (_, t) => ({ t, p: Math.max(50, 150 - t * 14) })),
      },
    },
  };
}

defineRoutes(MODULE, {
  "GET /adaptive-journey/api/courses/:courseId/journey/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    return board(course);
  },

  "GET /adaptive-journey/api/courses/:courseId/points-wallet/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    return wallet(course);
  },

  "GET /adaptive-journey/api/courses/:courseId/leaderboard/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const rows = leaderboardRows(12);
    const me = rows.find((r) => r.is_current_user);
    return {
      me: me ? { rank: me.rank, score: me.score, trend: me.trend } : null,
      rows,
      climb_plan: me
        ? {
            target_rank: Math.max(1, me.rank - 1),
            points_gap: 498,
            text: "Two coding problems this week would take the next rank.",
          }
        : null,
    };
  },

  "GET /adaptive-journey/api/courses/:courseId/streak/": () => {
    const active = activeDates(60);
    const current = STUDENT_PERSONA.streak;
    return {
      current_len: current,
      longest_len: Math.max(current, 41),
      last_active_date: ymd(daysAgo(0)),
      momentum_score: Math.min(100, current * 3 + 20),
      momentum_info: {
        value: Math.min(100, current * 3 + 20),
        current,
        perDay: 3,
        cap: 100,
        daysToMax: Math.max(0, Math.ceil((100 - (current * 3 + 20)) / 3)),
        atMax: current * 3 + 20 >= 100,
        formula: "20 + 3 points per consecutive active day, capped at 100",
      },
      forecast_days: current + 7,
      at_risk: false,
      weekly_goal: {
        target: 5,
        text: `${Array.from(active).filter((d) => d >= ymd(daysAgo(6))).length} of 5 active days this week.`,
      },
    };
  },

  /** Calibration and exit-interview results, both already completed for this learner. */
  "GET /adaptive-journey/api/courses/:courseId/calibration-result/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const ability = Math.round(40 + course.completion * 0.55);
    return {
      done: true,
      ability_index: ability,
      field_tier: course.completion > 55 ? "intermediate" : "beginner",
      per_skill: Object.fromEntries(
        course.tags.slice(0, 5).map((t, i) => [t, seededInt(`cal:${course.id}:${i}`, 35, 92)]),
      ),
      per_difficulty: {
        easy: { seen: 8, correct: 7, rate: 0.88 },
        medium: { seen: 8, correct: 5, rate: 0.63 },
        hard: { seen: 4, correct: 2, rate: 0.5 },
      },
      timing: { answered: 20, timed: 20, total_seconds: 1180, avg_seconds: 59, median_seconds: 52 },
      pace: {
        label: "Steady",
        note: "You worked through the paper without rushing and did not run out of time.",
        style: "steady",
      },
      insight: {
        level_label: course.completion > 55 ? "Intermediate" : "Beginner",
        field_tier: course.completion > 55 ? "intermediate" : "beginner",
        ability_index: ability,
        headline: `You start ${course.title} at an ${course.completion > 55 ? "intermediate" : "early"} level.`,
        summary:
          "Your placement check put you above the median on fundamentals and below it on the applied questions. " +
          "The course has been ordered to spend less time on what you already know.",
        strengths: course.tags.slice(0, 2).map((t, i) => ({ dimension: t, percent: 78 - i * 6 })),
        growth_areas: course.tags.slice(2, 4).map((t, i) => ({ dimension: t, percent: 44 - i * 7 })),
        pace: {
          label: "Steady",
          note: "Comfortable with the time limit.",
          style: "steady",
        },
        how_ai_helps: [
          "Skips explanations of what you already demonstrated.",
          "Adds extra practice on the two dimensions you scored lowest on.",
          "Raises difficulty as your accuracy holds above 80%.",
        ],
        shows_right_wrong: true,
      },
    };
  },

  "GET /adaptive-journey/api/courses/:courseId/interview-result/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    if (course.completion < 60) return { done: false, insight: null };

    const ability = Math.round(40 + course.completion * 0.55);
    return {
      done: true,
      ability_index: ability,
      field_tier: "intermediate",
      insight: {
        level_label: "Intermediate",
        field_tier: "intermediate",
        ability_index: ability,
        headline: "You explain your reasoning clearly and recover well when challenged.",
        summary:
          "You talked through trade-offs rather than jumping to an answer, and corrected yourself once " +
          "without prompting. Depth on system design is the area with most room left.",
        strengths: [{ area: "Communicating trade-offs" }, { area: "Recovering from a wrong turn" }],
        growth_areas: [{ area: "System design depth" }, { area: "Estimating complexity aloud" }],
        how_ai_helps: [
          "Follow-up questions target the areas you were least certain on.",
          "Sessions get harder as your answers get more complete.",
        ],
        shows_marks: false,
      },
    };
  },
});
