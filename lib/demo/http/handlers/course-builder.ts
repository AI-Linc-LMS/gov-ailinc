/**
 * The course builder: every create, edit and delete an administrator performs on
 * a course, plus the learner-facing content routes those edits feed.
 *
 * The organising idea is a single OVERLAY-BACKED TREE laid over the seeded
 * catalogue. Nothing here keeps a second copy of the nineteen courses in
 * `lib/demo/db/courses.ts`; instead the seed is projected into editable rows, and
 * the visitor's creations, patches and deletions are layered on top at read time.
 * That is what makes the round trips honest: a module added to the seeded TGPSC
 * Group-II course appears in the builder tree, in the legacy admin module list
 * and on the aspirant's course page, because all three read the same projection.
 *
 * The rule this module exists to satisfy: a create that does not show up in the
 * following GET is a worse lie than an error. So every POST writes to the overlay
 * and every list reads it back, including deletes of SEEDED rows (recorded as
 * tombstones, since the seed itself is immutable and regenerated each load).
 *
 * The middle of the file is the COURSE GENERATOR: the screen where a programme
 * officer describes a course ("a 6 week course for TGPSC Group-II aspirants on
 * the Telangana movement", "a 40 hour rooftop solar installer course for an ITI
 * batch in Warangal") and watches weeks, topics, lessons and quizzes assemble
 * before publishing. It plans from a blueprint per track rather than from a
 * language model, which is what keeps it accurate to the real syllabus and trade
 * instead of plausible-sounding, and it never emits a coding exercise. See the
 * TRACKS table for the blueprint and for why. The tree is written on the POST
 * and the job page then reads a projection of it, so a course that was started
 * gets built whether or not anyone stays on the progress screen.
 *
 * Two id conventions matter here.
 *  - Content ids for seeded topics reuse the namespaces `adaptive-courses.ts`
 *    already publishes (article = topic + 100k, quiz + 200k, coding + 300k,
 *    video + 400k, assignment + 500k). Reusing them rather than inventing a
 *    parallel set is what lets the legacy lesson page and the adaptive lesson
 *    page open the SAME article and agree on whether it is finished.
 *    No seeded topic in this catalogue declares `coding` or `video`, so those
 *    two namespaces are reserved and unused rather than removed.
 *  - Everything the visitor creates draws from one `nextDemoId("builder")`
 *    sequence, so a module id can never be mistaken for a submodule id when a
 *    route takes both.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import {
  COURSES,
  courseArt,
  courseById,
  topicsOf,
  type DemoCourse,
  type DemoModule,
  type DemoTopic,
} from "../../db/courses";
import { articleBody } from "../../db/article-content";
import { QUIZ_BANK, bankForTopic, type DemoMcq } from "../../db/quiz-bank";
import { INSTRUCTOR_PERSONA, STUDENT_PERSONA, STUDENTS } from "../../db/people";
import { DEMO_CLIENT_ID, DEMO_TENANT } from "../../config";
import { clientInfo } from "../../db/tenant";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { seededInt, seededPick, seededSample } from "../../random";
import { ARTICLE_ID, CODING_ID, QUIZ_ID, VIDEO_ID, conceptsFor } from "./adaptive-courses";

const MODULE = "course-builder";

/** Every `/clients/:clientId/` route in this demo is the one tenant. */
const DEMO_CLIENT = DEMO_CLIENT_ID;

/* ────────────────────────────────────────────────────────────── content kinds */

/** The API's content-type enum. The builder and the lesson page both key off it. */
type ContentType = "Article" | "Quiz" | "CodingProblem" | "Assignment" | "VideoTutorial";

/** The adaptive builder's lowercase vocabulary for the same five things. */
type ContentKind = "article" | "quiz" | "coding" | "video" | "attachment";

const ASSIGNMENT_ID = (topic: DemoTopic) => topic.id + 500_000;

/** Topic `kinds` are the seed's vocabulary; these are the API's. */
const TYPE_OF_KIND: Record<DemoTopic["kinds"][number], ContentType> = {
  article: "Article",
  quiz: "Quiz",
  coding: "CodingProblem",
  assignment: "Assignment",
  video: "VideoTutorial",
};

/** Marks a content item is worth, by type. Used by the lesson header and the gradebook. */
const MARKS_OF_TYPE: Record<ContentType, number> = {
  Article: 10,
  Quiz: 20,
  CodingProblem: 30,
  Assignment: 50,
  VideoTutorial: 5,
};

const MINUTES_OF_TYPE: Record<ContentType, number> = {
  Article: 8,
  Quiz: 15,
  CodingProblem: 35,
  Assignment: 90,
  VideoTutorial: 12,
};

/* ──────────────────────────────────────────────────────────────── the overlay */

interface BuilderCourse {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  difficulty_level: string;
  target_audience: string;
  duration_weeks: number;
  duration_in_hours: number;
  tags: string[];
  published: boolean;
  enrollment_enabled: boolean;
  certificate_available: boolean;
  is_free: boolean;
  price: string | null;
  currency: string;
  is_paid: boolean;
  self_enroll_enabled: boolean;
  auto_enroll: boolean;
  content_locked: boolean;
  allow_clipboard: boolean;
  rating: number;
  rating_count: number;
  enrolled_count: number;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  /** False for the five seeded courses, true for anything the visitor built. */
  authored_here: boolean;
}

interface BuilderModule {
  id: number;
  course: number;
  title: string;
  description: string;
  weekno: number;
}

interface BuilderSubmodule {
  id: number;
  module: number;
  title: string;
  description: string;
  order: number;
}

interface BuilderContent {
  id: number;
  submodule: number;
  title: string;
  content_type: ContentType;
  content_id: number;
  order: number;
  duration_in_minutes: number;
  marks: number;
}

interface BuilderAttachment {
  id: number;
  content: number;
  title: string;
  file_url: string | null;
  file_type: "pdf" | "image" | "document" | "text" | "other";
  original_filename: string;
  file_size: number;
  mime_type: string;
  order: number;
  uploaded_by: number | null;
  uploaded_by_name: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * A standalone content object (article body, quiz paper, coding problem, ...).
 *
 * The real API stores these in their own tables and a `Content` row merely points
 * at one, which is why the service has both `createArticle` and
 * `addSubmoduleContent`. Keeping the same split here means the two-step authoring
 * flow works exactly as the UI expects: create the object, then attach it.
 */
interface BuilderItem {
  id: number;
  kind: ContentType | "MCQ";
  title: string;
  difficulty_level: string;
  /** Whatever that kind carries: body html, video url, question text, test cases. */
  fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface BuilderState {
  courses: BuilderCourse[];
  modules: BuilderModule[];
  submodules: BuilderSubmodule[];
  contents: BuilderContent[];
  attachments: BuilderAttachment[];
  items: Record<string, BuilderItem>;
  patch: {
    course: Record<string, Partial<BuilderCourse>>;
    module: Record<string, Partial<BuilderModule>>;
    submodule: Record<string, Partial<BuilderSubmodule>>;
    content: Record<string, Partial<BuilderContent>>;
    attachment: Record<string, Partial<BuilderAttachment>>;
  };
  /** Tombstones. Seeded rows cannot be removed from the seed, only hidden. */
  gone: {
    course: number[];
    module: number[];
    submodule: number[];
    content: number[];
    attachment: number[];
  };
}

const STORE_KEY = "builder:tree";

function emptyState(): BuilderState {
  return {
    courses: [],
    modules: [],
    submodules: [],
    contents: [],
    attachments: [],
    items: {},
    patch: { course: {}, module: {}, submodule: {}, content: {}, attachment: {} },
    gone: { course: [], module: [], submodule: [], content: [], attachment: [] },
  };
}

/**
 * Read the store, healed against older overlays.
 *
 * A visitor who used the demo before a section existed has a persisted object
 * without that key, and `state().gone.content.includes(...)` on an undefined
 * `gone` takes the whole admin area down on load. Merging over a fresh empty
 * state costs nothing and removes the entire class of failure.
 */
function state(): BuilderState {
  const raw = overlay.get<Partial<BuilderState>>(STORE_KEY, {});
  const base = emptyState();
  return {
    ...base,
    ...raw,
    patch: { ...base.patch, ...(raw.patch ?? {}) },
    gone: { ...base.gone, ...(raw.gone ?? {}) },
    items: { ...base.items, ...(raw.items ?? {}) },
  };
}

/** Read-modify-write. The tree is plain JSON, so a structural clone is a round trip. */
function mutate<T>(fn: (s: BuilderState) => T): T {
  const next = JSON.parse(JSON.stringify(state())) as BuilderState;
  const result = fn(next);
  overlay.set(STORE_KEY, next);
  return result;
}

function newId(): number {
  return nextDemoId("builder");
}

function nowIso(): string {
  return iso(new Date(nowMs()));
}

function bury(kind: keyof BuilderState["gone"], id: number): void {
  mutate((s) => {
    if (!s.gone[kind].includes(id)) s.gone[kind].push(id);
  });
}

function isGone(kind: keyof BuilderState["gone"], id: number): boolean {
  return state().gone[kind].includes(id);
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled-course"
  );
}

/**
 * The part of a course title a human would say out loud.
 *
 * Catalogue titles carry their scope after a colon or an ampersand ("TGPSC
 * Group-II & Group-III Foundation", "Solar PV Installer & Rooftop Technician"),
 * which is right on a card and far too long inside a sentence or on a batch
 * chip. Falls back to the whole title rather than to an empty string, because a
 * blank chip is worse than a long one.
 */
function shortCourseName(title: string): string {
  const head = title.split(":")[0].split("&")[0].trim();
  return head.length >= 4 ? head : title.trim();
}

/* ─────────────────────────────────────────────────────── projecting the seed */

/** Reverse lookups for the seed, built once. Cheap, and it keeps every route O(1). */
const SEED_MODULE_COURSE = new Map<number, DemoCourse>();
const SEED_MODULE = new Map<number, DemoModule>();
const SEED_TOPIC_MODULE = new Map<number, DemoModule>();
const SEED_TOPIC = new Map<number, DemoTopic>();
const SEED_TOPIC_COURSE = new Map<number, DemoCourse>();
for (const course of COURSES) {
  for (const mod of course.modules) {
    SEED_MODULE_COURSE.set(mod.id, course);
    SEED_MODULE.set(mod.id, mod);
    for (const topic of mod.topics) {
      SEED_TOPIC_MODULE.set(topic.id, mod);
      SEED_TOPIC.set(topic.id, topic);
      SEED_TOPIC_COURSE.set(topic.id, course);
    }
  }
}

function seedCourseRow(c: DemoCourse): BuilderCourse {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    slug: c.slug,
    difficulty_level: c.difficulty,
    target_audience: audienceFor(c),
    duration_weeks: c.modules.length * 2,
    duration_in_hours: c.durationHours,
    tags: [...c.tags],
    published: true,
    enrollment_enabled: true,
    certificate_available: true,
    is_free: true,
    price: null,
    currency: "INR",
    is_paid: false,
    self_enroll_enabled: true,
    auto_enroll: false,
    content_locked: false,
    allow_clipboard: true,
    rating: c.rating,
    rating_count: c.ratingCount,
    enrolled_count: c.enrolledCount,
    thumbnail: courseArt(c),
    created_at: isoDaysAgo(120),
    updated_at: isoDaysAgo(seededInt(`aupd:${c.id}`, 1, 20)),
    authored_here: false,
  };
}

/**
 * Who a seeded course is for, in the tenant's own vocabulary.
 *
 * Read off the category rather than the difficulty alone. An Advanced course
 * here is a candidate sitting a recruitment exam for the second time, not an
 * engineer preparing for a product-company interview, and this string is shown
 * word for word on the builder's course settings page and on the generated
 * course's brief.
 */
function audienceFor(c: DemoCourse): string {
  switch (c.category) {
    case "state-central-psu":
      return c.difficulty === "Advanced"
        ? "Aspirants sitting the notification again, working on the marks lost in the mains papers"
        : "Aspirants preparing for state, central, railway or public undertaking recruitment";
    case "banking":
      return c.difficulty === "Advanced"
        ? "Candidates who have cleared a prelims before and are now working on mains and the interview"
        : "Candidates preparing for banking and financial sector recruitment";
    case "rural-employment-vocational":
      return "Trainees at a district skill centre, and ITI students taking this trade as an add-on";
    case "rural-entrepreneurship":
      return "Self help group members and first time entrepreneurs running a unit in their own mandal";
  }
}

function seedModuleRow(c: DemoCourse, m: DemoModule, index: number): BuilderModule {
  return { id: m.id, course: c.id, title: m.title, description: m.summary, weekno: index + 1 };
}

function seedSubmoduleRow(m: DemoModule, t: DemoTopic, order: number): BuilderSubmodule {
  return {
    id: t.id,
    module: m.id,
    title: t.title,
    // The title is NOT lower-cased into the sentence. This catalogue is full of
    // proper nouns (Mulki rules, Kakatiya, MUDRA, ONDC, Group-II) and lowering
    // them printed "work through mulki rules" on every topic card.
    description: `Work through ${t.title}, then answer the practice questions on it.`,
    order,
  };
}

/** Content id for a seeded topic + kind. Shared with the adaptive lesson routes. */
function seedContentId(topic: DemoTopic, kind: DemoTopic["kinds"][number]): number {
  switch (kind) {
    case "article":
      return ARTICLE_ID(topic);
    case "quiz":
      return QUIZ_ID(topic);
    case "coding":
      return CODING_ID(topic);
    case "video":
      return VIDEO_ID(topic);
    case "assignment":
      return ASSIGNMENT_ID(topic);
  }
}

function seedContentRows(topic: DemoTopic): BuilderContent[] {
  return topic.kinds.map((kind, i) => {
    const type = TYPE_OF_KIND[kind];
    const id = seedContentId(topic, kind);
    return {
      id,
      submodule: topic.id,
      title: labelForContent(topic.title, type),
      content_type: type,
      content_id: id,
      order: i + 1,
      duration_in_minutes: MINUTES_OF_TYPE[type],
      marks: MARKS_OF_TYPE[type],
    };
  });
}

function labelForContent(topicTitle: string, type: ContentType): string {
  switch (type) {
    case "Article":
      return topicTitle;
    case "Quiz":
      return `${topicTitle}: practice questions`;
    case "CodingProblem":
      return `${topicTitle}: practice problem`;
    case "Assignment":
      return `${topicTitle}: work to submit`;
    case "VideoTutorial":
      return `${topicTitle}: walkthrough`;
  }
}

/* ───────────────────────────────────────────────────── the merged projection */

function applyPatch<T>(row: T, patch: Partial<T> | undefined): T {
  return patch ? { ...row, ...patch } : row;
}

/** Every course an admin can see, seeded and visitor-built, newest additions last. */
export function builderCourses(): BuilderCourse[] {
  const s = state();
  const seeded = COURSES.map(seedCourseRow);
  return [...seeded, ...s.courses]
    .filter((c) => !s.gone.course.includes(c.id))
    .map((c) => applyPatch(c, s.patch.course[c.id]));
}

export function builderCourse(id: number): BuilderCourse | undefined {
  return builderCourses().find((c) => c.id === id);
}

/** Modules of one course, week order. */
export function builderModules(courseId: number): BuilderModule[] {
  const s = state();
  const seedCourse = courseById(courseId);
  const seeded = seedCourse
    ? seedCourse.modules.map((m, i) => seedModuleRow(seedCourse, m, i))
    : [];
  const created = s.modules.filter((m) => m.course === courseId);
  return [...seeded, ...created]
    .filter((m) => !s.gone.module.includes(m.id))
    .map((m) => applyPatch(m, s.patch.module[m.id]))
    .sort((a, b) => a.weekno - b.weekno || a.id - b.id);
}

function builderModule(moduleId: number): BuilderModule | undefined {
  const s = state();
  if (s.gone.module.includes(moduleId)) return undefined;
  const created = s.modules.find((m) => m.id === moduleId);
  if (created) return applyPatch(created, s.patch.module[moduleId]);
  const seedMod = SEED_MODULE.get(moduleId);
  const seedCourse = SEED_MODULE_COURSE.get(moduleId);
  if (!seedMod || !seedCourse) return undefined;
  const index = seedCourse.modules.indexOf(seedMod);
  return applyPatch(seedModuleRow(seedCourse, seedMod, index), s.patch.module[moduleId]);
}

/** Submodules (topics) of one module, in display order. */
export function builderSubmodules(moduleId: number): BuilderSubmodule[] {
  const s = state();
  const seedMod = SEED_MODULE.get(moduleId);
  const seeded = seedMod ? seedMod.topics.map((t, i) => seedSubmoduleRow(seedMod, t, i + 1)) : [];
  const created = s.submodules.filter((sm) => sm.module === moduleId);
  return [...seeded, ...created]
    .filter((sm) => !s.gone.submodule.includes(sm.id))
    .map((sm) => applyPatch(sm, s.patch.submodule[sm.id]))
    .sort((a, b) => a.order - b.order || a.id - b.id);
}

function builderSubmodule(submoduleId: number): BuilderSubmodule | undefined {
  const s = state();
  if (s.gone.submodule.includes(submoduleId)) return undefined;
  const created = s.submodules.find((sm) => sm.id === submoduleId);
  if (created) return applyPatch(created, s.patch.submodule[submoduleId]);
  const topic = SEED_TOPIC.get(submoduleId);
  const mod = SEED_TOPIC_MODULE.get(submoduleId);
  if (!topic || !mod) return undefined;
  const order = mod.topics.indexOf(topic) + 1;
  return applyPatch(seedSubmoduleRow(mod, topic, order), s.patch.submodule[submoduleId]);
}

/** The module a submodule belongs to, whether seeded or created. */
function moduleOfSubmodule(submoduleId: number): BuilderModule | undefined {
  const sub = builderSubmodule(submoduleId);
  return sub ? builderModule(sub.module) : undefined;
}

/** The course a submodule belongs to. Needed by the quiz bank, which is per course. */
function courseOfSubmodule(submoduleId: number): BuilderCourse | undefined {
  const mod = moduleOfSubmodule(submoduleId);
  return mod ? builderCourse(mod.course) : undefined;
}

/** Contents of one submodule, in display order. */
export function builderContents(submoduleId: number): BuilderContent[] {
  const s = state();
  const topic = SEED_TOPIC.get(submoduleId);
  const seeded = topic ? seedContentRows(topic) : [];
  const created = s.contents.filter((c) => c.submodule === submoduleId);
  return [...seeded, ...created]
    .filter((c) => !s.gone.content.includes(c.id))
    .map((c) => applyPatch(c, s.patch.content[c.id]))
    .sort((a, b) => a.order - b.order || a.id - b.id);
}

function builderContent(contentId: number): BuilderContent | undefined {
  const s = state();
  if (s.gone.content.includes(contentId)) return undefined;
  const created = s.contents.find((c) => c.id === contentId);
  if (created) return applyPatch(created, s.patch.content[contentId]);
  const seeded = resolveSeedContent(contentId);
  if (!seeded) return undefined;
  const rows = seedContentRows(seeded.topic);
  const row = rows.find((r) => r.id === contentId);
  return row ? applyPatch(row, s.patch.content[contentId]) : undefined;
}

/**
 * Map a seeded content id back to its topic and kind.
 *
 * The 100k-per-kind namespacing makes this arithmetic rather than a scan, which
 * matters because the lesson page resolves a content id on every click.
 */
function resolveSeedContent(
  contentId: number,
): { topic: DemoTopic; course: DemoCourse; kind: DemoTopic["kinds"][number] } | null {
  const bucket = Math.floor(contentId / 100_000);
  const topicId = contentId % 100_000;
  const kind = (
    ["article", "quiz", "coding", "video", "assignment"] as const
  )[bucket - 1];
  if (!kind) return null;
  const topic = SEED_TOPIC.get(topicId);
  const course = SEED_TOPIC_COURSE.get(topicId);
  if (!topic || !course) return null;
  return { topic, course, kind };
}

/* ───────────────────────────────────────────────────────────── attachments */

/**
 * Seeded handouts.
 *
 * One per course, on the first content of the first topic, so the lesson page
 * demonstrates the attachments rail without every lesson carrying filler. The
 * body is a real checklist rendered into a `data:` URI: the demo runs with no
 * network, so the only honest way to make Download actually download something
 * is to carry the bytes inline.
 */
function seededAttachments(): BuilderAttachment[] {
  // The callback is annotated rather than inferred. Without it TypeScript infers
  // `file_url: string` from the literal, which is narrower than the interface's
  // `string | null`, and the `a is BuilderAttachment` predicate below then fails
  // as unassignable to its own parameter type.
  return COURSES.map((course): BuilderAttachment | null => {
    const firstTopic = course.modules[0]?.topics[0];
    if (!firstTopic) return null;
    const contentId = seedContentId(firstTopic, firstTopic.kinds[0]);
    const text = [
      `${course.title}: how to work through this course`,
      "",
      ...course.modules.map((m, i) => `Week ${i + 1}. ${m.title} - ${m.summary}`),
      "",
      "How to use each week:",
      "1. Read the article once, then write down the two points you are least sure of.",
      "2. Attempt the practice questions before you open the explanations.",
      "3. Read the explanation on every question you got wrong, and on the ones you guessed.",
      "4. Bring one doubt to the live session, naming the point you got stuck on.",
      "",
      `Certificate threshold: ${course.certificateThreshold}% across the course.`,
    ].join("\n");
    return {
      id: 600_000 + course.id,
      content: contentId,
      title: "Study plan and weekly checklist",
      file_url: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
      file_type: "text" as const,
      original_filename: `${course.slug}-study-plan.txt`,
      file_size: text.length,
      mime_type: "text/plain",
      order: 1,
      uploaded_by: course.instructor.id,
      uploaded_by_name: course.instructor.full_name,
      created_at: isoDaysAgo(90),
      updated_at: isoDaysAgo(90),
    };
  }).filter((a): a is BuilderAttachment => a !== null);
}

function attachmentsOfContent(contentId: number): BuilderAttachment[] {
  const s = state();
  const all = [...seededAttachments(), ...s.attachments].filter((a) => a.content === contentId);
  return all
    .filter((a) => !s.gone.attachment.includes(a.id))
    .map((a) => applyPatch(a, s.patch.attachment[a.id]))
    .sort((a, b) => a.order - b.order || a.id - b.id);
}

/** The learner-facing attachment shape drops the uploader fields. */
function publicAttachment(a: BuilderAttachment) {
  return {
    id: a.id,
    content: a.content,
    title: a.title,
    file_url: a.file_url,
    file_type: a.file_type,
    original_filename: a.original_filename,
    file_size: a.file_size,
    mime_type: a.mime_type,
    order: a.order,
    created_at: a.created_at,
  };
}

/* ───────────────────────────────────────────────────────── uploaded files */

const INLINE_FILE_LIMIT = 512 * 1024;

/** Coarse family the attachment UI colours and icons off. */
function fileFamily(name: string, mime: string): BuilderAttachment["file_type"] {
  const ext = (name.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
  if (ext === ".pdf" || mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if ([".txt", ".md", ".csv"].includes(ext) || mime.startsWith("text/")) return "text";
  if ([".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".odt"].includes(ext)) return "document";
  return "other";
}

/**
 * Turn an uploaded file into something the page can actually open.
 *
 * There is no object store and no network, so the file is inlined as a `data:`
 * URI. Above the limit it is recorded with a null url: the row, the size and the
 * name are all true, and the preview buttons hide themselves rather than dangle.
 * A blob: URL was the alternative and is worse - it dies on reload, so a handout
 * uploaded in a demo would break the moment anyone refreshed.
 */
async function inlineFile(file: File): Promise<string | null> {
  if (file.size > INLINE_FILE_LIMIT) return null;
  try {
    const buf = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
    return `data:${file.type || "application/octet-stream"};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

/** Request bodies arrive as FormData for uploads and plain objects otherwise. */
function fieldOf(body: unknown, key: string): string | undefined {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const value = body.get(key);
    return typeof value === "string" ? value : undefined;
  }
  const record = (body ?? {}) as Record<string, unknown>;
  const value = record[key];
  return value === undefined || value === null ? undefined : String(value);
}

function fileOf(body: unknown, key = "file"): File | null {
  if (typeof FormData === "undefined" || !(body instanceof FormData)) return null;
  const value = body.get(key);
  return typeof value === "object" && value !== null && "arrayBuffer" in value
    ? (value as File)
    : null;
}

/* ─────────────────────────────────────────────────── content object bodies */

/**
 * The payload behind one content row.
 *
 * A visitor-created item is stored verbatim; a seeded one is generated from the
 * same sources the adaptive surfaces use (the authored article bodies and the MCQ
 * bank), so the legacy lesson page and the adaptive lesson page show the same
 * lesson rather than two different ones.
 */
function contentDetails(content: BuilderContent): Record<string, unknown> {
  const stored = state().items[String(content.content_id)];
  if (stored) {
    return { id: stored.id, title: stored.title, difficulty_level: stored.difficulty_level, ...stored.fields };
  }

  const seeded = resolveSeedContent(content.content_id);
  if (!seeded) {
    // A row whose object was never written: the legacy builder can attach a
    // content type before the object behind it exists. Say so plainly rather
    // than render a lesson that is silently blank.
    return {
      id: content.content_id,
      title: content.title,
      content: "<p>This item has been added to the topic but its content has not been written yet.</p>",
      description: "Nothing has been written for this item yet.",
      question: "This assignment has no brief yet.",
      mcqs: [],
    };
  }
  const { topic, course } = seeded;
  const concepts = conceptsFor(topic);

  switch (content.content_type) {
    case "Article": {
      const body = articleBody(topic, "Intermediate", concepts, course.id);
      return {
        id: content.content_id,
        title: topic.title,
        content: body.html,
        summary: body.summary,
        difficulty_level: course.difficulty,
        reading_time_minutes: body.readingMinutes,
      };
    }
    case "Quiz": {
      const bank = bankForTopic(course.id, concepts, topic.id).slice(0, 8);
      return {
        id: content.content_id,
        title: content.title,
        instructions:
          "Four options, one correct. There is no negative marking in this practice set, so attempt every question. Read the explanation on each one you get wrong, and on each one you guessed right.",
        durating_in_minutes: 15,
        difficulty_level: course.difficulty,
        mcqs: bank.map(publicMcq),
      };
    }
    case "CodingProblem":
      // Unreachable for seeded content, and deliberately inert.
      //
      // No topic in this catalogue declares a `coding` kind and the generator
      // refuses to create one, because this product line has no code judge. The
      // only way to arrive here is a legacy row whose content object was never
      // written. Answering with a generic algorithm question out of the software
      // bank would be the single most obvious tell that the catalogue was ported
      // from a software LMS, so it answers with the truth instead.
      return {
        id: content.content_id,
        title: content.title,
        problem_statement:
          "<p>This instance does not run a code judge, so there is no programming exercise behind this item.</p>",
        difficulty_level: course.difficulty,
        input_format: "",
        output_format: "",
        sample_input: "",
        sample_output: "",
        constraints: "",
        test_cases: [],
        template_code: {},
      };
    case "Assignment":
      return {
        id: content.content_id,
        title: content.title,
        difficulty_level: course.difficulty,
        question:
          `Write about a page on ${topic.title}, in your own words. ` +
          "State the point in two lines, then set out the reasoning or the procedure behind it, " +
          "and finish with one example you have seen yourself, in your district or at your centre. " +
          "Handwritten pages photographed and uploaded are accepted; your faculty marks the " +
          "reasoning, not the handwriting.",
        description: `Work to submit for ${topic.title}.`,
      };
    case "VideoTutorial":
      return {
        id: content.content_id,
        title: content.title,
        video_url: "",
        description: `Walkthrough of ${topic.title}.`,
        difficulty_level: course.difficulty,
      };
  }
}

/** Bank MCQ in the shape the legacy quiz player reads: options as a string array. */
function publicMcq(q: DemoMcq) {
  return {
    id: q.id,
    question_text: q.question,
    options: q.options.map((o) => o.label),
    correct_option: q.correct,
    explanation: q.explanation,
    difficulty_level: q.difficulty,
    topic: q.skill,
  };
}

/* ────────────────────────────────────────────── legacy admin course shapes */

/**
 * The row the legacy admin course list and the create/update responses return.
 *
 * `enrolled_students` is an OBJECT here, not a count. The list is typed
 * `Course` in `components/admin/course-builder/CourseCard.tsx`, which reads
 * `enrolled_students.total` and `stats.quiz.total`; a bare number renders the
 * card blank and a missing `stats` takes it down on `.total` of undefined.
 */
function adminCourseRow(c: BuilderCourse) {
  const modules = builderModules(c.id);
  const submodules = modules.flatMap((m) => builderSubmodules(m.id));
  const contents = submodules.flatMap((sm) => builderContents(sm.id));
  const of = (type: ContentType) => contents.filter((x) => x.content_type === type).length;
  const cohort = STUDENTS.slice(0, 5);

  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    slug: c.slug,
    difficulty_level: c.difficulty_level,
    duration_in_hours: c.duration_in_hours,
    language: "English",
    price: c.price ?? "0.00",
    is_free: c.is_free,
    is_pro: !c.is_free,
    certificate_available: c.certificate_available,
    thumbnail: c.thumbnail,
    preview_video_url: null,
    published: c.published,
    is_published: c.published,
    enrollment_enabled: c.enrollment_enabled,
    tags: c.tags,
    client: DEMO_CLIENT,
    rating: c.rating,
    rating_count: c.rating_count,
    enrolled_students: {
      total: c.enrolled_count,
      students_profile_pic: c.enrolled_count > 0 ? cohort.map((s) => s.profile_pic_url) : [],
    },
    stats: {
      video: { total: of("VideoTutorial") },
      article: { total: of("Article") },
      quiz: { total: of("Quiz") },
      assignment: { total: of("Assignment") },
      coding_problem: { total: of("CodingProblem") },
      subjective_question: { total: 0 },
    },
    module_count: modules.length,
    submodule_count: submodules.length,
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
}

function adminModuleRow(m: BuilderModule) {
  const submodules = builderSubmodules(m.id);
  return {
    id: m.id,
    course: m.course,
    title: m.title,
    description: m.description,
    weekno: m.weekno,
    submodule_count: submodules.length,
    submodules: submodules.map(adminSubmoduleRow),
  };
}

function adminSubmoduleRow(sm: BuilderSubmodule) {
  const contents = builderContents(sm.id);
  const count = (type: ContentType) => contents.filter((c) => c.content_type === type).length;
  return {
    id: sm.id,
    module: sm.module,
    title: sm.title,
    description: sm.description,
    order: sm.order,
    content_count: contents.length,
    video_count: count("VideoTutorial"),
    quiz_count: count("Quiz"),
    article_count: count("Article"),
    coding_problem_count: count("CodingProblem"),
    assignment_count: count("Assignment"),
    subjective_question_count: 0,
  };
}

function adminContentRow(c: BuilderContent) {
  return {
    id: c.id,
    submodule: c.submodule,
    title: c.title,
    content_type: c.content_type,
    content_id: c.content_id,
    order: c.order,
    duration_in_minutes: c.duration_in_minutes,
    marks: c.marks,
    attachment_count: attachmentsOfContent(c.id).length,
  };
}

/* ────────────────────────────────────────────────────── writing to the tree */

function createCourse(body: Record<string, unknown>, authoredHere = true): BuilderCourse {
  const title = String(body.title ?? "").trim() || "Untitled course";
  const now = nowIso();
  const rawTags = body.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.map(String)
    : typeof rawTags === "string" && rawTags.trim()
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const course: BuilderCourse = {
    id: newId(),
    title,
    subtitle: String(body.subtitle ?? "").trim(),
    description: String(body.description ?? "").trim(),
    slug: String(body.slug ?? "").trim() || slugify(title),
    difficulty_level: String(body.difficulty_level ?? "Medium"),
    target_audience: String(body.target_audience ?? "").trim(),
    duration_weeks: Number(body.duration_weeks ?? 8),
    duration_in_hours: Number(body.duration_in_hours ?? 0),
    tags,
    // A brand new course is a DRAFT. Publishing it is a separate, deliberate act,
    // and showing it as live the moment it is created would misrepresent the
    // review step the product actually has.
    published: false,
    enrollment_enabled: body.enrollment_enabled !== false,
    certificate_available: body.certificate_available !== false,
    is_free: body.is_free !== false,
    price: null,
    currency: "INR",
    is_paid: false,
    self_enroll_enabled: false,
    auto_enroll: false,
    content_locked: false,
    allow_clipboard: true,
    rating: 0,
    rating_count: 0,
    enrolled_count: 0,
    thumbnail: courseArt({ title, accent: ["#1b4f8a", "#1b4f8a"] }),
    created_at: now,
    updated_at: now,
    authored_here: authoredHere,
  };

  mutate((s) => s.courses.push(course));
  return course;
}

function patchCourse(id: number, changes: Partial<BuilderCourse>): BuilderCourse {
  const existing = builderCourse(id);
  if (!existing) throw notFound("Course not found");
  mutate((s) => {
    s.patch.course[id] = { ...(s.patch.course[id] ?? {}), ...changes, updated_at: nowIso() };
  });
  return builderCourse(id) as BuilderCourse;
}

function createModule(courseId: number, body: Record<string, unknown>): BuilderModule {
  if (!builderCourse(courseId)) throw notFound("Course not found");
  const existing = builderModules(courseId);
  const mod: BuilderModule = {
    id: newId(),
    course: courseId,
    title: String(body.title ?? "").trim() || `Week ${existing.length + 1}`,
    description: String(body.description ?? "").trim(),
    // Appended at the end when no week is given, which is what both builders do.
    weekno: Number(body.weekno ?? existing.length + 1),
  };
  mutate((s) => s.modules.push(mod));
  return mod;
}

function createSubmodule(moduleId: number, body: Record<string, unknown>): BuilderSubmodule {
  if (!builderModule(moduleId)) throw notFound("Module not found");
  const existing = builderSubmodules(moduleId);
  const sub: BuilderSubmodule = {
    id: newId(),
    module: moduleId,
    title: String(body.title ?? "").trim() || `Topic ${existing.length + 1}`,
    description: String(body.description ?? "").trim(),
    order: Number(body.order ?? existing.length + 1),
  };
  mutate((s) => s.submodules.push(sub));
  return sub;
}

/**
 * Remove a module and everything under it.
 *
 * Cascading matters even in a demo: leaving the topics behind would leave the
 * learner's course page listing lessons that the builder says are gone.
 */
function deleteModule(moduleId: number): number {
  const subs = builderSubmodules(moduleId);
  for (const sub of subs) deleteSubmodule(sub.id);
  bury("module", moduleId);
  mutate((s) => {
    s.modules = s.modules.filter((m) => m.id !== moduleId);
    delete s.patch.module[moduleId];
  });
  return subs.length;
}

function deleteSubmodule(submoduleId: number): void {
  for (const content of builderContents(submoduleId)) deleteContent(content.id);
  bury("submodule", submoduleId);
  mutate((s) => {
    s.submodules = s.submodules.filter((sm) => sm.id !== submoduleId);
    delete s.patch.submodule[submoduleId];
  });
}

function deleteContent(contentId: number): void {
  for (const att of attachmentsOfContent(contentId)) {
    bury("attachment", att.id);
  }
  bury("content", contentId);
  mutate((s) => {
    s.contents = s.contents.filter((c) => c.id !== contentId);
    s.attachments = s.attachments.filter((a) => a.content !== contentId);
    delete s.patch.content[contentId];
  });
}

function createItem(
  kind: BuilderItem["kind"],
  title: string,
  fields: Record<string, unknown>,
  difficulty = "Medium",
): BuilderItem {
  const now = nowIso();
  const item: BuilderItem = {
    id: newId(),
    kind,
    title,
    difficulty_level: difficulty,
    fields,
    created_at: now,
    updated_at: now,
  };
  mutate((s) => {
    s.items[String(item.id)] = item;
  });
  return item;
}

function itemOr404(id: number): BuilderItem {
  const item = state().items[String(id)];
  if (!item) throw notFound("Content not found");
  return item;
}

function patchItem(id: number, fields: Record<string, unknown>, title?: string): BuilderItem {
  itemOr404(id);
  return mutate((s) => {
    const current = s.items[String(id)];
    const next: BuilderItem = {
      ...current,
      title: title ?? current.title,
      fields: { ...current.fields, ...fields },
      updated_at: nowIso(),
    };
    s.items[String(id)] = next;
    return next;
  });
}

/** The response every article/quiz/coding/... endpoint returns for one item. */
function itemResponse(item: BuilderItem) {
  return {
    id: item.id,
    title: item.title,
    difficulty_level: item.difficulty_level,
    ...item.fields,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/**
 * Attach a content object to a submodule.
 *
 * `content_id` is what the row points at. The legacy builder sends it under one
 * of five type-specific keys (`article_content`, `quiz_content`, ...) as well as
 * the generic one, so all six are accepted rather than only the generic one that
 * happened to be in the sample payload.
 */
function attachContent(submoduleId: number, body: Record<string, unknown>): BuilderContent {
  if (!builderSubmodule(submoduleId)) throw notFound("Submodule not found");
  const type = String(body.content_type ?? "Article") as ContentType;
  const contentId = Number(
    body.content_id ??
      body.article_content ??
      body.quiz_content ??
      body.video_content ??
      body.assignment_content ??
      body.coding_problem_content ??
      0,
  );
  const existing = builderContents(submoduleId);
  const row: BuilderContent = {
    id: newId(),
    submodule: submoduleId,
    title: String(body.title ?? "").trim() || "Untitled item",
    content_type: type,
    content_id: contentId || newId(),
    order: Number(body.order ?? existing.length + 1),
    duration_in_minutes: Number(body.duration_in_minutes ?? MINUTES_OF_TYPE[type] ?? 10),
    marks: Number(body.marks ?? MARKS_OF_TYPE[type] ?? 10),
  };
  mutate((s) => s.contents.push(row));
  return row;
}

/* ────────────────────────────────────────────────── learner-facing shapes */

/** Items the visitor finished, shared with the adaptive lesson routes. */
function completedIds(): number[] {
  return overlay.get<number[]>("adaptive:completed", []);
}

function contentStatus(content: BuilderContent): "complete" | "non-complete" {
  const seeded = resolveSeedContent(content.content_id);
  if (seeded && seeded.topic.progress === 100) return "complete";
  return completedIds().includes(content.content_id) ? "complete" : "non-complete";
}

function learnerContentItem(content: BuilderContent) {
  const status = contentStatus(content);
  return {
    id: content.id,
    title: content.title,
    content_type: content.content_type,
    order: content.order,
    duration_in_minutes: content.duration_in_minutes,
    marks: content.marks,
    status,
    // Null rather than 0 for untouched work: the lesson header prints "not yet
    // attempted" for null and "0 / 20" for zero, and those are different claims.
    submissions: status === "complete" ? 1 : null,
    obtainedMarks: status === "complete" ? content.marks : null,
  };
}

/* ─────────────────────────────────────────────── comments and submissions */

interface LessonComment {
  id: number;
  text: string;
  created_at: string;
  user_profile: {
    id: number;
    user_name: string;
    profile_pic_url: string;
  };
}

/**
 * Seeded discussion under a lesson.
 *
 * Two exchanges rather than a wall of chatter: enough that the tab is clearly
 * alive, few enough that a prospect reads them. Both come from the shared cast,
 * so the student asking here is the same student on the roster.
 */
function seededComments(contentId: number): LessonComment[] {
  const asker = STUDENTS[contentId % STUDENTS.length];
  return [
    {
      id: contentId * 10 + 1,
      text: "I read this twice and the second pass was the one that landed. The worked example about halfway down is the part worth copying into your own notes.",
      created_at: isoDaysAgo(seededInt(`cmt:a:${contentId}`, 3, 20), 20, 15),
      user_profile: {
        id: asker.id,
        user_name: asker.full_name,
        profile_pic_url: asker.profile_pic_url,
      },
    },
    {
      id: contentId * 10 + 2,
      text: "If you are stuck at the last step, read the paragraph above it again and then attempt the practice set. Bring it to the next doubt session if it still does not sit.",
      created_at: isoDaysAgo(seededInt(`cmt:b:${contentId}`, 1, 6), 9, 40),
      user_profile: {
        id: INSTRUCTOR_PERSONA.id,
        user_name: INSTRUCTOR_PERSONA.full_name,
        profile_pic_url: INSTRUCTOR_PERSONA.profile_pic_url,
      },
    },
  ];
}

function commentsFor(contentId: number): LessonComment[] {
  const mine = overlay.get<LessonComment[]>(`lesson:comments:${contentId}`, []);
  return [...seededComments(contentId), ...mine];
}

/**
 * Past attempts at a quiz.
 *
 * Only for content the seed says is finished: inventing a submission history for
 * a lesson the learner has not opened is the kind of detail that reads as fake
 * the moment someone checks it against the progress bar.
 */
function pastSubmissions(content: BuilderContent) {
  if (content.content_type !== "Quiz" || contentStatus(content) !== "complete") return [];
  const total = content.marks;
  const first = Math.round(total * (seededInt(`sub:a:${content.id}`, 45, 70) / 100));
  const second = Math.round(total * (seededInt(`sub:b:${content.id}`, 75, 100) / 100));
  return [
    {
      id: content.id * 100 + 2,
      obtained_marks: second,
      maximum_marks: total,
      result: "passed",
      created_at: isoDaysAgo(seededInt(`subd:b:${content.id}`, 1, 8), 18, 20),
    },
    {
      id: content.id * 100 + 1,
      obtained_marks: first,
      maximum_marks: total,
      result: first >= total * 0.6 ? "passed" : "failed",
      created_at: isoDaysAgo(seededInt(`subd:a:${content.id}`, 9, 30), 21, 5),
    },
  ];
}

/** One attempt, expanded into the response sheet the review screen renders. */
function submissionDetail(content: BuilderContent, submissionId: number) {
  const rows = pastSubmissions(content);
  const row = rows.find((r) => r.id === submissionId);
  if (!row) throw notFound("Submission not found");

  const details = contentDetails(content) as { mcqs?: ReturnType<typeof publicMcq>[] };
  const mcqs = details.mcqs ?? [];
  const correctCount = mcqs.length
    ? Math.round((row.obtained_marks / Math.max(1, row.maximum_marks)) * mcqs.length)
    : 0;

  return {
    ...row,
    questions: mcqs.map((q, i) => {
      const isCorrect = i < correctCount;
      const wrong = q.options.findIndex((_, oi) => String.fromCharCode(65 + oi) !== q.correct_option);
      return {
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        selected_option: isCorrect
          ? q.correct_option
          : String.fromCharCode(65 + Math.max(0, wrong)),
        is_correct: isCorrect,
        explanation: q.explanation,
      };
    }),
  };
}

/* ──────────────────────────────────────────────────── the verified library */

/**
 * Every MCQ in the demo, flattened, for the bank picker.
 *
 * `QUIZ_BANK` is authored per course and a course may legitimately have no bank
 * yet, so both levels are read defensively: a missing entry costs the picker
 * some rows, an exception would take the whole authoring dialog down.
 */
function mcqBank() {
  return Object.entries(QUIZ_BANK ?? {}).flatMap(([courseId, questions]) =>
    (questions ?? []).map((q) => ({
      id: q.id,
      question_text: q.question,
      options: {
        a: q.options[0]?.label ?? "",
        b: q.options[1]?.label ?? "",
        c: q.options[2]?.label ?? "",
        d: q.options[3]?.label ?? "",
      },
      correct_option: q.correct,
      explanation: q.explanation,
      difficulty_level: q.difficulty,
      topic: q.skill,
      skills: [q.skill],
      course_id: Number(courseId),
    })),
  );
}

/**
 * The coding library, which is EMPTY for this tenant, by decision.
 *
 * There is no code judge in this product line, and no course in the catalogue
 * declares a coding topic: a coding card on a tailoring or a police recruitment
 * course is the single most obvious way to reveal that the content was ported
 * from a software LMS. `db/coding-bank.ts` still holds runnable problems because
 * the assessment module's question picker imports them, but nothing in the
 * course builder may offer them, so this returns nothing rather than reading it.
 *
 * The function stays (instead of the callers dropping the concept) because the
 * bank endpoint, the suggestions rail and the service types all still speak
 * `kind: "coding"`. An empty list with an explanation is an honest answer to a
 * question the UI is allowed to ask; a 404 would read as a broken feature.
 */
function codingBank(): Array<{
  id: number;
  title: string;
  problem_statement: string;
  difficulty_level: string;
  topic: string;
  skills: string[];
  test_cases: number;
}> {
  return [];
}

/** Said in one place, so the bank, the rail and the attach route cannot drift. */
const NO_CODE_JUDGE =
  "This instance does not run a code judge, so coding practice is not part of any course here. " +
  "Use an assignment for work an aspirant submits, or a quiz for recall and reasoning.";

/* ─────────────────────────────────────────────────── adaptive builder tree */

/**
 * The adaptive builder's course detail.
 *
 * Exported because `details.ts` owns the route: it used to read the seed
 * directly, which meant a module added here never appeared in the tree the admin
 * was looking at. Both now go through this one projection.
 */
export function adminAdaptiveCourseDetail(courseId: number) {
  const course = builderCourse(courseId);
  if (!course) throw notFound("Course not found");
  const modules = builderModules(courseId);
  let order = 0;

  const tree = modules.map((m) => ({
    id: m.id,
    weekno: m.weekno,
    title: m.title,
    description: m.description,
    submodules: builderSubmodules(m.id).map((sm) => ({
      id: sm.id,
      order: ++order,
      title: sm.title,
      description: sm.description,
      ...adaptiveContentOf(sm.id),
    })),
  }));

  const counts = adaptiveCounts(courseId);
  const seeded = courseById(courseId);

  return {
    ...adaptiveListItem(course),
    modules: tree,
    skills: (seeded ? seeded.tags : course.tags).map((skill) => ({
      skill,
      question_count: seededInt(`sk:q:${courseId}:${skill}`, 6, 40),
      article_count: seededInt(`sk:a:${courseId}:${skill}`, 2, 12),
    })),
    content_health: {
      submodules_total: counts.submodules,
      expected_content_types: ["article", "quiz"],
      missing: {},
      total_missing: 0,
      needs_regeneration: false,
      last_job: null,
    },
    // The cohort REGISTRY lives with the admin and instructor handlers; only the
    // id is load-bearing here (the detail page links it), so the label is derived
    // from the course rather than copied, which is how the two drifted before.
    assigned_cohorts: seeded ? [{ id: 11, name: `${shortCourseName(course.title)} batch` }] : [],
    enrollment_summary: {
      total: course.enrolled_count,
      by_source: {
        self: Math.round(course.enrolled_count * 0.6),
        admin: Math.round(course.enrolled_count * 0.4),
      },
    },
    certificate_enabled: course.certificate_available,
    certificate_threshold: seeded ? seeded.certificateThreshold : 70,
    created_by: INSTRUCTOR_PERSONA.full_name,
    review_status: "approved",
    review_note: "",
  };
}

function adaptiveCounts(courseId: number) {
  const modules = builderModules(courseId);
  const submodules = modules.flatMap((m) => builderSubmodules(m.id));
  const contents = submodules.flatMap((sm) => builderContents(sm.id));
  const of = (type: ContentType) => contents.filter((c) => c.content_type === type).length;
  return {
    modules: modules.length,
    submodules: submodules.length,
    quiz: of("Quiz"),
    article: of("Article"),
    coding: of("CodingProblem"),
    video: of("VideoTutorial"),
  };
}

/** The list row the adaptive course library renders. */
export function adaptiveListItem(course: BuilderCourse) {
  const counts = adaptiveCounts(course.id);
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    target_audience: course.target_audience,
    duration_weeks: course.duration_weeks,
    difficulty_levels: [course.difficulty_level],
    is_published: course.published,
    auto_enroll: course.auto_enroll,
    self_enroll_enabled: course.self_enroll_enabled,
    is_paid: course.is_paid,
    price: course.price,
    currency: course.currency,
    content_locked: course.content_locked,
    allow_clipboard: course.allow_clipboard,
    instructor_review_status: "" as const,
    instructor_review_note: "",
    authored_by: null,
    module_count: counts.modules,
    submodule_count: counts.submodules,
    // These four are summed across the library for the header stat tiles, so an
    // absent key would make the whole row read NaN rather than just this course.
    quiz_count: counts.quiz,
    article_count: counts.article,
    coding_count: counts.coding,
    video_count: counts.video,
    header_image_url: course.thumbnail,
    card_image_url: course.thumbnail,
    header_image_hidden: false,
    card_image_hidden: false,
    enrolled_count: course.enrolled_count,
    created_by: INSTRUCTOR_PERSONA.full_name,
    review_status: "approved",
    created_at: course.created_at,
    updated_at: course.updated_at,
  };
}

/** Every adaptive course row, for the admin library list. */
export function adaptiveCourseList() {
  return builderCourses().map(adaptiveListItem);
}

/** Legacy admin course list rows, for the certificates and instructor pages. */
export function legacyAdminCourseList() {
  return builderCourses().map(adminCourseRow);
}

const READING_TIERS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

/** The five content buckets one submodule shows in the adaptive builder. */
function adaptiveContentOf(submoduleId: number) {
  const contents = builderContents(submoduleId);
  const topic = SEED_TOPIC.get(submoduleId);

  const articles = contents
    .filter((c) => c.content_type === "Article")
    .map((c) => ({
      article_id: c.content_id,
      title: c.title,
      default_tier: "Intermediate" as const,
      available_tiers: [...READING_TIERS],
      reading_time_minutes: c.duration_in_minutes,
      concepts: topic ? conceptsFor(topic) : [],
      is_active: true,
    }));

  const quizzes = contents
    .filter((c) => c.content_type === "Quiz")
    .map((c) => {
      const details = contentDetails(c) as { mcqs?: unknown[]; questions?: unknown[] };
      const count = (details.mcqs ?? details.questions ?? []).length;
      return {
        config_id: c.content_id,
        title: c.title,
        quiz_title: c.title,
        target_skills: topic ? conceptsFor(topic) : [],
        mcq_count: count,
        min_questions: Math.min(6, count),
        max_questions: Math.max(6, count),
        is_active: true,
      };
    });

  const coding_sets = contents
    .filter((c) => c.content_type === "CodingProblem")
    .map((c) => {
      const details = contentDetails(c) as { title?: string; difficulty_level?: string };
      return {
        config_id: c.content_id,
        title: c.title,
        target_skills: topic ? conceptsFor(topic) : [],
        default_language: "python",
        hint_layers: 3,
        is_active: true,
        allow_clipboard: true,
        problems: [
          {
            problem_id: c.content_id,
            title: details.title ?? c.title,
            difficulty_level: (details.difficulty_level ?? "Easy") as "Easy" | "Medium" | "Hard",
            target_skills: topic ? conceptsFor(topic) : [],
            is_active: true,
          },
        ],
      };
    });

  const video_companions = contents
    .filter((c) => c.content_type === "VideoTutorial")
    .map((c) => ({
      id: c.content_id,
      title: c.title,
      video_title: c.title,
      thumbnail_url: "",
      duration_seconds: c.duration_in_minutes * 60,
      check_in_count: 0,
      is_active: true,
    }));

  const attachments = contents.flatMap((c) =>
    attachmentsOfContent(c.id).map((a) => ({
      id: a.id,
      title: a.title,
      kind: a.file_type,
      extension: (a.original_filename.match(/\.[^.]+$/)?.[0] ?? "").replace(".", ""),
      original_name: a.original_filename,
      size_bytes: a.file_size,
      is_active: true,
      url: a.file_url,
    })),
  );

  return { articles, quizzes, coding_sets, video_companions, attachments };
}

/**
 * Which content bucket an adaptive id belongs to.
 *
 * The adaptive routes address content by the OBJECT id (`article_id`,
 * `config_id`), not by the row id, so deleting one means finding the row that
 * points at it.
 */
function contentRowByObjectId(submoduleId: number, objectId: number): BuilderContent | undefined {
  return builderContents(submoduleId).find((c) => c.content_id === objectId || c.id === objectId);
}

/* ─────────────────────────────────────────────────── the course generator */

/**
 * The generator plans from a BLUEPRINT, not from a language model.
 *
 * A programme officer types "a 6 week course for TGPSC Group-II aspirants on the
 * Telangana movement and state formation" or "a 40 hour rooftop solar installer
 * course for an ITI batch in Warangal", and watches weeks, topics, lessons and
 * quizzes assemble. The weeks it produces have to be the ones a subject faculty
 * member would have written, because the officer reading the screen sets these
 * syllabi for a living and a plausible-sounding outline is worse than none.
 *
 * So each track below is a real course spine for one family of work the mission
 * runs, and the brief is matched to a track by its own words. Nothing is
 * invented at request time: the outline is chosen, sliced to the weeks asked
 * for, and then filled from the same authored article renderer and verified
 * question bank the seeded catalogue uses.
 *
 * No track emits a coding exercise, and there is no branch that could. This
 * product line has no code judge (see `codingBank`), and a coding card on a
 * tailoring or a police recruitment course is the single most obvious way to
 * reveal that the catalogue was ported from a software LMS. `content_types` in
 * the request is therefore narrowed to article and quiz before anything is
 * built, and the job reports honestly that it did so.
 */
interface TrackWeek {
  title: string;
  summary: string;
  topics: string[];
}

interface Track {
  id: string;
  label: string;
  /** Lower-case fragments that put a brief on this track. Longest match wins. */
  match: string[];
  /**
   * Catalogue courses whose verified question banks this track draws from.
   * Read as `QUIZ_BANK[id] ?? []`, never by index, so a course whose bank is
   * still being authored costs the generated quiz some questions and nothing
   * else.
   */
  bankCourses: number[];
  audience: string;
  skills: string[];
  outcomes: string[];
  weeks: TrackWeek[];
}

const TRACKS: Track[] = [
  {
    id: "state-recruitment",
    label: "State, central and PSU recruitment",
    match: [
      "tgpsc", "group-i", "group i", "group-ii", "group ii", "group-iii", "group iii",
      "ssc", "cgl", "chsl", "rrb", "ntpc", "railway", "police", "constable",
      "tglprb", "psu", "gate", "general studies", "telangana movement", "polity",
      "prelims", "mains", "civil services", "state service", "recruitment exam",
    ],
    bankCourses: [301, 302, 303, 304, 305, 306],
    audience:
      "Aspirants preparing for state, central, railway or public undertaking recruitment, most of them working or studying alongside",
    skills: [
      "Telangana Movement",
      "Indian Polity",
      "Telangana Geography",
      "General Science",
      "Current Affairs",
      "Mains Answer Writing",
      "Sectional Time Management",
    ],
    outcomes: [
      "State the chain from the safeguards, through the agitation, to Article 371-D in five sentences.",
      "Answer a polity question by naming the provision it turns on rather than describing it.",
      "Keep current affairs by syllabus heading, so a month of reading is revised in ten minutes.",
      "Write a fifteen mark answer to the instruction word, in the time the paper allows.",
      "Sit a full length paper to the clock and work through the error log afterwards.",
    ],
    weeks: [
      {
        title: "Telangana movement and state formation",
        summary: "The sequence, and the constitutional consequence the general studies paper asks about.",
        topics: [
          "The safeguards agreed at states reorganisation, and what non-implementation meant",
          "The 1969 agitation: what triggered it, what it demanded, what was conceded",
          "Article 371-D, the Presidential order and the local cadre rules that follow from it",
          "The later phase and the reorganisation Act: reading it as a sequence, not a date list",
        ],
      },
      {
        title: "Indian polity and the Constitution",
        summary: "The provisions a recruitment paper returns to, learnt by what they enable.",
        topics: [
          "Fundamental rights, duties and the directive principles",
          "Parliament, the state legislature, and the money bill distinction",
          "The amendment procedure, and how a paper asks about it",
          "Centre-State relations, the finance commission and the governor's role",
        ],
      },
      {
        title: "Telangana geography and the district profile",
        summary: "Rivers, projects, soils and minerals, in the form a question needs them.",
        topics: [
          "River basins and the major irrigation projects",
          "Soils, rainfall and the cropping pattern that sits on them",
          "Minerals, power and the industry of the state",
          "Reading a district profile the way a question asks for it",
        ],
      },
      {
        title: "History for the general studies paper",
        summary: "The Deccan, the national movement, and the parts a state paper weights.",
        topics: [
          "The Kakatiya period, and what survives of it on the ground",
          "Qutb Shahi and Asaf Jahi rule in the Deccan",
          "The national movement, with the Telangana chapters in place",
          "Art, architecture and culture, asked as one mark and answered as one line",
        ],
      },
      {
        title: "Economy and development",
        summary: "Budget vocabulary and state schemes, written about without quoting a figure.",
        topics: [
          "Revenue, capital, deficit and devolution: the words a question uses",
          "Agriculture, allied sectors and the rural economy",
          "Writing about a scheme by what it does, not by what it disburses",
          "Human development indicators, and what a comparison is for",
        ],
      },
      {
        title: "General science and the environment",
        summary: "Everyday science at the level a recruitment paper actually sets.",
        topics: [
          "Physics and chemistry as they turn up in daily life",
          "Human biology, nutrition and public health",
          "Environment, biodiversity and disaster management",
          "Science and technology in the news, filed under a heading",
        ],
      },
      {
        title: "Current affairs, kept by syllabus heading",
        summary: "One page per heading, so the reading is searchable a month later.",
        topics: [
          "Building the heading pages, and retiring the dated diary",
          "Reading a government release against the newspaper report of it",
          "The state pages: administration, appointments and schemes",
          "A monthly consolidation that takes one sitting",
        ],
      },
      {
        title: "Paper craft and full length practice",
        summary: "The marks that are lost after the material is known.",
        topics: [
          "Sectional time, attempt order, and when to leave a question standing",
          "Negative marking: when a guess pays for itself and when it only costs time",
          "Answer writing at fifteen marks, then cutting it by a third",
          "The error log: sorting every lost mark into never studied, could not recall, knew it and marked wrong",
        ],
      },
    ],
  },
  {
    id: "banking",
    label: "Banking and financial sector recruitment",
    match: [
      "ibps", "sbi", "rbi", "nabard", "banking", "bank po", "clerk", "grade-b",
      "grade b", "financial sector", "quantitative aptitude", "data interpretation",
      "reasoning ability", "banking awareness",
    ],
    bankCourses: [307, 308, 309, 310],
    audience:
      "Candidates preparing for banking and financial sector recruitment, sitting sectionally timed prelims",
    skills: [
      "Quantitative Aptitude",
      "Reasoning",
      "Data Interpretation",
      "English",
      "Banking Awareness",
      "Indian Economy",
      "Sectional Time Management",
    ],
    outcomes: [
      "Spend a section's minutes on the questions that will actually fall.",
      "Clear the single-question reasoning block before opening a puzzle set.",
      "Read a table or a caselet without recomputing all of it.",
      "Use the banking vocabulary a branch counter uses, in the right place.",
      "Sit a full mock, then account for every mark lost.",
    ],
    weeks: [
      {
        title: "The pattern, and what prelims actually rewards",
        summary: "Sectional timing changes the strategy, not only the schedule.",
        topics: [
          "Sectional timing, and where twenty minutes really go",
          "Attempt order: what to clear before anything hard",
          "Accuracy against attempts, measured on your own mocks",
          "Reading the notification for the pattern you are actually sitting",
        ],
      },
      {
        title: "Quantitative aptitude: the arithmetic that repeats",
        summary: "The small set of sums these papers set again and again.",
        topics: [
          "Percentage, ratio and averages without long division",
          "Time, work, speed and distance in one method",
          "Profit, loss, simple and compound interest",
          "Approximation and simplification, done in the head",
        ],
      },
      {
        title: "Data interpretation",
        summary: "Reading a set for the one number the question asked for.",
        topics: [
          "Tables: reading down a column instead of recomputing the grid",
          "Bar, line and pie sets, and when an approximation is enough",
          "Caselets, and turning prose into three numbers",
          "Missing-data sets and the order to fill them in",
        ],
      },
      {
        title: "Reasoning: the single questions first",
        summary: "Clear the block with no set-up cost, then choose a puzzle you can start.",
        topics: [
          "Inequality, syllogism and coding-decoding",
          "Direction sense, blood relations and alphanumeric series",
          "Puzzles and seating arrangement: reading the conditions once and deciding",
          "The rule about not starting a new set late in the section",
        ],
      },
      {
        title: "English for the banking papers",
        summary: "Grammar and comprehension, under a clock rather than at leisure.",
        topics: [
          "Error spotting, and the grammar it keeps testing",
          "Cloze, fillers and para jumbles",
          "Reading comprehension: the question before the passage",
          "Vocabulary in context, not as a word list",
        ],
      },
      {
        title: "Banking awareness and the economy",
        summary: "What the institutions do, in the words the paper uses.",
        topics: [
          "Regulators, and what each one is actually responsible for",
          "Products at a branch counter, explained to a customer",
          "Monetary policy vocabulary that recurs every cycle",
          "Financial inclusion, and the accounts and insurance behind it",
        ],
      },
      {
        title: "Mains: the descriptive and data-heavy papers",
        summary: "Longer sets, and writing to a word count.",
        topics: [
          "Letter and essay, to a word count and a time limit",
          "Data analysis and interpretation at mains level",
          "General, banking and financial awareness for mains",
          "Reading a passage for an argument rather than for facts",
        ],
      },
      {
        title: "The interview and the last month",
        summary: "Revision that returns on a date, and answers you can defend.",
        topics: [
          "Your own bio-data, defended in front of a panel",
          "Revision scheduled on a date, not on a feeling of unease",
          "Full length mocks and the error log",
          "The week before: what to stop doing",
        ],
      },
    ],
  },
  {
    id: "solar",
    label: "Solar PV installation",
    match: [
      "solar", "rooftop", "photovoltaic", "pv installer", "solar pv", "inverter",
      "net metering", "renewable",
    ],
    bankCourses: [311],
    audience:
      "Trainees at a district skill centre, and ITI students taking rooftop solar as an add-on trade",
    skills: [
      "Solar PV",
      "Rooftop",
      "Installation",
      "Electrical Safety",
      "Earthing",
      "Net Metering",
    ],
    outcomes: [
      "Read a roof before quoting for it: shade, orientation, condition and cable route.",
      "Size a string against the inverter's MPPT window, including the cold morning case.",
      "Mount, route, terminate and commission without a return visit.",
      "Take the net metering file to the section office complete the first time.",
      "Diagnose a noon trip from the event log and one pair of measurements.",
    ],
    weeks: [
      {
        title: "The trade, the site and safety",
        summary: "What the work is, and the practices that keep an installer alive.",
        topics: [
          "What a rooftop installer is responsible for, start to finish",
          "Working at height: anchors, ladders and the checks before you climb",
          "Electrical safety on a live roof, and isolating before you touch",
          "Reading a roof: shade through the day, orientation, condition, cable route",
        ],
      },
      {
        title: "Modules and the DC side",
        summary: "How a module behaves, and what its label is telling you.",
        topics: [
          "How a module makes current, and what the nameplate means",
          "Series and parallel: string voltage against string current",
          "Cold mornings, open circuit voltage, and why a string can be too long",
          "Shading and bypass diodes: one shaded cell and the whole string",
        ],
      },
      {
        title: "Inverters and matching",
        summary: "The match between array and inverter is where most designs go wrong.",
        topics: [
          "MPPT windows, and sizing a string to sit inside one",
          "String, micro and hybrid inverters, and where each belongs",
          "Derating: heat, clearance, and where an inverter must not be mounted",
          "Reading an inverter datasheet for the four numbers that matter",
        ],
      },
      {
        title: "Mounting and cabling",
        summary: "The physical work, done so the roof stays sound.",
        topics: [
          "Structures and fixings, and penetrating a roof without leaking it",
          "DC cable, connectors and the runs that cause trouble later",
          "AC cable sizing, and the voltage rise that trips an inverter at noon",
          "Earthing, bonding and surge protection on a rooftop array",
        ],
      },
      {
        title: "Protection and commissioning",
        summary: "The checks, in the order they are done, and the handover.",
        topics: [
          "Isolators, fuses and the DC combiner",
          "Commissioning: insulation, polarity, string voltage and current",
          "First start, and reading what the inverter reports back",
          "The handover: labels, readings, and what the owner is told",
        ],
      },
      {
        title: "Net metering and the paperwork",
        summary: "The application, and why it asks what it asks.",
        topics: [
          "Sanctioned load, and why the application asks for it first",
          "The bidirectional meter, and how export is recorded",
          "The application file: documents, drawings and who signs",
          "Inspection and the connection agreement",
        ],
      },
      {
        title: "Faults and service",
        summary: "Diagnosis by measurement rather than by replacing parts.",
        topics: [
          "Reading the inverter event log before guessing at a cause",
          "AC over-voltage at noon: the two readings that prove where the rise is",
          "Low generation: shade, soiling, a failed string or a failed sensor",
          "The service visit, and the record you leave behind",
        ],
      },
      {
        title: "Working as an installer",
        summary: "Quoting, records and the assessment.",
        topics: [
          "Quoting a job: material, labour, travel and the margin",
          "Warranties, records and the annual service call",
          "Working with an EPC firm, and what a subcontract expects",
          "The practical tasks you are assessed on at the centre",
        ],
      },
    ],
  },
  {
    id: "electrical",
    label: "Electrician and domestic wiring",
    match: [
      "electrician", "wiring", "house wiring", "domestic wiring", "iti electrician",
      "motor control", "earthing", "elcb", "mcb", "starter",
    ],
    bankCourses: [312],
    audience:
      "ITI students and skill centre trainees taking the electrician trade, and working wiremen upgrading",
    skills: [
      "Domestic Wiring",
      "Electrical Safety",
      "Earthing",
      "Motor Control",
      "Diagnostics",
      "Installation",
    ],
    outcomes: [
      "Isolate, prove dead, and work to the practices that prevent an injury.",
      "Size a cable and select protection for a circuit, and say why.",
      "Measure an earth and explain what a bad reading means.",
      "Narrow a fault by measurement instead of by replacing parts in turn.",
      "Test a wiring job before handover, and keep the readings.",
    ],
    weeks: [
      {
        title: "Safety, and the practices that hold under pressure",
        summary: "The habits that separate a tradesman from a casualty.",
        topics: [
          "Isolation, and prove, test, prove",
          "What actually injures people: shock, burn and arc",
          "Tools, ladders and personal protective equipment",
          "First response at the board when something has gone wrong",
        ],
      },
      {
        title: "The basics, measured rather than recited",
        summary: "Voltage, current and power on a circuit in front of you.",
        topics: [
          "Voltage, current, resistance and power on a real circuit",
          "Using a multimeter and a clamp meter properly",
          "Single phase and three phase, in a house and in a shop",
          "Load, diversity and what a connection is rated for",
        ],
      },
      {
        title: "Domestic wiring",
        summary: "Laying out a house, circuit by circuit.",
        topics: [
          "Reading and drawing a house wiring layout",
          "Cable sizing and derating for the run it will take",
          "Switches, sockets and the board that feeds them",
          "Conduit, casing and the workmanship an inspection looks for",
        ],
      },
      {
        title: "Protection",
        summary: "What each device is for, and what a higher rating really buys.",
        topics: [
          "MCB, RCCB and the difference an earth leakage device makes",
          "Selecting a device for a circuit, and defending the choice",
          "Discrimination: which device should trip first",
          "Nuisance tripping, and why raising the rating is not a repair",
        ],
      },
      {
        title: "Earthing",
        summary: "The part of the installation nobody sees and everybody depends on.",
        topics: [
          "Electrodes, conductors, and what an earth is actually for",
          "Measuring earth resistance, and what a bad reading means",
          "Bonding: the metal that must be tied together",
          "Maintaining an earth pit that has been in the ground for years",
        ],
      },
      {
        title: "Motors and control",
        summary: "The pump, the mill and the machine that has to restart safely.",
        topics: [
          "Single phase motors, capacitors and the pump on a farm",
          "Starters, contactors and overload relays",
          "Single phase preventers, and protecting a motor from a lost phase",
          "Wiring a control circuit from a simple schematic",
        ],
      },
      {
        title: "Fault finding",
        summary: "A method, so the answer does not depend on luck.",
        topics: [
          "Listening to the customer before deciding what happened",
          "Narrowing a fault by measurement, not by swapping parts",
          "The fault that only appears with two loads on together",
          "The intermittent fault, and how to trap it",
        ],
      },
      {
        title: "The job and the record",
        summary: "Estimating, testing and handing over.",
        topics: [
          "Estimating a wiring job room by room",
          "Testing before handover, and the readings you keep",
          "Quoting, invoicing and the customer who asks for a change midway",
          "The practical tasks you are assessed on at the centre",
        ],
      },
    ],
  },
  {
    id: "tailoring",
    label: "Tailoring and garment making",
    match: [
      "tailoring", "tailor", "garment", "stitching", "sewing", "boutique",
      "blouse", "apparel", "pattern drafting", "dress making",
    ],
    bankCourses: [313],
    audience:
      "Women and men training at a district skill centre to stitch from home or to join a garment unit",
    skills: [
      "Tailoring",
      "Pattern Drafting",
      "Garment Making",
      "Costing",
      "Boutique",
    ],
    outcomes: [
      "Set a machine up and correct the faults that come from tension and needle choice.",
      "Take a measurement set and draft a pattern that repeats.",
      "Assemble, line and finish a garment in an order that saves an hour.",
      "Price by the work rather than by the customer, from a cost sheet.",
      "Run an order book with delivery dates you can keep.",
    ],
    weeks: [
      {
        title: "The machine, the tools and the workspace",
        summary: "Everything that decides whether the day goes well before you start.",
        topics: [
          "Setting up a machine, and the faults that come from tension",
          "Needles, threads and the fabric each one suits",
          "Measuring a customer, and writing the measurements down",
          "Laying out a workspace so nothing is hunted for",
        ],
      },
      {
        title: "Fabric and cutting",
        summary: "What a fabric will do later, decided while it is still flat.",
        topics: [
          "Grain, shrinkage and what a fabric does after the first wash",
          "Marking and cutting for the least wastage",
          "Interlining, canvas and lining, and what each is for",
          "Cutting for a repeat order rather than a single piece",
        ],
      },
      {
        title: "Pattern drafting",
        summary: "Turning a measurement set into paper that can be reused.",
        topics: [
          "From measurements to a paper pattern",
          "Drafting a blouse, and the alterations that repeat",
          "Sleeves, necklines and the variations customers ask for",
          "Grading a pattern up and down a size",
        ],
      },
      {
        title: "Stitching and assembly",
        summary: "The order of work, and the finishing that decides the price.",
        topics: [
          "Seams, hems and the finishes that hold",
          "Assembly order, and why it saves an hour a piece",
          "Linings, facings and turning a garment cleanly",
          "Hooks, zips, piping and the fastenings that fail first",
        ],
      },
      {
        title: "Fitting and alteration",
        summary: "The trial fitting, and the alterations worth taking on.",
        topics: [
          "The trial fitting, and what to look at first",
          "Common alterations, and the ones to refuse",
          "Fitting a garment on a customer who cannot come twice",
          "Pressing and final finishing before it goes back",
        ],
      },
      {
        title: "Costing and pricing",
        summary: "The sheet that ends the argument about price.",
        topics: [
          "A cost sheet for one piece: material, labour and overhead",
          "Timing yourself with a clock, twice, before setting a rate",
          "Pricing the design and not the person",
          "Redoing the sheet when material rates move",
        ],
      },
      {
        title: "Running a boutique",
        summary: "The book, the dates and the customer who comes back.",
        topics: [
          "The order book, delivery dates and what to promise",
          "Samples, photographs and showing your work",
          "Stock and wastage: what to keep on hand and what not to",
          "Taking on help, and paying by piece or by day",
        ],
      },
      {
        title: "Selling beyond the mandal",
        summary: "Reaching buyers who will never walk past your door.",
        topics: [
          "Photographing a piece so that it sells",
          "Taking orders on a phone without losing them",
          "Packing and dispatch, and what a return costs you",
          "The practical tasks you are assessed on at the centre",
        ],
      },
    ],
  },
  {
    id: "digital-services",
    label: "Digital literacy and common service centre operation",
    match: [
      "digital literacy", "common service", "csc", "digital seva", "aeps", "upi",
      "citizen service", "computer basics", "counter operator", "e-governance",
      "mobile repair", "electronics repair",
    ],
    bankCourses: [315, 314],
    audience:
      "Trainees who will run a service counter in their own mandal, starting from a phone rather than a computer",
    skills: [
      "Digital Literacy",
      "Common Service Centre",
      "UPI",
      "AePS",
      "Citizen Services",
      "Service Counter",
    ],
    outcomes: [
      "Find, name and keep a file, and explain where a saved document has gone.",
      "Fill an online form and upload a document at the size it asks for.",
      "Take a payment, and explain a failed transaction to the person in front of you.",
      "Take an application in, give a receipt, and follow it up.",
      "Close the day's counter with records that reconcile.",
    ],
    weeks: [
      {
        title: "Getting comfortable with the machine",
        summary: "The first week decides whether a trainee comes back for the second.",
        topics: [
          "Files, folders, and where the thing you saved has gone",
          "Typing, and the practice that makes it fast enough to work",
          "Keeping a device and an account safe",
          "Printing, scanning and the settings that matter",
        ],
      },
      {
        title: "The internet, used carefully",
        summary: "Enough to work with, and enough not to be defrauded.",
        topics: [
          "A browser, a search, and reading the address bar",
          "Email and attachments, sent and received",
          "Spotting a fraudulent message before it costs somebody money",
          "Downloads, updates and what not to install",
        ],
      },
      {
        title: "Documents and forms",
        summary: "The daily work of a counter.",
        topics: [
          "Writing a letter and an application",
          "Filling an online form without losing the draft",
          "Scanning, resizing and uploading a document",
          "Correcting a submitted application",
        ],
      },
      {
        title: "Money on a phone and at a counter",
        summary: "What each rail does, and where its limits are.",
        topics: [
          "UPI collect and pay, and what a failure actually means",
          "Aadhaar enabled withdrawal and deposit at a counter",
          "Explaining a failed transaction to a customer",
          "Cash handling, receipts and the day's closing",
        ],
      },
      {
        title: "Citizen services",
        summary: "The services people come for, and the documents each one needs.",
        topics: [
          "Certificates and the documents each application needs",
          "Pensions and welfare applications",
          "Taking an application in, and giving a receipt",
          "Following up a pending application without being sent in circles",
        ],
      },
      {
        title: "Running the centre",
        summary: "The counter as a business, and as a public office.",
        topics: [
          "Records, cash and reconciliation",
          "Pricing a service, and what may not be charged for",
          "The queue: order, privacy and the person who cannot read",
          "Complaints, and the record that protects you",
        ],
      },
      {
        title: "Hardware and what breaks",
        summary: "Keeping the counter open on a bad day.",
        topics: [
          "Printer, scanner and biometric device, kept working",
          "Power, backup and the connection dropping mid-transaction",
          "Basic handset and device faults a counter is asked about",
          "When to call for service instead of opening it yourself",
        ],
      },
      {
        title: "Assessment and the trade ahead",
        summary: "What you are marked on, and where this leads.",
        topics: [
          "The practical tasks you are assessed on at the centre",
          "Keeping current as services and portals change",
          "Adding a service line to an existing counter",
          "Where a counter operator goes next",
        ],
      },
    ],
  },
  {
    id: "enterprise",
    label: "Rural enterprise, credit and market linkage",
    match: [
      "enterprise", "entrepreneur", "micro-enterprise", "micro enterprise", "shg",
      "self help", "self-help", "mudra", "subsidy", "udyam", "business plan",
      "fpo", "producer", "ondc", "digital marketing", "market linkage", "credit linkage",
    ],
    bankCourses: [316, 317, 318, 319],
    audience:
      "Self help group members and first time entrepreneurs running a unit in their own mandal",
    skills: [
      "Micro-Enterprise",
      "Business Plan",
      "Break-even",
      "Bookkeeping",
      "SHG Bank Linkage",
      "Project Report",
      "Online Selling",
    ],
    outcomes: [
      "State what you sell, to whom, at what cost, and what happens if half of it sells.",
      "Find the volume at which the unit stops losing money.",
      "Keep a cash book, a ledger and a stock register daily rather than later.",
      "Walk into a branch with books, a resolution and a project report that hold together.",
      "Reach buyers outside the mandal, and cost what that reach takes.",
    ],
    weeks: [
      {
        title: "The idea, tested against a market",
        summary: "Before anything is spent.",
        topics: [
          "What you will sell, to whom, and at what price",
          "Talking to ten customers before buying a machine",
          "Choosing between three ideas on paper",
          "The unit's first month, written down as a plan",
        ],
      },
      {
        title: "Costing and break-even",
        summary: "The arithmetic that decides whether the unit survives a slow month.",
        topics: [
          "Fixed cost, variable cost and contribution",
          "The volume at which the unit stops losing money",
          "Pricing that survives a bad month",
          "Wastage, rework and the costs that hide",
        ],
      },
      {
        title: "Registration and records",
        summary: "The paperwork, done yourself and done early.",
        topics: [
          "Udyam registration, done yourself and without a fee",
          "Licences a unit actually needs, and when",
          "Cash book, ledger and stock register, kept daily",
          "Separating the unit's money from the household's",
        ],
      },
      {
        title: "The project report a bank reads",
        summary: "The document that decides the meeting before it happens.",
        topics: [
          "Costing, cash flow and repayment on one sheet",
          "What a branch looks for, and where files stall",
          "Answering the questions the manager will ask",
          "Revising a report that came back",
        ],
      },
      {
        title: "Credit routes",
        summary: "What each route is for, and what it will not do by itself.",
        topics: [
          "Loan categories, and matching one to the stage you are at",
          "Collateral free lending and the guarantee behind it",
          "Margin money routes, and the sequence they follow",
          "What a registration or a scheme does not by itself get you",
        ],
      },
      {
        title: "Groups and collectives",
        summary: "The books a branch grades, and the forms a collective takes.",
        topics: [
          "Minutes, attendance and the internal lending register",
          "Grading, and the borrowing resolution a branch asks to see",
          "Producer organisations: members, share capital and business plan",
          "Meetings, accounts and audit in a body that answers to its members",
        ],
      },
      {
        title: "Selling and market linkage",
        summary: "Reaching a buyer who is not standing in front of you.",
        topics: [
          "Photographs, listings and pricing that travel",
          "Selling on an open network: catalogue, orders and settlement",
          "Aggregation and grading, so a small quantity gets a better price",
          "Repeat customers, and what they cost to keep",
        ],
      },
      {
        title: "Running it month by month",
        summary: "The review that keeps a unit from drifting.",
        topics: [
          "A monthly review that takes one hour",
          "Working capital, and the month it runs out",
          "Hiring the first person, and paying them",
          "The plan you submit and defend at the end of the course",
        ],
      },
    ],
  },
];

/**
 * The spine used when a brief matches no track.
 *
 * Not filler: this is the shape every skill centre course shares, whatever the
 * trade, because it is the shape the assessment follows. It states what it is,
 * so a programme officer reading it knows the generator did not recognise the
 * subject and is offering the standard spine for a faculty member to name.
 */
const DEFAULT_TRACK: Track = {
  id: "skill-programme",
  label: "General skill programme",
  match: [],
  bankCourses: [],
  audience: "Trainees at a district skill centre taking this trade for the first time",
  skills: ["Trade Knowledge", "Workplace Safety", "Practical Skills", "Assessment Readiness"],
  outcomes: [
    "Describe what the trade does and where the work is.",
    "Work safely with the tools and materials the trade uses.",
    "Complete the trade's standard tasks to the standard they are assessed against.",
    "Keep the records a customer or an employer expects.",
  ],
  weeks: [
    {
      title: "The trade and the workplace",
      summary: "What the work is, who pays for it, and how a day is spent.",
      topics: [
        "What this trade does, and where the work is",
        "Safety, tools and the workplace",
        "The standards this trade is assessed against",
      ],
    },
    {
      title: "Core knowledge",
      summary: "The principles the practical work rests on.",
      topics: [
        "The principles behind the work",
        "Materials, equipment and what each is for",
        "Reading a drawing, a label or a specification",
      ],
    },
    {
      title: "Basic tasks, done correctly",
      summary: "The first tasks, slowly and to the standard.",
      topics: [
        "The first task, step by step",
        "Measuring, marking and checking your own work",
        "Working to a finish rather than to completion",
      ],
    },
    {
      title: "Working to a standard",
      summary: "Speed comes after accuracy, not before it.",
      topics: [
        "The standard task set, timed",
        "Common mistakes, and what causes each one",
        "Checking a piece of work before it leaves your hands",
      ],
    },
    {
      title: "Faults and quality",
      summary: "What goes wrong, and how it is found.",
      topics: [
        "Finding a fault by method rather than by guesswork",
        "Rework, and when a piece cannot be saved",
        "Quality as the customer sees it",
      ],
    },
    {
      title: "Costing, records and the customer",
      summary: "The part of the trade that is not the tools.",
      topics: [
        "Costing a job before quoting for it",
        "Records, receipts and warranties",
        "Talking to a customer about a delay or a fault",
      ],
    },
    {
      title: "Practice under assessment conditions",
      summary: "The tasks you will be marked on, in the conditions they are marked in.",
      topics: [
        "The assessment tasks, attempted in full",
        "Timing, and what a marker is looking for",
        "The gaps that showed up, and how to close them",
      ],
    },
    {
      title: "Employment and what comes next",
      summary: "Where the certificate is used.",
      topics: [
        "Where this trade is hired, and what a first job pays for",
        "Self employment, and what it takes to start",
        "The next certificate, and when to take it",
      ],
    },
  ],
};

/** Pick the track a brief belongs to. Longest total keyword match wins. */
function trackFor(text: string): Track {
  const hay = text.toLowerCase();
  let best: Track | null = null;
  let bestScore = 0;
  for (const track of TRACKS) {
    let score = 0;
    for (const word of track.match) if (hay.includes(word)) score += word.length;
    if (score > bestScore) {
      bestScore = score;
      best = track;
    }
  }
  return best ?? DEFAULT_TRACK;
}

/** One planned topic. `concepts` become the quiz's target skills and the article's. */
interface PlanTopic {
  title: string;
  concepts: string[];
  /** The submodule this topic was built into. Set by `buildPlan`. */
  submoduleId?: number;
}

interface PlanWeek {
  week: number;
  title: string;
  summary: string;
  topics: PlanTopic[];
  /** The module this week was built into. Set by `buildPlan`. */
  moduleId?: number;
}

/**
 * Slice a track's spine to the weeks and topics-per-week that were asked for.
 *
 * Longer than the spine is handled by adding revision and full practice weeks
 * rather than by repeating a week under another name, because a duplicated week
 * is the first thing an officer scrolling the outline notices. Wider than the
 * spine keeps the authored topics and adds one honest practice topic, never a
 * reworded copy of the topic above it.
 */
function planWeeks(track: Track, weeks: number, perWeek: number): PlanWeek[] {
  const wanted = Math.max(1, Math.min(24, weeks));
  const width = Math.max(1, Math.min(6, perWeek));
  const out: PlanWeek[] = [];

  for (let i = 0; i < wanted; i++) {
    const spine = track.weeks[i];
    const title = spine ? spine.title : `Revision and full practice, part ${i - track.weeks.length + 1}`;
    const summary = spine
      ? spine.summary
      : "Returning to the weeks above under the conditions the assessment sets.";
    const authored = spine ? spine.topics : [];
    const topics: string[] = authored.slice(0, width);
    while (topics.length < width) {
      const n = topics.length - authored.length + 1;
      topics.push(
        authored.length === 0
          ? `Practice set ${n} for ${title.toLowerCase()}`
          : `Practice and review for ${title.toLowerCase()}`,
      );
    }
    out.push({
      week: i + 1,
      title,
      summary,
      topics: topics.map((t, j) => ({
        title: t,
        concepts: conceptsForPlanTopic(track, i, j),
      })),
    });
  }
  return out;
}

/** Two or three skills per topic, drawn from the track and stable across reloads. */
function conceptsForPlanTopic(track: Track, weekIndex: number, topicIndex: number): string[] {
  const pool = track.skills.length ? track.skills : DEFAULT_TRACK.skills;
  const first = pool[(weekIndex + topicIndex) % pool.length];
  const second = pool[(weekIndex + topicIndex + 1) % pool.length];
  return first === second ? [first] : [first, second];
}

/* ─────────────────────────────────────────────────────── generation jobs */

interface GenJobSeed {
  jobId: string;
  numericId: number;
  title: string;
  description: string;
  scope: "full_course" | "module" | "submodule";
  trackId: string;
  plan: PlanWeek[];
  config: Record<string, unknown>;
  input: Record<string, unknown>;
  createdMs: number;
  createdAt: string;
  /** The course the tree was written into. Set at request time, never later. */
  courseId: number;
  note: string;
}

const JOBS_KEY = "builder:genjobs";

function genJobs(): GenJobSeed[] {
  return overlay.get<GenJobSeed[]>(JOBS_KEY, []);
}

function genJob(jobId: string): GenJobSeed | undefined {
  return genJobs().find((j) => j.jobId === jobId || String(j.numericId) === jobId);
}

/**
 * The pace the build is shown at.
 *
 * Derived from the clock rather than stored, exactly as the enrolment job in
 * `account-actions.ts` is, because this is one of the few places in the demo
 * where a value is MEANT to change between polls: the job page shows a progress
 * ladder and a live log, and a job that was born complete never shows the screen
 * that is the whole point of the feature.
 */
const OUTLINE_MS = 2_500;
const STRUCTURE_MS = 2_500;
const PER_TOPIC_MS = 900;

/** Only the two kinds this instance ships. Never coding, and never video. */
function requestedKinds(config: Record<string, unknown>): Array<"article" | "quiz"> {
  const raw = Array.isArray(config.content_types) ? config.content_types.map(String) : [];
  const kinds: Array<"article" | "quiz"> = [];
  if (raw.length === 0 || raw.includes("article")) kinds.push("article");
  if (raw.length === 0 || raw.includes("quiz")) kinds.push("quiz");
  return kinds.length ? kinds : ["article", "quiz"];
}

/** Questions per generated quiz, clamped to what the request asked for. */
function questionsPerQuiz(config: Record<string, unknown>): number {
  const min = Number(config.min_questions ?? 0);
  const max = Number(config.max_questions ?? 0);
  const wanted = Number.isFinite(max) && max > 0 ? max : Number.isFinite(min) && min > 0 ? min : 10;
  return Math.max(4, Math.min(20, Math.round(wanted)));
}

/**
 * Questions for one generated topic, taken from the verified library.
 *
 * Read as `QUIZ_BANK[courseId] ?? []` and sampled by seed, never by index: a
 * course whose bank is still being authored costs this quiz some questions and
 * nothing else, and the same topic draws the same questions after a reload.
 */
function bankQuestionsFor(track: Track, key: string, count: number): DemoMcq[] {
  const pool = track.bankCourses.flatMap((id) => QUIZ_BANK[id] ?? []);
  if (pool.length === 0) return [];
  return seededSample(`gen:q:${key}`, pool, Math.min(count, pool.length));
}

/**
 * Build the planned tree into the builder overlay, at request time.
 *
 * The write happens once, on the POST, and the job page then reads a projection
 * of it. Materialising from inside a GET was the alternative and is worse: the
 * page polls, so the build would depend on somebody watching it.
 *
 * The course is created UNPUBLISHED. Generation produces a draft that a faculty
 * member reads before any aspirant sees it, which is the review step the product
 * really has.
 *
 * One cost worth knowing: the lesson bodies and the attached questions are
 * stored in the overlay, which is a visitor's localStorage, so a generated
 * course is a few hundred kilobytes. That is the same price the legacy
 * `POST /articles/` route already pays and it is what makes the draft survive a
 * reload, but a demo that generates a dozen courses in one session will start
 * evicting. Clearing the demo state resets it.
 */
function buildPlan(
  track: Track,
  plan: PlanWeek[],
  config: Record<string, unknown>,
  target: { courseId: number } | { title: string; description: string; weeks: number },
): number {
  const kinds = requestedKinds(config);
  const perQuiz = questionsPerQuiz(config);

  const courseId =
    "courseId" in target
      ? target.courseId
      : createCourse({
          title: target.title,
          description: target.description,
          target_audience: track.audience,
          duration_weeks: target.weeks,
          duration_in_hours: target.weeks * 6,
          tags: track.skills.slice(0, 5),
        }).id;

  const existingWeeks = builderModules(courseId).length;

  for (const week of plan) {
    const mod = createModule(courseId, {
      title: week.title,
      description: week.summary,
      weekno: existingWeeks + week.week,
    });
    // Remembered on the plan, so the job never has to find its own work again by
    // title. An admin who renames a generated week while it is still building
    // would otherwise make the progress screen report somebody else's topics.
    week.moduleId = mod.id;
    for (const topic of week.topics) {
      const sub = createSubmodule(mod.id, {
        title: topic.title,
        description: `Work through ${topic.title}, then answer the practice questions on it.`,
      });
      topic.submoduleId = sub.id;
      attachPlannedContent(track, sub.id, topic, kinds, perQuiz);
    }
  }
  return courseId;
}

/** The article and the quiz for one generated topic. */
function attachPlannedContent(
  track: Track,
  submoduleId: number,
  topic: PlanTopic,
  kinds: Array<"article" | "quiz">,
  perQuiz: number,
): void {
  if (kinds.includes("article")) {
    // `articleBody` with no course id renders the honest per-tier OUTLINE for an
    // unauthored topic, which is exactly what a freshly generated lesson is: the
    // shape of the lesson, for a faculty member to write into. Inventing prose
    // here and presenting it as taught content would be the one thing a subject
    // expert reading this screen would catch immediately.
    const body = articleBody(
      { id: submoduleId, title: topic.title, kinds: ["article", "quiz"], progress: 0 },
      "Intermediate",
      topic.concepts,
    );
    const item = createItem("Article", topic.title, {
      content: body.html,
      summary: body.summary,
      reading_tier: "Intermediate",
      reading_time_minutes: body.readingMinutes,
      concepts: topic.concepts,
    });
    attachContent(submoduleId, {
      title: topic.title,
      content_type: "Article",
      content_id: item.id,
    });
  }

  if (kinds.includes("quiz")) {
    const questions = bankQuestionsFor(track, `${submoduleId}`, perQuiz).map(publicMcq);
    const title = `${topic.title}: practice questions`;
    const item = createItem("Quiz", title, {
      instructions:
        questions.length > 0
          ? "Four options, one correct. There is no negative marking in this practice set, so attempt every question. Read the explanation on each one you get wrong, and on each one you guessed right."
          : "This quiz has been created for the topic and is waiting for its questions. The verified library has none tagged to this trade yet, so the subject faculty writes the first set.",
      durating_in_minutes: 15,
      mcqs: questions,
    });
    attachContent(submoduleId, { title, content_type: "Quiz", content_id: item.id });
  }
}

/** Record a job and hand back its detail payload. */
function startJob(seed: Omit<GenJobSeed, "numericId" | "jobId" | "createdAt" | "createdMs">): GenJobSeed {
  const numericId = nextDemoId("gen-job");
  const job: GenJobSeed = {
    ...seed,
    numericId,
    jobId: `gen-${numericId}`,
    createdMs: nowMs(),
    createdAt: nowIso(),
  };
  overlay.unshift(JOBS_KEY, job);
  return job;
}

interface JobPhase {
  status:
    | "pending"
    | "generating_outline"
    | "creating_structure"
    | "generating_content"
    | "completed";
  topicsDone: number;
}

function phaseOf(job: GenJobSeed): JobPhase {
  const topics = job.plan.reduce((n, w) => n + w.topics.length, 0);
  // A job with nothing to do is finished, not "planning". The repair route can
  // legitimately find every topic already complete, and showing that request
  // working through an outline for five seconds would be theatre.
  if (topics === 0) return { status: "completed", topicsDone: 0 };
  const elapsed = Math.max(0, nowMs() - job.createdMs);
  if (elapsed < OUTLINE_MS) return { status: "generating_outline", topicsDone: 0 };
  if (elapsed < OUTLINE_MS + STRUCTURE_MS) return { status: "creating_structure", topicsDone: 0 };
  const intoContent = elapsed - OUTLINE_MS - STRUCTURE_MS;
  const done = Math.min(topics, Math.floor(intoContent / PER_TOPIC_MS));
  return done >= topics
    ? { status: "completed", topicsDone: topics }
    : { status: "generating_content", topicsDone: done };
}

/** Every planned topic, flattened, with the tree ids they were built into. */
function jobTopics(job: GenJobSeed) {
  const modules = builderModules(job.courseId);
  const rows: Array<{
    moduleId: number;
    weekno: number;
    moduleTitle: string;
    submoduleId: number;
    title: string;
    concepts: string[];
  }> = [];

  for (const week of job.plan) {
    // By id where the plan recorded one, by title only for a plan stored before
    // ids were kept. Never by index: an admin who reordered or deleted a week
    // between polls would otherwise make the job report somebody else's topics.
    const mod = modules.find((m) =>
      week.moduleId != null ? m.id === week.moduleId : m.title === week.title,
    );
    if (!mod) continue;
    const subs = builderSubmodules(mod.id);
    for (const topic of week.topics) {
      const sub = subs.find((s) =>
        topic.submoduleId != null ? s.id === topic.submoduleId : s.title === topic.title,
      );
      if (!sub) continue;
      rows.push({
        moduleId: mod.id,
        weekno: mod.weekno,
        moduleTitle: mod.title,
        submoduleId: sub.id,
        title: sub.title,
        concepts: topic.concepts,
      });
    }
  }
  return rows;
}

/** The job payload the progress page renders, derived on every read. */
function jobDetail(job: GenJobSeed) {
  const track = TRACKS.find((t) => t.id === job.trackId) ?? DEFAULT_TRACK;
  const kinds = requestedKinds(job.config);
  const perQuiz = questionsPerQuiz(job.config);
  const rows = jobTopics(job);
  const { status, topicsDone } = phaseOf(job);
  const perTopic = kinds.length;
  const total = rows.length * perTopic;
  const completed = topicsDone * perTopic;

  const log: Array<Record<string, unknown>> = [];
  const byDifficulty: Record<string, number> = {};
  let questionsGenerated = 0;
  let articlesGenerated = 0;

  rows.slice(0, topicsDone).forEach((row) => {
    const contents = builderContents(row.submoduleId);
    if (kinds.includes("article")) {
      articlesGenerated += 1;
      log.push({
        key: `a:${row.submoduleId}`,
        kind: "article",
        id: row.submoduleId,
        skill: row.concepts[0] ?? track.skills[0] ?? "",
        difficulty: "Intermediate",
        text: `Lesson outline written for ${row.title}`,
        title: row.title,
      });
    }
    if (kinds.includes("quiz")) {
      const quiz = contents.find((c) => c.content_type === "Quiz");
      const details = quiz ? (contentDetails(quiz) as { mcqs?: Array<{ difficulty_level?: string }> }) : null;
      const mcqs = details?.mcqs ?? [];
      questionsGenerated += mcqs.length;
      for (const q of mcqs) {
        const level = String(q.difficulty_level ?? "Medium");
        byDifficulty[level] = (byDifficulty[level] ?? 0) + 1;
      }
      log.push({
        key: `q:${row.submoduleId}`,
        kind: "quiz",
        id: row.submoduleId,
        skill: row.concepts[0] ?? track.skills[0] ?? "",
        difficulty: "Mixed",
        text:
          mcqs.length > 0
            ? `${mcqs.length} verified questions attached to ${row.title}`
            : `Quiz created for ${row.title}, waiting for the faculty to write its first set`,
        title: row.title,
      });
    }
  });

  const doneIds = new Set(rows.slice(0, topicsDone).map((r) => r.submoduleId));
  const tree = job.plan.map((week) => {
    const weekRows = rows.filter((r) =>
      week.moduleId != null ? r.moduleId === week.moduleId : r.moduleTitle === week.title,
    );
    return {
      id: weekRows[0]?.moduleId ?? week.week,
      weekno: weekRows[0]?.weekno ?? week.week,
      title: week.title,
      submodules: weekRows.map((row) => {
        const ready = doneIds.has(row.submoduleId);
        const quiz = ready
          ? builderContents(row.submoduleId).find((c) => c.content_type === "Quiz")
          : undefined;
        const mcqs = quiz
          ? ((contentDetails(quiz) as { mcqs?: unknown[] }).mcqs ?? [])
          : [];
        return {
          id: row.submoduleId,
          title: row.title,
          quiz_ready: ready && kinds.includes("quiz"),
          article_ready: ready && kinds.includes("article"),
          coding_ready: false,
          video_ready: false,
          question_count: mcqs.length,
          coding_problem_count: 0,
          video_count: 0,
        };
      }),
    };
  });

  const complete = status === "completed";

  return {
    id: job.numericId,
    job_id: job.jobId,
    title: job.title,
    status,
    scope: job.scope,
    total_content_items: total,
    completed_content_items: completed,
    progress_percentage: total === 0 ? 100 : Math.round((completed / total) * 100),
    generated_course_id: complete ? job.courseId : null,
    created_at: job.createdAt,
    updated_at: nowIso(),
    completed_at: complete
      ? iso(new Date(job.createdMs + OUTLINE_MS + STRUCTURE_MS + rows.length * PER_TOPIC_MS))
      : null,
    // The mission's programme officer holds the approval, so a request they file
    // themselves is approved as it is filed. The field stays because the job card
    // and the gated screen both read it.
    approval_status: "approved" as const,
    review_note: "",
    reviewed_at: job.createdAt,
    requested_note: job.note,
    input_data: job.input,
    original_input_data: job.input,
    config: job.config,
    outline_data: {
      track: track.label,
      audience: track.audience,
      outcomes: track.outcomes,
      weeks: job.plan.map((w) => ({
        week: w.week,
        title: w.title,
        summary: w.summary,
        topics: w.topics.map((t) => t.title),
      })),
    },
    error_log: [] as Array<Record<string, unknown>>,
    error_summary: null,
    tree,
    log,
    stats: {
      submodules_total: rows.length,
      submodules_done: topicsDone,
      questions_planned: rows.length * (kinds.includes("quiz") ? perQuiz : 0),
      questions_generated: questionsGenerated,
      articles_generated: articlesGenerated,
      coding_generated: 0,
      videos_generated: 0,
      by_difficulty: byDifficulty,
      elapsed_seconds: Math.round(Math.max(0, nowMs() - job.createdMs) / 1000),
    },
    skills: track.skills.map((skill) => ({
      skill,
      question_count: rows.filter((r) => r.concepts.includes(skill)).length * perQuiz,
      article_count: rows.filter((r) => r.concepts.includes(skill)).length,
    })),
  };
}

/**
 * Narrow the requested content types, and say so.
 *
 * The generate form offers four kinds because the product supports four. This
 * instance ships two, so a request that asked for coding or video is answered
 * with a note rather than silently trimmed: an admin who ticked a box and got
 * nothing back should be told which box it was.
 */
function contentTypeNote(config: Record<string, unknown>): string {
  const raw = Array.isArray(config.content_types) ? config.content_types.map(String) : [];
  const dropped = raw.filter((t) => t === "coding" || t === "video");
  if (dropped.length === 0) return "";
  return dropped.includes("coding") && dropped.includes("video")
    ? "Coding practice and video were not generated: this instance runs no code judge, and the demo has no network for a video player. Every topic carries a lesson and a quiz."
    : dropped.includes("coding")
      ? NO_CODE_JUDGE
      : "Video was not generated: the player is an embed and this preview runs with no network, so a video step could only render as a dead frame.";
}

/** Words worth matching on. Short ones match everything and mean nothing. */
function keyWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 4);
}

/**
 * The week of a track that best fits a topic an admin typed.
 *
 * Falls back to the topic itself as a single week rather than inventing three
 * sub-topics for a subject the blueprint does not cover, because three invented
 * headings read exactly like three real ones and cost the officer their trust in
 * the rest of the outline.
 */
function plannedWeekFor(track: Track, topic: string, count: number): PlanWeek {
  const wanted = new Set(keyWords(topic));
  let best: TrackWeek | null = null;
  let bestScore = 0;
  for (const week of track.weeks) {
    const words = keyWords([week.title, ...week.topics].join(" "));
    const score = words.filter((w) => wanted.has(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = week;
    }
  }

  const topics: string[] = best ? best.topics.slice(0, count) : [topic];
  while (topics.length < count) topics.push(`Practice and review for ${topic.toLowerCase()}`);

  return {
    week: 1,
    title: topic,
    summary: best ? best.summary : `The week's work on ${topic.toLowerCase()}.`,
    topics: topics.map((t, i) => ({ title: t, concepts: conceptsForPlanTopic(track, 0, i) })),
  };
}

/** The admin's edited CSV plan, taken exactly as it now reads on screen. */
function planFromModules(track: Track, modules: Array<Record<string, unknown>>): PlanWeek[] {
  return modules.map((m, i) => {
    const subs = Array.isArray(m.submodules) ? (m.submodules as Array<Record<string, unknown>>) : [];
    return {
      week: Number(m.week ?? i + 1) || i + 1,
      title: String(m.title ?? `Week ${i + 1}`).trim() || `Week ${i + 1}`,
      summary: String(m.description ?? "").trim(),
      topics: subs.map((s, j) => {
        const concepts = Array.isArray(s.key_concepts)
          ? s.key_concepts.map(String).filter(Boolean)
          : [];
        return {
          title: String(s.title ?? `Topic ${j + 1}`).trim() || `Topic ${j + 1}`,
          concepts: concepts.length ? concepts : conceptsForPlanTopic(track, i, j),
        };
      }),
    };
  });
}

/* ─────────────────────────────────────────────────────────── CSV mapping */

/** Exact header match first, then a contains match, so "Week no" beats "Weekly notes". */
function pickColumn(columns: string[], wanted: string[]): string | null {
  const lower = columns.map((c) => c.toLowerCase().trim());
  for (const want of wanted) {
    const exact = lower.indexOf(want);
    if (exact >= 0) return columns[exact];
  }
  for (const want of wanted) {
    const partial = lower.findIndex((c) => c.includes(want));
    if (partial >= 0) return columns[partial];
  }
  return null;
}

/**
 * Turn an uploaded curriculum into weeks and topics.
 *
 * The header names a department actually uses are the ones matched here: Week,
 * Module, Unit, Session on one side and Topic, Sub-topic, Lesson, Content on the
 * other. Where a role has no column the plan still builds, and the warning says
 * exactly what was assumed instead. A silent assumption is the one thing that
 * makes an admin approve a plan without reading it.
 */
function csvPlan(columns: string[], rows: Array<Record<string, unknown>>, hint: string) {
  const hinted = hint.toLowerCase();
  const weekCol =
    pickColumn(columns, hinted.includes("module") ? ["module", "week"] : ["week", "module", "unit", "chapter", "session"]);
  const topicCol = pickColumn(columns, ["topic", "sub-topic", "submodule", "lesson", "content", "title"]);
  const descCol = pickColumn(columns, ["description", "outcome", "detail", "summary", "objective"]);
  const conceptCol = pickColumn(columns, ["concept", "skill", "keyword", "tag"]);

  const warnings: string[] = [];
  if (!topicCol) {
    warnings.push(
      "No topic column was found, so the first column has been read as the topic. Rename a column to Topic and analyse again if that is wrong.",
    );
  }
  if (!weekCol) {
    warnings.push(
      "No week or module column was found, so the rows have been grouped three to a week in the order they appear.",
    );
  }
  if (!descCol) {
    warnings.push("No description column was found. Each topic carries its title only.");
  }

  const title = (row: Record<string, unknown>): string => {
    const value = topicCol ? row[topicCol] : row[columns[0]];
    return String(value ?? "").trim();
  };

  const usable = rows.filter((row) => title(row).length > 0);
  if (usable.length === 0) {
    warnings.push("Every row was empty in the column being read as the topic.");
  }

  const buckets = new Map<string, Array<Record<string, unknown>>>();
  usable.forEach((row, i) => {
    const key = weekCol
      ? String(row[weekCol] ?? "").trim() || "Unnumbered"
      : `Week ${Math.floor(i / 3) + 1}`;
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  });

  const modules = [...buckets.entries()].map(([key, list], i) => ({
    week: i + 1,
    // A numeric cell ("3") is a week number and reads badly as a heading; a
    // worded cell ("Motor control") is already the week's title.
    title: /^\d+$/.test(key) ? `Week ${key}` : key,
    submodules: list.map((row) => ({
      title: title(row),
      description: descCol ? String(row[descCol] ?? "").trim() : "",
      key_concepts: conceptCol
        ? String(row[conceptCol] ?? "")
            .split(/[,;|]/)
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
    })),
  }));

  return {
    modules,
    column_mapping: {
      week: weekCol,
      topic: topicCol ?? columns[0] ?? null,
      description: descCol,
      key_concepts: conceptCol,
    },
    warnings,
  };
}


/* ────────────────────────────────────────────────────────────────── routes */

defineRoutes(MODULE, {
  /* ─────────────────────────── legacy admin builder: courses ────────────── */

  /**
   * Create a course.
   *
   * The whole point of this module: it writes to the overlay, so the course is in
   * the very next `GET .../courses/` and openable in the builder. A create that
   * returns 201 and then vanishes is the one failure a prospect always notices.
   */
  "POST /admin-dashboard/api/clients/:clientId/courses/": (req) =>
    adminCourseRow(createCourse((req.body ?? {}) as Record<string, unknown>)),

  "PATCH /admin-dashboard/api/clients/:clientId/courses/:courseId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const changes: Partial<BuilderCourse> = {};
    if (body.title !== undefined) changes.title = String(body.title);
    if (body.subtitle !== undefined) changes.subtitle = String(body.subtitle);
    if (body.description !== undefined) changes.description = String(body.description);
    if (body.slug !== undefined) changes.slug = String(body.slug);
    if (body.difficulty_level !== undefined) changes.difficulty_level = String(body.difficulty_level);
    if (body.published !== undefined) changes.published = Boolean(body.published);
    if (body.enrollment_enabled !== undefined) changes.enrollment_enabled = Boolean(body.enrollment_enabled);
    if (body.certificate_available !== undefined) changes.certificate_available = Boolean(body.certificate_available);
    if (body.is_free !== undefined) changes.is_free = Boolean(body.is_free);
    if (body.rating !== undefined) changes.rating = Number(body.rating);
    if (body.tags !== undefined) {
      changes.tags = Array.isArray(body.tags)
        ? body.tags.map(String)
        : String(body.tags).split(",").map((t) => t.trim()).filter(Boolean);
    }
    return adminCourseRow(patchCourse(Number(req.params.courseId), changes));
  },

  "DELETE /admin-dashboard/api/clients/:clientId/courses/:courseId/": (req) => {
    const id = Number(req.params.courseId);
    if (!builderCourse(id)) throw notFound("Course not found");
    for (const mod of builderModules(id)) deleteModule(mod.id);
    bury("course", id);
    mutate((s) => {
      s.courses = s.courses.filter((c) => c.id !== id);
      delete s.patch.course[id];
    });
    return { detail: "Course deleted." };
  },

  /**
   * Duplicate a course, tree and all.
   *
   * A real deep copy rather than a stub, because "Duplicate" is the fastest way
   * an admin builds a second cohort's course and a copy that arrives empty is
   * indistinguishable from a broken button.
   */
  "POST /admin-dashboard/api/clients/:clientId/courses/:courseId/duplicate/": (req) => {
    const source = builderCourse(Number(req.params.courseId));
    if (!source) throw notFound("Course not found");

    const copy = createCourse({
      title: `${source.title} (copy)`,
      subtitle: source.subtitle,
      description: source.description,
      difficulty_level: source.difficulty_level,
      target_audience: source.target_audience,
      duration_weeks: source.duration_weeks,
      duration_in_hours: source.duration_in_hours,
      tags: source.tags,
    });

    for (const mod of builderModules(source.id)) {
      const newModule = createModule(copy.id, {
        title: mod.title,
        description: mod.description,
        weekno: mod.weekno,
      });
      for (const sub of builderSubmodules(mod.id)) {
        const newSub = createSubmodule(newModule.id, {
          title: sub.title,
          description: sub.description,
          order: sub.order,
        });
        for (const content of builderContents(sub.id)) {
          attachContent(newSub.id, {
            title: content.title,
            content_type: content.content_type,
            // Points at the SAME content object. The verified library is shared,
            // never cloned: a copy of a course reuses the articles and problems
            // rather than forking a second copy that then drifts.
            content_id: content.content_id,
            order: content.order,
            duration_in_minutes: content.duration_in_minutes,
            marks: content.marks,
          });
        }
      }
    }

    return adminCourseRow(builderCourse(copy.id) as BuilderCourse);
  },

  /* ────────────────────────── legacy admin builder: the tree ────────────── */

  "GET /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/": (req) => {
    const id = Number(req.params.courseId);
    if (!builderCourse(id)) throw notFound("Course not found");
    return builderModules(id).map(adminModuleRow);
  },

  "POST /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/": (req) =>
    adminModuleRow(createModule(Number(req.params.courseId), (req.body ?? {}) as Record<string, unknown>)),

  "PATCH /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/": (req) => {
    const id = Number(req.params.moduleId);
    if (!builderModule(id)) throw notFound("Module not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.module[id] = {
        ...(s.patch.module[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.description !== undefined ? { description: String(body.description) } : {}),
        ...(body.weekno !== undefined ? { weekno: Number(body.weekno) } : {}),
      };
    });
    return adminModuleRow(builderModule(id) as BuilderModule);
  },

  "DELETE /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/": (req) => {
    const id = Number(req.params.moduleId);
    if (!builderModule(id)) throw notFound("Module not found");
    const removed = deleteModule(id);
    return { detail: "Module deleted.", submodules_removed: removed };
  },

  "GET /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/submodules/": (req) => {
    const id = Number(req.params.moduleId);
    if (!builderModule(id)) throw notFound("Module not found");
    return builderSubmodules(id).map(adminSubmoduleRow);
  },

  "POST /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/submodules/": (req) =>
    adminSubmoduleRow(
      createSubmodule(Number(req.params.moduleId), (req.body ?? {}) as Record<string, unknown>),
    ),

  "PATCH /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/submodules/:submoduleId/": (req) => {
    const id = Number(req.params.submoduleId);
    if (!builderSubmodule(id)) throw notFound("Submodule not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.submodule[id] = {
        ...(s.patch.submodule[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.description !== undefined ? { description: String(body.description) } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) } : {}),
      };
    });
    return adminSubmoduleRow(builderSubmodule(id) as BuilderSubmodule);
  },

  "DELETE /admin-dashboard/api/clients/:clientId/courses/:courseId/modules/:moduleId/submodules/:submoduleId/": (req) => {
    const id = Number(req.params.submoduleId);
    if (!builderSubmodule(id)) throw notFound("Submodule not found");
    deleteSubmodule(id);
    return { detail: "Topic deleted." };
  },

  /* ───────────────────────── legacy admin builder: contents ─────────────── */

  "GET /admin-dashboard/api/clients/:clientId/courses/:courseId/submodules/:submoduleId/contents/": (req) => {
    const id = Number(req.params.submoduleId);
    if (!builderSubmodule(id)) throw notFound("Submodule not found");
    return builderContents(id).map(adminContentRow);
  },

  "POST /admin-dashboard/api/clients/:clientId/courses/:courseId/submodules/:submoduleId/contents/": (req) =>
    adminContentRow(
      attachContent(Number(req.params.submoduleId), (req.body ?? {}) as Record<string, unknown>),
    ),

  "PATCH /admin-dashboard/api/clients/:clientId/courses/:courseId/submodules/:submoduleId/contents/:contentId/": (req) => {
    const id = Number(req.params.contentId);
    if (!builderContent(id)) throw notFound("Content not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.content[id] = {
        ...(s.patch.content[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) } : {}),
        ...(body.marks !== undefined ? { marks: Number(body.marks) } : {}),
        ...(body.duration_in_minutes !== undefined
          ? { duration_in_minutes: Number(body.duration_in_minutes) }
          : {}),
      };
    });
    return adminContentRow(builderContent(id) as BuilderContent);
  },

  "DELETE /admin-dashboard/api/clients/:clientId/courses/:courseId/submodules/:submoduleId/contents/:contentId/": (req) => {
    const id = Number(req.params.contentId);
    if (!builderContent(id)) throw notFound("Content not found");
    deleteContent(id);
    return { detail: "Item removed from this topic." };
  },

  /* ──────────────────────────────── content attachments ─────────────────── */

  /** A BARE array. The service does `Array.isArray(res.data) ? res.data : []`. */
  "GET /admin-dashboard/api/clients/:clientId/courses/:courseId/contents/:contentId/attachments/": (req) =>
    attachmentsOfContent(Number(req.params.contentId)),

  "POST /admin-dashboard/api/clients/:clientId/courses/:courseId/contents/:contentId/attachments/": async (req) => {
    const contentId = Number(req.params.contentId);
    if (!builderContent(contentId)) throw notFound("Content not found");

    const file = fileOf(req.body);
    const name = file?.name ?? fieldOf(req.body, "original_filename") ?? "handout.pdf";
    const mime = file?.type ?? fieldOf(req.body, "mime_type") ?? "application/octet-stream";
    const now = nowIso();

    const attachment: BuilderAttachment = {
      id: newId(),
      content: contentId,
      title: fieldOf(req.body, "title") || name.replace(/\.[^.]+$/, ""),
      file_url: file ? await inlineFile(file) : null,
      file_type: fileFamily(name, mime),
      original_filename: name,
      file_size: file?.size ?? Number(fieldOf(req.body, "file_size") ?? 0),
      mime_type: mime,
      order: Number(fieldOf(req.body, "order") ?? attachmentsOfContent(contentId).length + 1),
      uploaded_by: req.auth?.userId ?? null,
      uploaded_by_name: req.auth?.email ?? null,
      created_at: now,
      updated_at: now,
    };

    mutate((s) => s.attachments.push(attachment));
    return attachment;
  },

  "PATCH /admin-dashboard/api/clients/:clientId/courses/:courseId/contents/:contentId/attachments/:attachmentId/": (req) => {
    const id = Number(req.params.attachmentId);
    const contentId = Number(req.params.contentId);
    const existing = attachmentsOfContent(contentId).find((a) => a.id === id);
    if (!existing) throw notFound("Attachment not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.attachment[id] = {
        ...(s.patch.attachment[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) } : {}),
        updated_at: nowIso(),
      };
    });
    return attachmentsOfContent(contentId).find((a) => a.id === id) as BuilderAttachment;
  },

  "DELETE /admin-dashboard/api/clients/:clientId/courses/:courseId/contents/:contentId/attachments/:attachmentId/": (req) => {
    const id = Number(req.params.attachmentId);
    const existing = attachmentsOfContent(Number(req.params.contentId)).find((a) => a.id === id);
    if (!existing) throw notFound("Attachment not found");
    bury("attachment", id);
    mutate((s) => {
      s.attachments = s.attachments.filter((a) => a.id !== id);
      delete s.patch.attachment[id];
    });
    return { detail: "Attachment deleted." };
  },

  /* ───────────────────────────── the content object library ─────────────── */

  "POST /admin-dashboard/api/clients/:clientId/articles/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      createItem(
        "Article",
        String(body.title ?? "Untitled article"),
        { content: String(body.content ?? ""), summary: String(body.summary ?? "") },
        String(body.difficulty_level ?? "Medium"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/articles/:articleId/": (req) =>
    itemResponse(itemOr404(Number(req.params.articleId))),

  "PATCH /admin-dashboard/api/clients/:clientId/articles/:articleId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      patchItem(
        Number(req.params.articleId),
        {
          ...(body.content !== undefined ? { content: String(body.content) } : {}),
          ...(body.summary !== undefined ? { summary: String(body.summary) } : {}),
        },
        body.title === undefined ? undefined : String(body.title),
      ),
    );
  },

  "POST /admin-dashboard/api/clients/:clientId/video-tutorials/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      createItem(
        "VideoTutorial",
        String(body.title ?? "Untitled video"),
        {
          video_url: String(body.video_url ?? ""),
          description: String(body.description ?? ""),
          transcript: String(body.transcript ?? ""),
        },
        String(body.difficulty_level ?? "Medium"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/video-tutorials/:videoId/": (req) =>
    itemResponse(itemOr404(Number(req.params.videoId))),

  "PATCH /admin-dashboard/api/clients/:clientId/video-tutorials/:videoId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      patchItem(
        Number(req.params.videoId),
        {
          ...(body.video_url !== undefined ? { video_url: String(body.video_url) } : {}),
          ...(body.description !== undefined ? { description: String(body.description) } : {}),
          ...(body.transcript !== undefined ? { transcript: String(body.transcript) } : {}),
        },
        body.title === undefined ? undefined : String(body.title),
      ),
    );
  },

  "POST /admin-dashboard/api/clients/:clientId/assignments/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      createItem(
        "Assignment",
        String(body.title ?? "Untitled assignment"),
        { question: String(body.question ?? ""), description: String(body.question ?? "") },
        String(body.difficulty_level ?? "Medium"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/assignments/:assignmentId/": (req) =>
    itemResponse(itemOr404(Number(req.params.assignmentId))),

  "PATCH /admin-dashboard/api/clients/:clientId/assignments/:assignmentId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      patchItem(
        Number(req.params.assignmentId),
        body.question === undefined
          ? {}
          : { question: String(body.question), description: String(body.question) },
        body.title === undefined ? undefined : String(body.title),
      ),
    );
  },

  "POST /admin-dashboard/api/clients/:clientId/coding-problems/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      createItem(
        "CodingProblem",
        String(body.title ?? "Untitled problem"),
        {
          problem_statement: String(body.problem_statement ?? ""),
          input_format: String(body.input_format ?? ""),
          output_format: String(body.output_format ?? ""),
          sample_input: String(body.sample_input ?? ""),
          sample_output: String(body.sample_output ?? ""),
          constraints: String(body.constraints ?? ""),
          test_cases: Array.isArray(body.test_cases) ? body.test_cases : [],
          solution: body.solution ?? {},
          template_code: body.template_code ?? {},
          time_limit: Number(body.time_limit ?? 5),
          memory_limit: Number(body.memory_limit ?? 256),
          tags: String(body.tags ?? ""),
        },
        String(body.difficulty_level ?? "Easy"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/coding-problems/:problemId/": (req) =>
    itemResponse(itemOr404(Number(req.params.problemId))),

  "PATCH /admin-dashboard/api/clients/:clientId/coding-problems/:problemId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const { title, ...rest } = body;
    return itemResponse(
      patchItem(Number(req.params.problemId), rest, title === undefined ? undefined : String(title)),
    );
  },

  "POST /admin-dashboard/api/clients/:clientId/mcqs/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      createItem(
        "MCQ",
        String(body.question_text ?? "Untitled question"),
        {
          question_text: String(body.question_text ?? ""),
          option_a: String(body.option_a ?? ""),
          option_b: String(body.option_b ?? ""),
          option_c: String(body.option_c ?? ""),
          option_d: String(body.option_d ?? ""),
          correct_option: String(body.correct_option ?? "A"),
          explanation: String(body.explanation ?? ""),
          topic: String(body.topic ?? ""),
          skills: String(body.skills ?? ""),
        },
        String(body.difficulty_level ?? "Medium"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/mcqs/:mcqId/": (req) =>
    itemResponse(itemOr404(Number(req.params.mcqId))),

  "PATCH /admin-dashboard/api/clients/:clientId/mcqs/:mcqId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      patchItem(
        Number(req.params.mcqId),
        body,
        body.question_text === undefined ? undefined : String(body.question_text),
      ),
    );
  },

  "POST /admin-dashboard/api/clients/:clientId/quizzes/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const mcqIds = Array.isArray(body.mcqs) ? body.mcqs.map(Number) : [];
    return itemResponse(
      createItem(
        "Quiz",
        String(body.title ?? "Untitled quiz"),
        {
          instructions: String(body.instructions ?? ""),
          durating_in_minutes: Number(body.durating_in_minutes ?? 15),
          mcqs: mcqIds.map(quizQuestion).filter(Boolean),
        },
        String(body.difficulty_level ?? "Medium"),
      ),
    );
  },

  "GET /admin-dashboard/api/clients/:clientId/quizzes/:quizId/": (req) =>
    itemResponse(itemOr404(Number(req.params.quizId))),

  "PATCH /admin-dashboard/api/clients/:clientId/quizzes/:quizId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    return itemResponse(
      patchItem(
        Number(req.params.quizId),
        {
          ...(body.instructions !== undefined ? { instructions: String(body.instructions) } : {}),
          ...(body.durating_in_minutes !== undefined
            ? { durating_in_minutes: Number(body.durating_in_minutes) }
            : {}),
          ...(Array.isArray(body.mcqs)
            ? { mcqs: body.mcqs.map(Number).map(quizQuestion).filter(Boolean) }
            : {}),
        },
        body.title === undefined ? undefined : String(body.title),
      ),
    );
  },

  /* ─────────────────────────────── learner-facing lesson routes ─────────── */

  /**
   * The lesson outline.
   *
   * `SubModuleDetailResponse`, not `SubModuleDetail`: the same URL is typed twice
   * in the service, and the page calls `getSubModuleWithContents`, which reads
   * `data.data` and `attachments_by_content`. Returning the other shape leaves the
   * lesson list empty with no error anywhere.
   */
  "GET /lms/clients/:clientId/courses/:courseId/sub-module/:submoduleId/": (req) => {
    const id = Number(req.params.submoduleId);
    const sub = builderSubmodule(id);
    if (!sub) throw notFound("Submodule not found");
    const mod = builderModule(sub.module);
    const contents = builderContents(id);

    const attachments_by_content: Record<number, ReturnType<typeof publicAttachment>[]> = {};
    for (const content of contents) {
      const list = attachmentsOfContent(content.id);
      if (list.length) attachments_by_content[content.id] = list.map(publicAttachment);
    }

    return {
      status: "success",
      courseId: Number(req.params.courseId),
      moduleName: mod?.title ?? "",
      weekNo: mod?.weekno ?? 1,
      submoduleId: sub.id,
      submoduleName: sub.title,
      data: contents.map(learnerContentItem),
      attachments_by_content,
    };
  },

  "GET /lms/clients/:clientId/courses/:courseId/content/:contentId/": (req) => {
    const id = Number(req.params.contentId);
    const content = builderContent(id);
    if (!content) throw notFound("Content not found");

    const siblings = builderContents(content.submodule);
    const index = siblings.findIndex((c) => c.id === content.id);
    const neighbour = (offset: number) => {
      const found = siblings[index + offset];
      return found ? { id: found.id, content_type: found.content_type } : null;
    };

    return {
      id: content.id,
      content_type: content.content_type,
      content_title: content.title,
      duration_in_minutes: content.duration_in_minutes,
      order: content.order,
      status: contentStatus(content),
      marks: content.marks,
      details: contentDetails(content),
      next_content: neighbour(1),
      previous_content: neighbour(-1),
    };
  },

  "GET /lms/clients/:clientId/courses/:courseId/content/:contentId/comment/": (req) =>
    commentsFor(Number(req.params.contentId)),

  "POST /lms/clients/:clientId/courses/:courseId/content/:contentId/comment/": (req) => {
    const contentId = Number(req.params.contentId);
    const text = String(req.body?.text ?? req.body?.comment ?? "").trim();
    if (!text) throw badRequest({ detail: "Write something before posting." });

    const comment: LessonComment = {
      id: newId(),
      text,
      created_at: nowIso(),
      user_profile: {
        id: req.auth?.userId ?? STUDENT_PERSONA.id,
        user_name: STUDENT_PERSONA.full_name,
        profile_pic_url: STUDENT_PERSONA.profile_pic_url,
      },
    };
    overlay.push(`lesson:comments:${contentId}`, comment);
    return comment;
  },

  "GET /lms/clients/:clientId/courses/:courseId/content/:contentId/past-submissions/": (req) => {
    const content = builderContent(Number(req.params.contentId));
    return content ? pastSubmissions(content) : [];
  },

  "GET /lms/clients/:clientId/courses/:courseId/content/:contentId/past-submissions/:submissionId/": (req) => {
    const content = builderContent(Number(req.params.contentId));
    if (!content) throw notFound("Content not found");
    return submissionDetail(content, Number(req.params.submissionId));
  },

  /** Liking is persisted, so the heart survives a reload like every other write. */
  "POST /lms/clients/:clientId/courses/:courseId/toggle-like/": (req) => {
    const courseId = Number(req.params.courseId);
    const course = builderCourse(courseId);
    if (!course) throw notFound("Course not found");
    const base = Math.round(course.enrolled_count * 0.42);
    const liked = overlay.update<number[]>("courses:liked", [], (list) =>
      list.includes(courseId) ? list.filter((id) => id !== courseId) : [...list, courseId],
    ).includes(courseId);
    return { liked, likes_count: base + (liked ? 1 : 0) };
  },

  /* ─────────────────────────────────── tenant setup wizard ──────────────── */

  /**
   * The mission is a live tenant, so setup reads as already finished and
   * `/setup` hands the Programme Officer back to their dashboard. The flag still
   * comes from the overlay rather than a literal: an operator who wants to walk a
   * department through onboarding can clear it, and the rest of the wizard works.
   */
  "GET /api/tenant/wizard/state/": () => wizardState(),

  "PATCH /api/tenant/wizard/state/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    if (body.wizard_state !== undefined) {
      overlay.set("wizard:state", body.wizard_state as Record<string, unknown>);
    }
    if (body.setup_step !== undefined) overlay.set("wizard:step", Number(body.setup_step));
    return wizardState();
  },

  "POST /api/tenant/wizard/launch/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    if (body.wizard_state !== undefined) {
      overlay.set("wizard:state", body.wizard_state as Record<string, unknown>);
    }
    overlay.set("wizard:completed", true);
    return wizardState();
  },

  "POST /api/tenant/wizard/upload-asset/": async (req) => {
    const file = fileOf(req.body);
    const kind = fieldOf(req.body, "kind") ?? "logo";
    if (!file) throw badRequest({ detail: "Choose a file to upload." });
    const url = await inlineFile(file);
    if (!url) {
      throw badRequest({
        detail: "That file is too large for the preview. Please upload one under 512 KB.",
      });
    }
    return { url, kind, filename: file.name };
  },

  /**
   * The catalogue an incoming tenant imports from.
   *
   * `{ courses: [...] }`, not a bare array: the step reads `res.data?.courses`
   * and an array would silently render an empty catalogue with no error to
   * explain it.
   */
  "GET /api/tenant/wizard/catalogue/": () => ({
    courses: COURSES.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      difficulty_level: course.difficulty,
      duration_in_hours: course.durationHours,
      thumbnail: courseArt(course),
      modules_count: course.modules.length,
      submodules_count: topicsOf(course).length,
      modules: course.modules.map((m, i) => ({
        id: m.id,
        weekno: i + 1,
        title: m.title,
        submodules_count: m.topics.length,
        submodules: m.topics.map((t, order) => ({ id: t.id, title: t.title, order: order + 1 })),
      })),
    })),
  }),

  /* ───────────────────────────── adaptive manual authoring ──────────────── */

  /**
   * "Build a course manually".
   *
   * This is the create the demo was visibly failing on. It returns the full
   * course DETAIL, not a list row: the dialog navigates straight to
   * `/admin/adaptive-courses/<id>` on success, so anything less than a detail
   * would land the admin on a builder that cannot render.
   */
  "POST /adaptive-quiz/api/admin/courses/create/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const course = createCourse(body);
    return adminAdaptiveCourseDetail(course.id);
  },

  "PATCH /adaptive-quiz/api/admin/courses/:courseId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const changes: Partial<BuilderCourse> = {};
    if (body.title !== undefined) changes.title = String(body.title);
    if (body.description !== undefined) changes.description = String(body.description);
    if (body.content_locked !== undefined) changes.content_locked = Boolean(body.content_locked);
    if (body.auto_enroll !== undefined) changes.auto_enroll = Boolean(body.auto_enroll);
    if (body.self_enroll_enabled !== undefined) {
      changes.self_enroll_enabled = Boolean(body.self_enroll_enabled);
    }
    if (body.is_paid !== undefined) changes.is_paid = Boolean(body.is_paid);
    if (body.price !== undefined) changes.price = body.price === null ? null : String(body.price);
    if (body.currency !== undefined) changes.currency = String(body.currency);
    if (body.allow_clipboard !== undefined) changes.allow_clipboard = Boolean(body.allow_clipboard);

    const before = builderCourse(Number(req.params.courseId));
    patchCourse(Number(req.params.courseId), changes);
    return {
      ...adminAdaptiveCourseDetail(Number(req.params.courseId)),
      // Only meaningful on the free-to-paid transition, and the dialog prints it
      // as a warning, so it must be absent rather than zero the rest of the time.
      ...(changes.is_paid && before && !before.is_paid
        ? { grandfathered_students: before.enrolled_count }
        : {}),
    };
  },

  "DELETE /adaptive-quiz/api/admin/courses/:courseId/": (req) => {
    const id = Number(req.params.courseId);
    if (!builderCourse(id)) throw notFound("Course not found");
    for (const mod of builderModules(id)) deleteModule(mod.id);
    bury("course", id);
    mutate((s) => {
      s.courses = s.courses.filter((c) => c.id !== id);
      delete s.patch.course[id];
    });
    return { detail: "Course deleted." };
  },

  "POST /adaptive-quiz/api/admin/courses/:courseId/publish/": (req) => {
    const id = Number(req.params.courseId);
    const course = builderCourse(id);
    if (!course) throw notFound("Course not found");
    const next = patchCourse(id, { published: !course.published });
    return { course_id: id, is_published: next.published };
  },

  "POST /adaptive-quiz/api/admin/courses/:courseId/generate-description/": (req) => {
    const course = builderCourse(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const modules = builderModules(course.id);
    const outline = modules.slice(0, 3).map((m) => m.title.toLowerCase());

    return {
      description:
        outline.length > 0
          ? `${course.title} runs over ${modules.length} ${modules.length === 1 ? "week" : "weeks"}. ` +
            `It covers ${outline.join(", ")}${modules.length > 3 ? ", and the weeks after those" : ""}. ` +
            "Every topic carries something to read and a set of practice questions whose explanations " +
            "say why the tempting wrong answer is wrong. You finish each week with work your faculty " +
            "can mark, rather than with time spent."
          : `${course.title} has no weeks in it yet. Add a module or two and generate this again, ` +
            "and the description will be written from the outline you built.",
    };
  },

  "POST /adaptive-quiz/api/admin/courses/:courseId/suggest-topic/": (req) => {
    const course = builderCourse(Number(req.params.courseId));
    if (!course) throw notFound("Course not found");
    const scope = String(req.body?.scope ?? "module");
    const covered = builderModules(course.id).flatMap((m) =>
      builderSubmodules(m.id).map((sm) => sm.title),
    );
    const seeded = courseById(course.id);
    const pool = seeded
      ? topicsOf(seeded).map((t) => t.title).filter((t) => !covered.includes(t))
      : [];
    const topic =
      pool.length > 0
        ? seededPick(`suggest:${course.id}:${covered.length}`, pool)
        : `Revision and a full length practice set for ${shortCourseName(course.title)}`;

    return {
      topic,
      rationale:
        scope === "module"
          ? "Nothing in the outline covers this yet, and it is the usual next step for an aspirant who has finished the weeks above."
          : "This sits inside the week you are adding to and fills the gap between what the previous topic proves and what the next one assumes.",
    };
  },

  /* ───────────────────────────── the course generator ───────────────────── */

  /**
   * "Describe it and we build it", the screen a government buyer asks about
   * first, because it answers who will write the content for a trade the mission
   * has just added.
   *
   * The tree is written into the overlay HERE, on the request, and the job page
   * then reads a projection of it. Building from inside the polling GET was the
   * alternative and is worse: the course would only get built while somebody was
   * watching the progress bar.
   */
  "POST /adaptive-quiz/api/admin/courses/generate/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    if (!title) throw badRequest({ detail: "Give the course a title." });
    if (description.length < 5) {
      throw badRequest({ detail: "Describe the course in a sentence, so the outline has something to work from." });
    }

    const config = (body.config ?? {}) as Record<string, unknown>;
    const weeks = Math.max(1, Math.min(24, Number(body.duration_weeks ?? 4) || 4));
    const perWeek = Math.max(1, Math.min(6, Number(config.submodules_per_module ?? 3) || 3));
    const track = trackFor(`${title} ${description}`);
    const plan = planWeeks(track, weeks, perWeek);
    const courseId = buildPlan(track, plan, config, {
      title,
      description,
      weeks,
    });

    return jobDetail(
      startJob({
        title,
        description,
        scope: "full_course",
        trackId: track.id,
        plan,
        config,
        input: {
          title,
          description,
          duration_weeks: weeks,
          target_audience: track.audience,
          track: track.label,
        },
        courseId,
        note: contentTypeNote(config),
      }),
    );
  },

  /**
   * Map an uploaded curriculum CSV onto weeks and topics.
   *
   * Preview only: nothing is written until the admin edits the plan and presses
   * Generate. `column_mapping` names the source column behind each role, and
   * `warnings` says what could not be found, because a plan that silently
   * invented a column is a plan the admin will approve without reading.
   */
  "POST /adaptive-quiz/api/admin/courses/parse-csv/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const columns = Array.isArray(body.columns) ? body.columns.map(String) : [];
    const rows = Array.isArray(body.rows)
      ? (body.rows as Array<Record<string, unknown>>)
      : [];
    if (rows.length === 0) {
      throw badRequest({ detail: "That file had no rows under its header." });
    }
    return csvPlan(columns, rows, String(body.hint ?? ""));
  },

  /** Build the plan the admin edited on screen, exactly as it now reads. */
  "POST /adaptive-quiz/api/admin/courses/generate-from-plan/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    if (!title) throw badRequest({ detail: "Give the course a title." });
    const modules = Array.isArray(body.modules)
      ? (body.modules as Array<Record<string, unknown>>)
      : [];
    if (modules.length === 0) {
      throw badRequest({ detail: "The plan has no weeks in it." });
    }

    const config = (body.config ?? {}) as Record<string, unknown>;
    const description = String(body.description ?? "").trim();
    const track = trackFor(
      `${title} ${description} ${modules.map((m) => String(m.title ?? "")).join(" ")}`,
    );
    const plan = planFromModules(track, modules);
    const courseId = buildPlan(track, plan, config, {
      title,
      description:
        description ||
        `Built from an uploaded curriculum plan of ${plan.length} ${plan.length === 1 ? "week" : "weeks"}.`,
      weeks: plan.length,
    });

    return jobDetail(
      startJob({
        title,
        description,
        scope: "full_course",
        trackId: track.id,
        plan,
        config,
        input: { title, description, source: "csv", weeks: plan.length, track: track.label },
        courseId,
        note: contentTypeNote(config),
      }),
    );
  },

  "GET /adaptive-quiz/api/admin/courses/jobs/:jobId/": (req) => {
    const job = genJob(req.params.jobId);
    if (!job) throw notFound("Generation job not found");
    return jobDetail(job);
  },

  /**
   * Cancel. The tree that was already written stays: it is a real draft course,
   * and deleting an admin's half-built course because they closed a progress
   * screen is not a thing to do to somebody's work.
   */
  "DELETE /adaptive-quiz/api/admin/courses/jobs/:jobId/": (req) => {
    const job = genJob(req.params.jobId);
    if (!job) throw notFound("Generation job not found");
    overlay.set(
      JOBS_KEY,
      genJobs().filter((j) => j.jobId !== job.jobId),
    );
    return { detail: "Job removed. The draft course it built is still in the library." };
  },

  /** Add one generated week to a course that already exists. */
  "POST /adaptive-quiz/api/admin/courses/:courseId/modules/generate/": (req) => {
    const courseId = Number(req.params.courseId);
    const course = builderCourse(courseId);
    if (!course) throw notFound("Course not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const topic = String(body.topic ?? "").trim();
    if (!topic) throw badRequest({ detail: "Say what this week should cover." });

    const config = (body.config ?? {}) as Record<string, unknown>;
    const count = Math.max(1, Math.min(6, Number(body.submodules_count ?? 3) || 3));
    const track = trackFor(`${course.title} ${course.description} ${topic}`);
    const plan = [plannedWeekFor(track, topic, count)];
    buildPlan(track, plan, config, { courseId });

    return jobDetail(
      startJob({
        title: topic,
        description: course.title,
        scope: "module",
        trackId: track.id,
        plan,
        config,
        input: { topic, course: course.title, submodules_count: count },
        courseId,
        note: contentTypeNote(config),
      }),
    );
  },

  /** Add one generated topic to a week that already exists. */
  "POST /adaptive-quiz/api/admin/courses/:courseId/modules/:moduleId/submodules/generate/": (req) => {
    const courseId = Number(req.params.courseId);
    const course = builderCourse(courseId);
    if (!course) throw notFound("Course not found");
    const mod = builderModules(courseId).find((m) => m.id === Number(req.params.moduleId));
    if (!mod) throw notFound("Module not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const topic = String(body.topic ?? "").trim();
    if (!topic) throw badRequest({ detail: "Say what this topic should cover." });

    const config = (body.config ?? {}) as Record<string, unknown>;
    const track = trackFor(`${course.title} ${mod.title} ${topic}`);
    const concepts = conceptsForPlanTopic(track, mod.weekno, builderSubmodules(mod.id).length);
    const sub = createSubmodule(mod.id, {
      title: topic,
      description: `Work through ${topic}, then answer the practice questions on it.`,
    });
    attachPlannedContent(
      track,
      sub.id,
      { title: topic, concepts },
      requestedKinds(config),
      questionsPerQuiz(config),
    );

    const plan: PlanWeek[] = [
      {
        week: mod.weekno,
        title: mod.title,
        summary: mod.description,
        moduleId: mod.id,
        topics: [{ title: topic, concepts, submoduleId: sub.id }],
      },
    ];

    return jobDetail(
      startJob({
        title: topic,
        description: mod.title,
        scope: "submodule",
        trackId: track.id,
        plan,
        config,
        input: { topic, course: course.title, module: mod.title },
        courseId,
        note: contentTypeNote(config),
      }),
    );
  },

  /**
   * Fill in only what is missing.
   *
   * Idempotent by construction: it looks at what each topic already holds and
   * adds the other kind, so running it twice adds nothing the second time. A
   * course with nothing missing gets a job that says so rather than a second
   * copy of every lesson.
   */
  "POST /adaptive-quiz/api/admin/courses/:courseId/regenerate-content/": (req) => {
    const courseId = Number(req.params.courseId);
    const course = builderCourse(courseId);
    if (!course) throw notFound("Course not found");
    const config = (req.body ?? {}) as Record<string, unknown>;
    const track = trackFor(`${course.title} ${course.description}`);
    const kinds = requestedKinds(config);
    const perQuiz = questionsPerQuiz(config);

    const plan: PlanWeek[] = [];
    for (const mod of builderModules(courseId)) {
      const topics: PlanTopic[] = [];
      for (const sub of builderSubmodules(mod.id)) {
        const held = builderContents(sub.id);
        const missing = kinds.filter(
          (kind) =>
            !held.some((c) => c.content_type === (kind === "article" ? "Article" : "Quiz")),
        );
        if (missing.length === 0) continue;
        const concepts = conceptsForPlanTopic(track, mod.weekno, topics.length);
        attachPlannedContent(track, sub.id, { title: sub.title, concepts }, missing, perQuiz);
        topics.push({ title: sub.title, concepts, submoduleId: sub.id });
      }
      if (topics.length > 0) {
        plan.push({
          week: mod.weekno,
          title: mod.title,
          summary: mod.description,
          moduleId: mod.id,
          topics,
        });
      }
    }

    return jobDetail(
      startJob({
        title: `${shortCourseName(course.title)}: filling the gaps`,
        description: course.title,
        scope: "full_course",
        trackId: track.id,
        plan,
        config,
        input: {
          course: course.title,
          topics_repaired: plan.reduce((n, w) => n + w.topics.length, 0),
        },
        courseId,
        note:
          plan.length === 0
            ? "Every topic in this course already carries a lesson and a quiz, so nothing was regenerated."
            : contentTypeNote(config),
      }),
    );
  },


  "POST /adaptive-quiz/api/admin/courses/:courseId/modules/": (req) => {
    const mod = createModule(Number(req.params.courseId), (req.body ?? {}) as Record<string, unknown>);
    return {
      id: mod.id,
      weekno: mod.weekno,
      title: mod.title,
      submodules: [],
    };
  },

  "PATCH /adaptive-quiz/api/admin/courses/:courseId/modules/:moduleId/": (req) => {
    const id = Number(req.params.moduleId);
    if (!builderModule(id)) throw notFound("Module not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.module[id] = {
        ...(s.patch.module[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.weekno !== undefined ? { weekno: Number(body.weekno) } : {}),
      };
    });
    const mod = builderModule(id) as BuilderModule;
    return {
      id: mod.id,
      weekno: mod.weekno,
      title: mod.title,
      submodules: builderSubmodules(id).map((sm) => ({
        id: sm.id,
        order: sm.order,
        title: sm.title,
        description: sm.description,
        ...adaptiveContentOf(sm.id),
      })),
    };
  },

  "DELETE /adaptive-quiz/api/admin/courses/:courseId/modules/:moduleId/": (req) => {
    const id = Number(req.params.moduleId);
    if (!builderModule(id)) throw notFound("Module not found");
    const removed = deleteModule(id);
    return { deleted: true, submodules_removed: removed };
  },

  "POST /adaptive-quiz/api/admin/courses/:courseId/modules/:moduleId/submodules/": (req) => {
    const sub = createSubmodule(
      Number(req.params.moduleId),
      (req.body ?? {}) as Record<string, unknown>,
    );
    return {
      id: sub.id,
      order: sub.order,
      title: sub.title,
      description: sub.description,
      ...adaptiveContentOf(sub.id),
    };
  },

  "PATCH /adaptive-quiz/api/admin/submodules/:submoduleId/": (req) => {
    const id = Number(req.params.submoduleId);
    if (!builderSubmodule(id)) throw notFound("Topic not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    mutate((s) => {
      s.patch.submodule[id] = {
        ...(s.patch.submodule[id] ?? {}),
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.description !== undefined ? { description: String(body.description) } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) } : {}),
      };
    });
    const sub = builderSubmodule(id) as BuilderSubmodule;
    return {
      id: sub.id,
      order: sub.order,
      title: sub.title,
      description: sub.description,
      ...adaptiveContentOf(id),
    };
  },

  "DELETE /adaptive-quiz/api/admin/submodules/:submoduleId/": (req) => {
    const id = Number(req.params.submoduleId);
    if (!builderSubmodule(id)) throw notFound("Topic not found");
    deleteSubmodule(id);
    return { deleted: true };
  },

  /** The whole arrangement in one request, so a dropped call cannot half-apply a drag. */
  "POST /adaptive-quiz/api/admin/courses/:courseId/reorder/": (req) => {
    const modules = Array.isArray(req.body?.modules) ? req.body.modules : [];
    let modulesUpdated = 0;
    let submodulesUpdated = 0;

    mutate((s) => {
      for (const m of modules as Array<{ id: number; weekno: number; submodules?: Array<{ id: number; order: number }> }>) {
        s.patch.module[m.id] = { ...(s.patch.module[m.id] ?? {}), weekno: Number(m.weekno) };
        modulesUpdated++;
        for (const sm of m.submodules ?? []) {
          s.patch.submodule[sm.id] = { ...(s.patch.submodule[sm.id] ?? {}), order: Number(sm.order) };
          submodulesUpdated++;
        }
      }
    });

    return { modules_updated: modulesUpdated, submodules_updated: submodulesUpdated };
  },

  /* ────────────────────────── adaptive: adding content to a topic ───────── */

  "POST /adaptive-quiz/api/admin/submodules/:submoduleId/article/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = String(body.title ?? "Untitled article");
    const tier = String(body.reading_tier ?? "Intermediate");
    const item = createItem("Article", title, {
      content: String(body.body ?? ""),
      summary: String(body.summary ?? ""),
      reading_tier: tier,
      reading_time_minutes: Math.max(
        3,
        Math.round(String(body.body ?? "").split(/\s+/).length / 200),
      ),
    });
    attachContent(submoduleId, { title, content_type: "Article", content_id: item.id });
    return { id: item.id, title: item.title, reading_tier: tier };
  },

  "POST /adaptive-quiz/api/admin/submodules/:submoduleId/quiz/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const bankIds = Array.isArray(body.mcq_ids) ? body.mcq_ids.map(Number) : [];
    const written = Array.isArray(body.mcqs) ? (body.mcqs as Record<string, unknown>[]) : [];

    const questions = [
      ...bankIds.map(quizQuestion).filter(Boolean),
      ...written.map((q, i) => ({
        id: 900_000 + i,
        question_text: String(q.question_text ?? ""),
        options: [q.option_a, q.option_b, q.option_c, q.option_d].map((o) => String(o ?? "")),
        correct_option: String(q.correct_option ?? "A"),
        explanation: String(q.explanation ?? ""),
        difficulty_level: String(q.difficulty_level ?? "Medium"),
        topic: String(q.topic ?? ""),
      })),
    ];

    if (questions.length === 0) {
      throw badRequest({ detail: "Pick at least one question from the library, or write one." });
    }

    const title = String(body.title ?? "Check your understanding");
    const item = createItem("Quiz", title, {
      instructions: String(body.instructions ?? ""),
      durating_in_minutes: 15,
      mcqs: questions,
    });
    attachContent(submoduleId, { title, content_type: "Quiz", content_id: item.id });
    return { id: item.id, title, questions: questions.length };
  },

  /**
   * Adding coding practice to a topic. Refused, on purpose.
   *
   * The route stays registered because the authoring dialog can still ask for
   * it, and an unhandled route in this demo answers "No demo handler" straight
   * onto the page, which reads as a broken product rather than a decision. A 400
   * carrying the reason is the honest answer: there is no code judge behind this
   * instance, so a coding card would be a button that grades nothing.
   */
  "POST /adaptive-quiz/api/admin/submodules/:submoduleId/coding/": (req) => {
    if (!builderSubmodule(Number(req.params.submoduleId))) throw notFound("Topic not found");
    throw badRequest({ detail: NO_CODE_JUDGE });
  },

  "POST /adaptive-quiz/api/admin/submodules/:submoduleId/video/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const url = String(body.url ?? "").trim();
    const vimeoId = String(body.vimeo_id ?? "").trim();
    if (!url && !vimeoId) throw badRequest({ detail: "Paste a link or pick a video from the catalog." });

    const title = String(body.title ?? "").trim() || "Video walkthrough";
    const item = createItem("VideoTutorial", title, {
      video_url: url || `https://vimeo.com/${vimeoId}`,
      description: String(body.description ?? ""),
      transcript: "",
    });
    attachContent(submoduleId, { title, content_type: "VideoTutorial", content_id: item.id });

    return {
      id: item.id,
      title,
      source: vimeoId ? ("catalog" as const) : ("external" as const),
      // Honest: check-ins are generated from a transcript, and a pasted link has
      // none. Claiming otherwise would promise the admin something the topic then
      // does not have.
      check_ins_built: false,
      note: vimeoId
        ? "Added from the catalog. Check-in questions are built from the transcript once it finishes processing."
        : "Added as a plain link. Check-in questions need a transcript, so this one has none.",
    };
  },

  "POST /adaptive-quiz/api/admin/submodules/:submoduleId/attachment/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    if (!builderSubmodule(submoduleId)) throw notFound("Topic not found");
    const body = (req.body ?? {}) as Record<string, unknown>;

    const name = String(body.original_name ?? "handout.pdf");
    const mime = String(body.content_type ?? "application/octet-stream");
    const now = nowIso();
    // Handouts hang off the topic's FIRST content row, which is what the lesson
    // page reads them from. A topic with no content yet gets a placeholder row so
    // the handout is not orphaned the moment it is uploaded.
    const first =
      builderContents(submoduleId)[0] ??
      attachContent(submoduleId, {
        title: "Handouts",
        content_type: "Article",
        content_id: newId(),
        marks: 0,
      });

    const attachment: BuilderAttachment = {
      id: newId(),
      content: first.id,
      title: String(body.title ?? name.replace(/\.[^.]+$/, "")),
      // The file itself went through the media endpoint; this route only records
      // which object belongs here, so there is no URL to hand back.
      file_url: null,
      file_type: fileFamily(name, mime),
      original_filename: name,
      file_size: Number(body.size_bytes ?? 0),
      mime_type: mime,
      order: attachmentsOfContent(first.id).length + 1,
      uploaded_by: req.auth?.userId ?? null,
      uploaded_by_name: req.auth?.email ?? null,
      created_at: now,
      updated_at: now,
    };
    mutate((s) => s.attachments.push(attachment));

    return {
      id: attachment.id,
      title: attachment.title,
      kind: attachment.file_type,
      original_name: attachment.original_filename,
      size_bytes: attachment.file_size,
      url: attachment.file_url,
    };
  },

  /** One route for all five content types, as the service says. */
  "PATCH /adaptive-quiz/api/admin/submodules/:submoduleId/content/:kind/:contentId/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    const kind = req.params.kind as ContentKind;
    const objectId = Number(req.params.contentId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const updated: string[] = [];

    if (kind === "attachment") {
      mutate((s) => {
        s.patch.attachment[objectId] = {
          ...(s.patch.attachment[objectId] ?? {}),
          ...(body.title !== undefined ? { title: String(body.title) } : {}),
          updated_at: nowIso(),
        };
      });
      if (body.title !== undefined) updated.push("title");
      return { id: objectId, kind, updated };
    }

    const row = contentRowByObjectId(submoduleId, objectId);
    if (!row) throw notFound("Content not found");

    if (body.title !== undefined) {
      mutate((s) => {
        s.patch.content[row.id] = { ...(s.patch.content[row.id] ?? {}), title: String(body.title) };
      });
      updated.push("title");
    }

    // Bodies only exist for content the visitor authored. A seeded article's
    // prose lives in the article file, not the overlay, so an edit there is
    // reported as untouched rather than silently dropped.
    if (state().items[String(objectId)]) {
      const fields: Record<string, unknown> = {};
      if (body.body !== undefined) {
        fields.content = String(body.body);
        updated.push("body");
      }
      if (body.summary !== undefined) {
        fields.summary = String(body.summary);
        updated.push("summary");
      }
      if (body.instructions !== undefined) {
        fields.instructions = String(body.instructions);
        updated.push("instructions");
      }
      if (body.reading_tier !== undefined) {
        fields.reading_tier = String(body.reading_tier);
        updated.push("reading_tier");
      }
      patchItem(objectId, fields, body.title === undefined ? undefined : String(body.title));
    }

    return { id: objectId, kind, updated };
  },

  "DELETE /adaptive-quiz/api/admin/submodules/:submoduleId/content/:kind/:contentId/": (req) => {
    const submoduleId = Number(req.params.submoduleId);
    const kind = req.params.kind as ContentKind;
    const objectId = Number(req.params.contentId);

    if (kind === "attachment") {
      bury("attachment", objectId);
      mutate((s) => {
        s.attachments = s.attachments.filter((a) => a.id !== objectId);
        delete s.patch.attachment[objectId];
      });
      return { deleted: true, kind, soft: false };
    }

    const row = contentRowByObjectId(submoduleId, objectId);
    if (!row) throw notFound("Content not found");
    deleteContent(row.id);
    // Soft where the model allows it: a learner mid-attempt keeps their session.
    return { deleted: true, kind, soft: kind === "quiz" || kind === "coding" };
  },

  /* ─────────────────────────── adaptive: authoring assistance ───────────── */

  /**
   * What this topic is missing, and what the library already has for it.
   *
   * The rail is a hint, so it never errors: an unknown topic answers with an
   * empty set of gaps rather than a 404 that the dialog would have to swallow.
   */
  "GET /adaptive-quiz/api/admin/submodules/:submoduleId/suggestions/": (req) => {
    const id = Number(req.params.submoduleId);
    const sub = builderSubmodule(id);
    if (!sub) throw notFound("Topic not found");

    const contents = builderContents(id);
    const has = {
      article: contents.some((c) => c.content_type === "Article"),
      quiz: contents.some((c) => c.content_type === "Quiz"),
      coding: contents.some((c) => c.content_type === "CodingProblem"),
      video: contents.some((c) => c.content_type === "VideoTutorial"),
    };

    const WHY = {
      article: "Every topic needs something to read before the practice makes sense.",
      quiz: "Without questions this topic cannot contribute to an aspirant's mastery estimate, and the adaptive engine has nothing to raise or lower.",
    } as const;

    // Only the two kinds this tenant actually ships are ever suggested.
    //
    // Coding is out because there is no code judge here. Video is out because the
    // player is a Vimeo embed and the demo is required to run with no network at
    // all, so a suggested video could only ever become a dead frame on a lesson.
    // Suggesting work a faculty member cannot then complete is worse than an
    // empty rail, which is why this list is not the four the type allows.
    const gaps = (["article", "quiz"] as const)
      .filter((kind) => !has[kind])
      .map((kind) => ({
        kind,
        title: `Add ${kind === "article" ? "an article" : "a quiz"} to ${sub.title}`,
        why: WHY[kind],
      }));

    const needle = sub.title.toLowerCase();
    const matches = <T extends { topic: string }>(rows: T[]) =>
      rows.filter((r) => needle.includes(r.topic.toLowerCase()) || r.topic.toLowerCase().includes(needle.split(" ")[0]));

    const mcqs = mcqBank();

    return {
      submodule: { id: sub.id, title: sub.title },
      has,
      gaps,
      bank_matches: {
        mcqs: (matches(mcqs).length ? matches(mcqs) : mcqs).slice(0, 5).map((q) => ({
          id: q.id,
          question_text: q.question_text,
          difficulty_level: q.difficulty_level,
          topic: q.topic,
        })),
        // Always empty here. The key stays because the dialog reads it.
        coding: codingBank(),
      },
      matched_on: sub.title,
    };
  },

  /** The verified library, paged. `{results, total, offset, limit, note}`. */
  "GET /adaptive-quiz/api/admin/bank/:kind/": (req) => {
    const kind = req.params.kind === "coding" ? "coding" : "mcq";
    const q = (req.query.get("q") ?? "").trim().toLowerCase();
    const difficulty = req.query.get("difficulty") ?? "";
    const topic = (req.query.get("topic") ?? "").trim().toLowerCase();
    const limit = Number(req.query.get("limit") ?? 20);
    const offset = Number(req.query.get("offset") ?? 0);

    // A coding search returns nothing and says why, rather than 404ing on a tab
    // the dialog is entitled to open. See `codingBank`.
    const rows = (kind === "coding" ? codingBank() : mcqBank()).filter((row) => {
      const text = "question_text" in row ? row.question_text : row.title;
      if (q && !text.toLowerCase().includes(q)) return false;
      if (difficulty && row.difficulty_level !== difficulty) return false;
      if (topic && !row.topic.toLowerCase().includes(topic)) return false;
      return true;
    });

    return {
      results: rows.slice(offset, offset + limit),
      total: rows.length,
      offset,
      limit,
      note:
        kind === "coding"
          ? NO_CODE_JUDGE
          : "Questions from the verified library, already reviewed by the subject faculty. Adding them references the originals rather than duplicating them, so a correction reaches every course using the question.",
    };
  },
});

/* ─────────────────────────────────────────────────────────────── helpers */

/** A bank question in the shape the quiz player reads, or null when unknown. */
function quizQuestion(id: number) {
  const found = mcqBank().find((q) => q.id === id);
  if (!found) return null;
  return {
    id: found.id,
    question_text: found.question_text,
    options: [found.options.a, found.options.b, found.options.c, found.options.d],
    correct_option: found.correct_option,
    explanation: found.explanation,
    difficulty_level: found.difficulty_level,
    topic: found.topic,
  };
}

function wizardState() {
  const info = clientInfo();
  return {
    client_id: DEMO_CLIENT,
    organisation_name: DEMO_TENANT.name,
    subdomain: DEMO_TENANT.slug,
    setup_completed: overlay.get<boolean>("wizard:completed", true),
    setup_step: overlay.get<number>("wizard:step", 1),
    total_steps: 6,
    wizard_state: overlay.get<Record<string, unknown>>("wizard:state", {}),
    logo_url: info.app_logo_url ?? null,
    contact_email: DEMO_TENANT.supportEmail,
  };
}

export type { BuilderCourse };
