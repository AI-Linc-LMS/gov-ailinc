"use client";

import type { ReactNode } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { Reveal } from "@/components/scorecard/shared";
import type { AdaptiveCourseListItem } from "@/lib/services/adaptive-course.service";
import {
  ALL_CATEGORIES,
  type CourseCategoryChipDef,
  type CourseGroupCategory,
  type CourseGroupSection,
} from "./courseTaxonomy";

/**
 * The grouped catalogue: section heading, category sub-heading, grid, repeat.
 *
 * This is the shape the mission asked for by name. A flat grid of nineteen cards
 * makes an aspirant preparing for a bank exam scroll past solar installation to
 * find it; the two sections and their categories are how the department already
 * describes its own programmes, so the catalogue reads the way the prospectus
 * does.
 *
 * The scaffolding is shared by the catalogue and by My courses. The body of each
 * category is left to the caller (`renderCourses`) because those two pages draw
 * a card grid and, on My courses, optionally a compact row list.
 */

/** Section headings are h2, category headings h3. Ids let each region be labelled. */
function headingId(prefix: string, key: string): string {
  return `course-group-${prefix}-${key.replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
}

function courseCountLabel(count: number): string {
  return `${count} ${count === 1 ? "course" : "courses"}`;
}

/**
 * The 1 / 2 / 3 column card grid.
 *
 * `minmax(0, 1fr)` plus `min-width: 0` on every child is not belt-and-braces, it
 * is the fix for the grid overflow trap: a grid item defaults to
 * `min-width: auto`, so one long unbroken word inside a card widens its column
 * past the viewport and the whole page scrolls sideways on a phone.
 */
export function CourseCardGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
        alignItems: "stretch",
        "& > *": { minWidth: 0 },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * The category filter row.
 *
 * Selecting a chip filters the grouping down to that one category rather than
 * scrolling to it: with a search box directly underneath, a page that jumped the
 * viewport on every chip press and then re-jumped on every keystroke would be
 * unusable. Chips are real buttons, so they are tab reachable and carry a
 * visible focus ring, and they are 44px tall for a thumb.
 */
export function CourseCategoryFilterRow({
  chips,
  value,
  onChange,
}: {
  chips: CourseCategoryChipDef[];
  /** A `CourseGroupCategory.key`, or `ALL_CATEGORIES`. */
  value: string;
  onChange: (value: string) => void;
}) {
  if (chips.length <= 2) return null; // "All" plus a single category filters nothing.

  return (
    <Box
      role="group"
      aria-label="Filter courses by category"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 2,
        maxWidth: "100%",
      }}
    >
      {chips.map((chip) => {
        const active = chip.key === value;
        const accent = chip.key === ALL_CATEGORIES ? "#1b4f8a" : chip.accent;
        return (
          <ButtonBase
            key={chip.key}
            onClick={() => onChange(chip.key)}
            aria-pressed={active}
            sx={{
              minHeight: 44,
              minWidth: 0,
              maxWidth: "100%",
              px: 1.75,
              py: 0.75,
              gap: 0.75,
              borderRadius: 999,
              fontWeight: 800,
              fontSize: "0.82rem",
              textAlign: "left",
              color: active ? "#fff" : "var(--font-secondary)",
              bgcolor: active ? accent : "var(--card-bg)",
              border: active
                ? `1px solid ${accent}`
                : "1px solid color-mix(in srgb, var(--border-default) 90%, transparent)",
              boxShadow: active
                ? "var(--shadow-sm)"
                : "var(--shadow-xs)",
              transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease",
              "&:hover": active
                ? {}
                : {
                    bgcolor: `color-mix(in srgb, ${accent} 9%, var(--card-bg) 91%)`,
                    borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                    color: accent,
                  },
              // A chip the keyboard has reached must be obvious, not merely tinted.
              "&.Mui-focusVisible, &:focus-visible": {
                outline: `2px solid ${accent}`,
                outlineOffset: 2,
              },
            }}
          >
            <Icon
              icon={chip.icon}
              width={17}
              style={{ flexShrink: 0, color: active ? "#fff" : accent }}
            />
            <Box
              component="span"
              sx={{
                minWidth: 0,
                // A disambiguated fallback label ("Other: Government Job Related
                // Courses") must not stretch the row across the viewport.
                maxWidth: 240,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chip.label}
            </Box>
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                px: 0.7,
                borderRadius: 999,
                fontSize: "0.7rem",
                fontWeight: 800,
                color: active ? "#fff" : accent,
                bgcolor: active
                  ? "rgba(255,255,255,0.24)"
                  : `color-mix(in srgb, ${accent} 13%, transparent)`,
              }}
            >
              {chip.count}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** Section heading: icon badge, h2, blurb, count, and the accent rule under it. */
function SectionHeading({ section }: { section: CourseGroupSection }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
        <Box
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: `linear-gradient(135deg, ${section.accent}, color-mix(in srgb, ${section.accent} 55%, #0f172a))`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Icon icon={section.icon} width={23} />
        </Box>
        <Box sx={{ minWidth: 0, flex: "1 1 260px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              component="h2"
              id={headingId("section", section.slug)}
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.15rem", md: "1.35rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "var(--font-primary)",
                m: 0,
              }}
            >
              {section.title}
            </Typography>
            <Box
              component="span"
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: 999,
                fontSize: "0.7rem",
                fontWeight: 800,
                color: section.accent,
                bgcolor: `color-mix(in srgb, ${section.accent} 13%, transparent)`,
              }}
            >
              {courseCountLabel(section.courseCount)}
            </Box>
          </Box>
          {section.blurb && (
            <Typography
              sx={{
                mt: 0.6,
                color: "var(--font-secondary)",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                maxWidth: 760,
              }}
            >
              {section.blurb}
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        aria-hidden
        sx={{
          mt: 1.75,
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${section.accent} 0%, color-mix(in srgb, ${section.accent} 22%, transparent) 55%, transparent 100%)`,
        }}
      />
    </Box>
  );
}

/** Category sub-heading: small tinted icon, h3, count, blurb. */
function CategoryHeading({ category }: { category: CourseGroupCategory }) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.15, flexWrap: "wrap" }}>
        <Box
          aria-hidden
          sx={{
            width: 30,
            height: 30,
            borderRadius: 2,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: category.accent,
            bgcolor: `color-mix(in srgb, ${category.accent} 12%, transparent)`,
          }}
        >
          <Icon icon={category.icon} width={17} />
        </Box>
        <Typography
          component="h3"
          id={headingId("category", category.key)}
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.25,
            color: "var(--font-primary)",
            minWidth: 0,
            m: 0,
          }}
        >
          {category.title}
        </Typography>
        <Box
          component="span"
          sx={{
            px: 0.85,
            py: 0.15,
            borderRadius: 999,
            fontSize: "0.7rem",
            fontWeight: 800,
            color: "var(--font-secondary)",
            bgcolor: "color-mix(in srgb, var(--border-default) 55%, transparent)",
          }}
        >
          {category.courses.length}
        </Box>
      </Box>
      {category.blurb && (
        <Typography
          sx={{
            mt: 0.5,
            ml: { xs: 0, sm: 5.4 },
            color: "var(--font-tertiary)",
            fontSize: "0.83rem",
            lineHeight: 1.5,
            maxWidth: 720,
          }}
        >
          {category.blurb}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Render a grouping.
 *
 * A section whose categories are all empty never reaches here, because
 * `groupCourses` only creates a bucket a course landed in. The one heading that
 * IS suppressed is the synthesised "Other courses" category when it is alone
 * inside the synthesised "Other courses" section: that happens when the server
 * files nothing at all, and stacking the same words as an h2 and again as an h3
 * would read as a bug rather than as a fallback.
 */
export function CourseGroupedCatalogue({
  sections,
  renderCourses,
}: {
  sections: CourseGroupSection[];
  renderCourses: (courses: AdaptiveCourseListItem[]) => ReactNode;
}) {
  return (
    <Box>
      {sections.map((section) => (
        <Box
          key={section.slug}
          component="section"
          aria-labelledby={headingId("section", section.slug)}
          sx={{ mb: { xs: 4, md: 5.5 }, "&:last-of-type": { mb: 0 } }}
        >
          <Reveal>
            <SectionHeading section={section} />
          </Reveal>

          {section.categories.map((category) => {
            const suppressHeading =
              section.fallback && category.fallback && section.categories.length === 1;
            return (
              <Box
                key={category.key}
                component="section"
                // No heading to point at when the sub-heading is suppressed, and a
                // dangling aria-labelledby is worse than an unnamed region.
                aria-labelledby={suppressHeading ? undefined : headingId("category", category.key)}
                sx={{ mb: { xs: 3, md: 3.5 }, "&:last-of-type": { mb: 0 } }}
              >
                {!suppressHeading && (
                  <Reveal>
                    <CategoryHeading category={category} />
                  </Reveal>
                )}
                {renderCourses(category.courses)}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
