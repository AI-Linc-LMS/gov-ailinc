/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 10.
 *
 * Topics 30716, 30718, 30721 and 30722: the two English topics this course had
 * not yet authored, the current affairs revision system that carries the
 * awareness section, and the computer awareness topic that opens the module on
 * computer aptitude and the descriptive paper.
 *
 * Exam mechanics are stated as the paper sets them: the preliminary examination
 * runs on sectional clocks, a wrong answer costs a quarter of a mark, and the
 * preliminary score is not carried into the final merit list. No cut-off,
 * vacancy count, fee, policy rate or examination date is stated as a current
 * fact anywhere in this file. Every worked figure has been checked to produce
 * the number it claims.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30716: {
    topicId: 30716,
    title: "Error spotting and sentence correction",
    summary:
      "Error spotting and sentence improvement test six grammar systems and almost nothing else, which is why the question type rewards a fixed order of checks rather than a broader reading of grammar. You learn that order, the sentences it catches, the rules this paper still enforces where ordinary usage has moved on, and when the no error option is the honest answer.",
    concepts: [
      "Subject verb agreement",
      "Sequence of tenses",
      "Preposition and verb patterns",
      "Parallelism and comparison",
      "Pronoun reference and modifiers",
      "Article and determiner use",
    ],
    glossary: {
      "Error spotting":
        "A question format in which one sentence is cut into three or four labelled parts and you name the part carrying a grammatical mistake. A no error choice is offered and is genuinely used, so the sentence in front of you may be correct as printed.",
      "Sentence improvement":
        "A format in which part of a sentence is underlined and four replacements are offered, one of which repeats the original wording. Choosing the repeat is how you say that nothing needs changing.",
      "Subject verb agreement":
        "The requirement that a verb take the singular or plural form demanded by its own subject, not by whatever noun happens to sit next to it. Almost every question of this type puts a distracting noun in between.",
      "Sequence of tenses":
        "The rule that a verb in a subordinate clause moves back in time when the main verb is in the past. A universal truth is the standing exception and stays in the present.",
      "Dangling modifier":
        "An opening participial phrase whose implied doer is not the subject of the main clause, so the sentence states that the wrong person or thing performed the action.",
      "Parallel structure":
        "The requirement that items joined by and, or, not only and but also share the same grammatical shape, so that three gerunds are not followed by a clause and a noun is not paired with an infinitive.",
    },
    body: {
      Beginner: `<p>Error spotting is a question type, not a grammar syllabus. The paper hands you one sentence cut into three or four labelled parts and asks which part carries a mistake. A further choice, no error, is used often enough that you should treat it as a real answer rather than a decoration.</p>
<h2>Four words you will need</h2>
<ul>
<li>The <strong>subject</strong> is who or what the sentence is about. The <strong>verb</strong> is what the subject does or is.</li>
<li>A <strong>singular</strong> subject is one thing and takes a singular verb: the branch opens. A <strong>plural</strong> subject is more than one and takes a plural verb: the branches open.</li>
<li>A <strong>preposition</strong> is a small joining word such as of, to, for, with, at, from.</li>
<li>A <strong>tense</strong> is the time a verb points at: opens is present, opened is past, will open is future.</li>
</ul>
<h2>Five faults account for most of the marks</h2>
<ol>
<li><strong>The verb does not match its subject.</strong> The list of candidates have been displayed. The subject is the list, one thing, so it must be has been displayed. The word candidates sits nearby and pulls your ear the wrong way.</li>
<li><strong>The tense chain breaks.</strong> He said that he will submit the report. Said is past, so the second verb moves back with it: he would submit.</li>
<li><strong>A preposition is wrong or not wanted.</strong> You discuss a proposal, not discuss about it. You are senior to a colleague, not senior than a colleague.</li>
<li><strong>A list changes shape halfway.</strong> The course covers reading a balance sheet, appraising a loan and how to write a note. The third item has changed form and should be writing a note.</li>
<li><strong>A describing phrase lands on the wrong doer.</strong> Having checked the papers, the loan was sanctioned. The loan did not check the papers.</li>
</ol>
<h2>How to read the sentence</h2>
<p>Read the whole sentence once at normal speed before you look at the parts. Then find the main verb and ask what its subject is. Strike out everything sitting between the two, because that material was put there to distract you. One action catches four errors out of five in this question type.</p>
<h2>What a wrong answer costs</h2>
<p>A correct answer earns one mark and a wrong answer takes away a quarter of a mark. If you have found a fault you can name, mark it. If you have checked the verb, the tense and the prepositions and nothing is wrong, choose no error rather than inventing a fault, because a sentence that merely sounds unusual to you is not a sentence that breaks a rule.</p>
<h2>What to practise this week</h2>
<p>Take ten sentences a day from a newspaper report and write down two things for each: the main verb, and the subject that verb belongs to. You are not correcting anything yet. You are building the single habit this topic is made of.</p>`,
      Intermediate: `<p>The paper does not test the whole of English grammar. It tests six systems, in a stable proportion, and it hides each error behind a distraction that is chosen from a short list. So work to a fixed order of checks and stop at the first thing that fails.</p>
<h2>The order of checks</h2>
<ol>
<li>Find the finite verb. Find its subject. Strike out everything between them.</li>
<li>Check the tense of every subordinate verb against the main or reporting verb.</li>
<li>Check every preposition against the verb or adjective that governs it.</li>
<li>Check every list and every comparison for parallel shape.</li>
<li>Check each pronoun for one unambiguous antecedent, and each opening participle for the noun it attaches to.</li>
<li>Check articles, quantifiers and degree words last, because they carry the fewest errors.</li>
</ol>
<h2>Eight sentences, worked</h2>
<ol>
<li><strong>The list of candidates who have qualified for the second stage have been put up on the notice board.</strong> Strike out the material between subject and verb and you are left with the list have been put up. The subject is the list, so it must be has been put up. Notice that have qualified inside the relative clause is correct, because the antecedent of who is candidates. One sentence, two verbs, one error.</li>
<li><strong>Neither the branch manager nor the two cashiers was able to explain the shortfall.</strong> With neither and nor, or either and or, the verb agrees with whichever subject stands nearer to it. Cashiers is nearer, so were.</li>
<li><strong>The regional office informed the branch that it will conduct a surprise audit the following week.</strong> Informed is past, so the reported verb moves back to would conduct. The exception is a permanent truth, which stays in the present, and an audit next week is not a permanent truth.</li>
<li><strong>The committee discussed about the proposal at length before rejecting it.</strong> Discuss is transitive and takes its object directly, so about goes. The same family of faults: comprise takes no of, emphasise takes no on, order takes no for, reach takes no at, and investigate takes no into.</li>
<li><strong>The new deputy manager is senior than me by two years.</strong> The comparatives borrowed from Latin take to and never than: senior to, junior to, superior to, inferior to, prior to, preferable to. Prefer behaves the same way, so you prefer a posting in Warangal to one in Hyderabad.</li>
<li><strong>The programme trains you in reading a balance sheet, appraising a loan proposal and how to write a credit note.</strong> Two gerunds and then a clause. The third item has to match the first two, so writing a credit note.</li>
<li><strong>Having verified all the documents, the loan was sanctioned the same day.</strong> An opening participial phrase attaches to the subject of the main clause, and here that subject is the loan. Make the officer the subject and the sentence recovers.</li>
<li><strong>He has been working at this branch since the last five years.</strong> Since takes a point in time, as in since March or since he joined. For takes a stretch of time, so for the last five years.</li>
</ol>
<h2>Sentence improvement is the same skill in a different costume</h2>
<p>Here part of the sentence is underlined and four replacements follow, one of which repeats the original. The method does not change: name the fault first, from the same six checks, and only then look for the option that repairs exactly that fault. The setter's favourite distractor is the option that repairs the fault and introduces a second one, which is invisible to a candidate who has started reading options before deciding what was wrong.</p>
<h2>The clock this question type lives on</h2>
<p>Prelims English gives you thirty questions on a twenty minute sectional clock of its own. A comprehension set of nine questions honestly costs about eight minutes including the read, which works out at roughly fifty three seconds a question. Ten grammar questions at twenty five seconds each cost two hundred and fifty seconds, a little over four minutes. Clearing the grammar first therefore buys you the comprehension set with a known quantity of time still on the clock, which is the whole argument for the order in which you attempt the section.</p>
<p>If one sentence has taken fifty seconds, either it is correct or it is beyond you today, and both readings point at marking your best answer and moving on.</p>`,
      Advanced: `<p>On a second attempt this question type rarely fails you on coverage. It fails you in two narrow places: the sentence where you cannot decide between a real error and none, and the sentence where you find an error that is not the one being tested. Both are addressed below.</p>
<h2>The agreement constructions the setter actually uses</h2>
<table>
<thead><tr><th>Construction</th><th>Verb</th><th>Worked instance</th></tr></thead>
<tbody>
<tr><td>One of the plus a plural noun</td><td>Singular</td><td>One of the branches in the district is being relocated</td></tr>
<tr><td>One of those who</td><td>Plural</td><td>She is one of those officers who work through the recovery season, because who stands for officers</td></tr>
<tr><td>The number of</td><td>Singular</td><td>The number of applications was higher than planned</td></tr>
<tr><td>A number of</td><td>Plural</td><td>A number of applications were returned for want of a photograph</td></tr>
<tr><td>Either or neither standing alone as subject</td><td>Singular</td><td>Neither of the two files is missing</td></tr>
<tr><td>Either A or B, neither A nor B</td><td>Agrees with the nearer subject</td><td>Neither the officers nor the manager was informed</td></tr>
<tr><td>Collective noun acting as one body</td><td>Singular</td><td>The committee has decided to defer the proposal</td></tr>
<tr><td>Collective noun acting as individuals</td><td>Plural</td><td>The committee are divided among themselves</td></tr>
<tr><td>A fraction or a percentage</td><td>Takes the noun inside the of phrase</td><td>Two thirds of the staff were present; two thirds of the amount was recovered</td></tr>
<tr><td>Joined by along with, as well as, together with</td><td>Agrees with the first subject only</td><td>The manager, along with his officers, was present</td></tr>
</tbody>
</table>
<h2>The errors a repeat attempter invents</h2>
<p>Half the marks lost here go to faults that are not faults. Strike these from your list of suspicions and your accuracy rises without any new grammar.</p>
<ul>
<li>An infinitive split by an adverb is not an error, and neither is a sentence that ends in a preposition.</li>
<li>A correct passive is not an error merely because an active version would read better. This paper marks grammar, not style.</li>
</ul>
<h2>Rules the paper still enforces where usage has moved</h2>
<ul>
<li>A distributive singular takes a singular pronoun. Each candidate must carry his hall ticket is what the answer key expects, even though ordinary speech now uses their.</li>
<li>Fewer counts, less measures. Fewer than ten applications, less than ten thousand rupees, because money and time behave as quantity rather than as number.</li>
<li>Between divides two, among divides more than two.</li>
<li>Hardly and scarcely take when. No sooner takes than. A sentence pairing no sooner with when is an error however natural it sounds.</li>
<li>Lest already carries the negative, so it takes should and never not.</li>
<li>Comprise takes no of. The whole comprises the parts; the whole is composed of the parts.</li>
<li>Compare to draws a likeness, compare with sets two things side by side point by point.</li>
<li>Data is treated as plural in the answer key, so the data show rather than the data shows.</li>
</ul>
<h2>The no error option, and how to earn it</h2>
<p>Two disciplines make this option safe. First, only mark a part when you can name the rule it breaks in one clause: subject is singular, verb is plural. If you cannot name it, you have a feeling, not a finding. Second, run all six checks before you settle on no error, in the fixed order, so that choosing it is the end of a procedure rather than a shrug. A candidate who never marks no error has capped the score available to them in this question type before the paper begins.</p>
<h2>What goes wrong on the job</h2>
<p>These same six systems break in branch correspondence, and the failures are recognisable. A letter that opens Being a valued customer, we are pleased to offer says that the bank is the valued customer. A reply that reads The customer informed that he will visit the branch mixes a past reporting verb with a future clause. A notice reading All the account holders are requested to kindly submit their KYC documents stacks two politeness markers where one does the work. Reading your own drafts against the six checks is the same drill as the paper, done on live text.</p>`,
      Expert: `<p>Last month recall sheet for the grammar questions. Nothing here is new to you. The point is retrieval under a twenty minute sectional clock.</p>
<h2>Six checks, in the order you run them</h2>
<ol>
<li>Verb, then its subject, with the intervening material struck out.</li>
<li>Tense chain against the main or reporting verb.</li>
<li>Preposition against its governing verb or adjective.</li>
<li>Parallel shape in every list and comparison.</li>
<li>Pronoun antecedent and opening participle.</li>
<li>Article, quantifier, degree word.</li>
</ol>
<h2>Verb and preposition pairs that recur</h2>
<table>
<thead><tr><th>Takes of</th><th>Takes with</th><th>Takes to</th><th>Takes from or in or on</th></tr></thead>
<tbody>
<tr><td>accuse of, consist of, dispose of, deprive of, oblivious of</td><td>comply with, cope with, endowed with, vie with, differ with a person</td><td>adhere to, succumb to, object to, yield to, attend to</td><td>abstain from, refrain from, differ from a thing, indulge in, confide in, insist on, congratulate on</td></tr>
</tbody>
</table>
<h2>Comparatives that refuse than</h2>
<p>senior to, junior to, superior to, inferior to, prior to, anterior to, posterior to, preferable to, prefer one thing to another. Any of these printed with than is the error in its sentence, and you need read no further.</p>
<h2>Two line rules</h2>
<ul>
<li>Distance between subject and verb is a warning sign, not a rule. Strike out the distance and the rule reappears.</li>
<li>Neither and either alone are singular; neither with nor and either with or agree with the nearer subject.</li>
<li>Past reporting verb pulls every reported verb back one step, unless the reported clause is a permanent truth.</li>
<li>A gerund cannot be listed beside an infinitive or a clause.</li>
<li>An opening participle belongs to the subject that follows the comma.</li>
<li>An indefinite article follows sound, not spelling: an hour, a university, an MBA, a one rupee note.</li>
<li>No error is a real option, and choosing it must be the end of the six checks rather than a substitute for them.</li>
</ul>
<h2>Final fortnight drill</h2>
<ol>
<li>Twenty error spotting sentences a day, timed at twenty five seconds each, marked in two columns: found the error, and found the wrong error. The second column is the one that improves.</li>
<li>Ten sentence improvement questions a day, with the rule you used written beside each answer. If you cannot write the rule, the mark was a guess.</li>
<li>Keep one page of the constructions you personally keep missing. That page is what you revise on the last day, not a grammar book.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Identify the part that contains the error: (A) The list of candidates / (B) who have qualified for the second stage / (C) have been displayed / (D) at every branch of the bank.",
        options: [
          "The list of candidates",
          "who have qualified for the second stage",
          "have been displayed",
          "at every branch of the bank",
        ],
        answer: 2,
        explanation:
          "The subject of the main verb is the list, which is singular, so part C must read has been displayed. Part B is the tempting choice because its verb is plural, but the antecedent of who is candidates, so have qualified is correct there and the plural noun standing next to the main verb is exactly the distraction the setter built.",
        difficulty: "Easy",
        skill: "Subject verb agreement",
      },
      {
        n: 2,
        question:
          "Neither the branch manager nor the two cashiers ______ able to explain the shortfall in the cash balance.",
        options: ["were", "was", "is", "has been"],
        answer: 0,
        explanation:
          "With neither and nor the verb agrees with the subject standing nearer to it, and the nearer subject here is the two cashiers, so the plural were is required. Was attracts the candidate who remembers only that neither is singular, which is true when neither stands alone as the subject but not when it is paired with nor across two subjects.",
        difficulty: "Medium",
        skill: "Subject verb agreement",
      },
      {
        n: 3,
        question:
          "The regional office informed the branch that it will conduct a surprise audit the following week. Which correction does the sentence need?",
        options: [
          "will conduct should be would conduct",
          "informed should be had informed",
          "the following week should be next week",
          "the sentence needs no correction",
        ],
        answer: 0,
        explanation:
          "Informed is in the past, so the verb in the reported clause moves back with it and becomes would conduct. Had informed is the attractive alternative because it also changes a tense, but the past perfect is only used when one past event precedes another, and nothing in this sentence happened before the informing.",
        difficulty: "Medium",
        skill: "Sequence of tenses",
      },
      {
        n: 4,
        question:
          "The committee discussed about the proposal at length before rejecting it. Which correction does the sentence need?",
        options: [
          "discussed the proposal",
          "discussed on the proposal",
          "discussed regarding the proposal",
          "no correction is needed",
        ],
        answer: 0,
        explanation:
          "Discuss is transitive and takes its object directly, so the preposition simply goes. Replacing about with on or regarding is the trap for a candidate who has sensed that something is wrong with about but has diagnosed it as the wrong preposition rather than as one preposition too many.",
        difficulty: "Easy",
        skill: "Preposition and verb patterns",
      },
      {
        n: 5,
        question:
          "The programme trains you in reading a balance sheet, appraising a loan proposal and ______.",
        options: [
          "how to write a credit note",
          "to write a credit note",
          "writing a credit note",
          "the way a credit note is written",
        ],
        answer: 2,
        explanation:
          "The first two items are gerunds, so the third must be a gerund as well, which makes writing a credit note the only parallel completion. How to write a credit note is the most tempting distractor because it reads naturally in speech, but it is a clause and cannot stand in a list beside two gerunds.",
        difficulty: "Medium",
        skill: "Parallelism and comparison",
      },
      {
        n: 6,
        question:
          "Which completion of the opening phrase Having verified all the documents is free of a dangling modifier?",
        options: [
          "the loan was sanctioned the same day",
          "it was decided to sanction the loan",
          "there was no delay in sanctioning the loan",
          "the officer sanctioned the loan the same day",
        ],
        answer: 3,
        explanation:
          "An opening participial phrase attaches to the subject of the main clause, so that subject must be the one who did the verifying, and only the officer can verify documents. The passive completion is the standard trap because it reads smoothly while stating that the loan verified its own documents.",
        difficulty: "Hard",
        skill: "Pronoun reference and modifiers",
      },
      {
        n: 7,
        question:
          "The number of applications received in this recruitment cycle ______ far higher than the branch had planned for.",
        options: ["were", "was", "have been", "are"],
        answer: 1,
        explanation:
          "The number of takes a singular verb because the subject is the number itself, so was is correct. Were is the trap for a candidate who agrees the verb with applications, which would be right only in the different construction a number of applications, where a number of means several and the verb turns plural.",
        difficulty: "Medium",
        skill: "Article and determiner use",
      },
      {
        n: 8,
        question: "The new deputy manager is senior ______ me by two years.",
        options: ["than", "from", "to", "over"],
        answer: 2,
        explanation:
          "Senior belongs to the group of comparatives taken from Latin that are completed with to rather than than, alongside junior, superior, inferior, prior and preferable. Than is the trap because it is the ordinary English comparative, and the sentence sounds unremarkable with it, which is precisely why the setter uses it.",
        difficulty: "Easy",
        skill: "Parallelism and comparison",
      },
    ],
  },
  30718: {
    topicId: 30718,
    title: "Vocabulary in context rather than in lists",
    summary:
      "This paper sets vocabulary on words inside a sentence, never on words inside a list, which is why a candidate who has memorised a thousand synonyms still loses the mark to a near synonym of the wrong strength. You learn to read the signal the sentence is already giving, to break an unfamiliar word into its parts, to rank words by intensity and register, and to keep a word log that survives to the examination hall.",
    concepts: [
      "Inference from context",
      "Roots, prefixes and suffixes",
      "Connotation and intensity",
      "Register and formality",
      "Phrasal verbs and idioms",
      "Word usage question type",
    ],
    glossary: {
      Connotation:
        "The attitude a word carries over and above its plain meaning. Thrifty and stingy describe the same behaviour, one approving of it and one disapproving of it, and no dictionary definition separates them.",
      Register:
        "The level of formality a word belongs to. Deferred, put off and shelved report the same postponement to a regulator, a colleague and a friend, and only one of the three belongs in a letter to a customer.",
      Affix:
        "A prefix or a suffix attached to a root. A prefix usually changes the direction or the polarity of the meaning, while a suffix usually changes the part of speech without touching the meaning much.",
      "Phrasal verb":
        "A verb joined to a particle, whose combined meaning cannot be recovered from the two words taken separately. To write off a loan involves no writing, and to wind up a company involves no winding.",
      Idiom:
        "A fixed expression whose meaning is settled by convention rather than by its parts, so that replacing a single word inside it destroys the expression rather than varying it.",
      "Word usage question":
        "A format that gives you one word and four sentences and asks in which sentence the word is used correctly. It therefore tests the grammatical pattern a word demands as much as it tests the meaning.",
    },
    body: {
      Beginner: `<p>You will not be asked what a word means. You will be shown a sentence with a gap, or a sentence in which one word may be misused, and asked to decide. That difference is the whole of this topic, because a word can be understood perfectly and still be the wrong choice for a particular sentence.</p>
<h2>Three words you will need</h2>
<ul>
<li>A <strong>root</strong> is the core of a word, usually borrowed from Latin or Greek, that carries its central idea.</li>
<li>A <strong>prefix</strong> sits in front of the root and changes its direction: pre means before, post means after, sub means under.</li>
<li>A <strong>suffix</strong> sits behind the root and changes what kind of word it is: govern is a verb, government is a noun, governmental is an adjective.</li>
</ul>
<h2>Why a list of a thousand words does not help much</h2>
<p>A list gives you a meaning. A question gives you four words of roughly the same meaning and asks which one this sentence accepts, so the list is only the first quarter of the work, and it is the quarter most candidates keep repeating.</p>
<h2>Three signals the sentence gives you before you read the options</h2>
<ol>
<li><strong>A definition signal.</strong> The sentence explains the word itself, usually just after a comma. A dormant account, one in which the customer has made no transaction for a long stretch, may be reactivated on request, and the meaning of dormant is sitting there in the sentence.</li>
<li><strong>A contrast signal.</strong> A word such as but, although, however or unlike tells you the gap holds the opposite of something already said. Although the scheme was announced with some noise, the response in the district was ______. After although the second half must disappoint, so muted fits and enthusiastic cannot.</li>
<li><strong>A consequence signal.</strong> Because, so and therefore tell you the gap continues in the same direction. The borrower had missed four instalments, so the branch treated the account as ______, which calls for overdue, not regular.</li>
</ol>
<h2>Break an unfamiliar word into pieces</h2>
<p>If the word incredulous stops you, split it. The root cred means believe, the prefix in means not, and the suffix ous makes it an adjective, so it describes somebody who does not believe. You will not always land on the exact shade, but you will land on the right side of the sentence, and that is where the mark is.</p>
<h2>Keep a word log rather than a word list</h2>
<p>For each new word write four things: the word, the sentence you met it in, whether it approves or disapproves, and one word it is confused with. Four lines a day is enough, and a log built that way can be revised in the last week when a column of five hundred bare meanings cannot.</p>
<h2>What a wrong answer costs</h2>
<p>A correct answer earns a mark and a wrong one takes away a quarter of a mark, so attempt a gap once you have honestly cut four options to two, and leave one where the sentence offers no signal at all.</p>`,
      Intermediate: `<p>Treat every vocabulary question as two steps that must happen in that order. First decide what the sentence needs, in your own words and without looking at the options. Then find the option that matches it. A candidate who reads the options first has handed the setter the power to suggest a meaning, and that is what the distractors were written to do.</p>
<h2>Four context signals, worked</h2>
<ol>
<li><strong>Restatement.</strong> The circular sought to <strong>streamline</strong> the sanction process, cutting the number of approvals from five to two. The second clause defines the first, so streamline means to simplify. Any option meaning to strengthen or to formalise is out, however respectable it sounds.</li>
<li><strong>Contrast.</strong> The urban branches reported a surge in current account openings, whereas the rural branches saw only a ______ increase. Whereas demands opposition, and the opposite of a surge is a small rise, so marginal or modest fits and substantial cannot.</li>
<li><strong>Cause and effect.</strong> Repeated failures in the settlement window <strong>eroded</strong> the confidence of merchants in the channel. Erode is gradual and negative, and the cause given is repeated failure, so the sense is a slow wearing away rather than a sudden collapse. An option meaning shattered has the right sign but the wrong speed.</li>
<li><strong>Example.</strong> The audit flagged several <strong>discretionary</strong> decisions, such as the waiver granted without a written note and the limit sanctioned above the branch head's own powers. The examples are decisions taken at somebody's personal judgement, so discretionary means left to individual judgement rather than fixed by rule.</li>
</ol>
<h2>Roots that pay for themselves</h2>
<table>
<thead><tr><th>Root</th><th>Sense</th><th>Words you will meet</th></tr></thead>
<tbody>
<tr><td>cred</td><td>believe</td><td>credible, credentials, incredulous, accredit</td></tr>
<tr><td>fid</td><td>trust</td><td>fiduciary, confide, bona fide, diffident</td></tr>
<tr><td>dict</td><td>say</td><td>verdict, dictate, contradict, jurisdiction</td></tr>
<tr><td>spec</td><td>look</td><td>inspect, prospectus, retrospect, conspicuous</td></tr>
<tr><td>ten, tain</td><td>hold</td><td>tenable, retain, sustain, tenure</td></tr>
<tr><td>tract</td><td>draw or pull</td><td>protract, retract, tractable, abstract</td></tr>
<tr><td>vert</td><td>turn</td><td>divert, revert, inadvertent, aversion</td></tr>
<tr><td>val</td><td>worth</td><td>valuation, evaluate, invaluable, prevalent</td></tr>
</tbody>
</table>
<p>Note invaluable, which the prefix appears to negate and does not: it means too valuable to be measured. Root reading gets you close, and the exceptions are few.</p>
<h2>What the prefix and the suffix each tell you</h2>
<p>The prefix carries direction: ante and pre are before, post is after, inter is between, intra is within, sub is under, super and supra are above, trans is across, retro is backward, contra and anti are against, mal is bad. The suffix carries part of speech: ance, ence, tion, ity and ment build nouns, ise and ify build verbs, ous, able and ive build adjectives. So when a filler asks for a noun and one option ends in ise, you have removed it without knowing what it means.</p>
<h2>Three tests, run in order</h2>
<ol>
<li><strong>Sign.</strong> Does the sentence want a positive word or a negative one? This alone usually removes two options.</li>
<li><strong>Strength.</strong> Does it want a mild word or a strong one? A sentence that says the growth slowed does not accept collapsed.</li>
<li><strong>Pattern.</strong> Does the word take the preposition and the object the sentence supplies? Averse takes to, immune takes to, devoid takes of, conducive takes to.</li>
</ol>
<h2>A worked elimination</h2>
<p>Sentence: the committee expressed a ______ about the proposal but allowed it to go forward with two conditions attached. Options: reservation, denunciation, endorsement, repudiation.</p>
<p>Sign first: but allowed it to go forward means the committee was not opposed outright, so the word is mildly negative. Endorsement is positive and dies. Strength second: denunciation and repudiation are both total rejections and cannot sit beside allowed it to go forward. Pattern third: you express a reservation about something, which is exactly the preposition the sentence supplies. The answer is reservation, reached without ever asking what repudiation means in the abstract.</p>`,
      Advanced: `<p>A second attempt is seldom lost on rare words. It is lost on pairs, where two options share a dictionary meaning and differ in exactly one of three ways: intensity, register, or the pattern the word demands. Learn to ask which of the three the setter is testing, and the pair stops being a coin toss.</p>
<h2>The three ways a near synonym is made wrong</h2>
<table>
<thead><tr><th>Difference</th><th>Pair</th><th>What separates them</th></tr></thead>
<tbody>
<tr><td>Intensity</td><td>concerned and alarmed</td><td>Both negative, but a sentence reporting a small slippage cannot support alarmed</td></tr>
<tr><td>Register</td><td>deferred and put off</td><td>Identical in meaning, opposite in formality, and only one belongs in a circular</td></tr>
<tr><td>Register</td><td>terminate and wind up</td><td>Wind up is the correct technical term for a company and the wrong term for a meeting</td></tr>
<tr><td>Pattern</td><td>averse and adverse</td><td>A person is averse to a step; conditions are adverse, and adverse takes no preposition</td></tr>
<tr><td>Pattern</td><td>comprise and consist</td><td>The board comprises nine members; the board consists of nine members</td></tr>
<tr><td>Sign</td><td>credible and credulous</td><td>A credible claim deserves belief; a credulous person believes too easily</td></tr>
<tr><td>Sign</td><td>officious and official</td><td>Officious means interfering, and it is not the adjective from office</td></tr>
</tbody>
</table>
<h2>Words carry a grammatical pattern, not only a meaning</h2>
<p>This is the half of vocabulary that a synonym list cannot teach and that the word usage format is built to test. Absolve takes from, abstain takes from, accede takes to, conducive takes to, devoid takes of, oblivious takes of, indicative takes of, contingent takes on, incumbent takes on, at variance takes with. When a question offers you two words of the same meaning, check which one the preposition in the sentence belongs to, because the setter has usually printed the preposition of the wrong one.</p>
<h2>The formats that test usage rather than meaning</h2>
<ul>
<li><strong>Word usage.</strong> One word, four sentences, and you name the sentence in which it is correctly used. The three wrong sentences are usually grammatical, so you are deciding on pattern and sense, not on grammar.</li>
<li><strong>Word swap.</strong> Two words in a sentence have exchanged places and you restore them. Find the noun that cannot be the object of its verb, and its partner is the other half of the swap.</li>
<li><strong>Phrase replacement.</strong> An underlined phrase with three replacements and a no change option. The trap is a replacement that improves the style while breaking the tense or the parallel.</li>
<li><strong>Odd one out.</strong> Four words, three of which share a shade the fourth does not. Sort by sign first, then by intensity, and the outlier appears without any need to define all four.</li>
</ul>
<h2>Phrasal verbs are a register test in disguise</h2>
<table>
<thead><tr><th>Phrasal verb</th><th>Meaning</th><th>Formal equivalent</th></tr></thead>
<tbody>
<tr><td>roll out</td><td>begin offering across a network</td><td>introduce, launch</td></tr>
<tr><td>phase out</td><td>withdraw in stages</td><td>discontinue progressively</td></tr>
<tr><td>write off</td><td>remove an unrecoverable asset from the books</td><td>charge off</td></tr>
<tr><td>step down</td><td>leave a post voluntarily</td><td>resign, demit office</td></tr>
<tr><td>crack down on</td><td>enforce against, severely</td><td>take strict action against</td></tr>
<tr><td>do away with</td><td>abolish</td><td>dispense with, rescind</td></tr>
</tbody>
</table>
<p>Two of these carry a trap worth naming. Write off is not write down: writing down reduces the carrying value of an asset that stays on the books, while writing off removes it. Stepping down is voluntary, and a candidate who uses it for a removal has changed the fact rather than the tone.</p>
<h2>What goes wrong on the job</h2>
<p>Register failures are the ones customers notice. A letter that says your request has been turned down reads as a personal refusal, while your request could not be acceded to reads as a decision under rules, and the second is what a branch means. The vocabulary you are being tested on is the vocabulary the job runs on, which is why the paper sets it in sentences rather than in lists.</p>`,
      Expert: `<p>Last month recall sheet. Sign first, then strength, then pattern, and only then the meaning you carry in your head.</p>
<h2>Intensity ladders, mild to strong</h2>
<ul>
<li>Doubt: reservation, misgiving, objection, protest, outcry</li>
<li>Praise: acknowledge, commend, laud, extol</li>
<li>Criticism: measured, pointed, scathing, damning</li>
<li>Reduction: trim, curtail, slash, gut</li>
<li>Rise: edge up, rise, surge, spiral</li>
<li>Unwillingness: hesitant, reluctant, averse, opposed</li>
<li>Uncertainty: unclear, ambiguous, opaque, inscrutable</li>
</ul>
<h2>Confusable pairs that decide a single mark</h2>
<table>
<thead><tr><th>Pair</th><th>The distinction in one line</th></tr></thead>
<tbody>
<tr><td>principal and principle</td><td>Principal is the chief person or the sum lent; principle is a rule</td></tr>
<tr><td>eminent and imminent</td><td>Eminent is distinguished; imminent is about to happen</td></tr>
<tr><td>economic and economical</td><td>Economic relates to the economy; economical means thrifty</td></tr>
<tr><td>continual and continuous</td><td>Continual repeats with breaks; continuous never stops</td></tr>
<tr><td>judicial and judicious</td><td>Judicial belongs to a court; judicious means showing good judgement</td></tr>
<tr><td>deprecate and depreciate</td><td>Deprecate disapproves; depreciate loses value</td></tr>
<tr><td>ingenious and ingenuous</td><td>Ingenious is clever; ingenuous is innocently frank</td></tr>
<tr><td>elicit and illicit</td><td>Elicit draws out a response; illicit is unlawful</td></tr>
<tr><td>council and counsel</td><td>A council is a body; counsel is advice or a lawyer</td></tr>
<tr><td>stationary and stationery</td><td>Stationary is not moving; stationery is paper and pens</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Decide the sign of the gap before you read a single option, and write the sign in the margin if it helps.</li>
<li>A word that fits the meaning but not the preposition is wrong, and the preposition is printed in the question for exactly that reason.</li>
<li>In an odd one out set, sort by sign first; the outlier is usually the one with the opposite sign, not the rarest word.</li>
<li>A phrasal verb in a formal sentence is almost always the distractor, unless the sentence is quoting speech.</li>
<li>Root reading tells you the side of the sentence, not the shade. Use it to eliminate, not to select.</li>
</ul>
<h2>Final fortnight drill</h2>
<ol>
<li>Read one editorial a day and mark every word you could not have produced yourself. Log four of them in the four field format and drop the rest.</li>
<li>Twenty word usage questions a day, with the pattern written beside each answer: which preposition, which object, which register.</li>
<li>Revise only your own log in the last week. A word you met in a sentence you remember is retrievable; a word you met in a column of five hundred is not.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Despite the branch's steady deposit growth, the auditor described its lending record as ______, pointing to three large accounts that had turned bad inside a year.",
        options: ["meticulous", "lacklustre", "prudent", "exemplary"],
        answer: 1,
        explanation:
          "Despite announces a reversal and the three bad accounts confirm it, so the gap needs a word critical of the lending record, which lacklustre supplies. Prudent is the most attractive wrong answer because prudence is the standard virtue of a lending officer, but it praises the record that the second half of the sentence has just condemned.",
        difficulty: "Easy",
        skill: "Inference from context",
      },
      {
        n: 2,
        question:
          "The root cred, shared by credible, credentials and incredulous, carries which sense?",
        options: ["to count", "to record", "to believe", "to lend"],
        answer: 2,
        explanation:
          "Cred comes from the Latin verb meaning to believe, which is why credentials are papers asking to be believed and an incredulous listener is one who does not believe. To lend is the tempting choice because credit is a lending word, but the lending sense is a later commercial growth from the idea of trusting a borrower.",
        difficulty: "Easy",
        skill: "Roots, prefixes and suffixes",
      },
      {
        n: 3,
        question: "Which of these words expresses the mildest degree of disagreement?",
        options: ["outcry", "protest", "reservation", "objection"],
        answer: 2,
        explanation:
          "A reservation is a partial and usually private doubt that leaves the proposal alive, which places it at the bottom of the ladder. Objection is the near miss because it is also measured in tone, but an objection is stated against the proposal and blocks it, whereas a reservation can be recorded while the proposal proceeds.",
        difficulty: "Medium",
        skill: "Connotation and intensity",
      },
      {
        n: 4,
        question:
          "A letter to a customer must say that a meeting has been moved to a later date. Which word replaces put off?",
        options: ["deferred", "shelved", "called off", "dumped"],
        answer: 0,
        explanation:
          "Deferred is the formal equivalent of put off and keeps the meaning of a later date, which is what the letter has to report. Called off is the trap because it is formal enough for a letter, but it says the meeting will not happen at all, so it changes the fact rather than the register.",
        difficulty: "Medium",
        skill: "Register and formality",
      },
      {
        n: 5,
        question:
          "The bank decided to ______ the loan after every recovery effort had been exhausted.",
        options: ["write up", "write down", "write off", "write out"],
        answer: 2,
        explanation:
          "To write off a loan is to remove it from the books as unrecoverable, which is what exhausting every recovery effort leads to. Write down is the near miss and is a real banking term, but it only reduces the carrying value of an asset that remains on the books, so it describes a partial provision rather than a final removal.",
        difficulty: "Medium",
        skill: "Phrasal verbs and idioms",
      },
      {
        n: 6,
        question: "In which sentence is the word liable used correctly?",
        options: [
          "The branch was liable to receive the new software last month.",
          "The guarantor is liable for the outstanding amount if the borrower defaults.",
          "She is liable in mathematics and teaches it at the centre.",
          "The scheme is liable of misuse by intermediaries.",
        ],
        answer: 1,
        explanation:
          "Liable for names legal responsibility for an amount, which is exactly the guarantor's position, and it is the pattern the word takes with a sum of money. The first sentence is the tempting one because liable to is a genuine pattern, but it means likely to and is used of an undesirable outcome, not of a delivery that was expected.",
        difficulty: "Hard",
        skill: "Word usage question type",
      },
      {
        n: 7,
        question:
          "The report was ______ in its criticism of the branch, stopping short of naming any officer.",
        options: ["scathing", "measured", "vitriolic", "damning"],
        answer: 1,
        explanation:
          "Stopping short of naming anyone signals restraint, so the gap needs a mild word and measured is the only mild option on the list. Damning is the strongest temptation because a critical report is often damning, but a damning report leaves no one protected, which contradicts the second half of the sentence.",
        difficulty: "Medium",
        skill: "Connotation and intensity",
      },
    ],
  },
  30721: {
    topicId: 30721,
    title: "Six months of current affairs, revised in three passes",
    summary:
      "Current affairs is the only part of this examination where the work is done months before the paper and the marks are collected in thirty five minutes, so the question is not what you read but what you can still retrieve. You build a six month window, a fixed set of buckets, a four field note and a three pass revision cycle whose time cost you can calculate in advance.",
    concepts: [
      "The six month window",
      "Three pass revision cycle",
      "Category buckets",
      "Source discipline",
      "Static hooks",
      "The four field note",
    ],
    glossary: {
      "Current affairs window":
        "The stretch of months before a paper from which a setter can draw. It is bounded at the far end by items that have already been asked in earlier cycles and at the near end by the weeks a paper needs to be finalised, so the last few weeks before an examination are thinly represented.",
      Capsule:
        "One month of items compiled into a single document arranged by category rather than by date. The capsule, not the day's newspaper, is what you revise, because a document sorted by date cannot be tested by category.",
      "Static hook":
        "The permanent fact a news item hangs on: the ministry that administers a scheme, the body that publishes an index, the headquarters of an institution. The item passes out of the window; the hook is asked again in later cycles.",
      Bucket:
        "A fixed category into which an item is filed on the day you record it. Buckets exist so that recall at revision time runs by category, which is how the paper asks, rather than by date, which is how you read.",
      "Active recall":
        "Testing yourself on an item with the answer covered, as opposed to reading the item again. Re-reading feels faster and is the reason a candidate who has read six capsules four times still misses the question.",
      "Spaced revision":
        "Revisiting an item at widening intervals rather than in one long sitting, so that each visit costs less time than the one before it and the item survives to the examination hall.",
    },
    body: {
      Beginner: `<p>Current affairs means events of the recent past that the paper can ask about: who was appointed to which post, which scheme a ministry announced, which country signed an agreement with India, which body published which report. It is not general knowledge in the school sense and it is not history.</p>
<h2>Where in this examination it appears</h2>
<p>The preliminary examination has no awareness section at all. It appears only in the main examination, where it is a separate section with its own clock, and it is the one section that carries no calculation and no reading passage. A question is answered in ten seconds if you know it and in no seconds if you do not, which is unlike every other section on the paper.</p>
<h2>Why six months and not two years</h2>
<p>A paper is prepared some weeks before candidates sit for it, so the newest events rarely appear. Older events are usually already spent, because they were asked in an earlier cycle. What is left is a window of roughly six months, ending about a month before the examination. Reading two years of news does not double your marks; it doubles your revision time.</p>
<h2>File every item into one of six buckets</h2>
<ul>
<li><strong>Appointments and resignations:</strong> who took charge where, and of which body.</li>
<li><strong>Banking and economy:</strong> anything a regulator, a bank or a ministry of finance did.</li>
<li><strong>Schemes and programmes:</strong> the name, the ministry, and who the beneficiary is.</li>
<li><strong>Reports, indices and rankings:</strong> which body publishes it and what it measures.</li>
<li><strong>Agreements, summits and defence:</strong> who met whom, where, and about what.</li>
<li><strong>Awards, sports, books and obituaries:</strong> the small bucket that still carries marks.</li>
</ul>
<h2>Write four lines, not a paragraph</h2>
<p>For every item record only four things: what happened, which body or person did it, the number attached to it if there is one, and the permanent fact it hangs on, such as the ministry that runs the scheme. A paragraph copied from a newspaper cannot be revised in the last week. Four lines can.</p>
<h2>Fifteen minutes a day, and one source</h2>
<p>Fifteen minutes a day, taken at the same time every day, is enough for the first reading. Use one compilation and one newspaper, and no more. Following four sources gives you the same items four times over and convinces you that you have studied four times as much.</p>`,
      Intermediate: `<p>This section is worth measuring rather than worrying about. In the officer main examination the awareness section sets forty questions for forty marks on a thirty five minute clock of its own, which is fifty two seconds a question, and a question you know takes ten. In the clerical main examination the same section is larger and equally quick. That gap between what the paper allows and what a prepared candidate spends is the whole argument for the system below.</p>
<h2>The three passes, and what each one costs</h2>
<table>
<thead><tr><th>Pass</th><th>When</th><th>Unit</th><th>Time cost</th></tr></thead>
<tbody>
<tr><td>First</td><td>Daily, as the month happens</td><td>The day's items, written as four field notes</td><td>Fifteen minutes a day, so seven and a half hours across a month</td></tr>
<tr><td>Second</td><td>The last two days of each month</td><td>That month's capsule, by bucket</td><td>About one hundred and twenty items at twenty seconds each, which is forty minutes</td></tr>
<tr><td>Third</td><td>The three weeks before the paper</td><td>All six capsules, tested and not read</td><td>Seven hundred and twenty items at about eight seconds each, which is roughly an hour and a half a sweep</td></tr>
</tbody>
</table>
<p>Work the arithmetic once and the plan stops feeling heavy. Six months at about a hundred and twenty items a month is seven hundred and twenty items in total. Three sweeps of the whole stock in the last three weeks cost about four and a half hours, which is less than a single mock paper with its analysis. The reason candidates find current affairs endless is not the volume. It is that they do the first pass five times and the third pass never.</p>
<h2>The four field note, worked</h2>
<p>Take an item of the form: a public sector bank has been permitted by the regulator to open a specialised branch for a particular class of borrower. The note is not the sentence. It is four fields.</p>
<table>
<thead><tr><th>Field</th><th>What goes in it</th></tr></thead>
<tbody>
<tr><td>What</td><td>Permission to open a specialised branch</td></tr>
<tr><td>Who</td><td>The regulator that granted it, and the bank that received it</td></tr>
<tr><td>Number</td><td>Only if the item carries one worth asking, such as a count of branches</td></tr>
<tr><td>Static hook</td><td>The head office city of that bank, the section of the law the permission runs under, the regulator's own statutory role</td></tr>
</tbody>
</table>
<p>The fourth field is the one that separates a candidate who scores in this section from one who reads it. The event passes out of the window in six months. The hook does not, and the hook is what a later paper asks.</p>
<h2>Revise by bucket, never by date</h2>
<p>A paper asks about appointments together, indices together, summits together. If your notes are arranged by date, then answering an appointment question requires you to walk through six months of days. Sort every capsule by bucket on the day you compile it, and the second and third passes become a vertical read of one category at a time, which is also how gaps become visible: a bucket with four entries in a month is a bucket you have not been reading.</p>
<h2>Test, do not read</h2>
<p>In the second and third passes, cover the right hand column and say the answer aloud before you uncover it. Reading a capsule for the fourth time produces a strong feeling of familiarity and almost no retrieval. The test is uncomfortable and it is the only part of the cycle that puts an item into the examination hall with you.</p>`,
      Advanced: `<p>On a second attempt the marks in this section are usually lost in one of three ways: the item was read but never filed, the item was filed but tested from a side you had not recorded, or the item was one of four hundred duplicates that ate the time the rest needed. Each has a fix.</p>
<h2>The paper asks from the static side</h2>
<p>A setter rarely asks the news itself, because the news is what everybody has read. The question is built on the fact standing behind the news. If a scheme was in the headlines, the question is which ministry administers it, or which year it was launched in, or which category of beneficiary it names. If an index was published, the question is which body publishes it and what it measures, not which country stood third. Record the hook when you record the item, because you will never go back for it.</p>
<h2>Verb discipline: announced, approved, launched, notified</h2>
<p>These four words are not interchangeable and a well written question turns on the difference. A proposal announced in a speech may not yet exist. A proposal approved by a cabinet has cleared its authority but may not be in operation. A scheme launched is running. A rule notified has been published in the official gazette and has legal effect from the date stated in it. When you write the note, keep the verb that the source used, because changing it changes the answer.</p>
<h2>Source discipline, with the arithmetic</h2>
<p>Suppose you follow three monthly compilations. Each carries about a hundred and twenty items, of which perhaps a hundred are the same items in different words. Your stock is now three hundred and sixty entries covering roughly a hundred and forty distinct facts. Your revision cost has tripled and your coverage has risen by about a sixth, and that sixth is made of the rarest items, which are the ones a paper is least likely to set. Choose one compilation and one newspaper, and spend the time you save on the third pass instead.</p>
<h2>What is worth skipping</h2>
<ul>
<li>Exact scores, exact ranks below the first three, and exact rupee figures that no sensible question would turn on.</li>
<li>Items about internal reorganisation inside a private company with no regulatory angle.</li>
<li>Long analytical pieces. They are excellent for the descriptive paper and the interview and they are not where objective questions come from.</li>
<li>Anything more than about seven months old, unless it is a static hook, in which case it has left the current affairs stock and joined the permanent one.</li>
</ul>
<h2>Sectional timing changes what a fast section is worth</h2>
<p>In the main examination each section carries its own clock, so time saved in awareness cannot be moved to data interpretation. That is not an argument for going slowly. It is an argument for using the surplus inside the section: answer the forty questions you know in about twelve minutes, then spend the remaining time on the ones you half know, because in a sectionally timed paper the alternative to that spending is not saving, it is losing the time.</p>
<h2>The marks this actually moves</h2>
<p>Suppose you answer thirty questions correctly and get six wrong in a forty question awareness section. Negative marking takes a quarter of a mark for each wrong answer, so six wrong answers cost one and a half marks and you score twenty eight and a half. A candidate with the same reading but no third pass typically converts about twenty of those. Eight and a half marks in a section that takes no calculation is the largest single return available anywhere on the paper for the hours it costs.</p>
<h2>The same notes serve the interview</h2>
<p>The board asks about your own district and about the banking events of the last few months. The four field note is already the answer format: what happened, who did it, the number if there is one, and the standing fact behind it. Add one line of your own opinion to any item concerning banking, because the board asks what you think, and a candidate who can only recite the item is visibly reciting.</p>`,
      Expert: `<p>Last three weeks. The reading is finished. What follows is a retrieval schedule.</p>
<h2>Bucket checklist, run vertically</h2>
<ol>
<li>Appointments and resignations: post, body, and whether the post is statutory or not.</li>
<li>Banking and economy: regulator actions, licences, mergers, policy statements, committee reports.</li>
<li>Schemes and programmes: name, ministry, beneficiary, and whether it is central, centrally sponsored or state run.</li>
<li>Reports, indices and rankings: publishing body, what is measured, and India's position only where it is prominent.</li>
<li>Agreements, summits and defence: parties, venue, subject, and the exercise or system name.</li>
<li>Awards, sports, books and obituaries: category, field, and the one line of identification.</li>
</ol>
<h2>The last twenty one days</h2>
<table>
<thead><tr><th>Days</th><th>What you do</th><th>Time</th></tr></thead>
<tbody>
<tr><td>21 to 15</td><td>Sweep one: all six capsules, tested by bucket, marking every miss</td><td>About ninety minutes a day for four days</td></tr>
<tr><td>14 to 8</td><td>Sweep two: only the marked items, plus the static hooks column read in full</td><td>Under an hour a day</td></tr>
<tr><td>7 to 2</td><td>Sweep three: the twice marked items and one full bucket a day, cold</td><td>Thirty to forty minutes a day</td></tr>
<tr><td>Day 1</td><td>Your own miss page only. No new material of any kind</td><td>Thirty minutes</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>The window is about six months and closes roughly a month before the paper. Items from the last three weeks are worth reading and not worth memorising.</li>
<li>An item without its static hook is half an item, and the half you recorded is the half that expires.</li>
<li>Sort by bucket on the day you compile, because you will not re-sort in the last week.</li>
<li>Keep the source's verb. Announced, approved, launched and notified are four different states of the same proposal.</li>
<li>Cover the answer and say it aloud. Re-reading is not revision, it is recognition.</li>
<li>One compilation and one newspaper. A second compilation buys you the rarest sixth of the items at three times the revision cost.</li>
<li>Two consecutive misses on an item mean the note is badly written, not that the item is hard. Rewrite the note in four fields.</li>
</ul>
<h2>The miss page</h2>
<p>Keep one page across all six months, holding only the items you have failed twice. By the final week it typically runs to sixty or seventy entries, which is a fifteen minute read. That page, and not any capsule, is what you carry to the centre, because it is the only document in your possession that is built entirely out of your own gaps.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "For a main examination awareness section, which is the most defensible working window for current affairs?",
        options: [
          "the twelve months ending on the day of the examination",
          "the six months ending about a month before the examination",
          "the three months ending on the day of the examination",
          "the calendar year in which the notification was published",
        ],
        answer: 1,
        explanation:
          "A paper is finalised some weeks before it is taken, so the newest events are thinly represented, and items older than about six months have usually been asked in an earlier cycle. The twelve month window is the tempting choice because a wider net feels safer, but it roughly doubles the revision load in exchange for the items a setter is least likely to reach for.",
        difficulty: "Medium",
        skill: "The six month window",
      },
      {
        n: 2,
        question:
          "Your monthly capsule holds about one hundred and twenty items, and your second pass runs at an average of twenty seconds an item. How long does one capsule take?",
        options: [
          "about twenty minutes",
          "about forty minutes",
          "about one hour",
          "about two hours",
        ],
        answer: 1,
        explanation:
          "One hundred and twenty items at twenty seconds each is two thousand four hundred seconds, which is forty minutes exactly. An hour is the tempting estimate because a month of news feels larger than it is, and that overestimate is the usual reason a candidate never schedules the second pass at all.",
        difficulty: "Easy",
        skill: "Three pass revision cycle",
      },
      {
        n: 3,
        question:
          "An item reports that a new chairperson has taken charge at a financial sector regulator. Which bucket does it belong in?",
        options: [
          "schemes and programmes",
          "reports and indices",
          "appointments and resignations",
          "summits and agreements",
        ],
        answer: 2,
        explanation:
          "The event is a person taking charge of a post, which is what the appointments bucket exists for, and filing it there lets you revise every appointment of six months in one vertical read. Banking and economy is the attractive alternative because the body is a financial regulator, but filing by subject rather than by event type scatters appointments across every bucket and destroys the vertical read.",
        difficulty: "Easy",
        skill: "Category buckets",
      },
      {
        n: 4,
        question:
          "An item reports that a state has topped a particular index published by a central body. Which accompanying fact is most worth recording in your note?",
        options: [
          "the exact score the state recorded",
          "the body that publishes the index and what the index measures",
          "the rank held by every state in the list",
          "the date on which the press release was issued",
        ],
        answer: 1,
        explanation:
          "The publisher and the subject of the index are static facts that outlive this cycle and are asked again in later ones, which is exactly what a static hook is for. The exact score is the tempting record because it looks precise, but a score is the kind of figure a paper rarely sets and one you will not retrieve six months later.",
        difficulty: "Medium",
        skill: "Static hooks",
      },
      {
        n: 5,
        question:
          "You follow three monthly compilations as well as two daily news applications. What does that mainly cost you?",
        options: [
          "a clearer sense of which items matter most",
          "near duplicate entries that inflate the stock without adding facts, so revision time multiplies while recall does not",
          "nothing, because more coverage is always better",
          "the ability to write a descriptive answer on a current topic",
        ],
        answer: 1,
        explanation:
          "Three compilations of about a hundred and twenty items each yield roughly a hundred and forty distinct facts, so the stock triples while the coverage rises by about a sixth. The insurance argument is the tempting one, since a second compilation does catch an item the first missed, but those catches are the rarest items and the price is paid out of the third pass, which is where the marks actually come from.",
        difficulty: "Medium",
        skill: "Source discipline",
      },
      {
        n: 6,
        question:
          "Which set of fields makes a current affairs note answerable in a paper months later?",
        options: [
          "the headline and the date you read it",
          "a two line summary written in your own words",
          "what happened, the body or person that did it, the number attached to it, and the static fact it hangs on",
          "the source name and the page reference for checking later",
        ],
        answer: 2,
        explanation:
          "Those four fields match the four ways a setter can ask about an item, and the fourth field is the one that survives after the event leaves the six month window. A summary in your own words is the attractive alternative because it feels like understanding, but it usually drops the administering body and the standing fact, which are precisely the parts a question is built on.",
        difficulty: "Medium",
        skill: "The four field note",
      },
      {
        n: 7,
        question:
          "In the third pass you sweep all six capsules, about seven hundred and twenty items, at roughly eight seconds an item. How long is one full sweep?",
        options: [
          "about forty five minutes",
          "about an hour and a half",
          "about three hours",
          "about four hours",
        ],
        answer: 1,
        explanation:
          "Seven hundred and twenty items at eight seconds each is five thousand seven hundred and sixty seconds, which is ninety six minutes, so a little over an hour and a half. Three hours is the intuitive guess and it is the estimate that makes candidates abandon the third pass, when the true cost of three complete sweeps is under five hours.",
        difficulty: "Medium",
        skill: "Three pass revision cycle",
      },
    ],
  },
  30722: {
    topicId: 30722,
    title: "Computer awareness for the mains section",
    summary:
      "Computer aptitude in this examination is a knowledge section, not a programming section, and it is answered from a small stock of definitions, one memory hierarchy, two number systems and a short list of distinctions the setter returns to every cycle. You build that stock, work the conversions the way a candidate does them under a clock, and learn the pairs that decide the marks.",
    concepts: [
      "Hardware and the memory hierarchy",
      "Number systems and storage units",
      "Operating system and file handling",
      "Networking and the internet",
      "Security threats and safe banking",
      "Office applications and shortcuts",
    ],
    glossary: {
      "Volatile memory":
        "Memory that holds its contents only while power is supplied. Main memory is volatile, so an unsaved document is lost when the machine switches off, while a disk keeps its contents without power.",
      "Cache memory":
        "A small and very fast memory placed between the processor's own registers and main memory, holding the instructions and data most recently used so that the processor waits less often for main memory to answer.",
      Byte:
        "A group of eight bits, and the unit in which storage is counted. A kilobyte is one thousand and twenty four bytes rather than one thousand, because the counting runs in powers of two.",
      Protocol:
        "An agreed set of rules that two machines follow so that data sent by one is understood by the other. HTTP carries web pages, SMTP sends mail, and FTP transfers files.",
      Phishing:
        "Fraud in which a message imitating a trusted institution asks the recipient to enter credentials on a page the fraudster controls. Nothing is broken into; the customer is persuaded to hand over the key.",
      Booting:
        "The sequence a computer runs when it is switched on, in which a small program held in non-volatile memory locates the operating system and loads it into main memory so that the machine becomes usable.",
    },
    body: {
      Beginner: `<p>This section asks what parts a computer has, what each part does and what the common words mean. It does not ask you to write a program. If you have used a computer at a service centre or a browsing centre, you already know more of it than you think.</p>
<h2>The four things a computer does</h2>
<ul>
<li><strong>Input:</strong> you give it something, through a keyboard, a mouse, a scanner or a fingerprint reader.</li>
<li><strong>Processing:</strong> the central processing unit, the CPU, does the work. It is the part people call the brain of the machine.</li>
<li><strong>Output:</strong> it shows you the result, on a monitor or through a printer.</li>
<li><strong>Storage:</strong> it keeps the result, on a hard disk, a solid state drive or a pen drive.</li>
</ul>
<h2>Hardware and software</h2>
<p><strong>Hardware</strong> is anything you can touch: the monitor, the keyboard, the printer. <strong>Software</strong> is the set of instructions that tells the hardware what to do. Software comes in two kinds. System software runs the machine itself, and the operating system such as Windows, Linux or Android is the main example. Application software does a job for you, such as a word processor or a browser.</p>
<h2>Two kinds of memory, and why the difference matters</h2>
<p><strong>RAM</strong> is the working memory. Whatever you are doing right now sits there, and it empties the moment power goes. That is why an unsaved document disappears in a power cut, and the word for this behaviour is <strong>volatile</strong>. <strong>ROM</strong> holds instructions the machine needs to start itself and does not empty. A hard disk is neither: it is storage, larger and slower than RAM, and it keeps what you put on it.</p>
<h2>How storage is counted</h2>
<p>The smallest unit is a <strong>bit</strong>, which is a single zero or one. Eight bits make a <strong>byte</strong>, and one byte holds about one character. From there each step multiplies by one thousand and twenty four: a kilobyte, a megabyte, a gigabyte, a terabyte. The multiplier is not one thousand, and questions are set on exactly that point.</p>
<h2>Words you will see in every paper</h2>
<ul>
<li>An <strong>operating system</strong> manages the hardware and lets several programs run at once.</li>
<li>A <strong>browser</strong> is the application that opens web pages, such as Chrome or Firefox.</li>
<li>A <strong>virus</strong> is harmful software that attaches itself to a file and spreads when that file is run.</li>
<li>A <strong>file extension</strong> is the tail of a file name that says what kind of file it is: docx for a document, xlsx for a spreadsheet, pdf for a fixed page, exe for a program.</li>
</ul>
<h2>Why this section is worth doing early</h2>
<p>It is small, it is stable from cycle to cycle, and it needs no calculation. Learn the list of parts, the memory words and the units in your first fortnight, revise them in ten minutes a week, and the section keeps paying without asking for more of your time.</p>`,
      Intermediate: `<p>Two facts shape how you should prepare this section. It is a knowledge test, so the return comes from precision rather than from understanding. And it is small, so the correct target is complete coverage of a short syllabus rather than deep coverage of part of it.</p>
<h2>The memory hierarchy, fastest first</h2>
<table>
<thead><tr><th>Level</th><th>Where it sits</th><th>Volatile</th><th>Note</th></tr></thead>
<tbody>
<tr><td>Register</td><td>Inside the processor</td><td>Yes</td><td>The fastest and the smallest, holding the operand being worked on</td></tr>
<tr><td>Cache</td><td>On or beside the processor</td><td>Yes</td><td>Recently used instructions and data, in levels usually numbered one to three</td></tr>
<tr><td>Main memory, RAM</td><td>On the board</td><td>Yes</td><td>The working area for everything currently running</td></tr>
<tr><td>Solid state or hard disk</td><td>Secondary storage</td><td>No</td><td>Keeps data without power, and is addressed as files rather than as bytes</td></tr>
<tr><td>Optical or tape</td><td>Tertiary storage</td><td>No</td><td>Slowest, used for archives and backups</td></tr>
</tbody>
</table>
<p>Speed falls and capacity rises as you go down. Cost per byte falls with it, which is the reason the hierarchy exists at all rather than one large fast memory.</p>
<h2>Number systems, worked the way you will do it</h2>
<p>Convert the decimal number 45 into binary by dividing by two and reading the remainders upward. Forty five by two is twenty two remainder one; twenty two by two is eleven remainder zero; eleven by two is five remainder one; five by two is two remainder one; two by two is one remainder zero; one by two is zero remainder one. Reading the remainders from the last to the first gives 101101. Check it by place value: thirty two plus eight plus four plus one is forty five.</p>
<p>Now take that binary number to the other two bases without going back to decimal. For octal, group the bits in threes from the right: 101 and 101, which are five and five, so the answer is 55 in octal. Check: five eights plus five is forty five. For hexadecimal, group in fours from the right and pad on the left: 0010 and 1101, which are two and thirteen, and thirteen is written D, so the answer is 2D. Check: two sixteens plus thirteen is forty five.</p>
<p>That grouping trick is the whole examination technique here. Going through decimal every time is where candidates lose the seconds this section is supposed to save them.</p>
<h2>Storage arithmetic</h2>
<p>Each step is a multiplier of one thousand and twenty four, so one megabyte is one thousand and twenty four kilobytes. A file system that allocates space in blocks of four kilobytes therefore fits two hundred and fifty six blocks into one megabyte, because one thousand and twenty four divided by four is two hundred and fifty six. Similarly, two kilobytes is two multiplied by one thousand and twenty four bytes, and multiplying by eight gives sixteen thousand three hundred and eighty four bits.</p>
<h2>The generations, in one line each</h2>
<ul>
<li>First: vacuum tubes, machine language, very large and very hot.</li>
<li>Second: transistors, assembly language, smaller and more reliable.</li>
<li>Third: integrated circuits, high level languages, the beginning of the operating system.</li>
<li>Fourth: microprocessors and very large scale integration, the personal computer.</li>
<li>Fifth: ultra large scale integration and work associated with artificial intelligence.</li>
</ul>
<h2>What the operating system actually does</h2>
<p>It manages the processor, memory, devices and files, and it allocates all of them among the programs that are running. It is not a translator: turning a high level program into machine code is the work of a compiler, which translates the whole program at once, or an interpreter, which translates and runs one statement at a time. An assembler is the translator for assembly language. Questions in this area are almost always built on that separation.</p>
<h2>The words the paper uses for the network</h2>
<p>A local area network covers one building, a metropolitan area network a city, and a wide area network any distance beyond that. Data travels according to protocols: HTTP for web pages, HTTPS for the same traffic encrypted, SMTP to send mail, POP and IMAP to receive it, and FTP for files. An IP address identifies a machine, and a domain name system translates a readable name into that address so that you do not have to remember numbers.</p>`,
      Advanced: `<p>The syllabus here is small enough that coverage is not the problem. The marks turn on a short list of pairs, each of which is set as two of the four options in a single question. Work the pairs and this section stops costing you anything.</p>
<h2>The pairs the setter keeps returning to</h2>
<table>
<thead><tr><th>Pair</th><th>The distinction that decides the option</th></tr></thead>
<tbody>
<tr><td>RAM and ROM</td><td>Both are primary memory. RAM is volatile and read and written freely; ROM is non-volatile and holds the start up instructions</td></tr>
<tr><td>Cache and register</td><td>The register is inside the processor and holds the current operand; cache sits beside it and holds what was recently used</td></tr>
<tr><td>Compiler and interpreter</td><td>A compiler translates the whole program once and produces an object file; an interpreter translates and executes one statement at a time and produces none</td></tr>
<tr><td>Virus and worm</td><td>A virus needs a host file and a user action; a worm replicates itself across a network with neither</td></tr>
<tr><td>Trojan and virus</td><td>A trojan does not replicate at all; it is admitted by the user because it appears to be a legitimate program</td></tr>
<tr><td>Switch and router</td><td>A switch forwards frames inside one network using hardware addresses; a router forwards packets between networks using IP addresses</td></tr>
<tr><td>Primary key and foreign key</td><td>A primary key identifies a row in its own table and cannot be null; a foreign key points at the primary key of another table</td></tr>
<tr><td>DDL and DML</td><td>Create, alter, drop and truncate define the structure; insert, update, delete and select work on the rows inside it</td></tr>
</tbody>
</table>
<h2>Devices, placed at their layer</h2>
<p>A repeater and a hub work at the physical layer and simply pass signals on, so a hub sends every frame to every port. A bridge and a switch work at the data link layer and use hardware addresses, so a switch sends a frame only to the port that needs it. A router works at the network layer and uses IP addresses to move packets between different networks. A gateway translates between systems that do not share a protocol and therefore operates across all the layers. Learn the layer with the device, because the question usually asks for both.</p>
<h2>Addressing, in the form the paper asks it</h2>
<p>An IPv4 address is thirty two bits, written as four decimal numbers separated by full stops, each between zero and two hundred and fifty five. An IPv6 address is one hundred and twenty eight bits, written as eight groups of hexadecimal digits separated by colons. The reason for the second is exhaustion of the first, and a question that offers sixty four bits for IPv6 is testing whether you learnt the number or the story.</p>
<h2>A spreadsheet question, worked</h2>
<p>You enter a formula multiplying cell A2 by cell B2 into cell C2, and copy it down to C5. Because both references are relative, they shift by the same three rows, so C5 multiplies A5 by B5. If you had fixed a reference by placing a dollar sign before the column letter and before the row number, that part would not shift at all, and copying down would keep pointing at the same cell. This one distinction, relative against absolute, accounts for most of the spreadsheet questions this paper sets, and the rest are shortcuts.</p>
<h2>Fraud, by the channel it arrives on</h2>
<ul>
<li><strong>Phishing</strong> arrives as an email or a message with a link to a page imitating the bank.</li>
<li><strong>Vishing</strong> is the same fraud conducted by voice call, usually with an urgent story about a blocked card.</li>
<li><strong>Smishing</strong> is the same fraud by text message.</li>
<li><strong>Pharming</strong> needs no message at all: it corrupts name resolution so that a correctly typed address opens a false site.</li>
<li><strong>Keylogging</strong> records what is typed, which is why a virtual keyboard is offered on a banking login page.</li>
<li><strong>Ransomware</strong> encrypts files and demands payment for the key, and it spreads most often through an attachment somebody opened.</li>
</ul>
<h2>What goes wrong on the job</h2>
<p>Every one of these becomes a branch problem rather than a definition. A customer calls to say a card has been blocked and a caller asked for the one time password to unblock it: no bank asks for that password, and the entire fraud rests on the customer not knowing it. A teller opens an attachment from what appears to be a regional office address and the branch loses a morning. A shared login makes an audit trail useless, because the system can only report the account that acted, not the person. The section is set the way it is because a bank officer works inside a core banking system all day and is expected to understand what the system is doing.</p>`,
      Expert: `<p>Last month recall sheet. Everything here is a lookup, so read it as a lookup and test yourself against the left hand column.</p>
<h2>Units and conversions</h2>
<table>
<thead><tr><th>Quantity</th><th>Value</th></tr></thead>
<tbody>
<tr><td>1 byte</td><td>8 bits</td></tr>
<tr><td>1 nibble</td><td>4 bits</td></tr>
<tr><td>1 KB, MB, GB, TB</td><td>Each is 1,024 of the unit below it</td></tr>
<tr><td>Binary to octal</td><td>Group the bits in threes from the right</td></tr>
<tr><td>Binary to hexadecimal</td><td>Group the bits in fours from the right, padding on the left</td></tr>
<tr><td>Hexadecimal A to F</td><td>10 to 15</td></tr>
</tbody>
</table>
<h2>Shortcuts worth having cold</h2>
<table>
<thead><tr><th>Keys</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>Ctrl and Z, Ctrl and Y</td><td>Undo, then redo</td></tr>
<tr><td>Ctrl and F, Ctrl and H</td><td>Find, then find and replace</td></tr>
<tr><td>Ctrl and Home</td><td>Move to the beginning of the document or sheet</td></tr>
<tr><td>Alt and F4</td><td>Close the active window</td></tr>
<tr><td>Ctrl, Shift and Esc</td><td>Open the task manager</td></tr>
<tr><td>F2</td><td>Rename a selected file, or edit the active cell in a spreadsheet</td></tr>
<tr><td>F5</td><td>Refresh</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Volatile means it needs power. Primary memory is volatile except ROM; secondary storage never is.</li>
<li>The operating system allocates, the compiler translates, the assembler translates assembly, and the loader places a program in memory.</li>
<li>Hub at the physical layer, switch at the data link layer, router at the network layer, gateway across all of them.</li>
<li>IPv4 is thirty two bits in four decimal parts; IPv6 is one hundred and twenty eight bits in eight hexadecimal groups.</li>
<li>A virus needs a host, a worm does not, a trojan does not replicate, and ransomware encrypts.</li>
<li>A primary key cannot be null; a foreign key can be, unless the design forbids it.</li>
<li>A relative reference shifts when a formula is copied; an absolute reference, marked with a dollar sign, does not.</li>
<li>No bank asks for a password, a personal identification number or a one time password by call, message or mail.</li>
</ul>
<h2>Final fortnight drill</h2>
<ol>
<li>Ten conversions a day between decimal, binary, octal and hexadecimal, done by grouping rather than through decimal, and timed at fifteen seconds each.</li>
<li>One pass a week through the pairs table, tested with the right hand column covered.</li>
<li>Twenty questions a day from a mixed set, marked in two columns: did not know, and knew but confused with its pair. The second column is your revision list.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question: "The decimal number 45 written in binary is:",
        options: ["110101", "101011", "111001", "101101"],
        answer: 3,
        explanation:
          "Dividing 45 repeatedly by two and reading the remainders upward gives 101101, and the place value check confirms it: thirty two plus eight plus four plus one is forty five. The option 101011 is the standard trap because it uses the same digits in a different order and evaluates to forty three, which a candidate who reads the remainders downward will produce.",
        difficulty: "Medium",
        skill: "Number systems and storage units",
      },
      {
        n: 2,
        question:
          "Which of these is the fastest storage that the processor can read from?",
        options: [
          "a register inside the processor",
          "cache memory",
          "main memory",
          "a solid state drive",
        ],
        answer: 0,
        explanation:
          "Registers sit inside the processor itself and hold the operand being worked on, so nothing is closer or faster. Cache is the attractive answer because it is always described as fast memory, but it sits between the registers and main memory precisely because it is slower than a register and faster than RAM.",
        difficulty: "Easy",
        skill: "Hardware and the memory hierarchy",
      },
      {
        n: 3,
        question: "RAM is described as volatile because:",
        options: [
          "it can be written to only once",
          "its contents are lost when the power is switched off",
          "it is slower than a hard disk",
          "it holds the instructions that start the machine",
        ],
        answer: 1,
        explanation:
          "Volatile means the memory holds its contents only while power is supplied, which is why an unsaved file disappears in a power cut. The last option is the tempting one because it describes real primary memory, but those start up instructions live in ROM, which is non-volatile and keeps them without power.",
        difficulty: "Easy",
        skill: "Hardware and the memory hierarchy",
      },
      {
        n: 4,
        question:
          "A device forwards packets between two different networks on the basis of IP addresses. What is it, and at which layer does it work?",
        options: [
          "a switch, at the data link layer",
          "a hub, at the physical layer",
          "a router, at the network layer",
          "a gateway, at the transport layer",
        ],
        answer: 2,
        explanation:
          "Moving packets between different networks using IP addresses is the definition of routing, and IP belongs to the network layer. The switch is the near miss because it also forwards traffic selectively, but it works inside a single network using hardware addresses at the data link layer and cannot join two networks.",
        difficulty: "Medium",
        skill: "Networking and the internet",
      },
      {
        n: 5,
        question:
          "A customer receives an email that appears to come from the bank and asks her to confirm her account credentials on a linked page. This is an example of:",
        options: ["phishing", "vishing", "a worm", "pharming"],
        answer: 0,
        explanation:
          "Phishing is fraud carried out by a message that imitates a trusted institution and persuades the recipient to enter credentials on a page the fraudster controls. Vishing is the closest wrong answer because it is the identical fraud, but it is conducted by voice call, while a worm needs no deception at all and pharming works without sending any message.",
        difficulty: "Easy",
        skill: "Security threats and safe banking",
      },
      {
        n: 6,
        question:
          "Cell C2 contains a formula that multiplies A2 by B2. You copy it down to C5. What does C5 now compute?",
        options: [
          "A5 multiplied by B5",
          "A2 multiplied by B2",
          "A5 multiplied by B2",
          "nothing, because the formula returns an error",
        ],
        answer: 0,
        explanation:
          "Both references are relative, so copying the formula down three rows shifts both of them down three rows and C5 multiplies A5 by B5. Keeping A2 fixed is what an absolute reference does, written with a dollar sign before the column letter and the row number, and that is the distinction the question is built on.",
        difficulty: "Medium",
        skill: "Office applications and shortcuts",
      },
      {
        n: 7,
        question: "Which of the following is the primary job of an operating system?",
        options: [
          "translating a program written in a high level language into machine code",
          "managing the hardware and allocating it among the programs that are running",
          "protecting the machine against malicious software",
          "displaying web pages sent by a server",
        ],
        answer: 1,
        explanation:
          "An operating system manages the processor, the memory, the devices and the file system, and shares them among running programs. Translation is the tempting alternative because it sounds like system level work, but it is done by a compiler or an interpreter, neither of which is part of the operating system.",
        difficulty: "Easy",
        skill: "Operating system and file handling",
      },
      {
        n: 8,
        question: "How many blocks of 4 KB fit into 1 MB?",
        options: ["512", "128", "256", "1,024"],
        answer: 2,
        explanation:
          "One megabyte is one thousand and twenty four kilobytes, and dividing that by four gives two hundred and fifty six blocks. The option 1,024 is the trap for a candidate who recalls that each unit is 1,024 of the one below it and reports the multiplier instead of carrying out the division.",
        difficulty: "Medium",
        skill: "Number systems and storage units",
      },
    ],
  },
};

export default PART;
