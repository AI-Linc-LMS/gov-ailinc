/**
 * Demo-mode configuration.
 *
 * This repository is the *government* build of the LMS: the same production
 * frontend, re-skinned and re-contented as a state skilling and employment
 * platform, with its data transport swapped for an in-browser fake backend
 * (see `lib/demo/http/adapter.ts`). Nothing here talks to a server.
 *
 * The audience is a department evaluating the platform, so the tenant below is a
 * fictional state mission rather than the vendor. Officials read what is on
 * screen word for word, so every string in this file is written for them.
 *
 * Because the whole repo exists to run in demo mode, demo mode is ON by default
 * and only turns off if someone explicitly sets NEXT_PUBLIC_DEMO_MODE=false,
 * which is a debugging affordance, not a supported deployment.
 */

/** Demo mode is the default for this repo; opt out only for local debugging. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

/**
 * Tenant id the demo pretends to be. The real app requires NEXT_PUBLIC_CLIENT_ID
 * and refuses to guess (a wrong guess would be a cross-tenant leak against a real
 * backend). There is no backend here, so a fixed id is safe and means the repo
 * clones and runs with no env setup at all.
 */
export const DEMO_CLIENT_ID = 101;

/**
 * The fictional state mission the visitor sees.
 *
 * TSEM does not exist. It is invented in the same way this repo's predecessor
 * invented "Meridian Institute": a department evaluating the platform should see
 * what *its own* instance would look like, and a fictional mission also keeps us
 * clear of any real body's name, emblem or seal. The `.gov.in` addresses below
 * are illustrative and are never sent anywhere, because there is no mail path in
 * demo mode.
 *
 * Changing these values (and the logos in `lib/demo/db/tenant.ts`) re-skins the
 * whole product.
 */
export const DEMO_TENANT = {
  name: "Telangana Skills & Employment Mission",
  shortName: "TSEM",
  slug: "tsem",
  /** IANA zone. Drives live-session times shown across the app. */
  timezone: "Asia/Kolkata",
  supportEmail: "support@tsem.gov.in",
} as const;

/**
 * Credentials handed to a visitor. Roles mirror the real product exactly, so
 * nothing on screen is demo-only: switching role means logging out and back in,
 * the same as production.
 *
 * The password is shared across personas on purpose: one thing to remember in a
 * review meeting, and there is nothing to protect behind it.
 */
export const DEMO_PASSWORD = "Telangana@2026";

export interface DemoPersona {
  key: "student" | "instructor" | "admin";
  email: string;
  label: string;
  blurb: string;
  icon: string;
}

/**
 * The three signed-in views.
 *
 * `key` is load-bearing across the app and never changes. The labels are the
 * vocabulary this sector actually uses: an **aspirant** is preparing for a
 * government job or training on a vocational trade, **faculty** covers both
 * subject faculty and skill-centre trainers, and a **programme officer** runs
 * the mission rather than an institution.
 *
 * The `icon` values are deliberately left as they were. Icons are bundled
 * offline from a scan of the source (`npm run build:icons`), so an icon name
 * that has never been used before renders as nothing until the bundle is
 * rebuilt. These three are already in it.
 */
export const DEMO_PERSONAS: readonly DemoPersona[] = [
  {
    key: "student",
    email: "aspirant@tsem.gov.in",
    label: "Aspirant",
    blurb: "Courses, mock tests, job notifications, live classes and progress",
    icon: "mdi:school-outline",
  },
  {
    key: "instructor",
    email: "faculty@tsem.gov.in",
    label: "Faculty",
    blurb: "Batches, gradebook, live classes and trainee analytics",
    icon: "mdi:human-male-board",
  },
  {
    key: "admin",
    email: "admin@tsem.gov.in",
    label: "Programme Officer",
    blurb: "Centres, batches, notifications, content, branding and reporting",
    icon: "mdi:shield-crown-outline",
  },
] as const;

/**
 * localStorage key for the mutation overlay (see `lib/demo/db/store.ts`).
 * Bump the version suffix whenever the seed shape changes so a returning
 * visitor with a stale overlay gets a clean, coherent demo instead of a
 * half-migrated one.
 *
 * Renamed off the `ailinc-` prefix with the fork, which also means a machine
 * that has both builds open cannot mix one repo's overlay into the other.
 */
export const DEMO_STORAGE_KEY = "tsem-gov-demo-state-v1";

/**
 * Simulated network latency, in milliseconds.
 *
 * Zero. An earlier version added 90-260ms so loading skeletons would paint and
 * the app would "feel like a real system", which was the wrong goal. The demo's
 * job is to make the product feel fast, and an official clicking through modules
 * should never wait on latency we invented. Instant navigation is itself part of
 * what is being shown.
 *
 * Left configurable because a future recorded walkthrough might want the
 * skeleton states visible on purpose.
 */
export const DEMO_LATENCY_MS = { min: 0, max: 0 } as const;
