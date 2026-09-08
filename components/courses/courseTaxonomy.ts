/**
 * Catalogue taxonomy: how a flat list of courses becomes two sections, each split
 * into categories.
 *
 * WHY THIS LIVES IN `components/` AND NOT `lib/demo/db/courses.ts`
 *
 * `lib/demo/db/courses.ts` owns the taxonomy as *data*: which slugs exist, and
 * which slug each course carries. The server (here, the demo transport) sends
 * that down on every list item as `section` / `section_title` / `category` /
 * `category_title`. What it does NOT send is presentation: the blurb under a
 * heading, the icon on the badge, the accent on the rule. Those are UI
 * decisions, so they belong to the UI.
 *
 * Keeping them here also means these components never import from `lib/demo/`.
 * The same files render against the real backend in the production repo this was
 * forked from, and that backend has no taxonomy at all yet. Everything below is
 * therefore written to degrade: an unknown slug still gets a heading (built from
 * the title the server sent, or from the slug itself), and a course with no slug
 * at all still gets rendered, in an "Other courses" group at the end. A course
 * must never vanish because nobody has filed it yet.
 *
 * The four slugs, the titles, the icons, the accents and the blurbs below are
 * copied verbatim from `COURSE_SECTIONS` / `COURSE_CATEGORIES` in
 * `lib/demo/db/courses.ts`, which in turn follows
 * `docs/GOVERNMENT-BUILD-BRIEF.md`. They are duplicated rather than imported
 * only because of the boundary above. Edit one, edit the other, or the heading
 * on screen stops matching the data file it describes.
 */

import type { AdaptiveCourseListItem } from "@/lib/services/adaptive-course.service";

/** Everything needed to draw a section heading. */
export interface CourseSectionPresentation {
  slug: string;
  title: string;
  blurb: string;
  /** Iconify name, bundled locally by `npm run build:icons`. */
  icon: string;
  /** Hex. Drives the section rule, the icon badge and the chips beneath it. */
  accent: string;
}

/** Everything needed to draw a category sub-heading, and a chip for it. */
export interface CourseCategoryPresentation {
  slug: string;
  title: string;
  /** Shortened title for the card chip, where the full one would wrap twice. */
  chipTitle: string;
  blurb: string;
  icon: string;
  /** Slug of the owning section. Used to resolve an accent for unknown sections. */
  section: string;
}

/** Sentinel for "no category filter applied". */
export const ALL_CATEGORIES = "all";

/** Bucket slugs for courses the server has not filed. Prefixed so they can never
 *  collide with a real slug. */
export const UNFILED_SECTION = "__unfiled-section";
export const UNFILED_CATEGORY = "__unfiled-category";

/** Neutral accent for anything outside the two known sections. */
const NEUTRAL_ACCENT = "#64748b";

/**
 * The two sections, in the order they are shown. Government jobs lead because
 * that is what most aspirants arrive looking for; the skilling track follows.
 */
const SECTIONS: readonly CourseSectionPresentation[] = [
  {
    slug: "govt-jobs",
    title: "Government Job Related Courses",
    blurb:
      "Structured preparation for state, central, railway, police, public undertaking and " +
      "banking recruitment, from the notification to the interview board.",
    icon: "mdi:office-building-outline",
    accent: "#6366f1",
  },
  {
    slug: "skills-entrepreneurship",
    title: "Skill Development & Entrepreneurship",
    blurb:
      "Trade training and enterprise support delivered through district skill centres, built " +
      "around work that already exists in the mandal.",
    icon: "mdi:sprout-outline",
    accent: "#10b981",
  },
];

/** The four categories, in the order they are shown inside their section. */
const CATEGORIES: readonly CourseCategoryPresentation[] = [
  {
    slug: "state-central-psu",
    title: "State (Telangana), Central & PSU Jobs",
    chipTitle: "State, Central & PSU",
    blurb:
      "TGPSC, SSC, railway, police and public undertaking recruitment, taken syllabus by " +
      "syllabus rather than as one general studies course.",
    icon: "mdi:bank-outline",
    section: "govt-jobs",
  },
  {
    slug: "banking",
    title: "Banking & Financial Sector Jobs",
    chipTitle: "Banking & finance",
    blurb:
      "IBPS, SBI, RBI and NABARD preparation, with the awareness paper treated as a subject " +
      "in its own right instead of a monthly digest.",
    icon: "mdi:cash-multiple",
    section: "govt-jobs",
  },
  {
    slug: "rural-employment-vocational",
    title: "Rural Employment Generation",
    chipTitle: "Vocational trade",
    blurb:
      "Vocational trades chosen because a trained hand is hired for them inside the district, " +
      "taught to the standard a site or a service counter holds you to.",
    icon: "mdi:hammer-wrench",
    section: "skills-entrepreneurship",
  },
  {
    slug: "rural-entrepreneurship",
    title: "Rural Entrepreneurship & Development",
    chipTitle: "Entrepreneurship",
    blurb:
      "Starting, financing and running an enterprise that a village economy can actually " +
      "support, including the credit and compliance that decide whether it survives.",
    icon: "mdi:store-outline",
    section: "skills-entrepreneurship",
  },
];

/** A slug that is present and non-blank, else undefined. */
function slugOf(value: string | null | undefined): string | undefined {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** "rural-employment" becomes "Rural employment". Last-resort label for a slug
 *  the server sent without a title. */
function humanise(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.length === 0 ? "" : words.charAt(0).toUpperCase() + words.slice(1);
}

/** Accent for a section slug, falling back through the category's own section. */
function accentFor(sectionSlug: string): string {
  return SECTIONS.find((s) => s.slug === sectionSlug)?.accent ?? NEUTRAL_ACCENT;
}

/** Presentation for a section slug. Unknown slugs get the neutral treatment and
 *  whatever title the server sent. */
function sectionPresentation(
  slug: string | undefined,
  serverTitle: string | undefined,
): CourseSectionPresentation {
  if (!slug) {
    return {
      slug: UNFILED_SECTION,
      title: "Other courses",
      blurb: "Courses that have not been filed under a section yet.",
      icon: "mdi:shape-outline",
      accent: NEUTRAL_ACCENT,
    };
  }
  const known = SECTIONS.find((s) => s.slug === slug);
  if (known) return known;
  return {
    slug,
    title: slugOf(serverTitle) ?? humanise(slug),
    blurb: "",
    icon: "mdi:shape-outline",
    accent: NEUTRAL_ACCENT,
  };
}

/** Presentation for a category slug within a known or unknown section. */
function categoryPresentation(
  slug: string | undefined,
  serverTitle: string | undefined,
  sectionSlug: string,
): CourseCategoryPresentation {
  if (!slug) {
    return {
      slug: UNFILED_CATEGORY,
      title: "Other courses",
      chipTitle: "Other",
      blurb: "Courses in this section that have not been filed under a category yet.",
      icon: "mdi:shape-outline",
      section: sectionSlug,
    };
  }
  const known = CATEGORIES.find((c) => c.slug === slug);
  if (known) return known;
  const title = slugOf(serverTitle) ?? humanise(slug);
  return {
    slug,
    title,
    chipTitle: title,
    blurb: "",
    icon: "mdi:shape-outline",
    section: sectionSlug,
  };
}

/** One category, with the courses filed under it. */
export interface CourseGroupCategory extends CourseCategoryPresentation {
  /** `section::category`. The category slug alone is not unique across the page,
   *  because two sections can each carry an unfiled bucket. */
  key: string;
  accent: string;
  /** True when this bucket was synthesised for courses the server did not file. */
  fallback: boolean;
  courses: AdaptiveCourseListItem[];
}

/** One section, with its categories. */
export interface CourseGroupSection extends CourseSectionPresentation {
  /** True when this bucket was synthesised for courses with no section. */
  fallback: boolean;
  categories: CourseGroupCategory[];
  courseCount: number;
}

/** Known slugs sort first in brief order; unknown ones follow in the order the
 *  server sent them; the unfiled bucket always sorts last. */
const UNKNOWN_RANK_BASE = 1_000;
const LAST_RANK = Number.MAX_SAFE_INTEGER;

interface Ranked<T> {
  rank: number;
  value: T;
}

/**
 * Group a flat course list into sections and categories.
 *
 * Order within a category is the order the caller passed in, so a page that has
 * already sorted or filtered keeps its ordering inside every group. Empty groups
 * are impossible by construction: a category exists only because a course landed
 * in it, which is exactly the "empty categories disappear" rule the catalogue
 * needs when a search narrows the list.
 */
export function groupCourses(items: readonly AdaptiveCourseListItem[]): CourseGroupSection[] {
  const sections = new Map<string, Ranked<CourseGroupSection>>();

  for (const course of items) {
    const rawSection = slugOf(course.section);
    const sectionSlug = rawSection ?? UNFILED_SECTION;

    let section = sections.get(sectionSlug);
    if (!section) {
      const presentation = sectionPresentation(rawSection, course.section_title);
      const knownIndex = SECTIONS.findIndex((s) => s.slug === sectionSlug);
      section = {
        rank: !rawSection
          ? LAST_RANK
          : knownIndex >= 0
            ? knownIndex
            : UNKNOWN_RANK_BASE + sections.size,
        value: { ...presentation, fallback: !rawSection, categories: [], courseCount: 0 },
      };
      sections.set(sectionSlug, section);
    }

    const rawCategory = slugOf(course.category);
    const categorySlug = rawCategory ?? UNFILED_CATEGORY;
    const key = `${sectionSlug}::${categorySlug}`;

    let category = section.value.categories.find((c) => c.key === key);
    if (!category) {
      const presentation = categoryPresentation(rawCategory, course.category_title, sectionSlug);
      category = {
        ...presentation,
        key,
        accent: accentFor(rawSection ?? presentation.section),
        fallback: !rawCategory,
        courses: [],
      };
      section.value.categories.push(category);
    }

    category.courses.push(course);
    section.value.courseCount += 1;
  }

  // Sort categories inside each section, then the sections themselves.
  for (const [sectionSlug, section] of sections) {
    const orderOf = (category: CourseGroupCategory, index: number): number => {
      if (category.fallback) return LAST_RANK;
      const known = CATEGORIES.filter((c) => c.section === sectionSlug).findIndex(
        (c) => c.slug === category.slug,
      );
      return known >= 0 ? known : UNKNOWN_RANK_BASE + index;
    };
    const ranked = section.value.categories.map((c, i) => ({ rank: orderOf(c, i), value: c }));
    ranked.sort((a, b) => a.rank - b.rank);
    section.value.categories = ranked.map((r) => r.value);
  }

  return Array.from(sections.values())
    .sort((a, b) => a.rank - b.rank)
    .map((s) => s.value);
}

/** One entry in the category filter row. */
export interface CourseCategoryChipDef {
  /** Matches `CourseGroupCategory.key`, or `ALL_CATEGORIES` for the leading chip. */
  key: string;
  label: string;
  icon: string;
  accent: string;
  count: number;
}

/**
 * The filter row's chips, flattened out of the grouping.
 *
 * Built from the UNFILTERED list on purpose. Deriving counts from the search
 * results instead would make the whole row reflow on every keystroke, and a
 * count would then answer "how many match right now" rather than the question
 * the aspirant is actually asking, which is how big each category is.
 */
export function categoryChips(sections: readonly CourseGroupSection[]): CourseCategoryChipDef[] {
  const total = sections.reduce((sum, s) => sum + s.courseCount, 0);
  const chips: CourseCategoryChipDef[] = [
    {
      key: ALL_CATEGORIES,
      label: "All courses",
      icon: "mdi:view-grid-outline",
      accent: "#6366f1",
      count: total,
    },
  ];
  const owners: string[] = [ALL_CATEGORIES];
  for (const section of sections) {
    for (const category of section.categories) {
      chips.push({
        key: category.key,
        label: category.chipTitle,
        icon: category.icon,
        accent: category.accent,
        count: category.courses.length,
      });
      owners.push(section.title);
    }
  }

  // Two sections can each carry an unfiled bucket, and both would read "Other".
  // The keys stay distinct either way, but two identical chips are unreadable, so
  // name the section on the ones that actually collide and leave the rest short.
  const counts = new Map<string, number>();
  for (const chip of chips) counts.set(chip.label, (counts.get(chip.label) ?? 0) + 1);
  return chips.map((chip, i) =>
    (counts.get(chip.label) ?? 0) > 1 ? { ...chip, label: `${chip.label}: ${owners[i]}` } : chip,
  );
}

/**
 * Narrow a grouping to a single category. A section left with no categories
 * disappears, so the page never renders a heading over an empty grid.
 */
export function filterGroupsByCategory(
  sections: readonly CourseGroupSection[],
  categoryKey: string,
): CourseGroupSection[] {
  if (categoryKey === ALL_CATEGORIES) return [...sections];
  return sections
    .map((section) => {
      const categories = section.categories.filter((c) => c.key === categoryKey);
      return {
        ...section,
        categories,
        courseCount: categories.reduce((sum, c) => sum + c.courses.length, 0),
      };
    })
    .filter((section) => section.categories.length > 0);
}

/** Total courses across a grouping, for empty-state checks. */
export function countCourses(sections: readonly CourseGroupSection[]): number {
  return sections.reduce((sum, s) => sum + s.courseCount, 0);
}

/**
 * What a single card should say about itself, so a card lifted out of its group
 * (a search result, my courses, the dashboard) still declares what it is.
 * Returns null for a course the server has not filed, which is the signal to
 * render no chip at all rather than an "Other" one.
 */
export function courseCategoryChip(
  course: AdaptiveCourseListItem,
): { label: string; icon: string; accent: string } | null {
  const categorySlug = slugOf(course.category);
  const serverTitle = slugOf(course.category_title);
  if (!categorySlug && !serverTitle) return null;

  const known = categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) : undefined;
  const sectionSlug = slugOf(course.section) ?? known?.section ?? "";
  return {
    label: known?.chipTitle ?? serverTitle ?? humanise(categorySlug ?? ""),
    icon: known?.icon ?? "mdi:shape-outline",
    accent: accentFor(sectionSlug),
  };
}
