/**
 * The aspirant's dashboard, the first screen a visitor sees after signing in and
 * the one that has to carry the most.
 *
 * The briefing is written to sound like the product's own voice: specific about
 * what happened, specific about what to do next, and never generically
 * encouraging. "Keep it up, you are doing great" is what a demo says. "The
 * Telangana movement unit is the least covered part of your syllabus, at 34%,
 * and it is the one your last two tests lost marks in" is what a product says.
 *
 * The aspirant persona is enrolled on an exam course, a trade course and an
 * enterprise course at once, so copy that assumes previous papers and a
 * cut-off reads as written for somebody else on three of her four cards. Where
 * the wording depends on that, it is chosen from the course's own category.
 *
 * Every number is derived from the same course seed the cards below it read, so
 * the paragraph cannot contradict the tiles it sits above.
 */

import { defineRoutes } from "../router";
import type { DemoRequest } from "../types";
import type { LearnerDashboard } from "@/lib/types/dashboard";
import {
  dashboardCourse,
  enrolledCourses,
  leaderboardRows,
  myRank,
  overallProgress,
  pointsThisWeek,
  streakSummary,
  todayGoal,
  totalPoints,
  upNextFor,
  activeDates,
} from "../../db/learner";
import {
  COURSES,
  nextTopic,
  topicsOf,
  type DemoCourse,
  type DemoTopic,
} from "../../db/courses";
import {
  COHORTS,
  MID_PROGRAMME_PAPER,
  STUDENT_BATCH_ID,
  interviewSittingFor,
  midProgrammeScore,
} from "./admin";
import { STUDENT_PERSONA, personByEmail, rankedLearners } from "../../db/people";
import { currentMonth, daysInMonth, iso, isoDaysAgo, nowMs, ymd, daysAgo } from "../../clock";
import { seededInt, seededPick } from "../../random";

const MODULE = "dashboard";

/** Course titles, for surfaces that show which course a person is known for. */
const CATALOGUE_TITLES = COURSES.map((c) => c.title);

/** Momentum: a 0-100 score that climbs with the streak and caps out. */
function momentumInfo() {
  const current = STUDENT_PERSONA.streak;
  const perDay = 3;
  const cap = 100;
  const value = Math.min(cap, current * perDay + 20);
  return {
    value,
    current,
    perDay,
    cap,
    daysToMax: Math.max(0, Math.ceil((cap - value) / perDay)),
    atMax: value >= cap,
    formula: "20 + 3 points per consecutive active day, capped at 100",
  };
}

/**
 * The aspirant's skills, scored, in one place.
 *
 * A skill here is a course tag, and it keeps the course it came off so the
 * advice attached to it can be written in that track's vocabulary.
 *
 * Taken a round at a time across her enrolled courses rather than four tags
 * off the first course and then four off the second: reading down the courses
 * in order filled the list before it reached the fourth, so the enterprise
 * course she is enrolled on appeared on no skills card and in no weak area.
 *
 * The briefing and the scorecard both name a weakest skill and put a percentage
 * on it, and they used to work it out two different ways, so the briefing could
 * open with a skill at 20% above a table putting the same skill at 61%.
 */
function skillScores() {
  const courses = enrolledCourses();
  const perCourse = 3;
  const seen = new Set<string>();

  return Array.from({ length: perCourse }, (_, round) =>
    courses.map((course) => ({ tag: course.tags[round], course })),
  )
    .flat()
    .filter(({ tag }) => {
      if (!tag || seen.has(tag)) return false;
      seen.add(tag);
      return true;
    })
    .slice(0, 10)
    .map(({ tag, course }, i) => {
      const score = seededInt(`scskill:${tag}`, 38, 92);
      return {
        skill: tag,
        course,
        score,
        band: score >= 75 ? "strong" : score >= 50 ? "developing" : "needs work",
        trend: i % 3 === 0 ? "up" : i % 3 === 1 ? "flat" : "up",
      };
    });
}

/** The skills she is furthest behind on, weakest first. */
function weakestSkills(count: number) {
  return [...skillScores()].sort((a, b) => a.score - b.score).slice(0, count);
}

/**
 * The daily briefing.
 *
 * Deliberately references the learner's actual weakest course and its actual
 * next item, so the copy changes if the seed changes rather than being a fixed
 * paragraph that could contradict the cards beneath it.
 */
function briefing() {
  const courses = enrolledCourses();
  const weakest = [...courses].sort((a, b) => a.completion - b.completion)[0];
  const strongest = [...courses].sort((a, b) => b.completion - a.completion)[0];
  const next = weakest ? nextTopic(weakest) : null;
  const weakestSkill = weakestSkills(1)[0] ?? null;

  const actions = courses
    .map((course) => {
      const up = upNextFor(course);
      if (!up) return null;
      return {
        label: up.title,
        course: course.title,
        route: `/adaptive-courses/${course.id}/submodule/${up.nodeId}`,
        points: up.points,
        kind: up.type,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .slice(0, 3);

  return {
    headline: `You have covered ${overallProgress()}% of your syllabus and you are on a ${STUDENT_PERSONA.streak}-day streak.`,
    lastWeek: `Last week you finished ${seededInt("briefing:lastweek", 6, 12)} topics and quizzes and were active every day. ${strongest?.title ?? "Your strongest course"} moved the most.`,
    thisWeek: {
      focus: weakest
        ? `Give ${weakest.title} the time this week. It is the course you have covered least, at ${weakest.completion}%.`
        : "Hold your pace across your courses.",
      course: weakest?.title ?? "",
    },
    today: next
      ? `Start with "${next.topic.title}". It opens the rest of ${next.module.title}.`
      : "Nothing is pending today. A practice quiz would hold the streak.",
    // The weakest SKILL, which is not the same thing as the weakest course and
    // is the figure her scorecard's skills table prints for it. The percentage
    // used to be the weakest course's completion minus eight, so the paragraph
    // and the table disagreed about the same named skill.
    weakestSkill: weakestSkill
      ? {
          skill: weakestSkill.skill,
          course: weakestSkill.course.title,
          percent: weakestSkill.score,
          fixSuggestion: revisionAdvice(weakestSkill.skill, weakestSkill.course),
          route: `/adaptive-courses/${weakestSkill.course.id}`,
        }
      : null,
    actions,
    focusRoute: weakest ? `/adaptive-courses/${weakest.id}` : "/adaptive-courses",
    source: "ai",
  };
}

/**
 * What the aspirant has actually got through, counted off the syllabus.
 *
 * Every figure is the number of completed topics of that kind across her
 * enrolled courses, so each one can say what it counted. Videos and coding
 * problems come back as zero because this catalogue contains neither: the
 * scorecard used to seed both, and a card reading "54 videos watched" on a
 * platform with no video in it is the first number an official checks.
 */
function consumption(hours: number) {
  const done = enrolledCourses().flatMap((c) => topicsOf(c).filter((t) => t.progress === 100));
  const count = (kind: DemoTopic["kinds"][number]) =>
    done.filter((t) => t.kinds.includes(kind)).length;

  return {
    videos_watched: count("video"),
    articles_read: count("article"),
    quizzes_attempted: count("quiz"),
    coding_problems_solved: count("coding"),
    assignments_submitted: count("assignment"),
    total_time_spent_seconds: hours * 3600,
  };
}

/**
 * How to work on a weak area, in the vocabulary of the track it belongs to.
 *
 * One sentence for all four categories reads as written for none of them. This
 * aspirant is enrolled on a Group-II course, a banking course, a rooftop solar
 * trade and an enterprise course at the same time, and "with the previous papers
 * open beside you" is advice for two of the four and nonsense for the other two:
 * nobody revises string sizing against a previous paper.
 */
function revisionAdvice(skill: string, course: DemoCourse | undefined): string {
  const alongside =
    course?.category === "rural-employment-vocational"
      ? "at the centre, with the job sheet and the tools in front of you"
      : course?.category === "rural-entrepreneurship"
        ? "with your own costing and your bank paperwork open beside you"
        : "with the previous papers open beside you";
  return `Two sittings on ${skill} this week, ${alongside}, would move this further than another read of what you have already covered.`;
}

/** The batch the aspirant sits in, named where every other screen names it. */
function myBatchName(): string {
  return COHORTS.find((c) => c.id === STUDENT_BATCH_ID)?.name ?? "Not in a batch";
}

/**
 * The scorecard, in one place.
 *
 * `full` adds the sections the dashboard preview endpoint skips. Building both
 * from one function is what keeps the preview card and the full page telling the
 * same story. A prospect who sees "Proficient, rank 2" on the dashboard and then
 * opens the scorecard must not find different numbers.
 */
function scorecardPayload(full: boolean) {
  const courses = enrolledCourses();
  const hours = seededInt("scorecard:hours", 90, 160);
  const current = courses[0] ? nextTopic(courses[0]) : null;
  const myInterview = interviewSittingFor(STUDENT_PERSONA);
  const myPaper = midProgrammeScore(STUDENT_PERSONA);

  const base = {
    scorecard_config: {
      enabled_modules: full
        ? ["overview", "learning_consumption", "skills", "weak_areas", "assessments", "mock_interviews", "behavioral", "comparative", "achievements", "action_panel"]
        : ["overview", "learning_consumption", "skills", "assessments"],
    },
    overview: {
      student_name: STUDENT_PERSONA.full_name,
      // Her own course and her own batch, not a programme name typed in here.
      // The batch is the one the programme officer's table and the faculty
      // gradebook list her under.
      program_name: courses[0]?.title ?? "-",
      cohort: myBatchName(),
      current_week: 7,
      // The module she is actually in, not the course title printed under a
      // heading that says Module.
      current_module: current?.module.title ?? courses[0]?.title ?? "-",
      overall_performance_score: overallProgress(),
      // Grade follows the score rather than being asserted. A card reading
      // "38/100 Proficient" invites the reader to distrust every other number
      // on the page.
      overall_grade:
        overallProgress() >= 75 ? "Advanced" : overallProgress() >= 50 ? "Proficient" : "Developing",
      total_time_spent_seconds: hours * 3600,
      // Two of the three classes that have already been held. `live-sessions.ts`
      // owns the schedule and computes the same figure for the attendance tile
      // on the live classes page, and the two are read one after the other by
      // anyone clicking through the demo, so this is not a rounder, kinder
      // number of its own.
      attendance_percentage: 67,
      rank_in_cohort: myRank().rank,
      total_students: rankedLearners().length,
      // These three were omitted, and the mapper defaults a missing number to 0.
      // The scorecard therefore claimed a 0-day streak and 0% completion on the
      // same screen as a nav badge reading 23 and a dashboard reading 38%.
      // Derived from the same records those surfaces use, so they cannot drift.
      active_days_streak: STUDENT_PERSONA.streak,
      total_days_active: STUDENT_PERSONA.streak + seededInt("scorecard:priordays", 24, 58),
      completion_percentage: overallProgress(),
      course_progress: courses.map((c) => ({
        course_id: c.id,
        course_name: c.title,
        current_week: Math.max(1, Math.round((c.completion / 100) * c.modules.length * 2)),
        current_module: c.modules[0]?.title ?? "-",
      })),
    },
    learning_consumption: consumption(hours),
  };

  if (!full) return base as typeof base & Record<string, never>;

  // The same scored list the briefing reads. `course` is dropped on the way out:
  // it is what the advice below is written from, not a field the skills card
  // declares.
  const scored = skillScores();
  const skills = scored.map(({ skill, score, band, trend }) => ({ skill, score, band, trend }));
  const weakest = weakestSkills(3);

  return {
    ...base,
    skills,
    weak_areas: {
      areas: weakest.map((s) => ({
        skill: s.skill,
        score: s.score,
        recommendation: revisionAdvice(s.skill, s.course),
      })),
    },
    performance_trends: {
      granularity: "weekly",
      points: Array.from({ length: 8 }, (_, i) => ({
        label: `Week ${i + 1}`,
        score: seededInt(`trend:${i}`, 52, 88),
      })),
    },
    // The paper the faculty gradebook lists and the result email announced, off
    // the one record all of them read, so her mark here is her mark on the
    // officer's drill-down and in her own achievements below.
    assessment_performance: [
      {
        name: MID_PROGRAMME_PAPER.title,
        score: myPaper,
        date: isoDaysAgo(MID_PROGRAMME_PAPER.daysAgo),
        percentile: 72,
      },
    ],
    // The sitting `admin.ts` records for her, which is the same board and the
    // same score the officer's mock interview list shows and her learning
    // journey opens onto. It used to claim two attempts averaging 71 with a best
    // of 78, on a seed that holds one sitting per person.
    mock_interview_performance: {
      attempts: 1,
      average_score: myInterview.score,
      best_score: myInterview.score,
      // What a selection board actually marks against: whether the answer is
      // correct, whether it is said clearly, how far it goes when pressed, and
      // whether it is organised rather than recited.
      dimensions: [
        { dimension: "Accuracy", score: 80 },
        { dimension: "Communication", score: 84 },
        { dimension: "Depth", score: 58 },
        { dimension: "Structure", score: 71 },
      ],
    },
    behavioral_metrics: {
      consistency: 88,
      streak_days: STUDENT_PERSONA.streak,
      avg_session_minutes: 42,
      // The two windows this platform is used in. A working or farming aspirant
      // studies before the day starts and after it ends, which is also why the
      // 6:30 AM class on her timetable is not a mistake.
      preferred_time: "Early mornings and evenings",
      on_time_rate: 92,
    },
    comparative_insights: {
      cohort_average: 61,
      your_score: overallProgress(),
      percentile: myRank().percentile,
      ahead_of: `${myRank().percentile}% of your cohort`,
    },
    achievements: [
      {
        title: `${STUDENT_PERSONA.streak}-day streak`,
        description: "Longest run of active days in your batch this month",
        earned_at: isoDaysAgo(0),
      },
      {
        title: "Mid-programme test cleared",
        description: `Scored ${myPaper}% on the Group-II mid-programme test`,
        earned_at: isoDaysAgo(MID_PROGRAMME_PAPER.daysAgo),
      },
      {
        title: "First module completed",
        description: "Finished every topic in the opening module of your foundation course",
        earned_at: isoDaysAgo(30),
      },
    ],
    // Each action opens the course the weak skill belongs to, not the catalogue.
    // An action panel that lands you on a list of nineteen courses has told you
    // what to work on and then made you find it.
    action_panel: {
      actions: weakest.slice(0, 2).map((s) => ({
        label: `Revise ${s.skill}`,
        reason: `Your weakest area at ${s.score}%, in ${s.course.title}`,
        route: `/adaptive-courses/${s.course.id}`,
      })),
    },
  };
}


/**
 * The name to greet, for whoever is actually signed in.
 *
 * A full administrator in this product keeps a learner view and toggles into
 * Admin Mode, so /dashboard is a legitimate destination for them. What was not
 * legitimate was the greeting: the learner payload hard-coded the student
 * persona, so signing in as Priya Nair and landing on the dashboard said
 * "WELCOME BACK, ANANYA RAO". A prospect reads that as the wrong account, or a
 * broken build.
 *
 * The seeded progress underneath stays as it is. The demo's job is to show a
 * populated product, and staff are not enrolled learners; the name is the part
 * that has to be true.
 */
function viewerName(auth: DemoRequest["auth"]): string {
  if (!auth) return STUDENT_PERSONA.full_name;
  return personByEmail(auth.email)?.full_name ?? STUDENT_PERSONA.full_name;
}

function learnerDashboard(auth: DemoRequest["auth"]): LearnerDashboard {
  const courses = enrolledCourses();
  const streak = streakSummary();

  return {
    profile: {
      name: viewerName(auth),
      weekNo: 7,
      weekDueAt: null,
      weekProgressPct: overallProgress(),
      streakDays: streak.current,
      bestStreak: streak.best,
    },
    aggregate: {
      totalPoints: totalPoints(),
      pointsThisWeek: pointsThisWeek(),
      streak,
      momentum: momentumInfo().value,
      momentumInfo: momentumInfo(),
      // A FRACTION, not a percentage: StatCards renders `onTimeRate * 100`.
      onTimeRate: 0.92,
      overallMasteryAvg: overallProgress(),
      cohortRank: {
        bestRank: myRank().rank,
        rankDelta: myRank().rankDelta,
        perCourse: Object.fromEntries(
          courses.map((c) => [String(c.id), seededInt(`rank:${c.id}`, 2, 24)]),
        ),
      },
    },
    courses: courses.map(dashboardCourse),
    crossCourseUpNext: courses
      .map((course) => {
        const up = upNextFor(course);
        if (!up) return null;
        return {
          ...up,
          courseId: course.id,
          courseTitle: course.title,
          resumeSubmoduleId: nextTopic(course)?.topic.id ?? null,
        };
      })
      .filter((n): n is NonNullable<typeof n> => n !== null),
    leaderboard: {
      me: myRank(),
      rows: leaderboardRows(10),
      aiTip: `You are ${Math.max(1, leaderboardRows(3)[0].score - totalPoints())} points behind the top of your batch. Two practice quizzes would close most of it.`,
    },
    todayGoal: todayGoal(),
    briefing: briefing(),
    generatedAt: iso(new Date(nowMs())),
  };
}

defineRoutes(MODULE, {
  "GET /adaptive-journey/api/learner/dashboard/": (req) => learnerDashboard(req.auth),

  "GET /adaptive-journey/api/learner/points-total/": () => ({ total: totalPoints() }),

  /**
   * The migration banner that invites legacy-course users into adaptive courses.
   * Switched off: this demo's tenant is adaptive-native, so the banner would be
   * telling a prospect to migrate away from something they have not seen.
   */
  "GET /adaptive-quiz/api/promotion/": () => ({
    eligible: false,
    show_banner: false,
    show_intro_modal: false,
    has_prior_courses: false,
  }),
  "GET /adaptive-course/api/promotion/": () => ({
    eligible: false,
    show_banner: false,
    show_intro_modal: false,
    has_prior_courses: false,
  }),
  "POST /adaptive-quiz/api/promotion/dismiss/": () => ({ detail: "Dismissed" }),
  "POST /adaptive-course/api/promotion/dismiss/": () => ({ detail: "Dismissed" }),

  /** Right-rail "Today's leaders": who put in the most time today. */
  "GET /api/clients/:clientId/student/daily-progress-leaderboard/": () =>
    rankedLearners()
      .slice(0, 8)
      .map((person, i) => ({
        user: {
          id: person.id,
          user_name: person.full_name,
          profile_pic_url: person.profile_pic_url,
        },
        name: person.full_name,
        score: seededInt(`daily:${person.id}`, 800, 9000),
        rank: i + 1,
        college: person.college,
        linkedin_url: person.linkedin_url,
      }))
      .sort((a, b) => b.score - a.score)
      .map((row, i) => ({ ...row, rank: i + 1 })),

  "GET /api/clients/:clientId/overall-leaderboard/": (req) => {
    const limit = Number(req.query.get("limit") ?? 20);
    return rankedLearners()
      .slice(0, limit)
      .map((person, i) => ({
        id: person.id,
        name: person.full_name,
        marks: person.points,
        rank: i + 1,
        profile_pic_url: person.profile_pic_url,
        college: person.college,
        linkedin_url: person.linkedin_url,
        email: person.email,
        user_name: person.full_name,
        // Stable per person and taken from the catalogue. It used to be one
        // course title from the build this was forked from, printed against
        // every aspirant on the board.
        course_name: seededPick(`lbcourse:${person.id}`, CATALOGUE_TITLES),
      }));
  },

  /**
   * The streak calendar. `streak` is keyed YYYY-MM-DD for the requested month and
   * must agree with the header's streak count, because they are rendered side by side.
   */
  "GET /api/clients/:clientId/student/monthly-streak/": (req) => {
    const requested = req.query.get("month");
    const { year, month } = requested
      ? { year: Number(requested.slice(0, 4)), month: Number(requested.slice(5, 7)) }
      : currentMonth();

    const active = activeDates(400);
    const streak: Record<string, boolean> = {};
    const monthly_days: number[] = [];

    for (let day = 1; day <= daysInMonth(year, month); day++) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isActive = active.has(date);
      streak[date] = isActive;
      if (isActive) monthly_days.push(day);
    }

    const summary = streakSummary();
    return {
      year,
      month,
      streak,
      monthly_days,
      current_streak: summary.current,
      longest_streak: summary.best,
    };
  },

  /** Contribution-graph style heatmap on the profile and streaks pages. */
  "GET /api/clients/:clientId/student/user-activity-heatmap/": () => {
    const active = activeDates(365);
    const heatmap_data: Record<string, Record<string, number>> = {};

    for (let i = 0; i < 365; i++) {
      const date = ymd(daysAgo(i));
      if (!active.has(date)) continue;
      // Articles, quizzes and assignments. Every other key stays in the shape,
      // because the chart's legend is built from the keys, and stays at zero:
      // this catalogue has no video and no coding item, so a day showing three
      // coding problems is recording work nobody could have done.
      const quiz = seededInt(`hm:q:${date}`, 0, 3);
      const article = seededInt(`hm:a:${date}`, 0, 4);
      const assignment = seededInt(`hm:s:${date}`, 0, 2);
      heatmap_data[date] = {
        Quiz: quiz,
        Article: article,
        Assignment: assignment,
        CodingProblem: 0,
        DevCodingProblem: 0,
        VideoTutorial: 0,
        total: quiz + article + assignment,
      };
    }
    return { heatmap_data };
  },

  "GET /admin-dashboard/api/clients/:clientId/student-activity-analytics/": () =>
    rankedLearners()
      .slice(0, 12)
      .map((person) => ({
        studentName: person.full_name,
        Present_streak: person.streak,
        Active_days: seededInt(`activedays:${person.id}`, 12, 96),
        profile_pic_url: person.profile_pic_url,
      })),

  /**
   * Dashboard scorecard preview. The full scorecard is its own module; this is
   * the trimmed payload that endpoint serves, and every field is optional in the
   * mapper, so the preview card renders without the heavy sections.
   */
  "GET /api/scorecard/clients/:clientId/student/scorecard/dashboard/": () => scorecardPayload(false),

  /**
   * The full scorecard page: the preview above plus the heavy sections the
   * dashboard endpoint deliberately skips.
   */
  "GET /api/scorecard/clients/:clientId/student/scorecard/": () => scorecardPayload(true),

  "GET /api/scorecard/clients/:clientId/student/scorecard/skills/": () => ({
    skills: scorecardPayload(true).skills,
  }),

  "GET /api/scorecard/clients/:clientId/student/scorecard/weak-areas/": () =>
    scorecardPayload(true).weak_areas,

  "GET /api/scorecard/clients/:clientId/student/scorecard/assessments/": () => ({
    assessment_performance: scorecardPayload(true).assessment_performance,
  }),

  "GET /api/scorecard/clients/:clientId/student/scorecard/achievements/": () =>
    scorecardPayload(true).achievements,

  "GET /api/scorecard/clients/:clientId/student/scorecard/action-panel/": () =>
    scorecardPayload(true).action_panel,

  "GET /api/scorecard/clients/:clientId/student/scorecard/performance-trends/": () =>
    scorecardPayload(true).performance_trends,

  "GET /api/scorecard/clients/:clientId/student/scorecard/mock-interviews/": () =>
    scorecardPayload(true).mock_interview_performance,

  "GET /api/scorecard/clients/:clientId/student/scorecard/behavioral/": () =>
    scorecardPayload(true).behavioral_metrics,

  "GET /api/scorecard/clients/:clientId/student/scorecard/comparative/": () =>
    scorecardPayload(true).comparative_insights,

  "GET /api/scorecard/clients/:clientId/student/scorecard/dashboard-legacy/": () => {
    const courses = enrolledCourses();
    const hours = seededInt("scorecard:hours", 90, 160);
    return {
      scorecard_config: {
        enabled_modules: ["overview", "learning_consumption", "skills", "assessments"],
      },
      overview: {
        student_name: STUDENT_PERSONA.full_name,
        program_name: courses[0]?.title ?? "-",
        cohort: myBatchName(),
        current_week: 7,
        current_module: courses[0]?.title ?? "-",
        overall_performance_score: overallProgress(),
        // Follows the score, the same way the current scorecard's does. This
        // endpoint is the old shape, not a second opinion.
        overall_grade:
          overallProgress() >= 75 ? "Advanced" : overallProgress() >= 50 ? "Proficient" : "Developing",
        total_time_spent_seconds: hours * 3600,
        attendance_percentage: 67,
        rank_in_cohort: myRank().rank,
        total_students: rankedLearners().length,
      },
      learning_consumption: consumption(hours),
    };
  },

});
