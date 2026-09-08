/**
 * Course 311: Solar PV Installer & Rooftop Technician, part 1 of 3.
 *
 * Topics 31101 to 31107: solar basics and the site survey, then every component
 * a technician unboxes on a rooftop job.
 *
 * Written for a trainee who will be on a roof in Warangal or Nizamabad with a
 * spanner and a multimeter, not for a design office. The arithmetic is the
 * arithmetic that is actually done on site, worked with units. Safety is taught
 * as method inside each procedure, because a PV string is live whenever the sun
 * is on it and there is no switch anywhere that makes a module stop generating.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31101: {
    topicId: 31101,
    title: "How a rooftop system makes power and where it goes",
    summary:
      "Follow one unit of energy from the silicon wafer through the inverter to the house board and the DISCOM meter, so that every later calculation has a place to sit. You also learn the difference between kilowatt and kilowatt hour, which is the single distinction customers get wrong.",
    concepts: [
      "Photovoltaic effect",
      "Irradiance and peak sun hours",
      "Standard Test Conditions",
      "DC to AC conversion",
      "Self consumption and export",
      "Performance ratio",
    ],
    glossary: {
      "Photovoltaic effect":
        "The behaviour of a silicon junction that releases charge carriers when light lands on it, so a voltage appears across the cell without anything moving or burning.",
      Irradiance:
        "The power of sunlight arriving on one square metre of surface, measured in watts per square metre. Bright noon sun on a clear day in Telangana sits near 1000 W per square metre.",
      "Peak sun hours":
        "A day's total sunlight energy rewritten as the number of hours it would have taken at exactly 1000 W per square metre. A site with 5.2 kWh per square metre per day has 5.2 peak sun hours.",
      "Kilowatt peak":
        "The size label of an array, written kWp. It is the sum of the module nameplate ratings, so it states what the array would make under laboratory light, not what it makes on your roof.",
      Inverter:
        "The box that converts the array's direct current into mains frequency alternating current, holds the array at its best operating voltage, and disconnects itself if the grid goes away.",
      "Performance ratio":
        "Measured output divided by the output the array should have made from the sunlight that actually fell on it. It bundles heat, dust, cable loss and inverter loss into one number between 0 and 1.",
    },
    body: {
      Beginner: `<p>A solar module does one job. It turns light into electricity, with no fuel, no moving part and no sound. Sunlight landing on a thin wafer of silicon inside the module knocks charge loose, and the fine metal lines printed across the wafer collect it as a current. That behaviour is called the <strong>photovoltaic effect</strong>, and every rooftop plant you will ever install rests on it.</p>
<h2>The four parts on any rooftop</h2>
<p>Walk onto a site anywhere in the state and you will find the same four parts, in the same order.</p>
<ol>
<li>The <strong>modules</strong>, which customers call panels. They make direct current, or DC, the steady one way current a torch cell gives.</li>
<li>The <strong>DC cable and the DC isolator</strong>, which carry that current down the wall to wherever the inverter is fixed.</li>
<li>The <strong>inverter</strong>, which changes DC into alternating current, or AC, because fans, pumps, fridges and the house wiring all run on AC.</li>
<li>The <strong>house board and the meter</strong>, where solar power joins the same wires the supply already arrives on.</li>
</ol>
<h2>Where the power actually goes</h2>
<p>Electricity always flows to whatever is switched on nearest to it. So solar power feeds the house first. The pump, the fridge and the fans take what they need, and only the leftover goes out through the meter to the grid. In the evening the array makes nothing and the house draws from the grid as it always did. Nothing is stored in between unless a battery has been paid for, which is a later topic.</p>
<h2>Power and energy are different words</h2>
<p>A customer will ask you for five kilowatts. That is <strong>power</strong>, the rate at this instant, like the speed of a bike. What arrives on the bill is <strong>energy</strong>, in kilowatt hours or units, which is speed multiplied by time, like the distance the bike covered. A 5 kW array running at full output for one hour has produced 5 kWh, that is 5 units.</p>
<p>Sunlight is not full strength all day, so installers use a shortcut called <strong>peak sun hours</strong>. Most of Telangana gets roughly five peak sun hours a day averaged over the year. Multiply array size by peak sun hours, then take off about a fifth for heat, dust and losses in the wire, and you have a fair daily figure to quote.</p>
<h2>One safety point before anything else</h2>
<p>There is no switch on a module. If the sun is on the glass, the DC wiring behind it is live, even with the inverter off, the isolator open and the main switch of the house pulled down. You work on the DC side as though it is always energised, because it is.</p>`,
      Intermediate: `<p>Every calculation in this course sits somewhere on one path: sunlight, silicon, DC bus, inverter, house board, meter. Fix that path in your head first and the sizing topics stop feeling like separate formulas.</p>
<h2>From irradiance to array output</h2>
<p><strong>Irradiance</strong> is the power of sunlight per square metre, in W per square metre. A module is rated at <strong>Standard Test Conditions</strong>: 1000 W per square metre, cell temperature 25 degrees Celsius, air mass 1.5. Those conditions are a laboratory reference, not a description of a roof. On a clear April afternoon in Nalgonda the irradiance may well touch 1000, but the cells behind the glass will be at 55 to 65 degrees, and a hot cell makes less voltage.</p>
<p>Because irradiance changes all day, site work uses the day total instead. Divide the day's energy on a square metre by 1000 and you get <strong>peak sun hours</strong>. Most Telangana districts fall in the region of 5.0 to 5.5 peak sun hours a year round average on a tilted surface, lower in the monsoon months and higher in March and April.</p>
<h2>The estimate you will do at the customer's table</h2>
<p>Take a 5 kWp array on a house in Khammam.</p>
<ul>
<li>Array size: 5 kWp, that is ten modules of 500 W each.</li>
<li>Peak sun hours: 5.0 h per day for a round year figure.</li>
<li>Ideal energy: 5 kWp multiplied by 5.0 h, which is 25 kWh per day.</li>
<li>Performance ratio: 0.78 on a clean, unshaded, well ventilated roof.</li>
<li>Expected energy: 25 kWh multiplied by 0.78, which is 19.5 kWh per day, near 585 units a month.</li>
</ul>
<p>Quote the 19.5, never the 25. The gap between the two is the whole of this course: temperature, soiling, wiring resistance, inverter conversion, mismatch between modules and the hours the array spends below its best voltage.</p>
<h2>What the inverter is really doing</h2>
<p>Two jobs, and only one of them is in its name. The obvious one is conversion, DC to AC at 230 V single phase or 415 V three phase, at 50 Hz, synchronised to the grid waveform. The second job is <strong>maximum power point tracking</strong>. A string of modules has one operating voltage at which the product of volts and amps is largest, and that point moves with light and temperature all day. The inverter continuously hunts for it, which is why the DC voltage you measure at the terminals is not a fixed number.</p>
<p>An on grid inverter also has to stop feeding when the grid goes down, which is called anti islanding. Without it, a lineman working on a supposedly dead line could be back fed from a rooftop. The requirement is in the grid connectivity rules and it is checked at inspection.</p>
<h2>Self consumption, export and the meter</h2>
<p>Solar current always serves the nearest load first because that is the path of least impedance, not because anything decides it. Whatever the house does not use at that instant crosses the meter outward and is recorded as <strong>export</strong>. At night the same meter records import. Under net metering the DISCOM settles the difference over the billing period, so an installation is sized against the customer's annual units and their sanctioned load, not against their roof area.</p>
<p>That is why the next two topics are a roof survey and a bill reading, in that order. The roof decides what is possible, the bill decides what is worth installing.</p>`,
      Advanced: `<p>The trainee-level picture of a rooftop plant is a chain of conversions with a single efficiency number bolted on. The working picture is a chain of conversions whose losses are individually diagnosable, which matters because a customer who is short 15 percent on generation wants to know which one of them is at fault, and so does the warranty claim.</p>
<h2>Decompose the performance ratio before you defend it</h2>
<p>A reported performance ratio of 0.75 says nothing on its own. Break it down and each piece is a different site visit.</p>
<table>
<thead><tr><th>Loss</th><th>Typical share</th><th>What it looks like on site</th></tr></thead>
<tbody>
<tr><td>Cell temperature above 25 C</td><td>7 to 12 percent</td><td>Output dips in the afternoon while irradiance is still high, worse on a flush mounted array with no air gap</td></tr>
<tr><td>Soiling</td><td>2 to 8 percent</td><td>Rises through the dry months, collapses after the first monsoon shower, worst near a cement road or a rice mill</td></tr>
<tr><td>DC cable resistance</td><td>1 to 3 percent</td><td>Long runs from a far corner of a terrace, or a rushed job using undersized cable</td></tr>
<tr><td>Inverter conversion</td><td>2 to 3 percent</td><td>Constant, and the only one on the datasheet</td></tr>
<tr><td>Mismatch and tracking</td><td>2 to 4 percent</td><td>One module in partial shade, or two module batches mixed in a string</td></tr>
</tbody>
</table>
<h2>The kWp trap in every quotation</h2>
<p>kWp is a DC label built from nameplates measured at STC. The inverter is rated in kW AC. A customer told they have a 5 kW plant will look at an inverter display that peaks near 4.1 kW on the best day of the year and conclude they were cheated. Say the two numbers separately in the quotation, DC array size and AC inverter rating, and explain that an array reaching 82 percent of nameplate at noon is normal, not a defect. Half the complaint calls in the first month are this conversation happening too late.</p>
<h2>Where the money actually is</h2>
<p>Under a net metering arrangement the exported unit is usually worth less to the customer than the imported unit it offsets, and the settlement rules differ between DISCOMs and are revised from time to time. Never quote a buyback rate from memory or from another district's job. What you can say with confidence is the physics: a unit consumed while the array is generating is worth the full retail tariff it displaced, so shifting the pump, the washing machine and the water heater into daylight hours improves the customer's return without touching the hardware.</p>
<h2>What kills technicians on this path</h2>
<p>The AC side has switches and a habit of respect built by decades of wiring work. The DC side has neither. Three specific traps:</p>
<ul>
<li>An open circuit string of twenty modules sits above 800 V DC in cold morning sun. DC does not have a zero crossing, so an arc drawn at that voltage does not self extinguish the way a 230 V AC arc tends to.</li>
<li>Pulling an MC4 connector under load draws that arc across your hand. Open the DC isolator first, and if the isolator is the item you are replacing, cover the modules or work before sunrise.</li>
<li>A string measured as dead may only be dead because a cloud is over the roof. Re-test at the moment you touch it, not when you arrived.</li>
</ul>
<p>The habit that keeps you alive is short: assume live, isolate, verify at the point of work, then work.</p>`,
      Expert: `<p>Recall sheet for the energy path. Everything below is either a definition you will be asked for or a number you should be able to produce without a calculator.</p>
<h2>Quantities and units</h2>
<table>
<thead><tr><th>Quantity</th><th>Unit</th><th>Reference value</th></tr></thead>
<tbody>
<tr><td>Irradiance</td><td>W per square metre</td><td>1000 at STC, 800 at NOCT</td></tr>
<tr><td>Cell temperature at STC</td><td>degrees Celsius</td><td>25</td></tr>
<tr><td>Air mass at STC</td><td>none</td><td>1.5</td></tr>
<tr><td>Peak sun hours, Telangana</td><td>h per day</td><td>about 5, tilted plane, annual average</td></tr>
<tr><td>Performance ratio, good rooftop</td><td>none</td><td>0.75 to 0.80</td></tr>
<tr><td>Specific yield</td><td>kWh per kWp per year</td><td>1400 to 1550 on a clean unshaded roof</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Daily units equal kWp multiplied by peak sun hours multiplied by performance ratio. Everything else in the course is an argument about the third term.</li>
<li>kWp is DC and comes from nameplates. kW is AC and comes from the inverter. They are never the same number and the quotation must show both.</li>
<li>Power is instantaneous, energy is power multiplied by time. A unit is one kWh.</li>
<li>Anti islanding is not an optional feature. It is what stops your rooftop energising a line a crew is working on.</li>
<li>Modules have no off switch. Cover, or isolate and verify, but never assume.</li>
</ul>
<h2>Edge cases worth carrying</h2>
<ul>
<li>Peak generation on a south facing array is around solar noon, not clock noon. Indian Standard Time is set on 82.5 degrees east, so in Hyderabad solar noon falls roughly twelve minutes after 12:00 IST, and further west in Adilabad later still.</li>
<li>The highest DC voltage of the year occurs on a cold clear winter morning at first strong light, not in summer. Voltage rises as temperature falls, and that is the condition string sizing is checked against.</li>
<li>A brief passing cloud can push irradiance above 1000 by edge reflection, so an inverter briefly exceeding its rating on a partly cloudy day is not a fault.</li>
<li>A performance ratio above 0.85 on a rooftop plant usually means the reference irradiance is wrong, not that the plant is exceptional.</li>
</ul>
<h2>Handover checklist for this stage</h2>
<ol>
<li>State array kWp and inverter kW AC separately, in writing.</li>
<li>State expected daily and monthly units with the performance ratio you assumed.</li>
<li>Show the customer the DC isolator and the AC isolator and what each one does not do.</li>
<li>Record the meter reading on the day of commissioning, both import and export registers.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A 5 kWp rooftop array is installed in Khammam. Taking 5.0 peak sun hours and a performance ratio of 0.78, what daily generation should you quote?",
        options: ["25.0 kWh", "19.5 kWh", "5.0 kWh", "39.0 kWh"],
        answer: 1,
        explanation:
          "Daily units are size multiplied by peak sun hours multiplied by performance ratio: 5 x 5.0 x 0.78 = 19.5 kWh. The 25.0 kWh option is the ideal figure before losses, and quoting it is how installers create a complaint in month one, because heat, dust, cable resistance and inverter conversion are already known losses.",
        difficulty: "Easy",
        skill: "Performance ratio",
      },
      {
        n: 2,
        question:
          "Which set of conditions defines Standard Test Conditions for a PV module nameplate?",
        options: [
          "800 W per square metre, ambient 20 C, wind 1 m per second",
          "1000 W per square metre, cell temperature 25 C, air mass 1.5",
          "1000 W per square metre, ambient temperature 25 C, air mass 1.0",
          "1000 W per square metre, cell temperature 45 C, air mass 1.5",
        ],
        answer: 1,
        explanation:
          "STC is 1000 W per square metre, cell temperature 25 C and air mass 1.5. The 800 W option is NOCT, a separate and more field-like rating that some datasheets also print, so mixing the two is the usual error. Note also that STC fixes cell temperature, not ambient temperature.",
        difficulty: "Medium",
        skill: "Standard Test Conditions",
      },
      {
        n: 3,
        question:
          "The DC isolator is open, the inverter is switched off and the main house switch is down. It is 11 in the morning. What is the state of the module wiring on the roof?",
        options: [
          "Dead, because every switch in the system is open",
          "Dead, because the inverter is not drawing current",
          "Live at open circuit voltage, because a module generates whenever light falls on it",
          "Live only if a battery is connected to the system",
        ],
        answer: 2,
        explanation:
          "A module has no off switch, so with sunlight on the glass the string sits at open circuit voltage, which for a long string is several hundred volts DC. The tempting answer is that opening every switch makes the system dead, but a switch can only break the path downstream of it; it cannot stop the silicon generating.",
        difficulty: "Easy",
        skill: "Photovoltaic effect",
      },
      {
        n: 4,
        question:
          "A site record shows 5.2 kWh per square metre falling on the array plane in one day. How many peak sun hours is that?",
        options: ["5.2 h", "52 h", "0.52 h", "5200 h"],
        answer: 0,
        explanation:
          "Peak sun hours are the day total divided by 1000 W per square metre, so 5.2 kWh per square metre, which is 5200 Wh, divided by 1000 W gives 5.2 hours. The 52 h answer comes from dividing by 100 and is worth checking against common sense: no day contains 52 hours.",
        difficulty: "Medium",
        skill: "Irradiance and peak sun hours",
      },
      {
        n: 5,
        question:
          "Besides converting DC to AC, what is the inverter continuously doing during daylight?",
        options: [
          "Holding the array at a fixed voltage set during commissioning",
          "Charging an internal battery to ride through cloud cover",
          "Tracking the array's maximum power point as light and temperature change",
          "Regulating the DISCOM grid voltage at the point of connection",
        ],
        answer: 2,
        explanation:
          "The inverter runs maximum power point tracking, hunting for the voltage at which volts multiplied by amps is greatest, which moves all day with irradiance and cell temperature. A fixed commissioning voltage sounds plausible because installers do set limits, but a fixed operating point would give away energy on every change in light.",
        difficulty: "Medium",
        skill: "DC to AC conversion",
      },
      {
        n: 6,
        question:
          "A customer with net metering asks how to get more value from the same plant without adding hardware. What is the sound advice?",
        options: [
          "Run the pump and washing machine during daylight so more solar is self consumed",
          "Switch the inverter off at midday to protect it from heat",
          "Export as much as possible, since exported units earn more than imported units cost",
          "Increase the tilt angle every month to follow the sun",
        ],
        answer: 0,
        explanation:
          "A unit consumed while the array is generating displaces a unit at the full retail tariff, so shifting flexible loads into daylight is free return. Maximising export is the attractive wrong answer, because the export rate under net metering is generally not better than the retail tariff and it varies by DISCOM and revision, so it must never be assumed.",
        difficulty: "Hard",
        skill: "Self consumption and export",
      },
    ],
  },
  31102: {
    topicId: 31102,
    title: "Site survey: roof area, orientation and shading",
    summary:
      "A survey decides the size of the plant before any component is chosen, so you learn to measure usable area rather than roof area, to fix orientation and tilt on the ground, and to prove that a water tank or a neighbour's parapet will not shade the array in December. Everything you fail to record here becomes a change order later.",
    concepts: [
      "Usable roof area",
      "Azimuth and tilt",
      "Shadow length and obstructions",
      "Inter-row spacing",
      "Roof structure and access",
      "Cable route and inverter location",
    ],
    glossary: {
      Azimuth:
        "The compass direction the modules face, measured from true north. Due south is 180 degrees, and in the northern hemisphere it is the direction that collects the most energy over a year.",
      "Tilt angle":
        "The angle between the module face and the horizontal roof. It trades peak annual energy against wind load and against how well rain washes the glass.",
      "Inter-row spacing":
        "The gap left between one row of modules and the next so the front row does not shade the row behind it during the working part of a winter day.",
      "Shadow length":
        "How far a shadow reaches from the base of an obstruction. It equals the obstruction height divided by the tangent of the sun's altitude, so it is longest early and late in the day and in December.",
      "Usable area":
        "What is left of a roof after parapet setbacks, the water tank, the staircase head room, walkways, and any patch that will be shaded. It is always much less than the roof area a customer quotes.",
      Parapet:
        "The low wall around the edge of a flat terrace. It looks harmless and it is the most commonly missed shading object on Indian rooftops.",
    },
    body: {
      Beginner: `<p>The survey is the visit where you decide how big a plant the roof can carry. Everything after it, the number of modules, the size of the inverter, the length of the cable, the price you quote, comes from what you write down on this day. Carry a measuring tape of at least 15 m, a compass or a phone compass, a torch, a notepad and a camera.</p>
<h2>Measure usable area, not roof area</h2>
<p>An owner will say the terrace is 1000 square feet. Your job is to find what is left after you take away the staircase head room, the water tank and its shadow, the setback you must keep from the parapet for a walkway, and the space around the tank for the plumber to reach it. On most terraces the usable share is between half and two thirds of what was quoted to you.</p>
<p>A rough working figure to hold in your head: an elevated array on a flat terrace needs about 9 to 10 square metres of roof for every 1 kWp, once you have left room to walk between the rows. So a 3 kWp plant wants around 30 square metres, which is close to 320 square feet.</p>
<h2>Which way and how steeply</h2>
<p>Modules face <strong>south</strong> in India. Stand on the roof with the compass and find true south, then check that the customer is not asking you to face the array towards the road for looks. A tilt of about 15 to 20 degrees suits Telangana. Flatter than 10 degrees and rain will not wash the dust off the glass.</p>
<h2>Look for shadows, and look for them in winter</h2>
<p>Shadows are longest in December and in the first and last hours of useful sun. A rule you can use on the roof: at nine in the morning in late December, an object throws a shadow about one and three quarter times its own height. So a 2 m water tank shades roughly 3.5 m of terrace at that hour.</p>
<p>Note down every object taller than the array: tank, staircase room, parapet, TV antenna, neighbour's building, and any tree. Ask about the tree. A ten year old neem grows into the array long after you have been paid.</p>
<h2>Write it down on the roof</h2>
<p>Do not trust memory. Sketch the terrace with dimensions, mark north, mark every obstruction with its height, mark where the inverter will hang, and photograph the meter, the house board and the roof from four corners.</p>`,
      Intermediate: `<p>A survey is a measurement exercise with a fixed output: a dimensioned sketch, a shading verdict, a cable route, and a maximum system size that the roof and the structure can actually support. Treat it as data collection, not as a look around.</p>
<h2>Step one, the dimensioned sketch</h2>
<p>Measure the terrace along both axes and record the diagonal as a check. Mark the parapet height on each side. Then mark and dimension every fixed object: overhead tank, staircase head room, lift machine room, dish antenna, vent pipes, solar water heater, and any structure the neighbour has that overlooks the roof. Put north on the sketch with the compass. Magnetic declination across Telangana is small, under a degree, so a phone compass is good enough for orientation, although you should still take the reading away from the metal railing.</p>
<h2>Step two, orientation and tilt</h2>
<p>The reference case is an array facing due south at a tilt near the site latitude, which is around 17 to 18 degrees for most of the state. Two adjustments are normal in practice:</p>
<ul>
<li>Turning the array up to 15 degrees east or west of south costs very little annual energy, usually under 2 percent, and is often the difference between a clean rectangular layout and a broken one.</li>
<li>Tilt is dropped towards 10 to 12 degrees on very exposed sites to reduce wind load, and never below 10 degrees because the glass then holds dust through the dry season.</li>
</ul>
<h2>Step three, the shading survey</h2>
<p>Shading is checked at the worst case, which is the winter solstice around 21 December, over the working window of 9 am to 3 pm. Use the shadow length relation: length equals obstruction height divided by the tangent of the solar altitude.</p>
<ul>
<li>At solar noon in late December in Telangana the sun is roughly 49 degrees above the horizon, so an obstruction throws a shadow of about 0.87 times its height.</li>
<li>At 9 am and again at 3 pm the altitude is nearer 30 degrees, so the shadow stretches to about 1.7 times the height, and it lies to the west of the object in the morning and to the east in the afternoon.</li>
</ul>
<p>Worked case. A 2.5 m overhead tank stands on the south edge of a terrace. Its December shadow at 9 am reaches about 4.3 m to the north west. Any module inside that arc is inside a hard shadow for part of every winter morning, so the layout must start beyond it, or that part of the roof is given up.</p>
<h2>Step four, inter-row spacing</h2>
<p>Rows shade each other by the same rule, using the vertical rise of the row rather than a tank height. A 2.28 m module in portrait at 15 degrees rises 2.28 multiplied by sin 15, which is 0.59 m. At the 9 am December altitude the north south shadow from that rise works out at roughly 0.75 m, so a pitch of about 2.95 m between row fronts, giving a walkway sized gap of around 0.75 m between rows. That gap is not wasted space, it is the reason the array still makes its number in January.</p>
<h2>Step five, the parts nobody photographs</h2>
<p>Record the cable route from the array to the inverter and from the inverter to the meter, in metres, because those lengths decide cable size in a later topic. Record where the inverter can hang: shaded, ventilated, at eye level, not above a bed or a gas cylinder. Record where an earth pit can be dug and how far it is from the array. Record how the modules will get to the roof, since a narrow internal staircase with a turn is a genuine reason to change module size.</p>`,
      Advanced: `<p>Surveys fail in predictable ways, and every one of them shows up as either a change order, a shortfall claim, or a rejected inspection. The experienced surveyor is not measuring more carefully than the trainee, they are measuring a different list.</p>
<h2>The structural questions that decide the job</h2>
<p>You are adding load to somebody's roof and then leaving. Establish four things and write them in the survey record:</p>
<ul>
<li>Slab type and age. An RCC slab in reasonable condition carries a ballasted or a chemically anchored structure. A Mangalore tile roof, a sheet roof on light purlins, or a filler slab needs the load taken to the beams or to the walls, not to the middle of the span.</li>
<li>Waterproofing state. If the terrace already leaks, penetrating fixings will be blamed for it. Photograph existing damp patches before you drill anything.</li>
<li>Existing use. A terrace used for drying grain, for a function shamiana, or for sleeping in summer needs the layout negotiated now, not after the structure is up.</li>
<li>Future floor. Ask directly whether another floor is planned. A plant installed a year before a first floor slab is a plant that gets dismantled at your cost.</li>
</ul>
<h2>Shading judgement beyond the rule of thumb</h2>
<table>
<thead><tr><th>Situation</th><th>What it really costs</th><th>Correct response</th></tr></thead>
<tbody>
<tr><td>Parapet shades the bottom 300 mm of the first row in December</td><td>One cell row in shade can pull a whole substring down through its bypass diode</td><td>Raise the front row or set it back, do not accept it</td></tr>
<tr><td>Thin obstruction such as an antenna mast or a guy wire</td><td>A moving line shadow crossing cells, larger effect than its area suggests</td><td>Relocate the mast, it is cheaper than the loss</td></tr>
<tr><td>Neighbour's plot vacant on the south side</td><td>Unknown future construction, and no legal right to light</td><td>Record it in writing and get the owner's acknowledgement</td></tr>
<tr><td>Diffuse shade from a distant tree line</td><td>Modest energy loss, no hot spot risk</td><td>Acceptable, quote with a lower performance ratio</td></tr>
</tbody>
</table>
<h2>Trading tilt against area</h2>
<p>On a constrained terrace the honest comparison is not tilt against energy per kWp, it is tilt against energy from the whole roof. Dropping tilt from 18 degrees to 10 degrees costs roughly 2 to 3 percent of annual yield per kWp, but it shortens the row shadow enough to fit an extra row on many terraces, which adds far more than 3 percent of total energy. Where the roof is the binding constraint, flatten and fill. Where the roof is generous, tilt to latitude and space properly.</p>
<h2>Survey record, the version that survives an argument</h2>
<ol>
<li>Dimensioned sketch with north marked and every obstruction height noted.</li>
<li>Photographs: four corners of the roof, the meter and its seal, the house distribution board with the cover off, the proposed inverter wall, the earth pit location, and the access route.</li>
<li>Sanctioned load and consumer number copied from the bill, since the plant size is capped against it in most DISCOM net metering rules.</li>
<li>Maximum system size the roof supports, stated as a number of modules and a kWp, not as a vague area.</li>
<li>Cable run lengths, DC and AC, in metres, measured and not paced.</li>
<li>Any condition you are asking the customer to accept, such as December shading on one row, signed by them.</li>
</ol>
<p>The last item is the one that stops a shortfall complaint becoming a dispute. A shading loss the customer agreed to in writing is a design choice; the same loss unrecorded is a defect you own.</p>`,
      Expert: `<p>Field card for the survey. Numbers here are for Telangana latitudes, roughly 16 to 19 degrees north.</p>
<h2>Shadow multipliers, 21 December</h2>
<table>
<thead><tr><th>Solar time</th><th>Approximate altitude</th><th>Shadow as a multiple of height</th></tr></thead>
<tbody>
<tr><td>9:00</td><td>30 degrees</td><td>1.7</td></tr>
<tr><td>10:30</td><td>42 degrees</td><td>1.1</td></tr>
<tr><td>12:00 solar noon</td><td>49 degrees</td><td>0.87</td></tr>
<tr><td>15:00</td><td>30 degrees</td><td>1.7</td></tr>
</tbody>
</table>
<h2>Area and layout numbers</h2>
<ul>
<li>Elevated tilted array on a flat terrace: about 9 to 10 square metres of roof per kWp including walkways.</li>
<li>Flush mounted on a pitched roof: about 6 to 7 square metres per kWp, since no row spacing is needed.</li>
<li>A 545 W class module is roughly 2.28 m by 1.13 m, about 2.6 square metres of glass.</li>
<li>Row pitch equals module horizontal projection plus row rise multiplied by 1.7 for a 9 am to 3 pm December window.</li>
<li>Keep 900 mm clear at the array perimeter for maintenance access and to stop the wind uplift edge zone landing on a module.</li>
</ul>
<h2>Twelve item survey checklist</h2>
<ol>
<li>Roof dimensions plus a diagonal check.</li>
<li>True north marked, compass read away from steel.</li>
<li>Parapet height on all four sides.</li>
<li>Every obstruction, position and height.</li>
<li>Slab type, age, visible cracks and damp.</li>
<li>Planned future floor, asked and recorded.</li>
<li>Inverter wall: shaded, ventilated, reachable.</li>
<li>DC run and AC run in metres.</li>
<li>Earth pit location and soil type.</li>
<li>Meter make, seal condition, and the consumer number.</li>
<li>Sanctioned load in kW from the bill.</li>
<li>Access route for a 2.3 m module.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A terrace already carrying a solar water heater is a negotiation, not an obstruction. Moving it is usually easier than designing around its tank.</li>
<li>A roof with a mobile tower or a leased hoarding may have a contract that prohibits further structures. Ask before quoting.</li>
<li>A north facing pitched roof is not usable at Telangana latitudes without a tilted frame that raises wind load and cost. Say so at survey stage.</li>
<li>Where the array must sit east and west facing on both slopes of a pitched roof, annual yield per kWp falls by roughly 10 to 15 percent but the generation profile widens, which suits a household that uses power in the morning and the evening.</li>
</ul>`,
    },
  },
  31103: {
    topicId: 31103,
    title: "Reading an electricity bill to size a system",
    summary:
      "The bill, not the roof, tells you how big the plant should be, and it also carries the two numbers the DISCOM will check your application against. You learn to pull twelve months of units, the sanctioned load, the category and the service number off the paper, and to turn them into a kWp figure you can defend.",
    concepts: [
      "Units and the billing period",
      "Sanctioned load",
      "Tariff category and slabs",
      "Annual consumption profile",
      "Sizing from consumption",
      "Net metering capacity cap",
    ],
    glossary: {
      Unit:
        "One kilowatt hour of energy, the quantity the meter counts and the bill charges for. A 1 kW load running one hour consumes one unit.",
      "Sanctioned load":
        "The load in kW the DISCOM has agreed to supply to that service connection. It appears on the bill, it decides the service cable and fuse rating, and net metering rules generally cap the plant against it.",
      "Service number":
        "The unique identifier of the electricity connection, printed at the top of the bill. Every application, inspection and net meter installation is filed against it, so a wrong digit stalls the whole file.",
      "Tariff category":
        "The class of consumer, such as domestic low tension, commercial, or agricultural. It sets the rate structure and it also decides which net metering provisions apply.",
      "Telescopic slab":
        "A tariff in which the first block of units is charged at one rate, the next block at a higher rate, and so on within the same bill, rather than the whole consumption moving to the higher rate.",
      "Net metering":
        "An arrangement in which a bidirectional meter records both import and export, and the consumer is billed on the net of the two over the settlement period set by the DISCOM.",
    },
    body: {
      Beginner: `<p>The roof tells you how big a plant can fit. The bill tells you how big a plant is worth putting there. Ask the customer for the last twelve bills, or for the consumption history that most DISCOM apps and web portals show for the past year.</p>
<h2>Five things to find on the paper</h2>
<ol>
<li>The <strong>service number</strong>, also called the consumer number or USC number. Copy it digit by digit. Every form you file later carries it.</li>
<li>The <strong>category</strong>, for example domestic low tension. A shop and a house are billed differently.</li>
<li>The <strong>sanctioned load</strong>, printed in kW. This is what the DISCOM has agreed to supply to that house.</li>
<li>The <strong>units consumed</strong> in the month, which is the present meter reading minus the previous one.</li>
<li>Whether the reading is an actual reading or an average one. A bill marked as provisional or average is not evidence of real consumption.</li>
</ol>
<h2>Turning units into a plant size</h2>
<p>Add the units from twelve bills and divide by 365 to get an average day. Suppose a house in Siddipet used 4,800 units in the year. That is about 13.2 units a day.</p>
<p>Now work backwards through the generation figure from your first topic. One kWp on a Telangana roof gives roughly 5.0 peak sun hours multiplied by a performance ratio of 0.78, which is about 3.9 units a day.</p>
<p>So the size you need is 13.2 divided by 3.9, which is 3.4 kWp. Round to the nearest sensible module count. Seven modules of 500 W give 3.5 kWp, and that is the plant you propose.</p>
<h2>Then check it against two limits</h2>
<p>First, the roof. From the survey, 3.5 kWp needs about 35 square metres of usable terrace. If the roof gives 25, the roof wins and you propose 2.5 kWp.</p>
<p>Second, the sanctioned load. If the connection is sanctioned for 3 kW, most DISCOM rules will not let you connect a 3.5 kWp plant to it without first applying to raise the sanctioned load. Tell the customer this at the quotation stage. It is a form and a fee, and it takes time.</p>
<p>Never promise that the bill will become zero. Fixed charges and other components stay on the bill even in a month with heavy export.</p>`,
      Intermediate: `<p>Sizing from consumption is the difference between a plant that pays for itself and a plant that exports half its output at a rate nobody agreed to. Work the bill properly and the number you quote survives every question the customer asks.</p>
<h2>Extract twelve months, not one</h2>
<p>A single bill is a snapshot of one season. A Telangana household bill in May with two air conditioners running can be three times the bill for the same house in August. Collect the full year and lay it out month by month. If the customer has only recent bills, the DISCOM consumer portal will usually show a twelve month consumption history against the service number.</p>
<p>Watch for three things that make a month useless as data:</p>
<ul>
<li>A provisional or average reading, which the bill marks with a code rather than a word.</li>
<li>A month with arrears or an adjustment, where the units billed are not the units consumed.</li>
<li>A month the family was away, or a month a construction load was running on the same meter.</li>
</ul>
<h2>The sizing arithmetic, worked</h2>
<p>Take a house in Karimnagar with a twelve month total of 6,200 units and a sanctioned load of 5 kW, domestic category.</p>
<ul>
<li>Daily average: 6,200 divided by 365, which is 17.0 units per day.</li>
<li>Yield per kWp per day: 5.0 peak sun hours multiplied by 0.78 performance ratio, which is 3.9 units.</li>
<li>Required size: 17.0 divided by 3.9, which is 4.36 kWp.</li>
<li>Module count at 545 W: 4,360 divided by 545 is exactly 8 modules, so 4.36 kWp on the nameplate.</li>
<li>Roof check: 8 modules elevated need roughly 44 square metres of terrace with walkways.</li>
<li>Sanctioned load check: 4.36 kWp against 5 kW sanctioned, which is within limit.</li>
</ul>
<p>That is a defensible proposal. Every number in it can be shown to the customer on a piece of paper.</p>
<h2>Why the sanctioned load matters twice</h2>
<p>It matters to the DISCOM, because most net metering regulations cap the sanctioned rooftop capacity against the consumer's sanctioned load, and the exact percentage and the treatment of different consumer categories vary by state and are revised from time to time. Check the current TGSPDCL or TGNPDCL provision for the district you are working in rather than carrying a number from an old job.</p>
<p>It matters physically as well. The service cable, the DISCOM fuse and the meter were sized for the sanctioned load. A plant that pushes more current back through that path than it was built for is a real thermal problem, not a paperwork one.</p>
<h2>The seasonal shape you must explain</h2>
<p>Generation peaks in March and April and falls in July and August when the sky is overcast for days at a time. Household consumption in Telangana usually peaks in April and May with cooling load. The two curves do not line up, so a plant sized on the annual average will export in the mild months and import in the monsoon. Under net metering that is exactly the intended behaviour, and the settlement period, not the month, is what matters.</p>
<h2>What you must not say</h2>
<p>Do not quote a subsidy amount, a buyback rate or a payback period as a fixed fact. Those are set by scheme notifications and DISCOM orders that change. Quote the generation, quote the units it displaces, and let the customer apply the current rates.</p>`,
      Advanced: `<p>Bills conceal more than they show, and a sizing that ignores what is hidden produces a plant that underperforms against the customer's expectation while behaving exactly as designed.</p>
<h2>Six ways a bill misleads</h2>
<table>
<thead><tr><th>What you see</th><th>What may be true</th><th>How to check</th></tr></thead>
<tbody>
<tr><td>Low units all year</td><td>The house has a second connection, or a borewell on a separate agricultural service</td><td>Ask how many meters serve the premises and look at the meter board</td></tr>
<tr><td>A sudden three month spike</td><td>Construction load, a guest family, or a faulty geyser thermostat</td><td>Ask before treating it as base load</td></tr>
<tr><td>Round number units, month after month</td><td>Provisional billing against an unread meter, later adjusted</td><td>Look for the reading status code and for a large adjustment month</td></tr>
<tr><td>Units fall sharply after a certain month</td><td>An inverter and battery, or a change in occupancy</td><td>Ask what changed, and size on the current pattern</td></tr>
<tr><td>Commercial category on a residential looking building</td><td>A shop or a tuition centre on the ground floor</td><td>Category changes the net metering provisions that apply</td></tr>
<tr><td>Sanctioned load far below the visible appliances</td><td>Load was never enhanced after the house grew</td><td>Enhancement is a prerequisite, plan the timeline</td></tr>
</tbody>
</table>
<h2>Sizing decisions that are not arithmetic</h2>
<ul>
<li><strong>Size to consumption, not to roof, unless the customer asks otherwise.</strong> An oversized plant sells its surplus at whatever the export provision allows, and that is generally worth less than the retail unit it would have displaced.</li>
<li><strong>Size to the whole year, not to summer.</strong> Sizing on a May bill produces a plant that spends nine months exporting.</li>
<li><strong>Round down when the roof is tight.</strong> A cramped extra row that sits in December shadow adds cost and adds a complaint.</li>
<li><strong>Round up when a load is known to be coming.</strong> A confirmed air conditioner or an electric two wheeler is real future consumption, but ask for it in writing.</li>
</ul>
<h2>The three phase question</h2>
<p>A single phase connection typically limits how much you can install before the DISCOM asks for conversion to three phase, and unbalanced injection on one phase of a three phase connection is its own problem. If the house already has three phase, confirm which phases the loads sit on. A single phase inverter of 5 kW on a three phase service injects on one phase only, which is acceptable up to the limit the DISCOM allows and awkward above it. Above that point you fit a three phase inverter, and the cost step is real, so it belongs in the first quotation and not in a revision.</p>
<h2>What to hand over at the end of the survey and bill stage</h2>
<ol>
<li>Twelve month consumption table with the doubtful months flagged.</li>
<li>Daily average units, the yield assumption used, and the resulting kWp, all shown as working.</li>
<li>Proposed size after the roof cap and the sanctioned load cap have been applied, with the binding constraint named.</li>
<li>A statement of what will remain on the bill regardless of generation, so that nobody expects a zero bill.</li>
<li>Any prerequisite the customer must complete, such as a load enhancement application, with the fact that it takes time stated plainly.</li>
</ol>`,
      Expert: `<p>Bill to kWp in one card. Use it at the customer's table.</p>
<h2>Extraction list</h2>
<table>
<thead><tr><th>Field</th><th>Why you need it</th></tr></thead>
<tbody>
<tr><td>Service number</td><td>Identifies the connection on every later form</td></tr>
<tr><td>Consumer name and address</td><td>Must match the application and the ownership proof</td></tr>
<tr><td>Category</td><td>Decides which net metering provisions apply</td></tr>
<tr><td>Sanctioned load in kW</td><td>Caps the plant and sets the service cable rating</td></tr>
<tr><td>Phase, single or three</td><td>Decides inverter type and injection limits</td></tr>
<tr><td>Twelve months of units</td><td>The sizing input</td></tr>
<tr><td>Reading status per month</td><td>Separates real data from provisional billing</td></tr>
<tr><td>Meter serial and seal</td><td>Photograph it before the net meter is swapped</td></tr>
</tbody>
</table>
<h2>Formula card</h2>
<ul>
<li>Daily units equal annual units divided by 365.</li>
<li>Yield per kWp per day equals peak sun hours multiplied by performance ratio, about 3.9 units in Telangana at a performance ratio of 0.78.</li>
<li>Required kWp equals daily units divided by yield per kWp per day.</li>
<li>Module count equals required watts divided by module watts, rounded to a whole number that also fits the string sizing rules from module three.</li>
<li>Proposed size equals the smallest of the consumption size, the roof size and the sanctioned load cap. Name which one bound.</li>
</ul>
<h2>Fast sanity numbers</h2>
<ul>
<li>1 kWp gives roughly 1,400 to 1,500 units a year on a clean unshaded Telangana roof.</li>
<li>A household using 300 units a month needs roughly 2.5 kWp.</li>
<li>A household using 500 units a month needs roughly 4 kWp.</li>
<li>A household using 1,000 units a month needs roughly 8 kWp, and at that size confirm the phase before quoting.</li>
</ul>
<h2>Traps in the last week before an installation</h2>
<ul>
<li>An unpaid arrear on the service blocks the net metering file even when the technical work is complete.</li>
<li>A connection in a deceased relative's name needs a name transfer first, and that is slower than the installation.</li>
<li>A tenant cannot usually apply against a landlord's service number without written consent.</li>
<li>A load enhancement applied for late holds up the meter change even after the plant is built and tested.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A household in Karimnagar consumed 6,200 units over twelve months. Using 5.0 peak sun hours and a performance ratio of 0.78, what array size does the consumption call for?",
        options: ["About 2.2 kWp", "About 4.4 kWp", "About 8.7 kWp", "About 17 kWp"],
        answer: 1,
        explanation:
          "Daily use is 6,200 divided by 365, which is 17.0 units, and one kWp gives 5.0 x 0.78 = 3.9 units a day, so 17.0 divided by 3.9 is about 4.4 kWp. The 17 kWp answer comes from treating daily units as kWp directly, which confuses energy with capacity.",
        difficulty: "Medium",
        skill: "Sizing from consumption",
      },
      {
        n: 2,
        question:
          "The bill shows a sanctioned load of 3 kW and the roof can hold 6 kWp. Consumption calls for 4 kWp. What do you propose?",
        options: [
          "6 kWp, because the roof is the real physical limit",
          "4 kWp, because consumption sizing always governs",
          "3 kWp, or 4 kWp only after the sanctioned load has been enhanced",
          "1 kWp, since the plant must be well under the sanctioned load",
        ],
        answer: 2,
        explanation:
          "The proposed size is the smallest of the consumption size, the roof size and the sanctioned load cap, so 3 kW binds unless the customer applies to enhance the load first. Choosing 4 kWp because consumption says so is the tempting error, and it produces a file the DISCOM will not sanction.",
        difficulty: "Medium",
        skill: "Net metering capacity cap",
      },
      {
        n: 3,
        question: "What exactly is the sanctioned load printed on an electricity bill?",
        options: [
          "The highest demand the meter recorded in the last billing period",
          "The load in kW the DISCOM has agreed to supply to that service connection",
          "The total wattage of all appliances present in the house",
          "The maximum solar capacity permitted on that roof",
        ],
        answer: 1,
        explanation:
          "Sanctioned load is the contracted supply capacity for that connection, which is why the service cable, fuse and meter were sized against it. The total appliance wattage is the connected load, a different quantity that is often much larger, and confusing the two is what leads installers to skip a needed enhancement application.",
        difficulty: "Easy",
        skill: "Sanctioned load",
      },
      {
        n: 4,
        question:
          "A customer shows you one bill, from May, with very high units and asks you to size on it. What is the correct response?",
        options: [
          "Size on the May bill, since the plant should cover the worst month",
          "Halve the May units as a rule of thumb and size on that",
          "Collect twelve months of units and size on the annual average",
          "Size on the lowest month, so the plant never exports",
        ],
        answer: 2,
        explanation:
          "Sizing uses the twelve month total because household load in Telangana peaks with summer cooling while generation peaks in March and April, and net metering settles over a period rather than a single month. Sizing on May looks generous to the customer but builds a plant that exports for most of the year at whatever the export provision allows.",
        difficulty: "Medium",
        skill: "Annual consumption profile",
      },
      {
        n: 5,
        question:
          "Three consecutive bills show identical round-figure units and a code indicating the meter was not read. How should those months be treated in your sizing?",
        options: [
          "As normal data, since the DISCOM issued the bill",
          "As unreliable, because provisional billing does not record actual consumption",
          "As the customer's true minimum consumption",
          "As evidence that the meter is faulty and must be replaced first",
        ],
        answer: 1,
        explanation:
          "Provisional or average billing estimates units when the meter was not read, and a later adjustment month corrects it, so those months are not measurements. Treating them as normal data is tempting because the bill looks official, but it will skew the annual total in either direction depending on when the adjustment landed.",
        difficulty: "Hard",
        skill: "Units and the billing period",
      },
      {
        n: 6,
        question:
          "Why does the tariff category on the bill matter to a rooftop solar proposal, beyond the rate charged?",
        options: [
          "It determines the tilt angle the DISCOM will approve",
          "It determines which net metering provisions apply to that connection",
          "It sets the module efficiency that may be used",
          "It fixes the inverter brand that may be installed",
        ],
        answer: 1,
        explanation:
          "Domestic, commercial and agricultural connections fall under different provisions for capacity limits and settlement, so the category decides the rules your application is judged by. Tilt, module efficiency and inverter brand are technical choices the tariff category has nothing to do with, which is why they are attractive but wrong.",
        difficulty: "Hard",
        skill: "Tariff category and slabs",
      },
      {
        n: 7,
        question:
          "A customer expects the bill to fall to zero once the plant is running. What should you tell them?",
        options: [
          "It will be zero in any month where export exceeds import",
          "Fixed and other charges remain on the bill regardless of generation",
          "It becomes zero only if a battery is added",
          "It becomes zero once the sanctioned load is enhanced",
        ],
        answer: 1,
        explanation:
          "Fixed charges and other components tied to the connection continue to appear even in a month with heavy export, so the honest promise is a reduction in energy charges, not a zero bill. Saying it goes to zero when export exceeds import is the attractive claim that generates a complaint in the first billing cycle.",
        difficulty: "Easy",
        skill: "Units and the billing period",
      },
    ],
  },
  31104: {
    topicId: 31104,
    title: "PV module construction, ratings and the nameplate",
    summary:
      "The label on the back of a module is a design document, and a technician who can read it can size a string, choose a fuse and predict how the module will behave at 65 degrees on a June afternoon. You work through the IV curve, the six nameplate numbers, the temperature coefficients and the bypass diodes that decide what a shadow costs.",
    concepts: [
      "Cell, module and array",
      "Open circuit voltage and short circuit current",
      "Maximum power point and fill factor",
      "Temperature coefficients",
      "Bypass diodes and hot spots",
      "Module certification and construction",
    ],
    glossary: {
      "Open circuit voltage":
        "Written Voc. The voltage across the module terminals when nothing is connected. It is the highest voltage the module can present, and it rises as the cells get colder.",
      "Short circuit current":
        "Written Isc. The current that flows if the terminals are joined directly. It is set almost entirely by how much light is falling on the cells.",
      "Maximum power point":
        "The one point on the module's voltage against current curve where volts multiplied by amps is greatest. Its coordinates are printed as Vmp and Imp.",
      "Fill factor":
        "Maximum power divided by the product of Voc and Isc. It measures how square the curve is, and a healthy crystalline module sits between about 0.75 and 0.82.",
      "Temperature coefficient":
        "The percentage change in a rating for each degree the cell moves away from 25 C. Power and voltage fall as the cell heats, current rises very slightly.",
      "Bypass diode":
        "A diode across a group of cells inside the junction box. When those cells are shaded it conducts and carries the string current around them, which protects them from overheating and saves the rest of the module.",
      NOCT:
        "Nominal operating cell temperature, the cell temperature reached at 800 W per square metre, 20 C ambient and 1 m per second wind. Typically 43 to 45 C, and it is the number that lets you estimate real operating temperature.",
    },
    body: {
      Beginner: `<p>Turn a module over and you find a printed label. That label is not decoration. Every number on it is used in a calculation you will do on this course.</p>
<h2>Cell, module, array</h2>
<p>A single silicon <strong>cell</strong> makes only about half a volt no matter how big it is. What changes with size is the current. To get a useful voltage the maker joins many cells in a line, which is called a series connection, and seals them under glass. That sealed unit is a <strong>module</strong>. Several modules wired together on a roof are an <strong>array</strong>.</p>
<h2>The six numbers on the label</h2>
<ul>
<li><strong>Pmax</strong>, the power in watts at laboratory conditions, for example 545 W.</li>
<li><strong>Voc</strong>, the open circuit voltage, the voltage you measure with nothing connected, for example 49.5 V.</li>
<li><strong>Isc</strong>, the short circuit current, for example 13.8 A.</li>
<li><strong>Vmp</strong>, the voltage at which the module gives most power, for example 41.8 V.</li>
<li><strong>Imp</strong>, the current at that same point, for example 13.0 A.</li>
<li><strong>Maximum system voltage</strong>, usually 1000 V or 1500 V. This is the highest voltage a whole string may reach, and it is a safety limit, not a target.</li>
</ul>
<p>Notice that Vmp multiplied by Imp gives about 543 W, close to the Pmax on the label, while Voc multiplied by Isc gives about 683 W. The module never works at Voc and Isc together, so that second product is not a power the module can deliver.</p>
<h2>Heat takes power away</h2>
<p>Those numbers are measured with the cell at 25 degrees. On a Telangana terrace in May the cell sits at 60 degrees or more, and a hot cell makes less voltage. That is why a 5 kWp array never shows 5 kW on the inverter display. Expect to lose in the region of one third of a percent of power for every degree above 25.</p>
<h2>What is inside</h2>
<p>From the front: toughened glass, a clear plastic layer, the cells with their thin metal fingers, another plastic layer, and a backsheet or a second sheet of glass. An aluminium frame holds it all. On the back sits the <strong>junction box</strong> with two cables and connectors, and inside it are small <strong>bypass diodes</strong> that carry the current around a shaded group of cells so those cells do not overheat.</p>
<h2>Handling</h2>
<p>Carry a module by its frame with two people, never by the junction box or the cables. Never stand or kneel on the glass. A cracked cell under the glass often shows no mark at all, and the module simply makes less power for the next twenty years.</p>`,
      Intermediate: `<p>Every sizing decision later in this course reads the module nameplate. Read it once properly and string sizing, fuse selection and fault diagnosis all become the same skill applied three times.</p>
<h2>The IV curve is the module</h2>
<p>Sweep a module from a dead short to an open circuit and plot current against voltage. You get a curve that is nearly flat at Isc, turns a knee, and drops steeply to zero current at Voc. Three facts about that curve carry most of the practical weight.</p>
<ul>
<li>The flat part means a module is close to a <strong>current source</strong>. Halve the light and the whole curve drops in current, but the voltage barely moves.</li>
<li>The steep part means voltage is set mainly by temperature and by how many cells are in series, not by light.</li>
<li>The knee is the <strong>maximum power point</strong>, and it moves left as the module heats. The inverter's tracker exists to follow it.</li>
</ul>
<p><strong>Fill factor</strong> is Pmax divided by Voc multiplied by Isc. With the example module, 545 divided by 49.5 multiplied by 13.8 gives 0.798. A module measured in the field with a much lower fill factor has a resistance problem: a corroded connector, a cracked cell, or a poor solder joint.</p>
<h2>Temperature, worked properly</h2>
<p>A datasheet gives three coefficients, and their signs matter:</p>
<ul>
<li>Pmax, about minus 0.34 to minus 0.40 percent per degree Celsius.</li>
<li>Voc, about minus 0.27 to minus 0.30 percent per degree Celsius.</li>
<li>Isc, about plus 0.04 to plus 0.05 percent per degree Celsius.</li>
</ul>
<p>Cell temperature is estimated from NOCT: cell temperature equals ambient plus NOCT minus 20, all divided by 800, multiplied by the irradiance. Take an ambient of 38 C in Nizamabad, irradiance 900 W per square metre, NOCT 44 C. Cell temperature is 38 plus 24 divided by 800 multiplied by 900, which is 38 plus 27, so 65 C.</p>
<p>Power at that temperature: 40 degrees above 25, multiplied by minus 0.35 percent, is minus 14 percent. A 545 W module is delivering about 469 W before any other loss. That single calculation explains most of the gap between nameplate and inverter display.</p>
<p>Run it the other way for the cold case. Voc at a 10 C cell temperature is 49.5 multiplied by 1 plus minus 0.0028 multiplied by 10 minus 25, which is 49.5 multiplied by 1.042, so 51.6 V. That upward move is small per module and decisive across twenty of them, which is the subject of the string sizing topic.</p>
<h2>Bypass diodes and what a shadow costs</h2>
<p>Cells in series all carry the same current, so one shaded cell tries to throttle the entire string and heats up doing it. The junction box therefore contains bypass diodes, normally three, each across one group of cells. When a group is shaded its diode conducts and the current takes the shortcut, so the module loses that group's contribution rather than the whole string losing everything.</p>
<p>Two consequences you will see on site. First, a small shadow costs a whole substring, not just the shaded cell, so a 4 percent shadow can cost 33 percent of that module. Second, a diode that has failed short circuit silently disables its group permanently, and the module then runs about one third down with no visible mark.</p>
<h2>The label lines nobody reads</h2>
<p>Maximum series fuse rating, printed in amperes, is the largest overcurrent device allowed in that module's circuit and it decides string fuse selection. Power tolerance, usually 0 to plus 5 W, tells you the module will never be under its rating. Application class and maximum system voltage tell you what the insulation was tested to. Certification marks to IEC 61215 for design qualification, IEC 61730 for safety and IS 14286 for crystalline modules tell you the module was tested at all, and government-linked and net metered projects generally also require the model to be on the approved list of models and manufacturers current at the time.</p>`,
      Advanced: `<p>Two technicians read the same nameplate. The one who has replaced modules under warranty reads it as a set of tolerances and failure modes.</p>
<h2>What the datasheet does not print on the label</h2>
<table>
<thead><tr><th>Parameter</th><th>Typical value</th><th>Why it matters on site</th></tr></thead>
<tbody>
<tr><td>First year degradation</td><td>1 to 2 percent</td><td>A year one performance check against nameplate will look short even on a healthy plant</td></tr>
<tr><td>Annual degradation after year one</td><td>0.45 to 0.55 percent</td><td>Sets the warranty line, usually about 80 to 85 percent retained at 25 years</td></tr>
<tr><td>Low irradiance behaviour</td><td>Relative efficiency at 200 W per square metre</td><td>Decides monsoon and early morning yield more than peak efficiency does</td></tr>
<tr><td>Maximum series fuse</td><td>20 to 25 A</td><td>Caps string fuse rating and therefore how many strings may be paralleled</td></tr>
<tr><td>Mechanical load rating</td><td>Front and rear, in Pa</td><td>Valid only for the clamping positions in the installation manual</td></tr>
</tbody>
</table>
<h2>Half cut cells change the shading arithmetic</h2>
<p>A half cut module splits every cell, doubling the cell count and halving the current per cell, which cuts resistive loss in the ribbons. Electrically it behaves as two halves in parallel, each half with its own set of bypass diodes. The practical result is that a shadow lying across the bottom edge, from a parapet for instance, may take out only the lower half of the module rather than a full third of it. A shadow lying vertically across both halves takes out far more. So on a half cut array, the orientation of the shadow relative to the module matters as much as its size, and that changes how you lay out a row against a parapet or a pipe.</p>
<h2>Failures you will actually be called for</h2>
<ul>
<li><strong>Hot spot.</strong> A persistently shaded or mismatched cell dissipates rather than generates and cooks the encapsulant. It shows as a brown patch and often a visible mark on the backsheet. The module is finished, and the shading cause must be removed or the replacement will do the same.</li>
<li><strong>Failed bypass diode.</strong> Usually fails short, which quietly removes a substring. Diagnose by measuring the module's Voc in sunlight against its neighbours: a module reading about two thirds of its expected Voc has lost one group.</li>
<li><strong>Microcracks.</strong> Caused by walking on modules, dropping a corner, or over-torquing a clamp. Invisible, progressive, and the reason handling rules are not a formality.</li>
<li><strong>Potential induced degradation.</strong> Occurs in high voltage strings in humid conditions when cells sit at a large potential relative to the earthed frame. Modules at the negative end of a long string suffer first, so an array whose worst modules are all at one string end is telling you something about the system, not about those modules.</li>
<li><strong>Connector mismatch.</strong> Two brands of MC4 style connector that mate mechanically but not electrically produce a high resistance joint that runs hot, arcs and eventually fails. Use one make throughout.</li>
</ul>
<h2>Judging a module before you buy a container of them</h2>
<ol>
<li>Check the model is on the approved list current at the time of the project, since net metering and scheme linked installations generally require it.</li>
<li>Read the fill factor from the datasheet numbers yourself. A quoted Pmax that does not reconcile with Vmp and Imp is a warning.</li>
<li>Compare the Pmax temperature coefficient across candidates. On a Telangana roof a difference of 0.04 percent per degree is worth more than a small difference in nameplate efficiency.</li>
<li>Ask for the installation manual, not the brochure. Clamping zones, torque and permitted mounting orientations live there and they are what a warranty claim is tested against.</li>
<li>Confirm the frame earthing points and whether the manual requires a specific bonding hardware. An improvised earth connection through a painted frame is a common inspection failure.</li>
</ol>`,
      Expert: `<p>Nameplate recall card for a 545 W class crystalline module. Values are typical, and the datasheet in your hand always wins.</p>
<h2>Ratings at a glance</h2>
<table>
<thead><tr><th>Symbol</th><th>Meaning</th><th>Typical</th><th>Driven mainly by</th></tr></thead>
<tbody>
<tr><td>Pmax</td><td>Power at STC</td><td>545 W</td><td>Both, at the knee</td></tr>
<tr><td>Voc</td><td>Open circuit voltage</td><td>49.5 V</td><td>Temperature, cells in series</td></tr>
<tr><td>Isc</td><td>Short circuit current</td><td>13.8 A</td><td>Irradiance, cell area</td></tr>
<tr><td>Vmp</td><td>Voltage at max power</td><td>41.8 V</td><td>Temperature</td></tr>
<tr><td>Imp</td><td>Current at max power</td><td>13.0 A</td><td>Irradiance</td></tr>
<tr><td>Max system voltage</td><td>Insulation limit</td><td>1000 or 1500 V</td><td>Construction class</td></tr>
<tr><td>Max series fuse</td><td>Overcurrent limit</td><td>20 to 25 A</td><td>Ribbon and diode rating</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Series adds voltage and keeps current. Parallel adds current and keeps voltage.</li>
<li>Light moves current. Temperature moves voltage. That sentence solves most field diagnosis.</li>
<li>Fill factor equals Pmax divided by Voc times Isc. Below about 0.70 in the field, look for resistance.</li>
<li>Cell temperature equals ambient plus NOCT minus 20, divided by 800, times irradiance.</li>
<li>A module reading two thirds of expected Voc has lost one bypass group.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>Isc rises with temperature, very slightly. The sign is positive and it is the one coefficient trainees get backwards.</li>
<li>Cloud edge enhancement can briefly push irradiance above 1000 W per square metre, so a module momentarily exceeding Isc is not a defect.</li>
<li>A bifacial module's nameplate power is a front side figure unless a bifaciality gain is stated, and rear gain on a flush mounted rooftop array is close to nothing.</li>
<li>Power tolerance is normally zero to plus five watts, so a module measuring below nameplate at true STC is out of specification, not merely unlucky.</li>
<li>Measuring Voc with a multimeter in bright sun is safe practice; measuring Isc by shorting the leads is not a routine field test and it should be done only with a clamp meter and a designed shorting device.</li>
</ul>
<h2>Handling rules that protect the warranty</h2>
<ol>
<li>Two people, hold the frame, never the junction box or the leads.</li>
<li>Never place a module face down on gravel or on a rough terrace.</li>
<li>Clamp only within the marked zones and to the stated torque.</li>
<li>Do not walk on glass, at any age, at any temperature.</li>
<li>Record serial numbers against physical positions before the array is closed up.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A module label reads Pmax 545 W, Voc 49.5 V, Isc 13.8 A, Vmp 41.8 V, Imp 13.0 A. What is its fill factor?",
        options: ["0.50", "0.80", "1.25", "0.30"],
        answer: 1,
        explanation:
          "Fill factor is Pmax divided by the product of Voc and Isc: 545 divided by (49.5 x 13.8 = 683) gives about 0.80, which is normal for a crystalline module. A value above 1 is impossible, since Voc times Isc is always larger than the power the module can actually deliver.",
        difficulty: "Medium",
        skill: "Maximum power point and fill factor",
      },
      {
        n: 2,
        question:
          "Ambient is 38 C, irradiance is 900 W per square metre and the module NOCT is 44 C. What is the estimated cell temperature?",
        options: ["44 C", "51 C", "65 C", "38 C"],
        answer: 2,
        explanation:
          "Cell temperature equals ambient plus (NOCT minus 20) divided by 800, multiplied by irradiance: 38 + (24/800 x 900) = 38 + 27 = 65 C. Answering 44 C treats NOCT as the operating temperature itself, but NOCT is only the value reached under its own reference conditions of 800 W per square metre and 20 C ambient.",
        difficulty: "Hard",
        skill: "Temperature coefficients",
      },
      {
        n: 3,
        question:
          "A pipe casts a narrow shadow over four cells of a 72 cell module with three bypass diodes. What happens?",
        options: [
          "Only those four cells stop contributing, so the loss is about 5 percent",
          "The bypass diode across that cell group conducts, so roughly a third of the module is lost",
          "The whole module produces nothing until the shadow moves",
          "The shaded cells draw current from the others and the module output rises",
        ],
        answer: 1,
        explanation:
          "Cells in series share one current, so the diode across the affected group conducts and the current bypasses that whole group, costing about a third of the module rather than the shaded area alone. Assuming the loss is proportional to the shaded area is the common error and it is why a thin pipe shadow is worth relocating.",
        difficulty: "Medium",
        skill: "Bypass diodes and hot spots",
      },
      {
        n: 4,
        question:
          "In bright sun, one module in a string measures about two thirds of the Voc its neighbours show. What is the most likely cause?",
        options: [
          "Dust on the glass reducing irradiance",
          "A bypass diode that has failed short circuit",
          "A loose AC connection at the inverter",
          "The module is a different wattage from its neighbours",
        ],
        answer: 1,
        explanation:
          "A shorted bypass diode removes one cell group permanently, and with three groups per module that leaves about two thirds of the open circuit voltage. Dust is the tempting answer, but soiling reduces current and barely moves Voc, since voltage is set by temperature and cell count rather than by light.",
        difficulty: "Hard",
        skill: "Bypass diodes and hot spots",
      },
      {
        n: 5,
        question:
          "Which statement about the three temperature coefficients on a module datasheet is correct?",
        options: [
          "All three are negative, since heat is always a loss",
          "Voc and Pmax are negative, Isc is slightly positive",
          "Voc is positive, Pmax and Isc are negative",
          "Only Pmax has a coefficient, the other two are fixed",
        ],
        answer: 1,
        explanation:
          "Power and open circuit voltage fall as the cell heats, so both coefficients are negative, while short circuit current rises very slightly with temperature and carries a small positive coefficient. Assuming everything falls with heat is intuitive and wrong, and the sign of the Isc coefficient is exactly the point examiners test.",
        difficulty: "Medium",
        skill: "Temperature coefficients",
      },
      {
        n: 6,
        question:
          "Two modules are wired in series. Each has Voc 49.5 V and Isc 13.8 A. What are the Voc and Isc of the pair?",
        options: ["99 V and 27.6 A", "49.5 V and 27.6 A", "99 V and 13.8 A", "24.75 V and 13.8 A"],
        answer: 2,
        explanation:
          "A series connection adds voltage and keeps current the same, giving 99 V and 13.8 A. The option showing both quantities doubled mixes series with parallel, and that confusion is what produces strings that exceed the inverter voltage limit or fuses that are the wrong size.",
        difficulty: "Easy",
        skill: "Cell, module and array",
      },
      {
        n: 7,
        question:
          "Why should a module never be carried or lifted by its junction box or its cables?",
        options: [
          "The junction box is not waterproof until it is mounted",
          "It strains the internal connections and can crack cells, with no visible damage",
          "The cables carry lethal voltage even in the dark",
          "It voids the certification marks printed on the label",
        ],
        answer: 1,
        explanation:
          "The junction box is bonded to the backsheet and its leads terminate on internal ribbons, so lifting by them strains those joints and flexes the laminate, which produces microcracks that reduce output permanently and cannot be seen. The lethal-voltage answer is wrong in the specific sense given, since a module in darkness generates almost nothing, although in daylight the leads certainly are live.",
        difficulty: "Easy",
        skill: "Module certification and construction",
      },
    ],
  },
  31105: {
    topicId: 31105,
    title: "String inverters, microinverters and hybrid inverters",
    summary:
      "The inverter decides what the array is allowed to do, so you learn to read its DC input window, its tracker count and its AC rating before you choose modules to match. You also learn where each topology genuinely wins: a plain string inverter on a clean terrace, module level electronics on a broken roof, and a hybrid only where a battery is actually justified.",
    concepts: [
      "MPPT and tracker count",
      "String inverter topology",
      "Module level power electronics",
      "Hybrid and off grid inverters",
      "Anti islanding and grid protection",
      "Inverter efficiency and derating",
    ],
    glossary: {
      MPPT:
        "Maximum power point tracking. The inverter continuously adjusts the voltage it presents to the array so that volts multiplied by amps stays at the peak of the curve as light and temperature change.",
      "MPPT voltage window":
        "The band of DC voltage within which the inverter can actually track. Below the lower limit it stops producing; above the upper limit it stops tracking, and above the absolute maximum input voltage it is damaged.",
      Microinverter:
        "A small inverter fixed behind each module, converting that module's DC to mains AC on the roof, so the rooftop wiring carries AC rather than high voltage DC.",
      "Power optimiser":
        "A DC to DC unit fixed behind each module that conditions that module's output before it joins the string, keeping the string inverter for the actual conversion.",
      "Hybrid inverter":
        "An inverter with a battery port as well as a grid port, able to charge and discharge a battery and, with the correct wiring, to run selected circuits when the grid is off.",
      "Anti islanding":
        "The protection that makes a grid tied inverter stop feeding within a fraction of a second when the grid supply disappears, so that a rooftop cannot energise a line a crew is working on.",
    },
    body: {
      Beginner: `<p>The inverter is the box on the wall. It takes the direct current the modules make and turns it into the alternating current the house uses. It is also the part that decides how many modules you may connect and in what arrangement, so you read its label before you buy anything else.</p>
<h2>What the label tells you</h2>
<ul>
<li><strong>Maximum DC input voltage</strong>, for example 600 V. Go above this and the inverter is damaged. This is a hard limit.</li>
<li><strong>MPPT voltage range</strong>, for example 160 V to 550 V. The array must sit inside this band to produce anything.</li>
<li><strong>Maximum input current</strong> per tracker, for example 15 A.</li>
<li><strong>Number of MPPTs</strong>, usually one or two on a household unit. Each one can follow a different group of modules.</li>
<li><strong>AC output</strong>, for example 5 kW at 230 V, 50 Hz, single phase.</li>
</ul>
<h2>Three kinds you will meet</h2>
<p>A <strong>string inverter</strong> is the normal choice. Modules are wired in a line, the line comes down one pair of cables, and one box does everything. It is cheap, simple and easy to service, because there is one unit at head height.</p>
<p>A <strong>microinverter</strong> is a small inverter fixed behind each module. Each module works on its own, so a shadow on one module does not pull the others down. There is no high voltage DC on the roof at all, which is safer. It costs more, and there are as many units as modules, all of them on the roof.</p>
<p>A <strong>hybrid inverter</strong> has a battery connection as well. It is only worth the extra cost where a battery is genuinely needed, which is a later topic.</p>
<h2>The safety function inside</h2>
<p>Every grid connected inverter must stop feeding the moment the grid supply goes away. This is called <strong>anti islanding</strong>. Without it, your customer's roof could keep a village line alive while a lineman is working on it. So a normal on grid inverter goes dark in a power cut, and it is doing exactly what it should. Explain this to the customer before handover, because otherwise the first outage produces an angry phone call.</p>
<h2>Where to fix it</h2>
<p>Shaded, ventilated, at eye level, on a solid wall, not above a bed, not next to a gas cylinder, not in a closed cupboard. An inverter in direct afternoon sun gets hot and reduces its own output to protect itself, so a badly placed inverter costs the customer units every summer.</p>`,
      Intermediate: `<p>Choosing an inverter is a matching exercise in three quantities at once: voltage, current and power. Get any one of them wrong and the plant either does not start, does not track, or trips.</p>
<h2>Voltage first</h2>
<p>Two checks bracket the string, and both are done at temperature extremes rather than at STC.</p>
<ul>
<li><strong>Cold check.</strong> The array's open circuit voltage on the coldest bright morning must stay below the inverter's absolute maximum DC input voltage. This is a damage limit and there is no tolerance in it.</li>
<li><strong>Hot check.</strong> The array's maximum power point voltage on the hottest afternoon must stay above the bottom of the MPPT window, otherwise the inverter drops out of tracking in the middle of the best generating hours.</li>
</ul>
<p>Take a 600 V, 160 to 550 V unit and the 545 W module from the last topic, Voc 49.5 V, Vmp 41.8 V. Eight modules in series give 396 V at STC. On a 10 C morning, with a Voc coefficient of minus 0.28 percent per degree, each module rises to 51.6 V, so the string reaches 413 V, comfortably under 600. On a 65 C cell afternoon, with a Vmp coefficient near minus 0.40 percent per degree, each module falls to about 35 V, so the string sits near 281 V, comfortably above 160. Eight modules is a valid string on this inverter.</p>
<h2>Then current, then power</h2>
<p>Imp is 13.0 A, and the tracker accepts 15 A, so one string per tracker is fine and two strings in parallel on one tracker would not be. Note that the limit that matters for protection is the maximum short circuit current the tracker will accept, which is a separate figure on the same datasheet.</p>
<p>For power, an array slightly larger than the inverter's AC rating is normal and intentional, because the array rarely reaches nameplate. The detail of that ratio is the subject of a later topic; at this stage the rule is that the inverter datasheet states a maximum recommended array size in kWp and you stay within it.</p>
<h2>Choosing a topology honestly</h2>
<table>
<thead><tr><th>Situation</th><th>Choose</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>Clean rectangular terrace, one orientation</td><td>String inverter</td><td>Lowest cost, one serviceable unit, nothing on the roof to fail</td></tr>
<tr><td>Two roof faces, east and west</td><td>String inverter with two MPPTs</td><td>Each face tracks separately, no need for module level electronics</td></tr>
<tr><td>Broken roof, dormers, unavoidable partial shade</td><td>Microinverters or optimisers</td><td>Loss is contained to the affected module instead of the string</td></tr>
<tr><td>Owner wants to start at 2 kW and grow</td><td>Microinverters</td><td>Expansion is one module at a time, with no restringing</td></tr>
<tr><td>Frequent long outages and a real backup need</td><td>Hybrid with battery</td><td>Only topology that keeps selected circuits alive</td></tr>
</tbody>
</table>
<h2>What a hybrid inverter actually needs</h2>
<p>A hybrid is not simply an inverter with an extra socket. To give backup it needs a separate protected output feeding a dedicated backup distribution board with only the circuits the battery can carry, and it needs a changeover arrangement that guarantees the backup output is isolated from the grid while the grid is down. Fitting a hybrid and connecting the whole house to the backup output produces an inverter that overloads and shuts down the first time the borewell pump starts.</p>
<h2>Grid protection you will be asked about at inspection</h2>
<p>The inverter must disconnect on grid loss, on voltage outside the permitted band and on frequency outside the permitted band, and it must not reconnect until the supply has been stable for the required interval. Anti islanding testing to the relevant standard, and the certificate that goes with it, is part of the file the DISCOM reviews, so keep the test report with the model documentation rather than in a folder at the office.</p>`,
      Advanced: `<p>The inverter is where an installer's decisions become visible in monitoring data, so the arguments about topology are settled by looking at the right numbers rather than at the brochure.</p>
<h2>Efficiency figures and which one to believe</h2>
<p>A datasheet quotes a peak efficiency, often 98 percent or better, and a weighted efficiency, the European or CEC figure, that samples the whole load range. The weighted number is the honest one, because a rooftop inverter spends most of the year between 20 and 60 percent of its rating. An inverter with a high peak and a poor weighted figure is optimised for a condition your customer's roof will rarely reach.</p>
<p>Two more numbers are worth reading and rarely are. Night time self consumption, a few watts, runs every night for twenty five years. Start voltage, distinct from the bottom of the MPPT window, decides how early in the morning the plant wakes up; on a string sized near the lower limit the difference between a 120 V and a 180 V start voltage is real morning energy.</p>
<h2>Derating is a design input, not a fault</h2>
<p>Inverters are rated at an ambient temperature and derate above it, typically from around 45 C. On a west facing wall in Suryapet in May, an inverter that meets its rating on paper will spend the peak hours reducing its own output. Mount it on a shaded north wall, keep the manufacturer's clearances above, below and to the sides, and never inside a closed meter cupboard. If the only available wall is exposed, build a ventilated hood that stands clear of the heat sink rather than a box that traps air against it.</p>
<h2>Module level electronics, the fair case</h2>
<ul>
<li><strong>They earn their cost where shade is unavoidable and irregular.</strong> On an unshaded terrace they add cost, add failure points on the roof, and add nothing measurable.</li>
<li><strong>They remove high voltage DC from the roof.</strong> With microinverters the rooftop wiring is AC, which changes the whole fire and maintenance risk picture and is a genuine safety argument, not a marketing one.</li>
<li><strong>They make monitoring per module possible.</strong> That is how a failed module in a 30 module array is found in a minute rather than in an afternoon.</li>
<li><strong>They put electronics under the modules.</strong> Replacing a failed unit means lifting a module, on a roof, years later, with the array live. Service access must be designed in, not discovered.</li>
<li><strong>They are constrained by the AC trunk.</strong> The number of microinverters on one branch is limited by the branch conductor and its breaker, and exceeding it is a common shortcut.</li>
</ul>
<h2>Field faults and what they mean</h2>
<table>
<thead><tr><th>Symptom</th><th>Usual cause</th><th>First check</th></tr></thead>
<tbody>
<tr><td>Isolation fault or riso alarm at dawn, clears by mid morning</td><td>Moisture in a connector or a damaged cable at a sharp edge</td><td>Insulation resistance on each string before sunrise</td></tr>
<tr><td>Grid overvoltage trips at midday only</td><td>Voltage rise along an undersized or long AC cable at high export</td><td>Measure at the inverter and at the board while exporting</td></tr>
<tr><td>Output flat topped at exactly the AC rating</td><td>Normal clipping on an intentionally oversized array</td><td>Compare against the design DC to AC ratio, not against nameplate</td></tr>
<tr><td>One MPPT reports far less than the other</td><td>A string not connected, a blown string fuse, or a shaded face</td><td>String Voc and clamp current on each input</td></tr>
<tr><td>Plant starts late and stops early</td><td>String too short, so the array is below the start voltage</td><td>Recount modules per string against the datasheet window</td></tr>
</tbody>
</table>
<p>The last row is the one that should never leave the design stage. A string that is legal in November and drops out of the window on a hot April afternoon was sized at STC instead of at temperature extremes, and the customer loses the best hours of the best month.</p>`,
      Expert: `<p>Inverter selection card. Everything here is read off the datasheet before a single clamp is bought.</p>
<h2>Datasheet fields in the order you use them</h2>
<table>
<thead><tr><th>Field</th><th>Used for</th></tr></thead>
<tbody>
<tr><td>Max DC input voltage</td><td>Cold Voc check, absolute damage limit</td></tr>
<tr><td>MPPT voltage range</td><td>Hot Vmp check at the bottom, tracking limit at the top</td></tr>
<tr><td>Start voltage</td><td>How early the plant wakes</td></tr>
<tr><td>Max input current per MPPT</td><td>Strings in parallel per tracker</td></tr>
<tr><td>Max short circuit current per MPPT</td><td>Protection and fuse coordination</td></tr>
<tr><td>Number of MPPTs and strings per MPPT</td><td>Splitting faces and shaded groups</td></tr>
<tr><td>Rated and maximum AC power</td><td>Array size ceiling, DISCOM sanction</td></tr>
<tr><td>Weighted efficiency</td><td>Honest annual comparison between models</td></tr>
<tr><td>Ambient derating point</td><td>Where it may be mounted</td></tr>
<tr><td>IP rating and altitude</td><td>Outdoor mounting, hill sites</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>Cold Voc against max DC input. Hot Vmp against MPPT minimum. Both, every time.</li>
<li>One tracker per roof orientation, and one tracker per shading group, wherever the inverter allows it.</li>
<li>A grid tied inverter is dark in an outage by design. Say so before handover.</li>
<li>A hybrid without a dedicated backup board is a hybrid that trips on the first pump start.</li>
<li>Weighted efficiency beats peak efficiency for choosing between models.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>An inverter with two MPPTs of unequal current rating exists, and the larger string must go on the larger tracker. The datasheet says which is which and installers assume they are identical.</li>
<li>Single phase inverters above a certain size may not be permitted on a three phase service because of injection imbalance limits, and the limit is set by the DISCOM.</li>
<li>Rooftop AC wiring for microinverters is still live when the grid is off only for the moment the units take to shut down; treat it as live until measured.</li>
<li>A DC isolator integrated into the inverter does not remove the requirement for isolation at the array where the regulations or the DISCOM ask for it.</li>
<li>Firmware settings for grid voltage and frequency limits are region specific. An inverter shipped on a default profile can nuisance trip until the correct country setting is applied.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "An inverter has a maximum DC input voltage of 600 V and an MPPT range of 160 V to 550 V. Which check is done against the 600 V figure?",
        options: [
          "The array Vmp on the hottest afternoon",
          "The array Voc on the coldest bright morning",
          "The array Vmp at Standard Test Conditions",
          "The array Isc at maximum irradiance",
        ],
        answer: 1,
        explanation:
          "Maximum DC input voltage is a damage limit, and the highest voltage an array ever presents is its open circuit voltage on a cold bright morning, so that is the value checked against it. Checking Vmp at STC feels natural because it is the printed figure, but it is neither the highest voltage nor a worst case.",
        difficulty: "Medium",
        skill: "MPPT and tracker count",
      },
      {
        n: 2,
        question:
          "Why does a normal grid tied inverter shut down during a power cut, even in full sunshine?",
        options: [
          "It has no way to convert DC without a grid reference frequency to copy",
          "Anti islanding protection stops it energising a line that may be under repair",
          "Its internal fuse blows whenever the supply is interrupted",
          "It protects the modules from reverse current from the grid",
        ],
        answer: 1,
        explanation:
          "Anti islanding is a mandatory protection that disconnects the inverter within a fraction of a second of losing the grid, so a rooftop cannot back feed a line a crew is working on. The reference frequency answer is superficially plausible, but the real reason is a safety requirement checked at inspection rather than a technical inability to generate.",
        difficulty: "Easy",
        skill: "Anti islanding and grid protection",
      },
      {
        n: 3,
        question:
          "A house has modules on an east facing slope and on a west facing slope. What is the simplest correct arrangement?",
        options: [
          "Wire all modules into one string on one MPPT",
          "Use one string inverter and put each face on its own MPPT",
          "Use two separate inverters, one per face, on separate meters",
          "Use a hybrid inverter so the battery smooths the difference",
        ],
        answer: 1,
        explanation:
          "Each face reaches its maximum power point at a different time and voltage, so giving each its own tracker lets both work properly with one inexpensive inverter. Wiring both faces into one string forces the whole array to a single operating point and throws away energy on whichever face is not favoured at that moment.",
        difficulty: "Medium",
        skill: "String inverter topology",
      },
      {
        n: 4,
        question:
          "A plant starts producing late in the morning and stops early in the evening, and generation is poor on hot afternoons. What is the most likely design error?",
        options: [
          "The AC cable is undersized so the inverter trips on overvoltage",
          "The string has too few modules, so the array falls below the MPPT window",
          "The modules were mounted at too steep a tilt",
          "The inverter is oversized relative to the array",
        ],
        answer: 1,
        explanation:
          "A short string sits near the bottom of the tracking window, and since Vmp falls with heat and with low light the array drops out of the window early, late and on hot afternoons. Undersized AC cable does cause trips, but those appear as overvoltage faults at high export around midday rather than as a plant that simply wakes late.",
        difficulty: "Hard",
        skill: "MPPT and tracker count",
      },
      {
        n: 5,
        question:
          "On which roof do microinverters or optimisers genuinely earn their extra cost?",
        options: [
          "A clean rectangular terrace facing due south with no obstructions",
          "A broken roof with dormers and unavoidable irregular shading",
          "Any roof, because module level electronics always increase yield",
          "A roof where the owner wants the lowest possible capital cost",
        ],
        answer: 1,
        explanation:
          "Module level electronics contain a loss to the affected module instead of letting it drag a whole string, which is worth paying for only where shading is irregular and unavoidable. Claiming they always increase yield is the marketing position, and on an unshaded terrace they add cost and add failure points on the roof for no measurable gain.",
        difficulty: "Medium",
        skill: "Module level power electronics",
      },
      {
        n: 6,
        question:
          "A hybrid inverter is fitted and the entire house distribution board is connected to its backup output. What happens during an outage?",
        options: [
          "The battery discharges more slowly because the load is spread out",
          "The inverter overloads and shuts down when a large load such as a pump starts",
          "The inverter automatically sheds the largest loads and continues",
          "The grid connection is maintained through the backup output",
        ],
        answer: 1,
        explanation:
          "A backup output can only carry what the inverter and battery can supply, so connecting the whole house means the first heavy motor start exceeds it and the unit shuts down. Automatic load shedding is the comfortable assumption, but a hybrid needs a dedicated backup board holding only the circuits it can actually carry.",
        difficulty: "Hard",
        skill: "Hybrid and off grid inverters",
      },
      {
        n: 7,
        question:
          "When comparing two inverters, why is the weighted efficiency figure more useful than the peak efficiency?",
        options: [
          "Peak efficiency is measured at a different voltage from the one used on site",
          "Weighted efficiency samples the whole load range, where a rooftop inverter actually spends the year",
          "Peak efficiency includes the night time self consumption",
          "Weighted efficiency is measured after the warranty period",
        ],
        answer: 1,
        explanation:
          "A rooftop inverter runs between roughly 20 and 60 percent of its rating for most of the year, so the weighted European or CEC figure describes real operation while the peak figure describes one favourable point. Night consumption is a separate line on the datasheet and is not folded into either efficiency number.",
        difficulty: "Medium",
        skill: "Inverter efficiency and derating",
      },
    ],
  },
  31106: {
    topicId: 31106,
    title: "Rails, cables, connectors and the combiner box",
    summary:
      "Between the module frame and the inverter terminal sits every item that a rushed installation gets wrong: the wrong clamp position, house wire on a roof, a hand crimped connector and a cable loop waiting for a lightning surge. You learn the correct materials, the crimping method and the voltage drop arithmetic that decides cable size.",
    concepts: [
      "Mounting rails and clamps",
      "Solar DC cable selection",
      "MC4 connectors and crimping",
      "Voltage drop calculation",
      "Cable routing and loop area",
      "Array junction and combiner box",
    ],
    glossary: {
      "Mid clamp":
        "The clamp that holds two neighbouring modules to the same rail, gripping the edge of each frame. End clamps do the same job at the two ends of a row.",
      "Clamping zone":
        "The band along a module frame, marked in the installation manual, within which clamps may be placed. Clamping outside it voids the mechanical load rating and the warranty.",
      "Solar DC cable":
        "Single core, double insulated cable made for photovoltaic use, commonly designated H1Z2Z2-K, rated for 1.5 kV DC, tested for ultraviolet, ozone and a 90 C continuous conductor temperature.",
      "MC4 connector":
        "The weather sealed plug and socket pair used on module leads. It is crimped, not soldered, and connectors from different makes must never be mated even when they fit.",
      "Voltage drop":
        "The volts lost in the resistance of the cable itself, which appear as heat rather than as energy at the inverter. It rises with length and with current and falls as conductor area increases.",
      "Combiner box":
        "An enclosure where several strings are joined in parallel, usually holding string fuses, a surge protection device and a DC isolator, so that one pair of cables continues to the inverter.",
    },
    body: {
      Beginner: `<p>This topic is about the parts between the module and the inverter. None of them look important. All of them are what an inspector and a monsoon will find first.</p>
<h2>Rails and clamps</h2>
<p>Modules sit on aluminium <strong>rails</strong>. Two clamps hold each module edge down onto the rail. A <strong>mid clamp</strong> sits between two modules and grips both. An <strong>end clamp</strong> sits at the end of a row and grips one.</p>
<p>Clamps may only go in the marked band on the module frame, which the installation manual shows. Put a clamp in the wrong place and the module is no longer rated for the wind load it was tested at, and the warranty is gone. Tighten to the torque the manufacturer states, using a torque spanner, not by feel. Overtightening bends the frame and cracks cells.</p>
<h2>Cable</h2>
<p>Use proper <strong>solar DC cable</strong>. It is single core, has two layers of insulation, and is made to survive sun, heat and rain for twenty five years. Ordinary house wire on a roof goes brittle in about two summers and then it is a bare conductor at several hundred volts on a metal structure.</p>
<p>Two sizes cover most household work: 4 square millimetre and 6 square millimetre copper. Which one you use depends on how long the run is, and that is a calculation, not a guess.</p>
<h2>Connectors</h2>
<p>Module leads end in <strong>MC4 style connectors</strong>. They are crimped with the correct tool and then pushed together until they click. Three rules that are not negotiable:</p>
<ul>
<li>Use one make of connector throughout. Two makes can push together and still make a poor joint that heats up and eventually burns.</li>
<li>Crimp, never solder or twist. A crimp made with pliers instead of the proper tool is a future fault.</li>
<li>Never pull a connector apart while current is flowing. Open the DC isolator first.</li>
</ul>
<h2>Routing</h2>
<p>Cables are tied up under the modules, in UV resistant ties or a tray, never lying on the roof where water stands. Keep the positive and negative wire of a string running together side by side. If you take them on separate paths around the array they enclose a large loop, and a nearby lightning strike will push a surge into that loop.</p>
<h2>The combiner box</h2>
<p>When more than two strings are joined together, they meet in a weatherproof box on the wall. Inside are the string fuses, a surge protection device and a DC isolator, and one pair of cables leaves for the inverter. Label everything inside it, because the next person to open it may be you, in five years, in the rain.</p>`,
      Intermediate: `<p>Balance of system components are chosen by calculation and installed to a torque figure. Where that discipline is missing you get a plant that works for one season and then produces a fault report nobody can trace.</p>
<h2>Sizing DC cable by voltage drop</h2>
<p>Cable is chosen for two limits: it must carry the current safely, and it must not lose too much of the voltage on the way. In practice on a rooftop the current limit is easily satisfied and the voltage drop limit is the one that decides the size. Aim for under about 2 percent on the DC side, and remember that Indian wiring practice under IS 732 also caps total drop from the origin of the installation to any point.</p>
<p>The formula for a two wire run is drop equals 2 multiplied by length multiplied by current multiplied by resistivity, divided by conductor area. Use a hot resistivity for copper of about 0.0225 ohm square millimetre per metre rather than the 20 C figure, because a cable clipped under modules in May runs hot.</p>
<p>Worked example. One string of eight modules, Imp 13.0 A, Vmp at STC 334 V, cable run 25 m from the far end of the array to the inverter, 4 square millimetre copper.</p>
<ul>
<li>Drop equals 2 multiplied by 25 multiplied by 13.0 multiplied by 0.0225, divided by 4.</li>
<li>Numerator: 2 multiplied by 25 is 50, multiplied by 13.0 is 650, multiplied by 0.0225 is 14.63.</li>
<li>Divide by 4: 3.66 V.</li>
<li>As a percentage of 334 V, that is 1.1 percent. Acceptable.</li>
</ul>
<p>Check it the other way as power. Loop resistance is 2 multiplied by 25 multiplied by 0.0225 divided by 4, which is 0.281 ohm. Loss is current squared multiplied by resistance, 169 multiplied by 0.281, which is 47 W out of about 4,360 W, again 1.1 percent. Two methods agreeing is a good habit on site.</p>
<p>Now try 2.5 square millimetre on the same run: the drop rises to 5.85 V, which is 1.75 percent, and the cable is closer to its thermal limit under modules. Now try a 45 m run on 4 square millimetre: 6.6 V, about 2 percent, so you move to 6 square millimetre. The rule is simple: long runs go up a size.</p>
<h2>Crimping properly</h2>
<ol>
<li>Strip to the length the connector maker states, usually 6 to 7 mm, without nicking a strand.</li>
<li>Use the crimping tool made for that connector and that cable size. A general purpose lug crimper leaves a joint that passes a tug test and fails in year three.</li>
<li>Check the crimp visually: all strands inside the barrel, no copper showing beyond it.</li>
<li>Push the barrel into the housing until it clicks, then tighten the gland nut with the correct spanner.</li>
<li>Pull test each finished connector by hand before it goes on the roof.</li>
</ol>
<h2>The combiner box, and when you need one</h2>
<p>A single string on a single MPPT needs no combiner. Two strings on two trackers usually need none either, since each goes to its own input. A combiner earns its place when three or more strings are paralleled, because a fault in one string can then be fed by the others, and that is what string fuses are there to interrupt. The enclosure should be at least IP65, mounted out of direct sun, with cable entries from below through proper glands, never through a hole with tape over it.</p>
<h2>Rails and mechanical detail</h2>
<p>Rails run across the module width for a portrait layout, positioned inside the clamping zones from the manual. Leave a small expansion gap between modules, typically 10 to 20 mm as the structure supplier specifies, because aluminium in Telangana moves between a January dawn and an April afternoon. Use stainless steel fasteners against aluminium rails, and keep dissimilar metals apart where the manual asks for it, since a galvanised bolt in a coastal or industrial atmosphere corrodes at the joint you cannot see.</p>`,
      Advanced: `<p>Almost every recurring rooftop fault has its origin in this topic, and the ones that burn have their origin in connectors.</p>
<h2>Why connector mixing is the fire risk it is</h2>
<p>Connector bodies from different makes often mate mechanically because the outline is copied, but the contact geometry inside is not. The result is a joint with a small contact area carrying 13 A continuously. Resistance rises, the joint heats, the plastic relaxes, contact area falls further, and the process runs away. It ends as an arc inside a sealed plastic body sitting on a roof under a module. This is the single most common cause of rooftop DC fires, it is entirely preventable, and it is invisible on any electrical test because the joint measures fine when cold and lightly loaded. Keep one make on site. Where an existing array must be extended, replace the connector pair rather than mating a new brand to an old one.</p>
<h2>Loop area and induced surge</h2>
<p>Lightning does not have to hit the building. A strike within a few hundred metres induces a voltage in any conducting loop, and that voltage is proportional to the area the loop encloses and to how fast the strike current changes. A string wired with the positive and negative cables taken around opposite sides of the array encloses tens of square metres. The same string with the two cables tied together along one path encloses almost nothing.</p>
<ul>
<li>Run string positive and negative together for their whole length, tied at short intervals.</li>
<li>Bring string cables back to the same point rather than looping the array.</li>
<li>Keep the DC run away from any down conductor of a lightning protection system, at the separation distance the design calls for.</li>
<li>Where a large loop is unavoidable, surge protection at both ends of the run becomes necessary rather than optional.</li>
</ul>
<h2>Failure survey, ranked by how often you will meet it</h2>
<table>
<thead><tr><th>Fault</th><th>Root cause</th><th>Symptom on site</th></tr></thead>
<tbody>
<tr><td>Heated or burnt connector</td><td>Mixed brands, or a pliers crimp</td><td>Discolouration, melted housing, string missing at the inverter</td></tr>
<tr><td>Insulation resistance alarm after rain</td><td>Cable chafed on a rail edge or a sharp sheet edge</td><td>Fault at dawn, clears when the roof dries</td></tr>
<tr><td>Loose module in wind</td><td>Clamp outside the zone, or untorqued</td><td>Rattle, elongated clamp marks, cracked cell pattern later</td></tr>
<tr><td>Water in the combiner box</td><td>Top entry, missing gland, or an unused entry left open</td><td>Corroded fuse holders, tripped surge device</td></tr>
<tr><td>Cable insulation cracked and brittle</td><td>House PVC wire used outdoors</td><td>Two to three years after commissioning, often at the first bend</td></tr>
<tr><td>Rodent damage</td><td>Cable lying loose on the terrace</td><td>Intermittent string loss, chewed sheath under the array</td></tr>
</tbody>
</table>
<h2>The details that pass or fail an inspection</h2>
<ol>
<li>Cable type marking legible on the sheath, showing the PV designation and the 1.5 kV DC rating.</li>
<li>Bend radius respected, at least four times the cable outer diameter, particularly at the entry to the combiner box.</li>
<li>Every unused enclosure entry blanked, every used one glanded and tightened.</li>
<li>Drip loops before every entry, so water runs off the cable rather than into the gland.</li>
<li>String labels at both ends of every run, printed and UV stable, not marker pen on tape.</li>
<li>Frame and rail earthing continuity, measured and recorded, with the bonding hardware the module manual specifies rather than a self tapping screw through paint.</li>
<li>Torque marks on clamp fasteners, so a later inspection can see which have been checked.</li>
</ol>
<p>An installation that satisfies this list looks the same on day one as an installation that does not. It looks completely different in year five, and that is the whole argument for doing it.</p>`,
      Expert: `<p>Balance of system card. Sizes and torques are typical; the component manual on the job always overrides.</p>
<h2>Cable sizing quick table, one string at 13 A</h2>
<table>
<thead><tr><th>Run length one way</th><th>4 sq mm drop</th><th>6 sq mm drop</th><th>Choose</th></tr></thead>
<tbody>
<tr><td>15 m</td><td>2.2 V</td><td>1.5 V</td><td>4 sq mm</td></tr>
<tr><td>25 m</td><td>3.7 V</td><td>2.4 V</td><td>4 sq mm</td></tr>
<tr><td>35 m</td><td>5.1 V</td><td>3.4 V</td><td>4 sq mm, watch the total</td></tr>
<tr><td>45 m</td><td>6.6 V</td><td>4.4 V</td><td>6 sq mm</td></tr>
<tr><td>60 m</td><td>8.8 V</td><td>5.9 V</td><td>6 sq mm minimum</td></tr>
</tbody>
</table>
<h2>Formulae and constants</h2>
<ul>
<li>Drop equals 2 L I rho divided by A, with rho about 0.0225 ohm sq mm per metre for hot copper.</li>
<li>Loop resistance equals 2 L rho divided by A. Loss equals I squared multiplied by that resistance.</li>
<li>Target under 2 percent on the DC side, and keep the whole installation within the IS 732 total drop limits.</li>
<li>Minimum bend radius, four times the cable outer diameter.</li>
<li>Aluminium expansion gap between modules, typically 10 to 20 mm per the structure supplier.</li>
</ul>
<h2>Ten point pre-cover checklist</h2>
<ol>
<li>One make of connector across the whole array.</li>
<li>Every crimp made with the matching tool, pull tested.</li>
<li>Positive and negative of each string tied together along one path.</li>
<li>No cable touching the roof surface or standing water.</li>
<li>UV rated ties or clips, no household nylon ties.</li>
<li>Clamps inside the marked zone, torqued and marked.</li>
<li>Combiner box IP65, entries from below, all glands tight.</li>
<li>String labels at both ends, printed.</li>
<li>Earth continuity on rails and frames measured and written down.</li>
<li>Photographs of the completed cable route before the modules are finally seated.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A long run where 6 sq mm still misses the target is usually telling you the inverter is in the wrong place, not that the cable is wrong.</li>
<li>Aluminium DC cable saves money on a large plant and is not appropriate for a rooftop string, where terminations and vibration dominate.</li>
<li>Two strings of unequal length on one tracker will not share exactly, so keep paralleled strings the same length and orientation.</li>
<li>A connector that has been under water is replaced, not dried. Sealed water inside the housing is a slow fault.</li>
<li>Cable ties tightened until they bite the sheath are the origin of many later insulation faults; snug, not cutting.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A string carries 13 A over a 25 m run in 4 square millimetre copper, with hot resistivity 0.0225 ohm sq mm per metre. What is the voltage drop?",
        options: ["1.8 V", "3.7 V", "7.3 V", "14.6 V"],
        answer: 1,
        explanation:
          "Drop equals 2 x 25 x 13 x 0.0225 divided by 4, which is 14.63 divided by 4, that is about 3.7 V. Answering 14.6 V means the division by the conductor area was left out, and forgetting the factor of 2 for the return conductor gives 1.8 V, which is the other common slip.",
        difficulty: "Medium",
        skill: "Voltage drop calculation",
      },
      {
        n: 2,
        question:
          "Why must connectors from two different manufacturers never be mated, even when they push together and click?",
        options: [
          "The colour coding differs and the polarity may be reversed",
          "The internal contact geometry differs, giving a small contact area that heats and can arc",
          "Warranty terms forbid it although the joint is electrically sound",
          "Different makes use different voltage ratings so the lower one governs",
        ],
        answer: 1,
        explanation:
          "Mated connectors from different makes touch over a smaller area than designed, so resistance and heat rise, contact pressure relaxes further and the joint can end in an arc under a module. The warranty answer is tempting because it is also true, but the reason it is forbidden is a physical failure mode that no cold electrical test will reveal.",
        difficulty: "Hard",
        skill: "MC4 connectors and crimping",
      },
      {
        n: 3,
        question:
          "Why should the positive and negative cables of a string be run together along the same path?",
        options: [
          "It reduces the total cable length and therefore the voltage drop",
          "It keeps the enclosed loop area small, so a nearby lightning strike induces less surge voltage",
          "It allows a single cable tie to carry both conductors",
          "It prevents the two conductors from being at different temperatures",
        ],
        answer: 1,
        explanation:
          "A loop enclosing a large area collects induced voltage from a nearby strike in proportion to that area, so keeping the two conductors together shrinks the loop to almost nothing. Reducing cable length is a real benefit of tidy routing but it is not the reason, since the run length is set by the distance to the inverter either way.",
        difficulty: "Medium",
        skill: "Cable routing and loop area",
      },
      {
        n: 4,
        question:
          "Ordinary PVC insulated house wiring cable has been used to connect a rooftop array. What is the expected outcome?",
        options: [
          "It performs the same as solar cable but is not permitted on paper",
          "The insulation goes brittle and cracks within a few summers, exposing a live conductor on a metal structure",
          "It causes an immediate insulation resistance failure at commissioning",
          "It works until the first monsoon and then short circuits",
        ],
        answer: 1,
        explanation:
          "House PVC is not rated for continuous ultraviolet exposure or for the temperatures under a module, so it degrades over two or three summers and cracks, typically at a bend, leaving several hundred volts DC near an earthed frame. It usually passes commissioning tests, which is exactly why the substitution survives handover and fails years later.",
        difficulty: "Easy",
        skill: "Solar DC cable selection",
      },
      {
        n: 5,
        question: "When does a rooftop installation actually need a combiner box?",
        options: [
          "Whenever the array exceeds 3 kWp",
          "When three or more strings are joined in parallel, so a faulted string can be fed by the others",
          "On every installation, as a place to mount the inverter display",
          "Only when the inverter has a single MPPT",
        ],
        answer: 1,
        explanation:
          "String fuses exist because parallel strings can push fault current back into a faulted one, and that only becomes a concern once three or more strings share a pair of conductors. Tying the requirement to array size in kWp is a plausible-sounding rule but it ignores the actual mechanism, since two strings on two trackers need no combiner at any size.",
        difficulty: "Medium",
        skill: "Array junction and combiner box",
      },
      {
        n: 6,
        question:
          "A clamp has been fitted 100 mm outside the clamping zone marked in the module installation manual. What is the consequence?",
        options: [
          "None, provided the clamp is torqued correctly",
          "The module loses its tested mechanical load rating and the warranty position",
          "The module output falls by the shaded area of the clamp",
          "The rail must be earthed at that point instead",
        ],
        answer: 1,
        explanation:
          "Mechanical load ratings are tested at the clamping positions given in the manual, so a clamp outside that band changes how wind and snow loads are carried into the frame and voids the tested rating. Correct torque does not rescue it, because the problem is where the load is applied rather than how tight the fastener is.",
        difficulty: "Medium",
        skill: "Mounting rails and clamps",
      },
      {
        n: 7,
        question:
          "The same 13 A string is run over 45 m instead of 25 m. What should you do about cable size?",
        options: [
          "Keep 4 square millimetre, since the current has not changed",
          "Move to 6 square millimetre, because drop rises with length and 4 sq mm reaches about 2 percent",
          "Drop to 2.5 square millimetre and accept the loss",
          "Split the run into two parallel 4 square millimetre cables per pole",
        ],
        answer: 1,
        explanation:
          "Voltage drop is proportional to length, so 45 m in 4 sq mm gives about 6.6 V, close to 2 percent of the string voltage, and moving up to 6 sq mm brings it back to about 4.4 V. Keeping 4 sq mm because the current is unchanged ignores that the drop limit, not the current rating, is what governs on a rooftop run.",
        difficulty: "Hard",
        skill: "Voltage drop calculation",
      },
    ],
  },
  31107: {
    topicId: 31107,
    title: "Batteries, and when a rural site actually needs them",
    summary:
      "On a grid connected house with net metering the grid is already the battery, so the honest answer is usually no. This topic teaches you to identify the sites where storage is genuinely justified, to size a bank from the load rather than from a sales chart, and to install and dispose of it without harming anyone.",
    concepts: [
      "Battery chemistry and cycle life",
      "Depth of discharge and usable capacity",
      "Autonomy and critical load assessment",
      "Charge control and coupling",
      "Battery bank sizing",
      "Battery safety, ventilation and disposal",
    ],
    glossary: {
      "Depth of discharge":
        "How much of a battery's rated capacity is taken out before recharging, as a percentage. Deeper discharge gives more usable energy per cycle and fewer cycles before the battery is finished.",
      "Ampere hour":
        "The capacity unit printed on a battery, written Ah. Multiply it by the nominal voltage to get energy in watt hours, so 100 Ah at 24 V is 2,400 Wh.",
      "C rate":
        "Charge or discharge current expressed as a fraction of capacity. For a 100 Ah battery, C/10 is 10 A, which is the gentle rate a tubular lead acid bank prefers.",
      "Tubular lead acid":
        "The deep cycle flooded battery common in Indian inverter systems. It tolerates regular discharge, needs distilled water topping up, and vents hydrogen while charging.",
      "Lithium iron phosphate":
        "A lithium chemistry, written LFP, with a long cycle life, high round trip efficiency, deep usable discharge and a mandatory battery management system. It needs no watering.",
      "Round trip efficiency":
        "Energy taken out divided by energy put in over one charge and discharge. Roughly 0.80 for lead acid and about 0.95 for LFP, and it is the loss the array has to make up.",
      Autonomy:
        "The number of days the bank must run the critical load with no useful charging, which is what turns a load list into a battery size.",
    },
    body: {
      Beginner: `<p>Customers ask for a battery because they think solar means power in a cut. On a normal house with net metering it does not, and it usually should not. The grid already stores the surplus for them and gives it back at night through the meter. A battery adds cost, adds maintenance, and wears out long before the modules do.</p>
<h2>So when is a battery right</h2>
<ul>
<li>There is no grid, or the line reaches the habitation and fails for hours every day.</li>
<li>Something must not stop: a vaccine refrigerator at a health sub centre, a milk chiller, a poultry brooder, a water pump the village depends on.</li>
<li>The site is a standalone item with no connection at all, such as a street light or a farm shed.</li>
</ul>
<p>If none of those apply, say so. A customer who is talked into a battery they did not need will remember it when it needs replacing.</p>
<h2>The two chemistries you will meet</h2>
<p><strong>Tubular lead acid</strong> is the familiar tall battery in a trolley. It is cheaper to buy, needs distilled water topped up every few months, gives off hydrogen gas while charging, and lasts longer if you only take about half its capacity out each night.</p>
<p><strong>Lithium iron phosphate</strong>, written LFP, is a sealed box with electronics inside. It costs more to buy, needs no water, can be discharged much deeper, and lasts for many more cycles. Over the life of the system it often works out cheaper per unit stored.</p>
<h2>Usable capacity is not rated capacity</h2>
<p>A 100 Ah tubular battery at 24 V holds 2,400 Wh on paper. If you may only take half of it out, the usable energy is 1,200 Wh. Then the inverter loses some in conversion, so about 1,000 Wh actually reaches the lamps and fans. Always quote the usable figure to the customer, never the label figure.</p>
<h2>Safety on installation day</h2>
<ul>
<li>A flooded battery gives off hydrogen. Never put it in a sealed cupboard, under a bed, or in a bedroom. It needs a ventilated space.</li>
<li>A battery cannot be switched off. Short its terminals with a spanner and it will deliver thousands of amperes, weld the spanner and spray molten metal.</li>
<li>Fit a fuse or a breaker in the battery cable, as close to the battery terminal as possible.</li>
<li>Wear eye protection when handling a flooded battery. The electrolyte is acid.</li>
<li>Never mix a new battery with an old one, and never mix two chemistries in one bank.</li>
</ul>`,
      Intermediate: `<p>Battery work is where a solar technician most often gives bad advice, because the sale is easy and the sizing is invisible until the first monsoon week. Do the load assessment first, in writing, and let the arithmetic decide.</p>
<h2>Step one, list the critical load only</h2>
<p>Storage is priced by the kilowatt hour, so you back up what must not stop, not what happens to be plugged in. A small rural household backup list looks like this:</p>
<ul>
<li>Four LED lamps, 9 W each, five hours: 180 Wh.</li>
<li>Two ceiling fans, 50 W each, six hours: 600 Wh.</li>
<li>Television, 60 W, three hours: 180 Wh.</li>
<li>Phone charging and a mixer for a few minutes: about 40 Wh.</li>
<li>Total: about 1,000 Wh, that is 1.0 kWh a day.</li>
</ul>
<p>Notice what is absent. A refrigerator, a borewell pump, an iron and an air conditioner are not on the list, and if the customer wants them the number changes by a factor of five and so does the price.</p>
<h2>Step two, size the bank</h2>
<p>Take the same 1.0 kWh with one day of autonomy on a tubular lead acid bank.</p>
<ul>
<li>Inverter conversion at 0.85: energy that must leave the battery is 1.0 divided by 0.85, which is 1.18 kWh.</li>
<li>Depth of discharge limited to 50 percent: rated capacity is 1.18 divided by 0.5, which is 2.36 kWh.</li>
<li>At 24 V nominal: 2,360 divided by 24 gives 98 Ah, so two 12 V 100 Ah tubular batteries in series.</li>
</ul>
<p>Run the same load on LFP at 80 percent usable: 1.18 divided by 0.8 is 1.48 kWh, so a 1.5 kWh LFP unit. Half the rated capacity for the same delivered energy, which is why comparing the two on rated kWh alone is meaningless.</p>
<h2>Step three, size the array to refill it</h2>
<p>The array has to replace what was used plus the round trip loss. With lead acid at 0.80 round trip and some charge controller loss, about 1.4 kWh must be generated for the battery path alone. At roughly 3.9 units per kWp per day in Telangana that is 0.36 kWp, so on paper one 400 W module would do it.</p>
<p>Do not build it that way. Off grid sizing is done for the bad week, not the average day, so you take a monsoon derate and land at roughly double: 0.7 to 0.8 kWp, two modules. A bank that never reaches full charge in the monsoon sulphates and dies early, and the customer blames the battery.</p>
<h2>Charge control and how the battery is coupled</h2>
<p>An off grid system charges through an MPPT charge controller, which does for the battery what the inverter's tracker does for a grid tied array. A grid connected site with storage uses a hybrid inverter instead, with the battery on its own DC port. Two rules hold in both cases: charge current should suit the bank, around C/10 for tubular lead acid and higher for LFP within the maker's limit, and the controller must be set to the correct chemistry and voltage profile. A controller left on its default lead acid profile will not charge an LFP bank correctly, and the bank will never reach the capacity that was paid for.</p>
<h2>Disposal is part of the job</h2>
<p>Lead acid batteries are hazardous waste. Under the Battery Waste Management Rules the producer is obliged to take them back and they must reach an authorised recycler, not the scrap dealer at the corner. Record what you removed, from where, and where it went. This is asked for in scheme funded installations and it is the right thing to do regardless.</p>`,
      Advanced: `<p>The interesting decisions in storage are commercial and behavioural, not electrical. The electrical part is arithmetic you already have.</p>
<h2>Chemistry comparison as an installer sees it</h2>
<table>
<thead><tr><th>Property</th><th>Tubular lead acid</th><th>LFP</th></tr></thead>
<tbody>
<tr><td>Usable depth of discharge</td><td>50 percent, 60 at a push</td><td>80 to 90 percent</td></tr>
<tr><td>Cycle life at that depth</td><td>Roughly 1,200 to 1,800</td><td>Roughly 3,000 to 6,000</td></tr>
<tr><td>Round trip efficiency</td><td>About 0.80</td><td>About 0.95</td></tr>
<tr><td>Maintenance</td><td>Water topping, terminal cleaning, equalisation</td><td>None beyond monitoring</td></tr>
<tr><td>Temperature behaviour</td><td>Capacity and life both fall in sustained heat</td><td>Tolerant, but charging below freezing is prohibited</td></tr>
<tr><td>Failure mode</td><td>Gradual capacity loss, sulphation</td><td>Sudden, usually a management system lockout</td></tr>
<tr><td>Rural serviceability</td><td>Anyone can test and replace a cell</td><td>Needs the maker, and network coverage for the app</td></tr>
</tbody>
</table>
<p>The last row decides more installations in remote mandals than the first six. A technology nobody within eighty kilometres can service is a technology that will sit dead for a season.</p>
<h2>What actually kills batteries in the field</h2>
<ul>
<li><strong>Chronic undercharging.</strong> An array sized for the average day never fully recharges the bank in a cloudy week, and lead sulphate hardens on the plates. This is the leading cause of early lead acid failure and it is a design fault, not a product fault.</li>
<li><strong>Heat.</strong> A bank in an unventilated store room on a terrace in Mahbubnagar runs far above the temperature its life was rated at. Life falls steeply with sustained temperature.</li>
<li><strong>Load creep.</strong> The family adds a refrigerator to the backup circuit two years later. The bank now cycles far deeper than designed and fails in a year. Label the backup board with what it may carry.</li>
<li><strong>Parallel string imbalance.</strong> Two or three parallel strings of lead acid rarely share equally, and one string carries the work. Prefer a single higher voltage string over several parallel ones.</li>
<li><strong>Mixed ages.</strong> Adding one new battery to a three year old bank drags the new one down to the old one's condition, not the other way round.</li>
</ul>
<h2>The honest conversation about payback</h2>
<p>On a grid connected house under net metering, a battery does not create energy and it does not usually create savings. It buys availability during outages, and that is a real thing to want. Present it that way. Costing it as an investment invites the customer to compute a payback, and the arithmetic will not support the sale unless outages are severe or the tariff structure specifically rewards shifting consumption. Where storage genuinely pays in rural Telangana it is normally because the alternative is a diesel generator or a spoiled product, not because of the tariff.</p>
<h2>Installation details an inspector or an auditor looks for</h2>
<ol>
<li>Overcurrent protection within a short distance of the battery positive terminal, rated for the prospective short circuit current, and a means of isolation.</li>
<li>Correctly sized battery interconnects, since a bank at 24 V moving 1 kW is carrying over 40 A and undersized links run hot.</li>
<li>Ventilation for flooded chemistry at high level, and no ignition source in the enclosure.</li>
<li>Terminals torqued to the maker's figure and protected against corrosion, with insulated tools used throughout.</li>
<li>Chemistry and voltage profile set correctly in the charge controller or hybrid inverter, and recorded in the handover file.</li>
<li>A backup distribution board carrying only the circuits the bank was sized for, labelled as such.</li>
<li>Disposal documentation for any battery removed from site.</li>
</ol>`,
      Expert: `<p>Storage decision and sizing card.</p>
<h2>Decide first, size second</h2>
<table>
<thead><tr><th>Site</th><th>Storage justified</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Grid connected town house, net metered</td><td>No</td><td>The grid stores the surplus already</td></tr>
<tr><td>Habitation with daily long outages</td><td>Yes, small</td><td>Availability for lights and fans</td></tr>
<tr><td>Health sub centre with a vaccine refrigerator</td><td>Yes</td><td>Loss of cold chain is not recoverable</td></tr>
<tr><td>Milk collection or poultry brooder</td><td>Yes</td><td>Product and livestock loss</td></tr>
<tr><td>Street light or farm shed, no connection</td><td>Yes</td><td>Standalone by definition</td></tr>
<tr><td>House that wants an air conditioner in a cut</td><td>Rarely</td><td>Bank size and cost rise out of proportion</td></tr>
</tbody>
</table>
<h2>Sizing chain</h2>
<ul>
<li>Critical load Wh per day, listed item by item with hours.</li>
<li>Divide by inverter efficiency, about 0.85.</li>
<li>Multiply by days of autonomy.</li>
<li>Divide by usable depth of discharge: 0.5 for tubular lead acid, 0.8 for LFP.</li>
<li>Divide by nominal bank voltage to get Ah, or keep it in kWh for LFP.</li>
<li>Array for the battery path: daily load divided by round trip efficiency, then divided by units per kWp per day, then roughly doubled for the monsoon week.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Rated capacity is not usable capacity. Quote what the customer can actually take out.</li>
<li>Undercharging kills lead acid faster than overuse does. Size the array for the bad week.</li>
<li>One higher voltage string beats several parallel strings.</li>
<li>A battery has no off switch and a very low internal resistance. Fuse it at the terminal.</li>
<li>Flooded chemistry vents hydrogen. Ventilate, and keep ignition sources out.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>An LFP bank must not be charged below freezing, which matters for a hill or northern installation and rarely in Telangana.</li>
<li>A hybrid inverter in backup mode may need a neutral to earth bonding arrangement in the backup board that differs from grid mode; follow the maker's wiring diagram exactly.</li>
<li>Adding storage to an existing net metered plant can require the DISCOM to be informed, because the metering arrangement assumed no storage behind the meter.</li>
<li>A bank that reads full voltage at rest and collapses under load has lost capacity, not charge. Test with a load, not with a voltmeter alone.</li>
<li>Batteries removed from site are hazardous waste and go to an authorised recycler under the battery waste rules, with the paperwork retained.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A critical load of 1.0 kWh per day is to be backed up for one day on tubular lead acid, at 50 percent depth of discharge and 0.85 inverter efficiency. What rated bank capacity is needed?",
        options: ["1.18 kWh", "2.36 kWh", "0.59 kWh", "1.70 kWh"],
        answer: 1,
        explanation:
          "Divide the load by inverter efficiency to get 1.18 kWh out of the battery, then divide by the 0.5 usable depth to get 2.36 kWh of rated capacity. Stopping at 1.18 kWh is the common error, and a bank sized that way is discharged to nearly nothing every night and fails within a year or two.",
        difficulty: "Medium",
        skill: "Battery bank sizing",
      },
      {
        n: 2,
        question:
          "A grid connected house in a town with reliable supply and a net metering connection asks for a battery. What is the correct advice?",
        options: [
          "Fit a battery, because solar without storage wastes the daytime surplus",
          "Explain that the grid already stores the surplus, and that a battery buys outage availability rather than savings",
          "Fit a battery only if the roof is larger than 5 kWp",
          "Fit a battery because it will shorten the payback period",
        ],
        answer: 1,
        explanation:
          "Under net metering the exported surplus is credited and drawn back at night, so a battery adds capital and maintenance without creating energy, and what it genuinely buys is availability during outages. The idea that daytime surplus is wasted is the standard sales line and it is simply untrue on a net metered connection.",
        difficulty: "Easy",
        skill: "Autonomy and critical load assessment",
      },
      {
        n: 3,
        question:
          "A tubular lead acid bank in a village installation has lost most of its capacity in under two years. The load has not changed. What is the most likely design cause?",
        options: [
          "The inverter efficiency was overstated in the design",
          "The array was sized for an average day, so the bank never fully recharged in cloudy weeks and sulphated",
          "The batteries were connected in series instead of parallel",
          "The charge controller was an MPPT type rather than a simpler one",
        ],
        answer: 1,
        explanation:
          "Chronic undercharging hardens lead sulphate on the plates and is the leading cause of early lead acid failure, which is why off grid arrays are sized for the bad week rather than the average day. Series connection is normal and correct for raising bank voltage, so it is a distractor rather than a fault.",
        difficulty: "Hard",
        skill: "Battery chemistry and cycle life",
      },
      {
        n: 4,
        question:
          "Why must a flooded tubular battery never be installed in a sealed cupboard or a bedroom?",
        options: [
          "The battery needs light to charge correctly",
          "It vents hydrogen while charging, which can accumulate and ignite",
          "The enclosure would keep it too cool to accept charge",
          "Building rules require all batteries to be visible",
        ],
        answer: 1,
        explanation:
          "Flooded lead acid gives off hydrogen during charging, and in a sealed space that gas can reach an explosive concentration, so the location must be ventilated and free of ignition sources. Cooling is not the concern, since heat shortens battery life and a cooler location is generally better if it is ventilated.",
        difficulty: "Easy",
        skill: "Battery safety, ventilation and disposal",
      },
      {
        n: 5,
        question:
          "The same 1.18 kWh must leave the battery each day. How much rated capacity does an LFP bank at 80 percent usable depth need, and what does the comparison show?",
        options: [
          "About 1.5 kWh, roughly two thirds of the lead acid rating for the same delivered energy",
          "About 2.4 kWh, the same as lead acid, since the load is the same",
          "About 0.9 kWh, because LFP has no conversion loss",
          "About 3.0 kWh, because lithium must be oversized for safety",
        ],
        answer: 0,
        explanation:
          "1.18 divided by 0.8 gives about 1.5 kWh of rated LFP capacity against 2.36 kWh of rated lead acid, so comparing the two chemistries on rated kilowatt hours alone is misleading. Assuming the ratings must match because the load matches ignores that usable depth of discharge, not the label, sets delivered energy.",
        difficulty: "Medium",
        skill: "Depth of discharge and usable capacity",
      },
      {
        n: 6,
        question:
          "Why is a fuse or breaker fitted as close as possible to the battery positive terminal?",
        options: [
          "To protect the battery from being overcharged by the array",
          "Because a battery can deliver a very large short circuit current into any fault in that cable",
          "To allow the charge controller to measure current accurately",
          "Because regulations require one device per battery block",
        ],
        answer: 1,
        explanation:
          "A battery has very low internal resistance and no off switch, so a fault in the unprotected length between the terminal and the device would draw thousands of amperes and set the cable alight. Overcharge protection is a job for the charge controller or the management system, which is a separate function entirely.",
        difficulty: "Medium",
        skill: "Battery safety, ventilation and disposal",
      },
      {
        n: 7,
        question:
          "A customer's existing bank is three years old and one battery has failed. They ask you to replace just that one. What should you tell them?",
        options: [
          "Replace only the failed unit, since the others are still working",
          "A new unit in an aged bank is dragged down to the condition of the old ones, so replace the bank or accept a short life",
          "Replace it with a lithium unit so the bank gets a longer life overall",
          "Add a parallel string of new batteries instead, keeping the old ones in service",
        ],
        answer: 1,
        explanation:
          "Series connected cells share the same current, so the aged units limit the whole bank and the new unit ages rapidly to match rather than lifting the others. Mixing a lithium unit into a lead acid bank is worse still, since the two chemistries have different charging profiles and cannot share a controller setting.",
        difficulty: "Hard",
        skill: "Battery chemistry and cycle life",
      },
    ],
  },
};

export default PART;
