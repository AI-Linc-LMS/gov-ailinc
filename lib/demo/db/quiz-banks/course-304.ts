import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 304, RRB NTPC & Group-D: Railway Recruitment.
 *
 * Every `skill` below is a single word lifted from a topic title in course 304, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by splitting
 * its title into at most four words (capitalised ones first, stopwords dropped), and
 * `bankForTopic` matches this skill against that list case-insensitively. A skill that is not
 * among the first four concepts of some topic matches nothing and sinks to the bottom of
 * every pile.
 *
 * Skills used, module by module:
 *   1 NTPC, CBT                     5 Railways, Polity
 *   2 LCM, Percentage, Distance,    6 Training, Medical
 *     Mensuration                   7 Normalisation, Mock
 *   3 Coding, Syllogism, Direction
 *   4 Electricity, Chemistry, Biology
 *
 * This is a Beginner course, so the arithmetic is school arithmetic and the science is tenth
 * standard, but nothing here is answerable by elimination alone. The correct option is spread
 * across all four positions (A x4, B x4, C x5, D x5): an earlier draft of a sister bank keyed
 * almost everything to B, which a repeat attempter reads off the screen without knowing any
 * of the subject.
 *
 * Nothing below turns on a vacancy count, a fee, a cut-off, an exam date or a physical
 * standard. Those move with every notification, and a stale key on a government platform is
 * worse than no question at all.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 304001: the railway recruitment map ---- */
  mcq(
    304,
    1,
    "Which difference between RRB NTPC recruitment and Level 1 (Group-D) recruitment is correct?",
    [
      "Level 1 selection includes a physical efficiency test, NTPC selection does not",
      "NTPC selection includes a physical efficiency test, Level 1 selection does not",
      "Both are finally decided by a personal interview taken by the board",
      "Level 1 selection includes a typing skill test for every post",
    ],
    0,
    "Easy",
    "NTPC",
    "The physical efficiency test belongs to the Level 1 track. It is qualifying, so its result does not add to your merit position, but a candidate who does not clear it is out of the process however well he scored in the computer based test. NTPC posts instead take a second stage test and, depending on the post applied for, a typing skill test or a computer based aptitude test. The typing test is the tempting wrong answer because it is genuinely part of railway recruitment, but it attaches to the clerical NTPC posts, not to Level 1. Interviews were done away with for these non-gazetted posts, so no part of your preparation should be built around one.",
  ),
  mcq(
    304,
    2,
    "In NTPC recruitment, what does the first stage computer based test do?",
    [
      "It decides the final merit list on its own",
      "Its marks are added to the second stage marks to build the merit list",
      "It is used only to allot the examination city and the shift",
      "It screens candidates for a second stage test, and merit is built from that second stage",
    ],
    3,
    "Medium",
    "CBT",
    "The first stage is common to every NTPC post and is a screening test: it decides who is called to the second stage and nothing beyond that. The second stage is set at the level of the post you applied for, and the merit list is drawn from it together with the aptitude or typing test where the post requires one. Carrying the first stage marks forward is the tempting answer, and candidates who believe it spend weeks chasing a high screening score. Once you are through, a candidate who scraped in and a candidate who topped the screening start the second stage on exactly the same footing.",
  ),

  /* ---- Module 304002: mathematics for the CBT ---- */
  mcq(
    304,
    3,
    "What is the least number which, when divided by 5, 6 and 8, leaves a remainder of 3 in each case?",
    ["63", "120", "123", "243"],
    2,
    "Hard",
    "LCM",
    "A number that leaves the same remainder 3 with each divisor is 3 more than a common multiple of all three, so the smallest one is the LCM plus 3. The LCM of 5, 6 and 8 is 120, because 8 contributes 2 to the power 3, 6 contributes the 3, and 5 contributes itself. So the answer is 123, and you can check it: 123 is 24 fives and 3, 20 sixes and 3, and 15 eights and 3. The trap is 243, which comes from multiplying 5, 6 and 8 to get 240 and adding 3. That product double counts the factor 2 that 6 and 8 share, so it gives a number that works but is not the least. 63 fails because it satisfies 5 and 6 but not 8.",
  ),
  mcq(
    304,
    4,
    "The price of rice rises by 25 per cent. By what per cent must a household cut its consumption so that it spends exactly the same amount as before?",
    ["16 per cent", "20 per cent", "25 per cent", "30 per cent"],
    1,
    "Medium",
    "Percentage",
    "Work it with real figures. At ₹4 a kg the household buys 100 kg and spends ₹400. At ₹5 a kg the same ₹400 buys 80 kg, so consumption falls by 20 kg on 100, which is 20 per cent. Cutting by 25 per cent is the tempting answer, because a rise of 25 asks to be cancelled by a fall of 25. It is wrong because the two percentages are taken on different bases: the rise is on the old price and the fall is on the new, larger, expenditure, so a smaller percentage removes the same rupees. As a rule, a rise of r on the price needs a cut of r divided by (100 plus r), taken as a percentage.",
  ),
  mcq(
    304,
    5,
    "A train 180 m long, running at 54 km/h, crosses a platform 270 m long. How long does it take?",
    ["12 seconds", "18 seconds", "30 seconds", "42 seconds"],
    2,
    "Medium",
    "Distance",
    "Convert first: 54 km/h is 54 multiplied by 5 and divided by 18, which is 15 m/s. To cross a platform the train must clear its own length as well as the platform, so the distance is 180 plus 270, that is 450 m, and 450 divided by 15 gives 30 seconds. The tempting answer is 18 seconds, which uses only the 270 m of platform and forgets that the last coach is still on the platform when the engine leaves it. 12 seconds is the other standard slip: that is the time to pass a pole or a man, where the distance covered is just the length of the train.",
  ),
  mcq(
    304,
    6,
    "The radius of a cylindrical water tank is doubled and its height is halved. What happens to the volume it holds?",
    ["It is halved", "It stays the same", "It becomes four times", "It doubles"],
    3,
    "Hard",
    "Mensuration",
    "The volume of a cylinder is pi multiplied by the square of the radius and by the height. Doubling the radius multiplies the volume by 4, because the radius is squared, and halving the height divides it by 2, so the volume ends up twice what it was. Staying the same is the tempting answer, since one change doubles and the other halves and they look as though they cancel. They do not, because the two dimensions do not enter the formula in the same way: the radius acts through its square and the height acts directly. The same reasoning is what the paper is testing when it asks about a cone or a sphere.",
  ),

  /* ---- Module 304003: general intelligence and reasoning ---- */
  mcq(
    304,
    7,
    "In a certain code RAIL is written as SBJM. How is TRACK written in that code?",
    ["SQZBJ", "USBDL", "UTBDL", "USBDM"],
    1,
    "Easy",
    "Coding",
    "Each letter of RAIL moves one place forward in the alphabet: R to S, A to B, I to J, L to M. Applying the same step to TRACK gives U, S, B, D, L, that is USBDL. SQZBJ is the tempting wrong answer because it is the same rule applied in the wrong direction, one place backward, and a candidate who checks only that the letters have shifted by one will accept it. Always fix the direction from the given pair before you touch the answer options, and then verify at least two letters of the option you pick, since UTBDL and USBDM each go wrong at a single position.",
  ),
  mcq(
    304,
    8,
    "Statements: All trains are vehicles. Some vehicles are red. Conclusions: I. Some trains are red. II. Some vehicles are trains. Which conclusion follows?",
    ["Only conclusion I follows", "Only conclusion II follows", "Both follow", "Neither follows"],
    1,
    "Hard",
    "Syllogism",
    "Conclusion II is simply the first statement read the other way round: if every train is a vehicle, then at least some vehicles are trains, and that conversion is always valid. Conclusion I is the tempting one, because the mind places the trains inside the red part of the vehicles. Nothing in the statements says where the red vehicles sit: they could all be buses, and then no train is red. In syllogism the test is not whether the conclusion could be true but whether it must be true in every arrangement that satisfies the statements, so a mere possibility never counts as a conclusion.",
  ),
  mcq(
    304,
    9,
    "A man walks 10 m north, turns right and walks 15 m, turns right again and walks 10 m, then turns left and walks 5 m. How far is he from his starting point and in which direction?",
    [
      "20 m to the east",
      "15 m to the east",
      "20 m to the west",
      "25 m to the north",
    ],
    0,
    "Easy",
    "Direction",
    "Track the facing direction at every turn. Facing north, a right turn puts him east, so he goes 15 m east. A second right turn puts him south, so the 10 m south cancels the 10 m north he began with. Now facing south, a left turn puts him east again, so the last 5 m add to the earlier 15 m, giving 20 m east of the start and nothing left over north or south. The tempting answer is 15 m to the east, which comes from treating the final left turn as a turn back to the north, and that happens whenever a candidate stops tracking the facing direction after the second right turn. Draw the two axes on the rough sheet and mark each leg, rather than holding the turns in your head.",
  ),

  /* ---- Module 304004: general science ---- */
  mcq(
    304,
    10,
    "Why are the appliances in a house wired in parallel rather than in series?",
    [
      "Parallel wiring reduces the total current drawn from the mains",
      "Parallel wiring raises the resistance of the circuit and so protects the wiring",
      "Each appliance then gets the full supply voltage and can be switched on or off independently",
      "Appliances joined in series would each draw more current than they are rated for",
    ],
    2,
    "Easy",
    "Electricity",
    "In a parallel circuit every branch sits across the same two supply points, so each appliance receives the full mains voltage it is designed for, and opening the switch of one branch leaves the others untouched. In series the same current would pass through all of them, the voltage would divide between them, and a single failed bulb would break the circuit for the whole house. Reducing the current is the tempting answer, because parallel sounds like sharing. It is the opposite: adding branches in parallel lowers the total resistance, so the current drawn from the mains goes up, which is precisely why the house has a fuse or a miniature circuit breaker rated for that total.",
  ),
  mcq(
    304,
    11,
    "Baking soda, used to make dough rise, is which compound?",
    [
      "Sodium carbonate",
      "Calcium carbonate",
      "Sodium chloride",
      "Sodium hydrogen carbonate",
    ],
    3,
    "Easy",
    "Chemistry",
    "Baking soda is sodium hydrogen carbonate, also written as sodium bicarbonate, NaHCO3. On heating, or on meeting an acid such as curd or lemon juice, it releases carbon dioxide, and it is those bubbles trapped in the dough that make it rise. Sodium carbonate is the tempting answer because both are sodium salts of carbonic acid and their common names are close, but sodium carbonate is washing soda, a much stronger alkali used for cleaning and for softening hard water, and it is not safe to eat. Calcium carbonate is limestone and chalk, and sodium chloride is common salt.",
  ),
  mcq(
    304,
    12,
    "What does bile do in the digestion of food?",
    [
      "It breaks fat into small droplets so that the enzyme acting on fat can work faster",
      "It breaks proteins down into amino acids",
      "It converts starch into maltose",
      "It makes the contents of the stomach acidic so that bacteria are killed",
    ],
    0,
    "Medium",
    "Biology",
    "Bile is made in the liver, stored in the gall bladder and released into the small intestine. It contains no digestive enzyme at all. It does two things: it neutralises the acidic food arriving from the stomach, and its salts emulsify fat, breaking a large globule into many small droplets so that lipase has far more surface to act on. Breaking down protein is the tempting answer, because bile is called a digestive juice and candidates assume every juice carries an enzyme. Protein is handled by pepsin in the stomach and trypsin in the intestine, while the acid described in the last option is the hydrochloric acid of the stomach, not bile, which is alkaline.",
  ),

  /* ---- Module 304005: general awareness and current affairs ---- */
  mcq(
    304,
    13,
    "Which statement about the zonal structure of Indian Railways is correct?",
    [
      "A zone is headed by a General Manager and is divided into divisions, each under a Divisional Railway Manager",
      "A zone is headed by a Divisional Railway Manager and is divided into circles",
      "Each zone covers exactly one state, so a state is served by one zone alone",
      "Zones are run directly by the Railway Board, with no administrative unit below them",
    ],
    0,
    "Medium",
    "Railways",
    "Indian Railways works through zones under the Railway Board, each zone headed by a General Manager, and each zone is split into divisions under Divisional Railway Managers who run day to day operations. Matching one zone to one state is the tempting answer, and it is how most candidates first picture the map. It does not hold: South Central Railway, with its headquarters at Secunderabad, reaches well beyond Telangana, and a single state is commonly served by more than one zone. When a notification is issued it comes from a Railway Recruitment Board tied to a region, and the post you finally hold sits in a division, which is why the division and not the state is the unit to look at.",
  ),
  mcq(
    304,
    14,
    "What is the difference between a Fundamental Right and a Directive Principle of State Policy?",
    [
      "Both can be enforced in a court, but only against the union government",
      "A Directive Principle can be enforced in a court, a Fundamental Right cannot",
      "Neither can be enforced in a court, since both are statements of intent",
      "A Fundamental Right can be enforced in a court, a Directive Principle cannot",
    ],
    3,
    "Easy",
    "Polity",
    "A Fundamental Right is enforceable: a person whose right is violated can move the Supreme Court under Article 32 or a High Court under Article 226 and obtain a writ. Article 37 states in as many words that the Directive Principles are not enforceable by any court, while adding that they are fundamental in the governance of the country and that it is the duty of the state to apply them in making laws. Saying that neither is enforceable is the tempting answer, because both read like ideals in the text. The distinction is the whole point of separating Part III from Part IV: one gives a remedy in court, the other gives a direction to the legislature.",
  ),

  /* ---- Module 304006: physical efficiency and medical standards ---- */
  mcq(
    304,
    15,
    "You have eight weeks for the running event and can at present cover only about half the distance. What is the sound way to build up?",
    [
      "Run the full distance flat out every single day from the first week",
      "Do only weight training for six weeks, then start running in the last two",
      "Raise the weekly running load in small steps, about a tenth at a time, and keep rest days in the week",
      "Run the full distance once a week and do nothing on the other days",
    ],
    2,
    "Medium",
    "Training",
    "The body adapts during recovery, not during the session itself, so a plan needs a load your body can absorb and days on which it absorbs it. Raising weekly distance in small steps, of the order of a tenth, with easy days and at least one rest day, is what builds the aerobic base in eight weeks. Weight training first is the tempting answer, since the lifting and carrying events are real and strength work does help them. It fails here because strength gains do not carry over into running economy, and you would reach the last fortnight with no endurance and no time left to build it. Going flat out daily is worse than useless: shin splints and stress fractures take longer to heal than the eight weeks you have.",
  ),
  mcq(
    304,
    16,
    "Railway posts are assigned medical categories such as A, B and C. What decides the category a particular post carries?",
    [
      "The pay level attached to the post",
      "How safety critical the duties are, so posts connected with train operation and track safety carry the strictest visual standards",
      "The zone in which the vacancy is advertised",
      "The candidate's own choice, exercised at document verification",
    ],
    1,
    "Hard",
    "Medical",
    "The medical category attaches to the post, not to the person, and it follows the risk in the work. A running staff or track post depends on seeing and correctly identifying signals, so those categories test distant vision, near vision, colour perception and binocular vision to the strictest standard, and some of them require the standard to be met without glasses. A desk or clerical post carries a lighter standard, where corrected vision is generally acceptable. Pay level is the tempting answer, because candidates assume a better post must have a harder medical. It is not true in either direction, and it is a costly assumption: check the medical category printed against each post before you apply, since a category you cannot meet ends the process at the medical stage no matter what you scored in the test.",
  ),

  /* ---- Module 304007: mocks, normalisation and verification ---- */
  mcq(
    304,
    17,
    "Why are scores normalised before the merit list is drawn up?",
    [
      "To convert every candidate's marks into a percentage",
      "To give an advantage to candidates who wrote the paper in the earliest shift",
      "Because a candidate who appears in more than one shift must have the better score counted",
      "Because the test runs in several shifts with different papers, so raw marks from a harder shift must be made comparable with those from an easier one",
    ],
    3,
    "Hard",
    "Normalisation",
    "Lakhs of candidates cannot sit one paper on one day, so the test runs across shifts and each shift gets a different paper. Two papers are never of exactly equal difficulty, so a raw mark carries a different meaning in each shift, and normalisation adjusts for that using the performance of the whole shift before candidates are ranked together. This is why two candidates with the same raw score can end up at different ranks, and why a raw 70 in a hard shift can outrank a raw 72 in an easy one. Taking the better of two shifts is the tempting answer, but a candidate sits one shift only. It also follows that nothing is gained by hoping for a particular slot: you cannot know a paper's difficulty in advance, and the adjustment is what removes the advantage either way.",
  ),
  mcq(
    304,
    18,
    "A computer based test has 100 questions of 1 mark each and deducts one third of a mark for every wrong answer. A candidate attempts 90 questions and gets 60 of them right. What is the net score?",
    ["30 marks", "46.67 marks", "50 marks", "60 marks"],
    2,
    "Hard",
    "Mock",
    "Of the 90 attempted, 60 are right and 30 are wrong, so the deduction is 30 divided by 3, that is 10 marks, and the net score is 60 minus 10, which is 50. The tempting answer is 46.67, which comes from treating all 40 non-correct questions as wrong. Unattempted questions carry no penalty, which is exactly why the count of attempts is a decision and not an accident. Note also what one third negative marking does to a guess: a blind guess among four options earns 1 mark a quarter of the time and loses a third of a mark three quarters of the time, so it is worth nothing on average, while a guess made after ruling out even one option turns positive.",
  ),
];

export default BANK;
