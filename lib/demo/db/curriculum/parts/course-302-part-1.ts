/**
 * Course 302: TGPSC Group-II and Group-III Foundation. Part 1 of 3.
 *
 * Topics 30201 to 30208: the scheme of examination, the study plan that serves
 * both notifications, the whole of Paper-I (General Studies and General
 * Abilities), and the opening topic of the socio-cultural history module.
 *
 * Structure and method are taught as fact because they are stable. Vacancy
 * counts, fee amounts, cut-off marks and exam dates are never stated as current
 * fact anywhere in this file: the notification is always named as the authority.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30201: {
    topicId: 30201,
    title: "Four papers for Group-II, three for Group-III",
    summary:
      "Group-II is written across four objective papers and Group-III across three, and the first three subjects are the same in both. Learn the scheme before the syllabus, because the scheme decides how much each hour of reading is worth.",
    concepts: [
      "Scheme of examination",
      "Syllabus overlap",
      "General Studies and General Abilities",
      "Telangana Movement paper",
      "Screening test",
      "Objective examination format",
    ],
    glossary: {
      Notification:
        "The Commission's recruitment advertisement for a set of posts. It carries the vacancy break-up, the eligibility conditions, the scheme of examination and the syllabus, and where anything in your coaching notes disagrees with it, the notification wins.",
      "Scheme of examination":
        "The paragraph in a notification that fixes how many papers there are, what each is worth, how long each lasts, what the question type is and how the final merit is computed.",
      "Screening test":
        "A shortlisting round the Commission may hold when applications are very large. It is objective, it decides only who sits the main written examination, and the marks scored in it are not carried into the final merit list.",
      "Objective type":
        "A question that gives you fixed options and asks you to mark one. You are not writing; you are recognising, which is why coverage matters more than expression in these papers.",
      "Common paper":
        "A paper whose syllabus is identical across two recruitments, so one round of preparation answers both. Paper-I is the common paper here.",
      "Merit list":
        "The ranked list built from the marks that actually count. Anything scored in a shortlisting round or in an earlier attempt does not enter it.",
    },
    body: {
      Beginner: `<p>TGPSC is the state's recruitment commission. When a Telangana department needs to fill posts, the Commission publishes a <strong>notification</strong>, which is an advertisement listing the posts, who may apply, and exactly how candidates will be selected.</p>
<p>Posts are sorted into groups by their level. Group-I holds the senior posts such as Deputy Collector and Deputy Superintendent of Police. Group-II holds posts such as Assistant Commercial Tax Officer, Sub Registrar and Assistant Section Officer. Group-III sits one rung below Group-II in the same departments. Group-IV is junior clerical work.</p>
<h2>What a paper is</h2>
<p>A <strong>paper</strong> is one sitting of the examination, on one broad subject, with its own question booklet and its own clock. Group-II is written across four papers. Group-III is written across three. Every question in all of them is <strong>objective type</strong>: the question is printed, four options are printed under it, and you shade one bubble. You never write an essay.</p>
<h2>The papers</h2>
<ol>
<li>General Studies and General Abilities. Current affairs, general science, environment and disaster management, geography, economy and society, and the reasoning and arithmetic section.</li>
<li>History, Polity and Society.</li>
<li>Economy and Development.</li>
<li>Telangana Movement and State Formation. This fourth paper is set for Group-II only.</li>
</ol>
<p>Read that list again and notice what it means for you. The first three papers of Group-II and the three papers of Group-III are the same subjects. If you prepare for Group-II you have already prepared for Group-III, and the only extra work is the fourth paper. That is why one course serves both notifications.</p>
<h2>Two things that trip up a first timer</h2>
<p>The first is the <strong>screening test</strong>. If a very large number of people apply, the Commission may hold a shortlisting test to decide who sits the real examination. Clearing it gets you into the main examination and nothing more. The marks you score there are not added to your final marks.</p>
<p>The second is that each paper carries the same marks as every other paper. There is no bonus paper and no soft paper. A subject you dislike costs you exactly as much as a subject you enjoy, so you cannot leave one out and make it up elsewhere.</p>
<p>Before you open a single textbook, download the notification and read its scheme of examination paragraph twice. Everything you plan afterwards rests on it.</p>`,
      Intermediate: `<p>The scheme of examination is the first thing to learn, ahead of any content, because it converts study hours into marks at a fixed rate and tells you where the rate is highest. Both recruitments are written entirely in objective form, with each paper carrying equal weight, so the arithmetic of preparation is unusually clean.</p>
<h2>The two schemes side by side</h2>
<table>
<tr><th>Paper</th><th>Subject</th><th>Group-II</th><th>Group-III</th></tr>
<tr><td>I</td><td>General Studies and General Abilities</td><td>Yes</td><td>Yes</td></tr>
<tr><td>II</td><td>History, Polity and Society</td><td>Yes</td><td>Yes</td></tr>
<tr><td>III</td><td>Economy and Development</td><td>Yes</td><td>Yes</td></tr>
<tr><td>IV</td><td>Telangana Movement and State Formation</td><td>Yes</td><td>No</td></tr>
</table>
<p>Each paper is objective, each is worth the same as the others, and each is written in a single sitting of the same length. The Commission's recent Group-II papers have run to one hundred and fifty questions in one hundred and fifty minutes, which is a minute a question including reading and bubbling. Confirm the figures against the notification you are sitting for rather than against a coaching handout.</p>
<h2>What sits inside each paper</h2>
<p>Papers II and III are each divided into three sections, and the divisions matter because they are the unit the paper setter works in.</p>
<ul>
<li><strong>Paper-II</strong>: socio-cultural history of India and Telangana; an overview of the Indian Constitution and politics; social structure, social issues and public policies.</li>
<li><strong>Paper-III</strong>: the Indian economy and its issues; the economy and development of Telangana; issues of development and change.</li>
<li><strong>Paper-IV</strong>, for Group-II, is organised by period rather than by theme: the idea of Telangana up to 1970, the mobilisation phase through the 1970s and 1980s, and the drive to statehood down to 2014.</li>
</ul>
<p>Paper-I is not sectioned in the same tidy way. It is a list of units running from current affairs and international relations through general science, environment and disaster management, the geography and demography of India and Telangana, and the state's own policies, ending with logical reasoning, analytical ability and data interpretation.</p>
<h2>Reading the overlap correctly</h2>
<p>The overlap is real but it is not an excuse to prepare half-heartedly for either. Two things follow from it. First, your default target is Group-II, because a Group-II preparation contains a Group-III preparation and the reverse is not true. Second, the extra paper is not extra in effort terms alone: it is the paper where the field spreads out, because it is the one that cannot be answered from general reading.</p>
<h2>The stages around the written examination</h2>
<p>A recruitment is more than its papers. Expect the sequence to run: notification, application, an optional screening test if applications are heavy, the main written examination, publication of the answer key with a window to file objections, certificate verification for candidates called in a ratio to the vacancies, and then the final merit list. The answer key objection window is worth marking in your calendar; it is the one stage where a candidate can still change an outcome after the examination is over.</p>
<p>Treat the screening test as a filter, not as a rehearsal that pays. Its marks do not enter the merit list, and a candidate who peaks for it and then rests for six weeks has spent their best form on a round that scores nothing.</p>`,
      Advanced: `<p>If you are sitting this a second time, the scheme is not new information, so the useful question is different: where in a four paper, equal weight, objective structure does a repeat attempter actually lose the marks that separate them from a rank? Almost never in the paper they fear. Usually in the paper they assumed was already done.</p>
<h2>Equal weight is a strategic instruction, not a fact to memorise</h2>
<p>Because every paper carries the same marks, the marginal mark is cheapest wherever your score is lowest, and the marginal mark is most expensive where you are already strong. A candidate sitting at a comfortable level in Paper-II and a weak level in Paper-III improves the aggregate far more by lifting Paper-III, even though Paper-II is the more enjoyable revision. The instinct to revise what you know well is the single most expensive habit in an equal weight structure.</p>
<h2>Where the field separates</h2>
<ul>
<li><strong>Paper-IV separates Group-II candidates.</strong> It cannot be answered from general awareness, the source material is narrow, and the questions turn on sequence, institutions and named documents. This is the paper where a disciplined candidate can hold a decisive edge, and it is also the paper most often postponed to the last month.</li>
<li><strong>Paper-I separates nobody in the middle and everybody at the top.</strong> Its current affairs and science components are wide and shallow, so most serious candidates land in a similar band. The reasoning and data interpretation portion is the exception: it is fully deterministic, it is the only part of the entire examination where practice converts to marks with near certainty, and it is routinely under-practised by candidates from a humanities background.</li>
<li><strong>Papers II and III separate the careless.</strong> Their content is standard, so losses come from confusable pairs, from articles and amendment numbers, and from the Telangana specific half being read as an afterthought to the all India half.</li>
</ul>
<h2>Traps that repeat attempters walk into</h2>
<p><strong>Assuming last cycle's scheme.</strong> The Commission has changed the shape of its recruitments before: the number of papers, the presence of a screening test and the treatment of the interview have all moved. Read the current notification as though you had never sat this examination. A candidate who prepares for a scheme that no longer applies is not lazy, they are out of date, and the effect on the mark sheet is the same.</p>
<p><strong>Treating Group-III as a lighter target.</strong> The papers are fewer, but the competition for the posts is not proportionally lighter, and the syllabus depth is the same. Fewer papers means the marks are concentrated: an average Paper-I hurts more when it is one third of your aggregate rather than one quarter.</p>
<p><strong>Preparing the overlap once and never again.</strong> The overlap is a saving in coverage, not in revision. The same static content must survive two different question papers written on two different days, and retention, not exposure, is what fails.</p>
<h2>The one hour audit</h2>
<p>Take the notification, write the four paper headings on a sheet, and under each write your honest mark estimate from your last attempt or your last full mock. Rank the four. Your next eight weeks belong to the bottom two, whatever your preferences say. Then set a floor for the top two so they do not decay while you work below them, and hold that floor with weekly testing rather than with fresh reading.</p>`,
      Expert: `<p>Final month. The scheme is settled and the only thing left to do with it is convert it into a sitting plan and a set of decision rules you can execute when tired.</p>
<h2>Recall table</h2>
<table>
<tr><th>Item</th><th>Two line rule</th></tr>
<tr><td>Papers</td><td>Group-II four, Group-III three. First three subjects identical.</td></tr>
<tr><td>Weight</td><td>Equal per paper. No compensating paper exists.</td></tr>
<tr><td>Form</td><td>Objective throughout, one mark class per question, roughly one minute per question.</td></tr>
<tr><td>Screening test</td><td>Shortlists only. Contributes nothing to merit.</td></tr>
<tr><td>Paper-IV</td><td>Group-II only. Organised by period, not by theme.</td></tr>
<tr><td>Authority</td><td>The notification, every time, over any handout.</td></tr>
</table>
<h2>Checklist for the week before</h2>
<ul>
<li>Re-read the scheme of examination paragraph in the notification, including the footnotes on qualifying marks and on the ratio for certificate verification.</li>
<li>Confirm the paper order and the timings for each sitting, then rehearse at least one full paper at exactly that hour of the day.</li>
<li>Confirm the permitted items in the hall and the identity documents named in the hall ticket.</li>
<li>Fix your per paper time split in advance: a first sweep for the questions you own, a second for the ones that need working, a third for the marginal calls.</li>
<li>Decide your attempt policy before the paper, not inside it. A policy chosen at question ninety under time pressure is a guess about a guess.</li>
</ul>
<h2>Edge cases worth holding</h2>
<ul>
<li>An answer key objection is a formal, evidenced submission within a stated window. Vague disagreement fails; a cited standard source sometimes succeeds.</li>
<li>Certificate verification calls a multiple of the vacancies, so a candidate slightly below the visible line can still be called, and a candidate called is not thereby selected.</li>
<li>Reservation and relaxation categories are decided by the certificates you actually hold on the date the notification fixes, not by the community you belong to in general terms.</li>
<li>If both notifications are live in the same cycle, prepare to the Group-II standard and sit both. The reverse plan leaves Paper-IV unprepared and forfeits the larger recruitment.</li>
</ul>
<p>Two line summary to carry into the hall: every paper is worth the same, so the cheapest marks are always in your weakest paper; and nothing you scored before the main examination counts towards where you finish.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A candidate has prepared thoroughly for Group-III and now wants to sit Group-II as well. What is the additional preparation actually required?",
        options: [
          "Nothing, because the two syllabi are identical",
          "The Telangana Movement and State Formation paper, which Group-III does not set",
          "A fresh preparation of every paper, because Group-II papers are set at a different standard",
          "Only the general studies paper, because it differs between the two",
        ],
        answer: 1,
        explanation:
          "Group-II adds a fourth paper on the Telangana Movement and State Formation; the first three subjects are common to both recruitments, so they carry over. The tempting answer that nothing more is needed misreads the overlap: the overlap covers three papers, not four, and the fourth is precisely the one that cannot be answered from general reading.",
        difficulty: "Easy",
        skill: "Syllabus overlap",
      },
      {
        n: 2,
        question: "What is the correct status of the marks scored in a screening test?",
        options: [
          "They are added to the written examination marks to build the final merit list",
          "They are used only to decide who sits the main written examination",
          "They replace the first paper of the main examination for candidates who score well",
          "They are used as the tie breaker when two candidates finish level on merit",
        ],
        answer: 1,
        explanation:
          "A screening test is a shortlisting device held when applications are very heavy, and its marks decide entry to the main examination and nothing else. Adding them to the final merit is the natural assumption and it is wrong, which is why some candidates peak for the screening test and then coast into the paper that actually scores.",
        difficulty: "Easy",
        skill: "Screening test",
      },
      {
        n: 3,
        question:
          "Every paper in the scheme carries equal marks. What does that imply for a candidate whose economy paper is much weaker than the rest?",
        options: [
          "The weakness can be offset by scoring exceptionally in the strongest paper",
          "The weakest paper is where an additional hour of study buys the most marks",
          "The weakness matters less because economy questions are generally easier",
          "The candidate should drop that paper and concentrate on the other three",
        ],
        answer: 1,
        explanation:
          "With equal weights, marks are cheapest where your score is lowest, because the gap between what you score and what the paper offers is largest there. Offsetting with a stronger paper sounds reasonable but runs into a ceiling: you cannot score above the paper's maximum, so improvement at the top is capped while improvement at the bottom is not.",
        difficulty: "Medium",
        skill: "Scheme of examination",
      },
      {
        n: 4,
        question: "Which of these is a section of Paper-II, History, Polity and Society?",
        options: [
          "Issues of development and change",
          "Overview of the Indian Constitution and politics",
          "Logical reasoning and data interpretation",
          "The mobilisation phase of the Telangana movement",
        ],
        answer: 1,
        explanation:
          "Paper-II runs socio-cultural history, an overview of the Constitution and politics, and social structure with public policies. Issues of development and change is attractive because it sounds social, but it belongs to Paper-III on economy and development, and mixing the two leads candidates to revise policy content under the wrong paper's time budget.",
        difficulty: "Medium",
        skill: "Scheme of examination",
      },
      {
        n: 5,
        question:
          "Which component of Paper-I converts practice into marks most reliably, and is most often neglected by candidates from a humanities background?",
        options: [
          "Current affairs of the last twelve months",
          "General science and its applications",
          "Logical reasoning, analytical ability and data interpretation",
          "International relations and events",
        ],
        answer: 2,
        explanation:
          "Reasoning and data interpretation are deterministic: the same question type recurs, the method is fixed, and repetition raises both accuracy and speed in a way that is measurable week to week. Current affairs feels more productive because it is always new, but its yield per hour is unpredictable, since you cannot control which of a year of events the paper chooses to ask about.",
        difficulty: "Medium",
        skill: "General Studies and General Abilities",
      },
      {
        n: 6,
        question:
          "A coaching handout and the current notification disagree about the number of papers. What should the candidate do?",
        options: [
          "Follow the handout, since coaching institutes track the Commission closely",
          "Follow the notification, since it is the legal document governing that recruitment",
          "Prepare for whichever is larger, so as to be safe either way",
          "Wait for the Commission to issue a clarification before beginning preparation",
        ],
        answer: 1,
        explanation:
          "The notification is the governing document for the recruitment it announces, and the Commission has changed the shape of its recruitments across cycles, so a handout written for an earlier cycle can be sincerely produced and still wrong. Preparing for the larger scheme wastes weeks on a paper that may not be set, and waiting for a clarification spends the one resource, time, that cannot be recovered.",
        difficulty: "Easy",
        skill: "Objective examination format",
      },
      {
        n: 7,
        question:
          "Why is the Telangana Movement paper described as the paper where the Group-II field separates?",
        options: [
          "It carries more marks than the other papers",
          "It is answered from a narrow, specific body of material rather than from general awareness, so preparation shows",
          "It is the only descriptive paper in the scheme",
          "It is scored more leniently than the other papers",
        ],
        answer: 1,
        explanation:
          "General awareness will carry a candidate some distance in Papers I to III, but the movement paper turns on sequence, institutions and named documents that are only learned deliberately, so the gap between a prepared and an unprepared candidate is widest there. The idea that it carries more marks is the common misconception: every paper in the scheme carries the same weight, and its importance comes from the spread of scores, not from the total.",
        difficulty: "Hard",
        skill: "Telangana Movement paper",
      },
    ],
  },

  30202: {
    topicId: 30202,
    title: "Marks, negative marking and the qualifying stages",
    summary:
      "Work out what a mark is worth before you decide how you will attempt a paper, because a deduction for a wrong answer changes the arithmetic of guessing completely. Then learn the stages that stand between a good score and an appointment order.",
    concepts: [
      "Negative marking",
      "Expected value of a guess",
      "Minimum qualifying marks",
      "Answer key objection",
      "Certificate verification",
      "Final merit list",
    ],
    glossary: {
      "Penalty fraction":
        "The share of one mark deducted for a wrong answer, stated in the scheme of examination. If the scheme is silent, there is no deduction, and the whole calculation below changes.",
      "Expected value":
        "The average mark an attempt earns if you made the same kind of attempt many times. It is the correct way to compare a guessing policy against leaving a question blank, because a single question tells you nothing.",
      "Minimum qualifying marks":
        "A floor the Commission's general rules set below which a candidate is not considered for selection at all, whatever the vacancy position. It is set lower for reserved categories than for the open category.",
      "Provisional answer key":
        "The key the Commission publishes after the examination, open for a stated period to objections supported by evidence. It is provisional precisely because a sustained objection can change it.",
      "Certificate verification":
        "The stage at which candidates ranked within a multiple of the vacancies produce originals for their claims of age, qualification, category and residence. A claim you cannot document on paper is not a claim.",
      "Cut-off":
        "The mark of the last candidate selected in a category. It is an outcome of one cycle, not a rule, and it moves with the vacancies, the difficulty and the field.",
    },
    body: {
      Beginner: `<p>Every question in these papers is worth marks, and in most recent recruitment papers a wrong answer also costs you something. That second half is what most first time candidates get wrong, so start there.</p>
<h2>What a deduction means</h2>
<p>Suppose the scheme says one third of a mark is deducted for a wrong answer. You attempt three questions and get one right. You gain one mark for the correct answer and lose one third twice, which is two thirds. Your net for those three questions is one third of a mark. Had you left all three blank you would have scored nothing, and lost nothing.</p>
<p>So the question is not "should I guess" in general. It is "how good does my guess have to be before it is worth making".</p>
<h2>The arithmetic, once</h2>
<p>There are four options, so a completely blind guess is right one time in four. With a one third deduction, one hundred blind guesses give you about twenty five correct and seventy five wrong. That is twenty five marks gained and twenty five lost. You end exactly where you started, after spending time you did not have.</p>
<p>Now suppose you can rule out one option as clearly wrong. You are guessing between three, so you are right about thirty three times in a hundred. Thirty three marks gained, and sixty seven wrong answers costing about twenty two. You are ahead by about eleven marks.</p>
<p>Rule out two options and you are right half the time: fifty marks gained, fifty wrong answers costing about seventeen, so you are ahead by about thirty three marks. Elimination, not courage, is what makes guessing pay.</p>
<h2>The stages after the paper</h2>
<p>Scoring well is not the last step. In order, expect: the Commission publishes a provisional answer key, you may file objections with evidence inside a stated window, the final key is issued, results are declared, candidates near the top are called for <strong>certificate verification</strong> with original documents, and only then is a final merit list published.</p>
<p>There is also a floor. The Commission's general rules set a minimum percentage a candidate must reach to be considered at all, and that floor is lower for backward class candidates and lower again for scheduled caste, scheduled tribe and disabled candidates. The exact figures are printed in the notification, so read them there.</p>
<p>Keep your certificates ready from the day you apply. Candidates lose selections at verification for a caste certificate in the wrong format or a date of birth that differs between two documents, not for a shortage of marks.</p>`,
      Intermediate: `<p>Two candidates with the same knowledge routinely finish twenty marks apart, and the gap comes from attempt policy rather than from preparation. The policy is decidable in advance with simple arithmetic, so decide it in advance.</p>
<h2>First, read the deduction rule</h2>
<p>Do not carry a guessing habit from another examination into this one. Find the sentence in the scheme of examination that either prescribes a deduction for a wrong answer or states that there is none, and note the fraction. Everything below follows from that fraction, and the same policy is wrong under a different one.</p>
<h2>Expected value per attempt</h2>
<p>With four options and a penalty fraction of one third, the expected value of one attempt is the chance of being right, minus one third of the chance of being wrong.</p>
<table>
<tr><th>Options you can genuinely eliminate</th><th>Chance correct</th><th>Expected marks per attempt</th></tr>
<tr><td>None, a blind guess</td><td>1 in 4</td><td>0.00, exactly break even</td></tr>
<tr><td>One</td><td>1 in 3</td><td>About +0.11</td></tr>
<tr><td>Two</td><td>1 in 2</td><td>About +0.33</td></tr>
<tr><td>Three, so you know it</td><td>Certain</td><td>+1.00</td></tr>
</table>
<p>Read the first row carefully. Under a one third penalty a blind guess is not harmful on average, it is merely pointless, and it costs the seconds you would have spent on a question you could actually solve. Under a lighter penalty, say one fourth, the same blind guess turns slightly positive. Under a heavier one it turns negative. The rule is produced by the fraction, so the fraction is what you look up.</p>
<h2>A worked paper</h2>
<p>Take a paper of one hundred and fifty questions with a one third penalty. You answer one hundred and ten with real confidence and get ninety two of them right, so eighteen are wrong. Your score so far is ninety two minus eighteen divided by three, that is ninety two minus six, or eighty six.</p>
<p>Of the remaining forty, you can eliminate two options on twenty five of them. On average you take about twelve or thirteen of those, and lose about four marks on the rest, so you add roughly eight. You leave the last fifteen blank because you have no basis to eliminate anything. Final score: about ninety four.</p>
<p>Now run the same candidate with a fill every bubble policy. The last fifteen become blind guesses worth nothing on average, and the twenty five stay as they were. The score is the same, and the fifteen extra decisions were made at the end of the paper when accuracy on the other questions is most fragile. That is the real cost of a reckless policy under this penalty: not the marks it loses directly, but the attention it spends.</p>
<h2>The floor and the ladder</h2>
<p>Marks decide two different things. First, whether you cross the <strong>minimum qualifying marks</strong> the general rules prescribe, which vary by category and are printed in the notification. Fail that and vacancies are irrelevant. Second, where you sit in the ranked list, which is what actually gets you a post.</p>
<p>Between the two comes a process. The provisional answer key opens a window for evidenced objections. Certificate verification calls candidates in a ratio to the vacancies, so being called is not selection, and being just below the visible line is not exclusion. The final merit list is drawn only after verification, and the general rules carry a tie breaking provision for candidates who finish level.</p>`,
      Advanced: `<p>The attempt policy question is settled by arithmetic. What is not settled, and what actually separates a repeat attempter from a rank, is calibration: whether your sense of certainty tracks your accuracy. Most candidates who lose marks to negative marking are not reckless. They are overconfident in a specific, measurable way.</p>
<h2>Measure your calibration before you trust it</h2>
<p>Take your last three full length mocks and split every attempt into three bins as you made it: sure, narrowed to two, and blind. Then score each bin separately.</p>
<ul>
<li>If your sure bin is running below about ninety per cent accuracy, your problem is not guessing policy. It is that you are misclassifying uncertainty as certainty, and no attempt rule can repair that.</li>
<li>If your narrowed bin is running near fifty per cent, your elimination is real and the arithmetic says attempt every one of them.</li>
<li>If your narrowed bin is running near thirty per cent, your elimination is imagined. You are removing the option you dislike rather than the option that is wrong, and those attempts are costing you marks.</li>
</ul>
<p>That single audit is worth more than another hundred practice questions, because it tells you which of the three bins to work on.</p>
<h2>Where the deduction interacts with paper structure</h2>
<p>The papers are equally weighted, so a policy that is correct in one paper is correct in all of them, but the composition of your uncertainty differs by paper. In reasoning and data interpretation, uncertainty usually means you have not finished the working, and the right response is time, not a guess. In current affairs, uncertainty usually means you never saw the item, and no additional time will help, so a genuine elimination is the only basis for an attempt. Treating those two identically is a common and expensive error.</p>
<h2>Assertion, matching and statement questions</h2>
<p>The paper's formats change the value of partial knowledge, which is the thing elimination is made of.</p>
<ul>
<li><strong>Statement questions</strong> asking which of three statements are correct: knowing one statement is false often eliminates two or three of the four options at once. These are the highest yield questions for a partially prepared candidate, and they should be attempted aggressively.</li>
<li><strong>Matching pairs</strong>: one confidently known pair usually removes half the options. Same logic, same conclusion.</li>
<li><strong>Chronological ordering</strong>: fixing only the first and last events often leaves a single option standing. Candidates skip these because they cannot date every item, which is not what the question requires.</li>
<li><strong>Single fact recall</strong>: no partial credit is available. If you have not met the fact, elimination is usually false confidence and the question should be left.</li>
</ul>
<h2>What the stages after the paper are actually worth</h2>
<p>The answer key objection window is the one place a candidate can still act. A good objection cites a standard source, a textbook, a government publication or the Constitution itself, states the printed key and the claimed answer, and stops. An objection arguing that a question was unfair or ambiguous without a cited alternative rarely survives. Candidates who never file lose marks that were recoverable.</p>
<p>Two structural points repeat attempters misuse. A previous cycle's cut-off is a description of one field on one paper set, so calibrating your target to it is calibrating to a number that will not exist again. And certificate verification is documentary, not discretionary: the categories you can claim are the ones your certificates state, in the format and on the date the notification prescribes. Start that file the week you apply, not the week you are called.</p>`,
      Expert: `<p>Final month. Attempt policy and paperwork, reduced to rules you can execute without deliberation.</p>
<h2>Two line rules</h2>
<ul>
<li>Look up the penalty fraction in the notification. Compute break even once. Do not reason from another examination.</li>
<li>With four options and a one third penalty, a blind guess is worth zero on average. One genuine elimination makes it positive. Two make it clearly worth taking.</li>
<li>Elimination means you can say why an option is wrong. Disliking an option is not elimination.</li>
<li>Time spent guessing is time not spent finishing a question you could have solved. The blind guess costs attention even when it costs no marks.</li>
</ul>
<h2>Expected value table to memorise</h2>
<table>
<tr><th>State</th><th>Penalty one third</th><th>Penalty one fourth</th><th>No penalty</th></tr>
<tr><td>Blind, four live options</td><td>0.00</td><td>+0.06</td><td>+0.25</td></tr>
<tr><td>One eliminated</td><td>+0.11</td><td>+0.17</td><td>+0.33</td></tr>
<tr><td>Two eliminated</td><td>+0.33</td><td>+0.38</td><td>+0.50</td></tr>
<tr><td>Verdict</td><td>Eliminate, then attempt</td><td>Attempt most</td><td>Leave nothing blank</td></tr>
</table>
<h2>In the hall</h2>
<ul>
<li>Three sweeps: own it, work it, decide it. Never let sweep three start before sweep one has finished the whole paper.</li>
<li>Mark the booklet as you go so sweep two does not re-read the whole paper looking for its own questions.</li>
<li>Shade one bubble completely. A double shading is scored as a wrong answer, so an untidy correction can cost you the deduction as well as the mark.</li>
<li>Transfer answers as you go, never in a final block. A shortfall of two minutes at the end is survivable; forty untransferred answers is not.</li>
</ul>
<h2>Paperwork checklist</h2>
<ul>
<li>Date of birth identical across the school certificate, the application and the identity document.</li>
<li>Category and, where claimed, non creamy layer or income and asset certificates in the prescribed format and current on the date the notification fixes.</li>
<li>Local candidate or residence evidence matching the zone or district you claimed.</li>
<li>Degree provisional certificate or the memorandum of marks, plus the equivalence letter if your qualification is not named in the notification.</li>
<li>The answer key objection window entered in your calendar on the day results are expected, with your question paper booklet number preserved.</li>
</ul>
<p>Last rule: a cut-off from a previous cycle is a fact about that cycle, not a target. Prepare to the paper, not to a number somebody remembered.</p>`,
    },
  },

  30203: {
    topicId: 30203,
    title: "A six month plan that covers both notifications",
    summary:
      "Twenty six weeks is enough for the four papers if the hours are budgeted per paper and revision is scheduled rather than hoped for. This topic turns the syllabus into a week by week plan, an hour budget that adds up, and three artefacts you maintain to the last day.",
    concepts: [
      "Hour budget",
      "First pass and second pass",
      "Spaced revision",
      "Error log",
      "Test calendar",
      "Syllabus tracker",
    ],
    glossary: {
      "Syllabus tracker":
        "A sheet with one row for every syllabus line in the notification and columns for first pass, second pass and last revision date. It replaces the feeling that you have covered something with a record of when you did.",
      "First pass":
        "The reading that builds understanding for the first time. It is slow, it is done once per unit, and it is the only phase where new sources are allowed.",
      "Second pass":
        "A faster rereading built on notes rather than on the source, aimed at retention and at connecting units, not at understanding them afresh.",
      "Spaced revision":
        "Returning to a unit at widening intervals, for example after a day, a week and a month, because the gap before the next look is what forces recall rather than recognition.",
      "Error log":
        "A running list of every question you got wrong, with the reason grouped as unknown fact, misread question, calculation slip or wrong elimination. The reasons, not the questions, are what you act on.",
      "Sectional test":
        "A short timed test on one section of one paper, used to check a unit soon after you study it, as distinct from a full length simulation that checks stamina and pacing.",
    },
    body: {
      Beginner: `<p>Six months sounds like a long time and then disappears. It disappears because most candidates study whatever they feel like on the day, cover the same comfortable topics repeatedly, and leave the difficult ones untouched. A plan exists to stop exactly that.</p>
<h2>Start with three sheets of paper</h2>
<p>The first is your <strong>syllabus tracker</strong>. Copy every line of the syllabus from the notification, one line per row, with three empty columns beside it. You will tick the first column when you have read the unit once, the second when you have revised it, and write a date in the third when you last looked at it. Nothing else tells you what is left.</p>
<p>The second is your <strong>error log</strong>. Every time you get a practice question wrong, write one line: the topic, and why you got it wrong. Not the question, the reason. Reasons repeat, and repeated reasons are what you fix.</p>
<p>The third is a calendar with your test dates already written on it, before you have studied anything.</p>
<h2>The daily shape</h2>
<p>Keep the same three blocks every day, in the same order, so you do not spend energy deciding.</p>
<ol>
<li><strong>Forty five minutes of current affairs.</strong> One newspaper, read for the state and the nation, with short notes. Daily, without exception, because it cannot be caught up later.</li>
<li><strong>Thirty minutes of reasoning or arithmetic.</strong> A small set of questions, timed. This is the part of the paper that improves with practice more reliably than any other.</li>
<li><strong>The main block</strong>, an hour and a half or more, on one unit of one paper, taken in the order your tracker says.</li>
</ol>
<h2>The six months in outline</h2>
<ul>
<li><strong>Weeks 1 and 2</strong>: read the syllabus, choose your sources, and take one honest test to find out where you stand.</li>
<li><strong>Weeks 3 to 12</strong>: first reading of everything, unit by unit, ticking the tracker.</li>
<li><strong>Weeks 13 to 18</strong>: second reading from your own notes, plus the Telangana movement paper in depth.</li>
<li><strong>Weeks 19 to 23</strong>: full papers under the clock, one a week, and the error log worked after each.</li>
<li><strong>Weeks 24 to 26</strong>: revision only. No new book, no new source, no new video.</li>
</ul>
<p>One warning about sources. Pick one standard book per subject and stay with it. A candidate with four books on the same subject has read none of them properly, and switching books in month five is how six months of work is thrown away.</p>`,
      Intermediate: `<p>A plan is credible only if the hours in it exist. So the plan is built in two steps: fix a weekly hour budget you can actually keep on a bad week, then allocate those hours across the four papers by the marks they carry and the distance you have to travel in each.</p>
<h2>The hour budget</h2>
<p>Take a candidate who is working or in a final year: two hours on each of five weekdays, six hours on each weekend day. That is twenty two hours a week, and across twenty six weeks it is five hundred and seventy two hours. Reserve one fifth of that, about one hundred and fourteen hours, for testing and for the revision that testing generates. Four hundred and fifty eight hours remain for learning.</p>
<table>
<tr><th>Paper</th><th>Hours</th><th>What the hours buy</th></tr>
<tr><td>Paper-I</td><td>150</td><td>Reasoning and data interpretation 60, current affairs 45, general science 25, environment and disaster management 20</td></tr>
<tr><td>Paper-II</td><td>120</td><td>History 55, polity 40, society and public policy 25</td></tr>
<tr><td>Paper-III</td><td>100</td><td>Indian economy 40, Telangana economy 40, development issues 20</td></tr>
<tr><td>Paper-IV</td><td>88</td><td>Three periods of the movement, roughly thirty hours each, plus a document and institution drill</td></tr>
</table>
<p>If you are sitting Group-III only, the eighty eight hours of Paper-IV move into the other three, weighted towards whichever paper your diagnostic test says is weakest. If both notifications are live, keep the table as it stands: it is the Group-II plan, and it contains the Group-III plan whole.</p>
<h2>The five phases</h2>
<p><strong>Weeks 1 to 2, diagnosis.</strong> Take one full length paper cold. It will be a poor score and it is supposed to be. What you want from it is the ranking of your four papers, which decides the order of everything that follows. Build the tracker, fix one source per subject, and stop choosing sources after this fortnight.</p>
<p><strong>Weeks 3 to 12, first pass.</strong> Cover every unit once, in a fixed rotation so no paper goes untouched for more than a few days. The daily current affairs block and the daily reasoning block run underneath the whole phase and are never traded away for more reading, because both decay when interrupted.</p>
<p><strong>Weeks 13 to 18, second pass and depth.</strong> Reread from your notes, not from the book. This is where the Telangana movement paper receives its concentrated block, because it rewards sequence and connection, both of which need the surrounding history already in place.</p>
<p><strong>Weeks 19 to 23, the test phase.</strong> One full paper a week under exact conditions, plus sectional tests midweek. The test is not the work. The two hours you spend on the error log after the test is the work.</p>
<p><strong>Weeks 24 to 26, compression.</strong> Three revision sweeps of falling length, each one from shorter notes than the last. New material is banned in this phase, including material a friend swears is important.</p>
<h2>Scheduling the revision instead of hoping for it</h2>
<p>When you finish a unit, write three dates in your tracker: the next day, seven days later and thirty days later. Each is a ten minute recall, not a reread: close the notes, list what the unit contained, then open them and see what you missed. Recall under a small delay is what moves material into the memory that survives to the examination hall, and it costs a fraction of the time a reread costs.</p>`,
      Advanced: `<p>The plan above works for a first attempt. A second attempt has a different problem, and copying the same plan is the most common way a repeat attempter finishes with the same score. You are not short of exposure. You are short of retrieval, and you have a plateau that another first pass will not move.</p>
<h2>Diagnose the plateau before rebuilding the plan</h2>
<p>Score your last three full papers and split every loss into four causes using the error log: fact you never met, fact you met and forgot, question you misread, and working you got wrong under time. The distribution decides the plan.</p>
<ul>
<li><strong>Mostly never met.</strong> Your coverage has holes. Audit the tracker against the notification line by line, because holes hide in the syllabus lines nobody teaches, such as the state policy unit or the demography portion.</li>
<li><strong>Mostly met and forgot.</strong> Reading more will not help and may hurt. Convert the plan from reading to retrieval: fewer sources, shorter notes, more frequent recall, and testing moved forward from week nineteen to week eight.</li>
<li><strong>Mostly misread.</strong> The loss is procedural. Slow the first ten seconds of every question, underline the qualifier, and treat every question with "not" or "except" as a separate class you check twice.</li>
<li><strong>Mostly working errors.</strong> The problem is in Paper-I and it is fixable at a rate no other component matches. Move reasoning and data interpretation from thirty minutes daily to sixty for eight weeks and measure accuracy weekly.</li>
</ul>
<h2>What a working candidate actually cuts</h2>
<p>Twenty two hours a week is not available to everyone, and a plan that assumes hours you do not have fails in week four and takes your confidence with it. If you have fourteen hours, cut in this order and no other. Cut breadth of sources first, down to one per subject. Cut the second pass on your two strongest papers next, replacing it with testing. Cut current affairs last, and never below thirty minutes daily. Never cut the error log; it costs minutes and it is the only part of the system that tells you where the hours should go.</p>
<h2>When the notification lands mid plan</h2>
<p>A notification can arrive with less than six months to the examination, which is the normal case rather than the exception. Do not restart. Compress by phase, keeping the proportions: shorten the first pass by dropping the units your tracker already shows as revised, keep the test phase intact at its full length, and protect the last three weeks of compression absolutely. The phases that get cut are the ones in the middle, not the ones at the end, because a candidate who arrives at the hall having never sat a full four paper day pays for it in the fourth paper.</p>
<h2>Two failure modes specific to a two notification plan</h2>
<p>The first is drift towards Group-III because it looks smaller. It is smaller in papers, not in depth, and a candidate who plans for three papers cannot pivot to four in the last month. Plan for four.</p>
<p>The second is treating the shared papers as done because you covered them for the other recruitment. Both papers are written on different days from the same memory, and memory is the thing that fails. Your tracker should show a revision date for every shared unit inside the last three weeks, regardless of how well you knew it in month two.</p>`,
      Expert: `<p>Thirty days left. The plan collapses to one rule: nothing new, everything recalled, on a schedule you do not renegotiate daily.</p>
<h2>The final thirty days</h2>
<table>
<tr><th>Days</th><th>Focus</th><th>Output</th></tr>
<tr><td>30 to 22</td><td>Sweep one from full notes, all four papers, plus two full length papers</td><td>Error log entries triaged into fixable and accept</td></tr>
<tr><td>21 to 13</td><td>Sweep two from short notes only, plus two full length papers on the real clock</td><td>One page per subject, the only sheet you will read on the last day</td></tr>
<tr><td>12 to 4</td><td>Sweep three from the one page sheets, one full four paper simulation on consecutive sittings</td><td>Attempt policy fixed and rehearsed</td></tr>
<tr><td>3 to 1</td><td>One page sheets, the movement chronology, and sleep on the examination timetable</td><td>Documents packed, route checked</td></tr>
</table>
<h2>Rules that survive fatigue</h2>
<ul>
<li>No new source after day thirty. A book opened in the last month competes with revision and wins, which is the wrong outcome.</li>
<li>Current affairs continues daily, but from your own consolidated notes, not from the newspaper's full pages.</li>
<li>Reasoning and data interpretation continues daily at reduced volume. Skill decays faster than knowledge.</li>
<li>Every full length paper is written at the hour the real paper is written, seated, without a phone, in one sitting.</li>
<li>Sleep is part of the plan. A candidate who sleeps four hours in the last week loses more in reading speed and misread questions than the extra hours can return.</li>
</ul>
<h2>What to abandon, deliberately</h2>
<ul>
<li>Units your tracker shows as never started with fewer than twenty days left. Starting them steals from material you can still hold.</li>
<li>Any topic where three attempts at recall have failed. Mark it accept, and spend those minutes protecting the twenty units next to it.</li>
<li>Comparison with other candidates' schedules. In the last month the only useful number is your own accuracy trend across the last four papers.</li>
</ul>
<h2>Last week checklist</h2>
<ul>
<li>Hall ticket printed twice, photo identity document, the documents named on the hall ticket.</li>
<li>Examination centre route travelled once, at the hour of the paper.</li>
<li>Attempt policy written on one line and read before each paper.</li>
<li>One page sheets in the order you will read them between sittings, longest first.</li>
</ul>`,
    },
  },

  30204: {
    topicId: 30204,
    title: "Current affairs: state, national and international",
    summary:
      "Current affairs is the least controllable part of Paper-I, so it is managed by method rather than by volume: one window, fixed sources, a note format, and a monthly consolidation you actually reread. Every item is filed under a static syllabus head, because that is how the paper asks about it.",
    concepts: [
      "Twelve month window",
      "Source discipline",
      "Static linkage",
      "Monthly consolidation",
      "Reports and their publishers",
      "State current affairs",
    ],
    glossary: {
      "Twelve month window":
        "The period the paper setter draws from, in practice the year or so running up to the examination. Events far outside it are asked only when they have become static knowledge.",
      "Static linkage":
        "The habit of filing every news item under the syllabus head it belongs to, so a news item about a tribunal becomes a polity revision and not a separate thing to remember.",
      Compendium:
        "Your own consolidated monthly file of current affairs notes. It exists so that revision in the last month reads one document instead of nine months of newspapers.",
      "Press Information Bureau":
        "The Union government's official release channel. It carries the government's own wording for schemes, appointments and reports, which is the wording an examiner is most likely to have read.",
      "Socio Economic Outlook":
        "The annual compilation the state's planning department brings out around the state budget. It is the natural source for Telangana sector data, since the national Economic Survey does not carry state detail at that level.",
      "Examinable item":
        "A news item with a stable, checkable core: an institution, a place, a first, a report and its publisher, or a scheme and its department. A developing controversy with no settled facts is news but is rarely an examinable item.",
    },
    body: {
      Beginner: `<p>Current affairs means recent events, but not everything in the newspaper is current affairs for this paper. A cricket result and a local road accident are news. A new law, a scheme launched by the state, a report released by an international agency and a summit held in a named city are what the paper asks about.</p>
<h2>What to read, and for how long</h2>
<p>Read one newspaper daily, for about forty five minutes, and read it for these things only: government decisions, schemes and their departments, laws and bills, appointments to constitutional and statutory posts, reports and the organisation that released them, awards, and anything at all about Telangana.</p>
<p>Skip the opinion columns, the sports pages and the film coverage. They are not scored.</p>
<h2>How to take a note</h2>
<p>Write four short lines and nothing more. Any longer and you will not reread it.</p>
<ol>
<li><strong>What happened</strong>, in one line.</li>
<li><strong>Who did it</strong>, meaning the ministry, department or organisation.</li>
<li><strong>Where</strong>, if a place is involved.</li>
<li><strong>The syllabus head it belongs to</strong>, such as polity, economy, environment or Telangana.</li>
</ol>
<p>That fourth line is the one beginners leave out and it is the most useful. A news item about a new tribunal is really a polity item, and writing that down means your current affairs notes and your polity revision start feeding each other.</p>
<h2>Three levels, and the one people neglect</h2>
<p>State affairs cover Telangana: schemes, projects such as the drinking water grid and the lift irrigation works on the Godavari, appointments in the state, and the state budget. National affairs cover the Union government, Parliament and national institutions. International affairs cover summits, organisations and the reports they publish.</p>
<p>Candidates read the national news carefully and skim the state pages. For this examination that is the wrong way round. This is a state commission's paper, and the state pages are where its questions come from.</p>
<h2>The habit that makes it work</h2>
<p>At the end of every month, spend two hours turning that month's notes into a few clean pages arranged by syllabus head. This is your <strong>compendium</strong>. In the last month before the examination you will revise from those pages, not from nine months of newspapers, and that is the only version of current affairs revision that is possible to finish.</p>`,
      Intermediate: `<p>Current affairs cannot be finished, only managed. The syllabus line is open ended, the material arrives daily whether you read it or not, and the paper will ask about a handful of items out of thousands. So the objective is not coverage. It is a high hit rate on the items that are actually examinable, at a fixed and small daily cost.</p>
<h2>Fix the window and the sources</h2>
<p>Work to a window of roughly the twelve months before the paper, extending backwards where an item has already become static, such as a law that has been in force for two years. Then fix your sources and stop looking for more.</p>
<ul>
<li><strong>One daily newspaper</strong>, read for decisions rather than for commentary, with the state pages read first.</li>
<li><strong>Official releases</strong> for the government's own wording of a scheme or a report. The Press Information Bureau at the Union level, and the state's own departmental releases and government orders for Telangana.</li>
<li><strong>The Economic Survey</strong> for national economic themes, and the state's <strong>Socio Economic Outlook</strong> around the state budget for Telangana sector data.</li>
<li><strong>A monthly magazine or your own compendium</strong> for consolidation. One of them, not both.</li>
</ul>
<p>A candidate reading four newspapers has less usable current affairs than a candidate reading one and consolidating it, because the second candidate has notes and the first has hours.</p>
<h2>Static linkage, worked</h2>
<p>Take a news item about a state government notification bringing a new category under a welfare scheme. Filed as news, it is one forgettable fact. Filed by linkage, it becomes three revisions: the constitutional provision under which welfare classification is done, the state's own welfare architecture in the social issues section of Paper-II, and the budget head it is paid from in Paper-III.</p>
<p>Do the same with an international item. A report on climate finance is a current affairs item, a sustainable development item in Paper-I, and a link to the convention it was written under. The paper sets these as a pair or as a statement question far more often than as bare recall, and linkage is what lets you answer those.</p>
<h2>The forms the questions take</h2>
<table>
<tr><th>Form</th><th>What it tests</th><th>How to prepare for it</th></tr>
<tr><td>Report and publisher</td><td>Which organisation released a named report or index</td><td>Keep a single running table of report to publisher</td></tr>
<tr><td>Scheme and department</td><td>The ministry or department that owns a scheme, and its objective</td><td>Note the department in the same line as the scheme, always</td></tr>
<tr><td>Venue and event</td><td>The city or country that hosted a named summit or edition</td><td>One line per summit, with the host and the year</td></tr>
<tr><td>Statement questions</td><td>Two or three claims about one item, of which some are correct</td><td>Note the specifics, since one false detail decides the answer</td></tr>
<tr><td>State specific recall</td><td>A Telangana project, institution, appointment or scheme</td><td>Read state pages first and note every state item without filtering</td></tr>
</table>
<h2>The monthly cycle</h2>
<p>Daily notes cost forty five minutes. On the last weekend of each month, spend two hours rewriting the month into a compendium arranged by syllabus head, dropping anything that has not survived the month. Then reread the previous two months' pages. That reread is the part that converts a note into an answer, and it is the part most candidates skip while continuing to take fresh notes daily.</p>`,
      Advanced: `<p>Repeat attempters usually do more current affairs than first timers and score no better. The reason is that the additional effort goes into intake, which is already sufficient, rather than into selection and retrieval, which are the two things that were actually failing.</p>
<h2>Selection: what is examinable and what is only news</h2>
<p>An examinable item has a stable core that can be printed as an option: an institution, a place, a first, a number that is definitional rather than provisional, a report with a publisher, a scheme with a department. A running political controversy, a court case still being heard, a projection that will be revised next quarter: these fill the newspaper and almost never fill an option.</p>
<p>Apply one test to every item before you note it. Could this be printed as an option in twelve months without needing an update? If not, read it for context and do not write it down. Applying that test cuts note volume by half and improves recall on what remains, because recall competes for the same limited attention.</p>
<h2>Retrieval: how the last month fails</h2>
<p>The standard failure is a compendium of nine months that is read once, in week two of the final month, and then never again. Nine months of notes cannot be revised once and retained. Build the compendium so that it can be read three times at falling cost: full notes, then a one page per month digest, then a single sheet of the twenty items you keep forgetting. Your error log tells you which twenty; nothing else does.</p>
<h2>State affairs are the differentiator, and they are asked differently</h2>
<ul>
<li>State questions lean towards institutions, projects and administrative geography rather than towards personalities, so a project's river basin, purpose and district matter more than the ceremony at which it was announced.</li>
<li>The state budget and the Socio Economic Outlook are the two documents that generate the most state questions per hour spent, because they are compiled, official and sectoral. A candidate who reads the outlook's sector chapters once has covered material that a year of newspapers scatters.</li>
<li>Government orders matter in this state's paper in a way they do not elsewhere, because the movement paper itself turns on named orders. The habit of noting an order by its number and subject pays in two papers at once.</li>
<li>Do not carry a national framing into a state item. A national scheme implemented in Telangana is asked as a state item, with the state's implementing department named.</li>
</ul>
<h2>Traps that survive into a second attempt</h2>
<p><strong>The number trap.</strong> Memorising provisional figures such as growth estimates and scheme outlays feels like precision and is the least stable knowledge you can hold, since the figure is revised before the paper is set. Learn the direction, the source and the definition. Learn the number only when it is definitional, such as the number of goals in a global framework or the year a convention was adopted.</p>
<p><strong>The digest trap.</strong> A video or a summary consumed without a note produces familiarity, which feels like knowledge and fails at recall. If it is worth watching, it is worth one line in the compendium; if it is not worth a line, it was not worth the twenty minutes.</p>
<p><strong>The recency trap.</strong> Items from the last three weeks before the paper feel urgent and are the least likely to be asked, because papers are set in advance. Protect the earlier months of the window instead, which is where your memory is weakest and the setter's attention is strongest.</p>
<p><strong>The completeness trap.</strong> There is no state at which current affairs is finished, so a candidate chasing completeness is choosing an unbounded task over three bounded ones. Cap the daily cost, keep the cap, and spend the surplus on papers where an hour has a predictable yield.</p>`,
      Expert: `<p>Final month. Intake drops to maintenance, and the entire effort moves to recall from your own compendium.</p>
<h2>Daily allocation in the last month</h2>
<ul>
<li>Fifteen minutes of headlines, for continuity only. No fresh note taking beyond one line an item.</li>
<li>Forty five minutes of compendium recall, oldest month first, because that is where forgetting has had longest to work.</li>
<li>One weekly pass over the state pages of your notes, since state items carry the highest marginal value in this paper.</li>
</ul>
<h2>Lists to hold in one sheet each</h2>
<table>
<tr><th>Sheet</th><th>Contents</th><th>Why it pays</th></tr>
<tr><td>Reports and publishers</td><td>Report or index name against the organisation that releases it</td><td>The single most repeated question form in this section</td></tr>
<tr><td>Schemes and owners</td><td>Scheme against the ministry or state department, and its stated objective</td><td>Statement questions turn on the owner, not the slogan</td></tr>
<tr><td>Summits and venues</td><td>Event, host city or country, and the grouping it belongs to</td><td>Pure recall, cheap to hold, frequently set</td></tr>
<tr><td>State projects</td><td>Project, river or district, and purpose</td><td>State specific recall, and it doubles as geography revision</td></tr>
<tr><td>Institutions and seats</td><td>Organisation against its headquarters and its parent body</td><td>Stable across years, so it never needs updating</td></tr>
</table>
<h2>Edge cases</h2>
<ul>
<li>An organisation's report can share a name with another organisation's. Note both the report and the publisher together or the pair is useless.</li>
<li>A scheme renamed by a government is still asked by both names for a period. Keep the old name in brackets in your notes.</li>
<li>An appointment question is usually about the post and its constitutional or statutory basis rather than the individual, so revise the office, not the name.</li>
<li>An item in the window that has since been superseded can still be asked as it stood. Note the date beside the item so you can answer as at the time.</li>
</ul>
<h2>Two line rules</h2>
<p>Read the state pages first, every day, to the last day. If an item cannot be printed as an option a year from now, it is context and not a note. Direction and source beat the figure. Revise the oldest month most often, because it is the one you have most nearly lost.</p>`,
    },
    questions: [
      {
        n: 1,
        question: "Which organisation publishes the Human Development Report?",
        options: [
          "The World Bank",
          "The United Nations Development Programme",
          "The International Monetary Fund",
          "The World Economic Forum",
        ],
        answer: 1,
        explanation:
          "The Human Development Report, and the Human Development Index inside it, come from the United Nations Development Programme. The World Bank is the tempting answer because it publishes the similarly named World Development Report, and the paper sets exactly this pair, so the report name and the publisher must be learned together rather than separately.",
        difficulty: "Easy",
        skill: "Reports and their publishers",
      },
      {
        n: 2,
        question:
          "You want current, official, sector by sector data on Telangana's agriculture and industry for Paper-III. Which single document is the most efficient source?",
        options: [
          "The Union Economic Survey for the same year",
          "The state's annual Socio Economic Outlook, published around the state budget",
          "A year of newspaper clippings on the state economy",
          "The decennial Census of India volumes",
        ],
        answer: 1,
        explanation:
          "The Socio Economic Outlook is the state planning department's own annual compilation, arranged by sector, which makes it both official and quick to mine. The Union Economic Survey is the attractive wrong answer: it is official and annual, but it treats the national economy and does not carry state sector detail at the level this paper asks about.",
        difficulty: "Medium",
        skill: "State current affairs",
      },
      {
        n: 3,
        question:
          "A candidate reads four newspapers daily and takes no notes. Another reads one, takes four line notes and consolidates monthly. Why does the second candidate usually score higher?",
        options: [
          "The second candidate covers more events across the year",
          "The second candidate has a revisable record, so the material can be recalled rather than merely recognised",
          "Newspapers repeat each other, so the first candidate reads nothing new",
          "The paper only sets questions from one newspaper",
        ],
        answer: 1,
        explanation:
          "Objective questions are answered from recall, and recall requires something you can return to at intervals, which is what notes and a monthly consolidation give you. Coverage is the tempting explanation but it is false: the first candidate almost certainly sees more events, and sees them once, which is why familiarity without a record fails in the hall.",
        difficulty: "Easy",
        skill: "Source discipline",
      },
      {
        n: 4,
        question: "What does static linkage mean in current affairs preparation?",
        options: [
          "Restricting your reading to events that have not changed for several years",
          "Filing every news item under the syllabus head it belongs to, so it revises static material at the same time",
          "Learning only those events that appeared in a previous year's paper",
          "Reading the static textbook before the newspaper each day",
        ],
        answer: 1,
        explanation:
          "Linkage means a news item about a tribunal is filed as polity and a report on climate finance is filed as sustainable development, so one reading serves two syllabus lines and the item is anchored to something you already revise. Restricting yourself to unchanging events sounds similar but describes avoidance of current affairs rather than a method for handling it.",
        difficulty: "Medium",
        skill: "Static linkage",
      },
      {
        n: 5,
        question:
          "The Economic Survey is prepared and tabled by which authority, and in what relation to the Union Budget?",
        options: [
          "NITI Aayog, tabled after the Budget",
          "The Reserve Bank of India, tabled with the Budget",
          "The Ministry of Finance, tabled shortly before the Budget",
          "The Comptroller and Auditor General, tabled after the Budget",
        ],
        answer: 2,
        explanation:
          "The Survey is prepared in the Department of Economic Affairs under the Chief Economic Adviser and tabled in Parliament by the Finance Minister, ordinarily a day before the Budget, so it reads as the analysis that precedes the numbers. NITI Aayog is the tempting choice because it is the government's policy think tank, but it issues its own reports and indices and is not the author of the Survey.",
        difficulty: "Medium",
        skill: "Reports and their publishers",
      },
      {
        n: 6,
        question:
          "In the final month, why should current affairs revision begin with the oldest months of the window rather than the most recent weeks?",
        options: [
          "Older events are more likely to be asked because they are more important",
          "Forgetting has had longest to act on the oldest material, and papers are set in advance so the last few weeks are the least likely to appear",
          "The compendium is arranged chronologically and must be read in order",
          "Recent events will be covered by the newspaper you are still reading",
        ],
        answer: 1,
        explanation:
          "Two effects point the same way: your retention is weakest where the material is oldest, and a paper finalised before the examination cannot draw on the last few weeks. Importance is the tempting justification but it is not the mechanism, since the setter's choice is governed by the window and the preparation lead time rather than by an event's significance.",
        difficulty: "Hard",
        skill: "Twelve month window",
      },
      {
        n: 7,
        question: "What is the purpose of the monthly consolidation in this method?",
        options: [
          "To add the events that the newspaper missed during the month",
          "To reduce a month of daily notes to a revisable file arranged by syllabus head, dropping what has not survived",
          "To test yourself on the month's events under timed conditions",
          "To compare your notes with a commercial monthly magazine",
        ],
        answer: 1,
        explanation:
          "Consolidation exists so that the last month reads one organised file instead of nine months of loose notes, and the pruning that happens during it is as valuable as the rewriting. Testing yourself is useful but is a separate activity: it measures retention, whereas consolidation is what creates something compact enough to retain.",
        difficulty: "Easy",
        skill: "Monthly consolidation",
      },
    ],
  },

  30205: {
    topicId: 30205,
    title: "General science and its everyday applications",
    summary:
      "The science asked here is the science of a kitchen, a switchboard, a health centre and a field, tested one applied fact at a time rather than through derivations. You cover physics, chemistry and biology to the school textbook ceiling, and add India's own science and technology achievements.",
    concepts: [
      "Applied physics in daily life",
      "Everyday chemistry",
      "Domestic electricity and safety",
      "Nutrition and deficiency diseases",
      "Vector borne diseases",
      "India's science and technology achievements",
    ],
    glossary: {
      "Boiling point":
        "The temperature at which a liquid turns to vapour at a given pressure. It rises when pressure rises and falls when pressure falls, which is why a sealed cooker cooks faster and a hill station cooks slower.",
      "Hard water":
        "Water carrying dissolved calcium and magnesium salts. It wastes soap by forming scum instead of lather, and the temporary kind, caused by bicarbonates, is removed simply by boiling.",
      "Kilowatt hour":
        "The unit your electricity bill counts. One kilowatt of load running for one hour is one unit, so an appliance's rating in watts and its hours of use are all you need to estimate a bill.",
      Galvanisation:
        "Coating iron or steel with zinc. The zinc corrodes in preference to the iron beneath it, so the protection continues even where the coating is scratched.",
      "Oral rehydration solution":
        "A measured mixture of salt and sugar in clean water. The sugar is not there for energy; glucose and sodium are absorbed together in the gut, and water follows them, which is why plain salt water works far less well.",
      Vector:
        "An organism that carries a disease causing agent from one host to another. The mosquito is the vector; the parasite or virus it carries is the pathogen, and questions frequently swap the two.",
    },
    body: {
      Beginner: `<p>The science in this paper is not the science of long derivations. It is the science behind things you already use, asked one fact at a time. Six examples will show you the level.</p>
<h2>Why a pressure cooker is faster</h2>
<p>Water boils at one hundred degrees Celsius in an open vessel at sea level, and however long you boil, it will not get hotter than that. A cooker traps the steam, which raises the pressure inside, and higher pressure raises the boiling point. The food now sits in water hotter than one hundred degrees, so it cooks in less time. On a high hill the opposite happens: the air presses less, water boils below one hundred degrees, and cooking takes longer.</p>
<h2>Why cooking gas smells</h2>
<p>Liquefied petroleum gas has no smell of its own. A strongly smelling chemical is added deliberately so that a leak is noticed before it becomes dangerous. The smell is a safety device, not a property of the fuel.</p>
<h2>Why soap does not lather in some water</h2>
<p>Water that has flowed through limestone picks up calcium and magnesium salts and becomes <strong>hard water</strong>. Soap reacts with those salts and forms a sticky scum instead of lather. If the hardness is the temporary kind, boiling the water removes it.</p>
<h2>Reading an electricity bill</h2>
<p>An appliance is rated in watts, which is how fast it uses energy. One thousand watts running for one hour is one <strong>unit</strong>. A geyser rated one thousand five hundred watts, used two hours a day for thirty days, uses one and a half multiplied by two multiplied by thirty, which is ninety units in the month.</p>
<h2>Food and illness</h2>
<p>Some illnesses come from a missing nutrient rather than a germ. Too little vitamin A causes night blindness, too little vitamin C causes scurvy, too little iron causes anaemia and too little iodine causes goitre, which is why household salt is iodised.</p>
<h2>Mosquitoes and the diseases they carry</h2>
<p>The mosquito does not cause the disease, it carries it. The Anopheles mosquito carries the malaria parasite. The Aedes mosquito carries dengue, bites mainly in daylight, and breeds in clean stored water such as a cooler tray or an uncovered drum, which is why the advice is to empty containers weekly.</p>
<p>Study at this level, across the whole of school science, rather than deeply in one subject. Breadth is what this section rewards.</p>`,
      Intermediate: `<p>The science section is wide and shallow by design. The ceiling is the school textbook, up to about the tenth standard, and the questions are applied: a phenomenon you have seen, and the reason for it. So organise your revision by subject, and inside each subject by application rather than by chapter.</p>
<h2>Physics you can point at</h2>
<ul>
<li><strong>Heat.</strong> Pressure raises the boiling point, so a cooker cooks hotter and a hill cooks cooler. Convection explains why a room heater warms the whole room and why the sea breeze reverses at night.</li>
<li><strong>Light.</strong> A short sighted eye is corrected with a concave lens and a long sighted eye with a convex one. Total internal reflection is what carries a signal along an optical fibre, and dispersion in water droplets is what makes a rainbow.</li>
<li><strong>Sound.</strong> Frequencies above human hearing are ultrasound, used in imaging and in cleaning. An echo is reflection, and a distance can be computed from the delay.</li>
<li><strong>Electricity.</strong> Power is voltage multiplied by current. Transmission uses high voltage precisely to keep current low, because the heat lost in a line rises with the square of the current.</li>
</ul>
<h2>A worked domestic calculation</h2>
<p>A household runs a one thousand five hundred watt geyser for two hours daily, five ceiling fans of seventy five watts each for eight hours, and eight light points of nine watts each for five hours. In a thirty day month the geyser uses ninety units, the fans use zero point three seven five kilowatts for eight hours, or three units a day, which is ninety units, and the lights use zero point zero seven two kilowatts for five hours, about zero point three six units a day, or roughly eleven units. The month comes to about one hundred and ninety one units, and the geyser and the fans account for almost all of it. Questions in this style test whether you can convert watts and hours into units, nothing more.</p>
<h2>Chemistry in the house and the field</h2>
<ul>
<li>Rusting needs both oxygen and moisture. Painting excludes them; galvanising goes further, because zinc corrodes in preference to the iron underneath.</li>
<li>Baking soda is sodium bicarbonate and washing soda is sodium carbonate. They are different compounds with different uses and the paper does confuse candidates deliberately here.</li>
<li>Drinking water is disinfected with chlorine compounds such as bleaching powder. Hardness is a separate problem from contamination, and boiling addresses temporary hardness and pathogens but not dissolved permanent hardness.</li>
<li>Urea supplies nitrogen, and phosphatic fertilisers supply phosphorus. Excess nitrogen washing into a tank drives algal growth, which strips the water of oxygen.</li>
</ul>
<h2>Biology that is asked as health</h2>
<p>Deficiency diseases pair a nutrient with a condition, and that pairing is the whole question. Vector borne diseases pair a mosquito with a pathogen, and the paper will sometimes ask for the vector and sometimes for the pathogen. Oral rehydration is asked as a mechanism: glucose and sodium are absorbed together and water follows, which is why the sugar matters as much as the salt.</p>
<h2>India's science and technology</h2>
<p>Keep a short list with dates you can defend: the first Indian satellite in 1975, the lunar orbiter of 2008 whose data supported the presence of water molecules on the Moon, the Mars orbiter placed in orbit in 2014, and the 2023 soft landing in the lunar south polar region. Alongside that, hold the three stage nuclear programme in outline: pressurised heavy water reactors on natural uranium, then fast breeder reactors using the plutonium they produce, then a thorium based stage, which is the stage that matters for India because the country's thorium reserves are large.</p>`,
      Advanced: `<p>A candidate who has read school science once can still lose eight or ten marks in this section, and the losses are concentrated in a small number of confusable pairs rather than spread across the syllabus. Work on the pairs.</p>
<h2>The confusables that decide the section</h2>
<table>
<tr><th>Pair</th><th>The distinction that is actually asked</th></tr>
<tr><td>Vector and pathogen</td><td>Anopheles carries a protozoan parasite, Aedes carries a virus. A question asking for the causative organism is not asking for the mosquito.</td></tr>
<tr><td>Baking soda and washing soda</td><td>Sodium bicarbonate against sodium carbonate. Different formula, different use, and the names are close enough to be set as a trap.</td></tr>
<tr><td>Temporary and permanent hardness</td><td>Bicarbonates against sulphates and chlorides. Only the first is removed by boiling.</td></tr>
<tr><td>Fuse or breaker and earthing</td><td>The first interrupts an excessive current; the second gives leakage current a safe path to ground. They protect against different accidents.</td></tr>
<tr><td>Deficiency and infection</td><td>Scurvy and rickets have no germ. A question listing a nutritional condition among infectious ones is testing that distinction.</td></tr>
<tr><td>Antibiotic and antiviral</td><td>Antibiotics act on bacteria and do nothing to a virus. This is asked as a public health question as often as a biology one.</td></tr>
</table>
<h2>Where to stop reading</h2>
<p>The ceiling is real and worth respecting. You will not be asked to derive, to balance an unfamiliar equation or to solve a numerical beyond arithmetic. Time spent on higher secondary physics is time taken from the state economy paper, where the same hour has a far higher yield. The correct depth is: know the phenomenon, the reason and the standard application, and stop.</p>
<p>The exception is the applied numerical, which is worth practising because it is deterministic. Units of electricity, simple ratios of dose or dilution, percentage composition and speed of sound style distance problems all appear, and all of them are arithmetic dressed as science.</p>
<h2>How the section is actually set</h2>
<ul>
<li><strong>Single fact recall</strong> dominates, and it is unforgiving: either the pair is in memory or it is not, and elimination is usually false comfort.</li>
<li><strong>Statement questions</strong> give you two or three claims about one phenomenon. Here partial knowledge pays, because one clearly false statement often removes two options.</li>
<li><strong>Application questions</strong> describe a situation, such as a cooker at altitude or a leaking appliance, and ask for the reason. These reward understanding over memorisation and are the ones a prepared candidate should never lose.</li>
<li><strong>Achievement questions</strong> ask about missions, institutions and programmes. Learn the institution and the purpose; specific mission numbers and payload names are lower yield.</li>
</ul>
<h2>Two habits that convert this section</h2>
<p>First, revise from a single sheet of pairs rather than from a textbook. The section is pair shaped, so the notes should be pair shaped. Second, when you get one wrong, log the reason as confusion between a named pair rather than as science not known, because that turns a vague weakness into a fixable list of about thirty items.</p>
<p>Finally, do not neglect the health and public health end. Vector control, immunisation, nutrition programmes and safe drinking water sit at the join between this section and the public policy section of Paper-II, so an hour there is paid twice.</p>`,
      Expert: `<p>Final month. This section is memory maintenance, and memory maintenance is done from tables.</p>
<h2>Deficiency table</h2>
<table>
<tr><th>Nutrient</th><th>Condition</th><th>Everyday marker</th></tr>
<tr><td>Vitamin A</td><td>Night blindness</td><td>Poor vision in dim light</td></tr>
<tr><td>Vitamin B1</td><td>Beriberi</td><td>Nerve and muscle weakness</td></tr>
<tr><td>Vitamin C</td><td>Scurvy</td><td>Bleeding gums, slow healing</td></tr>
<tr><td>Vitamin D</td><td>Rickets in children</td><td>Bone deformity, sunlight linked</td></tr>
<tr><td>Iron</td><td>Anaemia</td><td>Fatigue, pallor</td></tr>
<tr><td>Iodine</td><td>Goitre</td><td>Swelling of the thyroid, iodised salt</td></tr>
</table>
<h2>Vector table</h2>
<table>
<tr><th>Vector</th><th>Disease</th><th>Pathogen type</th><th>Breeding or habit</th></tr>
<tr><td>Anopheles</td><td>Malaria</td><td>Protozoan parasite</td><td>Bites mainly at night</td></tr>
<tr><td>Aedes</td><td>Dengue and chikungunya</td><td>Virus</td><td>Clean stored water, daytime biter</td></tr>
<tr><td>Culex</td><td>Filariasis</td><td>Worm</td><td>Dirty stagnant water</td></tr>
<tr><td>Sandfly</td><td>Kala azar</td><td>Protozoan parasite</td><td>Cracked mud walls, damp soil</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>Pressure up, boiling point up. Cooker faster, hill station slower.</li>
<li>Units equal kilowatts multiplied by hours. Watts divided by one thousand first, every time.</li>
<li>Fuse and breaker stop too much current. Earthing carries leakage away. Different accidents, different devices.</li>
<li>Zinc protects iron by corroding first, so a scratch does not defeat galvanising.</li>
<li>Boiling clears temporary hardness only, and it clears pathogens, not dissolved permanent salts.</li>
<li>In oral rehydration the sugar drives sodium and water absorption. It is a mechanism, not a flavour.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>A question naming the causative organism wants the parasite, virus or bacterium, not the mosquito that delivered it.</li>
<li>Antibiotics do nothing against viral illness, which is asked as often in a public health framing as in a biology one.</li>
<li>In the nuclear programme, the plutonium producing stage is the second and the thorium stage is the third. Candidates commonly place thorium in the first because India's reserves are discussed first.</li>
<li>Achievement questions want the organisation and the purpose. If a mission number is all you remember, you have memorised the least examinable part.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question: "Why does food cook faster in a pressure cooker than in an open vessel?",
        options: [
          "The trapped steam conducts heat faster than air does",
          "The higher pressure inside raises the boiling point, so the water is hotter than one hundred degrees",
          "The sealed lid prevents nutrients and heat from escaping with the vapour",
          "The cooker's metal transfers heat to the food more efficiently than a pan",
        ],
        answer: 1,
        explanation:
          "Boiling point rises with pressure, so a sealed cooker holds water above one hundred degrees Celsius and the food cooks at a higher temperature. Preventing heat escaping with the vapour sounds plausible and is the usual wrong answer, but an open pan at a rolling boil is already at the maximum temperature water can reach at that pressure, so the loss is not what limits it.",
        difficulty: "Easy",
        skill: "Applied physics in daily life",
      },
      {
        n: 2,
        question:
          "A geyser rated 1500 watts is used for 2 hours a day for 30 days. How many units of electricity does it consume?",
        options: ["45 units", "90 units", "180 units", "900 units"],
        answer: 1,
        explanation:
          "Convert watts to kilowatts first: 1500 watts is 1.5 kilowatts, and 1.5 multiplied by 2 hours by 30 days gives 90 kilowatt hours, which is 90 units. The answer 900 comes from forgetting to divide the watts by one thousand, which is the single most common slip in this question type.",
        difficulty: "Easy",
        skill: "Domestic electricity and safety",
      },
      {
        n: 3,
        question:
          "Water from a borewell forms scum with soap. Boiling a sample restores normal lathering. What does this indicate?",
        options: [
          "The water had permanent hardness caused by sulphates and chlorides",
          "The water had temporary hardness caused by dissolved bicarbonates",
          "The water was contaminated with bacteria that consumed the soap",
          "The soap was of poor quality and boiling improved its solubility",
        ],
        answer: 1,
        explanation:
          "Temporary hardness comes from bicarbonates of calcium and magnesium, which decompose on boiling and settle out, so lathering returns. Permanent hardness is the tempting answer because both kinds cause scum, but sulphates and chlorides are unaffected by boiling and would need a chemical treatment or an exchange process instead.",
        difficulty: "Medium",
        skill: "Everyday chemistry",
      },
      {
        n: 4,
        question:
          "A health worker advises a household to empty and dry water coolers and stored drums once a week. Which disease is this measure aimed at?",
        options: [
          "Malaria, because the Anopheles mosquito breeds in stored clean water",
          "Dengue, because the Aedes mosquito breeds in clean stored water and bites in the daytime",
          "Filariasis, because the Culex mosquito breeds in household containers",
          "Kala azar, because the sandfly breeds in damp containers",
        ],
        answer: 1,
        explanation:
          "Aedes breeds in clean stagnant water in and around houses, so weekly emptying of coolers, drums and discarded containers breaks its cycle, and it is a daytime biter, which is why bed nets alone do not stop it. Culex is the tempting alternative but it prefers dirty stagnant water in drains, so the container advice is not the control measure aimed at it.",
        difficulty: "Medium",
        skill: "Vector borne diseases",
      },
      {
        n: 5,
        question: "Why does oral rehydration solution contain sugar as well as salt?",
        options: [
          "The sugar provides the energy a dehydrated patient has lost",
          "Glucose and sodium are absorbed together in the intestine and water follows them, so absorption is far faster than with salt alone",
          "The sugar makes the solution palatable so that children will drink it",
          "The sugar neutralises the acid produced during diarrhoea",
        ],
        answer: 1,
        explanation:
          "Glucose and sodium share a transport pathway in the intestinal lining, and water moves with them, which is why a measured salt and sugar solution rehydrates much better than salt water. The energy explanation is the common belief and is close to irrelevant here: the quantity of sugar involved is small, and the point is transport rather than calories.",
        difficulty: "Hard",
        skill: "Nutrition and deficiency diseases",
      },
      {
        n: 6,
        question: "In India's three stage nuclear programme, which stage is built around thorium?",
        options: [
          "The first stage, since India's thorium reserves are large",
          "The second stage, in fast breeder reactors fuelled by plutonium",
          "The third stage, using uranium-233 bred from thorium",
          "Thorium is used at every stage as a moderator",
        ],
        answer: 2,
        explanation:
          "The sequence runs pressurised heavy water reactors on natural uranium, then fast breeder reactors using the plutonium those produce, and only then a thorium based third stage that runs on uranium-233 bred from thorium. Placing thorium in the first stage is the standard error, because discussions of the programme open with India's thorium reserves and candidates attach the resource to the opening stage.",
        difficulty: "Medium",
        skill: "India's science and technology achievements",
      },
      {
        n: 7,
        question:
          "A house has a working fuse but no earthing. Which risk remains substantially unaddressed?",
        options: [
          "An overload on the circuit caused by too many appliances",
          "A short circuit between the live and neutral conductors",
          "A live appliance body giving a shock to anyone who touches it",
          "A voltage fluctuation from the supply side damaging appliances",
        ],
        answer: 2,
        explanation:
          "Earthing gives leakage current from a faulty appliance body a low resistance path to the ground, so without it a metal casing can sit at supply voltage and shock whoever touches it. A fuse is the tempting comfort because it does protect the circuit, but it responds to excessive current in the circuit and may never blow for a small leakage through a person.",
        difficulty: "Medium",
        skill: "Domestic electricity and safety",
      },
    ],
  },

  30206: {
    topicId: 30206,
    title: "Mental ability, data interpretation and basic numeracy",
    summary:
      "This is the only part of the paper where practice converts into marks almost mechanically, because the question types repeat and the methods are fixed. You build percentage sense, the four standard arithmetic families, a reading routine for data sets, and the reasoning patterns the paper actually sets.",
    concepts: [
      "Percentage and percentage change",
      "Ratio, proportion and averages",
      "Time, speed, distance and work",
      "Data interpretation",
      "Number series and pattern recognition",
      "Logical reasoning: relations, directions and syllogism",
    ],
    glossary: {
      "Base value":
        "The quantity a percentage is taken of. Most percentage errors are base errors: the increase is taken on the old value and the decrease that follows is taken on the new one, so the two do not cancel.",
      "Percentage point":
        "The plain difference between two percentages. A literacy rate moving from 40 per cent to 50 per cent has risen by 10 percentage points, which is a rise of 25 per cent, and the paper sets both readings as options.",
      "Weighted average":
        "An average in which each value counts according to the size of the group it represents. Averaging two group averages directly is correct only when the groups are of equal size.",
      "Relative speed":
        "The speed of one moving body as seen from another. Add the speeds when they move towards each other or in opposite directions, subtract when they move in the same direction.",
      "Unit method":
        "Turning a rate problem into whole number units by taking the least common multiple of the times involved, so that work per day becomes an integer and the arithmetic stops needing fractions.",
      Syllogism:
        "A reasoning form in which you decide what must follow from given statements, treating the statements as true even when they are absurd. What is possible is not what follows, and that distinction is the entire question.",
    },
    body: {
      Beginner: `<p>This section is arithmetic and puzzles. There is nothing to memorise beyond a few methods, and unlike current affairs, an hour of practice here reliably makes you better. Start with percentages, because half the section rests on them.</p>
<h2>Percentages are fractions in disguise</h2>
<p>Per cent means out of a hundred. So 25 per cent is 25 out of 100, which is one fourth. Learning a few of these by heart makes mental arithmetic much faster: one half is 50 per cent, one fourth is 25, one fifth is 20, one eighth is 12.5, one tenth is 10.</p>
<p>To find 15 per cent of 800: 10 per cent is 80, half of that is 40, so 15 per cent is 120. Break the percentage into easy pieces rather than multiplying.</p>
<h2>The trap you must see now</h2>
<p>A price of 100 rupees rises by 20 per cent to 120 rupees. It then falls by 20 per cent. Most people say it returns to 100. It does not. The second 20 per cent is taken on 120, so it is 24, and the price ends at 96. A rise and an equal fall do not cancel, because the second percentage is taken on a different base.</p>
<h2>Averages</h2>
<p>An average is the total divided by the number of items. If 30 aspirants score an average of 42 and 10 more score an average of 52, do not average 42 and 52. Add the totals: 30 multiplied by 42 is 1260, and 10 multiplied by 52 is 520. Together that is 1780 for 40 aspirants, which is 44.5.</p>
<h2>Working together</h2>
<p>If one worker finishes a job in 12 days and another in 18, take a number both divide into, such as 36 units of work. The first does 3 units a day, the second 2, so together they do 5. The job takes 36 divided by 5, which is 7.2 days.</p>
<h2>Reading a chart</h2>
<p>A pie chart is a circle of 360 degrees standing for the whole, so a sector of 72 degrees is 72 out of 360, which is one fifth, or 20 per cent. If the whole stands for 4,500 candidates, that sector is 900 candidates.</p>
<h2>How to practise</h2>
<p>Thirty minutes daily, timed, and always with a written record of what you got wrong and why. Speed comes from recognising the type, not from calculating faster, and you only recognise a type after you have met it twenty times.</p>`,
      Intermediate: `<p>Treat this section as five families of question with fixed methods. Learn the method once, then practise until recognition is instant, because in the hall you have about a minute a question including reading.</p>
<h2>Family one: percentage arithmetic</h2>
<p>Successive changes multiply rather than add. An increase of 20 per cent followed by a decrease of 20 per cent gives 1.2 multiplied by 0.8, which is 0.96, a net fall of 4 per cent. Two successive discounts of 20 per cent and 10 per cent give a single equivalent discount of 20 plus 10 minus their product divided by a hundred, that is 28 per cent.</p>
<p>Interest is percentage arithmetic with time attached. As an exercise, take a principal of ₹20,000 for two years at a rate of 10 per cent per annum. Simple interest is 20,000 multiplied by 10 multiplied by 2, divided by 100, which is ₹4,000. Compound interest is 20,000 multiplied by 1.1 twice, which is ₹24,200, so the interest is ₹4,200. The difference of ₹200 is exactly the principal multiplied by the square of the rate over a hundred, and that shortcut answers most two year questions in one step.</p>
<h2>Family two: ratio, proportion and average</h2>
<p>Ratios are best handled by giving the parts a common multiplier. If a sum is divided in the ratio 3 to 5 to 7 and the largest share exceeds the smallest by ₹8,000, then 7x minus 3x is 4x, so x is 2,000 and the total is 15x, that is ₹30,000. For averages, always work with totals, and remember that averaging two averages is valid only when the groups are equal in size.</p>
<h2>Family three: time, speed, distance and work</h2>
<p>Convert once, at the start. A speed in kilometres per hour becomes metres per second by multiplying by five and dividing by eighteen. So 54 kilometres per hour is 15 metres per second. A train 180 metres long crossing a platform 270 metres long covers 450 metres, which at 15 metres per second takes 30 seconds. The commonest error is to use only the platform length and answer 18 seconds.</p>
<p>Work problems use the unit method above. Pipes filling and emptying a tank are the same problem with one negative rate.</p>
<h2>Family four: data interpretation</h2>
<p>Read in a fixed order: the title, the units, the row and column headings, and the footnote, before you read a single number. Half the losses here are unit losses, where a candidate reads a figure in lakhs as a figure in thousands, or misses that one column is a percentage and the rest are absolute values.</p>
<p>Then read the question and take only the cells you need. A four question data set does not require you to understand the whole table, and a candidate who computes every cell first has spent the section's entire time budget on one set.</p>
<h2>Family five: reasoning</h2>
<ul>
<li><strong>Series</strong>: check the first differences. In 3, 6, 11, 18, 27 the differences are 3, 5, 7, 9, so the next difference is 11 and the next term is 38.</li>
<li><strong>Directions</strong>: draw it. Six kilometres north then eight kilometres east leaves you ten kilometres from the start, by the three four five triangle.</li>
<li><strong>Blood relations</strong>: convert to a family tree with symbols before answering, never in your head.</li>
<li><strong>Syllogism</strong>: accept the statements as true, draw the diagrams, and reject any conclusion that is merely possible.</li>
</ul>
<p>Thirty minutes a day, timed, with an error log entry for every mistake classified as method not known, method known but misapplied, or calculation slip. Those three need different fixes.</p>`,
      Advanced: `<p>You already know the methods. What limits your score is the rate at which you convert them, and the number of questions you attempt that you should have abandoned. Both are trainable, and neither improves by solving more questions in an untimed sitting.</p>
<h2>Build a time budget, then defend it</h2>
<table>
<tr><th>Question type</th><th>Target time</th><th>Abandon rule</th></tr>
<tr><td>Percentage or ratio one liner</td><td>Under 40 seconds</td><td>If the numbers are ugly, look for the fraction equivalent before you multiply</td></tr>
<tr><td>Average or mixture</td><td>Under 60 seconds</td><td>Abandon if you cannot write the total in one line</td></tr>
<tr><td>Time, speed or work</td><td>60 to 75 seconds</td><td>Abandon if the unit conversion has not been settled in fifteen seconds</td></tr>
<tr><td>Data set of four questions</td><td>Under 4 minutes for the set</td><td>Answer the two cheap ones, leave the comparison heavy one</td></tr>
<tr><td>Series</td><td>Under 45 seconds</td><td>First differences, then ratios, then squares or cubes. If none fits, leave it</td></tr>
<tr><td>Seating or arrangement puzzle</td><td>3 minutes for the whole set</td><td>If two placements are still ambiguous after the first pass, leave the set</td></tr>
</table>
<p>The abandon rules matter more than the target times. One arrangement puzzle solved in seven minutes costs you five other questions, and it scores the same as any of them.</p>
<h2>Approximation is a skill, not a shortcut</h2>
<p>When the options are far apart, compute to two significant figures and stop. When they are close, compute exactly. Learning to tell the two cases apart at a glance is worth more than any single method, and it is trained by looking at the options before starting the calculation rather than afterwards.</p>
<h2>The traps that cost marks to people who know the method</h2>
<ul>
<li><strong>Percentage point against per cent.</strong> A rate moving from 40 to 50 has risen 10 percentage points and 25 per cent. Both numbers will be options.</li>
<li><strong>Base change.</strong> Increase then decrease by the same percentage always leaves you below the start. The paper prints the unchanged option and it is chosen often.</li>
<li><strong>Average of averages.</strong> Correct only for equal groups. The question is set with unequal groups precisely to catch it.</li>
<li><strong>Relative speed direction.</strong> Add for opposite directions, subtract for the same. A train question with an overtaking clause is a subtraction problem dressed as an addition one.</li>
<li><strong>The train's own length.</strong> Included for a platform or another train, excluded for a pole.</li>
<li><strong>Possible against follows.</strong> In syllogism the conclusion must hold in every arrangement consistent with the statements, not in the one you drew first.</li>
</ul>
<h2>Where the marginal marks are</h2>
<p>For a candidate from a humanities background this section is usually the largest single pool of recoverable marks in the whole examination, because the loss is procedural rather than informational. Move the daily allocation from thirty minutes to sixty for eight weeks, track accuracy weekly rather than volume, and stop counting how many questions you did. Accuracy under time is the only number that predicts the paper.</p>
<p>For a candidate from an engineering background the risk is the opposite: comfort leads to solving the hard question elegantly while the cheap ones remain unattempted. Your discipline is the abandon rule, not the method.</p>`,
      Expert: `<p>Final month. Maintain the skill daily at reduced volume, and revise from one sheet.</p>
<h2>Fraction and percentage sheet</h2>
<table>
<tr><th>Fraction</th><th>Per cent</th><th>Fraction</th><th>Per cent</th></tr>
<tr><td>1/2</td><td>50</td><td>1/8</td><td>12.5</td></tr>
<tr><td>1/3</td><td>33.33</td><td>1/9</td><td>11.11</td></tr>
<tr><td>1/4</td><td>25</td><td>1/11</td><td>9.09</td></tr>
<tr><td>1/5</td><td>20</td><td>1/12</td><td>8.33</td></tr>
<tr><td>1/6</td><td>16.67</td><td>1/16</td><td>6.25</td></tr>
<tr><td>1/7</td><td>14.28</td><td>1/20</td><td>5</td></tr>
</table>
<h2>Conversions and one line formulas</h2>
<ul>
<li>Kilometres per hour to metres per second: multiply by 5, divide by 18. The reverse: multiply by 18, divide by 5.</li>
<li>Two successive changes of a and b per cent: net equals a plus b plus ab divided by 100, with signs carried.</li>
<li>Difference between compound and simple interest over two years: principal multiplied by the square of the rate divided by a hundred.</li>
<li>Work together: take the least common multiple of the individual times as total units, add the per day rates.</li>
<li>Pie chart: one per cent is 3.6 degrees, so a sector in degrees divided by 3.6 gives the percentage.</li>
<li>Train crossing a pole uses its own length; crossing a platform uses length plus platform.</li>
</ul>
<h2>Order of attack inside the section</h2>
<ol>
<li>Series and simple arithmetic first. Cheapest marks, lowest variance.</li>
<li>The data set with the cleanest units next, two questions from it, then move.</li>
<li>Directions, blood relations and coding third, all of them drawn on paper.</li>
<li>Arrangement puzzles last, and only if the clock allows a full three minutes.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A negative rate in a work problem, such as a leak, is added as a negative number of units, not subtracted from the time.</li>
<li>A question asking for the change in a ratio wants the ratio recomputed, not the difference of the two ratios.</li>
<li>In a table with a total row, check whether the total is the sum of the rows or an independently reported figure. When it is not the sum, every share you compute from it is wrong.</li>
<li>In syllogism, an either or conclusion is valid only when the two conclusions are complementary and neither follows on its own.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "The price of a commodity rises by 20 per cent and then falls by 20 per cent. Compared with the original price, the final price is:",
        options: [
          "4 per cent lower",
          "Unchanged",
          "4 per cent higher",
          "2 per cent lower",
        ],
        answer: 0,
        explanation:
          "Multiply rather than add the changes: 1.2 multiplied by 0.8 is 0.96, so the price ends 4 per cent below where it started. The unchanged option is the natural guess and it is wrong because the fall of 20 per cent is taken on the raised price of 120, not on the original 100, so it removes 24 rather than 20.",
        difficulty: "Easy",
        skill: "Percentage and percentage change",
      },
      {
        n: 2,
        question:
          "A can finish a task in 12 days and B in 18 days. Working together, they finish it in:",
        options: ["6 days", "7.2 days", "7.5 days", "15 days"],
        answer: 1,
        explanation:
          "Take 36 units of work, the least common multiple of 12 and 18: A does 3 units a day, B does 2, so together 5 units a day and the task takes 36 divided by 5, that is 7.2 days. The answer 15 comes from averaging 12 and 18, which is never valid for rates, since two workers together must finish faster than the quicker of them alone.",
        difficulty: "Easy",
        skill: "Time, speed, distance and work",
      },
      {
        n: 3,
        question:
          "Thirty aspirants score an average of 42 marks. Ten more aspirants score an average of 52. What is the average of all forty?",
        options: ["44.5", "45", "46", "47"],
        answer: 0,
        explanation:
          "Work with totals: 30 multiplied by 42 is 1260 and 10 multiplied by 52 is 520, giving 1780 over 40 aspirants, that is 44.5. The answer 47 is the average of 42 and 52, which would be correct only if the two groups were the same size, and here the larger group pulls the combined average towards its own value.",
        difficulty: "Easy",
        skill: "Ratio, proportion and averages",
      },
      {
        n: 4,
        question:
          "A train 180 metres long, running at 54 kilometres per hour, crosses a platform 270 metres long. How long does it take?",
        options: ["12 seconds", "18 seconds", "30 seconds", "45 seconds"],
        answer: 2,
        explanation:
          "Convert first: 54 kilometres per hour multiplied by 5 over 18 is 15 metres per second, and the train must cover its own length plus the platform, that is 450 metres, which takes 30 seconds. The answer 18 seconds comes from using only the platform length, which is the standard error: the train has cleared the platform only when its last coach has left it.",
        difficulty: "Medium",
        skill: "Time, speed, distance and work",
      },
      {
        n: 5,
        question:
          "In a pie chart of 4,500 candidates by district, one district's sector measures 72 degrees. How many candidates does it represent?",
        options: ["720", "900", "1,125", "1,440"],
        answer: 1,
        explanation:
          "A circle is 360 degrees, so 72 degrees is one fifth of the whole, and one fifth of 4,500 is 900. The answer 720 treats the degree measure as if it were already a count of candidates, which is the most common slip when a pie chart carries a large total.",
        difficulty: "Easy",
        skill: "Data interpretation",
      },
      {
        n: 6,
        question: "Find the next term: 3, 6, 11, 18, 27, ?",
        options: ["36", "38", "39", "40"],
        answer: 1,
        explanation:
          "The first differences are 3, 5, 7 and 9, so they rise by 2 each time and the next difference is 11, giving 27 plus 11, that is 38. The answer 36 comes from repeating the last difference of 9 instead of continuing the pattern of the differences, which is exactly what the question is testing.",
        difficulty: "Medium",
        skill: "Number series and pattern recognition",
      },
      {
        n: 7,
        question:
          "A district's literacy rate rises from 40 per cent to 50 per cent. Which statement is correct?",
        options: [
          "Literacy has risen by 10 per cent",
          "Literacy has risen by 10 percentage points, which is a rise of 25 per cent",
          "Literacy has risen by 20 per cent",
          "Literacy has risen by 25 percentage points",
        ],
        answer: 1,
        explanation:
          "The plain difference between two percentages is measured in percentage points, so the rise is 10 percentage points, and expressed as a proportion of the original 40 it is 10 over 40, that is 25 per cent. Calling it a rise of 10 per cent is the tempting shorthand and it is wrong, because a per cent rise must be taken on the base value of 40 rather than read off the difference.",
        difficulty: "Hard",
        skill: "Data interpretation",
      },
      {
        n: 8,
        question:
          "A person walks 6 kilometres north, then 8 kilometres east. How far is she from her starting point?",
        options: ["10 kilometres", "14 kilometres", "2 kilometres", "12 kilometres"],
        answer: 0,
        explanation:
          "The two legs are at right angles, so the distance is the hypotenuse of a 6 and 8 triangle, which is 10 kilometres. The answer 14 adds the two legs, which gives the distance walked rather than the distance from the start, and the question asks how far she is, not how far she went.",
        difficulty: "Easy",
        skill: "Logical reasoning: relations, directions and syllogism",
      },
    ],
  },
};

export default PART;
