/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 3.
 *
 * Topics 30706 to 30709: the arithmetic word problem families that repeat in
 * every prelims cycle, the quadratic comparison and quantity format, and the
 * first two rungs of the data interpretation module, tabular and graphical
 * sets first and then caselet and missing data sets.
 *
 * Every worked calculation in this file has been run through to the number it
 * claims, because a candidate who can do the arithmetic will check it. Exam
 * mechanics are stated as they are set: prelims is sectionally timed, a wrong
 * answer costs a quarter of the marks that question carries, and the prelims
 * score does not enter the final merit list. No vacancy count, cut-off mark,
 * fee or examination date is stated as current fact.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30706: {
    topicId: 30706,
    title: "The arithmetic word problems that repeat every cycle",
    summary:
      "Percentage, ratio, average, work, motion and commercial arithmetic supply about a third of the prelims quantitative section, and the same handful of set-ups returns every cycle with only the numbers changed. You learn each one as a method that survives a twenty minute clock, with the shortcut written out, the arithmetic carried to the answer, and the point at which the shortcut stops being safe.",
    concepts: [
      "Percentage as a multiplier",
      "Ratio, proportion and alligation",
      "Averages and ages",
      "Time and work by unit efficiency",
      "Time, speed and distance",
      "Profit, discount and interest",
    ],
    glossary: {
      Multiplier:
        "The single number a quantity is multiplied by to apply a percentage change, so a rise of 12 percent is 1.12 and a fall of 12 percent is 0.88. Changes that follow one another are multiplied together and never added.",
      "Unitary method":
        "Reducing a statement to the value of one unit, one day, one kilogram or one worker, so that any other quantity can be scaled up from it by a single multiplication.",
      Alligation:
        "A rule for two ingredients of different rates mixed to a known mean rate. The two quantities come out in the inverse ratio of the distances of each rate from that mean, which settles a mixture question without setting up any algebra.",
      "Relative speed":
        "The speed of one moving body as measured from another. It is the sum of the two speeds when they approach or pass in opposite directions, and the difference when they travel the same way, which is why a stream is added going down and subtracted coming up.",
      "Marked price":
        "The price written on the label, and the amount a discount is taken from. Profit is measured against cost price instead, so a discount percentage and a profit percentage rest on two different bases and cannot be added or subtracted.",
      Compounding:
        "Charging interest on interest already credited. Across two years it adds exactly one year of interest on the first year's interest to the simple interest total, and that single amount is the whole difference between the two schemes over that period.",
    },
    body: {
      Beginner: `<p>An arithmetic word problem is a short story with numbers in it. Nobody hands you the equation. You read three or four lines, work out what is being asked for, and build the arithmetic yourself. These questions repeat cycle after cycle in the same shapes, which is why they reward being learnt properly once instead of being met freshly every time.</p>
<h2>The families that keep coming back</h2>
<ul>
<li><strong>Percentage</strong>: a share written out of a hundred, so 20 percent means twenty parts in every hundred.</li>
<li><strong>Ratio</strong>: two quantities compared by division, so 5 to 4 means five parts of a thing set against four parts of the same thing.</li>
<li><strong>Average</strong>: the total shared out equally. Add the values, then divide by how many values there are.</li>
<li><strong>Time and work</strong>: how long a job takes when more than one person is on it.</li>
<li><strong>Time, speed and distance</strong>: trains crossing platforms, boats going with and against a stream.</li>
<li><strong>Buying and selling</strong>: cost price, selling price, discount, and what money in a deposit earns.</li>
</ul>
<h2>Treat a percentage as something you multiply by</h2>
<p>A rise of 20 percent is the same as multiplying by 1.2. A fall of 25 percent is the same as multiplying by 0.75. Once you think in this way, two changes one after the other stop being confusing.</p>
<p>A shop raises the price of a saree by 20 percent and later cuts it by 25 percent. Most readers answer that the price ended 5 percent lower. Put a real number in. The saree cost ₹800, so after the rise it is 800 x 1.2, which is ₹960, and after the cut it is 960 x 0.75, which is ₹720. From ₹800 to ₹720 is a fall of ₹80, and 80 out of 800 is 10 percent. The two percentages were taken on different amounts, so they could never simply be subtracted.</p>
<h2>Turn work into units instead of fractions</h2>
<p>Ravi paints a room in 12 days and Sita paints the same room in 18 days. Do not begin with one twelfth and one eighteenth. Call the whole job 36 units, because 36 is the smallest number that both 12 and 18 divide into. Ravi then does 36 divided by 12, that is 3 units a day, and Sita does 36 divided by 18, that is 2 units a day. Together they do 5 units a day, so the room takes 36 divided by 5, which is 7.2 days.</p>
<h2>Carry this out of the lesson</h2>
<ul>
<li>Read the question twice and write down what is asked before you calculate anything.</li>
<li>A percentage is a multiplier, not something you add and take away.</li>
<li>In a work question, make the job a number of units.</li>
<li>Check at the end that your answer is the quantity that was asked for and not a useful number you found on the way.</li>
</ul>`,
      Intermediate: `<p>Take the families in the order in which they support one another. Percentage and ratio sit underneath almost everything else, so they come first, then work, then motion, then the commercial arithmetic that a banking paper is fond of.</p>
<h2>Percentage, set up as one equation</h2>
<p>A candidate scoring 35 percent of the total falls 40 marks short of the pass mark. Another scoring 52 percent finishes 45 marks above it. Find the total.</p>
<p>Both statements describe the same pass mark, so the gap between the two scores is 52 minus 35, that is 17 percent of the total, and in marks that same gap is 40 plus 45, that is 85. So 17 percent of the total is 85, one percent is 5, and the total is 500. The pass mark follows: 35 percent of 500 is 175, and 175 plus 40 is 215. Test it against the second statement, where 52 percent of 500 is 260 and 260 minus 45 is 215.</p>
<h2>Ratio with two conditions</h2>
<p>Two officers have incomes in the ratio 5 to 4 and expenditures in the ratio 3 to 2, and each of them saves ₹9,000 a month. What does the first earn?</p>
<p>Write the incomes as 5x and 4x and the expenditures as 3y and 2y, because two separate ratios have no reason to share a multiplier. Then 5x minus 3y is 9,000 and 4x minus 2y is 9,000. Halve the second to get 2x minus y equal to 4,500, so y is 2x minus 4,500. Put that into the first: 5x minus 6x plus 13,500 is 9,000, so x is 4,500. The incomes are ₹22,500 and ₹18,000, the expenditures are ₹13,500 and ₹9,000, and both savings come to ₹9,000 as stated.</p>
<h2>Work, counted as units a day</h2>
<p>A and B together finish a job in 12 days, B and C in 15 days, C and A in 20 days. Take the job as 60 units, the smallest number all three divide. The pairs then work at 5, 4 and 3 units a day. Adding those three rates gives 12 units a day, but that has counted every worker twice, so the three together do 6 units a day and finish in 10 days. Subtract to get the individuals: A is 6 minus 4, that is 2 units a day and 30 days alone; B is 6 minus 3, that is 3 units and 20 days; C is 6 minus 5, that is 1 unit and 60 days.</p>
<h2>Motion, with the length of the train counted in</h2>
<p>A train 180 metres long runs at 72 km an hour and crosses a platform 270 metres long. Convert once, multiplying by 5 and dividing by 18, so 72 km an hour is 20 metres a second. The train must clear its own length as well as the platform, so the distance is 450 metres and the time is 450 divided by 20, that is 22.5 seconds.</p>
<p>Now a boat whose speed in still water is 12 km an hour on a stream of 3 km an hour. Downstream it makes 15 and upstream 9. For 45 km each way the time is 45 by 15 plus 45 by 9, that is 3 hours plus 5 hours, so 8 hours. The average speed over the round trip is 90 divided by 8, which is 11.25 km an hour and not 12: a there-and-back trip always averages below the still water speed, because more of the time is spent in the slow direction.</p>
<h2>Commercial arithmetic</h2>
<p>A trader marks goods 40 percent above cost and then allows a discount of 25 percent. The multipliers are 1.4 and 0.75, and 1.4 x 0.75 is 1.05, so the sale still returns a profit of 5 percent. If that profit works out to ₹105, the cost price is ₹2,100 and the selling price is ₹2,205.</p>
<p>Mixtures answer to alligation. Rice at ₹40 a kg is mixed with rice at ₹55 a kg to be sold at ₹46 a kg. The distances from the mean are 55 minus 46, that is 9, and 46 minus 40, that is 6. The quantities come in the inverse order of those distances, 9 to 6, which is 3 parts of the cheaper rice to 2 parts of the dearer.</p>`,
      Advanced: `<p>Your difficulty in this section is not method, it is selection. Twenty minutes, thirty five questions, and this family sits between the pure calculation questions and a data interpretation set that will eat six minutes on its own. The marks come from knowing within fifteen seconds of reading a question whether it is a one-line set-up or a two-variable one.</p>
<h2>Read the set-up, then decide</h2>
<table>
<thead><tr><th>Set-up you recognise</th><th>Decision</th></tr></thead>
<tbody>
<tr><td>One unknown, one condition (percentage of a total, single ratio)</td><td>Attempt at once, under 40 seconds</td></tr>
<tr><td>Work with two or three agents, times given</td><td>Attempt on the unit method, about 50 seconds</td></tr>
<tr><td>Train and platform, one train</td><td>Attempt, the conversion is the whole question</td></tr>
<tr><td>Two trains passing, both lengths and both speeds</td><td>Attempt only if the second pass through the section leaves time</td></tr>
<tr><td>Ages with three conditions across two points in time</td><td>Leave it in prelims, it is a mains length question</td></tr>
<tr><td>Partnership with capital withdrawn mid year</td><td>Leave it unless the months are round numbers</td></tr>
</tbody>
</table>
<h2>The traps that take marks off prepared candidates</h2>
<ul>
<li><strong>The base moves.</strong> A fall of 10 percent needs a rise of 11.11 percent to get back, because the rise is taken on the reduced amount. The general form is n divided by (100 minus n).</li>
<li><strong>Discount and profit have different bases.</strong> A discount is taken on the marked price, profit is measured on cost. A question that gives a 20 percent discount and a 20 percent profit is not describing a cancellation.</li>
<li><strong>Efficiency is the inverse of time only for equal work.</strong> If A is twice as fast as B, A takes half the time on the same job. The moment the two are doing different amounts of work the inversion is wrong and you must go back to units.</li>
<li><strong>Average speed is not the average of the speeds</strong> unless the time in each leg is equal. For equal distances use twice the product over the sum, which for 15 and 9 gives 270 divided by 24, that is 11.25.</li>
<li><strong>The one extra member shortcut.</strong> When a person joins a group and the average rises, that person's value is the new average plus the number of old members times the rise. Thirty trainees averaging 22 years, joined by a trainer, average 23: the trainer is 23 plus 30, that is 53.</li>
</ul>
<h2>Two shortcuts and where each one stops</h2>
<p><strong>Repeated replacement.</strong> Remove 8 litres from a 40 litre vessel of milk and top it up with water, then do it again. The milk left is 40 times four fifths squared, that is 40 x 0.64, which is 25.6 litres. The formula holds only when the vessel is properly mixed before each draw, the same volume is removed each time, and the top-up is pure water. Change any of those and it fails, and a paper that says the second draw was 10 litres has changed exactly that.</p>
<p><strong>Compound interest difference.</strong> Over two years the difference between compound and simple interest is the principal times the square of the rate in hundredths. On ₹20,000 at 10 percent that is 20,000 x 0.01, which is ₹200, and you can see it directly as one year of interest on the first year's interest of ₹2,000. Over three years the difference is larger and no longer a single square, and the moment compounding turns half yearly you must halve the rate and double the periods before any shortcut applies.</p>
<h2>Marginal marks</h2>
<p>A blind guess among four options is worth one quarter of a mark won against three quarters of a quarter mark lost, which is plus 0.0625 marks. The penalty is not the reason to stop guessing. The forty seconds is. Attempting one more set-up you actually recognise is worth sixteen blind guesses, and in a sectionally timed paper the clock closes on you whether or not the guesses were placed.</p>`,
      Expert: `<p>Recall sheet for the last month. Everything below is either a conversion you should be able to do without writing, or a rule that should fire on sight of the set-up.</p>
<h2>Fractions as percentages, up to a twentieth</h2>
<table>
<thead><tr><th>Fraction</th><th>Percentage</th><th>Fraction</th><th>Percentage</th></tr></thead>
<tbody>
<tr><td>1/2</td><td>50</td><td>1/9</td><td>11.11</td></tr>
<tr><td>1/3</td><td>33.33</td><td>1/11</td><td>9.09</td></tr>
<tr><td>1/4</td><td>25</td><td>1/12</td><td>8.33</td></tr>
<tr><td>1/6</td><td>16.67</td><td>1/13</td><td>7.69</td></tr>
<tr><td>1/7</td><td>14.29</td><td>1/15</td><td>6.67</td></tr>
<tr><td>1/8</td><td>12.5</td><td>1/16</td><td>6.25</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Successive changes: multiply the multipliers. Up a fifth then down a quarter is 1.2 x 0.75, that is 0.9.</li>
<li>Return to base after a fall of n percent: rise of n over (100 minus n). After a fall of 20 percent you need 25 percent.</li>
<li>Work: job equals the LCM of the times. Rate equals job divided by time. Pairs added twice must be halved.</li>
<li>km an hour to metres a second: times 5 over 18. Metres a second to km an hour: times 18 over 5.</li>
<li>Crossing: a pole costs the train its own length, a platform costs length plus platform.</li>
<li>Boat: downstream is still plus stream, upstream is still minus stream. Still water speed is half the sum, stream is half the difference.</li>
<li>Equal distances, two speeds: average is 2ab over (a plus b).</li>
<li>Alligation: quantities are in the inverse ratio of the distances from the mean. The mean must lie between the two rates or the question is impossible.</li>
<li>Replacement: original left equals V times ((V minus x) over V) to the power of the number of draws.</li>
<li>Mark-up m and discount d as multipliers: profit multiplier is (1 plus m) times (1 minus d).</li>
<li>Compound minus simple over two years: P times the rate in hundredths, squared.</li>
</ul>
<h2>Checklist for the last fortnight</h2>
<ol>
<li>Time yourself on ten mixed word problems and record only the ones that ran past 60 seconds. Those are the set-ups to drill, not the ones you got wrong.</li>
<li>Rewrite your five slowest set-ups as unit method solutions and see whether the fractions were the delay.</li>
<li>Do one page of percentage to fraction conversion daily until 1/13 and 1/16 come without pause.</li>
<li>Check that every answer you write is the asked quantity: the profit and not the selling price, the stream and not the downstream speed, the individual and not the pair.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A shopkeeper raises the price of a mixer by 25 percent and then offers a discount of 20 percent on the raised price. What is the net change in price?",
        options: [
          "A rise of 5 percent",
          "No change at all",
          "A fall of 5 percent",
          "A rise of 10 percent",
        ],
        answer: 1,
        explanation:
          "Apply the changes as multipliers: 1.25 x 0.80 = 1.00, so the price returns exactly to where it started. The tempting answer is a rise of 5 percent, got by subtracting 20 from 25, but the two percentages sit on different amounts, the 25 on the old price and the 20 on the raised one.",
        difficulty: "Medium",
        skill: "Percentage as a multiplier",
      },
      {
        n: 2,
        question:
          "The incomes of two officers are in the ratio 5 to 4 and their expenditures are in the ratio 3 to 2. Each saves ₹9,000 a month. What is the income of the first officer?",
        options: ["₹18,000", "₹22,500", "₹20,000", "₹27,000"],
        answer: 1,
        explanation:
          "Take incomes as 5x and 4x and expenditures as 3y and 2y. Then 5x minus 3y is 9,000 and 4x minus 2y is 9,000, which solve to x equal to 4,500, so the first income is ₹22,500. The tempting ₹18,000 is the second officer's income, which is the answer to a question that was not asked.",
        difficulty: "Hard",
        skill: "Ratio, proportion and alligation",
      },
      {
        n: 3,
        question:
          "A and B together finish a job in 12 days, B and C in 15 days, and C and A in 20 days. How long do all three take working together?",
        options: ["5 days", "10 days", "9 days", "12 days"],
        answer: 1,
        explanation:
          "Take the job as 60 units, so the pairs work at 5, 4 and 3 units a day and the three rates add to 12. That total counts each worker twice, so the trio does 6 units a day and takes 10 days. The tempting 5 days comes from dividing 60 by 12 without halving, which quietly puts two of every worker on the job.",
        difficulty: "Medium",
        skill: "Time and work by unit efficiency",
      },
      {
        n: 4,
        question:
          "A train 180 metres long running at 72 km an hour crosses a platform 270 metres long. How long does it take?",
        options: ["9 seconds", "22.5 seconds", "13.5 seconds", "25 seconds"],
        answer: 1,
        explanation:
          "72 km an hour is 72 x 5 over 18, that is 20 metres a second, and the train must clear 180 plus 270, that is 450 metres, so the time is 22.5 seconds. The tempting 13.5 seconds uses only the 270 metre platform and forgets that the last coach is still on it until the train has also moved its own length.",
        difficulty: "Medium",
        skill: "Time, speed and distance",
      },
      {
        n: 5,
        question:
          "A trader marks his goods 40 percent above cost price and then allows a discount of 25 percent on the marked price. What is his profit percentage?",
        options: ["15 percent", "10 percent", "5 percent", "4 percent"],
        answer: 2,
        explanation:
          "The selling price is 1.40 x 0.75 of cost, that is 1.05 of cost, so the profit is 5 percent. The tempting 15 percent comes from subtracting the discount from the mark-up, which ignores that the mark-up is taken on cost while the discount is taken on the larger marked price.",
        difficulty: "Medium",
        skill: "Profit, discount and interest",
      },
      {
        n: 6,
        question:
          "From a vessel holding 40 litres of milk, 8 litres are drawn off and replaced with water. The same operation is performed once more. How much milk remains?",
        options: ["24 litres", "25.6 litres", "26.4 litres", "28.8 litres"],
        answer: 1,
        explanation:
          "After each operation the milk is multiplied by 32 over 40, that is four fifths, so after two operations it is 40 x 0.64, which is 25.6 litres. The tempting 24 litres subtracts 8 litres twice, which would be right only if the second draw were pure milk, but by then the vessel holds a mixture and the second draw removes water as well.",
        difficulty: "Hard",
        skill: "Ratio, proportion and alligation",
      },
      {
        n: 7,
        question:
          "The average age of 30 trainees at a skill centre is 22 years. When the trainer's age is included, the average rises to 23 years. How old is the trainer?",
        options: ["45 years", "52 years", "53 years", "55 years"],
        answer: 2,
        explanation:
          "The trainer must carry the new average plus one extra year for each of the 30 trainees, so the age is 23 plus 30, that is 53. Checking it, 30 x 22 is 660 and 31 x 23 is 713, and the difference is 53. The tempting 52 uses the old average of 22 in the shortcut, which leaves the trainer's own share of the rise unaccounted.",
        difficulty: "Medium",
        skill: "Averages and ages",
      },
      {
        n: 8,
        question:
          "What is the difference between the compound interest and the simple interest on ₹20,000 for two years at 10 percent a year, compounded annually?",
        options: ["₹100", "₹200", "₹400", "₹420"],
        answer: 1,
        explanation:
          "Simple interest is ₹4,000 while compound interest is 20,000 x 1.21 minus 20,000, that is ₹4,200, so the difference is ₹200, which is exactly one year of interest on the first year's interest of ₹2,000. The tempting ₹400 takes 10 percent of the whole ₹4,000, which charges interest on the second year's interest as well, and that has not been earned yet.",
        difficulty: "Hard",
        skill: "Profit, discount and interest",
      },
    ],
  },
  30707: {
    topicId: 30707,
    title: "Quadratic comparison and quantity questions",
    summary:
      "A quadratic comparison set gives you two equations and asks only how the roots of the first stand against the roots of the second, which makes it the most mechanical five marks in the prelims quantitative section. You learn to factorise by sum and product, to read the sign of the roots before you factorise, to settle the comparison from the smallest and largest values, and to handle the quantity format that replaces this set in mains.",
    concepts: [
      "Sum and product factorisation",
      "Sign rule for roots",
      "Comparing two root sets",
      "The no relation case",
      "Equal roots and boundary cases",
      "Quantity I and Quantity II",
    ],
    glossary: {
      Root: "A value of the variable that makes the equation come out to zero. A quadratic carries two of them, and a comparison question always asks about both together, never about one of them alone.",
      "Sum and product rule":
        "For an equation in the form x squared plus bx plus c, the two roots add up to minus b and multiply to c. Hunting for the pair that satisfies both conditions is faster than any formula and is the whole technique.",
      Discriminant:
        "The value of b squared minus 4ac. It settles, before you attempt any factorisation, whether the equation has two separate roots, one repeated root, or no real root at all, and whether integer factors exist.",
      "No relation":
        "The verdict when one root of the first equation falls below a root of the second while another root of the first rises above it, so no single inequality covers every pairing. It is an answer in its own right, not an admission of defeat.",
      "Common root":
        "A value that appears in both root sets. Its presence rules out a strict greater than or less than and forces the answer to be one of the two options that carry an equality.",
      "Quantity comparison":
        "The mains format in which two or three independent quantities are computed from separate statements and only their order is reported. The arithmetic is ordinary word problem arithmetic, so the marks lie in finishing both quantities without a slip rather than in any special technique.",
    },
    body: {
      Beginner: `<p>A quadratic equation is one in which the unknown appears squared, such as x squared minus 15x plus 56 equals zero. Because of that square it has two answers rather than one, and both of them count. In this examination two such equations are set side by side, one written in x and one in y, and you are asked only how x stands against y. The five options repeat in every set: x is greater than y, x is less than y, x is greater than or equal to y, x is less than or equal to y, or no relation can be established.</p>
<h2>Finding the two roots</h2>
<p>Take x squared minus 15x plus 56 equals zero. Look for two numbers that multiply to 56 and add to 15. Try 7 and 8, because 7 times 8 is 56 and 7 plus 8 is 15. The equation then breaks into (x minus 7) times (x minus 8) equals zero, and a product is zero only when one of its parts is zero, so x is 7 or x is 8.</p>
<p>Check one of them before you trust it. Putting 7 in gives 49 minus 105 plus 56, which is zero, so 7 is genuinely a root.</p>
<h2>Comparing the two sets</h2>
<p>Suppose the second equation is y squared minus 13y plus 42 equals zero. Two numbers that multiply to 42 and add to 13 are 6 and 7, so y is 6 or y is 7.</p>
<p>Now line them up. The values of x are 7 and 8. The values of y are 6 and 7. Take the smallest x, which is 7, and the largest y, which is 7. They are equal. So no value of x is ever below a value of y, but they can meet, and the answer is that x is greater than or equal to y. It is not simply greater than, because 7 and 7 are the same number.</p>
<h2>Why this set is worth your time</h2>
<p>There is nothing to read, nothing to convert and no diagram. The same procedure works on every question in the set, and once you can factorise quickly the five questions take about half a minute each. In a section where the clock closes on you after twenty minutes, a block of questions that needs no thinking about method is the safest place to bank marks.</p>
<h2>The habit to build</h2>
<ul>
<li>Write down both roots of each equation, never just the one you spotted first.</li>
<li>Compare the smallest x with the largest y, then the largest x with the smallest y.</li>
<li>If any pair of values is equal, the answer will carry an equal sign in it.</li>
<li>If one x sits below a y while another x sits above a y, then no relation can be established, and that option is correct rather than a way of giving up.</li>
</ul>`,
      Intermediate: `<p>Work the set in a fixed order every time: standard form, sign of the roots, factors, then comparison. Doing the four steps in that order is what keeps a set of five to about three minutes.</p>
<h2>Step one, standard form</h2>
<p>Papers rarely hand you the equation tidy. You may be given x squared equals 16x minus 63, and you must move everything to one side to get x squared minus 16x plus 63 equals zero before anything else is safe. Only then do the sum and the product mean what you expect: the roots here add to 16 and multiply to 63, which is 7 and 9.</p>
<h2>Step two, the sign of the roots before the factors</h2>
<p>The constant term and the middle term settle the signs on sight. If the constant is positive, the roots share a sign, and that sign is the opposite of the middle term's sign: x squared plus 11x plus 30 has both roots negative, while x squared minus 11x plus 30 has both positive. If the constant is negative, the roots have opposite signs. Knowing this before you hunt for factors saves the commonest error in the set, which is finding the right pair of numbers and then writing them with the wrong signs.</p>
<h2>Step three, factors when the leading coefficient is not one</h2>
<p>For 2x squared minus 11x plus 15 equals zero, multiply the first and last coefficients: 2 times 15 is 30. Now split the middle term into two numbers that multiply to 30 and add to minus 11, which are minus 6 and minus 5. Rewrite as 2x squared minus 6x minus 5x plus 15, group into 2x(x minus 3) minus 5(x minus 3), and read off (2x minus 5)(x minus 3). So x is 2.5 or 3.</p>
<p>Do the second equation the same way. For 2y squared minus 7y plus 6 equals zero, the product is 12 and the split is minus 4 and minus 3, giving (2y minus 3)(y minus 2), so y is 1.5 or 2.</p>
<h2>Step four, the comparison itself</h2>
<p>Compare the extremes, not all four pairs. If the smallest x is above the largest y, then x is greater than y for every pairing. Here the smallest x is 2.5 and the largest y is 2, so x is greater than y and you are done in one comparison. If instead the smallest x had equalled the largest y, the answer would carry an equality. If neither extreme test settles it, the ranges overlap in both directions and no relation can be established.</p>
<table>
<thead><tr><th>What you find</th><th>Answer to mark</th></tr></thead>
<tbody>
<tr><td>Smallest x above largest y</td><td>x is greater than y</td></tr>
<tr><td>Smallest x equal to largest y</td><td>x is greater than or equal to y</td></tr>
<tr><td>Largest x below smallest y</td><td>x is less than y</td></tr>
<tr><td>Largest x equal to smallest y</td><td>x is less than or equal to y</td></tr>
<tr><td>Some x below a y and some x above a y</td><td>No relation can be established</td></tr>
</tbody>
</table>
<h2>The quantity format in mains</h2>
<p>Mains drops the paired equations and sets two quantities instead, each computed from its own statement, and asks only for their order. Quantity I: the simple interest on ₹12,000 at 8 percent a year for two years. Quantity II: the profit made on an article costing ₹7,500 and sold at a profit of 24 percent. The first is 12,000 x 0.08 x 2, that is ₹1,920. The second is 7,500 x 0.24, that is ₹1,800. So Quantity I is greater than Quantity II.</p>
<p>Nothing about that pair is a quadratic. The format is a container, and what it holds is ordinary arithmetic from the families you already know, set twice over. The risk it carries is that a single slip in either quantity gives a confidently wrong order.</p>`,
      Advanced: `<p>You can already factorise. What separates a full five from a shaky three in this set is the handful of shapes that are built to be misread, and the discipline of not spending ninety seconds on the one equation that refuses to break into integers.</p>
<h2>The traps, in the order they cost marks</h2>
<ul>
<li><strong>Signs on negative roots.</strong> For x squared plus 11x plus 30 the roots are minus 5 and minus 6, and for y squared plus 13y plus 42 they are minus 6 and minus 7. The smallest x is minus 6 and the largest y is minus 6, so x is greater than or equal to y. Candidates who compare 5 against 7 as digits get this exactly backwards, because with negatives the larger digit is the smaller number.</li>
<li><strong>The equality you skipped.</strong> A common root forces an answer with an equal sign in it. If you have marked a strict inequality, check first whether any value appears in both sets, since that is the single most common wrong answer in the whole set.</li>
<li><strong>Squares against square roots.</strong> If the paper writes x squared equals 196 then x is plus or minus 14, but if it writes x equals the square root of 196 then x is 14 alone. A cube behaves differently again: x cubed equals 216 gives 6 only. These three lines appear inside otherwise ordinary sets.</li>
<li><strong>The label swap.</strong> Some sets put the y equation first, and some print equation I in y and equation II in x. The options still speak of x and y, so a candidate answering by position rather than by variable reverses the relation.</li>
<li><strong>Reading no relation as a failure.</strong> Sets are constructed so that roughly one question in five has no relation. If you never mark it, you are getting that question wrong on purpose.</li>
</ul>
<h2>When the integers do not exist</h2>
<p>For x squared minus 6x plus 7 equals zero the discriminant is 36 minus 28, that is 8, which is not a perfect square, so no integer pair will ever work. Do not keep hunting. The roots are 3 plus or minus the square root of 2, which is about 1.59 and about 4.41. If the second equation is y squared minus 9y plus 20 equals zero, giving y as 4 or 5, then 4.41 is above 4 while 1.59 is below 4, so no relation can be established. The approximate values were enough, because the comparison only needed to know which side of 4 each root fell.</p>
<p>That is the general rule for a non-factorable equation: compute the discriminant, take the root to one decimal place, and compare. Exact surd arithmetic is never needed to answer a comparison.</p>
<h2>Time and the value of the block</h2>
<p>Budget thirty to forty seconds a question and three minutes for the set. If a pair has not broken open in forty seconds, mark it, finish the other four, and come back only if the section clock allows. In prelims each of these questions is worth one mark for work that involves no reading, no unit conversion and no diagram, which makes the set the cheapest marks in the quantitative section and the first thing you should attempt after the simplification block.</p>
<h2>What the mains quantity format asks instead</h2>
<p>Mains sets two or sometimes three quantities and asks for their order, and it usually chooses statements that look symmetrical but are not. Three quantities multiply the risk, because you must rank all three and the options offer chains such as Quantity I greater than Quantity II greater than Quantity III. Compute all of them fully before you look at the options, since a partly computed pair invites you to accept the chain that matches the one value you have finished. If a quantity genuinely cannot be determined from its statement, that option exists and is occasionally correct, but treat it as a conclusion you reach after the arithmetic rather than a refuge from it.</p>`,
      Expert: `<p>Last month recall. The set should be running on pattern recognition by now, so what follows is the pattern.</p>
<h2>Sign of the roots, read off the equation</h2>
<table>
<thead><tr><th>Form</th><th>Constant</th><th>Middle term</th><th>Roots</th></tr></thead>
<tbody>
<tr><td>x squared minus bx plus c</td><td>Positive</td><td>Negative</td><td>Both positive</td></tr>
<tr><td>x squared plus bx plus c</td><td>Positive</td><td>Positive</td><td>Both negative</td></tr>
<tr><td>x squared plus bx minus c</td><td>Negative</td><td>Positive</td><td>Opposite signs, the negative one larger in size</td></tr>
<tr><td>x squared minus bx minus c</td><td>Negative</td><td>Negative</td><td>Opposite signs, the positive one larger in size</td></tr>
</tbody>
</table>
<h2>Factor pairs worth knowing cold</h2>
<ul>
<li>24 as 4 and 6, 3 and 8, 2 and 12. 30 as 5 and 6, 3 and 10, 2 and 15.</li>
<li>36 as 6 and 6, 4 and 9, 3 and 12. 40 as 5 and 8, 4 and 10.</li>
<li>42 as 6 and 7. 48 as 6 and 8. 56 as 7 and 8. 60 as 6 and 10, 5 and 12.</li>
<li>72 as 8 and 9, 6 and 12. 90 as 9 and 10, 6 and 15. 132 as 11 and 12.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Standard form first. Nothing below is true until every term is on one side.</li>
<li>Sum is minus b, product is c. For a leading coefficient a, split the middle term using the product a times c.</li>
<li>Compare extremes: smallest x against largest y, then largest x against smallest y.</li>
<li>Any shared value means the answer carries an equality.</li>
<li>Overlap in both directions means no relation, and that is a correct answer.</li>
<li>Discriminant not a perfect square: take one decimal place and compare, do not chase surds.</li>
<li>x squared equals k gives two roots, the square root of k gives one, a cube gives one.</li>
</ul>
<h2>Final week checklist</h2>
<ol>
<li>Do twenty sets against a clock and log only the questions that ran past forty seconds.</li>
<li>Count how many no relation answers you marked across those hundred questions. If it is close to zero, you are missing them.</li>
<li>Practise ten sets with negative constants, since opposite sign roots are the shape most candidates drill least.</li>
<li>Do five mains quantity sets with three quantities, computing all three before reading the options.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question: "What are the roots of x squared minus 15x plus 56 equals zero?",
        options: ["7 and 8", "minus 7 and minus 8", "14 and 4", "minus 14 and minus 4"],
        answer: 0,
        explanation:
          "The roots must add to 15 and multiply to 56, which 7 and 8 do, and the equation factorises as (x minus 7)(x minus 8). The tempting answer is minus 7 and minus 8, taken by copying the signs that sit inside the brackets, but substituting minus 7 gives 49 plus 105 plus 56, which is 210 and not zero.",
        difficulty: "Easy",
        skill: "Sum and product factorisation",
      },
      {
        n: 2,
        question:
          "Equation I is x squared minus 15x plus 56 equals zero and equation II is y squared minus 13y plus 42 equals zero. What is the relation between x and y?",
        options: [
          "x is greater than y",
          "x is greater than or equal to y",
          "x is less than y",
          "No relation can be established",
        ],
        answer: 1,
        explanation:
          "The roots are 7 and 8 for x and 6 and 7 for y, so the smallest x is 7 and the largest y is 7 and no x ever falls below a y. Because 7 appears in both sets the relation cannot be strictly greater than, which is the answer most candidates mark after seeing that 8 beats both values of y.",
        difficulty: "Medium",
        skill: "Comparing two root sets",
      },
      {
        n: 3,
        question:
          "Equation I is x squared minus 8x plus 12 equals zero and equation II is y squared minus 8y plus 15 equals zero. What is the relation between x and y?",
        options: [
          "x is greater than y",
          "x is less than y",
          "x is less than or equal to y",
          "No relation can be established",
        ],
        answer: 3,
        explanation:
          "The roots are 2 and 6 for x and 3 and 5 for y, so 2 is below 3 while 6 is above 5 and the two ranges cross each other. No single inequality covers every pairing, so no relation can be established, and marking x less than or equal to y on the strength of the pair 2 against 3 ignores the pair 6 against 5.",
        difficulty: "Medium",
        skill: "The no relation case",
      },
      {
        n: 4,
        question:
          "Before factorising x squared plus 11x plus 30 equals zero, what can you say about its roots?",
        options: [
          "Both roots are positive",
          "Both roots are negative",
          "One root is positive and one is negative",
          "The roots are equal",
        ],
        answer: 1,
        explanation:
          "A positive constant term means the roots share a sign, and a positive middle term means that shared sign is negative, so the roots are minus 5 and minus 6. Opposite signs only arise when the constant term is negative, which is why that option is wrong here even though it is the reflex answer for an equation full of plus signs.",
        difficulty: "Easy",
        skill: "Sign rule for roots",
      },
      {
        n: 5,
        question:
          "Equation I is x squared plus 11x plus 30 equals zero and equation II is y squared plus 13y plus 42 equals zero. What is the relation between x and y?",
        options: [
          "x is less than or equal to y",
          "x is greater than or equal to y",
          "x is greater than y",
          "No relation can be established",
        ],
        answer: 1,
        explanation:
          "The roots are minus 5 and minus 6 for x and minus 6 and minus 7 for y, so the smallest x is minus 6 and the largest y is minus 6 and x never falls below y. The tempting answer is x less than or equal to y, which comes from comparing the digits 5, 6 and 7 as if they were positive, when in fact a larger digit with a minus sign is the smaller number.",
        difficulty: "Hard",
        skill: "Comparing two root sets",
      },
      {
        n: 6,
        question: "What are the roots of 3x squared minus 14x plus 8 equals zero?",
        options: ["4 and two thirds", "2 and four thirds", "4 and three halves", "8 and one third"],
        answer: 0,
        explanation:
          "Multiply 3 by 8 to get 24 and split the middle term into minus 12 and minus 2, giving 3x(x minus 4) minus 2(x minus 4), so the factors are (3x minus 2)(x minus 4) and the roots are two thirds and 4. The tempting pair 2 and four thirds multiplies to eight thirds, which is the correct product, but it adds to ten thirds instead of the fourteen thirds the equation requires.",
        difficulty: "Hard",
        skill: "Sum and product factorisation",
      },
      {
        n: 7,
        question:
          "Equation I is x squared minus 10x plus 25 equals zero and equation II is y squared minus 25 equals zero. What is the relation between x and y?",
        options: [
          "x equals y",
          "x is greater than or equal to y",
          "x is greater than y",
          "No relation can be established",
        ],
        answer: 1,
        explanation:
          "Equation I is a perfect square with both roots equal to 5, while equation II gives y as plus or minus 5, so x equals one value of y and exceeds the other. The tempting answer is x equals y, marked by candidates who see 5 in both equations and stop before noticing that minus 5 also satisfies y squared equals 25.",
        difficulty: "Hard",
        skill: "Equal roots and boundary cases",
      },
      {
        n: 8,
        question:
          "Quantity I is the speed of a boat in still water, given that it covers 60 km downstream in 3 hours on a stream flowing at 4 km an hour. Quantity II is the average speed of a train that covers 96 km in 6 hours. What is the relation?",
        options: [
          "Quantity I is greater than Quantity II",
          "Quantity I is less than Quantity II",
          "Quantity I equals Quantity II",
          "The relation cannot be established",
        ],
        answer: 2,
        explanation:
          "The downstream speed is 60 divided by 3, that is 20 km an hour, and removing the 4 km an hour stream leaves 16 km an hour in still water, while the train does 96 divided by 6, which is also 16. The tempting first option treats the 20 as the still water speed, which is the whole point of giving the stream speed in the statement.",
        difficulty: "Medium",
        skill: "Quantity I and Quantity II",
      },
    ],
  },
};

export default PART;
