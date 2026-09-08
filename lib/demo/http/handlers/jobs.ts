/**
 * The learner's jobs board.
 *
 * Real Indian employers and realistic postings, because this is the module that
 * answers "what does my student actually get out of this" — and a board of
 * "Company A / Company B" undercuts that answer immediately.
 *
 * The postings themselves now live in `lib/demo/db/jobs.ts`, shared with the
 * admin list, the admin detail and the applications queue. They used to be a
 * literal in this file, which is how the board and the admin table came to
 * disagree about how many jobs exist.
 *
 * Eligibility is modelled rather than assumed: some roles are open, several have
 * already been applied to, one is closed. A board where every card says "Apply"
 * hides the lifecycle an institution is buying.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  allJobs,
  createApplication,
  jobById,
  myApplications,
  toStudentJob,
  toggleFavourite,
} from "../../db/jobs";
import { savedResumeById } from "../../db/resumes";

const MODULE = "jobs";

defineRoutes(MODULE, {
  /**
   * The legacy jobs board (`/jobs`), which predates jobs-v2 and is still routed.
   *
   * It serves the SAME rows as the v2 board rather than a second seed. The two
   * pages were showing different worlds: /jobs was empty with an error toast
   * while /jobs-v2 listed six roles, and a prospect who found the old link
   * concluded the module was broken. One source, two presentations.
   */
  "GET /jobs/api/getjobs/": (req) => {
    const search = (req.query.get("search") ?? "").toLowerCase();
    const jobType = req.query.get("job_type") ?? "";
    const list = allJobs()
      .filter((job) => job.is_published)
      .filter(
        (job) =>
          !search ||
          job.job_title.toLowerCase().includes(search) ||
          job.company_name.toLowerCase().includes(search),
      )
      .filter((job) => !jobType || job.job_type === jobType)
      .map(toStudentJob);
    return { results: list, count: list.length, next: null, previous: null };
  },

  "GET /jobs-v2/api/jobs/": (req) => {
    const search = (req.query.get("search") ?? "").toLowerCase();
    const location = (req.query.get("location") ?? "").toLowerCase();
    const jobType = req.query.get("job_type") ?? "";
    const employmentType = req.query.get("employment_type") ?? "";

    // Drafts are admin-only. Publishing a job is a real decision in this product
    // and the board is where it has to show, or the toggle means nothing.
    const list = allJobs()
      .filter((job) => job.is_published)
      .filter(
        (job) =>
          !search ||
          job.job_title.toLowerCase().includes(search) ||
          job.company_name.toLowerCase().includes(search) ||
          job.key_skills.some((skill) => skill.toLowerCase().includes(search)),
      )
      .filter((job) => !location || job.location.toLowerCase().includes(location))
      .filter((job) => !jobType || job.job_type === jobType)
      .filter((job) => !employmentType || job.employment_type === employmentType)
      .map(toStudentJob);

    return { results: list, count: list.length };
  },

  "GET /jobs-v2/api/jobs/:jobId/": (req) => {
    const job = jobById(Number(req.params.jobId));
    if (!job) throw notFound("Job not found");
    return toStudentJob(job);
  },

  /**
   * Apply.
   *
   * Writes a real application, which is what makes the rest of the module true:
   * it appears in the learner's applied list, in the admin queue for that job,
   * and in the CSV export. Returning `{id, status}` alone was enough for the
   * toast and nothing else, so the application the visitor had just submitted
   * existed nowhere.
   *
   * `external` applications land as `applying` and wait for the learner to
   * confirm they finished on the employer's own site.
   */
  "POST /jobs-v2/api/jobs/:jobId/apply/": (req) => {
    const job = jobById(Number(req.params.jobId));
    if (!job) throw notFound("Job not found");

    const payload = (req.body ?? {}) as {
      resume_url?: string;
      saved_resume_id?: number;
      external?: boolean;
    };
    const saved = payload.saved_resume_id ? savedResumeById(Number(payload.saved_resume_id)) : undefined;
    const application = createApplication({
      jobId: job.id,
      status: payload.external ? "applying" : "applied",
      // A saved resume keeps the persona's own document; an uploaded one has no
      // stored copy in this preview, so the persona document stands in for it.
      resumeUrl: saved ? undefined : payload.resume_url,
    });
    if (!application) throw notFound("Job not found");
    return { id: application.id, status: application.status };
  },

  /**
   * Favourite toggle.
   *
   * The key is `favorited`. Both call sites read `res.favorited` and this used
   * to answer `is_favourited`, so the heart always snapped back to empty however
   * many times it was clicked.
   */
  "POST /jobs-v2/api/jobs/:jobId/favorite/": (req) => {
    const id = Number(req.params.jobId);
    if (!jobById(id)) throw notFound("Job not found");
    const favorited = toggleFavourite(id);
    return {
      favorited,
      is_favourited: favorited,
      message: favorited ? "Saved to your shortlist" : "Removed from your shortlist",
    };
  },

  /** Legacy path for the learner's applications. `/applications/me/` is current. */
  "GET /jobs-v2/api/applications/": () => {
    const rows = myApplications();
    return { results: rows, count: rows.length };
  },
});
