/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 1.
 *
 * Topics 30701 to 30704: the scheme of the common recruitment process, the
 * sectional clock that governs prelims, the four month plan that carries a
 * candidate from prelims speed to mains depth, and the first quantitative
 * topic, simplification and approximation.
 *
 * Structure and method are taught as fact because they are stable across
 * cycles. No vacancy count, fee, cut-off mark or examination date is stated as
 * current fact anywhere in this file: the notification is always named as the
 * authority. Every worked calculation has been checked to produce the number it
 * claims, because a candidate who can do the arithmetic will check.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30701: {
    topicId: 30701,
    title: "Prelims, mains and interview: marks and weightage",
    summary:
      "IBPS runs one common recruitment on behalf of the participating banks, and the officer and clerical cadres pass through the same shape of examination with different papers. Learn where each stage's marks actually go before you open a book, because the prelims score you work hardest for is the one score that never reaches the merit list.",
    concepts: [
      "Common Recruitment Process",
      "Prelims as a qualifying stage",
      "Mains objective and descriptive",
      "Negative marking",
      "Final merit weightage",
      "Provisional allotment",
    ],
    glossary: {
      "Common Recruitment Process":
        "The single examination IBPS conducts on behalf of the participating banks, so that one application and one result feed vacancies across all of them instead of each bank testing separately.",
      "Qualifying stage":
        "A round whose marks decide only who goes forward. You must clear it, and once you have, the score itself is set aside and plays no part in the final ranking.",
      "Sectional timing":
        "A rule that fixes how many minutes you may spend inside each section. The clock starts when the section opens and the section closes when the time is over, whether or not you have finished it.",
      "Negative marking":
        "A deduction for a wrong answer. Here it is one quarter of the marks carried by that question, so four wrong answers cancel one correct answer of the same value.",
      "Descriptive paper":
        "The written English paper in officer mains, a letter and an essay typed on the same terminal, marked by a human evaluator rather than by the machine.",
      "Provisional allotment":
        "The stage at which a candidate on the common merit list is assigned to one participating bank, subject to vacancies, the preferences given at registration and verification of documents.",
    },
    body: {
      Beginner: `<p>IBPS is the Institute of Banking Personnel Selection. It is a recruitment body, not a bank. Several public sector banks ask it to run one examination on their behalf, and that shared examination is called the <strong>Common Recruitment Process</strong>. You apply once, you sit one set of papers, and the banks fill their posts from the single list that comes out of it.</p>
<h2>Two posts, one course</h2>
<p>A <strong>Probationary Officer</strong>, written PO, joins as an officer on probation and is confirmed as a bank officer after that period. A <strong>Clerk</strong> joins the clerical cadre and works at the counter and in the back office. Both need a graduation degree. The clerical recruitment is run state by state, so you apply for one state and are expected to be able to read, write and speak its official language.</p>
<h2>The stages</h2>
<ol>
<li><strong>Preliminary examination</strong>, called prelims. One hour, one hundred questions, three sections, taken on a computer.</li>
<li><strong>Main examination</strong>, called mains. Longer, harder, and with subjects prelims never touches: banking and general awareness, computer awareness, and for the officer post a written paper.</li>
<li><strong>Interview</strong>, for the officer post only. There is no interview in the clerical recruitment.</li>
</ol>
<h2>The part that surprises people</h2>
<p>Prelims does not decide your rank. It is a <strong>qualifying stage</strong>: it decides only who is allowed to write mains. Once you have cleared it, the marks are set aside. A candidate who scrapes through prelims and a candidate who tops it walk into mains on exactly the same footing.</p>
<p>That single fact changes how you spend your months. Prelims has to be cleared, comfortably and reliably, and then left behind. It does not need to be won.</p>
<h2>A wrong answer costs marks</h2>
<p>Every question you get wrong takes away one quarter of the marks that question carried. So four wrong answers wipe out one correct answer. A question you leave blank costs you nothing at all. This is why guessing wildly across a whole section is a bad habit: it does not just fail to help, it eats the marks you earned honestly elsewhere.</p>
<h2>What to carry out of this lesson</h2>
<ul>
<li>One application, one process, several banks.</li>
<li>Prelims qualifies you. It does not rank you.</li>
<li>Mains is where your marks start to count.</li>
<li>The officer post ends with an interview. The clerical post ends with mains.</li>
<li>Wrong answers are charged for. Blanks are not.</li>
</ul>`,
      Intermediate: `<p>Learn the scheme before the syllabus. It converts study hours into marks at a fixed rate, and the rate is very different in different parts of this examination. The notification is the authority for any cycle you are actually sitting, but the shape below has been stable for several years and is safe to plan against.</p>
<h2>Preliminary examination, both cadres</h2>
<table>
<thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Time</th></tr></thead>
<tbody>
<tr><td>English Language</td><td>30</td><td>30</td><td>20 minutes</td></tr>
<tr><td>Quantitative Aptitude (Numerical Ability for clerk)</td><td>35</td><td>35</td><td>20 minutes</td></tr>
<tr><td>Reasoning Ability</td><td>35</td><td>35</td><td>20 minutes</td></tr>
<tr><td><strong>Total</strong></td><td><strong>100</strong></td><td><strong>100</strong></td><td><strong>60 minutes</strong></td></tr>
</tbody>
</table>
<p>The twenty minutes is per section and it is enforced by the platform. You are given one section at a time, and when its clock runs out the section closes and you are moved on. You cannot borrow five minutes from English to finish a puzzle in reasoning. The next topic is about nothing but this.</p>
<h2>Officer main examination</h2>
<table>
<thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Reasoning and Computer Aptitude</td><td>45</td><td>60</td><td>60 minutes</td></tr>
<tr><td>General, Economy and Banking Awareness</td><td>40</td><td>40</td><td>35 minutes</td></tr>
<tr><td>English Language</td><td>35</td><td>40</td><td>40 minutes</td></tr>
<tr><td>Data Analysis and Interpretation</td><td>35</td><td>60</td><td>45 minutes</td></tr>
<tr><td><strong>Objective total</strong></td><td><strong>155</strong></td><td><strong>200</strong></td><td><strong>180 minutes</strong></td></tr>
<tr><td>Descriptive: one letter and one essay</td><td>2</td><td>25</td><td>30 minutes</td></tr>
</tbody>
</table>
<p>Read the marks column against the questions column. The objective mains is not one mark a question. Forty five reasoning questions carry sixty marks, and thirty five data interpretation questions also carry sixty. An awareness question carries one mark flat. The paper is telling you where it values your time.</p>
<h2>Clerical main examination</h2>
<p>The clerical mains runs 190 questions for 200 marks in 160 minutes, across General and Financial Awareness, General English, Reasoning Ability with Computer Aptitude, and Quantitative Aptitude, each with its own sectional clock. There is no descriptive paper and no interview. The clerical merit list is built from the mains score alone.</p>
<h2>How the officer merit list is built</h2>
<p>Prelims marks are discarded once you qualify. The mains total, objective plus descriptive, and the interview are scaled into the ratio <strong>80 to 20</strong>. The notification fixes a minimum qualifying mark in the interview, with a relaxation for reserved categories, and a candidate below it is out no matter what the mains score was. Candidates are called for mains and then for the interview at a multiple of the vacancies notified, which is why the cut-off moves every cycle and is not worth memorising from last year.</p>
<h2>Negative marking</h2>
<p>One quarter of the marks assigned to a question is deducted for a wrong answer. In prelims that is a flat 0.25. In officer mains it depends on the section: a wrong data interpretation answer costs about 0.43 marks, a wrong awareness answer costs 0.25. A question left unanswered carries no penalty. A question you marked for review but never answered is unanswered.</p>`,
      Advanced: `<p>You already know the scheme, so the useful work here is the exchange rate: what one mark is worth depending on where you earn it. Second attempts are usually lost by putting the extra hours into the section that pays least, and the arithmetic below shows you which one that is.</p>
<h2>Converting a mark into a merit mark</h2>
<p>The officer merit list scales mains and interview into 80 and 20. Mains carries 225 marks in total, 200 objective and 25 descriptive, and that 225 becomes 80. So one mains mark is worth 80 divided by 225, which is 0.356 of a merit mark. The interview carries 100 marks and becomes 20, so one interview mark is worth 0.200 of a merit mark.</p>
<p>One mark gained in mains is therefore worth about <strong>1.8 marks</strong> gained in the interview, and the interview is the part of the process you control least. Every hour spent on interview polish that could have been spent on data interpretation is being traded at a poor rate.</p>
<h2>Not every objective question is worth one mark</h2>
<table>
<thead><tr><th>Officer mains section</th><th>Q</th><th>Marks</th><th>Marks per question</th><th>Cost of a wrong answer</th></tr></thead>
<tbody>
<tr><td>Data Analysis and Interpretation</td><td>35</td><td>60</td><td>1.71</td><td>0.43</td></tr>
<tr><td>Reasoning and Computer Aptitude</td><td>45</td><td>60</td><td>1.33</td><td>0.33</td></tr>
<tr><td>English Language</td><td>35</td><td>40</td><td>1.14</td><td>0.29</td></tr>
<tr><td>General, Economy and Banking Awareness</td><td>40</td><td>40</td><td>1.00</td><td>0.25</td></tr>
</tbody>
</table>
<p>Two consequences follow, and they pull in opposite directions. A data interpretation question is worth 1.71 awareness questions, so a whole DI set of five that you solve correctly is worth roughly eight and a half awareness questions. But the awareness section offers 40 marks in 35 minutes with no calculation at all, which is the highest marks per minute anywhere in the paper for a candidate who has actually revised six months of it. The candidate who neglects awareness because it is only one mark a question has misread the table: it is one mark a question at four times the answering speed.</p>
<h2>The descriptive paper is not a formality</h2>
<p>Twenty five marks out of 225 is 8.9 marks of the 80 that the mains contributes to merit. Between two candidates separated by three merit marks, that is the whole gap. A letter and an essay written to a rehearsed structure, in clean sentences, of the length asked for, is the most predictable scoring on the entire paper, and it is the item most candidates leave unpractised until the week before.</p>
<h2>Traps that cost a repeat attempter the cycle</h2>
<ul>
<li><strong>Over-preparing prelims.</strong> A candidate who clears prelims by twenty marks and a candidate who clears it by two are equal on the morning of mains. Prelims needs a safety margin, not a maximum.</li>
<li><strong>Treating mains as a longer prelims.</strong> Mains sets caselet and missing data interpretation, three variable puzzles and input output, none of which appear in prelims. Practising more prelims sets does not prepare mains.</li>
<li><strong>Marking for review and forgetting.</strong> The platform distinguishes answered, not answered, and marked for review. Only an answered question is evaluated. Clear your review list before a section closes.</li>
<li><strong>Guessing into the penalty.</strong> A wrong DI answer costs 0.43 marks, and it also cost you the ninety seconds that another set needed.</li>
<li><strong>Carrying last year's cut-off.</strong> The shortlist is a multiple of the notified vacancies, so the cut-off is an output of that cycle's vacancy count and difficulty, never an input to your planning.</li>
</ul>`,
      Expert: `<p>Recall sheet. Everything below is either a structural fact you should be able to state without looking it up, or an arithmetic conversion you should be able to do in your head in the last week.</p>
<h2>Stage map</h2>
<table>
<thead><tr><th>Stage</th><th>Officer</th><th>Clerk</th><th>Counts towards merit</th></tr></thead>
<tbody>
<tr><td>Prelims</td><td>100 Q, 100 marks, 60 min, sectional 20 min</td><td>Same structure</td><td>No</td></tr>
<tr><td>Mains objective</td><td>155 Q, 200 marks, 180 min</td><td>190 Q, 200 marks, 160 min</td><td>Yes</td></tr>
<tr><td>Mains descriptive</td><td>2 Q, 25 marks, 30 min</td><td>Not set</td><td>Yes</td></tr>
<tr><td>Interview</td><td>100 marks, scaled to 20</td><td>Not held</td><td>Yes, officer only</td></tr>
</tbody>
</table>
<h2>Merit arithmetic strip</h2>
<ul>
<li>Officer: mains 225 becomes 80, interview 100 becomes 20. One mains mark equals 0.356 merit marks; one interview mark equals 0.200.</li>
<li>Clerk: mains total alone, state wise merit, no interview stage at all.</li>
<li>Penalty is one quarter of the marks that question carries, not a flat 0.25 everywhere in mains.</li>
<li>Prelims marks are discarded on qualification. Nothing from an earlier attempt is carried either.</li>
</ul>
<h2>Marks per question, officer mains</h2>
<ul>
<li>Data Analysis and Interpretation: 1.71 a question, penalty 0.43.</li>
<li>Reasoning and Computer Aptitude: 1.33 a question, penalty 0.33.</li>
<li>English Language: 1.14 a question, penalty 0.29.</li>
<li>General, Economy and Banking Awareness: 1.00 a question, penalty 0.25.</li>
</ul>
<h2>Edge cases worth carrying</h2>
<ul>
<li>Clerical recruitment is state wise and carries a local language requirement, so a candidate applying outside their language state can clear mains and still be rejected at verification.</li>
<li>The descriptive paper is typed on the same terminal, without a spell checker, and is evaluated subject to qualifying in the objective mains.</li>
<li>A candidate below the interview qualifying minimum is out regardless of the mains score, so the interview is pass or fail first and a scoring stage second.</li>
<li>Provisional allotment follows preferences and vacancies, so a high rank does not guarantee a preferred bank, and a reserve list may be operated later against the same cycle.</li>
</ul>
<h2>Notification checklist, done on the day it is published</h2>
<ol>
<li>Confirm the sectional composition and timing of both stages against this sheet.</li>
<li>Note the penalty clause and confirm it is one quarter of the marks of that question.</li>
<li>Note the ratio in which mains and interview are scaled for merit.</li>
<li>For the clerical post, note the state applied for and the language proficiency clause.</li>
<li>Note which documents are required at verification and begin collecting them before mains, not after.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "How is the preliminary examination structured in this recruitment?",
        options: [
          "100 questions for 100 marks in 60 minutes, with 20 minutes fixed for each of the three sections",
          "100 questions for 200 marks in 60 minutes, with the hour divided as the candidate wishes",
          "150 questions for 150 marks in 90 minutes, with sectional timing",
          "100 questions for 100 marks in 60 minutes, with no sectional restriction",
        ],
        answer: 0,
        explanation:
          "Prelims is 100 questions for 100 marks in one hour, and the hour is split into three fixed blocks of 20 minutes, one per section. The tempting answer is the last one, because most objective papers do let you move freely; here the platform closes a section when its clock ends, so time cannot be carried from one section to another.",
        difficulty: "Easy",
        skill: "Common Recruitment Process",
      },
      {
        n: 2,
        question:
          "In prelims a candidate attempts 78 questions and 66 of them are correct. What is the net score?",
        options: ["66", "63", "61.5", "57.5"],
        answer: 1,
        explanation:
          "Twelve answers are wrong, and each costs one quarter of a mark, so the deduction is 12 x 0.25 = 3 and the net score is 66 - 3 = 63. The 57.5 option comes from penalising all 34 unanswered questions as well, which is the common misreading: an unanswered question carries no penalty at all.",
        difficulty: "Medium",
        skill: "Negative marking",
      },
      {
        n: 3,
        question:
          "A candidate clears prelims with a score well above the cut-off. How does that score affect the final merit list?",
        options: [
          "It is added to the mains score before scaling",
          "It is carried forward at a reduced weight of 20 percent",
          "It does not affect the merit list at all, because prelims only decides who writes mains",
          "It is used to break ties between candidates with equal mains scores",
        ],
        answer: 2,
        explanation:
          "Prelims is a qualifying stage: it selects who sits mains and its marks are then set aside, so two candidates who cleared it by very different margins begin mains equal. The tie-break option is attractive because tie-breaks do exist in this process, but they are resolved on the marks that count and then on age, never on a discarded prelims score.",
        difficulty: "Easy",
        skill: "Prelims as a qualifying stage",
      },
      {
        n: 4,
        question:
          "In the officer recruitment, in what ratio are the main examination and the interview combined for the final merit list?",
        options: ["50 to 50", "60 to 40", "70 to 30", "80 to 20"],
        answer: 3,
        explanation:
          "Mains is scaled into 80 and the interview into 20, so the written stage dominates the ranking. Candidates often assume 70 to 30 because that ratio is used in some other services, and the practical consequence of getting it wrong is over-investing in interview coaching: one mains mark is worth about 1.8 interview marks.",
        difficulty: "Medium",
        skill: "Final merit weightage",
      },
      {
        n: 5,
        question:
          "How is the descriptive paper in officer mains treated?",
        options: [
          "It is qualifying only, so its marks do not enter the merit calculation",
          "It carries 25 marks that are added to the 200 objective marks, giving a mains total of 225",
          "It is marked by the same system that marks the objective paper",
          "It replaces the English Language section of the objective paper",
        ],
        answer: 1,
        explanation:
          "The letter and the essay carry 25 marks between them and are added to the 200 objective marks, so mains is out of 225 before scaling into 80. Treating it as merely qualifying is the costly error: 25 marks out of 225 is nearly 9 of the 80 merit marks, which is more than the gap that separates many candidates.",
        difficulty: "Medium",
        skill: "Mains objective and descriptive",
      },
      {
        n: 6,
        question:
          "In officer mains, Data Analysis and Interpretation sets 35 questions for 60 marks. What does a wrong answer in that section cost?",
        options: [
          "0.25 marks, the same flat penalty as prelims",
          "About 0.43 marks, because the penalty is a quarter of the 1.71 marks the question carries",
          "1.71 marks, the full value of the question",
          "Nothing, because the penalty applies only to the awareness section",
        ],
        answer: 1,
        explanation:
          "Sixty marks over 35 questions is about 1.71 marks each, and the penalty is one quarter of the marks that question carries, so a wrong answer costs about 0.43. Assuming a flat 0.25 everywhere is the natural carry-over from prelims, and it makes a candidate under-estimate the cost of guessing in the highest value section of the paper.",
        difficulty: "Hard",
        skill: "Negative marking",
      },
      {
        n: 7,
        question:
          "What does provisional allotment mean at the end of the process?",
        options: [
          "A confirmed appointment letter from the bank of your first preference",
          "Permission to appear at the interview stage",
          "Assignment to one participating bank from the common merit list, subject to vacancies, preferences and document verification",
          "A temporary posting that is reviewed after the probation period",
        ],
        answer: 2,
        explanation:
          "Allotment places a candidate from the common merit list with one participating bank, against that bank's vacancies and the preferences given at registration, and it remains provisional until documents are verified. It is not an appointment letter, and a high rank does not guarantee the preferred bank because allotment is limited by where the vacancies actually are.",
        difficulty: "Medium",
        skill: "Provisional allotment",
      },
    ],
  },
};

export default PART;
