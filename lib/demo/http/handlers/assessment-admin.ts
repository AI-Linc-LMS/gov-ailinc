/**
 * Assessments, both sides of the desk.
 *
 * The student side and the admin side of an assessment are the same object seen
 * from two chairs, and they have to agree: the paper an administrator builds is
 * the paper a learner sits, the score a learner sees is the row an administrator
 * grades, and the 76% on the scorecard is the same 76% on the report. So there is
 * exactly one catalogue in this file (`ASSESSMENTS`) and every endpoint below is
 * a projection of it. The learner hub imports the same record.
 *
 * Scoring is COMPUTED, never asserted. The seeded DSA attempt is a real response
 * sheet run through the same scorer a live submission goes through, which is why
 * it lands on 76 and not on a number someone typed. If the questions change, the
 * report changes with them, and nothing on screen can quietly drift apart.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import { nextDemoId, overlay } from "../../db/overlay";
import { iso, isoDaysAgo, isoDaysAhead, nowMs, ymd, daysAgo } from "../../clock";
import { seededInt, seededPick, seededSample } from "../../random";
import { ADMIN_PERSONA, STUDENTS, STUDENT_PERSONA, type DemoPerson } from "../../db/people";
import { QUIZ_BANK, type DemoMcq } from "../../db/quiz-bank";
import { CODING_PROBLEMS, type DemoCodingProblem } from "../../db/coding-bank";
import { COURSES } from "../../db/courses";

const MODULE = "assessment-admin";

// ── The question bank ───────────────────────────────────────────────────────

export interface BankQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  /** Uppercase on the wire; the take UI submits lowercase and the scorer folds case. */
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty_level: "Easy" | "Medium" | "Hard";
  topic: string;
  skills: string;
}

const LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Ids come from a module-level counter, exactly as the adaptive quiz bank does.
 * A module body runs once in a fixed order, so the same question always carries
 * the same id on the server and in the browser. A `Math.random` id here would
 * mean the answer key stopped matching the submitted sheet across a reload.
 */
let authoredSeq = 84_000;

function q(
  question_text: string,
  options: [string, string, string, string],
  correctIndex: number,
  difficulty_level: BankQuestion["difficulty_level"],
  topic: string,
  skills: string,
  explanation: string,
): BankQuestion {
  return {
    id: authoredSeq++,
    question_text,
    option_a: options[0],
    option_b: options[1],
    option_c: options[2],
    option_d: options[3],
    correct_option: LETTERS[correctIndex],
    explanation,
    difficulty_level,
    topic,
    skills,
  };
}

/** Reuse of the adaptive bank: the same questions an institution already owns. */
function fromAdaptiveBank(m: DemoMcq, topic: string): BankQuestion {
  return {
    id: m.id,
    question_text: m.question,
    option_a: m.options[0].label,
    option_b: m.options[1].label,
    option_c: m.options[2].label,
    option_d: m.options[3].label,
    correct_option: m.correct as BankQuestion["correct_option"],
    explanation: m.explanation,
    difficulty_level: m.difficulty,
    topic,
    skills: m.skill,
  };
}

/**
 * Questions this mission already owns, taken from a course's own bank.
 *
 * Every course in `db/quiz-bank.ts` carries an authored MCQ bank, and a recruiting
 * body building a mock does not write a fresh question when it has one on the
 * shelf. `pickFromBank` walks a course's bank ONCE and hands each question to the
 * first group whose skills claim it, so two sections of the same paper can never
 * be handed the same question, and a group whose skills have been renamed simply
 * gets fewer rather than borrowing another group's.
 *
 * The bank is read as `QUIZ_BANK[courseId] ?? []` and never by index. It is
 * authored per course by whoever owns that course, and a paper that indexed into
 * it would break silently the day a question was inserted: the answer key would
 * still be there, attached to a different question. Every section below also
 * carries questions authored in this file, so no section can empty out even if a
 * bank disappears entirely.
 */
function pickFromBank(
  courseId: number,
  groups: Array<{ topic: string; skills: string[]; limit: number }>,
): BankQuestion[][] {
  const bank = QUIZ_BANK[courseId] ?? [];
  const out: BankQuestion[][] = groups.map(() => []);
  for (const item of bank) {
    const skill = item.skill.trim().toLowerCase();
    const index = groups.findIndex(
      (group, i) =>
        out[i].length < group.limit && group.skills.some((s) => s.toLowerCase() === skill),
    );
    if (index >= 0) out[index].push(fromAdaptiveBank(item, groups[index].topic));
  }
  return out;
}

// ── Paper 901: TGPSC Group-II Mains ─────────────────────────────────────────

const [TG_GS_BANK, TG_HISTORY_BANK, TG_ECONOMY_BANK, TG_MOVEMENT_BANK] = pickFromBank(302, [
  {
    topic: "General Studies and General Abilities",
    skills: ["Science", "Data", "Disaster"],
    limit: 3,
  },
  {
    topic: "History, Polity and Society",
    skills: ["Ancient", "Kakatiya", "Fundamental", "Parliament", "Constitutional", "Tribe", "Education"],
    limit: 3,
  },
  { topic: "Economy and Development", skills: ["Agriculture", "Revenue"], limit: 2 },
  {
    topic: "Telangana Movement and State Formation",
    skills: ["Hyderabad", "Mulki", "Formula", "Reorganisation"],
    limit: 4,
  },
]);

const TG_GENERAL_STUDIES: BankQuestion[] = [
  q(
    "Which statement places the physiography of Telangana correctly?",
    [
      "The state sits almost entirely on the Deccan plateau and is drained by the Godavari in the north and the Krishna in the south",
      "The state lies in the coastal plain and has a long shoreline",
      "The state is drained mainly by the Cauvery system",
      "The state's highest relief is formed by the Western Ghats",
    ],
    0,
    "Easy",
    "General Studies and General Abilities",
    "Geography",
    "Telangana is a landlocked plateau state and its two major basins are the Godavari and the Krishna. The coastal answer is the one candidates pick from memory of undivided Andhra Pradesh, which did have a coastline; the state formed in 2014 does not.",
  ),
  q(
    "The National Green Tribunal was set up to do what?",
    [
      "Advise the Union government on forest policy",
      "Hear and decide cases involving substantial questions relating to the environment and the enforcement of environmental legal rights",
      "Prosecute polluting industries in place of the criminal courts",
      "Frame the emission and effluent standards that industries must meet",
    ],
    1,
    "Medium",
    "General Studies and General Abilities",
    "Environment",
    "The tribunal is a specialised judicial body with its own jurisdiction over environmental disputes. Framing standards is the work of the pollution control boards, and that is the option that catches candidates who remember only that the tribunal deals with pollution.",
  ),
  q(
    "In a certain code each letter is replaced by the letter that follows it in the alphabet. What is the code for WARANGAL?",
    ["XBSBOHBM", "VZQZMFZK", "XBTBOHBM", "XBSBNHBM"],
    0,
    "Medium",
    "General Studies and General Abilities",
    "Mental Ability",
    "W becomes X, A becomes B, R becomes S, and so on to L becoming M, which gives XBSBOHBM. The second option applies the same rule backwards, which is the commonest way this question is lost: the rule is read correctly and then run in the wrong direction.",
  ),
  q(
    "Why does a person feel colder in wet clothes than in dry ones at the same air temperature?",
    [
      "Water conducts heat away from the body far faster than air does, and the evaporation that follows removes more heat still",
      "Wet cloth reflects the body's own heat away from the skin",
      "Water lowers the temperature of the air immediately around the body",
      "Wet cloth has a higher specific heat, so it absorbs and stores the body's heat",
    ],
    0,
    "Easy",
    "General Studies and General Abilities",
    "General Science",
    "Two mechanisms act together: conduction through water, which is many times better than through still air, and evaporative cooling. The specific heat answer sounds technical and is the attractive wrong one, but a body loses heat because water carries it away, not because the cloth stores it.",
  ),
  ...TG_GS_BANK,
];

const TG_HISTORY_POLITY: BankQuestion[] = [
  q(
    "The Election Commission of India functions today as a three-member body. What decides how many Election Commissioners there are?",
    [
      "A schedule to the Constitution fixes the number at three",
      "The President fixes the number from time to time under Article 324",
      "Parliament fixes it by resolution whenever a Commissioner retires",
      "The Chief Election Commissioner co-opts members as the work requires",
    ],
    1,
    "Medium",
    "History, Polity and Society",
    "Indian Polity",
    "Article 324 names only the Chief Election Commissioner and leaves the number of other Commissioners to the President. That is why the Commission has been a single-member body at some periods and a multi-member one at others. The schedule answer is attractive because most fixed numbers in the Constitution do sit in one.",
  ),
  q(
    "Public order and police appear in which of the three legislative lists?",
    ["The Union List", "The State List", "The Concurrent List", "Neither list, they fall under residuary powers"],
    1,
    "Easy",
    "History, Polity and Society",
    "Indian Polity",
    "Both entries sit in the State List, which is why a state recruitment board and not a central commission fills constable and sub-inspector posts. The Concurrent List is the tempting answer because criminal law and criminal procedure genuinely are there, and candidates carry that across to policing.",
  ),
  q(
    "The Qutb Shahi dynasty is associated above all with the founding of which city?",
    ["Warangal", "Hyderabad", "Bidar", "Nizamabad"],
    1,
    "Medium",
    "History, Polity and Society",
    "Medieval History",
    "The dynasty ruled first from the fort at Golconda and laid out Hyderabad on the Musi when the fort settlement outgrew its water supply. Warangal is the Kakatiya capital, and it is the answer chosen by candidates who file every Telangana dynasty under one city.",
  ),
  ...TG_HISTORY_BANK,
];

const TG_ECONOMY: BankQuestion[] = [
  q(
    "India's national income aggregates are compiled and published by",
    [
      "the Reserve Bank of India",
      "the National Statistical Office",
      "NITI Aayog",
      "the Comptroller and Auditor General",
    ],
    1,
    "Easy",
    "Economy and Development",
    "Indian Economy",
    "National accounts are the statutory work of the National Statistical Office under the statistics ministry. The Reserve Bank is the attractive wrong answer because its bulletins reproduce the same series, but reproducing a number is not compiling it.",
  ),
  q(
    "In a government budget, what does the fiscal deficit measure?",
    [
      "The gap between revenue receipts and revenue expenditure",
      "Total expenditure less all receipts other than borrowings, that is, how much the government must borrow in the year",
      "The excess of imports over exports",
      "The interest payable on borrowing already outstanding",
    ],
    1,
    "Medium",
    "Economy and Development",
    "Public Finance",
    "The fiscal deficit is the borrowing requirement, which is why it is quoted as a share of GDP. The first option is the revenue deficit, and swapping the two is the single commonest error on this topic.",
  ),
  q(
    "Which of these is a state's own tax revenue?",
    [
      "The state's share of central taxes devolved on the Finance Commission's formula",
      "Grants-in-aid received from the Union",
      "State goods and services tax, stamp duty and state excise",
      "Market borrowing raised by the state",
    ],
    2,
    "Medium",
    "Economy and Development",
    "Public Finance",
    "Own tax revenue is what the state raises under its own taxing powers. The first two are transfers and the last is a liability, so none of them is revenue the state has itself raised, however large they are in the accounts.",
  ),
  q(
    "Mission Kakatiya, as a programme, was built around which asset?",
    [
      "Minor irrigation tanks",
      "Rural link roads",
      "Household drinking water connections",
      "Lift irrigation from the Godavari",
    ],
    0,
    "Easy",
    "Economy and Development",
    "Telangana Development",
    "The programme is the restoration of minor irrigation tanks: desilting, bund repair and the recovery of feeder channels. Mission Bhagiratha is the drinking water programme, and the two names are the pair most often exchanged for each other in an answer sheet.",
  ),
  ...TG_ECONOMY_BANK,
];

const TG_MOVEMENT: BankQuestion[] = [
  q(
    "The Gentlemen's Agreement of 1956 was entered into at the time of",
    [
      "the merger of Hyderabad State into the Indian Union",
      "the formation of Andhra Pradesh by joining Telangana to Andhra State",
      "the announcement of the Six Point Formula",
      "the bifurcation of Andhra Pradesh",
    ],
    1,
    "Medium",
    "Telangana Movement and State Formation",
    "Telangana Movement",
    "The agreement set out safeguards for the Telangana region inside the new state, covering employment, education and the spending of the region's surpluses. The 1948 merger is the attractive wrong answer because it is the other famous date in the same decade, but the agreement belongs to the formation of Andhra Pradesh.",
  ),
  q(
    "The 1969 agitation began as a demand for what, before it became a demand for statehood?",
    [
      "The implementation of the safeguards already promised to Telangana, the service rules above all",
      "The abolition of the jagirdari system",
      "A separate high court for the region",
      "The transfer of Hyderabad city to central administration",
    ],
    0,
    "Hard",
    "Telangana Movement and State Formation",
    "Telangana Movement",
    "The trigger was non-implementation: posts reserved for local candidates were held by others and the safeguards had no machinery behind them. Statehood became the demand only once that route was seen to have failed. Jagirdari abolition belongs to the years immediately after the 1948 merger.",
  ),
  ...TG_MOVEMENT_BANK,
];

// ── Paper 902: IBPS PO prelims ──────────────────────────────────────────────

const [IBPS_ENGLISH_BANK, IBPS_QUANT_BANK, IBPS_REASONING_BANK] = pickFromBank(307, [
  { topic: "English Language", skills: ["Error", "Comprehension"], limit: 2 },
  {
    topic: "Quantitative Aptitude",
    skills: ["Approximation", "Series", "Quadratic", "Graphs", "Caselet"],
    limit: 4,
  },
  { topic: "Reasoning Ability", skills: ["Syllogism", "Puzzles", "Inequality"], limit: 3 },
]);

const IBPS_ENGLISH: BankQuestion[] = [
  q(
    "Fill in the blank. The branch manager, along with two field officers, ____ attending the district review meeting.",
    ["are", "is", "were", "have been"],
    1,
    "Easy",
    "English Language",
    "Grammar",
    "A phrase introduced by 'along with' is parenthetical and does not change the subject, which stays the singular 'branch manager'. The plural verbs are attractive because two plural nouns sit immediately before the blank.",
  ),
  q(
    "Choose the word that best completes the sentence. The committee's report was ____ about the delay, naming both the cause and the officer responsible.",
    ["vague", "candid", "evasive", "tentative"],
    1,
    "Medium",
    "English Language",
    "Vocabulary",
    "Naming the cause and the person is the opposite of vague, evasive and tentative, so only 'candid' matches the behaviour the sentence describes. The other three are near-synonyms of one another, which is the signal that they are the distractors.",
  ),
  q(
    "Choose the best replacement for the underlined part. Hardly had the officer reached the counter than the shutter came down.",
    ["than the shutter came down", "when the shutter came down", "then the shutter came down", "No improvement required"],
    1,
    "Medium",
    "English Language",
    "Sentence Improvement",
    "The fixed pairs are 'hardly ... when' and 'no sooner ... than'. Mixing them is exactly the error this question is set to catch, and it survives a quick reading because the sentence still sounds ordinary.",
  ),
  q(
    "A passage says that a scheme 'did not fail for want of money'. What does the sentence imply?",
    [
      "The scheme did not fail",
      "The scheme failed, and the cause was something other than funding",
      "The scheme had more money than it could use",
      "The scheme's funds were withheld",
    ],
    1,
    "Hard",
    "English Language",
    "Comprehension",
    "The sentence concedes the failure and rules out one cause for it. The first option ignores the concession, and it is the commonest misreading in inference questions: the candidate answers the half of the sentence that is easier to hold in mind.",
  ),
  ...IBPS_ENGLISH_BANK,
];

const IBPS_QUANT: BankQuestion[] = [
  q(
    "A candidate scores 45 marks and fails by 15 marks. The pass mark is 30 per cent of the total. What is the total?",
    ["150", "180", "200", "240"],
    2,
    "Medium",
    "Quantitative Aptitude",
    "Percentages",
    "The pass mark is 45 plus 15, that is 60, and 60 is 30 per cent of the total, so the total is 200. Treating the 45 as the 30 per cent gives 150, which is why that number is placed first.",
  ),
  q(
    "A can finish a task in 12 days and B in 18 days. Working together, how long do they take?",
    ["6 days", "7 and 1/5 days", "7 and 1/2 days", "15 days"],
    1,
    "Medium",
    "Quantitative Aptitude",
    "Time and Work",
    "Add the rates and not the days: one twelfth plus one eighteenth is five thirty-sixths, so the pair finish in thirty-six fifths of a day. Averaging the two times gives 15, which is the answer this question exists to catch.",
  ),
  q(
    "The candidates who cleared a screening test and those who did not are in the ratio 3 to 7. If 1,200 candidates appeared, how many cleared?",
    ["300", "360", "420", "840"],
    1,
    "Easy",
    "Quantitative Aptitude",
    "Ratio and Proportion",
    "The ratio divides the whole into ten parts, so those who cleared are three tenths of 1,200, that is 360. The 840 is the other side of the same ratio and is what a candidate reports after reading the two terms in the wrong order.",
  ),
  ...IBPS_QUANT_BANK,
];

const IBPS_REASONING: BankQuestion[] = [
  q(
    "A candidate walks 5 km north, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point and in which direction?",
    ["3 km east", "3 km west", "13 km east", "5 km south"],
    0,
    "Easy",
    "Reasoning Ability",
    "Direction Sense",
    "The two 5 km legs are in opposite directions and cancel, leaving only the 3 km leg to the east. The 13 km option is the total distance walked, which is what the question deliberately does not ask for.",
  ),
  q(
    "Pointing at a photograph, a candidate said, 'He is the only son of my mother's only brother.' How is the man in the photograph related to her?",
    ["Her brother", "Her cousin", "Her nephew", "Her maternal uncle"],
    1,
    "Medium",
    "Reasoning Ability",
    "Blood Relations",
    "Her mother's only brother is her maternal uncle, and his only son is her cousin. Reading the sentence as though it described her mother's son produces 'brother', which is the slip the phrasing is built to invite.",
  ),
  q(
    "In a row of 40 candidates, Ravi stands 12th from the left. What is his position from the right?",
    ["28th", "29th", "30th", "31st"],
    1,
    "Easy",
    "Reasoning Ability",
    "Ranking",
    "The two counts both include Ravi, so his position from the right is 40 minus 12 plus 1, that is 29th. Dropping the plus one gives 28, which is the standard wrong answer in this family of questions.",
  ),
  q(
    "Which of these does not belong with the others?",
    ["Godavari", "Krishna", "Musi", "Nagarjuna Sagar"],
    3,
    "Medium",
    "Reasoning Ability",
    "Classification",
    "Three are rivers and the fourth is a reservoir built on one of them, so the odd one out is Nagarjuna Sagar. The Musi is the tempting answer because it is much the smallest of the three, but size is not what the classification turns on.",
  ),
  ...IBPS_REASONING_BANK,
];

// ── Paper 903: Telangana police preliminary written test ────────────────────

const [POLICE_ARITHMETIC_BANK, POLICE_GS_BANK] = pickFromBank(305, [
  {
    topic: "Arithmetic and Reasoning",
    skills: ["Averages", "Interest", "Speed", "Data", "Series"],
    limit: 5,
  },
  { topic: "General Studies", skills: ["Polity", "Telangana", "Geography"], limit: 3 },
]);

const POLICE_ARITHMETIC: BankQuestion[] = [
  q(
    "A patrol vehicle covers 210 km in 3 hours 30 minutes. What is its average speed?",
    ["55 km/h", "60 km/h", "65 km/h", "70 km/h"],
    1,
    "Easy",
    "Arithmetic and Reasoning",
    "Speed and Distance",
    "Convert the time to hours first: 210 divided by 3.5 is 60. Dividing by 3 and ignoring the half hour gives 70, which is the number this question is set to collect.",
  ),
  q(
    "Of 2,500 candidates who appeared for a written test, 8 per cent were absent from the second session. How many attended the second session?",
    ["200", "2,300", "2,308", "2,400"],
    1,
    "Easy",
    "Arithmetic and Reasoning",
    "Percentages",
    "Eight per cent of 2,500 is 200, so 2,300 attended. The 200 is the number absent, and it is placed first because a candidate reading in a hurry answers the calculation rather than the question.",
  ),
  q(
    "One term in this series is wrong: 5, 11, 23, 47, 96, 191. Which one?",
    ["11", "23", "96", "191"],
    2,
    "Medium",
    "Arithmetic and Reasoning",
    "Number Series",
    "Each term is twice the previous one plus one, which gives 5, 11, 23, 47, 95, 191. So the wrong term is 96 and not 191: 191 follows correctly from 95, which is what makes the last term look guilty at first glance.",
  ),
  ...POLICE_ARITHMETIC_BANK,
];

const POLICE_GENERAL_STUDIES: BankQuestion[] = [
  q(
    "Recruitment to the posts of Constable and Sub-Inspector in Telangana is conducted by",
    [
      "the Telangana Public Service Commission",
      "the state level police recruitment board",
      "the office of the Director General of Police",
      "the Staff Selection Commission",
    ],
    1,
    "Easy",
    "General Studies",
    "Recruitment Structure",
    "Police recruitment is separated from the general state services examination and given to a dedicated board, which is why its notification, its physical events and its calendar are all its own. The Public Service Commission conducts the Group services, and that is the body candidates name by default.",
  ),
  q(
    "The Quit India resolution was passed in which year?",
    ["1930", "1935", "1942", "1947"],
    2,
    "Easy",
    "General Studies",
    "Modern History",
    "The resolution was adopted at the Bombay session in 1942. The other three dates crowd the same span of memory: 1930 is the Salt Satyagraha and 1935 the Government of India Act, and a candidate who has revised them together often reaches for the wrong one.",
  ),
  q(
    "Which vitamin does the human body produce in the skin on exposure to sunlight?",
    ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    2,
    "Easy",
    "General Studies",
    "General Science",
    "Ultraviolet light converts a cholesterol derivative in the skin into vitamin D. Vitamin K is the usual wrong answer because it is the other fat soluble vitamin candidates remember, but it comes from diet and from gut bacteria, not from sunlight.",
  ),
  q(
    "Which is the longest river flowing through Telangana?",
    ["The Krishna", "The Godavari", "The Musi", "The Manjeera"],
    1,
    "Easy",
    "General Studies",
    "Geography",
    "The Godavari crosses the northern districts and is the larger of the state's two major basins. The Musi and the Manjeera are tributaries within those basins rather than basins of their own, which is why neither can be the answer.",
  ),
  q(
    "The Comptroller and Auditor General submits audit reports relating to the accounts of the Union to",
    [
      "the Prime Minister",
      "the President, who causes them to be laid before each House of Parliament",
      "the Finance Ministry",
      "the Supreme Court",
    ],
    1,
    "Medium",
    "General Studies",
    "Indian Polity",
    "The reports go to the President and from there to Parliament, and that route is what keeps the auditor outside the executive it audits. The Finance Ministry is the attractive wrong answer precisely because it is among the departments whose accounts are being audited.",
  ),
  q(
    "One hectare is equal to",
    ["100 square metres", "1,000 square metres", "10,000 square metres", "1,00,000 square metres"],
    2,
    "Medium",
    "General Studies",
    "Measurement",
    "A hectare is a square 100 metres on a side, so 10,000 square metres, which is about two and a half acres. The 100 square metre answer is an are, and the two units are confused because the names look related.",
  ),
  ...POLICE_GS_BANK,
];

// ── Paper 904: SSC CGL Tier-I ───────────────────────────────────────────────

const [SSC_REASONING_BANK, SSC_AWARENESS_BANK, SSC_QUANT_BANK, SSC_ENGLISH_BANK] = pickFromBank(
  303,
  [
    { topic: "General Intelligence and Reasoning", skills: ["Series", "Syllogism"], limit: 2 },
    { topic: "General Awareness", skills: ["Polity", "Chemistry", "Hardware"], limit: 3 },
    {
      topic: "Quantitative Aptitude",
      skills: ["Discount", "Alligation", "Compound", "Algebra", "Circles", "Heights"],
      limit: 4,
    },
    { topic: "English Comprehension", skills: ["Grammar", "Jumbles"], limit: 2 },
  ],
);

const SSC_REASONING: BankQuestion[] = [
  q(
    "Complete the analogy. CAT is to DBU as DOG is to",
    ["EPH", "EPI", "DPH", "CNF"],
    0,
    "Easy",
    "General Intelligence and Reasoning",
    "Analogy",
    "Every letter moves one place forward, so DOG becomes EPH. CNF applies the same rule backwards, which is the mistake a candidate makes after checking the pattern on only the first letter.",
  ),
  q(
    "In a certain month the 3rd falls on a Monday. What day is the 24th of the same month?",
    ["Sunday", "Monday", "Tuesday", "Wednesday"],
    1,
    "Medium",
    "General Intelligence and Reasoning",
    "Calendars",
    "The gap is 21 days, which is exactly three weeks, so the day repeats and the 24th is also a Monday. Counting the 21 days and then adding one more is the usual slip, and it produces Tuesday.",
  ),
  q(
    "Which of these does not belong with the others?",
    ["Square", "Rectangle", "Rhombus", "Cube"],
    3,
    "Easy",
    "General Intelligence and Reasoning",
    "Classification",
    "Three are plane figures and the fourth is a solid, so the cube is the odd one out. The rhombus attracts the eye because it is the only one of the four without right angles, but that is a property of a figure and not a change of class.",
  ),
  ...SSC_REASONING_BANK,
];

const SSC_AWARENESS: BankQuestion[] = [
  q(
    "How often does the Constitution require a Finance Commission to be constituted?",
    ["Every third year", "Every fifth year, or earlier if the President considers it necessary", "Every seventh year", "Every tenth year"],
    1,
    "Medium",
    "General Awareness",
    "Indian Polity",
    "Article 280 requires the President to constitute one at the expiration of every fifth year or earlier. The five year plan is a different instrument from a different body, and the shared number is what makes candidates answer from the wrong memory.",
  ),
  q(
    "Which of these is listed as a fundamental duty rather than as a fundamental right?",
    [
      "Freedom of speech and expression",
      "Equality before the law",
      "To protect and improve the natural environment",
      "Protection of life and personal liberty",
    ],
    2,
    "Medium",
    "General Awareness",
    "Indian Polity",
    "Protecting the environment is one of the duties in Article 51A, which are not enforceable in the way the Part III rights are. The confusion is genuine and not careless: the courts have read a right to a healthy environment into Article 21, so the subject appears on both sides.",
  ),
  ...SSC_AWARENESS_BANK,
];

const SSC_QUANT: BankQuestion[] = [
  q(
    "A train 180 m long crosses a pole in 9 seconds. What is its speed in km/h?",
    ["54", "64", "72", "80"],
    2,
    "Medium",
    "Quantitative Aptitude",
    "Speed and Distance",
    "Crossing a pole means covering the train's own length, so the speed is 20 metres a second, and multiplying by 18/5 gives 72 km/h. Converting with 5/18 instead runs the change of units the wrong way and produces a speed far too small to be a train.",
  ),
  ...SSC_QUANT_BANK,
];

const SSC_ENGLISH: BankQuestion[] = [
  q(
    "Choose the word closest in meaning to MITIGATE.",
    ["aggravate", "lessen", "postpone", "conceal"],
    1,
    "Easy",
    "English Comprehension",
    "Vocabulary",
    "To mitigate is to make less severe. 'Aggravate' is its opposite and is placed first because it looks and sounds related, which is enough for a candidate moving at Tier-I pace to pick it.",
  ),
  q(
    "What does the idiom 'to turn a blind eye' mean?",
    ["To lose one's sight", "To pretend not to notice", "To refuse an offer outright", "To look away in fear"],
    1,
    "Easy",
    "English Comprehension",
    "Idioms",
    "The idiom is about ignoring something deliberately, usually something one has a duty to act on. The literal reading about sight is the distractor, and idiom questions are set precisely to separate the two readings.",
  ),
  q(
    "One word for 'government by officials' is",
    ["aristocracy", "bureaucracy", "democracy", "autocracy"],
    1,
    "Medium",
    "English Comprehension",
    "One Word Substitution",
    "Bureau plus cracy is rule from the desk, that is, by officials. 'Autocracy' is rule by a single person and is the answer a candidate gives after reading only the ending of the word.",
  ),
  ...SSC_ENGLISH_BANK,
];

// ── Paper 905: solar PV trade theory ────────────────────────────────────────

const [SOLAR_SURVEY_BANK, SOLAR_EQUIPMENT_BANK, SOLAR_SAFETY_BANK] = pickFromBank(311, [
  {
    topic: "Site survey and sizing",
    skills: ["Power", "Survey", "Bill", "MPPT", "Temperature", "Ratio"],
    limit: 4,
  },
  {
    topic: "Modules, inverters and balance of system",
    skills: ["Nameplate", "Microinverters", "Connectors", "Batteries"],
    limit: 3,
  },
  {
    topic: "Mounting, earthing and safety",
    skills: ["Ballasted", "Wind", "Harness", "Fuses", "RCCB", "Earthing"],
    limit: 4,
  },
]);

const SOLAR_SURVEY: BankQuestion[] = [
  q(
    "A rooftop array is being planned on the assumption of about 4 units per kW on a clear day. On that assumption, roughly how many units should a 3 kW array make on such a day?",
    ["3 units", "4 units", "12 units", "30 units"],
    2,
    "Easy",
    "Site survey and sizing",
    "Sizing",
    "The yield figure is per kW of installed capacity, so it is multiplied by the size of the array: three times four is twelve. Reading the 4 units as the whole plant's output makes a 3 kW array look no better than a 1 kW one, which is the error that produces an unhappy owner three months later.",
  ),
  q(
    "Why are the roof's true orientation and tilt measured during the survey rather than assumed?",
    [
      "Because the distribution company asks for them on the application form",
      "Because the annual yield changes with orientation and tilt, and both the sizing and the payback quoted to the owner are calculated from that yield",
      "Because the modules have to face the road",
      "Because tilt decides which make of inverter can be used",
    ],
    1,
    "Medium",
    "Site survey and sizing",
    "Survey",
    "Orientation and tilt decide how much of the available radiation the array actually collects, so an assumption made at survey stage travels straight through to the generation estimate and the payback. The form does ask for them, but a form is a consequence of the reason and not the reason itself.",
  ),
  ...SOLAR_SURVEY_BANK,
];

const SOLAR_EQUIPMENT: BankQuestion[] = [
  q(
    "Two modules with different current ratings are wired into the same series string. What happens?",
    [
      "The string current settles at the higher of the two ratings",
      "The string current is held down to what the lower-rated module can pass, so the better module cannot deliver what it is capable of",
      "The two module voltages cancel each other",
      "The inverter compensates and nothing is lost",
    ],
    1,
    "Medium",
    "Modules, inverters and balance of system",
    "Strings",
    "Elements in series carry one common current, so the weakest module in the string sets it, which is the whole reason a string is built from identical modules. The inverter tracks the maximum power point of what it is given; it cannot recover current the string never produced.",
  ),
  q(
    "Why is the DC cable between the array and the inverter sized on voltage drop and not on current rating alone?",
    [
      "Because a longer cable carries more current",
      "Because the drop along the run is lost generation every day the plant works, and a cable that is thermally adequate can still drop more than the design allows",
      "Because the inverter will not start on a thin cable",
      "Because the voltage drop decides the fuse rating",
    ],
    1,
    "Hard",
    "Modules, inverters and balance of system",
    "Cabling",
    "A conductor can be perfectly safe on temperature and still waste output over a long roof run, and that waste repeats every day for the life of the plant. The fuse is selected against fault current, which is a separate calculation with a separate purpose.",
  ),
  ...SOLAR_EQUIPMENT_BANK,
];

const SOLAR_SAFETY: BankQuestion[] = [
  q(
    "Before working on the DC side of an installed array in daylight, what must the technician do first?",
    [
      "Isolate the AC side alone, since that is where the mains voltage is",
      "Isolate at the DC isolator and then prove with an instrument that the conductors are dead, because modules generate whenever light falls on them",
      "Cover the modules with a cloth and begin work",
      "Wait until the inverter display goes blank",
    ],
    1,
    "Easy",
    "Mounting, earthing and safety",
    "Safety",
    "An array cannot be switched off at source, so isolation has to be proved and not assumed. A blank inverter display tells you the inverter has stopped, which is not the same statement as the DC conductors being dead, and that is the assumption behind most DC side accidents.",
  ),
  q(
    "Why is a rooftop array bonded into the building's existing earthing system rather than given an electrode of its own?",
    [
      "To save the cost of a second electrode",
      "Because two separate earths can sit at different potentials during a fault or a surge, and anyone touching both becomes the path between them",
      "Because the distribution company does not permit a second electrode",
      "Because a single electrode carries lightning current better",
    ],
    1,
    "Hard",
    "Mounting, earthing and safety",
    "Earthing",
    "Equipotential bonding is the point of the rule: separate electrodes can differ in potential exactly when it matters most, and the person bridging them completes the circuit. The saving in cost is real but it is a consequence, not the reason the standard is written that way.",
  ),
  ...SOLAR_SAFETY_BANK,
];

// ── Paper 906: rural enterprise readiness ───────────────────────────────────

const [ENTERPRISE_IDEA_BANK, ENTERPRISE_RECORDS_BANK] = pickFromBank(316, [
  { topic: "Enterprise idea and costing", skills: ["Demand", "Enterprises", "Costing", "Break-even", "Plan"], limit: 4 },
  { topic: "Registration, records and finance", skills: ["Udyam", "Proprietorship", "Separating", "Cash"], limit: 2 },
]);

const [ENTERPRISE_FINANCE_BANK] = pickFromBank(317, [
  { topic: "Registration, records and finance", skills: ["SHG", "Linkage", "Bankable", "Collateral"], limit: 3 },
]);

const ENTERPRISE_IDEA: BankQuestion[] = [
  q(
    "You sell 400 packets a month at ₹50 each. The variable cost is ₹30 a packet and the fixed costs are ₹6,000 a month. What is the monthly profit?",
    ["₹2,000", "₹6,000", "₹8,000", "₹14,000"],
    0,
    "Medium",
    "Enterprise idea and costing",
    "Costing",
    "Each packet contributes ₹20, so 400 packets contribute ₹8,000, and the ₹6,000 of fixed cost comes out of that, leaving ₹2,000. The ₹8,000 is the contribution and not the profit, and reporting it as profit is the commonest reason a unit believes it is doing better than it is.",
  ),
  q(
    "Why does a bank ask a first-time borrower for a cash flow statement and not only a profit projection?",
    [
      "Because profit is taxed and cash is not",
      "Because a unit can be profitable over the year and still be unable to meet an instalment in a month when the money has not yet come in",
      "Because cash flow is easier for the branch to verify",
      "Because profit projections are not accepted by any bank",
    ],
    1,
    "Medium",
    "Enterprise idea and costing",
    "Working Capital",
    "An instalment is paid out of cash, not out of profit, and the gap between making a sale and collecting it is where a small unit runs aground. Profit projections are accepted; they simply do not answer the question of timing, which is what the repayment schedule turns on.",
  ),
  ...ENTERPRISE_IDEA_BANK,
];

const ENTERPRISE_RECORDS: BankQuestion[] = [
  q(
    "Keeping the household's money and the enterprise's money in separate books matters most because",
    [
      "the law requires every enterprise to hold two bank accounts",
      "without it you cannot tell whether the unit is earning or the household is simply spending less, and neither can a lender",
      "it reduces the tax payable by the enterprise",
      "it is a condition for registering the enterprise",
    ],
    1,
    "Easy",
    "Registration, records and finance",
    "Record Keeping",
    "Mixing the two hides the unit's own result, which is the first thing a lender looks for and the first thing an owner stops being able to see. Registration asks for details of the enterprise; it does not audit the household, so the compliance answer is a guess dressed as a rule.",
  ),
  ...ENTERPRISE_RECORDS_BANK,
  ...ENTERPRISE_FINANCE_BANK,
];

export interface WrittenQuestion {
  id: number;
  question_text: string;
  evaluation_prompt: string;
  max_marks: number;
  question_type: string;
  answer_mode: string;
  topic: string;
  skills: string;
  difficulty_level: string;
}

let writtenSeq = 86_000;
function written(
  question_text: string,
  evaluation_prompt: string,
  max_marks: number,
  topic: string,
  skills: string,
): WrittenQuestion {
  return {
    id: writtenSeq++,
    question_text,
    evaluation_prompt,
    max_marks,
    question_type: "long_answer",
    answer_mode: "text",
    topic,
    skills,
    difficulty_level: "Medium",
  };
}

/**
 * The descriptive bank.
 *
 * This is the replacement for the coding round the software build seeded here. A
 * descriptive answer marked against a rubric is what Group-I mains and the second
 * phase of the RBI Grade-B examination actually set, and it is the only part of
 * this module that a faculty member marks by hand, which is what gives the manual
 * evaluation queue something real to hold.
 *
 * Every evaluation prompt below tells the marker NOT to credit a quoted scheme
 * amount, interest rate or subsidy figure. Those are revised by notification, a
 * candidate who memorises them is being taught to fail, and a rubric that rewards
 * them would put this platform on the wrong side of the same problem.
 */
const WRITTEN_BANK: WrittenQuestion[] = [
  written(
    "A woman in your mandal wants to start a millet processing unit and borrow from her branch. Set out, in order, the questions you would answer before the proposal is worth putting to the bank.",
    "Award marks for starting with demand and the price actually realised rather than with the machine, for a working capital cycle that says how long money stays tied up between buying grain and collecting payment, and for a repayment schedule tied to cash rather than to profit. A list of documents with no reasoning about the enterprise is half marks. Do not credit a quoted subsidy amount, margin percentage or rate of interest: those change with every notification and the candidate is not being examined on them.",
    10,
    "Enterprise proposal",
    "Enterprise planning, Working capital",
  ),
  written(
    "Your self-help group has been saving regularly for a year. Explain what has to be true before the bank will consider a credit limit for the group, and what the group itself can do about each condition.",
    "Look for the savings record, the record of internal lending and the grading exercise, named in that order, and for a clear distinction between the group's own corpus and the limit the bank sanctions against it. Full marks need a practical action against each condition rather than a restatement of the condition. Naming a subsidy or a rate earns nothing.",
    10,
    "Credit linkage",
    "SHG linkage, Access to finance",
  ),
  written(
    "A trainee tells you his unit made a profit last year but he could not pay two instalments. Explain how both statements can be true at once, and say what you would change in the way he runs the unit.",
    "Full marks require the distinction between profit and cash, a concrete mechanism for the gap (sales on credit, stock built ahead of a season, an advance paid to a supplier), and at least one change inside the owner's own control, such as collection terms or the order in which stock is bought. An answer that only says 'he needs more capital' is a quarter of the marks, because it moves the problem rather than diagnosing it.",
    15,
    "Cash and profit",
    "Record keeping, Working capital",
  ),
  written(
    "Telangana's minor irrigation tanks carried its agrarian economy long before canal and lift systems arrived. Examine why they declined, and assess what a restoration programme can and cannot put back.",
    "Marks for the mechanism of decline (siltation, encroachment of the tank bed and the feeder channels, and the shift of the command area to borewells) and for the groundwater consequence of that shift. The assessment half needs a genuine limit: a desilted tank does not by itself restore the village institution that once maintained it, nor the rainfall that fills it. A descriptive list of tank types with no argument is a third of the marks.",
    15,
    "Telangana development",
    "Economy and development, Irrigation",
  ),
  written(
    "Transmission of a change in the policy repo rate to the rates borrowers actually pay has been described as slow and incomplete. Explain the channels through which transmission is expected to work, and why the cost of deposits slows it.",
    "Look for the distinction between the policy rate and the cost of funds a bank actually carries, for at least two channels named and described correctly, and for the central point that a large share of deposits is contracted at a fixed rate for a fixed term, so the liability side re-prices later than the asset side. The marks are for the mechanism. A candidate who quotes a current policy rate should not be credited for it, and should be told why in the feedback.",
    15,
    "Monetary policy",
    "Banking awareness, Economy",
  ),
];

/** The descriptive section of paper 906. */
const ENTERPRISE_WRITTEN = [WRITTEN_BANK[0], WRITTEN_BANK[1], WRITTEN_BANK[2]];

/** Every MCQ this institution owns, keyed by id. The answer key and the library. */
const MCQ_BY_ID = new Map<number, BankQuestion>();
for (const list of [
  FS_HTTP,
  FS_LANGUAGE,
  FS_REACT,
  DSA_COMPLEXITY,
  DSA_ARRAYS,
  DSA_GRAPHS,
  PY_PANDAS,
  COMP_SYSTEMS,
  COMP_CLOUD,
]) {
  for (const item of list) MCQ_BY_ID.set(item.id, item);
}

const WRITTEN_BY_ID = new Map<number, WrittenQuestion>(WRITTEN_BANK.map((w) => [w.id, w]));

// ── Coding problems ─────────────────────────────────────────────────────────

/** Bank problems get a stable id so a section can reference one without cloning it. */
const CODING_ID_BASE = 91_000;
const codingId = (index: number) => CODING_ID_BASE + index;
const codingIndex = (id: number) => id - CODING_ID_BASE;

function codingById(id: number): DemoCodingProblem | undefined {
  return CODING_PROBLEMS[codingIndex(id)];
}

/** Wire shape for a coding problem inside an assessment section. */
function codingProblemApi(id: number) {
  const p = codingById(id);
  if (!p) throw notFound("Coding problem not found");
  return {
    id,
    title: p.title,
    problem_statement: p.statement,
    difficulty_level: p.difficulty,
    input_format: p.inputFormat,
    output_format: p.outputFormat,
    sample_input: p.sampleInput,
    sample_output: p.sampleOutput,
    constraints: p.constraints,
    tags: p.skills.join(", "),
    topic: p.topic,
    skills: p.skills.join(", "),
    programming_language: "javascript",
    template_code: p.templates,
    test_cases: p.tests
      .filter((t) => !t.hidden)
      .map((t) => ({ input: t.args.map((a) => JSON.stringify(a)).join(", "), expected_output: JSON.stringify(t.expected) })),
    time_limit: 5,
    memory_limit: 256,
  };
}

// ── The catalogue ───────────────────────────────────────────────────────────

const MCQ_MARKS = 4;
const CODING_MARKS = 20;

export type SectionType = "quiz" | "coding" | "subjective";

export interface SectionSpec {
  id: number;
  type: SectionType;
  title: string;
  description: string;
  order: number;
  /** Per-section cap in minutes, or null for "share the paper's clock". */
  timeLimitMinutes: number | null;
  /** MCQ ids for a quiz section, coding ids for a coding one, written ids for a subjective one. */
  questionIds: number[];
}

export interface AssessmentSpec {
  id: number;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  proctoringEnabled: boolean;
  evaluationMode: "auto" | "manual";
  allowMovement: boolean;
  isDraft: boolean;
  isActive: boolean;
  certificateAvailable: boolean;
  passLower: string | null;
  passUpper: string | null;
  tabSwitchLimit: number | null;
  aiGenerated: boolean;
  courseIds: number[];
  /** Null start means "open now"; a future start is a scheduled paper. */
  startTime: string | null;
  endTime: string | null;
  /** Cohort size the seeded submissions are drawn from. */
  cohortSize: number;
  sections: SectionSpec[];
}

const marksForQuestion = (sectionType: SectionType, questionId: number): number => {
  if (sectionType === "coding") return CODING_MARKS;
  if (sectionType === "subjective") return lookupWritten(questionId)?.max_marks ?? 10;
  return MCQ_MARKS;
};

export function sectionMaxMarks(section: SectionSpec): number {
  return section.questionIds.reduce((sum, id) => sum + marksForQuestion(section.type, id), 0);
}

export function assessmentMaxMarks(spec: AssessmentSpec): number {
  return spec.sections.reduce((sum, s) => sum + sectionMaxMarks(s), 0);
}

export function assessmentQuestionCount(spec: AssessmentSpec): number {
  return spec.sections.reduce((sum, s) => sum + s.questionIds.length, 0);
}

const ids = (list: BankQuestion[] | WrittenQuestion[]) => list.map((x) => x.id);

const BASE_ASSESSMENTS: AssessmentSpec[] = [
  {
    id: 901,
    slug: "full-stack-mid-programme",
    title: "Full-Stack Engineering — Mid-Programme Assessment",
    description:
      "A timed paper covering the first half of the Full-Stack track: HTTP and the request " +
      "lifecycle, JavaScript and TypeScript mechanics, React's rendering model, and a short " +
      "applied coding round.",
    instructions:
      "60 minutes, 17 questions across 4 sections. You may move freely between sections and flag " +
      "questions to revisit. The coding round runs your JavaScript against real test cases. The " +
      "paper submits itself when the timer ends, so there is no penalty for running out of time " +
      "on the last question.",
    durationMinutes: 60,
    proctoringEnabled: true,
    evaluationMode: "auto",
    allowMovement: true,
    isDraft: false,
    isActive: true,
    certificateAvailable: true,
    passLower: "40",
    passUpper: "75",
    tabSwitchLimit: 5,
    aiGenerated: false,
    courseIds: [201],
    startTime: null,
    endTime: null,
    cohortSize: 24,
    sections: [
      {
        id: 9011,
        type: "quiz",
        title: "HTTP and the request lifecycle",
        description: "Status codes, idempotency, CORS and where a token check belongs.",
        order: 1,
        timeLimitMinutes: null,
        questionIds: ids(FS_HTTP),
      },
      {
        id: 9012,
        type: "quiz",
        title: "JavaScript and TypeScript mechanics",
        description: "Closures, the event loop, floating point, and what the type system buys you.",
        order: 2,
        timeLimitMinutes: null,
        questionIds: ids(FS_LANGUAGE),
      },
      {
        id: 9013,
        type: "quiz",
        title: "React's rendering model",
        description: "Reference identity, keys, effects and where state should live.",
        order: 3,
        timeLimitMinutes: null,
        questionIds: ids(FS_REACT),
      },
      {
        id: 9014,
        type: "coding",
        title: "Applied coding round",
        description: "Two problems, graded on the test cases your solution actually passes.",
        order: 4,
        timeLimitMinutes: 25,
        questionIds: [codingId(0), codingId(3)],
      },
    ],
  },
  {
    id: 902,
    slug: "dsa-diagnostic",
    title: "Data Structures & Algorithms — Diagnostic",
    description:
      "Placement diagnostic used to set your starting difficulty in the DSA track. Complexity, " +
      "arrays and hashing, trees and graphs.",
    instructions:
      "40 minutes, 25 questions across 3 sections. This paper is not graded for your transcript. " +
      "It exists to calibrate what the platform gives you next, so answer what you know and leave " +
      "what you do not.",
    durationMinutes: 40,
    proctoringEnabled: false,
    evaluationMode: "auto",
    allowMovement: true,
    isDraft: false,
    isActive: true,
    certificateAvailable: true,
    passLower: "40",
    passUpper: "75",
    tabSwitchLimit: null,
    aiGenerated: false,
    courseIds: [203],
    startTime: null,
    endTime: null,
    cohortSize: 50,
    sections: [
      {
        id: 9021,
        type: "quiz",
        title: "Complexity",
        description: "Reading the cost of an algorithm rather than reciting it.",
        order: 1,
        timeLimitMinutes: null,
        questionIds: ids(DSA_COMPLEXITY),
      },
      {
        id: 9022,
        type: "quiz",
        title: "Arrays and hashing",
        description: "Windows, pointers, prefix sums and when a map is the whole answer.",
        order: 2,
        timeLimitMinutes: null,
        questionIds: ids(DSA_ARRAYS),
      },
      {
        id: 9023,
        type: "quiz",
        title: "Trees and graphs",
        description: "Traversal order, balance, cycles and shortest paths.",
        order: 3,
        timeLimitMinutes: null,
        questionIds: ids(DSA_GRAPHS),
      },
    ],
  },
  {
    id: 903,
    slug: "python-ds-unit-2",
    title: "Python for Data Science — Unit 2 Test",
    description:
      "pandas, reshaping, joins and missing data, plus two written answers marked by your " +
      "instructor.",
    instructions:
      "45 minutes, 10 questions across 2 sections. The written section is marked by a human, so " +
      "your score appears once your instructor has finished grading. Notes are allowed: the " +
      "questions are about judgement rather than recall.",
    durationMinutes: 45,
    proctoringEnabled: false,
    evaluationMode: "manual",
    allowMovement: true,
    isDraft: false,
    isActive: true,
    certificateAvailable: false,
    passLower: "40",
    passUpper: null,
    tabSwitchLimit: null,
    aiGenerated: false,
    courseIds: [202],
    startTime: null,
    endTime: null,
    cohortSize: 18,
    sections: [
      {
        id: 9031,
        type: "quiz",
        title: "pandas in practice",
        description: "Grouping, alignment, joins and the warnings people learn to ignore.",
        order: 1,
        timeLimitMinutes: null,
        questionIds: ids(PY_PANDAS),
      },
      {
        id: 9032,
        type: "subjective",
        title: "Judgement and communication",
        description: "Two written answers. Marked against a rubric, not a keyword list.",
        order: 2,
        timeLimitMinutes: null,
        questionIds: ids(PY_WRITTEN),
      },
    ],
  },
  {
    id: 904,
    slug: "end-of-programme-comprehensive",
    title: "End-of-Programme Comprehensive",
    description:
      "The final graded paper across every track you are enrolled in. Opens on the scheduled " +
      "date for the whole cohort at once.",
    instructions:
      "90 minutes, 17 questions across 4 sections, proctored. Your certificate grade is " +
      "calculated from this paper together with your coursework.",
    durationMinutes: 90,
    proctoringEnabled: true,
    evaluationMode: "auto",
    allowMovement: false,
    isDraft: false,
    isActive: true,
    certificateAvailable: true,
    passLower: "50",
    passUpper: "80",
    tabSwitchLimit: 3,
    aiGenerated: false,
    courseIds: [201, 203, 205],
    startTime: isoDaysAhead(24, 10, 0),
    endTime: isoDaysAhead(24, 13, 30),
    cohortSize: 0,
    sections: [
      {
        id: 9041,
        type: "quiz",
        title: "Systems and data",
        description: "Relational modelling, query plans and the cost of getting them wrong.",
        order: 1,
        timeLimitMinutes: null,
        questionIds: ids(COMP_SYSTEMS),
      },
      {
        id: 9042,
        type: "quiz",
        title: "Cloud and delivery",
        description: "Least privilege, image layers, networking and what to check first.",
        order: 2,
        timeLimitMinutes: null,
        questionIds: ids(COMP_CLOUD),
      },
      {
        id: 9043,
        type: "quiz",
        title: "Web fundamentals",
        description: "The request lifecycle, end to end.",
        order: 3,
        timeLimitMinutes: null,
        questionIds: ids(COMP_WEB),
      },
      {
        id: 9044,
        type: "coding",
        title: "Coding round",
        description: "Two problems, graded on passed test cases.",
        order: 4,
        timeLimitMinutes: 35,
        questionIds: [codingId(2), codingId(4)],
      },
    ],
  },
];

// ── Everything the visitor changes ──────────────────────────────────────────

const KEY_CUSTOM = "assessment:custom";
const KEY_PATCH = "assessment:patch";
const KEY_DELETED = "assessment:deleted";
const KEY_ATTEMPTS = "assessment:attempts";
const KEY_RETAKES = "assessment:retakes";
const KEY_EVAL = "assessment:manual-eval";
const KEY_PUBLISHED = "assessment:published-submissions";
const KEY_COMPOSER = "assessment:composer-jobs";
const KEY_GENERATION = "assessment:generation-jobs";
const KEY_SCHOLARSHIP = "assessment:scholarship-redeemed";
const KEY_SECTIONS = "assessment:sections";
/** Shared with the learner hub in `assessments.ts`, which reads it for card state. */
const KEY_SUBMITTED = "assessments:submitted";

type SpecPatch = Partial<
  Pick<
    AssessmentSpec,
    | "title"
    | "description"
    | "instructions"
    | "durationMinutes"
    | "proctoringEnabled"
    | "evaluationMode"
    | "allowMovement"
    | "isDraft"
    | "isActive"
    | "certificateAvailable"
    | "passLower"
    | "passUpper"
    | "tabSwitchLimit"
    | "startTime"
    | "endTime"
    | "courseIds"
  >
>;

function customSpecs(): AssessmentSpec[] {
  return overlay.get<AssessmentSpec[]>(KEY_CUSTOM, []);
}

function patches(): Record<string, SpecPatch> {
  return overlay.get<Record<string, SpecPatch>>(KEY_PATCH, {});
}

function deletedIds(): number[] {
  return overlay.get<number[]>(KEY_DELETED, []);
}

/**
 * Re-authored sections, keyed by assessment id.
 *
 * Kept apart from the spec patch rather than folded into it. Storing an edited
 * seed assessment as a whole new record put two entries with the same id in the
 * catalogue, and every list, every lookup and every score then had to guess
 * which one it meant.
 */
function sectionOverrides(): Record<string, SectionSpec[]> {
  return overlay.get<Record<string, SectionSpec[]>>(KEY_SECTIONS, {});
}

/** The catalogue as it stands right now: seed, plus creations, minus deletions. */
export function allAssessments(): AssessmentSpec[] {
  const gone = new Set(deletedIds());
  const patch = patches();
  const sections = sectionOverrides();
  return [...BASE_ASSESSMENTS, ...customSpecs()]
    .filter((a) => !gone.has(a.id))
    .map((a) => ({
      ...a,
      ...(patch[String(a.id)] ?? {}),
      sections: sections[String(a.id)] ?? a.sections,
    }));
}

export function assessmentBy(idOrSlug: string | number): AssessmentSpec | undefined {
  const key = String(idOrSlug);
  return allAssessments().find((a) => String(a.id) === key || a.slug === key);
}

function requireAssessment(idOrSlug: string | number): AssessmentSpec {
  const found = assessmentBy(idOrSlug);
  if (!found) throw notFound("Assessment not found");
  return found;
}

// ── Attempts ────────────────────────────────────────────────────────────────

/** One section's worth of a submitted sheet: question id -> answer. */
type SectionAnswers = Record<string, unknown>;
/** `[{ "<sectionId>": { "<questionId>": answer } }]`, exactly what the take page posts. */
type SheetBlock = Array<Record<string, SectionAnswers>>;

export interface ResponseSheet {
  quizSectionId?: SheetBlock;
  codingProblemSectionId?: SheetBlock;
  subjectiveQuestionSectionId?: SheetBlock;
  metadata?: Record<string, unknown>;
}

export interface Attempt {
  id: number;
  assessmentId: number;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string | null;
  status: "in_progress" | "submitted";
  sheet: ResponseSheet;
  autoSubmittedReason: string | null;
  /** Minutes actually spent. Recorded at submit so the report is not a guess. */
  minutesSpent: number | null;
}

function attemptStore(): Record<string, Attempt[]> {
  return overlay.get<Record<string, Attempt[]>>(KEY_ATTEMPTS, {});
}

function attemptsFor(assessmentId: number): Attempt[] {
  const live = attemptStore()[String(assessmentId)] ?? [];
  const seeded = seededAttempt(assessmentId);
  return seeded ? [seeded, ...live] : live;
}

function saveAttempt(next: Attempt): Attempt {
  overlay.update<Record<string, Attempt[]>>(KEY_ATTEMPTS, {}, (store) => {
    const key = String(next.assessmentId);
    const list = store[key] ?? [];
    const idx = list.findIndex((a) => a.id === next.id);
    const merged = idx === -1 ? [...list, next] : list.map((a) => (a.id === next.id ? next : a));
    return { ...store, [key]: merged };
  });
  return next;
}

function latestAttempt(assessmentId: number): Attempt | null {
  const list = attemptsFor(assessmentId);
  return list.length ? list[list.length - 1] : null;
}

function openAttempt(assessmentId: number): Attempt | null {
  return attemptsFor(assessmentId).find((a) => a.status === "in_progress") ?? null;
}

/**
 * The DSA diagnostic the learner sat eighteen days ago.
 *
 * Written as a real response sheet rather than a stored score: the wrong answers
 * are named per section (7/8, 7/9, 5/8) and the scorer below turns them into
 * 76 marks out of 100. That is the same 76 the scorecard reports, and it stays
 * true if the question bank is edited, which a hard-coded number would not.
 */
const SEEDED_WRONG: Record<number, number[]> = {
  9021: [5],
  9022: [2, 7],
  9023: [1, 4, 6],
};

function seededAttempt(assessmentId: number): Attempt | null {
  if (assessmentId !== 902) return null;
  const spec = assessmentBy(902);
  if (!spec) return null;

  const quiz: SheetBlock = spec.sections.map((section) => {
    const answers: SectionAnswers = {};
    const wrong = new Set(SEEDED_WRONG[section.id] ?? []);
    section.questionIds.forEach((questionId, index) => {
      const question = lookupMcq(questionId);
      if (!question) return;
      const correct = LETTERS.indexOf(question.correct_option);
      const chosen = wrong.has(index) ? (correct + 1) % 4 : correct;
      answers[String(questionId)] = LETTERS[chosen].toLowerCase();
    });
    return { [String(section.id)]: answers };
  });

  return {
    id: 70_902,
    assessmentId: 902,
    attemptNumber: 1,
    startedAt: isoDaysAgo(18, 10, 0),
    submittedAt: isoDaysAgo(18, 10, 34),
    status: "submitted",
    sheet: { quizSectionId: quiz },
    autoSubmittedReason: null,
    minutesSpent: 34,
  };
}

// ── Scoring ─────────────────────────────────────────────────────────────────

function readSheetSection(block: SheetBlock | undefined, sectionId: number): SectionAnswers {
  if (!Array.isArray(block)) return {};
  for (const entry of block) {
    const found = entry?.[String(sectionId)];
    if (found && typeof found === "object") return found as SectionAnswers;
  }
  return {};
}

/** "a" and "A" and ["a","c"] all have to fold to the same comparable set. */
function chosenLetters(raw: unknown): string[] {
  if (raw == null || raw === "") return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((x) => String(x).trim().toUpperCase())
    .filter((x) => (LETTERS as readonly string[]).includes(x));
}

export interface ScoredQuestion {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
  question_style: "single";
  selected_answer: string | null;
  is_correct: boolean;
  explanation: string;
  awarded_marks: number;
  max_marks: number;
  difficulty_level: BankQuestion["difficulty_level"];
  topic: string;
  skills: string;
  section_id: number;
  section_title: string;
}

export interface ScoredCoding {
  problem_id: number;
  title: string;
  problem_statement: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  constraints: string;
  difficulty_level: string;
  tags: string;
  submitted_code: string;
  total_test_cases: number;
  passed_test_cases: number;
  all_test_cases_passed: boolean;
  awarded_marks: number;
  max_marks: number;
  feedback: string | null;
  section_id: number;
  section_title: string;
}

export interface ScoredWritten {
  question_id: number;
  section_id: number;
  section_title: string;
  question_text: string;
  question_type: string;
  answer_mode: string;
  max_marks: number;
  answer: string | null;
  your_answer: string | null;
  images: never[];
  files: never[];
  video: null;
  awarded_marks: number | null;
  feedback: string | null;
}

export interface ScoreResult {
  quiz: ScoredQuestion[];
  coding: ScoredCoding[];
  written: ScoredWritten[];
  /** Marks the scorer could award on its own (written answers wait for a human). */
  autoScore: number;
  maximumMarks: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  sectionScores: Record<string, number>;
  sectionMaxScores: Record<string, number>;
}

export function scoreSheet(spec: AssessmentSpec, sheet: ResponseSheet): ScoreResult {
  const quiz: ScoredQuestion[] = [];
  const coding: ScoredCoding[] = [];
  const written: ScoredWritten[] = [];
  const sectionScores: Record<string, number> = {};
  const sectionMaxScores: Record<string, number> = {};

  let autoScore = 0;
  let attempted = 0;
  let correct = 0;
  let incorrect = 0;

  for (const section of spec.sections) {
    let earned = 0;
    sectionMaxScores[section.title] = sectionMaxMarks(section);

    if (section.type === "quiz") {
      const answers = readSheetSection(sheet.quizSectionId, section.id);
      for (const questionId of section.questionIds) {
        const question = lookupMcq(questionId);
        if (!question) continue;
        const picked = chosenLetters(answers[String(questionId)]);
        const isCorrect = picked.length === 1 && picked[0] === question.correct_option;
        if (picked.length > 0) attempted += 1;
        if (isCorrect) {
          correct += 1;
          earned += MCQ_MARKS;
        } else if (picked.length > 0) {
          incorrect += 1;
        }
        quiz.push({
          question_id: question.id,
          question_text: question.question_text,
          options: {
            A: question.option_a,
            B: question.option_b,
            C: question.option_c,
            D: question.option_d,
          },
          correct_option: question.correct_option,
          question_style: "single",
          selected_answer: picked[0] ?? null,
          is_correct: isCorrect,
          explanation: question.explanation,
          awarded_marks: isCorrect ? MCQ_MARKS : 0,
          max_marks: MCQ_MARKS,
          difficulty_level: question.difficulty_level,
          topic: question.topic,
          skills: question.skills,
          section_id: section.id,
          section_title: section.title,
        });
      }
    }

    if (section.type === "coding") {
      const answers = readSheetSection(sheet.codingProblemSectionId, section.id);
      for (const problemId of section.questionIds) {
        const problem = codingById(problemId);
        if (!problem) continue;
        const raw = (answers[String(problemId)] ?? {}) as {
          tc_passed?: number;
          total_tc?: number;
          best_code?: string;
        };
        const total = Number(raw.total_tc) > 0 ? Number(raw.total_tc) : problem.tests.length;
        const passed = Math.max(0, Math.min(total, Number(raw.tc_passed) || 0));
        const code = typeof raw.best_code === "string" ? raw.best_code : "";
        // Partial credit by passed cases: a solution that handles the ordinary
        // input but not the empty-array case should not score the same as a
        // blank editor, and an institution buying this will ask about exactly that.
        const awarded = total > 0 ? Math.round((passed / total) * CODING_MARKS) : 0;
        if (code.trim()) attempted += 1;
        earned += awarded;
        coding.push({
          problem_id: problemId,
          title: problem.title,
          problem_statement: problem.statement,
          input_format: problem.inputFormat,
          output_format: problem.outputFormat,
          sample_input: problem.sampleInput,
          sample_output: problem.sampleOutput,
          constraints: problem.constraints,
          difficulty_level: problem.difficulty,
          tags: problem.skills.join(", "),
          submitted_code: code,
          total_test_cases: total,
          passed_test_cases: passed,
          all_test_cases_passed: total > 0 && passed === total,
          awarded_marks: awarded,
          max_marks: CODING_MARKS,
          feedback:
            !code.trim()
              ? "No solution was submitted for this problem."
              : passed === total
                ? "Every test case passed."
                : `${passed} of ${total} test cases passed. Review the failing case before the next attempt.`,
          section_id: section.id,
          section_title: section.title,
        });
      }
    }

    if (section.type === "subjective") {
      const answers = readSheetSection(sheet.subjectiveQuestionSectionId, section.id);
      for (const questionId of section.questionIds) {
        const question = lookupWritten(questionId);
        if (!question) continue;
        const raw = answers[String(questionId)];
        const text =
          typeof raw === "string"
            ? raw
            : raw && typeof raw === "object"
              ? String((raw as { answer?: unknown }).answer ?? "")
              : "";
        if (text.trim()) attempted += 1;
        written.push({
          question_id: question.id,
          section_id: section.id,
          section_title: section.title,
          question_text: question.question_text,
          question_type: question.question_type,
          answer_mode: question.answer_mode,
          max_marks: question.max_marks,
          answer: text.trim() ? text : null,
          your_answer: text.trim() ? text : null,
          images: [],
          files: [],
          video: null,
          // Written work is a human's call. Awarding it automatically is the one
          // shortcut that would make the manual-evaluation queue meaningless.
          awarded_marks: null,
          feedback: null,
        });
      }
    }

    sectionScores[section.title] = earned;
    autoScore += earned;
  }

  return {
    quiz,
    coding,
    written,
    autoScore,
    maximumMarks: assessmentMaxMarks(spec),
    totalQuestions: assessmentQuestionCount(spec),
    attemptedQuestions: attempted,
    correctAnswers: correct,
    incorrectAnswers: incorrect,
    sectionScores,
    sectionMaxScores,
  };
}

// ── The rest of the cohort ──────────────────────────────────────────────────

/**
 * The DSA cohort, as an explicit distribution rather than a random one.
 *
 * The learner's scorecard has claimed "76%, 72nd percentile" since long before
 * this module existed. Percentile is computed here as the share of the cohort
 * scoring strictly below, so the only way to make that claim TRUE is for the
 * cohort to actually have 36 of its 50 members below 76. Hence a written-out
 * spread: it reads like a real bell around the mid sixties, and the number the
 * report prints is arithmetic, not decoration.
 */
const DSA_COHORT_PERCENTS = [
  32, 36, 40, 40, 44, 44, 48, 48, 52, 52, 52, 56, 56, 56, 60, 60, 60, 60, 64, 64,
  64, 64, 68, 68, 68, 68, 72, 72, 72, 72, 72, 72, 72, 72, 72, 72, 76, 76, 76, 80,
  80, 80, 84, 84, 84, 88, 88, 92, 92, 96,
];

export interface CohortSubmission {
  submissionId: number;
  person: DemoPerson;
  status: "submitted" | "in_progress";
  /** Percentage of the maximum. Marks are derived so the two can never disagree. */
  percent: number;
  startedAt: string;
  submittedAt: string | null;
  minutes: number;
  tabSwitches: number;
  faceViolations: number;
  fullscreenExits: number;
}

/** Deterministic roster for one paper. Same people, same scores, every reload. */
function cohortFor(spec: AssessmentSpec): CohortSubmission[] {
  if (spec.cohortSize <= 0) return [];
  const roster = seededSample(`cohort:${spec.id}`, STUDENTS, spec.cohortSize);

  return roster.map((person, index) => {
    const percent =
      spec.id === 902
        ? DSA_COHORT_PERCENTS[index % DSA_COHORT_PERCENTS.length]
        : seededInt(`score:${spec.id}:${person.id}`, 38, 96);
    // Two learners on the biggest paper are still writing, so the admin hub has a
    // live row and the analytics status breakdown is not a single bar.
    const inProgress = spec.id === 901 && index < 2;
    const daysBack = seededInt(`when:${spec.id}:${person.id}`, 1, 16);
    const startHour = seededInt(`hour:${spec.id}:${person.id}`, 9, 17);
    const minutes = inProgress
      ? Math.round(spec.durationMinutes * 0.4)
      : seededInt(`mins:${spec.id}:${person.id}`, Math.round(spec.durationMinutes * 0.45), spec.durationMinutes);

    return {
      submissionId: spec.id * 1000 + index + 1,
      person,
      status: inProgress ? "in_progress" : "submitted",
      percent,
      startedAt: isoDaysAgo(inProgress ? 0 : daysBack, startHour, 0),
      submittedAt: inProgress ? null : isoDaysAgo(daysBack, startHour, minutes % 60),
      minutes,
      tabSwitches: spec.proctoringEnabled ? seededInt(`tab:${spec.id}:${person.id}`, 0, 4) : 0,
      faceViolations: spec.proctoringEnabled ? seededInt(`face:${spec.id}:${person.id}`, 0, 3) : 0,
      fullscreenExits: spec.proctoringEnabled ? seededInt(`fs:${spec.id}:${person.id}`, 0, 2) : 0,
    };
  });
}

function marksFor(spec: AssessmentSpec, percent: number): number {
  return Math.round((percent / 100) * assessmentMaxMarks(spec));
}

/** Share of the cohort this learner beat. The report's percentile, computed. */
function percentileAmongCohort(spec: AssessmentSpec, percent: number): number {
  const scored = cohortFor(spec).filter((c) => c.status === "submitted");
  if (scored.length === 0) return 0;
  const below = scored.filter((c) => c.percent < percent).length;
  return Math.round((below / scored.length) * 100);
}

// ── Manual evaluation, retakes, publication ─────────────────────────────────

export interface ManualScoreRow {
  id: number;
  awarded_marks: number;
  note?: string;
}

export interface ManualEvaluation {
  quiz_scores: ManualScoreRow[];
  coding_scores: ManualScoreRow[];
  subjective_scores: ManualScoreRow[];
  admin_notes?: string;
  /** Set the moment an admin saves, so the UI can show when it was last touched. */
  saved_at?: string;
}

const evalKey = (assessmentId: number, submissionId: number) => `${assessmentId}:${submissionId}`;

function manualEvaluations(): Record<string, ManualEvaluation> {
  return overlay.get<Record<string, ManualEvaluation>>(KEY_EVAL, {});
}

function manualEvaluationFor(assessmentId: number, submissionId: number): ManualEvaluation | null {
  return manualEvaluations()[evalKey(assessmentId, submissionId)] ?? null;
}

function publishedSubmissions(): string[] {
  return overlay.get<string[]>(KEY_PUBLISHED, []);
}

function isSubmissionPublished(assessmentId: number, submissionId: number): boolean {
  return publishedSubmissions().includes(evalKey(assessmentId, submissionId));
}

/** Marks a human has already awarded on this submission, summed. */
function manualTotal(payload: ManualEvaluation | null): number | null {
  if (!payload) return null;
  const rows = [
    ...(payload.quiz_scores ?? []),
    ...(payload.coding_scores ?? []),
    ...(payload.subjective_scores ?? []),
  ];
  if (rows.length === 0) return null;
  return rows.reduce((sum, r) => sum + (Number(r.awarded_marks) || 0), 0);
}

export interface RetakeGrant {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  granted_at: string;
  granted_by_email: string | null;
  note: string;
}

function retakeStore(): Record<string, RetakeGrant[]> {
  return overlay.get<Record<string, RetakeGrant[]>>(KEY_RETAKES, {});
}

function retakesFor(assessmentId: number): RetakeGrant[] {
  return retakeStore()[String(assessmentId)] ?? [];
}

function learnerHasRetake(assessmentId: number): boolean {
  return retakesFor(assessmentId).some((g) => g.user_id === STUDENT_PERSONA.id);
}

// ── The learner's view ──────────────────────────────────────────────────────

function submittedSlugs(): number[] {
  return overlay.get<number[]>(KEY_SUBMITTED, []);
}

export function learnerStatus(spec: AssessmentSpec): "not_started" | "in_progress" | "submitted" {
  const attempt = latestAttempt(spec.id);
  if (attempt?.status === "submitted") return "submitted";
  if (attempt?.status === "in_progress") return "in_progress";
  return submittedSlugs().includes(spec.id) ? "submitted" : "not_started";
}

function reviewStatusFor(spec: AssessmentSpec, attempt: Attempt | null): string {
  if (!attempt || attempt.status !== "submitted") return "not_required";
  if (spec.evaluationMode !== "manual") return "published";
  return isSubmissionPublished(spec.id, attempt.id) ? "published" : "pending_evaluation";
}

/**
 * The card + detail shape every learner surface reads.
 *
 * Exported because the hub in `assessments.ts` renders from this exact record:
 * two projections of one catalogue can drift, and a hub that says "not started"
 * over a paper the learner has already submitted is the kind of detail that ends
 * a demo.
 */
export function learnerAssessmentApi(spec: AssessmentSpec) {
  const status = learnerStatus(spec);
  const attempt = latestAttempt(spec.id);
  return {
    id: spec.id,
    title: spec.title,
    description: spec.description,
    slug: spec.slug,
    instructions: spec.instructions,
    duration_minutes: spec.durationMinutes,
    is_paid: false,
    price: null,
    currency: "INR",
    requires_purchase: false,
    purchased: true,
    amount: 0,
    is_active: spec.isActive && !spec.isDraft,
    number_of_questions: assessmentQuestionCount(spec),
    number_of_sections: spec.sections.length,
    created_at: isoDaysAgo(40),
    is_attempted: status === "submitted",
    has_attempted: status === "submitted",
    start_time: spec.startTime,
    end_time: spec.endTime,
    proctoring_enabled: spec.proctoringEnabled,
    status,
    allow_desktop: true,
    // Proctored papers are desktop-only, which is the real product rule and the
    // first thing an institution evaluating integrity controls looks for.
    allow_mobile: !spec.proctoringEnabled,
    allow_tablet: !spec.proctoringEnabled,
    allow_movement: spec.allowMovement,
    show_result: true,
    evaluation_mode: spec.evaluationMode,
    review_status: reviewStatusFor(spec, attempt),
    tab_switch_limit_enabled: spec.tabSwitchLimit != null,
    tab_switch_limit_count: spec.tabSwitchLimit,
    can_reattempt: learnerHasRetake(spec.id),
    certificate_available: spec.certificateAvailable,
    pass_band_lower_min_percent: spec.passLower,
    pass_band_upper_min_percent: spec.passUpper,
    certificate_course_name: courseTitlesFor(spec)[0] ?? null,
    course_title: courseTitlesFor(spec)[0] ?? null,
  };
}

function courseTitlesFor(spec: AssessmentSpec): string[] {
  return spec.courseIds
    .map((id) => COURSES.find((c) => c.id === id)?.title)
    .filter((t): t is string => Boolean(t));
}

/** AssessmentDetail: the card plus the section outline the overview page lists. */
export function learnerDetailApi(spec: AssessmentSpec) {
  return {
    ...learnerAssessmentApi(spec),
    sections: spec.sections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      section_type: s.type,
      order: s.order,
      number_of_questions: s.questionIds.length,
      marks: sectionMaxMarks(s),
      time_limit_minutes: s.timeLimitMinutes,
    })),
  };
}

// ── The report ──────────────────────────────────────────────────────────────

function ratingOutOfFive(accuracy: number): number {
  return Math.round((accuracy / 20) * 10) / 10;
}

function splitSkills(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildStats(spec: AssessmentSpec, scored: ScoreResult, minutes: number, awarded: number) {
  const topics: Record<
    string,
    { total: number; correct: number; incorrect: number; accuracy_percent: number; rating_out_of_5: number }
  > = {};

  for (const item of scored.quiz) {
    const row = (topics[item.topic] ??= {
      total: 0,
      correct: 0,
      incorrect: 0,
      accuracy_percent: 0,
      rating_out_of_5: 0,
    });
    row.total += 1;
    if (item.is_correct) row.correct += 1;
    else row.incorrect += 1;
  }
  for (const row of Object.values(topics)) {
    row.accuracy_percent = row.total ? Math.round((row.correct / row.total) * 100) : 0;
    row.rating_out_of_5 = ratingOutOfFive(row.accuracy_percent);
  }

  const skillTally = new Map<string, { total: number; correct: number }>();
  for (const item of scored.quiz) {
    for (const skill of splitSkills(item.skills)) {
      const row = skillTally.get(skill) ?? { total: 0, correct: 0 };
      row.total += 1;
      if (item.is_correct) row.correct += 1;
      skillTally.set(skill, row);
    }
  }
  const skills = [...skillTally.entries()]
    .map(([skill, row]) => ({
      skill,
      total: row.total,
      correct: row.correct,
      incorrect: row.total - row.correct,
      accuracy_percent: row.total ? Math.round((row.correct / row.total) * 100) : 0,
      rating_out_of_5: ratingOutOfFive(row.total ? (row.correct / row.total) * 100 : 0),
    }))
    .sort((a, b) => b.accuracy_percent - a.accuracy_percent || b.total - a.total);

  const percent = scored.maximumMarks ? (awarded / scored.maximumMarks) * 100 : 0;
  const accuracy = scored.attemptedQuestions
    ? Math.round((scored.correctAnswers / scored.attemptedQuestions) * 100)
    : 0;

  return {
    total_questions: scored.totalQuestions,
    attempted_questions: scored.attemptedQuestions,
    correct_answers: scored.correctAnswers,
    score: awarded,
    incorrect_answers: scored.incorrectAnswers,
    accuracy_percent: accuracy,
    // Coursework readiness is not the paper's percentage: a strong score on a
    // short diagnostic is weaker evidence than the same score on the comprehensive.
    placement_readiness: Math.round(percent * 0.7 + accuracy * 0.3),
    maximum_marks: scored.maximumMarks,
    topic_wise_stats: topics,
    top_skills: skills.filter((s) => s.accuracy_percent >= 60).slice(0, 5),
    low_skills: [...skills].reverse().filter((s) => s.accuracy_percent < 60).slice(0, 5),
    percentile: percentileAmongCohort(spec, Math.round(percent)),
    time_taken_minutes: minutes,
    total_time_minutes: spec.durationMinutes,
    percentage_time_taken: spec.durationMinutes
      ? Math.round((minutes / spec.durationMinutes) * 100)
      : 0,
  };
}

function feedbackFor(spec: AssessmentSpec, scored: ScoreResult, stats: ReturnType<typeof buildStats>): string[] {
  const lines: string[] = [];
  const strongest = Object.entries(stats.topic_wise_stats).sort(
    (a, b) => b[1].accuracy_percent - a[1].accuracy_percent,
  );
  if (strongest.length > 0) {
    const [name, row] = strongest[0];
    lines.push(`Your strongest section was ${name}, at ${row.accuracy_percent}% accuracy.`);
  }
  if (strongest.length > 1) {
    const [name, row] = strongest[strongest.length - 1];
    lines.push(
      `${name} is where the marks went: ${row.correct} of ${row.total}. Two focused sessions there move your total more than another pass over material you already know.`,
    );
  }
  if (stats.attempted_questions < stats.total_questions) {
    lines.push(
      `${stats.total_questions - stats.attempted_questions} question(s) were left unanswered. An unanswered question scores the same as a wrong one, so there is nothing to lose by attempting it.`,
    );
  }
  if (scored.written.length > 0 && spec.evaluationMode === "manual") {
    lines.push(
      "Your written answers are with your instructor. The score above covers the marked sections only.",
    );
  }
  if (stats.percentage_time_taken < 60) {
    lines.push(
      `You used ${stats.percentage_time_taken}% of the time available. Reviewing flagged questions with the remainder is usually worth a few marks.`,
    );
  }
  return lines;
}

function proctoringSummary(spec: AssessmentSpec, attempt: Attempt) {
  if (!spec.proctoringEnabled) {
    return {
      eye_movement_violations: [],
      eye_movement_count: 0,
      tab_switches_count: 0,
      face_violations_count: 0,
      fullscreen_exits_count: 0,
      face_validation_failures_count: 0,
      multiple_face_detections_count: 0,
      total_violation_count: 0,
    };
  }
  const meta = (attempt.sheet.metadata ?? {}) as {
    transcript?: { metadata?: Record<string, unknown> };
  };
  const t = (meta.transcript?.metadata ?? {}) as Record<string, unknown>;
  const proctoring = (t.proctoring ?? {}) as Record<string, unknown>;
  const count = (value: unknown): number => (Array.isArray(value) ? value.length : Number(value) || 0);

  const tabs = count(proctoring.tab_switches);
  const faces = count(proctoring.face_violations);
  const fullscreen = count(proctoring.fullscreen_exits);
  return {
    eye_movement_violations: Array.isArray(proctoring.eye_movement_violations)
      ? (proctoring.eye_movement_violations as Array<{ timestamp: string }>)
      : [],
    eye_movement_count: Number(proctoring.eye_movement_count) || 0,
    tab_switches_count: tabs,
    face_violations_count: faces,
    fullscreen_exits_count: fullscreen,
    face_validation_failures_count: Number(t.face_validation_failures) || 0,
    multiple_face_detections_count: Number(t.multiple_face_detections) || 0,
    total_violation_count: Number(proctoring.total_violation_count) || tabs + faces + fullscreen,
  };
}

/** The full AssessmentResult payload for one attempt. */
export function buildResult(spec: AssessmentSpec, attempt: Attempt) {
  const scored = scoreSheet(spec, attempt.sheet);
  const manual = manualEvaluationFor(spec.id, attempt.id);
  const manualSum = manualTotal(manual);
  const awarded = manualSum != null ? manualSum : scored.autoScore;
  const minutes = attempt.minutesSpent ?? Math.round(spec.durationMinutes * 0.8);
  const stats = buildStats(spec, scored, minutes, awarded);
  const review = reviewStatusFor(spec, attempt);

  const byId = new Map((manual?.subjective_scores ?? []).map((r) => [r.id, r]));
  const written = scored.written.map((w) => {
    const row = byId.get(w.question_id);
    return row
      ? { ...w, awarded_marks: Number(row.awarded_marks) || 0, feedback: row.note ?? null }
      : w;
  });

  const attempts = attemptsFor(spec.id)
    .filter((a) => a.status === "submitted")
    .map((a, index) => {
      const s = scoreSheet(spec, a.sheet);
      const m = manualTotal(manualEvaluationFor(spec.id, a.id));
      return {
        id: a.id,
        attempt_number: index + 1,
        started_at: a.startedAt,
        submitted_at: a.submittedAt,
        score: m != null ? m : s.autoScore,
        status: "submitted",
        review_status: reviewStatusFor(spec, a),
      };
    });

  return {
    message: "Result generated.",
    status: "submitted",
    score: awarded,
    assessment_id: String(spec.id),
    assessment_name: spec.title,
    maximum_marks: scored.maximumMarks,
    assessment_details: learnerDetailApi(spec),
    student_name: STUDENT_PERSONA.full_name,
    student_email: STUDENT_PERSONA.email,
    student_phone: STUDENT_PERSONA.phone,
    user_name: STUDENT_PERSONA.full_name,
    email: STUDENT_PERSONA.email,
    phone: STUDENT_PERSONA.phone,
    full_name: STUDENT_PERSONA.full_name,
    user: {
      first_name: STUDENT_PERSONA.first_name,
      last_name: STUDENT_PERSONA.last_name,
      name: STUDENT_PERSONA.full_name,
      email: STUDENT_PERSONA.email,
      phone: STUDENT_PERSONA.phone,
      user_name: STUDENT_PERSONA.user_name,
    },
    show_result: true,
    review_status: review,
    attempts,
    current_attempt_id: attempt.id,
    auto_submitted_reason: attempt.autoSubmittedReason,
    auto_submitted_meta: {},
    auto_submit_message:
      attempt.autoSubmittedReason === "tab_switch_limit"
        ? "This paper was submitted automatically because the tab-switch limit was reached."
        : "",
    feedback_points: feedbackFor(spec, scored, stats),
    stats,
    proctoring: proctoringSummary(spec, attempt),
    user_responses: {
      quiz_responses: scored.quiz,
      coding_problem_responses: scored.coding,
      subjective_responses: written,
    },
  };
}

// ── The take payload ────────────────────────────────────────────────────────

function mcqForTake(id: number) {
  const m = lookupMcq(id);
  if (!m) return null;
  // Deliberately no correct_option: the answer key must not travel to the browser
  // during an attempt. The scorer reads it from this module instead.
  return {
    id: m.id,
    question_text: m.question_text,
    option_a: m.option_a,
    option_b: m.option_b,
    option_c: m.option_c,
    option_d: m.option_d,
    question_style: "single",
    difficulty_level: m.difficulty_level,
    topic: m.topic,
  };
}

function writtenForTake(id: number) {
  const w = lookupWritten(id);
  if (!w) return null;
  return {
    id: w.id,
    question_text: w.question_text,
    max_marks: w.max_marks,
    question_type: w.question_type,
    answer_mode: w.answer_mode,
  };
}

function sectionEnvelope(section: SectionSpec) {
  return {
    id: section.id,
    title: section.title,
    description: section.description,
    order: section.order,
    time_limit_minutes: section.timeLimitMinutes,
    easy_score: MCQ_MARKS,
    medium_score: MCQ_MARKS,
    hard_score: MCQ_MARKS,
    number_of_questions: section.questionIds.length,
  };
}

function takePayload(spec: AssessmentSpec, attempt: Attempt) {
  const elapsedMinutes = Math.max(0, (nowMs() - new Date(attempt.startedAt).getTime()) / 60_000);
  const remaining = Math.max(0, Math.round(spec.durationMinutes - elapsedMinutes));

  const quizSection = spec.sections
    .filter((s) => s.type === "quiz")
    .map((s) => ({
      ...sectionEnvelope(s),
      mcqs: s.questionIds.map(mcqForTake).filter(Boolean),
    }));

  const codingProblemSection = spec.sections
    .filter((s) => s.type === "coding")
    .map((s) => ({
      ...sectionEnvelope(s),
      coding_problems: s.questionIds.map(codingProblemApi),
    }));

  const subjectiveQuestionSection = spec.sections
    .filter((s) => s.type === "subjective")
    .map((s) => ({
      ...sectionEnvelope(s),
      subjective_questions: s.questionIds.map(writtenForTake).filter(Boolean),
    }));

  return {
    id: spec.id,
    title: spec.title,
    slug: spec.slug,
    instructions: spec.instructions,
    description: spec.description,
    duration_minutes: spec.durationMinutes,
    quizSection,
    codingProblemSection,
    subjectiveQuestionSection,
    // Minutes, not seconds: the take page multiplies this by 60 for its clock.
    remaining_time: remaining,
    status: attempt.status,
    responseSheet: attempt.sheet ?? {},
    proctoring_enabled: spec.proctoringEnabled,
    allow_desktop: true,
    allow_mobile: !spec.proctoringEnabled,
    allow_tablet: !spec.proctoringEnabled,
    allow_movement: spec.allowMovement,
    tab_switch_limit_enabled: spec.tabSwitchLimit != null,
    tab_switch_limit_count: spec.tabSwitchLimit,
    // The declared AssessmentSubmission envelope, alongside the flat shape the
    // take page actually reads. Both are cheap; only one of them is load-bearing.
    assessment: {
      id: spec.id,
      title: spec.title,
      slug: spec.slug,
      sections: spec.sections.map((s) => ({
        section_type: s.type,
        questions: s.questionIds,
      })),
    },
    submission: {
      id: attempt.id,
      status: attempt.status,
      started_at: attempt.startedAt,
    },
  };
}

// ── The admin's view ────────────────────────────────────────────────────────

function difficultyBreakdown(spec: AssessmentSpec) {
  const out = { easy: 0, medium: 0, hard: 0 };
  for (const section of spec.sections) {
    for (const id of section.questionIds) {
      const level = lookupMcq(id)?.difficulty_level ?? codingById(id)?.difficulty;
      if (level === "Easy") out.easy += 1;
      else if (level === "Hard") out.hard += 1;
      else out.medium += 1;
    }
  }
  return out;
}

/** Every submission an administrator can see: the cohort plus this learner's own. */
function adminSubmissions(spec: AssessmentSpec) {
  const rows = cohortFor(spec).map((c) => ({
    submissionId: c.submissionId,
    person: c.person,
    status: c.status,
    percent: c.percent,
    score: c.status === "submitted" ? marksFor(spec, c.percent) : null,
    startedAt: c.startedAt,
    submittedAt: c.submittedAt,
    minutes: c.minutes,
    tabSwitches: c.tabSwitches,
    faceViolations: c.faceViolations,
    fullscreenExits: c.fullscreenExits,
    attempt: null as Attempt | null,
  }));

  for (const attempt of attemptsFor(spec.id)) {
    const scored = scoreSheet(spec, attempt.sheet);
    const manual = manualTotal(manualEvaluationFor(spec.id, attempt.id));
    const score = manual != null ? manual : scored.autoScore;
    const percent = scored.maximumMarks ? Math.round((score / scored.maximumMarks) * 100) : 0;
    rows.push({
      submissionId: attempt.id,
      person: STUDENT_PERSONA,
      status: attempt.status,
      percent,
      score: attempt.status === "submitted" ? score : null,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      minutes: attempt.minutesSpent ?? 0,
      tabSwitches: 0,
      faceViolations: 0,
      fullscreenExits: 0,
      attempt,
    });
  }

  return rows;
}

function passThresholdPercent(spec: AssessmentSpec): number {
  const lower = Number(spec.passLower);
  return Number.isFinite(lower) && lower > 0 ? lower : 40;
}

function adminListRow(spec: AssessmentSpec) {
  const submissions = adminSubmissions(spec);
  const scored = submissions.filter((s) => s.status === "submitted");
  const threshold = passThresholdPercent(spec);
  return {
    id: spec.id,
    title: spec.title,
    slug: spec.slug,
    instructions: spec.instructions,
    description: spec.description,
    duration_minutes: spec.durationMinutes,
    is_paid: false,
    price: null,
    currency: "INR",
    is_active: spec.isActive,
    is_draft: spec.isDraft,
    evaluation_mode: spec.evaluationMode,
    proctoring_enabled: spec.proctoringEnabled,
    live_streaming: false,
    allow_movement: spec.allowMovement,
    tab_switch_limit_enabled: spec.tabSwitchLimit != null,
    tab_switch_limit_count: spec.tabSwitchLimit,
    start_time: spec.startTime,
    end_time: spec.endTime,
    created_at: isoDaysAgo(spec.id === 904 ? 6 : 30),
    total_questions: assessmentQuestionCount(spec),
    quiz_sections_count: spec.sections.filter((s) => s.type === "quiz").length,
    coding_sections_count: spec.sections.filter((s) => s.type === "coding").length,
    submissions_count: submissions.length,
    is_ai_generated: spec.aiGenerated,
    difficulty_breakdown: difficultyBreakdown(spec),
    pass_rate: scored.length
      ? Math.round((scored.filter((s) => s.percent >= threshold).length / scored.length) * 100)
      : null,
    courses: spec.courseIds
      .map((id) => COURSES.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => ({ id: c!.id, title: c!.title })),
    colleges: [],
    allow_desktop: true,
    allow_mobile: !spec.proctoringEnabled,
    allow_tablet: !spec.proctoringEnabled,
    email_notification_enabled: true,
    send_communication: true,
    certificate_available: spec.certificateAvailable,
    show_result: true,
  };
}

function adminDetail(spec: AssessmentSpec) {
  const quizSection = spec.sections
    .filter((s) => s.type === "quiz")
    .map((s) => {
      const questions = s.questionIds.map((id) => lookupMcq(id)).filter(Boolean);
      return { ...sectionEnvelope(s), section_cutoff_marks: null, mcqs: questions, questions };
    });

  return {
    ...adminListRow(spec),
    course_ids: spec.courseIds,
    pass_band_lower_min_percent: spec.passLower ?? undefined,
    pass_band_upper_min_percent: spec.passUpper ?? undefined,
    email_reminders_enabled: false,
    email_reminder_offsets: [],
    quizSection,
    codingProblemSection: spec.sections
      .filter((s) => s.type === "coding")
      .map((s) => ({
        ...sectionEnvelope(s),
        coding_problems: s.questionIds.map(codingProblemApi),
      })),
    subjectiveQuestionSection: spec.sections
      .filter((s) => s.type === "subjective")
      .map((s) => ({
        ...sectionEnvelope(s),
        subjective_question_ids: s.questionIds,
        subjective_questions: s.questionIds
          .map((id) => lookupWritten(id))
          .filter(Boolean)
          .map((w) => ({
            question_text: w!.question_text,
            evaluation_prompt: w!.evaluation_prompt,
            max_marks: w!.max_marks,
            question_type: w!.question_type,
            answer_mode: w!.answer_mode,
          })),
      })),
  };
}

// ── Exports ─────────────────────────────────────────────────────────────────

function questionsExport(spec: AssessmentSpec) {
  return {
    assessment: {
      id: spec.id,
      title: spec.title,
      slug: spec.slug,
      instructions: spec.instructions,
      description: spec.description,
    },
    sections: spec.sections.map((s) => ({
      section_id: s.id,
      section_title: s.title,
      section_description: s.description,
      section_type: s.type,
      order: s.order,
      easy_score: MCQ_MARKS,
      medium_score: MCQ_MARKS,
      hard_score: MCQ_MARKS,
      number_of_questions: s.questionIds.length,
      time_limit_minutes: s.timeLimitMinutes,
      section_cutoff_marks: null,
      questions:
        s.type === "quiz"
          ? s.questionIds.map((id) => lookupMcq(id)).filter(Boolean)
          : s.type === "coding"
            ? s.questionIds.map(codingProblemApi)
            : s.questionIds
                .map((id) => lookupWritten(id))
                .filter(Boolean)
                .map((w) => ({
                  id: w!.id,
                  question_text: w!.question_text,
                  evaluation_prompt: w!.evaluation_prompt,
                  max_marks: w!.max_marks,
                  question_type: w!.question_type,
                  answer_mode: w!.answer_mode,
                })),
    })),
  };
}

/**
 * Section marks for a cohort row.
 *
 * A learner who scored 68% overall did not score exactly 68% in every section,
 * and an export where every section matches the total to the mark is the first
 * thing that reads as generated. The jitter is seeded, so the same person always
 * has the same profile, and the parts are rescaled to sum to the whole.
 */
function sectionSplit(spec: AssessmentSpec, person: DemoPerson, percent: number) {
  const scores: Record<string, number> = {};
  const maxes: Record<string, number> = {};
  const target = marksFor(spec, percent);

  const raw = spec.sections.map((s) => {
    const max = sectionMaxMarks(s);
    const shift = seededInt(`split:${spec.id}:${person.id}:${s.id}`, -12, 12);
    const pct = Math.max(0, Math.min(100, percent + shift));
    return { section: s, max, value: (pct / 100) * max };
  });

  const rawTotal = raw.reduce((sum, r) => sum + r.value, 0) || 1;
  let running = 0;
  raw.forEach((r, i) => {
    maxes[r.section.title] = r.max;
    const scaled =
      i === raw.length - 1
        ? Math.max(0, Math.min(r.max, target - running))
        : Math.max(0, Math.min(r.max, Math.round((r.value / rawTotal) * target)));
    scores[r.section.title] = scaled;
    running += scaled;
  });

  return { scores, maxes };
}

function cohortStats(spec: AssessmentSpec, person: DemoPerson, percent: number, minutes: number) {
  const totalQuestions = assessmentQuestionCount(spec);
  const attempted = Math.max(
    1,
    Math.min(totalQuestions, totalQuestions - seededInt(`skip:${spec.id}:${person.id}`, 0, 2)),
  );
  const correct = Math.round((percent / 100) * attempted);
  return {
    total_questions: totalQuestions,
    attempted_questions: attempted,
    correct_answers: correct,
    score: marksFor(spec, percent),
    incorrect_answers: attempted - correct,
    accuracy_percent: attempted ? Math.round((correct / attempted) * 100) : 0,
    placement_readiness: Math.round(percent * 0.8),
    maximum_marks: assessmentMaxMarks(spec),
    topic_wise_stats: {},
    top_skills: [],
    low_skills: [],
    percentile: percentileAmongCohort(spec, percent),
    time_taken_minutes: minutes,
    total_time_minutes: spec.durationMinutes,
    percentage_time_taken: spec.durationMinutes
      ? Math.round((minutes / spec.durationMinutes) * 100)
      : 0,
  };
}

function submissionReviewStatus(spec: AssessmentSpec, submissionId: number): string {
  if (spec.evaluationMode !== "manual") return "published";
  if (isSubmissionPublished(spec.id, submissionId)) return "published";
  return manualEvaluationFor(spec.id, submissionId) ? "evaluated" : "pending_evaluation";
}

function submissionsExport(spec: AssessmentSpec) {
  const rows = adminSubmissions(spec).map((row) => {
    const split = sectionSplit(spec, row.person, row.percent);
    const isOwn = row.attempt != null;
    const result = isOwn ? buildResult(spec, row.attempt!) : null;

    return {
      submission_id: row.submissionId,
      status: row.status,
      review_status: submissionReviewStatus(spec, row.submissionId),
      score: row.score,
      profile_pic_url: row.person.profile_pic_url,
      name: row.person.full_name,
      email: row.person.email,
      phone: row.person.phone,
      started_at: row.startedAt,
      submitted_at: row.submittedAt ?? undefined,
      maximum_marks: assessmentMaxMarks(spec),
      overall_score: row.score,
      percentage: row.status === "submitted" ? row.percent : null,
      total_questions: assessmentQuestionCount(spec),
      attempted_questions: result
        ? result.stats.attempted_questions
        : cohortStats(spec, row.person, row.percent, row.minutes).attempted_questions,
      stats: result ? result.stats : cohortStats(spec, row.person, row.percent, row.minutes),
      user_responses: result
        ? {
            quiz_responses: result.user_responses.quiz_responses,
            coding_problem_responses: result.user_responses.coding_problem_responses,
          }
        : { quiz_responses: [], coding_problem_responses: [] },
      section_wise_scores: result ? scoreSheet(spec, row.attempt!.sheet).sectionScores : split.scores,
      section_wise_max_scores: result
        ? scoreSheet(spec, row.attempt!.sheet).sectionMaxScores
        : split.maxes,
      proctoring: {
        tab_switches_count: row.tabSwitches,
        face_violations_count: row.faceViolations,
        fullscreen_exits_count: row.fullscreenExits,
        eye_movement_count: 0,
        face_validation_failures_count: row.faceViolations,
        multiple_face_detections_count: Math.max(0, row.faceViolations - 1),
        total_violation_count: row.tabSwitches + row.faceViolations + row.fullscreenExits,
      },
      manual_evaluation_payload: manualEvaluationFor(spec.id, row.submissionId) ?? {},
    };
  });

  return {
    assessment: {
      id: spec.id,
      title: spec.title,
      slug: spec.slug,
      maximum_marks: assessmentMaxMarks(spec),
      show_result: true,
    },
    submissions: rows,
  };
}

// ── Analytics ───────────────────────────────────────────────────────────────

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function analytics(spec: AssessmentSpec, topPerformers: number) {
  const rows = adminSubmissions(spec);
  const done = rows.filter((r) => r.status === "submitted");
  const scores = done.map((r) => r.score ?? 0);
  const percents = done.map((r) => r.percent);
  const times = done.map((r) => r.minutes);
  const max = assessmentMaxMarks(spec);
  const threshold = passThresholdPercent(spec);
  const passCount = done.filter((r) => r.percent >= threshold).length;
  const average = (list: number[]) =>
    list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : 0;

  const buckets = [
    { label: "0-20%", min_percent: 0, max_percent: 20 },
    { label: "21-40%", min_percent: 21, max_percent: 40 },
    { label: "41-60%", min_percent: 41, max_percent: 60 },
    { label: "61-80%", min_percent: 61, max_percent: 80 },
    { label: "81-100%", min_percent: 81, max_percent: 100 },
  ].map((b) => ({
    ...b,
    count: done.filter((r) => r.percent >= b.min_percent && r.percent <= b.max_percent).length,
  }));

  const timeBuckets = [
    { label: "Under half the time", min_minutes: 0, max_minutes: Math.round(spec.durationMinutes / 2) },
    {
      label: "Half to three quarters",
      min_minutes: Math.round(spec.durationMinutes / 2) + 1,
      max_minutes: Math.round(spec.durationMinutes * 0.75),
    },
    {
      label: "Used almost all of it",
      min_minutes: Math.round(spec.durationMinutes * 0.75) + 1,
      max_minutes: spec.durationMinutes,
    },
  ].map((b) => ({
    ...b,
    count: done.filter((r) => r.minutes >= b.min_minutes && r.minutes <= b.max_minutes).length,
  }));

  const timeline = Array.from({ length: 14 }, (_, i) => {
    const day = ymd(daysAgo(13 - i));
    return {
      date: day,
      count: done.filter((r) => (r.submittedAt ?? "").slice(0, 10) === day).length,
    };
  });

  const sectionAverages = spec.sections.map((section) => {
    const sectionMax = sectionMaxMarks(section);
    const values = done.map(
      (r) => sectionSplit(spec, r.person, r.percent).scores[section.title] ?? 0,
    );
    const avg = average(values);
    return {
      section_title: section.title,
      average_score: avg,
      max_score: sectionMax,
      average_percentage: sectionMax ? Math.round((avg / sectionMax) * 100) : 0,
      submissions_count: done.length,
    };
  });

  const sectionScoresFor = (row: (typeof rows)[number]) => {
    const split = sectionSplit(spec, row.person, row.percent);
    return spec.sections.map((section) => {
      const value = split.scores[section.title] ?? 0;
      const sectionMax = sectionMaxMarks(section);
      return {
        section_title: section.title,
        score: value,
        max_score: sectionMax,
        percentage: sectionMax ? Math.round((value / sectionMax) * 100) : 0,
        questions_attempted: section.questionIds.length,
        questions_correct: Math.round((row.percent / 100) * section.questionIds.length),
      };
    });
  };

  const ranked = [...done].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, topPerformers);

  const mcqRows = spec.sections
    .filter((s) => s.type === "quiz")
    .flatMap((s) =>
      s.questionIds.map((id) => {
        const question = lookupMcq(id);
        if (!question) return null;
        // Correct-rate is derived from the question's own difficulty so the
        // per-question table ranks the way the paper actually behaves.
        const base = question.difficulty_level === "Easy" ? 82 : question.difficulty_level === "Hard" ? 41 : 63;
        const correctRate = Math.max(5, Math.min(98, base + seededInt(`qr:${spec.id}:${id}`, -9, 9)));
        const correct = Math.round((correctRate / 100) * done.length);
        return {
          question_id: id,
          quiz_section_id: s.id,
          section_title: s.title,
          question_text: question.question_text,
          difficulty_level: question.difficulty_level,
          topic: question.topic,
          correct_count: correct,
          incorrect_count: Math.max(0, done.length - correct),
          skipped_count: 0,
          appeared_count: done.length,
          correct_percent: correctRate,
        };
      }),
    )
    .filter(Boolean);

  const codingRows = spec.sections
    .filter((s) => s.type === "coding")
    .flatMap((s) =>
      s.questionIds.map((id) => {
        const problem = codingById(id);
        const full = Math.round(done.length * 0.34);
        const partial = Math.round(done.length * 0.4);
        return {
          problem_id: id,
          coding_section_id: s.id,
          section_title: s.title,
          difficulty_level: problem?.difficulty ?? "Medium",
          title: problem?.title ?? "Coding problem",
          full_pass_count: full,
          partial_count: partial,
          failed_count: Math.max(0, done.length - full - partial),
          skipped_count: 0,
          appeared_count: done.length,
        };
      }),
    );

  return {
    assessment: {
      id: spec.id,
      title: spec.title,
      slug: spec.slug,
      maximum_marks: max,
      duration_minutes: spec.durationMinutes,
      show_result: true,
      proctoring_enabled: spec.proctoringEnabled,
    },
    summary: {
      total_submissions: rows.length,
      completed_submissions: done.length,
      completed_with_score: done.length,
      in_progress_submissions: rows.length - done.length,
      average_score: average(scores),
      median_score: median(scores),
      highest_score: scores.length ? Math.max(...scores) : 0,
      lowest_score: scores.length ? Math.min(...scores) : 0,
      average_percentage: average(percents),
      median_percentage: median(percents),
      average_time_taken_minutes: average(times),
      median_time_taken_minutes: median(times),
      pass_count: passCount,
      pass_rate_percent: done.length ? Math.round((passCount / done.length) * 100) : 0,
      pass_threshold_percentage: threshold,
      maximum_marks: max,
      duration_minutes: spec.durationMinutes,
    },
    status_breakdown: {
      in_progress: rows.length - done.length,
      submitted: done.length,
      finalized: done.length,
    },
    charts: {
      score_distribution_percent: buckets,
      time_taken_minutes: timeBuckets,
      submissions_timeline: timeline,
    },
    section_averages: sectionAverages,
    question_level_results: {
      mcq: mcqRows,
      coding: codingRows,
      subjective: spec.sections
        .filter((s) => s.type === "subjective")
        .flatMap((s) =>
          s.questionIds.map((id) => ({
            question_id: id,
            section_title: s.title,
            question_text: lookupWritten(id)?.question_text ?? "",
            max_marks: lookupWritten(id)?.max_marks ?? 0,
            evaluated_count: 0,
            pending_count: done.length,
          })),
        ),
      completed_submissions_used: done.length,
    },
    top_performers: ranked.map((row, index) => ({
      rank: index + 1,
      user_profile_id: row.person.id,
      name: row.person.full_name,
      email: row.person.email,
      score: row.score ?? 0,
      percentage: row.percent,
      time_taken_minutes: row.minutes,
      submitted_at: row.submittedAt ?? "",
      section_scores: sectionScoresFor(row),
    })),
    students: rows.map((row) => ({
      submission_id: row.submissionId,
      user_profile_id: row.person.id,
      name: row.person.full_name,
      email: row.person.email,
      status: row.status,
      score: row.score,
      percentage: row.status === "submitted" ? row.percent : null,
      time_taken_minutes: row.status === "submitted" ? row.minutes : null,
      total_questions: assessmentQuestionCount(spec),
      attempted_questions: Math.round((row.percent / 100) * assessmentQuestionCount(spec)),
      started_at: row.startedAt,
      submitted_at: row.submittedAt,
      section_scores: sectionScoresFor(row),
    })),
  };
}

// ── The coding round actually runs ──────────────────────────────────────────

/**
 * Execute the learner's JavaScript against a problem's real test cases.
 *
 * The same decision the adaptive coding workspace made, for the same reason: a
 * Run button that returns a canned pass is the most obvious fake in a demo of a
 * learning platform, and it is the first thing a technical evaluator tries. This
 * costs a `new Function` and a comparison, and in exchange the failing-case table
 * and the marks are both consequences of what was typed.
 */
const showValue = (v: unknown): string => JSON.stringify(v);

interface CaseRow {
  index: number;
  input: string;
  expected: string;
  actual: string;
  verdict: string;
  status: string;
  passed: boolean;
  stderr: string | null;
  compile_output: string | null;
}

function executeJs(
  source: string,
  problem: DemoCodingProblem,
  cases: Array<{ args: unknown[]; expected: unknown }>,
) {
  let fn: ((...args: unknown[]) => unknown) | null = null;
  let compileError: string | null = null;

  try {
    const factory = new Function(
      `"use strict";\n${source}\n;return typeof ${problem.fnName} === "function" ? ${problem.fnName} : null;`,
    );
    fn = factory() as ((...args: unknown[]) => unknown) | null;
  } catch (error) {
    compileError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }
  if (!compileError && !fn) {
    compileError = `No function named ${problem.fnName} was defined. Keep the function name from the template.`;
  }

  const results: CaseRow[] = cases.map((test, index) => {
    const base = {
      index,
      input: test.args.map(showValue).join(", "),
      expected: showValue(test.expected),
    };
    if (compileError) {
      return {
        ...base,
        actual: "",
        verdict: "Compilation Error",
        status: "Compilation Error",
        passed: false,
        stderr: null,
        compile_output: compileError,
      };
    }
    try {
      const args = JSON.parse(JSON.stringify(test.args)) as unknown[];
      const actual = fn!(...args);
      const passed = showValue(actual) === showValue(test.expected);
      return {
        ...base,
        actual: showValue(actual),
        verdict: passed ? "Accepted" : "Wrong Answer",
        status: passed ? "Accepted" : "Wrong Answer",
        passed,
        stderr: null,
        compile_output: null,
      };
    } catch (error) {
      return {
        ...base,
        actual: "",
        verdict: "Runtime Error",
        status: "Runtime Error",
        passed: false,
        stderr: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        compile_output: null,
      };
    }
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    results,
    test_cases: results,
    passed,
    passed_testcases: passed,
    total_testcases: results.length,
    total_test_cases: results.length,
    all_passed: !compileError && results.length > 0 && passed === results.length,
    status: compileError
      ? "Compilation Error"
      : passed === results.length
        ? "Accepted"
        : "Wrong Answer",
    compile_output: compileError,
    stderr: null as string | null,
    error: compileError ? "Compilation Error" : null,
  };
}

/** Anything other than JavaScript has no runner here, and the demo says so. */
function noRunnerFor(language: string, count: number) {
  const note =
    `This preview runs JavaScript in your own browser, so ${language} cannot be executed here. ` +
    `Switch the editor to JavaScript to have your solution graded for real against these cases.`;
  return {
    results: Array.from({ length: count }, (_, index) => ({
      index,
      input: "",
      expected: "",
      actual: "",
      verdict: "Not Run",
      status: "Not Run",
      passed: false,
      stderr: null,
      compile_output: note,
    })),
    test_cases: [],
    passed: 0,
    passed_testcases: 0,
    total_testcases: count,
    total_test_cases: count,
    all_passed: false,
    status: "Not Run",
    compile_output: note,
    stderr: null,
    error: "Not Run",
  };
}

/** Judge0 ids the editor sends. Only JavaScript has a runner in the browser. */
const JS_LANGUAGE_IDS = new Set([63, 93]);

function runProblem(problemId: number, body: Record<string, unknown>, hidden: boolean) {
  const problem = codingById(problemId);
  if (!problem) throw notFound("Coding problem not found");
  const source = String(body.source_code ?? "");
  const languageId = Number(body.language_id ?? 63);
  const cases = hidden ? problem.tests : problem.tests.filter((t) => !t.hidden);

  if (!JS_LANGUAGE_IDS.has(languageId)) {
    return { ...noRunnerFor(`language ${languageId}`, cases.length), best_code: source };
  }
  return { ...executeJs(source, problem, cases), best_code: source };
}

// ── AI generation, composer, copy assist ────────────────────────────────────

const LIBRARY = [...MCQ_BY_ID.values()];

/** Questions from the library that best match a topic, most relevant first. */
function libraryFor(topic: string, count: number, difficulty?: string): BankQuestion[] {
  const needle = topic.trim().toLowerCase();
  const scoreOf = (item: BankQuestion) => {
    const haystack = `${item.topic} ${item.skills} ${item.question_text}`.toLowerCase();
    let score = 0;
    if (needle && haystack.includes(needle)) score += 4;
    for (const word of needle.split(/\s+/).filter((w) => w.length > 3)) {
      if (haystack.includes(word)) score += 1;
    }
    if (difficulty && item.difficulty_level === difficulty) score += 2;
    return score;
  };
  const ranked = [...LIBRARY].sort((a, b) => scoreOf(b) - scoreOf(a) || a.id - b.id);
  const picked: BankQuestion[] = [];
  for (let i = 0; picked.length < count; i++) {
    const item = ranked[i % ranked.length];
    if (!item) break;
    picked.push(item);
    if (i > ranked.length * 2) break;
  }
  return picked;
}

interface GenerationJob {
  job_id: string;
  status: "pending" | "generating" | "completed" | "failed";
  question_type: "mcq" | "coding";
  section_ref?: string;
  assessment_id: number | null;
  total_items: number;
  completed_items: number;
  progress_percentage: number;
  questions: Record<string, unknown>[];
  error_log: unknown[];
}

function generationJobs(): Record<string, GenerationJob> {
  return overlay.get<Record<string, GenerationJob>>(KEY_GENERATION, {});
}

function saveGenerationJob(job: GenerationJob): GenerationJob {
  overlay.update<Record<string, GenerationJob>>(KEY_GENERATION, {}, (store) => ({
    ...store,
    [job.job_id]: job,
  }));
  return job;
}

function generatedMcqs(topic: string, count: number, difficulty?: string) {
  return libraryFor(topic, count, difficulty).map((item) => ({
    id: item.id,
    question_text: item.question_text,
    option_a: item.option_a,
    option_b: item.option_b,
    option_c: item.option_c,
    option_d: item.option_d,
    correct_option: item.correct_option,
    explanation: item.explanation,
    difficulty_level: item.difficulty_level,
    topic: item.topic,
    skills: item.skills,
    verification_status: "verified",
  }));
}

function generatedCoding(count: number, language: string) {
  return Array.from({ length: Math.max(1, count) }, (_, i) => ({
    ...codingProblemApi(codingId(i % CODING_PROBLEMS.length)),
    programming_language: language || "javascript",
    verification_status: "verified",
  }));
}

interface ComposerJob {
  job_id: string;
  brief: string;
  preset: string;
  created_ms: number;
  blueprint: {
    title: string;
    instructions: string;
    duration_minutes: number;
    proctoring_enabled: boolean;
    evaluation_mode: "auto" | "manual";
    show_result: boolean;
    sections: Array<{
      id: string;
      type: "mcq" | "coding";
      title: string;
      topic: string;
      count: number;
      difficulty_split: { easy: number; medium: number; hard: number };
      time_limit_minutes: number | null;
      programming_language?: string;
    }>;
  };
  generated_assessment_id: number | null;
}

function composerJobs(): Record<string, ComposerJob> {
  return overlay.get<Record<string, ComposerJob>>(KEY_COMPOSER, {});
}

/** The curated hiring-round catalogue the composer's company picker reads. */
const COMPANY_CATALOG = [
  {
    id: "cognizant",
    name: "Cognizant",
    short_name: "Cognizant",
    category: "IT services",
    exam_name: "GenC Next",
    pattern_year: "2026",
    rounds: [
      {
        key: "aptitude",
        title: "Aptitude and reasoning",
        summary: "Quantitative aptitude, logical reasoning and a short verbal set, timed per section.",
        duration_minutes: 60,
        has_coding: false,
        question_count: 20,
        section_titles: ["Quantitative aptitude", "Logical reasoning"],
      },
      {
        key: "technical",
        title: "Technical screening",
        summary: "Data structures, databases and one coding problem in the language of your choice.",
        duration_minutes: 75,
        has_coding: true,
        question_count: 17,
        section_titles: ["Data structures", "Databases", "Coding round"],
      },
    ],
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services",
    short_name: "TCS",
    category: "IT services",
    exam_name: "NQT",
    pattern_year: "2026",
    rounds: [
      {
        key: "nqt-foundation",
        title: "NQT foundation section",
        summary: "Numerical ability, verbal ability and reasoning, in the NQT pattern.",
        duration_minutes: 75,
        has_coding: false,
        question_count: 20,
        section_titles: ["Numerical ability", "Reasoning ability"],
      },
      {
        key: "nqt-advanced",
        title: "NQT advanced coding",
        summary: "Two coding problems with hidden test cases, plus an advanced quantitative set.",
        duration_minutes: 90,
        has_coding: true,
        question_count: 12,
        section_titles: ["Advanced quantitative", "Coding round"],
      },
    ],
  },
  {
    id: "zoho",
    name: "Zoho",
    short_name: "Zoho",
    category: "Product",
    exam_name: "Zoho hiring test",
    pattern_year: "2026",
    rounds: [
      {
        key: "round-1",
        title: "Round 1: aptitude and basics",
        summary: "Pattern recognition, series and programming fundamentals with no calculator.",
        duration_minutes: 60,
        has_coding: false,
        question_count: 18,
        section_titles: ["Aptitude", "Programming fundamentals"],
      },
      {
        key: "round-2",
        title: "Round 2: programming",
        summary: "Two implementation-heavy problems judged on correctness and edge cases.",
        duration_minutes: 90,
        has_coding: true,
        question_count: 8,
        section_titles: ["Programming", "Coding round"],
      },
    ],
  },
];

function blueprintFor(brief: string, preset: string, company?: string, roundKey?: string) {
  const round = company
    ? COMPANY_CATALOG.find((c) => c.id === company)?.rounds.find((r) => r.key === roundKey)
    : undefined;
  const companyName = company ? COMPANY_CATALOG.find((c) => c.id === company)?.name : undefined;

  const proctored = preset === "proctored_screening" || Boolean(round);
  const coding = preset === "coding_challenge" || round?.has_coding === true;
  const title = round && companyName ? `${companyName}: ${round.title}` : briefTitle(brief);
  const titles = round?.section_titles ?? sectionTitlesFor(brief);

  const sections = titles.map((sectionTitle, index) => {
    const isCoding = coding && index === titles.length - 1;
    const count = isCoding ? 2 : Math.max(3, Math.round((round?.question_count ?? 15) / titles.length));
    const easy = Math.round(count * 0.3);
    const hard = Math.round(count * 0.2);
    return {
      id: `s${index + 1}`,
      type: (isCoding ? "coding" : "mcq") as "coding" | "mcq",
      title: sectionTitle,
      topic: sectionTitle,
      count,
      difficulty_split: { easy, medium: Math.max(0, count - easy - hard), hard },
      time_limit_minutes: isCoding ? 30 : null,
      ...(isCoding ? { programming_language: "javascript" } : {}),
    };
  });

  return {
    title,
    instructions:
      `${round?.duration_minutes ?? 60} minutes across ${sections.length} sections. ` +
      `Questions are fixed for every candidate, and the paper submits itself when the timer ends.`,
    duration_minutes: round?.duration_minutes ?? 60,
    proctoring_enabled: proctored,
    evaluation_mode: "auto" as const,
    show_result: true,
    sections,
  };
}

function briefTitle(brief: string): string {
  const clean = brief.replace(/\s+/g, " ").trim();
  if (!clean) return "Screening assessment";
  const first = clean.split(/[.;]/)[0];
  const trimmed = first.length > 70 ? `${first.slice(0, 67)}...` : first;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** Section headings inferred from the brief, falling back to a sensible screen. */
function sectionTitlesFor(brief: string): string[] {
  const lower = brief.toLowerCase();
  const candidates: Array<[string, string]> = [
    ["react", "React and the browser"],
    ["javascript", "JavaScript mechanics"],
    ["typescript", "TypeScript and types"],
    ["python", "Python and pandas"],
    ["sql", "SQL and data modelling"],
    ["data structure", "Data structures"],
    ["algorithm", "Algorithms and complexity"],
    ["aws", "Cloud and delivery"],
    ["cloud", "Cloud and delivery"],
    ["api", "APIs and the request lifecycle"],
    ["http", "APIs and the request lifecycle"],
  ];
  const hits = candidates.filter(([needle]) => lower.includes(needle)).map(([, title]) => title);
  const unique = [...new Set(hits)];
  if (unique.length >= 2) return unique.slice(0, 3);
  if (unique.length === 1) return [unique[0], "General reasoning"];
  return ["Core concepts", "Applied reasoning"];
}

/**
 * Composer progress is derived from elapsed time rather than stored.
 *
 * The review page polls every two seconds and expects to watch a job move, so a
 * job that was already complete on the first poll would show a progress screen
 * that never progressed. Reading the clock keeps the phases honest without a
 * timer running in the background of a page nobody may be looking at.
 */
function composerView(job: ComposerJob) {
  const elapsed = (nowMs() - job.created_ms) / 1000;
  const planned = job.blueprint.sections.reduce((sum, s) => sum + s.count, 0);

  let status: string;
  let progress: number;
  if (elapsed < 2) {
    status = "generating_blueprint";
    progress = 12;
  } else if (elapsed < 4) {
    status = "blueprint_ready";
    progress = 28;
  } else if (elapsed < 11) {
    status = "generating_questions";
    progress = 28 + Math.round(((elapsed - 4) / 7) * 60);
  } else {
    status = "completed";
    progress = 100;
  }

  const completedQuestions =
    status === "completed"
      ? planned
      : status === "generating_questions"
        ? Math.min(planned, Math.floor(((elapsed - 4) / 7) * planned))
        : 0;

  const questions: Record<string, unknown>[] = [];
  for (const section of job.blueprint.sections) {
    if (questions.length >= completedQuestions) break;
    const room = completedQuestions - questions.length;
    const take = Math.min(section.count, room);
    if (section.type === "coding") {
      generatedCoding(take, section.programming_language ?? "javascript").forEach((problem, i) => {
        questions.push({
          ...problem,
          _section_ref: section.id,
          _question_type: "coding",
          _difficulty: i === 0 ? "Medium" : "Hard",
        });
      });
    } else {
      generatedMcqs(section.topic, take).forEach((item) => {
        questions.push({
          ...item,
          _section_ref: section.id,
          _question_type: "mcq",
          _difficulty: item.difficulty_level,
        });
      });
    }
  }

  return {
    job_id: job.job_id,
    status,
    brief: job.brief,
    preset: job.preset,
    progress_percentage: progress,
    question_progress: {
      total: planned,
      completed: completedQuestions,
      percentage: planned ? Math.round((completedQuestions / planned) * 100) : 0,
    },
    blueprint: job.blueprint,
    questions,
    generated_assessment_id: status === "completed" ? job.generated_assessment_id : null,
    error_log: [],
    created_at: iso(new Date(job.created_ms)),
  };
}

// ── Authoring ───────────────────────────────────────────────────────────────

const KEY_CUSTOM_MCQ = "assessment:custom-mcqs";
const KEY_CUSTOM_WRITTEN = "assessment:custom-written";

function customMcqs(): Record<string, BankQuestion> {
  return overlay.get<Record<string, BankQuestion>>(KEY_CUSTOM_MCQ, {});
}

function customWritten(): Record<string, WrittenQuestion> {
  return overlay.get<Record<string, WrittenQuestion>>(KEY_CUSTOM_WRITTEN, {});
}

/**
 * Questions the visitor authored live in the same lookup as the seeded library.
 *
 * Without this the create flow "worked" and then the paper it produced had no
 * questions in it: the scorer, the take payload and the export all read the
 * module-level map, which a new question could never be in after a reload.
 */
function lookupMcq(id: number): BankQuestion | undefined {
  return MCQ_BY_ID.get(id) ?? customMcqs()[String(id)];
}

function lookupWritten(id: number): WrittenQuestion | undefined {
  return WRITTEN_BY_ID.get(id) ?? customWritten()[String(id)];
}

function persistMcq(input: Record<string, unknown>): BankQuestion {
  const id = Number(input.id) || nextDemoId("mcq");
  const letter = String(input.correct_option ?? "A").toUpperCase();
  const question: BankQuestion = {
    id,
    question_text: String(input.question_text ?? "Untitled question"),
    option_a: String(input.option_a ?? ""),
    option_b: String(input.option_b ?? ""),
    option_c: String(input.option_c ?? ""),
    option_d: String(input.option_d ?? ""),
    correct_option: ((LETTERS as readonly string[]).includes(letter)
      ? letter
      : "A") as BankQuestion["correct_option"],
    explanation: String(input.explanation ?? ""),
    difficulty_level: (String(input.difficulty_level ?? "Medium") as BankQuestion["difficulty_level"]),
    topic: String(input.topic ?? "General"),
    skills: String(input.skills ?? ""),
  };
  overlay.update<Record<string, BankQuestion>>(KEY_CUSTOM_MCQ, {}, (store) => ({
    ...store,
    [String(id)]: question,
  }));
  return question;
}

function persistWritten(input: Record<string, unknown>): WrittenQuestion {
  const id = Number(input.id) || nextDemoId("written");
  const question: WrittenQuestion = {
    id,
    question_text: String(input.question_text ?? "Untitled question"),
    evaluation_prompt: String(input.evaluation_prompt ?? ""),
    max_marks: Number(input.max_marks) || 10,
    question_type: String(input.question_type ?? "long_answer"),
    answer_mode: String(input.answer_mode ?? "text"),
    topic: String(input.topic ?? "General"),
    skills: String(input.skills ?? ""),
    difficulty_level: String(input.difficulty_level ?? "Medium"),
  };
  overlay.update<Record<string, WrittenQuestion>>(KEY_CUSTOM_WRITTEN, {}, (store) => ({
    ...store,
    [String(id)]: question,
  }));
  return question;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function numbers(value: unknown): number[] {
  return Array.isArray(value) ? value.map((v) => Number(v)).filter(Number.isFinite) : [];
}

/** Multipart create/update sends the JSON under a `payload` field. */
function readBody(raw: unknown): Record<string, unknown> {
  if (typeof FormData !== "undefined" && raw instanceof FormData) {
    const payload = raw.get("payload");
    if (typeof payload === "string") {
      try {
        return JSON.parse(payload) as Record<string, unknown>;
      } catch {
        return {};
      }
    }
    return {};
  }
  return (raw ?? {}) as Record<string, unknown>;
}

function sectionsFromPayload(body: Record<string, unknown>, assessmentId: number): SectionSpec[] {
  const out: SectionSpec[] = [];
  let seq = 1;
  const nextSectionId = () => assessmentId * 10 + seq++;

  const quizBlocks = [...asArray(body.quizSection), ...asArray(body.quiz_sections)];
  for (const block of quizBlocks) {
    const inline = asArray(block.mcqs).map((m) => persistMcq(m).id);
    const referenced = numbers(block.mcq_ids);
    out.push({
      id: nextSectionId(),
      type: "quiz",
      title: String(block.title ?? `Section ${out.length + 1}`),
      description: String(block.description ?? ""),
      order: Number(block.order) || out.length + 1,
      timeLimitMinutes: Number(block.time_limit_minutes) || null,
      questionIds: [...referenced, ...inline],
    });
  }

  const codingBlocks = [...asArray(body.codingProblemSection), ...asArray(body.coding_sections)];
  for (const block of codingBlocks) {
    out.push({
      id: nextSectionId(),
      type: "coding",
      title: String(block.title ?? "Coding round"),
      description: String(block.description ?? ""),
      order: Number(block.order) || out.length + 1,
      timeLimitMinutes: Number(block.time_limit_minutes) || null,
      questionIds: numbers(block.coding_problem_ids),
    });
  }

  for (const block of asArray(body.subjectiveQuestionSection)) {
    const inline = asArray(block.subjective_questions).map((w) => persistWritten(w).id);
    out.push({
      id: nextSectionId(),
      type: "subjective",
      title: String(block.title ?? "Written section"),
      description: String(block.description ?? ""),
      order: Number(block.order) || out.length + 1,
      timeLimitMinutes: Number(block.time_limit_minutes) || null,
      questionIds: [...numbers(block.subjective_question_ids), ...inline],
    });
  }

  // A create that carries a bare `mcqs` array (the older single-section shape)
  // still has to produce a paper with questions in it rather than an empty shell.
  const loose = asArray(body.mcqs);
  if (out.length === 0 && loose.length > 0) {
    out.push({
      id: nextSectionId(),
      type: "quiz",
      title: "Section 1",
      description: "",
      order: 1,
      timeLimitMinutes: null,
      questionIds: loose.map((m) => persistMcq(m).id),
    });
  }

  return out.sort((a, b) => a.order - b.order);
}

function specFromPayload(body: Record<string, unknown>, id: number): AssessmentSpec {
  const title = String(body.title ?? "Untitled assessment");
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `assessment-${id}`;

  return {
    id,
    slug: `${slug}-${id}`,
    title,
    description: String(body.description ?? ""),
    instructions: String(body.instructions ?? ""),
    durationMinutes: Number(body.duration_minutes) || 60,
    proctoringEnabled: body.proctoring_enabled === true,
    evaluationMode: body.evaluation_mode === "manual" ? "manual" : "auto",
    allowMovement: body.allow_movement !== false,
    isDraft: body.is_draft === true,
    isActive: body.is_active !== false && body.is_draft !== true,
    certificateAvailable: body.certificate_available === true,
    passLower: body.pass_band_lower_min_percent != null ? String(body.pass_band_lower_min_percent) : "40",
    passUpper: body.pass_band_upper_min_percent != null ? String(body.pass_band_upper_min_percent) : null,
    tabSwitchLimit: body.tab_switch_limit_enabled === true ? Number(body.tab_switch_limit_count) || 3 : null,
    aiGenerated: body.__ai_generated === true,
    courseIds: numbers(body.course_ids),
    startTime: typeof body.start_time === "string" && body.start_time ? body.start_time : null,
    endTime: typeof body.end_time === "string" && body.end_time ? body.end_time : null,
    cohortSize: 0,
    sections: sectionsFromPayload(body, id),
  };
}

function addSpec(spec: AssessmentSpec): AssessmentSpec {
  overlay.update<AssessmentSpec[]>(KEY_CUSTOM, [], (list) => [...list, spec]);
  return spec;
}

function patchSpec(id: number, patch: SpecPatch): void {
  overlay.update<Record<string, SpecPatch>>(KEY_PATCH, {}, (store) => ({
    ...store,
    [String(id)]: { ...(store[String(id)] ?? {}), ...patch },
  }));
}

// ── Certificates ────────────────────────────────────────────────────────────

/**
 * The certificate art is generated inline as a data URI.
 *
 * A remote image would be a network call, which this prototype does not make,
 * and an empty src renders as a broken-image icon on a page whose entire job is
 * to look like an achievement. No comment markers inside the SVG: a double
 * hyphen in an XML comment makes the whole document unparseable and the tile
 * silently blanks.
 */
function certificateArt(title: string, learner: string): string {
  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
      <defs>
        <linearGradient id="certbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2b1244"/>
          <stop offset="55%" stop-color="#3d1663"/>
          <stop offset="100%" stop-color="#7d2058"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="url(#certbg)"/>
      <rect x="28" y="28" width="904" height="484" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
      <text x="480" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#ffffff" opacity="0.72">Certificate of Achievement</text>
      <text x="480" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#ffffff">${safe(learner)}</text>
      <text x="480" y="320" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#ffffff" opacity="0.82">${safe(title)}</text>
      <text x="480" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#ffffff" opacity="0.6">AI Linc</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function availableCertificates() {
  const out: Array<{
    id: number;
    course_id: number;
    course_title: string;
    certificate_url: string;
    issued_at: string;
  }> = [];

  for (const spec of allAssessments()) {
    if (!spec.certificateAvailable) continue;
    const attempt = attemptsFor(spec.id).find((a) => a.status === "submitted");
    if (!attempt) continue;
    const scored = scoreSheet(spec, attempt.sheet);
    const percent = scored.maximumMarks ? (scored.autoScore / scored.maximumMarks) * 100 : 0;
    if (percent < Number(spec.passLower ?? 40)) continue;
    out.push({
      id: spec.id,
      course_id: spec.courseIds[0] ?? spec.id,
      course_title: spec.title,
      certificate_url: certificateArt(spec.title, STUDENT_PERSONA.full_name),
      issued_at: attempt.submittedAt ?? isoDaysAgo(1),
    });
  }
  return out;
}

// ── Routes ──────────────────────────────────────────────────────────────────

defineRoutes(MODULE, {
  // Learner: overview, readiness, attempt ────────────────────────────────────

  "GET /assessment/api/client/:clientId/assessment-details/:slug/": (req) =>
    learnerDetailApi(requireAssessment(req.params.slug)),

  /**
   * The pre-attempt readiness card. The panel renders nothing at all when
   * `available` is false, so a paper with no practice history behind it stays
   * silent rather than showing a fabricated score band.
   */
  "GET /assessment/api/client/:clientId/assessment-readiness/:slug/": (req) => {
    const spec = requireAssessment(req.params.slug);
    const questions = spec.sections
      .filter((s) => s.type === "quiz")
      .flatMap((s) => s.questionIds.map((id) => lookupMcq(id)))
      .filter((x): x is BankQuestion => Boolean(x));

    if (questions.length === 0) {
      return {
        available: false,
        overall_band: null,
        practice_accuracy: null,
        topic_coverage: null,
        confidence: null,
        softest_topic: null,
        skills: [],
        reason: "This paper has no practice history behind it yet.",
      };
    }

    const topics = [...new Set(questions.map((q) => q.topic))];
    const skills = topics.map((topic) => ({
      name: topic,
      proficiency: seededInt(`ready:${spec.id}:${topic}`, 42, 88),
      attempts: seededInt(`ready:n:${spec.id}:${topic}`, 4, 26),
    }));
    const softest = [...skills].sort((a, b) => a.proficiency - b.proficiency)[0];
    const practice = Math.round(skills.reduce((s, x) => s + x.proficiency, 0) / skills.length);

    return {
      available: true,
      overall_band: practice >= 75 ? "Ready" : practice >= 55 ? "Nearly ready" : "Needs practice",
      practice_accuracy: practice,
      topic_coverage: Math.min(100, Math.round((skills.length / Math.max(1, topics.length)) * 100)),
      confidence: Math.max(35, practice - 8),
      softest_topic: { name: softest.name, accuracy: softest.proficiency },
      skills,
      reason: null,
    };
  },

  /** Starting a paper. Creates the attempt the autosave and the report both read. */
  "GET /assessment/api/client/:clientId/start-assessment/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const open = openAttempt(spec.id);
    if (open) return takePayload(spec, open);

    const previous = attemptsFor(spec.id);
    const lastSubmitted = previous.find((a) => a.status === "submitted");
    if (lastSubmitted) {
      const grants = retakesFor(spec.id);
      const mine = grants.find((g) => g.user_id === STUDENT_PERSONA.id);
      if (!mine) {
        // The take page reads this and sends the learner back to the overview
        // rather than letting them re-enter a paper they have already handed in.
        return { ...takePayload(spec, lastSubmitted), status: "submitted" };
      }
      // A granted retake is consumed the moment a new attempt exists, exactly as
      // the real endpoint does, so one grant can never buy two attempts.
      overlay.update<Record<string, RetakeGrant[]>>(KEY_RETAKES, {}, (store) => ({
        ...store,
        [String(spec.id)]: (store[String(spec.id)] ?? []).filter((g) => g.id !== mine.id),
      }));
    }

    const attempt = saveAttempt({
      id: nextDemoId("assessment-attempt"),
      assessmentId: spec.id,
      attemptNumber: previous.length + 1,
      startedAt: iso(new Date(nowMs())),
      submittedAt: null,
      status: "in_progress",
      sheet: {},
      autoSubmittedReason: null,
      minutesSpent: null,
    });
    return takePayload(spec, attempt);
  },

  /** Autosave. Every keystroke the learner has committed, kept across a reload. */
  "PUT /assessment/api/client/:clientId/assessment-submission/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const attempt = openAttempt(spec.id) ?? latestAttempt(spec.id);
    if (!attempt) throw notFound("No attempt in progress");
    const body = (req.body ?? {}) as { response_sheet?: ResponseSheet; metadata?: unknown };
    const sheet: ResponseSheet = {
      ...attempt.sheet,
      ...(body.response_sheet ?? {}),
    };
    saveAttempt({ ...attempt, sheet });
    return { response_sheet: sheet, status: attempt.status };
  },

  /** Final submit: the attempt closes, and the score falls out of the scorer. */
  "PUT /assessment/api/client/:clientId/assessment-submission/:assessmentId/final/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const attempt = openAttempt(spec.id) ?? latestAttempt(spec.id);
    if (!attempt) throw notFound("No attempt in progress");

    const body = (req.body ?? {}) as {
      response_sheet?: ResponseSheet;
      auto_submitted_reason?: string;
      auto_submitted_meta?: Record<string, unknown>;
    };
    const sheet: ResponseSheet = { ...attempt.sheet, ...(body.response_sheet ?? {}) };
    const started = new Date(attempt.startedAt).getTime();
    const minutes = Math.max(1, Math.round((nowMs() - started) / 60_000));

    const closed = saveAttempt({
      ...attempt,
      sheet,
      status: "submitted",
      submittedAt: iso(new Date(nowMs())),
      autoSubmittedReason: body.auto_submitted_reason ?? null,
      minutesSpent: Math.min(minutes, spec.durationMinutes),
    });

    // The learner hub reads this key for its card state, so a submitted paper
    // has to appear submitted there too and not only on the report.
    overlay.update<number[]>(KEY_SUBMITTED, [], (list) =>
      list.includes(spec.id) ? list : [...list, spec.id],
    );

    const scored = scoreSheet(spec, sheet);
    return {
      id: closed.id,
      score: scored.autoScore,
      offered_scholarship_percentage: scholarshipPercent(spec, scored),
      status: "submitted",
      submitted_at: closed.submittedAt,
      review_status: reviewStatusFor(spec, closed),
      show_result: true,
      message: "Your assessment has been submitted.",
      auto_submitted_reason: closed.autoSubmittedReason,
      auto_submitted_meta: body.auto_submitted_meta ?? {},
      auto_submit_message:
        closed.autoSubmittedReason === "tab_switch_limit"
          ? "This paper was submitted automatically because the tab-switch limit was reached."
          : "",
      assessment_details: learnerDetailApi(spec),
    };
  },

  "GET /assessment/api/client/:clientId/assessment-result/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const wanted = req.query.get("attempt");
    const submitted = attemptsFor(spec.id).filter((a) => a.status === "submitted");
    if (submitted.length === 0) throw notFound("No submitted attempt for this assessment");
    const attempt =
      (wanted ? submitted.find((a) => String(a.id) === wanted) : undefined) ??
      submitted[submitted.length - 1];
    return buildResult(spec, attempt);
  },

  "GET /assessment/api/client/:clientId/attempted-assessments/": () =>
    allAssessments()
      .flatMap((spec) =>
        attemptsFor(spec.id)
          .filter((a) => a.status === "submitted")
          .map((a) => ({
            id: a.id,
            assessment: { id: spec.id, title: spec.title, slug: spec.slug },
            score: scoreSheet(spec, a.sheet).autoScore,
            status: "submitted",
            submitted_at: a.submittedAt ?? isoDaysAgo(1),
          })),
      )
      .sort((a, b) => (a.submitted_at < b.submitted_at ? 1 : -1)),

  "GET /assessment/api/client/:clientId/scholarship-assessment-status/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const attempt = attemptsFor(spec.id).find((a) => a.status === "submitted");
    if (!attempt) {
      return {
        has_submitted: false,
        score: 0,
        offered_scholarship_percentage: 0,
        is_redeemed: false,
        referral_code: "",
      };
    }
    const scored = scoreSheet(spec, attempt.sheet);
    return {
      has_submitted: true,
      score: scored.autoScore,
      offered_scholarship_percentage: scholarshipPercent(spec, scored),
      is_redeemed: overlay.get<number[]>(KEY_SCHOLARSHIP, []).includes(spec.id),
      referral_code: referralCode(spec),
    };
  },

  "POST /assessment/api/client/:clientId/redeem-scholarship/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const attempt = attemptsFor(spec.id).find((a) => a.status === "submitted");
    if (!attempt) throw badRequest({ detail: "Submit the assessment before redeeming." });
    const scored = scoreSheet(spec, attempt.sheet);
    overlay.update<number[]>(KEY_SCHOLARSHIP, [], (list) =>
      list.includes(spec.id) ? list : [...list, spec.id],
    );
    return {
      scholarship_percentage: scholarshipPercent(spec, scored),
      referral_code: referralCode(spec),
      message: "Your scholarship has been applied to your account.",
    };
  },

  // Learner: the coding round ────────────────────────────────────────────────

  "POST /assessment/api/client/:clientId/run-code/:slug/:questionId/": (req) =>
    runProblem(Number(req.params.questionId), (req.body ?? {}) as Record<string, unknown>, false),

  "POST /assessment/api/client/:clientId/submit-code/:slug/:questionId/": (req) =>
    runProblem(Number(req.params.questionId), (req.body ?? {}) as Record<string, unknown>, true),

  "POST /assessment/api/client/:clientId/run-custom-testcase/:slug/:questionId/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const problem = codingById(Number(req.params.questionId));
    if (!problem) throw notFound("Coding problem not found");
    const languageId = Number(body.language_id ?? 63);
    if (!JS_LANGUAGE_IDS.has(languageId)) return noRunnerFor(`language ${languageId}`, 1);

    // The learner's OWN input, parsed as the argument list. Running the stored
    // sample cases here instead is the classic bug: the box appears to work and
    // always prints the same preloaded output whatever is typed into it.
    let args: unknown[];
    const raw = String(body.input ?? "").trim();
    try {
      args = JSON.parse(`[${raw}]`) as unknown[];
    } catch {
      throw badRequest({ detail: "Custom input must be a comma-separated list of JSON values." });
    }
    const outcome = executeJs(String(body.source_code ?? ""), problem, [{ args, expected: null }]);
    const first = outcome.results[0];
    return {
      status: first?.stderr || outcome.compile_output ? "Error" : "Executed",
      stdout: first?.actual ?? "",
      output: first?.actual ?? "",
      stderr: first?.stderr ?? null,
      compile_output: outcome.compile_output,
      results: outcome.results,
    };
  },

  "GET /api/clients/:clientId/user-available-certificates/": () => availableCertificates(),
});

/**
 * Scholarship band. Only papers that carry an upper band offer one, so the
 * success page stays quiet for an ordinary unit test instead of inventing an
 * award nobody at the institution has approved.
 */
function scholarshipPercent(spec: AssessmentSpec, scored: ScoreResult): number {
  if (!spec.passUpper) return 0;
  const percent = scored.maximumMarks ? (scored.autoScore / scored.maximumMarks) * 100 : 0;
  if (percent >= Number(spec.passUpper)) return 25;
  if (percent >= Number(spec.passLower ?? 40)) return 10;
  return 0;
}

function referralCode(spec: AssessmentSpec): string {
  return `AILINC-${spec.slug.slice(0, 6).toUpperCase()}-${STUDENT_PERSONA.id}`;
}

// ── Admin routes ────────────────────────────────────────────────────────────

defineRoutes(MODULE, {
  "GET /admin-dashboard/api/clients/:clientId/assessments/": () =>
    allAssessments().map(adminListRow),

  "POST /admin-dashboard/api/clients/:clientId/assessments/": (req) => {
    const body = readBody(req.body);
    const spec = addSpec(specFromPayload(body, nextDemoId("assessment")));
    return adminListRow(spec);
  },

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/": (req) =>
    adminDetail(requireAssessment(req.params.assessmentId)),

  "PATCH /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const body = readBody(req.body);
    const patch: SpecPatch = {};
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.instructions === "string") patch.instructions = body.instructions;
    if (body.duration_minutes != null) patch.durationMinutes = Number(body.duration_minutes);
    if (body.proctoring_enabled != null) patch.proctoringEnabled = body.proctoring_enabled === true;
    if (body.evaluation_mode === "auto" || body.evaluation_mode === "manual") {
      patch.evaluationMode = body.evaluation_mode;
    }
    if (body.allow_movement != null) patch.allowMovement = body.allow_movement !== false;
    if (body.is_draft != null) patch.isDraft = body.is_draft === true;
    if (body.is_active != null) patch.isActive = body.is_active !== false;
    if (body.certificate_available != null) {
      patch.certificateAvailable = body.certificate_available === true;
    }
    if (body.pass_band_lower_min_percent != null) {
      patch.passLower = String(body.pass_band_lower_min_percent);
    }
    if (body.pass_band_upper_min_percent != null) {
      patch.passUpper = String(body.pass_band_upper_min_percent);
    }
    if (body.tab_switch_limit_enabled != null) {
      patch.tabSwitchLimit =
        body.tab_switch_limit_enabled === true ? Number(body.tab_switch_limit_count) || 3 : null;
    }
    if (typeof body.start_time === "string") patch.startTime = body.start_time || null;
    if (typeof body.end_time === "string") patch.endTime = body.end_time || null;
    if (Array.isArray(body.course_ids)) patch.courseIds = numbers(body.course_ids);

    patchSpec(spec.id, patch);

    // Sections only get rewritten when the payload actually carries them: the
    // settings tab PATCHes a handful of flags, and treating that as "no sections"
    // would silently empty the paper it was editing.
    const rewritten = sectionsFromPayload(body, spec.id);
    if (rewritten.length > 0) {
      const existing = customSpecs();
      if (existing.some((s) => s.id === spec.id)) {
        overlay.set(
          KEY_CUSTOM,
          existing.map((s) => (s.id === spec.id ? { ...s, ...patch, sections: rewritten } : s)),
        );
      } else {
        addSpec({ ...spec, ...patch, sections: rewritten });
        overlay.update<number[]>(KEY_DELETED, [], (list) =>
          list.includes(spec.id) ? list : list,
        );
      }
    }
    return adminListRow(requireAssessment(spec.id));
  },

  "DELETE /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    overlay.update<number[]>(KEY_DELETED, [], (list) =>
      list.includes(spec.id) ? list : [...list, spec.id],
    );
    overlay.update<AssessmentSpec[]>(KEY_CUSTOM, [], (list) => list.filter((s) => s.id !== spec.id));
    return { detail: `"${spec.title}" has been deleted.` };
  },

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/publish/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const body = readBody(req.body);
    patchSpec(spec.id, { isDraft: false, isActive: body.is_active !== false });
    return adminListRow(requireAssessment(spec.id));
  },

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/duplicate/": (req) => {
    const source = requireAssessment(req.params.assessmentId);
    const id = nextDemoId("assessment");
    const copy = addSpec({
      ...source,
      id,
      slug: `${source.slug}-copy-${id}`,
      title: `${source.title} (copy)`,
      isDraft: true,
      isActive: false,
      cohortSize: 0,
      startTime: null,
      endTime: null,
      // Section ids have to be fresh: the response sheet is keyed by section id,
      // and a copy that reused them would file its answers under the original.
      sections: source.sections.map((s, i) => ({ ...s, id: id * 10 + i + 1 })),
    });
    return adminListRow(copy);
  },

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/run-email-job/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const recipients = Math.max(1, cohortFor(spec).length);
    return {
      task_id: `email-${spec.id}-${nextDemoId("assessment-email")}`,
      status: "queued",
      message: `Notification queued for ${recipients} learner(s).`,
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/publish-results/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const rows = adminSubmissions(spec).filter((r) => r.status === "submitted");
    overlay.update<string[]>(KEY_PUBLISHED, [], (list) => {
      const next = new Set(list);
      rows.forEach((r) => next.add(evalKey(spec.id, r.submissionId)));
      return [...next];
    });
    return { published_count: rows.length };
  },

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/analytics/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const top = Math.min(100, Math.max(1, Number(req.query.get("top_performers")) || 10));
    return analytics(spec, top);
  },

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/export-questions/": (req) =>
    questionsExport(requireAssessment(req.params.assessmentId)),

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/submissions-export/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const rows = adminSubmissions(spec);
    // The submissions tab probes with `?meta_only=1` first so it can show a real
    // count while the heavy payload builds, instead of a misleading "0 submissions".
    if (req.query.get("meta_only")) {
      return {
        computing: false,
        ready: true,
        processed_count: rows.length,
        total_count: rows.length,
        count: rows.length,
      };
    }
    return submissionsExport(spec);
  },

  // Retakes ─────────────────────────────────────────────────────────────────

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/retake-grants/": (req) =>
    retakesFor(requireAssessment(req.params.assessmentId).id),

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/retake-grants/": (req) => {
    const spec = requireAssessment(req.params.assessmentId);
    const body = (req.body ?? {}) as { user_email?: string; user_id?: number; note?: string };
    const email = String(body.user_email ?? "").trim().toLowerCase();
    const person =
      [STUDENT_PERSONA, ...STUDENTS].find(
        (p) => p.email.toLowerCase() === email || p.id === Number(body.user_id),
      ) ?? null;
    if (!person) {
      throw badRequest({ detail: "No learner at this institution matches that email address." });
    }
    if (retakesFor(spec.id).some((g) => g.user_id === person.id)) {
      throw badRequest({ detail: `${person.full_name} already holds an unused re-attempt.` });
    }

    const grant: RetakeGrant = {
      id: nextDemoId("retake-grant"),
      user_id: person.id,
      user_email: person.email,
      user_name: person.full_name,
      granted_at: iso(new Date(nowMs())),
      granted_by_email: ADMIN_PERSONA.email,
      note: String(body.note ?? "").trim(),
    };
    overlay.update<Record<string, RetakeGrant[]>>(KEY_RETAKES, {}, (store) => ({
      ...store,
      [String(spec.id)]: [...(store[String(spec.id)] ?? []), grant],
    }));
    return grant;
  },

  "DELETE /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/retake-grants/:grantId/": (
    req,
  ) => {
    const spec = requireAssessment(req.params.assessmentId);
    const grantId = Number(req.params.grantId);
    overlay.update<Record<string, RetakeGrant[]>>(KEY_RETAKES, {}, (store) => ({
      ...store,
      [String(spec.id)]: (store[String(spec.id)] ?? []).filter((g) => g.id !== grantId),
    }));
    return { detail: "Re-attempt revoked." };
  },

  // Manual evaluation ───────────────────────────────────────────────────────

  "GET /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/submissions/:submissionId/manual-evaluation/":
    (req) => {
      const spec = requireAssessment(req.params.assessmentId);
      const submissionId = Number(req.params.submissionId);
      const row = adminSubmissions(spec).find((r) => r.submissionId === submissionId);
      if (!row) throw notFound("Submission not found");

      const payload = manualEvaluationFor(spec.id, submissionId);
      const result = row.attempt ? buildResult(spec, row.attempt) : null;
      const responses = result
        ? result.user_responses
        : syntheticResponses(spec, row.person, row.percent);

      return {
        assessment: {
          id: spec.id,
          title: spec.title,
          slug: spec.slug,
          evaluation_mode: spec.evaluationMode,
        },
        submission: {
          id: submissionId,
          status: row.status,
          review_status: submissionReviewStatus(spec, submissionId),
          score: row.score,
          published_at: isSubmissionPublished(spec.id, submissionId)
            ? (payload?.saved_at ?? iso(new Date(nowMs())))
            : null,
          last_evaluated_at: payload?.saved_at ?? null,
          manual_evaluation_payload: payload ?? undefined,
        },
        student: {
          id: row.person.id,
          name: row.person.full_name,
          email: row.person.email,
          phone: row.person.phone,
        },
        responses: {
          quiz_responses: responses.quiz_responses,
          coding_problem_responses: responses.coding_problem_responses,
          subjective_responses: responses.subjective_responses,
        },
        maximum_marks: assessmentMaxMarks(spec),
      };
    },

  "PATCH /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/submissions/:submissionId/manual-evaluation/":
    (req) => {
      const spec = requireAssessment(req.params.assessmentId);
      const submissionId = Number(req.params.submissionId);
      const body = (req.body ?? {}) as { manual_evaluation_payload?: ManualEvaluation };
      const payload: ManualEvaluation = {
        quiz_scores: body.manual_evaluation_payload?.quiz_scores ?? [],
        coding_scores: body.manual_evaluation_payload?.coding_scores ?? [],
        subjective_scores: body.manual_evaluation_payload?.subjective_scores ?? [],
        admin_notes: body.manual_evaluation_payload?.admin_notes,
        saved_at: iso(new Date(nowMs())),
      };
      overlay.update<Record<string, ManualEvaluation>>(KEY_EVAL, {}, (store) => ({
        ...store,
        [evalKey(spec.id, submissionId)]: payload,
      }));
      return { message: "Evaluation saved." };
    },

  "POST /admin-dashboard/api/clients/:clientId/assessments/:assessmentId/submissions/:submissionId/publish/":
    (req) => {
      const spec = requireAssessment(req.params.assessmentId);
      const submissionId = Number(req.params.submissionId);
      overlay.update<string[]>(KEY_PUBLISHED, [], (list) =>
        list.includes(evalKey(spec.id, submissionId))
          ? list
          : [...list, evalKey(spec.id, submissionId)],
      );
      return { message: "Result published to the learner." };
    },
});

/**
 * A cohort member's paper, reconstructed from their score.
 *
 * The grading screen needs per-question answers, not a total, and inventing a
 * separate set of "answers" that did not add up to the score on the row next to
 * it would be caught by the first administrator who added the marks up. So the
 * sheet is generated to match the score and then run through the same scorer,
 * which means the two agree by construction.
 */
function syntheticSheet(spec: AssessmentSpec, person: DemoPerson, percent: number): ResponseSheet {
  const quizSectionId: SheetBlock = [];
  const codingProblemSectionId: SheetBlock = [];
  const subjectiveQuestionSectionId: SheetBlock = [];

  for (const section of spec.sections) {
    const answers: SectionAnswers = {};

    if (section.type === "quiz") {
      const ranked = [...section.questionIds].sort(
        (a, b) =>
          seededInt(`sheet:${spec.id}:${person.id}:${a}`, 0, 999) -
          seededInt(`sheet:${spec.id}:${person.id}:${b}`, 0, 999),
      );
      const correctCount = Math.round((percent / 100) * ranked.length);
      ranked.forEach((questionId, index) => {
        const question = lookupMcq(questionId);
        if (!question) return;
        const key = LETTERS.indexOf(question.correct_option);
        const pick = index < correctCount ? key : (key + 1 + (index % 3)) % 4;
        answers[String(questionId)] = LETTERS[pick].toLowerCase();
      });
      quizSectionId.push({ [String(section.id)]: answers });
    }

    if (section.type === "coding") {
      for (const problemId of section.questionIds) {
        const problem = codingById(problemId);
        const total = problem?.tests.length ?? 0;
        answers[String(problemId)] = {
          tc_passed: Math.round((percent / 100) * total),
          total_tc: total,
          best_code: problem
            ? `function ${problem.fnName}(...args) {\n  // ${person.first_name}'s submission\n}\n`
            : "",
        };
      }
      codingProblemSectionId.push({ [String(section.id)]: answers });
    }

    if (section.type === "subjective") {
      for (const questionId of section.questionIds) {
        const question = lookupWritten(questionId);
        if (!question) continue;
        answers[String(questionId)] = seededPick(`written:${spec.id}:${person.id}:${questionId}`, [
          "A left join keeps every row on the left even when the right side has no match, which matters when the absence is the finding. On a churn report an inner join quietly dropped every customer with no orders, which was exactly the group we were trying to count.",
          "I would first check whether the missing values are related to anything else in the table before deciding. If the gaps cluster in one department the missingness is itself information, and imputing a mean would erase the signal and shrink the variance at the same time.",
          "I start with the definition rather than the behaviour. A weekly number can move while a monthly one does not simply because a late-arriving batch landed inside one window and outside the other, so I check the pipeline before I go looking for a story about users.",
        ]);
      }
      subjectiveQuestionSectionId.push({ [String(section.id)]: answers });
    }
  }

  return { quizSectionId, codingProblemSectionId, subjectiveQuestionSectionId };
}

function syntheticResponses(spec: AssessmentSpec, person: DemoPerson, percent: number) {
  const scored = scoreSheet(spec, syntheticSheet(spec, person, percent));
  return {
    quiz_responses: scored.quiz,
    coding_problem_responses: scored.coding,
    subjective_responses: scored.written,
  };
}

// ── The question library and the AI helpers ─────────────────────────────────

defineRoutes(MODULE, {
  "GET /admin-dashboard/api/clients/:clientId/mcqs/": () =>
    [...LIBRARY, ...Object.values(customMcqs())].map((item) => ({
      ...item,
      tags: item.skills,
      source: MCQ_BY_ID.has(item.id) ? "Question bank" : "Authored here",
      usage_count: allAssessments().filter((a) =>
        a.sections.some((s) => s.questionIds.includes(item.id)),
      ).length,
    })),

  "GET /admin-dashboard/api/clients/:clientId/coding-problems/": () =>
    CODING_PROBLEMS.map((_, index) => {
      const problem = codingProblemApi(codingId(index));
      return {
        ...problem,
        source: "Question bank",
        usage_count: allAssessments().filter((a) =>
          a.sections.some((s) => s.questionIds.includes(problem.id)),
        ).length,
      };
    }),

  "GET /admin-dashboard/api/clients/:clientId/assessment-subjective-questions/": () =>
    [...WRITTEN_BANK, ...Object.values(customWritten())].map((w) => ({
      id: w.id,
      question_text: w.question_text,
      evaluation_prompt: w.evaluation_prompt,
      max_marks: w.max_marks,
      question_type: w.question_type,
      answer_mode: w.answer_mode,
      created_at: isoDaysAgo(30),
      topic: w.topic,
      skills: w.skills,
      tags: w.skills,
      difficulty_level: w.difficulty_level,
      source: "Question bank",
      usage_count: allAssessments().filter((a) =>
        a.sections.some((s) => s.questionIds.includes(w.id)),
      ).length,
    })),

  "POST /admin-dashboard/api/clients/:clientId/generate-mcq-questions/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const count = Math.max(1, Math.min(25, Number(body.number_of_questions) || 5));
    return {
      mcqs: generatedMcqs(String(body.topic ?? ""), count, String(body.difficulty_level ?? "")),
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/generate-coding-problems/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const raw = Array.isArray(body.raw_problems) ? body.raw_problems.length : body.raw_problem ? 1 : 0;
    const count = Math.max(1, Math.min(8, raw || Number(body.number_of_problems) || 1));
    const language = String(body.programming_language ?? "javascript");
    const problems = generatedCoding(count, language);
    return {
      message: `Generated ${problems.length} coding problem(s).`,
      topic: String(body.topic ?? "General"),
      difficulty_level: String(body.difficulty_level ?? "Medium"),
      programming_language: language,
      count: problems.length,
      coding_problem_ids: problems.map((p) => p.id),
      coding_problems: problems,
    };
  },

  /**
   * Batched generation. The caller polls until the job is terminal, so this
   * answers complete on the first read: a demo that made someone watch a
   * progress bar for six seconds to see five questions is not showing anything
   * the finished list does not.
   */
  "POST /admin-dashboard/api/clients/:clientId/question-generation/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const type = body.question_type === "coding" ? "coding" : "mcq";
    const count = Math.max(1, Math.min(25, Number(body.number_of_questions) || 5));
    const questions =
      type === "coding"
        ? generatedCoding(count, String(body.programming_language ?? "javascript"))
        : generatedMcqs(String(body.topic ?? ""), count, String(body.difficulty_level ?? ""));

    return saveGenerationJob({
      job_id: `gen-${nextDemoId("question-generation")}`,
      status: "completed",
      question_type: type,
      section_ref: typeof body.section_ref === "string" ? body.section_ref : undefined,
      assessment_id: Number(body.assessment_id) || null,
      total_items: count,
      completed_items: questions.length,
      progress_percentage: 100,
      questions: questions as unknown as Record<string, unknown>[],
      error_log: [],
    });
  },

  "GET /admin-dashboard/api/clients/:clientId/question-generation/:jobId/": (req) => {
    const job = generationJobs()[req.params.jobId];
    if (!job) throw notFound("Generation job not found");
    return job;
  },

  "GET /admin-dashboard/api/clients/:clientId/assessment-company-catalog/": () => ({
    companies: COMPANY_CATALOG,
  }),

  "POST /admin-dashboard/api/clients/:clientId/assessment-composer/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const brief = String(body.brief ?? "").trim();
    const company = typeof body.company === "string" ? body.company : undefined;
    const roundKey = typeof body.round_key === "string" ? body.round_key : undefined;
    if (!brief && !company) {
      throw badRequest({ detail: "Describe the assessment you want, or pick a company round." });
    }

    const blueprint = blueprintFor(brief, String(body.preset ?? ""), company, roundKey);
    const draftId = nextDemoId("assessment");
    // The draft exists from the first second, so "publish" at the end of the
    // review page has something real to publish and the hub shows the draft even
    // if the visitor navigates away mid-generation.
    addSpec({
      id: draftId,
      slug: `composer-draft-${draftId}`,
      title: blueprint.title,
      description: brief || blueprint.title,
      instructions: blueprint.instructions,
      durationMinutes: blueprint.duration_minutes,
      proctoringEnabled: blueprint.proctoring_enabled,
      evaluationMode: blueprint.evaluation_mode,
      allowMovement: true,
      isDraft: true,
      isActive: false,
      certificateAvailable: false,
      passLower: "40",
      passUpper: null,
      tabSwitchLimit: blueprint.proctoring_enabled ? 3 : null,
      aiGenerated: true,
      courseIds: numbers(body.attach_course_id != null ? [body.attach_course_id] : []),
      startTime: null,
      endTime: null,
      cohortSize: 0,
      sections: blueprint.sections.map((section, index) => ({
        id: draftId * 10 + index + 1,
        type: section.type === "coding" ? ("coding" as const) : ("quiz" as const),
        title: section.title,
        description: `${section.count} question(s) on ${section.topic}.`,
        order: index + 1,
        timeLimitMinutes: section.time_limit_minutes,
        questionIds:
          section.type === "coding"
            ? generatedCoding(section.count, section.programming_language ?? "javascript").map(
                (p) => p.id,
              )
            : generatedMcqs(section.topic, section.count).map((m) => m.id),
      })),
    });

    const job: ComposerJob = {
      job_id: `composer-${nextDemoId("composer")}`,
      brief: brief || blueprint.title,
      preset: String(body.preset ?? (company ? "company_prep" : "")),
      created_ms: nowMs(),
      blueprint,
      generated_assessment_id: draftId,
    };
    overlay.update<Record<string, ComposerJob>>(KEY_COMPOSER, {}, (store) => ({
      ...store,
      [job.job_id]: job,
    }));
    return composerView(job);
  },

  "GET /admin-dashboard/api/clients/:clientId/assessment-composer/:jobId/": (req) => {
    const job = composerJobs()[req.params.jobId];
    if (!job) throw notFound("Composer job not found");
    return composerView(job);
  },

  "POST /admin-dashboard/api/clients/:clientId/assessment-copy-assist/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const field = body.field === "description" ? "description" : "instructions";
    const title = String(body.title ?? "this assessment").trim() || "this assessment";
    const minutes = Number(body.duration_minutes) || 60;

    const text =
      field === "description"
        ? `${title} is a timed, fixed-form paper: every candidate sees the same questions in the ` +
          `same order. It runs for ${minutes} minutes and reports a per-section breakdown alongside ` +
          `the total, so a low score can be read as a topic to revisit rather than a verdict.`
        : `You have ${minutes} minutes. Answer every question: an unanswered question scores the ` +
          `same as a wrong one, so there is nothing to lose by attempting it. You may flag a ` +
          `question and return to it while time remains. The paper submits itself when the timer ` +
          `reaches zero, and anything you have entered by then is kept.`;

    return { text };
  },
});
