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
<li>The delivery round costs ₹400, which is ₹3.35 a pack. Torn and unsold bags run at about two per cent, another ₹1.30.</li>
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
};

export default PART;
