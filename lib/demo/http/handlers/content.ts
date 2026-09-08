/**
 * Submodule content: the lesson page, the article reader, the per-topic points
 * breakdown and learner-generated extra practice.
 *
 * The article reader is where a prospect stops skimming and starts reading, so
 * the bodies in `lib/demo/db/article-content.ts` are real prose rather than
 * placeholder text. Everything here reads from the same topic records the
 * dashboard and journey board use, so a lesson marked done on the board opens
 * with its items already ticked.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound, type DemoRequest } from "../types";
import { topicById, type DemoTopic } from "../../db/courses";
import { articleBody, type ReadingTier } from "../../db/article-content";
import { loadCourseCurriculum } from "../../db/curriculum";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { seededInt } from "../../random";
import { conceptsFor, submoduleFor, ARTICLE_ID, QUIZ_ID, CODING_ID, VIDEO_ID } from "./adaptive-courses";

const MODULE = "content";

const READING_TIERS: ReadingTier[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function isTier(value: string | null): value is ReadingTier {
  return value !== null && (READING_TIERS as string[]).includes(value);
}

/** Article ids are topic ids offset by a fixed namespace, so the map back is exact. */
function topicForArticle(articleId: number) {
  return topicById(articleId - 100_000);
}

/** Items the visitor finished during this session. */
function markComplete(contentId: number): void {
  overlay.update<number[]>("adaptive:completed", [], (list) =>
    list.includes(contentId) ? list : [...list, contentId],
  );
}

function isComplete(topic: DemoTopic, contentId: number): boolean {
  return topic.progress === 100 || overlay.get<number[]>("adaptive:completed", []).includes(contentId);
}

/** Points on offer for one piece of content, by kind. */
const POINTS = { article: 25, quiz: 60, coding: 90, video: 30 } as const;

/** Re-render an article at another reading tier. Shared by the POST and GET routes. */
async function articleTier(req: DemoRequest) {
  const found = topicForArticle(Number(req.params.articleId));
  if (!found) throw notFound("Article not found");
  const tier: ReadingTier = isTier(req.params.tier) ? req.params.tier : "Intermediate";
  // The authored body lives in a per-course chunk. Await it before reading, or
  // the synchronous lookup misses and the lesson silently falls back to the
  // generated scaffold that made every article read the same.
  await loadCourseCurriculum(found.course.id);
  const body = articleBody(found.topic, tier, conceptsFor(found.topic), found.course.id);
  return {
    tier,
    content_html: body.html,
    reading_time_minutes: body.readingMinutes,
  };
}

defineRoutes(MODULE, {
  /** The lesson page: one topic and everything inside it. */
  "GET /adaptive-quiz/api/courses/:courseId/submodules/:submoduleId/": async (req) => {
    const found = topicById(Number(req.params.submoduleId));
    if (!found) throw notFound("Submodule not found");
    // The lesson page is the doorway to the article, the quiz and the coding
    // set, so warming the course chunk here means all three open instantly and
    // the reading time on this page matches the article the learner then opens.
    await loadCourseCurriculum(found.course.id);
    const order = found.module.topics.indexOf(found.topic) + 1;
    return submoduleFor(found.topic, order, found.course.id);
  },

  /**
   * Per-topic points breakdown: what each item is worth, and what has been
   * earned. The numbers agree with the journey board because both are derived
   * from the topic's own progress rather than stored separately.
   */
  "GET /adaptive-quiz/api/courses/:courseId/submodules/:submoduleId/points/": (req) => {
    const found = topicById(Number(req.params.submoduleId));
    if (!found) throw notFound("Submodule not found");
    const { topic } = found;

    const items = topic.kinds
      .map((kind) => {
        // `coding` and `video` cannot occur in this tenant's catalogue: every
        // topic in `db/courses.ts` is an article, a quiz or an assignment, by
        // the build brief's decision that a mission teaching recruitment exams
        // and vocational trades has no code judge and no bundled video. The two
        // branches stay because this map is the complete statement of what a
        // topic can hold, and a partial one would quietly return null for a kind
        // the product does support.
        const map = {
          article: { id: ARTICLE_ID(topic), on_offer: POINTS.article, detail: "Read the lesson" },
          quiz: { id: QUIZ_ID(topic), on_offer: POINTS.quiz, detail: "Adaptive quiz" },
          coding: { id: CODING_ID(topic), on_offer: POINTS.coding, detail: "Coding practice set" },
          video: { id: VIDEO_ID(topic), on_offer: POINTS.video, detail: "Video with check-ins" },
          assignment: { id: topic.id, on_offer: 150, detail: "Graded assignment" },
        } as const;
        const meta = map[kind];
        if (!meta) return null;

        const earnedAll = isComplete(topic, meta.id);
        return {
          kind: kind === "assignment" ? "coding" : kind,
          title: topic.title,
          detail: meta.detail,
          content_key: `${kind}:${meta.id}`,
          on_offer: meta.on_offer,
          earned: earnedAll ? meta.on_offer : 0,
          status: earnedAll ? "earned" : "available",
          breakdown: earnedAll
            ? {
                base: meta.on_offer,
                after_decay: meta.on_offer,
                correctness_factor: 1,
                late_penalty_mult: 1,
                weight: 1,
                earned_at: isoDaysAgo(seededInt(`earned:${meta.id}`, 1, 30)),
              }
            : undefined,
        };
      })
      .filter((i): i is NonNullable<typeof i> => i !== null);

    return {
      topic: {
        earned: items.reduce((sum, i) => sum + i.earned, 0),
        on_offer: items.reduce((sum, i) => sum + i.on_offer, 0),
      },
      items,
    };
  },

  /** The article reader. */
  "GET /adaptive-quiz/api/articles/:articleId/": async (req) => {
    const found = topicForArticle(Number(req.params.articleId));
    if (!found) throw notFound("Article not found");

    const requested = req.query.get("tier");
    const tier: ReadingTier = isTier(requested) ? requested : "Intermediate";
    await loadCourseCurriculum(found.course.id);
    const body = articleBody(found.topic, tier, conceptsFor(found.topic), found.course.id);

    return {
      id: Number(req.params.articleId),
      title: found.topic.title,
      default_tier: "Intermediate",
      rendered_tier: tier,
      available_tiers: READING_TIERS,
      content_html: body.html,
      reading_time_minutes: body.readingMinutes,
      summary: body.summary,
      concepts: body.concepts,
      glossary: body.glossary,
      explain_terms: Object.keys(body.glossary),
    };
  },

  /**
   * Re-render at another reading tier. This is one of the product's better
   * demos - the same lesson, rewritten simpler or deeper on request - so the
   * hand-written articles carry genuinely different bodies per tier rather than
   * the same text with a label swapped.
   */
  // POST, not GET: re-rendering a tier is a write on the server (it can generate
  // and cache the rewritten body). Registered as GET first, which the reader
  // silently ignored — the tier buttons did nothing and the body never changed.
  // Both verbs are served so neither call style can miss.
  "POST /adaptive-quiz/api/articles/:articleId/tier/:tier/": (req) => articleTier(req),
  "GET /adaptive-quiz/api/articles/:articleId/tier/:tier/": (req) => articleTier(req),

  /** "Explain this term", the inline AI helper in the reader. */
  "POST /adaptive-quiz/api/articles/:articleId/explain/": async (req) => {
    const found = topicForArticle(Number(req.params.articleId));
    if (!found) throw notFound("Article not found");
    const term = String(req.body?.term ?? req.body?.selection ?? "").trim();
    if (!term) throw badRequest({ detail: "Select a term to explain." });

    await loadCourseCurriculum(found.course.id);
    const body = articleBody(found.topic, "Intermediate", conceptsFor(found.topic), found.course.id);
    const known = body.glossary[term];

    return {
      explanation: known
        ? `${known} In the context of ${found.topic.title.toLowerCase()}, this is the idea the rest of the lesson builds on.`
        : `"${term}" is used here in its ordinary sense for this field. It appears in ${found.topic.title.toLowerCase()} because the lesson needs a precise word for the thing it keeps referring to.`,
      followups: {
        even_simpler: `Put "${term}" in one sentence, with no jargon.`,
        show_diagram: `Show me "${term}" as a diagram.`,
        real_example: `Give me a worked example of "${term}", the way it would come up in the exam or on the job.`,
      },
    };
  },

  /** "Summarise this lesson". */
  "POST /adaptive-quiz/api/articles/:articleId/summarise/": async (req) => {
    const found = topicForArticle(Number(req.params.articleId));
    if (!found) throw notFound("Article not found");
    await loadCourseCurriculum(found.course.id);
    const body = articleBody(found.topic, "Intermediate", conceptsFor(found.topic), found.course.id);

    return {
      summary_html: `<p>${body.summary}</p>`,
      bullets: body.concepts.map((c) => `${c} is one of the ideas this lesson turns into practice.`),
    };
  },

  /** Marking an article read awards its points and persists for the session. */
  "POST /adaptive-quiz/api/articles/:articleId/complete/": (req) => {
    const articleId = Number(req.params.articleId);
    const found = topicForArticle(articleId);
    if (!found) throw notFound("Article not found");

    const already = isComplete(found.topic, articleId);
    markComplete(articleId);
    return {
      completed: true,
      points_awarded: already ? 0 : POINTS.article,
      already_completed: already,
    };
  },

  /**
   * Learner-generated extra practice. Capped, as in production: the limit is
   * part of the feature (it is what stops a learner grinding generated content
   * instead of the course), so showing it uncapped would misrepresent it.
   */
  "GET /adaptive-quiz/api/courses/:courseId/submodules/:submoduleId/practice/": (req) => {
    const key = `practice:${req.params.submoduleId}`;
    const items = overlay.get<unknown[]>(key, []);
    const limit = 5;
    return {
      usage: {
        used: items.length,
        limit,
        left: Math.max(0, limit - items.length),
        by_kind: {
          quiz: items.filter((i) => (i as { kind: string }).kind === "quiz").length,
          coding: items.filter((i) => (i as { kind: string }).kind === "coding").length,
          article: items.filter((i) => (i as { kind: string }).kind === "article").length,
        },
      },
      items,
    };
  },

  "POST /adaptive-quiz/api/courses/:courseId/submodules/:submoduleId/practice/generate/": (req) => {
    const found = topicById(Number(req.params.submoduleId));
    if (!found) throw notFound("Submodule not found");

    const key = `practice:${req.params.submoduleId}`;
    const existing = overlay.get<unknown[]>(key, []);
    const limit = 5;
    if (existing.length >= limit) {
      throw badRequest({ detail: "You have used all of this topic's extra practice." });
    }

    const kind = String(req.body?.kind ?? "quiz") as "quiz" | "coding" | "article";
    const difficulty = String(req.body?.difficulty ?? "match");
    const id = `practice-${nextDemoId("practice")}`;

    const item = {
      id,
      kind,
      title: `${found.topic.title} - extra ${kind} (${difficulty})`,
      item_count: kind === "coding" ? 3 : kind === "quiz" ? 8 : 1,
      created_at: iso(new Date(nowMs())),
      config_id: kind === "quiz" ? QUIZ_ID(found.topic) : undefined,
      problem_id: kind === "coding" ? CODING_ID(found.topic) + 1 : null,
    };

    const items = [item, ...existing];
    overlay.set(key, items);

    return {
      item,
      usage: {
        used: items.length,
        limit,
        left: Math.max(0, limit - items.length),
        by_kind: {
          quiz: items.filter((i) => (i as { kind: string }).kind === "quiz").length,
          coding: items.filter((i) => (i as { kind: string }).kind === "coding").length,
          article: items.filter((i) => (i as { kind: string }).kind === "article").length,
        },
      },
      items,
    };
  },
});
