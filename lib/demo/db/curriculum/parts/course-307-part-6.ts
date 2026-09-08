/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 6.
 *
 * Topics 30714, 30715, 30716 and 30718: the last reasoning topic of the mains
 * syllabus, and three of the four English topics. Part 5 owns 30717, so cloze,
 * fillers and para jumbles are deliberately not taught again here.
 *
 * Every machine in the input output topic has been stepped out by hand and the
 * table printed in the article is the table the rule actually produces. Exam
 * mechanics are stated as the paper sets them: prelims is sectionally timed and
 * qualifying only, a wrong answer costs a quarter of a mark, and no vacancy
 * count, fee, cut-off or examination date appears anywhere in this file.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30714: {
    topicId: 30714,
    title: "Input output and logical reasoning for mains",
    summary:
      "Input output sets and short logical reasoning questions are the two reasoning types that belong to mains rather than to prelims, and both are decided in the first ninety seconds by whether you have correctly named what you are looking at. You learn to read a machine's rule off its first step, to write the remaining steps before answering anything, and to separate an assumption from an inference from a conclusion.",
    concepts: [
      "Input output machine logic",
      "Shifting versus arrangement patterns",
      "Step counting and reverse steps",
      "Assumption and inference",
      "Strengthening and weakening an argument",
      "Course of action and paradox",
    ],
    glossary: {
      "Input output":
        "A reasoning set in which a line of words and numbers is passed through an unstated rule, one step at a time, and you are shown the input and a step or two before being asked about steps you were never shown.",
      "Arrangement machine":
        "A machine that acts on the value of an element: it sorts numbers by size or words by alphabetical order, moving one or two elements to a growing block at an end in each step.",
      "Shifting machine":
        "A machine that acts on the position of an element rather than its value: a fixed count of elements is taken from one end and placed at the other, or the whole line rotates by a fixed number of places.",
      Assumption:
        "Something not written in the statement but which the person making the statement must be taking for granted, otherwise the statement makes no sense. It sits underneath the statement rather than after it.",
      "Inference":
        "Something not written in the statement but which must be true if the statement is true. It sits after the statement, and it is judged by necessity, not by plausibility.",
      "Course of action":
        "A practicable step proposed in answer to a stated problem. It is judged on whether it addresses the stated problem and can actually be carried out, not on whether it sounds decisive.",
    },
    body: {
      Beginner: `<p>Input output is a reasoning question type that belongs to the mains paper rather than to prelims. You are shown a line of words and numbers, called the <strong>input</strong>, and then the first line or two that a machine produced from it, called <strong>steps</strong>. Nobody tells you the rule. Your job is to work out what the machine did, and then answer questions about a step you were never shown.</p>
<h2>What a machine is here</h2>
<p>A machine in this question type is not a computer. It is one fixed instruction, applied once per step, in exactly the same way every time. Two families cover most of what is set.</p>
<ul>
<li>An <strong>arrangement</strong> machine sorts. It puts numbers in order of size, or words in alphabetical order, moving one element at a time to a block that grows at one end of the line.</li>
<li>A <strong>shifting</strong> machine moves. It picks elements by where they stand, not by what they are worth, and slides them somewhere else.</li>
</ul>
<h2>How you find the rule</h2>
<p>Write the input and step 1 one under the other and ask one question: which elements are standing in a new place? Usually only one or two of them have moved. Then ask why those and not the others. If the element that moved happens to be the smallest number or the first word in the dictionary, the rule is about value. If the element that moved was simply the one standing at an end, the rule is about position.</p>
<h2>A small machine, worked</h2>
<p>Input: 34 pen 19 cup 52 bag</p>
<p>Step 1: 19 cup 52 bag 34 pen</p>
<p>Nothing has been sorted here, because 19, 52, 34 is not an order of any kind. But the two elements that stood first in the input, 34 and pen, are now standing last, still in that same sequence, and everything else has slid two places to the left. So the machine lifts the leftmost two elements and puts them at the right end. Apply the same instruction to step 1 and step 2 has to be 52 bag 34 pen 19 cup.</p>
<h2>The other half of the topic</h2>
<p>Mains also sets short logical reasoning questions. You are given a statement of two or three lines and asked what it takes for granted, what must follow from it, or what would damage it. These are not puzzles and there is nothing to draw. They are careful reading, and the one habit that carries you through them is to answer only from the statement printed in front of you, never from what you happen to know about banking.</p>
<h2>What a wrong answer costs</h2>
<p>A wrong answer takes away a quarter of a mark. An input output set is normally five questions built on one machine, so cracking the rule wins you five marks together, and failing to crack it should cost you nothing at all, because you leave all five blank. This is one of the few places in the paper where the sensible attempt is either the whole set or none of it.</p>`,
      Intermediate: `<p>An input output set gives you one machine and five questions. The set stands or falls entirely on naming the rule from step 1, so the method below spends its effort there and treats the questions afterwards as bookkeeping.</p>
<h2>Reading the rule off step 1</h2>
<ol>
<li>Number the positions of the input from the left, 1 to 8, on your rough sheet.</li>
<li>Write step 1 underneath, aligned, and mark every element standing in a new position.</li>
<li>Count the marked elements. One means a single operation machine; two usually means the machine handles one word and one number in the same step.</li>
<li>Ask what is special about each moved element: smallest number, largest number, alphabetically first word, or simply the element that stood at an end.</li>
<li>Ask where it went: to an end, to the inside edge of a block that is already sorted, or a fixed number of places along the line.</li>
</ol>
<h2>A full machine, stepped out</h2>
<p>Input: gold 42 river 17 stone 63 plate 28</p>
<p>Step 1: 17 42 river stone 63 plate 28 gold</p>
<p>Two elements have moved. The number 17 has gone to the left end and the word gold has gone to the right end. Now ask why those two: 17 is the smallest number in the line and gold is the alphabetically first word. So this is an arrangement machine that handles one number and one word per step, numbers building up at the left in increasing order and words building up at the right in alphabetical order read inward from the right end. That is enough to write out the entire set before you look at a single question.</p>
<table>
<thead><tr><th>Step</th><th>Line</th></tr></thead>
<tbody>
<tr><td>Input</td><td>gold 42 river 17 stone 63 plate 28</td></tr>
<tr><td>1</td><td>17 42 river stone 63 plate 28 gold</td></tr>
<tr><td>2</td><td>17 28 42 river stone 63 plate gold</td></tr>
<tr><td>3</td><td>17 28 42 stone 63 river plate gold</td></tr>
<tr><td>4</td><td>17 28 42 63 stone river plate gold</td></tr>
</tbody>
</table>
<p>Four numbers and four words, one of each consumed per step, so the arrangement finishes in four steps and there is no step 5. With that table on your sheet, a question asking which element stands third from the left in step 2 is read off rather than solved, and the answer is 42.</p>
<h2>The families worth being able to name</h2>
<ul>
<li><strong>Arrangement</strong>: sorting by value, one or two elements a step. This is the commonest by a wide margin.</li>
<li><strong>Shifting</strong>: elements move by position. Look for a fixed jump, such as the line rotating two places to the right with the elements that fall off the end wrapping round.</li>
<li><strong>Arithmetic</strong>: the numbers themselves change. Digits are summed, digits are reversed, a fixed amount is added to alternate terms, or a number is replaced by the product of its digits.</li>
<li><strong>Mixed</strong>: words are arranged in one direction while the numbers are operated on arithmetically in the other. This is set in mains precisely because two rules have to be held at once.</li>
</ul>
<h2>Three logical reasoning types that look alike</h2>
<p>Take one statement. A district cooperative bank has advised its branches to move to a common core banking platform before the end of the financial year.</p>
<ul>
<li>An <strong>assumption</strong> lies underneath the advisory: the branches are capable of migrating within that period. If they were not, issuing the advisory would make no sense, so the bank must be taking it for granted.</li>
<li>An <strong>inference</strong> follows from the advisory: the branches are not at present on a common platform. Nothing says so, but the advisory could not be issued if they already were.</li>
<li>A <strong>course of action</strong> answers a problem: if the statement had reported that migration was slipping, a practicable step would be to fix an interim deadline for each branch and report progress monthly.</li>
</ul>
<p>The separation matters because setters build the wrong option out of the neighbouring category. An option that would be a fine inference is offered as the assumption, and the candidate who has not fixed the distinction picks it.</p>
<h2>Strengthening and weakening</h2>
<p>When an argument claims that one thing caused another, you weaken it by supplying a different sufficient cause and you strengthen it by ruling one out. A claim that a new mobile application emptied the counters falls apart the moment you learn that half the counters were shut for renovation.</p>`,
      Advanced: `<p>You have done these before. What decides a second attempt is the decision to enter a set at all, and the discipline of naming a critical reasoning type before reading its options.</p>
<h2>The clock you are working under</h2>
<p>In officer mains, reasoning and computer aptitude is one section of forty five questions on its own sectional clock of about an hour, built out of long puzzles, an arrangement set, an input output set and a few short logical reasoning questions. Spread evenly that is about eighty seconds a question, which you must not do. Give an input output set a hard budget: ninety seconds to name the rule, three minutes to write the steps, ninety seconds to answer. If the rule has not appeared inside that first ninety seconds, close the set.</p>
<h2>Diagnosing the family from step 1</h2>
<table>
<thead><tr><th>What you see between input and step 1</th><th>Family</th><th>Next thing to test</th></tr></thead>
<tbody>
<tr><td>One element at an end, the smallest or largest value</td><td>Arrangement, single operation</td><td>Which end grows, and does the block build outward or inward</td></tr>
<tr><td>Two elements at opposite ends, one number and one word</td><td>Arrangement, double operation</td><td>Direction of each: increasing or decreasing, forward or reverse alphabetical</td></tr>
<tr><td>Everything has moved, relative order preserved</td><td>Shifting or rotation</td><td>Count the places, then check whether the count stays constant</td></tr>
<tr><td>A number has become a different number</td><td>Arithmetic</td><td>Digit sum, digit reversal, or the gap between consecutive terms</td></tr>
</tbody>
</table>
<h2>The traps that cost marks here</h2>
<ul>
<li><strong>Counting the input as step 1.</strong> The input is not a step. A machine that finishes in four steps has no step 5, and the option saying the arrangement is already complete is the answer.</li>
<li><strong>Ends read from the wrong side.</strong> Half the questions ask for a position from the right, so write position numbers above your table once, from both ends.</li>
<li><strong>Words sharing a first letter.</strong> Plate and plane appear in one input for exactly this reason. Order runs to the second letter, then the third, and a hurried sort by first letter loses the whole set.</li>
<li><strong>Reverse questions on an irreversible machine.</strong> A shift can be run backwards because nothing is destroyed. A sort cannot, since many inputs give the same sorted line, so a set asking you to rebuild the input is nearly always built on a shift.</li>
</ul>
<h2>Critical reasoning: name the type, then read the options</h2>
<table>
<thead><tr><th>Question type</th><th>What the right option does</th><th>The wrong option built to attract you</th></tr></thead>
<tbody>
<tr><td>Assumption</td><td>The minimum the speaker must take for granted</td><td>A sweeping version using all, only, none or every</td></tr>
<tr><td>Inference</td><td>What must be true given the statement</td><td>Something likely but not forced, or a restatement</td></tr>
<tr><td>Strengthen</td><td>Closes off a rival explanation</td><td>A fact merely consistent with the argument</td></tr>
<tr><td>Weaken</td><td>Supplies a rival cause or attacks the sample</td><td>An option attacking the speaker, not the argument</td></tr>
<tr><td>Course of action</td><td>Addresses the problem and can be carried out</td><td>The drastic option: close it, ban it, dismiss them</td></tr>
<tr><td>Paradox</td><td>Shows how both surprising facts can hold</td><td>An option denying one fact instead of reconciling</td></tr>
</tbody>
</table>
<h2>Where candidates actually lose these marks</h2>
<p>Not on difficulty, but by importing knowledge. A candidate who follows banking news answers from the news rather than from the three lines given, and the option that is true in the world yet unsupported by the passage is placed there for exactly that reader. The second loss is direction: the question asks what weakens the argument and an eye trained on strengthening picks the supporting option. Circle the words weaken, except and not before reading any option.</p>
<h2>The attempt arithmetic</h2>
<p>A set of five carries five marks. Crack it and answer all five: five marks. Half crack it, answer three and get two right: two minus a quarter, that is 1.75. Guess all five and get one right: one minus a full mark, that is zero. The value sits in the rule, not in the questions, so partial work here is worth almost nothing.</p>`,
      Expert: `<p>Last month sheet. Everything here is meant to be retrievable in a second, not read for the first time.</p>
<h2>Step 1 diagnostic, in the order you run it</h2>
<ol>
<li>How many elements moved? One, two, or all.</li>
<li>If one or two: what makes them special, value or position?</li>
<li>Which end grows, and does the block build outward from that end or inward towards the centre?</li>
<li>Are numbers and words handled by the same rule or by two rules running in parallel?</li>
<li>Write all steps before answering. Never answer a question by simulating one step at a time.</li>
</ol>
<h2>Two line rules</h2>
<ul>
<li>The input is not a step. Count steps from the first produced line.</li>
<li>An arrangement machine ends when the last element is placed. There is no step after that.</li>
<li>Steps needed equals the count of elements the machine consumes per step, divided into the total it must place.</li>
<li>A reverse question implies a reversible machine, so suspect a shift before you suspect a sort.</li>
<li>Sort words to the second and third letter, always.</li>
<li>In a mixed machine, split words from numbers on the rough sheet before diagnosing anything.</li>
</ul>
<h2>Critical reasoning, one line each</h2>
<table>
<thead><tr><th>Asked for</th><th>Test to apply</th></tr></thead>
<tbody>
<tr><td>Assumption</td><td>Negate the option. If the argument collapses, it was the assumption.</td></tr>
<tr><td>Inference</td><td>Could the statement be true and this option false? If yes, it is not an inference.</td></tr>
<tr><td>Conclusion</td><td>Is it the point the statement was driving at, or merely a detail inside it?</td></tr>
<tr><td>Strengthen</td><td>Does it remove an alternative explanation, or only agree pleasantly?</td></tr>
<tr><td>Weaken</td><td>Does it give the effect another cause, or attack the sample the claim rests on?</td></tr>
<tr><td>Course of action</td><td>Practicable, proportionate, and aimed at the stated problem, all three.</td></tr>
<tr><td>Paradox</td><td>Keep both facts true and explain the gap between them.</td></tr>
</tbody>
</table>
<h2>Words that mark a wrong option</h2>
<p>All, none, only, always, never, must invariably, entirely. Real arguments are hedged and examiners write the over-stated option on purpose. An option that is milder than the passage is far more often right than one that is stronger than it.</p>
<h2>Final week drill</h2>
<ol>
<li>One input output set a day, timed with a ninety second abandon rule enforced by a clock rather than by feel.</li>
<li>Keep a page listing each machine you meet by family. After twenty sets you will be naming the family from step 1 in under thirty seconds.</li>
<li>Ten critical reasoning questions a day, marked in two columns: wrong because you imported outside knowledge, and wrong because you missed the direction word.</li>
<li>Revise only your own error page on the last two days. A fresh set on the last day teaches nothing and unsettles a great deal.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A machine moves, in each step, the smallest number not yet placed to the growing block at the left end and the alphabetically first word not yet placed to the growing block at the right end. Input: gold 42 river 17 stone 63 plate 28. Step 1: 17 42 river stone 63 plate 28 gold. What is Step 2?",
        options: [
          "17 28 42 river stone 63 plate gold",
          "17 28 river stone 63 plate gold 42",
          "17 42 28 river stone 63 plate gold",
          "17 28 42 river stone 63 gold plate",
        ],
        answer: 0,
        explanation:
          "Step 2 places the next smallest number, 28, immediately to the right of the 17 already at the left, and the next alphabetically first word, plate, immediately to the left of gold at the right, leaving 42 river stone 63 undisturbed in the middle. The option ending gold plate is the built trap: the word block grows inward, so gold, having been placed first, stays at the extreme right and every later word sits inside it.",
        difficulty: "Medium",
        skill: "Input output machine logic",
      },
      {
        n: 2,
        question:
          "For the same machine, Step 2 reads 17 28 42 river stone 63 plate gold. Which element stands third from the left?",
        options: ["42", "river", "28", "stone"],
        answer: 0,
        explanation:
          "Counting from the left the elements are 17, 28, 42, so the third is 42. The tempting answer 28 comes from starting the count at the second element, which is the single commonest slip in this question type and the reason you write position numbers above your step table before answering anything.",
        difficulty: "Easy",
        skill: "Step counting and reverse steps",
      },
      {
        n: 3,
        question:
          "Input: 34 pen 19 cup 52 bag. Step 1: 19 cup 52 bag 34 pen. What rule is the machine following?",
        options: [
          "The numbers are being arranged in increasing order from the left",
          "The leftmost two elements are moved as a block to the right end, values ignored",
          "The smallest number is moved to the left end and the rest shift one place right",
          "Each word swaps places with the number standing immediately before it",
        ],
        answer: 1,
        explanation:
          "The elements 34 and pen stood first and second in the input and now stand last and second last in that same order, while everything else has slid two places left, which is movement by position and not by value. The increasing order option dies immediately because 19, 52, 34 is not an increasing sequence, and the smallest number rule would have produced 19 34 pen cup 52 bag instead.",
        difficulty: "Medium",
        skill: "Shifting versus arrangement patterns",
      },
      {
        n: 4,
        question:
          "A set gives you the last step of a machine and asks you to reconstruct the input. On which kind of machine is that question fairly set?",
        options: [
          "An arrangement machine that sorts the numbers into increasing order",
          "A shifting machine that moves a fixed count of elements from one end to the other each step",
          "An arithmetic machine that replaces every number by the sum of its digits",
          "Any machine at all, since every step can be undone",
        ],
        answer: 1,
        explanation:
          "A shift destroys no information, because the elements keep their identity and their relative order inside the block, so the movement can simply be run backwards. Sorting and digit summing both throw information away, since many different inputs collapse to the same sorted line or the same digit sum, which also makes the last option wrong as a general claim.",
        difficulty: "Hard",
        skill: "Step counting and reverse steps",
      },
      {
        n: 5,
        question:
          "Statement: a bank has decided to keep extended evening counters open at its branches in the district headquarters. Which of the following is an assumption implicit in the decision?",
        options: [
          "Some customers wish to transact at hours the present counter timings do not cover",
          "Every customer of the bank lives in the district headquarters town",
          "The deposits of these branches will double within the coming year",
          "No customer of a rural branch has any business after the present closing time",
        ],
        answer: 0,
        explanation:
          "An assumption is the minimum the decision maker must be taking for granted, and extending counter hours makes no sense unless somebody wants to transact in those hours. The rural branch option attracts because it also concerns timings, but it is a sweeping negative that the decision does not need at all, and options built with every, no or none are almost always stronger than the statement can support.",
        difficulty: "Medium",
        skill: "Assumption and inference",
      },
      {
        n: 6,
        question:
          "A branch manager argues that the new mobile application caused counter footfall to fall, since footfall dropped in the six months after the application was launched. Which of the following, if true, most weakens the argument?",
        options: [
          "Most of the branch's customers downloaded the application during those six months",
          "Two of the branch's four counters were closed for renovation throughout those six months",
          "The branch's total customer base grew slightly over the same period",
          "The application also lets a customer book an appointment at the counter",
        ],
        answer: 1,
        explanation:
          "Closing half the counters supplies a rival cause that explains the fall without the application doing anything, and supplying a rival cause is exactly what weakening a causal claim means. The appointment feature option looks like a counterpoint but is at best neutral, since a booking facility does not explain why fewer people walked in, while the first and third options both make the manager's case stronger rather than weaker.",
        difficulty: "Medium",
        skill: "Strengthening and weakening an argument",
      },
      {
        n: 7,
        question:
          "Statement: a large share of the accounts opened at a branch under a financial inclusion drive has recorded no customer transaction for over a year. Which course of action follows?",
        options: [
          "The branch should close every such account without further notice",
          "The branch should stop opening accounts under the drive altogether",
          "The branch should contact the holders, find out what is preventing use, and route a benefit or a small recurring credit through the account",
          "The branch should transfer the officers who opened those accounts",
        ],
        answer: 2,
        explanation:
          "A course of action must address the stated problem and be practicable, and finding out why an account is unused and then giving it a reason to be used does both. Closing the accounts and halting the drive are the drastic options that setters plant in this question type: they end the statistic rather than the problem, and they abandon the objective the drive exists to serve.",
        difficulty: "Medium",
        skill: "Course of action and paradox",
      },
    ],
  },
};

export default PART;
