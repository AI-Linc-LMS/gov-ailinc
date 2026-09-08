/**
 * Course 311: Solar PV Installer & Rooftop Technician, part 3 of 3.
 *
 * Topics 31115 to 31120: the protection and earthing module, then commissioning,
 * net metering and maintenance. This is the part of the trade an inspector checks
 * first and the part a technician is called back for, so the content is written as
 * method rather than as description: what you measure, in what order, with which
 * instrument, and what the number has to be before you close the enclosure.
 *
 * A rooftop array is live whenever there is light on it and there is no switch that
 * turns the sun off. That fact drives the sequencing in every procedure below.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31115: {
    topicId: 31115,
    title: "DC side: string fuses, surge protection and isolators",
    summary:
      "The DC side of a rooftop plant is a current limited source that cannot be switched off, so its protection is designed around reverse current from parallel strings rather than around a conventional short circuit. You learn when a string fuse is required, how to rate it, where the isolator goes and how a surge protective device is connected so that it actually works.",
    concepts: [
      "String overcurrent protection",
      "Reverse current from parallel strings",
      "DC isolator and load breaking",
      "Surge protective device connection",
      "DC arc behaviour",
      "Safe isolation sequence",
    ],
    glossary: {
      "Short circuit current":
        "The current a module or string delivers when its two terminals are joined directly, written Isc on the nameplate. It is only about a fifth higher than the normal working current, which is why an ordinary overcurrent device cannot detect a fault inside a single string.",
      "String fuse":
        "A fuse fitted in series with one string so that current fed backwards into that string by the other strings in parallel is interrupted. It is a gPV type, rated for the full array voltage in direct current.",
      "Reverse current":
        "Current that flows into a string from the rest of the array instead of out of it. It appears when a string develops an earth fault or a short, and its size depends on how many other strings are connected in parallel.",
      "Maximum series fuse rating":
        "A number printed on the module nameplate. It is the largest fuse the module is qualified to sit behind, and it caps the fault current the module glass and cell interconnects can survive.",
      "DC isolator":
        "A load breaking switch, rated for direct current at the full array voltage, that separates the array from the inverter. It disconnects the inverter, it does not de-energise the string cable on the roof.",
      "Surge protective device":
        "A component that clamps a transient overvoltage to earth so it never reaches the inverter or the module insulation. It is fitted close to what it protects and is useless if its connection leads are long.",
      "Load breaking":
        "The ability of a switch to open a circuit that is carrying current without being destroyed by the arc that follows. A switch marked only as an isolator may be opened at zero current only.",
    },
    body: {
      Beginner: `<p>Everything on the roof runs on direct current, and direct current behaves differently from the alternating current in a house socket. Two differences decide how you protect it.</p>
<h2>A panel cannot deliver a big fault current</h2>
<p>When you drop a spanner across the terminals of a car battery you get an enormous current. A solar module does not do that. Its <strong>short circuit current</strong>, the number printed as Isc on the back, is only around twenty per cent higher than the current it makes on a normal working day.</p>
<p>That has one important consequence. A fuse works by melting when far too much current passes through it. A single string of modules can never push enough current through its own fuse to melt it. So a string fuse is not there to protect against the string's own current at all.</p>
<h2>So what is the fuse for</h2>
<p>Picture four strings joined together in a box. If one of those strings develops a fault, the other three can push their current backwards into it. Three strings feeding into one is enough current to overheat the cable and the module inside that faulty string, and that is the fire the fuse prevents.</p>
<p>Work it through. With only one or two strings in parallel there is at most one other string that can feed the fault, and one string's worth of current is small enough that the module survives it. That is why a small two string house system usually carries no string fuses at all, and a large one does.</p>
<h2>You cannot switch off the sun</h2>
<p>The <strong>DC isolator</strong> next to the inverter is a switch, and turning it off separates the array from the inverter. It does not make the roof safe. The moment daylight falls on the modules, the cable running down from the roof still has full voltage on it, several hundred volts, and it stays that way until you cover the modules or take the string apart.</p>
<p>Direct current also does not want to stop arcing. Mains current passes through zero a hundred times a second and an arc dies at each pass. Direct current never passes through zero, so an arc drawn on the roof keeps burning as long as the sun keeps shining on the panels.</p>
<p>The habit this builds is simple. Never pull a connector apart while current is flowing. Switch off the AC supply first so the inverter stops drawing, then open the DC isolator, then check with a meter that the current has gone, and only then use the proper release tool on the connector.</p>`,
      Intermediate: `<p>DC protection design on a rooftop plant follows from one property of the source: a photovoltaic generator is current limited. Isc is typically only 1.1 to 1.25 times the maximum power current, and it rises roughly in proportion to irradiance. There is no prospective fault current in the sense a distribution engineer means, so protection is designed against reverse current, not against a short circuit.</p>
<h2>Deciding whether string fuses are needed at all</h2>
<p>Take an array of N strings in parallel. If one string faults, the remaining N minus 1 strings can drive current backwards into it. Standards apply a factor to allow for irradiance above 1000 watts per square metre, so the reverse current you design against is:</p>
<p><strong>I reverse = 1.25 x Isc x (N - 1)</strong></p>
<p>Compare that with the module's maximum series fuse rating. If the reverse current is below that rating, the module can survive the fault unprotected and no string fuse is required. With modules of Isc 11.3 A and a maximum series fuse rating of 20 A:</p>
<ul>
<li>Two strings: 1.25 x 11.3 x 1 = 14.1 A, below 20 A, so no fuses.</li>
<li>Three strings: 1.25 x 11.3 x 2 = 28.3 A, above 20 A, so every string is fused.</li>
</ul>
<p>Note the wording. Once fuses are needed, every string gets one, in the positive and the negative conductor where the array is unearthed, because a single earth fault can otherwise leave the unfused pole carrying the whole fault.</p>
<h2>Rating the fuse</h2>
<p>The fuse has to sit above the string's own working current so it never nuisance blows, and below what the module can survive. The usual window is:</p>
<p><strong>1.5 x Isc is less than or equal to In, and In is less than or equal to the module maximum series fuse rating</strong></p>
<p>For the same module: 1.5 x 11.3 = 17.0 A, so the next standard size up is 20 A, which is exactly the module limit. A 20 A gPV fuse to IEC 60269-6, rated for the full array voltage in DC, in a holder rated the same. A 20 A miniature circuit breaker from the AC wholesaler is not a substitute: it is rated for a few tens of volts DC and will not clear an arc at 800 V.</p>
<p>The string cable then has to be rated for the fuse, not merely for the string. Size the conductor so that its derated current carrying capacity is at least the fuse rating, after the derating that a black cable clipped to a hot rail in full sun actually deserves.</p>
<h2>Isolators</h2>
<p>You need a load breaking DC switch between the array and the inverter, rated at or above the maximum array voltage and the maximum array current, and marked for DC. Many string inverters have one built in. Where the inverter is remote from the array, a second isolator at the array end is what lets you work on the roof with the run cable dead at the inverter end.</p>
<h2>Surge protection</h2>
<p>Fit a Type 2 surge protective device on the DC side at the inverter, chosen so that its Ucpv rating exceeds the maximum array voltage at the coldest expected temperature. Where the cable run between array and inverter is long, typically beyond about ten metres, a second device at the array end is justified because the run itself is the aerial that collects the transient.</p>
<p>The detail installers get wrong is the lead length. The device clamps to a residual voltage, and the inductance of its own connection leads adds to that voltage at the rate a fast transient changes current. Keep the total loop, live lead plus earth lead, as short as you can, and well under half a metre. A neatly routed device on a long tail protects nothing.</p>`,
      Advanced: `<p>Most DC side callbacks are not component failures. They are sequencing failures, rating shortcuts and one recurring design error, so it is worth going at each in turn.</p>
<h2>The parallel string count is not the whole story</h2>
<p>The reverse current calculation assumes every string is identical and connected at the same combiner. Two situations break that assumption on real sites. First, an array built in phases, where a second combiner is landed on the same inverter input months later, silently raises N for the original strings and can push a previously unfused design past the module limit. Second, roof geometry that puts strings on different orientations means the contributing strings are not all at the same irradiance, which reduces the reverse current in the moment but not in the worst case, and the worst case is what you rate to.</p>
<p>The practical rule when you extend an existing array: recount N across the whole parallel node, not across the new work.</p>
<h2>Fuse selection traps</h2>
<ul>
<li><strong>The wrong class.</strong> A gPV fuse is qualified to break low overcurrents, a few times its rating, in DC. A general purpose gG fuse is qualified for high fault currents in AC and can fail to interrupt at all in the low, sustained DC overcurrent a PV array produces. The fuse then arcs internally and the holder becomes the fault.</li>
<li><strong>Voltage rating read as AC.</strong> A holder marked 1000 V AC is not a 1000 V DC device. Check for the DC marking explicitly.</li>
<li><strong>Ambient derating.</strong> Fuse ratings are quoted at moderate ambient. Inside a sealed combiner on a terrace in May the internal air can be well above that, and the fuse then operates below its marked rating, which shows up as unexplained string dropouts on the hottest, highest yield days of the year.</li>
<li><strong>Fusing only the positive.</strong> On an unearthed array, protection in one pole only leaves a single earth fault path unprotected. The system runs perfectly with one earth fault present and fails on the second.</li>
</ul>
<h2>What actually kills people on the DC side</h2>
<p>The mechanism is nearly always the same. A connector is separated while the array is delivering current, an arc is drawn, and because there is no current zero the arc sustains itself across the widening gap. At several hundred volts it is a sustained plasma, not a spark. It will burn through a glove, ignite roofing felt and blind the person holding it.</p>
<p>The countermeasure is sequence, and it is not negotiable:</p>
<ol>
<li>Open the AC breaker at the inverter first, so the inverter stops drawing current and the array falls back to open circuit.</li>
<li>Open the DC isolator.</li>
<li>Prove the current is zero with a clamp meter on the string conductor before touching a connector.</li>
<li>Use the manufacturer's release tool. Levering a connector with a screwdriver damages the latch and produces a joint that will arc quietly for a year.</li>
</ol>
<p>Test the meter on a known live source before and after the reading. A meter that has died in the toolbox reads zero on everything.</p>
<h2>Surge protection that fails silently</h2>
<p>A varistor based device degrades every time it conducts. Most carry a mechanical indicator window, and nobody looks at it, so the plant runs for years with a spent device that reads as installed. Two habits fix that: photograph the indicator at every service visit and record it in the log, and specify devices with a remote signalling contact where the inverter has a spare digital input.</p>
<p>The second silent failure is an SPD referenced to a different earth from the array frame. During a strike the two earths rise by different amounts and the surge travels through the equipment between them. Everything bonds back to one main earth terminal, which is the subject of the earthing topic later in this module.</p>`,
      Expert: `<p>Recall sheet for the DC side. Everything here is a two line rule you can apply on a roof without opening a book.</p>
<h2>Fuse or no fuse</h2>
<table>
<tr><th>Strings in parallel</th><th>Reverse current design value</th><th>Verdict for Isc 11.3 A, module fuse 20 A</th></tr>
<tr><td>1</td><td>0</td><td>No string fuse</td></tr>
<tr><td>2</td><td>1.25 x Isc</td><td>14.1 A, no string fuse</td></tr>
<tr><td>3</td><td>2.5 x Isc</td><td>28.3 A, fuse every string</td></tr>
<tr><td>N</td><td>1.25 x Isc x (N - 1)</td><td>Fuse once this exceeds the module rating</td></tr>
</table>
<h2>Ratings, in order of the checks you make</h2>
<ul>
<li>Fuse: In at least 1.5 x Isc, and In no greater than the module maximum series fuse rating. Class gPV, DC voltage rating at or above array Voc corrected for the coldest temperature.</li>
<li>Cable: derated capacity at least equal to In, and separately at least 1.25 x Isc where no fuse is fitted.</li>
<li>Isolator: DC load breaking, at or above array Voc cold and total array current.</li>
<li>SPD: Ucpv above array Voc cold, Type 2 minimum, Type 1 where the building has an external lightning protection system.</li>
</ul>
<h2>Two arithmetic checks worth memorising</h2>
<p>Cold Voc uplift: for a module with a Voc temperature coefficient near minus 0.28 per cent per degree, a fall from 25 to 5 degrees adds about 5.6 per cent to Voc. An array reading 780 V on a warm afternoon can present above 820 V on a cold morning, and the isolator and SPD are rated against that higher number, not against what you measured.</p>
<p>Fuse headroom: if 1.5 x Isc lands above the module maximum series fuse rating there is no legal fuse for that array. The design is wrong, not the fuse. Split the parallel group, or use a module with a higher series fuse rating.</p>
<h2>Isolation sequence, in the order that matters</h2>
<ol>
<li>AC off, then DC isolator off, then prove current zero, then connectors.</li>
<li>Reverse exactly for re-energisation: connectors, DC isolator, AC last.</li>
<li>Lock and tag the AC breaker. A householder switching it back on while you have a connector in your hand is a foreseeable event.</li>
</ol>
<h2>Edge cases that come up on inspection</h2>
<ul>
<li>Combiner with fuse holders in one pole only on an unearthed array: a finding, not a preference.</li>
<li>MCB used as a DC string device: a finding. AC devices have no DC breaking capacity marking.</li>
<li>SPD leads dressed in a long loop for tidiness: the loop inductance defeats the device.</li>
<li>Spare fuse ways left bridged with a link after a fault: leaves an unprotected string in service.</li>
<li>String cable rated for 1.25 x Isc but not for the 20 A fuse ahead of it: the fuse can no longer protect the cable it sits in front of.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A rooftop array has two strings in parallel. Each module has Isc of 11.3 A and a maximum series fuse rating of 20 A. What string overcurrent protection is required?",
        options: [
          "None, because the worst case reverse current of about 14 A is below the module rating",
          "A 20 A gPV fuse in each string, because every parallel array needs fusing",
          "A 16 A miniature circuit breaker in each string",
          "A single 25 A fuse on the combined output of both strings",
        ],
        answer: 0,
        explanation:
          "With two strings only one string can feed a fault in the other, so the design reverse current is 1.25 x 11.3 x 1 = 14.1 A, which the module survives because its series fuse rating is 20 A. Fusing every string is the tempting answer because it looks safer, but a fuse cannot protect against a fault the array cannot generate, and it adds two more joints and two more failure points to the DC circuit.",
        difficulty: "Medium",
        skill: "Reverse current from parallel strings",
      },
      {
        n: 2,
        question:
          "Why can a single unparalleled string never blow its own series fuse, no matter what fault develops inside it?",
        options: [
          "Because the fuse is fitted in the negative conductor only",
          "Because a photovoltaic source is current limited, with Isc only slightly above its working current",
          "Because direct current does not heat a fuse element",
          "Because the inverter limits the current drawn from each string",
        ],
        answer: 1,
        explanation:
          "A PV string is a current limited source: Isc is typically only 1.1 to 1.25 times the maximum power current, so even a dead short cannot push enough current through a correctly rated fuse to melt it. Blaming the inverter is the attractive wrong answer, because the inverter is irrelevant here: the limit is a property of the cell itself and applies with the inverter disconnected.",
        difficulty: "Medium",
        skill: "String overcurrent protection",
      },
      {
        n: 3,
        question:
          "You have opened the DC isolator at the inverter on a bright afternoon. What is the state of the string cable running down from the roof?",
        options: [
          "Dead, because the isolator has disconnected both poles",
          "At a reduced voltage, roughly half the array open circuit voltage",
          "At full array open circuit voltage, and it stays there while there is light on the modules",
          "Dead after about two minutes, once the module capacitance discharges",
        ],
        answer: 2,
        explanation:
          "The isolator separates the array from the inverter, so the cable on the array side sits at full open circuit voltage for as long as light falls on the modules. The two minute answer borrows a habit from AC capacitor discharge and is dangerous here, because a PV module is a generator rather than a store: waiting changes nothing.",
        difficulty: "Easy",
        skill: "DC isolator and load breaking",
      },
      {
        n: 4,
        question:
          "An arc drawn while separating a live DC connector behaves differently from an arc on an AC circuit because:",
        options: [
          "DC voltage is always higher than AC voltage on a rooftop plant",
          "DC current has no zero crossing, so the arc is not extinguished naturally",
          "DC arcs produce no heat, only ultraviolet light",
          "DC connectors are made of a different polymer",
        ],
        answer: 1,
        explanation:
          "An alternating current passes through zero twice per cycle and the arc dies at each crossing, whereas a direct current never does, so the arc sustains itself across a widening gap. Choosing the higher voltage answer misses the mechanism: even at a modest DC voltage the absence of a current zero is what makes the arc self sustaining.",
        difficulty: "Medium",
        skill: "DC arc behaviour",
      },
      {
        n: 5,
        question:
          "A Type 2 surge protective device has been mounted neatly in a corner of the enclosure with its live and earth leads dressed in a long, tidy loop back to the busbar. What is the consequence?",
        options: [
          "None, provided the leads are the correct cross sectional area",
          "The device operates faster because the leads add resistance",
          "The lead inductance adds voltage during a fast transient, so the protected equipment sees more than the device let through",
          "The loop improves earthing by increasing the surface area of the conductor",
        ],
        answer: 2,
        explanation:
          "A surge is a very fast change of current, and any inductance in the connection leads develops a voltage that adds to the device's own let through voltage, so the total that reaches the inverter can be far higher than the datasheet figure. Cross sectional area is the tempting distractor, but at transient speeds it is loop length and geometry, not copper area, that decides the added voltage.",
        difficulty: "Hard",
        skill: "Surge protective device connection",
      },
      {
        n: 6,
        question:
          "What is the correct order for isolating a rooftop plant before opening a DC connector?",
        options: [
          "Open the DC isolator, then the AC breaker, then pull the connector",
          "Open the AC breaker, then the DC isolator, prove the current is zero, then use the release tool",
          "Cover the modules with a sheet, then pull the connector, then open both isolators",
          "Pull the connector first so the array is split, then open both isolators",
        ],
        answer: 1,
        explanation:
          "Opening the AC breaker first stops the inverter drawing current so the array falls back to open circuit, after which the DC isolator opens with little or no current across its contacts, and the clamp meter confirms it before anything is unplugged. Opening the DC isolator first is the common habit and it makes that switch break the full load current every time, which wears the contacts and puts the arc inside an enclosure you are standing in front of.",
        difficulty: "Easy",
        skill: "Safe isolation sequence",
      },
      {
        n: 7,
        question:
          "Modules with Isc of 13.5 A carry a maximum series fuse rating of 20 A. What does that tell you about a proposed design with four such strings in parallel?",
        options: [
          "It is fine, since 1.5 x Isc is 20.25 A which rounds down to a 20 A fuse",
          "There is no compliant fuse for this array as drawn, so the parallel group must be split or a different module used",
          "A 32 A fuse should be used because four strings are involved",
          "No fuse is needed because the module rating is above Isc",
        ],
        answer: 1,
        explanation:
          "The fuse must be at least 1.5 x Isc, which is 20.25 A, and at the same time no greater than the module rating of 20 A, so no standard size satisfies both and the design itself has to change. Rounding 20.25 down to 20 A is the attractive shortcut, and it produces a fuse that will nuisance blow on the brightest days of the year while offering no extra protection.",
        difficulty: "Hard",
        skill: "String overcurrent protection",
      },
    ],
  },

  31116: {
    topicId: 31116,
    title: "AC side: MCB, RCCB and the connection to the meter",
    summary:
      "Once the inverter has turned the array into alternating current the plant becomes an additional source feeding the consumer's own board, and the protection has to suit a source rather than a load. You size the generation circuit, choose a residual current device that a transformerless inverter cannot blind, and land the cable at the right point relative to the main switch and the net meter.",
    concepts: [
      "Generation circuit sizing",
      "Residual current device type selection",
      "Point of interconnection",
      "Voltage rise on the AC circuit",
      "Anti-islanding protection",
      "Dual supply labelling",
    ],
    glossary: {
      "Generation circuit":
        "The cable and protective device between the inverter's AC terminals and the consumer's distribution board. It carries power in the opposite direction to every other circuit in the board, which is why it is sized on the inverter rating rather than on any connected load.",
      "Maximum continuous output current":
        "The largest AC current the inverter is rated to deliver indefinitely, printed on its nameplate. Every AC sizing decision starts from this number and not from the kilowatt rating divided by the voltage.",
      "Residual current device":
        "A device that compares the current going out on the line with the current returning on the neutral and trips if the difference exceeds its rating, on the assumption that the missing current is flowing to earth through a person or a fault.",
      "Type A residual current device":
        "A residual current device that will still operate correctly when the leakage waveform contains a pulsating direct component. A plain Type AC device can be magnetically saturated by that component and then fails to trip at all.",
      "Anti-islanding":
        "The inverter function that detects loss of the grid supply and disconnects, so the plant cannot keep a section of the network energised while a lineman believes it is dead.",
      "Point of interconnection":
        "The physical point where the generation circuit joins the consumer's installation. Its position relative to the main switch decides what can isolate the plant and what the utility can see.",
      "Voltage rise":
        "The increase in voltage at the inverter terminals caused by exporting current through the resistance of the AC cable. It adds to whatever the grid voltage already is and can trip the inverter on overvoltage.",
    },
    body: {
      Beginner: `<p>The inverter takes the direct current from the roof and turns it into ordinary alternating current at around 230 volts, the same as the supply in the house. From this point the wiring looks familiar, but there is one difference that changes everything about how you protect it.</p>
<h2>The plant is a source, not a load</h2>
<p>Every other circuit in a house takes power out of the board. The solar circuit pushes power in. A fan does not decide how much current it draws when the wiring is faulty, but the inverter always knows exactly how much it can produce, and that number is printed on its nameplate as the maximum continuous output current.</p>
<p>So you size the AC breaker from the nameplate. Take a five kilowatt inverter whose nameplate says 22.7 A maximum continuous output current. Allow the usual margin of one and a quarter times and you get about 28 A, so you fit the next standard breaker above that, a 32 A device.</p>
<p>Do not calculate it as five thousand divided by two hundred and thirty. That gives 21.7 A, which ignores the fact that many inverters are rated to give slightly more than their headline kilowatts.</p>
<h2>The shock protection device</h2>
<p>A <strong>residual current device</strong> watches the current going out and the current coming back. If they do not match, some current has escaped to earth, possibly through a person, and the device cuts the supply.</p>
<p>Modern inverters without an internal transformer can leak a small steady direct current as well as an alternating one. The cheapest kind of residual current device, marked Type AC, can be jammed by that steady component and then fails to trip when it should. You fit at least a Type A device on a solar circuit, and you follow whatever the inverter manual asks for, because the manufacturer knows the leakage its own electronics produce.</p>
<h2>Where the cable lands</h2>
<p>The solar cable goes into the consumer's main board through its own breaker, on the supply side of the house circuits so that the solar power can either feed the house or flow out to the grid. The existing energy meter is swapped by the distribution company for a <strong>net meter</strong>, which counts units in both directions.</p>
<p>Finally, label it. Anyone who opens that board after you has to know there are two sources of supply in it, and that switching off the main switch does not make the busbar dead.</p>`,
      Intermediate: `<p>The AC side is where the rooftop plant stops being a private piece of equipment and becomes part of the distribution network. Three things have to be got right: the circuit itself, the earth leakage protection, and the relationship with the utility's meter and its rules.</p>
<h2>Sizing the generation circuit</h2>
<p>Start from the inverter nameplate, not from the array. A 5 kW single phase inverter may state a maximum apparent power of 5000 VA and a maximum continuous output current of 22.7 A. The protective device is chosen at 1.25 times that, giving 28.4 A, so a 32 A device. A C curve miniature circuit breaker is the usual choice because the inverter's brief connection inrush can trip a B curve device of the same rating.</p>
<p>The cable is then sized on two separate tests, and it has to pass both.</p>
<ul>
<li><strong>Current carrying capacity</strong> after derating for grouping, insulation and the ambient temperature of the route. Cable clipped to an outside wall in Warangal in May is not at the temperature the table assumes.</li>
<li><strong>Voltage drop</strong>, which on a generation circuit is really voltage rise, and which is usually the test that decides the size.</li>
</ul>
<h2>Voltage rise is the sizing constraint people miss</h2>
<p>When the inverter exports, current flows out through the cable resistance, so the voltage at the inverter terminals sits above the voltage at the board. If the grid is already running near the top of its permitted band, that extra rise pushes the inverter over its overvoltage limit and it disconnects. The owner reports that the plant stops at midday on the clearest days of the year, which sounds like a fault and is a cable size problem.</p>
<p>Work an example. Single phase, 22.7 A, a 25 metre run. Using the tabulated single phase values in millivolts per ampere per metre:</p>
<ul>
<li>6 sq mm at 7.3: 7.3 x 22.7 x 25 divided by 1000 = 4.14 V, which is 1.8 per cent of 230 V.</li>
<li>10 sq mm at 4.4: 2.50 V, which is 1.09 per cent.</li>
<li>16 sq mm at 2.8: 1.59 V, which is 0.69 per cent.</li>
</ul>
<p>A generation circuit is normally held to about one per cent, so this run wants 10 sq mm as a minimum and 16 sq mm if the supply voltage at that site already runs high. The 6 sq mm that the current rating alone would have allowed is the cable that produces the midday trip.</p>
<h2>Residual current protection</h2>
<p>A transformerless inverter is galvanically connected to the array, so the array's capacitance to earth appears on the AC side and the leakage waveform is not a clean sinusoid. Two rules follow.</p>
<ol>
<li>Fit at least a Type A device. Where the inverter manual specifies Type B, fit Type B, and do not substitute.</li>
<li>Do not stack a 30 mA device on the generation circuit unless the installation needs it. Inverter leakage plus normal installation leakage can sit close enough to 30 mA to cause unexplained trips on damp mornings.</li>
</ol>
<p>Most modern inverters contain an internal residual current monitoring unit that trips on a small step change and on a direct component, which is what allows an external Type A device to be acceptable. The unit is part of the protection, so an inverter with that alarm disabled to stop nuisance trips is an unsafe installation, not a tuned one.</p>
<h2>Interconnection and the meter</h2>
<p>The generation circuit lands in the consumer's main board through a dedicated, clearly labelled breaker, upstream of the final circuits so that generated power supplies the house first and only the surplus flows out through the meter. The distribution company replaces the existing meter with a bidirectional net meter that registers import and export separately.</p>
<p>The utility also needs to be able to isolate you. Provide an accessible, lockable AC isolator that their staff can operate, sited where the connection agreement asks for it, and fit a dual supply warning label at the meter, at the main switch and at the inverter.</p>`,
      Advanced: `<p>The AC side rarely fails on the day of commissioning. It fails three months later, in a way that looks like an inverter fault, and the three most common causes are all decisions made at installation.</p>
<h2>Diagnosing the midday shutdown</h2>
<p>An owner reports that generation collapses between eleven and two on cloudless days, exactly when it should be highest, and recovers by itself. The inverter log shows a grid overvoltage code. The instinct is to blame the utility, and the utility will point at your cable. Both can be true, and you can separate them with one measurement.</p>
<p>Measure the AC voltage at the inverter terminals and at the point of interconnection simultaneously, at full output. The difference is your rise, and you own it. If the rise is within one per cent and the voltage at the interconnection point is already near the top of the statutory band, the network is the cause and it becomes a conversation with the distribution company about tap settings, not a cable change. If the rise is three per cent, you undersized the cable and increasing it is the fix.</p>
<p>Raising the inverter's overvoltage trip point to make the symptom go away is not a fix. Those settings are grid protection settings, they are part of what the plant was approved on, and altering them without authorisation is a compliance failure that surfaces at the next inspection.</p>
<h2>Nuisance tripping of the residual current device</h2>
<p>Leakage adds. The inverter contributes a standing leakage through the array capacitance, which rises with array area and rises sharply when the modules are wet. The rest of the installation contributes its own. A 30 mA device on a circuit carrying both will trip on the first heavy dew after monsoon and then behave for a month, which is the hardest kind of fault to be called back for.</p>
<ul>
<li>Give the generation circuit its own residual current device rather than sharing one with house circuits, so the leakage sources are separated and the fault can be localised.</li>
<li>Where the device exists for fire protection on a long buried or concealed run rather than for shock protection at a socket, a time delayed device of higher rating is the appropriate selection.</li>
<li>Measure standing leakage with a leakage clamp at commissioning and write the number in the handover file. Without that baseline, nobody can later tell degradation from a design that was always marginal.</li>
</ul>
<h2>Interconnection errors that fail inspection</h2>
<ul>
<li><strong>Landing on the load side of a final circuit breaker.</strong> Wiring the inverter into a spare 16 A way that already feeds a socket circuit means the socket circuit cable now carries generation current it was never sized for, and the breaker no longer protects it in both directions.</li>
<li><strong>No accessible utility isolator.</strong> A lockable isolator inside a locked terrace room is not accessible in the sense the connection agreement means.</li>
<li><strong>Missing labels.</strong> Dual supply warnings at the meter position, the main switch and the inverter, plus a circuit label that names the inverter, are checked and are cheap to get right.</li>
<li><strong>Neutral and earth treated casually.</strong> The generation circuit neutral is a current carrying conductor with the same protection obligations as the line, and the earth continuity to the inverter body is part of the shock protection, not an accessory.</li>
</ul>
<h2>Anti-islanding, and how to demonstrate it</h2>
<p>The inverter must detect the loss of grid supply and disconnect within the time the grid code allows, typically a small number of seconds, so it cannot energise a network section that linemen believe is dead. The test the inspector wants to see is direct: run the plant at a reasonable output, open the utility supply, and time the disconnection with a stopwatch while watching the inverter display and the AC voltage.</p>
<p>Two practical notes. Islanding detection uses small perturbations of the output and can be confused by another inverter nearby holding the voltage up, which is why the test is done with a load on the island rather than into an open circuit. And the grid protection settings themselves are set by the connection standard your distribution company adopts, so read their document rather than assuming the inverter's factory country setting is the right one for the site.</p>`,
      Expert: `<p>AC side recall sheet. Every line here is something an inspector or a callback has previously turned on.</p>
<h2>Sizing, in the order you do it</h2>
<ol>
<li>Read the inverter nameplate maximum continuous output current. Do not divide watts by volts.</li>
<li>Protective device at least 1.25 times that current, C curve, next standard size up.</li>
<li>Cable derated capacity at least the device rating, after grouping and ambient derating for the actual route.</li>
<li>Voltage rise check at full output, target about one per cent. This usually decides the size.</li>
<li>Residual current device type per the inverter manual, Type A as the floor.</li>
</ol>
<h2>Voltage rise, single phase, millivolts per ampere per metre</h2>
<table>
<tr><th>Copper size</th><th>mV/A/m</th><th>Rise at 22.7 A over 25 m</th><th>Per cent of 230 V</th></tr>
<tr><td>6 sq mm</td><td>7.3</td><td>4.14 V</td><td>1.80</td></tr>
<tr><td>10 sq mm</td><td>4.4</td><td>2.50 V</td><td>1.09</td></tr>
<tr><td>16 sq mm</td><td>2.8</td><td>1.59 V</td><td>0.69</td></tr>
</table>
<h2>Residual current device selection</h2>
<table>
<tr><th>Type</th><th>Detects</th><th>Use on a PV generation circuit</th></tr>
<tr><td>AC</td><td>Sinusoidal alternating residual only</td><td>Not acceptable. A direct component saturates it and it stops tripping.</td></tr>
<tr><td>A</td><td>Alternating plus pulsating direct</td><td>The minimum, and sufficient where the inverter has an internal residual current monitoring unit.</td></tr>
<tr><td>B</td><td>Adds smooth direct residual</td><td>Fit where the inverter manual calls for it. Never substitute downwards.</td></tr>
</table>
<h2>Symptom to cause, at a glance</h2>
<ul>
<li>Generation collapses at midday, recovers alone, overvoltage code: cable rise, or a network already at the top of the band. Measure both ends at full output before deciding.</li>
<li>Trips after rain, clear for weeks afterwards: accumulated leakage across a shared residual current device. Separate the circuit and record the standing leakage.</li>
<li>Trips on every start, no fault present: B curve device on an inverter with connection inrush. Move to C curve at the same rating.</li>
<li>Meter shows import while the plant is clearly generating: net meter fitted with reversed current transformer polarity, or the generation circuit landed downstream of the meter's measuring point.</li>
</ul>
<h2>The findings list, memorised</h2>
<ul>
<li>Generation landed in a shared final circuit way.</li>
<li>Utility isolator absent, unlockable or not accessible.</li>
<li>Dual supply labels missing at meter, main switch or inverter.</li>
<li>Grid protection settings altered from the approved values to suppress trips.</li>
<li>Type AC residual current device on a transformerless inverter.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "An inverter nameplate reads 5000 VA maximum apparent power and 22.7 A maximum continuous output current. What rating of miniature circuit breaker should protect its generation circuit?",
        options: [
          "20 A, since 5000 divided by 230 is 21.7 A",
          "25 A, the next standard size above the nameplate current",
          "32 A, being the next standard size above 1.25 times 22.7 A",
          "63 A, so that the breaker never limits the plant",
        ],
        answer: 2,
        explanation:
          "You size from the nameplate continuous current with the usual 1.25 margin, giving 28.4 A, so the next standard device is 32 A. Dividing kilovolt amperes by voltage is the tempting shortcut and it produces 21.7 A, a number lower than the current the inverter is actually rated to deliver, so the breaker would trip on a good day.",
        difficulty: "Medium",
        skill: "Generation circuit sizing",
      },
      {
        n: 2,
        question:
          "Why is a Type AC residual current device unsuitable on the AC circuit of a transformerless inverter?",
        options: [
          "It trips too quickly for the inverter's start up sequence",
          "A direct component in the leakage can saturate its core so it stops responding to residual current altogether",
          "It cannot carry the continuous current the inverter delivers",
          "It measures only the line conductor and ignores the neutral",
        ],
        answer: 1,
        explanation:
          "Leakage from a transformerless inverter contains a direct component, and a Type AC device's core can be magnetically saturated by it, after which the device silently stops protecting anyone. Assuming the problem is nuisance tripping gets the risk backwards: the failure is that the device does not trip, and nothing on the board indicates it.",
        difficulty: "Medium",
        skill: "Residual current device type selection",
      },
      {
        n: 3,
        question:
          "A plant with a 25 metre AC run keeps shutting down at midday on clear days with a grid overvoltage code, then recovers. What should you measure first?",
        options: [
          "The insulation resistance of the DC strings",
          "The AC voltage at the inverter terminals and at the point of interconnection at the same time, at full output",
          "The open circuit voltage of each string at dawn",
          "The earth electrode resistance with a three pin tester",
        ],
        answer: 1,
        explanation:
          "The difference between those two voltages at full output is the rise your cable is causing, which separates an undersized cable that you own from a network already at the top of its band, which you do not. Testing the DC side is the instinctive move because the shutdown correlates with sunshine, but the inverter has already told you the trip was on grid voltage, so the evidence points at the AC circuit.",
        difficulty: "Hard",
        skill: "Voltage rise on the AC circuit",
      },
      {
        n: 4,
        question:
          "The generation cable has been landed on a spare 16 A way that already feeds a socket circuit. Why is this a defect?",
        options: [
          "Because inverters must always be wired in three phase",
          "Because the socket circuit cable now carries generation current it was not sized for and its breaker no longer protects it in both directions",
          "Because a socket circuit runs at a different frequency",
          "Because the inverter cannot deliver power through a socket circuit breaker",
        ],
        answer: 1,
        explanation:
          "Joining a source into a final circuit means that cable now carries generation current in addition to load current, and the protective device sits at the wrong end to protect it from the inverter's contribution. The frequency answer sounds technical and is simply untrue: the whole installation shares one supply frequency.",
        difficulty: "Medium",
        skill: "Point of interconnection",
      },
      {
        n: 5,
        question:
          "During inspection you are asked to demonstrate anti-islanding. What is the correct demonstration?",
        options: [
          "Cover the modules with a sheet and confirm the inverter stops",
          "Open the DC isolator and confirm the AC output falls to zero",
          "Open the utility supply while the plant is generating into a load, and time how long the inverter takes to disconnect",
          "Switch the inverter off at its own control panel and time the shutdown",
        ],
        answer: 2,
        explanation:
          "Anti-islanding is about losing the grid while generation continues, so the test has to remove the utility supply with the plant running into a load and measure the disconnection time against the grid code. Opening the DC isolator only proves that the inverter stops when the array is removed, which tells you nothing about whether it would keep a dead network energised.",
        difficulty: "Medium",
        skill: "Anti-islanding protection",
      },
      {
        n: 6,
        question:
          "Which labelling is required at the consumer's main switch on a house with a rooftop plant?",
        options: [
          "The array peak capacity in kilowatts only",
          "A warning that the installation has two sources of supply, so opening the main switch does not make the board dead",
          "The name of the installer and the date of installation only",
          "No label, provided the inverter is visible from the board",
        ],
        answer: 1,
        explanation:
          "A dual supply warning at the meter, the main switch and the inverter tells the next person that the busbar can be live from the generation side after the main switch is opened, which is exactly the assumption that gets people hurt. Recording the capacity or the installer is useful information for the file but it does not warn anybody about the hazard in front of them.",
        difficulty: "Easy",
        skill: "Dual supply labelling",
      },
      {
        n: 7,
        question:
          "A shared 30 mA residual current device protecting both the house circuits and the generation circuit trips after heavy rain and then behaves normally for weeks. What is the most likely explanation?",
        options: [
          "The inverter has developed an internal short circuit",
          "Standing leakage from the wet array adds to the installation's own leakage and the total crosses the trip threshold",
          "The rain has increased the grid voltage",
          "The residual current device has reached the end of its mechanical life",
        ],
        answer: 1,
        explanation:
          "Leakage currents add, and array capacitance to earth rises sharply when the modules are wet, so a device already close to threshold from ordinary installation leakage trips on the first wet morning and appears fine once things dry out. Suspecting an inverter short is the obvious first thought, but an internal short would produce a repeatable fault rather than one correlated with weather.",
        difficulty: "Hard",
        skill: "Residual current device type selection",
      },
    ],
  },

  31117: {
    topicId: 31117,
    title: "Earthing and lightning protection for a rooftop array",
    summary:
      "An array puts several hundred square feet of bonded metal on top of a building, and the earthing system is what keeps every part of it at the same potential during a fault or a nearby strike. You bond frames and rails properly, size and route the earthing conductor, test the electrode, and decide honestly whether the site needs lightning protection at all.",
    concepts: [
      "Equipotential bonding of the array",
      "Protective earthing conductor sizing",
      "Earth electrode and soil resistance",
      "Loop area and induced surge",
      "Lightning protection risk assessment",
      "Earth continuity testing",
    ],
    glossary: {
      "Equipotential bonding":
        "Deliberately joining every piece of exposed metal so that no two parts can sit at different voltages during a fault. It works by removing the difference, not by carrying current away.",
      "Main earthing terminal":
        "The single bar in the installation where the electrode conductor, the protective conductors and every bonding conductor meet. One installation has one of these, and everything traces back to it.",
      "Earth electrode":
        "The metal in contact with the soil, usually a driven rod, a buried plate or a chemically backfilled pit, that gives the installation its connection to general mass of earth.",
      "Fall of potential test":
        "The standard three terminal method for measuring the resistance of an earth electrode, using a current spike and a potential spike driven into the soil at set distances from the electrode.",
      "Air termination":
        "The rod, mesh or conductor of a lightning protection system that is intended to receive a direct strike and lead it to earth. An array frame is never one of these.",
      "Separation distance":
        "The minimum air gap that has to be kept between a lightning protection system and other metalwork so that the strike current does not flash across. Where the gap cannot be achieved, the metalwork is bonded instead.",
      "Galvanic corrosion":
        "The electrochemical attack that occurs where two dissimilar metals are in contact and moisture is present. Bare copper against an aluminium frame is the common example on a rooftop.",
    },
    body: {
      Beginner: `<p>Earthing is often explained as a way of sending fault current into the ground. On a roof it is better to think of it as a way of making every piece of metal agree with every other piece of metal. If the frames, the rails, the inverter body and the building all sit at the same voltage, there is nothing for a current to flow through if you touch two of them at once.</p>
<h2>Why the rails are not enough</h2>
<p>Module frames and mounting rails are aluminium, and aluminium is anodised, which means it carries a thin hard oxide layer on the outside. That layer is an insulator. Two rails bolted together look like one piece of metal and can be electrically separate.</p>
<p>So you do not rely on the clamps. You run a dedicated earthing wire, green and yellow, along the array, and you attach it at each module with a lug or a toothed washer that is designed to bite through the anodising and reach the metal underneath.</p>
<h2>One earth, not two</h2>
<p>The most common mistake on a rooftop job is to dig a fresh earth pit for the solar plant and leave it unconnected to the building's existing earth. It sounds tidy and it is dangerous. Two separate earths can rise to different voltages during a fault or a lightning strike nearby, and the difference then appears across whatever equipment bridges them, which is usually the inverter.</p>
<p>Every earth on the site is joined together at one point, the main earthing terminal. If you add an electrode for the array, you connect it there too.</p>
<h2>Keep the cables together</h2>
<p>When lightning strikes anywhere nearby, the fast changing magnetic field induces a voltage in any loop of wire it passes through, and the bigger the loop, the bigger the voltage. So when you run the positive and negative cables of a string, run them side by side and tie them to the rail. A pair of cables taking different routes around the array forms a large loop and behaves like an aerial.</p>
<h2>Does the roof need a lightning rod</h2>
<p>Not automatically. Putting an array on a house does not by itself create a need for a lightning protection system. If the building already has one, your array must not be allowed to touch it or sit too close to it, and that separation is a design question you raise before you mount anything. Never treat the array frame itself as a lightning rod.</p>
<h2>What you must test before you leave</h2>
<p>Put a meter between the furthest module frame and the main earthing terminal and confirm the path is a fraction of an ohm. Then test the electrode itself with a proper earth tester. A wire that is connected but reads a high resistance is a wire that will not do its job.</p>`,
      Intermediate: `<p>Earthing on a rooftop plant has three separate jobs, and they need three separate decisions: protective earthing against a fault, equipotential bonding of the array metalwork, and management of surges induced by lightning. Conflating them is why so many installations have a thick wire going to a pit and no continuity across the array.</p>
<h2>Bonding the array</h2>
<p>Every exposed conductive part of the array is bonded: module frames, rails, splices, the mounting structure legs and the enclosure of any combiner mounted on the roof. Practical rules:</p>
<ul>
<li>Use a dedicated conductor, commonly 6 sq mm copper for the array bonding run, and larger where a lightning protection system is present and bonding currents can be significant.</li>
<li>Terminate with lugs or washers qualified to penetrate anodising. A ring lug under a plain stainless bolt onto an anodised rail is a connection that measures fine on day one and opens up within a season.</li>
<li>Do not depend on rail splices for continuity. Slip joints are designed to allow thermal movement, which is exactly what an electrical joint must not do. Bond across every splice.</li>
<li>Watch dissimilar metals. Bare copper against aluminium in a wet environment corrodes galvanically. Use a tin plated lug or a bimetallic washer designed for the purpose.</li>
</ul>
<h2>Sizing the protective conductor</h2>
<p>The protective conductor for the AC circuit follows the usual relationship to the line conductor, which for copper in copper is:</p>
<ul>
<li>Line up to 16 sq mm: protective conductor the same size as the line.</li>
<li>Line above 16 and up to 35 sq mm: protective conductor 16 sq mm.</li>
<li>Line above 35 sq mm: protective conductor half the line size.</li>
</ul>
<p>So a 10 sq mm generation circuit carries a 10 sq mm protective conductor. Sized by calculation instead, the adiabatic relationship applies, and the clearance time of the upstream device is part of that sum.</p>
<h2>The electrode and its resistance</h2>
<p>Install and test to the national earthing code. The method for measuring an electrode is the fall of potential test with a three terminal earth tester: the electrode is temporarily disconnected from the installation, a current spike is driven well away from it and a potential spike between them, and the reading is taken with the potential spike at roughly sixty two per cent of the distance to the current spike.</p>
<p>A commonly specified target for a rooftop installation is a low single figure in ohms, and many distribution companies and electrical inspectors state their own figure, so read the connection document for the site rather than quoting a national number. What is not negotiable is the method: measure it, write the number in the handover file, and note the soil condition on the day.</p>
<h2>Reducing induced surge</h2>
<p>The voltage induced in a conductor loop rises with the enclosed area and with how fast the field changes, and a lightning current changes very fast indeed. Three habits cut the induced voltage without costing anything:</p>
<ol>
<li>Run the positive and negative of each string together, clipped to the same rail, so the enclosed area is close to zero.</li>
<li>Run the earthing conductor along the same route as the DC cables rather than taking a shortcut across the roof.</li>
<li>Keep the string layout so that the cable does not have to travel back across the array to reach the combiner.</li>
</ol>
<p>These work with the surge protective devices covered earlier in this module. The devices clamp what arrives; the routing decides how much arrives.</p>
<h2>Lightning protection: assess, do not assume</h2>
<p>Whether a building needs a lightning protection system is decided by risk assessment against the lightning protection standard, taking the local flash density, the building's size, its construction and what is inside it. An array raises the collection area a little but rarely changes the conclusion on a house.</p>
<p>Where a system already exists, the array is kept inside the protected volume and at the required separation distance from the air terminations and down conductors. If the separation distance cannot be achieved, the array structure is bonded to the lightning protection system and the surge protective devices on both the DC and AC sides move up to Type 1, because a bonded structure can now carry part of the strike current.</p>`,
      Advanced: `<p>Earthing defects are the ones that pass a visual inspection and fail in the third monsoon. They are worth going at as failure modes rather than as requirements.</p>
<h2>The continuity that degrades</h2>
<p>A bonding path can measure 0.2 ohm at handover and 40 ohm two years later, and nothing about the installation looks different. The mechanisms are predictable.</p>
<ul>
<li><strong>Anodising creep.</strong> A washer that only just penetrated the oxide relaxes as the joint cycles between forty degrees at noon and twenty at night, and the oxide reforms in the gap.</li>
<li><strong>Galvanic corrosion.</strong> A bare copper conductor clamped to aluminium in a coastal or a high rainfall district develops a white powdery interface that is an insulator.</li>
<li><strong>Loosened clamps.</strong> The rail expands and contracts along its length every day. A bonding lug taken through a splice, rather than across it with a flexible link, is being pulled once a day for its whole life.</li>
<li><strong>Roof work by others.</strong> Waterproofing, a water tank, a new antenna: someone removes a module to get access and refits it without the bonding jumper. This is why continuity is retested at every service visit and not only at commissioning.</li>
</ul>
<p>The measurement that catches all four is a low resistance continuity test at a test current of at least two hundred milliamperes, from the electrically furthest frame back to the main earthing terminal, with the number written down each time so that a trend is visible. A pocket multimeter on the ohms range passes a few microamperes and will read through a corroded joint that cannot carry fault current.</p>
<h2>The two earth pits problem</h2>
<p>An unbonded second electrode is not merely useless, it is a hazard, and the mechanism is worth being able to explain to a customer who paid for it. During a nearby strike the soil around each electrode rises in potential, and because the two are metres apart they rise by different amounts. The inverter sits between them with its DC side referenced to the array earth and its AC side referenced to the building earth, so the entire difference appears across its internal insulation. The inverter is the fuse in that arrangement.</p>
<p>The correction is a single conductor from the array electrode to the main earthing terminal, sized as an earthing conductor and not as an afterthought, and a note in the file that the electrodes are bonded.</p>
<h2>Measuring an electrode honestly</h2>
<ul>
<li>Disconnect the electrode from the installation before the fall of potential test, otherwise you are measuring the whole parallel earthing system and the number will flatter you. Treat the disconnected electrode as live until proved otherwise.</li>
<li>Take three readings with the potential spike at different distances and confirm they agree. If they do not, the spikes are inside another electrode's resistance area and the geometry has to change.</li>
<li>Soil resistivity is seasonal. A pit measured a week after heavy rain can read a third of what it will read in May. Note the date and the ground condition alongside the value.</li>
<li>Multiple rods in parallel only help if they are separated by at least their driven length. Two rods a metre apart share the same resistance area and behave very nearly as one.</li>
</ul>
<h2>When bonding replaces separation</h2>
<p>On a building with an existing lightning protection system the design question is whether the array can be kept at the required separation distance from air terminations and down conductors. That distance depends on the class of the system, the number of down conductors and the length along the conductor to the point of interest, so it is calculated rather than guessed.</p>
<p>If the distance cannot be held, the honest answer is to bond and to upgrade the protection, not to shave the gap. A bonded array is now part of the path a strike current can take, so the DC and AC surge protective devices become Type 1 devices with an impulse current rating rather than Type 2 devices with a nominal discharge rating, and the bonding conductors are sized for partial lightning current rather than for fault current.</p>
<h2>Two things never to do</h2>
<p>Never connect the array frame to a down conductor as though it were part of the lightning protection system, and never mount an air termination rod on the array structure itself. Both put strike current onto the metal your string cables are tied to.</p>`,
      Expert: `<p>Earthing recall sheet. Read it as the order of the tests and the numbers you write in the file.</p>
<h2>Protective conductor sizing, copper in copper</h2>
<table>
<tr><th>Line conductor</th><th>Protective conductor</th></tr>
<tr><td>Up to 16 sq mm</td><td>Same size as the line</td></tr>
<tr><td>Above 16 up to 35 sq mm</td><td>16 sq mm</td></tr>
<tr><td>Above 35 sq mm</td><td>Half the line size</td></tr>
</table>
<p>Array equipment bonding is commonly 6 sq mm copper, and larger where the structure is bonded to a lightning protection system and may carry partial strike current.</p>
<h2>Tests, targets and instruments</h2>
<table>
<tr><th>Test</th><th>Instrument</th><th>What good looks like</th></tr>
<tr><td>Array bonding continuity</td><td>Low resistance ohmmeter at 200 mA or more</td><td>A fraction of an ohm from the furthest frame to the main earthing terminal, trended visit to visit</td></tr>
<tr><td>Electrode resistance</td><td>Three terminal earth tester, fall of potential</td><td>The figure the connection document or the inspector specifies, recorded with the date and soil condition</td></tr>
<tr><td>Electrode disconnection</td><td>Visual plus proving instrument</td><td>Electrode isolated from the installation before measuring, treated as live until proved dead</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>One installation, one main earthing terminal. Every electrode, every bond, every protective conductor traces back to it.</li>
<li>Bond across every rail splice. A slip joint is a mechanical joint by design and must never be an electrical one.</li>
<li>Toothed or qualified lugs only on anodised aluminium. A plain washer measures fine today and opens up in a season.</li>
<li>Tin plated or bimetallic terminations where copper meets aluminium, otherwise the joint corrodes itself open.</li>
<li>Positive and negative of a string travel together, and the earthing conductor follows the cable route.</li>
<li>Separation from a lightning protection system is calculated. If it cannot be held, bond and move both surge protective devices to Type 1.</li>
</ul>
<h2>Edge cases and findings</h2>
<ul>
<li>A dedicated solar earth pit left unbonded to the building earth: the inverter becomes the bridge between two rising potentials.</li>
<li>Two rods driven a metre apart to halve the resistance: overlapping resistance areas, negligible improvement.</li>
<li>Electrode measured without disconnection: the reading is of the whole parallel system and is not the electrode's resistance.</li>
<li>Continuity proved with a pocket multimeter: microampere test current reads through a corroded joint that cannot pass fault current.</li>
<li>Array structure used as an air termination or bonded to a down conductor: strike current now shares metal with the string cabling.</li>
<li>Bonding jumper not refitted after a module was removed for roof waterproofing: continuity gone, nothing visible from the ground.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Why can you not rely on the module clamps and rail bolts to provide electrical continuity across an array?",
        options: [
          "Because stainless steel is a poor conductor",
          "Because the anodised layer on aluminium frames and rails is an insulator, so a mechanically tight joint may be electrically open",
          "Because the clamps are torqued too lightly to conduct",
          "Because aluminium cannot be earthed at all",
        ],
        answer: 1,
        explanation:
          "Anodising is a hard oxide film applied deliberately to aluminium, and it insulates, so a joint that is mechanically sound can still be electrically open unless a toothed or qualified lug bites through it. Blaming the torque is the tempting answer, but tightening harder onto an oxide layer does not create a reliable electrical path and it distorts the frame.",
        difficulty: "Medium",
        skill: "Equipotential bonding of the array",
      },
      {
        n: 2,
        question:
          "An installer drives a fresh earth pit for the solar plant and leaves it unconnected to the building's existing earthing system. What is the danger?",
        options: [
          "The new pit will corrode faster because it carries no current",
          "The two earths can rise to different potentials during a fault or a nearby strike, and the difference appears across the inverter that bridges them",
          "The array will not generate until the pit is connected",
          "The distribution company cannot fit a net meter with two earths present",
        ],
        answer: 1,
        explanation:
          "Separate electrodes sit in different patches of soil and rise by different amounts, and the inverter, referenced to the array earth on one side and the building earth on the other, takes the whole difference across its insulation. Assuming the plant simply will not work is the comfortable wrong answer, because the installation runs normally for years and then fails during one storm.",
        difficulty: "Medium",
        skill: "Earth electrode and soil resistance",
      },
      {
        n: 3,
        question:
          "The generation circuit line conductor is 10 sq mm copper. What size copper protective conductor does it take?",
        options: ["4 sq mm", "6 sq mm", "10 sq mm", "16 sq mm"],
        answer: 2,
        explanation:
          "For line conductors up to 16 sq mm the protective conductor matches the line, so a 10 sq mm line takes a 10 sq mm protective conductor. Halving the line size is the tempting rule because it is genuinely used, but it applies only above 35 sq mm, and applying it here leaves a conductor that cannot carry the fault current for the clearance time of the device.",
        difficulty: "Easy",
        skill: "Protective earthing conductor sizing",
      },
      {
        n: 4,
        question:
          "Why are the positive and negative cables of a string run together and clipped to the same rail?",
        options: [
          "To reduce voltage drop along the string",
          "To keep the enclosed loop area small, since induced surge voltage rises with loop area",
          "To make the connectors easier to reach for maintenance",
          "To keep the two conductors at the same temperature",
        ],
        answer: 1,
        explanation:
          "A changing magnetic field induces a voltage proportional to the area of the loop it passes through, so keeping the two conductors together makes the enclosed area close to zero and the induced surge correspondingly small. Voltage drop is the intuitive answer for anyone thinking about cables, but routing does not change conductor resistance and so does not change the drop.",
        difficulty: "Medium",
        skill: "Loop area and induced surge",
      },
      {
        n: 5,
        question:
          "A three terminal fall of potential test is carried out with the electrode still connected to the installation. What is wrong with the resulting figure?",
        options: [
          "Nothing, this is the normal method",
          "It measures the parallel combination of the whole earthing system, so it is lower than the electrode's own resistance",
          "It measures only the resistance of the test leads",
          "It will read infinity because the current has an alternative path",
        ],
        answer: 1,
        explanation:
          "With the electrode still bonded in, the tester sees it in parallel with every other earth path in the installation, so the reading is flatteringly low and does not tell you whether the electrode itself is adequate. Expecting an infinite reading gets the physics backwards: extra parallel paths lower resistance, they do not remove it.",
        difficulty: "Hard",
        skill: "Earth electrode and soil resistance",
      },
      {
        n: 6,
        question:
          "A building already has a lightning protection system and the array cannot be kept at the calculated separation distance from a down conductor. What is the correct response?",
        options: [
          "Move the array closer so the down conductor shields it",
          "Bond the array structure to the lightning protection system and use Type 1 surge protective devices on the DC and AC sides",
          "Remove the down conductor in that area",
          "Leave the gap as it is, since separation distances are advisory",
        ],
        answer: 1,
        explanation:
          "When the separation distance cannot be achieved the standard response is to bond, which accepts that the structure may carry partial lightning current and therefore requires Type 1 devices rated in impulse current rather than Type 2 devices rated in nominal discharge current. Removing the down conductor is the worst option available, since it degrades the protection of the whole building to solve a local clearance problem.",
        difficulty: "Hard",
        skill: "Lightning protection risk assessment",
      },
      {
        n: 7,
        question:
          "Which instrument gives a trustworthy verdict on the bonding path from the furthest module frame back to the main earthing terminal?",
        options: [
          "A pocket multimeter on the ohms range",
          "A low resistance ohmmeter passing at least two hundred milliamperes of test current",
          "A clamp meter reading alternating current",
          "An insulation resistance tester at 500 volts",
        ],
        answer: 1,
        explanation:
          "A continuity test at a couple of hundred milliamperes or more will expose a corroded or partially oxidised joint that cannot carry fault current, which is the failure you are hunting. A pocket multimeter passes only microamperes and reads through such a joint as if it were sound, which is why bonding faults so often survive an inspection.",
        difficulty: "Medium",
        skill: "Earth continuity testing",
      },
    ],
  },

  31118: {
    topicId: 31118,
    title: "Commissioning tests: polarity, insulation resistance and output",
    summary:
      "Commissioning is the sequence of measurements that proves a plant is safe and is producing what its design promised, and it is the only point at which a hidden wiring error is cheap to find. You verify polarity and string voltage before anything is landed, test the insulation of the whole array against earth, then compare real output against a figure you calculated from irradiance and cell temperature.",
    concepts: [
      "Pre-energisation visual inspection",
      "Polarity and open circuit voltage verification",
      "String current verification against irradiance",
      "Insulation resistance of the DC array",
      "Expected output calculation",
      "Commissioning record and handover",
    ],
    glossary: {
      "Open circuit voltage":
        "The voltage across a module or string with nothing connected across it, written Voc. It is the highest voltage that part of the array will produce, and it falls as the cells get hotter.",
      "Insulation resistance test":
        "A measurement made with a dedicated tester that applies a high direct voltage between the conductors and earth and reports the resistance of everything in between. It finds damaged cable and wet enclosures before they become an earth fault.",
      Irradiance:
        "The solar power falling on one square metre, measured in watts per square metre. Module ratings are quoted at 1000 of them, so every field measurement has to be scaled against the irradiance on the day.",
      "Plane of array":
        "The tilted plane the modules actually sit in. Irradiance for a commissioning check is measured in this plane, not horizontally, because a horizontal reading and a tilted array do not see the same sun.",
      "Temperature coefficient":
        "The percentage by which a module rating changes for each degree the cell moves away from twenty five. Voltage falls as the cell heats, and so does power, which is why a midday test reads lower than the nameplate.",
      "Wet insulation test":
        "A variant of the insulation test performed with the array wetted, used to expose a defect in cable sheathing or a junction box seal that only conducts when water is present.",
      "Handover pack":
        "The file the owner keeps: the as built single line diagram, datasheets, every test result with its date and instrument, warranty documents and the maintenance schedule.",
    },
    body: {
      Beginner: `<p>Commissioning is not switching the plant on. It is the set of checks you do before and just after switching on, so that if something has been wired wrongly you find it with a meter rather than with a fire.</p>
<h2>Look before you measure</h2>
<p>Walk the whole job first, with the design drawing in your hand. Is every module the type on the drawing. Are the connectors on the cable the same brand as the connectors on the module. Is any cable resting on a sharp rail edge or lying in water on the roof. Are the labels on. Nothing on this list needs an instrument, and most of the faults found at commissioning are found here.</p>
<h2>Polarity</h2>
<p>Every string has a positive end and a negative end, and joining a string the wrong way round into a group of others is one of the few ways a solar array can produce a large current. So before anything is landed in the combiner box you put a DC meter across each string and read it. A positive number on the display means the red lead is on the positive conductor. A negative number means the string is reversed and you correct it now, not later.</p>
<h2>Does the string have all its modules</h2>
<p>Add up what the string should give. Eighteen modules of 45.5 volts each is 819 volts, but that is the cold laboratory figure. On a warm roof the cells are hot and the voltage falls, so a real reading of about 780 volts is normal. If you read 736 volts instead, the shortfall of roughly 45 volts is about one module's worth, and you go and look for the module that has been bypassed or the connector pair that has been bridged.</p>
<h2>Insulation</h2>
<p>A special tester, often called a megger, pushes a high voltage between the array wiring and earth and measures how much leaks across. Good, dry, undamaged cable leaks almost nothing and the tester reads several megohms. A cable pinched under a clamp, or water sitting in a junction box, shows up as a low reading. Do this with the array disconnected from the inverter, and follow the tester's instructions for discharging afterwards.</p>
<h2>Then check what it actually makes</h2>
<p>Switch on, let the inverter start, and compare the power it reports with what the sun is offering at that moment. You need a small irradiance meter held in the same tilt as the modules. Full sun is 1000 watts per square metre, so at 820 the plant should give roughly eighty per cent of its potential, minus what the heat and the cables take. A rough figure that lands close is a pass. A figure that is half of what it should be means you go back to the string readings.</p>
<p>Write every number down. The owner keeps that sheet, and in two years it is the only evidence of what the plant was like when it was new.</p>`,
      Intermediate: `<p>Commissioning follows the international standard for grid connected system documentation and verification, and its logic is that each test is done at the point where a failure is still contained. You do not land a string before you know its polarity, and you do not energise an inverter before you know the array insulation is sound.</p>
<h2>Order of work</h2>
<ol>
<li>Visual inspection against the as built drawing.</li>
<li>Continuity of protective earthing and array bonding.</li>
<li>Polarity of every string, at the combiner, before landing.</li>
<li>Open circuit voltage of every string, compared with a calculated expectation.</li>
<li>Short circuit or operational current of every string, scaled to measured irradiance.</li>
<li>Insulation resistance of the array to earth.</li>
<li>Functional test of switches, the inverter and its protection.</li>
<li>Output verification and the handover pack.</li>
</ol>
<h2>Voltage: calculate before you measure</h2>
<p>Write down what you expect, then read the meter. Doing it in the other order makes any number look reasonable.</p>
<p>For a string of 18 modules with Voc of 45.5 V at standard test conditions and a voltage temperature coefficient of minus 0.27 per cent per degree, with a cell temperature estimated at 42 degrees:</p>
<ul>
<li>Nominal string Voc: 18 x 45.5 = 819 V.</li>
<li>Temperature factor: 1 + (minus 0.0027 x (42 minus 25)) = 0.954.</li>
<li>Expected reading: 819 x 0.954 = 781 V.</li>
</ul>
<p>Strings of the same length on the same orientation should agree within a couple of per cent. A shortfall close to a whole multiple of one module's corrected voltage, about 43 V here, points at a module bypassed by its own diode or at a connector pair joined to itself.</p>
<h2>Current: scale to the irradiance on the day</h2>
<p>Measure irradiance in the plane of the array, not horizontally. If the meter reads 820 W per square metre and the module Isc is 11.3 A, expect about 11.3 x 0.82 = 9.27 A. A reading of 9.1 A is a pass. A string reading noticeably low against its neighbours under the same irradiance is telling you about soiling, a shaded module or a poor joint, and the difference between those three is decided by looking at the array, not by more meter work.</p>
<p>Irradiance must be steady while you work. Broken cloud makes every string look different, and the honest response is to wait rather than to record a spread you cannot explain.</p>
<h2>Insulation resistance</h2>
<p>Isolate the array from the inverter and disconnect or bypass any surge protective device, because the device is designed to conduct at high voltage and will both spoil the reading and be stressed by the test. Then choose the test voltage from the system voltage:</p>
<table>
<tr><th>System voltage</th><th>Test voltage</th><th>Minimum resistance</th></tr>
<tr><td>Below 120 V</td><td>250 V</td><td>0.5 megohm</td></tr>
<tr><td>120 V to 500 V</td><td>500 V</td><td>1 megohm</td></tr>
<tr><td>Above 500 V</td><td>1000 V</td><td>1 megohm</td></tr>
</table>
<p>Two accepted methods exist: join positive and negative together and test the pair against earth, or test each pole against earth separately. The second takes longer and tells you which pole is at fault, which is worth having. Discharge the array capacitance afterwards using the tester's own discharge function before touching the conductors.</p>
<h2>Output verification</h2>
<p>Once running, calculate what the plant should be producing and compare. For a 5.0 kWp array at 820 W per square metre, with a module temperature of 55 degrees and a power coefficient of minus 0.35 per cent per degree:</p>
<ul>
<li>Irradiance factor: 820 divided by 1000 = 0.82.</li>
<li>Temperature factor: 1 minus (0.0035 x 30) = 0.895.</li>
<li>System factor for soiling, mismatch, cable and inverter losses: about 0.88.</li>
<li>Expected AC power: 5.0 x 0.82 x 0.895 x 0.88 = 3.23 kW.</li>
</ul>
<p>An inverter display reading 3.1 kW at that moment is a healthy plant. A display reading 1.7 kW is a missing string, and you already have the string readings to prove which one.</p>`,
      Advanced: `<p>Commissioning failures divide neatly into two groups: tests that were done wrongly and so passed a defective plant, and tests that were done correctly and whose result was then explained away. Both are worth going at.</p>
<h2>The insulation test that lies</h2>
<ul>
<li><strong>Surge protective device still in circuit.</strong> The device is built to conduct above a threshold, so leaving it connected during a 1000 V test either drags the reading down to something that looks like a fault or damages the device. Disconnect it, and put it back before you leave, which is the step that gets forgotten.</li>
<li><strong>Testing a wet array and calling it a fail.</strong> Moisture across the surface of a healthy array lowers the reading legitimately. Retest when dry before condemning anything.</li>
<li><strong>Testing a dry array and calling it a pass.</strong> The opposite trap, and the more dangerous one. A nicked sheath at a rail edge or a cracked junction box gland can read tens of megohms dry and fail the moment it rains. Where the symptom history suggests intermittent earth faults, the wet insulation test is the diagnostic that settles it.</li>
<li><strong>Not discharging.</strong> A large array has real capacitance and holds a charge after the test. Use the tester's discharge function and confirm the voltage has collapsed before handling conductors.</li>
</ul>
<p>When a reading is genuinely low, bisect. Split the array at the combiner and retest each half, then each quarter, until you are on one string, then split that string at its midpoint connector. Six or seven measurements will land you on the module or the cable run. Guessing which one looks suspicious usually costs more time than the bisection does.</p>
<h2>Current measurement, honestly</h2>
<p>A short circuit current test means deliberately shorting a string, which is a live DC operation and is only done with a purpose built shorting switch, never by touching conductors together. Where such a device is not available the accepted alternative is to record the operating current with the inverter running and compare strings against each other, which detects the same faults without creating an arc hazard.</p>
<p>DC clamp meters need zeroing on every measurement because the Hall sensor drifts, and a clamp closed around both conductors of a string reads close to zero by design. Both mistakes produce a number, which is why they survive.</p>
<h2>Connectors: the defect that commissions perfectly</h2>
<p>The single most common long term fire cause on a rooftop plant is a cross mated connector, one manufacturer's plug pushed into another manufacturer's socket. It clicks, it looks identical, it passes every commissioning test, and its contact pressure is wrong, so it heats and degrades over years. Check the moulded brand on both halves of every field made joint at inspection and refuse mixed pairs, because no measurement you can take on the day will detect the problem.</p>
<p>Field crimping deserves the same discipline: the correct die for that connector, a full crimp cycle, and a pull test on the first joint of each reel.</p>
<h2>Explaining away a low output</h2>
<p>The expected output calculation carries real uncertainty, so a plant fifteen per cent below expectation invites a comfortable explanation. Resist it and check the cheap things in order: irradiance meter held in the plane of the array rather than flat, module temperature actually measured on the back sheet rather than assumed, all strings present in the inverter's own per string readout, and no clipping because the inverter is at its power limit.</p>
<p>If everything checks and the plant is still short, do not close the job with a note saying it will be reviewed later. Record the measured numbers, the irradiance, the temperature and the time, so that the next visit has a real baseline rather than an impression.</p>
<h2>The handover pack is part of the work</h2>
<p>An as built single line diagram that differs from the plant is worse than none, because the next technician trusts it. Update it on site. The pack carries the string layout, module and inverter datasheets, every test result with instrument and date, the earthing results, the inverter settings that were applied, warranty terms and the maintenance schedule.</p>`,
      Expert: `<p>Commissioning recall sheet. Sequence, thresholds, and the three numbers you calculate before you read a meter.</p>
<h2>Insulation resistance selection</h2>
<table>
<tr><th>System voltage</th><th>Test voltage</th><th>Minimum</th></tr>
<tr><td>Below 120 V</td><td>250 V</td><td>0.5 megohm</td></tr>
<tr><td>120 to 500 V</td><td>500 V</td><td>1 megohm</td></tr>
<tr><td>Above 500 V</td><td>1000 V</td><td>1 megohm</td></tr>
</table>
<h2>The three field formulas</h2>
<ul>
<li>Expected string voltage: number of modules x Voc x (1 + coefficient x (cell temperature minus 25)).</li>
<li>Expected string current: Isc x measured irradiance divided by 1000.</li>
<li>Expected AC power: kWp x irradiance factor x temperature factor x system factor, with the system factor near 0.85 to 0.90 on a clean new plant.</li>
</ul>
<h2>Reading a shortfall</h2>
<table>
<tr><th>Observation</th><th>Most likely cause</th></tr>
<tr><td>One string low by roughly one module's voltage</td><td>Module bypassed by its diode, or a connector pair joined to itself</td></tr>
<tr><td>One string low by about a third of one module's voltage</td><td>One bypass diode failed short across a sub-string</td></tr>
<tr><td>All strings low in voltage, currents normal</td><td>Cells hotter than the temperature you assumed</td></tr>
<tr><td>One string low in current, voltage normal</td><td>Soiling, shading or a high resistance joint in that string</td></tr>
<tr><td>Insulation low, improves as the roof dries</td><td>Water ingress at a gland, a junction box or a damaged sheath</td></tr>
</table>
<h2>Test discipline, two line rules</h2>
<ul>
<li>Calculate the expected value before reading the meter. A number read first is always explained afterwards.</li>
<li>Disconnect surge protective devices before an insulation test and refit them before handover.</li>
<li>Irradiance is measured in the plane of the array, and only under steady sky.</li>
<li>Never short a string by hand. Use a shorting switch, or compare operating currents instead.</li>
<li>Zero the DC clamp before every reading, and clamp one conductor only.</li>
<li>Bisect a low insulation reading rather than inspecting for the guilty part.</li>
<li>Check the moulded brand on both halves of every field made connector pair.</li>
</ul>
<h2>Handover pack, minimum contents</h2>
<ul>
<li>As built single line diagram, corrected on site.</li>
<li>Module and inverter datasheets, and the applied inverter grid settings.</li>
<li>Every test result with the instrument, the date and the conditions.</li>
<li>Earthing continuity and electrode results.</li>
<li>Warranty documents and the maintenance schedule with cleaning intervals.</li>
</ul>`,
    },
  },

  31119: {
    topicId: 31119,
    title: "Net metering application and the DISCOM inspection",
    summary:
      "A rooftop plant only earns its owner anything once the distribution company has approved it, replaced the meter with a bidirectional one and issued a commissioning certificate, and that file moves at the speed of the paperwork the installer prepares. You learn the approval sequence, how the sanctioned load caps the capacity you may install, and exactly what the inspector opens first.",
    concepts: [
      "Net metering and gross metering",
      "Sanctioned load and capacity approval",
      "Technical feasibility study",
      "Bidirectional meter and settlement",
      "Inspection readiness and documentation",
      "Statutory approvals",
    ],
    glossary: {
      "Net metering":
        "An arrangement in which the units your plant exports are set against the units you import in the same billing cycle, so you are billed only on the difference. Surplus units are carried forward and settled at the end of the settlement period.",
      "Gross metering":
        "An arrangement in which everything the plant generates is metered separately and sold to the distribution company, while the consumer's own consumption is billed as before. The economics are completely different from net metering.",
      "Sanctioned load":
        "The load in kilowatts that the distribution company has agreed to supply to that service connection. It appears on the bill, it decides the tariff category, and in most regulations it caps the rooftop capacity that may be sanctioned.",
      "Technical feasibility study":
        "The check the distribution company carries out before approval, looking at the loading of the distribution transformer, the service line and the consumer's own sanctioned load, to decide whether the proposed capacity can be connected.",
      "Bidirectional meter":
        "A meter that registers import and export as separate readings. It replaces the existing meter, is sealed by the distribution company, and cannot be fitted by the installer.",
      "Synchronisation certificate":
        "The document issued after inspection and meter change that permits the plant to be connected in parallel with the network. Exporting before it is issued is unauthorised.",
      "Empanelled vendor":
        "An installer registered with the distribution company or the implementing agency for a particular scheme. Where a scheme requires one, work done by anyone else is outside the scheme regardless of its quality.",
    },
    body: {
      Beginner: `<p>Fitting the plant is only half of the job. Until the distribution company has approved it, changed the meter and issued a certificate, the plant is not allowed to send anything out to the grid, and the owner sees nothing on the bill.</p>
<h2>What net metering means</h2>
<p>An ordinary meter counts units coming in. A <strong>bidirectional meter</strong> counts units coming in and units going out, on two separate registers. At the end of the billing cycle the company subtracts one from the other and bills only the difference.</p>
<p>Take a household that imports 480 units in a cycle and exports 210. It is billed on 270 units, plus the fixed charges that apply to the connection whatever it uses. If in another cycle it exports more than it imports, those surplus units are usually carried forward to the next cycle rather than paid out immediately.</p>
<p>Tell the owner about the fixed charges. A customer who has been promised a zero bill and gets a bill for the fixed charges believes the plant has failed.</p>
<h2>How big a plant is allowed</h2>
<p>Every connection has a <strong>sanctioned load</strong> printed on the bill, which is the load the company has agreed to supply. In most state regulations the rooftop capacity you may install is limited by that number. A house with a sanctioned load of 3 kW usually cannot have a 6 kW plant sanctioned without first applying to increase the load, which is a separate application and can change the tariff.</p>
<p>So you read the bill before you quote. The sanctioned load, the consumer number and the tariff category are all on it, and all three matter.</p>
<h2>The order of the steps</h2>
<ol>
<li>Apply to the distribution company with the consumer number and the proposed capacity.</li>
<li>The company studies whether the local transformer and the service line can take it, and issues an approval.</li>
<li>Only then do you install.</li>
<li>Apply for inspection with the drawings and test reports.</li>
<li>The company inspects, then changes and seals the meter.</li>
<li>The certificate is issued and the plant may export.</li>
</ol>
<p>Installing before the approval arrives is the most expensive mistake in this trade, because if the study comes back refusing the capacity the plant on that roof cannot be connected.</p>
<h2>What the inspector looks at first</h2>
<p>Not the modules. The inspector goes to the meter board and the isolators: is there a switch they can lock off, is it reachable, is the two supply warning label there, and can you produce the earthing test result. Have all of it ready before you call them.</p>`,
      Intermediate: `<p>The connection process is set by the state electricity regulatory commission and administered by the distribution company, so the detail varies between states and is revised from time to time. What does not vary is the shape of the process and the reasons files get returned, and both are worth knowing well enough to plan a job around.</p>
<h2>Three metering arrangements, three different projects</h2>
<ul>
<li><strong>Net metering.</strong> Export is set against import within the billing cycle and only the net is billed. This suits a consumer whose own consumption is comparable to the plant's output, because every unit self consumed is worth the full retail tariff.</li>
<li><strong>Gross metering.</strong> All generation is metered and purchased by the distribution company at a determined tariff, while consumption is billed separately. The consumer's own load pattern becomes irrelevant to the return.</li>
<li><strong>Net billing or net feed-in.</strong> Self consumption is free, and exported units are credited at a rate that is not the retail tariff. This is increasingly common and it changes the design brief, because it rewards sizing the plant to the daytime load rather than to the annual bill.</li>
</ul>
<p>Which arrangement applies to a given consumer category is a regulatory question. Read the current regulation for the state rather than repeating a figure from an old proposal, and never quote a rate or a subsidy amount as current fact to a customer.</p>
<h2>Sanctioned load and the transformer</h2>
<p>Two ceilings usually apply at once, and a design has to clear both.</p>
<ol>
<li>The rooftop capacity that may be sanctioned for a consumer is tied to that consumer's sanctioned load. If the customer wants more, the sanctioned load enhancement application comes first, and it may change the tariff category, the service cable and the meter.</li>
<li>The aggregate rooftop capacity connected to one distribution transformer is capped as a proportion of the transformer rating, so a feasibility study can refuse a perfectly reasonable application because neighbours got there first. This is why the feasibility outcome cannot be predicted from the customer's bill alone.</li>
</ol>
<h2>The sequence, and where installers lose weeks</h2>
<ol>
<li>Registration and application with the consumer number, sanctioned load, category, proposed capacity and the installer's details.</li>
<li>Feasibility study and approval, usually with a validity period inside which the work must be completed.</li>
<li>Installation, using equipment from an approved list where a scheme requires it.</li>
<li>Application for inspection, with the as built single line diagram, test reports and datasheets, certified by a licensed electrical contractor or supervisor.</li>
<li>Inspection, and where the capacity or the voltage level crosses the state's threshold, clearance from the electrical inspectorate as well.</li>
<li>Meter replacement and sealing by the distribution company, followed by the synchronisation certificate.</li>
</ol>
<p>The delay is almost always at step four, because the file goes in incomplete. Assemble it while the scaffolding is up.</p>
<h2>Settlement arithmetic the owner will ask about</h2>
<p>Cycle one: import 480 units, export 210 units. Billed on 270 units plus fixed charges. Cycle two: import 300, export 350. Net export of 50 units, carried forward as a credit against the next cycle rather than paid in cash. At the end of the settlement year the remaining credit is settled at the rate the commission has determined, which is not the retail tariff.</p>
<p>Two honest caveats for the customer. Fixed and demand charges continue regardless of generation, and a plant sized far above the daytime load builds up credits that settle at the lower rate, which is why oversizing rarely pays under net billing.</p>
<h2>Documents to have on site at inspection</h2>
<ul>
<li>Feasibility approval letter and the application acknowledgement.</li>
<li>As built single line diagram matching the plant that is actually on the roof.</li>
<li>Module and inverter datasheets, and the inverter's applied grid protection settings.</li>
<li>Insulation resistance, polarity, string voltage and earthing test results, signed and dated.</li>
<li>Structural adequacy certificate where the consumer category requires it.</li>
<li>Roof owner's consent where the consumer is a tenant.</li>
<li>Licence details of the contractor or supervisor certifying the work.</li>
</ul>`,
      Advanced: `<p>Treat the approval file as a deliverable with its own defect list. Almost every rejection comes from one of a small number of causes, and each has a cheap preventive action taken weeks earlier.</p>
<h2>The rejection list, and what prevents each</h2>
<table>
<tr><th>Reason the file comes back</th><th>What prevents it</th></tr>
<tr><td>Proposed capacity exceeds what the sanctioned load allows</td><td>Read the sanctioned load off the bill at survey and quote against it, or start the load enhancement first</td></tr>
<tr><td>Transformer already at its aggregate rooftop cap</td><td>Apply for feasibility before promising a date, and treat the approval as the trigger for procurement</td></tr>
<tr><td>Installed before approval</td><td>Never mobilise on a verbal clearance, whatever the customer has been told</td></tr>
<tr><td>Single line diagram does not match the plant</td><td>Redraw on site the day the last string is landed</td></tr>
<tr><td>No accessible lockable isolator for utility staff</td><td>Agree its position at survey, not at the end of the job</td></tr>
<tr><td>Test reports missing or unsigned</td><td>Commissioning results go into the file the same day they are taken</td></tr>
<tr><td>Equipment not on the approved list for the scheme claimed</td><td>Check the list at procurement, since a module cannot be made eligible afterwards</td></tr>
</table>
<h2>Managing the customer's expectations honestly</h2>
<p>The two conversations that go wrong are the bill and the timeline. On the bill, be specific: fixed charges continue, the credit for surplus is settled at a determined rate rather than the retail tariff, and the saving depends on how much of the generation the household uses during daylight. A customer who runs a pump and a motor in the afternoon gains more from the same plant than one who is out all day.</p>
<p>On the timeline, separate what you control from what you do not. Installation is days. Feasibility, inspection scheduling and meter replacement are the distribution company's process and are not accelerated by the installer promising a date. Give the customer the sequence and tell them which step the file is on.</p>
<h2>The inspection itself</h2>
<p>An inspector has limited time and a mental order of checks. They start where a defect would be dangerous and visible: the meter board, the isolators, the labels, the earthing. Then they ask for the drawing and compare it with the plant. Then they ask you to demonstrate that the inverter disconnects when the supply is removed.</p>
<p>Three practical preparations make the visit short. Have the board open and the covers off before they arrive. Have the file in order and in the order they will ask for it. And have a competent person available at the inverter and at the board at the same time, so a demonstration does not need somebody to run up two flights of stairs.</p>
<p>Where the plant crosses the state's threshold for capacity or voltage, an approval from the electrical inspectorate is required in addition to the distribution company's inspection, and the two are separate applications with separate lead times. Find out which applies at survey, because discovering it after installation adds weeks.</p>
<h2>After the certificate</h2>
<p>Read the first bill with the customer. Confirm that the export register is advancing, that the import and export figures match what the inverter has logged, and that the tariff category has not been changed unintentionally by the load enhancement. A meter installed with reversed polarity on its measuring element registers export as import, and the only place that shows up is the first bill.</p>
<p>Leave the customer with the consumer number, the approval reference, the certificate and the name of the office that handles the connection. When something goes wrong two years later, that is the information nobody can find.</p>`,
      Expert: `<p>Approvals recall sheet. The order, the ceilings and the file.</p>
<h2>Metering arrangements compared</h2>
<table>
<tr><th></th><th>Net metering</th><th>Gross metering</th><th>Net billing</th></tr>
<tr><td>What is measured</td><td>Import and export separately, netted</td><td>All generation, sold to the utility</td><td>Import and export, valued differently</td></tr>
<tr><td>Value of a self consumed unit</td><td>Retail tariff</td><td>Not applicable</td><td>Retail tariff</td></tr>
<tr><td>Value of an exported unit</td><td>Retail tariff within the cycle</td><td>Determined generation tariff</td><td>Determined feed-in rate, below retail</td></tr>
<tr><td>Best sizing strategy</td><td>Against the annual consumption</td><td>Against the roof and the budget</td><td>Against the daytime load</td></tr>
</table>
<h2>Sequence, six steps</h2>
<ol>
<li>Apply with consumer number, sanctioned load, category, capacity.</li>
<li>Feasibility study and approval, with a validity period.</li>
<li>Install, using approved list equipment where a scheme requires it.</li>
<li>Apply for inspection with the certified file.</li>
<li>Inspection, plus electrical inspectorate clearance above the state threshold.</li>
<li>Meter change and sealing, then the synchronisation certificate.</li>
</ol>
<h2>Two ceilings, checked at survey</h2>
<ul>
<li>Capacity against the consumer's own sanctioned load. Enhancement is a separate, earlier application.</li>
<li>Aggregate rooftop capacity on the distribution transformer, which you cannot see from the customer's bill.</li>
</ul>
<h2>Inspection day checklist</h2>
<ul>
<li>Board open, covers off, isolators labelled, dual supply warnings fitted.</li>
<li>File in order: approval, drawing, datasheets, test results, licence details.</li>
<li>As built drawing that matches the roof, not the quotation.</li>
<li>Two people, one at the inverter and one at the board, for the disconnection demonstration.</li>
<li>Earthing results and insulation results available on paper, with dates.</li>
</ul>
<h2>Things never to say to a customer</h2>
<ul>
<li>A current rate, fee or subsidy figure quoted from memory. Rates are determined by the commission and revised.</li>
<li>A promised connection date, because the meter change is not on your schedule.</li>
<li>That the bill will be zero. Fixed and demand charges continue.</li>
<li>That surplus units are paid at the retail tariff. They settle at the determined rate.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A household imports 480 units and exports 210 units during one billing cycle under net metering. What is billed?",
        options: [
          "690 units, being the total of both registers",
          "480 units, since export is settled separately at the end of the year",
          "270 units, plus the fixed charges that apply to the connection",
          "210 units, since export is deducted from the bill as a cash credit",
        ],
        answer: 2,
        explanation:
          "Net metering sets export against import within the same cycle, so the consumer is billed on the 270 unit difference, and the fixed or demand charges for the connection continue on top of that. Expecting export to appear as a cash credit is the common customer assumption, and it is why a first bill showing fixed charges is so often reported as a fault with the plant.",
        difficulty: "Easy",
        skill: "Bidirectional meter and settlement",
      },
      {
        n: 2,
        question:
          "A customer with a sanctioned load of 3 kW asks for a 6 kW rooftop plant. What is the correct first step?",
        options: [
          "Install the 6 kW plant and apply for net metering afterwards",
          "Apply to enhance the sanctioned load, since most regulations cap the sanctioned rooftop capacity against it",
          "Install 3 kW now and add the rest without informing the distribution company",
          "Fit a 6 kW inverter but limit its output in software and say nothing",
        ],
        answer: 1,
        explanation:
          "The sanctioned rooftop capacity is normally tied to the consumer's sanctioned load, so the load enhancement is a separate and earlier application that may also change the tariff category and the service arrangements. Installing first and applying later is the expensive error, because a refused feasibility leaves a plant on the roof that cannot be connected at all.",
        difficulty: "Medium",
        skill: "Sanctioned load and capacity approval",
      },
      {
        n: 3,
        question:
          "Why can a feasibility study refuse an application even when the customer's own sanctioned load is comfortably above the proposed capacity?",
        options: [
          "Because the customer has an outstanding bill",
          "Because the aggregate rooftop capacity already connected to that distribution transformer may have reached its cap",
          "Because the roof faces south",
          "Because the inverter brand is not sold in that district",
        ],
        answer: 1,
        explanation:
          "Two ceilings apply at once, and the second is the proportion of the distribution transformer's rating that may be taken up by rooftop plant across all the consumers on it, which neighbours may already have consumed. Assuming the customer's own load settles the question is the trap, because that information is on the bill while the transformer loading is not.",
        difficulty: "Hard",
        skill: "Technical feasibility study",
      },
      {
        n: 4,
        question:
          "Under gross metering, how does the arrangement differ from net metering?",
        options: [
          "The plant is not allowed to export at all",
          "All generation is metered and purchased by the distribution company, and the consumer's own consumption is billed separately",
          "Only the surplus after self consumption is measured",
          "The consumer receives a single bill showing the net of the two registers",
        ],
        answer: 1,
        explanation:
          "Gross metering separates the two flows completely: everything generated is sold to the utility at a determined tariff and everything consumed is bought at the retail tariff, so the household's own load pattern no longer affects the return. Describing it as measuring only the surplus is a description of net metering, which is exactly the confusion the two names invite.",
        difficulty: "Medium",
        skill: "Net metering and gross metering",
      },
      {
        n: 5,
        question:
          "Which item does an inspector typically examine first on arrival at a rooftop installation?",
        options: [
          "The alignment and tilt of the modules",
          "The meter board and isolators, their labelling and accessibility, and the earthing test result",
          "The cleanliness of the module glass",
          "The brand of the mounting rails",
        ],
        answer: 1,
        explanation:
          "The inspector starts where a defect would be both dangerous and quickly visible, which is the board, the isolation arrangements, the dual supply labelling and the evidence that earthing was tested. Module alignment is what the customer notices, but it carries no safety consequence and is not what an inspection is for.",
        difficulty: "Easy",
        skill: "Inspection readiness and documentation",
      },
      {
        n: 6,
        question:
          "When is an additional clearance from the electrical inspectorate typically required, over and above the distribution company's inspection?",
        options: [
          "On every rooftop plant regardless of size",
          "Only when the plant uses batteries",
          "When the capacity or the voltage level crosses the threshold the state has set for such approval",
          "Never, since the distribution company inspection replaces it",
        ],
        answer: 2,
        explanation:
          "States set a threshold of capacity or voltage above which the electrical inspectorate must also clear the installation, and it is a separate application with its own lead time that has to be identified at survey. Assuming the distribution company inspection covers everything is the scheduling error that adds weeks after the plant is already built.",
        difficulty: "Medium",
        skill: "Statutory approvals",
      },
      {
        n: 7,
        question:
          "The plant is complete and generating, but the synchronisation certificate has not yet been issued. What is the correct position?",
        options: [
          "The plant may export, since the equipment is installed and tested",
          "The plant may not be connected in parallel with the network until the certificate is issued",
          "The plant may export only at night",
          "The plant may export if the owner informs the distribution company by telephone",
        ],
        answer: 1,
        explanation:
          "Parallel operation with the network is what the synchronisation certificate authorises, so exporting before it is issued is unauthorised regardless of how complete or well tested the installation is. A telephone call sounds like reasonable notice but creates no authorisation and leaves the installer answering for an unapproved connection.",
        difficulty: "Medium",
        skill: "Statutory approvals",
      },
    ],
  },

  31120: {
    topicId: 31120,
    title: "Cleaning, hot spots and a maintenance log the owner keeps",
    summary:
      "A rooftop plant loses output slowly and quietly, so the difference between a good installation and a poor one shows up two years later in the generation figures rather than on handover day. You learn how to clean modules without damaging them, how a hot spot forms and how to find one, and how to leave the owner a log that turns a vague complaint into a diagnosable fault.",
    concepts: [
      "Soiling loss and cleaning method",
      "Hot spot formation and bypass diodes",
      "Thermal and visual inspection",
      "Performance ratio tracking",
      "Preventive maintenance schedule",
      "Fault triage from the owner's log",
    ],
    glossary: {
      "Soiling loss":
        "The share of generation lost because dust, bird droppings or pollen sit on the glass. It builds up between rains and is recovered by cleaning, which distinguishes it from a permanent fault.",
      "Bypass diode":
        "A diode fitted across a group of cells inside the module junction box. It conducts when that group cannot pass the string current, giving the current a way around and limiting the heat produced in the weak cell.",
      "Hot spot":
        "A cell forced to dissipate the string's power as heat because it cannot pass the current the rest of the string is producing. It can crack glass, scorch the back sheet and eventually open the circuit.",
      "Reverse bias":
        "The condition of a cell being driven backwards by the voltage of the other cells in series with it. A shaded or damaged cell in a string is in reverse bias and is a consumer of power rather than a producer.",
      "Performance ratio":
        "The generation a plant actually delivered divided by what its rated capacity should have delivered from the sunlight that fell on it. It is a number between zero and one, and it is the honest way to compare one month with another.",
      "Specific yield":
        "Generation divided by rated capacity, in kilowatt hours per kilowatt peak. It lets a 3 kW plant and a 10 kW plant be compared directly.",
      "Snail trail":
        "A dark branching line visible on the front of a module, caused by discolouration along a micro crack. It is a symptom of a crack rather than a defect in itself.",
    },
    body: {
      Beginner: `<p>A new plant works well because everything is clean and nothing has moved. Both of those change. Maintenance is the work that keeps the plant near the output it had on day one, and most of it is simple.</p>
<h2>Dust costs more than people expect</h2>
<p>Modules make power from light, and a layer of dust on the glass blocks some of it. Between rains, in a dry district, the loss builds up steadily. It is not a fault and it does not need a technician, it needs water.</p>
<h2>How to clean without damage</h2>
<ul>
<li>Clean early in the morning or after sunset, never in the middle of a hot day. Cold water on hot glass can crack it.</li>
<li>Use plain water and a soft brush or a squeegee on a long pole. No detergent, no scouring pad, no hard scraping.</li>
<li>Do not stand on the modules. A footstep leaves cracks inside the cells that you cannot see and that show up as a fault years later.</li>
<li>Do not aim a pressure jet at the junction box on the back or at the edges of the frame, because water forced past a seal stays there.</li>
<li>Water with heavy mineral content dries into a film that blocks more light than the dust did, so use the cleanest water available.</li>
</ul>
<p>The array is live in daylight throughout. Cleaning does not require any connection to be opened, and nothing on the roof should be unplugged to do it.</p>
<h2>What a hot spot is</h2>
<p>The cells in a module are joined in a chain, so the same current has to pass through every one. If a single cell is shaded by a leaf or is cracked, it cannot pass that current, and the other cells push against it. That cell then turns the power into heat instead of electricity, and it becomes far hotter than the ones around it. That is a <strong>hot spot</strong>, and left alone it can brown the back of the module or crack the glass.</p>
<p>Manufacturers fit small components called bypass diodes inside the junction box to give the current a path around a weak group of cells. They work, and they can also fail, which is one of the things a service visit checks for.</p>
<h2>The owner's log</h2>
<p>Ask the owner to write down five things once a month: the date, the import and export readings on the meter, the total generation shown on the inverter, any error message on its screen, and the date the modules were last cleaned. One page a year.</p>
<p>That page is what makes a complaint solvable. Without it a customer says generation seems low, and nobody can tell whether it is low compared with last month, last year or an expectation that was never realistic.</p>`,
      Intermediate: `<p>Maintenance work divides into three activities that are often confused: cleaning, which recovers a loss that is not a fault, inspection, which finds faults before they cost generation, and measurement, which tells you whether either of the first two is working.</p>
<h2>Deciding when cleaning is worth a visit</h2>
<p>Cleaning is only worth doing when the generation recovered exceeds the cost of the visit, and the way to find out is to measure rather than to assume. On a clear, steady day, clean one string and leave an adjacent identical string dirty, then compare their currents at the same irradiance an hour later. The difference is the current soiling loss for that site, and it sets the cleaning interval for that district and that season far better than a general rule does.</p>
<p>Sites near a cement plant, an unpaved approach road or a heavily farmed area soil much faster than the district average, and a site with a low tilt angle holds dust that a steeper array sheds in the first shower.</p>
<h2>Hot spots: mechanism and detection</h2>
<p>Cells in a module are in series, so the weakest cell sets the current. When one cell is shaded, cracked or heavily soiled, the remaining cells drive current through it in reverse bias, and the power that would have been generated is dissipated in that one cell as heat. The bypass diode across each sub-string conducts once the reverse voltage reaches its threshold, offering a path around the weak group.</p>
<p>Diodes fail in two distinct ways, and the symptoms are different:</p>
<ul>
<li><strong>Failed open.</strong> No protection remains, so the hot spot returns whenever that group is under-performing. The string voltage looks normal, which is why this one is missed.</li>
<li><strong>Failed short.</strong> That sub-string is permanently bypassed, so the module contributes roughly two thirds of its voltage. On a string of eighteen modules the total falls by about a third of one module's voltage, which is a measurable and characteristic step.</li>
</ul>
<p>Detection uses three tools in increasing order of cost: comparison of string open circuit voltages, a visual survey of the front and back of the modules for discolouration, snail trails and back sheet browning, and a thermal camera. Thermal imaging is done in the middle of a clear day with the plant under load and irradiance well above half of full sun, because a cell that is not being driven is not being heated.</p>
<h2>Performance ratio, worked</h2>
<p>Performance ratio compares what the plant delivered with what its capacity should have delivered from the sunlight that actually arrived.</p>
<p>Take a 5.0 kWp plant that generated 620 kWh in a month, with in-plane insolation of 5.1 kWh per square metre per day:</p>
<ul>
<li>Monthly insolation: 5.1 x 30 = 153 kWh per square metre.</li>
<li>Reference yield: 153 divided by 1 kW per square metre = 153 hours.</li>
<li>Expected generation: 5.0 x 153 = 765 kWh.</li>
<li>Performance ratio: 620 divided by 765 = 0.81.</li>
<li>Specific yield: 620 divided by 5.0 = 124 kWh per kWp, or 4.13 per day.</li>
</ul>
<p>A ratio near 0.80 on a hot rooftop plant is healthy. If the following month returns 0.68 on similar weather, roughly sixteen per cent of the output has gone somewhere, and the question is whether cleaning brings it back. If it does, it was soiling. If it does not, it is a fault and the string readings will find it.</p>
<h2>The preventive schedule</h2>
<table>
<tr><th>Interval</th><th>Work</th></tr>
<tr><td>Monthly, by the owner</td><td>Meter readings, inverter generation total, any error code, visible soiling, cleaning date</td></tr>
<tr><td>Quarterly</td><td>Visual survey of glass and back sheets, cable ties and cable support, connector condition, vegetation and new shading</td></tr>
<tr><td>Half yearly</td><td>Structure fastener check, earthing continuity, inverter ventilation and filters, surge device indicator, string voltage comparison</td></tr>
<tr><td>Annually</td><td>Insulation resistance, full string voltage and current comparison, thermal survey, torque audit on structural fixings, log review against the previous year</td></tr>
</table>`,
      Advanced: `<p>Two things separate a service technician from someone who cleans panels: reading a generation history correctly, and knowing which measurements are being fooled by the conditions they were taken in.</p>
<h2>Comparing performance ratio honestly</h2>
<p>Performance ratio falls in hot months because module efficiency falls with cell temperature, so a May figure lower than a January figure may mean nothing at all. There are two defensible comparisons. The first is the same month year on year, which holds temperature roughly constant and exposes real degradation. The second is a temperature corrected ratio, in which the expected output is adjusted using the module power coefficient and a measured or modelled cell temperature before the division is done.</p>
<p>Beware also of the insolation figure. A ratio calculated against horizontal insolation for a tilted array is systematically wrong, and it drifts across the year in a way that looks exactly like seasonal degradation.</p>
<h2>Thermal imaging that produces a false verdict</h2>
<ul>
<li><strong>Imaging at low irradiance.</strong> Below roughly six hundred watts per square metre the temperature differences are too small to separate a defect from normal variation.</li>
<li><strong>Imaging at open circuit.</strong> With the inverter off there is no current, and a defect that only heats under load is invisible. Image with the plant running.</li>
<li><strong>Sky reflection.</strong> Glass reflects, so imaging from directly in front puts the camera's own reflection and the sky into the frame. Work at an angle of thirty to sixty degrees to the module face.</li>
<li><strong>Wind.</strong> A breeze across the array flattens the temperature differences you are hunting. A still morning gives a cleaner picture than a windy afternoon.</li>
<li><strong>Reading the pattern, not the number.</strong> A single very hot cell suggests a crack. A hot patch matching a shadow suggests obstruction. A whole sub-string uniformly warm suggests a conducting bypass diode. The absolute temperature matters less than which of those three shapes you are looking at.</li>
</ul>
<h2>Cleaning decisions that cost money</h2>
<p>Abrasive pads, hard bristles and scraping remove the anti-reflective coating, which permanently lowers output and is usually excluded from the warranty. Borewell water with a high dissolved solids content dries into a mineral film, so a plant cleaned with it can measure worse after the visit than before, and the second cleaning does not remove the film either. Where the only available water is hard, a squeegee finish that removes standing water before it evaporates is the practical mitigation.</p>
<p>Walking on modules is the damage that is never attributed to the person who caused it. The micro cracks propagate over seasons and present later as a hot spot, by which time the visit that caused it is a year in the past. Access from a walkway or a pole is not a preference.</p>
<h2>Triage from the owner's log</h2>
<p>When a customer reports low generation, the shape of the daily curve narrows the cause before any instrument comes out of the van.</p>
<table>
<tr><th>Curve shape</th><th>Likely cause</th></tr>
<tr><td>Flat top at a constant value</td><td>Inverter at its power limit, which is normal on an oversized array</td></tr>
<tr><td>Whole curve lower, right shape</td><td>Soiling, degradation, or a missing string</td></tr>
<tr><td>Notch at the same clock time each day</td><td>Shading from a new obstruction, a water tank, an antenna or a grown tree</td></tr>
<tr><td>Sudden midday collapse and recovery</td><td>Grid overvoltage trip, or inverter thermal derating</td></tr>
<tr><td>Ragged, cloud shaped variation</td><td>Weather, not a fault</td></tr>
</table>
<p>Only after the curve has been read do the string measurements start, and they start with the comparison between strings rather than with an absolute value, because two strings under the same sky are the most reliable reference available on site.</p>
<h2>Leaving a plant maintainable</h2>
<p>Number the strings physically and on the drawing, with the same numbers used in the inverter's own per string display. Label the combiner ways. Record the commissioning values so the next technician has a baseline. A plant whose strings are unlabelled forces every future visit to begin with an hour of tracing, and that hour is usually charged to the owner.</p>`,
      Expert: `<p>Service recall sheet. The formulas, the schedule and the shapes.</p>
<h2>Numbers you compute on site</h2>
<ul>
<li>Performance ratio: generation in kWh divided by (kWp x in-plane insolation in kWh per square metre).</li>
<li>Specific yield: generation divided by kWp, in kWh per kWp, daily or monthly.</li>
<li>Soiling loss: current of a cleaned string minus current of a dirty string, divided by the cleaned value, measured at the same irradiance.</li>
<li>Diode short signature: string voltage falls by about one third of one module's voltage.</li>
</ul>
<h2>Bypass diode failure modes</h2>
<table>
<tr><th>Failure</th><th>Electrical symptom</th><th>Risk</th></tr>
<tr><td>Open circuit</td><td>String voltage normal</td><td>No hot spot protection remains, so the cell can crack the glass</td></tr>
<tr><td>Short circuit</td><td>String voltage low by about a third of a module</td><td>Permanent loss of that sub-string's output</td></tr>
</table>
<h2>Thermal survey conditions</h2>
<ul>
<li>Irradiance well above six hundred watts per square metre, steady sky.</li>
<li>Plant running under load, never at open circuit.</li>
<li>Camera at thirty to sixty degrees to the glass to avoid sky reflection.</li>
<li>Low wind, otherwise the differences are cooled away.</li>
<li>Read the pattern: one hot cell means a crack, a shadow shaped patch means obstruction, a warm sub-string means a conducting diode.</li>
</ul>
<h2>Cleaning rules, two lines each</h2>
<ul>
<li>Early morning or after sunset only. Cold water on hot glass cracks it.</li>
<li>Plain water, soft brush or squeegee. Abrasives remove the anti-reflective coating and void the warranty.</li>
<li>Never stand on a module. The micro cracks present as a hot spot a year later.</li>
<li>No pressure jet at glands, junction boxes or frame edges.</li>
<li>Hard water leaves a film worse than the dust. Squeegee the water off before it dries.</li>
</ul>
<h2>Owner's monthly log, five columns</h2>
<ul>
<li>Date, meter import reading, meter export reading, inverter lifetime generation, error code if any, cleaning date.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li>Performance ratio compared across seasons without temperature correction: a normal summer reads as a fault.</li>
<li>Ratio computed against horizontal insolation for a tilted array: a systematic error that drifts with the season.</li>
<li>Strings unlabelled and not matched to the inverter display: every future visit starts with an hour of tracing.</li>
<li>Surge device indicator never checked, so a spent device reads as installed for years.</li>
<li>New water tank or antenna installed by the owner: a notch appears at the same clock time each day.</li>
</ul>`,
    },
  },
};

export default PART;
