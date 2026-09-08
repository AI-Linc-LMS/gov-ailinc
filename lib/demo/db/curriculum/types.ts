/**
 * Authored curriculum: the real teaching content behind every topic.
 *
 * This exists because the demo's reading surface was a template. One
 * `generatedBody()` function produced the same 163 words for 63 of the 67
 * article topics, with only the title and a bullet list swapped in, and all four
 * reading tiers rendered byte-identical text while the article itself told the
 * reader they differed. A prospect who opens two lessons sees the trick
 * immediately, and the reading surface is exactly where they stop skimming.
 *
 * So content is authored per topic, keyed on the topic id from
 * `lib/demo/db/courses.ts`, and the generator is kept only as a last-resort
 * fallback for a topic nobody has written yet.
 *
 * The tiers are a real product feature, not a label: the same lesson re-rendered
 * for a different assumed background. They must genuinely differ in what they
 * assume, not merely in length.
 */

export type ReadingTier = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface AuthoredQuestion {
  /** Stable within its topic; used as the MCQ id. */
  n: number;
  question: string;
  /** Exactly four. Order matters: `answer` is the 0-based index. */
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  /**
   * Why the right answer is right AND why the tempting wrong one is wrong.
   * A quiz that only says "Correct!" teaches nothing, and the explanation is
   * the part a prospect reads to judge whether the content is real.
   */
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** Must match one of the topic's concepts so the adaptive selector can use it. */
  skill: string;
}

export interface AuthoredTest {
  args: unknown[];
  expected: unknown;
  /** Shown in the results strip. "basic", "duplicates", "empty input", … */
  label: string;
  hidden?: boolean;
}

export interface AuthoredProblem {
  /** Stable within its topic. */
  n: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** HTML, not markdown: the panel injects this directly. */
  statement: string;
  /** Exported function name the tests call. */
  fn: string;
  /** Parameter list, e.g. "nums, target". */
  params: string;
  tests: AuthoredTest[];
  /** Three rungs, nudge first, mechanism last. */
  hints: [string, string, string];
  /** Must pass every test above. Verified by scripts/verify-curriculum.mjs. */
  solution: string;
  skills: string[];
}

export interface AuthoredTopic {
  /** Topic id from lib/demo/db/courses.ts (5000..5069). */
  topicId: number;
  /** Repeated here so a mismatch with courses.ts is caught by the validator. */
  title: string;
  /** One or two sentences. Shown on the card and above the article. */
  summary: string;
  /** Real concepts, not title fragments. These drive the glossary and the quiz. */
  concepts: string[];
  /** Term -> definition. Powers the auto-glossary and "explain this term". */
  glossary: Record<string, string>;
  /** Article body per tier. All four are required and must genuinely differ. */
  body: Record<ReadingTier, string>;
  /** Present only for topics whose `kinds` include "quiz". */
  questions?: AuthoredQuestion[];
  /** Present only for topics whose `kinds` include "coding". */
  problems?: AuthoredProblem[];
}

export type CourseCurriculum = Record<number, AuthoredTopic>;
