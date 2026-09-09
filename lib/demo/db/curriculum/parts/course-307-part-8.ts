/**
 * Course 307: IBPS PO & Clerk: Prelims and Mains, part 8.
 *
 * Topics 30704, 30705, 30708 and 30709: the two calculation-first topics of the
 * quantitative module, simplification with approximation and number series, and
 * the two reading-first topics of the data interpretation module, the graphical
 * sets and then caselet and missing data sets.
 *
 * Every arithmetic result in this file has been worked through to the number it
 * claims, and every series has been checked to admit exactly one continuation,
 * because a candidate who can do the arithmetic will check. Examination
 * mechanics are stated only where they are stable: prelims is sectionally
 * timed, a wrong answer costs a quarter of the marks that question carries, and
 * the prelims score is not carried into the final merit list. No vacancy count,
 * fee, cut-off mark or examination date is stated as current fact.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30704: {
    topicId: 30704,
    title: "Simplification and approximation at speed",
    summary:
      "Simplification and approximation are the only questions on the quantitative paper that ask for nothing but a value, which makes them the cheapest marks in the section and the block you attempt first. You learn the order of operations that papers deliberately test, the fraction equivalents that replace decimal multiplication, the multiplication and root shortcuts, and the exact point at which rounding stops being safe.",
    concepts: [
      "BODMAS order of operations",
      "Fraction and percentage equivalents",
      "Rounding for approximation",
      "Squares, cubes and roots by recall",
      "Multiplication shortcuts",
      "Missing number equations",
    ],
    glossary: {
      BODMAS:
        "The fixed order in which an expression is evaluated: brackets, then of, then division and multiplication taken left to right, then addition and subtraction taken left to right. It is a rule about precedence and not about which operation matters more.",
      Approximation:
        "A question form that supplies numbers sitting close to round values and accepts an answer close enough to select one option. The mark is for the choice, so exact arithmetic here is work the paper does not pay for.",
      "Percentage equivalent":
        "The simple fraction a percentage is equal to, such as three eighths for 37.5 percent. Dividing by the denominator and then multiplying by the numerator is faster and less error prone than multiplying by a decimal.",
      "Base method":
        "A multiplication shortcut for two numbers lying close to a round base such as 100. One half of the answer comes from cross subtracting a deficit, the other half from multiplying the two deficits together.",
      "Unit digit rule":
        "The mapping from the last digit of a perfect cube to the last digit of its cube root, in which 2 and 8 exchange places, 3 and 7 exchange places, and every other digit stays where it is.",
      "Digit sum check":
        "Reducing each factor and the answer to a single digit by adding digits repeatedly, then testing whether the reduced factors multiply to the reduced answer. It cannot prove a result correct, but it exposes a slipped digit for almost no cost.",
    },
    body: {
      Beginner: `<p>The quantitative section of prelims opens with a block of questions that ask you to do nothing except calculate. There is no story, no diagram and nothing to interpret. You are handed an expression and four options, and you must produce the value. This block is called simplification. Its cousin, approximation, gives you numbers that are almost round and asks only for a value close enough to pick one option out of the four.</p>
<h2>The order in which you calculate</h2>
<p>You cannot work through an expression from left to right. There is a fixed order, remembered as <strong>BODMAS</strong>: Brackets first, then Of, then Division, then Multiplication, then Addition, then Subtraction.</p>
<p>The word "of" is what catches people. It means multiply, but it is settled before division. Take 48 divided by 6 of 2 plus 15. The "of" goes first, so 6 of 2 is 12. Then the division, so 48 divided by 12 is 4. Then the addition, so 4 plus 15 is 19. A reader who works left to right takes 48 divided by 6 as 8, then 8 times 2 as 16, then 31, and 31 will be sitting in the options waiting for exactly that reader.</p>
<h2>Percentages you should stop calculating</h2>
<p>Some percentages are simple fractions, and the fraction is far quicker. 37.5 percent is three eighths. So 37.5 percent of 856 is 856 divided by 8, which is 107, then times 3, which is 321. Doing the same thing as 856 multiplied by 0.375 on paper takes four times as long and lands on the same 321.</p>
<h2>Numbers worth knowing by heart</h2>
<p>Squares up to 30 and cubes up to 20 sit inside these expressions constantly. If you know that 24 squared is 576 and that 17 cubed is 4913, you read them instead of computing them. Square roots come back the same way: the square root of 2025 is 45, because 45 squared is 2025.</p>
<h2>What approximation means here</h2>
<p>An approximation question prints numbers such as 39.98 and 649.9 and expects you to read them as 40 and 650. Forty percent of 650 is 260. There are no marks for the exact value, and the four options are placed far enough apart that the rounded answer picks one of them out cleanly.</p>
<h2>Carry this out of the lesson</h2>
<ul>
<li>Brackets, of, division, multiplication, addition, subtraction, in that order, every single time.</li>
<li>Learn the common percentage to fraction pairs so that you divide instead of multiplying decimals.</li>
<li>In an approximation question you round first and calculate afterwards, never the other way round.</li>
<li>Write down nothing you do not need. This block is scored in seconds, not in steps.</li>
</ul>`,
      Intermediate: `<p>Attempt this block first in the quantitative section. It carries the highest marks per minute anywhere on the paper, and clearing it quickly buys the time that a data interpretation set will demand later. What follows is the method in the order you should build it.</p>
<h2>BODMAS, and the two rules that actually get broken</h2>
<p>Brackets are resolved from the inside out, and a bar drawn over a group of terms counts as a bracket. Then "of". Then division and multiplication together, taken left to right. Then addition and subtraction together, also taken left to right. Two errors account for most of the losses in this block. The first is treating "of" as an ordinary multiplication and so performing a division that stands to its left first. The second is believing that addition must come before subtraction. It must not: 20 minus 8 plus 3 is 15, and a candidate who adds 8 and 3 first arrives at 9.</p>
<h2>Fraction equivalents, used as division</h2>
<p>Work one expression fully. Simplify 15 percent of 480 plus two fifths of 350 minus 12.5 percent of 224.</p>
<p>For 15 percent of 480, one tenth is 48 and half of that is 24, so 15 percent is 72. For two fifths of 350, one fifth is 70, so two fifths is 140. For 12.5 percent of 224, that is one eighth, so 28. Then 72 plus 140 is 212, and 212 minus 28 is 184.</p>
<p>Not one of those three steps used a decimal multiplication. Splitting 15 percent into a tenth plus a twentieth, and reading 12.5 percent as one eighth, is the whole of the speed in this block.</p>
<h2>Missing number questions</h2>
<p>Find the value that makes the statement true: the unknown multiplied by 18 equals 45 percent of 2400. Finish the known side first. Forty five percent of 2400 is 1080. The unknown is then 1080 divided by 18, which is 60. Finishing the known side before you touch the unknown is the habit worth building, because as soon as the expression contains a subtraction anywhere, working the two sides in parallel starts producing wrong answers.</p>
<h2>Multiplication near a base</h2>
<p>Two numbers close to 100 multiply in a single line. For 87 times 86 the deficits from 100 are 13 and 14. Cross subtract, so 87 minus 14 is 73. Multiply the deficits, so 13 times 14 is 182. That is three digits where only two will fit, so you keep 82 and carry the 1 into the 73, which becomes 74. The answer is 7482.</p>
<p>The same rule works above the base. For 106 times 104 the excesses are 6 and 4, so you cross add to get 110 and multiply the excesses to get 24, and the answer is 11024.</p>
<h2>Roots without a calculator</h2>
<p>For a square root, split the number into pairs of digits counting from the right. For 5776 the pairs are 57 and 76. The largest square below 57 is 49, so the tens digit of the root is 7. The number ends in 6, so the units digit is either 4 or 6. Since 75 squared is 5625 and 5776 is above that, the root is 76.</p>
<p>For a cube root, use the last digit. Cubes ending in 7 have roots ending in 3, cubes ending in 3 have roots ending in 7, 2 and 8 also swap, and every other digit maps to itself. For 12167, the part before the last three digits is 12, which lies between 2 cubed and 3 cubed, so the tens digit is 2, and the final 7 gives 3. The cube root is 23.</p>
<h2>Checking a long multiplication in three seconds</h2>
<p>Add the digits of each factor down to a single digit, multiply those two, reduce again, and compare with the same reduction of your answer. For 417 times 23 the reductions are 3 and 5, whose product 15 reduces to 6. Your answer 9591 reduces to 6 as well, so it survives the check. An answer of 9581 reduces to 5 and is certainly wrong. The check never proves an answer right, but it catches a slipped digit at almost no cost in time.</p>`,
      Advanced: `<p>You already calculate accurately. What costs you marks in this block is spending eleven seconds where seven would do, and choosing to round in the one place where rounding destroys the answer. Both of those are decisions rather than skills, and both can be fixed inside a fortnight.</p>
<h2>The time budget this block has to meet</h2>
<p>The quantitative section runs to 35 questions in 20 minutes, so the average is a little over thirty seconds a question. A simplification and approximation block of five to ten questions has to come in under twenty seconds each, because the data interpretation set and the arithmetic word problems cannot. If you are averaging thirty five seconds here, you are not slow at arithmetic. You are writing steps you do not need.</p>
<table>
<thead><tr><th>What you see</th><th>Target</th><th>Method</th></tr></thead>
<tbody>
<tr><td>Percentage of a round number</td><td>12 seconds</td><td>Split into a tenth and a twentieth</td></tr>
<tr><td>Fraction of a number, denominator up to 16</td><td>12 seconds</td><td>Divide first, then multiply</td></tr>
<tr><td>Two square roots multiplied together</td><td>15 seconds</td><td>Recall both roots, one multiplication</td></tr>
<tr><td>Missing number with one operation</td><td>20 seconds</td><td>Finish the known side completely first</td></tr>
<tr><td>Three term chain with brackets</td><td>25 seconds</td><td>Bracket, then left to right within a rank</td></tr>
<tr><td>Decimal division by a two digit decimal</td><td>25 seconds</td><td>Shift both decimals, then round</td></tr>
</tbody>
</table>
<h2>Where rounding stops being safe</h2>
<p>Approximation rests on one assumption: that the error you introduce is small compared with the gap between the options. There are three places where that assumption fails, and papers set all three deliberately.</p>
<ul>
<li><strong>A difference of two nearly equal large numbers.</strong> Take 48.9 percent of 1201 minus 48.1 percent of 1199. Rounding both terms to 48 percent of 1200 gives zero. The true value is 587.29 minus 576.72, which is about 10.6. The rounding error was under one percent on each term and it was still larger than the answer.</li>
<li><strong>A ratio wanted to one decimal place.</strong> If the options run 4.2, 4.4, 4.6 and 4.8, then rounding a numerator by two percent moves you a whole option along.</li>
<li><strong>Options within about two percent of one another.</strong> Read the options before you round. They tell you how much error you are allowed, and nothing else on the page tells you that.</li>
</ul>
<h2>Traps set inside the block itself</h2>
<ul>
<li><strong>The decimal shift.</strong> 0.6 multiplied by 0.05 is 0.03, not 0.3. Count the decimal places in both factors and put exactly that many into the answer.</li>
<li><strong>Percentage of a percentage.</strong> Twenty percent of thirty percent of a number is six percent of it. It is not fifty percent and it is not ten percent.</li>
<li><strong>The root that is not exact.</strong> If the number under the root is not a perfect square, the question is an approximation question by design. The square root of 1450 lies between 38 and 39 and sits nearer to 38, because 38 squared is 1444.</li>
<li><strong>The reversible percentage.</strong> A percentage of B always equals B percent of A. Eighteen percent of 50 is more easily read as 50 percent of 18, which is 9.</li>
<li><strong>The carry in the base method.</strong> When the product of the two deficits runs to three digits you must carry. Writing 87 times 86 as 73 followed by 182 is the commonest way this shortcut is fumbled, and the number it produces is not even four digits long.</li>
</ul>
<h2>The marginal decision</h2>
<p>A wrong answer costs a quarter of the marks the question carries, so in prelims each wrong answer removes 0.25 of a mark. In this block, though, the penalty is rarely what decides the matter. A simplification question whose shape you can already see is worth attempting at seventy percent confidence. One whose bracket structure you have not parsed after fifteen seconds is worth leaving, because in a sectionally timed paper the twenty seconds you save buys you a question elsewhere that you will get right.</p>`,
      Expert: `<p>Recall sheet for the last month. Everything below should come back without any working on the sheet.</p>
<h2>Squares from 21 to 35</h2>
<table>
<thead><tr><th>n</th><th>Square</th><th>n</th><th>Square</th><th>n</th><th>Square</th></tr></thead>
<tbody>
<tr><td>21</td><td>441</td><td>26</td><td>676</td><td>31</td><td>961</td></tr>
<tr><td>22</td><td>484</td><td>27</td><td>729</td><td>32</td><td>1024</td></tr>
<tr><td>23</td><td>529</td><td>28</td><td>784</td><td>33</td><td>1089</td></tr>
<tr><td>24</td><td>576</td><td>29</td><td>841</td><td>34</td><td>1156</td></tr>
<tr><td>25</td><td>625</td><td>30</td><td>900</td><td>35</td><td>1225</td></tr>
</tbody>
</table>
<h2>Cubes from 11 to 20</h2>
<table>
<thead><tr><th>n</th><th>Cube</th><th>n</th><th>Cube</th></tr></thead>
<tbody>
<tr><td>11</td><td>1331</td><td>16</td><td>4096</td></tr>
<tr><td>12</td><td>1728</td><td>17</td><td>4913</td></tr>
<tr><td>13</td><td>2197</td><td>18</td><td>5832</td></tr>
<tr><td>14</td><td>2744</td><td>19</td><td>6859</td></tr>
<tr><td>15</td><td>3375</td><td>20</td><td>8000</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Order: brackets, of, division and multiplication left to right, addition and subtraction left to right.</li>
<li>Any number ending in 5, squared: take the digits before the 5, multiply by the next whole number, write 25 after it. So 85 squared is 8 times 9 followed by 25, that is 7225.</li>
<li>Near 100: cross subtract for the left part, multiply the deficits for the right part, and carry if the right part runs past two digits.</li>
<li>Times 25 is times 100 divided by 4. Times 125 is times 1000 divided by 8.</li>
<li>A percent of B equals B percent of A, so use whichever way round is easier.</li>
<li>Cube root last digit: 1 to 1, 4 to 4, 5 to 5, 6 to 6, 9 to 9, 0 to 0, while 2 and 8 swap and 3 and 7 swap.</li>
<li>Digit sum check: reduce both factors and the answer to single digits, then compare.</li>
<li>Round only after you have read how far apart the four options are.</li>
</ul>
<h2>Final fortnight checklist</h2>
<ol>
<li>Time thirty simplification questions and log only the ones that ran past twenty seconds. Drill those shapes and leave the rest alone.</li>
<li>Write out the squares to 35 and the cubes to 20 from memory once a day until there is no pause anywhere in the list.</li>
<li>Do one approximation set in which you deliberately read the options first and decide how much rounding error you are allowed.</li>
<li>Practise ten near-100 multiplications that need a carry, since that is the single step at which the shortcut is fumbled.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question: "Simplify: 48 divided by 6 of 2 plus 15.",
        options: ["19", "31", "23", "27"],
        answer: 0,
        explanation:
          "In BODMAS the word of is settled before division, so 6 of 2 is 12, then 48 divided by 12 is 4, and 4 plus 15 is 19. The tempting 31 comes from working left to right, taking 48 divided by 6 as 8 and then multiplying by 2, which performs a division that was never entitled to go first.",
        difficulty: "Medium",
        skill: "BODMAS order of operations",
      },
      {
        n: 2,
        question: "What is 37.5 percent of 856?",
        options: ["321", "107", "428", "214"],
        answer: 0,
        explanation:
          "37.5 percent is three eighths, so 856 divided by 8 is 107 and 107 multiplied by 3 is 321. The tempting 107 is one eighth of 856, that is 12.5 percent, and it is what you get by dividing correctly and then forgetting that the numerator of the fraction is 3 and not 1.",
        difficulty: "Easy",
        skill: "Fraction and percentage equivalents",
      },
      {
        n: 3,
        question:
          "What is the approximate value of 24.97 percent of 1599.8 plus 12.49 percent of 800.3?",
        options: ["500", "480", "520", "460"],
        answer: 0,
        explanation:
          "Round first: 25 percent of 1600 is 400 and 12.5 percent of 800 is 100, so the answer is 500, and the exact value of 499.4 confirms it. The tempting 480 comes from rounding 12.49 percent down to 10 percent, which gives 80 instead of 100, and an error of 20 is larger than the gap between the options.",
        difficulty: "Medium",
        skill: "Rounding for approximation",
      },
      {
        n: 4,
        question: "What is the cube root of 12167?",
        options: ["23", "27", "33", "17"],
        answer: 0,
        explanation:
          "Strip the last three digits to leave 12, which lies between 2 cubed and 3 cubed, so the tens digit is 2, and a cube ending in 7 has a root ending in 3, giving 23. The tempting 27 keeps the last digit of the cube as the last digit of the root, but 3 and 7 exchange places under that rule and 27 cubed is 19683.",
        difficulty: "Medium",
        skill: "Squares, cubes and roots by recall",
      },
      {
        n: 5,
        question: "Using the base method, what is 87 multiplied by 86?",
        options: ["7482", "7382", "7302", "7492"],
        answer: 0,
        explanation:
          "The deficits from 100 are 13 and 14, so cross subtracting gives 87 minus 14, that is 73, and the deficits multiply to 182. Because 182 runs to three digits you keep 82 and carry 1 into 73 to get 74, so the answer is 7482. The tempting 7382 writes 73 and 82 side by side and drops that carry, which is the one step at which this shortcut fails.",
        difficulty: "Hard",
        skill: "Multiplication shortcuts",
      },
      {
        n: 6,
        question:
          "Find the value of the unknown: the unknown multiplied by 18 equals 45 percent of 2400.",
        options: ["60", "24", "66", "48"],
        answer: 0,
        explanation:
          "Finish the known side first: 45 percent of 2400 is 1080, and 1080 divided by 18 is 60. The tempting 24 divides 1080 by 45 instead of by 18, which answers a question about the percentage figure rather than about the multiplier the statement actually names.",
        difficulty: "Easy",
        skill: "Missing number equations",
      },
      {
        n: 7,
        question:
          "In which of these expressions is rounding every number to the nearest whole ten before calculating most likely to select the wrong option?",
        options: [
          "The difference between two large quantities that are very close to each other",
          "The sum of four quantities of similar size",
          "A single percentage taken of a four digit number",
          "The product of two numbers that are each close to 100",
        ],
        answer: 0,
        explanation:
          "When two nearly equal quantities are subtracted, the answer is small while the rounding errors are not, so a one percent error on each term can exceed the whole result, as it does when 48.9 percent of 1201 minus 48.1 percent of 1199 is rounded to zero against a true value near 10.6. The tempting choice is the sum of four quantities, but there the errors are each small next to a large total and they also tend to cancel rather than accumulate.",
        difficulty: "Hard",
        skill: "Rounding for approximation",
      },
    ],
  },
  30705: {
    topicId: 30705,
    title: "Number series: missing term and wrong term",
    summary:
      "A number series question hands you a row built by one repeated rule and asks either for the term that has been replaced by a question mark or for the single term that breaks the rule. You learn a fixed order of tests, differences first and ratios second, the families that hide squares, cubes and primes inside the row, and the reason two gaps can never fix a pattern.",
    concepts: [
      "Constant and changing differences",
      "Multiplicative series with a changing factor",
      "Square and cube based series",
      "Alternating and mixed series",
      "Wrong term identification",
      "Pattern testing order",
    ],
    glossary: {
      "Common difference":
        "The fixed amount added from one term to the next in an arithmetic row. When it is constant the row is settled by a single subtraction, and when it is not, that row of differences becomes the row you examine next.",
      "Second difference":
        "The difference between consecutive first differences. A row whose second differences are constant is built by adding a gap that rises steadily, and it is the commonest family set in the preliminary paper.",
      "Growth ratio":
        "The last printed term divided by the first. It sorts a row into additive or multiplicative before any pattern is tested, since an additive row grows slowly across five terms and a multiplicative one does not.",
      "Rising multiplier":
        "A rule in which each term is multiplied by a factor that itself increases at every step, very often with the same number then added or subtracted, so that the multiplier and the addition move together.",
      "Wrong term series":
        "A row in which every term is printed and exactly one of them breaks the rule. Because a single bad term damages the gap before it and the gap after it, two adjacent broken gaps point at the term sitting between them.",
      "Alternating series":
        "A row that interleaves two independent sequences, one occupying the odd positions and one the even. Its signature is a row that rises and falls instead of moving steadily in one direction.",
    },
    body: {
      Beginner: `<p>A number series is a row of numbers built by one rule applied over and over. The paper prints the row with one number replaced by a question mark, and you work out the rule and supply the missing number. In the officer paper a second form appears as well: every number is printed, one of them breaks the rule, and you have to say which one.</p>
<h2>Start with the gaps</h2>
<p>Write the gap between each pair of neighbours underneath the row. Take 4, 6, 10, 16, 24. The gaps are 2, 4, 6 and 8. Those gaps are themselves rising by 2 each time, so the next gap is 10 and the next number is 34.</p>
<p>That one habit, writing the gaps down on paper instead of trying to see them, settles most of the rows you will meet. Do it before you think about anything cleverer.</p>
<h2>When the gaps grow too fast to help</h2>
<p>Take 5, 6, 14, 45, 184. The gaps are 1, 8, 31 and 139, which tells you nothing. When a row grows that quickly the rule is a multiplication rather than an addition, so divide instead. 6 divided by 5 is a little over 1, 14 divided by 6 is a little over 2, and 45 divided by 14 is a little over 3, so the multiplier is climbing by one each step. Look closer and the rule is multiply by 1 and add 1, then multiply by 2 and add 2, then multiply by 3 and add 3. Test every step: 5 times 1 plus 1 is 6, 6 times 2 plus 2 is 14, 14 times 3 plus 3 is 45, and 45 times 4 plus 4 is 184. So the next term is 184 times 5 plus 5, which is 925.</p>
<h2>Squares and cubes hiding in the row</h2>
<p>Take 7, 26, 63, 124. Each of these is one less than a cube: 8 minus 1, 27 minus 1, 64 minus 1 and 125 minus 1. The next cube is 216, so the next term is 215. Keep the cubes of 1 to 10 in your head and this family becomes visible on sight, because no table of gaps would ever have shown it to you.</p>
<h2>Carry this out of the lesson</h2>
<ul>
<li>Write the gaps down first. Do not try to hold the rule in your head.</li>
<li>Growing slowly means addition. Growing very fast means multiplication.</li>
<li>Test your rule against every gap in the row, not only against the first one.</li>
<li>A number sitting close to a square or a cube is usually meant to be read that way.</li>
</ul>`,
      Intermediate: `<p>Series questions reward a fixed order of tests rather than a flash of insight. Run the same five checks in the same sequence every time and a block of five questions comes in under three minutes.</p>
<h2>The order of testing</h2>
<ol>
<li>Write the first differences under the row.</li>
<li>If they are constant you are finished. If they form a simple sequence of their own, whether arithmetic, squares, cubes or primes, you are also finished.</li>
<li>If the differences grow fast and mean nothing, take the ratio of each term to the one before it.</li>
<li>If the ratios are not constant, test the family that multiplies by a rising whole number and then adds or subtracts that same number.</li>
<li>If none of that works, split the row into alternate terms and read the two shorter rows separately.</li>
</ol>
<h2>Second differences, worked</h2>
<p>Take 3, 4, 8, 17, 33 and find the next term. The first differences are 1, 4, 9 and 16, which are the squares of 1, 2, 3 and 4, so the next difference is 25 and the answer is 58. Notice what would have happened had you stopped at the first two differences. A gap of 1 followed by a gap of 4 could equally have suggested a quadrupling of the gap, which would have put 20 in the third position; the printed 8 rules that out. Every gap has to agree before the rule is yours.</p>
<h2>A multiplier that changes</h2>
<p>Take 4, 6, 12, 30, 90 and find the next term. Divide adjacent terms: 6 by 4 is 1.5, 12 by 6 is 2, 30 by 12 is 2.5, and 90 by 30 is 3. The multiplier climbs by 0.5 each step, so the next is 3.5 and the answer is 90 times 3.5, which is 315. Fractional multipliers of this kind are common, and they are the reason the opening terms of such a row look untidy while the later ones look tidy.</p>
<p>A dividing row behaves the same way in reverse. In 720, 120, 24, 6, 2 the divisors are 6, 5, 4 and 3, so the next divisor is 2 and the answer is 1.</p>
<h2>Alternating rows</h2>
<p>Take 2, 9, 5, 16, 8, 23 and find the seventh term. Nothing sensible comes out of the differences, because two rules are interleaved. Read the odd positions on their own and you get 2, 5, 8, rising by 3. Read the even positions on their own and you get 9, 16, 23, rising by 7. The seventh position is an odd one, so the answer is 8 plus 3, which is 11. A row that jumps up and down rather than travelling steadily in one direction is the signal to split it.</p>
<h2>The wrong term form</h2>
<p>Here every term is printed and exactly one is wrong. Take 8, 13, 21, 32, 47, 63, 83. The differences are 5, 8, 11, 15, 16 and 20. The first three rise by 3 each time, so the sequence of gaps should run 5, 8, 11, 14, 17, 20. Two printed gaps are wrong, 15 and 16, and they sit on either side of 47. Replace 47 with 46 and both are repaired at once, because 32 to 46 is 14 and 46 to 63 is 17. So 47 is the wrong term.</p>
<p>That is the general shape of the form. A single bad number always damages the two gaps that touch it, so when exactly two adjacent gaps are wrong the culprit is the term between them, and the way to prove it is to state the repair value rather than to guess the position.</p>`,
      Advanced: `<p>By a repeat attempt the families are familiar. What still separates five marks from three is deciding fast which family a row belongs to, refusing to force a rule onto a row that does not carry it, and knowing that some rows can be described two different ways with no conflict between them.</p>
<h2>Decide the family before you test anything</h2>
<p>Divide the last printed term by the first. That single number, the growth ratio, sorts the row before you have written a single difference.</p>
<table>
<thead><tr><th>Growth ratio across the row</th><th>Likely family</th><th>First test</th></tr></thead>
<tbody>
<tr><td>Under about 5</td><td>Additive, constant or rising gaps</td><td>First differences</td></tr>
<tr><td>About 5 to 30</td><td>Squares, cubes, or a doubling gap</td><td>Differences, then compare against squares</td></tr>
<tr><td>Over about 50</td><td>Multiplicative with a rising factor</td><td>Ratios of neighbours</td></tr>
<tr><td>Falling across the row</td><td>Division row, or a negative gap</td><td>Divide neighbours</td></tr>
<tr><td>Rising and falling within the row</td><td>Two interleaved rows</td><td>Split odd and even positions</td></tr>
</tbody>
</table>
<h2>Two descriptions, one answer</h2>
<p>Take 3, 9, 21, 45, 93. The differences are 6, 12, 24 and 48, which double, so the next difference is 96 and the answer is 189. The same row is also each term doubled with 3 added: 3 times 2 plus 3 is 9, 9 times 2 plus 3 is 21, and 93 times 2 plus 3 is 189. Both readings are correct and both produce 189, which is no coincidence, because whenever the rule is multiply by 2 and add a constant the differences double. Recognising that pairing stops you abandoning a correct reading merely because it was not the one you expected to find.</p>
<h2>Where the difference shortcut stops being safe</h2>
<p>Two gaps are never enough. Consider a row opening 4, 6, 10. The gaps so far are 2 and 4, which continue either as 6, giving 4, 6, 10, 16, 24, or by doubling to 8, giving 4, 6, 10, 18, 34. Both are consistent rules and they part company at the fourth term. A properly set question always prints enough terms to separate them, which means that committing after two gaps is precisely the mechanism by which the paper takes marks off fast candidates. Use every printed term before you commit, including the terms that lie beyond the question mark.</p>
<h2>Traps in the wrong term form</h2>
<ul>
<li><strong>Marking the term whose gap you noticed first.</strong> A wrong term breaks the gap before it and the gap after it. If only one gap looks wrong, the offending term is at one end of the row, which is rarer and worth checking twice.</li>
<li><strong>Repairing with the wrong value.</strong> Say what the term should have been and confirm that both neighbouring gaps come right. In the row 8, 13, 21, 32, 47, 63, 83 the repair is 46, and stating it is what proves the culprit is 47 rather than 63.</li>
<li><strong>Sequences of special numbers.</strong> A row such as 4, 9, 25, 49, 100, 169, 289 is the squares of consecutive primes, so 100 is wrong and 121 is the repair. Primes, factorials and cubes offset by one all appear, and none of them will ever show up in a table of differences.</li>
<li><strong>The opening term as the culprit.</strong> Some rows are built so that the first number is the wrong one. If every gap from the second term onward is regular and only the first gap misbehaves, do not force the rule backwards; the first term is the answer.</li>
</ul>
<h2>Time and selection</h2>
<p>Budget thirty seconds a question and about two and a half minutes for a block of five. If the growth ratio has not told you the family within ten seconds and the first differences are unhelpful, mark the question and move on. In a sectionally timed paper the clock closes on the section whether or not you cracked that one row, and a series question you leave costs you nothing, while a wrong answer costs a quarter of a mark on top of the ninety seconds you spent earning it.</p>`,
      Expert: `<p>Recall sheet. Read the row, match it to a line in the table, and test that line first.</p>
<h2>Difference pattern to family</h2>
<table>
<thead><tr><th>First differences look like</th><th>Family</th><th>Example row</th></tr></thead>
<tbody>
<tr><td>Constant</td><td>Arithmetic</td><td>7, 12, 17, 22, 27</td></tr>
<tr><td>Rising by a fixed amount</td><td>Second difference constant</td><td>4, 6, 10, 16, 24</td></tr>
<tr><td>1, 4, 9, 16</td><td>Squares added</td><td>3, 4, 8, 17, 33</td></tr>
<tr><td>1, 8, 27, 64</td><td>Cubes added</td><td>2, 3, 11, 38, 102</td></tr>
<tr><td>6, 12, 24, 48</td><td>Multiply by 2 and add a constant</td><td>3, 9, 21, 45, 93</td></tr>
<tr><td>No use at all, row grows fast</td><td>Rising multiplier</td><td>5, 6, 14, 45, 184</td></tr>
<tr><td>Alternately up and down</td><td>Two interleaved rows</td><td>2, 9, 5, 16, 8, 23</td></tr>
</tbody>
</table>
<h2>Number sets that never show in a difference table</h2>
<ul>
<li>Cubes of 1 to 10: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.</li>
<li>Cubes offset by one: 0, 7, 26, 63, 124, 215 going down, and 2, 9, 28, 65, 126, 217 going up.</li>
<li>Squares of the primes: 4, 9, 25, 49, 121, 169, 289, 361.</li>
<li>Factorials: 1, 2, 6, 24, 120, 720, 5040.</li>
<li>Primes themselves: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Differences first, always written down, never held in the head.</li>
<li>Growth ratio under 5 means additive, over 50 means multiplicative.</li>
<li>Doubling differences and multiply by 2 plus a constant are one rule seen twice.</li>
<li>Fractional multipliers climb in steps of 0.5, so expect 1.5, 2, 2.5, 3.</li>
<li>A wrong term damages exactly two gaps. Name the repair value to prove which term is at fault.</li>
<li>If the row rises and falls, split it into odd and even positions.</li>
<li>Two gaps never fix a rule. Use every printed term, including those past the question mark.</li>
</ul>
<h2>Final fortnight checklist</h2>
<ol>
<li>Do fifty series against a clock and log the ones that ran past forty seconds by family, not by whether you got them right.</li>
<li>Write out the cubes to 10 and the squares of the primes to 19 daily until both are recognised on sight.</li>
<li>Do twenty wrong term rows and, for each one, write the repair value rather than only the position.</li>
<li>Read back your log for rows you abandoned. If one family keeps appearing there, that family is the fortnight's work.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question: "Find the next term: 3, 4, 8, 17, 33, ?",
        options: ["58", "49", "52", "66"],
        answer: 0,
        explanation:
          "The differences are 1, 4, 9 and 16, which are the squares of 1, 2, 3 and 4, so the next difference is 25 and 33 plus 25 is 58. The tempting 49 repeats the last difference of 16, which would require the differences to be constant, and they are plainly growing.",
        difficulty: "Medium",
        skill: "Constant and changing differences",
      },
      {
        n: 2,
        question: "Find the next term: 5, 6, 14, 45, 184, ?",
        options: ["925", "920", "736", "1104"],
        answer: 0,
        explanation:
          "The operations are multiply by 1 and add 1, then by 2 and add 2, then by 3 and add 3, then by 4 and add 4, so the next step is multiply by 5 and add 5, giving 184 times 5 plus 5, that is 925. The tempting 920 stops at 184 times 5 and drops the addition that every earlier step carried.",
        difficulty: "Hard",
        skill: "Multiplicative series with a changing factor",
      },
      {
        n: 3,
        question: "Find the next term: 7, 26, 63, 124, ?",
        options: ["215", "216", "213", "218"],
        answer: 0,
        explanation:
          "The terms are the cubes of 2, 3, 4 and 5 each reduced by one, so the next is the cube of 6 reduced by one, that is 216 minus 1, which is 215. The tempting 216 is the bare cube and forgets the offset of one that every printed term in the row carries.",
        difficulty: "Medium",
        skill: "Square and cube based series",
      },
      {
        n: 4,
        question: "Find the seventh term: 2, 9, 5, 16, 8, 23, ?",
        options: ["11", "30", "12", "26"],
        answer: 0,
        explanation:
          "Two rows are interleaved: the odd positions run 2, 5, 8 rising by 3 and the even positions run 9, 16, 23 rising by 7. The seventh position is an odd one, so the answer is 8 plus 3, that is 11. The tempting 30 continues the even row from 23, which would be the eighth term and not the one asked for.",
        difficulty: "Medium",
        skill: "Alternating and mixed series",
      },
      {
        n: 5,
        question:
          "One term in this row is wrong: 8, 13, 21, 32, 47, 63, 83. Which one?",
        options: ["47", "63", "32", "21"],
        answer: 0,
        explanation:
          "The gaps should rise by 3 each time, running 5, 8, 11, 14, 17, 20, but the printed gaps are 5, 8, 11, 15, 16, 20. The two broken gaps sit either side of 47, and replacing it with 46 repairs both at once, since 32 to 46 is 14 and 46 to 63 is 17. The tempting 63 also touches a broken gap, but no replacement for 63 can repair the gap that lies before 47 as well.",
        difficulty: "Hard",
        skill: "Wrong term identification",
      },
      {
        n: 6,
        question:
          "One term in this row is wrong: 4, 9, 25, 49, 100, 169, 289. Which one?",
        options: ["100", "49", "169", "25"],
        answer: 0,
        explanation:
          "The terms are the squares of the consecutive primes 2, 3, 5, 7, 11, 13 and 17, so the fifth should be 121 and not 100, which is the square of 10. The tempting 49 looks out of place because the jumps around it are uneven, but 7 is prime and belongs in the row, whereas 10 is not prime and does not.",
        difficulty: "Hard",
        skill: "Wrong term identification",
      },
      {
        n: 7,
        question:
          "A row begins 4, 6, 10 and the rest is hidden. Which statement about the fourth term is correct?",
        options: [
          "It must be 16, because the gaps 2 and 4 continue as 6",
          "It must be 18, because each term is twice the one before it minus 2",
          "Three terms cannot settle it, since 16 and 18 both continue a consistent rule and the printed terms after the gap are needed",
          "The row cannot be continued at all, because the gaps are not constant",
        ],
        answer: 2,
        explanation:
          "The gaps 2 and 4 continue either by rising to 6, giving 16, or by doubling to 8, giving 18, and both are consistent rules that part company only at the fourth term. The tempting first option is the commoner reading in practice, but commonness is not proof, and a paper always prints enough terms to separate the two, which is why you read every term before committing.",
        difficulty: "Hard",
        skill: "Pattern testing order",
      },
    ],
  },
};

export default PART;
