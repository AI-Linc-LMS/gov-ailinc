# gov-ailinc

A working, frontend-only build of the AI Linc LMS, re-skinned and re-contented as a
**state government skilling and employment platform**. Hand over a URL and a login, and an
officer can explore the whole platform on their own.

It is not a mockup and not a rewrite. It is the production frontend
(`lms-platform-frontend`) with its **data transport swapped for an in-browser fake
backend**. Every screen, interaction, animation and design detail is the real product,
because it *is* the real product. Only the server is gone.

```
git clone https://github.com/AI-Linc-LMS/gov-ailinc.git
cd gov-ailinc
npm install
npm run dev          # → http://localhost:3000
```

No `.env`, no backend, no database.

Every content decision lives in [`docs/GOVERNMENT-BUILD-BRIEF.md`](docs/GOVERNMENT-BUILD-BRIEF.md):
tenant identity, the section and category slugs, course ids, the id numbering rules and the
content standards. It is the single source of truth. Read it before authoring anything, and
add to it rather than inventing a competing name or id.

---

## The tenant

The demo runs as the **Telangana Skills & Employment Mission (TSEM)**, which is **fictional**.
It is invented for the same reason this repo's predecessor invented "Meridian Institute": a
department evaluating the platform should see what *its own* instance would look like rather
than the vendor's. Being fictional also keeps the build clear of any real body's name, emblem
or seal. The mark is an original device, three ascending arches on a common plinth, and is not
derived from the national emblem, the state emblem or the lion capital.

| Field | Value |
|---|---|
| Name | Telangana Skills & Employment Mission |
| Short name | TSEM |
| Slug | `tsem` |
| Client id | `101`, pinned in `lib/demo/config.ts` |
| Timezone | `Asia/Kolkata` |
| Support address | `support@tsem.gov.in` |

The vocabulary the product uses throughout: **aspirant** or **trainee** rather than student,
**faculty** or **trainer** rather than instructor, **skill centre**, **district**, **batch**,
**notification** for a recruitment advertisement, and **scheme**.

### Signing in

| Role | Email | Password |
|---|---|---|
| Aspirant | `aspirant@tsem.gov.in` | `Telangana@2026` |
| Faculty | `faculty@tsem.gov.in` | `Telangana@2026` |
| Programme Officer | `admin@tsem.gov.in` | `Telangana@2026` |

The sign-in screen offers one-click access for each, so nobody has to type a password in a
review meeting. Any other person on the roster (see `lib/demo/db/people.ts`) can also sign in
with the same password, which is how you show one *particular* aspirant's view mid-demo.

Sign-in is a real gate: a wrong password returns a real 401 and the real error message.

---

## The catalogue

The catalogue is organised in **two sections**, each holding **two categories**. Every course
carries exactly one of each, and these four slugs are fixed.

| Section | Category | Holds |
|---|---|---|
| Government Job Related Courses<br>`govt-jobs` | State (Telangana), Central & PSU Jobs<br>`state-central-psu` | TGPSC Group services, SSC, railway recruitment, state police, PSU recruitment through GATE |
| | Banking & Financial Sector Jobs<br>`banking` | IBPS, SBI, RBI and NABARD, plus banking awareness and economy |
| Skill Development & Entrepreneurship<br>`skills-entrepreneurship` | Rural Employment Generation<br>`rural-employment-vocational` | Vocational trades: solar PV, electrician work, tailoring, electronics repair, digital literacy |
| | Rural Entrepreneurship & Development<br>`rural-entrepreneurship` | Starting a micro-enterprise, access to finance, producer organisations, digital marketing |

`lib/demo/db/courses.ts` owns the taxonomy and exports it; the brief fixes each course's id,
slug, section and category, along with the id rules that let several people author curriculum
files in parallel without colliding. `scripts/verify-catalogue.mjs` and
`scripts/verify-curriculum.mjs` are the gates on that: they check the ids follow the rule and
that authored content is real rather than a fallback.

**There is no code judge in this product line.** Topics are articles, quizzes and assignments,
never coding problems, and the mock-interview module is switched off in `lib/demo/db/tenant.ts`
because it opens a code editor. A coding card on a tailoring course is the most obvious way to
reveal that a build was ported from a software LMS.

Notification dates in the seed are relative to today and framed as a demo calendar. Nothing on
screen states a live exam date, vacancy count, fee or cut-off as current fact.

---

## How it works

The production app funnels every API call through a single `axios.create()` instance in
`lib/services/api.ts`. That is the only seam this build needs:

```
components / app  →  lib/services/*.service.ts  →  apiClient  →  ✂ demo adapter  →  lib/demo/
                     (60+ modules, untouched)                     (no network)
```

`installDemoTransport()` replaces the adapter. Requests are matched against a route table and
answered from seed data, with real HTTP semantics and real AxiosErrors, so interceptors,
loading skeletons, retries and error toasts all behave exactly as they do against production.

**Nothing in `app/`, `components/` or `lib/services/` is modified to support demo mode.** Only
three call sites are aware it exists, each marked `DEMO REPO ONLY`.

### Layout

| Path | Purpose |
|---|---|
| `lib/demo/config.ts` | Tenant identity, personas, credentials, latency |
| `lib/demo/db/tenant.ts` | Logos, feature flags, certificate signatory |
| `lib/demo/http/adapter.ts` | The axios adapter (the seam) |
| `lib/demo/http/router.ts` | Specificity-ordered path matching |
| `lib/demo/http/handlers/` | Endpoint implementations, one file per module |
| `lib/demo/db/` | Seed data: people, profiles, courses, jobs |
| `lib/demo/db/curriculum/` | Authored lesson content, one file per course, keyed by topic id |
| `lib/demo/db/overlay.ts` | Visitor changes, persisted to localStorage |
| `lib/demo/clock.ts` | Relative dates, so the demo never goes stale |
| `lib/demo/random.ts` | Seeded PRNG, so numbers never change between reloads |
| `public/logos/` | The TSEM lockups and marks |

### Two rules that keep the demo believable

**Seed data is regenerated on every load; only visitor changes are persisted.** Dates are
expressed relative to today (`daysAhead(3)`, not a literal date), so an upcoming live session
is still upcoming a year from now. If the seed were persisted, the calendar would freeze on
first visit.

**Nothing random is actually random.** `Math.random()` and `Date.now()` in seeds would mean an
officer screenshots a 78% score and sees 41% after a refresh, and would break server/client
hydration. All fixture values come from a seeded PRNG keyed on a stable string.

### What it does and does not fetch

| Was | Now |
|---|---|
| API calls to the LMS backend | Served in-browser by the demo adapter |
| Satoshi from `api.fontshare.com` | Self-hosted in `public/fonts` (`npm run build:fonts`) |
| Icons from `api.iconify.design` | Bundled locally into `lib/demo/icons/bundle.json` (`npm run build:icons`) |
| OpenTelemetry span export | Disabled in demo mode, and its SDK never loads |
| 90-260ms simulated latency | Zero. Navigation is instant |

That matters because this gets shown in meeting rooms on unfamiliar networks. A webfont that
arrives late, or icons that pop in one by one, is the most visible way for a prototype to look
unfinished. The interface renders completely with the network unplugged.

Two remote asset hosts remain, both for photography only: course covers from
`images.unsplash.com` and roster portraits from `randomuser.me`. Course covers fall back to
generated gradient art on error, so a blocked network degrades rather than breaks. Do not add
a third host.

The icon bundle is generated by scanning the source for `prefix:name` strings, so **an icon
name used for the first time renders as nothing until `npm run build:icons` is re-run.** Run it
after adding icons and commit the result.

---

## Adding an endpoint

Most services in this codebase catch their own errors and return `[]`, so a **missing handler
renders a silently empty widget** rather than throwing. To make that visible, every unmatched
request is logged and recorded.

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

`__demo.reset()` in the browser console wipes everything the visitor changed and reloads. An
officer who half-finished a quiz cannot leave the next viewer looking at their session.

---

## The lockfile (read before running `npm install`)

`package-lock.json` is committed, and it must contain the **linux-x64** builds of the native
packages (`lightningcss`, `@next/swc`, `@tailwindcss/oxide`, `sharp`, and the rest) or the
Netlify build fails with `Cannot find module '../lightningcss.linux-x64-gnu.node'`.

npm prunes optional platform packages it does not need on the machine doing the install. So
running `npm install` on a Mac quietly strips every Linux entry, with no warning, and
everything still builds locally. `npm run check:lockfile` catches it, and CI runs that check
before anything else.

If it fails, regenerate from a **clean directory** so npm resolves from the registry rather
than from your existing `node_modules`, which is what prunes it:

```bash
mkdir /tmp/lockgen && cp package.json .npmrc /tmp/lockgen/
(cd /tmp/lockgen && npm install --package-lock-only)
cp /tmp/lockgen/package-lock.json .
npm run check:lockfile
```

Regenerating in place does not work: npm rebuilds the lockfile from the pruned tree already on
disk.

---

## Re-branding

`lib/demo/config.ts` holds the tenant name, slug, timezone and personas.
`lib/demo/db/tenant.ts` holds the logos, the login slogan, the certificate signatory and the
enabled feature flags. `public/logos/tsem-*.svg` holds the artwork: a lockup and a mark, each
in colour, white, ink and dark-mode variants, on a 1600x600 and 400x240 canvas respectively.
Changing those files re-skins the entire build.

Note that the platform pins its colour palette for every tenant (see
`lib/theme/normalizeThemeSettings.ts`), so tenant branding is logo, wordmark and copy, not
colours. The `ai-linc-*.svg` files are kept alongside as the geometry reference the TSEM
lockups were built against.

---

## Provenance

This repo is a fork of `ailinc-demo`, which is itself a fork of `lms-platform-frontend`. To
pull in new work from the product, merge upstream and re-run the app: any newly added endpoint
shows up in `__demo.unhandled()`, which is the to-do list for restoring full coverage.

Upstream's own README is preserved at [`docs/UPSTREAM-README.md`](docs/UPSTREAM-README.md).
