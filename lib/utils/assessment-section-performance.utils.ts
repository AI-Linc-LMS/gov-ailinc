/**
 * Section-wise performance table: row accents + status labels
 * (shared by analytics UI and PDF).
 */

export type SectionPerformanceStatusKind =
  | "critical"
  | "moderate"
  | "strongest";

/**
 * Row accents. Each entry carries the same colour twice: once as a hex the UI
 * reads, and once as the decimal channels jsPDF needs. Only the hex half is
 * greppable, so the palette sweep moved the hexes onto the government colours
 * and left every *Rgb array on the vendor ramp: the same table was rendering
 * navy on screen and blue-600 / violet-600 / emerald in the exported PDF. The
 * arrays below are now the channels of the hex on the line above them, so the
 * two halves cannot disagree. If you change a hex here, change its array too.
 */
export const SECTION_ROW_ACCENTS = [
  {
    solid: "#1b4f8a",
    light: "#d9e6f4",
    text: "#12365f",
    solidRgb: [27, 79, 138] as const,
    lightRgb: [217, 230, 244] as const,
    textRgb: [18, 54, 95] as const,
  },
  {
    solid: "#14406f",
    light: "#eef3fa",
    text: "#12365f",
    solidRgb: [20, 64, 111] as const,
    lightRgb: [238, 243, 250] as const,
    textRgb: [18, 54, 95] as const,
  },
  {
    solid: "#0B6232",
    light: "#dff0e6",
    text: "#065f46",
    solidRgb: [11, 98, 50] as const,
    lightRgb: [223, 240, 230] as const,
    textRgb: [6, 95, 70] as const,
  },
  {
    solid: "#991b1b",
    light: "#fbeaea",
    text: "#991b1b",
    solidRgb: [153, 27, 27] as const,
    lightRgb: [251, 234, 234] as const,
    textRgb: [153, 27, 27] as const,
  },
  {
    solid: "#8a5a12",
    light: "#ffedd5",
    text: "#9a3412",
    solidRgb: [138, 90, 18] as const,
    lightRgb: [255, 237, 213] as const,
    textRgb: [154, 52, 18] as const,
  },
] as const;

export type SectionRowAccent = (typeof SECTION_ROW_ACCENTS)[number];

export function sectionRowAccent(index: number): SectionRowAccent {
  return SECTION_ROW_ACCENTS[index % SECTION_ROW_ACCENTS.length]!;
}

export function maxSectionAvgPct(
  sections: readonly { average_percentage?: number | null }[],
): number {
  if (sections.length === 0) return 0;
  return Math.max(
    0,
    ...sections.map((s) =>
      s.average_percentage != null && Number.isFinite(s.average_percentage)
        ? s.average_percentage
        : 0,
    ),
  );
}

/**
 * Critical: under 40%, or cohort is weak (max still under 40%).
 * Strongest: tied for highest average % (when cohort has at least one section ≥ 40%).
 * Moderate: everything else in the “healthy” band.
 */
export function sectionPerformanceStatus(
  avgPct: number | null | undefined,
  maxAvgPctAmongSections: number,
): SectionPerformanceStatusKind {
  const p =
    avgPct != null && Number.isFinite(avgPct) ? Number(avgPct) : 0;
  if (maxAvgPctAmongSections < 40) return "critical";
  if (p < 40) return "critical";
  if (Math.abs(p - maxAvgPctAmongSections) < 0.051) return "strongest";
  return "moderate";
}

export function sectionPerformanceStatusLabel(
  kind: SectionPerformanceStatusKind,
): string {
  switch (kind) {
    case "critical":
      return "Critical gap";
    case "moderate":
      return "Moderate";
    case "strongest":
      return "Strongest";
  }
}

/** MUI-friendly status chip colors (filled pill). */
export const SECTION_STATUS_MUI: Record<
  SectionPerformanceStatusKind,
  { bgcolor: string; color: string }
> = {
  critical: { bgcolor: "#fbeaea", color: "#991b1b" },
  moderate: { bgcolor: "#ffedd5", color: "#9a3412" },
  strongest: { bgcolor: "#dff0e6", color: "#065f46" },
};

/** Filled status pill in vector PDF (matches SECTION_STATUS_MUI). */
export const SECTION_STATUS_PDF_RGB: Record<
  SectionPerformanceStatusKind,
  { bg: readonly [number, number, number]; fg: readonly [number, number, number] }
> = {
  critical: { bg: [254, 226, 226], fg: [153, 27, 27] },
  moderate: { bg: [255, 237, 213], fg: [154, 52, 18] },
  strongest: { bg: [209, 250, 229], fg: [6, 95, 70] },
};
