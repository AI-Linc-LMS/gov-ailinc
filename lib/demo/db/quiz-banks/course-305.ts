/**
 * Course 305 - Telangana Police: Constable & SI (TGLPRB).
 *
 * Skills are single words lifted from the topic titles, because `conceptsFor`
 * splits a title into words and `bankForTopic` matches those against `skill`
 * case-insensitively. A multi-word skill like "Physical Efficiency Test" would
 * match no concept at all and sink the question to the bottom of every pile.
 *
 * Nothing here keys on a vacancy count, a fee, a cut-off, a qualifying time or a
 * height and chest standard: those move with every notification, and a stale
 * answer key on a physical standard is worse than no question. The stages, the
 * order they run in, what carries into merit and the arithmetic are stable.
 */

import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

const BANK: DemoMcq[] = [
  // Module 305001 - The selection process
  mcq(
    305,
    1,
    "What job does the preliminary written test do in the Constable and Sub-Inspector selection?",
    [
      "It decides the final merit list, and the later stages only confirm eligibility",
      "It is a screening test that shortlists candidates for the physical stages, and its marks are not carried into the final merit",
      "It is held only for Sub-Inspector posts, while Constable candidates go straight to the ground",
      "It is conducted after the physical events, for candidates who have already qualified on the ground",
    ],
    1,
    "Easy",
    "Preliminary",
    "The preliminary written test screens a very large applicant pool down to a number that can actually be measured and run at the ground, and merit is settled later by the final written test. The first option is the usual mistake: a candidate who scores well in the preliminary test assumes the job is nearly done, then finds that the mark is discarded once the shortlist is drawn and that the paper deciding the rank has not yet been written.",
  ),
  mcq(
    305,
    2,
    "How do the physical measurement test and the physical efficiency test differ?",
    [
      "The measurement test records height and chest against the prescribed standard, the efficiency test is the set of timed and measured events, and you must clear the measurement before you are sent to the events",
      "The measurement test is the set of timed events and the efficiency test is the medical examination",
      "Both are scored and the marks are added to your written total",
      "The events are conducted first, and only the candidates who clear them are measured",
    ],
    0,
    "Easy",
    "Measurement",
    "Measurement is a pass or fail check of body measurements against the standard prescribed for that post and category, and only the candidates who meet it are called for the events. The third option is the tempting one, because running and jumping feel like they ought to earn marks; the physical stages are qualifying in nature, and it is the final written test that produces the ranking.",
  ),
  mcq(
    305,
    3,
    "What is the real structural difference between the Constable track and the Sub-Inspector track?",
    [
      "The Constable track has no physical stage",
      "The Sub-Inspector track is open to graduates and its final written examination carries more papers, including a separate English paper, while the Constable track opens at intermediate level with a shorter final written",
      "Constable posts have no written examination and are filled from the ground alone",
      "Only the Sub-Inspector track sits a preliminary written test",
    ],
    1,
    "Medium",
    "Sub-Inspector",
    "The educational qualification is the first fork, intermediate for Constable and a degree for Sub-Inspector, and the Sub-Inspector final written stage is the longer one, with an English paper of its own. The last option is the common confusion: both tracks sit a preliminary written test, and it is the final written stage, not the preliminary one, whose length differs between them.",
  ),

  // Module 305002 - Arithmetic
  mcq(
    305,
    4,
    "The average age of 11 players in a squad is 24 years. The coach joins them and the average becomes 25 years. How old is the coach?",
    ["34 years", "35 years", "36 years", "48 years"],
    2,
    "Medium",
    "Averages",
    "The total for 11 players is 11 x 24 = 264. For 12 people at an average of 25 the total is 300, so the coach is 300 - 264 = 36. The tempting 35 comes from adding the 11 old members to the old average of 24. The correct shortcut is the new average plus the old strength times the rise in average, that is 25 + (11 x 1) = 36, because the coach has to supply the extra year for every existing member as well as his own age.",
  ),
  mcq(
    305,
    5,
    "A sum of ₹8,000 is lent for 2 years at 10 percent per annum. By how much does the compound interest, compounded annually, exceed the simple interest?",
    ["₹80", "₹160", "₹800", "₹1,680"],
    0,
    "Hard",
    "Interest",
    "Over two years the whole gap is the interest earned on the first year's interest: 10 percent of ₹800 is ₹80. The same result falls out of P x (r/100) squared, that is 8,000 x (1/10) x (1/10) = ₹80. Check it the long way: simple interest is ₹1,600 and compound interest is ₹1,680. The tempting ₹160 comes from taking 10 percent of the entire ₹1,600 of simple interest, but only the first year's ₹800 sits in the account long enough to earn for a second year.",
  ),
  mcq(
    305,
    6,
    "A constable walks his beat at 6 km/h and returns along the same route at 4 km/h. What is his average speed for the whole trip?",
    ["4.5 km/h", "4.8 km/h", "5 km/h", "5.2 km/h"],
    1,
    "Medium",
    "Speed",
    "The two legs are equal in distance but not in time, so the speeds cannot simply be averaged. For a one way distance d the time is d/6 + d/4 = 5d/12 for a total distance of 2d, giving 2d divided by 5d/12 = 24/5 = 4.8 km/h. The tempting 5 km/h is the plain mean of 6 and 4, which would be right only if he had spent equal time at each speed rather than covering equal distance. The slower leg always takes longer, so the average sits below the midpoint.",
  ),
  mcq(
    305,
    7,
    "A table shows candidates who appeared from four districts: Warangal 1,200, Karimnagar 900, Khammam 800 and Nizamabad 1,100. If 15 percent of the Warangal candidates and 20 percent of the Nizamabad candidates qualified, how many qualified from these two districts together?",
    ["345", "400", "405", "460"],
    1,
    "Hard",
    "Data",
    "15 percent of 1,200 is 180 and 20 percent of 1,100 is 220, so 400 in all. The tempting 405 comes from attaching each rate to the wrong district: 20 percent of 1,200 is 240 and 15 percent of 1,100 is 165. The other two options apply a single rate to the combined 2,300, which the table does not license, since 15 percent of 2,300 is 345 and 20 percent of 2,300 is 460. In a data interpretation set, read the row label before the number, every time.",
  ),

  // Module 305003 - Reasoning and mental ability
  mcq(
    305,
    8,
    "What comes next in the series 3, 6, 11, 18, 27, ...?",
    ["36", "38", "39", "42"],
    1,
    "Easy",
    "Series",
    "The gaps are 3, 5, 7 and 9, which are consecutive odd numbers, so the next gap is 11 and the term is 27 + 11 = 38. The tempting 36 comes from repeating the last gap of 9, which ignores that the gap itself grows by 2 each step. Whenever the first differences are not constant, take the second differences before guessing.",
  ),
  mcq(
    305,
    9,
    "In a certain code POLICE is written as QPMJDF. How is STATION written in the same code?",
    ["TUBUJPO", "TUBUJPN", "RSZSHNM", "TUBTJPO"],
    0,
    "Medium",
    "Coding",
    "Each letter moves one step forward: P to Q, O to P, L to M, I to J, C to D, E to F. Applying the same step to STATION gives T, U, B, U, J, P, O, that is TUBUJPO. RSZSHNM is the tempting answer, and it is the same rule applied backwards; fix the direction on a letter pair you can see, such as C to D, before you encode the answer word, because a reversed shift produces an equally neat looking string.",
  ),
  mcq(
    305,
    10,
    "Five candidates P, Q, R, S and T sit in a row. Counting from the left: S is at the extreme right end, P is third from the left, Q sits immediately to the left of P, and T does not sit at either end. Who sits at the extreme left?",
    ["P", "Q", "R", "T"],
    2,
    "Hard",
    "Seating",
    "S takes seat 5 and P takes seat 3, so Q, who is immediately to P's left, takes seat 2. Seats 1 and 4 are left for R and T, and since T cannot sit at an end, T takes seat 4 and R takes seat 1. The order is R, Q, P, T, S. The tempting answer is Q, from reading immediately to the left of P as the far left of the row instead of the seat next to P; in this family of questions, immediately always means adjacent.",
  ),

  // Module 305004 - General studies and Telangana
  mcq(
    305,
    11,
    "Under Article 22 of the Constitution, within what period must an arrested person be produced before the nearest magistrate, leaving aside the time needed for the journey?",
    ["12 hours", "24 hours", "48 hours", "72 hours"],
    1,
    "Medium",
    "Polity",
    "Article 22(2) requires production before the nearest magistrate within 24 hours of the arrest, excluding the time taken to travel from the place of arrest to the court, and detention beyond that without the magistrate's authority is illegal. The tempting 48 hours comes from confusing this limit with the longer periods a magistrate may afterwards authorise for remand; the initial production deadline itself does not stretch, and an officer who misses it is the one answering for it.",
  ),
  mcq(
    305,
    12,
    "The Telangana armed peasant struggle of 1946 to 1951 was fought mainly against which system?",
    [
      "The British land revenue administration of the Madras Presidency",
      "The jagirdari and deshmukh landholding system in the Nizam's dominion of Hyderabad",
      "The permanent settlement introduced in Bengal",
      "The ryotwari settlement of the Bombay Presidency",
    ],
    1,
    "Medium",
    "Telangana",
    "The struggle was waged inside the princely state of Hyderabad against the Nizam's administration and the jagirdars and deshmukhs who held the land, and above all against vetti, the unpaid forced labour they extracted. The first option is the tempting one, because most peasant movements of that decade were directed at British revenue policy, but Telangana was never British territory, so the revenue system of the Madras Presidency simply did not run there.",
  ),
  mcq(
    305,
    13,
    "Which statement places the two major river basins of Telangana correctly?",
    [
      "The Godavari drains the northern part of the state and the Krishna the southern part",
      "The Krishna drains the north and the Godavari the south",
      "The Tungabhadra drains the north and the Godavari the south",
      "The Manjeera drains the north and the Krishna the south, the Godavari not entering the state at all",
    ],
    0,
    "Easy",
    "Geography",
    "The Godavari enters Telangana in the north and its basin covers the northern districts, while the Krishna runs across the south of the state. The fourth option is the tempting one because the Manjeera is genuinely important, being a source of drinking water for Hyderabad, but it is a tributary of the Godavari rather than a basin of its own, and the Godavari certainly does cross the state.",
  ),

  // Module 305005 - English for the final written
  mcq(
    305,
    14,
    "Fill in the blank: Neither the constables nor the head constable ____ present at the checkpost.",
    ["were", "was", "have been", "are"],
    1,
    "Medium",
    "Grammar",
    "With neither ... nor, the verb agrees with the subject nearer to it, and here that subject is the singular head constable, so was is correct. Were is tempting because the sentence names more than one person, but the rule of proximity looks only at the second subject. Reverse the order to Neither the head constable nor the constables, and were becomes the right choice for exactly the same reason.",
  ),
  mcq(
    305,
    15,
    "Choose the best improvement for the underlined part: The suspect was absconding since three days when the police traced him.",
    [
      "was absconding from three days",
      "had been absconding for three days",
      "has been absconding since three days",
      "is absconding for three days",
    ],
    1,
    "Hard",
    "Sentence",
    "The absconding began earlier and continued up to a point in the past, which is exactly what the past perfect continuous marks, and a stretch of time takes for while a starting point takes since. The third option is the tempting one because has been is the tense candidates associate with since, but the present perfect continuous ties the action to now, and this sentence is anchored to a past moment by when the police traced him.",
  ),

  // Module 305006 - Physical efficiency
  mcq(
    305,
    16,
    "In the long jump at a physical efficiency test, what most commonly makes an attempt a foul?",
    [
      "The take-off foot touches or crosses the front edge of the take-off board or line",
      "The candidate lands on both feet in the pit",
      "The run-up is shorter than the marked approach",
      "The candidate takes off from the weaker leg",
    ],
    0,
    "Easy",
    "Events",
    "The jump is measured from the take-off line, so any part of the foot on or beyond that line makes the attempt a foul however far the candidate lands. Landing on both feet is the normal landing and costs nothing, which is why it is the usual wrong answer. What does cost distance is stepping or falling backwards in the pit, because the measurement runs to the nearest mark made by any part of the body.",
  ),
  mcq(
    305,
    17,
    "You are eight weeks from the physical efficiency test and decide to raise your weekly running distance by half in a single week to catch up. What is the most likely result?",
    [
      "A jump in endurance that holds for the rest of the plan",
      "A shin or knee overuse injury, which costs more training weeks than the extra load buys",
      "No change, because endurance is decided only by the last fortnight before the test",
      "A permanent fall in resting heart rate within the same week",
    ],
    1,
    "Medium",
    "Recovery",
    "Muscle adapts to a rise in load faster than bone and tendon do, so a sudden increase in weekly distance is the classic cause of shin splints and knee pain, and a fortnight lost to that injury sets you further back than the extra week gained. The first option is tempting because the hard week genuinely feels productive at the time; endurance is built by weeks you can repeat, which is why a sound plan adds load in small steps and keeps an easy week in it.",
  ),

  // Module 305007 - Mocks and the last month
  mcq(
    305,
    18,
    "In a mock paper each correct answer earns 1 mark and each wrong answer loses a quarter mark. You attempt 90 questions and score 55. How many did you answer correctly?",
    ["55", "58", "62", "66"],
    2,
    "Hard",
    "Mock",
    "If r answers are right then 90 - r are wrong, so r - 0.25(90 - r) = 55, which gives 1.25r = 77.5 and r = 62, with 28 wrong. Check it back: 62 - 7 = 55. The tempting 55 reads the score as the count of correct answers and quietly ignores the 7 marks the wrong ones took away. That is the same slip that makes a candidate rate a mock better than it was, and it hides the real finding here, which is that 28 wrong attempts is an accuracy problem rather than a coverage problem.",
  ),
];

export default BANK;
