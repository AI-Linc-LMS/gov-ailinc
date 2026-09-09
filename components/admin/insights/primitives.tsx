"use client";

import type { ReactNode } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { IconWrapper } from "@/components/common/IconWrapper";

/**
 * Shared surfaces for the insights dashboard.
 *
 * The rule these encode: **every number carries its definition.** The API returns a
 * `definition` string with each metric and `MetricTile` renders it behind an ⓘ, because
 * these figures get quoted in meetings and a number whose page cannot say what it counted
 * gets read with whichever meaning is most flattering. Several of the metrics this dashboard
 * replaces were wrong in exactly that way for months.
 */

export const INSIGHT = {
  indigo: "#1b4f8a",
  purple: "#1b4f8a",
  pink: "#0f6b7a",
  green: "#0e7a3c",
  amber: "#b7791f",
  red: "#b32020",
  blue: "#4a7fbb",
  teal: "#0f6b7a",
  gradient: "linear-gradient(135deg,#1b4f8a 0%,#1b4f8a 60%,#0f6b7a 100%)",
} as const;

/**
 * The categorical scale: identity, assigned in this fixed order and NEVER cycled or
 * re-sorted, so a series keeps its colour when the range filter changes the series count.
 *
 * It is written as literals rather than as INSIGHT members on purpose. INSIGHT is the
 * dashboard's *accent* map, and on the government palette several of its keys are
 * deliberate synonyms - `indigo` and `purple` are both #1b4f8a, `pink` and `teal` are both
 * #0f6b7a. Building the series scale out of those keys silently painted series 1 and 6
 * identically, and series 4 and 7 identically, which is worse than the off-brand colour it
 * was fixing. Keep the two concerns separate.
 *
 * Order derived by enumeration against the data-viz gates, not by taste. Measured:
 *   adjacent (stacked areas, grouped bars)  worst CVD dE 6.5 gold/green, normal dE 17.4 PASS
 *   first four, ALL PAIRS (the 4-slice donut) worst CVD dE 6.5, normal dE 17.4 PASS,
 *                                             every slot >= 3:1 on the card
 * Gold and green are the one pair in the floor band (6-8), which is legal only alongside
 * secondary encoding: both charts that can place them together ship a legend that names and
 * numbers every series, and the donut also carries a 2px card-coloured gap between slices.
 *
 * This is the brief's palette re-ordered, not a different palette: slots 1-3 are unchanged,
 * and teal moved off slot 4 because teal against institutional blue (dE 9.6) and against
 * sanctioned green (dE 11.9) both sit under the normal-vision floor of 15, so a four-slice
 * donut using it had two pairs a full-colour reader could not separate.
 */
export const SERIES_COLORS = [
  "#1b4f8a", // institutional blue
  "#0e7a3c", // sanctioned green
  "#b7791f", // gold
  "#6b4423", // brown
  "#85aad6", // light blue - 2.41:1 on the card, so only ever with a legend or a direct label
  "#0f6b7a", // teal
  "#8f1919", // deep red
  "#4a5563", // slate
];

export function Panel({
  title,
  subtitle,
  icon,
  accent = INSIGHT.indigo,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  accent?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid color-mix(in srgb, var(--border-default) 80%, transparent)",
        backgroundColor: "var(--card-bg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 2, md: 2.5 },
          py: 1.75,
          borderBottom: "1px solid color-mix(in srgb, var(--border-default) 70%, transparent)",
          // A tinted band rather than white-on-white. Every panel reading as one flat sheet is
          // what made the deck feel empty; the accent also tells the sections apart at a glance.
          background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 9%, transparent) 0%, transparent 62%)`,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 55%, #1b4f8a))`,
            color: "#fff",
            boxShadow: `0 8px 18px -10px color-mix(in srgb, ${accent} 85%, transparent)`,
            flexShrink: 0,
          }}
        >
          <IconWrapper icon={icon} size={19} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 800, color: "var(--font-primary)", lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: "0.76rem", color: "var(--font-secondary)" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 }, flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

export function DefinitionMark({ text }: { text: string }) {
  return (
    <Tooltip title={text} arrow enterTouchDelay={0} describeChild>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "var(--font-secondary)",
          opacity: 0.65,
          cursor: "help",
          "&:hover": { opacity: 1 },
        }}
      >
        <IconWrapper icon="mdi:information-outline" size={14} />
      </Box>
    </Tooltip>
  );
}

export function MetricTile({
  label,
  value,
  definition,
  delta,
  suffix,
  denominator,
  accent = INSIGHT.indigo,
  icon,
}: {
  label: string;
  value: number | string;
  definition: string;
  /** Absolute change and percentage. `pct: null` means there was no baseline to compare to. */
  delta?: { diff: number; pct: number | null };
  suffix?: string;
  denominator?: number;
  accent?: string;
  icon: string;
}) {
  const up = (delta?.diff ?? 0) > 0;
  const flat = (delta?.diff ?? 0) === 0;

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid color-mix(in srgb, var(--border-default) 80%, transparent)",
        backgroundColor: "var(--card-bg)",
        p: { xs: 2, md: 2.25 },
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 100% 0%, color-mix(in srgb, ${accent} 10%, transparent) 0%, transparent 60%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.25,
            display: "grid",
            placeItems: "center",
            backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
            color: accent,
          }}
        >
          <IconWrapper icon={icon} size={16} />
        </Box>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--font-secondary)",
          }}
        >
          {label}
        </Typography>
        <DefinitionMark text={definition} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, position: "relative" }}>
        <Typography
          sx={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--font-primary)", lineHeight: 1.1 }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>
        {suffix && (
          <Typography sx={{ fontSize: "0.9rem", color: "var(--font-secondary)", fontWeight: 700 }}>
            {suffix}
          </Typography>
        )}
        {denominator !== undefined && (
          <Typography sx={{ fontSize: "0.85rem", color: "var(--font-secondary)" }}>
            / {denominator.toLocaleString()}
          </Typography>
        )}
      </Box>

      {delta && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, position: "relative" }}>
          {flat ? (
            <Typography sx={{ fontSize: "0.78rem", color: "var(--font-secondary)" }}>
              No change from the previous period
            </Typography>
          ) : (
            <>
              <IconWrapper
                icon={up ? "mdi:trending-up" : "mdi:trending-down"}
                size={15}
                color={up ? INSIGHT.green : INSIGHT.red}
              />
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: up ? INSIGHT.green : INSIGHT.red,
                }}
              >
                {up ? "+" : ""}
                {delta.diff.toLocaleString()}
                {/* pct is null when the previous period was zero. "+100%" from a base of nothing
                    is meaningless, so say there was no baseline instead of inventing one. */}
                {delta.pct !== null ? ` (${delta.pct > 0 ? "+" : ""}${delta.pct}%)` : ""}
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "var(--font-secondary)" }}>
                vs previous period
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}

/**
 * Day x hour study-time heatmap.
 *
 * Hand-built because Recharts has no heatmap, and because this is the one chart that answers
 * "when should we schedule live sessions" — a question a line of daily totals cannot address
 * at all. Cells are coloured on a square-root scale: a linear ramp against a single spiky peak
 * flattens every other cell to the same near-white and hides the shape of the week.
 */
/** 0 -> 12am, 13 -> 1pm. Admins read the clock they use, not a 24-hour one. */
function amPm(hour: number): string {
  const suffix = hour < 12 ? "am" : "pm";
  return `${hour % 12 || 12}${suffix}`;
}

export function HourHeatmap({
  matrix,
  max,
  timezone,
}: {
  matrix: Array<{ day: string; hours: number[] }>;
  max: number;
  timezone: string;
}) {
  const intensity = (n: number) => (max <= 0 ? 0 : Math.sqrt(n / max));

  return (
    <Box>
      <Box sx={{ overflowX: "auto", pb: 1 }}>
        <Box sx={{ minWidth: 760 }}>
          <Box sx={{ display: "flex", gap: 0.4, mb: 0.5, pl: 4.5 }}>
            {Array.from({ length: 24 }, (_, h) => (
              <Box
                key={h}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "0.56rem",
                  color: "var(--font-secondary)",
                  fontWeight: 700,
                }}
              >
                {h % 3 === 0 ? amPm(h) : ""}
              </Box>
            ))}
          </Box>

          {matrix.map((row) => (
            <Box key={row.day} sx={{ display: "flex", alignItems: "center", gap: 0.4, mb: 0.4 }}>
              <Box
                sx={{
                  width: 34,
                  flexShrink: 0,
                  fontSize: "0.66rem",
                  fontWeight: 800,
                  color: "var(--font-secondary)",
                }}
              >
                {row.day}
              </Box>
              {row.hours.map((n, h) => (
                <Tooltip
                  key={h}
                  arrow
                  enterTouchDelay={0}
                  title={`${row.day} ${amPm(h)} to ${amPm((h + 1) % 24)} — ${n.toLocaleString()} ${
                    n === 1 ? "activity" : "activities"
                  }`}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: 22,
                      borderRadius: 0.75,
                      backgroundColor:
                        n === 0
                          ? "color-mix(in srgb, var(--border-default) 40%, transparent)"
                          : `color-mix(in srgb, ${INSIGHT.indigo} ${Math.round(
                              intensity(n) * 100
                            )}%, transparent)`,
                      cursor: "default",
                      transition: "transform .1s",
                      "&:hover": { transform: "scale(1.25)", zIndex: 1 },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 1.5,
          flexWrap: "wrap",
          fontSize: "0.72rem",
          color: "var(--font-secondary)",
        }}
      >
        <span>Quiet</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <Box
            key={v}
            sx={{
              width: 18,
              height: 12,
              borderRadius: 0.5,
              backgroundColor:
                v === 0
                  ? "color-mix(in srgb, var(--border-default) 40%, transparent)"
                  : `color-mix(in srgb, ${INSIGHT.indigo} ${Math.round(v * 100)}%, transparent)`,
            }}
          />
        ))}
        <span>Busy</span>
        <Box sx={{ flex: 1 }} />
        <span>Times shown in {timezone}</span>
      </Box>
    </Box>
  );
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <Box
      sx={{
        py: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        textAlign: "center",
        color: "var(--font-secondary)",
      }}
    >
      <IconWrapper icon={icon} size={34} />
      <Typography sx={{ fontWeight: 700, color: "var(--font-primary)" }}>{title}</Typography>
      {hint && <Typography sx={{ fontSize: "0.83rem", maxWidth: 380 }}>{hint}</Typography>}
    </Box>
  );
}
