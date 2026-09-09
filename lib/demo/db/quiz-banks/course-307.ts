import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 307, IBPS PO & Clerk: Prelims and Mains.
 *
 * Every `skill` below is a single word lifted from a topic title in course 307, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by taking at
 * most four non-stopword words out of its title, and `bankForTopic` matches this skill against
 * that list case-insensitively. A multi-word skill, or a word that is not among the first four
 * concepts of some topic, matches nothing and sinks to the bottom of every pile.
 *
 * Skills used, module by module:
 *   1 Prelims, Sectional              5 Error, Comprehension
 *   2 Approximation, Series,          6 Banking, RBI, Financial
 *     Quadratic                       7 Computer, Letter
 *   3 Graphs, Caselet                 8 Analysis
 *   4 Syllogism, Puzzles, Inequality
 *
 * The correct option is spread across all four positions (A x4, B x5, C x4, D x5). A bank keyed
 * mostly to one letter is answerable off the screen by a repeat attempter who knows none of the
 * subject, which is the one failure a practice bank cannot afford.
 *
 * No option text contains a "less than" sign: the option `value` is rendered through RichHtml,
 * so an angle bracket is parsed as markup. Strict inequalities are written the other way round.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 307001: the IBPS map ---- */
  mcq(
    307,
    1,
    "In the IBPS probationary officer selection, how do the marks scored in the prelims enter the final merit list?",
    [
      "They are added to the mains marks before the merit list is drawn up",
      "They are added to the interview score",
      "They decide which bank a selected candidate is allotted",
      "They do not enter it at all, because the prelims only shortlists candidates for the mains",
    ],
    3,
    "Easy",
    "Prelims",
    "The prelims is a qualifying screen. It decides who is called for the mains and nothing beyond that, so the officer merit list is built from the mains and the interview, with the mains carrying much the larger weight, and the clerical merit list is built from the mains alone because that cadre has no interview. The tempting answer is that prelims marks are carried forward, and a candidate who believes it spends weeks chasing a high prelims score. Someone who scrapes through the prelims and someone who tops it start the mains level, which is why the plan in this course moves to data interpretation and reasoning depth as soon as the prelims speed is in place.",
  ),
  mcq(
    307,
    2,
    "The prelims paper runs for sixty minutes with a separate twenty minute window for each of the three sections. What does that change about the way you attempt it?",
    [
      "You may return to an earlier section once the later ones are done",
      "Each section closes when its twenty minutes end, so a section you finish early cannot fund a section you find hard",
      "Time saved in one section is carried forward to the next section",
      "The twenty minute limit applies to the reasoning section alone, and the rest is one common pool",
    ],
    1,
    "Medium",
    "Sectional",
    "Under sectional timing the screen moves on at the end of the window and there is no way back, so each section needs an attempt strategy of its own and a target number of questions of its own. Carrying time forward is the tempting answer because that is exactly what composite timing allowed: a fast reader could finish English in twelve minutes and spend the spare eight on quantitative aptitude. Once the windows are separate, the eight minutes are simply lost, and the section you were weakest in is still the section you have twenty minutes for.",
  ),

  /* ---- Module 307002: quantitative aptitude for prelims ---- */
  mcq(
    307,
    3,
    "Approximate the value of 24.97 per cent of 1601 plus 14.98 per cent of 799.",
    ["400", "480", "520", "640"],
    2,
    "Easy",
    "Approximation",
    "Round each term to something you can do in your head. 24.97 per cent is a shade under a quarter and 1601 is a shade over 1600, so the first term is about 400. 14.98 per cent is just under three twentieths and 799 is just under 800, so the second is about 120. The total is about 520, and the exact value is 519.46. The tempting answer is 640, which comes from adding 24.97 and 14.98 into roughly 40 per cent and applying that once. Percentages may only be added when they act on the same base, and here the bases are 1601 and 799.",
  ),
  mcq(
    307,
    4,
    "One term in this series is wrong: 7, 12, 22, 42, 82, 164, 322. Which one is it?",
    ["22", "82", "164", "322"],
    2,
    "Medium",
    "Series",
    "The rule is double the previous term and subtract two. It gives 12, 22, 42 and 82 correctly, and from 82 it demands 162, not 164. The tempting answer is 322, because a candidate who has spotted the break then tests forward from 164, gets 326, and flags the term that fails rather than the term that caused the failure. Test backwards instead: 322 is exactly two less than twice 162, which confirms that the series intended 162 all along and 164 is the intruder.",
  ),
  mcq(
    307,
    5,
    "Two equations are given. I. x² - 7x + 12 = 0. II. y² - 9y + 20 = 0. What is the relationship between x and y?",
    ["x ≤ y", "x > y", "y > x", "No relationship can be established"],
    0,
    "Hard",
    "Quadratic",
    "The first factorises into (x - 3)(x - 4), so x is 3 or 4. The second factorises into (y - 4)(y - 5), so y is 4 or 5. Every value of x is less than or equal to every value of y, which makes the correct choice the one with the equality sign in it. The tempting answer is the strict form, y greater than x, and it holds for three of the four pairs, but x equal to 4 with y equal to 4 is a permitted pair and one counter-example is enough to destroy a strict inequality. No relationship is wrong for the opposite reason: the two root sets do not interleave, they only touch at 4.",
  ),

  /* ---- Module 307003: data interpretation and data analysis ---- */
  mcq(
    307,
    6,
    "A line graph shows accounts opened at a branch: 5,000 in 2022 and 4,000 in 2023. The question asks by what per cent the figure fell in 2023 over 2022. The answer is",
    ["20 per cent", "25 per cent", "80 per cent", "125 per cent"],
    0,
    "Medium",
    "Graphs",
    "The fall is 1,000 and the base is the year you are comparing against, which the words 'over 2022' name for you, so it is 1,000 divided by 5,000, that is 20 per cent. The tempting answer is 25 per cent, which is 1,000 divided by 4,000, the year you ended at rather than the year you started from, and in a mixed data interpretation set that single slip will take out three or four marks in a row. The other two options answer a different question: 80 per cent is 2023 expressed as a share of 2022, and 125 per cent is that ratio the other way up.",
  ),
  mcq(
    307,
    7,
    "Of 420 candidates from a district who sat the prelims, those who cleared and those who did not are in the ratio 2:5. Two fifths of those who cleared went on to clear the mains. How many cleared the prelims but not the mains?",
    ["48", "72", "168", "300"],
    1,
    "Hard",
    "Caselet",
    "The ratio has seven parts, so one part is 60, and 120 candidates cleared the prelims while 300 did not. Two fifths of 120 is 48, so 72 cleared the prelims and then failed the mains. The tempting answer is 48, which is a number you genuinely computed on the way, and it is the classic caselet trap: three or four correct quantities are produced and the last line of the question decides which one is being asked for. The other trap is 168, which comes from reading 2:5 as two parts out of five instead of two parts out of seven.",
  ),

  /* ---- Module 307004: reasoning ---- */
  mcq(
    307,
    8,
    "Statements: All pens are books. Some books are red. Conclusions: I. Some books are pens. II. Some pens are red. Which follows?",
    [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Both conclusions follow",
      "Neither conclusion follows",
    ],
    0,
    "Easy",
    "Syllogism",
    "If every pen is a book then pens sit inside the class of books, so it is always true that some books are pens. That conversion of a universal affirmative is the one inference you can make without drawing anything. Conclusion II is the tempting one, because the mind sketches a single diagram in which the red books happen to overlap the pens. A conclusion has to hold in every diagram the statements allow, and here you can put all the red books among the books that are not pens, which leaves conclusion II false without contradicting anything you were told.",
  ),
  mcq(
    307,
    9,
    "Five people P, Q, R, S and T live on five floors, floor 1 at the bottom and floor 5 at the top. P lives immediately above Q. S lives immediately above P. R lives on the top floor. Exactly two people live between Q and R. Who lives on floor 1?",
    ["P", "Q", "S", "T"],
    3,
    "Medium",
    "Puzzles",
    "Start with the clause that fixes an exact position. R takes floor 5, and if exactly two people live between Q and R then Q must be on floor 2, because floors 3 and 4 are the two in between. P is immediately above Q on floor 3 and S immediately above P on floor 4, which leaves floor 1 for T. The tempting answer is Q, because 'P lives immediately above Q' invites you to picture Q at the bottom of the pair and therefore at the bottom of the building. A relative clue never fixes a floor on its own, so in a floors puzzle you place the counting clue first and hang the relative ones off it.",
  ),
  mcq(
    307,
    10,
    "Statements: M is greater than N, N is greater than or equal to O, and P is greater than O. Which conclusion is definitely true?",
    ["M > P", "M > O", "P > N", "P ≥ N"],
    1,
    "Hard",
    "Inequality",
    "M is greater than N and N is at least O, so M is greater than O, and that chain is unbroken. The tempting answer is that M is greater than P, because the eye reads the two statements as one line running M, N, O with P hanging just above O at the bottom. All you actually know about P is that it sits above O, and O is the lowest point in the chain, so P could sit above M just as easily as below N. An inequality conclusion is safe only when a single unbroken chain of signs runs from one letter to the other.",
  ),

  /* ---- Module 307005: English language ---- */
  mcq(
    307,
    11,
    "Find the part that contains the error. (A) One of the candidates (B) who have applied for the post (C) are from Warangal district. (D) No error.",
    [
      "Part A",
      "Part B",
      "Part C",
      "Part D, the sentence is correct as it stands",
    ],
    2,
    "Easy",
    "Error",
    "The subject of the main verb is 'One', which is singular, so part C must read 'is from Warangal district'. Part B is the tempting choice, because 'one of' makes the ear expect a singular verb everywhere in the sentence. The relative pronoun 'who' does not refer to 'one', it refers to 'the candidates', and it was the candidates who applied, so 'have applied' is right. The pattern worth memorising is that 'one of the' plus a plural noun takes a plural verb inside the relative clause and a singular verb in the main clause.",
  ),
  mcq(
    307,
    12,
    "Read the extract. 'The committee did not dispute that the new branch norms had raised deposits in the districts where they were applied. What it questioned was the inference drawn from that rise. Deposits had risen by a similar margin in districts where the norms were never introduced.' The committee's objection is best described as which of these?",
    [
      "The reported rise in deposits was measured wrongly",
      "The rise was real, but it cannot be credited to the norms, since deposits rose by a similar margin where the norms were absent",
      "The norms should be extended without delay to the districts that do not yet have them",
      "Deposits fell in the districts where the norms were applied",
    ],
    1,
    "Hard",
    "Comprehension",
    "The first sentence concedes the rise, the second names the inference as the thing in dispute, and the third supplies the comparison that undercuts it. Put together, the objection is about causation and not about the figures. The tempting answer is that the measurement was wrong, because 'questioned' reads as doubt and doubt about a statistic is the usual form it takes, but the passage rules that out in its opening clause. On an inference question the passage itself tells you what is conceded and what is contested, and only the contested part can be the answer.",
  ),

  /* ---- Module 307006: banking, economy and general awareness ---- */
  mcq(
    307,
    13,
    "A bank's CASA ratio measures the share of its total deposits that sits in",
    [
      "current accounts and savings accounts",
      "term deposits and recurring deposits",
      "cash in hand and balances kept with the RBI",
      "paid up capital and statutory reserves",
    ],
    0,
    "Easy",
    "Banking",
    "CASA is simply current account and savings account. The ratio is watched because those balances pay little or no interest, so a bank with a high CASA ratio funds its loan book more cheaply and earns a wider net interest margin than a bank leaning on term deposits. The tempting answer is cash in hand and balances with the RBI, partly because the letters suggest cash and partly because that quantity really is reported. That is the bank's own liquidity and its cash reserve requirement, which is an obligation on deposits, not a description of where the deposits themselves are held.",
  ),
  mcq(
    307,
    14,
    "The RBI raises the repo rate. Taken on its own, what does that action do?",
    [
      "It raises the rate at which the RBI absorbs the surplus funds that banks place with it overnight",
      "It raises the share of deposits that banks are required to keep with the RBI",
      "It fixes the interest rate that banks must pay on savings deposits",
      "It raises the cost at which banks borrow short term from the RBI, which tends to push lending rates up and cool demand",
    ],
    3,
    "Medium",
    "RBI",
    "Repo is the rate at which banks borrow from the RBI for short periods against government securities, so raising it raises their marginal cost of funds, and through the external benchmark to which floating rate retail loans are linked it passes into lending rates and then into demand. The tempting answer is the first, which describes the reverse repo, where the flow runs the other way and the RBI is the borrower. Hold the direction in mind: in a repo the bank takes money in, in a reverse repo the bank parks money out. The reserve requirement in the second option is a different instrument altogether, and savings deposit rates have been deregulated.",
  ),
  mcq(
    307,
    15,
    "A term loan stops being serviced and the account is classified as a non performing asset. What follows for the bank's accounts?",
    [
      "The loan is written off at once and leaves the balance sheet",
      "The bank may go on booking the accrued interest as income until the loan is finally recovered",
      "The account has to be transferred to the RBI for recovery",
      "The bank stops taking interest on that account to income and has to set aside a provision against it",
    ],
    3,
    "Hard",
    "Financial",
    "Under the income recognition and asset classification norms, interest on an impaired account may no longer be booked on an accrual basis, and a provision has to be created out of profit that rises as the account stays impaired for longer. That is why a jump in bad loans hits reported profit twice over, once by removing interest income and once by adding the provision. The tempting answer is that the loan is written off, because a write-off is what gets reported. A write-off is a separate and later decision that clears the account from the books while the bank's right to recover survives, and classification as a non performing asset by itself writes nothing off.",
  ),

  /* ---- Module 307007: computer aptitude and the descriptive paper ---- */
  mcq(
    307,
    16,
    "A spreadsheet formula contains the reference $B$4 and is copied into several other cells. What do the dollar signs do?",
    [
      "Both the column and the row shift to match each new position",
      "The column stays as B while the row shifts",
      "The cell contents are displayed as currency",
      "Neither the column nor the row shifts, so every copy still points at B4",
    ],
    3,
    "Easy",
    "Computer",
    "A dollar sign locks whatever follows it, so $B$4 locks the column and the row alike and every copy of the formula keeps pointing at the one cell. That is what you want when a whole column of rows has to be divided by a single rate or total sitting in one place. The tempting answer is that only the column is held, which is what $B4 means: a mixed reference locks one half and lets the other move as the formula travels. The currency option trades on the dollar sign being a currency symbol, which has nothing to do with its use inside a reference.",
  ),
  mcq(
    307,
    17,
    "In the descriptive paper you write a formal letter addressed to 'The Branch Manager', with no person named. Which closing is conventionally correct?",
    [
      "Yours sincerely, because the letter goes to a particular office",
      "Yours faithfully, because the recipient has been addressed by designation and not by name",
      "Yours truly, because it is the neutral form for every official letter",
      "Regards, because it suits a formal letter and an informal one alike",
    ],
    1,
    "Medium",
    "Letter",
    "The convention pairs the opening with the closing. An impersonal opening such as 'Sir', 'Madam' or a designation takes 'Yours faithfully', and a named recipient such as 'Dear Mr Rao' takes 'Yours sincerely'. Here an office is addressed and no name is used, so the faithful form is the one that fits. The tempting answer is 'Yours sincerely', which candidates default to because it is what they type in every email they send. The examiner is reading a short letter against a short checklist of format, salutation, subject line, body and subscription, and a mismatched pair costs a mark that the content cannot win back.",
  ),

  /* ---- Module 307008: mocks and the interview ---- */
  mcq(
    307,
    18,
    "A section gives one mark for each correct answer and takes away one fourth of a mark for each wrong one. A candidate attempts 60 questions and gets 45 of them right. What is the net score?",
    ["30.00", "33.75", "41.25", "45.00"],
    2,
    "Hard",
    "Analysis",
    "Fifteen answers are wrong, each costs a quarter of a mark, so the deduction is 3.75 and the net score is 41.25. The tempting answer is 33.75, which comes from taking a quarter off the score instead of a quarter off each wrong answer, and 30.00 is what you get by deducting a full mark per wrong answer. The number worth carrying out of the analysis is the marginal one: the same candidate stopping at 48 attempts with the same 45 correct would have scored 44.25, so those last twelve attempts, all of them wrong, cost three marks. That comparison, and not the raw score, is what tells you where to stop guessing.",
  ),
];

export default BANK;
