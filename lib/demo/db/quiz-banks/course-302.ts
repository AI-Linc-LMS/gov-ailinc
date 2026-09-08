/**
 * Course 302 - TGPSC Group-II & Group-III Foundation.
 *
 * Course-level fallback bank. Every `skill` below is a single word that
 * `conceptsFor` actually derives from the title of the topic it belongs to, so
 * `bankForTopic` can float it to the top of that topic's pile. Skills used, in
 * module order: Group-II, Marking, Science, Data, Disaster, Ancient, Kakatiya,
 * Hyderabad, Fundamental, Parliament, Constitutional, Tribe, Education,
 * Agriculture, Revenue, Mulki, Formula, Reorganisation.
 *
 * Nothing here turns on a vacancy count, a fee, a cut-off or a scheme amount.
 * Those change with every notification and a stale key is worse than no
 * question, so the bank asks about structure, procedure and consequence.
 */

import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

const BANK: DemoMcq[] = [
  // Module 1 - How Group-II and Group-III are scored
  mcq(
    302,
    1,
    "Group-II is written as four papers and Group-III as three. Which paper belongs to the Group-II scheme and not to the Group-III scheme?",
    [
      "Telangana Movement and State Formation",
      "General Studies and General Abilities",
      "History, Polity and Society",
      "Economy and Development",
    ],
    0,
    "Easy",
    "Group-II",
    "Group-III repeats the first three Group-II papers, which is why one plan serves both notifications; the extra paper in Group-II is the dedicated one on the Telangana movement and the formation of the state. General Studies and General Abilities is the tempting pick because it is the paper everyone begins with, but it is the paper the two examinations share, not the one that separates them.",
  ),
  mcq(
    302,
    2,
    "A paper awards one mark for a correct answer and deducts one third of a mark for a wrong one. You attempt 120 of the 150 questions and 90 of your answers are correct. What is your score?",
    ["80", "85", "90", "70"],
    0,
    "Medium",
    "Marking",
    "Of the 120 attempts, 30 are wrong, and 30 multiplied by one third is 10 marks lost, so 90 minus 10 leaves 80. The tempting 90 comes from counting only the correct answers: the penalty attaches to every wrong attempt, and the 30 questions you left blank cost you nothing, which is exactly why leaving a question is a real option and guessing blindly is not.",
  ),

  // Module 2 - General studies and general abilities
  mcq(
    302,
    3,
    "A pressure cooker cooks food faster than an open vessel mainly because",
    [
      "the raised pressure inside pushes the boiling point up, so the food cooks in water hotter than 100 degrees Celsius",
      "the sealed lid stops heat escaping, so more of the burner's heat reaches the food",
      "the raised pressure pulls the boiling point down, so the water starts boiling sooner",
      "steam carries more heat than water at the same temperature, so the food absorbs it faster",
    ],
    0,
    "Easy",
    "Science",
    "Water boils when its vapour pressure matches the pressure above it. Sealing the vessel raises that pressure, so boiling begins only at a higher temperature and the food sits in water well above 100 degrees Celsius. The option that says the boiling point falls is the standard confusion: inside a cooker the water boils later and hotter, and it is the higher temperature, not an earlier boil, that shortens the cooking time.",
  ),
  mcq(
    302,
    4,
    "In a district, 1,200 candidates wrote a screening test. 45 per cent of them were women. 60 per cent of the women and 40 per cent of the men qualified. How many candidates qualified in all?",
    ["588", "600", "564", "612"],
    0,
    "Hard",
    "Data",
    "45 per cent of 1,200 is 540 women, leaving 660 men. 60 per cent of 540 is 324 and 40 per cent of 660 is 264, and the two add to 588. The tempting 600 comes from averaging the two rates to 50 per cent and applying that to all 1,200, which is only valid when the two groups are of equal size, and here they are not.",
  ),
  mcq(
    302,
    5,
    "Under the Disaster Management Act, 2005, the National Disaster Management Authority is chaired by",
    [
      "the Prime Minister",
      "the Union Home Secretary",
      "the Union Home Minister",
      "the Cabinet Secretary",
    ],
    0,
    "Medium",
    "Disaster",
    "The Act makes the Prime Minister the ex officio chairperson of the NDMA, mirroring the Chief Minister at the head of a State Disaster Management Authority. The Union Home Secretary is the attractive wrong answer because he does chair the National Executive Committee, the body that turns NDMA policy into coordinated action, but the executive committee and the authority are two different tiers.",
  ),

  // Module 3 - Socio-cultural history of India and Telangana
  mcq(
    302,
    6,
    "Across most of the subcontinent, Ashoka's rock and pillar edicts were engraved in which script?",
    ["Brahmi", "Kharoshthi", "Devanagari", "Grantha"],
    0,
    "Medium",
    "Ancient",
    "Brahmi carries the edicts almost everywhere, and it was James Prinsep's decipherment of Brahmi in the 1830s that reopened Mauryan history to modern reading. Kharoshthi is genuinely tempting because it does appear on the edicts, but only in the north west, at sites such as Shahbazgarhi and Mansehra. Devanagari took shape many centuries later and could not have been used at all.",
  ),
  mcq(
    302,
    7,
    "In Telangana's agrarian history, the Kakatiya rulers of Warangal are remembered above all for",
    [
      "building and endowing chains of tanks that caught the runoff of seasonal streams",
      "cutting canals from barrages on the Godavari to carry water up to the plateau",
      "sinking stepwells inside fort towns to secure drinking water",
      "introducing lift irrigation worked by animal power along the Krishna",
    ],
    0,
    "Medium",
    "Kakatiya",
    "Kakatiya rule left the plateau covered in tanks, each catching the runoff of a seasonal stream and often spilling into the next one downslope, with Pakhal and Ramappa the best known survivors. Barrage fed canals sound right because they dominate irrigation in the state today, but a barrage across the Godavari is a work of modern engineering, not a medieval one.",
  ),
  mcq(
    302,
    8,
    "Hyderabad State was integrated into the Indian Union in September 1948. What was its position in the years immediately after that?",
    [
      "it continued as one state, run first under a military governor and then by a civil administration, with the Nizam as Rajpramukh",
      "it was divided at once among the neighbouring Telugu, Marathi and Kannada speaking provinces",
      "it was administered directly by the Centre as a centrally administered territory until the first general election",
      "it kept internal sovereignty under the Nizam while the Union handled only defence and external affairs",
    ],
    0,
    "Hard",
    "Hyderabad",
    "Hyderabad stayed intact for another eight years: the military administration under Major General J. N. Chaudhuri gave way to a civil government by 1950, and the Nizam became Rajpramukh of what the Constitution classified as a Part B state. Division among three linguistic states is the tempting answer because it did happen, but only in 1956 under the States Reorganisation Act, and folding 1956 back into 1948 is the commonest slip in this section.",
  ),

  // Module 4 - Indian Constitution and polity
  mcq(
    302,
    9,
    "Which statement about the Directive Principles of State Policy is correct?",
    [
      "they are not enforceable by any court, yet they are fundamental in the governance of the country and the state is to apply them in making laws",
      "they can be enforced directly through a writ petition to the Supreme Court under Article 32",
      "they override the fundamental rights whenever the two conflict",
      "they bind the state governments but not the Union government",
    ],
    0,
    "Easy",
    "Fundamental",
    "Article 37 says precisely this: the principles are not justiciable, but the state has a duty to apply them when it legislates. The Article 32 option is the trap, because Article 32 is itself a fundamental right and can be invoked only to enforce a Part III right. That difference in enforceability is the whole distinction between Part III and Part IV.",
  ),
  mcq(
    302,
    10,
    "A joint sitting of the two Houses under Article 108 is not available for which category of bill?",
    [
      "money bills and constitution amendment bills",
      "financial bills that are not money bills",
      "ordinary bills first introduced in the Rajya Sabha",
      "ordinary bills passed by the Lok Sabha and rejected outright by the Rajya Sabha",
    ],
    0,
    "Hard",
    "Parliament",
    "A money bill needs no joint sitting because the Rajya Sabha cannot reject one at all, it may only send recommendations back within fourteen days, and a constitution amendment bill is excluded because each House has to pass it separately by the special majority, which a joint sitting would defeat. The financial bill option is the trap: a financial bill that is not a money bill travels like an ordinary bill for this purpose, and outright rejection by the second House is one of the very situations that trigger a joint sitting.",
  ),
  mcq(
    302,
    11,
    "Three of these owe their existence to the Constitution itself. Which one was created by an ordinary Act of Parliament?",
    [
      "the National Human Rights Commission",
      "the Union Public Service Commission",
      "the Comptroller and Auditor General",
      "the Finance Commission",
    ],
    0,
    "Hard",
    "Constitutional",
    "The NHRC was set up by the Protection of Human Rights Act, 1993, so it is a statutory body and Parliament could recast or wind it up by ordinary law. The UPSC comes from Article 315, the Comptroller and Auditor General from Article 148 and the Finance Commission from Article 280. The Finance Commission is the usual wrong pick because it is constituted afresh every five years and therefore looks temporary, but the body itself is written into the Constitution.",
  ),

  // Module 5 - Society, social issues and public policy
  mcq(
    302,
    12,
    "How is a community recognised as a Scheduled Tribe in relation to a particular state?",
    [
      "the President specifies it for that state by public notification, and the list can afterwards be altered only by an Act of Parliament",
      "the state legislature passes a resolution and the Governor notifies it",
      "the Ministry of Tribal Affairs adds it by executive order on the state's recommendation",
      "the Registrar General records it as such at the decennial census",
    ],
    0,
    "Medium",
    "Tribe",
    "Article 342 lets the President specify the tribes of a state by notification after consulting the Governor, and it expressly reserves any inclusion in or exclusion from that list to Parliament by law. The executive order option is tempting because the Ministry of Tribal Affairs really does examine and pilot every proposal, but the file has to end in an amending Act, not in an order of the ministry's own.",
  ),
  mcq(
    302,
    13,
    "The right of children between six and fourteen to free and compulsory education is a fundamental right under",
    ["Article 21A", "Article 45", "Article 29", "Article 51A"],
    0,
    "Easy",
    "Education",
    "Article 21A was inserted by the 86th Amendment and is enforceable in court, with the Right of Children to Free and Compulsory Education Act, 2009 giving it working shape. Article 45 is the attractive wrong answer because it once carried the promise of universal education, but the same amendment recast it as a directive principle covering early childhood care and education for children below six, and a directive principle cannot be enforced.",
  ),

  // Module 6 - Indian and Telangana economy
  mcq(
    302,
    14,
    "Rythu Bandhu, the investment support scheme run in Telangana, is paid on what basis?",
    [
      "an amount for each acre owned, released ahead of each cropping season into the landowner's bank account",
      "an amount for each quintal of produce actually sold at a regulated market yard",
      "a rebate on the interest charged on a crop loan taken from a cooperative bank",
      "the gap between the market price and the minimum support price whenever the market falls short",
    ],
    0,
    "Medium",
    "Agriculture",
    "The transfer goes to the recorded landowner on a per acre basis before the kharif and rabi seasons, and nothing about it depends on what is sown or whether any of the crop is sold. The last option describes a price deficiency payment, a different instrument that pays only after a sale and only when prices fall below support levels; the two get confused because both are loosely called farm support.",
  ),
  mcq(
    302,
    15,
    "In a state budget, which of the following is a capital receipt rather than a revenue receipt?",
    [
      "market borrowing raised through state development loans",
      "the state's share of central taxes devolved on the Finance Commission's formula",
      "state goods and services tax collected within the state",
      "interest received on loans the state advanced to its public undertakings",
    ],
    0,
    "Hard",
    "Revenue",
    "A receipt is capital when it creates a liability for the state or runs down one of its assets, and borrowing does the first, which is why it cannot be treated as income however freely it can be spent. Tax devolution is the usual wrong pick because the money arrives from outside the state and feels like a windfall, but it neither creates a liability nor depletes an asset, so it is a revenue receipt exactly like the state's own GST.",
  ),

  // Module 7 - Telangana movement and state formation
  mcq(
    302,
    16,
    "The Mulki rules, whose non-implementation became a central grievance behind the 1969 agitation, originally provided for",
    [
      "reserving appointments in the Hyderabad State service for those who met a residence requirement in the state",
      "distributing surplus jagir land among the tenants who cultivated it",
      "fixing the share of Telugu, Marathi and Kannada as media of instruction in Hyderabad State",
      "exempting the Telangana districts from the land revenue settlement of the Nizam's government",
    ],
    0,
    "Medium",
    "Mulki",
    "The Mulki rules of the Nizam's government defined who counted as a mulki, a local, for the purpose of public employment, and the safeguards carried into the Gentlemen's Agreement of 1956 rested on them. The 1969 agitation grew from the charge that non-locals had been appointed in Telangana in breach of those rules. Land distribution is tempting because the same decades saw sustained agrarian struggle here, but the Mulki rules were about posts, not about land.",
  ),
  mcq(
    302,
    17,
    "The Six Point Formula of 1973 was given constitutional backing through",
    [
      "Article 371D, inserted by the Thirty-second Amendment",
      "Article 370, extended to Andhra Pradesh by a presidential order",
      "Article 244 read with the Fifth Schedule",
      "Article 356, used to reserve appointments during President's rule",
    ],
    0,
    "Hard",
    "Formula",
    "Article 371D empowered the President to provide for local cadres in public employment and local reservation in education for Andhra Pradesh, and to set up an Administrative Tribunal for service disputes. Government Order 610 of 1985 followed from a finding that the zonal rules made under that article had been breached, which is why the article and the order are always studied together. Article 244 and the Fifth Schedule are the plausible distractor because they do concern scheduled areas in this state, but they deal with tribal administration, not with the employment safeguards the formula bargained for.",
  ),
  mcq(
    302,
    18,
    "Under the Andhra Pradesh Reorganisation Act, 2014, what was settled about Hyderabad?",
    [
      "it would serve as the common capital of both states for a period not exceeding ten years",
      "it would become a centrally administered territory outside both states",
      "it would be the capital of Telangana alone, the successor state moving out at once",
      "it would be run by a joint board of the two states with no fixed end date",
    ],
    0,
    "Easy",
    "Reorganisation",
    "The Act made Hyderabad the common capital of Telangana and the successor state of Andhra Pradesh for a period not exceeding ten years, after which it is the capital of Telangana alone. The centrally administered option is the one candidates fall for, because it was pressed hard while the bill was debated and is widely remembered as though it had been carried, but the Act did not take that route.",
  ),
];

export default BANK;
