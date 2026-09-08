/**
 * The platform tour: one narrated walkthrough per role.
 *
 * The product already ships per-page guides and a spotlight tour engine. What it
 * has no reason to ship, and what a government evaluation needs, is an
 * orientation that runs the moment someone signs in and explains the platform as
 * a whole, module by module, before they have any idea what the sidebar means.
 *
 * Each step carries a `route` AND a `targetId`. The route makes the tour walk the
 * product rather than describe it from one page; the target makes it point at the
 * thing it is talking about once it gets there. Where a page has no meaningful
 * anchor of its own, the target is `page-header`, which every ModulePageHeader
 * carries, and which at least frames the page the narration is about. The opening
 * and closing steps have no target on purpose: they are about the platform, not
 * about any one element.
 *
 * Narration says what each module is FOR rather than what it is called, and
 * avoids bullet-speak: it is revealed a few words at a time as the visitor reads.
 *
 * Vocabulary is the tenant's, not the software industry's: aspirants and trainees
 * rather than students, faculty and trainers rather than instructors, batches and
 * skill centres rather than cohorts and campuses, notifications rather than job
 * listings. An officer evaluating this reads the words before the features.
 *
 * Route ids are catalogue ids and follow the numbering rule in
 * docs/GOVERNMENT-BUILD-BRIEF.md: course 302 is TGPSC Group-II and Group-III, the
 * course the demo aspirant is furthest through, and 30201 is its first topic
 * (topic id = courseId * 100 + n). Pointing the tour at a course the persona has
 * barely started would show an empty journey board.
 */

import type { TourStep } from "@/components/community/TourProvider";

const STUDENT_TOUR: TourStep[] = [
  {
    route: "/dashboard",
    title: "Welcome to the Mission portal",
    narration:
      "This is what an aspirant sees. In the next two minutes I will walk you through every module: how a course adapts to the candidate, how practice is scored, and how it ends in a job notification they are actually eligible for.",
    icon: "mdi:hand-wave-outline",
    color: "#a78bfa",
  },
  {
    targetId: "dash-briefing",
    title: "The daily briefing",
    narration:
      "Every morning this reads the candidate's actual progress and names the single most useful thing to do next. Not a motivational message, a specific lesson, chosen because that is where they are weakest.",
    placement: "bottom",
    icon: "mdi:robot-happy-outline",
    color: "#7c3aed",
  },
  {
    targetId: "dash-stats",
    title: "Points, streak and standing",
    narration:
      "Points come from finishing work, and they decay the longer it is left, so steady daily study is rewarded. The streak and the standing within the batch sit alongside them, which is what keeps a free programme from going quiet in week three.",
    placement: "bottom",
    icon: "mdi:lightning-bolt",
    color: "#f59e0b",
  },
  {
    route: "/adaptive-courses",
    targetId: "adaptive-grid",
    title: "Courses, in two streams",
    narration:
      "The catalogue is organised the way the Mission is: government job preparation on one side, skill development and entrepreneurship on the other, each split into its categories. A candidate preparing for Group-II and a trainee learning rooftop solar both find their track in one place.",
    placement: "right",
    icon: "mdi:book-education-outline",
    color: "#6366f1",
  },
  {
    route: "/adaptive-courses/catalog",
    targetId: "page-header",
    title: "Four categories, one catalogue",
    narration:
      "State, central and PSU recruitment. Banking. Rural employment trades. Rural entrepreneurship. Every course sits under exactly one of them, so a district officer can see at a glance what the centre is actually offering.",
    placement: "bottom",
    icon: "mdi:shape-outline",
    color: "#8b5cf6",
  },
  {
    route: "/adaptive-courses/302/journey",
    targetId: "journey-board",
    title: "A syllabus laid out as a route",
    narration:
      "Inside a course, the syllabus becomes a week-by-week board. The candidate can see what is done, what is next, and how much of the paper is still ahead of them, which a printed syllabus never tells anyone.",
    placement: "right",
    icon: "mdi:map-marker-path",
    color: "#a855f7",
  },
  {
    route: "/adaptive-courses/302/submodule/30201",
    targetId: "submodule-body",
    title: "The same lesson at four reading levels",
    narration:
      "One lesson, re-rendered for four different readers: plain language for a first-time candidate, the full method for the main run, strategy and traps for a repeat attempter, and a last-month recall version. A graduate and a school-leaver can sit in the same batch without one of them being lost.",
    placement: "right",
    icon: "mdi:text-box-multiple-outline",
    color: "#0ea5e9",
  },
  {
    route: "/adaptive-courses/302/submodule/30201",
    targetId: "submodule-body",
    title: "Practice that steers",
    narration:
      "Each topic ends in a quiz that adapts. Answer well and the next question gets harder, miss one and it steps back. It holds a confidence estimate per skill and stops as soon as it is sure of the level, rather than after a fixed twenty questions.",
    placement: "right",
    icon: "mdi:comment-question-outline",
    color: "#7c3aed",
  },
  {
    route: "/assessments",
    targetId: "assessments-grid",
    title: "Mock tests and formal papers",
    narration:
      "Timed papers built like the real thing, with sectional timing and negative marking where the exam has it, and proctoring when the Mission needs a result it can stand behind. Results break down by section, so a candidate learns which part of the syllabus cost them the marks.",
    placement: "right",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#0ea5e9",
  },
  {
    route: "/mock-interview",
    targetId: "mock-modes",
    title: "Interview practice",
    narration:
      "A practice interview board that follows up on the answer given rather than reading from a list, and scores clarity and structure as well as content. For a candidate who has never sat in front of a selection board, this is the part of the process nobody can prepare them for at home.",
    placement: "right",
    icon: "mdi:account-voice",
    color: "#ec4899",
  },
  {
    route: "/jobs-v2",
    targetId: "jobs-tabs",
    title: "Notifications and openings",
    narration:
      "State and central recruitment notifications alongside the local employer openings the skill centres feed, with eligibility checked against the candidate's own profile so they are not applying into a wall.",
    placement: "right",
    icon: "mdi:briefcase-outline",
    color: "#10b981",
  },
  {
    route: "/resume",
    targetId: "resume-hero",
    title: "Resume and application file",
    narration:
      "Built from the profile and the work actually completed, then scored against a specific opening. For a first-generation graduate applying to a private employer after a trade course, this is often the missing document.",
    placement: "right",
    icon: "mdi:file-document-edit-outline",
    color: "#14b8a6",
  },
  {
    route: "/live-sessions",
    targetId: "live-tabs",
    title: "Live classes",
    narration:
      "Scheduled classes with the batch, in the centre's own timezone. Attendance is taken automatically, and recordings, transcripts and summaries attach themselves afterwards, so a trainee who was at work that evening is not written off.",
    placement: "right",
    icon: "mdi:video-outline",
    color: "#3b82f6",
  },
  {
    route: "/community",
    targetId: "tour-filters",
    title: "Ask the batch",
    narration:
      "Questions can carry a points bounty, which is the mechanism that gets them answered instead of sitting unread. Faculty answers are marked as such, so a wrong peer answer does not travel further than it should.",
    placement: "right",
    icon: "mdi:forum-outline",
    color: "#8b5cf6",
  },
  {
    route: "/tickets",
    targetId: "tickets-tabs",
    title: "Support",
    narration:
      "Anything from a video that will not play to a spelling on a certificate, raised and followed through to resolution. It routes to the faculty member or the programme office automatically rather than into a shared inbox nobody owns.",
    placement: "right",
    icon: "mdi:lifebuoy",
    color: "#64748b",
  },
  {
    route: "/user/scorecard",
    targetId: "scorecard-body",
    title: "The point of all of it",
    narration:
      "Everything a candidate does feeds one scorecard: subject strength, consistency, mock performance and interview readiness, benchmarked against the batch. That is the artefact a selection board or an employer can actually read.",
    icon: "mdi:chart-box-outline",
    color: "#22c55e",
  },
  {
    route: "/dashboard",
    title: "Explore freely",
    narration:
      "Every module is switched on and filled with data. Click anything. The question mark in any page header explains that page in detail, and the Guide button at the top restarts this tour.",
    icon: "mdi:compass-outline",
    color: "#a78bfa",
  },
];

const INSTRUCTOR_TOUR: TourStep[] = [
  {
    route: "/instructor/dashboard",
    title: "The faculty workspace",
    narration:
      "This view is built around triage: who is falling behind, what is waiting to be marked, and what is on today. I will walk you through every part of it.",
    icon: "mdi:human-male-board",
    color: "#a78bfa",
  },
  {
    route: "/instructor/dashboard",
    targetId: "instructor-briefing",
    title: "The teaching briefing",
    narration:
      "The top of the dashboard reads your batches and names the single highest-leverage thing to do today, usually the batch with the most candidates slipping rather than the newest notification.",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#7c3aed",
  },
  {
    route: "/instructor/dashboard",
    targetId: "instructor-kpis",
    title: "The numbers that matter",
    narration:
      "Candidates taught, active batches, average progress and how many need a nudge. Every one is a link into the list behind it, so a number you distrust is one click from the people it counted.",
    icon: "mdi:counter",
    color: "#f59e0b",
  },
  {
    route: "/instructor/students",
    targetId: "instructor-students",
    title: "Who needs attention",
    narration:
      "Candidates are flagged with the rule that flagged them: under twenty-five percent progress, a week with no activity, two missed classes. A red badge with no reason is not something a faculty member can act on, so the reason travels with the flag.",
    icon: "mdi:account-alert-outline",
    color: "#ef4444",
  },
  {
    route: "/instructor/students",
    targetId: "instructor-student-stats",
    title: "Nudge, do not chase",
    narration:
      "From any candidate you can send a nudge that reaches their dashboard and their inbox. Following up on a batch of sixty stops being a spreadsheet of phone numbers.",
    icon: "mdi:bell-ring-outline",
    color: "#10b981",
  },
  {
    route: "/instructor/cohorts",
    targetId: "instructor-cohorts",
    title: "Your batches",
    narration:
      "Each batch carries its own progress, average score and at-risk count, so you can see which GROUP is struggling rather than only which individual is. You can message a whole batch from here.",
    icon: "mdi:account-group-outline",
    color: "#6366f1",
  },
  {
    route: "/instructor/courses",
    targetId: "instructor-courses",
    title: "Course content",
    narration:
      "The courses you own or are assigned to, with their published state and enrolment. Opening one takes you into the builder, where you add weeks, topics and content.",
    icon: "mdi:book-education-outline",
    color: "#8b5cf6",
  },
  {
    route: "/instructor/assessments",
    targetId: "instructor-gradebook",
    title: "Gradebook",
    narration:
      "Everything awaiting review surfaces here, including the descriptive answers that cannot be marked automatically. The pending count is a queue to work through, not a badge.",
    icon: "mdi:clipboard-check-outline",
    color: "#f97316",
  },
  {
    route: "/instructor/live-sessions",
    targetId: "instructor-sessions",
    title: "Live classes",
    narration:
      "Host from here. Attendance is taken automatically, and the recording, transcript and summary attach themselves afterwards, so a trainee who missed the class is not dependent on you remembering.",
    icon: "mdi:video-outline",
    color: "#0ea5e9",
  },
  {
    route: "/instructor/analytics",
    targetId: "instructor-analytics",
    title: "Analytics",
    narration:
      "Where the batch is spending time and where it is stalling, broken down by activity type and by week. This is the view that tells you which lesson to rewrite before the next intake.",
    icon: "mdi:chart-box-outline",
    color: "#22c55e",
  },
  {
    route: "/instructor/tickets",
    targetId: "instructor-tickets",
    title: "Questions routed to you",
    narration:
      "Support requests raised by candidates in your batches land here rather than in a shared inbox nobody owns.",
    icon: "mdi:lifebuoy",
    color: "#64748b",
  },
  {
    route: "/instructor/dashboard",
    title: "That is the loop",
    narration:
      "Spot who is slipping, act on it, teach, mark, and see whether it worked. Every panel here exists to shorten one of those steps. Restart this tour any time from Guide in the top bar.",
    icon: "mdi:check-circle-outline",
    color: "#a78bfa",
  },
];

const ADMIN_TOUR: TourStep[] = [
  {
    route: "/admin/dashboard",
    title: "Running the programme",
    narration:
      "This is the programme officer's view. It answers the question a centre visit cannot answer: is this working, and for whom. I will show you every part.",
    icon: "mdi:shield-crown-outline",
    color: "#a78bfa",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-pulse",
    title: "Every number says what it counted",
    narration:
      "Each tile carries its own definition. These figures end up in review meetings and utilisation reports, and a metric that cannot say what it measured gets read with whichever meaning is most flattering.",
    icon: "mdi:information-outline",
    color: "#6366f1",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-at-risk",
    title: "Who is falling behind",
    narration:
      "At-risk candidates are listed with the rules that flagged them, ranked by how many fired. It is a worklist for the centre, not a warning light on a wall.",
    icon: "mdi:account-alert-outline",
    color: "#ef4444",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-engagement",
    title: "Engagement, honestly",
    narration:
      "When candidates actually study, which activity types they favour, and how consistent they are. The heatmap usually shows early mornings and late evenings, which is what a cohort holding down daily work really looks like.",
    icon: "mdi:chart-timeline-variant",
    color: "#0ea5e9",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-learning",
    title: "Where they drop off",
    narration:
      "Activation and completion per course, with a week-by-week drop-off curve. That curve names which week of which course is losing people, which is the thing a programme officer can actually fix.",
    icon: "mdi:chart-areaspline",
    color: "#f59e0b",
  },
  {
    route: "/admin/manage-students",
    targetId: "students-table",
    title: "Everyone enrolled",
    narration:
      "Search, filter and open any candidate. A candidate page shows the whole journey: courses, activity, mock tests, interviews and time on the platform, which is what a district review actually asks for.",
    icon: "mdi:account-multiple-outline",
    color: "#8b5cf6",
  },
  {
    route: "/admin/cohorts",
    targetId: "cohorts-list",
    title: "Batches",
    narration:
      "Group candidates by centre, district or intake for scheduling and reporting. Assigning a course to a batch enrols everyone in it, and keeps enrolling people who join later.",
    icon: "mdi:account-group-outline",
    color: "#6366f1",
  },
  {
    route: "/admin/instructors",
    targetId: "instructors-tabs",
    title: "Faculty and permissions",
    narration:
      "Add faculty and trainers and scope them to the courses, batches and classes they own. A trainer at one skill centre only ever sees the candidates they are responsible for.",
    icon: "mdi:human-male-board",
    color: "#ec4899",
  },
  {
    route: "/admin/adaptive-courses",
    targetId: "adaptive-courses-list",
    title: "The course builder",
    narration:
      "Describe a course and the engine assembles the weeks, lessons, quizzes and practical assignments. You review it, edit anything, and publish when it is ready. Nothing reaches candidates unapproved.",
    icon: "mdi:book-cog-outline",
    color: "#a855f7",
  },
  {
    route: "/admin/assessment",
    targetId: "admin-assessment-hero",
    title: "Mock tests and papers",
    narration:
      "Build formal papers, set duration and proctoring, and review submissions. Drafts stay invisible to candidates until you publish them.",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#0ea5e9",
  },
  {
    route: "/admin/live-sessions",
    targetId: "live-sessions-list",
    title: "Live classes",
    narration:
      "Schedule classes for a batch, one-off or recurring, in the Mission's own timezone. Attendance and recordings are captured without anyone at the centre remembering to press a button.",
    icon: "mdi:video-outline",
    color: "#3b82f6",
  },
  {
    route: "/admin/jobs-v2",
    targetId: "jobs-v2-list",
    title: "Notifications and placement",
    narration:
      "Publish recruitment notifications and employer openings, set eligibility, and track applications through to selection. This is the module that turns a completed course into an outcome the Mission can report.",
    icon: "mdi:briefcase-outline",
    color: "#10b981",
  },
  {
    route: "/admin/emails",
    targetId: "emails-list",
    title: "Communications",
    narration:
      "Send to a batch, a district or a filtered segment, and see delivery and open rates per campaign rather than guessing whether the notification reached anyone.",
    icon: "mdi:email-outline",
    color: "#f97316",
  },
  {
    route: "/admin/tickets",
    targetId: "tickets-table",
    title: "Support queue",
    narration:
      "Every request across the programme, with who raised it, who owns it, and how long it has been waiting. Anything unanswered for three days is surfaced on the dashboard.",
    icon: "mdi:lifebuoy",
    color: "#64748b",
  },
  {
    // /admin/branding is a redirect to /admin/settings. Pointing the tour at
    // the redirect makes it fight the router: the step navigates, the page
    // redirects, and the effect pushes straight back to the redirect.
    route: "/admin/settings",
    targetId: "settings-preview",
    title: "It is your platform",
    narration:
      "Logo, wordmark, sign-in copy, timezone and integrations. Everything a candidate sees carries the Mission's name and not a vendor's, which is what a citizen-facing service has to do.",
    icon: "mdi:palette-outline",
    color: "#22c55e",
  },
  {
    route: "/admin/dashboard",
    title: "That is the whole picture",
    narration:
      "People, content, delivery and outcomes, with the evidence behind each one. Restart this tour any time from Guide in the top bar.",
    icon: "mdi:check-circle-outline",
    color: "#a78bfa",
  },
];

/** The tour for a role, defaulting to the aspirant's. */
export function platformTour(role: string | undefined | null): TourStep[] {
  const r = (role ?? "").toLowerCase();
  if (r === "instructor") return INSTRUCTOR_TOUR;
  if (r === "admin" || r === "superadmin") return ADMIN_TOUR;
  return STUDENT_TOUR;
}

/** Headline copy for the welcome card, per role. */
export function welcomeCopy(role: string | undefined | null) {
  const r = (role ?? "").toLowerCase();
  if (r === "instructor") {
    return {
      title: "You are signed in as faculty",
      body: "This is the workspace a faculty member lives in: who is falling behind, what needs marking, and what is on today.",
      minutes: 2,
      steps: INSTRUCTOR_TOUR.length,
    };
  }
  if (r === "admin" || r === "superadmin") {
    return {
      title: "You are signed in as a programme officer",
      body: "This is the programme-wide view: engagement, outcomes, people, and everything you can configure.",
      minutes: 2,
      steps: ADMIN_TOUR.length,
    };
  }
  return {
    title: "You are signed in as an aspirant",
    body: "This is what a candidate sees. Take the tour and I will walk you through the whole platform, module by module.",
    minutes: 2,
    steps: STUDENT_TOUR.length,
  };
}
