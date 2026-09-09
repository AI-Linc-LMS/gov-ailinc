import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 318, Farmer Producer Organisations: Formation & Management.
 *
 * Every `skill` below is a single word lifted from a topic title in course 318, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts builds a topic's concepts by splitting
 * its title into at most four non-stopword terms, and `bankForTopic` matches this skill
 * against that list case-insensitively. A multi-word skill, or a word that is not among the
 * first four concepts of some topic, matches nothing and sinks to the bottom of every pile.
 *
 * Skills used, module by module:
 *   1 Problem, Cooperative, FPO        5 Licences, Moisture, Hiring
 *   2 Baseline, Membership             6 eNAM, Contract
 *   3 Board, Statutory, Conflict       7 Patronage, Audit
 *   4 Aggregation, Working, Costing
 *
 * Difficulty is a clean six, six and six. The correct option is spread across all four
 * positions (A x4, B x5, C x5, D x4), so a candidate cannot read the key off the screen.
 *
 * No question turns on a subsidy rate, a grant ceiling, a GST rate or an interest rate.
 * Those move with every revision, and a stale key on a compliance course is worse than a
 * question that was never written. The arithmetic questions are worked in the explanations.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 318001: why an FPO ---- */
  mcq(
    318,
    1,
    "A farmer with two acres brings thirty quintals of maize to market after harvest. Which disadvantage is a producer organisation mainly meant to remove?",
    [
      "His grain is of poorer quality than a large farmer's, so it is bound to fetch a lower grade",
      "He may not sell outside the market yard notified for his area",
      "He arrives alone with a small lot on the day everyone else is selling, so he accepts the price offered rather than negotiating one",
      "He has no access to institutional credit for the crop",
    ],
    2,
    "Easy",
    "Problem",
    "The small holder's weakness is not his crop, it is his position at the moment of sale: a small lot, no storage to wait with, and a loan or a wedding that needs the cash this week. Pooling turns thirty quintals into three hundred, which is a lot a buyer will travel for and bid on. Quality is the tempting answer, and it is why aggregation is so often mistaken for a grading exercise, but the identical grain from the identical field fetches a different price depending on the size of the lot, the way it is graded and the week it is offered. Credit is a real constraint too, but an FPO is not a lender, and a member who borrows elsewhere still needs someone to sell for him.",
  ),
  mcq(
    318,
    2,
    "How does a producer company registered under the Companies Act differ from a cooperative society registered under a state cooperative Act?",
    [
      "A producer company may admit members who are not producers, while a cooperative society may not",
      "A producer company may distribute its surplus to members, while a cooperative society may not",
      "A producer company may borrow from a commercial bank, while a cooperative society may borrow only from cooperative banks",
      "A producer company is registered and supervised under company law, so the state cooperative department has no power to supersede its board or defer its elections",
    ],
    3,
    "Medium",
    "Cooperative",
    "The producer company form was written into company law precisely to give producers a mutual body that a state department does not administer. Your filings go to the Registrar of Companies, your directors' term is what your articles say, and no departmental officer can be deputed to run the board. The first option is the tempting one and it is backwards: membership of a producer company is restricted to primary producers and producer institutions, and that restriction is exactly what separates it from an ordinary private limited company. Both forms return surplus to members, both are audited, and both can bank where they choose.",
  ),
  mcq(
    318,
    3,
    "Two FPOs of similar size register in the same year in neighbouring mandals. Three years on, one is trading steadily and the other has stopped. Which difference separates them most reliably?",
    [
      "The one still trading built a single business line its members used every season, while the other ran whichever activity the current grant paid for",
      "The one still trading received a larger promoter grant in its first year",
      "The one still trading registered as a producer company and the other as a cooperative society",
      "The one still trading has more members on its rolls",
    ],
    0,
    "Hard",
    "FPO",
    "What keeps an FPO alive is repeat use: a member who sells or buys through it twice a year has a reason to hold shares, to attend the general meeting and to accept the day's rate. That is also what builds the buyer relationship and the transaction record a bank will lend against. Grant size is the tempting answer, because it is what promoters argue about hardest, but a grant funds the setting up and then stops, and an organisation whose activity changes every time the funding line changes never accumulates any of it. Names on the rolls without transactions behind them are the standard shape of a paper FPO.",
  ),

  /* ---- Module 318002: mobilisation and formation ---- */
  mcq(
    318,
    4,
    "Why is a baseline survey of the prospective members carried out before an FPO is formed?",
    [
      "To decide the share price and the entry fee for membership",
      "To meet a document requirement of the Registrar of Companies at incorporation",
      "To establish what each household grows, in what quantity, in which season and where it sells now, so the business line is chosen from evidence",
      "To identify which households are eligible for a scheme benefit",
    ],
    2,
    "Easy",
    "Baseline",
    "The survey gives you crop-wise volume, the weeks in which it arrives, the channel it goes through today and the gap between the farm gate price and the market price. That is the only honest basis for saying an aggregation or an input business will have anything to aggregate or to sell. Scheme targeting is the tempting answer, because promoters do run household surveys for exactly that purpose and the two often happen in the same fortnight, but a benefit list tells you who is poor, not what will trade. The Registrar asks for none of this: the survey is a business decision, and an FPO that skips it registers first and then goes looking for something to do.",
  ),
  mcq(
    318,
    5,
    "At the annual general meeting of a producer company, a member holding five hundred shares and a member holding fifty attend. How do their votes compare?",
    [
      "Votes are in proportion to shares held, so one carries ten times the weight of the other",
      "Each has one vote, because a producer company votes by member and not by shareholding",
      "Neither votes at the general meeting, since only the elected directors vote there",
      "The larger holder has two votes, subject to a ceiling fixed in the articles",
    ],
    1,
    "Easy",
    "Membership",
    "A producer company votes on the mutual principle, one member one vote, whatever the shareholding. That is what stops the largest farmer in the village, or a trader who has taken membership, from controlling the company by buying shares. Proportional voting is the tempting answer because it is the rule in an ordinary company limited by shares, and the producer company sits inside the same Act, so a candidate who reasons from company law alone gets it wrong. Read the departure as deliberate: the form exists to protect the small holder inside a company structure, and voting is where that protection actually bites.",
  ),

  /* ---- Module 318003: governance ---- */
  mcq(
    318,
    6,
    "Which of these is the board's job in an FPO rather than the chief executive's?",
    [
      "Fixing the purchase rate offered to farmers on a given day",
      "Weighing and grading the produce brought to the collection centre",
      "Making the daily procurement entries in the register",
      "Approving the annual business plan and the limit up to which the chief executive may commit funds",
    ],
    3,
    "Easy",
    "Board",
    "The board sets direction and limits and then holds one person to them: the business plan, the borrowing and purchase limits, the audit, and the appointment of the chief executive itself. The day's rate is the tempting answer, because the directors are farmers who genuinely know that market better than a salaried manager does. But a board that fixes the daily rate has nobody left to hold accountable for the margin, and it is also the doorway through which a director's own trading interest walks into the company's pricing. Decide the rule the rate is set by, then let the executive apply it and answer for the result.",
  ),
  mcq(
    318,
    7,
    "An FPO's board authorises borrowing of ₹40,00,000 as cash credit against stock. Six months later the auditor asks for evidence that the borrowing was approved. What is the record he is entitled to see?",
    [
      "The minutes book of board meetings, showing the resolution with its date, the directors present and the limit approved",
      "The bank's sanction letter",
      "A written confirmation from the chief executive that the board had agreed",
      "The attendance register for that day's meeting",
    ],
    0,
    "Medium",
    "Statutory",
    "Statutory records exist so that a decision can be proved later by someone who was not in the room. The minutes book, signed and kept at the registered office, is the company's own evidence that the borrowing was authorised, by whom, and up to what limit. The sanction letter is the tempting answer because it is the document with the money on it, but it proves only that the bank agreed to lend. If the board never passed the resolution, the sanction letter makes the position worse rather than better, because it shows an officer committed the company without authority. The attendance register shows who came, not what was decided.",
  ),
  mcq(
    318,
    8,
    "A director of an FPO also runs a commission shop that buys the same crop the FPO procures. What does sound practice require of him?",
    [
      "He must resign from the board, because no other course is open to him",
      "Nothing is required, so long as he pays the FPO the same rate as any other buyer",
      "He must record the interest in the register of interests, and stay out of the discussion and the vote whenever the FPO deals with his firm or fixes a rate that affects it",
      "He must stop dealing in that crop for as long as he holds office",
    ],
    2,
    "Hard",
    "Conflict",
    "A rural FPO draws its directors from the people who already trade, transport, gin and lend in that village, so a rule that disqualifies everyone with an interest leaves the board empty and hands the organisation to whoever has no stake in it. The workable rule is disclosure on the record, followed by withdrawal from the specific decision. Paying the same rate is the tempting answer because it sounds like the whole of fairness, but the advantage is not usually in the rate: it is in helping set the rate, in knowing the buyer's offer first, and in the order in which suppliers are paid. None of that is visible in the rate itself.",
  ),

  /* ---- Module 318004: business planning ---- */
  mcq(
    318,
    9,
    "A newly registered FPO with limited working capital is choosing its first business line. Why do experienced promoters usually advise input supply before outright procurement of produce?",
    [
      "Input supply earns a higher margin on each rupee turned over than procurement does",
      "Input supply can run largely against members' advance orders, so the money is out for days rather than for a season",
      "Input supply needs no licence, while procurement of produce does",
      "Input supply falls outside the scope of GST",
    ],
    1,
    "Medium",
    "Aggregation",
    "The comparison is about how long each rupee is tied up. Members book their seed or fertiliser, you buy against those orders, you deliver, and the cash returns inside the same cycle. Buying produce means paying the farmer on the spot and then holding stock until a buyer lifts it and pays, which is where a first year FPO's capital disappears. The higher margin is the tempting answer, but input margins are thin and largely fixed by the principal, so the case for starting there rests on the speed of the cycle and not the size of the spread. Input supply in fact needs more licensing than aggregating a member's own produce, not less.",
  ),
  mcq(
    318,
    10,
    "An FPO pays its members on the day of delivery, holds stock for about thirty days, and is paid by the buyer forty-five days after despatch. On a turnover of ₹2,00,00,000 a year spread evenly, roughly how much working capital does this cycle tie up?",
    [
      "About ₹2,00,00,000",
      "About ₹41,00,000",
      "About ₹25,00,000",
      "About ₹16,00,000",
    ],
    1,
    "Hard",
    "Working",
    "The cash is out from the day you pay the farmer to the day the buyer pays you, which is thirty days of stock plus forty-five days of credit, so seventy-five days. A turnover of ₹2,00,00,000 spread over the year is about ₹54,800 a day, and seventy-five days of that is roughly ₹41,00,000. Counting only the forty-five days of buyer credit gives about ₹25,00,000 and is the tempting answer, because receivables are the number a board actually discusses. The stock sitting in the godown was paid for out of the same account, however, and has to be funded for as long as it sits there. This total is the number your cash credit limit has to be argued against.",
  ),
  mcq(
    318,
    11,
    "An aggregation centre costs ₹1,20,000 a month in rent, staff and power. The FPO keeps a gross margin of ₹60 a quintal after paying the farmer and meeting transport. What monthly volume must pass through the centre before it covers its own costs?",
    ["200 quintals", "2,000 quintals", "20,000 quintals", "24,000 quintals"],
    1,
    "Hard",
    "Costing",
    "Divide the fixed cost by the margin each quintal contributes: ₹1,20,000 divided by ₹60 is 2,000 quintals a month, which is about 67 quintals on every working day. The figure of 24,000 quintals is the tempting answer, and it is the year's requirement rather than the month's, which candidates reach because business plans are written annually while rent is paid monthly. The figure of 20,000 comes from dividing by ₹6 instead of ₹60. Having got 2,000, ask the second question immediately: do your members actually market that much in this season, because a centre sized for the harvest peak stands idle for the other eight months and still owes its rent.",
  ),

  /* ---- Module 318005: operations ---- */
  mcq(
    318,
    12,
    "An FPO wants to sell certified seed, fertiliser and pesticide to its members from its own outlet. What must it hold before it opens?",
    [
      "Nothing, because a sale to its own members is not a sale in law",
      "A single trade licence from the gram panchayat covering all three",
      "Only a GST registration in the FPO's name",
      "A separate dealer licence for each of the three inputs, under the law governing that input, in the FPO's name and for the premises it sells from",
    ],
    3,
    "Easy",
    "Licences",
    "Seed, fertiliser and pesticide are each controlled by a different law, and each licence is tied to a named premises, held in the name of the selling entity, and in the case of pesticide often to a person holding a prescribed qualification. The members-only exemption is the tempting answer and it is the one FPOs most commonly assume, since the outlet feels like a shared store rather than a shop. The law looks at the act of sale, not at the relationship between seller and buyer. Selling without the licence is an offence, and it also destroys your ability to pursue the supplier when a batch turns out to be bad.",
  ),
  mcq(
    318,
    13,
    "A member delivers 100 quintals of paddy at 20 per cent moisture. The buyer accepts delivery at 14 per cent moisture. Ignoring handling loss, what does the lot weigh once it has been dried to the accepted level?",
    ["80 quintals", "86 quintals", "93 quintals", "94 quintals"],
    2,
    "Hard",
    "Moisture",
    "Only water leaves the lot. The dry matter is 80 quintals and it has to be 86 per cent of the dried lot, so the lot weighs 80 divided by 0.86, which is about 93 quintals. Subtracting six percentage points to get 94 is the tempting shortcut, and it is wrong because those six points are a share of a shrinking total, not of the original weight. That single quintal is roughly one per cent of the consignment, which on most crops is larger than the FPO's whole margin, so a centre that settles on the arithmetic rather than the actual dry weight loses money on every load it handles.",
  ),
  mcq(
    318,
    14,
    "An FPO buys a tractor and implements and runs them as a custom hiring centre. Which figure decides most directly whether the centre earns or loses?",
    [
      "The number of hours it is hired out in a year, set against the hours the loan instalment and the fixed costs assume",
      "The purchase price of the tractor and its implements",
      "The number of members on the FPO's rolls",
      "The share of the purchase price met by subsidy",
    ],
    0,
    "Medium",
    "Hiring",
    "Cost per hour falls as hours rise, because the instalment, the insurance, the shed and the driver's retainer are owed whether the machine moves or not. The same tractor used 300 hours a year and 900 hours a year spreads an identical fixed cost over very different denominators, and only one of those recovers it. The purchase price is the tempting answer, but it is only the numerator, and two FPOs that bought the identical machine end up in different places entirely. The hard part is that demand for every implement peaks in the same three weeks, so the utilisation you have to plan for is what happens in the other forty-nine.",
  ),

  /* ---- Module 318006: markets ---- */
  mcq(
    318,
    15,
    "What does selling a lot through eNAM change for an FPO, compared with selling the same lot in its local mandi yard?",
    [
      "The FPO no longer needs a trading licence",
      "Payment is guaranteed by the government if the buyer defaults",
      "The produce is exempted from the market fee",
      "The lot is opened to buyers registered beyond the local yard, who bid against the local traders on an assayed and graded lot",
    ],
    3,
    "Medium",
    "eNAM",
    "The gain is in the number of bidders, and in the fact that a buyer who cannot see the heap is willing to bid at all. He can only do that if the lot has been assayed and described in terms he trusts, which is why assaying and lot preparation are the part of eNAM an FPO has to get right before it worries about the platform. A payment guarantee is the tempting answer, because a distant buyer is exactly what a first time seller is nervous about, but the platform gives you a settlement process rather than a state guarantee. The buyer's terms and your own checks still carry that risk.",
  ),
  mcq(
    318,
    16,
    "An FPO is about to sign its first supply contract with a processor. Which clause should the board read most carefully?",
    [
      "The clause fixing the quality parameters, the method by which they are tested, and who bears the cost when a consignment is rejected on them",
      "The clause naming the venue for arbitration",
      "The clause fixing the term of the contract",
      "The clause reciting the FPO's registration particulars",
    ],
    0,
    "Hard",
    "Contract",
    "The rejection clause is where the price actually lives. A contract can name a handsome rate and still lose the FPO money if the moisture and foreign matter limits are tighter than what members deliver, if the buyer's own laboratory is the sole judge of whether they were met, and if a rejected truck comes back at your cost with a load nobody local now wants. Arbitration is the tempting answer, because that is the clause lawyers spend their time on, but you will meet the quality clause on every single consignment and the arbitration clause quite possibly never.",
  ),

  /* ---- Module 318007: compliance and accounts ---- */
  mcq(
    318,
    17,
    "An FPO closes the year in surplus. What distinguishes a patronage bonus from a dividend?",
    [
      "A patronage bonus is paid in cash and a dividend in shares",
      "A patronage bonus goes to directors and a dividend to ordinary members",
      "A patronage bonus is paid in proportion to the business each member did with the FPO, while a dividend is paid on the shares each member holds",
      "A patronage bonus is taxable in the member's hands and a dividend is not",
    ],
    2,
    "Medium",
    "Patronage",
    "The distinction is the whole point of the producer company form. Patronage rewards use, so the member who routed ten tonnes through the FPO receives more than the member who routed one, whatever their shareholdings. A dividend rewards capital. An FPO that returns surplus only as dividend slowly becomes an investment for whoever bought the most shares, while patronage keeps the reward attached to the behaviour the business needs, which is members transacting. The cash and shares answer is tempting because a bonus is usually paid out in cash, but either can be paid in either form, and it is the basis of the calculation that separates them.",
  ),
  mcq(
    318,
    18,
    "A producer company traded very little in a particular year. What must it still do for that year?",
    [
      "Nothing, since there was no turnover to report",
      "Hold an annual general meeting, have its accounts audited, and file its annual return and financial statements with the Registrar",
      "File a GST return only",
      "Place the accounts before the members, with no filing required",
    ],
    1,
    "Easy",
    "Audit",
    "Incorporation creates a standing set of obligations that a quiet year does not suspend: the general meeting within the prescribed period, a statutory audit, and the annual return and accounts filed with the Registrar. The idea that no turnover means no filing is the tempting answer, and it is how FPOs quietly accumulate late fees that end up larger than the audit they were avoiding, and how their directors find themselves disqualified from sitting on any other board. File a nil year rather than skip it, and keep the company alive on the record for the season it does trade.",
  ),
];

export default BANK;
