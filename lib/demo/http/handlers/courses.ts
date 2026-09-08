/**
 * The legacy `lms/` course shape.
 *
 * The product is mid-migration to adaptive courses (which have their own
 * endpoints and their own richer payload). For this tenant the migration is
 * finished at the sidebar: `db/tenant.ts` leaves the `course` feature flag OFF,
 * because the mission's programmes ARE the adaptive courses and two entries
 * called Courses pointing at different products is not a thing to show an
 * officer.
 *
 * These routes stay served anyway, because the flag hides a nav item and not the
 * API. The admin enrolment picker (`EnrollmentJobStatus.tsx`) still lists
 * programmes from `GET /lms/.../courses/`, so an empty answer here would leave a
 * Programme Officer choosing a course from an empty dropdown. Everything is
 * projected off the same nineteen-course seed the adaptive endpoints use, so the
 * two can never disagree about what the mission runs.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  COURSES,
  courseArt,
  enrolledAt,
  itemCounts,
  courseById,
  topicById,
  type DemoCourse,
} from "../../db/courses";
import { builderContents, builderModules, builderSubmodules } from "./course-builder";
import { companyLogoFor } from "../../db/avatar";
import { STUDENTS } from "../../db/people";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { overlay } from "../../db/overlay";
import { seededSample } from "../../random";

const MODULE = "courses";

/**
 * Recruiting bodies and public undertakings shown as "trusted by" on a course
 * page.
 *
 * For a state mission this strip means "these are the organisations our
 * candidates are selected into", so it names recruiting bodies and state
 * undertakings rather than employers with a careers brand. The same names appear
 * on the notification board in `db/jobs.ts`, which is deliberate: an officer who
 * reads one screen and then the other should meet the same institutions.
 *
 * The logos are generated initials tiles (`companyLogoFor`), never a fetched
 * emblem, because reproducing a real government seal is out of bounds and the
 * demo may not reach the network.
 */
const TRUSTED_BY = [
  "TGPSC",
  "SSC",
  "IBPS",
  "Singareni Collieries",
  "TGTRANSCO",
  "BHEL Hyderabad",
].map((name, i) => ({ id: i + 1, name, logo_url: companyLogoFor(name) }));

/**
 * The entry requirement shown on a course page, by section.
 *
 * One sentence for the whole catalogue was wrong the moment the catalogue held
 * both a Group-I course and a domestic wiring course. The exam tracks assume the
 * qualification the notification itself demands, and the trade courses
 * deliberately assume nothing past schooling, because that is who a district
 * skill centre enrols. Neither line states an eligibility rule as current fact:
 * qualification, age and relaxation are set by each notification and change from
 * one to the next, so the copy points the reader at the notification instead of
 * answering for it.
 */
function requirementsFor(course: DemoCourse): string {
  return course.section === "govt-jobs"
    ? "No previous coaching is assumed and the syllabus is taught from the beginning. " +
        "Read the eligibility clause of the notification you intend to sit, because qualification, " +
        "age limit and relaxation are set there and not here."
    : "Tenth standard reading and everyday arithmetic are enough to start. Tools, safety practice " +
        "and the vocabulary of the trade are taught from the first module, and the practical work " +
        "is done at your skill centre.";
}

/** Courses the visitor enrolled in during this session, on top of the seed. */
function isEnrolled(course: DemoCourse): boolean {
  const extra = overlay.get<number[]>("courses:enrolled", []);
  return course.enrolled || extra.includes(course.id);
}

function toApiCourse(course: DemoCourse) {
  const counts = itemCounts(course);
  const cohort = seededSample(`students:${course.id}`, STUDENTS, 5);

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    slug: course.slug,
    requirements: requirementsFor(course),
    learning_objectives: course.modules.map((m) => m.summary).join("\n"),
    language: "English",
    difficulty_level: course.difficulty,
    duration_in_hours: course.durationHours,
    price: "0.00",
    is_free: true,
    certificate_available: true,
    thumbnail: courseArt(course),
    preview_video_url: null,
    published: true,
    enrollment_enabled: true,
    created_at: enrolledAt(course),
    updated_at: isoDaysAgo(4),
    tags: course.tags,
    client: 101,
    liked_by: [],
    is_enrolled: isEnrolled(course),
    instructors: [
      {
        id: course.instructor.id,
        name: course.instructor.full_name,
        bio: course.instructor.headline,
        profile_pic_url: course.instructor.profile_pic_url,
        linkedin: course.instructor.linkedin_url,
      },
    ],
    trusted_by: TRUSTED_BY,
    enrolled_students: {
      total: course.enrolledCount,
      students_profile_pic: cohort.map((s) => s.profile_pic_url),
    },
    stats: {
      video: { total: counts.video },
      quiz: { total: counts.quiz },
      article: { total: counts.article },
      assignment: { total: counts.assignment },
      coding_problem: { total: counts.coding_problem },
      subjective_question: { total: 0 },
    },
    rating: course.rating,
    rating_count: course.ratingCount,
    // The dashboard rail reads progress off the list without a second request.
    progress: course.completion,
    completion_percentage: course.completion,
  };
}

defineRoutes(MODULE, {
  "GET /lms/clients/:clientId/courses/": () => COURSES.map(toApiCourse),

  /**
   * Course DETAIL is a different shape from the list item: `CourseDetail`, with
   * course_id/course_title/modules rather than id/title/stats. Returning the
   * list shape here crashed the page with "Objects are not valid as a React
   * child" — the component rendered a field it expected to be a string and got
   * one of the list's nested objects instead.
   */
  "GET /lms/clients/:clientId/courses/:courseId/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");

    return {
      course_id: course.id,
      course_title: course.title,
      course_description: course.description,
      instructors: [
        {
          id: course.instructor.id,
          name: course.instructor.full_name,
          bio: course.instructor.headline,
          profile_pic_url: course.instructor.profile_pic_url,
          linkedin: course.instructor.linkedin_url,
        },
      ],
      enrolled_students: course.enrolledCount,
      liked_count: Math.round(course.enrolledCount * 0.42),
      is_liked_by_current_user: false,
      is_certified: true,
      certificate_available: true,
      updated_at: isoDaysAgo(4),
      content_lock_enabled: false,
      lock_threshold_value: 0,
      // The tree comes from the course-builder projection, not straight off the
      // seed. An administrator who adds a week in the builder and then looks at
      // the same course as a learner has to see it; reading `course.modules` here
      // meant the two views disagreed about what the course contained.
      modules: builderModules(course.id).map((m) => {
        const topics = builderSubmodules(m.id);
        const done = topics.filter((t) => {
          const topic = topicById(t.id);
          return topic?.topic.progress === 100;
        }).length;
        return {
          id: m.id,
          weekno: m.weekno,
          title: m.title,
          completion_percentage: Math.round((done / Math.max(1, topics.length)) * 100),
          submodules: topics.map((t) => {
            const contents = builderContents(t.id);
            const count = (type: string) =>
              contents.filter((c) => c.content_type === type).length;
            return {
              id: t.id,
              title: t.title,
              description: t.description,
              order: t.order,
              video_count: count("VideoTutorial"),
              quiz_count: count("Quiz"),
              article_count: count("Article"),
              coding_problem_count: count("CodingProblem"),
              assignment_count: count("Assignment"),
              subjective_question_count: 0,
            };
          }),
        };
      }),
    };
  },

  /**
   * Enrolment is recorded in the overlay, so a prospect who enrols from the
   * catalogue finds the course on their dashboard afterwards. That round trip is
   * worth more in a demo than any static "enrolled" badge.
   */
  "POST /lms/clients/:clientId/courses/:courseId/enroll/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    overlay.update<number[]>("courses:enrolled", [], (list) =>
      list.includes(course.id) ? list : [...list, course.id],
    );
    return { detail: `You are enrolled in ${course.title}.`, enrolled_at: iso(new Date(nowMs())) };
  },
});
