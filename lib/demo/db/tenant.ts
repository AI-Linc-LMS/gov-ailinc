/**
 * The demo tenant: the Telangana Skills & Employment Mission (TSEM), a fictional
 * state mission. See `docs/GOVERNMENT-BUILD-BRIEF.md`.
 *
 * This is the `client-info` payload the whole app boots from: branding, the
 * timezone live sessions render in, and the feature flags that decide which
 * modules appear in the sidebar. Nearly every module is switched on, because the
 * point of the prototype is to show the complete platform rather than one
 * package. Each module that is off is argued for at the line that drops it.
 */

import { DEMO_CLIENT_ID, DEMO_TENANT } from "../config";
import { nextDemoId, overlay } from "./overlay";
import type { ClientInfo } from "@/lib/services/client.service";

/**
 * Every feature the app knows about.
 *
 * Collected by reading the `featureName` values in `components/layout/Sidebar.tsx`
 * and `BottomNavigation.tsx`, plus the direct `features.some(...)` checks in
 * `lib/contexts/ClientInfoContext.tsx` and `components/layout/AppBar.tsx`. If a
 * new module ships in the real frontend and its nav item does not appear here,
 * add its flag to this list.
 *
 * `no_leaderboard_view` is deliberately absent: it is a NEGATIVE flag that hides
 * the leaderboard, so including it would switch a module off.
 */
const ENABLED_FEATURES = [
  // Learner modules
  "dashboard",
  // "course" is deliberately OFF.
  //
  // That flag is the LEGACY course module. This tenant is adaptive-native: the
  // adaptive module is simply "Courses" here, so shipping both put two things
  // called Courses in one sidebar pointing at different products. Switching the
  // flag off is the product's own mechanism for this, so nothing is forked to
  // achieve it.
  "adaptive_quiz",
  "assessment",
  // "mock_interview" is ON, and the reasoning is worth recording because it was
  // switched off once and that was wrong.
  //
  // The module does contain a Monaco coding round, which has no place in a
  // catalogue of recruitment exams and vocational trades. But the coding round
  // is data, not structure: every interview topic in
  // `lib/demo/http/handlers/interview-actions.ts` is seeded with
  // `num_coding_questions: 0`, so no aspirant is ever handed an editor. Removing
  // the module to avoid a screen nobody is served would have cost this tenant
  // the single stage its candidates are most afraid of. Group-I ends at an
  // interview board, bank PO ends at an interview, SI selection ends at a board,
  // and a trade course ends at a viva. A candidate who has never sat in front of
  // a panel is exactly who this practises.
  //
  // The obligation that comes with keeping it on: the interview panels and their
  // question sets are re-contented for this sector, and the coding round stays
  // seeded at zero.
  "mock_interview",
  "jobs_v2",
  "resume",
  "live_sessions",
  "community_forum",
  "scorecard",
  "support",

  // Instructor workspace
  "instructor",

  // Administration
  "admin_dashboard",
  "admin_manage_students",
  "admin_manage_instructors",
  "admin_cohorts",
  "admin_adaptive_quizzes",
  "admin_assessment",
  "admin_assessment_result",
  "admin_mock_interview",
  "admin_live_sessions",
  "admin_scorecard",
  "admin_certificates",
  "admin_jobs_v2",
  "admin_emails",
  "admin_notifications",
  "admin_tickets",
  "admin_branding",
  "admin_payment",
  "admin_referral",
  "admin_ebook",
  "admin_webinar_management",
  "admin_workshop_reg",
] as const;

/**
 * Non-colour branding. Colours are intentionally omitted: the platform pins its
 * palette to the "Midnight hyper" preset for every tenant (see
 * `lib/theme/normalizeThemeSettings.ts`), so only the logo, wordmark sizing and
 * login copy are actually tenant-controlled.
 */
const THEME_SETTINGS: Record<string, string> = {
  // Empty on purpose. `ClientFontLink` injects a <link> for whatever this holds,
  // and the platform default points at api.fontshare.com. Satoshi is served from
  // /public/fonts instead, so the demo needs no font CDN and renders identically
  // with the network unplugged.
  fontImportUrl: "",
  // The mission's own line, and the only sentence on the sign-in screen. It is
  // also read back onto certificates as the issuer tagline (see
  // `lib/certificate/client-branding.ts`), which is why it names what the
  // mission promises rather than describing the software.
  loginHeroSlogan: "Skills for every district. A career for every aspirant.",
  // Unchanged from the sizing that was tuned against this hero panel. The line
  // is longer than the one it replaces and wraps to three lines inside the
  // panel's 460px column, which is what the two-line skeleton already allows for.
  loginHeroSloganFontSize: "30px",
  loginHeroSloganFontWeight: "600",
  loginHeroLogoMaxWidthPx: "230",
  loginHeroLogoHeightPx: "52",
  sidebarLogoMaxWidthPx: "185",
  sidebarLogoHeightPx: "42",
};

export const DEMO_CLIENT_INFO: ClientInfo = {
  id: DEMO_CLIENT_ID,
  name: DEMO_TENANT.name,
  slug: DEMO_TENANT.slug,
  is_active: true,
  timezone: DEMO_TENANT.timezone,

  // Under /logos/ deliberately. The route middleware (proxy.ts) bypasses auth
  // for /images/, /videos/, /assets/, /monaco/ and /logos/ only: anything else
  // 307s to /login for a signed-out visitor, which would break the logo on the
  // sign-in screen itself. Keep new brand files in this folder.
  //
  // The mark is three ascending arches on a common plinth: districts stepping up
  // together. It is an original device and is deliberately not derived from the
  // national emblem, the state emblem, the lion capital or any real seal, since
  // this is a fictional mission and must not read as a government's own mark.
  //
  // The white lockup is wired to both logo fields, because the two surfaces that
  // show one are BOTH dark:
  //   app_logo_url   -> ink sidebar, small box  -> light, full lockup
  //   login_logo_url -> ink hero panel, larger  -> light, full lockup
  //   app_icon_url   -> favicon and small chips -> the mark on its own
  // tsem-lockup-ink.svg is the dark-text lockup, kept for light surfaces
  // (printed handouts, exported PDFs) rather than any of these, and
  // tsem-*-darkmode.svg is the brightened pair for a dark ground. Every file
  // reuses the canvas of the ai-linc-*.svg lockups it replaces (1600x600 lockup,
  // 400x240 mark, mark and text in the same slots) so the sizing below did not
  // have to be retuned.
  app_logo_url: "/logos/tsem-lockup-white.svg",
  app_icon_url: "/logos/tsem-mark-color.svg",
  login_logo_url: "/logos/tsem-lockup-white.svg",
  login_img_url: null,

  features: ENABLED_FEATURES.map((name, index) => ({ id: index + 1, name })),
  theme_settings: THEME_SETTINGS,

  show_footer: true,
  allow_instructor_self_signup: true,
  live_proctoring_enabled: true,
  hide_available_courses_from_students: false,

  // Who signs a completion certificate. A fictional officer of a fictional
  // mission: no real official is named, and the acronym is used in the title so
  // the line does not repeat the full mission name already printed above it.
  certificate_signatory_name: "Dr. Sailaja Vemireddy",
  certificate_signatory_title: "Mission Director, TSEM",
  certificate_signature_url: null,

  // The tenant is fully provisioned: a visitor must never land in the
  // first-login setup wizard, which would block the app behind onboarding.
  setup_completed: true,
  setup_step: 8,
};

/* ─────────── Branding the administrator changes during the demo ───────────── */

/**
 * What Settings sends up. Mirrors `BrandingPatchBody` in
 * `lib/services/admin/branding.service.ts`.
 */
export interface BrandingPatch {
  theme_settings?: Record<string, string>;
  theme_preset_id?: string | null;
  login_img_url?: string | null;
  login_logo_url?: string | null;
  app_icon_url?: string | null;
  app_logo_url?: string | null;
}

const BRANDING_KEY = "branding:client";
const ASSET_KEY = "branding:assets";

/**
 * Marker for an image the visitor uploaded. Kept short and opaque on purpose:
 * this is the value that gets STORED, and the branding service refuses to send
 * any branding URL longer than 2048 characters, which a data URI always is.
 */
const ASSET_PREFIX = "demo-asset://";

/**
 * Object URLs minted this page load, both ways round.
 *
 * Deliberately module state rather than overlay state: an object URL is only
 * valid for the document that created it, so persisting one would restore a dead
 * link. The bytes are what persist; the URL is re-minted on demand.
 */
const urlByToken = new Map<string, string>();
const tokenByUrl = new Map<string, string>();

function brandingPatch(): BrandingPatch {
  return overlay.get<BrandingPatch>(BRANDING_KEY, {});
}

export function saveBrandingPatch(patch: BrandingPatch): BrandingPatch {
  return overlay.update<BrandingPatch>(BRANDING_KEY, {}, (current) => ({
    ...current,
    ...patch,
    theme_settings: { ...(current.theme_settings ?? {}), ...(patch.theme_settings ?? {}) },
  }));
}

/** Store uploaded bytes, and return the token that stands in for them. */
export function storeBrandingAsset(dataUri: string): { id: number; token: string } {
  const id = nextDemoId("branding-asset");
  const token = `${ASSET_PREFIX}${id}`;
  overlay.update<Record<string, string>>(ASSET_KEY, {}, (assets) => ({ ...assets, [token]: dataUri }));
  return { id, token };
}

/**
 * Turn a stored value into something an `<img>` or a CSS `url()` can render.
 *
 * Anything that is not one of our tokens (a pasted CDN link, a bundled asset
 * path, null) passes straight through untouched.
 */
export function resolveBrandingAsset(value: string | null | undefined): string | null {
  if (!value) return value ?? null;
  if (!value.startsWith(ASSET_PREFIX)) return value;

  const cached = urlByToken.get(value);
  if (cached) return cached;

  const dataUri = overlay.get<Record<string, string>>(ASSET_KEY, {})[value];
  // The visitor reset the demo between the save and this read. An empty logo is
  // honest; a broken-image icon in the sidebar is not.
  if (!dataUri) return null;

  const objectUrl = toObjectUrl(dataUri);
  // No URL.createObjectURL means we are rendering on the server, where the
  // overlay is empty anyway, so this only ever fires in an exotic environment.
  if (!objectUrl) return dataUri;

  urlByToken.set(value, objectUrl);
  tokenByUrl.set(objectUrl, value);
  return objectUrl;
}

/** The inverse: the form hands back the object URL, we store the token again. */
export function toBrandingAssetToken(value: string | null | undefined): string | null {
  if (!value) return null;
  return tokenByUrl.get(value) ?? value;
}

function toObjectUrl(dataUri: string): string | null {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") return null;
  try {
    const [meta, base64] = dataUri.split(",");
    const mime = /:(.*?);/.exec(meta)?.[1] ?? "image/png";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return null;
  }
}

type BrandingImageField = "login_img_url" | "login_logo_url" | "app_icon_url" | "app_logo_url";

/**
 * `field` as the visitor left it, otherwise the seed value.
 *
 * `in` rather than a truthiness check because clearing a logo stores null, and
 * that null has to win over the seeded logo or the field cannot be emptied.
 */
function branded(field: BrandingImageField): string | null {
  const patch = brandingPatch();
  const value = field in patch ? patch[field] : DEMO_CLIENT_INFO[field];
  return resolveBrandingAsset(value);
}

/**
 * The tenant as the app sees it, with the visitor's branding folded in.
 *
 * Every surface that shows a logo reads this, so uploading one in Settings
 * repaints the sidebar, the login hero and the certificate wordmark at once.
 * That round trip is the white-label pitch, and it is worth more than the toast.
 */
export function clientInfo(): ClientInfo {
  const patch = brandingPatch();
  return {
    ...DEMO_CLIENT_INFO,
    app_logo_url: branded("app_logo_url"),
    app_icon_url: branded("app_icon_url"),
    login_logo_url: branded("login_logo_url"),
    login_img_url: branded("login_img_url"),
    theme_settings: { ...THEME_SETTINGS, ...(patch.theme_settings ?? {}) },
  };
}

/**
 * The admin branding endpoint's payload. `theme_preset_id` is part of the
 * contract even when nothing has been chosen, so it is present and null rather
 * than absent.
 */
export function brandingPayload() {
  const info = clientInfo();
  return {
    name: info.name,
    app_logo_url: info.app_logo_url ?? null,
    app_icon_url: info.app_icon_url ?? null,
    login_logo_url: info.login_logo_url ?? null,
    login_img_url: info.login_img_url ?? null,
    theme_settings: (info.theme_settings ?? {}) as Record<string, string>,
    theme_preset_id: brandingPatch().theme_preset_id ?? null,
    show_footer: info.show_footer,
  };
}
