import { Assessment } from "@/lib/services/assessment.service";

/**
 * Checks if an assessment is a psychometric assessment
 * by checking if the title or slug contains "psychometric", "k-disha", or "k-sage" (case-insensitive)
 */
export function isPsychometricAssessment(assessment: Assessment): boolean {
  const title = assessment.title?.toLowerCase() || "";
  const slug = assessment.slug?.toLowerCase() || "";
  
  return (
    title.includes("psychometric") || 
    slug.includes("psychometric") ||
    title.includes("k-disha") ||
    slug.includes("k-disha") ||
    title.includes("kdisha") ||
    slug.includes("kdisha") ||
    title.includes("k-sage") ||
    slug.includes("k-sage") ||
    title.includes("ksage") ||
    slug.includes("ksage")
  );
}

/**
 * Generates tags for psychometric assessments
 * Returns a mix of predefined tags and dynamic tags based on assessment data
 */
export function getPsychometricTags(
  assessment: Assessment
): Array<{ name: string; color: string }> {
  const tags: Array<{ name: string; color: string }> = [];
  
  // Predefined tags that are always included
  const predefinedTags = [
    { name: "Personality Assessment", color: "#14406f" },
    { name: "Behavioral Analysis", color: "#1b4f8a" },
    { name: "Self-Discovery", color: "#4a7fbb" },
  ];
  
  // Add predefined tags
  tags.push(...predefinedTags);
  
  // Dynamic tags based on assessment data
  const description = assessment.description?.toLowerCase() || "";
  const instructions = assessment.instructions?.toLowerCase() || "";
  const title = assessment.title?.toLowerCase() || "";
  
  // Check for career-related keywords
  if (
    description.includes("career") ||
    instructions.includes("career") ||
    title.includes("career")
  ) {
    tags.push({ name: "Career Guidance", color: "#1b4f8a" });
  }
  
  // Check for learning-related keywords
  if (
    description.includes("learning") ||
    instructions.includes("learning") ||
    description.includes("education")
  ) {
    tags.push({ name: "Learning Style", color: "#164274" });
  }
  
  // Check for work-related keywords
  if (
    description.includes("work") ||
    instructions.includes("work") ||
    description.includes("workplace")
  ) {
    tags.push({ name: "Work Style", color: "#12365f" });
  }
  
  // Limit to 4 tags maximum
  return tags.slice(0, 4);
}
