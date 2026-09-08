/**
 * Adaptive courses — the product's primary learning surface.
 *
 * The same seed that drives the dashboard is projected here into the adaptive
 * shape: modules become weeks, topics become submodules, and each topic's
 * declared content kinds become the article / quiz / coding / video entries
 * inside it. Nothing is invented at this layer, so a topic reported 100% on the
 * dashboard shows every one of its items ticked here.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  COURSES,
  courseById,
  topicsOf,
  itemCounts,
  courseArt,
  courseCover,
  type DemoCourse,
  type DemoTopic,
} from "../../db/courses";
import { overlay } from "../../db/overlay";
import { isoDaysAgo } from "../../clock";
import { seededInt, seededPick } from "../../random";
import { peekTopic } from "../../db/curriculum";

const MODULE = "adaptive-courses";

/** Content-id namespaces. Offsetting keeps article/quiz/coding ids distinct from topic ids. */
export const ARTICLE_ID = (topic: DemoTopic) => topic.id + 100_000;
export const QUIZ_ID = (topic: DemoTopic) => topic.id + 200_000;
export const CODING_ID = (topic: DemoTopic) => topic.id + 300_000;
export const VIDEO_ID = (topic: DemoTopic) => topic.id + 400_000;

/** Items the visitor completed this session, on top of whatever the seed says. */
function completedInSession(): number[] {
  return overlay.get<number[]>("adaptive:completed", []);
}

function isDone(topic: DemoTopic, contentId: number): boolean {
  return topic.progress === 100 || completedInSession().includes(contentId);
}

/** Whether a course counts as enrolled, including catalogue enrolments made in-session. */
function isEnrolled(course: DemoCourse): boolean {
  return course.enrolled || overlay.get<number[]>("courses:enrolled", []).includes(course.id);
}

const READING_TIERS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

function articleFor(topic: DemoTopic) {
  return {
    article_id: ARTICLE_ID(topic),
    title: topic.title,
    default_tier: "Intermediate" as const,
    available_tiers: [...READING_TIERS],
    reading_time_minutes: seededInt(`read:${topic.id}`, 5, 14),
    concepts: conceptsFor(topic),
    completed: isDone(topic, ARTICLE_ID(topic)),
  };
}

function quizFor(topic: DemoTopic) {
  return {
    config_id: QUIZ_ID(topic),
    quiz_title: `${topic.title} - check your understanding`,
    target_skills: conceptsFor(topic),
    mcq_count: seededInt(`mcq:${topic.id}`, 6, 12),
    min_questions: 6,
    max_questions: 12,
    hint_tokens: 3,
    confidence_prompt_enabled: true,
    completed: isDone(topic, QUIZ_ID(topic)),
    last_session_id: isDone(topic, QUIZ_ID(topic)) ? `sess-${topic.id}` : null,
  };
}

/**
 * The coding set shown on a lesson.
 *
 * Every field is read off the AUTHORED problem where one exists, rather than
 * invented alongside it. The card used to name itself "<topic> - problem 1" and
 * pick a difficulty with `seededPick(...)`, so the card and the page it opened
 * disagreed on both: an audit found 79 of 117 cards stating the wrong
 * difficulty, and the title never matched the problem at all.
 *
 * The course chunk is warmed by the lesson route before this runs, so the
 * synchronous lookup hits. When it misses, the card falls back to the old
 * derived labels rather than showing nothing.
 */
function codingSetFor(topic: DemoTopic, courseId?: number) {
  const authored = courseId == null ? null : peekTopic(courseId, topic.id);
  const problems = authored?.problems ?? [];
  const count = problems.length || seededInt(`cset:${topic.id}`, 2, 4);

  return {
    config_id: CODING_ID(topic),
    title: `${topic.title} - practice set`,
    target_skills: authored?.concepts ?? conceptsFor(topic),
    // The judge here is the browser, which runs JavaScript. Offering Python as
    // the default put the learner in a language this build cannot execute.
    default_language: "javascript",
    hint_layers: 3,
    problems: Array.from({ length: count }, (_, i) => {
      const p = problems[i];
      return {
        problem_id: CODING_ID(topic) + i + 1,
        title: p?.title ?? `${topic.title.split(":")[0]} · problem ${i + 1}`,
        difficulty_level:
          p?.difficulty ?? seededPick(`diff:${topic.id}:${i}`, ["Easy", "Medium", "Hard"] as const),
        target_skills: p?.skills ?? conceptsFor(topic),
        completed: isDone(topic, CODING_ID(topic) + i + 1),
      };
    }),
  };
}

function videoFor(topic: DemoTopic) {
  return {
    id: VIDEO_ID(topic),
    title: topic.title,
    video_title: topic.title,
    thumbnail_url: "",
    duration_seconds: seededInt(`vid:${topic.id}`, 420, 1500),
    check_in_count: seededInt(`checkin:${topic.id}`, 2, 5),
    completed: isDone(topic, VIDEO_ID(topic)),
  };
}

/**
 * Concepts for a topic, derived from its title.
 *
 * Deliberately derived rather than hand-authored per topic: there are ~120 topics
 * across the catalogue, and a hand-written list would inevitably go stale against
 * the titles. Splitting the title gives concepts that always match what is on the
 * card.
 */
export function conceptsFor(topic: DemoTopic): string[] {
  // The list has to be generous. A thin one let "Immutability and why state bugs
  // hide there" produce the tag "Why", which reads as broken on a skill chip
  // sitting next to real ones like "PostgreSQL".
  const STOP = new Set([
    // articles, conjunctions, prepositions
    "the", "and", "of", "for", "with", "a", "an", "in", "on", "to", "at", "as",
    "by", "from", "into", "onto", "over", "under", "about", "after", "before",
    "between", "through", "without", "within", "across", "than", "then", "but",
    "or", "nor", "so", "yet", "per", "via",
    // pronouns and determiners
    "you", "your", "yours", "it", "its", "they", "them", "their", "we", "our",
    "this", "that", "these", "those", "each", "every", "any", "all", "both",
    "some", "most", "more", "much", "many", "one", "two", "other", "another",
    // question words and adverbs, the ones that produced bad tags
    "how", "what", "why", "when", "where", "which", "who", "whom", "whose",
    "here", "there", "still", "just", "only", "even", "also", "really", "very",
    // common verbs and auxiliaries
    "is", "are", "was", "were", "be", "been", "being", "am", "do", "does",
    "did", "has", "have", "had", "can", "could", "will", "would", "should",
    "must", "may", "might", "let", "lets", "get", "gets", "got", "make",
    "makes", "made", "need", "needs", "use", "uses", "using", "not", "no",
    "actually", "hide", "hides", "matter", "matters", "work", "works",
    "think", "know", "want", "take", "takes", "put", "puts", "end", "ends",
  ]);

  const words = topic.title
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w.toLowerCase()));

  // Prefer terms already capitalised or containing a capital (React, PostgreSQL,
  // Big-O) — those are the real technical nouns in a title.
  const technical = words.filter((w) => /[A-Z]/.test(w.slice(1)) || /^[A-Z]/.test(w));
  const ordered = [...technical, ...words.filter((w) => !technical.includes(w))];

  const seen = new Set<string>();
  const concepts: string[] = [];
  for (const word of ordered) {
    const label = /[A-Z]/.test(word.slice(1)) ? word : word[0].toUpperCase() + word.slice(1);
    if (seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    concepts.push(label);
    if (concepts.length === 4) break;
  }

  // A topic whose title is entirely stopwords would otherwise render no tags.
  return concepts.length > 0 ? concepts : [topic.title.split(/\s+/)[0]];
}

export function submoduleFor(topic: DemoTopic, order: number, courseId?: number) {
  const kinds = new Set(topic.kinds);
  return {
    id: topic.id,
    order,
    title: topic.title,
    description: `Work through ${topic.title.toLowerCase()} and prove it with practice.`,
    articles: kinds.has("article") ? [articleFor(topic)] : [],
    quizzes: kinds.has("quiz") ? [quizFor(topic)] : [],
    coding_sets: kinds.has("coding") ? [codingSetFor(topic, courseId)] : [],
    video_companions: kinds.has("video") ? [videoFor(topic)] : [],
    attachments: [],
  };
}

function listItem(course: DemoCourse) {
  const counts = itemCounts(course);
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    target_audience:
      course.difficulty === "Beginner"
        ? "Newcomers with no prior background"
        : course.difficulty === "Advanced"
          ? "Engineers preparing for senior or product-company interviews"
          : "Learners with some programming experience",
    duration_weeks: course.modules.length * 2,
    difficulty_levels: [course.difficulty],
    module_count: course.modules.length,
    submodule_count: topicsOf(course).length,
    quiz_count: counts.quiz,
    article_count: counts.article,
    coding_count: counts.coding_problem,
    video_count: counts.video,
    // Real photograph, with the generated gradient as the documented fallback
    // the card falls back to when the image cannot load.
    card_image_url: courseCover(course.id) || courseArt(course),
    card_image_fallback_url: courseArt(course),
    // Every course is open to self-enrolment so a prospect can enrol from the
    // catalogue and watch it appear on their dashboard.
    self_enroll_enabled: true,
    is_paid: false,
    price: null,
    currency: "INR",
    purchased: false,
    updated_at: isoDaysAgo(seededInt(`upd:${course.id}`, 2, 21)),
  };
}

function detail(course: DemoCourse) {
  let order = 0;
  return {
    ...listItem(course),
    header_image_url: courseCover(course.id, 1600) || courseArt(course),
    header_image_fallback_url: courseArt(course),
    instructors: [{ name: course.instructor.full_name }],
    modules: course.modules.map((m, i) => ({
      id: m.id,
      weekno: i + 1,
      title: m.title,
      submodules: m.topics.map((t) => submoduleFor(t, ++order, course.id)),
    })),
  };
}

defineRoutes(MODULE, {
  /** Courses this learner is enrolled in — the /adaptive-courses landing list. */
  "GET /adaptive-quiz/api/courses/": () => COURSES.filter(isEnrolled).map(listItem),

  /**
   * The catalogue: everything open to self-enrolment, enrolled or not. The page
   * distinguishes the two itself, so both are returned.
   */
  "GET /adaptive-quiz/api/courses/catalog/": () => COURSES.map(listItem),

  "GET /adaptive-quiz/api/courses/:courseId/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    return detail(course);
  },

  "POST /adaptive-quiz/api/courses/:courseId/enroll/": (req) => {
    const course = courseById(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const already = isEnrolled(course);
    overlay.update<number[]>("courses:enrolled", [], (list) =>
      list.includes(course.id) ? list : [...list, course.id],
    );
    return { course_id: course.id, enrolled: true, already_enrolled: already };
  },
});
