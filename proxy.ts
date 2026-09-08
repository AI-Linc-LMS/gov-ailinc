import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Instructors live entirely inside /instructor/*. Confining them here (server-side, no flash) is the
// real guard that keeps the instructor role out of the student learner view and the full-admin area.
const INSTRUCTOR_HOME = "/instructor/dashboard";
const INSTRUCTOR_BLOCKED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/adaptive-courses",
  "/adaptive-quizzes",
  "/assessments",
  "/community",
  "/courses",
  "/jobs",
  "/jobs-v2",
  "/leaderboard-streaks",
  "/live-sessions",
  "/mock-interview",
  "/points-system",
  "/proctoring-demo",
  "/resume",
];

function normalizeRole(role?: string): string {
  return (role || "").trim().toLowerCase().replace(/\s+/g, "_");
}

/**
 * The adaptive course BUILDER for one course, e.g. `/admin/adaptive-courses/56`.
 *
 * Instructors build their own courses here — it is the only page that can add a week, a topic or
 * a piece of content, and there is no instructor-side equivalent. Without this hole the feature
 * has no door: "Build a course" creates the course and then bounces its author to the dashboard,
 * and the card that says "yours to build" leads nowhere.
 *
 * Deliberately NOT `/admin/adaptive-courses` itself — the hub lists every course in the tenant and
 * stays blocked. One course, by id, and nothing else under /admin.
 *
 * Safe to open because the server now answers the question this rule used to stand in for. When
 * this confinement was written the authoring API had no object-level check at all, so a blunt
 * path block was the only guard. It now refuses to read or write a course you neither authored
 * nor were assigned to, per object, with tests. An instructor typing another course's id gets a
 * 403 from the API and an error state on the page, not somebody else's course.
 */

/**
 * Roles allowed under /admin.
 *
 * Kept local to the middleware rather than imported from lib/auth/role-utils so
 * the edge bundle stays free of app code. The list must track
 * `canAccessAdminArea` there: full admins plus the limited content roles.
 */
const ADMIN_AREA_ROLES = new Set([
  "admin",
  "superadmin",
  "super_admin",
  "client_admin",
  "clientadmin",
  "course_manager",
  "coursemanager",
  "content_manager",
  "contentmanager",
]);

function canReachAdminArea(role: string): boolean {
  return ADMIN_AREA_ROLES.has(role);
}

const INSTRUCTOR_ALLOWED_ADMIN_PATH = /^\/admin\/adaptive-courses\/\d+(\/|$)/;

function instructorBlocked(pathname: string): boolean {
  if (INSTRUCTOR_ALLOWED_ADMIN_PATH.test(pathname)) return false;
  return (
    pathname === "/" ||
    INSTRUCTOR_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const role = normalizeRole(request.cookies.get("user_role")?.value);
  const isInstructor = role === "instructor";
  const { pathname } = request.nextUrl;

  // Files under /public are requested by URL (e.g. CSS background-image, <img src>).
  // They must bypass auth — otherwise unauthenticated users get 307 → /login and assets never load.
  if (
    pathname.startsWith("/images/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/assets/") ||
    // DEMO REPO ONLY: the code editor is served from here rather than a CDN so
    // the coding workspace works with the network unplugged. Its loader is
    // fetched by a script tag, not by the app, so a 307 to /login here means the
    // editor silently never appears.
    pathname.startsWith("/monaco/") ||
    // Brand lockups live here and are needed on the SIGNED-OUT login screen.
    pathname.startsWith("/logos/")
  ) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/signup",
    "/verify-email",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/auth/handoff",
    // Public credential verification pages — anyone (incl. LinkedIn's crawler) can open these.
    "/credentials",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Scorecard PDF route is loaded by the backend's Playwright printer with a
  // pdf_token query param. There is no session cookie in that context; the
  // backend's AllowScorecardPdfToken permission validates the token. Letting
  // this through here keeps the auth model intact (data fetch still requires
  // a valid token) without redirecting Playwright to /login.
  const isScorecardPdfRoute = pathname.startsWith("/user/scorecard/pdf");

  // If accessing a protected route without token, redirect to login
  if (!isPublicRoute && !isScorecardPdfRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth pages while authenticated, redirect home (instructors to their own space).
  // Exceptions: /verify-email still needs to load for email confirmation
  // links, and /auth/* needs to load so an already-signed-in user can
  // consume a new handoff token (e.g. switching tenants).
  if (
    isPublicRoute &&
    token &&
    pathname !== "/verify-email" &&
    !pathname.startsWith("/auth/") &&
    // Credential pages must render for signed-in users too (don't bounce to /dashboard).
    !pathname.startsWith("/credentials")
  ) {
    return NextResponse.redirect(
      new URL(isInstructor ? INSTRUCTOR_HOME : "/dashboard", request.url),
    );
  }

  // Confine instructors to /instructor/* — bounce them off the student learner view and /admin/*.
  if (isInstructor && token && instructorBlocked(pathname)) {
    return NextResponse.redirect(new URL(INSTRUCTOR_HOME, request.url));
  }

  /**
   * Keep learners out of /admin/*.
   *
   * Instructors were confined here; students never were. Against a real backend
   * that is survivable, because every admin endpoint 403s and the page renders
   * empty. This prototype answers from seeds with no role check, so a student
   * who typed /admin/manage-students got the fully populated roster, the
   * settings screen and the institution dashboard. In a demo handed to a
   * prospect to explore unsupervised, that is the whole admin product visible
   * from the student login.
   *
   * Server-side, so there is no flash of admin UI before a client-side guard
   * catches up.
   */
  if (token && pathname.startsWith("/admin") && !canReachAdminArea(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
