/**
 * Course 205: SQL & Database Design.
 *
 * The through line of this course is that SQL is a declarative language whose
 * surprises all come from the same place: the engine is free to do anything that
 * produces the declared result, and the declared result is defined by rules
 * (three-valued logic, join cardinality, aggregate grouping, frame boundaries)
 * that are precise but rarely taught. So every topic here teaches the rule first
 * and the syntax second, and every coding exercise makes the learner implement
 * the rule in JavaScript rather than write a query string we then compare.
 */

import type { CourseCurriculum } from "./types";

const CURRICULUM: CourseCurriculum = {
  5062: {
    topicId: 5062,
    title: "Filtering, ordering and NULL semantics",
    summary:
      "Predict exactly which rows a WHERE clause keeps once NULLs are in play, and write ORDER BY clauses that return the same sequence every run, including a deliberate choice about where the empty values land.",
    concepts: [
      "Three-valued logic",
      "NULL propagation",
      "IS DISTINCT FROM",
      "Deterministic ORDER BY",
      "NULLS FIRST and NULLS LAST",
    ],
    glossary: {
      NULL:
        "A marker meaning the value is unknown or not applicable. It is not zero, not an empty string, and it is not equal to another NULL.",
      "Three-valued logic":
        "SQL predicates evaluate to true, false or unknown. A WHERE clause keeps a row only when its predicate is true, so unknown behaves like false at the filter but not everywhere else.",
      Unknown:
        "The third truth value, produced whenever a comparison has a NULL on either side.",
      "IS NULL":
        "The only reliable test for absence. It is a predicate in its own right precisely because equality against NULL yields unknown rather than true.",
      "IS DISTINCT FROM":
        "A comparison that treats two NULLs as the same and a NULL against a value as different, so it always returns true or false and never unknown.",
      COALESCE:
        "Returns its first non-NULL argument. Used to substitute a stand-in value before comparing, sorting or aggregating.",
      "Deterministic order":
        "An ORDER BY whose key list breaks every tie, so two runs of the same query over unchanged data return rows in the same sequence.",
      Collation:
        "The rule set that decides how text values compare and sort, which is why the same ORDER BY can produce different orders on two servers.",
    },
    body: {
      Beginner: `<p>A table is a grid of rows, and a <code>WHERE</code> clause is a request to keep some of those rows and discard the rest. The part that surprises nearly everyone is what happens when a cell has been left empty.</p>
<h2>Empty is not blank</h2>
<p>An empty cell in SQL holds <code>NULL</code>. That is not zero, and it is not an empty piece of text. It means the value is not known. Picture a paper form where somebody skipped the phone number line. You cannot say the number is wrong, and you cannot say it matches the number you are hunting for. You genuinely do not know.</p>
<h2>Three answers, not two</h2>
<p>Because of that, a comparison in SQL can come back with three answers rather than two: true, false, or unknown. A <code>WHERE</code> clause keeps a row only when the answer is true. Rows that answer unknown are dropped exactly like rows that answer false. This is why <code>WHERE phone = NULL</code> returns nothing at all, not even the rows whose phone really is missing. The test you actually want is <code>WHERE phone IS NULL</code>.</p>
<aside class="tip">When a filter loses rows you expected to see, ask which column inside it is allowed to be empty. That is the explanation most of the time.</aside>
<h2>Unknown spreads</h2>
<p>Unknown does not stay put. Combine it with something else and it usually carries through: <code>NULL + 10</code> is <code>NULL</code>, and <code>salary &gt; 1000</code> is unknown when the salary is missing. There is one useful exception worth remembering early. <code>false AND unknown</code> is <code>false</code>, because a false half already settles the question, and <code>true OR unknown</code> is <code>true</code> for the same reason.</p>
<h2>Putting rows in order</h2>
<p>An <code>ORDER BY</code> clause sorts the result. Two things trip people up. First, if two rows tie on the sort column, the database is free to return them in either order, and it may well choose differently tomorrow. Add a second sort key, usually the primary key, so ties are broken the same way every time. Second, you get to say where the empty values go, with <code>ORDER BY score DESC NULLS LAST</code>. Say it out loud in the query rather than hoping for the default.</p>`,
      Intermediate: `<p>Filtering and ordering look like the easy half of SQL, and they are the half that produces the most quiet, unnoticed bugs. Both are governed by rules that are completely precise and almost never stated: predicates return one of three truth values, and a sort is only as repeatable as its key list is complete.</p>
<h2>Three-valued logic</h2>
<p>Every SQL predicate evaluates to true, false or unknown. Unknown appears the moment a comparison touches a <code>NULL</code>, and it then propagates through the boolean operators according to a table worth memorising:</p>
<pre>AND    | true    | false | unknown
true    | true    | false | unknown
false   | false   | false | false
unknown | unknown | false | unknown

OR     | true    | false   | unknown
true    | true    | true    | true
false   | true    | false   | unknown
unknown | true    | unknown | unknown

NOT unknown = unknown</pre>
<p>The two rows that matter operationally are <code>false AND unknown = false</code> and <code>true OR unknown = true</code>. In both cases one operand already determines the result, so the missing information cannot change it. Everywhere else, contact with a NULL contaminates the answer.</p>
<h2>Where the three values get flattened</h2>
<p>A <code>WHERE</code> clause keeps rows whose predicate is true, so unknown is discarded alongside false. That flattening is why the following pair are not equivalent, which is one of the most common production defects in SQL:</p>
<pre>SELECT * FROM staff WHERE department = 'Sales';
SELECT * FROM staff WHERE department &lt;&gt; 'Sales';</pre>
<p>Together they do not cover the table. Every row whose <code>department</code> is NULL fails both, because both comparisons return unknown. If you want the complement you must write it: <code>WHERE department IS DISTINCT FROM 'Sales'</code>, which never returns unknown and therefore does partition the table.</p>
<h2>Testing for absence properly</h2>
<p>Use <code>IS NULL</code> and <code>IS NOT NULL</code> to ask about presence. Use <code>IS DISTINCT FROM</code> when you want an equality test that behaves the way people expect, treating two NULLs as the same value. It is invaluable in change detection, where <code>WHERE new.email IS DISTINCT FROM old.email</code> correctly flags a value that appeared, disappeared or changed, while <code>&lt;&gt;</code> silently misses the first two cases.</p>
<p><code>COALESCE(value, fallback)</code> substitutes a stand-in before the comparison happens. It is the right tool for presentation and a poor tool for filtering, because wrapping an indexed column in a function usually stops the index being used for the lookup.</p>
<h2>Ordering is not automatically stable</h2>
<p>Without <code>ORDER BY</code>, a result has no defined order at all, whatever it looked like the first ten times you ran it. With <code>ORDER BY</code>, rows that tie on the key list may appear in any order, and a plan change is enough to alter it. That is how pagination starts skipping and repeating rows: page two is computed with a different physical plan from page one, and rows that tie on <code>created_at</code> shuffle between them. The fix is to make the key list unique by appending a tiebreaker, typically the primary key.</p>
<h2>Where NULLs sort</h2>
<p>NULLs have no natural position in a sort, so each database picks a default and they do not agree. PostgreSQL treats NULL as larger than any value, so it lands last under <code>ASC</code> and first under <code>DESC</code>. MySQL does the opposite. Write the intent down instead of inheriting it:</p>
<pre>SELECT id, score
FROM   attempts
ORDER  BY score DESC NULLS LAST, id ASC;</pre>
<aside class="tip">A useful review habit: for every ORDER BY, ask whether the key list is unique, and for every WHERE, ask which columns in it are nullable. Two questions, most of the class of bug gone.</aside>`,
      Advanced: `<p>Once you accept that predicates are three-valued, the interesting work is spotting the constructs where SQL quietly converts unknown into a decision, and the ones where it refuses to.</p>
<h2>NOT IN against a nullable subquery</h2>
<p>This is the highest impact NULL trap in the language:</p>
<pre>SELECT * FROM orders
WHERE  customer_id NOT IN (SELECT customer_id FROM blocked);</pre>
<p>If a single row of <code>blocked</code> has a NULL <code>customer_id</code>, the query returns zero rows. <code>x NOT IN (a, b, NULL)</code> expands to <code>x &lt;&gt; a AND x &lt;&gt; b AND x &lt;&gt; NULL</code>, and that final conjunct is unknown, so the whole predicate can never be true. It can only be false or unknown, and both are discarded. <code>NOT EXISTS</code> has no such problem because it tests row existence rather than value equality, which is why it is the default choice for an anti-join.</p>
<h2>Where unknown does not behave like false</h2>
<p>The flattening rule belongs to <code>WHERE</code>, <code>HAVING</code> and <code>ON</code>. A <code>CHECK</code> constraint does the opposite: it rejects a row only when the condition evaluates to false, so <code>CHECK (discount &lt; price)</code> happily accepts a row whose discount is NULL. The same asymmetry shows up in <code>UNIQUE</code>, which does not consider two NULLs to be duplicates and therefore allows unlimited NULL rows in a unique column. Constraints are permissive about unknown; filters are hostile to it. Keeping that distinction straight explains a surprising amount of otherwise inexplicable data.</p>
<h2>Aggregates and the empty set</h2>
<p><code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts non-NULL values of that column, and the gap between the two numbers is a free data quality metric. <code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> skip NULLs entirely, so <code>AVG(score)</code> is the mean of the scores that exist rather than a mean over all rows, and <code>SUM</code> over an empty or all NULL set returns NULL rather than zero. If a report must show zero, say so explicitly with <code>COALESCE(SUM(amount), 0)</code>.</p>
<h2>Ordering under LIMIT</h2>
<p>An unstable <code>ORDER BY</code> is harmless until you add <code>LIMIT</code>. Then the tie is no longer a cosmetic reordering, it decides which rows exist in the answer. Two consecutive pages computed by different plans, or by the same plan after an autovacuum has moved tuples, can drop and duplicate rows without any error. Keyset pagination sidesteps this completely: order by a unique key list and continue with <code>WHERE (created_at, id) &lt; (:last_created_at, :last_id)</code> rather than an offset.</p>
<h2>Ordering, indexes and collation</h2>
<p>An index can satisfy an <code>ORDER BY</code> and remove the sort node entirely, but only when direction and null placement agree. A default PostgreSQL B-tree on <code>score</code> stores ascending with NULLs last, which serves <code>ORDER BY score ASC NULLS LAST</code> and also serves the exact reverse by scanning backwards. Ask for <code>DESC NULLS LAST</code> and the ordering no longer matches either direction, so the planner adds a sort unless you build the index as <code>(score DESC NULLS LAST)</code>. Text ordering has a second dependency: collation. Change the collation and the sort order of the same rows changes with it, so index and query must agree there too.</p>
<aside class="tip">Three-valued logic is not a wart, it is a consequence: SQL declines to invent a fact it was never given. The bugs come from code that assumes a two-valued world.</aside>`,
      Expert: `<p>SQL's treatment of missing information is a deliberate design position, not an accident of implementation, and understanding the position makes the edge cases predictable rather than memorised.</p>
<h2>The semantics underneath</h2>
<p>Codd's proposal was that a relational system must represent missing information without resorting to sentinel values, because any sentinel you pick (0, the empty string, 1900-01-01) is a value that will eventually be legitimate data. The cost of that choice is that the logic can no longer be two-valued: a predicate over an unknown operand has no truth value, and the system must not fabricate one. Hence the third value and the Kleene strong three-valued truth tables, in which unknown absorbs unless the other operand is already decisive.</p>
<p>The flattening at the filter boundary is where the theory meets practical need. Set membership must be a yes or a no, so <code>WHERE</code>, <code>ON</code> and <code>HAVING</code> keep only true. Integrity constraints made the opposite choice, rejecting only on false, because a constraint is a prohibition and you should not prohibit on the basis of information you do not have. This is why <code>CHECK</code> and <code>UNIQUE</code> are permissive about NULL while filters are not, and it is worth stating plainly to a team, because the inconsistency looks arbitrary until you see the rule behind it.</p>
<h2>What the documentation understates</h2>
<p>Three things routinely bite experienced practitioners. First, <code>NOT IN</code> with a nullable subquery is documented but its cost is not: PostgreSQL cannot transform it into a hashed anti-join when nulls are possible, so beyond the wrong-answer risk it is also the slow form. Second, <code>DISTINCT</code>, <code>GROUP BY</code>, <code>UNION</code> and window <code>PARTITION BY</code> all use a not-distinct comparison in which two NULLs group together, which is the exact opposite of the equality used by <code>WHERE</code>. The same two values are "different" in a join and "the same" in a group. Third, <code>IS DISTINCT FROM</code> was historically an optimisation barrier in several engines, so change-detection predicates that were correct were also unindexable, and the pragmatic workaround is a generated column or a pair of predicates joined by OR.</p>
<h2>Storage and cost</h2>
<p>A NULL in PostgreSQL occupies no space in the tuple body: presence is recorded in a per-tuple null bitmap that exists only when the tuple has at least one NULL. A wide, mostly empty table therefore stores far more compactly than its column count suggests, and column order affects the alignment padding around that bitmap. B-tree indexes do store NULL entries, which is what lets an index-only scan answer <code>IS NULL</code>, and it is also why a partial index declared <code>WHERE col IS NOT NULL</code> can be dramatically smaller on a sparsely populated column.</p>
<h2>Selectivity estimation</h2>
<p>The planner's row estimate for an equality predicate comes from the most common values list and the null fraction in <code>pg_statistic</code>. Nulls are excluded from the histogram and tracked separately, so <code>IS NULL</code> is one of the few predicates the planner estimates almost exactly, while <code>IS NOT NULL</code> is estimated as the complement and is therefore only as good as the analyse sample. A stale null fraction on a column that was recently backfilled is a classic cause of a plan that flips from index scan to sequential scan overnight.</p>
<h2>Ordering as a contract</h2>
<p>Treat a query's sort key list as part of its interface. If the list is not unique, the query has a nondeterministic result set under <code>LIMIT</code>, and no amount of testing will reliably surface it because determinism is a property of the plan rather than of the data. The disciplined form appends the primary key to every user-facing sort, and pagination uses a row-value comparison against the last seen key rather than an offset, which is both stable and able to use the index it was built for.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "Evaluate a predicate in three-valued logic",
        difficulty: "Medium",
        statement: `<p>Implement SQL's three-valued predicate evaluator. You are given an expression tree; return <code>true</code>, <code>false</code>, or <code>null</code> for unknown.</p>
<p>Node shapes:</p>
<ul>
<li><code>{ op: "value", value: true | false | null }</code> is a literal truth value, where <code>null</code> means unknown.</li>
<li><code>{ op: "eq", left, right }</code> compares two literals (numbers or strings, possibly <code>null</code>). If either side is <code>null</code> the result is unknown.</li>
<li><code>{ op: "not", operand }</code> negates a node. <code>NOT unknown</code> is unknown.</li>
<li><code>{ op: "and", left, right }</code> and <code>{ op: "or", left, right }</code> combine two nodes using the Kleene tables: <code>false AND unknown</code> is <code>false</code>, <code>true OR unknown</code> is <code>true</code>, and every other combination involving unknown is unknown.</li>
</ul>
<pre>evalPredicate({ op: "eq", left: null, right: 5 })   // null
evalPredicate({ op: "and",
  left:  { op: "value", value: false },
  right: { op: "eq", left: null, right: 1 } })        // false</pre>`,
        fn: "evalPredicate",
        params: "node",
        tests: [
          {
            args: [{ op: "eq", left: 5, right: 5 }],
            expected: true,
            label: "two literals compare equal",
          },
          {
            args: [{ op: "eq", left: null, right: 5 }],
            expected: null,
            label: "equality against null is unknown",
          },
          {
            args: [
              {
                op: "and",
                left: { op: "value", value: false },
                right: { op: "eq", left: null, right: 1 },
              },
            ],
            expected: false,
            label: "false AND unknown is false",
          },
          {
            args: [
              {
                op: "or",
                left: { op: "value", value: true },
                right: { op: "eq", left: null, right: 1 },
              },
            ],
            expected: true,
            label: "true OR unknown is true",
            hidden: true,
          },
          {
            args: [{ op: "not", operand: { op: "eq", left: null, right: null } }],
            expected: null,
            label: "NOT unknown stays unknown",
            hidden: true,
          },
          {
            args: [
              {
                op: "and",
                left: { op: "value", value: true },
                right: {
                  op: "or",
                  left: { op: "value", value: false },
                  right: { op: "eq", left: "a", right: "b" },
                },
              },
            ],
            expected: false,
            label: "nested expression resolves to false",
            hidden: true,
          },
        ],
        hints: [
          "There are three results, so a boolean return type is not enough. Decide early that null is a first-class answer and stop using truthiness checks.",
          "Handle the short-circuiting cases before the unknown case: AND is false if either side is false, OR is true if either side is true, whatever the other side says.",
          "Recurse for and, or and not. For eq, do not recurse at all: its operands are literals, so test them for null first and only then compare with strict equality.",
        ],
        solution: `function evalPredicate(node) {
  if (!node || typeof node !== "object") return null;
  if (node.op === "value") {
    return node.value === null || node.value === undefined ? null : Boolean(node.value);
  }
  if (node.op === "eq") {
    if (node.left === null || node.left === undefined) return null;
    if (node.right === null || node.right === undefined) return null;
    return node.left === node.right;
  }
  if (node.op === "not") {
    const inner = evalPredicate(node.operand);
    return inner === null ? null : !inner;
  }
  const left = evalPredicate(node.left);
  const right = evalPredicate(node.right);
  if (node.op === "and") {
    if (left === false || right === false) return false;
    if (left === null || right === null) return null;
    return true;
  }
  if (node.op === "or") {
    if (left === true || right === true) return true;
    if (left === null || right === null) return null;
    return false;
  }
  return null;
}`,
        skills: ["Three-valued logic", "NULL propagation"],
      },
      {
        n: 2,
        title: "ORDER BY with explicit null placement",
        difficulty: "Medium",
        statement: `<p>Implement an <code>ORDER BY</code> with more than one key and an explicit choice of where NULLs go.</p>
<p><code>rows</code> is an array of objects. <code>keys</code> is an array of sort keys applied in order, each shaped:</p>
<pre>{ column: "score", direction: "asc" | "desc", nulls: "first" | "last" }</pre>
<ul>
<li>Compare on the first key; only if the values tie do you move to the next key.</li>
<li>A <code>null</code> value is never compared by magnitude. It goes to the start or the end of that key's ordering according to <code>nulls</code>, regardless of <code>direction</code>. Two nulls tie.</li>
<li>If every key ties, keep the rows in their input order. The sort must be stable.</li>
</ul>
<p>Return a new array of the same row objects.</p>`,
        fn: "orderBy",
        params: "rows, keys",
        tests: [
          {
            args: [
              [
                { id: 1, score: 3 },
                { id: 2, score: 1 },
                { id: 3, score: 2 },
              ],
              [{ column: "score", direction: "asc", nulls: "last" }],
            ],
            expected: [
              { id: 2, score: 1 },
              { id: 3, score: 2 },
              { id: 1, score: 3 },
            ],
            label: "single ascending key",
          },
          {
            args: [
              [
                { id: 1, score: null },
                { id: 2, score: 5 },
                { id: 3, score: 9 },
              ],
              [{ column: "score", direction: "desc", nulls: "last" }],
            ],
            expected: [
              { id: 3, score: 9 },
              { id: 2, score: 5 },
              { id: 1, score: null },
            ],
            label: "descending with nulls last",
          },
          {
            args: [
              [
                { id: 1, score: null },
                { id: 2, score: 5 },
                { id: 3, score: 9 },
              ],
              [{ column: "score", direction: "desc", nulls: "first" }],
            ],
            expected: [
              { id: 1, score: null },
              { id: 3, score: 9 },
              { id: 2, score: 5 },
            ],
            label: "descending with nulls first",
          },
          {
            args: [
              [
                { id: 1, team: "b", score: 2 },
                { id: 2, team: "a", score: 2 },
                { id: 3, team: "a", score: 2 },
              ],
              [
                { column: "team", direction: "asc", nulls: "last" },
                { column: "score", direction: "desc", nulls: "last" },
              ],
            ],
            expected: [
              { id: 2, team: "a", score: 2 },
              { id: 3, team: "a", score: 2 },
              { id: 1, team: "b", score: 2 },
            ],
            label: "full tie falls back to input order",
            hidden: true,
          },
          {
            args: [[], [{ column: "score", direction: "asc", nulls: "last" }]],
            expected: [],
            label: "empty input",
            hidden: true,
          },
        ],
        hints: [
          "Stability is easiest to guarantee if you carry each row's original index alongside it and use that index as the final tiebreaker.",
          "Write the comparison for one key as a small function returning a negative number, zero or a positive number, then loop the keys and return the first non-zero result.",
          "Test for null before you test for magnitude. If exactly one side is null, the answer depends only on the key's nulls setting; if both are null, treat the key as tied and continue to the next one.",
        ],
        solution: `function orderBy(rows, keys) {
  const decorated = rows.map((row, index) => ({ row, index }));
  decorated.sort((a, b) => {
    for (const key of keys) {
      const left = a.row[key.column];
      const right = b.row[key.column];
      const leftNull = left === null || left === undefined;
      const rightNull = right === null || right === undefined;
      if (leftNull || rightNull) {
        if (leftNull && rightNull) continue;
        const nullsFirst = key.nulls === "first";
        if (leftNull) return nullsFirst ? -1 : 1;
        return nullsFirst ? 1 : -1;
      }
      if (left < right) return key.direction === "desc" ? 1 : -1;
      if (left > right) return key.direction === "desc" ? -1 : 1;
    }
    return a.index - b.index;
  });
  return decorated.map((entry) => entry.row);
}`,
        skills: ["Deterministic ORDER BY", "NULLS FIRST and NULLS LAST"],
      },
    ],
  },

  5063: {
    topicId: 5063,
    title: "Joins, and the rows you did not expect",
    summary:
      "Work out a join's row count before you run it, so duplicated totals and vanishing rows stop being surprises, and choose between inner, outer, semi and anti joins on purpose.",
    concepts: [
      "Join cardinality",
      "Inner versus outer joins",
      "ON versus WHERE placement",
      "Semi-join and anti-join",
      "Fan-out and double counting",
    ],
    glossary: {
      "Inner join":
        "Returns only the pairs of rows that match on the join condition. Rows on either side with no partner disappear from the result.",
      "Left outer join":
        "Keeps every row of the left input, padding the right side with NULLs where no partner exists.",
      Cardinality:
        "The number of rows a step produces. For a join it is driven by how many partners each row finds, not by the size of either input alone.",
      "Fan-out":
        "One row matching several rows on the other side, so it appears several times in the result. The cause of nearly every duplicated total.",
      "Semi-join":
        "Keeps a left row if at least one partner exists, without duplicating it and without adding the right side's columns. Written as EXISTS or IN.",
      "Anti-join":
        "Keeps a left row only when no partner exists. Written as NOT EXISTS, and the safe alternative to NOT IN.",
      "Join key":
        "The column pair the ON clause compares. A NULL on either side never matches, including against another NULL.",
      "Cross join":
        "Every left row paired with every right row. What you accidentally get when the ON condition is missing or always true.",
    },
    body: {
      Beginner: `<p>Data is split across tables on purpose: customers live in one table, orders in another. A join is how you put them back together for a single question, such as "show me each order with the name of the person who placed it".</p>
<h2>The matching rule</h2>
<p>Every join needs a rule that says which row goes with which. Usually it is an id shared by both tables: the order stores a <code>customer_id</code>, and the customer table has an <code>id</code>. The join condition says those two must be equal.</p>
<pre>SELECT orders.id, customers.name
FROM   orders
JOIN   customers ON customers.id = orders.customer_id;</pre>
<h2>Inner joins drop the lonely rows</h2>
<p>A plain <code>JOIN</code>, also called an inner join, keeps only the pairs that matched. An order whose customer record was deleted simply will not appear, and neither will a customer who has never ordered. Nothing warns you. The row count just comes out lower than you expected.</p>
<p>If you want to keep everything on one side, use <code>LEFT JOIN</code>. That keeps every row of the first table and fills the other table's columns with empty values where there was no match. It is the right choice for "every customer, with their order count, including the ones with none".</p>
<aside class="tip">Say the sentence out loud before writing the join. "Every order, and its customer if we have one" is a LEFT JOIN. "Only orders we can attribute" is an inner join.</aside>
<h2>Rows can multiply</h2>
<p>Here is the part that catches everyone. If one customer has three orders, joining customers to orders gives you that customer three times, once per order. That is correct behaviour, but if you then add up a column that belongs to the customer rather than the order, such as their credit limit, you will have counted it three times. The total looks plausible and is wrong.</p>
<p>So before you run a join, ask a simple question about the matching rule: for one row on the left, how many rows on the right can match? If the answer is "at most one", your row count is safe. If the answer is "several", expect the result to grow, and be careful about what you sum.</p>`,
      Intermediate: `<p>A join has two independent effects, and almost every join bug comes from tracking only one of them. It adds columns, which is why you wrote it, and it changes the row count, which you have to predict.</p>
<h2>Predicting the row count</h2>
<p>The row count of a join is not a function of the two table sizes. It is a function of the join key's cardinality on each side:</p>
<ul>
<li><strong>one to one</strong>, the key is unique on both sides: the result has at most as many rows as the smaller input, and an inner join can only shrink.</li>
<li><strong>one to many</strong>, the key is unique on one side only: the result has exactly as many rows as the many side, assuming every row matches.</li>
<li><strong>many to many</strong>, the key is unique on neither side: the result grows multiplicatively per key value, and this is almost always a modelling mistake or a missing join predicate.</li>
</ul>
<p>Being able to state which of the three you are in, before running the query, is most of the skill. It is also the fastest review question to ask about somebody else's SQL.</p>
<h2>Fan-out and double counting</h2>
<p>When a row on the left matches several rows on the right, it is repeated once per match. That repetition is correct, but any aggregate over a left-hand column is now counting the same value several times:</p>
<pre>SELECT c.id, SUM(c.credit_limit), SUM(o.amount)
FROM   customers c
JOIN   orders o ON o.customer_id = c.id
GROUP  BY c.id;</pre>
<p>The second sum is right. The first is the credit limit multiplied by the order count. The reliable fixes are to aggregate the many side before joining, using a subquery or a lateral join, or to use <code>SUM(DISTINCT ...)</code> only when you can prove the value is unique per group, which is rarer than it seems.</p>
<h2>ON versus WHERE, and why it matters for outer joins</h2>
<p>For an inner join, a condition in <code>ON</code> and the same condition in <code>WHERE</code> produce the same result. For an outer join they do not, and the difference is the single most common way people accidentally turn a <code>LEFT JOIN</code> back into an inner one:</p>
<pre>SELECT c.name, o.id
FROM   customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE  o.status = 'paid';</pre>
<p>Customers with no orders get a NULL <code>o.status</code>, the <code>WHERE</code> comparison is unknown, and they are filtered out. The outer join has been undone after the fact. Move the condition into the <code>ON</code> clause and the padding rows survive, because the filter now decides which orders are eligible to match, rather than which result rows to keep. The exception is deliberate: <code>WHERE o.id IS NULL</code> after a left join is the classic anti-join idiom.</p>
<h2>Semi-joins and anti-joins</h2>
<p>Often you do not want the right side's columns at all, only the existence test. Then a join is the wrong tool, because it duplicates rows. Use <code>EXISTS</code> for "has at least one" and <code>NOT EXISTS</code> for "has none":</p>
<pre>SELECT c.name
FROM   customers c
WHERE  NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);</pre>
<p>This returns each customer at most once no matter how many orders they have, and it is NULL-safe in a way that <code>NOT IN</code> is not.</p>
<aside class="tip">A join key that is NULL matches nothing, not even another NULL. Rows with a missing foreign key silently leave an inner join, so count them deliberately rather than discovering the gap later.</aside>`,
      Advanced: `<p>Beyond correctness, the interesting questions about joins are about where the work happens: which side the engine builds, how the estimate is formed, and what an outer join forbids the planner from doing.</p>
<h2>Physical join strategies</h2>
<p>Logical join type and physical algorithm are separate choices. A nested loop scans the outer input and probes the inner one per row, which is excellent when the outer side is tiny and the inner probe is an index lookup, and catastrophic when the outer estimate is wrong by two orders of magnitude. A hash join builds a hash table on the smaller input and streams the larger past it, which handles equality only and pays memory for it, spilling to disk in batches when the build side exceeds the working memory budget. A merge join requires both inputs ordered on the key, so it is nearly free when indexes already supply that order and expensive when it has to sort. The recurring production failure is a nested loop chosen because the outer side was estimated at one row and actually returned fifty thousand.</p>
<h2>Estimation and the independence assumption</h2>
<p>A join's row estimate is derived from each input's estimate and the join selectivity, computed from the key's distinct counts and most common values. Two habits break it. Correlated predicates on the same table are assumed independent, so filtering on both <code>country</code> and <code>city</code> gets an estimate that multiplies the two selectivities and lands far below reality. Skewed join keys defeat the average: if one tenant owns eighty per cent of the rows, the estimated rows per key is a number that describes no actual tenant. Extended statistics fix the first case; a plan built for the average case remains the risk in the second.</p>
<h2>What an outer join costs the planner</h2>
<p>Inner joins are associative and commutative, so the planner may reorder them freely to find a cheap join tree. Outer joins are not: the padded rows mean the result of a left join depends on which side is preserved, and reordering across them is only legal under specific conditions. Long chains of left joins therefore constrain the search space and often produce a worse plan than the equivalent inner join, which is a good reason not to reach for <code>LEFT JOIN</code> by reflex when the foreign key is mandatory.</p>
<p>Semi-joins and anti-joins are the friendly case: <code>EXISTS</code> is a semi-join that the planner may implement as a hashed probe which stops at the first match and never duplicates the outer row, and <code>NOT EXISTS</code> becomes a hashed anti-join. <code>NOT IN</code> over a nullable column blocks that transformation entirely, because the NULL semantics have to be preserved, so it is both a correctness hazard and a performance one.</p>
<h2>Aggregating before you join</h2>
<p>When one side must be aggregated, doing it before the join keeps the cardinality at one row per key and removes the fan-out problem structurally:</p>
<pre>SELECT c.id, c.credit_limit, o.total
FROM   customers c
LEFT JOIN LATERAL (
  SELECT SUM(amount) AS total FROM orders WHERE customer_id = c.id
) o ON true;</pre>
<p>The lateral form reads well and lets the subquery use an index on <code>customer_id</code>, though it is evaluated per outer row. A pre-grouped subquery joined normally is usually faster when the outer side is large, so the choice depends on which side you expect to be small.</p>
<aside class="tip">When a join result has more rows than you expected, do not add DISTINCT. DISTINCT hides the duplication and destroys any aggregate you have already computed. Find the key that is not unique instead.</aside>`,
      Expert: `<p>Joins are where the relational model's mathematics and the engine's engineering meet most directly, and where the abstraction leaks in ways worth naming precisely.</p>
<h2>The algebra, and where it stops</h2>
<p>An inner join is a cross product followed by a selection, which is why inner joins commute and associate and why the planner is free to explore any join order that respects the predicates. Outer joins are not expressible that way: they are defined by a null-extension of the non-matching rows, which makes the operator non-commutative and only conditionally associative. That is why every real optimiser carries an outer join reordering rule set based on null-rejecting predicates, and why an outer join in the middle of a chain can pin a join order that an inner join would have let it improve. Practically: if the foreign key is <code>NOT NULL</code> and enforced, write an inner join, because you are handing the planner freedom at no semantic cost.</p>
<h2>What the manuals underplay</h2>
<p>First, join elimination. Many engines will remove a join entirely when it provably cannot change the result, which requires a foreign key constraint plus uniqueness on the referenced side. Teams that skip declaring foreign keys "for performance" lose this optimisation, and views written over wide join chains then materialise work nobody asked for. The constraint pays for itself as information for the planner, quite apart from integrity.</p>
<p>Second, the hash join build side. The documented rule is that the smaller input is built, but the decision is made on the estimate, not on reality. When the estimate is wrong the build side spills, and because batching is decided from the same estimate, a badly skewed key can send most rows into one batch. The visible symptom is a hash join whose actual time exceeds its estimate by an order of magnitude, with disk activity nowhere in the query text.</p>
<p>Third, per-loop reporting. In an <code>EXPLAIN ANALYZE</code> plan, the inner side of a nested loop reports average time and row counts per loop, so a node reading 0.02 ms with 40000 loops is 800 ms of the query. People read the number, see a small figure, and blame the wrong node.</p>
<h2>Cardinality as a design property</h2>
<p>Fan-out is a schema property before it is a query property. If a join key is not unique on either side, the model has an unnamed many to many relationship that ought to be an explicit junction table with its own key and its own attributes. When it is explicit, the query author can see the cardinality in the schema instead of deducing it from data, and the reviewer can ask the only question that matters, which is which side of the join is guaranteed unique.</p>
<h2>Practical instrumentation</h2>
<p>Before optimising a suspicious join, measure the shape rather than the time. Count distinct join key values on each side, count the maximum multiplicity per key, and count the rows whose key is NULL. Those three numbers tell you whether you are looking at a one to many join with a fair estimate, a skewed key that will defeat any average-based plan, or a silent inner-join filter caused by unmatched keys. All three change the fix, and none of them are visible in a timing profile.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "Left join, including the fan-out",
        difficulty: "Medium",
        statement: `<p>Implement a <code>LEFT JOIN</code> over two arrays of row objects, keeping the row multiplication that a real join produces.</p>
<p><code>leftJoin(left, right, leftKey, rightKey)</code> returns an array of pair objects shaped <code>{ left, right }</code>:</p>
<ul>
<li>Process left rows in their input order. For each one, emit a pair for every matching right row, in the right array's input order.</li>
<li>A left row that matches nothing emits exactly one pair, with <code>right</code> set to <code>null</code>.</li>
<li>Join keys follow SQL equality: a <code>null</code> key matches nothing at all, including another <code>null</code>.</li>
</ul>
<pre>leftJoin(
  [{ id: 1, customer: "a" }],
  [{ orderId: 1, amount: 5 }, { orderId: 1, amount: 9 }],
  "id", "orderId")
// two pairs: the left row appears once per match</pre>`,
        fn: "leftJoin",
        params: "left, right, leftKey, rightKey",
        tests: [
          {
            args: [
              [
                { id: 1, name: "ada" },
                { id: 2, name: "raj" },
              ],
              [
                { customerId: 1, amount: 30 },
                { customerId: 2, amount: 40 },
              ],
              "id",
              "customerId",
            ],
            expected: [
              { left: { id: 1, name: "ada" }, right: { customerId: 1, amount: 30 } },
              { left: { id: 2, name: "raj" }, right: { customerId: 2, amount: 40 } },
            ],
            label: "one to one",
          },
          {
            args: [
              [{ id: 1, name: "ada" }],
              [
                { customerId: 1, amount: 30 },
                { customerId: 1, amount: 12 },
              ],
              "id",
              "customerId",
            ],
            expected: [
              { left: { id: 1, name: "ada" }, right: { customerId: 1, amount: 30 } },
              { left: { id: 1, name: "ada" }, right: { customerId: 1, amount: 12 } },
            ],
            label: "fan-out repeats the left row",
          },
          {
            args: [
              [
                { id: 1, name: "ada" },
                { id: 2, name: "raj" },
              ],
              [{ customerId: 1, amount: 30 }],
              "id",
              "customerId",
            ],
            expected: [
              { left: { id: 1, name: "ada" }, right: { customerId: 1, amount: 30 } },
              { left: { id: 2, name: "raj" }, right: null },
            ],
            label: "unmatched left row is padded",
          },
          {
            args: [
              [{ id: null, name: "ghost" }],
              [{ customerId: null, amount: 30 }],
              "id",
              "customerId",
            ],
            expected: [{ left: { id: null, name: "ghost" }, right: null }],
            label: "null key matches nothing",
            hidden: true,
          },
          {
            args: [[{ id: 7, name: "sam" }], [], "id", "customerId"],
            expected: [{ left: { id: 7, name: "sam" }, right: null }],
            label: "empty right input",
            hidden: true,
          },
        ],
        hints: [
          "The output is not one pair per left row. Decide what to emit only after you have looked at every right row for that left row.",
          "Track whether the current left row matched anything. If it did not, that is when the padded pair with a null right side is produced.",
          "Check both keys for null before comparing them. A null key must skip the comparison entirely rather than fall through to an equality test.",
        ],
        solution: `function leftJoin(left, right, leftKey, rightKey) {
  const out = [];
  for (const leftRow of left) {
    const key = leftRow[leftKey];
    let matched = false;
    if (key !== null && key !== undefined) {
      for (const rightRow of right) {
        const other = rightRow[rightKey];
        if (other === null || other === undefined) continue;
        if (other === key) {
          out.push({ left: leftRow, right: rightRow });
          matched = true;
        }
      }
    }
    if (!matched) out.push({ left: leftRow, right: null });
  }
  return out;
}`,
        skills: ["Join cardinality", "Fan-out and double counting", "Inner versus outer joins"],
      },
      {
        n: 2,
        title: "Anti-join without the NOT IN trap",
        difficulty: "Medium",
        statement: `<p>Return the ids of orders that have no payment, which is the anti-join <code>NOT EXISTS</code> expresses.</p>
<p><code>unpaidOrderIds(orders, payments)</code> takes orders shaped <code>{ id, total }</code> and payments shaped <code>{ orderId, amount }</code>. Return the ids of orders with no payment row referring to them, sorted ascending.</p>
<ul>
<li>Each order id appears at most once in the result, even if several payments exist for other orders.</li>
<li>A payment whose <code>orderId</code> is <code>null</code> refers to no order. It must not match anything, and it must not cause the result to collapse to an empty list, which is exactly what <code>NOT IN</code> would do here.</li>
</ul>`,
        fn: "unpaidOrderIds",
        params: "orders, payments",
        tests: [
          {
            args: [
              [
                { id: 1, total: 30 },
                { id: 2, total: 40 },
                { id: 3, total: 10 },
              ],
              [{ orderId: 2, amount: 40 }],
            ],
            expected: [1, 3],
            label: "basic",
          },
          {
            args: [
              [
                { id: 1, total: 30 },
                { id: 2, total: 40 },
              ],
              [
                { orderId: 1, amount: 30 },
                { orderId: 2, amount: 40 },
              ],
            ],
            expected: [],
            label: "everything is paid",
          },
          {
            args: [
              [
                { id: 5, total: 30 },
                { id: 6, total: 40 },
              ],
              [
                { orderId: null, amount: 15 },
                { orderId: 6, amount: 40 },
              ],
            ],
            expected: [5],
            label: "a null reference must not swallow the result",
            hidden: true,
          },
          {
            args: [
              [
                { id: 1, total: 30 },
                { id: 2, total: 40 },
              ],
              [
                { orderId: 1, amount: 10 },
                { orderId: 1, amount: 20 },
              ],
            ],
            expected: [2],
            label: "duplicate payments for one order",
            hidden: true,
          },
          {
            args: [[{ id: 9, total: 1 }], []],
            expected: [9],
            label: "no payments at all",
          },
        ],
        hints: [
          "Scanning the payments once per order works but repeats itself. Build the set of referenced order ids first, then make a single pass over the orders.",
          "Decide what to do with a payment whose orderId is null while you are building that set, not while you are testing orders against it.",
          "A Set gives constant-time membership. Add only non-null orderIds to it, then keep the orders whose id the set does not contain, and sort numerically before returning.",
        ],
        solution: `function unpaidOrderIds(orders, payments) {
  const referenced = new Set();
  for (const payment of payments) {
    if (payment.orderId === null || payment.orderId === undefined) continue;
    referenced.add(payment.orderId);
  }
  const ids = [];
  for (const order of orders) {
    if (!referenced.has(order.id)) ids.push(order.id);
  }
  return ids.sort((a, b) => a - b);
}`,
        skills: ["Semi-join and anti-join", "Join cardinality"],
      },
    ],
  },

  5064: {
    topicId: 5064,
    title: "Aggregation and HAVING",
    summary:
      "Collapse rows into groups deliberately, know which rows an aggregate silently ignores, and place each condition in WHERE or HAVING according to whether it filters a row or a group.",
    concepts: [
      "Grouping keys",
      "Aggregates and NULL",
      "WHERE versus HAVING",
      "COUNT(*) versus COUNT(column)",
      "Conditional aggregation",
    ],
    glossary: {
      "Grouping key":
        "The expression list in GROUP BY. One output row is produced per distinct combination of its values, and two NULL keys are treated as the same group.",
      Aggregate:
        "A function that consumes many rows and returns one value, such as SUM, COUNT, AVG, MIN or MAX.",
      HAVING:
        "A filter applied after grouping, so its conditions may reference aggregates. WHERE runs before grouping and may not.",
      "COUNT(*)":
        "Counts rows in the group without inspecting any column, so it never skips a row for being empty.",
      "COUNT(column)":
        "Counts only the rows whose column is not NULL, which makes the gap against COUNT(*) a free measure of missing data.",
      "Conditional aggregation":
        "Aggregating a CASE expression, for example SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END), to produce several filtered measures in a single pass.",
      "Empty group":
        "A group that no row entered. It does not appear in the result at all, which is why a query cannot report a zero it never saw.",
      "Logical order":
        "The order the clauses are defined to run in: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.",
    },
    body: {
      Beginner: `<p>Aggregation is how you turn many rows into a summary. Instead of a list of every sale, you want one number per shop, or one number per month. SQL does this in two steps: decide the buckets, then decide what to compute inside each bucket.</p>
<h2>Buckets first</h2>
<p><code>GROUP BY shop_id</code> says: gather all the rows that share a shop, and give me one output row for each distinct shop. Then an aggregate function such as <code>SUM(amount)</code> or <code>COUNT(*)</code> computes a single value inside each bucket.</p>
<pre>SELECT shop_id, COUNT(*), SUM(amount)
FROM   sales
GROUP  BY shop_id;</pre>
<p>The rule that follows from this is strict: anything in your <code>SELECT</code> list must either be one of the grouping columns or wrapped in an aggregate. A shop has one id, so <code>shop_id</code> is fine, but it has many sale dates, so a bare <code>sale_date</code> has no single answer and the database will refuse the query.</p>
<h2>Two ways to count</h2>
<p><code>COUNT(*)</code> counts rows. <code>COUNT(amount)</code> counts only the rows where <code>amount</code> has a value, skipping the empty ones. If those two numbers differ, you have just discovered missing data, which is often more interesting than the total itself.</p>
<aside class="tip">Averages hide the same thing. AVG(amount) is the average of the sales that have an amount, not the average across every row.</aside>
<h2>Filtering before and after</h2>
<p>There are two moments where you can throw things away, and picking the wrong one gives the wrong answer.</p>
<p><code>WHERE</code> runs first, on individual rows, before the buckets are formed. Use it for "ignore refunded sales entirely". <code>HAVING</code> runs afterwards, on whole buckets, once the aggregate has been computed. Use it for "only show shops that sold more than a thousand". A condition that mentions <code>SUM</code> or <code>COUNT</code> can only go in <code>HAVING</code>, because before grouping those numbers do not exist yet.</p>
<h2>Groups you will never see</h2>
<p>One last thing to expect. If a shop made no sales at all this month, it has no rows, so it forms no bucket, so it is simply absent from your report. It does not appear with a zero. Getting the zero back requires starting from the list of shops and joining the sales onto it.</p>`,
      Intermediate: `<p>Aggregation is the clearest place to see that SQL clauses run in a defined logical order rather than the order you typed them. Nearly every aggregation bug is a clause placed at the wrong point in that sequence.</p>
<pre>FROM  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT  ->  ORDER BY  ->  LIMIT</pre>
<p>Two consequences fall straight out. A <code>SELECT</code> alias cannot be referenced in <code>WHERE</code>, because the select list has not run yet. And a condition mentioning an aggregate cannot go in <code>WHERE</code>, because grouping has not happened yet.</p>
<h2>What the grouping key really does</h2>
<p><code>GROUP BY</code> partitions the input into one bucket per distinct combination of key values, using not-distinct comparison rather than equality. That word matters: two NULL keys land in the same group, even though <code>NULL = NULL</code> is unknown. So a report grouped by <code>region</code> gets one row covering every record with no region, which is usually what you want provided you label it.</p>
<p>The functional dependency rule follows: every select-list expression must be determined by the grouping key. PostgreSQL relaxes this when you group by a table's primary key, since every other column of that table is then functionally dependent on it, so <code>GROUP BY c.id</code> lets you select <code>c.name</code> without repeating it in the key list.</p>
<h2>Aggregates and missing values</h2>
<p>Every aggregate except <code>COUNT(*)</code> ignores NULL inputs. That produces a set of behaviours worth stating explicitly:</p>
<ul>
<li><code>SUM</code> over a group whose values are all NULL returns NULL, not zero. Wrap it in <code>COALESCE(SUM(x), 0)</code> when a report needs a number.</li>
<li><code>AVG(x)</code> divides by the count of non-NULL values, so it is not <code>SUM(x) / COUNT(*)</code> unless the column has no gaps.</li>
<li><code>COUNT(x)</code> counts non-NULL values, and the difference from <code>COUNT(*)</code> is a completeness metric you get for free.</li>
</ul>
<h2>Placing the condition correctly</h2>
<p>Compare the two, which differ only in placement and answer entirely different questions:</p>
<pre>SELECT customer_id, SUM(amount)
FROM   orders
WHERE  status = 'paid'
GROUP  BY customer_id
HAVING SUM(amount) &gt; 1000;</pre>
<p>The <code>WHERE</code> discards unpaid orders before any total is computed, so they contribute nothing. The <code>HAVING</code> then discards customers whose paid total is too small. Move <code>status = 'paid'</code> into <code>HAVING</code> and it becomes invalid or, worse, silently changes meaning in engines that permit it. Move the total condition into <code>WHERE</code> and the database rejects it outright.</p>
<p>Prefer <code>WHERE</code> whenever the condition is expressible on a single row. It reduces the input before grouping and can use an index, whereas <code>HAVING</code> filters output that has already been computed in full.</p>
<h2>Conditional aggregation</h2>
<p>When you need several differently filtered measures side by side, do not run several queries. Aggregate a <code>CASE</code> and get them in one pass:</p>
<pre>SELECT customer_id,
       COUNT(*) AS orders,
       COUNT(*) FILTER (WHERE status = 'paid') AS paid_orders,
       SUM(amount) FILTER (WHERE status = 'paid') AS paid_total
FROM   orders
GROUP  BY customer_id;</pre>
<aside class="tip">If a group is missing from your output, no row belonged to it. Aggregation cannot invent a zero for a bucket that was never formed, so start from the dimension table and outer join the facts on.</aside>`,
      Advanced: `<p>The correctness rules for aggregation are short. The interesting territory is what the engine does physically, and the handful of constructs that change both the plan and the answer.</p>
<h2>Two ways to group</h2>
<p>An aggregate is executed either as a hash aggregate, which builds one entry per group key in memory and needs no ordered input, or as a group aggregate, which requires input sorted by the key and accumulates one group at a time in constant memory. The planner picks hashing when the estimated number of distinct groups fits the memory budget, and sorting otherwise. This is why an under-estimated distinct count is such a reliable source of trouble: the hash table exceeds its budget and spills, and the recovery is much more expensive than having sorted in the first place. It is also why an index that already supplies the grouping order can make a large aggregation dramatically cheaper, since the sort disappears.</p>
<h2>DISTINCT inside an aggregate</h2>
<p><code>COUNT(DISTINCT x)</code> is a different animal from <code>COUNT(x)</code>. It must deduplicate, which means sorting or hashing the values inside each group, and it usually blocks parallel aggregation. Several distinct counts in one query multiply that cost. When approximation is acceptable, a sketch such as HyperLogLog gives an answer within a couple of per cent for a fraction of the memory, and when it is not, pre-aggregating to one row per entity per day and then counting the pre-aggregated rows is the standard escape.</p>
<h2>Grouping sets, rollup and cube</h2>
<p>Reports that need subtotals typically get written as several queries stitched with <code>UNION ALL</code>, which reads the base data once per level:</p>
<pre>SELECT region, product, SUM(amount)
FROM   sales
GROUP  BY GROUPING SETS ((region, product), (region), ());</pre>
<p>One scan produces the detail rows, the per-region subtotals and the grand total together. The rows at different levels are distinguished by the <code>GROUPING()</code> function rather than by a NULL test, which matters because a genuine NULL in the data is otherwise indistinguishable from the NULL that marks an aggregated-away column.</p>
<h2>Filtering that cannot be pushed down</h2>
<p><code>HAVING</code> cannot be pushed below the aggregate, by definition, so it never reduces the work of computing the groups. But a <code>HAVING</code> clause that mentions no aggregate is legal and behaves as a post-grouping row filter, and most planners will demote it into <code>WHERE</code> themselves. Do not rely on that: writing it in <code>WHERE</code> states the intent, keeps the predicate available for index selection, and avoids the engines where the rewrite does not happen.</p>
<h2>Aggregates that are not fold-friendly</h2>
<p><code>AVG</code> over a partitioned or incremental pipeline cannot be combined by averaging the parts. Materialised views and rollup tables should therefore store <code>SUM</code> and <code>COUNT</code> and derive the mean at read time, otherwise the rollup of rollups is quietly wrong. The same reasoning applies to any non-associative measure: store the components, compute the ratio last.</p>
<aside class="tip">Before optimising an aggregation, get the number of groups. Ten groups over a hundred million rows and a hundred million groups over the same rows are entirely different problems with entirely different fixes.</aside>`,
      Expert: `<p>Aggregation sits at the boundary between the declarative model and the execution engine, and the practical decisions come from understanding what an aggregate is required to be.</p>
<h2>The contract an aggregate signs</h2>
<p>An aggregate is defined by a state type, a transition function, an optional combine function and a final function. That decomposition is what makes parallel and partial aggregation possible: workers each build partial states, the combine function merges them, and the final function runs once. Any aggregate lacking a combine function cannot be parallelised, which explains without hand-waving why <code>COUNT</code> and <code>SUM</code> parallelise trivially while ordered-set aggregates such as a true median do not. It also gives you the criterion for a rollup table: store the state, not the result. Storing sums and counts lets you recombine; storing averages does not.</p>
<h2>What the documentation understates</h2>
<p>First, memory accounting for hash aggregation is per node and per worker, not per query. A parallel plan with several aggregate nodes can multiply the configured working memory by the number of workers, and the machine, not the planner, discovers the total.</p>
<p>Second, the NULL semantics of grouping and of joining are deliberately different. <code>GROUP BY</code>, <code>DISTINCT</code>, <code>UNION</code> and window <code>PARTITION BY</code> use not-distinct comparison, where two NULLs are the same; joins and <code>WHERE</code> use equality, where they are not. The same pair of values is one group and zero matches. This is consistent once stated and a reliable source of confusion until it is.</p>
<p>Third, <code>FILTER</code> is not sugar for <code>CASE</code>. <code>COUNT(*) FILTER (WHERE p)</code> skips the transition function for non-qualifying rows, while <code>SUM(CASE WHEN p THEN 1 ELSE 0 END)</code> calls it for every row. On a wide fact table with a dozen conditional measures the difference is measurable, and the <code>FILTER</code> form is also the only one that reads correctly for <code>COUNT(DISTINCT ...)</code>.</p>
<h2>Estimation and the group count</h2>
<p>Group count estimates come from per-column distinct statistics multiplied together under an independence assumption, which is exactly wrong for correlated keys. Grouping by <code>(country, city)</code> is estimated as the product of both distinct counts, a number that can exceed the table's row count and routinely does. Extended statistics with an ndistinct declaration fix it, and until they are declared, a hash aggregate on correlated keys is one of the more predictable ways to exhaust memory in production.</p>
<h2>Incremental aggregation as a design choice</h2>
<p>When an aggregate is read far more often than its inputs change, computing it on every read is a choice, not a requirement. The options in ascending order of complexity are a materialised view refreshed on a schedule, a summary table maintained by triggers inside the writing transaction, and an append-only event log folded periodically. Each trades freshness against write cost, and each one needs an answer to the question that is usually skipped: how the summary is repaired when it drifts. A recompute path that can be run at any time, and is run regularly enough to be trusted, is the difference between a rollup table and a slow-motion data quality incident.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "GROUP BY with honest counts",
        difficulty: "Medium",
        statement: `<p>Implement <code>GROUP BY</code> with the aggregates that most reveal SQL's NULL handling.</p>
<p><code>groupSummary(rows, groupColumn, valueColumn)</code> returns one object per group, shaped <code>{ key, countStar, countValue, sum, avg }</code>, where:</p>
<ul>
<li><code>key</code> is the value of <code>groupColumn</code>. Rows whose key is <code>null</code> all form a single group with key <code>null</code>, matching SQL's not-distinct grouping.</li>
<li><code>countStar</code> counts every row in the group, as <code>COUNT(*)</code> does.</li>
<li><code>countValue</code> counts only rows whose value is not <code>null</code>, as <code>COUNT(column)</code> does.</li>
<li><code>sum</code> ignores nulls, and is <code>null</code> when the group has no non-null value at all.</li>
<li><code>avg</code> is <code>sum / countValue</code>, or <code>null</code> when <code>countValue</code> is zero.</li>
</ul>
<p>Sort the output by key ascending, with the <code>null</code> key group last.</p>`,
        fn: "groupSummary",
        params: "rows, groupColumn, valueColumn",
        tests: [
          {
            args: [
              [
                { shop: "east", amount: 10 },
                { shop: "west", amount: 40 },
                { shop: "east", amount: 20 },
              ],
              "shop",
              "amount",
            ],
            expected: [
              { key: "east", countStar: 2, countValue: 2, sum: 30, avg: 15 },
              { key: "west", countStar: 1, countValue: 1, sum: 40, avg: 40 },
            ],
            label: "basic two groups",
          },
          {
            args: [
              [
                { shop: "east", amount: 10 },
                { shop: "east", amount: null },
                { shop: "east", amount: null },
              ],
              "shop",
              "amount",
            ],
            expected: [{ key: "east", countStar: 3, countValue: 1, sum: 10, avg: 10 }],
            label: "count star and count column diverge",
          },
          {
            args: [
              [
                { shop: "west", amount: null },
                { shop: "west", amount: null },
              ],
              "shop",
              "amount",
            ],
            expected: [{ key: "west", countStar: 2, countValue: 0, sum: null, avg: null }],
            label: "all values null, sum is null not zero",
            hidden: true,
          },
          {
            args: [
              [
                { shop: null, amount: 5 },
                { shop: "east", amount: 5 },
                { shop: null, amount: 7 },
              ],
              "shop",
              "amount",
            ],
            expected: [
              { key: "east", countStar: 1, countValue: 1, sum: 5, avg: 5 },
              { key: null, countStar: 2, countValue: 2, sum: 12, avg: 6 },
            ],
            label: "null keys form one group and sort last",
            hidden: true,
          },
          {
            args: [[], "shop", "amount"],
            expected: [],
            label: "empty input",
          },
        ],
        hints: [
          "A Map keyed on the group value gives you the buckets. Remember that null is a perfectly good Map key, which is precisely the behaviour SQL grouping wants.",
          "Keep sum as null until the first non-null value arrives, then start adding. That is what makes an all-null group return null instead of zero.",
          "Compute avg after every row has been consumed, from the accumulated sum and the non-null count, and sort at the end with a comparator that pushes the null key to the back.",
        ],
        solution: `function groupSummary(rows, groupColumn, valueColumn) {
  const groups = new Map();
  for (const row of rows) {
    const raw = row[groupColumn];
    const key = raw === undefined ? null : raw;
    if (!groups.has(key)) {
      groups.set(key, { key, countStar: 0, countValue: 0, sum: null, avg: null });
    }
    const group = groups.get(key);
    group.countStar += 1;
    const value = row[valueColumn];
    if (value !== null && value !== undefined) {
      group.countValue += 1;
      group.sum = (group.sum === null ? 0 : group.sum) + value;
    }
  }
  const out = Array.from(groups.values());
  for (const group of out) {
    group.avg = group.countValue === 0 ? null : group.sum / group.countValue;
  }
  out.sort((a, b) => {
    if (a.key === null) return b.key === null ? 0 : 1;
    if (b.key === null) return -1;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  return out;
}`,
        skills: ["Grouping keys", "Aggregates and NULL", "COUNT(*) versus COUNT(column)"],
      },
      {
        n: 2,
        title: "WHERE, then GROUP BY, then HAVING",
        difficulty: "Medium",
        statement: `<p>Execute the clauses in the order SQL defines, rather than the order they are written.</p>
<p><code>topCustomers(rows, minTotal)</code> takes rows shaped <code>{ customer, status, amount }</code> and must:</p>
<ol>
<li>Apply the row filter: keep only rows whose <code>status</code> is <code>"paid"</code>. Rows removed here contribute nothing to any total.</li>
<li>Group the survivors by <code>customer</code>.</li>
<li>Sum <code>amount</code> per group, ignoring <code>null</code> amounts. A group whose amounts are all <code>null</code> has a total of <code>null</code>.</li>
<li>Apply the group filter: keep groups whose total is not <code>null</code> and is at least <code>minTotal</code>. A <code>null</code> total fails the comparison, exactly as it would in SQL.</li>
</ol>
<p>Return <code>{ customer, total }</code> objects ordered by total descending, ties broken by customer name ascending.</p>`,
        fn: "topCustomers",
        params: "rows, minTotal",
        tests: [
          {
            args: [
              [
                { customer: "ada", status: "paid", amount: 600 },
                { customer: "ada", status: "paid", amount: 500 },
                { customer: "raj", status: "paid", amount: 200 },
              ],
              1000,
            ],
            expected: [{ customer: "ada", total: 1100 }],
            label: "one group clears the threshold",
          },
          {
            args: [
              [
                { customer: "ada", status: "pending", amount: 5000 },
                { customer: "raj", status: "paid", amount: 300 },
              ],
              100,
            ],
            expected: [{ customer: "raj", total: 300 }],
            label: "unpaid rows never reach the total",
          },
          {
            args: [
              [
                { customer: "zoe", status: "paid", amount: 500 },
                { customer: "ada", status: "paid", amount: 500 },
              ],
              100,
            ],
            expected: [
              { customer: "ada", total: 500 },
              { customer: "zoe", total: 500 },
            ],
            label: "tie broken by customer name",
            hidden: true,
          },
          {
            args: [
              [
                { customer: "ada", status: "paid", amount: null },
                { customer: "raj", status: "paid", amount: 150 },
              ],
              1,
            ],
            expected: [{ customer: "raj", total: 150 }],
            label: "a null total fails HAVING",
            hidden: true,
          },
          {
            args: [[], 10],
            expected: [],
            label: "empty input",
          },
        ],
        hints: [
          "Do the status filter before anything else. If a row is discarded there, it must not create a group either.",
          "A group that exists but has no usable amounts is different from a group that does not exist. Create the entry with a total of null when the first row arrives, and only replace the null once a real amount turns up.",
          "Filter on the total after the totals are complete, and remember that null fails the comparison rather than counting as zero.",
        ],
        solution: `function topCustomers(rows, minTotal) {
  const totals = new Map();
  for (const row of rows) {
    if (row.status !== "paid") continue;
    if (!totals.has(row.customer)) totals.set(row.customer, null);
    const amount = row.amount;
    if (amount === null || amount === undefined) continue;
    const current = totals.get(row.customer);
    totals.set(row.customer, (current === null ? 0 : current) + amount);
  }
  const out = [];
  for (const [customer, total] of totals) {
    if (total === null) continue;
    if (total >= minTotal) out.push({ customer, total });
  }
  out.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (a.customer < b.customer) return -1;
    if (a.customer > b.customer) return 1;
    return 0;
  });
  return out;
}`,
        skills: ["WHERE versus HAVING", "Grouping keys", "Aggregates and NULL"],
      },
    ],
  },

  5065: {
    topicId: 5065,
    title: "Window functions",
    summary:
      "Compute rankings, running totals and row-to-row comparisons without collapsing your rows or joining a table to itself, and control the answer precisely through PARTITION BY, ORDER BY and the frame.",
    concepts: [
      "PARTITION BY",
      "Window frame",
      "ROW_NUMBER, RANK and DENSE_RANK",
      "Running totals",
      "LAG and LEAD",
    ],
    glossary: {
      "Window function":
        "A function computed over a set of rows related to the current row, which returns a value per row rather than collapsing the rows into one.",
      "PARTITION BY":
        "Splits the input into independent windows. Every calculation restarts at each partition boundary.",
      Frame:
        "The slice of the partition the function actually reads for the current row, expressed in ROWS or RANGE with a start and an end bound.",
      ROW_NUMBER:
        "A unique sequential number within the partition. Tied rows still get different numbers, so the order between them is arbitrary unless you break the tie.",
      RANK:
        "Ties share a rank and the following rank skips, giving 1, 1, 3. DENSE_RANK shares ties without skipping, giving 1, 1, 2.",
      LAG:
        "Reads a column from a row a fixed number of positions earlier in the partition, returning a default when there is no such row. LEAD reads forwards.",
      "Running total":
        "A cumulative sum produced by a frame from the start of the partition to the current row.",
      "QUALIFY substitute":
        "Because window functions run after WHERE and HAVING, filtering on one requires wrapping the query in a subquery or CTE and filtering outside it.",
    },
    body: {
      Beginner: `<p>Sometimes you want a summary and you also want to keep the detail. A leaderboard needs each player's row and their position. A statement needs each transaction and the balance after it. Grouping cannot do this, because grouping throws the individual rows away. Window functions can.</p>
<h2>The same rows, plus a calculation</h2>
<p>A window function looks at a group of rows around the current one, computes something, and attaches the answer to that row. The row count of your result does not change.</p>
<pre>SELECT player, score,
       RANK() OVER (ORDER BY score DESC) AS position
FROM   results;</pre>
<p>Every player still comes back, now with a position attached. The <code>OVER (...)</code> part is what makes it a window function: it describes which rows to consider and in what order.</p>
<h2>Restarting per group</h2>
<p>Add <code>PARTITION BY</code> and the calculation starts again for each value. <code>OVER (PARTITION BY team ORDER BY score DESC)</code> ranks players inside their own team, so each team has its own number one. Think of it as sorting the rows into piles, then working through each pile separately from the top.</p>
<h2>Three ways to number rows</h2>
<p>They look interchangeable until two rows tie.</p>
<ul>
<li><code>ROW_NUMBER()</code> always gives 1, 2, 3, even when scores are equal. Which tied row gets 2 is arbitrary.</li>
<li><code>RANK()</code> gives tied rows the same number and then skips: 1, 1, 3.</li>
<li><code>DENSE_RANK()</code> gives tied rows the same number and does not skip: 1, 1, 2.</li>
</ul>
<aside class="tip">Pick by what a human expects. Sports standings usually mean RANK. "Give me one row per customer" means ROW_NUMBER with a tiebreaker so the choice is repeatable.</aside>
<h2>Running totals and neighbours</h2>
<p><code>SUM(amount) OVER (ORDER BY paid_on)</code> gives a running total: each row shows the sum of everything up to and including itself. <code>LAG(amount) OVER (ORDER BY paid_on)</code> hands you the previous row's value on the current row, so a month-on-month change becomes simple arithmetic instead of joining the table to itself.</p>`,
      Intermediate: `<p>A window function computes over a set of rows related to the current row and returns one value per row. Aggregates collapse; windows annotate. That single difference removes a large family of self-joins and correlated subqueries from real code.</p>
<h2>Three parts of an OVER clause</h2>
<pre>function_name(args) OVER (
  PARTITION BY expr      -- independent windows
  ORDER BY     expr      -- ordering within a window
  ROWS BETWEEN ... AND ... -- the frame
)</pre>
<p><code>PARTITION BY</code> divides the rows and every calculation restarts at a boundary. <code>ORDER BY</code> defines the sequence within a partition and is required by any function that depends on position, such as ranking, <code>LAG</code> or a running total. The frame is the part people skip, and it is where the defaults surprise you.</p>
<h2>The default frame</h2>
<p>If you write an <code>ORDER BY</code> inside <code>OVER</code> and no frame, you get <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. Note <code>RANGE</code>, not <code>ROWS</code>. Under <code>RANGE</code>, "current row" means all rows with the same ordering value as the current row, so peers are included together. A running total over a day column that has several rows per day therefore jumps by the whole day at once rather than row by row. If you want a strict row-by-row cumulative sum, ask for it: <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>.</p>
<p>Omit <code>ORDER BY</code> entirely and the frame becomes the whole partition, which is exactly what you want for a share-of-total calculation:</p>
<pre>SELECT region, amount,
       amount / SUM(amount) OVER (PARTITION BY region) AS share_of_region
FROM   sales;</pre>
<h2>Ranking, and the reason ROW_NUMBER needs a tiebreaker</h2>
<p><code>ROW_NUMBER()</code> is total, <code>RANK()</code> leaves gaps after ties, <code>DENSE_RANK()</code> does not. The common deduplication idiom relies on <code>ROW_NUMBER</code>:</p>
<pre>SELECT * FROM (
  SELECT o.*, ROW_NUMBER() OVER (
           PARTITION BY customer_id ORDER BY created_at DESC, id DESC) AS rn
  FROM   orders o
) t
WHERE rn = 1;</pre>
<p>Two things are load-bearing here. The <code>id DESC</code> tiebreaker makes the choice deterministic when two orders share a timestamp; without it the query returns a different row depending on the plan. And the filter sits outside the subquery, because window functions are evaluated after <code>WHERE</code> and <code>HAVING</code>, so <code>WHERE rn = 1</code> in the same query level is a syntax error rather than a filter.</p>
<h2>Row-to-row comparisons</h2>
<p><code>LAG(value, 1, default)</code> and <code>LEAD(value, 1, default)</code> read a row at a fixed offset within the partition, which turns growth calculations into ordinary arithmetic:</p>
<pre>SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM   monthly;</pre>
<p>The first row of each partition has no predecessor, so <code>LAG</code> returns NULL unless you supply a default. Deciding between NULL and zero there is a product decision, not a technical one.</p>
<aside class="tip">Reach for a window function whenever you catch yourself joining a table to itself on "the same customer, an earlier date". That is a frame, and the frame is faster and clearer.</aside>`,
      Advanced: `<p>Window functions are cheap to write and easy to make expensive. The cost model is legible once you see how the executor evaluates them.</p>
<h2>How the executor runs a window</h2>
<p>A WindowAgg node requires its input sorted by the partition key followed by the order key. If an index supplies that order, the sort disappears; otherwise a sort node is inserted below. Several window functions sharing an identical <code>OVER</code> clause are computed by one node in a single pass, but each distinct window specification adds another sort plus another node. Writing five windows with slightly different but semantically equivalent clauses, some naming the partition columns in a different order, is a quiet way to buy four sorts you did not need. Naming the window once with a <code>WINDOW</code> clause makes the reuse explicit and guarantees it.</p>
<h2>ROWS, RANGE and GROUPS</h2>
<p><code>ROWS</code> counts physical rows and is O(1) to advance for an invertible aggregate such as <code>SUM</code>, since the executor adds the entering row and subtracts the leaving one. <code>RANGE</code> is defined on ordering values, so peers enter and leave together and the boundary must be located by comparison, and <code>RANGE</code> with a value offset such as <code>RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW</code> is the correct tool for a time window with irregular gaps, where <code>ROWS 7 PRECEDING</code> would be wrong whenever a day is missing. <code>GROUPS</code> counts distinct peer groups and is the right answer for "the last three distinct days regardless of how many rows each has".</p>
<p>Non-invertible aggregates such as <code>MAX</code> over a moving frame cannot subtract, so a shrinking-from-the-left frame forces a recomputation per row. That is the difference between a linear and a quadratic window on a large partition.</p>
<h2>Filtering on a window result</h2>
<p>Window functions are evaluated after <code>WHERE</code>, <code>GROUP BY</code> and <code>HAVING</code>, and before <code>ORDER BY</code> and <code>LIMIT</code>. There is no standard <code>QUALIFY</code> in PostgreSQL, so filtering on a window value requires a subquery or CTE, and the predicate cannot be pushed below the window. A top-N-per-group over a large table therefore ranks everything and then discards most of it. When the partition count is small and an index exists on <code>(partition_key, order_key)</code>, a lateral join with <code>LIMIT</code> per partition reads only the rows it returns and can be orders of magnitude cheaper.</p>
<h2>Memory and spilling</h2>
<p>A frame that can look forwards, such as <code>UNBOUNDED FOLLOWING</code>, forces the executor to buffer the partition, spilling to a tempfile when it exceeds the working memory budget. A frame ending at the current row streams. If you only need the partition total alongside the detail, that total is a forward-looking frame by definition, and on very large partitions computing it separately and joining can beat buffering.</p>
<aside class="tip">Look for WindowAgg nodes in EXPLAIN and count the Sort nodes beneath them. One sort for several windows means your OVER clauses are genuinely shared; one each means they are not.</aside>`,
      Expert: `<p>Windowing is the part of SQL that turned it from a set language into one that can express ordered analytics, and the design decisions behind it explain the sharp edges.</p>
<h2>Where windows sit in the semantics</h2>
<p>Window functions were added in SQL:2003 at a specific point in the logical evaluation order: after grouping and having, before the final projection is filtered by ordering and limiting. That placement is what makes them compose with aggregation, since a window can be computed over aggregated rows, and it is also what makes them unfilterable in the same query level. Teradata and Snowflake added <code>QUALIFY</code> to close that gap; the standard did not, so the subquery wrapper is not a workaround but the defined way to express the filter.</p>
<h2>What the documentation understates</h2>
<p>First, the default frame is <code>RANGE</code>, and under <code>RANGE</code> peers share a value. A cumulative sum ordered by a timestamp with duplicate values is not row by row, and the difference is invisible in small test data where timestamps happen to be unique. This is one of the most common wrong answers in production analytics, and it fails silently.</p>
<p>Second, <code>ROW_NUMBER</code> without a unique order key is nondeterministic by specification, not by accident. A deduplication query built on it can return a different survivor after a plan change, an index build or a table rewrite, with no error and no diff in the query text.</p>
<p>Third, <code>DISTINCT</code> and window functions interact in a way that reliably surprises: <code>SELECT DISTINCT ... , ROW_NUMBER() OVER (...)</code> applies distinct after the window, so a row number that is unique by construction defeats the deduplication entirely.</p>
<h2>Cost characteristics worth knowing</h2>
<p>The executor implements moving-frame aggregates with an inverse transition function where one exists, which makes <code>SUM</code>, <code>COUNT</code> and <code>AVG</code> over a sliding <code>ROWS</code> frame linear in the partition size. <code>MIN</code> and <code>MAX</code> have no inverse, so a frame whose left edge advances forces recomputation and the cost becomes quadratic in the frame width. When a moving maximum is genuinely needed over a wide frame, the practical answers are a monotonic deque computed in the application, or restructuring the query so the frame is anchored rather than sliding.</p>
<p>Parallelism is another boundary. A WindowAgg cannot itself be parallelised in PostgreSQL, though the scan and sort below it can be, so a plan may gather before windowing. The consequence is that adding workers speeds up the input but never the window, and a query dominated by the window node will not scale with parallel degree.</p>
<h2>A rule for reviews</h2>
<p>Three questions catch most window defects. Is the ordering unique where the function requires determinism? Is the frame stated explicitly rather than inherited? Do the several <code>OVER</code> clauses in this query share one specification, or has an accidental difference bought an extra sort? None of them need a profiler, and together they cover the majority of what goes wrong.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "ROW_NUMBER, RANK and DENSE_RANK in one pass",
        difficulty: "Medium",
        statement: `<p>Compute the three ranking functions over a partitioned, ordered window.</p>
<p><code>rankScores(rows)</code> takes rows shaped <code>{ player, team, score }</code> and behaves as:</p>
<pre>OVER (PARTITION BY team ORDER BY score DESC, player ASC)</pre>
<p>Return one object per input row, shaped <code>{ player, team, score, rowNumber, rank, denseRank }</code>, ordered by team ascending, then score descending, then player ascending.</p>
<ul>
<li><code>rowNumber</code> is the position within the team, always 1, 2, 3 with no repeats.</li>
<li><code>rank</code> gives tied scores the same value and then skips, so scores 10, 10, 7 produce 1, 1, 3.</li>
<li><code>denseRank</code> gives tied scores the same value without skipping, so the same scores produce 1, 1, 2.</li>
</ul>`,
        fn: "rankScores",
        params: "rows",
        tests: [
          {
            args: [
              [
                { player: "ada", team: "red", score: 8 },
                { player: "raj", team: "red", score: 5 },
              ],
            ],
            expected: [
              { player: "ada", team: "red", score: 8, rowNumber: 1, rank: 1, denseRank: 1 },
              { player: "raj", team: "red", score: 5, rowNumber: 2, rank: 2, denseRank: 2 },
            ],
            label: "no ties",
          },
          {
            args: [
              [
                { player: "ada", team: "red", score: 10 },
                { player: "bo", team: "red", score: 10 },
                { player: "cy", team: "red", score: 7 },
              ],
            ],
            expected: [
              { player: "ada", team: "red", score: 10, rowNumber: 1, rank: 1, denseRank: 1 },
              { player: "bo", team: "red", score: 10, rowNumber: 2, rank: 1, denseRank: 1 },
              { player: "cy", team: "red", score: 7, rowNumber: 3, rank: 3, denseRank: 2 },
            ],
            label: "a tie makes the three differ",
          },
          {
            args: [
              [
                { player: "zoe", team: "blue", score: 4 },
                { player: "ada", team: "red", score: 9 },
                { player: "bo", team: "blue", score: 6 },
              ],
            ],
            expected: [
              { player: "bo", team: "blue", score: 6, rowNumber: 1, rank: 1, denseRank: 1 },
              { player: "zoe", team: "blue", score: 4, rowNumber: 2, rank: 2, denseRank: 2 },
              { player: "ada", team: "red", score: 9, rowNumber: 1, rank: 1, denseRank: 1 },
            ],
            label: "numbering restarts per partition",
            hidden: true,
          },
          {
            args: [
              [
                { player: "ada", team: "red", score: 3 },
                { player: "bo", team: "red", score: 3 },
                { player: "cy", team: "red", score: 3 },
              ],
            ],
            expected: [
              { player: "ada", team: "red", score: 3, rowNumber: 1, rank: 1, denseRank: 1 },
              { player: "bo", team: "red", score: 3, rowNumber: 2, rank: 1, denseRank: 1 },
              { player: "cy", team: "red", score: 3, rowNumber: 3, rank: 1, denseRank: 1 },
            ],
            label: "everything tied",
            hidden: true,
          },
          {
            args: [[]],
            expected: [],
            label: "empty input",
          },
        ],
        hints: [
          "Deal with the partition first: bucket the rows by team, then solve one team completely before moving to the next.",
          "Inside a partition, rowNumber is just the loop index plus one. Rank and dense rank only change when the score differs from the previous row's score.",
          "When the score changes, set rank to the current position plus one, which is what produces the gap after a tie, and increment dense rank by exactly one.",
        ],
        solution: `function rankScores(rows) {
  const partitions = new Map();
  for (const row of rows) {
    if (!partitions.has(row.team)) partitions.set(row.team, []);
    partitions.get(row.team).push(row);
  }
  const teams = Array.from(partitions.keys()).sort();
  const out = [];
  for (const team of teams) {
    const part = partitions.get(team).slice().sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.player < b.player) return -1;
      if (a.player > b.player) return 1;
      return 0;
    });
    let rank = 0;
    let denseRank = 0;
    let previous = null;
    part.forEach((row, index) => {
      if (previous === null || row.score !== previous) {
        rank = index + 1;
        denseRank += 1;
        previous = row.score;
      }
      out.push({
        player: row.player,
        team: row.team,
        score: row.score,
        rowNumber: index + 1,
        rank,
        denseRank,
      });
    });
  }
  return out;
}`,
        skills: ["PARTITION BY", "ROW_NUMBER, RANK and DENSE_RANK"],
      },
      {
        n: 2,
        title: "Running total and a sliding frame",
        difficulty: "Medium",
        statement: `<p>Implement two frames over the same ordered window.</p>
<p><code>movingTotals(rows, preceding)</code> takes rows shaped <code>{ day, amount }</code>, orders them by <code>day</code> ascending, and returns <code>{ day, amount, runningTotal, movingSum }</code> per row where:</p>
<ul>
<li><code>runningTotal</code> is the frame <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, so it accumulates from the first row.</li>
<li><code>movingSum</code> is the frame <code>ROWS BETWEEN preceding PRECEDING AND CURRENT ROW</code>, so it covers at most <code>preceding + 1</code> rows and is clipped at the start of the window.</li>
</ul>
<p><code>preceding</code> is zero or more. With <code>preceding</code> of 0 the frame is the current row alone, so <code>movingSum</code> equals <code>amount</code>. Input may arrive unordered.</p>`,
        fn: "movingTotals",
        params: "rows, preceding",
        tests: [
          {
            args: [
              [
                { day: 1, amount: 10 },
                { day: 2, amount: 20 },
                { day: 3, amount: 30 },
              ],
              1,
            ],
            expected: [
              { day: 1, amount: 10, runningTotal: 10, movingSum: 10 },
              { day: 2, amount: 20, runningTotal: 30, movingSum: 30 },
              { day: 3, amount: 30, runningTotal: 60, movingSum: 50 },
            ],
            label: "two row sliding frame",
          },
          {
            args: [
              [
                { day: 1, amount: 5 },
                { day: 2, amount: 7 },
              ],
              0,
            ],
            expected: [
              { day: 1, amount: 5, runningTotal: 5, movingSum: 5 },
              { day: 2, amount: 7, runningTotal: 12, movingSum: 7 },
            ],
            label: "frame of the current row only",
          },
          {
            args: [
              [
                { day: 3, amount: 30 },
                { day: 1, amount: 10 },
                { day: 2, amount: 20 },
              ],
              2,
            ],
            expected: [
              { day: 1, amount: 10, runningTotal: 10, movingSum: 10 },
              { day: 2, amount: 20, runningTotal: 30, movingSum: 30 },
              { day: 3, amount: 30, runningTotal: 60, movingSum: 60 },
            ],
            label: "unordered input is sorted first",
            hidden: true,
          },
          {
            args: [
              [
                { day: 1, amount: 4 },
                { day: 2, amount: 6 },
              ],
              10,
            ],
            expected: [
              { day: 1, amount: 4, runningTotal: 4, movingSum: 4 },
              { day: 2, amount: 6, runningTotal: 10, movingSum: 10 },
            ],
            label: "frame wider than the window is clipped",
            hidden: true,
          },
          {
            args: [[], 3],
            expected: [],
            label: "empty input",
          },
        ],
        hints: [
          "Sort a copy of the input rather than the array you were handed, and do it before any accumulation starts.",
          "The running total needs one accumulator carried across the loop. The moving sum needs a start position, which is the current index minus preceding.",
          "Clamp that start position at zero. That clamping is exactly what SQL means when it says the frame is clipped at the partition boundary.",
        ],
        solution: `function movingTotals(rows, preceding) {
  const sorted = rows.slice().sort((a, b) => a.day - b.day);
  const out = [];
  let running = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    running += sorted[i].amount;
    const start = Math.max(0, i - preceding);
    let windowSum = 0;
    for (let j = start; j <= i; j += 1) windowSum += sorted[j].amount;
    out.push({
      day: sorted[i].day,
      amount: sorted[i].amount,
      runningTotal: running,
      movingSum: windowSum,
    });
  }
  return out;
}`,
        skills: ["Window frame", "Running totals"],
      },
    ],
  },
  5066: {
    topicId: 5066,
    title: "Keys, constraints and referential integrity",
    summary:
      "Choose keys that identify rows honestly, declare the constraints that keep a schema truthful under concurrent writes, and predict exactly what a delete does to the rows that point at it.",
    concepts: [
      "Primary key",
      "Surrogate versus natural key",
      "Foreign key",
      "Unique constraints and NULL",
      "Referential actions",
      "CHECK constraint",
    ],
    glossary: {
      "Candidate key":
        "Any minimal set of columns whose values identify a row uniquely. A table may have several; one of them is chosen as the primary key.",
      "Primary key":
        "The chosen candidate key. It is unique and NOT NULL, and it is the identifier other tables reference.",
      "Surrogate key":
        "A key with no business meaning, typically a generated integer or UUID, used because it never has to change.",
      "Natural key":
        "A key drawn from real attributes, such as an ISBN or an email address. Meaningful, but hostage to the real world changing.",
      "Foreign key":
        "A declaration that a column's values must exist in the referenced table's key, enforced by the database on every write.",
      "Referential action":
        "What happens to referencing rows when the referenced row is deleted or updated: NO ACTION, RESTRICT, CASCADE, SET NULL or SET DEFAULT.",
      "CHECK constraint":
        "A row-level condition that must not evaluate to false. A condition that evaluates to unknown, because of a NULL, is accepted.",
      "Deferrable constraint":
        "A constraint whose check can be postponed to the end of the transaction, which is how genuinely circular references are inserted.",
    },
    body: {
      Beginner: `<p>A key is how a table says "this row is this thing and not another one". Constraints are the rules the database enforces so the data stays believable no matter which part of the application writes to it.</p>
<h2>The primary key</h2>
<p>A primary key is a column, or a small set of columns, whose value is different for every row and never empty. It is how anything else in the database refers to a row. Most tables use a generated number or UUID for this, because a generated value has no meaning and therefore never needs to change. An email address identifies a person too, but people change their email address, and then every row that referred to them is pointing at something that no longer exists.</p>
<h2>Foreign keys</h2>
<p>When an order belongs to a customer, the orders table stores the customer's id. A foreign key tells the database that this value must actually exist in the customers table. Try to insert an order for customer 99 when there is no customer 99, and the insert is refused. Without the declaration, nothing stops you, and later somebody has to explain why the report has orders belonging to nobody.</p>
<aside class="tip">Constraints are not paperwork. They are the only rules that hold when two people write at the same time, or when a script bypasses your application code entirely.</aside>
<h2>What happens when you delete</h2>
<p>If a customer has orders and you delete the customer, something has to give. You tell the database which, when you create the foreign key. <code>ON DELETE RESTRICT</code> refuses the delete while orders exist. <code>ON DELETE CASCADE</code> deletes the orders too. <code>ON DELETE SET NULL</code> keeps the orders but empties their customer column. Each is right in some situation, and the important part is that you pick deliberately rather than discovering the default.</p>
<h2>Two more rules worth knowing</h2>
<p>A <code>UNIQUE</code> constraint says no two rows may share a value, which is how you stop the same email being registered twice. A <code>CHECK</code> constraint states a condition that every row must satisfy, such as a quantity being greater than zero. Both are checked on every insert and update, by the database, for everyone.</p>`,
      Intermediate: `<p>Constraints are the schema's contract. Application code can enforce a rule for the paths that go through it; the database enforces it for every path, including the migration script, the admin console and the colleague with a psql prompt at midnight.</p>
<h2>Candidate keys, and choosing one</h2>
<p>A candidate key is any minimal column set that uniquely identifies a row. Tables often have several: a user may be identified by an id, by an email, and by an external provider id. Declaring one as primary does not stop you enforcing the others with <code>UNIQUE</code>, and you generally should, because those uniqueness rules are real business rules regardless of which key is primary.</p>
<p>The surrogate versus natural argument is narrower than it sounds. Use a surrogate as the primary key because it is stable, opaque and narrow, which makes it a good thing for other tables to store. Keep the natural key as a unique constraint, because it is the rule you actually care about. A schema with a serial id and no unique constraint on the email has not chosen a surrogate key, it has abandoned identity.</p>
<h2>Uniqueness and NULL</h2>
<p>A <code>UNIQUE</code> constraint in PostgreSQL permits any number of NULL rows, because uniqueness is tested with equality and two NULLs are never equal. This routinely surprises people who expected at most one. When the rule is "at most one active subscription per customer", the tool is a partial unique index:</p>
<pre>CREATE UNIQUE INDEX one_active_per_customer
ON subscriptions (customer_id)
WHERE status = 'active';</pre>
<p>That enforces the rule the business stated and leaves cancelled rows free to accumulate.</p>
<h2>Foreign keys and referential actions</h2>
<p>A foreign key must reference a primary key or a unique constraint, because otherwise "the referenced row" is not well defined. The action clause decides what a delete or update does to dependants:</p>
<ul>
<li><code>RESTRICT</code> and <code>NO ACTION</code> both refuse. The difference is timing: <code>NO ACTION</code> is checked at the end of the statement and can be deferred, <code>RESTRICT</code> fires immediately.</li>
<li><code>CASCADE</code> deletes or updates the dependants. Correct for rows that cannot exist alone, such as order lines under an order. Dangerous across an aggregate boundary, where it turns one delete into an unbounded one.</li>
<li><code>SET NULL</code> keeps the dependant and clears the link, which requires the column to be nullable and means "this used to point somewhere".</li>
</ul>
<h2>CHECK constraints and the third truth value</h2>
<p>A <code>CHECK</code> rejects a row when its condition evaluates to false. Unknown is accepted. So <code>CHECK (discount &lt; price)</code> lets a row with a NULL discount straight through, which is usually intended and occasionally a hole. If the rule is meant to apply unconditionally, make the column <code>NOT NULL</code> or write the condition so it cannot be unknown.</p>
<aside class="tip">Every constraint you declare is also information for the planner. Foreign keys enable join elimination, NOT NULL removes null-handling branches, and CHECK constraints let partitions be excluded. Correctness and speed point the same way here.</aside>
<h2>Constraints cannot be added by wishing</h2>
<p>Adding a foreign key or a check to a populated table validates every existing row, which takes a lock and time. The two-step form, adding the constraint <code>NOT VALID</code> and then running <code>VALIDATE CONSTRAINT</code>, enforces the rule for new writes immediately and checks the history afterwards without blocking. It is the difference between a five second migration and a five minute outage.</p>`,
      Advanced: `<p>Constraints look static and are in fact a concurrency mechanism. The interesting failures are the ones that only appear when two transactions run at once.</p>
<h2>What a unique constraint actually locks</h2>
<p>Uniqueness is enforced by an index, and the index is what serialises competing inserts. Two transactions inserting the same key both proceed until one commits; the second then blocks and fails. That is why the check-then-insert pattern in application code is not equivalent: between the <code>SELECT</code> and the <code>INSERT</code> there is a window with no lock in it, and under load the window is found. <code>INSERT ... ON CONFLICT DO NOTHING</code> or <code>DO UPDATE</code> pushes the decision into the same statement, where the index is the arbiter.</p>
<p>Uniqueness that cannot be expressed as an index is a different problem. "No two bookings for the same room may overlap in time" is an exclusion constraint over a range type with a GiST index, not something a unique index can state, and it is worth knowing the mechanism exists before reinventing it with advisory locks.</p>
<h2>Foreign keys and lock behaviour</h2>
<p>A foreign key check takes a share lock on the referenced row so it cannot vanish mid-transaction. Under PostgreSQL these are <code>FOR KEY SHARE</code> locks, which do not conflict with ordinary updates to non-key columns, precisely so that a hot parent row does not serialise every child insert. They do conflict with deletes and key updates. Consequences worth planning for: a foreign key onto a single frequently updated row can become a contention point, and a cascading delete acquires locks on every descendant, so a delete that looks like one row can hold hundreds of locks and block a large part of the system.</p>
<p>Missing indexes on the referencing side are the classic operational bug. Deleting a parent row must find its children; without an index on the child's foreign key column, that search is a sequential scan per deleted row. Nothing warns you, because the constraint works correctly, just slowly enough to notice on a Friday.</p>
<h2>Deferrable constraints</h2>
<p>Circular or order-dependent inserts, for example two rows that reference each other, are impossible under immediate checking. A constraint declared <code>DEFERRABLE INITIALLY IMMEDIATE</code> can be set deferred inside the transaction that needs it, so the check runs at commit. The same technique resolves the swap problem, where two rows must exchange unique values and any single-row order violates the constraint mid-flight.</p>
<h2>Constraints as planner input</h2>
<p>A validated foreign key plus a uniqueness guarantee lets the planner eliminate a join entirely when no column of the referenced table is selected, which matters enormously for wide views over normalised schemas. <code>NOT NULL</code> lets it drop null-handling and use certain index paths. <code>CHECK</code> constraints on partitions drive partition pruning. A <code>NOT VALID</code> constraint gives none of this, since the planner cannot trust a rule the data has not been checked against, so remembering to run the validation step later is not merely tidiness.</p>
<aside class="tip">Enforce in the database what must always be true, and in the application what is merely usually true today. Rules that live only in code are one direct SQL statement away from being untrue.</aside>`,
      Expert: `<p>The design question underneath keys and constraints is which invariants the system is prepared to defend under arbitrary concurrency, and where the defence lives.</p>
<h2>Identity, and why surrogates win in practice</h2>
<p>A primary key is simultaneously an identifier, a physical clustering hint and a value copied into every referencing table. Natural keys fail on the third role: an ISBN is a fine identifier until a publisher reissues one, and then a value that was copied into a dozen tables must be updated in all of them under a cascade. Surrogate keys separate identity from meaning, which is why the durable pattern is a surrogate primary key plus a unique constraint on the natural key, giving stability for references and enforcement for the business rule.</p>
<p>The choice of surrogate type has physical consequences that are usually discovered late. A random UUID as a primary key destroys insert locality in a B-tree, since each insert lands on a random page, which increases write amplification and cache pressure on a large table. Time-ordered identifiers, UUIDv7 or a sequence, restore locality. On the other hand a sequence leaks volume and ordering to anyone who sees an id, and it is awkward for clients that must generate ids offline. Neither is universally right; what is wrong is choosing without knowing the tradeoff exists.</p>
<h2>What the manuals underplay</h2>
<p>First, <code>NULL</code> in a composite foreign key. The standard defines <code>MATCH SIMPLE</code>, the default, as satisfied whenever any referencing column is NULL, so a two-column foreign key with one column filled and one empty passes the check while referring to nothing. <code>MATCH FULL</code> requires all or none. Most schemas want <code>MATCH FULL</code> and get <code>MATCH SIMPLE</code> because nobody stated a preference.</p>
<p>Second, a unique constraint is not merely an index. Dropping and recreating the index concurrently is a documented maintenance path, but the constraint form owns its index, so the operation differs, and a foreign key can only reference a constraint rather than a bare unique index in some engines.</p>
<p>Third, cascading deletes run as separate internal statements with their own triggers and their own row locks, and their cost is invisible in the parent statement's plan. A single delete on a root aggregate can traverse a whole subtree, and the only way to see it coming is to know the schema's cascade graph.</p>
<h2>The constraint budget</h2>
<p>Each constraint is checked on every write, so a table with a dozen checks, several foreign keys and multiple unique indexes pays on the hot path. That is usually worth it, and the argument for removing constraints on write-heavy tables is nearly always weaker than it sounds, because the alternative is not "no check" but "a check in application code with a race in it". Where volume genuinely forces the issue, the honest options are to move the entity to a table with fewer invariants, to batch writes so the checks amortise, or to accept an asynchronous reconciliation with an explicit repair path, not to quietly delete the declaration and hope.</p>
<h2>A review heuristic</h2>
<p>For each table, ask three questions. What makes a row unique, and is that rule declared rather than assumed? Which columns point at other tables, and is each such column indexed and given an explicit referential action? Which invariants are enforced only by the application, and would surviving a direct <code>UPDATE</code> matter? The answers take minutes and tend to predict the next incident better than any amount of code review.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A table is created with PRIMARY KEY (id). Which guarantee does that give you?",
        options: [
          "Every row has a distinct, non-empty id",
          "Rows are physically stored on disk in id order",
          "Queries filtering on id never need to consult an index",
          "Each new row receives an id exactly one greater than the last",
        ],
        answer: 0,
        difficulty: "Easy",
        explanation:
          "A primary key is a uniqueness guarantee plus an implicit NOT NULL, and nothing more. Physical ordering is tempting because some engines cluster the table on the primary key, but that is a storage decision, not part of the declaration, and in PostgreSQL the heap order is unrelated to it. Sequential numbering is a property of the default value, not of the key.",
        skill: "Primary key",
      },
      {
        n: 2,
        question:
          "A PostgreSQL table declares UNIQUE (email). How many rows may have email set to NULL?",
        options: [
          "Exactly one, because NULL counts as a value",
          "None, because a unique column is implicitly NOT NULL",
          "Any number, because two NULLs are never equal",
          "One per transaction, until commit",
        ],
        answer: 2,
        difficulty: "Medium",
        explanation:
          "Uniqueness is tested with equality, and equality against NULL is unknown rather than true, so no duplicate is ever detected among NULLs and the column accepts as many as you like. Answering exactly one is the most common mistake because that is how SQL Server behaves and because it matches most people's intuition. If you need at most one, add NOT NULL or use a partial unique index.",
        skill: "Unique constraints and NULL",
      },
      {
        n: 3,
        question:
          "orders.customer_id is a nullable column with a foreign key to customers.id. Which statement is rejected by the constraint?",
        options: [
          "Inserting an order with customer_id set to NULL",
          "Inserting an order with customer_id 77 when no customer has id 77",
          "Inserting two orders that share the same customer_id",
          "Updating an order's amount without touching customer_id",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "A foreign key requires that a non-NULL value exists in the referenced key, so pointing at a missing customer fails. A NULL is accepted because it asserts no reference at all, which is what makes the option tempting to those who read a foreign key as mandatory. Two orders sharing a customer is normal one to many data and no constraint objects to it.",
        skill: "Foreign key",
      },
      {
        n: 4,
        question:
          "invoices.customer_id references customers.id with ON DELETE SET NULL. A customer with three invoices is deleted. What is the outcome?",
        options: [
          "The delete is refused while any invoice exists",
          "The customer and all three invoices are deleted",
          "The customer is deleted and the three invoices keep a customer_id pointing at the missing row",
          "The customer is deleted and the three invoices survive with customer_id set to NULL",
        ],
        answer: 3,
        difficulty: "Medium",
        explanation:
          "SET NULL preserves the dependent rows and clears the link, which is what you want when the invoice remains a real financial record after the customer record goes. Refusal is the RESTRICT behaviour and is the tempting answer because refusal is the default in some schemas, but the action clause here explicitly overrides it. Leaving a dangling pointer is exactly what a foreign key exists to prevent.",
        skill: "Referential actions",
      },
      {
        n: 5,
        question:
          "order_lines cascades from orders, and orders cascades from customers. Deleting one customer with 4 orders of 10 lines each affects how many rows?",
        options: [
          "1, because a cascade only reaches one level",
          "5, the customer and its orders",
          "45, the customer, its orders and every line beneath them",
          "It fails, because a cascade may not be chained",
        ],
        answer: 2,
        difficulty: "Hard",
        explanation:
          "Cascades chain: deleting the customer deletes 4 orders, and each deleted order deletes its 10 lines, giving 1 plus 4 plus 40. Reading a cascade as single level is the common misconception, and it is why a delete that looks like one row can lock and rewrite a large subtree. That invisible cost, not the syntax, is the reason to think carefully before cascading across an aggregate boundary.",
        skill: "Referential actions",
      },
      {
        n: 6,
        question:
          "Why is a generated id usually preferred over an email address as the primary key of a users table?",
        options: [
          "Because integers can be indexed and text cannot",
          "Because the key value is copied into referencing tables, and a generated id never has to change",
          "Because email addresses are not unique",
          "Because a primary key may not exceed 64 characters",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "Stability is the real argument: the primary key is copied into every referencing table, so a natural key that changes forces an update everywhere it was stored. Uniqueness is the tempting answer, but email addresses genuinely are unique per account, and if that is the business rule it should still be declared as a unique constraint alongside the surrogate. Text indexes perfectly well.",
        skill: "Surrogate versus natural key",
      },
      {
        n: 7,
        question:
          "A products table has CHECK (discount < price). A row is inserted with price 100 and discount NULL. What happens?",
        options: [
          "The row is rejected, because NULL is not less than 100",
          "The row is accepted, because the condition evaluates to unknown rather than false",
          "The row is accepted and discount is silently set to 0",
          "The row is rejected, because a CHECK column may not be NULL",
        ],
        answer: 1,
        difficulty: "Hard",
        explanation:
          "A CHECK rejects only on false. A NULL operand makes the comparison unknown, and unknown is permitted, so the row goes in. Expecting rejection is natural if you carry the WHERE clause rule across, but WHERE keeps only true while CHECK rejects only false, and that asymmetry is deliberate: a constraint should not prohibit on the basis of information it does not have. Add NOT NULL if the rule must always apply.",
        skill: "CHECK constraint",
      },
      {
        n: 8,
        question:
          "A line items table declares PRIMARY KEY (order_id, line_no). Which insert does the key prevent?",
        options: [
          "A second row with order_id 7 and line_no 1 when that pair already exists",
          "A row with order_id 7 and line_no 2 when line 1 exists",
          "A row with order_id 8 and line_no 1 when order 7 line 1 exists",
          "A row whose order_id refers to an order that has been deleted",
        ],
        answer: 0,
        difficulty: "Medium",
        explanation:
          "A composite key constrains the combination, so the same line number may repeat across different orders and only the exact pair must be unique. Believing the key blocks a repeated line_no across orders is the usual misreading and would make the key far more restrictive than intended. Preventing a reference to a deleted order is a foreign key's job, not the primary key's.",
        skill: "Primary key",
      },
      {
        n: 9,
        question:
          "Why does a foreign key have to reference a primary key or a unique constraint, rather than any column?",
        options: [
          "Because only indexed columns can be compared efficiently",
          "Because otherwise the referenced row would not be uniquely determined",
          "Because the standard requires both columns to have the same name",
          "Because non-unique columns cannot be declared NOT NULL",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "The constraint means this value identifies exactly one row over there, and without uniqueness the phrase has no meaning, so cascades and integrity checks would have no defined target. Efficiency is the tempting answer since a unique index does make the check fast, but a non-unique index would also be fast and still would not make the reference well defined. Column names are irrelevant to the constraint.",
        skill: "Foreign key",
      },
      {
        n: 10,
        question:
          "A customer may have many cancelled subscriptions but at most one active. What enforces that in PostgreSQL?",
        options: [
          "UNIQUE (customer_id), since cancelled rows are ignored automatically",
          "UNIQUE (customer_id, status), which allows one row per status value",
          "A partial unique index on (customer_id) WHERE status = 'active'",
          "A CHECK constraint comparing the row against the rest of the table",
        ],
        answer: 2,
        difficulty: "Hard",
        explanation:
          "A partial unique index applies uniqueness only to the rows matching its predicate, so active rows are constrained to one per customer while cancelled rows accumulate freely. UNIQUE on the pair is the tempting near-miss: it permits one active subscription but also caps cancelled ones at one, which contradicts the requirement. A CHECK constraint cannot query other rows at all.",
        skill: "Unique constraints and NULL",
      },
    ],
  },

  5067: {
    topicId: 5067,
    title: "Normalisation, and when to stop",
    summary:
      "Derive a schema from the functional dependencies in the data rather than from the shape of a screen, and decide with evidence which redundancies are worth keeping and what they cost.",
    concepts: [
      "Functional dependency",
      "First normal form",
      "Second normal form",
      "Third normal form",
      "Boyce-Codd normal form",
      "Denormalisation",
    ],
    glossary: {
      "Functional dependency":
        "A rule saying that one set of columns determines another: if two rows agree on X they must agree on Y, written X to Y.",
      Determinant:
        "The left-hand side of a functional dependency. Normalisation is largely the exercise of making every determinant a candidate key.",
      "First normal form":
        "Every column holds a single value from its domain, with no repeating groups and no lists packed into one field.",
      "Second normal form":
        "In 1NF, and no non-key column depends on only part of a composite key. Only relevant when the key has more than one column.",
      "Third normal form":
        "In 2NF, and no non-key column depends on another non-key column. Removes transitive dependencies.",
      "Boyce-Codd normal form":
        "Every determinant is a candidate key. Slightly stricter than 3NF, and the two differ only when candidate keys overlap.",
      "Update anomaly":
        "A fact stored in many rows, so an update that misses one row leaves the database disagreeing with itself.",
      Denormalisation:
        "Deliberately storing a derived or duplicated value to avoid work at read time, accepted together with a plan for keeping it correct.",
    },
    body: {
      Beginner: `<p>Normalisation is a method for deciding which tables you need. It has a reputation for being academic, but the goal is entirely practical: store every fact once, so there is no way for the database to contradict itself.</p>
<h2>The problem it solves</h2>
<p>Imagine one big orders table with a column for the customer's address. A customer with fifty orders has their address stored fifty times. When they move, you must update fifty rows, and if any update misses one, the database now holds two different addresses for the same person and neither is marked as wrong. That is called an update anomaly, and it is the thing normalisation prevents.</p>
<h2>The three steps most people need</h2>
<p><strong>First normal form</strong> asks each column to hold one value. A <code>tags</code> column containing "red,large,sale" fails, because you cannot filter or join on part of a text blob without string surgery. The fix is a separate row per tag.</p>
<p><strong>Second normal form</strong> matters only when the key is made of several columns. If the key is (order_id, product_id) and you store the product's name in that table, the name depends on the product alone, not on the pair. It belongs in the products table.</p>
<p><strong>Third normal form</strong> removes facts that depend on another non-key column. If an orders table stores <code>postcode</code> and <code>city</code>, the city is really a fact about the postcode, not about the order. Move it to where postcodes live.</p>
<aside class="tip">A short version many people find sufficient: every non-key column should be a fact about the key, the whole key, and nothing but the key.</aside>
<h2>When to stop</h2>
<p>Normalisation is not a competition. Sometimes storing a copy is right. A line on an invoice should record the price paid at the time, even though the product table also has a price, because the price today is a different fact from the price charged then. That is not redundancy, it is history.</p>
<p>Deliberate copies for speed, such as keeping a comment count on a post, are also allowed, but each one is a promise to keep the copy correct. Make that promise on purpose and write down how it gets repaired if it drifts.</p>`,
      Intermediate: `<p>Normalisation is often taught as a list of forms to memorise. It is more useful as a procedure: write down the functional dependencies in your data, then arrange tables so that every determinant is a key. The named forms are checkpoints along that path.</p>
<h2>Start from the dependencies</h2>
<p>A functional dependency X to Y says that any two rows agreeing on X must agree on Y. It is a claim about the business, not about the sample data you happen to hold. "A postcode determines a city" is a dependency; "every customer in this dump has one order" is a coincidence. Getting these right is the whole job, and it is a conversation with the domain rather than an exercise in SQL.</p>
<h2>The forms as checkpoints</h2>
<p><strong>1NF</strong>: every column holds one value from its domain. The usual violations are delimited lists and numbered columns such as <code>phone1</code>, <code>phone2</code>, <code>phone3</code>. Both make the obvious query hard: finding everyone with a given phone number should not require a string search or three OR branches.</p>
<p><strong>2NF</strong>: no non-key column depends on a proper subset of a composite key. Given <code>order_lines(order_id, product_id, quantity, product_name)</code>, the key is the pair but <code>product_name</code> depends on <code>product_id</code> alone. Store it once in <code>products</code>. Tables with a single-column key are in 2NF automatically, which is why the form rarely comes up in schemas built on surrogate keys.</p>
<p><strong>3NF</strong>: no non-key column depends on another non-key column. Given <code>employees(id, department_id, department_name)</code>, the department name is a fact about the department, and storing it here means renaming a department requires updating every employee. Move it.</p>
<p><strong>BCNF</strong>: every determinant is a candidate key. This differs from 3NF only when candidate keys overlap, which is uncommon but real. The classic case is a table of (student, subject, tutor) where a tutor teaches exactly one subject: the dependency tutor to subject has a determinant that is not a candidate key, so the table is in 3NF and not in BCNF, and it can still store contradictory statements about which subject a tutor teaches.</p>
<h2>What you buy</h2>
<p>Each step removes a class of anomaly. Update anomalies, where one fact lives in many rows. Insertion anomalies, where you cannot record a product because no order has referenced it yet. Deletion anomalies, where removing the last order for a customer also removes the only record of their address. Narrower rows are a side effect: they fit more per page, so scans read less.</p>
<h2>When to stop, and what a copy costs</h2>
<p>Stop when the next split would separate facts that are always read together and never updated independently. Two legitimate reasons to keep a copy:</p>
<ul>
<li><strong>Point in time facts</strong>. The unit price on an invoice line is not a copy of the product price, it is the price charged on that date. Recomputing it from the product table would be wrong. This is not denormalisation at all.</li>
<li><strong>Measured read cost</strong>. A comment count on a post avoids an aggregate on every page view. Legitimate, once you can say what it saves.</li>
</ul>
<p>The second kind is a promise. Update the copy in the same transaction as the source, usually with a trigger, so it cannot drift on a crash or a code path that forgot. Then write the recompute query that repairs it, and run it often enough to trust it.</p>
<aside class="tip">Denormalise from a measurement, never from a hunch. "The join felt slow" is not evidence, and it is very often an index problem wearing a schema costume.</aside>`,
      Advanced: `<p>The forms are a decision procedure, and the interesting part is what the procedure cannot tell you: which decomposition to choose when several are legal, and which of them the workload will punish.</p>
<h2>Lossless join and dependency preservation</h2>
<p>A decomposition is worth making only if it is lossless, meaning the original relation is recoverable by joining the parts. Formally that holds when the shared columns of the two parts are a key of at least one of them. A decomposition that fails this test silently invents rows on rejoin, which is a far worse defect than the redundancy it replaced.</p>
<p>The second property is dependency preservation: can every original functional dependency still be enforced by a constraint on a single table? 3NF decomposition can always achieve both. BCNF sometimes cannot, and this is the honest reason practitioners stop at 3NF. If reaching BCNF means a dependency can only be enforced by a cross-table check, you have traded a redundancy you could see for an invariant you cannot declare, and a trigger is a poorer guarantee than a key.</p>
<h2>Beyond BCNF</h2>
<p>Fourth normal form addresses multivalued dependencies: a table holding both a person's languages and their certifications, with no relationship between them, forces a cross product of the two lists and every insertion multiplies rows. The fix is obvious once named, which is that two independent lists are two tables. Fifth normal form covers join dependencies that only decompose into three or more parts, and it is genuinely rare. Knowing 4NF exists is worth it because the symptom, a table whose row count is a product rather than a sum, appears in real schemas more often than the name does.</p>
<h2>Denormalisation with a maintenance contract</h2>
<p>Every stored derived value needs three things decided before it is added: where it is updated, what happens on failure, and how it is repaired. The options in ascending order of guarantee:</p>
<ul>
<li>Application code updates it. Fastest to write, weakest guarantee, since any other writer bypasses it.</li>
<li>A trigger updates it in the same transaction. Atomic with the change, at the cost of write throughput and some hidden control flow.</li>
<li>A materialised view refreshed on a schedule. Clean and separable, at the cost of staleness bounded by the refresh interval.</li>
</ul>
<p>Whichever you choose, write the recompute query in the same change and schedule a comparison. Drift is not hypothetical: it arrives with the first bulk import that used <code>COPY</code>, or the first migration that disabled triggers for speed.</p>
<h2>The read model escape</h2>
<p>Often the argument for denormalising is really an argument for a second representation. Keeping the normalised tables as the write model and projecting a wide read model, whether a materialised view, a summary table or a search index, preserves the integrity guarantees where writes happen and gives reads the shape they want. The cost is explicit and bounded, which is staleness, rather than diffuse, which is a schema that can now hold contradictions.</p>
<aside class="tip">Ask what makes a fact true. If the answer is another column in the same row, that fact is in the wrong table. If the answer is what was agreed on a date, it belongs here even though it looks duplicated.</aside>`,
      Expert: `<p>Normalisation is a theory of redundancy, and the reason it survived is that its central claim is falsifiable: given a set of functional dependencies, the anomalies a schema admits are determined, not a matter of taste.</p>
<h2>The theory, compressed</h2>
<p>Codd's forms are consequences of one idea. Redundancy exists exactly when a determinant is not a superkey, because then the same determinant value appears in several rows and each occurrence repeats the determined value. BCNF states that directly, and 2NF and 3NF are the historically staged, weaker versions that remain useful because they are always achievable while preserving dependencies. Armstrong's axioms, reflexivity, augmentation and transitivity, generate the closure of a dependency set, and the closure is what tells you the candidate keys. Everything else is bookkeeping.</p>
<p>The practical translation is that a schema review is a search for determinants that are not keys. Once you can spot those, the forms stop being a list to recite.</p>
<h2>What the standard treatment underplays</h2>
<p>First, temporal facts are not redundancy, and conflating them is the most common misapplication of normalisation in commercial systems. A price on an order line, an address on a shipment, a tax rate on an invoice: each is the value agreed at a point in time, and the dependency is on the transaction rather than on the referenced entity. Normalising them away is not a stricter schema, it is a wrong one, because it makes historical documents mutate when reference data changes.</p>
<p>Second, denormalisation is usually blamed for wins that belong to indexing or caching. A join over an indexed foreign key on a modest table costs far less than the meetings held about it. Before restructuring, look at the plan: an unindexed foreign key, a missing composite index or a bad row estimate accounts for most alleged join costs, and none of those require a schema change.</p>
<p>Third, the read cost of normalisation is not the join, it is the row width and the page count. Splitting a hot table into six narrow ones can be faster when queries touch few columns, because the pages read are fewer, and slower when every query needs all six, because six index lookups replace one. The workload decides, and the theory is silent on it.</p>
<h2>JSON columns, and where they belong</h2>
<p>A JSONB column is a first normal form violation by construction, and it is often the right call for genuinely schemaless attributes, sparse extension fields, or captured third party payloads. It stops being right when the application starts filtering, joining or aggregating on a key inside the document, because you have then recreated a column without the constraints, statistics or planner support a column would have had. The reliable rule is that anything you filter on should be promoted to a real column, generated from the document if necessary, so the planner can see it.</p>
<h2>Evolution as the real constraint</h2>
<p>A schema is judged over years, by how cheaply it absorbs the requirement nobody mentioned. Normalised designs absorb change well because a new fact usually becomes a new table rather than a new column on a wide one, and because integrity rules stay declarable. Denormalised designs absorb reads well and change badly, since every duplicated fact is a migration multiplier. Keep the normalised model as the source of truth, derive the shapes reads want, and be able to rebuild every derived shape from the source at any time. That last property, rebuildability, is what separates a considered denormalisation from an accumulation of copies nobody can verify.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A contacts table stores tags in a single column as the text 'vip,eu,trial'. Which normal form does that break, and why does it matter?",
        options: [
          "1NF, because the column holds several values and cannot be filtered or joined on directly",
          "2NF, because tags depend on part of the key",
          "3NF, because tags depend on another non-key column",
          "None, because the column is still atomic text",
        ],
        answer: 0,
        difficulty: "Easy",
        explanation:
          "First normal form asks each column to hold one value from its domain. A delimited list forces string matching for a question that should be an equality test, and it cannot be constrained or indexed usefully. Calling it atomic text is the tempting defence, since it is one string to the storage engine, but the application clearly treats it as a collection, and that is the level the rule is about.",
        skill: "First normal form",
      },
      {
        n: 2,
        question:
          "In a table of enrolments, every row with the same student_id has the same student_email. What does that support?",
        options: [
          "The functional dependency student_email to student_id",
          "The functional dependency student_id to student_email, if it is a rule and not a coincidence of this data",
          "That student_id is the table's primary key",
          "That the table is already in third normal form",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "A dependency reads left determines right, so the id determining the email is the claim the observation supports, and only if the business rule genuinely holds rather than the sample happening to agree. The reversed direction is the classic error and would mean an email could never be reassigned. Observing a dependency says nothing about which column is the primary key of this particular table.",
        skill: "Functional dependency",
      },
      {
        n: 3,
        question:
          "order_lines(order_id, product_id, quantity, product_name) has the key (order_id, product_id). Which form does it violate?",
        options: [
          "1NF, because the key has two columns",
          "2NF, because product_name depends on product_id alone, which is part of the key",
          "3NF, because product_name depends on quantity",
          "BCNF, because product_id is a determinant and also part of the key",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "Second normal form forbids a non-key column depending on only part of a composite key, which is exactly what product_name does here, so the product name is repeated on every line that sells that product. Reaching for 3NF is tempting because the fix looks the same, moving the column out, but 3NF concerns dependencies between non-key columns, and product_id is part of the key.",
        skill: "Second normal form",
      },
      {
        n: 4,
        question:
          "customers(id, postcode, city) with id as the sole key, where a postcode determines a city. What is wrong and what is the fix?",
        options: [
          "Nothing is wrong, since both columns depend on the key",
          "It breaks 2NF, and the key should be widened to include postcode",
          "It breaks 3NF through a transitive dependency, and city belongs in a postcodes table",
          "It breaks 1NF, and postcode should be split into components",
        ],
        answer: 2,
        difficulty: "Medium",
        explanation:
          "City depends on postcode, which depends on the key, so it reaches the key only transitively, and that is precisely the redundancy 3NF removes. Saying nothing is wrong is tempting because both columns are functionally determined by the id, which is true but insufficient: the same postcode repeated across customers can be stored with two different cities. 2NF cannot apply because the key is a single column.",
        skill: "Third normal form",
      },
      {
        n: 5,
        question:
          "tutorials(student, subject, tutor) where each student takes one tutor per subject, and each tutor teaches exactly one subject. Candidate keys are (student, subject) and (student, tutor). Which is true?",
        options: [
          "It is in 3NF but not BCNF, because tutor determines subject and tutor is not a candidate key",
          "It is in BCNF, because every column belongs to some candidate key",
          "It breaks 2NF, because subject depends on part of the key",
          "It breaks 1NF, because three columns cannot form one relation",
        ],
        answer: 0,
        difficulty: "Hard",
        explanation:
          "The dependency tutor to subject has a determinant that is not a candidate key, which is the BCNF violation, so the table can record the same tutor against two different subjects. It satisfies 3NF because subject is a prime attribute, belonging to a candidate key, and 3NF exempts those. Concluding BCNF from every column being prime is the trap: BCNF is about determinants, not about which columns happen to sit in some key.",
        skill: "Boyce-Codd normal form",
      },
      {
        n: 6,
        question:
          "A posts table gains a comment_count column so the feed avoids aggregating comments on every page view. What is the necessary accompanying decision?",
        options: [
          "Adding an index on comment_count",
          "Deciding where the count is updated, and writing the query that recomputes it when it drifts",
          "Removing the comments table, which is now redundant",
          "Nothing further, since the count is derived from data already stored",
        ],
        answer: 1,
        difficulty: "Medium",
        explanation:
          "A stored derived value is a promise to keep two representations in agreement, so it needs an owner for the update path and a repair path for when it fails, because bulk imports and disabled triggers guarantee it will eventually be wrong. Assuming nothing is needed is the tempting answer precisely because the value is derivable, but derivable and actually correct are different claims once the copy exists.",
        skill: "Denormalisation",
      },
      {
        n: 7,
        question:
          "Which of these is NOT a first normal form violation?",
        options: [
          "A comma separated list of tags in one column",
          "Columns named phone1, phone2 and phone3",
          "A JSONB column holding a third party payload nothing ever filters on",
          "A single column recording both an amount and its currency as one string",
        ],
        answer: 2,
        difficulty: "Medium",
        explanation:
          "An opaque captured document that the application never queries into behaves as a single value from the point of view of the schema, so nothing about it is hidden from constraints or the planner. A delimited list, a numbered repeating group and a packed compound value all hide structure the application does use, which is what the rule is protecting. The moment you start filtering on a key inside the JSON, promote it to a column.",
        skill: "First normal form",
      },
      {
        n: 8,
        question:
          "A denormalised orders table stores customer_address on every row. What is the specific defect the third normal form violation causes?",
        options: [
          "The table cannot be indexed on customer_id",
          "Queries must join to the customers table anyway",
          "A customer moving requires updating every one of their order rows, and a partial update leaves two contradictory addresses with no way to say which is right",
          "The table exceeds the maximum row width",
        ],
        answer: 2,
        difficulty: "Hard",
        explanation:
          "The characteristic cost of a transitive dependency is the update anomaly: one fact stored many times can be updated inconsistently, and afterwards the database itself cannot say which copy is correct. Note the honest exception, which is that a shipping address deliberately captured at order time is a different fact, tied to the transaction rather than the customer, and belongs on the order.",
        skill: "Third normal form",
      },
      {
        n: 9,
        question:
          "You are told 'a serial number determines a device model'. What follows about a table containing serial, model and site?",
        options: [
          "Serial is a determinant, so it must be a candidate key or the table stores the model redundantly",
          "Model must be the primary key, since it is determined",
          "The table is automatically in BCNF, because a dependency exists",
          "Site depends on model by transitivity",
        ],
        answer: 0,
        difficulty: "Medium",
        explanation:
          "Redundancy appears exactly when a determinant is not a superkey, because the same determinant value then repeats across rows and carries its determined value each time. Choosing the model as the key inverts the dependency, which would wrongly imply one row per model. Transitivity needs a second dependency to chain through, and none was stated for site.",
        skill: "Functional dependency",
      },
      {
        n: 10,
        question:
          "A team wants to denormalise because a three table join 'feels slow'. What is the first thing to establish?",
        options: [
          "Whether the tables can be merged without losing the primary keys",
          "Whether the plan shows a missing index, a bad row estimate or an unindexed foreign key, since those cost nothing structural to fix",
          "Whether the application can tolerate stale data",
          "Whether the joins can be rewritten as subqueries instead",
        ],
        answer: 1,
        difficulty: "Hard",
        explanation:
          "Most alleged join costs turn out to be an access path problem, and an index or fresh statistics fixes them without changing the schema or adding any new invariant to maintain. Tolerance for staleness matters, but only once denormalisation is actually justified, so asking it first skips the step that usually ends the discussion. Rewriting joins as subqueries changes the text and rarely the plan.",
        skill: "Denormalisation",
      },
    ],
  },
  5068: {
    topicId: 5068,
    title: "Indexes and how the planner chooses",
    summary:
      "Design indexes from the predicates your queries actually run, explain why the planner sometimes ignores one, and recognise the writing style that makes a perfectly good index unusable.",
    concepts: [
      "B-tree structure",
      "Composite index column order",
      "Selectivity and cardinality",
      "Covering index and index-only scan",
      "Sargable predicates",
      "Cost-based plan choice",
    ],
    glossary: {
      "B-tree":
        "The default index structure: a balanced tree sorted on the key, supporting equality, range and ordered retrieval in logarithmic time.",
      Selectivity:
        "The fraction of rows a predicate keeps. A highly selective predicate keeps very few, which is what makes an index worthwhile.",
      Cardinality:
        "The number of distinct values in a column. High cardinality generally means high selectivity for an equality test on it.",
      "Composite index":
        "An index on several columns, sorted by the first, then the second within it, and so on. Column order decides which queries it can serve.",
      "Index-only scan":
        "A plan that answers a query from the index alone because every column it needs is in the index, avoiding the table entirely.",
      Sargable:
        "A predicate the engine can turn into an index search, which requires the indexed column to appear unwrapped on one side of the comparison.",
      "Random versus sequential access":
        "Fetching scattered rows through an index costs far more per row than reading pages in order, which is why a big result set is often cheaper to scan.",
      "Partial index":
        "An index built over only the rows matching a WHERE clause, which is smaller, cheaper to maintain and usable only for queries implying that clause.",
    },
    body: {
      Beginner: `<p>An index is a sorted lookup structure the database keeps alongside a table. Without one, answering "which rows have this email" means reading every row. With one, the database jumps straight to the matching entries, exactly as the index at the back of a book saves you reading every page.</p>
<h2>What it costs</h2>
<p>Indexes are not free. Every insert, update and delete must maintain them, and each one takes disk space. Ten indexes on a busy table means ten small pieces of extra work on every write. So indexes are chosen, not sprinkled.</p>
<h2>Why the database sometimes ignores yours</h2>
<p>This is the surprise. The database does not have to use an index, and often it should not. Reading a page of rows in order is much cheaper per row than jumping to scattered rows one at a time. So if your filter matches a large share of the table, reading the whole table straight through is genuinely faster than following the index thousands of times.</p>
<p>The rule of thumb: an index pays when the filter keeps a small slice. Looking up one customer by id is a slice of one. Filtering <code>WHERE country = 'India'</code> in a table where most rows are Indian is not a slice at all, and the database will sensibly read everything.</p>
<aside class="tip">A column with few distinct values, such as a status with three possible values, is usually a poor index on its own. A column with a distinct value per row, such as an email, is usually an excellent one.</aside>
<h2>Indexes on several columns</h2>
<p>You can index more than one column at once, and then the order matters. An index on <code>(customer_id, created_at)</code> is sorted by customer first, and by date within each customer. It answers "this customer's recent orders" perfectly. It cannot answer "everything created yesterday", because dates from different customers are scattered all over it. That is the same reason a phone book sorted by surname then first name cannot help you find every Priya.</p>
<h2>Writing queries an index can use</h2>
<p>One habit ruins indexes more than any other: doing arithmetic on the column you are filtering. <code>WHERE lower(email) = 'a@b.com'</code> cannot use a plain index on <code>email</code>, because the index stores the original values, not the lowercased ones. Compare the column as it is stored, and the index works.</p>`,
      Intermediate: `<p>Indexing is a design activity driven by the predicates in your workload. The productive order is to collect the queries, group them by their filter and sort columns, and then design the smallest set of indexes that serves them, rather than adding one index per complaint.</p>
<h2>What a B-tree can do</h2>
<p>A B-tree stores keys in sorted order, so it serves equality, ranges, prefix matches on text, <code>IS NULL</code>, and ordered retrieval that lets a query skip its sort entirely. What it cannot do is search on a suffix, or on the result of a function it does not store, which is where most unusable indexes come from.</p>
<h2>Column order in a composite index</h2>
<p>An index on <code>(a, b, c)</code> is sorted by a, then by b within equal a, then by c. Two rules follow, and together they explain most index design:</p>
<ul>
<li>You may use a leading prefix: <code>(a)</code>, <code>(a, b)</code> or <code>(a, b, c)</code>. A query filtering only on <code>b</code> cannot seek, because b values are scattered throughout.</li>
<li>Equality predicates keep the search narrow, a range predicate ends it. On <code>(a, b, c)</code> with <code>a = 1 AND b &gt; 5 AND c = 9</code>, the engine seeks on a and b, then must filter c across everything the range covered, because within the range the c values are no longer ordered.</li>
</ul>
<p>Hence the standard ordering rule: equality columns first, then the range or sort column. Getting this right frequently turns a slow query fast without adding any new index at all.</p>
<h2>Selectivity decides whether it is used</h2>
<p>The planner estimates how many rows a predicate keeps, using per-column statistics gathered by <code>ANALYZE</code>. Then it compares the cost of two shapes: a sequential scan reading every page in order, and an index scan doing a lookup per matching row and then fetching each row from the heap at random. Random access is several times more expensive per row than sequential, so the crossover comes early: once a predicate matches roughly a tenth of a table, a scan usually wins. When a query that "should" use an index does not, the first question is what fraction of the table the predicate really matches, and the second is whether the statistics still reflect reality.</p>
<h2>Covering the query</h2>
<p>An index scan normally pays twice: once to walk the index, once to fetch each row from the table for the columns it did not have. If every column the query needs is in the index, the second visit disappears and you get an index-only scan:</p>
<pre>CREATE INDEX orders_customer_created
ON orders (customer_id, created_at) INCLUDE (status, amount);</pre>
<p>The <code>INCLUDE</code> columns are stored in the leaf pages without becoming part of the search key, so they do not widen the tree that gets searched but they do let the query be answered without touching the heap.</p>
<h2>Sargability</h2>
<p>A predicate is only usable for a search when the indexed expression appears unwrapped:</p>
<pre>WHERE date_trunc('day', created_at) = '2026-03-01'  -- not usable
WHERE created_at &gt;= '2026-03-01'
  AND created_at &lt;  '2026-03-02'                    -- usable</pre>
<p>The rewrite is mechanical and it is worth doing every time. The alternative, when the function is unavoidable, is an expression index built on exactly the expression the query uses.</p>
<aside class="tip">Before adding an index, look for one you already have whose leading columns match. Extending an existing composite index is usually better than creating a near duplicate, which costs write throughput twice for one benefit.</aside>`,
      Advanced: `<p>Index design becomes predictable once you can reconstruct the arithmetic the planner is doing, and once you know which index types answer questions a B-tree cannot.</p>
<h2>The cost arithmetic, roughly</h2>
<p>A sequential scan costs about the number of pages times the sequential page cost, plus the number of rows times a per-tuple cost. An index scan costs a few page reads to descend the tree, plus per matched row a tuple cost, plus a heap fetch that is charged at the random page cost, which defaults to four times the sequential one. That default assumes spinning media; on SSDs a random page cost near 1.1 is far more realistic, and leaving it at 4 is one of the most common reasons a well indexed database still chooses scans. The correlation statistic matters too: when the physical row order closely follows the index order, the heap fetches are nearly sequential and the planner charges accordingly, which is why an index on a monotonically increasing timestamp behaves so much better than one on a random key.</p>
<h2>Bitmap scans, the middle path</h2>
<p>Between a single index seek and a full scan sits the bitmap heap scan: the engine collects matching row locations from one or more indexes, sorts them by physical page, and then reads the heap in page order. It converts thousands of random fetches into something close to a sequential read, and it is what allows several indexes to be combined for one query with a bitmap AND or OR. Seeing a bitmap scan in a plan is not a problem; it usually means the predicate is in the middle of the selectivity range, exactly where that shape is cheapest.</p>
<h2>Beyond the B-tree</h2>
<ul>
<li><strong>GIN</strong> for containment queries: array membership, JSONB key lookups, full text search. It indexes many keys per row, so it is large and slower to update, and the pending list mechanism trades write latency for periodic merge work.</li>
<li><strong>GiST</strong> for geometric and range types, and the mechanism behind exclusion constraints such as no overlapping bookings.</li>
<li><strong>BRIN</strong> for very large, naturally ordered tables. It stores only per-block ranges, so it is thousands of times smaller than a B-tree and only useful when physical order correlates with the column, which append-only time series data usually satisfies.</li>
<li><strong>Hash</strong> for equality only, rarely worth the loss of range and ordering support.</li>
</ul>
<h2>Partial indexes</h2>
<p>When queries always filter on the same narrow condition, index only those rows:</p>
<pre>CREATE INDEX orders_open ON orders (created_at) WHERE status = 'open';</pre>
<p>If open orders are one per cent of the table, the index is one per cent of the size, stays in cache, and costs nothing to maintain for the ninety nine per cent of writes that do not qualify. The planner uses it only when it can prove the query's predicate implies the index predicate, so the query must state <code>status = 'open'</code> literally rather than passing it as a parameter the planner cannot see.</p>
<h2>Maintenance realities</h2>
<p>Every index is written on every qualifying row change. PostgreSQL's heap-only tuple optimisation avoids index writes when an update touches no indexed column and the new tuple fits on the same page, which is a strong argument against indexing a column that changes constantly. Indexes also bloat as rows are deleted, and <code>REINDEX CONCURRENTLY</code> is the online repair. Finally, unused indexes are pure cost: <code>pg_stat_user_indexes</code> tells you which have never been scanned, and dropping those is usually the cheapest performance work available.</p>
<aside class="tip">Add an index against a measured plan and a specific query, and record which query it was for. Indexes with no owner accumulate, and nobody dares remove one whose purpose is unknown.</aside>`,
      Expert: `<p>The planner is a cost minimiser over an enumerated plan space, and every index frustration reduces to one of three things: the cost model's parameters, the cardinality estimate, or the shape of the search space itself.</p>
<h2>Where the estimate comes from</h2>
<p>Row estimates for a scalar predicate are derived from the most common values list, the histogram bounds and the null fraction in the statistics catalogue, all sampled by <code>ANALYZE</code> from a bounded number of pages. Three consequences follow. The sample size, controlled by the statistics target, determines how well a skewed column is described, and raising it for a handful of columns is far cheaper than raising it globally. Multi-column predicates are combined under an independence assumption, so correlated columns such as city and country produce estimates orders of magnitude too low, which extended statistics with a dependencies declaration corrects. And values outside the histogram, which is what a freshly inserted day looks like before the next analyse, are estimated by extrapolation, which is exactly why a query over today's data can pick a wildly different plan from the same query over last week's.</p>
<h2>What the documentation understates</h2>
<p>First, index-only scans depend on the visibility map, not just on column coverage. A page recently written is not marked all-visible, so the scan must check the heap for those rows and the promised saving evaporates. On a heavily updated table an index-only scan can degrade to something close to a normal index scan until autovacuum catches up, and the plan text still says index-only.</p>
<p>Second, <code>random_page_cost</code> is a ratio, not a hardware measurement, and it interacts with <code>effective_cache_size</code>. Leaving both at defaults on a machine whose working set is in RAM systematically overprices index access, and the visible symptom is a database that scans when it should seek, on tables where every index looks correct.</p>
<p>Third, generic plans. A prepared statement may be planned once with placeholder-agnostic estimates after several executions, so a query that is fast for a selective parameter can flip to a plan chosen for the average parameter. Skewed data plus prepared statements is a recurring production surprise, and the plan cache mode setting is the lever.</p>
<h2>The design procedure</h2>
<p>Given a workload, take each frequent query and write down its equality columns, its range or ordering column, and the columns it returns. Sort candidates by equality columns first, then the range or sort column, then consider the returned columns as included payload. Merge candidates whose leading columns coincide, because a prefix of one index serves the shorter query. Then price the result against write volume: on a table taking thousands of inserts per second, the marginal index has a cost you can measure, and it should have to justify itself.</p>
<h2>What to measure</h2>
<p>Two catalogue views answer most questions. <code>pg_stat_user_tables</code> gives the ratio of sequential to index scans per table, which flags tables the planner has decided to read whole. <code>pg_stat_user_indexes</code> gives scan counts per index, which identifies both the unused ones and the ones carrying the load. Combined with the actual versus estimated rows from an analysed plan, they distinguish the three failure modes cleanly: a missing index shows as sequential scans on a large table, a bad estimate shows as a divergence in the plan, and a misconfigured cost model shows as correct estimates with a stubbornly chosen scan.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "How far into a composite index can the engine seek",
        difficulty: "Medium",
        statement: `<p>Given a composite index and a query's predicates, work out how much of the index the engine can actually use to narrow the search.</p>
<p><code>usablePrefix(indexColumns, predicates)</code> takes an ordered array of column names and predicates shaped <code>{ column, type }</code> where <code>type</code> is <code>"eq"</code> or <code>"range"</code>. Walk the index columns in order:</p>
<ul>
<li>A column with an equality predicate is used, and the walk continues.</li>
<li>A column with a range predicate is used, and the walk stops there, because beyond a range the following columns are no longer in sorted order.</li>
<li>A column with no predicate stops the walk immediately and is not used.</li>
<li>If a column has both an equality and a range predicate, the equality wins.</li>
</ul>
<p>Return <code>{ used, stopped }</code> where <code>used</code> is the array of column names, and <code>stopped</code> is <code>"range"</code>, <code>"missing"</code>, or <code>"exhausted"</code> when every index column was consumed.</p>`,
        fn: "usablePrefix",
        params: "indexColumns, predicates",
        tests: [
          {
            args: [
              ["tenant_id", "status", "created_at"],
              [
                { column: "tenant_id", type: "eq" },
                { column: "status", type: "eq" },
                { column: "created_at", type: "eq" },
              ],
            ],
            expected: { used: ["tenant_id", "status", "created_at"], stopped: "exhausted" },
            label: "all equality predicates",
          },
          {
            args: [
              ["tenant_id", "created_at", "status"],
              [
                { column: "tenant_id", type: "eq" },
                { column: "created_at", type: "range" },
                { column: "status", type: "eq" },
              ],
            ],
            expected: { used: ["tenant_id", "created_at"], stopped: "range" },
            label: "a range ends the seek",
          },
          {
            args: [
              ["tenant_id", "status", "created_at"],
              [
                { column: "tenant_id", type: "eq" },
                { column: "created_at", type: "eq" },
              ],
            ],
            expected: { used: ["tenant_id"], stopped: "missing" },
            label: "a gap in the middle",
          },
          {
            args: [
              ["tenant_id", "status"],
              [{ column: "status", type: "eq" }],
            ],
            expected: { used: [], stopped: "missing" },
            label: "leading column not filtered",
            hidden: true,
          },
          {
            args: [
              ["amount", "id"],
              [
                { column: "amount", type: "range" },
                { column: "amount", type: "eq" },
                { column: "id", type: "eq" },
              ],
            ],
            expected: { used: ["amount", "id"], stopped: "exhausted" },
            label: "equality beats a range on the same column",
            hidden: true,
          },
        ],
        hints: [
          "Index the predicates by column name first. Walking the predicate list once per index column works but makes the equality-beats-range rule awkward to express.",
          "When collapsing several predicates on one column, decide the winner as you build the lookup: once a column is marked as equality, nothing should downgrade it.",
          "Then it is a single loop over indexColumns with three exits: no predicate gives missing, a range pushes the column and gives range, and falling out of the loop gives exhausted.",
        ],
        solution: `function usablePrefix(indexColumns, predicates) {
  const kinds = new Map();
  for (const predicate of predicates) {
    if (kinds.get(predicate.column) === "eq") continue;
    kinds.set(predicate.column, predicate.type);
  }
  const used = [];
  for (const column of indexColumns) {
    const kind = kinds.get(column);
    if (!kind) return { used, stopped: "missing" };
    used.push(column);
    if (kind === "range") return { used, stopped: "range" };
  }
  return { used, stopped: "exhausted" };
}`,
        skills: ["Composite index column order", "B-tree structure", "Sargable predicates"],
      },
      {
        n: 2,
        title: "Price the two access paths",
        difficulty: "Medium",
        statement: `<p>Reproduce the comparison a cost-based planner makes between a sequential scan and an index scan.</p>
<p><code>choosePlan(stats, access)</code> receives <code>stats</code> shaped <code>{ rows, pages, distinctValues }</code> and <code>access</code> shaped <code>{ column, covering }</code>, describing an equality lookup on that column. Use this cost model:</p>
<ul>
<li><strong>Estimated rows</strong>: <code>rows / distinctValues[column]</code>, rounded to the nearest whole number and never below 1. If the column has no entry in <code>distinctValues</code>, the planner has no statistics and assumes every row matches.</li>
<li><strong>Sequential scan</strong>: <code>pages + rows * 0.01</code>.</li>
<li><strong>Index scan</strong>: <code>2 + estimatedRows * 0.01</code>, plus <code>estimatedRows * 4</code> for the random heap fetches. When <code>covering</code> is true the query is answered from the index alone, so the heap term is zero.</li>
</ul>
<p>Return <code>{ estimatedRows, seqCost, indexCost, chosen }</code> with both costs rounded to two decimal places, and <code>chosen</code> set to <code>"index"</code> only when the index is strictly cheaper.</p>`,
        fn: "choosePlan",
        params: "stats, access",
        tests: [
          {
            args: [
              { rows: 100000, pages: 2000, distinctValues: { email: 100000 } },
              { column: "email", covering: false },
            ],
            expected: { estimatedRows: 1, seqCost: 3000, indexCost: 6.01, chosen: "index" },
            label: "unique column, index wins easily",
          },
          {
            args: [
              { rows: 100000, pages: 2000, distinctValues: { status: 2 } },
              { column: "status", covering: false },
            ],
            expected: { estimatedRows: 50000, seqCost: 3000, indexCost: 200502, chosen: "seq" },
            label: "low cardinality, the scan wins",
          },
          {
            args: [
              { rows: 100000, pages: 2000, distinctValues: { status: 2 } },
              { column: "status", covering: true },
            ],
            expected: { estimatedRows: 50000, seqCost: 3000, indexCost: 502, chosen: "index" },
            label: "covering removes the heap fetches",
            hidden: true,
          },
          {
            args: [
              { rows: 500, pages: 10, distinctValues: {} },
              { column: "nickname", covering: false },
            ],
            expected: { estimatedRows: 500, seqCost: 15, indexCost: 2007, chosen: "seq" },
            label: "no statistics for the column",
            hidden: true,
          },
          {
            args: [
              { rows: 10000, pages: 200, distinctValues: { city: 400 } },
              { column: "city", covering: false },
            ],
            expected: { estimatedRows: 25, seqCost: 300, indexCost: 102.25, chosen: "index" },
            label: "moderate selectivity",
          },
        ],
        hints: [
          "Work out the estimated row count first. Everything else in the model depends on it, including which plan wins.",
          "A missing entry in distinctValues is not a divide by zero to guard against, it is the planner having no idea, which the specification says means assume every row matches.",
          "Round only at the end, and round both costs the same way, so a comparison never turns on floating point noise. Multiply by 100, round, divide by 100.",
        ],
        solution: `function choosePlan(stats, access) {
  const round2 = (value) => Math.round(value * 100) / 100;
  const distinct = stats.distinctValues ? stats.distinctValues[access.column] : undefined;
  const estimatedRows = distinct
    ? Math.max(1, Math.round(stats.rows / distinct))
    : stats.rows;
  const seqCost = round2(stats.pages + stats.rows * 0.01);
  const heap = access.covering ? 0 : estimatedRows * 4;
  const indexCost = round2(2 + estimatedRows * 0.01 + heap);
  return {
    estimatedRows,
    seqCost,
    indexCost,
    chosen: indexCost < seqCost ? "index" : "seq",
  };
}`,
        skills: ["Selectivity and cardinality", "Cost-based plan choice", "Covering index and index-only scan"],
      },
    ],
  },

  5069: {
    topicId: 5069,
    title: "Reading an EXPLAIN plan",
    summary:
      "Read a query plan as a tree, tell an estimate from a measurement, and identify the one node responsible for the time rather than the node that happens to look alarming.",
    concepts: [
      "Plan tree and node types",
      "Estimated versus actual rows",
      "Loops and per-loop figures",
      "Startup versus total cost",
      "Self time versus inclusive time",
    ],
    glossary: {
      EXPLAIN:
        "Shows the plan the optimiser has chosen, with estimated costs and row counts, without running the query.",
      "EXPLAIN ANALYZE":
        "Runs the query and reports measured time and row counts beside the estimates, which is the only way to see where the model was wrong.",
      "Plan node":
        "One step of execution, such as a scan, a join or a sort. Nodes form a tree and each one consumes the rows its children produce.",
      "Startup cost":
        "The estimated cost before the first row can be emitted. High for blocking nodes such as sorts and hash builds, near zero for streaming scans.",
      "Total cost":
        "The estimated cost of producing the whole result. Under LIMIT the planner compares startup costs, which is why a plan can change when a LIMIT is added.",
      Loops:
        "How many times a node was executed. Its reported time and row count are averages per loop, so the real total is the reported figure multiplied by loops.",
      "Rows removed by filter":
        "How many rows a node read and then discarded, which is the clearest signal that a predicate is being applied too late or without an index.",
      Buffers:
        "The pages a node touched, split into shared hits and reads. Far more stable than timing for comparing two runs of the same query.",
    },
    body: {
      Beginner: `<p>When a query is slow, guessing is expensive. <code>EXPLAIN</code> asks the database to show its plan: the steps it intends to take, in order, before you change anything.</p>
<h2>A plan is a tree</h2>
<p>Plans are printed with indentation, and the indented lines are the inputs to the line above them. So you read from the inside out: the most indented node runs first, hands its rows upwards, and the topmost line is the last thing to happen. Each arrow in the output introduces one node, and each node is one job such as reading a table, joining two inputs, sorting or aggregating.</p>
<pre>Sort
  -&gt; Hash Join
       -&gt; Seq Scan on orders
       -&gt; Hash
            -&gt; Seq Scan on customers</pre>
<p>Read that as: scan customers, build a hash from them, scan orders, join the two, then sort the result.</p>
<h2>Estimates versus reality</h2>
<p>Plain <code>EXPLAIN</code> shows only predictions. Add <code>ANALYZE</code> and the database actually runs the query and reports what happened next to what it expected. That comparison is the useful part, because the plan was chosen from the predictions, and a prediction that is badly wrong usually explains a bad plan.</p>
<pre>EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'open';</pre>
<p>You will see something like <code>rows=12</code> next to <code>actual rows=48000</code>. That gap is the story: the database expected a dozen rows, planned for a dozen rows, and got forty eight thousand.</p>
<aside class="tip">EXPLAIN ANALYZE really executes the query, so be careful with anything that writes. Wrap it in a transaction you roll back.</aside>
<h2>What to look at first</h2>
<p>Two things, in this order. First, the biggest gap between expected and actual rows, because that is where the plan was chosen on bad information. Second, any node reporting a large number of rows removed by filter, which means the database read a lot of rows only to throw them away, and that is usually an index missing.</p>`,
      Intermediate: `<p>A plan is a tree of nodes, each pulling rows from its children. Reading one systematically takes about a minute and replaces an afternoon of guessing.</p>
<h2>The numbers on a node</h2>
<pre>Index Scan using orders_customer_idx on orders
  (cost=0.42..812.55 rows=310 width=48)
  (actual time=0.031..2.874 rows=298 loops=1)</pre>
<p>Left to right: the startup cost, the total cost, the estimated rows and the estimated row width, then the measured startup time, the measured total time, the actual rows and the loop count. Costs are in an arbitrary unit anchored to a sequential page read, so they are only comparable within one plan.</p>
<p>Startup versus total is worth internalising. A sequential scan has a startup cost near zero because it can emit a row immediately. A sort or a hash build cannot emit anything until it has consumed all its input, so its startup cost is high. This is why adding <code>LIMIT 10</code> can change the plan completely: with a limit, the planner optimises for the cheapest first rows rather than the cheapest full result.</p>
<h2>Loops, the most misread number</h2>
<p>On the inner side of a nested loop, the reported time and row count are averages per execution. A node showing <code>actual time=0.014..0.019 rows=1 loops=40000</code> is not fast, it is 40000 executions costing roughly 760 ms in total. Multiply before judging. This one habit explains most cases of a plan where no node looks expensive and the query takes seconds.</p>
<h2>A reading order that works</h2>
<ol>
<li>Find the largest ratio between estimated and actual rows. Plans are chosen from estimates, so the worst estimate is usually the cause rather than a symptom.</li>
<li>Multiply every actual time by its loops, then subtract each node's children from it to get the time that node spent on its own work. The largest remainder is your target.</li>
<li>Look for rows removed by filter. Large numbers mean rows were fetched and discarded, so the predicate is being applied after the read rather than during it.</li>
<li>Check for the words external merge or batches, which mean a sort or hash spilled to disk because the working memory budget was too small.</li>
</ol>
<h2>Common shapes and what they mean</h2>
<ul>
<li><strong>Nested loop with a large outer row count</strong>: fine when the inner side is an indexed lookup and the outer is genuinely small, disastrous when the outer estimate was wrong. Check the outer node's estimate first.</li>
<li><strong>Hash join with batches greater than one</strong>: the build side did not fit in memory. Either the estimate was low or the budget is too small.</li>
<li><strong>Seq Scan with a filter that removes almost everything</strong>: a candidate index, provided the predicate is sargable.</li>
<li><strong>Sort feeding an aggregate</strong>: an index on the grouping columns can remove it entirely.</li>
</ul>
<aside class="tip">Add BUFFERS to every EXPLAIN ANALYZE. Page counts are stable across runs in a way timings are not, so they are the honest way to compare two versions of a query on a machine doing other work.</aside>`,
      Advanced: `<p>Once the mechanics of reading a plan are automatic, the skill becomes distinguishing the three failure modes: a wrong estimate, a wrong cost model and a genuinely expensive operation.</p>
<h2>Diagnosing a wrong estimate</h2>
<p>Estimate errors have identifiable causes and different fixes. A stale sample after a bulk load is fixed by <code>ANALYZE</code>. A skewed column under-described by the default statistics target is fixed by raising that target for the column. Correlated predicates estimated as independent, which is the source of most spectacular underestimates, are fixed by extended statistics declaring the dependency. An estimate on a join key with severe skew cannot be fixed by any of these, because the planner is choosing for the average tenant while your query asks about the largest one; that one is addressed by making the query more specific or by accepting a plan that is robust rather than optimal.</p>
<p>The tell for each is in the plan. If a scan node's estimate is wrong, the problem is that table's statistics. If the scans are accurate and the join above them is wrong, the problem is the join selectivity model.</p>
<h2>Self time and the tree</h2>
<p>Reported times are inclusive of children, so a node's own contribution is its total time times loops, minus the same figure for its children. A hash join reporting 900 ms whose child scan reports 870 ms is not the problem, whatever the top of the plan suggests. Working out self time by hand is mechanical, and it is what visualisation tools do; doing it once manually is what makes their output trustworthy.</p>
<h2>Beyond timings</h2>
<p><code>BUFFERS</code> reports shared hits, reads, dirtied and written pages per node. It answers questions timing cannot: whether a node was slow because it read from disk or because it did work, and whether a repeat run was faster only because the cache was warm. On a busy machine, page counts are the comparable measurement and elapsed time is noise. <code>WAL</code> reports the write-ahead log volume generated by a writing statement, which is how you catch an update that is cheap to plan and expensive to replicate.</p>
<p>Two more options change what you are looking at. <code>VERBOSE</code> shows the output column list per node, which is how you discover that a node is carrying columns nobody needs. <code>SETTINGS</code> reports non-default planner parameters that were in effect, which is how you find out that this session had one of them disabled.</p>
<h2>JIT, parallelism and the noise they add</h2>
<p>Above a cost threshold, PostgreSQL may compile expressions just in time, and on a query that is not actually long-running the compilation shows up as several hundred milliseconds of pure overhead attributed to the query. The plan reports the JIT timings separately, and seeing them dwarf execution is the signal to raise the threshold. Parallel plans report per-worker figures alongside a leader, and rows on a Gather node are totals while rows on the worker nodes below are per-worker averages, which is another place the loops habit prevents a misreading.</p>
<aside class="tip">Capture the plan for the query as it is actually run, with real parameters. A plan produced for a convenient literal or from a prepared statement with generic parameters can be a different plan entirely from the one production is executing.</aside>`,
      Expert: `<p>An <code>EXPLAIN</code> plan is a report from a cost minimiser, and reading it well means knowing which of its numbers are model output, which are measurements, and which are neither.</p>
<h2>What the cost number is</h2>
<p>Cost is a dimensionless quantity anchored to <code>seq_page_cost</code>, which is defined as 1.0. Everything else, random page access, per-tuple processing, per-operator evaluation, is expressed as a multiple of that. It follows that costs are comparable only within one plan on one configuration, that a cost of 40000 says nothing about milliseconds, and that tuning the cost parameters changes which plan wins without changing anything about the machine. The parameters most worth revisiting are the random page cost, which still defaults to a spinning-disk ratio, and the effective cache size, which tells the planner how much of the table it may assume is already in memory and therefore how cheaply repeated index access should be priced.</p>
<h2>What the manuals underplay</h2>
<p>First, instrumentation overhead. <code>EXPLAIN ANALYZE</code> takes two clock readings per node execution, and on a plan with millions of node executions that measurement can dominate the query being measured, exaggerating the cost of the innermost node of a nested loop specifically. <code>TIMING OFF</code> keeps the row counts, which is what you needed for estimate diagnosis anyway, without the distortion.</p>
<p>Second, rows on a Gather node are cumulative across workers while rows on the nodes beneath it are per worker, and loops on the inner side of a nested loop are per outer row. Nothing in the output labels which convention applies. Getting this wrong produces confident conclusions about the wrong node, and it is the single most common error among people who otherwise read plans fluently.</p>
<p>Third, a plan reflects the moment it was produced. Autovacuum, an index build, a settings change or a parameter with different selectivity can all produce a different plan from the same text minutes later. A plan pasted into a ticket without its parameters, its settings and its statistics context is an anecdote rather than evidence.</p>
<h2>From plan to fix</h2>
<p>The productive question is never how to make this node faster, it is why the planner believed this plan was cheapest. If the estimates are accurate and the plan is still poor, the cost model or its parameters are wrong and the fix is configuration. If the estimates are wrong, no amount of hinting addresses the cause, and the fix is statistics, extended statistics or a rewrite that gives the planner a shape it can estimate. If the estimates are right and the plan is the best available, the query is asking for genuinely expensive work and the fix is a different index, a different schema or a different question.</p>
<h2>Making plans an artefact</h2>
<p>Mature teams treat plans as things they keep rather than things they read once. <code>auto_explain</code> logs the plan for any statement exceeding a duration threshold, which captures the slow execution rather than the one you could reproduce. <code>pg_stat_statements</code> ranks statements by total time, which is how you find the query executed ten thousand times a minute at eight milliseconds rather than the one that took four seconds once. The pairing matters: the first tells you what a bad execution looked like, the second tells you which query is actually consuming the database, and those are frequently not the same statement.</p>`,
    },
    problems: [
      {
        n: 1,
        title: "Find the worst row estimate in a plan tree",
        difficulty: "Medium",
        statement: `<p>Walk a plan tree and find the node whose row estimate was furthest from reality, which is usually the node that caused the plan to be chosen badly.</p>
<p><code>worstEstimate(plan)</code> receives a node shaped <code>{ node, planRows, actualRows, loops, plans }</code>, where <code>plans</code> is an optional array of child nodes. Both row figures are per loop, as EXPLAIN reports them, so the totals are the figures multiplied by <code>loops</code>.</p>
<ul>
<li>For each node compute <code>estimated</code> and <code>actual</code> totals, then the error ratio: the larger total divided by the smaller, where the smaller is treated as 1 if it is 0, so a zero never divides.</li>
<li>Round the ratio to two decimal places.</li>
<li>Return <code>{ node, estimated, actual, ratio }</code> for the worst node. If several tie, return the first one reached in pre-order, meaning parents before children and children in array order.</li>
</ul>`,
        fn: "worstEstimate",
        params: "plan",
        tests: [
          {
            args: [
              {
                node: "Hash Join",
                planRows: 100,
                actualRows: 120,
                loops: 1,
                plans: [
                  { node: "Seq Scan on orders", planRows: 10, actualRows: 5000, loops: 1 },
                  { node: "Seq Scan on customers", planRows: 200, actualRows: 200, loops: 1 },
                ],
              },
            ],
            expected: {
              node: "Seq Scan on orders",
              estimated: 10,
              actual: 5000,
              ratio: 500,
            },
            label: "underestimated scan below an accurate join",
          },
          {
            args: [
              {
                node: "Index Scan on payments",
                planRows: 400,
                actualRows: 4,
                loops: 1,
              },
            ],
            expected: {
              node: "Index Scan on payments",
              estimated: 400,
              actual: 4,
              ratio: 100,
            },
            label: "overestimates count too",
          },
          {
            args: [
              {
                node: "Nested Loop",
                planRows: 3,
                actualRows: 3,
                loops: 1,
                plans: [
                  { node: "Seq Scan on tenants", planRows: 3, actualRows: 3, loops: 1 },
                  { node: "Index Scan on events", planRows: 2, actualRows: 900, loops: 3 },
                ],
              },
            ],
            expected: {
              node: "Index Scan on events",
              estimated: 6,
              actual: 2700,
              ratio: 450,
            },
            label: "per loop figures must be multiplied out",
            hidden: true,
          },
          {
            args: [
              {
                node: "Aggregate",
                planRows: 1,
                actualRows: 1,
                loops: 1,
                plans: [{ node: "Seq Scan on logs", planRows: 5, actualRows: 0, loops: 1 }],
              },
            ],
            expected: {
              node: "Seq Scan on logs",
              estimated: 5,
              actual: 0,
              ratio: 5,
            },
            label: "zero actual rows must not divide by zero",
            hidden: true,
          },
          {
            args: [
              {
                node: "Sort",
                planRows: 10,
                actualRows: 10,
                loops: 1,
                plans: [{ node: "Seq Scan on tiny", planRows: 10, actualRows: 10, loops: 1 }],
              },
            ],
            expected: { node: "Sort", estimated: 10, actual: 10, ratio: 1 },
            label: "a perfect plan ties, so the parent wins",
          },
        ],
        hints: [
          "The tree is arbitrarily deep, so write the traversal first and worry about the arithmetic inside it second.",
          "Both row figures are per loop. Multiply each by loops before comparing them, otherwise a node executed thousands of times looks accurate.",
          "Visit the parent before its children and use a strictly greater than comparison when replacing the current worst. That combination is what makes a tie resolve to the earlier node.",
        ],
        solution: `function worstEstimate(plan) {
  let best = null;
  const visit = (node) => {
    const estimated = node.planRows * node.loops;
    const actual = node.actualRows * node.loops;
    const high = Math.max(estimated, actual);
    const low = Math.max(1, Math.min(estimated, actual));
    const ratio = Math.round((high / low) * 100) / 100;
    if (best === null || ratio > best.ratio) {
      best = { node: node.node, estimated, actual, ratio };
    }
    for (const child of node.plans || []) visit(child);
  };
  visit(plan);
  return best;
}`,
        skills: ["Estimated versus actual rows", "Loops and per-loop figures", "Plan tree and node types"],
      },
      {
        n: 2,
        title: "Attribute the time to the node that spent it",
        difficulty: "Hard",
        statement: `<p>Reported times in a plan are inclusive of children, so the node at the top always looks the most expensive. Compute each node's own contribution and find the real hotspot.</p>
<p><code>hottestNode(plan)</code> receives a node shaped <code>{ node, actualTime, loops, plans }</code>, where <code>actualTime</code> is milliseconds per loop and includes everything the node's children did.</p>
<ul>
<li>A node's inclusive time is <code>actualTime * loops</code>.</li>
<li>Its self time is its inclusive time minus the inclusive time of its direct children.</li>
<li>Round self time to two decimal places, and return <code>{ node, selfMs }</code> for the largest. Ties go to the node reached first in pre-order.</li>
</ul>
<pre>hottestNode({ node: "Sort", actualTime: 900, loops: 1,
  plans: [{ node: "Seq Scan on events", actualTime: 870, loops: 1 }] })
// the scan, at 870 ms, not the sort at 30 ms of its own work</pre>`,
        fn: "hottestNode",
        params: "plan",
        tests: [
          {
            args: [
              {
                node: "Sort",
                actualTime: 900,
                loops: 1,
                plans: [{ node: "Seq Scan on events", actualTime: 870, loops: 1 }],
              },
            ],
            expected: { node: "Seq Scan on events", selfMs: 870 },
            label: "the parent only looks expensive",
          },
          {
            args: [
              {
                node: "Nested Loop",
                actualTime: 1200,
                loops: 1,
                plans: [
                  { node: "Seq Scan on tenants", actualTime: 12, loops: 1 },
                  { node: "Index Scan on events", actualTime: 0.5, loops: 2000 },
                ],
              },
            ],
            expected: { node: "Index Scan on events", selfMs: 1000 },
            label: "a cheap looking inner node with many loops",
          },
          {
            args: [{ node: "Seq Scan on tiny", actualTime: 4.5, loops: 1 }],
            expected: { node: "Seq Scan on tiny", selfMs: 4.5 },
            label: "single node plan",
          },
          {
            args: [
              {
                node: "Hash Join",
                actualTime: 260,
                loops: 1,
                plans: [
                  { node: "Seq Scan on a", actualTime: 100, loops: 1 },
                  {
                    node: "Hash",
                    actualTime: 105,
                    loops: 1,
                    plans: [{ node: "Seq Scan on b", actualTime: 100, loops: 1 }],
                  },
                ],
              },
            ],
            expected: { node: "Seq Scan on a", selfMs: 100 },
            label: "tie between siblings resolves to the earlier node",
            hidden: true,
          },
          {
            args: [
              {
                node: "Gather",
                actualTime: 50.125,
                loops: 1,
                plans: [{ node: "Parallel Seq Scan on wide", actualTime: 20.1, loops: 2 }],
              },
            ],
            expected: { node: "Parallel Seq Scan on wide", selfMs: 40.2 },
            label: "fractional milliseconds are rounded, not truncated",
            hidden: true,
          },
        ],
        hints: [
          "Start by computing the inclusive time of any node, which is its reported time multiplied by its loop count. Everything else is built on that one figure.",
          "A node's children each have their own loop counts, so subtract their inclusive times, not their reported times.",
          "Traverse in pre-order and replace the current best only on a strictly greater self time, so the earliest node wins a tie. Round at the point of comparison so the rounded values are what tie.",
        ],
        solution: `function hottestNode(plan) {
  let best = null;
  const visit = (node) => {
    const inclusive = node.actualTime * node.loops;
    let childTotal = 0;
    for (const child of node.plans || []) {
      childTotal += child.actualTime * child.loops;
    }
    const selfMs = Math.round((inclusive - childTotal) * 100) / 100;
    if (best === null || selfMs > best.selfMs) {
      best = { node: node.node, selfMs };
    }
    for (const child of node.plans || []) visit(child);
  };
  visit(plan);
  return best;
}`,
        skills: ["Self time versus inclusive time", "Loops and per-loop figures", "Startup versus total cost"],
      },
    ],
  },
};

export default CURRICULUM;
