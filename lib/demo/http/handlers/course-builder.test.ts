/**
 * Course-builder handlers, driven through the real router.
 *
 * These call `matchRoute` and the registered handler rather than importing the
 * functions directly, so they fail if a route is registered on a path the app
 * does not request. That is the failure mode that made the admin builder a
 * facade: handlers existed, but on paths nothing called, and every write in the
 * builder answered "No demo handler" straight onto the page.
 *
 * Written as a throwaway check while building the module; kept because it is the
 * only place that asserts a create actually round-trips through a later read.
 */
import { describe, expect, it } from "vitest";
import "./index";
import { matchRoute } from "../router";
import type { DemoRequest } from "../types";

async function call(method: string, path: string, body?: unknown) {
  const [pathname, qs] = path.split("?");
  const match = matchRoute(method, pathname);
  if (!match) throw new Error(`NO ROUTE for ${method} ${pathname}`);
  const req: DemoRequest = {
    method: method as DemoRequest["method"],
    path: pathname,
    params: match.params,
    query: new URLSearchParams(qs ?? ""),
    body,
    headers: {},
    auth: { userId: 1003, email: "admin@tsem.gov.in", role: "admin" },
  };
  return await match.route.handler(req);
}

const C = "/admin-dashboard/api/clients/101";

describe("course builder round trips", () => {
  it("creates a course that then appears in both admin lists and opens in the builder", async () => {
    const created = (await call("POST", `${C}/courses/`, {
      title: "Warangal district: rooftop solar installer, 40 hours",
      description: "A trade course for an ITI batch, taught at the Warangal skill centre.",
    })) as { id: number; title: string; published: boolean; stats: Record<string, { total: number }> };

    expect(created.id).toBeGreaterThan(900_000);
    expect(created.published).toBe(false);
    expect(created.stats.quiz.total).toBe(0);

    const legacyList = (await call("GET", `${C}/courses/`)) as Array<{ id: number }>;
    expect(legacyList.map((c) => c.id)).toContain(created.id);

    const adaptiveList = (await call("GET", "/adaptive-quiz/api/admin/courses/")) as Array<{
      id: number;
      quiz_count: number;
      article_count: number;
    }>;
    const row = adaptiveList.find((c) => c.id === created.id);
    expect(row).toBeTruthy();
    expect(Number.isFinite(row!.quiz_count)).toBe(true);

    const detail = (await call("GET", `/adaptive-quiz/api/admin/courses/${created.id}/`)) as {
      id: number;
      modules: unknown[];
    };
    expect(detail.id).toBe(created.id);
    expect(detail.modules).toEqual([]);

    // The certificates page links every listed course here; it must not 404.
    const cert = (await call("GET", `${C}/courses/${created.id}/view-course-details/`)) as {
      course_id: number;
    };
    expect(cert.course_id).toBe(created.id);
  });

  it("builds a module, topic and content, then deletes them again", async () => {
    const course = (await call("POST", "/adaptive-quiz/api/admin/courses/create/", {
      title: "TGPSC Group-II: Telangana movement and state formation",
      duration_weeks: 6,
    })) as { id: number; modules: unknown[] };

    const mod = (await call("POST", `/adaptive-quiz/api/admin/courses/${course.id}/modules/`, {
      title: "The 1969 agitation and what followed it",
    })) as { id: number; weekno: number };
    expect(mod.weekno).toBe(1);

    const sub = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/modules/${mod.id}/submodules/`,
      { title: "Article 371-D, and what it enables" },
    )) as { id: number; articles: unknown[] };
    expect(sub.articles).toEqual([]);

    const article = (await call("POST", `/adaptive-quiz/api/admin/submodules/${sub.id}/article/`, {
      title: "Why the article matters more than its number",
      body: "<p>The question asks what the provision enables, never what number it carries.</p>",
    })) as { id: number };
    expect(article.id).toBeGreaterThan(0);

    const bank = (await call("GET", "/adaptive-quiz/api/admin/bank/mcq/?limit=3")) as {
      results: Array<{ id: number }>;
      total: number;
    };
    expect(bank.results.length).toBe(3);

    const quiz = (await call("POST", `/adaptive-quiz/api/admin/submodules/${sub.id}/quiz/`, {
      mcq_ids: bank.results.map((q) => q.id),
    })) as { questions: number };
    expect(quiz.questions).toBe(3);

    const afterAdd = (await call("GET", `/adaptive-quiz/api/admin/courses/${course.id}/`)) as {
      module_count: number;
      submodule_count: number;
      quiz_count: number;
      article_count: number;
      modules: Array<{ submodules: Array<{ articles: unknown[]; quizzes: unknown[] }> }>;
    };
    expect(afterAdd.module_count).toBe(1);
    expect(afterAdd.submodule_count).toBe(1);
    expect(afterAdd.article_count).toBe(1);
    expect(afterAdd.quiz_count).toBe(1);
    expect(afterAdd.modules[0].submodules[0].articles).toHaveLength(1);
    expect(afterAdd.modules[0].submodules[0].quizzes).toHaveLength(1);

    // Legacy tree endpoints see the same thing.
    const legacyModules = (await call("GET", `${C}/courses/${course.id}/modules/`)) as Array<{
      id: number;
      submodules: Array<{ id: number; article_count: number }>;
    }>;
    expect(legacyModules[0].submodules[0].article_count).toBe(1);

    const contents = (await call(
      "GET",
      `${C}/courses/${course.id}/submodules/${sub.id}/contents/`,
    )) as Array<{ id: number; content_type: string }>;
    expect(contents.map((c) => c.content_type).sort()).toEqual(["Article", "Quiz"]);

    // Delete the quiz through the adaptive route, then the module.
    const quizRow = afterAdd.modules[0].submodules[0].quizzes[0] as { config_id: number };
    await call(
      "DELETE",
      `/adaptive-quiz/api/admin/submodules/${sub.id}/content/quiz/${quizRow.config_id}/`,
    );
    const afterQuizDelete = (await call(
      "GET",
      `${C}/courses/${course.id}/submodules/${sub.id}/contents/`,
    )) as unknown[];
    expect(afterQuizDelete).toHaveLength(1);

    await call("DELETE", `/adaptive-quiz/api/admin/courses/${course.id}/modules/${mod.id}/`);
    const afterModuleDelete = (await call(
      "GET",
      `/adaptive-quiz/api/admin/courses/${course.id}/`,
    )) as { modules: unknown[]; submodule_count: number };
    expect(afterModuleDelete.modules).toEqual([]);
    expect(afterModuleDelete.submodule_count).toBe(0);
  });

  it("edits and removes a SEEDED module without touching the seed itself", async () => {
    const before = (await call("GET", `${C}/courses/302/modules/`)) as Array<{ id: number; title: string }>;
    expect(before.length).toBe(7);
    const target = before[4];

    await call("PATCH", `${C}/courses/302/modules/${target.id}/`, { title: "Society and public policy, revised" });
    const renamed = (await call("GET", `${C}/courses/302/modules/`)) as Array<{ id: number; title: string }>;
    expect(renamed.find((m) => m.id === target.id)!.title).toBe("Society and public policy, revised");

    await call("DELETE", `${C}/courses/302/modules/${target.id}/`);
    const after = (await call("GET", `${C}/courses/302/modules/`)) as Array<{ id: number }>;
    expect(after.map((m) => m.id)).not.toContain(target.id);

    // The learner course page reads the same tree.
    const learner = (await call("GET", "/lms/clients/101/courses/302/")) as {
      modules: Array<{ id: number; title: string }>;
    };
    expect(learner.modules.map((m) => m.id)).not.toContain(target.id);
    expect(learner.modules.find((m) => m.title === "Society and public policy, revised")).toBeUndefined();
  });

  it("serves the legacy lesson page: outline, article, quiz, comments, submissions", async () => {
    const outline = (await call("GET", "/lms/clients/101/courses/302/sub-module/30201/")) as {
      status: string;
      moduleName: string;
      weekNo: number;
      submoduleName: string;
      data: Array<{ id: number; content_type: string; marks: number; status: string }>;
      attachments_by_content: Record<number, Array<{ file_url: string | null }>>;
    };
    expect(outline.status).toBe("success");
    expect(outline.weekNo).toBe(1);
    expect(outline.submoduleName).toBe("Four papers for Group-II, three for Group-III");
    expect(outline.data.map((d) => d.content_type)).toEqual(["Article", "Quiz"]);
    expect(outline.data[0].status).toBe("complete");
    // The seeded handout hangs off the first content of the first topic.
    expect(Object.keys(outline.attachments_by_content)).toHaveLength(1);

    const articleId = outline.data[0].id;
    const article = (await call("GET", `/lms/clients/101/courses/302/content/${articleId}/`)) as {
      content_type: string;
      content_title: string;
      details: { content: string };
      next_content: { id: number } | null;
      previous_content: unknown;
    };
    expect(article.content_type).toBe("Article");
    expect(article.details.content).toContain("<");
    expect(article.previous_content).toBeNull();
    expect(article.next_content!.id).toBe(outline.data[1].id);

    const quizId = outline.data[1].id;
    const quiz = (await call("GET", `/lms/clients/101/courses/302/content/${quizId}/`)) as {
      details: { mcqs: Array<{ question_text: string; options: string[]; correct_option: string }> };
    };
    expect(quiz.details.mcqs.length).toBeGreaterThan(0);
    expect(quiz.details.mcqs[0].options).toHaveLength(4);
    expect(["A", "B", "C", "D"]).toContain(quiz.details.mcqs[0].correct_option);

    const comments = (await call(
      "GET",
      `/lms/clients/101/courses/302/content/${articleId}/comment/`,
    )) as Array<{ text: string; user_profile: { user_name: string } }>;
    expect(comments.length).toBe(2);

    await call("POST", `/lms/clients/101/courses/302/content/${articleId}/comment/`, {
      text: "The paper split finally made sense once I read the annexure.",
    });
    const after = (await call(
      "GET",
      `/lms/clients/101/courses/302/content/${articleId}/comment/`,
    )) as unknown[];
    expect(after).toHaveLength(3);

    const subs = (await call(
      "GET",
      `/lms/clients/101/courses/302/content/${quizId}/past-submissions/`,
    )) as Array<{ id: number; obtained_marks: number; maximum_marks: number }>;
    expect(subs).toHaveLength(2);

    const detail = (await call(
      "GET",
      `/lms/clients/101/courses/302/content/${quizId}/past-submissions/${subs[0].id}/`,
    )) as { questions: Array<{ is_correct: boolean; selected_option: string }> };
    expect(detail.questions.length).toBeGreaterThan(0);
  });

  it("toggles a like and answers the wizard", async () => {
    const on = (await call("POST", "/lms/clients/101/courses/302/toggle-like/")) as {
      liked: boolean;
      likes_count: number;
    };
    expect(on.liked).toBe(true);
    const off = (await call("POST", "/lms/clients/101/courses/302/toggle-like/")) as {
      liked: boolean;
    };
    expect(off.liked).toBe(false);

    const state = (await call("GET", "/api/tenant/wizard/state/")) as {
      client_id: number;
      organisation_name: string;
      setup_completed: boolean;
    };
    expect(state.client_id).toBe(101);
    expect(state.organisation_name).toContain("Telangana Skills");

    const saved = (await call("PATCH", "/api/tenant/wizard/state/", {
      wizard_state: { brand: { primary: "#1b4f8a" } },
      setup_step: 3,
    })) as { setup_step: number; wizard_state: { brand: { primary: string } } };
    expect(saved.setup_step).toBe(3);
    expect(saved.wizard_state.brand.primary).toBe("#1b4f8a");

    const catalogue = (await call("GET", "/api/tenant/wizard/catalogue/")) as {
      courses: Array<{ id: number; modules: Array<{ submodules: unknown[] }>; thumbnail: string }>;
    };
    expect(catalogue.courses).toHaveLength(19);
    expect(catalogue.courses[0].thumbnail.startsWith("data:")).toBe(true);
    expect(catalogue.courses[0].modules[0].submodules.length).toBeGreaterThan(0);
  });

  it("round-trips the standalone content library and attachments", async () => {
    const art = (await call("POST", `${C}/articles/`, {
      title: "Reading an inverter event log",
      content: "<p>Start with the reason the machine recorded, not with the panels.</p>",
    })) as { id: number; content: string };
    expect((await call("GET", `${C}/articles/${art.id}/`)) as unknown).toMatchObject({
      id: art.id,
      title: "Reading an inverter event log",
    });
    const patched = (await call("PATCH", `${C}/articles/${art.id}/`, {
      title: "Reading an inverter event log, carefully",
    })) as { title: string };
    expect(patched.title).toBe("Reading an inverter event log, carefully");

    for (const [collection, payload, key] of [
      ["video-tutorials", { title: "Earthing in ten minutes", video_url: "https://example.test/v" }, "video_url"],
      ["assignments", { title: "Size a rooftop string", question: "Size a string against the inverter MPPT window." }, "question"],
      ["coding-problems", { title: "Legacy row", problem_statement: "Kept for a row the library can still address." }, "problem_statement"],
      ["mcqs", { question_text: "What does an ELCB measure?", option_a: "Leakage to earth", correct_option: "A" }, "option_a"],
      ["quizzes", { title: "Week 3 check", durating_in_minutes: 20 }, "durating_in_minutes"],
    ] as const) {
      const made = (await call("POST", `${C}/${collection}/`, payload)) as { id: number };
      const read = (await call("GET", `${C}/${collection}/${made.id}/`)) as Record<string, unknown>;
      expect(read[key]).toBeDefined();
    }

    // Attachments hang off a content row; the seeded handout for course 302 is
    // on the article of its first topic, id 30201 + 100000.
    const list = (await call("GET", `${C}/courses/302/contents/130201/attachments/`)) as Array<{
      id: number;
      file_url: string;
    }>;
    expect(list).toHaveLength(1);
    expect(list[0].file_url.startsWith("data:text/plain")).toBe(true);

    const renamed = (await call(
      "PATCH",
      `${C}/courses/302/contents/130201/attachments/${list[0].id}/`,
      { title: "Weekly checklist" },
    )) as { title: string };
    expect(renamed.title).toBe("Weekly checklist");

    await call("DELETE", `${C}/courses/302/contents/130201/attachments/${list[0].id}/`);
    expect((await call("GET", `${C}/courses/302/contents/130201/attachments/`)) as unknown[]).toHaveLength(0);
  });

  it("duplicates a whole course tree", async () => {
    const copy = (await call("POST", `${C}/courses/302/duplicate/`)) as {
      id: number;
      title: string;
      module_count: number;
      submodule_count: number;
    };
    expect(copy.title).toBe("TGPSC Group-II & Group-III Foundation (copy)");
    const original = (await call("GET", `${C}/courses/302/modules/`)) as unknown[];
    expect(copy.module_count).toBe(original.length);
    expect(copy.submodule_count).toBeGreaterThan(0);

    const tree = (await call("GET", `/adaptive-quiz/api/admin/courses/${copy.id}/`)) as {
      modules: Array<{ submodules: Array<{ articles: unknown[] }> }>;
    };
    expect(tree.modules[0].submodules[0].articles.length).toBe(1);
  });

  it("publishes, renames and deletes an adaptive course", async () => {
    const course = (await call("POST", "/adaptive-quiz/api/admin/courses/create/", {
      title: "IBPS PO prelims: sectional timing",
    })) as { id: number; is_published: boolean };
    expect(course.is_published).toBe(false);

    const published = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/publish/`,
    )) as { is_published: boolean };
    expect(published.is_published).toBe(true);

    const renamed = (await call("PATCH", `/adaptive-quiz/api/admin/courses/${course.id}/`, {
      title: "IBPS PO prelims: spending the twenty minutes",
      self_enroll_enabled: true,
    })) as { title: string; self_enroll_enabled: boolean };
    expect(renamed.title).toBe("IBPS PO prelims: spending the twenty minutes");
    expect(renamed.self_enroll_enabled).toBe(true);

    const described = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/generate-description/`,
    )) as { description: string };
    expect(described.description.length).toBeGreaterThan(40);

    const suggestions = (await call(
      "GET",
      `/adaptive-quiz/api/admin/submodules/30201/suggestions/`,
    )) as { has: Record<string, boolean>; gaps: unknown[]; bank_matches: { mcqs: unknown[] } };
    expect(suggestions.has.article).toBe(true);
    expect(suggestions.has.coding).toBe(false);
    expect(suggestions.bank_matches.mcqs.length).toBeGreaterThan(0);

    await call("DELETE", `/adaptive-quiz/api/admin/courses/${course.id}/`);
    const list = (await call("GET", "/adaptive-quiz/api/admin/courses/")) as Array<{ id: number }>;
    expect(list.map((c) => c.id)).not.toContain(course.id);
  });

  it("generates a course from a brief, and never a coding exercise", async () => {
    const job = (await call("POST", "/adaptive-quiz/api/admin/courses/generate/", {
      title: "Group-II foundation: the movement, six weeks",
      description:
        "A 6 week course for TGPSC Group-II aspirants on the Telangana movement and state formation.",
      duration_weeks: 6,
      // The form offers four content types because the product supports four.
      // This instance ships two, and the job has to SAY it dropped the others.
      config: { submodules_per_module: 3, content_types: ["quiz", "article", "coding", "video"] },
    })) as {
      job_id: string;
      scope: string;
      status: string;
      total_content_items: number;
      requested_note: string;
      outline_data: { track: string; weeks: Array<{ title: string; topics: string[] }> };
      stats: { submodules_total: number; coding_generated: number };
    };

    expect(job.job_id.startsWith("gen-")).toBe(true);
    expect(job.scope).toBe("full_course");
    expect(job.outline_data.weeks).toHaveLength(6);
    expect(job.outline_data.weeks[0].topics).toHaveLength(3);
    // The blueprint, not a paraphrase of the brief.
    expect(job.outline_data.weeks[0].title).toContain("Telangana movement");
    expect(job.stats.submodules_total).toBe(18);
    expect(job.stats.coding_generated).toBe(0);
    expect(job.requested_note.length).toBeGreaterThan(20);

    // The job page polls this while it builds.
    const polled = (await call(
      "GET",
      `/adaptive-quiz/api/admin/courses/jobs/${job.job_id}/`,
    )) as { job_id: string; tree: Array<{ submodules: unknown[] }>; progress_percentage: number };
    expect(polled.job_id).toBe(job.job_id);
    expect(polled.tree).toHaveLength(6);
    expect(polled.tree[0].submodules).toHaveLength(3);

    // The tree was written on the request, so the course is real immediately.
    const list = (await call("GET", "/adaptive-quiz/api/admin/courses/")) as Array<{
      id: number;
      title: string;
      is_published: boolean;
      coding_count: number;
      article_count: number;
      quiz_count: number;
    }>;
    const built = list.find((c) => c.title === "Group-II foundation: the movement, six weeks");
    expect(built).toBeTruthy();
    // A generated course is a DRAFT until a faculty member reads it.
    expect(built!.is_published).toBe(false);
    expect(built!.article_count).toBe(18);
    expect(built!.quiz_count).toBe(18);
    expect(built!.coding_count).toBe(0);

    const detail = (await call("GET", `/adaptive-quiz/api/admin/courses/${built!.id}/`)) as {
      modules: Array<{
        title: string;
        submodules: Array<{ title: string; articles: unknown[]; quizzes: Array<{ mcq_count: number }>; coding_sets: unknown[] }>;
      }>;
    };
    expect(detail.modules).toHaveLength(6);
    const first = detail.modules[0].submodules[0];
    expect(first.articles).toHaveLength(1);
    expect(first.coding_sets).toHaveLength(0);
    // Questions come from the verified library for this track, not from nowhere.
    expect(first.quizzes[0].mcq_count).toBeGreaterThan(0);
  });

  it("maps a curriculum CSV, then builds exactly the plan that was approved", async () => {
    const plan = (await call("POST", "/adaptive-quiz/api/admin/courses/parse-csv/", {
      title: "Solar PV installer, Warangal",
      columns: ["Week", "Topic", "Outcome"],
      rows: [
        { Week: "1", Topic: "Reading a roof before you quote for it", Outcome: "Survey a site" },
        { Week: "1", Topic: "Working at height", Outcome: "Work safely" },
        { Week: "2", Topic: "Sizing a string to the MPPT window", Outcome: "Size an array" },
      ],
      hint: "",
    })) as {
      modules: Array<{ week: number; title: string; submodules: Array<{ title: string }> }>;
      column_mapping: Record<string, string | null>;
      warnings: string[];
    };

    expect(plan.column_mapping.week).toBe("Week");
    expect(plan.column_mapping.topic).toBe("Topic");
    expect(plan.modules).toHaveLength(2);
    expect(plan.modules[0].submodules).toHaveLength(2);
    expect(plan.warnings).toEqual([]);

    const job = (await call("POST", "/adaptive-quiz/api/admin/courses/generate-from-plan/", {
      title: "Solar PV installer, Warangal centre",
      modules: plan.modules,
      config: { content_types: ["article", "quiz"] },
    })) as { job_id: string; outline_data: { weeks: Array<{ title: string; topics: string[] }> } };

    // Built as edited: the admin's own week titles and topic order, unchanged.
    expect(job.outline_data.weeks.map((w) => w.title)).toEqual(["Week 1", "Week 2"]);
    expect(job.outline_data.weeks[0].topics[0]).toBe("Reading a roof before you quote for it");
  });

  it("adds a generated week and a generated topic to a course that already exists", async () => {
    const course = (await call("POST", "/adaptive-quiz/api/admin/courses/create/", {
      title: "Electrician: domestic wiring refresher",
    })) as { id: number };

    const weekJob = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/modules/generate/`,
      { topic: "Earthing", submodules_count: 3 },
    )) as { scope: string; outline_data: { weeks: Array<{ title: string; topics: string[] }> } };
    expect(weekJob.scope).toBe("module");
    expect(weekJob.outline_data.weeks[0].topics).toHaveLength(3);

    const tree = (await call("GET", `/adaptive-quiz/api/admin/courses/${course.id}/`)) as {
      modules: Array<{ id: number; title: string; submodules: Array<{ id: number }> }>;
    };
    expect(tree.modules).toHaveLength(1);
    expect(tree.modules[0].submodules).toHaveLength(3);

    const topicJob = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/modules/${tree.modules[0].id}/submodules/generate/`,
      { topic: "Measuring earth resistance on an old pit" },
    )) as { scope: string };
    expect(topicJob.scope).toBe("submodule");

    const after = (await call("GET", `/adaptive-quiz/api/admin/courses/${course.id}/`)) as {
      modules: Array<{ submodules: Array<{ title: string; articles: unknown[]; quizzes: unknown[] }> }>;
    };
    expect(after.modules[0].submodules).toHaveLength(4);
    const added = after.modules[0].submodules[3];
    expect(added.title).toBe("Measuring earth resistance on an old pit");
    expect(added.articles).toHaveLength(1);
    expect(added.quizzes).toHaveLength(1);

    // Filling gaps is idempotent: nothing is missing, so nothing is rebuilt.
    const repair = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/regenerate-content/`,
      {},
    )) as { stats: { submodules_total: number }; requested_note: string };
    expect(repair.stats.submodules_total).toBe(0);
    expect(repair.requested_note).toContain("already carries");
  });

  it("has no user-visible em dashes in its own strings", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("lib/demo/http/handlers/course-builder.ts", "utf8");
    const strings = src.match(/["'`][^"'`\n]*—[^"'`\n]*["'`]/g) ?? [];
    expect(strings).toEqual([]);
  });
});
