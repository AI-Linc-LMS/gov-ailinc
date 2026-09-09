import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 308, SBI PO & SBI Clerk.
 *
 * Every `skill` below is a single word lifted from a topic title in course 308, because
 * `conceptsFor` in lib/demo/http/handlers/adaptive-courses.ts derives a topic's concepts by
 * splitting its title and keeping at most four terms, and `bankForTopic` matches this skill
 * against that list case-insensitively and exactly. "Data interpretation" as a skill matches
 * nothing and sinks the question to the bottom of every pile; "Caselet" lands on the topic
 * that teaches it.
 *
 * Skills used, module by module:
 *   1 Probationary, Local              5 Comprehension, Error, Descriptive
 *   2 Percentage, Series, Arithmetic   6 RBI, Mutual, Banking
 *   3 Caselet, Sufficiency, Choosing   7 Group
 *   4 Puzzles, Machine, Assumption
 *
 * Structure, method and worked arithmetic only. No vacancy count, fee, cut-off, exam date
 * or rate value is ever the subject of a question here: those move with every notification
 * and with every policy review, and a stale answer key is worse than no question.
 *
 * The correct option is spread across all four positions (A x5, B x4, C x5, D x4), because
 * a bank keyed mostly to one letter is read off the screen by a repeat attempter who knows
 * none of the subject.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 308001: how SBI recruitment differs ---- */
  mcq(
    308,
    1,
    "Where does the Junior Associate selection differ in structure from the Probationary Officer selection?",
    [
      "The Junior Associate selection is decided at the mains stage, while the Probationary Officer selection adds a further phase of psychometric test, group exercise and interview",
      "The Junior Associate examination has a single stage only, with no preliminary test",
      "The Junior Associate mains carries a descriptive paper, while the Probationary Officer mains does not",
      "The Junior Associate prelims marks are carried into the final merit list, while the Probationary Officer prelims marks are not",
    ],
    0,
    "Easy",
    "Probationary",
    "Both tracks run a preliminary test and then a mains, and in both the prelims is a screening test whose marks are not carried forward. The difference sits after the mains: the officer track adds a further phase of psychometric test, group exercise and interview, and the final merit is built from the mains and that phase together, while the clerical merit rests on the mains. Option D is the tempting answer, because the clerical paper is shorter and candidates assume a shorter process must count everything it sets. It does not, and a candidate who plans on that basis over-invests in prelims speed and under-prepares the mains. Option C reverses the true position: it is the officer mains that carries the descriptive paper.",
  ),
  mcq(
    308,
    2,
    "A Junior Associate candidate has never studied the local language of the state he has applied to as a subject in school. What does the recruitment process require of him?",
    [
      "Nothing further, because the written examination was conducted in English and Hindi",
      "He stands disqualified, since the local language is an eligibility condition fixed at the application stage",
      "He must sit the mains again in the local language",
      "He must qualify a language test held at or after joining, which stands in place of a school certificate showing the language as a studied subject",
    ],
    3,
    "Medium",
    "Local",
    "Proficiency in the opted local language is a condition of appointment in the clerical cadre, because the posts are state-wise and the work is over a counter. The condition is proved one of two ways: a 10th or 12th standard marksheet showing that language as a subject, or a language test conducted at or after the time of joining. It is a qualifying check, so it adds nothing to your merit position, but failing it costs the appointment itself. Option B is the tempting answer, because candidates read the word eligibility as something settled before the examination. The language test exists precisely so that a candidate who never studied the language formally still has a route to qualify.",
  ),

  /* ---- Module 308002: quantitative aptitude and speed maths ---- */
  mcq(
    308,
    3,
    "A simplification question needs 37.5 per cent of 512. Which conversion turns it into one step, and what is the value?",
    [
      "1 by 3 of 512, which is 170.67",
      "3 by 8 of 512, which is 192",
      "3 by 7 of 512, which is 219.43",
      "5 by 8 of 512, which is 320",
    ],
    1,
    "Easy",
    "Percentage",
    "12.5 per cent is one eighth, so 37.5 per cent is three eighths. 512 divided by 8 is 64, and 64 multiplied by 3 is 192, which is a division and a multiplication you can do without writing anything down. Option D is the tempting wrong answer, because 37.5 and 62.5 are complements and a candidate who has memorised the table by the fraction rather than by the percentage picks the wrong end of the pair. The check that catches it takes a second: 192 and 320 add to 512, so if your answer plus the other candidate answer makes the whole, you have taken the complement.",
  ),
  mcq(
    308,
    4,
    "Find the next term: 6, 7, 16, 51, 208, ?",
    ["836", "1040", "1045", "1048"],
    2,
    "Hard",
    "Series",
    "The multiplier and the addend both step up together: 6 into 1 plus 1 is 7, 7 into 2 plus 2 is 16, 16 into 3 plus 3 is 51, 51 into 4 plus 4 is 208, so the next term is 208 into 5 plus 5, which is 1,045. Option A, 836, is the tempting wrong answer, and it is what you get by holding the multiplier at 4 instead of advancing it, which is easy to do because 51 into 4 was the step you just finished. When the differences do not settle into a pattern in a series that grows this fast, test a moving multiplier before anything else, and confirm it on at least two consecutive terms before you use it on the last one.",
  ),
  mcq(
    308,
    5,
    "A can finish a piece of work in 12 days and B in 18 days. They start together, but A leaves 3 days before the work is completed. In how many days is the work finished?",
    ["7.2 days", "9 days", "10 days", "12 days"],
    1,
    "Hard",
    "Arithmetic",
    "Take the total work as the LCM of 12 and 18, which is 36 units, so A does 3 units a day and B does 2. B is present throughout, so if the work takes d days, B contributes 2d units, and A works for d minus 3 days, contributing 3 into d minus 3. Setting 3d minus 9 plus 2d equal to 36 gives 5d equal to 45, so d is 9. Option A, 7.2 days, is the tempting wrong answer, because 36 divided by 5 is what the pair does together and a candidate who reads past the departure clause stops there. The second trap in the same sentence is reading A leaves 3 days before completion as A leaves after 3 days, which is a different problem with a different answer.",
  ),

  /* ---- Module 308003: data analysis and interpretation ---- */
  mcq(
    308,
    6,
    "A caselet states that a branch opened 1,200 accounts in a month, that 45 per cent of them were savings accounts, and that of the remaining accounts one third were current accounts and the rest were recurring deposits. How many recurring deposit accounts were opened?",
    ["220", "400", "440", "660"],
    2,
    "Medium",
    "Caselet",
    "45 per cent of 1,200 is 540 savings accounts, which leaves 660. One third of that 660 is 220 current accounts, so the recurring deposits are 660 minus 220, which is 440. Option B, 400, is the tempting wrong answer: it is one third of the full 1,200, taken by a candidate who carries the original total forward as the base for the second fraction. In a caselet the base moves as the paragraph moves, and the words of the remaining are the whole instruction. Write down the running remainder after each sentence before touching the next percentage, because every later question in the set is built on it.",
  ),
  mcq(
    308,
    7,
    "A data sufficiency question asks for a man's present age. Statement I: he is 30 years older than his son. Statement II: five years ago, his age was four times his son's age at that time. Which is true?",
    [
      "Statement I alone is sufficient",
      "Statement II alone is sufficient",
      "The question cannot be answered even with both statements",
      "Both statements together are sufficient, but neither of them alone is",
    ],
    3,
    "Hard",
    "Sufficiency",
    "Each statement on its own is a single equation in two unknowns, so neither fixes an age. Together they resolve: with the son's present age as S, the first gives the man as S plus 30, and the second gives S plus 30 minus 5 equal to 4 into S minus 5, so S plus 25 equals 4S minus 20, giving S equal to 15 and the man 45. Option C is the tempting answer, because a candidate who scans both statements and sees only relationships, with no absolute age stated anywhere, concludes there is nothing to anchor them. Two independent relations in two unknowns are exactly enough, and the discipline of this question type is to establish that and stop, without spending the time to produce 45.",
  ),
  mcq(
    308,
    8,
    "In the mains, what is the strongest reason to leave a data interpretation set at the reading stage rather than attempting it?",
    [
      "The first question yields a value that the later questions of the set all depend on, and that value does not come out cleanly",
      "The set is longer to read than the others in the section",
      "The set carries fewer marks per question than the rest of the section",
      "The set is placed at the end of the section",
    ],
    0,
    "Easy",
    "Choosing",
    "A set is not five independent questions. The questions share one table or one paragraph, so a base figure that is wrong or slow poisons the whole block, and a chained calculation that will not resolve cleanly is the signal to leave before you have sunk three minutes in it. Option B is the tempting reason, because length feels like cost, but a long set with clean numbers is often the fastest scoring in the section, while a short set with awkward ratios is the slowest. Option C rewards nothing, since marks per question do not vary inside a section, and the position of a set on the screen says nothing about its difficulty.",
  ),

  /* ---- Module 308004: high level reasoning ---- */
  mcq(
    308,
    9,
    "Five friends P, Q, R, S and T sit in a row facing north. R sits third from the left. Q sits immediately to the right of R. P sits at one of the extreme ends, but not on the left of R. S does not sit adjacent to R. Who sits at the extreme left end?",
    ["P", "Q", "S", "T"],
    2,
    "Medium",
    "Puzzles",
    "Place what is certain first. R takes seat 3 and Q takes seat 4. P must be at seat 1 or seat 5, and seat 1 is on the left of R, so P is at seat 5. Seats 2 and 4 are the ones adjacent to R, seat 4 is already Q's, and S is barred from seat 2, so S takes seat 1 and T takes seat 2, leaving S at the extreme left. Option D, T, is the tempting answer, and it is what you get by reading not adjacent to R as applying only to the seat on R's right, where Q already sits. In a row, adjacency runs both ways, and a constraint read one-sided is what collapses a three variable puzzle.",
  ),
  mcq(
    308,
    10,
    "A machine input output set gives you the input line and asks for a later step. Why can such a set never reliably ask for the input given a later step?",
    [
      "Because the rule the machine applies changes from one step to the next",
      "Because the machine works only from left to right",
      "Because the number of steps is not fixed for a given input",
      "Because each step discards the information about where the moved element came from, so more than one input can produce the same arrangement",
    ],
    3,
    "Hard",
    "Machine",
    "The operation is many to one. Once an element has been lifted out and placed at an end, the arrangement that remains no longer records which slot it left, so several different inputs collapse to the same step II. Forward is deterministic and backward is not, which is why every set of this kind supplies the input and why forward simulation, one step at a time, is the only safe method. Option A is the tempting answer, because candidates who cannot see the pattern assume the rule alternates between steps. The rule is fixed throughout, and it is the loss of position information, not any change of rule, that makes the reverse direction ambiguous.",
  ),
  mcq(
    308,
    11,
    "A statement reads: the bank has asked all customers to complete re-KYC through its mobile application before the quarter ends. Which of these is an assumption implicit in that statement, rather than an inference drawn from it?",
    [
      "A substantial share of the bank's customers are able to use the mobile application",
      "Customers who do not complete re-KYC will face restrictions on their accounts",
      "The bank's branches are short of staff",
      "Re-KYC at a branch counter is no longer permitted",
    ],
    0,
    "Hard",
    "Assumption",
    "An assumption is what the speaker must already be taking for granted for the statement to make sense, while an inference is what follows from the statement once it is accepted. Instructing every customer to use the application only makes sense if the bank supposes its customers can use it, so option A is presupposed by the instruction itself. Option B is the tempting answer, because that is what usually happens in practice, but it is drawn from your knowledge of banking rather than from the sentence, which mentions no consequence at all. Options C and D add facts the sentence does not carry: announcing one channel is not the same as closing another.",
  ),

  /* ---- Module 308005: English and the descriptive paper ---- */
  mcq(
    308,
    12,
    "In a comprehension passage the sentence reads: the measures were intended to arrest the fall in deposits. What does the word arrest mean here?",
    ["To take into custody", "To stop or check", "To attract or hold the attention", "To record formally"],
    1,
    "Easy",
    "Comprehension",
    "Vocabulary in context is marked on the fit between the word and what it acts on, not on the first dictionary sense. A fall in deposits is a process, and what you do to a process is halt it, so arrest here means to stop or check. Option A is the tempting answer, because it is the sense almost every candidate holds first, but that sense takes a person as its object and a trend cannot be taken into custody. Option C is a real sense of the related adjective, as in an arresting photograph, which is why it belongs on the list, but it does not fit a verb acting on a decline. Read the object before choosing the meaning.",
  ),
  mcq(
    308,
    13,
    "Identify the part of this sentence that contains the error: Neither the manager nor the clerks / was aware of / the revised circular / that came into force last week.",
    [
      "Neither the manager nor the clerks",
      "was aware of",
      "the revised circular",
      "that came into force last week",
    ],
    1,
    "Medium",
    "Error",
    "With neither and nor joining two subjects, the verb agrees with the subject nearer to it. The nearer subject here is clerks, which is plural, so the verb should be were aware of, and the error sits in the second part. The tempting choice is the first part, because candidates who have memorised that neither takes a singular verb mark the subject as the fault. The subject is written correctly; it is the verb that has to follow the proximity rule. Note also that reversing the order to neither the clerks nor the manager would make was correct, which is the quickest way to test that you have applied the rule and not a remembered sentence.",
  ),
  mcq(
    308,
    14,
    "The descriptive paper sets a formal letter to a branch manager about a failed ATM transaction. Which opening for the body of the letter scores best?",
    [
      "The date of the transaction, the amount, the ATM location and the reference number, followed by what you want done",
      "How long you have banked with that branch, and how disappointed you are by the experience",
      "A summary of the rule on failed transactions and the redress it prescribes",
      "A request for an appointment to discuss the matter at the branch",
    ],
    0,
    "Medium",
    "Descriptive",
    "A formal letter is marked on purpose, structure, tone and economy, and the purpose of a complaint is to have something corrected. That needs the facts a bank can actually trace, then the request, in that order, inside a tight word limit. Option B is the tempting opening, because loyalty and disappointment feel like they strengthen the case, but they add nothing the branch can act on and they spend words you will need for the request. Citing the rule can support the letter later, but as an opening it inverts the order, since the reader has to know which transaction you mean before any rule becomes relevant.",
  ),

  /* ---- Module 308006: banking and financial awareness ---- */
  mcq(
    308,
    15,
    "The Reserve Bank raises the repo rate. Following the mechanism through, what is the intended effect?",
    [
      "Banks borrow more from the Reserve Bank, so credit expands",
      "The cash reserve ratio falls automatically, releasing liquidity into the system",
      "Borrowing from the Reserve Bank becomes costlier, lending rates rise, credit growth slows and demand pressure on prices eases",
      "The government's cost of borrowing falls, so the fiscal deficit narrows",
    ],
    2,
    "Easy",
    "RBI",
    "The repo rate is the rate at which banks borrow overnight from the Reserve Bank against government securities, so raising it raises their marginal cost of funds. That passes into lending rates, slows credit growth and cools demand, which is the transmission channel an inflation targeting central bank works through. Option D is the tempting answer, because it points the same way as tightening and sounds fiscally sensible, but a higher policy rate lifts yields on government securities and therefore raises, not lowers, what the government pays to borrow. The cash reserve ratio in option B is a separate instrument and does not move with the repo rate.",
  ),
  mcq(
    308,
    16,
    "You invest a fixed sum each month in an equity mutual fund through a systematic investment plan. What does this achieve that one lump sum on a single date does not?",
    [
      "It guarantees a higher return than the same amount invested in one instalment",
      "It removes market risk from the investment",
      "It makes the gains free of tax",
      "It buys more units when the net asset value is low and fewer when it is high, so the cost per unit averages across market levels",
    ],
    3,
    "Medium",
    "Mutual",
    "A fixed rupee amount buys whatever number of units the net asset value on that date allows, so a fall buys more units and a rise buys fewer, and the average cost per unit is spread across the period instead of resting on one day's level. Option A is the tempting answer, because that is how such a plan is usually sold, but in a market that rises steadily from the start date a lump sum invested on day one finishes ahead. Averaging reduces the dependence on timing, it does not promise a higher return. The investment carries full market risk throughout, and taxation follows the type of fund and the holding period, not the mode of investing.",
  ),
  mcq(
    308,
    17,
    "A depositor holds a savings account at one branch and a fixed deposit at another branch of the same bank, and the bank fails. How does deposit insurance treat the claim?",
    [
      "Each branch is treated separately, so the cover applies once at each branch",
      "Each account is treated separately, so the cover applies once to each account",
      "All deposits held by that depositor in the same right and the same capacity are added together across every branch of the bank, and the cover applies once to the total",
      "Only the savings balance is covered, because term deposits fall outside the scheme",
    ],
    2,
    "Hard",
    "Banking",
    "Deposit insurance runs per depositor per bank. Savings, current, recurring and fixed deposit balances held in the same right and the same capacity are aggregated across all branches of that bank, principal and interest together, and the cover applies once to that total. Option A is the tempting answer, because a branch feels like a separate unit with its own account numbers and its own manager, but branches are not separately insured entities. The distinction that does create a separate claim is capacity, not location: a deposit held as guardian for a minor, or in a partnership, is in a different capacity from one held in your own name.",
  ),

  /* ---- Module 308007: psychometric test, group exercise and interview ---- */
  mcq(
    308,
    18,
    "In the group exercise, what are the assessors principally recording?",
    [
      "The substance of what each candidate contributes, and whether they move the group towards a decision",
      "How often each candidate speaks, and for how long",
      "Whether the group arrives at the conclusion the assessors have in mind",
      "Which candidate takes the lead in the first minute",
    ],
    0,
    "Easy",
    "Group",
    "The exercise is a work sample for a job done in branches and committees, so the assessors watch content and behaviour together: whether you bring a point the discussion did not have, whether you build on somebody else's, whether you draw in a member who has not spoken, and whether the group reaches a conclusion in the time given. Option B is the tempting answer, and it is what drives candidates to talk over one another, but a long turn that repeats a settled point scores below one short intervention that resolves a disagreement. There is also no answer waiting to be found, because the topic is chosen to have defensible positions on either side.",
  ),
];

export default BANK;
