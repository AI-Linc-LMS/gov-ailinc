/**
 * The notification bell.
 *
 * Read state is persisted, so marking one read (or all of them) actually clears
 * the badge and stays cleared across a reload. A bell whose count never moves is
 * a detail a prospect notices within seconds of clicking it.
 */

import { defineRoutes } from "../router";
import { notFound } from "../types";
import { overlay, nextDemoId } from "../../db/overlay";
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
 * timestamp rather than an "hours ago" offset — it happened at a real moment the
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

const SEEDS: Seed[] = [
  {
    id: 7001,
    title: "Live session starts in an hour",
    body: "Live doubt-clearing: React rendering and effects, with Vikram Menon.",
    type: "live_session",
    route: "/live-sessions",
    hoursAgo: 1,
  },
  {
    id: 7002,
    title: "Your DSA diagnostic has been graded",
    body: "You scored 76%, placing you 7th of 84. Open the result to see the per-section breakdown.",
    type: "assessment",
    route: "/assessments",
    hoursAgo: 20,
  },
  {
    id: 7003,
    title: "Kabir replied to your question",
    body: '"Your left pointer is jumping backwards..." on Sliding window: why is it still O(n)?',
    type: "community",
    route: "/community",
    hoursAgo: 30,
  },
  {
    id: 7004,
    title: "New role matched to your profile",
    body: "Software Engineer I (Backend) at Razorpay. Applications close in 12 days.",
    type: "job",
    route: "/jobs-v2",
    hoursAgo: 48,
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
 * clicking "mark all read" arrived silently with no badge — the one thing the
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
 * Put a notification in the bell. Used by the admin send screen so a message a
 * salesperson composes is actually there when they open the bell afterwards.
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
