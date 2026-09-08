/**
 * The coding workspace.
 *
 * UNREACHABLE FOR THIS TENANT, and left working on purpose. Every route below is
 * registered, but no aspirant reaches one: the nineteen courses in
 * `db/courses.ts` declare only `article`, `quiz` and `assignment` topics, so
 * nothing in the catalogue ever mints a coding config id. That is a content
 * decision from the build brief, not an oversight. There is no code judge in
 * this product line, and a recruitment-exam or vocational-trade catalogue that
 * served a coding problem would be advertising a capability the mission does not
 * assess.
 *
 * Not deleted because `db/coding-bank.ts` still exports `CODING_PROBLEMS` to
 * `assessment-admin.ts`, and because a handler that returns a correct 404 costs
 * nothing while a missing route returns the transport's generic failure.
 *
 * What would have to be true to use it again: a course topic would have to carry
 * a `coding` kind, which only makes sense if this tenant ever teaches writing
 * code as the trade itself. Until then, treat this file as dormant and do not
 * cite its points values as something a learner here can earn.
 *
 * The learner's JavaScript is EXECUTED, in their own browser, against the
 * problem's real test cases. A coding screen where "Run" returns a canned pass
 * is the most obvious fake in a demo of a learning platform, and the first thing
 * a technical evaluator tries to break. Running it for real costs a `new
 * Function` and a comparison, and it means the failing-case table, the mentor
 * diagnosis and the points are all consequences of what was actually typed.
 *
 * Other languages cannot be executed here, and the demo says so rather than
 * inventing a verdict.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound, type DemoRequest } from "../types";
import { topicById } from "../../db/courses";
import { CODING_PROBLEMS, problemAt, type CodingTest, type DemoCodingProblem } from "../../db/coding-bank";
import { loadCourseCurriculum, peekTopic, type AuthoredProblem } from "../../db/curriculum";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, nowMs } from "../../clock";

const MODULE = "coding";

const HINT_LAYERS = 3;
const BASE_POINTS: Record<DemoCodingProblem["difficulty"], number> = {
  Easy: 60,
  Medium: 90,
  Hard: 130,
};

interface CodingSessionState {
  id: string;
  problemId: number;
  problemIndex: number;
  configId: number;
  language: string;
  status: "active" | "completed" | "abandoned";
  runCount: number;
  submitCount: number;
  hintsRevealed: number;
  passed: boolean;
  lastSource: string;
  startedAt: string;
  completedAt: string | null;
  latestSubmissionId: number | null;
}

const sessionKey = (id: string) => `coding:session:${id}`;

function loadSession(id: string): CodingSessionState | null {
  return overlay.get<CodingSessionState | null>(sessionKey(id), null);
}

function saveSession(s: CodingSessionState): CodingSessionState {
  overlay.set(sessionKey(s.id), s);
  overlay.update<string[]>("coding:sessions", [], (list) =>
    list.includes(s.id) ? list : [s.id, ...list],
  );
  return s;
}

function requireSession(id: string): CodingSessionState {
  const s = loadSession(id);
  if (!s) throw notFound("Coding session not found");
  return s;
}

/**
 * Project an authored problem into the shape the workspace already speaks.
 *
 * The authored bank stores what a problem IS (statement, tests, hints, the
 * function to write); the workspace additionally wants input/output format
 * strings and per-language templates, which are mechanical from the signature.
 */
function fromAuthored(p: AuthoredProblem): DemoCodingProblem {
  const sample = p.tests.find((t) => !t.hidden) ?? p.tests[0];
  const args = sample ? sample.args.map((a) => JSON.stringify(a)).join(", ") : "";
  return {
    title: p.title,
    difficulty: p.difficulty,
    skills: p.skills,
    topic: p.skills[0] ?? p.title,
    statement: p.statement,
    inputFormat: `Arguments to ${p.fn}(${p.params}).`,
    outputFormat: "The value your function returns.",
    sampleInput: args,
    sampleOutput: sample ? JSON.stringify(sample.expected) : "",
    constraints: "Inputs are always valid for the stated signature.",
    fnName: p.fn,
    templates: {
      javascript: `/**\n * Complete this function.\n */\nfunction ${p.fn}(${p.params}) {\n  // your code here\n}\n`,
    },
    tests: p.tests.map((t) => ({ args: t.args, expected: t.expected, label: t.label, hidden: t.hidden })),
    hints: p.hints.map((body, i) => ({
      title: i === 0 ? "A nudge" : i === 1 ? "The approach" : "The mechanism",
      body,
      revealsCode: i === 2,
    })),
  };
}

/**
 * Map a generated problem id back to a problem.
 *
 * Coding-set problem ids are `topic.id + 300_000 + n` for n in 1..4.
 *
 * The authored curriculum is preferred, and that is the whole point of this
 * function: it used to pick with `(topicId + offset) % CODING_PROBLEMS.length`
 * over a bank of five, so all 41 coding topics served the same five problems,
 * six to ten times each, none of them related to the topic being studied. A
 * prospect who opened two coding lessons in one course saw the same puzzle.
 *
 * The lookup is a synchronous cache read, so callers that can be async should
 * `await loadCourseCurriculum(courseId)` first; the entry points do.
 */
function resolveProblem(problemId: number): { problem: DemoCodingProblem; index: number } {
  for (let offset = 1; offset <= 4; offset++) {
    const topicId = problemId - 300_000 - offset;
    const found = topicById(topicId);
    if (!found) continue;

    const authored = peekTopic(found.course.id, topicId);
    const own = authored?.problems?.[offset - 1] ?? authored?.problems?.[0];
    if (own) return { problem: fromAuthored(own), index: offset - 1 };

    // Nothing authored for this topic yet: fall back to the shared bank rather
    // than 404ing a lesson the journey board links to.
    const index = (topicId + offset) % CODING_PROBLEMS.length;
    return { problem: problemAt(index), index };
  }
  // An id we did not generate still resolves to something real rather than 404,
  // so a deep link a prospect was given can never dead-end.
  const index = Math.abs(problemId) % CODING_PROBLEMS.length;
  return { problem: problemAt(index), index };
}

/** Warm the course chunk that owns a problem id, so `resolveProblem` can see it. */
async function warmProblem(problemId: number): Promise<void> {
  for (let offset = 1; offset <= 4; offset++) {
    const found = topicById(problemId - 300_000 - offset);
    if (found) {
      await loadCourseCurriculum(found.course.id);
      return;
    }
  }
}

function apiProblem(problemId: number, problem: DemoCodingProblem) {
  return {
    id: problemId,
    title: problem.title,
    difficulty_level: problem.difficulty,
    problem_statement: problem.statement,
    input_format: problem.inputFormat,
    output_format: problem.outputFormat,
    sample_input: problem.sampleInput,
    sample_output: problem.sampleOutput,
    constraints: problem.constraints,
    template_code: problem.templates,
    tags: problem.skills.join(", "),
    target_skills: problem.skills,
    topic: problem.topic,
  };
}

/** Stable, readable rendering of a value for the results table. */
function show(value: unknown): string {
  return JSON.stringify(value);
}

interface CaseOutcome {
  index: number;
  input: string;
  expected: string;
  actual: string;
  verdict: string;
  passed: boolean;
  stderr: string | null;
  compile_output: string | null;
}

/**
 * Execute the learner's JavaScript against a set of tests.
 *
 * `new Function` rather than eval so the source cannot reach this module's
 * scope, and each case is wrapped so one throwing test reports as a failure
 * instead of aborting the whole run.
 */
function runJavaScript(source: string, problem: DemoCodingProblem, tests: CodingTest[]) {
  let fn: ((...args: unknown[]) => unknown) | null = null;
  let compileError: string | null = null;

  try {
    const factory = new Function(
      `"use strict";\n${source}\n;return typeof ${problem.fnName} === "function" ? ${problem.fnName} : null;`,
    );
    fn = factory() as ((...args: unknown[]) => unknown) | null;
  } catch (error) {
    compileError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }

  if (!compileError && !fn) {
    compileError = `No function named ${problem.fnName} was defined. Keep the function name from the template.`;
  }

  const results: CaseOutcome[] = tests.map((test, i) => {
    const base = {
      index: i,
      input: test.args.map(show).join(", "),
      expected: show(test.expected),
    };
    if (compileError) {
      return { ...base, actual: "", verdict: "Compilation Error", passed: false, stderr: null, compile_output: compileError };
    }
    try {
      // Structured-clone the arguments so a solution that mutates its input
      // cannot corrupt the cases that follow.
      const args = JSON.parse(JSON.stringify(test.args)) as unknown[];
      const actual = fn!(...args);
      const passed = show(actual) === show(test.expected);
      return {
        ...base,
        actual: show(actual),
        verdict: passed ? "Accepted" : "Wrong Answer",
        passed,
        stderr: null,
        compile_output: null,
      };
    } catch (error) {
      return {
        ...base,
        actual: "",
        verdict: "Runtime Error",
        passed: false,
        stderr: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        compile_output: null,
      };
    }
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    results,
    passed,
    failed: results.length - passed,
    total: results.length,
    first_failing_index: results.findIndex((r) => !r.passed) === -1 ? null : results.findIndex((r) => !r.passed),
    compile_error: compileError,
    status: compileError ? "Compilation Error" : passed === results.length ? "Accepted" : "Wrong Answer",
    all_passed: !compileError && passed === results.length,
  };
}

/** Languages other than JavaScript have no runner here, and the demo says so. */
function unsupportedLanguage(language: string, tests: CodingTest[]) {
  const note =
    `This demo runs JavaScript in your browser, so ${language} cannot be executed here. ` +
    `Switch the editor to JavaScript to have your solution graded for real against these cases.`;
  return {
    results: tests.map((test, i) => ({
      index: i,
      input: test.args.map(show).join(", "),
      expected: show(test.expected),
      actual: "",
      verdict: "Not Run",
      passed: false,
      stderr: null,
      compile_output: note,
    })),
    passed: 0,
    failed: tests.length,
    total: tests.length,
    first_failing_index: 0,
    compile_error: note,
    status: "Not Run",
    all_passed: false,
  };
}

function grade(session: CodingSessionState, source: string, tests: CodingTest[]) {
  const { problem } = resolveProblem(session.problemId);
  return session.language === "javascript"
    ? runJavaScript(source, problem, tests)
    : unsupportedLanguage(session.language, tests);
}

/** Mentor feedback derived from the actual failure, not a generic paragraph. */
function diagnose(
  problem: DemoCodingProblem,
  outcome: ReturnType<typeof runJavaScript>,
): { whats_wrong: string; root_cause_line: number | null; root_cause_excerpt: string; conceptual_gap: string; strengths: string[] } | null {
  if (outcome.all_passed) return null;

  if (outcome.compile_error) {
    return {
      whats_wrong: "Your code did not compile, so none of the cases ran.",
      root_cause_line: null,
      root_cause_excerpt: outcome.compile_error,
      conceptual_gap: "Syntax and function signature",
      strengths: [],
    };
  }

  const failing = outcome.results.find((r) => !r.passed);
  const runtime = failing?.stderr;

  if (runtime) {
    return {
      whats_wrong: `Your solution threw on the "${failing?.input}" case: ${runtime}`,
      root_cause_line: null,
      root_cause_excerpt: runtime,
      conceptual_gap: "Edge-case handling",
      strengths: outcome.passed > 0 ? [`${outcome.passed} case(s) already pass, so the core idea works.`] : [],
    };
  }

  return {
    whats_wrong: `On input ${failing?.input} your solution returned ${failing?.actual}, but the expected answer is ${failing?.expected}.`,
    root_cause_line: null,
    root_cause_excerpt: `${failing?.input} -> ${failing?.actual}`,
    conceptual_gap: problem.skills[0] ?? "Problem decomposition",
    strengths:
      outcome.passed > 0
        ? [`${outcome.passed} of ${outcome.total} cases pass, so the approach is close.`]
        : ["You have a runnable solution to iterate on."],
  };
}

function decayCurve(problem: DemoCodingProblem) {
  const base = BASE_POINTS[problem.difficulty];
  return { base, grace: 120, dec: 5, iv: 60, floor: Math.round(base * 0.4), hint_penalty: 0.1 };
}

function pointsFor(session: CodingSessionState, problem: DemoCodingProblem): number {
  const curve = decayCurve(problem);
  const elapsed = (nowMs() - new Date(session.startedAt).getTime()) / 1000;
  const intervals = Math.floor(Math.max(0, elapsed - curve.grace) / curve.iv);
  const afterDecay = Math.max(curve.floor, curve.base - intervals * curve.dec);
  const afterHints = afterDecay * (1 - session.hintsRevealed * (curve.hint_penalty ?? 0));
  return Math.max(0, Math.round(afterHints));
}

function apiSession(session: CodingSessionState) {
  const { problem } = resolveProblem(session.problemId);
  return {
    id: session.id,
    config: session.configId,
    problem: apiProblem(session.problemId, problem),
    language: session.language,
    status: session.status,
    run_count: session.runCount,
    submit_count: session.submitCount,
    hints_revealed: session.hintsRevealed,
    passed: session.passed,
    last_source: session.lastSource || problem.templates[session.language] || problem.templates.javascript,
    allow_clipboard: true,
    points: decayCurve(problem),
    server_now: iso(new Date(nowMs())),
    started_at: session.startedAt,
    completed_at: session.completedAt,
    latest_submission: null,
  };
}


/**
 * Mark a topic's coding set finished once one of its problems passes.
 *
 * Content ids for a coding SET are `topic.id + 300_000`; the individual problems
 * are that plus 1..4. The lesson page tracks completion per set, so the set id
 * is what has to be written.
 */
function markCodingComplete(problemId: number): void {
  for (let offset = 1; offset <= 4; offset++) {
    const topicId = problemId - 300_000 - offset;
    if (!topicById(topicId)) continue;
    const setId = topicId + 300_000;
    overlay.update<number[]>("adaptive:completed", [], (list) =>
      list.includes(setId) ? list : [...list, setId],
    );
    return;
  }
}


/**
 * Skill mastery, as PERCENTAGES and persisted per visitor.
 *
 * Two bugs met here. The values were emitted as 0..1 fractions while both
 * renderers treat them as percentages, so the panel printed "0.62%" beside a
 * progress bar 0.62% wide, and the delta chip read "0.17999999999999994".
 * And the whole model was a fixed array, so it never moved no matter what was
 * submitted, while the mentor card six lines above claimed the skill had just
 * gone up. Now it is stored, it moves on a pass, and both surfaces read it.
 */
const MASTERY_KEY = "coding:mastery";

const BASELINE_MASTERY: Record<string, number> = {
  Algorithms: 62,
  "Data Structures": 71,
  "Hash maps": 58,
  "Sliding window": 44,
};

function band(pct: number): "emerging" | "developing" | "proficient" {
  return pct >= 75 ? "proficient" : pct >= 50 ? "developing" : "emerging";
}

function masteryMap(): Record<string, number> {
  return { ...BASELINE_MASTERY, ...overlay.get<Record<string, number>>(MASTERY_KEY, {}) };
}

function masteryOf(skill: string): number {
  return masteryMap()[skill] ?? 50;
}

/** Raise a skill on a pass. Rounded, so no float tail ever reaches the screen. */
function raiseMastery(skill: string, by: number): { before: number; after: number } {
  const before = masteryOf(skill);
  const after = Math.min(95, Math.round(before + by));
  overlay.update<Record<string, number>>(MASTERY_KEY, {}, (current) => ({ ...current, [skill]: after }));
  return { before, after };
}

defineRoutes(MODULE, {
  "GET /adaptive-coding/api/problems/:problemId/": async (req) => {
    const problemId = Number(req.params.problemId);
    // The two entry points warm the course chunk; every later call in the same
    // session (run, submit, hint) reads the warm cache synchronously.
    await warmProblem(problemId);
    const { problem } = resolveProblem(problemId);
    return apiProblem(problemId, problem);
  },

  "POST /adaptive-coding/api/sessions/start/": async (req) => {
    const problemId = Number(req.body?.problem_id ?? req.body?.problemId);
    const configId = Number(req.body?.config_id ?? 0);
    await warmProblem(problemId);
    const { problem, index } = resolveProblem(problemId);
    // JavaScript by default because it is the language this demo can actually
    // execute; offering a default it cannot run would be the wrong first
    // impression on the one screen where execution is the point.
    const language = String(req.body?.language ?? "javascript");

    const session: CodingSessionState = {
      id: `cs-${nextDemoId("coding")}`,
      problemId,
      problemIndex: index,
      configId,
      language,
      status: "active",
      runCount: 0,
      submitCount: 0,
      hintsRevealed: 0,
      passed: false,
      lastSource: problem.templates[language] ?? problem.templates.javascript,
      startedAt: iso(new Date(nowMs())),
      completedAt: null,
      latestSubmissionId: null,
    };
    saveSession(session);
    return apiSession(session);
  },

  /**
   * Peek at an existing session without creating one, so the workspace can show
   * its "ready to begin" gate before the timer starts.
   *
   * The response is WRAPPED as `{ active }`. Returning a bare session (or bare
   * null) crashed the page with "Cannot read properties of null (reading
   * 'active')" — the caller reads `data.active`, so null must be inside the
   * envelope, not instead of it.
   */
  /**
   * The session to resume when the workspace opens.
   *
   * A COMPLETED session counts. This filtered on `status === "active"`, so once
   * a learner solved a problem the session became invisible: reopening it showed
   * "Ready to begin?" again and restarted the timer on work already finished.
   * The page has always been able to render a solved session (it sets its live
   * timer from `status === "active"` and treats a completed one as solved), so
   * the only thing missing was being sent one.
   *
   * Active wins over completed, so a half-finished attempt is never discarded in
   * favour of an older solve.
   */
  "GET /adaptive-coding/api/sessions/active/": (req) => {
    const problemId = Number(req.query.get("problem_id") ?? 0);
    const mine = overlay
      .get<string[]>("coding:sessions", [])
      .map(loadSession)
      .filter((s): s is CodingSessionState => s !== null && (!problemId || s.problemId === problemId));
    const match =
      mine.find((s) => s.status === "active") ??
      mine.find((s) => s.status === "completed") ??
      null;
    return { active: match ? apiSession(match) : null };
  },

  "GET /adaptive-coding/api/sessions/:sessionId/": (req) =>
    apiSession(requireSession(req.params.sessionId)),

  /** Run: sample cases only, so hidden cases stay hidden until submit. */
  "POST /adaptive-coding/api/sessions/:sessionId/run/": (req) => {
    const session = requireSession(req.params.sessionId);
    const source = String(req.body?.source ?? session.lastSource);
    if (req.body?.language) session.language = String(req.body.language);
    session.lastSource = source;
    session.runCount += 1;
    saveSession(session);

    const { problem } = resolveProblem(session.problemId);
    const visible = problem.tests.filter((t) => !t.hidden);
    const outcome = grade(session, source, visible);

    return {
      submission_id: nextDemoId("coding-submission"),
      test_results: outcome,
      diagnosis: diagnose(problem, outcome),
    };
  },

  /** Submit: every case, including the hidden ones. */
  "POST /adaptive-coding/api/sessions/:sessionId/submit/": (req) => {
    const session = requireSession(req.params.sessionId);
    const source = String(req.body?.source ?? session.lastSource);
    if (req.body?.language) session.language = String(req.body.language);
    session.lastSource = source;
    session.submitCount += 1;

    const { problem } = resolveProblem(session.problemId);
    const outcome = grade(session, source, problem.tests);

    if (outcome.all_passed) {
      session.passed = true;
      session.status = "completed";
      session.completedAt = iso(new Date(nowMs()));
      // Record it against the TOPIC's coding set, not just this session.
      //
      // `markComplete` writes the shared "adaptive:completed" list that the
      // lesson page, the journey board and the points total all read. Solving a
      // problem used to update none of them: the topic still said "0 / 115 pts"
      // and the step still read "Solve" immediately after a green pass, because
      // this list was only ever written by the article route.
      markCodingComplete(session.problemId);
    }
    saveSession(session);

    const skill = problem.skills[0] ?? "Algorithms";
    const { before, after } = outcome.all_passed
      ? raiseMastery(skill, problem.difficulty === "Hard" ? 12 : problem.difficulty === "Medium" ? 8 : 5)
      : { before: masteryOf(skill), after: masteryOf(skill) };

    return {
      submission_id: nextDemoId("coding-submission"),
      grade: {
        status: outcome.status ?? "",
        passed: outcome.passed,
        failed: outcome.failed,
        total: outcome.total,
        all_passed: outcome.all_passed,
        results: outcome.results,
        first_failing_index: outcome.first_failing_index,
        compile_error: outcome.compile_error,
      },
      diagnosis: diagnose(problem, outcome),
      optimization_challenge: outcome.all_passed
        ? {
            offer: true,
            challenge:
              problem.difficulty === "Easy"
                ? "Now do it in one pass, without sorting."
                : "Can you cut the extra space to O(1) without changing the time complexity?",
            focus_skill: skill,
          }
        : null,
      mastery_delta: {
        [skill]: {
          before,
          after,
          band: band(after),
        },
      },
      points_earned: outcome.all_passed ? pointsFor(session, problem) : 0,
    };
  },

  /** Hints are layered: nudge, then approach, then the mechanism. */
  "POST /adaptive-coding/api/sessions/:sessionId/hint/": (req) => {
    const session = requireSession(req.params.sessionId);
    const { problem } = resolveProblem(session.problemId);

    if (session.hintsRevealed >= HINT_LAYERS) {
      return {
        layer: HINT_LAYERS,
        title: problem.hints[HINT_LAYERS - 1].title,
        body: problem.hints[HINT_LAYERS - 1].body,
        reveals_code: true,
        hints_revealed: session.hintsRevealed,
        hint_layers: HINT_LAYERS,
        exhausted: true,
      };
    }

    const hint = problem.hints[session.hintsRevealed];
    session.hintsRevealed += 1;
    saveSession(session);

    return {
      layer: session.hintsRevealed,
      title: hint.title,
      body: hint.body,
      reveals_code: hint.revealsCode,
      hints_revealed: session.hintsRevealed,
      hint_layers: HINT_LAYERS,
      exhausted: session.hintsRevealed >= HINT_LAYERS,
    };
  },

  "GET /adaptive-coding/api/problems/:problemId/submissions/": () => [],

  "GET /adaptive-coding/api/sessions/": () => {
    const ids = overlay.get<string[]>("coding:sessions", []);
    return ids
      .map(loadSession)
      .filter((s): s is CodingSessionState => s !== null)
      .map((s) => {
        const { problem } = resolveProblem(s.problemId);
        return {
          id: s.id,
          config_id: s.configId,
          problem_id: s.problemId,
          problem_title: problem.title,
          language: s.language,
          status: s.status,
          passed: s.passed,
          run_count: s.runCount,
          submit_count: s.submitCount,
          started_at: s.startedAt,
          completed_at: s.completedAt,
        };
      });
  },

  "GET /adaptive-coding/api/student-model/": () => ({
    skills: Object.entries(masteryMap()).map(([skill, mastery]) => ({
      skill,
      mastery,
      band: band(mastery),
    })),
    open_misconceptions: [],
    updated_at: iso(new Date(nowMs())),
  }),

  /** The scratch runner in the article reader. */
  "POST /adaptive-quiz/api/run-snippet/": (req) => runSnippet(req),
});

/**
 * The article reader's inline snippet runner. Captures console output from the
 * learner's JavaScript so the "try it" box in a lesson genuinely evaluates.
 */
function runSnippet(req: DemoRequest) {
  const source = String(req.body?.source ?? req.body?.code ?? "");
  const language = String(req.body?.language ?? "javascript");

  if (language !== "javascript") {
    return {
      stdout: "",
      stderr: null,
      compile_output: `This demo executes JavaScript only, so ${language} snippets are not run here.`,
      status: "Not Run",
    };
  }
  if (!source.trim()) throw badRequest({ detail: "Nothing to run." });

  const lines: string[] = [];
  try {
    const log = (...args: unknown[]) =>
      lines.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    new Function("console", `"use strict";\n${source}`)({ log, info: log, warn: log, error: log });
    return { stdout: lines.join("\n"), stderr: null, compile_output: null, status: "Accepted" };
  } catch (error) {
    return {
      stdout: lines.join("\n"),
      stderr: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      compile_output: null,
      status: "Runtime Error",
    };
  }
}
