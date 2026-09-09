"use client";

import { useState } from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useInstantNavigation } from "@/lib/hooks/useInstantNavigation";
import {
  useIsAssessmentEnabled,
  useIsJobsEnabled,
} from "@/lib/contexts/ClientInfoContext";
import { dashboardService } from "@/lib/services/dashboard.service";
import type {
  RecruitmentCalendarEntry,
  RecruitmentCalendarMonth,
  RecruitmentStage,
} from "@/lib/types/dashboard";
import { PanelCard, SectionHeader } from "./parts";
import {
  CLOSING_SOON_DAYS,
  GovChip,
  GovNote,
  GovPanelSkeleton,
  ROW_RULE,
  daysFromToday,
  relativeDayLabel,
} from "./govParts";

/**
 * The recruitment calendar: what is open, what closes soon, and what the
 * aspirant sits next.
 *
 * This panel exists because the left column of the dashboard used to end at the
 * course readiness card. The row below it is gated on the legacy `course`
 * feature flag, which this tenant deliberately leaves off, so the column
 * stopped while the right rail carried on beside dead space. The right thing to
 * put there is not more of the learning product. It is the calendar an aspirant
 * opens before anything else.
 *
 * Every row is derived from a record another screen already reads (the job
 * board's notifications, the mission's own scheduled papers), so the dashboard
 * cannot tell an officer one closing date while the posting tells them another.
 *
 * Two rules this panel is built around:
 *  - Urgency is words first. "closes in 3 days" survives greyscale, a
 *    colour-blind reader and a printout; a red dot does not.
 *  - Nothing here is a real recruitment calendar, and the panel says so above
 *    the dates rather than under them. That note is not decoration bolted on at
 *    the end, it is the thing that makes a generated calendar safe to show.
 */

const CALENDAR_QUERY_KEY = ["gov-recruitment-calendar"] as const;

/**
 * Rows shown before the reader asks for the rest.
 *
 * The endpoint sends the whole horizon, which runs to fourteen dates across
 * four months. Printing all of them made the left column overshoot the right
 * rail by more than fifteen hundred pixels, which is the same dead space this
 * panel was added to remove, only upside down. Seven is what the column has room
 * for beside the rail, and the rest are one click away rather than cut.
 */
const DEFAULT_VISIBLE = 7;

/** The line that has to be on screen wherever these dates are. */
const ILLUSTRATIVE_NOTE =
  "This calendar is illustrative. Every date on it is generated for this preview and moves with the demo clock. Check the recruiting body's own notification before you act on any of it.";

/**
 * Stage identity: an icon and a tint per stage, all off the institutional ramp.
 *
 * The closing stage is deliberately the NEUTRAL one. Painting every closing row
 * red would leave a window thirty days out shouting as loudly as one shutting on
 * Friday, and once everything is urgent the reader stops reading the colour.
 * Urgency lives on the right of the row, where it is earned by the date.
 */
const STAGE_STYLE: Record<RecruitmentStage, { icon: string; color: string; bg: string }> = {
  closing: { icon: "mdi:timer-sand", color: "#4a5563", bg: "#eef1f5" },
  "hall-ticket": { icon: "mdi:card-account-details-outline", color: "#0f6b7a", bg: "#e6f1f2" },
  exam: { icon: "mdi:file-document-edit-outline", color: "#12365f", bg: "#eef3fa" },
  result: { icon: "mdi:clipboard-check-outline", color: "#8a5a12", bg: "#fdf3e2" },
  mock: { icon: "mdi:clipboard-text-clock-outline", color: "#0b6232", bg: "#dff0e6" },
};

/** "closes in 3 days" for a window, plain "in 3 days" for a sitting. */
function urgencyTextOf(entry: RecruitmentCalendarEntry, days: number): string {
  const relative = relativeDayLabel(days);
  return entry.stage === "closing" ? `closes ${relative}` : relative;
}

/**
 * One dated line. A calendar row is a row: a date, what it is, and how far off.
 *
 * Two lines beside the rail: the title carries the recruitment and the second
 * line carries the stage and the recruiting body, which is the least a candidate
 * can act on and the most the column has room for at that width. On a phone the
 * same three pieces stack instead of competing, because a truncated stage label
 * is worth nothing.
 */
function CalendarRow({
  entry,
  href,
  first,
}: {
  entry: RecruitmentCalendarEntry;
  href: string | null;
  first: boolean;
}) {
  const { push, prefetch } = useInstantNavigation();
  const stage = STAGE_STYLE[entry.stage] ?? STAGE_STYLE.exam;
  const days = daysFromToday(entry.date);
  const urgent = entry.stage === "closing" && days != null && days <= CLOSING_SOON_DAYS;

  /**
   * The urgency, rendered in one of two places.
   *
   * Beside the row from `sm` up, where there is width for a column of it, and
   * stacked under the row on a phone, where holding it out to the right left the
   * title, the stage and the recruiting body all fighting over 180px and every
   * one of them cut off. A stage chip reading "Application windo..." has told the
   * reader nothing.
   */
  const urgencyNode = days == null ? null : (
    <Stack direction="row" spacing={0.25} alignItems="center" sx={{ flexShrink: 0 }}>
      {urgent && <Icon icon="mdi:alert-circle-outline" width={13} color="#8f1919" style={{ flexShrink: 0 }} />}
      <Typography noWrap sx={{ fontSize: "0.71rem", fontWeight: 800, color: urgent ? "#8f1919" : "#4a5563" }}>
        {urgencyTextOf(entry, days)}
      </Typography>
    </Stack>
  );

  const body = (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems={{ xs: "flex-start", sm: "center" }}
      sx={{ width: "100%", minWidth: 0, py: 1.05, borderTop: first ? "none" : ROW_RULE }}
    >
      {/* The calendar block. No month on it: the rows are grouped under one. */}
      <Box sx={{ width: 34, flexShrink: 0, textAlign: "center" }}>
        <Typography sx={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.08em", color: "#6b7684", textTransform: "uppercase", lineHeight: 1.2 }}>
          {entry.weekdayLabel}
        </Typography>
        <Typography sx={{ fontSize: "1.02rem", fontWeight: 900, color: "#111a26", lineHeight: 1.15 }}>
          {entry.dayLabel}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          title={entry.title}
          sx={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#111a26",
            lineHeight: 1.4,
            // Wraps to two lines on a phone, where there is nowhere for the rest
            // of the title to go; one clipped line in the column, where the row
            // opens the posting anyway.
            display: { xs: "-webkit-box", sm: "block" },
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            whiteSpace: { xs: "normal", sm: "nowrap" },
            textOverflow: "ellipsis",
          }}
        >
          {entry.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 0.35, sm: 0.6 },
            minWidth: 0,
            mt: 0.25,
          }}
        >
          <GovChip icon={stage.icon} label={entry.stageLabel} color={stage.color} bg={stage.bg} />
          <Typography noWrap sx={{ fontSize: "0.7rem", color: "#4a5563", minWidth: 0, maxWidth: "100%" }}>
            {entry.projected ? `${entry.body} · date not yet fixed` : entry.body}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" }, mt: 0.4 }}>{urgencyNode}</Box>
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" }, flexShrink: 0 }}>{urgencyNode}</Box>
    </Stack>
  );

  if (!href) return <Box sx={{ minWidth: 0 }}>{body}</Box>;

  return (
    <ButtonBase
      onMouseEnter={() => prefetch(href)}
      onFocus={() => prefetch(href)}
      onClick={() => push(href)}
      aria-label={`${entry.stageLabel}, ${entry.title}, ${entry.dateLabel}`}
      sx={{
        width: "100%",
        minWidth: 0,
        display: "block",
        textAlign: "left",
        borderRadius: 2,
        px: 0.5,
        mx: -0.5,
        "&:hover": { bgcolor: "#f6f8fb" },
        "&.Mui-focusVisible": { boxShadow: "var(--ring-focus)" },
      }}
    >
      {body}
    </ButtonBase>
  );
}

export function RecruitmentCalendarPanel() {
  const jobsEnabled = useIsJobsEnabled();
  const assessmentEnabled = useIsAssessmentEnabled();
  const [showAll, setShowAll] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: CALENDAR_QUERY_KEY,
    queryFn: () => dashboardService.getRecruitmentCalendar(),
  });

  if (isPending) {
    return (
      <GovPanelSkeleton
        icon="mdi:calendar-month-outline"
        title="Recruitment calendar"
        subtitle="What is open, and what you sit next"
        rows={5}
      />
    );
  }

  // Nothing to say, so nothing is said. A heading standing over an empty list
  // reads as a broken platform; an absent panel reads as a quiet month.
  if (!data || data.months.length === 0) return null;

  /** A row only navigates where the destination module is switched on. */
  const hrefFor = (entry: RecruitmentCalendarEntry): string | null => {
    if (!entry.href) return null;
    if (entry.href.startsWith("/jobs-v2/")) return jobsEnabled ? entry.href : null;
    if (entry.href.startsWith("/assessments/")) return assessmentEnabled ? entry.href : null;
    return entry.href;
  };

  const total = data.months.reduce((sum, month) => sum + month.entries.length, 0);
  const limit = showAll ? total : DEFAULT_VISIBLE;

  // Trim across the grouped months rather than inside one, so a month whose
  // every row falls past the cut drops its heading with them instead of standing
  // over nothing. Folded rather than counted with a mutable cursor: the react
  // compiler's immutability rule rejects reassigning a captured local inside a
  // map callback, and it is right to, because the callback outlives the render.
  const trimmed = data.months.reduce<{ months: RecruitmentCalendarMonth[]; shown: number }>(
    (acc, month) => {
      const entries = month.entries.slice(0, Math.max(0, limit - acc.shown));
      if (entries.length === 0) return acc;
      return { months: [...acc.months, { ...month, entries }], shown: acc.shown + entries.length };
    },
    { months: [], shown: 0 },
  );
  const months = trimmed.months;
  const hidden = total - trimmed.shown;

  const summary =
    data.closingSoonCount > 0
      ? { label: `${data.closingSoonCount} closing this week`, color: "#8f1919", bg: "#fbeaea", icon: "mdi:alert-circle-outline" }
      : { label: `${data.openCount} windows open`, color: "#12365f", bg: "#eef3fa", icon: "mdi:folder-open-outline" };

  return (
    <PanelCard>
      <SectionHeader
        icon="mdi:calendar-month-outline"
        title="Recruitment calendar"
        subtitle="What is open, and what you sit next"
        action={data.openCount > 0 ? <GovChip {...summary} /> : undefined}
      />
      <GovNote>{ILLUSTRATIVE_NOTE}</GovNote>

      {months.map((month, monthIndex) => (
        <Box key={month.key} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: monthIndex === 0 ? 0 : 1.5, mb: 0.25 }}>
            <Typography
              sx={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7684", flexShrink: 0 }}
            >
              {month.label}
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#dde3eb" }} />
          </Stack>
          {month.entries.map((entry, index) => (
            <CalendarRow key={entry.id} entry={entry} href={hrefFor(entry)} first={index === 0} />
          ))}
        </Box>
      ))}

      {(hidden > 0 || showAll) && (
        <ButtonBase
          onClick={() => setShowAll((open) => !open)}
          aria-expanded={showAll}
          sx={{
            mt: 1.25,
            width: "100%",
            justifyContent: "center",
            gap: 0.4,
            py: 0.75,
            borderRadius: 2,
            border: "1px solid #dde3eb",
            fontSize: "0.74rem",
            fontWeight: 800,
            color: "#12365f",
            "&:hover": { bgcolor: "#eef3fa", borderColor: "#b6cde8" },
            "&.Mui-focusVisible": { boxShadow: "var(--ring-focus)" },
          }}
        >
          {showAll ? "Show fewer dates" : `Show ${hidden} more ${hidden === 1 ? "date" : "dates"}`}
          <Icon icon={showAll ? "mdi:chevron-up" : "mdi:chevron-down"} width={16} />
        </ButtonBase>
      )}
    </PanelCard>
  );
}
