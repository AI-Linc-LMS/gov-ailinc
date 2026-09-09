"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/dashboard.service";
import type { MissionNotice, MissionNoticeCategory } from "@/lib/types/dashboard";
import { PanelCard, SectionHeader } from "./parts";
import {
  CLOSING_SOON_DAYS,
  GovChip,
  GovPanelSkeleton,
  ROW_RULE,
  daysFromToday,
} from "./govParts";

/**
 * The circulars a state mission actually issues, on the notice board an
 * aspirant would otherwise have to walk to the centre to read: a batch opening,
 * a verification camp, a scheme window, a holiday, a revised timetable, and
 * certificates waiting to be collected.
 *
 * Each carries an issue date and a reference in the shape a mission files them
 * in, because that is how a circular is identified when somebody rings the
 * centre about it. Nothing here quotes a rate, a fee or an amount of
 * assistance: those are fixed by a sanctioning order, and a figure invented for
 * a preview would be read as the scale of the scheme.
 *
 * The rows are not clickable. There is no circular document behind them, and a
 * row that looks like a link and does nothing is worse than a row that does not
 * look like one.
 */

const NOTICES_QUERY_KEY = ["gov-mission-notices"] as const;

const CATEGORY_STYLE: Record<MissionNoticeCategory, { icon: string; color: string; bg: string }> = {
  admissions: { icon: "mdi:account-multiple-plus-outline", color: "#12365f", bg: "#eef3fa" },
  verification: { icon: "mdi:file-check-outline", color: "#0f6b7a", bg: "#e6f1f2" },
  scheme: { icon: "mdi:cash-multiple", color: "#0b6232", bg: "#dff0e6" },
  holiday: { icon: "mdi:calendar-blank-outline", color: "#4a5563", bg: "#eef1f5" },
  timetable: { icon: "mdi:calendar-clock-outline", color: "#12365f", bg: "#eef3fa" },
  certificate: { icon: "mdi:certificate-outline", color: "#8a5a12", bg: "#fdf3e2" },
};

const FALLBACK_STYLE = { icon: "mdi:file-document-outline", color: "#4a5563", bg: "#eef1f5" };

function NoticeRow({ notice, first }: { notice: MissionNotice; first: boolean }) {
  const style = CATEGORY_STYLE[notice.category] ?? FALLBACK_STYLE;
  const actionDays = daysFromToday(notice.actionAt);
  // A date inside the week is the one a trainee misses. It is flagged in words
  // on the pill itself ("Report by 14 Sep"), with the tint as the second signal.
  const actionSoon = actionDays != null && actionDays <= CLOSING_SOON_DAYS;

  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="flex-start"
      sx={{ py: 1.15, borderTop: first ? "none" : ROW_RULE, minWidth: 0 }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          color: style.color,
          bgcolor: style.bg,
          mt: 0.15,
        }}
      >
        <Icon icon={style.icon} width={17} />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#111a26", lineHeight: 1.35 }}>
          {notice.title}
        </Typography>
        {/* Two lines. The summaries in the seed are written to that length rather
            than clamped to it, so a circular never breaks off mid-sentence with
            an ellipsis where an officer expects the operative condition. */}
        <Typography
          sx={{
            mt: 0.25,
            fontSize: "0.735rem",
            lineHeight: 1.5,
            color: "#4a5563",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notice.summary}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap" sx={{ mt: 0.55, rowGap: 0.4 }}>
          <Box
            component="span"
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              fontWeight: 600,
              color: "#333d4b",
              bgcolor: "#eef1f5",
              border: "1px solid #dde3eb",
              borderRadius: 1,
              px: 0.6,
              py: 0.15,
            }}
          >
            {notice.reference}
          </Box>
          <Typography sx={{ fontSize: "0.68rem", color: "#6b7684" }}>
            Issued {notice.issuedLabel}
            {notice.centre ? ` · ${notice.centre}` : ""}
          </Typography>
          {notice.actionLabel && (
            <GovChip
              icon={actionSoon ? "mdi:alert-circle-outline" : "mdi:calendar-check-outline"}
              label={notice.actionLabel}
              color={actionSoon ? "#8f1919" : "#12365f"}
              bg={actionSoon ? "#fbeaea" : "#eef3fa"}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

export function MissionNoticesPanel() {
  const { data, isPending } = useQuery({
    queryKey: NOTICES_QUERY_KEY,
    queryFn: () => dashboardService.getMissionNotices(),
  });

  if (isPending) {
    return (
      <GovPanelSkeleton
        icon="mdi:file-document-multiple-outline"
        title="Mission notices"
        subtitle="Circulars issued to the centres"
        rows={3}
      />
    );
  }

  // No circulars in force means no notice board, not an empty notice board.
  if (!data || data.length === 0) return null;

  return (
    <PanelCard>
      <SectionHeader
        icon="mdi:file-document-multiple-outline"
        title="Mission notices"
        subtitle="Circulars issued to the centres"
      />
      {data.map((notice, index) => (
        <NoticeRow key={notice.id} notice={notice} first={index === 0} />
      ))}
    </PanelCard>
  );
}
