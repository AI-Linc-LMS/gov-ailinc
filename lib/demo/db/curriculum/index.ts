/**
 * Curriculum loader: authored content, fetched per course, on demand.
 *
 * Why this is lazy rather than a plain import.
 *
 * Authored content is big. Four genuinely different reading tiers, a glossary, a
 * quiz bank and topic-specific coding problems come to roughly 20KB per topic,
 * and there are 70 topics: about 1.5MB. Every handler module is imported at app
 * boot by `handlers/index.ts`, so a static import would put all of it in the
 * first-load bundle of every page, including the login screen. The demo's whole
 * pitch is that navigation is instant, and a megabyte and a half of lesson prose
 * on the critical path is the one thing that would make it not so.
 *
 * A dynamic import per course lets the bundler emit five chunks that are fetched
 * only when someone opens that course. That is same-origin, so it does not
 * violate the no-network rule: it is the same mechanism the app already uses to
 * code-split its own routes.
 *
 * The handler contract allows this: `DemoHandler` may return a Promise and the
 * adapter awaits it, so a route can await the chunk before answering.
 *
 * COVERAGE. Only the courses listed below have authored lessons. Every other
 * course in the catalogue serves the lesson outline from `../article-content.ts`
 * instead, which states plainly that the full text is in preparation and still
 * carries the topic's real concepts, practice and assessment. That is a
 * deliberate, visible state rather than a gap: `scripts/verify-catalogue.mjs`
 * reports which courses are unauthored, and fails any course listed here that
 * authors only part of its topics, which is the failure that hides itself.
 *
 * Adding a course is two lines: author `parts/course-<id>-part-*.ts`, merge them
 * in `course-<id>.ts`, and add the entry here.
 */

import type { AuthoredTopic, CourseCurriculum } from "./types";

export type { AuthoredTopic, AuthoredProblem, AuthoredQuestion, ReadingTier } from "./types";

/**
 * Static map of course id to importer.
 *
 * Written out rather than built from a template string because bundlers can only
 * code-split an import they can see: `import(\`./course-${id}.ts\`)` either fails
 * to split or pulls in every match, which would defeat the point.
 */
const LOADERS: Record<number, () => Promise<{ default: CourseCurriculum }>> = {
  302: () => import("./course-302"),
  307: () => import("./course-307"),
  311: () => import("./course-311"),
};

/** Chunks already fetched. A second visit to a course must not re-parse it. */
const cache = new Map<number, CourseCurriculum>();
/** In-flight fetches, so two concurrent requests share one chunk download. */
const inflight = new Map<number, Promise<CourseCurriculum>>();

export function courseIsAuthored(courseId: number): boolean {
  return courseId in LOADERS;
}

export async function loadCourseCurriculum(courseId: number): Promise<CourseCurriculum> {
  const cached = cache.get(courseId);
  if (cached) return cached;

  const pending = inflight.get(courseId);
  if (pending) return pending;

  const loader = LOADERS[courseId];
  if (!loader) return {};

  const promise = loader()
    .then((mod) => {
      const curriculum = mod.default ?? {};
      cache.set(courseId, curriculum);
      inflight.delete(courseId);
      return curriculum;
    })
    .catch(() => {
      // A chunk that fails to load must degrade to the generated fallback, not
      // take the lesson down. Deleting the in-flight entry lets a later request
      // try again rather than caching the failure forever.
      inflight.delete(courseId);
      return {} as CourseCurriculum;
    });

  inflight.set(courseId, promise);
  return promise;
}

/** The authored record for one topic, or null if nobody has written it yet. */
export async function loadTopic(
  courseId: number,
  topicId: number,
): Promise<AuthoredTopic | null> {
  const curriculum = await loadCourseCurriculum(courseId);
  return curriculum[topicId] ?? null;
}

/**
 * Synchronous read of already-loaded content.
 *
 * For call sites that cannot be made async. Returns null until the course has
 * been loaded once, so callers must treat it as a cache hit, not a lookup, and
 * fall back rather than concluding the topic is unauthored.
 */
export function peekTopic(courseId: number, topicId: number): AuthoredTopic | null {
  return cache.get(courseId)?.[topicId] ?? null;
}

/**
 * Warm a course's chunk without needing its content yet.
 *
 * Called when a learner opens a course overview, so the lesson they click next
 * is already parsed. Failure is ignored: this is an optimisation, and the real
 * load path handles a miss.
 */
export function prefetchCourse(courseId: number): void {
  if (cache.has(courseId) || inflight.has(courseId)) return;
  void loadCourseCurriculum(courseId);
}
