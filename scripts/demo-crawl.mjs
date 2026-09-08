/**
 * Dead-end crawler for the demo.
 *
 * Signs in as a persona, walks a list of routes, and reports what a prospect
 * would actually hit. It exists because the two cheap checks both lie:
 *
 *   - `__demo.unhandled()` misses wrong-SHAPED responses, which crash the route.
 *   - "the page returned 200" misses a page that rendered an empty state.
 *
 * So this records, per route: whether it crashed, whether it redirected, which
 * endpoints went unanswered, how much text actually rendered, whether the body
 * is one of the known empty-state phrasings, and every in-app link the page
 * offers (so a second pass can prove those destinations are real too).
 *
 * Usage:
 *   node scripts/demo-crawl.mjs --persona student --routes /a,/b [--json out.json]
 *   node scripts/demo-crawl.mjs --persona admin --routes-file list.txt
 *   node scripts/demo-crawl.mjs --persona student --routes /x --click   (also click things)
 */

import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.DEMO_BASE ?? "http://localhost:4000";
const PASSWORD = "AiLinc@2026";
const PERSONAS = {
  student: "student@ailinc.com",
  instructor: "instructor@ailinc.com",
  admin: "admin@ailinc.com",
};

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}
const has = (name) => process.argv.includes(`--${name}`);

const persona = arg("persona", "student");
const email = PERSONAS[persona];
if (!email) throw new Error(`unknown persona: ${persona}`);

const routes = arg("routes-file")
  ? fs.readFileSync(arg("routes-file"), "utf8").split("\n").map((s) => s.trim()).filter(Boolean)
  : (arg("routes") ?? "/dashboard").split(",").map((s) => s.trim()).filter(Boolean);

/**
 * Phrases that mean "this page rendered, but there is nothing on it".
 *
 * Deliberately specific. An earlier version matched the bare word "empty" and
 * flagged the courses page, because a course description says "from an empty
 * folder to a deployed URL" — a marker loose enough to hit prose is worse than
 * no marker, since it buries the real findings.
 */
const EMPTY_MARKERS = [
  "no results found", "nothing here yet", "nothing yet", "no data available",
  "no courses", "no assessments", "no jobs", "no sessions", "no tickets",
  "no notifications", "no submissions", "no students", "no cohorts",
  "no email jobs", "no interviews", "no certificates", "no badges",
  "no questions", "no problems", "no articles", "no recordings",
  "coming soon", "check back later", "get started by", "nothing to show",
  "no activity yet", "you have not", "you haven't", "is empty",
];
const CRASH_MARKERS = [
  "something went wrong", "application error", "unhandled runtime",
  "page not found", "this page could not be found",
  "failed to load", "couldn't load", "could not load", "unable to load",
  "error loading",
];

const results = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

/** Endpoints nothing answered, and page errors, collected per route. */
let unhandled = new Set();
let pageErrors = new Set();
let failedRequests = new Set();

// Misses are read from `window.__demo.unhandled()` after each route, NOT from
// console warnings: the warning is compiled out of a production build, so a
// console-only crawl of the shipping bundle reports zero misses on a page full
// of them.
/** Same route arrives from two sources; keep one canonical form. */
const normalizeMiss = (s) => s.split(" — ")[0].split("\n")[0].trim();

page.on("console", (m) => {
  const t = m.text();
  if (t.includes("No handler for")) unhandled.add(normalizeMiss(t.replace(/^.*No handler for /, "")));
});
page.on("pageerror", (e) => pageErrors.add(String(e.message).slice(0, 160)));
page.on("requestfailed", (r) => {
  const u = r.url();
  if (!u.startsWith("data:") && !u.includes("localhost:4000")) failedRequests.add(u.slice(0, 120));
});

// --- sign in -------------------------------------------------------------
/**
 * Sign in, and prove it worked.
 *
 * This is not defensive padding. A crawl whose session has quietly dropped
 * reports every route as clean, because it is measuring the login page over and
 * over — which is exactly how a previous sweep of this app came back green on
 * pages that were broken. So: assert after signing in, re-check before every
 * route, and abort loudly rather than emit a reassuring lie.
 */
async function signIn(attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    // Poll rather than assert once. Several crawlers share one server, and under
    // that load the redirect can land after a fixed wait expires — which reads
    // as an auth failure when it is only slowness.
    for (let t = 0; t < 40; t++) {
      if (!/\/login/.test(page.url())) break;
      await page.waitForTimeout(500);
    }
    if (/\/login/.test(page.url())) continue;
    await page.waitForTimeout(800);
    // Dismiss the welcome modal so it does not cover every page we then measure.
    const skip = page.getByRole("button", { name: /I'll explore on my own/i }).first();
    if (await skip.isVisible().catch(() => false)) await skip.click().catch(() => {});
    await page.waitForTimeout(400);
    return true;
  }
  return false;
}

if (!(await signIn())) {
  console.error(`FATAL: could not sign in as ${email} — refusing to crawl and report false greens.`);
  await browser.close();
  process.exit(2);
}

// --- walk ----------------------------------------------------------------
for (const route of routes) {
  unhandled = new Set();
  pageErrors = new Set();
  failedRequests = new Set();

  let status = 0;
  const t0 = Date.now();
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
    status = resp?.status() ?? 0;
  } catch (e) {
    results.push({ route, fatal: String(e).slice(0, 140) });
    continue;
  }
  // Let client fetches settle. The transport is in-browser, so this is fast.
  await page.waitForTimeout(1600);
  const ms = Date.now() - t0;

  // Bounced to login means the session expired mid-crawl. Re-auth and retry once,
  // rather than recording the login page as this route's content.
  if (/\/login/.test(page.url()) && route !== "/login") {
    if (!(await signIn())) {
      console.error("FATAL: session lost mid-crawl and re-auth failed.");
      break;
    }
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1600);
  }

  const info = await page.evaluate(() => {
    const text = document.body.innerText || "";
    const links = [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/") && !h.startsWith("//"));
    const buttons = [...document.querySelectorAll("button")]
      .map((b) => (b.innerText || "").trim().split("\n")[0])
      .filter((t) => t && t.length < 40);
    // Images that resolved to nothing are a visible dead end on their own.
    const brokenImgs = [...document.querySelectorAll("img")]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => (i.getAttribute("src") || "").slice(0, 100));
    return {
      text,
      chars: text.length,
      links: [...new Set(links)],
      buttons: [...new Set(buttons)],
      brokenImgs: [...new Set(brokenImgs)],
      title: document.title,
    };
  });

  // Authoritative miss list for this route, straight from the adapter's registry.
  const missed = await page.evaluate(() => {
    const d = window.__demo;
    if (!d?.unhandled) return null;
    const rows = d.unhandled().map((r) => r.route);
    return rows;
  }).catch(() => null);
  if (missed) missed.forEach((r) => unhandled.add(normalizeMiss(r)));

  const lower = info.text.toLowerCase();
  const landed = new URL(page.url()).pathname;
  const crashHits = CRASH_MARKERS.filter((m) => lower.includes(m));
  const emptyHits = EMPTY_MARKERS.filter((m) => lower.includes(m));

  results.push({
    route,
    landed,
    redirected: landed !== route,
    status,
    ms,
    chars: info.chars,
    crash: crashHits,
    empty: emptyHits,
    // A page that renders under ~600 chars of text is a shell with no content,
    // even when it does not print an empty-state string.
    thin: info.chars < 600,
    unhandled: [...unhandled],
    pageErrors: [...pageErrors],
    failedRequests: [...failedRequests],
    brokenImgs: info.brokenImgs,
    links: info.links,
    buttons: info.buttons.slice(0, 40),
    excerpt: info.text.replace(/\n{2,}/g, "\n").slice(0, 700),
  });

  // --- optional: click things and see if they lead anywhere --------------
  if (has("click")) {
    const clickable = info.buttons.filter(
      (b) => !/^(log ?out|sign ?out|delete|remove|reset|clear)/i.test(b),
    );
    const clicked = [];
    for (const label of clickable.slice(0, 14)) {
      try {
        const before = page.url();
        const btn = page.getByRole("button", { name: label, exact: true }).first();
        if (!(await btn.isVisible().catch(() => false))) continue;
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(900);
        const after = page.url();
        const body = await page.evaluate(() => document.body.innerText.toLowerCase());
        const dialog = await page.locator('[role="dialog"]').first().isVisible().catch(() => false);
        const broke = CRASH_MARKERS.filter((m) => body.includes(m));
        clicked.push({
          label,
          navigated: after !== before ? new URL(after).pathname : null,
          openedDialog: dialog,
          crash: broke,
          inert: after === before && !dialog,
        });
        // Return to the route so the next click starts from the same place.
        if (after !== before) {
          await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(900);
        } else if (dialog) {
          await page.keyboard.press("Escape").catch(() => {});
          await page.waitForTimeout(350);
        }
      } catch {
        /* a button that cannot be clicked is reported by absence, not by throwing */
      }
    }
    results[results.length - 1].clicked = clicked;
  }
}

await browser.close();

const out = arg("json");
if (out) {
  fs.writeFileSync(out, JSON.stringify({ persona, results }, null, 1));
  console.log(`wrote ${out} (${results.length} routes)`);
}

// Human-readable summary, so a run is useful without opening the JSON.
console.log(`\n=== ${persona} — ${results.length} routes ===`);
for (const r of results) {
  if (r.fatal) { console.log(`FATAL  ${r.route}  ${r.fatal}`); continue; }
  const flags = [];
  if (r.crash.length) flags.push(`CRASH[${r.crash.join("|")}]`);
  if (r.redirected) flags.push(`REDIR->${r.landed}`);
  if (r.thin) flags.push(`THIN(${r.chars})`);
  else if (r.empty.length) flags.push(`EMPTY[${r.empty.slice(0, 2).join("|")}]`);
  if (r.unhandled.length) flags.push(`UNHANDLED(${r.unhandled.length})`);
  if (r.pageErrors.length) flags.push(`JSERR(${r.pageErrors.length})`);
  if (r.brokenImgs.length) flags.push(`IMG(${r.brokenImgs.length})`);
  console.log(`${flags.length ? "!! " : "ok "} ${r.route.padEnd(52)} ${flags.join(" ")}`);
  for (const u of r.unhandled) console.log(`      unhandled: ${u}`);
  for (const e of r.pageErrors) console.log(`      jserror:   ${e}`);
  for (const c of r.clicked ?? []) {
    if (c.crash?.length) console.log(`      click "${c.label}" -> CRASH ${c.crash.join("|")}`);
    else if (c.inert) console.log(`      click "${c.label}" -> nothing happened`);
  }
}
