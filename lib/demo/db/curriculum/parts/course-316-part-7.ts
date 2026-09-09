/**
 * Course 316: Start Your Rural Micro-Enterprise, part 7.
 *
 * Topics 31615, 31616 and 31617: the three selling routes a village unit really
 * has and what each one hands back from the same printed price, the quality and
 * packaging work that converts a first sale into a second one, and the credit
 * sales that quietly consume a profitable unit.
 *
 * Written for a first time owner who has a cost sheet, a break-even number and a
 * price, and who is now trading. Worked examples use enterprises that exist in
 * these districts, a millet processing unit, a small food unit, a tailoring unit
 * and a dairy. Every rupee figure is illustrative and exists only to make a
 * method visible: grain, groundnut, cloth and milk rates move with the season and
 * the district, so the arithmetic is the lesson and the numbers are the chalk.
 * Marketplace and scheme structures are taught by their shape and never by a
 * current commission, threshold or rate, because those change and a learner who
 * memorises one has memorised the wrong thing.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31615: {
    topicId: 31615,
    title: "Selling locally: haat, WhatsApp and shop tie-ups",
    summary:
      "A village unit has three real routes to a paying customer, the weekly santha, a direct order list on the phone and a tie-up with kirana shops, and the same pack hands back a different amount of money on each of them. You work net realisation for a millet unit on all three routes, compare the return per pack against the return per day of your own time, and build a mix instead of betting the unit on one route.",
    concepts: [
      "Channel net realisation",
      "Trade margin",
      "Weekly santha stall",
      "Direct order list",
      "Retail tie-up terms",
      "Channel mix",
    ],
    glossary: {
      "Channel net realisation":
        "The money that actually reaches your hand from one unit sold by a particular route, after the shopkeeper's margin, the transport, the pitch fee, the units given free under a scheme and the stock that comes back unsold.",
      "Trade margin":
        "The share of the price a shopkeeper keeps for stocking your goods and waiting for them to sell. It is quoted either on the price he sells at or on the price he pays you, and the same percentage means different money on the two bases.",
      Santha:
        "The market held on one fixed weekday in a mandal town, also called a haat, where a seller pays a small pitch fee for the day and is paid by the customer in cash before the customer leaves.",
      "Broadcast list":
        "A facility that sends one message separately to every saved contact on it, so each person receives it as a private message. It is not a group: nobody sees who else received it and no reply reaches the others.",
      "Shelf space":
        "The room a shopkeeper allots to your product. He grants it to whatever turns his money fastest rather than to whatever tastes best, and he takes it back the week your packs stop moving.",
      "Sale or return":
        "Stock placed with a shop on the understanding that whatever does not sell comes back to you. Until it sells it is your stock and your money, whatever the delivery note calls it.",
    },
    body: {
      Beginner: `<p>A channel is a route by which your goods reach somebody who pays for them. A millet unit in Jagtial that packs one kilogram bags of ragi flour has three routes open on the day it starts, and the same bag brings back a different amount of money on each one.</p>
<h2>The weekly market</h2>
<p>Most mandal towns hold a market on one fixed day of the week, the santha. You pay a small pitch fee for the day, you stand behind your own goods, and the customer pays cash before he walks away. Nothing is owed to you at closing time, and you hear every objection to your price from the person who has just refused it.</p>
<h2>The phone</h2>
<p>Every customer who buys from you has a number, and that number is worth more than the sale was. Write it down the same evening with the name, the village and what was bought. Once fifty numbers are saved, one message on a broadcast list the day before grinding brings back orders for the week. A group is a different thing and usually the wrong thing: on a group everybody sees everybody, and every reply reaches all of them.</p>
<h2>The shop</h2>
<p>A kirana shop stocks your bags only if he earns on them. He does not buy at the price printed on the pack. He buys lower, and the gap between what he pays you and what the customer pays him is his margin, which is his wage for keeping your goods on a shelf and waiting for them to sell. He will also ask to pay you later, usually at the end of the month.</p>
<h2>The printed price is not your money</h2>
<p>Take one bag priced at ₹80. Sold at the santha it puts ₹80 in your hand, less the pitch fee and the auto fare spread over the day's bags. Supplied to a shop at twenty per cent off, it brings ₹64, less what the delivery run cost, less any bag that comes back torn, and even that ₹64 arrives a month later. The bag did not change. The route did.</p>
<h2>Your first month</h2>
<ol>
<li>Take one santha day. Count what sold, what did not, and how many people asked for something you were not carrying.</li>
<li>Save every buyer's number that evening, with the village name against it.</li>
<li>Ask three shopkeepers what margin they expect and on which day they settle. Do not argue with the answer yet, only write it down.</li>
<li>Work out what one bag leaves you on each route, and only then decide where next week's production goes.</li>
</ol>
<p>A unit that sells through one route alone can be stopped by a wet market day or by one shopkeeper changing his mind, and neither of those is a business problem you can fix on the morning it happens.</p>`,
      Intermediate: `<p>Choosing a route is arithmetic, not preference. For each one you work the net realisation, which is the money that actually reaches your hand from a single pack, and then you divide the week's contribution by the days of your own time that route consumed. The two answers rarely point at the same channel, and you need both.</p>
<h2>The unit</h2>
<p>Jagtial millet unit, one kilogram packs of ragi flour. The cost sheet puts a packed bag at ₹52, counting grain, cleaning loss, grinding power, the pack itself and your own wage at the rate you set. The printed price is ₹80.</p>
<h2>Route one, the santha stall</h2>
<ul>
<li>Sixty packs sell on the day at ₹80 in cash, which is ₹4,800.</li>
<li>Pitch fee ₹150, hired auto both ways ₹300.</li>
<li>Net realisation is ₹4,350 divided by 60, which is <strong>₹72.50</strong> a pack.</li>
<li>Contribution ₹20.50 a pack, so ₹1,230 on the day, and the day is gone.</li>
</ul>
<h2>Route two, the direct order list</h2>
<ul>
<li>One broadcast message on Wednesday, deliveries on Friday along a single road: 25 packs at ₹80, paid on delivery.</li>
<li>The run costs ₹250 in fuel and time, which is ₹10 a pack.</li>
<li>Net realisation <strong>₹70</strong>, contribution ₹18 a pack, ₹450 for the run, half a day.</li>
</ul>
<h2>Route three, the kirana tie-up</h2>
<ul>
<li>Eight shops take 120 packs a week. The shop sells at the printed ₹80 and keeps twenty per cent of it, so you supply at ₹64.</li>
<li>The delivery round costs ₹400, which is about ₹3.35 a pack. Torn and unsold bags run at about two per cent, another ₹1.30.</li>
<li>Net realisation about <strong>₹59.35</strong>, contribution about ₹7.35, so ₹880 for the week, half a day, and the money arrives thirty days later.</li>
</ul>
<h2>Read the table twice</h2>
<table>
<thead><tr><th>Route</th><th>Packs a week</th><th>Net realisation</th><th>Contribution a week</th><th>Your days</th><th>Contribution per day of your time</th></tr></thead>
<tbody>
<tr><td>Santha stall</td><td>60</td><td>₹72.50</td><td>₹1,230</td><td>1.0</td><td>₹1,230</td></tr>
<tr><td>Direct orders</td><td>25</td><td>₹70.00</td><td>₹450</td><td>0.5</td><td>₹900</td></tr>
<tr><td>Kirana shops</td><td>120</td><td>₹59.35</td><td>₹880</td><td>0.5</td><td>₹1,760</td></tr>
</tbody>
</table>
<p>Per pack the santha is the best route and the shops are the worst. Per day of the one resource you cannot buy more of, the ranking turns over completely. Owners who judge routes on margin alone end up standing in a market all week, wondering why output never rises.</p>
<h2>What each route is actually for</h2>
<ul>
<li><strong>The santha</strong> pays cash the same evening, teaches you the objections in the customer's own words, and lets you test a new pack size on strangers before a whole run is committed to it.</li>
<li><strong>The direct list</strong> is the only route where the customer belongs to you. A shop's customer is the shop's. A number in your book can be reached a second time at no cost.</li>
<li><strong>The shops</strong> move volume without your presence, and that is the only way a one person unit sells more than it can personally hand over.</li>
</ul>
<h2>Build the mix on paper before the week starts</h2>
<ol>
<li>Fix how many days a week you will personally sell. Two is realistic for an owner who also runs production.</li>
<li>Give the volume route the delivery day it needs and no more, because it pays late and every extra pack there widens the cash gap.</li>
<li>Keep at least one cash route running every week, so wages and grain purchases never wait for a shopkeeper's settlement day.</li>
<li>Record production and sales against the three routes separately. One combined figure for sales hides the route that is dying until it is dead.</li>
</ol>`,
      Advanced: `<p>The arithmetic is the easy half. What decides whether a route earns anything over a year is the terms agreed in a two minute conversation on the first day, and most first time owners lose that conversation without noticing it happened.</p>
<h2>Margin on retail is not markup on cost</h2>
<p>A shopkeeper who asks for twenty per cent may mean twenty per cent of the ₹80 he sells at, which leaves you ₹64, or twenty per cent added to what he pays you, which is ₹80 divided by 1.20, leaving you ₹66.67. The percentage is identical and the money is not. On 120 packs a week the ₹2.67 gap is about ₹1,280 a month, which is most of a small unit's power bill. Settle the base in words on the rate card, not the percentage.</p>
<h2>A free scheme is a price cut wearing better clothes</h2>
<p>One bag free with ten sounds like a bag. It is a discount of one in eleven, about nine per cent, and it lands on the route that already has the thinnest margin. The supply price falls from ₹64 to about ₹58.20, and the contribution on that route falls from roughly ₹7.35 a pack to about ₹1.55. Run every scheme through the cost sheet before you agree to it, and prefer a scheme tied to a volume you actually want, such as a rate for a full carton, over a standing offer that never ends.</p>
<h2>Stock that can come back is still yours</h2>
<p>Goods left on sale or return are your stock until the customer pays for them, whatever the delivery note says. Enter them in the stock register at the shop's name, not in the sales register. The test is simple: ask who bears the loss if the bag does not sell. If the answer is you, no sale has happened yet, and a bill book that says otherwise will overstate the month and understate the stock at the same time.</p>
<h2>Win the shelf argument in his language</h2>
<p>A shopkeeper is not comparing your flour with another flour. He is comparing the money locked in your bags with the money locked in soap. Ten bags at ₹64 is ₹640 of his money, and if six leave the shop a week he has it back in under a fortnight with about ₹160 earned on it. That sentence gets you shelf space when a speech about quality does not.</p>
<h2>The routes fail in different weather</h2>
<ul>
<li>The santha collapses in a wet week and in the sowing fortnight, when the crowd is in the field. It is not a route to plan a wage bill on.</li>
<li>The shop route rarely collapses. It just pays later, which is a different injury and needs a different medicine.</li>
<li>The direct list is the slowest to build and the steadiest once built, and it is the only one that survives you moving village.</li>
</ul>
<h2>Terms to settle before the first delivery</h2>
<ol>
<li>Who bears damage in transit, and who bears stock that ages on the shelf.</li>
<li>A stated settlement date written on the bill, not the phrase month end.</li>
<li>Whether the price is exclusive of any tax that becomes applicable later, so that a change in your registration status does not become a quarrel.</li>
<li>Any claim of exclusive supply for a mandal, which is worth agreeing to only against a written minimum offtake, and never in the first season.</li>
</ol>
<h2>The digital route, as a structure</h2>
<p>Beyond a phone list there is the open network model, the Open Network for Digital Commerce, in which a seller lists once through a participating seller application and buyers using other applications can find that listing. What it changes for a small unit is discovery and packing discipline rather than price. You still carry the packing, the courier and the returns, and the commission and the settlement period differ by the application you join, so ask for both in writing before you list. Treat it as a fourth route and put it through the same net realisation arithmetic, not as an escape from the arithmetic.</p>
<h2>The marginal calls</h2>
<ul>
<li>An order that needs a new pack size is worth taking only if the run clears the minimum batch the machine is efficient at, and only if the buyer repeats.</li>
<li>A shop that wants two delivery visits a week for the same volume is asking you to double a real cost. Quote it, or decline it and keep the weekly slot.</li>
<li>Never drop a route in the month it is weakest. Measure it across a full season, because every route in a district economy has a bad month built into it.</li>
</ul>`,
      Expert: `<p>Recall card for channels. The formulas, the worked unit, the rules, then the edge cases.</p>
<h2>Formulas</h2>
<table>
<thead><tr><th>Quantity</th><th>How it is worked</th></tr></thead>
<tbody>
<tr><td>Net realisation</td><td>Supply price, less transport per unit, less returns per unit, less the effect of any free scheme</td></tr>
<tr><td>Supply price from a retail margin</td><td>Retail price multiplied by one minus the margin, when the margin is taken on his selling price</td></tr>
<tr><td>Supply price from a markup</td><td>Retail price divided by one plus the markup, when he marks up on what he pays you</td></tr>
<tr><td>Contribution per unit</td><td>Net realisation less variable cost per unit</td></tr>
<tr><td>Contribution per owner day</td><td>The route's contribution for the week, divided by the days of your time it consumed</td></tr>
<tr><td>Effective discount of a free scheme</td><td>Free units divided by free plus paid units</td></tr>
</tbody>
</table>
<h2>The worked unit, memorised</h2>
<ul>
<li>Ragi pack: variable cost ₹52, printed price ₹80.</li>
<li>Santha, ₹72.50 net, 60 packs, ₹1,230 a week, one full day, cash the same evening.</li>
<li>Direct list, ₹70.00 net, 25 packs, ₹450, half a day, paid on delivery.</li>
<li>Kirana shops, ₹59.35 net, 120 packs, ₹880, half a day, money after thirty days.</li>
<li>Per day of your time: ₹1,230, ₹900, ₹1,760. The worst margin is the best use of a day.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>The printed price is the customer's number. Net realisation is yours.</li>
<li>A cash route funds the week. A credit route has to be funded by you until it pays.</li>
<li>Settle the base before the percentage. Margin on retail and markup on cost are different money.</li>
<li>Every free bag is a discount. Put it through the cost sheet before the shopkeeper leaves.</li>
<li>The customer's number is the asset, not the sale. A sale without a number has to be won again from nothing.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Sale or return.</strong> Your stock, your loss, your stock register, until the money changes hands.</li>
<li><strong>Sowing and harvest weeks.</strong> The santha crowd is in the field. Move that week's volume to the shop route in advance.</li>
<li><strong>An institutional buyer.</strong> One delivery point and a large volume, paid on a bill cycle that is longer than any shop's. Size the working capital before accepting, not after.</li>
</ul>
<h2>Checklist before you add a route</h2>
<ol>
<li>Net realisation worked, with transport, returns and any scheme included.</li>
<li>Settlement date written on the bill and agreed by name, not by custom.</li>
<li>Extra working capital the credit days demand, counted and available.</li>
<li>The days of your own time the route needs, booked into the week before it is promised.</li>
<li>A number recorded for every customer the route puts in front of you.</li>
</ol>`,
    },
  },
  31616: {
    topicId: 31616,
    title: "Quality, packaging and the repeat purchase",
    summary:
      "Quality in a small unit is not the best piece you have ever made, it is the same piece every time, written down as a specification so that somebody other than you can judge it. You cost a packaging decision for a groundnut chikki unit, see why better packing rarely pays through fewer breakages alone, and learn to count the repeat purchase that actually decides whether the unit survives its second year.",
    concepts: [
      "Product specification",
      "Batch consistency",
      "Protective packaging",
      "Packing cost per unit",
      "Repeat purchase rate",
      "Complaint handling",
    ],
    glossary: {
      "Product specification":
        "A written statement of what one acceptable piece is: the material, the measurement, the weight, the finish, and the amount each of those may vary by. It lets a piece be judged by somebody who did not make it.",
      Tolerance:
        "The amount by which a piece may differ from the specification and still be accepted. Where no tolerance is written, quality becomes an argument between two opinions and the stronger voice wins.",
      Batch:
        "One lot made from the same materials in the same session with the same settings. It is the smallest quantity you can trace, hold back or replace on its own without touching the rest of your stock.",
      "Primary and secondary pack":
        "The primary pack touches the product and protects it. The secondary pack carries several primary packs through loading, transport and a shopkeeper's shelf. A failure of either reaches the customer as one complaint about you.",
      "Repeat purchase rate":
        "The share of named customers who buy again within a stated period, counted from your own order list. It is a count of the same people twice, not a rise in total sales, which can happen while every buyer is new.",
      "First piece approval":
        "Making one piece of a lot, checking it against the written specification and having the buyer accept it, before the rest of the lot is cut or cooked. It turns a possible loss of the whole lot into the loss of one piece.",
    },
    body: {
      Beginner: `<p>Quality does not mean the best batch you have ever made. It means the same batch every time. A customer who liked your chikki last month is buying the memory of that packet, and a packet that is softer, sweeter or smaller than the remembered one is a complaint even when it is objectively better.</p>
<h2>Write down what a good piece is</h2>
<p>Nothing can be checked until it is written. For a chikki unit the note on the wall might read: 100 grams in the packet, jaggery and groundnut in a fixed proportion, cooked to the same colour, cut to the same size, and no more than a few grams above or below the stated weight. That last part is the tolerance, the amount a piece may differ and still pass. For a tailoring unit the same note carries measurements, the seam allowance and the stitch line. Once it is on paper, a helper can check work without your standing there, and two people can disagree about a piece without quarrelling.</p>
<h2>The pack has three jobs</h2>
<ul>
<li><strong>It protects.</strong> Moisture, heat, crushing under other goods in a bus, and a shopkeeper's shelf near a window all attack the product before the customer does.</li>
<li><strong>It tells.</strong> What is inside, how much, who made it, and the code that says which day's batch it came from.</li>
<li><strong>It brings the person back.</strong> A customer who cannot say your unit's name in a shop cannot ask for you a second time.</li>
</ul>
<h2>The second sale is the cheap one</h2>
<p>Winning a new customer costs a market day, a sample and a conversation. Selling to somebody who already bought costs a message. A unit that keeps replacing customers is running to stay in one place, and it will feel like hard work rather than like a failure, which is why it goes on for years.</p>
<h2>When somebody complains</h2>
<ol>
<li>Replace the packet without an argument, on the spot.</li>
<li>Ask which day it was bought and read the batch code on the pack.</li>
<li>Look at what your own record says about that batch: the material, who worked it and anything unusual.</li>
<li>If the batch looks wrong, hold back whatever is left of it before it reaches anybody else.</li>
</ol>
<p>One replaced packet costs you the material. One bad lot sitting on four shelves in the mandal costs you the shelves as well, and those are harder to get back than the packet.</p>`,
      Intermediate: `<p>Quality work in a micro unit is three habits: a written specification, a check at the point where a mistake is still cheap, and a record that lets you trace one day's production. Packaging is a costing decision on top of that, and repeat purchase is the number that tells you whether either of them worked.</p>
<h2>Specification and the cheap checkpoint</h2>
<p>Write the specification for one acceptable piece, including the tolerance on every measurable part of it. Then place the check where a mistake still costs one piece. A tailoring unit taking an order for sixty blouses makes one piece first, has it approved against the written measurements, and only then cuts the rest. A mistake caught there costs one metre of cloth. The same mistake caught after cutting costs sixty.</p>
<h2>The batch record</h2>
<p>One line a day in a register: date, batch code, what materials were used and from which purchase, who worked, and anything out of the ordinary such as a new jaggery supplier or a longer cooking time. It takes a minute. It is the only thing that turns a complaint from a mystery into a five minute enquiry, and it is what lets you withdraw one lot instead of everything you have made.</p>
<h2>Costing a packaging decision</h2>
<p>A Nirmal unit sells 100 gram groundnut chikki packets, printed price ₹25, supplied to shops at ₹20. The present thin wrap costs ₹0.60 and the packet costs ₹14 in all. Breakage and stale returns run at about six per cent. A sealed laminated pouch would cost ₹1.90, taking the packet to ₹15.30, and would cut returns to about one and a half per cent.</p>
<table>
<thead><tr><th>Per packet</th><th>Thin wrap</th><th>Sealed pouch</th></tr></thead>
<tbody>
<tr><td>Supply price</td><td>₹20.00</td><td>₹20.00</td></tr>
<tr><td>Less returns and breakage</td><td>₹1.20</td><td>₹0.30</td></tr>
<tr><td>Net realisation</td><td>₹18.80</td><td>₹19.70</td></tr>
<tr><td>Variable cost</td><td>₹14.00</td><td>₹15.30</td></tr>
<tr><td>Contribution</td><td>₹4.80</td><td>₹4.40</td></tr>
</tbody>
</table>
<p>On breakage alone the upgrade loses money: it saves ₹0.90 and costs ₹1.30. Most owners stop the analysis here, and most of them are stopping one step early.</p>
<h2>The part that pays</h2>
<p>A sealed pouch holds its texture far longer than a folded wrap, so a shopkeeper who was taking three days of stock at a time will take a fortnight of it. The round that carried 400 packets a week now carries 700. Weekly contribution moves from 400 at ₹4.80, which is ₹1,920, to 700 at ₹4.40, which is ₹3,080. The same ₹400 delivery round is now spread over 700 packets instead of 400, so delivery falls from ₹1.00 a packet to about ₹0.57. Packaging pays through order size, shelf reach and repeat buying, and almost never through breakage on its own.</p>
<h2>Counting the repeat purchase</h2>
<p>Take the names on your order list at the start of a quarter, say 120 of them, and count how many of those same names bought again inside it. Thirty eight is a repeat rate of about thirty two per cent. That is a count of people, not a rise in sales, and the difference matters: total sales can climb for a year while every single buyer is new, which is the most expensive way a unit has ever grown.</p>
<p>Value the repeat. A customer who takes two packets a month buys twenty four a year, which at ₹4.40 is about ₹105 of contribution. A sample handed out at a stall costs ₹15.30. If three samples produce one customer who repeats, the sampling is paid back in about five months, and you now have a rule for how many samples a market day can carry.</p>`,
      Advanced: `<p>Once the specification exists and the pack has been costed, the failures move somewhere else: into changes you make without telling anybody, into packaging that defends a margin smaller than itself, and into a returns habit that teaches shops to be careless with your stock.</p>
<h2>Never improve the product silently</h2>
<p>A jaggery that arrives darker, a groundnut lot that roasts faster, a cheaper thread with a different sheen: each of these can produce a piece that a taster prefers and a repeat customer rejects, because the repeat customer is matching against a memory. If a change is worth making, make it once, make it deliberately, tell the shops in the same week, and give the santha crowd a taste of both. A change that arrives quietly is read as a decline in quality, and the complaint reaches you two months later as a fall in orders that nobody explains.</p>
<h2>Where a rejection is cheapest</h2>
<table>
<thead><tr><th>Caught at</th><th>What it costs you</th></tr></thead>
<tbody>
<tr><td>Your own bench, before packing</td><td>The material in one piece, and nothing else</td></tr>
<tr><td>Your own dispatch check</td><td>The material and the labour, still inside the unit</td></tr>
<tr><td>The shop, as a return</td><td>Material, labour, pack, both transport legs, and a shopkeeper who now inspects every delivery</td></tr>
<tr><td>The customer, at home</td><td>All of the above, plus the customer and everybody they tell</td></tr>
</tbody>
</table>
<p>This is why a dispatch check that seems to slow the day down is the cheapest ten minutes in the unit. It is also why sorting should be visible: a helper who sees rejected pieces set aside understands the specification better than a helper who is told about it.</p>
<h2>Packaging that costs more than the margin it defends</h2>
<p>Packing has to be sized against the value of the contents. A ₹25 packet cannot carry a ₹4 pouch, a printed carton and a courier friendly outer box, because the pack would eat the entire contribution before the product left the shed. The working questions are what the product is actually attacked by, and which of those attacks reaches the customer. For dry chikki it is moisture and crushing. For a stitched garment it is dirt and a crease. For a dairy it is temperature and time, and no pack at any price rescues a chain that was broken for three hours in the afternoon.</p>
<h2>Two traps in the returns habit</h2>
<ul>
<li><strong>Unlimited take back.</strong> A shop that can return anything at any time will order more than he can sell and let the surplus age on the shelf, which damages the product and the name before it comes back to you. Agree a window and a condition, and write both on the rate card.</li>
<li><strong>Replacing without recording.</strong> Every replacement should be entered against a batch code. Three replacements from the same code is information. Three replacements with no code is only a bad feeling.</li>
</ul>
<h2>Quality the customer cannot detect</h2>
<p>Not every improvement is worth its cost. Test a proposed change the way the customer will meet it: two packets in front of ten regular buyers, no explanation, and ask which they would pay two rupees more for. If they cannot tell the difference, the change is a cost you are carrying for your own satisfaction. Save that money for the changes they notice at once, which in a food unit are usually freshness, weight honesty and the pack staying sealed.</p>
<h2>The date, the code and the shelf you do not control</h2>
<p>Print the batch code so it is still legible after a week in a shop, and check on your delivery round that old stock is in front and new stock behind. The declarations that must appear on a food pack are a statutory matter and are covered where the rules are taught. What belongs here is the commercial half: stock that ages on somebody else's shelf is your reputation ageing in public, and the only person who will ever rotate it is you.</p>`,
      Expert: `<p>Recall card for quality, packing and repeat buying. Numbers, tables, rules, then the edge cases.</p>
<h2>The chikki decision, memorised</h2>
<table>
<thead><tr><th>Per packet</th><th>Thin wrap</th><th>Sealed pouch</th></tr></thead>
<tbody>
<tr><td>Net realisation after returns</td><td>₹18.80</td><td>₹19.70</td></tr>
<tr><td>Variable cost</td><td>₹14.00</td><td>₹15.30</td></tr>
<tr><td>Contribution</td><td>₹4.80</td><td>₹4.40</td></tr>
<tr><td>Packets a week</td><td>400</td><td>700</td></tr>
<tr><td>Contribution a week</td><td>₹1,920</td><td>₹3,080</td></tr>
</tbody>
</table>
<ul>
<li>Returns saved ₹0.90, pouch cost ₹1.30. The upgrade fails on breakage and passes on order size.</li>
<li>Repeat customer at two packets a month is about ₹105 of contribution a year. A sample costs ₹15.30.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Quality is sameness. The best batch you ever made is a problem if you cannot make it again.</li>
<li>No tolerance written means no specification, only an argument.</li>
<li>Check where the mistake is still one piece. First piece approved, then cut.</li>
<li>Cost the pack against what attacks the product, not against what looks impressive.</li>
<li>Count repeat buying by names, not by turnover. Turnover can rise while every buyer is new.</li>
<li>Replace on the spot, then read the code. Kindness first, enquiry immediately after.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>A change forced by a supplier.</strong> Treat it as a new product: sample it, tell the shops, and keep a note of the date it started so a later complaint can be placed.</li>
<li><strong>Festival demand.</strong> Output doubles, and so does variation. Fix the batch size rather than the working hours, because a bigger vessel is the commonest cause of a season of inconsistent stock.</li>
<li><strong>A hand made product.</strong> Variation is part of what is being bought, so specify the parts that must not vary, the weight, the finish and the measurement, and leave the rest alone.</li>
<li><strong>A shop that stores badly.</strong> Your product fails in his conditions. Reduce his order size to what turns over, rather than arguing about his shelf.</li>
</ul>
<h2>Checklist for one production day</h2>
<ol>
<li>Specification on the wall, tolerance stated on every line of it.</li>
<li>First piece checked and signed before the lot runs.</li>
<li>Batch code applied, and one line written in the batch register.</li>
<li>Dispatch check done, rejects set aside where the helpers can see them.</li>
<li>Any replacement given, entered against its batch code the same day.</li>
<li>Repeat rate counted at the close of the quarter, from the order list by name.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A tailoring unit has two helpers, and each one has a different idea of what a well finished blouse is. What makes a piece judgeable by somebody who did not make it?",
        options: [
          "The owner personally inspecting every piece before it leaves",
          "Paying the helpers per piece so that they take more care",
          "A written specification with the measurements, the finish and a stated tolerance on each",
          "Buying better cloth so that any finish looks acceptable",
        ],
        answer: 2,
        explanation:
          "A written specification with tolerances turns quality into something two people can check the same way, which is what lets work be judged without you. Personal inspection is the tempting answer because it feels rigorous, but it is still one person's opinion, it stops the moment you are away, and it teaches the helpers nothing they can apply on the next lot.",
        difficulty: "Easy",
        skill: "Product specification",
      },
      {
        n: 2,
        question:
          "A new jaggery supplier makes the chikki softer and sweeter. Tasters at the unit prefer it, and regular customers start complaining. What is the best explanation?",
        options: [
          "The new batch is of lower quality and the tasters are mistaken",
          "A repeat customer is buying the product they remember, so any unannounced variation reads as a defect",
          "The customers are objecting to the price rather than the product",
          "The complaints are unrelated to the change and will settle by themselves",
        ],
        answer: 1,
        explanation:
          "Repeat buyers match a packet against the one they liked last time, so a change they did not expect is experienced as the unit slipping, whichever way the change actually went. Assuming the new batch must be worse is the tempting reading, but the tasters were right and the mistake was making the change silently instead of sampling it and telling the shops in the same week.",
        difficulty: "Medium",
        skill: "Batch consistency",
      },
      {
        n: 3,
        question:
          "A sealed pouch costs ₹1.30 more than the present wrap and cuts returns from six per cent to one and a half per cent of a ₹20 supply price. On the returns saving alone, does the upgrade pay?",
        options: [
          "Yes, because returns fall by three quarters",
          "Yes, because the packet can now be sold at a higher price",
          "It cannot be worked out without knowing the retail price",
          "No, because the saving is about ₹0.90 against a cost of ₹1.30",
        ],
        answer: 3,
        explanation:
          "Six per cent of ₹20 is ₹1.20 and one and a half per cent is ₹0.30, so the saving is ₹0.90 against ₹1.30 of extra packing, and the decision fails on that comparison alone. A three quarter fall in returns is the tempting answer because the proportion sounds decisive, but a large percentage of a small number is still a small number, and the upgrade has to be justified by larger orders and longer shelf reach instead.",
        difficulty: "Medium",
        skill: "Packing cost per unit",
      },
      {
        n: 4,
        question: "What is the honest way for a micro unit to measure repeat purchase?",
        options: [
          "Take the named customers on the order list at the start of a period and count how many of those same names bought again inside it",
          "Check whether total monthly sales are rising",
          "Ask customers at the stall whether they intend to buy again",
          "Count how many shops have placed a second order",
        ],
        answer: 0,
        explanation:
          "Repeat purchase is a count of the same people buying twice, so it can only be measured against a list of names held from one period to the next. Rising monthly sales is the attractive substitute and the dangerous one, because turnover can climb for a year while every buyer is new, which is the most expensive way to grow and looks exactly like success until the market day stops working.",
        difficulty: "Medium",
        skill: "Repeat purchase rate",
      },
      {
        n: 5,
        question:
          "A customer returns a packet that has gone stale. The packet carries a batch code. What should the unit do?",
        options: [
          "Replace it and move on, since one bad packet in a large output is normal",
          "Ask the customer where the packet was stored before accepting it back",
          "Withdraw all stock from every shop until the cause is known",
          "Replace it at once, record the code, read that batch's record and hold back whatever is left of the same lot",
        ],
        answer: 3,
        explanation:
          "The code exists so that one complaint can be traced to a lot, which tells you whether you are looking at one packet or at four shelves of the same problem, and holding that lot is the cheap action taken early. Replacing and moving on is tempting because it settles the customer, but it throws away the only information the packet was carrying, and a full withdrawal at the other extreme punishes every lot for the fault of one.",
        difficulty: "Medium",
        skill: "Complaint handling",
      },
      {
        n: 6,
        question:
          "A shopkeeper currently takes three days of stock at a time and you want him to take a fortnight. What makes that possible?",
        options: [
          "A discount for placing a larger order",
          "A promise to take back anything that does not sell",
          "A pack that protects the product well enough that it still meets its claim at the end of the fortnight",
          "Delivering twice a week instead of once",
        ],
        answer: 2,
        explanation:
          "A shopkeeper orders small because he is protecting himself against stock that will not survive on his shelf, so the constraint is the pack and not the price. A discount is the tempting lever, but no discount makes a product last longer, and an unlimited take back offer simply moves the ageing stock and the loss back to you while your name sits on a stale packet in his shop.",
        difficulty: "Hard",
        skill: "Protective packaging",
      },
      {
        n: 7,
        question:
          "A tailoring unit has an order for sixty blouses in a new design. Where should the first quality check sit?",
        options: [
          "On one finished piece, approved against the written specification before the rest is cut",
          "After all sixty are cut, so that the lot is checked as a whole",
          "At delivery, when the buyer can inspect the pieces himself",
          "On a sample of ten pieces taken at random from the finished lot",
        ],
        answer: 0,
        explanation:
          "Checking one piece against the specification before cutting means a wrong measurement costs one piece of cloth, and the buyer's acceptance of that piece settles the argument before any money is spent. Checking the cut lot is the tempting option because it inspects more pieces, but by then the cloth is already cut to the wrong shape and the choice is between selling at a loss and losing the whole order.",
        difficulty: "Medium",
        skill: "Product specification",
      },
    ],
  },
  31617: {
    topicId: 31617,
    title: "Handling credit sales without sinking the business",
    summary:
      "Selling on credit makes you the lender in every transaction, and a unit that never wrote down who may owe how much, for how long and on which day loses its money in small courteous instalments. You build a credit policy for a Suryapet tailoring unit, read an ageing statement, work what a single bad debt costs in extra sales, and apply the one lever that actually collects.",
    concepts: [
      "Credit policy",
      "Customer credit limit",
      "Ageing statement",
      "Cash discount for early payment",
      "Collection ladder",
      "Bad debt and replacement sales",
    ],
    glossary: {
      "Credit sale":
        "Goods handed over against a promise to pay on a later stated day. It becomes revenue on the day of delivery and becomes money only on the day of collection, and every day in between is financed by you.",
      "Customer credit limit":
        "The largest amount you are willing to have outstanding with one customer at any moment. It is fixed before the first delivery and enforced by holding back the delivery that would cross it, not by a warning.",
      "Credit period":
        "The days between delivery and the day payment falls due, agreed as a stated date written on the bill rather than as a phrase such as month end, which every party reads differently.",
      "Ageing statement":
        "A list of what each customer owes, split into columns by how long each amount has been outstanding, so that a small old balance cannot hide behind a large recent one.",
      "Bad debt":
        "An amount you have stopped expecting. Its cost is not the amount alone: the margin on further sales has to earn it back before the unit stands where it did.",
      "Cash discount":
        "A reduction offered for payment on or before a stated early day. It is a price cut bought with speed, so it is judged by what the same days would cost you from a lender, not by how small the percentage looks.",
    },
    body: {
      Beginner: `<p>A credit sale is a delivery made against a promise. The goods have gone, the promise is in your book, and until the money comes you are the person financing that customer. Village trade runs on this and there is nothing wrong with it, but a unit that gives credit without rules is not selling, it is lending, and it is lending without asking any of the questions a lender asks.</p>
<h2>Three questions before the first delivery</h2>
<ul>
<li><strong>Who.</strong> Not everyone gets credit. A shop with a fixed address you deliver to every week is different from somebody who came to the market once.</li>
<li><strong>How much.</strong> Decide the largest amount you are willing to be owed by that person at any moment, and decide it while you are calm and he is not standing in front of you.</li>
<li><strong>By when.</strong> A date written on the bill. The words next month are not a date, and two people will remember them differently in six weeks.</li>
</ul>
<h2>Write it where both of you can see it</h2>
<p>Use a bill book with printed serial numbers and two copies. The customer keeps one and signs the other, and the amount and the due date are on both. A signature takes three seconds and settles every argument that could follow. Then keep one page per customer in a ledger, with what was delivered, what was paid and the balance carried down, so you can say the figure without searching.</p>
<h2>The polite habit that closes units</h2>
<p>The dangerous customer is not the one who refuses to pay. He is the one who pays a little, orders again, pays a little less, and stays friendly throughout. Every fresh delivery to him is your money going out while the old money has not come back, and by the time it is uncomfortable to raise, the amount is too large for him to clear at once even if he wants to.</p>
<h2>The one thing that works</h2>
<p>You have exactly one lever, and it is the next delivery. Say at the beginning, once, in an ordinary voice, that stock goes out when the previous bill is settled. A rule stated on day one is business. The same rule announced in the fourth month sounds like an accusation, and that is why owners who did not state it early end up unable to use it at all.</p>`,
      Intermediate: `<p>A credit policy is five decisions, taken once and written on one sheet: who is eligible, how much they may owe, for how many days, what is recorded, and what happens on the day they do not pay. Take the Suryapet tailoring unit, selling about ₹90,000 a month, of which ₹60,000 goes to three garment shops on thirty day terms and the rest is cash work for individual customers.</p>
<h2>Setting the limit</h2>
<p>A limit is the normal offtake during the credit period, plus a single delivery of room. The Suryapet town shop takes about ₹24,000 a month, so the limit is ₹26,000. The limit is not a target and it is not a courtesy. It is applied at the door: when that shop already owes ₹24,000 and asks for ₹9,000 of new stock, the delivery that goes out is the part that fits, or the full order once ₹7,000 of the old bill is collected on the spot. Both of those are ordinary trade. Sending ₹9,000 because the order is welcome takes your exposure to ₹33,000 and quietly makes the limit fiction.</p>
<h2>The ageing statement</h2>
<p>Once a month, split what you are owed by how old each amount is.</p>
<table>
<thead><tr><th>Shop</th><th>Not yet due</th><th>1 to 30 days over</th><th>31 to 60 over</th><th>Over 60</th><th>Total</th></tr></thead>
<tbody>
<tr><td>Suryapet town</td><td>₹24,000</td><td>0</td><td>0</td><td>0</td><td>₹24,000</td></tr>
<tr><td>Kodad</td><td>₹12,000</td><td>₹8,200</td><td>0</td><td>0</td><td>₹20,200</td></tr>
<tr><td>Huzurnagar</td><td>₹6,000</td><td>₹4,000</td><td>₹3,800</td><td>₹4,400</td><td>₹18,200</td></tr>
<tr><td><strong>Total</strong></td><td>₹42,000</td><td>₹12,200</td><td>₹3,800</td><td>₹4,400</td><td><strong>₹62,400</strong></td></tr>
</tbody>
</table>
<p>Credit sales are ₹2,000 a day, so ₹62,400 outstanding is about thirty one days, which against a thirty day term looks healthy. The single number is hiding the problem. Read the columns instead: the Suryapet shop owes the most and owes nothing late, while the Huzurnagar shop owes less and has ₹4,400 that is more than sixty days old. The oldest column is where collection starts, every month, whatever the totals say.</p>
<h2>The collection ladder</h2>
<ol>
<li>Three days before the due date, a message with the bill number, the amount and the date. Most late payment is forgetfulness, and this step alone collects a large part of it.</li>
<li>On the due date, collect in person on the delivery round, because a visit that is already happening costs nothing.</li>
<li>Seven days late, the next delivery waits until the bill is cleared. Said politely, said once, and actually applied.</li>
<li>Thirty days late, a written instalment plan with dates and amounts, and further supply only against cash.</li>
<li>Sixty days late, supply stops, you keep the signed delivery notes and an acknowledgement of the balance, and you continue to collect while treating the amount as doubtful in your own books.</li>
</ol>
<h2>Should you offer a discount for early payment</h2>
<p>Two per cent for payment within seven days instead of thirty buys you twenty three days. Annualise it: two divided by ninety eight, multiplied by three hundred and sixty five over twenty three, is about thirty two per cent a year. That is far dearer than working capital from a lender, so a standing early payment discount is usually the most expensive money in the business. Offer it only for a specific stretch, such as the weeks before a seasonal purchase, and withdraw it when the stretch ends.</p>`,
      Advanced: `<p>The policy is simple to write and hard to hold, because every breach of it arrives dressed as good business. What follows is the arithmetic and the judgement that make it possible to hold.</p>
<h2>What a bad debt actually costs</h2>
<p>Suppose the Huzurnagar shop's ₹18,200 is never collected. The unit earns about twenty five paise of contribution on a rupee of sales, and fixed costs take ₹15,000 a month, leaving roughly ₹7,500 of profit. That single loss is about two and a half months of profit, and to replace the cash it needs ₹18,200 divided by 0.25, which is <strong>₹72,800 of extra sales</strong>. That is more than three weeks of the unit's entire output, sold over again, to stand where it stood. This is the sentence to repeat to yourself at the door when a delivery would cross a limit.</p>
<h2>Concentration is a separate risk from ageing</h2>
<p>Look at the book as shares, not only as ages. If one shop is nearly forty per cent of everything you are owed, then that shop's difficulties are your difficulties, whatever his record has been. The remedy is not to refuse him: it is to keep a limit that is a share of the book rather than a share of his appetite, and to spend the season adding a fourth and fifth buyer so that the number falls on its own.</p>
<h2>Part payments must be applied to a bill</h2>
<p>A customer who owes three bills and hands over a round ₹5,000 has not told you which bill he has paid, and if you do not decide it, your ageing statement becomes fiction within two months. Apply payments to the oldest bill first, write the bill number on the receipt, and say so as a rule rather than as a decision made each time. Where a customer insists a payment is against a recent bill, record what he says and note it, because the pattern is worth seeing later.</p>
<h2>Credit given inside the family and the group</h2>
<p>A relative, a neighbour and a fellow group member all buy from you, and refusing them feels impossible. The workable answer is not to refuse, it is to keep the transaction visible: bill it, enter it in the same ledger, apply the same limit and the same due date. Money handed across without a bill is not generosity, it is an amount that cannot be discussed later by either side. Household lending is a decision you may take with your own drawings, from your own pocket, and it should never look like a sale in the unit's books.</p>
<h2>Judgement calls that decide a season</h2>
<ul>
<li><strong>A large order from a new buyer.</strong> Take part of it against an advance, deliver, collect, and then take the rest. A first order is the only time you have any negotiating position at all.</li>
<li><strong>A shop that pays late but reliably.</strong> Do not treat him as a defaulter. Reprice him: his terms are longer, so his rate is nearer the printed price, and if he objects he has just told you the delay was a choice.</li>
<li><strong>Non cash payment.</strong> A transfer receipt on the phone is proof; a cheque is a promise until it clears. Never send the next delivery in the same visit as a cheque you have not banked.</li>
<li><strong>Rewarding good payers without money.</strong> Give them first call on festival stock and on the new design. Scarcity is a reward that costs you nothing, unlike a discount, which costs you margin every time you use it.</li>
<li><strong>An old balance that will not move.</strong> Convert it into a written instalment plan with dates and get it signed. A schedule that is being kept is an asset; a lump that is being ignored is on its way to becoming a bad debt.</li>
</ul>
<h2>The one lever, and why it must be used early</h2>
<p>The next delivery is the only lever you have that costs nothing to pull, and it stops working as the balance grows, because at some point the customer owes more than he can clear and both of you know it. Used at seven days it is a routine business rule. Used at ninety days it is the end of a relationship and usually the end of the money as well.</p>`,
      Expert: `<p>Recall card for credit sales. Formulas, the worked book, the ladder, then the traps.</p>
<h2>Formulas</h2>
<table>
<thead><tr><th>Quantity</th><th>How it is worked</th></tr></thead>
<tbody>
<tr><td>Days outstanding</td><td>Amount owed, divided by credit sales per day</td></tr>
<tr><td>Credit limit for a customer</td><td>Normal offtake in the credit period, plus one delivery of room</td></tr>
<tr><td>Exposure</td><td>Everything delivered and unpaid, plus the order about to go out</td></tr>
<tr><td>Replacement sales for a bad debt</td><td>The bad debt, divided by contribution as a share of sales</td></tr>
<tr><td>Annualised cost of a cash discount</td><td>Discount over one hundred less the discount, times three hundred and sixty five over the days saved</td></tr>
<tr><td>Concentration</td><td>One customer's balance, as a share of the whole book</td></tr>
</tbody>
</table>
<h2>The worked book, memorised</h2>
<ul>
<li>Sales ₹90,000 a month, credit sales ₹60,000, so ₹2,000 a day. Owed ₹62,400, about 31 days on a 30 day term.</li>
<li>The over sixty column is ₹4,400 and sits with the smallest debtor. Read columns, not totals.</li>
<li>Contribution 25 paise in the rupee, fixed costs ₹15,000, profit about ₹7,500 a month.</li>
<li>A ₹18,200 bad debt is about two and a half months of profit and needs ₹72,800 of replacement sales.</li>
<li>Two per cent for twenty three days earlier is about thirty two per cent a year.</li>
</ul>
<h2>The ladder by days</h2>
<table>
<thead><tr><th>Day</th><th>Action</th></tr></thead>
<tbody>
<tr><td>Due date less three</td><td>Reminder with bill number, amount and date</td></tr>
<tr><td>Due date</td><td>Collect in person on the round</td></tr>
<tr><td>Plus seven</td><td>Next delivery held until the bill is cleared</td></tr>
<tr><td>Plus thirty</td><td>Written instalment plan, cash supply only</td></tr>
<tr><td>Plus sixty</td><td>Supply stops, balance acknowledged in writing, treated as doubtful</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>A credit sale is a loan you made without asking a lender's questions. Ask them first.</li>
<li>A date on the bill, not a phrase. Month end means five different days to five people.</li>
<li>The limit is enforced at the door or it does not exist.</li>
<li>Apply every part payment to the oldest bill and write the bill number on the receipt.</li>
<li>State the rule on day one. On day one it is business, in the fourth month it is an accusation.</li>
<li>The next delivery is the only lever. It loses power with every week you wait to use it.</li>
</ul>
<h2>Traps</h2>
<ul>
<li><strong>Growth on credit.</strong> Sales that rise only because terms loosened are a loan book, not a business.</li>
<li><strong>Round figure payments.</strong> Unapplied to a bill, they destroy the ageing statement within two months.</li>
<li><strong>One shop above a third of the book.</strong> The cure for concentration is a new buyer, not a stricter letter.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A tailoring unit earns twenty five paise of contribution on a rupee of sales. A shop's ₹18,200 becomes a bad debt. How much extra sales are needed just to replace that cash?",
        options: ["₹18,200", "₹22,750", "₹72,800", "₹4,550"],
        answer: 2,
        explanation:
          "Only the contribution on a sale is left after the variable costs are paid, so replacing ₹18,200 of lost cash needs that amount divided by 0.25, which is ₹72,800 of extra sales. Answering ₹18,200 is the natural slip, because it treats a rupee of sales as a rupee of recovery and forgets that three quarters of every fresh sale goes straight back out as cloth, thread and stitching.",
        difficulty: "Hard",
        skill: "Bad debt and replacement sales",
      },
      {
        n: 2,
        question:
          "A shop with a ₹26,000 credit limit already owes ₹24,000 and asks for ₹9,000 of new stock. What should the unit do?",
        options: [
          "Supply the full order, since a shop that is buying is a shop that is selling",
          "Refuse the order outright and end the relationship",
          "Supply in full and raise his limit to ₹33,000 to keep the record consistent",
          "Supply the part that fits under the limit, or collect against the old bill first and then supply in full",
        ],
        answer: 3,
        explanation:
          "A limit is enforced at the door, so the two honest moves are a part delivery or a collection on the spot that makes room for the full one, and both are ordinary trade rather than a confrontation. Supplying in full and raising the limit afterwards is the tempting option because the order is welcome, but a limit that moves whenever it is inconvenient is not a limit and will not stop the balance the day the shop is in difficulty.",
        difficulty: "Medium",
        skill: "Customer credit limit",
      },
      {
        n: 3,
        question:
          "One shop owes ₹24,000, none of it past its due date. Another owes ₹18,200, of which ₹4,400 is more than sixty days old. Which balance needs attention first?",
        options: [
          "The ₹24,000, because it is the larger exposure",
          "Neither, because the total owed is close to the thirty day term",
          "The ₹18,200, because an amount over sixty days old is the part least likely to be collected",
          "Both equally, since the totals are of the same order",
        ],
        answer: 2,
        explanation:
          "Ageing is read by column and not by total: money that has already survived sixty days past its date is the money most likely never to arrive, so collection starts there. Choosing the larger balance is the intuitive answer, but a large amount that is not yet due is behaving exactly as agreed, and the average of thirty one days that comforts you is arithmetic that hides its own worst column.",
        difficulty: "Medium",
        skill: "Ageing statement",
      },
      {
        n: 4,
        question:
          "You consider offering two per cent off for payment in seven days instead of thirty. What is the honest way to judge it?",
        options: [
          "Annualise it: two over ninety eight, times three hundred and sixty five over the twenty three days saved, which is about thirty two per cent a year",
          "It is only two per cent, so it is a small cost worth paying for faster money",
          "Compare it with the trade margin the shop already earns",
          "Offer it and see whether collections improve over a quarter",
        ],
        answer: 0,
        explanation:
          "A discount buys a fixed number of days, so its true cost only appears when it is annualised, and two per cent for twenty three days works out near thirty two per cent a year, dearer than working capital from a lender. Reading it as a small two per cent is the trap the number is designed to set, because the percentage is small while the period it buys is very short.",
        difficulty: "Hard",
        skill: "Cash discount for early payment",
      },
      {
        n: 5,
        question: "When does a rule that stock goes out only after the previous bill is settled actually work?",
        options: [
          "When it is introduced after a customer has begun delaying, so it is clearly justified",
          "When it is stated once at the start of the relationship in an ordinary voice, and then applied",
          "When it is written on the bill book but relaxed for good customers",
          "When it is applied only to new customers, since old ones have earned trust",
        ],
        answer: 1,
        explanation:
          "A rule stated on the first day is simply how you trade, so applying it later carries no insult and costs no relationship. Introducing it once somebody is already late is the common course and the weakest one, because at that moment it reads as an accusation about that person, which is exactly when an owner finds they cannot bring themselves to enforce it.",
        difficulty: "Easy",
        skill: "Credit policy",
      },
      {
        n: 6,
        question:
          "A regular shop is seven days past the due date on a bill and has placed a fresh order. What is the correct step on the ladder?",
        options: [
          "Deliver the fresh order and collect both bills at the end of the month",
          "Deliver at a higher price to compensate for the delay",
          "Hold the fresh delivery until the old bill is cleared, as stated at the outset",
          "Wait until sixty days before taking any action, since seven days is normal in trade",
        ],
        answer: 2,
        explanation:
          "Holding the next delivery is the only collection lever that costs you nothing, and it works at seven days precisely because the balance is still small enough for the shop to clear it. Delivering and collecting both later is the friendly answer and the expensive one, since it doubles your exposure to a customer who has just shown you that he is behind.",
        difficulty: "Medium",
        skill: "Collection ladder",
      },
      {
        n: 7,
        question:
          "A customer who owes three separate bills hands over a round ₹5,000 without saying which one it settles. What must you do?",
        options: [
          "Apply it to the oldest bill, write that bill number on the receipt, and follow the same rule every time",
          "Enter it as a payment on account and leave the bills as they are",
          "Divide it equally across the three bills so nobody is favoured",
          "Hold the money until the customer states which bill he intends to pay",
        ],
        answer: 0,
        explanation:
          "Applying every part payment to the oldest bill and recording the bill number keeps the ageing statement true, which is the only reason the statement is worth preparing. Entering it on account is the tempting shortcut, but after two months of unapplied round figures no column in the ageing tells you anything, and the oldest balances become invisible exactly when they most need to be seen.",
        difficulty: "Medium",
        skill: "Ageing statement",
      },
    ],
  },
};

export default PART;
