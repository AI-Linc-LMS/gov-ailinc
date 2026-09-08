/**
 * The notification bell.
 *
 * Read state is persisted, so marking one read (or all of them) actually clears
 * the badge and stays cleared across a reload. A bell whose count never moves is
 * a detail a prospect notices within seconds of clicking it.
 *
 * Every notice is a mission notice: a recruitment notification going live, a
 * class about to start, a mock result, a certificate, a batch allotment, a
 * document the centre is still waiting for. That last one matters more than it
 * looks. Document verification at the centre is the step a real aspirant is most
 * often stuck on, and a notification list that never mentions it is a list
 * written by someone who has not sat in the queue.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import { overlay, nextDemoId } from "../../db/overlay";
import { FACULTY } from "../../db/people";
import { iso, isoDaysAgo, nowMs } from "../../clock";
import type { Notification } from "@/lib/services/notification.service";

const MODULE = "notifications";

interface Seed {
  id: number;
  title: string;
  body: string;
  type: string;
  route: string;
  hoursAgo: number;
}

/**
 * A notification an admin sent during this session, stored with an absolute
 * timestamp rather than an "hours ago" offset. It happened at a real moment the
 * visitor can remember, so it must not drift the way a relative seed does.
 */
interface SentNotification {
  id: number;
  title: string;
  body: string;
  type: string;
  route: string;
  createdAt: string;
}

/**
 * The seeded bell, newest first.
 *
 * `type` is not free text. `NotificationPopover` maps it through
 * `NOTIFICATION_TYPE_CONFIG` to an icon and a colour and falls back to a plain
 * bell for anything it does not recognise, so this seed uses that map's own keys
 * wherever the meaning genuinely matches and accepts the bell where it does not.
 * The seed this replaced used four types the map had never heard of and drew
 * four identical bells.
 *
 * Names come from the roster by reference, never typed in. The 7001 row carried
 * "with Vikram Menon" through a re-content that had already deleted him.
 */
const SEEDS: Seed[] = [
  {
    id: 7001,
    // The hour-before reminder for session 501, which is live by the time a
    // visitor opens the demo. That is the sequence, not a contradiction: the
    // notice went out an hour ago and the class has since started.
    title: "Live class starts in an hour",
    body: `Group-II polity: the amendment procedure, and how the paper asks it, with ${FACULTY[0].full_name}.`,
    type: "live_session",
    route: "/live-sessions?session=501",
    hoursAgo: 1,
  },
  {
    id: 7002,
    title: "New recruitment notification published",
    body:
      "Group-II Services: Assistant Section Officer and allied posts, TGPSC. Open the " +
      "notification for the post list, the eligibility and the last date to apply.",
    type: "job_published",
    route: "/jobs-v2/601",
    hoursAgo: 5,
  },
  {
    id: 7003,
    title: "Your Group-II full-length mock has been graded",
    body:
      "You scored 68%, placing you 12th of 96 in the batch. The result breaks the paper down " +
      "section by section and lists what you left unattempted.",
    type: "assessment_available",
    route: "/assessments",
    hoursAgo: 20,
  },
  {
    id: 7004,
    title: "Certificate issued",
    body:
      "Solar PV Installer and Rooftop Technician. The certificate and its verification code " +
      "are under Credentials.",
    type: "course_completed",
    route: "/credentials",
    hoursAgo: 30,
  },
  {
    id: 7005,
    title: "Batch allotment confirmed",
    body: `Banking Batch B-07, Hyderabad, for IBPS PO and Clerk. Your faculty is ${FACULTY[1].full_name}, and the quantitative aptitude speed drill runs twice a week in the evening.`,
    type: "course_enrolled",
    route: "/live-sessions",
    hoursAgo: 48,
  },
  {
    id: 7006,
    title: "Documents pending at the skill centre",
    body:
      "Two documents are still to be verified at TSEM Skill Centre, Warangal: your residence " +
      "proof and your qualifying certificate. Carry the originals to the centre before the " +
      "next practical.",
    type: "custom",
    route: "/profile",
    hoursAgo: 54,
  },
];

function readIds(): number[] {
  return overlay.get<number[]>("notifications:read", []);
}

function sent(): SentNotification[] {
  return overlay.get<SentNotification[]>("notifications:sent", []);
}

/**
 * Everything in the bell, newest first.
 *
 * Read state is a list of ids, not an "all read" boolean. The boolean version
 * marked every FUTURE notification read too, so a message an admin sent after
 * clicking "mark all read" arrived silently with no badge, the one thing the
 * notifications screen exists to demonstrate.
 */
function feed(): Notification[] {
  const read = new Set(readIds());
  const rows: Notification[] = [
    ...sent().map((s) => toApi(s.id, s.title, s.body, s.type, s.route, s.createdAt)),
    ...SEEDS.map((s) =>
      toApi(s.id, s.title, s.body, s.type, s.route, isoDaysAgo(s.hoursAgo / 24, 12, 0)),
    ),
  ];
  return rows.map((n) => ({ ...n, is_read: read.has(n.id), read: read.has(n.id) }));
}

/**
 * `is_read` is filled in by `feed`; the duplicated `body`/`type`/`route`/`read`
 * keys are a deliberate superset, because the bell menu and the older
 * notification list read different names for the same field.
 */
function toApi(
  id: number,
  title: string,
  body: string,
  type: string,
  route: string,
  createdAt: string,
): Notification & { body: string; type: string; route: string; read: boolean } {
  return {
    id,
    title,
    message: body,
    body,
    notification_type: type,
    type,
    action_url: route,
    route,
    metadata: {},
    is_read: false,
    read: false,
    created_at: createdAt,
  };
}

function unreadCount(): number {
  return feed().filter((n) => !n.is_read).length;
}

/** Mark one notification read and hand back the row as it now reads. */
export function markNotificationRead(id: number): Notification {
  const found = feed().find((n) => n.id === id);
  if (!found) throw notFound("Notification not found");
  overlay.update<number[]>("notifications:read", [], (list) =>
    list.includes(id) ? list : [...list, id],
  );
  // `is_read` only. An earlier version also set `read`, on the theory that the
  // bell and the list used different spellings; grepping both surfaces shows
  // they read `is_read` and nothing reads `read`, and the extra key is not on
  // the Notification type, so it broke the build for a case that cannot occur.
  return { ...found, is_read: true };
}

/**
 * Put a notification in the bell. Used by the admin send screen so a notice the
 * programme officer composes is actually there when they open the bell after.
 */
export function pushNotification(input: {
  title: string;
  message: string;
  type: string;
  actionUrl: string | null;
}): Notification {
  const row: SentNotification = {
    id: nextDemoId("notification"),
    title: input.title,
    body: input.message,
    type: input.type,
    route: input.actionUrl ?? "/dashboard",
    createdAt: iso(new Date(nowMs())),
  };
  overlay.unshift("notifications:sent", row);
  return toApi(row.id, row.title, row.body, row.type, row.route, row.createdAt);
}

function markAllRead(): { detail: string; unread_count: number } {
  const ids = feed().map((n) => n.id);
  overlay.update<number[]>("notifications:read", [], (list) => [
    ...new Set([...list, ...ids]),
  ]);
  return { detail: "All notifications marked as read.", unread_count: 0 };
}

defineRoutes(MODULE, {
  "GET /notification/api/clients/:clientId/notifications/": () => {
    const rows = feed();
    return { results: rows, count: rows.length, unread_count: unreadCount() };
  },

  "GET /notification/api/clients/:clientId/notifications/unread-count/": () => ({
    unread_count: unreadCount(),
    count: unreadCount(),
  }),

  "POST /notification/api/clients/:clientId/notifications/:notificationId/read/": (req) => {
    markNotificationRead(Number(req.params.notificationId));
    return { detail: "Marked as read.", unread_count: unreadCount() };
  },

  "POST /notification/api/clients/:clientId/notifications/mark-all-read/": () =>
    markAllRead(),

  "PATCH /notification/api/clients/:clientId/notifications/mark-all-read/": () =>
    markAllRead(),

  "DELETE /notification/api/clients/:clientId/notifications/:notificationId/": () => ({
    detail: "Notification dismissed.",
    dismissed_at: iso(new Date(nowMs())),
  }),
});
