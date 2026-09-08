/**
 * Fake JWTs for the demo session.
 *
 * These are unsigned and prove nothing — there is no server to verify them. They
 * exist because the real app treats its access token as a JWT: `lib/services/api.ts`
 * decodes the `exp` claim to decide whether to refresh ahead of expiry. Handing it
 * an opaque string would work (it tolerates an unreadable token) but would exercise
 * a different code path than production does, so the demo mints something with the
 * right shape and a long life instead.
 */

import { DEMO_CLIENT_ID } from "./config";

/** base64url of a UTF-8 string, in both Node (SSR) and the browser. */
function b64url(input: string): string {
  const bytes =
    typeof btoa === "function"
      ? btoa(unescape(encodeURIComponent(input)))
      : Buffer.from(input, "utf8").toString("base64");
  return bytes.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

/**
 * Mint a demo token. Expiry is far enough out that a prospect exploring for an
 * afternoon never trips the refresh path mid-click.
 */
export function mintDemoToken(
  userId: number,
  email: string,
  role: string,
  kind: "access" | "refresh" = "access",
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    token_type: kind,
    user_id: userId,
    email,
    role,
    client_id: DEMO_CLIENT_ID,
    demo: true,
    iat: issuedAt,
    exp: issuedAt + THIRTY_DAYS_SECONDS,
  };
  return `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}.demo`;
}

/** Read a demo token's claims back. Returns null for anything unparseable. */
export function readDemoToken(
  token: string | undefined | null,
): { user_id: number; email: string; role: string } | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json =
      typeof atob === "function"
        ? decodeURIComponent(escape(atob(padded)))
        : Buffer.from(padded, "base64").toString("utf8");
    const claims = JSON.parse(json);
    if (typeof claims?.user_id !== "number") return null;
    return { user_id: claims.user_id, email: claims.email, role: claims.role };
  } catch {
    return null;
  }
}
