"use client";

import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AIPillProps {
  children: ReactNode;
  variant?: "soft" | "solid";
  icon?: ReactNode;
}

/**
 * Gradient pill label used to mark AI-generated content ("Adaptive Engine",
 * "Why you got this Q", etc). Reuses the indigo→purple→pink palette to stay
 * consistent with the AIBeacon orb.
 */
export function AIPill({ children, variant = "soft", icon }: AIPillProps) {
  const isSolid = variant === "solid";
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: 999,
        background: isSolid
          ? "linear-gradient(135deg, #1b4f8a 0%, #1b4f8a 55%, #0f6b7a 100%)"
          : "color-mix(in srgb, #1b4f8a 12%, transparent)",
        border: isSolid
          ? "1px solid color-mix(in srgb, white 18%, transparent)"
          : "1px solid color-mix(in srgb, #1b4f8a 32%, transparent)",
        color: isSolid ? "white" : "color-mix(in srgb, #1b4f8a 90%, var(--text-primary, #1a1f2e))",
      }}
    >
      {icon}
      <Typography
        component="span"
        sx={{
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
