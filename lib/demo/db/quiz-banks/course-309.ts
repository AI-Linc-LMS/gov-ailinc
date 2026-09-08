/**
 * Course 309 - RBI Grade-B & NABARD Grade-A.
 *
 * Course-level fallback bank. The adaptive selector serves a topic's own authored
 * questions first and draws on this bank once those run out, or when the topic has
 * no authored lesson yet, so these have to stand on their own as exam-grade
 * questions rather than as filler.
 *
 * `skill` on each question is a single word taken from the title of the topic it
 * belongs to, because `conceptsFor` in the adaptive-courses handler derives a
 * topic's concepts by splitting its title into words and `bankForTopic` matches
 * skill to concept as a whole string, case-insensitively. A multi-word skill, or a
 * word that is not in any title, matches nothing and sinks the question.
 *
 * Nothing here keys on a vacancy count, a fee, a cut-off, an exam date or a
 * current policy rate. Those move with every notification and every review, and a
 * stale answer key is worse than no question. Structure, method and consequence do
 * not move.
 */

import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

const BANK: DemoMcq[] = [
  // Module 309001 - Two examinations, one preparation
  mcq(
    309,
    1,
    "In the RBI Grade-B (Direct Recruitment, General) examination, Phase II consists of",
    [
      "a single objective paper covering general awareness, reasoning, quantitative aptitude and English",
      "three papers: Economic and Social Issues, English (Writing Skills), and Finance and Management",
      "two papers: General Studies and one optional subject chosen by the candidate",
      "an interview and a psychometric test, with no written paper",
    ],
    1,
    "Easy",
    "Phases",
    "Phase II is written in three separate papers, and it is those three plus the interview that decide the final merit. Option A describes Phase I, which is the screening paper: clearing it only earns you a seat in Phase II, so a candidate who prepares only for the objective paper has prepared for the qualifying stage and not for the examination.",
  ),
  mcq(
    309,
    2,
    "You are preparing for RBI Grade-B and NABARD Grade-A from a single timetable. Which body of material is examined by only one of the two boards?",
    [
      "Economic and Social Issues",
      "Agriculture and Rural Development",
      "Descriptive English writing",
      "Quantitative aptitude in the screening paper",
    ],
    1,
    "Medium",
    "Syllabus",
    "Agriculture and Rural Development is NABARD's own subject and has no counterpart in Grade-B, just as Finance and Management is Grade-B's own. Economic and Social Issues is the honest overlap and is where a shared timetable actually pays, which is why it is the tempting choice here, but it is examined by both boards and so cannot be the answer. Descriptive English and screening-stage aptitude are likewise common to both.",
  ),

  // Module 309002 - Phase one objective paper
  mcq(
    309,
    3,
    "Deposit insurance for depositors of banks in India is provided by",
    [
      "the Reserve Bank of India directly, out of its own balance sheet",
      "the Deposit Insurance and Credit Guarantee Corporation, a wholly owned subsidiary of the Reserve Bank",
      "the Insurance Regulatory and Development Authority of India",
      "the Ministry of Finance, through the State Bank of India",
    ],
    1,
    "Easy",
    "Awareness",
    "The DICGC is a separate corporation, wholly owned by the RBI, which insures deposits in commercial banks, small finance banks, payments banks, regional rural banks and co-operative banks, and collects a premium from the insured banks for doing so. The tempting answer is the RBI itself, but the central bank does not stand behind individual deposits on its own balance sheet, and keeping the insurer distinct from the regulator is the whole design. IRDAI regulates insurance companies and has no role in deposit insurance.",
  ),
  mcq(
    309,
    4,
    "A branch disbursed ₹4,50,000 in crop loans in 2023-24, which was 25 per cent more than in 2022-23. In 2024-25 disbursement fell by 20 per cent from the 2023-24 level. Total disbursement over the three years was",
    ["₹11,47,500", "₹11,65,500", "₹11,70,000", "₹11,88,000"],
    2,
    "Hard",
    "Quantitative",
    "2023-24 is 1.25 times 2022-23, so 2022-23 is 4,50,000 divided by 1.25, that is ₹3,60,000. A fall of 20 per cent from 4,50,000 gives ₹3,60,000 again, so the total is 3,60,000 plus 4,50,000 plus 3,60,000, which is ₹11,70,000. The usual slip gives ₹11,47,500: it treats 'X is 25 per cent more than Y' as Y equals 75 per cent of X, that is 3,37,500. Increase and decrease are not symmetric, because the percentage is taken on different bases.",
  ),
  mcq(
    309,
    5,
    "A district administration argues: since the skill centre opened, youth unemployment in the mandal has fallen, so the centre is working. Which of the following, if true, most weakens the argument?",
    [
      "The centre trains in three trades rather than in one.",
      "A garment unit opened in the same mandal in the same period and recruited several hundred local youth directly off the street.",
      "A number of trainees left the centre before completing certification.",
      "The neighbouring mandal, which has no skill centre, recorded no fall in youth unemployment.",
    ],
    1,
    "Medium",
    "Reasoning",
    "The argument moves from a correlation in time to a claim of cause, so it is weakened most by an alternative cause that fits the same period, which is what the garment unit supplies. Drop-outs look damaging and are the usual pick, but they say nothing about what produced the fall in unemployment: even a centre with heavy attrition could have caused it. The last option is a control comparison and strengthens the argument rather than weakening it.",
  ),

  // Module 309003 - Economic and social issues
  mcq(
    309,
    6,
    "Gross Domestic Product at market prices differs from Gross Value Added at basic prices by",
    [
      "product taxes minus product subsidies",
      "consumption of fixed capital, that is depreciation",
      "net factor income from abroad",
      "the change in the deflator between the base year and the current year",
    ],
    0,
    "Medium",
    "Growth",
    "GVA measures output at the prices producers actually receive, so adding taxes on products and subtracting subsidies on products moves you to the prices buyers pay, which is GDP at market prices. Depreciation is the wrong bridge: it separates gross from net, not basic prices from market prices. Net factor income from abroad separates domestic from national, and the deflator converts current prices to constant prices.",
  ),
  mcq(
    309,
    7,
    "Under the Current Weekly Status used in the Periodic Labour Force Survey, a person is counted as employed if, in the seven days preceding the survey, the person worked",
    [
      "on all seven days",
      "for at least one hour on at least one day",
      "for at least four hours on at least four days",
      "for the major part of the reference period",
    ],
    1,
    "Hard",
    "Employment",
    "The weekly status uses a deliberately low threshold, one hour on one day, so it captures short and irregular work that a longer reference period would miss. The major time criterion in the last option belongs to the Usual Status, which looks back over 365 days and asks what a person did for most of that year. Knowing which status a figure comes from matters, because the same survey yields different unemployment rates under usual and weekly status, and an answer that quotes one rate against the other's definition loses the mark.",
  ),
  mcq(
    309,
    8,
    "An increase in the Cash Reserve Ratio reduces money supply mainly because",
    [
      "it lowers the money multiplier, so a given stock of reserve money supports less deposit creation",
      "it raises the rate at which banks borrow overnight from the central bank",
      "it obliges banks to hold a larger portfolio of government securities",
      "it directly reduces the currency held by the public",
    ],
    0,
    "Medium",
    "Monetary",
    "CRR is the share of net demand and time liabilities a bank must keep as balances with the RBI. Raising it means each rupee of reserve money supports fewer deposits, which is a fall in the multiplier. The tempting wrong answer is the government securities one, but that describes the Statutory Liquidity Ratio, a different requirement met with approved securities rather than with balances at the central bank. Overnight borrowing costs are set by the repo and marginal standing facility rates, not by CRR.",
  ),
  mcq(
    309,
    9,
    "Which of the following is recorded in the current account of India's balance of payments?",
    [
      "Foreign direct investment into an Indian manufacturing company",
      "Remittances sent home by Indian workers employed abroad",
      "An external commercial borrowing raised by an Indian company",
      "The Reserve Bank's purchase of foreign currency to add to reserves",
    ],
    1,
    "Hard",
    "External",
    "Remittances are secondary income, a unilateral transfer with nothing owed in return, and transfers sit in the current account alongside goods, services and primary income. FDI is the tempting error because it is a large and visible inflow, but it creates a foreign claim on Indian assets and therefore belongs to the financial account, as does external commercial borrowing. Reserve accumulation is the reserve assets line, also within the financial account.",
  ),

  // Module 309004 - Finance and management
  mcq(
    309,
    10,
    "Commodity derivatives exchanges in India are regulated by",
    [
      "the Reserve Bank of India",
      "the Securities and Exchange Board of India",
      "the Forward Markets Commission",
      "the Insurance Regulatory and Development Authority of India",
    ],
    1,
    "Easy",
    "Regulators",
    "Commodity derivatives came under SEBI when the Forward Markets Commission was merged into it in 2015, which put securities and commodity derivatives under one securities regulator. The Forward Markets Commission is the tempting answer precisely because it held this mandate for decades and still appears in older material, but it no longer exists. The RBI's writ over markets runs to money, government securities and foreign exchange, not to commodity futures.",
  ),
  mcq(
    309,
    11,
    "A bank reports Tier 1 capital of ₹900 crore and Tier 2 capital of ₹300 crore against risk weighted assets of ₹12,000 crore. Its capital to risk weighted assets ratio is",
    ["2.5 per cent", "7.5 per cent", "10 per cent", "12.5 per cent"],
    2,
    "Hard",
    "Basel",
    "CRAR is total regulatory capital over risk weighted assets, so it is 900 plus 300 over 12,000, which is 10 per cent. The 7.5 per cent option is the Tier 1 ratio taken alone, and it is a real supervisory ratio, which is exactly why it is tempting: the trap is not the arithmetic but reading which ratio was asked for. Note also that the denominator is risk weighted, so the same balance sheet held in sovereign paper rather than in unrated corporate loans would produce a very different figure.",
  ),
  mcq(
    309,
    12,
    "You buy a call option on a share at a strike of ₹200, paying a premium of ₹12 per share. On expiry the share closes at ₹206. Ignoring brokerage, your position is",
    [
      "a profit of ₹6 per share",
      "a loss of ₹6 per share",
      "a loss of ₹12 per share",
      "neither profit nor loss",
    ],
    1,
    "Medium",
    "Derivatives",
    "The option is in the money by ₹6, so you exercise and recover ₹6 of the ₹12 premium, leaving a net loss of ₹6. The tempting answer is the full ₹12 loss, which assumes you let the option lapse, but an in-the-money option is always worth exercising even when the trade as a whole loses money, because the premium is already spent. Break-even for a bought call is strike plus premium, ₹212 here, which is why a ₹6 rise is not yet a profit.",
  ),
  mcq(
    309,
    13,
    "In Herzberg's two factor theory, salary and working conditions are classified as",
    [
      "motivators, because better pay raises satisfaction",
      "hygiene factors, whose absence causes dissatisfaction but whose presence does not by itself motivate",
      "self actualisation needs at the top of the hierarchy",
      "the defining assumptions of Theory Y",
    ],
    1,
    "Easy",
    "Motivation",
    "Herzberg's finding was that satisfaction and dissatisfaction are driven by two different sets of factors rather than by two ends of one scale. Pay, supervision, policy and physical conditions are hygiene factors: get them wrong and people are dissatisfied, get them right and you have only reached neutral. Treating pay as a motivator is the intuitive answer and is the very assumption his data contradicted. Achievement, recognition, responsibility, advancement and the work itself are the motivators.",
  ),

  // Module 309005 - Agriculture and rural development
  mcq(
    309,
    14,
    "Which of the following is a rabi crop in most of India?",
    ["Bajra", "Cotton", "Wheat", "Groundnut"],
    2,
    "Easy",
    "Cropping",
    "Rabi crops are sown as the south west monsoon withdraws, around October and November, and are harvested in spring: wheat, gram, mustard, barley and rabi jowar. Bajra, cotton and groundnut are sown with the onset of the monsoon and are kharif crops. Cotton is the one worth pausing on, because its long duration keeps it in the field well past the kharif harvest and candidates often reclassify it on that basis, but sowing time is what fixes the season.",
  ),
  mcq(
    309,
    15,
    "Priority Sector Lending Certificates allow a bank that has exceeded its priority sector target to",
    [
      "transfer the loans, and the credit risk on them, to the buying bank",
      "sell the priority sector credit while the underlying loan, its risk and its servicing stay on its own books",
      "claim refinance from NABARD at a concessional rate against the excess",
      "reduce its cash reserve ratio requirement in proportion to the excess",
    ],
    1,
    "Medium",
    "Priority",
    "A PSLC trades the regulatory credit for priority sector achievement, not the asset. The loan, the borrower relationship, the risk and the recovery effort all remain with the originating bank, which is why a bank with strong rural reach can earn fee income from lending it was going to do anyway. The tempting answer is the first, because a loan sale also moves priority sector achievement, but that is a different instrument: it moves the asset itself. Note too that a shortfall, not an excess, is what obliges a bank to place funds with NABARD and similar institutions.",
  ),
  mcq(
    309,
    16,
    "The Mahatma Gandhi National Rural Employment Guarantee Act guarantees",
    [
      "wage employment to every rural household whose adult members volunteer to do unskilled manual work",
      "wage employment to every rural individual living below the poverty line",
      "a monthly cash transfer to landless rural households",
      "skilled employment on public works to one member of every rural household",
    ],
    0,
    "Medium",
    "Programmes",
    "The entitlement is legal, it attaches to the household rather than the individual, it is capped at a hundred days of wage employment in a financial year, and it is self selecting: anyone willing to do unskilled manual work at the notified wage qualifies. The poverty line option is the common error, because most rural schemes are targeted and candidates assume this one is too. It is not, and that self selection is precisely the design feature that lets the scheme act as a floor under rural wages. It is also work, not a transfer, and the work is unskilled.",
  ),

  // Module 309006 - Descriptive English
  mcq(
    309,
    17,
    "A precis of a given passage should",
    [
      "reproduce the passage's most striking sentences verbatim, joined into a shorter text",
      "restate the author's argument in your own words at roughly a third of the length, adding nothing new",
      "summarise the passage and then set out your own assessment of the argument",
      "retain every example in the passage and drop the conclusion",
    ],
    1,
    "Easy",
    "Precis",
    "A precis is a compression, so it carries the argument and its logical order in your own continuous prose, in the third person, with no fresh material and no quoted padding. The tempting wrong answer is the one that adds your assessment, because the essay paper does invite your own view and candidates carry that habit across. In a precis it costs marks. Examples and illustrations are the first thing to cut and the conclusion is close to the last, so the final option inverts the priority.",
  ),

  // Module 309007 - Reading the source documents
  mcq(
    309,
    18,
    "The Monetary Policy Committee votes on the policy repo rate. If the votes are equally divided,",
    [
      "the decision stands deferred to the next scheduled meeting",
      "the Governor of the Reserve Bank has a second, casting vote",
      "the Central Government's nominee on the committee decides the outcome",
      "the existing rate continues by default and no resolution is issued",
    ],
    1,
    "Hard",
    "Statement",
    "The Governor chairs the committee, votes as a member and, in the event of a tie, exercises a casting vote as well, so a deadlocked committee still produces a decision on the day. The third option is the attractive error: the three external members are appointed by the Central Government, and candidates slide from that to imagining a departmental representative in the room. There is none. The external members sit in their own right, and their dissents are published in the minutes, which is where you read the argument rather than only the rate.",
  ),
];

export default BANK;
