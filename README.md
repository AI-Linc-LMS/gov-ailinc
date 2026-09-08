# AI Linc — Interactive Product Demo

A fully working, **frontend-only** prototype of the AI Linc LMS, built for showing the
product to prospective institutions. Hand over a URL and a login, and the prospect can
explore the entire platform on their own.

It is not a mockup and not a rebuild. It is the production frontend
(`lms-platform-frontend`) with its **data transport swapped for an in-browser fake
backend**. Every screen, interaction, animation and design detail is the real product,
because it *is* the real product — only the server is gone.

```
git clone git@github.com:AI-Linc-LMS/ailinc-demo.git
cd ailinc-demo
npm install
npm run dev          # → http://localhost:3000
```

No `.env`, no backend, no database. It runs offline.

### Genuinely offline, genuinely instant

The demo makes **no network requests at all** once the page has loaded. Not to a backend,
not to a CDN. Verified by blocking every non-local host in the browser and confirming the
app still renders with the correct typeface, every icon, and full content.

| Was | Now |
|---|---|
| API calls to the LMS backend | Served in-browser by the demo adapter |
| Satoshi from `api.fontshare.com` | Self-hosted in `public/fonts` (`npm run build:fonts`) |
| Icons from `api.iconify.design` | 656 icons bundled locally (`npm run build:icons`) |
| OpenTelemetry span export | Disabled in demo mode, and its SDK never loads |
| 90-260ms simulated latency | Zero. Navigation is instant |

That matters because this gets shown on conference wifi and in hotel meeting rooms. A
webfont that arrives late, or icons that pop in one by one, is the most visible way for a
prototype to look unfinished.

---

## Signing in

The demo runs as a fictional customer, **Meridian Institute of Technology**, so a
prospect sees what their own branded instance would look like rather than ours.

| Role | Email | Password |
|---|---|---|
| Student | `student@meridian.edu` | `Meridian@2026` |
| Instructor | `instructor@meridian.edu` | `Meridian@2026` |
| Administrator | `admin@meridian.edu` | `Meridian@2026` |

The sign-in screen offers one-click access for each, so nobody has to type a password
on a call. Any other person on the roster (see `lib/demo/db/people.ts`) can also sign in
with the same password — useful for showing a *specific* student's view mid-demo.

Sign-in is a real gate: a wrong password returns a real 401 and the real error message.

---

## How it works

The production app funnels every API call through a single `axios.create()` instance in
`lib/services/api.ts`. That is the only seam this demo needs:

```
components / app  →  lib/services/*.service.ts  →  apiClient  →  ✂ demo adapter  →  lib/demo/
                     (60+ modules, untouched)                     (no network)
```

`installDemoTransport()` replaces the adapter. Requests are matched against a route table
and answered from seed data, with realistic latency, real HTTP semantics and real
AxiosErrors — so interceptors, loading skeletons, retries and error toasts all behave
exactly as they do against production.

**Nothing in `app/`, `components/` or `lib/services/` is modified to support demo mode.**
Only three call sites are aware it exists, each marked `DEMO REPO ONLY`.

### Layout

| Path | Purpose |
|---|---|
| `lib/demo/config.ts` | Tenant identity, personas, credentials, latency |
| `lib/demo/http/adapter.ts` | The axios adapter (the seam) |
| `lib/demo/http/router.ts` | Specificity-ordered path matching |
| `lib/demo/http/handlers/` | Endpoint implementations, one file per module |
| `lib/demo/db/` | Seed data: people, profiles, tenant, courses… |
| `lib/demo/db/overlay.ts` | Visitor changes, persisted to localStorage |
| `lib/demo/clock.ts` | Relative dates, so the demo never goes stale |
| `lib/demo/random.ts` | Seeded PRNG, so numbers never change between reloads |

### Two rules that keep the demo believable

**Seed data is regenerated on every load; only visitor changes are persisted.** Dates are
expressed relative to today (`daysAhead(3)`, not `2026-08-09`), so an "upcoming" live
session is still upcoming a year from now. If we persisted the seed, the calendar would
freeze on first visit.

**Nothing random is actually random.** `Math.random()` and `Date.now()` in seeds would
mean a prospect screenshots a 78% score and sees 41% after a refresh — and would break
server/client hydration. All fixture values come from a seeded PRNG keyed on a stable
string.

---

## Adding an endpoint

Most services in this codebase catch their own errors and return `[]`, so a **missing
handler renders a silently empty widget** rather than throwing. To make that visible,
every unmatched request is logged and recorded.

In the browser console:

```js
__demo.unhandled()   // endpoints the app asked for that nothing answers
__demo.routes()      // everything currently served
__demo.reset()       // wipe visitor changes, reload the pristine demo
```

To fill a gap, add a handler and register the module in
`lib/demo/http/handlers/index.ts`:

```ts
defineRoutes("live-sessions", {
  "GET /live-class/api/clients/:clientId/sessions/": (req) => upcomingSessions(),
});
```

Handlers return data directly. Throw `notFound()`, `badRequest()`, `unauthorized()` or
`forbidden()` from `../types` to produce a real error response.

---

## Resetting between demos

`__demo.reset()` in the console, or the reset control in the UI, wipes everything the
visitor changed and reloads. A prospect who half-finished a quiz cannot leave the next
viewer looking at their session.

---

## The lockfile (read before running `npm install`)

`package-lock.json` is committed, and it must contain the **linux-x64** builds of the
native packages (`lightningcss`, `@next/swc`, `@tailwindcss/oxide`, `sharp`, …) or the
Netlify build fails with `Cannot find module '../lightningcss.linux-x64-gnu.node'`.

npm prunes optional platform packages it does not need on the machine doing the install.
So running `npm install` on a Mac quietly strips every Linux entry — no warning, and
everything still builds locally. `npm run check:lockfile` catches it, and CI runs that
check before anything else.

If it fails, regenerate from a **clean directory** so npm resolves from the registry
rather than from your existing `node_modules` (which is what prunes it):

```bash
mkdir /tmp/lockgen && cp package.json .npmrc /tmp/lockgen/
(cd /tmp/lockgen && npm install --package-lock-only)
cp /tmp/lockgen/package-lock.json .
npm run check:lockfile
```

Regenerating in place does not work — npm rebuilds the lockfile from the pruned tree
already on disk.

---

## Re-branding

`lib/demo/config.ts` holds the tenant name, slug, timezone and personas;
`lib/demo/db/tenant.ts` holds the logos and enabled feature flags. Changing those two
files re-skins the entire demo.

Note the platform pins its colour palette for every tenant (see
`lib/theme/normalizeThemeSettings.ts`), so tenant branding is logo, wordmark and copy —
not colours.

---

## Keeping up with the real product

This repo is a fork of `lms-platform-frontend`. To pull in new work, merge upstream and
re-run the app: any newly added endpoint shows up in `__demo.unhandled()`, which is the
to-do list for restoring full coverage.

Upstream's own README is preserved at [`docs/UPSTREAM-README.md`](docs/UPSTREAM-README.md).
