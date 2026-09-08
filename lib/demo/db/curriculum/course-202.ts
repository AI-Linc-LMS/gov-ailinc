/**
 * Course 202: Python for Data Science.
 *
 * Authored teaching content for all fifteen topics: four genuinely different
 * reading tiers per topic, a quiz where the course promises one, and coding
 * problems that are about the topic they sit under.
 *
 * The judge is the browser, so every problem is a pure JavaScript function.
 * Where the subject is pandas, NumPy or scikit-learn, the problem asks the
 * learner to compute the thing those libraries compute (a group-by, a window
 * rank, a leakage-free split, a Gini split search) rather than to recite an
 * API call. The mechanism is the point; the import line is not.
 */

import type { CourseCurriculum } from "./types";

const CURRICULUM: CourseCurriculum = {
  5021: {
    topicId: 5021,
    title: "Comprehensions, generators and iterators",
    summary:
      "Write transformations as single expressions instead of accumulator loops, and switch to generators when a dataset is too large, too slow or too open ended to hold in memory all at once.",
    concepts: [
      "List comprehension",
      "Generator expression",
      "Lazy evaluation",
      "The iterator protocol",
      "Memory footprint",
    ],
    glossary: {
      Iterable:
        "Any object Python can ask for a fresh iterator, which is what a for loop does before it starts. Lists, files, dictionaries and generators are all iterable.",
      Iterator:
        "An object with a __next__ method that hands back one item at a time and raises StopIteration when it has no more. An iterator is consumed as you read it.",
      "List comprehension":
        "An expression of the form [f(x) for x in source if condition] that builds a whole list in one pass and holds every result in memory.",
      "Generator expression":
        "The same syntax with round brackets instead of square ones. It produces values one at a time on demand and never materialises the full sequence.",
      "Lazy evaluation":
        "Computing a value only at the moment something asks for it. A lazy pipeline touches the smallest number of source items that can satisfy the request.",
      yield:
        "The keyword that turns a function into a generator function. Calling it returns a generator; execution pauses at each yield and resumes where it left off.",
      Exhaustion:
        "The state of an iterator that has already produced all its values. Looping over it a second time yields nothing, which is the most common generator bug.",
      "Memory footprint":
        "How much of the dataset is resident at once. A list comprehension over ten million rows holds ten million objects; a generator holds one.",
    },
    body: {
      Beginner: `<p>Most data work is the same three moves over and over: take a collection, keep some of it, change each item that survives. In plain Python you can write that as a loop with an empty list and an <code>append</code> call. It works, but by the time you have written four of them the loop stops carrying any meaning: the shape of the code no longer tells you what the transformation was.</p>
<p>A <strong>list comprehension</strong> collapses those four lines into one expression that reads in the order you think:</p>
<pre>squares = [x * x for x in numbers if x % 2 == 0]</pre>
<p>Read it as a sentence. Take <code>x</code> from <code>numbers</code>, keep it only if it is even, and put <code>x * x</code> in the new list. The result is an ordinary list, built immediately, sitting in memory.</p>
<h2>When a list is the wrong container</h2>
<p>Now suppose <code>numbers</code> is a log file with forty million lines and you only want the first ten matches. Building the whole list would read every line and hold every result, then throw almost all of it away. Swapping the square brackets for round ones gives you a <strong>generator expression</strong> instead:</p>
<pre>squares = (x * x for x in numbers if x % 2 == 0)</pre>
<p>Nothing has been computed yet. A generator is a promise to produce values when asked. Each time you take one item, it reads just far enough down the source to find the next match, hands it over, and stops again.</p>
<aside class="tip">A generator can only be walked once. If you loop over it and then loop again, the second loop sees an empty sequence, because the values were consumed the first time.</aside>
<p>The rule of thumb for now: if you want the whole thing and it fits comfortably in memory, use a list. If the source is huge, slow to read, or you only need the first few results, use a generator.</p>`,
      Intermediate: `<p>Comprehensions are not shorthand for loops; they are a different way of describing the same work. A loop describes a procedure, step by step, with a mutable accumulator you have to keep in your head. A comprehension describes the result, and the accumulator disappears. That difference matters in data work because a pipeline is usually a chain of small transformations, and the version without accumulators is the one you can still read six months later.</p>
<h2>The three forms and what each costs</h2>
<p>The bracket you choose decides what gets built and when:</p>
<ul>
<li><code>[f(x) for x in src]</code> builds a list eagerly. Every element exists at once, indexing works, and you can iterate it repeatedly.</li>
<li><code>{f(x) for x in src}</code> builds a set, deduplicating as it goes and discarding order.</li>
<li><code>(f(x) for x in src)</code> builds nothing. It returns a generator object whose work happens as you consume it.</li>
</ul>
<p>Nested loops read outer to inner, exactly as you would write them in a for statement, which surprises people who expect the reversed order:</p>
<pre>flat = [cell for row in table for cell in row]</pre>
<h2>Laziness has an observable cost model</h2>
<p>The reason to reach for a generator is rarely elegance. It is that the number of source items you touch becomes proportional to the number of results you actually take, not to the size of the source. If you pipe a generator into <code>next()</code> ten times, the source is read only far enough to yield ten matches. If you pipe it into <code>sum()</code>, the whole source is read but only one value is ever resident.</p>
<p>That is also the trap. Because nothing runs until consumption, an exception raised inside a generator surfaces at the point of consumption, which may be several functions away from where the generator was defined. Late binding is a related surprise: a generator that closes over a loop variable sees the value that variable has at consumption time, not at definition time.</p>
<h2>Generator functions</h2>
<p>Anything a generator expression can do, a generator function can do with more room to work in. Writing <code>yield</code> anywhere in a function body changes what calling it means: you get a generator back, and the body runs only as values are pulled from it.</p>
<pre>def chunks(rows, size):
    batch = []
    for row in rows:
        batch.append(row)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch</pre>
<p>That function will happily chunk a file larger than memory, because at any moment it holds one batch and one row.</p>
<aside class="tip">Reach for a list comprehension when you need the result more than once, when you need its length, or when you need to index it. Reach for a generator when you need it once, in order, and the source is expensive.</aside>
<p>One habit worth forming early: keep comprehensions to a single filter and a single transformation. The moment you want two conditions, a nested ternary and a helper call, the loop you were avoiding has become the more readable option.</p>`,
      Advanced: `<p>The interesting properties of comprehensions are the ones that only show up under load or under mutation. A comprehension compiles to an implicit function with its own scope, so the loop variable does not leak, and rebinding a name inside it does not touch the enclosing frame. A generator expression compiles to that same implicit function with the body suspended, and its first source iterable is evaluated eagerly at creation time while everything downstream is deferred.</p>
<h2>Eager first clause, lazy rest</h2>
<p>That asymmetry is a genuine failure mode. In <code>(row for row in load(path) if row.ok)</code>, the call to <code>load(path)</code> happens the moment the generator is constructed, so a missing file raises immediately, while a malformed row raises later, wherever the generator is finally drained. Code that wraps construction in a try block and consumption somewhere else will catch one class of error and miss the other.</p>
<h2>Consumption is destructive and single pass</h2>
<p>Any function that walks an iterator moves it permanently. A partially consumed generator handed to a second consumer starts from wherever the first one stopped, and a generator that has raised StopIteration stays exhausted. This is why passing a generator to a function that internally does two passes, a length check followed by iteration, quietly produces an empty result rather than an error.</p>
<ul>
<li>Chained generators compose without buffering: filter into map into batch costs one item of memory per stage, not one copy of the dataset per stage.</li>
<li><code>itertools.tee</code> buffers, so tee-ing a stream and consuming one branch to the end holds the entire difference between the branches in memory.</li>
<li>A generator holding an open file keeps that handle open until it is exhausted or closed, which matters when thousands are created in a loop.</li>
</ul>
<h2>Performance, honestly</h2>
<p>A list comprehension is typically faster than the equivalent explicit loop, because the append is done by the interpreter rather than through an attribute lookup on each pass. A generator is not faster per item; it is often slightly slower, because each value costs a resume and a suspend. What it saves is allocation and peak resident size. If the dataset fits in memory and you will traverse it more than once, materialising into a list first is the correct optimisation, and converting back and forth repeatedly is the mistake.</p>
<aside class="tip">Do not use a comprehension purely for a side effect. <code>[log(x) for x in rows]</code> allocates a list of None values you never look at; a plain for loop states the intent and allocates nothing.</aside>`,
      Expert: `<p>A comprehension is a compilation strategy, not sugar. CPython emits a nested code object for the comprehension body and calls it with the outermost iterable already resolved, which is why the loop variable is scoped to that frame and why the first iterable is evaluated eagerly. Python 3.12 inlined list, set and dict comprehensions back into the enclosing frame, removing the per-comprehension function call while preserving the scoping guarantees; generator expressions remain a separate frame because suspension requires one.</p>
<h2>The protocol underneath</h2>
<p>Everything here rests on two methods. An iterable supplies <code>__iter__</code>; an iterator supplies <code>__iter__</code> returning itself plus <code>__next__</code> raising StopIteration when finished. Generators are simply the most convenient way to obtain a correct iterator, and the correctness that matters is idempotent exhaustion: once StopIteration has been raised, every later call must raise it again. Hand-written iterators that reset themselves after exhaustion break every consumer that relies on the sentinel being final.</p>
<h2>Where laziness leaks into semantics</h2>
<p>PEP 479 changed StopIteration raised inside a generator body from silent termination to a RuntimeError, because the old behaviour let an unrelated exhausted iterator truncate an outer stream with no diagnostic. That fix removes a whole class of silent data loss, and it is worth knowing precisely because the failure it prevents produced short results rather than errors.</p>
<p>The interaction with exception handling is subtler than it looks. A generator suspended at a yield holds its frame, including any active try or with block, until it is resumed, closed or collected. If it is never drained, cleanup runs at close time, which under reference counting is prompt and under other collectors is not. Long-lived pipelines that open resources inside generators and abandon them early accumulate handles for reasons that never appear in the code path being read.</p>
<h2>The tradeoff the tutorials skip</h2>
<ul>
<li>Laziness converts peak memory into interleaved latency. A streaming pipeline never stalls to build a large list, but every stage pays a suspend and resume per element, so throughput on small in-memory data is worse than the eager version.</li>
<li>Laziness defeats vectorisation. Once numerical data is inside a Python generator it is being processed one boxed object at a time, and the array libraries in the next topic can no longer batch it. Stream at the boundary, materialise into arrays for the arithmetic.</li>
<li>Laziness moves errors in time. Validation inside a generator does not run when the generator is built, so a pipeline that looks validated at construction is validated only at drain.</li>
</ul>
<aside class="tip">The practical boundary in a data pipeline: generators for ingest, where the source is unbounded and rows are discarded early, and dense arrays or frames from the first arithmetic onwards, where per element interpreter overhead would otherwise dominate.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Lazy pipeline with a consumption counter",
        difficulty: "Easy",
        statement: `<p>Model what a Python generator expression does when it is only partly consumed. Given an array of integers and a count <code>n</code>, produce the squares of the even numbers, stopping the moment you have <code>n</code> of them.</p>
<p>Return an object with two keys:</p>
<ul>
<li><code>values</code>: the squares you produced, in source order, at most <code>n</code> of them.</li>
<li><code>consumed</code>: how many items of <code>nums</code> you had to look at. This is the whole point of laziness, so a solution that scans the entire array and then slices will produce the right <code>values</code> and the wrong <code>consumed</code>.</li>
</ul>
<p>Rules:</p>
<ul>
<li>If <code>n</code> is zero or negative, look at nothing: return <code>{ values: [], consumed: 0 }</code>.</li>
<li>If there are fewer than <code>n</code> even numbers, return everything you found; <code>consumed</code> is then the length of the array.</li>
<li>Zero is even, and negative even numbers count.</li>
</ul>
<pre>lazyPipeline([1, 2, 3, 4, 5, 6], 2)
// { values: [4, 16], consumed: 4 }</pre>`,
        fn: "lazyPipeline",
        params: "nums, n",
        tests: [
          { args: [[1, 2, 3, 4, 5, 6], 2], expected: { values: [4, 16], consumed: 4 }, label: "basic" },
          { args: [[2, 4, 6, 8, 10], 1], expected: { values: [4], consumed: 1 }, label: "stops at the first match" },
          { args: [[1, 3, 5], 3], expected: { values: [], consumed: 3 }, label: "fewer matches than requested" },
          { args: [[2, 4, 6], 0], expected: { values: [], consumed: 0 }, label: "nothing requested" },
          { args: [[], 5], expected: { values: [], consumed: 0 }, label: "empty input", hidden: true },
          { args: [[-3, -2, 0, 7, 8], 3], expected: { values: [4, 0, 64], consumed: 5 }, label: "negatives and zero", hidden: true },
        ],
        hints: [
          "The counter has to increase for every item you inspect, including the odd ones you reject. Count at the top of the loop, not inside the filter.",
          "You need to leave the loop as soon as values.length reaches n, so the check belongs immediately after you push, not at the top of the next iteration.",
          "Guard n <= 0 before the loop and return zero consumed. Then loop with break: increment consumed, test x % 2 === 0, push x * x, and break when values.length === n.",
        ],
        solution: `function lazyPipeline(nums, n) {
  const values = [];
  let consumed = 0;
  if (n <= 0) return { values, consumed };
  for (const x of nums) {
    consumed += 1;
    if (x % 2 === 0) {
      values.push(x * x);
      if (values.length === n) break;
    }
  }
  return { values, consumed };
}`,
        skills: ["Lazy evaluation", "Generator expression", "The iterator protocol"],
      },
    ],
  },

  5022: {
    topicId: 5022,
    title: "NumPy arrays and vectorised thinking",
    summary:
      "Stop writing element by element loops over numbers and start expressing arithmetic over whole arrays, so that shape, dtype and broadcasting do the work the loop used to do.",
    concepts: [
      "The ndarray",
      "dtype",
      "Broadcasting",
      "Vectorisation",
      "Views versus copies",
      "Axis reductions",
    ],
    glossary: {
      ndarray:
        "NumPy's core type: a fixed size block of memory holding elements of one dtype, plus a shape and a set of strides describing how to walk it.",
      dtype:
        "The element type of an array, such as int64 or float32. It is chosen once for the whole array and decides both memory use and overflow behaviour.",
      Shape:
        "A tuple giving the length of the array along each axis. A shape of (3, 4) is three rows of four columns.",
      Broadcasting:
        "The rule that lets arrays of different shapes combine by virtually stretching size one axes, so a (3, 4) array can be added to a (4,) array without copying.",
      Axis: "The dimension a reduction runs along. Summing with axis=0 collapses the rows and leaves one value per column.",
      Vectorisation:
        "Expressing a computation as whole array operations so the loop happens inside compiled code rather than in the Python interpreter.",
      View: "An array that shares memory with another array. Slicing produces a view, so writing to the slice changes the original.",
      "Fancy indexing":
        "Indexing with an array of positions or a boolean mask. Unlike slicing it always returns a copy, never a view.",
    },
    body: {
      Beginner: `<p>A Python list can hold anything: a number, a word, another list. That flexibility has a price. Every element is a separate object scattered in memory, and every arithmetic operation goes through the interpreter one item at a time.</p>
<p>A NumPy <strong>array</strong> gives up the flexibility to buy speed. Every element is the same type, and they sit in one continuous block of memory, like a row of identical boxes rather than a pile of assorted parcels.</p>
<pre>import numpy as np
prices = np.array([10.0, 12.5, 9.0, 30.0])
with_tax = prices * 1.2</pre>
<p>Notice what did not appear: no loop. Multiplying an array by a number applies the multiplication to every element. This is called <strong>vectorisation</strong>, and it is the habit this whole topic is trying to build.</p>
<h2>Shape</h2>
<p>An array knows its own dimensions, called its <strong>shape</strong>. A shape of <code>(4,)</code> is four numbers in a line. A shape of <code>(3, 4)</code> is a grid with three rows and four columns. You can ask for a whole row or a whole column without writing a loop:</p>
<pre>grid = np.array([[1, 2, 3], [4, 5, 6]])
grid.shape     # (2, 3)
grid[0]        # first row: [1 2 3]
grid[:, 1]     # second column: [2 5]
grid.sum()     # 21, everything added up</pre>
<h2>Asking a question of the whole array</h2>
<p>Comparing an array to a number gives you an array of true and false values, one per element. Feeding that back in as an index keeps only the elements where the answer was true:</p>
<pre>hot = temps > 30
temps[hot]</pre>
<aside class="tip">If you find yourself writing a for loop over numbers in an array, pause. There is almost always an operation that does it for the whole array at once, and it will be both shorter and far faster.</aside>
<p>One warning to carry forward: taking a slice of an array does not copy it. The slice looks at the same memory, so writing into the slice changes the original array. That is a feature, and it is also the source of the most confusing bug you will hit this week.</p>`,
      Intermediate: `<p>NumPy is worth learning properly because pandas, scikit-learn, SciPy and every plotting library are built on it. A DataFrame column is an array wearing a label. Understanding shape, dtype and broadcasting is what makes the rest of the stack stop feeling arbitrary.</p>
<h2>The three attributes that explain most errors</h2>
<p>An array is a block of memory plus metadata. Three pieces of that metadata account for most of the confusion:</p>
<ul>
<li><strong>shape</strong> decides whether an operation is legal at all. Most NumPy tracebacks are shape mismatches wearing different words.</li>
<li><strong>dtype</strong> decides precision and overflow. An int8 array that reaches 127 wraps to negative silently, and an int array assigned 0.5 truncates to 0 without warning.</li>
<li><strong>strides</strong> decide whether an operation can be done as a view. Transposing or slicing changes strides and copies nothing; reshaping across a non contiguous layout has to copy.</li>
</ul>
<h2>Broadcasting is a rule, not magic</h2>
<p>When two arrays have different shapes, NumPy aligns them from the right and, for each axis, requires that the lengths match or that one of them is 1. An axis of length 1 is virtually repeated. So a (100, 3) array of samples minus a (3,) array of column means works, and it centres each column, because the (3,) is treated as (1, 3) and stretched down the rows.</p>
<pre>X = np.random.randn(100, 3)
X_centred = X - X.mean(axis=0)          # (100,3) - (3,) works
X_rowless = X - X.mean(axis=1)          # (100,3) - (100,) fails
X_rowless = X - X.mean(axis=1, keepdims=True)   # (100,3) - (100,1) works</pre>
<p>That third line is the single most useful trick in this topic. <code>keepdims=True</code> preserves the collapsed axis with length 1 so the result is still broadcastable against the original.</p>
<h2>Axis arguments say what disappears</h2>
<p>Read <code>axis=0</code> as "collapse the rows", which leaves one value per column, and <code>axis=1</code> as "collapse the columns", which leaves one value per row. Learners routinely read it as "operate along" and get the transpose of what they wanted, then patch it with a transpose, which works until the array is not square.</p>
<h2>Views, copies and the assignment that vanishes</h2>
<p>Basic slicing returns a view sharing memory. Boolean masks and integer arrays return copies. This matters when you assign:</p>
<pre>a[a > 5] = 0        # writes through, the original changes
b = a[a > 5]        # b is a copy, editing b leaves a alone</pre>
<aside class="tip">Standardising columns is the canonical vectorised idiom and it appears again in feature scaling later in the course: subtract the column mean, divide by the column standard deviation, and let broadcasting apply it to every row at once.</aside>
<p>The performance argument is real but secondary. Vectorised code is usually ten to a hundred times faster than the loop, because the loop happens in compiled code over a contiguous buffer. The better reason is that the vectorised version states the mathematics, and a reader can check it against the formula.</p>`,
      Advanced: `<p>Once the basics are automatic, the questions that remain are about memory layout, temporaries and where precision is lost. Those decide whether a correct computation is also a usable one.</p>
<h2>Temporaries dominate large expressions</h2>
<p>An expression such as <code>(a - b) ** 2 / c</code> materialises a full sized temporary at every stage. On arrays that fill a meaningful fraction of RAM, the peak is several times the size of the inputs even though the result is one array. In place operators and out parameters remove those temporaries:</p>
<pre>np.subtract(a, b, out=tmp)
np.multiply(tmp, tmp, out=tmp)
np.divide(tmp, c, out=tmp)</pre>
<p>The cost is readability and the risk of aliasing: writing into an array that is also an input, or into a view of one, gives undefined element ordering guarantees for overlapping regions.</p>
<h2>Contiguity is a real cost, not a formality</h2>
<p>Reductions along the fast axis of a C contiguous array stream through cache; the same reduction along the slow axis strides through memory and can be several times slower on identical data. Transposing is free because it only rewrites strides, but the operation that follows it may then hit the slow path, and a strategically placed <code>np.ascontiguousarray</code> can be faster than the copy it costs.</p>
<h2>Numerical behaviour worth knowing</h2>
<ul>
<li>Summation uses pairwise accumulation, so a naive float32 sum over ten million elements is far more accurate in NumPy than the equivalent Python loop, but it is still not exact and is not associative.</li>
<li>Integer arrays do not promote on overflow. They wrap, silently, with the width you chose at creation.</li>
<li>NaN propagates through everything, so a single missing value turns a whole column mean into NaN. The nan aware variants exist precisely for this and they are slower for a reason.</li>
<li>Comparing floats for equality after arithmetic is a bug; use a tolerance based comparison.</li>
</ul>
<h2>Where vectorisation stops</h2>
<p>Not everything vectorises. Sequential dependencies, where element i needs the finished value of element i minus 1, do not, and reaching for a Python loop over an array is the worst of both worlds. The escape hatches are cumulative functions, stride tricks for sliding windows, and compiling the loop rather than interpreting it.</p>
<aside class="tip">Before optimising layout, measure peak memory as well as time. The version that is thirty per cent slower and holds one copy instead of four is often the only one that finishes on the real dataset.</aside>`,
      Expert: `<p>The ndarray is a strided view over a flat buffer, and almost every behaviour that looks like a special case follows from that one representation. The object carries a data pointer, a shape tuple, a stride tuple in bytes, a dtype and a set of flags. Slicing manipulates the pointer, shape and strides. Transposing permutes shape and strides. Reshaping succeeds without copying exactly when the requested shape can be expressed in the existing stride pattern, which is why a reshape after a transpose may silently allocate.</p>
<h2>Broadcasting as a stride assignment</h2>
<p>Broadcasting is implemented by setting the stride of a stretched axis to zero, so the same memory is read repeatedly without allocation. This is why broadcasting is free in memory for reads and why writing through a broadcast view is prohibited: multiple logical positions would alias one physical element. It also explains the classic memory explosion, where subtracting a (n, 1) array from a (1, m) array produces a genuine n by m result that no one asked for.</p>
<h2>Ufunc dispatch and the loop that actually runs</h2>
<p>Every elementwise operation resolves to a ufunc, which selects an inner loop from its registered type signatures after applying promotion rules. NEP 50, adopted in NumPy 2.0, changed those rules so that a Python scalar no longer upcasts an array: a float32 array times 2.0 now stays float32. Pipelines that quietly relied on the old value based promotion to reach float64 lost precision at the version boundary without any error, and mixed precision code written before that change should be re-verified rather than assumed.</p>
<h2>What the documentation understates</h2>
<ul>
<li>Fancy indexing is not merely a copy: the gather is order dependent, and repeated indices in an assignment target resolve to last write wins rather than accumulation. Accumulating requires the explicit add.at, which is dramatically slower and correct.</li>
<li>Views keep the entire base buffer alive. A ten element slice of a two gigabyte array retains two gigabytes until the slice is copied, which is the usual cause of memory that will not fall after filtering.</li>
<li>Sliding window tricks built on stride manipulation produce read only overlapping views by default, and any writable variant of them aliases in ways that break the parallel inner loops.</li>
<li>Reduction order is unspecified for some multi axis cases, so bitwise reproducibility across machines or thread counts is not guaranteed even though results agree to tolerance.</li>
</ul>
<aside class="tip">When a numerical result differs between two machines, check dtype promotion and reduction order before suspecting the algorithm. The arithmetic is usually right; the type it happened in usually is not what you assumed.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Standardise every column, the vectorised way",
        difficulty: "Medium",
        statement: `<p>Implement column standardisation, the operation NumPy would express as <code>(X - X.mean(axis=0)) / X.std(axis=0)</code>. The point is to think in axes: the statistics are per column, and each row is then adjusted by them.</p>
<p>You are given a rectangular matrix as an array of equal length rows. Return an object with:</p>
<ul>
<li><code>means</code>: the mean of each column.</li>
<li><code>stds</code>: the population standard deviation of each column, dividing by <code>n</code>, not by <code>n - 1</code>.</li>
<li><code>z</code>: the matrix with every value replaced by <code>(value - columnMean) / columnStd</code>.</li>
</ul>
<p>Rules:</p>
<ul>
<li>Round every number in the output to 4 decimal places using <code>Math.round(v * 1e4) / 1e4</code>. Compute with unrounded statistics and round only the values you return.</li>
<li>If a column has a standard deviation of exactly 0, every z value in that column is <code>0</code>. Dividing by zero would give Infinity or NaN, and a constant column carries no information anyway.</li>
<li>An empty matrix returns empty arrays for all three keys.</li>
</ul>
<pre>zscoreColumns([[1, 10], [2, 20], [3, 30]])
// means [2, 20], stds [0.8165, 8.165], z [[-1.2247, -1.2247], [0, 0], [1.2247, 1.2247]]</pre>`,
        fn: "zscoreColumns",
        params: "matrix",
        tests: [
          { args: [[[1, 10], [2, 20], [3, 30]]], expected: { means: [2, 20], stds: [0.8165, 8.165], z: [[-1.2247, -1.2247], [0, 0], [1.2247, 1.2247]] }, label: "basic" },
          { args: [[[5, 1], [5, 3], [5, 5]]], expected: { means: [5, 3], stds: [0, 1.633], z: [[0, -1.2247], [0, 0], [0, 1.2247]] }, label: "constant column" },
          { args: [[[7, 8, 9]]], expected: { means: [7, 8, 9], stds: [0, 0, 0], z: [[0, 0, 0]] }, label: "single row" },
          { args: [[[-2, 4], [0, 4], [2, 10], [4, 2]]], expected: { means: [1, 5], stds: [2.2361, 3], z: [[-1.3416, -0.3333], [-0.4472, -0.3333], [0.4472, 1.6667], [1.3416, -1]] }, label: "negative values", hidden: true },
          { args: [[]], expected: { means: [], stds: [], z: [] }, label: "empty matrix", hidden: true },
        ],
        hints: [
          "Work column by column first. You need one mean and one standard deviation per column before you can touch any row.",
          "Population standard deviation is the square root of the average squared deviation from the mean, so divide the sum of squared deviations by n.",
          "Keep two unrounded arrays of statistics for the arithmetic, and round only when you build the returned means, stds and z. Rounding the mean first shifts every z value.",
        ],
        solution: `function zscoreColumns(matrix) {
  const round = (v) => Math.round(v * 1e4) / 1e4;
  const rows = matrix.length;
  if (rows === 0) return { means: [], stds: [], z: [] };
  const cols = matrix[0].length;
  const rawMeans = [];
  const rawStds = [];
  for (let c = 0; c < cols; c++) {
    let sum = 0;
    for (let i = 0; i < rows; i++) sum += matrix[i][c];
    const mean = sum / rows;
    let acc = 0;
    for (let i = 0; i < rows; i++) {
      const d = matrix[i][c] - mean;
      acc += d * d;
    }
    rawMeans.push(mean);
    rawStds.push(Math.sqrt(acc / rows));
  }
  return {
    means: rawMeans.map(round),
    stds: rawStds.map(round),
    z: matrix.map((row) =>
      row.map((v, c) => (rawStds[c] === 0 ? 0 : round((v - rawMeans[c]) / rawStds[c]))),
    ),
  };
}`,
        skills: ["Axis reductions", "Broadcasting", "Vectorisation"],
      },
    ],
  },

  5023: {
    topicId: 5023,
    title: "Reading messy files without losing your mind",
    summary:
      "Load real world delimited files defensively: quoted fields, ragged rows, empty cells, stray whitespace and types that must not be guessed wrongly, so that parsing failures surface as data rather than as silent corruption.",
    concepts: [
      "Delimited formats",
      "Quoting and escaping",
      "Type inference",
      "Ragged rows",
      "Encoding",
      "Sentinel values",
    ],
    glossary: {
      Delimiter: "The character separating fields on a line, usually a comma or a tab. It is a convention, not a guarantee, and it appears inside data all the time.",
      Quoting:
        "Wrapping a field in double quotes so that delimiters inside it are treated as text. A literal double quote inside a quoted field is written twice.",
      "Type inference":
        "Deciding a column's type from its values. Convenient, and the source of leading zeros lost from postcodes and identifiers turned into floats.",
      "Ragged row": "A line with more or fewer fields than the header. Real exports produce these whenever a system appends a column mid month.",
      Encoding: "The byte to character mapping of the file. UTF-8 is the sane default; files exported from spreadsheets are frequently not UTF-8.",
      "Sentinel value":
        "A value that stands in for missing, such as an empty cell, NA, -999 or 1900-01-01. Sentinels that look like real values are the dangerous ones.",
      "Header row": "The first line naming the columns. It may be absent, repeated in the middle of a concatenated file, or padded with whitespace.",
      Dialect: "The combination of delimiter, quote character, escape rule and line ending that a particular producer emits.",
    },
    body: {
      Beginner: `<p>A CSV file is just text. One line per record, fields separated by commas, and a first line that usually names the columns. It looks like the simplest format in the world, and then you meet a real one.</p>
<pre>id,name,score
1,Ada,91.5
2,"Lovelace, Ada",88</pre>
<p>Look at the last line. There is a comma inside the name. If you split that line on commas you get four pieces instead of three and every column after it shifts, quietly, for that row only. The fix is the quotes: a field wrapped in double quotes keeps its commas, and the parser must respect that.</p>
<h2>The four things that go wrong</h2>
<ul>
<li><strong>Commas inside values</strong>, handled by quoting, as above.</li>
<li><strong>Empty cells</strong>, which are not zero and not the text "empty". They mean nobody wrote anything down.</li>
<li><strong>Short rows</strong>, where a line simply has fewer fields than the header promised.</li>
<li><strong>Stray spaces</strong>, so <code> 42 </code> should probably be the number 42, and <code>"Ada "</code> may or may not be the same person as <code>"Ada"</code>.</li>
</ul>
<h2>Do not guess silently</h2>
<p>Loaders try to be helpful and work out types for you. Usually that is right: <code>91.5</code> becomes a number. Sometimes it is quietly wrong, and the classic case is an identifier like <code>007</code> that becomes the number 7 and loses its leading zeros forever.</p>
<aside class="tip">Before you clean anything, look at the file. Open it in a text editor, read the first ten lines and the last ten lines. Half the surprises are visible in twenty lines of raw text.</aside>
<p>The habit to build is simple: after loading, check the number of rows and the type of every column against what you expected. A load that "worked" but produced one column of text where you expected numbers has not worked.</p>`,
      Intermediate: `<p>Ingest is where most data projects lose their integrity, and it loses it quietly. A model trained on a badly parsed file does not crash. It just answers a slightly different question than the one you asked, and nothing downstream will tell you.</p>
<h2>Declare the schema instead of accepting the guess</h2>
<p>Type inference works by sampling. Pass a large file and the loader may read only the first chunk, decide a column is integer, then meet a null or a stray text value later and either fail or promote the whole column to object. Both outcomes are worse than saying what you meant:</p>
<pre>df = pd.read_csv(
    path,
    dtype={"customer_id": "string", "postcode": "string", "amount": "float64"},
    na_values=["", "NA", "N/A", "-", "unknown", "-999"],
    keep_default_na=True,
)</pre>
<p>Two rules follow from experience. Any identifier is text, always, even when every observed value is digits, because arithmetic on it is meaningless and leading zeros are real. And any sentinel your source uses for missing must be declared, because <code>-999</code> left undeclared will average into your statistics as a large negative number.</p>
<h2>Fail loudly at the boundary</h2>
<p>The useful discipline is to make ingest assert what it believes:</p>
<ul>
<li>Row count against the source system, not against the file you loaded last week.</li>
<li>Column set exactly equal to the expected set, so a renamed or added column is an error rather than a surprise.</li>
<li>Dtypes matching the declared schema after load.</li>
<li>Uniqueness of whatever you think the key is, checked rather than assumed.</li>
</ul>
<p>Each of these is one line and each one catches a class of bug that would otherwise appear as a strange result three notebooks later.</p>
<h2>Encoding and line endings</h2>
<p>A file exported from a spreadsheet on Windows is often cp1252 rather than UTF-8, and decoding it as UTF-8 fails on the first curly apostrophe. Reading with the wrong encoding and no error gives you mojibake in string columns. Detecting encoding is guesswork, so record what the producer sends and decode explicitly.</p>
<aside class="tip">Keep the raw file immutable and write cleaning as code that runs from it. If cleaning happens by hand in a spreadsheet, the dataset can never be rebuilt and no result from it can be reproduced.</aside>
<h2>Ragged rows and how to react</h2>
<p>A short row means either a genuinely missing trailing field or a broken export. Padding it with nulls keeps the pipeline moving and hides the second case, while failing hard stops a batch on one bad line. The workable middle is to route bad rows to a quarantine file with their line numbers, load the rest, and report the count. If the quarantine is empty you have lost nothing; if it grows week on week you have found a producer bug.</p>`,
      Advanced: `<p>At scale, ingest stops being about parsing and starts being about contracts, memory and reproducibility. The parser is a solved problem; the interface between two systems that disagree about what a column means is not.</p>
<h2>Memory during load, not after</h2>
<p>Peak memory is reached inside the reader, not once the frame exists. A CSV read into a frame typically costs several times the file size, because string columns become individual Python objects and numeric columns default to 64 bit. Three levers change the peak: read in chunks and reduce as you go, narrow the dtypes at parse time rather than after, and convert low cardinality strings to a categorical representation where the column becomes codes plus a dictionary. On a column with a few hundred distinct values across millions of rows, that last one is often an order of magnitude.</p>
<h2>Stop using CSV as an internal format</h2>
<p>CSV is a fine interchange format and a poor storage format. It has no types, no column statistics, no compression worth the name, and it must be re-parsed and re-inferred on every read. A columnar format such as Parquet stores the schema with the data, reads only the columns requested, and skips row groups whose statistics rule them out. The rule that survives contact with production is simple: parse once at the boundary, validate, then persist typed. Everything downstream reads the typed artefact.</p>
<h2>Failure modes that produce no error</h2>
<ul>
<li>A concatenated export repeats the header in the middle of the file, so one row consists of column names and the whole column becomes text.</li>
<li>A quoted field containing a newline is legal, and a line based reader splits it into two broken records.</li>
<li>Locale decimal commas turn 1,5 into two fields or into the integer 15, depending on the dialect.</li>
<li>Timestamps arrive in mixed formats and the parser silently swaps day and month for every value below the thirteenth.</li>
<li>A trailing delimiter creates a phantom unnamed column that the loader helpfully indexes.</li>
</ul>
<h2>Idempotence and provenance</h2>
<p>An ingest step should be runnable twice with the same result, and should record where each row came from. Adding the source filename, the file modification time and a content hash as columns costs almost nothing and turns "which extract produced this number" from an archaeology exercise into a query.</p>
<aside class="tip">Quarantine, do not discard. A row you dropped silently is a row you can never count, and the count of bad rows over time is the most sensitive detector you have for an upstream change.</aside>`,
      Expert: `<p>The interesting property of delimited text is that it is not a format at all; it is a family of dialects with no in band way to announce which one is in use. RFC 4180 describes a convention rather than a standard, and every widely used producer deviates from it. Robust ingest therefore treats the dialect as an external declaration, not as something to be detected, because detection succeeds on the sample and fails on the tail.</p>
<h2>Where parsers actually differ</h2>
<p>Given the same bytes, mainstream readers disagree on several points: whether whitespace before an opening quote keeps the field quoted, whether a backslash escapes a quote or is literal, whether an embedded newline inside quotes is honoured in the fast path, and whether a bare quote inside an unquoted field is text or an error. High performance engines often implement a fast path that assumes no quoting and fall back on detection, so a file that parses correctly under one engine can parse differently under another with no diagnostic. Pinning both the reader and its engine is part of pinning the data.</p>
<h2>Inference is a distributional assumption</h2>
<p>Sampled inference assumes the first n rows are representative of the file. For any file produced by appending over time, that assumption is exactly wrong: schema drift lives at the end. This is why a column that was integer for eleven months becomes object in December, and why the resulting frame silently changes the semantics of every comparison against it. Declared schemas convert that from a silent type change into a load error at a known line, which is the entire value proposition.</p>
<h2>Encoding at the byte level</h2>
<p>Charset detection is statistical and unreliable on short inputs, and the single byte encodings are mutually decodable, so a cp1252 file decodes as latin-1 without any error and with wrong characters. A UTF-8 byte order mark, if present, contaminates the first header name unless the reader is told to strip it, which produces the memorable failure where one column cannot be found despite being visible on screen. Normalising to a canonical Unicode form matters as soon as keys are compared, since two visually identical strings can hold different code point sequences and will not join.</p>
<h2>What the documentation gets wrong</h2>
<ul>
<li>The advice to let the reader infer types is correct for exploration and wrong for anything scheduled, yet it is presented as the default in every tutorial.</li>
<li>Null handling defaults treat a small set of tokens as missing, which means the string NA in a genuine text column becomes missing without any warning, and the fix is to disable the default set rather than to add to it.</li>
<li>Round tripping is not guaranteed: writing a frame to CSV and reading it back changes types, loses the index unless asked, and reformats timestamps according to the writer's locale assumptions.</li>
<li>Compression and chunking interact badly with random access, so a gzipped CSV cannot be split for parallel reads while a Parquet file can, which is usually the deciding factor at volume.</li>
</ul>
<aside class="tip">Treat the loader configuration as part of the dataset definition and version it with the code. An undeclared parser default is an undocumented assumption about somebody else's system.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "A CSV parser that survives real files",
        difficulty: "Hard",
        statement: `<p>Write the parser rather than call one. Given the whole text of a small CSV file, return an array of row objects keyed by the header names.</p>
<p>The dialect you must implement:</p>
<ul>
<li>Records are separated by <code>\\n</code>. Lines that are empty or contain only whitespace are skipped entirely, including before the header.</li>
<li>Fields are separated by commas. The first surviving line is the header.</li>
<li>A field may be wrapped in double quotes. Inside quotes, a comma is ordinary text and a doubled quote <code>""</code> means one literal quote character.</li>
<li>Unquoted fields are trimmed of surrounding whitespace. Quoted fields are taken exactly as written, spaces included.</li>
<li>An unquoted field that is empty after trimming becomes <code>null</code>.</li>
<li>An unquoted field matching <code>-?digits</code> or <code>-?digits.digits</code> becomes a number. Everything else stays a string. A quoted field is <em>always</em> a string, even if it looks numeric, because quoting is how a producer says "this is text".</li>
<li>If a row has fewer fields than the header, the missing columns are <code>null</code>. If it has more, the extras are dropped.</li>
<li>Empty input returns an empty array.</li>
</ul>
<pre>parseCsv('id,name\\n1,"Lovelace, Ada"')
// [{ id: 1, name: "Lovelace, Ada" }]</pre>`,
        fn: "parseCsv",
        params: "text",
        tests: [
          { args: ["id,name,score\n1,Ada,91.5\n2,Grace,88"], expected: [{ id: 1, name: "Ada", score: 91.5 }, { id: 2, name: "Grace", score: 88 }], label: "basic" },
          { args: ['id,name\n1,"Lovelace, Ada"\n'], expected: [{ id: 1, name: "Lovelace, Ada" }], label: "quoted comma" },
          { args: ["a, b\n 1 , 2 \n\n3,4\n"], expected: [{ a: 1, b: 2 }, { a: 3, b: 4 }], label: "blank lines and padding" },
          { args: ["a,b,c\n1,,3\n4,5\n"], expected: [{ a: 1, b: null, c: 3 }, { a: 4, b: 5, c: null }], label: "short and empty fields", hidden: true },
          { args: ['q\n"she said ""hi"""\n'], expected: [{ q: 'she said "hi"' }], label: "escaped quotes", hidden: true },
          { args: [""], expected: [], label: "empty input" },
        ],
        hints: [
          "Splitting a line on commas cannot work, because a comma inside quotes must not split. Walk the line one character at a time and keep a flag saying whether you are currently inside quotes.",
          "Remember whether a field was quoted, separately from its text. That flag is what stops a quoted 007 from being turned into a number.",
          "For the doubled quote rule: when you are inside quotes and see a quote, look at the next character. If it is also a quote, append one quote and advance by two. Otherwise the field has ended.",
        ],
        solution: `function parseCsv(text) {
  const splitLine = (line) => {
    const out = [];
    let field = "";
    let quoted = false;
    let wasQuoted = false;
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"') {
          if (line[i + 1] === '"') { field += '"'; i += 2; continue; }
          quoted = false;
          i += 1;
          continue;
        }
        field += ch;
        i += 1;
        continue;
      }
      if (ch === '"' && field.trim() === "") {
        quoted = true;
        wasQuoted = true;
        field = "";
        i += 1;
        continue;
      }
      if (ch === ",") {
        out.push({ text: field, wasQuoted });
        field = "";
        wasQuoted = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
    }
    out.push({ text: field, wasQuoted });
    return out;
  };
  const coerce = (cell) => {
    if (cell.wasQuoted) return cell.text;
    const t = cell.text.trim();
    if (t === "") return null;
    if (/^-?\\d+(\\.\\d+)?$/.test(t)) return Number(t);
    return t;
  };
  const lines = String(text).split("\\n").filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];
  const header = splitLine(lines[0]).map((c) => (c.wasQuoted ? c.text : c.text.trim()));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const obj = {};
    for (let c = 0; c < header.length; c++) {
      obj[header[c]] = c < cells.length ? coerce(cells[c]) : null;
    }
    rows.push(obj);
  }
  return rows;
}`,
        skills: ["Quoting and escaping", "Type inference", "Ragged rows"],
      },
    ],
  },

  5024: {
    topicId: 5024,
    title: "Indexing, selection and the SettingWithCopy trap",
    summary:
      "Select rows and columns deliberately with label and position based accessors, and understand why an assignment through a chained selection can update a temporary object instead of your data.",
    concepts: [
      "Label based indexing",
      "Positional indexing",
      "Boolean masks",
      "Views versus copies",
      "Chained assignment",
      "Index alignment",
    ],
    glossary: {
      loc: "Label based accessor. It selects by index labels and column names, and its row slices include the endpoint, unlike Python slicing elsewhere.",
      iloc: "Position based accessor. It selects by integer offsets from zero and excludes the endpoint, exactly like list slicing.",
      "Boolean mask": "A Series of true and false values, one per row, used to select the rows where the condition holds.",
      View: "A selection that shares memory with the original frame, so writing to it may or may not write through to the source.",
      Copy: "A selection with its own memory. Writing to it never affects the frame it came from, which is the desired behaviour in most pipelines.",
      "Chained assignment": "Two indexing operations in one statement, such as df[mask]['col'] = 0. The first produces a temporary and the assignment may land in it.",
      SettingWithCopyWarning: "The warning pandas raises when it cannot prove your assignment target is the original frame. It is a heuristic, so it both misses cases and fires on safe ones.",
      "Index alignment": "The rule that operations between two labelled objects match on index labels rather than on position, filling with missing where labels do not overlap.",
    },
    body: {
      Beginner: `<p>A DataFrame is a table with names on both sides: column names across the top, and an index down the left that labels the rows. Almost every mistake beginners make with selection comes from mixing up those names with positions.</p>
<p>There are two accessors and they are not interchangeable:</p>
<ul>
<li><code>df.loc[...]</code> selects by <strong>label</strong>. You say which index label and which column name you want.</li>
<li><code>df.iloc[...]</code> selects by <strong>position</strong>. You say which row number and which column number, counting from zero.</li>
</ul>
<pre>df.loc[3, "score"]     # the row labelled 3, column named score
df.iloc[3, 1]          # the fourth row, the second column</pre>
<p>Those are often different rows. After filtering or sorting, the row labelled 3 may sit anywhere in the table, because labels travel with the rows.</p>
<h2>Choosing rows by a condition</h2>
<p>Comparing a column to a value gives you a column of true and false, one per row. Put that inside the brackets and you keep only the rows where it was true:</p>
<pre>high = df["score"] > 80
df.loc[high]</pre>
<h2>The trap</h2>
<p>Now you want to change those rows. The obvious way is wrong:</p>
<pre>df[df["score"] > 80]["grade"] = "A"     # does nothing useful</pre>
<p>Read it as two steps, because that is what it is. The first bracket builds a new little table containing the matching rows. The second bracket writes into that new table. Then the new table is thrown away. Your original frame is untouched, and pandas may print a warning about setting a value on a copy.</p>
<p>The correct form does the selection and the assignment in one operation:</p>
<pre>df.loc[df["score"] > 80, "grade"] = "A"</pre>
<aside class="tip">If you see two pairs of square brackets to the left of an equals sign, stop and rewrite it. One <code>.loc</code> with a comma inside is almost always the fix.</aside>`,
      Intermediate: `<p>Selection in pandas looks like list indexing and behaves like a small query language. The differences are not arbitrary: they follow from the fact that rows carry labels, and that a selection may or may not own its memory.</p>
<h2>Four accessors, four jobs</h2>
<ul>
<li><code>df["col"]</code> returns a column. With a list of names it returns a frame of those columns.</li>
<li><code>df.loc[rows, cols]</code> is label based and takes a mask, a label, a list of labels or a slice. Label slices are inclusive at both ends, because a label slice has no meaningful next value to exclude.</li>
<li><code>df.iloc[rows, cols]</code> is position based and behaves like Python slicing, endpoint excluded.</li>
<li><code>df.query("score &gt; 80 and region == 'north'")</code> is a readable alternative for long conjunctions, at the cost of the condition being a string.</li>
</ul>
<h2>Index alignment is doing more than you think</h2>
<p>Arithmetic between two Series matches on index labels, not on position. Adding a column from a filtered frame to a column from the full frame does not add row one to row one; it adds label to label and puts missing values wherever the labels do not overlap. This is a feature that prevents a whole class of silent misalignment, and it surprises everyone once. If you genuinely want positional behaviour, take <code>.values</code> or reset the index first, deliberately.</p>
<h2>Why the copy warning exists</h2>
<p>Consider what a selection is allowed to do. Slicing contiguous rows can return a view over the same memory. A boolean mask must gather scattered rows, so it returns a copy. Whether a given selection is one or the other depends on the operation, the dtypes and the internal block layout, which means you cannot reliably predict it by reading the line.</p>
<p>That is the actual problem. In chained assignment the first operation produces an intermediate object of unknown ownership, and the write may land in the original or in a temporary. pandas raises SettingWithCopyWarning when it cannot prove which, and the warning is a heuristic: it sometimes fires on code that is fine, and it sometimes stays silent on code that is not.</p>
<pre>subset = df[df["region"] == "north"]
subset["bonus"] = 100          # warns, and may not affect df

subset = df.loc[df["region"] == "north"].copy()
subset["bonus"] = 100          # explicit copy, no ambiguity</pre>
<h2>The discipline that removes the problem</h2>
<ul>
<li>Write once with a single <code>.loc</code> when you intend to modify the original.</li>
<li>Call <code>.copy()</code> explicitly when you intend an independent working table.</li>
<li>Never chain two indexing operations to the left of an equals sign.</li>
</ul>
<aside class="tip">pandas is moving to copy on write semantics, under which chained assignment never propagates to the original and the ambiguity disappears. Code written to the three rules above behaves identically before and after that change, which is the real reason to adopt them now.</aside>`,
      Advanced: `<p>The ambiguity has a concrete cause: the internal storage. Historically a frame stored columns in blocks grouped by dtype, so a selection could sometimes be expressed as a slice of an existing block, making it a view, and sometimes not, making it a copy. That decision depended on dtype grouping and on the exact selection, neither of which the caller controls, so ownership was genuinely unpredictable from the source line.</p>
<h2>What the warning can and cannot detect</h2>
<p>A selection keeps a weak reference to the object it came from. When you assign into it, pandas checks whether that reference exists and whether it can prove the target is the original. Two failure directions follow. False positives occur when the parent is still referenced but the write is intentional and local, producing a warning on correct code. False negatives occur when the parent has been garbage collected, so no warning appears and the write silently does nothing to a frame you still care about elsewhere.</p>
<h2>Copy on write changes the contract</h2>
<p>Under copy on write, every selection behaves as if it were a copy, and the actual duplication is deferred until a write occurs. The consequences are worth stating precisely:</p>
<ul>
<li>Chained assignment never modifies the parent. It is not a warning any more, it is a defined no operation on the parent.</li>
<li>Code that relied on writing through a view to update the original breaks, silently, because the write succeeds on the temporary.</li>
<li>Overall memory behaviour usually improves, since defensive <code>.copy()</code> calls that existed only to avoid the warning stop duplicating eagerly.</li>
</ul>
<h2>Selection performance</h2>
<p>Boolean masking is a gather over scattered positions and costs a full pass plus an allocation. When the same filter is applied repeatedly, sorting by the key and slicing contiguous ranges, or setting the key as a sorted index, converts repeated linear scans into logarithmic lookups. Combining masks with the bitwise operators requires parentheses because of precedence, and the classic bug is <code>df[a &amp; b == 0]</code> binding as <code>a &amp; (b == 0)</code>.</p>
<p>For single scalar access in a loop, the label and position accessors carry meaningful per call overhead; the specialised scalar accessors are faster, and vectorising the loop away is faster still.</p>
<aside class="tip">Assume every selection is a copy and write code whose correctness does not depend on the answer. That assumption is true under copy on write and safe before it, which makes it the only version that works across both.</aside>`,
      Expert: `<p>The design tension here is that a labelled table wants two incompatible things: NumPy's zero copy views for performance, and value semantics for predictability. The block manager tried to have both, and the result was an ownership model that could not be reasoned about locally. Copy on write resolves it by choosing value semantics and recovering the performance through deferred duplication and reference tracking.</p>
<h2>How deferral is tracked</h2>
<p>Under the new model each block records whether its buffer is shared. A write consults that flag and duplicates only when another object could observe the change. The reference tracking is what makes the guarantee cheap: a chain of selections that is never written to allocates nothing, and a write to a uniquely referenced block still happens in place. The observable contract is therefore straightforward even though the implementation is not, and the contract is the part user code must depend on.</p>
<h2>Alignment as a correctness feature</h2>
<p>Automatic alignment on labels is frequently criticised as surprising, and it prevents a serious class of error that positional systems cannot detect at all. If two tables are filtered differently and then combined positionally, the arithmetic is meaningless and nothing complains. Aligning on labels turns that into visible missing values at exactly the rows that did not correspond. The cost is that a duplicated index makes alignment produce a cartesian expansion, which is why a non unique index is worth treating as a defect rather than as a quirk.</p>
<h2>Points the documentation understates</h2>
<ul>
<li>The warning was never a correctness oracle. Treating its absence as proof that an assignment landed in the parent has always been unsound, and a great deal of code in the wild depends on exactly that.</li>
<li>Setting with an enlargement, assigning to a label that does not exist yet, changes the object's shape and may force a reallocation and a dtype promotion in the same statement.</li>
<li>Integer labels make the two accessors coincide in appearance and diverge in meaning, and after any sort or filter that divergence produces a wrong answer rather than an error.</li>
<li>Nullable extension dtypes change what a mask containing missing values selects, because the three valued logic no longer collapses cleanly to true or false.</li>
</ul>
<h2>The rule that survives every version</h2>
<p>Express an update as a single indexed assignment against the object you actually intend to modify, and derive independent working tables with an explicit copy. Everything else in this topic is a description of what happens when you do not.</p>
<aside class="tip">In review, treat a mask reused across several statements as a named variable rather than a repeated expression. It documents the intent, avoids recomputation, and makes an accidental change to one of the copies visible in the diff.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Assign where a condition holds, without touching the original",
        difficulty: "Medium",
        statement: `<p>This is the mechanism behind <code>df.loc[mask, "col"] = value</code>, and behind the trap that sits next to it.</p>
<p>Given a table as an array of row objects, a filter specification, a column name and a value, return an object with three keys:</p>
<ul>
<li><code>updated</code>: a new table where every matching row has <code>column</code> set to <code>value</code>.</li>
<li><code>changed</code>: how many rows matched.</li>
<li><code>original</code>: the <code>rows</code> argument exactly as you received it.</li>
</ul>
<p>That third key is the test. If you mutate the input rows in place, <code>original</code> will show the new values and the case will fail, because the array you return is the same array you were handed. Copy each row before you write into it.</p>
<p>The filter is <code>{ column, op, value }</code> where <code>op</code> is one of:</p>
<ul>
<li><code>"eq"</code>: strict equality.</li>
<li><code>"gt"</code>: greater than.</li>
<li><code>"lt"</code>: less than.</li>
</ul>
<p>Only matching rows receive the column. If the column did not exist before, it appears on the matching rows and nowhere else, which is exactly what a conditional assignment does to a real frame.</p>
<pre>assignWhere([{ id: 1, score: 10 }], { column: "score", op: "lt", value: 50 }, "band", "low")
// updated [{ id: 1, score: 10, band: "low" }], changed 1</pre>`,
        fn: "assignWhere",
        params: "rows, filter, column, value",
        tests: [
          {
            args: [[{ id: 1, region: "north", flag: 0 }, { id: 2, region: "south", flag: 0 }], { column: "region", op: "eq", value: "north" }, "flag", 1],
            expected: { updated: [{ id: 1, region: "north", flag: 1 }, { id: 2, region: "south", flag: 0 }], changed: 1, original: [{ id: 1, region: "north", flag: 0 }, { id: 2, region: "south", flag: 0 }] },
            label: "basic equality",
          },
          {
            args: [[{ id: 1, score: 40 }, { id: 2, score: 90 }, { id: 3, score: 75 }], { column: "score", op: "gt", value: 50 }, "score", 100],
            expected: { updated: [{ id: 1, score: 40 }, { id: 2, score: 100 }, { id: 3, score: 100 }], changed: 2, original: [{ id: 1, score: 40 }, { id: 2, score: 90 }, { id: 3, score: 75 }] },
            label: "overwrites the column it filtered on",
          },
          {
            args: [[{ id: 1, score: 10 }], { column: "score", op: "gt", value: 50 }, "score", 0],
            expected: { updated: [{ id: 1, score: 10 }], changed: 0, original: [{ id: 1, score: 10 }] },
            label: "no rows match",
          },
          {
            args: [[{ id: 1, score: 10 }, { id: 2, score: 80 }], { column: "score", op: "lt", value: 50 }, "band", "low"],
            expected: { updated: [{ id: 1, score: 10, band: "low" }, { id: 2, score: 80 }], changed: 1, original: [{ id: 1, score: 10 }, { id: 2, score: 80 }] },
            label: "adds a new column to matching rows only",
            hidden: true,
          },
          {
            args: [[], { column: "score", op: "gt", value: 0 }, "score", 1],
            expected: { updated: [], changed: 0, original: [] },
            label: "empty table",
            hidden: true,
          },
        ],
        hints: [
          "Build the new table with map. The callback should return a fresh object for every row, matching or not.",
          "Spreading a row into a new object copies it one level deep, which is enough here, and then writing to the copy cannot reach the original.",
          "Return the rows argument itself as original. Because you never wrote into it, it still holds the pre update values, and that is what the tests compare against.",
        ],
        solution: `function assignWhere(rows, filter, column, value) {
  const matches = (row) => {
    const left = row[filter.column];
    if (filter.op === "eq") return left === filter.value;
    if (filter.op === "gt") return left > filter.value;
    if (filter.op === "lt") return left < filter.value;
    return false;
  };
  let changed = 0;
  const updated = rows.map((row) => {
    const copy = { ...row };
    if (matches(row)) {
      copy[column] = value;
      changed += 1;
    }
    return copy;
  });
  return { updated, changed, original: rows };
}`,
        skills: ["Boolean masks", "Views versus copies", "Chained assignment"],
      },
    ],
  },

  5025: {
    topicId: 5025,
    title: "Group-by, pivot and window operations",
    summary:
      "Aggregate by category, reshape long data into wide summaries, and compute running totals and rankings that respect group boundaries without collapsing the rows you still need.",
    concepts: [
      "Split apply combine",
      "Aggregation",
      "Transform",
      "Window functions",
      "Pivot and unstack",
      "Group cardinality",
    ],
    glossary: {
      "Split apply combine": "The pattern behind every group-by: split rows into groups by key, apply a function to each group, combine the results into one object.",
      Aggregate: "A function that turns many rows into one, such as sum, mean or count. The output has one row per group.",
      Transform: "A function that returns a value per input row, aligned back to the original rows. The output has the same shape as the input.",
      "Window function": "A calculation over a set of rows related to the current row, such as a running total or a rank within a group, without collapsing rows.",
      "Dense rank": "A ranking in which tied values share a rank and the next distinct value takes the immediately following rank, so no numbers are skipped.",
      Pivot: "Moving the distinct values of a column into columns of their own, turning a long table into a wide one.",
      Cardinality: "The number of distinct values in a grouping key. It decides how many groups exist and therefore how much memory the result costs.",
      "Named aggregation": "Declaring the output column name alongside the source column and the function, so the result has flat, readable column names.",
    },
    body: {
      Beginner: `<p>Almost every analytical question has the same shape. Total sales <em>per region</em>. Average score <em>per student</em>. Fastest time <em>per team</em>. The words after "per" name a grouping key, and the words before it name an aggregation.</p>
<p>That is all a group-by is. Split the rows into piles by key, do the same calculation to each pile, and put the answers back together as one row per pile:</p>
<pre>sales.groupby("region")["amount"].sum()</pre>
<h2>One row per group, or one row per record</h2>
<p>Sometimes you want the summary. Sometimes you want every original row, with the group's answer attached alongside, so you can compare each record with its own group:</p>
<pre>sales["region_total"] = sales.groupby("region")["amount"].transform("sum")</pre>
<p>The first version gives you a small table, one row per region. The second keeps every row and adds a column. Choosing between them is the main decision in this topic.</p>
<h2>Running totals and rankings</h2>
<p>A <strong>window</strong> calculation looks at a row along with its neighbours in the same group. Two examples cover most needs:</p>
<ul>
<li>A <strong>running total</strong>: each row shows the sum of everything up to and including it, within its own group.</li>
<li>A <strong>rank</strong>: each row shows its position within its group, so rank 1 is the largest value in that group.</li>
</ul>
<p>Groups matter here. A running total that runs across group boundaries is not a running total of anything, and it is the easiest mistake to make.</p>
<aside class="tip">When two rows have the same value they should get the same rank. What happens next is a choice: with dense ranking the following value gets the next number, so ranks read 1, 1, 2 rather than 1, 1, 3.</aside>
<h2>Pivoting</h2>
<p>A pivot turns values into columns. If you have one row per month per region, a pivot gives you months down the side and regions across the top, with one number in each cell. It is the same data, arranged for reading rather than for storing.</p>`,
      Intermediate: `<p>Group-by is where pandas stops being a spreadsheet with syntax and starts being a query engine. The mental model that makes it predictable is split apply combine, and the thing to be precise about is what the apply step returns, because that decides the shape of the result.</p>
<h2>Three kinds of apply, three shapes</h2>
<ul>
<li><strong>Aggregate</strong> returns one scalar per group, so the result has one row per group and the grouping key becomes the index.</li>
<li><strong>Transform</strong> returns one value per input row, aligned back to the original index, so it can be assigned straight back as a column.</li>
<li><strong>Filter</strong> returns a boolean per group and keeps or discards whole groups, so the result has the original columns and fewer rows.</li>
</ul>
<p>Almost every "why is my result the wrong shape" question resolves to using an aggregate where a transform was meant. Adding a group total next to each row needs a transform; producing a table of group totals needs an aggregate.</p>
<h2>Name your outputs</h2>
<p>Aggregating several columns with several functions produces a multi level column index that then has to be flattened, and the flattening code is always ugly. Named aggregation avoids it:</p>
<pre>summary = (
    sales.groupby("region")
    .agg(
        total=("amount", "sum"),
        orders=("order_id", "nunique"),
        median_basket=("amount", "median"),
    )
    .reset_index()
)</pre>
<h2>Windows: ordering is part of the definition</h2>
<p>A running total is meaningless without a defined order, and the order pandas uses is the order of the rows, not a timestamp it inferred for you. Sort deliberately before a cumulative calculation, and group before it, so that each group starts again from zero:</p>
<pre>sales = sales.sort_values(["region", "date"])
sales["running"] = sales.groupby("region")["amount"].cumsum()
sales["rank_in_region"] = sales.groupby("region")["amount"].rank(method="dense", ascending=False)</pre>
<h2>Details that bite</h2>
<ul>
<li>Missing values in the grouping key are dropped by default, so rows vanish from the summary and the totals no longer reconcile. Pass the option that keeps them if the key can be missing.</li>
<li>A categorical grouping key produces a row for every category, including unobserved ones, which is either exactly what you wanted for a report or a table full of zeros.</li>
<li>Applying a general function per group is dramatically slower than a built in aggregation, because it runs Python code once per group instead of compiled code once per column.</li>
</ul>
<aside class="tip">Reconcile after every aggregation. The sum of the group totals must equal the total of the source column, and if it does not, the difference is exactly the rows your grouping key silently dropped.</aside>
<h2>Pivot and its inverse</h2>
<p>Pivoting with an aggregation handles duplicate key pairs by combining them; pivoting without one raises if the pair is not unique, which is a useful integrity check rather than an inconvenience. The inverse operation, melting a wide table back into long form, is what you want before plotting or modelling, since one row per observation is the shape every library expects.</p>`,
      Advanced: `<p>The performance and correctness properties of grouping follow from how the split step is implemented. Keys are factorised into integer codes, and the aggregation runs as a compiled loop over those codes. Anything that forces the apply step back into the interpreter loses that advantage entirely, which is why the choice between a built in aggregation and a custom function is often a factor of fifty rather than a matter of style.</p>
<h2>Cost model</h2>
<ul>
<li>Factorisation is roughly linear in rows and allocates one integer array per key. Grouping on several string columns pays the hashing cost on each of them, and pre converting them to categoricals moves that cost to load time where it is paid once.</li>
<li>The result of an aggregation is proportional to group cardinality, not to input size. Grouping by a near unique key produces a result nearly as large as the input while doing all the work of grouping, which is the standard accidental full table copy.</li>
<li>Transform materialises a value per input row, so it costs another full length column. Chaining several transforms is several full columns.</li>
</ul>
<h2>Where results diverge from expectation</h2>
<p>Ranking has several tie policies and they are not interchangeable. Dense ranking never skips numbers, standard competition ranking skips after ties, and average ranking produces fractional ranks that break any downstream integer assumption. Choosing by default rather than deliberately produces off by one differences that survive all the way to a report.</p>
<p>Cumulative functions ignore group boundaries unless you group first, and they respect row order unconditionally, including whatever order a previous join happened to leave behind. A cumulative sum computed before a sort is not merely misordered; it is a different quantity.</p>
<p>Rolling windows introduce a third source of surprise: whether the window is centred, whether partial windows at the start are computed or left missing, and whether the window is defined by a count of rows or by a span of time. On irregular timestamps only the time based definition is meaningful, and the row based one silently varies in duration.</p>
<h2>Multi level results</h2>
<p>Grouping on several keys yields a hierarchical index. It is efficient and it is awkward to consume, so the usual advice is to flatten immediately. The exception is unstacking, where the hierarchy is exactly the mechanism that turns the inner level into columns, and going through the grouped form is both faster and clearer than pivoting the original table.</p>
<aside class="tip">When an aggregation over a large frame is slow, check group cardinality before optimising anything else. Thousands of groups are cheap, and millions of groups turn a reduction into a shuffle.</aside>`,
      Expert: `<p>Split apply combine is a relational plan expressed as a method chain. The split is a hash partition on the key, the apply is a reduction or a map over each partition, and the combine is a concatenation with an index constructed from the keys. Recognising it as a plan makes the performance behaviour ordinary rather than mysterious: the expensive parts are hashing, materialisation and any step that cannot run in compiled code.</p>
<h2>The interpreter boundary is the whole story</h2>
<p>Built in aggregations dispatch to compiled implementations that walk the values once per column using the precomputed group codes. A user supplied function forces a different path: for each group, construct a sub object, call into Python, and collect a result whose type is not known in advance. The construction of the per group object usually dominates, which is why a custom function applied to a million groups can be slower than a full sort of the data. Where a custom reduction is genuinely required, expressing it in terms of the primitives that already have compiled implementations, or accepting a sort and operating on contiguous runs, recovers most of the difference.</p>
<h2>Semantics worth pinning down</h2>
<ul>
<li>Group iteration order and result order are not the same question. The result is sorted by key by default, which costs a sort you may not want, and disabling it yields first appearance order rather than an arbitrary order.</li>
<li>Missing keys are excluded by default. This is defensible and it means the identity that group totals sum to the overall total silently fails whenever the key is nullable.</li>
<li>Observed versus unobserved categories change the shape of the output for categorical keys, and the default has changed across versions, so pinning it explicitly is the only stable choice.</li>
<li>Aggregating an empty group produces the aggregation's identity element for sums and counts and a missing value for means, so an all empty grouping yields a mixture of zeros and nulls in the same row.</li>
</ul>
<h2>Windows against the SQL definition</h2>
<p>SQL separates partitioning, ordering and framing into three independent clauses. The dataframe API fuses partitioning into the group-by, takes ordering from the physical row order, and expresses framing through the specific method chosen. The expressive gap shows up with frames such as the three rows preceding the current row within its partition, ordered by an arbitrary expression, which SQL states directly and which here requires a sort, a group and a rolling call whose defaults must each be checked. This is not a deficiency to complain about; it is the reason to translate a window specification into its three parts explicitly before writing any code.</p>
<aside class="tip">Write the partition, the order and the frame down in words before touching the keyboard. Nearly every wrong window result comes from an unstated ordering rather than from a wrong function.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Running total and dense rank inside each group",
        difficulty: "Medium",
        statement: `<p>Implement the two window calculations that group-by cannot express as an aggregation, because both keep every input row.</p>
<p>Given an array of row objects, the name of a grouping column and the name of a numeric value column, return a new array in the <em>same order as the input</em>, where each row is a copy with two extra keys:</p>
<ul>
<li><code>cum</code>: the running total of the value column within that row's group, counting the current row and every earlier row of the same group in input order.</li>
<li><code>rank</code>: the dense rank of the row's value within its group, where <code>1</code> is the largest value. Equal values share a rank, and the next distinct value takes the next number, so three rows valued 7, 7 and 2 rank 1, 1 and 2.</li>
</ul>
<p>Rules:</p>
<ul>
<li>Round <code>cum</code> to 4 decimal places with <code>Math.round(v * 1e4) / 1e4</code>.</li>
<li>Rows of different groups never affect each other. Each group's running total starts again at its first row.</li>
<li>Values may be negative, so a running total can go down.</li>
<li>An empty input returns an empty array.</li>
</ul>
<pre>windowStats([{ g: "a", v: 3 }, { g: "b", v: 10 }, { g: "a", v: 5 }], "g", "v")
// a: cum 3 then 8; b: cum 10</pre>`,
        fn: "windowStats",
        params: "rows, groupKey, valueKey",
        tests: [
          {
            args: [[{ g: "a", v: 3 }, { g: "b", v: 10 }, { g: "a", v: 5 }, { g: "b", v: 1 }], "g", "v"],
            expected: [{ g: "a", v: 3, cum: 3, rank: 2 }, { g: "b", v: 10, cum: 10, rank: 1 }, { g: "a", v: 5, cum: 8, rank: 1 }, { g: "b", v: 1, cum: 11, rank: 2 }],
            label: "two interleaved groups",
          },
          {
            args: [[{ g: "a", v: 7 }, { g: "a", v: 7 }, { g: "a", v: 2 }], "g", "v"],
            expected: [{ g: "a", v: 7, cum: 7, rank: 1 }, { g: "a", v: 7, cum: 14, rank: 1 }, { g: "a", v: 2, cum: 16, rank: 2 }],
            label: "ties share a rank",
          },
          {
            args: [[{ g: "z", v: 4 }], "g", "v"],
            expected: [{ g: "z", v: 4, cum: 4, rank: 1 }],
            label: "single row",
          },
          {
            args: [[{ g: "a", v: -2 }, { g: "a", v: 6 }, { g: "a", v: -2 }], "g", "v"],
            expected: [{ g: "a", v: -2, cum: -2, rank: 2 }, { g: "a", v: 6, cum: 4, rank: 1 }, { g: "a", v: -2, cum: 2, rank: 2 }],
            label: "negative values",
            hidden: true,
          },
          { args: [[], "g", "v"], expected: [], label: "empty input", hidden: true },
        ],
        hints: [
          "The running total needs one accumulator per group, not one accumulator. A Map keyed by the group value is the natural container.",
          "Dense rank needs the distinct values of each group sorted from largest to smallest. The rank of a value is then its position in that list, counting from one.",
          "Do it in two passes: first collect the values per group and build a value to rank Map for each, then walk the rows once in order, updating the running total and looking the rank up.",
        ],
        solution: `function windowStats(rows, groupKey, valueKey) {
  const perGroup = new Map();
  for (const row of rows) {
    const g = row[groupKey];
    if (!perGroup.has(g)) perGroup.set(g, []);
    perGroup.get(g).push(row[valueKey]);
  }
  const ranksFor = new Map();
  for (const [g, vals] of perGroup) {
    const distinct = [...new Set(vals)].sort((a, b) => b - a);
    const m = new Map();
    distinct.forEach((v, i) => m.set(v, i + 1));
    ranksFor.set(g, m);
  }
  const running = new Map();
  return rows.map((row) => {
    const g = row[groupKey];
    const next = (running.get(g) ?? 0) + row[valueKey];
    running.set(g, next);
    return { ...row, cum: Math.round(next * 1e4) / 1e4, rank: ranksFor.get(g).get(row[valueKey]) };
  });
}`,
        skills: ["Window functions", "Split apply combine", "Transform"],
      },
    ],
  },

  5026: {
    topicId: 5026,
    title: "Joins, and what to do about the rows that vanish",
    summary:
      "Combine tables on a key while keeping control of the row count, so that unmatched rows are found deliberately rather than discovered later as a hole in a total.",
    concepts: [
      "Inner join",
      "Outer joins",
      "Join keys",
      "Cardinality",
      "Row multiplication",
      "Anti join",
      "Key hygiene",
    ],
    glossary: {
      "Inner join": "Keeps only rows whose key exists in both tables. It is the default in most libraries and it is the one that silently loses rows.",
      "Left join": "Keeps every row of the left table and attaches matching right hand columns, filling with missing values where there is no match.",
      "Outer join": "Keeps every row of both tables, filling missing values on whichever side did not match.",
      "Anti join": "The rows of one table with no match in the other. It is the diagnostic that tells you what an inner join would have discarded.",
      Cardinality: "The relationship between the two sides of a join: one to one, one to many, or many to many. It predicts the output row count.",
      "Row multiplication": "The row explosion that happens when a key is duplicated on both sides, producing every combination of matching rows.",
      "Key hygiene": "Making both sides of a key comparable before joining: same type, same case, trimmed, and free of hidden whitespace.",
      Validation: "Asserting the expected cardinality as part of the join, so an unexpected duplicate raises an error instead of inflating a total.",
    },
    body: {
      Beginner: `<p>A join glues two tables together using a shared column, called the <strong>key</strong>. Orders have a customer id, customers have a customer id, so you can attach each customer's name to each of their orders.</p>
<p>The only question that matters is what happens to rows that do not match.</p>
<ul>
<li>An <strong>inner</strong> join keeps a row only if the key appears in both tables. Anything unmatched disappears.</li>
<li>A <strong>left</strong> join keeps every row of the left table. Where there was no match, the new columns are empty.</li>
<li>An <strong>outer</strong> join keeps everything from both sides, filling in blanks wherever a match was missing.</li>
</ul>
<pre>orders.merge(customers, on="customer_id", how="left")</pre>
<h2>Count the rows, every time</h2>
<p>Here is the habit that prevents most join disasters. Write down how many rows you have before, and check how many you have after.</p>
<ul>
<li>Fewer rows than you started with means an inner join threw some away.</li>
<li>More rows than you started with means the key was duplicated on the right hand side, and rows were multiplied.</li>
</ul>
<p>That second one surprises people. If one order matches three customer rows, because the customer table accidentally holds three rows for that customer, you now have three copies of the order. Total revenue has just tripled, and nothing warned you.</p>
<h2>Why keys fail to match</h2>
<p>Usually it is not a mystery. It is one of these:</p>
<ul>
<li>One side stores the id as text and the other as a number.</li>
<li>One side has trailing spaces, invisible on screen.</li>
<li>Capitalisation differs, so <code>ABC123</code> and <code>abc123</code> do not meet.</li>
</ul>
<aside class="tip">Before joining, check how many keys the two sides actually share. If ninety per cent of your keys match, you want to see the other ten per cent rather than average over them.</aside>`,
      Intermediate: `<p>Joins are the step where row counts change, and a changed row count that nobody noticed is the most expensive kind of bug in analytics, because the numbers still look plausible.</p>
<h2>Predict the output before running it</h2>
<p>The output size follows from cardinality, so decide which case you are in first:</p>
<ul>
<li><strong>One to one</strong>: output has the same number of rows as the left side under a left join. Any other result means the key is not unique where you assumed it was.</li>
<li><strong>Many to one</strong>: the usual lookup, orders to customers. Output matches the left row count, and this is the only shape most pipelines should contain.</li>
<li><strong>One to many</strong>: deliberate expansion, customers to their orders. Expect growth and know the expected factor.</li>
<li><strong>Many to many</strong>: nearly always a mistake, and it produces the cross product within each key.</li>
</ul>
<p>State it in code rather than in a comment, and the library will enforce it:</p>
<pre>merged = orders.merge(
    customers, on="customer_id", how="left", validate="many_to_one", indicator=True
)
print(merged["_merge"].value_counts())</pre>
<p>The validation raises immediately if the right side has duplicate keys, and the indicator column tells you exactly how many rows matched on both sides against how many matched on the left only.</p>
<h2>Investigate the misses instead of hiding them</h2>
<p>An anti join is the diagnostic, and it takes one line:</p>
<pre>missing = orders.loc[~orders["customer_id"].isin(customers["customer_id"])]</pre>
<p>Look at the result before deciding anything. Unmatched rows normally fall into recognisable families: test accounts, records created after the extract was taken, a legacy system that pads identifiers, or a genuine referential integrity failure. Each family suggests a different fix, and no single default handles all of them.</p>
<h2>Key hygiene before the join, not after</h2>
<p>Most match failures are formatting, so normalise both sides deliberately: cast to the same type, strip whitespace, fold case if the key is not case significant, and decide what a missing key means. Missing values do not join to each other in the way people expect, so rows with a null key belong in their own bucket rather than in the join.</p>
<aside class="tip">Aggregate the many side down to one row per key before joining, rather than joining first and deduplicating afterwards. Deduplicating after an accidental expansion means guessing which duplicates were real.</aside>
<h2>The reconciliation habit</h2>
<p>After a join that should not change totals, check that a key total is unchanged. Sum the revenue before and after. If they differ, the join changed your data, and you now know before it reaches a dashboard rather than after somebody in finance notices.</p>`,
      Advanced: `<p>Once correctness is handled, joins become a question of cost and of what to do with the unmatched population, which is data in its own right rather than an error to be suppressed.</p>
<h2>Cost model</h2>
<p>An in memory join builds a hash table on the smaller side and probes it with the larger, so the cost is roughly linear in the sum of the sizes plus the cost of materialising the output. Three consequences follow. Output size is what dominates when cardinality is high, since an expanding join can allocate far more than either input. Joining on several columns hashes a composite key and is meaningfully slower than joining on a single prepared key. And a sorted merge on an already sorted index avoids the hash entirely, which is why time series joins on a sorted timestamp index behave differently from ordinary merges.</p>
<h2>Dtype and precision traps</h2>
<ul>
<li>An integer key column that contains missing values is promoted to float, and float keys compare by exact bit pattern, so large identifiers can collide or fail to match after the promotion. Nullable integer types avoid this and must be chosen explicitly.</li>
<li>Categorical keys join efficiently only when both sides share the same category set. Different sets fall back to object comparison, silently, with a large slowdown.</li>
<li>Timestamp keys carry a time zone. Comparing an aware timestamp with a naive one either raises or, after a well meaning conversion, matches the wrong day.</li>
</ul>
<h2>Asymmetric joins</h2>
<p>Not every join is an equality. Two forms recur in real work and both need care. An as of join matches each left row to the most recent right row at or before its timestamp, which is the correct way to attach a price or an exchange rate to an event, and it requires both sides sorted. A range join matches on an interval containing a point, which has no efficient hash implementation and is usually expressed as an interval index or as a sort plus a search.</p>
<h2>Treating unmatched rows as a signal</h2>
<p>The proportion of unmatched rows is a monitorable quantity. Recording it per run turns a silent degradation into a visible trend, and a sudden move in it is usually the earliest evidence of an upstream schema or identifier change. Dropping the misses discards the only measurement that would have caught it.</p>
<aside class="tip">Make the expansion factor an assertion. If a left join is expected to preserve the row count, assert it in the pipeline rather than checking it once in a notebook that nobody runs again.</aside>`,
      Expert: `<p>The semantics worth internalising come from relational algebra, because every library deviates from it in small ways that matter. A join is a filtered cross product; an equijoin is the special case that admits a hash implementation. Missing values sit outside the equality relation entirely, which is why null never equals null in a join even though a grouping operation will happily put all the nulls in one bucket. The two operations disagree on purpose, and code that assumes they agree loses rows at exactly one of the two steps.</p>
<h2>Duplicate keys and the algebra of counts</h2>
<p>With multiplicities m on the left and n on the right for a given key, an equijoin emits m times n rows for that key. The total output is therefore the dot product of the two multiplicity vectors, which explains why a rare duplicate on a high frequency key can dominate the output size on its own. Validating cardinality is the cheap way to bound that product before paying for it, and it is worth doing even when duplication is expected, because it pins the assumption at the point where it is used.</p>
<h2>Where the standard advice is incomplete</h2>
<ul>
<li>The suffix mechanism for overlapping non key columns silently renames rather than raising, so a repeated join can accumulate parallel columns that differ, and the one you read afterwards depends on which suffix you happened to type.</li>
<li>Joining on the index and joining on a column follow different code paths with different alignment rules, and a non unique index turns index alignment into an expansion that no validation option covers.</li>
<li>Outer join column order and row order are not guaranteed across versions, so any downstream code depending on positional order rather than on labels is relying on an implementation detail.</li>
<li>An indicator column is described as a debugging aid; it is better understood as a permanent audit column, because it is the only record of match provenance once the frames are combined.</li>
</ul>
<h2>Design rule</h2>
<p>Make the many side unique before the join whenever the intent is a lookup. Aggregating to one row per key, or selecting a deterministic winner with an explicit ordering, converts an unbounded many to many into a validated many to one and makes the row count predictable by construction rather than by inspection.</p>
<aside class="tip">Keep the anti join results as an artefact of the run, not as a value printed once. The population that failed to match is the dataset your data quality work should be prioritised against.</aside>`,
    },
    questions: [
      {
        n: 1,
        question: "An orders table has 10,000 rows. It is inner joined to a customers table on customer_id and the result has 9,830 rows. What is the most likely explanation?",
        options: [
          "170 orders have a customer_id with no matching row in the customers table",
          "The customers table contains 170 duplicate customer_id values",
          "The join key was of the wrong dtype, which always removes exactly the unmatched rows",
          "An inner join always drops the last rows of the larger table",
        ],
        answer: 0,
        explanation:
          "An inner join keeps only keys present on both sides, so a smaller result means those 170 orders had no matching customer. Duplicate keys on the customers side would have the opposite effect and increase the row count above 10,000, which is why it is the tempting but wrong choice here.",
        difficulty: "Easy",
        skill: "Inner join",
      },
      {
        n: 2,
        question: "You left join orders (10,000 rows) to customers and get 10,240 rows back. What happened?",
        options: [
          "A left join adds a row for every customer with no orders",
          "Some customer_id values appear more than once in the customers table, so those orders were matched multiple times",
          "The left join filled 240 rows with missing values and appended them",
          "The orders table had 240 rows with a null key, which a left join duplicates",
        ],
        answer: 1,
        explanation:
          "A left join keeps every left row and adds one output row per match on the right, so growth beyond the left row count can only come from duplicate keys on the right. Unmatched customers are not added at all by a left join, which is what an outer join would do, so that option describes a different operation.",
        difficulty: "Medium",
        skill: "Row multiplication",
      },
      {
        n: 3,
        question: "Which check most directly tells you which orders an inner join would discard?",
        options: [
          "Comparing the row count before and after the join",
          "Counting the distinct customer_id values in each table",
          "Selecting the orders whose customer_id is not in the customers key column",
          "Checking that both key columns have the same dtype",
        ],
        answer: 2,
        explanation:
          "That selection is an anti join, and it returns the actual unmatched rows so you can inspect what they have in common. A row count comparison tells you how many were lost but not which ones or why, so it detects the problem without helping you diagnose it.",
        difficulty: "Easy",
        skill: "Anti join",
      },
      {
        n: 4,
        question: "Orders stores customer_id as the string '00042' and customers stores it as the integer 42. What is the correct fix?",
        options: [
          "Cast both sides to integers, since the identifier is numeric",
          "Cast both sides to a consistent string form, preserving the padding rule the source system uses",
          "Join on a different column entirely, because mixed types cannot be joined",
          "Let the library coerce the types automatically during the merge",
        ],
        answer: 1,
        explanation:
          "Identifiers are labels rather than quantities, and casting to integer destroys leading zeros that may be significant in the source system, so the safe direction is to normalise both sides to the same string representation. Casting to integer often appears to work on the sample you are looking at and then fails on identifiers that are not purely numeric.",
        difficulty: "Medium",
        skill: "Key hygiene",
      },
      {
        n: 5,
        question: "You pass validate=\"many_to_one\" to a merge of orders onto customers. What does it guarantee?",
        options: [
          "That every order finds a matching customer",
          "That the customer_id column is unique in the customers table, raising if it is not",
          "That the output has exactly as many rows as the orders table",
          "That null keys are excluded from the join",
        ],
        answer: 1,
        explanation:
          "The validation checks the uniqueness of the key on the right hand side and raises when it is violated, which bounds the row multiplication before it happens. It says nothing about whether matches exist, so unmatched orders still pass validation and still need an anti join to find.",
        difficulty: "Medium",
        skill: "Cardinality",
      },
      {
        n: 6,
        question: "Both tables contain rows whose join key is missing. After an inner join on that key, what happens to them?",
        options: [
          "They match each other, producing one row per pair of missing keys",
          "They are excluded, because a missing value does not compare equal to another missing value",
          "They are kept on the left side only, with missing values on the right",
          "The merge raises an error rather than choosing a behaviour",
        ],
        answer: 1,
        explanation:
          "Join equality follows three valued logic, so a missing key never matches anything, including another missing key, and those rows are simply absent from an inner join. The tempting answer is that nulls group together, which is true of a group-by but not of a join, and the inconsistency between the two operations is exactly what catches people out.",
        difficulty: "Hard",
        skill: "Join keys",
      },
      {
        n: 7,
        question: "A monthly pipeline reports revenue that has jumped 40 per cent with no change in business volume. The pipeline joins transactions to a product dimension table that was reloaded this month. What should you check first?",
        options: [
          "Whether the transactions table gained rows",
          "Whether the product table now has more than one row per product id, multiplying transaction rows",
          "Whether the join was changed from inner to left",
          "Whether the currency conversion rates were updated",
        ],
        answer: 1,
        explanation:
          "Duplicated dimension keys multiply fact rows and inflate any sum computed after the join, which is the classic cause of a revenue jump with no new transactions. Switching an inner join to a left join can only add rows with missing right hand columns, which would not increase a sum of a left hand column.",
        difficulty: "Hard",
        skill: "Row multiplication",
      },
      {
        n: 8,
        question: "You need every order kept, every customer kept, and a clear record of which side each row came from. Which combination is correct?",
        options: [
          "An inner join with an indicator column",
          "A left join with validation set to one to one",
          "An outer join with an indicator column",
          "Two left joins concatenated together",
        ],
        answer: 2,
        explanation:
          "An outer join is the only mode that preserves unmatched rows from both sides, and the indicator column records whether each row matched both, left only or right only. An inner join with an indicator is contradictory, since after an inner join every surviving row matched both sides and the indicator carries no information.",
        difficulty: "Medium",
        skill: "Outer joins",
      },
      {
        n: 9,
        question: "A customers table has 5 rows for key A and an orders table has 3 rows for key A. How many rows does key A contribute to an inner join?",
        options: ["3", "5", "8", "15"],
        answer: 3,
        explanation:
          "An equijoin emits every combination of matching rows, so the contribution is the product of the two multiplicities, 5 times 3, which is 15. Answering 8 assumes the sides are concatenated rather than combined, which is what an append does rather than a join.",
        difficulty: "Medium",
        skill: "Cardinality",
      },
      {
        n: 10,
        question: "Your left join is intended as a lookup, but the right hand table legitimately holds several rows per key. What is the cleanest way to keep the row count stable?",
        options: [
          "Join first and then drop duplicate rows from the result",
          "Aggregate or deduplicate the right hand table to one row per key before joining",
          "Switch the join to an inner join so the extra rows are removed",
          "Sort the right hand table so only the first match is used",
        ],
        answer: 1,
        explanation:
          "Reducing the right side to one row per key first makes the join many to one by construction, so the row count is stable and the rule for choosing the surviving row is explicit and reviewable. Dropping duplicates after the join means deciding which duplicate was real once the evidence has already been merged away, and sorting does not restrict a join to the first match at all.",
        difficulty: "Hard",
        skill: "Cardinality",
      },
    ],
  },

  5027: {
    topicId: 5027,
    title: "Missing data: impute, drop, or model it",
    summary:
      "Decide what to do about absent values by first working out why they are absent, then choosing between deletion, imputation and explicit modelling with the consequences of each stated rather than assumed.",
    concepts: [
      "Missingness mechanisms",
      "Listwise deletion",
      "Mean and median imputation",
      "Forward fill",
      "Missingness indicator",
      "Leakage through imputation",
    ],
    glossary: {
      MCAR: "Missing completely at random: whether a value is absent has nothing to do with anything, observed or not. Deletion is unbiased here, and this case is rare.",
      MAR: "Missing at random: absence depends on other observed columns. Imputation conditioned on those columns can recover the structure.",
      MNAR: "Missing not at random: absence depends on the missing value itself, such as high earners declining to state income. No imputation fixes this on its own.",
      "Listwise deletion": "Dropping any row with a missing value in the columns used. Simple, and it can quietly remove most of the dataset when missingness is spread across columns.",
      Imputation: "Filling a missing value with an estimate. It always understates uncertainty, because the filled value is treated afterwards as if it had been observed.",
      "Forward fill": "Carrying the last observed value forward. Correct for step like series such as a price that holds until it changes, wrong for anything that should be interpolated.",
      "Missingness indicator": "A boolean column recording that a value was imputed. It preserves the information that the absence itself carried.",
      Sentinel: "A value used to encode missing, such as -999 or 1900-01-01. Undeclared sentinels enter the arithmetic as if they were data.",
    },
    body: {
      Beginner: `<p>A missing value is not zero and it is not an empty string. It means nobody wrote anything down, and the first job is to find out why.</p>
<p>Three very different situations produce a blank cell:</p>
<ul>
<li>The sensor was offline for an hour. The value exists in the world, and nothing about the reading caused it to be lost.</li>
<li>The form only asks about pets if you first said you have pets. The blank means "not applicable", which is information, not absence.</li>
<li>Nobody with a high salary answered the salary question. Now the blanks are not random, and the values you can see are not typical of the values you cannot.</li>
</ul>
<h2>Your three options</h2>
<p><strong>Drop the rows.</strong> Simple and honest when very few rows are affected. Dangerous when many are, because you may be removing exactly the rows that were different.</p>
<p><strong>Fill them in.</strong> Put the column's mean or median in the gap. Fast, keeps every row, and quietly pretends you knew something you did not.</p>
<p><strong>Record the absence.</strong> Add a second column that simply says whether the value was missing. This costs nothing and often turns out to be one of the most useful columns you have, because the fact that a customer left a field blank can predict behaviour.</p>
<pre>df["income_missing"] = df["income"].isna()
df["income"] = df["income"].fillna(df["income"].median())</pre>
<h2>Median or mean</h2>
<p>Use the median when the column has extreme values, because a single very large value drags a mean upwards and every gap you fill inherits that distortion. Income, house prices and durations are all better served by the median.</p>
<aside class="tip">Count the missing values per column and look at the total before you touch anything. A column that is eighty per cent empty is not a column to impute; it is a column to drop or a question to ask the data owner.</aside>`,
      Intermediate: `<p>The decision about missing values is not a preference, it is a modelling assumption, and the assumption you make should be stated before the method you choose. The standard vocabulary makes that assumption explicit.</p>
<h2>Three mechanisms, three consequences</h2>
<ul>
<li><strong>Missing completely at random</strong>: absence is unrelated to anything. Deleting affected rows loses power but not correctness. This case is convenient and uncommon.</li>
<li><strong>Missing at random</strong>: absence depends on other columns you can see, for instance older accounts having no email captured. Conditioning on those columns during imputation recovers most of the structure.</li>
<li><strong>Missing not at random</strong>: absence depends on the unobserved value itself. No purely statistical fix is available, and the honest responses are to model the missingness explicitly or to collect better data.</li>
</ul>
<p>You cannot test which mechanism you are in from the data alone, because that would require the values you do not have. What you can do is compare the observed columns of rows with and without the missing value; if they differ systematically, you are certainly not in the first case.</p>
<h2>What each method actually assumes</h2>
<pre>df["amount"].fillna(df["amount"].median())   # assumes MCAR or MAR, ignores every other column
df["amount"].ffill()                          # assumes the series is a step function in time
df.dropna(subset=["amount"])                  # assumes the dropped rows were not special</pre>
<p>Mean imputation has one specific and underappreciated effect: it shrinks the variance of the column and weakens its correlations with everything else, because every filled row now sits exactly at the centre. Impute ten per cent of a column and you have systematically flattened it.</p>
<h2>Keep the indicator</h2>
<p>Adding a boolean column for whether the value was imputed lets a model use the absence as a feature, and it keeps the record honest for anyone reading the table later. It costs one column and it is almost always worth it.</p>
<h2>Time series are different</h2>
<p>Order matters, so forward fill is available and is often right: a price, a status or a configuration holds until it changes. Interpolation is right for a quantity that varies continuously, such as a temperature. Backward fill is right almost nowhere in a modelling context, because it moves information from the future into the past, which is the leakage discussed later in this course.</p>
<aside class="tip">Fit imputation on the training data only. Computing a median over the full dataset and then splitting means the test rows were filled using their own values, and the resulting score is optimistic for a reason you will not see in the metric.</aside>`,
      Advanced: `<p>Single imputation solves the mechanical problem, that the algorithm requires a complete matrix, while creating a statistical one: uncertainty about the filled value disappears. Every downstream standard error, confidence interval and p value then behaves as if those values had been measured. On a small proportion of missing data this is tolerable. On a large proportion it makes the analysis confidently wrong.</p>
<h2>Multiple imputation, briefly</h2>
<p>The principled response is to impute several times from a model of the conditional distribution, analyse each completed dataset separately, and combine the results with rules that add the between imputation variance back into the standard error. Iterative approaches cycle through columns, modelling each with missing values as a function of the others until the fills stabilise. The cost is that the pipeline is no longer a single table, and every downstream step must be run once per imputation.</p>
<h2>Methods that respect structure</h2>
<ul>
<li>Neighbour based imputation fills from similar rows, which preserves relationships between columns but is sensitive to the distance metric and therefore to scaling, and it leaks unless the neighbour search is fitted on training rows only.</li>
<li>Model based imputation predicts the missing column from the others, which is strong under missing at random and degrades quietly when the predictors are themselves incomplete.</li>
<li>Some learners handle missingness natively by learning a default branch direction at each split, which is often better than any imputation you would have chosen and is discussed with tree ensembles later.</li>
</ul>
<h2>Failure modes worth naming</h2>
<p>Undeclared sentinels are the most damaging, because -999 does not look missing to any function and averages into every statistic. Missingness that is itself informative, then imputed away, destroys a real signal, which is why the indicator column matters. Group level imputation with a mean computed over the whole dataset instead of within the group flattens exactly the differences you were trying to measure. And imputing a categorical column with its mode manufactures a majority class that was never observed.</p>
<aside class="tip">Report the missingness rate per column with the results, not only during exploration. A model whose most important feature was thirty per cent imputed is a different object from one whose features were observed, and the reader cannot tell from the metric alone.</aside>`,
      Expert: `<p>The rigorous framing treats missingness as part of the data generating process. There is a response indicator for every cell, and the question is whether the joint distribution of the data and that indicator factorises in a way that lets the observed data identify the parameters of interest. Ignorability, the condition under which likelihood based analysis can proceed without modelling the missingness mechanism, requires missing at random plus a separability condition on the parameters. Both are assumptions about the world, and neither is testable from the observed sample.</p>
<h2>Why the standard combination rules exist</h2>
<p>Under multiple imputation the total variance decomposes into the average within imputation variance plus the between imputation variance inflated by a finite sample correction. That second term is precisely what single imputation sets to zero. The degrees of freedom adjustment matters when the number of imputations is small, and the fraction of missing information, rather than the fraction of missing rows, is what determines how many imputations are enough. Reporting that fraction is more informative than reporting the missingness rate, because it measures how much the estimate actually depended on the fills.</p>
<h2>Consequences under selection</h2>
<p>When missingness is not at random the observed data are a selected sample, and the selection is on the outcome. Corrections in that setting require either an exclusion restriction, a variable affecting the probability of response but not the outcome, or a sensitivity analysis that reports how the conclusion moves as the assumed departure from randomness grows. The second is nearly always the practical option, and it is undersold: a result that survives a plausible range of departures is far stronger than a point estimate produced by a default imputer.</p>
<h2>What the tooling documentation omits</h2>
<ul>
<li>Iterative imputers are not guaranteed to correspond to a coherent joint distribution, since the per column conditional models can be mutually incompatible. In practice they behave well and the theoretical footing is weaker than the interface suggests.</li>
<li>Imputing before splitting is presented as a preprocessing convenience and is a leak, because the fill value is a statistic of the whole dataset including the held out rows.</li>
<li>Adding an indicator column changes the model class, since a tree can then interact the indicator with other features, and a linear model gets a shift term for the imputed group. This is usually desirable and it should be a decision rather than a side effect.</li>
<li>Distance based and gradient based methods treat an imputed value identically to an observed one, so the weight given to a filled cell is the same as the weight given to a measured one, with no mechanism to downweight it short of sample weighting.</li>
</ul>
<aside class="tip">Write down the assumed mechanism next to the imputation code. If a reviewer cannot tell from the pipeline whether you assumed missing at random, neither can you six months later.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Four imputation strategies, one honest indicator",
        difficulty: "Medium",
        statement: `<p>Implement the four strategies a data pipeline actually reaches for, and keep the record of what was filled.</p>
<p>Given a table as an array of row objects, a column name and a strategy string, return a new table. A value counts as missing if it is <code>null</code>, <code>undefined</code>, the key is absent, or it is <code>NaN</code>.</p>
<p>Strategies:</p>
<ul>
<li><code>"drop"</code>: return only the rows where the column is present, each as a copy. Do not add any indicator column.</li>
<li><code>"mean"</code>: fill every missing value with the mean of the observed values.</li>
<li><code>"median"</code>: fill with the median of the observed values. For an even count of observations, use the average of the two middle values.</li>
<li><code>"ffill"</code>: fill with the last observed value that appears above it. A gap before the first observed value stays <code>null</code>, because there is nothing to carry forward.</li>
</ul>
<p>For every strategy except <code>"drop"</code>, add a boolean column named <code>column + "_missing"</code> to every row, recording whether that row's value was missing <em>before</em> you filled it. Add it after the value, so it is the last key.</p>
<p>Other rules:</p>
<ul>
<li>Round a computed mean or median to 4 decimal places with <code>Math.round(v * 1e4) / 1e4</code>.</li>
<li>If there are no observed values at all, mean and median have nothing to compute, so leave the values as <code>null</code> and still set the indicator.</li>
<li>Never modify the input rows.</li>
</ul>
<pre>imputeColumn([{ x: 10 }, { x: null }, { x: 20 }], "x", "mean")
// [{ x: 10, x_missing: false }, { x: 15, x_missing: true }, { x: 20, x_missing: false }]</pre>`,
        fn: "imputeColumn",
        params: "rows, column, strategy",
        tests: [
          {
            args: [[{ id: 1, x: 10 }, { id: 2, x: null }, { id: 3, x: 20 }], "x", "mean"],
            expected: [{ id: 1, x: 10, x_missing: false }, { id: 2, x: 15, x_missing: true }, { id: 3, x: 20, x_missing: false }],
            label: "mean fill",
          },
          {
            args: [[{ x: 1 }, { x: null }, { x: 4 }, { x: 10 }, { x: 3 }], "x", "median"],
            expected: [{ x: 1, x_missing: false }, { x: 3.5, x_missing: true }, { x: 4, x_missing: false }, { x: 10, x_missing: false }, { x: 3, x_missing: false }],
            label: "median with an even count of observations",
          },
          {
            args: [[{ x: null }, { x: 5 }, { x: null }, { x: null }, { x: 9 }], "x", "ffill"],
            expected: [{ x: null, x_missing: true }, { x: 5, x_missing: false }, { x: 5, x_missing: true }, { x: 5, x_missing: true }, { x: 9, x_missing: false }],
            label: "forward fill with a leading gap",
          },
          {
            args: [[{ id: 1, x: 3 }, { id: 2, x: null }, { id: 3, x: 8 }], "x", "drop"],
            expected: [{ id: 1, x: 3 }, { id: 3, x: 8 }],
            label: "drop",
          },
          {
            args: [[{ x: null }, { x: null }], "x", "mean"],
            expected: [{ x: null, x_missing: true }, { x: null, x_missing: true }],
            label: "every value missing",
            hidden: true,
          },
          { args: [[], "x", "mean"], expected: [], label: "empty table", hidden: true },
        ],
        hints: [
          "Write the missing test once as a small helper and use it everywhere. Four different inline checks is how the NaN case gets forgotten.",
          "Mean and median need the observed values collected before you start filling, because a value you have already filled must not feed the statistic.",
          "Forward fill is the only strategy that is order dependent: walk the rows once, remember the last observed value, and write it into the gaps as you pass them.",
        ],
        solution: `function imputeColumn(rows, column, strategy) {
  const isMissing = (row) => {
    const v = row[column];
    return v === null || v === undefined || (typeof v === "number" && Number.isNaN(v));
  };
  if (strategy === "drop") {
    return rows.filter((row) => !isMissing(row)).map((row) => ({ ...row }));
  }
  const observed = rows.filter((row) => !isMissing(row)).map((row) => row[column]);
  const round = (v) => Math.round(v * 1e4) / 1e4;
  let fillValue = null;
  if (observed.length > 0 && strategy === "mean") {
    fillValue = round(observed.reduce((a, b) => a + b, 0) / observed.length);
  }
  if (observed.length > 0 && strategy === "median") {
    const sorted = [...observed].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    fillValue = round(sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2);
  }
  let last = null;
  return rows.map((row) => {
    const missing = isMissing(row);
    const copy = { ...row };
    if (strategy === "ffill") {
      if (missing) copy[column] = last;
      else last = row[column];
    } else if (missing) {
      copy[column] = fillValue;
    }
    if (copy[column] === undefined) copy[column] = null;
    copy[column + "_missing"] = missing;
    return copy;
  });
}`,
        skills: ["Mean and median imputation", "Forward fill", "Missingness indicator"],
      },
    ],
  },

  5028: {
    topicId: 5028,
    title: "Distributions and sampling",
    summary:
      "Separate what a sample shows from what a population is, and use the sampling distribution of an estimate to say how much of an observed difference is signal and how much is the sample you happened to draw.",
    concepts: [
      "Population versus sample",
      "Sampling distribution",
      "Standard error",
      "Central limit theorem",
      "Bootstrap",
      "Sampling bias",
      "Heavy tails",
    ],
    glossary: {
      Population: "Every unit you want to draw a conclusion about, whether or not you can observe it. The target of the inference, not the rows in your file.",
      Sample: "The units you actually observed. Every number you compute is a property of the sample and only an estimate of the population.",
      "Sampling distribution": "The distribution of an estimate across all the samples you might have drawn. It is the object that quantifies how much an estimate moves by chance.",
      "Standard error": "The standard deviation of the sampling distribution. For a mean it falls with the square root of the sample size, so precision is expensive.",
      "Central limit theorem": "The result that sums and means of many independent contributions approach a normal shape, whatever the shape of the underlying variable, provided the variance is finite.",
      Bootstrap: "Resampling the observed data with replacement to approximate the sampling distribution empirically, without assuming a formula.",
      "Selection bias": "A systematic difference between who is in the sample and who is in the population. More data does not reduce it, it makes it more precise.",
      "Heavy tail": "A distribution where extreme values are far more likely than a normal shape implies, so the mean is unstable and the largest observation dominates.",
    },
    body: {
      Beginner: `<p>You measure the average order value of 200 customers and get 47 pounds. Measure a different 200 customers and you would get something else. Neither number is "the" average; both are estimates of a quantity you cannot see directly.</p>
<p>That gap between what you measured and what you want to know is what this topic is about.</p>
<h2>Population and sample</h2>
<p>The <strong>population</strong> is everyone you want the answer for. The <strong>sample</strong> is the rows you actually have. Statistics is the discipline of saying carefully what the second one tells you about the first.</p>
<h2>How much does an average wobble?</h2>
<p>If you drew your sample again and again, the average would land in a different place each time. Those values form their own distribution, and its spread is called the <strong>standard error</strong>. It has a memorable property: to halve it you need four times as much data.</p>
<pre>standard error of the mean = standard deviation / square root of n</pre>
<p>So going from 100 to 400 observations halves your uncertainty, and going from 400 to 800 barely helps.</p>
<h2>Mean or median</h2>
<p>If a few enormous values sit in the tail, the mean chases them and the median does not. For income, order values, waiting times and file sizes, the median usually describes the typical case better, and the mean answers a different question about the total.</p>
<h2>The mistake that no amount of data fixes</h2>
<p>If your sample comes only from people who answered a survey, or only from customers who stayed, then collecting ten times more of the same thing does not make it more representative. It makes a biased answer more precise, which is worse, because now it looks trustworthy.</p>
<aside class="tip">Before quoting any average, ask two questions: who could have been in this sample and was not, and would one very large value change my answer? Those two questions catch most bad numbers.</aside>`,
      Intermediate: `<p>Every statistic you compute is a random variable, because the sample was random. Internalising that turns a lot of vague caution into arithmetic you can actually do.</p>
<h2>The sampling distribution is the object of interest</h2>
<p>Fix a population and a sample size, imagine drawing every possible sample, and record the estimate from each. The resulting distribution is the sampling distribution of that estimate. Its centre tells you whether the estimate is biased and its spread is the standard error. Everything in inference, confidence intervals and tests alike, is a statement about that distribution.</p>
<p>For a mean, two results do most of the work. The standard error is the population standard deviation divided by the square root of n. And the central limit theorem says that for large enough n, the sampling distribution of the mean is approximately normal regardless of the shape of the underlying variable, provided the variance is finite.</p>
<h2>Large enough depends on the shape</h2>
<p>The rule of thumb about thirty observations is only true for mildly skewed data. For a heavily skewed variable such as revenue per customer, where a few accounts dominate, the sampling distribution of the mean can remain visibly skewed at several thousand observations. The practical test is not a number, it is a picture: bootstrap the statistic and look at its distribution.</p>
<h2>The bootstrap</h2>
<p>When you cannot derive the sampling distribution, simulate it. Resample the observed data with replacement to the same size, recompute the statistic, and repeat a few thousand times. The spread of those values estimates the standard error, and their percentiles give an interval.</p>
<pre>estimates = [
    np.median(rng.choice(values, size=len(values), replace=True))
    for _ in range(5000)
]
lo, hi = np.percentile(estimates, [2.5, 97.5])</pre>
<p>The bootstrap works for statistics with no clean formula, such as a median, a ratio of two totals or the difference between two percentiles, which is precisely where it earns its keep.</p>
<h2>Sampling in practice</h2>
<ul>
<li>Simple random sampling is unbiased and can miss small subgroups entirely.</li>
<li>Stratified sampling draws a fixed proportion within each subgroup, which reduces variance when the subgroups differ and is the right default for imbalanced categories.</li>
<li>Cluster sampling draws whole groups because it is cheap, and it must be accounted for later, since observations within a cluster are correlated and the effective sample size is smaller than the row count.</li>
</ul>
<aside class="tip">A sample of convenience, the rows you happened to be able to get, is the default in industry. It is workable provided you write down who it excludes, and it is dangerous when nobody does.</aside>
<h2>Fitting a distribution is a modelling choice</h2>
<p>Assuming normality buys convenient formulas and is wrong for most quantities that cannot go negative. Durations and counts have their own natural families, and the reason to care is not elegance: an assumed shape decides what counts as an outlier and how far the tail is expected to reach.</p>`,
      Advanced: `<p>The failure modes here are less about which distribution to fit and more about which assumptions the standard formulas quietly require: independence, finite variance, and a sample drawn from the population you intend to describe.</p>
<h2>Independence is usually violated</h2>
<p>The square root of n formula assumes independent observations. Real data are clustered by user, by session, by shop, by day. When observations within a cluster are correlated, the effective sample size is smaller than the row count by a factor that grows with cluster size and with the intraclass correlation. Ignoring it produces standard errors that are too small, intervals that are too narrow and results that are declared significant far more often than they should be. The fix is to analyse at the level of the independent unit, or to use methods that model the clustering explicitly.</p>
<h2>Heavy tails break the mean</h2>
<p>When the tail is heavy enough that the variance is very large or infinite, the central limit theorem either converges very slowly or does not apply. The symptoms are recognisable: the sample mean keeps drifting as data accumulates, the bootstrap distribution is visibly skewed, and a single observation contributes a noticeable fraction of the total. In that regime the mean is a poor summary and quantiles, trimmed means or an explicit tail model are more informative. Deleting the extreme values is not a fix, it is a redefinition of the quantity being estimated, and it should be labelled as such.</p>
<h2>Bootstrap limitations</h2>
<ul>
<li>It cannot invent information the sample does not contain, so it is unreliable for extreme quantiles, for maxima, and for very small samples.</li>
<li>The naive percentile interval has a coverage error that improves under bias corrected variants, which matter when the statistic is skewed.</li>
<li>Dependent data require resampling blocks or clusters rather than rows, otherwise the resampling destroys the correlation structure it should preserve and understates the uncertainty.</li>
</ul>
<h2>Reproducible randomness</h2>
<p>Any resampling or simulation needs an explicit generator with a recorded seed, threaded through rather than set globally, so that a result can be regenerated exactly. Global seeding interacts badly with parallelism and with library internals, and a result nobody can reproduce is an anecdote.</p>
<aside class="tip">Report an interval alongside every headline estimate. A number without a spread invites the reader to treat sampling noise as a change, and that is the single most common misreading of an analysis.</aside>`,
      Expert: `<p>The formal picture is asymptotic. Under independent identically distributed sampling with finite variance, the sample mean is consistent by the law of large numbers and asymptotically normal at the root n rate, and the plug in estimator of the variance makes the normal approximation usable. Every practical caveat in this topic is a statement about a condition of that theorem being violated: independence, finite variance, identical distribution, or the sample being drawn from the target population at all.</p>
<h2>Rates and what they imply for design</h2>
<p>Root n convergence sets the economics of measurement. Precision improves with the square root of cost, so the marginal value of another observation falls continuously, while a reduction in the variance of the measurement itself, through better instrumentation, stratification or a control variate, buys precision linearly. This is why variance reduction is a better investment than sample size beyond a certain point, and it is the reasoning behind covariate adjustment in experiments.</p>
<h2>Where the bootstrap is valid</h2>
<p>The bootstrap approximates the sampling distribution by substituting the empirical distribution for the unknown one, and its validity requires the statistic to be a sufficiently smooth functional of that distribution. It works for means, regression coefficients and correlations, and it fails for the sample maximum, for parameters on the boundary of a parameter space, and for statistics whose limiting distribution is not continuous. Second order accuracy of the studentised and bias corrected variants comes from an Edgeworth expansion, which is also the reason those variants need more resamples to be stable.</p>
<h2>What applied treatments get wrong</h2>
<ul>
<li>The central limit theorem is invoked as though the sample size alone decides adequacy, when the relevant quantity is skewness relative to the square root of the sample size. A skewness of five needs orders of magnitude more data than a skewness of one half.</li>
<li>Finite population corrections are omitted by default, which is conservative when sampling a small fraction and materially wrong when the sample is a large share of the population, a common situation with internal datasets.</li>
<li>Weighting for unequal selection probabilities restores unbiasedness of point estimates and inflates the variance, so the effective sample size after weighting can be far below the row count. Reporting the row count in that situation overstates the evidence.</li>
<li>Selection bias is described as a sampling problem, and it is better understood as an identification problem: no estimator computed from a selected sample identifies the population quantity without an assumption linking the two, and that assumption should be written down.</li>
</ul>
<aside class="tip">State the target population, the sampling mechanism and the unit of independence at the top of any analysis. Nearly every dispute about a statistical result turns out to be a disagreement about one of those three, discovered late.</aside>`,
    },
    questions: [
      {
        n: 1,
        question: "A survey of 400 customers estimates mean spend at 50 with a standard deviation of 20. Roughly what is the standard error of the mean?",
        options: ["0.05", "1.0", "20", "0.5"],
        answer: 1,
        explanation:
          "The standard error is the standard deviation divided by the square root of the sample size, so 20 divided by 20 gives 1.0. Answering 20 confuses the spread of individual customers with the spread of the estimated average, which is the distinction the whole topic rests on.",
        difficulty: "Easy",
        skill: "Standard error",
      },
      {
        n: 2,
        question: "You want to halve the standard error of a sample mean. What must happen to the sample size?",
        options: ["Double it", "Quadruple it", "Increase it by half again", "It depends entirely on the population shape"],
        answer: 1,
        explanation:
          "Standard error falls with the square root of n, so dividing it by two requires multiplying the sample size by four. Doubling the sample size only reduces the standard error by about thirty per cent, which is why precision gets expensive quickly.",
        difficulty: "Easy",
        skill: "Standard error",
      },
      {
        n: 3,
        question: "Your response rate is 8 per cent and responders differ systematically from non responders. You increase the sample tenfold and keep the same response rate. What improves?",
        options: [
          "Both the bias and the variance fall",
          "The bias falls but the variance stays the same",
          "The variance falls but the bias is unchanged",
          "Nothing improves, because the sample is invalid",
        ],
        answer: 2,
        explanation:
          "More data of the same kind narrows the sampling distribution while leaving the systematic difference between responders and non responders exactly where it was, so you get a more precise estimate of a biased quantity. Believing that volume corrects bias is the reason large convenience samples are quoted with unwarranted confidence.",
        difficulty: "Medium",
        skill: "Sampling bias",
      },
      {
        n: 4,
        question: "Which statement about the central limit theorem is correct?",
        options: [
          "It says the data become normally distributed as the sample grows",
          "It says the sampling distribution of the mean approaches a normal shape as the sample grows, given finite variance",
          "It applies only when the underlying variable is already roughly symmetric",
          "It guarantees that thirty observations are sufficient for any variable",
        ],
        answer: 1,
        explanation:
          "The theorem is about the distribution of the estimate, not about the raw values, which keep whatever shape they always had. The common misreading is that the data themselves become normal, which would imply that a skewed revenue column stops being skewed simply because more rows were collected.",
        difficulty: "Medium",
        skill: "Central limit theorem",
      },
      {
        n: 5,
        question: "You need an interval for the median of a strongly skewed spending column and no clean formula applies. What is the most practical approach?",
        options: [
          "Assume normality and use the standard error of the mean",
          "Resample the observed values with replacement several thousand times and take percentiles of the resulting medians",
          "Remove the top one per cent of values so the column is symmetric, then use the usual formula",
          "Report the median without an interval, since medians have no sampling variability",
        ],
        answer: 1,
        explanation:
          "The bootstrap approximates the sampling distribution directly by resampling, which is exactly the case it was designed for since a median has no simple closed form standard error. Trimming the tail to force symmetry changes the quantity being estimated rather than quantifying uncertainty about the original one.",
        difficulty: "Medium",
        skill: "Bootstrap",
      },
      {
        n: 6,
        question: "Revenue per customer is heavy tailed, with the top account contributing about four per cent of the total. What follows?",
        options: [
          "The sample mean is unusually stable because one large value anchors it",
          "The sample mean is unstable and the normal approximation converges slowly, so quantiles are a better summary",
          "The median is invalid for heavy tailed data",
          "The standard error formula no longer requires independence",
        ],
        answer: 1,
        explanation:
          "When a single observation contributes a noticeable share of the total, the mean is dominated by the tail and its sampling distribution stays skewed even at large sample sizes, so quantiles or a trimmed summary describe the typical case more honestly. The median is not invalidated by heavy tails; it is precisely the statistic that resists them.",
        difficulty: "Hard",
        skill: "Heavy tails",
      },
      {
        n: 7,
        question: "You have 50,000 page view rows generated by 500 users. You compute a standard error using n equal to 50,000. What is wrong?",
        options: [
          "Nothing, since each page view is a genuine observation",
          "The rows are clustered within users, so the effective sample size is far smaller and the standard error is too small",
          "The standard error should use the number of days rather than the number of rows",
          "Page views cannot be averaged at all",
        ],
        answer: 1,
        explanation:
          "The formula assumes independent observations, and page views from the same user are correlated, so the independent unit is the user rather than the row and the effective sample size is closer to 500. Treating every row as independent narrows intervals artificially and manufactures significance, which is the most common inferential error in product analytics.",
        difficulty: "Hard",
        skill: "Sampling distribution",
      },
      {
        n: 8,
        question: "A dataset contains every transaction your company processed last year. Someone objects that inference is pointless because this is the whole population. What is the strongest response?",
        options: [
          "They are right, so no uncertainty should ever be reported on complete data",
          "If the target is future or counterfactual behaviour, last year's complete record is still a sample from that process, so uncertainty applies",
          "Inference is always required regardless of what question is asked",
          "Complete data only needs a finite population correction and is otherwise identical",
        ],
        answer: 1,
        explanation:
          "Whether inference applies depends on the target: for a descriptive claim about last year the data are complete and no sampling uncertainty exists, but for any claim about next year or about what would have happened otherwise, the observed year is one realisation of a process. Insisting inference is always required ignores the genuinely descriptive case, which is why the target population must be stated first.",
        difficulty: "Hard",
        skill: "Population versus sample",
      },
      {
        n: 9,
        question: "A rare category makes up 2 per cent of the population and you need a reliable estimate within it. Which sampling design is most appropriate?",
        options: [
          "Simple random sampling with a larger total sample",
          "Stratified sampling that oversamples the rare category, with weights applied when estimating population totals",
          "Cluster sampling by region",
          "Convenience sampling from the category's known members",
        ],
        answer: 1,
        explanation:
          "Stratification lets you draw enough of the rare group to estimate within it precisely, and reweighting restores unbiased population level estimates afterwards. Simply enlarging a simple random sample buys the same precision far more expensively, since only two per cent of every additional row lands in the group you care about.",
        difficulty: "Medium",
        skill: "Sampling bias",
      },
      {
        n: 10,
        question: "Two teams bootstrap the same statistic on the same data and report different intervals. What is the most likely benign explanation?",
        options: [
          "The bootstrap is not a valid method for this statistic",
          "They used different random seeds and a resample count too small for the interval to have stabilised",
          "One team resampled without replacement, which is equivalent anyway",
          "Bootstrap intervals are deterministic, so one team made an arithmetic error",
        ],
        answer: 1,
        explanation:
          "Bootstrap intervals are themselves random and only stabilise as the number of resamples grows, so different seeds with too few resamples produce visibly different endpoints without anyone being wrong. Resampling without replacement is not equivalent at all: at the same sample size it simply reproduces the original dataset every time and shows no variability.",
        difficulty: "Medium",
        skill: "Bootstrap",
      },
    ],
  },

  5029: {
    topicId: 5029,
    title: "Hypothesis testing and p-value misuse",
    summary:
      "Run a test knowing exactly what it is asking, and read the result without the four errors that dominate published analysis: treating significance as importance, absence of evidence as evidence of absence, a threshold as a decision rule, and repeated looks as a single test.",
    concepts: [
      "Null hypothesis",
      "p-value",
      "Significance level",
      "Statistical power",
      "Multiple comparisons",
      "Effect size",
      "Confidence interval",
    ],
    glossary: {
      "Null hypothesis": "The specific claim the test assumes while computing the probability, usually that there is no difference. It is never proved, only left standing.",
      "p-value": "The probability of an outcome at least as extreme as the observed one, assuming the null hypothesis and the sampling model are both true.",
      "Significance level": "The false positive rate you agreed to tolerate before looking at the data. It is a decision threshold, not a property of the result.",
      "Type I error": "Rejecting a null hypothesis that was true. Its long run rate is the significance level, provided exactly one test was performed.",
      "Type II error": "Failing to reject a null hypothesis that was false. Its rate falls as power rises, which is mostly a matter of sample size and effect size.",
      Power: "The probability of detecting an effect of a given size if it is real. Under powered studies both miss real effects and exaggerate the ones they find.",
      "Effect size": "How large the difference is in units anyone cares about. It is the quantity a decision depends on, and it is independent of sample size.",
      "Multiple comparisons": "Running many tests, which multiplies the chance that at least one crosses the threshold by luck alone.",
    },
    body: {
      Beginner: `<p>Your new checkout page converts at 12.4 per cent and the old one converts at 11.8 per cent. Is the new page better, or did you just get a lucky fortnight?</p>
<p>A hypothesis test answers one narrowly defined question: <em>if there were genuinely no difference, how surprising would this result be?</em></p>
<h2>What a p-value is</h2>
<p>Assume for a moment there is no real difference at all. The p-value is the probability of seeing a gap at least as big as the one you saw, purely by chance. A small p-value means your data would be unusual in a world where nothing was happening.</p>
<p>A p-value of 0.03 does <strong>not</strong> mean there is a 97 per cent chance the new page is better. It means that if nothing were happening, results this extreme would turn up about three times in a hundred.</p>
<h2>Three sentences that are always wrong</h2>
<ul>
<li>"p equals 0.049 so the effect is real, p equals 0.051 so it is not." Nothing happens at 0.05. It is a convention someone chose.</li>
<li>"The test was not significant, so there is no difference." A test can fail to find an effect simply because the sample was too small.</li>
<li>"p equals 0.001 so the effect is large." A tiny difference becomes highly significant with enough data. Significance is about confidence, not about size.</li>
</ul>
<h2>Ask about the size instead</h2>
<p>The question a business actually needs answered is "how much better, and is that worth the work?" That is the <strong>effect size</strong>, and it is best reported as an interval: the conversion lift is between 0.1 and 1.1 percentage points. That sentence tells you both the estimate and how uncertain it is.</p>
<aside class="tip">Decide the sample size and the metric before the experiment starts. Watching a dashboard and stopping the moment the line crosses the threshold turns a five per cent false positive rate into something far higher.</aside>`,
      Intermediate: `<p>A test is a piece of machinery with inputs and a narrow output. Given a null hypothesis, a test statistic and a sampling model, it returns the probability of data at least as extreme as yours under that null. Everything problematic comes from asking it a question it was never computing.</p>
<h2>What the p-value is conditional on</h2>
<p>The probability is conditional on the null hypothesis <em>and</em> on every modelling assumption: independence, the distributional form, the stopping rule and the fact that this was the only test you ran. A small p-value is evidence against that whole package, not against the null alone. When the assumptions are shaky, the p-value is measuring your model rather than your effect.</p>
<p>The inversion fallacy is worth stating precisely. The p-value is the probability of the data given the hypothesis. What people want is the probability of the hypothesis given the data. Those are different quantities and the second one requires a prior, which the test never asked for.</p>
<h2>Power is the half everyone skips</h2>
<p>Power is the probability of detecting an effect of a stated size when it is genuinely there. It rises with sample size and with the size of the effect, and it falls as variance rises. Two consequences matter:</p>
<ul>
<li>A non significant result from an under powered study is uninformative. It is consistent with no effect and with a large effect alike.</li>
<li>Significant results from under powered studies are systematically exaggerated, because only the largest random fluctuations clear the threshold. This is the winner's curse, and it explains a great deal of the replication problem.</li>
</ul>
<p>Compute the required sample size before running anything, from the smallest effect that would change a decision.</p>
<h2>Multiple comparisons</h2>
<p>Test twenty independent things at the five per cent level with no real effects anywhere, and the chance that at least one comes out significant is about sixty four per cent. Segmenting an experiment by device, country, channel and cohort is exactly this, and reporting the segment that worked is exactly the error.</p>
<pre>from statsmodels.stats.multitest import multipletests
reject, p_adj, _, _ = multipletests(p_values, alpha=0.05, method="fdr_bh")</pre>
<p>Controlling the family wise error rate is strict and appropriate when a single false positive is costly. Controlling the false discovery rate is more permissive and appropriate for screening, where you accept a known proportion of false leads among your hits.</p>
<aside class="tip">Report the confidence interval rather than the p-value where you can. It contains the same decision, since an interval excluding the null value corresponds to significance, and it also tells the reader the size and the precision, which the p-value hides.</aside>
<h2>Choosing a test</h2>
<p>Match the test to the data: a comparison of two means, of two proportions, of a paired before and after, or of counts in a table are different tests with different assumptions. Reaching for the same test regardless produces confident answers to the wrong question, and the assumption most often violated is independence, not normality.</p>`,
      Advanced: `<p>The Neyman Pearson framework and the Fisherian p-value are two different logics that applied practice has fused into one ritual, which is where much of the confusion originates. The first is a decision procedure with pre committed error rates; the second is a continuous measure of evidence against a null. Mixing them yields the worst of both: a threshold treated as a decision, applied to a quantity read as evidence, after the data have been seen.</p>
<h2>Garden of forking paths</h2>
<p>Multiplicity does not require explicitly running many tests. If the analysis choices, which outcome, which subgroup, which transformation, which exclusions, would have been made differently under different data, then many tests were implicitly available and the reported one was selected. The false positive rate reflects the set of analyses that could have been run, not the number written down. Pre registration and a locked analysis plan are the only reliable defences, and a held out confirmation sample is the practical version.</p>
<h2>Sequential testing</h2>
<p>Repeatedly testing as data accumulates and stopping at the first significant result inflates the error rate dramatically, approaching certainty in the limit. The correct treatments are group sequential designs with spending functions, or always valid inference based on confidence sequences, both of which allow continuous monitoring at a stated cost in power. Peeking with a fixed threshold is not a minor sin; it is the single most common cause of experiment results that fail to replicate.</p>
<h2>Assumption violations, ranked by damage</h2>
<ul>
<li>Dependence between observations, which shrinks standard errors and is usually invisible in the output.</li>
<li>Selection on the outcome, which invalidates the sampling model entirely.</li>
<li>Unequal variances between groups, which the Welch variant handles and which the pooled variant does not.</li>
<li>Non normality, which matters least of all for tests of means at moderate sample sizes and receives the most attention.</li>
</ul>
<h2>Equivalence and non inferiority</h2>
<p>Failing to reject a null is not evidence of no effect. When the question is genuinely whether two things are the same, the right tool states a margin of practical equivalence and tests whether the interval falls entirely inside it. This reverses the burden of proof correctly and is available in every standard library, and it is almost never used outside clinical work.</p>
<aside class="tip">Write the analysis plan before the data arrive, including the stopping rule and the primary outcome. Anything decided afterwards is exploratory, which is legitimate and must be labelled.</aside>`,
      Expert: `<p>A p-value is the tail probability of a test statistic under a specified null and sampling distribution, and it is uniformly distributed on the unit interval under a point null with a continuous statistic. That uniformity is the whole basis of error rate control, and it fails in the ways that matter practically: discreteness makes the distribution conservative for count data, composite nulls make it depend on the nuisance parameter, and any data dependent choice of the test destroys it entirely.</p>
<h2>The base rate governs interpretation</h2>
<p>The probability that a significant result reflects a real effect depends on the prior probability that the effects being tested are real. Screening ten thousand features where one per cent are genuine, at five per cent significance and eighty per cent power, yields eighty true positives against roughly four hundred and ninety five false ones, so most significant findings are false despite each test behaving exactly as specified. No amount of care within a single test addresses this; only the prior, the power and the multiplicity correction do.</p>
<h2>False discovery rate versus family wise error</h2>
<p>Family wise control bounds the probability of any false positive and is severely conservative for large families. False discovery control bounds the expected proportion of false positives among rejections, which is the quantity that matters when the output is a ranked list for further investigation. The standard procedure is valid under independence and under a positive dependence condition that most real feature sets plausibly satisfy, and there is a strictly more conservative variant for arbitrary dependence. Choosing between them is a statement about what a false lead costs relative to a missed one.</p>
<h2>Where the standard advice is wrong or incomplete</h2>
<ul>
<li>The recommendation to test assumptions before choosing a test creates a data dependent selection whose error rate is not the nominal one. Choosing the robust variant unconditionally is usually better than testing and switching.</li>
<li>Confidence intervals are recommended as the antidote to p-values, and they are the same machinery: an interval read as a decision at a fixed level inherits every multiplicity problem the p-value has.</li>
<li>Effect size measures are presented as scale free, but standardised effect sizes divide by a sample dependent variance, so they move with the population studied and are not comparable across contexts without care.</li>
<li>Bayesian alternatives are advertised as sidestepping these problems. They replace the threshold with a prior and a loss function, which is more honest and equally capable of being selected after the fact.</li>
</ul>
<aside class="tip">The decision relevant output of a study is an effect size with an interval and a stated assumption set. The p-value is a summary of one coordinate of that object, and reporting it alone discards the parts a decision actually needs.</aside>`,
    },
    questions: [
      {
        n: 1,
        question: "A test returns p = 0.03. Which statement is correct?",
        options: [
          "There is a 3 per cent probability that the null hypothesis is true",
          "There is a 97 per cent probability that the effect is real",
          "If the null hypothesis and the sampling model were true, results at least this extreme would occur about 3 per cent of the time",
          "The effect is large enough to act on",
        ],
        answer: 2,
        explanation:
          "The p-value is the probability of the data given the null, so it describes how unusual the observation would be in a world with no effect. Reading it as the probability that the null is true inverts the conditioning, and recovering that quantity would require a prior that the test never asked for.",
        difficulty: "Easy",
        skill: "p-value",
      },
      {
        n: 2,
        question: "An A/B test on 4 million sessions finds a 0.02 percentage point lift with p < 0.001. What should you conclude?",
        options: [
          "The effect is large because the p-value is very small",
          "The effect is precisely estimated and very small, so the decision depends on whether 0.02 points is worth the cost",
          "The result must be a false positive given how small the lift is",
          "The test is invalid because the sample is too large",
        ],
        answer: 1,
        explanation:
          "With a very large sample even a trivial difference becomes statistically detectable, so the small p-value tells you the estimate is precise rather than that the effect matters. Treating a small p-value as evidence of a large effect conflates confidence with magnitude, which is the error the effect size is there to prevent.",
        difficulty: "Medium",
        skill: "Effect size",
      },
      {
        n: 3,
        question: "A study of 40 users finds no significant difference between two designs. What follows?",
        options: [
          "The two designs perform identically",
          "The result is consistent with no effect and also with a substantial effect, because the study had little power to distinguish them",
          "The null hypothesis has been proved",
          "The test should be rerun until it reaches significance",
        ],
        answer: 1,
        explanation:
          "Failing to reject the null means the data were not surprising enough under it, which at a small sample size is exactly what you would expect even for a real and meaningful effect. Declaring the designs identical treats absence of evidence as evidence of absence, and the confidence interval would show immediately how wide the range of consistent effects is.",
        difficulty: "Medium",
        skill: "Statistical power",
      },
      {
        n: 4,
        question: "You test 20 independent metrics at the 5 per cent level and none of them has any real effect. Roughly what is the chance that at least one comes out significant?",
        options: ["5 per cent", "20 per cent", "64 per cent", "100 per cent"],
        answer: 2,
        explanation:
          "Each test independently has a 95 per cent chance of not being significant, so the chance that all twenty stay quiet is 0.95 to the twentieth power, about 36 per cent, leaving roughly 64 per cent for at least one hit. Answering 5 per cent applies the per test rate to the whole family, which is precisely the mistake that makes segmented dashboards produce spurious wins every week.",
        difficulty: "Medium",
        skill: "Multiple comparisons",
      },
      {
        n: 5,
        question: "An experiment is monitored daily and stopped as soon as p drops below 0.05. What is the effect on the false positive rate?",
        options: [
          "It stays at 5 per cent because each individual test is valid",
          "It rises substantially, because the stopping rule gives many chances to cross the threshold",
          "It falls, because more data has been collected than planned",
          "It is unaffected as long as the sample size was pre computed",
        ],
        answer: 1,
        explanation:
          "Repeated looks with a fixed threshold create many opportunities for random fluctuation to cross it, and the overall error rate compounds with each peek. The individual test being correctly computed is exactly what makes this seductive, since nothing in the output reveals that the stopping rule was data dependent.",
        difficulty: "Hard",
        skill: "Significance level",
      },
      {
        n: 6,
        question: "Screening 10,000 features where about 1 per cent are genuinely associated, at 5 per cent significance and 80 per cent power, what fraction of the significant results are false positives?",
        options: [
          "About 5 per cent, matching the significance level",
          "About 20 per cent, matching one minus the power",
          "The majority of them, because there are far more true nulls available to produce false positives",
          "None, provided each test is correctly specified",
        ],
        answer: 2,
        explanation:
          "The 100 genuine features yield about 80 detections while the 9,900 nulls yield about 495 false positives, so most significant results are false even though every test behaves exactly as designed. Assuming the false positive share equals the significance level ignores the base rate, which dominates whenever real effects are rare.",
        difficulty: "Hard",
        skill: "Multiple comparisons",
      },
      {
        n: 7,
        question: "Which reported result is most useful for a business decision?",
        options: [
          "The difference was statistically significant, p = 0.012",
          "The lift was 0.6 percentage points, 95 per cent interval 0.1 to 1.1",
          "The null hypothesis was rejected at the 5 per cent level",
          "The test statistic was 2.51",
        ],
        answer: 1,
        explanation:
          "An estimate with an interval states both the size of the effect and the precision, which is what a decision about cost and benefit requires. The p-value and the rejection statement encode only whether the interval excludes zero, discarding the magnitude that determines whether acting is worthwhile.",
        difficulty: "Easy",
        skill: "Confidence interval",
      },
      {
        n: 8,
        question: "An analyst tries three outcome definitions, two exclusion rules and four subgroups, then reports the single significant combination. What is the problem?",
        options: [
          "Nothing, since only one test was ultimately reported",
          "The reported p-value ignores the many analyses that were available, so its error rate is far above the nominal level",
          "The subgroups should have been merged before testing",
          "The sample size was too large for so many analyses",
        ],
        answer: 1,
        explanation:
          "The false positive rate depends on the set of analyses that could have been selected, not on the number written up, so selecting the winner after seeing the data invalidates the stated level. Merging subgroups is not the issue either, since the same multiplicity arises from the outcome definitions and exclusion rules on their own.",
        difficulty: "Hard",
        skill: "Multiple comparisons",
      },
      {
        n: 9,
        question: "You genuinely want to show that a cheaper supplier's component is not meaningfully worse. Which approach is correct?",
        options: [
          "Run the usual test and conclude equivalence if it is not significant",
          "State a margin of practical equivalence and test whether the confidence interval lies entirely within it",
          "Increase the sample until the p-value exceeds 0.5",
          "Report the effect size without any test",
        ],
        answer: 1,
        explanation:
          "Equivalence testing places the burden of proof correctly by requiring the plausible range of differences to fall inside a margin you declared as unimportant. Concluding equivalence from a non significant conventional test rewards small samples, because the less power you have, the easier it becomes to claim no difference.",
        difficulty: "Hard",
        skill: "Null hypothesis",
      },
      {
        n: 10,
        question: "A pilot with 30 users per group finds a significant and surprisingly large effect. What is the most likely issue when it is repeated at scale?",
        options: [
          "The effect will be even larger, because the pilot was noisy",
          "The measured effect will probably shrink, because at low power only unusually large fluctuations reach significance",
          "The original result must have been fabricated",
          "Nothing, since significance already accounts for sample size",
        ],
        answer: 1,
        explanation:
          "At low power the only results that clear the threshold are those inflated by favourable noise, so published estimates from small studies are systematically exaggerated and regress on replication. Significance testing controls the false positive rate but says nothing about the magnitude of the effects that survive it, which is why the winner's curse persists.",
        difficulty: "Hard",
        skill: "Statistical power",
      },
    ],
  },

  5030: {
    topicId: 5030,
    title: "Correlation, causation and confounders",
    summary:
      "Read an association for what it is, identify the third variables and selection effects that manufacture it, and state precisely what evidence would be needed before a correlation could justify an intervention.",
    concepts: [
      "Correlation coefficient",
      "Confounding",
      "Causal graphs",
      "Simpson's paradox",
      "Selection effects",
      "Randomised experiments",
      "Collider bias",
    ],
    glossary: {
      Correlation: "A number between -1 and 1 summarising the strength of a straight line relationship between two variables. It measures association, never direction of influence.",
      Confounder: "A variable that influences both the supposed cause and the effect, creating an association between them where no direct link exists.",
      "Causal graph": "A diagram of assumed influences between variables. It makes the assumptions explicit and shows which variables must be adjusted for and which must not.",
      "Simpson's paradox": "A reversal in which an association present in every subgroup disappears or flips when the subgroups are pooled, because group membership is itself related to both variables.",
      Collider: "A variable influenced by two others. Conditioning on it creates a spurious association between its causes, which is why controlling for everything is not a safe default.",
      "Selection effect": "A distortion caused by which units enter the dataset. It can create strong associations among variables that are unrelated in the population.",
      "Randomised experiment": "Assigning the intervention by a random mechanism, which breaks the link between treatment and every confounder, observed or not.",
      "Natural experiment": "An observational situation where assignment is as good as random for reasons outside the analyst's control, allowing causal claims without a designed trial.",
    },
    body: {
      Beginner: `<p>Ice cream sales and drowning deaths rise together. Nobody thinks ice cream causes drowning. Both go up in hot weather, and the weather is doing the work.</p>
<p>That third variable has a name: a <strong>confounder</strong>. It influences both things you measured, which makes them move together even though neither one moves the other.</p>
<h2>What a correlation actually tells you</h2>
<p>A correlation is a single number saying how closely two things move together in a straight line. Near 1 means they rise together, near -1 means one rises as the other falls, near 0 means no straight line relationship.</p>
<p>What it does not tell you is which one is doing the causing, or whether either of them is. When two variables A and B are correlated, there are four possibilities and the data alone cannot separate them:</p>
<ul>
<li>A causes B.</li>
<li>B causes A.</li>
<li>Something else causes both.</li>
<li>The sample was collected in a way that manufactured the pattern.</li>
</ul>
<h2>A correlation of zero is not proof of nothing</h2>
<p>Correlation only looks for straight lines. A relationship shaped like an arch, where an outcome improves up to a point and then declines, can have a correlation near zero while being a strong and important relationship. Always plot the data before believing a single number about it.</p>
<h2>The question that saves you</h2>
<p>Before acting on a correlation, ask: if I intervened and changed the first variable directly, would I expect the second to change? Users who use the mobile app spend more. Would making a user install the app cause them to spend more, or do people who already spend more choose to install the app?</p>
<aside class="tip">The only reliable way to answer that question is to intervene on purpose. Randomly deciding who gets the change is what makes an experiment able to answer a causal question at all.</aside>`,
      Intermediate: `<p>The slogan that correlation is not causation is where most people stop, and it is the least useful part of the idea. The useful part is knowing what specifically creates a non causal association, because each cause has a different remedy.</p>
<h2>Four generators of association</h2>
<ul>
<li><strong>A genuine causal path</strong> from one variable to the other, which is what you hope for.</li>
<li><strong>Confounding</strong>, a common cause of both. The remedy is adjustment, if you have measured the confounder.</li>
<li><strong>Selection</strong>, where entry into the dataset depends on both variables. Adjustment does not fix this and often makes it worse.</li>
<li><strong>Reverse causation</strong>, where the outcome influences the supposed cause, common when both are measured at the same moment.</li>
</ul>
<h2>Draw the graph before running the regression</h2>
<p>Write the variables down and draw arrows for the influences you believe exist. The graph is a statement of assumptions, and it immediately answers a question regressions cannot: which variables to adjust for.</p>
<p>The rule that surprises people is that adjusting for more variables is not safer. Three roles behave differently:</p>
<ul>
<li>A <strong>confounder</strong> sits upstream of both. Adjust for it.</li>
<li>A <strong>mediator</strong> sits on the causal path between them. Adjusting for it removes the very effect you are trying to measure.</li>
<li>A <strong>collider</strong> is caused by both. Adjusting for it creates an association that was not there.</li>
</ul>
<p>The collider case is the counterintuitive one. Among applicants admitted to a selective programme, high test scores and strong references may be negatively correlated even though they are unrelated in the population, because a weakness in one had to be compensated by strength in the other to get in at all.</p>
<h2>Simpson's paradox</h2>
<p>A treatment can appear worse overall and better in every subgroup, if the subgroups differ in both their baseline risk and how often they receive the treatment. When the aggregate and the subgroups disagree, the aggregate is usually the misleading one, and the resolution is decided by the causal structure rather than by the arithmetic.</p>
<pre>overall = df.groupby("treatment")["recovered"].mean()
by_severity = df.groupby(["severity", "treatment"])["recovered"].mean()</pre>
<p>Print both. If they tell different stories, you have found something structural rather than a rounding issue.</p>
<aside class="tip">Randomisation is the one procedure that handles every confounder including the ones you never thought of, because assignment is made independent of everything by construction. That is why an experiment on a small sample often beats an observational study on millions of rows.</aside>
<h2>When you cannot experiment</h2>
<p>Sometimes randomising is impossible or unethical, and useful designs remain: comparing units just above and just below an eligibility cutoff, comparing changes over time between an affected and an unaffected group, or exploiting an external shock that assigned treatment for reasons unrelated to the outcome. Each rests on an assumption that must be stated and, where possible, checked.</p>`,
      Advanced: `<p>Causal inference from observational data is possible, and the price is an explicit and untestable assumption set. The productive move is to state the assumptions as a graph, derive from it what must be adjusted for, and then report how fragile the conclusion is to violations of those assumptions.</p>
<h2>Identification precedes estimation</h2>
<p>The identification question is whether the causal quantity can be written as a function of observable distributions at all. Only if it can does the choice of estimator matter. The back door criterion answers this for adjustment: a set of variables suffices if it blocks every non causal path from treatment to outcome and contains no descendant of the treatment. Notice what this rules out: adjusting for a post treatment variable is not conservative, it is a different and generally biased estimand.</p>
<h2>Adjustment is not the same as putting it in the regression</h2>
<p>Including a covariate in a linear model adjusts for it only under the functional form that model assumes. If the true relationship is non linear or interacts with treatment, residual confounding remains and it can be large. Methods that separate the modelling of treatment assignment from the modelling of the outcome, and combine both, are more robust because they remain consistent if either model is correct.</p>
<h2>Diagnostics that carry weight</h2>
<ul>
<li><strong>Overlap</strong>: every unit must have a non trivial probability of either treatment value. Where overlap fails, no method can compare like with like and the estimate is an extrapolation.</li>
<li><strong>Balance</strong>: after adjustment, the covariate distributions should be similar across treatment groups. Reporting standardised differences before and after is standard and is usually omitted.</li>
<li><strong>Negative controls</strong>: an outcome that could not plausibly be affected should show no effect. If it does, unmeasured confounding is present and quantified.</li>
<li><strong>Sensitivity analysis</strong>: state how strong an unmeasured confounder would need to be to overturn the conclusion. This turns an untestable assumption into a reported number.</li>
</ul>
<h2>Experiments have their own failure modes</h2>
<p>Randomisation guarantees unbiased assignment and nothing else. Attrition that differs by arm reintroduces selection. Interference between units, where one unit's treatment affects another's outcome, breaks the standard framework entirely and is endemic in social products and marketplaces. Non compliance means the randomised comparison estimates the effect of being offered the treatment rather than of receiving it, which is often the more relevant quantity anyway and should be named correctly.</p>
<aside class="tip">Report the estimand in words before any number: the effect of what, on whom, compared with what alternative, over what period. Most causal disputes dissolve once that sentence is written down, because the parties were estimating different things.</aside>`,
      Expert: `<p>The formal apparatus separates three levels: association, which is what the observed distribution supports; intervention, which concerns the distribution under a forced assignment; and counterfactuals, which concern what would have happened to specific units under an alternative they did not receive. Each level requires strictly more assumptions than the one below it, and no amount of data at a lower level substitutes for the assumptions needed at a higher one. This is why a sufficiently large observational dataset does not converge to a causal answer; it converges to a precisely estimated association.</p>
<h2>Structural assumptions and their testable shadows</h2>
<p>A causal graph implies conditional independence relations among observables, and those implications are testable. A graph is therefore falsifiable even though the causal claims it encodes are not directly observable, and checking its implied independences is an underused diagnostic. Where several graphs imply the same independences, the data cannot distinguish them, and the choice among them is a substantive judgement rather than a statistical one.</p>
<h2>Effect heterogeneity</h2>
<p>The average effect over a population is one summary among many, and it can be positive while the effect is negative for an identifiable subgroup. Estimating conditional effects is a modern strength of machine learning methods, and it comes with a multiplicity problem: subgroups discovered post hoc are subject to exactly the selection issues covered in the testing topic. Sample splitting, with discovery on one half and estimation on the other, is the practical discipline, and the honest report distinguishes pre specified subgroups from discovered ones.</p>
<h2>Where common practice goes wrong</h2>
<ul>
<li>Adding every available covariate as a control is treated as caution. It risks conditioning on colliders and mediators, and it can introduce bias in a model that would otherwise have been unbiased.</li>
<li>Statistical significance of a coefficient is read as evidence of a causal effect, when the coefficient's causal interpretation depended entirely on the adjustment set being correct, which no p-value evaluates.</li>
<li>Interference is assumed away by default in experimental analysis, and in networked or marketplace settings that assumption is usually false, which biases the estimate in a direction that depends on the mechanism.</li>
<li>Instrumental variable arguments are made informally, when the exclusion restriction they require is a strong claim that the instrument affects the outcome through no other channel, and it is untestable.</li>
</ul>
<h2>What this means for a working analyst</h2>
<p>The deliverable is not a coefficient. It is an estimand, an identification argument, an estimator, a diagnostic set and a sensitivity analysis. Producing that package for one important question is worth far more than producing coefficients for twenty, and it is the difference between analysis that survives scrutiny and analysis that survives only until someone asks how the variables were chosen.</p>
<aside class="tip">If the recommendation is to change something, the analysis must have addressed what would happen under that change. An association measured under the current regime does not describe behaviour under a different one, and stating the difference explicitly is the analyst's job.</aside>`,
    },
  },

  5031: {
    topicId: 5031,
    title: "Train/test discipline and leakage",
    summary:
      "Build an evaluation that predicts real performance by holding out data honestly, fitting every transformation on the training portion only, and splitting along whichever dimension the model will have to generalise across.",
    concepts: [
      "Train test split",
      "Data leakage",
      "Fit on train only",
      "Temporal validation",
      "Cross validation",
      "Group splits",
    ],
    glossary: {
      "Training set": "The rows the model is allowed to learn from. Every parameter, threshold and preprocessing statistic must come from here and nowhere else.",
      "Test set": "Rows held back and used once, to estimate performance on data the model has never influenced. Reusing it for tuning turns it into a second training set.",
      "Validation set": "Rows used to choose between models and settings. It is consumed by the selection process, so it no longer gives an unbiased estimate afterwards.",
      Leakage: "Any path by which information unavailable at prediction time reaches the model during training. It inflates offline scores and produces disappointing production results.",
      "Temporal split": "Holding out the most recent period rather than random rows, so the evaluation matches the real task of predicting the future from the past.",
      "Group split": "Keeping all rows belonging to one entity, such as a patient or a customer, entirely on one side of the split so the model cannot memorise that entity.",
      "Cross validation": "Rotating the held out fold across the data so every row is predicted once by a model that did not see it, giving a lower variance estimate.",
      "Target encoding": "Replacing a category with a statistic of the target. It is powerful and it leaks unless the statistic is computed within the training fold only.",
    },
    body: {
      Beginner: `<p>A model that has seen the answers can recite them. That is not learning, and it tells you nothing about how it will perform tomorrow.</p>
<p>So we split the data. Most of it becomes the <strong>training set</strong>, which the model learns from. A portion is held back as the <strong>test set</strong>, which the model never sees during training. Scoring on the held back portion is the only estimate you have of how the model behaves on data it has not met.</p>
<h2>Leakage</h2>
<p><strong>Leakage</strong> is when information from the test set, or from the future, sneaks into training. The model looks brilliant in your notebook and mediocre in production. Three ways it happens constantly:</p>
<ul>
<li>You scale the whole dataset before splitting. The scaling used the test rows' values, so the test rows have quietly influenced training.</li>
<li>You have a column that would not exist at prediction time. Predicting whether a customer will cancel, using a column recorded when they cancelled, is not prediction.</li>
<li>The same person appears in both halves. The model recognises the person rather than learning the pattern.</li>
</ul>
<h2>The order that keeps you honest</h2>
<p>Split first. Then compute anything you need from the training rows only. Then apply those same numbers to the test rows.</p>
<pre>train, test = split(data)
mean = train["income"].mean()          # computed on train only
train["income"] = train["income"].fillna(mean)
test["income"] = test["income"].fillna(mean)   # the same number, not the test mean</pre>
<h2>Predicting the future means splitting on time</h2>
<p>If the real task is to predict next month from previous months, a random split is too easy: the model gets to see rows from the same weeks it is being tested on. Hold out the most recent period instead, and you measure what you actually care about.</p>
<aside class="tip">If a result looks too good, suspect leakage before celebrating. A jump to near perfect accuracy is almost never a breakthrough; it is nearly always a column that contains the answer.</aside>`,
      Intermediate: `<p>Evaluation exists to answer one question: what will this model do on data it has never seen, drawn from the situation it will be used in? Every rule here is an attempt to make the held out data honestly represent that situation.</p>
<h2>Three sets, three jobs</h2>
<ul>
<li><strong>Train</strong> fits the parameters.</li>
<li><strong>Validation</strong> chooses between models, features and hyperparameters. The moment you select on it, its score is optimistic for the winner.</li>
<li><strong>Test</strong> is touched once, at the end, to report a number. If you look at it, adjust and look again, it has become a validation set and you no longer have an unbiased estimate.</li>
</ul>
<p>Where data is scarce, cross validation replaces the fixed validation set by rotating the held out fold, giving every row a turn at being predicted by a model that did not see it. The estimate has lower variance, and the cost is fitting the model k times.</p>
<h2>The pipeline is what makes this practical</h2>
<p>Manual discipline fails at scale, because each fold needs its own scaler, its own imputation statistic and its own encoder. Wrapping preprocessing and model together means the fitting happens inside each fold automatically:</p>
<pre>pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("model", LogisticRegression()),
])
scores = cross_val_score(pipe, X, y, cv=5)</pre>
<p>Fitting a scaler outside this and passing the transformed matrix in is the most common leak in applied work, and cross validation will not detect it because every fold is equally contaminated.</p>
<h2>Split along the axis you must generalise across</h2>
<ul>
<li><strong>Time</strong>, when the future is the target. Train on the past, validate on the following period, and roll the window forward.</li>
<li><strong>Group</strong>, when rows cluster by entity. All rows for one customer, patient or device belong on the same side, otherwise you are measuring memorisation.</li>
<li><strong>Stratified random</strong>, when rows are genuinely independent and the classes are imbalanced, so each fold keeps the class proportions.</li>
</ul>
<h2>Leaky features, concretely</h2>
<p>The subtle leaks come from features computed with knowledge of the whole dataset: a category replaced by the mean of its target across all rows, a rolling average that includes the current row, an identifier that correlates with the label because of how the data was assembled, or a duplicate record appearing on both sides. The test is always the same question: at the moment of prediction, in production, would this value be knowable?</p>
<aside class="tip">Write down the timestamp at which each feature becomes available and compare it with the prediction time. Any feature whose value settles after the prediction moment is leakage, however plausible it looks in the column list.</aside>`,
      Advanced: `<p>Beyond mechanics, the interesting problems are selection bias in the evaluation procedure itself, distribution shift between the split and reality, and the difference between an unbiased estimate and a useful one.</p>
<h2>Nested selection</h2>
<p>Tuning hyperparameters against a cross validation score and then reporting that score is optimistically biased, because the selection consumed the very estimate being reported. Nested cross validation, with an inner loop for selection and an outer loop for estimation, is the correct construction. It costs the product of the two loop sizes and is often skipped, which is defensible only when the reported number is explicitly labelled as a selection score rather than as an unbiased estimate.</p>
<h2>Time series need more than an ordered split</h2>
<ul>
<li>Rolling origin evaluation retrains at successive cut points, which measures how the model behaves as it ages and reveals decay that a single split hides.</li>
<li>A gap between the end of training and the start of the test window is required whenever features use trailing windows, otherwise the last training rows and the first test rows share source observations.</li>
<li>Seasonality means a short test window may cover an unrepresentative period, so evaluating across at least one full cycle is usually necessary.</li>
</ul>
<h2>Duplicates and near duplicates</h2>
<p>Exact duplicates split across train and test create a leak that no methodology catches, and near duplicates are worse because they are invisible to an equality check. Deduplication should precede splitting, and for text or image data, near duplicate detection matters more than the choice of split ratio.</p>
<h2>Shift between evaluation and deployment</h2>
<p>An honest split still assumes the deployment distribution resembles the historical one. Covariate shift changes the feature distribution, label shift changes class proportions, and concept drift changes the relationship itself. Monitoring the input distribution in production, and retaining a recent labelled sample for periodic re evaluation, is what turns a one off estimate into an ongoing one. The single most useful production artefact is a stored prediction log with the features as they were at prediction time, because it is the only way to reconstruct what the model actually saw.</p>
<aside class="tip">Reserve a final holdout that is never used until a release decision, and treat any repeated use of it as a defect. A test set consulted twenty times during development has been fitted to, one decision at a time.</aside>`,
      Expert: `<p>The estimate produced by any evaluation protocol is itself a random variable with a bias and a variance, and protocol choice trades one against the other. A single large holdout is nearly unbiased for the model trained on the reduced training set and has high variance. K fold has lower variance and estimates the performance of a model trained on a fraction of the data, which is pessimistic for learning curves that have not flattened. Leave one out is nearly unbiased for the full training size and has high variance for unstable learners, and its apparent efficiency is undermined by that instability.</p>
<h2>Why the estimate is not the deployed model's performance</h2>
<p>What is estimated is the expected performance of the learning procedure at a given training size, not of the specific artefact you ship, which is typically refitted on all the data afterwards. These coincide only if performance has saturated with respect to training size. Reporting a learning curve alongside the score makes this checkable, and it also answers the more actionable question of whether more data would help.</p>
<h2>The multiplicity of model selection</h2>
<p>Selecting among many candidates on a finite validation set is the same selection problem as multiple testing, and the winner's score is biased upward by an amount that grows with the number of candidates and the variance of the estimate. With hundreds of configurations and a small validation set, the selection can be dominated by noise, and the chosen configuration may be no better than a randomly chosen one. Adjustments exist, and the practical defences are to limit the candidate set deliberately, to prefer a simple search over an exhaustive one, and to confirm the winner on data untouched by the search.</p>
<h2>Points that standard guidance understates</h2>
<ul>
<li>Cross validation assumes exchangeable rows. Under any dependence, temporal, spatial or group, standard k fold is not merely suboptimal, it is systematically optimistic, and the size of that optimism is unbounded.</li>
<li>Stratification on the target for regression by binning is common and changes the estimand slightly, since folds are no longer simple random samples.</li>
<li>Feature selection performed before cross validation, on the full dataset, is a leak that can produce strong apparent accuracy from pure noise, and it remains widespread in applied literature.</li>
<li>A pipeline abstraction prevents preprocessing leaks and does not prevent leaks built into the features themselves, which is where the expensive mistakes live.</li>
</ul>
<aside class="tip">Judge an evaluation by whether it could have detected a model that memorises an identifier. If the protocol would have scored that model highly, it is not measuring generalisation, whatever the number says.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Temporal split with leakage free scaling",
        difficulty: "Medium",
        statement: `<p>Build the two steps that must happen in the right order: hold out the most recent rows, then standardise using statistics computed on the training rows only.</p>
<p>Each row is an object with a numeric timestamp <code>t</code> and other columns. Given the table, a test fraction and the name of a numeric column:</p>
<ol>
<li>Order the rows by <code>t</code> ascending. Rows with equal <code>t</code> keep their original relative order.</li>
<li>Let <code>testSize</code> be <code>Math.floor(rows.length * testFraction)</code>. The last <code>testSize</code> rows in time order are the test set; everything before them is the training set.</li>
<li>Compute the mean and the population standard deviation of <code>column</code> over the <strong>training rows only</strong>.</li>
<li>Return every row as a copy with <code>column</code> replaced by <code>(value - mean) / std</code>, using those training statistics for both sets.</li>
</ol>
<p>Return <code>{ train, test, mean, std }</code>. Round every returned number to 4 decimal places with <code>Math.round(v * 1e4) / 1e4</code>, computing with unrounded statistics.</p>
<p>Edge rules:</p>
<ul>
<li>If the training standard deviation is exactly 0, every scaled value is <code>0</code>.</li>
<li>If the training set is empty, report <code>mean</code> 0 and <code>std</code> 0 and scale every value to <code>0</code>. There is nothing to fit on, and inventing a statistic from the test rows is the exact mistake this problem is about.</li>
</ul>
<p>The scaled test values are deliberately allowed to fall outside the usual range. A test row far from the training distribution should look far away, and a scaler refitted on the test set would hide precisely that.</p>`,
        fn: "splitAndScale",
        params: "rows, testFraction, column",
        tests: [
          {
            args: [[{ t: 1, v: 2 }, { t: 2, v: 4 }, { t: 3, v: 6 }, { t: 4, v: 100 }], 0.25, "v"],
            expected: { train: [{ t: 1, v: -1.2247 }, { t: 2, v: 0 }, { t: 3, v: 1.2247 }], test: [{ t: 4, v: 58.7878 }], mean: 4, std: 1.633 },
            label: "basic, outlier stays visible in the test set",
          },
          {
            args: [[{ t: 3, v: 6 }, { t: 1, v: 2 }, { t: 4, v: 100 }, { t: 2, v: 4 }], 0.5, "v"],
            expected: { train: [{ t: 1, v: -1 }, { t: 2, v: 1 }], test: [{ t: 3, v: 3 }, { t: 4, v: 97 }], mean: 3, std: 1 },
            label: "unsorted input",
          },
          {
            args: [[{ t: 1, v: 1 }, { t: 2, v: 3 }], 0, "v"],
            expected: { train: [{ t: 1, v: -1 }, { t: 2, v: 1 }], test: [], mean: 2, std: 1 },
            label: "no test rows",
          },
          {
            args: [[{ t: 1, v: 5 }, { t: 2, v: 5 }, { t: 3, v: 9 }], 0.34, "v"],
            expected: { train: [{ t: 1, v: 0 }, { t: 2, v: 0 }], test: [{ t: 3, v: 0 }], mean: 5, std: 0 },
            label: "constant training column",
            hidden: true,
          },
          {
            args: [[{ t: 1, v: 4 }, { t: 2, v: 8 }], 1, "v"],
            expected: { train: [], test: [{ t: 1, v: 0 }, { t: 2, v: 0 }], mean: 0, std: 0 },
            label: "everything held out",
            hidden: true,
          },
        ],
        hints: [
          "Sort a copy, not the input array, and remember that a plain sort by t alone is not guaranteed to keep equal timestamps in their original order in every engine.",
          "Compute the mean and standard deviation before you build either output array, and use the same two numbers for the training rows and the test rows.",
          "To make the sort stable, map each row to a pair of the row and its original index, then compare by t first and by index second.",
        ],
        solution: `function splitAndScale(rows, testFraction, column) {
  const round = (v) => Math.round(v * 1e4) / 1e4;
  const ordered = rows
    .map((row, i) => ({ row, i }))
    .sort((a, b) => (a.row.t - b.row.t) || (a.i - b.i))
    .map((pair) => pair.row);
  const testSize = Math.floor(ordered.length * testFraction);
  const cut = ordered.length - testSize;
  const trainRows = ordered.slice(0, cut);
  const testRows = ordered.slice(cut);
  let mean = 0;
  let std = 0;
  if (trainRows.length > 0) {
    mean = trainRows.reduce((a, r) => a + r[column], 0) / trainRows.length;
    const acc = trainRows.reduce((a, r) => a + (r[column] - mean) * (r[column] - mean), 0);
    std = Math.sqrt(acc / trainRows.length);
  }
  const scale = (row) => {
    const copy = { ...row };
    copy[column] = std === 0 ? 0 : round((row[column] - mean) / std);
    return copy;
  };
  return {
    train: trainRows.map(scale),
    test: testRows.map(scale),
    mean: round(mean),
    std: round(std),
  };
}`,
        skills: ["Temporal validation", "Fit on train only", "Data leakage"],
      },
    ],
  },

  5032: {
    topicId: 5032,
    title: "Regression and regularisation",
    summary:
      "Fit a linear model, read its coefficients honestly, and use a penalty to trade a little bias for a large reduction in variance when predictors are numerous, correlated or noisy.",
    concepts: [
      "Ordinary least squares",
      "Ridge penalty",
      "Lasso and sparsity",
      "Bias variance tradeoff",
      "Feature scaling",
      "Multicollinearity",
    ],
    glossary: {
      "Ordinary least squares": "The fit that minimises the sum of squared residuals. With no penalty it is unbiased under its assumptions and can have very high variance.",
      Residual: "The difference between an observed value and the value the model predicts for it. The pattern in the residuals is where model failures show up.",
      Ridge: "A penalty on the sum of squared coefficients. It shrinks all coefficients towards zero, never exactly to zero, and handles correlated predictors gracefully.",
      Lasso: "A penalty on the sum of absolute coefficients. It can drive coefficients exactly to zero, performing selection as part of the fit.",
      "Bias variance tradeoff": "The observation that reducing a model's sensitivity to the training sample usually increases its systematic error, and that the best total error sits between the extremes.",
      Multicollinearity: "Strong correlation among predictors. Coefficients become unstable and their individual interpretation unreliable, while predictions may remain fine.",
      Standardisation: "Rescaling features to comparable spread. Required before penalisation, since otherwise the penalty depends on the units each feature happens to use.",
      Intercept: "The fitted constant term. It is left unpenalised, because shrinking it would pull predictions towards zero rather than towards the mean.",
    },
    body: {
      Beginner: `<p>A linear model draws the straight line that comes closest to the points. Closest here means that the sum of the squared vertical distances is as small as it can be.</p>
<p>With one input, the model is <code>prediction = intercept + slope * x</code>. The slope says how much the prediction changes when x goes up by one, and the intercept says where the line sits when x is zero.</p>
<h2>Reading a coefficient</h2>
<p>If the slope on advertising spend is 3.2, the model says that each extra unit of spend is associated with 3.2 more units of sales, holding the other inputs fixed. Two words in that sentence matter. <strong>Associated</strong>, not caused, for all the reasons in the previous topic. And <strong>holding the others fixed</strong>, which is only meaningful if the other inputs can actually be held fixed.</p>
<h2>Why a model can memorise</h2>
<p>Give a flexible model enough inputs and it will fit your training data beautifully, including the noise in it. That is <strong>overfitting</strong>: excellent on the data it learned from, poor on anything new.</p>
<p><strong>Regularisation</strong> is the standard cure. You add a penalty for large coefficients, so the fit has to justify every large number it uses. The result fits the training data slightly worse and new data noticeably better.</p>
<ul>
<li><strong>Ridge</strong> shrinks every coefficient towards zero without ever reaching it.</li>
<li><strong>Lasso</strong> can push coefficients exactly to zero, which removes those inputs from the model entirely.</li>
</ul>
<h2>Units matter now</h2>
<p>A penalty on the size of a coefficient is unfair if one input is measured in pounds and another in thousands of pounds, because the coefficient sizes are not comparable. Standardise the inputs first, so every one of them has a similar spread and the penalty treats them equally.</p>
<aside class="tip">Always plot the residuals against the prediction. If they form a curve or a fan rather than a shapeless cloud, the straight line assumption is wrong and the coefficients are describing something other than what you think.</aside>`,
      Intermediate: `<p>Least squares has a closed form solution and a clear meaning, and both are conditional on assumptions worth naming: the relationship is linear in the parameters, errors are independent with constant variance, and the predictors are not perfectly collinear. Violations do not usually announce themselves in the fitted values; they show up in the residuals and in the stability of the coefficients.</p>
<h2>The variance problem</h2>
<p>The variance of the coefficient estimates grows as predictors become correlated. With two strongly correlated inputs, the fit can place a large positive weight on one and a large negative weight on the other, and a small change in the sample flips them. The predictions are stable, and the coefficients are not. This is exactly the situation regularisation was designed for.</p>
<h2>What each penalty does</h2>
<pre>ridge:  minimise  RSS + alpha * sum(beta ** 2)
lasso:  minimise  RSS + alpha * sum(abs(beta))</pre>
<ul>
<li>Ridge shrinks correlated predictors together, sharing weight among them. It never zeroes a coefficient, so the model keeps every feature.</li>
<li>Lasso produces exact zeros, so it selects a subset. Among correlated predictors it tends to pick one arbitrarily and drop the rest, which is convenient for parsimony and unstable for interpretation.</li>
<li>Elastic net combines both, keeping groups of correlated predictors together while still producing sparsity.</li>
</ul>
<p>As the penalty strength rises, coefficients shrink towards zero, bias rises and variance falls. The best value is not derivable from theory; it is chosen by cross validation over a grid, inside the training data.</p>
<h2>Practical requirements</h2>
<ul>
<li>Standardise features before penalising, and do it inside the pipeline so it is fitted on training folds only.</li>
<li>Do not penalise the intercept. Shrinking it drags predictions towards zero instead of towards the mean of the target.</li>
<li>Encode categorical variables before fitting, and remember that penalisation treats each dummy column separately, which splits the influence of a many level category.</li>
</ul>
<h2>Diagnostics that earn their place</h2>
<p>Residuals against fitted values reveal non linearity and changing variance. A high variance inflation factor identifies which predictors are collinear. And comparing the training error with the cross validated error is the fastest way to tell overfitting from underfitting: a large gap means variance, and two similar but poor scores mean the model class is too simple or the features carry too little signal.</p>
<aside class="tip">When the goal is prediction, judge the model on held out error and let the penalty do its work. When the goal is to interpret a specific coefficient, regularisation biases it deliberately, so the shrunken value is not the quantity you want to quote.</aside>`,
      Advanced: `<p>Ridge regression has an exact solution obtained by adding a multiple of the identity to the cross product matrix before inverting, which is where its numerical advantage comes from: it conditions a matrix that may be near singular. This is not a metaphor for stability, it is the mechanism. Lasso has no closed form and is solved by coordinate descent or by path algorithms that trace the whole solution as the penalty varies.</p>
<h2>Shrinkage in the eigenbasis</h2>
<p>Ridge shrinks each principal direction of the predictor matrix by a factor depending on that direction's variance. Directions with little variance, which are exactly the ones whose coefficients are least well determined, are shrunk hardest. That is why the estimator improves mean squared error despite being biased, and why it interacts so directly with collinearity: a near collinear pair produces a low variance direction that ridge damps.</p>
<h2>Choosing and reporting the penalty</h2>
<ul>
<li>The penalty must be selected inside cross validation, and reporting the cross validated score of the selected penalty as an unbiased estimate is the nested selection error from the previous topic.</li>
<li>The one standard error rule chooses the strongest penalty whose score is within one standard error of the best, deliberately preferring the simpler model when the difference is within noise.</li>
<li>Efficient path algorithms make an entire grid nearly as cheap as a single fit, so a coarse grid is a false economy.</li>
</ul>
<h2>Where linear models still win</h2>
<p>On wide data with few observations, on problems requiring extrapolation beyond the observed range, and wherever a coefficient must be explained to a regulator, a penalised linear model remains the right answer. Its failure modes are known, its uncertainty is quantifiable and its behaviour outside the training range is at least predictable, which is more than can be said for the tree ensembles covered later.</p>
<h2>Interpretation under penalisation</h2>
<p>Regularised coefficients are biased by construction, so their magnitudes are not estimates of a causal or even of a marginal effect. Standard errors from an unpenalised fit do not apply to a penalised one, and post selection inference after lasso requires methods designed for it rather than a naive refit on the selected variables, which produces intervals that are too narrow because the selection step is ignored.</p>
<aside class="tip">Report the penalty strength along with the coefficients. Without it a coefficient vector is uninterpretable, since the same data at a different penalty yields a different vector with equal claim to being the model.</aside>`,
      Expert: `<p>Penalised least squares is a maximum a posteriori estimate under a prior on the coefficients: Gaussian for ridge, Laplace for lasso. That equivalence explains the qualitative difference in behaviour, since the Laplace density has a point of non differentiability at zero, and it is exactly that kink that produces exact zeros in the solution. It also clarifies the interpretive limits: the estimator is a posterior mode under an assumed prior, and reporting it as though it were an unbiased frequentist estimate mixes two frameworks.</p>
<h2>Degrees of freedom and effective complexity</h2>
<p>The effective degrees of freedom of a ridge fit is the trace of the hat matrix, which decreases smoothly from the number of predictors towards zero as the penalty grows. This makes complexity continuous rather than discrete, and it is the basis for information criteria adapted to penalised fits. For lasso the number of non zero coefficients is an unbiased estimate of the degrees of freedom, a result that is more surprising than it looks because it ignores the selection.</p>
<h2>Guarantees and their conditions</h2>
<p>Lasso recovers the true support under conditions on the design matrix, an irrepresentable condition bounding how well irrelevant predictors can be represented by relevant ones. When correlated predictors violate it, the selected set is not consistent, which is the formal statement behind the practical observation that lasso picks one of a correlated group arbitrarily. Elastic net relaxes this by adding strict convexity, which is why it groups correlated predictors instead of choosing among them.</p>
<h2>What is commonly misstated</h2>
<ul>
<li>Ridge is described as handling multicollinearity, and what it does is stabilise prediction under collinearity. The individual coefficients remain uninterpretable, merely shrunk.</li>
<li>Lasso is presented as feature selection with statistical validity. The selection is data dependent, so any inference on the selected variables must account for that step, and the naive refit does not.</li>
<li>Scaling is treated as a preprocessing convention. Under a penalty it is part of the estimator's definition: change the scaling and you have changed the model, not just its conditioning.</li>
<li>The bias variance decomposition is presented as if the optimum were always interior. In the modern over parameterised regime the risk curve can descend again beyond the interpolation point, which is why very large models do not behave as the classical picture predicts.</li>
</ul>
<aside class="tip">Fix the estimator by writing down the objective, the penalty, the scaling rule and the selection protocol together. Any one of them stated informally makes the reported coefficients irreproducible.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Ridge regression on one feature, by hand",
        difficulty: "Medium",
        statement: `<p>Fit <code>y = b + w * x</code> with a ridge penalty on the slope, using the closed form solution. One feature is enough to see shrinkage clearly, and the arithmetic stays visible.</p>
<p>Centre both variables, then:</p>
<pre>w = sum((x - xbar) * (y - ybar)) / (sum((x - xbar) ** 2) + lambda)
b = ybar - w * xbar</pre>
<p>Return <code>{ w, b }</code>, each rounded to 4 decimal places with <code>Math.round(v * 1e4) / 1e4</code>. Compute with unrounded intermediates and round only the two returned numbers.</p>
<p>Notice what the formula encodes:</p>
<ul>
<li>With <code>lambda</code> equal to 0 this is ordinary least squares.</li>
<li>As <code>lambda</code> grows, the denominator grows and the slope shrinks towards zero, while the intercept moves towards the mean of <code>y</code>. That is the whole idea of shrinkage in one line.</li>
<li>The intercept is never penalised. It is derived after the slope so that the fitted line always passes through the point of means.</li>
</ul>
<p>Edge rules:</p>
<ul>
<li>Empty input returns <code>{ w: 0, b: 0 }</code>.</li>
<li>If the denominator is exactly 0, which happens when the feature is constant and lambda is 0, set <code>w</code> to 0 and let <code>b</code> be the mean of <code>y</code>.</li>
</ul>`,
        fn: "ridgeFit",
        params: "x, y, lambda",
        tests: [
          { args: [[1, 2, 3, 4], [3, 5, 7, 9], 0], expected: { w: 2, b: 1 }, label: "ordinary least squares on an exact line" },
          { args: [[1, 2, 3, 4], [3, 5, 7, 9], 10], expected: { w: 0.6667, b: 4.3333 }, label: "shrinkage" },
          { args: [[1, 2, 3, 4], [3, 5, 7, 9], 100000], expected: { w: 0.0001, b: 5.9998 }, label: "heavy penalty collapses to the mean" },
          { args: [[0, 1, 2, 3, 4], [1, 1, 4, 3, 6], 1], expected: { w: 1.0909, b: 0.8182 }, label: "noisy data", hidden: true },
          { args: [[2, 2, 2], [1, 5, 9], 0], expected: { w: 0, b: 5 }, label: "constant feature", hidden: true },
          { args: [[], [], 1], expected: { w: 0, b: 0 }, label: "empty input" },
        ],
        hints: [
          "Compute the two means first. Every other term in the formula is expressed as a deviation from them.",
          "Accumulate the cross product sum and the squared deviation sum in a single pass over the arrays.",
          "Add lambda to the squared deviation sum before dividing, and guard the case where that total is zero rather than letting the division produce Infinity or NaN.",
        ],
        solution: `function ridgeFit(x, y, lambda) {
  const round = (v) => Math.round(v * 1e4) / 1e4;
  const n = x.length;
  if (n === 0) return { w: 0, b: 0 };
  const xbar = x.reduce((a, b) => a + b, 0) / n;
  const ybar = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - xbar) * (y[i] - ybar);
    sxx += (x[i] - xbar) * (x[i] - xbar);
  }
  const denom = sxx + lambda;
  const w = denom === 0 ? 0 : sxy / denom;
  return { w: round(w), b: round(ybar - w * xbar) };
}`,
        skills: ["Ridge penalty", "Ordinary least squares", "Bias variance tradeoff"],
      },
    ],
  },

  5033: {
    topicId: 5033,
    title: "Classification and the metric that fits the problem",
    summary:
      "Choose an evaluation metric from the cost of the two mistakes rather than from habit, and treat the decision threshold as a separate, tunable decision from the model that produces the score.",
    concepts: [
      "Confusion matrix",
      "Precision and recall",
      "F1 score",
      "Class imbalance",
      "Decision threshold",
      "ROC and PR curves",
      "Calibration",
    ],
    glossary: {
      "Confusion matrix": "The four counts of true positives, false positives, false negatives and true negatives. Every classification metric is a ratio computed from these.",
      Precision: "Of the cases you flagged, the share that were genuinely positive. It answers how much of the alert queue is worth working.",
      Recall: "Of the genuinely positive cases, the share you flagged. It answers how much of the problem you caught.",
      "F1 score": "The harmonic mean of precision and recall. It punishes an imbalance between them and it assumes the two errors cost roughly the same.",
      "Decision threshold": "The score above which a case is called positive. Moving it trades precision against recall without retraining anything.",
      "ROC curve": "True positive rate against false positive rate across all thresholds. It is insensitive to class balance, which makes it flattering on rare positive problems.",
      "Precision recall curve": "Precision against recall across all thresholds. It is the informative view when positives are rare, since its baseline is the positive rate itself.",
      Calibration: "Whether a predicted probability of 0.7 corresponds to being right about seventy per cent of the time. Ranking can be excellent while calibration is poor.",
    },
    body: {
      Beginner: `<p>A classifier answers a yes or no question: is this transaction fraudulent, will this customer cancel, is this email spam. There are two ways to be right and two ways to be wrong, and they are not equally serious.</p>
<ul>
<li><strong>True positive</strong>: you flagged it and it was real.</li>
<li><strong>False positive</strong>: you flagged it and it was fine. A false alarm.</li>
<li><strong>False negative</strong>: you missed a real one.</li>
<li><strong>True negative</strong>: you left it alone and it was fine.</li>
</ul>
<h2>Why accuracy lies</h2>
<p>Suppose one transaction in a thousand is fraudulent. A model that says "not fraud" to absolutely everything is right 99.9 per cent of the time. Its accuracy is superb and it is completely useless, because it never catches anything.</p>
<p>So use two numbers instead:</p>
<ul>
<li><strong>Precision</strong>: out of everything you flagged, how much was real? This is the quality of your alerts.</li>
<li><strong>Recall</strong>: out of everything real, how much did you catch? This is your coverage.</li>
</ul>
<h2>The dial between them</h2>
<p>Most models output a score between 0 and 1 rather than a flat yes or no. You choose where to cut. Lower the cut and you flag more cases: recall rises, precision falls. Raise it and the opposite happens. Nothing about the model changed, only the threshold.</p>
<h2>Which one matters is a business question</h2>
<ul>
<li>Screening for a serious illness: missing a case is far worse than an extra check, so favour recall.</li>
<li>Automatically blocking accounts: a false accusation is expensive, so favour precision.</li>
</ul>
<aside class="tip">Ask what happens to a case after the model flags it, and what happens to one it misses. The relative cost of those two outcomes selects your metric, and no statistical argument can select it for you.</aside>`,
      Intermediate: `<p>The confusion matrix is the base object, and every metric worth knowing is a ratio taken from it. Learning the ratios as ratios, rather than as names, means you can derive the right one for a problem you have not seen before.</p>
<h2>The ratios</h2>
<ul>
<li>Precision is true positives over predicted positives.</li>
<li>Recall, also called sensitivity or the true positive rate, is true positives over actual positives.</li>
<li>Specificity is true negatives over actual negatives.</li>
<li>The F1 score is the harmonic mean of precision and recall, which is close to the smaller of the two rather than to their average, so it cannot be gamed by pushing one to an extreme.</li>
</ul>
<p>The harmonic mean is the reason F1 is used rather than a plain average. A model with precision 1.0 and recall 0.01 averages to 0.505 and scores 0.0198 on F1, which is the honest verdict.</p>
<h2>Threshold selection is a separate step</h2>
<p>Train the model, then choose the threshold on validation data against the cost you care about:</p>
<pre>probs = model.predict_proba(X_val)[:, 1]
best = max(
    ((t, f1_score(y_val, probs >= t)) for t in np.linspace(0.05, 0.95, 19)),
    key=lambda pair: pair[1],
)</pre>
<p>Where the costs are genuinely known, skip the named metrics and minimise expected cost directly, since a false negative worth ten times a false positive implies a specific threshold that no standard metric will find for you.</p>
<h2>ROC or precision recall</h2>
<p>The ROC curve plots the true positive rate against the false positive rate and is invariant to class balance, which sounds like a virtue and is a trap on rare event problems: the false positive rate has a huge denominator, so a model producing an unusable flood of false alarms can still show an impressive curve. When positives are rare, use the precision recall curve, whose baseline is the positive rate and which therefore reflects what the alert queue will look like.</p>
<h2>Imbalance is a threshold and cost problem first</h2>
<p>Before resampling anything, try the simple options: adjust the threshold, weight the classes in the loss, and evaluate with a metric suited to the imbalance. Oversampling the minority class changes the training distribution and therefore the meaning of the predicted probabilities, so a model trained on rebalanced data needs recalibration before its scores can be read as probabilities.</p>
<aside class="tip">Report the confusion matrix at the operating threshold you intend to use, not just a headline metric. Four counts tell a stakeholder what the system will do next week in a way that a single number never does.</aside>`,
      Advanced: `<p>Once the ratios are second nature, the questions worth asking are about ranking versus probability, about what a metric implies when averaged, and about what happens to any of this when the deployment prevalence differs from the training prevalence.</p>
<h2>Ranking quality and calibration are different properties</h2>
<p>A model can order cases perfectly while its predicted probabilities are systematically too high. Threshold based metrics and the area under the ROC curve measure only the ordering. Any decision that combines a probability with a monetary value needs calibration as well, and the standard remedies fit a mapping from scores to probabilities on held out data: a logistic mapping when the distortion is smooth, an isotonic one when it is not, at the cost of needing more data and being prone to overfitting the calibration set.</p>
<h2>Averaging over classes</h2>
<ul>
<li>Macro averaging treats every class equally, so a tiny class has the same influence as a dominant one. It is the right choice when rare classes matter as much as common ones.</li>
<li>Micro averaging pools the counts, so it is dominated by frequent classes and equals accuracy in the single label case.</li>
<li>Weighted averaging is a compromise that is easy to report and hard to interpret, since it hides which classes are failing.</li>
</ul>
<h2>Prevalence shift</h2>
<p>Precision depends on prevalence and recall does not. A model with fixed sensitivity and specificity produces very different precision in a population where the positive rate is one per cent than in one where it is ten. This is why offline precision measured on a resampled evaluation set is not what the alert queue will show in production, and why the evaluation set should preserve the deployment prevalence or the metric should be recomputed for it explicitly.</p>
<h2>Metrics beyond the usual pair</h2>
<p>Balanced accuracy averages sensitivity and specificity and is a reasonable default under imbalance. The Matthews correlation coefficient uses all four cells and stays informative when one class dominates, which the F1 score does not since it ignores true negatives entirely. Where a queue has a fixed capacity, precision at k is the metric that matches the operation, because the analyst can only review so many cases per day regardless of what the model would like to flag.</p>
<aside class="tip">Define the operating point as part of the model artefact. A model shipped without its threshold, its expected prevalence and its calibration method is not deployable, and the person who has to choose them later will not have the validation data you had.</aside>`,
      Expert: `<p>Classification metrics are functionals of the joint distribution of the score and the label, and most disagreements about which to use are disagreements about which functional the decision problem induces. Under a stated cost matrix the Bayes optimal decision rule thresholds the posterior probability at a value determined entirely by the ratio of costs, which means the metric question is answered by the decision problem whenever costs are known. The named metrics exist for the case where costs are not known, and each encodes an implicit assumption about them that is rarely examined.</p>
<h2>Proper scoring rules</h2>
<p>A scoring rule is proper when its expected value is optimised by reporting the true probability. The Brier score and log loss are proper; accuracy, precision, recall and F1 are not, since they are computed after a thresholding step that discards the probability. Optimising a non proper metric directly can therefore push a model away from truthful probabilities, which is acceptable when only the ranking is used and harmful whenever the output feeds an expected value calculation downstream.</p>
<h2>Decomposition and what it reveals</h2>
<p>The Brier score decomposes into calibration, refinement and the irreducible uncertainty of the base rate. This is more informative than any single number, because it separates a model that is confidently wrong from one that is honestly uncertain, and those two require entirely different fixes. Reliability diagrams are the visual form of the same decomposition and are the fastest way to see that a model's probabilities are unusable despite an excellent area under the curve.</p>
<h2>What the standard treatment gets wrong</h2>
<ul>
<li>Area under the ROC curve is described as a general purpose summary. It equals the probability that a random positive outranks a random negative, which is a ranking statement with no reference to any operating point, and it is famously insensitive to the region of the curve anyone actually operates in.</li>
<li>The F1 score is presented as the balanced choice. It weights precision and recall equally, which is a cost assumption rather than a neutral position, and it ignores true negatives entirely, so it is not comparable across datasets with different balances.</li>
<li>Synthetic minority oversampling is recommended for imbalance as though it were free. It interpolates between minority points in feature space, which invents observations in regions that may be empty for good reasons, and it distorts calibration.</li>
<li>Threshold tuning on the test set is described as an evaluation step. It is a fitting step, it consumes the test set, and the resulting operating point needs its own held out confirmation.</li>
</ul>
<aside class="tip">Write the cost of each error in the units the organisation uses before choosing a metric. If that cannot be done even approximately, say so explicitly, because every metric you then pick is a silent guess at those numbers.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Confusion matrix and the metrics derived from it",
        difficulty: "Medium",
        statement: `<p>Given true labels, predicted scores and a decision threshold, compute the confusion matrix and the standard ratios. This is the function every classification report is built on.</p>
<p>A case is predicted positive when its score is <strong>greater than or equal to</strong> the threshold.</p>
<p>Return an object with these keys, in this order:</p>
<ul>
<li><code>tp</code>, <code>fp</code>, <code>fn</code>, <code>tn</code>: the four counts.</li>
<li><code>precision</code>: <code>tp / (tp + fp)</code>.</li>
<li><code>recall</code>: <code>tp / (tp + fn)</code>.</li>
<li><code>f1</code>: the harmonic mean, <code>2 * precision * recall / (precision + recall)</code>, computed from the rounded precision and recall values.</li>
<li><code>accuracy</code>: <code>(tp + tn)</code> over the total number of cases.</li>
</ul>
<p>Rules:</p>
<ul>
<li>Round every ratio to 4 decimal places with <code>Math.round(v * 1e4) / 1e4</code>.</li>
<li>Any ratio whose denominator is 0 is <code>0</code>, not NaN. A model that flags nothing has undefined precision in the mathematics and zero precision in the operations room, and a report that returns NaN breaks every dashboard downstream.</li>
<li><code>yTrue</code> holds <code>1</code> for positive and <code>0</code> for negative. The two arrays have the same length.</li>
</ul>
<pre>classificationReport([1, 1, 0, 0], [0.6, 0.4, 0.55, 0.1], 0.5)
// tp 1, fp 1, fn 1, tn 1, precision 0.5, recall 0.5</pre>`,
        fn: "classificationReport",
        params: "yTrue, yScore, threshold",
        tests: [
          {
            args: [[1, 0, 1, 0], [0.9, 0.2, 0.8, 0.4], 0.5],
            expected: { tp: 2, fp: 0, fn: 0, tn: 2, precision: 1, recall: 1, f1: 1, accuracy: 1 },
            label: "perfect separation",
          },
          {
            args: [[1, 1, 0, 0], [0.6, 0.4, 0.55, 0.1], 0.5],
            expected: { tp: 1, fp: 1, fn: 1, tn: 1, precision: 0.5, recall: 0.5, f1: 0.5, accuracy: 0.5 },
            label: "one of each outcome",
          },
          {
            args: [[1, 0, 1], [0.1, 0.2, 0.3], 0.9],
            expected: { tp: 0, fp: 0, fn: 2, tn: 1, precision: 0, recall: 0, f1: 0, accuracy: 0.3333 },
            label: "threshold so high nothing is flagged",
          },
          {
            args: [[0, 0, 0, 0, 0, 0, 0, 0, 1, 1], [0.1, 0.1, 0.6, 0.2, 0.1, 0.1, 0.1, 0.1, 0.7, 0.3], 0.5],
            expected: { tp: 1, fp: 1, fn: 1, tn: 7, precision: 0.5, recall: 0.5, f1: 0.5, accuracy: 0.8 },
            label: "rare positive class, accuracy flatters",
            hidden: true,
          },
          {
            args: [[], [], 0.5],
            expected: { tp: 0, fp: 0, fn: 0, tn: 0, precision: 0, recall: 0, f1: 0, accuracy: 0 },
            label: "empty input",
            hidden: true,
          },
        ],
        hints: [
          "Count the four cells in a single pass. For each case, work out the prediction first, then compare it with the true label.",
          "Write one small helper that takes a numerator and a denominator and returns 0 when the denominator is 0. Use it for every ratio so the guard cannot be forgotten in one place.",
          "The F1 formula has its own zero denominator case: when precision and recall are both 0 their sum is 0, so check that before dividing.",
        ],
        solution: `function classificationReport(yTrue, yScore, threshold) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const predicted = yScore[i] >= threshold ? 1 : 0;
    if (yTrue[i] === 1 && predicted === 1) tp += 1;
    else if (yTrue[i] === 0 && predicted === 1) fp += 1;
    else if (yTrue[i] === 1 && predicted === 0) fn += 1;
    else tn += 1;
  }
  const safe = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 1e4) / 1e4);
  const precision = safe(tp, tp + fp);
  const recall = safe(tp, tp + fn);
  const f1 =
    precision + recall === 0
      ? 0
      : Math.round(((2 * precision * recall) / (precision + recall)) * 1e4) / 1e4;
  return { tp, fp, fn, tn, precision, recall, f1, accuracy: safe(tp + tn, yTrue.length) };
}`,
        skills: ["Confusion matrix", "Precision and recall", "Decision threshold"],
      },
    ],
  },

  5034: {
    topicId: 5034,
    title: "Trees, forests and gradient boosting",
    summary:
      "Understand the split search that builds a decision tree, then see how averaging many trees and how fitting trees to residuals produce the two ensemble families that dominate tabular prediction.",
    concepts: [
      "Decision tree",
      "Gini impurity",
      "Greedy split search",
      "Bagging and random forests",
      "Gradient boosting",
      "Feature importance",
      "Overfitting control",
    ],
    glossary: {
      "Decision tree": "A model that repeatedly splits the data on one feature at a time, predicting the majority class or the mean value in each final region.",
      "Gini impurity": "The probability that two randomly drawn members of a node have different labels. It is 0 for a pure node and 0.5 for a balanced binary node.",
      "Greedy split": "Choosing the best split at each node without considering what splits become available later. Fast, and not guaranteed to find the best overall tree.",
      Bagging: "Training many models on bootstrap resamples and averaging them, which reduces variance without increasing bias much.",
      "Random forest": "Bagging plus a random subset of features considered at each split, which decorrelates the trees and improves the averaging.",
      "Gradient boosting": "Fitting each new small tree to the errors of the ensemble so far, so the model improves in sequential steps controlled by a learning rate.",
      "Learning rate": "The factor applied to each boosting step. Smaller values need more trees and generalise better, which is the main tuning tradeoff.",
      "Feature importance": "A score for how much a feature contributed. The impurity based version is biased towards high cardinality features, so permutation based scores are preferred.",
    },
    body: {
      Beginner: `<p>A decision tree is a sequence of yes or no questions. Is the customer's tenure less than 12 months? If yes, ask another question. If no, ask a different one. At the end of each path you arrive at a prediction.</p>
<p>What makes it a learned model rather than a set of rules someone wrote is that the questions are chosen from the data. At each step the algorithm tries every feature and every sensible cut point and keeps the one that separates the classes best.</p>
<h2>Measuring how good a split is</h2>
<p>A group is <strong>pure</strong> if everything in it has the same label. <strong>Gini impurity</strong> puts a number on that: 0 for a group that is all one class, and 0.5 for a fifty fifty mix in a two class problem.</p>
<p>A split makes two groups, so we score it by the impurity of both, weighted by how many rows landed in each. The best split is the one with the lowest weighted impurity.</p>
<h2>Why one tree is not enough</h2>
<p>Left alone, a tree keeps splitting until every leaf is pure, which means it has memorised the training data down to the noise. It will be excellent on the rows it learned and unreliable on new ones.</p>
<p>Two fixes are standard, and both use many trees:</p>
<ul>
<li>A <strong>random forest</strong> grows hundreds of trees on different random samples of the data and averages them. Individual mistakes cancel out.</li>
<li><strong>Gradient boosting</strong> grows small trees one after another, each one focusing on what the previous ones got wrong.</li>
</ul>
<aside class="tip">Trees do not need features on the same scale, because a split on a threshold does not care about units. That is one of the main reasons they are so convenient on messy tabular data.</aside>`,
      Intermediate: `<p>Tree ensembles are the default for tabular data, and the reason is worth understanding rather than accepting: a tree learns non linear boundaries and interactions between features without being told which interactions to look for, and averaging fixes the variance problem that a single tree has.</p>
<h2>How a split is chosen</h2>
<p>At each node the algorithm considers each feature, sorts the values, and evaluates candidate thresholds between adjacent distinct values. For each candidate it computes the weighted impurity of the two children, and it keeps the best one. Then it recurses. The search is greedy: it never revisits an earlier split in the light of what happened below it, which is why a tree can be suboptimal in an obvious way and still be built in a reasonable amount of time.</p>
<pre>weighted impurity = (nL / n) * gini(left) + (nR / n) * gini(right)</pre>
<p>Regression trees are identical with variance in place of impurity, so the split is chosen to make the two children as internally uniform as possible.</p>
<h2>The two ensemble families</h2>
<ul>
<li><strong>Bagging and random forests</strong> reduce variance. Trees are grown deep and independently on bootstrap samples, with a random subset of features considered at each split so the trees do not all follow the same dominant feature. They are hard to overfit by adding more trees, and they parallelise trivially.</li>
<li><strong>Boosting</strong> reduces bias. Trees are shallow and sequential, each fitted to the gradient of the loss with respect to the current predictions, scaled by a learning rate. More trees eventually overfit, so the number of rounds is a tuning parameter and early stopping on a validation set is standard.</li>
</ul>
<h2>What to tune, in order</h2>
<p>For a forest: the number of trees, as many as you can afford; the number of features per split; and a minimum leaf size to stop the trees memorising.</p>
<p>For boosting: the learning rate and the number of rounds together, since they trade off directly; the maximum depth, typically small; and the subsample fraction, which adds useful randomness. A low learning rate with early stopping is the reliable recipe.</p>
<h2>Reading importance carefully</h2>
<p>The default impurity based importance is biased towards features with many distinct values, because such features offer more candidate splits and can reduce impurity by chance. Permutation importance, which measures how much held out performance degrades when a feature is shuffled, is slower and much more trustworthy. Neither is a causal statement, and correlated features share importance between them in ways that make individual rankings unstable.</p>
<aside class="tip">Trees cannot extrapolate. A prediction beyond the range of the training data is capped at whatever the nearest leaf learned, so any trend that continues outside the observed range needs a linear component or an explicit transformation.</aside>`,
      Advanced: `<p>The interesting behaviour of ensembles comes from how the errors of their members combine. Averaging independent unbiased predictors reduces variance in proportion to the number of them, and averaging correlated ones does not, so decorrelation is the entire design goal of a random forest and is why the random feature subset matters more than the bootstrap.</p>
<h2>Boosting mechanics</h2>
<p>Modern implementations fit each tree to the gradient and the curvature of the loss at the current predictions, which turns boosting into a general procedure for any twice differentiable objective rather than a technique tied to squared error. Practical consequences follow directly. The loss becomes a choice: squared error, absolute error, a quantile loss for a prediction interval, or a ranking objective, all with the same machinery. Regularisation enters through shrinkage, tree complexity penalties, subsampling of rows and columns, and the number of rounds, all of which interact and none of which can be tuned in isolation.</p>
<h2>Categorical features and missing values</h2>
<ul>
<li>One hot encoding a high cardinality category creates many sparse columns, each of which offers a weak split, and it systematically disadvantages that feature in the split search.</li>
<li>Implementations with native categorical handling sort categories by their target statistic and split on the ordering, which is far more effective and introduces a leakage risk that the good implementations control with ordered boosting or with fold aware statistics.</li>
<li>Missing values can be handled natively by learning a default direction at each split, which usually beats imputation and preserves the informativeness of the absence itself.</li>
</ul>
<h2>Where ensembles disappoint</h2>
<p>They cannot extrapolate beyond the training range, so a time trend must be differenced or modelled separately rather than fed in as a raw timestamp. They are large and slow to serve relative to a linear model. Their probabilities are often poorly calibrated, particularly for forests where averaging votes pushes predictions towards the middle. And they will happily exploit a leaked feature more effectively than any other model class, which is why a suspiciously strong result from a boosted model should trigger a leakage audit before a celebration.</p>
<aside class="tip">Compare against a penalised linear model on the same features before concluding that the ensemble is necessary. When the gap is small, the simpler model is easier to explain, faster to serve and less likely to be quietly exploiting an artefact.</aside>`,
      Expert: `<p>A regression tree is a piecewise constant estimator over axis aligned rectangles, and every property of the family follows from that geometry. It explains why interactions are learned for free, since a rectangle is defined by conditions on several features simultaneously; why smooth functions require many splits to approximate; why rotating the feature space destroys performance, since the partition is axis aligned by construction; and why extrapolation is impossible, since the outermost rectangle extends to infinity with a constant value.</p>
<h2>Why the ensembles work, formally</h2>
<p>Bagging reduces the variance of an averaged predictor towards the pairwise correlation between members times the individual variance, so the achievable reduction is bounded by that correlation rather than by the number of trees. Random feature selection lowers the correlation at the cost of raising each tree's individual variance, and the optimum is an interior point, which is exactly why the number of features per split is worth tuning and why the common defaults are only starting points.</p>
<p>Boosting is functional gradient descent in the space of functions, with each tree a step in the direction that most reduces the loss. This framing explains shrinkage as a step size, early stopping as an implicit regulariser equivalent in spirit to a penalty on the number of steps, and the empirical superiority of many small steps over few large ones as the usual behaviour of a first order method on a non convex landscape.</p>
<h2>Interpretation and its pitfalls</h2>
<ul>
<li>Impurity based importance is computed on training data and is inflated for high cardinality and continuous features. Permutation importance on held out data avoids that and is itself misleading under correlated features, since permuting one of a correlated pair produces implausible inputs and understates both.</li>
<li>Additive attribution methods provide local explanations with a consistency guarantee, and their exact tree algorithm makes them practical. They explain the model's output rather than the data generating process, and interpreting them causally is the most common misuse in applied work.</li>
<li>Partial dependence plots average over the marginal distribution and therefore evaluate the model at combinations of features that may never occur, which is why accumulated local effects are preferred when features are dependent.</li>
</ul>
<h2>What the field agrees on but rarely writes down</h2>
<p>On mid sized tabular problems with heterogeneous features, well tuned gradient boosting remains at or near the state of the art, and neural approaches have not displaced it despite persistent claims. The reasons appear to be the axis aligned inductive bias matching how tabular features are constructed, robustness to uninformative features, and insensitivity to monotone transformations. Knowing this saves a great deal of time: the productive investment on a tabular problem is in features, in the evaluation protocol and in leakage hunting, not in architecture search.</p>
<aside class="tip">Fix the random seed and record the library version with the model. Ensemble results vary across seeds by an amount that is frequently larger than the difference between the configurations being compared.</aside>`,
    },
    problems: [
      {
        n: 1,
        title: "Find the best split by weighted Gini impurity",
        difficulty: "Hard",
        statement: `<p>Implement the search at the heart of every decision tree. Given a set of labelled samples, find the single split that minimises the weighted Gini impurity of the two children.</p>
<p>Each sample is <code>{ features: [numbers], label: 0 or 1 }</code>, and every sample has the same number of features.</p>
<p>For each feature index, consider the sorted distinct values of that feature and take the midpoint between each adjacent pair as a candidate threshold. A sample goes left when its value is <strong>strictly less than</strong> the threshold and right otherwise.</p>
<p>Score a candidate as:</p>
<pre>gini(group)  = 1 - p1 * p1 - p0 * p0        where p1 is the share of label 1
weighted     = (nLeft / n) * gini(left) + (nRight / n) * gini(right)</pre>
<p>Return <code>{ feature, threshold, gini }</code> for the best candidate, with <code>threshold</code> and <code>gini</code> rounded to 4 decimal places using <code>Math.round(v * 1e4) / 1e4</code>. Compare candidates on the rounded gini.</p>
<p>Rules:</p>
<ul>
<li>Ties break on the lower feature index first, then on the lower threshold.</li>
<li>Return <code>null</code> when no split is possible: fewer than two samples, or every feature constant across all samples.</li>
<li>A pure split scores exactly 0, which is the best score attainable.</li>
</ul>`,
        fn: "bestSplit",
        params: "samples",
        tests: [
          {
            args: [[{ features: [1, 9], label: 0 }, { features: [2, 3], label: 0 }, { features: [8, 9], label: 1 }, { features: [9, 3], label: 1 }]],
            expected: { feature: 0, threshold: 5, gini: 0 },
            label: "separable on the first feature",
          },
          {
            args: [[{ features: [1, 1], label: 0 }, { features: [5, 2], label: 0 }, { features: [2, 8], label: 1 }, { features: [6, 9], label: 1 }]],
            expected: { feature: 1, threshold: 5, gini: 0 },
            label: "the second feature is the informative one",
          },
          {
            args: [[{ features: [1], label: 0 }, { features: [2], label: 1 }, { features: [3], label: 0 }, { features: [4], label: 1 }]],
            expected: { feature: 0, threshold: 1.5, gini: 0.3333 },
            label: "no clean split, lowest threshold wins the tie",
          },
          {
            args: [[{ features: [3, 3], label: 0 }, { features: [3, 3], label: 1 }]],
            expected: null,
            label: "every feature constant",
            hidden: true,
          },
          {
            args: [[{ features: [1], label: 1 }]],
            expected: null,
            label: "too few samples",
            hidden: true,
          },
        ],
        hints: [
          "Write the gini helper first and test it mentally on two cases: a group that is all one label scores 0, and an evenly mixed group scores 0.5.",
          "Candidate thresholds come from the sorted distinct values of one feature. With k distinct values there are k minus 1 midpoints, and a feature with one distinct value offers none.",
          "Keep a single best object and replace it only when a candidate scores strictly lower. Because you iterate features in ascending order and thresholds in ascending order, strict comparison gives you both tie break rules for free.",
        ],
        solution: `function bestSplit(samples) {
  if (samples.length < 2) return null;
  const round = (v) => Math.round(v * 1e4) / 1e4;
  const gini = (group) => {
    if (group.length === 0) return 0;
    const p = group.filter((s) => s.label === 1).length / group.length;
    return 1 - p * p - (1 - p) * (1 - p);
  };
  const nFeatures = samples[0].features.length;
  let best = null;
  for (let f = 0; f < nFeatures; f++) {
    const values = [...new Set(samples.map((s) => s.features[f]))].sort((a, b) => a - b);
    for (let i = 1; i < values.length; i++) {
      const threshold = round((values[i - 1] + values[i]) / 2);
      const left = samples.filter((s) => s.features[f] < threshold);
      const right = samples.filter((s) => s.features[f] >= threshold);
      if (left.length === 0 || right.length === 0) continue;
      const score = round(
        (left.length / samples.length) * gini(left) + (right.length / samples.length) * gini(right),
      );
      if (best === null || score < best.gini) best = { feature: f, threshold, gini: score };
    }
  }
  return best;
}`,
        skills: ["Gini impurity", "Greedy split search", "Decision tree"],
      },
    ],
  },

  5035: {
    topicId: 5035,
    title: "Capstone: end-to-end prediction project",
    summary:
      "Take one messy dataset from raw file to a defended prediction, producing a reproducible pipeline, an honest evaluation against a baseline, an error analysis and a written statement of what the model must not be used for.",
    concepts: [
      "Problem framing",
      "Baseline model",
      "Evaluation protocol",
      "Error analysis",
      "Reproducibility",
      "Model documentation",
    ],
    glossary: {
      Estimand: "The quantity you are predicting, stated precisely: what is predicted, for whom, at what moment, and using information available at that moment.",
      Baseline: "The simplest defensible predictor, such as the majority class, the historical mean or one obvious rule. Nothing counts as a result until it beats this.",
      "Evaluation protocol": "The full specification of how performance is measured: the split, the metric, the operating point and the data the number was computed on.",
      "Error analysis": "Systematic inspection of what the model gets wrong, grouped by segment, to convert an aggregate metric into an understanding of failure.",
      "Model card": "A short document recording intended use, training data, metrics by segment, known limitations and the conditions under which the model should be retired.",
      Reproducibility: "The property that another person, given the repository, can regenerate every number in the report from the raw data.",
      "Feature dictionary": "A table of every feature with its meaning, its source, its availability time and its permitted values. It is the artefact that prevents leakage.",
      "Decision rule": "How the prediction becomes an action, including the threshold, what happens on a positive, and what happens when the model abstains.",
    },
    body: {
      Beginner: `<p>This is the project where the separate skills become one piece of work. You take a dataset you have not seen before and produce a prediction you can defend, along with the evidence for it.</p>
<h2>Work in this order</h2>
<ol>
<li><strong>Write the question down.</strong> One sentence: what are you predicting, for whom, and at what moment. If you cannot write it, you are not ready to load anything.</li>
<li><strong>Look at the data.</strong> Row count, column types, missing values per column, and the distribution of the thing you are predicting. Write down what surprised you.</li>
<li><strong>Split before you clean.</strong> Hold out a test set now, and do not touch it again until the end.</li>
<li><strong>Build a baseline.</strong> Predict the most common class, or the average, or one obvious rule. Score it. This is the number every later model has to beat.</li>
<li><strong>Build one real model.</strong> A single sensible model with a pipeline that handles the cleaning. Score it the same way.</li>
<li><strong>Look at the mistakes.</strong> Take twenty wrong predictions and read them. Patterns will be visible.</li>
<li><strong>Write it up.</strong> What you predicted, how well, compared with what, and where it fails.</li>
</ol>
<h2>What is being assessed</h2>
<p>Not the accuracy number. A modest score that is honestly measured and clearly explained is worth far more than a high score nobody can reproduce.</p>
<ul>
<li>The test set was used once.</li>
<li>Every cleaning step was fitted on the training rows only.</li>
<li>A baseline exists and is beaten.</li>
<li>The write up says where the model fails, not only where it works.</li>
</ul>
<aside class="tip">If your first model scores far better than you expected, look for a column that would not exist at prediction time before you tell anyone the number.</aside>`,
      Intermediate: `<p>The deliverable is a repository and a short report. The repository must regenerate every number in the report from the raw data with one command, and the report must be readable by someone who will not open the code.</p>
<h2>Required contents</h2>
<ul>
<li><strong>Framing.</strong> The estimand in one paragraph: the target, the population, the prediction moment and the decision the prediction supports.</li>
<li><strong>Feature dictionary.</strong> Every feature with its source, its meaning and the time at which its value becomes known. Any feature whose value settles after the prediction moment is excluded, with the reason recorded.</li>
<li><strong>Evaluation protocol.</strong> The split strategy and why it fits the task, the metric and why it fits the costs, and the operating threshold if the task is classification.</li>
<li><strong>Baselines.</strong> At least two: a trivial one and a simple domain rule. Report them on the same protocol as the model.</li>
<li><strong>Model.</strong> A pipeline that contains every transformation, so that cross validation fits them per fold. Hyperparameters selected on validation data, never on the test set.</li>
<li><strong>Error analysis.</strong> Performance by segment, the worst performing segments named, and a sample of individual errors with a diagnosis.</li>
<li><strong>Limitations.</strong> What the model must not be used for, and what would make it stale.</li>
</ul>
<h2>The checkpoints that catch most problems</h2>
<pre>assert set(train.columns) == set(expected_columns)
assert train.index.is_unique
assert not set(train[key]) & set(test[key])        # no entity spans the split
print(train[target].mean(), test[target].mean())   # prevalence should be comparable</pre>
<p>Run these before modelling. Each has caught a project level error in someone's work before, and they take a minute to write.</p>
<h2>Judgement calls you must state</h2>
<p>Every project contains decisions with no single right answer: how to treat missing values, whether to cap extreme values, which rows to exclude, and where to set the threshold. Each is legitimate and each changes the result, so each belongs in the report with its justification. A decision made silently is indistinguishable from a decision made carelessly.</p>
<aside class="tip">Write the report's conclusion after the error analysis, not after the first score. The conclusion of a good project is frequently that the model is usable for one segment and not for another, and that is a more valuable finding than an average.</aside>`,
      Advanced: `<p>At this level the project should be judged as an engineering artefact as much as an analysis. The question is whether someone could operate it, monitor it and know when to switch it off.</p>
<h2>Additional requirements</h2>
<ul>
<li><strong>Nested evaluation.</strong> Hyperparameter selection inside an inner loop, performance estimated on an outer loop, with the difference between the selection score and the estimate reported. If the gap is large, say so.</li>
<li><strong>Uncertainty.</strong> An interval on the headline metric, obtained by bootstrapping the test set, so that a difference against the baseline can be judged against sampling noise.</li>
<li><strong>Calibration.</strong> For probability outputs, a reliability curve and a proper score. If the probabilities feed an expected value calculation, calibration matters more than ranking.</li>
<li><strong>Slice analysis.</strong> Metrics by segment, including segments that were not part of the modelling decisions, with attention to small segments where the aggregate hides poor performance.</li>
<li><strong>Cost analysis.</strong> Translate the confusion matrix into the units the organisation uses, and choose the operating point from that rather than from a standard metric.</li>
<li><strong>Retirement conditions.</strong> The input distribution checks and the performance floor that would trigger retraining or withdrawal.</li>
</ul>
<h2>Robustness work that distinguishes a strong submission</h2>
<p>Perturb the pipeline deliberately and report what happens. Retrain with a different random seed and record the spread. Drop the most important feature and see how much is lost, which reveals whether the model depends on one fragile source. Shift the evaluation window and check whether performance decays with time. Each of these is a few lines and each turns an assertion of quality into evidence for it.</p>
<h2>Reproducibility in practice</h2>
<p>Pinned dependency versions, a seed threaded through every stochastic step rather than set globally, raw data left untouched with all transformations expressed as code, and an entry point that runs the whole thing. If a number in the report cannot be traced to a line that produced it, it is not yet a result.</p>
<aside class="tip">Include one negative result. The feature that seemed obvious and added nothing, or the model class that lost to the baseline, is evidence that the search was genuine rather than a narrative constructed after the fact.</aside>`,
      Expert: `<p>Assess this the way a reviewer would assess a system going into production against a decision that matters. The technical work is necessary and it is not what determines whether the project is sound.</p>
<h2>The questions that decide it</h2>
<ul>
<li><strong>Is the estimand the quantity the decision needs?</strong> Predicting who will churn is not the same as predicting who can be retained, and a model optimised for the first can direct effort at customers who were leaving regardless.</li>
<li><strong>Does the evaluation resemble deployment?</strong> Prevalence, feature availability, latency and the population all shift between an offline table and a live system, and each shift moves a metric in a knowable direction that should be stated.</li>
<li><strong>What happens under feedback?</strong> A model that changes which cases are observed alters the distribution its successor will be trained on. Fraud systems, credit decisions and recommendation systems all create their own training data, and a plan for collecting unbiased labels under an active model is part of the design.</li>
<li><strong>Who is harmed by a false positive?</strong> Aggregate metrics distribute errors unevenly across groups, and a system that meets its overall target while failing a subgroup is a defect, not a tradeoff to be discovered later.</li>
</ul>
<h2>Where projects at this level usually fail</h2>
<p>Not in the modelling. They fail because the target was constructed from a field that is itself the output of a human process the model will now replace, so the labels encode the old policy rather than the outcome. They fail because the training period contained an anomaly that the model has learned as structure. They fail because a feature was available historically and is not available at serving time, which is discovered during integration. And they fail because nobody defined what would count as the model working, so it can never be judged to have stopped working.</p>
<h2>The written artefact</h2>
<p>A model card of one page: intended use and out of scope uses, training data with its period and provenance, the evaluation protocol, headline and segment metrics with intervals, known limitations, and the retirement conditions. It is the document a colleague reads in two years when the model is still running and the author has left, and writing it exposes gaps in the work while they can still be fixed.</p>
<aside class="tip">The strongest possible conclusion is a specific one. "This predicts renewal for accounts over twelve months old with a lift of 18 per cent over the tenure rule, and it should not be used for accounts under six months, where it is no better than the base rate" is worth more than any single accuracy figure.</aside>`,
    },
  },
};

export default CURRICULUM;
