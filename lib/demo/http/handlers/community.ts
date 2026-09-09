/**
 * The community forum: seed, shared state, and the read surface.
 *
 * Threads are written as questions an aspirant or a trainee on these exact
 * courses would actually ask: how a Group-II paper treats 1969, why an inverter
 * trips at noon and not in the morning, what to charge for a lined blouse. The
 * answers read like peers and faculty rather than documentation, and the faculty
 * answers are deliberately the better ones, because that is the claim the
 * product is making.
 * This is the module where filler is most obvious: a forum full of "Great post"
 * tells an evaluating officer that nobody uses it.
 *
 * The cast is the shared roster, so the person who wrote the top thread is the
 * same person sitting at rank 3 on the dashboard leaderboard.
 *
 * Everything below the route table is exported on purpose. The write side of the
 * forum (post a reply, follow a person, start a room, claim a bounty) lives in
 * `community-actions.ts`, and a reply that does not show up in the thread it was
 * posted to is a worse lie than an error. So the seed, the overlay keys and the
 * payload builders live here, once, and both modules read the same state.
 */

import { defineRoutes } from "../router";
import { notFound, type DemoAuth } from "../types";
import {
  STUDENT_PERSONA,
  STUDENTS,
  FACULTY,
  INSTRUCTOR_PERSONA,
  ADMIN_PERSONA,
  ALL_PEOPLE,
  personById,
  type DemoPerson,
} from "../../db/people";
import { overlay } from "../../db/overlay";
import { iso, isoDaysAgo, isoDaysAhead, minutesAgo, nowMs } from "../../clock";
import { seededInt, seededSample } from "../../random";

const MODULE = "community";

/* ------------------------------------------------------------------ people */

export type XpTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * The @handle a person is addressed by.
 *
 * `user_name` on the roster is the person's full name, which is what every card
 * renders, but an @mention cannot carry a space: `MentionText` stops the token
 * at the first one. So mentions and /community/u/<name> links use this form, and
 * `personByHandle` accepts anything that reduces to the same letters.
 */
export function handleOf(person: DemoPerson): string {
  return `${person.first_name}.${person.last_name}`.toLowerCase().replace(/[^a-z.]/g, "");
}

function foldName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Resolve "sandhya.macherla", "Sandhya Macherla" or "SandhyaMacherla" to one person. */
export function personByHandle(handle: string): DemoPerson | undefined {
  const wanted = foldName(handle);
  if (!wanted) return undefined;
  return ALL_PEOPLE.find(
    (p) =>
      foldName(handleOf(p)) === wanted ||
      foldName(p.full_name) === wanted ||
      foldName(p.email.split("@")[0]) === wanted,
  );
}

/**
 * Community XP, which is NOT the same currency as course points.
 *
 * Keyed exactly as the leaderboard has always keyed it (`cxp:<id>`) so a
 * person's number is identical on the leaderboard, on their profile and in the
 * avatar ring on their comments. The signed-in learner is the exception: their
 * balance is live, because they earn IP during the demo.
 */
export function communityXp(person: DemoPerson): number {
  if (person.id === STUDENT_PERSONA.id) return xpBalance();
  return seededInt(`cxp:${person.id}`, 300, 4200);
}

const TIER_FLOORS: ReadonlyArray<{ tier: XpTier; label: string; floor: number; next: number | null }> = [
  { tier: "bronze", label: "Bronze", floor: 0, next: 1000 },
  { tier: "silver", label: "Silver", floor: 1000, next: 3000 },
  { tier: "gold", label: "Gold", floor: 3000, next: 6000 },
  { tier: "platinum", label: "Platinum", floor: 6000, next: null },
];

export function tierOf(balance: number) {
  const band = [...TIER_FLOORS].reverse().find((b) => balance >= b.floor) ?? TIER_FLOORS[0];
  const span = (band.next ?? Math.max(balance, 1)) - band.floor;
  return {
    balance,
    tier: band.tier,
    tier_display: band.label,
    next_tier_threshold: band.next,
    progress_pct: band.next
      ? Math.min(100, Math.round(((balance - band.floor) / Math.max(1, span)) * 100))
      : 100,
  };
}

export function author(person: DemoPerson) {
  return {
    id: person.id,
    user_name: handleOf(person),
    name: person.full_name,
    profile_pic_url: person.profile_pic_url,
    role: person.role,
    xp_tier: tierOf(communityXp(person)).tier,
  } as const;
}

/** Who is looking. Signed out falls back to the learner persona, never null. */
export function viewerOf(req: { auth: DemoAuth | null }): DemoPerson {
  return (req.auth ? personById(req.auth.userId) : undefined) ?? STUDENT_PERSONA;
}

/* -------------------------------------------------------------------- tags */

export interface CommunityTag {
  id: number;
  name: string;
}

const SEED_TAGS: CommunityTag[] = [
  { id: 1, name: "tgpsc" },
  { id: 2, name: "telangana-movement" },
  { id: 3, name: "general-studies" },
  { id: 4, name: "current-affairs" },
  { id: 5, name: "ibps-po" },
  { id: 6, name: "reasoning" },
  { id: 7, name: "exam-strategy" },
  { id: 8, name: "solar-pv" },
  { id: 9, name: "electrician" },
  { id: 10, name: "tailoring" },
  { id: 11, name: "shg-finance" },
  { id: 12, name: "micro-enterprise" },
];

/** Seed tags plus anything the visitor created in the new-post dialog. */
export function allTags(): CommunityTag[] {
  return [...SEED_TAGS, ...overlay.get<CommunityTag[]>("community:tags", [])];
}

export function tagsByIds(ids: number[]): CommunityTag[] {
  const all = allTags();
  return ids
    .map((id) => all.find((t) => t.id === id))
    .filter((t): t is CommunityTag => Boolean(t));
}

/* ----------------------------------------------------------------- threads */

export type PostType = "question" | "poll" | "resource" | "humorous" | "discussion";

interface SeedComment {
  by: DemoPerson;
  body: string;
  upvotes: number;
  daysAgo: number;
  /** Index of the comment in this thread that this one answers. */
  replyTo?: number;
  accepted?: boolean;
}

interface SeedThread {
  id: number;
  title: string;
  body: string;
  by: DemoPerson;
  tags: number[];
  upvotes: number;
  daysAgo: number;
  postType: PostType;
  comments: SeedComment[];
  pollOptions?: string[];
  pollResults?: number[];
  bountyPoints?: number;
  /** Bounty already paid out, to the author of the comment at this index. */
  bountyClaimedComment?: number;
  pinned?: boolean;
}

/**
 * The seeded forum.
 *
 * Every thread is a question one of these nineteen courses actually produces,
 * asked in the words the person would use. Two of them are faults with a real
 * diagnosis and a real answer (the inverter that trips at noon, the earth
 * leakage device that only trips on two loads at once), because a forum whose
 * technical threads resolve to "check your connections" tells a trainer that
 * nobody who knows the trade has ever posted here.
 *
 * Faculty answers are deliberately the better ones. A peer gets the shape of the
 * answer right and the faculty member supplies the reason underneath it, the
 * caveat, or the sentence that wins the argument with a customer. That contrast
 * is the claim the product is making, so it has to be visible in the seed and
 * not asserted in a marketing line.
 *
 * `STUDENT_PERSONA` really did write 3001 and really did answer on 3003. The XP
 * ledger below cites both, and a ledger that credits the signed-in learner for
 * work the seed does not contain is the kind of thing an evaluator checks.
 *
 * Nothing here states a vacancy count, a fee, a cut-off or an exam date. Where
 * an answer needs a number that a notification sets, it says so and points the
 * reader at the notification instead of inventing one.
 */
const SEED_THREADS: SeedThread[] = [
  {
    id: 3001,
    title: "Is 1969 asked as history or as polity, and how deep does Group-II go?",
    body:
      "One of the Group-II papers is entirely Telangana movement and state formation, but 1969 keeps " +
      "turning up in the general studies questions too, and a previous paper asked about Article " +
      "371-D, which is polity. I cannot tell whether to prepare the agitation as a sequence of events " +
      "or as a constitutional consequence, and this is my second attempt so I do not have a year to " +
      "spend finding out. How deep does the paper actually go?",
    by: STUDENT_PERSONA,
    tags: [1, 2],
    upvotes: 34,
    daysAgo: 2,
    postType: "question",
    comments: [
      {
        by: STUDENTS[4],
        body:
          "Both, and they are not the same preparation. The dedicated paper wants the sequence: what " +
          "triggered the agitation, who led it, what it demanded, what was conceded and in what order. " +
          "The general studies and polity questions want the consequence, which is Article 371-D and " +
          "the Presidential order behind it. I keep two pages, one timeline and one list of " +
          "provisions, and I revise them separately.",
        upvotes: 41,
        daysAgo: 2,
      },
      {
        by: INSTRUCTOR_PERSONA,
        body:
          "Rajkumar has the split right. Two things worth adding, because this is where the marks " +
          "usually go.\n\n" +
          "First, the chain matters more than any single date. Non-implementation of the safeguards " +
          "agreed at the time of states reorganisation is what the agitation was about. The agitation " +
          "is what produced the negotiated formulas that followed it. Those formulas are what produced " +
          "the constitutional amendment that inserted Article 371-D. And 371-D is what produced the " +
          "Presidential order on public employment and the administrative tribunal that goes with it. " +
          "If you can say that chain in five sentences you can answer a question on 1969 from either " +
          "paper.\n\n" +
          "Second, do not learn 371-D as a heading. Learn what it does: it lets the President provide " +
          "for equitable opportunities in public employment and education by local area within the " +
          "state, and it is the reason zonal and local cadre rules exist here at all. The question " +
          "asks what it enables, never what number it carries.\n\n" +
          "For depth, work backwards from the question papers rather than forwards from a reading " +
          "list. Take three years of papers, mark every question that touches 1969, and you will find " +
          "the range is narrower than the books suggest. Then read the syllabus annexure attached to " +
          "the notification you are actually sitting, because the paper split is set there and not by " +
          "anything you read on a forum.",
        upvotes: 52,
        daysAgo: 1,
        accepted: true,
      },
      {
        by: STUDENT_PERSONA,
        body:
          "The chain is what I was missing. I had the timeline and the article on separate pages and " +
          "never joined them. Rewriting both as one page tonight.",
        upvotes: 6,
        daysAgo: 1,
        replyTo: 1,
      },
    ],
  },
  {
    id: 3002,
    title: "Reasoning eats my whole prelims clock and I never reach the easy quant marks",
    body:
      "IBPS PO prelims practice. The section timer gives me twenty minutes for reasoning and I spend " +
      "fourteen of them on one seating arrangement set that I then get wrong. By the time quant opens " +
      "I am rattled and I attempt eighteen sums instead of twenty-five. The knowledge is not the " +
      "problem. Something about how I spend those twenty minutes is.",
    by: STUDENTS[9],
    tags: [5, 6],
    upvotes: 27,
    daysAgo: 4,
    postType: "question",
    bountyPoints: 150,
    comments: [
      {
        by: FACULTY[1],
        body:
          "Sectional timing means you cannot carry minutes across, so the only question is how the " +
          "twenty are spent. Two changes fix most of this.\n\n" +
          "One, order the section instead of reading it in order. Inequality, syllogism, direction " +
          "sense, blood relation, alphanumeric series and coding-decoding are single questions with no " +
          "set-up cost. Clear those first. That is a block of marks in six or seven minutes and it " +
          "settles you before anything hard.\n\n" +
          "Two, treat puzzles and seating arrangement as optional and choose them by reading, not by " +
          "hope. Read the whole set of conditions once. If after that reading you cannot fix at least " +
          "one position with certainty, leave it and look at the next set. A set you can start is " +
          "worth five marks. A set you cannot start is worth nothing however long you sit on it. And " +
          "do not begin a new set after minute fifteen, because an unfinished set scores the same as " +
          "an untouched one and costs you the review pass as well.\n\n" +
          "Eighteen sums attempted calmly beat twenty-five attempted in a panic, so do not try to fix " +
          "the quant number until the reasoning habit has changed. Check the notification for the " +
          "pattern and the sectional times of the exam you are sitting, since those are set there.",
        upvotes: 33,
        daysAgo: 4,
        accepted: true,
      },
      {
        by: STUDENTS[9],
        body:
          "Three mocks with the ordering change. Reasoning attempts went from fourteen to twenty-two " +
          "and I stopped carrying the panic into quant. The rule about not starting a set after minute " +
          "fifteen is the one that actually did it.",
        upvotes: 9,
        daysAgo: 3,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3003,
    title: "Third attempt at Group-II. What should I actually change this time?",
    body:
      "Cleared prelims twice and did not make the final list either time. My instinct is to start the " +
      "syllabus again from page one, and I suspect that is exactly the wrong instinct. I am not asking " +
      "for encouragement. I am asking what a third attempt should be doing differently from a second.",
    by: STUDENTS[13],
    tags: [7, 1, 3],
    upvotes: 58,
    daysAgo: 6,
    postType: "discussion",
    pinned: true,
    comments: [
      {
        by: INSTRUCTOR_PERSONA,
        body:
          "Starting from page one is the wrong instinct and you already know why: it is the " +
          "comfortable part. A third attempt fails for one of three reasons and they need different " +
          "work, so the first job is to find out which one you are.\n\n" +
          "Take your last attempt and sort every question you lost into three piles. Never studied. " +
          "Studied and could not recall. Knew it and still marked wrong.\n\n" +
          "If the first pile is largest you have a coverage problem, and finishing the syllabus really " +
          "is the job. That is the only case where starting again is right, and even then you start " +
          "from the list of what is missing.\n\n" +
          "If the second pile is largest you have a revision problem, not a knowledge problem. Reading " +
          "it again will not touch it. What works is closed-book recall and a revision schedule that " +
          "returns to a topic on a date rather than when you happen to feel uneasy about it.\n\n" +
          "If the third pile is largest the problem is paper craft: misreading the question, changing " +
          "a right answer, guessing where you should have left it. You fix that with rules written " +
          "down before the exam and followed on the day without renegotiating them.\n\n" +
          "One more thing, since you cleared prelims twice. If you reach mains and not the list, the " +
          "marks are going in answer writing and in the interview, and neither is fixed by more " +
          "reading. Write eight answers a week and have them read by someone who will mark them down. " +
          "That is the least comfortable advice in this thread and it is the one that moves a third " +
          "attempt.",
        upvotes: 71,
        daysAgo: 6,
        accepted: true,
      },
      {
        by: STUDENT_PERSONA,
        body:
          "Second attempt here, so one behind you. The three piles took me an evening and it was " +
          "uncomfortable in a useful way. Mine was almost entirely the second pile, which meant the " +
          "year I spent re-reading the standard books did very little. What changed it was writing the " +
          "recall down: closed book, one page a topic, then checking against the book afterwards. I " +
          "also stopped keeping current affairs by date and started keeping one page per syllabus " +
          "heading, which is the only reason I can find anything now.",
        upvotes: 24,
        daysAgo: 4,
        accepted: true,
      },
      {
        by: STUDENTS[20],
        body:
          "Third attempt as well. The thing nobody says out loud is that the timetable has to fit the " +
          "job you have now and not the one you had as a student. I get two hours on a weekday and I " +
          "stopped pretending otherwise. Two honest hours beat six planned ones.",
        upvotes: 18,
        daysAgo: 5,
      },
    ],
  },
  {
    id: 3004,
    title: "Rooftop inverter trips around noon on a clear day and runs fine all morning",
    body:
      "Three kilowatt rooftop system at a house in Warangal, commissioned four months ago. On a clear " +
      "day it runs from morning without trouble and then trips somewhere between twelve and two. It " +
      "reconnects on its own after a few minutes and then trips again. On a cloudy day it never trips. " +
      "The owner is convinced the panels are faulty. I do not think they are, because the fault " +
      "follows the time of day and not the panels. Where should I be looking?",
    by: STUDENTS[6],
    tags: [8],
    upvotes: 45,
    daysAgo: 8,
    postType: "question",
    comments: [
      {
        by: FACULTY[2],
        body:
          "You are right that it is not the panels, and the time of day is the clue. Work through it " +
          "in this order.\n\n" +
          "Start with the inverter's own event log. It records a reason for every disconnection and " +
          "you should not be guessing at a fault the machine has already named. In this pattern it " +
          "almost always reads as an AC over-voltage trip.\n\n" +
          "Why noon and not morning. At noon every rooftop on that feeder is exporting at once, so the " +
          "grid voltage at your point of connection is at its highest for the day. Your own system " +
          "pushes it higher still: current flowing out through the AC cable raises the voltage at the " +
          "inverter terminals above the voltage at the meter, and the longer or thinner that cable, " +
          "the larger the rise. When the sum crosses the upper limit the inverter is set to, it has to " +
          "disconnect. That is the inverter obeying the grid code, not failing.\n\n" +
          "How to confirm it in one visit. Put a meter on the AC terminals at the inverter and take a " +
          "second reading at the supply meter at the same moment, at the hour it usually trips. If the " +
          "inverter terminals read clearly higher than the meter, the rise is in your cable and the " +
          "fix is a larger cross section or a shorter run. If both read equally high, the feeder " +
          "itself is high, which is a distribution company matter, so raise it in writing with the " +
          "readings attached.\n\n" +
          "Two things to rule out while you are there. Check the inverter is not on a closed wall in " +
          "direct sun, because heat derating shows at the same hour and looks similar. And check the " +
          "grid protection settings are the ones approved for the connection, since a factory default " +
          "meant for somewhere else is a fault I have seen twice.\n\n" +
          "One thing not to chase. A DC over-voltage trip is the opposite pattern: string open circuit " +
          "voltage is highest when the cells are cold, so that fault turns up on a cold clear morning " +
          "and not at noon. If the log says DC, the string length is wrong and the whole diagnosis " +
          "changes.",
        upvotes: 52,
        daysAgo: 8,
        accepted: true,
      },
      {
        by: STUDENTS[2],
        body:
          "Had the heat version of this at a site in Nizamabad. Inverter on a west-facing wall, no " +
          "shade and no clearance above it. It never tripped, it just quietly cut output every " +
          "afternoon and the owner only noticed it on the generation report. We moved it under the " +
          "stair landing and the afternoon dip went away.",
        upvotes: 18,
        daysAgo: 7,
      },
    ],
  },
  {
    id: 3005,
    title: "What should I charge for a blouse with lining? I keep quoting below my own cost",
    body:
      "I have been stitching from home for four months. I quote for a plain blouse, the customer then " +
      "asks for lining, and I add a little for the cloth and stitch it at the same rate. Yesterday I " +
      "worked out that a lined blouse takes me nearly twice as long, so I am earning less an hour on " +
      "it than on a plain one. How do people price this properly without losing the customer?",
    by: STUDENTS[17],
    tags: [10],
    upvotes: 19,
    daysAgo: 1,
    postType: "question",
    bountyPoints: 100,
    comments: [
      {
        by: STUDENTS[15],
        body:
          "You are not alone in this. Two things I changed. I stopped quoting one price for a blouse " +
          "and started quoting by the work: plain, lined, with piping, with cups, with a designed " +
          "back. Each has its own rate written in a small notebook the customer can see, and nobody " +
          "has argued with a written rate yet. And I count hooks, canvas, thread and lining as " +
          "material, because that is what they are. Before that I was giving away about thirty rupees " +
          "of material on every piece without noticing it.",
        upvotes: 31,
        daysAgo: 1,
      },
      {
        by: FACULTY[3],
        body:
          "Shirisha's notebook is the right instinct. Put a number under it and the argument goes away " +
          "for good.\n\n" +
          "Make a cost sheet for one lined blouse, once. Three lines.\n\n" +
          "Material. Lining, canvas or interlining, hooks, thread and any piping, counted for one " +
          "piece and not for a bolt, plus a small share for cutting wastage.\n\n" +
          "Labour. Your own hours at a rate you decide in advance. Take the daily earning you would " +
          "accept for a day at a unit, divide it by the hours you would work there, and that is your " +
          "hourly rate. Then time a lined blouse with a clock, twice, because your estimate of it will " +
          "be wrong. This is the line most people leave blank, and leaving it blank is the same as " +
          "working free.\n\n" +
          "Overhead. Machine, electricity, needles, oil and rent if you pay any. Add them for a month, " +
          "divide by the pieces you finish in a month, and carry that per-piece figure into every " +
          "quotation.\n\n" +
          "Those three added together are your cost. The price is that plus the margin you want. Now " +
          "you can see the thing you already suspected: a lined blouse is close to double the " +
          "stitching time because of the second layer, the turning and the finishing, so pricing it as " +
          "plain plus cloth hands the customer your labour for nothing.\n\n" +
          "Two practical points. Price the design and not the person, or you will end up with a " +
          "different rate for every customer and no way to defend either of them. And redo the sheet " +
          "when material rates move, because a cost sheet is only useful while it is current.",
        upvotes: 44,
        daysAgo: 1,
        accepted: true,
      },
    ],
  },
  {
    id: 3006,
    title: "Poll: how many hours did you actually study last week?",
    body:
      "Not how many you planned. How many you actually sat down for last week, honestly. I want to " +
      "know whether I am behind or whether everyone is quietly in the same position.",
    by: STUDENTS[3],
    tags: [7],
    upvotes: 22,
    daysAgo: 3,
    postType: "poll",
    pollOptions: ["Under 5 hours", "5 to 10 hours", "10 to 20 hours", "More than 20 hours"],
    pollResults: [14, 47, 58, 21],
    comments: [
      {
        by: STUDENTS[25],
        body:
          "Twelve on a good week and four on a week the shop is busy. The average is a lie in both " +
          "directions. What keeps me from dropping to nothing is the streak counter, which is a small " +
          "thing but it works on me.",
        upvotes: 12,
        daysAgo: 3,
      },
      {
        by: FACULTY[1],
        body:
          "The shape of this poll matches the progress data on the mission dashboard almost exactly, " +
          "so nobody reading it is unusual. What the data also shows is that consistency beats " +
          "intensity by a wide margin. Four sessions of ninety minutes across a week move a score more " +
          "than one long Sunday, because recall is built by returning to material and not by sitting " +
          "with it. If you have forty minutes on a weekday, spend them on one timed sectional rather " +
          "than on reading, and keep the reading for the day you have three hours.",
        upvotes: 19,
        daysAgo: 2,
      },
    ],
  },
  {
    id: 3007,
    title: "Which newspaper to read, and what to do with it once you have",
    body:
      "The question comes up in every batch, so here is the answer in full.\n\n" +
      "The masthead matters far less than people think. One daily read properly beats three read " +
      "partly, and most candidates who tell me they read three are spending ninety minutes and " +
      "retaining a headline. Pick one and stay with it.\n\n" +
      "What matters is which pages. For a state recruitment: the state edition for district " +
      "administration, schemes and appointments; the national pages for policy decisions, bills and " +
      "constitutional matters; the editorial and opinion page for the argument on both sides; and the " +
      "business page for the economy vocabulary. Skip crime, sport and film. Thirty to forty minutes, " +
      "not two hours.\n\n" +
      "Then the part that decides whether the reading was worth anything. Do not keep a date-wise " +
      "diary. The exam asks by topic and never by date, so a diary is a file you cannot search. Keep " +
      "one page per syllabus heading and add a line to the right page. A month later everything you " +
      "have read about irrigation is in one place and you revise it in ten minutes instead of hunting " +
      "through thirty entries.\n\n" +
      "Two more things. When a question is about a scheme or an order, the government's own release is " +
      "the primary source and the report is a summary of it, so read the release when the topic " +
      "matters to your paper. And if English is not the language you think in, read a Telugu daily for " +
      "state affairs and the English one for the national pages. Reading slowly in a second language " +
      "is not a virtue.\n\n" +
      "What not to do: highlighting. It feels like work and produces nothing you can revise from. If a " +
      "paragraph is worth keeping, write one line about it in your own words on the right page.",
    by: FACULTY[0],
    tags: [3, 4],
    upvotes: 63,
    daysAgo: 5,
    postType: "resource",
    comments: [
      {
        by: STUDENTS[12],
        body:
          "The topic page instead of a date diary is the single change that rescued a year of notes " +
          "for me. I had eleven months of a dated notebook and could not find anything in it two weeks " +
          "before the paper.",
        upvotes: 27,
        daysAgo: 4,
      },
      {
        by: STUDENTS[33],
        body: "Saved. The line about highlighting is uncomfortable and correct.",
        upvotes: 8,
        daysAgo: 4,
      },
    ],
  },
  {
    id: 3008,
    title: "Half an hour on a ceiling fan and the fault was upstream of me",
    body:
      "Checked the capacitor. Checked the regulator. Checked the connections at the ceiling rose. " +
      "Rewired the switch. The circuit was fed from a switch in the next room that nobody had turned " +
      "on. The customer told me this at the start and I had already decided it was the capacitor.",
    by: STUDENTS[24],
    tags: [9],
    upvotes: 51,
    daysAgo: 2,
    postType: "humorous",
    comments: [
      {
        by: STUDENTS[29],
        body:
          "Rule one at the centre: listen to what the customer says happened before you decide what " +
          "happened. We all learn it the same way and most of us learn it twice.",
        upvotes: 18,
        daysAgo: 2,
      },
      {
        by: STUDENTS[35],
        body:
          "The other one worth writing on the board: prove the tester on a known live point, test the " +
          "circuit, then prove the tester again. A dead tester reads the same as a dead circuit and " +
          "only one of the two is safe to touch.",
        upvotes: 22,
        daysAgo: 1,
      },
    ],
  },
  {
    id: 3009,
    title: "The branch asked our group for two things we did not have. Writing them down here",
    body:
      "Our group is eleven members in a village near Khammam. We have been saving for a year and we " +
      "went to the branch about a credit limit. We carried the savings passbook and the members' " +
      "identity documents. The manager asked for the minutes book with the borrowing resolution signed " +
      "by the members present, and the internal lending register showing what the group has lent from " +
      "its own savings and how much has come back. We had written up neither. We were sent back, and I " +
      "am putting this here so the next group does not lose a month the way we did.",
    by: STUDENTS[21],
    tags: [11],
    upvotes: 88,
    daysAgo: 7,
    postType: "discussion",
    comments: [
      {
        by: STUDENTS[41],
        body:
          "The same thing happened to our group last year. What we did was ask the community " +
          "coordinator to sit with us for one afternoon and write the minutes book up from the meeting " +
          "registers we did have, meeting by meeting, with the attendance signatures. Eight months of " +
          "meetings took one afternoon because we had kept the attendance sheets. If you have not kept " +
          "those either, the honest answer is that you start writing from today and go back in three " +
          "months.",
        upvotes: 31,
        daysAgo: 7,
      },
      {
        by: FACULTY[3],
        body:
          "This is not the branch being difficult, and it is worth understanding why, because it " +
          "changes how you prepare.\n\n" +
          "A bank lending to a group is not lending against a business idea. It is lending against the " +
          "group's own conduct, and the way it reads that conduct is a grading exercise: how regularly " +
          "the group meets, whether every member attends, whether savings come in on the same day each " +
          "month, whether the group lends its own money out, and whether it gets it back. The minutes " +
          "book and the internal lending register are the only evidence of all five. With no books " +
          "there is nothing to grade, and with nothing to grade there is nothing to sanction.\n\n" +
          "The borrowing resolution matters for a separate reason. It is what tells the branch that " +
          "the group decided to borrow, how much, and who may sign for it. No branch can take that " +
          "from one member standing at the counter.\n\n" +
          "So before you go: ask for the grading to be done and take the sheet, write the books up to " +
          "date, pass the resolution in a meeting with everyone present and record it, and check that " +
          "every member's details at the branch are current. Carry the books themselves and not " +
          "photocopies, because the manager will want to see the handwriting run continuously.\n\n" +
          "One expectation to set. What a branch sanctions is worked out against the group's own " +
          "savings and its grading under that bank's policy, so the savings record does more for your " +
          "limit than the strength of any one member's plan. Do not walk in with a number in mind, and " +
          "do ask the branch what its own norms are, because they differ.",
        upvotes: 44,
        daysAgo: 6,
        accepted: true,
      },
      {
        by: STUDENTS[21],
        body:
          "We went back with the books written up, the resolution passed in front of everyone and the " +
          "grading sheet. The limit was sanctioned last week. Posting this so the thread has an " +
          "ending.",
        upvotes: 67,
        daysAgo: 1,
      },
    ],
  },
  {
    id: 3010,
    title: "Udyam registration before I approach the bank, or after?",
    body:
      "Setting up a small unit grading and packing turmeric. One person told me to register first, " +
      "another said the bank does it for you, and a website has quoted me a fee for it. I do not want " +
      "to pay for something I should not be paying for, and I do not want to be sent back for a paper " +
      "I could have carried with me.",
    by: STUDENTS[0],
    tags: [12],
    upvotes: 29,
    daysAgo: 4,
    postType: "question",
    comments: [
      {
        by: STUDENTS[22],
        body:
          "Before, and do it yourself. Registration on the official portal is self-declared, needs " +
          "your identity number and the PAN of the business, and takes a few minutes. It carries no " +
          "fee. Any site asking money for it is not the portal, and that is the most common way a new " +
          "unit loses its first thousand rupees.\n\n" +
          "Doing it first is also just practical. The registration number is what identifies you as an " +
          "MSME on paper and it is asked for by most of the credit and subsidy routes you will " +
          "approach afterwards, so walking in with it saves a visit. What it does not do is get you a " +
          "loan by itself. Treat it as a document, not as an approval.",
        upvotes: 40,
        daysAgo: 4,
        accepted: true,
      },
      {
        by: STUDENTS[0],
        body: "Done, and it took eleven minutes without paying anybody. Thank you.",
        upvotes: 7,
        daysAgo: 3,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3011,
    title: "The ELCB trips only when the geyser and the pump are on together",
    body:
      "Either one alone runs all day without a problem. Switch on both and the ELCB drops within a " +
      "minute or two. The owner wants me to fit a higher rated one and be done with it. That does not " +
      "feel right to me but I cannot explain why well enough to argue with him.",
    by: STUDENTS[7],
    tags: [9],
    upvotes: 24,
    daysAgo: 3,
    postType: "question",
    comments: [
      {
        by: FACULTY[2],
        body:
          "Your instinct is correct, and here is the sentence to argue with.\n\n" +
          "An earth leakage device does not measure how much current an appliance draws. It measures " +
          "the difference between what goes out on the live and what comes back on the neutral, which " +
          "is the current leaking to earth. That difference adds up across everything connected at " +
          "that moment. A water heater with a slightly degraded element leaks a little. A pump with a " +
          "damp winding leaks a little. Each on its own stays under the trip threshold. Run both and " +
          "the sum crosses it. The device is doing exactly what it was fitted to do.\n\n" +
          "Fitting a higher rated one raises the threshold until no combination reaches it. The " +
          "leakage is still there, and it is still available to pass through somebody's hand on a wet " +
          "floor. That is not a repair, it is removing the protection.\n\n" +
          "To find it: switch every circuit off, bring them back one at a time and note which " +
          "combinations trip. Then clamp the live and neutral of the suspect circuit together and read " +
          "the leakage directly. In this pattern it is usually the heater element or the pump winding, " +
          "and both live in wet places, so it is not a surprise. Repair the appliance and the device " +
          "stops tripping on its own.\n\n" +
          "One caution before you start. Isolate at the board and prove it dead before you open " +
          "anything, and if the pump sits in a pit or a sump, treat it as live until you have proved " +
          "otherwise.",
        upvotes: 38,
        daysAgo: 3,
        accepted: true,
      },
    ],
  },
  {
    id: 3012,
    title: "Is it worth guessing when the paper has negative marking?",
    body:
      "I leave every question I am not sure about and I finish with about fifteen blank. A friend " +
      "marks everything and says the arithmetic is on his side. One of us is losing marks and I would " +
      "like to know which one.",
    by: STUDENTS[30],
    tags: [6, 5],
    upvotes: 21,
    daysAgo: 9,
    postType: "question",
    comments: [
      {
        by: STUDENTS[27],
        body:
          "Do the arithmetic once and then stop arguing about it. Where the penalty is a quarter of a " +
          "mark for a wrong answer, which is what most of these papers apply, a blind guess between " +
          "four options gives you a one in four chance of plus one and a three in four chance of minus " +
          "a quarter. That comes out slightly positive. Eliminate one option and it is clearly " +
          "positive. Eliminate two and it is not really a guess any more.\n\n" +
          "So your friend is right about the arithmetic and wrong about the conclusion, because the " +
          "arithmetic assumes the guess is free. It is not. Every question you stop to guess at is a " +
          "question you did not spend on one you could have solved, and in a sectionally timed paper " +
          "that is where the marks actually go.\n\n" +
          "The rule that falls out of it: guess when you have eliminated at least one option and it " +
          "costs you no extra time. Do not sit down at the end of a section and fill the blanks by " +
          "pattern. And check the notification for the penalty in the exam you are sitting, because it " +
          "is set there and it is not the same everywhere.",
        upvotes: 33,
        daysAgo: 9,
        accepted: true,
      },
      {
        by: STUDENTS[38],
        body:
          "The elimination point is the whole thing. A blind guess and an educated guess look " +
          "identical on the answer sheet and are completely different decisions.",
        upvotes: 14,
        daysAgo: 8,
      },
    ],
  },
  {
    id: 3013,
    title: "What does a good mains answer look like at fifteen marks?",
    body:
      "Every model answer I find is either three lines or two pages, and neither is what I can write " +
      "in the time I have. I have put a bounty on this because I want a description of the thing " +
      "rather than a link to a book. What does a fifteen mark answer look like when the clock is " +
      "running?",
    by: STUDENTS[2],
    tags: [1, 7],
    upvotes: 46,
    daysAgo: 11,
    postType: "discussion",
    bountyPoints: 250,
    bountyClaimedComment: 0,
    comments: [
      {
        by: FACULTY[0],
        body:
          "Start from the time and work backwards, because that is what fixes the length. These papers " +
          "give you roughly a minute a mark, and part of every minute goes on reading and deciding. So " +
          "a fifteen mark answer is about a minute of planning and eight to ten of writing, which is a " +
          "couple of hundred words. Anything longer is taken from the last two questions on the paper, " +
          "and that is where most people lose marks without ever noticing.\n\n" +
          "Then read the instruction word and answer that word. Examine wants both sides and your " +
          "judgement at the end. Discuss wants the dimensions of the issue. Explain wants the " +
          "mechanism, how one thing produces another. Critically evaluate wants a position, held. An " +
          "answer that recites everything known about the topic scores below an answer half its length " +
          "that does what the verb asked for.\n\n" +
          "The shape that works, in order. One line that defines or locates the thing being asked " +
          "about, not a paragraph of background. Then three or four points, each with an anchor under " +
          "it: a provision, a committee, a year, a scheme, or a Telangana example. A point with no " +
          "anchor reads as opinion and is marked as opinion. Then one closing line that answers the " +
          "question rather than summarising your own answer.\n\n" +
          "What loses marks reliably: an introduction that restates the question in other words, four " +
          "points that are the same point in different clothes, and a conclusion that begins with the " +
          "words thus we can say.\n\n" +
          "Practise it by writing one answer and then cutting it by a third without losing a point. " +
          "That exercise teaches more than three fresh answers, and it is the skill the paper is " +
          "actually testing.",
        upvotes: 58,
        daysAgo: 10,
        accepted: true,
      },
      {
        by: STUDENTS[2],
        body:
          "The verb is the part I have been ignoring for two years. I have been writing the same essay " +
          "whether the question said examine or explain. Bounty awarded.",
        upvotes: 11,
        daysAgo: 10,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3014,
    title: "Weekly check-in: what did you finish this week?",
    body:
      "One line each. Something you finished, something you are stuck on, and one thing you would like " +
      "a second pair of eyes on. Nothing is too small to post here, and faculty read this thread on " +
      "Thursday.",
    by: ADMIN_PERSONA,
    tags: [7],
    upvotes: 37,
    daysAgo: 1,
    postType: "discussion",
    pinned: true,
    comments: [
      {
        by: STUDENTS[19],
        body:
          "Finished the polity module. Stuck on the difference between a money bill and a financial " +
          "bill, which I can state and cannot apply. Would like someone to read the four lines I wrote " +
          "on it.",
        upvotes: 9,
        daysAgo: 1,
      },
      {
        by: STUDENTS[5],
        body:
          "Finished module three of the solar course and did the first practical assessment at the " +
          "centre. Stuck on the net metering application, which asks for a copy of the sanctioned load " +
          "and I do not know where that comes from.",
        upvotes: 12,
        daysAgo: 1,
      },
      {
        by: FACULTY[2],
        body:
          "The sanctioned load is the load already approved on the existing service connection at that " +
          "address. It has nothing to do with the solar system. It is printed on the electricity bill " +
          "in most formats, and where it is not, the section office will give you a copy of the " +
          "service agreement. The portal asks for it first because the rooftop capacity you may apply " +
          "for is set against that sanctioned load, so the number decides what can go on the roof. " +
          "Bring the bill on Thursday and we will fill the form together.",
        upvotes: 15,
        daysAgo: 0,
        replyTo: 1,
      },
    ],
  },
];

/**
 * The normalised form every thread route reads.
 *
 * Seed threads and threads the visitor posted end up in the same shape, so
 * there is exactly one payload builder and a visitor's own post behaves like
 * any other: it can be voted on, bookmarked, replied to and reported.
 */
export interface ThreadRecord {
  id: number;
  title: string;
  body: string;
  authorId: number;
  tagIds: number[];
  baseUpvotes: number;
  createdAt: string;
  updatedAt: string;
  postType: PostType;
  pollOptions: string[] | null;
  basePollResults: number[] | null;
  imageUrls: string[];
  pinned: boolean;
  locked: boolean;
}

function seedRecord(t: SeedThread): ThreadRecord {
  return {
    id: t.id,
    title: t.title,
    body: t.body,
    authorId: t.by.id,
    tagIds: t.tags,
    baseUpvotes: t.upvotes,
    createdAt: isoDaysAgo(t.daysAgo, 11, 20),
    updatedAt: isoDaysAgo(Math.max(0, t.daysAgo - 1), 9, 5),
    postType: t.postType,
    pollOptions: t.pollOptions ?? null,
    basePollResults: t.pollResults ?? null,
    imageUrls: [],
    pinned: Boolean(t.pinned),
    locked: false,
  };
}

/**
 * Threads the visitor posted this session.
 *
 * Read defensively: an earlier build of this module stored the whole rendered
 * payload rather than a record, and a prospect who reloads mid-demo should not
 * lose the post they just made to a shape change.
 */
function visitorThreadRecords(): ThreadRecord[] {
  const raw = overlay.get<Array<Record<string, unknown>>>("community:threads", []);
  return raw.map((row) => {
    const legacyAuthor = row.author as { id?: number } | undefined;
    return {
      id: Number(row.id),
      title: String(row.title ?? "Untitled"),
      body: String(row.body ?? ""),
      authorId: Number(row.authorId ?? legacyAuthor?.id ?? STUDENT_PERSONA.id),
      tagIds: Array.isArray(row.tagIds) ? (row.tagIds as number[]) : [],
      baseUpvotes: Number(row.baseUpvotes ?? 0),
      createdAt: String(row.createdAt ?? row.created_at ?? iso(new Date(nowMs()))),
      updatedAt: String(row.updatedAt ?? row.updated_at ?? iso(new Date(nowMs()))),
      postType: (row.postType ?? row.post_type ?? "discussion") as PostType,
      pollOptions: (row.pollOptions as string[] | null) ?? null,
      basePollResults: (row.basePollResults as number[] | null) ?? null,
      imageUrls: Array.isArray(row.imageUrls) ? (row.imageUrls as string[]) : [],
      pinned: Boolean(row.pinned),
      locked: Boolean(row.locked),
    };
  });
}

export function deletedThreadIds(): number[] {
  return overlay.get<number[]>("community:deletedThreads", []);
}

/** Edits made through the edit-post form, applied over the record. */
function threadEdits(): Record<string, Partial<ThreadRecord>> {
  return overlay.get<Record<string, Partial<ThreadRecord>>>("community:threadEdits", {});
}

/** Every live thread, newest first, pinned ones lifted to the top. */
export function threadRecords(): ThreadRecord[] {
  const gone = deletedThreadIds();
  const edits = threadEdits();
  const pins = overlay.get<Record<string, boolean>>("community:pinned", {});
  const locks = overlay.get<Record<string, boolean>>("community:locked", {});
  return [...visitorThreadRecords(), ...SEED_THREADS.map(seedRecord)]
    .filter((t) => !gone.includes(t.id))
    .map((t) => ({
      ...t,
      ...(edits[String(t.id)] ?? {}),
      pinned: pins[String(t.id)] ?? t.pinned,
      locked: locks[String(t.id)] ?? t.locked,
    }))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function threadRecord(id: number): ThreadRecord | undefined {
  return threadRecords().find((t) => t.id === id);
}

export function threadPayload(t: ThreadRecord, viewer: DemoPerson) {
  const votes = overlay.get<Record<string, string>>("community:votes", {});
  const bookmarks = bookmarkedThreadIds();
  const vote = votes[String(t.id)];
  const person = personById(t.authorId) ?? STUDENT_PERSONA;
  const bounty = bountyFor(t.id);

  return {
    id: t.id,
    title: t.title,
    body: t.body,
    author: author(person),
    tags: tagsByIds(t.tagIds),
    upvotes: t.baseUpvotes + (vote === "upvote" ? 1 : 0),
    downvotes: vote === "downvote" ? 1 : 0,
    user_vote: (vote === "upvote" || vote === "downvote" ? vote : null) as
      | "upvote"
      | "downvote"
      | null,
    bookmarks_count: seededInt(`bm:${t.id}`, 2, 18) + (bookmarks.includes(t.id) ? 1 : 0),
    user_bookmarked: bookmarks.includes(t.id),
    comments_count: commentRecords(t.id).length,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
    post_type: t.postType,
    poll_options: t.pollOptions ?? undefined,
    poll_results: t.pollOptions ? pollResults(t) : undefined,
    user_poll_vote: t.pollOptions ? pollVoteFor(t.id) : undefined,
    image_urls: t.imageUrls,
    bounty: bounty ? { id: t.id, points: bounty.points, status: bounty.status } : null,
    current_user_is_author: t.authorId === viewer.id,
    current_user_role: viewer.role,
    is_pinned: t.pinned,
    is_locked: t.locked,
  };
}

export function threadDetailPayload(id: number, viewer: DemoPerson) {
  const record = threadRecord(id);
  if (!record) throw notFound("Thread not found");
  return { ...threadPayload(record, viewer), comments: commentTree(id, viewer) };
}

/* ---------------------------------------------------------------- comments */

export interface CommentRecord {
  id: number;
  threadId: number;
  authorId: number;
  body: string;
  baseUpvotes: number;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
}

/** Seed comment ids are derived, not stored, so they survive a reload. */
function seedCommentId(threadId: number, index: number): number {
  return threadId * 10 + index;
}

function seedCommentRecords(threadId: number): CommentRecord[] {
  const seed = SEED_THREADS.find((t) => t.id === threadId);
  if (!seed) return [];
  return seed.comments.map((c, i) => ({
    id: seedCommentId(threadId, i),
    threadId,
    authorId: c.by.id,
    body: c.body,
    baseUpvotes: c.upvotes,
    createdAt: isoDaysAgo(c.daysAgo, 13, seededInt(`cm:${threadId}:${i}`, 0, 59)),
    updatedAt: isoDaysAgo(c.daysAgo, 13, seededInt(`cm:${threadId}:${i}`, 0, 59)),
    parentId: c.replyTo === undefined ? null : seedCommentId(threadId, c.replyTo),
  }));
}

/** Replies the visitor posted, keyed by thread. */
export function visitorCommentRecords(threadId: number): CommentRecord[] {
  const all = overlay.get<Record<string, CommentRecord[]>>("community:comments", {});
  return all[String(threadId)] ?? [];
}

export function deletedCommentIds(): number[] {
  return overlay.get<number[]>("community:deletedComments", []);
}

export function commentRecords(threadId: number): CommentRecord[] {
  const gone = deletedCommentIds();
  const edits = overlay.get<Record<string, { body: string; updatedAt: string }>>(
    "community:commentEdits",
    {},
  );
  return [...seedCommentRecords(threadId), ...visitorCommentRecords(threadId)]
    .filter((c) => !gone.includes(c.id))
    .map((c) => {
      const edit = edits[String(c.id)];
      return edit ? { ...c, body: edit.body, updatedAt: edit.updatedAt } : c;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function allCommentRecords(): CommentRecord[] {
  return threadRecords().flatMap((t) => commentRecords(t.id));
}

function seedAcceptedIds(threadId: number): number[] {
  const seed = SEED_THREADS.find((t) => t.id === threadId);
  if (!seed) return [];
  return seed.comments
    .map((c, i) => (c.accepted ? seedCommentId(threadId, i) : -1))
    .filter((id) => id > 0);
}

/** Comment ids marked helpful on this thread, seed unless the visitor changed it. */
export function acceptedCommentIds(threadId: number): number[] {
  const map = overlay.get<Record<string, number[]>>("community:accepted", {});
  return map[String(threadId)] ?? seedAcceptedIds(threadId);
}

export interface CommentPayload {
  id: number;
  body: string;
  author: ReturnType<typeof author>;
  parent: number | null;
  upvotes: number;
  downvotes: number;
  user_vote: "upvote" | "downvote" | null;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
  accepted_at: string | null;
  replies: CommentPayload[];
  /** Present so the thread page can hide edit and delete on other people's answers. */
  current_user_is_author: boolean;
}

export function commentPayload(c: CommentRecord, viewer: DemoPerson): CommentPayload {
  const votes = overlay.get<Record<string, string>>("community:commentVotes", {});
  const vote = votes[String(c.id)];
  const person = personById(c.authorId) ?? STUDENT_PERSONA;
  const accepted = acceptedCommentIds(c.threadId).includes(c.id);
  return {
    id: c.id,
    body: c.body,
    author: author(person),
    parent: c.parentId,
    upvotes: c.baseUpvotes + (vote === "upvote" ? 1 : 0),
    downvotes: vote === "downvote" ? 1 : 0,
    user_vote: (vote === "upvote" || vote === "downvote" ? vote : null) as
      | "upvote"
      | "downvote"
      | null,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
    is_accepted: accepted,
    accepted_at: accepted ? c.updatedAt : null,
    replies: [],
    current_user_is_author: c.authorId === viewer.id,
  };
}

/**
 * Comments as a two-level tree.
 *
 * The thread page renders `comment.replies` recursively, so a reply must be
 * nested inside its parent rather than appended flat. Anything whose parent is
 * missing (the parent was deleted) is promoted to the top level instead of
 * disappearing with it.
 */
export function commentTree(threadId: number, viewer: DemoPerson): CommentPayload[] {
  const records = commentRecords(threadId);
  const byId = new Map<number, CommentPayload>();
  const roots: CommentPayload[] = [];

  for (const record of records) byId.set(record.id, commentPayload(record, viewer));
  for (const record of records) {
    const node = byId.get(record.id);
    if (!node) continue;
    const parent = record.parentId === null ? undefined : byId.get(record.parentId);
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }
  return roots;
}

/* ---------------------------------------------------------------- bounties */

export interface BountyState {
  points: number;
  status: "active" | "claimed" | "ai_answered";
  claimedById: number | null;
  claimedAt: string | null;
}

function seedBounties(): Record<string, BountyState> {
  const out: Record<string, BountyState> = {};
  for (const t of SEED_THREADS) {
    if (!t.bountyPoints) continue;
    const claimedIndex = t.bountyClaimedComment;
    const winner = claimedIndex === undefined ? null : t.comments[claimedIndex]?.by ?? null;
    out[String(t.id)] = {
      points: t.bountyPoints,
      status: winner ? "claimed" : "active",
      claimedById: winner?.id ?? null,
      claimedAt: winner ? isoDaysAgo(Math.max(0, t.daysAgo - 1), 16, 40) : null,
    };
  }
  return out;
}

export function bountyState(): Record<string, BountyState> {
  return { ...seedBounties(), ...overlay.get<Record<string, BountyState>>("community:bounties", {}) };
}

export function bountyFor(threadId: number): BountyState | null {
  return bountyState()[String(threadId)] ?? null;
}

/**
 * The bounty browser's rows.
 *
 * `status` matters: the page fetches "active" and "resolved" separately and
 * counts the points won from the resolved set, so returning the same list for
 * both tabs would show a claimed bounty as still open.
 */
export function bountyRows(status: string | null) {
  const state = bountyState();
  return Object.entries(state)
    .map(([id, b]) => {
      const record = threadRecord(Number(id));
      if (!record) return null;
      const person = personById(record.authorId) ?? STUDENT_PERSONA;
      const winner = b.claimedById === null ? null : personById(b.claimedById) ?? null;
      const ageHours = Math.max(
        1,
        Math.round((nowMs() - new Date(record.createdAt).getTime()) / 3_600_000),
      );
      return {
        thread_id: record.id,
        thread_title: record.title,
        author: author(person),
        points: b.points,
        has_bounty: true,
        hours_unanswered: ageHours,
        bounty_status: b.status,
        comment_count: commentRecords(record.id).length,
        claimed_by: winner
          ? { id: winner.id, name: winner.full_name, profile_pic_url: winner.profile_pic_url }
          : null,
        claimed_at: b.claimedAt,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .filter((row) => {
      if (status === "resolved") return row.bounty_status !== "active";
      if (status === "active" || status === "strip") return row.bounty_status === "active";
      return true;
    })
    .sort((a, b) => b.points - a.points);
}

/* ------------------------------------------------------------------ badges */

/**
 * Badges are derived from what a person has actually done, never stored.
 *
 * That keeps them honest: the profile page prints "3 / 8 earned" next to the
 * post and comment counts on the same screen, so a badge that was awarded by a
 * coin flip would contradict the numbers beside it.
 */
export function badgesFor(personId: number) {
  const s = statsFor(personId);
  const earnedAt = (seed: string, maxDays: number) =>
    isoDaysAgo(seededInt(`badge:${personId}:${seed}`, 1, maxDays), 10, 15);

  const rows = [
    {
      key: "welcome",
      name: "Charter member",
      description: "Joined the community in its first term",
      icon: "mdi:flag-outline",
      color: "#6366f1",
      kind: "milestone" as const,
      earned: true,
    },
    {
      key: "first-post",
      name: "First post",
      description: "Started a discussion of your own",
      icon: "mdi:forum-outline",
      color: "#0ea5e9",
      kind: "milestone" as const,
      earned: s.threads >= 1,
    },
    {
      key: "first-answer",
      name: "First answer",
      description: "Answered someone else's question",
      icon: "mdi:comment-check-outline",
      color: "#10b981",
      kind: "milestone" as const,
      earned: s.comments >= 1,
    },
    {
      key: "helpful",
      name: "Marked helpful",
      description: "An answer of yours was marked helpful",
      icon: "mdi:check-decagram-outline",
      color: "#16a34a",
      kind: "quality" as const,
      earned: s.accepted_answers >= 1,
    },
    {
      key: "well-received",
      name: "Well received",
      description: "Earned 50 upvotes across your posts and answers",
      icon: "mdi:arrow-up-bold-circle-outline",
      color: "#8b5cf6",
      kind: "quality" as const,
      earned: s.upvotes_received >= 50,
    },
    {
      key: "regular",
      name: "Regular",
      description: "Posted five or more answers",
      icon: "mdi:account-voice",
      color: "#f59e0b",
      kind: "community" as const,
      earned: s.comments >= 5,
    },
    {
      key: "bounty-hunter",
      name: "Bounty hunter",
      description: "Won a points bounty",
      icon: "mdi:target",
      color: "#ef4444",
      kind: "special" as const,
      earned: s.bounties_won >= 1,
    },
    {
      key: "mentor",
      name: "Mentor",
      description: "Answered a question in three different topics",
      icon: "mdi:school-outline",
      color: "#a78bfa",
      kind: "community" as const,
      earned: s.topics_answered >= 3,
    },
  ];

  return rows.map((b) => ({
    ...b,
    earned_at: b.earned ? earnedAt(b.key, 60) : null,
  }));
}

/* ------------------------------------------------------------------- stats */

export function statsFor(personId: number) {
  const threads = threadRecords().filter((t) => t.authorId === personId);
  const comments = allCommentRecords().filter((c) => c.authorId === personId);
  const accepted = comments.filter((c) => acceptedCommentIds(c.threadId).includes(c.id));
  const bounties = Object.values(bountyState()).filter((b) => b.claimedById === personId);
  const topics = new Set(
    comments.flatMap((c) => threadRecord(c.threadId)?.tagIds ?? []),
  );
  return {
    threads: threads.length,
    comments: comments.length,
    upvotes_received:
      threads.reduce((sum, t) => sum + t.baseUpvotes, 0) +
      comments.reduce((sum, c) => sum + c.baseUpvotes, 0),
    accepted_answers: accepted.length,
    bounties_won: bounties.length,
    topics_answered: topics.size,
  };
}

/* ---------------------------------------------------------------------- XP */

/** Where the learner's community balance starts before this session's actions. */
const XP_BASE = 1840;

export interface XpEvent {
  id: number;
  source: string;
  source_label: string;
  amount: number;
  description: string;
  thread: { id: number; title: string } | null;
  comment_id: number | null;
  created_at: string;
}

/**
 * History earned before the demo started, newest last.
 *
 * Every row that names a thread names one the learner is really in: she asked
 * 3001, she answered on 3003 and that answer carries 24 upvotes and a helpful
 * mark in the seed, 3007 is in `DEFAULT_BOOKMARKS`, and 3009 is a thread she
 * could plausibly have upvoted. A ledger that credits the signed-in learner for
 * work the seed does not contain is checkable in two clicks, because the
 * profile page prints the post and answer counts computed from `statsFor`
 * directly beside it.
 */
function seedXpEvents(): XpEvent[] {
  const rows: Array<[string, string, number, string, number | null, number]> = [
    ["signup", "Joined the community", 50, "Welcome to the mission community", null, 42],
    ["thread", "Posted a question", 20, "Asked how deep Group-II goes on 1969", 3001, 2],
    ["comment", "Answered a question", 15, "Answered the third-attempt question", 3003, 4],
    ["upvote_received", "Answer upvoted", 48, "Your answer collected 24 upvotes", 3003, 3],
    ["accepted", "Answer marked helpful", 25, "Your answer was marked helpful", 3003, 3],
    ["bookmark", "Saved a post", 1, "Saved the newspaper routine", 3007, 4],
    ["streak", "Seven day streak", 40, "Seven days active in the community", null, 3],
    ["vote", "Voted on a post", 2, "Upvoted the SHG credit linkage write-up", 3009, 1],
  ];
  return rows.map(([source, label, amount, description, threadId, daysAgo], i) => {
    const record = threadId === null ? undefined : SEED_THREADS.find((t) => t.id === threadId);
    return {
      id: 7000 + i,
      source,
      source_label: label,
      amount,
      description,
      thread: record ? { id: record.id, title: record.title } : null,
      comment_id: null,
      created_at: isoDaysAgo(daysAgo, 12, 30 + i),
    };
  });
}

export function visitorXpEvents(): XpEvent[] {
  return overlay.get<XpEvent[]>("community:xp", []);
}

export function xpEvents(): XpEvent[] {
  return [...visitorXpEvents(), ...[...seedXpEvents()].reverse()];
}

export function xpBalance(): number {
  return XP_BASE + visitorXpEvents().reduce((sum, e) => sum + e.amount, 0);
}

/* ------------------------------------------------------- follows, bookmarks */

/**
 * People the learner already follows on a fresh demo.
 *
 * Seeded rather than empty so the Following feed and the following list have
 * something in them before the visitor clicks anything. The first follow or
 * unfollow writes the whole list to the overlay and takes over from here.
 */
const DEFAULT_FOLLOWING = [
  INSTRUCTOR_PERSONA.id,
  FACULTY[0].id,
  FACULTY[1].id,
  STUDENTS[0].id,
  STUDENTS[3].id,
  STUDENTS[13].id,
  STUDENTS[21].id,
];
// tgpsc, ibps-po and exam-strategy: the three the Group-II persona would follow.
const DEFAULT_FOLLOWED_TAGS = [1, 5, 7];
// The third-attempt discussion and the newspaper routine, both of which the
// seeded XP ledger cites. Every id here has to be a live thread, or the
// bookmarks tab opens empty on a fresh demo.
const DEFAULT_BOOKMARKS = [3003, 3007];

export function followedUserIds(): number[] {
  return overlay.get<number[]>("community:following", DEFAULT_FOLLOWING);
}

export function followedTagIds(): number[] {
  return overlay.get<number[]>("community:followedTags", DEFAULT_FOLLOWED_TAGS);
}

export function bookmarkedThreadIds(): number[] {
  return overlay.get<number[]>("community:bookmarks", DEFAULT_BOOKMARKS);
}

export function followerCountFor(person: DemoPerson): number {
  const base = seededInt(`followers:${person.id}`, 3, 180);
  return base + (followedUserIds().includes(person.id) ? 1 : 0);
}

/* ------------------------------------------------------------------- rooms */

export type RoomStatus = "scheduled" | "live" | "ended";

export interface RoomParticipantRecord {
  userId: number;
  role: "participant" | "moderator" | "banned";
  joinedAt: string;
  leftAt: string | null;
  lastActiveAt: string;
  active: boolean;
}

export interface RoomRecord {
  id: number;
  title: string;
  description: string;
  hostId: number;
  slug: string;
  status: RoomStatus;
  maxParticipants: number;
  audioOnly: boolean;
  scheduledFor: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  participants: RoomParticipantRecord[];
}

function roster(seed: string, count: number): DemoPerson[] {
  return seededSample(`room:${seed}`, STUDENTS, count);
}

function participantsFrom(
  seed: string,
  host: DemoPerson,
  count: number,
  opts: { active: boolean; minutesIn: number },
): RoomParticipantRecord[] {
  const joined = (offset: number) => iso(minutesAgo(opts.minutesIn - offset));
  const host_: RoomParticipantRecord = {
    userId: host.id,
    role: "moderator",
    joinedAt: joined(0),
    leftAt: opts.active ? null : joined(-opts.minutesIn),
    lastActiveAt: iso(minutesAgo(opts.active ? 0 : opts.minutesIn)),
    active: opts.active,
  };
  const rest = roster(seed, count).map((p, i) => ({
    userId: p.id,
    role: "participant" as const,
    joinedAt: joined(Math.min(opts.minutesIn - 1, i + 1)),
    leftAt: opts.active ? null : joined(-1),
    lastActiveAt: iso(minutesAgo(opts.active ? seededInt(`${seed}:seen:${p.id}`, 0, 4) : opts.minutesIn)),
    active: opts.active,
  }));
  return [host_, ...rest];
}

/**
 * Study rooms.
 *
 * The rooms themselves are real: the roster, the schedule, the statuses and the
 * moderation controls all work against the overlay. The one thing that cannot
 * work is the media itself, which needs a signalling server and a remote peer,
 * so `daily_room_url` is empty and the join call answers with a plain
 * explanation rather than dropping the visitor into a broken video pane.
 */
function seedRooms(): RoomRecord[] {
  return [
    {
      id: 5001,
      title: "Mains answer writing: bring one answer you wrote this week",
      description:
        "Open working session. We read answers out loud, mark them against what the question actually asked, and cut them by a third. No slides.",
      hostId: INSTRUCTOR_PERSONA.id,
      slug: "mains-answer-writing",
      status: "live",
      maxParticipants: 25,
      audioOnly: false,
      scheduledFor: null,
      startedAt: iso(minutesAgo(34)),
      endedAt: null,
      createdAt: isoDaysAgo(1, 9, 0),
      participants: participantsFrom("5001", INSTRUCTOR_PERSONA, 7, { active: true, minutesIn: 34 }),
    },
    {
      id: 5002,
      title: "Quant speed clinic: bring the sum you could not finish in time",
      description:
        "Audio only. One sum at a time, timed, and we work out where the seconds went rather than only how to solve it.",
      hostId: FACULTY[1].id,
      slug: "quant-speed-clinic",
      status: "live",
      maxParticipants: 20,
      audioOnly: true,
      scheduledFor: null,
      startedAt: iso(minutesAgo(12)),
      endedAt: null,
      createdAt: isoDaysAgo(2, 15, 30),
      participants: participantsFrom("5002", FACULTY[1], 4, { active: true, minutesIn: 12 }),
    },
    {
      id: 5003,
      title: "Rooftop site survey: reading a roof before you quote for it",
      description:
        "Shade through the day, orientation, roof condition, cable route and where the inverter will sit. Bring photographs of a roof you have been asked to quote for.",
      hostId: FACULTY[2].id,
      slug: "rooftop-site-survey",
      status: "scheduled",
      maxParticipants: 30,
      audioOnly: false,
      scheduledFor: isoDaysAhead(1, 19, 0),
      startedAt: null,
      endedAt: null,
      createdAt: isoDaysAgo(3, 11, 0),
      participants: [],
    },
    {
      id: 5004,
      title: "Interview clinic: how a selection board reads your answer",
      description:
        "Post your bio-data in the thread beforehand. We take as many candidates as the hour allows, out loud, and the panel says what it actually heard.",
      hostId: ADMIN_PERSONA.id,
      slug: "interview-clinic",
      status: "scheduled",
      maxParticipants: 40,
      audioOnly: false,
      scheduledFor: isoDaysAhead(3, 18, 30),
      startedAt: null,
      endedAt: null,
      createdAt: isoDaysAgo(4, 10, 15),
      participants: [],
    },
    {
      id: 5005,
      title: "Peer revision: the Telangana movement timeline, in order",
      description:
        "Recording of last week's session. We went through the timeline in sequence and marked the years that keep coming back in previous papers.",
      hostId: STUDENTS[18].id,
      slug: "telangana-movement-timeline",
      status: "ended",
      maxParticipants: 25,
      audioOnly: false,
      scheduledFor: isoDaysAgo(2, 19, 0),
      startedAt: isoDaysAgo(2, 19, 2),
      endedAt: isoDaysAgo(2, 20, 25),
      createdAt: isoDaysAgo(6, 12, 0),
      participants: [
        {
          userId: STUDENTS[18].id,
          role: "moderator",
          joinedAt: isoDaysAgo(2, 19, 2),
          leftAt: isoDaysAgo(2, 20, 25),
          lastActiveAt: isoDaysAgo(2, 20, 25),
          active: false,
        },
        {
          userId: STUDENT_PERSONA.id,
          role: "participant",
          joinedAt: isoDaysAgo(2, 19, 5),
          leftAt: isoDaysAgo(2, 20, 20),
          lastActiveAt: isoDaysAgo(2, 20, 20),
          active: false,
        },
        ...roster("5005", 11).map((p) => ({
          userId: p.id,
          role: "participant" as const,
          joinedAt: isoDaysAgo(2, 19, seededInt(`5005:in:${p.id}`, 2, 20)),
          leftAt: isoDaysAgo(2, 20, seededInt(`5005:out:${p.id}`, 5, 25)),
          lastActiveAt: isoDaysAgo(2, 20, 25),
          active: false,
        })),
      ],
    },
  ];
}
/** What the visitor changed about a room during this session. */
export interface RoomOverride {
  status?: RoomStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  /** userId -> what happened to them. "cleared" undoes a ban. */
  moderated?: Record<string, "inactive" | "banned" | "cleared">;
}

function roomOverrides(): Record<string, RoomOverride> {
  return overlay.get<Record<string, RoomOverride>>("community:roomState", {});
}

export function roomRecords(): RoomRecord[] {
  const created = overlay.get<RoomRecord[]>("community:rooms", []);
  const gone = overlay.get<number[]>("community:deletedRooms", []);
  const overrides = roomOverrides();

  return [...created, ...seedRooms()]
    .filter((r) => !gone.includes(r.id))
    .map((room) => {
      const override = overrides[String(room.id)];
      if (!override) return room;
      const moderated = override.moderated ?? {};
      const status = override.status ?? room.status;
      const endedAt = override.endedAt === undefined ? room.endedAt : override.endedAt;
      return {
        ...room,
        status,
        startedAt: override.startedAt === undefined ? room.startedAt : override.startedAt,
        endedAt,
        participants: room.participants.map((p) => {
          const action = moderated[String(p.userId)];
          // Ending a room empties it: the header count and the roster are read
          // from the same list, so leaving people "in room" after the host
          // ended it would print "5 in room" under the word Ended.
          if (status === "ended") {
            return { ...p, active: false, leftAt: p.leftAt ?? endedAt ?? p.lastActiveAt };
          }
          if (!action) return p;
          if (action === "cleared") {
            return { ...p, role: p.role === "banned" ? ("participant" as const) : p.role };
          }
          return {
            ...p,
            role: action === "banned" ? ("banned" as const) : p.role,
            active: false,
            leftAt: p.leftAt ?? iso(new Date(nowMs())),
          };
        }),
      };
    })
    .sort((a, b) => {
      const rank = (s: RoomStatus) => (s === "live" ? 0 : s === "scheduled" ? 1 : 2);
      return rank(a.status) - rank(b.status) || b.id - a.id;
    });
}

export function roomRecord(id: number): RoomRecord | undefined {
  return roomRecords().find((r) => r.id === id);
}

function roomRole(room: RoomRecord, viewer: DemoPerson) {
  if (room.hostId === viewer.id) return "host" as const;
  const mine = room.participants.find((p) => p.userId === viewer.id);
  if (!mine) return null;
  if (mine.role === "banned") return "banned" as const;
  return mine.role;
}

export function roomPayload(room: RoomRecord, viewer: DemoPerson) {
  const host = personById(room.hostId) ?? INSTRUCTOR_PERSONA;
  return {
    id: room.id,
    title: room.title,
    description: room.description,
    host: author(host),
    slug: room.slug,
    status: room.status,
    max_participants: room.maxParticipants,
    is_audio_only: room.audioOnly,
    scheduled_for: room.scheduledFor,
    started_at: room.startedAt,
    ended_at: room.endedAt,
    created_at: room.createdAt,
    participant_count: room.participants.length,
    active_count: room.participants.filter((p) => p.active).length,
    // Empty on purpose: provisioning a real room is a network call, and this
    // prototype makes none. See the seed comment above `seedRooms`.
    daily_room_name: "",
    daily_room_url: "",
    current_user_role: roomRole(room, viewer),
  };
}

export function roomDetailPayload(room: RoomRecord, viewer: DemoPerson) {
  return {
    ...roomPayload(room, viewer),
    participants: room.participants.map((p, i) => {
      const person = personById(p.userId) ?? STUDENT_PERSONA;
      return {
        id: room.id * 100 + i,
        user: author(person),
        role: p.role,
        joined_at: p.joinedAt,
        left_at: p.leftAt,
        last_active_at: p.lastActiveAt,
        is_active: p.active,
      };
    }),
  };
}

/* ------------------------------------------------------------------- polls */

function pollVotes(): Record<string, number> {
  return overlay.get<Record<string, number>>("community:pollVotes", {});
}

export function pollVoteFor(threadId: number): number | null {
  const stored = pollVotes()[String(threadId)];
  return stored === undefined ? null : stored;
}

export function pollResults(t: ThreadRecord): number[] {
  const base = t.basePollResults ?? (t.pollOptions ?? []).map(() => 0);
  const mine = pollVoteFor(t.id);
  return base.map((count, i) => count + (mine === i ? 1 : 0));
}

/* ------------------------------------------------------------------ routes */

defineRoutes(MODULE, {
  "GET /community-forum/api/clients/:clientId/threads/": (req) => {
    const viewer = viewerOf(req);
    return threadRecords().map((t) => threadPayload(t, viewer));
  },

  "GET /community-forum/api/clients/:clientId/threads/:threadId/": (req) =>
    threadDetailPayload(Number(req.params.threadId), viewerOf(req)),

  "POST /community-forum/api/clients/:clientId/threads/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const viewer = viewerOf(req);
    const pollOptions = Array.isArray(body.poll_options) ? (body.poll_options as string[]) : null;
    const now = iso(new Date(nowMs()));
    const record: ThreadRecord = {
      id: nextThreadId(),
      title: String(body.title ?? "Untitled"),
      body: String(body.body ?? ""),
      authorId: viewer.id,
      tagIds: Array.isArray(body.tag_ids) ? (body.tag_ids as number[]) : [],
      baseUpvotes: 0,
      createdAt: now,
      updatedAt: now,
      postType: (body.post_type as PostType) ?? "discussion",
      pollOptions: pollOptions && pollOptions.length ? pollOptions : null,
      basePollResults: pollOptions && pollOptions.length ? pollOptions.map(() => 0) : null,
      imageUrls: Array.isArray(body.image_urls) ? (body.image_urls as string[]) : [],
      pinned: false,
      locked: false,
    };
    overlay.unshift("community:threads", record);
    return threadPayload(record, viewer);
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/vote/": (req) => {
    const id = req.params.threadId;
    const vote = String(req.body?.vote_type ?? req.body?.vote ?? "upvote");
    overlay.update<Record<string, string>>("community:votes", {}, (current) => ({
      ...current,
      [id]: current[id] === vote ? "" : vote,
    }));
    return { id: Number(id), vote_type: vote, message: "Vote recorded." };
  },

  "POST /community-forum/api/clients/:clientId/threads/:threadId/bookmark/": (req) => {
    const id = Number(req.params.threadId);
    const list = bookmarkedThreadIds();
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    overlay.set("community:bookmarks", next);
    return { id, message: next.includes(id) ? "Bookmarked." : "Bookmark removed." };
  },

  /** Questions carrying a points bounty, filtered by the tab the page asked for. */
  "GET /community-forum/api/clients/:clientId/bounties/": (req) =>
    bountyRows(req.query.get("status")),

  /** The learner's community XP, separate from course points. */
  "GET /community-forum/api/clients/:clientId/xp/": () => tierOf(xpBalance()),

  "GET /community-forum/api/clients/:clientId/tags/": () => allTags(),

  /**
   * `{ period, results }` with rank/user/xp per row, NOT a bare array. The page
   * reads `data.results.length`, so a bare array crashed it outright.
   */
  "GET /community-forum/api/clients/:clientId/leaderboard/": (req) => {
    const period = (req.query.get("period") ?? "all") as "all" | "week" | "month";
    const scale = period === "week" ? 0.12 : period === "month" ? 0.4 : 1;
    return {
      period,
      results: [STUDENT_PERSONA, ...STUDENTS.slice(0, 19)]
        .map((p) => ({ user: author(p), xp: Math.round(communityXp(p) * scale) }))
        .sort((a, b) => b.xp - a.xp)
        .map((row, i) => ({ rank: i + 1, user: row.user, xp: row.xp, period })),
    };
  },

  "GET /community-forum/api/clients/:clientId/rooms/": (req) => {
    const viewer = viewerOf(req);
    const status = req.query.get("status");
    return roomRecords()
      .filter((r) => !status || r.status === status)
      .map((r) => roomPayload(r, viewer));
  },

  /** Threads by the people the learner follows. */
  "GET /community-forum/api/clients/:clientId/feed/following/": (req) => {
    const viewer = viewerOf(req);
    const following = followedUserIds();
    return threadRecords()
      .filter((t) => following.includes(t.authorId))
      .map((t) => threadPayload(t, viewer));
  },

  "GET /community-forum/api/clients/:clientId/badges/": (req) => {
    const userId = Number(req.query.get("user_id") ?? "") || viewerOf(req).id;
    return badgesFor(userId);
  },
});

/**
 * Ids for visitor threads.
 *
 * Not `nextDemoId` because the community seed occupies the 3000s and a demo id
 * starts at 900000, which is fine, but the counter must not restart between
 * reloads or a second post would collide with the first.
 */
function nextThreadId(): number {
  return overlay.update<number>("__seq:community-thread", 900_100, (n) => n + 1);
}
