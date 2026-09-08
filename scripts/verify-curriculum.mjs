/**
 * Gate for authored curriculum.
 *
 * Content that merely *looks* authored is the failure this catches. Prose can be
 * eyeballed, but a coding problem whose reference solution does not pass its own
 * tests, or an MCQ whose "correct" option is wrong, ships a demo that breaks the
 * moment a prospect tries it. So this executes every solution against every test
 * and checks every question mechanically.
 *
 * It also enforces the two things that made the old content obviously fake:
 * tiers that are the same text, and prose shared between topics.
 *
 * Usage: node scripts/verify-curriculum.mjs [courseId ...]
 * Exits non-zero on any failure.
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { execFileSync } from "child_process";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "lib/demo/db/curriculum");
const TMP = path.join(ROOT, ".curriculum-check");

const wanted = process.argv.slice(2).filter((a) => /^\d+$/.test(a));

if (!fs.existsSync(DIR)) {
  console.error("no curriculum directory yet");
  process.exit(1);
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => /^course-\d+\.ts$/.test(f))
  .filter((f) => !wanted.length || wanted.includes(f.match(/\d+/)[0]));

if (!files.length) {
  console.error("no course-*.ts curriculum files found");
  process.exit(1);
}

// Compile the TS to JS so we can actually run the solutions. esbuild ships with
// Next, so this needs no extra dependency.
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });
try {
  execFileSync(
    "npx",
    ["esbuild", ...files.map((f) => path.join(DIR, f)), "--outdir=" + TMP, "--format=esm", "--platform=node", "--log-level=error"],
    { cwd: ROOT, stdio: "inherit" },
  );
} catch {
  console.error("esbuild failed — the curriculum files do not compile");
  process.exit(1);
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const TIERS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const allProse = new Map(); // normalized paragraph -> first topic that used it

let topicCount = 0;
let questionCount = 0;
let problemCount = 0;
let testCount = 0;

for (const file of files) {
  const courseId = file.match(/\d+/)[0];
  const mod = await import(pathToFileURL(path.join(TMP, file.replace(/\.ts$/, ".js"))).href);
  const curriculum = mod.default ?? Object.values(mod)[0];
  if (!curriculum || typeof curriculum !== "object") {
    fail(file, "no default export of topics");
    continue;
  }

  for (const [key, topic] of Object.entries(curriculum)) {
    const where = `course ${courseId} topic ${key} (${topic.title ?? "?"})`;
    topicCount++;

    if (Number(key) !== topic.topicId) fail(where, `key ${key} != topicId ${topic.topicId}`);
    if (!topic.summary || topic.summary.length < 40) fail(where, "summary missing or too short");
    if (!Array.isArray(topic.concepts) || topic.concepts.length < 3)
      fail(where, "needs at least 3 concepts");
    if (!topic.glossary || Object.keys(topic.glossary).length < 3)
      fail(where, "needs at least 3 glossary terms");

    // --- tiers must exist, be substantial, and genuinely differ -------------
    for (const tier of TIERS) {
      const body = topic.body?.[tier];
      if (!body) { fail(where, `missing ${tier} body`); continue; }
      if (body.length < 700) fail(where, `${tier} body is only ${body.length} chars`);
    }
    const bodies = TIERS.map((t) => topic.body?.[t]).filter(Boolean);
    const distinct = new Set(bodies.map((b) => b.replace(/\s+/g, " ").trim()));
    if (bodies.length === 4 && distinct.size < 4)
      fail(where, `only ${distinct.size} distinct bodies across 4 tiers`);

    // --- prose must not be shared between topics ---------------------------
    for (const body of bodies) {
      for (const para of body.split(/<\/p>|<\/li>/)) {
        const norm = para.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
        if (norm.length < 120) continue;
        const seen = allProse.get(norm);
        if (seen && seen !== where) fail(where, `shares a paragraph with ${seen}`);
        else allProse.set(norm, where);
      }
    }

    // --- em dashes are against house style ---------------------------------
    const visible = [topic.summary, ...bodies, ...(topic.questions ?? []).map((q) => q.question + q.explanation)].join(" ");
    if (visible.includes("—")) fail(where, "contains an em dash");

    // --- questions ----------------------------------------------------------
    for (const q of topic.questions ?? []) {
      questionCount++;
      const qw = `${where} Q${q.n}`;
      if (!Array.isArray(q.options) || q.options.length !== 4) fail(qw, "needs exactly 4 options");
      if (new Set(q.options).size !== (q.options?.length ?? 0)) fail(qw, "duplicate options");
      if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) fail(qw, "answer out of range");
      if (!q.explanation || q.explanation.length < 60) fail(qw, "explanation missing or too short");
      if (!topic.concepts.includes(q.skill)) fail(qw, `skill "${q.skill}" is not one of the topic's concepts`);
    }
    const qs = topic.questions ?? [];
    if (qs.length && new Set(qs.map((q) => q.question)).size !== qs.length)
      fail(where, "duplicate question text within the topic");

    // --- coding problems: EXECUTE the solution against its own tests --------
    for (const p of topic.problems ?? []) {
      problemCount++;
      const pw = `${where} problem ${p.n} (${p.title})`;
      if (!p.tests?.length || p.tests.length < 4) fail(pw, "needs at least 4 test cases");
      if (!p.tests?.some((t) => t.hidden)) fail(pw, "needs at least one hidden test");
      if (!Array.isArray(p.hints) || p.hints.length !== 3) fail(pw, "needs exactly 3 hints");
      if (!p.solution) { fail(pw, "no reference solution"); continue; }

      let fn;
      try {
        // The solution defines `function <fn>(...)`; evaluate and pull it out.
        fn = new Function(`${p.solution}\nreturn typeof ${p.fn} === "function" ? ${p.fn} : null;`)();
      } catch (e) {
        fail(pw, `solution does not evaluate: ${e.message}`);
        continue;
      }
      if (!fn) { fail(pw, `solution does not define ${p.fn}()`); continue; }

      for (const [i, t] of (p.tests ?? []).entries()) {
        testCount++;
        let actual;
        try {
          actual = fn(...structuredClone(t.args));
        } catch (e) {
          fail(pw, `test ${i} (${t.label}) threw: ${e.message}`);
          continue;
        }
        if (JSON.stringify(actual) !== JSON.stringify(t.expected)) {
          fail(pw, `test ${i} (${t.label}) expected ${JSON.stringify(t.expected)} but the reference solution returned ${JSON.stringify(actual)}`);
        }
      }
    }
  }
}

fs.rmSync(TMP, { recursive: true, force: true });

console.log(
  `topics ${topicCount} | questions ${questionCount} | problems ${problemCount} | tests executed ${testCount}`,
);
if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("curriculum OK");
