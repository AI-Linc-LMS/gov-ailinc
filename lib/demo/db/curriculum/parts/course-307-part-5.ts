/**
 * Course 307: IBPS PO & Clerk: Prelims and Mains, part 5.
 *
 * Topics 30717 to 30720: the second half of the English module, then the
 * banking, economy and general awareness module.
 *
 * Written for a candidate who has already been taught reading comprehension and
 * error spotting in this module and now meets the question types that test the
 * same reading at gap level and at paragraph level, and who then has to build
 * the awareness section that carries the highest marks per hour of study in the
 * whole examination. Exam mechanics are stated as they are set: prelims is
 * sectionally timed, mains is a separate paper with its own sectional clocks,
 * a wrong answer costs a quarter of a mark, and the prelims score is not
 * carried into the final merit list.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30717: {
    topicId: 30717,
    title: "Cloze test, fillers and para jumbles",
    summary:
      "Cloze passages, single and double fillers and para jumbles are three costumes worn by one skill: holding the direction of a paragraph in your head while you test a candidate word or a candidate order against it. You learn the method for each, the connector families that decide most gaps, and the point at which a jumble set should be abandoned rather than rescued.",
    concepts: [
      "Contextual cloze reading",
      "Connectors and contrast signals",
      "Collocation in fillers",
      "Double filler elimination",
      "Para jumble anchors",
      "Pronoun and reference chains",
    ],
    glossary: {
      "Cloze test":
        "A short passage with words removed, each gap carrying four choices. The passage is scored as one unit of meaning, so a gap is answered from the sentences around it and not from the gap sentence alone.",
      Filler:
        "A standalone sentence with one gap, or two gaps in the double variant, where the missing word has to satisfy meaning, grammar and the fixed word partnership all at once.",
      Collocation:
        "The habitual pairing of words that a fluent writer does not choose consciously: you incur a loss, levy a charge, accrue interest and lodge a complaint, and the alternatives are not wrong in grammar, only wrong in usage.",
      "Discourse marker":
        "A word or phrase whose job is to signal the relation between two statements rather than to add content of its own: however, therefore, moreover, nevertheless, in contrast.",
      "Para jumble":
        "Four or five sentences of one paragraph presented in a shuffled order, to be restored. The examiner writes exactly one order that satisfies every reference in the set.",
      "Anchor sentence":
        "A sentence whose position is forced by its own wording: an opener carries no backward reference, a closer summarises or concedes, and a sentence beginning with a pronoun cannot come first.",
    },
    body: {
      Beginner: `<p>The English section of the prelims paper gives you thirty questions and twenty minutes of its own clock. Three of the question types in it are one skill wearing three costumes, and this topic teaches that skill from the beginning.</p>
<h2>What the three types look like</h2>
<ul>
<li>A <strong>cloze test</strong> is a short passage, usually five to eight sentences, with some words taken out. Each gap has four choices and your job is to put back the word the writer would have used.</li>
<li>A <strong>filler</strong> is a single sentence with one gap, or with two gaps in the double variant. There is no passage around it, so the sentence itself has to tell you everything.</li>
<li>A <strong>para jumble</strong> gives you four or five sentences of one paragraph in a shuffled order, and asks you to put them back in the order the writer wrote them.</li>
</ul>
<h2>Read the whole thing before you touch a gap</h2>
<p>The most common mistake is to read up to the gap, stop, and look at the options. A gap is not a guessing game about one sentence. It is a test of whether you know where the paragraph is going. Read the passage once from start to finish, at normal speed, before you look at any option list. You will then find that two of the four options fall away without argument.</p>
<h2>Two small words decide most gaps</h2>
<p>Words like <strong>but</strong>, <strong>however</strong> and <strong>although</strong> tell you the sentence is about to turn against what came before. Words like <strong>so</strong>, <strong>therefore</strong> and <strong>hence</strong> tell you it is going to continue in the same direction. These are called <strong>discourse markers</strong>. Once you spot one, you already know the flavour of the missing word, even before you read the choices.</p>
<h2>A worked filler</h2>
<p>Sentence: the branch met its deposit target in March, ______ its loan target was still short by a wide margin.</p>
<p>Choices: and, but, so, because.</p>
<p>The first half is good news and the second half is bad news, so the sentence turns. That rules out and, so and because in one stroke, because all three continue a thought rather than turn it. The answer is but.</p>
<h2>What a wrong answer costs</h2>
<p>A correct answer earns one mark and a wrong answer takes away a quarter of a mark. So a gap where you have honestly reduced four options to two is worth attempting, because two such gaps give you on average one mark and a quarter penalty rather than a loss. A gap where all four options still look alike is worth leaving. Nobody in the hall is being paid for bravery.</p>
<h2>The habit to build this week</h2>
<p>Read one editorial from a business newspaper every day and underline every connector in it. You are not reading for the news. You are training your eye to see the joints of a paragraph, which is the whole of this topic.</p>`,
      Intermediate: `<p>These three types test one thing: whether you can hold the direction of a paragraph in your head and test a candidate against it. Treat them as one topic and the method transfers.</p>
<h2>The cloze method, worked</h2>
<p>Take this passage, with the reasoning written out for each gap.</p>
<p>Digital payments have grown at a pace few regulators anticipated. The volume of small value transfers has <strong>(1)</strong> every year since the unified interface was opened to third party applications, and the cost to the customer has fallen close to zero. This has <strong>(2)</strong> questions about who pays for the rails. Banks carry the cost of failed transactions and of customer service, <strong>(3)</strong> the applications that sit on top of the system earn from other lines of business. Regulators have therefore begun to <strong>(4)</strong> whether a small charge is necessary to keep the network sound, <strong>(5)</strong> any charge would slow the very adoption that made the system useful.</p>
<ol>
<li>Gap 1, choices risen, raised, arose, arisen. The verb has no object, so the transitive raise is out. The auxiliary is has, so you need the past participle risen, not the simple past rose or the participle of arise. Answer: risen.</li>
<li>Gap 2, choices raised, arisen, questioned, demanded. Here there is an object, questions, so the transitive verb is needed and raise questions is the fixed pairing. Answer: raised. Notice that gaps 1 and 2 are the same pair of verbs tested in opposite directions, which examiners enjoy.</li>
<li>Gap 3, choices while, because, therefore, unless. Banks bear a cost and the applications do not: the two halves contrast. Only while carries contrast here. Answer: while.</li>
<li>Gap 4, choices examine, examined, examining, examines. Begun to takes the bare infinitive after to. Answer: examine. This gap is pure grammar and should take five seconds.</li>
<li>Gap 5, choices even though, so that, because, hence. The regulator wants the charge and also fears it, so the clause concedes. Answer: even though.</li>
</ol>
<h2>Fillers: meaning, then grammar, then collocation</h2>
<p>Run the three tests in that order, because the first one usually finishes the job.</p>
<ul>
<li><strong>Meaning.</strong> Does the word point the sentence the way the sentence is already pointing?</li>
<li><strong>Grammar.</strong> Does the form fit: tense, number, part of speech, the preposition the verb demands?</li>
<li><strong>Collocation.</strong> Is this the partner word that usage has fixed? You incur a loss, levy a charge, accrue interest, lodge a complaint, waive a fee, avail yourself of a facility.</li>
</ul>
<h2>Double fillers are an elimination game</h2>
<p>With two gaps and four option pairs, you are not solving twice. You are deleting. Test the easier gap across all four pairs first, strike out every pair that fails it, and only then look at the second word of whatever survives.</p>
<p>Example: because the branch had ______ its target well before March, the manager was ______ a discretionary bonus. Pairs: exceeded and awarded, exceed and award, excelled and rewarded, surpass and given. The first gap follows had, so it needs a past participle: exceed and surpass die at once. Of the two survivors, the second gap decides it. You award a bonus to a person, but you reward a person with a bonus, so rewarded a bonus is not English. Answer: exceeded and awarded.</p>
<h2>Para jumbles: find the ends, not the order</h2>
<p>Never try to sequence five sentences from the first one forward. Work from anchors.</p>
<ol>
<li>Find the <strong>opener</strong>: the sentence with no backward reference, no this, that, it, such, also, however, and usually the one that introduces the subject by its full name.</li>
<li>Find <strong>mandatory pairs</strong>: a pronoun or a this must sit immediately after the noun it stands for.</li>
<li>Find the <strong>closer</strong>: a summary, a consequence, a concession, or a sentence that answers the question the paragraph raised.</li>
<li>Read your order once as a paragraph. If any reference points at nothing, the order is wrong.</li>
</ol>
<p>Worked set. A: it also fixed the responsibility for a failed transfer on the bank holding the customer account. B: the regulator's first circular on the subject simply required that every complaint be acknowledged within a stated period. C: this shifted the incentive, because a bank that carried the cost of failure had a reason to invest in its own reliability. D: complaints about failed digital transfers rose sharply once volumes crossed a few billion a month. E: neither step, however, told the customer how long a refund would actually take, and that gap took another two years to close.</p>
<p>D opens: it names the problem and refers to nothing before it. B follows, being the first response. A must follow B, since its it is the circular and its also adds a second requirement. C must follow A, since its this is the fixing of responsibility. E closes: neither step needs two steps behind it, and however plus the closing clause is a terminal move. The order is D, B, A, C, E.</p>`,
      Advanced: `<p>You already know what a cloze test is. What decides your marks on a second attempt is the pair of options the setter wrote for you, and the clock. Both are addressed here.</p>
<h2>The time arithmetic you are actually working under</h2>
<p>Prelims English is thirty questions on a twenty minute sectional clock, which is forty seconds a question with nothing left over. One reading comprehension set of eight to ten questions will honestly take you eight to nine minutes including the read. That leaves roughly eleven minutes for the other twenty questions, so a five gap cloze has to be done in about three minutes and a jumble set in about two. In PO mains the section is thirty five questions in forty minutes, which sounds generous until you meet the paragraph completion and word swap variants that are set there.</p>
<h2>How the wrong option is built</h2>
<p>Setters do not scatter four random words. Look for these constructions and you will start seeing the answer before you reason to it.</p>
<table>
<thead><tr><th>Trap</th><th>How it is built</th><th>The check that kills it</th></tr></thead>
<tbody>
<tr><td>Near synonym</td><td>Two options mean nearly the same thing, but only one collocates with the neighbouring noun</td><td>Say the two word phrase aloud in your head: levy a penalty, not lay a penalty</td></tr>
<tr><td>Right direction, wrong strength</td><td>The passage says uptake was slow, the option says hostile</td><td>Match the temperature of the passage, not only its sign</td></tr>
<tr><td>Grammatically clean, tonally wrong</td><td>A colloquial word dropped into a formal editorial register</td><td>Ask whether a leader writer would print it</td></tr>
<tr><td>Connector family swap</td><td>Three consequence markers and one contrast marker, or the reverse</td><td>Decide contrast or continuation before reading the options at all</td></tr>
<tr><td>Tense drift</td><td>The option is the simple past where the auxiliary demands a participle</td><td>Read the two words before the gap, always</td></tr>
</tbody>
</table>
<h2>Connector families, so you decide before you read the options</h2>
<ul>
<li><strong>Contrast:</strong> but, however, whereas, while, on the contrary, conversely, yet.</li>
<li><strong>Concession:</strong> although, even though, notwithstanding, granted that, admittedly.</li>
<li><strong>Cause:</strong> because, since, as, owing to, on account of.</li>
<li><strong>Consequence:</strong> therefore, hence, thus, consequently, accordingly.</li>
<li><strong>Addition:</strong> moreover, further, besides, in addition, what is more.</li>
<li><strong>Exemplification:</strong> for instance, namely, in particular, to illustrate.</li>
</ul>
<p>Note the pair that repeat attempters keep losing: while and whereas can carry contrast without any adversative punctuation, and although concedes rather than contrasts. A sentence that already contains but cannot take however in the same clause.</p>
<h2>The newer patterns, which are the same skill</h2>
<ul>
<li><strong>Paragraph completion:</strong> a paragraph with the last sentence missing. The answer continues the direction of the final connector and does not introduce a new subject.</li>
<li><strong>Sentence connector:</strong> two sentences to be joined by one of four phrases. Read the relation first, then check that the joined sentence is still one grammatical sentence.</li>
<li><strong>Column based fillers:</strong> three phrases in column one, three in column two, and you mark every pair that makes sense. Test all nine pairings mechanically rather than by feel, because the marking rewards completeness.</li>
<li><strong>Word swap and word usage:</strong> two words in a sentence have been exchanged, or one word is used correctly in only one of four sentences. Both reward collocation knowledge, which is the topic that follows this one.</li>
</ul>
<h2>When to abandon a jumble, and what to salvage</h2>
<p>Give a five sentence set ninety seconds to yield an opener and one mandatory pair. If neither has appeared, do not keep reading it. A jumble set is usually four or five separate questions of the form which sentence is third or which pair is adjacent. Even a half solved set answers some of those: if you are certain that A follows B, you can safely mark the question that asks which sentence follows B, and leave the rest blank. Salvage, then move.</p>
<h2>The attempt arithmetic</h2>
<p>Negative marking is a quarter of a mark. Suppose you attempt fifteen English questions and get twelve right. Your score is twelve minus three quarters of a mark, that is 11.25. Now suppose you push to twenty attempts by guessing five blind gaps and get one of them: fourteen right minus one and a half, that is 12.5, which looks better. It only looks better because the guessing rate was assumed at one in five. Blind guessing at one in four is break even before you account for the fact that a good setter makes the wrong option attractive, which pulls your real rate below one in four. Guess only when you have eliminated two options honestly.</p>`,
      Expert: `<p>Last month recall sheet. Nothing here is new to you; the point is to have it retrievable in under a second under a sectional clock.</p>
<h2>Decide the relation before you read the options</h2>
<table>
<thead><tr><th>Signal in the passage</th><th>Relation</th><th>Word family to look for</th></tr></thead>
<tbody>
<tr><td>Good news then bad news</td><td>Contrast</td><td>but, however, whereas, yet, conversely</td></tr>
<tr><td>Claim then a limit on the claim</td><td>Concession</td><td>although, even though, notwithstanding</td></tr>
<tr><td>Fact then its effect</td><td>Consequence</td><td>therefore, hence, thus, consequently</td></tr>
<tr><td>Effect then its reason</td><td>Cause</td><td>because, since, as, owing to</td></tr>
<tr><td>Claim then a second claim of the same sign</td><td>Addition</td><td>moreover, further, besides, in addition</td></tr>
<tr><td>General statement then a case</td><td>Exemplification</td><td>for instance, namely, in particular</td></tr>
</tbody>
</table>
<h2>Jumble anchors, in the order you test them</h2>
<ol>
<li>Opener: full noun phrase, no this, that, it, also, however, therefore, such, another.</li>
<li>Forced pair: a pronoun or a this sits immediately after its antecedent.</li>
<li>Chronology: first, then, later, subsequently, eventually.</li>
<li>Counting: one such, a second, the third, finally.</li>
<li>Closer: however plus a summary, a consequence, or an unresolved gap.</li>
</ol>
<h2>Collocations that recur in banking and economy passages</h2>
<ul>
<li>incur a loss, incur expenditure, incur liability</li>
<li>levy a charge, levy a penalty, impose a fine</li>
<li>accrue interest, accrue a benefit</li>
<li>waive a fee, waive a requirement, forgo revenue</li>
<li>lodge a complaint, file a return, furnish details</li>
<li>curb inflation, contain a deficit, rein in credit growth</li>
<li>extend a facility, sanction a limit, disburse a loan</li>
<li>meet a target, miss a target, exceed a target</li>
</ul>
<h2>Edge cases worth carrying in</h2>
<ul>
<li>Not only takes but also, and both halves must be the same part of speech. If the first half is a verb phrase and the option gives you a noun phrase, that option is dead regardless of meaning.</li>
<li>Neither pairs with nor, either with or. A sentence with neither and or in it is an error spotting question in disguise.</li>
<li>Despite and in spite of take a noun or a gerund, never a clause; although takes a clause.</li>
<li>Comprise takes no of. The passive is composed of is correct, comprised of is not.</li>
<li>A sentence beginning with This is why or Such a step can never be the opener of a jumble.</li>
<li>In a paragraph completion question, an option introducing a subject that appears nowhere earlier is wrong even if it reads well.</li>
</ul>
<h2>Final week drill</h2>
<ol>
<li>Ten fillers a day timed at thirty seconds each, marked for collocation errors separately from meaning errors.</li>
<li>Two jumble sets a day with a ninety second abandon rule enforced by a clock, not by feel.</li>
<li>One editorial a day with every connector underlined and its family named in the margin.</li>
<li>Keep one page of your own repeated collocation mistakes. That page, not a vocabulary list, is what you revise on the last day.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Rural branches were opened in every mandal of the district; ______, deposit growth stayed concentrated in the district headquarters. Which word fits the gap?",
        options: ["therefore", "however", "hence", "accordingly"],
        answer: 1,
        explanation:
          "The first clause reports an expansion and the second reports that the expected result did not follow, so the sentence turns and needs a contrast marker: however. Therefore, hence and accordingly all belong to the consequence family and would claim that concentrated deposits were the natural outcome of opening branches everywhere, which reverses the writer's point.",
        difficulty: "Easy",
        skill: "Connectors and contrast signals",
      },
      {
        n: 2,
        question:
          "The company had to ______ a heavy loss in the first quarter after two large accounts turned bad. Which word fits the gap?",
        options: ["incur", "occur", "inflict", "afflict"],
        answer: 0,
        explanation:
          "Incur is the verb that collocates with loss, expenditure and liability, and it is transitive, which the gap requires. Inflict is the attractive wrong answer because it is also transitive and also carries harm, but you inflict harm on somebody else, whereas the company here is the one bearing the loss; occur is intransitive and cannot take an object at all.",
        difficulty: "Easy",
        skill: "Collocation in fillers",
      },
      {
        n: 3,
        question:
          "Because the branch had ______ its target well before March, the manager was ______ a discretionary bonus. Which pair fills the two gaps?",
        options: [
          "exceed, award",
          "exceeded, awarded",
          "excelled, rewarded",
          "surpass, given",
        ],
        answer: 1,
        explanation:
          "The first gap follows the auxiliary had and so needs a past participle, which removes exceed and surpass immediately. Between the two survivors the second gap decides it: a bonus is awarded to a person, while a person is rewarded with a bonus, so rewarded a bonus is not English and excelled additionally cannot take target as an object.",
        difficulty: "Medium",
        skill: "Double filler elimination",
      },
      {
        n: 4,
        question:
          "Restore the paragraph. A: it also fixed responsibility for a failed transfer on the bank holding the customer account. B: the regulator's first circular on the subject simply required that every complaint be acknowledged within a stated period. C: this shifted the incentive, because a bank carrying the cost of failure had a reason to invest in its own reliability. D: complaints about failed digital transfers rose sharply once volumes crossed a few billion a month. E: neither step, however, told the customer how long a refund would actually take.",
        options: ["BDACE", "DBACE", "DBCAE", "DABCE"],
        answer: 1,
        explanation:
          "D is the only sentence with no backward reference, so it opens; B is the first response and must precede A, whose it means that circular and whose also adds a second requirement; C follows A because its this is the fixing of responsibility; E closes, since neither step needs two steps already stated. DBCAE fails because C's this would then point at the acknowledgement rule rather than at the responsibility rule.",
        difficulty: "Medium",
        skill: "Para jumble anchors",
      },
      {
        n: 5,
        question:
          "In a five sentence para jumble, which sentence can be ruled out as the opening sentence without reading the others?",
        options: [
          "A sentence naming the scheme in full and stating when it was launched",
          "A sentence beginning: such a step was bound to attract criticism",
          "A sentence stating a statistic about rural bank branches",
          "A sentence defining what a business correspondent does",
        ],
        answer: 1,
        explanation:
          "Such a step refers backwards to a step that must already have been described, so the sentence cannot be first; this is the fastest single elimination in the whole question type. The full name plus launch date sentence is the classic opener, and a bare statistic or a definition can both legitimately open a paragraph because neither points at anything before it.",
        difficulty: "Easy",
        skill: "Pronoun and reference chains",
      },
      {
        n: 6,
        question:
          "The scheme was expected to widen access to credit, but a later audit found that a majority of the new accounts had remained ______ within a year of opening. Which word fits?",
        options: ["active", "dormant", "profitable", "mandatory"],
        answer: 1,
        explanation:
          "But signals that the audit contradicts the expectation, so the gap needs a word opposed to widened access, and dormant is the standard banking term for an account with no customer induced transaction for an extended period. Active is the trap for a candidate who reads only the first half of the sentence and misses the reversal that but has already announced.",
        difficulty: "Easy",
        skill: "Contextual cloze reading",
      },
      {
        n: 7,
        question:
          "The volume of small value transfers has ______ every year, and the rise has ______ questions about who pays for the network. Which pair fills the gaps?",
        options: [
          "risen, raised",
          "raised, risen",
          "rose, arisen",
          "arisen, rose",
        ],
        answer: 0,
        explanation:
          "The first gap has no object and follows has, so it needs the intransitive participle risen, while the second gap has the object questions and so needs the transitive raised, which is also the fixed pairing raise questions. The reversed pair is the standard trap: raised without an object and risen with one are both ungrammatical, and rose cannot follow has at all.",
        difficulty: "Medium",
        skill: "Contextual cloze reading",
      },
    ],
  },
};

export default PART;
