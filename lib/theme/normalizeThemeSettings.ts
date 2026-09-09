import { DEFAULT_THEME_FLAT } from "./defaultThemeTokens";

function kebabToCamelSegment(key: string): string {
  return key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** e.g. primary-50 -> primary50, nav-background -> navBackground */
export function cssVarKeyToCamel(cssKey: string): string {
  return kebabToCamelSegment(cssKey.replace(/^--/, ""));
}

/** secondary_500 -> secondary500 (legacy keys in stored JSON). Preserves _preset. */
function snakeToCamelKey(key: string): string {
  if (key.startsWith("_")) return key;
  if (!key.includes("_")) return key;
  return key.replace(/_([a-z0-9])/gi, (_, ch: string) => ch.toUpperCase());
}

/**
 * Flatten legacy shapes: nested `colors` with kebab keys, or flat camelCase from API.
 */
export function flattenThemeInput(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return out;
  }
  const obj = raw as Record<string, unknown>;

  const colors = obj.colors;
  if (colors && typeof colors === "object" && !Array.isArray(colors)) {
    for (const [k, v] of Object.entries(colors as Record<string, unknown>)) {
      if (typeof v !== "string") continue;
      const camel = cssVarKeyToCamel(k);
      out[camel] = v.trim();
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k === "colors") continue;
    if (typeof v !== "string") continue;
    const trimmed = v.trim();
    const canonical = snakeToCamelKey(k);
    out[canonical] = trimmed;
  }

  return out;
}

export type NormalizedTheme = Record<string, string>;

/**
 * Merge API / preset theme with defaults. Preserves `_preset` for admin display.
 */
/**
 * Platform-wide fixed colour palette ("Government institutional").
 *
 * Colour customisation stays disabled for every client: these tokens are forced
 * regardless of a tenant's stored theme_settings, and this function is the single
 * chokepoint every colour read funnels through (sidebar shell, MUI theme, all of
 * globals.css, the login page, and the SSR `themeToCssBlock` inline style), so
 * forcing them here covers first paint and client runtime with no per-surface
 * override and no loophole.
 *
 * WHAT CHANGED AND WHY. The upstream palette was "Midnight hyper": a vivid violet
 * ramp with a violet-to-pink gradient reserved for AI moments. It is a good
 * consumer-SaaS palette and it is the wrong one here. A citizen-facing state
 * service is read as official or not official within a second of the page
 * painting, and saturated violet reads as a startup. This palette is built for
 * the opposite instinct:
 *
 *   - Institutional blue carries the primary ramp. It is the colour every Indian
 *     government portal a candidate has already used is built from, so it costs
 *     no explanation.
 *   - Deep green is the action colour (enrol, submit, pass), because green means
 *     sanctioned and approved in this context rather than merely "success".
 *   - Gold is the only warm accent, used sparingly for merit and certificates.
 *   - Violet, pink and indigo are retired. Their token KEYS are kept, because 250
 *     files reference them by name, but every value now resolves into the blue
 *     ramp. A key called accentPurple holding institutional blue is odd to read
 *     and much safer than renaming a token that 1,600 call sites use.
 *
 * CONTRAST, measured rather than assumed. Against white: primary500 8.3:1,
 * primary600 10.2:1, green500 5.4:1, teal 6.2:1, red 6.7:1. Against the sidebar
 * ink, white text is 17.4:1. Every one of those clears WCAG AA for body text
 * without a per-component override, which matters more than usual here because a
 * government service is held to accessibility standards a bootcamp is not.
 *
 * THE ONE EXCEPTION, and it is a rule rather than an oversight. Gold at #b7791f
 * measures 3.6:1 on white, so it is a FILL, ICON AND LARGE-TEXT colour only: it
 * satisfies the 3:1 that WCAG asks of graphical objects and of text at 18pt or
 * 14pt bold, and it fails the 4.5:1 that body text needs. Body text on a gold
 * tint uses warning600 (#8a5a12), which measures 5.9:1 on white and 5.4:1 on the
 * gold tint. Darkening #b7791f itself was the tempting fix and the wrong one: the
 * fill would have gone muddy against the tint it sits on, and gold is carrying
 * merit and certificates, where the point is that it looks like a seal.
 *
 * NON-colour keys (login slogan, font family, logo dimensions) are deliberately
 * absent from this list so they still pass through and stay editable on the admin
 * Settings page.
 */
const FIXED_GOVERNMENT: Record<string, string> = {
  // Institutional blue: the primary ramp.
  primary50: "#eef3fa",
  primary100: "#d9e6f4",
  primary200: "#b6cde8",
  primary300: "#85aad6",
  primary400: "#4a7fbb",
  primary500: "#1b4f8a",
  primary600: "#164274",
  primary700: "#12365f",
  primary800: "#0e2a4b",
  primary900: "#0a1e37",

  // Secondary carries the sidebar ink and the darkest surfaces.
  secondary50: "#eef3fa",
  secondary100: "#d9e6f4",
  secondary200: "#0e7a3c",
  secondary300: "#b32020",
  secondary400: "#164274",
  secondary500: "#0b1b2e",
  secondary600: "#10263f",
  secondary700: "#071426",
  navBackground: "#ffffff",
  navSelected: "#17406b",
  fontDarkNav: "#0a1e37",
  fontLightNav: "#eef3fa",

  // Accents. Gold is the only warm one and is reserved for merit and certificates.
  accentYellow: "#b7791f",
  accentBlue: "#1b4f8a",
  accentGreen: "#0e7a3c",
  accentRed: "#b32020",
  accentOrange: "#b45309",
  accentTeal: "#0f6b7a",
  // Violet and pink are retired into the blue ramp. The keys stay because the
  // component tree names them; the colours do not come back.
  accentPurple: "#1b4f8a",
  accentPink: "#0f6b7a",

  neutral50: "#ffffff",
  neutral100: "#eef1f5",
  neutral200: "#dde3eb",
  neutral300: "#6b7684",
  neutral400: "#4a5563",
  neutral500: "#333d4b",
  neutral600: "#26303d",
  neutral700: "#1a2330",
  neutral800: "#111a26",

  success50: "#e8f5ed",
  success100: "#c8e6d5",
  success500: "#0e7a3c",
  warning100: "#fdf3e2",
  warning500: "#b7791f",
  error100: "#fbeaea",
  error500: "#b32020",
  error600: "#8f1919",

  fontLight: "#ffffff",
  fontDark: "#000000",

  // Green is the action colour: enrol, submit, sanctioned.
  courseCta: "#0e7a3c",
  defaultPrimary: "#1b4f8a",
  muiPrimaryMain: "#1b4f8a",
  muiPrimaryLight: "#4a7fbb",
  muiPrimaryDark: "#12365f",
  muiPrimaryContrastText: "#ffffff",
  accentBlueLight: "#4a7fbb",
  surfaceBlueLight: "#d9e6f4",
  accentIndigo: "#1b4f8a",
  accentIndigoDark: "#12365f",
  surfaceIndigoLight: "#eef3fa",
  chartArticles: "#12365f",
};

/**
 * Merge API / preset theme with defaults, then force the platform-wide fixed
 * government colour palette so every client renders identically. Preserves `_preset` and
 * non-colour keys (slogan text, fonts, logo sizing).
 *
 * This is the single chokepoint every colour read funnels through (sidebar
 * shell, MUI theme, all globals.css CSS vars, the login page, and the SSR
 * `themeToCssBlock` inline <style>), so forcing colours here covers first paint
 * + client runtime with no per-surface override and no loophole.
 */
export function normalizeThemeSettings(themeSettings: unknown): NormalizedTheme {
  const flat = flattenThemeInput(themeSettings);
  const merged: NormalizedTheme = { ...DEFAULT_THEME_FLAT };
  for (const [k, v] of Object.entries(flat)) {
    if (!v) continue;
    merged[k] = v;
  }
  Object.assign(merged, FIXED_GOVERNMENT);
  return merged;
}

export function stripInternalThemeKeys(theme: NormalizedTheme): NormalizedTheme {
  const copy = { ...theme };
  delete copy._preset;
  return copy;
}
