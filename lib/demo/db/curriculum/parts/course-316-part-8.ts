/**
 * Course 316: Start Your Rural Micro-Enterprise, part 8.
 *
 * Topics 31618, 31619 and 31620: the whole of module 316006, the decisions of
 * the second year. Taking a first helper and paying that person properly, the
 * risks a village unit actually carries and the narrow slice of them that
 * insurance will carry for you, and what to do with a profit once there is one.
 *
 * Written for an owner who has already traded for a season: the cost sheet
 * exists, the books are being kept, and the questions have moved from whether
 * the idea works to whether it survives a person, a breakdown and a second
 * machine. Worked examples use enterprises that exist in these districts, a
 * millet processing unit, a tailoring unit, a dairy and a small food unit.
 * Every rupee figure is illustrative and exists only to make a method visible.
 * Statutory and insurance structures are taught by their shape and never by a
 * current rate, threshold, premium or subsidy, because those move and an owner
 * who memorises one of them has memorised the wrong thing.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31618: {
    topicId: 31618,
    title: "Hiring your first helper and paying them properly",
    summary:
      "A helper is not a wage, it is a monthly cost that arrives whether or not the orders do, so you price the person the way you priced your product and then ask how much extra output has to follow. You learn to build the loaded cost of one hand, choose between time rate and piece rate, set a piece rate from a fair day rather than a record day, and keep the attendance and wage records that settle a dispute and satisfy a bank.",
    concepts: [
      "Loaded cost of a helper",
      "Output needed to cover a helper",
      "Time rate and piece rate",
      "Minimum wage as a notified floor",
      "Muster roll and wage register",
      "Headcount thresholds for employer registration",
    ],
    glossary: {
      "Piece rate":
        "Pay computed on finished work that has passed your check, so many rupees for every accepted piece. The wage bill then moves with output instead of with the hours somebody spent inside the shed.",
      "Loaded wage":
        "The full monthly cost of keeping one helper, which is the cash wage plus tea and meals if you give them, plus material spoiled while the person learns, plus the hours you stop producing in order to teach and check.",
      "Muster roll":
        "The dated attendance record kept at the workplace, naming each person present on each day and the hours worked. It is the document that answers the question of who was actually there on a day somebody later disputes.",
      "Wage register":
        "The record of what was earned and what was paid to each person for each wage period, with deductions shown separately and an acknowledgement against the payment.",
      "Scheduled employment":
        "An occupation listed in the minimum wages schedule, for which the appropriate government notifies a rate that is revised from time to time. Work that falls in a scheduled employment carries a floor you cannot negotiate below.",
      "Rejection rate":
        "The share of pieces produced that fail your acceptance check. Under a piece rate it is the number that decides whether the rate you set is actually the rate you pay.",
    },
    body: {
      Beginner: `<p>There comes a week when you cannot finish the work alone. The orders are there, the machine stands free in the afternoon, and the only thing missing is a second pair of hands. Taking a helper is the right answer to that week. It is also the first time your unit carries a cost that arrives whether or not the orders do.</p>
<h2>Two ways to pay</h2>
<p>A <strong>time rate</strong> pays for hours. Somebody comes at nine, leaves at five, and is paid for the day whether ten pieces came out or two. A <strong>piece rate</strong> pays for finished work, so much for every completed piece that passes your check.</p>
<p>Time rate suits work you cannot count: cleaning, loading, minding a machine, standing at a counter. Piece rate suits work that comes out in identical units: blouses stitched, packs filled, sacks graded. Many small units use both, a small daily amount for turning up and a rate on top for each good piece.</p>
<h2>What a helper really costs</h2>
<p>Write the wage down, then keep writing. Tea and a meal if you provide them. Thread, cloth or grain spoiled while the person is still learning. The hours you spend teaching and checking instead of producing. A second pair of scissors, a stool, an apron. In a tailoring unit in Khammam the wage was ₹9,000 a month and the true cost, once tea, learning wastage and the owner's own lost hours were counted, sat closer to ₹11,000.</p>
<h2>The question to answer before you hire</h2>
<p>How many extra pieces must you sell each month to cover that ₹11,000? If each blouse leaves ₹120 after cloth, thread and power, then ₹11,000 divided by ₹120 is about 92 blouses a month, roughly four extra on every working day. If your order book cannot show you four extra a day, a helper is not yet a decision. It is a hope.</p>
<h2>Pay properly from the first day</h2>
<ul>
<li>Fix the rate in plain words with the person before work starts, and fix the day of the month on which you pay.</li>
<li>Keep a small attendance book. A date, a name, the hours worked, and a signature or thumb impression against the amount paid.</li>
<li>Pay on the day you said, in full. A unit that pays late loses its trained people to the unit that pays on time, and training the next person costs you all over again.</li>
<li>Pay into a bank account wherever you can. It writes the record for you.</li>
<li>Never take on a child. There is no version of this that is acceptable and none that is lawful.</li>
</ul>
<p>The government notifies a minimum wage for different kinds of work and revises it from time to time, so the floor is not yours to set. Ask at the labour office what applies to your trade, and treat that figure as the bottom of the range rather than the target.</p>`,
      Intermediate: `<p>Hiring is a capacity decision, and it is priced the same way you priced a kilogram of millet. Work out what one hand costs you in full, work out how much additional contribution has to appear to cover it, and only then decide the form of the pay.</p>
<h2>First, name the job</h2>
<p>Before the money, decide what the person will actually do, because that decides everything after it. In a millet processing unit in Vikarabad the owner was cleaning, grading, filling, sealing, labelling, delivering and collecting payment. The step that was holding the day back was filling and sealing, which is countable, repetitive and easy to teach. That is the job the helper takes. Handing over the deliveries instead would have felt like relief and would have moved no output at all.</p>
<h2>The loaded cost of one hand</h2>
<table>
<thead><tr><th>Item</th><th>Per month</th><th>How it was worked</th></tr></thead>
<tbody>
<tr><td>Cash wage</td><td>₹10,000</td><td>Agreed rate for a six day week</td></tr>
<tr><td>Tea and midday meal</td><td>₹600</td><td>Provided, so it belongs in the cost</td></tr>
<tr><td>Material spoiled while learning</td><td>₹400</td><td>Two months of higher wastage, spread over the year</td></tr>
<tr><td>Owner's supervision</td><td>₹1,500</td><td>One hour a day not producing, valued at the owner's own wage</td></tr>
<tr><td>Apron, gloves, second set of tools</td><td>₹200</td><td>Bought once, spread over twelve months</td></tr>
<tr><td><strong>Loaded cost</strong></td><td><strong>₹12,700</strong></td><td>The number the decision is made on</td></tr>
</tbody>
</table>
<h2>The output that has to follow</h2>
<p>A 5 kg millet pack leaves ₹22 after grain, pouch, label and power, which is its contribution. Cover ₹12,700 of loaded cost and you need ₹12,700 divided by ₹22, that is 577 packs a month, close to 23 packs on each of 25 working days. Two tests follow, and both have to pass.</p>
<ul>
<li><strong>Can the unit make them.</strong> The machine and the day must have 23 more packs in them once the helper is filling.</li>
<li><strong>Can the unit sell them.</strong> Shops that have already asked for more, or a mandal market day you have been turning away, count. A general belief that demand exists does not.</li>
</ul>
<h2>Choosing and setting the pay structure</h2>
<p>Use a time rate where output is not countable or where care matters more than speed, such as cleaning grain of stones. Use a piece rate where the unit is identical and the quality standard is objective. A blend works well for a first helper: a modest daily attendance amount so a slow day caused by a power cut does not leave a family with nothing, plus a rate on every accepted piece.</p>
<p>Set the piece rate from a fair steady day, never from the best day anybody has ever had. If a trained hand fills 120 packs on an ordinary day and the day's earning should sit near ₹450, the arithmetic gives ₹3.75 an accepted pack. Then fix what accepted means before the first pack, because a rate paid on everything produced is a different and larger number than a rate paid on everything that passes. State the seal, the weight tolerance and the label position that make a pack acceptable.</p>
<h2>The records, which are shorter than you fear</h2>
<ol>
<li>A <strong>muster roll</strong>: date, name, hours. Two minutes at the end of each day.</li>
<li>A <strong>wage register</strong>: the period, what was earned, what was deducted and what was paid, with an acknowledgement.</li>
<li>A wage slip handed over at payment, even a written one.</li>
<li>Payment by bank transfer where possible, which makes the wage cost visible in the statement your banker will read when you apply for the next limit.</li>
</ol>
<h2>What arrives with headcount</h2>
<p>Obligations on an employer attach at thresholds counted in persons employed, not in turnover, and they cover matters such as social security contributions and registration under the shops or factories rules that apply to your kind of premises. Both the thresholds and the contribution rates are set by statute and revised, so verify the current position at the labour office rather than carrying a number from another owner. What you can act on today is simpler: count correctly, and remember that persons engaged casually or through somebody else, but working on your floor, are still people working on your floor.</p>`,
      Advanced: `<p>The arithmetic of a first helper is easy. What goes wrong is the arrangement around it, and every failure below has happened to a working unit in these districts.</p>
<h2>Family labour that nobody costed</h2>
<p>A sister-in-law stitches every evening and is never paid, so the cost sheet shows a labour cost that does not exist. Two things then follow. The unit believes its margin is wider than it is and sets a price it cannot hold once that person stops. And the owner has no way of knowing whether an outside helper is affordable, because the comparison is against zero. Cost family labour at the rate you would pay a stranger for the same work, whether or not cash actually moves.</p>
<h2>The helper who becomes a partner by accident</h2>
<p>A friend joins, money is short, and instead of a wage the owner offers a share of the profit until things improve. That sentence, repeated in front of others and acted on for a year, is the making of a partner with a claim on the unit, not an employee with a claim on a wage. If somebody is helping, pay a wage. If somebody is a partner, write down the shares, the work each will do and the way one of you may leave, before the first good year makes it worth arguing about.</p>
<h2>Piece rates set on a record day</h2>
<p>An owner watches the fastest worker on the best day, sets the rate from it, and is then surprised that ordinary people earn very little and leave. The rate has to hold on a normal day with a normal power supply. Two guards help. Pay on accepted pieces only, with acceptance defined in advance. And keep a floor amount for attendance, so an interruption you caused, a shortage of raw material or a machine under repair, is not paid for out of the worker's pocket.</p>
<h2>Advances that turn into a rope</h2>
<p>An advance against future wages is a normal kindness in a village unit and it becomes something else when it is large, unrecorded and open ended. It can end as an arrangement in which somebody continues to work only because of what they owe you, which is not employment. Cap the advance at a fraction of a month's wage, write the repayment schedule against it, deduct that instalment openly in the wage register, and close it.</p>
<h2>The second helper hired before the constraint moved</h2>
<p>Output rose when the first helper came, so the owner reasons that a second will raise it again. Measure first. If the pulveriser is already running for every hour the power is on, a second person adds a wage and no packs, because the bottleneck is the machine and not the hands. The answer then is a second shift on the machine you own, or a second machine, decided on a payback calculation.</p>
<h2>Overtime treated as ordinary capacity</h2>
<p>A unit that meets its orders only by keeping people late has not solved anything. Overtime carries a higher rate under the law, it produces tired work and rising rejection in the last hour, and it hides a capacity that was never there. Use it for a season and a stated reason. If it is monthly, it is a capacity decision wearing a costume.</p>
<h2>Marginal points that decide a dispute</h2>
<ul>
<li><strong>Cash with no record.</strong> You cannot prove the wage cost to a lender, you cannot show it in your accounts, and in a disagreement about what was paid there is nothing but two memories.</li>
<li><strong>Seasonal work.</strong> Three months of festival tailoring is honest work. Say in writing that the engagement is for a stated period and a stated task, and end it on that date rather than letting it drift.</li>
<li><strong>Contract hands.</strong> People sent by somebody else but working on your premises are still counted in several obligations, and the owner who thinks the count starts at their own payroll counts wrong.</li>
<li><strong>Safety is yours.</strong> A guard on the belt, a first aid box, a fire extinguisher near the sealing machine and an explained shutdown procedure. An injury in a unit with no cover reaches the owner's own household money within a week.</li>
<li><strong>Women workers.</strong> Conditions attach to night work and to the facilities you provide. Ask what applies to your premises rather than assuming that a small unit is outside everything.</li>
<li><strong>The trained hand who leaves.</strong> You will not stop it by paying late or by holding wages. You reduce the damage by writing the method down, so the method lives in the unit rather than in one person's hands.</li>
</ul>`,
      Expert: `<p>Recall sheet for the first hire. Everything below is either a decision rule or a record whose absence costs you the argument.</p>
<h2>Which pay structure fits which work</h2>
<table>
<thead><tr><th>Work</th><th>Structure</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Filling and sealing identical packs</td><td>Piece rate on accepted packs</td><td>Countable unit, objective acceptance test</td></tr>
<tr><td>Cleaning grain of stones and grit</td><td>Time rate</td><td>Speed here destroys quality later</td></tr>
<tr><td>Stitching a standard blouse</td><td>Piece rate with a daily floor</td><td>Countable, but power cuts are not the worker's fault</td></tr>
<tr><td>Milking, feeding and shed cleaning</td><td>Time rate</td><td>Fixed daily task, output not attributable to one person</td></tr>
</tbody>
</table>
<h2>Records and what each one proves</h2>
<table>
<thead><tr><th>Record</th><th>Proves</th></tr></thead>
<tbody>
<tr><td>Muster roll</td><td>Who worked, on which date, for how many hours</td></tr>
<tr><td>Wage register</td><td>What was earned, deducted and paid for each period</td></tr>
<tr><td>Bank transfer entry</td><td>That the payment left your account on the stated day</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Loaded cost equals wage plus food plus learning wastage plus your own lost production plus tools. Decide on the loaded cost, never on the wage.</li>
<li>Extra units required equals loaded cost divided by contribution per unit. If the order book cannot show them, do not hire.</li>
<li>Set a piece rate from a fair day, and pay it on accepted pieces defined before the work starts.</li>
<li>The notified minimum wage for a scheduled employment is a floor. Agreement between two willing people cannot go below it.</li>
<li>Thresholds count persons employed, not turnover, and they include people working on your floor through somebody else.</li>
<li>Cost family labour at the market rate even when no cash moves, or your margin is fiction.</li>
</ul>
<h2>Edge cases worth carrying</h2>
<ul>
<li>Profit sharing offered in place of a wage can create a partner. Pay a wage, or write a deed.</li>
<li>Overtime paid monthly is a capacity shortage, not a staffing arrangement.</li>
<li>An unrecorded, uncapped advance can turn employment into an obligation to work, which is a serious matter and not a loyalty scheme.</li>
<li>Statutory rates, thresholds and the notified minimum wage are revised. Verify the current position each year rather than reusing last year's number.</li>
</ul>
<h2>Before the first working day</h2>
<ol>
<li>Rate, pay day and the task, stated aloud and written down.</li>
<li>Acceptance standard for a finished piece, demonstrated once.</li>
<li>Muster roll and wage register opened, with the first entry made that day.</li>
<li>Machine guard, first aid box and the shutdown step explained and shown.</li>
<li>Bank account details taken, so the second month's payment leaves a record.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A millet unit pays a helper ₹10,000 a month and also provides tea and a meal at ₹600, carries ₹400 a month of material spoiled during learning, loses one hour a day of the owner's own production valued at ₹1,500, and spent on tools that work out to ₹200 a month. What figure should the hiring decision be made on?",
        options: ["₹10,000", "₹10,600", "₹12,700", "₹11,500"],
        answer: 2,
        explanation:
          "The loaded cost is the sum of every rupee the helper causes: 10,000 plus 600 plus 400 plus 1,500 plus 200, which is ₹12,700. The tempting answer is the ₹10,000 cash wage, because that is the only figure that leaves the cash box as a wage, but the meal, the spoilage and the owner's stopped production are just as real and they are what make the decision look affordable when it is not.",
        difficulty: "Medium",
        skill: "Loaded cost of a helper",
      },
      {
        n: 2,
        question:
          "That unit earns ₹22 of contribution on each 5 kg pack after grain, pouch, label and power. Roughly how many extra packs a month must it sell to cover the helper?",
        options: ["About 455 packs", "About 577 packs", "About 264 packs", "About 1,155 packs"],
        answer: 1,
        explanation:
          "Extra units equal loaded cost divided by contribution per unit, so ₹12,700 divided by ₹22 is about 577 packs a month, near 23 a working day. The 455 figure comes from dividing the ₹10,000 cash wage by ₹22, and it understates the requirement by a fifth, which is exactly how an owner ends up carrying a helper the order book was never able to feed.",
        difficulty: "Medium",
        skill: "Output needed to cover a helper",
      },
      {
        n: 3,
        question:
          "Which of these jobs in a small unit is best paid on a piece rate?",
        options: [
          "Cleaning grain of stones and grit before milling",
          "Filling and sealing identical 5 kg packs to a stated standard",
          "Minding the pulveriser while it runs",
          "Locking up, sweeping and closing the shed at the end of the day",
        ],
        answer: 1,
        explanation:
          "A piece rate needs a countable identical unit and an acceptance test that can be applied without argument, and filling and sealing packs has both. Cleaning grain looks countable by weight, which makes it the attractive answer, but paying by speed there rewards leaving stones in and the cost of that appears later as a rejected consignment rather than as a rejected piece.",
        difficulty: "Easy",
        skill: "Time rate and piece rate",
      },
      {
        n: 4,
        question:
          "A helper agrees in writing to work for less than the rate notified for that scheduled employment because she needs the work. What is the position?",
        options: [
          "Lawful, because both sides agreed freely and put it in writing",
          "Lawful for a trainee during the first six months of employment",
          "The notified rate is a floor, so the agreement does not make the lower rate acceptable",
          "Lawful as long as tea, a meal and transport are provided on top",
        ],
        answer: 2,
        explanation:
          "A minimum wage notified for a scheduled employment is a statutory floor, and consent does not create an exception, because the entire purpose of a floor is to remove the question from negotiation between unequal parties. The written agreement is the tempting answer since ordinary contracts do bind on agreement, but a term below a statutory minimum simply does not stand.",
        difficulty: "Medium",
        skill: "Minimum wage as a notified floor",
      },
      {
        n: 5,
        question:
          "A tailoring unit pays two helpers in cash every Saturday and keeps no attendance or wage record at all. What is the real consequence?",
        options: [
          "None, since the amounts are small and paid in full each week",
          "Only that the owner cannot claim the wage as a business expense",
          "There is no evidence of who worked or what was paid, in a dispute or in front of a lender",
          "The helpers become partners in the unit after one year of such payment",
        ],
        answer: 2,
        explanation:
          "A muster roll and a wage register exist to make the facts provable, so without them a disagreement about days worked or amounts paid comes down to two memories, and a banker reading the accounts sees no wage cost behind the output claimed. The expense point in the second option is true but incomplete, and treating it as the whole answer is why owners keep paying cash until the first dispute.",
        difficulty: "Easy",
        skill: "Muster roll and wage register",
      },
      {
        n: 6,
        question:
          "An owner with four people on the payroll and two more sent daily by a labour contractor wants to know when employer registration and social security obligations begin to apply.",
        options: [
          "When annual turnover crosses the threshold set for the trade",
          "At a headcount threshold set by statute, counting persons working on the premises including those engaged through somebody else",
          "Only when the unit takes on its first permanent, non-seasonal worker",
          "At a headcount threshold that counts only the people whose names appear on the owner's own payroll",
        ],
        answer: 1,
        explanation:
          "These obligations attach to persons employed rather than to money earned, and the count is of people working on the premises, so persons engaged through a contractor are not invisible to it. The last option is the common and expensive mistake: an owner who counts only their own payroll can sit above the threshold for a year while believing they are below it, and the thresholds and contribution rates are revised, so the current position is verified rather than assumed.",
        difficulty: "Hard",
        skill: "Headcount thresholds for employer registration",
      },
    ],
  },
  31619: {
    topicId: 31619,
    title: "Risk: weather, breakdown and what insurance covers",
    summary:
      "A small unit is not brought down by the risk it worried about, it is brought down by the one it never ranked, so you list what can stop production, score each one by how likely it is and how hard it lands, and choose deliberately between avoiding it, reducing it, transferring it to an insurer and carrying it yourself. You then learn what a policy actually pays for, why a sum insured set too low reduces even a small claim, and the records without which a genuine loss is refused.",
    concepts: [
      "Likelihood and impact ranking",
      "Avoid, reduce, transfer, retain",
      "Single point of failure",
      "Downtime cost",
      "Sum insured and underinsurance",
      "Exclusions and the excess",
    ],
    glossary: {
      "Sum insured":
        "The ceiling the insurer will pay for an item under a policy, chosen by you when the policy is taken. A figure set low to keep the premium down caps the claim regardless of what the loss actually was.",
      Underinsurance:
        "The position where the sum insured is less than the value at risk. Where the policy carries an average condition, even a partial claim is then scaled down in the same proportion, so a unit insured for half its stock recovers about half of a small loss too.",
      Excess:
        "The first slice of every claim that you carry yourself, fixed in the policy schedule. It is why small losses are effectively uninsured, and why an owner who accepts a larger excess pays less to be covered for the losses that matter.",
      Exclusion:
        "A cause of loss the policy names as not covered. Reading the exclusions tells you what a policy is faster than reading the list of what it covers, because the boundary is where every dispute happens.",
      Indemnity:
        "The principle that a settlement restores what was lost and does not leave you better off. Under it a machine four years old is settled at what a four year old machine is worth, unless the policy was specifically written on a reinstatement basis.",
      Downtime:
        "The hours a unit cannot produce because something has failed. It is valued at the contribution those hours would have earned, which is almost always larger than the repair bill that caused it.",
    },
    body: {
      Beginner: `<p>Ask an owner what could go wrong and you get the answer that frightens them most. Ask what has actually gone wrong in the last two years and you get a different list, usually shorter, duller and more expensive. Start from the second list.</p>
<h2>What actually stops a village unit</h2>
<ul>
<li>Rain at the wrong time on grain, chillies or clothes left out to dry.</li>
<li>No power for two days, or a burnt motor, so the machine stands still while orders wait.</li>
<li>Fire, or theft from a shed with one shutter.</li>
<li>Illness. In a one person unit, the owner falling ill for three weeks is a total shutdown.</li>
<li>A buyer who takes the goods and does not pay, which is dealt with separately as a credit question.</li>
</ul>
<h2>Four things you can do about any risk</h2>
<ol>
<li><strong>Avoid it.</strong> Stop doing the thing. A drying method that cannot survive an unseasonal shower is replaced, not defended.</li>
<li><strong>Reduce it.</strong> Make it less likely or less damaging. A raised platform, a tarpaulin, a spare belt in the drawer, a bolt on the shutter.</li>
<li><strong>Transfer it.</strong> Pay somebody else to carry the loss, which is what insurance is.</li>
<li><strong>Carry it.</strong> Decide to bear it yourself and keep money aside for the day it happens.</li>
</ol>
<p>Every risk gets one of these four, chosen on purpose. A risk nobody chose for is being carried anyway, without the money set aside.</p>
<h2>What insurance is, and what it is not</h2>
<p>Insurance does not stop the loss. The shed still burns. What it does is pay money afterwards, for the causes named in the policy and no others. So the policy paper matters more than the salesperson's summary. Three sentences decide everything: what is covered, what is excluded, and how much the company will pay at most.</p>
<p>Covers that reach a small rural unit include fire and the perils listed with it on the building, the machines and the stock, theft, breakdown of a machine, goods damaged while being carried, cover on milch animals for a dairy, and personal accident and health cover for the family. Rates and terms differ between insurers and are revised, so compare the paper rather than the premium alone.</p>
<h2>The part owners forget</h2>
<p>A claim is paid on evidence. Photographs taken before anything is cleared, the police complaint for a theft, your purchase bills, and a stock register that shows what was lying in the shed that morning. A dairy animal is identified by its ear tag, and an animal without its tag is an animal the insurer cannot identify. Keep the tag on, and tell the company quickly, on the same day where you can. A late intimation is the most ordinary reason a genuine claim is refused.</p>`,
      Intermediate: `<p>Risk work in a micro-enterprise is not a mood, it is a list with two columns and a decision against each row. Do it once a year on one sheet of paper.</p>
<h2>Rank before you spend</h2>
<p>Score each risk on how likely it is in a year and on what it would cost if it happened, then read the two together. A millet processing unit in Vikarabad produced this sheet.</p>
<table>
<thead><tr><th>What could go wrong</th><th>Likelihood</th><th>If it happens</th><th>Chosen response</th></tr></thead>
<tbody>
<tr><td>Pulveriser motor fails</td><td>Likely</td><td>Six working days lost</td><td>Reduce, then transfer</td></tr>
<tr><td>Unseasonal rain on grain spread to dry</td><td>Likely</td><td>Part of one lot spoiled</td><td>Avoid by changing the method</td></tr>
<tr><td>Fire in the shed</td><td>Unlikely</td><td>Stock, machines and the year</td><td>Transfer</td></tr>
<tr><td>Theft of packed stock</td><td>Possible</td><td>One dispatch</td><td>Reduce, then transfer</td></tr>
<tr><td>Owner ill for a month</td><td>Possible</td><td>Complete shutdown</td><td>Reduce by training a second hand</td></tr>
<tr><td>Pouch supplier delivers late</td><td>Likely</td><td>Two days of packing</td><td>Retain, hold buffer stock</td></tr>
</tbody>
</table>
<h2>Cost the downtime, not the repair</h2>
<p>The motor on that pulveriser burnt out and the unit stood still for six working days. The mechanic's bill was ₹4,500, which is the number the owner remembers. The real cost is elsewhere. The unit fills 120 packs a day at ₹22 of contribution each, so each idle day costs ₹2,640 of contribution, and six days cost ₹15,840. Add the repair and the loss is ₹20,340, four and a half times the bill.</p>
<p>Once the loss is written that way the answer becomes obvious. A spare motor and a spare belt held in the unit cost far less than one such episode, and they convert a six day stoppage into a one day stoppage. That is risk reduction, and no insurer sells it to you.</p>
<h2>What each cover actually does</h2>
<table>
<thead><tr><th>Cover</th><th>Pays for</th><th>Does not reach</th></tr></thead>
<tbody>
<tr><td>Fire and allied perils</td><td>Building, machinery and stock damaged by the perils named in the schedule</td><td>A machine that failed internally with no fire</td></tr>
<tr><td>Burglary</td><td>Stock and property taken by forcible entry</td><td>Goods that went missing with no sign of entry</td></tr>
<tr><td>Machinery breakdown</td><td>Internal failure of the machine itself, such as a burnt winding</td><td>The days of production you lost while it was away</td></tr>
<tr><td>Business interruption</td><td>Income lost during the interruption, following the perils of the material damage policy</td><td>Anything the underlying policy did not cover</td></tr>
<tr><td>Transit</td><td>Goods damaged or lost while being carried</td><td>Bad packing, which is an exclusion in most forms</td></tr>
<tr><td>Cattle</td><td>Death of an identified insured animal from the causes named</td><td>An animal whose ear tag is missing</td></tr>
<tr><td>Personal accident and health</td><td>The owner's own body, which is the unit's real machine</td><td>The unit's fixed costs while the owner recovers</td></tr>
</tbody>
</table>
<h2>Setting the sum insured</h2>
<p>Stock in a seasonal unit is not one number. It is small in the lean months and largest just after procurement, and the loss will not politely wait for the lean month. Set the sum insured against the value at risk at its peak.</p>
<p>Suppose peak stock is ₹4,00,000 and the owner insures ₹2,00,000 to keep the premium down. A fire destroys ₹1,00,000 of stock, comfortably below the sum insured, so the owner expects the full amount. Where the policy carries an average condition, the settlement is scaled by the ratio of what was insured to what was at risk, that is one half, so about ₹50,000 is payable, and the excess comes off that. Underinsurance does not merely cap the large claim. It shrinks every claim.</p>
<h2>The day it happens</h2>
<ol>
<li>Tell the insurer the same day, by the number on the policy, and note whom you spoke to.</li>
<li>Photograph everything before clearing anything, and do not repair before the surveyor has seen it unless safety demands it.</li>
<li>File a police complaint for theft, and take a copy.</li>
<li>Produce the stock register, purchase bills and the sales record. A claim is settled on documents, and the register you kept in module four is what turns a statement into a claim.</li>
</ol>`,
      Advanced: `<p>Most refused claims in small enterprise are not fraud and not sharp practice by the insurer. They are an owner discovering, on the worst day, the shape of the cover they actually bought. Six shapes, all of them common.</p>
<h2>The building is insured and the stock is not</h2>
<p>A unit insures the shed because the shed is the visible asset. On any ordinary day the shed is worth less than what is lying inside it after procurement. Value the three separately, building, plant and machinery, and stock, and set a sum insured against each. Then look at where your money genuinely sits before deciding which figure to argue about.</p>
<h2>The sum insured that stopped growing</h2>
<p>The policy was taken in the first year, when stock was small and one machine stood in the corner, and it has been renewed at the same figures ever since while turnover tripled. Underinsurance builds silently through exactly this route. Review the three sums insured at every renewal against your own closing stock figures and the machines you have since bought, and increase them deliberately rather than accepting the renewal notice as it arrives.</p>
<h2>Assuming a peril is included</h2>
<p>Perils are named. Which of them stand in your schedule, and which are options you were offered, is a question to ask specifically before the season rather than after the water has come in. Two related points. An add-on declined at inception is not available after the event. And a cover taken while a loss is already developing, such as a policy bought as a cyclone approaches, will meet a waiting condition.</p>
<h2>Confusing the machine with the months without it</h2>
<p>Machinery breakdown cover replaces a burnt winding. It does not pay for the six weeks in which you supplied nobody, lost the shop shelf to a competitor and still paid the wage, the rent and the loan instalment. That is what business interruption cover exists for, it is written alongside a material damage policy and follows its perils, and it is the cover small units most often skip and most often needed. Where the premium cannot be found, the substitute is not hope. It is a repair fund and a second source of the same operation, a neighbouring unit that will job work for you at a known rate while your machine is away.</p>
<h2>Conditions inside your own policy</h2>
<p>A policy is a contract with obligations on both sides. Typical ones include maintaining the fire fighting arrangement described in the proposal, keeping the electrical installation in order, not leaving the premises unoccupied beyond a stated period, and telling the insurer about a material change such as a new machine, a change of use or an increase in the hazard. Breach one of these and a valid loss can still be resisted. Read the conditions once, in daylight, at the time of taking the policy.</p>
<h2>Settlement basis, and what depreciation does to it</h2>
<p>Under plain indemnity a four year old machine is settled at the value of a four year old machine, and that money will not buy the new one you now have to buy. A reinstatement basis, where it is available and taken, settles at the cost of replacing with new subject to the policy terms. This is a choice made when the policy is written, not a request made when the machine is on the floor.</p>
<h2>Marginal points worth carrying</h2>
<ul>
<li><strong>Under-declaring to save premium.</strong> It reduces the premium in proportion and reduces the claim in the same proportion. Nothing is saved, the timing is merely moved.</li>
<li><strong>An excess set high for a cheap premium.</strong> Sound, provided you have the money to carry the small losses. It is a decision to retain, and it should be paired with a repair fund.</li>
<li><strong>Insuring the affordable and skipping the ruinous.</strong> Cover what would end the enterprise first. A frequent small loss is a cost of business and is budgeted, not insured.</li>
<li><strong>The one person unit.</strong> The single point of failure is the owner. A health cover, a personal accident cover and a second person who knows the method are the whole answer to it.</li>
<li><strong>Cattle without a tag.</strong> The tag is the animal's identity in the contract. A lost tag is reported and replaced immediately, not at renewal.</li>
<li><strong>Delayed intimation.</strong> The surveyor reconstructs the loss from a site that has already been cleared, and everything after that is argument. Same day intimation, photographs before clearing.</li>
</ul>`,
      Expert: `<p>Recall sheet for risk and cover. Work the first table once a year and keep the second beside the policy file.</p>
<h2>Response by the shape of the risk</h2>
<table>
<thead><tr><th>Shape</th><th>Response</th><th>Instrument</th></tr></thead>
<tbody>
<tr><td>Frequent, small</td><td>Retain</td><td>A repair fund, budgeted as a cost</td></tr>
<tr><td>Frequent, large</td><td>Avoid or redesign</td><td>Change the method, not the policy</td></tr>
<tr><td>Rare, small</td><td>Retain</td><td>Ignore deliberately, not by oversight</td></tr>
<tr><td>Rare, ruinous</td><td>Transfer</td><td>Insurance, with the sum insured set at the value at risk</td></tr>
<tr><td>Concentrated in one machine or one person</td><td>Reduce</td><td>Spare, standby, second trained hand, job work arrangement</td></tr>
</tbody>
</table>
<h2>Cover boundaries in one line each</h2>
<table>
<thead><tr><th>Cover</th><th>Boundary</th></tr></thead>
<tbody>
<tr><td>Fire and allied perils</td><td>Only the perils named in your schedule, and only up to the sum insured</td></tr>
<tr><td>Burglary</td><td>Forcible entry, evidenced, with a police complaint</td></tr>
<tr><td>Machinery breakdown</td><td>The machine itself, never the lost production</td></tr>
<tr><td>Business interruption</td><td>Follows the perils of the material damage policy it sits on</td></tr>
<tr><td>Cattle</td><td>Identified animal, tag intact, cause named in the policy</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Downtime cost equals idle days multiplied by daily contribution, plus the repair. Decide on that total, not on the bill.</li>
<li>Set the sum insured against the peak value at risk, and revise all three sums at every renewal.</li>
<li>Where an average condition applies, half insured means about half paid on a small claim too.</li>
<li>The excess is the part you chose to retain. Hold cash against it.</li>
<li>Read the exclusions and the conditions first. They define the policy faster than the covering clause does.</li>
<li>Insurance transfers money after the event. It never transfers time, customers or a shelf in a shop.</li>
</ul>
<h2>The first hour after a loss</h2>
<ol>
<li>Make people safe, then stop the loss spreading. Nothing else comes before this.</li>
<li>Photograph and take a short video before anything is moved or cleared.</li>
<li>Intimate the insurer on the policy number the same day, and record the name and the reference given.</li>
<li>File a police complaint for theft, fire or a road incident, and take a copy.</li>
<li>Assemble the stock register, purchase bills, sales record and the machine's purchase invoice for the surveyor.</li>
<li>Do not repair or dispose of damaged property before the survey unless safety requires it, and photograph what you had to move.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A millet unit loses six working days when its pulveriser motor burns out. It fills 120 packs a day at ₹22 of contribution each, and the mechanic's bill is ₹4,500. What did the breakdown cost the enterprise?",
        options: ["₹4,500", "₹15,840", "₹20,340", "₹2,640"],
        answer: 2,
        explanation:
          "Six idle days at 120 packs and ₹22 of contribution is ₹15,840 of contribution never earned, and the ₹4,500 repair sits on top, giving ₹20,340. The tempting answer is the ₹4,500 bill because it is the only money that visibly left the cash box, and an owner who costs breakdowns that way will never justify the spare motor that would have saved five of the six days.",
        difficulty: "Medium",
        skill: "Downtime cost",
      },
      {
        n: 2,
        question:
          "Stock at a food unit peaks at ₹4,00,000 but the owner insures ₹2,00,000 to keep the premium low. A fire destroys ₹1,00,000 of stock and the policy carries an average condition. What is broadly payable before the excess?",
        options: ["₹1,00,000, since the loss is below the sum insured", "About ₹50,000", "₹2,00,000", "Nothing, because the stock was underinsured"],
        answer: 1,
        explanation:
          "An average condition scales a claim by the ratio of the sum insured to the value at risk, here one half, so a ₹1,00,000 loss settles at about ₹50,000 and the excess is then deducted. The first option is the natural expectation, that a loss smaller than the sum insured is paid in full, and it is precisely the assumption underinsurance defeats: the shortfall bites on small claims, not only on total ones.",
        difficulty: "Hard",
        skill: "Sum insured and underinsurance",
      },
      {
        n: 3,
        question:
          "The motor of a packing machine burns out from an internal winding failure. The unit holds a fire and allied perils policy on building, plant and stock. What is the position?",
        options: [
          "Covered, because the motor burnt and burning is fire",
          "Covered, because plant and machinery are named in the policy",
          "Not covered by that policy, since an internal failure with no fire needs machinery breakdown cover",
          "Covered, but only for the production lost while the machine was away",
        ],
        answer: 2,
        explanation:
          "A fire policy answers to the perils named in it, and an internal electrical failure inside a machine is not one of them, which is why machinery breakdown is sold as a separate cover. The attractive wrong answer is that the machine is listed in the policy, but a policy lists the property it covers and separately lists the causes it covers, and a claim needs both.",
        difficulty: "Medium",
        skill: "Exclusions and the excess",
      },
      {
        n: 4,
        question:
          "Every kilogram a millet unit sells passes through one pulveriser. Which action deals with that exposure most directly?",
        options: [
          "Raise the sum insured on the machine at the next renewal",
          "Hold a spare motor and belt, and agree terms with a nearby unit that will job work while yours is repaired",
          "Buy a larger pulveriser of the same type",
          "Run the machine for longer hours to build finished stock ahead of demand",
        ],
        answer: 1,
        explanation:
          "The exposure here is time rather than money, so the answer is a standby and an alternative route to output, which turns a six day stoppage into a one day stoppage. Raising the sum insured is the tempting answer because it feels like taking the risk seriously, but insurance pays for the machine and never returns the days, the orders or the shop shelf lost while it was silent.",
        difficulty: "Medium",
        skill: "Single point of failure",
      },
      {
        n: 5,
        question:
          "Which of these four steps by a dairy owner is a transfer of risk rather than a reduction or a retention?",
        options: [
          "Raising the milk room floor above the level the yard floods to",
          "Taking a policy on the milch animals with the tags in place",
          "Keeping ₹25,000 aside in a separate account for veterinary emergencies",
          "Refusing further supply to a buyer who has never paid on time",
        ],
        answer: 1,
        explanation:
          "Transfer means somebody else carries the financial loss for a price, and the policy is the only option here that does that. Setting ₹25,000 aside is the attractive answer because it feels like being insured, but money you have put by is money you will still lose: that is retention, done properly, and it is a different decision from transfer.",
        difficulty: "Easy",
        skill: "Avoid, reduce, transfer, retain",
      },
      {
        n: 6,
        question:
          "A tailoring unit lists four risks. The label printer jams about once a month, costing an hour. Pouch supplies arrive late a few times a year, costing a day. A shed fire is unlikely but would take the machines, the stock and the year. The owner falling ill is possible and would stop the unit for a month. Which risk gets the first rupee of attention?",
        options: [
          "The printer, because it is the most frequent and can be fixed permanently",
          "The late pouch supplies, because a supplier problem is the easiest to correct",
          "The shed fire, because ranking multiplies likelihood by impact and only this one can end the enterprise",
          "None of them yet, since three of the four are unlikely in any given year",
        ],
        answer: 2,
        explanation:
          "Ranking reads likelihood and impact together, and a rare event that ends the enterprise outranks frequent nuisances that cost an hour, because the unit survives the nuisance every time and does not survive the fire once. The printer is the tempting answer since it is the irritation the owner meets most often, but frequent small losses are budgeted as a cost of business, not defended against first.",
        difficulty: "Hard",
        skill: "Likelihood and impact ranking",
      },
    ],
  },
  31620: {
    topicId: 31620,
    title: "Reinvesting profit and the second machine decision",
    summary:
      "The first surplus is the point at which a unit either compounds or quietly stalls, and the mistake is almost never generosity with the household, it is buying capacity the enterprise was not yet using. You learn to find where the profit is actually sitting, measure how full the existing machine is, locate the step that fixes output, and test any addition on incremental contribution, payback and the working capital the new capacity will lock up.",
    concepts: [
      "Profit is not cash",
      "Capacity utilisation",
      "The bottleneck decides output",
      "Incremental contribution",
      "Payback period",
      "Second shift before second machine",
    ],
    glossary: {
      "Retained profit":
        "Profit left inside the business after the owner has drawn a living from it. It is the only growth money that carries no interest, no instalment and no lender's conditions, which is why it is spent more carefully than borrowed money, not less.",
      "Capacity utilisation":
        "Output actually produced in a period as a share of what the existing machine could have produced in the same period, on the hours you can staff and power. Measured over a quarter, never over the best week.",
      Bottleneck:
        "The one step whose capacity fixes the output of the whole line. Money spent on any other step changes nothing until the bottleneck itself moves, at which point the constraint reappears somewhere else.",
      "Incremental contribution":
        "The revenue from the additional units minus only the costs that change because of them. It is the money an addition actually brings in, and it is always smaller than the extra sales figure that persuaded you.",
      "Payback period":
        "The number of months an addition takes to return its own cost out of the incremental contribution it produces. Compute it on the full outlay, including the working capital the new capacity locks up.",
      "Sunk cost":
        "Money already spent that no future decision can recover. It is left out of the comparison between the options in front of you, however painful that is, because the only question is what happens from today.",
    },
    body: {
      Beginner: `<p>One day the books show a profit. It is a real moment and it deserves a clear head, because what you do with the first surplus decides whether the unit grows or simply gets busier.</p>
<h2>The profit is not lying in the box</h2>
<p>Your book may show ₹48,000 earned over six months while the cash drawer holds ₹10,000. Nothing has been stolen. The rest of it is standing in the shed as grain and pouches you bought, and sitting with the two shops that took stock and have not yet paid. Profit is a number the books work out. Cash is what you can actually spend. Never commit money on the strength of the first one.</p>
<h2>Three claims on any surplus, in order</h2>
<ol>
<li><strong>Your own living.</strong> Take a regular, stated amount every month. An owner who takes nothing eventually takes irregular handfuls, and the books stop meaning anything.</li>
<li><strong>A buffer.</strong> Money kept aside for a repair, a slow month or a delayed payment. Roughly one month of your fixed costs is a sensible first target.</li>
<li><strong>Growth.</strong> Whatever is left, and only what is left.</li>
</ol>
<h2>Before buying a second machine, ask three questions</h2>
<p>A tailor in Khammam had ₹28,000 saved and wanted a second machine. Three questions changed the decision.</p>
<ul>
<li><strong>Is the machine you have actually full?</strong> Hers ran about five hours of the eight she could work. A second machine adds hours you were not using anyway.</li>
<li><strong>Which step is holding you back?</strong> For her it was cutting, done by hand before any stitching started. The stitching machine was never the limit.</li>
<li><strong>Can you sell what it would make?</strong> Extra output that nobody has ordered is not income, it is stock, and stock is your money lying still.</li>
</ul>
<h2>Cheaper answers that come first</h2>
<p>Before capital, look at the free capacity you already own. A second person on the machine you have for the afternoon hours. A better layout so material does not travel across the room. A cutting table at the right height. One shop tie-up more. These cost little, work within weeks, and they also tell you whether demand is really there before you spend on a machine.</p>
<h2>The rule to carry</h2>
<p>Buy capacity when the machine you own is genuinely full, the step you are buying is the one holding output back, and the extra units are already asked for. If any one of the three is missing, keep the money.</p>`,
      Intermediate: `<p>The second machine decision is worked in five steps, in order. Skipping a step does not save time, it moves the loss to a later month.</p>
<h2>Step 1: find where the profit is sitting</h2>
<p>A millet processing unit in Vikarabad closed a half year with ₹48,000 of profit. Over the same six months its stock of grain, pouches and labels rose by ₹22,000 and the amount owed by two shops rose by ₹16,000. So ₹38,000 of that profit is already committed to stock and to receivables, and about ₹10,000 arrived as cash. Any plan built on ₹48,000 is planning with money the unit is not holding.</p>
<h2>Step 2: measure utilisation over a quarter</h2>
<p>The pulveriser ran for 5 hours on an average working day out of the 8 the unit can staff and power, that is just under two thirds. Measure this over three months and not over the week the festival order came in, because a peak week will justify anything. At two thirds utilisation there is a third of a machine sitting free, and buying a second one buys hours you already own.</p>
<h2>Step 3: name the bottleneck</h2>
<p>Output is set by the slowest step, not by the largest machine. In this unit the day looks like this: cleaning and grading 90 minutes, milling 5 hours, filling and sealing 4 hours, labelling and loading 1 hour. Milling is the longest step and it is also the one that cannot start until cleaning finishes. Add a sealing machine and nothing changes, because sealing was never the constraint. Move the constraint and it reappears at the next step, so ask what the bottleneck will be after the purchase, not only what it is today.</p>
<h2>Step 4: try the second shift first</h2>
<p>Suppose the unit wants 40 more packs a day. A second operator on the machine already standing there, working the free hours, produces those packs for the loaded cost of a helper and a little more power. No capital is spent, the decision is reversible within a month, and the market gets tested at low cost. A machine is bought only when the existing one is running the hours you can actually staff and still cannot meet the orders.</p>
<h2>Step 5: incremental contribution, then payback</h2>
<p>Now cost the machine properly. A second pulveriser is ₹1,60,000 and would add 40 packs a day over 25 working days, that is 1,000 packs a month.</p>
<table>
<thead><tr><th>Line</th><th>Per month</th></tr></thead>
<tbody>
<tr><td>Additional packs, 1,000 at ₹22 contribution</td><td>₹22,000</td></tr>
<tr><td>Less additional power</td><td>₹1,500</td></tr>
<tr><td>Less the loaded cost of the operator</td><td>₹12,700</td></tr>
<tr><td><strong>Incremental contribution</strong></td><td><strong>₹7,800</strong></td></tr>
</tbody>
</table>
<p>On the machine price alone the payback is ₹1,60,000 divided by ₹7,800, about 20 months. That figure is wrong, because capacity consumes working capital as well as capital. Those 1,000 extra packs need grain and pouches every month, roughly ₹78,000 of variable cost, and the unit's operating cycle runs about 45 days, so about ₹1,17,000 stays locked in the cycle from the day the machine starts. The true outlay is ₹2,77,000 and the payback is nearer 35 months.</p>
<h2>Then the two tests that override the arithmetic</h2>
<ul>
<li><strong>Demand.</strong> Are 1,000 packs a month already asked for by named buyers, or are they a hope. Machines do not sell.</li>
<li><strong>Repayment.</strong> If any part is borrowed, the instalment must sit comfortably inside the ₹7,800, and the household drawings must not already be spending it.</li>
</ul>
<p>Fund from retained profit first, then from a term loan for the machine, and keep working capital funded by a working capital facility rather than by a term loan. Matching the tenure of the money to the life of the thing it buys is the whole discipline.</p>`,
      Advanced: `<p>An owner who has reached a surplus has already done the hard part. What follows is a list of the ways that surplus is commonly converted into a slower, more fragile enterprise.</p>
<h2>Buying on a peak</h2>
<p>Two months of festival orders make the machine look permanently short. Capacity bought on a seasonal peak stands idle for the other ten months while its instalment does not. Take utilisation across a full cycle of your trade, and where the peak is genuinely large, meet it by hiring capacity for the season, job working with a neighbouring unit or extending hours, all of which end when the season does.</p>
<h2>Payback computed on the wrong number</h2>
<p>The common error is dividing the machine price by the additional sales rather than by the additional contribution. A machine adding ₹1,00,000 of monthly sales at a 22 percent contribution is returning ₹22,000, not ₹1,00,000, and the gap turns a plausible eight month payback into something close to three years. The second error is leaving out the working capital the capacity locks up, which for a unit with a long cycle can exceed the price of the machine itself.</p>
<h2>The instalment that was already spent</h2>
<p>Incremental contribution of ₹7,800 a month is not free money if the household has quietly grown into it. Fix the owner's drawings as a stated monthly figure before the loan is taken, and check that the instalment fits in what remains after those drawings, not in the profit line. A loan repaid by cutting the family's living is repaid for a few months and then defaults.</p>
<h2>Second hand, and the cost that is not in the price</h2>
<p>A used machine at a third of the price is often the right answer for a unit that is still learning its market. It is the wrong answer when nobody within a district can repair it, when spares come from one dealer, or when it consumes noticeably more power for the same output. Cheap capital with expensive downtime is a poor trade, and a machine with no local mechanic has made itself the unit's single point of failure.</p>
<h2>Sunk cost dressed as commitment</h2>
<p>The advance is paid, the shed extension is half built, the trainer has been booked. None of it is recoverable and therefore none of it belongs in today's decision, which is only ever a comparison of what happens from here under each option. Owners persist with a wrong machine because of what was already spent on it and lose a second year to protect the first.</p>
<h2>Assistance that decides the machine</h2>
<p>Where a scheme reduces the cost of an asset, the structure is worth understanding: the assistance lowers what you finally bear, it is usually released against an asset actually bought and verified, and the balance is still borrowed and still repaid on a schedule. A refinance route such as MUDRA reaches you as an ordinary loan from your own bank, in graded categories and usually against a Udyam registration, so it changes who bears the funding cost and never changes the fact that it is repaid. What none of this does is create a buyer for the extra output. The order stays the same. Demand, then bottleneck, then the cheapest way to relieve it, and only then the question of what assistance exists for that purchase. Terms and rates differ by scheme and are revised, so verify the current position before the decision rather than after.</p>
<h2>Reinvesting in the wrong asset entirely</h2>
<p>If your machine is two thirds idle, the constraint is not production, it is the market, and the correct reinvestment is in reaching it. A delivery round to four more villages, a second shop tie-up, better packaging that survives transport, a weighing and sealing improvement that stops rejections. These usually cost a fraction of a machine and they raise the utilisation of the machine you already own, which is the highest return available to a small unit.</p>
<h2>The order of claims, when there is a surplus</h2>
<ol>
<li>Clear the costliest borrowing first. A moneylender's rate compounds faster than any machine returns.</li>
<li>Fund the buffer, about a month of fixed costs, so the next breakdown does not become a fresh loan.</li>
<li>Set aside a replacement fund against the machine you already own, which is wearing whether or not you provide for it.</li>
<li>Then, and only then, capacity.</li>
</ol>`,
      Expert: `<p>Recall sheet for reinvestment. The first table is the diagnosis, the second is the arithmetic, and the checklist is what you complete before signing anything.</p>
<h2>Symptom to correct reinvestment</h2>
<table>
<thead><tr><th>What you observe</th><th>Where the money goes</th></tr></thead>
<tbody>
<tr><td>Machine idle for a third of the day, orders flat</td><td>Selling: a delivery round, another buyer, packaging</td></tr>
<tr><td>Machine full, orders being refused</td><td>Second shift on the existing machine first</td></tr>
<tr><td>Machine full on both shifts, orders still refused</td><td>A second machine, on a payback test</td></tr>
<tr><td>One step always waiting on the step before it</td><td>The bottleneck step only, not the visible one</td></tr>
<tr><td>Cash short while the books show profit</td><td>The cycle: collections, stock, supplier terms</td></tr>
</tbody>
</table>
<h2>The arithmetic in five lines</h2>
<table>
<thead><tr><th>Line</th><th>How it is computed</th></tr></thead>
<tbody>
<tr><td>Utilisation</td><td>Hours run divided by hours you can staff and power, over a quarter</td></tr>
<tr><td>Incremental contribution</td><td>Additional units multiplied by contribution per unit, less the costs that change</td></tr>
<tr><td>Working capital locked</td><td>Additional monthly variable cost multiplied by the operating cycle in months</td></tr>
<tr><td>True outlay</td><td>Asset cost plus installation plus working capital locked</td></tr>
<tr><td>Payback in months</td><td>True outlay divided by monthly incremental contribution</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Profit is a computation, cash is a balance. Commit only against cash, and check where the difference went before deciding anything.</li>
<li>Spending anywhere except the bottleneck buys nothing. After it moves, ask where the new one is.</li>
<li>A second shift is a reversible experiment. A second machine is not.</li>
<li>Divide by contribution, never by sales, or the payback will read three times better than it is.</li>
<li>Capacity locks working capital. Budget one operating cycle of the additional variable cost alongside the machine.</li>
<li>Sunk cost belongs to the past. Compare only what happens from today under each option.</li>
</ul>
<h2>Before you sign for a machine</h2>
<ol>
<li>Utilisation of the existing machine measured over three months, written down.</li>
<li>The bottleneck named, and the step after it named too.</li>
<li>Named buyers for the additional output, with the quantity each has asked for.</li>
<li>Incremental contribution per month, worked on contribution and not on sales.</li>
<li>Working capital locked by the new capacity, added to the outlay.</li>
<li>Payback in months on the true outlay, and the instalment tested against the incremental contribution after your stated drawings.</li>
<li>Repair, spares and a mechanic within reach confirmed for that make.</li>
</ol>`,
    },
  },
};

export default PART;
