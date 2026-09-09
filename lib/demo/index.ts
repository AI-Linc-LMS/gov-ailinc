/**
 * Demo mode: public entry point.
 *
 * `installDemoTransport` is the single seam that turns the production LMS
 * frontend into a self-contained prototype. It swaps the adapter on the app's one
 * axios instance, so every service module is answered locally while keeping its
 * interceptors, retries, error handling and loading states exactly as they behave
 * against the real backend.
 *
 * Nothing outside `lib/demo/` needs to know this exists, apart from the three
 * call sites that wire it in (`lib/services/api.ts`, `lib/config.ts`,
 * `lib/utils/clientInfo.ts`).
 */

import type { AxiosInstance } from "axios";
import { DEMO_MODE } from "./config";
import { demoAdapter, unhandledRoutes } from "./http/adapter";
import { registeredRoutes } from "./http/router";
import { overlay } from "./db/overlay";

// Registers every route table. Must be imported for its side effects before the
// adapter can match anything.
import "./http/handlers";

let installed = false;

/** Point an axios instance at the in-browser fake backend. Idempotent. */
export function installDemoTransport(client: AxiosInstance): void {
  if (!DEMO_MODE || installed) return;
  installed = true;

  client.defaults.adapter = demoAdapter;

  if (typeof window !== "undefined") {
    // Exposed in production too, deliberately. Since the console warning for a
    // missed route is stripped from a production build, this registry is the
    // only way to audit the bundle that actually ships, and auditing the dev
    // build instead is how a whole class of gaps stayed invisible. It is inert
    // and read-only: a visitor has to open devtools and type it to find it.
    (window as unknown as Record<string, unknown>).__demo = {
      unhandled: unhandledRoutes,
      routes: registeredRoutes,
      reset: resetDemo,
    };
  }

  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    console.info(
      `%c[demo] %cTSEM prototype: ${registeredRoutes().length} endpoints served locally. ` +
        `No network calls leave this browser.`,
      "color:#1b4f8a;font-weight:700",
      "color:inherit",
    );
  }
}

/**
 * Wipe every change the visitor made and reload into the pristine demo.
 *
 * Reloading rather than re-rendering is intentional: caches, React Query state
 * and in-flight requests all reference the old data, and a hard reload is the one
 * reset that cannot leave a stale card on screen mid-presentation.
 */
export function resetDemo(): void {
  overlay.reset();
  if (typeof window !== "undefined") window.location.reload();
}

export { DEMO_MODE } from "./config";
export { unhandledRoutes } from "./http/adapter";
export { overlay } from "./db/overlay";
