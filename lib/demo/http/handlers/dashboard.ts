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
import type {
  AtAGlanceContact,
  AtAGlancePortal,
  DashboardAtAGlance,
  LearnerDashboard,
  MissionNotice,
  MissionNoticeCategory,
  RecruitmentCalendar,
  RecruitmentCalendarEntry,
  RecruitmentCalendarMonth,
  RecruitmentStage,
} from "@/lib/types/dashboard";
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
import { allJobs, type JobRecord } from "../../db/jobs";
import { allAssessments } from "./assessment-admin";
import { DEMO_TENANT } from "../../config";
import { currentMonth, daysAhead, daysInMonth, iso, isoDaysAgo, nowMs, todayStart, ymd, daysAgo } from "../../clock";
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

/* ===========================================================================
 * The government surfaces on the aspirant's dashboard
 *
 * The dashboard's left column used to end at the course readiness card. The
 * row below it is gated on the legacy `course` feature flag, which is
 * deliberately off for this tenant (see `db/tenant.ts`), so the column stopped
 * while the right rail carried on for another thirteen hundred pixels. What
 * belongs in that space is not more of the learning product. It is the two
 * things an aspirant checks before anything else, the recruitment calendar and
 * the mission's circulars, plus the addresses they look up constantly.
 *
 * Every fact below is derived from a record another screen already reads: the
 * job board in `db/jobs.ts`, the paper catalogue in `assessment-admin.ts`, the
 * batch roster in `admin.ts`. That is the whole reason it is safe to put a
 * calendar on the dashboard at all. A calendar assembled from its own literals
 * would disagree with the job board the moment either was edited, and the first
 * thing an officer does with two dates for the same recruitment is stop
 * believing both.
 *
 * No date here is written down. Each one is `daysAhead` of the demo clock off
 * an offset held in the seed, so the calendar is permanently current and can
 * never be read as this year's recruitment calendar. The panel prints its own
 * line saying so, and the rows that show a stage with no fixed date say that in
 * words rather than implying one.
 * ======================================================================== */

const DAY_MS = 86_400_000;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * How far ahead the calendar looks, and how many rows it will print.
 *
 * Four months is the window a candidate plans in: far enough to hold the
 * examination that follows a window closing this week, short enough that the
 * dates at the bottom still mean something. The cap exists because the panel
 * sits in a column, not on a page of its own.
 */
const CALENDAR_HORIZON_DAYS = 120;
const CALENDAR_MAX_ENTRIES = 14;
/** Inside a week is what "closing soon" means to somebody still gathering documents. */
const CLOSING_SOON_DAYS = 7;

/** Whole days from today to a `YYYY-MM-DD` date. Negative for one already past. */
function dayOffsetOf(dateOnly: string): number {
  const at = Date.parse(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(at)) return Number.NaN;
  return Math.round((at - todayStart().getTime()) / DAY_MS);
}

/** Whole days from today to an instant, counted in whole calendar days. */
function dayOffsetOfDate(at: Date): number {
  const day = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
  return Math.round((day - todayStart().getTime()) / DAY_MS);
}

/**
 * Date labels, formatted here rather than in the browser.
 *
 * `toLocaleDateString` formats in the VIEWER's zone, and every date in this
 * calendar is built at 10 AM tenant time, which is 4:30 AM UTC. A viewer west of
 * UTC would have been shown the previous day for every row. Reading the UTC
 * components of a date built that way gives the day the seed meant, everywhere.
 */
function dateLabelOf(at: Date): string {
  return `${WEEKDAY_NAMES[at.getUTCDay()]}, ${at.getUTCDate()} ${MONTH_NAMES[at.getUTCMonth()].slice(0, 3)}`;
}

/** "21 Sep", for a line that already says what the date is for. */
function shortDateOf(at: Date): string {
  return `${at.getUTCDate()} ${MONTH_NAMES[at.getUTCMonth()].slice(0, 3)}`;
}

/**
 * A posting is a recruitment notification when it carries the body's own portal.
 *
 * That is the same test the job board uses to decide between sending a candidate
 * to the government portal and running the in-app apply wizard, so the calendar
 * holds exactly the postings the board treats as recruitments. The vocational
 * openings are jobs, not recruitments, and a closing date for a garment unit's
 * vacancy has no business on a recruitment calendar.
 */
function recruitmentNotifications(): JobRecord[] {
  return allJobs().filter((job) => job.is_published && job.apply_link.trim() !== "");
}

/**
 * The stages that follow a window closing.
 *
 * Written per recruitment rather than generated, because the stages are not
 * interchangeable: Group-II is a single written examination of four papers with
 * no preliminary, SSC CGL sits Tier-I first, and IBPS runs a preliminary. A
 * generated "exam" row would have printed the wrong stage name for at least two
 * of the three, and the stage name is the part a candidate is reading for.
 *
 * `afterClose` is days after that recruitment's own closing date, so these move
 * with the posting rather than with a second calendar of their own. Every one of
 * them is marked `projected`: in a real recruitment the examination date is not
 * fixed when the notification is published, and a calendar that pretends
 * otherwise is teaching a candidate to trust a date nobody has announced.
 */
interface DownstreamStage {
  jobId: number;
  stage: RecruitmentStage;
  label: string;
  afterClose: number;
}

const DOWNSTREAM_STAGES: readonly DownstreamStage[] = [
  // The SSC window on this board has already shut, so the next thing that
  // candidate does is download the admit card and sit Tier-I. Without these two
  // rows the calendar is nothing but closing dates and answers "what do I sit
  // next" with silence.
  { jobId: 605, stage: "hall-ticket", label: "Tier-I admit card released", afterClose: 20 },
  { jobId: 605, stage: "exam", label: "Tier-I computer based examination", afterClose: 34 },
  // The two papers this aspirant is actually enrolled against.
  { jobId: 607, stage: "exam", label: "Preliminary examination", afterClose: 42 },
  { jobId: 601, stage: "exam", label: "Written examination, Papers I to IV", afterClose: 62 },
];

/** The three pre-formatted date fields every entry carries. */
function dateFieldsOf(at: Date) {
  return {
    dateLabel: dateLabelOf(at),
    weekdayLabel: WEEKDAY_NAMES[at.getUTCDay()],
    dayLabel: String(at.getUTCDate()),
  };
}

function calendarEntry(
  id: string,
  offsetDays: number,
  fields: Omit<RecruitmentCalendarEntry, "id" | "date" | "dateLabel" | "weekdayLabel" | "dayLabel">,
): RecruitmentCalendarEntry {
  // 10 AM tenant time: an office hour, and far enough from midnight either way
  // that the calendar day is the same in UTC as it is in Telangana.
  const at = daysAhead(offsetDays, 10, 0);
  return { id, date: iso(at), ...dateFieldsOf(at), ...fields };
}

/** Every dated thing in the horizon, soonest first. */
function calendarEntries(): RecruitmentCalendarEntry[] {
  const notifications = recruitmentNotifications();
  const out: RecruitmentCalendarEntry[] = [];

  for (const job of notifications) {
    if (job.status !== "active" || !job.application_deadline) continue;
    const offset = dayOffsetOf(job.application_deadline);
    if (!Number.isFinite(offset) || offset < 0 || offset > CALENDAR_HORIZON_DAYS) continue;
    out.push(
      calendarEntry(`close-${job.id}`, offset, {
        body: job.company_name,
        title: job.job_title,
        stage: "closing",
        stageLabel: "Application window closes",
        projected: false,
        href: `/jobs-v2/${job.id}`,
        portalUrl: job.apply_link || null,
      }),
    );
  }

  for (const plan of DOWNSTREAM_STAGES) {
    const job = notifications.find((candidate) => candidate.id === plan.jobId);
    if (!job?.application_deadline) continue;
    const offset = dayOffsetOf(job.application_deadline) + plan.afterClose;
    if (!Number.isFinite(offset) || offset < 0 || offset > CALENDAR_HORIZON_DAYS) continue;
    out.push(
      calendarEntry(`stage-${job.id}-${plan.stage}-${plan.afterClose}`, offset, {
        body: job.company_name,
        title: job.job_title,
        stage: plan.stage,
        stageLabel: plan.label,
        projected: true,
        href: `/jobs-v2/${job.id}`,
        portalUrl: job.apply_link || null,
      }),
    );
  }

  // The mission's own scheduled papers. A mock with no start time is open now
  // and belongs on the assessment hub, not on a calendar of fixed sittings.
  for (const spec of allAssessments()) {
    if (spec.isDraft || !spec.isActive || !spec.startTime) continue;
    const at = new Date(spec.startTime);
    const offset = dayOffsetOfDate(at);
    if (!Number.isFinite(offset) || offset < 0 || offset > CALENDAR_HORIZON_DAYS) continue;
    out.push({
      id: `mock-${spec.id}`,
      date: spec.startTime,
      ...dateFieldsOf(at),
      body: `${DEMO_TENANT.shortName} mock test`,
      title: spec.title,
      stage: "mock",
      stageLabel: "Mission mock test window opens",
      projected: false,
      href: `/assessments/${spec.slug}`,
      portalUrl: null,
    });
  }

  return out
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .slice(0, CALENDAR_MAX_ENTRIES);
}

/** The same entries, grouped the way a wall calendar groups them. */
function recruitmentCalendar(): RecruitmentCalendar {
  const entries = calendarEntries();
  const months: RecruitmentCalendarMonth[] = [];

  for (const entry of entries) {
    const at = new Date(entry.date);
    const key = `${at.getUTCFullYear()}-${String(at.getUTCMonth() + 1).padStart(2, "0")}`;
    const last = months[months.length - 1];
    if (last?.key === key) last.entries.push(entry);
    else months.push({ key, label: `${MONTH_NAMES[at.getUTCMonth()]} ${at.getUTCFullYear()}`, entries: [entry] });
  }

  const openWindows = recruitmentNotifications()
    .filter((job) => job.status === "active" && job.application_deadline)
    .map((job) => dayOffsetOf(job.application_deadline as string))
    .filter((offset) => Number.isFinite(offset) && offset >= 0);

  return {
    months,
    openCount: openWindows.length,
    closingSoonCount: openWindows.filter((offset) => offset <= CLOSING_SOON_DAYS).length,
  };
}

/**
 * The circulars a state mission actually issues.
 *
 * Six, which is what a district notice board carries at any one time: a batch
 * opening, a verification camp, a scheme window, a holiday, a timetable change
 * and certificates waiting to be collected. Nothing here quotes a rate, a fee or
 * an amount of assistance, because those are fixed by a sanctioning order and a
 * figure invented for a demo would be read as the scale of the scheme.
 *
 * The reference serial comes from the seeded PRNG and the year from the demo
 * clock, exactly as the notification numbers on the job board do, so a circular
 * reference is stable across a reload and cannot be looked up as a real file.
 */
interface NoticeSeed {
  key: string;
  /** The wing of the mission that files it, which is what a real Rc.No. carries. */
  wing: "SKD" | "PLC" | "EST" | "ACD" | "CRT";
  category: MissionNoticeCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  centre: string | null;
  issuedDaysAgo: number;
  /** Days from today the notice asks for something by, or null. */
  actionInDays: number | null;
  /** "Apply by", "Report by", "Collect by". */
  actionVerb: string | null;
}

const NOTICE_SEEDS: readonly NoticeSeed[] = [
  {
    key: "admissions",
    wing: "SKD",
    category: "admissions",
    categoryLabel: "Batch admissions",
    title: "Admissions open for the Solar PV Installer batch, Khammam centre",
    summary:
      "Thirty seats in the next intake, open to candidates who have passed the tenth standard and are between 18 and 35 years of age. Apply at the centre with your marks memo and two photographs.",
    centre: "Khammam centre",
    issuedDaysAgo: 3,
    actionInDays: 12,
    actionVerb: "Apply by",
  },
  {
    key: "verification",
    wing: "PLC",
    category: "verification",
    categoryLabel: "Document verification",
    title: "Document verification camp for placement shortlists, Warangal centre",
    summary:
      "Report at the centre with the originals and one self attested set: proof of date of birth, the qualification certificate, and the trade certificate issued by the mission.",
    centre: "Warangal centre",
    issuedDaysAgo: 6,
    actionInDays: 5,
    actionVerb: "Report by",
  },
  {
    key: "scheme",
    wing: "SKD",
    category: "scheme",
    categoryLabel: "Scheme window",
    title: "Application window open under the self employment support scheme",
    summary:
      "Trainees certified in the last two intakes may apply through their centre for tool kit and working capital support. The scale of assistance is fixed by the sanctioning order.",
    centre: null,
    issuedDaysAgo: 9,
    actionInDays: 21,
    actionVerb: "Apply by",
  },
  {
    key: "timetable",
    wing: "ACD",
    category: "timetable",
    categoryLabel: "Revised timetable",
    title: "Revised timetable for the Group-II morning batch, Warangal centre",
    summary:
      "General studies moves to the first hour and the Telangana movement session to the second, so the doubt clearing hour sits at the end of the morning. Evening revision is unchanged.",
    centre: "Warangal centre",
    issuedDaysAgo: 4,
    actionInDays: null,
    actionVerb: null,
  },
  {
    key: "certificate",
    wing: "CRT",
    category: "certificate",
    categoryLabel: "Certificates",
    title: "Certificates ready for collection, Group-II Batch 2025, Warangal",
    summary:
      "Completion certificates for the batch that has finished are ready at the centre. Collect in person with a photo identity, or authorise someone in writing to collect them.",
    centre: "Warangal centre",
    issuedDaysAgo: 11,
    actionInDays: 8,
    actionVerb: "Collect by",
  },
  {
    key: "holiday",
    wing: "EST",
    category: "holiday",
    categoryLabel: "Centre holiday",
    title: "Skill centres closed on the second Saturday of the month",
    summary:
      "All district skill centres remain closed on the second Saturday. Classes scheduled that day move to the following Sunday morning at the same hour.",
    centre: null,
    issuedDaysAgo: 2,
    actionInDays: null,
    actionVerb: null,
  },
];

function missionNotices(): MissionNotice[] {
  const year = currentMonth().year;

  return NOTICE_SEEDS.map((seed) => {
    const issuedAt = daysAgo(seed.issuedDaysAgo, 11, 0);
    const actionAt = seed.actionInDays == null ? null : daysAhead(seed.actionInDays, 17, 0);

    return {
      id: `notice-${seed.key}`,
      reference: `Rc.No. ${seededInt(`notice:${seed.key}`, 104, 986)}/TSEM/${seed.wing}/${year}`,
      title: seed.title,
      summary: seed.summary,
      category: seed.category,
      categoryLabel: seed.categoryLabel,
      issuedAt: iso(issuedAt),
      issuedLabel: shortDateOf(issuedAt),
      centre: seed.centre,
      actionLabel: actionAt && seed.actionVerb ? `${seed.actionVerb} ${shortDateOf(actionAt)}` : null,
      actionAt: actionAt ? iso(actionAt) : null,
    };
  }).sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
}

/**
 * The bodies whose portals an aspirant opens week after week.
 *
 * The address is read off the job board's own `apply_link` wherever that body
 * has a posting, which is the same link the apply flow sends the candidate to.
 * Two addresses for one commission, one on the dashboard and one on the posting,
 * is the sort of thing that gets a portal link mistrusted. The literal is the
 * fallback for when a posting has been deleted through the admin screens, since
 * the board is editable and the strip must not lose a portal because of it.
 */
const PORTAL_BODIES = [
  { shortName: "TGPSC", body: "Telangana Public Service Commission", match: "TGPSC", fallback: "https://www.tgpsc.gov.in/" },
  { shortName: "TGLPRB", body: "Telangana Police Recruitment Board", match: "TGLPRB", fallback: "https://www.tglprb.in/" },
  { shortName: "SSC", body: "Staff Selection Commission", match: "Staff Selection Commission", fallback: "https://ssc.gov.in/" },
  // "RRB" rather than "RRB Secunderabad": seven tiles across the strip leaves
  // about 145px each, and the longer label truncated to "RRB Secundera...". The
  // zone is on the address underneath it and in the tile's own title attribute.
  { shortName: "RRB", body: "Railway Recruitment Board, Secunderabad", match: "Railway Recruitment Board", fallback: "https://rrbsecunderabad.gov.in/" },
  { shortName: "IBPS", body: "Institute of Banking Personnel Selection", match: "IBPS", fallback: "https://www.ibps.in/" },
  { shortName: "SBI", body: "State Bank of India", match: "State Bank of India", fallback: "https://sbi.co.in/web/careers" },
  { shortName: "RBI", body: "Reserve Bank of India", match: "Reserve Bank of India", fallback: "https://www.rbi.org.in/" },
] as const;

/** Bare host for the line under the short name. Falls back to the raw address. */
function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function atAGlance(): DashboardAtAGlance {
  const jobs = allJobs();
  const batch = COHORTS.find((cohort) => cohort.id === STUDENT_BATCH_ID);

  const portals: AtAGlancePortal[] = PORTAL_BODIES.map((entry) => {
    const posting = jobs.find(
      (job) => job.company_name.includes(entry.match) && job.apply_link.trim() !== "",
    );
    const url = posting?.apply_link ?? entry.fallback;
    return { shortName: entry.shortName, body: entry.body, url, host: hostOf(url) };
  });

  const contacts: AtAGlanceContact[] = [
    {
      kind: "helpline",
      label: "Mission helpline",
      // Seeded, like every other invented figure in this demo, and the panel says
      // in as many words that it is a demo number. A number typed in here would
      // be dialled by somebody, and it would ring in somebody's house.
      value: `1800 ${seededInt("tsem:helpline:block", 200, 599)} ${seededInt("tsem:helpline:line", 1000, 9999)}`,
      sub: "Monday to Saturday, 10 AM to 6 PM",
    },
    {
      kind: "centre",
      label: "Your skill centre",
      value: batch?.centre ?? "Not assigned to a centre",
      // The batch name already carries the district, so printing both read as
      // "Batch 2026, Warangal, Warangal district".
      sub: batch ? batch.name : "Ask the mission to map you to a batch",
    },
    {
      kind: "email",
      label: "Mission support",
      value: DEMO_TENANT.supportEmail,
      sub: "For anything your centre cannot settle",
    },
  ];

  return { portals, contacts };
}

defineRoutes(MODULE, {
  "GET /adaptive-journey/api/learner/dashboard/": (req) => learnerDashboard(req.auth),

  /**
   * The three government panels in the dashboard's left column.
   *
   * Three endpoints rather than three more keys on the learner dashboard, and
   * that is the point: each panel fetches its own, so a failure hides one panel
   * instead of blanking the briefing, the stats and the readiness card with it.
   */
  "GET /api/clients/:clientId/student/recruitment-calendar/": () => recruitmentCalendar(),

  "GET /api/clients/:clientId/student/mission-notices/": () => ({ notices: missionNotices() }),

  "GET /api/clients/:clientId/student/at-a-glance/": () => atAGlance(),

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
