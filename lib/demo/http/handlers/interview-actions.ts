/**
 * The mock-interview lifecycle: claim, start, answer, submit, score.
 *
 * Everything that MOVES an interview forward lives here; `mock-interview.ts` keeps the
 * read side and pulls its list/detail projections out of the store below.
 *
 * Why this exists at all. The real product runs a voice interview: an LLM writes each
 * follow-up from the candidate's last answer, a speech service transcribes them, and a
 * second LLM pass scores the transcript. This prototype has no network and no API key,
 * so none of those three services can run. Pretending otherwise is what the previous
 * state of the demo did, and it produced the worst possible outcome: the device check
 * could never go green, so "Start Interview" never appeared, and any interview that did
 * get submitted spun on "EVALUATING YOUR INTERVIEW" for ninety seconds and then landed
 * on an error screen.
 *
 * So the interview here is SCRIPTED and the scoring is a real rubric run locally:
 *
 *   - Each topic has a fixed set of five interviewer questions, written the way a
 *     working engineer actually asks them, each with the key points an interviewer is
 *     listening for.
 *   - The candidate types (voice still works if the browser's own SpeechRecognition
 *     happens to function, but nothing depends on it).
 *   - Submit scores every answer against its key points immediately and returns the
 *     result. No polling, no "our AI is thinking", no 90-second timeout.
 *
 * The score is genuinely derived from what the candidate wrote: substance, coverage of
 * the expected key points, structure and specificity. A blank answer scores zero and
 * says so. That matters more than it sounds, because a prospect WILL type nonsense into
 * one answer to see whether the feedback is real.
 *
 * Shape note, learned the hard way: the result page reads
 * `evaluation_score.overall_percentage` AND `evaluation_score.question_scores` before it
 * will stop polling, and it renders `student.user_name` and `interview_transcript.metadata`
 * with no guard. A detail payload missing any of those either spins forever or throws.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import { overlay, nextDemoId } from "../../db/overlay";
import { COURSES } from "../../db/courses";
import { STUDENT_PERSONA, STUDENTS } from "../../db/people";
import { iso, isoDaysAgo, isoDaysAhead, nowMs } from "../../clock";
import { seededInt, seededPick, seededSample } from "../../random";

const MODULE = "interview-actions";

/* ────────────────────────────────────────────────────────────────────────────
 * The question bank
 * ──────────────────────────────────────────────────────────────────────────── */

export interface ScriptQuestion {
  /** What the interviewer says. */
  text: string;
  /** Drives nothing structural here: every question is conversational on purpose. */
  type: "behavioral" | "technical" | "situational";
  /**
   * What an interviewer is listening for. Doubles as the scoring rubric: the grader
   * checks the candidate's answer for each point and the per-question feedback names
   * the ones that landed and the ones that did not, so the feedback can never claim
   * something the grader did not actually measure.
   */
  keyPoints: string[];
}

interface Script {
  questions: ScriptQuestion[];
  /** Spoken wrap-up, returned by /next-question/ once the turns are used up. */
  closing: string;
}

const FULLSTACK: Script = {
  questions: [
    {
      text: "Let's start with something you have built. Walk me through a web feature you shipped end to end, from the data model through to what the user finally sees.",
      type: "behavioral",
      keyPoints: [
        "the data model or schema behind the feature",
        "the API contract between client and server",
        "a design decision and the reason for it",
        "how you verified the feature actually worked",
      ],
    },
    {
      text: "A dashboard in your app takes six seconds to become usable, but the API behind it responds in 200 milliseconds. Where do you look, and in what order?",
      type: "technical",
      keyPoints: [
        "separating network time from rendering time",
        "bundle size and code splitting",
        "re-render cost, memoisation or virtualisation",
        "measuring before changing anything",
      ],
    },
    {
      text: "A user reports that clicking Save twice creates two records. How do you stop that, on the client and on the server?",
      type: "technical",
      keyPoints: [
        "disabling the control or guarding the in-flight request",
        "an idempotency key or a unique constraint on the server",
        "why the client fix alone is not enough",
        "what the user sees when the second click is rejected",
      ],
    },
    {
      text: "Your team wants to move a page from server rendering to client rendering because it will feel faster. What do you ask before you agree?",
      type: "situational",
      keyPoints: [
        "what problem this is actually solving",
        "the first-paint and indexing trade-off",
        "data freshness and caching",
        "measuring the current numbers first",
      ],
    },
    {
      text: "Last one. Model authentication for a small product that has both a web app and a mobile client. What do you choose, and what breaks if you get it wrong?",
      type: "technical",
      keyPoints: [
        "a session or token choice with a reason",
        "where the credential is stored and why",
        "refresh and expiry handling",
        "logging out everywhere, and revocation",
      ],
    },
  ],
  closing:
    "That is everything I wanted to cover. You explained your reasoning out loud rather than jumping to answers, which is the habit that carries a real interview. Submit whenever you are ready and your feedback will be waiting on the next screen.",
};

const DATA: Script = {
  questions: [
    {
      text: "Start me off with a dataset you have worked with that did not behave. What was wrong with it, and what did you do about it?",
      type: "behavioral",
      keyPoints: [
        "the specific data problem, not just 'it was messy'",
        "the cleaning decision and what it cost you",
        "how you checked the fix was right",
        "what you told the people relying on that data",
      ],
    },
    {
      text: "You have a classifier at 94 percent accuracy and your stakeholder is delighted. What do you check before you agree with them?",
      type: "technical",
      keyPoints: [
        "class balance and the base rate",
        "precision, recall or a confusion matrix",
        "how the train and test split was made",
        "whether the metric matches the decision being made",
      ],
    },
    {
      text: "A column you need has 30 percent missing values. Talk me through your options and how you would choose between them.",
      type: "technical",
      keyPoints: [
        "drop, impute, or model the missingness itself",
        "whether the data is missing at random",
        "leakage from imputing before the split",
        "tying the choice to the downstream model",
      ],
    },
    {
      text: "Explain the difference between a groupby aggregation and a window function to somebody who only knows spreadsheets.",
      type: "situational",
      keyPoints: [
        "aggregation collapses rows, a window keeps them",
        "a concrete example the listener can picture",
        "running totals, ranks or moving averages",
        "checking the listener has followed you",
      ],
    },
    {
      text: "Last one. Your notebook produces a different number today than it did last week, and none of your code changed. Where do you start?",
      type: "technical",
      keyPoints: [
        "pinning the data snapshot or checking the source",
        "random seeds and non-deterministic steps",
        "library versions and the environment",
        "what you would change to make the run reproducible",
      ],
    },
  ],
  closing:
    "That is the end of my questions. You were willing to question a number rather than accept it, which is most of the job. Submit when you are ready and your feedback appears straight away.",
};

const ALGORITHMS: Script = {
  questions: [
    {
      text: "Before any code: tell me how you approach a problem you have never seen. What happens in the first two minutes?",
      type: "behavioral",
      keyPoints: [
        "restating the problem in your own words",
        "clarifying input size and constraints",
        "stating a brute force before optimising",
        "walking a small example, including the edge cases",
      ],
    },
    {
      text: "Given a list of numbers, find the two that sum to a target. Take me from the slowest approach to the fastest, out loud.",
      type: "technical",
      keyPoints: [
        "the nested loop and why it is quadratic",
        "sorting with two pointers",
        "a hash map in a single pass",
        "the time and space trade-off between them",
      ],
    },
    {
      text: "When would you deliberately accept an O(n log n) solution over an O(n) one?",
      type: "technical",
      keyPoints: [
        "constant factors at realistic input sizes",
        "memory pressure of the linear solution",
        "readability and maintenance cost",
        "a concrete situation where you made that call",
      ],
    },
    {
      text: "Explain what a hash collision is, and what happens to your complexity when collisions get frequent.",
      type: "technical",
      keyPoints: [
        "two keys landing in the same bucket",
        "chaining or open addressing",
        "the worst case degrading toward linear",
        "load factor, resizing or the quality of the hash",
      ],
    },
    {
      text: "Last one. Your solution fails one hidden test and you cannot see the input. What do you do?",
      type: "situational",
      keyPoints: [
        "re-reading the constraints for the case you skipped",
        "testing boundaries: empty, single element, duplicates, overflow",
        "reasoning about the invariant instead of guessing",
        "narrowing it down systematically rather than randomly",
      ],
    },
  ],
  closing:
    "That is all of them. The thing to keep doing is saying the brute force out loud early, because it buys you credit before the optimisation lands. Submit when you are ready.",
};

const CLOUD: Script = {
  questions: [
    {
      text: "Take an application you know well. What has to change about it before it can serve real users in production?",
      type: "behavioral",
      keyPoints: [
        "configuration and secrets out of the code",
        "logging, metrics and alerting",
        "how it is deployed and how it is rolled back",
        "what happens when a single instance dies",
      ],
    },
    {
      text: "Traffic grows a hundredfold overnight. What breaks first, and how would you know it was that?",
      type: "technical",
      keyPoints: [
        "a specific bottleneck: connections, a single instance, disk, a lock",
        "the metric that would show it",
        "diagnosing before reaching for a fix",
        "a cache or a queue, with its trade-off named",
      ],
    },
    {
      text: "Explain the difference between scaling up and scaling out, and when scaling up is the honest answer.",
      type: "technical",
      keyPoints: [
        "vertical versus horizontal",
        "state is what makes scaling out hard",
        "the cost curve and the ceiling of vertical scaling",
        "a case where up is genuinely the right call",
      ],
    },
    {
      text: "Your deploy pipeline takes forty minutes and the team has quietly stopped deploying on Fridays. What do you do?",
      type: "situational",
      keyPoints: [
        "measuring where the forty minutes actually goes",
        "parallelising or caching the slow stage",
        "treating the fear of deploying as the real problem",
        "rollback confidence and blast radius",
      ],
    },
    {
      text: "Last one. How do you decide what deserves an alert, versus what should only ever be a log line?",
      type: "technical",
      keyPoints: [
        "an alert needs a human action attached to it",
        "symptom-based alerting over cause-based",
        "alert fatigue and what it does to a team",
        "a concrete example of each",
      ],
    },
  ],
  closing:
    "That is everything. You kept coming back to what you would measure, which is the difference between an engineer and somebody reciting architecture diagrams. Submit when you are ready.",
};

const SQL_SCRIPT: Script = {
  questions: [
    {
      text: "Tell me about a schema you designed or inherited. What did it get right, and what would you change now?",
      type: "behavioral",
      keyPoints: [
        "the entities and the relationships between them",
        "a normalisation or denormalisation decision",
        "the consequence you then had to live with",
        "how it changed as the requirements moved",
      ],
    },
    {
      text: "A query that used to take fifty milliseconds now takes nine seconds. Walk me through the investigation.",
      type: "technical",
      keyPoints: [
        "reading the query plan",
        "whether an index exists and whether it is being used",
        "table growth or stale statistics",
        "changing one thing at a time and measuring",
      ],
    },
    {
      text: "When is adding an index the wrong answer?",
      type: "technical",
      keyPoints: [
        "write amplification on inserts and updates",
        "low cardinality columns",
        "the planner ignoring it anyway",
        "storage and maintenance cost",
      ],
    },
    {
      text: "Explain the difference between an INNER JOIN and a LEFT JOIN, and give me a case where picking the wrong one is a silent bug.",
      type: "technical",
      keyPoints: [
        "inner drops unmatched rows",
        "left keeps the left side and nulls the right",
        "a concrete counting or reporting bug",
        "filtering in WHERE versus in the ON clause",
      ],
    },
    {
      text: "Last one. Model something that needs history, where you have to answer what a record looked like last March.",
      type: "situational",
      keyPoints: [
        "versioned rows or a separate audit table",
        "valid-from and valid-to columns",
        "the query complexity you are taking on",
        "how deletes are handled",
      ],
    },
  ],
  closing:
    "That is the last question. Reading the plan before touching the query is the habit worth keeping. Submit when you are ready and your feedback is on the next screen.",
};

const BEHAVIOURAL: Script = {
  questions: [
    {
      text: "Tell me about a time you disagreed with a decision your team made. What did you actually do?",
      type: "behavioral",
      keyPoints: [
        "a concrete situation rather than a general policy",
        "what you did, not what you believe",
        "the outcome, told honestly",
        "what you would do differently now",
      ],
    },
    {
      text: "Describe something you shipped that did not work out. What did you take from it?",
      type: "behavioral",
      keyPoints: [
        "owning the part that was yours",
        "explaining without blaming other people",
        "a specific lesson, not a slogan",
        "evidence the lesson changed later behaviour",
      ],
    },
    {
      text: "How do you decide what to work on when everything on the list is urgent?",
      type: "situational",
      keyPoints: [
        "a method you actually use, named",
        "who you consult before deciding",
        "what you say no to",
        "how you communicate the trade-off",
      ],
    },
    {
      text: "Tell me about a time you had to explain something technical to someone who did not share your background.",
      type: "behavioral",
      keyPoints: [
        "adapting the language to the listener",
        "an analogy or a worked example",
        "checking they had followed you",
        "the outcome of the conversation",
      ],
    },
    {
      text: "Last one. What feedback has been hardest for you to hear, and what did you do with it?",
      type: "behavioral",
      keyPoints: [
        "a real example rather than a humble brag",
        "showing it was genuinely uncomfortable",
        "an action you took afterwards",
        "evidence the change stuck",
      ],
    },
  ],
  closing:
    "That is all of my questions. Your answers were specific, which is the whole game in a behavioural round. Submit when you are ready.",
};

/** Fallback for a topic a prospect typed themselves in Quick Start. */
function generalScript(topic: string): Script {
  const t = topic.trim() || "this area";
  return {
    questions: [
      {
        text: `Let's start broadly. What drew you to ${t}, and what have you built or studied in it so far?`,
        type: "behavioral",
        keyPoints: [
          "a specific project or piece of work",
          "a decision you made inside it",
          "genuine motivation rather than a slogan",
          "what you found hard",
        ],
      },
      {
        text: `Pick one idea in ${t} that people usually get wrong, and explain it the way you wish somebody had explained it to you.`,
        type: "technical",
        keyPoints: [
          "naming the misconception precisely",
          "the correct model, explained clearly",
          "an example that makes it concrete",
          "why the wrong model is tempting",
        ],
      },
      {
        text: `Walk me through how you would approach a problem in ${t} that you had never seen before.`,
        type: "situational",
        keyPoints: [
          "clarifying the problem before solving it",
          "breaking it into steps",
          "stating your assumptions out loud",
          "how you would check the answer",
        ],
      },
      {
        text: `Tell me about a trade-off you have had to make in ${t}. What did you give up, and why was that right?`,
        type: "technical",
        keyPoints: [
          "both sides of the trade-off",
          "the factor that decided it",
          "acknowledging what it cost",
          "the outcome",
        ],
      },
      {
        text: `Last one. If you had a month to get significantly better at ${t}, what would you actually do?`,
        type: "behavioral",
        keyPoints: [
          "a plan rather than a wish",
          "how you would measure progress",
          "what you would stop doing",
          "self-awareness about the current gap",
        ],
      },
    ],
    closing: `That is everything on ${t}. Thanks for thinking out loud rather than reaching for the tidy answer. Submit when you are ready and your feedback appears immediately.`,
  };
}

/**
 * Pick the script for a topic string.
 *
 * Topics arrive from three places with three vocabularies: a course title
 * ("SQL & Database Design"), the Quick Start picker ("Cloud Architecture"), and a
 * free-typed custom topic. Matching on substrings rather than an exact map means a
 * prospect who types "react hooks" still gets the full-stack script instead of the
 * generic one.
 */
function scriptFor(topic: string, subtopic = ""): Script {
  const hay = `${topic} ${subtopic}`.toLowerCase();
  const has = (...words: string[]) => words.some((w) => hay.includes(w));

  if (has("algorithm", "data structure", "dsa", "problem solving", "complexity")) return ALGORITHMS;
  if (has("sql", "database", "postgres", "data modelling", "data modeling")) return SQL_SCRIPT;
  if (has("cloud", "aws", "devops", "system design", "infrastructure", "docker", "kubernetes")) return CLOUD;
  if (has("data science", "pandas", "machine learning", "statistics", "python")) return DATA;
  if (has("behavioral", "behavioural", "leadership", "management", "communication")) return BEHAVIOURAL;
  if (has("full-stack", "full stack", "react", "javascript", "typescript", "node", "web", "frontend", "backend", "api"))
    return FULLSTACK;
  return generalScript(topic);
}

/* ────────────────────────────────────────────────────────────────────────────
 * Templates: the interviews an institution attaches to a course
 * ──────────────────────────────────────────────────────────────────────────── */

export interface DemoTemplate {
  id: number;
  courseId: number;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration_minutes: number;
  description: string;
  is_active: boolean;
  num_coding_questions: number;
  num_mcq_questions: number;
  createdDaysAgo: number;
}

const SEED_TEMPLATES: DemoTemplate[] = COURSES.map((course, index) => ({
  id: 8100 + index,
  courseId: course.id,
  title: `${course.title}: exit interview`,
  topic: course.tags[0] ?? course.title,
  subtopic: course.tags.slice(1, 3).join(", "),
  difficulty: course.difficulty === "Advanced" ? "Hard" : course.difficulty === "Beginner" ? "Easy" : "Medium",
  duration_minutes: 20,
  description:
    `A five-question interview on ${course.title}. The interviewer works through the ideas the ` +
    `course actually taught, and your answers are scored on structure and specificity as well as ` +
    `on being right.`,
  is_active: true,
  num_coding_questions: 0,
  num_mcq_questions: 0,
  createdDaysAgo: 34 - index * 4,
}));

/** Templates the admin created during this demo session. */
function customTemplates(): DemoTemplate[] {
  return overlay.get<DemoTemplate[]>("interview:templates", []);
}

/** Templates the admin deleted during this demo session, by id. */
function deletedTemplateIds(): number[] {
  return overlay.get<number[]>("interview:templates:deleted", []);
}

/** Field-level edits an admin made to a seeded template. */
function templatePatches(): Record<string, Partial<DemoTemplate>> {
  return overlay.get<Record<string, Partial<DemoTemplate>>>("interview:templates:patch", {});
}

function allTemplates(): DemoTemplate[] {
  const removed = new Set(deletedTemplateIds());
  const patches = templatePatches();
  return [...SEED_TEMPLATES, ...customTemplates()]
    .filter((t) => !removed.has(t.id))
    .map((t) => ({ ...t, ...(patches[String(t.id)] ?? {}) }));
}

function templateById(id: number): DemoTemplate | undefined {
  return allTemplates().find((t) => t.id === id);
}

/** The `InterviewTemplate` the admin templates page renders. */
export function templateToApi(t: DemoTemplate) {
  const course = COURSES.find((c) => c.id === t.courseId);
  return {
    id: t.id,
    title: t.title,
    topic: t.topic,
    subtopic: t.subtopic,
    difficulty: t.difficulty,
    duration_minutes: t.duration_minutes,
    description: t.description,
    is_active: t.is_active,
    course_ids: course ? [course.id] : [],
    adaptive_course_ids: course ? [course.id] : [],
    courses: course ? [{ id: course.id, title: course.title }] : [],
    attempt_count: templateAttempts(t.id).length,
    num_coding_questions: t.num_coding_questions,
    num_mcq_questions: t.num_mcq_questions,
    // Every template releases immediately. A demo that hides the result behind an
    // admin action would leave a prospect who just finished an interview staring at
    // "your instructor will release this", which is the one screen they cannot act on.
    // The admin release control still works; it just has nothing left to unlock.
    result_release_mode: "immediate" as const,
    result_release_at: null,
    resume_enabled: true,
    resume_window_minutes: 60,
    created_at: isoDaysAgo(t.createdDaysAgo),
    updated_at: isoDaysAgo(Math.max(1, t.createdDaysAgo - 3)),
  };
}

/** The `PendingCourseInterview` cards on /mock-interview/courses. */
export function pendingTemplates() {
  const taken = new Set(
    storedAttempts()
      .filter((a) => a.templateId != null && a.status === "completed" && !a.superseded)
      .map((a) => a.templateId as number),
  );
  return allTemplates()
    .filter((t) => t.is_active)
    .filter((t) => COURSES.find((c) => c.id === t.courseId)?.enrolled)
    .map((t) => ({
      id: t.id,
      title: t.title,
      topic: t.topic,
      subtopic: t.subtopic,
      difficulty: t.difficulty,
      duration_minutes: t.duration_minutes,
      description: t.description,
      course_titles: [COURSES.find((c) => c.id === t.courseId)?.title ?? t.topic],
      has_attempt: taken.has(t.id),
    }));
}

export function adminTemplates(courseId?: number) {
  return allTemplates()
    .filter((t) => courseId == null || t.courseId === courseId)
    .map(templateToApi);
}

/* ────────────────────────────────────────────────────────────────────────────
 * Attempts: the seed, plus whatever the visitor does during the demo
 * ──────────────────────────────────────────────────────────────────────────── */

export type AttemptStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "failed";

export interface Attempt {
  id: number;
  templateId: number | null;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration_minutes: number;
  status: AttemptStatus;
  created_at: string;
  scheduled_date_time: string | null;
  started_at: string | null;
  submitted_at: string | null;
  /** Candidate answers keyed by question id, as strings. */
  answers: Record<string, string>;
  /** 1-based index of the question the candidate is on. */
  turn: number;
  total_duration_seconds: number;
  metadata: Record<string, number>;
  result_visible_to_student: boolean;
  result_released_at: string | null;
  superseded: boolean;
}

const ATTEMPTS_KEY = "interview:attempts";

function storedMap(): Record<string, Attempt> {
  return overlay.get<Record<string, Attempt>>(ATTEMPTS_KEY, {});
}

function storedAttempts(): Attempt[] {
  return Object.values(storedMap());
}

function saveAttempt(attempt: Attempt): Attempt {
  overlay.update<Record<string, Attempt>>(ATTEMPTS_KEY, {}, (map) => ({
    ...map,
    [String(attempt.id)]: attempt,
  }));
  return attempt;
}

/**
 * The two finished interviews and one scheduled interview a returning learner already
 * has. Hand-authored rather than generated: this is the first thing a prospect opens
 * from "Previous interviews", and generated answers read as generated.
 */
interface SeedTranscript {
  questions: ScriptQuestion[];
  /** Parallel to `questions`: what the candidate said. */
  answers: string[];
  /** Parallel to `questions`: marks out of 20. */
  marks: number[];
  /** Parallel to `questions`: the interviewer's note on that answer. */
  notes: string[];
  narrative: string;
}

const BACKEND_QUESTIONS: ScriptQuestion[] = [
  {
    text: "Walk me through the last API you designed. What were the resources, and what did you get wrong the first time?",
    type: "behavioral",
    keyPoints: [
      "the resources and their relationships",
      "the request and response contract",
      "a mistake you found and corrected",
      "how consumers of the API found out about changes",
    ],
  },
  {
    text: "Where would you put a cache in a read-heavy service, and what breaks when you do?",
    type: "technical",
    keyPoints: [
      "the specific layer you are caching",
      "invalidation, and who is responsible for it",
      "staleness the product can tolerate",
      "the failure mode when the cache is cold or gone",
    ],
  },
  {
    text: "Two requests update the same row at the same time. Walk me through what actually happens and how you make it safe.",
    type: "technical",
    keyPoints: [
      "the lost-update problem stated clearly",
      "optimistic versus pessimistic locking",
      "transaction boundaries and isolation level",
      "what the losing request sees",
    ],
  },
  {
    text: "This service now has to handle a hundred times the traffic. What breaks first?",
    type: "situational",
    keyPoints: [
      "naming the bottleneck before naming the fix",
      "the metric that would prove it",
      "connection pools, queueing or fan-out",
      "what you would deliberately not fix yet",
    ],
  },
  {
    text: "Last one. How do you decide what belongs in the database versus what belongs in application code?",
    type: "technical",
    keyPoints: [
      "constraints that must hold no matter who writes",
      "portability and testability of application logic",
      "performance of doing it close to the data",
      "a concrete example on each side",
    ],
  },
];

const SEED_TRANSCRIPTS: Record<number, SeedTranscript> = {
  801: {
    questions: BACKEND_QUESTIONS,
    answers: [
      "The last one was a booking API for a studio scheduling tool. The resources were rooms, slots and bookings, and a booking pointed at exactly one slot. The first version let you POST a booking with a start and end time directly, which meant two people could describe overlapping bookings that the server had no way to compare. I changed it so slots were created up front and a booking could only reference a slot id, so the overlap question became a uniqueness question. We versioned the path when we made that change and kept the old route alive for two weeks while the mobile client caught up.",
      "I would cache the read model rather than the raw rows, so the thing in the cache is the same shape the endpoint returns and there is no assembly cost on a hit. The hard part is invalidation. I would have the write path publish the id that changed and evict on that, rather than relying on a time to live alone, because a five minute TTL means five minutes of wrong prices. Some staleness is fine for a listing page and not fine for a balance. The failure mode I worry about is a cold cache after a deploy, where every request goes to the database at once, so I would warm the popular keys before shifting traffic.",
      "Without care you get a lost update: both requests read the same version, both compute from it, and the second write silently overwrites the first. The cheap fix is optimistic locking, where the row carries a version column and the update says where version equals what I read. If it updates zero rows, someone beat you and you retry or surface a conflict. Pessimistic locking with select for update is simpler to reason about but it holds the row for the length of the transaction, which is fine for a short update and bad if there is a network call inside it. Whichever you pick, the losing request has to get a real answer, not a success.",
      "Honestly I would want to know which part is read heavy before answering. If reads dominate, the first thing to fall over is usually the database connection pool rather than the database itself, because every app instance opens its own and they multiply. I would look at pool saturation and query wait time first. After that it is the N+1 queries that were invisible at low volume. I would add caching and a read replica, and I would deliberately not shard yet, because sharding is expensive to undo and we would not have proven we need it.",
      "Anything that has to be true no matter which service writes belongs in the database, so foreign keys, uniqueness and not-null constraints. I have been burned by a uniqueness rule that lived only in application code and was bypassed by a data migration. Business logic that changes often, and that I want to unit test quickly, belongs in application code. The exception is when doing it in the database avoids pulling a large amount of data across the wire, like an aggregate over millions of rows, where a view or a well-written query wins.",
    ],
    marks: [17, 16, 15, 16, 14],
    notes: [
      "A strong opening. You named the resources, the contract and a real mistake you corrected, and the versioning answer showed you have actually had to migrate a client.",
      "You separated the read model from the raw rows and were specific about invalidation, which most candidates skip. You did not say how you would detect that the cache had gone stale in production.",
      "Correct on the mechanism and clear about what the losing request sees. The isolation level itself never came up, and that is where the follow-up would have gone.",
      "The best answer of the interview: you named the bottleneck and the metric before proposing anything, and you named something you would deliberately not do yet.",
      "You gave a real example on the database side. The application side stayed abstract, and the answer would have been stronger with one concrete rule you deliberately kept out of the schema.",
    ],
    narrative:
      "You explain your reasoning as you go, which is the single most valuable habit in a technical interview, and you corrected yourself once without being prompted.\n\n" +
      "Where you lost marks: when asked how the design changes at a hundred times the traffic you led with the diagnosis, which was right, but on the caching and locking questions you reached for the fix before naming what you would measure. Interviewers are listening for the diagnosis first, every time.\n\n" +
      "One concrete thing to practise: for any design question, say out loud what the bottleneck is and how you would measure it, before proposing a solution.",
  },
  802: {
    questions: ALGORITHMS.questions,
    answers: [
      "I read it twice and then say it back in my own words, because half the time I have already assumed something that is not in the problem. Then I ask about size. If the input is a thousand elements I will happily write something quadratic and move on; if it is ten million that is off the table. I try to write a small example on paper before I write any code.",
      "The obvious one is checking every pair, which is quadratic. You can sort the array and walk two pointers inward, which is n log n and constant extra space. The fastest is one pass with a hash map: for each number, check whether target minus that number has already been seen. That is linear time and linear space.",
      "If the input is small the constant factors can make the log n version faster in practice. Sorting is also very well optimised in most standard libraries.",
      "It is when two different keys hash to the same bucket. You handle it either by chaining, so the bucket holds a list, or by probing to the next free slot. If collisions get bad the lookup starts walking the whole bucket, so it drifts toward linear.",
      "I would look at the constraints again first, since a hidden failure is usually the case I decided not to think about. Then I would try an empty input, a single element, and duplicates, because those three catch most of it. If none of that reproduces it, I would go back to the loop bounds rather than keep guessing.",
    ],
    marks: [14, 13, 12, 13, 12],
    notes: [
      "Restating the problem and asking about input size are exactly the right first two minutes. You did not mention stating a brute force out loud, which is what buys you credit early.",
      "All three approaches, in the right order, with the complexities attached. The space cost of the hash map was mentioned but not weighed against the two-pointer version.",
      "You named constant factors and library quality, which is the honest reason. Memory pressure and readability never came up, and one concrete example from your own work would have carried this further.",
      "Correct on the definition and on both resolution strategies. Load factor and resizing are the missing half of the answer.",
      "A systematic answer with real boundary cases. It stopped one step short of reasoning about the invariant, which is what separates narrowing down from guessing.",
    ],
    narrative:
      "Your final answers were correct, and you handled the follow-up on hash collisions well.\n\n" +
      "The gap was pace and depth under pressure. Several answers stopped at the first correct sentence rather than going one level further, and on a live call that reads as thin rather than concise.\n\n" +
      "Practise stating a brute-force approach within the first two minutes, then optimising out loud. It buys you credit early and gives the interviewer something to work with.",
  },
};

/** The three interviews a returning learner already has on their account. */
const SEED_ATTEMPTS: Attempt[] = [
  {
    id: 801,
    templateId: null,
    title: "Backend fundamentals: systems and APIs",
    topic: "Backend Engineering",
    subtopic: "APIs, data modelling, caching",
    difficulty: "Medium",
    duration_minutes: 30,
    status: "completed",
    created_at: isoDaysAgo(10),
    scheduled_date_time: null,
    started_at: isoDaysAgo(9, 18, 0),
    submitted_at: isoDaysAgo(9, 18, 26),
    answers: {},
    turn: 5,
    total_duration_seconds: 26 * 60 + 14,
    metadata: {
      tabSwitches: 0,
      windowSwitches: 1,
      fullscreen_exits: 0,
      face_validation_failures: 2,
      multiple_face_detections: 0,
      looking_away_count: 3,
    },
    result_visible_to_student: true,
    result_released_at: isoDaysAgo(9, 18, 30),
    superseded: false,
  },
  {
    id: 802,
    templateId: null,
    title: "Data structures: arrays, hashing and complexity",
    topic: "Algorithms",
    subtopic: "Arrays, hashing, complexity analysis",
    difficulty: "Hard",
    duration_minutes: 30,
    status: "completed",
    created_at: isoDaysAgo(22),
    scheduled_date_time: null,
    started_at: isoDaysAgo(21, 19, 0),
    submitted_at: isoDaysAgo(21, 19, 29),
    answers: {},
    turn: 5,
    total_duration_seconds: 28 * 60 + 41,
    metadata: {
      tabSwitches: 2,
      windowSwitches: 0,
      fullscreen_exits: 1,
      face_validation_failures: 5,
      multiple_face_detections: 1,
      looking_away_count: 9,
    },
    result_visible_to_student: true,
    result_released_at: isoDaysAgo(21, 19, 35),
    superseded: false,
  },
  {
    id: 803,
    templateId: null,
    title: "Full-stack: end-to-end feature design",
    topic: "Full-Stack Engineering",
    subtopic: "Schema, API, interface, trade-offs",
    difficulty: "Medium",
    duration_minutes: 30,
    status: "scheduled",
    created_at: isoDaysAgo(2),
    scheduled_date_time: isoDaysAhead(3, 18, 30),
    started_at: null,
    submitted_at: null,
    answers: {},
    turn: 1,
    total_duration_seconds: 0,
    metadata: {},
    result_visible_to_student: true,
    result_released_at: null,
    superseded: false,
  },
];

/** Seed merged with the visitor's overlay. The overlay always wins. */
export function allAttempts(): Attempt[] {
  const stored = storedMap();
  const merged = SEED_ATTEMPTS.map((a) => stored[String(a.id)] ?? a);
  const extra = Object.values(stored).filter(
    (a) => !SEED_ATTEMPTS.some((s) => s.id === a.id),
  );
  // Newest first: the interview the visitor just finished must be at the top of
  // "Previous interviews", not buried under a three-week-old seed row.
  return [...extra, ...merged].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
  );
}

export function attemptById(id: number): Attempt | undefined {
  return allAttempts().find((a) => a.id === id);
}

/** Questions for an attempt: hand-authored for the seeds, topic script otherwise. */
function questionsFor(attempt: Attempt): ScriptQuestion[] {
  const seeded = SEED_TRANSCRIPTS[attempt.id];
  if (seeded) return seeded.questions;
  return scriptFor(attempt.topic, attempt.subtopic).questions;
}

function closingFor(attempt: Attempt): string {
  const seeded = SEED_TRANSCRIPTS[attempt.id];
  if (seeded) return FULLSTACK.closing;
  return scriptFor(attempt.topic, attempt.subtopic).closing;
}

/** Question ids must be stable across reloads: derive them, never allocate them. */
function questionId(attemptId: number, index: number): number {
  return attemptId * 100 + index + 1;
}

function apiQuestions(attempt: Attempt) {
  return questionsFor(attempt).map((q, i) => ({
    id: questionId(attempt.id, i),
    type: q.type,
    question_text: q.text,
    question: q.text,
    expected_key_points: q.keyPoints,
    ...(i > 0 ? { follows_up_on: questionsFor(attempt)[i - 1].text } : {}),
  }));
}

/* ────────────────────────────────────────────────────────────────────────────
 * The grader
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Words that carry no signal when matching a key point against an answer.
 *
 * The meta verbs matter most. Key points are phrased as things an interviewer notices
 * ("naming the bottleneck before naming the fix"), so without this list every key point
 * would match any answer containing the word "naming".
 */
const CUE_STOPWORDS = new Set([
  "about", "actually", "after", "against", "already", "also", "answer", "anything", "attached",
  "because", "before", "being", "beyond", "both", "candidate", "case", "cases", "changed",
  "changing", "check", "checked", "checking", "choice", "choose", "concrete", "consequence",
  "could", "deciding", "decision", "deliberately", "describe", "describing", "detail",
  "different", "does", "each", "either", "else", "encourage", "even", "every", "example",
  "explain", "explained", "explaining", "factor", "follow", "followed", "found", "from",
  "gave", "genuine", "getting", "give", "given", "gives", "giving", "going", "half", "hard",
  "have", "having", "here", "honest", "honestly", "instead", "into", "issue", "itself",
  "just", "keeps", "kind", "know", "later", "left", "less", "level", "like", "listener",
  "little", "long", "made", "make", "makes", "making", "many", "mention", "mentioned",
  "mentioning", "method", "might", "more", "most", "moved", "much", "must", "name", "named",
  "naming", "need", "needs", "never", "next", "note", "noted", "number", "often", "onto",
  "other", "over", "owning", "part", "people", "picture", "piece", "plan", "point", "points",
  "problem", "proposing", "question", "rather", "reaching", "read", "reading", "real",
  "reason", "reasoning", "rely", "relying", "requirements", "responsible", "right", "said",
  "same", "saying", "says", "second", "seen", "sees", "separate", "separating", "several",
  "should", "showed", "showing", "shows", "side", "similar", "simply", "single", "situation",
  "slogan", "solution", "solving", "some", "something", "specific", "specifically", "stated",
  "stating", "step", "steps", "still", "stopped", "story", "such", "sure", "take", "taking",
  "talk", "team", "tell", "than", "that", "their", "them", "then", "there", "these", "they",
  "thing", "things", "think", "this", "those", "through", "time", "together", "told", "took",
  "toward", "trying", "used", "using", "usually", "very", "walk", "want", "well", "were",
  "what", "when", "where", "whether", "which", "while", "will", "with", "within", "without",
  "work", "worked", "would", "your", "yours",
]);

/**
 * Cue words for one key point.
 *
 * Derived from the key point's own text rather than hand-listed, so writing a new
 * question never means also writing a keyword table that then drifts out of sync.
 * Plural forms are folded to their singular because a candidate writes "indexes" as
 * often as "index".
 */
function cuesFor(keyPoint: string): string[] {
  return keyPoint
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length >= 4 && !CUE_STOPWORDS.has(w))
    .map((w) => (w.length > 5 && w.endsWith("s") ? w.slice(0, -1) : w));
}

function answerCovers(answer: string, keyPoint: string): boolean {
  const cues = cuesFor(keyPoint);
  if (cues.length === 0) return false;
  const hay = answer.toLowerCase();
  return cues.some((cue) => hay.includes(cue));
}

/** Words that show a candidate is reasoning rather than listing. */
const STRUCTURE_MARKERS = [
  "because", "so that", "which means", "the reason", "trade-off", "tradeoff", "however",
  "instead", "first", "then", "after that", "for example", "in practice", "otherwise",
  "whereas", "on the other hand", "the risk", "i would", "i'd",
];

export interface QuestionMark {
  score: number;
  max_score: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const MAX_PER_QUESTION = 20;

/**
 * Score one answer out of twenty.
 *
 * Four components, in the order an interviewer actually weighs them: did you say
 * enough to be scored at all, did you hit what was being listened for, did you reason
 * rather than assert, and were you specific. It is deliberately generous about
 * phrasing and unforgiving about silence, which is how a real rubric behaves.
 */
export function gradeAnswer(answer: string, question: ScriptQuestion): QuestionMark {
  const text = (answer || "").trim();
  const covered = question.keyPoints.filter((kp) => answerCovers(text, kp));
  const missed = question.keyPoints.filter((kp) => !covered.includes(kp));

  if (text.length === 0) {
    return {
      score: 0,
      max_score: MAX_PER_QUESTION,
      percentage: 0,
      feedback:
        "No answer was recorded for this question. In a live interview, saying what you do know " +
        "and where you would start is always worth more than silence.",
      strengths: [],
      improvements: question.keyPoints.slice(0, 3),
    };
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  const lower = text.toLowerCase();

  // Substance, out of 6. A one-line answer cannot score well no matter how apt it is.
  const substance = words >= 90 ? 6 : words >= 55 ? 5 : words >= 30 ? 4 : words >= 15 ? 2 : 1;

  // Coverage, out of 9. The heaviest single component, and the one the feedback quotes.
  const coverage = Math.round((covered.length / question.keyPoints.length) * 9);

  // Reasoning, out of 3.
  const markers = STRUCTURE_MARKERS.filter((m) => lower.includes(m)).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 12).length;
  const reasoning = Math.min(3, (markers >= 2 ? 2 : markers >= 1 ? 1 : 0) + (sentences >= 3 ? 1 : 0));

  // Specificity, out of 2: a number, a named tool, or a first-person example.
  const hasNumber = /\b\d+(\.\d+)?\b/.test(text);
  const hasFirstPerson = /\b(i|we)\s+(built|shipped|wrote|used|ran|had|found|hit|tried|debugged)\b/.test(lower);
  const specificity = (hasNumber ? 1 : 0) + (hasFirstPerson ? 1 : 0);

  const score = Math.max(1, Math.min(MAX_PER_QUESTION, substance + coverage + reasoning + specificity));
  const percentage = Math.round((score / MAX_PER_QUESTION) * 100);

  const parts: string[] = [];
  if (covered.length > 0) {
    parts.push(`You covered ${listOf(covered.slice(0, 2))}, which is what the question was reaching for.`);
  } else {
    parts.push("The answer did not yet touch what the interviewer was listening for on this question.");
  }
  if (missed.length > 0) {
    parts.push(`Nothing came up on ${listOf(missed.slice(0, 2))}, and that is where the follow-up would have gone.`);
  } else {
    parts.push("Every point was covered, so the next step is depth: one worked example would lift this further.");
  }
  if (words < 30) {
    parts.push("It was also short. Two or three more sentences would give an interviewer something to probe.");
  } else if (reasoning < 2) {
    parts.push("Say why as well as what: the reasoning is what gets scored when two candidates give the same answer.");
  }

  return {
    score,
    max_score: MAX_PER_QUESTION,
    percentage,
    feedback: parts.join(" "),
    strengths: covered.slice(0, 3),
    improvements: missed.slice(0, 3),
  };
}

function listOf(items: string[]): string {
  if (items.length === 0) return "nothing";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function bandAdvice(percentage: number): string {
  if (percentage >= 80) {
    return "You are interview-ready on this topic. The next gain is pace: answer in a headline sentence, then expand, so the interviewer can steer you.";
  }
  if (percentage >= 60) {
    return "The knowledge is there and the gap is habit. Before answering, take two seconds to decide the three things you want to land, then say them in that order.";
  }
  if (percentage >= 40) {
    return "Work on finishing answers. Several of yours stopped at the first correct sentence, and an interviewer reads that as thin rather than concise.";
  }
  return "Start with structure rather than recall. Say what the question is really asking, what you would check first, and what you would do about it. That shape alone lifts a weak answer to an average one.";
}

/** The full `evaluation_score` object the result page renders. */
export function evaluate(attempt: Attempt) {
  const questions = questionsFor(attempt);
  const seeded = SEED_TRANSCRIPTS[attempt.id];
  const hasOwnAnswers = Object.keys(attempt.answers).length > 0;

  const marks: QuestionMark[] = questions.map((q, i) => {
    if (seeded && !hasOwnAnswers) {
      const covered = q.keyPoints.filter((kp) => answerCovers(seeded.answers[i] ?? "", kp));
      return {
        score: seeded.marks[i],
        max_score: MAX_PER_QUESTION,
        percentage: Math.round((seeded.marks[i] / MAX_PER_QUESTION) * 100),
        feedback: seeded.notes[i],
        strengths: covered.slice(0, 3),
        improvements: q.keyPoints.filter((kp) => !covered.includes(kp)).slice(0, 2),
      };
    }
    return gradeAnswer(attempt.answers[String(questionId(attempt.id, i))] ?? "", q);
  });

  const overall = marks.reduce((sum, m) => sum + m.score, 0);
  const max = marks.length * MAX_PER_QUESTION;
  const percentage = max > 0 ? Math.round((overall / max) * 100) : 0;

  const questionScores: Record<string, QuestionMark> = {};
  marks.forEach((m, i) => {
    questionScores[String(questionId(attempt.id, i))] = m;
  });

  const strengths = dedupe(marks.flatMap((m) => m.strengths)).slice(0, 4);
  const improvements = dedupe(marks.flatMap((m) => m.improvements)).slice(0, 4);

  const answered = marks.filter((m) => m.score > 0).length;
  const best = marks.reduce((a, b) => (b.percentage > a.percentage ? b : a), marks[0]);
  const worst = marks.reduce((a, b) => (b.percentage < a.percentage ? b : a), marks[0]);
  const bestIndex = marks.indexOf(best);
  const worstIndex = marks.indexOf(worst);

  const narrative = seeded && !hasOwnAnswers
    ? seeded.narrative
    : [
        `You answered ${answered} of the ${marks.length} questions and scored ${percentage} percent overall.`,
        bestIndex >= 0 && best.strengths.length > 0
          ? `Your strongest answer was question ${bestIndex + 1}, where you covered ${listOf(best.strengths.slice(0, 2))}.`
          : "No single answer stood out yet, which usually means the answers were about the same length rather than about the same quality.",
        worstIndex >= 0 && worst.improvements.length > 0
          ? `The clearest gap was question ${worstIndex + 1}: ${listOf(worst.improvements.slice(0, 2))} never came up.`
          : "",
        bandAdvice(percentage),
      ]
        .filter(Boolean)
        .join("\n\n");

  return {
    overall_score: overall,
    max_possible_score: max,
    overall_percentage: percentage,
    question_scores: questionScores,
    strengths,
    areas_for_improvement: improvements,
    overall_feedback: narrative,
  };
}

function dedupe(items: string[]): string[] {
  return [...new Set(items)];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Projections consumed by mock-interview.ts
 * ──────────────────────────────────────────────────────────────────────────── */

/** The `MockInterview` row every list surface renders. */
export function attemptToApi(attempt: Attempt) {
  const scored = attempt.status === "completed" ? evaluate(attempt) : null;
  return {
    id: attempt.id,
    title: attempt.title,
    topic: attempt.topic,
    subtopic: attempt.subtopic,
    difficulty: attempt.difficulty,
    duration_minutes: attempt.duration_minutes,
    status: attempt.status,
    created_at: attempt.created_at,
    scheduled_date_time: attempt.scheduled_date_time ?? undefined,
    // Included so the list can date a COMPLETED interview by when it actually
    // happened. An interview started on the spot has no scheduled time, which is
    // exactly the case the previous-interviews table lists.
    submitted_at: attempt.submitted_at ?? undefined,
    score: scored ? scored.overall_percentage : undefined,
    feedback: scored ? scored.overall_feedback : undefined,
  };
}

/**
 * The `MockInterviewDetail` the result page renders and the take page starts from.
 *
 * One payload serves three consumers, which is why it looks over-full:
 *   - the take page reads `questions_for_interview` (with `is_dynamic` false it drives
 *     the typed, index-based flow, which is the only flow that works without a speech
 *     service);
 *   - the adaptive-course interview page reads `current_question` and turn counters;
 *   - the result page reads `evaluation_score`, `interview_transcript` and `student`.
 */
export function attemptDetail(attempt: Attempt) {
  const questions = apiQuestions(attempt);
  const seeded = SEED_TRANSCRIPTS[attempt.id];
  const hasOwnAnswers = Object.keys(attempt.answers).length > 0;

  const responses = questions.map((q, i) => ({
    question_id: q.id,
    question_text: q.question_text,
    answer:
      attempt.answers[String(q.id)] ??
      (seeded && !hasOwnAnswers ? seeded.answers[i] ?? "" : ""),
  }));
  const answered = responses.filter((r) => r.answer.trim().length > 0);

  const isDone = attempt.status === "completed";
  const scored = isDone ? evaluate(attempt) : null;
  const turnIndex = Math.min(Math.max(1, attempt.turn), questions.length);

  return {
    id: attempt.id,
    title: attempt.title,
    topic: attempt.topic,
    subtopic: attempt.subtopic,
    difficulty: attempt.difficulty,
    status: attempt.status,
    duration_minutes: attempt.duration_minutes,
    created_at: attempt.created_at,
    updated_at: attempt.submitted_at ?? attempt.started_at ?? attempt.created_at,
    scheduled_date_time: attempt.scheduled_date_time ?? undefined,
    started_at: attempt.started_at ?? undefined,
    submitted_at: attempt.submitted_at ?? undefined,

    // `is_dynamic: false` is a decision, not an omission. True puts the take page into
    // voice-only mode: it hides the answer textarea AND the navigation buttons, so a
    // candidate whose browser cannot do speech recognition has literally no way to
    // answer. False gives them the typed flow with the question list, and voice still
    // appends to the textarea when it happens to work.
    is_dynamic: false,
    questions_for_interview: questions,
    questions,
    current_question: questions[turnIndex - 1] ?? questions[0] ?? null,
    turn_number: turnIndex,
    max_turns: questions.length,
    bonus_seconds: 0,
    is_resume: attempt.status === "in_progress" && answered.length > 0,
    resume_window_expired: false,
    conversation_history: answered.map((r) => ({
      question_id: r.question_id,
      question_text: r.question_text,
      answer: r.answer,
    })),

    grading_scheme: Object.fromEntries(
      questions.map((q, i) => [
        String(q.id),
        {
          criteria: questionsFor(attempt)[i].keyPoints.map((kp) => ({
            criterion: kp,
            points: 5,
          })),
          max_score: MAX_PER_QUESTION,
          excellent_answer: "Every key point covered, with a worked example and the trade-off named.",
          good_answer: "Most key points covered, with reasoning attached to at least one of them.",
          average_answer: "The right idea, stated once, without the reasoning or an example.",
          poor_answer: "A general statement that would fit almost any question on this topic.",
        },
      ]),
    ),

    evaluation_score: scored ?? undefined,

    interview_transcript: {
      responses,
      logs: [],
      total_duration_seconds: attempt.total_duration_seconds,
      metadata: {
        total_questions: questions.length,
        completed_questions: answered.length,
        tabSwitches: attempt.metadata.tabSwitches ?? 0,
        windowSwitches: attempt.metadata.windowSwitches ?? 0,
        fullscreen_exits: attempt.metadata.fullscreen_exits ?? 0,
        face_validation_failures: attempt.metadata.face_validation_failures ?? 0,
        multiple_face_detections: attempt.metadata.multiple_face_detections ?? 0,
        looking_away_count: attempt.metadata.looking_away_count ?? 0,
        screenResolution: "1512 x 982",
        userAgent: "AI Linc proctored session",
        timestamp: Date.parse(attempt.submitted_at ?? attempt.created_at),
      },
    },

    student: {
      id: STUDENT_PERSONA.id,
      user_name: STUDENT_PERSONA.full_name,
      profile_pic_url: STUDENT_PERSONA.profile_pic_url,
      role: "student",
    },

    // Always visible. See the note on `result_release_mode` above.
    result_visible_to_student: true,
    result_released_at: attempt.result_released_at ?? attempt.submitted_at ?? null,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * Creating attempts
 * ──────────────────────────────────────────────────────────────────────────── */

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

function normaliseDifficulty(value: unknown): "Easy" | "Medium" | "Hard" {
  const raw = String(value ?? "Medium").toLowerCase();
  const found = DIFFICULTIES.find((d) => d.toLowerCase() === raw);
  return found ?? "Medium";
}

function titleFor(topic: string, subtopic: string): string {
  const t = topic.trim() || "Software engineering";
  const s = subtopic.trim();
  return s && s.toLowerCase() !== t.toLowerCase() ? `${t}: ${s}` : `${t} interview`;
}

function newAttempt(input: {
  templateId: number | null;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration_minutes: number;
  scheduledAt: string | null;
}): Attempt {
  const now = iso(new Date(nowMs()));
  return saveAttempt({
    id: nextDemoId("mock-interview"),
    templateId: input.templateId,
    title: input.title,
    topic: input.topic,
    subtopic: input.subtopic,
    difficulty: input.difficulty,
    duration_minutes: input.duration_minutes,
    status: input.scheduledAt ? "scheduled" : "pending",
    created_at: now,
    scheduled_date_time: input.scheduledAt,
    started_at: null,
    submitted_at: null,
    answers: {},
    turn: 1,
    total_duration_seconds: 0,
    metadata: {},
    result_visible_to_student: true,
    result_released_at: null,
    superseded: false,
  });
}

function requireAttempt(rawId: string): Attempt {
  const found = attemptById(Number(rawId));
  if (!found) throw notFound("Interview not found");
  return found;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Admin-side attempt rows
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Who has attempted a template.
 *
 * A cohort of classmates plus the signed-in learner's own attempts, so the admin's
 * attempts dialog is a real list rather than a single row. The classmates are drawn
 * with the seeded PRNG keyed on the template id, so the same six people are on the
 * same template on every reload.
 */
function templateAttempts(templateId: number) {
  const cohort = seededSample(`interview:cohort:${templateId}`, STUDENTS, 6);
  const seededRows = cohort.map((person, i) => {
    const done = seededInt(`interview:done:${templateId}:${person.id}`, 0, 10) > 2;
    const daysBack = seededInt(`interview:when:${templateId}:${person.id}`, 1, 18);
    return {
      id: 8300 + templateId % 100 * 10 + i,
      student_id: person.id,
      student_name: person.full_name,
      student_email: person.email,
      status: done ? "completed" : "in_progress",
      started_at: isoDaysAgo(daysBack, 17, 0),
      submitted_at: done ? isoDaysAgo(daysBack, 17, 26) : null,
      result_visible_to_student: done,
      result_released_at: done ? isoDaysAgo(daysBack, 17, 30) : null,
      has_evaluation: done,
      superseded: false,
    };
  });

  const mine = allAttempts()
    .filter((a) => a.templateId === templateId)
    .map((a) => ({
      id: a.id,
      student_id: STUDENT_PERSONA.id,
      student_name: STUDENT_PERSONA.full_name,
      student_email: STUDENT_PERSONA.email,
      status: a.status,
      started_at: a.started_at,
      submitted_at: a.submitted_at,
      result_visible_to_student: a.result_visible_to_student,
      result_released_at: a.result_released_at,
      has_evaluation: a.status === "completed",
      superseded: a.superseded,
    }));

  return [...mine, ...seededRows];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Routes
 * ──────────────────────────────────────────────────────────────────────────── */

defineRoutes(MODULE, {
  /**
   * Quick Start and Schedule both land here. Quick Start sends no `scheduled_at` and
   * then routes straight to the device check; Schedule sends one and the attempt shows
   * up under the Scheduled tab, which is the only proof a prospect gets that the form
   * did anything.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const topic = String(body.topic ?? body.job_role ?? "Software Engineering").trim();
    const subtopic = String(body.subtopic ?? topic).trim();
    const duration = Number(body.duration_minutes);
    const attempt = newAttempt({
      templateId: null,
      title: titleFor(topic, subtopic),
      topic,
      subtopic,
      difficulty: normaliseDifficulty(body.difficulty),
      // 2 minutes is reserved by the take page for an admin clipboard mode, so a
      // duration that low would put a candidate into a surface built for someone else.
      duration_minutes: Number.isFinite(duration) && duration >= 5 ? Math.round(duration) : 20,
      scheduledAt: body.scheduled_at ? String(body.scheduled_at) : null,
    });
    return attemptToApi(attempt);
  },

  /**
   * Claim a course interview. The card on /mock-interview/courses becomes a real
   * attempt with its own id, and the page then routes to that id's device check.
   */
  "POST /mock-interview/api/clients/:clientId/interview-templates/:templateId/start/": (req) => {
    const template = templateById(Number(req.params.templateId));
    if (!template) throw notFound("Interview not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const duration = Number(body.duration_minutes);
    const attempt = newAttempt({
      templateId: template.id,
      title: template.title,
      topic: template.topic,
      subtopic: template.subtopic,
      difficulty: template.difficulty,
      duration_minutes:
        Number.isFinite(duration) && duration >= 5 ? Math.round(duration) : template.duration_minutes,
      scheduledAt: null,
    });
    const opening = scriptFor(template.topic, template.subtopic).questions[0];
    return {
      ...attemptToApi(attempt),
      // Lets the device check prewarm the opening line before the candidate clicks
      // Begin, so the interviewer speaks the moment the take page paints.
      opening_question_text: opening.text,
    };
  },

  /**
   * Begin (or resume) an attempt.
   *
   * The take page calls this from two places: the device check hands the response over
   * in sessionStorage, and the Scheduled tab's Take button goes straight to /take and
   * calls it directly. Both must work, so nothing here depends on the device check
   * having run.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/start/": (req) => {
    const attempt = requireAttempt(req.params.interviewId);
    if (attempt.status === "completed") {
      // The take page reads `error` (not `detail`) off a 400 and routes to the result
      // page when it contains "completed", which is exactly what we want here.
      throw badRequest({ error: "This interview is already completed." });
    }
    const started: Attempt = {
      ...attempt,
      status: "in_progress",
      started_at: attempt.started_at ?? iso(new Date(nowMs())),
    };
    saveAttempt(started);
    return attemptDetail(started);
  },

  /**
   * Backing out of the device check. Best effort by design: the client fires this and
   * ignores the response, and an attempt that already reached the interviewer must stay
   * resumable rather than being marked failed behind the candidate's back.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/abandon/": (req) => {
    const attempt = attemptById(Number(req.params.interviewId));
    if (!attempt) return { detail: "Nothing to abandon." };
    if (attempt.status === "in_progress" || attempt.status === "completed") {
      return { detail: "Interview already under way; left resumable." };
    }
    saveAttempt({ ...attempt, status: "failed" });
    return { detail: "Attempt released." };
  },

  /**
   * The next turn of the conversation.
   *
   * Used by the adaptive-course interview surface, which is turn-driven. The take page
   * runs the indexed flow instead and never calls this, but both have to agree about
   * what turn the candidate is on, so the answer is recorded here either way.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/next-question/": (req) => {
    const attempt = requireAttempt(req.params.interviewId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const questions = apiQuestions(attempt);
    const previousId = Number(body.previous_question_id);
    const answer = String(body.candidate_answer ?? "").trim();

    const previousIndex = questions.findIndex((q) => q.id === previousId);
    const index = previousIndex >= 0 ? previousIndex : attempt.turn - 1;

    const answers = { ...attempt.answers };
    if (answer) answers[String(questions[index]?.id ?? previousId)] = answer;

    const nextIndex = index + 1;
    const forceClose = body.force_close === true;
    const isDone = forceClose || nextIndex >= questions.length;

    saveAttempt({
      ...attempt,
      answers,
      turn: Math.min(questions.length, nextIndex + 1),
      status: "in_progress",
    });

    if (isDone) {
      return {
        question: null,
        is_final_question: true,
        turn_number: questions.length,
        max_turns: questions.length,
        interview_complete: true,
        is_closing_remark: true,
        closing_remark: closingFor(attempt),
        bonus_seconds: 0,
        coding_time_budget_seconds: 0,
      };
    }

    return {
      question: questions[nextIndex],
      is_final_question: nextIndex === questions.length - 1,
      turn_number: nextIndex + 1,
      max_turns: questions.length,
      interview_complete: false,
      bonus_seconds: 0,
      coding_time_budget_seconds: 0,
    };
  },

  /**
   * "Actually, can I go back?" The candidate asks for the previous question out loud
   * and the interviewer re-asks it with their earlier answer restored, so nothing they
   * already said is thrown away.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/rewind/": (req) => {
    const attempt = requireAttempt(req.params.interviewId);
    const questions = apiQuestions(attempt);
    const currentIndex = Math.min(Math.max(1, attempt.turn), questions.length) - 1;
    if (currentIndex <= 0) {
      throw badRequest({ error: "There is no earlier question to go back to." });
    }
    const targetIndex = currentIndex - 1;
    const removed = questions[currentIndex];
    const answers = { ...attempt.answers };
    const previousAnswer = answers[String(questions[targetIndex].id)] ?? "";
    delete answers[String(removed.id)];

    saveAttempt({ ...attempt, answers, turn: targetIndex + 1 });

    return {
      question: questions[targetIndex],
      turn_number: targetIndex + 1,
      max_turns: questions.length,
      previous_answer: previousAnswer,
      removed_question_id: removed.id,
    };
  },

  /**
   * Submit, score, done.
   *
   * The real backend returns 202 here and scores in a worker, which is why the result
   * page polls. There is no worker to wait for, so the evaluation is written before
   * this returns and the very first poll finds it. That single change is what turns
   * the old "EVALUATING YOUR INTERVIEW for ninety seconds, then an error" into a result
   * that is on screen before the page finishes its transition.
   */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/submit/": (req) => {
    const attempt = requireAttempt(req.params.interviewId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const transcript = (body.transcript ?? {}) as Record<string, unknown>;
    const incoming = Array.isArray(transcript.responses)
      ? (transcript.responses as Array<Record<string, unknown>>)
      : [];
    const meta = (transcript.metadata ?? {}) as Record<string, unknown>;

    const answers = { ...attempt.answers };
    for (const response of incoming) {
      const qid = Number(response.question_id);
      const text = String(response.answer ?? "").trim();
      if (Number.isFinite(qid) && text) answers[String(qid)] = text;
    }

    const duration = Number(transcript.total_duration_seconds);
    const now = iso(new Date(nowMs()));
    const submitted: Attempt = {
      ...attempt,
      answers,
      status: "completed",
      started_at: attempt.started_at ?? now,
      submitted_at: now,
      turn: apiQuestions(attempt).length,
      total_duration_seconds: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 0,
      metadata: {
        tabSwitches: numberOr(meta.tabSwitches, 0),
        windowSwitches: numberOr(meta.windowSwitches, 0),
        fullscreen_exits: numberOr(meta.fullscreen_exits, 0),
        face_validation_failures: numberOr(meta.face_validation_failures, 0),
        multiple_face_detections: numberOr(meta.multiple_face_detections, 0),
        looking_away_count: numberOr(meta.looking_away_count, 0),
      },
      result_visible_to_student: true,
      result_released_at: now,
    };
    saveAttempt(submitted);
    return attemptDetail(submitted);
  },

  /** Grant one student a retake. Their attempt stops blocking the pending list. */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/admin/reattempt/": (req) => {
    const id = Number(req.params.interviewId);
    const attempt = attemptById(id);
    if (attempt) saveAttempt({ ...attempt, superseded: true });
    return {
      id,
      superseded: true,
      message: "Reattempt granted. The interview is back in the student's pending list.",
    };
  },

  /** Publish one result to the student it belongs to. */
  "POST /mock-interview/api/clients/:clientId/mock-interviews/:interviewId/admin/release-result/": (req) => {
    const id = Number(req.params.interviewId);
    const releasedAt = iso(new Date(nowMs()));
    const attempt = attemptById(id);
    if (attempt) {
      saveAttempt({ ...attempt, result_visible_to_student: true, result_released_at: releasedAt });
    }
    return {
      id,
      result_visible_to_student: true as const,
      result_released_at: releasedAt,
      message: "Result released. The student can see their score and feedback now.",
    };
  },

  /* ── Template management (admin) ─────────────────────────────────────────
   * These are invisible to scripts/demo-coverage.mjs because the service builds
   * their URLs from a module-level constant, so nothing flagged them. They are the
   * whole of /admin/admin-mock-interview/templates, which is a create form, a list,
   * an attempts dialog and five buttons, all of which did nothing.
   */

  "POST /mock-interview/api/clients/:clientId/interview-templates/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const courseIds = Array.isArray(body.course_ids) ? (body.course_ids as unknown[]) : [];
    const adaptiveIds = Array.isArray(body.adaptive_course_ids)
      ? (body.adaptive_course_ids as unknown[])
      : [];
    const courseId = Number(courseIds[0] ?? adaptiveIds[0] ?? COURSES[0].id);
    const topic = String(body.topic ?? "Software Engineering").trim();
    const template: DemoTemplate = {
      id: nextDemoId("interview-template"),
      courseId,
      title: String(body.title ?? titleFor(topic, "")).trim(),
      topic,
      subtopic: String(body.subtopic ?? "").trim(),
      difficulty: normaliseDifficulty(body.difficulty),
      duration_minutes: Number(body.duration_minutes) || 20,
      description: String(body.description ?? "").trim(),
      is_active: body.is_active !== false,
      num_coding_questions: Number(body.num_coding_questions) || 0,
      num_mcq_questions: Number(body.num_mcq_questions) || 0,
      createdDaysAgo: 0,
    };
    overlay.push("interview:templates", template);
    return templateToApi(template);
  },

  "GET /mock-interview/api/clients/:clientId/interview-templates/:templateId/": (req) => {
    const template = templateById(Number(req.params.templateId));
    if (!template) throw notFound("Interview template not found");
    return templateToApi(template);
  },

  "PATCH /mock-interview/api/clients/:clientId/interview-templates/:templateId/": (req) => {
    const id = Number(req.params.templateId);
    const template = templateById(id);
    if (!template) throw notFound("Interview template not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const patch: Partial<DemoTemplate> = {};
    if (body.title != null) patch.title = String(body.title);
    if (body.topic != null) patch.topic = String(body.topic);
    if (body.subtopic != null) patch.subtopic = String(body.subtopic);
    if (body.difficulty != null) patch.difficulty = normaliseDifficulty(body.difficulty);
    if (body.duration_minutes != null) patch.duration_minutes = Number(body.duration_minutes) || 20;
    if (body.description != null) patch.description = String(body.description);
    if (body.is_active != null) patch.is_active = body.is_active !== false;
    if (Array.isArray(body.course_ids) && body.course_ids.length > 0) {
      patch.courseId = Number((body.course_ids as unknown[])[0]);
    }
    if (body.num_coding_questions != null) {
      patch.num_coding_questions = Number(body.num_coding_questions) || 0;
    }
    if (body.num_mcq_questions != null) {
      patch.num_mcq_questions = Number(body.num_mcq_questions) || 0;
    }
    overlay.update<Record<string, Partial<DemoTemplate>>>(
      "interview:templates:patch",
      {},
      (all) => ({ ...all, [String(id)]: { ...(all[String(id)] ?? {}), ...patch } }),
    );
    return templateToApi({ ...template, ...patch });
  },

  "DELETE /mock-interview/api/clients/:clientId/interview-templates/:templateId/": (req) => {
    const id = Number(req.params.templateId);
    overlay.update<number[]>("interview:templates:deleted", [], (list) =>
      list.includes(id) ? list : [...list, id],
    );
    return null;
  },

  "GET /mock-interview/api/clients/:clientId/interview-templates/:templateId/attempts/": (req) =>
    templateAttempts(Number(req.params.templateId)),

  "POST /mock-interview/api/clients/:clientId/interview-templates/:templateId/release-results/": (req) => {
    const id = Number(req.params.templateId);
    const rows = templateAttempts(id);
    const pending = rows.filter((r) => r.has_evaluation && !r.result_visible_to_student).length;
    for (const attempt of allAttempts().filter((a) => a.templateId === id && a.status === "completed")) {
      saveAttempt({
        ...attempt,
        result_visible_to_student: true,
        result_released_at: attempt.result_released_at ?? iso(new Date(nowMs())),
      });
    }
    return {
      template_id: id,
      released: pending,
      message:
        pending > 0
          ? `Released ${pending} result${pending === 1 ? "" : "s"} to students.`
          : "Every scored attempt on this interview was already visible to its student.",
    };
  },

  "POST /mock-interview/api/clients/:clientId/interview-templates/:templateId/reattempt/": (req) => {
    const id = Number(req.params.templateId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const scope = String(body.status ?? "all");
    const rows = templateAttempts(id).filter((r) =>
      scope === "completed"
        ? r.status === "completed"
        : scope === "failed"
          ? r.status !== "completed"
          : true,
    );
    for (const attempt of allAttempts().filter((a) => a.templateId === id)) {
      saveAttempt({ ...attempt, superseded: true });
    }
    return {
      template_id: id,
      scope,
      granted: rows.length,
      message: `Reattempt granted to ${rows.length} student${rows.length === 1 ? "" : "s"}.`,
    };
  },

  "POST /mock-interview/api/clients/:clientId/interview-templates/:templateId/evaluate-pending/": (req) => ({
    template_id: Number(req.params.templateId),
    queued: 0,
    message: "Every completed attempt on this interview is already scored.",
  }),

  /* ── Proctoring ──────────────────────────────────────────────────────────── */

  /**
   * Who is in the exam room right now.
   *
   * Real data: the students the seed says are mid-assessment, with the connection
   * quality and publishing flags the monitor grid renders. Deterministic, so the same
   * six people are in the room on every refresh rather than the roster reshuffling
   * under the invigilator every ten seconds.
   */
  "GET /proctoring/api/clients/:clientId/assessments/:assessmentId/live-participants/": (req) => {
    const assessmentId = Number(req.params.assessmentId);
    const room = `assessment-${assessmentId}`;
    const cohort = seededSample(`live:${assessmentId}`, STUDENTS, 6);
    const participants = cohort.map((person, i) => ({
      identity: `user-${person.id}`,
      name: person.full_name,
      email: person.email,
      user_id: person.id,
      joined_at: Date.parse(isoDaysAgo(0, 10, 5 + i * 3)),
      is_publishing_video: true,
      is_publishing_audio: seededInt(`live:aud:${assessmentId}:${person.id}`, 0, 10) > 2,
      connection_quality: seededPick(`live:q:${assessmentId}:${person.id}`, [1, 1, 1, 2]),
    }));
    return {
      room,
      participant_count: participants.length,
      participants,
    };
  },

  /**
   * A LiveKit publish/subscribe token.
   *
   * This is the one thing in the module that genuinely cannot be faked: a token is
   * only useful for opening a WebSocket to a media server, and there is no media
   * server and no network. Returning a token with no URL makes the monitor page print
   * "Set NEXT_PUBLIC_LIVEKIT_URL", which is our debug text in front of a prospect, and
   * returning a token with a made-up URL leaves the page connecting forever.
   *
   * So it fails, deliberately, with one sentence a person can read. The monitor page
   * renders it in an alert with a Retry button, and the student-side publisher treats
   * any failure here as non-fatal and carries on with the exam.
   */
  "POST /proctoring/api/clients/:clientId/livekit/token/": () => {
    throw badRequest({
      detail:
        "Live video monitoring streams from a media server, which this preview does not run. " +
        "Everything else on this page, including the participant list and the violation log, is live.",
    });
  },

  /**
   * A proctoring violation. Recorded rather than discarded, because the admin's
   * violation report reads from the same store and a demo where the two disagree is
   * worse than a demo with no violations at all.
   */
  "POST /proctoring/api/clients/:clientId/violations/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const id = `viol-${nextDemoId("violation")}`;
    overlay.unshift("proctoring:violations", {
      id,
      assessment_id: body.assessment_id ?? null,
      exam_id: body.exam_id ?? null,
      type: String(body.violation_type ?? "UNKNOWN"),
      message: String(body.message ?? "Proctoring event"),
      severity: String(body.severity ?? "low"),
      timestamp: String(body.timestamp ?? iso(new Date(nowMs()))),
      confidence: numberOr(body.confidence, 0),
      user_id: req.auth?.userId ?? STUDENT_PERSONA.id,
    });
    return {
      success: true,
      message: "Violation recorded.",
      violation_id: id,
    };
  },

  /* ── Session recordings ──────────────────────────────────────────────────── */

  /**
   * A signed playback token for a past live session's recording.
   *
   * Answered, and answered with no token on purpose. The player builds a <video src>
   * from the token and points it at the streaming endpoint, and a plain <video>
   * request never reaches this adapter (it is not axios), so a token here would
   * produce a black box with a broken player rather than a recording. Without one the
   * dialog shows its own "Recording is not available yet" copy, which is the honest
   * state and the one the component was designed for.
   */
  "GET /live-class/api/clients/:clientId/live-activities/:liveClassId/recording/playback/": (req) => ({
    live_class_id: Number(req.params.liveClassId),
    token: null,
    detail: "The recording for this session is still being processed.",
  }),
});

function numberOr(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
