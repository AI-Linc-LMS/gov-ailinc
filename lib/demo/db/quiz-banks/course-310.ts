import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 310, Banking Awareness, Economy & Current Affairs.
 *
 * Every `skill` below is one word lifted from a topic title of course 310, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by taking at
 * most four significant words out of its title, and `bankForTopic` matches this skill against
 * that list case-insensitively. A skill that is not among a topic's first four concepts matches
 * nothing and sinks to the bottom of every pile.
 *
 * There are eighteen topics in this course and eighteen questions here, one per topic, so every
 * lesson has at least one on-topic fallback question even before its own set is authored:
 *
 *   1 Credit, Reserve, Repo        4 Inflation, GST, Balance
 *   2 Deposit, Nomination, NPA     5 Jan, PMJJBY, Priority
 *   3 Instruments, SEBI, NEFT      6 Newspaper, Compilation, Awareness
 *
 * Six Easy, six Medium, six Hard. The key is spread across all four positions (A x5, B x4,
 * C x4, D x5) so that a candidate who has learnt nothing cannot read the answer off the shape
 * of the paper.
 *
 * Nothing here turns on a figure that a notification or a policy review can change: no policy
 * rate, no CRR or SLR percentage, no premium, no cover amount, no loan slab. Rates and slabs are
 * stale within a quarter, and a stale key teaches the wrong thing with full confidence.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 310001: money, banking and the RBI ---- */
  mcq(
    310,
    1,
    "Banks keep 20 per cent of every deposit as a reserve and lend the rest, and every rupee lent returns to the banking system as a fresh deposit. A single new deposit of ₹1,000 can support total deposits of about",
    ["₹1,200", "₹4,000", "₹5,000", "₹20,000"],
    2,
    "Medium",
    "Credit",
    "The deposit multiplier is one divided by the reserve ratio. One divided by 0.20 is five, so ₹1,000 supports ₹5,000 of deposits, of which ₹4,000 is credit the banking system created rather than money it received. ₹4,000 is the tempting answer, and it is the right number for a different question: it is the new credit alone, while the total asked for here also contains the original ₹1,000. ₹20,000 comes from multiplying by 20 instead of dividing by 0.20. The point behind the arithmetic is that a bank does not lend a deposit out and stop, because the loan becomes somebody else's deposit and the cycle runs again, which is what makes the reserve ratio a lever at all.",
  ),
  mcq(
    310,
    2,
    "The Reserve Bank is described as the lender of last resort. What does that mean in practice?",
    [
      "It lends to the central government whenever the budget runs a deficit",
      "It lends to a bank that is sound but short of cash for the moment, when no other lender will",
      "It guarantees that every deposit in every bank will be repaid",
      "It takes over the management of a bank that is close to failure",
    ],
    1,
    "Easy",
    "Reserve",
    "A bank can be perfectly solvent and still be unable to meet withdrawals on a given day, because its assets are loans that do not mature today. The central bank lends against collateral to bridge exactly that gap, which stops a liquidity problem from turning into a solvency problem and stops one bank's trouble from spreading to the next. Guaranteeing deposits is the tempting answer, and deposits are indeed insured, but that is done by the DICGC, a separate subsidiary of the Reserve Bank, and it pays after a bank has failed rather than keeping it standing. Taking over management happens through a moratorium and an amalgamation scheme, which is supervisory action and not lending at all.",
  ),
  mcq(
    310,
    3,
    "The Reserve Bank wants to absorb surplus liquidity from the banking system for a few days without changing its policy stance. Which of these does that?",
    [
      "A reverse repo auction, in which banks park funds with the Reserve Bank against government securities and take them back on a fixed date",
      "A cut in the cash reserve ratio",
      "An outright purchase of government securities from banks in the open market",
      "A reduction in the statutory liquidity ratio",
    ],
    0,
    "Hard",
    "Repo",
    "In a repo the Reserve Bank lends to banks and injects money. A reverse repo runs the other way: banks lend to the Reserve Bank, the money leaves the system until the fixed reversal date, and the absorption is temporary by construction, which is what the question asks for. The open market purchase is the tempting answer because it also involves government securities, but there the Reserve Bank is buying them outright and paying for them, so it injects liquidity and does so permanently. Cutting either ratio releases resources rather than absorbing them, and the two are not the same thing: the CRR is a cash balance kept with the Reserve Bank that earns the bank nothing, while the SLR is met out of the bank's own holding of approved securities, cash and gold, and both are computed on net demand and time liabilities.",
  ),

  /* ---- Module 310002: banking products and the customer ---- */
  mcq(
    310,
    4,
    "A wholesale trader makes and receives payments many times a day and needs the bank to honour cheques beyond the credit balance from time to time. Which account is meant for that customer?",
    [
      "A savings bank account",
      "A recurring deposit account",
      "A fixed deposit account",
      "A current account",
    ],
    3,
    "Easy",
    "Deposit",
    "A current account is built for business turnover. It places no limit on the number of transactions, and it is the account against which an overdraft or a cash credit limit is run, which is why it pays no interest. The savings account is the tempting answer because it is the account everybody knows, but it is meant for household savings, the free withdrawals on it are capped, and banks do not run a business overdraft on it. A recurring deposit takes a fixed sum every month and a fixed deposit locks a lump sum for a term, so neither can serve as a payment account at all.",
  ),
  mcq(
    310,
    5,
    "A depositor has named a nominee on a fixed deposit and then dies. What does the nomination settle?",
    [
      "That the nominee becomes the owner of the money and the legal heirs have no claim",
      "That the bank may pay the balance to the nominee and is discharged by paying, while who is finally entitled is still decided by succession law",
      "That the deposit goes to the nominee only if the depositor left no will",
      "That the bank must hold the money until a succession certificate is produced",
    ],
    1,
    "Hard",
    "Nomination",
    "A nomination is a mandate telling the bank whom to pay. It gives the bank a valid discharge, so the money is released quickly and without court papers, but the nominee receives it for whoever is entitled under the will or under the law of succession, and an heir can still pursue a claim against the nominee. The first option is the tempting one, a great many depositors believe it, and that belief is the reason nomination disputes reach the courts at all. Insisting on a succession certificate is what happens when there is no nomination and no survivorship clause, which is precisely the delay a nomination exists to avoid.",
  ),
  mcq(
    310,
    6,
    "A term loan is classified as a non performing asset when",
    [
      "the borrower's business is reported to be running at a loss",
      "the recovery officer forms the opinion that the money will not come back",
      "the borrower has been admitted to insolvency proceedings by a tribunal",
      "interest or an instalment of principal has remained overdue for more than 90 days",
    ],
    3,
    "Medium",
    "NPA",
    "Classification is a rule about days past due, not a judgement about the borrower. Once interest or an instalment stays overdue beyond 90 days the account is a non performing asset, income can no longer be booked on it and a provision has to be made, and the account is flagged as a special mention account well before that, in sub categories that begin at 31 and at 61 days overdue. The recovery officer's opinion is the tempting answer because it sounds like the way a lender would actually think, but a discretionary test is exactly what the norm replaced: a bank left to decide for itself when a loan had gone bad could postpone that day indefinitely and keep booking interest that was never received. Insolvency proceedings usually follow the classification rather than cause it.",
  ),

  /* ---- Module 310003: financial markets and regulators ---- */
  mcq(
    310,
    7,
    "A 91 day treasury bill with a face value of ₹100 is bought at ₹98. What does the investor get, and when?",
    [
      "₹98 back at maturity, with interest paid every quarter until then",
      "₹102 at maturity, the ₹2 being the coupon",
      "₹100 at maturity and nothing before it, so the ₹2 discount is the entire return",
      "₹100 at maturity plus interest at the policy rate",
    ],
    2,
    "Medium",
    "Instruments",
    "Treasury bills carry no coupon. They are issued at a discount to face value and redeemed at face value, so the whole return is the ₹2 difference earned over 91 days, which annualises to a little over 8 per cent on the ₹98 actually invested. A coupon on top is the tempting answer because that is how a dated government security behaves, and a five year or ten year security does pay half yearly interest. The zero coupon structure and the sub year tenor are what make this a money market instrument rather than a capital market one, and that tenor line, one year, is the line the paper usually tests.",
  ),
  mcq(
    310,
    8,
    "A unit linked insurance plan collects a premium, provides a death cover and invests the balance in the equity market. Which regulator supervises the product?",
    [
      "SEBI, because the money goes into shares",
      "The Reserve Bank, because the premium is often collected through a bank",
      "PFRDA, because the product builds a long term corpus",
      "IRDAI, because the product is a contract of insurance",
    ],
    3,
    "Hard",
    "SEBI",
    "Regulation here follows the product and the entity that issues it, not the asset the money finally sits in. A unit linked plan is a policy issued by an insurer, so IRDAI authorises it and prescribes its charges, its minimum cover and its disclosures. SEBI is the tempting answer because the fund inside a ULIP behaves very like a mutual fund scheme, and that resemblance is exactly why the two regulators once contested jurisdiction over it in public. Apply the same test to the neighbours and the whole module falls into place: a mutual fund scheme is SEBI's, the National Pension System is PFRDA's, a bank deposit is the Reserve Bank's.",
  ),
  mcq(
    310,
    9,
    "How does an RTGS transfer differ from an NEFT transfer?",
    [
      "RTGS settles each instruction on its own as it arrives, while NEFT settles instructions together in batches",
      "RTGS works only between branches of the same bank",
      "NEFT can be used only during banking hours, while RTGS runs through the day",
      "RTGS is available only for payments made to the government",
    ],
    0,
    "Easy",
    "NEFT",
    "The name carries the answer: real time gross settlement puts through one instruction at a time and settles it finally as it comes, which is why it is the route for large value payments where the receiver needs certainty at once. NEFT gathers instructions and settles them in batches, which is cheaper and entirely adequate for ordinary transfers. Banking hours is the tempting answer because it used to be true, and older guides still say it, but both systems now run round the clock on all days. Neither is confined to one bank or to government payments, and both move money between accounts held at different banks, which is the whole purpose of them.",
  ),

  /* ---- Module 310004: Indian economy basics ---- */
  mcq(
    310,
    10,
    "Retail inflation stays well above wholesale inflation for several months together. Which explanation fits best?",
    [
      "The consumer price index includes services and gives a heavy weight to food at retail prices, while the wholesale index prices only goods traded in bulk and contains no services at all",
      "The consumer index is compiled by the Reserve Bank and the wholesale index by the banks, so they use different prices",
      "The consumer index counts only urban households, and prices in cities always rise faster",
      "The wholesale index leaves out fuel, which is usually the fastest rising item",
    ],
    0,
    "Hard",
    "Inflation",
    "The two indices measure different baskets at different points of the chain. The consumer index prices a household's consumption at the retail counter, with a large food weight and a substantial services component covering rent, education, health and transport, none of which the wholesale index captures, since that one prices goods at the wholesale stage. Services and retail margins can therefore hold retail inflation up while bulk goods prices are flat or falling. The urban only option is the tempting error, because a separate index for industrial workers does exist and is used for dearness allowance: the headline consumer index has rural and urban components and the combined figure is the one the monetary policy framework sets its target against. Fuel appears in both indices.",
  ),
  mcq(
    310,
    11,
    "A dealer in Hyderabad supplies goods to a buyer in Bengaluru. Which tax does the invoice carry?",
    [
      "Central GST and Telangana State GST, because the seller is in Telangana",
      "Integrated GST, because the supply crosses a state boundary",
      "Central GST and Karnataka State GST, because the buyer is in Karnataka",
      "Karnataka State GST alone, because GST is a destination based tax",
    ],
    1,
    "Medium",
    "GST",
    "GST splits by the nature of the supply. An intra state supply attracts central GST plus the state GST of that state, and an inter state supply attracts a single integrated GST levied by the centre, which the centre then settles with the state where the goods are finally consumed. The last option is the tempting one because it reasons from a correct premise, that a destination based tax should end up with the consuming state, to the wrong mechanism: the settlement between governments happens after the levy, through the integrated GST pool, and a seller cannot charge another state's GST on an invoice at all.",
  ),
  mcq(
    310,
    12,
    "In a given year India runs a current account deficit and its foreign exchange reserves still rise. How is that possible?",
    [
      "The reserves rose only because the gold already held was revalued at a higher price",
      "The Reserve Bank issued fresh rupees and added them to the reserves",
      "The two figures are inconsistent, because a current account deficit must draw reserves down",
      "Inflows on the capital and financial account exceeded the current account gap, and the Reserve Bank absorbed the surplus into reserves",
    ],
    3,
    "Hard",
    "Balance",
    "The balance of payments balances. A current account deficit says the country paid out more on goods, services and transfers than it earned, and that gap has to be financed by somebody, which is what the capital and financial account records: direct investment, portfolio flows, external commercial borrowing, deposits by non residents. When those inflows are larger than the gap, the excess foreign currency is bought by the central bank and appears as an addition to reserves. Calling the figures inconsistent is the tempting answer, because a deficit does sound like a drain, and it is the useful reminder that the current account is only one half of the account. Valuation changes do move the reserve number, but they revalue what is already held and cannot explain why a deficit year ends with more reserves than it began with.",
  ),

  /* ---- Module 310005: schemes and financial inclusion ---- */
  mcq(
    310,
    13,
    "What is a basic savings bank deposit account, of the kind opened in very large numbers under the financial inclusion drive?",
    [
      "A savings account any individual may open on completing KYC, carrying no minimum balance requirement and a prescribed set of free services",
      "An account that may be opened only by a person certified as below the poverty line by the district administration",
      "A deposit account that pays a higher rate of interest than an ordinary savings account",
      "An account opened through a business correspondent, for which the bank carries no liability",
    ],
    0,
    "Easy",
    "Jan",
    "Three features define it: anyone who completes KYC may open one, no minimum balance is required, and the free services it must offer, chiefly a fixed number of withdrawals and a debit card, are prescribed rather than left to the bank. Eligibility tied to a poverty certificate is the tempting answer, because the account is associated with an inclusion programme and such certificates are used elsewhere, but restricting it that way would defeat the purpose, which was to remove the paperwork that kept ordinary households out of the banking system. Interest is paid at the ordinary savings rate, and a business correspondent is only a delivery channel: the account is the bank's liability wherever it was opened.",
  ),
  mcq(
    310,
    14,
    "A subscriber is enrolled in both PMJJBY and PMSBY and dies after an illness. Which cover answers?",
    [
      "Both, since the subscriber was enrolled in both",
      "PMSBY, since it is the wider of the two covers",
      "PMJJBY, since it is a life cover that pays on death from any cause, while PMSBY answers only for accidents",
      "Neither, since death from illness is excluded from both",
    ],
    2,
    "Medium",
    "PMJJBY",
    "The two are deliberately different products sold at the same counter. PMJJBY is a one year renewable term life cover and pays on death from any cause, natural or accidental. PMSBY is a personal accident cover and pays on death or permanent disability caused by an accident, so a death from illness falls outside it. Holding both is common, which is exactly why the confusion is common: a subscriber who holds both is covered twice over for an accident, but only PMJJBY answers here. The third scheme in this family, Atal Pension Yojana, is not an insurance cover at all. It is a pension regulated by PFRDA that pays a guaranteed monthly amount from the age of sixty.",
  ),
  mcq(
    310,
    15,
    "A bank lends more to the priority sector than its target requires and sells priority sector lending certificates to a bank that has fallen short. What passes to the buyer?",
    [
      "The loans themselves, which move to the buyer's books along with the borrowers",
      "A government guarantee against default on the underlying loans",
      "Only the credit for having met the priority sector target, while the loan, the interest on it and the risk of it stay with the seller",
      "The right to recover from the borrower if the seller fails to",
    ],
    2,
    "Hard",
    "Priority",
    "A priority sector lending certificate trades compliance, not assets. The seller keeps the loan on its books, keeps the interest and keeps the credit risk, and the buyer counts the certificate towards its own shortfall. That is the design: a bank with the rural branches to originate small loans is paid for doing so by a bank that cannot, and no borrower's account has to move. The first option is the tempting answer because a transfer of the asset is what happens in a securitisation or a direct assignment, and those routes also count towards the priority sector, which is precisely why the two are worth telling apart. A shortfall left uncovered is met instead through contributions to funds such as the Rural Infrastructure Development Fund maintained with NABARD.",
  ),

  /* ---- Module 310006: reading current affairs for a banking paper ---- */
  mcq(
    310,
    16,
    "You are making current affairs notes for a banking paper out of the day's newspaper. Which item earns a note?",
    [
      "The closing share price of a public sector bank",
      "The rupee's closing rate against the dollar that day",
      "A private bank's profit for the quarter",
      "The Reserve Bank creating a new category of bank licence, and what that category is permitted to do",
    ],
    3,
    "Easy",
    "Newspaper",
    "Awareness papers ask about institutions, mandates, definitions and first occurrences, because those stay true from the notification to the exam hall. A licence category, a new committee, a scheme's coverage, a change in who supervises what: each of those is still examinable months later. A price or a quarterly profit is stale within days, is almost never asked as a figure, and fills a notebook without earning a mark. What is worth carrying away from a market report is the direction and the reason behind it, for instance why the rupee has been under pressure, rather than the number itself.",
  ),
  mcq(
    310,
    17,
    "You have a month of daily current affairs notes. What makes the monthly compilation worth the hour it costs?",
    [
      "It regroups scattered daily items under standing heads such as regulators, schemes and appointments, so that one question brings the whole family back",
      "It is longer than the daily notes, so it covers more ground",
      "It removes the need to revise, because writing an item out once fixes it in memory",
      "It records the newspaper and the date each item came from, which an examiner expects to see",
    ],
    0,
    "Easy",
    "Compilation",
    "Recall in the hall works by category, not by date. A question on a pension scheme should bring back the rest of that family, the regulator that supervises them and the one point on which they differ, and only a compilation organised under standing heads does that, because nobody retrieves a fact filed under the twelfth of the month. The third option is the tempting one, since writing does help you encode an item, but memory decays without retrieval, which is why the compilation is read again in short passes at widening intervals rather than once, carefully. A good compilation is also shorter than the notes it came from, not longer. The second pass is where you delete.",
  ),
  mcq(
    310,
    18,
    "An awareness section has 50 questions of one mark each, four options per question, and a quarter mark deducted for a wrong answer. A candidate is certain of 30 and guesses the other 20 blindly. On average, what do those guesses add?",
    [
      "Nothing, because the deductions cancel the marks gained exactly",
      "About 1 mark",
      "About 5 marks",
      "They cost about 4 marks",
    ],
    1,
    "Medium",
    "Awareness",
    "Twenty blind guesses at four options each yield about 5 right and 15 wrong. That is 5 marks earned against 15 quarter marks lost, which is 3.75, so the guesses add roughly 1.25 marks. Blind guessing is very slightly in your favour under this penalty, and the arithmetic says why: with four options the penalty at which guessing becomes pointless is one third of a mark, not a quarter. The first option is the tempting answer because it is the rule of thumb candidates repeat to one another, and it is correct for that other penalty and not for this one. The larger lesson is that the gain from blind guessing is small, so the marks lie in eliminating one option before you guess, which lifts the expected return per question well over twice.",
  ),
];

export default BANK;
