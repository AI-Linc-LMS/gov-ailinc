/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 12.
 *
 * Topics 30726 and 30727, both from the final module: the full length main
 * examination mock and the analysis that turns it into next week's work, and
 * the interview, which is a documents problem, a bio-data problem and a home
 * district problem before it is a general knowledge problem.
 *
 * Structure is stated as it is set, because it is stable across cycles. No
 * vacancy count, fee, cut-off mark, policy rate or examination date is given
 * as current fact anywhere in this file: the notification and the call letter
 * for the cycle you are sitting are always named as the authority. Every
 * worked score has been computed from the exact fractions and checked, since
 * the candidate reading it can do the same arithmetic.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30726: {
    topicId: 30726,
    title: "Mains mock and attempt analysis",
    summary:
      "A main examination mock is three hours of objective questions in four sections on four separate clocks, followed by half an hour of typing, and its value lies almost entirely in what you do with it afterwards. This topic gives you the conditions to sit one under, the section by section arithmetic that reconstructs your real score, and the four measurements that tell you what to repair.",
    concepts: [
      "Full length mains simulation",
      "Marks per minute by section",
      "Set selection audit",
      "Sectional net reconstruction",
      "Abandoned minutes",
      "Descriptive rehearsal",
    ],
    glossary: {
      "Full length simulation":
        "A practice paper sat in one unbroken sitting, in the section order the platform serves, with every sectional clock enforced and the typing block done at the end. Anything short of that measures your knowledge rather than your throughput.",
      "Marks per minute":
        "The marks a section carries divided by the minutes it is given. It is the ceiling that section can pay, not a promise, and it ranks sections against each other for the purposes of planning an attempt.",
      "Orphan set":
        "A data interpretation set or a puzzle that you entered, worked on and left unfinished. You paid the full cost of reading and setting it up, and collected almost none of the marks that made it worth entering.",
      "Abandoned minutes":
        "The total time spent inside sets and puzzles that produced no completed answer. It is the single most useful number in a mains review, because it is time you converted into nothing at all.",
      "Attempt sheet":
        "The handwritten record kept beside a mock: for each section, questions attempted, questions correct, questions wrong, minutes unused, and minutes abandoned. Six numbers a section, written before you look at the result page.",
      "Descriptive block":
        "The half hour of typed letter and essay that closes the officer paper. Inside a mock it is rehearsed in the same fatigued state it will be written in, not moved to a fresh morning.",
    },
    body: {
      Beginner: `<p>A mock is a practice paper sat under the same rules as the real one. Same sections in the same order, same minutes on each of them, and no pausing. That last part is what makes it different from solving questions out of a book, because a book never takes the paper away from you when the time is up.</p>
<h2>Why a mains mock is a different thing</h2>
<p>The preliminary paper is one hour. The officer main paper is three hours of objective questions across four sections, and then thirty minutes of typing a letter and an essay. Nothing in your prelims practice tells you what your concentration is like in the third hour, and that is the most useful thing a mains mock will teach you the first time you sit one.</p>
<h2>Four words you need</h2>
<ul>
<li><strong>Attempt.</strong> A question you actually answered. A question you read and left is not an attempt.</li>
<li><strong>Accuracy.</strong> Correct answers divided by attempts, written as a percentage. Twenty two correct out of twenty five attempts is 88 percent.</li>
<li><strong>Net.</strong> What is left after the deduction for wrong answers is taken off the marks your correct answers earned.</li>
<li><strong>Set.</strong> A group of four or five questions that all hang off one table, one graph or one puzzle. You either build the thing or you do not, and the marks come as a group.</li>
</ul>
<h2>How to sit one properly</h2>
<ol>
<li>Choose a time of day close to the real slot, and tell the people around you that you are not available for the next four hours.</li>
<li>Sit at a computer, not with a printed paper. You are practising reading a screen and using an on screen calculator.</li>
<li>Keep one rough sheet and a pen on the table and nothing else.</li>
<li>When the objective sections end, do not get up. Type the letter and the essay in the thirty minutes, exactly as you would on the day.</li>
</ol>
<h2>Write six numbers per section before you look at the score</h2>
<p>How many you attempted, how many were correct, how many were wrong, how many minutes were left when you stopped working, how many minutes went into questions you started and abandoned, and one line saying what you would do differently. Those numbers are worth more than the total on the result page, because a single total cannot tell you which of the four sections took your marks.</p>
<h2>The mistake almost everybody makes at the start</h2>
<p>Sitting the mock, reading the score, feeling pleased or discouraged, and booking the next one. The paper is the cheap part. The hours afterwards, spent reopening every question that went wrong and finding out exactly why it went wrong, are the part that changes the next score.</p>`,
      Intermediate: `<p>A main examination mock has to be a simulation and not a worksheet. Four sections in the paper's own order, each on its own clock, in one sitting, closed by the typing block. Anything less tests knowledge you already have a fair idea about, instead of testing throughput under three hours of load, which you do not.</p>
<h2>The shape you are simulating, officer mains</h2>
<table>
<thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Minutes</th><th>Marks a minute</th></tr></thead>
<tbody>
<tr><td>Reasoning and Computer Aptitude</td><td>45</td><td>60</td><td>60</td><td>1.00</td></tr>
<tr><td>General, Economy and Banking Awareness</td><td>40</td><td>40</td><td>35</td><td>1.14</td></tr>
<tr><td>English Language</td><td>35</td><td>40</td><td>40</td><td>1.00</td></tr>
<tr><td>Data Analysis and Interpretation</td><td>35</td><td>60</td><td>45</td><td>1.33</td></tr>
</tbody>
</table>
<p>Read the last column as a ceiling rather than a promise. Data interpretation offers the highest rate in the paper and is also the place a candidate is most likely to spend nine minutes and come away with nothing. Awareness offers the second highest rate and is the one candidates actually collect, because a question there is either answered or abandoned inside twenty seconds.</p>
<h2>Set selection, worked out</h2>
<p>Data interpretation sets 35 questions in 45 minutes, commonly as seven sets of five. Seven sets in 45 minutes allows 6.4 minutes each, and a moderate set takes seven to eight minutes once the table is built. So you cannot have all seven. The only decision that matters is which five.</p>
<p>Spend the opening three minutes reading nothing but the headings and the question stems of all seven, and rank them. Then work five sets at about eight minutes each and stop. Suppose that gives you 25 attempts with 22 correct and 3 wrong. Net for a section is correct minus a quarter of wrong, multiplied by the marks a question carries, and here a question carries 60 over 35, which is 12 over 7. So the net is 22 minus 0.75, which is 21.25, multiplied by 12 over 7, and that comes to 36.43.</p>
<p>Now take the candidate who refuses to leave anything and rushes all seven. Under that pressure the same 22 come out correct, but now from 35 attempts, so 13 are wrong. The net is 22 minus 3.25, which is 18.75, multiplied by 12 over 7, and that comes to 32.14. Identical knowledge, identical correct answers, and 4.29 marks handed back for the privilege of touching every set.</p>
<h2>Reconstruct the paper section by section</h2>
<table>
<thead><tr><th>Section</th><th>Attempted</th><th>Correct</th><th>Wrong</th><th>Accuracy</th><th>Net</th></tr></thead>
<tbody>
<tr><td>Reasoning and Computer Aptitude</td><td>30</td><td>26</td><td>4</td><td>87 percent</td><td>33.33</td></tr>
<tr><td>General, Economy and Banking Awareness</td><td>34</td><td>27</td><td>7</td><td>79 percent</td><td>25.25</td></tr>
<tr><td>English Language</td><td>28</td><td>22</td><td>6</td><td>79 percent</td><td>23.43</td></tr>
<tr><td>Data Analysis and Interpretation</td><td>25</td><td>22</td><td>3</td><td>88 percent</td><td>36.43</td></tr>
<tr><td><strong>Objective</strong></td><td><strong>117</strong></td><td><strong>97</strong></td><td><strong>20</strong></td><td><strong>83 percent</strong></td><td><strong>118.44</strong></td></tr>
</tbody>
</table>
<p>The 118.44 is the number the platform will print. The row that should change your week is the awareness row: six questions never touched, in the section where a question takes twenty seconds and carries a full mark. Those are marks lying on the table, and no additional data interpretation practice will ever find them.</p>
<h2>The typing block belongs to the mock</h2>
<p>Write it in the thirty minutes, straight after three hours of objective questions, in a plain text box with the spell checker off. Hold to the word limit the paper sets rather than the length you feel like producing. Leave it for a day, then mark it yourself on four things: did you answer the exact question asked, is the structure visible from the first line of each paragraph, can each sentence be read once and understood, and how many spelling and tense errors survived.</p>`,
      Advanced: `<p>You have sat mocks before, so the question is not whether to sit them but what to measure. The score is the least informative thing a mains paper produces, because two very different papers can arrive at it. What follows is the set of numbers that actually move a mains total, and the reason each one earns its place on the sheet.</p>
<h2>Four measurements the result page will not give you</h2>
<table>
<thead><tr><th>Measurement</th><th>How you capture it</th><th>What it exposes</th></tr></thead>
<tbody>
<tr><td>Abandoned minutes</td><td>Note every set or puzzle you entered and left, with the minutes it took</td><td>Time converted into nothing. Ten abandoned minutes in data interpretation is a whole set you never reached.</td></tr>
<tr><td>Time to first mark</td><td>Minutes from the section opening to your first confident answer</td><td>A slow opening usually means you are working in the order printed rather than in the order of difficulty.</td></tr>
<tr><td>Unused minutes</td><td>Clock remaining when you stopped working inside a section</td><td>Minutes that expire where they sit. They cannot be lent to the section that wanted them.</td></tr>
<tr><td>Attempts against accuracy</td><td>Two columns per section, never a single total</td><td>Rising attempts with falling accuracy is a loss wearing the costume of progress.</td></tr>
</tbody>
</table>
<h2>The orphan set</h2>
<p>An orphan is a set you entered, worked for six minutes and left with one or two answers marked. It is the worst single item in a mains paper, because you paid the full reading and setup cost, you carried the risk on the two answers you did mark, and you collected almost none of the marks that made the set worth entering in the first place. The cure is a checkpoint rather than willpower. Fix a moment, commonly two and a half minutes into a set, by which the table must be filled or the first required quantity computed. If it is not, leave, and do not come back to it later out of loyalty to the minutes already spent.</p>
<h2>Traps that belong specifically to mains</h2>
<ul>
<li><strong>Preparing mains by doing more prelims papers.</strong> Caselet and missing data interpretation, three variable puzzles and machine input output are not set in prelims at all, so prelims volume adds nothing to the two sections carrying 120 of the 200 objective marks.</li>
<li><strong>Banking time by finishing awareness early.</strong> If you are done in 22 of the 35 minutes, the remaining 13 die in place. Spend them on the questions you flagged, then on the ones you answered fast and are not certain about.</li>
<li><strong>Treating the section order as negotiable.</strong> The platform serves the sections in the order set for that cycle and each one shuts on its own clock, so there is no plan in which reasoning is left for the end.</li>
<li><strong>Skipping the typing block because you are tired.</strong> You will be tired on the day too, and fatigue is precisely the condition the block exists to be rehearsed in.</li>
<li><strong>Comparing scores across mock series.</strong> Publishers do not hold difficulty constant. Compare a raw score only inside one series, and use percentile when you must compare across two.</li>
<li><strong>Sitting a full paper in the final two days.</strong> A poor score there buys you no time to act on it and costs the sleep you needed.</li>
</ul>
<h2>Review it in two sittings, not one</h2>
<p>The same evening, while the decisions are still fresh, go through the paper without the answer key and write down why you entered each set you entered and why you left each one you left. That hour is about judgement, and it can only be done while you still remember what the screen looked like. The next day, with the key, work every question that went wrong, and separate the ones you could not do from the ones you could not do in ninety seconds. Those two piles lead to completely different work, and merging them is why candidates practise the wrong thing for weeks.</p>
<h2>How many, and how late</h2>
<p>Two full mains papers a week through the final four weeks suits most candidates, and three only if the two sittings of review genuinely happen for each of them. A paper without its review is an expensive way to feel occupied, and by the last fortnight the papers should be confirming a routine rather than discovering new weaknesses.</p>`,
      Expert: `<p>Protocol sheet, used before and after every main examination paper you sit from here to the day.</p>
<h2>Before the clock starts</h2>
<ol>
<li>The real slot, three and a half hours blocked, phone in another room, one rough sheet.</li>
<li>Three exit rules fixed in advance: when you leave a set, a puzzle and a passage.</li>
<li>A target attempt band per section written on the rough sheet before you begin.</li>
</ol>
<h2>Section numbers, officer mains</h2>
<table>
<thead><tr><th>Section</th><th>Minutes</th><th>Marks a question</th><th>Cost of a wrong answer</th><th>Working attempt band</th></tr></thead>
<tbody>
<tr><td>Reasoning and Computer Aptitude</td><td>60</td><td>1.33</td><td>0.33</td><td>28 to 32 of 45</td></tr>
<tr><td>General, Economy and Banking Awareness</td><td>35</td><td>1.00</td><td>0.25</td><td>32 to 36 of 40</td></tr>
<tr><td>English Language</td><td>40</td><td>1.14</td><td>0.29</td><td>26 to 30 of 35</td></tr>
<tr><td>Data Analysis and Interpretation</td><td>45</td><td>1.71</td><td>0.43</td><td>22 to 27 of 35</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li><strong>Five clean sets beat seven rushed ones.</strong> Same correct answers, ten fewer wrong, about four marks kept.</li>
<li><strong>Exit at the checkpoint, not at the sunk cost.</strong> The six minutes already gone are gone whichever way you now decide.</li>
<li><strong>Unused sectional minutes expire in place.</strong> Finish early and stay inside the section.</li>
<li><strong>Two sittings of review or do not book the paper.</strong> Judgement the same evening, questions the next day.</li>
<li><strong>Percentile across series, raw score within one.</strong> Difficulty is not held constant between publishers.</li>
<li><strong>Nothing new inside the last ten days.</strong> Late papers rehearse a routine, they do not diagnose.</li>
</ul>
<h2>Attempt sheet, filled every time</h2>
<table>
<thead><tr><th>Field</th><th>Recorded as</th></tr></thead>
<tbody>
<tr><td>Attempted, correct, wrong</td><td>Three integers per section</td></tr>
<tr><td>Net</td><td>Correct minus a quarter of wrong, times the marks a question</td></tr>
<tr><td>Abandoned minutes</td><td>Sets and puzzles entered and left, with minutes</td></tr>
<tr><td>Unused minutes</td><td>Clock left when you stopped working</td></tr>
<tr><td>One repair</td><td>A single named drill for the coming week, not a list</td></tr>
</tbody>
</table>
<h2>Edge cases</h2>
<ul>
<li>The clerical main examination has no typing block and no interview, so the mock closes with the objective sections.</li>
<li>A series reporting only a total and a rank cannot be used for repair. Count section wise attempts and accuracy off the solution page yourself.</li>
<li>Where a cycle imposes a sectional minimum, a collapsed section ends the attempt however strong the total is.</li>
<li>If your typed answers run long every time, rehearse twice with a word counter visible, then remove it.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "What makes a practice paper a full length mains simulation rather than practice?",
        options: [
          "It uses questions from a previous cycle of the examination",
          "It is sat in one sitting, in the section order the platform serves, with every sectional clock enforced and the typing block done at the end",
          "It is split across a week so that each section gets your full attention",
          "It is attempted on paper first and then transferred to a computer",
        ],
        answer: 1,
        explanation:
          "The point of the exercise is throughput under three hours of load, so the sitting must be unbroken, in the served order, on the real clocks, and closed by the typed letter and essay. Splitting the four sections across a week is the attractive alternative because each section is then done well, but it removes the fatigue and the section to section spillover that are the only things a full paper measures which sectional drills do not.",
        difficulty: "Easy",
        skill: "Full length mains simulation",
      },
      {
        n: 2,
        question:
          "Data Analysis and Interpretation sets 35 questions for 60 marks. Candidate A completes five sets: 25 attempted, 22 correct. Candidate B rushes all seven sets: 35 attempted, the same 22 correct. By how much does A's net exceed B's?",
        options: [
          "Nothing, since both candidates answered 22 questions correctly",
          "About 2.14 marks",
          "About 4.29 marks",
          "About 12.00 marks",
        ],
        answer: 2,
        explanation:
          "A question carries 60 over 35, which is 12 over 7, and net is correct minus a quarter of wrong times that value. A scores (22 minus 0.75) x 12/7 = 36.43 and B scores (22 minus 3.25) x 12/7 = 32.14, a gap of 4.29 created purely by B's ten extra wrong answers. The first option is the tempting one because the correct count is identical, but the penalty is charged on wrong answers, not on unattempted ones, so touching every set is paid for.",
        difficulty: "Hard",
        skill: "Set selection audit",
      },
      {
        n: 3,
        question:
          "Which section of the officer main examination offers the highest marks per minute on paper?",
        options: [
          "Data Analysis and Interpretation, at about 1.33 marks a minute",
          "General, Economy and Banking Awareness, at about 1.14 marks a minute",
          "Reasoning and Computer Aptitude, at 1.00 marks a minute",
          "English Language, at 1.00 marks a minute",
        ],
        answer: 0,
        explanation:
          "Data interpretation carries 60 marks in 45 minutes, which is 1.33 marks a minute, the highest rate in the paper. Awareness at 1.14 is the tempting answer, and it is the rate candidates most reliably convert because a question there resolves in about twenty seconds, but the ranking asked for is the ceiling each section offers and data interpretation holds it.",
        difficulty: "Medium",
        skill: "Marks per minute by section",
      },
      {
        n: 4,
        question:
          "English Language sets 35 questions for 40 marks. A candidate attempts 28 and gets 22 of them correct. What is the net score for that section?",
        options: ["23.43", "25.14", "22.00", "20.50"],
        answer: 0,
        explanation:
          "A question carries 40 over 35, which is 8 over 7 or about 1.14 marks, and the penalty is a quarter of that. Net is (22 minus 1.5) x 8/7 = 23.43. The 25.14 option is what you get by scoring the 22 correct answers and forgetting the six wrong ones altogether, which is the error that makes candidates over-estimate a section by two marks or more every time.",
        difficulty: "Medium",
        skill: "Sectional net reconstruction",
      },
      {
        n: 5,
        question:
          "In a mains review, what does a large figure for abandoned minutes tell you?",
        options: [
          "That your accuracy is too low and you should attempt fewer questions overall",
          "That you spent significant time inside sets and puzzles that produced no completed answer, so the loss is in selection and exit discipline rather than in knowledge",
          "That the paper was harder than the series average",
          "That you left too many sectional minutes unused",
        ],
        answer: 1,
        explanation:
          "Abandoned minutes count the time poured into sets you entered and left unfinished, which is time converted into nothing, and the repair is a checkpoint rule for entering and leaving sets rather than more chapter revision. Low accuracy is the tempting reading, but accuracy is computed only over questions you answered, so a candidate can show excellent accuracy and still be losing eight or ten minutes a section to orphan sets.",
        difficulty: "Medium",
        skill: "Abandoned minutes",
      },
      {
        n: 6,
        question:
          "You finish the awareness section in 22 of its 35 minutes. What should you do with the remaining 13?",
        options: [
          "Move to the next section early, so the saved minutes are available where calculation is needed",
          "Stop working, since further thought on awareness questions rarely changes an answer",
          "Stay in the section and use them on the questions you flagged and on the ones you answered quickly but are unsure of",
          "Begin drafting the descriptive answers mentally to save time later",
        ],
        answer: 2,
        explanation:
          "Sectional minutes expire inside their own section, so 13 minutes not used in awareness cannot appear later in data interpretation, and the only place they can still earn anything is on flagged and low confidence questions in that same section. Moving on early is the instinct carried over from papers with a single clock, and here it simply destroys the time rather than transferring it.",
        difficulty: "Easy",
        skill: "Marks per minute by section",
      },
      {
        n: 7,
        question:
          "How should the descriptive block be rehearsed inside a mains mock?",
        options: [
          "Handwritten in a notebook on a later day, since the evaluator marks content rather than typing",
          "Typed in the thirty minute block immediately after the objective sections, without a spell checker, and marked afterwards against a fixed set of criteria",
          "Skipped during mocks and practised separately in the final week",
          "Typed with the word limit ignored, because a longer answer covers more ground",
        ],
        answer: 1,
        explanation:
          "The block is typed on the same terminal at the end of a three hour paper, so rehearsing it fresh and by hand removes both the fatigue and the keyboard, which are the two conditions that actually change what you produce. Moving it to the final week is the common choice and it is the worst one: a rehearsed letter structure takes several sittings to build, and there are no spare sittings left in that week.",
        difficulty: "Medium",
        skill: "Descriptive rehearsal",
      },
      {
        n: 8,
        question:
          "A reconstruction shows: reasoning 30 attempted and 26 correct, awareness 34 attempted and 27 correct, English 28 attempted and 22 correct, data interpretation 25 attempted and 22 correct. Which row most deserves next week's hours?",
        options: [
          "Data interpretation, because 10 of its 35 questions were left unattempted",
          "Reasoning, because it carries 60 marks and only 30 questions were attempted",
          "English, because its accuracy of 79 percent is the joint lowest",
          "Awareness, because six questions were left untouched in the section that resolves fastest per question",
        ],
        answer: 3,
        explanation:
          "Awareness questions are answered or abandoned in about twenty seconds and carry a full mark each, so six untouched questions there are the cheapest marks anywhere on the sheet and they need revision rather than technique. Data interpretation looks worse on raw unattempted count, but leaving ten questions there is a deliberate and correct selection decision at 45 minutes for seven sets, so treating it as the gap would send the hours to the wrong section.",
        difficulty: "Hard",
        skill: "Sectional net reconstruction",
      },
    ],
  },
  30727: {
    topicId: 30727,
    title: "Interview: certificates, current affairs and your own district",
    summary:
      "The board is the last stage of the officer recruitment, and it is a documents problem and a bio-data problem before it is a general knowledge problem. This topic covers the certificate folder that decides whether you are still a candidate on the day, the three streams of preparation, and the answer frame that keeps a fifteen minute conversation under your control.",
    concepts: [
      "Document verification set",
      "Bio-data driven questions",
      "Home district file",
      "Banking current affairs for the board",
      "Interview qualifying minimum",
      "Structured answer frame",
    ],
    glossary: {
      "Bio-data":
        "The facts you entered on the application form: degree and subject, year of passing, employment, home town, hobbies. Every one of them is a question you have licensed the board to ask, and they open most interviews.",
      "Board":
        "The panel that conducts the interview, commonly of four or five members drawn from the participating banks and from outside them, sitting together with your application form in front of them.",
      "Document verification":
        "The separate check, usually held before the interview and by different officials, at which originals are produced against the claims made at registration. A claim that cannot be evidenced there is withdrawn, whatever the main examination score was.",
      "No objection certificate":
        "A written release from a present employer in a government body, a public sector undertaking or a bank, confirming that they do not object to your applying. Departments issue these slowly, so it is requested weeks ahead rather than after the call letter arrives.",
      "District file":
        "A single page of about a dozen facts about the district you have declared as your home, kept and revised like a formula sheet, covering its economy rather than its tourism.",
      "Qualifying minimum":
        "The minimum interview mark fixed by the notification, with the relaxation it specifies for reserved categories. A candidate below it is out of the process irrespective of the main examination score.",
    },
    body: {
      Beginner: `<p>The interview is the final stage of the officer recruitment. It is conducted by the participating banks through a nodal bank, and it exists only for the officer post. The clerical recruitment ends with the main examination and holds no interview at all.</p>
<h2>What happens on the day</h2>
<p>You report to a centre at the time printed on your call letter. Your certificates are checked first, in a separate room and usually by different officials. Then you sit before a panel of a few members, commonly four or five, for a conversation of the order of fifteen to twenty minutes. They have your application form on the table, and most of what they ask comes straight off it.</p>
<h2>The three things being tested</h2>
<ol>
<li><strong>Whether you are who your form says you are.</strong> Your degree, your subject, your work, your home town. A candidate who cannot talk about their own graduation subject is noticed immediately.</li>
<li><strong>Whether you know the industry you are asking to join.</strong> Basic banking, what the Reserve Bank of India does, and what has been in the financial news over recent months.</li>
<li><strong>Whether you can hold a conversation like an officer.</strong> Answer what was asked, admit what you do not know, and stay steady when a member disagrees with you.</li>
</ol>
<h2>Certificates come before everything else</h2>
<p>A candidate who has cleared the main examination and cannot produce a certificate stops being a candidate. Start the folder in the week you sit mains, not in the week the call letter arrives. The notification and the call letter are the authority for the exact list, and it will include proof of date of birth, your degree certificate and mark sheets, photo identity, the category or income certificates for any benefit you claimed, and a release letter if you are already serving in a government or public sector post.</p>
<h2>Your own district is not a small question</h2>
<p>Boards ask candidates about the place they come from, because it is the one subject where nobody can bluff. If your form says Nizamabad, be able to say what is grown there, which river and which town matter, what a branch there lends against, and one credit difficulty a farmer or a small trader in that district actually faces. Ten sentences about your district, prepared once, will carry you through half a dozen questions.</p>
<h2>How to answer</h2>
<p>A short first sentence that answers the question. One specific fact or example. One line on why it matters. Then stop, and let them ask the next thing. Saying that you do not know is a complete answer, and it costs far less than a guess that comes apart under two follow up questions.</p>`,
      Intermediate: `<p>Preparation for the board splits into three streams, and they are not equally difficult. Two of them can be finished. The third can only be kept current, which is why it starts months earlier than the call letter.</p>
<h2>Stream one, your own form</h2>
<p>Print the application form and work down it line by line, writing beside each line the questions it invites and a forty second answer to each. Nothing on that form is decorative.</p>
<table>
<thead><tr><th>Line on the form</th><th>What it invites</th></tr></thead>
<tbody>
<tr><td>Degree and subject</td><td>Two or three questions from the core of that subject, and why you are leaving it for banking</td></tr>
<tr><td>Year of passing, and any gap</td><td>What you did in the gap, answered plainly and without apology</td></tr>
<tr><td>Present employment</td><td>What the work involves, why you are moving, and whether your employer will release you</td></tr>
<tr><td>Home town and state</td><td>District questions, the local economy, and sometimes state level schemes</td></tr>
<tr><td>Hobbies</td><td>Taken literally. Enter only what you can be questioned on for three minutes</td></tr>
<tr><td>Name and its spelling</td><td>Nothing at the interview, everything at verification if the certificates disagree</td></tr>
</tbody>
</table>
<h2>Stream two, banking and the economy</h2>
<p>The board is not examining you at main examination depth. It wants evidence that you read. Keep the daily awareness slot you have been running since the start, and change only what you take out of it: for each item, one line on what happened and one line on why a bank branch should care.</p>
<ul>
<li>What the Reserve Bank of India is responsible for, and how its regulatory role differs from the government's fiscal role.</li>
<li>The instruments of monetary policy by name, and the direction of recent decisions rather than any figure you might misquote.</li>
<li>Asset quality: what a non performing asset is, what provisioning follows from it, and why recovery matters at branch level.</li>
<li>Financial inclusion: the basic account, insurance and pension schemes by name and purpose, and what a business correspondent does.</li>
<li>Digital payments: UPI, NEFT and RTGS separated by what each is for, and the frauds a branch actually sees.</li>
<li>Priority sector lending, and which categories of borrower it covers.</li>
</ul>
<h2>Stream three, your district file</h2>
<p>One page, about a dozen facts, revised like a formula sheet. Write it about the economy of the district and not about its monuments.</p>
<ol>
<li>The district headquarters, and the mandals you can name.</li>
<li>The main crops, and whether any processing happens locally.</li>
<li>The main employer outside agriculture.</li>
<li>The river, reservoir or irrigation project the district depends on.</li>
<li>The nearest large market yard, and what is traded there.</li>
<li>Which banks are visible on the ground, and whether a regional rural bank operates in the district.</li>
<li>One credit problem you can describe from life: the tenant farmer with no title deed, the weaver buying yarn on trade credit, the shopkeeper with no formal books.</li>
<li>One state or central scheme that lands in the district, named correctly.</li>
<li>One historical or cultural site, in a single sentence.</li>
<li>The connection to the state capital, by road or rail.</li>
<li>One thing that has changed in the district in recent years.</li>
<li>One sentence on what a new branch there should do first.</li>
</ol>
<h2>The answer frame</h2>
<p>Claim, evidence, consequence. One sentence each, then silence. Asked whether crop credit reaches tenant farmers, you say that it largely does not, then that a tenant holding no title deed cannot offer the security a crop loan is written against, then that this is the gap cultivator certification and joint liability groups exist to close. Three sentences, about forty seconds, and every one of them can be followed up, which is exactly what you want.</p>
<h2>Rehearse in front of a panel, not a mirror</h2>
<p>Ask three people to sit together, hand them your printed form, and let them question you for fifteen minutes with permission to interrupt. Record it if you can bear to watch it back. You are looking for four habits: answering a question you were not asked, filling silence with padding, abandoning your own view the moment a member frowns, and agreeing to a fact you are not sure of.</p>`,
      Advanced: `<p>By the time you reach the board, most of your merit is already banked. What is left is a stage that is pass or fail before it is a scoring stage, and a verification desk with the power to end a successful candidature over a spelling.</p>
<h2>Clear the floor first, then think about the marks</h2>
<p>The notification fixes a minimum mark in the interview, with the relaxation it specifies for reserved categories, and a candidate below that mark is out irrespective of everything written earlier. So treat the board as two separate problems. The first is clearing the floor, which is a matter of composure, coherence and giving nobody a reason to mark you down. The second is scoring well above it, which is worth considerably less than candidates assume.</p>
<h2>What a board mark is actually worth</h2>
<p>The interview is marked out of 100 and scaled into 20 of the final merit, so ten raw interview marks convert into two merit marks. Buying those same two merit marks in the main examination would take roughly six extra marks there. That sounds like a good trade until you notice which of the two you can predict: mains marks respond to practice, board marks depend on a panel you have never met. Preparation that could plausibly go to either belongs to mains. What belongs to the board is protecting the floor and removing the losses that are entirely avoidable.</p>
<h2>Verification is where cleared candidates are actually lost</h2>
<ul>
<li><strong>Name mismatch.</strong> Your matriculation certificate, your degree, your identity document and your application must agree, including initials, expansions and spelling. A mismatch needs an affidavit or a correction, and both take weeks you will not have once the call letter is in hand.</li>
<li><strong>Date of birth proved from the wrong paper.</strong> The matriculation certificate is the accepted proof. An identity card or an affidavit is generally not.</li>
<li><strong>Category certificate in the wrong format or out of date.</strong> Reserved category and economically weaker section certificates must be in the format the notification prescribes, from the authority it prescribes, and current for the period it specifies.</li>
<li><strong>Missing release letter.</strong> If you are serving in a government body, a public sector undertaking or a bank, the no objection certificate is required at the interview, and no department issues one at short notice.</li>
<li><strong>Result awaited.</strong> Graduation must be complete by the date the notification fixes, and you must be able to show a mark sheet or a provisional certificate, not a portal screenshot.</li>
</ul>
<h2>The four questions that decide most boards</h2>
<table>
<thead><tr><th>Question</th><th>What is being tested</th><th>Failure to avoid</th></tr></thead>
<tbody>
<tr><td>Why banking, after this degree</td><td>Whether the choice is considered or accidental</td><td>Security and salary offered as the whole answer</td></tr>
<tr><td>Tell us about your district</td><td>Whether you observe the place you live in</td><td>Tourist facts with no economic content in them</td></tr>
<tr><td>What did you do in the gap year</td><td>Whether you can be direct about your own history</td><td>Defensiveness, or a story that shifts under follow up</td></tr>
<tr><td>Are you sure about that</td><td>Whether you fold under mild pressure</td><td>Reversing a correct answer because a member frowned</td></tr>
</tbody>
</table>
<h2>Handling the pressure question</h2>
<p>When a member disputes something you said, there are three honest moves available. Hold the position and give your reason, if you have one. Concede the specific point and keep the general one, if only part of it was wrong. Or say that you may be mistaken and that you will check. What costs marks is the fourth move, agreeing instantly with whatever was just said, because it tells the panel that nothing you say can be relied on.</p>
<h2>If you have faced a board before</h2>
<p>The useful work for a second attempt is not more general awareness. Within a day of the interview, reconstruct it from memory question by question and mark it yourself: where did an answer run out of substance after two sentences, where were you caught not knowing your own form, where did you talk past what was asked. Almost every repeat candidate finds the same two or three holes, and they sit in the bio-data and the district file far more often than in the news.</p>`,
      Expert: `<p>Final fortnight sheet. Everything below is either an item to carry in a folder or a line you should be able to say without notes.</p>
<h2>The folder, assembled with two sets of copies</h2>
<table>
<thead><tr><th>Item</th><th>Copies</th><th>Watch for</th></tr></thead>
<tbody>
<tr><td>Call letter and application printout</td><td>2</td><td>Must match what was uploaded</td></tr>
<tr><td>Matriculation certificate</td><td>2</td><td>This is the date of birth proof</td></tr>
<tr><td>Degree certificate and all mark sheets</td><td>2</td><td>Provisional certificate if the degree is not yet issued</td></tr>
<tr><td>Photo identity</td><td>2</td><td>Name must match the application exactly</td></tr>
<tr><td>Category, income and asset, or disability certificate</td><td>2</td><td>Prescribed format, prescribed authority, current validity</td></tr>
<tr><td>No objection certificate</td><td>2</td><td>Requested from the employer a month ahead</td></tr>
</tbody>
</table>
<h2>Twelve lines to be able to say cold</h2>
<ol>
<li>Your district, its headquarters and two of its mandals.</li>
<li>Its main crop, and where that crop is processed or sold.</li>
<li>Its main employer outside agriculture.</li>
<li>Its river or irrigation source.</li>
<li>One credit gap you have seen there yourself.</li>
<li>What the Reserve Bank of India is responsible for, in one sentence.</li>
<li>Repo, reverse repo, cash reserve ratio and statutory liquidity ratio, by what each one does.</li>
<li>What a non performing asset is, and why provisioning follows from it.</li>
<li>UPI, NEFT and RTGS separated by purpose.</li>
<li>What priority sector lending covers.</li>
<li>Why you are leaving your subject or your present job for banking.</li>
<li>What you would do in your first month at a rural branch.</li>
</ol>
<h2>Two line rules</h2>
<ul>
<li><strong>Answer the question asked.</strong> A prepared speech attached to a different question reads as a prepared speech.</li>
<li><strong>Do not know is an answer.</strong> A wrong guess invites three follow ups on the same ground.</li>
<li><strong>Claim no hobby you cannot be examined on.</strong> The form is a contract.</li>
<li><strong>Numbers you cannot defend stay out.</strong> Direction and reason beat a figure you half remember.</li>
<li><strong>Concede a point, never a position.</strong> Folding at the first objection scores worse than being wrong.</li>
<li><strong>Documents before polish.</strong> No conversation survives a certificate you could not produce.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>The clerical recruitment holds no interview, so a clerical candidate reads this topic only for the document set and the local language requirement.</li>
<li>The board is normally conducted in English or Hindi, and the call letter is the authority on the options open to you.</li>
<li>A bio-data filled in carelessly at registration is discovered here. Read your own submitted form before you prepare anything else.</li>
</ul>`,
    },
  },
};

export default PART;
