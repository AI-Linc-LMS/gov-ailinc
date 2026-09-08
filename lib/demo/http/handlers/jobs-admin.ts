/**
 * The placement office: everything an administrator does to a posting, plus the
 * two learner endpoints that close the apply loop.
 *
 * These are the writes. Until they existed the module was read-only theatre:
 * Create Job posted into nothing, Delete asked for confirmation and then left
 * the row on screen, the applications table could not be moved a single stage,
 * and a learner who reached the end of the apply wizard got a 501. Every handler
 * here goes through `lib/demo/db/jobs.ts`, so a create shows up in the list, a
 * status change survives a reload, and the learner's application appears in the
 * admin queue for the same job.
 *
 * Shapes are taken from `lib/services/admin/admin-jobs-v2.service.ts`: the
 * envelope differs per endpoint on purpose (`{results, count}` for lists, a bare
 * array for the question bank, `{updated}` for bulk actions), and getting that
 * wrong crashes the page rather than emptying it.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import {
  addQuestion,
  allApplications,
  allQuestions,
  applicationById,
  applicationsForJob,
  attachJobDescription,
  createJob,
  deleteJob,
  jobById,
  myApplications,
  patchApplication,
  toAdminJob,
  updateJob,
  type ApplicationStatus,
  type JobApplicationRecord,
  type JobQuestion,
  type JobStatus,
  type JobWritePayload,
} from "../../db/jobs";
import { ymd, todayStart } from "../../clock";

const MODULE = "jobs-admin";

const JOB_STATUSES: readonly JobStatus[] = [
  "active",
  "inactive",
  "closed",
  "completed",
  "on_hold",
];

const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  "applying",
  "applied",
  "shortlisted",
  "interview_stage",
  "rejected",
  "selected",
];

/** Pipeline columns the admin drawer can write. Status is handled separately. */
const PIPELINE_FIELDS = [
  "drive",
  "internal_shortlisting",
  "reason_not_shortlisted",
  "shortlisted_by_hr",
  "round_1",
  "round_2",
  "round_3",
  "round_4",
  "offered",
] as const;

function body(req: { body: unknown }): Record<string, unknown> {
  return (req.body ?? {}) as Record<string, unknown>;
}

function numericIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : [];
}

function asJobStatus(value: unknown): JobStatus | undefined {
  return JOB_STATUSES.find((status) => status === value);
}

function asApplicationStatus(value: unknown): ApplicationStatus | undefined {
  return APPLICATION_STATUSES.find((status) => status === value);
}

/**
 * Pull the upload out of a multipart body.
 *
 * The adapter hands FormData through untouched (see `toBody`), so this is the
 * real File the visitor picked rather than a serialised stand-in.
 */
function uploadedFile(value: unknown, field = "file"): File | undefined {
  if (typeof FormData === "undefined" || !(value instanceof FormData)) return undefined;
  const entry = value.get(field);
  return typeof File !== "undefined" && entry instanceof File ? entry : undefined;
}

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Split one CSV line, honouring quoted cells that contain commas. */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

const TRUTHY = new Set(["true", "yes", "y", "1", "required"]);

/** Every application across every posting, newest first. */
function allApplicationsSorted(): JobApplicationRecord[] {
  return [...allApplications()].sort((a, b) => b.applied_at.localeCompare(a.applied_at));
}

defineRoutes(MODULE, {
  // ── Postings ─────────────────────────────────────────────────────────────

  /**
   * Create. Returns the full job because the new-job page immediately POSTs the
   * JD file to `/jobs/{id}/upload-jd/` and needs the id back.
   */
  "POST /jobs-v2/api/admin/jobs/": (req) => {
    const payload = body(req) as JobWritePayload;
    if (!String(payload.job_title ?? "").trim() || !String(payload.company_name ?? "").trim()) {
      throw badRequest({ error: "A job title and a company name are required." });
    }
    return toAdminJob(createJob(payload));
  },

  "PUT /jobs-v2/api/admin/jobs/:jobId/": (req) => {
    const updated = updateJob(Number(req.params.jobId), body(req) as JobWritePayload);
    if (!updated) throw notFound("Job not found");
    return toAdminJob(updated);
  },

  /** Deleting returns no body, exactly like the real endpoint's 204. */
  "DELETE /jobs-v2/api/admin/jobs/:jobId/": (req) => {
    if (!deleteJob(Number(req.params.jobId))) throw notFound("Job not found");
    return null;
  },

  /**
   * Attach a job description.
   *
   * The file becomes an object URL that lives as long as the tab, which is what
   * makes "View JD" open the actual document the visitor just picked. It is not
   * persisted: an object URL is dead after a reload, and a link that 404s is
   * worse than no link at all.
   */
  "POST /jobs-v2/api/admin/jobs/:jobId/upload-jd/": (req) => {
    const id = Number(req.params.jobId);
    const job = jobById(id);
    if (!job) throw notFound("Job not found");
    const file = uploadedFile(req.body);
    if (!file) throw badRequest({ error: "No file was received." });
    attachJobDescription(id, file);
    const refreshed = jobById(id);
    return toAdminJob(refreshed ?? job);
  },

  "POST /jobs-v2/api/admin/jobs/bulk-update-status/": (req) => {
    const payload = body(req);
    const status = asJobStatus(payload.status);
    if (!status) throw badRequest({ error: "Pick a status to apply." });
    const ids = numericIds(payload.job_ids);
    const updated = ids.filter((id) => updateJob(id, { status })).length;
    return { updated };
  },

  "POST /jobs-v2/api/admin/jobs/bulk-update-visibility/": (req) => {
    const payload = body(req);
    const isPublished = Boolean(payload.is_published);
    const ids = numericIds(payload.job_ids);
    const updated = ids.filter((id) => updateJob(id, { is_published: isPublished })).length;
    return { updated };
  },

  // ── Applications ─────────────────────────────────────────────────────────

  /**
   * The queue for one posting.
   *
   * `{results, count}`, not a bare array: the page reads `data.results ?? []`,
   * so an array would render an empty table with no error to explain it.
   */
  "GET /jobs-v2/api/admin/jobs/:jobId/applications/": (req) => {
    const id = Number(req.params.jobId);
    if (!jobById(id)) throw notFound("Job not found");
    const wanted = req.query.get("status");
    const rows = applicationsForJob(id).filter((row) => !wanted || row.status === wanted);
    return { results: rows, count: rows.length };
  },

  /**
   * Move one application, from the status dropdown or the pipeline drawer.
   *
   * Only fields the request actually sent are written. The drawer PATCHes every
   * column at once, but the inline dropdown sends `status` alone, and copying
   * the absent keys as empty strings wiped the drive and round notes off a row
   * every time someone changed its status from the table.
   */
  "PATCH /jobs-v2/api/admin/applications/:applicationId/": (req) => {
    const id = Number(req.params.applicationId);
    const current = applicationById(id);
    if (!current) throw notFound("Application not found");

    const payload = body(req);
    const patch: Partial<JobApplicationRecord> = {};
    const status = asApplicationStatus(payload.status);
    if (status) patch.status = status;
    for (const field of PIPELINE_FIELDS) {
      if (payload[field] !== undefined) patch[field] = String(payload[field] ?? "");
    }

    const updated = patchApplication(id, patch);
    if (!updated) throw notFound("Application not found");
    return updated;
  },

  "POST /jobs-v2/api/admin/applications/bulk-update/": (req) => {
    const payload = body(req);
    const status = asApplicationStatus(payload.status);
    if (!status) throw badRequest({ error: "Pick a status to apply." });
    const ids = numericIds(payload.application_ids);
    const updated = ids.filter((id) => patchApplication(id, { status })).length;
    return { updated };
  },

  // ── Reports ──────────────────────────────────────────────────────────────

  /**
   * Application export.
   *
   * Returned as CSV text, not JSON: the service asks for a blob and wraps the
   * response in `new Blob([...])` before triggering the download, so a string is
   * exactly what it needs. The resume column is a yes/no rather than the URL,
   * because an inline resume document would be several kilobytes per row and
   * unreadable in a spreadsheet.
   */
  "GET /jobs-v2/api/admin/reports/export/": (req) => {
    const jobFilter = Number(req.query.get("job_id") ?? "");
    const statusFilter = req.query.get("status") ?? "";

    const rows = (Number.isFinite(jobFilter) && jobFilter
      ? applicationsForJob(jobFilter)
      : allApplicationsSorted()
    ).filter((row) => !statusFilter || row.status === statusFilter);

    const header = [
      "Application ID",
      "Job",
      "Company",
      "Candidate",
      "Email",
      "Phone",
      "College",
      "Degree",
      "Passout year",
      "Location",
      "Status",
      "Drive",
      "Internal shortlisting",
      "Shortlisted by HR",
      "Round 1",
      "Round 2",
      "Round 3",
      "Round 4",
      "Offered",
      "Reason not shortlisted",
      "Resume on file",
      "Applied on",
      "Last updated",
    ];

    const lines = [header.map(csvCell).join(",")];
    for (const row of rows) {
      lines.push(
        [
          row.id,
          row.job_title,
          row.company_name,
          row.student_name,
          row.student_email,
          row.student_phone,
          row.student_college,
          row.student_degree,
          row.student_yop,
          row.student_location,
          row.status,
          row.drive,
          row.internal_shortlisting,
          row.shortlisted_by_hr,
          row.round_1,
          row.round_2,
          row.round_3,
          row.round_4,
          row.offered,
          row.reason_not_shortlisted,
          row.resume_url ? "Yes" : "No",
          row.applied_at.slice(0, 10),
          row.updated_at.slice(0, 10),
        ]
          .map(csvCell)
          .join(","),
      );
    }
    lines.push("");
    lines.push(csvCell(`Exported from AI Linc on ${ymd(todayStart())}, ${rows.length} applications.`));
    return lines.join("\n");
  },

  // ── Screening questions ──────────────────────────────────────────────────

  /** A bare array. The create form does `getQuestions().then(setQuestionBank)`. */
  "GET /jobs-v2/api/admin/questions/": () => allQuestions(),

  "POST /jobs-v2/api/admin/questions/": (req) => {
    const payload = body(req);
    const text = String(payload.question_text ?? "").trim();
    if (!text) throw badRequest({ error: "A question needs some text." });
    const options = Array.isArray(payload.options)
      ? payload.options.map((option) => String(option)).filter(Boolean)
      : undefined;
    return addQuestion({
      question_text: text,
      question_type: payload.question_type ? String(payload.question_type) : undefined,
      is_required: Boolean(payload.is_required),
      order: Number.isFinite(Number(payload.order)) ? Number(payload.order) : undefined,
      options,
    });
  },

  /**
   * Bulk import from a CSV.
   *
   * Actually parses the visitor's file rather than reporting a made-up count:
   * the questions it creates are the ones in their spreadsheet, and they appear
   * in the bank on the same screen. Columns are
   * `question_text, question_type, is_required, options` with options separated
   * by a pipe, and a header row is detected and skipped.
   */
  "POST /jobs-v2/api/admin/questions/import/": async (req) => {
    const file = uploadedFile(req.body);
    if (!file) throw badRequest({ error: "No file was received." });

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) throw badRequest({ error: "That file has no rows in it." });

    const first = splitCsvLine(lines[0])[0]?.toLowerCase() ?? "";
    const rows = first === "question_text" || first === "question" ? lines.slice(1) : lines;

    const created: JobQuestion[] = [];
    rows.forEach((line, index) => {
      const [question, type, required, options] = splitCsvLine(line);
      if (!question) return;
      created.push(
        addQuestion({
          question_text: question,
          question_type: type || "text",
          is_required: TRUTHY.has((required ?? "").toLowerCase()),
          order: allQuestions().length + index + 1,
          options: options ? options.split("|").map((option) => option.trim()).filter(Boolean) : undefined,
        }),
      );
    });

    if (created.length === 0) throw badRequest({ error: "No questions could be read from that file." });
    return { created: created.length };
  },

  // ── The learner's side of the loop ───────────────────────────────────────

  /**
   * The learner's own applications.
   *
   * Same records the admin queue reads, so a stage the placement team moves
   * shows up on the learner's card, which is the whole point of the module.
   */
  "GET /jobs-v2/api/applications/me/": () => {
    const rows = myApplications();
    return { results: rows, count: rows.length };
  },

  /**
   * Confirm an external application.
   *
   * Applying through the recruiting body's own portal leaves the row as
   * `applying` until the aspirant says they finished, which is what this flips.
   *
   * This comment used to claim no seeded posting carried an `apply_link`, which
   * was true of the software tenant and is false here: every recruitment
   * notification in `db/jobs.ts` (TGPSC, TGLPRB, SCCL, SSC, RRB, IBPS, SBI, RBI,
   * BHEL) carries the recruiting body's own portal, because that portal is where
   * a government application is actually filed. So this dialog is on the normal
   * path for ten of the fifteen postings, not an edge case reachable only after
   * an administrator pastes a link. The vocational openings carry no link and run
   * the in-app apply wizard instead.
   *
   * The links are rendered as `href`s and never fetched, so the offline rule
   * still holds.
   */
  "PATCH /jobs-v2/api/applications/me/:applicationId/confirm-applied/": (req) => {
    const id = Number(req.params.applicationId);
    const current = applicationById(id);
    if (!current) throw notFound("Application not found");
    const updated = patchApplication(id, { status: "applied" });
    if (!updated) throw notFound("Application not found");
    return updated;
  },
});
