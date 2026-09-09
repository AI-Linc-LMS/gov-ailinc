/**
 * Saved resumes, and the document a resume preview actually renders.
 *
 * Two things depend on this file. The learner's apply wizard cannot be completed
 * without at least one saved resume: step 1 renders "No saved resumes" in the
 * picker and Next stays disabled forever, which is the exact dead end this
 * prototype cannot afford. And the admin pipeline drops
 * `application.resume_url` straight into an iframe, so that URL has to resolve
 * to something readable with no network available.
 *
 * The preview is therefore a self-contained `data:text/html` document generated
 * from the applicant's own seed record. A hosted PDF is impossible (nothing may
 * leave the browser) and a `blob:` URL cannot survive a reload, so an inline
 * document is the only form that both renders and persists.
 *
 * Note for whoever owns `/accounts/clients/:id/user-profile/resumes/`: read the
 * list from `savedResumes()` and push uploads with `addSavedResume()`, so the
 * picker and this seed can never disagree.
 */

import type { SavedResume } from "@/lib/services/resume.service";
import { STUDENT_PERSONA, type DemoPerson } from "./people";
import { overlay } from "./overlay";
import { isoDaysAgo, todayStart } from "../clock";

/** Overlay key holding resumes the visitor uploaded this session, newest first. */
export const UPLOADED_RESUMES_KEY = "resumes:uploaded";

/**
 * The aspirant persona's saved resumes.
 *
 * Two of them, not one: the picker is a dropdown, and a dropdown with a single
 * option reads as a placeholder rather than a real choice. They are also the two
 * tracks she is actually on, an office or banking role and the solar trade, so
 * choosing between them in the apply wizard is a real decision rather than a
 * pair of near-identical files.
 *
 * No year in the file name. A resume labelled with a fixed year is stale the
 * moment the calendar turns, and everything else in this demo is relative.
 */
const SEED_RESUMES: readonly SavedResume[] = [
  {
    id: 4101,
    display_name: "Sandhya Macherla, Banking and Financial Sector.pdf",
    file_url: "/media/resumes/sandhya-macherla-banking.pdf",
    created_at: isoDaysAgo(9, 21, 40),
  },
  {
    id: 4102,
    display_name: "Sandhya Macherla, Solar PV Technician.pdf",
    file_url: "/media/resumes/sandhya-macherla-solar-pv.pdf",
    created_at: isoDaysAgo(34, 18, 5),
  },
];

/** Every resume the persona can pick from, most recent first. */
export function savedResumes(): SavedResume[] {
  return [...overlay.get<SavedResume[]>(UPLOADED_RESUMES_KEY, []), ...SEED_RESUMES];
}

export function savedResumeById(id: number): SavedResume | undefined {
  return savedResumes().find((r) => r.id === id);
}

/** Record an uploaded resume so the picker shows it immediately and after a reload. */
export function addSavedResume(resume: SavedResume): SavedResume {
  overlay.unshift(UPLOADED_RESUMES_KEY, resume);
  return resume;
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function esc(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

interface ResumeFacts {
  headline: string;
  college: string;
  degree: string;
  gradYear: number | string;
  location: string;
  phone: string;
  email: string;
  skills: string;
  experience: string;
}

/**
 * A one-page resume as an inline HTML document.
 *
 * Rendered inside an iframe by both preview modals. Kept to plain inline styles
 * with no external font or stylesheet, because the frame is a separate document
 * and inherits nothing from the app.
 */
export function resumeDocumentUrl(person: DemoPerson, facts: ResumeFacts): string {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(person.full_name)} resume</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif;color:#0f172a">
<div style="max-width:760px;margin:24px auto;background:#ffffff;padding:40px 44px;box-shadow:0 1px 3px rgba(15,23,42,0.12)">
<h1 style="margin:0;font-size:26px;letter-spacing:-0.5px">${esc(person.full_name)}</h1>
<p style="margin:6px 0 0;font-size:14px;color:#475569">${esc(facts.headline)}</p>
<p style="margin:4px 0 0;font-size:12px;color:#64748b">${esc(facts.email)} &nbsp;&middot;&nbsp; ${esc(facts.phone)} &nbsp;&middot;&nbsp; ${esc(facts.location)}</p>
<hr style="margin:22px 0;border:0;border-top:1px solid #e2e8f0">
<h2 style="margin:0 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#12365f">Education</h2>
<p style="margin:0;font-size:14px;font-weight:600">${esc(facts.degree)}</p>
<p style="margin:2px 0 0;font-size:13px;color:#475569">${esc(facts.college)}, class of ${esc(String(facts.gradYear))}</p>
<h2 style="margin:22px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#12365f">Skills</h2>
<p style="margin:0;font-size:13px;color:#334155;line-height:1.7">${esc(facts.skills)}</p>
<h2 style="margin:22px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#12365f">Experience</h2>
<p style="margin:0;font-size:13px;color:#334155;line-height:1.7">${esc(facts.experience)}</p>
<h2 style="margin:22px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#12365f">Training and practice</h2>
<ul style="margin:0;padding-left:18px;font-size:13px;color:#334155;line-height:1.8">
<li>Course capstone assignment submitted at the district skill centre and reviewed by mission faculty.</li>
<li>Sectional practice across quantitative aptitude, reasoning and general awareness, with attempt-wise accuracy tracked.</li>
<li>Batch project completed with a demonstration to the centre in-charge on the final day.</li>
</ul>
<p style="margin:28px 0 0;font-size:11px;color:#94a3b8">Generated from the Telangana Skills &amp; Employment Mission aspirant profile.</p>
</div></body></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

/** The persona's own resume document, used when they apply for a job. */
export function personaResumeUrl(): string {
  return resumeDocumentUrl(STUDENT_PERSONA, {
    headline: STUDENT_PERSONA.headline,
    college: STUDENT_PERSONA.college,
    degree: "B.Com (Computer Applications)",
    // Four years back, matching the education entry in `profiles.ts`. A resume
    // that graduates her in a different year to her own profile is the kind of
    // detail an evaluator reads as a broken build.
    gradYear: todayStart().getUTCFullYear() - 4,
    location: "Warangal, Telangana",
    phone: STUDENT_PERSONA.phone,
    email: STUDENT_PERSONA.email,
    skills:
      "Quantitative aptitude, reasoning, general English, Indian polity, Indian economy, Telangana movement and state formation, banking awareness, book-keeping with Tally, MS Excel",
    experience:
      "Accounts assistant with a rooftop solar contractor in Warangal, handling invoicing, the GST ledger and DISCOM net-metering paperwork. Earlier, a part-time data entry operator at a Common Service Centre in Hanamkonda.",
  });
}
