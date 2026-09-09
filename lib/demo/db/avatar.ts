/**
 * Deterministic, self-contained avatars.
 *
 * A demo full of grey initials placeholders reads as unfinished, but bundling
 * real photographs means licensing questions and a heavier repo — and pulling
 * them from a CDN means the demo breaks on a conference-room network with no
 * internet. So avatars are generated as inline SVG data URIs: colourful, stable
 * per person, and available offline.
 *
 * The hue is derived from the name, so the same person is always the same colour
 * everywhere they appear — leaderboard, community thread, cohort roster.
 */

import { makeRng } from "../random";

/** Up to two initials from a display name. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Palette tuned to sit beside the platform's purple without competing with it.
 * Each entry is a [from, to] gradient pair.
 */
const AVATAR_GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ["#1b4f8a", "#1b4f8a"],
  ["#3f8f9e", "#1b4f8a"],
  ["#4a7fbb", "#1b4f8a"],
  ["#2f9159", "#1b4f8a"],
  ["#c9903a", "#b45309"],
  ["#c94b4b", "#991b1b"],
  ["#3f8f9e", "#0b5260"],
  ["#85aad6", "#14406f"],
  ["#2f9159", "#0b6232"],
  ["#85aad6", "#1b4f8a"],
];

function encodeSvg(svg: string): string {
  // encodeURIComponent (not base64) keeps the URI readable in devtools and is
  // shorter for markup this small.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

/**
 * Free portrait photos, used as the actual profile picture for everyone.
 *
 * randomuser.me serves these specifically as free placeholder portraits, which
 * is why they are safe to point at rather than hosting our own. They are remote
 * URLs by request, so avatars do need connectivity — everything else in the demo
 * still runs with the network unplugged, and a portrait that fails to load falls
 * back to the initials avatar below rather than breaking the layout.
 *
 * The pool is treated as ANONYMOUS: a person is mapped to a photo by hashing
 * their name across the whole pool. Photos are never picked from a person's name
 * in any other way — inferring anything about someone from their name is exactly
 * the assumption worth avoiding, and a hash sidesteps it entirely.
 */
const PORTRAIT_POOL: readonly string[] = [
  ...Array.from({ length: 30 }, (_, i) => `https://randomuser.me/api/portraits/men/${i}.jpg`),
  ...Array.from({ length: 30 }, (_, i) => `https://randomuser.me/api/portraits/women/${i}.jpg`),
];

/**
 * The portrait for an authored slot such as "women/12".
 *
 * Preferred over `portraitFor` everywhere a person is part of the seed, because
 * the seed author chose that photo for that character. `portraitFor` remains for
 * anyone created at runtime, who has no authored portrait to use.
 */
export function portraitAt(slot: string): string {
  return `https://randomuser.me/api/portraits/${slot}.jpg`;
}

/** A stable portrait for a person, the same one everywhere they appear. */
export function portraitFor(name: string): string {
  const rng = makeRng(`portrait:${name}`);
  return PORTRAIT_POOL[Math.floor(rng() * PORTRAIT_POOL.length)];
}

/**
 * A stable generated avatar data-URI.
 *
 * Still used as the fallback when a portrait cannot load (offline, or the host
 * is unreachable), and for organisations via companyLogoFor.
 */
export function avatarFor(name: string, size = 96): string {
  const rng = makeRng(`avatar:${name}`);
  const [from, to] = AVATAR_GRADIENTS[Math.floor(rng() * AVATAR_GRADIENTS.length)];
  const initials = initialsOf(name);
  // Unique gradient id per avatar: duplicate ids across inlined SVGs would make
  // every avatar on the page adopt whichever gradient the browser resolved first.
  const id = `av${Math.floor(rng() * 1e9).toString(36)}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size}" fill="url(#${id})"/>
      <text x="50%" y="50%" dy="0.35em" text-anchor="middle"
            font-family="Satoshi, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="${Math.round(size * 0.38)}" font-weight="600" fill="#ffffff">${initials}</text>
    </svg>`;

  return encodeSvg(svg);
}

/** Square logo mark for an organisation (used by job listings and cohorts). */
export function companyLogoFor(name: string, size = 96): string {
  const rng = makeRng(`company:${name}`);
  const [from, to] = AVATAR_GRADIENTS[Math.floor(rng() * AVATAR_GRADIENTS.length)];
  const initials = initialsOf(name);
  const id = `co${Math.floor(rng() * 1e9).toString(36)}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#${id})"/>
      <text x="50%" y="50%" dy="0.35em" text-anchor="middle"
            font-family="Satoshi, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="${Math.round(size * 0.36)}" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>`;

  return encodeSvg(svg);
}
