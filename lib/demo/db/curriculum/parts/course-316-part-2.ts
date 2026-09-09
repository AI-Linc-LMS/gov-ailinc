/**
 * Course 316: Start Your Rural Micro-Enterprise, part 2.
 *
 * Topics 31605 to 31608: the arithmetic that decides whether an idea survives
 * contact with cost, the one page plan a branch actually reads, and the
 * registrations a small unit genuinely needs.
 *
 * Written for a first time owner in a mandal town who has never kept a cost
 * sheet. Every worked example uses an enterprise that exists in these districts,
 * a millet processing unit, a tailoring unit, a dairy and a small food unit, and
 * every figure in it is illustrative: rates for grain, feed, cloth and milk move
 * with the season and the district, so the method is the lesson and the numbers
 * are only there to make the method visible.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31605: {
    topicId: 31605,
    title: "Costing one unit of your product or service",
    summary:
      "Costing means finding what one packed kilogram, one stitched piece or one hour of machine time actually takes out of your pocket, counting raw material, wastage, power, labour, packing, transport and your own wage. You build a cost sheet for a millet unit, absorb the month's fixed costs into it, and see why the same product costs different amounts at different output levels.",
    concepts: [
      "Cost unit",
      "Variable cost per unit",
      "Yield loss and wastage",
      "Owner's wage",
      "Fixed cost absorption",
      "Cost sheet",
    ],
    glossary: {
      "Cost unit":
        "The single item your costing is built on, chosen as the thing a customer pays for: one packed kilogram, one stitched blouse, one litre of milk, one hour of machine time.",
      "Variable cost":
        "A cost that exists only because you made one more unit and vanishes if you make none, such as grain, pouches, piece rate labour and the power drawn while the machine runs.",
      "Fixed cost":
        "A cost the month carries whether the machine runs for twenty five days or stands idle: shed rent, the meter minimum, the phone, the amount set aside against the machine wearing out, and the wage you owe yourself.",
      Yield:
        "The finished weight you get out of a stated weight of raw material, written as a percentage. A dehulling yield of 69 per cent means 100 kg of grain leaves you 69 kg you can sell.",
      "Owner's wage":
        "A rupee figure entered in the cost sheet for your own labour, set at what you would have to pay a person to do your work, so that profit is what is left after your effort has been paid for.",
      "Cost sheet":
        "One page listing every cost that reaches a single unit, split into variable lines and a share of the fixed lines, with the output level it was worked at written on the same page.",
    },
    body: {
      Beginner: `<p>Costing means working out what one piece of what you sell actually takes out of your pocket. Not the whole month together, one piece. Until you have that number you cannot set a price with any confidence, you cannot tell profit apart from turnover, and you cannot answer the first question a bank officer will ask you.</p>
<h2>Start by naming the cost unit</h2>
<p>The <strong>cost unit</strong> is the single thing you count. For a millet processing unit it is one packed kilogram of cleaned millet. For a tailoring unit it is one stitched blouse. For a dairy it is one litre of milk. Choose the unit your customer pays for, because that is the unit your price will sit on.</p>
<h2>Write down every rupee that leaves your hand</h2>
<p>Take a sheet of paper and list, for one packed kilogram:</p>
<ul>
<li><strong>Raw material</strong>, the grain itself, at the rate you actually paid, not the rate you are hoping for.</li>
<li><strong>Wastage</strong>, because grain loses weight when the husk comes off and loses a little more in cleaning.</li>
<li><strong>Power</strong>, what the machine draws while it is running.</li>
<li><strong>Labour</strong>, what you pay a helper for the time spent on that quantity.</li>
<li><strong>Packing</strong>, the pouch, the label and the sealing.</li>
<li><strong>Transport</strong>, both the grain coming in and the packets going out.</li>
<li><strong>Your own wage</strong>, the amount you would have to pay somebody to do the work you do.</li>
</ul>
<h2>The cost almost every new owner leaves out</h2>
<p>Your own wage. You work ten hours a day in the unit and take nothing for it, so the sheet shows a profit that is really your unpaid labour written down as a gain. The month you fall ill and have to pay someone to stand at the machine, that hidden cost becomes a visible one and the profit disappears. Put a monthly figure for yourself into the sheet from the first day, even if you do not draw it in cash yet.</p>
<h2>Two kinds of cost</h2>
<p>Some costs move with every kilogram: grain, pouches, power, a helper paid by the day. These are <strong>variable costs</strong>. Others stay the same whether you run for one day or twenty five: shed rent, the phone, the minimum charge on the electricity meter, your own wage. These are <strong>fixed costs</strong>. The full cost of one kilogram is the variable cost of that kilogram plus a share of the month's fixed costs, and that share depends on how many kilograms you made.</p>
<p>This is why two owners with the same machine can have different costs. The one who puts more kilograms through the same rent carries less rent on each kilogram.</p>`,
      Intermediate: `<p>A cost sheet is one page. It has variable lines, a fixed cost share, and the output level it was worked at written across the top, because a cost per unit without an output level attached to it is meaningless.</p>
<h2>Measure your yield before you cost anything</h2>
<p>Take a millet processing unit in Wanaparthy buying foxtail millet grain and selling it cleaned, dehulled and packed in one kilogram pouches. The husk is not sold, so you never get out what you put in. Weigh one full bag in, run it, and weigh the finished grain out. If 100 kg of grain gives you 69 kg of packed millet, your <strong>yield</strong> is 69 per cent and every kilogram you sell carries 1.45 kg of raw grain behind it. Do this with your own machine and your own variety rather than accepting anyone's figure, including this one, because yield moves with variety, moisture and how well the grain was cleaned before it reached you.</p>
<h2>The variable cost of one packed kilogram</h2>
<table>
<thead><tr><th>Line</th><th>Working</th><th>Per kg</th></tr></thead>
<tbody>
<tr><td>Raw grain</td><td>1.45 kg at ₹42 per kg</td><td>₹60.90</td></tr>
<tr><td>Packing</td><td>Pouch, label and sealing</td><td>₹4.50</td></tr>
<tr><td>Power</td><td>Metered units for the run</td><td>₹2.20</td></tr>
<tr><td>Hired labour</td><td>Helper day rate spread over the day's output</td><td>₹3.80</td></tr>
<tr><td>Transport</td><td>Grain inward, packets outward</td><td>₹1.60</td></tr>
<tr><td>Rejection allowance</td><td>2 per cent of the lines above</td><td>₹1.46</td></tr>
<tr><td><strong>Variable cost per kg</strong></td><td></td><td><strong>₹74.46</strong></td></tr>
</tbody>
</table>
<h2>Now absorb the fixed costs</h2>
<p>The month costs the same whether you run or not. Shed rent ₹4,000, your own wage ₹12,000, meter minimum and phone ₹900, maintenance and spares ₹800, and ₹1,500 set aside against the day the machine has to be replaced. That is <strong>₹19,200 a month</strong>.</p>
<p>Loan repayment is deliberately not on that list. The interest part of an instalment is a cost and belongs there, so add your own figure from your sanction letter. The principal part is cash you must find every month, but it is not a cost of making a kilogram, and counting the whole instalment as a cost will make your product look dearer than it is.</p>
<p>At a planned output of 1,200 kg a month, ₹19,200 divided by 1,200 is <strong>₹16.00 per kg</strong>. Total cost is ₹74.46 plus ₹16.00, that is <strong>₹90.46 per packed kilogram</strong>.</p>
<h2>The number moves when volume moves</h2>
<p>Sell only 800 kg and the same ₹19,200 becomes ₹24.00 a kilogram, so total cost rises to ₹98.46. Nothing about the product changed. This is why you write the output level on the sheet, and why a slack season is a costing problem before it is a sales problem.</p>
<h2>Costing a service instead of a product</h2>
<p>If the same unit also cleans and dehulls grain that customers bring in, there is no raw material line at all and the cost unit becomes an hour of machine and operator time. Twenty five days at six usable hours is 150 hours, so fixed cost is ₹128 an hour. Power, the helper and a wear allowance come to ₹79 an hour, giving ₹207 an hour. If a quintal of job work takes forty minutes, it costs you ₹138, and any milling charge below that is a loss you have volunteered for.</p>`,
      Advanced: `<p>Most first cost sheets are not wrong in arithmetic. They are wrong in what was allowed onto the page, and every omission points the same way, towards a cost that looks lower than it is.</p>
<h2>The six omissions that flatter a sheet</h2>
<ol>
<li><strong>Family labour counted as free.</strong> Two people from the household work four hours a day each and no line appears. Cost them at the rate you would pay an outsider. The day one of them takes a job in town, that cost arrives in cash and your margin was never real.</li>
<li><strong>Yield taken from the machine brochure.</strong> A supplier's dehulling figure is measured on clean, dry, graded grain. Your grain came off a farm in Mahbubnagar with stones and moisture in it. Two percentage points of yield on a ₹42 raw material is roughly ₹1.80 a kilogram, which is more than your whole packing cost.</li>
<li><strong>Depreciation dropped because there is a loan.</strong> The loan will end in five years and the machine will still be wearing out. Set aside for replacement from the first month and treat the loan separately.</li>
<li><strong>Interest treated as invisible.</strong> Working capital borrowed to hold stock has a cost even when the goods eventually sell.</li>
<li><strong>Stock and credit treated as costless.</strong> Grain sitting in the shed and money sitting with a shopkeeper are both your capital, unavailable and at risk of loss or default.</li>
<li><strong>GST assumed to be somebody else's problem.</strong> If you are not registered you cannot take credit for tax paid on pouches, machinery or transport, so that tax is a genuine cost inside your sheet. If you are registered it is not. The same purchase therefore costs two different amounts depending on your registration status, which is a costing decision before it is a compliance one.</li>
</ol>
<h2>Margin and mark up are not the same number</h2>
<p>Cost is ₹90.46. Add twenty per cent on cost and you get ₹108.55, which sounds like a twenty per cent margin and is not: the profit of ₹18.09 on a selling price of ₹108.55 is 16.7 per cent. To earn a twenty per cent margin you divide by 0.80 and price at ₹113.08. Owners who mark up when they meant to margin lose about three points on every sale, permanently, and never see it because both numbers begin with twenty.</p>
<h2>When to recost</h2>
<ul>
<li>Whenever raw material moves more than about five per cent, because on this product raw material is four fifths of variable cost.</li>
<li>At the start and end of the season, because volume changes the fixed cost share more than any negotiation with a supplier will.</li>
<li>When you add a machine or a person, before you buy or hire, not after.</li>
<li>When you change the pack size. A 500 g pouch does not cost half of a 1 kg pouch, because pouch, label, sealing and handling barely change, so the small pack carries roughly twice the packing cost per kilogram.</li>
</ul>
<h2>What a wrong sheet does downstream</h2>
<p>A cost sheet that omits your wage produces a break-even that is far too easy, a price that undercuts the market for the wrong reason, and a projection in a loan file that the appraising officer can pull apart in a minute. Branch officers see hundreds of these. A sheet with a realistic yield, a stated output level and an owner's wage on it is unusual enough to be believed, and it is the same sheet you will use to defend a price when a competitor opens down the road.</p>`,
      Expert: `<p>Recall sheet for unit costing. The template first, then the rules, then the traps worth carrying into an appraisal meeting.</p>
<h2>Cost sheet template</h2>
<table>
<thead><tr><th>Block</th><th>Lines</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td>Direct material</td><td>Raw material at landed rate, grossed up for yield loss</td><td>Variable</td></tr>
<tr><td>Direct labour</td><td>Piece rate, day rate spread over that day's output</td><td>Variable</td></tr>
<tr><td>Direct expenses</td><td>Power on run, consumables, packing, inward and outward freight</td><td>Variable</td></tr>
<tr><td>Rejection</td><td>Percentage allowance on the three blocks above</td><td>Variable</td></tr>
<tr><td>Fixed overhead</td><td>Rent, meter minimum, phone, maintenance, depreciation, insurance, owner's wage, interest</td><td>Fixed, absorbed at planned output</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Cost per unit equals variable cost per unit plus fixed cost divided by output. A cost per unit quoted without its output level is not a number.</li>
<li>Gross up for yield, never scale down. One kilogram sold at 69 per cent yield carries 1.45 kg of raw material.</li>
<li>Your own wage is a cost. Profit is what remains after it.</li>
<li>Interest is a cost, loan principal is cash. Depreciation is a cost, and it does not stop when the loan does.</li>
<li>Margin is on selling price, mark up is on cost. Divide by one minus the margin to price.</li>
</ul>
<h2>Quick arithmetic to hold</h2>
<ul>
<li>Yield 69 per cent means multiply raw material rate by 1.45.</li>
<li>Fixed ₹19,200 at 1,200 units is ₹16 a unit; at 800 units it is ₹24. Halve the volume, and the fixed share doubles.</li>
<li>To price at a twenty per cent margin, divide cost by 0.8. At twenty five per cent, divide by 0.75.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Joint products.</strong> Husk and broken grain have a value. Deduct what you actually receive for them from the material cost rather than pretending they are free, and do not book a value for anything you cannot sell.</li>
<li><strong>Job work alongside own production.</strong> The two share the same machine hours. Absorb fixed cost on total hours used, not on the packed kilograms alone, or job work will look free.</li>
<li><strong>Seasonal shutdown.</strong> Rent and interest run through the closed months. Spread annual fixed cost over the months you actually operate, not over twelve.</li>
<li><strong>Bulk buying.</strong> A cheaper rate for a full truck of grain is a saving only after you count the money locked in the shed and the loss to insects.</li>
</ul>
<h2>Before you leave the sheet</h2>
<ol>
<li>Output level written on the page.</li>
<li>Yield measured on your own machine, dated.</li>
<li>Owner's wage present and not zero.</li>
<li>Rejection allowance present.</li>
<li>Depreciation present, separate from the loan.</li>
<li>Every rate traceable to a bill or a written quotation.</li>
</ol>`,
    },
  },

  31606: {
    topicId: 31606,
    title: "Break-even: how many units pay your fixed costs",
    summary:
      "Break-even is the number of pieces at which the money each sale leaves behind has finally paid the whole month's fixed costs, so the unit is neither losing nor earning. You work it for a tailoring unit, convert it into a daily target and a rupee figure, and check it against what the unit can physically produce.",
    concepts: [
      "Contribution per unit",
      "Fixed cost",
      "Break-even quantity",
      "Contribution ratio",
      "Margin of safety",
      "Capacity check",
    ],
    glossary: {
      "Contribution per unit":
        "What one sale leaves behind after its own variable costs are paid, that is selling price minus variable cost per unit. It is the money available to pay fixed costs, and it turns into profit only once they are fully paid.",
      "Fixed cost":
        "The costs a month carries whether you stitch one piece or four hundred: rent, the meter minimum, insurance, interest, the amount set aside against machines wearing out, and the wage you owe yourself.",
      "Break-even quantity":
        "The number of units at which total contribution exactly equals fixed cost, so the month closes with neither profit nor loss.",
      "Contribution ratio":
        "Contribution written as a share of selling price. Divide fixed cost by it and break-even comes out as a rupee sales figure instead of a count of pieces.",
      "Margin of safety":
        "The gap between the sales you expect and break-even sales, in units or as a percentage. It is how far demand can fall before the unit begins to lose money.",
      "Practical capacity":
        "What the unit can actually produce in a month with the machines, hours and people it has, after allowing for maintenance, holidays and a normal rate of rejects.",
    },
    body: {
      Beginner: `<p>Break-even is one question with one number for an answer. How many pieces must you sell this month before the unit stops losing money.</p>
<h2>Two kinds of cost, once more</h2>
<p>Some costs arrive only when you make something. Thread, buttons, the plastic bag, the power the machine draws, the piece rate you pay a helper. These move up and down with the number of pieces, so they are <strong>variable</strong>. Other costs arrive whether or not the shop opens. Rent, the minimum on the electricity meter, servicing, your own wage. These are <strong>fixed</strong>, and they are the ones break-even is about.</p>
<h2>What each sale leaves behind</h2>
<p>Take a tailoring unit in Siddipet stitching school uniform shirts. The school brings the cloth and pays you ₹120 a shirt. Thread, buttons and packing come to ₹18, power to ₹4, and the helper is paid ₹35 a shirt. So ₹57 of every ₹120 leaves again immediately.</p>
<p>What stays is ₹120 minus ₹57, which is <strong>₹63</strong>. That is the <strong>contribution</strong> of one shirt. It is not profit. It is the money that shirt hands you towards the rent and the rest of the month's fixed costs.</p>
<h2>Counting up to the fixed costs</h2>
<p>Add the fixed costs of the month: rent ₹3,500, your own wage ₹10,000, ₹600 set aside against the machines wearing out, ₹320 interest on the machine loan, ₹400 for the meter minimum and phone, ₹300 for servicing. That is <strong>₹15,120</strong>.</p>
<p>Now the arithmetic is simple. Each shirt brings ₹63 towards ₹15,120, so you need ₹15,120 divided by ₹63, which is <strong>240 shirts</strong>. Sell 240 in a month and you have exactly covered everything, including your own wage, and earned nothing more. Shirt number 241 puts ₹63 of profit in your hand, and so does every shirt after it.</p>
<h2>Turn it into something you can see daily</h2>
<p>Two hundred and forty shirts across twenty five working days is about ten shirts a day. That is a target you can check at six in the evening, which a monthly figure is not. Write it on the wall of the shop and count against it.</p>
<h2>One warning</h2>
<p>If you leave your own ₹10,000 out of the fixed costs, the sum says 82 shirts and the unit looks easy. It is not easier; you have simply agreed to work a month for nothing. Keep your wage in.</p>`,
      Intermediate: `<p>Break-even is the second of the three numbers that decide whether an idea survives. Unit cost tells you what a piece takes. Break-even tells you how many pieces the month needs. The third, working capital, tells you how much cash has to sit in the business while all this happens.</p>
<h2>The formula and the tailoring unit it is worked on</h2>
<p>Break-even quantity equals fixed cost divided by contribution per unit. For the Siddipet unit stitching school shirts at ₹120 a piece:</p>
<table>
<thead><tr><th>Item</th><th>Working</th><th>Amount</th></tr></thead>
<tbody>
<tr><td>Selling price</td><td>Stitching charge, cloth supplied by the school</td><td>₹120</td></tr>
<tr><td>Variable cost</td><td>Trims and packing ₹18, power ₹4, piece rate ₹35</td><td>₹57</td></tr>
<tr><td>Contribution</td><td>₹120 less ₹57</td><td>₹63</td></tr>
<tr><td>Fixed cost for the month</td><td>Rent ₹3,500, owner's wage ₹10,000, depreciation ₹600, interest ₹320, meter and phone ₹400, servicing ₹300</td><td>₹15,120</td></tr>
<tr><td><strong>Break-even quantity</strong></td><td>₹15,120 divided by ₹63</td><td><strong>240 shirts</strong></td></tr>
</tbody>
</table>
<h2>The same answer in rupees</h2>
<p>Contribution as a share of price is 63 divided by 120, that is 0.525, the <strong>contribution ratio</strong>. Fixed cost divided by that ratio gives ₹28,800 of sales, which is the same answer read differently, since 240 shirts at ₹120 is ₹28,800. Use the rupee version when you sell several items at different prices and counting pieces stops being meaningful.</p>
<h2>Check it against what you can actually make</h2>
<p>A break-even number is only useful next to <strong>practical capacity</strong>. Two machines, yourself and one helper, sixteen shirts on a good day, twenty five days, is 400 shirts a month. Break-even is 240, so the unit reaches profit at sixty per cent of what it can produce. The gap of 160 shirts is your <strong>margin of safety</strong>, forty per cent of capacity, and it is the answer to the question a banker will ask, which is what happens when orders fall.</p>
<h2>Move each input and watch the number</h2>
<ul>
<li><strong>Price falls ₹10</strong> to ₹110. Contribution becomes ₹53 and break-even rises to 286 shirts. A price cut of eight per cent raised the target by nineteen per cent, because the cut comes entirely out of contribution.</li>
<li><strong>Variable cost falls ₹5</strong> through buying trims by the box. Contribution becomes ₹68 and break-even falls to 223.</li>
<li><strong>Rent rises ₹1,000.</strong> Break-even rises to 256 shirts, that is sixteen extra shirts every month for as long as you hold the shed.</li>
</ul>
<h2>How to use it on an ordinary day</h2>
<p>Convert it into a daily count and a running total. Ten shirts a day covers the month. Keep a tally on the wall and mark the day you crossed 240, because after that day every piece is worth ₹63 to you and it is worth staying open for. Owners who track only monthly turnover cannot tell a good month from a busy one.</p>`,
      Advanced: `<p>The formula is easy and the assumptions inside it are where units get hurt. Break-even assumes one product, one price, fixed costs that stay flat, and a sale that turns into cash. A real unit breaks all four.</p>
<h2>Several products, so use a weighted contribution</h2>
<p>The same tailoring unit also stitches school trousers at ₹190 with a variable cost of ₹105, contributing ₹85. Orders run at roughly three shirts to one trouser. Average contribution per piece is three lots of ₹63 plus one of ₹85, divided by four, which is ₹68.50. Break-even is ₹15,120 divided by ₹68.50, about 221 pieces, made up of roughly 166 shirts and 55 trousers. Note what this means: the break-even count is only valid while the mix holds. Win a large shirt-only order and your piece count target quietly rises again.</p>
<h2>Fixed costs move in steps, not on a slope</h2>
<p>To stitch more than 400 shirts you need a bigger shed. Rent goes from ₹3,500 to ₹6,500 and fixed cost becomes ₹18,120, so break-even jumps from 240 to 288. Capacity rose to 600, but the first 48 shirts of the increase belong to the landlord. Every expansion decision looks like this: a step up in fixed cost, an immediate rise in break-even, and a promise of volume that has not arrived yet. Take the step only when your order book already exceeds the new break-even, not when you hope it will.</p>
<h2>Profit break-even and cash break-even are different</h2>
<p>Depreciation of ₹600 is a cost but no money leaves. Loan principal of ₹1,880 a month is not a cost but the money certainly leaves. For cash, take ₹15,120, remove ₹600, add ₹1,880, giving ₹16,400, and divide by ₹63 to get 261 shirts. So the unit stops making a book loss at 240 and stops running the bank balance down at 261. Between those two numbers you are profitable and still short of cash, which is exactly the position in which new owners borrow again and cannot explain why.</p>
<h2>Credit sales postpone break-even without changing it</h2>
<p>Break-even is calculated on sales, and a sale to a school that pays in ninety days is a sale. You can cross 240 shirts in the fourth week and still be unable to pay rent, because the contribution is sitting in the school's accounts department. Track a second line beside the tally, which is pieces delivered against payment received.</p>
<h2>Where the number is misused</h2>
<ul>
<li><strong>Cutting price to raise volume.</strong> With a contribution ratio of 0.525, a ten per cent price cut needs about a twenty three per cent rise in volume just to stand still. Work the sum before agreeing to a discount for a bulk order.</li>
<li><strong>Excluding the owner's wage.</strong> Break-even falls to 82 shirts, the plan looks comfortable, and the loan file is built on a promise the unit cannot keep.</li>
<li><strong>Ignoring seasonality.</strong> Uniform orders cluster before the school year. Work break-even for the year, then set month by month targets against the order pattern rather than dividing the annual figure by twelve.</li>
<li><strong>Break-even above capacity.</strong> If the sum needs 620 shirts and the unit can make 400, no amount of effort saves it. Change price, variable cost, fixed cost or capacity, and if none of them will move, do not borrow for this plan.</li>
</ul>`,
      Expert: `<p>Recall sheet for break-even. Formulas, then the numbers from the worked unit, then what to check before quoting the figure to anyone.</p>
<h2>Formulas</h2>
<table>
<thead><tr><th>Quantity</th><th>Formula</th></tr></thead>
<tbody>
<tr><td>Contribution per unit</td><td>Selling price minus variable cost per unit</td></tr>
<tr><td>Contribution ratio</td><td>Contribution divided by selling price</td></tr>
<tr><td>Break-even in units</td><td>Fixed cost divided by contribution per unit</td></tr>
<tr><td>Break-even in rupees</td><td>Fixed cost divided by contribution ratio</td></tr>
<tr><td>Units for a target profit</td><td>Fixed cost plus target profit, divided by contribution</td></tr>
<tr><td>Margin of safety</td><td>Expected sales minus break-even sales, over expected sales</td></tr>
<tr><td>Cash break-even</td><td>Fixed cost, less depreciation, plus loan principal, over contribution</td></tr>
</tbody>
</table>
<h2>The worked unit, memorised</h2>
<ul>
<li>Price ₹120, variable ₹57, contribution ₹63, ratio 0.525.</li>
<li>Fixed ₹15,120. Break-even 240 shirts, ₹28,800, about ten shirts a day over twenty five days.</li>
<li>Capacity 400. Margin of safety 160 shirts, forty per cent.</li>
<li>Cash break-even 261 shirts. Owner's wage removed, a misleading 82.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Divide by contribution, never by price. Dividing ₹15,120 by ₹120 gives 126 and is the single commonest error in this arithmetic.</li>
<li>A break-even quoted without the capacity beside it means nothing.</li>
<li>Fixed costs step, they do not slope. Every step raises break-even the day it is taken.</li>
<li>Profit break-even is not cash break-even. Depreciation out, loan principal in.</li>
<li>Mixed products need a weighted contribution, and the answer expires when the mix changes.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Job work and own production together.</strong> Two contributions and two capacities share one set of fixed costs. Absorb on machine hours and check that the combined plan fits the hours available.</li>
<li><strong>Piece rate against monthly wages.</strong> A helper on piece rate is variable and lowers contribution. The same helper on a monthly wage is fixed and raises break-even but leaves contribution higher, which is better once volume is steady.</li>
<li><strong>Discount request.</strong> Required volume rise equals the price cut divided by the new contribution. Do the sum in front of the buyer.</li>
</ul>
<h2>Checklist before you quote the number</h2>
<ol>
<li>Owner's wage inside fixed cost.</li>
<li>Depreciation inside fixed cost, loan principal outside it.</li>
<li>Contribution worked from a measured variable cost, not an estimate.</li>
<li>Break-even compared with practical capacity, and the margin of safety stated.</li>
<li>A cash break-even worked alongside the profit one.</li>
<li>The mix assumption written down beside the answer.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A school shirt is stitched for ₹120. Trims and packing cost ₹18, power ₹4 and the helper is paid ₹35 a piece. What is the contribution per shirt?",
        options: ["₹120", "₹63", "₹57", "₹27"],
        answer: 1,
        explanation:
          "Contribution is selling price minus variable cost, that is ₹120 less the ₹57 of trims, power and piece rate, which leaves ₹63. The tempting answer is ₹57, which is the variable cost itself; that is the money leaving, not the money the shirt hands you towards rent and the rest of the fixed costs.",
        difficulty: "Easy",
        skill: "Contribution per unit",
      },
      {
        n: 2,
        question:
          "Fixed costs for the month are ₹15,120 and each shirt contributes ₹63. What is the break-even quantity?",
        options: ["126 shirts", "240 shirts", "268 shirts", "320 shirts"],
        answer: 1,
        explanation:
          "Break-even is fixed cost divided by contribution, so ₹15,120 divided by ₹63 gives 240 shirts. The 126 comes from dividing by the ₹120 selling price instead, which silently assumes a shirt costs nothing to make and is the commonest mistake in this calculation.",
        difficulty: "Easy",
        skill: "Break-even quantity",
      },
      {
        n: 3,
        question:
          "The owner leaves her own ₹10,000 wage out of the ₹15,120 of fixed costs. What does break-even become, and what does that mean?",
        options: [
          "It stays 240 shirts, since an owner is not an employee",
          "It rises to about 400 shirts, since unpaid work is inefficient",
          "It falls to about 82 shirts, and the unit now looks viable only because a real cost has been hidden",
          "It cannot be worked out until she starts drawing a salary",
        ],
        answer: 2,
        explanation:
          "Fixed cost drops to ₹5,120, and ₹5,120 divided by ₹63 is about 82 shirts, so the plan looks far easier than it is. The tempting answer is that it stays at 240 because no salary is drawn, but the work is being done and would have to be paid for the moment the owner falls ill or takes other work.",
        difficulty: "Medium",
        skill: "Fixed cost",
      },
      {
        n: 4,
        question:
          "Contribution is ₹63 on a price of ₹120 and fixed costs are ₹15,120. What is break-even expressed in rupees of sales?",
        options: ["₹15,120", "₹24,000", "₹28,800", "₹57,600"],
        answer: 2,
        explanation:
          "The contribution ratio is 63 divided by 120, that is 0.525, and ₹15,120 divided by 0.525 gives ₹28,800, which agrees with 240 shirts at ₹120. Answering ₹15,120 mistakes the fixed cost for the sales needed to cover it, and ignores that more than half of every rupee of sales leaves again as variable cost.",
        difficulty: "Medium",
        skill: "Contribution ratio",
      },
      {
        n: 5,
        question:
          "The unit can stitch 400 shirts a month at full stretch and breaks even at 240. What is the margin of safety?",
        options: [
          "160 shirts, which is forty per cent of capacity",
          "240 shirts, which is sixty per cent of capacity",
          "400 shirts, because that is the maximum output",
          "40 shirts, which is ten per cent of capacity",
        ],
        answer: 0,
        explanation:
          "Margin of safety is the gap between achievable sales and break-even sales, so 400 less 240 is 160 shirts, and 160 over 400 is forty per cent. The 240 figure is the break-even itself, which is the point of danger rather than the distance from it.",
        difficulty: "Medium",
        skill: "Margin of safety",
      },
      {
        n: 6,
        question:
          "A school asks for the rate to be cut from ₹120 to ₹110. Variable cost stays ₹57 and fixed cost stays ₹15,120. What happens to break-even?",
        options: [
          "It stays at 240 shirts, since costs have not changed",
          "It rises to about 286 shirts",
          "It falls to about 214 shirts",
          "It falls to about 137 shirts",
        ],
        answer: 1,
        explanation:
          "The whole ₹10 comes out of contribution, which falls to ₹53, so ₹15,120 divided by ₹53 is about 286 shirts. Thinking the target is unchanged because costs did not move misses that break-even depends on contribution, and an eight per cent price cut has raised the monthly target by roughly nineteen per cent.",
        difficulty: "Hard",
        skill: "Break-even quantity",
      },
      {
        n: 7,
        question: "Which of these is a fixed cost for this tailoring unit?",
        options: [
          "The buttons and thread used on each shirt",
          "The ₹35 piece rate paid to the helper for every shirt stitched",
          "The monthly rent of the shed",
          "The power drawn by the machine while it is stitching",
        ],
        answer: 2,
        explanation:
          "Rent is payable in full whether the unit stitches four hundred shirts or none, which is exactly what makes a cost fixed. The piece rate is the attractive wrong answer because it is paid to a person every month, but it is incurred only when a shirt is stitched, so it moves with output and is variable.",
        difficulty: "Easy",
        skill: "Fixed cost",
      },
      {
        n: 8,
        question:
          "A plan works out to a break-even of 620 pieces a month while the unit at full stretch can produce 400. What should you conclude?",
        options: [
          "Proceed and review after six months, since break-even is only an estimate",
          "Work Sundays as well, so that capacity rises to meet the number",
          "The plan cannot pay for itself at any achievable output, so price, variable cost, fixed cost or capacity must change before you borrow",
          "Remove the owner's wage so that the break-even falls below 400",
        ],
        answer: 2,
        explanation:
          "Break-even above practical capacity means every reachable output level loses money, so one of the four inputs has to change before the plan is financed. Removing the owner's wage is the tempting fix because it makes the arithmetic land under 400, but it changes only the sheet, not the unit, and hands the lender a projection that cannot be met.",
        difficulty: "Hard",
        skill: "Capacity check",
      },
    ],
  },

  31607: {
    topicId: 31607,
    title: "A one page plan you can show a banker",
    summary:
      "A branch officer decides on your file in a few minutes, so the plan has to state the project cost, where the money comes from, what the unit earns in a month and how the instalment will be paid, all on one sheet. You build that sheet for a six animal dairy and learn which claim on it has to be backed by an annexure.",
    concepts: [
      "One page plan",
      "Project cost",
      "Means of finance",
      "Monthly cash surplus",
      "Repayment capacity",
      "Annexures and evidence",
    ],
    glossary: {
      "Project cost":
        "The full amount the unit needs before it can run properly, counting fixed assets, one time charges such as insurance and registration, and the working capital that carries it until receipts begin.",
      "Means of finance":
        "The other half of the project cost statement, showing where every rupee of it comes from: your own contribution, group savings, the bank loan and any scheme assistance.",
      "Promoter contribution":
        "The share of the project cost you put in yourself, in cash or in an asset you already own. It shows the lender you carry risk beside them, and the share expected differs by scheme, by lender and by branch.",
      Moratorium:
        "A stated stretch at the start of a loan during which you pay interest only, or nothing at all, meant to cover the months before the unit earns. It postpones the burden, it does not remove it.",
      "Repayment capacity":
        "The unit's monthly cash surplus set against the monthly instalment. A lender wants the surplus to cover the instalment with room left in a poor month, not to match it exactly.",
      Annexure:
        "A document attached behind the plan that turns a claim into evidence: a quotation, a rate card, a training certificate, a bank statement, a shed or land paper.",
    },
    body: {
      Beginner: `<p>A one page plan is not a story about your ambition. It is a sheet of paper that answers four questions in the order a bank officer asks them. What are you making. What will it cost to set up. Where is that money coming from. How will the instalment be paid every month.</p>
<h2>Why one page</h2>
<p>A branch handles many files. Yours will be read quickly the first time, and the officer is looking for the numbers, not the sentences. If the four answers are on one sheet and the proof is attached behind it, your file moves. If they are buried in eight pages of description, it waits.</p>
<h2>The eight blocks</h2>
<ol>
<li><strong>You and the unit.</strong> Your name, village and mandal, what you have done before, any training you have completed, and what the unit will do.</li>
<li><strong>The market.</strong> Who will buy, how much, and at what rate. Name the buyer if you have one.</li>
<li><strong>Project cost.</strong> Everything you must spend before the unit runs properly, listed item by item.</li>
<li><strong>Means of finance.</strong> Your own money, group savings, and the loan you are asking for. This must add up to exactly the project cost.</li>
<li><strong>Cost and margin on one unit.</strong> What one litre or one kilogram costs you and what you sell it for.</li>
<li><strong>The month.</strong> Money coming in, money going out, and what is left.</li>
<li><strong>Repayment.</strong> The instalment you can pay and how the leftover covers it.</li>
<li><strong>Papers attached.</strong> A list of what is behind the sheet.</li>
</ol>
<h2>The three habits that make it believable</h2>
<ul>
<li><strong>Every rate comes from somewhere.</strong> Not what you heard in the market, but a written quotation, a rate card or a bill. Attach it.</li>
<li><strong>Your own wage is in the sheet.</strong> A plan that pays everybody except you is not a plan a bank believes.</li>
<li><strong>Nothing is rounded upwards.</strong> If you are unsure of the milk rate, take the lower one. A plan that still works on cautious numbers is far stronger than one that works only on good ones.</li>
</ul>
<h2>Write it by hand if you must</h2>
<p>A neat handwritten sheet with correct arithmetic is worth more than a printed one whose totals do not agree. Before you take it to the branch, add every column twice and check that the project cost and the means of finance come to the same figure. A file whose two totals differ is the easiest one in the pile to set aside.</p>`,
      Intermediate: `<p>Work the sheet for a six animal dairy in Nizamabad, selling milk to a village collection centre. Replace every rate below with your own written quotation, since animal, feed and milk rates move with the season and the district.</p>
<h2>Block 3, project cost</h2>
<table>
<thead><tr><th>Item</th><th>Working</th><th>Amount</th></tr></thead>
<tbody>
<tr><td>Six graded buffaloes</td><td>At ₹75,000 each</td><td>₹4,50,000</td></tr>
<tr><td>Shed extension and flooring</td><td>Mason quotation</td><td>₹1,20,000</td></tr>
<tr><td>Chaff cutter and utensils</td><td>Dealer quotation</td><td>₹50,000</td></tr>
<tr><td>Cattle insurance, first year</td><td>Cover on all six animals</td><td>₹18,000</td></tr>
<tr><td>Working capital</td><td>Two months of feed before receipts settle</td><td>₹54,000</td></tr>
<tr><td><strong>Total project cost</strong></td><td></td><td><strong>₹6,92,000</strong></td></tr>
</tbody>
</table>
<h2>Block 4, means of finance</h2>
<p>Promoter contribution ₹1,04,000 from savings and the group corpus, and a bank term loan of ₹5,88,000. The two add to ₹6,92,000, which is the project cost exactly. Ask at the branch what share of the cost they expect you to bring, because it differs by scheme and by lender, and build the sheet around the answer rather than guessing.</p>
<h2>Block 6, the month</h2>
<table>
<thead><tr><th>Line</th><th>Working</th><th>Amount</th></tr></thead>
<tbody>
<tr><td>Milk sold</td><td>30 litres a day at ₹52, averaged across dry periods</td><td>₹46,800</td></tr>
<tr><td>Manure sold</td><td>Local rate</td><td>₹1,500</td></tr>
<tr><td>Feed and fodder</td><td>₹150 per animal a day for six animals</td><td>₹27,000</td></tr>
<tr><td>Veterinary, medicine, breeding</td><td>Monthly average</td><td>₹1,200</td></tr>
<tr><td>Electricity, water, milk transport</td><td></td><td>₹1,800</td></tr>
<tr><td>Owner's wage</td><td>Your own labour, priced</td><td>₹9,000</td></tr>
<tr><td><strong>Surplus before instalment</strong></td><td>₹48,300 in, ₹39,000 out</td><td><strong>₹9,300</strong></td></tr>
</tbody>
</table>
<h2>Block 7, repayment</h2>
<p>An instalment of ₹7,000 against a surplus of ₹9,300 is a cover of about 1.3 times. That is the number the officer is actually looking for, and it has to hold in an ordinary month, not a good one. Ask for a <strong>moratorium</strong> covering the weeks between purchase and the animals reaching full yield, and say in the sheet why you are asking, because a repayment that starts before the milk does is a default you have arranged in advance.</p>
<h2>Averages, not best months</h2>
<p>Six animals do not all give milk at once. Some are dry, some are freshly calved, and yield falls through the lactation. The 30 litres a day above is a year round average, not the best day. If you write the peak figure into the plan, the first quiet month makes your projection look dishonest even though your unit is running normally.</p>
<h2>Block 8, what goes behind the sheet</h2>
<ul>
<li>Quotations for animals, shed work and equipment.</li>
<li>Proof of the buyer: a collection centre membership card, a rate card or a letter.</li>
<li>Bank statement for the last six months, showing the promoter contribution actually exists.</li>
<li>Identity and address proof, and land or shed papers, or the rent agreement.</li>
<li>Training certificate, if you have completed a dairy or entrepreneurship course.</li>
</ul>`,
      Advanced: `<p>The plan is read in a particular order and fails for a small number of repeatable reasons. Understanding the reading order is most of the work.</p>
<h2>How the file is actually read</h2>
<ol>
<li><strong>Identity and record first.</strong> Who you are, and whether there is an overdue or a written off account against your name or against a group you stood surety in. This is checked before anybody reads your projections, and it is the reason a technically good plan is sometimes rejected in minutes.</li>
<li><strong>Then the totals.</strong> Does project cost equal means of finance. Is the promoter contribution real and visible in a bank account rather than promised.</li>
<li><strong>Then repayment capacity.</strong> Surplus against instalment, with a margin.</li>
<li><strong>Then the market claim.</strong> Is there a named buyer, and does the quantity in the market block match the quantity in the cash block.</li>
<li><strong>Only then the detail.</strong> Rates, quotations and annexures, checked against the numbers already read.</li>
</ol>
<h2>The eight reasons applications fail</h2>
<ul>
<li><strong>The totals do not tie.</strong> Project cost of ₹6,92,000 against a means of finance that adds to ₹6,80,000. It is arithmetic, and it reads as carelessness with money.</li>
<li><strong>Promoter contribution exists only in words.</strong> Nothing in the bank statement, no group savings record, no asset already bought.</li>
<li><strong>No evidence of demand.</strong> A market block that says milk sells well in the village and names nobody.</li>
<li><strong>Projections that are too good.</strong> Peak yield taken as average, no dry period, no mortality, no maintenance. An officer who has appraised dairy files knows the normal range and the file loses credibility at once.</li>
<li><strong>Household and business money mixed.</strong> A single account through which school fees, farm income and unit purchases all move gives the officer nothing to appraise.</li>
<li><strong>Repayment matched exactly to surplus.</strong> ₹9,300 of surplus against a ₹9,300 instalment leaves nothing for a sick animal, so it reads as a plan with no margin.</li>
<li><strong>Wrong product asked for.</strong> Asking for a term loan when the need is working capital, or the reverse, tells the officer you have not separated the two.</li>
<li><strong>Missing basic papers.</strong> Identity, address, the shed document, the quotation. Files with gaps are returned rather than refused, and returned files often never come back.</li>
</ul>
<h2>Consistency checks to run before you go</h2>
<ul>
<li>Litres a day in the market block equals litres a day in the cash block equals litres a day used to compute the margin.</li>
<li>The equipment in the project cost appears in the working, either as depreciation or as a maintenance line.</li>
<li>The working capital asked for matches the cash cycle you worked out: how many days of feed and expenses you must carry before the collection centre pays.</li>
<li>Your own wage is present, and is not so large that it swallows the surplus, nor zero.</li>
<li>The instalment you state can be produced from your own repayment schedule arithmetic, not from a hope.</li>
</ul>
<h2>What to say when you hand it over</h2>
<p>Two sentences, not a speech. What the unit is and what it will produce, and what you are asking for. Then let the officer read. Answer the numbers you are asked about from the sheet in front of them, and if you do not know a figure, say you will bring it rather than inventing it in the room. A promoter who says they will check is more credible than one who has an answer to everything.</p>`,
      Expert: `<p>Template, evidence map and the checks that get a file through appraisal without a return.</p>
<h2>The eight blocks and what each one must contain</h2>
<table>
<thead><tr><th>Block</th><th>Must contain</th></tr></thead>
<tbody>
<tr><td>1. Promoter and unit</td><td>Name, village, mandal, experience, training, activity, capacity</td></tr>
<tr><td>2. Market</td><td>Named buyer, quantity, rate, and the evidence reference</td></tr>
<tr><td>3. Project cost</td><td>Assets, one time charges, working capital, with a total</td></tr>
<tr><td>4. Means of finance</td><td>Promoter contribution, group savings, loan sought, total equal to block 3</td></tr>
<tr><td>5. Unit economics</td><td>Cost per litre or per kilogram, selling rate, margin</td></tr>
<tr><td>6. Monthly working</td><td>Receipts, costs including owner's wage, surplus</td></tr>
<tr><td>7. Repayment</td><td>Instalment, cover ratio, moratorium sought with a reason</td></tr>
<tr><td>8. Annexures</td><td>Numbered list, each item referenced from the block it supports</td></tr>
</tbody>
</table>
<h2>Evidence map</h2>
<table>
<thead><tr><th>Claim</th><th>Document that proves it</th></tr></thead>
<tbody>
<tr><td>Asset prices</td><td>Dated quotation on the supplier's letterhead</td></tr>
<tr><td>Buyer exists</td><td>Collection centre card, rate card, purchase order or letter</td></tr>
<tr><td>Contribution exists</td><td>Six months of bank statement, group passbook</td></tr>
<tr><td>You can run it</td><td>Training certificate, past sale receipts, experience letter</td></tr>
<tr><td>Premises</td><td>Land record, shed document or rent agreement</td></tr>
<tr><td>Identity</td><td>Standard identity and address proof as the branch lists them</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Project cost and means of finance are one statement in two halves and must total the same figure.</li>
<li>Surplus must exceed the instalment with room to spare. Equal is a refusal waiting to happen.</li>
<li>Every rate on the sheet is traceable to a paper behind it.</li>
<li>Average the year, never the best month.</li>
<li>Term loan buys an asset, working capital funds the cash gap. Ask for the one you need.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Second hand asset.</strong> A valuation or a seller's receipt, since a quotation does not exist. Expect a lower amount to be considered.</li>
<li><strong>Asset already bought.</strong> It can sometimes count towards your contribution if the bill is recent and in your name. Carry the bill.</li>
<li><strong>Group borrowing.</strong> The group's grading and repayment record carry more weight than any individual projection.</li>
</ul>
<h2>Before you leave the house</h2>
<ol>
<li>Totals in blocks 3 and 4 identical.</li>
<li>Owner's wage in block 6.</li>
<li>Cover ratio written in block 7.</li>
<li>Annexures numbered and referenced.</li>
<li>Every page signed and dated.</li>
<li>A photocopy of the whole file kept with you.</li>
</ol>`,
    },
  },

  31608: {
    topicId: 31608,
    title: "Udyam registration, shop licence and the GST threshold",
    summary:
      "A small unit needs fewer permissions than it is usually told, but the few it does need are the ones that unlock credit, schemes and the right to sell a food product at all. You learn what Udyam does and does not permit, where a shop registration and a trade licence differ, and the two situations that force GST registration whatever your turnover.",
    concepts: [
      "Udyam registration",
      "MSME classification",
      "Shops and Establishments registration",
      "GST registration threshold",
      "FSSAI registration and licence",
      "Registration versus licence",
    ],
    glossary: {
      "Udyam registration":
        "The central online record of a micro, small or medium enterprise, made against your PAN and Aadhaar and linked to the tax systems, which issues a registration number and a certificate. It identifies you as an MSME and permits no particular activity by itself.",
      "Composite criteria":
        "The MSME test that reads two things together, investment in plant, machinery or equipment and annual turnover. You belong to a category only if you are inside both ceilings, and crossing either one moves you up.",
      "Shops and Establishments registration":
        "A state labour department record of a commercial premises and the people working in it, covering hours, weekly off, leave and the employment of young persons. It is separate from the local body trade licence for the same address.",
      "Trade licence":
        "Permission from the panchayat or the municipality to carry on a stated trade at a stated address. It is renewed periodically and can be refused on grounds such as nuisance, effluent or an unsuitable premises.",
      "Aggregate turnover":
        "The GST measure of everything supplied on one PAN across India in a financial year, taxable, exempt and export supplies together. It is the figure compared with the registration threshold, not merely your taxed sales.",
      "FSSAI basic registration":
        "The entry level food authority permission for the smallest food businesses, issued against a turnover slab, which has to be upgraded to a State licence once the business grows beyond that slab.",
    },
    body: {
      Beginner: `<p>Two words get confused constantly, and the confusion costs new owners money. A <strong>registration</strong> records that your unit exists so that you can be counted and can claim benefits. A <strong>licence</strong> is permission to do a particular thing at a particular place, and it can be refused, and it can be taken back.</p>
<h2>Udyam registration</h2>
<p>Udyam is the central record of small enterprises. You do it online against your PAN and Aadhaar and you get a registration number and a certificate. Complete it yourself on the government portal, and check that portal before paying anyone a service charge for it.</p>
<p>What Udyam gives you is standing. Banks use it to classify you as a small enterprise, scheme applications ask for the number, and there is a redress route under the small enterprise law when a large buyer keeps you waiting for your money. What it does not give you is permission to run anything. It is not a food licence, it is not a trade licence, and it does not remove the need for either.</p>
<h2>The shop side</h2>
<p>If you have a shop or a commercial place with people working in it, two different offices are involved:</p>
<ul>
<li>The <strong>state labour department</strong>, where you register the premises and the working arrangements under the Shops and Establishments law.</li>
<li>The <strong>panchayat or municipality</strong>, which issues the <strong>trade licence</strong> for carrying on that trade at that address.</li>
</ul>
<p>People assume one covers the other. They do not, and an inspection asks for the one you are missing.</p>
<h2>Food is different</h2>
<p>If your unit touches food, and a pickle unit, a millet unit and a dairy all do, you need a food authority permission before you sell. The smallest businesses take a <strong>basic registration</strong>, larger ones a State licence, and the number has to appear on the label of every pack. Selling food without it is not a paperwork lapse, it is an offence.</p>
<h2>GST, in one paragraph</h2>
<p>You register for GST once your turnover crosses a threshold, and the threshold is different for goods and for services and is revised from time to time, so check the current figure rather than trusting anybody's memory. There are also situations that make registration compulsory whatever your turnover, and the important one for a village unit is selling goods to a buyer in another state.</p>
<h2>What you probably do not need</h2>
<p>A private limited company, a trademark before you have a brand worth protecting, or a GST number for a unit selling only in its own district below the threshold. Each of these costs money and time, and none of them makes your first year easier.</p>`,
      Intermediate: `<p>Take a pickle and spice unit in Nirmal run by two women, working from a converted room, supplying shops in the mandal. Work through the permissions in the order they actually matter.</p>
<h2>First, the food licence, because without it you cannot sell</h2>
<p>Every food business needs a permission from the food authority before it operates. The tiers are basic registration for the smallest turnover slab, a State licence above it, and a Central licence for the largest operations, importers and some specified categories. The slabs are revised, so read the current ones on the authority's own portal. Practical points that matter more than the tier:</p>
<ul>
<li>The number goes on the label of every pack you sell, along with the other declarations.</li>
<li>Your premises has to match what you declared: separate storage, a water source you can describe, and staff with the health checks the rules require.</li>
<li>It is renewed, not permanent. Put the renewal date in the same place you keep the cash book.</li>
</ul>
<h2>Second, Udyam, because it is what credit and schemes read</h2>
<p>Udyam is a self declaration on the government portal against PAN and Aadhaar, linked to the income tax and GST systems, so the turnover and investment figures are drawn from returns rather than from what you type. It is not renewed annually, but the record has to be kept current when your numbers change. There is also a separate route for informal micro enterprises that do not yet have those documents, operated through designated agencies, so a unit without a GST registration is not shut out.</p>
<p>Classification uses <strong>composite criteria</strong>: investment in plant, machinery or equipment together with annual turnover. Both have to sit inside the ceiling of a category, and crossing either one lifts you to the next. The ceilings are notified centrally and have been revised more than once, so quote no figure from memory in a loan file; take it from the current notification.</p>
<h2>Third, the premises permissions</h2>
<table>
<thead><tr><th>Permission</th><th>Issued by</th><th>What it covers</th></tr></thead>
<tbody>
<tr><td>Shops and Establishments registration</td><td>State labour department</td><td>The premises and the employment terms in it</td></tr>
<tr><td>Trade licence</td><td>Panchayat or municipality</td><td>Carrying on that trade at that address</td></tr>
<tr><td>Pollution board consent</td><td>State pollution control board</td><td>Only if your activity is in a listed category; many micro units are in a simplified category</td></tr>
<tr><td>Factory licence</td><td>Factories inspectorate</td><td>Applies once worker numbers and power use cross the limits in the Act</td></tr>
</tbody>
</table>
<h2>Fourth, weights and packaged goods</h2>
<p>A pack sold by weight brings the legal metrology rules with it. The weighing instrument you use for trade has to be verified and stamped, and re-verified periodically. The label has to carry the packer's name and address, the common name of the product, the net quantity, the month and year of packing, the retail sale price inclusive of all taxes, and a consumer complaint contact.</p>
<h2>Fifth, GST</h2>
<p>Registration follows <strong>aggregate turnover</strong> on your PAN across India, counting exempt and taxable supplies together, against a threshold that differs for goods and for services and is revised. Registration is compulsory regardless of turnover in certain cases, and the one that catches village units is a taxable inter-state supply of goods. If you stay small and local, you may not need to register at all, and there is a composition route for small suppliers who want a simpler return with a flat rate and restricted credit.</p>`,
      Advanced: `<p>Compliance failures in micro units are rarely defiance. They are sequencing errors and misunderstandings about what a document does, and the same six appear again and again.</p>
<h2>Six mistakes that cost real money</h2>
<ol>
<li><strong>Treating Udyam as a licence.</strong> An owner shows the Udyam certificate to a food inspector. It proves nothing about food safety, and the unit is treated as unlicensed. Udyam is an identity, and identity is not permission.</li>
<li><strong>Registering for GST when there was no need.</strong> A unit selling only in its own mandal, well under the threshold, registers because a neighbour said everyone must. It now files returns for every period whether or not there was a sale, and a missed nil return brings a late fee for nothing at all. Registration is easy to enter and troublesome to leave.</li>
<li><strong>Not registering when it was compulsory.</strong> The same unit starts supplying a buyer in Maharashtra. Inter-state taxable supply of goods forces registration whatever the turnover, and the liability begins with the supply, not with the discovery.</li>
<li><strong>Missing a renewal.</strong> A food licence, a trade licence and a metrology verification all expire. The unit continues trading through the gap and finds the lapse during an inspection or, worse, when a buyer asks for a valid copy.</li>
<li><strong>Registering in the wrong name.</strong> Udyam in the husband's name, the bank account in the wife's, the food licence in the unit's trade name. Every scheme application then fails a name match, and a woman owned unit loses the benefits it was eligible for.</li>
<li><strong>Paying an agent for a self service form.</strong> Udyam is completed by the owner on the portal. Pay for help if you want help, but know what the help is worth.</li>
</ol>
<h2>The voluntary GST decision, worked properly</h2>
<p>Below the threshold you may still register, and it is a business decision rather than a compliance one.</p>
<ul>
<li><strong>Register if</strong> your buyers are registered businesses who want a tax invoice to claim credit on, or if a large share of your input cost carries tax you could otherwise never recover, such as machinery, packaging film and freight.</li>
<li><strong>Stay out if</strong> you sell to households in your own district. Your customer cannot claim credit, so the tax simply raises your price against an unregistered competitor down the road.</li>
<li><strong>Remember the running cost.</strong> Returns for every period including nil ones, invoices in the prescribed form, and a record keeping standard your cash book may not yet meet.</li>
</ul>
<h2>What the ceiling movement means for you</h2>
<p>MSME ceilings are composite and are revised. Two consequences follow. First, never write a ceiling figure into a project report from memory, because an out of date figure in a file suggests every other figure was also taken from memory. Second, watch turnover as well as machinery. A unit that adds no machine at all can be lifted out of the micro category by a good year, and some benefits are graded, so plan for the transition rather than being surprised by it.</p>
<h2>Sequencing for a new unit</h2>
<p>Food permission before the first sale. Trade licence and shops registration before you open the premises to the public or employ anyone. Udyam as soon as you have PAN and a bank account, because the loan file asks for it. Legal metrology verification before you pack anything by weight. GST only when the threshold or a compulsory situation reaches you, and with the return burden accepted in advance.</p>`,
      Expert: `<p>Recall table of permissions, the compulsory GST triggers, and the renewal discipline.</p>
<h2>Who issues what</h2>
<table>
<thead><tr><th>Document</th><th>Authority</th><th>Nature</th></tr></thead>
<tbody>
<tr><td>Udyam registration</td><td>Central MSME portal</td><td>Registration, self declared, PAN and Aadhaar based</td></tr>
<tr><td>Food registration or licence</td><td>Food authority, state or central</td><td>Licence, tiered by turnover slab and scale</td></tr>
<tr><td>Shops and Establishments</td><td>State labour department</td><td>Registration of premises and employment terms</td></tr>
<tr><td>Trade licence</td><td>Panchayat or municipality</td><td>Licence for a trade at an address</td></tr>
<tr><td>GST registration</td><td>GST authorities</td><td>Registration, threshold or trigger based</td></tr>
<tr><td>Legal metrology verification</td><td>Legal metrology department</td><td>Stamping of the weighing instrument, periodic</td></tr>
<tr><td>Pollution board consent</td><td>State pollution control board</td><td>Consent, only for listed categories</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Registration records existence, a licence grants permission. Udyam is the first, a food licence is the second.</li>
<li>MSME category is composite: inside both the investment ceiling and the turnover ceiling, or you are in the next category.</li>
<li>GST turnover is aggregate on the PAN across India, exempt supplies included.</li>
<li>Inter-state taxable supply of goods removes the threshold entirely.</li>
<li>Every name on every document should be the same name.</li>
</ul>
<h2>Compulsory GST situations to recognise</h2>
<ul>
<li>Taxable inter-state supply of goods.</li>
<li>A casual taxable person selling at an exhibition or a mela outside the home state.</li>
<li>Liability to pay under reverse charge.</li>
<li>Supply through certain electronic commerce arrangements, where the rules for small suppliers have changed more than once, so confirm before listing on any platform.</li>
</ul>
<h2>Renewal and update diary</h2>
<ol>
<li>Food licence: renewal date, well before expiry.</li>
<li>Trade licence: the local body's renewal cycle.</li>
<li>Weighing instrument: verification stamp date.</li>
<li>Udyam: update when investment or turnover changes category, or when the bank details change.</li>
<li>GST: return dates for every period, nil periods included.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li><strong>Home based unit.</strong> Food and metrology rules apply exactly as they do to a shop; the kitchen being domestic changes nothing about the label.</li>
<li><strong>Group enterprise.</strong> Decide whose PAN the registrations sit on before applying, since scheme eligibility often follows the registered owner.</li>
<li><strong>Seasonal stall.</strong> Selling in another state at a mela is a casual taxable person situation, not an exemption.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "You have completed Udyam registration for a pickle unit. What does the certificate allow you to do?",
        options: [
          "Sell packaged food, because MSME registration includes food safety clearance",
          "Nothing by itself; it records you as an MSME so that schemes, credit classification and delayed payment redress can be claimed",
          "Trade at your address without a panchayat trade licence",
          "Supply goods to another state without a GST registration",
        ],
        answer: 1,
        explanation:
          "Udyam is a registration, so it establishes that your enterprise exists and which category it is in, which is what scheme and credit paperwork asks for. The tempting answer is that it covers food, but selling food needs a permission from the food authority, and an inspector treats a unit holding only Udyam as unlicensed.",
        difficulty: "Easy",
        skill: "Udyam registration",
      },
      {
        n: 2,
        question:
          "Your investment in machinery is comfortably inside the micro ceiling, but annual turnover has crossed it. What is the position?",
        options: [
          "You remain micro, since investment is the governing test",
          "The two are read together, so crossing the turnover ceiling moves you to the next category and the Udyam record is updated",
          "Nothing changes until both investment and turnover cross the ceiling",
          "The registration lapses and a fresh one must be filed",
        ],
        answer: 1,
        explanation:
          "Classification uses composite criteria, so you stay in a category only while inside both the investment and the turnover ceiling, and breaching either one lifts you. Believing that investment governs is the common error and it produces project reports that state the wrong category, which an appraising officer notices at once.",
        difficulty: "Medium",
        skill: "MSME classification",
      },
      {
        n: 3,
        question:
          "Your unit's turnover is below the GST threshold and you are not registered. A shop in Maharashtra places an order for your packed pickle. What changes?",
        options: [
          "Nothing, because the threshold is about turnover and yours is still below it",
          "A taxable inter-state supply of goods makes registration compulsory whatever your turnover",
          "You may supply once and register only if the order repeats",
          "The buyer's registration covers the transaction for both of you",
        ],
        answer: 1,
        explanation:
          "Certain situations force registration regardless of turnover, and inter-state taxable supply of goods is the one that reaches village units first, with liability starting from that supply. Relying on being below the threshold is the attractive answer, but the threshold only protects a supplier who is not in one of the compulsory categories.",
        difficulty: "Medium",
        skill: "GST registration threshold",
      },
      {
        n: 4,
        question:
          "The pickle unit is small and supplies only shops within the district. Which food authority route fits, and what happens later?",
        options: [
          "No permission is needed because the quantity is small and the kitchen is domestic",
          "Basic registration now, upgraded to a State licence once turnover crosses the slab for it",
          "A Central licence, since food is a central subject",
          "Udyam registration, which covers food businesses as well",
        ],
        answer: 1,
        explanation:
          "The smallest food businesses take a basic registration and move to a State licence when they grow past the turnover slab, and the number must appear on every label. The idea that a home kitchen is exempt is the dangerous wrong answer, since the rules follow the activity of selling food and not the type of premises.",
        difficulty: "Medium",
        skill: "FSSAI registration and licence",
      },
      {
        n: 5,
        question:
          "Which statement describes the difference between a registration and a licence correctly?",
        options: [
          "A registration is permission to carry on an activity, while a licence only records that you exist",
          "A registration records that you exist and unlocks benefits, while a licence is permission to carry on a stated activity at a stated place and can be refused or withdrawn",
          "They are the same thing, issued by different departments",
          "A licence is issued once and never needs renewal, unlike a registration",
        ],
        answer: 1,
        explanation:
          "A registration is a record that makes you visible and eligible, while a licence is conditional permission that an authority can refuse, attach conditions to, or withdraw. Reversing the two is the usual confusion, and it is why owners present an Udyam certificate when they are asked for a trade or food licence.",
        difficulty: "Easy",
        skill: "Registration versus licence",
      },
      {
        n: 6,
        question:
          "With which office do you register the premises of a shop and the working terms of the people employed in it?",
        options: [
          "The state labour department, separately from the panchayat trade licence for the same address",
          "The food authority, as part of the food licence",
          "The GST office, as part of registration",
          "The MSME ministry, through the Udyam portal",
        ],
        answer: 0,
        explanation:
          "Shops and Establishments registration sits with the state labour department and covers hours, weekly off, leave and employment particulars for the premises. Owners often assume the panchayat trade licence covers this too, but the trade licence permits the trade at the address and says nothing about employment terms, so an inspection asks for both.",
        difficulty: "Medium",
        skill: "Shops and Establishments registration",
      },
      {
        n: 7,
        question:
          "You are below the GST threshold, but a registered institutional buyer asks for a tax invoice. What is the honest trade-off in registering voluntarily?",
        options: [
          "There is no trade-off, since registration only adds benefits",
          "You gain the ability to issue a tax invoice and to claim credit on your own taxed inputs, and you take on returns for every period including nil ones",
          "You must register, because a registered buyer cannot deal with an unregistered supplier",
          "Your buyer can claim credit on a bill of supply, so registering changes nothing",
        ],
        answer: 1,
        explanation:
          "Voluntary registration lets you issue a tax invoice your buyer can take credit on and lets you recover tax on packaging, freight and machinery, at the cost of a permanent filing obligation that runs even in months with no sales. Assuming there is no downside is the trap, because a missed nil return attracts a late fee for a period in which you sold nothing.",
        difficulty: "Hard",
        skill: "GST registration threshold",
      },
    ],
  },
};

export default PART;
