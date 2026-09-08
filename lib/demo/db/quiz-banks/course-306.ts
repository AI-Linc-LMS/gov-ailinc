import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 306, PSU Recruitment through GATE.
 *
 * Skills are single words lifted from the topic titles, because `conceptsFor`
 * derives a topic's concepts by splitting its title into words and `bankForTopic`
 * matches the skill against those concepts case-insensitively. A multi-word skill
 * such as "Engineering Mathematics" would match nothing and sink the question.
 *
 * Coverage runs module by module: score and normalisation (306001), engineering
 * mathematics (306002), general aptitude (306003), the four core branches
 * (306004), solving the paper (306005), previous papers (306006) and the
 * selection stages after the score (306007).
 */
const BANK: DemoMcq[] = [
  /* ---- Module 306001: how an undertaking uses a GATE score ---- */
  mcq(
    306,
    1,
    "Suppose one candidate scored 62 marks out of 100 and a GATE score of 780, and another scored 58 marks and a GATE score of 812 in a different year. An undertaking that accepts more than one GATE year shortlists on which number, and why?",
    [
      "Marks, because they are the raw performance in the paper",
      "The GATE score, because marks are mapped on to fixed reference points on a common scale, so a score means the same standard from one year to the next",
      "Whichever of the two is higher for the candidate, since both are printed on the scorecard",
      "The All India Rank, because it already orders every candidate",
    ],
    1,
    "Medium",
    "Score",
    "Raw marks are not comparable across papers or years: 62 in a hard paper and 62 in an easy one are different achievements, which is precisely why marks are converted into a score. The score is produced by mapping the qualifying mark and the performance of the top candidates on to fixed points of a common scale, so scores from two years can sit in the same shortlist. Rank is the tempting answer because it sounds like a ranking already, but a rank is specific to one paper in one year and says nothing about the standard reached, so two ranks from different years cannot be compared at all.",
  ),
  mcq(
    306,
    2,
    "A GATE paper is held in two sessions with different question sets, and the marks are normalised before the score is worked out. What problem is normalisation there to solve?",
    [
      "Candidates in the two sessions did not face papers of identical difficulty, so raw marks from the two sets are not directly comparable",
      "Candidates attempt different numbers of questions, so totals have to be scaled to the number attempted",
      "Negative marking bites unevenly across sessions, so the deducted marks have to be added back",
      "The two sessions had different numbers of candidates, so marks are weighted by session size",
    ],
    0,
    "Easy",
    "Normalisation",
    "Two different question sets can never be made exactly equal in difficulty, so a mark earned in the harder session represents more than the same mark in the easier one. Normalisation estimates that gap from how each session performed as a whole and shifts the raw marks on to a common scale before the score is computed. Option D is the closest trap: session statistics are indeed used inside the calculation, but the size of a session is not the thing being corrected, and a bigger session does not deserve higher or lower marks. A paper held in a single session has nothing to normalise against and is not normalised.",
  ),

  /* ---- Module 306002: engineering mathematics ---- */
  mcq(
    306,
    3,
    "A 2 x 2 matrix A has first row 4, 1 and second row 2, 3. What are its eigenvalues?",
    ["4 and 3", "7 and 10", "5 and 2", "6 and 1"],
    2,
    "Medium",
    "Eigenvalues",
    "For a 2 x 2 matrix the characteristic equation is lambda squared minus (trace) lambda plus (determinant) equals zero. Here the trace is 4 + 3 = 7 and the determinant is 4(3) - 1(2) = 10, so the equation is lambda squared - 7 lambda + 10 = 0 and the roots are 5 and 2. Option A is the standing trap: the diagonal entries are the eigenvalues only for a diagonal or triangular matrix, and this one has non-zero entries on both sides of the diagonal. Check any answer against the two invariants, since 5 + 2 = 7 matches the trace and 5 x 2 = 10 matches the determinant, which is why 6 and 1 fails on the product.",
  ),
  mcq(
    306,
    4,
    "What is the general solution of the differential equation y'' - 5y' + 6y = 0?",
    [
      "C1 e^(-2x) + C2 e^(-3x)",
      "(C1 + C2 x) e^(5x)",
      "e^(2x) (C1 cos 3x + C2 sin 3x)",
      "C1 e^(2x) + C2 e^(3x)",
    ],
    3,
    "Easy",
    "Differential",
    "Substituting y = e^(mx) gives the auxiliary equation m squared - 5m + 6 = 0, whose roots are m = 2 and m = 3, so the solution is C1 e^(2x) + C2 e^(3x). Option A is the usual sign slip: the roots are used exactly as they come out, and roots of -2 and -3 would belong to y'' + 5y' + 6y = 0 instead. Option B is the form for a repeated root and option C the form for a complex conjugate pair, neither of which arises here because the discriminant 25 - 24 is positive and the roots are real and distinct.",
  ),
  mcq(
    306,
    5,
    "A bin holds 20 castings, of which 4 are defective. Two castings are drawn one after the other without replacement. What is the probability that both are defective?",
    ["3/95", "1/25", "4/95", "1/20"],
    0,
    "Medium",
    "Probability",
    "The first casting is defective with probability 4/20. Once it is removed, 3 defectives remain among 19 castings, so the second is defective with probability 3/19. Multiplying gives 12/380, which reduces to 3/95, roughly 0.032. Option B, 1/25, is what you get from (4/20) x (4/20), that is by treating the two draws as independent. They are not: drawing without replacement changes both the numerator and the denominator for the second draw, and reading the phrase without replacement in the stem is the whole question.",
  ),
  mcq(
    306,
    6,
    "The Newton-Raphson method is used on f(x) = x^3 - 2x - 5 starting from x0 = 2. What is x1, the estimate after one iteration?",
    ["1.9", "2.2", "2.5", "2.1"],
    3,
    "Hard",
    "Numerical",
    "The iteration is x1 = x0 - f(x0)/f'(x0). Here f(2) = 8 - 4 - 5 = -1 and f'(x) = 3x squared - 2, so f'(2) = 10, giving x1 = 2 - (-1/10) = 2.1. Option A, 1.9, is the sign error that catches most candidates: f(2) is negative, so subtracting a negative quantity moves the estimate up, not down. There is a fast sanity check available, since f(2) is negative and f(3) is positive, the root lies between 2 and 3, so any first estimate below 2 is going the wrong way.",
  ),

  /* ---- Module 306003: general aptitude ---- */
  mcq(
    306,
    7,
    "One pump fills a tank in 6 hours and a second pump fills the same tank in 3 hours. Working together on an empty tank, how long do they take?",
    ["1.5 hours", "4.5 hours", "2 hours", "2.5 hours"],
    2,
    "Easy",
    "Quantitative",
    "Add rates, never times. The first pump does 1/6 of the tank an hour and the second 1/3, so together they do 1/6 + 1/3 = 1/2 of the tank an hour and the tank is full in 2 hours. Option B, 4.5 hours, is the average of 6 and 3, and it is the commonest error in this pattern. It also fails an inspection you can run before any arithmetic: two pumps together must be quicker than the faster pump working alone, so any answer of 3 hours or more is wrong on its face.",
  ),
  mcq(
    306,
    8,
    "Statement: every candidate who cleared the technical interview had solved at least one previous year paper in full. Which conclusion follows strictly from this statement alone?",
    [
      "A candidate who solved no previous year paper in full did not clear the technical interview",
      "A candidate who solved a previous year paper in full cleared the technical interview",
      "Solving previous year papers is what caused those candidates to clear the interview",
      "Most candidates who cleared the interview had solved several previous year papers",
    ],
    0,
    "Hard",
    "Verbal",
    "A statement of the form all A are B licenses exactly one further statement, its contrapositive: anything that is not B is not A. Since everyone who cleared had solved at least one paper in full, someone who solved none cannot be among those who cleared, which is option A. Option B is the converse and is the answer most candidates pick: the statement makes solving a paper necessary among those who cleared, not sufficient to clear. Option C converts an association into a cause, and option D quietly upgrades at least one to several, a quantity the statement never supplies.",
  ),
  mcq(
    306,
    9,
    "A recruitment report covers 1,200 applications across four trainee disciplines: mechanical 30 per cent, electrical 25 per cent, civil 20 per cent and electronics the remainder. If 40 per cent of the mechanical applicants and 60 per cent of the electronics applicants are women, how many more women applied for electronics than for mechanical?",
    ["36", "96", "180", "216"],
    0,
    "Hard",
    "Data",
    "Mechanical is 30 per cent of 1,200, that is 360, and 40 per cent of 360 is 144 women. Mechanical, electrical and civil together account for 75 per cent, so electronics is the remaining 25 per cent, that is 300, and 60 per cent of 300 is 180 women. The difference is 180 - 144 = 36. Option B, 96, comes from swapping the two percentages and computing 216 - 120, which is the slip this question is built around: in a set based data question, fix which figure attaches to which row before you multiply anything. Option C, 180, is the electronics count on its own, not the difference asked for.",
  ),

  /* ---- Module 306004: core subject strategy by branch ---- */
  mcq(
    306,
    10,
    "A Carnot engine works between reservoirs at 900 K and 300 K and draws 600 kJ of heat from the hot reservoir. What are its efficiency and the work it delivers?",
    [
      "33.3 per cent and 200 kJ",
      "66.7 per cent and 400 kJ",
      "66.7 per cent and 600 kJ",
      "75 per cent and 450 kJ",
    ],
    1,
    "Medium",
    "Thermodynamics",
    "Carnot efficiency is 1 minus the ratio of the absolute temperatures, that is 1 - 300/900 = 2/3, or 66.7 per cent. Work is efficiency times the heat supplied, 2/3 of 600 kJ = 400 kJ, and the remaining 200 kJ leaves as heat rejected to the cold reservoir. Option A is the standard inversion: 300/900 is the fraction of heat rejected, not the efficiency, so it answers the opposite question. Option C has the efficiency right but then converts all the heat drawn into work, which no heat engine can do, and that contradiction is enough to reject it without any calculation.",
  ),
  mcq(
    306,
    11,
    "A balanced three-phase load draws 100 A at a line voltage of 400 V with a power factor of 0.8 lagging. What is the active power drawn?",
    ["32 kW", "40 kW", "55.4 kW", "69.3 kW"],
    2,
    "Hard",
    "Power",
    "For a balanced three-phase load the active power is root 3 times line voltage times line current times the power factor, that is 1.732 x 400 x 100 x 0.8, which is about 55.4 kW. Option D, 69.3 kW, is root 3 x 400 x 100 with the power factor dropped, and that quantity is the apparent power in kVA, not power in kW. Option A drops the root 3 instead and computes a single-phase style product, which is the single commonest three-phase slip. Keep the three quantities separate in your head: apparent power in kVA, active power in kW, and the power factor as the link between them.",
  ),
  mcq(
    306,
    12,
    "A simply supported beam of span L carries a uniformly distributed load w per unit length over its whole span. Where is the bending moment largest, and what is its value there?",
    [
      "At the supports, wL²/2",
      "At mid-span, wL²/4",
      "At the supports, wL²/8",
      "At mid-span, wL²/8",
    ],
    3,
    "Easy",
    "Structures",
    "For a simply supported beam under a uniformly distributed load the bending moment diagram is a parabola that is zero at both supports and peaks at mid-span with the value wL²/8. Option A belongs to a different structure: wL²/2 is the moment at the built-in end of a cantilever of length L carrying the same load. The support condition rules out both options that place the maximum at the supports, because a simply supported end is a pin or a roller and carries no moment at all, so the moment there must be zero by definition.",
  ),
  mcq(
    306,
    13,
    "How many flip-flops does a synchronous decade counter need, that is a counter that runs 0 to 9 and repeats?",
    ["3", "5", "4", "10"],
    2,
    "Easy",
    "Digital",
    "n flip-flops give 2 to the power n distinct states, and a decade counter has to hold 10 states, so you need the smallest n with 2 to the power n at least 10. That is n = 4, giving 16 states of which 6 are unused and must be decoded away or reset. Option A, 3, gives only 8 states and cannot represent a count of 8 or 9 at all. Option D confuses states with devices: a ring counter does use one flip-flop per state and would take 10, but it is a different design and is not what a decade counter means here.",
  ),

  /* ---- Module 306005: solving the paper ---- */
  mcq(
    306,
    14,
    "GATE sets three question types: multiple choice, multiple select and numerical answer type. Which statement about their marking is correct?",
    [
      "Multiple choice and multiple select both carry a negative mark, numerical answer type does not",
      "All three carry a negative mark, in proportion to the marks of the question",
      "None of the three carries a negative mark, so every question should be guessed if unsolved",
      "Only multiple choice carries a negative mark; multiple select and numerical answer type do not, and multiple select gives no partial credit either",
    ],
    3,
    "Medium",
    "MSQ",
    "Only multiple choice questions carry a deduction for a wrong answer, a stated fraction of the marks of that question. Multiple select and numerical answer type carry no deduction, but multiple select is all or nothing: you must mark every correct option and no incorrect one, or the question scores zero. Option A is the tempting one because a multiple select question feels like a harder multiple choice, yet its penalty is the absence of partial credit, not a deduction. The consequence for the exam is direct: a blank multiple select or numerical question scores the same as a wrong one, so it should never be left blank, while a pure guess on a multiple choice question has a negative expected value. Confirm the scheme on the instruction page of the paper you actually sit.",
  ),
  mcq(
    306,
    15,
    "The exam supplies an on-screen virtual scientific calculator. What does that imply for how you should work during the paper?",
    [
      "You may bring your own scientific calculator as a backup in case the on-screen one is slow",
      "Every step should be typed into the calculator, since a machine is faster than working on paper",
      "Long expressions should be simplified on the rough sheet first, because each entry costs a mouse click and a mis-click is hard to trace",
      "Intermediate values need not be written down, because the calculator memory holds them for you",
    ],
    2,
    "Easy",
    "Calculator",
    "The virtual calculator is driven by the mouse, so an expression typed in at full length costs far more time than the same expression reduced on paper first, and a wrong click cannot be inspected the way an entry on a physical calculator can. Option A is wrong on the rules, since no personal calculator and no phone is permitted in the hall. Option D is the practical trap: the memory keys do exist, but relying on them means one wrong recall corrupts an answer with nothing written down to check it against, which is exactly the failure an error log later cannot explain.",
  ),

  /* ---- Module 306006: previous papers and revision ---- */
  mcq(
    306,
    16,
    "You have ten years of previous papers in your branch. Which use of them adds the most to your score?",
    [
      "Memorising the answers, since questions are known to repeat word for word",
      "Counting the marks by subject and then studying only the two heaviest subjects",
      "Timing yourself on each paper and treating your fastest attempt as the target",
      "Grouping the questions by the concept each one tests, so the ideas examined nearly every year become visible",
    ],
    3,
    "Medium",
    "Papers",
    "Papers repeat ideas, not questions. Sorting a decade of questions by the concept behind each one shows which ideas are set almost every year, and those are the ones worth being fluent in rather than merely familiar with. Option B is the near miss and the one that costs marks: weightage is a fair guide to how much revision time a subject deserves, but abandoning the lighter subjects leaves you unable to take the easy questions in them, and weightage itself moves from year to year. Option A misreads what repeats, since the underlying concept returns while the exact question rarely does.",
  ),

  /* ---- Module 306007: selection after the score ---- */
  mcq(
    306,
    17,
    "In a group discussion for a trainee post, a candidate speaks first, speaks at length and repeats the same point twice. What is the most likely effect on the assessment?",
    [
      "It helps, because initiative and total speaking time are what a group discussion measures",
      "It hurts on both content and group behaviour, because the panel marks the quality of what is added and how the candidate lets the discussion move",
      "It has no effect, since marks depend only on the consensus the group finally reaches",
      "It helps, provided the candidate also summarises the discussion at the end",
    ],
    1,
    "Hard",
    "Discussion",
    "A group discussion is assessed on two axes at once: the substance a candidate adds, meaning a clear point supported by a reason or an example, and how they behave in a group, meaning listening, building on others and bringing in a silent member. Speaking first is worth a little only if the opening frames the topic; repeating one point at length consumes the group's time without adding substance and reads as dominance. Option A is what most candidates believe, and it is why so many discussions turn into a contest of volume: speaking time is a means to be assessed, not the thing assessed. Option C is wrong because most panels do not require the group to agree at all and mark each candidate individually.",
  ),
  mcq(
    306,
    18,
    "An offer of appointment as a trainee is subject to a service agreement, commonly called a bond. What does signing it commit the candidate to?",
    [
      "Serving for a minimum period after training, with a stated sum becoming payable to the employer if the candidate leaves before it ends",
      "Repaying the whole salary drawn during training if the candidate resigns at any point in their career",
      "Accepting any posting for life, because the agreement replaces the terms of appointment",
      "Forfeiting the GATE score if the candidate does not join after being selected",
    ],
    0,
    "Hard",
    "Training",
    "A service agreement fixes a minimum period of service counted from the end of training and names a sum recoverable if the candidate leaves inside that period, usually backed by a surety. The sum is a liquidated amount written into the agreement, not the salary drawn: option B is what candidates assume and it is exactly why the clause has to be read, since both the period and the amount differ between undertakings and are stated in the advertisement. Option C is wrong because posting and transfer are governed by the appointment letter and the service rules, not by the bond, and option D confuses a contract between two parties with the examination, which is not a party to it and holds no such power.",
  ),
];

export default BANK;
