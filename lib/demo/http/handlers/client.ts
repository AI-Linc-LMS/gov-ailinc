/**
 * Tenant bootstrap endpoints — the branding, timezone and feature flags the
 * whole app reads on load.
 */

import { defineRoutes } from "../router";
import { clientInfo } from "../../db/tenant";
import { overlay, nextDemoId } from "../../db/overlay";
import { iso, nowMs } from "../../clock";

const MODULE = "client";

defineRoutes(MODULE, {
  "GET /api/clients/:clientId/client-info/": () => clientInfo(),

  /**
   * Report-issue is wired to the support ticket store rather than discarded, so a
   * prospect who files an issue from the help menu then finds it waiting in the
   * admin Tickets queue. That round trip is one of the more convincing things the
   * demo can show, and it costs one overlay write.
   */
  "POST /api/clients/:clientId/report-issue/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const ticket = {
      id: nextDemoId("ticket"),
      subject: String(body.subject ?? "Reported issue"),
      description: String(body.description ?? ""),
      issue_type: String(body.issue_type ?? "other"),
      screenshot_url: body.screenshot_url ? String(body.screenshot_url) : null,
      page_url: body.page_url ? String(body.page_url) : null,
      status: "open",
      priority: "medium",
      created_at: iso(new Date(nowMs())),
      raised_by: req.auth
        ? { id: req.auth.userId, email: req.auth.email }
        : null,
    };
    overlay.unshift("tickets:new", ticket);
    return { detail: "Your issue has been reported. Our team will be in touch." };
  },
});
