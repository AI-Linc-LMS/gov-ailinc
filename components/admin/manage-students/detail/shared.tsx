"use client";

import type { ReactNode } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { IconWrapper } from "@/components/common/IconWrapper";

/**
 * Adaptive-module signature palette + decorative radial mesh, mirrored from the
 * Adaptive Course Builder so the student detail page shares its visual identity.
 */
export const ADAPTIVE = {
  indigo: "#1b4f8a",
  purple: "#1b4f8a",
  pink: "#0f6b7a",
  green: "#0e7a3c",
  amber: "#b7791f",
  red: "#b32020",
  blue: "#4a7fbb",
  gradient: "linear-gradient(135deg,#1b4f8a 0%,#1b4f8a 60%,#0f6b7a 100%)",
} as const;

export const ADAPTIVE_MESH = [
  "radial-gradient(circle at 8% 0%, color-mix(in srgb, #1b4f8a 18%, transparent) 0%, transparent 55%)",
  "radial-gradient(circle at 95% 5%, color-mix(in srgb, #0f6b7a 14%, transparent) 0%, transparent 55%)",
  "radial-gradient(circle at 50% 110%, color-mix(in srgb, #1b4f8a 16%, transparent) 0%, transparent 60%)",
];

/**
 * Chart series colours: identity, in this fixed order, never cycled or re-sorted.
 *
 * The previous list repeated itself - slot 1 and slot 6 were both #1b4f8a and slot 4 and slot 7
 * were both #0f6b7a - so the "Activity by type" pie painted two different types the same colour
 * as soon as it had more than five slices, and slot 5 was a ramp step rather than a categorical
 * hue. Eight distinct hues now, ordered by enumeration against the data-viz gates.
 *
 * Measured, all pairs (a pie is an all-pairs form: any two slices can end up adjacent):
 *   up to 5 slices  worst CVD dE 6.5 gold/green, normal dE 17.4 PASS
 *   6 or more       teal against institutional blue drops to dE 9.6, under the floor of 15
 * The pies using this list carry a direct label on every slice plus a legend, so past five
 * categories the text is what separates them and the fill is only support.
 */
export const CHART_COLORS = [
  "#1b4f8a", // institutional blue
  "#0e7a3c", // sanctioned green
  "#b7791f", // gold
  "#6b4423", // brown
  "#85aad6", // light blue
  "#0f6b7a", // teal
  "#8f1919", // deep red
  "#4a5563", // slate
];

export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

/** Color a 0–100 percentage from red → amber → green. */
export function pctColor(pct: number): string {
  if (pct >= 75) return ADAPTIVE.green;
  if (pct >= 40) return ADAPTIVE.amber;
  return ADAPTIVE.red;
}

export function ProgressBar({
  value,
  color,
  height = 8,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = color ?? pctColor(clamped);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
      <LinearProgress
        variant="determinate"
        value={clamped}
        sx={{
          flex: 1,
          height,
          borderRadius: 999,
          backgroundColor: "color-mix(in srgb, var(--border-default) 60%, transparent)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: barColor,
          },
        }}
      />
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.78rem",
          color: "var(--font-secondary)",
          fontVariantNumeric: "tabular-nums",
          minWidth: 38,
          textAlign: "right",
        }}
      >
        {clamped.toFixed(0)}%
      </Typography>
    </Box>
  );
}

export function StatPill({
  label,
  value,
  accent = ADAPTIVE.indigo,
  icon,
}: {
  label: string;
  value: ReactNode;
  accent?: string;
  icon?: string;
}) {
  return (
    <Box
      sx={{
        flex: "1 1 140px",
        minWidth: 130,
        p: 2,
        borderRadius: 2.5,
        border: "1px solid color-mix(in srgb, var(--border-default) 80%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--card-bg) 70%, transparent)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 28,
          height: 2,
          background: accent,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
        {icon && <IconWrapper icon={icon} size={16} color={accent} />}
        <Typography
          sx={{
            fontSize: "0.66rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--font-secondary)",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.5rem",
          lineHeight: 1.1,
          color: "var(--font-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function EmptyState({
  icon = "mdi:inbox-outline",
  title,
  hint,
}: {
  icon?: string;
  title: string;
  hint?: string;
}) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        textAlign: "center",
        border: "1px dashed color-mix(in srgb, var(--border-default) 90%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--surface) 50%, transparent)",
      }}
    >
      <IconWrapper icon={icon} size={42} color={ADAPTIVE.purple} />
      <Typography sx={{ fontWeight: 700, mt: 1.5, color: "var(--font-primary)" }}>
        {title}
      </Typography>
      {hint && (
        <Typography
          variant="body2"
          sx={{ color: "var(--font-secondary)", mt: 0.5, maxWidth: 480, mx: "auto" }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}

export function StatusChip({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const map: Record<string, string> = {
    completed: ADAPTIVE.green,
    submitted: ADAPTIVE.green,
    evaluated: ADAPTIVE.green,
    published: ADAPTIVE.green,
    passed: ADAPTIVE.green,
    in_progress: ADAPTIVE.amber,
    active: ADAPTIVE.blue,
    scheduled: ADAPTIVE.blue,
    abandoned: ADAPTIVE.red,
    failed: ADAPTIVE.red,
    cancelled: ADAPTIVE.red,
  };
  const color = map[s] ?? "#6b7684";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1,
        py: 0.3,
        borderRadius: 999,
        fontSize: "0.66rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        color,
        bgcolor: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      {status || "-"}
    </Box>
  );
}

/** Horizontal labelled bars for a {skill: 0..1 or 0..100} map. */
export function SkillBars({
  data,
  scale = 1,
  emptyLabel,
}: {
  data: Record<string, number>;
  /** 1 → values are 0..1 (multiplied by 100); 100 → values already 0..100. */
  scale?: 1 | 100;
  emptyLabel?: string;
}) {
  const entries = Object.entries(data || {}).filter(
    ([, v]) => typeof v === "number"
  );
  if (entries.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "var(--font-secondary)" }}>
        {emptyLabel || "No skill data yet."}
      </Typography>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {entries
        .sort((a, b) => b[1] - a[1])
        .map(([skill, raw]) => {
          const pct = scale === 1 ? raw * 100 : raw;
          return (
            <Box key={skill}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--font-primary)",
                  mb: 0.5,
                  textTransform: "capitalize",
                }}
              >
                {skill.replace(/_/g, " ")}
              </Typography>
              <ProgressBar value={pct} />
            </Box>
          );
        })}
    </Box>
  );
}
