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
    auth: { userId: 1003, email: "admin@ailinc.com", role: "admin" },
  };
  return await match.route.handler(req);
}

const C = "/admin-dashboard/api/clients/101";

describe("course builder round trips", () => {
  it("creates a course that then appears in both admin lists and opens in the builder", async () => {
    const created = (await call("POST", `${C}/courses/`, {
      title: "Applied Machine Learning Systems",
      description: "Ship a model, then keep it honest in production.",
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
      title: "Distributed Systems Foundations",
      duration_weeks: 6,
    })) as { id: number; modules: unknown[] };

    const mod = (await call("POST", `/adaptive-quiz/api/admin/courses/${course.id}/modules/`, {
      title: "Consensus and replication",
    })) as { id: number; weekno: number };
    expect(mod.weekno).toBe(1);

    const sub = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/modules/${mod.id}/submodules/`,
      { title: "Raft, step by step" },
    )) as { id: number; articles: unknown[] };
    expect(sub.articles).toEqual([]);

    const article = (await call("POST", `/adaptive-quiz/api/admin/submodules/${sub.id}/article/`, {
      title: "Why leader election exists",
      body: "<p>A replicated log needs one writer at a time.</p>",
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
    const before = (await call("GET", `${C}/courses/201/modules/`)) as Array<{ id: number; title: string }>;
    expect(before.length).toBe(5);
    const target = before[4];

    await call("PATCH", `${C}/courses/201/modules/${target.id}/`, { title: "Shipping it, revised" });
    const renamed = (await call("GET", `${C}/courses/201/modules/`)) as Array<{ id: number; title: string }>;
    expect(renamed.find((m) => m.id === target.id)!.title).toBe("Shipping it, revised");

    await call("DELETE", `${C}/courses/201/modules/${target.id}/`);
    const after = (await call("GET", `${C}/courses/201/modules/`)) as Array<{ id: number }>;
    expect(after.map((m) => m.id)).not.toContain(target.id);

    // The learner course page reads the same tree.
    const learner = (await call("GET", "/lms/clients/101/courses/201/")) as {
      modules: Array<{ id: number; title: string }>;
    };
    expect(learner.modules.map((m) => m.id)).not.toContain(target.id);
    expect(learner.modules.find((m) => m.title === "Shipping it, revised")).toBeUndefined();
  });

  it("serves the legacy lesson page: outline, article, quiz, comments, submissions", async () => {
    const outline = (await call("GET", "/lms/clients/101/courses/201/sub-module/5000/")) as {
      status: string;
      moduleName: string;
      weekNo: number;
      submoduleName: string;
      data: Array<{ id: number; content_type: string; marks: number; status: string }>;
      attachments_by_content: Record<number, Array<{ file_url: string | null }>>;
    };
    expect(outline.status).toBe("success");
    expect(outline.weekNo).toBe(1);
    expect(outline.submoduleName).toBe("The request lifecycle, end to end");
    expect(outline.data.map((d) => d.content_type)).toEqual(["Article", "Quiz"]);
    expect(outline.data[0].status).toBe("complete");
    // The seeded handout hangs off the first content of the first topic.
    expect(Object.keys(outline.attachments_by_content)).toHaveLength(1);

    const articleId = outline.data[0].id;
    const article = (await call("GET", `/lms/clients/101/courses/201/content/${articleId}/`)) as {
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
    const quiz = (await call("GET", `/lms/clients/101/courses/201/content/${quizId}/`)) as {
      details: { mcqs: Array<{ question_text: string; options: string[]; correct_option: string }> };
    };
    expect(quiz.details.mcqs.length).toBeGreaterThan(0);
    expect(quiz.details.mcqs[0].options).toHaveLength(4);
    expect(["A", "B", "C", "D"]).toContain(quiz.details.mcqs[0].correct_option);

    const comments = (await call(
      "GET",
      `/lms/clients/101/courses/201/content/${articleId}/comment/`,
    )) as Array<{ text: string; user_profile: { user_name: string } }>;
    expect(comments.length).toBe(2);

    await call("POST", `/lms/clients/101/courses/201/content/${articleId}/comment/`, {
      text: "This finally made the middleware order click for me.",
    });
    const after = (await call(
      "GET",
      `/lms/clients/101/courses/201/content/${articleId}/comment/`,
    )) as unknown[];
    expect(after).toHaveLength(3);

    const subs = (await call(
      "GET",
      `/lms/clients/101/courses/201/content/${quizId}/past-submissions/`,
    )) as Array<{ id: number; obtained_marks: number; maximum_marks: number }>;
    expect(subs).toHaveLength(2);

    const detail = (await call(
      "GET",
      `/lms/clients/101/courses/201/content/${quizId}/past-submissions/${subs[0].id}/`,
    )) as { questions: Array<{ is_correct: boolean; selected_option: string }> };
    expect(detail.questions.length).toBeGreaterThan(0);
  });

  it("toggles a like and answers the wizard", async () => {
    const on = (await call("POST", "/lms/clients/101/courses/201/toggle-like/")) as {
      liked: boolean;
      likes_count: number;
    };
    expect(on.liked).toBe(true);
    const off = (await call("POST", "/lms/clients/101/courses/201/toggle-like/")) as {
      liked: boolean;
    };
    expect(off.liked).toBe(false);

    const state = (await call("GET", "/api/tenant/wizard/state/")) as {
      client_id: number;
      organisation_name: string;
      setup_completed: boolean;
    };
    expect(state.client_id).toBe(101);
    expect(state.organisation_name).toContain("AI Linc");

    const saved = (await call("PATCH", "/api/tenant/wizard/state/", {
      wizard_state: { brand: { primary: "#6366f1" } },
      setup_step: 3,
    })) as { setup_step: number; wizard_state: { brand: { primary: string } } };
    expect(saved.setup_step).toBe(3);
    expect(saved.wizard_state.brand.primary).toBe("#6366f1");

    const catalogue = (await call("GET", "/api/tenant/wizard/catalogue/")) as {
      courses: Array<{ id: number; modules: Array<{ submodules: unknown[] }>; thumbnail: string }>;
    };
    expect(catalogue.courses).toHaveLength(5);
    expect(catalogue.courses[0].thumbnail.startsWith("data:")).toBe(true);
    expect(catalogue.courses[0].modules[0].submodules.length).toBeGreaterThan(0);
  });

  it("round-trips the standalone content library and attachments", async () => {
    const art = (await call("POST", `${C}/articles/`, {
      title: "Reading an EXPLAIN plan",
      content: "<p>Start at the innermost node.</p>",
    })) as { id: number; content: string };
    expect((await call("GET", `${C}/articles/${art.id}/`)) as unknown).toMatchObject({
      id: art.id,
      title: "Reading an EXPLAIN plan",
    });
    const patched = (await call("PATCH", `${C}/articles/${art.id}/`, {
      title: "Reading an EXPLAIN plan, carefully",
    })) as { title: string };
    expect(patched.title).toBe("Reading an EXPLAIN plan, carefully");

    for (const [collection, payload, key] of [
      ["video-tutorials", { title: "Indexes in ten minutes", video_url: "https://example.test/v" }, "video_url"],
      ["assignments", { title: "Design a schema", question: "Model a ticketing system." }, "question"],
      ["coding-problems", { title: "Merge intervals", problem_statement: "Merge overlaps." }, "problem_statement"],
      ["mcqs", { question_text: "What does EXPLAIN return?", option_a: "A plan", correct_option: "A" }, "option_a"],
      ["quizzes", { title: "Week 3 check", durating_in_minutes: 20 }, "durating_in_minutes"],
    ] as const) {
      const made = (await call("POST", `${C}/${collection}/`, payload)) as { id: number };
      const read = (await call("GET", `${C}/${collection}/${made.id}/`)) as Record<string, unknown>;
      expect(read[key]).toBeDefined();
    }

    // Attachments hang off a content row; the seeded handout is on 105000.
    const list = (await call("GET", `${C}/courses/201/contents/105000/attachments/`)) as Array<{
      id: number;
      file_url: string;
    }>;
    expect(list).toHaveLength(1);
    expect(list[0].file_url.startsWith("data:text/plain")).toBe(true);

    const renamed = (await call(
      "PATCH",
      `${C}/courses/201/contents/105000/attachments/${list[0].id}/`,
      { title: "Weekly checklist" },
    )) as { title: string };
    expect(renamed.title).toBe("Weekly checklist");

    await call("DELETE", `${C}/courses/201/contents/105000/attachments/${list[0].id}/`);
    expect((await call("GET", `${C}/courses/201/contents/105000/attachments/`)) as unknown[]).toHaveLength(0);
  });

  it("duplicates a whole course tree", async () => {
    const copy = (await call("POST", `${C}/courses/201/duplicate/`)) as {
      id: number;
      title: string;
      module_count: number;
      submodule_count: number;
    };
    expect(copy.title).toBe("Full-Stack Web Development (copy)");
    const original = (await call("GET", `${C}/courses/201/modules/`)) as unknown[];
    expect(copy.module_count).toBe(original.length);
    expect(copy.submodule_count).toBeGreaterThan(0);

    const tree = (await call("GET", `/adaptive-quiz/api/admin/courses/${copy.id}/`)) as {
      modules: Array<{ submodules: Array<{ articles: unknown[] }> }>;
    };
    expect(tree.modules[0].submodules[0].articles.length).toBe(1);
  });

  it("publishes, renames and deletes an adaptive course", async () => {
    const course = (await call("POST", "/adaptive-quiz/api/admin/courses/create/", {
      title: "Prompt Engineering for Engineers",
    })) as { id: number; is_published: boolean };
    expect(course.is_published).toBe(false);

    const published = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/publish/`,
    )) as { is_published: boolean };
    expect(published.is_published).toBe(true);

    const renamed = (await call("PATCH", `/adaptive-quiz/api/admin/courses/${course.id}/`, {
      title: "Prompt Engineering, Applied",
      self_enroll_enabled: true,
    })) as { title: string; self_enroll_enabled: boolean };
    expect(renamed.title).toBe("Prompt Engineering, Applied");
    expect(renamed.self_enroll_enabled).toBe(true);

    const described = (await call(
      "POST",
      `/adaptive-quiz/api/admin/courses/${course.id}/generate-description/`,
    )) as { description: string };
    expect(described.description.length).toBeGreaterThan(40);

    const suggestions = (await call(
      "GET",
      `/adaptive-quiz/api/admin/submodules/5000/suggestions/`,
    )) as { has: Record<string, boolean>; gaps: unknown[]; bank_matches: { mcqs: unknown[] } };
    expect(suggestions.has.article).toBe(true);
    expect(suggestions.has.coding).toBe(false);
    expect(suggestions.bank_matches.mcqs.length).toBeGreaterThan(0);

    await call("DELETE", `/adaptive-quiz/api/admin/courses/${course.id}/`);
    const list = (await call("GET", "/adaptive-quiz/api/admin/courses/")) as Array<{ id: number }>;
    expect(list.map((c) => c.id)).not.toContain(course.id);
  });

  it("has no user-visible em dashes in its own strings", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("lib/demo/http/handlers/course-builder.ts", "utf8");
    const strings = src.match(/["'`][^"'`\n]*—[^"'`\n]*["'`]/g) ?? [];
    expect(strings).toEqual([]);
  });
});
