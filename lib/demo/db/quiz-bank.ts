import { peekTopic, type AuthoredQuestion } from "./curriculum";
/**
 * The MCQ bank.
 *
 * Questions are authored per COURSE rather than per topic. There are ~120 topics
 * in the catalogue and hand-writing a bank for each is not realistic, but a
 * generated question is instantly recognisable as filler - and the quiz is the
 * screen where a prospect judges whether the "adaptive" claim is real. A
 * course-level bank keeps every question genuinely on-subject, and the selector
 * prefers the ones whose skill matches the topic being studied.
 *
 * Each question carries a difficulty and a target skill, which is what the
 * adaptive selector actually steers on: answer well and it climbs, struggle and
 * it drops back.
 */

/**
 * Option shape is `{ id, label, value }` because that is what `AdaptiveOption`
 * in lib/types/adaptive-quiz.ts declares. Emitting `{ key, text }` instead did
 * not fail loudly - the quiz rendered the question and then jumped straight to
 * the confidence prompt with no answers on screen at all.
 */
export interface DemoMcq {
  id: number;
  question: string;
  options: { id: string; label: string; value: string }[];
  correct: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skill: string;
  explanation: string;
}

let mcqSeq = 700_000;
function mcq(
  question: string,
  options: [string, string, string, string],
  correctIndex: number,
  difficulty: DemoMcq["difficulty"],
  skill: string,
  explanation: string,
): DemoMcq {
  const keys = ["A", "B", "C", "D"];
  return {
    id: mcqSeq++,
    question,
    // `id` is the letter badge and the value submitted back (QuestionCard calls
    // onSelectOption(opt.id)); `value` is the answer TEXT, which it renders as
    // HTML. Putting the letter in `value` rendered four rows reading "A A B B".
    options: options.map((text, i) => ({ id: keys[i], label: text, value: text })),
    correct: keys[correctIndex],
    difficulty,
    skill,
    explanation,
  };
}

/** Course id -> question bank. */
export const QUIZ_BANK: Record<number, DemoMcq[]> = {
  // Full-Stack Web Development
  201: [
    mcq(
      "You call `setItems(items)` after `items.push(newItem)`. The screen does not update. Why?",
      [
        "React batches state updates and dropped one",
        "The array reference did not change, so React sees no update",
        "`push` returns the new length, not the array",
        "State updates are asynchronous and this one was cancelled",
      ],
      1,
      "Medium",
      "React",
      "React compares state by reference. `push` mutates the existing array, so the reference is identical and React concludes nothing changed. Pass a new array: `setItems([...items, newItem])`.",
    ),
    mcq(
      "Which HTTP method is safe AND idempotent?",
      ["POST", "GET", "PATCH", "None of these"],
      1,
      "Easy",
      "REST",
      "GET is safe (no side effects) and idempotent (repeating it changes nothing). POST is neither. PATCH is generally not idempotent because it can describe a relative change.",
    ),
    mcq(
      "A query is fast in development and slow in production against the same schema. What is the most likely cause?",
      [
        "Production runs a different SQL dialect",
        "The production table is large enough that the planner stopped using an index",
        "Connection pooling is disabled in production",
        "Production has less memory for the query cache",
      ],
      1,
      "Hard",
      "PostgreSQL",
      "Query plans depend on table statistics. At small row counts a sequential scan is cheap and plans look fine; at production sizes a missing or unusable index turns the same query into a full scan.",
    ),
    mcq(
      "What does the `key` prop let React do when rendering a list?",
      [
        "Sort the list automatically",
        "Match elements across renders so it can move rather than rebuild them",
        "Cache the component's render output",
        "Guarantee the list renders in index order",
      ],
      1,
      "Medium",
      "React",
      "Keys give each element a stable identity between renders. Without them React falls back to index matching, which reuses the wrong DOM nodes when items are inserted or reordered, so state attaches to the wrong row.",
    ),
    mcq(
      "In TypeScript, what does `unknown` give you that `any` does not?",
      [
        "Better runtime performance",
        "It forces you to narrow the type before using the value",
        "It allows any property access without error",
        "It is a runtime type check",
      ],
      1,
      "Medium",
      "TypeScript",
      "`any` disables checking entirely. `unknown` accepts any value but permits nothing until you narrow it, so the check happens where the value is actually used.",
    ),
    mcq(
      "Two requests fire for the same resource and the slower one resolves last, overwriting newer data. What is the standard fix?",
      [
        "Increase the request timeout",
        "Track the latest request and ignore responses that are no longer current",
        "Move the fetch into a `useMemo`",
        "Retry the faster request",
      ],
      1,
      "Hard",
      "React",
      "This is a race condition, not a timing problem. Tag or abort in-flight requests (an AbortController, or a request id compared on arrival) so a stale response cannot overwrite a newer one.",
    ),
    mcq(
      "What is the N+1 query problem?",
      [
        "A query that returns one extra row",
        "Fetching a list, then issuing one more query per item in that list",
        "A join that duplicates rows",
        "An off-by-one error in pagination",
      ],
      1,
      "Medium",
      "PostgreSQL",
      "One query fetches N parents, then N further queries fetch each parent's children. It is invisible at small N and quadratic in cost at scale. Fixed with a join or a batched fetch.",
    ),
    mcq(
      "Why store a JWT's expiry check on the client if the server validates it anyway?",
      [
        "It replaces server-side validation",
        "So the client can refresh ahead of expiry instead of paying a failed request first",
        "Because JWTs cannot be validated on the server",
        "To keep the token smaller",
      ],
      1,
      "Hard",
      "Node.js",
      "The server remains the authority. Reading `exp` client-side is a latency optimisation: refresh proactively so a request never has to fail, refresh, and retry on its critical path.",
    ),
  ],

  // Python for Data Science
  202: [
    mcq(
      "Your group-by totals are lower than the raw sum. What should you check first?",
      [
        "Whether the aggregation function is wrong",
        "Whether rows with NaN in the grouping key were dropped",
        "Whether the index is sorted",
        "Whether the dtype is float",
      ],
      1,
      "Medium",
      "pandas",
      "`groupby` drops rows whose key is NaN by default, so those rows silently vanish from every total. Pass `dropna=False` to keep them.",
    ),
    mcq(
      "Which returns a result aligned to the original rows, so it can be assigned back as a column?",
      ["agg", "transform", "apply with reduce", "pivot_table"],
      1,
      "Medium",
      "pandas",
      "`agg` collapses each group to one row. `transform` broadcasts the group result back across every original row, keeping the index aligned for assignment.",
    ),
    mcq(
      "What does a SettingWithCopyWarning actually indicate?",
      [
        "The DataFrame is too large to modify",
        "You may be writing to a temporary copy rather than the original",
        "The column dtype is wrong",
        "The operation is deprecated",
      ],
      1,
      "Medium",
      "pandas",
      "Chained indexing can produce a view or a copy, and pandas cannot always tell which. The write may land on a throwaway object. Use a single `.loc[...]` so the target is unambiguous.",
    ),
    mcq(
      "You get 0.94 accuracy on a dataset where 94% of rows are the negative class. What does that tell you?",
      [
        "The model is performing well",
        "Essentially nothing - predicting the majority class alone scores the same",
        "The model is overfitting",
        "The test set is too small",
      ],
      1,
      "Medium",
      "Statistics",
      "On imbalanced data, accuracy is dominated by the majority class. A model that always answers 'negative' scores identically. Use precision, recall or PR-AUC instead.",
    ),
    mcq(
      "Why must scaling be fitted on the training set only?",
      [
        "It runs faster that way",
        "Fitting on all data leaks test-set information into training",
        "Scalers cannot be reused across splits",
        "It avoids NaN values",
      ],
      1,
      "Hard",
      "scikit-learn",
      "Fitting on the full dataset lets the training process see statistics derived from the test set. The score then overstates real performance, and the gap only appears in production.",
    ),
    mcq(
      "A p-value of 0.03 means:",
      [
        "There is a 3% chance the null hypothesis is true",
        "If the null hypothesis were true, data this extreme would occur 3% of the time",
        "The effect is large",
        "The result will replicate 97% of the time",
      ],
      1,
      "Hard",
      "Statistics",
      "A p-value is the probability of the observed data (or more extreme) given the null hypothesis, not the probability that the hypothesis is true, and it says nothing about effect size.",
    ),
    mcq(
      "Which is a vectorised operation in NumPy?",
      [
        "Looping over an array with `for` and appending",
        "`arr * 2` applied to the whole array",
        "`[x * 2 for x in arr]`",
        "`map(lambda x: x * 2, arr)`",
      ],
      1,
      "Easy",
      "Python",
      "Vectorised operations execute in compiled code across the whole array at once, avoiding a Python-level loop per element. The other three all pay per-element interpreter overhead.",
    ),
    mcq(
      "An inner join drops rows you expected to keep. The most likely cause is:",
      [
        "The join column has mismatched types or unnormalised values",
        "The DataFrames are too large",
        "The index is not sorted",
        "There are duplicate columns",
      ],
      0,
      "Medium",
      "pandas",
      "Join keys must match exactly. `\"123\"` and `123`, or values differing by whitespace or case, will not match, and an inner join silently discards anything unmatched.",
    ),
  ],

  // Data Structures & Algorithms
  203: [
    mcq(
      "Why does a variable-size sliding window stay O(n) despite its inner shrink loop?",
      [
        "The inner loop runs at most a constant number of times",
        "The left pointer only ever moves forward, so it advances at most n times overall",
        "The window size is bounded by a constant",
        "It only appears to have a nested loop",
      ],
      1,
      "Hard",
      "Algorithms",
      "This is amortised analysis. Each element enters the window once and leaves at most once, so total pointer movement is bounded by 2n regardless of how the work is distributed across iterations.",
    ),
    mcq(
      "Which problem shape signals a sliding window?",
      [
        "Best contiguous run under a constraint",
        "Any subset summing to a target",
        "Shortest path in a weighted graph",
        "Counting distinct pairs anywhere in the array",
      ],
      0,
      "Medium",
      "Algorithms",
      "Sliding window needs contiguity plus a constraint that worsens monotonically as the window grows. Non-contiguous subsets are usually DP; unordered pairs are usually hashing.",
    ),
    mcq(
      "What is the worst-case time of a hash map lookup?",
      ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      2,
      "Medium",
      "Complexity",
      "Average is O(1), but if every key collides into one bucket the lookup degrades to scanning a list. Interview answers should state both the average and the worst case.",
    ),
    mcq(
      "You need the smallest element repeatedly while inserting new ones. Which structure fits?",
      ["Sorted array", "Min-heap", "Hash map", "Stack"],
      1,
      "Easy",
      "Data Structures",
      "A min-heap gives O(1) access to the minimum and O(log n) insert and extract. Keeping an array fully sorted costs O(n) per insert.",
    ),
    mcq(
      "When is BFS preferable to DFS?",
      [
        "When you need the shortest path in an unweighted graph",
        "When the graph is very deep",
        "When memory is severely constrained",
        "When the graph has cycles",
      ],
      0,
      "Medium",
      "Algorithms",
      "BFS explores by distance, so the first time it reaches a node it has done so in the fewest edges. DFS offers no such guarantee. On unweighted graphs BFS is effectively Dijkstra.",
    ),
    mcq(
      "A monotonic stack is the right tool when the question asks for:",
      [
        "The next greater element for each position",
        "The kth largest element overall",
        "Whether a cycle exists",
        "The number of distinct values",
      ],
      0,
      "Hard",
      "Data Structures",
      "Maintaining a stack in monotonic order lets each element be pushed and popped at most once, answering next-greater or next-smaller queries in O(n) instead of O(n squared).",
    ),
    mcq(
      "In dynamic programming, what does 'state' mean?",
      [
        "The current value of the answer",
        "The minimal information needed to describe a subproblem",
        "The recursion depth",
        "The size of the memo table",
      ],
      1,
      "Hard",
      "Algorithms",
      "Choosing the state is the hard part of DP. It must capture everything the remaining decisions depend on, and nothing more; extra dimensions inflate the table without changing the answer.",
    ),
    mcq(
      "What is the time complexity of building a heap from an unsorted array of n elements?",
      ["O(n log n)", "O(n)", "O(log n)", "O(n squared)"],
      1,
      "Hard",
      "Complexity",
      "Bottom-up heapify is O(n). The common O(n log n) answer describes inserting elements one at a time; the sift-down construction is provably linear.",
    ),
  ],

  // Cloud Engineering with AWS
  204: [
    mcq(
      "What does 'least privilege' mean for an IAM policy?",
      [
        "Grant only the permissions the task actually needs",
        "Use one shared admin role for simplicity",
        "Deny all traffic by default",
        "Rotate access keys frequently",
      ],
      0,
      "Easy",
      "AWS",
      "Least privilege scopes each identity to exactly the actions and resources it requires, so a compromised credential has a small blast radius.",
    ),
    mcq(
      "Which Docker practice most reduces image rebuild time?",
      [
        "Combining every command into one RUN",
        "Copying dependency manifests and installing before copying source",
        "Using the latest base image tag",
        "Adding a .dockerignore only",
      ],
      1,
      "Medium",
      "Docker",
      "Layers are cached in order. Installing dependencies before copying source means a source edit reuses the dependency layer instead of reinstalling everything.",
    ),
    mcq(
      "A container works locally but cannot reach the database in AWS. What do you check first?",
      [
        "The Dockerfile syntax",
        "Security group and subnet routing",
        "The container's CPU limit",
        "The image tag",
      ],
      1,
      "Medium",
      "AWS",
      "Connectivity failures between AWS resources are almost always network policy: a security group that does not allow the port, or a subnet with no route to the database.",
    ),
    mcq(
      "Why is infrastructure as code preferred over console clicks?",
      [
        "It is faster to write the first time",
        "The environment is reviewable, reproducible and can be recreated",
        "It removes the need for permissions",
        "It is required by AWS",
      ],
      1,
      "Medium",
      "Terraform",
      "Declared infrastructure can be diffed, reviewed, versioned and rebuilt identically. Console changes leave no history and cannot be reproduced reliably.",
    ),
    mcq(
      "What distinguishes a metric from a log?",
      [
        "Metrics are aggregated numbers over time; logs are discrete events",
        "Logs are numeric and metrics are textual",
        "Metrics are only for errors",
        "There is no practical difference",
      ],
      0,
      "Easy",
      "Observability",
      "Metrics are cheap to store and query in aggregate, which suits alerting. Logs carry per-event detail, which suits diagnosing a specific failure after an alert fires.",
    ),
  ],

  // SQL & Database Design
  205: [
    mcq(
      "`WHERE column != 'x'` unexpectedly excludes rows. Why?",
      [
        "The comparison is case-sensitive",
        "Rows where the column is NULL are excluded, because NULL comparisons are unknown",
        "The index is missing",
        "`!=` is not valid SQL",
      ],
      1,
      "Medium",
      "SQL",
      "NULL is not a value but the absence of one, so `NULL != 'x'` evaluates to unknown rather than true and the row is filtered out. Use `IS NULL` explicitly.",
    ),
    mcq(
      "Which join keeps every row from the left table regardless of match?",
      ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "FULL JOIN"],
      1,
      "Easy",
      "SQL",
      "LEFT JOIN preserves all left rows, filling unmatched right columns with NULL. INNER JOIN keeps only matched pairs.",
    ),
    mcq(
      "What is the difference between WHERE and HAVING?",
      [
        "They are interchangeable",
        "WHERE filters rows before aggregation; HAVING filters groups after",
        "HAVING is faster",
        "WHERE only works on indexed columns",
      ],
      1,
      "Medium",
      "SQL",
      "WHERE runs before grouping, so it cannot reference aggregates. HAVING runs after and can. Filtering in WHERE where possible is cheaper, since fewer rows reach the grouping step.",
    ),
    mcq(
      "An index on a column makes writes slower. Why?",
      [
        "Indexes lock the table",
        "Every insert or update must also maintain the index structure",
        "Indexes force a full scan on write",
        "It does not affect writes",
      ],
      1,
      "Medium",
      "Performance",
      "An index is a second structure kept in sync with the table. Reads get faster, writes pay the maintenance cost, which is why indexing everything is counterproductive.",
    ),
    mcq(
      "In an EXPLAIN plan, a sequential scan on a large table usually means:",
      [
        "The query is optimal",
        "No usable index exists for the predicate, or the planner judged the scan cheaper",
        "The table is corrupted",
        "The statistics are disabled",
      ],
      1,
      "Hard",
      "Performance",
      "A sequential scan is not automatically wrong: on a small table, or when a query returns most rows, it genuinely is cheaper. On a large table with a selective predicate it usually signals a missing index.",
    ),
  ],
};

/**
 * Questions for a topic, ordered so that ones matching the topic's own concepts
 * come first. The selector then filters by difficulty, so a learner doing well
 * sees the harder on-topic questions before any generic ones.
 */
export function bankForTopic(
  courseId: number,
  concepts: string[],
  topicId?: number,
): DemoMcq[] {
  // Authored questions for THIS topic come first and in full: they are written
  // against its own concepts and carry an explanation that names the tempting
  // wrong answer. The shared course bank follows as filler, so a learner who
  // exhausts the authored set still gets on-course questions rather than a
  // "no more questions" dead end.
  const authored = topicId == null ? null : peekTopic(courseId, topicId);
  const own = (authored?.questions ?? []).map(authoredToMcq);

  const bank = QUIZ_BANK[courseId] ?? [];
  const wanted = new Set(concepts.map((c) => c.toLowerCase()));
  const onTopic = bank.filter((q) => wanted.has(q.skill.toLowerCase()));
  const rest = bank.filter((q) => !wanted.has(q.skill.toLowerCase()));
  return [...own, ...onTopic, ...rest];
}

/**
 * Authored question to the shape the quiz engine speaks.
 *
 * The id is derived from the topic and the question number rather than taken
 * from a counter, because the engine records "already asked" by id and a counter
 * would renumber the same question between two sessions.
 */
function authoredToMcq(q: AuthoredQuestion & { topicId?: number }, i: number): DemoMcq {
  const keys = ["A", "B", "C", "D"];
  return {
    id: 800_000 + (q.n ?? i) * 97,
    question: q.question,
    options: q.options.map((text, k) => ({ id: keys[k], label: text, value: text })),
    correct: keys[q.answer],
    difficulty: q.difficulty,
    skill: q.skill,
    explanation: q.explanation,
  };
}
