/**
 * The learner's assessment hub.
 *
 * Deliberately a mix of states: one open, one already submitted with a report to
 * open, one scheduled for a future window, one proctored. A hub where every card
 * says "Start" shows the button but not the lifecycle, and the lifecycle is most
 * of what an institution is buying.
 *
 * The cards themselves are projected from the catalogue in `assessment-admin.ts`
 * rather than restated here. This file used to hold a parallel copy, and the two
 * drifted the moment either side changed: the hub advertised 45 questions over a
 * paper that had 17, and the "completed" badge came from a different record than
 * the report behind it.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import { allAssessments, assessmentBy, learnerAssessmentApi } from "./assessment-admin";

const MODULE = "assessments";

/** Drafts are authoring state; a learner must never see one on the hub. */
function visibleToLearners() {
  return allAssessments().filter((a) => !a.isDraft);
}

defineRoutes(MODULE, {
  "GET /assessment/api/client/:clientId/active-assessments/": () =>
    visibleToLearners().map(learnerAssessmentApi),

  "GET /assessment/api/client/:clientId/assessments/": () =>
    visibleToLearners().map(learnerAssessmentApi),

  "GET /assessment/api/client/:clientId/assessments/:slug/": (req) => {
    const found = assessmentBy(req.params.slug);
    if (!found) throw notFound("Assessment not found");
    return learnerAssessmentApi(found);
  },
});
