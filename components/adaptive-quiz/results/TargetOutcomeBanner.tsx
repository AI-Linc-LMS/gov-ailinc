"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface TargetOutcome {
  kind: "mastered" | "improving" | "no_progress" | "first_measure";
  target_skill: string;
  mastery_pct: number;
  delta_pct: number | null;
  previous_mastery_pct: number | null;
}

interface TargetOutcomeBannerProps {
  outcome: TargetOutcome;
}

function prettySkill(s: string): string {
  if (!s) return "this skill";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Re-quiz outcome banner - shown at the top of the results page when the
 * session targeted exactly one skill (i.e. it's a re-quiz). Three variants,
 * each with its own accent palette + iconography so the student knows the
 * verdict at a glance:
 *
 *   * mastered  - green / trophy, "Skill mastered" celebration
 *   * improving - amber / trending-up, +X pts shown but didn't cross 75%
 *   * no_progress - slate / refresh, no movement (or regression)
 *   * first_measure - indigo / compass, first measured level (no prior to compare against)
 */
export function TargetOutcomeBanner({ outcome }: TargetOutcomeBannerProps) {
  const theme = OUTCOME_THEME[outcome.kind];
  const skillLabel = prettySkill(outcome.target_skill);
  const deltaLabel =
    outcome.delta_pct !== null && outcome.delta_pct !== 0
      ? `${outcome.delta_pct > 0 ? "+" : ""}${outcome.delta_pct} pts`
      : null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        p: { xs: 2.25, md: 2.75 },
        bgcolor: "var(--card-bg)",
        border: `1px solid color-mix(in srgb, ${theme.accent} 35%, transparent)`,
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Soft gradient wash */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${theme.accent} 14%, transparent) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      {/* Pulse halo on mastered */}
      {outcome.kind === "mastered" && (
        <Box
          aria-hidden
          component={motion.div}
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: -50,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accent} 0%, transparent 65%)`,
            filter: "blur(28px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon badge */}
      <Box
        sx={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentEnd} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Icon icon={theme.icon} width={28} />
      </Box>

      {/* Copy */}
      <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.66rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: theme.accent,
            lineHeight: 1,
          }}
        >
          {theme.eyebrow}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1.05rem", md: "1.2rem" },
            fontWeight: 800,
            letterSpacing: "-0.015em",
            mt: 0.5,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {theme.title({ skill: skillLabel, mastery: outcome.mastery_pct, delta: deltaLabel })}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
            mt: 0.5,
            lineHeight: 1.5,
          }}
        >
          {theme.subtitle({ skill: skillLabel, mastery: outcome.mastery_pct, delta: deltaLabel })}
        </Typography>
      </Box>

      {/* Big mastery % at the right */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          flexShrink: 0,
          minWidth: 76,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.75rem", md: "2.1rem" },
            fontWeight: 900,
            color: theme.accent,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {outcome.mastery_pct}%
        </Typography>
        {deltaLabel && (
          <Typography
            sx={{
              fontSize: "0.74rem",
              fontWeight: 800,
              color: outcome.delta_pct && outcome.delta_pct > 0 ? "#0e7a3c" : "#b32020",
              mt: 0.4,
            }}
          >
            {deltaLabel}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const OUTCOME_THEME: Record<
  TargetOutcome["kind"],
  {
    accent: string;
    accentEnd: string;
    icon: string;
    eyebrow: string;
    title: (ctx: { skill: string; mastery: number; delta: string | null }) => string;
    subtitle: (ctx: { skill: string; mastery: number; delta: string | null }) => string;
  }
> = {
  mastered: {
    accent: "#0e7a3c",
    accentEnd: "#0B6232",
    icon: "mdi:trophy-variant",
    eyebrow: "Skill mastered",
    title: ({ skill }) => `You've mastered ${skill}.`,
    subtitle: ({ delta, mastery }) =>
      delta
        ? `${mastery}% mastery, ${delta} since your last attempt. Move on to a fresh challenge - this skill is in your pocket.`
        : `${mastery}% mastery - solid command of this skill.`,
  },
  improving: {
    accent: "#b7791f",
    accentEnd: "#0f6b7a",
    icon: "mdi:trending-up",
    eyebrow: "Improving",
    title: ({ skill, delta }) => `${skill} is moving in the right direction (${delta ?? "↑"}).`,
    subtitle: ({ mastery }) =>
      `You're at ${mastery}%. One more re-quiz should push this past 75% and clear the mastered bar.`,
  },
  no_progress: {
    accent: "#64748b",
    accentEnd: "#475569",
    icon: "mdi:refresh",
    eyebrow: "Keep practising",
    title: ({ skill }) => `No new ground on ${skill} this round.`,
    subtitle: ({ mastery }) =>
      `Mastery held at ${mastery}%. Re-read the misconceptions below before the next re-quiz - different angle, better result.`,
  },
  first_measure: {
    accent: "#1b4f8a",
    accentEnd: "#12365f",
    icon: "mdi:compass-outline",
    eyebrow: "First look",
    title: ({ skill }) => `First read on ${skill}.`,
    subtitle: ({ mastery }) =>
      `You're at ${mastery}% on this skill - your first measured level here. Keep practising and the next re-quiz will show how far you've moved.`,
  },
};
