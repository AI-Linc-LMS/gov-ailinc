/**
 * The mutation overlay: everything the visitor changes during a demo.
 *
 * Design note — why this is separate from the seed, and why only *this* half is
 * persisted. Seed data is regenerated from scratch on every load so its dates
 * stay relative to today (see `lib/demo/clock.ts`); persisting it would freeze
 * the calendar and, a month later, the "upcoming" live session would render in
 * the past. But a prospect who submits a quiz, posts to the community or edits
 * their profile must see that stick across a reload, or the prototype reads as
 * fake. So: seed is pure and ephemeral, visitor changes are an overlay on top,
 * and only the overlay goes to localStorage.
 *
 * The overlay is deliberately a loose key-value bag rather than a typed mirror
 * of the whole schema. It only ever holds the handful of things a visitor can
 * actually change in a demo session, and keeping it untyped means adding a new
 * interactive surface never requires a migration.
 */

import { DEMO_STORAGE_KEY } from "../config";

type OverlayData = Record<string, unknown>;

let data: OverlayData = {};
let loaded = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

/** Subscribers notified after any change, so React surfaces can re-render. */
const listeners = new Set<() => void>();

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Load persisted changes. No-op on the server: SSR always renders the pristine
 * seed, and the browser reconciles once it hydrates. That is intentional —
 * reading a visitor's overlay during SSR is impossible anyway (it lives in their
 * localStorage), so the server render is defined to be the "fresh demo" state.
 */
function ensureLoaded(): void {
  if (loaded || !isBrowser()) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) data = JSON.parse(raw) as OverlayData;
  } catch {
    // Corrupt or unreadable overlay: start clean rather than break the demo.
    data = {};
  }
}

/** Debounced so a burst of writes (e.g. typing) costs one serialization. */
function schedulePersist(): void {
  if (!isBrowser()) return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota exceeded or private-browsing storage denial. The demo keeps
      // working from memory; only cross-reload persistence is lost.
    }
  }, 150);
}

function notify(): void {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* a bad subscriber must not break the write */
    }
  });
}

export const overlay = {
  /** Read a value, or `fallback` when the visitor has not changed it. */
  get<T>(key: string, fallback: T): T {
    ensureLoaded();
    return key in data ? (data[key] as T) : fallback;
  },

  /** Whether the visitor has written this key at all. */
  has(key: string): boolean {
    ensureLoaded();
    return key in data;
  },

  set<T>(key: string, value: T): T {
    ensureLoaded();
    data[key] = value;
    schedulePersist();
    notify();
    return value;
  },

  /** Read-modify-write in one step. */
  update<T>(key: string, fallback: T, fn: (current: T) => T): T {
    return overlay.set(key, fn(overlay.get(key, fallback)));
  },

  /** Append to a list-valued key, newest last. */
  push<T>(key: string, item: T): T[] {
    return overlay.update<T[]>(key, [], (list) => [...list, item]);
  },

  /** Prepend to a list-valued key — the common case for feeds and posts. */
  unshift<T>(key: string, item: T): T[] {
    return overlay.update<T[]>(key, [], (list) => [item, ...list]);
  },

  remove(key: string): void {
    ensureLoaded();
    delete data[key];
    schedulePersist();
    notify();
  },

  /**
   * Wipe every visitor change and return to the pristine demo.
   *
   * Exposed in the UI so a salesperson can reset between calls without clearing
   * site data by hand, and so a prospect who has clicked around cannot leave the
   * next viewer looking at their half-finished quiz.
   */
  reset(): void {
    data = {};
    loaded = true;
    if (isBrowser()) {
      try {
        window.localStorage.removeItem(DEMO_STORAGE_KEY);
      } catch {
        /* nothing to do */
      }
    }
    notify();
  },

  /** True when the visitor has changed anything at all. */
  isDirty(): boolean {
    ensureLoaded();
    return Object.keys(data).length > 0;
  },

  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/**
 * Monotonic ids for records the visitor creates (a new ticket, a new post).
 *
 * Starts high so a generated id can never collide with a seeded one, and the
 * counter itself lives in the overlay so ids stay unique across reloads.
 */
export function nextDemoId(scope: string): number {
  const key = `__seq:${scope}`;
  return overlay.update<number>(key, 900_000, (n) => n + 1);
}
