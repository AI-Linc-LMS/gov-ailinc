/**
 * Handler registry.
 *
 * Importing a handler module is what registers its routes, so every module must
 * be listed here — a handler file nobody imports is a page that silently renders
 * empty. Modules are added here phase by phase as the demo is built out.
 */

import "./accounts";
import "./activity";
import "./adaptive-courses";
import "./assessments";
import "./jobs";
import "./community";
import "./live-sessions";
import "./mock-interview";
import "./instructor";
import "./admin";
import "./tickets";
import "./notifications";
import "./details";
import "./client";
import "./coding";
import "./content";
import "./courses";
import "./dashboard";
import "./journey";
import "./progression";
import "./quiz";

/**
 * Write-side coverage, one module per owning service.
 *
 * Split out from the read handlers above rather than folded into them for a
 * practical reason: a crawl only ever exercises GETs a page fires on load, so
 * every create/update/delete in the product went unimplemented and unnoticed
 * until `scripts/demo-coverage.mjs` diffed the service call sites against the
 * router. These modules close that gap, and keeping them separate keeps the
 * boundary legible — if a button does nothing, its handler belongs here.
 */
import "./community-actions";
import "./course-builder";
import "./assessment-admin";
import "./jobs-admin";
import "./ticket-actions";
import "./account-actions";
import "./interview-actions";
import "./misc-actions";

/** Imported for its side effects only; nothing to export. */
export {};
