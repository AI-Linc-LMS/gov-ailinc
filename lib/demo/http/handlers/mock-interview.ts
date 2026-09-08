/**
 * AI mock interviews, read side.
 *
 * A spread of states: two completed with a full scored transcript to read, one
 * scheduled, and a per-course interview waiting on every enrolled course. The
 * completed ones carry real feedback, because "you scored 78" tells a prospect
 * nothing about the product; the paragraph explaining *why* is what an institution
 * is buying.
 *
 * Every projection here comes out of the store in `interview-actions.ts`, which is
 * also what the start/answer/submit routes write to. That direction matters: when the
 * list and the detail built their own fixtures independently, an interview a visitor
 * had just submitted appeared in "Previous interviews" with the seed's score and then
 * opened onto a result page that had never heard of it.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import {
  adminTemplates,
  allAttempts,
  attemptById,
  attemptDetail,
  attemptToApi,
  pendingTemplates,
} from "./interview-actions";

const MODULE = "mock-interview";

defineRoutes(MODULE, {
  "GET /mock-interview/api/clients/:clientId/mock-interviews/": (req) => {
    const status = req.query.get("status");
    return allAttempts()
      // "failed" attempts are ones the candidate backed out of at the device check.
      // They are worth keeping for the admin's records and worth hiding from the
      // learner, who would otherwise see a row they can neither open nor retake.
      .filter((a) => a.status !== "failed")
      .filter((a) => !status || a.status === status)
      .map(attemptToApi);
  },

  "GET /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/": (req) => {
    const found = attemptById(Number(req.params.interviewId));
    if (!found) throw notFound("Interview not found");
    return attemptDetail(found);
  },

  /** Course interviews this learner has not finished yet. */
  "GET /mock-interview/api/clients/:clientId/interview-templates/pending/": () => pendingTemplates(),

  /**
   * The admin catalogue. Same path, different audience: the student surfaces read
   * `pending/` above, and only the admin templates page reads this one, which is why
   * it returns the full template record rather than the trimmed card shape.
   */
  "GET /mock-interview/api/clients/:clientId/interview-templates/": (req) => {
    const courseId = req.query.get("course_id");
    return adminTemplates(courseId ? Number(courseId) : undefined);
  },
});
