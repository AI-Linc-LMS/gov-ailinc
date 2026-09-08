/** Shared types for the demo's in-browser fake backend. */

export interface DemoAuth {
  userId: number;
  email: string;
  role: string;
}

export interface DemoRequest {
  method: HttpMethod;
  /** Pathname only — query string already parsed into `query`. */
  path: string;
  /** Values captured from `:name` segments of the matched route pattern. */
  params: Record<string, string>;
  query: URLSearchParams;
  /**
   * Parsed JSON body, or the raw FormData for uploads.
   *
   * `any` rather than `unknown`: handlers read request fields directly
   * (`req.body?.email`), which is the whole ergonomic point of this layer, and
   * `unknown` would force a cast in every one of them. The request body is
   * genuinely untyped at this boundary — it is whatever the caller sent.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  headers: Record<string, string>;
  /** Claims from the demo access token, or null when signed out. */
  auth: DemoAuth | null;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type DemoHandler = (req: DemoRequest) => unknown | Promise<unknown>;

export interface DemoRoute {
  method: HttpMethod;
  pattern: string;
  handler: DemoHandler;
  /** Where this route was registered, for the unhandled-route report. */
  module: string;
}

/**
 * Thrown by a handler to return a non-2xx response. The adapter converts it into
 * an AxiosError shaped exactly like a real one, so the app's existing error
 * handling (toasts, retries, 401 refresh) behaves the way it does in production.
 */
export class DemoHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown = { detail: "Demo error" },
  ) {
    super(
      typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : `HTTP ${status}`,
    );
    this.name = "DemoHttpError";
  }
}

/** Convenience constructors for the statuses handlers actually need. */
export const notFound = (detail = "Not found") => new DemoHttpError(404, { detail });
export const badRequest = (body: unknown = { detail: "Invalid request" }) => new DemoHttpError(400, body);
export const unauthorized = (detail = "Authentication credentials were not provided.") =>
  new DemoHttpError(401, { detail });
export const forbidden = (detail = "You do not have permission to perform this action.") =>
  new DemoHttpError(403, { detail });
