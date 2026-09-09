"use client";

import type { ReactNode } from "react";
import { SectionShell } from "@/components/scorecard/shared";

/**
 * The assessment-management module's signature card shell + accents, mirroring the
 * adaptive-course/quiz pattern (which wraps the scorecard `SectionShell`). A cool
 * indigo→sky→teal radial mesh gives every assessment admin surface one identity, the
 * same way the adaptive module has its indigo→purple→pink mesh.
 */
export const ASSESSMENT_RADIAL_MESH = [
  "radial-gradient(circle at 8% 0%, color-mix(in srgb, #1b4f8a 20%, transparent) 0%, transparent 55%)",
  "radial-gradient(circle at 95% 5%, color-mix(in srgb, #1b4f8a 16%, transparent) 0%, transparent 55%)",
  "radial-gradient(circle at 50% 110%, color-mix(in srgb, #0f6b7a 18%, transparent) 0%, transparent 60%)",
];

interface AssessmentSectionShellProps {
  radialMesh?: string[];
  meshOpacity?: number;
  children: ReactNode;
}

export function AssessmentSectionShell({
  radialMesh = ASSESSMENT_RADIAL_MESH,
  meshOpacity = 0.5,
  children,
}: AssessmentSectionShellProps) {
  return (
    <SectionShell radialMesh={radialMesh} meshOpacity={meshOpacity}>
      {children}
    </SectionShell>
  );
}

/** Per-surface accent gradients, matching the scorecard/adaptive convention. */
export const ASSESSMENT_ACCENTS = {
  indigo: { top: "#1b4f8a", bottom: "#0e2a4b" },
  violet: { top: "#14406f", bottom: "#164274" },
  sky: { top: "#1b4f8a", bottom: "#12365f" },
  teal: { top: "#0f6b7a", bottom: "#0b5260" },
  amber: { top: "#b7791f", bottom: "#8a5a12" },
  // The bottom stop was rose-700, which is both lighter and pinker than the top,
  // so the gradient ran the wrong way as well as off the palette.
  rose: { top: "#b32020", bottom: "#8f1919" },
} as const;

export type AssessmentAccent = keyof typeof ASSESSMENT_ACCENTS;
