/**
 * Course 307: IBPS PO & Clerk: Prelims and Mains, part 13.
 *
 * Topics 30708, 30709 and 30715: the two topics that open the data
 * interpretation module, and the reading comprehension topic that opens the
 * English module.
 *
 * Written for a candidate who can already do school arithmetic and now has to
 * do it against a sectional clock, on displays that are built to be misread.
 * Every table, graph and caselet in this file has been worked through and the
 * arithmetic produces the number it claims: the sanction rates, the totals, the
 * recovered cells of the missing data table and the overlap counts all
 * reconcile. The comprehension passage is a practice passage written for this
 * lesson. It describes a banking structure rather than a live scheme, so
 * nothing in it rests on a figure that changes.
 *
 * Examination mechanics are stated as they are set: prelims is sectionally
 * timed, a wrong answer costs a quarter of the marks that question carries, and
 * the prelims score is not carried into the final merit list. No vacancy count,
 * fee, cut-off mark, examination date or interest rate is stated as current
 * fact.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30708: {
    topicId: 30708,
    title: "Tables, bar graphs and line graphs",
    summary:
      "A table, a bar graph and a line graph carry the same information in three different shapes, and the marks go to the candidate who reads the heading and the units line before the first question rather than after the third one. You learn the calculation habits this section actually pays for: percentage change against the correct base, comparing two rates without dividing either, and stopping the arithmetic at the point where the printed options separate.",
    concepts: [
      "Reading the units and heading line",
      "Percentage change against the correct base",
      "Percentage points versus percentage change",
      "Comparing ratios without dividing",
      "Bar graph and line graph reading",
      "Approximation to the option gap",
    ],
    glossary: {
      "Units line":
        "The short line printed above or below a display stating what the figures are counted in: accounts in hundreds, amounts in lakh, weight in quintal. Miss it and every answer in the set is wrong by a constant factor while your working is faultless.",
      "Base of a percentage":
        "The quantity a change or a share is measured against, which is whatever the question puts after the words of, than or compared with. The same difference divided by two different bases gives two different percentages, and both of them appear in the options.",
      "Percentage point":
        "The plain arithmetic difference between two percentages. A rate moving from 60 percent to 70 percent moves ten percentage points and rises by one sixth of itself, and those two figures answer different questions.",
      "Cross multiplication comparison":
        "A way of deciding which of two fractions is larger without dividing either of them: multiply the numerator of each by the denominator of the other and compare the two products. It replaces two long divisions with two short multiplications.",
      "Composite bar":
        "A bar divided into stacked segments, so that the full height is a total and each segment is one part of it. A segment is read by subtracting the boundary below it from the boundary above it, never by reading the top of the bar.",
      "Approximation margin":
        "The gap between the two closest printed options, which decides how rough your arithmetic is permitted to be. Options of 42, 48, 54 and 60 allow far cruder work than options of 46, 47, 48 and 49.",
    },
    body: {
      Beginner: `<p>Both papers ask questions on data. In prelims the data sits inside the quantitative section, and in the main examination it has a section of its own. Either way the figures arrive in one of three shapes, and this lesson teaches you to read all three before it teaches you any arithmetic.</p>
<h2>The three shapes</h2>
<ul>
<li>A <strong>table</strong> is rows and columns of printed figures. It is the most exact shape, because every value you need is written somewhere in it.</li>
<li>A <strong>bar graph</strong> draws each value as a bar. You read a value by carrying the top of the bar across to the scale marked along the left edge.</li>
<li>A <strong>line graph</strong> joins the values with a line, so the eye picks up the rise and the fall before it picks up any number at all.</li>
</ul>
<h2>Read the small line first</h2>
<p>Above or below every display there is a short line saying what the figures are counted in: accounts in hundreds, amounts in lakh, weight in quintal. That is the <strong>units line</strong>. A candidate who reads a bar of 24 as twenty four when the line says hundreds has answered a question the paper never asked, and the working underneath was perfectly correct. Read that line once before the first question, every time.</p>
<h2>A small table, worked</h2>
<p>New savings accounts opened at one branch.</p>
<table>
<thead><tr><th>Month</th><th>Accounts opened</th></tr></thead>
<tbody>
<tr><td>April</td><td>250</td></tr>
<tr><td>May</td><td>300</td></tr>
<tr><td>June</td><td>270</td></tr>
<tr><td>July</td><td>330</td></tr>
</tbody>
</table>
<p>The four months together give 250 plus 300 plus 270 plus 330, which is 1150. The average month is 1150 divided by 4, which is 287.5.</p>
<h2>Percentage change, and the number you divide by</h2>
<p>From April to May the count rose by 50. To turn that rise into a percentage you divide it by the month you started from, which is April with 250. Fifty divided by 250 is one fifth, so the rise is 20 percent. The figure you divide by is called the <strong>base</strong>, and choosing the wrong one is the commonest error in the whole section. Dividing the same 50 by May's 300 gives 16.67 percent, and that is the answer to a different question: by what percent April fell short of May.</p>
<h2>What a wrong answer costs</h2>
<p>In prelims each question carries one mark and a wrong answer takes away a quarter of a mark. A blank costs nothing. So a value you read cleanly off a table is worth attempting, and a value you squinted at on a graph somewhere between two gridlines usually is not.</p>
<h2>The habit to build this week</h2>
<p>Take any table from the business page of a newspaper and, before reading a word of the report around it, write down what the units are, what the rows are and what the columns are. Two minutes a day for a fortnight and the reading half of this section stops costing you time.</p>`,
      Intermediate: `<p>One data set, three shapes. A table prints the values, a bar graph draws them as heights and a line graph joins them so that movement is visible. The habits below apply to all three, and they are what the section pays for, because the arithmetic itself never rises above school level.</p>
<h2>The set you will work with</h2>
<p>Loan applications at a regional office over five months, taken from a practice paper.</p>
<table>
<thead><tr><th>Month</th><th>Applications received</th><th>Sanctioned</th><th>Sanction rate</th></tr></thead>
<tbody>
<tr><td>April</td><td>1200</td><td>780</td><td>65 percent</td></tr>
<tr><td>May</td><td>1500</td><td>990</td><td>66 percent</td></tr>
<tr><td>June</td><td>1350</td><td>810</td><td>60 percent</td></tr>
<tr><td>July</td><td>1600</td><td>1120</td><td>70 percent</td></tr>
<tr><td>August</td><td>1440</td><td>864</td><td>60 percent</td></tr>
</tbody>
</table>
<p>The fourth column is not printed in the paper. You derive it once, before you read a single question, because most of a set built on this table stands on it: 780 over 1200 is 65 percent, 990 over 1500 is 66, 810 over 1350 is 60, 1120 over 1600 is 70 and 864 over 1440 is 60.</p>
<h2>Percentage change: the base decides the answer</h2>
<p>Applications fall from 1600 in July to 1440 in August. The fall is 160 and the base is the figure you started from, so 160 over 1600 is exactly 10 percent. Divide the same 160 by 1440 and you get 11.11 percent, which correctly answers a question nobody asked: by what percent July stood above August. Both numbers will be printed as options.</p>
<h2>Percentage points are not percentages</h2>
<p>The sanction rate moves from 60 in June to 70 in July. That is a rise of ten percentage points. As a percentage change it is 10 over 60, that is one sixth, that is 16.67 percent. Read the stem for the word points, because the two figures are both correct and only one of them is the answer.</p>
<h2>Compare two rates without dividing either</h2>
<p>Was the April rate above the May rate? Instead of two divisions, cross multiply: 780 times 1500 is 11,70,000 and 990 times 1200 is 11,88,000. The second product is the larger, so 990 over 1500 is the larger fraction and May is the better month. Two short multiplications have replaced two long divisions, and on a set with five comparison questions that habit alone buys you a minute.</p>
<h2>The overall figure is weighted, the mean is not</h2>
<p>Total received is 7090 and total sanctioned is 4564, so the sanction rate over the whole period is 4564 over 7090, a shade under 64.4 percent. The plain mean of the five monthly rates is 64.2 percent. They differ because the months carry different volumes, and the stem tells you which one it wants: a rate for the period is weighted, an average of the monthly rates is not.</p>
<h2>Bar graphs</h2>
<p>Take a bar graph of loans disbursed by a rural branch across five financial years, in hundreds: 24, 18, 30, 42 and 36. The rise from the third year to the fourth is 12 hundred on a base of 30 hundred, which is 40 percent. The fall from the fourth to the fifth is 6 hundred on 42 hundred, which is 14.29 percent. Read heights against the printed scale and trust the gridline, because a well set question never turns on a reading you cannot physically make.</p>
<h2>Line graphs</h2>
<p>Two lines, insurance policies sold per month at two branches. Warangal runs 120, 150, 135, 180, 165. Khammam runs 90, 120, 150, 150, 195. The lines cross in March, which is the month the gap changes sign, and that crossing is usually worth one question by itself.</p>
<p>The point candidates miss is that the steepest segment is not the largest percentage rise. Warangal from March to April rises by 45, and so does Khammam from April to May. The two segments are equally steep on the page. But 45 on a base of 135 is 33.33 percent while 45 on a base of 150 is 30 percent. Slope carries absolute change; the question almost always asks for relative change.</p>`,
      Advanced: `<p>By a second attempt you can read all three displays without effort. What still costs marks is a small family of question constructions, and the clock. The main examination gives the data section forty five minutes for thirty five questions, and the reading time for every set comes out of the same budget, so a set you enter and then abandon costs you three or four questions rather than one.</p>
<h2>The constructions that take marks off a prepared candidate</h2>
<table>
<thead><tr><th>Trap</th><th>How the stem is written</th><th>The check that kills it</th></tr></thead>
<tbody>
<tr><td>Base swap</td><td>by what percent more than, against by what percent less than</td><td>The base is whatever follows than, of or compared with</td></tr>
<tr><td>Points against percent</td><td>by how many percentage points the rate improved</td><td>Points subtract, percent divides. Never both</td></tr>
<tr><td>Units carried over</td><td>One set in hundreds, the very next set in lakh</td><td>Re-read the units line for each set, not each paper</td></tr>
<tr><td>Composite bar segment</td><td>Asks for the middle segment of a stacked bar</td><td>Subtract the two boundaries, do not read the top</td></tr>
<tr><td>Broken vertical scale</td><td>The axis begins at 40 rather than at zero</td><td>A bar twice as tall is not twice the value</td></tr>
<tr><td>Average of rates</td><td>The sanction rate for the period, against the average monthly rate</td><td>Weight by volume unless the stem says average of the rates</td></tr>
</tbody>
</table>
<h2>A falling rate with a rising count</h2>
<p>This one is set every cycle and it is worth internalising. Suppose the sanction rate falls from 65 percent to 60 percent while applications rise from 1200 to 1500. Sanctions go from 780 to 900. The rate fell and the number rose, both at once, and an option that says sanctions must have fallen is written specifically for the candidate who read only the rate. A percentage is a relationship. It tells you nothing about a count until you know the base it sits on.</p>
<h2>Approximation, stopped at the option gap</h2>
<p>Approximately what percent of the applications received over the five months were rejected? Rejections are 7090 minus 4564, that is 2526. Now look at the options before you calculate: 32, 36, 40 and 44. They are four points apart, and four points of 7090 is about 284 applications, so you have a wide margin to work in.</p>
<p>Take 10 percent of 7090, which is 709. Thirty five percent is three and a half times that, which is 2481.5. You are 44.5 short of 2526, and 44.5 is well under a further percent, so the figure is a little over 35.6 percent and the answer is 36. That is one multiplication and one subtraction. Computing 2526 divided by 7090 to two decimal places is the same answer at four times the cost.</p>
<h2>Decide whether to enter a set at all</h2>
<p>Read the five stems before the first calculation. If two of them can be answered from figures already printed, the set is worth entering. If four of them require a derived column that itself needs a percentage of a percentage, the set is a time sink dressed as five marks. In the officer main examination a wrong answer in this section costs about 0.43 marks against the 0.25 you are used to from prelims, so the discipline to walk away from a set is worth more here than anywhere else on the paper.</p>
<h2>Marginal points a repeat attempter can still collect</h2>
<ul>
<li>Derive every column the set will need for every row at the start, and write it in the margin. Recomputing the same ratio for question four that you computed for question two is the quietest loss of time in the section.</li>
<li>When a question asks for a difference between two derived quantities, check whether the difference can be found directly. The difference of two percentages of the same base is that percentage difference of the base, and one subtraction has replaced two multiplications.</li>
<li>A ratio question rarely needs the actual counts. Cancel the common factor as early as it appears rather than at the end.</li>
<li>On a mixed display where a table feeds a graph, confirm once that the two agree on a value you can check in both. Setters do sometimes make the graph the only place a figure appears.</li>
</ul>`,
      Expert: `<p>Recall sheet. Everything here is meant to be retrievable in a second at the terminal, not derived.</p>
<h2>Fractions to percentages, for division at sight</h2>
<table>
<thead><tr><th>Fraction</th><th>Percent</th><th>Fraction</th><th>Percent</th></tr></thead>
<tbody>
<tr><td>1 by 6</td><td>16.67</td><td>1 by 12</td><td>8.33</td></tr>
<tr><td>1 by 7</td><td>14.29</td><td>1 by 13</td><td>7.69</td></tr>
<tr><td>1 by 8</td><td>12.5</td><td>1 by 14</td><td>7.14</td></tr>
<tr><td>1 by 9</td><td>11.11</td><td>1 by 15</td><td>6.67</td></tr>
<tr><td>1 by 11</td><td>9.09</td><td>1 by 16</td><td>6.25</td></tr>
<tr><td>2 by 7</td><td>28.57</td><td>3 by 8</td><td>37.5</td></tr>
</tbody>
</table>
<h2>Opening routine for any display, sixty seconds</h2>
<ol>
<li>Read the units line and the period line. Note hundreds, lakh, crore, tonnes.</li>
<li>Read the column headings and decide which column is printed and which must be derived.</li>
<li>Derive the one column the set is built on, for every row, in the margin.</li>
<li>Total that column, so averages and overall shares cost one division each afterwards.</li>
<li>Read all five stems and pick the two cheapest. Answer those first.</li>
</ol>
<h2>Two line rules</h2>
<ul>
<li>The base is whatever follows than, of or compared with. Circle it in the stem before you divide.</li>
<li>Points subtract. Percent divides. A stem containing the word points never wants a division.</li>
<li>Slope on a line graph is absolute change. A question asking for growth almost always wants relative change.</li>
<li>A stacked segment is the difference of two boundaries, never the height of the bar.</li>
<li>An overall rate is weighted by volume. The mean of the row rates is a distractor that is always printed.</li>
<li>Cross multiply to compare two fractions. Divide only when the paper asks for the value itself.</li>
<li>Approximate to the gap between the two closest options and stop there.</li>
</ul>
<h2>Edge cases worth carrying in</h2>
<ul>
<li>A percentage rise of 25 percent followed by a fall of 20 percent returns you exactly to the starting figure. The pair is set often because it looks like a net gain of five.</li>
<li>A broken vertical axis makes every visual comparison unsafe. Read numbers off the scale, not proportions off the page.</li>
<li>Where a bar graph and a table describe the same period, one of them will contain a value the other omits. Locate it before you start.</li>
<li>Successive percentage changes multiply, so a rise of 10 percent on a rise of 10 percent is 21 percent, not 20.</li>
<li>A question asking for the number of years in which a quantity was above its own five year average requires the average first. Compute it once, then scan.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A bar graph is headed: number of accounts opened at rural branches, figures in hundreds. The bar for June reaches 24. How many accounts were opened in June?",
        options: ["24", "240", "2400", "24000"],
        answer: 2,
        explanation:
          "The units line says the figures are in hundreds, so a bar of 24 stands for 24 multiplied by 100, that is 2400 accounts. The tempting 240 is what the same bar would mean if the line read in tens, and this error most often happens when a candidate carries the units line of the previous set in the paper into the new one instead of re-reading it.",
        difficulty: "Easy",
        skill: "Reading the units and heading line",
      },
      {
        n: 2,
        question:
          "Applications received fell from 1600 in July to 1440 in August. By what percent did they fall?",
        options: ["9.09 percent", "10 percent", "11.11 percent", "12.5 percent"],
        answer: 1,
        explanation:
          "The fall is 160 and the base for a fall is the figure you started from, so 160 divided by 1600 is exactly 10 percent. The attractive 11.11 percent is 160 divided by 1440, which is a correct calculation of a different quantity, namely by what percent July stood above August, and the stem asked for the fall from July.",
        difficulty: "Medium",
        skill: "Percentage change against the correct base",
      },
      {
        n: 3,
        question:
          "The sanction rate was 60 percent in June and 70 percent in July. Which statement is correct?",
        options: [
          "The rate rose by 10 percent",
          "The rate rose by 16.67 percentage points",
          "The rate rose by ten percentage points, which is a rise of 16.67 percent",
          "The rate rose by 70 percent",
        ],
        answer: 2,
        explanation:
          "Subtracting one percentage from another gives percentage points, so the movement is ten points, and expressing that movement against the June figure gives 10 over 60, which is one sixth or 16.67 percent. Saying the rate rose by 10 percent is the standard confusion: a 10 percent rise on 60 would have taken the rate to 66, not to 70.",
        difficulty: "Medium",
        skill: "Percentage points versus percentage change",
      },
      {
        n: 4,
        question:
          "April sanctioned 780 of 1200 applications and May sanctioned 990 of 1500. Which month had the higher sanction rate, and by the shortest route?",
        options: [
          "April, since 780 out of 1200 leaves a smaller shortfall",
          "May, since 990 is larger than 780",
          "They are equal, since both are close to two thirds",
          "May, since 990 times 1200 exceeds 780 times 1500",
        ],
        answer: 3,
        explanation:
          "Cross multiplying gives 780 times 1500 equal to 11,70,000 and 990 times 1200 equal to 11,88,000, and the larger product sits with the larger fraction, so May at 66 percent beats April at 65 percent. Concluding that May is higher because 990 exceeds 780 reaches the right month by an unsound route: a larger numerator settles nothing unless the denominators match, and the same reasoning applied to June against April would have declared June the better month when its rate is in fact five points lower.",
        difficulty: "Medium",
        skill: "Comparing ratios without dividing",
      },
      {
        n: 5,
        question:
          "On a line graph, one branch rises by 45 policies from a March figure of 135, and another rises by 45 policies from an April figure of 150. Which segment shows the larger percentage rise?",
        options: [
          "The one starting from 135",
          "The one starting from 150",
          "Both are equal, because both rise by 45",
          "It cannot be decided without the annual totals",
        ],
        answer: 0,
        explanation:
          "Forty five on a base of 135 is one third, that is 33.33 percent, while 45 on a base of 150 is 30 percent, so the segment starting lower shows the larger rise. Answering that they are equal is the trap the graph itself sets, because the two segments are drawn at exactly the same steepness and slope shows absolute change, not relative change.",
        difficulty: "Medium",
        skill: "Bar graph and line graph reading",
      },
      {
        n: 6,
        question:
          "Total applications received over five months are 7090 and total sanctioned are 4564. The options for the overall sanction rate are 58, 64, 71 and 77 percent. What is the least work that settles it?",
        options: [
          "Divide 4564 by 7090 to two decimal places",
          "Take the mean of the five monthly sanction rates",
          "Note that 64 percent of 7090 is about 4538, which is within 30 of 4564, while the neighbouring options are more than 400 away",
          "Compare the largest monthly figure with the smallest",
        ],
        answer: 2,
        explanation:
          "The options are six or seven points apart, and one point of 7090 is about 71 applications, so a single multiplication with a margin of 400 either side is enough and the long division is wasted effort. Taking the mean of the monthly rates happens to land on the same option here, but only by luck, because a mean of percentages ignores the unequal monthly volumes and will miss whenever the busiest month has an unusual rate.",
        difficulty: "Hard",
        skill: "Approximation to the option gap",
      },
      {
        n: 7,
        question:
          "June received 1350 applications and sanctioned 810. May received 1500 and sanctioned 990. What is the ratio of rejected applications in June to rejected applications in May?",
        options: [
          "9 : 11",
          "5 : 6",
          "27 : 25",
          "18 : 17",
        ],
        answer: 3,
        explanation:
          "Rejections are received minus sanctioned, so June has 1350 minus 810, that is 540, and May has 1500 minus 990, that is 510, and dividing both by 30 gives 18 to 17. The tempting 9 to 11 is the ratio of the sanctioned figures, which is what a candidate produces by using the column the table prints instead of doing the subtraction the stem requires.",
        difficulty: "Medium",
        skill: "Comparing ratios without dividing",
      },
    ],
  },
  30709: {
    topicId: 30709,
    title: "Caselet and missing data interpretation",
    summary:
      "A caselet is a data set written as four sentences of prose and a missing data set is a table printed with holes in it, and both are testing the same thing: whether you can build the arrangement the setter deliberately withheld before you attempt any arithmetic. You learn to draw the table a caselet describes, to find the anchor figure that turns ratios into counts, and to work a holed table in dependency order rather than left to right.",
    concepts: [
      "Converting a caselet into a table",
      "The unit method for ratios",
      "Order of solving a missing data table",
      "Back calculation from a percentage",
      "Venn and set based caselets",
      "Deciding when to leave a set",
    ],
    glossary: {
      Caselet:
        "A data set delivered as three or four sentences of prose rather than as a table. Nothing has been left out of it, but nothing has been arranged either, and the arranging is the work the marks are paid for.",
      "Missing data interpretation":
        "A table printed with several cells blank, together with enough relations stated around it to recover every blank. The set is solvable only in a particular order, and finding that order is most of the question.",
      "Anchor figure":
        "The one absolute number in a set otherwise made of ratios and percentages, usually a total or a single count. It is what converts every proportion into a countable quantity, and a set without one can answer proportional questions only.",
      "Unit of a ratio":
        "The common multiplier hidden inside a ratio, written as x, so that 4 to 5 becomes 4x and 5x. Solving for that single quantity is what turns a shape into numbers.",
      "Chain of dependence":
        "The order in which the blank cells of a table become computable, because one blank usually needs a value that is itself a blank somewhere else. A row that depends on nothing is where you start.",
      "Only and at least":
        "The two readings of an overlap question. Only quantitative means the count excluding those who also did reasoning, while at least one means the union of the two groups, and the paper uses both wordings deliberately in the same set.",
    },
    body: {
      Beginner: `<p>Most data questions arrive as a table you can look at. Two kinds do not. In a <strong>caselet</strong> the figures are hidden inside sentences, and in a <strong>missing data</strong> set the table is printed but several of its boxes are empty. In both cases your first job is to build the table, not to calculate.</p>
<h2>Why the prose form is used at all</h2>
<p>A table hands you the arrangement free. A caselet makes you do it, and that is the whole difficulty. Candidates who read a caselet the way they read a story, once through, reach the end holding nothing. Candidates who read it with a pen, writing each fact into a grid as it arrives, reach the end holding the table the other candidate was given for nothing.</p>
<h2>A short caselet, worked</h2>
<p>A skill centre enrolled 240 trainees in one batch. Two thirds of them took the solar trade and the rest took the electrician trade. Of the trainees in the solar trade, 25 percent were women.</p>
<ol>
<li>Solar trainees: two thirds of 240. One third of 240 is 80, so two thirds is 160.</li>
<li>Electrician trainees: the rest, which is 240 minus 160, that is 80.</li>
<li>Women in the solar trade: 25 percent of 160, which is one quarter of 160, that is 40.</li>
</ol>
<p>Three sentences of prose have become a grid with four numbers in it. Every question that follows is now a two second look at the grid rather than a re-reading of the paragraph.</p>
<h2>The one number that makes a caselet solvable</h2>
<p>A caselet can be full of ratios and percentages and still be unanswerable, because a ratio only tells you the shape of the data and never the size. You need at least one plain count somewhere, such as the 240 above. That count is called the <strong>anchor figure</strong>. Find it in your first reading and underline it, because everything else in the set hangs off it.</p>
<h2>Missing data, in one line</h2>
<p>A missing data table is the same job in a different costume. The blanks are always recoverable, but not in the order they are printed. You look for the row that can be completed using only the numbers already on the page, complete it, and use that row to reach the next one.</p>
<h2>Knowing when to walk away</h2>
<p>These sets are slow to start and fast to finish. If you have spent a minute and a half and still have no anchor figure and no completed row, the set is not going to reward you, and a question left blank costs you nothing at all. Leave it, finish the rest of the section, and return only if the clock allows.</p>`,
      Intermediate: `<p>Treat both forms as one procedure with two entry points: read, arrange, then calculate. The arrangement is where a set is won, and every minute spent on it is repaid across five questions.</p>
<h2>A caselet, taken apart</h2>
<p>In one week a bank ran deposit drives at three centres, Jangaon, Bhupalpally and Wanaparthy, and opened 1250 new accounts across the three. Bhupalpally opened 25 percent more accounts than Jangaon. Wanaparthy opened 150 fewer accounts than Bhupalpally. At Jangaon 55 percent of the accounts were opened by women. At Bhupalpally the accounts opened by women and by men stood in the ratio 3 to 2. At Wanaparthy 40 percent of the accounts were opened by women.</p>
<p>Take the first three sentences alone, since only they carry the totals. Let Jangaon be J. Bhupalpally is then 1.25J and Wanaparthy is 1.25J minus 150. The three together are 1250, so 3.5J minus 150 equals 1250, giving 3.5J equal to 1400 and J equal to 400. Bhupalpally is 500 and Wanaparthy is 350, and the three do add to 1250.</p>
<p>Only now go to the women and men. Jangaon: 55 percent of 400 is 220 women and 180 men. Bhupalpally: 3 to 2 across 500 means one unit is 100, so 300 women and 200 men. Wanaparthy: 40 percent of 350 is 140 women, leaving 210 men.</p>
<table>
<thead><tr><th>Centre</th><th>Accounts</th><th>Women</th><th>Men</th></tr></thead>
<tbody>
<tr><td>Jangaon</td><td>400</td><td>220</td><td>180</td></tr>
<tr><td>Bhupalpally</td><td>500</td><td>300</td><td>200</td></tr>
<tr><td>Wanaparthy</td><td>350</td><td>140</td><td>210</td></tr>
<tr><td>Total</td><td>1250</td><td>660</td><td>590</td></tr>
</tbody>
</table>
<p>Six lines of prose are now twelve numbers, and the questions cost seconds. Women are 660 of 1250, which is 52.8 percent of all accounts. Bhupalpally exceeds Wanaparthy by 150 on a base of 350, which is 42.86 percent. Men at Wanaparthy to women at Jangaon is 210 to 220, that is 21 to 22.</p>
<h2>A missing data table, in dependency order</h2>
<p>Loan applications at a branch. Every application is either sanctioned or rejected.</p>
<table>
<thead><tr><th>Month</th><th>Received</th><th>Sanctioned</th><th>Rejected</th></tr></thead>
<tbody>
<tr><td>June</td><td>640</td><td>blank</td><td>256</td></tr>
<tr><td>July</td><td>blank</td><td>495</td><td>blank</td></tr>
<tr><td>August</td><td>720</td><td>blank</td><td>blank</td></tr>
<tr><td>September</td><td>blank</td><td>blank</td><td>270</td></tr>
</tbody>
</table>
<p>Three further facts are printed with the set. The sanction rate in July was 55 percent. The sanction rate in August was five percentage points above the sanction rate in June. Rejections in September were 30 percent of the applications received that month.</p>
<ol>
<li><strong>June first</strong>, because it is the only row completable from its own printed cells. Sanctioned is 640 minus 256, that is 384, and the sanction rate is 384 over 640, that is 60 percent.</li>
<li><strong>August next</strong>, because it depends on June and on nothing else. Five points above 60 is 65 percent, so sanctioned is 65 percent of 720, that is 468, and rejected is 252.</li>
<li><strong>July</strong>, which stands alone. If 495 is 55 percent of the applications received, then received is 495 divided by 0.55, that is 900, and rejected is 405.</li>
<li><strong>September</strong>, which also stands alone. If 270 is 30 percent of applications received, received is 900, and sanctioned is 630.</li>
</ol>
<p>Note what would have happened had you worked left to right and started with July's blank cell. You would have needed a relation printed three lines further down, would have read it out of order, and would have arrived at August without June's rate in hand. Received totals 3160, sanctioned totals 1977 and rejected totals 1183, and 1977 plus 1183 is 3160, which is the check that costs one addition and catches most slips.</p>`,
      Advanced: `<p>The method is not the difficulty at a second attempt. The difficulty is that these sets punish a wrong entry point harder than any other question type on the paper, because a caselet misread in the first thirty seconds is usually misread for all five questions.</p>
<h2>Separate the sentences that carry totals from the sentences that split them</h2>
<p>Every caselet has two layers. One layer fixes the size of each group, and the second layer divides each group internally by gender, by product, by shift. Solve the first layer completely before you read the second. A candidate who reads the caselet in printed order carries a percentage of a group whose size is still unknown, and either holds it in the head or writes an equation in two unknowns that was never necessary.</p>
<h2>Back calculation is where the base moves</h2>
<p>Three constructions, each with the wrong answer that is printed alongside it.</p>
<table>
<thead><tr><th>The set says</th><th>Correct handling</th><th>The printed trap</th></tr></thead>
<tbody>
<tr><td>495 is 55 percent of the applications</td><td>Divide by 0.55 to get 900</td><td>Divide by 0.45, treating 55 as the rejection rate, giving 1100</td></tr>
<tr><td>B is 25 percent more than J</td><td>B equals 1.25J, so J equals B divided by 1.25</td><td>Take 25 percent of B and subtract it, giving 0.75B</td></tr>
<tr><td>B exceeds W by 150</td><td>150 over W is 42.86 percent</td><td>150 over B is 30 percent, which answers by what percent W falls short of B</td></tr>
<tr><td>The rate is five points above 60</td><td>65 percent</td><td>Five percent of 60 added on, giving 63</td></tr>
</tbody>
</table>
<h2>Set based caselets and the wording that decides them</h2>
<p>Of 300 aspirants in a batch, 180 finished the quantitative section, 150 finished the reasoning section and 60 finished both. The union is 180 plus 150 minus 60, that is 270, so 30 finished neither. Only quantitative is 180 minus 60, that is 120, and only reasoning is 90.</p>
<p>Now read the four wordings the paper actually uses. How many finished quantitative is 180, the full circle. How many finished only quantitative is 120. How many finished at least one is 270. How many finished neither is 30. All four numbers sit in the same diagram and three of them will be printed as options for whichever one is asked. Circle the word only, or at least, or neither, in the stem before you look at the diagram.</p>
<h2>When to leave, and what to salvage</h2>
<p>Give a caselet ninety seconds to yield the anchor figure and the first layer of totals. If both are still missing, leave the set. A caselet built entirely of ratios with no absolute count anywhere can still answer questions asking for a ratio or a percentage, and assuming a convenient total such as 100 is a legitimate technique for exactly those. The moment a stem asks how many, that assumption produces a number you cannot defend, and in the officer main examination a wrong answer in this section costs about 0.43 marks against the 0.25 you are used to in prelims.</p>
<h2>Marginal marks worth collecting</h2>
<ul>
<li>Write the check row. Sanctioned plus rejected must equal received, and the columns must total the grand total. One addition catches most arithmetic slips before they reach four answers.</li>
<li>A percentage of a total that is itself unknown is not a dead end. Name it x and continue; three sentences later the caselet usually gives the count that fixes x.</li>
<li>Where a relation is stated in points rather than percent, write the resulting percentage into the table immediately, so you never re-read the sentence under time.</li>
<li>Missing data sets are frequently easier than they look, because a blank cell that appears in three questions has to be recoverable. If you cannot see how, you have missed a printed relation, not met an unsolvable set.</li>
</ul>`,
      Expert: `<p>Recall sheet. Prose to equation, and the order of attack.</p>
<h2>Translating the sentence into a line of algebra</h2>
<table>
<thead><tr><th>The set says</th><th>You write</th></tr></thead>
<tbody>
<tr><td>A is 25 percent more than B</td><td>A equals 1.25B</td></tr>
<tr><td>A is 20 percent less than B</td><td>A equals 0.8B</td></tr>
<tr><td>A and B are in the ratio 4 to 5</td><td>A equals 4x, B equals 5x</td></tr>
<tr><td>A exceeds B by 150</td><td>A equals B plus 150</td></tr>
<tr><td>A is two thirds of the total T</td><td>A equals 2T divided by 3</td></tr>
<tr><td>The rate is five points above 60</td><td>65, never 63</td></tr>
<tr><td>P is 55 percent of Q, P known</td><td>Q equals P divided by 0.55</td></tr>
</tbody>
</table>
<h2>Order of attack, in five lines</h2>
<ol>
<li>Underline every absolute count in the prose. If there are none, the set answers ratio questions only.</li>
<li>Solve the layer that fixes group sizes, using one unknown wherever possible.</li>
<li>Fill the grid completely, including the columns nobody has asked for yet.</li>
<li>Total every column and run the check row.</li>
<li>Only then read the stems.</li>
</ol>
<h2>Overlap formulas</h2>
<ul>
<li>At least one of two: n(A) plus n(B) minus n(both).</li>
<li>Neither: total minus at least one.</li>
<li>Only A: n(A) minus n(both).</li>
<li>At least one of three: the three singles, minus the three pairwise overlaps, plus the triple overlap.</li>
<li>Exactly one of three: the three singles, minus twice the three pairwise overlaps, plus three times the triple.</li>
<li>Exactly two of three: the three pairwise overlaps minus three times the triple.</li>
</ul>
<h2>Edge cases worth carrying in</h2>
<ul>
<li>A ratio given for a subgroup applies to that subgroup only. The 3 to 2 inside one centre says nothing about the split across all centres.</li>
<li>A percentage stated on a derived figure needs that figure written down first, or you will silently apply it to the row total.</li>
<li>Two relations that both pin the same cell are a gift, not a redundancy: use one to solve and the other to check.</li>
<li>A caselet with a total and no split, or a split and no total, is incomplete only if the stems ask for counts. Read the stems before deciding it is unsolvable.</li>
<li>Sanctioned plus rejected equals received is stated once and used in every row. Setters rely on candidates forgetting it by the third row.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question: "What is the first thing to do on meeting a caselet?",
        options: [
          "Read it twice at speed, then begin with the first question",
          "Convert every sentence into a simultaneous equation in two unknowns",
          "Find the largest number in the paragraph and treat it as the total",
          "Draw the grid the caselet describes and fill every cell you can before reading any question",
        ],
        answer: 3,
        explanation:
          "A caselet withholds the arrangement rather than the data, so the marks are paid for building the grid, and once the grid exists each question costs seconds. Reading it twice before starting feels careful but leaves you holding the same unarranged prose, and a second reading is exactly the time a candidate who wrote the grid on the first reading has already saved.",
        difficulty: "Easy",
        skill: "Converting a caselet into a table",
      },
      {
        n: 2,
        question:
          "Three centres opened 1250 accounts in all. Bhupalpally opened 25 percent more than Jangaon, and Wanaparthy opened 150 fewer than Bhupalpally. How many did Wanaparthy open?",
        options: ["300", "350", "400", "450"],
        answer: 1,
        explanation:
          "With Jangaon as J, the three totals are J, 1.25J and 1.25J minus 150, which sum to 3.5J minus 150 equal to 1250, so J is 400, Bhupalpally is 500 and Wanaparthy is 350. The tempting 400 is Jangaon, and it is what you write down if you solve for the unknown you named and then answer before returning to the stem to see which centre was asked about.",
        difficulty: "Medium",
        skill: "The unit method for ratios",
      },
      {
        n: 3,
        question:
          "Bhupalpally opened 500 accounts and Wanaparthy opened 350. By what percent did Bhupalpally exceed Wanaparthy?",
        options: ["30 percent", "37.5 percent", "42.86 percent", "50 percent"],
        answer: 2,
        explanation:
          "The excess is 150 and the base is the centre being exceeded, so 150 divided by 350 is three sevenths, which is 42.86 percent. The 30 percent option is 150 divided by 500, a correct calculation of the reverse relationship, namely by what percent Wanaparthy fell short of Bhupalpally, and the two are never equal.",
        difficulty: "Medium",
        skill: "Back calculation from a percentage",
      },
      {
        n: 4,
        question:
          "At Wanaparthy 40 percent of the 350 accounts were opened by women. At Jangaon 55 percent of the 400 accounts were opened by women. What is the ratio of men at Wanaparthy to women at Jangaon?",
        options: ["21 : 22", "22 : 21", "7 : 11", "6 : 7"],
        answer: 0,
        explanation:
          "Men at Wanaparthy are 60 percent of 350, that is 210, and women at Jangaon are 55 percent of 400, that is 220, so the ratio is 210 to 220, which is 21 to 22. The option 7 to 11 comes from taking women at Wanaparthy, 140, against the 220, which is the error of reading the column the caselet printed rather than the column the stem asked for, since the men's share had to be subtracted first.",
        difficulty: "Medium",
        skill: "Converting a caselet into a table",
      },
      {
        n: 5,
        question:
          "In a missing data table, June shows received 640 and rejected 256, July shows only sanctioned 495, August shows only received 720, and September shows only rejected 270. The set also states that August's sanction rate was five percentage points above June's. Which row do you complete first?",
        options: [
          "July, because it is the only row with a sanctioned figure printed",
          "September, because the last row fixes the column totals",
          "June, because it is completable from its own printed cells and August's rate is stated against it",
          "August, because its received figure is the largest",
        ],
        answer: 2,
        explanation:
          "June has two of the three cells printed, so it needs nothing from anywhere else, and completing it yields the 60 percent rate that August's relation depends on. Starting at July looks reasonable because a printed sanctioned figure feels like a foothold, but July needs its own stated rate to be located further down the set, and it unlocks no other row.",
        difficulty: "Medium",
        skill: "Order of solving a missing data table",
      },
      {
        n: 6,
        question:
          "July sanctioned 495 applications, and the sanction rate that month was 55 percent. How many applications were received in July?",
        options: ["850", "900", "950", "1100"],
        answer: 1,
        explanation:
          "If 495 is 55 percent of the applications received, the total is 495 divided by 0.55, which is 900, and the 405 rejections make up the remaining 45 percent. The 1100 option is 495 divided by 0.45, which is what you get by reading 55 percent as the rejection rate, and it is printed because that misreading survives every subsequent step without looking wrong.",
        difficulty: "Medium",
        skill: "Back calculation from a percentage",
      },
      {
        n: 7,
        question:
          "Of 300 aspirants, 180 finished the quantitative section, 150 finished the reasoning section and 60 finished both. How many finished neither?",
        options: ["30", "60", "90", "120"],
        answer: 0,
        explanation:
          "At least one is 180 plus 150 minus 60, that is 270, so 300 minus 270 leaves 30 who finished neither. The 120 option is the count who finished only quantitative, and it is the standard misread: the word neither sends candidates to the diagram, where they read off the first region that is not one of the printed totals.",
        difficulty: "Hard",
        skill: "Venn and set based caselets",
      },
      {
        n: 8,
        question:
          "Ninety seconds into a five question caselet you have found ratios throughout and no absolute count anywhere. What is the sound decision?",
        options: [
          "Continue, since a caselet always resolves once enough equations are written",
          "Assume a convenient total such as 100 and answer every question in the set, including those asking how many",
          "Mark the middle option on all five and move to the next set",
          "Leave the set, because without an anchor figure the ratios cannot become counts and the section is timed",
        ],
        answer: 3,
        explanation:
          "Ratios fix the shape of the data and never its size, so without one absolute count no stem asking for a number can be answered, and the time is better spent on a set that can be finished. Assuming a total of 100 is a real technique and works perfectly for stems asking for a ratio or a percentage, but applied to a stem asking how many it produces a figure with no basis, which is a wrong answer carrying a penalty rather than a blank carrying none.",
        difficulty: "Medium",
        skill: "Deciding when to leave a set",
      },
    ],
  },
  30715: {
    topicId: 30715,
    title: "Reading comprehension and its question types",
    summary:
      "A comprehension set is marked on what the passage supports and not on what you already believe about the subject, and nearly every wrong option in it is assembled from words that genuinely appear somewhere in the passage. You learn the question types the section actually sets, the order to attempt them in under a sectional clock, and the two distinctions that carry most of the marks: a stated fact against an inference, and the author's own view against a view the author is reporting.",
    concepts: [
      "Central idea and title",
      "Stated fact versus inference",
      "Author tone and attribution",
      "Question first reading order",
      "Detail location by scanning",
      "Synonym and antonym from the passage",
    ],
    glossary: {
      "Reading comprehension":
        "A passage followed by questions marked on what the passage establishes, not on what is true in the world. A statement can be perfectly correct and still be the wrong answer, because the passage never put it there.",
      Inference:
        "A statement the passage forces to be true without printing it in those words. It sits one short step from the text, and anything that needs a second step has stopped being an inference and become a guess.",
      Tone:
        "The author's stance towards the subject, carried by the adjectives, the verbs of attribution and what the author chooses to concede. In this section it is rarely extreme, because editorial prose is written to be defensible.",
      "Attributed opinion":
        "A view the passage reports as somebody else's, marked by phrases such as critics point out, supporters claim or the survey found. It is in the passage without being the author's, and whole questions are built on that difference.",
      Scanning:
        "Running the eye down the passage for one specific word, name or figure without reading the sentences around it. It is the opposite of skimming, which reads everything quickly for the drift and nothing closely.",
      "Lifted distractor":
        "A wrong option built out of words that do appear in the passage, often in a single line, rearranged to say something the passage does not. It reads familiar, which is precisely the effect it was written for.",
    },
    body: {
      Beginner: `<p>A <strong>comprehension</strong> question gives you a passage of a few paragraphs and then asks questions about it. The questions are not testing what you know about the subject. They are testing whether what you have said can be shown from the passage in front of you.</p>
<h2>The rule that decides most marks</h2>
<p>If an option is true in real life but the passage never says it, that option is wrong. If an option is something you disagree with but the passage clearly states it, that option is right. Answer from the paper, not from memory. This single rule is worth more than any vocabulary list.</p>
<h2>A short passage</h2>
<p>A self help group is a small savings group, usually of women from one village, who put in a fixed sum every month and lend it among themselves. Once the group has built a record of regular repayment, a bank will lend to the group as a whole rather than to each member separately. The bank saves the cost of assessing ten borrowers one by one, and the group takes on the work of deciding who is good for the money.</p>
<p>Question: why does the bank prefer to lend to the group?</p>
<ul>
<li><strong>Because it saves the cost of assessing each borrower separately.</strong> This is stated in the last sentence, in almost those words.</li>
<li>Because the group has more money than any one member. Sounds sensible, and the passage never says it.</li>
<li>Because the members are all women. The passage mentions women, but not as the bank's reason for anything.</li>
</ul>
<p>Notice the third option. It uses a word taken straight from the passage, which makes it feel familiar and correct. That is deliberate, and it is the commonest trap in the section.</p>
<h2>Words you will meet in the questions</h2>
<ul>
<li><strong>Infer</strong> means something the passage makes certain without printing it in those words.</li>
<li><strong>Tone</strong> means the writer's attitude: approving, critical, neutral, cautious.</li>
<li><strong>Central idea</strong> means what the whole passage is about, not what one paragraph is about.</li>
</ul>
<h2>How to read the passage</h2>
<p>Read it once, all the way through, at your normal speed. Do not stop at a word you do not know, because the sentence around it usually explains it. When you reach the end, say the passage back to yourself in one line. If you cannot, read only the first and last sentence of each paragraph again.</p>
<h2>What a wrong answer costs</h2>
<p>Each question carries one mark in prelims and a wrong answer takes away a quarter of a mark, while a blank takes away nothing. So a question whose answer you have located in a line of the passage is worth answering, and a question where two options both feel possible is worth leaving.</p>`,
      Intermediate: `<p>Read this practice passage once, at normal speed, before reading anything below it.</p>
<p>The agent led model of banking was introduced for villages where a full branch could never cover its own costs. An agent works on commission, carries little more than a handheld device, and opens accounts, accepts small deposits and pays out withdrawals on behalf of a bank whose nearest branch may be two hours away. Early evaluations of the model counted accounts opened, and by that measure it succeeded quickly. Later work asked a harder question. An account that has seen no transaction since the day it was opened costs the bank money to maintain and does the household no good at all, so a count of accounts opened says very little about whether banking has arrived. Attention has therefore shifted to the share of accounts in use, and to the distance a customer must travel to reach an agent who has cash in hand. Critics point out that the commission structure still rewards enrolment more reliably than it rewards service, and that until that changes the headline figures will continue to flatter the model.</p>
<h2>The types, and where each answer lives</h2>
<h3>Central idea</h3>
<p>The passage is about a change in what counts as success in agent led banking, from accounts opened to accounts used. A title such as the one about a failed model is wrong, because the passage records an early success and criticises only a measurement. The central idea has to cover the whole passage, so an option built on the last sentence alone is a detail wearing a title.</p>
<h3>Stated detail</h3>
<p>Why does an unused account cost the bank? Because the bank must maintain it while it does the household no good. That is in the fifth sentence and needs no reasoning at all. Detail questions are the cheapest marks in the set and should be answered first.</p>
<h3>Inference</h3>
<p>Which of these follows? That a rise in the number of accounts opened is not by itself evidence that banking has reached a household. The passage does not say that sentence, but it cannot be false given what the passage does say, and that is the test. An option saying the author wants agents paid a salary instead of a commission fails the test: the passage criticises what the commission rewards, and proposes nothing.</p>
<h3>Tone</h3>
<p>Critical and measured. The author credits the model with an early success, explains why the measure was poor, and reports a criticism without endorsing it in his own voice. Nothing here is sarcastic, and nothing is celebratory.</p>
<h3>Attribution</h3>
<p>The last sentence begins with critics point out. Everything in that sentence belongs to the critics, not to the author. A stem asking which statement is the author's own conclusion is answered by any of the earlier sentences and not by that one, and this is the type most often lost by candidates who agree with the critics.</p>
<h3>Vocabulary in the passage</h3>
<p>Flatter, as used here, means to present something more favourably than the facts warrant. The everyday sense of paying a compliment to a person is the wrong one, because the object in the passage is a set of figures. Substitute your candidate word into the sentence and read it back before you mark it.</p>
<h2>The order to work in</h2>
<ol>
<li>Read the question stems, not the options, so you know what you are reading for.</li>
<li>Read the passage once, end to end, without stopping at unfamiliar words.</li>
<li>Answer the detail and vocabulary questions, whose answers sit in one locatable line.</li>
<li>Answer the central idea and tone questions, which need the whole passage and are now easy.</li>
<li>Answer the inference questions last, testing each option against the text rather than against your own opinion.</li>
</ol>
<p>Reading the options along with the stems in step one is a mistake. Four options that you have already read start colouring your reading of the passage, and a lifted distractor becomes very hard to see once it has been planted in your memory before the passage was.</p>`,
      Advanced: `<p>At a second attempt the passage is not the obstacle. The obstacle is the option set, which is written by somebody who knows exactly which two options you will be left with, and the clock, which decides whether you reach the set at all.</p>
<h2>Why the set is attempted, and attempted second</h2>
<p>Eight or nine questions hang off one passage, so a single reading cost is shared across all of them. A grammar question shares nothing: each one is read separately and answered separately. That arithmetic, and not the relative difficulty, is what makes a comprehension set worth entering in a sectionally timed paper. It is attempted second because the cheaper question types settle your nerves and your pace first, and because a set entered with four minutes left is a set abandoned halfway.</p>
<h2>How the wrong option is manufactured</h2>
<table>
<thead><tr><th>Construction</th><th>What it looks like</th><th>The check that kills it</th></tr></thead>
<tbody>
<tr><td>Lifted distractor</td><td>Familiar words from one line, saying something the line does not</td><td>Find the line and read the whole sentence, not the phrase</td></tr>
<tr><td>True in the world</td><td>A correct fact about banking that the passage never raises</td><td>Ask which line you would point to if challenged</td></tr>
<tr><td>Extreme wording</td><td>All, never, only, must, entirely</td><td>Editorial prose concedes; an absolute claim rarely survives</td></tr>
<tr><td>Half right</td><td>The first clause is supported, the second is invented</td><td>Read to the end of the option, every option</td></tr>
<tr><td>Right answer to another stem</td><td>A statement that is the central idea, offered as an inference</td><td>Re-read what the stem asked for before marking</td></tr>
<tr><td>Attribution shift</td><td>A critic's claim offered as the author's conclusion</td><td>Look for point out, argue, claim, found</td></tr>
</tbody>
</table>
<h2>The one step rule for inference</h2>
<p>An inference option is admissible if you can name the sentence it comes from and the single move that gets you there: a negation, a substitution, a consequence the passage itself asserts. Two moves is a guess. Applied to the agent led passage: the passage says an unused account does the household no good, so an option saying accounts opened is a poor measure of inclusion is one move away and admissible, while an option saying the model should be replaced by branch banking needs a comparison the passage never makes.</p>
<h2>Choosing between two passages</h2>
<p>The main examination sets more than one set and they are not equal. Spend twenty seconds on the first paragraph of each. Prefer the passage whose subject you can already name, whose paragraphs are short, and whose questions include three or more detail and vocabulary stems. Avoid the passage that is a chain of arguments with no data in it, because in that kind every stem turns into an inference stem regardless of what it is labelled.</p>
<h2>What the mains variant adds</h2>
<ul>
<li>Longer passages, with the questions no longer following the order of the passage. Scanning becomes the skill rather than sequential reading.</li>
<li>Stems on the author's purpose in a specific paragraph, which are answered by what the paragraph does in the argument, not by what it says.</li>
<li>Vocabulary asked as which of these words is closest in meaning as used in the passage, where the register matters as much as the meaning.</li>
<li>A statement based stem giving three numbered statements, where you must judge each independently before looking at the combinations offered.</li>
</ul>
<h2>Discipline that saves marks</h2>
<ul>
<li>Never answer a detail question from memory of the passage. Locate the line. It takes eight seconds and removes an entire class of error.</li>
<li>When two options survive, the difference between them is one word. Find that word and settle the question on it alone.</li>
<li>If you find yourself arguing for an option, you have left the passage. The correct answer needs pointing at, not defending.</li>
<li>A question you leave blank costs nothing, and in this section two carefully chosen blanks routinely outscore four brave attempts.</li>
</ul>`,
      Expert: `<p>Recall sheet for the last month. Retrieval, not derivation.</p>
<h2>Naming the tone from what the author does</h2>
<table>
<thead><tr><th>What the author does</th><th>Tone word to look for</th></tr></thead>
<tbody>
<tr><td>Reports both sides, then judges</td><td>Analytical, balanced</td></tr>
<tr><td>Concedes a point, then objects</td><td>Critical, qualified</td></tr>
<tr><td>Argues for a change</td><td>Persuasive, prescriptive</td></tr>
<tr><td>Records without judging</td><td>Descriptive, objective, neutral</td></tr>
<tr><td>Warns of a consequence</td><td>Cautionary</td></tr>
<tr><td>Praises with reservations</td><td>Appreciative but guarded</td></tr>
<tr><td>Says the opposite of what is meant</td><td>Ironic, and rare in this section</td></tr>
</tbody>
</table>
<h2>Order of work on any set</h2>
<ol>
<li>Skim the stems. Mark each one D for detail, V for vocabulary, C for central idea, T for tone, I for inference.</li>
<li>Read the passage once, end to end.</li>
<li>Answer D and V, locating a line for each.</li>
<li>Answer C and T from the whole passage.</li>
<li>Answer I last, one move from a named sentence.</li>
</ol>
<h2>Two line rules</h2>
<ul>
<li>True in the world and unsupported by the passage is a wrong answer. Every time.</li>
<li>Point out, argue, claim, contend and found mark somebody else's view. The author's view is what is left.</li>
<li>An absolute word in an option is a reason to doubt it, since editorial prose concedes.</li>
<li>The central idea covers every paragraph. An option built from one paragraph is a detail.</li>
<li>A vocabulary option is tested by substitution into the sentence, not by a remembered dictionary sense.</li>
<li>If two options survive, one word separates them. Find the word, not a better feeling.</li>
</ul>
<h2>Edge cases worth carrying in</h2>
<ul>
<li>A question asking what would weaken the author's position needs the author's position stated in your own words first, or you will weaken the critics instead.</li>
<li>Except and not true stems reverse the marking. Answer the ordinary question first, then take the option left over.</li>
<li>A synonym stem can have two options with the same dictionary meaning and different registers. The formal one belongs in editorial prose.</li>
<li>Where the questions do not follow the order of the passage, scan for the proper noun or figure in the stem rather than re-reading from the top.</li>
<li>A passage with no data in it turns every stem into an inference stem. Recognise it in the first paragraph and price the set accordingly.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "For the passage on agent led banking, which is the best title?",
        options: [
          "The agent who replaced the branch",
          "Why village banking has failed",
          "The commission structure of rural banking",
          "From accounts opened to accounts used",
        ],
        answer: 3,
        explanation:
          "The passage traces a shift in the measure of success, from counting accounts opened to counting accounts in use, and that shift is present in every part of it. The failure title is the attractive wrong one because the passage does criticise the model, but it also records that the model succeeded on the early measure, and a title cannot contradict a sentence of the passage it heads.",
        difficulty: "Easy",
        skill: "Central idea and title",
      },
      {
        n: 2,
        question: "Which of the following can be inferred from the passage?",
        options: [
          "A rise in the number of accounts opened is not by itself evidence that banking has reached a household",
          "The author believes agents should be paid a fixed salary rather than a commission",
          "Banks have stopped opening accounts through agents",
          "Every account opened through an agent remains unused",
        ],
        answer: 0,
        explanation:
          "The passage states that an unused account does the household no good and that a count of accounts opened says very little about whether banking has arrived, so the option denying that accounts opened is by itself evidence of reach sits one short step from the text. The salary option is tempting because the passage does criticise what the commission rewards, but criticising an incentive is not proposing a replacement for it, and the passage proposes nothing.",
        difficulty: "Medium",
        skill: "Stated fact versus inference",
      },
      {
        n: 3,
        question: "What is the tone of the passage?",
        options: [
          "Indifferent",
          "Sarcastic",
          "Critical but measured",
          "Celebratory",
        ],
        answer: 2,
        explanation:
          "The author credits the model with an early success, explains carefully why that measure of success was weak, and reports a criticism in somebody else's voice, which is criticism kept within its evidence. Sarcastic is the tempting choice because the closing word flatter carries an edge, but sarcasm requires the writer to mean the opposite of what is written, and every other sentence here is meant exactly as it stands.",
        difficulty: "Medium",
        skill: "Author tone and attribution",
      },
      {
        n: 4,
        question:
          "In the passage, the word flatter is closest in meaning to which of the following?",
        options: [
          "To make something appear better than it is",
          "To praise a person insincerely",
          "To exaggerate a loss",
          "To conceal a transaction",
        ],
        answer: 0,
        explanation:
          "The object of the verb in the passage is the headline figures, so the sense required is that of presenting something more favourably than the facts warrant. Praising a person insincerely is the everyday sense and is the wrong one here purely because of the object: figures cannot be complimented, and a vocabulary option is tested by reading it back into the sentence.",
        difficulty: "Medium",
        skill: "Synonym and antonym from the passage",
      },
      {
        n: 5,
        question:
          "According to the passage, why is an account that has seen no transaction a problem?",
        options: [
          "Because the agent's commission on it has to be repaid",
          "Because the customer lives two hours from the nearest branch",
          "Because the regulator penalises banks for dormant accounts",
          "Because the bank must maintain it while it does the household no good",
        ],
        answer: 3,
        explanation:
          "The passage states in one sentence that such an account costs the bank money to maintain and does the household no good at all, so the answer is located rather than reasoned. The two hour option is a lifted distractor: that phrase does appear in the passage, but it describes the distance to a branch and is offered as a reason for nothing.",
        difficulty: "Easy",
        skill: "Detail location by scanning",
      },
      {
        n: 6,
        question:
          "Which statement does the passage attribute to critics rather than assert as the author's own conclusion?",
        options: [
          "An unused account costs the bank money to maintain",
          "The commission structure rewards enrolment more reliably than service",
          "Early evaluations of the model counted accounts opened",
          "An agent works on commission and carries a handheld device",
        ],
        answer: 1,
        explanation:
          "The final sentence opens with critics point out, which hands ownership of everything that follows it to the critics, while the other three statements are made by the author directly. This is the type most often lost by a candidate who agrees with the criticism and therefore stops noticing whose sentence it is, and stems in this section are written specifically to test that distinction.",
        difficulty: "Hard",
        skill: "Author tone and attribution",
      },
      {
        n: 7,
        question:
          "A prelims English section is sectionally timed and prints one comprehension set of eight questions among thirty. What is the sound order of work on the set?",
        options: [
          "Read the passage twice slowly, then attempt all eight in the printed order",
          "Skip the passage entirely, since a set can never be completed inside a sectional clock",
          "Skim the stems, read the passage once end to end, then answer the located questions before those needing the whole passage",
          "Answer the central idea question first, because it settles every other answer",
        ],
        answer: 2,
        explanation:
          "Skimming the stems tells you what to read for, one reading is enough to answer detail and vocabulary questions by location, and the whole passage questions are easier once several lines have already been located. Answering the central idea first is the tempting order because it feels foundational, but it is the stem that needs the most of the passage in hand, and getting it wrong early puts a wrong frame around the seven questions that follow.",
        difficulty: "Medium",
        skill: "Question first reading order",
      },
    ],
  },
};

export default PART;
