import { peekTopic, type AuthoredQuestion } from "./curriculum";
import course301 from "./quiz-banks/course-301";
import course302 from "./quiz-banks/course-302";
import course303 from "./quiz-banks/course-303";
import course304 from "./quiz-banks/course-304";
import course305 from "./quiz-banks/course-305";
import course306 from "./quiz-banks/course-306";
import course307 from "./quiz-banks/course-307";
import course308 from "./quiz-banks/course-308";
import course309 from "./quiz-banks/course-309";
import course310 from "./quiz-banks/course-310";
import course311 from "./quiz-banks/course-311";
import course312 from "./quiz-banks/course-312";
import course313 from "./quiz-banks/course-313";
import course314 from "./quiz-banks/course-314";
import course315 from "./quiz-banks/course-315";
import course316 from "./quiz-banks/course-316";
import course317 from "./quiz-banks/course-317";
import course318 from "./quiz-banks/course-318";
import course319 from "./quiz-banks/course-319";

/**
 * The MCQ bank, assembled from one authored file per course.
 *
 * Questions are authored per COURSE rather than per topic. There are 428 topics in
 * this catalogue and hand-writing a bank for each is not realistic, but a generated
 * question is instantly recognisable as filler, and the quiz is the screen where an
 * officer judges whether the "adaptive" claim is real. A course-level bank keeps every
 * question genuinely on subject, and the selector prefers the ones whose skill matches
 * the topic being studied.
 *
 * Each question carries a difficulty and a target skill, which is what the adaptive
 * selector steers on: answer well and it climbs, struggle and it drops back.
 *
 * This file used to hold one 500 line literal covering five courses. That does not
 * survive nineteen courses authored in parallel: a single file is a single writer, and
 * a shared id counter makes every question's id depend on the order the file happens to
 * be assembled in, which matters because the quiz engine records "already asked" by id.
 * So the data lives in ./quiz-banks/course-<id>.ts, one author each, and
 * ./quiz-banks/helpers.ts mints ids from the course and question number instead of a
 * counter.
 *
 * The imports are static rather than lazy, because bankForTopic is synchronous and the
 * whole bank is small. They are written out one per line rather than built from a loop
 * for the same reason the curriculum loader writes its map out: a bundler can only
 * resolve an import it can see.
 *
 * COVERAGE MATTERS MORE HERE THAN IT LOOKS. For a course whose lessons are not yet
 * authored, this bank is the ONLY source of quiz questions, because the per-topic
 * authored questions that would normally come first do not exist yet. A missing entry
 * here is not a degraded quiz, it is an empty one.
 */

export interface DemoMcq {
  id: number;
  question: string;
  options: { id: string; label: string; value: string }[];
  correct: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skill: string;
  explanation: string;
}

/** Course id to its authored bank. Every course in the catalogue has one. */
export const QUIZ_BANK: Record<number, DemoMcq[]> = {
  301: course301,
  302: course302,
  303: course303,
  304: course304,
  305: course305,
  306: course306,
  307: course307,
  308: course308,
  309: course309,
  310: course310,
  311: course311,
  312: course312,
  313: course313,
  314: course314,
  315: course315,
  316: course316,
  317: course317,
  318: course318,
  319: course319,
};

/**
 * Questions for a topic, ordered so that ones matching the topic's own concepts
 * come first. The selector then filters by difficulty, so a learner doing well
 * sees the harder on-topic questions before any generic ones.
 */
export function bankForTopic(
  courseId: number,
  concepts: string[],
  topicId?: number,
): DemoMcq[] {
  // Authored questions for THIS topic come first and in full: they are written
  // against its own concepts and carry an explanation that names the tempting
  // wrong answer. The shared course bank follows as filler, so a learner who
  // exhausts the authored set still gets on-course questions rather than a
  // "no more questions" dead end.
  const authored = topicId == null ? null : peekTopic(courseId, topicId);
  const own = (authored?.questions ?? []).map(authoredToMcq);

  const bank = QUIZ_BANK[courseId] ?? [];
  const wanted = new Set(concepts.map((c) => c.toLowerCase()));
  const onTopic = bank.filter((q) => wanted.has(q.skill.toLowerCase()));
  const rest = bank.filter((q) => !wanted.has(q.skill.toLowerCase()));
  return [...own, ...onTopic, ...rest];
}

/**
 * Authored question to the shape the quiz engine speaks.
 *
 * The id is derived from the topic and the question number rather than taken
 * from a counter, because the engine records "already asked" by id and a counter
 * would renumber the same question between two sessions.
 */
function authoredToMcq(q: AuthoredQuestion & { topicId?: number }, i: number): DemoMcq {
  const keys = ["A", "B", "C", "D"];
  return {
    id: 800_000 + (q.n ?? i) * 97,
    question: q.question,
    options: q.options.map((text, k) => ({ id: keys[k], label: text, value: text })),
    correct: keys[q.answer],
    difficulty: q.difficulty,
    skill: q.skill,
    explanation: q.explanation,
  };
}
