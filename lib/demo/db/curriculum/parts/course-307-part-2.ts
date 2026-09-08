/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 2.
 *
 * Topics 30702 to 30705: the sectional clock that governs the preliminary
 * paper, the sixteen week plan that carries a candidate from prelims speed
 * through to mains depth, and the opening two topics of the quantitative
 * module, simplification and approximation, and number series.
 *
 * Everything structural here is stated as it is set and is stable across
 * cycles. No vacancy count, fee, cut-off mark or examination date is given as
 * current fact: the notification for the cycle you are sitting is always the
 * authority. Every worked calculation and every keyed option has been computed
 * out, because the candidate reading this can do the arithmetic too.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30702: {
    topicId: 30702,
    title: "Sectional timing in prelims and what it changes",
    summary:
      "The preliminary paper is not one hour holding a hundred questions, it is three separate twenty minute papers served in a fixed order and locked behind you as each one ends. That single rule decides how many questions you plan to attempt, which ones you refuse to start, and what you should be practising for the next eight weeks.",
    concepts: [
      "Sectional clock",
      "Attempt budget",
      "Question selection",
      "Leave discipline",
      "Break-even accuracy",
      "Sectional stamina",
    ],
    glossary: {
      "Sectional clock":
        "A timer that belongs to one section rather than to the paper. It starts when that section opens, it cannot be paused, and any seconds you do not use are destroyed rather than returned to the rest of the paper.",
      "Attempt budget":
        "The number of questions you have decided in advance to answer in a section, taken from your own measured speed in practice rather than from the number of questions printed on the screen.",
      "Leave discipline":
        "The habit of abandoning a question at a fixed number of seconds whether or not you feel close to it, on the reasoning that the seconds already spent are gone even in the case where the answer never arrives.",
      "Marked for review":
        "A flag the platform stores against a question. It changes the colour of the tile in the palette and does nothing else, so a flagged question you never answered is scored exactly like a blank one.",
      "Break-even accuracy":
        "The share of your attempts that must be correct before attempting adds anything to your score. With one quarter of a mark deducted for a wrong answer, that share is one in five.",
      "Sectional cut-off":
        "A minimum mark that must be reached inside a single section before the total is looked at, where a cycle imposes one. Whether it applies is stated in that cycle's notification and in the instructions page of the paper.",
    },
    body: {
      Beginner: `<p>The preliminary paper runs for one hour and sets one hundred questions. Both of those statements are true and neither of them describes what you will meet on the day. The hour is cut into three fixed blocks of twenty minutes, and each block belongs to one section and to nothing else.</p>
<h2>What the screen does</h2>
<p>The platform opens the first section and starts a timer for twenty minutes. Inside the section you may move about freely: answer question 12, jump to question 30, come back and change 12 again. When the twenty minutes end, the section shuts by itself, the next one opens, and there is no route back. Finishing early does not help you either. Those spare minutes are not banked, they are simply lost.</p>
<h2>Why the rule bites</h2>
<p>Say reasoning is your strong section and quantitative aptitude is your weak one. In an ordinary paper you would move quickly through reasoning and give the minutes you saved to the numbers. Here you cannot. Your weakest section still receives twenty minutes, no more and no fewer, and the strength you built elsewhere cannot be spent on it.</p>
<p>Put plainly, the paper is not asking about your best subject. It is asking about your worst one, on a stopwatch, and it asks three separate times.</p>
<h2>Fix your numbers before the day</h2>
<p>Twenty minutes is 1200 seconds. If you plan to answer 24 questions in a section, you have 50 seconds each, and that has to include reading the question. Nobody answers 35 quantitative questions in 1200 seconds. So decide, in practice and not in the hall, roughly how many you intend to attempt in each section, and treat that number as your target.</p>
<h2>Two habits that carry most of the benefit</h2>
<ul>
<li><strong>Sweep first, dig later.</strong> Go through the section once and take only the questions that open up immediately. Then come back for the harder ones with whatever time is left.</li>
<li><strong>Walk away on a count.</strong> Fix a number of seconds, around forty, and when a question crosses it you leave, even if you feel close. Feeling close is not the same as being close.</li>
</ul>
<h2>Guessing</h2>
<p>A wrong answer costs a quarter of a mark and a blank costs nothing. So filling in an entire section at random is not a free lottery ticket, it eats marks you earned in the questions you actually solved. Leave what you cannot do.</p>`,
      Intermediate: `<p>Sectional timing converts preparation from a question of knowledge into a question of throughput. You are not being asked whether you can solve a mixture and alligation problem. You are being asked how many you can finish in 1200 seconds while reading three others and rejecting them. Build the plan around that number.</p>
<h2>An attempt budget you can actually hold</h2>
<table>
<thead><tr><th>Section</th><th>Questions set</th><th>Realistic attempt band</th><th>Seconds per attempt</th></tr></thead>
<tbody>
<tr><td>English Language</td><td>30</td><td>20 to 24</td><td>50 to 60</td></tr>
<tr><td>Reasoning Ability</td><td>35</td><td>24 to 28</td><td>43 to 50</td></tr>
<tr><td>Quantitative Aptitude</td><td>35</td><td>20 to 25</td><td>48 to 60</td></tr>
</tbody>
</table>
<p>These bands are a starting point, not a rule. You replace them with your own measured numbers after three or four sectional drills, and you revise them upward only when your accuracy has stayed where it was.</p>
<h2>What such a paper scores</h2>
<p>Take a candidate who attempts 22 in English with 19 correct, 26 in reasoning with 23 correct, and 22 in quantitative aptitude with 19 correct. That is 70 attempts, 61 correct, 9 wrong. The deduction is 9 multiplied by 0.25, which is 2.25, so the net score is 61 minus 2.25, or 58.75. Notice what produced it: not a heroic section, but three sections that each did their job and none that collapsed.</p>
<h2>The two pass sweep, inside the twenty minutes</h2>
<ol>
<li><strong>Minutes 0 to 12, first pass.</strong> Move through the section in order and answer only what resolves in under forty seconds. Anything that does not, you flag and leave without a second thought. Do not solve out of order at this stage, because scanning for the perfect question costs more than reading each one once.</li>
<li><strong>Minutes 12 to 18, second pass.</strong> Return to the flagged questions in the order you flagged them and take the ones that now look tractable. You have already read them once, so the reading time is paid for.</li>
<li><strong>Minutes 18 to 20, close out.</strong> Clear the palette. Any question showing as marked for review and unanswered is a blank, and a blank on a question you had almost finished is the cheapest mark in the paper to lose.</li>
</ol>
<h2>Selection is a separate skill from solving</h2>
<p>In reasoning, most of the section is puzzles and arrangements sold in sets of four or five questions. A set is all or nothing in practice: if the grid does not close, you have four minutes gone and nothing on the sheet. So the first sixty seconds of a set are spent deciding, not solving. Count the variables, count the definite clues, and start with the set that has the most statements which fix a position outright rather than merely ranking two people.</p>
<p>In quantitative aptitude the same logic applies to the data interpretation set and the simplification block. Simplification and approximation are the fastest marks in the section, so sweep them first even if they sit at the end of the question numbering.</p>
<h2>What sectional timing changes in your preparation</h2>
<ul>
<li>You practise sections against a clock from the first month, not full papers only.</li>
<li>You raise your floor rather than your ceiling. A section that scores 12 when your others score 22 is where every extra hour belongs.</li>
<li>You rehearse the order the platform serves, so the first section never surprises you.</li>
<li>You measure attempts and accuracy separately in every drill, because they move in opposite directions and a single score hides which one changed.</li>
</ul>`,
      Advanced: `<p>A repeat attempter usually knows enough mathematics to clear this paper and loses it to allocation. The arithmetic below is the part worth internalising, because it settles the two arguments candidates keep having with themselves in the hall: how many to attempt, and whether to guess.</p>
<h2>What one attempt is worth</h2>
<p>Let p be the proportion of your attempts that are correct. Each attempt returns p marks and costs 0.25 multiplied by the remaining share, so the expected return per attempt is 1.25p minus 0.25. Set that to zero and p comes out at 0.20. Below one correct in five, attempting actively destroys your score. Above it, attempting pays, and the return climbs steeply.</p>
<table>
<thead><tr><th>Accuracy</th><th>Marks per attempt</th><th>30 attempts</th><th>24 attempts</th></tr></thead>
<tbody>
<tr><td>60 percent</td><td>0.500</td><td>15.00</td><td>12.00</td></tr>
<tr><td>75 percent</td><td>0.688</td><td>20.63</td><td>16.50</td></tr>
<tr><td>85 percent</td><td>0.813</td><td>24.38</td><td>19.50</td></tr>
<tr><td>90 percent</td><td>0.875</td><td>26.25</td><td>21.00</td></tr>
</tbody>
</table>
<p>Read the two right hand columns against each other. Thirty attempts at 75 percent scores 20.63. Twenty four attempts at 90 percent scores 21.00. The candidate who attempted six fewer questions scored more, and did it with six questions worth of time in hand. That is the whole case for a narrow, disciplined attempt band, and it is why chasing your attempt count as though it were the score is the classic second attempt error.</p>
<h2>The guess, priced properly</h2>
<p>A blind choice among four options returns 0.25 minus 0.75 multiplied by 0.25, which is 0.0625 marks. Ten blind guesses therefore return about 0.63 marks on average, with a spread several times that size, so the realistic outcomes run from losing a mark and a half to gaining three. It is not a strategy, it is noise. Eliminate one option and p rises to one third, which returns 0.167 a question; eliminate two and p is a half, returning 0.375. Elimination, not guessing, is what pays.</p>
<p>The practical rule follows: guess only in the closing seconds of a section, only on questions you were never going to reach, and only where you have knocked out at least one option. In the middle of a section a guess costs the thing that is actually scarce, which is time.</p>
<h2>Set economics in reasoning</h2>
<p>A five question puzzle solved in 270 seconds returns five marks, or 54 seconds a mark, which is the best rate anywhere in the paper. The same puzzle abandoned at 240 seconds has consumed a fifth of the section and returned nothing. The distribution is brutal at the tails, so the decision has to be made before you commit. Reject a set whose clues are almost all comparative, one that leaves more than two positions completely unconstrained after the first read, or one that adds a third variable to an already long list.</p>
<h2>Traps that cost a prepared candidate the cycle</h2>
<ul>
<li><strong>Building the ceiling.</strong> Extra hours go to the section you enjoy, so the strong section reaches 26 and the weak one stays at 11. The clock will not let the strong section rescue the weak one.</li>
<li><strong>Restarting a solved question.</strong> You reach the second pass, distrust an answer from the first, and redo it. That is 60 seconds spent to change nothing. Trust the first pass unless you have found an actual error.</li>
<li><strong>Leaving the palette dirty.</strong> Marked for review is not an answer. Sweep the palette with two minutes left, every time, in practice as well as in the paper.</li>
<li><strong>Reading order as difficulty order.</strong> The paper is not arranged easy to hard. A twelve second question can sit at number 34.</li>
<li><strong>Planning to the last cycle's cut-off.</strong> The shortlist is a multiple of the vacancies notified, so the cut-off is produced by that cycle and cannot be a target you set beforehand.</li>
</ul>`,
      Expert: `<p>Last month sheet. Nothing here is new. It is the material you should be able to state in two lines each while walking into the centre.</p>
<h2>The clock, in numbers</h2>
<table>
<thead><tr><th>Quantity</th><th>Value</th><th>Consequence</th></tr></thead>
<tbody>
<tr><td>Section length</td><td>20 minutes, 1200 seconds</td><td>Unused seconds are destroyed, not carried</td></tr>
<tr><td>24 attempts in a section</td><td>50 seconds each</td><td>Reading time is inside the 50, not extra</td></tr>
<tr><td>28 attempts in a section</td><td>43 seconds each</td><td>Only sustainable in reasoning, with clean sets</td></tr>
<tr><td>One five question set</td><td>240 to 280 seconds</td><td>A failed set costs a fifth of the section</td></tr>
<tr><td>Penalty</td><td>0.25 a wrong answer</td><td>Break-even accuracy is 20 percent</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li><strong>Forty seconds.</strong> If it has not opened by forty, flag and go. Coming back is cheap, staying is not.</li>
<li><strong>Sweep, then dig.</strong> Twelve minutes for the first pass, six for the second, two to close the palette.</li>
<li><strong>Sets before singles in reasoning, singles before sets in quantitative aptitude.</strong> Reasoning marks live in puzzles, quantitative marks live in simplification and approximation.</li>
<li><strong>Elimination beats guessing.</strong> One option removed turns 0.06 a question into 0.17.</li>
<li><strong>Accuracy before attempts.</strong> Twenty four at ninety beats thirty at seventy five, and leaves time behind.</li>
<li><strong>A flagged blank is a blank.</strong> The colour of the tile is not a mark.</li>
</ul>
<h2>Closing checklist for the section</h2>
<ol>
<li>With two minutes left, stop solving and open the palette.</li>
<li>Answer every question where two options are already eliminated.</li>
<li>Confirm no question is left in the answered state by accident on an option you did not intend.</li>
<li>Do not begin a new set. There is no partial credit for a half built grid.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>The order in which sections are served is fixed by the platform for that cycle and is stated on the instructions page. Read it, because your sweep plan assumes an order.</li>
<li>Whether a minimum qualifying mark applies within a section is set by that cycle's notification. Prepare as though a collapsed section ends the attempt, because on the clock it very nearly does.</li>
<li>A technical pause at the centre is compensated by the invigilation system, not by you. Do not attempt to make up lost seconds by abandoning your plan.</li>
<li>The clerical paper carries the same structure with numerical ability in place of quantitative aptitude, so the same budget arithmetic applies without change.</li>
</ul>`,
    },
  },
  30703: {
    topicId: 30703,
    title: "A four month plan from prelims to mains",
    summary:
      "Sixteen weeks is enough to reach this examination properly, but only if each block of weeks has one job and is judged on whether it did that job rather than on hours consumed. This topic gives you the phase structure, the weekly hour split inside each phase, and the analysis loop that turns a mock from a score into next week's work.",
    concepts: [
      "Phase structure",
      "Daily awareness thread",
      "Mock analysis loop",
      "Error bucket classification",
      "Mains only topics",
      "Weekly review",
    ],
    glossary: {
      "Phase structure":
        "The division of a preparation period into blocks that each carry a single objective, so a week can be judged against that objective instead of against the number of hours it swallowed.",
      "Awareness thread":
        "A short fixed slot repeated daily over months, reserved for material that accumulates by the day and therefore cannot be compressed into a final revision: current affairs, banking developments, scheme names and appointments.",
      "Mock analysis":
        "The work done after a mock rather than during it. Every question you did not answer correctly is reopened, resolved without a clock, and then labelled by the reason it was lost.",
      "Error bucket":
        "One of the small set of named reasons a mark goes missing: the concept was not known, the method was known but the arithmetic slipped, the question was misread, the time ran out, or the question should never have been started.",
      "Mains only topic":
        "A topic that cannot appear in the preliminary paper and therefore has no claim on the first phase: caselet and missing data interpretation, machine input output, computer aptitude, banking and economy awareness, and the descriptive paper.",
      "Taper":
        "The deliberate reduction of load in the days before a paper, so that you arrive rested and revising rather than exhausted and learning something new.",
    },
    body: {
      Beginner: `<p>A plan is not a timetable of hours. It is a decision about what each part of your preparation is for. Sixteen weeks split into four blocks of four gives you enough room to learn the subjects properly and still practise them under a clock, provided you do not spend week fourteen still learning percentages.</p>
<h2>The four blocks</h2>
<ol>
<li><strong>Weeks 1 to 6, learning.</strong> You build the calculation base and go through each subject once, without a clock. Getting it right matters here. Getting it fast does not yet.</li>
<li><strong>Weeks 7 to 11, speed.</strong> Now the clock goes on. You practise sections in twenty minute blocks and sit full mock papers, two a week at first and three later.</li>
<li><strong>Week 12, the preliminary paper.</strong> You reduce the load, revise, sleep properly and sit the paper.</li>
<li><strong>Weeks 13 to 16, mains.</strong> You move to the subjects the preliminary paper never asked about, and to harder versions of the ones it did.</li>
</ol>
<h2>How much time is honest</h2>
<p>A candidate with a job or a college can find about two and a half hours on a weekday and six hours on each day of the weekend. That comes to roughly 24 hours a week, and over sixteen weeks it is close to 384 hours. A candidate with the full day free can do about 36 hours a week. Both are enough. Twelve hours a day for a fortnight followed by nothing is not.</p>
<h2>The habit to start today</h2>
<p>Thirty minutes every single day on general and banking awareness, beginning in week one. This is the one subject that cannot be crammed, because it is made of things that happen day by day over months. Half an hour a day for sixteen weeks is 56 hours, and it will earn you more marks than any other 56 hours you spend.</p>
<h2>What a week looks like in the learning block</h2>
<ul>
<li>About 7 hours on quantitative aptitude, one chapter at a time.</li>
<li>About 6 hours on reasoning, mostly puzzles once the basics are done.</li>
<li>About 4 hours on English, including one editorial read each day.</li>
<li>Three and a half hours on the awareness thread, thirty minutes daily.</li>
<li>Three and a half hours on one timed section and the work of going through it afterwards.</li>
</ul>
<h2>The rule that keeps the plan alive</h2>
<p>At the end of each week, write down what you did not finish and move it into the next week before you add anything new. A plan that never absorbs its own slippage stops being a plan by about week five.</p>`,
      Intermediate: `<p>The plan below assumes about 24 hours a week and sixteen weeks. Scale the hours if your week is different, but do not scale the phases: the order in which the blocks appear is the part that matters, because every phase depends on the one before it having actually been done.</p>
<h2>The sixteen weeks</h2>
<table>
<thead><tr><th>Weeks</th><th>Objective</th><th>What you are doing</th></tr></thead>
<tbody>
<tr><td>1 to 3</td><td>Foundation A</td><td>Calculation base, then percentage, ratio, average, profit and loss, interest. Inequality, syllogism, coding decoding and direction sense. English grammar core. Awareness thread starts on day one.</td></tr>
<tr><td>4 to 6</td><td>Foundation B</td><td>Time and work, speed and distance, mixtures, partnership. Puzzles and seating from easy to moderate. Reading comprehension. First data interpretation sets, untimed.</td></tr>
<tr><td>7 to 9</td><td>Prelims speed</td><td>Sectional drills on the twenty minute clock. Two full mocks a week rising to three. Two hours a week begins on the mains only topics.</td></tr>
<tr><td>10 to 11</td><td>Sharpening</td><td>Three mocks a week, repair work drawn from the analysis, no new topic taken up at all.</td></tr>
<tr><td>12</td><td>The paper</td><td>Taper to one mock, revise formula and connector sheets, sleep, sit the preliminary paper.</td></tr>
<tr><td>13 to 14</td><td>Mains switch</td><td>Caselet and missing data interpretation, three variable puzzles, machine input output, computer aptitude. Awareness second pass.</td></tr>
<tr><td>15 to 16</td><td>Mains finish</td><td>Two mains mocks a week with their analysis, a letter and an essay twice a week, awareness third pass on a compressed sheet.</td></tr>
</tbody>
</table>
<h2>The weekly hour split, by phase</h2>
<table>
<thead><tr><th>Phase</th><th>Where the 24 hours go</th></tr></thead>
<tbody>
<tr><td>Foundation</td><td>Quantitative 7, reasoning 6, English 4, awareness 3.5, one timed section with analysis 3.5</td></tr>
<tr><td>Prelims speed</td><td>Mocks with analysis 9, sectional drills 6, weak area repair 5, awareness 3.5</td></tr>
<tr><td>Mains</td><td>Data interpretation 6, mains reasoning and computer aptitude 6, awareness 5, English and descriptive 4, mains mock with analysis 3</td></tr>
</tbody>
</table>
<h2>The analysis loop, which is where mocks actually pay</h2>
<p>Budget two hours of analysis for every one hour mock. A mock sat and scored and left alone has taught you a number. A mock analysed has taught you next week's syllabus.</p>
<ol>
<li>Before looking at the key, reopen every question you left blank and every one you were unsure of, and solve them without a clock. This separates what you cannot do from what you could not do in fifty seconds.</li>
<li>Now check against the key and label every lost mark with one error bucket.</li>
<li>Count the buckets. Take the two largest and convert them into named drills for the coming week.</li>
<li>Record three numbers only: attempts, accuracy and net score, section by section. A single total hides the section that is sinking you.</li>
</ol>
<h2>The five buckets and what each one tells you to do</h2>
<ul>
<li><strong>Concept not known.</strong> You are still in the foundation phase for that chapter whatever the calendar says. Go back to it.</li>
<li><strong>Method known, arithmetic slipped.</strong> Calculation drills, ten minutes daily, tables and percentage fractions.</li>
<li><strong>Question misread.</strong> Add five seconds to the read and underline the quantity actually asked for. This bucket is cheap to empty and candidates ignore it for months.</li>
<li><strong>Ran out of time on it.</strong> Your leave discipline slipped, not your mathematics.</li>
<li><strong>Should never have started it.</strong> A selection error. Practise rejecting sets, which is a drill in its own right.</li>
</ul>
<h2>The weekly review</h2>
<p>Thirty minutes at the end of every week. Write what was planned, what was done, what slipped, and where the slippage now sits in next week. Then look at the bucket counts across the week's mocks and confirm the plan for the coming week actually addresses the two largest.</p>`,
      Advanced: `<p>If you have sat this paper before, the mistake to avoid is starting again from week one. You are not a beginner, you are a candidate with a diagnosis waiting to be read, and the sixteen weeks should be reallocated around that diagnosis rather than spent re-teaching chapters you already know.</p>
<h2>Replace the first fortnight with a diagnostic</h2>
<p>Weeks 1 and 2 become four full mocks under real conditions, spaced, each with its two hours of analysis, plus one mains paper if you reached that stage last time. Then read the numbers rather than your memory of the attempt. Attempts and accuracy separately, section by section, with the bucket counts beside them. Almost every candidate discovers that the story they had been telling themselves is wrong in one specific way: the section they blame is not the section losing the marks, or the losses are in selection and timing rather than in knowledge.</p>
<p>Only after that do you write the remaining fourteen weeks, and now the foundation work is targeted at three or four named chapters instead of at the whole syllabus.</p>
<h2>The structural error that decides most second attempts</h2>
<p>The gap between the preliminary result and the main examination is short, commonly of the order of four to six weeks, and the first part of it goes to waiting for the result. Inside that gap you cannot learn caselet data interpretation, build three variable puzzles to speed, accumulate six months of awareness and rehearse a descriptive paper. It is not enough time, and every cycle a large number of candidates who cleared prelims comfortably discover this together.</p>
<p>So the mains only topics start in week 7, at two hours a week, while prelims practice is still running. Two hours a week for five weeks is ten hours, which is enough to be past the beginner stage on caselet DI and input output before the preliminary paper is even sat. The awareness thread has been running since week one for the same reason.</p>
<h2>Where the marginal hour actually goes</h2>
<table>
<thead><tr><th>Candidate profile</th><th>Marginal hour belongs to</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Cleared prelims, lost mains</td><td>Data interpretation and awareness</td><td>DI carries 60 of the 200 objective marks and awareness offers 40 marks at the highest answering speed in the paper</td></tr>
<tr><td>Missed prelims by a few marks</td><td>The weakest section only</td><td>Sectional timing means the strong section cannot rescue the weak one, so the floor is the score</td></tr>
<tr><td>High accuracy, low attempts</td><td>Calculation drills and set selection</td><td>The knowledge is present, the throughput is not</td></tr>
<tr><td>High attempts, low accuracy</td><td>Leave discipline and the misread bucket</td><td>Attempting below break-even accuracy subtracts marks rather than adding them</td></tr>
<tr><td>Reached the interview</td><td>Mains, not interview coaching</td><td>One mains mark is worth about 1.8 interview marks in the final scaling</td></tr>
</tbody>
</table>
<h2>Failure modes of the plan itself</h2>
<ul>
<li><strong>Mock addiction.</strong> Three mocks a week with no analysis is less useful than one mock a week with two hours of analysis. The paper does not teach, the review does.</li>
<li><strong>Studying in syllabus order.</strong> The syllabus is a list, not a ranking. Puzzles and arrangement carry most of the reasoning marks and should get most of the reasoning hours from week four onward.</li>
<li><strong>Leaving the descriptive paper unwritten.</strong> Twenty five marks, and a rehearsed letter structure takes six sittings to build. It is the most predictable scoring on the whole paper and the most commonly skipped.</li>
<li><strong>Never revisiting a solved chapter.</strong> Anything learnt in week 2 and not touched since is gone by week 12. Every phase carries a revision slot, not just the last one.</li>
<li><strong>Refusing to absorb slippage.</strong> Illness, work and family will take a week from you. Build the plan with fourteen working weeks and two spare, and use the spare when it is needed rather than pretending it will not be.</li>
</ul>`,
      Expert: `<p>Compression sheet. Use it to audit a plan you already have, or to rebuild one in twenty minutes.</p>
<h2>Phase objectives in one line each</h2>
<table>
<thead><tr><th>Phase</th><th>Weeks</th><th>Done when</th></tr></thead>
<tbody>
<tr><td>Foundation</td><td>1 to 6</td><td>Every prelims chapter attempted correctly at least once, untimed</td></tr>
<tr><td>Prelims speed</td><td>7 to 11</td><td>Three consecutive mocks clearing your target net with stable accuracy</td></tr>
<tr><td>Paper week</td><td>12</td><td>Load reduced, formula sheets revised, nothing new opened</td></tr>
<tr><td>Mains</td><td>13 to 16</td><td>Two mains mocks analysed, four letters and four essays written to time</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li><strong>Awareness from day one.</strong> Thirty minutes daily, never in a block at the end. It accumulates, so it cannot be crammed.</li>
<li><strong>Mains only topics from week seven.</strong> The post prelims gap is too short to start them in, and half of it is spent waiting for a result.</li>
<li><strong>Two hours of analysis for one hour of mock.</strong> If you cannot afford the analysis, you cannot afford the mock.</li>
<li><strong>Three numbers per section.</strong> Attempts, accuracy, net. A single total conceals the section that is failing.</li>
<li><strong>Fourteen working weeks in a sixteen week plan.</strong> The two spare weeks are for the disruption that will certainly arrive.</li>
<li><strong>No new topic in the last ten days before a paper.</strong> Revision compounds, novelty does not.</li>
</ul>
<h2>Weekly review, four questions</h2>
<ol>
<li>Which two error buckets were largest across this week's papers, and does next week address them by name?</li>
<li>Did attempts rise while accuracy fell, in any section? If so, the gain is not real.</li>
<li>What slipped, and where exactly has it been rescheduled to?</li>
<li>Has the weakest section had more hours this week than the strongest?</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A clerical candidate has no descriptive paper and no interview, so those hours move to mains reasoning with computer aptitude and to the awareness section, and the local language requirement is handled as a documents task, not a study task.</li>
<li>If prelims and mains for two different recruiting bodies fall in the same window, run the shared syllabus once and keep only the differences as separate work.</li>
<li>A candidate joining the plan late runs foundation A and B together at reduced depth and does not shorten the speed phase, because throughput takes longer to build than knowledge.</li>
<li>A result that arrives late compresses the mains phase, which is exactly the case the week seven start of mains only topics is insuring against.</li>
</ul>`,
    },
  },
};

export default PART;
