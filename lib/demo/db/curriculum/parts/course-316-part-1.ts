/**
 * Course 316: Start Your Rural Micro-Enterprise, part 1.
 *
 * Topics 31601 to 31604, module 316001 "Finding a business worth starting":
 * reading demand in your own mandal, the enterprises a village economy can
 * actually absorb, the twenty customer conversations that come before any
 * spending, and the choice between a service, a trading and a manufacturing
 * model.
 *
 * Written for a first time owner in a district town or a large village who has
 * no book keeping background and no family business behind them. Every method
 * here is countable on a sheet of paper in an afternoon, because the failure
 * this module exists to prevent is money spent on a machine before anybody
 * checked who would buy the output. Scheme names are structural; amounts,
 * subsidy shares and rates change and are never quoted.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31601: {
    topicId: 31601,
    title: "Spotting a demand where you already live",
    summary:
      "Demand is money that households in your catchment are already spending, not a need somebody agrees with when you describe it. You learn to measure that spending by counting leakage, competitors, seasons and the price people already pay, and to convert the count into a monthly figure you can plan against.",
    concepts: [
      "Demand leakage",
      "Catchment area",
      "Competitor density",
      "Capturable share",
      "Revealed willingness to pay",
      "Seasonality of demand",
    ],
    glossary: {
      "Catchment area":
        "The set of habitations whose residents can reach you without changing their normal day, usually a walk, a short auto ride or a stop they already make on the way to work.",
      "Demand leakage":
        "Spending that is earned inside your catchment and settled outside it, such as flour, tailoring or repair work bought on a trip to the mandal headquarters.",
      "Capturable share":
        "The part of total local spending on a product that could realistically move to you, after allowing for loyalty, credit given by the existing seller and plain habit. It is always well below the total.",
      "Competitor density":
        "The number of sellers of the same product per thousand households in the catchment. It decides whether a new unit finds room or only splits an existing trade further.",
      "Revealed willingness to pay":
        "The price a customer has actually paid recently, taken from a bill, a packet or a straight question about the last purchase, rather than the price they say they would accept.",
      "Seasonality index":
        "A twelve month picture of one enterprise's sales, marked high, normal or low against each month, used to check whether the good months can carry the dead ones.",
    },
    body: {
      Beginner: `<p>A business lives because people near you are already spending money on something and you take a share of that spending. That is what the word <strong>demand</strong> means here. It is not what a person likes the sound of. It is what they pay for, week after week, out of a household budget that does not grow just because you opened a shop.</p>
<h2>Start with the money that leaves your village</h2>
<p>Stand near the bus stop on a market day and watch what people carry back. Flour in a printed packet, a readymade blouse, a jar of pickle, a mixer that went for repair. Every one of those is money your mandal earned and then spent somewhere else. That is called <strong>leakage</strong>, and it is the easiest demand for a first unit to catch, because the customer is already buying the item. You are only changing where they buy it.</p>
<h2>Count, do not guess</h2>
<ol>
<li>Pick one product. Say a kilo of millet flour.</li>
<li>Ask thirty households two questions: do you buy it, and how much do you use in a month.</li>
<li>Write down what they say. Do not improve the answer in your head.</li>
<li>Multiply the average by the number of households you can actually reach.</li>
</ol>
<p>Suppose twenty one of the thirty buy it, and those who buy use about three kilos a month. Your village has 800 households. Twenty one out of thirty is seven in ten, so about 560 households, and 560 times three is about 1,680 kilos a month in the whole village. Now cut that in half, because most people will not change their shop for a stranger. Around 800 kilos a month is the figure you plan against.</p>
<h2>Then count who already sells it</h2>
<p>Walk the main road and count the sellers of the same thing. Two tailors in a village of 800 households is a gap. Six tailors is a crowded trade, and the seventh person earns less than all six of them do. This counting takes one afternoon and saves you a year.</p>
<h2>Ask when, not only whether</h2>
<p>Demand moves with the calendar. Tailoring rises before festivals and weddings and falls during sowing. Milk sells every day of the year. A snack unit outside a school earns nothing for two months of holidays. Write the twelve months on a page and mark each one high, normal or low. A trade that is dead for three months has to earn its whole year in nine.</p>`,
      Intermediate: `<p>Demand work is arithmetic, not intuition. You are trying to arrive at one number, the monthly quantity you can expect to sell, built from figures you counted yourself. Four steps get you there, and each one shrinks the estimate.</p>
<h2>Step 1: draw the catchment before you count anything</h2>
<p>Take a sheet and list every habitation whose people can reach your location without altering their day: your own village, the hamlets within a walk, the two villages on the same bus route, the weekly market you already attend. Write the number of households beside each. That total, not the district population, is your <strong>catchment</strong>. A unit in Siddipet mandal that lists the whole mandal is already planning against a number it will never serve.</p>
<h2>Step 2: measure the leakage</h2>
<p>Interview thirty households spread across the catchment, not thirty of your neighbours. For your product ask three things: do you buy it, how much per month, and where did you buy it last. The third question is the one that matters. Purchases made outside the catchment are leakage and are the demand most easily won, because the buyer is already convinced of the product and is only tolerating the travel.</p>
<h2>Step 3: convert to a monthly quantity, then cut it</h2>
<p>Work a dairy example in Karimnagar district. Your catchment has 1,200 households. Of thirty asked, eighteen buy curd or paneer from outside at least weekly, and those who do spend around ₹240 a month on it.</p>
<ul>
<li>Buying households: eighteen in thirty, that is 60 percent of 1,200, so 720 households.</li>
<li>Total local spending: 720 multiplied by ₹240, which is ₹1,72,800 a month.</li>
<li><strong>Capturable share</strong> in year one: assume one in four of those households actually switches, so ₹43,200 a month.</li>
<li>That is your planning revenue. Every cost, margin and break-even calculation later in this course sits on it.</li>
</ul>
<p>The quarter is not a rule handed down to you. It is a starting assumption you must justify in writing, and it should fall if the existing seller gives credit, is a relative of half the village, or sells at a price you cannot match.</p>
<h2>Step 4: check density and season before you commit</h2>
<p>Divide the number of existing sellers by the catchment households and express it per thousand. Three tailoring units serving 1,200 households is roughly two and a half per thousand, which is a working trade with room only if you take a segment nobody covers, such as school uniforms or blouse stitching with a two day turnaround. Ten per thousand means the trade is already splitting thin.</p>
<p>Then build the <strong>seasonality index</strong>. Mark each of the twelve months high, normal or low from what sellers tell you, not from what you expect. A tailoring unit in a mandal town typically runs high for the festival and wedding weeks, normal for perhaps five months and low through the peak agricultural weeks when the same households are in the field and short of cash. Your annual estimate is the sum of twelve honest months, never the best month multiplied by twelve.</p>`,
      Advanced: `<p>Most first units do the demand work and still get the number wrong, because the survey was designed to produce agreement rather than evidence. The traps below account for the bulk of the gap between a projected sale and the first quarter's actual sale.</p>
<h2>Stated demand is not revealed demand</h2>
<p>Ask a neighbour whether she would buy clean, locally milled millet flour and she will say yes, because refusing is rude and the question costs her nothing. Ask what she paid for flour last week and where, and you get a fact. Design every question so the answer is a past action:</p>
<ul>
<li>Not "would you buy" but "what did you buy last, and for how much".</li>
<li>Not "is the town price high" but "what do you pay, and how often do you go".</li>
<li>Not "would you prefer a nearer tailor" but "how many garments did you stitch last year, and where".</li>
</ul>
<p>This is the difference between <strong>revealed willingness to pay</strong> and polite agreement, and it is worth more than the size of your sample.</p>
<h2>The four ways a real demand still cannot be captured</h2>
<table>
<thead><tr><th>Obstacle</th><th>What you see</th><th>What it does to your share</th></tr></thead>
<tbody>
<tr><td>Credit from the incumbent</td><td>The kirana writes purchases in a book and settles after harvest</td><td>You are selling for cash against a seller who sells for time. Households stay with him even at a higher price.</td></tr>
<tr><td>Bundling</td><td>The town shop supplies flour, oil and provisions in one trip</td><td>Your single product does not remove the trip, so it does not remove the leakage.</td></tr>
<tr><td>Relationship and caste or kinship ties</td><td>Everybody buys milk from two families</td><td>Share moves slowly and only on a clear quality or convenience difference.</td></tr>
<tr><td>Payment timing</td><td>Customers pay monthly, you pay for raw material weekly</td><td>Demand is real, but it lands in your books as a cash gap rather than as income.</td></tr>
</tbody>
</table>
<h2>Catchment overlap with a larger town</h2>
<p>A unit sited within a short bus ride of a district headquarters does not have the catchment it drew. Households on that route already travel for other reasons, so their purchase can be made in town at no extra cost to them. Test it directly: ask how many times a month the household travels there anyway. If the answer is four or more, treat that habitation as contested and count perhaps half its households in your capturable share.</p>
<h2>Demand that exists only while a scheme lasts</h2>
<p>Some local demand is created by a programme: an institutional supply order, a mid day meal requirement, an anganwadi supply, a training batch that needs uniforms. That demand is real and worth serving, and it is not permanent, because the tender terms and the programme design get revised. Never build fixed capital that only pays back if that single buyer continues. Serve it with capacity you could redirect to the open market inside a month.</p>
<h2>What the incumbent does after you open</h2>
<p>You will not be pricing against today's price. You will be pricing against the price the existing seller sets once you are open, and a seller who has recovered his machine cost years ago can hold a low price far longer than you can. Assume a response of roughly a tenth off his current price for the first three months and check that your break-even still holds. If it does not, your advantage has to be something other than price: turnaround time, quality of grinding, a doorstep drop, or a product he does not stock at all.</p>`,
      Expert: `<p>A demand note is one page and it is what a banker, a mentor or your own second reading will look for. Everything below is either a check to run or a line to be able to defend.</p>
<h2>The one page demand note</h2>
<table>
<thead><tr><th>Line</th><th>Source</th><th>Common failure</th></tr></thead>
<tbody>
<tr><td>Catchment households</td><td>Named habitations, counted</td><td>Mandal or district population used instead</td></tr>
<tr><td>Percentage who buy</td><td>Thirty household survey</td><td>Sample taken from neighbours and relatives</td></tr>
<tr><td>Monthly spend per buying household</td><td>Last purchase, not opinion</td><td>The figure the owner hoped for</td></tr>
<tr><td>Total local spending</td><td>Multiply the two above</td><td>Arithmetic on the best month</td></tr>
<tr><td>Capturable share</td><td>Stated assumption with a reason</td><td>No cut applied at all</td></tr>
<tr><td>Sellers per thousand households</td><td>Counted on foot</td><td>Only the shops on the main road counted</td></tr>
<tr><td>Twelve month seasonality</td><td>Asked of existing sellers</td><td>Annual figure taken as best month times twelve</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Demand is a past payment. If your evidence is a future intention, you have an opinion, not demand.</li>
<li>Total spending is not your revenue. Write the share you claim and the reason you claim it, on the same line.</li>
<li>Count the sellers before you count the buyers. A crowded trade is the cheaper discovery.</li>
<li>Leakage is the softest demand to win, because the customer is already sold on the product.</li>
<li>A trade with three dead months earns its year in nine. Plan the wage of those three months before you start.</li>
</ul>
<h2>Signals ranked by how much they are worth</h2>
<ol>
<li>An advance paid, or an order written down and signed. Strongest.</li>
<li>A recent purchase of the same item, with the price and place stated.</li>
<li>A journey regularly made to buy it elsewhere.</li>
<li>A complaint about the existing seller from someone who still buys from him.</li>
<li>Agreement with your idea. Worth nothing on its own.</li>
</ol>
<h2>Edge cases worth carrying</h2>
<ul>
<li>Weekly market demand and daily demand are different businesses. A haat stall sells volume once and holds stock for six days.</li>
<li>Perishable products shrink the catchment to the distance the product survives, which for curd in summer may be a few kilometres.</li>
<li>An institutional buyer looks like large demand and behaves like a single point of failure. Count it separately from household demand.</li>
<li>A product bought by men and a product bought by women reach you through different conversations. Survey the person who actually makes the purchase.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Your catchment has 1,200 households. Of thirty surveyed, eighteen buy curd from outside weekly, spending about ₹240 a month each. You assume one in four will switch to you. What monthly revenue do you plan against?",
        options: ["₹2,88,000", "₹1,72,800", "₹7,200", "₹43,200"],
        answer: 3,
        explanation:
          "Eighteen in thirty is 60 percent of 1,200, so 720 buying households, times ₹240 gives ₹1,72,800 of total local spending, and a quarter of that is ₹43,200. The ₹1,72,800 option is the tempting one because it is the number the survey produces, but planning against total local spending assumes every buyer abandons their present seller at once, which no first unit achieves.",
        difficulty: "Medium",
        skill: "Capturable share",
      },
      {
        n: 2,
        question:
          "Which single question gives you the strongest evidence of demand for a millet flour unit?",
        options: [
          "Would you buy clean, locally milled millet flour if it were available here",
          "Do you agree that flour from the town is expensive",
          "Where did you buy flour last, and what did you pay for it",
          "Would you prefer a mill in your own village",
        ],
        answer: 2,
        explanation:
          "Asking where the last purchase was made and at what price returns a past action, which is revealed willingness to pay and can be counted. The first option is tempting because it sounds specific, but it asks about a future intention that costs the respondent nothing to agree with, so it collects politeness rather than evidence.",
        difficulty: "Easy",
        skill: "Revealed willingness to pay",
      },
      {
        n: 3,
        question:
          "A trainee plans a tailoring unit and defines her catchment as the whole mandal, population about 48,000. What is wrong with that?",
        options: [
          "A catchment is the area people can reach without changing their normal day, which is far smaller",
          "The mandal is too small a unit for any enterprise",
          "Catchment should always be measured in acres rather than households",
          "Nothing is wrong, because a larger catchment gives a safer estimate",
        ],
        answer: 0,
        explanation:
          "The catchment is the set of habitations whose residents can reach you on a walk, a short ride or a stop they already make, so it is usually a handful of villages and not an administrative boundary. Treating a larger area as safer is the trap: it inflates every downstream figure, and the machine gets bought against households who will never visit.",
        difficulty: "Easy",
        skill: "Catchment area",
      },
      {
        n: 4,
        question:
          "Six tailoring units already serve a catchment of 1,200 households. What does that density tell a new entrant?",
        options: [
          "The trade is proven, so a seventh unit will earn the same as the others",
          "At five units per thousand households the trade is already split thin, so entry needs a segment nobody covers",
          "Density is irrelevant as long as the survey shows households buy tailoring",
          "Six units means demand is high enough to support any number of new units",
        ],
        answer: 1,
        explanation:
          "Six units against 1,200 households is five per thousand, and the seventh entrant does not add demand, it divides the same spending further, so entry has to rest on an uncovered segment such as uniforms or a guaranteed turnaround. The first option is the attractive error: existing sellers prove the product sells, but they also prove the spending is already claimed.",
        difficulty: "Medium",
        skill: "Competitor density",
      },
      {
        n: 5,
        question:
          "Households in your village buy flour, oil and provisions on one weekly trip to the mandal town. You plan to sell flour only. What does this do to your capturable share?",
        options: [
          "It raises it, because the households are proven buyers of flour",
          "It has no effect, since you are cheaper than the town shop",
          "It lowers it, because your product does not remove the trip that causes the leakage",
          "It lowers it only if the town shop reduces its price",
        ],
        answer: 2,
        explanation:
          "The leakage is caused by a bundled trip, so removing one item from the basket leaves the journey intact and the household continues to buy flour at the same place while it is there. Being cheaper is the tempting answer, but price does not compensate for a trip the customer is making anyway for four other reasons.",
        difficulty: "Hard",
        skill: "Demand leakage",
      },
      {
        n: 6,
        question:
          "A snack unit outside a school records its best month at ₹60,000 of sales. What is the correct way to estimate the year?",
        options: [
          "₹60,000 multiplied by twelve, because capacity is proven",
          "₹60,000 multiplied by ten, taking two months as a standard allowance",
          "The best month and the worst month averaged, then multiplied by twelve",
          "Sum of twelve months each marked high, normal or low, including the school holiday months",
        ],
        answer: 3,
        explanation:
          "The annual figure is the sum of twelve separately estimated months, because a school linked unit earns nothing during holidays and that gap has to appear in the plan rather than in a surprise. Multiplying the best month by twelve is the standard first time error: it treats a peak as the normal state and produces a repayment schedule the enterprise cannot meet.",
        difficulty: "Medium",
        skill: "Seasonality of demand",
      },
    ],
  },
  31602: {
    topicId: 31602,
    title: "Ten enterprises that work in a village economy",
    summary:
      "Ten families of enterprise keep working in a district economy because each one sits on a raw material, a skill or a crowd that is already there. You learn to read each of them against capital intensity, the cash cycle, perishability and how much output the local market can absorb, so that the shortlist is made on constraints rather than on preference.",
    concepts: [
      "Backward linkage",
      "Capital intensity",
      "Absorption capacity",
      "Perishability",
      "Idle capacity",
      "Enterprise shortlisting",
    ],
    glossary: {
      "Backward linkage":
        "The supply behind your unit: the grain, milk, cloth or scrap that has to arrive before you can produce anything. A short backward linkage means the input is grown or made within a few kilometres.",
      "Capital intensity":
        "How much money has to be sunk into machines, structure and deposits before the first sale, measured against the monthly sales the unit can then produce.",
      "Absorption capacity":
        "The quantity a local market can take at your price before you must either travel further to sell or cut the price.",
      Perishability:
        "The time an output stays saleable. It sets the maximum distance to a customer, the need for cold storage, and how fast a stoppage turns stock into loss.",
      "Idle capacity":
        "Machine or working hours you paid for and did not sell. A mill that runs four hours a day carries the same instalment as one that runs twelve.",
      "Custom hiring":
        "Renting out equipment by the hour, acre or trip instead of selling a product, so the owner earns from the machine's utilisation rather than from a manufactured good.",
    },
    body: {
      Beginner: `<p>There is no secret list of businesses that always succeed. There is a shorter question: what does this place already need every week, and can you make it or do it with the money, skill and space you have. The ten families below keep working in a district economy, and each one is here for a reason you can check for yourself.</p>
<h2>The ten</h2>
<ol>
<li><strong>Grain and millet milling.</strong> Households eat grain every day. Milling and clean packing turn grain into flour worth more than the grain was.</li>
<li><strong>Tailoring and garment stitching.</strong> School uniforms, blouses, alterations. The skill is the machine, and the machine is affordable.</li>
<li><strong>Dairy value addition.</strong> Curd, paneer, buttermilk and ghee made from milk collected within a few kilometres.</li>
<li><strong>Small food unit.</strong> Pickles, chilli and masala powders, karam podi, fried snacks made in a clean kitchen to a fixed recipe.</li>
<li><strong>Backyard poultry or goat rearing.</strong> Live sales at festivals and at the weekly market, with feed grown or bought locally.</li>
<li><strong>Nursery and seedling raising.</strong> Vegetable and horticulture seedlings sold to farmers at the start of a season.</li>
<li><strong>Custom hiring of farm machinery.</strong> A sprayer, thresher, rotavator or tractor rented by the acre or the hour to farmers who cannot buy one.</li>
<li><strong>Motor rewinding and pump repair.</strong> Every borewell, every mill and every mixer has a motor, and motors burn out.</li>
<li><strong>Tent house and catering supply.</strong> Chairs, shamiana, vessels and lighting hired out for weddings and functions.</li>
<li><strong>Vermicompost and bio-input unit.</strong> Cattle dung and crop waste turned into compost sold by the bag to farmers nearby.</li>
</ol>
<h2>Why these and not others</h2>
<p>Each one sits on something that is already present around you: grain, milk, land, cattle waste, a crowd at a function, or a machine that keeps breaking. The supply side is called the <strong>backward linkage</strong>, and a short one means you are not paying lorry freight before you have earned a rupee.</p>
<h2>Two checks before you pick one</h2>
<p>The first is money. Ask what has to be bought before the first sale. A tailoring unit starts with a machine and some cloth. A milling unit starts with a mill, a shed, a power connection and a stock of grain, which is several times more.</p>
<p>The second is how much your area can take. If your village drinks a fixed number of litres of milk a day, a bigger vessel does not create more drinking. That limit is called <strong>absorption capacity</strong>, and a first unit should be built to fill it, not to beat it.</p>`,
      Intermediate: `<p>Read the ten as a table rather than a list. Four columns decide almost everything: what has to be bought before the first sale, how quickly money comes back, how far the output can travel, and what permission the activity needs. Compare on those and the shortlist writes itself.</p>
<h2>The ten against four constraints</h2>
<table>
<thead><tr><th>Enterprise</th><th>Capital intensity</th><th>Cash cycle</th><th>Reach of output</th></tr></thead>
<tbody>
<tr><td>Grain and millet milling</td><td>High: mill, shed, power load, grain stock</td><td>Medium, stock sits before it sells</td><td>Wide, flour keeps for weeks if packed dry</td></tr>
<tr><td>Tailoring and garment unit</td><td>Low: machines and thread</td><td>Short, paid on delivery</td><td>Local, the customer comes for fitting</td></tr>
<tr><td>Dairy value addition</td><td>Medium: vessels, chiller, packing</td><td>Very short, daily sale</td><td>Small, perishability limits it to a few kilometres</td></tr>
<tr><td>Small food unit</td><td>Medium: kitchen, sealing, licence</td><td>Medium, retailers pay on cycle</td><td>Wide once shelf life and labelling are right</td></tr>
<tr><td>Poultry or goat rearing</td><td>Medium: shed, stock, feed</td><td>Long, one grow out cycle</td><td>Local market and traders</td></tr>
<tr><td>Nursery and seedlings</td><td>Low to medium: shade net, trays, water</td><td>Seasonal, tied to sowing</td><td>Local, seedlings travel badly</td></tr>
<tr><td>Custom hiring of machinery</td><td>Very high: the machine itself</td><td>Short per job, long to repay</td><td>Villages within a working radius</td></tr>
<tr><td>Motor rewinding and repair</td><td>Low: tools, winding wire, bench</td><td>Immediate, cash on collection</td><td>Local, the customer carries the motor in</td></tr>
<tr><td>Tent house and catering supply</td><td>High: stock of goods, transport</td><td>Short but advance based</td><td>A district radius by tempo</td></tr>
<tr><td>Vermicompost unit</td><td>Low: beds, worms, shade</td><td>Long, one full cycle before sale</td><td>Local farms, freight kills distance</td></tr>
</tbody>
</table>
<h2>Absorption is the number people skip</h2>
<p>Work it for a millet processing unit in a Jagtial mandal. Say your catchment eats about 800 kilos of millet flour a month, and you expect to hold a quarter of that in year one, which is 200 kilos. A small mill can produce that in a morning. So the mill is not the constraint, the market is, and the correct first purchase is the smallest mill that meets 200 kilos with room to grow, not the model the dealer recommends.</p>
<p>The same arithmetic saves a dairy owner. If the surrounding hamlets buy roughly 60 litres of curd a day and two sellers already supply them, a plan to set 200 litres a day is not ambition, it is stock that will sour.</p>
<h2>Match the enterprise to your own constraints</h2>
<ul>
<li><strong>Power.</strong> A mill, a chiller and a rewinding bench need a reliable three phase or single phase load and a sanctioned connection. If your supply is weak for four hours a day, choose an enterprise that can work around it or budget for the standby.</li>
<li><strong>Water.</strong> A food unit, a nursery and a dairy all consume clean water daily. A borewell that runs dry in April makes the plan seasonal whether you intended it or not.</li>
<li><strong>Space and neighbours.</strong> Goat sheds, compost beds and a tent house godown need land you control and neighbours who will not object.</li>
<li><strong>Your own hours.</strong> Dairy and poultry are seven day activities with no holiday. Tailoring and repair can be closed for a day without loss.</li>
</ul>`,
      Advanced: `<p>Each of these families has a characteristic way of failing, and the failure is rarely in the product. It is in utilisation, in the cash cycle, or in a constraint the owner did not price. Learn the failure mode with the enterprise.</p>
<h2>The machine businesses fail on utilisation</h2>
<p>Milling, custom hiring and tent house are all bought capacity. Their cost per unit of output is fixed instalment divided by hours actually sold, so <strong>idle capacity</strong> is the whole risk. A thresher hired out for forty days of a season carries twelve months of instalment. Before buying, count the working days honestly: the days the crop is ready, minus rain days, minus the days the machine is under repair, minus the days a neighbouring owner takes the job first. If the payback needs more days than the season contains, the machine is wrong even though the demand is real.</p>
<h2>The living businesses fail on the cycle, not on the sale</h2>
<p>Poultry, goats and nursery raising all put money in at the start and take it out at the end of a biological cycle you cannot shorten. Feed is bought weekly, income arrives once. That mismatch is a working capital problem long before it is a profit problem, and it is why owners in these trades borrow at the worst moment, halfway through a batch, when the animal cannot be sold and the feed shop wants payment. Plan the whole cycle's input cost as capital, not as a monthly expense.</p>
<h2>The perishable businesses fail on distance and on stoppage</h2>
<p>Curd, paneer and leafy seedlings carry a clock. <strong>Perishability</strong> sets your maximum selling radius, and it also decides what a breakdown costs. A power cut of one night in a dairy unit is not lost production, it is lost stock plus lost raw material plus a customer who found another supplier that morning. Where you cannot control the failure, control the exposure: hold less stock, take standing orders, and sell the first output before you produce the second.</p>
<h2>Licence fit is part of the choice, not a later step</h2>
<table>
<thead><tr><th>Activity</th><th>What it genuinely attracts</th><th>Common misunderstanding</th></tr></thead>
<tbody>
<tr><td>Any enterprise</td><td>Udyam registration, which is a self declared identity for the unit</td><td>Treated as a licence to operate; it is a registration, and it is not a permission</td></tr>
<tr><td>Food processing, dairy, pickles, snacks</td><td>A food business registration or licence graded by turnover, plus labelling rules</td><td>Owners assume a home kitchen is exempt when the product is packed and sold</td></tr>
<tr><td>Packed goods sold by weight</td><td>Legal metrology requirements on the declaration printed on the pack</td><td>The scale is stamped but the pack carries no net quantity or address</td></tr>
<tr><td>Milling, workshop, any premises</td><td>Local body trade licence, plus power at a commercial or industrial tariff</td><td>Running an industrial load on a domestic connection until it is caught</td></tr>
</tbody>
</table>
<h2>Two traps in the shortlist itself</h2>
<p>The first is the family labour illusion. A plan that shows profit only because your wife, your brother and you draw no wage is not profitable, it is subsidised by unpaid work, and it will collapse the day one of those people takes a job. Cost every worker including yourself.</p>
<p>The second is copying the visible unit. The mill in the next village looks profitable because you see the queue, not the instalment, and not the fact that it was bought second hand nine years ago. When you copy a neighbour, copy the enterprise, never the price he charges, because his capital cost and yours are different numbers.</p>`,
      Expert: `<p>Shortlisting is a scoring exercise you should be able to run on one page in an hour. Score each candidate enterprise out of three on each row and stop at the two highest.</p>
<h2>The shortlist score sheet</h2>
<table>
<thead><tr><th>Row</th><th>Score 3</th><th>Score 1</th></tr></thead>
<tbody>
<tr><td>Backward linkage</td><td>Input available within the mandal all year</td><td>Input bought from another district</td></tr>
<tr><td>Skill already held</td><td>You can do the work yourself today</td><td>You must hire the only skilled person in the area</td></tr>
<tr><td>Capital needed before first sale</td><td>Within your own funds plus a small loan</td><td>Needs a term loan larger than your annual sales</td></tr>
<tr><td>Cash cycle</td><td>Paid within a week of production</td><td>Paid after a full biological or credit cycle</td></tr>
<tr><td>Absorption in the catchment</td><td>Local demand exceeds your planned output</td><td>You must reach a distant market from day one</td></tr>
<tr><td>Utilisation of the main asset</td><td>Asset earns most working days</td><td>Asset earns in one short season</td></tr>
<tr><td>Compliance fit</td><td>Registration and a trade licence</td><td>Food, effluent and metrology all in play at once</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Buy capacity to fit the market you counted, not the market you hope for. Idle capacity carries a full instalment.</li>
<li>Perishability sets your selling radius before any lorry does.</li>
<li>A long biological cycle is a working capital line, not a monthly expense.</li>
<li>Registration is identity, a licence is permission, and a tariff is neither. Check all three.</li>
<li>If the plan only works with unpaid family labour, it does not work.</li>
</ul>
<h2>Edge cases worth carrying</h2>
<ul>
<li>Custom hiring competes with a neighbour's own machine sitting idle, so the real rate is set by what he will accept, not by your cost.</li>
<li>A nursery sells against a sowing window measured in days. Miss it and the stock is not delayed income, it is dead stock.</li>
<li>Milling can be run as a service on the customer's own grain, which removes the grain stock from your working capital entirely and changes the whole plan.</li>
<li>Compost and feed businesses look cheap because the raw material is free, then fail on the cost of moving bulk over even short distances.</li>
<li>Tent house income is advance based, which flatters the cash book. The advance is a liability until the function is served.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Your catchment consumes about 800 kilos of millet flour a month and you expect a quarter of it in year one. A dealer recommends a mill sized for 3,000 kilos a month. What should decide the purchase?",
        options: [
          "The 200 kilos the market can absorb, choosing the smallest mill that meets it with room to grow",
          "The dealer's recommendation, since spare capacity costs nothing to own",
          "The 800 kilos of total consumption, since you may eventually serve all of it",
          "The largest mill your loan sanction will cover",
        ],
        answer: 0,
        explanation:
          "Capacity is bought against the quantity the market can absorb, which is 200 kilos in year one, so the smallest mill that covers it with headroom is the correct purchase. Buying against total consumption is the tempting error: the extra capacity does not create customers, but it does carry a full instalment every month whether it runs or not.",
        difficulty: "Medium",
        skill: "Absorption capacity",
      },
      {
        n: 2,
        question:
          "A thresher is hired out for about forty working days in a season. Why is that number the central figure in the purchase decision?",
        options: [
          "Because hire rates are always fixed per day by the local body",
          "Because a machine used fewer than fifty days a year needs no maintenance",
          "Because demand for threshing is unrelated to the crop calendar",
          "Because the instalment runs for twelve months while earnings occur on those forty days, so the cost per day of use is set by utilisation",
        ],
        answer: 3,
        explanation:
          "A bought machine is fixed cost divided by hours actually sold, so forty earning days must carry a full year of instalment, maintenance and idle time. The tempting wrong answer is that light use means no maintenance, but a machine standing through a monsoon still needs servicing, and the instalment falls due in every one of those idle months.",
        difficulty: "Medium",
        skill: "Idle capacity",
      },
      {
        n: 3,
        question:
          "A dairy owner plans to supply curd to a town 40 kilometres away in May, with no chilling in transport. What is the governing constraint?",
        options: [
          "Perishability, which sets the maximum distance the output can travel before it is unsaleable",
          "Capital intensity, because vessels cost more than a mill",
          "Backward linkage, because milk is not available locally",
          "Competitor density in the destination town",
        ],
        answer: 0,
        explanation:
          "Curd carries a clock, and without a cold chain the selling radius is set by how long the product survives in summer heat rather than by the road distance. Competitor density in the town is a genuine concern, but it only matters if the product arrives saleable, and here it will not.",
        difficulty: "Easy",
        skill: "Perishability",
      },
      {
        n: 4,
        question:
          "Which of these enterprises has the shortest backward linkage for an owner in a Nizamabad village with dairy cattle in the hamlet?",
        options: [
          "A garment unit stitching to a design supplied from Hyderabad",
          "A mobile accessory shop stocking goods from a city wholesaler",
          "A tent house buying shamiana and chairs from a distributor in another district",
          "A curd and paneer unit buying milk from households within two kilometres",
        ],
        answer: 3,
        explanation:
          "The backward linkage is the supply chain behind the unit, so milk collected within two kilometres is the shortest of the four and needs no freight before the first sale. The tent house is tempting because it also serves purely local customers, but its inputs are bought from outside the district, and it is the input side that defines a backward linkage.",
        difficulty: "Easy",
        skill: "Backward linkage",
      },
      {
        n: 5,
        question:
          "A poultry plan shows a profit only because the owner, his wife and his brother draw no wages. How should this be treated?",
        options: [
          "As a genuine cost advantage that the plan can rely on",
          "As unpaid labour that must be costed, because the plan collapses when any of them takes paid work",
          "As a saving to be shown separately as subsidy income",
          "As irrelevant, since family labour is normal in rural units",
        ],
        answer: 1,
        explanation:
          "Every worker including the owner must be costed at a realistic wage, because an enterprise that is only viable while three people work free is being subsidised by that unpaid work rather than earning. Calling it a cost advantage is the common error, and it hides the fact that the first person to take an outside job removes the entire margin.",
        difficulty: "Medium",
        skill: "Enterprise shortlisting",
      },
      {
        n: 6,
        question:
          "Which change removes grain stock from a milling unit's working capital altogether?",
        options: [
          "Milling the customer's own grain as a service and charging a milling rate",
          "Buying the mill second hand instead of new",
          "Selling flour only in the weekly market rather than daily",
          "Registering the unit under Udyam before starting operations",
        ],
        answer: 0,
        explanation:
          "If the customer brings the grain, you never buy it, so the largest recurring item in a mill's working capital disappears and you are selling machine time instead of a product. Buying the mill second hand reduces fixed capital, which is a different line altogether and does nothing about the money tied up in grain stock.",
        difficulty: "Hard",
        skill: "Capital intensity",
      },
    ],
  },
  31603: {
    topicId: 31603,
    title: "Talking to twenty possible customers first",
    summary:
      "Twenty structured conversations, done before any machine is bought, tell you more than a year of planning because each one records a past purchase rather than an opinion. You learn the question script, how to spread the twenty so the answers are not all from people who wish you well, and how to end each conversation with something the person is willing to commit.",
    concepts: [
      "Customer interview",
      "Leading question",
      "Sample spread",
      "Pre-commitment",
      "Disconfirming evidence",
      "Tally sheet",
    ],
    glossary: {
      "Leading question":
        "A question whose wording contains the answer you want, such as asking whether someone would like a cheaper option nearby. It produces agreement and destroys the value of the interview.",
      "Sample spread":
        "The deliberate distribution of your twenty conversations across hamlets, ages, incomes and buying roles, so that the answers describe the market rather than describing your circle.",
      "Pre-commitment":
        "Something the person gives up at the end of the conversation, such as a written order, an advance, a phone number for the first batch or a shelf promised by a shopkeeper. It converts talk into evidence.",
      "Disconfirming evidence":
        "An answer that damages your plan. It is the most valuable output of an interview, because it arrives before the money is spent rather than after.",
      "Tally sheet":
        "One sheet with a row for each person interviewed and a column for each question, filled in during the conversation, so that twenty answers can be added up rather than remembered.",
      "Purchase decision maker":
        "The person in a household or shop who actually chooses and pays. Interviewing anybody else records a preference that has no money behind it.",
    },
    body: {
      Beginner: `<p>Before you spend on a machine, you talk to twenty people who might buy from you. Not to convince them. To find out what they already do. Twenty is small enough to finish in three or four days and large enough that one talkative person cannot swing the result.</p>
<h2>Five questions, in this order</h2>
<ol>
<li>Do you buy this at all, and how often.</li>
<li>Where did you buy it last time.</li>
<li>What did you pay.</li>
<li>What is annoying about buying it that way.</li>
<li>If it were available here from next month, would you take it, and how much.</li>
</ol>
<p>Notice that the first four are about the past. Anybody can guess about the future, and most people guess kindly. Only the last question is about you, and it comes last so that the earlier answers are not shaped by it.</p>
<h2>Do not ask the question you want answered</h2>
<p>If you ask whether people would like fresh paneer at a lower price nearby, everyone says yes. That is a <strong>leading question</strong>, because the answer is already inside it. Ask instead when they last bought paneer, from where, and for how much. You will hear that three of the twenty buy it at all, which is a hard thing to hear and a cheap thing to learn.</p>
<h2>Talk to twenty different kinds of people</h2>
<p>If all twenty are your neighbours and relatives, you have interviewed your own goodwill. Spread them: some from your hamlet, some from the next village, a few at the weekly market, two or three shopkeepers who might stock your product, and at least three people who currently buy from the seller you would be competing with.</p>
<h2>Write while they speak</h2>
<p>Keep one sheet with twenty rows and a column for each question. Fill it in during the conversation, in their words, not afterwards from memory. At the end you can count: how many buy, how many pay above a certain price, how many said they would take a first batch.</p>
<h2>End with something small</h2>
<p>Before you leave, ask for one small thing. A phone number for the first batch. A written note of how many kilos they would take. A shopkeeper's word that he will keep two packets on the shelf. If nobody will give you even that, the interest you heard was politeness.</p>`,
      Intermediate: `<p>An interview round is a piece of fieldwork with a method, and the method exists to stop you from hearing what you want. Run it in one week, before any purchase, and treat the sheet it produces as the first document of your enterprise.</p>
<h2>Design the spread before the first conversation</h2>
<p>Write the twenty as a plan, not as whoever you meet. A workable spread for a small food unit in a Suryapet mandal looks like this:</p>
<ul>
<li>Six households in your own habitation, chosen across different streets and incomes.</li>
<li>Six households in two neighbouring habitations, so that convenience to you is not doing the work.</li>
<li>Four people met at the weekly market who do not know you.</li>
<li>Three shopkeepers or hotel owners who could stock or use the product.</li>
<li>One person who works for or supplies the seller you would compete with.</li>
</ul>
<p>Inside each household, find the <strong>purchase decision maker</strong>. If the woman of the house buys the masala and the man answers your questions, you have recorded a guess.</p>
<h2>The script, and what each question is doing</h2>
<table>
<thead><tr><th>Question</th><th>What it is really measuring</th></tr></thead>
<tbody>
<tr><td>How often do you buy this</td><td>Frequency, which converts to monthly quantity</td></tr>
<tr><td>Where did you buy it last</td><td>Whether the money leaves the catchment, and who your real competitor is</td></tr>
<tr><td>What did you pay</td><td>The price anchor you will have to work within</td></tr>
<tr><td>What is inconvenient about it</td><td>The gap you can occupy, in the customer's own words</td></tr>
<tr><td>Have you ever stopped buying it, and why</td><td>Fragility of the demand, and the substitute they fall back on</td></tr>
<tr><td>If it were sold here from next month, how much would you take</td><td>Intent, weakest of the answers, recorded last</td></tr>
</tbody>
</table>
<h2>Say less than the person you are interviewing</h2>
<p>The most common way this goes wrong is that the owner spends the visit describing the plan. Explaining your idea trains the respondent to be encouraging. Introduce yourself in two sentences, then ask and write. A useful discipline is to time it: if you spoke for more than a fifth of the conversation, it was a pitch, not an interview.</p>
<h2>Turn the twenty into numbers the same evening</h2>
<p>Add up the <strong>tally sheet</strong> while it is fresh. For a tailoring unit you should end with lines like these, worked from a real set of twenty:</p>
<ul>
<li>Fourteen of twenty had garments stitched in the last year.</li>
<li>Nine of those fourteen went to the mandal town for it.</li>
<li>The commonest complaint was delivery taking three weeks in the wedding season.</li>
<li>Prices actually paid clustered between ₹250 and ₹400 for a blouse.</li>
<li>Six people gave a phone number for a trial order, two gave nothing.</li>
</ul>
<p>That set of lines is worth more than a market survey report, because you collected it and you know exactly how each number was obtained.</p>`,
      Advanced: `<p>Twenty interviews will not save an enterprise if they are run as a search for permission. The professional version of this exercise is built to find the answers that hurt, and it ends in a commitment rather than in encouragement.</p>
<h2>Hunt for disconfirming evidence on purpose</h2>
<p>Before you start, write down the single assumption that, if wrong, kills the plan. For a millet unit it might be that households will pay a premium for cleanly milled and packed flour rather than milling their own grain free at the chakki. Then design two questions aimed straight at it: what do you do with your own grain now, and what would make you stop doing that. If eighteen of twenty mill their own grain and are content, you have learnt the most valuable thing available to you, and you have learnt it for the cost of a week.</p>
<p>Owners resist this because the interview then feels like failure. It is the opposite. <strong>Disconfirming evidence</strong> collected before purchase is a redesign; the same evidence collected after purchase is a loss.</p>
<h2>Price questions that actually work</h2>
<p>Never ask what a person would pay. The answer is systematically low when they suspect you are selling and systematically high when they want to be kind. Use these instead:</p>
<ul>
<li>Anchor on the last purchase: what did you pay, and what quantity was that for. Then compute the unit price yourself.</li>
<li>Offer a concrete comparison: the town shop sells this at a price you can state. Would you buy the same thing here at that price, or does it need to be lower to be worth changing.</li>
<li>Test the top of the range with a specific product: a half kilo pack, sealed and labelled, delivered on Tuesday. A price attached to a specific offer is answerable; a price attached to a category is not.</li>
</ul>
<h2>The shopkeeper interview is a different conversation</h2>
<p>A retailer does not buy on taste, he buys on margin, shelf turn and terms. Ask what margin he gets on the comparable product, how many units of it he sells in a week, what credit period the current supplier gives him, and who takes back unsold stock. A retailer who says he will keep your product but expects thirty day credit and returns has just told you the working capital you will need to serve him, and that number belongs in your plan.</p>
<h2>Reading the result honestly</h2>
<table>
<thead><tr><th>What you heard</th><th>What it is worth</th><th>What to do next</th></tr></thead>
<tbody>
<tr><td>Advance paid or order written and signed</td><td>Evidence</td><td>Size your first batch to these orders</td></tr>
<tr><td>Phone number given for the first batch</td><td>Weak evidence</td><td>Call them when the batch is ready and count how many buy</td></tr>
<tr><td>Warm agreement, no commitment asked</td><td>Nothing</td><td>Go back and ask for a commitment</td></tr>
<tr><td>Interest only at a price below your cost</td><td>Negative evidence</td><td>Change the product or the cost base, not the price</td></tr>
<tr><td>Buys today, complains about the seller, still stays</td><td>Mixed</td><td>Find out what holds them: credit, habit or relationship</td></tr>
</tbody>
</table>
<h2>Two failures specific to a home district</h2>
<p>The first is that people will not criticise a neighbouring seller in front of you, especially if he is related to somebody in the room. Interview alone where you can, and ask about the last purchase rather than about the seller.</p>
<p>The second is that a promise made to a person from your own village is a social obligation, and it will be given freely and then quietly not kept. That is exactly why the round has to end in a <strong>pre-commitment</strong> that costs something, however small. An advance of a few rupees, a written quantity, or a date agreed for delivery separates the people who will buy from the people who are being kind to you.</p>`,
      Expert: `<p>Field card for the interview round. Carry it, work it, and stop when the twenty rows are filled and totalled.</p>
<h2>The six question script</h2>
<ol>
<li>How often do you buy this, and for how many people.</li>
<li>Where did you buy it last, and what did that cost.</li>
<li>What is inconvenient about buying it that way.</li>
<li>Have you ever stopped buying it, and what did you use instead.</li>
<li>Who in the house decides and pays for it.</li>
<li>If it were here from next month at a stated price, how much would you take, and can I write your name down for the first batch.</li>
</ol>
<h2>Spread, in one line each</h2>
<ul>
<li>Six own habitation, six neighbouring habitations, four strangers at the market, three retailers, one insider to the competitor.</li>
<li>No more than four relatives in the twenty, and mark them on the sheet so you can total with and without them.</li>
<li>Interview the person who pays, not the person who is free to talk.</li>
</ul>
<h2>Red flags on the sheet</h2>
<table>
<thead><tr><th>Pattern</th><th>What it usually means</th></tr></thead>
<tbody>
<tr><td>Twenty positives, zero commitments</td><td>You pitched instead of asking</td></tr>
<tr><td>All twenty from within a walk of your house</td><td>You measured your goodwill, not the market</td></tr>
<tr><td>Wide spread of prices paid, no cluster</td><td>You have grouped different products under one name</td></tr>
<tr><td>Retailers interested only on credit and returns</td><td>Your working capital line has just grown</td></tr>
<tr><td>Nobody can name what they use instead</td><td>The category is not real to them yet, so expect slow adoption</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Ask about the last purchase, never about the next one. The past is a fact and the future is a courtesy.</li>
<li>Speak for less than a fifth of the conversation, or you ran a demonstration.</li>
<li>Every interview ends with a request for something small. No commitment means no evidence.</li>
<li>Count the answers that damage the plan first, and rewrite the plan before buying anything.</li>
<li>Twenty is enough to decide. It is not enough to be sure, so keep interviewing through the first three months of trading.</li>
</ul>`,
    },
  },
  31604: {
    topicId: 31604,
    title: "Choosing between service, trading and manufacturing",
    summary:
      "The same idea can be built as a service, as trading or as manufacturing, and the three models differ in what you buy first, where the money sits and how long it takes to come back. You work each one on the same enterprise so the choice is made on fixed capital, margin, turns and the cash conversion cycle rather than on which one sounds like a proper business.",
    concepts: [
      "Service enterprise",
      "Trading enterprise",
      "Manufacturing enterprise",
      "Value addition",
      "Fixed capital and working capital",
      "Cash conversion cycle",
    ],
    glossary: {
      "Service enterprise":
        "A unit that sells skilled time or the use of an asset, such as stitching, milling on the customer's grain, or repairing a motor. Very little is bought before the sale and nothing is held as stock.",
      "Trading enterprise":
        "A unit that buys goods and sells them in the same form, earning the difference. Almost all its money sits in stock and in what customers owe.",
      "Manufacturing enterprise":
        "A unit that changes the form of an input, so that the output is a different, higher priced good than what went in. It carries machines, raw material, finished stock and the widest compliance.",
      "Value addition":
        "The difference between the sale value of the output and the cost of the material and conversion that produced it. It is the entire reason a manufacturing unit earns more than a trader per unit sold.",
      "Fixed capital":
        "Money sunk into things that stay: machines, shed, furniture, deposits and connections. It is spent once and recovered slowly, through the margin on every unit sold.",
      "Cash conversion cycle":
        "The number of days between paying for an input and receiving cash for the output made from it. Days of stock plus days customers take to pay, less days your supplier lets you take.",
    },
    body: {
      Beginner: `<p>Three different businesses can be built on the same idea, and they behave in completely different ways. Take millet. You can mill other people's grain for a charge, you can buy flour and sell it in your shop, or you can buy grain, mill it, pack it and sell it under your own name. Those are the three models.</p>
<h2>Service: you sell your time or your machine</h2>
<p>A tailor, a motor rewinder, a mill that grinds the customer's own grain. The customer brings the material. You add skill or machine time and charge for it. You buy very little before the sale, so almost nothing is stuck in stock, and you are usually paid when the work is handed over. The limit is that you can only sell the hours you and your machine actually have.</p>
<h2>Trading: you buy and sell the same thing</h2>
<p>An agri-input shop, a kirana, a mobile accessory counter. You buy goods and sell them unchanged, earning the gap. The work is choosing what to stock and turning it over quickly. The catch is that almost all your money sits on the shelf as stock, and more of it sits in the book if you give credit.</p>
<h2>Manufacturing: you change the form of the thing</h2>
<p>A millet unit, a pickle unit, a paneer unit. Grain goes in and packed flour comes out, and the flour is worth more per kilo than the grain was. That gap is called <strong>value addition</strong>. You earn more on each unit than a trader does, and you also pay for machines, a shed, packing, a food registration and raw material stock before anything is sold.</p>
<h2>The three questions that decide</h2>
<ol>
<li>How much has to be spent before the first rupee comes in.</li>
<li>How many days pass between paying out and being paid.</li>
<li>What happens when you are ill for a week. A service stops earning. A shop keeps selling. A unit keeps producing if somebody else can run it.</li>
</ol>
<p>None of the three is better. A first time owner with little money and a real skill usually starts with a service, and grows into manufacturing once there is a customer list and some cash behind it.</p>`,
      Intermediate: `<p>Work the three models on one product so the difference is arithmetic rather than opinion. The product here is millet flour in a Jagtial mandal, and the figures are illustrative: you replace each one with what you counted in your own catchment.</p>
<h2>The same product, three ways</h2>
<table>
<thead><tr><th>Model</th><th>What you buy first</th><th>Where the money sits</th><th>Paid when</th></tr></thead>
<tbody>
<tr><td>Service: milling the customer's grain</td><td>Mill, shed, power connection</td><td>In the machine only</td><td>At the counter, same day</td></tr>
<tr><td>Trading: buying flour and reselling</td><td>Shelving, deposit, opening stock</td><td>In stock and in customer credit</td><td>On sale, or later if credit is given</td></tr>
<tr><td>Manufacturing: grain in, packed flour out</td><td>Mill, packing machine, shed, grain stock</td><td>In machines, raw grain and finished packs</td><td>After the pack sells, often through a retailer</td></tr>
</tbody>
</table>
<h2>Value addition, worked on one batch</h2>
<p>Take 100 kilos of millet bought at ₹40 a kilo, so ₹4,000 of material. Milling and cleaning lose about 6 kilos, leaving 94 kilos to pack. Packing material costs about ₹3 a kilo, so ₹282. Power for the batch is around ₹150 and hired labour ₹300.</p>
<ul>
<li>Total cost of the batch: ₹4,000 plus ₹282 plus ₹150 plus ₹300, which is ₹4,732.</li>
<li>Output sold at ₹70 a kilo: 94 kilos, which is ₹6,580.</li>
<li>Gross margin on the batch: ₹1,848, about 28 percent of sales.</li>
</ul>
<p>Note what is not in that figure: your own wage, the instalment on the mill, the rent and the licence renewal. Those come in the costing topic, and they are exactly why a batch that looks profitable can still leave a unit short at the end of the month.</p>
<h2>Margin is not the same as return</h2>
<p>A trader selling the same flour might earn only 10 percent on each sale, and can still do better than the figures above, because he turns his stock over many times in a year while the manufacturer's money is tied up in grain bought at harvest. Return depends on margin multiplied by the number of turns, so always ask both questions: how much per sale, and how many times a year does the money go round.</p>
<h2>The cash conversion cycle in days</h2>
<ul>
<li><strong>Service:</strong> nothing in stock, paid on delivery. The cycle is close to zero days, which is why a tailoring unit can survive on very little working capital.</li>
<li><strong>Trading:</strong> stock sits perhaps 45 days, customers take 30 days on credit, the supplier gives you 15. That is 45 plus 30 less 15, which is 60 days of your money out at all times.</li>
<li><strong>Manufacturing:</strong> grain held 30 days, packed flour 10 days, retailer pays in 15. That is 55 days, and it must be financed before the unit opens.</li>
</ul>
<p>A first time owner who ignores this line does not fail on profit. The unit is profitable on paper and still cannot buy next week's grain.</p>
<p>Write the three cycles out for your own idea before you choose a model. The one with the shortest cycle is the one you can start with the least borrowed money, and for most first units that matters more than the fatter margin waiting further down the line.</p>`,
      Advanced: `<p>The choice between the three models is usually made emotionally, because manufacturing sounds like a real enterprise and a service sounds like a job. Made properly, it is a decision about capital, about who bears the risk in the chain, and about which constraint you are willing to live with.</p>
<h2>Each model's built in ceiling</h2>
<table>
<thead><tr><th>Model</th><th>The constraint</th><th>How it is lifted</th></tr></thead>
<tbody>
<tr><td>Service</td><td>Your own hours and the machine's hours. Income stops when you stop.</td><td>Hire and train, or add a second machine, which turns the unit into a small manufacturing style operation with wages and supervision.</td></tr>
<tr><td>Trading</td><td>Working capital. Every extra rupee of sales needs another rupee of stock.</td><td>Faster turns, tighter credit control, or supplier credit, which is cheaper than a loan when it is available.</td></tr>
<tr><td>Manufacturing</td><td>Market absorption and compliance, then capacity.</td><td>New products from the same machine, and a second selling channel, before a second machine.</td></tr>
</tbody>
</table>
<h2>Where the risk actually sits</h2>
<p>In a service, the customer owns the material. If the price of grain doubles, the miller's charge is unaffected. In trading, you own the goods, so a price fall or a slow moving line is your loss, and expiry or damage is your loss too. In manufacturing you carry both the input price risk and the finished stock risk, and you also carry recipe and quality risk, because a bad batch of pickle is not just unsold stock, it is a customer who tells the village.</p>
<p>This is why a sensible sequence for a first time owner is often service first, then manufacturing on job work terms, then own brand manufacturing. Each step adds one kind of risk instead of three at once.</p>
<h2>The hybrid that most rural units actually become</h2>
<p>A mill that grinds customer grain in the morning and produces its own packed flour in the afternoon is running two models on one asset. It is a good structure, and it needs discipline in the records: two revenue lines, two cost lines, and the machine's cost apportioned between them by hours. Without that split the owner cannot tell which half is carrying the other, and units in this position routinely subsidise a failing branded product from a healthy job work business for years without noticing.</p>
<h2>What a lender reads differently</h2>
<p>Structure matters here, and the amounts change, so learn the shape and never a figure. A trading unit is financed mainly through a working capital limit, because its need is stock. A manufacturing unit typically needs both a term loan for the machinery and a working capital limit for material, and the appraisal asks for a project report with a capacity and a break-even. Some subsidy linked schemes are written for manufacturing and service activities and restrict or exclude pure trading, so if a scheme is part of your plan, read that scheme's own list of eligible activities before choosing your model rather than after.</p>
<h2>The three model errors seen most often</h2>
<ul>
<li>Choosing manufacturing for the status of it, with a machine bought against demand that would have been comfortably served by job work.</li>
<li>Choosing trading because it looks easy, then giving credit to everyone and discovering that the entire margin is sitting in a notebook.</li>
<li>Choosing a service and pricing it as though the machine were free, because no material was bought that day. Machine hours have a cost, and it is the instalment divided by the hours you sell.</li>
</ul>`,
      Expert: `<p>Decision sheet. Score the three models on your own figures, then commit in writing to one, with the trigger that would move you to the next.</p>
<h2>Model comparison at a glance</h2>
<table>
<thead><tr><th>Line</th><th>Service</th><th>Trading</th><th>Manufacturing</th></tr></thead>
<tbody>
<tr><td>Fixed capital</td><td>Low to medium</td><td>Low, plus deposits</td><td>High</td></tr>
<tr><td>Working capital</td><td>Very low</td><td>Very high, it is the business</td><td>High, raw and finished</td></tr>
<tr><td>Margin per sale</td><td>High, it is mostly your time</td><td>Low</td><td>Medium to high</td></tr>
<tr><td>Turns per year</td><td>Continuous</td><td>Many</td><td>Few</td></tr>
<tr><td>Cash cycle</td><td>Near zero days</td><td>Long if credit is given</td><td>Long by design</td></tr>
<tr><td>Price risk on inputs</td><td>Customer's</td><td>Yours</td><td>Yours</td></tr>
<tr><td>Compliance load</td><td>Registration, trade licence</td><td>Registration, trade licence, tax threshold</td><td>Adds food, metrology, effluent as applicable</td></tr>
<tr><td>Runs without you</td><td>No</td><td>Partly</td><td>Yes, with supervision</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Return equals margin multiplied by turns. A low margin with many turns beats a high margin sitting in stock.</li>
<li>The cash conversion cycle is days of stock plus days of receivable less days of payable. Finance it before you open, not when it bites.</li>
<li>Job work removes raw material from your working capital and removes input price risk with it.</li>
<li>A service earns only while you work. Price the machine hour, not only the labour.</li>
<li>Add one kind of risk at a time: service, then job work manufacturing, then own brand.</li>
</ul>
<h2>Edge cases worth carrying</h2>
<ul>
<li>A unit running job work and own brand on one machine must apportion the machine cost by hours, or one line will silently fund the other.</li>
<li>Supplier credit is working capital that costs nothing while the relationship holds, and it disappears exactly when trade is difficult.</li>
<li>Trading margins quoted as a percentage of cost and as a percentage of sales are different numbers. Fix which one you mean before comparing two shops.</li>
<li>Seasonal raw material bought at harvest lengthens the cash cycle deliberately, and that is a decision to finance, not an accident.</li>
<li>If a scheme is central to your funding, check its eligible activity list before fixing the model, because eligibility is decided by the activity, not by the idea.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "You buy 100 kilos of millet at ₹40 a kilo, lose 6 kilos in milling, spend ₹282 on packing, ₹150 on power and ₹300 on labour, and sell the output at ₹70 a kilo. What is the gross margin on the batch?",
        options: ["₹6,580", "₹3,000", "₹2,580", "₹1,848"],
        answer: 3,
        explanation:
          "Output is 94 kilos at ₹70, which is ₹6,580, and total cost is ₹4,000 plus ₹282 plus ₹150 plus ₹300, which is ₹4,732, leaving ₹1,848. The ₹2,580 option is the tempting one because it correctly allows for the 6 kilos of wastage but forgets that packing, power and labour are part of converting grain into a saleable pack.",
        difficulty: "Medium",
        skill: "Value addition",
      },
      {
        n: 2,
        question:
          "A trading unit holds stock for 45 days, allows customers 30 days to pay, and gets 15 days of credit from its supplier. What is its cash conversion cycle?",
        options: ["90 days", "45 days", "60 days", "15 days"],
        answer: 2,
        explanation:
          "The cycle is days of stock plus days of receivable less days of payable, so 45 plus 30 less 15 gives 60 days during which your own money is out. The 90 day answer comes from adding all three, which is the usual slip: supplier credit is money you are holding, so it shortens the cycle rather than lengthening it.",
        difficulty: "Medium",
        skill: "Cash conversion cycle",
      },
      {
        n: 3,
        question:
          "A tailoring unit run by one owner is fully booked and turning work away. What is the constraint, and what does lifting it change?",
        options: [
          "Working capital, and it is lifted by holding more cloth in stock",
          "The owner's own hours, and lifting it means hiring and supervising, which brings wages and quality control into the business",
          "Compliance, and it is lifted by registering the unit under Udyam",
          "Market absorption, and it is lifted by lowering the stitching charge",
        ],
        answer: 1,
        explanation:
          "A service sells hours, so a fully booked single owner has hit the hours ceiling, and the only way past it is another pair of trained hands, which introduces wages, supervision and consistent quality. Working capital is the tempting answer because it is the usual constraint elsewhere, but in tailoring the customer brings the cloth and almost nothing is held in stock.",
        difficulty: "Easy",
        skill: "Service enterprise",
      },
      {
        n: 4,
        question:
          "Which of these units is manufacturing rather than trading?",
        options: [
          "A shop buying fertiliser in bags and selling the same bags to farmers",
          "A counter buying packed flour from a mill and reselling it",
          "A unit buying raw mangoes and selling sealed jars of pickle under its own label",
          "A dealer buying seed from a company and selling it at a markup",
        ],
        answer: 2,
        explanation:
          "Manufacturing changes the form of the input, so mangoes becoming labelled pickle is a different good with value added, which is why it also attracts food and labelling compliance. The fertiliser and seed options are tempting because both involve handling goods and earning a margin, but the item leaves the shop in exactly the form it arrived, which is trading.",
        difficulty: "Easy",
        skill: "Manufacturing enterprise",
      },
      {
        n: 5,
        question:
          "In a millet processing unit, which item belongs in working capital rather than fixed capital?",
        options: [
          "The stock of grain bought at harvest",
          "The flour mill and its motor",
          "The shed built to house the unit",
          "The security deposit on the power connection",
        ],
        answer: 0,
        explanation:
          "Working capital is money that turns over with the trade, and grain bought at harvest is converted into flour, sold and bought again, so it is working capital. The power deposit is the attractive wrong answer because it feels like a running cost, but it is paid once and stays with the utility, which makes it fixed capital.",
        difficulty: "Medium",
        skill: "Fixed capital and working capital",
      },
      {
        n: 6,
        question:
          "A shop earns about 10 percent on each sale while a food unit earns about 28 percent. Why can the shop still produce a better return on the money invested?",
        options: [
          "Because a shop pays no rent or electricity",
          "Because trading units are exempt from registration and licences",
          "Because its stock turns over many times a year, and return is margin multiplied by the number of turns",
          "Because a trader can charge whatever price he wishes",
        ],
        answer: 2,
        explanation:
          "Return on money depends on how much you earn per sale and how many times a year the same rupee goes round, so many turns at a thin margin can beat few turns at a fat one. The tempting wrong answer is that a shop carries no rent or power cost, but it carries both, and it still wins on the speed at which the same rupee recycles rather than on any saving.",
        difficulty: "Hard",
        skill: "Trading enterprise",
      },
    ],
  },
};

export default PART;
