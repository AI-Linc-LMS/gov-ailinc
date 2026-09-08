/**
 * Article bodies for the reader.
 *
 * The reader is where a prospect stops skimming and actually reads, so filler
 * would be caught immediately: nobody believes a platform whose flagship lesson
 * is three paragraphs of lorem about "leveraging synergies".
 *
 * Two tiers, for a deliberate reason. The four topics below are hand-written in
 * full, because they are the ones a demo actually opens - each is the "continue
 * where you left off" target of an enrolled course, or the first lesson of the
 * flagship one. Every other topic gets a structured body generated from its
 * title and concepts: honest section scaffolding rather than fake depth, which
 * degrades gracefully across the ~120 topics in the catalogue instead of
 * pretending all of them were authored.
 */

import type { DemoTopic } from "./courses";
import { peekTopic } from "./curriculum";

export type ReadingTier = "Beginner" | "Intermediate" | "Advanced" | "Expert";

interface AuthoredArticle {
  summary: string;
  concepts: string[];
  glossary: Record<string, string>;
  /** Body per tier. Tiers not listed fall back to Intermediate. */
  body: Partial<Record<ReadingTier, string>> & { Intermediate: string };
}

/** Hand-written articles, keyed by exact topic title. */
const AUTHORED: Record<string, AuthoredArticle> = {
  "Immutability and why state bugs hide there": {
    summary:
      "Mutating state in place is the single most common source of bugs that reproduce only sometimes. " +
      "This lesson shows why, and what to do instead.",
    concepts: ["Immutability", "Referential equality", "Shared references", "Structural sharing"],
    glossary: {
      "Referential equality": "Two variables are referentially equal when they point at the same object in memory, not merely at objects that look alike.",
      "Structural sharing": "Creating a new object that reuses the unchanged parts of the old one, so copying stays cheap.",
      "Aliasing": "Two names referring to the same underlying object, so a change through one is visible through the other.",
    },
    body: {
      Beginner: `
<p>When you change an object in JavaScript, you usually change it <em>in place</em>. Everyone
holding that object sees the change, whether they expected it or not.</p>

<p>That is the whole problem in one sentence. The rest of this lesson is about why it produces
bugs that only appear sometimes, and the one habit that removes them.</p>

<h2>The bug</h2>
<pre><code>const defaults = { theme: "light", fontSize: 14 };

function makeSettings(overrides) {
  const settings = defaults;      // NOT a copy
  Object.assign(settings, overrides);
  return settings;
}

makeSettings({ theme: "dark" });
makeSettings({});                 // { theme: "dark" } — the default changed
</code></pre>

<p><code>const settings = defaults</code> does not copy anything. It creates a second name for the
same object. The first call permanently edits the defaults, and the second call silently
inherits them.</p>

<h2>The fix</h2>
<pre><code>function makeSettings(overrides) {
  return { ...defaults, ...overrides };   // a new object every time
}
</code></pre>

<p>Build a new value instead of editing the old one. The defaults are never touched, so no call
can affect the next.</p>

<h2>Why this matters in React</h2>
<p>React decides whether to re-render by comparing the old state to the new one <em>by reference</em>.
If you push onto an existing array, the reference has not changed, so React concludes nothing
happened and skips the render, even though the data is different.</p>

<pre><code>// Nothing re-renders: same array reference
items.push(newItem);
setItems(items);

// Re-renders: a new array
setItems([...items, newItem]);
</code></pre>

<p>This is why "my state updated but the screen did not" is almost always a mutation bug.</p>
`,
      Intermediate: `
<p>Mutation bugs are disproportionately expensive because they break the link between cause and
effect. The line that writes the bad value and the line that reads it can sit in different
files, and the failure only shows when a particular order of operations happens to occur. That
is what makes them intermittent, and intermittent bugs are the ones that survive review.</p>

<h2>Assignment does not copy</h2>
<p>In JavaScript, assigning an object copies the <em>reference</em>, not the value. Two names now
alias one object, and a write through either is visible through both.</p>

<pre><code>const defaults = { theme: "light", retries: 3 };

function withOverrides(overrides) {
  const config = defaults;          // alias, not a copy
  Object.assign(config, overrides); // mutates the shared default
  return config;
}

withOverrides({ retries: 5 });
withOverrides({});                  // { retries: 5 } — leaked from the previous call
</code></pre>

<p>The second call is the interesting one. It passes no overrides and still gets the wrong answer,
because the damage was done earlier by unrelated code. Nothing at the call site suggests a
cause.</p>

<h2>Build new values instead</h2>
<pre><code>function withOverrides(overrides) {
  return { ...defaults, ...overrides };
}
</code></pre>

<p>Spreading produces a fresh object each call. <code>defaults</code> is never written to, so calls
cannot influence each other regardless of order.</p>

<h2>Referential equality is a feature, not a nuisance</h2>
<p>React's rendering model, <code>useMemo</code>, <code>useEffect</code> dependency arrays and
<code>React.memo</code> all compare by reference. That comparison is <em>O(1)</em> instead of a deep
walk of the object, which is what makes re-render checks cheap enough to run constantly.</p>

<p>The cost of that speed is that mutation becomes invisible to the framework:</p>

<pre><code>// The reference is unchanged, so React skips the re-render.
items.push(item);
setItems(items);

// A new reference: React sees the change.
setItems([...items, item]);
</code></pre>

<p>Nested updates need the same treatment at every level you touch. Copying only the outer object
still shares the inner ones:</p>

<pre><code>setUser({
  ...user,
  address: { ...user.address, city: "Pune" },
});
</code></pre>

<h2>Copying is cheaper than it looks</h2>
<p>A spread is a shallow copy: it copies references to the untouched branches rather than the
branches themselves. Updating one field of a large object copies a handful of pointers, not the
whole tree. This is <strong>structural sharing</strong>, and it is why immutable updates stay
practical at real sizes.</p>

<h2>Where to be strict</h2>
<p>Be strict wherever a value crosses a boundary: state, props, module-level constants, anything
returned from a shared helper, and anything cached. Local mutation inside a function you just
allocated is fine and often clearer:</p>

<pre><code>function normalise(rows) {
  const out = [];              // nobody else has this yet
  for (const row of rows) out.push(trim(row));
  return out;                  // published only now
}
</code></pre>

<p>The rule is not "never mutate". It is <strong>never mutate anything someone else can already
see</strong>.</p>
`,
      Advanced: `
<p>Immutability is usually taught as a style preference. It is better understood as the precondition
that makes cheap change detection sound.</p>

<h2>The invariant</h2>
<p>Reference comparison is a valid proxy for value comparison only if values are never edited in
place. Given that invariant, <code>prev === next</code> implies the value is unchanged, and a
framework can skip work on that basis. Break the invariant anywhere and every memoisation
boundary downstream becomes unsound - not slower, <em>wrong</em>. It will report "no change"
about data that changed.</p>

<p>This is why mutation bugs cluster around <code>useMemo</code>, <code>React.memo</code> and
dependency arrays. Those are precisely the places that trusted the invariant.</p>

<h2>Cost model</h2>
<p>A shallow copy is O(k) in the object's own keys, not O(n) in the reachable graph, because
untouched branches are shared by reference. Updating one field at depth d costs d shallow
copies. For realistic UI state that is a handful of small allocations, comfortably cheaper than
the deep equality check it replaces.</p>

<p>Where it stops being free: long lists rebuilt every keystroke, or hot loops that copy per
iteration. The fix there is to change the shape (normalise by id, keep an index) rather than to
reintroduce mutation.</p>

<h2>Enforcement beats discipline</h2>
<p>Conventions decay under deadline. Make the invariant structural instead:</p>
<ul>
  <li><code>Readonly&lt;T&gt;</code> and <code>readonly T[]</code> at API boundaries, so a mutation is a type error rather than a code-review catch.</li>
  <li><code>Object.freeze</code> on shared constants in development, which converts silent corruption into a thrown error at the write.</li>
  <li>A lint rule banning parameter reassignment and array mutators on props and state.</li>
</ul>

<h2>The pragmatic exception</h2>
<p>Local mutation before publication is safe and often clearest: build into a fresh array, then
return it. The value only becomes shared at the moment you hand it out. The discipline applies
to <em>reachable</em> state, not to every line of code.</p>
`,
    },
  },

  "The request lifecycle, end to end": {
    summary:
      "Follow one HTTP request from a keystroke in the address bar to pixels on screen, naming every " +
      "layer it passes through and what each one is for.",
    concepts: ["DNS", "TCP and TLS", "HTTP", "Rendering"],
    glossary: {
      DNS: "The system that turns a hostname into an IP address.",
      "TLS handshake": "The negotiation that agrees on encryption keys before any HTTP data is sent.",
      "Critical rendering path": "The sequence of steps the browser must finish before it can paint anything.",
    },
    body: {
      Intermediate: `
<p>Most web debugging is really the question "which layer is this failing at?". You cannot answer
that without a map. This lesson builds one by following a single request end to end.</p>

<h2>1. Resolving the name</h2>
<p>The browser needs an IP address. It checks its own cache, then the OS cache, then asks a
resolver, which walks the DNS hierarchy until something authoritative answers. Results are
cached for the record's TTL.</p>
<p><strong>Fails as:</strong> the page never starts loading and the error mentions the host rather
than the page. A stale TTL is why a DNS change "works for some people" for a while.</p>

<h2>2. Opening the connection</h2>
<p>TCP performs its three-way handshake, then TLS negotiates a cipher and verifies the
certificate chain. Only after both is any HTTP sent. This is why the first request to a new
origin is measurably slower than the rest, and why connection reuse matters so much.</p>
<p><strong>Fails as:</strong> certificate warnings, or a connection that hangs before any response.</p>

<h2>3. The request</h2>
<p>The browser sends a method, a path, headers and possibly a body. The method carries meaning
the rest of the stack relies on: <code>GET</code> is safe and cacheable, <code>PUT</code> and
<code>DELETE</code> are idempotent, <code>POST</code> is neither. Treating those as arbitrary
labels is how a retry ends up charging a card twice.</p>

<h2>4. The server</h2>
<p>A load balancer picks a backend. The application routes the path, authenticates the caller,
queries its database, and serialises a response. Most of the latency you can actually control
lives here, and most of that is usually the database.</p>

<h2>5. The response</h2>
<p>Status code, headers, body. The status is the contract: <code>200</code> succeeded,
<code>301</code> moved permanently and will be cached aggressively, <code>404</code> is a
missing resource, <code>500</code> is a bug on the server. Caching headers decide whether the
next request repeats any of this work at all.</p>

<h2>6. Rendering</h2>
<p>The browser parses HTML into the DOM and CSS into the CSSOM, combines them into a render
tree, computes layout, then paints. A blocking script in <code>&lt;head&gt;</code> stops parsing
until it has executed, which is why script placement affects perceived speed so much.</p>

<h2>Using the map</h2>
<p>When something is slow or broken, locate it before fixing it. Open the network panel: a slow
DNS or connect phase is an infrastructure problem, a slow "waiting" phase is a server problem,
and a fast response with a late paint is a frontend problem. Three very different fixes, and the
map is what tells them apart.</p>
`,
    },
  },

  "Group-by, pivot and window operations": {
    summary:
      "Split-apply-combine, why pivots reshape rather than summarise, and the class of question " +
      "only window functions can answer.",
    concepts: ["Split-apply-combine", "Aggregation", "Pivoting", "Window functions"],
    glossary: {
      "Split-apply-combine": "Split rows into groups, apply a function to each, combine the results back into one frame.",
      "Window function": "A calculation across a set of rows related to the current row, without collapsing those rows.",
      "Tidy data": "One row per observation, one column per variable.",
    },
    body: {
      Intermediate: `
<p>Nearly every analytical question is one of three shapes: summarise groups, reshape a table, or
compare each row to its neighbours. pandas has a distinct tool for each, and using the wrong one
is where most awkward analysis code comes from.</p>

<h2>Group-by is split-apply-combine</h2>
<pre><code>sales.groupby("region")["revenue"].sum()
</code></pre>
<p>Three steps: split rows by region, apply <code>sum</code> to each group, combine the results.
The output has one row per group. You have <strong>collapsed</strong> the data.</p>

<p>Aggregate several ways at once with <code>agg</code>:</p>
<pre><code>sales.groupby("region").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    avg_order=("revenue", "mean"),
)
</code></pre>

<p>A trap worth internalising: by default <code>groupby</code> drops rows whose key is NaN. If your
totals are quietly short, this is the first thing to check. Pass <code>dropna=False</code> to
keep them.</p>

<h2>Pivot reshapes, it does not summarise</h2>
<pre><code>sales.pivot_table(
    index="region", columns="quarter", values="revenue", aggfunc="sum",
)
</code></pre>
<p><code>pivot_table</code> aggregates and then moves a variable into the column axis. The same
numbers as a group-by, laid out for reading rather than for computing. Use it at the end of an
analysis, not in the middle: wide frames are pleasant to look at and awkward to compute over.</p>

<p><code>pivot</code> is the strict version. It fails on duplicate index/column pairs instead of
silently aggregating them, which is usually what you want while developing.</p>

<h2>Window functions keep every row</h2>
<p>This is the one people reach for last and need most. "What share of its region's revenue is
this order?" needs both the row and its group total at once - and a group-by has already thrown
the rows away.</p>

<pre><code>sales["region_total"] = sales.groupby("region")["revenue"].transform("sum")
sales["share"] = sales["revenue"] / sales["region_total"]
</code></pre>

<p><code>transform</code> returns a result <em>aligned to the original index</em>, so it can be
assigned straight back as a column. <code>agg</code> collapses; <code>transform</code> broadcasts.
That distinction is the whole lesson.</p>

<p>Ordered comparisons follow the same idea:</p>
<pre><code>sales = sales.sort_values("date")
sales["prev"]   = sales.groupby("region")["revenue"].shift(1)
sales["change"] = sales["revenue"] - sales["prev"]
sales["run7"]   = sales.groupby("region")["revenue"].rolling(7).mean().reset_index(0, drop=True)
</code></pre>

<h2>Choosing</h2>
<ul>
  <li>Fewer rows out than in, one per group: <strong>groupby + agg</strong>.</li>
  <li>Same numbers, laid out for a human: <strong>pivot_table</strong>.</li>
  <li>Same rows out as in, enriched with group context: <strong>transform / shift / rolling</strong>.</li>
</ul>
`,
    },
  },

  "Sliding window": {
    summary:
      "Turn a nested-loop scan over every subarray into a single pass, by noticing that consecutive " +
      "windows overlap almost entirely.",
    concepts: ["Sliding window", "Two pointers", "Amortised analysis", "Invariants"],
    glossary: {
      Window: "A contiguous range of the input, tracked by its two endpoints.",
      Invariant: "A condition the code guarantees is true every time it reaches a given point.",
      "Amortised O(n)": "Each element is processed a constant number of times overall, even if one step does several operations.",
    },
    body: {
      Intermediate: `
<p>Sliding window is the answer to a specific shape of question: <em>the best (longest, shortest,
maximum) contiguous run satisfying some condition</em>. Recognising the shape is most of the
work; the code is short once you have.</p>

<h2>Why the brute force is wasteful</h2>
<p>Checking every subarray is O(n²) ranges, each costing O(n) to evaluate. But consecutive windows
share almost all their elements - moving from <code>[i, j]</code> to <code>[i, j+1]</code> adds
one element and removes none. Recomputing the whole range throws that away. Maintaining a
running summary instead is what collapses the complexity.</p>

<h2>Fixed-size windows</h2>
<p>Maximum sum of any k consecutive elements:</p>
<pre><code>def max_sum(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # add entering, drop leaving
        best = max(best, window)
    return best
</code></pre>
<p>One pass, O(1) extra space. The whole trick is that line: add what enters, subtract what leaves.</p>

<h2>Variable-size windows</h2>
<p>Here the window grows until it breaks a condition, then shrinks until it is legal again.
Longest substring without repeating characters:</p>
<pre><code>def longest_unique(s):
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1          # jump past the earlier copy
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
</code></pre>

<p>The invariant is one sentence: <em>the window [left, right] never contains a duplicate</em>. Every
line either preserves it or restores it. When you get stuck writing one of these, write the
invariant down first - the code usually follows.</p>

<h2>Why it is still O(n)</h2>
<p>There is an inner "shrink" step, so it looks like it could be quadratic. It cannot:
<code>left</code> only ever increases, and it can advance at most n times in total across the
entire run. Each element enters the window once and leaves at most once, so the total work is
linear. This is <strong>amortised analysis</strong>, and it is the standard justification for
this whole family of algorithms.</p>

<h2>Recognising the pattern</h2>
<p>Reach for a sliding window when the problem says <em>contiguous</em> (subarray or substring)
and asks for a longest, shortest, or best-valued run under a constraint that gets monotonically
worse as the window grows. If order does not matter, or the elements need not be adjacent, this
is the wrong tool - that is usually sorting, hashing, or dynamic programming.</p>
`,
    },
  },
};

/** Escape text that is interpolated into generated HTML. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Fallback body for topics without a hand-written article.
 *
 * Structured honestly: it gives a real orientation, the concepts the topic
 * actually covers, and what the practice after it will ask for. It does not
 * fabricate technical claims about a subject nobody authored, which is the
 * failure mode that would embarrass us if a prospect read closely.
 */
function generatedBody(topic: DemoTopic, concepts: string[]): string {
  const title = esc(topic.title);
  const items = concepts.map((c) => `<li><strong>${esc(c)}</strong></li>`).join("\n  ");
  const practice = topic.kinds.includes("coding")
    ? "a set of coding problems that will not pass on pattern-matching alone"
    : topic.kinds.includes("quiz")
      ? "a short quiz that adapts its difficulty to how you answer"
      : "a practice exercise";

  return `
<p class="lead">${title} sits in the middle of this track: it depends on the lessons before it and
several later ones depend on it, so it is worth slowing down here.</p>

<h2>What this lesson covers</h2>
<ul>
  ${items}
</ul>

<h2>How to work through it</h2>
<p>Read once for the shape of the idea without stopping at unfamiliar terms, then read again and
try to predict each example before revealing it. The second pass is where the material actually
lands; the first is orientation.</p>

<p>Anything you cannot yet explain out loud in a sentence is the thing to bring to the practice
that follows. That is the signal worth acting on, not a feeling of general unease.</p>

<h2>Then prove it</h2>
<p>This lesson is followed by ${practice}. Your answers there update your skill profile, which is
what decides the difficulty of everything the platform gives you next in this course.</p>

<aside class="tip">
  <p><strong>Reading tiers.</strong> Use the tier selector above to re-render this lesson simpler or
  deeper. The concepts stay the same; the assumed background changes.</p>
</aside>
`;
}

export interface ArticleBody {
  summary: string;
  concepts: string[];
  glossary: Record<string, string>;
  html: string;
  readingMinutes: number;
}

/**
 * Reading time, derived from the text actually being shown.
 *
 * One function, because an audit found the same article claiming 14 minutes on
 * the course card, 6 in the lesson header, and carrying about a minute of prose.
 * Anything that displays a reading time must call this on the same HTML the
 * reader will get, or the three numbers drift apart again.
 */
export function readingMinutesFor(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * The article for a topic, at the requested reading tier.
 *
 * Three sources, in priority order:
 *   1. The authored curriculum (lib/demo/db/curriculum) if its course chunk has
 *      been loaded. Call `loadCourseCurriculum(courseId)` before this, since the
 *      lookup is a synchronous cache read: a miss means "not loaded yet", not
 *      "not written".
 *   2. The four hand-written articles in AUTHORED below, kept because they
 *      predate the curriculum and are the ones the tour opens.
 *   3. The generated scaffold, which is now a genuine last resort. It used to
 *      serve 63 of 67 topics, which is why every lesson read the same.
 */
export function articleBody(
  topic: DemoTopic,
  tier: ReadingTier,
  fallbackConcepts: string[],
  courseId?: number,
): ArticleBody {
  const curriculum = courseId == null ? null : peekTopic(courseId, topic.id);
  if (curriculum) {
    const html = curriculum.body[tier] ?? curriculum.body.Intermediate;
    return {
      summary: curriculum.summary,
      concepts: curriculum.concepts,
      glossary: curriculum.glossary,
      html,
      readingMinutes: readingMinutesFor(html),
    };
  }

  const authored = AUTHORED[topic.title];
  if (authored) {
    const html = authored.body[tier] ?? authored.body.Intermediate;
    return {
      summary: authored.summary,
      concepts: authored.concepts,
      glossary: authored.glossary,
      html,
      readingMinutes: readingMinutesFor(html),
    };
  }

  const concepts = fallbackConcepts;
  const html = generatedBody(topic, concepts);
  return {
    summary: `An introduction to ${topic.title.toLowerCase()}, and how it connects to the rest of this track.`,
    concepts,
    glossary: {},
    html,
    readingMinutes: readingMinutesFor(html),
  };
}

/** Whether a topic has a hand-written article (used to prefer it in demos). */
export function isAuthored(topic: DemoTopic): boolean {
  return topic.title in AUTHORED;
}
