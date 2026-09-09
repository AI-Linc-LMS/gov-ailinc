/** Shared score / grade palette for scorecard UI and charts */

export function proficiencyBandColor(score: number): string {
  if (score >= 80) return "#0e7a3c";
  if (score >= 60) return "#0a66c2";
  if (score >= 40) return "#b7791f";
  return "#b32020";
}

export function gradeLevelColor(level: string): string {
  switch (level) {
    case "Interview-Ready":
      return "#0e7a3c";
    case "Advanced":
      return "#0a66c2";
    case "Intermediate":
      return "#b7791f";
    default:
      return "#9ca3af";
  }
}

export function gradeLevelGradient(level: string): string {
  switch (level) {
    case "Interview-Ready":
      return "linear-gradient(135deg, #0e7a3c 0%, #0B6232 100%)";
    case "Advanced":
      return "linear-gradient(135deg, #0a66c2 0%, #004182 100%)";
    case "Intermediate":
      return "linear-gradient(135deg, #b7791f 0%, #8a5a12 100%)";
    default:
      return "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)";
  }
}

export function statusBadgeColor(badge: string): string {
  if (badge === "Green") return "#0e7a3c";
  if (badge === "Amber") return "#b7791f";
  return "#b32020";
}

/** Chip / accent color for the overview “learning state” card (low tier is calm, not alarm red). */
export function learningStateAccentColor(badge: string): string {
  if (badge === "Green") return "#0e7a3c";
  if (badge === "Amber") return "#b7791f";
  return "#1b4f8a";
}

/** User-facing label for the learning-state chip (API may still send Green / Amber / Red). */
export function learningStateLabel(badge: string): string {
  if (badge === "Green") return "On track";
  if (badge === "Amber") return "Building momentum";
  return "Getting started";
}

/** Short tooltip for the learning-state info icon (avoids long API criteria text). */
export function learningStateTooltip(badge: string): string {
  if (badge === "Green") return "Meeting engagement targets.";
  if (badge === "Amber") return "Near targets-small bump in activity helps.";
  return "Early stage-more time on lessons raises this.";
}
