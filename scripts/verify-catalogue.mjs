/**
 * Gate for the course catalogue.
 *
 * `scripts/verify-curriculum.mjs` checks that authored lesson content is real. This
 * checks the thing that content is authored AGAINST: the catalogue in
 * lib/demo/db/courses.ts, which assigns every course, module and topic its id.
 *
 * It exists because those ids are a contract between files that never import each
 * other. A curriculum file is keyed by topic id, the quiz bank by course id, and the
 * assessment and journey handlers by both. Nothing in TypeScript relates them, so a
 * topic id that shifts by one produces a lesson that silently renders the generated
 * fallback instead of its authored body, which is precisely the failure the authored
 * content exists to prevent.
 *
 * Checks, in order of how badly each one bites:
 *   1. ids are unique across courses, modules and topics
 *   2. ids follow the documented rule (topic = courseId*100 + n, module = courseId*1000 + i)
 *   3. every course carries a section and a category from the fixed taxonomy
 *   4. no course offers a content kind this product line cannot serve (coding, video)
 *   5. derived completion is consistent with what a course claims (enrolled vs progress)
 *   6. slugs are unique, titles are non-empty, house style holds (no em dashes)
 *   7. every authored curriculum topic corresponds to a real topic with the same title,
 *      and the coverage gap is reported rather than hidden
 *
 * Usage: node scripts/verify-catalogue.mjs
 * Exits non-zero on any failure.
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { execFileSync } from "child_process";

const ROOT = process.cwd();
/** Per-process, so parallel authors running this gate cannot delete each other's output. */
const TMP = path.join(ROOT, `.catalogue-check-${process.pid}`);
const COURSES_TS = path.join(ROOT, "lib/demo/db/courses.ts");
const CURRICULUM_DIR = path.join(ROOT, "lib/demo/db/curriculum");

if (!fs.existsSync(COURSES_TS)) {
  console.error("lib/demo/db/courses.ts not found");
  process.exit(1);
}

fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

/** Bundle to JS so the checks run against the real exported values, not a regex of the source. */
function bundle(entry, outfile) {
  execFileSync(
    "npx",
    [
      "esbuild",
      entry,
      "--bundle",
      "--outfile=" + outfile,
      "--format=esm",
      "--platform=node",
      "--log-level=error",
      // Path-aliased imports are type-only in this dependency graph, so stubbing them
      // keeps the bundle honest instead of dragging in the whole app.
      "--external:@/*",
      "--external:next/*",
      "--external:react",
    ],
    { cwd: ROOT, stdio: "inherit" },
  );
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

let courses;
let sections;
let categories;
try {
  const out = path.join(TMP, "courses.mjs");
  bundle(COURSES_TS, out);
  const mod = await import(pathToFileURL(out).href);
  courses = mod.COURSES;
  sections = mod.COURSE_SECTIONS;
  categories = mod.COURSE_CATEGORIES;
} catch (e) {
  console.error("could not load the catalogue: " + (e?.message ?? e));
  process.exit(1);
}

if (!Array.isArray(courses) || courses.length === 0) {
  console.error("COURSES is empty or not an array");
  process.exit(1);
}
if (!Array.isArray(sections) || !Array.isArray(categories)) {
  fail("taxonomy", "COURSE_SECTIONS and COURSE_CATEGORIES must both be exported arrays");
}

const sectionSlugs = new Set((sections ?? []).map((s) => s.slug));
const categoryBySlug = new Map((categories ?? []).map((c) => [c.slug, c]));

for (const c of categories ?? []) {
  if (!sectionSlugs.has(c.section)) fail(`category ${c.slug}`, `unknown section "${c.section}"`);
  if (!c.title || !c.blurb || !c.icon) fail(`category ${c.slug}`, "needs a title, a blurb and an icon");
}
for (const s of sections ?? []) {
  if (!s.title || !s.blurb || !s.icon || !s.accent) fail(`section ${s.slug}`, "needs title, blurb, icon and accent");
  const owned = (categories ?? []).filter((c) => c.section === s.slug);
  if (owned.length === 0) fail(`section ${s.slug}`, "has no categories");
}

const seenCourseIds = new Set();
const seenSlugs = new Set();
const seenModuleIds = new Map();
const seenTopicIds = new Map();
const ALLOWED_KINDS = new Set(["article", "quiz", "assignment"]);

let topicTotal = 0;
const topicIndex = new Map(); // topicId -> { courseId, title }

for (const course of courses) {
  const where = `course ${course.id} (${course.title})`;

  if (seenCourseIds.has(course.id)) fail(where, "duplicate course id");
  seenCourseIds.add(course.id);

  if (!course.title || !course.subtitle || !course.description) fail(where, "title, subtitle and description are all required");
  if ((course.description ?? "").length < 120) fail(where, "description is too short to read as real");
  if (seenSlugs.has(course.slug)) fail(where, `duplicate slug "${course.slug}"`);
  seenSlugs.add(course.slug);

  if (!course.section || !sectionSlugs.has(course.section)) fail(where, `section "${course.section}" is not in COURSE_SECTIONS`);
  if (!course.category || !categoryBySlug.has(course.category)) fail(where, `category "${course.category}" is not in COURSE_CATEGORIES`);
  else if (categoryBySlug.get(course.category).section !== course.section)
    fail(where, `category "${course.category}" belongs to section "${categoryBySlug.get(course.category).section}", not "${course.section}"`);

  if (!Array.isArray(course.tags) || course.tags.length < 3) fail(where, "needs at least 3 tags");
  if (!Array.isArray(course.modules) || course.modules.length < 4) fail(where, "needs at least 4 modules");

  const visible = [course.title, course.subtitle, course.description, ...(course.tags ?? [])].join(" ");
  if (visible.includes("—")) fail(where, "contains an em dash");

  let n = 0;
  course.modules.forEach((m, i) => {
    const mw = `${where} module ${i + 1} (${m.title})`;
    const expectedModuleId = course.id * 1000 + (i + 1);
    if (m.id !== expectedModuleId) fail(mw, `module id ${m.id} breaks the rule, expected ${expectedModuleId}`);
    if (seenModuleIds.has(m.id)) fail(mw, `duplicate module id, also used by ${seenModuleIds.get(m.id)}`);
    seenModuleIds.set(m.id, mw);
    if (!m.summary || m.summary.length < 20) fail(mw, "summary missing or too short");
    if (!Array.isArray(m.topics) || m.topics.length < 2) fail(mw, "needs at least 2 topics");
    if ((m.title + m.summary).includes("—")) fail(mw, "contains an em dash");

    for (const t of m.topics ?? []) {
      n++;
      topicTotal++;
      const tw = `${where} topic ${t.id} (${t.title})`;
      const expectedTopicId = course.id * 100 + n;
      if (t.id !== expectedTopicId) fail(tw, `topic id ${t.id} breaks the rule, expected ${expectedTopicId} (topic ${n} of the course)`);
      if (seenTopicIds.has(t.id)) fail(tw, `duplicate topic id, also used by ${seenTopicIds.get(t.id)}`);
      seenTopicIds.set(t.id, tw);
      topicIndex.set(t.id, { courseId: course.id, title: t.title });

      if (!t.title || t.title.length < 8) fail(tw, "title missing or too short");
      if (t.title.includes("—")) fail(tw, "contains an em dash");
      if (!Array.isArray(t.kinds) || t.kinds.length === 0) fail(tw, "needs at least one content kind");
      for (const k of t.kinds ?? []) {
        if (!ALLOWED_KINDS.has(k)) fail(tw, `kind "${k}" is not servable by this product line (allowed: article, quiz, assignment)`);
      }
      if (typeof t.progress !== "number" || t.progress < 0 || t.progress > 100) fail(tw, "progress must be 0-100");
    }
  });

  if (n > 99) fail(where, `${n} topics exceeds the 99 the id rule allows`);

  // Completion is derived, so this only catches a course whose enrolment and progress disagree.
  const topics = course.modules.flatMap((m) => m.topics ?? []);
  const mean = topics.length ? Math.round(topics.reduce((s, t) => s + t.progress, 0) / topics.length) : 0;
  if (course.completion !== mean) fail(where, `completion ${course.completion} is not the mean of its topics (${mean}); it must be derived, never hand-set`);
  if (!course.enrolled && mean > 0) fail(where, `is not enrolled but carries ${mean}% progress`);
  if (course.enrolled && mean === 0) fail(where, "is enrolled but every topic is at zero, so the dashboard will show an empty card");
}

/* ------------------------------------------------------- authored curriculum */

let authoredTopics = 0;
if (fs.existsSync(CURRICULUM_DIR)) {
  const files = fs.readdirSync(CURRICULUM_DIR).filter((f) => /^course-\d+\.ts$/.test(f));
  for (const file of files) {
    const courseId = Number(file.match(/\d+/)[0]);
    if (!seenCourseIds.has(courseId)) {
      fail(file, `no course ${courseId} exists in the catalogue`);
      continue;
    }
    let curriculum;
    try {
      const out = path.join(TMP, file.replace(/\.ts$/, ".mjs"));
      bundle(path.join(CURRICULUM_DIR, file), out);
      const mod = await import(pathToFileURL(out).href);
      curriculum = mod.default ?? Object.values(mod)[0];
    } catch (e) {
      fail(file, `does not compile: ${e?.message ?? e}`);
      continue;
    }
    for (const [key, topic] of Object.entries(curriculum ?? {})) {
      authoredTopics++;
      const id = Number(key);
      const real = topicIndex.get(id);
      if (!real) {
        fail(`${file} topic ${id}`, "is not a topic in the catalogue, so nothing will ever render it");
        continue;
      }
      if (real.courseId !== courseId) fail(`${file} topic ${id}`, `belongs to course ${real.courseId}, not ${courseId}`);
      if (topic.title !== real.title)
        fail(`${file} topic ${id}`, `title "${topic.title}" does not match the catalogue's "${real.title}"`);
    }
  }

  // Which catalogue topics have no authored content. Reported, not failed: the
  // generated fallback is a documented degradation, and hiding the gap is what
  // would let it grow.
  const unauthored = [...topicIndex.keys()].filter((id) => {
    const f = path.join(CURRICULUM_DIR, `course-${topicIndex.get(id).courseId}.ts`);
    return !fs.existsSync(f);
  });
  const coursesWithoutCurriculum = new Set(unauthored.map((id) => topicIndex.get(id).courseId));
  if (coursesWithoutCurriculum.size) {
    console.log(
      `note: ${coursesWithoutCurriculum.size} course(s) have no authored curriculum yet: ${[...coursesWithoutCurriculum].sort().join(", ")}`,
    );
  }
}

fs.rmSync(TMP, { recursive: true, force: true });

console.log(
  `courses ${courses.length} | sections ${sections?.length ?? 0} | categories ${categories?.length ?? 0} | topics ${topicTotal} | authored topics ${authoredTopics}`,
);
if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("catalogue OK");
