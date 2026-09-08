/**
 * Rule-based ATS analysis, for when no model is available.
 *
 * DEMO REPO ONLY in practice, though the logic is honest anywhere.
 *
 * This route used to answer `501 {"error":"ATS AI analysis is not configured
 * (set OPENAI_API_KEY)"}`, and the resume screen printed that straight into a
 * red toast and a warning banner. A prospect evaluating the product was being
 * shown an environment variable name. It is the same failure as the demo
 * transport leaking "No demo handler": internal text reaching a buyer.
 *
 * The fix is not a softer error. The scoring the resume screen already runs
 * client-side (`components/profile/resume/atsScore.ts`) is a genuine ATS check
 * of exactly the kind commercial parsers do: section presence, contact
 * completeness, bullet quality, date consistency, length and keyword overlap
 * with the job description. None of that needs a model. So the route computes
 * it server-side and returns a real report.
 *
 * What it deliberately does NOT do is claim to be the model. The summary says
 * plainly that this is a structural check and that a model adds judgement about
 * wording and seniority, so nothing here overstates what was actually run.
 */

import type { ResumeData } from "@/components/profile/resume/types";
import { computeATSScore } from "@/components/profile/resume/atsScore";

export interface LocalAnalysis {
  overallScore: number;
  atsScore: number;
  tips: string[];
  detailedReport: {
    goodThings: string[];
    scopeForImprovement: string[];
    suggestions: string[];
    executiveSummary: string;
  };
  qualityChecks: {
    keywordMatch?: { score: number; note?: string };
    sectionPresence?: { score: number; note?: string };
    contactCompleteness?: { score: number; note?: string };
    bulletQuality?: { score: number; note?: string };
    dateConsistency?: { score: number; note?: string };
    length?: { score: number; note?: string };
  };
  feedback: {
    content: { score: number; strengths: string[]; improvements: string[] };
    structure: { score: number; strengths: string[]; improvements: string[] };
    skills: { score: number; strengths: string[]; improvements: string[] };
  };
  /** Tells the client this came from the structural checker, not a model. */
  analysisMode: "structural";
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

/** Every bullet across the resume, for the writing-quality checks. */
function allBullets(data: ResumeData): string[] {
  return data.workExperience.flatMap((w) => w.description.filter((d) => d.trim()));
}

/** A bullet that opens with a verb and carries a number is the ATS ideal. */
const ACTION_VERBS =
  /^(built|led|shipped|designed|reduced|increased|migrated|automated|owned|launched|improved|cut|scaled|delivered|created|implemented|refactored|drove|grew|streamlined|architected)/i;
const HAS_NUMBER = /\d/;

function bulletQuality(data: ResumeData) {
  const bullets = allBullets(data);
  if (!bullets.length) {
    return { score: 0, note: "No experience bullets found. ATS parsers read bullets, not paragraphs." };
  }
  const withVerb = bullets.filter((b) => ACTION_VERBS.test(b.trim())).length;
  const withNumber = bullets.filter((b) => HAS_NUMBER.test(b)).length;
  const score = clamp(((withVerb / bullets.length) * 55) + ((withNumber / bullets.length) * 45));
  return {
    score,
    note: `${withVerb} of ${bullets.length} bullets open with an action verb; ${withNumber} contain a measurable result.`,
  };
}

function sectionPresence(data: ResumeData) {
  const present = [
    ["a professional summary", Boolean(data.basicInfo.summary?.trim())],
    ["work experience", data.workExperience.length > 0],
    ["education", data.education.length > 0],
    ["skills", (data.skills?.length ?? 0) > 0],
    ["projects", (data.projects?.length ?? 0) > 0],
  ] as const;
  const have = present.filter(([, ok]) => ok);
  const missing = present.filter(([, ok]) => !ok).map(([label]) => label);
  return {
    score: clamp((have.length / present.length) * 100),
    note: missing.length
      ? `Missing ${missing.join(", ")}. Parsers key off standard section headings.`
      : "All the sections an ATS looks for are present.",
  };
}

function contactCompleteness(data: ResumeData) {
  const b = data.basicInfo;
  const fields = [
    ["a full name", Boolean(b.firstName?.trim() && b.lastName?.trim())],
    ["an email address", Boolean(b.email?.trim())],
    ["a phone number", Boolean(b.phone?.trim())],
    ["a location", Boolean(b.location?.trim())],
    ["a LinkedIn or portfolio link", Boolean(b.linkedin?.trim() || b.portfolio?.trim() || b.github?.trim())],
  ] as const;
  const missing = fields.filter(([, ok]) => !ok).map(([label]) => label);
  return {
    score: clamp(((fields.length - missing.length) / fields.length) * 100),
    note: missing.length
      ? `Add ${missing.join(", ")}. A missing contact field is the most common reason a strong resume is never followed up.`
      : "Contact block is complete.",
  };
}

/** A date that reads as a range, on every role. */
function dateConsistency(data: ResumeData) {
  const roles = data.workExperience;
  if (!roles.length) return { score: 0, note: "No roles to check." };
  const dated = roles.filter((w) => w.startDate?.trim() && (w.endDate?.trim() || w.current));
  return {
    score: clamp((dated.length / roles.length) * 100),
    note:
      dated.length === roles.length
        ? "Every role carries a start and end date."
        : `${roles.length - dated.length} role(s) are missing a start or end date, which parsers read as a gap.`,
  };
}

function lengthCheck(data: ResumeData) {
  const words = [
    data.basicInfo.summary ?? "",
    ...allBullets(data),
    ...data.education.map((e) => e.description ?? ""),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  // 400 to 800 words is the band that fits one to two pages once formatted.
  if (words < 200) return { score: 40, note: `About ${words} words. Thin: most screens expect 400 to 800.` };
  if (words < 400) return { score: 70, note: `About ${words} words. A little short of the usual 400 to 800.` };
  if (words <= 800) return { score: 100, note: `About ${words} words, which fits one to two pages.` };
  if (words <= 1100) return { score: 75, note: `About ${words} words. Slightly long; tighten the oldest roles first.` };
  return { score: 50, note: `About ${words} words. Long enough that a recruiter will skim rather than read.` };
}

/**
 * Fill in any array the caller left out.
 *
 * `computeATSScore` walks workExperience, education, skills, projects and
 * certifications unconditionally, so a payload missing one throws
 * "Cannot read properties of undefined (reading 'forEach')" and the route
 * answers 500. A resume screen with nothing in a section is an ordinary state,
 * and an analysis endpoint that dies on it is worse than one that scores it
 * zero.
 */
function normalise(data: ResumeData): ResumeData {
  return {
    ...data,
    basicInfo: data.basicInfo ?? ({} as ResumeData["basicInfo"]),
    workExperience: (data.workExperience ?? []).map((w) => ({ ...w, description: w.description ?? [] })),
    education: data.education ?? [],
    skills: data.skills ?? [],
    projects: (data.projects ?? []).map((p) => ({ ...p, technologies: p.technologies ?? [] })),
    certifications: data.certifications ?? [],
  };
}

export function buildLocalAnalysis(input: ResumeData, jobDescription: string): LocalAnalysis {
  const data = normalise(input);
  const scored = computeATSScore(data, jobDescription);

  const checks = {
    keywordMatch: jobDescription.trim()
      ? {
          score: clamp(scored.breakdown.keywordMatch),
          note: scored.missingKeywords?.length
            ? `Not found in your resume: ${scored.missingKeywords.slice(0, 8).join(", ")}.`
            : "Your resume covers the terms in the job description.",
        }
      : {
          score: clamp(scored.breakdown.keywordMatch),
          note: "Paste a job description to score keyword overlap against a specific role.",
        },
    sectionPresence: sectionPresence(data),
    contactCompleteness: contactCompleteness(data),
    bulletQuality: bulletQuality(data),
    dateConsistency: dateConsistency(data),
    length: lengthCheck(data),
  };

  const good: string[] = [];
  const gaps: string[] = [];
  for (const [key, value] of Object.entries(checks)) {
    const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
    (value.score >= 80 ? good : gaps).push(`${label.trim()}: ${value.note}`);
  }

  return {
    overallScore: clamp(scored.overall),
    atsScore: clamp(scored.overall),
    tips: scored.suggestions.slice(0, 6),
    detailedReport: {
      goodThings: good,
      scopeForImprovement: gaps,
      suggestions: scored.suggestions,
      executiveSummary:
        `Structural ATS check: ${clamp(scored.overall)} out of 100. This grades what a parser can verify ` +
        `mechanically, which is section structure, contact fields, bullet writing, date continuity, length ` +
        `and keyword overlap. It does not judge seniority or how well the wording matches a specific team, ` +
        `so treat it as the floor a resume has to clear rather than the whole picture.`,
    },
    qualityChecks: checks,
    feedback: {
      content: {
        score: clamp(scored.breakdown.contentDepth),
        strengths: good.slice(0, 3),
        improvements: gaps.slice(0, 3),
      },
      structure: {
        score: clamp(scored.breakdown.format),
        strengths: checks.sectionPresence.score >= 80 ? [checks.sectionPresence.note] : [],
        improvements: checks.sectionPresence.score < 80 ? [checks.sectionPresence.note] : [],
      },
      skills: {
        score: clamp(scored.breakdown.keywordMatch),
        strengths: scored.matchedKeywords?.length
          ? [`Matched ${scored.matchedKeywords.length} terms from the job description.`]
          : [],
        improvements: scored.missingKeywords?.length
          ? [`Consider covering: ${scored.missingKeywords.slice(0, 8).join(", ")}.`]
          : [],
      },
    },
    analysisMode: "structural",
  };
}
