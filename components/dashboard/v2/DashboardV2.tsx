"use client";

import { useState } from "react";
import { ProfileCompletionPanel } from "./ProfileCompletionPanel";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useInstantNavigation } from "@/lib/hooks/useInstantNavigation";
import { useQuery } from "@tanstack/react-query";
import { adaptiveJourneyService } from "@/lib/services/adaptive-journey.service";
import {
  useHideLeaderboardView,
  useIsCourseEnabled,
} from "@/lib/contexts/ClientInfoContext";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { LearnerDashboard } from "@/lib/types/dashboard";
import { AiBriefingHero } from "./AiBriefingHero";
import { StatCards } from "./StatCards";
import { CourseReadinessCard } from "./CourseReadinessCard";
import { SkillProfilePanel } from "./SkillProfilePanel";
import { CertificatePanel } from "./CertificatePanel";
import { UpNextPanel } from "./UpNextPanel";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { ContinueCoursesRow } from "./ContinueCoursesRow";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { DashboardModulesRow, DashboardModulesRail } from "./modules/DashboardModulesRow";
import { TodayGoalPanel } from "./TodayGoalPanel";
import { RecruitmentCalendarPanel } from "./RecruitmentCalendarPanel";
import { MissionNoticesPanel } from "./MissionNoticesPanel";
import { AtAGlancePanel } from "./AtAGlancePanel";

/** Shared key so other surfaces can invalidate the learner dashboard after a scoring event. */
export const DASHBOARD_QUERY_KEY = ["learner-dashboard"] as const;

/** Legacy fallback - ONLY for tenants WITHOUT the adaptive feature (the dashboard endpoint 403s) or
 *  an unrecoverable load failure. Every adaptive-enabled tenant gets DashboardV2 (the full layout or
 *  the empty state below), so this old grid is no longer the default for normal students. */
function LegacyFallback() {
  const { loading, courses } = useDashboardData();
  // streak props are deprecated on DashboardContent (StreakTable fetches the real streak); don't pass them.
  return <DashboardContent courses={courses} loading={loading} />;
}

/** v2 empty state for students on an adaptive-enabled tenant who aren't in any adaptive course yet
 *  (including legacy-only students - the AdaptivePromo banner mounted above this nudges them to
 *  start). Keeps the v2 chrome instead of dropping back to the old dashboard. */
function EmptyAdaptiveDashboard({ data, hideLeaderboard }: { data: LearnerDashboard | null; hideLeaderboard: boolean }) {
  const { push } = useInstantNavigation();
  return (
    <Stack spacing={2.5}>
      {data && <StatCards aggregate={data.aggregate} hideLeaderboard={hideLeaderboard} />}
      <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: "center", border: "1px solid #eef2f7", bgcolor: "#faf9ff" }}>
        <Box sx={{ width: 56, height: 56, mx: "auto", mb: 2, borderRadius: "50%", display: "grid", placeItems: "center", background: "linear-gradient(135deg,#14406f,#1b4f8a)" }}>
          <Icon icon="mdi:rocket-launch-outline" width={28} color="#fff" />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: "#0f172a" }}>Start your adaptive journey</Typography>
        <Typography sx={{ color: "#64748b", mt: 1, mb: 2.5, maxWidth: 460, mx: "auto" }}>
          You&apos;re not in a course yet. Courses adjust to your skill level as you learn - pick one to begin.
        </Typography>
        <Button onClick={() => push("/adaptive-courses")} variant="contained" endIcon={<Icon icon="mdi:arrow-right" width={18} />}
          sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, px: 3, py: 1.1, background: "linear-gradient(135deg,#14406f,#0b5260)" }}>
          Browse courses
        </Button>
      </Box>
      {!hideLeaderboard && data?.leaderboard && <LeaderboardPanel leaderboard={data.leaderboard} />}
      <DashboardModulesRow />
    </Stack>
  );
}

export function DashboardV2() {
  const hideLeaderboard = useHideLeaderboardView();
  const courseEnabled = useIsCourseEnabled();

  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  // Served from the PERSISTED query cache, so a revisit — or a return after the tab sat idle — paints
  // the real dashboard immediately and revalidates in the background, instead of showing the skeleton
  // again behind a cold request. (The previous service-level cache was in-memory only, so it was lost
  // on every reload, which is exactly the "came back later and it takes forever" case.)
  const { data: dashboard, isPending, error: queryError } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => adaptiveJourneyService.getLearnerDashboard(),
  });
  const data = dashboard ?? null;

  // Same triage as before: feature-off tenants 403/404, and a transient 5xx or a network error (no
  // status) shouldn't blank the page with a scary banner - degrade to the legacy grid instead.
  // Reserve the error text for explicit client errors we genuinely can't recover from.
  const failStatus = (queryError as { response?: { status?: number } } | null)?.response?.status;
  const degraded =
    Boolean(queryError) &&
    (failStatus === 403 || failStatus === 404 || !failStatus || failStatus >= 500);
  const error =
    queryError && !degraded
      ? queryError instanceof Error
        ? queryError.message
        : "Failed to load your dashboard."
      : null;

  // Only blocks when there is genuinely nothing cached to show.
  if (isPending) return <DashboardSkeleton hideLeaderboard={hideLeaderboard} />;
  if (error) return <Typography sx={{ color: "#8f1919", py: 6, textAlign: "center", fontWeight: 600 }}>{error}</Typography>;
  // Only tenants without the adaptive feature (403/404) or a hard failure see the old dashboard.
  if (degraded) return <LegacyFallback />;
  // Everyone else gets v2 - even with zero adaptive courses (legacy-only / brand-new students).
  if (!data || data.courses.length === 0) return <EmptyAdaptiveDashboard data={data} hideLeaderboard={hideLeaderboard} />;

  const activeCourse = data.courses.find((c) => c.id === activeCourseId) ?? data.courses[0];

  return (
    // Two columns like the mockup: AI briefing + stats + readiness on the left;
    // skill profile + certificate + up-next + leaderboard on the right. Course Readiness and Skill
    // Profile are core to the adaptive dashboard, so they render whenever there's an active course
    // (no separate feature flag - that mismatch was what made them intermittently disappear).
    // The tenant-gated module widgets live in the right rail (they fill it out
    // and each sizes to its content) rather than a sparse full-width grid.
    //
    // Under the readiness card the left column carries the GOVERNMENT panels, the
    // recruitment calendar and the mission's circulars, with the at-a-glance strip
    // full width beneath both columns. They are there because of what sits directly
    // above them. ContinueCoursesRow is gated on the legacy `course` feature flag,
    // which this tenant deliberately leaves off (see lib/demo/db/tenant.ts), so the
    // left column used to stop at the readiness card while the right rail carried on
    // for another thirteen hundred pixels beside dead space. Switching the flag on
    // would have put two things called Courses in one sidebar; filling the column
    // with what an aspirant actually opens first costs nothing elsewhere. Each panel
    // fetches its own data and renders NOTHING when it has none, so a quiet month
    // shortens the column instead of printing headings over empty lists.
    <Stack spacing={2.5}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 390px" }, gap: 2.5, alignItems: "start" }}>
        <Box sx={{ minWidth: 0 }}>
          {data.briefing && (
            <Box data-tour-id="dash-briefing">
              <AiBriefingHero briefing={data.briefing} profile={data.profile} />
            </Box>
          )}
          <Box data-tour-id="dash-stats">
            <StatCards aggregate={data.aggregate} hideLeaderboard={hideLeaderboard} />
          </Box>
          <Box data-tour-id="dash-courses">
            <CourseReadinessCard courses={data.courses} activeCourseId={activeCourse?.id ?? null} onSelect={setActiveCourseId} />
          </Box>
          {courseEnabled && <ContinueCoursesRow courses={data.courses} />}
          <RecruitmentCalendarPanel />
          <MissionNoticesPanel />
        </Box>

        {/* minWidth 0 on the rail as well as the left column: a grid child defaults to
            min-width:auto, so one long unbroken string in any panel would widen the
            track and scroll the whole page sideways at 375px. */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          {/* First in the rail, and it renders NOTHING for a learner with nothing to fix.
              Deliberately not wrapped in a <Box> here: an empty wrapper still occupies a
              Stack spacing slot, which pushed the whole rail 16px out of alignment with the
              briefing card next to it. The tour anchor lives on the panel's own card instead. */}
          <ProfileCompletionPanel />
          {data.todayGoal && (
            <Box data-tour-id="dash-goal">
              <TodayGoalPanel goal={data.todayGoal} />
            </Box>
          )}
          <Box data-tour-id="dash-skills">
            <SkillProfilePanel
              courses={data.courses}
              activeCourseId={activeCourse?.id ?? null}
              onSelect={setActiveCourseId}
              crossCourseMastery={data.aggregate.overallMasteryAvg}
            />
          </Box>
          {activeCourse?.certificate.enabled && <CertificatePanel course={activeCourse} />}
          {courseEnabled && <UpNextPanel items={data.crossCourseUpNext} />}
          <DashboardModulesRail />
          {!hideLeaderboard && (
            <Box data-tour-id="dash-leaderboard">
              <LeaderboardPanel leaderboard={data.leaderboard} />
            </Box>
          )}
        </Stack>
      </Box>

      {/* Full width, under both columns, and that placement is doing real work. A
          strip of seven portal addresses and three contacts is a ten row list in a
          654px column and two scannable rows across the whole width. It is also what
          lets the left column finish level with the right rail: the calendar and the
          notices fill the gap the missing courses row left, and anything more inside
          that column would overshoot the rail by as much as it used to fall short. */}
      <AtAGlancePanel />
    </Stack>
  );
}
