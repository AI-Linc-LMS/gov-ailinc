"use client";

import { Box, Typography } from "@mui/material";
import { proficiencyBandColor } from "@/lib/utils/scorecard-visual";

interface ProgressRingChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  fontSize?: number;
}

/**
 * The default ring colour doubles as a SENTINEL: when the caller has not overridden it, the ring
 * is painted from the score band instead (see `finalColor` below). `#0a66c2` was that sentinel
 * and is not a government-palette value, so it moves to institutional blue.
 *
 * The old value has to stay recognised. `OverallScoreCard` passes `#0a66c2` explicitly for the
 * "Advanced" grade, which today trips the sentinel and quietly gets the band colour; if this
 * constant simply changed, that call would start rendering a literal off-palette blue instead.
 * Keeping it in the sentinel set preserves what is on screen now and makes it impossible for
 * that hue to reach the ring.
 */
const DEFAULT_RING_COLOR = "#1b4f8a";
const BAND_SENTINEL_COLORS = new Set([DEFAULT_RING_COLOR, "#0a66c2"]);
const DEFAULT_TRACK_COLOR = "var(--border-default)";

export function ProgressRingChart({
  value,
  size = 120,
  strokeWidth = 8,
  color = DEFAULT_RING_COLOR,
  showLabel = true,
  label,
  fontSize = 24,
}: ProgressRingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const finalColor = BAND_SENTINEL_COLORS.has(color) ? proficiencyBandColor(value) : color;

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={DEFAULT_TRACK_COLOR}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={finalColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      {showLabel && (
        <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              color: "var(--font-primary)",
              lineHeight: 1,
            }}
          >
            {Math.round(value)}%
          </Typography>
          {label && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                color: "var(--font-secondary)",
                mt: 0.5,
                textAlign: "center",
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
