"use client";

import { Box } from "@mui/material";

/** Shared visual helpers for the adaptive-course Students surfaces. */

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1b4f8a 0%, #1b4f8a 100%)",
  "linear-gradient(135deg, #1b4f8a 0%, #0f6b7a 100%)",
  "linear-gradient(135deg, #1b4f8a 0%, #1b4f8a 100%)",
  "linear-gradient(135deg, #0e7a3c 0%, #1b4f8a 100%)",
  "linear-gradient(135deg, #b7791f 0%, #0f6b7a 100%)",
  "linear-gradient(135deg, #0f6b7a 0%, #1b4f8a 100%)",
];

/** Brand progress-bar fill (matches the course-builder gradient). */
export const PROGRESS_GRADIENT = "linear-gradient(90deg, #1b4f8a 0%, #1b4f8a 60%, #0f6b7a 100%)";

/** Per-content-type accent colors - same palette as the builder's ModuleSummary. */
export const TYPE_COLOR = {
  quiz: "#1b4f8a",
  coding: "#0f6b7a",
  video: "#1b4f8a",
  article: "#1b4f8a",
} as const;

export function initials(name: string, email: string): string {
  const src = (name || "").trim() || (email || "").trim();
  if (!src) return "?";
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

export function StudentAvatar({
  name,
  email,
  size = 40,
  dim = false,
}: {
  name: string;
  email: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        color: "white",
        fontWeight: 800,
        fontSize: size * 0.36,
        letterSpacing: "0.02em",
        background: gradientFor(email || name),
        boxShadow: "var(--shadow-sm)",
        opacity: dim ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      {initials(name, email)}
    </Box>
  );
}

/** A gradient-filled progress bar (rounded). `value` is 0–100. */
export function GradientBar({ value, height = 8 }: { value: number; height?: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 999,
        bgcolor: "color-mix(in srgb, #1b4f8a 12%, transparent)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: `${v}%`,
          borderRadius: 999,
          background: PROGRESS_GRADIENT,
          transition: "width 240ms ease",
        }}
      />
    </Box>
  );
}
