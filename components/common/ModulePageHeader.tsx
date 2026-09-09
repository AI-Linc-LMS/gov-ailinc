"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { IconWrapper } from "@/components/common/IconWrapper";
import { PageGuide } from "@/components/common/PageGuide";
import { resolveGuide } from "@/lib/guide/registry";

/**
 * Accent tones - drive the icon badge, the ambient glow, and the solid CTA.
 *
 * The rule is that `glow` is `a` expressed as rgba at its own alpha. Three tones
 * had drifted off it: emerald, amber and rose still glowed in the hues they were
 * built from before this palette existed, which no rule naming a single colour
 * could ever have caught, because a glow only exists inside a gradient string.
 *
 * The key names are deliberately unchanged. `indigo`, `purple`, `pink` and `cyan`
 * now resolve to institutional blue and institutional teal in pairs, so two of
 * them are duplicates, but every call site passes one of these strings and a
 * rename would touch a hundred files to change nothing a user sees.
 */
const ACCENTS = {
  indigo: { a: "#1b4f8a", b: "#0e2a4b", glow: "rgba(27, 79, 138,0.45)" },
  purple: { a: "#1b4f8a", b: "#14406f", glow: "rgba(27, 79, 138,0.45)" },
  pink: { a: "#0f6b7a", b: "#0b5260", glow: "rgba(15, 107, 122,0.45)" },
  emerald: { a: "#0e7a3c", b: "#0B6232", glow: "rgba(14, 122, 60,0.42)" },
  amber: { a: "#b7791f", b: "#8a5a12", glow: "rgba(183, 121, 31,0.42)" },
  cyan: { a: "#0f6b7a", b: "#0b5260", glow: "rgba(15, 107, 122,0.42)" },
  rose: { a: "#b32020", b: "#991b1b", glow: "rgba(179, 32, 32,0.44)" },
} as const;

export type ModuleAccent = keyof typeof ACCENTS;

/**
 * The one page header used across every module (student + admin) so pages stay
 * consistent: a deep navy gradient hero with an uppercase eyebrow (the
 * module/section it belongs to), a big bold title, a detailed description, an
 * optional icon badge, and a right-hand action slot - "not just a header, but
 * something you can act from". Same dark-hero family as the dashboard/resume
 * heroes so the whole product reads as one surface.
 */
export function ModulePageHeader({
  eyebrow,
  title,
  description,
  accent = "indigo",
  icon,
  action,
  guideKey,
  hideGuide,
}: {
  /** Uppercase category, e.g. "LEARN" or "ASSESSMENT MANAGEMENT". */
  eyebrow: string;
  title: string;
  /** A real description of what the module does - not a one-liner label. */
  description?: string;
  accent?: ModuleAccent;
  /** Optional Iconify icon → shows an icon badge. */
  icon?: string;
  /** Right-side action(s): use HeaderActionButton, a menu, or any node. */
  action?: ReactNode;
  /** Force a specific guide registry key instead of resolving from the pathname. */
  guideKey?: string;
  /** Hide the "?" page guide even if the route has one. */
  hideGuide?: boolean;
}) {
  const tone = ACCENTS[accent];
  const pathname = usePathname();
  // The "?" page guide auto-appears wherever the route has a registry entry.
  const guide = hideGuide ? undefined : resolveGuide(guideKey ?? pathname);
  return (
    <Box
      data-tour-id="page-header"
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        color: "white",
        position: "relative",
        overflow: "hidden",
        // The base ladder used to be the vendor's violet-black. It is now the three
        // darkest government surfaces, and this header renders on every module
        // page, student and admin, so it was the single largest surface still
        // painting a retired hue.
        background: `radial-gradient(120% 130% at 8% 115%, ${tone.glow} 0%, rgba(20, 64, 111,0.22) 32%, rgba(7,20,38,0) 62%), linear-gradient(150deg, #10263f 0%, #0b1b2e 55%, #071426 100%)`,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* faint dotted texture */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative" }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
          {icon && (
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                color: "white",
                background: `linear-gradient(135deg, ${tone.a}, ${tone.b})`,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <IconWrapper icon={icon} size={26} />
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.5rem", md: "2rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                mt: 0.25,
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.92rem" },
                  color: "rgba(255,255,255,0.78)",
                  mt: 1,
                  maxWidth: 680,
                  lineHeight: 1.55,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>
        {(guide || action) && (
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 1.25 }}>
            {guide && <PageGuide content={guide} />}
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

/**
 * Pill CTA styled to read on the dark hero. `variant="solid"` = gradient
 * primary; `variant="ghost"` = translucent secondary.
 */
export function HeaderActionButton({
  icon,
  children,
  onClick,
  variant = "solid",
  disabled = false,
}: {
  icon?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  disabled?: boolean;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        px: 2.25,
        py: 1.1,
        borderRadius: 999,
        fontWeight: 800,
        fontSize: "0.9rem",
        gap: 0.75,
        color: "white",
        opacity: disabled ? 0.5 : 1,
        transition: "filter .15s, background .15s",
        ...(variant === "solid"
          ? {
              background: "linear-gradient(135deg, #1b4f8a 0%, #0f6b7a 100%)",
              boxShadow: "var(--shadow-sm)",
              "&:hover": { filter: "brightness(1.06)" },
            }
          : {
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }),
      }}
    >
      {icon && <IconWrapper icon={icon} size={17} />}
      {children}
    </ButtonBase>
  );
}
