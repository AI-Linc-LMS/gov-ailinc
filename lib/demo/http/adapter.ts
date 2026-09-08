/**
 * The axios adapter that replaces the network in demo mode.
 *
 * The real app funnels every API call through a single `axios.create()` instance
 * (`lib/services/api.ts`), which is why this prototype needs exactly one seam:
 * swap that instance's adapter and all 60+ service modules are served locally,
 * with their interceptors, error handling and loading states untouched. Nothing
 * in `lib/services/*`, `components/*` or `app/*` has to know demo mode exists.
 *
 * Responses are shaped like real AxiosResponses and failures like real
 * AxiosErrors, so the app's existing 401/404/500 handling behaves exactly as it
 * does against the production backend.
 */

import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { DEMO_LATENCY_MS } from "../config";
import { readDemoToken } from "../jwt";
import { matchRoute } from "./router";
import { DemoHttpError, type DemoRequest, type HttpMethod } from "./types";

/**
 * Routes the app asked for that nothing handles.
 *
 * This matters more here than it looks. Most services in this codebase catch
 * their own errors and return `[]`, so a missing handler does not throw — it
 * renders a silently empty widget that looks like a real (but boring) state.
 * On a sales call that is the worst possible failure mode, so every miss is
 * recorded and logged loudly in development.
 */
const unhandled = new Map<string, number>();

export function unhandledRoutes(): Array<{ route: string; count: number }> {
  return [...unhandled.entries()]
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count);
}

function recordMiss(method: string, path: string): void {
  const key = `${method} ${path}`;
  unhandled.set(key, (unhandled.get(key) ?? 0) + 1);
  // Loud in dev, and always available via `__demo.unhandled()`. Never rendered:
  // see `missBody` for why the diagnostic and the on-screen text are separate.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[demo] No handler for ${key} — the page will degrade to an empty state. ` +
        `Add a handler in lib/demo/http/handlers/.`,
    );
  }
}

/**
 * What a miss returns to the page.
 *
 * The diagnostic and the thing a visitor can read are deliberately different
 * strings. This used to throw with `detail: "No demo handler for GET /..."`, and
 * because every page in this codebase surfaces `detail` through
 * `getAxiosErrorDetail`, that internal text was rendered in a red banner — on
 * the admin course form, the quiz library, the community, six routes in all. A
 * prospect reading our debug output is worse than any dead end, so a miss can
 * never again produce text written for a developer.
 *
 * A GET degrades to an EMPTY SUCCESS rather than an error: the page then renders
 * the empty state it was designed for instead of a failure banner. The shape is
 * guessed from the path, because most consumers here read either a bare array or
 * a `{count, results}` envelope, and handing a list page an object is the one
 * mistake that crashes rather than empties.
 *
 * Writes still fail — inventing a success would tell someone their course was
 * created and then not show it in the list, which is a worse lie than an error —
 * but they fail with product language.
 */
const COLLECTION_HINT =
  /\/(list|all|results|search)\/?$|s\/?$|s\/\d+\/(items|entries)\/?$/i;

/**
 * A degraded collection is a BARE ARRAY that also answers `.results` and
 * `.count`.
 *
 * Guessing between the two shapes is not possible from the path, and guessing
 * wrong is worse than not degrading at all: the quiz library reads the response
 * directly and calls `.filter` on it, so returning `{count, results}` there
 * replaced a missing-handler empty state with a full-page crash reading
 * "v.filter is not a function".
 *
 * An array with the envelope's fields attached satisfies both readers at once.
 * `results` is self-referential on purpose, so `data.results.map(...)` and
 * `data.map(...)` walk the same (empty) list.
 */
function emptyCollection(): unknown {
  const rows: unknown[] = [];
  return Object.assign(rows, { count: 0, next: null, previous: null, results: rows });
}

function missBody(method: string, path: string): { status: number; body: unknown } | null {
  if (method !== "GET") return null;
  const base = path.split("?")[0];
  return COLLECTION_HINT.test(base)
    ? { status: 200, body: emptyCollection() }
    : { status: 200, body: {} };
}

/**
 * Optional artificial delay. Zero by default (see DEMO_LATENCY_MS).
 *
 * At zero this returns synchronously rather than scheduling a 0ms timer: a
 * setTimeout still costs a macrotask per request, and a page that fans out a
 * dozen calls would pay a dozen extra frames for nothing.
 */
function simulateLatency(path: string): Promise<void> | null {
  const { min, max } = DEMO_LATENCY_MS;
  if (max <= 0) return null;
  // Seeded off the path so a given endpoint is consistent run to run, rather
  // than one card randomly lagging on every reload.
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (h * 31 + path.charCodeAt(i)) >>> 0;
  const ms = min + (h % Math.max(1, max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Strip the configured baseURL so handlers only ever see an app-relative path. */
function toPath(config: InternalAxiosRequestConfig): string {
  const raw = config.url ?? "";
  const base = config.baseURL ?? "";
  let url = raw;
  if (base && url.startsWith(base)) url = url.slice(base.length);
  // An absolute URL to some other origin (rare) still reduces to its pathname.
  if (/^https?:\/\//i.test(url)) {
    try {
      url = new URL(url).pathname;
    } catch {
      /* fall through with the raw value */
    }
  }
  return url.split("?")[0] || "/";
}

/** Merge querystring-in-url with axios `params` into one URLSearchParams. */
function toQuery(config: InternalAxiosRequestConfig): URLSearchParams {
  const query = new URLSearchParams();
  const inline = (config.url ?? "").split("?")[1];
  if (inline) {
    new URLSearchParams(inline).forEach((v, k) => query.append(k, v));
  }
  const params = config.params as Record<string, unknown> | undefined;
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) v.forEach((item) => query.append(k, String(item)));
      else query.append(k, String(v));
    }
  }
  return query;
}

function toBody(config: InternalAxiosRequestConfig): unknown {
  const data = config.data;
  if (data == null) return undefined;
  if (typeof FormData !== "undefined" && data instanceof FormData) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

function toHeaders(config: InternalAxiosRequestConfig): Record<string, string> {
  const out: Record<string, string> = {};
  const h = config.headers as unknown;
  if (h && typeof (h as AxiosHeaders).toJSON === "function") {
    const json = (h as AxiosHeaders).toJSON() as Record<string, unknown>;
    for (const [k, v] of Object.entries(json)) out[k.toLowerCase()] = String(v);
  } else if (h && typeof h === "object") {
    for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
      if (v != null && typeof v !== "object") out[k.toLowerCase()] = String(v);
    }
  }
  return out;
}

/**
 * Resolve the caller's identity.
 *
 * Prefers the Authorization header the request interceptor already attached, and
 * falls back to the cookie — the cookie path is what makes server-side rendering
 * work, where there is no interceptor-set header to read.
 */
function resolveAuth(headers: Record<string, string>) {
  const bearer = headers["authorization"];
  const fromHeader = bearer?.startsWith("Bearer ")
    ? readDemoToken(bearer.slice(7))
    : null;
  const claims = fromHeader ?? readDemoToken(safeCookie("access_token"));
  return claims
    ? { userId: claims.user_id, email: claims.email, role: claims.role }
    : null;
}

function safeCookie(name: string): string | undefined {
  try {
    return Cookies.get(name);
  } catch {
    return undefined; // No document (SSR) — auth simply resolves to null.
  }
}

function ok(data: unknown, config: InternalAxiosRequestConfig): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
    request: { __demo: true },
  };
}

function fail(
  status: number,
  body: unknown,
  config: InternalAxiosRequestConfig,
): AxiosError {
  const response: AxiosResponse = {
    data: body,
    status,
    statusText: status === 404 ? "Not Found" : "Error",
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
    request: { __demo: true },
  };
  const message =
    (body as { detail?: string })?.detail ?? `Request failed with status code ${status}`;
  return new AxiosError(
    message,
    status === 404 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE,
    config,
    response.request,
    response,
  );
}

export const demoAdapter: AxiosAdapter = async (config) => {
  const method = (config.method ?? "get").toUpperCase() as HttpMethod;
  const path = toPath(config);

  const delay = simulateLatency(path);
  if (delay) await delay;

  const match = matchRoute(method, path);
  if (!match) {
    recordMiss(method, path);
    const degraded = missBody(method, path);
    if (degraded) return ok(degraded.body, config);
    throw fail(
      501,
      { detail: "That action is not available in this preview." },
      config,
    );
  }

  const headers = toHeaders(config);
  const request: DemoRequest = {
    method,
    path,
    params: match.params,
    query: toQuery(config),
    body: toBody(config),
    headers,
    auth: resolveAuth(headers),
  };

  try {
    const data = await match.route.handler(request);
    return ok(data ?? null, config);
  } catch (error) {
    if (error instanceof DemoHttpError) {
      throw fail(error.status, error.body, config);
    }
    // A genuine bug in a handler. Surface it loudly rather than letting a
    // service's catch turn it into a blank card we would never notice.
    console.error(`[demo] Handler crashed for ${method} ${path}`, error);
    throw fail(500, { detail: "Demo handler error" }, config);
  }
};
