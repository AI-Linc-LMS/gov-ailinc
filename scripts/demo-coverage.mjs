/**
 * Endpoint coverage: what the app can call vs what the demo answers.
 *
 * Crawling only finds GETs that a page fires on load. Every write — create a
 * course, post a reply, submit an assessment, resolve a ticket — is behind a
 * click, so a clean crawl says nothing about whether those work. This reads the
 * call sites straight out of `lib/services/**` instead, so a handler that was
 * never written shows up whether or not anyone clicked the button.
 *
 * Matching is deliberately loose about ids (`${...}` -> `:param`) and strict
 * about method and shape, because the failure this exists to catch is a handler
 * written against a path the app never actually requests.
 *
 * Usage: node scripts/demo-coverage.mjs [--json out.json]
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

/** `/x/${a}/y/` -> `/x/:p/y/` so a template and a route pattern can be compared. */
function normalize(u) {
  return u
    .replace(/\$\{[^}]*\}/g, ":p")
    .replace(/\{[^}]*\}/g, ":p")
    .replace(/\/\d+(?=\/|$)/g, "/:p")
    .replace(/\?.*$/, "")
    .replace(/\/+$/, "/")
    .trim();
}

// --- what the app calls --------------------------------------------------
// Services are the main surface, but a few call sites live in hooks and
// components; include anything that imports the shared client.
const CANDIDATE_DIRS = ["lib/services", "lib/hooks", "lib/utils", "components", "app"];
const serviceFiles = CANDIDATE_DIRS
  .map((d) => path.join(ROOT, d))
  .filter((d) => fs.existsSync(d))
  .flatMap((d) => walk(d));

const calls = new Map(); // "METHOD /path" -> Set(files)

const CALL_RE =
  /apiClient\s*\.\s*(get|post|put|patch|delete)\s*(?:<[^>]*>)?\s*\(\s*(`[^`]+`|"[^"]+"|'[^']+')/g;

for (const file of serviceFiles) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(CALL_RE)) {
    const method = m[1].toUpperCase();
    const raw = m[2].slice(1, -1);
    if (!raw.startsWith("/")) continue;
    const key = `${method} ${normalize(raw)}`;
    if (!calls.has(key)) calls.set(key, new Set());
    calls.get(key).add(path.relative(ROOT, file));
  }
}

// --- what the demo answers ----------------------------------------------
const handlerFiles = walk(path.join(ROOT, "lib/demo/http/handlers"));
const routes = new Set();
const ROUTE_RE = /^\s*"(GET|POST|PUT|PATCH|DELETE)\s+([^"]+)"\s*:/gm;
for (const file of handlerFiles) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(ROUTE_RE)) {
    routes.add(`${m[1]} ${normalize(m[2].replace(/:[A-Za-z_]+/g, ":p"))}`);
  }
}

// --- diff ----------------------------------------------------------------
/**
 * A call site whose URL is built across several lines leaks a raw `${` into the
 * key, because this reads source text rather than running it. Those are noise,
 * not gaps, and a gate that reports two permanent failures is a gate people stop
 * reading. They are counted separately so the signal stays honest either way.
 */
const missing = [];
const unparseable = [];
for (const [key, files] of calls) {
  if (routes.has(key)) continue;
  (key.includes("${") ? unparseable : missing).push({ key, files: [...files] });
}
missing.sort((a, b) => a.key.localeCompare(b.key));

const byMethod = missing.reduce((acc, m) => {
  const meth = m.key.split(" ")[0];
  acc[meth] = (acc[meth] || 0) + 1;
  return acc;
}, {});

console.log(`call sites found:   ${calls.size}`);
console.log(`routes registered:  ${routes.size}`);
console.log(`UNANSWERED:         ${missing.length}  ${JSON.stringify(byMethod)}`);
if (unparseable.length) {
  console.log(`(${unparseable.length} call site(s) build their URL across lines and cannot be checked statically)`);
}
console.log();
for (const m of missing) {
  console.log(`  ${m.key}`);
  console.log(`      ${m.files.join(", ")}`);
}

const out = process.argv.includes("--json")
  ? process.argv[process.argv.indexOf("--json") + 1]
  : null;
if (out) {
  fs.writeFileSync(out, JSON.stringify({ missing, calls: [...calls.keys()], routes: [...routes] }, null, 1));
  console.log(`\nwrote ${out}`);
}
process.exitCode = missing.length ? 1 : 0;
