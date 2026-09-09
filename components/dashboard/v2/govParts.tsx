"use client";

import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { PanelCard, SectionHeader } from "./parts";

/**
 * Shared pieces for the three government panels in the dashboard's left column
 * (recruitment calendar, mission notices, at a glance).
 *
 * They are list surfaces, not card grids: a calendar row is a row, so the
 * separation between them is a hairline rule and space, never a nested box. A
 * government service should read like a printed notice board, and a page of
 * cards inside cards is the fastest way to make one look like a consumer app.
 */

/** Hairline between list rows. The first row in a list carries none. */
export const ROW_RULE = "1px solid #eef1f5";

/** Inside a week is what "closing soon" means to somebody still gathering papers. */
export const CLOSING_SOON_DAYS = 7;

/**
 * Whole calendar days from today to an ISO instant, or null if unparseable.
 *
 * Counted in whole days on both sides rather than by subtracting the raw
 * milliseconds, so a date fourteen hours away is "tomorrow" and not "today".
 * Computed in the browser at render rather than sent down by the endpoint on
 * purpose: the dashboard query cache is persisted across reloads, so a
 * "closes in 3 days" that arrived with the payload would still say three days
 * a week later. The ISO date it is derived from cannot go stale.
 */
export function daysFromToday(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const at = new Date(iso);
  const target = at.getTime();
  if (Number.isNaN(target)) return null;
  const now = new Date();
  return Math.round(
    (Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) /
      86_400_000,
  );
}

/**
 * "today" / "tomorrow" / "in 9 days", and the same thing for a date gone past.
 *
 * Urgency has to survive being read in greyscale and by somebody who cannot
 * separate red from grey, so it is always words. The colour on top of it is the
 * second signal, never the only one.
 */
export function relativeDayLabel(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `in ${days} days`;
}

/** A small pill. Icon plus words, so the tint is never carrying it alone. */
export function GovChip({
  icon,
  label,
  color,
  bg,
}: {
  icon?: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.35,
        px: 0.7,
        py: 0.2,
        borderRadius: 999,
        fontSize: "0.66rem",
        fontWeight: 800,
        lineHeight: 1.5,
        color,
        bgcolor: bg,
        maxWidth: "100%",
      }}
    >
      {icon && <Icon icon={icon} width={12} style={{ flexShrink: 0 }} />}
      <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </Box>
    </Box>
  );
}

/**
 * The line that makes a panel safe to put in front of an officer.
 *
 * Deliberately at the TOP of the panel and on the tinted ground of the primary
 * ramp, not set small at the bottom. A dated calendar assembled by a demo is
 * only honest if the reader meets the caveat before the dates, and fine print
 * under fourteen rows is not met before anything.
 */
export function GovNote({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      direction="row"
      spacing={0.85}
      sx={{
        mb: 1.5,
        px: 1.1,
        py: 0.85,
        borderRadius: 2,
        border: "1px solid #d9e6f4",
        bgcolor: "#eef3fa",
        alignItems: "flex-start",
      }}
    >
      <Icon icon="mdi:information-outline" width={15} color="#12365f" style={{ flexShrink: 0, marginTop: 2 }} />
      <Typography sx={{ fontSize: "0.72rem", lineHeight: 1.5, color: "#12365f" }}>{children}</Typography>
    </Stack>
  );
}

/** Loading state: the real heading over shimmering rows, so nothing jumps. */
export function GovPanelSkeleton({
  icon,
  title,
  subtitle,
  rows = 4,
}: {
  icon: string;
  title: string;
  subtitle: string;
  rows?: number;
}) {
  return (
    <PanelCard>
      <SectionHeader icon={icon} title={title} subtitle={subtitle} />
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
            <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: 2, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="72%" height={18} />
              <Skeleton variant="text" width="45%" height={14} />
            </Box>
          </Stack>
        ))}
      </Stack>
    </PanelCard>
  );
}
