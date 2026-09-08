/**
 * Coding problems, with test cases that actually run.
 *
 * The demo executes the learner's JavaScript for real, in their own browser, and
 * grades it against these cases. That was worth the effort: a coding workspace
 * where "Run" returns a canned pass is the single most obvious fake in a demo of
 * a learning platform, and anyone technical will try to break it within seconds.
 *
 * Each problem names the function it expects and lists concrete argument/result
 * pairs, so grading is a genuine comparison rather than a heuristic on the
 * source text.
 */

export interface CodingTest {
  args: unknown[];
  expected: unknown;
  /** Shown in the results table. */
  label: string;
  /** Visible before submitting (sample cases) or held back (hidden cases). */
  hidden?: boolean;
}

export interface DemoCodingProblem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skills: string[];
  topic: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  /** The function the learner must define. */
  fnName: string;
  templates: Record<string, string>;
  tests: CodingTest[];
  /** Progressive hints, shallowest first. */
  hints: { title: string; body: string; revealsCode: boolean }[];
}

const jsTemplate = (fn: string, params: string) =>
  `/**\n * Complete this function.\n */\nfunction ${fn}(${params}) {\n  // your code here\n}\n`;

const pyTemplate = (fn: string, params: string) =>
  `def ${fn}(${params}):\n    # your code here\n    pass\n`;

export const CODING_PROBLEMS: DemoCodingProblem[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    skills: ["Algorithms", "Hash maps"],
    topic: "Arrays and hashing",
    statement:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two " +
      "numbers that add up to `target`.\n\nExactly one valid answer exists, and you may not use " +
      "the same element twice. Return the indices in ascending order.",
    inputFormat: "nums: number[], target: number",
    outputFormat: "number[] of length 2",
    sampleInput: "nums = [2, 7, 11, 15], target = 9",
    sampleOutput: "[0, 1]",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nExactly one solution exists.",
    fnName: "twoSum",
    templates: {
      javascript: jsTemplate("twoSum", "nums, target"),
      python: pyTemplate("two_sum", "nums, target"),
    },
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], label: "basic" },
      { args: [[3, 2, 4], 6], expected: [1, 2], label: "not the first element" },
      { args: [[3, 3], 6], expected: [0, 1], label: "duplicate values", hidden: true },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], label: "negatives", hidden: true },
    ],
    hints: [
      {
        title: "Start with the brute force",
        body: "Two nested loops over every pair works and is O(n squared). Get that correct first, then ask what work it repeats.",
        revealsCode: false,
      },
      {
        title: "What are you searching for?",
        body: "For each number x, you are looking for target - x among the numbers you have already seen. A lookup, not a scan.",
        revealsCode: false,
      },
      {
        title: "One pass with a map",
        body: "Walk the array once, keeping a map from value to index. For each x, check whether target - x is already in the map before inserting x.",
        revealsCode: true,
      },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    skills: ["Algorithms", "Sliding window"],
    topic: "Sliding window",
    statement:
      "Given a string `s`, return the length of the longest substring that contains no repeated " +
      "characters.\n\nA substring is a contiguous run of characters.",
    inputFormat: "s: string",
    outputFormat: "number",
    sampleInput: 's = "abcabcbb"',
    sampleOutput: "3",
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    fnName: "lengthOfLongestSubstring",
    templates: {
      javascript: jsTemplate("lengthOfLongestSubstring", "s"),
      python: pyTemplate("length_of_longest_substring", "s"),
    },
    tests: [
      { args: ["abcabcbb"], expected: 3, label: "repeats after three" },
      { args: ["bbbbb"], expected: 1, label: "all identical" },
      { args: [""], expected: 0, label: "empty string", hidden: true },
      { args: ["pwwkew"], expected: 3, label: "window must not reset fully", hidden: true },
      { args: ["dvdf"], expected: 3, label: "left pointer must not move backwards", hidden: true },
    ],
    hints: [
      {
        title: "Name the invariant",
        body: "Write down what must always be true of your window. Here: the window never contains a duplicate. Every line either preserves that or restores it.",
        revealsCode: false,
      },
      {
        title: "Remember where you saw it",
        body: "A set tells you a character is present but not where. A map from character to its last index lets you jump the left edge instead of stepping it.",
        revealsCode: false,
      },
      {
        title: "Never move left backwards",
        body: 'On "dvdf", the earlier index of "d" is behind the current left edge. Guard with left = max(left, seen[ch] + 1) or the window grows invalid.',
        revealsCode: true,
      },
    ],
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    skills: ["Hash maps", "Data Structures"],
    topic: "Hashing",
    statement:
      "Given an array of strings, group the anagrams together. Return the groups sorted by their " +
      "first element, with each group's members in their original relative order.",
    inputFormat: "words: string[]",
    outputFormat: "string[][]",
    sampleInput: 'words = ["eat", "tea", "tan", "ate", "nat", "bat"]',
    sampleOutput: '[["bat"], ["eat","tea","ate"], ["tan","nat"]]',
    constraints: "1 <= words.length <= 10^4\nwords[i] consists of lowercase English letters.",
    fnName: "groupAnagrams",
    templates: {
      javascript: jsTemplate("groupAnagrams", "words"),
      python: pyTemplate("group_anagrams", "words"),
    },
    tests: [
      {
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["bat"], ["eat", "tea", "ate"], ["tan", "nat"]],
        label: "mixed groups",
      },
      { args: [[""]], expected: [[""]], label: "empty string", hidden: true },
      { args: [["a"]], expected: [["a"]], label: "single letter", hidden: true },
    ],
    hints: [
      {
        title: "What makes two words anagrams?",
        body: "They share a canonical form. Find a key that is identical for anagrams and different for everything else.",
        revealsCode: false,
      },
      {
        title: "Sorting is one canonical form",
        body: "The sorted letters of a word are the same for all its anagrams. Group by that string.",
        revealsCode: false,
      },
      {
        title: "Build the map, then order it",
        body: "Accumulate into a map from sorted-letters to the list of words, then sort the resulting groups by their first element.",
        revealsCode: true,
      },
    ],
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    skills: ["Data Structures", "Stacks"],
    topic: "Stacks",
    statement:
      "Given a string containing only the characters ()[]{}, decide whether the brackets are " +
      "correctly balanced and correctly nested.",
    inputFormat: "s: string",
    outputFormat: "boolean",
    sampleInput: 's = "()[]{}"',
    sampleOutput: "true",
    constraints: "1 <= s.length <= 10^4",
    fnName: "isValid",
    templates: {
      javascript: jsTemplate("isValid", "s"),
      python: pyTemplate("is_valid", "s"),
    },
    tests: [
      { args: ["()[]{}"], expected: true, label: "all pairs" },
      { args: ["(]"], expected: false, label: "mismatched" },
      { args: ["([)]"], expected: false, label: "wrong nesting", hidden: true },
      { args: ["{[]}"], expected: true, label: "nested", hidden: true },
      { args: ["("], expected: false, label: "unclosed", hidden: true },
    ],
    hints: [
      {
        title: "Which bracket must close next?",
        body: "Always the most recently opened one. That ordering is exactly what a stack gives you.",
        revealsCode: false,
      },
      {
        title: "Two ways to fail",
        body: "A closer that does not match the top of the stack, and a stack that is not empty at the end. Check both.",
        revealsCode: false,
      },
      {
        title: "Push openers, pop closers",
        body: "Push every opening bracket. On a closing bracket, pop and compare. Return whether the stack is empty at the end.",
        revealsCode: true,
      },
    ],
  },
  {
    title: "Merge Overlapping Intervals",
    difficulty: "Hard",
    skills: ["Algorithms", "Sorting"],
    topic: "Intervals",
    statement:
      "Given a list of intervals `[start, end]`, merge every set of overlapping intervals and " +
      "return the result sorted by start.\n\nIntervals that merely touch (one ends where the next " +
      "begins) count as overlapping.",
    inputFormat: "intervals: number[][]",
    outputFormat: "number[][]",
    sampleInput: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
    sampleOutput: "[[1,6],[8,10],[15,18]]",
    constraints: "1 <= intervals.length <= 10^4\nstart <= end",
    fnName: "mergeIntervals",
    templates: {
      javascript: jsTemplate("mergeIntervals", "intervals"),
      python: pyTemplate("merge_intervals", "intervals"),
    },
    tests: [
      {
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
        label: "classic",
      },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], label: "touching counts" },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]], label: "unsorted input", hidden: true },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]], label: "fully contained", hidden: true },
    ],
    hints: [
      {
        title: "Order first",
        body: "Overlap is only easy to reason about once the intervals are sorted by start. Sort before merging.",
        revealsCode: false,
      },
      {
        title: "Compare against the last kept interval",
        body: "Walk the sorted list holding the interval you are currently building. Either the next one extends it or it starts a new one.",
        revealsCode: false,
      },
      {
        title: "Extend with a max",
        body: "If next.start <= current.end they overlap, and the merged end is max(current.end, next.end) - not simply next.end, because one interval can contain another.",
        revealsCode: true,
      },
    ],
  },
];

/** Deterministic problem for a generated problem id. */
export function problemAt(index: number): DemoCodingProblem {
  return CODING_PROBLEMS[index % CODING_PROBLEMS.length];
}
