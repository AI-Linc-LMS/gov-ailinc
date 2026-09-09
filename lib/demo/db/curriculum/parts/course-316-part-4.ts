/**
 * Course 316: Start Your Rural Micro-Enterprise, part 4.
 *
 * Topics 31613 to 31616: the cash gap that sits between paying for an input and
 * being paid for the output, pricing when somebody opens a cheaper shop down the
 * road, the three selling channels a village unit actually has, and the quality
 * and packaging work that turns a first sale into a second one.
 *
 * Written for a first time owner who has finished a cost sheet and a break-even
 * and is now about to trade. Worked examples use enterprises that exist in these
 * districts, a small food unit, a tailoring unit, a millet processing unit and a
 * dairy. Every rate is illustrative: mango, oil, cloth, grain and milk rates move
 * with the season and the district, so the method is the lesson and the figures
 * are only there to make the method visible.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31613: {
    topicId: 31613,
    title: "Working capital: the cash gap nobody plans for",
    summary:
      "Working capital is the money that has to stay inside the business as raw material, as goods waiting to be sold and as amounts customers still owe you, and running out of it is the commonest way a profitable unit closes. You size it in days and in rupees for a small food unit, separate the peak from the ordinary month, and learn which levers genuinely shorten the gap.",
    concepts: [
      "Working capital requirement",
      "Operating cycle",
      "Stock holding period",
      "Receivables and supplier credit",
      "Peak working capital",
      "Cash flow forecast",
    ],
    glossary: {
      "Working capital requirement":
        "The money that must stay inside the business at all times to carry raw material, goods being made, finished stock and the amounts customers owe, after subtracting the credit your own suppliers allow you.",
      "Operating cycle":
        "The number of days between paying for an input and receiving cash for the output made from it: days of stock at every stage, plus the days customers take to pay, less the days your supplier waits for his money.",
      "Stock holding period":
        "The average number of days a rupee of material stays in your shed before it leaves as a sale. Divide the value of stock held by the value consumed in a day.",
      Receivables:
        "Goods you have delivered and not yet been paid for. In your sales register it is a sale; in your bank account it is nothing at all until the money arrives.",
      "Peak working capital":
        "The largest amount the business needs at any one point in the year, usually the week raw material is bought in season, as against the smaller amount an ordinary month needs.",
      "Cash credit limit":
        "A revolving borrowing limit sanctioned against stock and receivables, drawn and repaid as trade moves and charged on what you actually use. It is the instrument built for working capital, unlike a term loan, which is built for an asset.",
    },
    body: {
      Beginner: `<p>Working capital is the money that has to stay inside the business while you wait to be paid. It is not the money that buys the machine. It is the money sitting in the sack of raw mango, in the jars stacked in the shed, and with the shop that took your stock last month and has not settled yet.</p>
<h2>Follow one rupee through a pickle unit</h2>
<p>A small food unit in Khammam makes mango pickle. You pay the farmer for raw mango, and the mango waits in the shed until it is cut. The cut pickle cures for some days before it can be filled. The filled jars wait until a shop takes them. The shop sells them slowly and pays you at the end of the month. Every one of those waits is your own money standing still, and none of it is available to buy next week's oil.</p>
<h2>Only two things give money back to you</h2>
<ul>
<li><strong>A customer who pays at once.</strong> A jar sold at the weekly market is cash the same evening.</li>
<li><strong>A supplier who waits.</strong> If the jar merchant lets you pay after ten days, he is carrying ten days of your business for you at no charge.</li>
</ul>
<p>Everything else, the mango, the curing, the filled jars, the shopkeeper's month, has to be paid for out of your own pocket or out of a loan.</p>
<h2>Profit and cash are different things</h2>
<p>You can sell every jar you make, earn a good margin on each one, and still stand in front of the oil merchant with nothing in your hand. The profit is real. It is simply not in the bank yet, because it is lying in the shed as stock and in the shopkeeper's cash box as an unpaid bill. Owners describe this as a shortage of profit. It is a shortage of working capital, and the two are cured in completely different ways.</p>
<h2>Do the count before you open, not after</h2>
<ol>
<li>Count the days. How many days does material sit, how many days does it take to make and cure, how many days do finished goods wait, and how many days does a shop take to pay.</li>
<li>Add those days, then subtract the days your supplier allows you.</li>
<li>Work out what the unit spends in cash on an average day.</li>
<li>Multiply the two. That is the money that must be arranged before the first sale, on top of the machine.</li>
</ol>
<p>Nearly every unit that closes in its first year was profitable on paper and lost this arithmetic.</p>`,
      Intermediate: `<p>Working capital is the third of the three numbers. Unit cost tells you what a piece takes, break-even tells you how many pieces the month needs, and working capital tells you how much money has to sit inside the business while both of those happen. It is sized in two steps: count the days, then price the days.</p>
<h2>Step one, count the days</h2>
<p>Take the Khammam pickle unit, selling about 1,000 jars a month at ₹120 to shops in two mandal towns.</p>
<table>
<thead><tr><th>Stage</th><th>What is waiting</th><th>Days</th></tr></thead>
<tbody>
<tr><td>Raw material stock</td><td>Mango, oil, salt, spices, empty jars in the shed</td><td>20</td></tr>
<tr><td>Processing and curing</td><td>Cut pickle maturing before it can be filled</td><td>10</td></tr>
<tr><td>Finished stock</td><td>Filled jars waiting for a delivery run</td><td>15</td></tr>
<tr><td>Receivables</td><td>Shops paying at the end of the month</td><td>30</td></tr>
<tr><td>Less supplier credit</td><td>Jar and oil merchants waiting for their money</td><td>minus 10</td></tr>
<tr><td><strong>Operating cycle</strong></td><td></td><td><strong>65 days</strong></td></tr>
</tbody>
</table>
<h2>Step two, price the days</h2>
<p>Add every cash cost the unit incurs in a month: raw material and jars ₹72,000, hired labour ₹12,000, power and fuel ₹3,000, rent ₹4,000, transport ₹2,000, and your own wage ₹12,000. That is ₹1,05,000 a month, which is <strong>₹3,500 a day</strong>.</p>
<p>Working capital requirement is 65 days at ₹3,500, which is <strong>₹2,27,500</strong>. Read that against monthly sales of ₹1,20,000. The unit needs nearly two months of sales permanently locked inside it, and that money buys nothing you can point at.</p>
<h2>Where the money is sitting</h2>
<ul>
<li>Raw material, 20 days of ₹2,400 a day of material, about ₹48,000 in the shed.</li>
<li>Curing and finished stock, 25 days at full cash cost, about ₹87,500 of jars you cannot spend.</li>
<li>Shop receivables, 30 days of sales, about ₹1,20,000 in other people's cash boxes.</li>
<li>Less what the merchants are carrying for you, 10 days, about ₹24,000.</li>
</ul>
<p>The largest single block is the money the shops owe you, which is normal and is the reason credit terms are a working capital decision and not a courtesy.</p>
<h2>The levers, in the order they usually work</h2>
<ol>
<li><strong>Collect faster.</strong> Moving shops from thirty days to fifteen releases about ₹52,500 and costs nothing but discipline.</li>
<li><strong>Hold less raw material.</strong> Buying oil and jars fortnightly instead of monthly releases roughly ₹24,000, unless the season forces a bulk purchase.</li>
<li><strong>Ask for supplier credit in writing.</strong> Twenty days instead of ten releases another ₹35,000, and it is the cheapest money in the business.</li>
<li><strong>Sell part of the output for cash.</strong> A weekly market stall pays the same evening and shortens the average cycle across all your sales.</li>
</ol>
<h2>Put it in a cash flow forecast, not in your head</h2>
<p>Rule a sheet with a row for opening balance, receipts, payments and closing balance, and one column for each of the next twelve months. Enter the mango purchase in the month it happens, not spread evenly, and enter shop payments a month after the sale, not in the same month. The first month that shows a negative closing balance is the month you must arrange money for, and you now know about it in advance instead of on the day.</p>`,
      Advanced: `<p>The sizing arithmetic is easy. What sinks units is that working capital is not one number: it has a peak, it grows with sales, and it is routinely financed with the wrong instrument.</p>
<h2>The peak is not the average</h2>
<p>Raw mango is available for a few weeks. If the unit buys three months of mango in one purchase, that week's requirement is the ordinary ₹2,27,500 plus roughly two extra months of material, so the peak sits far above the average and lasts until the stock is worked down. Size the limit on the peak and plan to sit below it in ordinary months, because a limit sized on the average will fail in exactly the week the season demands cash. Then check the other side of the same decision: bulk buying is only a saving after you count the interest on the money locked up, the space, the losses to insects and damp, and the risk that the rate falls after you have bought.</p>
<h2>Growth consumes cash before it produces any</h2>
<p>Suppose orders rise fifty per cent. Sales go to ₹1,80,000 a month and the cycle does not change, so the requirement rises by half, about ₹1,13,750. At a profit of ₹15,000 a month, that is more than seven months of earnings needed immediately, in the month the good news arrives. This is why a unit can be destroyed by a large order. Before you accept one, work out the extra working capital it needs, ask when the buyer pays, and if the two do not fit, negotiate an advance or take part of the order rather than all of it.</p>
<h2>Financing it with the wrong instrument</h2>
<table>
<thead><tr><th>Need</th><th>Right instrument</th><th>What goes wrong when it is mismatched</th></tr></thead>
<tbody>
<tr><td>Machine, shed, vehicle</td><td>Term loan repaid over years</td><td>Bought out of the cash credit limit, the limit is now full and there is nothing left to buy material with</td></tr>
<tr><td>Stock and receivables</td><td>Cash credit or overdraft limit, revolving</td><td>Taken as a term loan, the instalment falls due whether or not the season has paid you</td></tr>
<tr><td>One seasonal purchase</td><td>A seasonal peak inside the limit, or a short loan repaid from that season</td><td>Funded from household savings, and the household has no cushion left for an illness</td></tr>
</tbody>
</table>
<p>A cash credit limit is drawn against stock and book debts, and most branches ask for a simple monthly statement of both and expect you to fund a share of them yourself. Structures differ by lender and by scheme, so ask your branch what statement they want and how often, and build the habit of sending it before it is chased.</p>
<h2>The receivable you never collect</h2>
<p>Sixty five days assumes the shop pays. A shop that quietly stops paying is not a delay, it is a loss of the whole sale plus everything you spent to make it. Watch three signals: an order placed before the last bill is cleared, part payments in round figures, and a request to hold the bill until next month. The response is not confrontation. It is to hold the next delivery until the old bill is settled, and to say so at the start of the relationship rather than in the fourth month.</p>
<h2>What separates units that survive the cycle</h2>
<ul>
<li>They know the day of the month their cash is lowest, and they do not schedule purchases into it.</li>
<li>They hold a small cushion, roughly two weeks of cash costs, outside the trading money.</li>
<li>They treat supplier credit as a facility to be protected: paying on the agreed day is what keeps it available in a bad season.</li>
<li>They review the cycle every quarter, because it lengthens quietly. Nobody announces that shops have moved from thirty days to forty five.</li>
<li>They never fund the household from the trading account without recording it, because an undated withdrawal is indistinguishable from a shortfall.</li>
</ul>`,
      Expert: `<p>Recall card for working capital. Formulas, the worked unit, the rules, then the traps.</p>
<h2>Formulas</h2>
<table>
<thead><tr><th>Quantity</th><th>How it is worked</th></tr></thead>
<tbody>
<tr><td>Stock holding period</td><td>Value of stock held, divided by value consumed per day</td></tr>
<tr><td>Receivable days</td><td>Amount owed by customers, divided by sales per day</td></tr>
<tr><td>Payable days</td><td>Amount owed to suppliers, divided by purchases per day</td></tr>
<tr><td>Operating cycle</td><td>Stock days at all stages, plus receivable days, less payable days</td></tr>
<tr><td>Working capital requirement</td><td>Operating cycle in days, multiplied by cash cost per day</td></tr>
<tr><td>Extra capital needed for growth</td><td>Percentage rise in sales, applied to the existing requirement</td></tr>
</tbody>
</table>
<h2>The worked unit, memorised</h2>
<ul>
<li>Days: 20 raw, 10 curing, 15 finished, 30 receivable, less 10 payable, giving 65.</li>
<li>Cash cost ₹1,05,000 a month, that is ₹3,500 a day. Requirement ₹2,27,500.</li>
<li>Fifteen days off the receivable releases about ₹52,500. Ten days more supplier credit releases about ₹35,000.</li>
<li>Sales up fifty per cent needs about ₹1,13,750 more, against a profit of ₹15,000 a month.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Profit is an opinion until the money arrives. Cash is the only fact.</li>
<li>Supplier credit shortens the cycle; customer credit lengthens it. Subtract one, add the other.</li>
<li>Size the limit on the peak week, run the unit below it in ordinary months.</li>
<li>Term loan for assets, cash credit for trade. A machine bought from the trading limit stops the trade.</li>
<li>Growth is funded before it is earned. A large order without an advance is a cash demand, not a windfall.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Seasonal raw material.</strong> Deliberate lengthening of the cycle. Justify it with the discount earned, net of interest and storage loss.</li>
<li><strong>Job work alongside own production.</strong> Job work carries no material and is paid at the counter, so it shortens the average cycle and is a useful cash line in a slack season.</li>
<li><strong>Advance from a buyer.</strong> Negative receivable days. Treat it as working capital you did not have to borrow, and deliver on time or you will not get it twice.</li>
<li><strong>Household drawings.</strong> Not a cost, but a real outflow. Put them in the forecast as a fixed monthly figure or the forecast is fiction.</li>
<li><strong>Festival stocking.</strong> Shops take more and pay later. Both sides of the cycle move against you at once.</li>
</ul>
<h2>Checklist before you borrow</h2>
<ol>
<li>Cycle counted stage by stage from your own records, not assumed.</li>
<li>Cash cost per day worked from the last three months.</li>
<li>Peak month identified and its extra requirement stated.</li>
<li>Twelve month cash flow forecast with the first negative month marked.</li>
<li>Instrument matched to the need, and the machine kept out of the trading limit.</li>
<li>A written credit rule for customers, and the date each shop is expected to pay.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A food unit spends ₹3,500 a day in cash and its money is out for 65 days before a sale is collected. What working capital does it need?",
        options: ["₹3,500", "₹1,05,000", "₹2,27,500", "₹1,20,000"],
        answer: 2,
        explanation:
          "Working capital is the operating cycle in days multiplied by the cash cost of a day, so 65 times ₹3,500 gives ₹2,27,500. The ₹1,05,000 option is one month of costs and is tempting because a month feels like the natural unit, but the money is out for more than two months, so a month of funding runs dry in the third week.",
        difficulty: "Easy",
        skill: "Working capital requirement",
      },
      {
        n: 2,
        question:
          "The unit persuades its jar and oil merchants to allow twenty days instead of ten. What happens to the working capital requirement?",
        options: [
          "It is unchanged, because sales and costs have not moved",
          "It falls by about ten days of cash cost, roughly ₹35,000",
          "It rises, because the unit now owes more money than before",
          "It falls only if the unit also reduces its selling price",
        ],
        answer: 1,
        explanation:
          "Supplier credit is money you are holding and using, so it funds part of the cycle and is subtracted from it; ten extra days at ₹3,500 releases about ₹35,000 of your own money. The tempting answer is that owing more must need more, but an unpaid supplier bill is finance you have been given, not cash you have to find.",
        difficulty: "Medium",
        skill: "Receivables and supplier credit",
      },
      {
        n: 3,
        question: "Which of these lengthens the operating cycle?",
        options: [
          "Taking twenty days of credit from the spice supplier instead of paying on delivery",
          "Agreeing to supply shops on forty five days credit instead of thirty",
          "Cutting the curing time by using a smaller batch",
          "Selling part of the output at the weekly market for cash",
        ],
        answer: 1,
        explanation:
          "Extending customer credit from thirty to forty five days adds fifteen days during which your money sits in somebody else's cash box, which lengthens the cycle. Taking supplier credit looks similar because both involve credit, but the direction is opposite: credit you receive shortens the cycle, credit you give lengthens it.",
        difficulty: "Medium",
        skill: "Operating cycle",
      },
      {
        n: 4,
        question:
          "The unit holds ₹48,000 of raw material in the shed and consumes material worth ₹2,400 a day. What is its stock holding period?",
        options: ["2 days", "20 days", "48 days", "30 days"],
        answer: 1,
        explanation:
          "Stock held divided by daily consumption gives ₹48,000 over ₹2,400, which is 20 days of material sitting in the shed. The 48 day answer reads the rupee figure as days, which is the usual slip; the units only work out when you divide a stock value by a daily value.",
        difficulty: "Easy",
        skill: "Stock holding period",
      },
      {
        n: 5,
        question:
          "Raw mango is available for a few weeks, so the unit buys three months of material at once. What should the working capital limit be sized on?",
        options: [
          "The average month, since the peak lasts only a short time",
          "The peak requirement in the buying season, with the unit running below the limit in ordinary months",
          "The lowest month, so that interest stays small",
          "The monthly profit, since that is what repays the borrowing",
        ],
        answer: 1,
        explanation:
          "A limit is a ceiling you may draw up to, so sizing it on the peak costs nothing in ordinary months when you draw less, while sizing it on the average guarantees a shortage in the one week that decides the year's production. Sizing on profit confuses repayment capacity with the amount of money that has to sit inside the business.",
        difficulty: "Medium",
        skill: "Peak working capital",
      },
      {
        n: 6,
        question:
          "Orders rise fifty per cent and the operating cycle is unchanged. The unit earns ₹15,000 a month in profit and currently needs ₹2,27,500 of working capital. What is the immediate effect?",
        options: [
          "Nothing, because higher sales bring in more cash than before",
          "It needs roughly ₹1,13,750 more working capital at once, which is more than seven months of profit",
          "It needs about ₹15,000 more, being one month of profit",
          "The requirement falls, because fixed costs are spread over more units",
        ],
        answer: 1,
        explanation:
          "The requirement moves with sales, so half again on ₹2,27,500 is about ₹1,13,750, and it is needed in the month the orders arrive rather than at the end of the year. The tempting answer is that growth pays for itself, but the extra material and the extra credit to shops are both paid for long before the larger sales are collected.",
        difficulty: "Hard",
        skill: "Working capital requirement",
      },
      {
        n: 7,
        question:
          "The books show a profit of ₹15,000 for the month, yet there is no money to buy next week's oil. What is the most likely explanation?",
        options: [
          "The profit figure has been calculated wrongly",
          "The profit is sitting in stock in the shed and in unpaid shop bills, which is what a cash flow forecast is meant to reveal in advance",
          "The unit is charging too little for each jar",
          "The bank has failed to credit an instalment",
        ],
        answer: 1,
        explanation:
          "A sale becomes profit in the books on the day it is made and becomes cash only when it is collected, so a profitable month can close with the money still held as stock and receivables. Assuming the price is too low is the attractive answer because it sounds like a business problem, but a price rise does not release money that is already locked in the cycle.",
        difficulty: "Medium",
        skill: "Cash flow forecast",
      },
      {
        n: 8,
        question:
          "An owner uses the sanctioned cash credit limit to buy a second filling machine. What is the consequence?",
        options: [
          "None, since the money came from the bank either way",
          "The limit is now occupied by an asset that will not turn back into cash for years, leaving nothing to buy material with",
          "The interest cost falls, because a limit is cheaper than a term loan",
          "The machine becomes the bank's security, so the limit is automatically increased",
        ],
        answer: 1,
        explanation:
          "A cash credit limit is meant to revolve with stock and collections, so locking it into a machine leaves the trading cycle unfunded and the unit short of material within weeks. The instruments are not interchangeable: a machine is a long term asset and belongs on a term loan repaid over years, which is why lenders ask what each facility is for.",
        difficulty: "Hard",
        skill: "Working capital requirement",
      },
    ],
  },
};

export default PART;
