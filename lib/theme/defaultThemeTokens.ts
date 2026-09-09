/**
 * Default palette (flat camelCase), mirroring app/globals.css :root for the case
 * where the API returns no theme.
 *
 * These values are the government palette, the same one normalizeThemeSettings
 * pins. They are kept in step deliberately: this map is what server-side rendering
 * paints with before any tenant theme arrives, so a mismatch shows up as a colour
 * flash between first paint and hydration, which on a slow connection is exactly
 * the audience this service is built for.
 */
export const DEFAULT_THEME_FLAT: Record<string, string> = {
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
  secondary50: "#eef3fa",
  secondary100: "#d9e6f4",
  secondary200: "#0e7a3c",
  secondary300: "#b32020",
  secondary400: "#164274",
  secondary500: "#0b1b2e",
  navSelected: "#17406b",
  secondary600: "#10263f",
  secondary700: "#071426",
  navBackground: "#ffffff",
  fontDarkNav: "#0a1e37",
  fontLightNav: "#eef3fa",
  accentYellow: "#b7791f",
  accentBlue: "#1b4f8a",
  accentGreen: "#0e7a3c",
  accentRed: "#b32020",
  accentOrange: "#b45309",
  accentTeal: "#0f6b7a",
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
  courseCta: "#0e7a3c",
  defaultPrimary: "#1b4f8a",
  fontDark: "#000000",
  fontPrimary: "#333333",
  fontSecondary: "#6b7280",
  fontTertiary: "#9ca3af",
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
  // DEMO REPO ONLY: empty, not the Fontshare URL upstream uses.
  //
  // ClientFontLink injects a <link> for whatever this resolves to, and the
  // tenant's own empty value still fell back to this default. Satoshi is
  // self-hosted from /public/fonts (see app/layout.tsx), so the demo needs no
  // font CDN and renders identically with no network at all.
  fontImportUrl: "",
  fontFamilySans:
    '"Satoshi","Satoshi Variable",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};
