"use client";

import { useEffect, useState } from "react";

/**
 * Chart palette for the student-performance dashboard, on the TSEM government palette.
 *
 * These values are NOT eyeballed. Every set below was run through the data-viz
 * validator (lightness band, chroma floor, CVD separation under Machado 2009,
 * normal-vision floor, contrast vs surface) and the numbers quoted are its output:
 *
 *   series, all-pairs (the scatter is an all-pairs form)
 *       worst CVD dE 6.5 (gold/green) - floor band, legal only with the secondary
 *       encoding every chart here already ships; worst normal-vision dE 17.4 PASS.
 *       The three activity kinds this catalogue actually contains - quiz, article,
 *       assignment - score far better: worst 21.3 CVD / 22.5 normal, both PASS.
 *   ordinal (Easy -> Hard)      monotone L, gaps >= 0.06, light end 2.41:1, 1 deg hue spread - ALL PASS
 *   sequential (heatmap)        monotone L, gaps >= 0.06, light end 2.41:1, 3 deg hue spread - ALL PASS
 *
 * Two properties of the pinned government palette are accepted, not fixed, because the
 * ramp is fixed upstream in lib/theme/normalizeThemeSettings.ts and inventing a hue to
 * satisfy a check would be worse than the check:
 *  - Institutional blue and brown sit a hair under the validator's 0.43 lightness floor
 *    (0.426 and 0.424). They are deliberately deep, printed-document colours.
 *  - Teal, light blue and brown sit under the 0.10 chroma floor. They read as muted
 *    institutional tones rather than saturated identity hues, which is the intent.
 *
 * Consequences baked into the components:
 *  - Light blue #85aad6 is 2.41:1 on white, so the RELIEF RULE applies wherever it is
 *    used as a mark: every chart ships a legend, selective direct labels, and a table
 *    view, so no value is ever carried by that fill alone.
 *  - Gold and green are the weakest CVD pair (6.5). They are never the only signal:
 *    stacked and grouped bars carry a 2px surface gap plus a legend, and the ladder
 *    and status rows carry a written label.
 *  - Difficulty is an ORDERED category, so it uses the one-hue ordinal ramp, never the
 *    categorical hues (a value-ramp on nominal categories is an anti-pattern, and
 *    categorical hues on ordered data throw away the ordering).
 *
 * Status colors are RESERVED for risk signals and always ship with an icon + label,
 * so a color never carries meaning alone. Serious and critical are two steps of the
 * one institutional red the palette provides, so they separate by lightness (6.68:1
 * and 9.05:1 on white) and by their distinct icons, never by hue.
 */

export interface VizPalette {
  isDark: boolean;
  surface: string;
  grid: string;
  axis: string;
  inkPrimary: string;
  inkSecondary: string;
  inkMuted: string;
  /** Categorical, fixed order - assigned by entity, never by rank.
   *  `assignment` is present because this catalogue really does set assignments; without
   *  it the scatter and the timeline fell back to the quiz hue and two different kinds of
   *  work were painted the same colour. `coding` and `video` are kept because the type is
   *  read elsewhere, but no course in this catalogue contains either. */
  series: { quiz: string; coding: string; video: string; article: string; assignment: string };
  /** Ordinal ramp for ordered categories (Easy → Medium → Hard). */
  ordinal: [string, string, string];
  /** Sequential ramp (light→dark) for continuous magnitude, e.g. the heatmap. */
  sequential: string[];
  /** Reserved status tokens - never reused as a series color. */
  status: { good: string; warning: string; serious: string; critical: string };
}

const LIGHT: VizPalette = {
  isDark: false,
  surface: "#ffffff",
  // Grid recedes almost to the card (1.29:1); the axis and reference lines are the one
  // mid neutral (4.62:1) so a threshold annotation stays readable. Never an accent.
  grid: "#dde3eb",
  axis: "#6b7684",
  inkPrimary: "#111a26",
  inkSecondary: "#4a5563",
  inkMuted: "#6b7684",
  // Roles are assigned so that the pairs which actually touch on screen are the strong
  // ones: quiz/coding are the two rings side by side (19.5), coding/video are the grouped
  // bars in "Skill mastery" (8.0), and quiz/article/assignment are the scatter's all-pairs
  // set (21.3 worst). Green stays on mastery, where "good" is the honest reading.
  series: { quiz: "#1b4f8a", coding: "#0e7a3c", video: "#6b4423", article: "#b7791f", assignment: "#85aad6" },
  ordinal: ["#85aad6", "#4a7fbb", "#12365f"],
  sequential: ["#85aad6", "#4a7fbb", "#1b4f8a", "#12365f", "#0a1e37"],
  status: { good: "#0e7a3c", warning: "#b7791f", serious: "#b32020", critical: "#8f1919" },
};

// DARK IS UNREACHABLE IN THIS BUILD and is not a validated set. `--card-bg` is #ffffff
// unconditionally, so `surfaceIsDark()` never returns true; this column exists only so the
// shape stays whole. It carries government values rather than the retired violet/pink it
// used to, but the pinned palette has no light steps for green, red or brown, and the best
// five-value set it can form on #10263f still scores 11.7 on the normal-vision floor
// (gate: 15). Re-derive this column from real dark tokens before any dark theme ships;
// do not treat it as validated.
const DARK: VizPalette = {
  isDark: true,
  surface: "#10263f",
  grid: "#1b4f8a",
  axis: "#4a7fbb",
  inkPrimary: "#ffffff",
  inkSecondary: "#dde3eb",
  inkMuted: "#b6cde8",
  series: { quiz: "#85aad6", coding: "#3f8f9e", video: "#b7791f", article: "#b6cde8", assignment: "#e6f1f2" },
  ordinal: ["#12365f", "#4a7fbb", "#85aad6"],
  sequential: ["#0a1e37", "#12365f", "#1b4f8a", "#4a7fbb", "#85aad6"],
  status: { good: "#0e7a3c", warning: "#b7791f", serious: "#b32020", critical: "#8f1919" },
};

/** Series color keyed by the backend's `activity_type`. */
export const ACTIVITY_LABEL: Record<string, string> = {
  quiz: "Quizzes",
  coding: "Coding",
  video: "Videos",
  article: "Articles",
  assignment: "Assignments",
};

/** Parse `#rgb`, `#rrggbb` or `rgb(r,g,b)` into [r,g,b]; null if unrecognised. */
function parseColor(raw: string): [number, number, number] | null {
  const s = raw.trim();
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

/** WCAG relative luminance. */
function luminance([r, g, b]: [number, number, number]): number {
  const lin = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** True when the chart's actual surface is dark. */
function surfaceIsDark(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--card-bg");
  const rgb = parseColor(raw || "");
  return rgb ? luminance(rgb) < 0.5 : false;
}

/**
 * Picks the palette from the SURFACE THE CHART ACTUALLY RENDERS ON, not the OS.
 *
 * This used to follow `prefers-color-scheme`. That was wrong: this app has no dark theme -
 * `--card-bg` is `#ffffff` unconditionally - so a viewer whose OS was in dark mode got the
 * dark ramp painted onto a white card. Every empty heatmap cell rendered near-black and the
 * Less→More legend ran backwards. Reading the resolved surface token is correct today, adapts
 * to tenant theming, and will pick up a real dark theme automatically if one is ever added.
 *
 * Recharts needs concrete color strings, not `var(--x)`, hence resolving to hex here.
 */
export function useVizPalette(): VizPalette {
  // Light on the server and first paint: the app's surface is light, so this never flashes.
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(surfaceIsDark());
    sync();

    // Re-read whenever the theme could have changed the resolved token.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-hydrated"],
    });
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      mq?.removeEventListener("change", sync);
    };
  }, []);

  return dark ? DARK : LIGHT;
}

/** Empty (zero-activity) heatmap cell - recedes toward the surface, never a dark block. */
export const emptyCell = (p: VizPalette) => (p.isDark ? "#071426" : "#eef1f5");

/** Bucket a magnitude onto the sequential ramp (heatmap cells).
 *
 * Uses ceil-then-decrement so the ends are exact: the smallest non-zero count lands on the
 * lightest step and `value === max` lands on the darkest. (A plain `floor(value/max * n)`
 * skips step 0, and `floor((value-1)/max * n)` paints the busiest day as the emptiest when
 * max is 1.)
 */
export function sequentialStep(p: VizPalette, value: number, max: number): string {
  if (value <= 0 || max <= 0) return emptyCell(p);
  const n = p.sequential.length;
  const i = Math.min(n - 1, Math.max(0, Math.ceil((value / max) * n) - 1));
  return p.sequential[i];
}

/** Khan-style mastery ladder → an ordered swatch + human label. */
export const MASTERY_LADDER: { key: string; label: string }[] = [
  { key: "not_started", label: "Not started" },
  { key: "attempted", label: "Attempted" },
  { key: "familiar", label: "Familiar" },
  { key: "proficient", label: "Proficient" },
  { key: "mastered", label: "Mastered" },
];
