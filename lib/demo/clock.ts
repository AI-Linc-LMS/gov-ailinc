/**
 * Time helpers for demo seed data.
 *
 * A demo that ships fixed calendar dates rots: three weeks after we build it the
 * "upcoming" live session is in the past and the streak calendar ends mid-month.
 * So every date in the seed is expressed RELATIVE to today and computed at read
 * time — the demo is permanently "current" without anyone maintaining it.
 *
 * All anchors round to start-of-day so a server render and the browser render
 * that hydrates it agree (they run at different instants, but almost always on
 * the same day). Only use `nowMs()` for values the UI is allowed to see change.
 *
 * Hours are TENANT wall-clock, not UTC — see `daysAgo`.
 */

import { DEMO_TENANT } from "./config";

/** Start of today, UTC. Stable across a session and across server/client. */
export function todayStart(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Live wall clock. Only for things that may legitimately differ per render. */
export function nowMs(): number {
  return Date.now();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Minutes the tenant zone runs ahead of UTC at the given instant.
 *
 * Derived through Intl rather than hard-coded, so it stays right for a tenant in
 * a zone that observes DST. Asia/Kolkata does not, but the seed should not be the
 * thing that breaks if the demo tenant ever moves.
 */
function tenantOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DEMO_TENANT.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asIfUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asIfUtc - at.getTime() * 1) / 60_000);
}

/**
 * `days` before today (negative for the future), at the given hour/minute in the
 * TENANT's zone.
 *
 * The hour used to be interpreted as UTC, which is not what any caller meant: a
 * seed saying `hour: 18` means an evening class, and every one of them rendered
 * at 11:30 PM for this Asia/Kolkata tenant because the page formats in the tenant
 * zone. Converting here fixes all of them at once and matches what the call sites
 * already read as.
 */
export function daysAgo(days: number, hour = 9, minute = 0): Date {
  const base = todayStart().getTime() - days * DAY_MS;
  const wallClock = base + hour * 3600_000 + minute * 60_000;
  return new Date(wallClock - tenantOffsetMinutes(new Date(wallClock)) * 60_000);
}

/** `days` after today, at the given hour/minute in the tenant's zone. */
export function daysAhead(days: number, hour = 9, minute = 0): Date {
  return daysAgo(-days, hour, minute);
}

/** `minutes` before now. For rows that must read as happening *right now*. */
export function minutesAgo(minutes: number): Date {
  return new Date(nowMs() - minutes * 60_000);
}

export function hoursAgo(hours: number): Date {
  return new Date(todayStart().getTime() + (24 - hours) * 3600_000 - DAY_MS);
}

/** ISO-8601 string, the format every endpoint in this app returns. */
export function iso(d: Date): string {
  return d.toISOString();
}

/** `YYYY-MM-DD`, used by streak calendars and date-only filters. */
export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isoDaysAgo(days: number, hour = 9, minute = 0): string {
  return iso(daysAgo(days, hour, minute));
}

export function isoDaysAhead(days: number, hour = 9, minute = 0): string {
  return iso(daysAhead(days, hour, minute));
}

/**
 * Date-only variants, for fields the API declares as a DateField.
 *
 * Not interchangeable with the `iso*` pair. Callers slice these by character
 * offset — the cohort card renders `start_date.slice(5)` to get "MM-DD" — so
 * handing them a full timestamp printed "04-08T09:00:00.000Z" on the card.
 */
export function ymdDaysAgo(days: number): string {
  return ymd(daysAgo(days));
}

export function ymdDaysAhead(days: number): string {
  return ymd(daysAhead(days));
}

/** Inclusive list of `YYYY-MM-DD` for the last `count` days, oldest first. */
export function lastNDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => ymd(daysAgo(count - 1 - i)));
}

/** The calendar month containing today, as `{ year, month }` with month 1-12. */
export function currentMonth(): { year: number; month: number } {
  const d = todayStart();
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

/** Number of days in the given 1-12 month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
