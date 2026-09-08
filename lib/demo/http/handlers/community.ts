/**
 * The community forum: seed, shared state, and the read surface.
 *
 * Threads are written as questions a learner on these exact courses would
 * actually ask, with answers that read like peers rather than documentation.
 * This is the module where filler is most obvious: a forum full of "Great post!"
 * tells a prospect nobody uses it.
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

/** Resolve "kabir.deshmukh", "Kabir Deshmukh" or "KabirDeshmukh" to one person. */
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
  { id: 1, name: "react" },
  { id: 2, name: "javascript" },
  { id: 3, name: "python" },
  { id: 4, name: "sql" },
  { id: 5, name: "algorithms" },
  { id: 6, name: "careers" },
  { id: 7, name: "interviews" },
  { id: 8, name: "css" },
  { id: 9, name: "git" },
  { id: 10, name: "pandas" },
  { id: 11, name: "machine-learning" },
  { id: 12, name: "system-design" },
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

const SEED_THREADS: SeedThread[] = [
  {
    id: 3001,
    title: "Why does my state update not re-render, but only sometimes?",
    body:
      "I have a list of tasks and I'm doing `tasks.push(newTask)` then `setTasks(tasks)`. It works " +
      "when I also change a filter at the same time, and does nothing when I don't. What am I missing?",
    by: STUDENTS[0],
    tags: [1, 2],
    upvotes: 34,
    daysAgo: 2,
    postType: "question",
    comments: [
      {
        by: STUDENTS[4],
        body:
          "You are mutating the array, so the reference never changes and React concludes nothing " +
          "happened. It looks like it works when you change the filter because THAT state change " +
          "triggers the re-render, and your mutated array gets rendered along the way. Use " +
          "`setTasks([...tasks, newTask])`.",
        upvotes: 41,
        daysAgo: 2,
        accepted: true,
      },
      {
        by: INSTRUCTOR_PERSONA,
        body:
          "Exactly right. Worth internalising the general rule: never mutate anything someone else " +
          "can already see. Local mutation inside a function you just allocated is fine, it is " +
          "publishing the mutated value that causes this.",
        upvotes: 28,
        daysAgo: 1,
      },
      {
        by: STUDENTS[0],
        body: "That fixed it, and it also explains the bug I had in the filter bar last week. Thank you both.",
        upvotes: 6,
        daysAgo: 1,
        replyTo: 1,
      },
    ],
  },
  {
    id: 3002,
    title: "Group-by totals are lower than the raw sum and I cannot find the missing rows",
    body:
      "Summing revenue directly gives 4.82M. Grouping by region and summing gives 4.61M. Same " +
      "dataframe, no filtering in between. Where are the other 210k going?",
    by: STUDENTS[9],
    tags: [3, 10],
    upvotes: 27,
    daysAgo: 4,
    postType: "question",
    bountyPoints: 150,
    comments: [
      {
        by: FACULTY[0],
        body:
          "Check for NaN in the region column. `groupby` drops those rows by default, so they vanish " +
          "from every group total while still counting in the raw sum. `df.groupby('region', " +
          "dropna=False)` will bring them back under a NaN key.",
        upvotes: 33,
        daysAgo: 4,
      },
      {
        by: STUDENTS[9],
        body: "That was it, 412 rows with a blank region from the older export. Thank you.",
        upvotes: 9,
        daysAgo: 3,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3003,
    title: "How much DSA is actually enough for product-company interviews?",
    body:
      "I keep seeing people say 500 problems. That would take me the rest of the year. Is there a " +
      "point where the returns drop off, or is it genuinely a volume game?",
    by: STUDENTS[13],
    tags: [5, 7, 6],
    upvotes: 58,
    daysAgo: 6,
    postType: "discussion",
    pinned: true,
    comments: [
      {
        by: INSTRUCTOR_PERSONA,
        body:
          "Volume is the wrong axis. There are roughly a dozen patterns that generate most interview " +
          "questions: two pointers, sliding window, monotonic stack, BFS/DFS, topological sort, " +
          "binary search on the answer, and the DP families. Once you can look at a new question and " +
          "name the pattern within a minute, more problems stop teaching you anything.\n\n" +
          "Concretely: 100-150 problems chosen to cover the patterns beats 500 chosen at random. " +
          "Track which pattern each one was, and go back to whichever column stays empty.",
        upvotes: 71,
        daysAgo: 6,
        accepted: true,
      },
      {
        by: STUDENTS[20],
        body:
          "Seconding this. I did about 130 and cleared three onsites. The thing that moved the needle " +
          "was explaining my approach out loud before writing anything, which is also what the mock " +
          "interviewer here drills.",
        upvotes: 24,
        daysAgo: 5,
      },
    ],
  },
  {
    id: 3004,
    title: "Sliding window: why is it still O(n) if there is a loop inside a loop?",
    body:
      "The shrink step is a while loop inside a for loop, which looks quadratic to me, but everyone " +
      "says it is linear. What am I misreading?",
    by: STUDENTS[6],
    tags: [5],
    upvotes: 45,
    daysAgo: 8,
    postType: "question",
    comments: [
      {
        by: STUDENTS[2],
        body:
          "The left pointer only ever moves forward, and it can move at most n times across the whole " +
          "run. So the inner loop's total work over the entire algorithm is bounded by n, not by n " +
          "per iteration. That is amortised analysis: you count the total, not the worst single step.",
        upvotes: 52,
        daysAgo: 8,
        accepted: true,
      },
    ],
  },
  {
    id: 3005,
    title: "Anyone else getting a wrong answer only on the 'dvdf' test case?",
    body:
      "Longest substring without repeating characters. Passes everything except 'dvdf', where I get " +
      "2 instead of 3.",
    by: STUDENTS[17],
    tags: [5, 2],
    upvotes: 19,
    daysAgo: 1,
    postType: "question",
    bountyPoints: 100,
    comments: [
      {
        by: STUDENTS[0],
        body:
          "Your left pointer is jumping backwards. When you hit the second 'd', its stored index is " +
          "behind your current left edge, so `left = seen[ch] + 1` moves left back into territory you " +
          "already left. Guard it: `left = max(left, seen[ch] + 1)`.",
        upvotes: 31,
        daysAgo: 1,
      },
    ],
  },
  {
    id: 3006,
    title: "Poll: how many hours a week are you actually putting in?",
    body:
      "Not how many you planned. How many you actually did last week, honestly. I want to know if " +
      "I am behind or if everyone is quietly in the same boat.",
    by: STUDENTS[3],
    tags: [6],
    upvotes: 22,
    daysAgo: 3,
    postType: "poll",
    pollOptions: ["Under 5 hours", "5 to 10 hours", "10 to 20 hours", "More than 20 hours"],
    pollResults: [14, 47, 58, 21],
    comments: [
      {
        by: STUDENTS[15],
        body:
          "Twelve on a good week, four on a week with two submissions due. The average is a lie in " +
          "both directions, but the streak counter keeps me from dropping to zero.",
        upvotes: 12,
        daysAgo: 3,
      },
      {
        by: FACULTY[1],
        body:
          "The distribution here matches what we see in the progress data almost exactly. Consistency " +
          "beats intensity: four sessions of ninety minutes outperform one Sunday marathon on every " +
          "retention measure we track.",
        upvotes: 19,
        daysAgo: 2,
      },
    ],
  },
  {
    id: 3007,
    title: "Resource: the EXPLAIN checklist I run before shipping any query",
    body:
      "Sharing the checklist I use when a query is slow, in the order I actually go through it.\n\n" +
      "1. Read the plan bottom up, not top down. The deepest node is where the time is spent.\n" +
      "2. Look for a sequential scan on a table you expected to be indexed, then check whether the " +
      "filter is wrapped in a function. `WHERE lower(email) = ...` cannot use an index on `email`.\n" +
      "3. Compare estimated rows with actual rows. A factor of a hundred means the planner is working " +
      "from stale statistics.\n" +
      "4. Nested loop over a large outer relation is usually a missing join index.\n" +
      "5. Only then consider rewriting the query.",
    by: FACULTY[1],
    tags: [4],
    upvotes: 63,
    daysAgo: 5,
    postType: "resource",
    comments: [
      {
        by: STUDENTS[12],
        body:
          "Point two just explained a report that took eleven seconds for a year. The index existed, " +
          "the query was calling `date_trunc` on the column. Rewrote it as a range filter, now 40ms.",
        upvotes: 27,
        daysAgo: 4,
      },
      {
        by: STUDENTS[33],
        body: "Saved. The estimated-versus-actual row check is the one I always forget to look at.",
        upvotes: 8,
        daysAgo: 4,
      },
    ],
  },
  {
    id: 3008,
    title: "My laptop fan has become the progress bar for model training",
    body:
      "Fan quiet: still loading data. Fan loud: training. Fan silent again: either finished or the " +
      "kernel died, and there is only one way to find out.",
    by: STUDENTS[24],
    tags: [11],
    upvotes: 51,
    daysAgo: 2,
    postType: "humorous",
    comments: [
      {
        by: STUDENTS[29],
        body: "The kernel-died silence and the finished silence sound exactly the same and that is the joke.",
        upvotes: 18,
        daysAgo: 2,
      },
      {
        by: STUDENTS[35],
        body:
          "Put a print statement at the end of the loop and one in the exception handler. Now the fan is " +
          "decorative and you have logs.",
        upvotes: 22,
        daysAgo: 1,
      },
    ],
  },
  {
    id: 3009,
    title: "Interview experience: three rounds at a payments company, what they actually asked",
    body:
      "Writing this down while it is fresh, because the prep advice I read did not match the rounds.\n\n" +
      "Round 1, 60 minutes, one array question and one string question, both medium. They cared more " +
      "about my dry run than my code, and stopped me twice to ask what a variable held.\n\n" +
      "Round 2, 60 minutes, a small design question: build the retry layer for a payment webhook. " +
      "Idempotency keys, at-least-once delivery and what happens when the same event arrives twice.\n\n" +
      "Round 3, 45 minutes with a manager, entirely about a project on my resume. They asked what I " +
      "would change if I rebuilt it, and I think that answer decided the outcome.",
    by: STUDENTS[18],
    tags: [7, 6, 12],
    upvotes: 88,
    daysAgo: 7,
    postType: "discussion",
    comments: [
      {
        by: STUDENTS[41],
        body:
          "The third round question is the one nobody prepares for. Writing down two things I would " +
          "change about each project on my resume tonight.",
        upvotes: 31,
        daysAgo: 7,
      },
      {
        by: INSTRUCTOR_PERSONA,
        body:
          "This matches what hiring managers tell us. The design round at this level is not about " +
          "scale, it is about correctness under retries. If you can explain why an idempotency key " +
          "must be chosen by the sender and stored by the receiver, you are already ahead.",
        upvotes: 44,
        daysAgo: 6,
        accepted: true,
      },
      {
        by: STUDENTS[18],
        body: "Offer came through this morning. Happy to answer anything for whoever interviews there next.",
        upvotes: 67,
        daysAgo: 1,
      },
    ],
  },
  {
    id: 3010,
    title: "Why does git rebase keep asking me to resolve the same conflict?",
    body:
      "Rebasing a branch with nine commits onto main. I resolve the same conflict in the same file " +
      "four times before it finishes. Am I doing something wrong or is that expected?",
    by: STUDENTS[11],
    tags: [9],
    upvotes: 29,
    daysAgo: 4,
    postType: "question",
    comments: [
      {
        by: STUDENTS[22],
        body:
          "Expected. A rebase replays each commit one at a time, so a file that every commit touched " +
          "conflicts once per commit. Two ways out: squash the branch first so there is one commit to " +
          "replay, or turn on `git config --global rerere.enabled true` so git remembers how you " +
          "resolved it and reapplies that resolution.",
        upvotes: 40,
        daysAgo: 4,
        accepted: true,
      },
      {
        by: STUDENTS[11],
        body: "rerere was the missing piece. Nine conflicts became one.",
        upvotes: 7,
        daysAgo: 3,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3011,
    title: "A flex child with a long line makes the whole row overflow instead of wrapping",
    body:
      "The container is `display: flex`, the child is `flex: 1` and contains a long code snippet. " +
      "Instead of the child shrinking, the entire row grows and the page scrolls sideways.",
    by: STUDENTS[7],
    tags: [8, 1],
    upvotes: 24,
    daysAgo: 3,
    postType: "question",
    comments: [
      {
        by: FACULTY[2],
        body:
          "A flex item has `min-width: auto`, which means it refuses to shrink below its content. Your " +
          "unbreakable snippet is the content. Add `min-width: 0` to the flex child and it will shrink " +
          "as expected, then `overflow-x: auto` on the snippet so the scrollbar lands where you want it.",
        upvotes: 38,
        daysAgo: 3,
        accepted: true,
      },
    ],
  },
  {
    id: 3012,
    title: "Set or dictionary when all I need is a membership check?",
    body:
      "I only ever ask `if x in collection`. A colleague said to use a set, but I already have the " +
      "values in a dict and it feels wasteful to build a second structure.",
    by: STUDENTS[30],
    tags: [3, 5],
    upvotes: 21,
    daysAgo: 9,
    postType: "question",
    comments: [
      {
        by: STUDENTS[27],
        body:
          "If you already have the dict, `x in d` checks the keys in O(1) and builds nothing. Only " +
          "build a set when the values are what you are testing, because `x in d.values()` is a linear " +
          "scan and that is the mistake worth avoiding.",
        upvotes: 33,
        daysAgo: 9,
        accepted: true,
      },
      {
        by: STUDENTS[38],
        body: "Also worth knowing: `d.keys()` supports set operations directly, so you can intersect without copying.",
        upvotes: 14,
        daysAgo: 8,
      },
    ],
  },
  {
    id: 3013,
    title: "Design a URL shortener: what does a good answer sound like at two years of experience?",
    body:
      "Every write-up I find jumps straight to sharding and consistent hashing. That cannot be what " +
      "an interviewer expects from someone two years in. What does a good answer actually cover?",
    by: STUDENTS[2],
    tags: [12, 7],
    upvotes: 46,
    daysAgo: 11,
    postType: "discussion",
    bountyPoints: 250,
    bountyClaimedComment: 0,
    comments: [
      {
        by: FACULTY[1],
        body:
          "Start with the interface and the numbers, not the storage. What is the read to write ratio, " +
          "how long do links live, are they guessable. Then the id: base62 of an incrementing counter " +
          "is fine and you should be able to say why a hash of the URL is worse (collisions and no " +
          "reuse for the same input). Then one cache in front of one database, and only then, if there " +
          "is time left, what breaks at ten times the traffic.\n\n" +
          "An answer that reaches sharding in minute three without stating the read/write ratio reads " +
          "as memorised. An answer that never gets there but reasons cleanly about the cache does not.",
        upvotes: 58,
        daysAgo: 10,
        accepted: true,
      },
      {
        by: STUDENTS[2],
        body:
          "This is the framing I was missing. I was treating it as a storage question when it is a " +
          "requirements question with storage attached.",
        upvotes: 11,
        daysAgo: 10,
        replyTo: 0,
      },
    ],
  },
  {
    id: 3014,
    title: "Weekly check-in: what did you ship this week?",
    body:
      "One line each. Something you finished, something you got stuck on, and one thing you want a " +
      "second pair of eyes on. Nothing is too small to post here.",
    by: ADMIN_PERSONA,
    tags: [6],
    upvotes: 37,
    daysAgo: 1,
    postType: "discussion",
    pinned: true,
    comments: [
      {
        by: STUDENTS[19],
        body:
          "Finished the SQL module. Stuck on window functions, specifically when to use RANGE instead " +
          "of ROWS. Would like someone to look at my running-total query.",
        upvotes: 9,
        daysAgo: 1,
      },
      {
        by: STUDENTS[5],
        body:
          "Shipped the first version of my portfolio site and got two coding problems done. Stuck on " +
          "deploying it, the build passes locally and fails in CI with a case-sensitivity error.",
        upvotes: 12,
        daysAgo: 1,
      },
      {
        by: FACULTY[2],
        body:
          "The CI failure is almost always an import whose file name differs in case. macOS does not " +
          "care, the build container does. Post the failing import and we will read it together in " +
          "the frontend room on Thursday.",
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

/** History earned before the demo started, newest last. */
function seedXpEvents(): XpEvent[] {
  const rows: Array<[string, string, number, string, number | null, number]> = [
    ["signup", "Joined the community", 50, "Welcome to the AI Linc community", null, 42],
    ["thread", "Posted a question", 20, "Asked about React state updates", 3001, 2],
    ["comment", "Answered a question", 15, "Answered the 'dvdf' test case question", 3005, 1],
    ["upvote_received", "Answer upvoted", 62, "Your answer collected 31 upvotes", 3005, 1],
    ["accepted", "Answer marked helpful", 25, "Your answer was marked helpful", 3005, 1],
    ["bookmark", "Saved a post", 1, "Saved the EXPLAIN checklist", 3007, 4],
    ["streak", "Seven day streak", 40, "Seven days active in the community", null, 3],
    ["vote", "Voted on a post", 2, "Upvoted an interview write-up", 3009, 1],
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
  FACULTY[1].id,
  STUDENTS[0].id,
  STUDENTS[3].id,
  STUDENTS[13].id,
  STUDENTS[18].id,
];
const DEFAULT_FOLLOWED_TAGS = [1, 5, 7];
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
      title: "Sliding window drills, bring a problem you are stuck on",
      description:
        "Open working session. We take one problem at a time, name the pattern, then write it together. No slides.",
      hostId: INSTRUCTOR_PERSONA.id,
      slug: "sliding-window-drills",
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
      title: "Pandas clinic: group-by, joins and the NaN traps",
      description:
        "Audio only. Bring a dataframe that is not behaving and we will read the shape of it together.",
      hostId: FACULTY[0].id,
      slug: "pandas-clinic",
      status: "live",
      maxParticipants: 20,
      audioOnly: true,
      scheduledFor: null,
      startedAt: iso(minutesAgo(12)),
      endedAt: null,
      createdAt: isoDaysAgo(2, 15, 30),
      participants: participantsFrom("5002", FACULTY[0], 4, { active: true, minutesIn: 12 }),
    },
    {
      id: 5003,
      title: "Frontend pairing: rebuilding a dashboard layout live",
      description:
        "We start from a blank file and end with a responsive grid. Bring questions about flexbox and grid.",
      hostId: FACULTY[2].id,
      slug: "frontend-pairing",
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
      title: "Placement prep: resume and LinkedIn teardown",
      description:
        "Send your resume in the thread beforehand. We review as many as we can get through, out loud.",
      hostId: ADMIN_PERSONA.id,
      slug: "resume-teardown",
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
      title: "SQL window functions, problem set walkthrough",
      description:
        "Recording of last week's session. We covered ROWS against RANGE, running totals and the frame clause.",
      hostId: STUDENTS[18].id,
      slug: "sql-window-functions",
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
