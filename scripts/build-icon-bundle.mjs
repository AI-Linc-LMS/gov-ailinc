#!/usr/bin/env node
/**
 * Bundle the icons this app uses into a local file, so nothing is fetched at runtime.
 *
 * `@iconify/react` resolves unknown icon names by calling api.iconify.design.
 * That is fine for a normal web app and wrong for this one: the demo is shown on
 * conference wifi and hotel networks, and an icon set that arrives late (or not
 * at all) means a prospect watches the interface assemble itself. It is also the
 * last runtime dependency on anything outside the browser.
 *
 * This scans the source for icon names, pulls just those from the installed
 * @iconify-json packages, and writes a trimmed collection. The output is
 * COMMITTED, so a deploy needs no extra build step and the bundle cannot drift
 * silently at install time.
 *
 * Re-run after adding icons:  npm run build:icons
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["app", "components", "lib", "hooks"];
const OUT = join(ROOT, "lib/demo/icons/bundle.json");

/** Every `prefix:name` that looks like an Iconify id, from all source files. */
function collectIconNames() {
  const found = new Set();
  // Matches "mdi:account-outline" wherever it appears: JSX props, config
  // objects, and the page-guide registry all reference icons as bare strings.
  const pattern = /["'`]([a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g;

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "node_modules" || entry === ".next") continue;
        walk(full);
        continue;
      }
      if (![".ts", ".tsx"].includes(extname(full))) continue;
      const source = readFileSync(full, "utf8");
      for (const match of source.matchAll(pattern)) found.add(match[1]);
    }
  }

  for (const dir of SCAN_DIRS) walk(join(ROOT, dir));
  return found;
}

function loadCollection(prefix) {
  try {
    const path = join(ROOT, "node_modules", `@iconify-json/${prefix}/icons.json`);
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

const names = collectIconNames();
const byPrefix = new Map();
for (const id of names) {
  const [prefix, name] = id.split(":");
  if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set());
  byPrefix.get(prefix).add(name);
}

const bundle = {};
let included = 0;
let missing = 0;

for (const [prefix, wanted] of byPrefix) {
  const collection = loadCollection(prefix);
  // A prefix with no installed package is not an error: the scan is deliberately
  // greedy and matches strings like "image/svg+xml" shaped ids that are not icons.
  if (!collection) continue;

  const icons = {};
  for (const name of wanted) {
    // Aliases point at another icon; resolve so the bundle is self-contained.
    const resolved = collection.aliases?.[name]?.parent ?? name;
    const icon = collection.icons?.[resolved];
    if (!icon) {
      missing++;
      continue;
    }
    icons[name] = icon;
    included++;
  }

  if (Object.keys(icons).length === 0) continue;
  bundle[prefix] = {
    prefix,
    icons,
    width: collection.width,
    height: collection.height,
  };
}

writeFileSync(OUT, JSON.stringify(bundle));
const sizeKb = Math.round(Buffer.byteLength(JSON.stringify(bundle)) / 1024);
console.log(
  `[icons] bundled ${included} icons across ${Object.keys(bundle).length} set(s), ${sizeKb} KB -> lib/demo/icons/bundle.json` +
    (missing ? ` (${missing} scanned names were not real icons and were skipped)` : ""),
);
