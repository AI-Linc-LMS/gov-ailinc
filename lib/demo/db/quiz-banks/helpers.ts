/**
 * Shared constructor for the per-course MCQ banks in this directory.
 *
 * The bank used to be one 500-line literal inside `../quiz-bank.ts` with a module-level
 * counter minting ids. That worked for five courses authored in one sitting. It does not
 * work for nineteen authored in parallel: a counter makes every question's id depend on
 * the order the file happens to be assembled in, so inserting a question into course 303
 * silently renumbers every question after it, and the quiz engine records "already asked"
 * by id.
 *
 * So the id is COMPUTED from the course and the question's own number, which makes it
 * stable under insertion, unique across courses by construction, and readable: 730_105 is
 * course 301, question 5.
 *
 * The 700_000 base keeps these clear of the authored per-topic questions, which
 * `authoredToMcq` in ../quiz-bank.ts mints at 800_000.
 */

import type { DemoMcq } from "../quiz-bank";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

/**
 * One bank question.
 *
 * `skill` must also appear as a concept on at least one topic of the same course:
 * `bankForTopic` matches the two case-insensitively to decide which questions are on
 * topic, and a skill that matches nothing sinks every question in the course to the
 * bottom of the pile.
 */
export function mcq(
  courseId: number,
  n: number,
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  difficulty: DemoMcq["difficulty"],
  skill: string,
  explanation: string,
): DemoMcq {
  return {
    id: 700_000 + courseId * 100 + n,
    question,
    // `id` is the letter badge and the value submitted back; `value` is the answer TEXT,
    // which QuestionCard renders as HTML. Putting the letter in `value` renders four rows
    // reading "A A B B", which is how this was found the first time.
    options: options.map((text, i) => ({ id: OPTION_KEYS[i], label: text, value: text })),
    correct: OPTION_KEYS[correctIndex],
    difficulty,
    skill,
    explanation,
  };
}
