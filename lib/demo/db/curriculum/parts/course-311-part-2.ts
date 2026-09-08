/**
 * Course 311: Solar PV Installer & Rooftop Technician - part 2 of 3.
 *
 * Topics 31108 to 31114: the sizing arithmetic that decides whether a plant
 * runs or trips (module 311003), and the mechanical installation and
 * work-at-height discipline that decides whether the crew goes home
 * (module 311004).
 *
 * Every number worked through here is arithmetic a technician does on a roof
 * with a nameplate in one hand. Product-specific figures are given as worked
 * examples from a stated nameplate, never as the specification of a real
 * product, and nothing here states a tariff, a subsidy or a DISCOM rule as
 * current fact, because those vary by state and by year.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31108: {
    topicId: 31108,
    title: "String sizing against the inverter MPPT window",
    summary:
      "A string is a set of modules wired in series, and its voltage has to land inside the inverter's tracking window at every temperature the roof will see. You learn to read the two nameplates, count modules per string, and check current per tracker before a single connector is clicked.",
    concepts: [
      "Series string",
      "MPPT voltage window",
      "Maximum system voltage",
      "Parallel strings and input current",
      "Start-up voltage",
      "Live DC with no off switch",
    ],
    glossary: {
      String:
        "A group of modules joined positive to negative in a line, so their voltages add up and the same current flows through all of them. One string presents one pair of wires to the inverter.",
      MPPT:
        "Maximum power point tracking. The inverter continuously varies the voltage it pulls the array down to, hunting for the point where voltage times current is highest. It can only do that inside a stated voltage band.",
      "Open circuit voltage":
        "Written Voc on the nameplate. The voltage a module produces in full sun with nothing connected across it. It is the highest voltage the module ever reaches, and it rises as the module gets colder.",
      "Voltage at maximum power":
        "Written Vmp. The lower voltage the module settles at once the inverter is drawing power from it, typically around eighty five per cent of Voc, and it falls as the module heats up.",
      "Maximum system voltage":
        "A limit printed on the module label, commonly 1000 V or 1500 V for the insulation class of the module and its cables. The total string voltage must never exceed it, or the inverter's own DC input limit, whichever is lower.",
      "Short circuit current":
        "Written Isc. The current a module delivers with its terminals shorted. Parallel strings add their currents together, and the sum must stay under the tracker's rated input current.",
    },
    body: {
      Beginner: `<p>A solar module on its own makes a low voltage, roughly the same as a stack of torch cells. To reach a voltage an inverter can work with, you join modules end to end: the positive lead of one into the negative lead of the next. That line of modules is called a <strong>string</strong>.</p>
<p>Two rules run the whole job:</p>
<ul>
<li>Join modules in a line (in series) and the <strong>voltages add up</strong>. The current stays the same as one module.</li>
<li>Join two finished strings side by side (in parallel) and the <strong>currents add up</strong>. The voltage stays the same as one string.</li>
</ul>
<h2>Reading the two labels</h2>
<p>On the back of every module is a label. Four numbers matter to you:</p>
<ul>
<li><strong>Voc</strong>, the open circuit voltage, say 49.5 V. This is the highest voltage that module ever shows.</li>
<li><strong>Vmp</strong>, the working voltage, say 41.5 V. This is what it sits at while the inverter is taking power.</li>
<li><strong>Isc</strong> and <strong>Imp</strong>, the currents, say 11.3 A and 10.6 A.</li>
<li><strong>Maximum system voltage</strong>, usually 1000 V. Never let a string add up past this.</li>
</ul>
<p>On the inverter is a second label with its own numbers: a maximum DC input voltage, and an <strong>MPPT window</strong> such as 200 V to 800 V. The window is the band the inverter can actually work in. Below it the inverter cannot start. Above it the inverter is in danger and will shut down or be damaged.</p>
<h2>Counting the modules</h2>
<p>Take twelve of those modules in one string. In working conditions the string sits near 12 times 41.5 V, which is 498 V, comfortably inside a 200 V to 800 V window. With nothing connected on a cold morning it can reach 12 times 49.5 V, which is 594 V, still under 1000 V. Twelve is a workable string length for this pair.</p>
<h2>The safety point that comes first</h2>
<p>There is no switch on a module. If the sun is on the glass, the panel is generating, and a finished string of twelve is carrying close to six hundred volts of direct current before anyone has switched anything on. You build the string with the DC isolator open, you keep the last connector unclicked until the end, and you treat every cable on that roof as live.</p>`,
      Intermediate: `<p>String sizing is the calculation the whole electrical design hangs on. You are matching two nameplates: the module's voltage behaviour across the temperature range the roof will actually see, and the inverter's tracking window. Get it wrong at the top and the inverter clips, faults or fails its insulation. Get it wrong at the bottom and the plant sits idle on winter mornings and cloudy afternoons while the owner watches the meter.</p>
<h2>The four limits, in the order you check them</h2>
<ol>
<li><strong>Ceiling.</strong> String Voc at the coldest cell temperature must stay below the lower of the inverter's maximum DC input voltage and the module's maximum system voltage. This limit protects hardware and is absolute.</li>
<li><strong>Floor.</strong> String Vmp at the hottest cell temperature must stay above the bottom of the MPPT window, with margin. This limit protects yield.</li>
<li><strong>Start-up.</strong> String Voc in weak morning light must clear the inverter's start-up voltage, or the plant wakes late.</li>
<li><strong>Current.</strong> The number of strings landing on one tracker, times module Isc, must stay under that tracker's maximum input current and its short circuit current rating.</li>
</ol>
<h2>A worked example</h2>
<p>Module nameplate: 440 Wp, Voc 49.5 V, Vmp 41.5 V, Isc 11.3 A, Imp 10.6 A, maximum system voltage 1000 V. Inverter nameplate: 5 kW, maximum DC input 1000 V, MPPT window 200 V to 800 V, start-up 120 V, two trackers, 13 A per tracker.</p>
<p><strong>Ceiling.</strong> Take the coldest cell temperature the site sees, and assume the array is open circuit at that moment. The full temperature correction is the next topic; for now use the result, that Voc rises by roughly six per cent when the cell sits near ten degrees below the standard twenty five. So corrected Voc per module is about 49.5 times 1.06, which is 52.5 V. Divide the ceiling by it: 1000 divided by 52.5 is 19.0, so nineteen modules is the arithmetic maximum. Design below the arithmetic maximum, not at it.</p>
<p><strong>Floor.</strong> On a May afternoon in Telangana a module in still air runs far above air temperature, and a cell temperature near 65 C is ordinary. Vmp falls roughly twelve per cent at that point, to about 36.5 V. With twelve in series the string works at about 438 V, well clear of the 200 V floor. Even eight modules would clear it, at about 292 V.</p>
<p><strong>Current.</strong> Twelve modules of 440 Wp is 5.28 kWp on one string, at 11.3 A. Two such strings, one per tracker, is 10.56 kWp and 11.3 A per tracker, inside the 13 A rating. Both strings on a single tracker would be 22.6 A, which the tracker cannot take.</p>
<h2>Rules the arithmetic does not show you</h2>
<ul>
<li>Every string on one tracker must have the <strong>same module count, model, tilt and orientation</strong>. Mix a south face and a west face on one tracker and the tracker settles on a compromise voltage that suits neither.</li>
<li>Split faces need separate trackers, or separate inverters.</li>
<li>Record the design string length on the single line diagram and on a label at the combiner, because the person who services the plant in year four will not have your spreadsheet.</li>
</ul>`,
      Advanced: `<p>Most sizing failures found on commissioning are not arithmetic errors. They are a correct calculation applied to the wrong temperature, the wrong module variant, or a roof that got re-laid out after the design was frozen.</p>
<h2>Where the ceiling calculation goes wrong on site</h2>
<ul>
<li><strong>Ambient used instead of cell temperature.</strong> The cold case is an open circuit array at dawn. The cell is at ambient or slightly below it because of night sky radiative cooling, so the correct input is the record minimum for the district, not the average winter minimum, and certainly not twenty five.</li>
<li><strong>Design at exactly the limit.</strong> Nineteen modules giving 997 V on a 1000 V inverter leaves nothing for a colder than record morning, for module tolerance, or for a replacement module of a slightly higher Voc bin. Sit at least one module below the arithmetic maximum.</li>
<li><strong>The wrong nameplate.</strong> A supplier ships the same wattage in two bins with different Voc, or half-cut versus full-cell variants. Read the label on the pallet that actually arrived, not the datasheet in the quotation.</li>
<li><strong>Replacement modules years later.</strong> One failed module swapped for a higher-voltage current-generation module can push a string that was designed with no margin over the limit on the first cold morning.</li>
</ul>
<h2>The floor is a yield problem, not a fault</h2>
<p>Nobody gets a call when a string sits below the MPPT window, because the inverter does not fault. It simply produces less than it could, or nothing before nine in the morning, and the owner concludes that solar underperforms. A short string clears the ceiling comfortably, which makes it feel safe, and quietly loses generation for twenty five years. When you have a choice between one long string and two short ones, run the numbers for the hot floor case before choosing.</p>
<h2>Uneven strings and multiple trackers</h2>
<p>Roof geometry rarely divides cleanly. Twenty two modules on a 5 kW two-tracker inverter can be built as eleven and eleven, or twelve and ten. Eleven and eleven is balanced but may not fit the two available roof faces. Twelve and ten is fine <em>provided the two strings are on separate trackers</em>, because each tracker finds its own maximum power point. Wire twelve and ten in parallel onto one tracker and the ten-module string is dragged to the twelve-module string's voltage, which sits it well off its own maximum power point and can even reverse-bias it.</p>
<h2>Current, fusing and the parallel count</h2>
<p>Two strings in parallel need no string fuses in most small rooftop designs, because a fault in one string can be fed by at most one other string and the module reverse current rating covers it. From three strings in parallel upwards, the fault current available from the healthy strings exceeds what the faulted string's cable and module are rated to carry, and string protection becomes mandatory. That threshold is a design decision made here, at sizing time, not later at the protection stage.</p>
<h2>Trap questions asked at assessment</h2>
<ul>
<li>Adding a string in parallel does not change string voltage. Candidates routinely add the voltages.</li>
<li>Voc goes <em>up</em> when it is cold. The intuition that cold means less output is about current and energy, not about open circuit voltage.</li>
<li>The limiting ceiling is the lower of two numbers, the inverter DC input and the module system voltage, and on some hybrid inverters it is the inverter that is lower.</li>
</ul>`,
      Expert: `<h2>Sizing in one page</h2>
<table>
<tr><td><strong>Check</strong></td><td><strong>Condition</strong></td><td><strong>Consequence if breached</strong></td></tr>
<tr><td>Ceiling</td><td>N x Voc at coldest cell temp &lt; min(inverter Vdc max, module system voltage)</td><td>Insulation stress, inverter fault or damage</td></tr>
<tr><td>Floor</td><td>N x Vmp at hottest cell temp &gt; MPPT minimum, with margin</td><td>Silent yield loss, no alarm</td></tr>
<tr><td>Start-up</td><td>N x Voc in weak light &gt; inverter start-up voltage</td><td>Late start, short generating day</td></tr>
<tr><td>Current</td><td>Strings per tracker x Isc &lt; tracker input current rating</td><td>Tracker current limiting or shutdown</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Series adds volts. Parallel adds amps. Nothing else changes.</li>
<li>Cold sets the maximum string length. Hot sets the minimum.</li>
<li>Never design at the arithmetic maximum. Drop one module.</li>
<li>Same tracker means same count, same model, same tilt, same azimuth.</li>
<li>Three or more strings in parallel means string protection.</li>
</ul>
<h2>Edge cases worth carrying in your head</h2>
<ul>
<li><strong>Hybrid inverters</strong> often have a narrower window and a lower DC maximum than a pure grid-tied unit of the same kW, because the battery stage sits behind it. Size from the actual model's sheet.</li>
<li><strong>Bifacial modules</strong> raise current, not open circuit voltage, so the ceiling check is unchanged while the tracker current check tightens.</li>
<li><strong>Optimisers and microinverters</strong> move the sizing question per module and remove the string window problem, at the cost of more roof-mounted electronics to service.</li>
<li><strong>Re-layout after design freeze.</strong> If the crew moved four modules to another face to dodge a water tank shadow, the string design is void until it is recalculated. Recalculate on site, do not improvise.</li>
</ul>
<h2>The site checklist before you click the last connector</h2>
<ol>
<li>DC isolator open, inverter AC breaker off, both proved with a meter.</li>
<li>Module count in each string physically walked and counted, not assumed from the drawing.</li>
<li>String Voc measured with a DC meter and compared against the count times nameplate Voc, adjusted for the morning temperature. A reading that is one module low means a bad connector, not a bad module.</li>
<li>Polarity confirmed at the isolator before anything is closed.</li>
<li>String length and tracker written on a durable label at the combiner and on the as-built drawing.</li>
</ol>
<p>A string that reads correct open circuit voltage and correct polarity, in that order, has almost never gone on to fail at energisation. A string energised without either reading is how a technician finds a reversed pair with an arc.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "You add a second string of twelve modules in parallel to a tracker that already carries one string of twelve. What happens to the DC voltage presented to that tracker?",
        options: [
          "It doubles, because the two strings are joined together",
          "It stays roughly the same, while the current roughly doubles",
          "It halves, because the load is shared between two strings",
          "It rises by the open circuit voltage of one module",
        ],
        answer: 1,
        explanation:
          "Parallel connection joins like to like, so both strings sit at the same voltage and their currents add. Doubling is what happens when you extend the string in series instead, which is the tempting answer because both operations are described loosely as adding a string.",
        difficulty: "Easy",
        skill: "Parallel strings and input current",
      },
      {
        n: 2,
        question:
          "A module is rated Voc 49.5 V with a maximum system voltage of 1000 V. The inverter accepts 800 V DC maximum. What is the ceiling you size the string against?",
        options: [
          "1000 V, because that is the module rating and the modules carry the voltage",
          "800 V, because the design ceiling is the lower of the two limits",
          "1800 V, because the two limits are in series with each other",
          "900 V, the average of the two limits",
        ],
        answer: 1,
        explanation:
          "Both limits apply at the same time, so the smaller one governs and the string is sized against 800 V. Choosing 1000 V is the common error: the module can survive that voltage, but the inverter it is wired into cannot, and the inverter is what fails.",
        difficulty: "Easy",
        skill: "Maximum system voltage",
      },
      {
        n: 3,
        question:
          "An inverter has an MPPT window of 200 V to 800 V. A string sits at 180 V on a hot afternoon. What is the symptom the owner reports?",
        options: [
          "The inverter trips on over-voltage and displays a DC fault",
          "The modules overheat because the current has nowhere to go",
          "Nothing faults, but generation is lower than it should be and the plant may drop out at times",
          "The AC breaker trips because the inverter draws current from the grid",
        ],
        answer: 2,
        explanation:
          "Falling below the MPPT floor is a performance failure, not a protection event, so the inverter simply cannot track and the yield quietly disappears. Expecting a trip is the trap: an over-voltage trip belongs to the opposite fault, a string too long on a cold morning.",
        difficulty: "Medium",
        skill: "MPPT voltage window",
      },
      {
        n: 4,
        question:
          "Twenty two modules must go on a two-tracker inverter, split twelve and ten because of the roof faces. What is the correct connection?",
        options: [
          "Both strings paralleled onto one tracker, leaving the second tracker spare",
          "Twelve on one tracker and ten on the other, so each tracks its own maximum power point",
          "Rewire as eleven and eleven regardless of which roof face each module sits on",
          "Twelve on one tracker and the ten split into two strings of five on the other",
        ],
        answer: 1,
        explanation:
          "Separate trackers let unequal strings each settle at their own optimum voltage, which is exactly what an independent MPPT input is for. Paralleling them is the tempting shortcut, but the shorter string is then dragged to the longer string's voltage and loses power continuously.",
        difficulty: "Medium",
        skill: "Series string",
      },
      {
        n: 5,
        question:
          "Before clicking the final DC connector on a completed string in full sun, what is already true?",
        options: [
          "Nothing is live, because the inverter and isolator are both switched off",
          "Only the last module is live, since the circuit is still open",
          "The string is generating close to its full open circuit voltage, and the exposed contacts are dangerous",
          "The voltage builds up gradually only after the inverter is energised",
        ],
        answer: 2,
        explanation:
          "Sunlight on the glass is the only switch a module has, so the series voltage is present at the open ends whether or not anything downstream is on. Believing the isolator makes the array safe is the assumption behind most rooftop DC arc injuries, because an isolator only breaks the circuit below it.",
        difficulty: "Easy",
        skill: "Live DC with no off switch",
      },
      {
        n: 6,
        question:
          "A tracker is rated 13 A input. Modules are Isc 11.3 A. How many strings can land on that tracker?",
        options: [
          "One, because two strings would present about 22.6 A",
          "Two, because the tracker current rating applies per string",
          "Two, because the strings will not both reach Isc at the same moment",
          "Three, provided string fuses are fitted",
        ],
        answer: 0,
        explanation:
          "Parallel strings add current at the tracker terminals, so two strings offer about 22.6 A against a 13 A rating and only one string fits. Arguing that the strings peak at different times is the trap: identical modules on the same roof face peak together, and the rating is a hardware limit, not an average.",
        difficulty: "Hard",
        skill: "Parallel strings and input current",
      },
      {
        n: 7,
        question:
          "Why is a string designed to reach 997 V on a 1000 V inverter a poor design even though the arithmetic passes?",
        options: [
          "The inverter cannot track above 950 V under any condition",
          "There is no allowance for a colder than expected morning, module tolerance, or a future replacement module of a higher voltage bin",
          "Long strings always suffer more voltage drop than short ones",
          "String voltage always drifts upwards as the modules age",
        ],
        answer: 1,
        explanation:
          "The cold-case Voc is an estimate built on a record temperature and a nameplate tolerance, so a design sitting three volts under the limit fails on the first colder morning or the first module swap. Voltage drop is a real effect but it lowers voltage rather than raising it, so it is not what puts this string over the ceiling.",
        difficulty: "Hard",
        skill: "Maximum system voltage",
      },
    ],
  },

  31109: {
    topicId: 31109,
    title: "Temperature correction of open circuit voltage",
    summary:
      "Nameplate voltage is measured at a cell temperature of 25 C, and a Telangana roof is almost never at 25 C. You learn to correct Voc for the coldest morning and Vmp for the hottest afternoon, using the temperature coefficients printed on the module datasheet.",
    concepts: [
      "Standard Test Conditions",
      "Temperature coefficient of Voc",
      "Cell temperature estimation",
      "Cold-case string voltage",
      "Hot-case working voltage",
      "Design margin",
    ],
    glossary: {
      "Standard Test Conditions":
        "The laboratory conditions every nameplate number is measured at: 1000 W per square metre of irradiance, a cell temperature of 25 C, and a defined air mass of 1.5. Written STC.",
      "Temperature coefficient":
        "How much a rated value changes for each degree the cell moves away from 25 C, given as a percentage per degree Celsius. For crystalline silicon the Voc coefficient is negative and usually between about minus 0.25 and minus 0.30 per cent per degree.",
      "Cell temperature":
        "The temperature of the silicon itself, which sits well above the surrounding air temperature whenever the sun is on the module. It is what the coefficients are applied to, not the air temperature.",
      NOCT:
        "Nominal operating cell temperature, also written NMOT. The cell temperature a module reaches at 800 W per square metre, 20 C air and light wind. Typically in the low forties, and printed on the datasheet.",
      Irradiance:
        "The power arriving from the sun per square metre of module surface, in watts per square metre. It drives current almost proportionally and voltage only weakly.",
      "Design temperature":
        "The two temperatures you choose to calculate with: the record low air temperature for the district for the voltage ceiling, and a realistic hot cell temperature for the working floor.",
    },
    body: {
      Beginner: `<p>Every number on a module label is measured in a laboratory at a cell temperature of 25 C. A roof in Telangana is at that temperature for a few minutes a year, if at all. So the label is a starting point, and your job is to correct it.</p>
<h2>Cold makes voltage go up</h2>
<p>This is the part that surprises people. A cold module makes <strong>more</strong> voltage, not less. On a January morning at six o'clock, before the array is doing any work, the open circuit voltage of a string is higher than the label says. That is the moment a string can go over the inverter's limit.</p>
<p>Heat does the opposite. A hot module makes <strong>less</strong> voltage. On a May afternoon a string works at noticeably lower voltage than the label suggests.</p>
<h2>The coefficient</h2>
<p>The datasheet gives you a number like <strong>minus 0.28 per cent per degree C</strong> for Voc. Read it as a sentence: for every degree the cell is <em>above</em> 25 C, the open circuit voltage falls by 0.28 per cent, and for every degree <em>below</em> 25 C it rises by 0.28 per cent.</p>
<h2>Doing the sum</h2>
<p>Take a module with Voc 49.5 V and a coefficient of minus 0.28 per cent per degree. Suppose the coldest morning at the site is 5 C.</p>
<ul>
<li>The cell is 20 degrees below 25 C.</li>
<li>20 times 0.28 is 5.6 per cent higher.</li>
<li>49.5 times 1.056 is <strong>52.3 V</strong>.</li>
</ul>
<p>That is the number you use, not 49.5. Against a 1000 V ceiling, 1000 divided by 52.3 is 19.1, so nineteen modules is the arithmetic limit and you build eighteen.</p>
<h2>Two temperatures, two jobs</h2>
<ul>
<li><strong>Coldest air temperature</strong> at the site tells you the longest string you are allowed. Use the record low for that district, not a guess.</li>
<li><strong>Hottest cell temperature</strong> tells you the shortest string that still works. On a hot day the silicon runs roughly 25 to 30 degrees above the air, so 42 C air can mean a 70 C cell.</li>
</ul>
<p>Do both sums before you decide the string length. Doing only the cold one gives you a plant that is safe and lazy.</p>`,
      Intermediate: `<p>Temperature correction is the single calculation that separates a string design from a guess. The formula is short, the coefficients are printed on the datasheet, and the whole difficulty is choosing the right two temperatures to put into it.</p>
<h2>The formula</h2>
<p>Voltage at a given cell temperature equals the STC value multiplied by one plus the coefficient times the temperature difference from 25 C:</p>
<p><strong>V(T) = V(STC) x (1 + (beta / 100) x (T - 25))</strong></p>
<p>where beta is the coefficient in per cent per degree, negative for both Voc and Vmp. When T is below 25 the bracket is greater than one and voltage rises.</p>
<h2>Cold case: the ceiling</h2>
<p>Nothing is generating at dawn, so the array is at open circuit and the cell sits at air temperature. Take the district's record minimum air temperature from the meteorological record for the site, not a national average and not the winter mean. In the northern Telangana districts a winter morning in single-figure Celsius is recorded, while Hyderabad rarely goes as low, so the same module gives a different maximum string length in Adilabad and in Rangareddy.</p>
<p>Worked, with Voc 49.5 V and beta minus 0.28 per cent per degree, at a design low of 5 C:</p>
<ul>
<li>T minus 25 equals minus 20.</li>
<li>Bracket is 1 + (minus 0.28 divided by 100) times (minus 20), which is 1 + 0.056, so 1.056.</li>
<li>Corrected Voc is 49.5 times 1.056, which is 52.27 V.</li>
<li>Ceiling 1000 V divided by 52.27 gives 19.1, so nineteen is the arithmetic maximum and eighteen is the design.</li>
</ul>
<h2>Hot case: the floor</h2>
<p>For the working voltage you need cell temperature, not air temperature. Two ways to get it:</p>
<ol>
<li><strong>From NOCT.</strong> Tcell = Tair + (NOCT - 20) x (irradiance / 800). With NOCT 45 C, air 42 C and full sun at 1000 W per square metre, that is 42 + 25 x 1.25, which is 73 C.</li>
<li><strong>Rule of thumb.</strong> A rail-mounted array with clear air behind it runs about 25 to 30 degrees above air temperature at midday. A module lying flat on a tin sheet with no gap runs hotter still.</li>
</ol>
<p>Apply the Vmp coefficient, typically around minus 0.30 to minus 0.40 per cent per degree, to that cell temperature. With Vmp 41.5 V, beta minus 0.32 and a 73 C cell:</p>
<ul>
<li>T minus 25 equals 48, so the correction is minus 15.4 per cent.</li>
<li>Corrected Vmp is 41.5 times 0.846, which is 35.1 V.</li>
<li>Twelve in series gives 421 V, comfortably above a 200 V MPPT floor. Six in series would give 211 V, which is inside the window but with almost no margin.</li>
</ul>
<h2>Where the numbers come from</h2>
<p>Coefficients are measured under the design qualification standard that the Indian standard IS 14286 adopts for crystalline modules, so a compliant datasheet carries them. If a datasheet does not print a Voc coefficient, do not assume one, ask the supplier. Different cell technologies differ enough that a borrowed number can cost you a module of string length.</p>
<p>Write both corrected voltages on the design sheet next to the temperatures you assumed. An inspector or a colleague can then check your assumption, which is the arguable part, instead of re-doing your arithmetic, which is not.</p>`,
      Advanced: `<p>The formula is never what goes wrong. The temperature you feed it is.</p>
<h2>Choosing the cold design temperature honestly</h2>
<ul>
<li><strong>Record minimum, not average minimum.</strong> The array only has to exceed the inverter limit once to fault or to stress its insulation. Design against the coldest morning the district records, and if the record is not available for the site, use the nearest station and then keep an extra module of margin.</li>
<li><strong>Radiative cooling goes below ambient.</strong> On a clear, still, dry night a module facing an open sky loses heat by radiation faster than the air replaces it, so at first light the glass can sit a degree or two <em>below</em> the reported air temperature. The reported minimum is therefore not conservative on its own.</li>
<li><strong>Irradiance at the cold moment.</strong> The dangerous instant is first light on a cold clear morning: enough irradiance to produce near-full Voc, not enough to warm the cell. Voc is only weakly dependent on irradiance, so it recovers most of its value at a few hundred watts per square metre while the cell is still cold.</li>
</ul>
<h2>Choosing the hot design temperature honestly</h2>
<p>The common error runs the other way: using air temperature for the hot case, which flatters the working voltage by fifteen per cent or more and hides a string that will sit near or below the MPPT floor in May. Mounting matters here more than the datasheet does. A module on rails 150 mm clear of the roof sheds heat by convection on both faces. A module bolted flat to an asbestos or metal sheet with no air gap can run ten degrees hotter, and that is a mechanical decision that changes an electrical calculation.</p>
<h2>What the coefficients actually are</h2>
<table>
<tr><td><strong>Parameter</strong></td><td><strong>Typical crystalline coefficient</strong></td><td><strong>What it governs</strong></td></tr>
<tr><td>Voc</td><td>about minus 0.25 to minus 0.30 per cent per degree</td><td>The cold ceiling and the maximum string length</td></tr>
<tr><td>Vmp</td><td>about minus 0.30 to minus 0.40 per cent per degree</td><td>The hot floor and whether the tracker can hold the string</td></tr>
<tr><td>Pmax</td><td>about minus 0.30 to minus 0.40 per cent per degree</td><td>Summer yield, and why a hot May can generate less than a mild March</td></tr>
<tr><td>Isc</td><td>about plus 0.04 to plus 0.05 per cent per degree</td><td>Almost nothing, but it is positive, which is why heat does not reduce current</td></tr>
</table>
<h2>Traps that cost marks and cost plants</h2>
<ul>
<li><strong>Sign errors.</strong> A negative coefficient with a negative temperature difference gives a positive correction. Candidates who apply the sign once instead of twice conclude that cold reduces voltage, which is the opposite of the physical fact.</li>
<li><strong>Correcting Voc with the Pmax coefficient.</strong> They are different numbers on the same sheet, and the Pmax figure is the larger one, so the mistake makes the string look shorter than it needs to be.</li>
<li><strong>Correcting the string instead of the module.</strong> Both work, because the correction is proportional, but mixing them, correcting the module and then applying a second percentage to the string, double counts.</li>
<li><strong>Forgetting the replacement module.</strong> A design with two volts of headroom is voided the first time a warranty replacement arrives from a higher voltage bin.</li>
</ul>
<h2>On the job</h2>
<p>When you measure string Voc at commissioning, note the time and a rough module temperature next to it. A reading that is five per cent above nameplate at eight in the morning is correct physics, not a fault, and a reading that is exactly nameplate on a hot afternoon means something is wrong.</p>`,
      Expert: `<h2>The two sums, from memory</h2>
<p><strong>Cold ceiling:</strong> Voc(cold) = Voc(STC) x (1 + 0.01 x |beta| x (25 - Tmin)). Then N(max) = floor(V(ceiling) / Voc(cold)), and you build N(max) minus one.</p>
<p><strong>Hot floor:</strong> Tcell = Tair + (NOCT - 20) x G / 800. Then Vmp(hot) = Vmp(STC) x (1 - 0.01 x |beta_vmp| x (Tcell - 25)), and N x Vmp(hot) must clear the MPPT minimum with margin.</p>
<h2>Quick reference</h2>
<table>
<tr><td><strong>Condition</strong></td><td><strong>Cell temp used</strong></td><td><strong>Effect on voltage</strong></td></tr>
<tr><td>Dawn, clear, winter, open circuit</td><td>Record minimum air, or a degree below it</td><td>Voc up by five to eight per cent</td></tr>
<tr><td>Midday May, array working</td><td>Air plus 25 to 30 C, or via NOCT</td><td>Vmp down by twelve to eighteen per cent</td></tr>
<tr><td>Overcast monsoon afternoon</td><td>Near air temperature</td><td>Voltage close to nameplate, current low</td></tr>
</table>
<h2>Numbers worth having ready</h2>
<ul>
<li>A five per cent Voc rise corresponds to roughly 18 degrees of cooling at minus 0.28 per cent per degree.</li>
<li>Ten modules of Voc 49.5 V read about 495 V at 25 C and about 520 V on a cold morning. If your meter reads 470 V, look for a module or a connector, not for the weather.</li>
<li>Irradiance moves current almost proportionally and Voc only logarithmically, so a thin cloud halves the current and barely moves the open circuit voltage.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Thin film and heterojunction</strong> modules have gentler temperature coefficients than standard crystalline, so a design borrowed from one technology gives the wrong string length on another.</li>
<li><strong>Bifacial</strong> rear-side gain raises current and cell temperature slightly, not open circuit voltage, so the ceiling calculation is unchanged.</li>
<li><strong>Roof-integrated or flush-mounted</strong> modules with no rear air gap need the hot case computed at a higher cell temperature than NOCT implies, because NOCT assumes open rack mounting.</li>
<li><strong>Very cold hill sites</strong> outside the plains change the answer entirely. Never reuse a plains string length at altitude.</li>
</ul>
<h2>Field discipline</h2>
<ol>
<li>Record the design low temperature and its source on the design sheet, so the next technician can check your assumption rather than your arithmetic.</li>
<li>Measure open circuit voltage before energising, with the time and an approximate module temperature noted.</li>
<li>If the string is over the inverter limit at any measured moment, do not energise. Remove a module and re-check.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A module has Voc 49.5 V at STC and a Voc temperature coefficient of minus 0.28 per cent per degree C. What is its open circuit voltage at a cell temperature of 5 C?",
        options: [
          "About 46.7 V, because the coefficient is negative",
          "About 52.3 V, because the cell is 20 degrees below 25 C",
          "49.5 V, because the coefficient only applies above 25 C",
          "About 55.0 V, because voltage doubles the coefficient below freezing point",
        ],
        answer: 1,
        explanation:
          "The cell is 20 degrees below the 25 C reference, so the negative coefficient multiplied by a negative temperature difference gives a rise of 5.6 per cent, taking 49.5 V to 52.3 V. Answering 46.7 V is the classic sign error: the coefficient is applied once instead of twice and cold is treated as if it reduced voltage.",
        difficulty: "Medium",
        skill: "Temperature coefficient of Voc",
      },
      {
        n: 2,
        question:
          "Which temperature do you use to work out the longest string the inverter can accept?",
        options: [
          "The average annual air temperature for the district",
          "The nominal operating cell temperature from the datasheet",
          "The record minimum air temperature for the site",
          "The hottest cell temperature the array will reach",
        ],
        answer: 2,
        explanation:
          "The maximum string voltage happens at open circuit on the coldest morning, so the record minimum is the design input for the ceiling. Using NOCT is tempting because it appears on the datasheet, but NOCT describes a warm operating condition and would give a string that is too long.",
        difficulty: "Easy",
        skill: "Cold-case string voltage",
      },
      {
        n: 3,
        question:
          "Air temperature is 42 C, NOCT is 45 C and irradiance is 1000 W per square metre. What is the estimated cell temperature?",
        options: [
          "45 C, since that is the nominal operating cell temperature",
          "About 73 C, from 42 plus 25 multiplied by 1000 divided by 800",
          "42 C, because the module cannot be hotter than the air around it",
          "About 67 C, from 42 plus 25",
        ],
        answer: 1,
        explanation:
          "The NOCT formula scales the 25 degree rise (45 minus 20) by the ratio of actual irradiance to the 800 W per square metre reference, giving 42 plus 31, which is about 73 C. Reading NOCT directly as the cell temperature ignores that it is defined at 20 C air and only 800 W per square metre, so it badly understates a May roof.",
        difficulty: "Hard",
        skill: "Cell temperature estimation",
      },
      {
        n: 4,
        question:
          "At commissioning on a cool morning, a string of ten modules of nameplate Voc 49.5 V reads 518 V. What should you conclude?",
        options: [
          "A module is faulty, because the reading is above nameplate",
          "The reading is normal, because a cool cell raises open circuit voltage",
          "The meter is on the wrong range and should be re-checked",
          "One module has been bypassed by a diode",
        ],
        answer: 1,
        explanation:
          "Ten times 49.5 V is 495 V at 25 C, and a cool cell lifts that by a few per cent, so 518 V is exactly what correct physics predicts. Treating an above-nameplate reading as a fault is the trap, whereas a reading well below the count times nameplate is the one that points to a bad module or connector.",
        difficulty: "Medium",
        skill: "Cold-case string voltage",
      },
      {
        n: 5,
        question:
          "Why does using air temperature instead of cell temperature for the hot case produce a dangerous design?",
        options: [
          "It overstates the working voltage, hiding a string that may fall below the MPPT floor",
          "It understates the working voltage, so the string is made too long",
          "It has no effect, because Vmp does not depend on temperature",
          "It changes the current rating of the string cable",
        ],
        answer: 0,
        explanation:
          "The silicon runs far hotter than the air, so using air temperature makes the string look as if it holds a higher Vmp than it really will and the shortfall against the tracker floor is invisible on paper. Believing it makes the string too long is the reverse error: the mistake flatters the floor calculation, not the ceiling one.",
        difficulty: "Hard",
        skill: "Hot-case working voltage",
      },
      {
        n: 6,
        question:
          "Two modules of the same wattage have Voc coefficients of minus 0.25 and minus 0.30 per cent per degree. Which allows the longer string, all else equal?",
        options: [
          "The minus 0.30 module, because a larger coefficient means more headroom",
          "The minus 0.25 module, because its voltage rises less in the cold",
          "They allow the same string length, since the coefficient only affects power",
          "Neither, because string length depends only on the inverter",
        ],
        answer: 1,
        explanation:
          "A smaller magnitude coefficient means less voltage rise on the cold morning, so the corrected Voc is lower and more modules fit under the same ceiling. Choosing the minus 0.30 module reads the coefficient as a benefit, but a bigger number here means a bigger cold-morning voltage and a shorter permitted string.",
        difficulty: "Medium",
        skill: "Temperature coefficient of Voc",
      },
      {
        n: 7,
        question:
          "Why is a design that leaves only two or three volts of headroom under the inverter limit poor practice?",
        options: [
          "Inverters reduce their voltage limit as they age",
          "A colder than record morning, module tolerance or a replacement module of a higher voltage bin removes the headroom",
          "Cable voltage drop adds to the open circuit voltage",
          "The DISCOM requires a fixed ten per cent margin on every rooftop plant",
        ],
        answer: 1,
        explanation:
          "The cold-case figure is an estimate resting on a historical temperature and a nameplate tolerance, so ordinary variation or a single replacement module can take the string over the limit. Cable voltage drop is real but it lowers the voltage seen at the inverter, so it cannot be what pushes the string over the ceiling.",
        difficulty: "Medium",
        skill: "Design margin",
      },
    ],
  },

  31110: {
    topicId: 31110,
    title: "DC to AC ratio and inverter loading",
    summary:
      "Array capacity in kWp and inverter capacity in kW are deliberately not equal, because an array almost never reaches its rated output. You learn to choose a DC to AC ratio, judge how much clipping it costs, and check the inverter's AC current against the cable, the breaker and the sanctioned load.",
    concepts: [
      "DC to AC ratio",
      "Inverter clipping",
      "Inverter derating with temperature",
      "AC output current",
      "Sanctioned load",
      "Capacity utilisation",
    ],
    glossary: {
      "DC to AC ratio":
        "Array capacity in kWp divided by inverter continuous AC capacity in kW. A ratio of 1.2 means 6 kWp of modules on a 5 kW inverter. Also called the oversizing factor or the array to inverter ratio.",
      kWp:
        "Kilowatt peak. The sum of the module nameplate wattages, measured at Standard Test Conditions. It is a rating, not a promise, and the array reaches it only in cold bright conditions.",
      Clipping:
        "What the inverter does when the array offers more power than it can convert. It moves off the maximum power point and holds output at its limit, so the surplus is never generated. It is a loss, not a fault.",
      Derating:
        "The reduction in an inverter's continuous output above a stated ambient temperature, or at high altitude. A 5 kW inverter in a hot enclosed meter room may only sustain four point something kW.",
      "Sanctioned load":
        "The connected load in kW or kVA that the distribution utility has approved for that service connection. Rooftop capacity permitted under a net metering scheme is written against this number.",
      kVA:
        "Apparent power, volts times amperes. Inverter cables, breakers and utility approvals are sized on kVA, while generation is counted in kW. At unity power factor the two are numerically the same.",
    },
    body: {
      Beginner: `<p>Two numbers describe a rooftop plant, and they are not the same number.</p>
<ul>
<li><strong>Array size in kWp.</strong> Add up the wattage on the module labels. Fifteen modules of 440 W is 6600 W, so 6.6 kWp.</li>
<li><strong>Inverter size in kW.</strong> The most AC power the inverter can put out at once, say 5 kW.</li>
</ul>
<p>Putting 6.6 kWp of modules on a 5 kW inverter looks like a mistake. It is not. It is the normal way a rooftop plant is built.</p>
<h2>Why the array is bigger</h2>
<p>The label wattage is measured in a laboratory at a cell temperature of 25 C with bright, clean, perfectly angled light. A real roof gives you less than that almost every minute of the year:</p>
<ul>
<li>The modules are hot, so they give less than the label.</li>
<li>There is dust on the glass.</li>
<li>The sun is at the wrong angle for most of the day.</li>
<li>A little power is lost in the cables and in the inverter itself.</li>
</ul>
<p>So a 6.6 kWp array on a Telangana roof rarely delivers more than about 5.3 kW at the inverter output, and only for a short spell around noon on clear days.</p>
<h2>Clipping</h2>
<p>On those few bright hours, when the array does try to give more than 5 kW, the inverter simply holds its output at 5 kW. The extra is not generated. This is called <strong>clipping</strong>, and it is a small, planned loss. In exchange you get more generation in the morning, in the evening, in cloud and in the monsoon, when the array is nowhere near its rating.</p>
<h2>The ratio</h2>
<p>Divide array by inverter. 6.6 divided by 5 is <strong>1.32</strong>. On Indian rooftops a ratio somewhere between about 1.1 and 1.3 is usual. Below 1.1 you have paid for inverter you never use. Well above 1.3 you start losing real energy to clipping.</p>
<h2>One number you must check</h2>
<p>The electricity utility approves a rooftop plant against the <strong>sanctioned load</strong> on that connection. A house sanctioned for 3 kW cannot simply have a 10 kW inverter fitted because there is roof space. The rule differs from one DISCOM to another and changes over time, so you check the current rule before you promise the customer a size.</p>`,
      Intermediate: `<p>Choosing the inverter is two decisions taken together: how much array to hang on it, and whether its AC side fits the service connection it will feed. Technicians who only do the first produce a plant that generates well and cannot be approved.</p>
<h2>Why oversizing pays</h2>
<p>Array output follows irradiance, and irradiance follows a curve that spends most of the day well below 1000 W per square metre. Add the temperature loss, which is at its worst exactly when irradiance is highest, and the array's real peak AC output is typically seventy five to eighty five per cent of its kWp rating.</p>
<p>Worked, for a 6.6 kWp array on a clear May noon:</p>
<ul>
<li>Temperature loss at a 70 C cell, about minus 15 per cent.</li>
<li>Soiling, about minus 3 per cent between cleans.</li>
<li>Mismatch and DC cable, about minus 3 per cent together.</li>
<li>Inverter conversion, about minus 2.5 per cent.</li>
</ul>
<p>6.6 x 0.85 x 0.97 x 0.97 x 0.975, which is about 5.15 kW. A 5 kW inverter clips by a small amount, for a short window, on the clearest days. On a cool clear March morning the temperature loss shrinks and the same array can offer 5.8 kW, so clipping is longer that day. Across a year, at a ratio near 1.3, the clipped energy is normally a small single-digit percentage of what the array could have produced, and the extra morning, evening and monsoon output more than pays for it.</p>
<h2>Where the ratio should sit</h2>
<table>
<tr><td><strong>Ratio</strong></td><td><strong>When it is right</strong></td></tr>
<tr><td>1.0 to 1.1</td><td>Unshaded array, cool site, or an owner who values peak export</td></tr>
<tr><td>1.1 to 1.3</td><td>The normal band for a Telangana rooftop</td></tr>
<tr><td>1.3 to 1.5</td><td>East or west facing roofs, tilted flat, or heavily diffuse sites, where the array rarely peaks</td></tr>
<tr><td>Above 1.5</td><td>Only with a documented reason, and never above the inverter's stated maximum DC input power</td></tr>
</table>
<h2>The AC side of the same decision</h2>
<p>An inverter's AC rating decides the current the rest of the installation must carry. For a single phase 5 kW inverter at 230 V and unity power factor:</p>
<p>I = P / V = 5000 / 230, which is <strong>21.7 A</strong>.</p>
<p>That sets the AC cable size, the MCB rating (a 32 A device for a 21.7 A continuous load, sized above the inverter's stated maximum output current), and the RCCB rating. For a three phase 10 kW inverter at 415 V:</p>
<p>I = P / (1.732 x V) = 10000 / (1.732 x 415), which is <strong>13.9 A</strong> per phase.</p>
<h2>Heat derates the inverter</h2>
<p>The nameplate kW is a continuous rating up to a stated ambient temperature. Above it the inverter reduces output to protect its electronics. A 5 kW unit bolted to a west-facing wall in direct afternoon sun, or shut inside an unventilated meter cupboard, will derate exactly when the array is at its best. Mount it shaded, vertical, with the clearance the manual specifies on all four sides, and never above a fuel or fodder store.</p>
<h2>The approval constraint</h2>
<p>Net metering permission is written against the sanctioned load of the connection, and whether the limit is applied to inverter AC capacity or array kWp differs by DISCOM. Read the current regulation for the DISCOM serving that district before fixing the inverter rating, and if the customer wants more array than the connection allows, the honest answer is an application to enhance the sanctioned load, not a bigger inverter fitted quietly.</p>`,
      Advanced: `<p>Oversizing is well understood in principle and got wrong in practice, usually because one number in the chain was taken from a brochure instead of from the site.</p>
<h2>Three limits that are not the same number</h2>
<ul>
<li><strong>Maximum recommended DC input power.</strong> The kWp the manufacturer says you may connect. Exceeding it may void warranty even if nothing trips.</li>
<li><strong>Maximum DC input current per tracker.</strong> A hard limit set by the tracker hardware, which you can breach at a perfectly reasonable kWp ratio if you put too many parallel strings on one input.</li>
<li><strong>Maximum DC input voltage.</strong> Unrelated to the ratio, and covered by string sizing.</li>
</ul>
<p>A design can satisfy the power ratio and still fail on tracker current, which is why the ratio is a starting point rather than a check.</p>
<h2>When a high ratio is genuinely correct</h2>
<p>Clipping loss depends on the shape of the generation curve, not just its area. Two roofs with the same annual irradiation clip differently:</p>
<ul>
<li>A south-facing array at optimum tilt produces a tall narrow midday peak, so it clips sooner and for longer at a given ratio.</li>
<li>An east and west split array produces a broad flat curve with two shoulders and a lower midday peak, so the same ratio clips far less. Splitting a roof east and west is one of the few times a ratio of 1.4 is defensible.</li>
<li>A partly shaded array never reaches its rating at all, so raising the ratio recovers energy that would otherwise be lost, provided the shading is handled properly on separate trackers.</li>
</ul>
<h2>What goes wrong on site</h2>
<ul>
<li><strong>Sizing the inverter to the bill.</strong> An owner with a 500 unit monthly bill needs an array that generates it, and the inverter follows from the array and the connection, not from the bill.</li>
<li><strong>Ignoring inverter derating in the location chosen.</strong> The design says 5 kW; the wall it is mounted on reaches 55 C in April. Derating turns a small clipping loss into a large one, and it is invisible in the design document.</li>
<li><strong>Confusing kW and kVA.</strong> Cables, breakers and utility approvals work in kVA. An inverter operated at a non-unity power factor on the utility's instruction delivers fewer kW for the same kVA, so a plant sized in kW to a kVA limit is oversized against the approval.</li>
<li><strong>Adding array later.</strong> A customer who adds four modules two years on has changed the ratio, possibly breached the tracker current limit, and certainly invalidated the sanctioned capacity on the approval. Any addition is a new calculation and, usually, a new application.</li>
</ul>
<h2>Judging the loss honestly for a customer</h2>
<p>The number an owner should be given is not the ratio, it is the annual generation estimate and the assumption behind it. State the specific yield you have assumed in units per kWp per year for that district, state the ratio, and say plainly that a small amount of midday output is traded for better morning and monsoon output. An owner who is told about clipping when the plant is quoted does not raise it as a complaint in year two.</p>
<h2>Safety note that belongs here</h2>
<p>A higher ratio means more parallel strings and more DC current on the roof. Every additional string is another pair of live conductors that cannot be switched off at the module, another connector crimp that can arc, and another reason the DC isolator and the string labelling have to be right before energisation.</p>`,
      Expert: `<h2>The ratio in one page</h2>
<table>
<tr><td><strong>Quantity</strong></td><td><strong>Formula</strong></td><td><strong>Worked</strong></td></tr>
<tr><td>DC to AC ratio</td><td>array kWp / inverter kW</td><td>6.6 / 5 = 1.32</td></tr>
<tr><td>Realistic peak AC</td><td>kWp x combined derate</td><td>6.6 x 0.80 = 5.3 kW</td></tr>
<tr><td>Single phase AC current</td><td>P / V</td><td>5000 / 230 = 21.7 A</td></tr>
<tr><td>Three phase AC current</td><td>P / (1.732 x V)</td><td>10000 / 718.8 = 13.9 A</td></tr>
<tr><td>Annual units</td><td>kWp x specific yield</td><td>6.6 x an assumed yield per kWp</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Array in kWp, inverter in kW. They are never meant to match.</li>
<li>Clipping is a planned loss. Derating is an avoidable one.</li>
<li>Check tracker current separately. The power ratio does not cover it.</li>
<li>Approval is against sanctioned load, and the rule is the DISCOM's, not yours.</li>
<li>Every module added later is a new design and a new application.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Hybrid inverters</strong> publish a separate maximum PV input power and a separate maximum charging power. A ratio computed against the AC rating alone can exceed the PV input limit.</li>
<li><strong>Export limitation.</strong> Where the utility requires zero or limited export, the inverter is throttled by a meter signal, and the effective clipping is set by site consumption rather than by the ratio.</li>
<li><strong>Power factor instruction.</strong> If the utility requires operation at a lagging power factor, the same kVA yields fewer kW, so the plant behaves as if the inverter were smaller.</li>
<li><strong>Altitude and enclosure.</strong> Derating curves in the manual are given against ambient temperature and sometimes altitude. A meter room with no ventilation is a hotter ambient than the weather report.</li>
</ul>
<h2>Commissioning checks that test the ratio</h2>
<ol>
<li>Read the inverter's own power curve on a clear day. A flat top held exactly at the rated figure for a period is clipping and is expected; a flat top well below the rating is derating and needs investigating.</li>
<li>Confirm the AC breaker rating is above the inverter's stated maximum continuous output current, and that the cable is sized for that current over its actual run length.</li>
<li>Confirm the installed array kWp matches the figure on the approval paperwork, module for module.</li>
<li>Record the ambient temperature at the inverter location at the hottest hour, not the weather station figure.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A 6.6 kWp array is connected to a 5 kW inverter. What is the DC to AC ratio, and is it reasonable?",
        options: [
          "0.76, and it is too low for a rooftop plant",
          "1.32, which is within the normal band for an Indian rooftop",
          "1.32, but it is a design error because the array must never exceed the inverter rating",
          "1.6, once module tolerance is included",
        ],
        answer: 1,
        explanation:
          "The ratio is array kWp divided by inverter kW, 6.6 over 5, which is 1.32 and sits inside the usual 1.1 to 1.3 band once site conditions are allowed for. Insisting the array must not exceed the inverter rating is the tempting error, because an array almost never delivers its rated output on a hot roof.",
        difficulty: "Easy",
        skill: "DC to AC ratio",
      },
      {
        n: 2,
        question:
          "The owner reports that the inverter output sits at exactly 5.0 kW for about ninety minutes on clear days. What is happening?",
        options: [
          "The inverter is faulty and stuck at its rating",
          "The array is clipping, which is a designed and expected loss",
          "The grid voltage is too high and the inverter is limiting",
          "The modules are overheating and their output has collapsed",
        ],
        answer: 1,
        explanation:
          "A flat top held precisely at the rated figure is the signature of clipping, where the array offers more than the inverter can convert and output is held at the limit. A fault would not produce a clean plateau exactly at the nameplate value, and a derating fault would hold output below the rating rather than at it.",
        difficulty: "Medium",
        skill: "Inverter clipping",
      },
      {
        n: 3,
        question:
          "What continuous AC current does a single phase 5 kW inverter deliver at 230 V and unity power factor?",
        options: [
          "About 21.7 A",
          "About 12.5 A",
          "About 43.5 A",
          "About 5 A",
        ],
        answer: 0,
        explanation:
          "Current is power divided by voltage, so 5000 divided by 230 gives 21.7 A, which is what the AC cable and breaker must be sized for. Around 12.5 A is what you get by applying the three phase formula to a single phase inverter, which is the most common slip in this calculation.",
        difficulty: "Easy",
        skill: "AC output current",
      },
      {
        n: 4,
        question:
          "An inverter is mounted on an unshaded west-facing wall. What is the consequence in April afternoons?",
        options: [
          "The MPPT window shifts upward and the string voltage rises",
          "The inverter derates, holding output below its rating exactly when the array is producing well",
          "Nothing, because inverters are rated for outdoor mounting",
          "The AC current rises, tripping the breaker",
        ],
        answer: 1,
        explanation:
          "Continuous output is rated only up to a stated ambient temperature and the inverter reduces power above it, so a hot sunlit wall costs generation at the best hours of the day. An outdoor IP rating means the enclosure resists dust and water, which is a different property from thermal headroom, so it does not make the mounting position acceptable.",
        difficulty: "Medium",
        skill: "Inverter derating with temperature",
      },
      {
        n: 5,
        question:
          "A customer with a 3 kW sanctioned load asks for a 10 kW plant because there is roof space. What is the correct response?",
        options: [
          "Install it, since sanctioned load applies only to consumption and not to generation",
          "Install a 10 kW array with a 3 kW inverter, which keeps the approval valid",
          "Check the current DISCOM rule and, if the capacity is not permitted, apply to enhance the sanctioned load",
          "Split the plant into three separate 3 kW systems on the same connection",
        ],
        answer: 2,
        explanation:
          "Permitted rooftop capacity is written against the sanctioned load of that service connection, and the rule varies by DISCOM, so the check comes first and enhancement of the load is the legitimate route to a larger plant. Splitting into three plants on one connection is the tempting workaround, but the connection is still one service and the total capacity is still what is assessed.",
        difficulty: "Medium",
        skill: "Sanctioned load",
      },
      {
        n: 6,
        question:
          "Why can an east and west split array justify a higher DC to AC ratio than a single south-facing array?",
        options: [
          "East and west modules produce a higher voltage",
          "Its generation curve is broader and flatter, so it reaches the inverter limit less often",
          "Split arrays are exempt from clipping because each face has its own tracker",
          "West facing modules run cooler and so produce more power",
        ],
        answer: 1,
        explanation:
          "Clipping depends on the shape of the curve, and a split array spreads output across the morning and afternoon with a lower midday peak, so more kWp can be added before the inverter limit is reached. Separate trackers help each face find its own maximum power point, but they do not remove clipping, which is set by the shared AC output limit.",
        difficulty: "Hard",
        skill: "Inverter clipping",
      },
      {
        n: 7,
        question:
          "A design has a DC to AC ratio of 1.2 and passes the manufacturer's maximum DC input power check. What still needs verifying?",
        options: [
          "Nothing further, since the power ratio covers the DC side",
          "That the strings per tracker times module Isc is within the tracker's input current rating",
          "That the array kWp equals the sanctioned load exactly",
          "That the modules are all from the same production week",
        ],
        answer: 1,
        explanation:
          "Power and current are separate limits, and a compliant power ratio can still put too many parallel strings on one tracker input and exceed its current rating. Matching kWp to sanctioned load exactly is not the requirement either, since the permitted capacity is defined by the DISCOM rule rather than by equality.",
        difficulty: "Hard",
        skill: "DC to AC ratio",
      },
    ],
  },

  31111: {
    topicId: 31111,
    title: "Drawing the single line diagram for a 5 kW plant",
    summary:
      "The single line diagram is the one document that the utility inspector, the safety auditor and the technician who services the plant in year five all read. You learn to draw one for a 5 kW rooftop system, block by block from array to net meter, annotated with the ratings that make it checkable.",
    concepts: [
      "Single line diagram",
      "DC side and AC side boundary",
      "Device annotation and ratings",
      "Point of interconnection",
      "Earthing shown on the drawing",
      "As-built revision",
    ],
    glossary: {
      "Single line diagram":
        "A drawing that shows an electrical installation as one line per circuit, with each device as a symbol in the order the current passes through it. It shows connectivity and ratings, not physical layout or cable routes. Often written SLD.",
      "DC isolator":
        "A switch rated to break direct current, fitted between the array and the inverter, so the DC side can be opened for work. DC arcs do not self-extinguish, so an AC switch is not a substitute.",
      "Array junction box":
        "The enclosure where string cables are brought together, and where string fuses and DC surge protection sit if the design calls for them. Also called a combiner box.",
      "Point of interconnection":
        "The place where the plant is joined to the utility supply, usually the consumer distribution board or the meter board. Everything on the utility side of it is the DISCOM's, and everything on the other side is the installation.",
      "Bidirectional meter":
        "The utility meter under a net metering arrangement, which records both energy imported from the grid and energy exported to it as separate registers.",
      "As-built drawing":
        "The version of the drawing revised to match what was actually installed, issued after commissioning. It is the drawing that matters, because the design version is a proposal.",
    },
    body: {
      Beginner: `<p>A single line diagram is a simple picture of the electrical system. Every circuit is drawn as one line, even though it is really two or three wires, and every device is drawn as a small symbol in the order that the current passes through it. It is not a map of the roof. It does not show where the cables run. It shows what is connected to what, and at what rating.</p>
<h2>Why you draw one</h2>
<ul>
<li>The utility inspector reads it before approving the plant.</li>
<li>The person who comes to service the plant in five years has nothing else to work from.</li>
<li>Drawing it forces you to notice a missing isolator or a missing earth before you buy the material.</li>
</ul>
<h2>The blocks, in order</h2>
<p>For a 5 kW rooftop plant, follow the current from the sun to the meter:</p>
<ol>
<li><strong>The array.</strong> The modules, grouped into strings.</li>
<li><strong>The array junction box</strong>, if there is one, where string cables come together.</li>
<li><strong>The DC isolator.</strong> The switch that lets you open the DC side.</li>
<li><strong>The inverter.</strong> Where DC becomes AC.</li>
<li><strong>The AC isolator and the MCB.</strong> Protection on the AC side.</li>
<li><strong>The RCCB</strong>, which trips on earth leakage.</li>
<li><strong>The consumer distribution board</strong>, the existing board in the house or shop.</li>
<li><strong>The bidirectional meter</strong>, then the utility supply.</li>
</ol>
<p>Below all of it, a separate line goes down to the <strong>earth electrode</strong>, with the module frames, the mounting structure and the inverter body all bonded to it.</p>
<h2>What you write next to each block</h2>
<p>A symbol on its own tells the reader nothing. Next to each one, write the rating:</p>
<ul>
<li>Array: number of modules, watt rating, and the string arrangement, for example two strings of twelve modules of 440 W.</li>
<li>DC isolator: current and voltage rating, for example 25 A, 1000 V DC.</li>
<li>Inverter: make, model and kW rating.</li>
<li>AC MCB: rating and curve, for example 32 A curve C.</li>
<li>Cables: size and length, for example 4 sq mm DC, 6 sq mm AC.</li>
</ul>
<p>Draw it neatly by hand on a sheet if you have no software. A clear hand drawing that is correct is worth more than a printed one that does not match the plant.</p>`,
      Intermediate: `<p>The single line diagram is the document that decides whether your work can be inspected. An inspector cannot verify a plant against a description; they verify it against a drawing, device by device. So draw it before you install, and revise it after.</p>
<h2>The 5 kW example</h2>
<p>Take the plant from the previous topic: fifteen modules of 440 Wp in one string, 6.6 kWp, on a 5 kW single phase inverter with two trackers, a DC to AC ratio of 1.32. Draw it left to right in a single row of blocks.</p>
<ol>
<li><strong>Array block.</strong> Label it PV Array, 15 x 440 Wp, 6.6 kWp, one string, Voc(STC) 742.5 V, Isc 11.3 A.</li>
<li><strong>String cable.</strong> One line for the pair, annotated 1C x 4 sq mm DC solar cable, double insulated, UV resistant, run length in metres.</li>
<li><strong>DC surge protective device</strong>, drawn as a device to earth, annotated Type 2, 1000 V DC.</li>
<li><strong>DC isolator.</strong> Annotated 1000 V DC, 25 A, lockable, mounted within reach of the inverter.</li>
<li><strong>Inverter.</strong> Make, model, 5 kW, single phase 230 V, MPPT range, two trackers.</li>
<li><strong>AC isolator</strong>, then <strong>MCB 32 A curve C</strong>, then <strong>RCCB 40 A, 30 mA</strong>.</li>
<li><strong>AC cable</strong>, annotated 3C x 6 sq mm copper, length in metres.</li>
<li><strong>Consumer distribution board</strong>, marked as the point of interconnection.</li>
<li><strong>Bidirectional meter</strong>, then the utility service line, marked as the DISCOM boundary.</li>
</ol>
<h2>Earthing is part of the drawing, not an afterthought</h2>
<p>Show a separate earth bar and a line to it from each of: module frames, mounting structure, inverter enclosure, DC surge device, AC surge device, and the AC earth conductor. Annotate the electrode type and the conductor size. If the drawing does not show earthing, an inspector has to assume it is not there.</p>
<h2>Conventions that make a drawing readable</h2>
<ul>
<li><strong>One line per circuit</strong>, with a tick mark and a number if you need to say how many conductors it carries.</li>
<li><strong>Flow left to right</strong>, source on the left, utility on the right. Every reader expects this order.</li>
<li><strong>DC on one side, AC on the other</strong>, with the inverter as the visible boundary and a note marking which side is which.</li>
<li><strong>A legend</strong> in a corner explaining any symbol that is not standard.</li>
<li><strong>A title block</strong> with site name, consumer number, capacity, drawn by, date and revision number.</li>
</ul>
<h2>The schedule that goes with it</h2>
<p>Ratings on the drawing get crowded. Put a table underneath instead, one row per item, with the tag used on the drawing, the description, the rating and the make. The drawing then carries only tags, and stays legible.</p>
<h2>Revision after commissioning</h2>
<p>If four modules moved to another face during installation, or the isolator went in a different position, the drawing is now wrong. Mark up the changes on site in pen, redraw, and issue it as the as-built revision with a new date. A plant handed over with a design drawing that does not match it will fail its next inspection, and the technician who trusts it later is being misled by your paperwork.</p>`,
      Advanced: `<p>A drawing is rejected far more often for what it omits than for what it draws wrongly. Work through the omissions in the order an inspector finds them.</p>
<h2>The five omissions inspectors find first</h2>
<ol>
<li><strong>No DC isolator, or one shown but not rated for DC.</strong> An AC-rated switch in a DC circuit cannot break the arc, and a drawing that does not state the DC rating gives the inspector no way to tell which was fitted.</li>
<li><strong>No earthing detail.</strong> Frames, structure and enclosures each need to be shown bonded, with the conductor size stated. A single unlabelled earth symbol is not a detail.</li>
<li><strong>No surge protection, or surge devices shown without a type.</strong> A rooftop array is an exposed structure and the DC side needs its own device, not just the AC one.</li>
<li><strong>No point of interconnection marked.</strong> The inspector needs to see exactly where the plant meets the consumer installation and where the DISCOM boundary is.</li>
<li><strong>Ratings absent or inconsistent.</strong> An MCB drawn without a rating, or a 32 A MCB feeding a 4 sq mm cable, gets the file returned.</li>
</ol>
<h2>Consistency checks to run on your own drawing</h2>
<ul>
<li>Does the array kWp on the drawing match the kWp on the application form and the module count on the delivery note?</li>
<li>Is the AC breaker rating above the inverter's stated maximum continuous output current, and is the cable rated for that current at its actual length and installation method?</li>
<li>Is the DC isolator voltage rating above the cold-corrected string Voc, not just above the STC value?</li>
<li>Does the string configuration on the drawing match what the inverter's two trackers can accept, including current per tracker?</li>
<li>Is the RCCB type appropriate for the inverter, and is that stated? Some inverter topologies require a type that responds to DC residual components, and the manual says which.</li>
</ul>
<h2>Where drawings get complicated</h2>
<p>A hybrid plant with a battery adds a whole branch: battery bank with its own isolator and fuse, a charge path, and a changeover or backup output that must be shown as electrically separate from the grid-connected output. The critical thing to draw correctly is that the backup circuit cannot energise the utility line when the grid is down. If the drawing does not make the islanding boundary obvious, expect questions, because that is the one failure that endangers a lineman.</p>
<h2>Drawing as a design tool</h2>
<p>Draw before you order material, not after. Half the errors this course teaches you to avoid show up as a gap on a sheet of paper: an isolator with nowhere to be mounted, an earth conductor that has to cross a roof it cannot be fixed to, a combiner box specified for a single string that needs no combining. Twenty minutes with a pencil is the cheapest design review available.</p>
<h2>Handover</h2>
<p>The owner gets a copy of the as-built drawing, the schedule, the datasheets and the commissioning test results in one folder. Photograph the folder before you leave, because the next person who asks you for it will ask three years later.</p>`,
      Expert: `<h2>Block order, memorised</h2>
<p>Array, junction box, DC surge device, DC isolator, inverter, AC isolator, MCB, RCCB, consumer board, bidirectional meter, grid. Earth bar underneath, bonded to frames, structure, inverter body and both surge devices.</p>
<h2>Annotation schedule</h2>
<table>
<tr><td><strong>Tag</strong></td><td><strong>Item</strong></td><td><strong>Annotation it must carry</strong></td></tr>
<tr><td>PV1</td><td>Array</td><td>Module make, Wp, count, strings, kWp, Voc and Isc at STC</td></tr>
<tr><td>W1</td><td>DC cable</td><td>Cores, size in sq mm, solar rated, run length</td></tr>
<tr><td>SPD1</td><td>DC surge device</td><td>Type, DC voltage rating</td></tr>
<tr><td>Q1</td><td>DC isolator</td><td>DC voltage rating, current rating, lockable</td></tr>
<tr><td>INV1</td><td>Inverter</td><td>Make, model, kW, phase, MPPT range, trackers</td></tr>
<tr><td>Q2 / F1</td><td>AC isolator and MCB</td><td>Current rating and curve</td></tr>
<tr><td>RCD1</td><td>RCCB</td><td>Current rating, sensitivity in mA, type</td></tr>
<tr><td>W2</td><td>AC cable</td><td>Cores, size, material, run length</td></tr>
<tr><td>E1</td><td>Earth electrode</td><td>Type, conductor size, number of electrodes</td></tr>
<tr><td>M1</td><td>Meter</td><td>Bidirectional, consumer number, DISCOM boundary marked</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>One line per circuit, source left, grid right, inverter as the DC to AC boundary.</li>
<li>A symbol without a rating is decoration.</li>
<li>Earthing shown, or the inspector assumes it is absent.</li>
<li>The drawing that counts is the as-built one, dated and revision numbered.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Two inverters on one connection.</strong> Draw both, and show the combined AC current at the point of interconnection, because that is the number the breaker and the approval are checked against.</li>
<li><strong>Three phase service, single phase inverter.</strong> Mark which phase the plant is connected to, and check the DISCOM rule on the capacity permitted on one phase.</li>
<li><strong>Battery backup.</strong> Show the backup output as a separate distribution path and make the islanding boundary explicit.</li>
<li><strong>Existing plant being extended.</strong> Show the existing installation greyed or dashed and the new work solid, so the inspector can see what changed.</li>
</ul>
<h2>Sign-off checklist</h2>
<ol>
<li>Title block complete: site, consumer number, capacity, date, revision, drawn and checked by.</li>
<li>Every device tagged, every tag present in the schedule.</li>
<li>Ratings cross-checked against the string calculation and the cable calculation.</li>
<li>Earthing and both surge devices drawn.</li>
<li>Point of interconnection and DISCOM boundary marked.</li>
<li>Revised to as-built after commissioning and handed over with the test results.</li>
</ol>`,
    },
  },

  31112: {
    topicId: 31112,
    title: "Roof types, ballasted mounts and penetrating mounts",
    summary:
      "The mounting method is chosen by the roof, not by the installer's habit, because a fixing that suits an RCC slab will leak a tin shed and crack an asbestos sheet. You learn to identify the common Indian roof types, choose between ballasted and penetrating mounts, and trace the load path from the module clamp down into the building.",
    concepts: [
      "Ballasted mounting",
      "Penetrating mounting and waterproofing",
      "Sheet roof fixing",
      "Fragile roof",
      "Load path to the structure",
      "Galvanic corrosion",
    ],
    glossary: {
      Ballast:
        "Weight, usually precast concrete blocks or cast-in-situ pedestals, used to hold a mounting structure down without drilling into the roof. It resists both uplift and sliding.",
      Penetration:
        "Any fixing that passes through the roof surface. It transfers load directly into the structure and creates a hole that must be permanently sealed against water.",
      Purlin:
        "The horizontal structural member that a roof sheet is fixed to, spanning between trusses or rafters. Fixings into a sheet roof must reach a purlin, because the sheet itself carries no load.",
      "Standing seam clamp":
        "A clamp that grips the raised seam of a metal roof and holds the rail without any screw entering the sheet. It is the preferred non-penetrating fixing on a standing seam roof.",
      "Hook bolt":
        "A J-shaped bolt that passes through the crown of a corrugated or trapezoidal sheet and hooks around the purlin beneath, sealed with a bonded washer.",
      "Galvanic corrosion":
        "Corrosion that occurs where two different metals are in contact in the presence of moisture, with the less noble metal eating away. Aluminium against bare mild steel or copper is the pairing to avoid on a roof.",
    },
    body: {
      Beginner: `<p>Before you decide how to fix a structure, look at what you are fixing it to. Four roof types cover most of the work in Telangana.</p>
<h2>The four roofs</h2>
<ul>
<li><strong>RCC flat roof.</strong> A concrete slab. Strong, walkable, and the easiest to work on. Common on houses, schools and offices.</li>
<li><strong>Metal sheet roof.</strong> Trapezoidal or corrugated GI sheet on purlins. Common on sheds, workshops, poultry units and godowns.</li>
<li><strong>Asbestos or fibre cement sheet.</strong> Looks similar to metal but is brittle. <strong>Never walk on it.</strong> It gives way without warning.</li>
<li><strong>Tiled roof.</strong> Mangalore tiles on timber rafters. Fixings go into the rafter, never into the tile.</li>
</ul>
<h2>Two ways to hold a structure down</h2>
<p><strong>Ballasted</strong> means you do not drill. The structure sits on the roof and concrete blocks hold it down by weight. This suits an RCC slab, especially where the owner does not want holes and the waterproofing is sound.</p>
<p><strong>Penetrating</strong> means you fix into the structure with bolts or screws. This is stronger, but every hole is a possible leak, so every hole must be sealed properly.</p>
<h2>The rule that decides it</h2>
<p>Ask where the load goes. The wind pulls on the module, the module pulls on the clamp, the clamp pulls on the rail, the rail pulls on the leg, and the leg has to be held by something solid. On a slab that is the slab itself. On a sheet roof it is the <strong>purlin</strong> underneath, never the sheet. A screw into the middle of a sheet holds nothing and will tear out in the first storm.</p>
<h2>Sealing</h2>
<p>On a sheet roof, fix on the <strong>crown</strong> of the corrugation, not in the valley where water runs. Use a screw or hook bolt with a bonded washer, tightened until the rubber just spreads. Over-tightening squashes the washer and the seal fails.</p>
<p>On an RCC roof, if you drill, you have broken the waterproofing layer. Seal the hole and build up around the base so that water cannot stand against it.</p>
<h2>Metals that fight</h2>
<p>Aluminium rails against bare mild steel or copper will corrode where they touch, especially in a damp or dusty place. Use galvanised or stainless fasteners and keep the metals the installation was designed with.</p>`,
      Intermediate: `<p>Mounting is a structural job done by an electrical trade, which is why it is the part most often done by habit. Work through the roof, the fixing and the load path in that order every time.</p>
<h2>RCC flat roof</h2>
<p>Two options, and the choice is usually the owner's waterproofing.</p>
<ul>
<li><strong>Ballasted.</strong> Precast blocks or cast-in-situ concrete pedestals carry the structure. Nothing penetrates. You must then confirm two things: that the slab can carry the added dead load, and that the ballast is enough to resist wind uplift at the position it sits in, which is far higher near the roof edges and corners than in the middle.</li>
<li><strong>Anchored.</strong> Chemical or mechanical anchors into the slab, which need far less weight and hold better, but break the waterproofing membrane. Seal each anchor, build a small raised collar so water does not pond against the base, and record the positions on the drawing.</li>
</ul>
<p>Either way, keep a setback from the parapet, keep clear walking routes between rows for cleaning, and never block a roof drain outlet.</p>
<h2>Metal sheet roof</h2>
<p>Identify the profile first. A trapezoidal or corrugated sheet is fixed with self-drilling screws or hook bolts through the crown into the purlin, each with a bonded washer. A standing seam roof takes non-penetrating seam clamps, which is the better answer wherever the profile allows it, because it leaves the roof intact.</p>
<p>Find the purlins before you drill. Mark their lines with chalk from below or by probing, set the rail out so that every foot lands on a purlin, and never adjust a foot to a convenient place on a bare sheet. Check the purlin spacing against the rail span the structure supplier allows, and check the sheet and purlin condition: a rusted purlin is not an anchorage.</p>
<h2>Asbestos and fibre cement</h2>
<p>Treat these as fragile roofs. Nobody walks on them at any time. Access is by crawling boards or roof ladders spanning at least two purlins, and fixing is by hook bolt through the crown so that no load is taken by the sheet. Where the sheet is old and weathered, drilling it at all is a risk, and the honest recommendation to the owner may be a ground-mounted or shed-frame structure instead.</p>
<h2>Tiled roof</h2>
<p>Lift the tile, fix a tile hook or bracket to the rafter, replace the tile so that it seats over the hook without being propped or cracked. The tile is a rain cover, not a structural member. If a tile does not seat properly it will lift in wind and the leak is blamed on the solar plant.</p>
<h2>Materials and corrosion</h2>
<ul>
<li>Structure: hot dip galvanised mild steel or anodised aluminium. Check the coating specification, because a thin coating on a rural site fails within a few monsoons.</li>
<li>Fasteners: stainless steel, commonly grade 304 for inland sites.</li>
<li>Keep aluminium away from bare mild steel and from copper. Where they must meet, use an isolating washer or bush.</li>
<li>Cut ends of galvanised sections are unprotected. Treat every cut and drilled edge with a zinc-rich coating before it goes up.</li>
</ul>
<h2>Before you fix anything</h2>
<p>Confirm the roof can take the load, confirm you know where the structure below is, and confirm the owner knows and accepts that penetrations are being made. A mounting argument after the event is always about a hole nobody agreed to.</p>`,
      Advanced: `<p>Almost every mounting failure traces to one of three things: a load that never reached the structure, a hole that was never properly sealed, or a metal pairing nobody thought about.</p>
<h2>The load path, checked as a chain</h2>
<p>Module glass, module frame, clamp, rail, foot, roof structure, building. It fails at whichever link is weakest, and two links are routinely ignored.</p>
<ul>
<li><strong>The clamp position on the module.</strong> Manufacturers specify a permitted clamping zone along the long frame member. Clamping outside it, or clamping the short edge when the sheet permits only the long edge, changes the module's load rating and voids the warranty. It also cracks cells over time, which appears years later as hot spots.</li>
<li><strong>The rail span between feet.</strong> The structure supplier gives a maximum unsupported span for a given design load. Stretching it by a hundred millimetres to reach a convenient purlin is the most common on-site improvisation and it is a structural change.</li>
</ul>
<h2>Ballast is a location-dependent quantity</h2>
<p>Wind uplift on a flat roof is not uniform. The corner zones see the highest suction, the perimeter strip the next highest, and the interior field the least. A ballast layout copied from the middle of the array to the corner is under-weighted exactly where the wind is strongest. Two consequences follow: keep a setback from the roof edge so that the array sits in the lower pressure zone where you can, and increase ballast at the perimeter and corners rather than distributing it evenly. Anything beyond a small standard system deserves a structural engineer's check of both the uplift and the slab's capacity to carry the ballast.</p>
<h2>Waterproofing, honestly</h2>
<ul>
<li>A penetration through an RCC roof is sealed at the time it is made, not at the end of the day. A hole left open through one afternoon shower is a call-back.</li>
<li>Silicone alone on a slab is not a waterproofing detail. The detail is a sealed anchor plus a raised base or a flashing collar so water cannot stand around it.</li>
<li>On sheet roofs, drilling in the valley is the classic error. The valley is the water channel. The crown is the only place a fixing belongs.</li>
<li>Over-torqued bonded washers leak. The washer should be compressed until the rubber just extends beyond the metal cup, not until it splits.</li>
<li>Photograph every penetration before it is covered, and hand the photographs over. A leak two monsoons later is otherwise unarguable.</li>
</ul>
<h2>Roof condition assessments people skip</h2>
<p>Age matters more than type. A twenty year old GI sheet with rusted purlins cannot be anchored regardless of what the drawing says. A slab with existing damp patches will be blamed for every future leak, so record its condition with photographs before you start. A shed roof carrying a fodder or fertiliser store beneath will have a corrosive atmosphere inside that eats fasteners from below, and that changes the material specification.</p>
<h2>Access and maintenance built into the layout</h2>
<p>Leave a walkway between rows wide enough to clean and to replace a module, keep the array clear of roof water outlets, and do not block the only path to a water tank. A layout that squeezes in two more modules by removing all access will cost more in service visits than the modules produce.</p>`,
      Expert: `<h2>Roof to fixing, at a glance</h2>
<table>
<tr><td><strong>Roof</strong></td><td><strong>Usual fixing</strong></td><td><strong>The thing that goes wrong</strong></td></tr>
<tr><td>RCC slab</td><td>Ballast, or chemical anchor with sealed collar</td><td>Ballast even across the roof, so corners are under-weighted</td></tr>
<tr><td>Trapezoidal GI</td><td>Self-drilling screw on the crown into the purlin</td><td>Fixed to the sheet, or fixed in the valley</td></tr>
<tr><td>Standing seam</td><td>Non-penetrating seam clamp</td><td>Drilled anyway, out of habit</td></tr>
<tr><td>Asbestos or fibre cement</td><td>Hook bolt on the crown, no foot traffic at all</td><td>Someone steps on it</td></tr>
<tr><td>Mangalore tile</td><td>Tile hook fixed to the rafter</td><td>Tile propped on the hook and lifts in wind</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>The sheet carries nothing. The purlin does.</li>
<li>Fix on the crown, never in the valley.</li>
<li>Seal a penetration the moment you make it.</li>
<li>Clamp inside the manufacturer's zone, or the warranty is gone.</li>
<li>Aluminium touching bare steel or copper corrodes. Isolate it.</li>
<li>Ballast goes up at the edges and corners, not evenly.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Curved or barrel roofs.</strong> Rail spans and tilt change along the curve, so each row needs its own leg height and the array can shade itself unexpectedly.</li>
<li><strong>Parapet-heavy roofs.</strong> A tall parapet reduces uplift in the interior but casts a shadow at low sun angles that no one measured in the site survey.</li>
<li><strong>Roofs over corrosive processes.</strong> Poultry sheds, dairies and fertiliser stores attack fasteners from underneath. Specify a higher grade or an isolated fixing.</li>
<li><strong>Roofs with a future.</strong> If the owner intends another floor, a ballasted array can be relocated; an anchored one cannot without repairing every penetration.</li>
</ul>
<h2>Pre-fix checklist</h2>
<ol>
<li>Roof type identified, condition photographed, fragile areas and skylights marked and barricaded.</li>
<li>Purlin or rafter lines located and marked before any drilling.</li>
<li>Clamp zone and rail span confirmed against the module and structure documents.</li>
<li>Ballast or anchor design confirmed for the position on the roof, with corner and edge zones treated separately.</li>
<li>Fastener grade and isolation washers on site, cut edges of galvanised steel treated.</li>
<li>Owner informed in writing where penetrations will be made, and every penetration sealed and photographed as it is made.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "You are fixing rails to a trapezoidal GI sheet roof. Where must the fixing land?",
        options: [
          "In the valley of the sheet, where the metal is flat and easy to drill",
          "On the crown of the sheet, with the screw reaching a purlin beneath",
          "Anywhere on the sheet, provided a bonded washer is used",
          "Through the overlap between two sheets, which is the strongest point",
        ],
        answer: 1,
        explanation:
          "The purlin is the only member that can carry load and the crown is the only place that keeps the fixing out of the running water, so both conditions have to be met at once. Fixing in the valley is tempting because it is flat and easy to drill, but the valley is the drainage channel and every screw there becomes a leak.",
        difficulty: "Easy",
        skill: "Sheet roof fixing",
      },
      {
        n: 2,
        question:
          "A ballasted array is laid out on a flat RCC roof with the same weight of concrete blocks under every row. What is wrong with this?",
        options: [
          "Nothing, since uniform ballast is the accepted practice",
          "The interior rows are over-weighted and overload the slab",
          "Wind uplift is highest at the roof edges and corners, so those positions are under-weighted",
          "Ballast must always be replaced by anchors on an RCC roof",
        ],
        answer: 2,
        explanation:
          "Suction is far greater in the corner and perimeter zones of a flat roof, so an even layout puts the least holding force exactly where the wind is strongest. Uniform ballast feels correct because the array is identical everywhere, but the wind pressure over it is not.",
        difficulty: "Medium",
        skill: "Ballasted mounting",
      },
      {
        n: 3,
        question:
          "The roof is an ageing asbestos cement sheet. What is the correct working method?",
        options: [
          "Walk only along the lines of the purlins, where the sheet is supported",
          "Use crawling boards or roof ladders spanning at least two purlins, and do not step on the sheet at all",
          "Walk on the sheet but distribute weight by kneeling rather than standing",
          "Lay a tarpaulin over the sheet and work on top of it",
        ],
        answer: 1,
        explanation:
          "Fibre cement is brittle and can fail without warning even over a purlin, so the load must be spread by boards that bridge the structure and no one stands on the sheet. Walking on the purlin line is the dangerous half-measure, because you cannot reliably see the purlin from above and a weathered sheet can crack beside it.",
        difficulty: "Easy",
        skill: "Fragile roof",
      },
      {
        n: 4,
        question:
          "Why is clamping a module outside the manufacturer's stated clamping zone a real problem and not just a paperwork issue?",
        options: [
          "It changes the module's electrical rating",
          "It alters how load is carried by the frame, can crack cells over time, and voids the warranty",
          "It prevents the module from being earthed properly",
          "It has no effect if stainless clamps are used",
        ],
        answer: 1,
        explanation:
          "The permitted zone is where the frame was tested to carry wind and snow load, so clamping elsewhere concentrates stress into the laminate and produces cell cracks that show up later as hot spots. Assuming a better clamp material fixes it is the trap: the failure is in the module, not in the clamp.",
        difficulty: "Hard",
        skill: "Load path to the structure",
      },
      {
        n: 5,
        question:
          "An aluminium rail is to be bolted to a bare mild steel bracket on a roof in a dairy shed. What should you do?",
        options: [
          "Nothing, since both metals are used outdoors routinely",
          "Use an isolating washer or bush between the metals and a stainless fastener",
          "Use a copper washer to improve the electrical bond",
          "Paint the aluminium so that it becomes the sacrificial metal",
        ],
        answer: 1,
        explanation:
          "Dissimilar metals in a damp atmosphere set up galvanic corrosion, so separating them mechanically and using a compatible fastener is the standard remedy. A copper washer is the worst available choice, because copper against aluminium is one of the most aggressive pairings there is.",
        difficulty: "Medium",
        skill: "Galvanic corrosion",
      },
      {
        n: 6,
        question:
          "You have anchored a foot into an RCC slab and the waterproofing membrane is now pierced. What is an adequate detail?",
        options: [
          "A bead of silicone around the bolt, applied at the end of the day",
          "A sealed anchor plus a raised base or flashing collar so that standing water cannot reach the penetration",
          "Nothing, because the foot itself covers the hole",
          "A layer of cement mortar spread over the whole area",
        ],
        answer: 1,
        explanation:
          "Water on a flat roof ponds, so the detail has to lift the penetration above the water line as well as seal it, which is what a raised base or collar does. Silicone alone applied later is the common shortcut, and it fails because the hole is exposed in the meantime and the sealant is not a waterproofing layer on its own.",
        difficulty: "Medium",
        skill: "Penetrating mounting and waterproofing",
      },
      {
        n: 7,
        question:
          "The purlin spacing on a shed is wider than the maximum rail span the structure supplier permits. What is the correct action?",
        options: [
          "Stretch the rail span slightly, since the supplier's figure includes a safety factor",
          "Fix the extra feet into the sheet between purlins to make up the support",
          "Add secondary members or change the structure design so every foot lands on a purlin within the permitted span",
          "Reduce the module tilt so that the wind load falls and the span becomes acceptable",
        ],
        answer: 2,
        explanation:
          "The span limit and the requirement to land on structure are both hard constraints, so the design must change to satisfy them, usually by adding a secondary member spanning between purlins. Reducing tilt does lower wind load, but it does not give the rail the support it lacks, so the span problem remains.",
        difficulty: "Hard",
        skill: "Load path to the structure",
      },
    ],
  },

  31113: {
    topicId: 31113,
    title: "Structure loading, wind speed and tilt angle",
    summary:
      "A rooftop array is a sail before it is a generator, and the load case that decides the structure is wind uplift rather than the weight of the modules. You learn where the design wind speed comes from, how tilt trades yield against load and row spacing, and how to work out the clear gap between rows so the array does not shade itself.",
    concepts: [
      "Dead load and imposed load",
      "Wind uplift",
      "Basic wind speed",
      "Tilt angle selection",
      "Inter-row shading and row pitch",
      "Ballast and anchorage capacity",
    ],
    glossary: {
      "Dead load":
        "The permanent weight of the array itself: modules, rails, clamps, feet and any ballast. It acts downwards and is the easiest load to calculate, because it does not change.",
      "Wind uplift":
        "The suction that develops over and under a tilted array in wind, acting to lift it off the roof. It is usually the governing load case, and it acts upwards, against the dead load.",
      "Basic wind speed":
        "The reference wind speed for a location, read from the map in the Indian code for wind loads on structures, IS 875 Part 3. It is then modified by factors for terrain, building height and topography before any pressure is calculated.",
      "Tilt angle":
        "The angle of the module plane above horizontal. A tilt close to the site latitude gives the highest annual energy for a fixed south-facing array in India.",
      Azimuth:
        "The compass direction the module face points. True south is the reference for a site in India, and deviation east or west of south costs a small amount of annual yield.",
      "Row pitch":
        "The distance from the front of one row to the front of the next. It is the base length of a tilted row plus the clear gap needed to keep the row behind out of shadow.",
    },
    body: {
      Beginner: `<p>Once the modules are on the roof, two forces act on them. The first is easy: their own weight, pressing down. The second is the one that takes structures off roofs: wind.</p>
<h2>Wind lifts, it does not just push</h2>
<p>A tilted module in wind behaves like an aircraft wing. Air moving over it produces suction on the upper surface, and air getting underneath pushes up. The result is a force trying to lift the array off the roof. This is why a structure is held down, not just stood up.</p>
<p>Weight helps you here. The array and any ballast press down and resist the lift. But the wind can exceed the weight, and then only the fixings or the ballast hold the array in place.</p>
<h2>Where the design wind speed comes from</h2>
<p>India has a code for this, IS 875 Part 3, with a map of basic wind speeds. You read the speed for the district off that map. It is then adjusted for the surroundings, for how high the building is, and for the shape of the ground. Never take a wind speed from memory or from another job.</p>
<h2>Tilt angle</h2>
<p>For a fixed array in India, pointing south, the best annual output comes at a tilt roughly equal to the latitude of the site. Telangana sits between about 17 and 19 degrees north, so tilts in the range of about 15 to 20 degrees are usual.</p>
<p>Lower tilt has two effects. Wind load falls, which is good. But rain no longer runs off well, so dust builds up and stays. Below about ten degrees, cleaning becomes a regular job rather than an occasional one.</p>
<h2>Rows must not shade each other</h2>
<p>A tilted row casts a shadow behind it, longest in winter when the sun is low. If the next row sits in that shadow in the morning, it loses output. So rows are spaced apart, and the higher the tilt, the wider the gap has to be.</p>
<p>That is the trade you make on a small roof. Higher tilt gives each module more energy but fits fewer modules. Lower tilt fits more modules but each gives a little less and needs more cleaning.</p>
<h2>The check nobody should skip</h2>
<p>Ask whether the roof can carry what you are putting on it. Modules and structure add weight, and ballast adds a great deal more. On an old building, or any array beyond a small standard system, that is a question for a structural engineer, not for the installer.</p>`,
      Intermediate: `<p>Structural design for a rooftop array is a comparison of two loads acting in opposite directions, plus a spacing calculation that decides how much of the roof you can actually use.</p>
<h2>Dead load</h2>
<p>A typical crystalline module of about 2.2 square metres weighs in the region of twenty five kilograms, which is roughly eleven to twelve kilograms per square metre of array. Add rails, clamps and feet and a mounted array is commonly in the region of fifteen kilograms per square metre before any ballast. Ballast is what changes the picture: it can be several times the weight of the array itself.</p>
<p>Worked, for fifteen modules of 2.2 square metres:</p>
<ul>
<li>Array area is 15 x 2.2, which is 33 square metres.</li>
<li>At 15 kg per square metre, the mounted array weighs about 495 kg, roughly 4.9 kN.</li>
</ul>
<h2>Wind uplift</h2>
<p>The design method is set out in IS 875 Part 3. You read the basic wind speed for the site from its map, apply the factors for terrain category, building height and topography to get a design wind speed, convert that to a design wind pressure, and then apply pressure coefficients for the array geometry and its position on the roof. Inland Telangana sits in one of the lower bands of the map, but you read the value for the district rather than assuming it, and the factors can raise the design pressure considerably on a tall or exposed building.</p>
<p>Suppose the structural check for this roof produces a net uplift of 0.6 kN per square metre in the perimeter zone. Then:</p>
<ul>
<li>Uplift on 33 square metres is 19.8 kN, about 2020 kgf.</li>
<li>The array's own weight of 4.9 kN resists part of it, leaving about 14.9 kN to be held.</li>
<li>Applying a factor of safety, the holding force required is well over two tonnes.</li>
</ul>
<p>Two conclusions follow, and both are practical. Ballasting alone can demand a weight of concrete that the slab may not be able to carry, and the interior of the roof needs far less than the corners, so the design has to be zoned rather than uniform.</p>
<h2>Tilt angle in practice</h2>
<table>
<tr><td><strong>Tilt</strong></td><td><strong>Effect</strong></td></tr>
<tr><td>Near latitude, about 15 to 20 degrees in Telangana</td><td>Highest annual yield for a fixed south-facing array</td></tr>
<tr><td>Lower, 10 to 15 degrees</td><td>Less wind load, tighter row spacing, more modules on the roof, more soiling</td></tr>
<tr><td>Below 10 degrees</td><td>Rain no longer washes the glass properly, and cleaning becomes routine work</td></tr>
<tr><td>Higher than latitude</td><td>Favours winter output, costs summer output, raises wind load and spacing</td></tr>
</table>
<h2>Row spacing</h2>
<p>Design against the worst case, which is the winter solstice at about nine in the morning solar time. For a site near seventeen and a half degrees north the sun is then about thirty degrees above the horizon.</p>
<p>Take a module 2.28 m long mounted in portrait at 20 degrees tilt:</p>
<ul>
<li>Vertical rise of the row is 2.28 x sin 20, which is 0.78 m.</li>
<li>Horizontal base of the row is 2.28 x cos 20, which is 2.14 m.</li>
<li>Shadow length behind the row is 0.78 divided by tan 30, which is 1.35 m.</li>
<li>Row pitch is base plus clear gap, so about 2.14 plus 1.35, which is 3.49 m.</li>
</ul>
<p>Mount the same module in landscape and the rise falls to about 0.39 m, the shadow to about 0.67 m, and far more rows fit on the same roof. That is why landscape mounting is common on constrained rooftops.</p>`,
      Advanced: `<p>The structural calculation is done by someone qualified to do it. Your job is to know what governs it, to recognise when a standard design has been applied to a roof it does not suit, and to get the spacing right, because spacing is the part left to the installer.</p>
<h2>What actually governs</h2>
<ul>
<li><strong>Uplift, not weight.</strong> A structure that is comfortably strong in compression can still be lifted. Every check is uplift minus dead load, and the fixings carry the difference.</li>
<li><strong>Position on the roof.</strong> Corner zones see the highest suction, perimeter next, interior least. A setback from the edge is the cheapest way to reduce the load, and it also gives you access to clean and to service.</li>
<li><strong>Building height and terrain.</strong> The same district map value produces a much higher design pressure on a four storey building in open ground than on a single storey house among other buildings, because the height and terrain factors differ.</li>
<li><strong>Local topography.</strong> A building on a ridge or the crest of a slope sees accelerated flow and a topography factor above one.</li>
</ul>
<h2>Where standard designs get misapplied</h2>
<p>Structure suppliers publish a standard design certified for a stated wind speed, tilt, module size and rail span. Every one of those is a condition. A design certified for a 20 degree tilt and a 1.7 metre rail span, erected at 25 degrees with feet 2.1 metres apart because the purlins fell there, is no longer a certified design and no one has checked it. If the site does not match the certification, the design changes, not the certification.</p>
<h2>Row spacing beyond the simple formula</h2>
<p>The shadow length calculation gives the full length of the shadow, cast directly away from the sun. What you must clear in the north-south direction is the north-south component of that shadow, which is the shadow length multiplied by the cosine of the sun's azimuth from due south. At nine in the morning on the solstice the sun is roughly forty five degrees east of south, so the component is about seventy per cent of the raw figure, and the 1.35 m from the simple calculation becomes about 0.96 m.</p>
<p>Designers make one of two choices. Use the raw shadow length and accept a slightly generous pitch, which is safe and costs roof area. Or use the corrected component and accept a small amount of shading in the first hour of a few winter weeks, which is what most commercial layouts do. What you must not do is use the corrected value and then also trim it for convenience.</p>
<h2>Shading is not a proportional loss</h2>
<p>A shadow across the bottom of one module does not reduce that module's output in proportion to the area covered. Cells in series carry the same current, so the shaded cells limit the whole substring until a bypass diode conducts and cuts out a third of the module. A narrow strip of shade across the bottom of a row can therefore knock out a large fraction of a string. This is why inter-row spacing is treated as a hard constraint and not as a place to gain two more modules.</p>
<h2>Practical notes from site</h2>
<ul>
<li>A parapet, a water tank, a stair headroom or a neighbour's future first floor all cast shadows the simple row calculation does not include. Walk the roof at the site survey with the winter sun path in mind.</li>
<li>Tilt is sometimes reduced purely to keep the array below the parapet line, which lowers wind load usefully and is a legitimate reason.</li>
<li>Where an array is tilted low to fit, tell the owner that cleaning will be more frequent, in writing, at quotation stage.</li>
<li>Never raise the tilt on site to improve output. It increases uplift, increases spacing and invalidates the structural design in one move.</li>
</ul>`,
      Expert: `<h2>The four sums</h2>
<table>
<tr><td><strong>Quantity</strong></td><td><strong>Expression</strong></td><td><strong>Worked</strong></td></tr>
<tr><td>Array area</td><td>modules x module area</td><td>15 x 2.2 = 33 sq m</td></tr>
<tr><td>Dead load</td><td>area x mass per sq m</td><td>33 x 15 = 495 kg, about 4.9 kN</td></tr>
<tr><td>Uplift</td><td>area x net design uplift pressure</td><td>33 x 0.6 kN/sq m = 19.8 kN</td></tr>
<tr><td>Row rise and shadow</td><td>L sin t, then rise / tan(altitude)</td><td>2.28 sin20 = 0.78 m, 0.78 / tan30 = 1.35 m</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Uplift governs. Dead load only reduces it.</li>
<li>Corners and edges take the highest suction. Zone the ballast.</li>
<li>Tilt near latitude for yield. Lower tilt for wind, space and cost, at the price of soiling.</li>
<li>Design the shadow for nine in the morning on the winter solstice.</li>
<li>Landscape mounting roughly halves the row gap of portrait mounting.</li>
<li>A certified standard design is certified only at its stated tilt, span and wind speed.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>East and west split arrays</strong> at low tilt need almost no inter-row gap in the north-south sense, which is a large part of why they suit crowded roofs.</li>
<li><strong>Arrays behind a tall parapet</strong> gain uplift relief but lose winter morning sun. Check the parapet shadow, not just the row shadow.</li>
<li><strong>Ground-mounted rows on a farm</strong> allow full latitude tilt and generous pitch, so the rooftop compromises disappear and the shading rule can be applied in full.</li>
<li><strong>Retrofit onto an existing array.</strong> Adding a row behind an existing one changes nothing about the old row and everything about the new one. Recalculate the pitch from the existing row's rise.</li>
<li><strong>Seasonal tilt adjustment</strong> is rarely worth the labour on a small rooftop plant and adds a maintenance task that will not be done.</li>
</ul>
<h2>Site checks before erection</h2>
<ol>
<li>Design wind speed and its source recorded, with terrain category and building height noted.</li>
<li>Tilt, rail span and foot spacing on site match the certified design exactly.</li>
<li>Row pitch measured on the roof, not scaled from a drawing.</li>
<li>Shadow sources other than the rows themselves identified and drawn on the layout.</li>
<li>Slab or purlin capacity confirmed for the dead load including ballast.</li>
<li>Perimeter setback maintained, with a walkway for cleaning and module replacement.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which load case usually governs the design of a rooftop mounting structure?",
        options: [
          "The dead weight of the modules and rails",
          "Wind uplift acting to lift the array off the roof",
          "The weight of a technician standing on the array",
          "Thermal expansion of the aluminium rails",
        ],
        answer: 1,
        explanation:
          "Wind produces suction over a tilted array that can exceed its own weight, so the fixings and ballast are sized against uplift and the dead load only counts as a reduction. Dead weight feels like the governing case because it is the load you can see and lift, but a structure never fails by being too heavy for itself.",
        difficulty: "Easy",
        skill: "Wind uplift",
      },
      {
        n: 2,
        question:
          "Where should the design basic wind speed for a site come from?",
        options: [
          "The map in IS 875 Part 3 for that location, then adjusted for terrain, height and topography",
          "The highest wind speed recorded locally in the last monsoon",
          "The structure supplier's standard certification, which covers all of India",
          "An average of the values used on nearby installations",
        ],
        answer: 0,
        explanation:
          "The code gives a mapped basic wind speed which is then modified by the site factors, and that sequence is what makes the result defensible to an engineer. Relying on the supplier's certification is the common shortcut, but that certification is valid only up to the wind speed it states, which may be below what the site requires.",
        difficulty: "Medium",
        skill: "Basic wind speed",
      },
      {
        n: 3,
        question:
          "A module 2.28 m long is mounted in portrait at 20 degrees tilt. The design sun altitude is 30 degrees. What is the raw shadow length behind the row?",
        options: [
          "About 0.78 m",
          "About 1.35 m",
          "About 2.14 m",
          "About 3.49 m",
        ],
        answer: 1,
        explanation:
          "The row rise is 2.28 times sin 20, which is 0.78 m, and the shadow is that rise divided by tan 30, giving 1.35 m. Answering 0.78 m stops at the rise, which is the height of the row rather than the length of the shadow it throws.",
        difficulty: "Hard",
        skill: "Inter-row shading and row pitch",
      },
      {
        n: 4,
        question:
          "Why does reducing the tilt below about ten degrees create a maintenance problem?",
        options: [
          "The modules run hotter and lose efficiency permanently",
          "Rain no longer runs off effectively, so dust accumulates and stays on the glass",
          "The mounting structure becomes unstable in wind",
          "The inverter can no longer track the lower string voltage",
        ],
        answer: 1,
        explanation:
          "A shallow slope does not let rainwater carry dirt off the glass, so soiling builds up and cleaning changes from occasional to routine. Wind load actually falls at lower tilt rather than rising, so instability is the opposite of what happens.",
        difficulty: "Medium",
        skill: "Tilt angle selection",
      },
      {
        n: 5,
        question:
          "A thin band of shade falls across the bottom cells of one module in a string. What is the likely effect?",
        options: [
          "That module loses output in proportion to the shaded area only",
          "A bypass diode conducts and a whole substring drops out, so the loss is far larger than the shaded area",
          "The string voltage rises because the shaded cells produce no current",
          "Nothing, because the inverter compensates by increasing the tracking voltage",
        ],
        answer: 1,
        explanation:
          "Cells in series must carry the same current, so shaded cells throttle the substring until a bypass diode conducts and cuts out roughly a third of the module. Assuming a proportional loss is the intuitive answer, and it is why row spacing is treated as optional by people who have not measured a partly shaded string.",
        difficulty: "Hard",
        skill: "Inter-row shading and row pitch",
      },
      {
        n: 6,
        question:
          "The purlin positions force a foot spacing wider than the certified design, so the crew raises the tilt slightly to compensate. What is wrong with this?",
        options: [
          "Nothing, since a higher tilt increases output",
          "Raising the tilt increases wind uplift and required row spacing, and neither the span nor the tilt now matches the certified design",
          "It only affects the row spacing, which can be corrected later",
          "It reduces the dead load, which makes the structure less stable",
        ],
        answer: 1,
        explanation:
          "Tilt and rail span are both conditions of the certification, so changing one to compensate for the other leaves an uncertified structure carrying a higher load than it was checked for. Treating it as only a spacing issue misses that the fixings are now resisting more uplift over a longer unsupported span.",
        difficulty: "Medium",
        skill: "Ballast and anchorage capacity",
      },
      {
        n: 7,
        question:
          "An array of 33 square metres has a mounted dead load of about 4.9 kN and faces a net design uplift of 19.8 kN. What does this tell you?",
        options: [
          "The array is safe, because the dead load and the uplift are of the same order",
          "Roughly 14.9 kN must be resisted by ballast or anchors before any factor of safety is applied",
          "The uplift is cancelled by the dead load, so only sliding needs to be checked",
          "The array must be made heavier until the dead load exceeds the uplift on its own",
        ],
        answer: 1,
        explanation:
          "Dead load subtracts from uplift, so the fixings or ballast carry the remaining 14.9 kN and a factor of safety is then applied on top of that. Making the array heavy enough to hold itself down by weight alone is the tempting reading, and on many roofs the slab cannot carry the tonnes of ballast that would require.",
        difficulty: "Hard",
        skill: "Dead load and imposed load",
      },
    ],
  },
};

export default PART;
