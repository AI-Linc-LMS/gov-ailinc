"use client";

import { Box } from "@mui/material";
import { Icon } from "@iconify/react";
import type { AdaptiveCourseListItem } from "@/lib/services/adaptive-course.service";
import { courseCategoryChip } from "./courseTaxonomy";

/**
 * The category a course belongs to, as a small tinted pill on the card.
 *
 * A card is only sitting under its category heading on the catalogue. Everywhere
 * else it gets lifted out of the grouping: a search result, the My courses list,
 * the dashboard rail. This pill is what keeps "TGPSC Group-II" and "Solar PV
 * Installer" telling apart in those places.
 *
 * Renders nothing when the server has not filed the course, which is the case
 * against the production backend this fork shares its components with. A card
 * with no chip is the correct outcome there, not a placeholder one.
 */
export function CourseCategoryChip({ course }: { course: AdaptiveCourseListItem }) {
  const chip = courseCategoryChip(course);
  if (!chip) return null;

  return (
    <Box
      component="span"
      // The card meta row wraps, so the pill shrinks before it pushes the price
      // tag off the card; a long unknown-category title ellipsises rather than
      // stretching the row.
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.45,
        minWidth: 0,
        maxWidth: "100%",
        px: 0.9,
        py: 0.3,
        borderRadius: 999,
        fontSize: "0.65rem",
        fontWeight: 800,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        lineHeight: 1.5,
        color: chip.accent,
        bgcolor: `color-mix(in srgb, ${chip.accent} 13%, transparent)`,
        border: `1px solid color-mix(in srgb, ${chip.accent} 26%, transparent)`,
      }}
    >
      <Icon icon={chip.icon} width={13} style={{ flexShrink: 0 }} />
      <Box
        component="span"
        sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {chip.label}
      </Box>
    </Box>
  );
}
