/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 9.
 *
 * Topics 30711, 30712 and 30713: the first three topics of the reasoning
 * module, and 30715: the reading comprehension topic that opens the English
 * module. Part 6 owns 30714 and part 5 owns 30717, so input output, cloze,
 * fillers and para jumbles are deliberately not taught again here.
 *
 * Every puzzle, arrangement and syllogism printed below has been solved by hand
 * and the grid shown is the grid the clue list actually produces. Exam
 * mechanics are stated as the paper sets them: prelims is sectionally timed and
 * qualifying only, a wrong answer costs a quarter of a mark, and no vacancy
 * count, fee, cut-off or examination date appears anywhere in this file.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30711: {
    topicId: 30711,
    title: "Puzzles: floors, boxes and scheduling",
    summary:
      "Puzzles and arrangement are the largest single block of marks in the reasoning section, and they are won by the order in which the clues are used rather than by cleverness. You learn to open a grid on a definite clue, to split into cases only when the frame refuses to close, and to decide inside ninety seconds whether a set deserves your remaining minutes at all.",
    concepts: [
      "Floor puzzle grids",
      "Box stacking constraints",
      "Scheduling puzzles with months and dates",
      "Negative information",
      "Case splitting and elimination",
      "Puzzle selection under sectional timing",
    ],
    glossary: {
      "Floor puzzle":
        "A set that places persons on the numbered floors of a building, one person to a floor, with floor 1 at the bottom unless the paper says otherwise. Every relation in it is a difference between two floor numbers.",
      "Box puzzle":
        "The same structure as a floor puzzle with boxes stacked one above another instead of persons on floors, which matters only because a stack is often drawn downward by candidates and upward by setters.",
      "Scheduling puzzle":
        "A set that places persons in months, dates or days rather than floors. It behaves identically once the periods are written in calendar order and numbered, and a month clue can smuggle in a second fact such as the count of days.",
      "Definite clue":
        "A clue that fixes a position outright without needing any other clue, such as a count of how many persons stand above a named person. These open the grid and are used first.",
      "Floating clue":
        "A clue that fixes a distance or an order between two persons but no position, so the pair behaves as a block that can still slide along the grid until something stops it.",
      "Negative information":
        "A clue that states where somebody is not. It places nobody on its own, so it earns its marks only at the end, by deleting cases that a frame has already produced.",
    },
    body: {
      Beginner: `<p>A reasoning puzzle gives you a set of persons, a set of places for them, and a list of clues. Nothing in it needs arithmetic or general knowledge. Everything you need is printed on the paper, and the only skill being tested is the order in which you use it.</p>
<h2>The three shapes you will meet</h2>
<ul>
<li>A <strong>floor puzzle</strong> places persons on the floors of a building. Floors are counted from the bottom, so floor 1 is the lowest and the topmost floor carries the highest number.</li>
<li>A <strong>box puzzle</strong> stacks boxes one above another. It is the same shape as a floor puzzle wearing a different word, so the same drawing works.</li>
<li>A <strong>scheduling puzzle</strong> places persons in months, dates or days of a week, which are floors laid on their side.</li>
</ul>
<h2>Clues are not equal, so do not use them in the printed order</h2>
<p>Some clues fix a position by themselves, such as a clue saying that only two persons live above a named person. Others fix only a relation, such as a clue saying that one person lives immediately above another; that pair can still slide up and down the building. A third kind says where somebody is not. Place the fixing clues first, hang the relations off them, and keep the negative clues for the very end.</p>
<h2>A box puzzle, worked</h2>
<p>Five boxes P, Q, R, S and T are placed one above another. Box R is at the top. Box Q is placed immediately above box S. Only one box lies between box S and box T, and T lies below S.</p>
<ol>
<li>Number the places 1 at the bottom to 5 at the top. R is at the top, so R takes place 5.</li>
<li>One box lying between S and T means their places differ by two, and T is the lower of them, so S sits two places above T.</li>
<li>If S were at place 4, then Q would need place 5, which R already holds. So S sits at place 3, T at place 1 and Q at place 4.</li>
<li>Only place 2 is left, so P takes it.</li>
</ol>
<p>Read from the bottom, the stack is T, P, S, Q, R. Every clue holds, and any question the set asks is now read off this line rather than worked out afresh.</p>
<h2>What one set is worth</h2>
<p>A puzzle set usually carries five questions, which is five marks out of the thirty five in the prelims reasoning section. A wrong answer takes away a quarter of a mark, so a half solved grid answered by feel gives back marks you had already earned elsewhere in the paper. Close the grid completely, or leave the set alone.</p>
<h2>The habit that decides this topic</h2>
<p>Draw the empty grid before you read the second clue. Candidates who read the whole clue list first and only then start drawing have to read it all again, and reading time is the one thing the sectional clock genuinely takes away from you.</p>`,
      Intermediate: `<p>Puzzles and arrangement carry more marks than any other reasoning type in this examination. The difference between two candidates on the same set is almost never speed of thought. It is the order in which the clues were used.</p>
<h2>Triage the clue list first</h2>
<p>Read the clues once and mark each with one of three letters on your rough sheet.</p>
<ul>
<li><strong>D for definite.</strong> The clue fixes a position on its own: only three persons live above a named person, a named person is at the bottom of the stack, a verification falls in the month with the fewest days.</li>
<li><strong>R for relation.</strong> The clue fixes a distance or an order but no place. Two persons live between two named persons, one lives immediately above another. A relation is a block that slides.</li>
<li><strong>N for negative.</strong> The clue says where somebody is not. It places nobody, so it is held back and spent on killing cases.</li>
</ul>
<h2>A seven floor puzzle, worked</h2>
<p>Seven aspirants, Anitha, Bhaskar, Chandana, Divya, Eshwar, Farhana and Gopal, live on the seven floors of one building, floor 1 the lowest and floor 7 the topmost. Only two persons live above Chandana. Bhaskar lives immediately above Chandana. Three persons live between Bhaskar and Gopal. Divya lives immediately below Gopal. Anitha lives on an odd numbered floor above Gopal. Farhana lives immediately above Anitha.</p>
<ol>
<li>Only two persons live above Chandana. The count of floors above floor n in a seven floor building is seven minus n, so Chandana is on floor 5. That is the definite clue, and it opens the grid.</li>
<li>Bhaskar lives immediately above Chandana, so Bhaskar is on floor 6.</li>
<li>Three persons living between Bhaskar and Gopal means the two floors differ by four. Bhaskar is on floor 6, and floor 10 does not exist, so Gopal is on floor 2.</li>
<li>Divya lives immediately below Gopal, so Divya is on floor 1.</li>
<li>Anitha is on an odd numbered floor above floor 2, which allows 3, 5 or 7. Floor 5 belongs to Chandana. Farhana must sit immediately above Anitha, so Anitha cannot be on floor 7. Anitha takes floor 3 and Farhana floor 4.</li>
<li>Eshwar takes the only floor left, floor 7.</li>
</ol>
<table>
<thead><tr><th>Floor</th><th>Aspirant</th></tr></thead>
<tbody>
<tr><td>7</td><td>Eshwar</td></tr>
<tr><td>6</td><td>Bhaskar</td></tr>
<tr><td>5</td><td>Chandana</td></tr>
<tr><td>4</td><td>Farhana</td></tr>
<tr><td>3</td><td>Anitha</td></tr>
<tr><td>2</td><td>Gopal</td></tr>
<tr><td>1</td><td>Divya</td></tr>
</tbody>
</table>
<p>Notice what actually did the work. One definite clue opened the grid, three relations were hung off it in turn, and the last placement was decided by a fact about what was already occupied. Almost every set has that shape.</p>
<h2>Scheduling sets are floors laid flat</h2>
<p>A scheduling set gives months, dates or days instead of floors, and once you have written the periods in calendar order and numbered them the arithmetic is identical. The one addition is that a period clue can carry a second fact: a month of 30 days, a month with the fewest days, the first half of a month meaning dates up to the fifteenth. Write those facts against the numbers before you begin, because a clue of that kind is a definite clue in disguise.</p>
<p>Worked in brief. Five document verifications fall in February, April, June, September and December of one year, numbered 1 to 5 in that order. Only two verifications happen after Ravi's, so Ravi is third, in June. Kavya's is in the period immediately before Ravi's, so Kavya is in April. Suresh is not in the month with the fewest days, so Suresh is not in February. If Suresh were in December, then two verifications between Suresh and Nazia would put Nazia in April, which Kavya holds. So Suresh is in September, Nazia in February, and December is left for Deepak.</p>
<h2>The counting rule that costs the most marks</h2>
<p>Two persons live between X and Y means the floor numbers differ by three. X lives two floors above Y means they differ by two. Those are different sentences and setters put both forms in the same clue list on purpose, because a candidate who converts one of them wrongly produces a grid that closes cleanly and is entirely wrong.</p>`,
      Advanced: `<p>You can already draw a grid. On a repeat attempt your marks move on two decisions and no others: when to split into cases, and when to walk away from a set.</p>
<h2>Splitting into cases, and closing them</h2>
<p>Split only when the frame refuses to close, and split on the clue with the fewest branches rather than on the first clue that offers a branch.</p>
<p>Six persons, Kiran, Latha, Manoj, Nagma, Pallavi and Ravi, live on six floors, floor 1 the lowest. Two persons live between Kiran and Latha, and Latha lives above Kiran. Manoj lives immediately above Latha. Nagma lives below Kiran.</p>
<ol>
<li>The gap clue gives a difference of three with Latha higher, so the pair sits at floors 1 and 4, or 2 and 5, or 3 and 6. Three branches, and no other clue branches less.</li>
<li>Manoj lives immediately above Latha, so Latha cannot be on floor 6. The 3 and 6 case dies.</li>
<li>Nagma lives below Kiran, so Kiran cannot be on floor 1. The 1 and 4 case dies.</li>
<li>One case survives: Kiran on 2, Latha on 5, Manoj on 6, Nagma on 1, with Pallavi and Ravi to be placed on floors 3 and 4.</li>
</ol>
<p>A set of this shape then finishes with a negative clue, such as Ravi does not live immediately above Kiran, which puts Ravi on floor 4 and Pallavi on floor 3. That negative clue was worth nothing at all until two cases had been killed, which is exactly why it is spent last.</p>
<h2>The traps, and the check that kills each one</h2>
<table>
<thead><tr><th>Trap</th><th>How it is written</th><th>Check</th></tr></thead>
<tbody>
<tr><td>Between against above</td><td>Three persons live between X and Y, set beside X lives three floors above Y</td><td>Between converts to a difference of four, above to a difference of three</td></tr>
<tr><td>Direction left open</td><td>A gap clue that never says which of the two is higher</td><td>Carry both orders as cases until a later clue fixes one</td></tr>
<tr><td>Numbering assumed</td><td>A stack of boxes where the paper numbers from the top</td><td>Read the numbering sentence before drawing; it is always printed</td></tr>
<tr><td>Neighbour against immediately</td><td>X and Y are neighbours, set beside X sits immediately above Y</td><td>Neighbour allows both orders, immediately above allows one</td></tr>
<tr><td>Second variable attached early</td><td>Districts or posts attached while the floors are still open</td><td>Close the primary line first, then attach the variable in one pass</td></tr>
</tbody>
</table>
<h2>The clock, and the abandon rule</h2>
<p>Prelims reasoning is thirty five questions on a sectional clock of twenty minutes, which is about thirty four seconds a question with nothing spare. A five question set that takes four minutes has consumed the time of seven questions. Give a set ninety seconds to yield its first definite placement. If none has appeared, either the clue list is under determined at the start or you have misread the numbering, and in both cases the set is a poor use of the minutes you have left.</p>
<p>In officer mains the arithmetic changes and the rule must change with it. Reasoning and computer aptitude runs forty five questions on its own longer sectional clock, the puzzles carry two variables rather than one, and a set can honestly be worth five minutes because there is no cheaper set to move to. Judge a set against the alternatives on the paper in front of you, not against a rule you memorised for prelims.</p>
<h2>Attempt arithmetic, done properly</h2>
<p>A closed set of five answered correctly earns five marks. The same set half solved, three attempted and two right, earns two minus a quarter, that is 1.75. Now guess the remaining two blind and expect half a mark from one right and half a mark of penalty from the other, which is nothing. Guessing inside a puzzle set is worse than guessing elsewhere, because the wrong options are built out of the very cases you failed to eliminate, so your guessing rate is below one in four rather than at it.</p>
<h2>Where the marks are actually lost</h2>
<p>Three failures, in order of how often they occur. You copy a clue wrongly onto the rough sheet and never check the sheet against the paper again. You place a person on the strength of a clue that fixed a distance rather than a position. You close a grid, feel the relief, and then answer the five questions from memory instead of reading each one off the grid you spent four minutes building.</p>`,
      Expert: `<p>Revision sheet for puzzles. Treat it as a procedure to run, not as an explanation to read.</p>
<h2>Clue triage, in the order you apply it</h2>
<ol>
<li>Definite clues that fix a place outright. Place them on the grid.</li>
<li>Relation clues touching somebody already placed. Hang them off that person.</li>
<li>Relation clues touching nobody yet placed. Hold them as sliding blocks.</li>
<li>Negative clues. Hold to the end, then spend them on the surviving cases.</li>
</ol>
<h2>Wording to difference, memorised</h2>
<table>
<thead><tr><th>Wording in the clue</th><th>Difference in places</th></tr></thead>
<tbody>
<tr><td>Immediately above or immediately below</td><td>1</td></tr>
<tr><td>Only one person between</td><td>2</td></tr>
<tr><td>Two persons between</td><td>3</td></tr>
<tr><td>Three persons between</td><td>4</td></tr>
<tr><td>Two floors above</td><td>2</td></tr>
<tr><td>Only three persons above X, seven floors</td><td>X is on floor 4</td></tr>
<tr><td>As many above X as below X, seven floors</td><td>X is on floor 4</td></tr>
</tbody>
</table>
<h2>Rules you should not have to derive</h2>
<ul>
<li>Floors above a person on floor n of an N floor building equal N minus n. Say it once and the definite clue is placed.</li>
<li>A gap clue with no stated direction is two cases, never one.</li>
<li>A pair block slides until a definite clue or an end of the grid stops it.</li>
<li>Negative clues place nobody. They only delete.</li>
<li>Close the grid, then answer. Never answer off a partial grid.</li>
<li>Attach the second variable only after the primary line is closed.</li>
</ul>
<h2>Set selection on first read</h2>
<table>
<thead><tr><th>What you see</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>Persons and places equal, three or more definite clues</td><td>Attempt first</td></tr>
<tr><td>One variable, numbering stated plainly</td><td>Attempt</td></tr>
<tr><td>Two variables and no definite clue in the first three</td><td>Defer</td></tr>
<tr><td>Gap clues with direction nowhere stated</td><td>Defer</td></tr>
<tr><td>More persons than places, or a place that may stay empty</td><td>Leave unless minutes are spare</td></tr>
</tbody>
</table>
<h2>Last fortnight drill</h2>
<ol>
<li>Six sets a day. Four timed at four minutes with a hard stop, two untimed and marked for accuracy alone.</li>
<li>After each set write one line naming the clue that opened it. Twenty such lines teach the opening clue faster than fifty solved sets.</li>
<li>Keep a page for every set you abandoned. In the last week resolve them untimed and check whether the abandon call was correct.</li>
<li>Do not end a study session on a set you could not close. Close an easy one and stop there.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Six aspirants live on six floors of one building, floor 1 being the lowest. Only two persons live above Harish. Sunita lives immediately below Harish. Two persons live between Sunita and Mohan. On which floor does Mohan live?",
        options: ["Floor 5", "Floor 6", "Floor 2", "Floor 1"],
        answer: 1,
        explanation:
          "The count of floors above floor n in a six floor building is six minus n, so only two above Harish fixes him on floor 4 and Sunita on floor 3. Two persons between Sunita and Mohan means the floors differ by three, and floor zero does not exist, so Mohan is on floor 6. Floor 5 is the planted trap, taken by candidates who read two persons between as a difference of two.",
        difficulty: "Easy",
        skill: "Floor puzzle grids",
      },
      {
        n: 2,
        question:
          "Five boxes A, B, C, D and E are placed one above another. Box C is at the bottom. Box D is placed immediately above box A. Only one box lies between box A and box E, and E lies below A. Which box is placed immediately above box B?",
        options: ["Box A", "Box D", "Box E", "Box C"],
        answer: 0,
        explanation:
          "C at the bottom takes place 1, and one box between A and E with E lower puts A two places above E, so the only fit leaving room for D immediately above A is E on 2, A on 4 and D on 5, which leaves place 3 for B. Box A therefore sits immediately above B. Box D attracts because the clue names D as the box immediately above something, but that something is A and not B.",
        difficulty: "Medium",
        skill: "Box stacking constraints",
      },
      {
        n: 3,
        question:
          "Five candidates attend document verification in five different months of one year: February, April, June, September and December. Only two verifications happen after Ravi's. Kavya's falls in the month immediately before Ravi's. Suresh is not in the month with the fewest days. Two verifications fall between those of Suresh and Nazia. Who is verified in December?",
        options: ["Suresh", "Nazia", "Deepak", "Kavya"],
        answer: 2,
        explanation:
          "Numbering the months in calendar order, only two verifications after Ravi puts him third, in June, so Kavya is in April. Suresh is not in February, and if he were in December then two between would place Nazia in April, which Kavya already holds, so Suresh is in September and Nazia in February, leaving December for Deepak. Suresh is the trap because December satisfies the not February clue and candidates stop testing at the first fit.",
        difficulty: "Medium",
        skill: "Scheduling puzzles with months and dates",
      },
      {
        n: 4,
        question:
          "A floor puzzle carries the clue that Vinay does not live immediately above or immediately below Rekha. When is this clue best used?",
        options: [
          "First, since it names two persons and therefore carries the most information",
          "Immediately after the definite clues, to fix Vinay's floor",
          "Last, to delete the cases that a completed frame has left standing",
          "Only if the definite clues fail to place anybody at all",
        ],
        answer: 2,
        explanation:
          "A negative clue places nobody, because stating where a person is not leaves every other floor open, so it can only delete arrangements that already exist on your sheet. The first option is tempting because a clue naming two persons feels informative, but until a frame exists there is nothing for it to delete and the clue has to be read again later.",
        difficulty: "Easy",
        skill: "Negative information",
      },
      {
        n: 5,
        question:
          "Six persons live on six floors, floor 1 being the lowest. Two persons live between Kiran and Latha, with Latha above Kiran. Manoj lives immediately above Latha. Nagma lives below Kiran. On which floor does Kiran live?",
        options: ["Floor 1", "Floor 2", "Floor 3", "Floor 4"],
        answer: 1,
        explanation:
          "Two persons between with Latha higher gives three cases, the pair sitting on floors 1 and 4, 2 and 5, or 3 and 6. Manoj immediately above Latha rules out Latha on floor 6, and Nagma living below Kiran rules out Kiran on floor 1, so only Kiran on floor 2 with Latha on floor 5 survives. Floor 1 attracts because it satisfies the gap clue perfectly well on its own and is killed only by the clue about Nagma.",
        difficulty: "Medium",
        skill: "Case splitting and elimination",
      },
      {
        n: 6,
        question:
          "You are eleven minutes into the twenty minute reasoning section of prelims. Three and a half of those minutes have gone on one five question puzzle, and you have placed only two of its six persons. What is the correct decision?",
        options: [
          "Continue, because the time already spent is wasted if you stop now",
          "Mark all five questions from the two placements you have and move on",
          "Leave the set, take the sets you have not yet read, and return only if minutes remain",
          "Read the clue list again from the beginning and rebuild the grid",
        ],
        answer: 2,
        explanation:
          "Time already spent cannot be recovered by spending more of it, and with nine minutes left the sets you have not opened are worth far more per minute than one that has resisted you for three and a half. Marking all five is worse still, since a wrong answer costs a quarter of a mark and the wrong options in a puzzle set are written out of exactly the cases you have not eliminated.",
        difficulty: "Medium",
        skill: "Puzzle selection under sectional timing",
      },
      {
        n: 7,
        question:
          "In a seven floor building numbered 1 at the bottom, a clue states that only three persons live above Deepika. Which floor does Deepika occupy?",
        options: ["Floor 3", "Floor 4", "Floor 5", "Floor 2"],
        answer: 1,
        explanation:
          "The number of floors above floor n in a seven floor building is seven minus n, so three persons above puts Deepika on floor 4. Floor 3 is the standard trap, chosen by candidates who count Deepika's own floor as one of the three, and the subtraction is worth saying out loud once for every clue of this shape.",
        difficulty: "Easy",
        skill: "Floor puzzle grids",
      },
    ],
  },
  30712: {
    topicId: 30712,
    title: "Seating arrangement: linear and circular",
    summary:
      "An arrangement set is five questions built on one drawing, so the drawing convention decides the marks and the clue list only fills it in. You fix the direction rule once for rows, for circles and for double rows, then treat every set as a placement exercise rather than as a puzzle to be outwitted.",
    concepts: [
      "Linear row and facing direction",
      "Circular arrangement with mixed facing",
      "Left and right as the person sees it",
      "Double row seating",
      "Gap counting and end positions",
      "Second variable seating sets",
    ],
    glossary: {
      "Linear arrangement":
        "A set that seats persons in one straight row, each seat holding one person, with the facing direction of the row stated in the opening line and applying to everybody unless the set says otherwise.",
      "Circular arrangement":
        "A set that seats persons around a table at equally spaced seats, so that positions are described by turning rather than by counting from an end, and there is no first or last seat.",
      "Facing outward":
        "Sitting with the back to the centre of the table. It reverses the person's sense of left and right relative to the seats, and nothing else about the set changes.",
      "Immediate neighbour":
        "The person sitting in the seat next to a named person on either side. A clue naming a neighbour without a side gives two cases, not one.",
      "Extreme end":
        "The first or the last seat of a row. An extreme end has only one neighbour, which is why setters use it as a cheap definite clue.",
      "Double row arrangement":
        "Two parallel rows seated so that each person in one row faces exactly one person in the other. The two rows face opposite ways, so their senses of left and right run opposite on your sheet.",
    },
    body: {
      Beginner: `<p>A seating arrangement set asks you to seat persons in a row or around a table using a list of clues. It is the same work as a floor puzzle with one extra idea, and that idea is the whole of the difficulty: left and right belong to the person sitting in the seat, not to you looking at the sheet.</p>
<h2>The rule for a row</h2>
<p>Draw every row the same way, with west at your left and east at your right. Now think about a person in that row who faces north. Their right hand points east, so their right is towards your right and their left is towards your left. A person facing south is turned around, so their right hand points west, and their right is towards your left.</p>
<p>That is the entire rule. Write the facing direction above the row on your rough sheet before you place a single person, because every clue in the set is read through it.</p>
<h2>A row of five, worked</h2>
<p>Naveen, Ojas, Pooja, Rani and Sameer sit in a row facing north. Pooja sits at the extreme right end. Naveen sits second to the left of Pooja. Rani sits immediately to the left of Naveen. Ojas does not sit at either extreme end.</p>
<ol>
<li>Number the seats 1 to 5 from your left. The row faces north, so left means a lower number and right means a higher one.</li>
<li>Pooja is at the extreme right end, so Pooja takes seat 5.</li>
<li>Second to the left of Pooja means two seats down from 5, so Naveen takes seat 3.</li>
<li>Rani is immediately to the left of Naveen, so Rani takes seat 2.</li>
<li>Ojas is not at an end, so Ojas cannot take seat 1. Only seats 1 and 4 remain, so Ojas takes seat 4 and Sameer takes seat 1.</li>
</ol>
<p>From your left the row reads Sameer, Rani, Naveen, Ojas, Pooja. Every question the set asks is now read off that line.</p>
<h2>Words that mean exactly one thing</h2>
<ul>
<li><strong>Extreme end</strong> means the first or the last seat, and such a seat has only one neighbour.</li>
<li><strong>Immediately to the left</strong> means the very next seat on that side, with nobody in between.</li>
<li><strong>Neighbour</strong>, with no side named, means either side, so it gives you two possibilities and not one.</li>
</ul>
<h2>What is at stake</h2>
<p>A set of this kind carries five questions. Because all five are read off one drawing, a direction rule applied backwards does not cost you one mark, it costs you the set, and each wrong answer also takes away a quarter of a mark. Spend the first ten seconds writing the facing direction down.</p>`,
      Intermediate: `<p>Every arrangement set is five questions hanging off one drawing. If the drawing is right the questions are a reading exercise. If the direction rule went in backwards, all five fall together, so this topic is taught as one convention and two worked drawings rather than as a list of puzzle types.</p>
<h2>Fix the convention before you read the clues</h2>
<p>Draw rows with west at your left. Draw circles with the seats numbered clockwise. Then two small tables cover every clue the paper can set.</p>
<table>
<thead><tr><th>Row faces</th><th>The person's right lies</th><th>The person's left lies</th></tr></thead>
<tbody>
<tr><td>North</td><td>Towards your right</td><td>Towards your left</td></tr>
<tr><td>South</td><td>Towards your left</td><td>Towards your right</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>At a table, the person faces</th><th>Left runs</th><th>Right runs</th></tr></thead>
<tbody>
<tr><td>The centre</td><td>Clockwise</td><td>Anticlockwise</td></tr>
<tr><td>Outward</td><td>Anticlockwise</td><td>Clockwise</td></tr>
</tbody>
</table>
<h2>A row of seven, worked</h2>
<p>Arun, Bindu, Chetan, Deepa, Eswari, Fahad and Ganesh sit in a row facing north. Bindu sits at the extreme left end. Only two persons sit between Bindu and Deepa. Chetan sits third to the right of Arun. Eswari sits immediately to the left of Chetan. Fahad is not a neighbour of Arun.</p>
<ol>
<li>Bindu takes seat 1. Two persons between Bindu and Deepa means the seats differ by three, so Deepa takes seat 4.</li>
<li>Chetan sits three seats higher than Arun. Arun cannot take seat 1 or seat 4, so the pair is Arun on 2 with Chetan on 5, or Arun on 3 with Chetan on 6.</li>
<li>Eswari sits immediately to the left of Chetan, one seat lower. In the first case that is seat 4, which Deepa holds, so the first case dies. Arun takes seat 3, Chetan seat 6 and Eswari seat 5.</li>
<li>Seats 2 and 7 remain. Fahad is not a neighbour of Arun on seat 3, so Fahad cannot take seat 2. Fahad takes seat 7 and Ganesh takes seat 2.</li>
</ol>
<table>
<thead><tr><th>Seat from your left</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead>
<tbody>
<tr><td>Person</td><td>Bindu</td><td>Ganesh</td><td>Arun</td><td>Deepa</td><td>Eswari</td><td>Chetan</td><td>Fahad</td></tr>
</tbody>
</table>
<h2>A circle of eight, worked</h2>
<p>Praveen, Qadir, Rohini, Sailaja, Tarun, Uma, Vikram and Yamini sit around a circular table facing the centre. Rohini sits third to the left of Praveen. Sailaja sits second to the right of Rohini. Tarun sits opposite Praveen. Uma sits second to the left of Tarun. Vikram is an immediate neighbour of both Tarun and Uma. Qadir sits immediately to the left of Sailaja.</p>
<ol>
<li>Number the eight seats 1 to 8 clockwise and put Praveen on seat 1. Facing the centre, left runs clockwise, so third to his left is seat 4, which is Rohini.</li>
<li>Second to the right of Rohini is two seats anticlockwise from seat 4, which is seat 2, so Sailaja sits there.</li>
<li>Opposite, at a table of eight, is four seats away, so Tarun sits on seat 5.</li>
<li>Second to the left of Tarun is two seats clockwise from 5, so Uma sits on seat 7.</li>
<li>Tarun's neighbours are seats 4 and 6, Uma's are seats 6 and 8, and the seat common to both is 6, so Vikram sits there.</li>
<li>Immediately to the left of Sailaja is one seat clockwise from 2, so Qadir sits on seat 3, and Yamini takes the last free seat, 8.</li>
</ol>
<p>Read clockwise from seat 1 the table is Praveen, Sailaja, Qadir, Rohini, Tarun, Vikram, Uma, Yamini.</p>
<h2>The counting slip that decides most of these sets</h2>
<p>Third to the left means three seats along. The persons sitting strictly between the two are therefore two, not three. Setters ask both forms in the same set, one question phrased as a position and the next as a count of persons in between, and the candidate who does not separate them answers one of the two wrongly every time.</p>`,
      Advanced: `<p>You can draw a circle and a row. On a repeat attempt the marks move on three things: mixed facing, the double row, and the decision to attach a second variable at the right moment rather than the first.</p>
<h2>Mixed facing is now the normal set</h2>
<p>A modern set tells you that some persons face the centre and some face outward, and then names them individually or by a rule such as the immediate neighbours of a named person facing outward. Do not carry this in your head. Draw an arrow at every seat as soon as the facing is known, pointing in or out, and read each direction clue off the arrow of the person the clue names. The direction always belongs to the person named in the clue, never to the person being placed.</p>
<h2>A double row, worked</h2>
<p>Amrita, Bhanu, Charan and Divakar sit in row 1 facing south. Eshwari, Firoz, Girish and Harini sit in row 2 facing north. Each person in row 1 faces exactly one person in row 2. Charan sits at an extreme end of row 1 and faces Girish. Girish sits second to the right of Eshwari. Bhanu sits second to the right of Charan. Divakar faces Firoz, and Firoz sits at an extreme end of row 2.</p>
<p>Draw the two rows one under the other, both numbered 1 to 4 from your left, so that column 1 of row 1 faces column 1 of row 2. Row 1 faces south, so its right runs towards a lower column number. Row 2 faces north, so its right runs towards a higher one. Those two directions run opposite on your sheet, and that single fact is what the set is testing.</p>
<ol>
<li>Girish is second to the right of Eshwari in row 2, so Girish sits two columns higher: Eshwari on 1 with Girish on 3, or Eshwari on 2 with Girish on 4.</li>
<li>Charan is at an extreme end of row 1 and faces Girish, so they share a column, and only column 4 is an extreme end among the two possibilities. Girish sits on 4, Charan on 4, and Eshwari on 2.</li>
<li>Bhanu is second to the right of Charan in row 1, which runs towards a lower column, so Bhanu sits on column 2.</li>
<li>Columns 1 and 3 remain in row 2, and Firoz is at an extreme end, so Firoz sits on column 1 and Harini on column 3. Divakar faces Firoz, so Divakar sits on column 1 of row 1, and Amrita takes column 3.</li>
</ol>
<table>
<thead><tr><th>Column from your left</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead>
<tbody>
<tr><td>Row 1, facing south</td><td>Divakar</td><td>Bhanu</td><td>Amrita</td><td>Charan</td></tr>
<tr><td>Row 2, facing north</td><td>Firoz</td><td>Eshwari</td><td>Harini</td><td>Girish</td></tr>
</tbody>
</table>
<h2>The traps and the check for each</h2>
<table>
<thead><tr><th>Trap</th><th>How it is written</th><th>Check</th></tr></thead>
<tbody>
<tr><td>Direction taken from the wrong person</td><td>X sits third to the left of Y, where X and Y face opposite ways</td><td>The direction belongs to Y, the person the clue counts from</td></tr>
<tr><td>Position against count</td><td>Third to the left, set beside two persons sit between them</td><td>Position n means n seats along and n minus one persons in between</td></tr>
<tr><td>Neighbour with no side</td><td>X is an immediate neighbour of Y</td><td>Two cases, held open until another clue closes one</td></tr>
<tr><td>Opposite in an odd circle</td><td>Sets with seven or nine seats have no exact opposite</td><td>Check the seat count before using an opposite clue at all</td></tr>
<tr><td>Row 1 given row 2's sense</td><td>The two rows of a double set face opposite ways</td><td>Write both arrows on the sheet, not one</td></tr>
</tbody>
</table>
<h2>The second variable, and when to attach it</h2>
<p>Mains sets add a district, a post or a month to each person. The seating clues are the only ones that can fix a seat, and a second variable can be attached to a seat but never used to find one. So close the line or the circle first, then attach the variable in a single pass. Candidates who build one grid holding seat and district together from the first clue lose mains sets regularly, because one wrong seat then spreads into a second column before anything looks wrong.</p>
<h2>The clock</h2>
<p>In prelims, reasoning is thirty five questions on a twenty minute sectional clock, and an arrangement set is worth about two and a half minutes if it is a single variable row or circle. In officer mains the reasoning and computer aptitude section runs forty five questions on its own longer clock, the sets carry two variables, and four to five minutes on one set can be the correct decision because the alternative sets on that paper are no cheaper. Judge against the paper in front of you.</p>`,
      Expert: `<p>Revision sheet for arrangement. Everything here is a lookup, not an argument.</p>
<h2>Direction, all four cases</h2>
<table>
<thead><tr><th>Situation</th><th>The person's left</th><th>The person's right</th></tr></thead>
<tbody>
<tr><td>Row facing north</td><td>Towards your left</td><td>Towards your right</td></tr>
<tr><td>Row facing south</td><td>Towards your right</td><td>Towards your left</td></tr>
<tr><td>Table, facing the centre</td><td>Clockwise</td><td>Anticlockwise</td></tr>
<tr><td>Table, facing outward</td><td>Anticlockwise</td><td>Clockwise</td></tr>
</tbody>
</table>
<h2>Counting, the two forms</h2>
<ul>
<li>Nth to the left or right means N seats along. The persons strictly in between are N minus one.</li>
<li>N persons sit between X and Y means the seats differ by N plus one.</li>
<li>Opposite, in a circle of 2N seats, means N seats away. A circle with an odd number of seats has no opposite at all.</li>
<li>In a row of N seats, the seat with N minus k persons to its right is seat k.</li>
</ul>
<h2>Opening moves, in order</h2>
<ol>
<li>Write the facing direction, or an arrow at every seat if the facing is mixed.</li>
<li>Place the extreme end and opposite clues, which are the definite ones.</li>
<li>Hang the nth to the left and right clues off whatever is placed.</li>
<li>Hold neighbour clues with no side named as two cases.</li>
<li>Spend the negative clues last, then attach any second variable in one pass.</li>
</ol>
<h2>Where a set is lost, and what it looks like</h2>
<table>
<thead><tr><th>Symptom on your sheet</th><th>What went wrong</th></tr></thead>
<tbody>
<tr><td>Grid closes but two questions have no valid option</td><td>A direction was read from the wrong person</td></tr>
<tr><td>Two persons want the same seat late in the set</td><td>A neighbour clue was taken as one case</td></tr>
<tr><td>Row 2 works and row 1 does not</td><td>One arrow was drawn for two rows</td></tr>
<tr><td>Everything fits but the answers feel reversed</td><td>The row was drawn east at your left</td></tr>
</tbody>
</table>
<h2>Drill for the final fortnight</h2>
<ol>
<li>Two sets a day at four minutes each: one circle with mixed facing, one double row. These two are where repeat attempters still lose marks.</li>
<li>After each set, re-read only the clues you used to place the first three persons and confirm each against the paper. Copying errors, not reasoning errors, cause most closed and wrong grids.</li>
<li>Once a week, take one set and answer its questions from the grid without re-reading the clue list. That is the habit the hall requires.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Eight persons sit around a circular table, all facing the centre. A clue states that Rohini sits third to the left of Praveen. From Praveen's seat, how do you count?",
        options: [
          "Three seats anticlockwise",
          "Three seats clockwise",
          "Four seats clockwise, because the count begins at the next seat",
          "Three seats either way, since a circle has no fixed sense",
        ],
        answer: 1,
        explanation:
          "A person facing the centre has the left hand pointing along the clockwise direction, so third to the left is three seats clockwise. Anticlockwise is the built trap and it is the right count only when the person faces outward, which is why a mixed facing set is marked seat by seat with an arrow before any direction clue is used.",
        difficulty: "Easy",
        skill: "Left and right as the person sees it",
      },
      {
        n: 2,
        question:
          "Latha, Mahesh, Naresh, Pavani, Rajesh and Swetha sit in a row facing north, drawn with the westmost seat at your left. Pavani sits at the extreme right end. Only two persons sit between Pavani and Naresh. Latha sits second to the left of Naresh. Mahesh is not an immediate neighbour of Latha. Rajesh sits immediately to the right of Mahesh. Who sits between Naresh and Rajesh?",
        options: ["Mahesh", "Swetha", "Latha", "Pavani"],
        answer: 0,
        explanation:
          "Pavani takes seat 6, and two persons between her and Naresh means the seats differ by three, so Naresh is on seat 3 and Latha, second to his left, on seat 1. Mahesh cannot neighbour Latha, so of the free seats 2, 4 and 5 he takes 4 or 5, and Rajesh immediately to his right forces Mahesh on 4 and Rajesh on 5, leaving Swetha on seat 2. Swetha is the trap, reached by reading two persons between as a difference of two.",
        difficulty: "Medium",
        skill: "Gap counting and end positions",
      },
      {
        n: 3,
        question:
          "At a circular table some persons face the centre and some face outward. Uma faces outward, and a clue says that Vikram sits second to the right of Uma. Where does Vikram sit?",
        options: [
          "Two seats anticlockwise from Uma",
          "Two seats clockwise from Uma",
          "Directly opposite Uma",
          "It cannot be decided until you know which way Vikram faces",
        ],
        answer: 1,
        explanation:
          "Uma has her back to the centre, so her right hand points along the clockwise direction and second to her right is two seats clockwise. The anticlockwise option is the trap for a candidate applying the facing centre rule by habit, and the last option attracts because facing does matter in these sets, but a direction clue is always read from the person it counts from, so Vikram's own facing is irrelevant to his seat.",
        difficulty: "Medium",
        skill: "Circular arrangement with mixed facing",
      },
      {
        n: 4,
        question:
          "In a double row set, row 1 faces south and row 2 faces north, and both rows are drawn one under the other with your own left at the left of the sheet. A clue says that Bhanu, in row 1, sits second to the right of Charan, also in row 1. On your sheet Bhanu sits where?",
        options: [
          "Two columns towards your right",
          "Two columns towards your left",
          "Two columns towards your right, exactly as in row 2",
          "Directly below Charan, in the facing row",
        ],
        answer: 1,
        explanation:
          "A person facing south has the right hand pointing west, and with the sheet drawn west at your left that puts row 1's right towards your left, so Bhanu sits two columns to your left of Charan. Row 2 runs the opposite way, and applying row 2's sense to row 1 is precisely the confusion the set is built on, since it reverses every placement in the upper row while the grid still appears to close.",
        difficulty: "Hard",
        skill: "Double row seating",
      },
      {
        n: 5,
        question:
          "Ten persons sit around a circular table facing the centre. P sits fourth to the left of Q. Counting clockwise from Q, how many persons sit between Q and P?",
        options: ["Two", "Three", "Four", "Five"],
        answer: 1,
        explanation:
          "Fourth to the left means four seats along, and since the persons counted are those strictly between the two seats, three persons lie on the way. Four is the standard off by one error, produced by counting P's own seat as one of the persons in between, and the same slip reverses in the other direction when a set asks for the position rather than the count.",
        difficulty: "Easy",
        skill: "Gap counting and end positions",
      },
      {
        n: 6,
        question:
          "A row of aspirants all face south, and you have drawn the row with west at your left and east at your right. Kamala sits third to the left of Bhavani. On your sheet, where is Kamala?",
        options: [
          "Three seats to your left of Bhavani",
          "Three seats to your right of Bhavani",
          "Two seats to your right of Bhavani",
          "At the opposite end of the row from Bhavani",
        ],
        answer: 1,
        explanation:
          "A person facing south has the left hand pointing east, and east is at your right on the sheet, so Kamala sits three seats to your right of Bhavani. Three seats to your left is the answer for a north facing row, and carrying that habit into a south facing set reverses the whole arrangement while leaving it looking perfectly consistent to you.",
        difficulty: "Medium",
        skill: "Linear row and facing direction",
      },
      {
        n: 7,
        question:
          "A mains arrangement set seats eight persons around a table and also gives each of them a different district and a different post. What is the correct order of work?",
        options: [
          "Attach the districts first, since more clues mention districts than seats",
          "Close the seating from the seating clues, then attach district and post in one pass",
          "Build one grid holding seat, district and post together from the first clue onward",
          "Settle the posts alone first, because post clues are usually stated definitely",
        ],
        answer: 1,
        explanation:
          "Only the seating clues can fix a seat, and a second variable can be attached to a seat but never used to find one, so closing the line first turns every remaining clue into a simple assignment. Building all three columns together looks efficient and is the commonest way a mains set is lost, because a single wrong seat spreads into two other columns before anything on the sheet looks wrong.",
        difficulty: "Medium",
        skill: "Second variable seating sets",
      },
    ],
  },
  30713: {
    topicId: 30713,
    title: "Syllogism, inequality and coding decoding",
    summary:
      "Syllogism, inequality and coding decoding are grouped together because each is decided by a small mechanical rule applied without hesitation, and because all three are the fastest marks available in the reasoning section. You learn the rules, the complementary pair convention that turns two failed conclusions into a correct answer, and the decoding routine that opens a coded language set from a single shared word.",
    concepts: [
      "Syllogism by Venn diagram",
      "Complementary pairs and either or",
      "Possibility conclusions",
      "Coded inequality",
      "Letter and number coding",
      "Coded language decoding",
    ],
    glossary: {
      Syllogism:
        "A question in which two or more statements are to be treated as true, whatever the world says, and you judge whether a printed conclusion must follow from them and not merely whether it sounds reasonable.",
      "Definite conclusion":
        "A conclusion that holds in every arrangement the statements allow. One that holds in some drawings and fails in others does not follow, however plausible it reads.",
      "Complementary pair":
        "Two conclusions that cannot both be false, such as some A are B set against no A is B. When neither follows on its own, one of them must hold, and the answer is that either of them follows.",
      "Possibility conclusion":
        "A conclusion phrased as something being a possibility. It is judged by whether one valid drawing of the statements shows it, not by whether every drawing does.",
      "Coded inequality":
        "An inequality set in which symbols stand for relations such as not smaller than or neither greater than nor equal to. The symbols are translated into ordinary signs before anything is combined.",
      "Coded language":
        "A set in which each sentence is given with its code words in no stated order, so the mapping is recovered by comparing two sentences that share exactly one word and exactly one code.",
    },
    body: {
      Beginner: `<p>Three question types are taught together here because each is decided by one small rule, and because none of them needs anything you know from outside the paper.</p>
<h2>Syllogism</h2>
<p>You are given two or three statements and some conclusions, and you decide which conclusions follow. The first rule is uncomfortable and it is the whole topic: the statements are treated as true even when they are false in the world. If a statement says all shares are bonds, then for the length of that question every share is a bond, whatever you know about shares.</p>
<p>Draw each statement as circles on the rough sheet. All A are B is a small circle A drawn entirely inside a larger circle B. No A is B is two circles that never touch. Some A are B is two circles that overlap. Some A are not B is A drawn with a part of it outside B.</p>
<p>Worked. Statements: all shares are bonds, all bonds are papers. Draw shares inside bonds and bonds inside papers. The conclusion that all shares are papers is now visible in the drawing, so it follows. So does the conclusion that some papers are shares, because the part of the papers circle taken up by shares is genuinely a part of papers.</p>
<h2>Inequality</h2>
<p>You are given a chain of relations and asked what must hold between two named letters. Two rules do nearly all the work. A chain whose signs all point the same way combines, and a chain that changes direction gives you nothing.</p>
<p>Worked. From P > Q ≥ R you may conclude P > R, because P beats Q and Q is at least as large as R. From P > Q, with R ≥ Q, you may conclude nothing about P and R at all, since R could be smaller than P or very much larger.</p>
<h2>Coding decoding</h2>
<p>A coding question gives you a word in code and asks for another word in the same code. The commonest rule is a shift along the alphabet. If BANK is written as CBOL, then B has become C, A has become B, N has become O and K has become L, so every letter moved one place forward. Apply the same move to LOAN and you get MPBO.</p>
<h2>Why these three come first in the section</h2>
<p>The exact mix of question types changes from cycle to cycle, but a syllogism, an inequality or a coding question is settled in well under a minute once the rule is applied, while a puzzle set needs three or four minutes before it pays anything. A wrong answer takes away a quarter of a mark, so attempt the cheap and certain questions before you open any puzzle.</p>
<h2>The one habit to build</h2>
<p>Write the alphabet from A to Z once on your rough sheet at the start of the reasoning section, in blocks of five, and number the blocks. Every coding question after that becomes a lookup rather than a count on your fingers.</p>`,
      Intermediate: `<p>Each of these three types is a rule you apply rather than a problem you solve. The teaching below gives the rule, then shows the drawing or the chain that produces it.</p>
<h2>Syllogism: the combinations worth knowing by sight</h2>
<table>
<thead><tr><th>Statements</th><th>What definitely follows</th></tr></thead>
<tbody>
<tr><td>All A are B, all B are C</td><td>All A are C, and some C are A</td></tr>
<tr><td>All A are B, no B is C</td><td>No A is C</td></tr>
<tr><td>Some A are B, all B are C</td><td>Some A are C</td></tr>
<tr><td>Some A are B, no B is C</td><td>Some A are not C</td></tr>
<tr><td>All A are B, some B are C</td><td>Nothing definite</td></tr>
<tr><td>Some A are B, some B are C</td><td>Nothing definite</td></tr>
<tr><td>No A is B, no B is C</td><td>Nothing definite</td></tr>
</tbody>
</table>
<p>Add the four conversions and the table covers most of what a prelims paper sets. All A are B converts to some B are A. No A is B converts to no B is A. Some A are B converts to some B are A. Some A are not B converts to nothing whatever, and an option offering some B are not A on the strength of it is the standard trap.</p>
<h2>Complementary pairs</h2>
<p>Statements: all cards are chips, some chips are tokens. Conclusions: some cards are tokens, and no card is a token. Draw it and neither conclusion is forced, because the chips that are tokens may lie inside the cards circle or entirely outside it. But the two conclusions cannot both be false, so one of them must hold, and the correct answer is that either follows.</p>
<p>Three pairs behave this way. Some A are B against no A is B. All A are B against some A are not B. Some A are B against some A are not B. Three conditions must all hold before you use the rule: the two conclusions concern the same pair of terms in the same order, neither of them follows on its own, and together they leave no third case.</p>
<h2>Inequality: combine, or refuse</h2>
<table>
<thead><tr><th>Chain</th><th>Conclusion</th></tr></thead>
<tbody>
<tr><td>A > B > C</td><td>A > C</td></tr>
<tr><td>A > B ≥ C</td><td>A > C</td></tr>
<tr><td>A ≥ B > C</td><td>A > C</td></tr>
<tr><td>A ≥ B ≥ C</td><td>A ≥ C, which is either A > C or A = C</td></tr>
<tr><td>A ≥ B = C</td><td>A ≥ C</td></tr>
<tr><td>A > B, with C > B</td><td>Nothing between A and C</td></tr>
</tbody>
</table>
<p>A coded inequality set hides those signs behind symbols, so translate before you combine. Suppose the paper says that A © B means A is not smaller than B, A % B means A is neither smaller than nor equal to B, and A $ B means A is not greater than B. Translated, © is at least, % is strictly greater, and $ is at most.</p>
<p>Worked. Statement: M © N, N % O, O $ P. That is M ≥ N, N > O and O ≤ P. Conclusion I says M % O, which is M > O, and the chain M ≥ N > O gives exactly that, so it follows. Conclusion II says P % N, which is P > N. All you know of P is that it is at least O, while N is above O, so the two cannot be compared and conclusion II does not follow.</p>
<h2>Coding decoding: four families</h2>
<ul>
<li><strong>Letter shift.</strong> Every letter moves a fixed number of places, forward or backward, and the shift may alternate between letters.</li>
<li><strong>Reverse alphabet.</strong> A letter at position n is replaced by the letter at position 27 minus n. BANK becomes YZMP, since B at 2 gives 25 which is Y, A at 1 gives 26 which is Z, N at 14 gives 13 which is M, and K at 11 gives 16 which is P.</li>
<li><strong>Number coding.</strong> Letters are replaced by their positions and then listed or added. With A as 1, CASH is 3 plus 1 plus 19 plus 8, which is 31, and LOAN is 12 plus 15 plus 1 plus 14, which is 42.</li>
<li><strong>Coded language.</strong> Whole sentences are coded word for word, but the code words are printed in a scrambled order.</li>
</ul>
<h2>A coded language set, worked</h2>
<p>The code says that sa pit ro means bank opens accounts, ro mel na means accounts require verification, and na tu sa means bank needs verification.</p>
<ol>
<li>Compare the first two. The only English word they share is accounts, and the only code word they share is ro, so ro means accounts.</li>
<li>Compare the second and third. They share verification, and they share na, so na means verification.</li>
<li>Compare the first and third. They share bank, and they share sa, so sa means bank.</li>
<li>The first statement now has only pit unaccounted for, so pit means opens. By the same reasoning mel means require and tu means needs.</li>
</ol>
<p>The routine never changes: find two statements sharing exactly one word, and the code they share is that word. A set is unlocked entirely by the first match, and the rest is bookkeeping.</p>`,
      Advanced: `<p>You know the rules. On a repeat attempt these three types should be a guaranteed block of marks taken in the first five minutes of the section, and what stops that is usually one of four specific errors rather than any difficulty in the questions.</p>
<h2>Possibility conclusions, which decide the harder syllogism sets</h2>
<p>A definite conclusion must hold in every drawing the statements allow. A possibility conclusion needs only one drawing in which it holds. That reversal is the whole of the difficulty, because the tests run in opposite directions: for a definite conclusion you hunt for a counter drawing, and for a possibility you hunt for a supporting one.</p>
<p>Take the statements that all bonds are papers and that some papers are files.</p>
<ul>
<li>All files being bonds is a possibility. Draw the files circle so that it lies wholly inside the bonds circle. Bonds sit inside papers, so some papers are files still holds, and nothing is broken.</li>
<li>All papers being bonds is also a possibility. Let the two circles coincide. Some papers are files is still satisfied, by files that are now also bonds.</li>
<li>No paper being a bond is not a possibility. Every bond is inside papers, so if a bond exists at all it is a paper, and these questions assume each named set has at least one member.</li>
<li>Some files are bonds does not follow definitely, because the files that overlap papers can be drawn entirely outside the bonds circle.</li>
</ul>
<p>Mains also sets the reverse form, in which the conclusions are printed and you choose the set of statements that would produce them. Work it the same way: build the drawing the conclusion demands, then check which option's statements force that drawing rather than merely permit it.</p>
<h2>Either or in inequality</h2>
<p>The rule is the same convention as in syllogism. If the chain yields only A ≥ B, and the two printed conclusions are A > B and A = B, then neither follows alone, but together they exhaust the possibilities, so the answer is that either follows. The three conditions still apply: same pair of letters, neither definite alone, no third case left. A candidate who marks only the first conclusion here is treating a chain of two at least signs as strict, which it is not.</p>
<h2>The four errors that cost this block</h2>
<table>
<thead><tr><th>Error</th><th>How the setter writes it</th><th>Check</th></tr></thead>
<tbody>
<tr><td>World knowledge imported</td><td>Statements that are plainly false outside the paper</td><td>Treat the statements as true and answer from the drawing only</td></tr>
<tr><td>Negative particular converted</td><td>An option reading some B are not A after a statement that some A are not B</td><td>That form converts to nothing at all</td></tr>
<tr><td>Either or claimed too readily</td><td>One conclusion already follows definitely</td><td>Either or applies only when neither follows alone</td></tr>
<tr><td>Coded symbol read loosely</td><td>Not smaller than, read as strictly greater</td><td>Not smaller than is at least, so equality survives and a strict conclusion fails</td></tr>
<tr><td>Alphabet position miscounted</td><td>Coding sets built on letters after M</td><td>Use the anchors E as 5, J as 10, O as 15, T as 20 and Y as 25</td></tr>
</tbody>
</table>
<h2>The newer coding patterns in mains</h2>
<p>Mains replaces the plain coded language with a conditional pattern. A sentence is coded word by word into a symbol and a number, and a list of conditions tells you how each part is formed: a number derived from the count of letters, a symbol chosen by whether the word begins with a vowel, a code written in reverse when two conditions apply together. Do not attempt these in your head. Write the word list down the sheet, apply one condition to the whole list, then the next, and only then read off the answer. The questions in such a set are usually four or five, which makes the table worth building.</p>
<h2>The order in which to take the section</h2>
<p>Reasoning in prelims is thirty five questions on a twenty minute sectional clock. Syllogism, inequality and coding are the questions that can be closed in thirty to forty seconds each, so they are taken in the first pass, before any puzzle is opened. Candidates who start with the longest puzzle and arrive at the syllogism set with two minutes remaining are handing back the cheapest marks on the paper, and the sectional clock means those marks cannot be recovered anywhere else in the paper.</p>`,
      Expert: `<p>Recall sheet for the three mechanical reasoning types. Look things up here, do not reason them out again.</p>
<h2>Syllogism, definite results</h2>
<table>
<thead><tr><th>Pair of statements</th><th>Result</th></tr></thead>
<tbody>
<tr><td>All, all</td><td>All, and its converse as a some</td></tr>
<tr><td>All, no</td><td>No</td></tr>
<tr><td>Some, all</td><td>Some</td></tr>
<tr><td>Some, no</td><td>Some are not</td></tr>
<tr><td>All, some</td><td>Nothing</td></tr>
<tr><td>Some, some</td><td>Nothing</td></tr>
<tr><td>No, no</td><td>Nothing</td></tr>
<tr><td>Some are not, anything</td><td>Nothing</td></tr>
</tbody>
</table>
<h2>Complementary pairs, all three</h2>
<ul>
<li>Some A are B, against no A is B.</li>
<li>All A are B, against some A are not B.</li>
<li>Some A are B, against some A are not B.</li>
<li>Conditions: same terms in the same order, neither definite alone, nothing left over.</li>
</ul>
<h2>Inequality in one line each</h2>
<ul>
<li>Same direction throughout, the chain combines.</li>
<li>Any change of direction, no conclusion between the ends.</li>
<li>All the links are at least or equal, the result is at least, which is the either or signal.</li>
<li>One strict link anywhere in a same direction chain makes the result strict.</li>
<li>Not smaller than is at least. Neither greater than nor equal to is strictly smaller. Neither greater than nor smaller than is equal.</li>
</ul>
<h2>Alphabet scaffolds</h2>
<table>
<thead><tr><th>Device</th><th>Use</th></tr></thead>
<tbody>
<tr><td>E is 5, J is 10, O is 15, T is 20, Y is 25</td><td>Position of any letter in two counts</td></tr>
<tr><td>Position of the opposite letter is 27 minus n</td><td>Reverse alphabet coding</td></tr>
<tr><td>A pairs with Z, B with Y, M with N</td><td>Checking a reverse coding at a glance</td></tr>
<tr><td>Write A to Z in blocks of five before the section starts</td><td>Removes counting from every coding question</td></tr>
</tbody>
</table>
<h2>Coded language routine</h2>
<ol>
<li>Find two statements sharing exactly one English word.</li>
<li>The single code word they share is that word.</li>
<li>Repeat across the other pairs until only one code is left in some statement.</li>
<li>The leftover code in a statement is the leftover word of that statement.</li>
</ol>
<h2>Final fortnight drill</h2>
<ol>
<li>Twenty questions a day across the three types, timed at forty seconds each, marked the same evening.</li>
<li>Keep one page for syllogism errors only, split into two columns: wrong because the statement was doubted, and wrong because a possibility was tested as a certainty.</li>
<li>Before every mock, write the alphabet block on the rough sheet as the first act of the reasoning section. It takes about twenty seconds and it removes an entire class of error.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Statements: all shares are bonds; all bonds are papers. Conclusions: I. All shares are papers. II. Some papers are shares. Which follows?",
        options: [
          "Only conclusion I follows",
          "Only conclusion II follows",
          "Both conclusions follow",
          "Neither conclusion follows",
        ],
        answer: 2,
        explanation:
          "Shares sits inside bonds and bonds inside papers, so shares sits inside papers and conclusion I follows by the chain. Conclusion II follows as well, because a universal converts to a particular, and the part of the papers circle occupied by shares is genuinely some papers. Marking only conclusion I is the common slip, made by candidates who believe an all statement cannot be converted at all.",
        difficulty: "Easy",
        skill: "Syllogism by Venn diagram",
      },
      {
        n: 2,
        question:
          "Statements: all cards are chips; some chips are tokens. Conclusions: I. Some cards are tokens. II. No card is a token. Which follows?",
        options: [
          "Only conclusion I follows",
          "Only conclusion II follows",
          "Either conclusion I or conclusion II follows",
          "Neither conclusion follows",
        ],
        answer: 2,
        explanation:
          "The chips that are tokens can be drawn inside the cards circle or wholly outside it, so neither conclusion is forced on its own. The two cannot both be false, however, since between them they cover every case, which makes them a complementary pair and the answer either or. Neither follows is the trap, chosen by candidates who stop after testing each conclusion separately.",
        difficulty: "Medium",
        skill: "Complementary pairs and either or",
      },
      {
        n: 3,
        question:
          "Statements: all bonds are papers; some papers are files. Which of the following is correct?",
        options: [
          "No paper is a bond",
          "Some files are bonds definitely follows",
          "All papers being bonds is not a possibility",
          "All files being bonds is a possibility",
        ],
        answer: 3,
        explanation:
          "A possibility needs only one valid drawing, and drawing the files circle wholly inside bonds keeps every statement true, so the last option is correct. Some files are bonds is the attractive wrong answer, because the overlap of papers and files feels as though it must touch bonds, but that overlap can be drawn entirely outside the bonds circle, which makes it possible rather than definite.",
        difficulty: "Hard",
        skill: "Possibility conclusions",
      },
      {
        n: 4,
        question:
          "In a code, A © B means A is not smaller than B, A % B means A is neither smaller than nor equal to B, and A $ B means A is not greater than B. Statement: M © N, N % O, O $ P. Conclusions: I. M % O. II. P % N. Which follows?",
        options: [
          "Only conclusion II follows",
          "Only conclusion I follows",
          "Both conclusions follow",
          "Neither conclusion follows",
        ],
        answer: 1,
        explanation:
          "Translated, the statement reads M ≥ N, N > O and O ≤ P. The chain M ≥ N > O is all in one direction with one strict link, so M > O and conclusion I follows. Conclusion II fails because P is known only to be at least O while N is strictly above O, so the two cannot be compared, and chaining across that reversed sign is the standard error in coded inequality.",
        difficulty: "Medium",
        skill: "Coded inequality",
      },
      {
        n: 5,
        question:
          "Statement: A ≥ B ≥ C. Conclusions: I. A > C. II. A = C. Which follows?",
        options: [
          "Only conclusion I follows",
          "Either conclusion I or conclusion II follows",
          "Only conclusion II follows",
          "Neither conclusion follows",
        ],
        answer: 1,
        explanation:
          "Two at least signs in the same direction give only A ≥ C, which is precisely the statement that A is greater than C or equal to it, so neither conclusion holds alone while one of them must hold. Marking only conclusion I is the common error, made by reading a chain of at least signs as though it were strict, which it becomes only when at least one link in the chain is strict.",
        difficulty: "Medium",
        skill: "Complementary pairs and either or",
      },
      {
        n: 6,
        question:
          "In a certain code, BANK is written as CBOL. How is LOAN written in the same code?",
        options: ["MPAO", "KNZM", "MPBO", "MOBP"],
        answer: 2,
        explanation:
          "Each letter of BANK has moved one place forward, since B gives C, A gives B, N gives O and K gives L, so LOAN gives M, P, B and O. KNZM is the same shift taken backwards, which is the standard trap for a candidate who checks only the first letter and assumes the direction, and MPAO leaves the third letter unshifted.",
        difficulty: "Easy",
        skill: "Letter and number coding",
      },
      {
        n: 7,
        question:
          "In a certain code, sa pit ro means bank opens accounts, ro mel na means accounts require verification, and na tu sa means bank needs verification. What is the code for opens?",
        options: ["sa", "pit", "mel", "ro"],
        answer: 1,
        explanation:
          "The first two sentences share only the word accounts and only the code ro, so ro is accounts, and the first and third share only bank and only sa, so sa is bank. That leaves pit as the only unaccounted code in the first sentence, which must therefore be opens. The option sa attracts because it does appear in the first sentence, but its meaning is already fixed as bank by the comparison with the third.",
        difficulty: "Medium",
        skill: "Coded language decoding",
      },
      {
        n: 8,
        question:
          "Letters are coded by their position in the alphabet with A as 1, and a word is coded by the sum of those positions. CASH is coded 31 and LOAN is coded 42. What is the code for DEBT?",
        options: ["27", "31", "35", "22"],
        answer: 1,
        explanation:
          "D is 4, E is 5, B is 2 and T is 20, and the sum is 31, which happens to equal the code for CASH and is a useful reminder that a sum code is not one to one. The option 27 comes from numbering the alphabet with A as 0, which shifts every letter down by one and reduces a four letter word's total by exactly four.",
        difficulty: "Easy",
        skill: "Letter and number coding",
      },
    ],
  },
};

export default PART;
