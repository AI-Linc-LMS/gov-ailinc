/**
 * Article bodies for the reader.
 *
 * The reader is where an officer stops skimming and actually reads, so filler
 * would be caught immediately. This file answers one question: what does a
 * lesson show when nobody has authored it yet.
 *
 * Real lessons live in `lib/demo/db/curriculum/`, keyed by topic id, four
 * reading tiers each. That is the first and by far the best source, and
 * `articleBody` prefers it whenever the course chunk has been loaded.
 *
 * The catalogue is 428 topics across 19 courses and they are authored course by
 * course, so at any moment some courses are fully written and others are not.
 * What this file provides for the rest is an OUTLINE, not a pretend lesson: the
 * concepts the topic genuinely covers, how the material is meant to be worked,
 * how it is assessed, and a plain statement that the full text is in
 * preparation. An outline that admits what it is costs far less credibility than
 * four paragraphs of confident vagueness about an exam syllabus, which is what a
 * generated "lesson" would have to be.
 *
 * The upstream version of this file also carried four hand-written articles
 * keyed by topic TITLE, from the software catalogue this fork came from. Not one
 * of those titles exists here, so they could never be selected and were removed.
 * Title keys are a bad index anyway: a copy edit to a course title silently
 * disconnects its article, which is exactly why the curriculum is keyed by id.
 */

import type { DemoTopic } from "./courses";
import { peekTopic } from "./curriculum";

export type ReadingTier = "Beginner" | "Intermediate" | "Advanced" | "Expert";

/** Escape text that is interpolated into generated HTML. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * What the practice after this lesson will be, named honestly.
 *
 * The upstream version had a branch for coding problems. No topic in this
 * catalogue declares a coding kind, and this product line has no code judge, so
 * that branch could only ever have produced a promise the platform cannot keep.
 */
function practiceFor(topic: DemoTopic): string {
  const kinds = new Set(topic.kinds);
  if (kinds.has("quiz") && kinds.has("assignment")) {
    return "an adaptive quiz and a written assignment your faculty reviews";
  }
  if (kinds.has("quiz")) {
    return "an adaptive quiz that raises or lowers its difficulty as you answer";
  }
  if (kinds.has("assignment")) {
    return "a written assignment your faculty reviews";
  }
  return "practice in the topics that follow";
}

/**
 * Tier-specific guidance for working through an outline.
 *
 * The four tiers genuinely differ here, because the tier selector is on screen
 * and says they do. A fallback that returned one body for all four would be the
 * platform contradicting itself two clicks from the claim, which is worse than
 * having no tier selector at all. What differs is what the tier ASSUMES about
 * the reader and therefore what it tells them to do, which is the same axis the
 * authored lessons differ on.
 */
const TIER_GUIDANCE: Record<ReadingTier, { label: string; html: string }> = {
  Beginner: {
    label: "starting from the beginning",
    html: `
<h2>How to work through it</h2>
<p>Take the terms above one at a time. Say each one out loud in your own words before moving to
the next, and write the ones you cannot yet explain in a separate page of your notebook. That page
is what you bring to your faculty or to the batch discussion.</p>
<p>Do not try to memorise anything on the first pass. Understand what the topic is about, then
come back. Most candidates who struggle here are trying to remember before they have understood,
which takes longer and does not hold.</p>`,
  },
  Intermediate: {
    label: "the standard treatment",
    html: `
<h2>How to work through it</h2>
<p>Read once for the shape of the topic without stopping at unfamiliar terms, then read again and
work each example yourself before looking at the answer. The second pass is where the material
lands. The first is orientation.</p>
<p>Anything you cannot explain in one sentence out loud is the thing to carry into the practice
that follows. That is a specific signal worth acting on, unlike a general feeling of unease.</p>`,
  },
  Advanced: {
    label: "for a repeat attempt or working practice",
    html: `
<h2>Where the marks and the mistakes are</h2>
<p>You have most likely met this topic before, so the useful question is not what it means but
where it costs you. Go through the concepts above and mark each one honestly: solid, shaky, or
never actually tested under time. Only the last two deserve your hours.</p>
<p>Work the practice for this topic first and read afterwards. If you clear it comfortably, your
time belongs to a different topic, and knowing that is worth more than another reading.</p>`,
  },
  Expert: {
    label: "for the last month, or for someone already doing the work",
    html: `
<h2>Recall pass</h2>
<p>Treat the concepts above as a checklist rather than a reading. Cover the list, reconstruct it
from memory, then check what you dropped. What you drop twice is what goes on the single revision
sheet you actually carry into the final week.</p>
<p>Then take the practice cold, without revising first. A score under time is information. A
comfortable re-reading is not.</p>`,
  },
};

/**
 * The outline shown for a topic whose full lesson is not yet authored.
 *
 * Structured honestly: a real orientation, the concepts the topic actually
 * covers, how it is assessed, and a statement of what this page is. It invents
 * no facts about an examination syllabus or a trade procedure, which is the
 * failure that would matter if an officer who knows the subject read closely.
 */
function outlineBody(topic: DemoTopic, concepts: string[], tier: ReadingTier): string {
  const title = esc(topic.title);
  const items = concepts.map((c) => `<li><strong>${esc(c)}</strong></li>`).join("\n  ");
  const guidance = TIER_GUIDANCE[tier] ?? TIER_GUIDANCE.Intermediate;

  return `
<p class="lead">${title} sits inside a sequence: it rests on the topics before it and several
later ones rest on it, so it is worth slowing down here.</p>

<h2>What this topic covers</h2>
<ul>
  ${items}
</ul>
${guidance.html}

<h2>How it is assessed</h2>
<p>This topic is followed by ${practiceFor(topic)}. Your answers update your skill profile, which
is what decides the difficulty of what the platform gives you next in this course, and what your
faculty sees on the batch report.</p>

<aside class="tip">
  <p><strong>This is the lesson outline, ${esc(guidance.label)}.</strong> The full text for this
  topic is still being written by the subject faculty. The concepts, the practice and the
  assessment above are live and are what this topic is actually built on. Use the tier selector to
  re-render any lesson for a different starting point.</p>
</aside>
`;
}

export interface ArticleBody {
  summary: string;
  concepts: string[];
  glossary: Record<string, string>;
  html: string;
  readingMinutes: number;
}

/**
 * Reading time, derived from the text actually being shown.
 *
 * One function, because an audit found the same article claiming 14 minutes on
 * the course card, 6 in the lesson header, and carrying about a minute of prose.
 * Anything that displays a reading time must call this on the same HTML the
 * reader will get, or the three numbers drift apart again.
 */
export function readingMinutesFor(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * The article for a topic, at the requested reading tier.
 *
 * Two sources, in priority order:
 *   1. The authored curriculum (lib/demo/db/curriculum) if its course chunk has
 *      been loaded. Call `loadCourseCurriculum(courseId)` before this, since the
 *      lookup is a synchronous cache read: a miss means "not loaded yet", not
 *      "not written".
 *   2. The outline above, for a topic whose lesson is not yet authored.
 *
 * The signature is unchanged from upstream because handlers/content.ts and
 * handlers/course-builder.ts both call it with these four arguments.
 */
export function articleBody(
  topic: DemoTopic,
  tier: ReadingTier,
  fallbackConcepts: string[],
  courseId?: number,
): ArticleBody {
  const curriculum = courseId == null ? null : peekTopic(courseId, topic.id);
  if (curriculum) {
    const html = curriculum.body[tier] ?? curriculum.body.Intermediate;
    return {
      summary: curriculum.summary,
      concepts: curriculum.concepts,
      glossary: curriculum.glossary,
      html,
      readingMinutes: readingMinutesFor(html),
    };
  }

  const concepts = fallbackConcepts;
  const html = outlineBody(topic, concepts, tier);
  return {
    summary: `The outline for ${topic.title.toLowerCase()}: what it covers, how to work through it, and how it is assessed.`,
    concepts,
    glossary: {},
    html,
    readingMinutes: readingMinutesFor(html),
  };
}

/**
 * Whether a topic has a full authored lesson rather than an outline.
 *
 * Reads the curriculum cache, so it answers "loaded and authored". A topic in a
 * course whose chunk has not been fetched yet reports false, which is why this
 * is only safe for presentation hints and never for deciding whether to fetch.
 */
export function isAuthored(topic: DemoTopic, courseId?: number): boolean {
  return courseId != null && peekTopic(courseId, topic.id) != null;
}
