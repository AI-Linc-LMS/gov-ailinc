"use client";

import { Box } from "@mui/material";
import dynamicImport from "next/dynamic";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdaptivePromo } from "@/components/courses/AdaptivePromo";

/**
 * Client-only, deliberately.
 *
 * Every number on this dashboard comes from the in-browser demo transport, so
 * the server has nothing to render it from: it produced the pending state while
 * the client hydrated from the persisted query cache, and the two disagreed.
 * That mismatch was the console error on the one page every visitor lands on
 * (React #418, and before the provider fix, #419).
 *
 * Skipping SSR for this subtree costs nothing, because there was never any
 * server data to send, and it removes the mismatch at its source rather than
 * papering over it with suppressHydrationWarning.
 */
const DashboardV2 = dynamicImport(
  () => import("@/components/dashboard/v2/DashboardV2").then((m) => m.DashboardV2),
  { ssr: false },
);

export default function DashboardPage() {
  return (
    <MainLayout fullWidthContent>
      <Box sx={{ maxWidth: 1600, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        {/* New-adaptive-courses banner + first-time intro guide (legacy-only students). */}
        <AdaptivePromo />
        <DashboardV2 />
      </Box>
    </MainLayout>
  );
}

export const dynamic = "force-dynamic";
