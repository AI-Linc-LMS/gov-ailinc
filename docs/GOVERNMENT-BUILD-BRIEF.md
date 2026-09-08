# Government LMS build brief

This repository is `gov-ailinc`: the AI Linc LMS prototype, re-skinned and re-contented as a
**state government skilling and employment platform**. It is a fork of `ailinc-demo`, which is
itself the production frontend with its data transport swapped for an in-browser fake backend
(`lib/demo/`). Nothing here talks to a server.

**This file is the single source of truth for every content decision.** Anyone (human or agent)
authoring content in this repo reads this first and does not invent competing names, ids or
slugs. If something is missing here, add it here first, then build it.

---

## 1. The tenant

| Field | Value |
|---|---|
| Name | Telangana Skills & Employment Mission |
| Short name | TSEM |
| Slug | `tsem` |
| Client id | `101` (unchanged; the demo transport pins it) |
| Timezone | `Asia/Kolkata` |
| Support email | `support@tsem.gov.in` |
| Demo password | `Telangana@2026` |
| localStorage key | `tsem-gov-demo-state-v1` |
| Login slogan | `Skills for every district. A career for every aspirant.` |

TSEM is a **fictional** state mission, in the same way `ailinc-demo`'s "Meridian Institute" was
fictional: a prospect evaluating the platform should see what *their own* department's instance
would look like. Say so in the README. Do not reproduce the emblem, seal, logo or exact name of
any real government body.

### Personas

The `DemoPersona.key` values (`student` / `instructor` / `admin`) are load-bearing across the
app and **must not change**. Only the labels, emails and blurbs change.

| key | Email | Label | What they are here |
|---|---|---|---|
| `student` | `aspirant@tsem.gov.in` | Aspirant | A candidate preparing for a government job, or a trainee on a vocational course |
| `instructor` | `faculty@tsem.gov.in` | Faculty | A subject faculty member or a skill-centre trainer |
| `admin` | `admin@tsem.gov.in` | Programme Officer | Runs the mission: centres, batches, notifications, reporting |

Vocabulary used across the product: **aspirant / trainee** (not "student" in prose), **faculty /
trainer** (not "instructor" in prose), **skill centre**, **district**, **mandal**, **batch**,
**notification** (a recruitment advertisement), **scheme**.

---

## 2. Sections and categories — the headline structure

The catalogue is organised in **two sections**, each holding **two categories**. These four
slugs are fixed. Every course carries exactly one `section` and one `category`.

```
Government Job Related Courses            (section slug: govt-jobs)
├── State (Telangana), Central & PSU Jobs (category slug: state-central-psu)
└── Banking & Financial Sector Jobs       (category slug: banking)

Skill Development & Entrepreneurship      (section slug: skills-entrepreneurship)
├── Rural Employment Generation           (category slug: rural-employment-vocational)
│   (vocational trades)
└── Rural Entrepreneurship & Development  (category slug: rural-entrepreneurship)
```

### The contract (do not deviate)

`lib/demo/db/courses.ts` owns the taxonomy and exports it:

```ts
export type CourseSectionSlug = "govt-jobs" | "skills-entrepreneurship";
export type CourseCategorySlug =
  | "state-central-psu"
  | "banking"
  | "rural-employment-vocational"
  | "rural-entrepreneurship";

export interface CourseCategory {
  slug: CourseCategorySlug;
  title: string;          // "Banking & Financial Sector Jobs"
  blurb: string;          // one line, shown under the category heading
  icon: string;           // mdi:… iconify name
  section: CourseSectionSlug;
}

export interface CourseSection {
  slug: CourseSectionSlug;
  title: string;          // "Government Job Related Courses"
  blurb: string;
  icon: string;
  accent: string;         // hex, used for the section rule and chips
}

export const COURSE_SECTIONS: readonly CourseSection[];
export const COURSE_CATEGORIES: readonly CourseCategory[];
export function categoryOf(slug: CourseCategorySlug): CourseCategory;
```

`DemoCourse` gains two fields: `section: CourseSectionSlug` and `category: CourseCategorySlug`.

The adaptive-courses handler (`lib/demo/http/handlers/adaptive-courses.ts`) emits them on every
list item, plus the human-readable labels, so the UI never has to re-derive them:

```ts
section: course.section,
section_title: "Government Job Related Courses",
category: course.category,
category_title: "Banking & Financial Sector Jobs",
```

`AdaptiveCourseListItem` in `lib/services/adaptive-course.service.ts` gains the same four fields,
all **optional** (`section?`, `section_title?`, `category?`, `category_title?`), so any surface
that has not been taught about them still compiles and renders.

Icons: `mdi:bank-outline` (state/central/PSU), `mdi:cash-multiple` (banking),
`mdi:hammer-wrench` (vocational), `mdi:store-outline` (entrepreneurship),
`mdi:office-building-outline` (govt-jobs section), `mdi:sprout-outline`
(skills-entrepreneurship section).

Section accents: `govt-jobs` → `#6366f1`, `skills-entrepreneurship` → `#10b981`.

---

## 3. The catalogue

19 courses, ids `301`–`319`. **Ids, slugs, section and category below are fixed.** Titles may be
polished but not repurposed.

### Numbering rules (so parallel authors never collide)

- **Course id**: as listed below.
- **Topic id**: `courseId * 100 + n`, where `n` is 1-based across the whole course, counting
  topics in module order. Course 301 → `30101, 30102, …`. Max 99 topics per course.
- **Module id**: `courseId * 1000 + moduleIndex` (1-based). Course 301 → `301001, 301002, …`.
- Curriculum file: `lib/demo/db/curriculum/course-<id>.ts`, keyed by topic id, registered in
  `lib/demo/db/curriculum/index.ts`.
- Quiz bank: `lib/demo/db/quiz-bank.ts`, keyed by course id.

### Section 1 — Government Job Related Courses (`govt-jobs`)

#### Category: State (Telangana), Central & PSU Jobs (`state-central-psu`)

| id | Title | slug | Difficulty | Hours | Enrolled | Accent |
|---|---|---|---|---|---|---|
| 301 | TGPSC Group-I: Prelims, Mains & Interview | `tgpsc-group-1` | Advanced | 132 | no | `#6366f1` → `#a855f7` |
| 302 | TGPSC Group-II & Group-III Foundation | `tgpsc-group-2-3` | Intermediate | 96 | **yes, ~62%** | `#4f46e5` → `#0ea5e9` |
| 303 | SSC CGL & CHSL: Tier-I and Tier-II | `ssc-cgl-chsl` | Intermediate | 88 | no | `#0ea5e9` → `#22d3ee` |
| 304 | RRB NTPC & Group-D: Railway Recruitment | `rrb-ntpc-group-d` | Beginner | 62 | no | `#0891b2` → `#14b8a6` |
| 305 | Telangana Police: Constable & SI (TGLPRB) | `telangana-police-constable-si` | Intermediate | 74 | no | `#334155` → `#0ea5e9` |
| 306 | PSU Recruitment through GATE | `psu-recruitment-gate` | Advanced | 68 | no | `#7c3aed` → `#4f46e5` |

#### Category: Banking & Financial Sector Jobs (`banking`)

| id | Title | slug | Difficulty | Hours | Enrolled | Accent |
|---|---|---|---|---|---|---|
| 307 | IBPS PO & Clerk: Prelims and Mains | `ibps-po-clerk` | Intermediate | 84 | **yes, ~38%** | `#059669` → `#0ea5e9` |
| 308 | SBI PO & SBI Clerk | `sbi-po-clerk` | Intermediate | 78 | no | `#0d9488` → `#22d3ee` |
| 309 | RBI Grade-B & NABARD Grade-A | `rbi-grade-b-nabard` | Advanced | 92 | no | `#1d4ed8` → `#7c3aed` |
| 310 | Banking Awareness, Economy & Current Affairs | `banking-awareness-economy` | Beginner | 40 | no | `#f59e0b` → `#f43f5e` |

### Section 2 — Skill Development & Entrepreneurship (`skills-entrepreneurship`)

#### Category: Rural Employment Generation — vocational trades (`rural-employment-vocational`)

| id | Title | slug | Difficulty | Hours | Enrolled | Accent |
|---|---|---|---|---|---|---|
| 311 | Solar PV Installer & Rooftop Technician | `solar-pv-installer` | Beginner | 46 | **yes, ~84%** | `#f59e0b` → `#f97316` |
| 312 | Electrician & Domestic Wiring (ITI-aligned) | `electrician-domestic-wiring` | Beginner | 52 | no | `#eab308` → `#f97316` |
| 313 | Tailoring, Garment Making & Boutique Skills | `tailoring-garment-making` | Beginner | 42 | no | `#ec4899` → `#f43f5e` |
| 314 | Mobile Phone & Consumer Electronics Repair | `mobile-electronics-repair` | Beginner | 44 | no | `#14b8a6` → `#0ea5e9` |
| 315 | Digital Literacy & Common Service Centre Operator | `digital-literacy-csc-operator` | Beginner | 36 | no | `#8b5cf6` → `#38bdf8` |

#### Category: Rural Entrepreneurship & Development (`rural-entrepreneurship`)

| id | Title | slug | Difficulty | Hours | Enrolled | Accent |
|---|---|---|---|---|---|---|
| 316 | Start Your Rural Micro-Enterprise | `rural-micro-enterprise` | Beginner | 38 | **yes, ~15%** | `#10b981` → `#84cc16` |
| 317 | Access to Finance: MUDRA, SHG Linkage & Subsidies | `access-to-finance-mudra-shg` | Intermediate | 34 | no | `#16a34a` → `#0ea5e9` |
| 318 | Farmer Producer Organisations: Formation & Management | `fpo-formation-management` | Intermediate | 40 | no | `#65a30d` → `#22c55e` |
| 319 | Digital Marketing & ONDC for Rural Businesses | `digital-marketing-ondc` | Beginner | 36 | no | `#a855f7` → `#ec4899` |

### Course shape rules

- **6 to 8 modules** per course, **3 to 5 topics** per module, 16–28 topics total. Exam courses
  sit at the higher end, vocational courses at the lower.
- Content kinds per topic: `article`, `quiz`, `assignment` only. **No `coding` and no `video`.**
  There is no code judge in this product line, and a coding card on a tailoring course is the
  single most obvious way to reveal that the content was ported from a software LMS.
- `dueInDays: null` on every course. The journey board runs unlocked and promises no deadlines.
- `certificateThreshold`: exam courses 70, vocational 60, entrepreneurship 65.
- Progress: only the four enrolled courses carry non-zero topic progress, front-loaded (early
  modules 100, the current module partial, later modules 0) so `deriveCompletion` lands near the
  percentage in the table above. Everything else is 0.
- `enrolledCount` in the hundreds-to-low-thousands (this is a state mission, not a bootcamp),
  ratings 4.3–4.9 with plausible rating counts.
- Every course needs a real `subtitle`, a 3–4 sentence `description` written for the aspirant it
  serves, and 4–6 `tags` (e.g. `["TGPSC", "Group-II", "Telangana History", "General Studies"]`).

---

## 4. Content standards

Everything on screen is read word for word by the officials being shown this. Filler is worse
than an empty state.

1. **Accurate to the real exam or trade.** TGPSC Group-II really does have four papers; IBPS PO
   Prelims really is 100 marks in 60 minutes with sectional timing; a rooftop solar string really
   is sized against inverter MPPT voltage limits. If a fact is uncertain, write the teaching point
   without the number rather than inventing the number.
2. **Never state a live exam date, vacancy count, fee or cut-off as current fact.** Notification
   dates in the seed are relative to today (`daysAhead(n)`) and clearly framed as a demo
   calendar. Syllabus structure is stable and safe to teach; year-specific figures are not.
3. **House style** (carried over from the AI Linc content pipeline, and it is strict):
   - **No em dashes.** Use a comma, a full stop, or a spaced hyphen.
   - Indian English spelling (`organisation`, `programme`, `enrolment`).
   - `₹` with Indian digit grouping (`₹1,20,000`), `acre`/`quintal` where a trade uses them.
   - Second person for instruction ("you size the array"), never "we will now learn".
   - No exclamation marks, no motivational filler, no "In today's fast-paced world".
4. **Four reading tiers must genuinely differ.** `Beginner` assumes a 10th-standard reader with
   no exam background and explains vocabulary; `Intermediate` is the default teaching voice;
   `Advanced` assumes a repeat attempter and goes at strategy, traps and marginal marks;
   `Expert` is for the candidate in the last month, all recall scaffolds, tables and edge cases.
   Rendering the same prose four times is the failure mode this structure exists to prevent.
5. **Quizzes teach.** Every MCQ explanation says why the right answer is right *and* why the
   attractive wrong one is wrong. Four options, exactly one correct.
6. **No Telugu script in v1.** The bundled typeface (Satoshi) has no Telugu glyphs and the demo
   must run offline, so Telugu text would render as tofu boxes on a machine without a Telugu
   system font. Bilingual copy is a follow-up that needs a bundled Noto Sans Telugu.

---

## 5. People, places and employers

- Roster names are predominantly Telugu-speaking (Telangana), with other Indian names present.
  Real people are not depicted; these are characters.
- The `college` field on `DemoPerson` keeps its name (it is read in many places) but now holds
  the aspirant's **institution or skill centre**: `Government Polytechnic, Warangal`,
  `ITI Nizamabad`, `Osmania University`, `Kakatiya University, Warangal`,
  `TSEM Skill Centre, Khammam`, `Government Degree College, Siddipet`.
- Districts to draw on: Hyderabad, Rangareddy, Warangal, Karimnagar, Khammam, Nizamabad,
  Nalgonda, Mahbubnagar, Adilabad, Siddipet, Sangareddy, Suryapet, Jagtial, Bhadradri
  Kothagudem, Mancherial, Nirmal, Wanaparthy, Vikarabad.
- Employers in the jobs module are recruiting bodies and public undertakings: TGPSC, SSC, IBPS,
  SBI, RBI, NABARD, RRB Secunderabad, TGLPRB, Singareni Collieries (SCCL), TGGENCO / TGTRANSCO,
  BHEL Hyderabad, ECIL, NMDC, Mission Bhagiratha, GHMC, plus private employers who hire from the
  vocational tracks (a solar EPC firm, a garment unit, an FPO, a service franchise).
- Headlines on profiles read like aspirants: `TGPSC Group-II aspirant, 2nd attempt`,
  `Solar PV trainee, Warangal centre`, `SHG member starting a millet processing unit`.

---

## 6. What must not change

- Every exported symbol name, type name and function signature in `lib/` and `components/`,
  unless this brief explicitly says otherwise. This is a re-content, not a rewrite: the whole
  point is that the government instance is the same product.
- The demo transport contract: handlers return data, throw `notFound()` / `badRequest()` /
  `unauthorized()` / `forbidden()` from `../types`, and register through `defineRoutes`.
- Determinism: no `Math.random()`, no `Date.now()` in seeds. Use `seededInt` / `seededPick` /
  `seededSample` from `lib/demo/random.ts` and the relative helpers in `lib/demo/clock.ts`.
- The offline rule: no new remote asset hosts. Course covers may use the existing
  `images.unsplash.com` pattern **only** where `courseArt()` remains the documented fallback.
- Feature flags in `lib/demo/db/tenant.ts` stay switched on, except where this brief removes a
  module that has no meaning for this tenant.
