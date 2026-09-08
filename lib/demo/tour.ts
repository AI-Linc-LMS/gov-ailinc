/**
 * The platform tour: one narrated walkthrough per role.
 *
 * The product already ships per-page guides and a spotlight tour engine. What it
 * has no reason to ship — and what a demo needs — is an orientation that runs
 * the moment someone signs in and explains the platform as a whole, module by
 * module, before they have any idea what the sidebar means.
 *
 * Each step carries a `route` AND a `targetId`. The route makes the tour walk the
 * product rather than describe it from one page; the target makes it point at the
 * thing it is talking about once it gets there. Where a page has no meaningful
 * anchor of its own, the target is `page-header` — every ModulePageHeader carries
 * it — which at least frames the page the narration is about. The opening and
 * closing steps have no target on purpose: they are about the platform, not about
 * any one element.
 *
 * Narration says what each module is FOR rather than what it is called, and
 * avoids bullet-speak: it is revealed a few words at a time as the visitor reads.
 */

import type { TourStep } from "@/components/community/TourProvider";

const STUDENT_TOUR: TourStep[] = [
  {
    route: "/dashboard",
    title: "Welcome to AI Linc",
    narration:
      "This is the learner's view. In the next two minutes I will walk you through every module: how a course adapts to you, how practice is scored, and how it all ends in being job-ready.",
    icon: "mdi:hand-wave-outline",
    color: "#a78bfa",
  },
  {
    targetId: "dash-briefing",
    title: "Your AI briefing",
    narration:
      "Every morning this reads your actual progress and tells you the single most useful thing to do next. Not a motivational message — a specific lesson, chosen because of where you are weakest.",
    placement: "bottom",
    icon: "mdi:robot-happy-outline",
    color: "#7c3aed",
  },
  {
    targetId: "dash-stats",
    title: "Points, streak and rank",
    narration:
      "Points come from finishing work, and they decay the longer you take, so speed is rewarded but never at the cost of correctness. Your streak and your standing in the cohort sit alongside them.",
    placement: "bottom",
    icon: "mdi:lightning-bolt",
    color: "#f59e0b",
  },
  {
    route: "/adaptive-courses",
    targetId: "adaptive-grid",
    title: "Courses",
    narration:
      "Your courses live here. Each one is a week-by-week journey that adapts to you, and lessons can be re-rendered at four reading levels, from plain English to whitepaper — so the same material works whether you are new to it or revising it.",
    placement: "right",
    icon: "mdi:book-education-outline",
    color: "#6366f1",
  },
  {
    route: "/adaptive-courses/201/journey",
    targetId: "journey-board",
    title: "Quizzes that actually adapt",
    narration:
      "Inside every topic is a quiz that steers. Answer well and the next question gets harder; miss one and it steps back. It keeps a confidence estimate per skill and stops as soon as it is sure of your level, rather than after a fixed number of questions.",
    placement: "right",
    icon: "mdi:comment-question-outline",
    color: "#a855f7",
  },
  {
    route: "/adaptive-courses/201/submodule/5009",
    targetId: "submodule-body",
    title: "A real coding workspace",
    narration:
      "Coding problems run your code against real test cases, show you exactly which one failed and what it returned, and give layered hints — a nudge first, the actual mechanism only if you ask twice.",
    placement: "right",
    icon: "mdi:code-braces",
    color: "#f97316",
  },
  {
    route: "/assessments",
    targetId: "assessments-grid",
    title: "Assessments",
    narration:
      "Formal papers, timed, and proctored when the institution needs them to be. Results break down by section so you can see which part of the syllabus let you down.",
    placement: "right",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#0ea5e9",
  },
  {
    route: "/mock-interview",
    targetId: "mock-modes",
    title: "AI mock interviews",
    narration:
      "A voice conversation with an interviewer that follows up on your answers rather than reading from a list, and scores communication as well as correctness. The feedback tells you why, not just what.",
    placement: "right",
    icon: "mdi:account-voice",
    color: "#ec4899",
  },
  {
    route: "/jobs-v2",
    targetId: "jobs-tabs",
    title: "Jobs",
    narration:
      "Roles curated for this institution's students, with eligibility already checked against your profile, so you are not applying into a wall.",
    placement: "right",
    icon: "mdi:briefcase-outline",
    color: "#10b981",
  },
  {
    route: "/resume",
    targetId: "resume-hero",
    title: "Resume builder",
    narration:
      "Builds from the profile and the work you have actually completed, then scores it against a job description so you can see what a screening tool would see.",
    placement: "right",
    icon: "mdi:file-document-edit-outline",
    color: "#14b8a6",
  },
  {
    route: "/live-sessions",
    targetId: "live-tabs",
    title: "Live sessions",
    narration:
      "Scheduled classes with your cohort. Attendance is automatic, and recordings, transcripts and AI summaries attach themselves afterwards, so missing one is recoverable.",
    placement: "right",
    icon: "mdi:video-outline",
    color: "#3b82f6",
  },
  {
    route: "/community",
    targetId: "tour-filters",
    title: "Community",
    narration:
      "Ask your cohort. Questions can carry a points bounty, which is the mechanism that gets them answered instead of sitting unread.",
    placement: "right",
    icon: "mdi:forum-outline",
    color: "#8b5cf6",
  },
  {
    route: "/tickets",
    targetId: "tickets-tabs",
    title: "Support",
    narration:
      "Raise anything from a broken video to a certificate spelling, and follow it through to resolution. It routes to your instructor or the administration automatically.",
    placement: "right",
    icon: "mdi:lifebuoy",
    color: "#64748b",
  },
  {
    route: "/user/scorecard",
    targetId: "scorecard-body",
    title: "The point of all of it",
    narration:
      "Everything you do feeds a scorecard: skills, consistency, assessment and interview performance, benchmarked against your cohort. That is the artefact an employer can actually read.",
    icon: "mdi:chart-box-outline",
    color: "#22c55e",
  },
  {
    route: "/dashboard",
    title: "Explore freely",
    narration:
      "Every module is switched on and filled with data. Click anything. The question mark in any page header explains that page in detail, and the Guide button up top restarts this tour.",
    icon: "mdi:compass-outline",
    color: "#a78bfa",
  },
];

const INSTRUCTOR_TOUR: TourStep[] = [
  {
    route: "/instructor/dashboard",
    title: "The instructor workspace",
    narration:
      "This view is built around triage: who is falling behind, what is waiting to be marked, and what is on today. I will walk you through every part of it.",
    icon: "mdi:human-male-board",
    color: "#a78bfa",
  },
  {
    route: "/instructor/dashboard",
    targetId: "instructor-briefing",
    title: "Your teaching briefing",
    narration:
      "The top of the dashboard reads your cohorts and tells you the single highest-leverage thing to do today — usually the batch with the most students slipping, not just the newest notification.",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#7c3aed",
  },
  {
    route: "/instructor/dashboard",
    targetId: "instructor-kpis",
    title: "The numbers that matter",
    narration:
      "Students taught, active batches, average progress and how many need a nudge. Every one is a link into the list behind it, so a number you distrust is one click from the people it counts.",
    icon: "mdi:counter",
    color: "#f59e0b",
  },
  {
    route: "/instructor/students",
    targetId: "instructor-students",
    title: "Who needs attention",
    narration:
      "Students are flagged with the rule that flagged them — under twenty-five percent progress, a week with no activity, two missed sessions. A red badge with no reason is not something you can act on, so the reason travels with the flag.",
    icon: "mdi:account-alert-outline",
    color: "#ef4444",
  },
  {
    route: "/instructor/students",
    targetId: "instructor-student-stats",
    title: "Nudge, do not chase",
    narration:
      "From any student you can send a nudge that reaches their dashboard and their inbox. Following up stops being a spreadsheet of email addresses.",
    icon: "mdi:bell-ring-outline",
    color: "#10b981",
  },
  {
    route: "/instructor/cohorts",
    targetId: "instructor-cohorts",
    title: "Your batches",
    narration:
      "Each cohort carries its own progress, average score and at-risk count, so you can see which GROUP is struggling rather than only which individual is. You can message a whole batch from here.",
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
      "Everything awaiting review surfaces here, including the subjective answers the AI will not score on its own. The pending count is the queue, not a badge.",
    icon: "mdi:clipboard-check-outline",
    color: "#f97316",
  },
  {
    route: "/instructor/live-sessions",
    targetId: "instructor-sessions",
    title: "Live sessions",
    narration:
      "Host from here. Attendance is taken automatically, and the recording, transcript and AI summary attach themselves afterwards, so a student who missed it is not dependent on you remembering.",
    icon: "mdi:video-outline",
    color: "#0ea5e9",
  },
  {
    route: "/instructor/analytics",
    targetId: "instructor-analytics",
    title: "Analytics",
    narration:
      "Where your cohort is spending time and where it is stalling, broken down by activity type and by week. This is the view that tells you which lesson to rewrite.",
    icon: "mdi:chart-box-outline",
    color: "#22c55e",
  },
  {
    route: "/instructor/tickets",
    targetId: "instructor-tickets",
    title: "Questions routed to you",
    narration:
      "Support requests raised by students in your batches land here rather than in a shared inbox nobody owns.",
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
    title: "Running the institution",
    narration:
      "This is the administrator's view. It answers the question you cannot answer by walking the corridor: is this working, and for whom. I will show you every part.",
    icon: "mdi:shield-crown-outline",
    color: "#a78bfa",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-pulse",
    title: "Every number says what it counted",
    narration:
      "Each tile carries its definition. These figures end up in board meetings, and a metric that cannot say what it measured gets read with whichever meaning is most flattering.",
    icon: "mdi:information-outline",
    color: "#6366f1",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-at-risk",
    title: "Who is falling behind",
    narration:
      "At-risk students are listed with the rules that flagged them, ranked by how many fired. It is a worklist, not a warning light.",
    icon: "mdi:account-alert-outline",
    color: "#ef4444",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-engagement",
    title: "Engagement, honestly",
    narration:
      "When students actually study, which activity types they favour, and how consistent they are. The heatmap usually shows evenings — which is what a part-time cohort really looks like.",
    icon: "mdi:chart-timeline-variant",
    color: "#0ea5e9",
  },
  {
    route: "/admin/dashboard",
    targetId: "admin-learning",
    title: "Where they drop off",
    narration:
      "Activation and completion per course, with a week-by-week drop-off curve. That curve tells you which week of which course is losing people, which is the thing you can actually fix.",
    icon: "mdi:chart-areaspline",
    color: "#f59e0b",
  },
  {
    route: "/admin/manage-students",
    targetId: "students-table",
    title: "Everyone on the tenant",
    narration:
      "Search, filter and open any learner. A student page shows their whole journey: courses, activity, assessments, interviews and time on platform.",
    icon: "mdi:account-multiple-outline",
    color: "#8b5cf6",
  },
  {
    route: "/admin/cohorts",
    targetId: "cohorts-list",
    title: "Cohorts",
    narration:
      "Group learners for scheduling and reporting. Assigning a course to a cohort enrols everyone in it and keeps enrolling people who join later.",
    icon: "mdi:account-group-outline",
    color: "#6366f1",
  },
  {
    route: "/admin/instructors",
    targetId: "instructors-tabs",
    title: "Instructors and permissions",
    narration:
      "Add teaching staff and scope them to the courses, cohorts and sessions they own. An instructor only ever sees the students they are responsible for.",
    icon: "mdi:human-male-board",
    color: "#ec4899",
  },
  {
    route: "/admin/adaptive-courses",
    targetId: "adaptive-courses-list",
    title: "The course builder",
    narration:
      "Describe a course and the engine assembles the weeks, lessons, quizzes and coding problems. You review it, edit anything, and publish when it is ready — nothing reaches learners unapproved.",
    icon: "mdi:book-cog-outline",
    color: "#a855f7",
  },
  {
    route: "/admin/assessment",
    targetId: "admin-assessment-hero",
    title: "Assessments",
    narration:
      "Build formal papers, set duration and proctoring, and review submissions. Drafts stay invisible to students until you publish them.",
    icon: "mdi:clipboard-text-clock-outline",
    color: "#0ea5e9",
  },
  {
    route: "/admin/live-sessions",
    targetId: "live-sessions-list",
    title: "Live sessions",
    narration:
      "Schedule classes for a cohort, one-off or recurring, in the institution's own timezone. Attendance and recordings are captured without anyone remembering to press a button.",
    icon: "mdi:video-outline",
    color: "#3b82f6",
  },
  {
    route: "/admin/jobs-v2",
    targetId: "jobs-v2-list",
    title: "Jobs and placement",
    narration:
      "Post roles, set eligibility, and track applications through the pipeline. This is the module that turns a course completion into an outcome you can report.",
    icon: "mdi:briefcase-outline",
    color: "#10b981",
  },
  {
    route: "/admin/emails",
    targetId: "emails-list",
    title: "Communications",
    narration:
      "Send to a cohort or a filtered segment, and see delivery and open rates per campaign rather than guessing whether anyone read it.",
    icon: "mdi:email-outline",
    color: "#f97316",
  },
  {
    route: "/admin/tickets",
    targetId: "tickets-table",
    title: "Support queue",
    narration:
      "Every request across the institution, with who raised it, who owns it, and how long it has been waiting. Anything unanswered for three days is surfaced on the dashboard.",
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
      "Logo, wordmark, login copy, timezone and integrations. Everything a learner sees carries your institution's name, not ours — which is what your students should be looking at.",
    icon: "mdi:palette-outline",
    color: "#22c55e",
  },
  {
    route: "/admin/dashboard",
    title: "That is the whole picture",
    narration:
      "People, content, delivery and outcomes, with the evidence to back each one. Restart this tour any time from Guide in the top bar.",
    icon: "mdi:check-circle-outline",
    color: "#a78bfa",
  },
];

/** The tour for a role, defaulting to the learner's. */
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
      title: "You are signed in as an instructor",
      body: "This is the workspace a teacher lives in: who is falling behind, what needs marking, and what is on today.",
      minutes: 2,
      steps: INSTRUCTOR_TOUR.length,
    };
  }
  if (r === "admin" || r === "superadmin") {
    return {
      title: "You are signed in as an administrator",
      body: "This is the institution-wide view: engagement, outcomes, people, and everything you can configure.",
      minutes: 2,
      steps: ADMIN_TOUR.length,
    };
  }
  return {
    title: "You are signed in as a student",
    body: "This is what your learners see. Take the tour and I will walk you through the whole platform, module by module.",
    minutes: 2,
    steps: STUDENT_TOUR.length,
  };
}
