/**
 * Course 316: Start Your Rural Micro-Enterprise, part 6.
 *
 * Topics 31610, 31611, 31612 and 31614: the food, weights and effluent rules a
 * small manufacturing unit is actually inspected against, the wall between
 * business money and household money, the three books a village unit writes by
 * hand, and pricing once a cheaper competitor opens down the road.
 *
 * Written for a first time owner who has finished a cost sheet and is about to
 * trade, and who has never been inspected, never kept a ledger and never had to
 * defend a price. Worked examples use enterprises that exist in these districts,
 * a millet processing unit, a tailoring unit, a dairy and a small food unit.
 * Every rupee figure is illustrative and exists only to make a method visible.
 * Statutory structures are taught by their shape and never by a current fee,
 * threshold, tolerance, subsidy or rate, because those move and a learner who
 * memorises one of them has memorised the wrong thing.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31610: {
    topicId: 31610,
    title: "Food, weights and pollution rules for small units",
    summary:
      "Three different offices reach a small manufacturing unit and each of them looks at something different: the food authority at how you make and label the product, the legal metrology department at your weighing instrument and at what your pack claims, and the pollution control board at what leaves the unit as dirty water, smoke or waste. You learn what each one actually checks on the floor, which category a village unit usually falls into, and the dated records that turn an inspection into a five minute reading of a file.",
    concepts: [
      "General hygienic practices",
      "Food label declarations",
      "Verified weighing instrument",
      "Packaged commodity declarations",
      "Pollution board categories",
      "Consent to establish and consent to operate",
    ],
    glossary: {
      "Food business operator":
        "The person in whose name the food permission stands and who answers for every packet the unit sends out, whether or not that person was present on the day the batch was made.",
      "Net quantity":
        "The weight or volume of the food alone. The pouch, the jar, the label and the outer carton are the tare and are excluded from it, so a heavier container never lets you print a larger figure.",
      "Verification and stamping":
        "The examination a legal metrology officer makes of a weighing instrument used for trade, followed by a mark on the instrument recording it. The instrument has to be presented again for re-verification at the interval prescribed for its class.",
      "Pollution index category":
        "The grading of an activity, red, orange, green or white, worked from how polluting that activity is rather than from how much money the unit makes. The category decides which consents the unit must hold.",
      "Consent to operate":
        "The pollution board's permission to run a unit that has already been built, granted once the effluent, emission and waste arrangements promised in the consent to establish are physically in place, and issued for a stated capacity at a stated address.",
      "Batch number":
        "A short code printed on every pack that identifies the lot it came from, so that one day's production can be traced back through your records and withdrawn on its own without touching everything else on the shelf.",
    },
    body: {
      Beginner: `<p>Three different offices can walk into a small unit, and they are looking at three different things. The food authority looks at what you make and how you make it. The legal metrology department looks at your weighing scale and at what your pack claims. The pollution control board looks at what leaves the unit as dirty water, smoke or waste. None of them is the same office, and none of their papers covers another one.</p>
<h2>The food rules</h2>
<p>If your unit touches anything people eat, one person is named on the food permission. That person is the <strong>food business operator</strong> and answers for every packet the unit makes, whether or not they were standing there on the day.</p>
<p>What is expected of you is ordinary and physical. A place that can be washed. Water fit to drink, used both in the product and on the surfaces it touches. Storage off the floor. Waste kept out of the room where food is handled. Pests dealt with rather than tolerated. People who handle food in good health. Almost all of it is what a careful kitchen already does. The part that units forget is the writing: a date and a signature in a small register each time you clean, treat for pests or send a worker for a medical check.</p>
<h2>The weights rules</h2>
<p>A scale used to buy or to sell has to be examined and stamped by the legal metrology department, and shown to them again at intervals. A certificate from the company that made the scale is a different thing and does not replace it.</p>
<p>On the pack, the weight you print is the weight of the food by itself. The pouch, the label and the carton are not part of it. The price you print has to be the full price a customer pays, with nothing added at the counter.</p>
<h2>The pollution rules</h2>
<p>Activities are graded by how polluting they are, from the heaviest group down to a group treated as practically clean. A woman stitching clothes, or a unit packing dry grain, sits at the clean end. A dairy that washes cans and floors twice a day does not, because that wash water carries a heavy load of milk solids and has to go somewhere other than the neighbour's field. Any unit that runs a boiler or a generator has also brought the air side of the rules with it.</p>
<h2>Your first month</h2>
<ol>
<li>Ask at the mandal or district office which of the three genuinely applies to your activity, and write the answer down with the date and the name of the person who gave it.</li>
<li>Take the food permission before the first sale, not after the first order.</li>
<li>Take the scale for verification before you weigh anything for money.</li>
<li>Keep one file with every certificate and one register for the dated entries. An inspection you can answer in five minutes stops being an event.</li>
</ol>`,
      Intermediate: `<p>Take two units standing in different positions. A millet packing unit in Vikarabad cleans, grades and packs grain in one room and supplies 1 kg and 5 kg packs to shops. A small dairy in Sangareddy chills milk, packs it and washes cans and floors twice a day. The same three sets of rules reach both of them, and reach them with very different weight.</p>
<h2>What the food authority checks</h2>
<p>The permission is the beginning and not the substance. The substance is a set of hygienic and sanitary practices you are expected to be running, and an inspection checks them as things and as records at the same time.</p>
<ul>
<li><strong>Premises.</strong> Surfaces that can be washed, storage off the floor and clear of the wall, and a layout in which raw material, packaging, finished packs and waste do not cross each other.</li>
<li><strong>Water.</strong> Water that goes into the product, or onto anything the product touches, has to be fit to drink, and the way you demonstrate that is a laboratory test report repeated at the interval the rules set.</li>
<li><strong>People.</strong> Food handlers medically examined at the prescribed frequency with the records kept, and trained in basic handling.</li>
<li><strong>Pests.</strong> A treatment arrangement with dates against it, and nothing left open near stored grain that would feed a rodent.</li>
<li><strong>Batch identity.</strong> A <strong>batch number</strong> on every pack and a note of what went into that batch, so one lot can be traced and withdrawn without disturbing the rest.</li>
</ul>
<h2>What has to appear on the pack</h2>
<p>Two sets of rules meet on one label. The food rules ask what the food is. The packaged commodity rules ask what the pack is. Draw both onto one printed panel and check it line by line before you order five thousand labels.</p>
<table>
<thead><tr><th>Declaration</th><th>The point that is missed</th></tr></thead>
<tbody>
<tr><td>Name and address of the packer</td><td>The unit that packed it, not the shop that sells it</td></tr>
<tr><td>Common name of the food</td><td>What the thing is, not only your brand name</td></tr>
<tr><td>List of ingredients</td><td>In descending order of weight, with any additive named</td></tr>
<tr><td>Net quantity</td><td>The food alone, with the packaging excluded</td></tr>
<tr><td>Month and year of packing, and the date up to which it is best used</td><td>Printed as part of the pack, not written on later by hand</td></tr>
<tr><td>Retail sale price</td><td>Inclusive of all taxes, with nothing added at the counter</td></tr>
<tr><td>Consumer complaint contact</td><td>A name, an address and a number that is actually answered</td></tr>
<tr><td>Food permission number and the vegetarian or non-vegetarian mark</td><td>The number has to match the licence lying in your file</td></tr>
</tbody>
</table>
<h2>The instrument and the pack</h2>
<p>An instrument used in trade is verified and stamped by the legal metrology department and presented again for re-verification at the interval prescribed for its class. Two further decisions settle whether your packs stand up:</p>
<ul>
<li>Choose an instrument whose smallest division suits the pack you fill. A platform scale bought for 50 kg sacks cannot honestly fill a 500 g pouch.</li>
<li>Net quantity is judged across a sample of packs, with a permitted error on an individual pack. If you fill exactly to the printed figure, roughly half your packs sit below it.</li>
</ul>
<h2>The pollution side, in proportion</h2>
<p>Consent comes in two stages. <strong>Consent to establish</strong> is taken before you build, on the strength of the arrangements you describe. <strong>Consent to operate</strong> is taken before production starts, once those arrangements physically exist. Which of them you need at all follows from the category of the activity, and categories are worked from a pollution index, not from your turnover or your investment.</p>
<p>The millet unit produces husk and dust. Husk is a by-product with a buyer at the gate; the dust is a health question for whoever stands at the machine. The dairy produces wash water with a heavy organic load, and emptying it behind the shed is the complaint that reaches the board first. A settling and soakage arrangement, or a plot where that water can be put to use, is a cheap decision at the shed stage and an expensive retrofit afterwards.</p>`,
      Advanced: `<p>Every failure below has cost a working unit a season, and not one of them came from wanting to break a rule. They come from doing the right things in the wrong order.</p>
<h2>The label printed before it was checked</h2>
<p>An owner orders five thousand labels carrying the licence number from the application, an address that has since changed, and the words stating that local taxes are extra. All three are wrong, the whole print run is waste, and the packs already in shops carry a price declaration that is not the price. Proof one label. Read it against your own licence, your own address and the declaration list. Get a second person to read it. Then print, and print a small first run.</p>
<h2>Filling exactly to the printed weight</h2>
<p>Net quantity is examined where the pack is found, which is in the shop and not at your filling table. A product that loses moisture on a shelf will read short two months after it left you, and the fact that it was correct when packed is not a defence anyone can see. Allow a small deliberate overfill, use a barrier that holds moisture in, and check a few packs from your own dispatch after a fortnight to learn how much your product actually loses.</p>
<h2>The right instrument for the wrong pack</h2>
<p>Permissible error on a weighing instrument is expressed against that instrument's own division, so a coarse scale is not merely inconvenient for a small pack, it is incapable of proving the pack. Match the instrument to the smallest quantity you sell, keep a set of test weights, and check the scale yourself at the start of each packing day.</p>
<h2>Consent taken in the wrong order, or outgrown</h2>
<ul>
<li><strong>Built first, applied later.</strong> Consent to establish is meant to be obtained before construction, because it is the stage at which the effluent arrangement can still be designed in. A unit that builds first is asking to regularise, which is a slower and weaker position.</li>
<li><strong>Capacity crept.</strong> The consent is for a stated capacity at a stated address. Doubling the machines, adding a second shift or moving into the next shed changes what was consented, and the unit is then running outside its own paper.</li>
<li><strong>A new machine changed the category.</strong> Adding a boiler, a fryer or a generator can move an activity from a lighter category into a heavier one, which brings emission conditions and monitoring that the old consent never mentioned.</li>
</ul>
<h2>Packing under somebody else's brand</h2>
<p>Job work is common and useful, and it makes two units responsible for one packet. The label has to identify who made it and whose brand it carries, each party needs its own food permission, and the agreement should say plainly who answers a consumer complaint, who holds the batch records and who decides a withdrawal. Units take this work for the volume and discover the obligations only when a complaint arrives.</p>
<h2>When something is found wrong</h2>
<p>The usual path is not immediate closure. A defect is recorded, an improvement notice gives you a period to fix it, and the serious consequences follow only if the defect stands. What decides the outcome is what you can produce on the day: dated cleaning and pest records, current water test reports, medical records for handlers, calibration checks, and a batch trail that lets you withdraw one lot instead of everything you have ever sold. An owner who can trace a batch is treated as a unit with a system. An owner who cannot is treated as a unit without one.</p>
<h2>Marginal cases worth knowing</h2>
<ul>
<li><strong>Loose sale.</strong> Grain weighed in front of the customer is not a pre-packed commodity, so the pack declarations do not attach to it, but the food rules still apply and the scale still has to be verified and stamped.</li>
<li><strong>Bulk supply to an institution.</strong> A pack meant for an industrial or institutional buyer follows a different declaration set from a retail pack. Do not put a retail label on a bulk supply and assume it covers you.</li>
<li><strong>Selling at a mela outside your district or state.</strong> Check the permission you are trading under before you load the vehicle, not at the stall.</li>
<li><strong>Selling online.</strong> The platform will ask for the licence and an image of the label, and the declarations have to be visible to the buyer before purchase, not only on the packet that arrives.</li>
</ul>`,
      Expert: `<p>Recall card for the three inspections. Who checks what, the two line rules, the label order, and the file that answers an inspection.</p>
<h2>Three offices, three questions</h2>
<table>
<thead><tr><th>Office</th><th>What it looks at</th><th>What you produce</th></tr></thead>
<tbody>
<tr><td>Food authority</td><td>Premises, water, handlers, pests, batch trail, label</td><td>Licence, water test report, cleaning and pest register, medical records, batch record</td></tr>
<tr><td>Legal metrology</td><td>The instrument, the declarations, the net quantity in the pack</td><td>Verification stamp, test weights, filling check record</td></tr>
<tr><td>Pollution control board</td><td>Effluent, emission, solid waste, capacity actually installed</td><td>Consent to establish, consent to operate, evidence the arrangement exists</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Net quantity is the food alone. Packaging is tare and never counts.</li>
<li>A maker's calibration certificate is not verification. Only the department stamps.</li>
<li>Retail sale price is inclusive of all taxes. Nothing may be added at the counter.</li>
<li>Consent to establish before you build, consent to operate before you produce.</li>
<li>Category follows the activity's pollution index, not your turnover or your investment.</li>
<li>The pack is judged where it is found, in the shop, not at your filling table.</li>
<li>A batch number is what lets you withdraw one lot instead of everything.</li>
</ul>
<h2>Label proofing order</h2>
<ol>
<li>Packer name and address, as they stand on the licence today.</li>
<li>Common name of the food, then the brand.</li>
<li>Ingredients in descending order of weight.</li>
<li>Net quantity, in the unit you actually fill to.</li>
<li>Packing month and year, and the best before date.</li>
<li>Retail sale price, marked inclusive of all taxes.</li>
<li>Consumer complaint contact that is answered.</li>
<li>Food permission number and the vegetarian or non-vegetarian mark.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li><strong>Moisture movement.</strong> Overfill slightly for a drying product; check your own dispatch after a fortnight.</li>
<li><strong>Coarse scale, small pack.</strong> The permitted error is set against the instrument's division, so the wrong instrument cannot prove the pack.</li>
<li><strong>Job work.</strong> Both units named, both permissions held, one written answer on who handles a complaint.</li>
<li><strong>Capacity expansion.</strong> More machines or a second shift changes what was consented; a boiler or a generator can change the category.</li>
</ul>
<h2>The inspection file</h2>
<ol>
<li>Licences and consents, current, with renewal dates written on the cover.</li>
<li>Water test report, latest.</li>
<li>Cleaning, pest and handler medical registers, dated and signed.</li>
<li>Verification stamp date and the daily scale check sheet.</li>
<li>Batch record for the last three months, and one label proof.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A millet unit buys a new digital scale that comes with a calibration certificate from the manufacturer. Can it be used to weigh packs for sale?",
        options: [
          "Yes, the manufacturer's calibration certificate is the required proof",
          "Not until it has been verified and stamped by the legal metrology department, and it must be presented again for re-verification",
          "Yes, provided the unit holds a Udyam registration",
          "Only if the scale is imported, since Indian scales are exempt",
        ],
        answer: 1,
        explanation:
          "An instrument used to buy or sell has to be examined and stamped by the department itself, and re-presented at the interval prescribed for its class, because the stamp is what makes the reading enforceable in a trade dispute. The maker's certificate is the tempting answer since it looks official, but it records the factory's own test and no public officer has checked the instrument as it now stands in your shed.",
        difficulty: "Easy",
        skill: "Verified weighing instrument",
      },
      {
        n: 2,
        question:
          "A pickle jar weighs 180 g empty and holds 500 g of pickle. What net quantity goes on the label?",
        options: ["680 g", "500 g", "590 g, being the average of the two", "180 g"],
        answer: 1,
        explanation:
          "Net quantity is the food by itself, so the 180 g jar is tare and is excluded, leaving 500 g as the only figure that may be declared. Printing 680 g is the tempting error because that is what the scale reads when you put the filled jar on it, and it is precisely the misdeclaration a check at the shop is designed to catch.",
        difficulty: "Easy",
        skill: "Packaged commodity declarations",
      },
      {
        n: 3,
        question:
          "A label prints the retail sale price and adds the words stating that local taxes are extra. What is wrong with it?",
        options: [
          "Nothing, provided the shop displays the tax rate at the counter",
          "The retail sale price has to be the full price the customer pays, inclusive of all taxes, so nothing may be added at the counter",
          "It is wrong only for food products and permitted for other goods",
          "It is acceptable if the unit is not registered for GST",
        ],
        answer: 1,
        explanation:
          "The declared retail sale price is the maximum a consumer can be charged and it must already include every tax, which is the whole purpose of printing it on the pack. Allowing the shop to display the rate instead is the attractive answer because it sounds transparent, but it moves the price out of the declaration and leaves the customer negotiating at the counter.",
        difficulty: "Medium",
        skill: "Food label declarations",
      },
      {
        n: 4,
        question:
          "An owner says a micro unit is too small for the pollution control board to be concerned with. What is the correct position?",
        options: [
          "Correct, units below the micro investment ceiling are outside the board's remit",
          "Correct, provided the unit holds a trade licence from the panchayat",
          "The category is worked from how polluting the activity is, so a dairy washing floors daily is treated differently from a unit packing dry grain, whatever their size",
          "Only units with a boiler are ever categorised",
        ],
        answer: 2,
        explanation:
          "Categories are set from a pollution index of the activity, which is why grain packing and daily can-washing at a dairy sit in different places even at the same turnover. Reading the MSME investment ceiling across to the pollution board is the tempting move, but that ceiling classifies enterprises for credit and scheme purposes and says nothing about what leaves your shed as effluent.",
        difficulty: "Medium",
        skill: "Pollution board categories",
      },
      {
        n: 5,
        question:
          "A unit has completed its shed and installed the machines, and now applies to the pollution board for the first time. What has gone wrong in the sequence?",
        options: [
          "Nothing, both consents are meant to be taken after construction",
          "Consent to establish is meant to be obtained before construction, so the effluent arrangement could be designed in; the unit is now asking to regularise what already exists",
          "Consent to operate should have been taken first and consent to establish afterwards",
          "The unit needed no consent at all once the shed was complete",
        ],
        answer: 1,
        explanation:
          "Consent to establish is the pre-construction stage precisely because the drainage, settling and waste arrangements are cheap to design in and expensive to retrofit, and consent to operate then confirms those arrangements exist before production starts. Assuming both come after construction is the common and costly reading, and it turns a routine approval into a regularisation with the unit already built.",
        difficulty: "Medium",
        skill: "Consent to establish and consent to operate",
      },
      {
        n: 6,
        question:
          "A food inspector visits a freshly whitewashed unit. Which of these is most likely to decide the outcome of the visit?",
        options: [
          "The Udyam registration certificate on the wall",
          "The GST return for the previous month",
          "Dated cleaning and pest treatment registers, current water test reports, handler medical records and a batch trail",
          "The condition of the paintwork and the signboard",
        ],
        answer: 2,
        explanation:
          "Hygienic practice is judged as a running system, so the dated registers, the water report, the medical records and the ability to trace a batch are what demonstrate it. The Udyam certificate is the tempting answer because owners frame and display it, but Udyam records that an enterprise exists and says nothing whatever about food safety.",
        difficulty: "Medium",
        skill: "General hygienic practices",
      },
      {
        n: 7,
        question:
          "A snack unit fills each pouch to exactly the printed 200 g. Two months later a check at a shop finds packs slightly under weight. What is the sound response?",
        options: [
          "Argue that the packs were correct at the filling table and the loss is the retailer's concern",
          "Reduce the declared weight on the label to 180 g to be safe",
          "Allow a small deliberate overfill, use a moisture barrier, and check your own dispatched packs after a fortnight to learn the real loss",
          "Stop printing a net quantity and sell the pouches by count instead",
        ],
        answer: 2,
        explanation:
          "A product that dries on the shelf loses weight after dispatch, and the pack is judged where it is found, so the fix is to fill slightly above the declared figure and to measure your own product's loss over a fortnight. Blaming the retailer is the instinctive answer and fails because the declaration is the packer's, and under-declaring to 180 g simply throws away saleable weight on every single pouch.",
        difficulty: "Hard",
        skill: "Packaged commodity declarations",
      },
    ],
  },
  31611: {
    topicId: 31611,
    title: "Separating business money from household money",
    summary:
      "A unit that keeps its money in the same pocket as the household cannot say what it earned, cannot show a lender anything worth reading, and loses its working capital a few hundred rupees at a time without anyone deciding to spend it. You put a wall between the two with one account, one fixed monthly drawing and a small petty cash float, and learn to record the four flows that are allowed to cross the wall.",
    concepts: [
      "Separate business account",
      "Capital introduced",
      "Owner's drawings",
      "Imprest cash float",
      "Loans between household and business",
      "Bank statement as evidence",
    ],
    glossary: {
      "Business account":
        "A bank account used only for the unit's receipts and payments, held in the business name or in the proprietor's name with the trade name recorded against it, and with the unit's own UPI collection linked to it.",
      "Capital introduced":
        "Money or goods the owner brings into the business from outside it. It increases what the owner has invested in the unit and is never a sale, so it must not be allowed to appear as turnover.",
      Drawings:
        "Money or goods the owner takes out of the business for household use. It is not a cost of running the unit and does not reduce profit; it reduces the owner's stake in the unit.",
      "Imprest float":
        "A fixed sum of cash kept for small purchases and topped back up to the same figure each week against the bills spent, so that cash in the box plus bills in the box always equals the fixed sum.",
      Commingling:
        "The mixing of business and household money in one account or one cash box, after which no single transaction can be attributed to either with confidence, and the whole record becomes an opinion.",
      "Credit summation":
        "The total of all money credited to an account over a period. A lender reads it as the nearest available evidence of your sales, which is why collections kept as cash at home are invisible to a loan file.",
    },
    body: {
      Beginner: `<p>The first thing a new unit does wrong is not a pricing mistake or a bad machine. It is keeping the unit's money and the family's money in one place. A tailoring unit in Nizamabad takes ₹400 for a stitched blouse in the morning, and by evening some of that has bought vegetables, some has gone in a child's pocket and the rest is in the same purse as last week's pension. At the end of the month nobody in that house can say whether the tailoring earned anything.</p>
<h2>Three things you lose by mixing</h2>
<ul>
<li><strong>You lose the answer.</strong> Profit is what is left after every business cost is paid. If household spending has been running through the same purse, you can add and subtract all evening and never reach a number you trust.</li>
<li><strong>You lose the working capital.</strong> Nobody sits down and decides to spend the cloth money. It goes out in fifties and hundreds, and the shortage appears on the day the cloth merchant wants payment.</li>
<li><strong>You lose the loan.</strong> A bank officer reads your account statement. If the unit's money never passes through an account, there is nothing for that officer to read, and a real business is treated as a small one.</li>
</ul>
<h2>Build the wall in three moves</h2>
<ol>
<li><strong>One account for the unit.</strong> Open a bank account used only for the unit, and put the unit's UPI QR code at the counter so that customer payments land there and not in a family member's phone.</li>
<li><strong>One fixed amount taken out each month.</strong> Decide the amount, take it on the same date every month, and take nothing else. Money taken out of the unit is called <strong>drawings</strong>, and it is not a business expense.</li>
<li><strong>One small cash box.</strong> Keep a fixed sum, say ₹2,000, for auto fare, tea for a customer and a needle packet, and put the bill for every rupee spent from it back into the box.</li>
</ol>
<h2>Money is allowed to cross the wall, but it must be written down</h2>
<p>Nobody is asking you to stop putting your savings into your own unit or to stop feeding your family from it. You are asked to write down which one is happening. Money you put in is <strong>capital introduced</strong>. Money you take out is drawings. Money a relative lends is a loan and should be written down as a loan, with what you will repay and when. A rupee that crosses the wall without a line of writing becomes an argument later, either with the bank or with the relative.</p>`,
      Intermediate: `<p>The wall is built with three instruments and maintained with one habit. The instruments are a business account, a fixed monthly drawing and an imprest cash float. The habit is that any rupee crossing between the unit and the house is written down on the day it crosses, with which of the four permitted flows it belongs to.</p>
<h2>Opening the account properly</h2>
<p>A proprietor opens the account on personal KYC, plus documents that carry the trade name, commonly the Udyam certificate, the trade or shop registration and any tax registration the unit holds. Two things are worth insisting on at the branch:</p>
<ul>
<li>The trade name appears on the account, so a cheque or a transfer made out to the unit is accepted without a discussion.</li>
<li>The unit's UPI collection is linked to this account and the printed QR at the counter belongs to it. A customer paying to a family member's phone has paid the household, not the unit.</li>
</ul>
<h2>The four flows that may cross</h2>
<table>
<thead><tr><th>What happens</th><th>What it is called</th><th>What it is not</th></tr></thead>
<tbody>
<tr><td>You put your own savings into the unit</td><td>Capital introduced</td><td>Not a sale, and not turnover</td></tr>
<tr><td>You take money out for the house</td><td>Drawings</td><td>Not an expense, and it does not reduce profit</td></tr>
<tr><td>A relative gives money to be returned</td><td>A loan to the business</td><td>Not capital, and not a gift</td></tr>
<tr><td>You return that money</td><td>Repayment of the loan</td><td>Not drawings, and not a cost</td></tr>
</tbody>
</table>
<h2>Setting the monthly drawing</h2>
<p>Take the owner's wage you already put in the cost sheet and make that your drawing. A dairy in Mancherial that allowed ₹12,000 a month for the owner's own labour draws ₹12,000 on the fifth of every month by transfer, and nothing else. Two rules keep it honest. Never take the day's collection before it is banked, because a hand in the counter cash is the hole that never closes. And when the household genuinely needs more, take it as a second, dated drawing rather than as an untraceable withdrawal, so that at the end of the year you can see what the household actually took.</p>
<h2>Running the imprest float</h2>
<p>Fix a float, say ₹2,000, and keep it in one box. Every rupee that leaves the box leaves a bill or a slip behind in the box, so cash plus paper always adds to ₹2,000. Once a week you count the bills, draw exactly that amount from the account, and the float is back at its figure. If ₹1,450 of bills is in the box, you draw ₹1,450, not ₹2,000. The arithmetic itself catches a missing slip within a week, which is the whole point of running a float instead of a purse.</p>
<h2>What the statement becomes</h2>
<p>After six months of this, the account is no longer a bank formality. Its <strong>credit summation</strong> is the closest thing you have to independent proof of sales, its balances show whether the unit can carry a repayment, and a branch officer can read your business in three minutes without believing anything you say. That is a real asset, and it is built only by banking the collections instead of holding them at home.</p>
<h2>The monthly check that takes five minutes</h2>
<ol>
<li>Write the month's profit from your books.</li>
<li>Write the month's total drawings, every dated withdrawal added up.</li>
<li>Subtract. A positive number is money staying in the unit. A negative number, month after month, means the household is consuming the business.</li>
</ol>`,
      Advanced: `<p>Owners who accept the principle still lose the wall in the same six ways, and each of them is quiet enough to run for a year before it is noticed.</p>
<h2>The payment that lands in the wrong phone</h2>
<p>Digital collection is where the wall breaks first. A customer scans whatever code is on the counter, and a code created on a family member's phone credits the household account. The unit's records then show a delivery with no receipt, and the bank statement understates sales by exactly the amount that was easiest to collect. Print one QR belonging to the business account, remove every other code from the counter, and when a payment does land elsewhere, transfer it to the business account the same day with a note against it. A same day transfer is a correction. A transfer made at the end of the month is a guess.</p>
<h2>Collections that never reach the bank</h2>
<p>A unit selling ₹1,80,000 a month may bank only ₹60,000 of it, keeping the rest as cash because cash is convenient. Two years later it applies for a working capital limit and is assessed on what the statement shows, which is one third of the truth. There is no argument that recovers this, because a cash book you wrote yourself is not independent evidence of anything. Bank the day's collection the next morning, take working expenses back out of the account, and accept the small inconvenience as the price of a readable statement.</p>
<h2>Family money entered as capital</h2>
<p>A brother in law gives ₹1,00,000. It is written in the books as capital because that is the shorter word. When it is returned, the return has to be dressed up as drawings, the unit's recorded capital falls for no visible reason, and the lender, if the unit is borrowing, sees the owner apparently withdrawing his stake. Write a plain note at the time: the amount, the date, whether interest is payable, and the repayment expectation. Repay by transfer, never by cash, so both sides can point to it.</p>
<h2>Household spending that dressed itself as a business cost</h2>
<p>Vehicle fuel, a phone bill, a repair at the house done by the unit's mason, goods taken home from your own stock. Each is defensible in the moment and each falsifies the cost sheet if it sits in expenses. Two rules settle all of them. If the spend would still happen with the unit closed, it is drawings. If goods leave your stock for the house, record them at cost as drawings, because otherwise the stock register shows a shortage and you will spend a fortnight looking for theft that never occurred.</p>
<h2>Drawings running ahead of profit</h2>
<p>Suppose the dairy earns ₹18,000 a month and the household takes ₹30,000. Sales are steady, the shed is busy, nothing looks wrong, and ₹12,000 a month of working capital is leaving. Within six months there is not enough to buy feed in the season, and the owner concludes that the business needs a loan. It does not. It needs the household to live inside the drawing. Run the profit less drawings check every month and treat three negative months as a decision point, because borrowing to fund drawings is the shortest route to an account that cannot be repaid.</p>
<h2>Two more that lenders notice immediately</h2>
<ul>
<li><strong>Two activities in one account.</strong> A tailoring unit and a grain trading counter running through the same account cannot be assessed separately, so the weaker one drags the file down. Keep an account for each activity even where one owner holds both.</li>
<li><strong>Self transfers to swell the credits.</strong> Money moved between your own accounts and back inflates the credit summation, and every lender nets it out. What survives is not the higher turnover you hoped for, it is the impression that the file was arranged.</li>
</ul>`,
      Expert: `<p>Recall card on the wall between the unit and the house. Classification first, then the rules, then the monthly discipline.</p>
<h2>Classify the transaction</h2>
<table>
<thead><tr><th>Transaction</th><th>Record as</th><th>Effect on profit</th></tr></thead>
<tbody>
<tr><td>Owner deposits own savings into the unit</td><td>Capital introduced</td><td>None</td></tr>
<tr><td>Owner takes money for the house</td><td>Drawings</td><td>None</td></tr>
<tr><td>Owner takes goods from stock for the house</td><td>Drawings at cost</td><td>None, but stock must be reduced</td></tr>
<tr><td>Relative gives money to be returned</td><td>Loan to the business</td><td>None; interest, if any, is a cost</td></tr>
<tr><td>Wage paid to a family member who actually works</td><td>Business expense</td><td>Reduces profit</td></tr>
<tr><td>School fee, medical bill, festival spend</td><td>Drawings</td><td>None</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Capital in is not a sale. Drawings out are not an expense.</li>
<li>If the spend would still happen with the unit shut, it is drawings.</li>
<li>The float plus its bills always equals the fixed figure. Replenish by the bills, never by the figure.</li>
<li>Bank the collection, then draw the expenses. A statement is evidence; your own cash book is not.</li>
<li>Family money is a loan with a written note, or it is a dispute waiting for a good year.</li>
<li>Profit minus drawings, every month. Three negatives is a decision, not a bad patch.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Milk or grain taken home.</strong> Value at cost, post to drawings, reduce stock the same day.</li>
<li><strong>Personal vehicle used for delivery.</strong> Pay the unit's own fixed allowance into the household rather than putting household fuel bills into expenses.</li>
<li><strong>Spouse working unpaid.</strong> Either pay a wage and record it, or leave it out entirely; a wage recorded but never paid corrupts both the cost sheet and the cash.</li>
<li><strong>Subsidy or scheme money credited.</strong> Neither a sale nor capital of your own. Record it against the asset or the purpose it was granted for.</li>
<li><strong>Advance from a customer.</strong> A liability until you deliver, so it is not income and it is a poor month's profit to celebrate.</li>
</ul>
<h2>Monthly discipline</h2>
<ol>
<li>Collections banked, at least on the following morning.</li>
<li>One dated drawing, at the figure you set from the cost sheet.</li>
<li>Float replenished against bills, once a week.</li>
<li>Every crossing between house and unit labelled on the day.</li>
<li>Profit less drawings written at the foot of the month.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A proprietor pays a child's school fee of ₹9,000 from the business account. How should it be recorded?",
        options: [
          "As a business expense, since it was paid from the business account",
          "As drawings, which reduce the owner's stake in the unit and do not reduce its profit",
          "As capital introduced, because the owner used the unit's money",
          "It need not be recorded at all, as the owner and the proprietorship are one person",
        ],
        answer: 1,
        explanation:
          "The fee would be payable whether or not the unit existed, so it is money taken out for the household and is recorded as drawings, leaving profit untouched. Calling it an expense is the tempting shortcut because the payment left the business account, and it quietly understates profit, which then makes the price you set from the cost sheet look adequate when it is not.",
        difficulty: "Easy",
        skill: "Owner's drawings",
      },
      {
        n: 2,
        question:
          "The owner deposits ₹50,000 of personal savings into the business account to help buy a machine. What does this do to the unit's turnover for the month?",
        options: [
          "It raises turnover by ₹50,000, since the money was credited to the account",
          "Nothing. It is capital introduced, and only a sale is turnover",
          "It raises turnover only if the machine is bought in the same month",
          "It reduces turnover, because the money will be withdrawn later",
        ],
        answer: 1,
        explanation:
          "Capital introduced is the owner funding the unit from outside it, so it changes the owner's stake and never the sales figure. Treating it as turnover is tempting because it appears in the credits on the statement, and it is exactly the entry a lender nets out, leaving a file that looks arranged rather than a business that looks larger.",
        difficulty: "Medium",
        skill: "Capital introduced",
      },
      {
        n: 3,
        question:
          "Customers at a tailoring counter scan a UPI code created on the owner's son's phone. What is the practical consequence and the fix?",
        options: [
          "No consequence, since the money is in the family either way; leave it as it is",
          "The receipts land in a household account, so the unit's statement understates its sales; put up one QR linked to the business account and transfer any stray receipt the same day",
          "The unit must stop accepting UPI and take only cash",
          "The son must open a business account in his own name for the unit",
        ],
        answer: 1,
        explanation:
          "Money collected into a household account never appears in the unit's credit summation, so the very sales that were easiest to collect become invisible to a lender and to your own records. The reasoning that it is all family money is the tempting one, and it fails because the statement, not the family, is what a branch reads when it sizes a limit.",
        difficulty: "Medium",
        skill: "Separate business account",
      },
      {
        n: 4,
        question:
          "A unit keeps an imprest float of ₹2,000. During the week ₹1,450 has been spent and the bills are in the box. How much is drawn to replenish it?",
        options: ["₹2,000", "₹1,450", "₹550", "Nothing until the box is empty"],
        answer: 1,
        explanation:
          "The float is restored to its fixed figure by drawing exactly the value of the bills, so ₹1,450 brings the box back to ₹2,000 of cash and paper together. Drawing ₹2,000 is the intuitive answer and it destroys the control, because the box then holds ₹2,550 and the arithmetic that would have exposed a missing slip no longer works.",
        difficulty: "Medium",
        skill: "Imprest cash float",
      },
      {
        n: 5,
        question:
          "A unit sells about ₹1,80,000 a month but banks only ₹60,000, holding the rest as cash at home. It now applies for a working capital limit. What happens?",
        options: [
          "The limit is sized on the ₹1,80,000, because the cash book shows the full sales",
          "The limit is sized on what the statement evidences, roughly a third of the real business",
          "The limit is refused outright for holding cash at home",
          "The bank verifies the cash at home and includes it",
        ],
        answer: 1,
        explanation:
          "Credit summation on the account is the independent evidence a lender has, so unbanked collections are simply not part of the assessment. Relying on the cash book is the tempting position, and it fails because a record you wrote yourself proves nothing to a third party, which is the whole reason banking discipline is worth its inconvenience.",
        difficulty: "Hard",
        skill: "Bank statement as evidence",
      },
      {
        n: 6,
        question:
          "A relative gives ₹1,00,000 to be returned in a year, and the owner writes it in the books as capital introduced. What goes wrong later?",
        options: [
          "Nothing, since both increase the money available to the unit",
          "The repayment has to be shown as drawings, the recorded capital falls for no visible reason, and the relative holds no document for what was owed",
          "The relative automatically becomes a partner in the unit",
          "The amount becomes taxable income of the business",
        ],
        answer: 1,
        explanation:
          "A loan is a liability to be repaid while capital is the owner's own stake, so recording one as the other makes the repayment unexplainable in the books and leaves the lender reading it as the owner withdrawing his investment. Treating the two as interchangeable is tempting because both bring money in, and the harm shows up only at repayment, when the relative has nothing in writing either.",
        difficulty: "Medium",
        skill: "Loans between household and business",
      },
      {
        n: 7,
        question:
          "A dairy earns ₹18,000 a month and the household takes ₹30,000 a month. Sales are steady. What is happening?",
        options: [
          "Nothing serious, because sales have not fallen",
          "The unit is losing ₹12,000 of working capital a month, so material will become unaffordable in the season even though the business looks busy",
          "The unit is making a loss of ₹12,000 a month",
          "The extra ₹12,000 is an expense that will reduce the tax payable",
        ],
        answer: 1,
        explanation:
          "Drawings above profit are funded out of the money the business needs to trade with, so the capital drains at ₹12,000 a month while every visible sign stays healthy until the buying season arrives. Calling it a loss is the near miss: the unit is profitable, and the damage is to cash rather than to the profit figure, which is why the profit less drawings check has to be done separately every month.",
        difficulty: "Hard",
        skill: "Owner's drawings",
      },
    ],
  },
  31612: {
    topicId: 31612,
    title: "Cash book, stock register and bill book",
    summary:
      "Three hand written books carry a village unit for its first several years: a cash book that is balanced against the cash box every evening, a stock register that can be checked against what is actually in the shed, and a serial numbered bill book that no sale escapes. You learn the ruling of each, the three reconciliations that make them trustworthy, and why a book written from memory at the end of the month is worse than no book.",
    concepts: [
      "Cash book and daily balancing",
      "Vouchers and supporting bills",
      "Stock register",
      "Serial numbered bill book",
      "Reconciliation",
      "Monthly summary",
    ],
    glossary: {
      "Cash book":
        "A dated register of every rupee received and paid, with a running balance carried down each day, kept so that the balance written in the book can be set against the cash counted in the box.",
      Voucher:
        "The paper standing behind an entry, such as a supplier bill, a delivery slip or a wage acknowledgement, numbered and filed so the entry can be proved months later without relying on anybody's memory.",
      "Stock register":
        "A record kept for each material and finished good showing opening quantity, quantity received, quantity issued or sold and the closing quantity, so that what is written can be compared with what is counted.",
      "Serial numbered bill book":
        "A duplicate bill book in an unbroken number series, one copy handed to the customer and one retained. The unbroken series is the control, which is why a cancelled bill is kept in the book rather than torn out.",
      "Physical verification":
        "Counting what is genuinely in the shed and comparing it against the register balance, with any difference written down and explained rather than quietly corrected to match.",
      "Carried down balance":
        "The figure a book closes a day or a month on, written into the next period as the opening figure, so that the books run as one continuous record instead of a set of unconnected pages.",
    },
    body: {
      Beginner: `<p>You need three books and a file. Not a computer, not an accountant, and not a system somebody sells you. Three ruled notebooks bought from a stationery shop, written on the day the thing happens, will carry your unit for years.</p>
<h2>The cash book</h2>
<p>Rule five columns on the page: date, what happened, receipts, payments, balance. Every rupee that comes in and every rupee that goes out gets one line, on the day it moves. At the end of the day you work out the balance, then open the cash box and count. The two should agree. When they do not, you look for the missing line that same evening, while you can still remember it.</p>
<h2>The stock register</h2>
<p>One page for each thing you buy or make. Rule four columns: date, quantity received, quantity used or sold, quantity left. A millet unit keeps a page for grain, a page for pouches and a page for packed material. Once a month you go into the shed and count. What you count and what the page says should match, and if they do not, something has gone out without being written.</p>
<h2>The bill book</h2>
<p>Buy a duplicate bill book with printed numbers on it. Every sale gets a bill: the top copy to the customer, the carbon copy stays in the book. If a bill is spoiled, cross it and leave it in the book. Never tear it out, because the missing number is exactly what makes an unbroken series worth keeping.</p>
<h2>The file</h2>
<p>Behind those three books sits one file with every paper you receive: the grain merchant's bill, the pouch supplier's bill, the electricity receipt, the slip for transport. Write a small number on each paper and write the same number in your cash book line. That number is what lets you find the proof of an entry a year later in half a minute.</p>
<h2>The only rule that matters</h2>
<p>Write it on the day. A book brought up to date at the end of the month is a book written from memory, and memory rounds everything to a comfortable figure. Ten minutes each evening replaces a whole day of guessing at month end, and it is the difference between records a bank officer reads and records a bank officer sets aside.</p>`,
      Intermediate: `<p>Take a millet processing unit in Adilabad, one owner and one helper, buying grain from farmers and supplying packed material to shops. The three books look like this in practice.</p>
<h2>The cash book, ruled and balanced</h2>
<table>
<thead><tr><th>Date</th><th>Particulars</th><th>Voucher</th><th>Receipts</th><th>Payments</th><th>Balance</th></tr></thead>
<tbody>
<tr><td>04</td><td>Opening balance</td><td></td><td></td><td></td><td>4,200</td></tr>
<tr><td>04</td><td>Grain purchased, 4 quintals</td><td>V-31</td><td></td><td>9,600</td><td></td></tr>
<tr><td>04</td><td>Cash withdrawn from bank</td><td>V-32</td><td>10,000</td><td></td><td>4,600</td></tr>
<tr><td>05</td><td>Sale, bill 214, shop at the market</td><td>B-214</td><td>3,750</td><td></td><td></td></tr>
<tr><td>05</td><td>Helper wages, week</td><td>V-33</td><td></td><td>2,400</td><td>5,950</td></tr>
<tr><td>06</td><td>Pouches and labels</td><td>V-34</td><td></td><td>1,150</td><td></td></tr>
<tr><td>06</td><td>Sale, bill 215</td><td>B-215</td><td>2,300</td><td></td><td>7,100</td></tr>
</tbody>
</table>
<p>Two disciplines make this book worth keeping. Every line carries a voucher or bill number, so the paper behind it can be found. And the balance is worked and compared with the counted cash at the close of each day, not at the close of the week.</p>
<h2>The stock register, per item</h2>
<table>
<thead><tr><th>Date</th><th>Particulars</th><th>In</th><th>Out</th><th>Balance</th></tr></thead>
<tbody>
<tr><td>01</td><td>Opening, cleaned grain</td><td></td><td></td><td>180 kg</td></tr>
<tr><td>04</td><td>Purchase, 4 quintals raw</td><td>400 kg</td><td></td><td>580 kg</td></tr>
<tr><td>05</td><td>Issued to machine</td><td></td><td>300 kg</td><td>280 kg</td></tr>
<tr><td>05</td><td>Output to finished page, and husk</td><td></td><td></td><td>280 kg</td></tr>
</tbody>
</table>
<p>Keep a separate page for finished packed material and one for by-products such as husk and bran. A register that records only what goes into the machine and not what comes out of it will show a permanent shortage, because milling loses weight by design and an unrecorded yield loss looks exactly like a theft.</p>
<h2>The bill book</h2>
<p>Bills run in one unbroken series across the year. The carbon copy carries the same detail as the customer's copy: date, buyer, quantity, rate, amount, and whether it was paid in cash or is to be collected. A tailoring unit in Wanaparthy that writes a bill only when the customer asks for one has no way to reconcile a day's takings, because the bills it holds are a random sample of what it sold.</p>
<h2>The three reconciliations</h2>
<ol>
<li><strong>Cash book against the cash box,</strong> every evening. A difference is a missing entry, and it is found the same day or never.</li>
<li><strong>Stock register against a physical count,</strong> once a month. Write the counted figure, the register figure and the difference, then explain the difference. Do not overwrite the register to make it agree.</li>
<li><strong>Bill book against the receipts side of the cash book,</strong> at the end of the week. Total the bills, total the sale receipts, and account for the gap as credit sales still to be collected.</li>
</ol>
<h2>What the books produce at month end</h2>
<p>Add the receipts and payments columns, carry the closing balance forward, and write a short summary page: sales for the month, purchases, wages, other expenses, closing stock and closing cash. That single page, repeated for twelve months, is what a branch officer reads when you ask for a limit, and it is also the only honest input to next year's cost sheet.</p>`,
      Advanced: `<p>Books fail in predictable ways, and every one of them is visible to a reader who knows what to look for. These are the failures worth designing against.</p>
<h2>Written from memory at month end</h2>
<p>The single commonest failure. Pages in one ink, in one handwriting, in one sitting, with round figures and no corrections anywhere. It reads as reconstruction because it is reconstruction, and reconstruction cannot be reconciled against anything. Ten minutes each evening produces a book with different inks, occasional struck through corrections and untidy figures, and that book is believed. Strike a wrong entry through, write the correction beside it and initial it. Never erase, never paint over, never rewrite a page cleanly.</p>
<h2>Credit sales entered in the cash book</h2>
<p>A delivery on credit is not a receipt, and putting it in the receipts column makes the cash book fail its own daily tally on the very first day. Credit sales belong in the bill book and in a simple customer page for each buyer: date, bill number, amount, part payments and balance. The cash book records the money only when the money actually arrives. Owners who mix the two end up with a book that never agrees with the box, and then stop balancing at all, which is how the whole system dies inside a month.</p>
<h2>Impossible balances and silent gaps</h2>
<ul>
<li><strong>A negative cash balance.</strong> The box cannot hold less than nothing, so a negative running balance is proof that a receipt is missing, usually cash withdrawn from the bank or money brought in by the owner.</li>
<li><strong>Missing bill numbers.</strong> A gap in the series is the first thing an outside reader checks. Retain cancelled bills, marked as cancelled, in the book.</li>
<li><strong>A sundry line.</strong> An entry described as sundry or miscellaneous carries no information at all. Name the thing, even in three words.</li>
<li><strong>UPI receipts written up on Sunday.</strong> Digital receipts feel already recorded because the phone shows them. They still need a dated cash book or bank column line, and a week of them written together loses the order in which the money arrived.</li>
</ul>
<h2>The stock register that ignores the process</h2>
<p>Milling, cutting and stitching all lose material by design. If the register carries raw material issued but not the finished output, the by-product and a stated yield, the monthly count will always show less than the page says, and an owner will spend a fortnight hunting for a thief. Record the issue, the finished output, the by-product and the loss, and write the yield percentage you are getting beside it. Two months of that data is also the most reliable input your cost sheet will ever have, because it is measured rather than assumed.</p>
<h2>Adding the bank column</h2>
<p>Once collections are being banked, rule the cash book with two pairs of columns, cash and bank, so that a deposit is one line showing money leaving the cash side and entering the bank side. At month end the bank side is compared with the bank statement, and the differences are ordinary: a cheque issued and not yet presented, a transfer credited on a later date, charges the bank has taken that you did not know about. Write those differences down as a short reconciliation rather than adjusting your book to whatever the statement says.</p>
<h2>Keeping the books usable to others</h2>
<ul>
<li>Number the pages of each book before you start writing in it.</li>
<li>Keep the vouchers of a month in one bundle, in voucher number order, with the month written on the outside.</li>
<li>Keep completed books and voucher bundles for the period your tax and licence obligations require, and treat that as a minimum rather than a target.</li>
<li>Write in a language and script somebody else in the household can read, because a book only you can read is a risk to the family and not an asset to it.</li>
</ul>`,
      Expert: `<p>Recall card for the three books. Formats, the reconciliations, the month end sequence, then the edge cases.</p>
<h2>Formats at a glance</h2>
<table>
<thead><tr><th>Book</th><th>Columns</th><th>Balanced against</th><th>How often</th></tr></thead>
<tbody>
<tr><td>Cash book</td><td>Date, particulars, voucher, receipts, payments, balance</td><td>Cash counted in the box</td><td>Every evening</td></tr>
<tr><td>Cash book with bank</td><td>The same, with cash and bank pairs</td><td>Bank statement</td><td>Monthly</td></tr>
<tr><td>Stock register</td><td>Date, particulars, in, out, balance, per item</td><td>Physical count in the shed</td><td>Monthly</td></tr>
<tr><td>Bill book</td><td>Printed serial, date, buyer, quantity, rate, amount, cash or credit</td><td>Receipts side of the cash book</td><td>Weekly</td></tr>
<tr><td>Customer page</td><td>Date, bill number, amount, received, balance</td><td>Bills outstanding</td><td>Weekly</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Write on the day. A book written at month end is a memory, and memory rounds.</li>
<li>Every line carries a voucher number, and every voucher sits in the file.</li>
<li>A credit sale is a bill, not a receipt. Cash is recorded when cash arrives.</li>
<li>A negative cash balance is arithmetic proof of a missing entry.</li>
<li>Strike through and initial. Never erase, never rewrite a page clean.</li>
<li>Record the yield, or the stock register will accuse an honest helper.</li>
</ul>
<h2>Month end sequence</h2>
<ol>
<li>Balance the cash book and count the box.</li>
<li>Count physical stock, item by item, and write count, register figure and difference.</li>
<li>Total the bill book and tie it to receipts plus credit outstanding.</li>
<li>Reconcile the bank column with the statement and list the differences.</li>
<li>Write the summary page: sales, purchases, wages, expenses, closing stock, closing cash.</li>
<li>Bundle the month's vouchers in number order and label the bundle.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li><strong>Goods taken home.</strong> Out in the stock register at cost, and drawings in the cash book. Two entries, one event.</li>
<li><strong>Advance from a customer.</strong> A receipt in the cash book, but not a sale until the goods are delivered and billed.</li>
<li><strong>Returned goods.</strong> Back into the stock register with a reference to the original bill number, so the series still explains itself.</li>
<li><strong>Job work.</strong> Material belonging to a customer is recorded in a separate register, because it is not your stock and must never sit in your closing value.</li>
<li><strong>Free samples.</strong> Out of stock, valued at cost, described as samples, so that the shortage has a name.</li>
</ul>`,
    },
  },
  31614: {
    topicId: 31614,
    title: "Pricing that survives a competitor down the road",
    summary:
      "The month a similar unit opens two streets away, the first instinct is to match its rate, and that instinct has closed more small units than any bad machine ever has. You learn where your price floor really sits, how much extra volume a price cut silently demands, how discounts and credit cut a price without anybody announcing it, and what to do instead when the customer in front of you has a cheaper option.",
    concepts: [
      "Cost floor",
      "Contribution per unit",
      "Price war arithmetic",
      "Hidden price cuts",
      "Differentiation instead of discount",
      "Input cost pass-through",
    ],
    glossary: {
      "Cost floor":
        "The price below which a sale takes money out of the unit. For one extra sale in a slack week it is the variable cost of that sale; across any period that must also pay rent, power and the owner's wage, it is the full cost of a unit.",
      Contribution:
        "Selling price less the variable cost of that sale. It is the money the sale hands over towards fixed costs and profit, and it is the figure that decides whether an unusual order is worth taking.",
      "Compensating volume":
        "The extra quantity you must sell after cutting a price merely to end the month where you began. It is worked from contribution, never from the price, which is why it is always larger than owners expect.",
      "Effective price":
        "What the customer actually costs you after trade discount, free delivery, replacement of damaged stock and the wait for payment are all taken off the printed rate. It is the only price that matters to your books.",
      Differentiation:
        "A difference in the product or the service that the customer can see and is willing to pay for, which is what allows two units in the same street to sell at different rates without one of them emptying.",
      "Pass-through":
        "Moving a rise in an input cost into the selling price, done in small dated steps or by changing the quantity in the pack, rather than being absorbed until the margin has gone and then corrected in one large jump.",
    },
    body: {
      Beginner: `<p>A millet processing unit in Suryapet has been selling 1 kg packs at ₹80 for two years. This month a new unit opens in the same mandal and puts its packs out at ₹72. The owner's first thought is to drop to ₹72 by the weekend. Before doing that, work out what the ₹8 actually costs you.</p>
<h2>Where your money in a pack really is</h2>
<p>Out of ₹80, the grain, the pouch, the power and the labour take about ₹56. What is left, ₹24, is what the pack hands you towards rent, the meter, the machine and your own wage. That ₹24 is the <strong>contribution</strong>, and it is the number a price cut attacks.</p>
<p>Drop the price to ₹72 and the ₹56 does not change, so the contribution falls to ₹16. You did not lose ten per cent. You lost a third of the money the pack was bringing you.</p>
<h2>How much more must you sell</h2>
<p>If the unit was selling 1,500 kg a month at ₹24, that was ₹36,000 of contribution. To reach ₹36,000 at ₹16 a pack you must sell 2,250 kg. That is fifty per cent more grain cleaned, packed and carried, for exactly the same money as before. Ask yourself honestly whether the mandal will buy fifty per cent more millet because the rate fell by ₹8.</p>
<h2>The floor you must never cross</h2>
<p>Below ₹56 every pack you sell takes money out of your pocket, and selling more of it makes the hole deeper. Between ₹56 and the full cost you are paying part of your fixed costs but not all of them. A unit can survive a short period there. It cannot live there.</p>
<h2>What to do instead of matching</h2>
<ul>
<li>Find out first whether customers are actually leaving. Losing two shops out of twelve is not a price problem.</li>
<li>Give a reason to come back that the other unit is not giving: a fixed delivery day, a pack that is genuinely clean of stones, replacement of a bad pack without argument.</li>
<li>If you must concede, concede to the shops at risk and not to everybody, and concede something other than the rate, such as a slightly larger pack for the same money.</li>
<li>Watch the new unit's rate for two months. A rate set below its own costs will not survive its first season, and you cannot outlast that by copying it.</li>
</ul>`,
      Intermediate: `<p>Pricing under competition is arithmetic first and judgement second. Do the arithmetic before the conversation with the customer, because the conversation always pushes towards the discount.</p>
<h2>The arithmetic of a matched price</h2>
<p>Take the Suryapet millet unit. Selling price ₹80 a kg, variable cost ₹56, contribution ₹24, fixed costs ₹18,000 a month, current sales 1,500 kg.</p>
<table>
<thead><tr><th>Line</th><th>At ₹80</th><th>Matched at ₹72</th></tr></thead>
<tbody>
<tr><td>Contribution per kg</td><td>₹24</td><td>₹16</td></tr>
<tr><td>Break-even quantity</td><td>750 kg</td><td>1,125 kg</td></tr>
<tr><td>Contribution at 1,500 kg</td><td>₹36,000</td><td>₹24,000</td></tr>
<tr><td>Profit after fixed costs</td><td>₹18,000</td><td>₹6,000</td></tr>
<tr><td>Volume needed to hold ₹18,000</td><td>1,500 kg</td><td>2,250 kg</td></tr>
</tbody>
</table>
<p>A ten per cent cut in the rate took two thirds of the profit, and the volume required to undo it is fifty per cent. The general rule behind it is worth memorising: the compensating volume is the size of the cut divided by the contribution margin less the cut. The thinner your margin, the more brutal the arithmetic, which is why trading units with small margins cannot fight on price at all.</p>
<h2>The price you are actually getting</h2>
<p>Before cutting anything, work out the <strong>effective price</strong> you already give away.</p>
<ul>
<li>Printed rate to shops, ₹80.</li>
<li>Trade discount of five per cent, ₹4.</li>
<li>Delivering to the shop yourself, about ₹2 a pack once fuel and time are counted.</li>
<li>Replacing the occasional damaged pack, about ₹1 spread across all of them.</li>
<li>Thirty days of waiting to be paid, which costs whatever a month of your own borrowing costs.</li>
</ul>
<p>The shop is paying you close to ₹73 already. Cut the rate to ₹72 on top of that and you are trading at ₹65 while telling yourself you are at ₹72. Fix the leaks before you touch the rate: collect in fifteen days instead of thirty, charge for delivery beyond a distance, or hold the discount for shops that pay on time.</p>
<h2>Deciding whether it is really a price problem</h2>
<p>Ask three customers who stopped buying, and ask them plainly what made them change. The answers usually fall into four groups, and only one of them is answered with a lower rate.</p>
<ol>
<li><strong>Rate.</strong> Then the arithmetic above applies, and so does the question of whether the competitor can sustain it.</li>
<li><strong>Availability.</strong> You were out of stock on the day the shop needed it, which is a stock planning problem.</li>
<li><strong>Quality or consistency.</strong> Stones in one pack, a different colour in another, weight that varies. This is the most common answer and it is not fixed by a discount.</li>
<li><strong>Service.</strong> An uncertain delivery day, no bill, an argument about a returned pack.</li>
</ol>
<h2>Concede narrowly, if you concede</h2>
<p>A rate cut announced to everybody is given to the customers who were never going to leave. Segment it instead. Offer a lower rate on a bulk pack that a household will not buy. Offer a rate for cash on delivery, which also shortens your cash cycle. Offer a slack season rate that ends on a stated date. A dairy in Karimnagar that could not match a private collector's rate offered a fixed evening collection time and an on the spot weight slip instead, and kept most of its farmers, because the farmers were being paid for certainty rather than for the last fifty paise.</p>`,
      Advanced: `<p>The hard cases in pricing are not about the formula. They are about reading the competitor correctly, protecting a rate you can defend, and moving the rate when your inputs move.</p>
<h2>Read the competitor before you answer</h2>
<p>Three questions decide the response, and all three are answerable in a fortnight of watching.</p>
<ul>
<li><strong>Is the low rate costed or borrowed?</strong> A new owner who has not put a wage for himself in the cost sheet, or who bought a machine under a scheme and is not setting anything aside for its replacement, is selling below a floor he has not calculated. That rate will correct itself, usually in the first slack season. Matching it means adopting his mistake and losing your own margin while he learns.</li>
<li><strong>Is it an introductory rate?</strong> An opening rate meant to fill a new machine has a natural end. A discount you announce in response has no end, because taking a price back up is far harder than bringing it down.</li>
<li><strong>Is he actually taking your customers?</strong> Count them. A unit that has lost two shops out of twelve and reacts with a rate cut across all twelve has paid ten shops for nothing.</li>
</ul>
<h2>Build a rate you can defend</h2>
<p>Defensible pricing needs one visible difference that costs you less than the discount would. Reliable weight, verified by your own scale check, printed on a bill. A delivery day the shop can plan its shelf around. Replacement of a bad pack without an argument. A grade the other unit does not offer, such as a coarser variety households ask for at festival time. Each of these is answered with work rather than with margin, and none of them can be copied by simply printing a smaller number.</p>
<h2>The order that fills idle capacity</h2>
<p>An institution offers ₹68 a kg for 400 kg in a month when the machine stands idle for a week. It is below your full cost of about ₹68 to ₹70 and well above the variable ₹56, so it adds about ₹4,800 of contribution that you would not otherwise have. Take it only against three conditions: it must not displace a sale you would have made at the full rate, it must be written as a one time or seasonal rate with an end date, and it must not become the rate the buyer expects next year. Break any one of those and the special rate becomes your rate.</p>
<h2>Moving the price when inputs move</h2>
<p>Grain, cloth, milk and oil rates move every season, and small units routinely absorb the rise because they fear losing customers. Absorbing a rise is a price cut you never decided to make. Handle it in one of three ways instead:</p>
<ol>
<li><strong>Dated small steps.</strong> Tell the shops the rate changes from the first of the month, and change it by a small amount when the input moves, not once a year by a large one.</li>
<li><strong>Change the quantum, not the rate.</strong> Where the rate is a habit in the local market, adjust the pack size and state the new net quantity honestly on the label. Never leave the old declaration on a lighter pack.</li>
<li><strong>Change the mix.</strong> Push the pack or the grade that carries a better contribution, so the average rate you realise rises without any single rate rising.</li>
</ol>
<h2>Signals you are already losing the war</h2>
<ul>
<li>The discount is negotiated separately with each customer, so no two shops pay the same and nobody can be refused.</li>
<li>Credit periods are lengthening while rates stay flat. The price is being cut on the calendar instead of the rate card.</li>
<li>You are quoting from the competitor's rate rather than from your own cost sheet, which means the competitor is now pricing your unit.</li>
<li>Volume rose after the cut and the bank balance did not, the one symptom that proves the compensating volume was never reached.</li>
</ul>`,
      Expert: `<p>Recall card for pricing under competition. The two formulas, the compensating volume table, the rules, then the edge cases.</p>
<h2>Two formulas</h2>
<ul>
<li>Contribution per unit equals selling price less variable cost per unit.</li>
<li>Compensating volume, as a percentage, equals the price cut divided by the contribution margin less that cut, both measured as percentages of price.</li>
</ul>
<h2>What a price cut demands</h2>
<table>
<thead><tr><th>Price cut</th><th>Margin 30 per cent</th><th>Margin 50 per cent</th><th>Margin 70 per cent</th></tr></thead>
<tbody>
<tr><td>5 per cent</td><td>20 per cent more volume</td><td>11 per cent</td><td>8 per cent</td></tr>
<tr><td>10 per cent</td><td>50 per cent</td><td>25 per cent</td><td>17 per cent</td></tr>
<tr><td>15 per cent</td><td>100 per cent</td><td>43 per cent</td><td>27 per cent</td></tr>
<tr><td>20 per cent</td><td>200 per cent</td><td>67 per cent</td><td>40 per cent</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>A cut attacks contribution, not price. Ten per cent off an ₹80 pack is a third of its ₹24.</li>
<li>Never below variable cost. Between variable and full cost only with an end date.</li>
<li>Count the effective price first. Discount, delivery, breakage and waiting are already a cut.</li>
<li>Concede to the customer at risk, never to the whole rate card.</li>
<li>An introductory rate ends by itself. A discount you announce does not.</li>
<li>Absorbing an input rise is an undecided price cut.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Trading, not making.</strong> A margin of ten per cent cannot fight on price at all; a five per cent cut needs the volume to double.</li>
<li><strong>Competitor exits.</strong> Take the price back in steps, and take back the service concessions last, because those are what kept the customers.</li>
<li><strong>Bulk institutional order.</strong> Judge on contribution, insist on an end date, and keep it off the retail rate card.</li>
<li><strong>Barter or exchange offers.</strong> Value them in rupees at cost before agreeing; a free pack with every ten is a nine per cent cut.</li>
<li><strong>Rate card on a board.</strong> A written rate reduces haggling and makes a concession a decision instead of a habit.</li>
</ul>
<h2>Before you change a rate</h2>
<ol>
<li>Contribution per unit worked from the current cost sheet, not last year's.</li>
<li>Compensating volume calculated and compared with what the market can absorb.</li>
<li>Effective price worked after discounts, delivery, breakage and credit.</li>
<li>Three lost customers actually asked why they left.</li>
<li>The competitor's rate judged as costed, introductory or unsustainable.</li>
<li>The concession, if any, segmented, dated and written down.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A pack sells at ₹80, its variable cost is ₹56 and its full cost including a share of fixed costs is about ₹68. Where does the price floor sit?",
        options: [
          "At ₹80, because that is the established rate",
          "At ₹56 for one extra sale in a slack week, while any period of trading must still realise about ₹68 to pay the fixed costs",
          "At ₹68 always, because no sale below full cost can ever be accepted",
          "There is no floor as long as sales are rising",
        ],
        answer: 1,
        explanation:
          "A sale above ₹56 leaves something behind towards fixed costs, so it is worth taking when capacity would otherwise stand idle, but the month as a whole still has to realise the full cost or the fixed costs go unpaid. The rule that nothing below full cost is ever acceptable is the tempting one, and it makes a unit refuse orders that would have paid part of its rent in a slack week.",
        difficulty: "Easy",
        skill: "Cost floor",
      },
      {
        n: 2,
        question:
          "A millet unit sells 1 kg packs at ₹80 with a variable cost of ₹56 and monthly fixed costs of ₹18,000. What is the contribution per pack and the break-even quantity?",
        options: [
          "₹80 and 225 kg",
          "₹24 and 750 kg",
          "₹56 and 321 kg",
          "₹24 and 1,500 kg",
        ],
        answer: 1,
        explanation:
          "Contribution is ₹80 less ₹56, which is ₹24, and dividing ₹18,000 of fixed costs by ₹24 gives 750 kg. Dividing the fixed costs by the selling price is the usual slip and produces 225 kg, which quietly assumes that the grain, the pouch and the power cost nothing at all.",
        difficulty: "Medium",
        skill: "Contribution per unit",
      },
      {
        n: 3,
        question:
          "That unit sells 1,500 kg a month and earns ₹18,000. A competitor opens at ₹72 and the owner matches. How much must be sold to earn ₹18,000 again?",
        options: [
          "1,500 kg, since the cost per pack has not changed",
          "About 1,650 kg, a rise matching the ten per cent cut",
          "2,250 kg, a rise of fifty per cent",
          "About 1,875 kg, a rise of twenty five per cent",
        ],
        answer: 2,
        explanation:
          "Contribution falls from ₹24 to ₹16, so the ₹36,000 of contribution that produced the profit now needs 2,250 kg rather than 1,500 kg, which is fifty per cent more work for the same money. Assuming volume need rise only by the size of the cut is the attractive error, because a cut is taken entirely out of contribution and not out of the whole price.",
        difficulty: "Hard",
        skill: "Price war arithmetic",
      },
      {
        n: 4,
        question:
          "The printed rate is ₹80. The unit gives shops a five per cent trade discount, delivers at a cost of about ₹2 a pack, and replaces damaged packs at about ₹1 a pack. What is it really realising, before the wait for payment is counted?",
        options: [
          "₹80, because the printed rate has not been changed",
          "About ₹73 a pack, so a concession of nearly nine per cent has already been given",
          "₹76, since only the discount counts as a price reduction",
          "₹56, which is the variable cost",
        ],
        answer: 1,
        explanation:
          "Discount of ₹4, delivery of ₹2 and breakage of ₹1 come off the ₹80 exactly as a rate cut would, leaving about ₹73 before the thirty day wait is even valued. Counting only the printed discount is the tempting view and it is how units end up trading far below the rate they believe they are defending.",
        difficulty: "Medium",
        skill: "Hidden price cuts",
      },
      {
        n: 5,
        question:
          "Three shops out of twelve have shifted to a new unit. Asked why, they say the packs arrive on no fixed day and one pack in ten has stones in it. What is the correct response?",
        options: [
          "Match the competitor's rate across all twelve shops immediately",
          "Fix the delivery day and the cleaning, and offer the three shops a written replacement assurance, since the customers left over reliability and not rate",
          "Reduce the pack size so the rate can be held",
          "Stop supplying the three shops and look for new ones",
        ],
        answer: 1,
        explanation:
          "The customers named availability and consistency, and both are answered with work that costs less than a permanent margin cut and that the competitor cannot copy by printing a smaller number. Cutting the rate for all twelve is the instinctive move and is the worst of the four, because it pays nine shops that were not leaving and does nothing about the stones.",
        difficulty: "Medium",
        skill: "Differentiation instead of discount",
      },
      {
        n: 6,
        question:
          "Grain rates rise steadily through the year and the unit holds its ₹80 pack rate, then raises it to ₹96 in one step. What is wrong with that approach?",
        options: [
          "Nothing, since customers dislike frequent changes",
          "The margin was being given away all year, and a single large jump reads as opportunism, so small dated steps or an honest change of pack size is safer",
          "The unit should never raise its rate once it is established",
          "The rise should have been recovered by lengthening the credit period instead",
        ],
        answer: 1,
        explanation:
          "Absorbing an input rise is a price cut nobody decided to make, and correcting it in one jump concentrates the customer's whole year of increase into a single conversation. Holding the rate to keep customers comfortable is the tempting position, and it costs the margin twice, once while absorbing and again when the correction finally arrives.",
        difficulty: "Medium",
        skill: "Input cost pass-through",
      },
      {
        n: 7,
        question:
          "An institution offers ₹68 a kg for 400 kg in a month when the machine would otherwise be idle for a week. Variable cost is ₹56. Should the order be taken?",
        options: [
          "No, because ₹68 is at or below the full cost of a pack",
          "Yes, since it adds about ₹4,800 of contribution, provided it displaces no full rate sale, carries an end date and does not become the expected rate",
          "Yes, and the retail rate should be brought down to ₹68 as well for consistency",
          "No, because a lower rate to one buyer is never permissible",
        ],
        answer: 1,
        explanation:
          "Each kilogram at ₹68 leaves ₹12 towards fixed costs that idle capacity would have earned nothing at all, so 400 kg adds about ₹4,800, and the three conditions are what stop a special rate from becoming the standard one. Refusing simply because the rate is below full cost is the tempting discipline, and it throws away contribution in exactly the week the unit needed it most.",
        difficulty: "Hard",
        skill: "Contribution per unit",
      },
    ],
  },
};

export default PART;
