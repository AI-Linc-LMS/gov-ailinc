/**
 * Authentication and profile endpoints.
 *
 * Sign-in is deliberately *real*: a wrong password returns a genuine 401 with the
 * message the backend sends, and the app's own error handling renders it. A demo
 * that waves everyone through would quietly tell a prospect that the login screen
 * is a picture rather than a working gate.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound, unauthorized, type DemoRequest } from "../types";
import { DEMO_PASSWORD, DEMO_PERSONAS } from "../../config";
import { mintDemoToken } from "../../jwt";
import { overlay } from "../../db/overlay";
import { ALL_PEOPLE, personByEmail, personById, type DemoPerson } from "../../db/people";
import { profileFor } from "../../db/profiles";

const MODULE = "accounts";

/** Overlay key for profile edits the visitor makes, per person. */
const profileKey = (id: number) => `profile:${id}`;

/**
 * The profile payload for a person, with any edits the visitor has made applied.
 *
 * Returns a SUPERSET of two shapes on purpose. `lib/services/profile.service.ts`
 * expects the rich form (`username`, `phone_number`, skills/projects/…), while
 * `lib/auth/auth-context.tsx` reads the account form (`id`, `user_name`, `phone`)
 * straight off the same response. Merging both means neither caller has to be
 * special-cased.
 *
 * `is_profile_active` must be present and true — auth-context treats anything
 * else as "awaiting admin activation" and drops a blocking overlay over the
 * whole app.
 */
function profilePayload(person: DemoPerson) {
  const seeded = profileFor(person);
  const edits = overlay.get<Record<string, unknown>>(profileKey(person.id), {});
  // Spread order matters: the visitor's edits win over the seed, but the
  // identity fields below are re-derived afterwards so an edit cannot desync
  // the two spellings of the same value (`username` vs `user_name`).
  const merged: Record<string, unknown> = { ...seeded, ...edits };

  const str = (key: string, fallback: string): string =>
    typeof merged[key] === "string" && merged[key] ? (merged[key] as string) : fallback;

  return {
    ...merged,
    id: person.id,
    user_name: str("username", person.user_name),
    phone: str("phone_number", person.phone),
    profile_pic_url: str("profile_picture", person.profile_pic_url),
    role: person.role,
    is_profile_active: true,
  };
}

/** Resolve the signed-in person from the request's token, or 401. */
function requirePerson(req: DemoRequest): DemoPerson {
  if (!req.auth) throw unauthorized();
  const person = personById(req.auth.userId);
  if (!person) throw unauthorized();
  return person;
}

function authResponse(person: DemoPerson) {
  return {
    access_token: mintDemoToken(person.id, person.email, person.role, "access"),
    refresh_token: mintDemoToken(person.id, person.email, person.role, "refresh"),
    is_profile_active: true,
    user: {
      id: person.id,
      email: person.email,
      full_name: person.full_name,
      username: person.user_name,
      user_name: person.user_name,
      first_name: person.first_name,
      last_name: person.last_name,
      role: person.role,
      profile_picture: person.profile_pic_url,
      profile_pic_url: person.profile_pic_url,
      phone_number: person.phone,
      is_profile_active: true,
    },
  };
}

/**
 * Any roster member can sign in with the shared demo password, not just the three
 * advertised personas. That is what lets a salesperson sign in as a *particular*
 * student mid-call — "here is exactly what Kabir sees" — without us maintaining a
 * separate credential list.
 */
function authenticate(email: unknown, password: unknown) {
  const address = typeof email === "string" ? email.trim() : "";
  if (!address) throw badRequest({ email: ["This field is required."] });

  const person = personByEmail(address);
  if (!person) {
    throw unauthorized("No account found with these credentials.");
  }
  if (password !== DEMO_PASSWORD) {
    throw unauthorized("Incorrect email or password.");
  }
  return person;
}

defineRoutes(MODULE, {
  "POST /accounts/clients/:clientId/user/login/": (req) => {
    const person = authenticate(req.body?.email, req.body?.password);
    return authResponse(person);
  },

  /**
   * Google sign-in. There is no Google to talk to, so the button signs in as the
   * aspirant persona: what a visitor clicking "Continue with Google" wants to see
   * is what happens *after* the handshake, not the handshake.
   *
   * The address is read from DEMO_PERSONAS rather than written out here. It was
   * written out here, and re-branding the tenant changed every persona address
   * except this one, so the button threw a 404 while every other sign-in path
   * worked. A literal that duplicates configuration is a literal that goes stale
   * silently.
   */
  "POST /accounts/clients/:clientId/user/login/google/": () => {
    const person = personByEmail(DEMO_PERSONAS[0].email);
    if (!person) throw notFound("Demo student persona missing");
    return authResponse(person);
  },

  "POST /accounts/clients/:clientId/user/logout/": () => ({
    detail: "Successfully logged out.",
  }),

  /**
   * Signup accepts the submitted details and reports the same "check your email"
   * state the real product does. No account is created: the demo's whole value is
   * the seeded institution, and a freshly-registered empty account would show a
   * prospect an empty product.
   */
  "POST /accounts/clients/:clientId/user/signup/": () => ({
    detail:
      "Account created. We have sent a verification code to your email address. " +
      "In this demo, use the credentials on the sign-in screen to continue.",
  }),

  "POST /accounts/clients/:clientId/user/verify-email/": () => ({
    detail: "Email verified successfully. You can now sign in.",
  }),

  "POST /accounts/clients/:clientId/user/resend-verification-email/": () => ({
    detail: "Verification code sent.",
  }),

  "POST /accounts/clients/:clientId/user/forgot-password/": (req) => {
    const email = String(req.body?.email ?? "").trim();
    if (!email) throw badRequest({ email: ["This field is required."] });
    return { detail: `We have sent a password reset code to ${email}.` };
  },

  "POST /accounts/clients/:clientId/user/resend-password-reset-otp/": () => ({
    detail: "Password reset code sent.",
  }),

  /** Any 6-digit code is accepted; there is no inbox to read the real one from. */
  "POST /accounts/clients/:clientId/user/verify-password-reset-otp/": (req) => {
    const otp = String(req.body?.otp ?? "").trim();
    if (!/^\d{4,8}$/.test(otp)) {
      throw badRequest({ otp: ["Enter the code sent to your email."] });
    }
    return { reset_token: mintDemoToken(0, String(req.body?.email ?? ""), "reset") };
  },

  "POST /accounts/clients/:clientId/user/reset-password/": () => ({
    detail: "Password reset successfully. Sign in with your new password.",
  }),

  "GET /accounts/clients/:clientId/user-profile/": (req) =>
    profilePayload(requirePerson(req)),

  /** PUT, PATCH and POST all mean "save my profile" here, as they do server-side. */
  "PUT /accounts/clients/:clientId/user-profile/": (req) => saveProfile(req),
  "PATCH /accounts/clients/:clientId/user-profile/": (req) => saveProfile(req),
  "POST /accounts/clients/:clientId/user-profile/": (req) => saveProfile(req),

  "POST /accounts/clients/:clientId/user-profile/profile-picture/": (req) =>
    saveImage(req, "profile_picture"),
  "POST /accounts/clients/:clientId/user-profile/cover-photo/": (req) =>
    saveImage(req, "cover_photo_url"),
});

function saveProfile(req: DemoRequest) {
  const person = requirePerson(req);
  const body = (req.body ?? {}) as Record<string, unknown>;
  overlay.update<Record<string, unknown>>(profileKey(person.id), {}, (current) => ({
    ...current,
    ...body,
  }));
  return profilePayload(person);
}

/**
 * Image uploads become data URIs in the overlay, so an uploaded avatar survives a
 * reload and appears everywhere the person does — with no storage bucket involved.
 */
async function saveImage(req: DemoRequest, field: "profile_picture" | "cover_photo_url") {
  const person = requirePerson(req);
  const file = extractFile(req.body);
  if (!file) throw badRequest({ detail: "No image supplied." });

  const dataUri = await fileToDataUri(file);
  overlay.update<Record<string, unknown>>(profileKey(person.id), {}, (current) => ({
    ...current,
    [field]: dataUri,
  }));
  return profilePayload(person);
}

function extractFile(body: unknown): File | null {
  if (typeof FormData === "undefined" || !(body instanceof FormData)) return null;
  for (const value of body.values()) {
    if (typeof File !== "undefined" && value instanceof File) return value;
  }
  return null;
}

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

/** Exported for handlers that need to render someone other than the caller. */
export { profilePayload, requirePerson };
export const DEMO_DIRECTORY = ALL_PEOPLE;
