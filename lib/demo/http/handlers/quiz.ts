/**
 * The adaptive quiz.
 *
 * This is the screen where the word "adaptive" is either true or marketing, so
 * the selector genuinely steers: answer correctly and the next question is
 * harder, miss one and it steps back down. Ability and standard error move per
 * skill on every answer, and the session ends when either the estimate is
 * confident enough or the question cap is reached - the same two exit conditions
 * the real engine uses.
 *
 * Session state lives in the visitor overlay, so a quiz survives a reload and a
 * prospect can leave one half-finished and come back to it.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound, type DemoRequest } from "../types";
import { COURSES, topicById } from "../../db/courses";
import { bankForTopic, type DemoMcq } from "../../db/quiz-bank";
import { loadCourseCurriculum } from "../../db/curriculum";
import { conceptsFor } from "./adaptive-courses";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { seededInt } from "../../random";

const MODULE = "quiz";

type Difficulty = "Easy" | "Medium" | "Hard";

interface AnswerRecord {
  mcqId: number;
  selected: string;
  correct: boolean;
  confidence: number | null;
  timeMs: number;
  pointsEarned: number;
  pointsBase: number;
  answeredAt: string;
}

interface QuizSession {
  id: string;
  configId: number;
  topicId: number;
  courseId: number;
  status: "active" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  askedIds: number[];
  answers: AnswerRecord[];
  hintsUsed: number;
  /** Per-skill ability estimate, roughly -3..3. */
  ability: Record<string, number>;
  /** Per-skill standard error. Falls as evidence accumulates. */
  se: Record<string, number>;
  /** Difficulty the selector is currently aiming at. */
  targetDifficulty: Difficulty;
  /**
   * The question currently on screen.
   *
   * Stored, not recomputed. `sessionDetail` used to call the selector afresh on
   * every fetch, so the question the client displayed could differ from the one
   * recorded in `askedIds` - and a question already answered could be served
   * again a few steps later. Pinning it here makes "the current question" a fact
   * about the session rather than the output of a function that runs twice.
   */
  pendingId: number | null;
  servedAt: string | null;
}

const MIN_QUESTIONS = 6;
const MAX_QUESTIONS = 12;
const SE_THRESHOLD = 0.42;
const HINT_TOKENS = 3;
const BASE_POINTS: Record<Difficulty, number> = { Easy: 40, Medium: 60, Hard: 90 };

const sessionKey = (id: string) => `quiz:session:${id}`;

function loadSession(id: string): QuizSession | null {
  return overlay.get<QuizSession | null>(sessionKey(id), null);
}

function saveSession(session: QuizSession): QuizSession {
  overlay.set(sessionKey(session.id), session);
  overlay.update<string[]>("quiz:sessions", [], (list) =>
    list.includes(session.id) ? list : [session.id, ...list],
  );
  return session;
}

function requireSession(id: string): QuizSession {
  const session = loadSession(id);
  if (!session) throw notFound("Quiz session not found");
  return session;
}

/** Quiz config ids are topic ids offset by a fixed namespace. */
function topicForConfig(configId: number) {
  return topicById(configId - 200_000);
}

function bankFor(session: QuizSession): DemoMcq[] {
  const found = topicById(session.topicId);
  if (!found) return [];
  // topicId is passed so the topic's own authored questions lead the bank. The
  // course chunk is warmed when the session starts, so this stays synchronous.
  return bankForTopic(session.courseId, conceptsFor(found.topic), session.topicId);
}

/**
 * Pick the next question: unasked, as close to the target difficulty as the bank
 * allows. Falling back through neighbouring difficulties (rather than giving up)
 * matters because a course bank has only a handful at each level.
 */
function selectQuestion(session: QuizSession): DemoMcq | null {
  const bank = bankFor(session);
  const remaining = bank.filter((q) => !session.askedIds.includes(q.id));
  if (remaining.length === 0) return null;

  const order: Difficulty[] =
    session.targetDifficulty === "Hard"
      ? ["Hard", "Medium", "Easy"]
      : session.targetDifficulty === "Easy"
        ? ["Easy", "Medium", "Hard"]
        : ["Medium", "Hard", "Easy"];

  for (const level of order) {
    const match = remaining.find((q) => q.difficulty === level);
    if (match) return match;
  }
  return remaining[0];
}

/** Probability the learner answers this correctly, from ability vs difficulty. */
function predictedPCorrect(session: QuizSession, question: DemoMcq): number {
  const ability = session.ability[question.skill] ?? 0;
  const b = question.difficulty === "Easy" ? -0.8 : question.difficulty === "Hard" ? 1.0 : 0;
  // Standard 1-parameter logistic (Rasch) response curve.
  return Number((1 / (1 + Math.exp(-(ability - b)))).toFixed(2));
}

function rationaleFor(session: QuizSession, question: DemoMcq): string {
  const answered = session.answers.length;
  if (answered === 0) {
    return `Starting at ${question.difficulty.toLowerCase()} on ${question.skill} to find your level.`;
  }
  const last = session.answers[session.answers.length - 1];
  if (last.correct) {
    return `You got the last one right, so this steps up to ${question.difficulty.toLowerCase()} on ${question.skill}.`;
  }
  return `That last answer missed, so this drops back to ${question.difficulty.toLowerCase()} on ${question.skill} to rebuild.`;
}

/**
 * The decay curve for one question, in the exact shape the live HUD reads.
 *
 * `grace` seconds at full credit, then `dec` points shed per `iv` seconds, down
 * to `floor`. Sending only some of these fields is what made the HUD render
 * "NaN / 60": it computes the running value from all of them.
 */
function decayCurve(question: DemoMcq) {
  const base = BASE_POINTS[question.difficulty];
  return {
    base,
    grace: 20,
    dec: 5,
    iv: 10,
    floor: Math.round(base * 0.45),
    hint_penalty: 0.1,
  };
}

/**
 * Award for an answer, computed from the SAME curve the HUD is given, so the
 * number counting down on screen is the number actually granted. Deriving these
 * separately is how a learner watches "42 pts" tick down and then gets 38.
 */
function pointsFor(question: DemoMcq, elapsedMs: number, correct: boolean): { earned: number; base: number } {
  const curve = decayCurve(question);
  if (!correct) return { earned: 0, base: curve.base };

  const seconds = Math.max(0, elapsedMs / 1000);
  const overGrace = Math.max(0, seconds - curve.grace);
  const intervals = Math.floor(overGrace / curve.iv);
  const earned = Math.max(curve.floor, curve.base - intervals * curve.dec);
  return { earned: Math.round(earned), base: curve.base };
}

function toApiQuestion(session: QuizSession, question: DemoMcq) {
  return {
    mcq_id: question.id,
    question_text: question.question,
    options: question.options,
    target_skill: question.skill,
    difficulty_label: question.difficulty,
    selector_rationale: rationaleFor(session, question),
    predicted_p_correct: predictedPCorrect(session, question),
    points: decayCurve(question),
    served_at: session.servedAt,
  };
}

function questionById(session: QuizSession, mcqId: number): DemoMcq | null {
  return bankFor(session).find((q) => q.id === mcqId) ?? null;
}

/** Whether the session has met either exit condition. */
function isComplete(session: QuizSession): boolean {
  const answered = session.answers.length;
  if (answered >= MAX_QUESTIONS) return true;
  if (answered < MIN_QUESTIONS) return false;
  const errors = Object.values(session.se);
  const avgSe = errors.length ? errors.reduce((a, b) => a + b, 0) / errors.length : 1;
  return avgSe <= SE_THRESHOLD;
}

function avgSe(session: QuizSession): number | null {
  const errors = Object.values(session.se);
  if (errors.length === 0) return null;
  return Number((errors.reduce((a, b) => a + b, 0) / errors.length).toFixed(3));
}

function sessionDetail(session: QuizSession) {
  const found = topicById(session.topicId);
  // Read the pinned question; never re-select here (see `pendingId`).
  const pending =
    session.status === "active" && session.pendingId != null
      ? questionById(session, session.pendingId)
      : null;

  return {
    id: session.id,
    status: session.status,
    started_at: session.startedAt,
    completed_at: session.completedAt,
    question_count: session.answers.length,
    hints_used: session.hintsUsed,
    ability_state: session.ability,
    se_state: session.se,
    pending_question: pending ? toApiQuestion(session, pending) : null,
    server_now: iso(new Date(nowMs())),
    points_so_far: session.answers.reduce((sum, a) => sum + a.pointsEarned, 0),
    ai_narration: null,
    ai_narration_generated_at: null,
    config: {
      id: session.configId,
      quiz_title: found ? `${found.topic.title} - check your understanding` : "Adaptive quiz",
      is_active: true,
      target_skills: found ? conceptsFor(found.topic) : [],
      min_questions: MIN_QUESTIONS,
      max_questions: MAX_QUESTIONS,
      se_threshold: SE_THRESHOLD,
      confidence_prompt_enabled: true,
      hint_tokens: HINT_TOKENS,
    },
    responses: session.answers.map((answer, index) => {
      const q = questionById(session, answer.mcqId);
      return {
        order_index: index + 1,
        mcq: answer.mcqId,
        mcq_detail: {
          id: answer.mcqId,
          question_text: q?.question ?? "",
          options: q?.options ?? [],
          correct_option: q?.correct ?? "",
          difficulty_level: q?.difficulty ?? "Medium",
          explanation: q?.explanation ?? "",
        },
        target_skill: q?.skill ?? "",
        selected_option: answer.selected,
        is_correct: answer.correct,
        confidence: answer.confidence,
        time_ms: answer.timeMs,
        points_earned: answer.pointsEarned,
        answered_at: answer.answeredAt,
      };
    }),
    source_attempt: null,
  };
}


/**
 * The visitor's latest session for a quiz config, for the library card's CTA.
 *
 * `quiz:sessions` is a list of session IDS, newest first, not of session
 * objects: each session is stored under its own overlay key.
 */
function latestSessionFor(configId: number): QuizSession | null {
  for (const id of overlay.get<string[]>("quiz:sessions", [])) {
    const session = loadSession(id);
    if (session?.configId === configId) return session;
  }
  return null;
}

defineRoutes(MODULE, {
  /**
   * The standalone quiz library.
   *
   * Returns a BARE ARRAY, not a `{results}` envelope: `listQuizzes` hands the
   * response straight to the page, which calls `.filter` on it. When nothing
   * answered this route the page crashed with "v.filter is not a function",
   * which is the whole reason shape matters more than presence here.
   *
   * The library is built from the course topics that actually carry a quiz, so
   * every card opens onto real authored questions rather than a stub.
   */
  "GET /adaptive-quiz/api/quizzes/": () => {
    const rows: Array<Record<string, unknown>> = [];
    for (const course of COURSES) {
      for (const m of course.modules) {
        for (const t of m.topics) {
          if (!t.kinds.includes("quiz")) continue;
          const configId = t.id + 200_000;
          const session = latestSessionFor(configId);
          rows.push({
            config_id: configId,
            quiz_title: `${t.title} - check your understanding`,
            course_id: course.id,
            course_title: course.title,
            target_skills: conceptsFor(t).slice(0, 4),
            min_questions: 6,
            max_questions: 12,
            mcq_count: 10,
            hint_tokens: 3,
            is_personal: false,
            is_archived: false,
            latest_session_id: session?.id ?? null,
            latest_session_status: session?.status ?? null,
            updated_at: isoDaysAgo(seededInt(`quizupd:${t.id}`, 2, 40)),
          });
        }
      }
    }
    return rows;
  },

  "POST /adaptive-quiz/api/sessions/start/": async (req) => {
    const configId = Number(req.body?.config_id);
    const found = topicForConfig(configId);
    if (!found) throw notFound("Quiz not found");
    // Warm the course chunk once, here. Every later call in this session reads
    // the authored questions out of the warm cache synchronously.
    await loadCourseCurriculum(found.course.id);

    const session: QuizSession = {
      id: `qs-${nextDemoId("quiz")}`,
      configId,
      topicId: found.topic.id,
      courseId: found.course.id,
      status: "active",
      startedAt: iso(new Date(nowMs())),
      completedAt: null,
      askedIds: [],
      answers: [],
      hintsUsed: 0,
      ability: {},
      se: {},
      // Everyone starts in the middle; the first answer is what moves it.
      targetDifficulty: "Medium",
      pendingId: null,
      servedAt: iso(new Date(nowMs())),
    };

    const first = selectQuestion(session);
    if (first) {
      session.askedIds.push(first.id);
      session.pendingId = first.id;
    }
    saveSession(session);

    return {
      session_id: session.id,
      first_question: first ? toApiQuestion(session, first) : null,
      meta: {
        min_questions: MIN_QUESTIONS,
        max_questions: MAX_QUESTIONS,
        target_skills: conceptsFor(found.topic),
        confidence_prompt_enabled: true,
        hint_tokens: HINT_TOKENS,
      },
    };
  },

  "GET /adaptive-quiz/api/sessions/:sessionId/": (req) =>
    sessionDetail(requireSession(req.params.sessionId)),

  "POST /adaptive-quiz/api/sessions/:sessionId/answer/": (req) => submitAnswer(req),

  "POST /adaptive-quiz/api/sessions/:sessionId/abandon/": (req) => {
    const session = requireSession(req.params.sessionId);
    session.status = "abandoned";
    session.completedAt = iso(new Date(nowMs()));
    saveSession(session);
    return { status: "abandoned" };
  },

  "POST /adaptive-quiz/api/sessions/:sessionId/hint/": (req) => {
    const session = requireSession(req.params.sessionId);
    if (session.hintsUsed >= HINT_TOKENS) {
      throw badRequest({ detail: "You have used all your hints for this quiz." });
    }
    session.hintsUsed += 1;
    saveSession(session);

    const pending = session.pendingId != null ? questionById(session, session.pendingId) : null;
    return {
      teaser: pending
        ? `This one is about ${pending.skill.toLowerCase()}. Rule out the two options that are true in themselves but answer a different question.`
        : "Rule out the options that are true in themselves but answer a different question.",
      hint: pending
        ? pending.explanation.split(". ")[0] + "."
        : "Re-read the question for the word that constrains the answer.",
      hints_remaining: HINT_TOKENS - session.hintsUsed,
    };
  },

  "GET /adaptive-quiz/api/sessions/": () => {
    const ids = overlay.get<string[]>("quiz:sessions", []);
    return ids
      .map((id) => loadSession(id))
      .filter((s): s is QuizSession => s !== null)
      .map((session) => {
        const found = topicById(session.topicId);
        const correct = session.answers.filter((a) => a.correct).length;
        return {
          session_id: session.id,
          config_id: session.configId,
          quiz_title: found ? `${found.topic.title} - check your understanding` : "Adaptive quiz",
          status: session.status,
          question_count: session.answers.length,
          correct_count: correct,
          accuracy: session.answers.length ? correct / session.answers.length : 0,
          time_total_ms: session.answers.reduce((sum, a) => sum + a.timeMs, 0),
          started_at: session.startedAt,
          completed_at: session.completedAt,
          has_narration: false,
          is_personal: false,
        };
      });
  },

  "GET /adaptive-quiz/api/sessions/:sessionId/remediation-progress/": (req) => {
    const session = requireSession(req.params.sessionId);
    const wrong = session.answers.filter((a) => !a.correct).length;
    return {
      steps: [
        { step: 1, content_type: "article", done: true },
        { step: 2, content_type: "quiz", done: wrong === 0 },
      ],
      content_done: true,
      requiz: { done: false, session_id: null, status: null },
    };
  },

  /** A re-quiz seeded from a previous attempt, focused on what was missed. */
  "POST /adaptive-quiz/api/sessions/:sessionId/requiz/": (req) => {
    const source = requireSession(req.params.sessionId);
    const session: QuizSession = {
      ...source,
      id: `qs-${nextDemoId("quiz")}`,
      status: "active",
      startedAt: iso(new Date(nowMs())),
      completedAt: null,
      askedIds: [],
      answers: [],
      hintsUsed: 0,
      pendingId: null,
      servedAt: iso(new Date(nowMs())),
    };
    const first = selectQuestion(session);
    if (first) {
      session.askedIds.push(first.id);
      session.pendingId = first.id;
    }
    saveSession(session);
    return { session_id: session.id, config_id: session.configId };
  },

  /**
   * Narration sections for the results page. The real backend generates these
   * off-thread and the client polls; returning "ready" immediately is the honest
   * demo equivalent, since there is no worker to wait for.
   */
  "POST /adaptive-quiz/api/sessions/:sessionId/narration/:section/": (req) =>
    narration(req),
  "GET /adaptive-quiz/api/sessions/:sessionId/narration/:section/": (req) => narration(req),
});

function submitAnswer(req: DemoRequest) {
  const session = requireSession(req.params.sessionId);
  if (session.status !== "active") throw badRequest({ detail: "This quiz is already finished." });

  const mcqId = Number(req.body?.mcq_id);
  const selected = String(req.body?.selected_option ?? "");
  const question = questionById(session, mcqId);
  if (!question) throw badRequest({ detail: "Unknown question." });

  const correct = selected === question.correct;
  const timeMs = Number(req.body?.time_ms ?? 0);
  const { earned, base } = pointsFor(question, timeMs, correct);

  const skill = question.skill;
  const before = session.ability[skill] ?? 0;
  // Move the estimate toward the answer, damped by how much evidence we already
  // have for this skill, so later answers move it less than the first.
  const evidence = session.answers.filter((a) => questionById(session, a.mcqId)?.skill === skill).length;
  const step = 0.8 / (1 + evidence * 0.5);
  const after = Number((before + (correct ? step : -step)).toFixed(3));

  session.ability[skill] = after;
  const priorSe = session.se[skill] ?? 1.0;
  session.se[skill] = Number(Math.max(0.25, priorSe * 0.82).toFixed(3));

  session.answers.push({
    mcqId,
    selected,
    correct,
    confidence: req.body?.confidence ?? null,
    timeMs,
    pointsEarned: earned,
    pointsBase: base,
    answeredAt: iso(new Date(nowMs())),
  });

  // Steer the next question.
  session.targetDifficulty = correct
    ? question.difficulty === "Easy"
      ? "Medium"
      : "Hard"
    : question.difficulty === "Hard"
      ? "Medium"
      : "Easy";

  const complete = isComplete(session);
  let next: DemoMcq | null = null;
  if (!complete) {
    next = selectQuestion(session);
    if (next) {
      session.askedIds.push(next.id);
      session.pendingId = next.id;
    }
    session.servedAt = iso(new Date(nowMs()));
  }

  // Running out of bank ends the session too; a quiz that cannot serve a
  // question must not sit on a blank screen waiting for one.
  if (complete || !next) {
    session.status = "completed";
    session.completedAt = iso(new Date(nowMs()));
    session.pendingId = null;
  }

  saveSession(session);

  return {
    is_correct: correct,
    theta_delta: { [skill]: { before, after, se: session.se[skill] } },
    next_question: next ? toApiQuestion(session, next) : null,
    session_complete: session.status === "completed",
    progress: {
      answered: session.answers.length,
      min_questions: MIN_QUESTIONS,
      max_questions: MAX_QUESTIONS,
      avg_se: avgSe(session),
    },
    ability_state: session.ability,
    se_state: session.se,
    points_earned: earned,
    points_base: base,
  };
}

function narration(req: DemoRequest) {
  const session = requireSession(req.params.sessionId);
  const section = req.params.section;
  const correct = session.answers.filter((a) => a.correct).length;
  const total = session.answers.length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const wrongSkills = [
    ...new Set(
      session.answers
        .filter((a) => !a.correct)
        .map((a) => questionById(session, a.mcqId)?.skill)
        .filter((s): s is string => Boolean(s)),
    ),
  ];

  const value =
    section === "headline"
      ? {
          headline: `${correct} of ${total} correct - ${accuracy}%.`,
          subtext: wrongSkills.length
            ? `The gaps clustered in ${wrongSkills.join(" and ")}.`
            : "No weak spots in this attempt. The next quiz will start harder.",
        }
      : section === "per_question"
        ? session.answers.map((answer, i) => {
            const q = questionById(session, answer.mcqId);
            return {
              order: i + 1,
              skill: q?.skill ?? "",
              correct: answer.correct,
              note: answer.correct
                ? `Correct, and quickly enough to keep most of the points.`
                : q?.explanation ?? "",
            };
          })
        : section === "misconceptions"
          ? wrongSkills.map((skill) => ({
              skill,
              misconception: `Your wrong answers on ${skill} picked the option that is correct in general but does not answer what the question asked.`,
              fix: `Re-read the ${skill} section of the lesson, then retry - that is usually one short session.`,
            }))
          : {
              steps: [
                { step: 1, content_type: "article", label: "Re-read the lesson section you missed" },
                { step: 2, content_type: "quiz", label: "Re-quiz on just those skills" },
              ],
            };

  return { section, status: "ready", value };
}
