/**
 * Interview practice, read side.
 *
 * A spread of states: two finished boards with a full scored transcript to read, one
 * viva scheduled for later this week, and a practice panel waiting on every enrolled
 * course. The finished ones carry real feedback, because "you scored 78" tells an
 * officer evaluating this nothing about the product; the paragraph explaining *why*
 * is what a mission is buying.
 *
 * Nothing here decides anything. Every projection comes out of the store in
 * `interview-actions.ts`, which is also what the start, answer and submit routes
 * write to, including the panels themselves and the local rubric that scores them.
 * That direction matters: when the list and the detail built their own fixtures
 * independently, an interview an aspirant had just submitted appeared in "Previous
 * interviews" with the seed's score and then opened onto a result page that had never
 * heard of it.
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
      // They are worth keeping for the programme officer's records and worth hiding
      // from the aspirant, who would otherwise see a row they can neither open nor
      // retake.
      .filter((a) => a.status !== "failed")
      .filter((a) => !status || a.status === status)
      .map(attemptToApi);
  },

  "GET /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/": (req) => {
    const found = attemptById(Number(req.params.interviewId));
    if (!found) throw notFound("Interview not found");
    return attemptDetail(found);
  },

  /** Course interviews this aspirant has not finished yet. */
  "GET /mock-interview/api/clients/:clientId/interview-templates/pending/": () => pendingTemplates(),

  /**
   * The programme officer's catalogue. Same path, different audience: the aspirant
   * surfaces read `pending/` above, and only the admin templates page reads this one,
   * which is why it returns the full template record rather than the trimmed card
   * shape.
   */
  "GET /mock-interview/api/clients/:clientId/interview-templates/": (req) => {
    const courseId = req.query.get("course_id");
    return adminTemplates(courseId ? Number(courseId) : undefined);
  },
});
