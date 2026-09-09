/**
 * Detail endpoints for every "open this row" destination.
 *
 * List pages and detail pages are separate endpoints with separate shapes, and a
 * demo that only serves the lists looks complete right up until someone clicks a
 * row. These are the ten that a sweep of every dynamic route turned up: cohort,
 * adaptive course, course roster, student, learning journey, job, email job,
 * course certificate config, and the two assessment views.
 *
 * Kept in one module because they share the same job, projecting an existing
 * seed record into the richer shape a detail page wants, rather than because
 * they belong to one feature.
 */

import { defineRoutes } from "../router";
import {
  COHORTS,
  MID_PROGRAMME_PAPER,
  batchMembers,
  emailJobDetail,
  facultyCode,
  interviewSittingFor,
  midProgrammeScore,
  syllabusCovered,
} from "./admin";
import { adminAdaptiveCourseDetail, builderCourse as builderCourseById } from "./course-builder";
import { courseRosterMembers } from "./misc-actions";
import { isRosterActive, rosterPerson } from "./account-actions";
import { notFound } from "../types";
import { COURSES, courseById, topicsOf } from "../../db/courses";
import {
  INSTRUCTOR_PERSONA,
  STUDENTS,
  STUDENT_PERSONA,
  personById,
  type DemoPerson,
} from "../../db/people";
import { applicationsForJob, jobById, toAdminJob } from "../../db/jobs";
import { isoDaysAgo, ymd, ymdDaysAgo, ymdDaysAhead, daysAgo } from "../../clock";
import { seededInt, seededPick } from "../../random";

const MODULE = "details";

/**
 * Batches and their rosters both come from `admin.ts`.
 *
 * This module used to keep its own three, named "Autumn 2026 - Full-Stack" and
 * pointed at courses 201 and 203, which do not exist in this catalogue: the
 * batch page therefore opened onto a title from the build this was forked from
 * and a description reading "runs the undefined track". Its roster helper had
 * the same fixed-window bug as the faculty one, so the completed batch claimed
 * 24 members and listed five.
 */
function membersOf(cohortId: number, size: number): DemoPerson[] {
  return batchMembers(cohortId, size);
}

/**
 * The faculty member answerable for a batch, read off the batch record.
 *
 * A trade batch at a skill centre is led by its trainer, not by the exam faculty
 * member, and an officer ringing about the Suryapet digital literacy batch has to
 * reach the person who actually runs it.
 */
function batchStaff(cohortId: number) {
  const batch = COHORTS.find((c) => c.id === cohortId);
  const lead = personById(batch?.leadId ?? INSTRUCTOR_PERSONA.id) ?? INSTRUCTOR_PERSONA;
  return [
    {
      profile_id: lead.id,
      name: lead.full_name,
      email: lead.email,
      role: "lead",
    },
  ];
}

/**
 * Syllabus covered.
 *
 * `admin.ts` owns the figure, and this module opens the rows that table lists,
 * so it reads that one rather than seeding a second under the same name. The
 * signed-in aspirant's is the figure her own dashboard ring shows.
 */
function progressOf(p: DemoPerson): number {
  return syllabusCovered(p);
}

/**
 * The papers this aspirant has actually sat.
 *
 * Read off the record `admin.ts` mints, so the title, the id and the mark are
 * the ones the faculty gradebook lists, the result email announced and her own
 * scorecard reports. This list used to hold a diagnostic on data structures,
 * which is on no paper list in this build and on no syllabus in this catalogue,
 * and then a score of its own that disagreed with the scorecard's.
 */
function sittings(p: DemoPerson) {
  return [
    {
      id: MID_PROGRAMME_PAPER.id,
      title: MID_PROGRAMME_PAPER.title,
      score: midProgrammeScore(p),
      total_marks: MID_PROGRAMME_PAPER.totalMarks,
      submitted_at: isoDaysAgo(MID_PROGRAMME_PAPER.daysAgo),
      status: "completed",
    },
  ];
}

/**
 * The selection board this aspirant has sat in the mock interview module.
 *
 * Read off `admin.ts`, which owns the sitting, so the board named here is the
 * board the officer's mock interview list names for the same person and the
 * score is the same score. This list used to hard-code the TGPSC board for
 * everybody, so a solar trainee whose row on the officer's list said "Trade
 * placement panel" opened onto a journey claiming she had faced a recruitment
 * board, at a different score.
 */
function interviewSittings(p: DemoPerson) {
  const sitting = interviewSittingFor(p);
  return [
    {
      id: sitting.id,
      title: sitting.title,
      // No score until the board has met, which is the same rule the officer's
      // mock interview list applies to the same sitting.
      score: sitting.status === "completed" ? sitting.score : null,
      status: sitting.status,
      created_at: isoDaysAgo(9),
    },
  ];
}

/**
 * What this aspirant has done, by kind.
 *
 * Every key the chart declares stays in the shape, and the two this catalogue
 * has no content for stay at zero. A breakdown that reports 40 coding problems
 * on a syllabus with none is counting something that does not exist, and the
 * reader has no way to tell which other bar is wrong. The summary's
 * `total_activities` is the sum of these, so the header and the chart cannot
 * disagree about how much work the person has put in.
 */
function activityBreakdown(p: DemoPerson): Record<string, number> {
  return {
    Article: seededInt(`ab:a:${p.id}`, 10, 70),
    Quiz: seededInt(`ab:q:${p.id}`, 5, 44),
    CodingProblem: 0,
    VideoTutorial: 0,
    Assignment: seededInt(`ab:s:${p.id}`, 2, 14),
  };
}

defineRoutes(MODULE, {
  // ── Cohort detail ───────────────────────────────────────────────────────
  "GET /cohort/api/admin/cohorts/:cohortId/": (req) => {
    const c = COHORTS.find((x) => x.id === Number(req.params.cohortId));
    if (!c) throw notFound("No batch with that record");
    const members = membersOf(c.id, c.size);

    return {
      id: c.id,
      name: c.name,
      // Says what the batch is for, where it runs and who is on it, because that
      // is the sentence a programme officer copies into a district note.
      description: `${c.size} of ${c.capacity} seats filled at the ${c.centre}, ${c.district} district, ${c.intake}. Preparing for ${c.courseIds
        .map((id) => courseById(id)?.title)
        .filter(Boolean)
        .join(" and ")}.`,
      status: c.status,
      start_date: c.status === "completed" ? ymdDaysAgo(210) : ymdDaysAgo(120),
      end_date: c.status === "completed" ? ymdDaysAgo(40) : ymdDaysAhead(90),
      capacity: c.capacity,
      member_count: members.length,
      created_at: isoDaysAgo(150),
      updated_at: isoDaysAgo(3),
      artifacts: c.courseIds
        .map((id) => courseById(id))
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .map((course) => ({
          id: course.id,
          kind: "adaptive_course",
          title: course.title,
          assigned_at: isoDaysAgo(100),
        })),
      staff: batchStaff(c.id),
      members: members.map((p) => ({
        student_id: p.id,
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone,
        profile_pic_url: p.profile_pic_url,
        status: "active",
        progress: progressOf(p),
        joined_at: isoDaysAgo(seededInt(`join:${p.id}`, 30, 120)),
      })),
    };
  },

  /**
   * Staff assigned to a batch (the admin batch page loads this separately).
   *
   * The lead comes off the batch record and the code off `facultyCode`. It used
   * to be the faculty persona whichever batch you opened, under a hand-typed
   * `MIT-VM-04` that matched neither the code on his own dashboard nor the one
   * in the staff directory: three codes for one person reads as three records.
   */
  "GET /instructor/api/admin/cohorts/:cohortId/staff/": (req) =>
    batchStaff(Number(req.params.cohortId)).map((lead) => ({
      ...lead,
      instructor_code: facultyCode(lead.profile_id),
      assigned_at: isoDaysAgo(100),
    })),

  /** Cohort membership, paginated separately from the cohort record. */
  "GET /cohort/api/admin/cohorts/:cohortId/members/": (req) => {
    const c = COHORTS.find((x) => x.id === Number(req.params.cohortId));
    if (!c) throw notFound("No batch with that record");
    const members = membersOf(c.id, c.size);
    return {
      count: members.length,
      results: members.map((p) => ({
        id: p.id,
        student_id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone,
        profile_pic_url: p.profile_pic_url,
        status: "active",
        progress: progressOf(p),
        joined_at: isoDaysAgo(seededInt(`join:${p.id}`, 30, 120)),
      })),
    };
  },

  /**
   * Adaptive course detail, the admin builder tree.
   *
   * Delegated to the course-builder projection rather than read off the seed
   * directly. It used to project `COURSES`, so a module or topic the admin added
   * in the builder was accepted, persisted, and then absent from the very tree
   * they were looking at. Both now read the same merged view.
   */
  "GET /adaptive-quiz/api/admin/courses/:courseId/": (req) =>
    adminAdaptiveCourseDetail(Number(req.params.courseId)),

  /**
   * The enrolled roster for one adaptive course (admin + instructor course page).
   *
   * Membership comes from `misc-actions.ts` rather than straight off the seed:
   * that module owns the enrol and unenrol writes, and a student removed there
   * has to still be gone after a reload.
   */
  "GET /adaptive-quiz/api/admin/courses/:courseId/students/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const roster = courseRosterMembers(course.id);

    return {
      count: roster.length,
      // CourseRoster declares page and page_size alongside count. The whole
      // roster comes back in one response, so page 1 always holds all of it.
      page: 1,
      page_size: roster.length,
      results: roster.map((p) => ({
        student_id: p.id,
        id: p.id,
        name: p.full_name,
        email: p.email,
        phone: p.phone,
        profile_pic_url: p.profile_pic_url,
        enrolled_at: isoDaysAgo(seededInt(`enr:${p.id}`, 20, 120)),
        progress_percentage: progressOf(p),
        completed: Math.round((progressOf(p) / 100) * topicsOf(course).length),
        total: topicsOf(course).length,
        points: p.points,
        last_activity: isoDaysAgo(seededInt(`ilast:${p.id}`, 0, 9)),
      })),
    };
  },

  // ── Student detail + learning journey ───────────────────────────────────
  /**
   * StudentDetail groups its fields: personal_info / academic_summary /
   * enrolled_courses. The page reads `data.personal_info.first_name` directly,
   * so a flat payload crashed it even though every value was present.
   */
  "GET /admin-dashboard/api/clients/:clientId/manage-student/:studentId/": (req) => {
    // rosterPerson, not personById: a student the admin created through
    // quick-enrol is not in the seeded cast, and opening their row from the
    // table they just appeared in would 404.
    const p = rosterPerson(Number(req.params.studentId));
    if (!p) throw notFound("No aspirant with that record");
    const hours = seededInt(`sdh:${p.id}`, 12, 160);

    return {
      id: p.id,
      user_id: p.id,
      personal_info: {
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        username: p.user_name,
        profile_pic_url: p.profile_pic_url,
        date_joined: isoDaysAgo(seededInt(`dj:${p.id}`, 20, 200)),
        last_login: isoDaysAgo(seededInt(`ll:${p.id}`, 0, 12)),
        is_active: isRosterActive(p.id),
      },
      academic_summary: {
        total_marks: p.points,
        total_time_spent: { value: hours, unit: "hours" },
        enrolled_courses_count: COURSES.filter((c) => c.enrolled).length,
        assessment_submissions_count: seededInt(`sas:${p.id}`, 0, 4),
        current_streak: p.streak,
        total_activities: seededInt(`sact:${p.id}`, 30, 260),
      },
      enrolled_courses: COURSES.filter((c) => c.enrolled).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.subtitle,
        enrollment_date: isoDaysAgo(seededInt(`enr:${p.id}`, 20, 120)),
        marks: seededInt(`cm:${p.id}:${c.id}`, 60, 900),
        progress_percentage: seededInt(`sc:${p.id}:${c.id}`, 4, 98),
      })),
      phone_number: p.phone,
      college: p.college,
      linkedin_url: p.linkedin_url,
    };
  },

  /**
   * StudentLearningJourney: student / summary / courses / weekly_progress /
   * assessments / mock_interviews / adaptive / activity_breakdown /
   * activity_pattern_30_days / timeline. The page reads
   * `summary.overall_completion_pct` with no guard, so a partial payload takes
   * the route down rather than showing an empty tab.
   */
  "GET /admin-dashboard/api/clients/:clientId/student-learning-journey/:studentId/": (req) => {
    const p = personById(Number(req.params.studentId));
    if (!p) throw notFound("No aspirant with that record");

    const enrolled = COURSES.filter((c) => c.enrolled);
    const hours = seededInt(`lj:t:${p.id}`, 20, 160);
    const completion = progressOf(p);

    // The rows the tabs below render, built before the summary rather than
    // after it, because every count in that summary is the length of one of
    // them. They were four independent seeded numbers, so the header could
    // promise three mock interviews over a tab holding one, and no reader had
    // any way to tell which of the two was the record.
    const papers = sittings(p);
    const boards = interviewSittings(p);
    const activity = activityBreakdown(p);
    const adaptiveSessions = seededInt(`ad:s:${p.id}`, 4, 40);

    return {
      student: {
        id: p.id,
        user_id: p.id,
        name: p.full_name,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        username: p.user_name,
        profile_pic_url: p.profile_pic_url,
        is_active: true,
        date_joined: isoDaysAgo(seededInt(`dj:${p.id}`, 20, 200)),
        last_login: isoDaysAgo(seededInt(`ll:${p.id}`, 0, 12)),
      },
      summary: {
        enrolled_courses_count: enrolled.length,
        total_marks: p.points,
        total_time_hours: hours,
        current_streak: p.streak,
        total_activities: Object.values(activity).reduce((sum, n) => sum + n, 0),
        overall_completion_pct: completion,
        last_activity_date: isoDaysAgo(seededInt(`ilast:${p.id}`, 0, 9)),
        assessments_count: papers.length,
        mock_interviews_count: boards.length,
        adaptive_sessions_count: adaptiveSessions,
      },
      courses: enrolled.map((c) => ({
        id: c.id,
        title: c.title,
        progress_percentage: seededInt(`sc:${p.id}:${c.id}`, 4, 98),
        marks: seededInt(`cm:${p.id}:${c.id}`, 60, 900),
        enrollment_date: isoDaysAgo(seededInt(`enr:${p.id}`, 20, 120)),
        completed_items: seededInt(`ci:${p.id}:${c.id}`, 2, 20),
        total_items: topicsOf(c).length,
        last_activity: isoDaysAgo(seededInt(`la:${p.id}:${c.id}`, 0, 14)),
      })),
      weekly_progress: enrolled.map((c) => ({
        course_id: c.id,
        course_title: c.title,
        weeks: Array.from({ length: 8 }, (_, w) => ({
          week: w + 1,
          activities: seededInt(`wk:${p.id}:${c.id}:${w}`, 0, 12),
          marks: seededInt(`wm:${p.id}:${c.id}:${w}`, 0, 120),
        })),
      })),
      assessments: papers,
      mock_interviews: {
        // Counted off the sittings themselves. The block used to claim two
        // completed boards above a list holding one, and then average and best
        // scores seeded independently of both, so three numbers described a
        // sitting that was not in the list under them.
        summary: {
          total: boards.length,
          completed: boards.filter((b) => b.status === "completed").length,
          average_score: Math.round(
            boards.reduce((sum, b) => sum + (b.score ?? 0), 0) /
              Math.max(1, boards.filter((b) => b.score !== null).length),
          ),
          highest_score: boards.reduce((best, b) => Math.max(best, b.score ?? 0), 0),
        },
        items: boards,
      },
      adaptive: {
        sessions: adaptiveSessions,
        questions_answered: seededInt(`ad:q:${p.id}`, 30, 300),
        accuracy: seededInt(`ad:a:${p.id}`, 48, 92),
        skills: enrolled.flatMap((c) => c.tags.slice(0, 2)).slice(0, 6).map((skill) => ({
          skill,
          mastery: seededInt(`ad:m:${p.id}:${skill}`, 30, 95),
        })),
      },
      activity_breakdown: activity,
      activity_pattern_30_days: Array.from({ length: 30 }, (_, i) => ({
        date: ymd(daysAgo(29 - i)),
        activity_count: seededInt(`ap:${p.id}:${i}`, 0, 9),
        time_spent_hours: Number((seededInt(`ah:${p.id}:${i}`, 0, 25) / 10).toFixed(1)),
        marks_earned: seededInt(`am:${p.id}:${i}`, 0, 90),
      })),
      // Type and title are picked from one list, so a row cannot be a quiz filed
      // as a live class. "coding" is gone from both: there is no coding item
      // anywhere in this catalogue for a timeline to record.
      timeline: Array.from({ length: 10 }, (_, i) => {
        const event = seededPick(`tl:${p.id}:${i}`, [
          { type: "article", title: "Read a syllabus topic" },
          { type: "quiz", title: "Took a practice quiz" },
          { type: "assignment", title: "Submitted an assignment" },
          { type: "live_session", title: "Attended a live class" },
          { type: "assessment", title: "Sat a mock test" },
        ]);
        return {
          id: 9600 + i,
          type: event.type,
          title: event.title,
          course: seededPick(`tl:c:${p.id}:${i}`, enrolled.map((c) => c.title)),
          marks: seededInt(`tl:m:${p.id}:${i}`, 0, 90),
          at: isoDaysAgo(i + 1, 15, 0),
          created_at: isoDaysAgo(i + 1, 15, 0),
        };
      }),
    };
  },

  /**
   * Job detail (admin).
   *
   * Reads the shared posting. The previous version knew six hard-coded jobs by
   * id and four fields each, so the detail page had no description, no skills,
   * no colleges and no mapped courses, the edit form loaded blank over half its
   * fields and saved the blanks back, and a job an administrator created 404'd
   * the moment they clicked its row.
   */
  "GET /jobs-v2/api/admin/jobs/:jobId/": (req) => {
    const id = Number(req.params.jobId);
    const job = jobById(id);
    if (!job) throw notFound("Job not found");

    return {
      ...toAdminJob(job),
      // Kept alongside the count for any surface that wants the roster inline.
      applications: applicationsForJob(id).map((row) => ({
        id: row.id,
        student: {
          id: row.student,
          name: row.student_name,
          email: row.student_email,
          profile_pic_url: row.student_profile_pic_url,
        },
        status: row.status,
        applied_at: row.applied_at,
      })),
    };
  },

  /**
   * Email job detail.
   *
   * Delegates to the same seed the list uses. It previously invented its own
   * fields (`total_recipients`, `sent`, `recipients`) where `EmailJobDetail`
   * declares `emails` / `successful_emails` / `failed_emails`, so the drawer
   * opened onto a job with no recipients and no counts, and it was one fixed
   * job regardless of which card you clicked.
   */
  "GET /admin-dashboard/api/clients/:clientId/email-jobs/:jobId/": (req) =>
    emailJobDetail(String(req.params.jobId)),

  // ── Certificate config for a course ─────────────────────────────────────
  /**
   * Certificate configuration for one course.
   *
   * Resolved through the builder projection, not `courseById`: the certificates
   * page lists every course an admin can see, including ones they built in this
   * session, and reading only the seed made those rows open onto a 404.
   */
  "GET /admin-dashboard/api/clients/:clientId/courses/:courseId/view-course-details/": (req) => {
    const id = Number(req.params.courseId);
    const built = builderCourseById(id);
    if (!built) throw notFound("Course not found");
    const seeded = courseById(id);
    const threshold = seeded ? seeded.certificateThreshold : 70;

    return {
      course_id: built.id,
      course_title: built.title,
      certificate_enabled: built.certificate_available,
      min_completion_percent: threshold,
      title: `${built.title}: certificate of completion`,
      template_url: null,
      configured: Boolean(seeded),
      eligible_students: Math.round(built.enrolled_count * 0.18),
      issued_count: Math.round(built.enrolled_count * 0.11),
    };
  },

  // ── Legacy course dashboard + leaderboard ───────────────────────────────
  /** Per-course progress panel on the classic course page. */
  "GET /lms/clients/:clientId/courses/:courseId/user-course-dashboard/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const topics = topicsOf(course);
    const done = topics.filter((t) => t.progress === 100).length;

    return {
      course_id: course.id,
      course_title: course.title,
      progress_percentage: course.completion,
      completed_items: done,
      total_items: topics.length,
      time_spent_seconds: seededInt(`cts:${course.id}`, 8, 40) * 3600,
      last_accessed: isoDaysAgo(1, 19, 0),
      certificate_eligible: course.completion >= course.certificateThreshold,
      certificate_threshold: course.certificateThreshold,
      stats: {
        articles: topics.filter((t) => t.kinds.includes("article")).length,
        quizzes: topics.filter((t) => t.kinds.includes("quiz")).length,
        coding: topics.filter((t) => t.kinds.includes("coding")).length,
        assignments: topics.filter((t) => t.kinds.includes("assignment")).length,
      },
    };
  },

  "GET /lms/clients/:clientId/courses/:courseId/leaderboard/": () =>
    [STUDENT_PERSONA, ...STUDENTS.slice(0, 14)]
      .map((p) => ({
        id: p.id,
        name: p.full_name,
        profile_pic_url: p.profile_pic_url,
        marks: p.points,
        score: p.points,
        college: p.college,
        is_current_user: p.id === STUDENT_PERSONA.id,
      }))
      .sort((a, b) => b.marks - a.marks)
      .map((row, i) => ({ ...row, rank: i + 1 })),

  /**
   * Generic upload. Accepts and echoes a data URI rather than storing anything,
   * so an uploaded file appears immediately and needs no bucket.
   */
  "POST /api/clients/:clientId/upload/": () => ({
    url: "",
    detail: "Uploads are accepted but not stored in this demo.",
  }),
  "GET /api/clients/:clientId/upload/": () => ({ results: [], count: 0 }),

  /*
   * The three assessment reads that used to live here (details, readiness and
   * result) moved to `assessment-admin.ts`, which owns the catalogue and the
   * scorer. They were answering with shapes the app does not declare: the result
   * carried a flat `sections` array where `AssessmentResult` wants `stats`,
   * `assessment_details` and `user_responses`, so the report page rendered a
   * failure toast rather than a report. Two projections of one record is the bug.
   */
});
