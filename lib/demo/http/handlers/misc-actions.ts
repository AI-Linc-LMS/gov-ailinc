/**
 * The three write surfaces nothing else owns: the Zoom integration, tenant
 * branding, and the course roster's enrol/unenrol buttons.
 *
 * Zoom is deliberately shown CONNECTED. An earlier stub answered the credentials
 * endpoint with `{configured: false}`, which was both the wrong shape for
 * `zoom.service.ts` (it reads `zoom_credentials` / `zoom_connection` /
 * `oauth_available`, so every field came back undefined) and the wrong story: the
 * live-sessions page then rendered a permanent "connect your Zoom account"
 * prompt, so a prospect never saw that the integration exists. There is no Zoom
 * OAuth round trip to make here, so the demo shows the END STATE of one, and the
 * Disconnect / Connect pair still round-trips through the overlay so the buttons
 * are real.
 *
 * Branding is the white-label pitch, so it has to actually apply: a PATCH lands
 * in the overlay that `clientInfo()` reads, which means saving a new logo repaints
 * the sidebar and the login screen rather than just toasting "Saved".
 */

import { defineRoutes } from "../router";
import { badRequest, notFound, type DemoRequest } from "../types";
import { DEMO_CLIENT_ID, DEMO_TENANT } from "../../config";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import { overlay } from "../../db/overlay";
import { STUDENTS, STUDENT_PERSONA, personById, type DemoPerson } from "../../db/people";
import {
  brandingPayload,
  resolveBrandingAsset,
  saveBrandingPatch,
  storeBrandingAsset,
  toBrandingAssetToken,
  type BrandingPatch,
} from "../../db/tenant";

const MODULE = "misc-actions";

/* ─────────────────────────── Zoom integration ─────────────────────────────── */

/** Mail domain of the tenant, so the host account reads as theirs after a re-skin. */
const MAIL_DOMAIN = DEMO_TENANT.supportEmail.split("@")[1];

/** The licensed Zoom user every session is hosted by. */
const ZOOM_HOST_EMAIL = `live@${MAIL_DOMAIN}`;

/**
 * Server-to-server app identifiers. Fixed strings rather than generated ones:
 * an admin who reopens the credentials dialog must see the same account they saw
 * a minute ago, and these are printed on screen.
 */
const ZOOM_ACCOUNT_ID = "hR3vT9pQSm2xK7wZ0lYbAg";
const ZOOM_CLIENT_ID = "sV9pQmT2R6uHkE0aXbNc1w";

/** Where Zoom posts meeting events. Displayed with a copy button, never fetched. */
const ZOOM_WEBHOOK_URL = `https://api.${MAIL_DOMAIN}/webhooks/clients/${DEMO_CLIENT_ID}/zoom/`;

interface ZoomOverlay {
  connected: boolean;
  /** Set fresh on every Connect, so "connected 2 days ago" is not frozen. */
  connected_at: string | null;
  account_id: string;
  zoom_client_id: string;
  is_active: boolean;
  timezone: string;
  /** A webhook secret was saved. Drives the "End meeting" button on a live class. */
  webhook_secret_set: boolean;
}

const ZOOM_KEY = "zoom:integration";

function zoomState(): ZoomOverlay {
  return overlay.get<ZoomOverlay>(ZOOM_KEY, {
    connected: true,
    // Connected at the start of term rather than today: an integration that
    // claims it was set up minutes ago reads like a fixture.
    connected_at: isoDaysAgo(34, 11, 20),
    account_id: ZOOM_ACCOUNT_ID,
    zoom_client_id: ZOOM_CLIENT_ID,
    is_active: true,
    timezone: DEMO_TENANT.timezone,
    webhook_secret_set: true,
  });
}

function setZoomState(patch: Partial<ZoomOverlay>): ZoomOverlay {
  return overlay.set<ZoomOverlay>(ZOOM_KEY, { ...zoomState(), ...patch });
}

/** `zoom_client_secret` is null on purpose: the real GET never returns it. */
function zoomCredentials() {
  const s = zoomState();
  return {
    id: 1,
    account_id: s.account_id,
    zoom_client_id: s.zoom_client_id,
    zoom_client_secret: null,
    zoom_webhook_secret: null,
    is_active: s.is_active,
    timezone: s.timezone,
    webhook_configured: s.webhook_secret_set,
    webhook_url: ZOOM_WEBHOOK_URL,
    created_at: isoDaysAgo(34, 11, 18),
    updated_at: isoDaysAgo(6, 15, 40),
  };
}

function zoomConnection() {
  const s = zoomState();
  return {
    mode: "oauth" as const,
    connected: s.connected,
    connected_email: s.connected ? ZOOM_HOST_EMAIL : null,
    connected_at: s.connected ? s.connected_at : null,
    needs_reconnect: false,
  };
}

type CheckStatus = "ok" | "warn" | "fail" | "skip";

interface DiagnosticCheck {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string | null;
}

/**
 * The pre-flight check an admin runs before scheduling a term of sessions.
 *
 * Honest about the overlay: disconnect Zoom and re-run it and the authorization
 * line fails, with the remedy that actually fixes it. A check that always reports
 * green is worth nothing on a sales call.
 */
function zoomDiagnostics() {
  const s = zoomState();
  const skipped = "Skipped while no Zoom account is connected.";

  const checks: DiagnosticCheck[] = [
    {
      key: "credentials",
      label: "App credentials",
      status: s.is_active ? "ok" : "warn",
      detail: s.is_active
        ? "Server-to-server app credentials are saved and marked active."
        : "Credentials are saved but the integration is switched off, so no meeting will be created.",
      fix: s.is_active ? null : "Turn on 'Integration active' in the Zoom credentials dialog and save.",
    },
    {
      key: "authorization",
      label: "Account authorization",
      status: s.connected ? "ok" : "fail",
      detail: s.connected
        ? `Authorized as ${ZOOM_HOST_EMAIL}. The access token refreshes on its own.`
        : "No Zoom account is authorized, so scheduling a session cannot create the meeting.",
      fix: s.connected ? null : "Click Connect Zoom on the live sessions page and approve the consent screen.",
    },
    {
      key: "scopes",
      label: "Granted scopes",
      status: s.connected ? "ok" : "skip",
      detail: s.connected
        ? "meeting:write, webinar:write, recording:read, report:read and user:read are all granted."
        : skipped,
    },
    {
      key: "host_user",
      label: "Host user",
      status: s.connected ? "ok" : "skip",
      detail: s.connected
        ? `Sessions are hosted by ${ZOOM_HOST_EMAIL}, a licensed user on the ${DEMO_TENANT.shortName} Business plan.`
        : skipped,
    },
    {
      key: "webhook",
      label: "Event delivery",
      status: s.webhook_secret_set ? "ok" : "warn",
      detail: s.webhook_secret_set
        ? "Zoom delivered the last event 12 minutes ago. Attendance, recordings and transcripts sync on their own."
        : "No webhook secret is saved, so attendance and recordings will not sync until someone syncs them by hand.",
      fix: s.webhook_secret_set
        ? null
        : `Add the secret from your Zoom app's Event Subscriptions, pointing it at ${ZOOM_WEBHOOK_URL}`,
    },
    {
      key: "live_metrics",
      label: "Live attendance metrics",
      status: s.connected ? "ok" : "skip",
      detail: s.connected
        ? "The Dashboard API is available on this plan, so the joined count on a live session is real."
        : skipped,
    },
  ];

  const overall: "ok" | "warn" | "fail" = checks.some((c) => c.status === "fail")
    ? "fail"
    : checks.some((c) => c.status === "warn")
      ? "warn"
      : "ok";

  // A connection check is allowed to move: it reports the moment it ran.
  return { overall, checks, checked_at: iso(new Date(nowMs())) };
}

/* ────────────────────────────── Branding ──────────────────────────────────── */

/**
 * Colour presets, mirroring the five in the setup wizard (`ThemeStep.tsx`, which
 * itself mirrors the backend's `client_theming/presets.py`) so a prospect who
 * picks "Azure Bolt" during onboarding finds the same name in Settings later.
 *
 * Each theme ships twice: the tonal canvas and a white-canvas variant sharing one
 * `base_id`. `category` on the white variants is "white_bg" rather than the
 * classic/vibrant taxonomy because that is the value `BrandingPresetGallery`
 * groups on, and a preset in the wrong group is invisible to whoever is looking
 * for it.
 */
interface PresetSeed {
  id: string;
  label: string;
  category: "classic" | "vibrant" | "high_contrast";
  tagline: string;
  sidebar: string;
  primary: string;
  active: string;
  surface: string;
  fontDark: string;
}

const PRESET_SEEDS: PresetSeed[] = [
  {
    id: "default",
    label: "Default, Blue Slate",
    category: "classic",
    tagline: "Balanced blues, professional and calm.",
    sidebar: "#12293a",
    primary: "#255c79",
    active: "#2f7397",
    surface: "#f5f9fb",
    fontDark: "#0f2b46",
  },
  {
    id: "azure_bolt",
    label: "Azure Bolt",
    category: "vibrant",
    tagline: "Deep navy rail with an electric sky-blue call to action.",
    sidebar: "#082f49",
    primary: "#0ea5e9",
    active: "#38bdf8",
    surface: "#f0f9ff",
    fontDark: "#0c4a6e",
  },
  {
    id: "sakura_day",
    label: "Sakura Day",
    category: "vibrant",
    tagline: "Soft rose tint over clean, bright surfaces.",
    sidebar: "#4c0519",
    primary: "#e11d48",
    active: "#fb7185",
    surface: "#fff1f2",
    fontDark: "#7a1230",
  },
  {
    id: "sky_paper",
    label: "Sky Paper",
    category: "classic",
    tagline: "Bright sky blues on a paper-like base.",
    sidebar: "#0c4a6e",
    primary: "#0284c7",
    active: "#7dd3fc",
    surface: "#f8fcff",
    fontDark: "#0c4a6e",
  },
  {
    id: "mono_minimal",
    label: "Mono Minimal",
    category: "high_contrast",
    tagline: "Neutral greyscale with quiet, deliberate contrast.",
    sidebar: "#0f172a",
    primary: "#475569",
    active: "#94a3b8",
    surface: "#f8fafc",
    fontDark: "#0f172a",
  },
];

function presetSummaries() {
  return PRESET_SEEDS.flatMap((p) => [
    {
      id: p.id,
      label: p.label,
      category: p.category,
      tagline: p.tagline,
      base_id: p.id,
      variant: "default",
      preview: { sidebar: p.sidebar, primary: p.primary, active: p.active, surface: p.surface },
    },
    {
      id: `${p.id}_white_bg`,
      label: `${p.label}, White BG`,
      category: "white_bg",
      tagline: `${p.tagline.replace(/\.$/, "")}, on a pure white canvas.`,
      base_id: p.id,
      variant: "white_bg",
      preview: { sidebar: p.sidebar, primary: p.primary, active: p.active, surface: "#ffffff" },
    },
  ]);
}

/**
 * The full token set for one preset.
 *
 * Keys are the camelCase ones in `ALLOWED_THEME_KEYS` (branding.service.ts strips
 * anything else on the way back up), not the CSS variable names.
 */
function presetDetail(presetId: string) {
  const whiteBg = presetId.endsWith("_white_bg");
  const seed = PRESET_SEEDS.find((p) => p.id === (whiteBg ? presetId.slice(0, -"_white_bg".length) : presetId));
  if (!seed) throw notFound("That theme preset does not exist.");

  const summary = presetSummaries().find((p) => p.id === presetId);
  return {
    id: presetId,
    label: summary?.label ?? seed.label,
    theme_settings: {
      primary500: seed.primary,
      primary600: seed.sidebar,
      primary300: seed.active,
      secondary500: seed.sidebar,
      navBackground: seed.sidebar,
      navSelected: seed.active,
      fontDark: seed.fontDark,
      fontLight: "#ffffff",
      fontDarkNav: seed.fontDark,
      fontLightNav: "#ffffff",
      courseCta: seed.primary,
      defaultPrimary: seed.primary,
      muiPrimaryMain: seed.primary,
      neutral50: whiteBg ? "#ffffff" : seed.surface,
      _preset: presetId,
    } as Record<string, string>,
  };
}

/** Largest upload the overlay can carry without evicting the rest of the demo. */
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

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

/**
 * Store an uploaded image and hand back a URL the app can both render and save.
 *
 * The bytes live in the overlay as a data URI, exactly like an uploaded avatar
 * (see `accounts.ts`), because there is no bucket to put them in. What comes back
 * is NOT that data URI though: `patchClientBranding` rejects any branding URL over
 * 2048 characters before the request is even sent, so returning the data URI would
 * upload the logo fine and then make Save fail with "URL is too long". A short
 * object URL renders immediately, survives the round trip through the form, and
 * maps back to the stored bytes on the way in (see `toBrandingAssetToken`).
 */
async function storeUpload(req: DemoRequest) {
  const file = extractFile(req.body);
  if (!file) throw badRequest({ detail: "No image was attached to the upload." });
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw badRequest({
      detail: `That image is ${mb} MB. Please upload one under 2 MB so it loads quickly for every student.`,
    });
  }

  const { id, token } = storeBrandingAsset(await fileToDataUri(file));
  return {
    id,
    url: resolveBrandingAsset(token),
    filename: file.name,
    module: "branding",
  };
}

/* ─────────────────────── Course roster (enrol / unenrol) ──────────────────── */

interface RosterChanges {
  added: number[];
  removed: number[];
}

/**
 * The seeded roster of every adaptive course.
 *
 * One list for all of them on purpose: the demo tenant runs its cohorts through
 * the whole catalogue, so a prospect opening two courses sees the same faces.
 */
const SEEDED_ROSTER: readonly DemoPerson[] = [STUDENT_PERSONA, ...STUDENTS.slice(0, 24)];

const rosterKey = (courseId: number) => `course:${courseId}:roster`;

function rosterChanges(courseId: number): RosterChanges {
  return overlay.get<RosterChanges>(rosterKey(courseId), { added: [], removed: [] });
}

/**
 * Who is enrolled in a course right now, seed plus whatever the visitor changed.
 *
 * Exported because `details.ts` serves the roster GET: removing a student and
 * then reloading the page has to keep them gone, or the demo has just told
 * someone their click did something it did not.
 */
export function courseRosterMembers(courseId: number): DemoPerson[] {
  const { added, removed } = rosterChanges(courseId);
  const kept = SEEDED_ROSTER.filter((p) => !removed.includes(p.id));
  // Newly enrolled first: the visitor who just added them should not have to
  // hunt down a 25-row table to see that it worked.
  const fresh = added
    .filter((id) => !kept.some((p) => p.id === id))
    .map((id) => personById(id))
    .filter((p): p is DemoPerson => Boolean(p));
  return [...fresh, ...kept];
}

function requestedIds(body: unknown): number[] {
  const raw = (body as { student_ids?: unknown } | null)?.student_ids;
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => Number(v)).filter((n) => Number.isFinite(n));
}

/* ──────────────────────────────── Routes ──────────────────────────────────── */

defineRoutes(MODULE, {
  /**
   * Zoom meeting templates and platform presets, for the session wizard.
   *
   * Both are wrapped in the `{status, data:{...}}` envelope the Zoom-backed
   * endpoints use, because `getMeetingTemplates` reads `response.data.data
   * ?.templates` and a bare array reaches it as undefined, leaving the wizard's
   * template picker permanently empty.
   */
  "GET /live-class/api/clients/:clientId/zoom/templates/": () => ({
    status: "success",
    data: {
      templates: [
        { id: "tmpl-lecture", name: "Lecture: host video on, participants muted", type: 2 },
        { id: "tmpl-workshop", name: "Workshop: breakout rooms enabled", type: 2 },
        { id: "tmpl-office-hours", name: "Office hours: waiting room, join before host", type: 2 },
        { id: "tmpl-webinar", name: "Webinar: panelists only, registration required", type: 5 },
      ],
    },
  }),

  "GET /live-class/api/clients/:clientId/zoom/presets/": () => ({
    status: "success",
    data: {
      presets: [
        {
          id: 1,
          name: "Standard class",
          template_id: "tmpl-lecture",
          is_default: true,
          settings: {
            mute_upon_entry: true,
            auto_recording: "cloud",
            join_before_host: false,
            waiting_room: false,
          },
          created_at: isoDaysAgo(140),
        },
        {
          id: 2,
          name: "Guest speaker",
          template_id: "tmpl-webinar",
          is_default: false,
          settings: {
            mute_upon_entry: true,
            auto_recording: "cloud",
            registration_required: true,
            practice_session: true,
          },
          created_at: isoDaysAgo(65),
        },
        {
          id: 3,
          name: "Small-group clinic",
          template_id: "tmpl-workshop",
          is_default: false,
          settings: {
            mute_upon_entry: false,
            auto_recording: "none",
            breakout_room: true,
            waiting_room: true,
          },
          created_at: isoDaysAgo(22),
        },
      ],
    },
  }),

  /**
   * Credentials + OAuth state in one payload. Lives here rather than with the
   * other admin GETs because the connect, disconnect and save routes below all
   * write the state it reads, and splitting the pair guarantees they drift.
   */
  "GET /accounts/clients/:clientId/zoom-credentials/": () => ({
    zoom_credentials: zoomCredentials(),
    zoom_connection: zoomConnection(),
    oauth_available: true,
  }),

  "PUT /accounts/clients/:clientId/zoom-credentials/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const text = (key: string) =>
      typeof body[key] === "string" && String(body[key]).trim() ? String(body[key]).trim() : undefined;

    setZoomState({
      account_id: text("account_id") ?? zoomState().account_id,
      zoom_client_id: text("zoom_client_id") ?? zoomState().zoom_client_id,
      timezone: text("timezone") ?? zoomState().timezone,
      is_active: typeof body.is_active === "boolean" ? body.is_active : zoomState().is_active,
      // The dialog leaves the secret blank to keep the stored one, so only a
      // non-empty value may flip this flag on.
      webhook_secret_set: text("zoom_webhook_secret") ? true : zoomState().webhook_secret_set,
    });

    return { message: "Zoom credentials saved.", zoom_credentials: zoomCredentials() };
  },

  /**
   * Start the one-click connect.
   *
   * A real backend answers with a zoom.us consent URL and the page assigns it to
   * `window.location.href`. Sending the visitor to zoom.us would end the demo on
   * a page we do not control, so the authorize URL points back at the app with
   * the success flag the callback would have set. Everything after that, the
   * toast and the status refresh, is the product's own code path.
   */
  "POST /accounts/clients/:clientId/zoom-credentials/connect/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const returnTo =
      typeof body.return_to === "string" && body.return_to.startsWith("/")
        ? body.return_to
        : "/admin/live-sessions";

    setZoomState({ connected: true, connected_at: iso(new Date(nowMs())) });
    const separator = returnTo.includes("?") ? "&" : "?";
    return { authorize_url: `${returnTo}${separator}zoom_connected=1` };
  },

  /** Disconnect keeps the saved app credentials, exactly like the real revoke. */
  "DELETE /accounts/clients/:clientId/zoom-credentials/": () => {
    setZoomState({ connected: false, connected_at: null });
    return { detail: "Zoom has been disconnected." };
  },

  /** Envelope, not the bare object: the service reads `data.data`. */
  "GET /live-class/api/clients/:clientId/zoom/diagnostics/": () => ({
    status: "success",
    message: "Zoom connection checked.",
    data: zoomDiagnostics(),
  }),

  "GET /admin-dashboard/api/branding/presets/": () => ({ presets: presetSummaries() }),

  "GET /admin-dashboard/api/branding/presets/:presetId/": (req) => presetDetail(req.params.presetId),

  /**
   * Tenant branding. Reads through the same overlay `clientInfo()` does, so what
   * Settings shows and what the sidebar renders can never disagree.
   */
  "GET /admin-dashboard/api/clients/:clientId/branding/": () => brandingPayload(),

  "PATCH /admin-dashboard/api/clients/:clientId/branding/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const patch: BrandingPatch = {};

    // Each URL may arrive as an uploaded asset's object URL; store the stable
    // token behind it instead, since the object URL dies with the page.
    for (const field of ["login_img_url", "login_logo_url", "app_icon_url", "app_logo_url"] as const) {
      if (!(field in body)) continue;
      const value = body[field];
      patch[field] = typeof value === "string" ? toBrandingAssetToken(value.trim()) || null : null;
    }
    if (body.theme_settings && typeof body.theme_settings === "object") {
      patch.theme_settings = body.theme_settings as Record<string, string>;
    }
    if (typeof body.theme_preset_id === "string") {
      patch.theme_preset_id = body.theme_preset_id;
    }

    saveBrandingPatch(patch);
    return { ...brandingPayload(), message: "Branding updated." };
  },

  /**
   * One endpoint for every branding image, which is what the real backend does:
   * it stores the file and returns a URL, and the field it is pasted into decides
   * whether it is a logo, a favicon or the login background.
   */
  "POST /admin-dashboard/api/clients/:clientId/branding/login-background/": (req) => storeUpload(req),

  /**
   * Roster writes. `succeeded` / `skipped` / `missing` are counted rather than
   * assumed: enrolling someone already on the roster is a no-op the real API
   * reports as skipped, and the instructor page prints these numbers.
   */
  "POST /adaptive-quiz/api/admin/courses/:courseId/students/enroll/": (req) => {
    const courseId = Number(req.params.courseId);
    const ids = requestedIds(req.body);
    const current = courseRosterMembers(courseId);

    const missing: number[] = [];
    const toAdd: number[] = [];
    let skipped = 0;

    for (const id of ids) {
      const person = personById(id);
      if (!person || person.role !== "student") {
        missing.push(id);
      } else if (current.some((p) => p.id === id) || toAdd.includes(id)) {
        skipped += 1;
      } else {
        toAdd.push(id);
      }
    }

    if (toAdd.length) {
      overlay.update<RosterChanges>(rosterKey(courseId), { added: [], removed: [] }, (state) => ({
        added: [...toAdd, ...state.added],
        removed: state.removed.filter((id) => !toAdd.includes(id)),
      }));
    }

    return { succeeded: toAdd.length, skipped, missing };
  },

  "POST /adaptive-quiz/api/admin/courses/:courseId/students/unenroll/": (req) => {
    const courseId = Number(req.params.courseId);
    const ids = requestedIds(req.body);
    const enrolled = new Set(courseRosterMembers(courseId).map((p) => p.id));
    const toRemove = ids.filter((id) => enrolled.has(id));

    if (toRemove.length) {
      overlay.update<RosterChanges>(rosterKey(courseId), { added: [], removed: [] }, (state) => ({
        added: state.added.filter((id) => !toRemove.includes(id)),
        removed: [...state.removed, ...toRemove.filter((id) => !state.removed.includes(id))],
      }));
    }

    return { succeeded: toRemove.length };
  },
});
