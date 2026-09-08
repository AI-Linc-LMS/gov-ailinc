"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  adaptiveCourseService,
  type AdaptiveCourseListItem,
} from "@/lib/services/adaptive-course.service";
import { useIsAdaptiveQuizEnabled } from "@/lib/contexts/ClientInfoContext";
import { PageShell } from "@/components/common/PageShell";
import { ModulePageHeader, HeaderActionButton } from "@/components/common/ModulePageHeader";
import { ViewToggle, SegmentedTabs, SearchFilterBar, type ListView } from "@/components/common/list";
import { Reveal } from "@/components/scorecard/shared";
import { AdaptiveCourseCard } from "@/components/courses/AdaptiveCourseCard";
import { AdaptiveCourseListSkeleton } from "@/components/courses/CourseSkeletons";
import { CourseCategoryChip } from "@/components/courses/CourseCategoryChip";
import {
  CourseCardGrid,
  CourseCategoryFilterRow,
  CourseGroupedCatalogue,
} from "@/components/courses/CourseGroups";
import {
  ALL_CATEGORIES,
  categoryChips,
  countCourses,
  filterGroupsByCategory,
  groupCourses,
} from "@/components/courses/courseTaxonomy";
import { useInstantNavigation } from "@/lib/hooks/useInstantNavigation";

export default function AdaptiveCourseListPage() {
  const { push, prefetch } = useInstantNavigation();
  const featureOn = useIsAdaptiveQuizEnabled();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdaptiveCourseListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [sort, setSort] = useState<"recent" | "title" | "content">("recent");
  const [viewMode, setViewMode] = useState<ListView>("cards");

  useEffect(() => {
    if (!featureOn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await adaptiveCourseService.listCourses();
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load courses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [featureOn]);

  // Difficulty facets are derived from whatever the catalog actually uses.
  const difficultyOptions = useMemo(() => {
    const s = new Set<string>();
    items.forEach((c) => (c.difficulty_levels || []).forEach((d) => d && s.add(d)));
    return Array.from(s);
  }, [items]);

  // Segmented tabs (assessment-style) with live counts, driven by the same data.
  const difficultyTabs = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((c) =>
      (c.difficulty_levels || []).forEach((d) => {
        if (d) counts[d] = (counts[d] || 0) + 1;
      })
    );
    return [
      { value: "all", label: "All levels", count: items.length },
      ...difficultyOptions.map((d) => ({ value: d, label: d, count: counts[d] || 0 })),
    ];
  }, [items, difficultyOptions]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((c) => {
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.target_audience || "").toLowerCase().includes(q) ||
        (c.category_title || "").toLowerCase().includes(q) ||
        (c.section_title || "").toLowerCase().includes(q);
      const matchesDifficulty =
        difficulty === "all" || (c.difficulty_levels || []).includes(difficulty);
      return matchesQuery && matchesDifficulty;
    });
    const contentScore = (c: AdaptiveCourseListItem) =>
      c.module_count + c.quiz_count + c.article_count + (c.coding_count ?? 0) + (c.video_count ?? 0);
    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "content") return contentScore(b) - contentScore(a);
      return (b.updated_at || "").localeCompare(a.updated_at || "");
    });
  }, [items, query, difficulty, sort]);

  /**
   * The same section/category grouping the catalogue uses, collapsed to what
   * this aspirant is actually enrolled in. Groups are built from the courses
   * present, so somebody enrolled in two categories sees two headings, and a
   * section they have joined nothing in never appears at all.
   *
   * Chips come from the full enrolled list rather than the filtered one, so the
   * row does not reflow while the search box is being typed into. The row hides
   * itself when there is only one category to choose from.
   */
  const chips = useMemo(() => categoryChips(groupCourses(items)), [items]);

  const groups = useMemo(
    () => filterGroupsByCategory(groupCourses(visible), category),
    [visible, category],
  );
  const shownCount = countCourses(groups);

  if (!featureOn) {
    return (
      <PageShell>
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {"Courses aren't enabled for this organisation."}
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            {'Ask your administrator to switch on the "Adaptive Quiz" feature.'}
          </Typography>
        </Container>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Title stays "Courses" to match the sidebar entry that leads here. */}
      <ModulePageHeader
        eyebrow="Learn"
        title="Courses"
        description="The courses you are enrolled in, grouped the way the catalogue is. Each one adapts to your level as you work: practice, immediate feedback, and a clear next step."
        accent="purple"
        icon="mdi:book-education-outline"
        action={
          <HeaderActionButton icon="mdi:compass-outline" onClick={() => push("/adaptive-courses/catalog")}>
            Browse courses
          </HeaderActionButton>
        }
      />

          {loading && <AdaptiveCourseListSkeleton />}

          {error && (
            <Typography sx={{ color: "#ef4444", fontWeight: 700, textAlign: "center", py: 4 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState onBrowse={() => push("/adaptive-courses/catalog")} />
          )}

          {!loading && !error && items.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {difficultyTabs.length > 1 && (
                <Box sx={{ mb: 2 }} data-tour-id="adaptive-levels">
                  <SegmentedTabs
                    tabs={difficultyTabs}
                    value={difficulty}
                    onChange={setDifficulty}
                  />
                </Box>
              )}
              <CourseCategoryFilterRow chips={chips} value={category} onChange={setCategory} />
              <Box data-tour-id="adaptive-search">
              <SearchFilterBar
                search={query}
                onSearchChange={setQuery}
                searchPlaceholder="Search your courses…"
                rightSlot={
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <TextField
                      select
                      size="small"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as "recent" | "title" | "content")}
                      label="Sort"
                      sx={{
                        width: { xs: "100%", sm: 190 },
                        "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "var(--surface)" },
                      }}
                    >
                      <MenuItem value="recent">Recently updated</MenuItem>
                      <MenuItem value="title">Title (A–Z)</MenuItem>
                      <MenuItem value="content">Most content</MenuItem>
                    </TextField>
                    <ViewToggle value={viewMode} onChange={setViewMode} />
                  </Stack>
                }
              />
              </Box>
            </Box>
          )}

          {!loading && !error && items.length > 0 && shownCount === 0 && (
            <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: "center", bgcolor: "color-mix(in srgb, var(--card-bg) 60%, transparent)", border: "1px dashed color-mix(in srgb, var(--border-default) 90%, transparent)" }}>
              <Icon icon="mdi:magnify-close" width={44} style={{ color: "#a855f7" }} />
              <Typography sx={{ fontWeight: 800, mt: 1.5, fontSize: "1.05rem" }}>No courses match your search.</Typography>
              <Chip
                label="Clear search & filters"
                onClick={() => {
                  setQuery("");
                  setDifficulty("all");
                  setCategory(ALL_CATEGORIES);
                }}
                sx={{ mt: 1.75, fontWeight: 700, cursor: "pointer" }}
              />
            </Box>
          )}

          {/* Both views share the grouping. A section heading that only applied to the
              card view would make the list view look like a different page. */}
          {!loading && shownCount > 0 && (
            <Box data-tour-id="adaptive-grid">
              <CourseGroupedCatalogue
                sections={groups}
                renderCourses={(courses) =>
                  viewMode === "cards" ? (
                    <CourseCardGrid>
                      {courses.map((course, idx) => (
                        <Reveal key={course.id} delay={Math.min(idx, 8) * 0.06}>
                          <AdaptiveCourseCard
                            course={course}
                            onOpen={() => push(`/adaptive-courses/${course.id}`)}
                            onHover={() => prefetch(`/adaptive-courses/${course.id}`)}
                          />
                        </Reveal>
                      ))}
                    </CourseCardGrid>
                  ) : (
                    <Stack spacing={1.25}>
                      {courses.map((course) => (
                        <AdaptiveCourseRow
                          key={course.id}
                          course={course}
                          onOpen={() => push(`/adaptive-courses/${course.id}`)}
                          onHover={() => prefetch(`/adaptive-courses/${course.id}`)}
                        />
                      ))}
                    </Stack>
                  )
                }
              />
            </Box>
          )}
    </PageShell>
  );
}

function AdaptiveCourseRow({
  course,
  onOpen,
  onHover,
}: {
  course: AdaptiveCourseListItem;
  onOpen: () => void;
  onHover: () => void;
}) {
  return (
    <Box
      onClick={onOpen}
      onMouseEnter={onHover}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: "var(--card-bg)",
        border: "1px solid var(--border-default)",
        transition: "all .15s",
        "&:hover": { borderColor: "#a855f7", boxShadow: "0 6px 16px -8px rgba(124,58,237,0.35)" },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          background: "linear-gradient(135deg,#6366f1,#a855f7)",
          color: "#fff",
        }}
      >
        <Icon icon="mdi:book-education-outline" width={22} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "0.98rem", minWidth: 0 }} noWrap>
            {course.title}
          </Typography>
          {/* The row carries the category too. On a narrow screen the metric
              columns are hidden, so this is the only thing telling one row from
              the next once the titles start to look alike. */}
          <Box sx={{ flexShrink: 0, display: { xs: "none", sm: "inline-flex" } }}>
            <CourseCategoryChip course={course} />
          </Box>
        </Box>
        <Typography sx={{ color: "var(--font-secondary)", fontSize: "0.82rem" }} noWrap>
          {course.description || course.target_audience || "Course"}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2.5} sx={{ flexShrink: 0, display: { xs: "none", md: "flex" } }}>
        {[
          { icon: "mdi:cube-outline", value: course.module_count, label: "modules" },
          { icon: "mdi:help-circle-outline", value: course.quiz_count, label: "quizzes" },
          { icon: "mdi:file-document-outline", value: course.article_count, label: "articles" },
        ].map((m) => (
          <Stack key={m.label} alignItems="center">
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--font-primary)" }}>
              {m.value}
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "var(--font-tertiary)" }}>{m.label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Icon icon="mdi:chevron-right" width={22} style={{ color: "var(--font-tertiary)", flexShrink: 0 }} />
    </Box>
  );
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        textAlign: "center",
        bgcolor: "color-mix(in srgb, var(--card-bg) 60%, transparent)",
        border: "1px dashed color-mix(in srgb, var(--border-default) 90%, transparent)",
      }}
    >
      <Icon icon="mdi:book-off-outline" width={48} style={{ color: "#a855f7" }} />
      <Typography sx={{ fontWeight: 800, mt: 1.5, fontSize: "1.1rem" }}>
        {"You're not enrolled in any course yet."}
      </Typography>
      <Typography sx={{ color: "text.secondary", mt: 0.75, maxWidth: 520, mx: "auto", lineHeight: 1.5 }}>
        {"Browse the courses the mission has opened for enrolment, across government job preparation and skill development."}
      </Typography>
      <Chip
        label="Browse courses"
        icon={<Icon icon="mdi:compass-outline" width={18} />}
        onClick={onBrowse}
        sx={{ mt: 2, fontWeight: 700, cursor: "pointer", px: 0.5 }}
      />
    </Box>
  );
}
