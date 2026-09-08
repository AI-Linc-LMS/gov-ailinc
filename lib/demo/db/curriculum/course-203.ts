/**
 * Course 203: Data Structures & Algorithms.
 *
 * The promise on the course card is "pattern-first preparation": a dozen
 * patterns that generate the questions, rather than five hundred unrelated
 * problems. The content has to keep that promise, so every topic here names the
 * pattern, shows the shape of the code that implements it, and states the
 * recognition cue that tells a candidate under time pressure which pattern a new
 * question belongs to.
 *
 * The coding problems are executed in the browser, so every reference solution
 * is a pure JavaScript function of its arguments. Where the subject is a
 * structure rather than a language feature (a tree, a graph, a deque), the
 * structure is passed in as plain data and the solution builds the machinery it
 * needs, because a judge that string-compares pseudocode teaches nothing.
 */

import type { CourseCurriculum } from "./types";

const CURRICULUM: CourseCurriculum = {
  5036: {
    topicId: 5036,
    title: "Big-O, amortised cost and the constants that bite",
    summary:
      "Learn to state the cost of a routine before you write it, to defend an amortised bound out loud, " +
      "and to say honestly when the constant factor matters more than the exponent.",
    concepts: [
      "Asymptotic growth",
      "Amortised analysis",
      "Constant factors",
      "Best, average and worst case",
      "Space complexity",
    ],
    glossary: {
      "Big-O notation":
        "An upper bound on how a cost grows as the input grows, with constant factors and lower order terms deliberately discarded.",
      "Amortised cost":
        "The average cost of one operation across a worst case sequence of operations, used when an occasional expensive step pays for many cheap ones.",
      "Constant factor":
        "The fixed multiplier that Big-O throws away, and the reason two O(n) routines can differ by a factor of twenty on the same machine.",
      "Worst case":
        "The most expensive input of a given size. Unless you say otherwise, this is the bound an interviewer assumes you are quoting.",
      "Auxiliary space":
        "Extra memory an algorithm uses beyond its input and its output, including every live recursion frame.",
      "Cache locality":
        "How close together in memory the bytes an algorithm touches are, which decides how often the processor stalls waiting for RAM.",
      "Crossover point":
        "The input size above which the asymptotically better algorithm actually starts winning in wall clock time.",
    },
    body: {
      Beginner: `
<p>Two programs look for a name in a list. The first reads every entry until it finds a match.
The second keeps the list in alphabetical order and, at each step, throws away half of what is
left. On ten names you would not notice the difference. On ten million, the first program reads
millions of entries and the second reads about twenty four.</p>

<p>That gap is what this lesson measures. We are not timing programs with a stopwatch, because a
stopwatch answer changes with the laptop. We are describing the <em>shape</em> of the cost: what
happens to the work when the input gets bigger.</p>

<h2>Reading the notation</h2>
<p>The usual way to write that shape is Big-O. Read <code>O(n)</code> as "the work grows in step
with the input", and <code>O(n log n)</code> as "a bit worse than in step", and
<code>O(n * n)</code>, usually written <code>O(n^2)</code>, as "doubling the input roughly
quadruples the work".</p>

<ul>
  <li><strong>O(1)</strong>: reading one slot of an array. Same cost for a list of five or five million.</li>
  <li><strong>O(log n)</strong>: halving the search area each step.</li>
  <li><strong>O(n)</strong>: one pass over everything.</li>
  <li><strong>O(n^2)</strong>: for each item, a pass over everything. Nested loops are the usual tell.</li>
</ul>

<h2>The expensive step that is still cheap</h2>
<p>Imagine a box that holds ten books. When it fills, you buy a box twice the size and move every
book across. That single move is expensive. But you only do it after ten cheap additions, then
after twenty more, then forty. Averaged over all the books you ever add, the moving costs a small
fixed amount per book. That average is called the <strong>amortised</strong> cost, and it is why
adding to a growing array counts as cheap even though one add in every batch is slow.</p>

<h2>When the shape is not the answer</h2>
<p>Big-O deliberately ignores fixed multipliers. A method described as O(n) might do twenty
operations per item and another might do two. On small inputs the "worse" shape often wins,
which is why real sorting libraries switch to a simple insertion sort for short runs.</p>

<aside class="tip">Say the shape out loud before you write code. "For each order I look at every
customer" is O(n^2) and you have just found the problem without typing anything.</aside>
`,
      Intermediate: `
<p>Cost analysis is the first thing an interviewer asks for and the last thing most candidates
prepare. The habit worth building is to state a bound before writing the body of the function, and
to state it precisely: which case, in which parameter, and counting what.</p>

<h2>Which parameter</h2>
<p>"O(n)" is meaningless when there are two inputs. A routine that scans a list of orders and, for
each, looks up a customer in a map of size m is O(n) in the orders and independent of m. A routine
that walks a graph is O(V + E), and quoting O(n) hides which n you meant. Name the parameter every
time.</p>

<h2>Amortised bounds, stated properly</h2>
<p>A dynamic array that doubles its capacity when full has an O(n) worst case for a single push and
an O(1) amortised push. Both are true. The amortised claim is an argument about sequences: over m
pushes, the copying done by all the doublings is 1 + 2 + 4 + ... + m, which is under 2m, so the
total for m pushes is under 3m and the average per push is constant.</p>

<pre><code>let data = new Array(1);
let size = 0;

function push(x) {
  if (size === data.length) {
    const bigger = new Array(data.length * 2);   // the rare O(n) step
    for (let i = 0; i &lt; size; i++) bigger[i] = data[i];
    data = bigger;
  }
  data[size++] = x;
}
</code></pre>

<p>Change the growth rule to "add a fixed 1000 slots" and the amortised bound collapses to O(n) per
push, because you now perform n/1000 copies of average length n/2. The doubling is not an
implementation detail, it is the proof.</p>

<h2>Case matters more than shape</h2>
<p>Quicksort is O(n log n) on average and O(n^2) in the worst case. Hash map lookup is O(1)
expected and O(n) worst case when every key collides. Quoting the average without saying so is the
single most common way a strong candidate loses a point, because the follow up question is always
"and what is the worst case?".</p>

<h2>Space is a bound too</h2>
<p>Auxiliary space counts everything you allocate that is not the input or the output, and that
includes the call stack. An in place recursive quicksort allocates no arrays but holds one frame per
level of recursion, so its auxiliary space is O(log n) expected and O(n) if the partitions degrade.
Saying "constant space" about a recursive routine is wrong unless the recursion is a tail call the
engine eliminates, and JavaScript engines in practice do not.</p>

<h2>The constants that bite</h2>
<p>Two routines with the same bound can differ by an order of magnitude:</p>
<ul>
  <li>An array scan reads contiguous memory. A linked list scan chases pointers to scattered addresses and can be several times slower for the same O(n).</li>
  <li><code>Array.prototype.shift</code> is O(n), so a queue built on <code>push</code> and <code>shift</code> is quietly quadratic over a full drain.</li>
  <li>String concatenation in a loop can be quadratic if each concatenation copies, which is why you collect parts and join once.</li>
</ul>

<aside class="tip">The honest sentence in an interview is: "This is O(n log n) worst case, O(n)
auxiliary space, and for inputs under about a hundred the simpler quadratic version will be faster."
That answer is worth more than the bound alone.</aside>
`,
      Advanced: `
<p>Once the bounds are automatic, the interesting work is in the places where the bound is true and
still misleading. Four of them come up repeatedly.</p>

<h2>Amortised is not worst case, and sometimes you need worst case</h2>
<p>An amortised O(1) push is a statement about a sequence. It permits one operation in the sequence
to take milliseconds. Inside a 16ms frame budget, or a control loop with a hard deadline, that
single rebuild is the failure, and the fix is a structure with worst case bounds: incremental
rehashing that moves a fixed number of buckets per operation, or a chunked deque that never copies
the whole backing store.</p>

<h2>Expected bounds assume the adversary is not watching</h2>
<p>Hash map lookup is O(1) under the assumption that keys are spread across buckets. An attacker who
can choose keys and knows the hash function can force every key into one bucket and turn an O(n)
request handler into O(n^2). This is a real denial of service class, and the mitigations are
randomised seeds per process or a tree fallback per bucket once its length passes a threshold.</p>

<h2>Composed bounds hide the comparator</h2>
<p>A sort is O(n log n) <em>comparisons</em>. If each comparison is a locale aware string compare or
a deep object walk, the real cost is O(n log n * c) with a c that dwarfs everything. The standard
fix is a Schwartzian transform: compute the sort key once per element, sort on the cheap key, then
discard it, turning n log n expensive comparisons into n expensive key computations.</p>

<pre><code>// O(n log n) deep comparisons
rows.sort((a, b) =&gt; normalise(a.name).localeCompare(normalise(b.name)));

// n key computations, then n log n cheap ones
const keyed = rows.map((r) =&gt; [normalise(r.name), r]);
keyed.sort((a, b) =&gt; a[0] &lt; b[0] ? -1 : a[0] &gt; b[0] ? 1 : 0);
const sorted = keyed.map((k) =&gt; k[1]);
</code></pre>

<h2>The crossover point is measurable, so measure it</h2>
<p>Every asymptotic improvement has a size below which it loses. Binary search on a sorted array
beats a linear scan somewhere around a few dozen elements for cheap comparisons, and later than most
people guess, because the scan is branch predictable and sequential while the search jumps around
and mispredicts. Timsort and V8's sort both fall back to insertion sort under a threshold for
exactly this reason. If your production inputs sit below the crossover, the better algorithm is a
regression.</p>

<h2>Failure modes worth naming</h2>
<ul>
  <li>Quadratic behaviour hidden inside a library call: <code>splice</code> in a loop, <code>indexOf</code> inside a loop over the same array, repeated <code>Object.keys</code> on a growing object.</li>
  <li>Recursion depth as an unstated space bound: a DFS over a path shaped graph of 200000 nodes overflows the stack long before it runs slowly.</li>
  <li>Memoisation that never evicts, turning an O(n) time win into an unbounded memory leak in a long lived process.</li>
</ul>
`,
      Expert: `
<p>Amortised analysis is usually taught as an averaging trick. It is better understood as a
potential function argument, and the difference matters as soon as a structure becomes persistent or
concurrent.</p>

<h2>The potential method</h2>
<p>Assign to each state of the structure a non negative potential, and define the amortised cost of
an operation as its actual cost plus the change in potential. For the doubling array take the
potential to be 2 * size minus capacity, clamped at zero. A push without a resize costs 1 and raises
the potential by 2, giving amortised 3. A push that triggers a resize costs size + 1 actual, and the
potential falls from roughly size to roughly zero, so the amortised cost is again constant. The
total over any sequence is the sum of amortised costs minus the net potential change, and because
potential never goes negative the amortised sum is a valid upper bound. This form generalises where
the aggregate method does not: it survives interleaving with other operations, and it tells you
exactly which operations are the savers and which the spenders.</p>

<h2>Where amortisation is unsound</h2>
<p>Amortised bounds assume each state is used once. A persistent structure that can be rolled back
to a pre resize state and then pushed again, repeatedly, pays the expensive step every time and
never accumulates the savings. Functional data structures therefore need either lazy evaluation with
memoised suspensions, which is the trick behind Okasaki's banker's queues, or a genuine worst case
design. The same reasoning applies to a structure shared across concurrent readers where one thread
can repeatedly trigger the rebuild path.</p>

<h2>What the complexity tables get wrong</h2>
<ul>
  <li><strong>"Hash lookup is O(1)"</strong> omits hashing the key. For string keys the hash is O(k) in the key length, so a map keyed by long URLs is O(k) per lookup and the tables quietly assume k is a constant.</li>
  <li><strong>"Array access is O(1)"</strong> is a RAM model claim. On real hardware a random access to a working set larger than L3 costs two orders of magnitude more than a sequential one, which is why a cache oblivious layout can beat an asymptotically superior structure across a wide range of realistic sizes.</li>
  <li><strong>"Sorting is O(n log n)"</strong> is a comparison model lower bound. Radix and counting sorts are linear in the number of digits, and for fixed width integer keys they win convincingly.</li>
  <li><strong>V8 specifics</strong>: an array with holes drops out of the packed elements kind into dictionary mode, and every subsequent access goes through a hash lookup rather than an offset. A single <code>delete arr[i]</code> or an out of order write past the end can turn a hot O(n) loop into something much worse with no change to the source level complexity.</li>
</ul>

<h2>Lower bounds are the other half of the skill</h2>
<p>Knowing that comparison sorting cannot beat n log n, that any correct algorithm must at least read
its input, and that element distinctness has an n log n lower bound in the algebraic decision tree
model, tells you when to stop optimising. A candidate who says "we cannot do better than linear here
because every element can change the answer" has demonstrated more than one who quotes a bound.</p>
`,
    },
    questions: [
      {
        n: 1,
        question:
          "Routine A is O(n log n) and routine B is O(n^2). Both are correct. What do those two facts alone let you conclude about their speed on an input of ten thousand elements?",
        options: [
          "A is faster, because n log n grows more slowly than n squared",
          "Nothing reliable, because the notation discards the constant factors on both sides",
          "B is faster, because quadratic routines usually have simpler inner loops",
          "They are equivalent, because both are polynomial in n",
        ],
        answer: 1,
        explanation:
          "Big-O bounds how cost grows, not what it is at a particular size. A wins beyond its crossover point, but nothing in the notation says the crossover is below ten thousand, and a heavily constant-loaded n log n routine can lose there. The tempting answer, that A must be faster, confuses eventual behaviour with behaviour at a fixed n.",
        difficulty: "Easy",
        skill: "Asymptotic growth",
      },
      {
        n: 2,
        question:
          "A dynamic array doubles its capacity when full, copying every element across. What is the amortised cost of one push, and on what argument?",
        options: [
          "O(n), because a single push can copy the whole array",
          "O(log n), because the number of doublings is logarithmic in the final size",
          "O(1), because the copies done by all doublings over m pushes total under 2m, so the average per push is constant",
          "O(1), but only if the final capacity is reserved in advance",
        ],
        answer: 2,
        explanation:
          "The doubling copies form the series 1 + 2 + 4 + ... + m, which sums to under 2m, so m pushes cost under 3m in total and the average is constant. The tempting O(n) answer is the worst case for one operation, which is also true but is a different claim: amortised analysis is about the cost of a sequence, not the cost of the worst member of it.",
        difficulty: "Medium",
        skill: "Amortised analysis",
      },
      {
        n: 3,
        question:
          "The same array is changed to grow by a fixed 1000 slots instead of doubling. What happens to the amortised cost of a push?",
        options: [
          "It is unchanged at O(1), with a slightly larger constant",
          "It becomes O(n), because there are now n/1000 resizes and each copies an average of n/2 elements",
          "It becomes O(log n)",
          "It is unchanged, because 1000 is a constant and constants are discarded",
        ],
        answer: 1,
        explanation:
          "Fixed-size growth makes the total copying quadratic: n/1000 resizes times an average copy length of n/2 is on the order of n squared, so each push costs O(n) amortised. The tempting answer treats 1000 as a constant factor, but it changes the number of resizes from logarithmic to linear, which is an asymptotic change and not a constant one.",
        difficulty: "Hard",
        skill: "Amortised analysis",
      },
      {
        n: 4,
        question:
          "You merge two separate O(n) passes over a ten million element array into one pass that does both jobs. The complexity is unchanged. What is the honest expectation?",
        options: [
          "No measurable change, since the complexity is identical",
          "A real speed-up, because the data is streamed from memory once rather than twice",
          "A slow-down, because the loop body now does more work per iteration",
          "A change visible only when the array is already sorted",
        ],
        answer: 1,
        explanation:
          "Both versions do the same number of arithmetic operations, but the fused version halves the memory traffic, and on an array far larger than cache the runtime is dominated by fetching bytes rather than by the arithmetic. The tempting first option treats Big-O as a prediction of wall clock time, which is exactly what it refuses to be.",
        difficulty: "Medium",
        skill: "Constant factors",
      },
      {
        n: 5,
        question: 'A candidate says "quicksort is O(n log n)". How should that be qualified?',
        options: [
          "It needs no qualification, that is the standard bound",
          "It is the average case; the worst case, reached when the pivot repeatedly splits off one element, is quadratic",
          "It is false, quicksort is quadratic",
          "It holds only when the input is already sorted",
        ],
        answer: 1,
        explanation:
          "Quicksort is O(n log n) expected and O(n^2) in the worst case, which is why real implementations randomise or median-select the pivot. Answering with the bare average is the most common way a good candidate loses a point, because the immediate follow-up is always about the worst case, and already-sorted input is in fact the classic trigger for the bad case with a naive first-element pivot.",
        difficulty: "Easy",
        skill: "Best, average and worst case",
      },
      {
        n: 6,
        question:
          "An in-place recursive quicksort allocates no second array. What is its auxiliary space?",
        options: [
          "O(1), because nothing is allocated on the heap",
          "O(n) in every case, because the array itself is being rewritten",
          "O(log n) expected, because the recursion stack holds one frame per level of the partition tree",
          "O(n log n), matching its time complexity",
        ],
        answer: 2,
        explanation:
          "Live recursion frames are auxiliary space. With balanced partitions the depth is logarithmic, and it degrades to O(n) when partitions are lopsided, which is why implementations recurse into the smaller side and loop on the larger. The tempting O(1) answer counts heap allocations only and forgets the stack, and it is also why deep recursion crashes on large inputs before it gets slow.",
        difficulty: "Medium",
        skill: "Space complexity",
      },
      {
        n: 7,
        question:
          "For a lookup table of about sixteen small integer keys, a linear scan of a plain array routinely beats a hash map. What is the reason?",
        options: [
          "The array scan is O(1) while the hash lookup is O(n)",
          "Hashing, bucket indirection and allocation cost more than sixteen sequential, branch-predictable comparisons that all sit in cache",
          "Hash maps are only efficient for string keys",
          "Sixteen entries is below the load factor at which a hash map starts working",
        ],
        answer: 1,
        explanation:
          "At that size both are effectively constant time and the winner is decided entirely by constant factors: the scan touches one contiguous cache line and predicts perfectly, while the map hashes, indexes, and follows a pointer. The first option inverts the complexities, which is the giveaway that it is reasoning about the wrong thing entirely.",
        difficulty: "Hard",
        skill: "Constant factors",
      },
      {
        n: 8,
        question:
          "An algorithm costs exactly n^2 + 1000n steps, so it is O(n^2). For which input sizes does the discarded 1000n term actually dominate the runtime?",
        options: [
          "Never, a lower order term cannot dominate",
          "For n below 1000, where 1000n is the larger of the two terms",
          "For every n, because the constant is large",
          "Only for n equal to 0 and n equal to 1",
        ],
        answer: 1,
        explanation:
          "n^2 exceeds 1000n exactly when n exceeds 1000, so below that size the term Big-O throws away is the bigger one. This is the practical meaning of asymptotic: the notation describes the tail of the curve, and calling the dropped term irrelevant is only safe once your inputs are past the point where the terms cross.",
        difficulty: "Hard",
        skill: "Asymptotic growth",
      },
      {
        n: 9,
        question:
          "A queue offers O(1) amortised push with an occasional O(n) rebuild. In which setting is that bound unacceptable?",
        options: [
          "Batch processing of a large log file",
          "Any workload where one operation must complete inside a fixed deadline, such as a frame budget or a real-time control loop",
          "Any workload holding more than a million items",
          "Sorting, because sorting needs worst case bounds",
        ],
        answer: 1,
        explanation:
          "Amortisation trades a predictable average for an unpredictable maximum, which is exactly the wrong trade when a single late operation is itself the failure: a dropped frame or a missed control deadline is not repaired by the next thousand fast operations. Batch work is the opposite case, since only total throughput is observable there.",
        difficulty: "Hard",
        skill: "Amortised analysis",
      },
      {
        n: 10,
        question:
          "A routine returns a freshly built array of n results, yet its space complexity is quoted as O(1) auxiliary. Why is that not a contradiction?",
        options: [
          "Because auxiliary space counts only working memory beyond the input and the required output",
          "Because arrays in JavaScript are stored by reference, so they cost nothing",
          "Because O(1) and O(n) are treated as equal when discussing output",
          "Because the caller, not the routine, allocated the array",
        ],
        answer: 0,
        explanation:
          "Auxiliary space measures the extra memory an algorithm needs to do its job; an output the problem statement demands is not extra, so a routine that must return n values can still be constant auxiliary space. The reference-counting answer is simply wrong, since the array's backing store is real memory whoever holds the pointer.",
        difficulty: "Medium",
        skill: "Space complexity",
      },
    ],
  },

  5037: {
    topicId: 5037,
    title: "Proving a loop does what you think",
    summary:
      "Write loops you can defend: state an invariant, show it survives an iteration, prove the loop ends, " +
      "and read off the result from the exit condition instead of guessing at the boundaries.",
    concepts: [
      "Loop invariant",
      "Termination argument",
      "Half-open intervals",
      "Precondition and postcondition",
      "Binary search boundaries",
      "Off-by-one errors",
    ],
    glossary: {
      "Loop invariant":
        "A statement about the program's variables that is true before the loop starts and still true after every iteration.",
      Variant:
        "A non-negative integer measure that strictly decreases on every iteration, which is what proves a loop cannot run forever.",
      "Half-open interval":
        "A range written as lo inclusive to hi exclusive, so its size is hi minus lo and an empty range is lo equal to hi.",
      Precondition:
        "What a routine demands of its caller. Break it and the routine owes you nothing, including a sensible answer.",
      Postcondition:
        "What the routine guarantees when it returns, assuming the precondition held.",
      "Lower bound search":
        "A binary search that returns the first position at which a value could be inserted while keeping the array sorted.",
      Sentinel:
        "An extra element placed at the boundary so the loop body never needs a special case for the ends.",
    },
    body: {
      Beginner: `
<p>Most loop bugs are not typing mistakes. They are places where the author never said, in plain
words, what the loop is supposed to have achieved so far. Once you can say that sentence, the code
almost writes itself and the bug becomes visible.</p>

<h2>The sentence</h2>
<p>Take finding the largest number in a list. The sentence is: <em>after looking at the first k
numbers, best holds the largest of those k</em>. That is all an invariant is, a promise about what is
true so far.</p>

<pre><code>function largest(nums) {
  let best = nums[0];
  for (let i = 1; i &lt; nums.length; i++) {
    // promise: best is the largest of nums[0..i-1]
    if (nums[i] &gt; best) best = nums[i];
  }
  return best;
}
</code></pre>

<p>Check the promise three times. Is it true before the loop starts? Yes: <code>best</code> is the
largest of the first one. Does one turn of the loop keep it true? Yes: we compare against the next
number and keep the bigger. Is it useful when the loop stops? Yes: the loop stops when k is the whole
list, so <code>best</code> is the largest of everything.</p>

<h2>Why loops end</h2>
<p>A loop ends when something is counting down to a floor it cannot pass. Here it is
<code>nums.length - i</code>, which drops by one each turn and cannot go below zero. If you ever
write a loop where you cannot point at that shrinking number, you have written a possible infinite
loop.</p>

<h2>The plus one and minus one problem</h2>
<p>Two habits remove most of these bugs. First, use ranges that include the start and exclude the
end, the way <code>slice</code> does: the count of items is then simply end minus start. Second,
test with the smallest inputs, an empty list and a one item list, because that is where boundaries
break.</p>

<aside class="tip">If you cannot write the promise as one English sentence, you do not yet
understand the loop. Write the sentence first, in a comment, then write the code under it.</aside>
`,
      Intermediate: `
<p>An invariant argument has exactly three obligations, and interviewers who ask you to "walk through
it" are checking for all three: <strong>initialisation</strong> (true before the first iteration),
<strong>maintenance</strong> (one iteration preserves it), and <strong>termination</strong> (the loop
ends, and the invariant plus the exit condition give you the postcondition). Skip any one and the
walkthrough is storytelling.</p>

<h2>Contracts around the loop</h2>
<p>Before the invariant, write down what the routine assumes and what it promises. Binary search
assumes a sorted array; that is a precondition, and calling it on unsorted data produces a wrong
answer that is the caller's bug, not the routine's. The postcondition is what you are allowed to
rely on afterwards, and it should be specific enough to use: "returns the index of the target, or
the length of the array if absent" is usable, "returns the position" is not.</p>

<h2>Half-open intervals earn their keep</h2>
<p>Write your search range as <code>[lo, hi)</code>, lo included and hi excluded. Three things fall
out for free: the number of candidates is <code>hi - lo</code>, an empty range is exactly
<code>lo === hi</code>, and splitting at <code>mid</code> gives you <code>[lo, mid)</code> and
<code>[mid + 1, hi)</code> with no arithmetic to second-guess. Almost every plus one and minus one
that people memorise comes from mixing this convention with an inclusive one.</p>

<h2>Binary search as a worked proof</h2>
<pre><code>// Precondition: nums is sorted ascending.
// Postcondition: returns the first index i with nums[i] &gt;= target,
// or nums.length if there is no such index.
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;               // range is [lo, hi)
  while (lo &lt; hi) {
    // Invariant: every index below lo has a value &lt; target,
    // and every index at or above hi has a value &gt;= target.
    const mid = lo + ((hi - lo) &gt;&gt; 1);
    if (nums[mid] &lt; target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
</code></pre>

<p>Initialisation: both halves of the invariant are vacuously true, since there are no indices below
0 or at or above the length. Maintenance: if the middle value is too small then everything up to and
including mid is too small, so lo may jump past it; otherwise mid itself is a candidate, so hi
becomes mid and not mid minus one. Termination: <code>hi - lo</code> is a non-negative integer that
strictly decreases, because mid is always in <code>[lo, hi)</code>. At exit <code>lo === hi</code>,
and the two halves of the invariant meet at exactly the first index that is not too small.</p>

<h2>The failures this catches</h2>
<ul>
  <li><code>while (lo &lt;= hi)</code> with <code>hi = mid</code> loops forever when lo equals hi, because the measure stops shrinking.</li>
  <li>Writing <code>hi = mid - 1</code> in a lower-bound search discards the answer, because mid was still a candidate.</li>
  <li>Mutating the array inside a loop whose condition reads <code>arr.length</code> destroys the termination argument rather than the invariant.</li>
</ul>

<aside class="tip">In an interview, say the invariant out loud before you fill in the body. It turns
the boundary decisions into consequences instead of guesses, and if you do slip, the interviewer can
see that your reasoning was sound.</aside>
`,
      Advanced: `
<p>Invariants scale to the places where intuition stops being reliable: multi-pointer loops,
in-place partitioning, and any loop whose state is spread over three or more variables.</p>

<h2>Partition, the classic three-region invariant</h2>
<p>Dutch national flag maintains four regions in one array with three cursors, and the invariant is
the whole design:</p>
<pre><code>// Invariant: [0, lo) is &lt; pivot, [lo, i) is equal to pivot,
// [i, hi] is unclassified, (hi, n) is &gt; pivot.
function partition(a, pivot) {
  let lo = 0, i = 0, hi = a.length - 1;
  while (i &lt;= hi) {
    if (a[i] &lt; pivot) { [a[lo], a[i]] = [a[i], a[lo]]; lo++; i++; }
    else if (a[i] &gt; pivot) { [a[i], a[hi]] = [a[hi], a[i]]; hi--; }
    else i++;
  }
  return a;
}
</code></pre>
<p>The asymmetry that trips people up is provable from the invariant: after swapping with
<code>lo</code> you may advance <code>i</code>, because what came from <code>lo</code> is known to be
equal to the pivot, whereas after swapping with <code>hi</code> you may not, because the incoming
element has never been examined. The variant is <code>hi - i</code>, which decreases in every branch.</p>

<h2>Termination when the measure is not obvious</h2>
<p>Some loops have no single shrinking counter. Two pointers moving toward each other decrease
<code>hi - lo</code>. A union-find loop with path compression decreases the sum of node depths.
An algorithm like Gale-Shapley decreases the total number of remaining proposals. If you cannot name
a measure in a bounded well-ordered set, you have not established termination, and "it obviously
finishes" is precisely the reasoning that produces the loop that hangs on one customer's data.</p>

<h2>Overflow and index arithmetic</h2>
<p>In JavaScript, <code>(lo + hi) &gt;&gt; 1</code> is a genuine bug and not a theoretical one:
bitwise operators coerce to 32-bit signed integers, so any sum above 2147483647 wraps negative, and a
typed array or string index can exceed that. <code>lo + ((hi - lo) &gt;&gt; 1)</code> keeps the
intermediate small, and <code>Math.floor((lo + hi) / 2)</code> is safe up to the 53-bit float
integer range.</p>

<h2>Loops whose invariant depends on order</h2>
<p>Removing elements while iterating forwards silently skips: deleting index i shifts the successor
into i, and the loop then increments past it. Iterating backwards, or building a new array, restores
an invariant that the mutation destroyed. The same class of bug appears when a loop caches
<code>arr.length</code> in a variable while the body changes the array, where the cached bound and
the real bound diverge.</p>
`,
      Expert: `
<p>The formal object behind the informal practice is Hoare logic. A triple <code>{P} S {Q}</code>
asserts partial correctness: if P holds and S terminates, Q holds. The while rule is the only rule
you actually need to internalise, and it is where the invariant comes from rather than something you
bolt on afterwards.</p>

<h2>The while rule, and why the exit condition does the work</h2>
<p>If <code>{I and B} S {I}</code>, then <code>{I} while (B) S {I and not B}</code>. Read it
backwards to derive code: choose the postcondition Q you want, then look for an I and a guard B such
that <code>I and not B</code> implies Q. In the lower-bound search, Q is "lo is the first index whose
value is at least the target", the guard is <code>lo &lt; hi</code>, and the invariant is the pair of
one-sided statements about the regions below lo and at or above hi. The negated guard collapses the
two regions onto a single point, which is precisely Q. Weakest precondition calculation, Dijkstra's
wp, mechanises this: it is a function from a postcondition to the weakest predicate that guarantees
it, and it makes the derivation of loop bodies a calculation rather than an inspiration.</p>

<h2>Total correctness needs a well-founded relation, not a counter</h2>
<p>Partial correctness plus termination is total correctness, and termination requires a variant
mapping states into a well-founded set: any set with no infinite strictly decreasing chain. The
natural numbers are the familiar instance, but the useful ones are frequently lexicographic pairs.
Ackermann-style recursions, path compression in union-find, and most rewriting systems terminate on
a lexicographic or multiset ordering and on nothing simpler. Choosing the ordering is the entire
proof; the rest is arithmetic.</p>

<h2>What the standard treatments get wrong</h2>
<ul>
  <li><strong>Invariants are presented as documentation.</strong> They are a design tool. Fix the invariant first and the boundary updates are forced, which is why a derived binary search has no plus one to memorise.</li>
  <li><strong>Termination is treated as obvious.</strong> Concurrency breaks it silently: a compare-and-swap retry loop is not guaranteed to terminate at all under contention, only lock-freedom at the system level is, and any single thread may starve forever.</li>
  <li><strong>Frame conditions go unstated.</strong> A postcondition that says what changed but not what did not is unusable for compositional reasoning, which is the entire motivation for separation logic and its frame rule.</li>
  <li><strong>Floating point breaks the well-ordering.</strong> A loop whose variant is a shrinking floating point residual can stall when the decrement falls below the ulp of the accumulator, so the measure stops strictly decreasing. Bound such loops by an iteration count as well as by tolerance.</li>
</ul>

<h2>Where this pays in an interview</h2>
<p>A candidate who derives the boundaries from a stated invariant never has to say "let me try
<code>mid - 1</code> and see". That difference is visible within thirty seconds and it is the whole
reason this topic sits at the front of the course rather than in an appendix.</p>
`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which of these is a usable loop invariant for a routine that scans an array and keeps the largest value seen?",
        options: [
          "The array is sorted in ascending order",
          "After k iterations, best holds the maximum of the first k elements",
          "The loop body runs exactly n times",
          "best is greater than zero",
        ],
        answer: 1,
        explanation:
          "An invariant is a statement about the program's variables that stays true across iterations and, combined with the exit condition, yields the result you want. Option three describes the loop's schedule rather than its state, so it tells you nothing about whether best is correct when the loop finishes.",
        difficulty: "Easy",
        skill: "Loop invariant",
      },
      {
        n: 2,
        question: "You have written down an invariant. What must you establish for the proof to be complete?",
        options: [
          "Only that it holds when the loop exits",
          "That it holds before the first iteration, that one iteration preserves it, and that it plus the exit condition gives the result you claim",
          "Only that the loop terminates",
          "That the invariant mentions every variable the loop touches",
        ],
        answer: 1,
        explanation:
          "Initialisation, maintenance and the exit reading are the three obligations, and dropping any of them leaves a hole: an invariant that is preserved but never established at the start proves nothing at all. Checking only the exit is the common shortcut, and it is what allows a loop that is wrong on empty input to pass a walkthrough.",
        difficulty: "Medium",
        skill: "Loop invariant",
      },
      {
        n: 3,
        question: "A loop's condition is lo < hi. What is the standard way to argue that it terminates?",
        options: [
          "Show that the body cannot throw an exception",
          "Exhibit a non-negative integer measure, here hi minus lo, that strictly decreases on every iteration",
          "Show that lo and hi are both integers",
          "Run it on a large input and observe that it finishes",
        ],
        answer: 1,
        explanation:
          "Termination needs a variant: a quantity bounded below that gets strictly smaller each pass, since an integer cannot decrease forever while staying non-negative. Testing on a large input is evidence rather than proof, and it is exactly the method that misses the one branch where the measure fails to shrink.",
        difficulty: "Medium",
        skill: "Termination argument",
      },
      {
        n: 4,
        question:
          "In JavaScript, computing the midpoint as (lo + hi) >> 1 is unsafe for very large index ranges. Why?",
        options: [
          "Because the shift operator rounds towards zero rather than down",
          "Because bitwise operators coerce operands to 32-bit signed integers, so a sum above 2147483647 wraps to a negative number",
          "Because shifting is slower than dividing on modern engines",
          "Because lo + hi can exceed Number.MAX_SAFE_INTEGER",
        ],
        answer: 1,
        explanation:
          "Every bitwise operator in JavaScript converts its operands to 32-bit signed integers first, so once lo + hi passes 2^31 - 1 the result is negative and the index goes out of range. The MAX_SAFE_INTEGER answer is tempting but the wrong threshold by roughly six orders of magnitude; the safe forms are lo + ((hi - lo) >> 1) or Math.floor((lo + hi) / 2).",
        difficulty: "Hard",
        skill: "Binary search boundaries",
      },
      {
        n: 5,
        question: "Why do experienced implementers prefer half-open ranges, lo inclusive and hi exclusive?",
        options: [
          "They permit negative indices to be used as sentinels",
          "The size is hi minus lo, an empty range is lo equal to hi, and splitting needs no plus or minus one",
          "They execute faster because the comparison is strict",
          "They remove the need to state an invariant",
        ],
        answer: 1,
        explanation:
          "The convention makes three separate facts fall out with no arithmetic, which is why slice, substring and iterator ranges all use it. Speed has nothing to do with it: a strict comparison and a non-strict one cost the same, and the win is entirely in the number of boundary decisions you no longer have to make.",
        difficulty: "Medium",
        skill: "Half-open intervals",
      },
      {
        n: 6,
        question:
          "A lower-bound binary search runs while (lo < hi) with hi = mid on the not-less branch. What is true the moment the loop exits?",
        options: [
          "lo is the index of the target, if the target is present",
          "lo equals hi and is the first index whose value is at least the target, which may be one past the end",
          "hi is the last index whose value is below the target",
          "Nothing can be concluded, since the target may be absent",
        ],
        answer: 1,
        explanation:
          "The invariant says everything below lo is too small and everything at or above hi is not, so when the two meet they meet exactly at the first acceptable position, and that position is the array length when no element qualifies. Reading the exit as an index of the target is the classic error: a lower bound answers an insertion-point question, and a separate equality check is needed to say whether the target is there.",
        difficulty: "Hard",
        skill: "Binary search boundaries",
      },
      {
        n: 7,
        question:
          "A binary search is called on an array that is not sorted and returns a wrong index. In the language of contracts, what happened?",
        options: [
          "The routine's postcondition is too weak to be useful",
          "The caller broke the precondition, so the routine's guarantee does not apply and the defect belongs to the call site",
          "The loop invariant is incorrectly stated",
          "The termination argument fails on unsorted data",
        ],
        answer: 1,
        explanation:
          "Sortedness is what the routine demands of its caller, and a routine owes nothing at all once its precondition is violated, so the fix belongs where the array is built or sorted. Blaming the invariant is tempting because that is where the wrongness becomes visible, but the invariant is only claimed to be maintained under the precondition.",
        difficulty: "Medium",
        skill: "Precondition and postcondition",
      },
      {
        n: 8,
        question:
          "A loop iterates with the condition i < arr.length and pushes onto that same array inside the body. Which part of the correctness argument fails first?",
        options: [
          "The invariant, because the array contents change",
          "The termination argument, because the measure length minus i no longer strictly decreases",
          "The precondition, because arrays must not be mutated",
          "Nothing fails; the loop simply processes the new elements too",
        ],
        answer: 1,
        explanation:
          "Each iteration raises the bound as fast as the cursor, so the quantity that was supposed to shrink stays constant or grows and the loop never ends. The last option is the tempting one because it describes a legitimate design, a worklist, but a worklist is only safe when the additions are guaranteed to run out.",
        difficulty: "Hard",
        skill: "Termination argument",
      },
      {
        n: 9,
        question: "What is wrong with for (let i = 0; i <= arr.length; i++) { total += arr[i]; }?",
        options: [
          "Nothing, the loop covers every element",
          "The final iteration reads arr[arr.length], which is undefined, because the last valid index is length minus one",
          "The loop starts at the wrong index and skips the first element",
          "It runs one iteration too few and misses the last element",
        ],
        answer: 1,
        explanation:
          "A zero-based array of length n has valid indices 0 to n - 1, so the non-strict comparison runs one extra pass and reads past the end, which in JavaScript yields undefined and poisons the sum into NaN rather than throwing. This is why the half-open form i < length is the default: the bound and the length are the same number.",
        difficulty: "Easy",
        skill: "Off-by-one errors",
      },
      {
        n: 10,
        question:
          "A loop walks an array forwards and splices out elements that match a condition. Some matching elements survive. Why?",
        options: [
          "splice is asynchronous, so the removals are applied after the loop",
          "Removing at index i shifts the next element into i, and the loop then increments past it unexamined",
          "splice removes by value rather than by index",
          "The array must be sorted before elements can be removed",
        ],
        answer: 1,
        explanation:
          "Deletion shifts every later element left by one, so the successor lands on the cursor position that has just been processed and is skipped when i advances. Iterating backwards or building a filtered copy avoids it; note also that repeated splicing is quadratic, which is a second reason the copy is usually the better answer.",
        difficulty: "Hard",
        skill: "Off-by-one errors",
      },
    ],
  },

  5038: {
    topicId: 5038,
    title: "Two pointers",
    summary:
      "Replace a nested loop with two cursors that only ever move forward, and learn the three cues " +
      "that tell you a question is a two-pointer question before you have finished reading it.",
    concepts: [
      "Opposite-end pointers",
      "Fast and slow pointers",
      "Sorted-input precondition",
      "Read and write cursors",
      "Monotone movement",
    ],
    glossary: {
      "Two pointers":
        "A family of linear scans in which two indices move through the data under rules that never send either one backwards.",
      "Opposite-end scan":
        "One pointer starts at the front and one at the back, and each step discards the candidate that cannot be part of any answer.",
      "Fast and slow pointers":
        "Two cursors advancing at different rates through the same sequence, used for cycle detection and for finding a midpoint in one pass.",
      "Read and write cursors":
        "A pair in which one index scans the input and the other marks where the next kept element belongs, giving in-place filtering.",
      "Monotone movement":
        "The property that each pointer only ever advances, which is what makes the total work linear rather than quadratic.",
      "Discard argument":
        "The proof obligation for an opposite-end scan: an explanation of why the element you skip cannot appear in any valid answer.",
      "In-place":
        "Producing the answer inside the original array using only a constant amount of extra memory.",
    },
    body: {
      Beginner: `
<p>You have a list of numbers in order, smallest to largest, and you want two of them that add up to
a target. The obvious method tries every pair. For a list of a thousand numbers that is half a
million tries.</p>

<p>Here is a better way. Put one finger on the first number and one on the last, and add them.</p>

<ul>
  <li>If the total is exactly the target, you are done.</li>
  <li>If the total is too big, the biggest number is too big for this partner. Move the right finger left.</li>
  <li>If the total is too small, the smallest number is too small. Move the left finger right.</li>
</ul>

<p>Each step throws away one number for good, so the whole search takes at most as many steps as
there are numbers.</p>

<pre><code>let left = 0, right = nums.length - 1;
while (left &lt; right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum &lt; target) left++;
  else right--;
}
</code></pre>

<h2>The part that must be true</h2>
<p>This only works because the list is sorted. On a shuffled list, a total that is too big tells you
nothing about which number to drop, and the whole argument collapses. Sorted input is not a detail
here, it is the reason the method is correct.</p>

<h2>A second shape</h2>
<p>The other common pair of fingers both start at the front and move at different speeds. One reads
every element, the other marks where the next element you want to keep should go. That is how you
remove duplicates without making a second list.</p>

<aside class="tip">When you spot a nested loop over the same array, ask whether the inner loop ever
needs to go backwards. If it does not, two pointers will usually replace it.</aside>
`,
      Intermediate: `
<p>Two pointers is the first real pattern in this course because it demonstrates the trade the whole
course is about: buy a precondition, usually sortedness, and spend it to turn a quadratic search into
a linear one. There are three variants worth being able to write from memory.</p>

<h2>Variant one: converging from the ends</h2>
<p>Used for pair sums on sorted data, palindrome checks, container-with-most-water, and merging two
sorted halves from the outside in. The correctness obligation is always the same and it is worth
saying explicitly: <em>when I move a pointer, I must be able to prove the element I am leaving behind
cannot participate in any answer I have not already found</em>. For a sorted pair sum, if the current
total exceeds the target then the largest remaining value cannot pair with anything left, since every
remaining partner is at least as large as the current smallest. That single sentence is the proof.</p>

<h2>Variant two: read and write cursors</h2>
<p>Used for in-place filtering, deduplication and stable compaction:</p>
<pre><code>function compact(nums, keep) {
  let write = 0;
  for (let read = 0; read &lt; nums.length; read++) {
    if (keep(nums[read])) nums[write++] = nums[read];
  }
  nums.length = write;          // invariant: [0, write) holds every kept element, in order
  return nums;
}
</code></pre>
<p>The invariant is the whole design: the region before <code>write</code> is exactly the answer so
far, and because <code>write</code> never overtakes <code>read</code>, no element is destroyed before
it has been examined.</p>

<h2>Variant three: fast and slow</h2>
<p>Advance one pointer by one step and the other by two. In a linked list this finds the midpoint in
a single pass and detects a cycle: if a cycle exists, the fast pointer eventually laps the slow one
and they meet, because the gap between them changes by exactly one each step and therefore cannot
step over zero. The same trick applied to an array of successor indices detects a repeated value in a
sequence without modifying the input.</p>

<h2>The recognition cues</h2>
<ul>
  <li>The input is sorted, or would obviously be sorted first, and the question asks about pairs or triples.</li>
  <li>The answer is a contiguous piece of the input and both ends only need to move one way.</li>
  <li>The question says "in place" or "O(1) extra space", which rules out the hash map answer.</li>
</ul>

<h2>Cost</h2>
<p>Every variant is O(n) time and O(1) auxiliary space. If the input needs sorting first, say so:
the honest bound becomes O(n log n) dominated by the sort, which is still a large win over the
quadratic scan, and an interviewer will want to hear you make that distinction rather than quietly
claim linear.</p>
`,
      Advanced: `
<p>The pattern extends past the textbook cases, and so do its failure modes.</p>

<h2>Three pointers and the deduplication trap</h2>
<p>Three-sum is a sorted outer loop wrapping an opposite-end scan, which gives O(n^2). The part that
is actually hard is producing distinct triples. Skipping duplicate values at all three positions is
correct and is the only approach that keeps the space bound; collecting into a set of stringified
triples is quietly O(n^2) in memory and depends on a stable serialisation. The skip must happen after
the first candidate at each level, never before, or the first legitimate triple is lost:</p>
<pre><code>for (let i = 0; i &lt; n - 2; i++) {
  if (i &gt; 0 &amp;&amp; a[i] === a[i - 1]) continue;   // after, not before
  ...
}
</code></pre>

<h2>Where the discard argument breaks</h2>
<p>Container-with-most-water moves the shorter wall inward, and the proof is that keeping the shorter
wall while narrowing the gap cannot beat the current area. Substitute a problem where the value is
not monotone in the width, for example maximising the sum of the two chosen elements minus the
distance between them, and the same movement rule silently returns a suboptimal answer while looking
identical. Always re-derive the discard argument for the specific objective; the shape of the loop is
not the correctness.</p>

<h2>Negative numbers and the sliding-window confusion</h2>
<p>A common conflation: "two pointers on a sorted array" and "sliding window over a running sum" look
alike, but a window only works when the running quantity is monotone as the window grows. With
negative values a longer window can have a smaller sum, so shrinking on an overshoot is unjustified,
and the correct tool becomes prefix sums with a hash map. Recognising which of the two patterns
applies is the discriminating skill; the code is the easy part.</p>

<h2>Floyd, formally</h2>
<p>In cycle detection with slow advancing by one and fast by two, once both are inside the cycle the
gap decreases by one per step modulo the cycle length, so a meeting is guaranteed. Restarting one
pointer at the head and advancing both by one then meets at the entry node, because the distance from
the head to the entry and the distance from the meeting point to the entry are congruent modulo the
cycle length. Being able to state that congruence is what separates having memorised the algorithm
from understanding it.</p>
`,
      Expert: `
<p>Underneath the three variants is one idea: a two-dimensional search space explored along a
monotone staircase. Candidate answers form a grid indexed by the pair (left, right), the objective is
monotone in each coordinate, and each step of the loop eliminates an entire row or column. That is
the same argument as the saddleback search used to find a value in a matrix whose rows and columns are
both sorted, and it explains why the running time is the perimeter of the grid rather than its area.</p>

<h2>Amortisation, and where the linear claim is fragile</h2>
<p>The linear bound depends on both pointers being monotone in the loop body. Any branch that resets
a pointer backwards destroys the amortisation, which is what turns a naive substring search into a
quadratic scan and why Knuth-Morris-Pratt has to precompute a failure function to preserve the
property. When reviewing a two-pointer loop, the first question is not whether it is correct but
whether either index can decrease; if it can, the bound needs a separate potential argument.</p>

<h2>What the standard write-ups get wrong</h2>
<ul>
  <li><strong>"Two pointers gives O(1) space."</strong> Only if the sortedness was free. If you sorted the array yourself, you paid O(log n) auxiliary space for the sort's recursion at minimum, and you also destroyed the original order, which is a real cost when indices into the original array are the required output.</li>
  <li><strong>"Sort then two-pointer is always the right answer for pair sums."</strong> On unsorted input where the required output is original indices, the hash map is genuinely better: O(n) rather than O(n log n), and it does not need an index-preserving sort. Sorting is the right answer when you need triples, ordering, or constant space.</li>
  <li><strong>"Fast and slow is only for linked lists."</strong> It works on any implicit functional graph with out-degree one, which is how it detects a duplicate in an array of values in a bounded range without touching the input, in constant space, where the intuitive sort or set answers cost more.</li>
  <li><strong>Numeric edge cases.</strong> A midpoint or sum computed on 32-bit-coerced values can wrap, and in JavaScript the pair-sum comparison is exact only while the operands stay inside the 53-bit safe integer range. Beyond it, two distinct sums can compare equal, and the loop reports a pair that does not add up.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Pair with a given sum in a sorted array",
        difficulty: "Easy",
        statement: `
<p>Given an array <code>nums</code> sorted in ascending order and a number <code>target</code>,
return the indices of two <em>different</em> positions whose values add up to the target.</p>
<ul>
  <li>Return them as an array <code>[i, j]</code> with <code>i</code> less than <code>j</code>.</li>
  <li>If several pairs work, return the one with the smallest <code>i</code>, and among those the largest <code>j</code>.</li>
  <li>If no pair works, return an empty array.</li>
</ul>
<pre>nums = [1, 3, 4, 6, 8, 11], target = 10  ->  [2, 3]   because 4 + 6 = 10
nums = [1, 2, 3],            target = 100 ->  []</pre>
<p>Do it in one pass with no extra data structure. The array being sorted is the fact that makes
that possible.</p>`,
        fn: "sortedPairSum",
        params: "nums, target",
        tests: [
          { args: [[1, 3, 4, 6, 8, 11], 10], expected: [2, 3], label: "basic" },
          { args: [[1, 2, 3], 100], expected: [], label: "no pair exists" },
          { args: [[2, 2, 2, 2], 4], expected: [0, 3], label: "duplicates" },
          { args: [[-5, -2, 0, 3, 7], 1], expected: [1, 3], label: "negative values" },
          { args: [[4], 4], expected: [], label: "single element" },
          { args: [[], 5], expected: [], label: "empty input", hidden: true },
        ],
        hints: [
          "The array is sorted, so the smallest and the largest value are at the two ends. Start there.",
          "If the current total is too large, which of the two values can you rule out entirely, and why?",
          "Move left up when the sum is below the target and right down when it is above. Each move discards one index permanently, so the loop is linear.",
        ],
        solution: `function sortedPairSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
        skills: ["Opposite-end pointers", "Sorted-input precondition", "Monotone movement"],
      },
      {
        n: 2,
        title: "Squares of a sorted array",
        difficulty: "Medium",
        statement: `
<p>An array <code>nums</code> is sorted in ascending order but may contain negative numbers. Return
a new array containing the square of every element, also sorted in ascending order.</p>
<pre>[-4, -1, 0, 3, 10]  ->  [0, 1, 9, 16, 100]
[-7, -3, -1]        ->  [1, 9, 49]</pre>
<p>Sorting the squares afterwards is O(n log n) and does not count. Squaring flips the order of the
negative part, so the largest square is always at one end or the other: fill the result from the back
using a pointer at each end.</p>`,
        fn: "sortedSquares",
        params: "nums",
        tests: [
          { args: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100], label: "mixed signs" },
          { args: [[-7, -3, -1]], expected: [1, 9, 49], label: "all negative" },
          { args: [[1, 2, 3]], expected: [1, 4, 9], label: "all positive" },
          { args: [[2]], expected: [4], label: "single element" },
          { args: [[]], expected: [], label: "empty input" },
          { args: [[-2, -2, 1]], expected: [1, 4, 4], label: "duplicate magnitudes", hidden: true },
        ],
        hints: [
          "Which position in the input holds the largest square? It is never in the middle.",
          "Write the result from index n - 1 downwards rather than from 0 upwards.",
          "Compare the absolute values at the two ends, take the larger, square it into the current write slot, then move that pointer inwards.",
        ],
        solution: `function sortedSquares(nums) {
  const n = nums.length;
  const out = new Array(n);
  let left = 0;
  let right = n - 1;
  for (let write = n - 1; write >= 0; write--) {
    const l = nums[left] * nums[left];
    const r = nums[right] * nums[right];
    if (l > r) {
      out[write] = l;
      left++;
    } else {
      out[write] = r;
      right--;
    }
  }
  return out;
}`,
        skills: ["Opposite-end pointers", "Read and write cursors", "Monotone movement"],
      },
    ],
  },

  5039: {
    topicId: 5039,
    title: "Sliding window",
    summary:
      "Turn every question about the best contiguous run into one loop with a shrink rule, and know exactly " +
      "which properties of the data make that rule valid.",
    concepts: [
      "Fixed-size window",
      "Variable-size window",
      "Window invariant",
      "Shrink condition",
      "Amortised linear scan",
    ],
    glossary: {
      "Sliding window":
        "A contiguous range over a sequence, maintained by advancing a right edge and, under a stated rule, a left edge.",
      "Fixed-size window":
        "A window whose width never changes: the left edge moves exactly once for every move of the right edge.",
      "Variable-size window":
        "A window that grows on the right and shrinks on the left until a condition is restored, so its width varies.",
      "Window invariant":
        "The property the window is required to satisfy at the end of every iteration, such as containing no repeated character.",
      "Shrink condition":
        "The test that decides when the left edge must advance, which is the only place a window algorithm can be wrong.",
      "Monotone quantity":
        "A running value that can only move one way as the window grows, which is what makes shrinking on an overshoot valid.",
      "Amortised linear scan":
        "The bound that follows when both edges only advance: each index enters and leaves the window at most once.",
    },
    body: {
      Beginner: `
<p>A sliding window is a stretch of a list that you move along instead of re-examining. Suppose you
want the highest total of any three neighbouring numbers. The slow way adds three numbers at every
starting position. The window way adds the first three once, then for each step adds the number
entering on the right and subtracts the one leaving on the left.</p>

<pre><code>let sum = nums[0] + nums[1] + nums[2];
let best = sum;
for (let i = 3; i &lt; nums.length; i++) {
  sum += nums[i] - nums[i - 3];   // one in, one out
  if (sum &gt; best) best = sum;
}
</code></pre>

<h2>Windows that change size</h2>
<p>The second kind of window can stretch and shrink. You want the shortest run of numbers that adds
up to at least 7. Keep adding numbers on the right. The moment the total reaches 7, record the
length, then start removing numbers from the left while the total is still at least 7, because a
shorter run that still works is a better answer.</p>

<h2>Why it is fast</h2>
<p>Both edges only ever move to the right. Every number gets added exactly once and removed at most
once, so no matter how much the window stretches and shrinks, the total work is proportional to the
length of the list.</p>

<h2>What can go wrong</h2>
<p>The shrink rule is where all the bugs live. Shrink too eagerly and you throw away the answer;
shrink too late and you report a run that is longer than it needed to be. Write down, in words, the
property the window must always have, then shrink exactly while that property is broken.</p>

<aside class="tip">Questions containing the words "contiguous", "substring", "subarray" together with
"longest", "shortest" or "at most k" are almost always window questions.</aside>
`,
      Intermediate: `
<p>Sliding window is two patterns sharing a name, and mixing them up is the usual source of trouble.
Decide first which one the question is asking for.</p>

<h2>Fixed width</h2>
<p>The width is given. The left edge is a dependent variable: <code>left = right - k + 1</code>. There
is no shrink rule, only an add and a remove, and the loop is a single pass with an O(1) update per
step. Running averages, maximum sum of k consecutive readings and any "every window of size k" query
are this shape.</p>

<h2>Variable width</h2>
<p>The width is what you are optimising. The loop looks like this every time:</p>
<pre><code>let left = 0, best = 0;
for (let right = 0; right &lt; n; right++) {
  add(nums[right]);
  while (windowIsInvalid()) {     // or: while (windowIsBetterWithoutTheLeftEdge())
    remove(nums[left]);
    left++;
  }
  best = combine(best, right - left + 1);
}
</code></pre>
<p>Two dual forms exist and they are easy to confuse. For a <em>longest</em> window you shrink while
the window is invalid and record after shrinking, because the window is always valid at the bottom of
the loop. For a <em>shortest</em> window you record while the window is valid and shrink to try to
beat it, because you want the tightest valid window ending at each right edge.</p>

<h2>The precondition nobody states</h2>
<p>Shrinking on overshoot is only justified when the running quantity is monotone as the window
grows. With non-negative numbers, extending a window cannot lower its sum, so a sum that is too large
can only be fixed by removing from the left, and the algorithm is correct. Introduce a single negative
number and that reasoning fails: a longer window can have a smaller sum, so the shortest valid window
might not touch the current left edge at all. For sums with negatives, the correct tool is prefix
sums combined with a hash map, which is the next topic in this course.</p>

<h2>What the window carries</h2>
<p>The window state must support add, remove and query in O(1) or the linear bound evaporates:</p>
<ul>
  <li>A running sum or count for numeric conditions.</li>
  <li>A frequency map plus a counter of distinct keys for "at most k distinct" style conditions.</li>
  <li>A monotone deque when the query is "maximum in the current window", which is a topic of its own later in this course.</li>
</ul>

<h2>Cost</h2>
<p>O(n) time, since each index is added once and removed at most once, and O(1) or O(k) auxiliary
space depending on what the window carries. Say the amortised argument out loud: the inner while loop
looks nested, and an interviewer will check whether you know why it does not make the algorithm
quadratic.</p>
`,
      Advanced: `
<p>Three refinements separate a candidate who has memorised the template from one who can adapt it.</p>

<h2>Exactly k, from at most k</h2>
<p>There is no clean window for "exactly k distinct values", because the shrink condition is not
monotone: a window can be invalid, become valid, and become invalid again as it grows. The standard
resolution is subtraction, <code>atMost(k) - atMost(k - 1)</code>, where each term is a genuine
window. It doubles the constant and remains linear, and being able to reach for it is a strong signal
in an interview.</p>

<h2>The non-shrinking window</h2>
<p>When the question only asks for the length of the longest valid window, the left edge never needs
to move backwards and, more surprisingly, never needs to shrink the window below its best size so
far. Advancing left exactly once whenever the window is invalid keeps a window whose width is
monotonically non-decreasing and whose maximum is the answer. The result is a branch-free single pass
with no inner loop. It computes a width that is not necessarily valid at every step, which is why it
only answers the length question and not the "return the window itself" question, and that is exactly
the trap.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Recording at the wrong point.</strong> For longest windows, recording before the shrink loop measures an invalid window. For shortest windows, recording after it measures a window that has been shrunk past validity.</li>
  <li><strong>Deleting keys from a frequency map on the wrong side.</strong> Decrementing without removing the zero entry leaves a distinct-count that never falls, so the window never shrinks and the answer degenerates to the whole array.</li>
  <li><strong>k larger than n.</strong> A fixed window loop written as a for from k to n silently returns the identity value instead of signalling that no window exists. Decide and document what the answer is for that case before you write the loop.</li>
  <li><strong>Non-integer accumulators.</strong> Maintaining a running mean by add and subtract accumulates floating-point drift over a long stream; recompute periodically or hold a running sum of integers and divide at query time.</li>
</ul>

<h2>Streaming variants</h2>
<p>Once the sequence does not fit in memory, the window becomes a ring buffer and the "remove the left
edge" step becomes an eviction. Every property above still holds, but the query structure must support
removal from the front, which rules out a plain binary heap and is exactly why the monotone deque
exists.</p>
`,
      Expert: `
<p>The window is a special case of a general technique: maintaining a summary of a range under
incremental updates. Its linear cost comes from the fact that the range endpoints trace a monotone
path through the O(n^2) space of ranges, visiting O(n) of them.</p>

<h2>When the summary is not invertible</h2>
<p>The add-and-remove formulation silently assumes the window's summary forms a group, so that
removal is the inverse of addition. Sums qualify. Maxima do not: there is no operation that undoes
"include this value" for a maximum, which is why removing the left edge from a max-window requires
either a monotone deque or the two-stack trick, in which a queue is simulated by two stacks each
carrying a running maximum, giving O(1) amortised per operation for any associative but non-invertible
operator. The same construction is what SWAG, the sliding window aggregation used in stream
processors, is built on, and it generalises the whole family in one page of code.</p>

<h2>Monotonicity is the real precondition, not positivity</h2>
<p>Textbooks state the condition as "positive numbers only", which is a sufficient condition mistaken
for a necessary one. What is actually required is that validity be downward closed in the window
lattice: if a window is valid then every sub-window ending at the same right edge is valid, or the
dual for the shrink-to-shortest form. Positivity implies it for sums, but so does any monotone
predicate, which is why "at most k distinct characters" works despite involving no arithmetic at all.
Framing it this way tells you immediately that "sum divisible by k" or "sum equal to zero" are not
window problems, without having to try and fail.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"The while loop makes it O(n^2)."</strong> The correct argument is a potential function: left is bounded above by right and never decreases, so the total number of shrink steps across the whole run is at most n.</li>
  <li><strong>"Use a set for distinct characters."</strong> A set cannot support removal correctly when duplicates are present, because removing one occurrence must not remove the key. The frequency map with an explicit distinct counter is not an optimisation, it is a correctness requirement.</li>
  <li><strong>"Windows are for arrays and strings."</strong> The pattern applies to any totally ordered index, including timestamps, where the shrink condition is a time bound rather than a count, and where the left edge advances by a binary search rather than one step at a time.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Shortest subarray with a sum at least the target",
        difficulty: "Medium",
        statement: `
<p>Given an array <code>nums</code> of <strong>positive</strong> integers and a positive
<code>target</code>, return the length of the shortest contiguous subarray whose sum is at least
<code>target</code>. Return <code>0</code> when no subarray qualifies.</p>
<pre>nums = [2, 3, 1, 2, 4, 3], target = 7  ->  2      the subarray [4, 3]
nums = [1, 1, 1, 1],       target = 10 ->  0</pre>
<p>Grow the window on the right. Whenever it is valid, record its length and then shrink from the
left to see whether a shorter valid window ends at the same position. Both edges only move forward,
so the whole scan is linear.</p>`,
        fn: "minWindowLength",
        params: "nums, target",
        tests: [
          { args: [[2, 3, 1, 2, 4, 3], 7], expected: 2, label: "basic" },
          { args: [[1, 1, 1, 1], 10], expected: 0, label: "no valid window" },
          { args: [[5], 5], expected: 1, label: "single element exactly meets it" },
          { args: [[], 3], expected: 0, label: "empty input" },
          { args: [[1, 4, 4], 4], expected: 1, label: "one element is enough", hidden: true },
          { args: [[1, 2, 3, 4, 5], 15], expected: 5, label: "whole array required", hidden: true },
        ],
        hints: [
          "Keep a running sum of the current window rather than re-adding its elements.",
          "The moment the window is valid, it is worth recording, but a shorter valid window may end at the same right edge.",
          "Use while (sum >= target) to shrink, recording the width before each removal. Return 0 if the best width was never set.",
        ],
        solution: `function minWindowLength(nums, target) {
  let best = Infinity;
  let sum = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      const width = right - left + 1;
      if (width < best) best = width;
      sum -= nums[left];
      left++;
    }
  }
  return best === Infinity ? 0 : best;
}`,
        skills: ["Variable-size window", "Shrink condition", "Amortised linear scan"],
      },
      {
        n: 2,
        title: "Best window of a fixed width",
        difficulty: "Easy",
        statement: `
<p>Given an array <code>nums</code> and a width <code>k</code>, return the largest sum of any
<code>k</code> consecutive elements. If <code>k</code> is not a positive number, or is larger than
the array, return <code>null</code>, because no window of that width exists.</p>
<pre>nums = [1, 2, 3, 4, 5],     k = 2  ->  9     the window [4, 5]
nums = [3, -1, 4, -1, 5],   k = 3  ->  8     the window [4, -1, 5]
nums = [1, 2],              k = 5  ->  null</pre>
<p>Compute the first window once, then slide: add the element entering on the right and subtract the
one leaving on the left. Recomputing each window from scratch is O(n * k) and is the thing this
pattern exists to avoid.</p>`,
        fn: "maxWindowSum",
        params: "nums, k",
        tests: [
          { args: [[1, 2, 3, 4, 5], 2], expected: 9, label: "basic" },
          { args: [[3, -1, 4, -1, 5], 3], expected: 8, label: "negative values" },
          { args: [[-1, -2, -3], 2], expected: -3, label: "all negative" },
          { args: [[4], 1], expected: 4, label: "single element" },
          { args: [[1, 2], 5], expected: null, label: "window wider than the array" },
          { args: [[1, 2, 3], 0], expected: null, label: "zero width", hidden: true },
        ],
        hints: [
          "Handle the impossible widths before the loop, not inside it.",
          "Build the sum of the first k elements, then move the window one step at a time.",
          "Each step is sum += nums[right] - nums[right - k]. Compare against the best after every step.",
        ],
        solution: `function maxWindowSum(nums, k) {
  const n = nums.length;
  if (typeof k !== "number" || k <= 0 || k > n) return null;
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < n; right++) {
    sum += nums[right] - nums[right - k];
    if (sum > best) best = sum;
  }
  return best;
}`,
        skills: ["Fixed-size window", "Window invariant", "Amortised linear scan"],
      },
    ],
  },

  5040: {
    topicId: 5040,
    title: "Prefix sums and difference arrays",
    summary:
      "Pay once up front so that every range query afterwards costs a subtraction, and use the same idea in " +
      "reverse to apply thousands of range updates in a single pass.",
    concepts: [
      "Prefix sum array",
      "Constant-time range query",
      "Difference array",
      "Range update",
      "Cumulative reconstruction",
    ],
    glossary: {
      "Prefix sum":
        "An array where entry i holds the total of the first i elements of the original, so entry 0 is always zero.",
      "Range query":
        "A question about a contiguous slice of the data, such as the sum from index l to index r inclusive.",
      "Difference array":
        "An array holding the change between neighbouring elements, so that adding a value to a range costs two writes.",
      "Cumulative reconstruction":
        "Recovering the original array from a difference array by running a running total across it.",
      "Precomputation trade":
        "Spending O(n) time and memory once so that each of q later queries costs O(1) instead of O(n).",
      "Inclusive range":
        "A range that contains both endpoints, which is the convention most interview questions use and the source of the plus one.",
      "Sentinel slot":
        "The extra final entry in a difference array that absorbs the update ending at the last index without a bounds check.",
    },
    body: {
      Beginner: `
<p>You have a month of daily sales and you keep being asked things like "what did we take between the
5th and the 12th?". Adding those days up each time is fine once. Asked a thousand times, it is a
thousand passes over the data.</p>

<h2>Add everything up once</h2>
<p>Build a second array where each entry is the total <em>so far</em>:</p>
<pre><code>sales   = [ 3, 1, 4, 1, 5, 9 ]
running = [0, 3, 4, 8, 9, 14, 23]
</code></pre>
<p>The running array is one longer, and it starts at zero. Now the total from day 2 to day 4
inclusive is <code>running[5] - running[2]</code>, which is 14 minus 4, or 10. Check it: 4 + 1 + 5 is
indeed 10. Every question is now one subtraction.</p>

<h2>The same trick, backwards</h2>
<p>Now the opposite job. You have a hundred seats and a list of bookings, each saying "seats 10 to 40
gain one passenger". Writing into every seat of every range is slow.</p>

<p>Instead keep a change list. For a booking covering 10 to 40, write <code>+1</code> at 10 and
<code>-1</code> at 41. That is two writes no matter how wide the range. At the end, walk across the
change list keeping a running total, and that total is the real number at each seat.</p>

<h2>Why the extra slot</h2>
<p>The <code>-1</code> goes one past the end of the range, so the change list needs one more slot
than the data. Forgetting that is the single most common mistake here, and it shows up as an update
that never stops applying.</p>

<aside class="tip">Many queries and no updates suggests a prefix sum. Many updates and one read at
the end suggests a difference array. They are the same idea pointing in opposite directions.</aside>
`,
      Intermediate: `
<p>Both structures trade one linear pass for constant-time work afterwards. Which one you want is
decided by the shape of the workload, not by the shape of the data.</p>

<h2>Prefix sums, with the off-by-one removed</h2>
<p>Build the prefix array with a leading zero and length n + 1. That single choice deletes the
boundary special case:</p>
<pre><code>function buildPrefix(nums) {
  const p = new Array(nums.length + 1);
  p[0] = 0;
  for (let i = 0; i &lt; nums.length; i++) p[i + 1] = p[i] + nums[i];
  return p;
}
// sum of the inclusive range [l, r] is p[r + 1] - p[l]
</code></pre>
<p>The invariant is that <code>p[i]</code> is the sum of the first i elements, so <code>p[0]</code>
is the sum of nothing. Without the leading zero, a query starting at index 0 needs its own branch, and
that branch is where the bug goes.</p>

<h2>Difference arrays</h2>
<p>To apply the update "add d to every index in [l, r]", write <code>d</code> at <code>diff[l]</code>
and <code>-d</code> at <code>diff[r + 1]</code>. Each update is O(1) regardless of width. After all
updates, a single running total across <code>diff</code> reconstructs the final array in O(n):</p>
<pre><code>function applyUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, d] of updates) {
    diff[l] += d;
    diff[r + 1] -= d;             // the sentinel slot is why the array is n + 1 long
  }
  const out = new Array(n);
  let running = 0;
  for (let i = 0; i &lt; n; i++) {
    running += diff[i];
    out[i] = running;
  }
  return out;
}
</code></pre>
<p>Total cost is O(u + n) for u updates, against O(u * n) for the naive version. On a thousand
updates over a million slots that is the difference between instant and unusable.</p>

<h2>The variants worth knowing</h2>
<ul>
  <li><strong>Two dimensions.</strong> A 2D prefix sum answers rectangle queries with the inclusion-exclusion formula: bottom-right minus the two edges plus the doubly subtracted corner.</li>
  <li><strong>Prefix counts.</strong> The values need not be numbers to add. A prefix count of vowels, of characters below a threshold, or of any predicate works identically.</li>
  <li><strong>Prefix xor.</strong> Any invertible associative operator works. Xor is its own inverse, so a range xor is also a single combination of two prefix entries.</li>
</ul>

<h2>What breaks the pattern</h2>
<p>Prefix sums assume the underlying array does not change. One update invalidates every prefix entry
after it, at O(n) each. If the workload interleaves updates and queries, neither structure is right
and the answer is a Fenwick tree or a segment tree, which give O(log n) for both. Recognising that
crossover is the point of this lesson as much as the code is.</p>
`,
      Advanced: `
<p>The pattern generalises further than it is usually taught, and it fails in ways that are quiet.</p>

<h2>Prefix plus hash map: the pattern behind half the array questions</h2>
<p>"Count the subarrays with sum exactly k" is not a window problem, because negative values break
monotonicity. It is a prefix problem: a subarray (i, j] has sum k exactly when
<code>p[j] - p[i] === k</code>, so as you sweep j you ask how many earlier prefixes equal
<code>p[j] - k</code>. A hash map of prefix-value to count answers that in O(1) per step, giving a
linear algorithm on data where the window approach is simply wrong. The map must be seeded with
<code>{0: 1}</code> to account for subarrays that start at index 0, and forgetting the seed produces
answers that are correct except when the prefix itself is the answer, which is exactly the case a
small hand-written test misses.</p>

<h2>Overflow, precision and the reason integer sums are not always safe</h2>
<p>JavaScript numbers are exact only up to 2^53 - 1. A prefix sum over a long array of large values
crosses that line silently, and the failure mode is subtle: the total is wrong by a small amount and
range differences of nearby indices remain correct, so spot checks pass. Use BigInt when the domain
allows large magnitudes, or keep the values scaled. For floating-point data the difference of two
large prefixes catastrophically cancels, losing most of the significant digits of a small range sum,
which is why numerical libraries use compensated summation rather than a naive prefix.</p>

<h2>Difference arrays on unbounded or sparse coordinates</h2>
<p>When ranges are timestamps rather than small indices, allocating n slots is impossible. The same
algorithm runs on a sorted list of events instead: emit (l, +d) and (r + 1, -d), sort by coordinate,
then sweep accumulating the running total. This is the sweep line, and it turns interval-overlap
counting, meeting-room capacity and skyline problems into one O(u log u) template. The tie-break at a
shared coordinate is the whole correctness question: process ends before starts if touching intervals
should not count as overlapping, and the opposite if they should.</p>

<h2>Failure modes</h2>
<ul>
  <li>Writing <code>-d</code> at <code>r</code> instead of <code>r + 1</code>, which shortens every range by one and is invisible on single-element tests.</li>
  <li>Allocating the difference array at length n, then writing at index n for a range that ends at the last position, which in JavaScript silently extends the array rather than throwing.</li>
  <li>Reusing a prefix array after mutating the source, which returns stale answers with no error anywhere.</li>
  <li>Building 2D prefix sums with the wrong inclusion-exclusion sign, which is correct for every query touching the top-left corner and wrong for all the others.</li>
</ul>
`,
      Expert: `
<p>Prefix sums and difference arrays are the discrete calculus of arrays: the prefix operator is a
summation and the difference operator is its adjoint, and the two are mutually inverse up to a
boundary term. Stating it that way is not decoration, it predicts the generalisations.</p>

<h2>The algebraic requirement</h2>
<p>A range query by subtraction of prefixes requires the combining operator to form a group: it must
be associative, have an identity, and admit inverses. Sums and xor qualify. Minimum, maximum and gcd
are only monoids, since nothing undoes them, which is precisely why range-minimum needs sparse tables
or segment trees rather than a prefix array. The moment a candidate asks "is this operator
invertible?" the choice of structure is settled without trial and error.</p>

<h2>Higher-order differences</h2>
<p>Applying the difference construction k times supports range updates whose value varies
polynomially of degree k - 1 across the range. Adding an arithmetic progression to a range costs O(1)
on a second-order difference array and reconstruction is two cumulative passes. This is the discrete
analogue of integrating a polynomial, and it is what makes some competitive-programming range-update
tasks linear rather than log-linear.</p>

<h2>What the standard treatments get wrong</h2>
<ul>
  <li><strong>"Prefix sums are O(1) per query."</strong> They are O(1) queries with an O(n) build and O(n) memory. For a workload of three queries the naive scan wins on both, and a benchmark on a hot cache will show it.</li>
  <li><strong>"Fenwick trees are just prefix sums with updates."</strong> A Fenwick tree computes the same prefixes but stores partial sums over binary-indexed blocks; the consequence is that it supports point update and prefix query, and supporting range update <em>and</em> range query requires two Fenwick trees and a derivation most write-ups omit entirely.</li>
  <li><strong>"The difference array is the same as a segment tree with lazy propagation."</strong> It is the degenerate case where all updates precede all queries. Lazy propagation exists exactly because that ordering assumption fails, and it costs a log factor to remove it.</li>
  <li><strong>Cache behaviour is the real reason it wins.</strong> Both passes are sequential and prefetcher-friendly, which is why a difference array frequently beats an asymptotically equivalent tree by a large constant, and why the tree only pays off once the interleaving genuinely requires it.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Answer many range sums",
        difficulty: "Easy",
        statement: `
<p>Given an array <code>nums</code> and a list of <code>queries</code>, where each query is a pair
<code>[l, r]</code> meaning the <strong>inclusive</strong> range from index <code>l</code> to index
<code>r</code>, return an array holding the sum of each range in order.</p>
<pre>nums = [1, 2, 3, 4, 5], queries = [[0, 4], [1, 3], [2, 2]]  ->  [15, 9, 3]</pre>
<p>There may be far more queries than elements, so answering each one with its own loop is the wrong
shape. Build a prefix array once, with a leading zero, and answer every query with a single
subtraction.</p>`,
        fn: "rangeSums",
        params: "nums, queries",
        tests: [
          { args: [[1, 2, 3, 4, 5], [[0, 4], [1, 3], [2, 2]]], expected: [15, 9, 3], label: "basic" },
          { args: [[5], [[0, 0]]], expected: [5], label: "single element" },
          { args: [[1, 2, 3], []], expected: [], label: "no queries" },
          { args: [[-1, 2, -3], [[0, 2], [0, 0], [2, 2]]], expected: [-2, -1, -3], label: "negative values" },
          { args: [[], []], expected: [], label: "empty input", hidden: true },
          { args: [[7, 7, 7, 7], [[1, 2], [0, 3]]], expected: [14, 28], label: "repeated values", hidden: true },
        ],
        hints: [
          "Precompute once, then answer each query in constant time.",
          "Make the prefix array one longer than the input and start it with a zero, so a query beginning at index 0 needs no special case.",
          "With p[i] holding the sum of the first i elements, the inclusive range [l, r] is p[r + 1] - p[l].",
        ],
        solution: `function rangeSums(nums, queries) {
  const p = new Array(nums.length + 1);
  p[0] = 0;
  for (let i = 0; i < nums.length; i++) p[i + 1] = p[i] + nums[i];
  const out = [];
  for (const q of queries) {
    const l = q[0];
    const r = q[1];
    out.push(p[r + 1] - p[l]);
  }
  return out;
}`,
        skills: ["Prefix sum array", "Constant-time range query"],
      },
      {
        n: 2,
        title: "Apply range updates in one pass",
        difficulty: "Medium",
        statement: `
<p>You start with an array of <code>n</code> zeroes. Each update is a triple
<code>[l, r, delta]</code> meaning "add <code>delta</code> to every index from <code>l</code> to
<code>r</code> inclusive". Return the final array.</p>
<pre>n = 5, updates = [[0, 2, 1], [1, 4, 2]]  ->  [1, 3, 3, 2, 2]</pre>
<p>Writing into every index of every range is O(updates * n). Record each update as two marks, then
reconstruct the whole array with one running total, for O(updates + n).</p>`,
        fn: "applyRangeUpdates",
        params: "n, updates",
        tests: [
          { args: [5, [[0, 2, 1], [1, 4, 2]]], expected: [1, 3, 3, 2, 2], label: "overlapping ranges" },
          { args: [3, []], expected: [0, 0, 0], label: "no updates" },
          { args: [2, [[1, 1, 5]]], expected: [0, 5], label: "single slot range" },
          { args: [4, [[0, 3, -1]]], expected: [-1, -1, -1, -1], label: "negative delta over the whole array" },
          { args: [0, []], expected: [], label: "empty array" },
          { args: [4, [[0, 1, 3], [2, 3, 3], [0, 3, 1]]], expected: [4, 4, 4, 4], label: "adjacent ranges", hidden: true },
        ],
        hints: [
          "An update should cost the same whether it covers two slots or two million.",
          "Mark where the change starts and where it stops applying. The stop mark goes one position past the end of the range.",
          "Allocate n + 1 slots, add delta at l and subtract it at r + 1, then sweep a running total across the first n slots.",
        ],
        solution: `function applyRangeUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const u of updates) {
    const l = u[0];
    const r = u[1];
    const delta = u[2];
    diff[l] += delta;
    diff[r + 1] -= delta;
  }
  const out = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];
    out[i] = running;
  }
  return out;
}`,
        skills: ["Difference array", "Range update", "Cumulative reconstruction"],
      },
    ],
  },

  5041: {
    topicId: 5041,
    title: "Hash maps and frequency counting",
    summary:
      "Use a map to buy back a dimension of a search: replace the inner loop with a lookup, and choose a key " +
      "that makes the question you are asking trivial.",
    concepts: [
      "Hash map as an index",
      "Frequency counting",
      "Prefix count map",
      "Key design",
      "Collisions and the worst case",
    ],
    glossary: {
      "Hash map":
        "A structure giving expected constant-time lookup by key, built on a hash function that turns a key into a bucket index.",
      "Frequency map":
        "A map from value to the number of times it occurred, which is the smallest useful summary of a collection.",
      "Key design":
        "Choosing what to store as the key so that the question becomes a single lookup, for example a sorted signature rather than the word itself.",
      "Prefix count map":
        "A map from a running total to how many times that total has been seen, which converts range questions into lookups.",
      "Load factor":
        "The ratio of stored entries to buckets, which controls how often a hash map must grow and rehash.",
      Collision: "Two different keys landing in the same bucket, resolved by chaining or by probing.",
      "Expected versus worst case":
        "Hash lookup is O(1) on average and O(n) if every key collides, which is a security concern as well as a performance one.",
    },
    body: {
      Beginner: `
<p>A hash map stores pairs: a key you look things up by, and a value you get back. The important
property is that finding a key takes the same amount of time whether the map holds ten entries or ten
million.</p>

<h2>Counting things</h2>
<p>The most common use in interviews is counting. How many times does each word appear?</p>

<pre><code>const counts = new Map();
for (const word of words) {
  counts.set(word, (counts.get(word) || 0) + 1);
}
</code></pre>

<p>The <code>|| 0</code> handles the first time a word is seen, when <code>get</code> returns
undefined. Without it you would be adding one to undefined and getting NaN, which is the classic
first bug here.</p>

<h2>Why this replaces a nested loop</h2>
<p>Without a map, "how many times does this word appear" means scanning the whole list again for each
word. That is a loop inside a loop. With a map you make one pass to count and then every question
costs one lookup.</p>

<h2>Map or plain object</h2>
<p>Use <code>Map</code>. A plain object turns every key into a string, so the number 1 and the text
"1" collide, and it comes with inherited property names that can surprise you. <code>Map</code> keeps
keys as they are, remembers insertion order, and has a <code>size</code> you can read directly.</p>

<h2>A second use: remembering what you have seen</h2>
<p>Walking a list and asking "have I already seen the number that would complete this pair?" is the
same idea with a different question. You store each number as you pass it, and for each new number
you look up the partner it needs. One pass, no sorting.</p>

<aside class="tip">If your solution has a loop inside a loop over the same data, ask what the inner
loop is looking for. If the answer is "a value", a map usually deletes the inner loop.</aside>
`,
      Intermediate: `
<p>A hash map is not a data structure you reach for so much as a way of trading memory for a
dimension of search. The skill worth building is choosing the key, because the key is the algorithm.</p>

<h2>Three key designs that come up constantly</h2>
<ul>
  <li><strong>The value itself</strong>, for frequency counts and membership tests.</li>
  <li><strong>A canonical signature</strong>, when several different inputs should be treated as the same thing. Grouping words that are anagrams of each other works by keying on the sorted letters, or better, on a 26-slot count vector joined into a string, which is O(k) rather than O(k log k) per word.</li>
  <li><strong>A running aggregate</strong>, where the key is a prefix sum and the value is how many times that prefix has occurred. This is what makes "count the subarrays summing to k" linear.</li>
</ul>

<h2>The complement trick</h2>
<pre><code>function hasPairSum(nums, target) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(target - x)) return true;   // the partner arrived earlier
    seen.add(x);
  }
  return false;
}
</code></pre>
<p>Checking before inserting is deliberate. Insert first and a single element whose double is the
target reports a false positive by pairing with itself, which is the one boundary case a reviewer
will test.</p>

<h2>Counting with a map, and the order question</h2>
<p>A frequency map gives you counts but no ordering. Getting the k most frequent items means sorting
the entries, which is O(m log m) in the number of distinct keys, or bucketing by count into an array
of lists, which is O(m) since no count can exceed n. Interviewers ask for the second when they say
"can you do better than sorting", and ties then need an explicit rule, usually alphabetical, because
map iteration order is insertion order and depends on the input.</p>

<h2>Cost, stated honestly</h2>
<p>Insert, lookup and delete are O(1) expected. Building a frequency map is O(n) time and O(d) space
in the number of distinct values, which is worth saying separately: for a stream of a billion values
with three distinct ones, the space is constant, and for a stream of distinct identifiers it is
linear. That distinction is often the whole interview question.</p>

<h2>When the map is the wrong answer</h2>
<p>Maps destroy order and cost memory. If the question asks for the answer in place, in constant
space, or in sorted order, the intended pattern is usually two pointers or sorting instead. And a map
is no help when the question is about contiguity rather than membership, unless you key on a prefix
aggregate.</p>
`,
      Advanced: `
<p>The interesting failures with hash maps are not about speed on average, they are about the tail
and about what the key silently loses.</p>

<h2>Keys are compared by identity, not by content</h2>
<p><code>Map</code> uses the SameValueZero algorithm, so two structurally identical objects are two
different keys. Any composite key must therefore be serialised, and the serialisation must be
canonical: <code>JSON.stringify</code> of an object depends on property insertion order, so the same
logical key can produce two different strings. Build composite keys from an explicit ordered join of
primitive fields, and pick a separator that cannot occur in the fields, or the pair ("ab", "c") and
("a", "bc") collide into the same key.</p>

<h2>The worst case is reachable on purpose</h2>
<p>Lookup degrades to O(n) when all keys land in one bucket. In a web handler where the keys come
from user input, an attacker who knows the hash function can craft colliding keys and turn a linear
request into a quadratic one. This is hash flooding, and it is why engines use a per-process random
seed and why some implementations convert an over-long bucket into a tree. The lesson for interview
answers is to state the bound as "O(1) expected, O(n) worst case" and to know that the worst case is
adversarial rather than merely unlucky.</p>

<h2>Numeric keys and the values that are not equal to themselves</h2>
<p>NaN is a valid Map key and, unlike with the equality operator, it matches itself under
SameValueZero. Positive and negative zero are the same key. Floating point sums used as keys are a
trap: two mathematically equal running totals computed by different addition orders can differ in the
last bit and land in separate buckets, which quietly returns a count of zero where the answer should
have been positive. Use integers, or a scaled integer representation, whenever a computed value is
going to be a key.</p>

<h2>Memory shape</h2>
<p>A frequency map over millions of short strings costs far more than the data it summarises: each
entry carries a key object, a value, and bucket overhead. When the key space is small and dense, an
array indexed by the key is dramatically cheaper and faster, which is why character counts use a
26-slot array rather than a Map. Recognising a dense small key space is a real optimisation, not
premature micro-tuning.</p>
`,
      Expert: `
<p>The interview-level claim is that hash maps give O(1) expected lookup. The precise version is that
under simple uniform hashing the expected chain length is the load factor, and both the analysis and
the engineering hang on that constant.</p>

<h2>Open addressing versus chaining</h2>
<p>Chaining tolerates load factors near one and degrades gracefully, but every probe is a pointer
dereference to a separately allocated node, which is a cache miss. Open addressing keeps everything in
one contiguous table, so a probe sequence is usually one cache line, but it collapses as the load
factor approaches one and deletion needs tombstones or backward shifting. Robin Hood hashing bounds
the variance of probe distances by displacing richer entries, which makes the tail latency predictable
rather than merely the mean; Swiss tables go further and store a byte of hash metadata per slot so
that a single SIMD comparison filters sixteen candidates at once. None of this changes the asymptotic
bound and all of it changes the runtime by multiples.</p>

<h2>Amortisation and the rehash cliff</h2>
<p>Growth doubles the table and rehashes every key, which is amortised O(1) by the same argument as
the dynamic array, and it is subject to the same objection: one insertion in the sequence stalls. In a
latency-sensitive service the mitigation is incremental rehashing, keeping both tables live and
migrating a bounded number of buckets per operation, which is what Redis does. Presizing the map when
the final count is known removes the cliff entirely and is the single cheapest optimisation available
for a hot counting loop.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Hash lookup is O(1)."</strong> It is O(1) in the number of entries and O(k) in the length of the key, because the key must be hashed and, on a hit, compared. A map keyed by long strings is not constant time in any useful sense.</li>
  <li><strong>"Use an object, it is faster."</strong> In V8 an object with dynamically added string keys transitions to dictionary mode and loses its hidden class, while Map is purpose-built and keeps insertion order cheaply. The folklore predates modern Map implementations.</li>
  <li><strong>"Sets are memory-efficient membership tests."</strong> For a dense integer domain a bitset is thirty to sixty times smaller and faster, and for an approximate answer a Bloom filter is smaller still with a stated false-positive rate and no false negatives, which is exactly the trade a system-design follow-up is fishing for.</li>
  <li><strong>"Iteration order is unspecified."</strong> True of most languages, not of JavaScript: Map and Set iterate in insertion order by specification. Relying on it is legitimate here and is precisely what makes deterministic tie-breaking easier than in the languages the folklore comes from.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "The k most frequent words",
        difficulty: "Medium",
        statement: `
<p>Given an array of <code>words</code> and a number <code>k</code>, return the <code>k</code> most
frequent words, most frequent first. Break ties alphabetically, ascending.</p>
<ul>
  <li>If <code>k</code> exceeds the number of distinct words, return all of them in that same order.</li>
  <li>If <code>k</code> is zero or negative, return an empty array.</li>
</ul>
<pre>["a", "b", "a", "c", "b", "a"], k = 2  ->  ["a", "b"]
["z", "z", "y", "y", "x"],      k = 2  ->  ["y", "z"]   z and y tie on 2, y sorts first</pre>
<p>Count in one pass, then order the distinct keys. Do not sort the input itself: the counts, not the
words, are what you are ranking.</p>`,
        fn: "topKFrequent",
        params: "words, k",
        tests: [
          { args: [["a", "b", "a", "c", "b", "a"], 2], expected: ["a", "b"], label: "basic" },
          { args: [["z", "z", "y", "y", "x"], 2], expected: ["y", "z"], label: "alphabetical tie-break" },
          { args: [["x", "y"], 5], expected: ["x", "y"], label: "k larger than the distinct count" },
          { args: [[], 3], expected: [], label: "empty input" },
          { args: [["p", "q"], 0], expected: [], label: "k is zero" },
          { args: [["bb", "aa", "cc", "aa", "bb"], 2], expected: ["aa", "bb"], label: "ties on two words", hidden: true },
        ],
        hints: [
          "One pass builds the counts. The ordering is a separate step over the distinct keys, not over the input.",
          "Handle the degenerate values of k before you do any work.",
          "Sort the entries by count descending, and when counts are equal compare the words themselves ascending, then take the first k keys.",
        ],
        solution: `function topKFrequent(words, k) {
  if (typeof k !== "number" || k <= 0) return [];
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  const entries = Array.from(counts.entries());
  entries.sort(function (a, b) {
    if (b[1] !== a[1]) return b[1] - a[1];
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  return entries.slice(0, k).map(function (e) { return e[0]; });
}`,
        skills: ["Frequency counting", "Hash map as an index", "Key design"],
      },
      {
        n: 2,
        title: "Count the subarrays with a given sum",
        difficulty: "Hard",
        statement: `
<p>Given an array <code>nums</code>, which may contain negative numbers, and a number
<code>target</code>, return how many contiguous subarrays have a sum exactly equal to
<code>target</code>.</p>
<pre>[1, 1, 1],       target = 2  ->  2
[0, 0, 0],       target = 0  ->  6     every one of the six subarrays sums to zero
[-1, 1, -1, 1],  target = 0  ->  4</pre>
<p>Negative values rule out a sliding window: a longer window can have a smaller sum, so there is no
valid shrink rule. Instead note that the subarray ending at <code>j</code> and starting just after
<code>i</code> has sum <code>prefix[j] - prefix[i]</code>. Sweep once, keeping a map from each prefix
value to how many times it has been seen.</p>`,
        fn: "countSubarraysWithSum",
        params: "nums, target",
        tests: [
          { args: [[1, 1, 1], 2], expected: 2, label: "basic" },
          { args: [[1, 2, 3], 3], expected: 2, label: "two different lengths" },
          { args: [[0, 0, 0], 0], expected: 6, label: "all zeroes" },
          { args: [[], 0], expected: 0, label: "empty input" },
          { args: [[-1, 1, -1, 1], 0], expected: 4, label: "negative values", hidden: true },
          { args: [[3, 4, 7], 100], expected: 0, label: "no subarray qualifies", hidden: true },
        ],
        hints: [
          "Think about running totals rather than about windows.",
          "If the running total at j minus the running total at some earlier point equals the target, you have found a subarray. Count how many such earlier points exist.",
          "Seed the map with the entry 0 mapped to 1, so that a prefix which itself equals the target is counted. Then for each step add the count stored for runningTotal - target before recording the current total.",
        ],
        solution: `function countSubarraysWithSum(nums, target) {
  const seen = new Map();
  seen.set(0, 1);
  let running = 0;
  let total = 0;
  for (const x of nums) {
    running += x;
    const wanted = running - target;
    if (seen.has(wanted)) total += seen.get(wanted);
    seen.set(running, (seen.get(running) || 0) + 1);
  }
  return total;
}`,
        skills: ["Prefix count map", "Hash map as an index", "Key design"],
      },
    ],
  },

  5042: {
    topicId: 5042,
    title: "Monotonic stacks",
    summary:
      "Keep a stack whose contents are always sorted and every question of the form 'what is the next larger " +
      "thing' collapses to a linear scan with a two-line inner loop.",
    concepts: [
      "Monotonic stack",
      "Next greater element",
      "Span and boundaries",
      "Amortised push and pop",
      "Sentinel flush",
    ],
    glossary: {
      "Monotonic stack":
        "A stack maintained so that its contents are always increasing, or always decreasing, from bottom to top.",
      "Next greater element":
        "For each position, the first value to its right that is larger than it, the canonical use of the pattern.",
      "Previous smaller element":
        "For each position, the nearest value to its left that is smaller, which is what remains on the stack underneath an entry when it is popped.",
      Span: "The width of the region over which an element is the extreme value, bounded by its previous and next smaller neighbours.",
      "Sentinel flush":
        "Appending a virtual element that is smaller than everything, so the loop empties the stack without a separate clean-up pass.",
      "Amortised push and pop":
        "Each index is pushed once and popped at most once, so a loop that looks nested is in fact linear.",
      "Strict versus non-strict":
        "Whether the pop test uses greater-than or greater-than-or-equal, which decides how ties are attributed and is the usual source of double counting.",
    },
    body: {
      Beginner: `
<p>You are standing in a queue and want to know, for each person, who is the first taller person
ahead of them. Comparing every person with everyone ahead is slow. There is a neat way to do it in
one pass.</p>

<h2>The idea</h2>
<p>Walk the queue keeping a pile of people who are still waiting for an answer. When a new person
arrives, everyone on the pile who is shorter than the newcomer has just found their answer, so take
them off and record it. Then put the newcomer on the pile.</p>

<p>Because you only ever remove people who are shorter, the pile is always tall at the bottom and
short at the top. That ordering is what the word "monotonic" means here.</p>

<pre><code>const answer = new Array(heights.length).fill(-1);
const pile = [];                       // holds positions, not heights
for (let i = 0; i &lt; heights.length; i++) {
  while (pile.length &amp;&amp; heights[pile[pile.length - 1]] &lt; heights[i]) {
    answer[pile.pop()] = heights[i];
  }
  pile.push(i);
}
</code></pre>

<h2>Store positions, not values</h2>
<p>The stack holds indexes. You almost always need to know <em>where</em> an element was, either to
write the answer into the right slot or to measure a distance, and a stack of bare values throws that
away.</p>

<h2>Why it is not slow</h2>
<p>There is a loop inside a loop, which usually means trouble. Here it does not: each position is put
on the pile once and taken off at most once, so across the whole run there are at most as many
removals as there are people.</p>

<h2>Whoever is left</h2>
<p>People still on the pile at the end never found a taller person ahead. Their answer stays at the
starting value, which is why the array is filled with -1 first.</p>

<aside class="tip">The phrases "next greater", "nearest smaller", "how far until", and "how wide can
this bar stretch" are all the same pattern wearing different clothes.</aside>
`,
      Intermediate: `
<p>A monotonic stack answers questions of the form "for each element, find the nearest element in one
direction that stands in some order relation to it". Four variants exist, and they differ only in the
direction of the scan and the direction of the comparison.</p>

<h2>The four variants</h2>
<ul>
  <li><strong>Next greater to the right</strong>: scan left to right, pop while the top is smaller.</li>
  <li><strong>Next smaller to the right</strong>: scan left to right, pop while the top is larger.</li>
  <li><strong>Previous greater to the left</strong>: scan left to right, and read what remains on the stack <em>before</em> pushing.</li>
  <li><strong>Previous smaller to the left</strong>: same, with the opposite comparison.</li>
</ul>
<p>The third and fourth are worth dwelling on. You do not need a second reversed pass to get the
previous-element answers: when an element is about to be pushed, whatever is directly beneath it on
the stack is exactly its nearest qualifying neighbour on the left. One scan therefore yields both
boundaries, and both boundaries together give a span.</p>

<h2>Spans are the real payoff</h2>
<p>For each bar in a histogram, the widest rectangle using that bar as its height stretches from just
after the previous strictly smaller bar to just before the next strictly smaller one. Once you have
both boundaries, the area is a multiplication, and the maximum over all bars is the answer to the
largest-rectangle problem in O(n):</p>
<pre><code>// while popping, the popped bar's span is bounded by the new element on the
// right and by whatever is left underneath it on the stack, on the left
const left = stack.length ? stack[stack.length - 1] : -1;
const width = i - left - 1;
</code></pre>
<p>That <code>-1</code> for an empty stack is the neat part: it stands for a virtual bar of height
zero just off the left edge, and it removes a special case rather than adding one.</p>

<h2>The sentinel flush</h2>
<p>At the end of the scan the stack is not empty, and those entries still need processing. Rather than
writing a second loop, run the main loop one step past the end with a virtual value lower than
anything possible. Everything is then popped by the normal machinery, and the code has exactly one
place where the area is computed. Fewer places means fewer chances for the two copies to disagree.</p>

<h2>Ties</h2>
<p>Pop with <code>&gt;=</code> or with <code>&gt;</code>? For "next strictly greater" the pop test must
be strict. For the histogram it does not matter for the final answer, because a tied bar computes the
same maximal rectangle later in the scan, but it matters enormously in problems that count regions or
sum spans, where a tie counted at both ends is a double count. Decide the rule from the problem
statement rather than from a template.</p>

<h2>Cost</h2>
<p>O(n) time, O(n) auxiliary space in the worst case, which is a strictly decreasing input where
nothing is ever popped until the flush.</p>
`,
      Advanced: `
<p>The pattern generalises well past "next greater", and the generalisations are where interviews
actually go.</p>

<h2>Sum of subarray minimums</h2>
<p>Every subarray has exactly one minimum, so summing minimums over all subarrays can be reorganised
as: for each element, count the subarrays in which it is the minimum, then multiply. That count is the
product of the distances to the previous and next smaller elements, which the stack gives directly.
The correctness hinges entirely on tie handling: use strictly-smaller on one side and
smaller-or-equal on the other, so that among equal values exactly one is credited with each subarray.
Use the same strictness on both sides and every tie is counted twice or not at all, and the failure is
invisible on inputs with distinct values, which is why the test that catches it must contain
duplicates.</p>

<h2>Stock spans and online use</h2>
<p>The stack version is online: it produces the answer for each element as it arrives without seeing
the future, which suits a streaming setting. The next-greater variants are inherently offline in one
direction, and the standard trick to make them look online is to process the array reversed. Knowing
which of your variants can run on a stream is a system-design distinction, not a coding one.</p>

<h2>Circular arrays</h2>
<p>For "next greater in a circular array", walk indices from 0 to 2n and use <code>i % n</code>,
pushing only during the first pass. Iterating the actual array twice is the common wrong fix, because
it can assign an element an answer taken from its own duplicate on the second lap.</p>

<h2>Failure modes</h2>
<ul>
  <li>Pushing values instead of indices, which makes spans impossible and forces an index lookup that reintroduces the inner loop.</li>
  <li>Reading the neighbour underneath <em>after</em> pushing rather than before, which reports the element itself as its own previous-smaller.</li>
  <li>Forgetting the flush, which leaves the tail of the answer array at its default and passes every test whose input happens to end on its maximum.</li>
  <li>Using a stack of objects when a stack of integers would do; on a hot path the allocation dominates the algorithm.</li>
</ul>
`,
      Expert: `
<p>A monotonic stack is a compressed representation of a Cartesian tree. The stack at any moment holds
exactly the right spine of the Cartesian tree of the prefix seen so far, and a pop is the moment a
node acquires its parent. Seen that way, the linear-time histogram algorithm and linear-time Cartesian
tree construction are literally the same loop, and the range-minimum queries that a Cartesian tree
supports come for free from the same scan.</p>

<h2>The amortisation, stated as a potential</h2>
<p>Take the potential to be the stack height. A push costs 1 and raises the potential by 1, amortised
2. Each pop costs 1 and lowers the potential by 1, amortised 0. The total across the loop is therefore
bounded by twice the number of elements regardless of how the pops are distributed, which is the
rigorous form of the hand-waving argument that "each element is popped at most once". The same
potential shows why an implementation that reinserts a popped element, as some naive circular variants
do, forfeits the bound entirely.</p>

<h2>Where the pattern stops working</h2>
<p>The stack answers nearest-neighbour questions under a total order that is fixed in advance. Once
the comparison depends on the query rather than on the elements, for example "nearest element to the
right whose value differs from mine by at least d", monotonicity is lost because an element may be a
valid answer for one predecessor and not for another, and the correct tool becomes a sparse table, a
segment tree over values, or an offline sweep with a Fenwick tree. Recognising that boundary quickly
is worth more than another variant of next-greater.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Monotonic stack means increasing stack."</strong> The direction is a consequence of the question, not a convention. A decreasing stack answers next-greater and an increasing one answers next-smaller, and stating the invariant explicitly is the only way to keep them straight under pressure.</li>
  <li><strong>"The inner while makes it O(n^2) in the worst case."</strong> There is no such worst case; the potential argument is tight, and a strictly decreasing input is the case that maximises stack depth and still pops each index exactly once, in the flush.</li>
  <li><strong>"Use a stack of pairs to remember the count of merged equal elements."</strong> Often unnecessary. Indices already encode the multiplicity through the span arithmetic, and the pair version invites the double-count bug it is supposed to prevent.</li>
  <li><strong>Numerical sentinels.</strong> Using zero as the flush value is only safe if all inputs are non-negative. With negative values the flush must be negative infinity or, better, a loop bound that treats the past-the-end position as unconditionally smaller.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Next greater element",
        difficulty: "Medium",
        statement: `
<p>Given an array <code>nums</code>, return an array of the same length where entry <code>i</code>
holds the first value to the right of <code>i</code> that is <strong>strictly greater</strong> than
<code>nums[i]</code>, or <code>-1</code> when there is no such value.</p>
<pre>[2, 1, 2, 4, 3]  ->  [4, 2, 4, -1, -1]
[5, 4, 3]        ->  [-1, -1, -1]
[2, 2, 2]        ->  [-1, -1, -1]      equal is not greater</pre>
<p>The obvious double loop is O(n * n). Do it in one pass with a stack of indices that are still
waiting for an answer.</p>`,
        fn: "nextGreater",
        params: "nums",
        tests: [
          { args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1], label: "basic" },
          { args: [[5, 4, 3]], expected: [-1, -1, -1], label: "strictly decreasing" },
          { args: [[1, 2, 3]], expected: [2, 3, -1], label: "strictly increasing" },
          { args: [[2, 2, 2]], expected: [-1, -1, -1], label: "all equal" },
          { args: [[]], expected: [], label: "empty input" },
          { args: [[1]], expected: [-1], label: "single element", hidden: true },
        ],
        hints: [
          "Prefill the answers with -1, so positions that never find a greater value need no special handling.",
          "Keep a stack of positions whose answer is still unknown. What does the arrival of a new, larger value tell you about them?",
          "While the value at the top of the stack is smaller than the current value, pop it and write the current value into its answer slot. Then push the current index.",
        ],
        solution: `function nextGreater(nums) {
  const out = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      out[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return out;
}`,
        skills: ["Monotonic stack", "Next greater element", "Amortised push and pop"],
      },
      {
        n: 2,
        title: "Largest rectangle in a histogram",
        difficulty: "Hard",
        statement: `
<p>Each entry of <code>heights</code> is the height of a bar of width one, standing side by side.
Return the area of the largest rectangle that fits entirely inside the histogram.</p>
<pre>[2, 1, 5, 6, 2, 3]  ->  10    the bars of height 5 and 6, two wide
[1, 2, 3, 4, 5]     ->  9     heights 3, 4 and 5, three wide
[]                  ->  0</pre>
<p>For each bar, the widest rectangle that uses it as its height runs from just after the previous
shorter bar to just before the next shorter bar. A monotonic stack finds both boundaries in a single
pass. Run the loop one step past the end with a virtual bar of height zero so the stack empties
through the normal path.</p>`,
        fn: "largestRectangle",
        params: "heights",
        tests: [
          { args: [[2, 1, 5, 6, 2, 3]], expected: 10, label: "basic" },
          { args: [[1, 2, 3, 4, 5]], expected: 9, label: "increasing" },
          { args: [[5, 4, 3, 2, 1]], expected: 9, label: "decreasing" },
          { args: [[2, 2, 2]], expected: 6, label: "all equal" },
          { args: [[4]], expected: 4, label: "single bar" },
          { args: [[]], expected: 0, label: "empty input", hidden: true },
        ],
        hints: [
          "Fix a bar and ask how far left and how far right it can stretch before meeting a shorter bar.",
          "Keep the stack increasing in height. When a shorter bar arrives, every taller bar on the stack has just found its right boundary.",
          "When you pop index t, the left boundary is whatever index is now on top, or -1 if the stack is empty, so the width is i - left - 1 and the area is heights[t] times that width.",
        ],
        solution: `function largestRectangle(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const top = stack.pop();
      const left = stack.length ? stack[stack.length - 1] : -1;
      const area = heights[top] * (i - left - 1);
      if (area > best) best = area;
    }
    stack.push(i);
  }
  return best;
}`,
        skills: ["Monotonic stack", "Span and boundaries", "Sentinel flush"],
      },
    ],
  },

  5043: {
    topicId: 5043,
    title: "Deques and streaming maxima",
    summary:
      "Add removal from both ends to your toolkit and the maximum of every window in a stream becomes a single " +
      "linear pass instead of a heap with stale entries.",
    concepts: [
      "Double-ended queue",
      "Monotonic deque",
      "Index-based eviction",
      "Streaming constraints",
      "Amortised constant per element",
    ],
    glossary: {
      Deque:
        "A double-ended queue: a sequence supporting push and pop at both the front and the back in constant time.",
      "Monotonic deque":
        "A deque whose contents are kept in decreasing order, so its front is always the maximum of what it holds.",
      "Index-based eviction":
        "Storing positions rather than values, so an entry can be discarded the moment it falls outside the window.",
      "Stale entry":
        "A value still held by the structure although its position has left the window, which is what makes a plain heap the wrong choice.",
      "Streaming constraint":
        "The requirement to produce each answer having seen only the data so far, with memory bounded by the window rather than the stream.",
      "Ring buffer":
        "A fixed-size array used circularly, the usual concrete implementation of a bounded deque.",
      "Non-invertible aggregate":
        "A summary such as maximum that cannot be updated by subtracting the departing element, which is why a running total does not work here.",
    },
    body: {
      Beginner: `
<p>A queue lets you add at the back and remove from the front. A <strong>deque</strong>, said "deck",
lets you add and remove at both ends. That one extra ability solves a problem that is otherwise
awkward.</p>

<h2>The problem</h2>
<p>You have a list of readings and a window of, say, three. You want the largest value in every group
of three consecutive readings. Checking all three each time works but repeats effort.</p>

<p>You cannot keep just a running maximum, because when the window moves on, the value that leaves
might have been the maximum, and nothing tells you what the new one is. A total can be repaired by
subtracting the departing number. A maximum cannot.</p>

<h2>The fix: keep the useful candidates only</h2>
<p>Keep a line of candidates, biggest at the front. When a new reading arrives:</p>
<ul>
  <li>Any candidate at the back that is smaller than the newcomer can be dropped forever. It is
      younger competition it can never beat, so it will never be the answer again.</li>
  <li>Add the newcomer at the back.</li>
  <li>If the candidate at the front has now slid out of the window, drop it from the front.</li>
  <li>The front of the line is the maximum of the current window.</li>
</ul>

<h2>Store positions</h2>
<p>Keep positions in the deque, not the values themselves. You need the position to know when a
candidate has aged out of the window, and you can always look the value up.</p>

<h2>Why it is fast</h2>
<p>Every reading joins the line once and leaves it once, so the total work is proportional to the
number of readings, no matter how big the window is.</p>

<aside class="tip">If the question says "maximum" and "window" in the same sentence, the answer is a
deque holding indices. If it says "sum", a running total is enough.</aside>
`,
      Intermediate: `
<p>This topic exists because of one asymmetry: sums are invertible and maxima are not. A window sum
is maintained by adding the arriving element and subtracting the departing one. There is no
subtraction for a maximum, so the structure has to remember enough to answer after a removal.</p>

<h2>Why not a heap</h2>
<p>A max-heap gives the maximum in O(1) and insertion in O(log n), but removal of an arbitrary
element, the one leaving the window, is O(n) unless you maintain a side index. The usual workaround is
lazy deletion: push (value, index) pairs and discard the top whenever its index is outside the window.
That works and costs O(n log n), and it is a perfectly acceptable answer if you say why. The deque
does it in O(n), and the reason is that most of the heap's contents can be proved irrelevant.</p>

<h2>The invariant</h2>
<p>Keep indices in the deque such that their values are strictly decreasing from front to back, and
all of them are inside or ahead of the current window. That single sentence justifies every line:</p>
<pre><code>function windowMax(nums, k) {
  const out = [], dq = [];                    // dq holds indices
  for (let i = 0; i &lt; nums.length; i++) {
    while (dq.length &amp;&amp; nums[dq[dq.length - 1]] &lt; nums[i]) dq.pop();   // dominated
    dq.push(i);
    if (dq[0] &lt;= i - k) dq.shift();                                    // expired
    if (i &gt;= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}
</code></pre>
<p>An index is dropped from the back when a newer, larger value arrives, because it can never be the
maximum again: any future window containing it also contains the newer value. It is dropped from the
front when it falls out of the window. Nothing else can ever be removed, and that is the whole
proof.</p>

<h2>Ties matter</h2>
<p>Pop the back only while it is strictly smaller. Popping on equality also produces the right maxima
here, but it discards duplicates that would still be valid later, and in the variant where you must
report the index of the maximum, or count how many windows a given position wins, the two rules give
different answers. Choose deliberately.</p>

<h2>Cost</h2>
<p>O(n) time and O(k) space. Note the space bound: the deque never holds more than k indices, which is
what makes this usable on a stream far larger than memory. Say the space bound out loud, because on
streaming questions it is often the point of the exercise.</p>

<h2>Where else the deque shows up</h2>
<ul>
  <li><strong>0-1 BFS</strong>, where edges of weight zero go on the front and weight one on the back, giving Dijkstra's answer without a priority queue.</li>
  <li><strong>Sliding-window minimum in dynamic programming</strong>, where a transition takes the best value in a bounded range of earlier states and the deque removes a factor of k.</li>
  <li><strong>Undo and redo stacks with a bounded history</strong>, where the oldest entry must be discarded from the far end.</li>
</ul>
`,
      Advanced: `
<p>Two refinements make the difference between knowing the trick and being able to build on it.</p>

<h2>The deque is an implicit upper convex sequence</h2>
<p>The contents at any moment are exactly the suffix maxima of the current window: the elements that
are larger than everything after them. That is why the front is the maximum and why the structure has
a self-correcting quality when the window advances. It also tells you what happens to memory in the
adversarial case: a strictly decreasing stream keeps k indices resident, so the O(k) bound is tight
and not merely a worst-case courtesy.</p>

<h2>Non-invertible aggregates in general: the two-stack queue</h2>
<p>The deque solution is specific to maximum. The general construction for any associative but
non-invertible operator is a queue built from two stacks, each element stored alongside the aggregate
of everything beneath it in its stack. Push onto the back stack; when the front stack empties, move
everything across, recomputing aggregates as you go. Every element moves at most once, so each
operation is amortised O(1), and the query is one combination of the two stack tops. This is the
sliding-window aggregation used in stream processors, and it handles minimum, maximum, gcd, matrix
product and any monoid at all, which the monotonic deque does not.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Storing values instead of indices.</strong> Expiry then requires searching, and with duplicates you cannot tell which occurrence has left the window.</li>
  <li><strong>Expiring before pushing.</strong> Harmless in most orderings, but combined with an empty deque and an off-by-one on the window bound it produces a read of undefined at the front.</li>
  <li><strong>Using shift on a JavaScript array in a hot loop.</strong> Array.prototype.shift is O(n) on a large array in the worst case; for the window-max code the deque length is bounded by k, so it is acceptable, but on a deque holding hundreds of thousands of entries you need a head index into a ring buffer instead. This is the exact spot where a correct algorithm becomes quadratic through the choice of container.</li>
  <li><strong>Reporting before the first full window.</strong> The output has n - k + 1 entries, not n, and getting that wrong is the most common test failure on this problem.</li>
</ul>

<h2>The streaming version</h2>
<p>With an unbounded stream, the array cannot be indexed, so the deque holds (value, sequenceNumber)
pairs and expiry compares sequence numbers against a monotonically increasing counter. Memory stays
O(k) and the algorithm is unchanged, which is exactly the property that makes it the standard answer
in a real-time system rather than only in an interview.</p>
`,
      Expert: `
<p>The window-maximum problem has a lower bound of n - k + 1 outputs and each output can differ from
the last, so linear time is optimal in the comparison model. What is interesting is the comparison
count: the deque performs at most 2n comparisons, and there is a classical result showing that roughly
n log k comparisons are necessary if the algorithm must also report a certificate of optimality for
each window, which is a reminder that "linear time" and "optimal number of comparisons" are separate
claims.</p>

<h2>Relationship to the Cartesian tree and to range-minimum queries</h2>
<p>Both the monotonic stack of the previous topic and the monotonic deque here are online traversals
of the same object: the Cartesian tree of the sequence. The stack maintains the right spine of a
growing prefix; the deque maintains the left-to-right maxima of a bounded suffix. Once that is seen,
the offline alternative becomes obvious: build a sparse table for range maxima in O(n log n) and answer
each window in O(1). The deque wins on space and on the streaming constraint, the sparse table wins
when the query ranges are arbitrary rather than sliding, and stating that trade-off is the
distinguishing answer in a senior interview.</p>

<h2>Concurrency and the real cost model</h2>
<p>A production sliding-window maximum over a partitioned stream is not one deque but one per key, and
the dominant cost stops being comparisons and becomes memory per key and the eviction of idle keys.
Work-stealing deques, the other famous use of the structure, exploit the fact that the owner pushes and
pops at one end while thieves steal from the other, which is what allows a lock-free implementation
with a single compare-and-swap on the stealing side only. The data structure is the same; the reason
for choosing it is entirely different.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Use a deque because it is faster than a heap."</strong> The real reason is that a heap cannot expire by position without either a side index or lazy deletion, and lazy deletion has unbounded memory if the window is small relative to the stream.</li>
  <li><strong>"Deque means linked list."</strong> A doubly linked list is the textbook picture and the wrong implementation: a ring buffer over a contiguous array has the same asymptotics and vastly better cache behaviour, which is what every standard library actually ships.</li>
  <li><strong>"The window maximum needs the whole array."</strong> It needs O(k) memory, which is the entire point on a stream, and the array-based signature used in interview questions obscures it.</li>
  <li><strong>"Popping on equality is a micro-optimisation."</strong> It changes which index is reported as the argmax and therefore changes the answer to any variant that asks where, rather than what.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Maximum of every window",
        difficulty: "Hard",
        statement: `
<p>Given an array <code>nums</code> and a window width <code>k</code>, return an array holding the
maximum of every contiguous window of that width, left to right. If <code>k</code> is not positive or
is wider than the array, return an empty array.</p>
<pre>nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3  ->  [3, 3, 5, 5, 6, 7]</pre>
<p>The output has <code>n - k + 1</code> entries. A running maximum does not work, because when the
window advances past the current maximum there is nothing to fall back to. Keep a deque of indices
whose values decrease from front to back: drop entries at the back that the new value dominates, and
drop the front once it has aged out of the window.</p>`,
        fn: "slidingWindowMax",
        params: "nums, k",
        tests: [
          { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], label: "basic" },
          { args: [[9, 8, 7], 2], expected: [9, 8], label: "decreasing input" },
          { args: [[7, 7, 7], 2], expected: [7, 7], label: "duplicates" },
          { args: [[1], 1], expected: [1], label: "single element" },
          { args: [[1, 2], 5], expected: [], label: "window wider than the array" },
          { args: [[], 3], expected: [], label: "empty input", hidden: true },
          { args: [[4, -2, -3, 1], 4], expected: [4], label: "window is the whole array", hidden: true },
        ],
        hints: [
          "Store indices in the deque, not values. You need the position to know when an entry has left the window.",
          "When a new value arrives, any smaller value already waiting at the back can never be a maximum again. Why?",
          "Pop the back while its value is strictly smaller than the new one, push the new index, discard the front if it is at or before i - k, then record nums at the front once i has reached k - 1.",
        ],
        solution: `function slidingWindowMax(nums, k) {
  const n = nums.length;
  if (typeof k !== "number" || k <= 0 || k > n) return [];
  const out = [];
  const dq = [];
  for (let i = 0; i < n; i++) {
    while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] <= i - k) dq.shift();
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
        skills: ["Monotonic deque", "Index-based eviction", "Amortised constant per element"],
      },
      {
        n: 2,
        title: "First negative reading in each window",
        difficulty: "Medium",
        statement: `
<p>Given an array <code>nums</code> and a window width <code>k</code>, return an array holding, for
each window, the <strong>first</strong> negative value inside it, or <code>0</code> when the window
contains none. Return an empty array if no window of that width exists.</p>
<pre>nums = [12, -1, -7, 8, -15, 30, 16, 28], k = 3
->  [-1, -1, -7, -15, -15, 0]</pre>
<p>This one needs no monotonic ordering, only a queue of the positions of the negative values in
arrival order, with expiry from the front. It is worth writing because it isolates the eviction half
of the previous problem from the domination half.</p>`,
        fn: "firstNegativeInWindow",
        params: "nums, k",
        tests: [
          {
            args: [[12, -1, -7, 8, -15, 30, 16, 28], 3],
            expected: [-1, -1, -7, -15, -15, 0],
            label: "basic",
          },
          { args: [[1, 2, 3], 2], expected: [0, 0], label: "no negatives at all" },
          { args: [[-1, -2, -3], 2], expected: [-1, -2], label: "all negative" },
          { args: [[-1], 1], expected: [-1], label: "single element" },
          { args: [[1, 2], 5], expected: [], label: "window wider than the array" },
          { args: [[], 2], expected: [], label: "empty input", hidden: true },
        ],
        hints: [
          "Only the negative values are candidates, so only their positions need to be remembered.",
          "The answer for a window is the oldest surviving candidate, which is the front of the queue.",
          "Push i when nums[i] is negative, drop the front while it is at or before i - k, and once i reaches k - 1 emit either the value at the front or 0 when the queue is empty.",
        ],
        solution: `function firstNegativeInWindow(nums, k) {
  const n = nums.length;
  if (typeof k !== "number" || k <= 0 || k > n) return [];
  const out = [];
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] < 0) queue.push(i);
    while (queue.length && queue[0] <= i - k) queue.shift();
    if (i >= k - 1) out.push(queue.length ? nums[queue[0]] : 0);
  }
  return out;
}`,
        skills: ["Double-ended queue", "Index-based eviction", "Streaming constraints"],
      },
    ],
  },

  5044: {
    topicId: 5044,
    title: "DFS and BFS as one idea",
    summary:
      "Write one traversal and change a single line to switch between depth-first and breadth-first, then use " +
      "the difference to decide which one a question actually needs.",
    concepts: [
      "Frontier structure",
      "Visited set",
      "Traversal order",
      "Recursion versus explicit stack",
      "Connected components",
    ],
    glossary: {
      Frontier:
        "The collection of discovered but not yet expanded nodes. Making it a stack gives depth-first order, making it a queue gives breadth-first.",
      "Visited set":
        "The record of nodes already discovered, which is what stops a traversal from looping forever on a cyclic graph.",
      "Grey and black":
        "The three-colour scheme: white for undiscovered, grey for on the current path, black for finished. Only the grey set detects a cycle in a directed graph.",
      "Connected component":
        "A maximal set of nodes reachable from one another, found by running a traversal from every node not yet visited.",
      "Flood fill": "Traversal over a grid, where the neighbours of a cell are its four or eight touching cells.",
      "Recursion depth":
        "The number of live stack frames, which is bounded by the length of the longest path and is what makes deep depth-first search crash rather than merely run slowly.",
      "Discovery order":
        "The sequence in which nodes are first reached, which for breadth-first search is also the order of increasing distance from the start.",
    },
    body: {
      Beginner: `
<p>Exploring a maze, a family tree or a network of friends is the same job every time: keep a list of
places you know about but have not looked at yet, take one out, and add its neighbours.</p>

<h2>The only difference</h2>
<p>If you always take the <strong>most recently added</strong> place, you charge down one path as far
as it goes before backing up. That is depth-first. If you always take the <strong>oldest</strong>
one, you explore everything one step away, then everything two steps away. That is breadth-first.</p>

<p>Same code, different container. A stack for depth-first, a queue for breadth-first.</p>

<h2>Remembering where you have been</h2>
<p>Without a record of visited places you will walk in circles forever, because a path back to
somewhere you started from looks exactly like a new place to visit. Mark a place as visited the moment
you add it to the list, not when you take it out, or the same place gets added several times before
you get round to it.</p>

<pre><code>function explore(neighbours, start) {
  const seen = new Set([start]);
  const frontier = [start];
  const order = [];
  while (frontier.length) {
    const node = frontier.pop();     // shift() instead, for breadth-first
    order.push(node);
    for (const next of neighbours[node]) {
      if (!seen.has(next)) { seen.add(next); frontier.push(next); }
    }
  }
  return order;
}
</code></pre>

<h2>Which one to use</h2>
<p>If the question asks "is there a path" or "how many separate groups are there", either works. If it
asks for the <em>shortest</em> number of steps, you need breadth-first, because it reaches everything
one step away before anything two steps away.</p>

<aside class="tip">Counting islands on a grid, filling a region of colour, and finding groups of
friends are all the same traversal with the neighbours defined differently.</aside>
`,
      Intermediate: `
<p>The reason to learn these together is that they differ in exactly one place. Everything else,
including the bugs, is shared.</p>

<h2>One template</h2>
<pre><code>function traverse(adj, start, mode) {
  const seen = new Set([start]);
  const frontier = [start];
  const order = [];
  while (frontier.length) {
    const node = mode === "dfs" ? frontier.pop() : frontier.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (!seen.has(next)) { seen.add(next); frontier.push(next); }
    }
  }
  return order;
}
</code></pre>
<p>Both are O(V + E): every node enters the frontier once and every edge is examined once from each of
its endpoints. Space is O(V) for the visited set plus the frontier, which for breadth-first search can
hold an entire level and, on a wide graph, is far larger than the depth-first stack.</p>

<h2>Mark on push, not on pop</h2>
<p>The single most common defect is marking a node visited when it is removed from the frontier. On a
graph where several nodes point at the same neighbour, that neighbour is pushed multiple times before
it is ever popped, and the traversal degrades from linear to something much worse while still
producing the right answer. Marking on push keeps the invariant that a node appears in the frontier at
most once.</p>

<h2>Recursion is depth-first with a hidden stack</h2>
<p>A recursive traversal is the same algorithm using the call stack as the frontier. It reads better
and it has a hard limit: JavaScript engines allow roughly ten thousand frames, so a path-shaped graph
of a hundred thousand nodes overflows. Recursive code is the right choice for trees of bounded depth
and for anything where post-order work is needed, because doing work on the way back up is awkward
with an explicit stack. Iterative code is the right choice when depth is unbounded.</p>

<h2>What each one buys you</h2>
<ul>
  <li><strong>Breadth-first</strong> gives shortest paths on unweighted graphs, level-by-level processing, and the earliest possible answer when the target is near the start.</li>
  <li><strong>Depth-first</strong> gives finish times, which is what topological order and cycle detection are built from, and it naturally computes properties of whole subtrees on the way back up.</li>
</ul>

<h2>Components and the outer loop</h2>
<p>A single traversal only reaches one component. Counting components, colouring a bipartite graph or
finding islands all need an outer loop over every node, starting a fresh traversal from each node not
yet seen. Forgetting the outer loop is the reason a solution passes the connected example and fails
the real test.</p>
`,
      Advanced: `
<p>The template hides three decisions that matter once the graph is not a toy.</p>

<h2>Implicit graphs</h2>
<p>Most interview graphs are never built. A grid's neighbours are computed from coordinates; a word
ladder's neighbours are the words one letter away; a puzzle state's neighbours are its legal moves.
Materialising the adjacency list of an implicit graph is usually the wrong move, because the graph can
be exponentially large while the reachable part is small. Generate neighbours lazily and key the
visited set on a canonical encoding of the state, which is the same key-design problem as in the
hashing topic and has the same failure mode: two encodings for one logical state means the search
never terminates.</p>

<h2>Multi-source and bidirectional search</h2>
<p>Seeding the queue with every source at distance zero computes, in one pass, the distance from each
node to its nearest source. That single trick solves rotting oranges, nearest-exit and distance-to-water
problems that look much harder one source at a time. Bidirectional breadth-first search runs a frontier
from each end and stops when they touch, cutting the explored volume from b^d to roughly 2 * b^(d/2),
which is the difference between feasible and not on large state spaces. Its correctness condition is
that the meeting check happens on generation rather than on expansion, or the reported distance can be
one too large.</p>

<h2>Depth-first without recursion, correctly</h2>
<p>Converting a recursive depth-first search into an explicit stack is not simply swapping the
container, because post-order work has nowhere to go. The standard technique pushes a node twice, once
as a work item and once as a marker, or pushes an iterator position alongside the node so the loop can
resume where it left off. Every real implementation of iterative depth-first search with post-order
processing does one of those two things, and getting it wrong produces a traversal that is correct in
order but computes subtree aggregates from incomplete children.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>shift on a large array.</strong> Using an array as a queue with shift is O(n) per removal in the worst case; use a head index that advances, and never truncate the array.</li>
  <li><strong>Visited keyed on the wrong thing.</strong> On a grid, marking coordinates visited is right; marking values visited merges unrelated cells.</li>
  <li><strong>Mutating the input to mark visits.</strong> Fast and memory-free, and it destroys the caller's data. Acceptable only when the contract says so.</li>
  <li><strong>Assuming breadth-first gives shortest paths with weights.</strong> It does not, once edges have differing costs, and the fix is the next topic but one.</li>
</ul>
`,
      Expert: `
<p>Depth-first and breadth-first are the two extreme instantiations of a single generic search whose
only parameter is the frontier's removal policy. Replace the stack or queue with a priority queue
ordered by accumulated cost and you have Dijkstra; order by cost plus an admissible heuristic and you
have A star; order by depth with an iterative bound and you have iterative deepening. Seeing the
family as one algorithm is what lets you answer a question about an unfamiliar variant.</p>

<h2>What depth-first knows that breadth-first does not</h2>
<p>Depth-first search induces a classification of every edge into tree, back, forward and cross edges,
and that classification is the foundation of a surprising amount of graph theory. A back edge exists if
and only if the graph has a cycle. Finish times in reverse order are a topological sort. Low-link
values computed during the same traversal give articulation points, bridges and, with a stack of active
nodes, Tarjan's strongly connected components in a single pass. Breadth-first search offers no
analogue: its layer structure gives distances and bipartiteness and nothing about the cycle structure.</p>

<h2>Memory is the real constraint at scale</h2>
<p>On a graph with branching factor b and solution depth d, breadth-first search holds O(b^d) nodes in
the frontier, which is why it is unusable on large state spaces despite being optimal. Iterative
deepening depth-first search re-runs a depth-limited search with increasing bounds and holds only
O(d) nodes; the repeated work is a constant factor because the last level dominates the sum of all
previous levels. That trade, time for space, is the standard answer to "your breadth-first search runs
out of memory" and it is almost never mentioned in interview preparation material.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"DFS uses less memory than BFS."</strong> Only in the frontier, and only on shallow wide graphs. On a path-shaped graph the depth-first stack holds every node, and it is held on the call stack where the limit is thousands rather than millions.</li>
  <li><strong>"Mark visited when you pop."</strong> Common in tutorials that only test trees, where it is harmless because there are no alternative routes to a node.</li>
  <li><strong>"BFS finds the shortest path."</strong> It finds a path with the fewest edges. On a weighted graph that is frequently not the cheapest one, and the distinction is exactly what the shortest-path topic in this course is about.</li>
  <li><strong>"Recursion is elegant, use it."</strong> A production traversal over user-supplied data is a stack-overflow denial of service waiting to happen, and the fix is an explicit stack rather than a larger limit.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Count the regions in a grid",
        difficulty: "Medium",
        statement: `
<p>You are given a rectangular <code>grid</code> of ones and zeroes. A region is a group of ones
connected horizontally or vertically, not diagonally. Return the number of regions.</p>
<pre>[[1, 1, 0],
 [0, 1, 0],     ->  2
 [0, 0, 1]]</pre>
<p>Walk every cell. When you find a one that has not been claimed, that is a new region: flood it,
claiming every connected one, so it is never counted again. You may modify the grid you are given.</p>`,
        fn: "countRegions",
        params: "grid",
        tests: [
          { args: [[[1, 1, 0], [0, 1, 0], [0, 0, 1]]], expected: 2, label: "basic" },
          { args: [[[0, 0], [0, 0]]], expected: 0, label: "no regions" },
          { args: [[[1, 1], [1, 1]]], expected: 1, label: "one solid block" },
          { args: [[[1, 0], [0, 1]]], expected: 2, label: "diagonals are not connected" },
          { args: [[[1]]], expected: 1, label: "single cell" },
          { args: [[]], expected: 0, label: "empty grid", hidden: true },
        ],
        hints: [
          "The outer loop finds a starting point for each region. The inner traversal consumes the whole region.",
          "Mark a cell as claimed the moment you push it, not when you pop it, or it enters the frontier several times.",
          "Push the four neighbours that are inside the grid and still hold a one, setting each to zero as you push it. Use an explicit stack so a large region cannot overflow the call stack.",
        ],
        solution: `function countRegions(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;
  let regions = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1) continue;
      regions++;
      grid[r][c] = 0;
      const stack = [[r, c]];
      while (stack.length) {
        const cell = stack.pop();
        const cr = cell[0];
        const cc = cell[1];
        const moves = [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]];
        for (const m of moves) {
          const nr = m[0];
          const nc = m[1];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
          if (grid[nr][nc] !== 1) continue;
          grid[nr][nc] = 0;
          stack.push([nr, nc]);
        }
      }
    }
  }
  return regions;
}`,
        skills: ["Connected components", "Visited set", "Frontier structure"],
      },
      {
        n: 2,
        title: "Breadth-first visit order",
        difficulty: "Easy",
        statement: `
<p>A graph is given as an adjacency list: <code>adj[i]</code> is the array of nodes reachable in one
step from node <code>i</code>. Return the order in which breadth-first search from <code>start</code>
first reaches each node, exploring each node's neighbours in the order they appear.</p>
<pre>adj = [[1, 2], [0, 3], [0], [1]], start = 0  ->  [0, 1, 2, 3]
adj = [[1], [0], [3], [2]],       start = 2  ->  [2, 3]        the other component is unreachable</pre>
<p>Return an empty array if <code>start</code> is not a node of the graph. Mark a node as seen when
you enqueue it, not when you dequeue it.</p>`,
        fn: "bfsOrder",
        params: "adj, start",
        tests: [
          { args: [[[1, 2], [0, 3], [0], [1]], 0], expected: [0, 1, 2, 3], label: "basic" },
          { args: [[[1], [0], [3], [2]], 2], expected: [2, 3], label: "disconnected components" },
          { args: [[[1], [2], [0]], 1], expected: [1, 2, 0], label: "cycle" },
          { args: [[[]], 0], expected: [0], label: "single node, no edges" },
          { args: [[], 0], expected: [], label: "empty graph" },
          { args: [[[1, 2], [2], [0]], 0], expected: [0, 1, 2], label: "duplicate discovery", hidden: true },
        ],
        hints: [
          "The only difference from depth-first search is which end of the frontier you take from.",
          "Use an index that advances through the array rather than removing from the front, so the queue stays cheap.",
          "Seed the seen set with start, then for each dequeued node enqueue every neighbour that is not already seen, marking it seen at that moment.",
        ],
        solution: `function bfsOrder(adj, start) {
  if (!Array.isArray(adj) || start < 0 || start >= adj.length) return [];
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    order.push(node);
    for (const next of adj[node]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}`,
        skills: ["Traversal order", "Frontier structure", "Visited set"],
      },
    ],
  },

  5045: {
    topicId: 5045,
    title: "Binary search trees and balance",
    summary:
      "Understand the ordering property that makes a search tree fast, why it degenerates to a linked list, " +
      "and what a balancing scheme actually promises.",
    concepts: [
      "BST ordering property",
      "In-order traversal",
      "Bounds propagation",
      "Height and balance",
      "Rotation",
    ],
    glossary: {
      "BST property":
        "Every value in a node's left subtree is smaller than the node, and every value in its right subtree is larger. It applies to whole subtrees, not just to immediate children.",
      "In-order traversal":
        "Visiting left subtree, node, then right subtree, which emits a binary search tree's values in sorted order.",
      "Bounds propagation":
        "Validating a tree by carrying an allowed open interval down each branch and narrowing it at every step.",
      Height: "The number of edges on the longest path from a node down to a leaf.",
      "Balance factor": "The difference in height between a node's two subtrees, kept small by a balancing scheme.",
      Rotation:
        "A local rearrangement of three nodes that changes height while preserving the in-order sequence.",
      Degenerate:
        "A tree that has become a chain, which happens when sorted data is inserted into an unbalanced tree and makes every operation linear.",
    },
    body: {
      Beginner: `
<p>A binary search tree stores values so that finding one is like looking up a word in a dictionary:
you open in the middle and immediately discard half the book.</p>

<h2>The rule</h2>
<p>Each node holds a value, and has up to two children. Everything smaller goes to the left, everything
larger goes to the right. To find a value you start at the top and, at each node, go left if your value
is smaller and right if it is larger. Each step throws away a whole branch.</p>

<pre><code>function contains(node, target) {
  while (node) {
    if (node.value === target) return true;
    node = target &lt; node.value ? node.left : node.right;
  }
  return false;
}
</code></pre>

<h2>The catch</h2>
<p>That is only fast if the tree is bushy. Insert 1, then 2, then 3, then 4 into an ordinary search
tree and every value goes to the right of the last one. You have built a chain, and searching a chain
means looking at every link. The structure has quietly become a list.</p>

<h2>Sorted order for free</h2>
<p>Visit the left child, then the node, then the right child, all the way down, and the values come out
in sorted order. This is called an in-order walk, and it is the quickest way to check by hand whether
a tree really obeys the rule.</p>

<h2>Balance</h2>
<p>A balanced tree is one where no branch is much deeper than its sibling. Self-balancing trees do a
small local rearrangement after each insertion to keep it that way, so the depth stays around the
logarithm of the number of values: about twenty steps for a million values instead of a million.</p>

<aside class="tip">A search tree is only worth using over a hash map when you need order: sorted
listing, next-largest queries, or range scans. For plain lookup by key, the map wins.</aside>
`,
      Intermediate: `
<p>The property that makes a search tree work is stated about subtrees, not about parents, and almost
every bug in this area comes from forgetting that.</p>

<h2>Validating a tree correctly</h2>
<p>Checking only that each node is between its two children accepts trees that are clearly wrong: a
node of value 6 sitting as the right child of 3, which is itself the left child of 5, satisfies every
local check and violates the tree, because 6 is in the left subtree of 5. The correct check carries an
allowed interval down each branch:</p>
<pre><code>function valid(node, low, high) {
  if (node === null) return true;
  if (low !== null &amp;&amp; node.value &lt;= low) return false;
  if (high !== null &amp;&amp; node.value &gt;= high) return false;
  return valid(node.left, low, node.value)
      &amp;&amp; valid(node.right, node.value, high);
}
</code></pre>
<p>Going left narrows the upper bound to the current value; going right narrows the lower bound. Using
null for "no bound" avoids relying on a sentinel that a real value might reach.</p>

<h2>The alternative check, and its trap</h2>
<p>An in-order traversal of a valid tree is strictly increasing, so tracking the previously emitted
value and asserting it is smaller works too, in O(n) time and O(h) space. The trap is that the previous
value has to be threaded through the recursion as state, and a naive implementation that resets it per
subtree passes on every small test and fails on trees where the violation crosses a subtree boundary.</p>

<h2>Height, depth and the cost of everything</h2>
<p>Search, insert and delete are all O(h) where h is the height. For a balanced tree h is O(log n); for
a degenerate one h is n. Since sorted or nearly sorted insertions are the common case in practice,
degeneration is the default outcome rather than an unlucky one, which is why the standard library trees
in every language are self-balancing.</p>

<h2>What rotations do</h2>
<p>A rotation reorders three nodes and their subtrees so that the in-order sequence is unchanged while
the height changes. That invariance is the whole point: it is a rearrangement that no observer of the
sorted output can detect. AVL trees rotate to keep every node's balance factor within one, giving
tighter height and faster lookups; red-black trees allow a looser bound, roughly twice the minimum
height, in exchange for fewer rotations per update. Neither promises a perfect tree, and neither needs
to.</p>

<h2>Deletion is the hard operation</h2>
<p>Removing a node with two children means replacing it with its in-order predecessor or successor,
which is the rightmost node of the left subtree or the leftmost of the right. That successor has at
most one child, so the problem reduces to an easy case. Interviewers ask for deletion precisely because
it is where candidates who have memorised insertion run out of road.</p>
`,
      Advanced: `
<p>Beyond the mechanics, three things decide whether a tree is the right structure at all.</p>

<h2>Order statistics and range queries</h2>
<p>Augment each node with the size of its subtree and the tree answers "what is the kth smallest" and
"how many values are below x" in O(h). The augmentation must be maintained by every rotation, which is
the general rule for augmented trees: any field that summarises a subtree can be maintained in O(1) per
rotation provided it is computable from the node and its two children. Subtree size, subtree sum and
subtree maximum all qualify. A field that depends on ancestors does not, which is why "depth of this
node" cannot be stored this way.</p>

<h2>Balance schemes and what each actually guarantees</h2>
<ul>
  <li><strong>AVL</strong>: height at most about 1.44 log n, more rotations on update, best when reads dominate.</li>
  <li><strong>Red-black</strong>: height at most 2 log n, at most three rotations per insertion and a constant amortised number per deletion, which is why it backs most standard library maps.</li>
  <li><strong>Treap and skip list</strong>: expected O(log n) with randomisation, far simpler code, no worst-case guarantee but no adversary either unless the random source is predictable.</li>
  <li><strong>Splay</strong>: no height bound at all, only an amortised O(log n) with excellent locality for skewed access patterns, and a fatal flaw for concurrency because a read mutates the tree.</li>
</ul>

<h2>Failure modes</h2>
<ul>
  <li><strong>Duplicates.</strong> The property is usually stated strictly, so equal values need an explicit policy: reject, keep a count on the node, or send them consistently to one side. Silently allowing them on both sides makes deletion ambiguous and validation impossible.</li>
  <li><strong>Recursion depth on a degenerate tree.</strong> A recursive validator on a chain of a hundred thousand nodes overflows before it finds anything wrong, so a validator that is meant to run on untrusted input has to be iterative.</li>
  <li><strong>Comparator inconsistency.</strong> If the comparison is not a strict weak ordering, for example a floating-point comparator that can encounter NaN, the tree's structure becomes undefined and lookups fail for values that were definitely inserted.</li>
  <li><strong>Mutating a key in place.</strong> Changing a stored key after insertion silently violates the ordering for every ancestor, and the value becomes unreachable while still occupying memory.</li>
</ul>
`,
      Expert: `
<p>Binary search trees are the one-dimensional case of a general idea, and the interesting statements
are about lower bounds and about memory hierarchy rather than about rotations.</p>

<h2>The dynamic optimality question</h2>
<p>Splay trees are conjectured to be dynamically optimal: within a constant factor of the best possible
offline binary search tree for any access sequence. The conjecture is open, and Tango trees achieve
O(log log n) competitiveness, which is the best known. This matters practically because it frames
self-adjustment as an alternative to balance rather than a variant of it, and because the working-set
and dynamic-finger bounds that splay trees do provably satisfy explain the observed performance on
skewed workloads better than any average-case argument.</p>

<h2>Why databases do not use binary trees</h2>
<p>A binary node holds one key, so a search of a billion keys touches thirty nodes, and on disk or even
on a cold cache every one of them is a separate transfer of a whole block. B-trees fan out to hundreds
of keys per node so that the same search touches three or four blocks. The asymptotics are identical in
the comparison model and the constant is the entire engineering story, which is the clearest example in
this course of the point made in the complexity topic: the cost model has to match the machine.</p>

<h2>Concurrency changes the design</h2>
<p>Rotations touch several nodes and invalidate ancestors, so a lock-based balanced tree serialises
updates near the root. The practical answers are lock-free skip lists, which have no rotations at all
and localise updates to a single level, or copy-on-write persistent trees where an update rebuilds the
O(log n) nodes on the path and publishes a new root with one atomic write, giving readers a consistent
snapshot at no cost. That structural sharing is the same idea behind persistent data structures in
functional languages, and it is why immutable maps can be practical rather than merely elegant.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"A BST gives O(log n) lookup."</strong> A <em>balanced</em> one does. A plain one gives O(n) on sorted input, which is the most likely input in practice.</li>
  <li><strong>"Red-black trees are balanced."</strong> They are height-bounded, which is weaker. The longest path may be twice the shortest, and that is by design.</li>
  <li><strong>"In-order traversal needs O(n) extra space."</strong> Morris traversal runs in O(1) auxiliary space by temporarily threading right pointers to the in-order successor and undoing them on the way back, which is worth knowing precisely because it demonstrates that the recursion is not fundamental.</li>
  <li><strong>"Validate by checking node against its children."</strong> The single most repeated wrong answer in the topic, and the reason the bounds-propagation formulation is worth writing from memory.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Is this a valid binary search tree",
        difficulty: "Medium",
        statement: `
<p>A tree node is a plain object <code>{ value, left, right }</code>, where an absent child is
<code>null</code>. Return <code>true</code> when the tree is a valid binary search tree.</p>
<ul>
  <li>Every value in a node's left subtree must be strictly smaller than the node's value.</li>
  <li>Every value in its right subtree must be strictly larger.</li>
  <li>An empty tree is valid. Duplicate values make a tree invalid.</li>
</ul>
<pre>      5              5
     / \\            / \\
    3   8   valid  3   8   invalid: 6 is in the left subtree of 5
                    \\
                     6</pre>
<p>Comparing each node only with its immediate children is not enough. Carry the permitted range down
each branch.</p>`,
        fn: "isValidBst",
        params: "root",
        tests: [
          {
            args: [{ value: 5, left: { value: 3, left: null, right: null }, right: { value: 8, left: null, right: null } }],
            expected: true,
            label: "basic valid tree",
          },
          {
            args: [
              {
                value: 5,
                left: { value: 3, left: null, right: { value: 6, left: null, right: null } },
                right: { value: 8, left: null, right: null },
              },
            ],
            expected: false,
            label: "violation across a subtree boundary",
          },
          { args: [null], expected: true, label: "empty tree" },
          { args: [{ value: 1, left: null, right: null }], expected: true, label: "single node" },
          {
            args: [{ value: 5, left: { value: 5, left: null, right: null }, right: null }],
            expected: false,
            label: "duplicate value",
          },
          {
            args: [
              {
                value: 10,
                left: null,
                right: { value: 15, left: { value: 6, left: null, right: null }, right: null },
              },
            ],
            expected: false,
            label: "violation in the right subtree",
            hidden: true,
          },
        ],
        hints: [
          "A node can satisfy its parent and still break the tree. Which ancestor does the failing node violate?",
          "Every node has an allowed open interval, decided by the ancestors above it.",
          "Recurse with a low and a high bound, using null for no bound. Going left replaces the high bound with the current value, going right replaces the low bound.",
        ],
        solution: `function isValidBst(root) {
  function check(node, low, high) {
    if (node === null || node === undefined) return true;
    if (low !== null && node.value <= low) return false;
    if (high !== null && node.value >= high) return false;
    return check(node.left, low, node.value) && check(node.right, node.value, high);
  }
  return check(root, null, null);
}`,
        skills: ["BST ordering property", "Bounds propagation", "In-order traversal"],
      },
      {
        n: 2,
        title: "Is this tree height balanced",
        difficulty: "Medium",
        statement: `
<p>Using the same node shape <code>{ value, left, right }</code>, return <code>true</code> when
<strong>every</strong> node in the tree has left and right subtree heights differing by at most one.
An empty tree is balanced, and the height of an empty subtree is zero.</p>
<pre>    2          3
   / \\        /
  1   3      2      balanced on the left, not on the right
            /
           1</pre>
<p>Computing the height separately for every node is O(n * n) on a skewed tree. Compute the height once
per node on the way back up, and use an impossible height value to signal that a violation has already
been found.</p>`,
        fn: "isHeightBalanced",
        params: "root",
        tests: [
          {
            args: [{ value: 2, left: { value: 1, left: null, right: null }, right: { value: 3, left: null, right: null } }],
            expected: true,
            label: "balanced",
          },
          {
            args: [
              { value: 3, left: { value: 2, left: { value: 1, left: null, right: null }, right: null }, right: null },
            ],
            expected: false,
            label: "left chain of three",
          },
          { args: [null], expected: true, label: "empty tree" },
          { args: [{ value: 1, left: null, right: null }], expected: true, label: "single node" },
          {
            args: [
              {
                value: 5,
                left: { value: 3, left: { value: 1, left: null, right: null }, right: null },
                right: { value: 8, left: null, right: null },
              },
            ],
            expected: true,
            label: "difference of exactly one",
            hidden: true,
          },
          {
            args: [
              {
                value: 1,
                left: {
                  value: 2,
                  left: { value: 4, left: { value: 8, left: null, right: null }, right: null },
                  right: null,
                },
                right: { value: 3, left: null, right: null },
              },
            ],
            expected: false,
            label: "imbalance deep in the tree",
            hidden: true,
          },
        ],
        hints: [
          "The check is about every node, not only the root. A balanced root can sit above an unbalanced child.",
          "One traversal should return both the height and whether anything below has already failed.",
          "Return -1 from the height helper to mean unbalanced, propagate it upward immediately, and otherwise return one plus the larger child height.",
        ],
        solution: `function isHeightBalanced(root) {
  function height(node) {
    if (node === null || node === undefined) return 0;
    const l = height(node.left);
    if (l === -1) return -1;
    const r = height(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return (l > r ? l : r) + 1;
  }
  return height(root) !== -1;
}`,
        skills: ["Height and balance", "In-order traversal", "BST ordering property"],
      },
    ],
  },

  5046: {
    topicId: 5046,
    title: "Topological sort and cycle detection",
    summary:
      "Turn a pile of dependencies into a runnable order, and detect the case where no order exists, using the " +
      "same single pass.",
    concepts: [
      "Directed acyclic graph",
      "In-degree",
      "Kahn's algorithm",
      "Cycle detection",
      "Deterministic tie-breaking",
    ],
    glossary: {
      "Topological order":
        "An ordering of the nodes in which every edge points forwards, so no task appears before something it depends on.",
      "Directed acyclic graph":
        "A directed graph with no cycles, which is exactly the condition under which a topological order exists.",
      "In-degree": "The number of edges pointing into a node, that is, how many unmet prerequisites it still has.",
      "Kahn's algorithm":
        "Repeatedly take a node with no remaining prerequisites, output it, and reduce the in-degree of its dependents.",
      "Back edge":
        "An edge from a node to one currently on the recursion stack, which is the depth-first signal that a cycle exists.",
      "Deterministic tie-breaking":
        "A fixed rule for choosing among several ready nodes, needed whenever the output must be reproducible.",
      "Partial order":
        "A set of constraints that leaves some pairs unordered, which is why several valid topological orders usually exist.",
    },
    body: {
      Beginner: `
<p>You have a list of tasks and some rules of the form "A must happen before B". A topological order is
any sequence of the tasks that respects every rule. Build the walls before the roof, install the
dependencies before the build.</p>

<h2>How to produce one</h2>
<p>Count, for each task, how many things must happen before it. That number is its prerequisite count.</p>
<ul>
  <li>Start with every task whose count is zero. They are ready right now.</li>
  <li>Take one, write it down, and reduce the count of everything that depended on it.</li>
  <li>Anything whose count reaches zero becomes ready.</li>
  <li>Repeat until you run out.</li>
</ul>

<h2>When there is no answer</h2>
<p>Sometimes you run out of ready tasks while some are still unfinished. That means the remaining tasks
depend on each other in a loop: A needs B, B needs C, C needs A. No order can satisfy that, and the
correct response is to report that no order exists rather than to output a partial one.</p>

<p>So the same procedure answers two questions at once: it produces an order, and if it cannot, it has
proved there is a cycle.</p>

<h2>More than one right answer</h2>
<p>If two tasks are both ready and neither depends on the other, either can go first. Both orders are
correct. When a test expects one specific order, the rule for choosing between ready tasks has to be
stated, for example always take the lowest-numbered one.</p>

<aside class="tip">Course prerequisites, build systems, spreadsheet recalculation and package managers
are all this exact problem wearing different names.</aside>
`,
      Intermediate: `
<p>There are two standard algorithms and they give you different things, so it is worth being able to
write both.</p>

<h2>Kahn's algorithm, breadth-first in disguise</h2>
<pre><code>// count prerequisites
const indeg = new Array(n).fill(0);
for (const [from, to] of edges) indeg[to]++;

const ready = [];
for (let v = 0; v &lt; n; v++) if (indeg[v] === 0) ready.push(v);

const order = [];
while (ready.length) {
  const v = ready.pop();          // or shift, or take the smallest
  order.push(v);
  for (const next of adj[v]) if (--indeg[next] === 0) ready.push(next);
}
return order.length === n ? order : [];   // short output means a cycle
</code></pre>
<p>The final length check is the cycle detection, and it is free. Any node still holding a positive
in-degree at the end is on, or downstream of, a cycle.</p>

<h2>Depth-first with finish times</h2>
<p>Run a depth-first search and prepend each node to the output when its recursion returns. The reverse
finishing order is a topological order, and the proof is short: a node finishes only after everything
reachable from it has finished, so it lands before them in the reversed list. Cycle detection here
needs three states rather than two: white for unvisited, grey for on the current recursion path, black
for finished. An edge to a grey node is a back edge and proves a cycle. Using only a binary visited set
reports a cycle for any diamond shape, which is a very common wrong answer.</p>

<h2>Choosing between them</h2>
<ul>
  <li>Kahn's is easier to make deterministic, naturally reports which nodes are in the cyclic part, and can produce the lexicographically smallest order if the ready set is a min-heap.</li>
  <li>Depth-first is shorter to write, gives you the actual cycle for an error message, and composes with other depth-first computations such as strongly connected components.</li>
</ul>

<h2>Cost and determinism</h2>
<p>Both are O(V + E) with a plain stack or queue. Selecting the smallest ready node each step costs
O((V + E) log V) with a heap, or O(V^2) with a linear scan, and it is worth it whenever the output is
compared against an expected sequence, because otherwise the answer depends on container order and the
test is flaky by construction.</p>
`,
      Advanced: `
<p>The interesting versions of this problem are the ones where the graph is not handed to you as a
list of edges.</p>

<h2>Deriving the edges</h2>
<p>The classic alien-dictionary question gives a list of words sorted in an unknown alphabet and asks
for that alphabet. The graph is implicit: comparing adjacent words yields one edge from the first
position at which they differ. Two traps live here. A word that is a strict prefix of the word before
it is an inconsistency rather than an edge, and it must be reported. And letters that appear in no
constraint still belong in the output, so the node set is every letter seen, not only those with
edges.</p>

<h2>Longest path and scheduling</h2>
<p>On a directed acyclic graph, relaxing edges in topological order computes longest paths in linear
time, which is impossible on a general graph. That is the basis of critical path analysis: the earliest
finish time of a project is the longest chain of dependencies, and any task on that chain delays the
whole project if it slips. The same relaxation gives shortest paths on a DAG even with negative
weights, since the ordering removes the need for Dijkstra's non-negativity assumption entirely.</p>

<h2>Counting orders, and uniqueness</h2>
<p>A topological order is unique exactly when at every step exactly one node has in-degree zero, which
is equivalent to the DAG containing a Hamiltonian path. Checking that during Kahn's algorithm costs
nothing and answers questions of the form "is the sequence fully determined by the constraints".
Counting all topological orders, by contrast, is a hard counting problem in general and is not
something to attempt in an interview.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Self-loops.</strong> An edge from a node to itself is a cycle of length one; a validator that only checks pairs of distinct nodes misses it.</li>
  <li><strong>Duplicate edges.</strong> Counting the same prerequisite twice inflates the in-degree so it never reaches zero, and the algorithm reports a cycle that does not exist. Deduplicate, or decrement once per stored edge consistently.</li>
  <li><strong>Isolated nodes.</strong> Nodes with no edges at all must still appear in the output; building the node set from the edge list drops them.</li>
  <li><strong>Recursive depth-first on a deep chain.</strong> The same stack-overflow risk as any deep traversal, and dependency graphs are frequently chains.</li>
</ul>
`,
      Expert: `
<p>Topological sorting is the constructive proof that a finite directed acyclic graph's reachability
relation extends to a total order. That framing connects it to a wider family: it is a linear extension
of a partial order, the object counted by the order polynomial and the thing every dependency resolver
is really computing.</p>

<h2>When the graph has cycles anyway</h2>
<p>Real dependency graphs contain cycles, so production systems do not simply fail. The standard
treatment is to condense the graph: compute the strongly connected components with Tarjan's or
Kosaraju's algorithm, contract each component to a single node, and topologically sort the resulting
condensation, which is acyclic by construction. Each component is then handled by a domain-specific
rule, whether that is a fixpoint iteration in a compiler's dataflow analysis, a mutual-recursion group
in a type checker, or an error naming the exact cycle in a build tool. Being able to say "condense,
then sort" is the senior answer to "what if there is a cycle".</p>

<h2>Incremental and parallel variants</h2>
<p>Build systems cannot re-sort from scratch on every edit, so they maintain the order incrementally:
inserting an edge that violates the current order triggers a bounded reordering of only the affected
interval, which is the Pearce-Kelly algorithm. On the parallel side, Kahn's algorithm is naturally a
work queue: every node in the ready set can be executed concurrently, and the completion of a task
decrements its dependents atomically. The topological order is then never materialised at all, which is
how modern build tools achieve parallelism without a scheduling pass.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Use a visited set for cycle detection."</strong> Two states are insufficient in a directed graph. A node reachable by two different paths is not a cycle, and only the grey, on-the-current-path state distinguishes them. The two-state version is correct for undirected graphs, which is where the confusion originates.</li>
  <li><strong>"The topological order is the answer."</strong> There are usually many, and any code compared against a fixed expected output must state its tie-breaking rule as part of the contract.</li>
  <li><strong>"Kahn's and DFS are interchangeable."</strong> Only for producing an order. For reporting the offending cycle, depth-first gives it directly from the recursion stack, while Kahn's leaves you with the set of nodes involved and no cycle.</li>
  <li><strong>"In-degree zero means no dependencies."</strong> It means none <em>remaining</em>. During the run, the in-degree array is mutable state whose meaning changes as nodes are emitted, and treating it as the original graph is a common source of confused debugging.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Order the tasks, or prove you cannot",
        difficulty: "Medium",
        statement: `
<p>There are <code>n</code> tasks numbered <code>0</code> to <code>n - 1</code>, and a list of
<code>edges</code> where <code>[a, b]</code> means task <code>a</code> must be done before task
<code>b</code>. Return a valid order of all tasks, or an empty array when no order exists.</p>
<p>Several orders are usually valid, so to make the answer reproducible: <strong>whenever more than
one task is ready, take the lowest-numbered one</strong>.</p>
<pre>n = 4, edges = [[0,1],[0,2],[1,3],[2,3]]  ->  [0, 1, 2, 3]
n = 2, edges = [[0,1],[1,0]]              ->  []            a cycle</pre>`,
        fn: "topoOrder",
        params: "n, edges",
        tests: [
          { args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], expected: [0, 1, 2, 3], label: "diamond" },
          { args: [2, [[0, 1], [1, 0]]], expected: [], label: "two node cycle" },
          { args: [3, []], expected: [0, 1, 2], label: "no constraints" },
          { args: [1, []], expected: [0], label: "single task" },
          {
            args: [5, [[4, 0], [4, 1], [0, 2], [1, 2], [2, 3]]],
            expected: [4, 0, 1, 2, 3],
            label: "one real root",
            hidden: true,
          },
          { args: [3, [[0, 1], [1, 2], [2, 1]]], expected: [], label: "cycle downstream of a valid start", hidden: true },
        ],
        hints: [
          "Count how many prerequisites each task still has. A task is ready when that count reaches zero.",
          "Emitting a task reduces the count of everything that depended on it, which may make more tasks ready.",
          "If at some step no task is ready but tasks remain, the rest form a cycle and you should return an empty array. To keep the output reproducible, scan for the lowest-numbered ready task each step.",
        ],
        solution: `function topoOrder(n, edges) {
  const indeg = new Array(n).fill(0);
  const adj = [];
  for (let i = 0; i < n; i++) adj.push([]);
  for (const e of edges) {
    adj[e[0]].push(e[1]);
    indeg[e[1]]++;
  }
  const done = new Array(n).fill(false);
  const out = [];
  for (let step = 0; step < n; step++) {
    let pick = -1;
    for (let v = 0; v < n; v++) {
      if (!done[v] && indeg[v] === 0) { pick = v; break; }
    }
    if (pick === -1) return [];
    done[pick] = true;
    out.push(pick);
    for (const next of adj[pick]) indeg[next]--;
  }
  return out;
}`,
        skills: ["Kahn's algorithm", "In-degree", "Cycle detection", "Deterministic tie-breaking"],
      },
    ],
  },

  5047: {
    topicId: 5047,
    title: "Shortest paths: BFS, Dijkstra",
    summary:
      "See breadth-first search as the special case of Dijkstra where every edge costs one, and learn exactly " +
      "which assumption you are relying on when you reach for either.",
    concepts: [
      "Unweighted shortest path",
      "Edge relaxation",
      "Priority by accumulated cost",
      "Settled versus tentative",
      "Non-negative weight assumption",
    ],
    glossary: {
      Relaxation:
        "Checking whether going through node u gives a cheaper route to node v, and lowering v's tentative distance if so.",
      "Tentative distance": "The best cost found to a node so far, which may still improve.",
      Settled:
        "A node whose distance is final. Dijkstra settles nodes in non-decreasing order of distance, which is why it can stop improving them.",
      "Frontier by cost":
        "A priority queue ordered by accumulated distance, which is what turns breadth-first search into Dijkstra.",
      "Non-negative weights":
        "The assumption Dijkstra needs: with a negative edge, a settled node could still be improved later, so the algorithm's central claim fails.",
      "Unreachable node": "A node with no path from the source, conventionally reported as infinity or as a sentinel.",
      "Zero-one BFS":
        "The deque variant for graphs whose weights are only zero or one, giving Dijkstra's answer in linear time.",
    },
    body: {
      Beginner: `
<p>Shortest path questions come in two flavours, and the difference is whether the steps cost the
same.</p>

<h2>Every step costs one</h2>
<p>On a map where moving to a neighbour always costs one, breadth-first search is the answer. It
explores everything one step away, then everything two steps away, so the first time it reaches a place
is by the fewest steps possible. There is nothing to improve later.</p>

<pre><code>const dist = new Array(n).fill(-1);
dist[start] = 0;
const queue = [start];
for (let head = 0; head &lt; queue.length; head++) {
  const node = queue[head];
  for (const next of adj[node]) {
    if (dist[next] === -1) {
      dist[next] = dist[node] + 1;
      queue.push(next);
    }
  }
}
</code></pre>

<h2>Steps cost different amounts</h2>
<p>Now imagine roads with different travel times. Fewest roads is no longer cheapest: three fast roads
can beat one slow one. Breadth-first search counts roads, so it gives the wrong answer.</p>

<p>Dijkstra's algorithm fixes it with one change: instead of taking the oldest place from the queue,
always take the <strong>cheapest place found so far</strong>. Then, as with breadth-first search, the
first time you settle on a place you have its true cheapest cost.</p>

<h2>The rule you must not break</h2>
<p>This only works when no road has a negative cost. With a negative road, a place you had already
finished with could become cheaper later, and the whole argument falls apart. If costs can be negative,
you need a different algorithm.</p>

<aside class="tip">Same code, different container: a queue counts steps, a priority queue by cost finds
cheapest routes.</aside>
`,
      Intermediate: `
<p>Both algorithms are the generic traversal from the earlier topic with a specific frontier policy.
Writing them side by side makes the shared structure obvious and the one real difference explicit.</p>

<h2>Relaxation, the shared operation</h2>
<p>Every shortest-path algorithm is built from one step: if <code>dist[u] + weight(u, v)</code> is less
than <code>dist[v]</code>, lower <code>dist[v]</code>. The algorithms differ only in the order in which
they perform relaxations and in how they know when to stop.</p>

<ul>
  <li><strong>Breadth-first search</strong> relaxes in order of hop count. Correct when every weight is the same.</li>
  <li><strong>Dijkstra</strong> relaxes in order of accumulated distance. Correct when every weight is non-negative.</li>
  <li><strong>Topological relaxation</strong> works on a DAG in any edge order consistent with the topological order, and tolerates negative weights.</li>
  <li><strong>Bellman-Ford</strong> relaxes every edge V - 1 times, tolerates negative weights, and detects negative cycles, at O(V * E).</li>
</ul>

<h2>Why Dijkstra can settle a node forever</h2>
<p>The invariant is that when a node is removed from the priority queue it has its final distance. The
argument: suppose a cheaper route to it existed. That route leaves the settled set at some point, and
its first unsettled node would have a smaller tentative distance, so it would have been removed first.
This is a contradiction, provided no edge is negative, because only a negative edge lets a longer prefix
lead to a shorter total.</p>

<h2>The lazy implementation</h2>
<p>The clean version uses a priority queue that supports decrease-key. Since JavaScript has no built-in
heap, the practical version pushes duplicate entries and discards stale ones:</p>
<pre><code>while (heap.size) {
  const [d, u] = heap.pop();
  if (d &gt; dist[u]) continue;        // a stale copy, already improved
  for (const [v, w] of adj[u]) {
    if (dist[u] + w &lt; dist[v]) { dist[v] = dist[u] + w; heap.push([dist[v], v]); }
  }
}
</code></pre>
<p>That stale check is not an optimisation, it is what keeps the complexity at O(E log E) instead of
letting old entries re-expand nodes.</p>

<h2>Reporting the path, not just the cost</h2>
<p>Keep a parent array updated at every successful relaxation, then walk it backwards from the target.
Interviewers ask for the path roughly half the time and the array costs one line, so add it by default
rather than as an afterthought.</p>

<h2>Cost</h2>
<p>Breadth-first search is O(V + E). Dijkstra with a binary heap is O((V + E) log V), and with a simple
linear scan for the minimum it is O(V^2), which is genuinely faster on dense graphs where E approaches
V^2.</p>
`,
      Advanced: `
<p>Three variants come up often enough to be worth having ready, and one common assumption is worth
attacking.</p>

<h2>Zero-one BFS</h2>
<p>When every edge weight is zero or one, a deque replaces the heap: relax along a zero edge and push
the node to the front, relax along a one edge and push to the back. The deque then holds at most two
distinct distance values at any moment, so it is implicitly sorted and the whole thing runs in O(V + E).
This is the standard answer to grid problems where some moves are free, and reaching for a heap there
costs a log factor for nothing.</p>

<h2>State-expanded graphs</h2>
<p>"Shortest path with at most k refuels", "with one wall you may break", "carrying a key" are all the
same manoeuvre: make the node a pair of position and resource state. The graph becomes V * (k + 1)
nodes and the algorithm is unchanged. The skill is recognising that the extra dimension belongs in the
node identity rather than in the relaxation logic, because putting it in the relaxation quietly breaks
the settled invariant.</p>

<h2>A star and the admissibility condition</h2>
<p>Ordering the frontier by <code>dist + h(node)</code> for a heuristic h preserves optimality provided
h never overestimates the true remaining cost. If h is also consistent, meaning
<code>h(u) &lt;= w(u, v) + h(v)</code>, then nodes are still settled once and the implementation stays
identical to Dijkstra. With an admissible but inconsistent heuristic, nodes may need re-expansion, and
the version that skips already-settled nodes silently returns non-optimal paths. Dijkstra is exactly A
star with h equal to zero.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Using a visited set instead of the stale check.</strong> Marking nodes visited on push, as in breadth-first search, prevents a later cheaper route from being applied.</li>
  <li><strong>Negative weights.</strong> The algorithm does not error, it just returns wrong answers, which is far worse. Validate the input or choose Bellman-Ford.</li>
  <li><strong>Infinity in the output.</strong> JSON serialises Infinity as null, and comparisons against it in float arithmetic can produce NaN. Convert unreachable nodes to an explicit sentinel before returning.</li>
  <li><strong>Rebuilding the adjacency list inside the loop.</strong> A surprisingly common way to turn a log-linear algorithm quadratic without changing a single line of the algorithm itself.</li>
</ul>
`,
      Expert: `
<p>Dijkstra's algorithm is a greedy method whose correctness rests on a matroid-like exchange property,
and its complexity is determined entirely by the priority queue, which is where all subsequent research
went.</p>

<h2>The complexity ladder</h2>
<p>With a binary heap the bound is O((V + E) log V). With a Fibonacci heap, decrease-key is amortised
O(1), giving O(E + V log V), which is asymptotically better and almost never faster in practice because
the constants and the pointer chasing dominate at realistic sizes. For integer weights bounded by C,
Dial's algorithm uses bucket queues for O(E + V * C), and Thorup's algorithm achieves linear time for
undirected graphs with integer weights by exploiting the structure of a minimum spanning tree. The
practical lesson is that the theoretical ladder and the benchmark ladder disagree, and a senior answer
names both.</p>

<h2>Bidirectional and preprocessed search</h2>
<p>Running Dijkstra from both the source and the target and stopping when the frontiers meet is not
simply "stop on first contact": the correct termination condition is that the sum of the two frontier
minimums exceeds the best path found so far, and stopping early is the most common bug in a
bidirectional implementation. Beyond that, real routing engines do not run Dijkstra at all at query
time. Contraction hierarchies preprocess the graph by shortcutting nodes in order of importance,
turning continental route planning into a search over a few hundred nodes, and the query is then a
bidirectional Dijkstra restricted to upward edges.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Dijkstra fails on negative weights because it might loop."</strong> It terminates fine; it returns a wrong answer. The failure is silent, which is precisely why it matters.</li>
  <li><strong>"Add a constant to every weight to remove negatives."</strong> This does not preserve shortest paths, because it penalises paths with more edges. Johnson's algorithm does the reweighting correctly using potentials derived from Bellman-Ford, and that subtlety is the whole content of the technique.</li>
  <li><strong>"BFS is a special case of Dijkstra, so just use Dijkstra."</strong> True in output, wrong in cost: the log factor is real, and zero-one BFS shows there is a middle ground the reflex answer misses.</li>
  <li><strong>"The heap needs decrease-key."</strong> The lazy duplicate-push variant is simpler, has the same asymptotic bound because the heap holds at most E entries, and is what almost every competitive implementation actually uses.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Fewest hops from a source",
        difficulty: "Easy",
        statement: `
<p>A directed graph has <code>n</code> nodes numbered <code>0</code> to <code>n - 1</code> and a list
of <code>edges</code>, where <code>[u, v]</code> is an edge from <code>u</code> to <code>v</code>.
Return an array where entry <code>i</code> is the fewest edges on any path from <code>src</code> to
<code>i</code>, or <code>-1</code> when <code>i</code> is unreachable.</p>
<pre>n = 4, edges = [[0,1],[0,2],[1,3],[2,3]], src = 0  ->  [0, 1, 1, 2]
n = 3, edges = [[0,1]],                   src = 0  ->  [0, 1, -1]</pre>
<p>Every edge costs the same, so the first time a node is reached is by the fewest hops. Do not use -1
as a distance and as a marker for "not yet seen" in two different senses.</p>`,
        fn: "bfsDistances",
        params: "n, edges, src",
        tests: [
          { args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]], 0], expected: [0, 1, 1, 2], label: "diamond" },
          { args: [4, [[0, 1], [1, 2], [2, 3]], 0], expected: [0, 1, 2, 3], label: "chain" },
          { args: [3, [[0, 1]], 0], expected: [0, 1, -1], label: "unreachable node" },
          { args: [1, [], 0], expected: [0], label: "single node" },
          { args: [3, [[1, 2]], 0], expected: [0, -1, -1], label: "source has no edges", hidden: true },
          { args: [3, [[0, 1], [1, 0], [1, 2]], 0], expected: [0, 1, 2], label: "edges pointing back", hidden: true },
        ],
        hints: [
          "Build the adjacency list first, then traverse it. Scanning the edge list inside the loop is what makes this quadratic.",
          "A node's distance is set exactly once, at the moment it is discovered.",
          "Use a queue with an advancing head index, set dist[next] = dist[node] + 1 when dist[next] is still unset, and enqueue it then.",
        ],
        solution: `function bfsDistances(n, edges, src) {
  const adj = [];
  for (let i = 0; i < n; i++) adj.push([]);
  for (const e of edges) adj[e[0]].push(e[1]);
  const dist = new Array(n).fill(-1);
  if (src < 0 || src >= n) return dist;
  dist[src] = 0;
  const queue = [src];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;
    for (const next of adj[node]) {
      if (dist[next] === -1) {
        dist[next] = dist[node] + 1;
        queue.push(next);
      }
    }
  }
  return dist;
}`,
        skills: ["Unweighted shortest path", "Edge relaxation", "Settled versus tentative"],
      },
      {
        n: 2,
        title: "Cheapest routes with weighted edges",
        difficulty: "Hard",
        statement: `
<p>The same graph, now with weights: each edge is <code>[u, v, w]</code> with <code>w</code>
non-negative. Return an array where entry <code>i</code> is the cheapest total weight of any path from
<code>src</code> to <code>i</code>, or <code>-1</code> when <code>i</code> is unreachable.</p>
<pre>n = 4, edges = [[0,1,1],[1,2,2],[0,2,5],[2,3,1]], src = 0  ->  [0, 1, 3, 4]</pre>
<p>Note that node 2 is reached more cheaply through node 1 than by its direct edge, so counting hops is
not enough. Settle nodes in increasing order of cost: repeatedly take the unsettled node with the
smallest tentative distance and relax its outgoing edges. Do not return <code>Infinity</code>, since it
does not survive serialisation.</p>`,
        fn: "dijkstra",
        params: "n, edges, src",
        tests: [
          { args: [4, [[0, 1, 1], [1, 2, 2], [0, 2, 5], [2, 3, 1]], 0], expected: [0, 1, 3, 4], label: "detour is cheaper" },
          { args: [3, [[0, 2, 10], [0, 1, 1], [1, 2, 1]], 0], expected: [0, 1, 2], label: "two hops beat one" },
          { args: [3, [[0, 1, 4]], 0], expected: [0, 4, -1], label: "unreachable node" },
          { args: [1, [], 0], expected: [0], label: "single node" },
          { args: [3, [[0, 1, 7], [0, 1, 2], [1, 2, 0]], 0], expected: [0, 2, 2], label: "parallel and zero weight edges", hidden: true },
          { args: [2, [[0, 1, 5]], 1], expected: [-1, 0], label: "source with no outgoing edges", hidden: true },
        ],
        hints: [
          "Start every distance at infinity except the source, and keep a separate record of which nodes are already final.",
          "Which node can you be certain about next? The unsettled one with the smallest tentative distance, provided no weight is negative.",
          "Repeat n times: pick the unsettled node with the smallest distance, mark it settled, and for each outgoing edge lower the neighbour's distance if going through this node is cheaper. Convert any remaining infinities to -1 at the end.",
        ],
        solution: `function dijkstra(n, edges, src) {
  const INF = Infinity;
  const adj = [];
  for (let i = 0; i < n; i++) adj.push([]);
  for (const e of edges) adj[e[0]].push([e[1], e[2]]);
  const dist = new Array(n).fill(INF);
  const settled = new Array(n).fill(false);
  if (src >= 0 && src < n) dist[src] = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    let best = INF;
    for (let v = 0; v < n; v++) {
      if (!settled[v] && dist[v] < best) { best = dist[v]; u = v; }
    }
    if (u === -1) break;
    settled[u] = true;
    for (const pair of adj[u]) {
      const v = pair[0];
      const w = pair[1];
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  return dist.map(function (d) { return d === INF ? -1 : d; });
}`,
        skills: ["Priority by accumulated cost", "Edge relaxation", "Non-negative weight assumption"],
      },
    ],
  },

  5048: {
    topicId: 5048,
    title: "Memoisation to tabulation",
    summary:
      "Write the honest recursion first, cache it, then turn the cache into a table. By the end you can convert " +
      "any correct brute force into a dynamic program mechanically.",
    concepts: [
      "State definition",
      "Transition",
      "Overlapping subproblems",
      "Memoisation",
      "Tabulation and iteration order",
    ],
    glossary: {
      State:
        "The smallest description of a subproblem that determines its answer. Choosing it well is most of the work.",
      Transition: "The rule expressing the answer for a state in terms of the answers for smaller states.",
      "Overlapping subproblems":
        "The property that the same state is reached by many different paths, which is what makes caching worthwhile.",
      "Optimal substructure":
        "The property that an optimal answer is built from optimal answers to subproblems, which is what makes the transition valid.",
      Memoisation: "Top-down caching: keep the recursion and store each state's answer the first time it is computed.",
      Tabulation: "Bottom-up filling: order the states so that every state's dependencies are computed before it.",
      "Iteration order":
        "The sequence in which a table is filled. It must respect the dependency direction, and getting it wrong reads uninitialised or already-overwritten entries.",
    },
    body: {
      Beginner: `
<p>Some problems break into smaller copies of themselves. Counting the ways to climb a staircase, when
you may take one or two steps at a time, is the classic example: the ways to reach step 10 are the ways
to reach step 9 plus the ways to reach step 8.</p>

<pre><code>function ways(n) {
  if (n === 0) return 1;
  if (n &lt; 0) return 0;
  return ways(n - 1) + ways(n - 2);
}
</code></pre>

<h2>The problem with that</h2>
<p>It is correct and it is unusably slow. Computing <code>ways(40)</code> recomputes
<code>ways(35)</code> many thousands of times, because the same question is asked again and again down
different branches.</p>

<h2>Fix one: remember the answers</h2>
<p>Keep a note of every answer you have already worked out, and look there first. That is called
memoisation, and it usually turns something exponential into something linear with three extra lines.</p>

<pre><code>const memo = new Map();
function ways(n) {
  if (n === 0) return 1;
  if (n &lt; 0) return 0;
  if (memo.has(n)) return memo.get(n);
  const result = ways(n - 1) + ways(n - 2);
  memo.set(n, result);
  return result;
}
</code></pre>

<h2>Fix two: fill a table instead</h2>
<p>If you know the answer for 0, and each answer depends only on smaller ones, you can work upwards
with a loop and never recurse at all. This is called tabulation, and it removes the recursion depth
limit as well as the function-call cost.</p>

<pre><code>function ways(n) {
  const table = new Array(n + 1).fill(0);
  table[0] = 1;
  for (let i = 1; i &lt;= n; i++) {
    table[i] = table[i - 1] + (i &gt;= 2 ? table[i - 2] : 0);
  }
  return table[n];
}
</code></pre>

<aside class="tip">Always write the plain recursion first, even though you know it is too slow. If the
recursion is wrong, the fast version will be confidently wrong, which is much harder to spot.</aside>
`,
      Intermediate: `
<p>Dynamic programming is not a category of problem, it is a procedure you apply to a recursion. The
procedure has four steps and skipping the first one is why most attempts stall.</p>

<h2>Step one: define the state in words</h2>
<p>Write a sentence of the form "<code>f(i, j)</code> is the best value obtainable considering the
first i items with j units of capacity remaining". If you cannot finish that sentence, no amount of
table filling will help, because you do not yet know what you are computing. Two properties must hold:
the state must be sufficient, meaning nothing outside it affects the answer, and the state space must
be small enough to enumerate.</p>

<h2>Step two: write the transition and the base cases</h2>
<p>The transition is the recursion, and it should read like the decision you are making: take this item
or skip it, match these characters or pay for an edit, stop here or continue. Base cases are the states
where no decision remains.</p>

<h2>Step three: memoise</h2>
<p>Add a cache keyed on the state. For a single small integer state, an array is both faster and
clearer than a map. For a compound state, either nest arrays or key a map on a canonical string, and
remember the key-design warning from the hashing topic: the key must capture exactly the state and
nothing more, or you will either miss cache hits or return an answer computed for a different
situation.</p>

<h2>Step four: convert to a table</h2>
<p>Replace the recursion with loops that visit states in an order where every dependency is already
filled. The dependency direction dictates the loop direction; it is not a stylistic choice:</p>
<pre><code>// f(i) depends on f(i - 1) and f(i - 2), so ascending i is correct
for (let i = 1; i &lt;= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
</code></pre>
<p>Tabulation also gives you the memory optimisation for free: if a row only depends on the previous
row, keep two rows instead of the whole table and the space drops from O(n * m) to O(m).</p>

<h2>Cost, stated the useful way</h2>
<p>Time is the number of states multiplied by the work per transition. Space is the number of states,
or one dimension of it after rolling. Say it that way in an interview: "there are n times c states and
each is O(1), so O(n * c) time and O(c) space after rolling" demonstrates that you understand the
shape rather than having recognised the problem.</p>

<h2>When memoisation is the better choice</h2>
<p>Top-down only visits reachable states, which matters when the table is sparse: a grid with many
blocked cells, or a state space where most combinations are unreachable. Bottom-up visits everything.
Top-down also handles awkward dependency orders without you having to work out the order at all. Its
costs are recursion depth and function-call overhead, which is why the tabulated version is standard
once the ordering is obvious.</p>
`,
      Advanced: `
<p>The four-step procedure works. What separates a fast solve from a stall is the choice of state, and
there are recognisable moves for improving one.</p>

<h2>Reducing the state</h2>
<p>A first attempt often carries redundant information. If the state is "index, remaining capacity, and
the set of chosen items", the set is almost always unnecessary because the value already summarises it.
Deleting a dimension is the single highest-leverage optimisation available, converting an exponential
state space to a polynomial one, and it is worth spending a minute on before writing any code. The test
is: given two different histories that lead to the same reduced state, does the future ever differ? If
not, the deleted dimension was redundant.</p>

<h2>Changing what the state measures</h2>
<p>Sometimes the value and one dimension of the state should swap. In a knapsack where weights are huge
but values are small, indexing by achieved value and storing the minimum weight required flips an
intractable table into a small one. The same trick underlies the pseudo-polynomial nature of these
algorithms: O(n * W) is polynomial in the numeric value of W, not in the number of bits used to write
it, which is why subset sum is NP-complete despite having a table solution.</p>

<h2>Reconstructing the answer, not just its value</h2>
<p>Most DP formulations compute a number. Producing the actual subset, path or alignment needs either a
parent table, which costs the same memory as the DP table, or a backward walk through the completed
table re-deriving each decision, which costs no extra memory and one extra pass. Hirschberg's algorithm
goes further and reconstructs a full alignment in linear space by divide and conquer, which is the
standard follow-up question once you produce the rolling-array version of edit distance.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Rolling the array without reversing the loop.</strong> In a 0/1 knapsack the capacity loop must descend, or an item is used twice. This is the most common silent DP bug and it produces plausible, larger answers.</li>
  <li><strong>Caching a state that depends on a mutable variable outside it.</strong> The cache then returns an answer computed under different conditions, and the failure is order-dependent and hard to reproduce.</li>
  <li><strong>Using zero as both a legitimate value and "not computed".</strong> Use a separate presence check or an impossible sentinel such as -1 where the domain is non-negative.</li>
  <li><strong>Recursion depth in top-down DP.</strong> A chain of a hundred thousand states overflows, and the fix is the tabulated version rather than a bigger stack.</li>
</ul>
`,
      Expert: `
<p>Dynamic programming is shortest paths on the directed acyclic graph of states. The states are nodes,
the transitions are weighted edges, and evaluation order is a topological order. That equivalence is not
a curiosity: it tells you immediately that a DP with cyclic dependencies is not a DP at all but a
fixpoint computation, which is why "longest simple path" has no DP formulation and why value iteration,
rather than a single sweep, is required once the state graph has cycles.</p>

<h2>The two structural conditions</h2>
<p>Optimal substructure and overlapping subproblems are usually presented as a checklist. The precise
statement is that the objective must be decomposable along a monotone, associative combination, which is
Bellman's principle of optimality. Where it fails, the whole edifice fails, and it fails more often than
textbooks admit: any constraint coupling non-adjacent decisions, such as a global budget on the number
of distinct item types, is not captured by a per-prefix state, and the honest fix is to add the coupling
to the state and accept the larger space.</p>

<h2>Beating the table</h2>
<ul>
  <li><strong>Divide and conquer optimisation</strong> applies when the optimal split point is monotone in the state, reducing O(n^2) transitions to O(n log n).</li>
  <li><strong>Knuth's optimisation</strong> exploits a quadrangle inequality to bound the search for the split point, turning O(n^3) interval DPs into O(n^2).</li>
  <li><strong>Convex hull trick and Li Chao trees</strong> handle transitions of the form "minimum over j of a linear function of the state" in logarithmic time, which is what makes many O(n^2) DPs log-linear.</li>
  <li><strong>Matrix exponentiation</strong> computes a linear recurrence at index n in O(log n) matrix multiplications, which is the right answer when n is astronomically large and the transition is fixed.</li>
</ul>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Bottom-up is always faster."</strong> Not when the reachable state space is a small fraction of the full table. A memoised search over a sparse grid can be orders of magnitude faster than filling every cell.</li>
  <li><strong>"DP is O(states)."</strong> It is O(states times transition cost), and the transition is frequently a loop. Quoting only the state count understates many algorithms by a factor of n.</li>
  <li><strong>"Pseudo-polynomial is polynomial."</strong> O(n * W) is exponential in the input size when W is given in binary, which is the entire reason subset sum is hard and the reason the table solution is not a proof that P equals NP.</li>
  <li><strong>"Memoisation is just caching."</strong> It is caching plus referential transparency. Memoising a function whose result depends on anything outside its arguments is a correctness bug wearing an optimisation's clothes.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Ways to climb the staircase",
        difficulty: "Easy",
        statement: `
<p>You are climbing a staircase of <code>n</code> steps and may take between <code>1</code> and
<code>maxStep</code> steps at a time. Return how many distinct sequences of moves reach the top
exactly. Two sequences differ if any move differs, so 1 then 2 is different from 2 then 1.</p>
<pre>n = 5, maxStep = 2   ->  8
n = 4, maxStep = 3   ->  7
n = 0, maxStep = 2   ->  1     one way to do nothing</pre>
<p>Write the recursion first: the ways to reach step i are the sum of the ways to reach the steps you
could have jumped from. Then fill a table upwards rather than recursing, so the answer for a large
<code>n</code> does not exhaust the call stack.</p>`,
        fn: "climbWays",
        params: "n, maxStep",
        tests: [
          { args: [5, 2], expected: 8, label: "steps of one or two" },
          { args: [4, 3], expected: 7, label: "steps of up to three" },
          { args: [0, 2], expected: 1, label: "zero steps" },
          { args: [3, 1], expected: 1, label: "only single steps" },
          { args: [10, 2], expected: 89, label: "larger input", hidden: true },
          { args: [3, 0], expected: 0, label: "no legal move", hidden: true },
        ],
        hints: [
          "The number of ways to reach a step is the sum over every legal jump size of the ways to reach the step you jumped from.",
          "There is exactly one way to be at the bottom before moving, which is your base case.",
          "Allocate a table of length n + 1, set entry 0 to 1, and for each i add the entries at i - 1 down to i - maxStep, skipping any index below zero.",
        ],
        solution: `function climbWays(n, maxStep) {
  if (n < 0) return 0;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= maxStep && s <= i; s++) {
      dp[i] += dp[i - s];
    }
  }
  return dp[n];
}`,
        skills: ["State definition", "Transition", "Tabulation and iteration order"],
      },
      {
        n: 2,
        title: "Paths across a blocked grid",
        difficulty: "Medium",
        statement: `
<p>A robot starts at the top-left cell of a <code>rows</code> by <code>cols</code> grid and must reach
the bottom-right cell, moving only right or down. Some cells are blocked and cannot be entered;
<code>blocked</code> is a list of <code>[row, col]</code> pairs. Return the number of distinct paths.</p>
<pre>rows = 3, cols = 3, blocked = []          ->  6
rows = 3, cols = 3, blocked = [[1, 1]]    ->  2
rows = 2, cols = 2, blocked = [[0,1],[1,0]]  ->  0</pre>
<p>If the start or the finish is blocked the answer is zero. Each cell's count is the sum of the cell
above and the cell to the left, which means one pass in row order fills the whole table.</p>`,
        fn: "countPaths",
        params: "rows, cols, blocked",
        tests: [
          { args: [3, 3, []], expected: 6, label: "open grid" },
          { args: [3, 3, [[1, 1]], ], expected: 2, label: "blocked centre" },
          { args: [2, 2, [[0, 1], [1, 0]]], expected: 0, label: "fully walled off" },
          { args: [1, 1, []], expected: 1, label: "single cell" },
          { args: [3, 4, [[1, 2]]], expected: 4, label: "wider grid with an obstacle", hidden: true },
          { args: [2, 2, [[0, 0]]], expected: 0, label: "start is blocked", hidden: true },
        ],
        hints: [
          "How many ways are there to reach a cell, given the only two ways to enter it?",
          "A blocked cell contributes nothing to its neighbours, so its count is zero rather than skipped.",
          "Fill row by row, left to right. The top-left starts at 1 unless it is blocked, and every other open cell is the sum of the counts above and to the left when those exist.",
        ],
        solution: `function countPaths(rows, cols, blocked) {
  if (rows <= 0 || cols <= 0) return 0;
  const walls = new Set();
  for (const b of blocked) walls.add(b[0] + "," + b[1]);
  const grid = [];
  for (let r = 0; r < rows; r++) grid.push(new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (walls.has(r + "," + c)) { grid[r][c] = 0; continue; }
      if (r === 0 && c === 0) { grid[r][c] = 1; continue; }
      let ways = 0;
      if (r > 0) ways += grid[r - 1][c];
      if (c > 0) ways += grid[r][c - 1];
      grid[r][c] = ways;
    }
  }
  return grid[rows - 1][cols - 1];
}`,
        skills: ["Tabulation and iteration order", "Overlapping subproblems", "Transition"],
      },
    ],
  },

  5049: {
    topicId: 5049,
    title: "Knapsack and subset patterns",
    summary:
      "Recognise the family of questions that are really 'choose a subset under a budget', and write the rolling " +
      "one-dimensional table without reintroducing the double-use bug.",
    concepts: [
      "0/1 knapsack",
      "Capacity as a dimension",
      "Subset sum",
      "Rolling array",
      "Reverse iteration for 0/1",
    ],
    glossary: {
      "0/1 knapsack":
        "Each item may be taken at most once, which is what forces the reverse capacity loop in the rolling version.",
      "Unbounded knapsack":
        "Each item may be taken any number of times, solved by the same table with the capacity loop running forwards.",
      "Subset sum":
        "The decision version with values equal to weights: can any subset reach exactly this total.",
      "Capacity dimension":
        "The axis of the table indexed by remaining or used budget, which is what turns an exponential choice into a polynomial table.",
      "Rolling array":
        "Keeping one row instead of the whole table, valid when each row depends only on the previous one.",
      "Pseudo-polynomial":
        "Polynomial in the numeric value of the capacity rather than in the number of bits needed to write it, which is why these algorithms do not settle the complexity of subset sum.",
      Reachability: "The boolean form of the table, recording which totals can be made at all rather than the best value.",
    },
    body: {
      Beginner: `
<p>You have a bag that holds seven kilograms and a pile of items, each with a weight and a value. Which
items should you take?</p>

<p>Trying every combination works for ten items and is hopeless for fifty, because the number of
combinations doubles with each item. The way out is to stop asking "which items" and start asking a
smaller question repeatedly.</p>

<h2>The smaller question</h2>
<p>For each item in turn, and each possible bag capacity, ask: what is the best value I can achieve?
There are only two choices for the item in front of you.</p>
<ul>
  <li><strong>Skip it.</strong> The best value is whatever it was without this item.</li>
  <li><strong>Take it</strong>, if it fits. The best value is this item's value plus the best value for
      the capacity that is left over.</li>
</ul>
<p>Take whichever of the two is larger. That is the whole algorithm.</p>

<pre><code>// best[c] = best value achievable with capacity c
const best = new Array(capacity + 1).fill(0);
for (let i = 0; i &lt; weights.length; i++) {
  for (let c = capacity; c &gt;= weights[i]; c--) {
    const takeIt = best[c - weights[i]] + values[i];
    if (takeIt &gt; best[c]) best[c] = takeIt;
  }
}
</code></pre>

<h2>Why the inner loop counts downwards</h2>
<p>Because you may take each item only once. Going upwards, the entry for a small capacity would
already include this item, and using it again would take the same item twice. Counting down means every
entry you read still refers to the situation before this item existed.</p>

<h2>Where else this shows up</h2>
<p>"Can these numbers be split into two equal halves" is the same table with the value equal to the
weight, asking whether exactly half the total is reachable. Once you see one, you see them all.</p>

<aside class="tip">The giveaway phrasing is: a set of items, at most one of each, and a budget that
cannot be exceeded.</aside>
`,
      Intermediate: `
<p>The knapsack family is worth learning as a family because a dozen interview questions are the same
table with a different objective printed on top.</p>

<h2>The two-dimensional formulation</h2>
<p>Define <code>f(i, c)</code> as the best value using only the first i items with capacity c. The
transition is:</p>
<pre><code>f(i, c) = max( f(i - 1, c),                                  // skip item i
               f(i - 1, c - w[i]) + v[i] )                    // take it, if w[i] &lt;= c
</code></pre>
<p>The base row is all zeroes: with no items, no value is achievable at any capacity. Time is
O(n * C), space is O(n * C) before rolling.</p>

<h2>Rolling to one dimension, and the direction rule</h2>
<p>Each row depends only on the row above, so one array suffices. The direction of the capacity loop
then encodes which variant you are solving, and this is the single fact worth memorising from this
topic:</p>
<ul>
  <li><strong>Descending capacity</strong> gives 0/1: each entry read still belongs to the previous row, so an item is used at most once.</li>
  <li><strong>Ascending capacity</strong> gives unbounded: entries already updated for this item are read again, so the item can be reused.</li>
</ul>
<p>The same seven lines solve both problems, and the only difference is one loop bound. Being able to
state that difference cleanly is a strong signal in an interview because it shows the table, not the
recipe, is what you understand.</p>

<h2>The variants you should recognise</h2>
<ul>
  <li><strong>Subset sum</strong>: a boolean table of which totals are reachable.</li>
  <li><strong>Equal partition</strong>: subset sum for exactly half the total; impossible immediately if the total is odd, which is a free early exit worth stating.</li>
  <li><strong>Coin change, fewest coins</strong>: unbounded knapsack minimising count, with an unreachable sentinel rather than zero.</li>
  <li><strong>Counting the ways</strong>: replace max with addition. Note that the loop order then decides whether you count combinations or permutations, items outer for combinations and capacity outer for permutations, which is a distinction that catches people who have only memorised the shape.</li>
  <li><strong>Target sum with plus and minus signs</strong>: algebra turns it into a subset sum for a derived target, which is the intended insight rather than a search over sign assignments.</li>
</ul>

<h2>Cost, honestly</h2>
<p>O(n * C) time and O(C) space after rolling. Say explicitly that this is pseudo-polynomial: it is
linear in the numeric capacity, so a capacity of one billion is out of reach even with only ten items.
That caveat is often the follow-up question, and the correct alternative for few items and huge weights
is meet in the middle at O(2^(n/2)).</p>
`,
      Advanced: `
<p>Once the table is automatic, the value is in knowing its boundaries.</p>

<h2>Reconstructing the chosen set</h2>
<p>The rolling array destroys the information needed to say which items were taken. Two correct
approaches exist: keep the full two-dimensional table and walk backwards, comparing
<code>f(i, c)</code> with <code>f(i - 1, c)</code> to decide whether item i was taken, or keep a
bitmask of decisions per capacity when the item count is small. A frequent wrong approach is to record
the chosen set alongside each entry, which is correct but multiplies memory by the size of the set and
usually turns an acceptable solution into an out-of-memory one.</p>

<h2>Bitset subset sum</h2>
<p>For the reachability form, the entire row is a set of booleans, and shifting it by an item's weight
and combining with a bitwise or performs the whole inner loop in one operation per machine word. That
divides the constant by roughly 32 or 64 and is the standard competitive trick. In JavaScript,
<code>BigInt</code> supports arbitrary-width shift and or, which makes this expressible even without a
native bitset type, at the cost of allocation per operation.</p>

<h2>Where the table stops being right</h2>
<ul>
  <li><strong>Fractional items.</strong> If items can be split, the greedy by value-per-weight is optimal and the table is unnecessary. Recognising which of the two variants you have been given is a common interview trap, since the wording differs by one word.</li>
  <li><strong>Dependencies between items.</strong> "Item B may only be taken with item A" breaks the per-item independence, and the fix is to group the coupled items into a single composite item, or to add a dimension.</li>
  <li><strong>Two budgets.</strong> Weight and volume together mean a three-dimensional table, O(n * C1 * C2), which is often still fine and is the right answer rather than an attempt to combine the budgets.</li>
  <li><strong>Negative weights or values.</strong> The capacity axis assumes monotone consumption. Negative weights break the loop direction argument entirely and need a shifted index or a different formulation.</li>
</ul>

<h2>The classic silent bug</h2>
<p>Writing the capacity loop ascending in a 0/1 problem does not crash and does not obviously
misbehave. It reports a value that is too high, because items get reused, and it agrees with the
correct answer on any test where no item would ever be taken twice. The test that catches it must have a
capacity that is a multiple of some item weight, which is exactly the case a casual hand-written test
omits.</p>
`,
      Expert: `
<p>Subset sum is NP-complete, and the table solution is not a contradiction: O(n * C) is exponential in
the input length when C is written in binary. Holding both facts at once is what makes the topic
interesting rather than a recipe.</p>

<h2>The approximation and parameterised views</h2>
<p>Knapsack admits a fully polynomial-time approximation scheme: scale and round the values so the
table is indexed by rounded value rather than by weight, and the result is within a chosen epsilon of
optimal in time polynomial in both n and 1/epsilon. That is a genuinely different algorithm from the
exact table and it is the practical answer when capacities are large. From the parameterised angle, the
problem is fixed-parameter tractable in the capacity, which is precisely the pseudo-polynomial
statement dressed in a more useful vocabulary, since it tells you which parameter to attack.</p>

<h2>Meet in the middle</h2>
<p>Split the items into two halves, enumerate all 2^(n/2) subset sums of each, sort one side, and for
each sum on the other side binary search for the best complement. The result is O(2^(n/2) * n), which
makes n around 40 tractable with no dependence on the capacity at all. This is the correct answer to a
knapsack with 40 items and weights near 10^15, and it is a good demonstration that the standard table
is one point on a trade-off curve rather than the solution.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"Greedy by value density is a good heuristic."</strong> It is arbitrarily bad for 0/1: one heavy, high-value item beaten by a slightly denser tiny item leaves the bag nearly empty. It is exactly optimal for the fractional variant, and the two are constantly conflated.</li>
  <li><strong>"Reverse the loop to save memory."</strong> The reversal is not a memory optimisation, it is a correctness requirement of the rolled form. The memory saving comes from dropping the row dimension; the direction is what preserves the semantics after dropping it.</li>
  <li><strong>"Coin change is just knapsack."</strong> The counting variant is sensitive to loop order in a way the optimisation variant is not: swapping the loops changes combinations into permutations, and both are legitimate answers to differently worded questions.</li>
  <li><strong>"The DP gives you the items."</strong> It gives you the value. Recovery is a separate step with its own space cost, and interviewers who ask for the actual subset are testing precisely that gap.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "0/1 knapsack",
        difficulty: "Medium",
        statement: `
<p>Given parallel arrays <code>weights</code> and <code>values</code>, and a bag of the given
<code>capacity</code>, return the greatest total value obtainable. Each item may be taken at most
once, and the total weight must not exceed the capacity.</p>
<pre>weights = [1, 3, 4, 5], values = [1, 4, 5, 7], capacity = 7  ->  9
   take the items of weight 3 and 4, for 4 + 5</pre>
<p>Keep a single array indexed by capacity holding the best value achievable at that capacity. Process
one item at a time. The direction of the inner loop is what stops an item being taken twice, so think
about it before you write it.</p>`,
        fn: "knapsack",
        params: "weights, values, capacity",
        tests: [
          { args: [[1, 3, 4, 5], [1, 4, 5, 7], 7], expected: 9, label: "basic" },
          { args: [[1, 2, 3], [6, 10, 12], 5], expected: 22, label: "two of the three fit" },
          { args: [[2, 2, 2], [3, 3, 3], 4], expected: 6, label: "identical items" },
          { args: [[5], [10], 4], expected: 0, label: "nothing fits" },
          { args: [[], [], 10], expected: 0, label: "no items" },
          { args: [[1, 1, 1], [1, 1, 1], 0], expected: 0, label: "zero capacity", hidden: true },
          { args: [[3, 3], [5, 5], 6], expected: 10, label: "capacity is a multiple of a weight", hidden: true },
        ],
        hints: [
          "For each item there are only two possibilities: it is in the bag or it is not.",
          "Best value at capacity c, after considering this item, is the larger of the old value and this item's value plus the best value at c minus its weight.",
          "Iterate capacity downwards from the maximum to the item's weight. Upwards would read entries that already include this item and let you take it more than once.",
        ],
        solution: `function knapsack(weights, values, capacity) {
  if (capacity <= 0) return 0;
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const v = values[i];
    for (let c = capacity; c >= w; c--) {
      const take = dp[c - w] + v;
      if (take > dp[c]) dp[c] = take;
    }
  }
  return dp[capacity];
}`,
        skills: ["0/1 knapsack", "Capacity as a dimension", "Rolling array", "Reverse iteration for 0/1"],
      },
      {
        n: 2,
        title: "Split a set into two equal halves",
        difficulty: "Medium",
        statement: `
<p>Given an array <code>nums</code> of non-negative integers, return <code>true</code> when the array
can be split into two groups whose sums are equal. Every element must go into exactly one group. An
empty array counts as splittable, into two empty groups.</p>
<pre>[1, 5, 11, 5]  ->  true    11 against 1 + 5 + 5
[1, 2, 3, 5]   ->  false</pre>
<p>This is a subset sum in disguise: the two groups are equal exactly when some subset reaches half the
total. There is a one-line early exit before you build any table, and finding it is part of the
exercise.</p>`,
        fn: "canPartition",
        params: "nums",
        tests: [
          { args: [[1, 5, 11, 5]], expected: true, label: "basic" },
          { args: [[1, 2, 3, 5]], expected: false, label: "odd total" },
          { args: [[2, 2]], expected: true, label: "two equal elements" },
          { args: [[1]], expected: false, label: "single element" },
          { args: [[]], expected: true, label: "empty input" },
          { args: [[3, 3, 3, 4, 5]], expected: true, label: "needs three of the five", hidden: true },
          { args: [[1, 1, 2, 6]], expected: false, label: "even total but no valid subset", hidden: true },
        ],
        hints: [
          "If the total is odd, no split can be equal. Check that before doing any work.",
          "The question becomes: can any subset sum to exactly half the total?",
          "Keep a boolean array of reachable totals up to half, seeded with zero reachable, and for each number iterate the totals downwards marking total as reachable when total minus the number already was.",
        ],
        solution: `function canPartition(nums) {
  let total = 0;
  for (const x of nums) total += x;
  if (total % 2 !== 0) return false;
  const half = total / 2;
  const reachable = new Array(half + 1).fill(false);
  reachable[0] = true;
  for (const x of nums) {
    for (let s = half; s >= x; s--) {
      if (reachable[s - x]) reachable[s] = true;
    }
  }
  return reachable[half];
}`,
        skills: ["Subset sum", "Rolling array", "Reverse iteration for 0/1"],
      },
    ],
  },

  5050: {
    topicId: 5050,
    title: "Sequence DP: LIS, edit distance",
    summary:
      "Handle the two shapes of sequence problem: a state on one prefix, and a state on a pair of prefixes. " +
      "Then replace the quadratic LIS with the binary search version and be able to explain what the table means.",
    concepts: [
      "Prefix state",
      "Two-sequence alignment",
      "Longest increasing subsequence",
      "Binary search optimisation",
      "Edit operations",
    ],
    glossary: {
      Subsequence: "Elements taken in order but not necessarily adjacent, unlike a subarray which must be contiguous.",
      "Prefix state": "A state indexed by how much of one sequence has been consumed, the basic shape of a one-sequence DP.",
      Alignment:
        "A pairing of positions in two sequences, in order, allowing gaps, which is what an edit-distance table computes.",
      "Levenshtein distance":
        "The fewest single-character insertions, deletions and substitutions that turn one string into another.",
      "Tails array":
        "In the fast LIS, the array whose entry i holds the smallest possible tail of an increasing subsequence of length i + 1.",
      "Patience sorting": "The card-game analogy behind the tails array, where each pile's top card is one entry.",
      "Strict versus non-strict":
        "Whether equal values may sit next to each other in the subsequence, which changes the binary search from a lower bound to an upper bound.",
    },
    body: {
      Beginner: `
<p>Two questions turn up constantly, and they need slightly different thinking.</p>

<h2>One sequence: the longest run that keeps rising</h2>
<p>Given a list of numbers, find the length of the longest set of them, in their original order but not
necessarily next to each other, that keeps increasing. In <code>[10, 9, 2, 5, 3, 7, 101, 18]</code> one
answer is 2, 3, 7, 18, so the length is 4.</p>

<p>The simple method: for each position, ask what the longest rising run ending exactly here is. It is
one more than the best of all earlier positions holding a smaller value.</p>

<pre><code>const best = new Array(nums.length).fill(1);
for (let i = 1; i &lt; nums.length; i++) {
  for (let j = 0; j &lt; i; j++) {
    if (nums[j] &lt; nums[i] &amp;&amp; best[j] + 1 &gt; best[i]) best[i] = best[j] + 1;
  }
}
</code></pre>

<h2>Two sequences: how different are these words</h2>
<p>How many single-letter edits turn "kitten" into "sitting"? Change k to s, change e to i, add g at the
end: three. That number is the edit distance, and it is what spellcheckers and difference tools use.</p>

<p>The method builds a grid, one row per letter of the first word and one column per letter of the
second. Each cell answers: how many edits to turn this much of the first word into this much of the
second? If the two letters match, no new edit is needed and you copy the diagonal neighbour. If they do
not, you pay one edit on top of the cheapest of the three neighbours, which stand for changing,
deleting and inserting.</p>

<h2>The pattern to remember</h2>
<p>One sequence gives a one-dimensional table. Two sequences give a two-dimensional one. In both cases,
each cell is defined by the cells before it, so a couple of loops in the right order fill the whole
thing.</p>

<aside class="tip">Subsequence means "in order, gaps allowed". Substring or subarray means "next to
each other". Misreading that single word changes the whole problem.</aside>
`,
      Intermediate: `
<p>Sequence problems come in exactly two shapes, and naming the shape first tells you the table's
dimensions before you have thought about the transition.</p>

<h2>Shape one: a state per prefix</h2>
<p>The longest increasing subsequence is the canonical example. Define <code>f(i)</code> as the length
of the longest increasing subsequence <em>ending at</em> i, not "within the first i", because the ending
constraint is what makes the transition expressible. The answer is the maximum over all i, not
<code>f(n - 1)</code>, and forgetting that is a very common slip.</p>
<p>The transition scans all earlier positions, so the algorithm is O(n^2) time and O(n) space. That is
often enough, and it is what you should write first.</p>

<h2>The O(n log n) version, and what the array means</h2>
<pre><code>function lis(nums) {
  const tails = [];                       // tails[k]: smallest tail of an
  for (const x of nums) {                 // increasing subsequence of length k + 1
    let lo = 0, hi = tails.length;
    while (lo &lt; hi) {                     // lower bound: first tail &gt;= x
      const mid = lo + ((hi - lo) &gt;&gt; 1);
      if (tails[mid] &lt; x) lo = mid + 1; else hi = mid;
    }
    tails[lo] = x;                        // extend, or improve an existing length
  }
  return tails.length;
}
</code></pre>
<p>The critical point, and the one interviewers probe, is that <code>tails</code> is <strong>not</strong>
an increasing subsequence of the input. It is a record of the best achievable tail for each length, and
its length is the answer. If the actual subsequence is required, keep a parent pointer for each element
at the moment it is placed and walk backwards from the last placement.</p>

<h2>Shape two: a state per pair of prefixes</h2>
<p>Edit distance defines <code>f(i, j)</code> as the cost of turning the first i characters of a into
the first j characters of b. The base cases are the whole point: turning i characters into nothing costs
i deletions, so the first column is 0, 1, 2 and so on, and the first row likewise.</p>
<pre><code>if (a[i - 1] === b[j - 1]) f(i, j) = f(i - 1, j - 1);
else f(i, j) = 1 + min( f(i - 1, j - 1),   // substitute
                        f(i - 1, j),        // delete from a
                        f(i, j - 1) );      // insert into a
</code></pre>
<p>O(m * n) time and, after rolling to two rows, O(min(m, n)) space. Longest common subsequence,
sequence alignment and the standard difference algorithm are the same grid with a different cell rule.</p>

<h2>Choosing between the shapes</h2>
<p>Count the sequences in the problem statement. One sequence and a property that depends on what came
before gives shape one. Two sequences being compared or aligned gives shape two. It is a reliable cue
and it costs no time to apply.</p>
`,
      Advanced: `
<p>The refinements here are where sequence DP stops being a recipe.</p>

<h2>LIS variants and the strictness question</h2>
<p>For a non-decreasing subsequence, the binary search becomes an upper bound rather than a lower one,
which lets equal values extend the run. Longest decreasing is the same algorithm on the reversed
comparison. The minimum number of increasing subsequences needed to cover the sequence equals the
length of the longest decreasing subsequence, by Dilworth's theorem, and that identity turns several
awkward-looking problems into one LIS call. The Russian doll envelopes problem is a two-dimensional LIS
that becomes one-dimensional after sorting by width ascending and by height <em>descending</em> within
equal widths, so that two envelopes of the same width can never be chained. That descending tie-break is
the entire difficulty of the problem.</p>

<h2>Edit distance variants</h2>
<ul>
  <li><strong>Weighted operations.</strong> Different costs for insert, delete and substitute change only the constants in the transition, and are the basis of real spellcheckers where a substitution between adjacent keyboard keys is cheaper.</li>
  <li><strong>Damerau-Levenshtein</strong> adds transposition of adjacent characters, which requires looking two rows back and is the reason a rolling two-row implementation has to become three rows.</li>
  <li><strong>Longest common subsequence</strong> is the same grid taking a maximum on a match rather than a minimum on a mismatch, and it is what diff tools compute before rendering the result as insertions and deletions.</li>
</ul>

<h2>Linear space, and what it costs you</h2>
<p>Rolling to two rows gives the distance in O(min(m, n)) space but destroys the traceback. Hirschberg's
algorithm recovers a full alignment in linear space by computing the forward row for the top half and
the backward row for the bottom half, finding the column where their sum is minimal, and recursing on
the two quadrants. The time cost is a factor of two. This is the standard senior follow-up to a rolling
edit distance, and it is worth being able to sketch even without writing it.</p>

<h2>Failure modes</h2>
<ul>
  <li><strong>Reading the answer from the wrong cell.</strong> For LIS the answer is the maximum over the table, not the last entry; for edit distance it is the bottom-right corner. Confusing the two is common under time pressure.</li>
  <li><strong>Off-by-one between string indices and table indices.</strong> The table is one larger in each dimension, so cell (i, j) compares <code>a[i - 1]</code> with <code>b[j - 1]</code>.</li>
  <li><strong>Unicode.</strong> Indexing a JavaScript string by code unit splits characters outside the basic plane, so an emoji counts as two edits. Iterate code points when the domain includes them.</li>
  <li><strong>Rolling in the wrong direction.</strong> Overwriting the current row before the diagonal value has been read loses <code>f(i - 1, j - 1)</code>, which is the value the match case depends on.</li>
</ul>
`,
      Expert: `
<p>Both problems have known lower bounds and both have been attacked from directions that the interview
treatment never mentions.</p>

<h2>Edit distance is probably quadratic</h2>
<p>Backurs and Indyk showed that a truly subquadratic algorithm for edit distance would refute the
strong exponential time hypothesis. So the O(m * n) table is, conditionally, optimal, and the practical
speedups are all constant-factor or input-dependent: the bit-parallel Myers algorithm computes a row in
O(m * n / w) word operations by encoding the differences between adjacent cells as bit vectors, and the
Ukkonen band restricts the computation to a diagonal band of width proportional to the answer, giving
O(n * d) when the strings are known to be similar. Both are what real implementations use, and neither
changes the asymptotic worst case.</p>

<h2>LIS as patience sorting, and the deeper structure</h2>
<p>The tails algorithm is exactly the patience sorting card game, and the pile structure it builds is
connected to the Robinson-Schensted correspondence: the same insertion procedure, carried through
completely, produces a Young tableau whose first row is the tails array and whose shape encodes the
longest increasing and decreasing subsequences simultaneously. The expected LIS length of a uniformly
random permutation of n elements is asymptotically 2 times the square root of n, which is a useful
sanity check when testing an implementation against random data and a result with a genuinely
surprising proof.</p>

<h2>What the write-ups get wrong</h2>
<ul>
  <li><strong>"The tails array is the answer subsequence."</strong> It has the right length and is generally not a subsequence of the input at all. Printing it as the answer is the most common bug in a fast LIS.</li>
  <li><strong>"Edit distance and LCS are interchangeable."</strong> Levenshtein allows substitution; LCS does not, so the LCS-derived edit distance counts a substitution as two operations. They agree only when substitutions are priced at two.</li>
  <li><strong>"Use recursion with memoisation, it is the same."</strong> For edit distance on strings of a few thousand characters, the memoised version allocates a map entry per cell and exceeds the call-stack depth, while the tabulated version runs in a flat loop over a typed array. Here the constant factor decides feasibility.</li>
  <li><strong>"O(n log n) LIS needs a segment tree."</strong> Only the variants with extra constraints do, such as maximum-sum increasing subsequence. The plain length question needs nothing beyond an array and a binary search.</li>
</ul>
`,
    },
    problems: [
      {
        n: 1,
        title: "Longest increasing subsequence",
        difficulty: "Hard",
        statement: `
<p>Given an array <code>nums</code>, return the length of the longest <strong>strictly</strong>
increasing subsequence. A subsequence keeps the original order but the elements need not be adjacent.</p>
<pre>[10, 9, 2, 5, 3, 7, 101, 18]  ->  4     for example 2, 3, 7, 18
[7, 7, 7]                     ->  1     equal values cannot both be used
[]                            ->  0</pre>
<p>The quadratic version, comparing each element with every earlier one, is a fine first answer. The
version worth writing keeps an array whose entry <code>k</code> is the smallest value that can end an
increasing subsequence of length <code>k + 1</code>, and places each new value with a binary search.
That array is not itself a subsequence of the input, but its length is the answer.</p>`,
        fn: "lengthOfLIS",
        params: "nums",
        tests: [
          { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, label: "basic" },
          { args: [[7, 7, 7]], expected: 1, label: "all equal" },
          { args: [[1, 2, 3, 4]], expected: 4, label: "already increasing" },
          { args: [[5, 4, 3]], expected: 1, label: "strictly decreasing" },
          { args: [[]], expected: 0, label: "empty input" },
          { args: [[0, 1, 0, 3, 2, 3]], expected: 4, label: "several competing runs", hidden: true },
        ],
        hints: [
          "For a subsequence of a given length, only the smallest possible ending value matters. Anything larger is strictly worse for the future.",
          "Keep those best endings in an array. Because a longer subsequence must end higher, that array is always sorted.",
          "For each value, binary search for the first entry that is not smaller than it, and overwrite that slot. Appending past the end is what grows the answer.",
        ],
        solution: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}`,
        skills: ["Longest increasing subsequence", "Binary search optimisation", "Prefix state"],
      },
      {
        n: 2,
        title: "Edit distance",
        difficulty: "Hard",
        statement: `
<p>Return the fewest single-character operations that turn string <code>a</code> into string
<code>b</code>. The permitted operations are inserting a character, deleting a character and
substituting one character for another, each costing one.</p>
<pre>"kitten", "sitting"  ->  3      substitute k, substitute e, insert g
"flaw",   "lawn"     ->  2      delete f, insert n
"abc",    "abc"      ->  0</pre>
<p>Build a grid of size <code>(a.length + 1)</code> by <code>(b.length + 1)</code>. Cell
<code>(i, j)</code> is the cost of turning the first <code>i</code> characters of <code>a</code> into
the first <code>j</code> of <code>b</code>. The first row and column are the costs of building from,
or deleting to, nothing.</p>`,
        fn: "editDistance",
        params: "a, b",
        tests: [
          { args: ["kitten", "sitting"], expected: 3, label: "basic" },
          { args: ["flaw", "lawn"], expected: 2, label: "one delete and one insert" },
          { args: ["abc", "abc"], expected: 0, label: "identical strings" },
          { args: ["", "abc"], expected: 3, label: "empty source" },
          { args: ["abc", ""], expected: 3, label: "empty target" },
          { args: ["", ""], expected: 0, label: "both empty" },
          { args: ["horse", "ros"], expected: 3, label: "shorter target", hidden: true },
        ],
        hints: [
          "Start with the easy rows: turning nothing into j characters costs j, and turning i characters into nothing costs i.",
          "When the two current characters match, no new operation is needed at this step.",
          "Otherwise pay one on top of the cheapest of the three neighbours: the diagonal is a substitution, the cell above is a deletion, the cell to the left is an insertion.",
        ],
        solution: `function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  let prev = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const cur = new Array(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1];
      } else {
        let best = prev[j - 1];
        if (prev[j] < best) best = prev[j];
        if (cur[j - 1] < best) best = cur[j - 1];
        cur[j] = best + 1;
      }
    }
    prev = cur;
  }
  return prev[n];
}`,
        skills: ["Two-sequence alignment", "Edit operations", "Prefix state"],
      },
    ],
  },

  5051: {
    topicId: 5051,
    title: "Mock interview: two problems, 45 minutes",
    summary:
      "Run the whole loop under real time pressure: clarify, pick the pattern, state the bound, code it, test it, " +
      "and recover deliberately when you stall.",
    concepts: [
      "Clarifying the problem",
      "Pattern recognition under pressure",
      "Narrating the plan",
      "Complexity on demand",
      "Testing before you claim to be done",
    ],
    glossary: {
      "Clarifying question":
        "A question that changes your solution depending on the answer. Anything else is stalling and is visible as such.",
      "Brute force baseline":
        "The obvious correct solution, stated aloud with its cost, which buys you credit and a fallback before you optimise.",
      "Pattern cue":
        "A phrase in the problem statement that maps to a technique, such as contiguous plus longest suggesting a sliding window.",
      "Dry run": "Walking your finished code over a small input by hand, which is where most remaining bugs surface.",
      "Recovery move":
        "A deliberate action when stuck: restate the problem, try the smallest input, or solve a simpler version first.",
      "Signal": "What the interviewer is scoring: problem solving, coding, verification and communication, not just the final answer.",
      Timebox: "A decision made in advance about how long a phase may take, which prevents one stall consuming the session.",
    },
    body: {
      Beginner: `
<p>This session is two problems in forty-five minutes. That is roughly twenty minutes each with five
minutes of overhead, and the clock is the part most people have never practised against.</p>

<h2>A plan for each problem</h2>
<ul>
  <li><strong>Two minutes: understand it.</strong> Repeat the question in your own words. Ask about the
      things that change your answer: can the input be empty, can values repeat, can they be negative,
      how big can it get.</li>
  <li><strong>Three minutes: say the slow way.</strong> Describe the obvious solution and its cost out
      loud. You now have something correct to fall back on, and the interviewer knows you understood
      the problem.</li>
  <li><strong>Three minutes: find the pattern.</strong> Ask which of the patterns in this course fits.
      Contiguous and longest suggests a window. Pairs on sorted data suggests two pointers. Nearest
      larger suggests a stack.</li>
  <li><strong>Ten minutes: write it.</strong> Talk while you type. Silence reads as being lost.</li>
  <li><strong>Two minutes: test it.</strong> Empty input, one element, all equal, the example from the
      question.</li>
</ul>

<h2>If you get stuck</h2>
<p>Being stuck is normal and is not the end of the interview. What is scored is what you do next. Say
plainly that you are stuck and what you have tried. Try the smallest possible input by hand. Solve an
easier version, for example with sorted input or without the extra constraint, then add the constraint
back.</p>

<h2>The most common avoidable mistakes</h2>
<p>Starting to code before understanding the question. Going quiet for four minutes. Saying "done"
without running a single example. None of these are about algorithms, and all three cost more marks
than a suboptimal solution does.</p>

<aside class="tip">Practise with a timer running and a real editor with no autocomplete. The skill you
are building is performing under the clock, and that is not the skill you build by reading solutions.</aside>
`,
      Intermediate: `
<p>The assessment is not "did you produce the optimal solution". Every structured rubric scores four
separate things, and a candidate who solves both problems in silence loses to one who solves one and a
half while communicating well.</p>

<h2>What is actually scored</h2>
<ul>
  <li><strong>Problem solving.</strong> Did you get to a reasonable approach, and how? A guided route to the answer scores better than an unexplained leap to a memorised one.</li>
  <li><strong>Coding.</strong> Is the code clean, correctly bounded, sensibly named, and does it compile in your head?</li>
  <li><strong>Verification.</strong> Did you test it yourself, or did the interviewer have to find the bug?</li>
  <li><strong>Communication.</strong> Could a colleague follow your reasoning in real time?</li>
</ul>

<h2>Clarifying questions that are worth asking</h2>
<p>A good clarifying question changes your solution. "Can the array be empty" changes your base case.
"Are the values bounded" decides whether counting sort is available. "Is the input sorted" decides
between two pointers and a hash map. "Do you want the value or the actual subsequence" decides whether
you need a parent array. Asking whether the input is "valid" changes nothing and reads as filler.</p>

<h2>Narrating without waffling</h2>
<p>Three sentences before you type: what the state or the window is, why the approach is correct, and
what the bound is. For example: "I will keep a window with no repeated character, using a map from
character to its last index. When I see a repeat inside the window I move the left edge past it. That is
one pass, O(n) time and O(k) space in the alphabet size." That is the entire design, and it takes fifteen
seconds.</p>

<h2>Handling the follow-up</h2>
<p>Nearly every interviewer has a prepared extension: make it streaming, make it constant space, what if
the input does not fit in memory, what if there are duplicates. Do not treat these as failures of your
first answer; they are the part of the session where the level is decided. If you do not know, say what
you would measure or which structure you would reach for and why.</p>

<h2>Managing the second problem</h2>
<p>If the first problem takes thirty minutes, the second is a design conversation rather than a full
implementation, and that is fine as long as you say so: state the approach, the bound, and the tricky
case, and write the core loop rather than the boilerplate. Deciding that consciously is much stronger
than running out of time by accident.</p>
`,
      Advanced: `
<p>At senior level the two problems are usually chosen so that the naive answer is easy and the
interesting behaviour is in the constraints. The differentiators are the ones below.</p>

<h2>Complexity on demand, including space</h2>
<p>Be able to state, unprompted, worst case time, expected time where they differ, and auxiliary space
including the recursion stack. Then state the next question yourself: "this is O(n log n) because of the
sort; if the values are bounded I could count instead and get linear". Volunteering the trade-off is the
single clearest senior signal available in a coding round.</p>

<h2>Test design as a demonstration</h2>
<p>Do not run the given example first. Run the degenerate cases: empty, one element, all identical, all
distinct, already sorted, reverse sorted, and the boundary of any window or capacity parameter. Say why
each one is interesting as you run it. This converts testing from a formality into evidence that you
know where your own code is fragile, and it frequently finds the off-by-one before the interviewer
does.</p>

<h2>Recovering from a wrong approach</h2>
<p>If your chosen pattern is wrong, the expensive failure is defending it. State the counterexample that
breaks it, say what property it relied on, and name the pattern that does hold. "I assumed a window
works, but with negative numbers a longer window can have a smaller sum, so the shrink rule is invalid;
this needs prefix sums with a hash map" takes ten seconds and recovers most of the lost credit, because
it demonstrates exactly the reasoning the round is testing.</p>

<h2>Choosing the language you actually know</h2>
<p>Use the language whose standard library you can use without thinking. Time lost to remembering
whether a sort is stable, or how to get a default value from a map, is time not spent on the problem.
Know the cost of the operations you reach for: sorting is n log n and allocates, shift on a large array
is linear, string concatenation in a loop is quadratic in some engines. Interviewers notice a candidate
who avoids those without comment.</p>
`,
      Expert: `
<p>The coding round is a low-resolution instrument, and understanding its failure modes is what lets a
strong engineer perform well in it rather than being surprised by it.</p>

<h2>What the format actually measures</h2>
<p>Research on structured interviews consistently finds that the reliability comes from the structure,
not from the content: the same rubric applied consistently by two interviewers agrees far more often
than two unstructured conversations do. The practical consequence for a candidate is that the rubric
categories, not the problem, are the target. Time spent making your reasoning legible is time spent
directly on the thing being measured, which is why narration outperforms speed.</p>

<h2>The calibration problem</h2>
<p>The problem you are given is calibrated against previous candidates, not against difficulty in the
abstract, and the interviewer knows roughly how far a hire-level candidate gets in the time. This means
partial progress on a hard problem can outscore a complete solution to an easy one, and it means an
instant memorised answer produces less signal than a reasoned derivation, which is why interviewers
follow up a fast answer with a variant. Treat the follow-up as the real question.</p>

<h2>Running your own mock properly</h2>
<ul>
  <li><strong>Record yourself.</strong> The gap between what you think you explained and what you said aloud is the largest single source of improvement, and it is invisible without a recording.</li>
  <li><strong>Use unseen problems.</strong> A problem you have read the solution to measures recall, not problem solving, and it trains the wrong reflex.</li>
  <li><strong>Timebox with a visible clock</strong> and stop hard at the limit rather than finishing in your own time, since the whole point is performance under the constraint.</li>
  <li><strong>Review against the rubric</strong>, not against the answer: where did you go quiet, which clarifying question would have saved five minutes, which test would have caught the bug first.</li>
</ul>

<h2>What the preparation advice gets wrong</h2>
<ul>
  <li><strong>"Do five hundred problems."</strong> Volume without pattern extraction produces recognition of specific problems and no transfer. The course is deliberately organised by pattern for that reason: twelve patterns with three variants each beats five hundred solved once.</li>
  <li><strong>"Always find the optimal solution."</strong> A correct, tested, clearly explained O(n log n) beats an untested O(n) with an off-by-one, every time, because the rubric weights verification.</li>
  <li><strong>"Do not talk while coding."</strong> Advice imported from ordinary programming, where it is correct. Here the communication channel is half the assessment.</li>
  <li><strong>"Interviewers want to see you struggle."</strong> They want to see how you behave when stuck, which is a different thing and is trainable: state the blockage, shrink the problem, try the smallest case.</li>
</ul>
`,
    },
  },
};

export default CURRICULUM;
