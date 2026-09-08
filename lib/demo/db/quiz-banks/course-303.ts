import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 303, SSC CGL & CHSL: Tier-I and Tier-II.
 *
 * Skills are single words taken from the topic titles, because `conceptsFor` in
 * lib/demo/http/handlers/adaptive-courses.ts derives a topic's concepts by splitting its
 * title, and `bankForTopic` matches a question's skill against that set exactly. A skill
 * of "Alligation" lands on the mixture topic; a skill of "Mixture and alligation" lands
 * nowhere and sinks the question to the bottom of every pile.
 *
 * Structure, method and arithmetic only. No vacancy count, fee, cut-off or exam date is
 * ever the subject of a question here, because those move with every notification and a
 * stale answer key is worse than no question.
 */
const BANK: DemoMcq[] = [
  // Module 303001 - The SSC map
  mcq(
    303,
    1,
    "What separates SSC CGL from SSC CHSL?",
    [
      "CGL is conducted by the Commission while CHSL is conducted separately by each state government",
      "CHSL carries an interview stage while CGL is decided entirely on written marks",
      "CGL is a graduate level examination filling mainly Group B and Group C posts, while CHSL is a 12th standard level examination filling clerical and data entry posts",
      "CGL is open only to candidates from a commerce or economics background, while CHSL is open to all streams",
    ],
    2,
    "Easy",
    "CGL",
    "The two examinations are separated by educational level, and that in turn decides the grade of post each one leads to. CGL asks for a bachelor's degree in any discipline and fills posts such as Assistant Section Officer, Inspector and Auditor; CHSL asks for a 12th standard pass and fills Lower Division Clerk, Junior Secretariat Assistant and Data Entry Operator posts. Option B is the tempting wrong answer because candidates remember that SSC once held interviews, but the interview stage was withdrawn from Group B non-gazetted and Group C recruitment, so neither examination is settled by a personality test.",
  ),
  mcq(
    303,
    2,
    "How is the time limit applied across the four sections of the Tier-I paper?",
    [
      "A separate sectional time limit for each of the four sections, enforced by the software",
      "One composite limit for the whole paper, so you may move between the four sections in any order",
      "A composite limit, but the sections open one after another and you cannot return to an earlier one",
      "A separate limit for the two mathematical sections and a composite limit for the other two",
    ],
    1,
    "Medium",
    "Tier-I",
    "Tier-I runs on a single composite clock. Every question of every section is available from the first minute, and the software lets you jump between sections and back again as often as you like. Option A is the trap for candidates preparing for banking papers at the same time, because IBPS and SBI prelims do enforce sectional timing and the rule gets carried across. The consequence is practical: since attempt order is yours to choose, you can clear the recall based section early and spend what you save on quantitative aptitude.",
  ),

  // Module 303002 - Quantitative aptitude: the arithmetic core
  mcq(
    303,
    3,
    "A shopkeeper marks his goods 40 per cent above cost price and then allows a discount of 25 per cent on the marked price. What is his profit or loss per cent?",
    [
      "Profit of 15 per cent",
      "Profit of 5 per cent",
      "Loss of 5 per cent",
      "Profit of 10 per cent",
    ],
    1,
    "Easy",
    "Discount",
    "Take the cost price as ₹100. The marked price is ₹140, the discount is 25 per cent of 140 which is ₹35, so the selling price is ₹105 and the profit is 5 per cent. Option A is the trap: 40 minus 25 looks like 15, but the mark-up is a percentage of the cost price and the discount is a percentage of the marked price, so the two are taken on different bases and cannot be subtracted. Whenever the bases differ, put ₹100 at the base and walk the numbers through.",
  ),
  mcq(
    303,
    4,
    "Milk costing ₹60 a litre is mixed with milk costing ₹40 a litre so that the mixture works out to ₹45 a litre. In what ratio are the two mixed?",
    ["3 : 1", "1 : 3", "1 : 2", "2 : 3"],
    1,
    "Medium",
    "Alligation",
    "By alligation the quantities stand in the ratio of the opposite differences. The dearer milk gets 45 minus 40, which is 5, and the cheaper milk gets 60 minus 45, which is 15, so dearer to cheaper is 5 : 15, that is 1 : 3. Check it: one litre at ₹60 with three litres at ₹40 costs ₹180 for four litres, which is ₹45 a litre. Option A is the standard slip, keeping each difference on its own side instead of crossing it, and three litres at ₹60 with one at ₹40 would give a mixture at ₹55 a litre rather than ₹45.",
  ),
  mcq(
    303,
    5,
    "The difference between the compound interest and the simple interest on a certain sum for two years at 10 per cent per annum is ₹120. What is the sum?",
    ["₹1,200", "₹6,000", "₹12,000", "₹24,000"],
    2,
    "Hard",
    "Compound",
    "Over two years the whole difference between compound and simple interest is the second year's interest on the first year's interest, which comes to P multiplied by (r/100) squared. Here that is P divided by 100, so P is ₹12,000. Verify it: simple interest is ₹2,400, compound interest is ₹2,520, and the gap is ₹120. Option A is what you reach by dividing 120 by the rate once instead of squaring the rate, and it is the answer most candidates arrive at when they try to do this one mentally.",
  ),

  // Module 303003 - Advanced maths for Tier-II
  mcq(
    303,
    6,
    "If x + 1/x = 3, what is the value of x³ + 1/x³?",
    ["27", "21", "9", "18"],
    3,
    "Medium",
    "Algebra",
    "Cube both sides. (x + 1/x)³ equals x³ + 1/x³ plus 3 times x times 1/x times (x + 1/x), and since x times 1/x is 1, that middle term is just 3 times (x + 1/x), which is 9. So 27 equals x³ + 1/x³ plus 9, giving 18. Option A is what you get by cubing only the left side and dropping the cross term, which is the commonest error in this identity. Learn it as a subtraction, x³ + 1/x³ = a³ minus 3a where a is x + 1/x, and the cross term can no longer be forgotten.",
  ),
  mcq(
    303,
    7,
    "Two chords AB and CD of a circle cut each other at a point P inside the circle. If AP is 6 cm, PB is 4 cm and CP is 3 cm, how long is PD?",
    ["8 cm", "2 cm", "4.5 cm", "12 cm"],
    0,
    "Hard",
    "Circles",
    "By the intersecting chords theorem the products of the two parts of each chord are equal, so AP times PB equals CP times PD. That is 24 equal to 3 times PD, giving PD as 8 cm. Option B is the well laid trap: it comes from pairing the similar triangles the wrong way round. Triangles APC and DPB are similar with AP matching DP and CP matching BP, so AP times BP equals CP times DP; matching AP with CP instead gives 4 times 3 divided by 6, which is 2 cm, and looks perfectly reasonable on the page.",
  ),
  mcq(
    303,
    8,
    "From a point on level ground the angle of elevation of the top of a tower is 30 degrees. After walking 40 m straight towards the tower the angle becomes 60 degrees. How tall is the tower?",
    ["40√3 m", "20 m", "20√3 m", "40 m"],
    2,
    "Hard",
    "Heights",
    "Let the height be h. From the far point the distance to the foot of the tower is h divided by tan 30, that is h√3; from the near point it is h divided by tan 60, that is h divided by √3. The 40 m walked is the difference between the two, so h√3 minus h/√3 equals 40, which reduces to 2h/√3 equals 40 and h equals 20√3, roughly 34.6 m. Option A is what you get by adding the two distances instead of subtracting them, or by reading the 40 m as the distance from the near point to the tower rather than as the gap between the two observation points.",
  ),

  // Module 303004 - General intelligence and reasoning
  mcq(
    303,
    9,
    "Which number completes the series 2, 6, 12, 20, 30, ?",
    ["36", "40", "44", "42"],
    3,
    "Easy",
    "Series",
    "The differences are 4, 6, 8 and 10, rising by 2 each time, so the next difference is 12 and the term is 30 plus 12, which is 42. Read the series a second way as a check: the terms are 1×2, 2×3, 3×4, 4×5, 5×6, so the next is 6×7, again 42. Option B is the trap for a candidate who spots that the differences are even numbers but assumes they hold at 10. Reading a series twice, once through differences and once through a formula, is the cheapest verification available in the paper.",
  ),
  mcq(
    303,
    10,
    "Statements: All pens are books. Some books are red. Conclusions: I. Some pens are red. II. Some books are pens. Which conclusion follows?",
    [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Both conclusions follow",
      "Neither conclusion follows",
    ],
    1,
    "Hard",
    "Syllogism",
    "Conclusion II is the converse of the first statement: if every pen is a book, then at least some books are pens, and that holds in every arrangement. Conclusion I does not follow, because the books that are red need not be any of the books that happen to be pens; you can draw the red region entirely outside the pen circle without contradicting either statement. Option A tempts because both statements mention books and it feels as though the redness must reach across, but a conclusion is valid only if it survives every possible diagram, not merely the first one you sketch.",
  ),

  // Module 303005 - English comprehension
  mcq(
    303,
    11,
    "Which of these sentences is grammatically correct?",
    [
      "One of my friend has been selected for the post.",
      "One of my friends have been selected for the post.",
      "One of my friends has been selected for the post.",
      "One of my friends have been selecting for the post.",
    ],
    2,
    "Easy",
    "Grammar",
    "The subject is 'One', which is singular, so the verb must be 'has'. The phrase 'of my friends' merely tells you which one, and the noun inside it has to be plural because you are picking one out of many, so 'friend' is wrong as well. Option B is the answer most candidates mark, because the plural noun sits immediately before the verb and pulls the ear towards 'have'. SSC sets this proximity trap almost every year, so train yourself to strike out the 'of' phrase before you choose the verb.",
  ),
  mcq(
    303,
    12,
    "In a para jumble, what is the soundest way to identify the opening sentence?",
    [
      "The sentence that introduces its subject in full, with no pronoun or backward pointing 'the' that depends on something said earlier",
      "The shortest sentence, since opening lines are usually brief",
      "The sentence that states the main idea of the paragraph",
      "The sentence that begins with a proper noun",
    ],
    0,
    "Medium",
    "Jumbles",
    "An opening sentence cannot refer backwards, because there is nothing behind it. It therefore names its subject in full and avoids 'he', 'this', 'such', 'these' and a definite article used for something not yet introduced. Option C is the attractive wrong answer, because we are taught that a paragraph carries a topic sentence, but in a jumbled set the main idea is very often placed in the middle or held back to the last line, and choosing on meaning instead of on reference is how candidates lose the entire block of marks. After the opener, hunt for mandatory pairs, where a pronoun in one sentence has exactly one possible antecedent in another.",
  ),

  // Module 303006 - General awareness and static GK
  mcq(
    303,
    13,
    "A citizen whose fundamental right has been violated moves the Supreme Court directly. Which provision of the Constitution gives that right?",
    ["Article 19", "Article 21", "Article 226", "Article 32"],
    3,
    "Medium",
    "Polity",
    "Article 32 gives the right to move the Supreme Court for the enforcement of the fundamental rights, and it is itself placed among the fundamental rights, which is why Dr Ambedkar described it as the heart and soul of the Constitution. Option C is the closest wrong answer and the one the paper counts on: Article 226 does empower a High Court to issue the same writs, over an even wider field, but it is a power conferred on the court rather than a right vested in the citizen, so it does not sit inside Part III at all.",
  ),
  mcq(
    303,
    14,
    "Which substance is the natural ripening agent in fruit?",
    ["Ethylene", "Acetylene", "Methane", "Carbon dioxide"],
    0,
    "Easy",
    "Chemistry",
    "Ethylene is a plant hormone released by the fruit itself, and it triggers the changes of ripening: the flesh softens, starch converts to sugar and the skin colour turns. Option B is the tempting answer because traders do ripen fruit artificially using calcium carbide, which gives off acetylene, and acetylene works only because it imitates ethylene. Calcium carbide is prohibited for ripening under the food safety regulations, since the commercial grade carries traces of arsenic and phosphorus. Methane and carbon dioxide play no part in ripening.",
  ),

  // Module 303007 - Tier-II specific modules
  mcq(
    303,
    15,
    "What is the essential difference between RAM and ROM?",
    [
      "RAM is the permanent store and ROM is the temporary one",
      "RAM loses its contents when the power goes off and is written to freely, while ROM keeps its contents without power and is not rewritten in normal use",
      "ROM is faster than RAM because it sits closer to the processor",
      "RAM is measured in gigabytes and ROM in megahertz",
    ],
    1,
    "Easy",
    "Hardware",
    "The real difference is volatility, together with what the machine is allowed to write. RAM is the working memory the processor reads from and writes to while a programme is running, and it empties the instant power is cut; ROM holds the firmware needed to start the machine and survives a power cut untouched. Option A is the exact reversal and is chosen often, because the phrase 'read only' suggests a permanent file store. The permanent file store is the hard disk or the SSD, which is neither RAM nor ROM.",
  ),
  mcq(
    303,
    16,
    "The data entry speed test is measured in key depressions per hour, and the convention is that five key depressions make one word. A candidate typing steadily at 8,000 key depressions per hour is typing at roughly what speed in words per minute?",
    [
      "About 133 words per minute",
      "About 67 words per minute",
      "About 27 words per minute",
      "About 16 words per minute",
    ],
    2,
    "Hard",
    "Entry",
    "Divide by 60 to reach key depressions per minute, which is about 133, then divide by 5 because five depressions make a word, which gives about 27 words per minute. Option A is the trap, stopping after the first division and reporting key depressions per minute as though they were words; it is also why a figure quoted per hour sounds far more forbidding than the speed it describes. The practical reading is that a steady typist at 30 words per minute is already above this rate, so the test is about holding accuracy across the whole passage rather than reaching a peak speed.",
  ),

  // Module 303008 - Speed, accuracy and exam day
  mcq(
    303,
    17,
    "The four sections of Tier-I carry equal marks. Why do experienced candidates still attempt general awareness first?",
    [
      "Because general awareness carries no negative marking",
      "Because the examination software releases the four sections in a fixed order",
      "Because general awareness answers are marked more leniently than the rest",
      "Because a general awareness question is either recalled within seconds or not at all, so it converts a small fixed slice of the hour into marks and leaves the remainder for the calculation heavy sections",
    ],
    3,
    "Medium",
    "Attempt",
    "The reason is time per mark, not marks. Twenty-five recall questions can be dealt with in seven or eight minutes, because you either know the answer or you move on, whereas a single quantitative question can swallow two minutes by itself. Clearing the recall section early protects the sections where time genuinely converts into marks. Option A is the tempting one and it is simply untrue: the same penalty for a wrong answer applies across all four sections, which is precisely why you skip a general awareness question you do not know instead of filling the section in blindly.",
  ),
  mcq(
    303,
    18,
    "In a paper where a correct answer earns 2 marks and a wrong answer costs 0.5 marks, you reach a question where you can rule out two of the four options with confidence and then guess between the remaining two. What is the expected gain from attempting it?",
    [
      "Plus 0.75 marks",
      "Plus 1.5 marks",
      "Plus 0.5 marks",
      "Nothing, the gain and the penalty cancel out",
    ],
    0,
    "Hard",
    "Negative",
    "With two options left your chance of being right is one half, so the expectation is half of plus 2 added to half of minus 0.5, which is 1 minus 0.25, or plus 0.75 marks. Across the twenty or so such questions a full paper throws up, that is fifteen marks you would leave on the table by not attempting. Option D is the belief that keeps careful candidates permanently under-attempting: the penalty here is only a quarter of the reward, so even a blind guess across all four options carries an expectation of plus 0.125 marks, and eliminating anything at all only strengthens the case. What the arithmetic does not price is the time spent, which is the real reason to abandon a question you cannot narrow down.",
  ),
];

export default BANK;
