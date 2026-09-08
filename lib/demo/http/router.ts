/**
 * Path router for the demo backend.
 *
 * Patterns use Express-style `:name` segments and a trailing `*` wildcard, e.g.
 *   /api/clients/:clientId/student/courses/:courseId/
 *
 * Matching is specificity-ordered rather than registration-ordered: a pattern
 * with fewer dynamic segments always wins. That prevents the classic shadowing
 * bug where `/courses/:id` registered first swallows `/courses/catalog`, which
 * would be near-impossible to spot in a demo (the page would just render the
 * wrong fixture rather than fail).
 */

import type { DemoHandler, DemoRoute, HttpMethod } from "./types";

const routes: DemoRoute[] = [];
let sorted = false;

/** Register one route. Called by the handler modules at import time. */
export function route(
  method: HttpMethod,
  pattern: string,
  handler: DemoHandler,
  module = "unknown",
): void {
  routes.push({ method, pattern: normalize(pattern), handler, module });
  sorted = false;
}

/** Register many routes for one module in a single call. */
export function defineRoutes(
  module: string,
  table: Record<string, DemoHandler>,
): void {
  for (const [key, handler] of Object.entries(table)) {
    const idx = key.indexOf(" ");
    const method = key.slice(0, idx).toUpperCase() as HttpMethod;
    const pattern = key.slice(idx + 1);
    route(method, pattern, handler, module);
  }
}

/** Trailing slashes are inconsistent across this API; treat them as equivalent. */
function normalize(path: string): string {
  const withoutQuery = path.split("?")[0];
  const trimmed = withoutQuery.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function segmentsOf(pattern: string): string[] {
  return normalize(pattern).split("/").filter(Boolean);
}

/** Dynamic-segment count, then shorter-is-less-specific. Lower sorts first. */
function specificity(pattern: string): [number, number] {
  const segs = segmentsOf(pattern);
  const dynamic = segs.filter((s) => s.startsWith(":") || s === "*").length;
  return [dynamic, -segs.length];
}

function ensureSorted(): void {
  if (sorted) return;
  routes.sort((a, b) => {
    const [ad, al] = specificity(a.pattern);
    const [bd, bl] = specificity(b.pattern);
    return ad - bd || al - bl;
  });
  sorted = true;
}

export interface RouteMatch {
  route: DemoRoute;
  params: Record<string, string>;
}

/** Find the most specific route matching this method + path, or null. */
export function matchRoute(method: string, path: string): RouteMatch | null {
  ensureSorted();
  const wanted = method.toUpperCase();
  const target = segmentsOf(path);

  for (const candidate of routes) {
    if (candidate.method !== wanted) continue;
    const pattern = segmentsOf(candidate.pattern);
    const params = tryMatch(pattern, target);
    if (params) return { route: candidate, params };
  }
  return null;
}

function tryMatch(
  pattern: string[],
  target: string[],
): Record<string, string> | null {
  const params: Record<string, string> = {};

  for (let i = 0; i < pattern.length; i++) {
    const seg = pattern[i];

    // `*` absorbs the rest of the path — used for a few catch-all namespaces.
    if (seg === "*") return params;

    if (i >= target.length) return null;

    if (seg.startsWith(":")) {
      params[seg.slice(1)] = decodeURIComponent(target[i]);
      continue;
    }
    if (seg !== target[i]) return null;
  }

  return pattern.length === target.length ? params : null;
}

/** Every registered route, for the coverage report. */
export function registeredRoutes(): readonly DemoRoute[] {
  ensureSorted();
  return routes;
}
