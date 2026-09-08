#!/usr/bin/env node
/**
 * Fail if package-lock.json is missing the Linux binaries Netlify needs.
 *
 * Why this exists: npm prunes optional platform packages it does not need on the
 * machine doing the install. Run `npm install` on a Mac and the lockfile loses
 * every linux-x64 entry — silently, with no warning and no diff you would notice
 * in review. `npm ci` on Netlify then installs no native module at all and the
 * build dies with "Cannot find module '../lightningcss.linux-x64-gnu.node'".
 *
 * That already cost one red deploy. It is invisible locally (macOS builds fine),
 * so the only place to catch it is CI, before the deploy.
 *
 * THE FIX when this fails: regenerate the lockfile from a clean directory so npm
 * resolves from the registry instead of from your existing node_modules, which is
 * what prunes it:
 *
 *   mkdir /tmp/lockgen && cp package.json .npmrc /tmp/lockgen/
 *   (cd /tmp/lockgen && npm install --package-lock-only)
 *   cp /tmp/lockgen/package-lock.json .
 *
 * Regenerating in place does NOT work: npm rebuilds the lockfile from the tree
 * already on disk, which is exactly the pruned one.
 */

import { readFileSync } from "node:fs";

/**
 * Native packages whose Linux build must be in the lockfile. Each entry lists the
 * lockfile paths that satisfy it — gnu or musl is enough, since Netlify only needs
 * the one matching its image.
 */
const REQUIRED = [
  ["lightningcss", ["node_modules/lightningcss-linux-x64-gnu", "node_modules/lightningcss-linux-x64-musl"]],
  ["@next/swc", ["node_modules/@next/swc-linux-x64-gnu", "node_modules/@next/swc-linux-x64-musl"]],
  ["@tailwindcss/oxide", ["node_modules/@tailwindcss/oxide-linux-x64-gnu", "node_modules/@tailwindcss/oxide-linux-x64-musl"]],
  ["sharp", ["node_modules/@img/sharp-linux-x64"]],
  ["esbuild", ["node_modules/@esbuild/linux-x64"]],
  ["rollup", ["node_modules/@rollup/rollup-linux-x64-gnu", "node_modules/@rollup/rollup-linux-x64-musl"]],
];

let lock;
try {
  lock = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
} catch (error) {
  console.error("[lockfile-platforms] Could not read package-lock.json:", error.message);
  process.exit(1);
}

const present = new Set(Object.keys(lock.packages ?? {}));
const missing = REQUIRED.filter(([, paths]) => !paths.some((p) => present.has(p))).map(([name]) => name);

if (missing.length > 0) {
  console.error(
    `\n[lockfile-platforms] package-lock.json has no linux-x64 build for: ${missing.join(", ")}.\n` +
      `A Netlify build with this lockfile will fail at "next build" with a missing native module.\n` +
      `Regenerate the lockfile from a clean directory — see the comment at the top of\n` +
      `scripts/check-lockfile-platforms.mjs for the exact commands.\n`,
  );
  process.exit(1);
}

console.log(`[lockfile-platforms] OK — linux-x64 builds present for all ${REQUIRED.length} native packages.`);
