import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 316, Start Your Rural Micro-Enterprise.
 *
 * Every `skill` below is one word lifted from a topic title in course 316, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts builds a topic's concepts from at most
 * four words of its title, and `bankForTopic` matches this skill against that list case
 * insensitively. A skill that is not among a topic's derived concepts matches nothing and
 * sinks to the bottom of every pile, so each one here was derived by hand from the title of
 * the topic the question belongs to and checked against that list.
 *
 * Skills used, module by module:
 *   1 Finding a business worth starting   Demand, Enterprises, Manufacturing
 *   2 Testing the idea on paper           Costing, Break-even, Plan
 *   3 Registration and compliance         Udyam, Proprietorship, Food
 *   4 Money and records                   Separating, Cash, Working
 *   5 Customers and selling                Pricing, Quality, Credit
 *   6 Growing and surviving               Hiring, Insurance, Reinvesting
 *
 * All fourteen topics of this course that actually carry a quiz card (31601, 31602, 31604,
 * 31606, 31608, 31609, 31610, 31611, 31613, 31614, 31616, 31617, 31618, 31619) have at least
 * one skill pointing at them, so the fallback lands on topic where it is served. The four
 * remaining skills belong to assignment topics whose teaching a quiz elsewhere in the course
 * still draws on: Costing and Cash both also sit inside a quiz topic's concept list.
 *
 * The correct option is spread across all four positions (A x5, B x5, C x4, D x4). Keying a
 * bank predominantly to B lets a candidate read the answers off the screen without knowing
 * any of the subject.
 *
 * No figure that a notification or a revision can change is the subject of a question. The
 * arithmetic questions carry their own numbers inside the stem, so the key stays true.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 316001: finding a business worth starting ---- */
  mcq(
    316,
    1,
    "You want to know whether your village really needs the service you are planning. Which observation is the strongest evidence that the demand is already there?",
    [
      "Households in the village regularly travel to the mandal town and pay somebody there for that same service",
      "Nobody in the village runs that business at present",
      "Several friends and relatives said the idea sounds good",
      "A similar business is doing well in a district two hundred kilometres away",
    ],
    0,
    "Easy",
    "Demand",
    "Money that is already leaving the village for a service is demand you can count: you can ask how often the trip is made, what is paid and what the bus fare adds to it, and every one of those is a fact rather than an opinion. The tempting answer is that nobody is doing it, and an empty field feels like an opportunity. Absence of supply is not evidence of demand. It can equally mean somebody tried it and closed, or that the need is too thin to keep one person occupied. Look for money changing hands before you look for a gap.",
  ),
  mcq(
    316,
    2,
    "You are choosing between two ideas for a village of about two thousand people: a service each household needs once in five years, and one each household needs every month. Why is the second usually the safer choice in a market this size?",
    [
      "The second needs less capital to start",
      "The second earns a higher margin on every sale",
      "In a small market the number of households is fixed, so the enterprise lives on how often each household buys rather than on finding new customers",
      "The first faces less competition, because few people will attempt a service needed so rarely",
    ],
    2,
    "Medium",
    "Enterprises",
    "In a market you can actually count, a year's turnover is households multiplied by how often each one buys multiplied by the value of a purchase. The number of households is fixed by the map, so frequency is the only one of the three you can do anything about. A service needed once in five years has to charge a great deal, or serve twenty villages, and both of those raise the cost of reaching the customer. The tempting answer is the lack of competition, and it is real, but it is a symptom and not an opening: nobody is doing it because there is not enough of it to do. Check frequency before you check competition.",
  ),
  mcq(
    316,
    3,
    "Compared with a service enterprise started on the same capital, a small manufacturing unit differs most in which respect?",
    [
      "It needs less working capital, because there is a physical product to sell from the first day",
      "It locks a large part of the money into machinery and stock before the first sale is made",
      "It carries no risk of unsold stock, because production can be stopped at any time",
      "It earns a higher margin on every sale, which is what makes the extra capital worth putting in",
    ],
    1,
    "Medium",
    "Manufacturing",
    "Manufacturing converts your money into a machine and a pile of raw material, and neither of them returns anything until a finished item is sold. A service sells your time and skill, so the same money can stay liquid and the cash cycle is short. The tempting answer is the higher margin, and a manufactured item often does carry one, but margin is earned per unit sold while the machine instalment falls due every month whether you sold anything or not. Trading sits between the two: stock is locked, but no machine is. Choose on how long your money stays out of reach, not on which sounds more like a business.",
  ),

  /* ---- Module 316002: testing the idea on paper ---- */
  mcq(
    316,
    4,
    "You cost a jar of pickle at ₹52 by adding the mangoes, oil, spices, the jar, the label and the gas used on that batch. Your room rent, electricity and loan instalment are not in that ₹52. What have you actually calculated?",
    [
      "The full cost of a jar",
      "The variable cost of a jar, so the price minus ₹52 is what each jar contributes towards the fixed costs",
      "The break-even price of a jar",
      "The profit on a jar, once it is deducted from the selling price",
    ],
    1,
    "Medium",
    "Costing",
    "You have added only the costs that rise when you make one more jar, so ₹52 is the variable cost. Price minus ₹52 is the contribution, and it is the contribution from all the jars together that has to cover the rent, the power and the instalment before a single rupee is profit. The tempting answer is that ₹52 is the full cost of a jar, and pricing on that figure is the commonest way a small unit prices itself into a loss: every jar sells above ₹52, the owner cannot see anything wrong, and the month still closes short. The fixed costs did not go away, they were simply never in the number.",
  ),
  mcq(
    316,
    5,
    "Your fixed costs are ₹24,000 a month. Each unit sells at ₹200 and costs ₹120 in material and other costs that rise with every unit made. How many units must you sell in a month to break even?",
    ["75 units", "120 units", "200 units", "300 units"],
    3,
    "Hard",
    "Break-even",
    "What pays the fixed cost is the contribution, which is price minus variable cost, ₹200 minus ₹120, so ₹80 a unit. ₹24,000 divided by ₹80 gives 300 units. The tempting answer is 120, which comes from dividing the fixed cost by the selling price and quietly assumes the whole ₹200 of every sale is available for rent and instalment. It is not, because ₹120 of it has already gone back out on material. Test it: at 120 units you collect ₹24,000 of sales, spend ₹14,400 of that on material, and are left with ₹9,600 against a fixed cost of ₹24,000, so ₹14,400 of it is still unpaid. The other two figures come from dividing ₹24,000 by the variable cost and by the two costs added together.",
  ),
  mcq(
    316,
    6,
    "A banker reading your one page plan is looking above all for which one thing?",
    [
      "An account of how the idea came to you and why it matters to the village",
      "Evidence that the cash the enterprise generates each month will cover the instalment and still leave it running",
      "The number of people the enterprise will employ within five years",
      "An undertaking that you will not borrow from any other lender",
    ],
    1,
    "Easy",
    "Plan",
    "A loan is repaid out of the cash the business throws off month after month, so the plan is read for exactly that: monthly sales, monthly costs, what is left, and whether what is left covers the instalment with something to spare. Employment is the tempting answer, because scheme literature counts jobs created and applicants pad the figure to please it. A projection of jobs in year five does not service an instalment in month three. Put the monthly cash first and the employment follows from it, rather than the other way round.",
  ),

  /* ---- Module 316003: registration and compliance ---- */
  mcq(
    316,
    7,
    "What does Udyam registration actually give a micro enterprise?",
    [
      "A recognised MSME identity, based on self declared investment and turnover, which schemes, banks and government buyers then ask to see",
      "A sanctioned loan, released at the time of registration",
      "Permission to trade without any other licence or clearance",
      "Exemption from income tax on the enterprise's profit",
    ],
    0,
    "Easy",
    "Udyam",
    "Udyam is an online self declaration that classifies the unit by investment and turnover and issues a registration number. That number is the identity the rest of the system is keyed to: priority sector lending, the public procurement preference and the protection on delayed payments all ask for it. It is not itself a sanction of money. The tempting answer is that registering gets you the loan, because most people first hear the word at a bank counter. The bank asks for it as proof of what the unit is, and then appraises the loan separately, on your books and your cash flow, after.",
  ),
  mcq(
    316,
    8,
    "You run your unit as a sole proprietorship. It fails owing ₹4,00,000 to suppliers. What is the position of your own house and land?",
    [
      "They are protected, because the enterprise has its own Udyam registration and current account",
      "They are at risk only up to the capital you originally put into the business",
      "They are available to the creditors, because in law a proprietorship and its proprietor are the same person",
      "They are available only if a court first declares the enterprise insolvent",
    ],
    2,
    "Hard",
    "Proprietorship",
    "A proprietorship is not a separate legal person. The trade name, the Udyam number and the current account are administrative conveniences that let the business be identified; they do not put a wall between the business and you, so the liability is yours without limit. That wall is exactly what a private limited company or an LLP buys, at the price of far more filing and cost, and it is why the form of the enterprise is a decision and not a formality. The tempting answer is that registration creates the shield, because the certificate carries the enterprise's name rather than yours. It records what the enterprise is. It does not separate it from you.",
  ),
  mcq(
    316,
    9,
    "You will make and pack pickle for sale from a room at home. Which requirement applies to you specifically because the product is food?",
    [
      "An FSSAI registration or licence for the food business, whose number is printed on the label",
      "A consent to operate from the state pollution control board, which every home based unit must obtain",
      "A partnership deed, because food cannot be sold by a single proprietor",
      "A registered trade mark for the brand name, obtained before the first sale",
    ],
    0,
    "Easy",
    "Food",
    "Every food business operator, down to a petty manufacturer working out of one room, has to be on the FSSAI system, as a registration at the smallest scale and as a licence above it, and the number goes on the pack. The tempting answer is the pollution board consent, because compliance is imagined as a single queue of clearances that everyone stands in. Consent is triggered by the category of the activity, and a small non polluting food unit generally falls in the exempt or the least regulated category. Learn which rule your own act triggers: food safety by the product, legal metrology by selling in a fixed weight pack, pollution consent by what you discharge.",
  ),

  /* ---- Module 316004: money and records ---- */
  mcq(
    316,
    10,
    "Why does it matter that a household run enterprise keeps a separate account and pays the owner a fixed amount each month rather than taking cash as needed?",
    [
      "It is required by law of every micro enterprise",
      "It reduces the tax the unit has to pay",
      "It makes the bank sanction a larger loan automatically",
      "It makes the enterprise's profit visible, because household spending stops disappearing into the business cash",
    ],
    3,
    "Easy",
    "Separating",
    "When the same box pays for raw material on Monday and a wedding gift on Tuesday, a short month cannot be traced to anything, and the owner concludes the business is not working when the truth is that it was never measured. A fixed monthly drawing turns the household's needs into a known cost you can budget for, and whatever is left after it is genuinely the enterprise's profit. The tempting answer is the larger sanction, and a clean statement does help an appraisal, but nothing about a sanction is automatic. Do it because you cannot manage a number you cannot see.",
  ),
  mcq(
    316,
    11,
    "Your cash book shows ₹6,200 in hand at the close of the day. You count the box and find ₹5,900. What is the right next step?",
    [
      "Write ₹5,900 in the cash book so that the book and the box agree",
      "Leave the book as it is and square the difference at the end of the month",
      "Trace the day's receipts and payments, find the entry that was missed, and record it",
      "Treat the ₹300 as a loss and reduce your capital by that much",
    ],
    2,
    "Medium",
    "Cash",
    "A cash book earns its keep only because it can be checked against the box, and a difference is information rather than a nuisance: nine times in ten it is a payment made without an entry, or a receipt written twice, and it is findable while the day is still fresh in your memory. The tempting answer is to correct the book to match the box, which takes ten seconds and destroys the only record that could have found the error, so the same leak repeats every week unseen. Only after tracing, when nothing is found, is a shortage written up as a shortage.",
  ),
  mcq(
    316,
    12,
    "Your supplier gives you 15 days to pay. The material then sits as stock for 20 days, and the shop you supply pays you 30 days after delivery. Roughly how many days of working capital must you find from your own pocket?",
    ["15 days", "30 days", "35 days", "65 days"],
    2,
    "Hard",
    "Working",
    "Your money is locked from the day it actually leaves your hand to the day the buyer's money arrives. Stock holds it for 20 days and the buyer holds it for another 30, which is 50, but for the first 15 of those days it was the supplier's money in the material and not yours, so 15 comes off and the answer is 35 days. The tempting answer is 65, which comes from adding the supplier's credit instead of subtracting it. Fix the direction once and it stays fixed: credit you take shortens your cycle, credit you give lengthens it, which is why the credit sales you agree to are a working capital decision and not a sales decision.",
  ),

  /* ---- Module 316005: customers and selling ---- */
  mcq(
    316,
    13,
    "A competitor opens down the road and prices below what the item costs you to make. What is the sound first response?",
    [
      "Match his price at once and deal with the loss later",
      "Work out what your own unit cost actually is, then compete on what his price does not give the customer, such as delivery, freshness, a pack size he does not sell or terms of credit",
      "Cut the quality of your product until your cost falls below his price",
      "Sell below your cost for three months to drive him out, then raise the price again",
    ],
    1,
    "Medium",
    "Pricing",
    "A price below your cost is a price you cannot hold, and matching it makes every sale a loss that grows with volume, so the better your week the worse your position. Knowing your unit cost tells you the floor you must not go under, and it frees you to compete on the things a customer weighs alongside price. The tempting answer is to match, because it is what the customer asks for and the first week's sales appear to reward it. Those sales are the mechanism that empties your working capital. Cutting quality does lower the cost, but it invites the customer to compare you on price alone, which is the one ground you have just decided you cannot win on.",
  ),
  mcq(
    316,
    14,
    "A customer buys your groundnut chikki twice and finds the second piece noticeably softer and smaller than the first. Which part of the business has failed?",
    [
      "Pricing, because the second piece was not worth what was paid for it",
      "Packaging, because a stronger wrapper would have kept the piece intact",
      "Marketing, because the customer was never told what to expect from the product",
      "Process consistency, because the second purchase rests on the product being the same every time",
    ],
    3,
    "Medium",
    "Quality",
    "A repeat purchase is bought with sameness. A customer who cannot predict what he will get has to make a fresh decision every time he passes your shop, and a fresh decision is precisely where a competitor gets in. The fix is a written recipe, a weighed batch and a scale on the packing table, not a discount. Packaging is the tempting answer because the difference was noticed when the wrapper came off, and better packaging is worth having, but a wrapper protects a product and cannot make two batches the same. Fix the batch first, then let the pack carry the weight and the date so the customer can see the sameness before he buys.",
  ),
  mcq(
    316,
    15,
    "A shopkeeper offers to take ₹20,000 of goods every month if you give him 30 days to pay. Your margin is 10 per cent of the selling price. What does agreeing actually commit you to?",
    [
      "Funding one month of sales, ₹20,000, out of your own working capital for as long as the arrangement runs, in return for ₹2,000 a month of margin",
      "Nothing extra, because the money comes back every month once the cycle starts",
      "A loss of ₹20,000, since the goods have left the premises without payment",
      "Funding ₹2,000, which is the margin you have put at risk",
    ],
    0,
    "Hard",
    "Credit",
    "A rolling 30 day credit means that at every moment one month's supply is sitting with the buyer, unpaid. That ₹20,000 leaves your cycle in the first month and does not come back while the arrangement runs, so it is a permanent addition to the working capital you have to find, and what you earn for tying it up is ₹2,000 a month. That can still be a good bargain, but only if you have the ₹20,000 spare or can borrow it for less than the ₹2,000 it earns. The tempting answer is that nothing changes because a payment does arrive every month once the cycle is running. What arrives is last month's bill, while this month's goods have already gone out on credit. You fund the gap throughout.",
  ),

  /* ---- Module 316006: growing and surviving ---- */
  mcq(
    316,
    16,
    "You take on your first helper for a wage. How should that wage be treated in your books?",
    [
      "As a drawing, because it comes out of what you would otherwise have taken home",
      "As a business expense, entered in the cash book on the day it is paid, whether or not the helper is a relative",
      "It need not be recorded at all if the helper is a family member",
      "As capital, because a trained helper is an investment in the enterprise",
    ],
    1,
    "Easy",
    "Hiring",
    "Wages are a cost of running the unit and they belong in the cash book on the day they are paid, so that your unit cost and the break-even you worked out stay true after the helper joins. The tempting answer is that a family member's wage need not be entered, and that is how a great many small units persuade themselves they are profitable: the labour is real, it is simply unpaid and therefore invisible, and the day that person marries or moves away and has to be replaced by a hired hand, the profit vanishes. Record what the work costs even when the worker is your brother, and pay it out separately from household money.",
  ),
  mcq(
    316,
    17,
    "Your stock and machinery are insured against fire. A three week power failure then stops production and you lose the season's orders. What does that policy pay?",
    [
      "The sales you lost, because the stoppage was outside your control",
      "The wages you had to pay the workers through the stoppage",
      "The full sum insured, once a stoppage runs beyond a fortnight",
      "Nothing, because the policy indemnifies damage to the insured property from an insured peril, not the income lost while the unit stands idle",
    ],
    3,
    "Hard",
    "Insurance",
    "A fire and allied perils policy makes good physical loss or damage to the property named in it. Earnings lost while the unit is out of action are a different cover, business interruption or loss of profit, bought separately and normally only alongside the material damage policy. The tempting answer is that a loss outside your control must be covered, which is how insurance is read in general conversation. A policy pays against a defined peril acting on a defined subject matter, and reading those two lines before you sign is the whole of the skill. Note the second gap here too: a power failure is not fire, so even the material damage cover would not have responded.",
  ),
  mcq(
    316,
    18,
    "Your machine is busy for six hours of an eight hour working day and you are turning orders away in the festival season. What should you establish before buying a second machine?",
    [
      "Whether the two idle hours a day on the machine you already own, or a second shift on it, can absorb the extra orders first",
      "Whether the bank will sanction a loan for the second machine",
      "Whether a newer model of the machine has come on the market",
      "Whether the shed has the floor space for a second machine",
    ],
    0,
    "Hard",
    "Reinvesting",
    "Capacity you already own is the cheapest capacity there is. Two idle hours a day is a third more output at no capital cost at all, and if the shortage only appears in the festival months it may be the whole of the shortage. A second machine adds an instalment that falls due in every month of the year, including the eight months in which you are turning nobody away. The tempting answer is the sanction, because that is what the owner lies awake over, but a loan the bank will give is not the same as a loan the enterprise can repay, and the bank is appraising the projection you handed it, which is the very thing this check exists to correct.",
  ),
];

export default BANK;
