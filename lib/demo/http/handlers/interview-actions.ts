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
 *   - Each topic has a fixed set of five questions, written the way a selection board,
 *     a bank panel or a trade test examiner actually asks them, each with the key
 *     points that panel is listening for.
 *   - The candidate types (voice still works if the browser's own SpeechRecognition
 *     happens to function, but nothing depends on it).
 *   - Submit scores every answer against its key points immediately and returns the
 *     result. No polling, no "our AI is thinking", no 90-second timeout.
 *
 * The five panels are the ones this tenant's candidates actually sit in front of: a
 * TGPSC Group-I and Group-II board, a bank probationary officer interview, a Telangana
 * police sub-inspector board, a solar and electrical trade test viva, and an enterprise
 * readiness panel. There is no coding round anywhere in the module and the seed comment
 * on SEED_TEMPLATES explains why that zero is load-bearing.
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

/**
 * A TGPSC Group-I and Group-II interview board.
 *
 * The five things a state service board actually opens with: the detailed
 * application form in front of them, the home district written on it, why the public
 * service at all, an opinion on something current, and one ethics situation from the
 * post the candidate is applying for.
 */
const GROUP_BOARD: Script = {
  questions: [
    {
      text: "Your detailed application form is in front of me. Take the board through it yourself: education, what you have done since, and the one entry on it you most expect us to open on.",
      type: "behavioral",
      keyPoints: [
        "your education and employment history in the order it happened",
        "the reason behind a gap year or a repeat attempt",
        "the hobby or optional subject you have written down",
        "the one entry a board is most likely to open on",
      ],
    },
    {
      text: "Take the board through your home district. What is it known for, and what is the one problem there you would take up if you were posted back to it?",
      type: "behavioral",
      keyPoints: [
        "the district with its administrative and geographic setting",
        "an industry, crop or institution the district is known for",
        "one local problem rather than a national one",
        "what a posted officer could realistically do about it",
      ],
    },
    {
      text: "Why the public service, and why now? With your qualification you could take a private job tomorrow.",
      type: "behavioral",
      keyPoints: [
        "a motive grounded in something you have witnessed yourself",
        "what the service can do that a private job cannot",
        "the department or cadre you are aiming at",
        "honesty about the salary and security part of it",
      ],
    },
    {
      text: "Pick one decision the government has taken in the last year that you have an opinion on. Tell me what it does, and where you think it is weak.",
      type: "situational",
      keyPoints: [
        "the decision described accurately before it is judged",
        "who benefits and who bears the cost",
        "a weakness stated without turning into a political speech",
        "what you would watch to know whether it is working",
      ],
    },
    {
      text: "Last one. You are the officer in charge of a scheme payment. A senior you respect asks you to clear a file that you know is short of one document. What do you do, and what do you do next?",
      type: "situational",
      keyPoints: [
        "the rule or procedure that governs that file",
        "refusing in writing rather than only in conversation",
        "the escalation route above the person asking",
        "what the delay costs the beneficiary waiting on that payment",
      ],
    },
  ],
  closing:
    "That is everything the board wanted to ask. You stayed with the question instead of reciting prepared matter, which is what a board is actually testing. Submit whenever you are ready and your feedback is on the next screen.",
};

/**
 * A bank probationary officer interview.
 *
 * A bank panel is not a general studies board. It wants to know that you understand
 * what a branch does, that you chose banking rather than fell into it, that you can
 * stand at a counter, and that you can hold a simple economics answer without
 * reciting a definition.
 */
const BANK_PANEL: Script = {
  questions: [
    {
      text: "Start with the obvious one. Why banking, and why a probationary officer rather than any other government post you are eligible for?",
      type: "behavioral",
      keyPoints: [
        "a motive specific to banking rather than to any government post",
        "what a probationary officer does in the first two years",
        "the branch posting and transfer you are accepting",
        "something from the sector you have followed recently",
      ],
    },
    {
      text: "Explain to me what a non-performing asset is, why a bank cares so much about it, and what a branch can do before an account becomes one.",
      type: "technical",
      keyPoints: [
        "an asset stops earning when repayment is overdue past a fixed period",
        "provisioning, and what it does to the bank profit",
        "the early warning signal a branch can act on",
        "recovery and restructuring as different routes",
      ],
    },
    {
      text: "A customer at your counter is angry. Money has left her account through a failed transaction and it has not come back, and she is not interested in your process. How do you handle the next five minutes?",
      type: "situational",
      keyPoints: [
        "handling the person before explaining the system",
        "the actual reversal timeline and the complaint you raise",
        "what you commit to and what you do not promise",
        "the record you leave so the next officer can continue",
      ],
    },
    {
      text: "Basic economy now. When the Reserve Bank raises the repo rate, walk me through what happens to your branch, to your borrower and to your depositor.",
      type: "technical",
      keyPoints: [
        "the repo rate as the cost of bank borrowing",
        "lending rates and the loan instalment moving up",
        "deposit rates and what the saver does",
        "the inflation it is aimed at, and the delay before it bites",
      ],
    },
    {
      text: "Last one. Your branch is behind on an insurance target and your manager wants every loan applicant to be offered a policy. A farmer in front of you clearly does not want one. What do you do?",
      type: "situational",
      keyPoints: [
        "mis-selling and what the regulator treats it as",
        "a target treated as a target and not as a licence",
        "what you would say to your manager afterwards",
        "an alternative that meets the customer's own requirement",
      ],
    },
  ],
  closing:
    "That is the end of the panel. You answered the counter question as a person rather than as a policy, which is the half of this interview that cannot be revised for. Submit when you are ready.",
};

/**
 * A Telangana police sub-inspector board.
 *
 * Almost entirely situational, because that is what the board is. The questions put
 * the candidate at a scene and ask for an order of actions and a reason for that
 * order, which is the only thing a board can test in fifteen minutes.
 */
const POLICE_BOARD: Script = {
  questions: [
    {
      text: "Why the police service, and what have you actually done to be ready for it? Take the ground events and the written test separately.",
      type: "behavioral",
      keyPoints: [
        "a motive beyond the security of a government post",
        "your current running, endurance or event preparation",
        "the written paper you are weakest at and the plan for it",
        "what your family thinks about the posting and the hours",
      ],
    },
    {
      text: "You reach a road accident before the ambulance. There is a crowd, one injured man, and a vehicle blocking the highway. Order your actions and tell me why that order.",
      type: "situational",
      keyPoints: [
        "the injured person first, and the golden hour",
        "crowd control and preserving the scene",
        "the wireless message and the control room call you make",
        "the case record and the seizure memo that come later",
      ],
    },
    {
      text: "Two groups in a village are about to clash over a procession route. You are the sub-inspector of that station and you have six constables. What do you do before it starts, and what do you do if it starts anyway?",
      type: "situational",
      keyPoints: [
        "the elders on both sides, spoken to before the day",
        "the permission, the route and the condition attached",
        "asking for additional force in time rather than late",
        "minimum force, and the record you keep of what you did",
      ],
    },
    {
      text: "Somebody influential in the district asks you to go easy on a case. He is not threatening you, he is being friendly. What actually happens next?",
      type: "situational",
      keyPoints: [
        "the law leaves you no discretion on registering it",
        "keeping the conversation on record with your superior",
        "the difference between courtesy and a favour",
        "what happens to you and to the station if you agree",
      ],
    },
    {
      text: "Last one. A woman comes to your station at eleven at night to complain, and the officer on duty tells her to come back in the morning. You hear it. What do you do that night, and what do you do afterwards?",
      type: "situational",
      keyPoints: [
        "the complaint taken at once, and zero-hour registration",
        "what the law requires regardless of station convenience",
        "correcting the officer without a scene in front of her",
        "the follow-up so it does not happen in that station again",
      ],
    },
  ],
  closing:
    "That is the last of it. A board is watching whether you decide at all, not whether you decide perfectly, and you did decide. Submit when you are ready.",
};

/**
 * A solar and electrical trade test viva.
 *
 * A trade examiner opens on safety and stays there until satisfied, then asks for one
 * fault the candidate traced with their own hands, then the instruments they own, then
 * the standard they work to. Nothing here can be answered from a book.
 */
const TRADE_VIVA: Script = {
  questions: [
    {
      text: "Before we talk about any job you have done: what do you check before you start work on an installation, and what would make you refuse to start at all?",
      type: "technical",
      keyPoints: [
        "isolation, lock-out and proof that the circuit is dead",
        "the gloves, helmet and safety shoes you actually put on",
        "the ladder, the roof and the weather before you climb",
        "the condition that makes you stop and call the supervisor",
      ],
    },
    {
      text: "Tell me about a fault you traced yourself. What were the symptoms, what did you measure, and what turned out to be wrong?",
      type: "technical",
      keyPoints: [
        "the symptom described before the cause is guessed",
        "the multimeter, clamp meter or megger you put on it",
        "narrowing it down instead of replacing parts",
        "what you altered so the same fault would not return",
      ],
    },
    {
      text: "Which tools and instruments do you own, and which one do you reach for first on a job you have not seen before?",
      type: "technical",
      keyPoints: [
        "instruments named individually, not just a tool kit",
        "the clamp meter, earth tester or insulation tester and its use",
        "calibration and the condition your tools are in",
        "the instrument missing from your kit and the job it would unlock",
      ],
    },
    {
      text: "Which standard or specification governs the work you do, and where do you actually look it up?",
      type: "technical",
      keyPoints: [
        "a named standard, code or specification and not company practice",
        "the earthing, cable size or clearance value it fixes",
        "how you tell a genuine material from a counterfeit one",
        "what you record and hand over when the job is closed",
      ],
    },
    {
      text: "Last one. A customer wants the job finished today and asks you to skip a step you know matters. Walk me through the conversation.",
      type: "situational",
      keyPoints: [
        "the skipped step named, and the failure it prevents",
        "the risk put in the customer's own terms",
        "what you offer instead of a flat refusal",
        "putting it in writing before you leave the site",
      ],
    },
  ],
  closing:
    "That is the whole viva. You led with the safety check rather than with the fix, which is exactly what a trade test examiner is grading. Submit when you are ready.",
};

/**
 * An enterprise readiness panel.
 *
 * The panel a candidate faces before a unit is recommended for credit: what the unit
 * is, what one piece of it costs and sells for, who buys it, and what happens when the
 * money runs short. It is friendlier than a board and harder to bluff.
 */
const ENTERPRISE_PANEL: Script = {
  questions: [
    {
      text: "Describe the unit you want to start, or the one you already run. What does it make, who works in it, and where does it sit?",
      type: "behavioral",
      keyPoints: [
        "the product and the quantity per day or per month",
        "the premises, the power and the machinery it needs",
        "the labour you employ and what each of them does",
        "the stage it has reached today, told plainly",
      ],
    },
    {
      text: "Take one unit of what you sell. What does it cost you to make, what do you sell it for, and how much do you have to sell in a month before you stop losing money?",
      type: "technical",
      keyPoints: [
        "the material cost separated from the labour cost",
        "rent, power and interest counted as fixed cost",
        "the selling price and the margin per piece",
        "the break-even reached as a monthly quantity of pieces",
      ],
    },
    {
      text: "Who buys from you, and why do they buy from you rather than from the person doing the same thing two villages away?",
      type: "situational",
      keyPoints: [
        "a named buyer or channel, not everybody in the area",
        "the price, quality or delivery difference you offer",
        "how you found the first customers you had",
        "what happens when your largest buyer stops buying",
      ],
    },
    {
      text: "You need working capital. Walk me through where you would go, what the bank will ask you for, and what you would do if the answer is no.",
      type: "technical",
      keyPoints: [
        "the loan scheme or lender you would approach, and why that one",
        "the project report, quotation and bank statement asked for",
        "repayment shown from the unit's own cash flow",
        "what you do about a rejection instead of stopping",
      ],
    },
    {
      text: "Last one. The unit runs for six months and then a machine breaks and an order is cancelled in the same week. What actually happens to the business, and what do you do?",
      type: "situational",
      keyPoints: [
        "the cash reserve, or the lack of one, told plainly",
        "who you pay first when you cannot pay everybody",
        "telling the bank early rather than after the instalment",
        "the change you make so that week does not repeat",
      ],
    },
  ],
  closing:
    "That is everything the panel wanted. You gave numbers where you had them and said so where you did not, which is the answer a credit committee trusts. Submit when you are ready.",
};

/** Fallback for a topic an aspirant typed themselves in Quick Start. */
function generalScript(topic: string): Script {
  const t = topic.trim() || "this subject";
  return {
    questions: [
      {
        text: `Let's start broadly. What brought you to ${t}, and what have you studied or practised in it so far?`,
        type: "behavioral",
        keyPoints: [
          "a piece of training, work or preparation you can name",
          "a decision you took yourself, and what it cost you",
          "a motive you can defend rather than a rehearsed line",
          "what you struggled with and how you got past it",
        ],
      },
      {
        text: `Pick one thing in ${t} that people usually get wrong, and explain it the way you wish somebody had explained it to you.`,
        type: "technical",
        keyPoints: [
          "the misconception named precisely",
          "the correct version, in plain words",
          "an everyday illustration the listener can hold on to",
          "why the wrong version is tempting",
        ],
      },
      {
        text: `Walk me through how you would handle something in ${t} that you had not come across before.`,
        type: "situational",
        keyPoints: [
          "reading it properly before answering it",
          "breaking it into parts you can handle",
          "the assumption you would state out loud",
          "how you would verify the result before committing to it",
        ],
      },
      {
        text: `Tell me about a trade-off you have had to make in ${t}. What did you give up, and why was that right?`,
        type: "technical",
        keyPoints: [
          "both sides of it, stated fairly",
          "the one thing that finally decided it",
          "the cost you accepted knowingly",
          "how it turned out, told without polishing",
        ],
      },
      {
        text: `Last one. If you had one month to get significantly better at ${t}, what would you actually do?`,
        type: "behavioral",
        keyPoints: [
          "a weekly routine rather than a wish",
          "the test or number you would measure progress against",
          "what you would stop doing to make room",
          "an honest sense of the gap between today and ready",
        ],
      },
    ],
    closing: `That is everything on ${t}. Thank you for thinking it through out loud rather than reaching for the prepared answer. Submit when you are ready and your feedback appears immediately.`,
  };
}

/**
 * Pick the panel for a topic string.
 *
 * Topics arrive from three places with three vocabularies: a course tag ("TGPSC",
 * "Solar PV"), the Quick Start picker, and a free-typed custom topic. Matching on
 * substrings rather than an exact map means an aspirant who types "sub inspector"
 * still reaches the police board instead of the generic conversation.
 *
 * Order matters. Enterprise is tested before banking because "SHG bank linkage" is an
 * enterprise topic that contains the word bank, and the two panels ask for opposite
 * things: one wants unit economics, the other wants counter judgement.
 */
function scriptFor(topic: string, subtopic = ""): Script {
  const hay = `${topic} ${subtopic}`.toLowerCase();
  const has = (...words: string[]) => words.some((w) => hay.includes(w));

  if (has("police", "tglprb", "constable", "sub-inspector", "sub inspector", "law and order"))
    return POLICE_BOARD;
  if (
    has(
      "enterprise", "entrepreneur", "micro-enterprise", "business plan", "break-even", "udyam",
      "mudra", "shg", "pmegp", "cgtmse", "fpo", "producer company", "aggregation", "enam",
      "bookkeeping", "subsidy", "self-help", "digital marketing", "ondc", "online selling",
    )
  )
    return ENTERPRISE_PANEL;
  if (
    has(
      "bank", "ibps", "sbi", "rbi", "nabard", "probationary officer", "junior associate",
      "financial inclusion", "data interpretation", "economic and social issues", "insurance",
    )
  )
    return BANK_PANEL;
  if (
    has(
      "tgpsc", "group-i", "group-ii", "group-iii", "group i", "group ii", "civil service",
      "public service", "general studies", "telangana movement", "mains answer writing",
      "polity", "ethics",
    )
  )
    return GROUP_BOARD;
  if (
    has(
      "solar", "rooftop", "net metering", "electrician", "electrical", "wiring", "earthing",
      "motor control", "installer", "installation", "technician", "soldering", "board level",
      "mobile repair", "trade test", "workshop", "maintenance",
    )
  )
    return TRADE_VIVA;
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

/**
 * What to call the practice, in the words the candidate's own selection uses.
 *
 * Derived from the panel the topic actually routes to rather than from the course
 * category, so the label can never promise a stage the selection does not have. A
 * Group-II candidate practises a board and a solar trainee practises a viva, but the
 * SSC and railway selections in this catalogue do not end at a panel at all, so they
 * fall through to the neutral word. Calling them boards would be the demo asserting
 * something about a real recruitment that is not so.
 */
const PANEL_NOUNS = new Map<Script, string>([
  [GROUP_BOARD, "board"],
  [POLICE_BOARD, "board"],
  [BANK_PANEL, "interview"],
  [TRADE_VIVA, "viva"],
  [ENTERPRISE_PANEL, "panel"],
]);

function panelNoun(topic: string, subtopic: string): string {
  // generalScript builds a fresh object every call, so it never matches and lands on
  // the fallback, which is the intended answer for a selection with no final panel.
  return PANEL_NOUNS.get(scriptFor(topic, subtopic)) ?? "interview";
}

/**
 * One practice interview attached to each course.
 *
 * `num_coding_questions: 0` and `num_mcq_questions: 0` on every one of them, and that
 * zero is the whole reason this module is safe to leave switched on for this tenant.
 * The module ships a Monaco coding round and an MCQ round, neither of which belongs in
 * a catalogue of recruitment exams and vocational trades: a coding editor in front of a
 * solar trainee is the single most obvious way to reveal that the product was ported
 * from a software LMS. Both rounds are data rather than structure, so seeding them at
 * zero means no aspirant is ever handed an editor, and what is left is the one stage
 * these candidates are most afraid of. Group-I ends at a board, bank probationary
 * officer selection ends at an interview, sub-inspector selection ends at a board, and
 * a trade course ends at a viva. `coding_time_budget_seconds` is returned as 0 from
 * /next-question/ for exactly the same reason. If either number is ever raised here,
 * keeping the module on stops being safe.
 *
 * `createdDaysAgo` counts backwards in twos rather than in fours, because with
 * nineteen courses a step of four ran past today and dated the last few templates into
 * the future.
 */
const SEED_TEMPLATES: DemoTemplate[] = COURSES.map((course, index): DemoTemplate => {
  const topic = course.tags[0] ?? course.title;
  const subtopic = course.tags.slice(1, 3).join(", ");
  const noun = panelNoun(topic, subtopic);
  return {
    id: 8100 + index,
    courseId: course.id,
    title: `Practice ${noun} for ${course.title}`,
    topic,
    subtopic,
    difficulty:
      course.difficulty === "Advanced" ? "Hard" : course.difficulty === "Beginner" ? "Easy" : "Medium",
    duration_minutes: 20,
    description:
      `A five-question practice ${noun} on ${course.title}. The panel works through what the course ` +
      `actually teaches, and your answers are scored on structure and specificity as well as on ` +
      `being right. There is no written round and no coding round in it.`,
    is_active: true,
    num_coding_questions: 0,
    num_mcq_questions: 0,
    createdDaysAgo: 46 - index * 2,
  };
});

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

/**
 * The board that interviewed the aspirant persona ten days ago.
 *
 * Deliberately not `GROUP_BOARD.questions`: a prospect who reads this transcript and
 * then takes a Group-II board from the courses tab should get a different set, so the
 * second interview is not a rehearsal of the one they just finished reading.
 */
const GROUP_II_BOARD_QUESTIONS: ScriptQuestion[] = [
  {
    text: "Your form says Kakatiya University, and that this is your second attempt at Group-II. Take the board through what you changed between the first attempt and this one.",
    type: "behavioral",
    keyPoints: [
      "the paper or section that actually cost you the first time",
      "a change of method rather than a change of effort",
      "evidence from mock tests or marks that it worked",
      "the weakness that is still not fixed",
    ],
  },
  {
    text: "Warangal is on your form as your home district. What is it known for, and if you were posted there tomorrow, what would you take up first?",
    type: "behavioral",
    keyPoints: [
      "the district's own history, industry or institution",
      "one local problem, put concretely",
      "what a Group-II post can do about it, and what it cannot",
      "the office or department you would need on your side",
    ],
  },
  {
    text: "Give me your opinion on one welfare scheme you have seen operate in your own mandal. Not what it promises, what you have watched it do.",
    type: "situational",
    keyPoints: [
      "the scheme described accurately before it is judged",
      "what you personally observed rather than were told",
      "the gap between the design and the delivery",
      "one change you would make, with its cost attached",
    ],
  },
  {
    text: "You have written the Telangana movement as an interest. Tell me why the Mulki rules mattered, in three sentences.",
    type: "technical",
    keyPoints: [
      "employment for local residents at the heart of the rule",
      "employment as the grievance rather than language alone",
      "the link forward to the later phase of the movement",
      "three sentences, not a prepared essay",
    ],
  },
  {
    text: "Last one. You are a Group-II officer and a file on your table would benefit a relative. Nobody else knows. What do you do?",
    type: "situational",
    keyPoints: [
      "declaring the connection and putting it in writing",
      "handing the file to somebody else to decide",
      "why nobody knowing is not the test",
      "what you do if the relative comes back a second time",
    ],
  },
];

const SEED_TRANSCRIPTS: Record<number, SeedTranscript> = {
  801: {
    questions: GROUP_II_BOARD_QUESTIONS,
    answers: [
      "The first time I lost the paper on Telangana history and the movement, which I had assumed I already knew because I grew up with those stories. My general studies section was fine and that one was not. What I changed was method rather than hours. I stopped reading and started writing: one fifteen mark answer a day, timed, and a senior at the study circle corrected it against the key instead of me marking my own. My mock marks in that paper moved from the low forties to the high sixties over four months. The weakness that is still not fixed is my speed in the arithmetic section, where I finish about six questions short every time.",
      "Warangal was the Kakatiya capital, so it carries the fort and the Thousand Pillar temple, with Ramappa close by, and there is a working history of handloom and cotton around it along with the railway junction at Kazipet. The local problem I would take up is that much of the cotton leaves the district unginned, so the value is added somewhere else and the grower sees none of it. A Group-II post in a revenue or municipal role cannot build an industry, but it can move land conversion and trade licences for a ginning or warehousing unit in weeks instead of months, and it can keep the market yard weighment honest. What it cannot do is set the price.",
      "I have watched the pension delivery in my mandal. The scheme is a fixed monthly amount credited to an account, and the credit is genuinely reliable for anybody who has a working account and a biometric that reads. The people who miss out are the very old, whose fingerprints do not register, and widows whose branch is twenty kilometres away with no bus after noon. The design assumes a functioning account and the delivery fails exactly where the account is weakest. The one change I would make is a certified doorstep payment through the postal network for the oldest beneficiaries, which costs more per payment and reaches the person the scheme was actually written for.",
      "The Mulki rules mattered because they tied government employment in the Hyderabad state to people who were residents of it, so employment, and not language, was the grievance a household could feel directly. When the safeguards were read as having been set aside after the states were reorganised, the demand stopped being administrative and became political. That is the link forward: a rule about jobs turned into a question about who the state belongs to, and it runs through 1969 into the later phase of the movement.",
      "I would record the connection on the file itself, in writing, and put a note to my superior asking for the file to be dealt with by another officer. I would not decide it either way, because approving it and rejecting it are both decisions I should not be the one making. Nobody knowing is not the test. The test is whether the decision would survive being read out in front of the people it affects.",
    ],
    marks: [17, 16, 15, 16, 14],
    notes: [
      "A strong opening. You named the paper that actually cost you, you changed method rather than hours, and you had the mock marks to show for it. Leaving the arithmetic weakness in the answer rather than hiding it is what a board reads as self-knowledge.",
      "Real content: the history, the crop, the workshop, and a problem tied to value leaving the district rather than a general complaint. You did not say which office or department you would need on your side to move it, and that is the follow-up a board asks.",
      "You described what you had watched rather than what the scheme promises, and the change you proposed came with its cost attached. You did not separate what you saw yourself from what you were told, and on a welfare question a board tests that line.",
      "Employment as the grievance, and the link forward from the rules to the later movement, is exactly the shape this answer needed. It was asked for in three sentences and ran to five, and on a board a long answer is not a full answer, it is one fewer question.",
      "The declaration and the handover were right, and the point about the decision surviving being read out is the sentence a board remembers. You did not say what you would do if the relative came back a second time, which is where this question usually goes.",
    ],
    narrative:
      "You answered as yourself rather than out of a coaching handout, and a board notices that inside the first two minutes. The district answer and the scheme answer both had things in them that only somebody who has actually been there would say.\n\n" +
      "Where you lost marks: length. Three of the five answers carried on past the point where you had made your case, and the Mulki question was asked for in three sentences. On a board that is not thoroughness, it is a smaller number of questions and less of you on the record.\n\n" +
      "One concrete thing to practise: answer in one sentence, stop, and let the board ask for the rest. Rehearse the stopping, not only the matter.",
  },
  802: {
    questions: BANK_PANEL.questions,
    answers: [
      "I took the IBPS exam because banking is the one government post where the work on day one is the work later on: you are at a counter and you are handling somebody else's money. My district has a lot of first time account holders and the branch is where a scheme stops being an announcement and becomes a payment. I know a probationary officer spends the first two years on the counter, at the loan desk and on field verification, and that the posting can be anywhere.",
      "An asset stops being performing when the borrower has not paid interest or principal for a fixed period, and the bank then has to set money aside against it, so the profit falls before any money has actually been lost. In the branch the early warning signals are cheque returns, an account that sits at its limit every month, and a borrower who stops answering the phone. If it is caught at that stage the account can usually be brought back.",
      "I would say first that the money is hers and that it is coming back, before I explain anything about the system, because she is not angry about the process. Then I would raise the complaint at the counter in front of her, give her the reference number, and tell her the reversal timeline the bank is actually bound by rather than the one that sounds better. I would not promise her a date I do not control.",
      "When the repo rate goes up, the bank's own borrowing costs more, so lending rates follow and the borrower's instalment rises on a floating loan. Deposit rates go up as well, usually later than the lending rates do, so the saver gains a little and gains it slowly.",
      "I would not push it. If he does not want the policy then the sale is mis-selling, the regulator treats it as that, and the complaint comes back against my name and not against the target sheet. I would tell my manager that I offered it, that he declined and that I recorded the refusal, and I would ask what else is counting towards the target that I can actually do.",
    ],
    marks: [14, 13, 12, 13, 12],
    notes: [
      "You gave a reason specific to banking rather than to any government post, and you knew what a probationary officer actually does in the first two years. Nothing came from the sector itself, and a panel expects a candidate to have followed something in banking over the last month.",
      "The definition, the provisioning consequence and the branch level early warnings were all there, which is more than this question usually gets. Recovery and restructuring never came up as separate routes, and that is the half that decides what the branch does next.",
      "Handling the person before the process is the right order, and giving the complaint reference in front of her is the detail that shows counter sense. You did not say what you would leave on record for the next officer, which is what protects the customer after you go home.",
      "Correct and in the right sequence: borrowing cost, lending rate, instalment, deposit rate. It stopped at the mechanism. Why the rate was moved at all, and the delay before it bites, is the part that separates understanding the policy from reciting the plumbing.",
      "You named mis-selling and took it to the regulator rather than to your own discomfort, which is the right level to answer at. There was no alternative offered to the farmer, and a panel is listening for the candidate who can meet a target without harming a customer.",
    ],
    narrative:
      "Your banking knowledge is solid and your instinct on the counter question was better than your knowledge answers.\n\n" +
      "The pattern across the five was the same: you answered the question and stopped, without the one further sentence that turns a correct answer into a memorable one. On four of the five, the thing you left out was the consequence, what it means for the customer, for the branch or for the policy.\n\n" +
      "Before the next panel, practise adding one closing sentence to every answer that says what it means for the person on the other side of the counter.",
  },
};

/** The three interviews the aspirant persona already has on her account. */
const SEED_ATTEMPTS: Attempt[] = [
  {
    id: 801,
    templateId: null,
    title: "TGPSC Group-II: interview board practice",
    topic: "TGPSC",
    subtopic: "Group-II, home district, ethics",
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
    title: "IBPS PO: bank interview panel",
    topic: "IBPS",
    subtopic: "Banking awareness, customer handling, economy",
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
    title: "Solar PV: trade test viva practice",
    topic: "Solar PV",
    subtopic: "Safety, fault finding, standards",
    difficulty: "Easy",
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
  // Seeded attempts are all completed or scheduled, so this branch is a fallback
  // rather than a path a candidate walks. The board closing is the neutral one.
  if (seeded) return GROUP_BOARD.closing;
  return scriptFor(attempt.topic, attempt.subtopic).closing;
}

/** Question ids must be stable across reloads: derive them, never allocate them. */
function questionId(attemptId: number, index: number): number {
  return attemptId * 100 + index + 1;
}

function apiQuestions(attempt: Attempt) {
  const script = questionsFor(attempt);
  return script.map((q, i) => ({
    id: questionId(attempt.id, i),
    type: q.type,
    question_text: q.text,
    question: q.text,
    expected_key_points: q.keyPoints,
    ...(i > 0 ? { follows_up_on: script[i - 1].text } : {}),
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
        "No answer was recorded for this question, so it scores zero. In front of a board, " +
        "saying what you do know and where you would start is always worth more than silence.",
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
    return "You are ready for the panel on this topic. The next gain is pace: answer in one sentence, then expand, so the board can steer you instead of waiting for you to finish.";
  }
  if (percentage >= 60) {
    return "The matter is there and the gap is habit. Before you answer, take two seconds to decide the three things you want to land, then say them in that order.";
  }
  if (percentage >= 40) {
    return "Work on finishing answers. Several of yours stopped at the first correct sentence, and a board reads that as thin rather than as concise.";
  }
  return "Start with structure rather than with recall. Say what the question is really asking, what you would check or consider first, and what you would do about it. That shape alone lifts a weak answer to an average one.";
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
          excellent_answer: "Every point covered, with one concrete example and the difficulty named.",
          good_answer: "Most points covered, with a reason attached to at least one of them.",
          average_answer: "The right idea, said once, without the reason or the example.",
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
        userAgent: "TSEM proctored session",
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
  const t = topic.trim() || "General studies";
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
    const topic = String(body.topic ?? body.job_role ?? "General Studies").trim();
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
        // Zero on purpose, and it stays zero. See the note on SEED_TEMPLATES: a
        // non-zero budget here is what opens the Monaco coding round, which has no
        // place in front of an aspirant sitting a recruitment board or a trade viva.
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
      message: "Reattempt granted. The interview is back in the aspirant's pending list.",
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
      message: "Result released. The aspirant can see their score and feedback now.",
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
    const topic = String(body.topic ?? "General Studies").trim();
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
          ? `Released ${pending} result${pending === 1 ? "" : "s"} to aspirants.`
          : "Every scored attempt on this interview was already visible to its aspirant.",
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
      message: `Reattempt granted to ${rows.length} aspirant${rows.length === 1 ? "" : "s"}.`,
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
