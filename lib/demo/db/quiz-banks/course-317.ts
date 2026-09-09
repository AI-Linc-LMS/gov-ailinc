import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 317, Access to Finance: MUDRA, SHG Linkage & Subsidies.
 *
 * Every `skill` below is a single word taken from a topic title in course 317, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by splitting
 * its title into at most four significant words, and `bankForTopic` matches this skill against
 * that list case-insensitively. A word that is not among the first four concepts of some topic
 * matches nothing and sinks to the bottom of every pile.
 *
 * Four topics in this course carry an assignment rather than a quiz (31708, 31714, 31716,
 * 31719), so no quiz is ever served against their own concepts. The questions that belong to
 * those subjects therefore borrow a skill from a quiz topic that covers the same ground:
 * the project report question keys on Bankable (31703) and the digital records question on
 * Loan (31709, 31717).
 *
 * Skills used, module by module:
 *   1 SHG, Lending, Score            4 PMEGP, PMFME, Stand-Up
 *   2 Grades, Linkage, Liability     5 Collateral, Guarantee, Bankable
 *   3 Shishu, Working, Sanction      6 Behaviour, Insurance, Loan
 *
 * Difficulty is six Easy, six Medium, six Hard. The correct option is spread across all four
 * positions (A x5, B x4, C x5, D x4), so a candidate cannot read the answer off the screen.
 *
 * No interest rate, subsidy amount, loan slab or scheme fee is the subject of any question
 * here. Those are revised by notification, and a stale key is worse than no question.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 317001: the rural credit map ---- */
  mcq(
    317,
    1,
    "A self help group has been meeting for a year but has not yet been linked to a bank. Where does the money for an internal loan to a member come from?",
    [
      "The group's own pooled savings, together with the interest earned on earlier internal loans",
      "A grant released by the block office on the day the group is formed",
      "An advance from the branch against the group's future savings",
      "The revolving fund, which every group receives as soon as it is formed",
    ],
    0,
    "Easy",
    "SHG",
    "The first stage of a group is thrift. Members save a fixed sum at every meeting, the corpus sits in the group's account, and the group lends it to its own members on terms it sets itself, so the interest also stays inside the group. Outside money comes later, and only to a group that has already shown it can collect and recover. The revolving fund is the tempting answer because most groups do receive one, but it is released after grading as a reward for that record, not as a starting grant, and a group that has never lent its own savings has given a grader nothing to assess.",
  ),
  mcq(
    317,
    2,
    "Your unit falls within the priority sector for bank lending. What does that actually mean for your application?",
    [
      "The loan carries a lower rate of interest, fixed by the Reserve Bank",
      "The government repays the loan if the unit fails",
      "The branch must sanction the loan once the papers are complete",
      "The bank has a target for how much of its credit goes to sectors like yours, so the incentive to lend is real, but the appraisal still applies",
    ],
    3,
    "Medium",
    "Lending",
    "Priority sector lending is an obligation placed on the bank, measured as a share of its adjusted net bank credit, and covering agriculture, micro and small enterprises, education, housing and weaker sections among others. A bank that falls short has to park the shortfall where it earns far less, so the pressure to lend is genuine. But the target sits on a portfolio, not on your file: the branch still appraises the activity, the margin and the repayment capacity. A concessional rate is the tempting answer because the two are constantly confused in conversation, and while particular refinance and scheme loans do carry cheaper funds, priority sector status by itself fixes no rate at all.",
  ),
  mcq(
    317,
    3,
    "A borrower who fell badly behind on an earlier loan finally clears it by paying a reduced amount that the bank agrees to accept as full and final. How does that appear when the next lender pulls the credit report?",
    [
      "As an account reported settled, which a lender reads as a loss taken on the loan",
      "As an account reported closed, exactly as after full repayment",
      "It disappears from the report once the dues are cleared",
      "Nothing appears, because a settlement is a private arrangement between the borrower and the bank",
    ],
    0,
    "Hard",
    "Score",
    "A one time settlement closes the account in the bank's books, but the credit information report records the status as settled, meaning the lender accepted less than it was owed and absorbed the difference. The next lender reads that as a loss and prices, or refuses, accordingly, and the entry stays on the report for years. Closed is the tempting answer, because in ordinary language the borrower has cleared the loan, but that status is reserved for accounts repaid in full as contracted. Where a borrower can manage it, paying the whole dues, even late, leaves a materially better record than settling for less.",
  ),

  /* ---- Module 317002: self help group and joint liability linkage ---- */
  mcq(
    317,
    4,
    "When a group is graded before bank linkage, which of these weighs most heavily?",
    [
      "The landholding and household income of the members",
      "The regularity of meetings, savings and recovery of internal loans, and whether the books show it",
      "The number of members the group has enrolled",
      "Whether the group has a registered office and a board outside it",
    ],
    1,
    "Easy",
    "Grades",
    "Grading measures group discipline, because that discipline is the only security behind an unsecured loan to a group. The grader looks for meetings on a fixed day, attendance, a savings amount collected from every member without exception, internal loans given and recovered, and books a third party can read. Household income is the tempting answer, because it looks like the natural test of repayment capacity, but the entire design of the SHG route is that people with no assets can borrow on the strength of their own record. A group of comfortable members that meets when it feels like it grades below a poorer group that has never missed a collection.",
  ),
  mcq(
    317,
    5,
    "A group is sanctioned a cash credit limit rather than a term loan. On what does interest run?",
    [
      "On the full sanctioned limit, from the date of sanction",
      "On the group's savings balance held with the branch",
      "On the amount actually drawn and outstanding, day by day",
      "At a flat rate on the limit, spread evenly across the tenure",
    ],
    2,
    "Medium",
    "Linkage",
    "A cash credit is a revolving limit. The group draws what it needs, puts money back as members repay, draws again, and interest runs only on the balance outstanding on each day. That is exactly why the product suits a group whose members need money at different points in the year, and it rewards a group that returns funds promptly. Interest on the whole limit is the tempting answer because a term loan does charge on the full amount, but a term loan hands over that amount while a cash credit limit is only a permission to borrow. A group that draws the limit to the ceiling and leaves it there pays as though it had taken a term loan and gains nothing for it.",
  ),
  mcq(
    317,
    6,
    "Why is a joint liability group the usual route for financing a tenant farmer who cultivates land he does not own?",
    [
      "Because the landowner becomes the guarantor for the loan",
      "Because a bank cannot lend to a tenant farmer individually under any circumstances",
      "Because the loan is written off if the crop fails",
      "Because the mutual guarantee of the group stands in place of the land security the tenant cannot offer",
    ],
    3,
    "Hard",
    "Liability",
    "A tenant, an oral lessee or a sharecropper has the cultivation but not the title, so there is nothing to mortgage and often no record of the tenancy the branch can rely on. A joint liability group of four to ten such cultivators, who know each other and each other's fields, gives a written mutual guarantee: each member's loan is his own, but the members stand behind one another, and the group screens who is admitted. That is the security. The landowner as guarantor is the tempting answer, and it does happen, but it puts the tenancy on record in exactly the way many landowners refuse, which is what makes the group route necessary in the first place.",
  ),

  /* ---- Module 317003: MUDRA and enterprise loans ---- */
  mcq(
    317,
    7,
    "Shishu, Kishore and Tarun under MUDRA are best described as",
    [
      "three separate schemes, each restricted to a different kind of business",
      "bands of loan size, so a borrower who repays a smaller loan well can return for the next band",
      "categories of borrower decided by the applicant's age",
      "three different lenders, one for each size of enterprise",
    ],
    1,
    "Easy",
    "Shishu",
    "The three names mark bands of credit requirement, smallest to largest, and nothing else. Any non-farm income generating activity in manufacturing, trading, services or allied agriculture can be financed in whichever band matches the money it needs, through the same banks, small finance banks, non-banking finance companies and microfinance institutions. The ladder exists for graduation: a first time borrower takes a small loan, builds a record on it, and comes back for a larger one on the strength of that record. Separate schemes for separate trades is the tempting answer because the three names sound like three products, but a tailoring unit and a dairy unit can sit in the same band.",
  ),
  mcq(
    317,
    8,
    "Your unit needs money for a second sewing machine and also to hold more cloth stock through the festival season. How should the two needs be put to the branch?",
    [
      "Both as working capital, since both serve the same business",
      "Both as a term loan, since both are being borrowed at the same time",
      "The machine as a term loan repaid over its useful life, and the stock as a working capital limit that revolves",
      "Neither, until the unit has been running for three years",
    ],
    2,
    "Medium",
    "Working",
    "The test is how the money comes back. A machine is paid for once and earns over several years, so it is matched with a term loan whose instalments are spread across that life. Stock and receivables turn over within the operating cycle, so they are matched with a limit you draw and repay as that cycle runs. Putting the machine on the working capital limit is the tempting answer because it is quicker and needs no fresh appraisal, and it is the commonest reason a unit that looks profitable is permanently short of cash: the limit that should be buying cloth is locked into an asset, and there is nothing left to trade with.",
  ),
  mcq(
    317,
    9,
    "A sanction letter offers a term loan of five years with a moratorium of six months. What does the moratorium mean in practice?",
    [
      "No principal instalment falls due in those six months, but interest continues to run on the outstanding amount",
      "Nothing is payable and nothing accrues for six months",
      "The loan runs for four and a half years rather than five",
      "The bank may recall the loan at any time during the first six months",
    ],
    0,
    "Hard",
    "Sanction",
    "A moratorium, or repayment holiday, is a gap before principal repayment begins. It exists so that a unit still being set up is not asked for an instalment before it earns anything. Interest is a separate matter: the money is out and it keeps accruing, and the sanction letter will say whether you service it every month through the holiday or it is added to the outstanding. That nothing accrues is the tempting answer, and the borrower who believes it is caught either by the first demand or by a larger balance when instalments start. Read a sanction letter for three things above all: the date the first instalment falls due, whether interest is payable during the moratorium, and what the rate is reset against.",
  ),

  /* ---- Module 317004: subsidy-linked schemes ---- */
  mcq(
    317,
    10,
    "Under PMEGP, where does the margin money assistance sit, and when does it benefit the borrower?",
    [
      "In your savings account from the date of sanction, to serve as your own contribution",
      "Paid straight to the machinery supplier by the implementing agency",
      "In a deposit you may withdraw as soon as the unit starts production",
      "Held by the bank as a locked deposit in the borrower's name, and adjusted against the loan only after the unit has run through the prescribed lock-in period",
    ],
    3,
    "Medium",
    "PMEGP",
    "The assistance is credit linked and back ended. The bank keeps it in a deposit for the lock-in period and adjusts it against the loan account at the end, provided the unit was actually set up and ran, which is deliberate: the scheme pays for a working enterprise, not for an application. Treating it as your own contribution is the tempting answer, and it is the mistake that sinks files, because the promoter's contribution has to be brought in separately from your own resources before the loan is disbursed. A file that shows the subsidy doing duty as the margin is returned at appraisal, not at disbursement.",
  ),
  mcq(
    317,
    11,
    "PMFME assistance for upgrading a micro food processing unit is credit linked. What follows from that for the applicant?",
    [
      "The subsidy is paid first, and you arrange a loan later if you still need one",
      "It is a cash grant paid to any registered food unit that applies",
      "It comes only against a loan sanctioned by a bank, and is released through that bank",
      "It has to be repaid along with the loan",
    ],
    2,
    "Easy",
    "PMFME",
    "Credit linked means the bank's appraisal is the gate. You put up a project, a bank sanctions a loan against it, and the assistance is then routed through that bank and adjusted against the loan account, so no lender means no subsidy however good the idea is. That is why the first job of the district resource person is to get your file into a shape a branch will sanction, not merely to complete the portal entry. A cash grant on application is the tempting answer because much welfare payment does work that way, but a scheme meant to create bankable units uses the bank deliberately as the filter.",
  ),
  mcq(
    317,
    12,
    "Stand-Up India facilitates bank loans for a greenfield enterprise. Which applicant is therefore outside it?",
    [
      "A woman setting up her first manufacturing unit",
      "An applicant from a Scheduled Caste setting up a first services venture",
      "A woman seeking funds to expand a trading business she has run for six years",
      "An applicant from a Scheduled Tribe setting up a first unit in an activity allied to agriculture",
    ],
    2,
    "Hard",
    "Stand-Up",
    "Greenfield means the borrower's first venture in that activity, and that is the point of the scheme: it exists to bring new Scheduled Caste, Scheduled Tribe and women entrepreneurs into formal credit, across manufacturing, services, trading and activities allied to agriculture. Expanding an established business is a perfectly good proposal, but it belongs to an ordinary enterprise loan or to a larger MUDRA loan. The trading option repays a second look for the opposite reason: trading is within the scheme, so it is not the activity that puts this applicant outside it, it is that the venture already exists.",
  ),

  /* ---- Module 317005: making the application succeed ---- */
  mcq(
    317,
    13,
    "Your loan is sanctioned without collateral, covered instead by a credit guarantee. The unit fails and the loan is not repaid. What follows?",
    [
      "The guarantee meets an agreed part of the bank's loss, and the borrower remains liable for the whole debt",
      "The guarantee clears the borrower's dues, and the borrower owes nothing further",
      "The loan is written off and no recovery is attempted",
      "The household's assets are sold, because that is what the guarantee permits",
    ],
    0,
    "Easy",
    "Collateral",
    "A credit guarantee is cover for the lender, not for the borrower. It allows a branch to lend to a unit that has nothing to mortgage, by meeting an agreed share of the lender's loss if the account goes bad, and a fee is charged for it on the loan. The borrower's obligation is untouched: recovery continues, and the guarantee institution, having paid the bank, is entitled to what is recovered afterwards. That the borrower walks away clear is the tempting answer and the costliest misunderstanding in collateral free lending, because a borrower who believes it stops treating the instalment as a real obligation.",
  ),
  mcq(
    317,
    14,
    "A branch asks for a third party guarantor on a loan against which no collateral is offered. How does a guarantor differ from collateral security?",
    [
      "A guarantor is only a character reference and carries no liability",
      "Collateral is an asset charged to the bank, while a guarantor takes on a personal obligation to pay if the borrower does not",
      "A guarantor's liability starts only after the bank has sold everything the borrower owns",
      "A guarantor is needed only for loans that are too large for a credit guarantee scheme",
    ],
    1,
    "Hard",
    "Guarantee",
    "Collateral is a specific asset over which the bank takes a charge, and the bank's remedy runs against that asset. A guarantee is a promise by a person: on default the bank may proceed against the guarantor, and under Indian contract law the surety's liability is joint and several with the borrower's unless the contract says otherwise, so the bank need not exhaust the borrower first. That the borrower must be pursued to the end first is the tempting answer, and it is precisely why people sign for a relative without thinking. It also explains why the account shows on the guarantor's own credit report: one default damages two records, not one.",
  ),
  mcq(
    317,
    15,
    "A branch manager reads your project report. Which of these does most to decide whether the proposal is bankable?",
    [
      "The profit projected in the fifth year",
      "The size of the market described in the opening section",
      "Whether projected sales rise every single year",
      "Whether the projected cash flow, at a realistic level of capacity utilisation, covers the instalment and the interest with something to spare",
    ],
    3,
    "Medium",
    "Bankable",
    "Appraisal is about servicing, not about ambition. The manager works out whether the cash the unit generates in each year exceeds what it must pay the bank in that year, and by what cushion, which is what the debt service coverage ratio measures. A first year assumed at full capacity, or a straight line of rising sales, reads as a report nobody has thought about, because a new unit ramps up slowly and a real business has a bad season. The fifth year profit is the tempting answer because it is the number the applicant is proudest of, but instalments fall due long before then, and a unit that cannot pay in year one never reaches year five.",
  ),

  /* ---- Module 317006: repayment and what follows ---- */
  mcq(
    317,
    16,
    "You want a larger limit at the end of the first year. What weighs most when the branch considers the enhancement?",
    [
      "The profit figure you declare for the year",
      "The number of years the unit has been registered",
      "How the account was conducted: instalments met on the due date, and business receipts routed through the account",
      "Whether you have also borrowed from another bank",
    ],
    2,
    "Medium",
    "Behaviour",
    "The branch already holds the best evidence about you that exists, which is your own account. Instalments met on the due date, a limit that was drawn and brought back down instead of sitting at the ceiling, and sales credits actually landing in the account together tell the manager that the business turns over what you claim and that you pay. A declared profit is the tempting answer, and it does matter to the file, but it is a statement made by the borrower while conduct is a record made by the bank. It is also why routing sales through the account, even when taking cash is easier, is worth the trouble: it is what you will be judged on next year.",
  ),
  mcq(
    317,
    17,
    "A small borrower is enrolled through the bank account in both PMJJBY and PMSBY. What is the difference between the two covers?",
    [
      "PMJJBY covers death from any cause, while PMSBY covers death or disability caused by an accident",
      "PMJJBY covers only accidental death, while PMSBY covers illness",
      "PMJJBY covers the loan outstanding, while PMSBY covers the family",
      "They are the same cover, sold by two different sets of insurers",
    ],
    0,
    "Easy",
    "Insurance",
    "PMJJBY is a term life cover and pays on death from any cause during the policy year. PMSBY is a personal accident cover and pays on accidental death and on permanent disability caused by an accident, which is the risk that most often destroys a one person enterprise without killing the person. Both run for a year, both renew by auto debit from the savings account, and both lapse if the balance is short on the debit date, which is the practical thing to watch. Reading PMJJBY as a loan cover is the tempting answer because a lender often does ask for one, but the amount under these schemes is payable to the nominee and is tied to no loan.",
  ),
  mcq(
    317,
    18,
    "Two units of similar size apply for a second loan. One keeps sales in a handwritten diary and is paid mostly in cash. The other takes payments into the business account and files its returns on the same figures. Why does the second file move faster?",
    [
      "Because a digital payment attracts a lower rate of interest",
      "Because the appraisal can verify turnover from records the bank did not have to take on trust, so less has to be established afresh",
      "Because a unit carrying a bank loan is not permitted to accept cash sales",
      "Because banks are required to give priority to units that accept digital payments",
    ],
    1,
    "Hard",
    "Loan",
    "An appraisal is an exercise in verification. Credits landing in the account, a return filed on the same figures, and a stock and sales record that agrees with both let the officer confirm turnover without a field investigation, and that investigation is where the weeks go. The diary is not disbelieved, it is simply unverifiable, so the officer substitutes conservative assumptions and conservative assumptions produce a smaller limit. That cash sales are not permitted is the tempting answer and it is plainly wrong: cash is lawful and common. The cost of taking it is not a penalty, it is an appraisal with less to work with.",
  ),
];

export default BANK;
