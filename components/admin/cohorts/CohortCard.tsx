"use client";

import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import type { CohortListItem, CohortStatus } from "@/lib/services/admin/admin-cohorts.service";

const STATUS: Record<CohortStatus, { label: string; color: string; bar: string }> = {
  draft: { label: "Draft", color: "var(--warning-500, #b7791f)", bar: "linear-gradient(90deg, #b7791f, #c9903a)" },
  scheduled: { label: "Scheduled", color: "var(--accent-indigo, #1b4f8a)", bar: "linear-gradient(90deg, var(--accent-indigo, #1b4f8a), var(--ai-violet, #14406f))" },
  active: { label: "Active", color: "var(--success-500, #0e7a3c)", bar: "var(--gradient-ai)" },
  completed: { label: "Completed", color: "var(--tone-proctored, #0f6b7a)", bar: "linear-gradient(90deg, #0f6b7a, #1b4f8a)" },
  archived: { label: "Archived", color: "var(--font-tertiary, #6b7280)", bar: "linear-gradient(90deg, #9ca3af, #6b7280)" },
};

function MiniStat({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <Box sx={{ flex: 1, px: 1.5, py: 1.25, textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
        <Icon icon={icon} width={14} style={{ color: "var(--ai-violet, #14406f)" }} />
        <Typography sx={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1rem", color: "var(--font-primary)" }}>
          {value}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "0.68rem", color: "var(--font-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", mt: 0.25 }}>
        {label}
      </Typography>
    </Box>
  );
}

export function CohortCard({
  cohort,
  onOpen,
  onArchive,
  onDelete,
}: {
  cohort: CohortListItem;
  onOpen: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const s = STATUS[cohort.status];
  return (
    <Box
      onClick={onOpen}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: "var(--card-bg)",
        border: "1px solid color-mix(in srgb, var(--border-default) 55%, transparent)",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 180ms ease, transform 180ms ease",
        "&:hover": {
          boxShadow: "var(--shadow-md)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box sx={{ height: 5, background: s.bar }} />
      <Box sx={{ p: 2.25, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
          <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: s.color }} />
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: s.color }}>
            {s.label}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {cohort.code && (
            <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--font-tertiary)" }}>
              {cohort.code}
            </Typography>
          )}
          <Box onClick={(e) => e.stopPropagation()}>
            {/* Archive and delete are DIFFERENT things and must not share one button: archive keeps
                the cohort (it moves to the Archived tab and can be brought back), delete removes it
                from the working set entirely. */}
            <IconButton size="small" onClick={onArchive} aria-label="Archive cohort" title="Archive — keeps it, moves it to the Archived tab" sx={{ color: "var(--font-tertiary)", "&:hover": { color: "#1b4f8a" } }}>
              <Icon icon="mdi:archive-outline" width={17} />
            </IconButton>
            <IconButton size="small" onClick={onDelete} aria-label="Delete cohort" title="Delete — removes it from the working set" sx={{ color: "var(--font-tertiary)", "&:hover": { color: "var(--error-500, #b32020)" } }}>
              <Icon icon="mdi:trash-can-outline" width={17} />
            </IconButton>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.15rem", lineHeight: 1.25, color: "var(--font-primary)" }}>
          {cohort.name}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            mt: 2,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid color-mix(in srgb, var(--border-default) 55%, transparent)",
            "& > *:not(:last-child)": { borderRight: "1px solid color-mix(in srgb, var(--border-default) 55%, transparent)" },
          }}
        >
          <MiniStat icon="mdi:account-multiple" value={cohort.member_count} label="Members" />
          <MiniStat icon="mdi:cube-outline" value={cohort.artifact_count} label="Assignments" />
          <MiniStat
            icon="mdi:calendar-range"
            value={cohort.start_date ? cohort.start_date.slice(5) : "-"}
            label="Starts"
          />
        </Box>

        <ButtonBase
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          sx={{
            mt: 1.75,
            py: 1,
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "0.88rem",
            color: "var(--ai-violet, #14406f)",
            border: "1px solid color-mix(in srgb, var(--ai-violet, #14406f) 30%, transparent)",
            "&:hover": { bgcolor: "color-mix(in srgb, var(--ai-violet, #14406f) 8%, transparent)" },
          }}
        >
          Open
        </ButtonBase>
      </Box>
    </Box>
  );
}
