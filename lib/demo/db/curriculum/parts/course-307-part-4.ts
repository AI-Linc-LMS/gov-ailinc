/**
 * Course 307: IBPS PO & Clerk: Prelims and Mains, part 4.
 *
 * Topics 30710 to 30713: the last topic of the data interpretation module,
 * then the first three topics of the reasoning module.
 *
 * Written for a candidate who can already read a table and a bar graph and now
 * meets the two mains-only forms of data work, sufficiency and mixed sets, and
 * who then has to build the puzzle and arrangement skill that carries most of
 * the reasoning marks in both stages.
 *
 * Examination mechanics are stated as they are set: prelims is sectionally
 * timed at twenty minutes a section, a wrong answer costs a quarter of the
 * marks that question carries, and the prelims score is not carried into the
 * final merit list. No vacancy count, fee, cut-off mark or examination date is
 * stated as current fact. Every worked puzzle in this file has been solved to a
 * unique grid and every arithmetic result has been checked to produce the
 * number it claims.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30710: {
    topicId: 30710,
    title: "Data sufficiency and mixed sets for mains",
    summary:
      "A data sufficiency question asks something no other item on the paper asks: not what the value is, but whether the statements you have been given pin it to exactly one value. Mixed sets fold three different arithmetic chapters into one body of data, and both forms pay the candidate who decides fast and refuses to calculate what the marks do not pay for.",
    concepts: [
      "Data sufficiency question form",
      "Sufficiency without solving",
      "Two statement sufficiency",
      "Three statement sufficiency",
      "Uniqueness of the answer",
      "Mixed data interpretation sets",
    ],
    glossary: {
      "Data sufficiency":
        "A question form in which you are given a question and two or three separate statements, and are marked only on the decision of whether those statements settle the answer. The value itself earns nothing.",
      "Unique determination":
        "The test a set of statements must pass to count as sufficient. The statements must narrow the quantity to one value and one only, so a step that leaves two admissible values, such as the two roots of a quadratic, has not settled anything.",
      "Redundant statement":
        "A statement that carries information you already hold from another statement, usually dressed in different words. It changes nothing about sufficiency, and its purpose in the paper is to make you re-derive what you already had.",
      "Option key":
        "The fixed list of responses attached to every sufficiency question in a set: first alone, second alone, either alone, both together, or neither. The wording of that list changes between papers and has to be read once, carefully, before the first question.",
      "Mixed set":
        "A data interpretation set whose questions each draw on a different arithmetic chapter, so one table feeds a ratio question, an average, a percentage change and sometimes a probability, without ever restating the data.",
      "Consistency of statements":
        "The property that all statements in a well set question describe one real situation. Two statements can never lead to different answers, so if yours do, the error is in your working, not in the paper.",
    },
    body: {
      Beginner: `<p>The main examination sets a section called Data Analysis and Interpretation. Most of it is the tables and graphs you have already worked with. Two question types in it are new, and this lesson is about both.</p>
<h2>What a data sufficiency question is</h2>
<p>An ordinary question hands you facts and asks for a number. A <strong>data sufficiency</strong> question hands you a question and then two or three separate statements, and asks something quite different: is what you have been given enough to fix the answer at one value?</p>
<p>You are not asked for the value. You are asked whether the value can be found at all. If you go on and find it, you earn nothing extra, and you have spent a minute the section will not give back.</p>
<h2>A worked example</h2>
<p>Question: what is the speed of a boat in still water?</p>
<ul>
<li>Statement I: the boat covers 60 km downstream in 3 hours.</li>
<li>Statement II: the boat covers 36 km upstream in 3 hours.</li>
</ul>
<p>Still water speed means the speed of the boat with no current either helping it or holding it back. Going downstream the current pushes, so the boat moves at its own speed plus the speed of the stream. Going upstream the current resists, so it moves at its own speed minus the speed of the stream.</p>
<p>Statement I gives 60 divided by 3, which is 20 km an hour. That is boat plus stream, not boat. One equation with two unknowns in it, so it cannot settle the boat on its own.</p>
<p>Statement II gives 36 divided by 3, which is 12 km an hour. That is boat minus stream. Again one equation, two unknowns.</p>
<p>Put the two together. The boat's own speed is halfway between them, that is 20 plus 12, divided by 2, which is 16 km an hour, and the stream is 4 km an hour. So the correct response is that both statements together are needed and neither one alone will do.</p>
<h2>The habit this builds</h2>
<p>Count the unknowns, then count the statements that give you genuinely different equations about them. When the equations are as many as the unknowns and none of them merely repeats another, the answer is fixed and you can stop there. That one habit settles most sufficiency questions in under thirty seconds.</p>
<h2>Mixed sets, in one line</h2>
<p>A mixed set is one table or one short passage of data, with five questions attached that come from five different chapters. The data is read once. The chapters change under it.</p>
<h2>The penalty is larger here</h2>
<p>A wrong answer in this section costs about 0.43 marks, because the penalty is a quarter of the marks a question carries and these questions carry about 1.71 marks each. A blank costs nothing. So decide, or leave it alone.</p>`,
      Intermediate: `<p>Sufficiency and mixed sets are the two forms that separate the mains data section from the prelims quantitative section. Neither is harder arithmetic. Both are a different job: sufficiency asks you to judge information rather than process it, and a mixed set asks you to keep one body of data in your head while the chapter under it keeps changing.</p>
<h2>Read the option key before the first question</h2>
<p>Every sufficiency set opens with a key, and the key is not identical across papers. The common one runs: the data in statement I alone is sufficient; the data in statement II alone is sufficient; the data in either alone is sufficient; the data in both together is not sufficient; the data in both together is sufficient. Read it once, decide which position each option occupies, and then never read it again. Candidates lose marks in this format not by misjudging sufficiency but by mapping a correct judgement onto the wrong option letter.</p>
<h2>The two statement method</h2>
<ol>
<li>Read the question alone and write down what is being asked and what the unknowns are.</li>
<li>Cover statement II. Judge statement I on its own.</li>
<li>Cover statement I. Judge statement II on its own, deliberately forgetting anything you deduced a moment ago.</li>
<li>Only if both fail alone, combine them.</li>
</ol>
<p>Step three is where marks go. Having worked out the downstream speed from statement I, the mind carries it into statement II and declares statement II sufficient as well. Physically covering the other statement with your hand on the rough sheet is a crude fix and it works.</p>
<h2>The three statement form</h2>
<p>Mains often sets three statements and asks which of them are sufficient. Take an example. The question asks for the son's present age.</p>
<ul>
<li>I. The father is 30 years older than the son.</li>
<li>II. Five years ago the father's age was four times the son's age.</li>
<li>III. The sum of their present ages is 60 years.</li>
</ul>
<p>Test the pairs. From I and II: let the son be s, so the father is s plus 30, and five years ago s plus 25 equals 4 times the quantity s minus 5, giving s plus 25 equals 4s minus 20, so 3s equals 45 and s is 15. From I and III: s plus s plus 30 equals 60, so 2s is 30 and s is 15. From II and III: the father is 60 minus s, and 55 minus s equals 4s minus 20, so 5s is 75 and s is 15.</p>
<p>Every pair works and no single statement works alone, so the answer is that any two of the three are sufficient. Notice the check that costs nothing: all three pairs gave 15. In a correctly set question they must, because the statements describe one family. Two pairs giving different ages is a signal that you have made an arithmetic slip, not that the paper is inconsistent.</p>
<h2>A mixed set, worked</h2>
<p>Accounts opened at four branches in one month, with the share of them that are savings accounts.</p>
<table>
<thead><tr><th>Branch</th><th>Accounts opened</th><th>Savings share</th><th>Savings accounts</th></tr></thead>
<tbody>
<tr><td>Kothagudem</td><td>480</td><td>45 percent</td><td>216</td></tr>
<tr><td>Nizamabad</td><td>560</td><td>55 percent</td><td>308</td></tr>
<tr><td>Siddipet</td><td>400</td><td>60 percent</td><td>240</td></tr>
<tr><td>Suryapet</td><td>640</td><td>35 percent</td><td>224</td></tr>
</tbody>
</table>
<p>The fourth column is the only calculation the set asks you to do twice, so do all four at the start and write them in the margin: 216, 308, 240 and 224. Now the questions come from four different chapters and none of them needs the table read again.</p>
<ul>
<li><strong>Average.</strong> The four savings figures total 988, and 988 divided by 4 is 247.</li>
<li><strong>Ratio.</strong> Non savings at Kothagudem is 480 minus 216, that is 264, and savings at Suryapet is 224. The ratio 264 to 224 divides by 8 to give 33 to 28.</li>
<li><strong>Percentage change.</strong> Savings at Siddipet exceeds savings at Kothagudem by 24 on a base of 216, and 24 over 216 is one ninth, which is 11.11 percent.</li>
<li><strong>Overall share.</strong> Total accounts are 2080 and total savings are 988, so savings are 47.5 percent of the whole, which is not the average of 45, 55, 60 and 35.</li>
</ul>`,
      Advanced: `<p>By a second attempt the mechanics are not the problem. What still costs marks here is a class of statement that looks decisive and is not, and a habit of computing an answer the format never asked for. Both are fixable in a fortnight.</p>
<h2>Ratio data answers ratio questions, never counts</h2>
<p>Question: how many girls are in the class? Statement I says the ratio of boys to girls is 3 to 2. Statement II says there are 15 more boys than girls. Statement I fixes the shape and nothing else, since 30 and 20 satisfy it as well as 45 and 30 do. Statement II fixes a difference and nothing else. Together, one part of the ratio equals 15, so girls are two parts, that is 30, and boys are 45. Both together, and neither alone.</p>
<p>Now change one word in the question. Ask instead what percentage of the class is girls. Statement I alone is now sufficient, because 2 parts out of 5 is 40 percent whatever the parts are worth. The statements did not change. The question did. Read what is being asked for before you judge a single statement, because a proportional question and an absolute question take completely different evidence.</p>
<h2>Two admissible values is not sufficiency</h2>
<p>A statement that ends in a quadratic, a square root or a modulus usually leaves two candidates, and two is not one.</p>
<ul>
<li>A statement giving x squared minus 9x plus 20 equals 0 leaves x as 4 or 5.</li>
<li>A statement that the average of two numbers is 30 and their difference is 10 does fix them as 35 and 25, but a statement that only the average is 30 fixes nothing about either.</li>
<li>A statement that a two digit number exceeds its reversal by 27 gives nine times the digit difference equals 27, so the difference of the digits is 3, which admits 30, 41, 52, 63, 74, 85 and 96. Add that the digits sum to 9 and only 63 survives.</li>
</ul>
<p>The second statement in such a question is usually a small qualifier, that the number is odd, or prime, or greater than 40, and its whole job is to cut two candidates down to one. Candidates who stop at the quadratic and answer sufficient are the intended casualties.</p>
<h2>The guessing arithmetic, done honestly</h2>
<p>The paper sets five options and deducts a quarter of the marks a question carries. A blind guess therefore returns one fifth of the marks and loses four fifths of a quarter of the marks, which is also one fifth. The expected return on a blind guess is exactly zero, every time, for every section. It is not a strategy, it is a coin toss with a fee attached in time.</p>
<p>Eliminate one option and the arithmetic changes character. You now win one quarter of the marks and lose three quarters of a quarter, which is three sixteenths, so the expected return is one sixteenth of the marks. On a data question carrying 1.71 marks that is about 0.11 marks a guess. Positive, small, and only worth taking on questions where the elimination was real rather than felt.</p>
<h2>Traps that cost a repeat attempter this section</h2>
<ul>
<li><strong>Solving a sufficiency question.</strong> The section gives 45 minutes for 35 questions, about 77 seconds each. A sufficiency judgement should take 40 seconds. Computing the value takes 100 and buys nothing.</li>
<li><strong>Contamination between statements.</strong> Judging statement II while still holding statement I is the single most common error in the format, and it always produces the answer "either alone is sufficient".</li>
<li><strong>Recomputing a mixed set.</strong> Derive every intermediate column once, write it in the margin, and answer all five questions from the margin.</li>
<li><strong>Averaging percentages.</strong> The mean of four percentages is the overall percentage only when the four bases are equal, which in a mixed set they never are.</li>
<li><strong>Assuming a statement is needed because it is there.</strong> A well set question sometimes makes statement I alone sufficient and statement II a decorated restatement of it. Judge, do not assume the paper is efficient.</li>
</ul>`,
      Expert: `<p>Recall sheet for the last month. Everything here is a rule you should be able to apply without re-deriving it at the terminal.</p>
<h2>The sufficiency decision in five lines</h2>
<ol>
<li>Name the unknowns and write the count in the margin.</li>
<li>Judge statement I with statement II covered.</li>
<li>Judge statement II with statement I covered, from the question text alone.</li>
<li>Combine only if both failed.</li>
<li>Map the judgement onto the option key, then move. Do not compute the value.</li>
</ol>
<h2>What each kind of statement can and cannot settle</h2>
<table>
<thead><tr><th>Statement gives</th><th>Settles an absolute count</th><th>Settles a ratio or a percentage</th></tr></thead>
<tbody>
<tr><td>A ratio alone</td><td>No</td><td>Yes</td></tr>
<tr><td>A difference alone</td><td>No</td><td>No</td></tr>
<tr><td>A ratio and any one absolute figure</td><td>Yes</td><td>Yes</td></tr>
<tr><td>A total and a ratio</td><td>Yes</td><td>Yes</td></tr>
<tr><td>A percentage change alone</td><td>No</td><td>Yes</td></tr>
<tr><td>An equation of degree two</td><td>Usually no, two roots</td><td>Usually no</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Two admissible values is insufficient. One value is sufficient. There is no third verdict.</li>
<li>Pairs of statements in a three statement question must all give the same answer. Disagreement means your arithmetic, not the paper.</li>
<li>A blind guess on five options with a quarter penalty is worth exactly zero. One genuine elimination makes it worth a sixteenth of the marks.</li>
<li>The overall percentage of a mixed set is a weighted figure. The plain average of the column is a distractor that is always printed.</li>
</ul>
<h2>Mixed set opening routine, ninety seconds</h2>
<ol>
<li>Read the units line and the year line. Note whether figures are in hundreds, thousands or lakh.</li>
<li>Derive the one column every question will need, for every row, and write it in the margin.</li>
<li>Compute the grand total of that column. Averages and overall shares then cost one division each.</li>
<li>Scan the five questions and answer the two arithmetic ones first. Leave any question asking for a ratio of two derived quantities until the margin is complete.</li>
</ol>
<h2>Edge cases worth carrying in</h2>
<ul>
<li>A statement can be sufficient while being impossible to compute quickly. Sufficiency is about determinacy, not about convenience.</li>
<li>Percentage questions built on a base that is itself derived need the base written down, or you will silently use the wrong denominator.</li>
<li>In a three statement question, sufficiency of all three individually is a legitimate answer and it does appear.</li>
<li>A wrong answer here costs about 0.43 marks against about 0.25 in the awareness section, so the discipline to leave a set is worth more in this section than anywhere else on the paper.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question: "What does a data sufficiency question ask you to decide?",
        options: [
          "The value of the quantity, correct to the nearest whole number",
          "Whether the statements, singly or together, fix the quantity at exactly one value",
          "Which of the two statements contains the larger amount of information",
          "Whether the two statements contradict each other",
        ],
        answer: 1,
        explanation:
          "The format marks you on determinacy alone, so the response required is whether the given statements narrow the quantity to one value; the value itself is worth no extra marks. Comparing which statement carries more information is the tempting reading because you do weigh the statements against each other, but a long statement can settle nothing while a five word one settles everything.",
        difficulty: "Easy",
        skill: "Data sufficiency question form",
      },
      {
        n: 2,
        question:
          "The question asks for the speed of a boat in still water. Statement I: it covers 60 km downstream in 3 hours. Statement II: it covers 36 km upstream in 3 hours. Which is sufficient?",
        options: [
          "Statement I alone",
          "Statement II alone",
          "Both together, but neither alone",
          "Even both together are insufficient",
        ],
        answer: 2,
        explanation:
          "Statement I gives a downstream speed of 20 km an hour, which is boat plus stream, and statement II gives an upstream speed of 12 km an hour, which is boat minus stream, so each alone is one equation in two unknowns. Together they give a boat speed of 16 and a stream of 4. Reading statement I alone as the boat's speed is the trap: 20 km an hour is the boat being carried by the current, not the boat in still water.",
        difficulty: "Medium",
        skill: "Two statement sufficiency",
      },
      {
        n: 3,
        question:
          "The question asks for the son's present age. I: the father is 30 years older than the son. II: five years ago the father was four times as old as the son. III: the sum of their present ages is 60 years. Which statements are sufficient?",
        options: [
          "I and II only",
          "Any two of the three",
          "All three are needed together",
          "I and III only",
        ],
        answer: 1,
        explanation:
          "Each pair settles the age at 15: I with II gives 3s equal to 45, I with III gives 2s equal to 30, and II with III gives 5s equal to 75. Choosing I and II only is natural because that is the first pair most candidates test and it does work, but the format asks which statements are sufficient, and the other two pairs are equally sufficient.",
        difficulty: "Hard",
        skill: "Three statement sufficiency",
      },
      {
        n: 4,
        question:
          "The question asks for a two digit number. I: the sum of its digits is 9. II: the number exceeds the number formed by reversing its digits by 27. Which is sufficient?",
        options: [
          "Statement I alone",
          "Statement II alone",
          "Both together, but neither alone",
          "Either statement alone",
        ],
        answer: 2,
        explanation:
          "Statement I admits 18, 27, 36, 45, 54, 63, 72, 81 and 90, and statement II reduces to nine times the digit difference equalling 27, so the digits differ by 3, admitting 30, 41, 52, 63, 74, 85 and 96. Only together do the two conditions leave 63. Statement II looks decisive on its own because a reversal condition feels highly specific, but it still leaves seven candidates, and two candidates is already insufficient.",
        difficulty: "Medium",
        skill: "Uniqueness of the answer",
      },
      {
        n: 5,
        question:
          "A sufficiency question asks how long a train takes to cross a platform. Statement I gives the length of the train and its speed. Statement II gives the length of the platform. What is the correct handling?",
        options: [
          "Statement I alone is sufficient, since speed and train length fix any crossing time",
          "Both together are sufficient, and the crossing time need not be computed",
          "Both together are still insufficient, because crossing time also depends on the direction of travel",
          "Statement II alone is sufficient, since the platform is what is being crossed",
        ],
        answer: 1,
        explanation:
          "The distance to be covered is the train length plus the platform length, and dividing that by the known speed yields one value, so the pair is sufficient and evaluating it earns nothing. Statement I alone is the attractive error because it would settle the time to cross a pole, where the distance is the train length alone, but a platform has a length of its own and that length lives only in statement II.",
        difficulty: "Medium",
        skill: "Sufficiency without solving",
      },
      {
        n: 6,
        question:
          "Accounts opened in a month with the savings share in brackets: Kothagudem 480 (45 percent), Nizamabad 560 (55 percent), Siddipet 400 (60 percent), Suryapet 640 (35 percent). What is the average number of savings accounts per branch?",
        options: ["247", "253.5", "262", "270"],
        answer: 0,
        explanation:
          "The savings figures are 216, 308, 240 and 224, totalling 988, and 988 divided by 4 is 247. The figure 253.5 comes from averaging the four percentages to 48.75 and applying that to the average branch size of 520, which is wrong because the branches carry different totals and a percentage cannot be averaged across unequal bases.",
        difficulty: "Medium",
        skill: "Mixed data interpretation sets",
      },
      {
        n: 7,
        question:
          "From the same figures, what is the ratio of non savings accounts at Kothagudem to savings accounts at Suryapet?",
        options: ["28 : 33", "15 : 14", "33 : 28", "27 : 28"],
        answer: 2,
        explanation:
          "Kothagudem opens 480 accounts of which 45 percent are savings, so non savings is 55 percent of 480, that is 264, and Suryapet savings is 35 percent of 640, that is 224; 264 to 224 divides by 8 to give 33 to 28. The reversed ratio 28 to 33 is the standard trap, produced by taking the branches in the order they appear in the table rather than the order the question names them.",
        difficulty: "Medium",
        skill: "Mixed data interpretation sets",
      },
    ],
  },
};

export default PART;
