import type { FieldTier, LeaderboardRow } from "./adaptive-journey";
import type { MomentumInfo } from "./momentum";

// Payload for GET /adaptive-journey/api/learner/dashboard/

export type ReadinessBand = "not-started" | "needs-work" | "building" | "strong";

export interface ReadinessCell {
  percent: number | null;
  band: ReadinessBand;
}

export interface CourseReadiness {
  coverage: ReadinessCell;
  precision: ReadinessCell;
  craft: ReadinessCell;
  clutch: ReadinessCell;
  overall: ReadinessCell;
}

export interface DashboardSkill {
  skill: string;
  percent: number;
  band: "strong" | "emerging";
}

export interface CourseSkillProfile {
  abilityIndex: number | null;
  fieldTier: FieldTier | null;
  mastery: number | null;
  skillsTracked: number;
  skills: DashboardSkill[];
  aiTip: string;
}

export interface NodeRef {
  submoduleId?: number;
  assessmentId?: number;
  interviewTemplateId?: number;
}

export interface UpNextNode {
  nodeId: number;
  title: string;
  type: string;
  points: number;
  weekNo: number | null;
  ref: NodeRef;
  dueAt: string | null;
  lockReason: string | null;
  why: string;
}

export interface CrossCourseUpNext extends UpNextNode {
  courseId: number;
  courseTitle: string;
  resumeSubmoduleId: number | null;
}

export interface CourseDue {
  dueAt: string | null;
  zeroAfter: string | null;
  penaltyNote: string | null;
}

export interface DashboardCourse {
  id: number;
  title: string;
  cardImageUrl: string | null;
  completionPct: number;
  readiness: CourseReadiness;
  skillProfile: CourseSkillProfile;
  upNext: UpNextNode | null;
  resumeSubmoduleId: number | null;
  due: CourseDue | null;
  leaderboardRank: number | null;
  certificate: { enabled: boolean; pct: number; threshold: number };
}

export interface DashboardAggregate {
  totalPoints: number;
  pointsThisWeek: number;
  streak: { current: number; best: number; atRisk: boolean };
  momentum: number;
  momentumInfo: MomentumInfo;
  onTimeRate: number | null;
  overallMasteryAvg: number | null;
  cohortRank: { bestRank: number | null; rankDelta: number; perCourse: Record<string, number | null> };
}

export interface DashboardLeaderboard {
  // score + trend are also sent by the API but surfaced via the rows (current-user row)
  // and the rankDelta arrow, so the panel only consumes rank / percentile / rankDelta.
  me: { rank: number; percentile: number; rankDelta: number } | null;
  rows: LeaderboardRow[];
  aiTip: string | null;
}

export interface BriefingAction {
  label: string;
  course: string;
  route: string;
  points: number;
  kind: string;
}

export interface AiBriefing {
  headline: string;
  lastWeek: string;
  thisWeek: { focus: string; course: string };
  today: string;
  weakestSkill: { skill: string; course: string; percent: number; fixSuggestion: string; route: string } | null;
  actions: BriefingAction[];
  focusRoute: string;
  source: string;
}

export interface TodayGoalItem {
  key: "lesson" | "practice" | "quiz";
  label: string;
  done: boolean;
  /** practice only */
  minutes?: number;
  targetMinutes?: number;
}

export interface TodayGoalDay {
  date: string;
  label: string; // MON, TUE, ...
  active: boolean;
  isToday: boolean;
}

export interface TodayGoal {
  goals: TodayGoalItem[];
  completedCount: number;
  totalCount: number;
  percent: number;
  lastDays: TodayGoalDay[];
}

export interface LearnerDashboard {
  profile: {
    name: string;
    weekNo: number | null;
    weekDueAt: string | null;
    weekProgressPct: number;
    streakDays: number;
    bestStreak: number;
  };
  aggregate: DashboardAggregate;
  courses: DashboardCourse[];
  crossCourseUpNext: CrossCourseUpNext[];
  leaderboard: DashboardLeaderboard;
  todayGoal: TodayGoal | null;
  briefing: AiBriefing | null;
  generatedAt: string;
}

/* ---------------------------------------------------------------------------
 * Government surfaces on the aspirant's dashboard
 *
 * Three payloads that have nothing to do with the adaptive journey and are
 * fetched separately from it: the recruitment calendar, the circulars the
 * mission issues, and the handful of addresses an aspirant looks up constantly.
 * They are typed here because they are dashboard payloads, but they are
 * deliberately NOT folded into `LearnerDashboard`: that object is the adaptive
 * journey's own shape, every panel reading it re-renders when any part of it
 * changes, and a calendar that fails to load must not take the briefing with it.
 * ------------------------------------------------------------------------ */

/**
 * Where a recruitment has got to. `closing` is the application window shutting,
 * `mock` is one of the mission's own practice papers, and the rest are the
 * stages a candidate sits after the window shuts.
 */
export type RecruitmentStage = "closing" | "hall-ticket" | "exam" | "result" | "mock";

export interface RecruitmentCalendarEntry {
  id: string;
  /** ISO datetime, always computed from the demo clock. Never a literal. */
  date: string;
  /**
   * Pre-formatted, read off the UTC components so none of them can shift by a
   * day for a viewer outside the tenant's zone (every date here is built at
   * 10 AM tenant time, which is 4:30 AM UTC, so `toLocaleDateString` in a
   * browser west of UTC would print the day before).
   *
   * `dateLabel` is the whole thing ("Tue, 16 Sep") and is what a row announces
   * to a screen reader; the other two are the calendar block the row prints,
   * which carries no month because the rows are grouped under one.
   */
  dateLabel: string;
  /** "Tue". */
  weekdayLabel: string;
  /** "16". */
  dayLabel: string;
  /** Recruiting body, or the mission for its own mock tests. */
  body: string;
  title: string;
  stage: RecruitmentStage;
  /** "Application window closes", "Tier-I admit card", and so on. */
  stageLabel: string;
  /**
   * True when no date has been fixed for this stage and the calendar is showing
   * where it falls rather than when it is. The row says so in words.
   */
  projected: boolean;
  /** In-app route for the posting or paper, or null. */
  href: string | null;
  /** The recruiting body's own portal, or null. */
  portalUrl: string | null;
}

export interface RecruitmentCalendarMonth {
  /** `YYYY-MM`, for a stable React key. */
  key: string;
  label: string;
  entries: RecruitmentCalendarEntry[];
}

export interface RecruitmentCalendar {
  months: RecruitmentCalendarMonth[];
  /** Notifications with the window still open. */
  openCount: number;
  /** Of those, the ones closing within a week. */
  closingSoonCount: number;
}

export type MissionNoticeCategory =
  | "admissions"
  | "verification"
  | "scheme"
  | "holiday"
  | "timetable"
  | "certificate";

export interface MissionNotice {
  id: string;
  /** Circular reference, in the shape a state mission actually files them. */
  reference: string;
  title: string;
  summary: string;
  category: MissionNoticeCategory;
  categoryLabel: string;
  /** ISO datetime the circular was issued. */
  issuedAt: string;
  /** "12 Aug". */
  issuedLabel: string;
  /** The centre it applies to, or null for a mission-wide circular. */
  centre: string | null;
  /** "Apply by 21 Sep", or null when the notice asks for nothing. */
  actionLabel: string | null;
  /** ISO datetime of that action date, so the panel can flag a close one. */
  actionAt: string | null;
}

export interface AtAGlancePortal {
  /** "TGPSC", "RRB Secunderabad". */
  shortName: string;
  /** The body's full name. */
  body: string;
  url: string;
  /** Bare host, e.g. "tgpsc.gov.in", shown under the short name. */
  host: string;
}

export interface AtAGlanceContact {
  kind: "helpline" | "centre" | "email";
  label: string;
  value: string;
  sub: string;
}

export interface DashboardAtAGlance {
  portals: AtAGlancePortal[];
  contacts: AtAGlanceContact[];
}
