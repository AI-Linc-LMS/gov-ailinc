/**
 * Profile surface design tokens.
 *
 * Same reasoning as components/auth/layout/authTokens.ts: these are deliberately literal
 * constants, NOT CSS custom properties. A new `--var` has to be registered in CAMEL_TO_CSS
 * (lib/theme/applyDocumentTheme.ts), DEFAULT_THEME_FLAT, ALLOWED_THEME_KEYS
 * (lib/services/admin/branding.service.ts) and the Python serializer, or it is silently
 * dropped. None of these vary per tenant, so a constant is honest.
 *
 * Values are taken from the SHIPPED dashboard (components/dashboard/v2/*), not from the
 * token file and not from DESIGN.md sections 4 and 6. DESIGN.md section 2 says "match the
 * dashboard, do not invent a second one", but section 4 forbids 700+ weights and section 6
 * forbids gradient pill CTAs, both of which the shipped dashboard uses. The dashboard is
 * what a student actually sees, so it wins here.
 *
 * Colours that already exist as variables (ink, violet, hairline) are re-pointed for this
 * surface by the `.profile-surface` scope in app/globals.css. This file carries only the
 * STRUCTURAL values, which were never variables: the hero gradient, the panel radius and
 * shadow ladder, the icon-tile and CTA gradients.
 */

export const PROFILE = {
  ink: "#0f172a",
  inkMuted: "#475569",
  inkFaint: "#64748b",

  canvas: "#fbfbfd",
  surface: "#ffffff",
  hairline: "#e4e7f0",
  hairlineSoft: "#eef2f7",

  violet: "#14406f",
  violetLight: "#1b4f8a",
  violetSoft: "#eef3fa",
  violetBorder: "#eef3fa",
  indigo: "#1b4f8a",
  pink: "#0f6b7a",

  /** Dark hero base stops. Mirrors AiBriefingHero. These were the vendor's
   *  violet-black ladder; they are now the three darkest government surfaces
   *  named in the palette, in the same lightest-to-darkest order, so the hero
   *  reads as deep navy rather than deep violet. */
  night: "#071426",
  night2: "#0b1b2e",
  night3: "#10263f",
} as const;

/**
 * The dark hero. Copied verbatim from AiBriefingHero.tsx so the profile hero and the
 * dashboard hero are the same object, not two things that look similar.
 */
export const HERO_BG =
  // The bottom-left bloom was fuchsia at 45%. It is doing real work (without it
  // the hero is a flat slab), so it is recoloured rather than removed, to the
  // institutional teal at the same alpha. The mid stop was already blue; the
  // outer stop is fully transparent, so only its channels changed.
  "radial-gradient(110% 130% at 12% 112%, rgba(15,107,122,0.45) 0%, rgba(20, 64, 111,0.30) 30%, rgba(7,20,38,0) 60%), " +
  "linear-gradient(150deg, #10263f 0%, #0b1b2e 55%, #071426 100%)";

/**
 * Was a 60px violet glow at 70% opacity, which the palette rules rule out three
 * times over: blur past ~16px, alpha past ~15%, and a saturated hue instead of
 * navy ink. A government service should look printed, so this is the shared
 * elevation token, and the hero's own dark fill supplies the rest of the
 * separation it needs against the canvas.
 */
export const HERO_SHADOW = "var(--shadow-lg)";

/** MUI spacing unit, so `borderRadius: HERO_RADIUS` reads as 40px. */
export const HERO_RADIUS = 5;

/**
 * White card on canvas. From parts.tsx PanelCard: a defined border plus a soft shadow so
 * the cards read as cards next to the dark hero rather than as plain rectangles.
 *
 * Was a 28px indigo-tinted drop. Now the shared token, which is the same short
 * two-layer shape in navy ink. The border is what actually separates a white
 * card from the canvas, which is why losing the reach costs nothing.
 */
export const PANEL_SHADOW = "var(--shadow-sm)";

export const PANEL_BORDER = `1px solid ${PROFILE.hairline}`;

/** MUI spacing unit → 32px. */
export const PANEL_RADIUS = 4;

/** The 30px section-header icon tile. */
export const TILE_GRADIENT = "linear-gradient(135deg, #1b4f8a, #1b4f8a)";

/** Primary action. The dashboard's gradient pill; see the DESIGN.md note above. */
export const CTA_GRADIENT = "linear-gradient(135deg, #1b4f8a 0%, #0f6b7a 100%)";

/** Was a 34px fuchsia glow at 70% opacity under the primary action. The CTA is
 *  already a filled institutional-blue pill, so it needs lift, not a halo. */
export const CTA_SHADOW = "var(--shadow-md)";

/** Translucent surfaces used on top of the dark hero. */
export const ON_DARK = {
  fill: "rgba(255,255,255,0.10)",
  fillStrong: "rgba(255,255,255,0.16)",
  border: "rgba(255,255,255,0.14)",
  borderStrong: "rgba(255,255,255,0.34)",
  cardFill: "rgba(0,0,0,0.20)",
  cardFillHover: "rgba(0,0,0,0.28)",
  text: "#ffffff",
  textSoft: "rgba(255,255,255,0.86)",
  textFaint: "rgba(255,255,255,0.60)",
  divider: "rgba(255,255,255,0.12)",
} as const;

/** Activity heatmap intensity ladder, violet rather than the old indigo. */
export const HEAT_SCALE = ["#f1f5f9", "#eef3fa", "#b6cde8", "#85aad6", "#14406f"] as const;

/**
 * Stat tile accents. Same four the dashboard StatCards row uses, in the same order, so a
 * student reading both surfaces learns one colour language.
 */
export const STAT_ACCENT = {
  violet: "#14406f",
  amber: "#b7791f",
  blue: "#4a7fbb",
  green: "#0e7a3c",
} as const;

/** Entrance motion. Matches the dashboard's Reveal. */
export const EASE = "cubic-bezier(.175,.885,.32,1.1)";
