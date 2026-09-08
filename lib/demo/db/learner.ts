/**
 * Derived learner state: points, streak, readiness and standing.
 *
 * Everything here is COMPUTED from the course seed rather than stored alongside
 * it. That is the rule that keeps the demo coherent: the dashboard's "62%", the
 * course card's progress bar and the journey board's completed-node count are
 * three renderings of one number, so they cannot contradict each other on
 * screen — which is exactly the kind of detail a prospect notices.
 */

import type {
  CourseReadiness,
  DashboardCourse,
  ReadinessBand,
  ReadinessCell,
  TodayGoal,
  UpNextNode,
} from "@/lib/types/dashboard";
import type { LeaderboardRow } from "@/lib/types/adaptive-journey";
import {
  COURSES,
  courseArt,
  courseDueAt,
  enrolledCourses,
  itemCounts,
  nextTopic,
  topicsOf,
  type DemoCourse,
} from "./courses";
import { STUDENT_PERSONA, rankedLearners } from "./people";
import { lastNDates, todayStart, ymd, daysAgo } from "../clock";
import { seededBool, seededInt } from "../random";

/** Map a percentage onto the product's four readiness bands. */
export function bandFor(percent: number | null): ReadinessBand {
  if (percent == null || percent <= 0) return "not-started";
  if (percent < 45) return "needs-work";
  if (percent < 75) return "building";
  return "strong";
}

export function cell(percent: number | null): ReadinessCell {
  return { percent, band: bandFor(percent) };
}

/**
 * The four readiness dimensions, derived from completion with a stable per-course
 * skew so the radar has shape. A course where all four read identically looks
 * generated; real learners are stronger at some dimensions than others.
 */
export function readinessFor(course: DemoCourse): CourseReadiness {
  const base = course.completion;
  const skew = (key: string, spread: number) =>
    base === 0 ? 0 : Math.max(4, Math.min(98, base + seededInt(`readiness:${course.id}:${key}`, -spread, spread)));

  const coverage = base === 0 ? 0 : Math.min(99, base + 6);
  const precision = skew("precision", 14);
  const craft = skew("craft", 18);
  const clutch = skew("clutch", 20);
  const overall = base === 0 ? 0 : Math.round((coverage + precision + craft + clutch) / 4);

  return {
    coverage: cell(coverage),
    precision: cell(precision),
    craft: cell(craft),
    clutch: cell(clutch),
    overall: cell(overall),
  };
}

/** Per-course skill breakdown shown on the dashboard card. */
function skillProfileFor(course: DemoCourse) {
  const skills = course.tags.slice(0, 5).map((skill, i) => {
    const percent =
      course.completion === 0
        ? 0
        : Math.max(12, Math.min(96, course.completion + seededInt(`skill:${course.id}:${i}`, -22, 22)));
    return { skill, percent, band: (percent >= 70 ? "strong" : "emerging") as "strong" | "emerging" };
  });

  const tracked = skills.length;
  const mastery =
    course.completion === 0
      ? null
      : Math.round(skills.reduce((sum, s) => sum + s.percent, 0) / Math.max(1, tracked));

  return {
    abilityIndex: course.completion === 0 ? null : Math.round(40 + course.completion * 0.55),
    fieldTier:
      course.completion === 0
        ? null
        : course.completion > 55
          ? ("intermediate" as const)
          : ("beginner" as const),
    mastery,
    skillsTracked: tracked,
    skills,
    aiTip: aiTipFor(course, skills),
  };
}

function aiTipFor(
  course: DemoCourse,
  skills: Array<{ skill: string; percent: number }>,
): string {
  if (course.completion === 0) {
    return `Start with the first module - it sets up everything ${course.title} builds on later.`;
  }
  const weakest = [...skills].sort((a, b) => a.percent - b.percent)[0];
  return weakest
    ? `${weakest.skill} is your weakest dimension here at ${weakest.percent}%. Two focused sessions would move it more than another pass over the material you already know.`
    : "Keep going - your pace on this course is ahead of your cohort.";
}

/** The next unfinished piece of work, as the dashboard's "up next" card. */
export function upNextFor(course: DemoCourse): UpNextNode | null {
  const next = nextTopic(course);
  if (!next) return null;

  const kind = next.topic.kinds[0];
  const typeLabel =
    kind === "coding" ? "coding" : kind === "quiz" ? "quiz" : kind === "video" ? "video" : kind === "assignment" ? "assignment" : "article";

  return {
    nodeId: next.topic.id,
    title: next.topic.title,
    type: typeLabel,
    points: kind === "assignment" ? 120 : kind === "coding" ? 60 : kind === "quiz" ? 40 : 25,
    weekNo: weekNoFor(course),
    ref: { submoduleId: next.topic.id },
    dueAt: courseDueAt(course),
    lockReason: null,
    why:
      next.topic.progress > 0
        ? "You started this and stopped partway. Finishing it is the cheapest progress available to you today."
        : `Next in ${next.module.title}.`,
  };
}

function weekNoFor(course: DemoCourse): number {
  const total = topicsOf(course).length;
  const done = topicsOf(course).filter((t) => t.progress === 100).length;
  return Math.max(1, Math.ceil(((done + 1) / Math.max(1, total)) * 12));
}

/** A course as the dashboard renders it. */
export function dashboardCourse(course: DemoCourse): DashboardCourse {
  return {
    id: course.id,
    title: course.title,
    cardImageUrl: courseArt(course),
    completionPct: course.completion,
    readiness: readinessFor(course),
    skillProfile: skillProfileFor(course),
    upNext: upNextFor(course),
    resumeSubmoduleId: nextTopic(course)?.topic.id ?? null,
    due: course.dueInDays == null
      ? null
      : {
          dueAt: courseDueAt(course),
          zeroAfter: null,
          penaltyNote:
            course.dueInDays <= 3
              ? "Late submissions lose 10% per day after the due date."
              : null,
        },
    leaderboardRank: courseRank(course),
    certificate: {
      enabled: true,
      pct: course.completion,
      threshold: course.certificateThreshold,
    },
  };
}

function courseRank(course: DemoCourse): number | null {
  if (!course.enrolled) return null;
  return seededInt(`rank:${course.id}`, 2, 24);
}

/** Total points: the sum the wallet, the nav chip and the leaderboard all read. */
export function totalPoints(): number {
  return STUDENT_PERSONA.points;
}

export function pointsThisWeek(): number {
  return seededInt("points:week", 320, 780);
}

/**
 * Which of the last N days the learner was active.
 *
 * The current streak is built as a genuinely unbroken run ending today, rather
 * than sprinkled at random — otherwise the calendar would show gaps while the
 * header claimed a 23-day streak, and the two are side by side on screen.
 */
export function activeDates(days = 120): Set<string> {
  const streak = STUDENT_PERSONA.streak;
  const dates = lastNDates(days);
  const active = new Set<string>();

  // The unbroken run ending today.
  for (let i = 0; i < streak; i++) active.add(ymd(daysAgo(i)));

  // Sparser history before the run, so the heatmap has texture.
  for (const date of dates) {
    if (active.has(date)) continue;
    if (seededBool(`active:${date}`, 0.55)) active.add(date);
  }
  return active;
}

export function streakSummary() {
  return {
    current: STUDENT_PERSONA.streak,
    best: Math.max(STUDENT_PERSONA.streak, 41),
    atRisk: false,
  };
}

/**
 * Today's three habits. Two are already done — a fully-empty goal card makes the
 * demo look unused, and a fully-complete one removes the call to action.
 */
export function todayGoal(): TodayGoal {
  const goals = [
    { key: "lesson" as const, label: "Complete a lesson", done: true },
    {
      key: "practice" as const,
      label: "15 minutes of practice",
      done: true,
      minutes: 22,
      targetMinutes: 15,
    },
    { key: "quiz" as const, label: "Take a quiz", done: false },
  ];

  const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const active = activeDates(14);
  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i);
    return {
      date: ymd(d),
      label: labels[(d.getUTCDay() + 6) % 7],
      active: active.has(ymd(d)),
      isToday: i === 6,
    };
  });

  const completedCount = goals.filter((g) => g.done).length;
  return {
    goals,
    completedCount,
    totalCount: goals.length,
    percent: Math.round((completedCount / goals.length) * 100),
    lastDays,
  };
}

/**
 * The cohort leaderboard.
 *
 * Built from the same ranked roster the admin student table and the community
 * leaderboard use, so a name at rank 3 here is at rank 3 everywhere.
 */
export function leaderboardRows(limit = 10): LeaderboardRow[] {
  return rankedLearners()
    .slice(0, limit)
    .map((person, i) => ({
      rank: i + 1,
      name: person.full_name,
      score: person.points,
      profile_pic_url: person.profile_pic_url,
      trend: (seededBool(`trend:${person.id}`, 0.45)
        ? "up"
        : seededBool(`trend2:${person.id}`, 0.5)
          ? "down"
          : "flat") as LeaderboardRow["trend"],
      is_current_user: person.id === STUDENT_PERSONA.id,
    }));
}

export function myRank(): { rank: number; percentile: number; rankDelta: number } {
  const all = rankedLearners();
  const rank = all.findIndex((p) => p.id === STUDENT_PERSONA.id) + 1;
  return {
    rank: Math.max(1, rank),
    percentile: Math.round(100 - (rank / Math.max(1, all.length)) * 100),
    rankDelta: 2,
  };
}

/** Overall progress across enrolled courses, used by the week-progress ring. */
export function overallProgress(): number {
  const list = enrolledCourses();
  if (list.length === 0) return 0;
  return Math.round(list.reduce((sum, c) => sum + c.completion, 0) / list.length);
}

/** Every course, for the catalogue; enrolled ones first. */
export function catalogue(): readonly DemoCourse[] {
  return [...COURSES].sort((a, b) => Number(b.enrolled) - Number(a.enrolled));
}

export { itemCounts, enrolledCourses, todayStart };
