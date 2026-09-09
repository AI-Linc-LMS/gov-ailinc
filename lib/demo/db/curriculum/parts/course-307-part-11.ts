/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 11.
 *
 * Topics 30723, 30724 and 30725: the two halves of the descriptive paper in
 * officer mains, the letter and the essay, and then the full length preliminary
 * mock sat under sectional timing and read afterwards as an instrument rather
 * than as a score.
 *
 * The structure of the descriptive paper and the penalty rule are stated as
 * they are set, because they are stable across cycles. No vacancy count, fee,
 * cut-off mark or examination date appears here as current fact: the
 * notification for the cycle you are sitting is the authority. Every word
 * budget, timing split and net score in this file has been worked out, because
 * the candidate reading it will check the arithmetic.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30723: {
    topicId: 30723,
    title: "Letter writing: formal, informal and the marking scheme",
    summary:
      "The descriptive paper puts a letter in front of you with a situation and a word limit, and it is read by a human evaluator who is looking for layout, purpose and clean sentences rather than for fine writing. Learn one formal skeleton and one informal skeleton well enough to produce either from memory, so that the minutes you are given go into what the letter says instead of into how it should be laid out.",
    concepts: [
      "Formal letter structure",
      "Informal letter register",
      "Subject line and salutation",
      "Purpose, detail and action paragraphs",
      "Word limit discipline",
      "Descriptive marking criteria",
    ],
    glossary: {
      "Descriptive paper":
        "The typed English paper in officer mains, one letter and one essay carrying 25 marks between them in 30 minutes, evaluated by a person and not by the machine that scores the objective sections.",
      Register:
        "The level of formality a piece of writing holds, shown through the greeting, the sentence length and the choice of words. A letter to a branch manager and a letter to your cousin can carry the same information and still fail if the register is swapped.",
      "Subject line":
        "A single line placed above the body that names the matter in hand, so that the reader knows the purpose before reading a sentence of it. It appears in a formal letter and never in an informal one.",
      "Action paragraph":
        "The paragraph that states what you want the reader to do and by when, converting a description of a problem into a request that can be acted upon.",
      "Word limit":
        "The length printed in the question. Writing far below it leaves content marks unclaimed, and writing far beyond it costs you minutes that the essay was going to need.",
      "Evaluation criteria":
        "The heads a human evaluator reads for: whether the format is correct, whether the content answers the situation given, whether the writing is organised, and whether the grammar and spelling hold up.",
    },
    body: {
      Beginner: `<p>Officer mains ends with a short typed paper. Two questions, thirty minutes, on the same computer you used for the objective sections. One question asks for a letter and the other for an essay. This lesson is about the letter.</p>
<h2>Who reads it</h2>
<p>A person reads it, not a machine. That person is checking four plain things: is the layout right, did you answer the situation you were given, is the writing organised, and is the language clean. None of that requires difficult English. It requires a shape you can produce without stopping to think.</p>
<h2>Two kinds of letter</h2>
<p>A <strong>formal</strong> letter goes to someone in an official role: a branch manager, the editor of a newspaper, a municipal officer, the head of a department. You do not know the person, and you are writing to the office rather than to the individual.</p>
<p>An <strong>informal</strong> letter goes to someone you know: a younger brother, a cousin, a friend from your batch. The subject line disappears, the greeting becomes a name, and the sentences become shorter and warmer.</p>
<h2>The parts of a formal letter</h2>
<ol>
<li><strong>Salutation.</strong> The greeting line. Sir or Madam, on its own line.</li>
<li><strong>Subject line.</strong> One line naming the matter, so the reader knows the purpose before the first sentence.</li>
<li><strong>Opening paragraph.</strong> Who you are and why you are writing.</li>
<li><strong>Detail paragraph.</strong> What happened, in order, with the dates and amounts that matter.</li>
<li><strong>Action paragraph.</strong> What you want done, and by when.</li>
<li><strong>Sign off.</strong> Yours faithfully, then a neutral name.</li>
</ol>
<h2>How long</h2>
<p>Write to the limit printed in the question, which is commonly about 150 words. Four short paragraphs of roughly 35 words each land you there without counting. If you plan to write 400 words, the essay will be left half finished, and the essay carries marks too.</p>
<h2>Do not put your own name on it</h2>
<p>The instructions on the paper ask you not to reveal your identity. So the letter is signed with a neutral placeholder such as A B C, and any name inside the letter is a made up one. This is a rule, not a style choice, and ignoring it puts the whole paper at risk.</p>
<h2>What to practise first</h2>
<p>Write the six part skeleton out five times from memory, on paper, until you can produce it without looking. The content of any particular letter changes. The skeleton never does, and it is the part you cannot afford to be inventing while a clock runs.</p>`,
      Intermediate: `<p>The letter is the most predictable scoring on the whole examination. The situation changes every cycle, the shape does not, and a shape you have rehearsed costs you no thinking time at all. Build one formal skeleton and one informal skeleton, then spend your preparation on filling them quickly.</p>
<h2>The formal skeleton</h2>
<table>
<thead><tr><th>Part</th><th>Words</th><th>What goes in it</th></tr></thead>
<tbody>
<tr><td>Salutation</td><td>2</td><td>Sir or Madam. Never a first name, never a greeting.</td></tr>
<tr><td>Subject</td><td>8 to 12</td><td>A noun phrase naming the matter, not a sentence.</td></tr>
<tr><td>Opening</td><td>30</td><td>Who you are, your relationship to the office, and the one line purpose.</td></tr>
<tr><td>Detail</td><td>55 to 60</td><td>The facts in order: what happened, when, the amount or reference, what you have already done about it.</td></tr>
<tr><td>Action</td><td>35</td><td>The specific thing you want done, and a reasonable time frame.</td></tr>
<tr><td>Close</td><td>10</td><td>A courteous line, Yours faithfully, and a neutral sign off.</td></tr>
</tbody>
</table>
<p>Those parts add to roughly 140 to 150 words, which is the band a formal letter question usually prints. You do not count words in the hall. You count paragraphs, and you keep each of them to three or four sentences.</p>
<h2>A worked letter</h2>
<p>Situation: your account was debited for a cash withdrawal at an automated teller machine but the cash was not dispensed. Write to the branch manager.</p>
<p><strong>Subject:</strong> Reversal of an amount debited without cash being dispensed</p>
<p><strong>Opening.</strong> I hold a savings account at your branch and I am writing about a withdrawal on the fourth of this month at your machine on the main road, where my account was debited but no cash was dispensed.</p>
<p><strong>Detail.</strong> The screen displayed an error after the card was accepted and the transaction slip was not printed. A message confirming a debit of ₹5,000 reached my registered mobile number the same evening. I reported the matter at the branch counter on the following working day and was told the claim would be raised, but the amount has not been credited back to the account.</p>
<p><strong>Action.</strong> I request you to have the transaction traced and the amount credited to my account, and to inform me in writing of the outcome and of the compensation payable if the reversal is delayed beyond the period allowed under your customer grievance policy.</p>
<p><strong>Close.</strong> Thank you for your assistance in this matter. Yours faithfully, A B C.</p>
<h2>The informal letter</h2>
<p>Everything hard about the formal letter comes off. There is no subject line. The salutation is Dear followed by the relationship or a made up name. The opening asks after the reader before it gets to the point. The body is two paragraphs of ordinary speech, and the close is Yours affectionately or With love, then the placeholder.</p>
<p>The register carries the marks here. Contractions are acceptable, short sentences are acceptable, and a direct question to the reader is acceptable. What is not acceptable is a formal sentence such as the one you have just read appearing in a letter to your cousin.</p>
<h2>How the evaluator marks it</h2>
<ul>
<li><strong>Format.</strong> Salutation, subject where required, paragraphing, sign off. This is the cheapest mark on the paper and it is lost by candidates who write one long block of text.</li>
<li><strong>Content.</strong> Did you answer the situation actually given, with its specific details, rather than a similar situation you had practised.</li>
<li><strong>Organisation.</strong> One idea per paragraph, in an order the reader can follow.</li>
<li><strong>Language.</strong> Grammar, spelling and punctuation. There is no spell checker on the terminal.</li>
</ul>
<h2>Where the minutes go</h2>
<p>Of the thirty minutes, give the letter about eleven and a half: two and a half to read the question and fix the four paragraphs in your head, nine to type. Nine minutes for 150 words is about 17 words a minute including thinking, which is a comfortable rate on a keyboard you have practised on.</p>`,
      Advanced: `<p>You know the format. What separates a letter that scores well from one that merely passes is whether it reads as a reply to the situation printed on the screen, and whether the evaluator can find the purpose in the first ten seconds. Both are decisions taken before you type, and both are where a rehearsed candidate quietly loses marks.</p>
<h2>The template trap</h2>
<p>A memorised letter has one visible symptom: it answers a general version of the question. The situation says the passbook was not updated for six months and the letter complains about poor service at the branch. The evaluator has read forty of these and recognises the pattern immediately. Take the two or three specific details the question hands you, the period, the amount, the reference, the place, and place them in the detail paragraph. That is the difference between content marks earned and content marks assumed.</p>
<h2>Matching the letter type to what it must contain</h2>
<table>
<thead><tr><th>Type</th><th>Situation it answers</th><th>The paragraph that must not be missing</th></tr></thead>
<tbody>
<tr><td>Complaint</td><td>A service failed and you want it repaired</td><td>The action paragraph, with a specific remedy and a time frame</td></tr>
<tr><td>Request or application</td><td>You want something granted: leave, a facility, a correction</td><td>The ground on which you are asking, stated as a reason and not as a demand</td></tr>
<tr><td>Enquiry</td><td>You need information before deciding</td><td>A numbered or clearly separated list of exactly what you want to know</td></tr>
<tr><td>Suggestion to an authority</td><td>You are proposing an improvement</td><td>The benefit to the reader's users, not to you</td></tr>
<tr><td>To an editor</td><td>You are raising a matter of public concern</td><td>Why it belongs in a public forum rather than in a private complaint</td></tr>
<tr><td>Informal advice or news</td><td>You are writing to a person you know</td><td>The opening enquiry after the reader, which is what makes it informal at all</td></tr>
</tbody>
</table>
<h2>Register failures, in the order they cost marks</h2>
<ul>
<li><strong>A subject line in an informal letter.</strong> It marks the letter as a formal one wearing a first name, and format marks go immediately.</li>
<li><strong>Yours faithfully to a cousin.</strong> Faithfully belongs with Sir or Madam. Sincerely belongs with a named person you address formally. Affectionately belongs with family.</li>
<li><strong>Anger in a complaint.</strong> A complaint that accuses loses more than it gains. State the failure, state the effect, state the remedy. The strongest complaint on this paper is a calm one.</li>
<li><strong>Over length.</strong> A letter of 300 words does not earn double. It earns the same content marks and takes seven minutes that the essay needed.</li>
</ul>
<h2>Typing, not writing</h2>
<p>This is typed on the terminal with no spell checker and no comfortable way to move text about. So practise on a keyboard rather than on paper for the last month, and fix the paragraph order before you begin, since reorganising typed paragraphs under a clock is slower than it looks.</p>
<h2>Marginal marks, and where they actually are</h2>
<p>The descriptive paper carries 25 of the 225 marks in mains, which is close to 9 of the 80 merit marks the mains contributes. Between two candidates three merit marks apart, the letter and the essay are the whole gap. Yet the standard error is to leave both unpractised until the final week, on the reasoning that everyone writes English anyway. Everyone does. Not everyone produces a correctly laid out letter, answering the given situation, inside eleven minutes, on an unfamiliar keyboard.</p>
<h2>Two situations that need care</h2>
<ul>
<li><strong>The question that names a role rather than a person.</strong> Write to the role, and keep it consistent: if you open with Sir, the whole letter stays in the third person about the office and does not slide into you and I halfway through.</li>
<li><strong>The clerical paper.</strong> There is no descriptive paper in the clerical mains, so a candidate preparing only for that post spends these hours on the objective sections instead. A candidate preparing for both writes the letters, because the officer paper needs them.</li>
</ul>`,
      Expert: `<p>Recall card. Everything below should be reproducible in the last week without opening a book.</p>
<h2>The skeleton, six lines</h2>
<ol>
<li>Salutation: Sir or Madam, formal. Dear plus name or relationship, informal.</li>
<li>Subject: formal only, a noun phrase, eight to twelve words.</li>
<li>Opening, about 30 words: identity, connection to the office, purpose in one line.</li>
<li>Detail, about 55 words: facts in order, with the specifics the question gave you.</li>
<li>Action, about 35 words: the remedy asked for and a time frame.</li>
<li>Close, about 10 words: courtesy line, sign off, neutral placeholder.</li>
</ol>
<h2>Sign off pairing</h2>
<table>
<thead><tr><th>Salutation</th><th>Sign off</th><th>Used for</th></tr></thead>
<tbody>
<tr><td>Sir or Madam</td><td>Yours faithfully</td><td>An office whose holder you do not name</td></tr>
<tr><td>Dear Mr or Ms plus surname</td><td>Yours sincerely</td><td>A named person addressed formally</td></tr>
<tr><td>Dear plus first name or relationship</td><td>Yours affectionately, With love</td><td>Family and friends</td></tr>
</tbody>
</table>
<h2>Opening lines you can adapt in seconds</h2>
<ul>
<li>Complaint: I hold an account at your branch and I am writing about a transaction that has not been resolved.</li>
<li>Request: I am writing to request permission for the following, and I set out the reason below.</li>
<li>Informal: I hope this letter finds everyone at home well, and that your examinations went as you had planned.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li><strong>Four paragraphs, not five.</strong> Purpose, detail, action, close. Anything else you wanted to say belongs in the detail paragraph.</li>
<li><strong>Specifics from the question go in paragraph two.</strong> That is where content marks are found.</li>
<li><strong>No identity.</strong> Placeholder name, made up references, no centre or roll number anywhere.</li>
<li><strong>Eleven and a half minutes.</strong> Two and a half to plan, nine to type, then leave it and go to the essay.</li>
<li><strong>Calm beats forceful.</strong> A complaint that states the remedy scores above one that states an accusation.</li>
</ul>
<h2>Final read, ninety seconds</h2>
<ol>
<li>Is the salutation paired correctly with the sign off.</li>
<li>Is there a subject line if formal, and none if informal.</li>
<li>Does paragraph two carry the details the question gave you.</li>
<li>Does the last paragraph ask for something specific.</li>
<li>Any place where your own name, city or institution slipped in.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A question that supplies no details at all expects you to invent plausible ones. Invent them, keep them modest, and keep them consistent through the letter.</li>
<li>If the printed limit differs from 150 words, the paragraph proportions hold and only the sentence count changes.</li>
</ul>`,
    },
  },
  30724: {
    topicId: 30724,
    title: "Essay writing in 200 words under time",
    summary:
      "Two hundred words is not a short version of a long essay, it is a different task: four paragraphs, one idea in each, with a position stated early enough that the evaluator never has to hunt for it. This topic gives you the word budget, the two minute plan that fits any prompt, and a way of supporting an argument without quoting a figure you cannot verify.",
    concepts: [
      "Four paragraph essay structure",
      "Thesis sentence",
      "Topic sentence and paragraph unity",
      "Balanced view and counterpoint",
      "Word budget under the clock",
      "Evidence without invented figures",
    ],
    glossary: {
      "Thesis sentence":
        "The single sentence, usually the last of the opening paragraph, that states the position the rest of the essay will defend, so that a reader knows by line four where the piece is going.",
      "Topic sentence":
        "The sentence that opens a paragraph and announces the one idea it carries. Everything else in that paragraph exists to support it, and anything that does not belongs in a different paragraph.",
      Counterpoint:
        "The strongest honest objection to your own position, stated in your words and then answered, which is what separates a considered essay from a one sided one.",
      "Word budget":
        "The allocation of the printed limit across the paragraphs before you type a word, so that length is controlled by design rather than discovered when the time runs out.",
      "Hedged claim":
        "A statement written with a qualifier so that it stays true without resting on a number you cannot verify, such as saying adoption has risen sharply instead of naming a percentage.",
      "Abstract prompt":
        "An essay topic with no factual base, such as a proverb or a value, which has to be developed through reasoning and illustration rather than through data.",
    },
    body: {
      Beginner: `<p>The second half of the descriptive paper is an essay. You are given a topic and a word limit, commonly around 200 words, and you type it on the same terminal. Two hundred words is about four short paragraphs. It is roughly one page of ordinary handwriting, so this is a small piece of writing and it has to be planned like one.</p>
<h2>What the evaluator is looking for</h2>
<p>The same person who read your letter reads this. They want to know within the first four lines what you think about the topic, then to see two reasons that support it, then a short ending that decides something. What they do not want is four paragraphs that circle the topic without ever taking a position.</p>
<h2>The four paragraphs</h2>
<ol>
<li><strong>Opening.</strong> One or two sentences that set the topic up, then one sentence saying what you think. That last sentence is the most important one in the essay.</li>
<li><strong>First reason.</strong> The strongest argument for your view, with one everyday example.</li>
<li><strong>The other side, or a limit.</strong> The best objection to your view, stated honestly, and then your answer to it.</li>
<li><strong>Ending.</strong> What follows from all of that. Not a summary of what you just wrote, but a decision.</li>
</ol>
<h2>You do not need figures</h2>
<p>A common worry is that an essay needs statistics. It does not, and inventing them is worse than leaving them out, because a wrong number that a reader recognises damages everything around it. Write that account opening has spread widely in villages. Do not write a percentage you are not sure of.</p>
<h2>Write in prose</h2>
<p>An essay is written in full sentences and joined paragraphs. Bullet points belong in a report. If the question does not ask for points, do not give points.</p>
<h2>Plan before you type</h2>
<p>Spend two or three minutes deciding your position and your two paragraph ideas. Candidates who begin typing straight away usually discover in paragraph three that they have nothing left to say, and the last fifty words become a repeat of the first fifty.</p>`,
      Intermediate: `<p>Treat the essay as a small piece of engineering. You have a fixed length, a fixed time and four slots to fill, and the only decision that really matters is taken in the first two minutes: what position you are going to hold. Everything after that is filling the slots at a steady rate.</p>
<h2>The word budget</h2>
<table>
<thead><tr><th>Paragraph</th><th>Words</th><th>Job</th></tr></thead>
<tbody>
<tr><td>Opening</td><td>35</td><td>Two sentences of context, then the thesis sentence</td></tr>
<tr><td>First argument</td><td>55</td><td>Topic sentence, the reasoning, one concrete illustration</td></tr>
<tr><td>Counterpoint or limitation</td><td>60</td><td>The best objection stated fairly, then your answer to it</td></tr>
<tr><td>Conclusion</td><td>40</td><td>What follows, and what should be done or watched</td></tr>
<tr><td><strong>Total</strong></td><td><strong>190</strong></td><td>Comfortably inside a 200 word limit</td></tr>
</tbody>
</table>
<p>You never count words in the hall. You count sentences: roughly two, three, three and two. At an average of eighteen to twenty words a sentence, ten sentences land you in the band.</p>
<h2>The two minute plan</h2>
<ol>
<li>Read the topic twice and decide whether it wants a position, a discussion, or a description. A topic phrased as a question wants a position.</li>
<li>Write your thesis sentence in your head, in full. If you cannot say it in one sentence, you have not chosen a position yet.</li>
<li>Choose two angles from the grid: economic, social, institutional, technological. Two angles are enough for 200 words. Three will crowd it.</li>
<li>Decide your ending before you start typing, so the essay is aimed at something.</li>
</ol>
<h2>A worked essay</h2>
<p><strong>Topic:</strong> Financial literacy matters more than access to banking.</p>
<p><strong>Opening.</strong> Opening an account is now straightforward in most parts of the country, and a large number of households hold one. Using that account well is a different skill, and it is where the gap has moved. Access without understanding produces dormant accounts rather than financial security.</p>
<p><strong>First argument.</strong> Literacy decides whether a household benefits from what it already has. A member who can compare a recurring deposit with a gold loan, or who reads the instalment schedule before signing, keeps money that would otherwise go in avoidable interest. The account is only the door, and the choices made after it are what change the balance.</p>
<p><strong>Counterpoint.</strong> Access is not therefore unimportant. Without a nearby branch, a business correspondent or a working payment application, literacy has nothing to act upon, and the first correspondent networks were built precisely because distance was the binding problem. The honest position is a sequence rather than a contest: access came first, and literacy is what converts it into use.</p>
<p><strong>Conclusion.</strong> Banks and the mission agencies now have the reach they lacked. The next return will come from teaching customers to read a statement, recognise a fraudulent call and choose a deposit, which costs far less than opening another branch.</p>
<h2>How this is marked</h2>
<ul>
<li><strong>Content.</strong> Whether the essay says something specific about this topic rather than something general about any topic.</li>
<li><strong>Organisation.</strong> Whether each paragraph carries one idea and the paragraphs follow in an order that makes sense.</li>
<li><strong>Language.</strong> Sentence construction, tense agreement, spelling. There is no spell checker.</li>
<li><strong>Relevance and length.</strong> Whether you answered the topic given and stayed near the limit printed.</li>
</ul>
<h2>The clock</h2>
<p>Of the thirty minutes, the essay gets about fifteen: three to plan, twelve to type, and the last three and a half minutes of the paper are spent reading both pieces back. Twelve minutes for 190 words is about sixteen words a minute including thinking, which is a rate you should confirm on a keyboard before the day.</p>`,
      Advanced: `<p>At 200 words the failure modes are not grammatical. They are structural, and they are visible to an evaluator within the first two sentences. What follows is the small number of decisions that separate a mark in the upper band from a competent, forgettable page.</p>
<h2>Three prompt types, three different openings</h2>
<table>
<thead><tr><th>Prompt type</th><th>Example shape</th><th>What the opening must do</th></tr></thead>
<tbody>
<tr><td>Argumentative</td><td>Should cash transactions be discouraged</td><td>Take a side in the thesis sentence. A balanced essay still has a position.</td></tr>
<tr><td>Discussion of an issue</td><td>Digital lending and the small borrower</td><td>Name the tension in the issue, then say which side of it you weight.</td></tr>
<tr><td>Abstract or proverbial</td><td>Patience is a form of capital</td><td>Interpret the phrase in one sentence, then commit to that reading for the rest of the essay.</td></tr>
</tbody>
</table>
<p>The abstract prompt is where prepared candidates lose most. There is no data to reach for, so the essay drifts into a set of pleasant generalities. The fix is to convert the abstraction into a concrete field in the first paragraph, banking, work, study, family finance, and to stay inside that field throughout.</p>
<h2>The angle grid, for when the topic is unfamiliar</h2>
<p>Any topic on this paper can be entered from four angles: economic, social, institutional and technological. You need two. If the topic is unfamiliar, pick the two angles you can say something specific about and let the other two go. An essay that says two solid things is scored above one that gestures at five.</p>
<h2>Traps, in the order they cost marks</h2>
<ul>
<li><strong>The opening that restates the prompt.</strong> Writing that financial literacy is a very important topic in the modern world consumes twenty of your 200 words and says nothing. Begin with a fact about the situation, then take your position.</li>
<li><strong>No thesis at all.</strong> Four paragraphs that describe the topic from different sides, ending in on the whole it is a mixed picture. The evaluator cannot award a position that was never taken.</li>
<li><strong>Invented numbers.</strong> A precise figure you cannot support is the single fastest way to lose an evaluator's trust, and a hedged claim carries the same argumentative weight without the risk.</li>
<li><strong>The one sided essay.</strong> Omitting the counterpoint saves fifty words and costs the mark that the counterpoint paragraph exists to earn.</li>
<li><strong>Overrunning.</strong> Three hundred words is not more content, it is the same content plus five minutes taken from your final read.</li>
<li><strong>Points instead of prose.</strong> Unless the question asks for points, bullets in an essay read as an unwillingness to construct sentences.</li>
<li><strong>The memorised essay bent to fit.</strong> A prepared piece on financial inclusion pressed onto a prompt about work from home is obvious from the second paragraph.</li>
</ul>
<h2>Sentences that do work in a small essay</h2>
<ul>
<li><strong>The concession turned.</strong> Access is not therefore unimportant, but it is the first step and not the last. This one sentence performs the whole balancing job in a paragraph you cannot afford to make longer.</li>
<li><strong>The mechanism sentence.</strong> Say how a thing produces its effect rather than that it is beneficial. A statement is describing something; an argument explains why.</li>
<li><strong>The forward looking close.</strong> End with what should be done or watched. A conclusion that only repeats the introduction wastes the last forty words.</li>
</ul>
<h2>Where the marginal marks sit</h2>
<p>The letter and the essay carry 25 marks between them, close to 9 of the 80 merit marks that mains contributes. The essay is also the one item on this paper that improves fastest with practice: six essays written to time, each read back once with the traps above in hand, will move most candidates a clear band. It is a small, cheap investment that competes directly with an hour of additional data interpretation practice, and unlike that hour it has a ceiling you can actually reach.</p>`,
      Expert: `<p>Compression card for the final fortnight. Two pages of method reduced to what you can hold while walking into the centre.</p>
<h2>Shape, in ten sentences</h2>
<table>
<thead><tr><th>Paragraph</th><th>Sentences</th><th>Contains</th></tr></thead>
<tbody>
<tr><td>Opening</td><td>2</td><td>One situating sentence, then the thesis</td></tr>
<tr><td>Argument</td><td>3</td><td>Topic sentence, mechanism, illustration</td></tr>
<tr><td>Counterpoint</td><td>3</td><td>Objection, concession, turn</td></tr>
<tr><td>Conclusion</td><td>2</td><td>What follows, what to do or watch</td></tr>
</tbody>
</table>
<h2>Angle grid</h2>
<ul>
<li><strong>Economic:</strong> cost, income, credit, price, employment.</li>
<li><strong>Social:</strong> household, women, migration, education, trust.</li>
<li><strong>Institutional:</strong> regulator, scheme design, delivery, grievance redress.</li>
<li><strong>Technological:</strong> access device, payment rail, data, exclusion of the offline.</li>
</ul>
<p>Pick two. Two angles at depth beat four at the surface, every time, at this length.</p>
<h2>Two line rules</h2>
<ul>
<li><strong>Position by line four.</strong> If the thesis is not on the screen in the first two sentences, rewrite them.</li>
<li><strong>One idea per paragraph.</strong> A second idea means a second paragraph, and at 200 words you do not have one, so drop it.</li>
<li><strong>Hedge instead of inventing.</strong> Widely, sharply, in recent years. Never a figure you cannot defend.</li>
<li><strong>Concede once, then turn.</strong> The counterpoint paragraph is a mark, not a weakness.</li>
<li><strong>Fifteen minutes.</strong> Three to plan, twelve to type, and stop typing when the plan is finished rather than when the words run out.</li>
</ul>
<h2>Final read, ninety seconds</h2>
<ol>
<li>Underline the thesis sentence in your head. If you cannot find it, the essay has no position.</li>
<li>Check each paragraph opens with its own idea and does not continue the previous one.</li>
<li>Remove any number you are not certain of and replace it with a hedged claim.</li>
<li>Check the tense stays consistent and the subject agrees with the verb in the long sentences.</li>
<li>Confirm no personal identifier has entered the text.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A prompt that asks for your view expects the first person to be avoided while the view is still clearly held. Write it as a judgement about the matter, not as a report of your feelings.</li>
<li>A prompt with two parts, causes and remedies for instance, converts the middle two paragraphs into one for each part, and the counterpoint moves into the conclusion.</li>
<li>If the printed limit is longer than 200 words, add sentences to the two middle paragraphs and leave the opening and the close as they are.</li>
<li>Clerical mains carries no descriptive paper, so this practice belongs to the officer track and to any candidate writing both.</li>
</ul>`,
    },
  },
  30725: {
    topicId: 30725,
    title: "Full length prelims mock with sectional timing",
    summary:
      "A full paper sat under the sectional clock is a measuring instrument, and like any instrument it gives a false reading when the conditions are eased. This topic sets out how to sit one so the number means something, how to rebuild the net score section by section afterwards, and how to separate the marks you lost to the syllabus from the marks you lost to the clock.",
    concepts: [
      "Simulation fidelity",
      "Net score reconstruction",
      "Timestamp log",
      "Untimed re-solve",
      "Selection error audit",
      "Readiness margin",
    ],
    glossary: {
      "Simulation fidelity":
        "How closely a practice sitting reproduces the conditions of the real paper: one unbroken hour, the platform's own section order, the hour of day your slot falls in, no pausing and nothing to look things up in. Every condition you ease raises the score and lowers what it tells you.",
      "Net score":
        "Correct answers minus one quarter of a mark for each wrong answer, with unanswered questions costing nothing. It is the only score worth recording, because a raw count of correct answers hides how much guessing produced it.",
      "Timing report":
        "The record the platform keeps of how long you spent on each question and each section. It is evidence about your behaviour in the hall, which memory is not, and it is where a broken leave discipline becomes visible.",
      "Untimed re-solve":
        "A second pass over the same paper without a clock and before the answer key is opened, in which you attempt everything you left blank or were unsure of. The difference between the two scores is the part of your loss that time caused rather than ignorance.",
      "Selection error":
        "A mark lost on a question that was within your ability but was begun at the wrong moment, while a cheaper question in the same section was still unopened. It is repaired by practising rejection, not by revising the chapter.",
      "Readiness margin":
        "The distance between the net score you reproduce across several consecutive papers and the score you judge to be safe. It is read from a run of papers, never from your best one.",
    },
    body: {
      Beginner: `<p>A mock is a full practice paper: one hour, one hundred questions, three sections of twenty minutes each, taken on a computer screen that behaves the way the real platform does. You sit it to find out where you actually stand, which is a different question from whether you know the chapters.</p>
<h2>Sitting it so the number means something</h2>
<ul>
<li>One unbroken hour. No pausing, no stepping away between sections.</li>
<li>Roughly the time of day your examination slot falls in, so your body is used to concentrating then.</li>
<li>Phone in another room. A single message read between sections ends the simulation.</li>
<li>Nothing to look at except a rough sheet and a pen. No formula list, no textbook.</li>
<li>The section order the platform gives you, not one you rearranged to suit yourself.</li>
</ul>
<p>A paper sat with a break between sections always produces a higher score. It also stops telling you anything, because the real paper does not offer breaks.</p>
<h2>Working out your net score</h2>
<p>Suppose you answered 71 questions and 60 of them were correct. That leaves 11 wrong, and each wrong answer costs a quarter of a mark, so the deduction is 11 multiplied by 0.25, which is 2.75. Your net is 60 minus 2.75, which is 57.25. The 29 questions you left blank cost you nothing.</p>
<h2>The second sitting, which is where the learning is</h2>
<p>When the hour ends, do not open the answer key yet. Go back over every question you left blank and every one you were unsure about, and solve them with no clock running at all. Then check everything against the key.</p>
<p>You now have two scores. If the untimed one is far higher, your problem is speed and choice, not the syllabus. If the two are close, there are chapters you have not learnt yet. Those two situations need completely different work over the next fortnight, and the second sitting is how you tell them apart.</p>
<h2>What to write down after every paper</h2>
<p>For each section: how many you attempted, how many were right, how many were wrong, and your net. Then one line naming the single question that ate the most time. Keep them together in one book, because the pattern across six papers is worth far more than any one paper.</p>`,
      Intermediate: `<p>A mock produces three useful things and one useless one. The useless one is the score by itself. The useful ones are the section table, the timing report and the untimed re-solve, and none of them appear unless you go and build them. Budget the review time before you sit the paper, because a paper you have no time to read afterwards is an hour spent proving something you already suspected.</p>
<h2>Rebuilding the paper, section by section</h2>
<table>
<thead><tr><th>Section</th><th>Attempted</th><th>Correct</th><th>Wrong</th><th>Net</th><th>Seconds per attempt</th></tr></thead>
<tbody>
<tr><td>English Language</td><td>23</td><td>20</td><td>3</td><td>19.25</td><td>52</td></tr>
<tr><td>Reasoning Ability</td><td>27</td><td>23</td><td>4</td><td>22.00</td><td>44</td></tr>
<tr><td>Quantitative Aptitude</td><td>21</td><td>17</td><td>4</td><td>16.00</td><td>57</td></tr>
<tr><td><strong>Paper</strong></td><td><strong>71</strong></td><td><strong>60</strong></td><td><strong>11</strong></td><td><strong>57.25</strong></td><td><strong>51</strong></td></tr>
</tbody>
</table>
<p>Every net in that table is correct answers minus a quarter for each wrong one: 20 minus 0.75, 23 minus 1.00, 17 minus 1.00. The seconds column is 1200 divided by the attempts in that section, and it is the number most candidates have never worked out for themselves. Notice that the quantitative section ran at 57 seconds an attempt and still produced the lowest net. That is a section running slow and paying for it twice.</p>
<h2>The untimed re-solve</h2>
<p>Before the key is opened, sit the same paper again with no clock. Take every blank and every answer you were unsure of. Suppose 14 of the 29 blanks now come out correct, and 8 of the 11 wrong answers become correct once the pressure is off. Your untimed correct count is 60 plus 14 plus 8, which is 82.</p>
<p>The gap between 82 and 57.25 is nearly 25 marks, and it is not a syllabus gap. It is time, selection and misreading. A candidate who reads only the 57.25 goes back to revising chapters, which is exactly the wrong repair. The right one is calculation drills, tighter leave discipline and practice at rejecting sets.</p>
<h2>Reading the timing report</h2>
<p>Open the platform's timing view and look for three things.</p>
<ol>
<li><strong>The single longest question.</strong> Anything above two minutes for one question is a leave discipline failure, whatever the outcome was. Two such questions in a section are five attempts thrown away.</li>
<li><strong>Where the first pass ended.</strong> If you were still on your first sweep at minute sixteen, the sweep is too slow and the second pass never happened.</li>
<li><strong>Time on questions finally left blank.</strong> Add it up. This is the purest waste in the paper and it is invisible without the report.</li>
</ol>
<h2>The selection audit</h2>
<p>Take the questions you never opened and solve five of them. If two or three come out inside a minute, you had cheap marks sitting unread while you were working on something expensive. That is a selection error, and it is a separate skill from solving: it is repaired by drilling the first sixty seconds of a set, deciding whether to take it, and by scanning the whole section before committing.</p>
<h2>Turning one paper into next week</h2>
<ul>
<li>Write the section table into a single book, paper after paper, so a trend can be seen.</li>
<li>Name one behaviour to change, not five. Behaviours are things like closing every set at four minutes, or sweeping the simplification block first.</li>
<li>Note any chapter that produced two or more losses in the untimed re-solve. Those are genuine syllabus gaps and they go into the week's study.</li>
<li>Do not change your attempt band and your section order in the same week. If both change and the score moves, you will not know which did it.</li>
</ul>`,
      Advanced: `<p>By the time you are sitting three papers a week, the risk is no longer that you avoid mocks. It is that you consume them: sit, score, feel something, sit the next one. What follows is how to keep the instrument honest and how to read it when the score stops moving.</p>
<h2>Not all mock scores are the same score</h2>
<p>Test platforms differ in difficulty, and they differ deliberately. A series that sets harder quantitative sets produces lower nets across its whole population; a series that sells on encouragement produces higher ones. Comparing your net across two providers therefore compares the papers, not your preparation. Two protections work. Keep one primary series for measurement and treat any other as practice material only. And read your percentile within a paper alongside your net, because the percentile at least holds the paper constant across candidates.</p>
<p>The real examination runs across several shifts, and scores are equated across them so that a candidate who received a harder set is not penalised for it. Practice papers are not equated at all, which is one more reason a single low net is not evidence of anything.</p>
<h2>Three shapes of a bad paper, and three different repairs</h2>
<table>
<thead><tr><th>Shape</th><th>What the numbers look like</th><th>What it actually is</th></tr></thead>
<tbody>
<tr><td>Collapsed section</td><td>Two sections at 20 plus, one at 9</td><td>The floor, not the average, and sectional timing means nothing can rescue it. Every spare hour belongs to that section.</td></tr>
<tr><td>Accuracy crash</td><td>Attempts up to 82, correct 58, net 52</td><td>You raised the attempt band without the speed to support it. Pull the band back and rebuild accuracy first.</td></tr>
<tr><td>Low attempts everywhere</td><td>Attempts 58, correct 55, net 54.25</td><td>Knowledge is fine, throughput is not. Calculation drills and set rejection, not chapters.</td></tr>
</tbody>
</table>
<h2>The plateau</h2>
<p>Nets sit in the same band for six papers. Nothing is wrong with the preparation; something is wrong with the diagnosis. Check three things in order. First, has your untimed re-solve score also stopped moving, or is it climbing while the timed score does not. A climbing untimed score with a flat timed score is a delivery problem and no amount of new material fixes it. Second, are the same two chapters appearing in the loss list paper after paper, in which case they are being reviewed rather than repaired. Third, has the behaviour you named last week actually been performed in the hall. The timing report answers that one, and candidates are usually surprised.</p>
<h2>Reading your readiness honestly</h2>
<p>Take five consecutive papers netting 48, 61, 52, 54 and 53. The mean is 53.6 and the 61 is the paper every candidate quotes to themselves. The number that should drive planning is the band you reproduce, roughly 52 to 54, with the 61 read as a favourable paper and the 48 as a bad morning. The cut-off in any cycle is an output of that cycle's vacancies and difficulty, so a margin is not a target you set against last year's figure. It is simply the distance between what you reliably produce and what you consider comfortable, and it is grown by lifting the floor rather than the ceiling.</p>
<h2>Cadence, and when to stop</h2>
<ul>
<li>Two papers a week in the speed phase, rising to three, each one fully reviewed. Three unreviewed papers teach less than one reviewed one.</li>
<li>In the last ten days, drop to two, keep the review at full length, and open no new topic at all.</li>
<li>In the final three days, sit at most one full paper and spend the rest on your own error book and formula sheet. A poor paper on the last day costs sleep and buys nothing.</li>
</ul>
<h2>Traps a serious candidate still falls into</h2>
<ul>
<li><strong>Scoring before re-solving.</strong> Once the key is open, the untimed re-solve is contaminated and you cannot separate time loss from knowledge loss for that paper.</li>
<li><strong>Chasing the attempt count.</strong> Attempts are an input, not the score. Look at the accuracy that came with them.</li>
<li><strong>Reviewing only the wrong answers.</strong> The unopened questions carry the selection lesson, and they are the largest group on the sheet.</li>
<li><strong>Treating a strong paper as an arrival.</strong> One high net is a paper that suited you. The band is the truth.</li>
</ul>`,
      Expert: `<p>Protocol card. Use it on the day of every paper in the last month.</p>
<h2>Before, during, after</h2>
<table>
<thead><tr><th>Stage</th><th>Fixed rules</th></tr></thead>
<tbody>
<tr><td>Before</td><td>Slot hour, phone out of the room, rough sheet and pen only, review time already blocked in the day</td></tr>
<tr><td>During</td><td>Platform section order, no pause, palette cleared with two minutes left in each section</td></tr>
<tr><td>After, first</td><td>Untimed re-solve of every blank and every unsure answer, key still closed</td></tr>
<tr><td>After, second</td><td>Key opened, section table built, timing report read, five unopened questions solved</td></tr>
</tbody>
</table>
<h2>The numbers to record, every paper</h2>
<ul>
<li>Per section: attempted, correct, wrong, net, and 1200 divided by attempts.</li>
<li>Paper: net, untimed correct count, and the gap between them.</li>
<li>Longest single question in seconds, and total seconds spent on questions finally left blank.</li>
<li>One named behaviour for the coming week. One, not five.</li>
</ul>
<h2>Diagnosis from the numbers</h2>
<table>
<thead><tr><th>Reading</th><th>Diagnosis</th><th>Next fortnight</th></tr></thead>
<tbody>
<tr><td>Untimed count far above timed net</td><td>Delivery, not knowledge</td><td>Calculation drills, leave discipline, set rejection</td></tr>
<tr><td>Untimed count close to timed net</td><td>Genuine syllabus gaps</td><td>Named chapters, untimed practice first</td></tr>
<tr><td>Attempts rising, accuracy falling</td><td>Band raised too early</td><td>Pull the band back to the last stable level</td></tr>
<tr><td>One section far below the others</td><td>The floor is the score</td><td>Every spare hour into that section only</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li><strong>Re-solve before the key.</strong> Once you have seen the answers, you can no longer tell time loss from ignorance.</li>
<li><strong>Net, never raw.</strong> Correct minus a quarter for each wrong. Blanks are free.</li>
<li><strong>The band, not the best.</strong> Plan against what you reproduce across five papers.</li>
<li><strong>One behaviour a week.</strong> Two changes at once make the result unreadable.</li>
<li><strong>No paper you cannot review the same day.</strong> The review is the product, the paper is the raw material.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>A technical failure mid paper makes that sitting unusable as a measurement. Note it and discard the number rather than arguing with it.</li>
<li>The clerical paper carries numerical ability in place of quantitative aptitude with the same structure, so this protocol transfers without change.</li>
<li>A sectional cut-off, where a cycle imposes one, makes a collapsed section fatal on its own. Read the sectional nets before the total, always.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which of these practice sittings produces a score that actually tells you something about your readiness?",
        options: [
          "One unbroken hour on the platform's own section order, at about the hour your slot falls, with the phone out of the room",
          "The three sections taken on three different evenings, each given its full twenty minutes",
          "One hour with the clock paused twice to check a formula you had forgotten",
          "One hour taken from a printed copy of the paper with a wristwatch keeping the time",
        ],
        answer: 0,
        explanation:
          "A mock measures delivery under the real constraints, so the sitting has to reproduce them: one hour without a break, the section order the platform serves, and nothing to consult. Taking the sections on separate evenings is the tempting option because each section still gets its full twenty minutes, but it removes the stamina and the order effects entirely and reliably inflates the score.",
        difficulty: "Easy",
        skill: "Simulation fidelity",
      },
      {
        n: 2,
        question:
          "A candidate attempts 71 questions in a prelims mock and 60 of them are correct. What is the net score?",
        options: ["57.25", "60.00", "49.00", "42.25"],
        answer: 0,
        explanation:
          "Eleven answers are wrong, each costing a quarter of a mark, so the deduction is 11 multiplied by 0.25, which is 2.75, and the net is 60 minus 2.75 or 57.25. The 49.00 option comes from deducting a full mark for every wrong answer, which is the commonest misreading of the penalty clause: the deduction is one quarter of the marks the question carries, not the whole of them.",
        difficulty: "Easy",
        skill: "Net score reconstruction",
      },
      {
        n: 3,
        question:
          "Candidate A attempts 84 questions with 63 correct. Candidate B attempts 68 with 60 correct. Which statement is true?",
        options: [
          "A nets 57.75 and B nets 58.00, so B scores higher on sixteen fewer attempts",
          "A nets 57.75 and B nets 58.00, so A scores higher because the attempt count counts too",
          "Both net 60.00, because unanswered questions are not penalised",
          "A nets 42.00 and B nets 43.00, because every attempt carries a quarter mark risk",
        ],
        answer: 0,
        explanation:
          "A has 21 wrong for a deduction of 5.25 and nets 57.75, while B has 8 wrong for a deduction of 2.00 and nets 58.00, so the candidate who attempted sixteen fewer questions finished ahead and had time in hand. The second option is the trap that drives most attempt chasing: the attempt count is an input to the score and never a part of it.",
        difficulty: "Medium",
        skill: "Net score reconstruction",
      },
      {
        n: 4,
        question:
          "The timing report shows 280 seconds spent across two quantitative questions that were finally left blank, in a section where your other attempts averaged 57 seconds. What does that tell you?",
        options: [
          "That chapter has to be taken back to the foundation stage",
          "About five attempts worth of time went into two questions that scored nothing, so the loss is leave discipline rather than knowledge",
          "The section was harder than usual and no conclusion follows",
          "You should reduce your attempt band in that section next time",
        ],
        answer: 1,
        explanation:
          "Two hundred and eighty seconds divided by 57 is close to five attempts, and they returned nothing at all, which is a timing behaviour visible only in the report and repaired by walking away on a count. Concluding that the chapter needs relearning is the natural but wrong move: a timing fact is being used to draw a knowledge conclusion, and the untimed re-solve is what settles that question.",
        difficulty: "Medium",
        skill: "Timestamp log",
      },
      {
        n: 5,
        question:
          "Your timed net is 57.25. On an untimed re-solve of the same paper, taken before the key is opened, 82 answers come out correct. What should the next fortnight contain?",
        options: [
          "Fresh chapters, because 82 shows the syllabus is nearly complete and it is time to move on",
          "Speed work: calculation drills, leave discipline and practice at rejecting sets, because roughly 25 marks were lost to time and selection rather than to the syllabus",
          "Nothing different, since the untimed score is the truer measure of your standing",
          "Revision of every chapter the 25 questions were drawn from",
        ],
        answer: 1,
        explanation:
          "The 25 mark gap between the two scores is produced by the clock and by question choice, so the repair is throughput and not content. Revising those chapters is the attractive wrong answer because it feels like serious work, but the re-solve has already shown you can do them: what you could not do was reach them inside fifty seconds.",
        difficulty: "Medium",
        skill: "Untimed re-solve",
      },
      {
        n: 6,
        question:
          "Which of these lost marks is a selection error rather than an execution error?",
        options: [
          "A reasoning puzzle abandoned after four minutes while a coding decoding set of five in the same section was never opened",
          "A ratio question answered wrongly because the two quantities were read the wrong way round",
          "A question left blank because that chapter had not been studied at all",
          "A question answered correctly but only after ninety seconds of work",
        ],
        answer: 0,
        explanation:
          "A selection error is a question begun at the wrong moment while a cheaper one sat unread, which is exactly the abandoned puzzle with an untouched coding set beside it, and it is repaired by practising rejection rather than by revising reasoning. The misread ratio is tempting because it also cost a mark, but that is an execution slip and it calls for a slower read, not a different choice of question.",
        difficulty: "Hard",
        skill: "Selection error audit",
      },
      {
        n: 7,
        question:
          "Five consecutive mocks net 48, 61, 52, 54 and 53. Which figure should your planning use?",
        options: [
          "61, because it is proof of what you are capable of on the day",
          "The band of about 52 to 54 that you reproduce, with 61 read as a favourable paper",
          "53.6, the mean, treated as the score you will produce next time",
          "48, so that every plan is built on the worst case",
        ],
        answer: 1,
        explanation:
          "Readiness is what you reproduce across papers, so the band you hit in three of the five is the planning number and the single 61 is a paper that suited you rather than a new level. The mean of 53.6 is the tempting alternative, but averaging one favourable paper with one bad morning produces a figure you have never actually scored and hides the weak section that caused the 48.",
        difficulty: "Medium",
        skill: "Readiness margin",
      },
    ],
  },
};

export default PART;
