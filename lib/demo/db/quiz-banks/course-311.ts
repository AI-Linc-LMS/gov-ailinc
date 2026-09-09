import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 311, Solar PV Installer & Rooftop Technician.
 *
 * Every `skill` below is one word lifted from a topic title in course 311, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts builds a topic's concepts by splitting
 * its title, dropping stopwords and words of two letters or less, and keeping at most four.
 * `bankForTopic` then matches this skill against that list case-insensitively. A word that is
 * not among a topic's first four concepts matches nothing and sinks to the bottom of every
 * pile, so each skill below was checked against the derived list, not against the title as
 * read. That check is why the skill for the module topic is "Nameplate" and not "PV": two
 * letter words never survive the filter.
 *
 * Skills used, module by module:
 *   1 Power, Survey, Bill                 4 Ballasted, Wind, Harness
 *   2 Nameplate, Microinverters,          5 Fuses, RCCB, Earthing
 *     Connectors, Batteries               6 Metering, Insulation
 *   3 MPPT, Temperature, Ratio
 *
 * Difficulty is six Easy, six Medium, six Hard, and the correct option is spread across the
 * four positions (A x4, B x5, C x5, D x4). The three calculation questions keep their options
 * in ascending order, so their keys are placed by the arithmetic and not by the spread.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 311001: solar basics and the site survey ---- */
  mcq(
    311,
    1,
    "A grid connected rooftop plant with no battery is running at midday, and the house is drawing less than the array is making. Where does the surplus go?",
    [
      "It is stored inside the inverter and released after sunset",
      "It is dissipated as heat in the array and the DC cables",
      "The modules stop making it, because a module produces only what is being consumed",
      "It flows out through the meter into the DISCOM network, and the meter records it as export",
    ],
    3,
    "Easy",
    "Power",
    "A grid tied inverter converts, it does not store. Whatever the house is not using at that instant leaves through the meter, which counts import and export separately, and that export is what the net metering arrangement later sets off against the units bought. The tempting answer is that the inverter holds the surplus until evening, because that is what the owner expects a solar plant to do. Storage needs a battery and a hybrid inverter, and a plant sold without them will always go dark at night. The third option describes a zero export site, where the inverter is deliberately told to throttle back to what the house is using.",
  ),
  mcq(
    311,
    2,
    "During the survey you find a vent pipe that shades two modules of a ten module series string for about two hours every morning. What happens to that string in those hours?",
    [
      "Output falls by about one fifth, in proportion to the two shaded modules",
      "Output is unaffected, because the inverter's MPPT tracks around the shade",
      "The current of the whole string is dragged down towards what the shaded modules can pass, so the loss is much larger than one fifth",
      "The string keeps its output, but the two shaded modules overheat and are damaged",
    ],
    2,
    "Medium",
    "Survey",
    "Modules in series all carry the same current, so the weakest module in the string sets the current for every module in it. Bypass diodes limit the damage by routing current around the affected section, but the section they bypass then contributes nothing, so a small shadow costs far more than its share of the roof. The tempting answer is the proportionate one fifth, and it is the reason shading is dismissed at survey stage as a minor loss. Note it on the survey and answer it in the design: move the array, put the shaded modules on a string of their own, or use module level electronics.",
  ),
  mcq(
    311,
    3,
    "A household bill shows 300 units consumed in a 30 day month. The site yields roughly 4 units per day for each kW of array. Which array size comes closest to matching that consumption?",
    ["1.5 kW", "2.5 kW", "5 kW", "10 kW"],
    1,
    "Medium",
    "Bill",
    "Work in daily terms. 300 units over 30 days is 10 units a day, and at 4 units per kW per day that needs 10 divided by 4, which is 2.5 kW. The tempting answer is 10 kW, and it comes from dividing 300 by 30 and reading the daily consumption as though it were a size in kW. Two cautions for the quotation you write next: a unit on the bill is a kWh, and the yield of 4 units per kW is a site figure that falls in the monsoon and on a dusty roof, so take it from the district and the tilt rather than from a brochure.",
  ),

  /* ---- Module 311002: modules, inverters and balance of system ---- */
  mcq(
    311,
    4,
    "A module nameplate reads 540 W at Standard Test Conditions. What does that tell you about a hot afternoon on a Telangana rooftop?",
    [
      "The module will produce 540 W whenever the sun is on it",
      "540 W is the average output across a full day of sunshine",
      "540 W is measured at 1000 W per square metre with the cell at 25 degrees, so a hot roof gives less",
      "540 W is the output the manufacturer guarantees for twenty five years",
    ],
    2,
    "Easy",
    "Nameplate",
    "Standard Test Conditions are a laboratory reference, 1000 W per square metre, a cell temperature of 25 degrees and a defined solar spectrum, and they exist so that two modules can be compared on the same basis. On a roof at noon the cell often sits 25 to 30 degrees above the air around it, and with a power coefficient near minus 0.35 per cent per degree a cell at 60 degrees is down about 12 per cent, so the same module delivers nearer 475 W. The tempting answer is the twenty five year figure, because a number with that span does appear on the datasheet. That one is the performance warranty, which promises a percentage of the rated output after years of degradation, and it is a different promise about a different thing.",
  ),
  mcq(
    311,
    5,
    "A house has modules on two roof faces, one facing south east and one south west, and a water tank shades a corner of one face in the evening. Why do microinverters or module level optimisers suit this roof better than a plain string inverter?",
    [
      "Each module is held at its own maximum power point, so a differently oriented or shaded module does not hold back the others",
      "They lift a shaded module back to its rated output",
      "There is no DC wiring left on the roof, so no isolation and no frame earthing are needed",
      "They allow a longer series string, so fewer strings and less cable are needed",
    ],
    0,
    "Medium",
    "Microinverters",
    "A string inverter tracks one operating point for a whole series string, so a string spanning two orientations settles on a compromise that suits neither, and a shaded module drags the rest down with it. Module level electronics give each module its own tracking, which contains the loss to the module that is actually affected. The tempting answer is that the shaded module is restored to its rating, and it is worth being clear with the owner that nothing recovers light that is not falling on the glass. Also weigh the cheaper option first: a string inverter with two MPPT inputs handles two orientations well, and it is the shade, not the split roof, that decides the case for going to module level.",
  ),
  mcq(
    311,
    6,
    "Two DC connectors from different manufacturers look identical and click together on site. Why is mating them still wrong?",
    [
      "The two connectors carry different current ratings, so the smaller one overheats",
      "It voids the module warranty but carries no electrical risk on site",
      "The polarity marking is reversed between manufacturers",
      "A pair that was never type tested together may not hold contact pressure or keep its seal, so the joint runs hot and corrodes",
    ],
    3,
    "Easy",
    "Connectors",
    "Connectors are tested and rated as a mated pair, and two housings that latch are not evidence that the pins inside make full contact or that the gasket seals. A cross mated joint carries current all day on a circuit you cannot switch off from the ground, so a small extra contact resistance heats, oxidises and heats further, and rooftop DC arc faults are traced to exactly this. The tempting answer is that it is only a warranty matter, because that is how it is usually argued on site. The warranty is the smaller half of it. Carry one brand of connector, crimp with that brand's tool, and cut back and remake a joint rather than mixing.",
  ),
  mcq(
    311,
    7,
    "The grid at a village site fails several times a day. The owner has an ordinary grid tied rooftop plant and complains that the lights go off even at noon in full sun. What explains it?",
    [
      "The inverter is required to disconnect when the grid fails, and without a battery and a changeover there is nothing left to run the house from",
      "The modules stop producing when the grid fails, because they need grid voltage to start",
      "The net meter stops the plant, because export is not allowed while the feeder is down",
      "The inverter trips on overload each time and has to be reset by hand",
    ],
    0,
    "Easy",
    "Batteries",
    "A grid tied inverter must stop feeding a dead line, so that a lineman working on the feeder is not energised from the rooftop behind him. That protection is called anti islanding, it is not a fault, and it cannot be switched off. This is the site where a hybrid inverter with a battery and a backup circuit earns its cost, and it is also the test to apply before quoting one: a site with a steady supply gains nothing from a battery except the expense and a replacement every few years. The tempting answer is that the modules stop, and the distinction matters when you diagnose, because the array is producing normally and it is the inverter that has opened.",
  ),

  /* ---- Module 311003: sizing and stringing the array ---- */
  mcq(
    311,
    8,
    "An inverter has an MPPT operating window of 200 V to 800 V and a maximum DC input of 1000 V. The modules are 40 V open circuit and 33 V at maximum power. Leaving temperature correction aside, what is the longest series string you can connect?",
    ["20 modules", "24 modules", "25 modules", "30 modules"],
    1,
    "Hard",
    "MPPT",
    "Two ceilings apply and you have to satisfy both. The maximum input voltage of 1000 V is about not destroying the inverter and is checked against open circuit voltage: 24 modules give 960 V and 25 give exactly 1000 V. The top of the MPPT window is about the tracker being able to hold the operating point, and it is checked against the maximum power voltage: 24 modules give 792 V, inside the window, while 25 give 825 V, outside it. So 24 is the longest string that satisfies both. The tempting answer is 25, from checking only the 1000 V limit, which leaves an array the inverter survives but cannot track. In the real design you correct the open circuit voltage upward for the coldest morning before doing any of this, and that usually shortens the string again.",
  ),
  mcq(
    311,
    9,
    "A module has an open circuit voltage of 40 V at 25 degrees and a temperature coefficient of open circuit voltage of minus 0.30 per cent per degree. The coldest cell temperature expected at the site is 5 degrees. Which voltage do you use for string sizing?",
    ["37.6 V", "40 V", "42.4 V", "44.8 V"],
    2,
    "Hard",
    "Temperature",
    "The site is 20 degrees below the 25 degree reference, and the coefficient is negative, so a fall in temperature raises the voltage. Twenty degrees at 0.30 per cent each is 6 per cent, and 40 V multiplied by 1.06 is 42.4 V. The tempting answer is 37.6 V, which is what you get by applying the minus sign a second time and correcting downward. The direction is the whole point of the topic: an array goes over the inverter's maximum input voltage on a cold clear morning at first light, not on a hot afternoon, and an inverter destroyed that way is a warranty claim the manufacturer will refuse.",
  ),
  mcq(
    311,
    10,
    "A 5 kW inverter is fitted with a 6 kWp array, a DC to AC ratio of 1.2. Why is that a normal design rather than a mistake?",
    [
      "The inverter will simply deliver 6 kW once the array is oversized",
      "The inverter's rating refers to its DC input, so a 6 kWp array is within it",
      "Oversizing is what lifts the array into the inverter's MPPT window",
      "The array almost never delivers its rated output, so the extra kWp raises generation in the morning, the evening and cloudy weather while only a few peak hours are clipped",
    ],
    3,
    "Medium",
    "Ratio",
    "Cell temperature, soiling, the angle the sun makes with the glass and cable losses mean a 6 kWp array rarely presents 6 kW to the inverter, so a modest oversize fills the inverter for more hours of the day and buys more annual energy than it loses to clipping at the peak. The tempting answer is that the rating describes the DC side. It does not: the kW on an inverter's nameplate is its continuous AC output, set by its own thermal design, and it will hold that ceiling and clip. There is a limit to the trick as well, since every inverter also states a maximum array power, and a ratio pushed past it clips through the middle of the day and voids the approval.",
  ),

  /* ---- Module 311004: structure and mechanical installation ---- */
  mcq(
    311,
    11,
    "Where would you choose a ballasted mount over a penetrating mount, and what does the choice cost you?",
    [
      "On a sloped tiled roof, because ballast blocks sit between the tiles without any drilling",
      "On a flat RCC roof, because ballast avoids drilling through the waterproofing, at the price of dead load the slab has to carry",
      "On any roof, because a weighted mount is always safer than a drilled fixing",
      "On a sheet roof, because sheeting cannot take a drilled fixing at all",
    ],
    1,
    "Medium",
    "Ballasted",
    "Ballast resists uplift with weight instead of a fixing, which suits a flat concrete terrace where every hole is a place water can find its way in and where the owner's real fear is a leak over the bedroom. The cost is dead load spread across the slab, so you satisfy yourself the slab can take it and you still restrain the structure against sliding and overturning. The tempting answer is the sheet roof, because sheeting does look too thin to fix into. Sheet roofs are handled by clamping to the purlins or by sealed self drilling fasteners into the structure below, and stacking ballast on light sheeting puts the wrong load in the worst place.",
  ),
  mcq(
    311,
    12,
    "Two identical 3 kW arrays go up on flat roofs in the same district, one at 10 degrees tilt and the other at 25 degrees. What does the steeper tilt change for the structure?",
    [
      "Nothing structural, since tilt only affects generation",
      "It reduces the row to row spacing the array needs",
      "It raises the wind uplift and the overturning moment, so the ballast or the anchorage has to increase",
      "It lowers the wind load, because wind slips over a steeper face",
    ],
    2,
    "Hard",
    "Wind",
    "A tilted module is a sail. The steeper the face presented to the wind, the greater the pressure on it and the longer the lever arm about the rear leg, so a 25 degree array needs more ballast or more anchors and heavier members than a 10 degree one of the same size. That is why flat roof arrays in windy districts are often set below the tilt that would give the best annual yield: a few per cent of generation is traded for a structure that is still on the roof after a storm. The tempting answer is the spacing one, and it is backwards, because a steeper array throws a longer shadow and needs more spacing between rows, not less.",
  ),
  mcq(
    311,
    13,
    "You are working near a roof edge in a full body harness with a lanyard. What decides whether that harness will actually save you?",
    [
      "The harness itself, as long as it is worn and buckled correctly",
      "The anchor it is clipped to, which has to be a rated point able to take a fall load, not a railing or a pipe",
      "The height of the roof, since a fall from below three metres is survivable in any case",
      "The lanyard being as long as possible, so that you can move about freely",
    ],
    1,
    "Easy",
    "Harness",
    "A harness does not absorb a fall, it transfers it to whatever it is tied to. Clipped to a water pipe, a parapet railing or a module rail, it delivers the whole load into something never designed for it, and the fitting fails with the worker attached to it. Use a rated anchor or a lifeline, and keep the lanyard short enough that free fall plus deceleration still leaves you clear of the surface below. The tempting answer is the long lanyard, because it is genuinely easier to work with, and it is the one change that turns a slip you would have been held on into a fall long enough to hurt you.",
  ),

  /* ---- Module 311005: wiring, protection and earthing ---- */
  mcq(
    311,
    14,
    "Why does an array with two strings in parallel usually need no string fuses, while one with five parallel strings does?",
    [
      "Because a faulted string in the two string case can be fed by only one other string, which stays inside what the module and cable can take, while four healthy strings can drive a damaging reverse current into a faulted one",
      "Because five strings in parallel carry a higher voltage than two",
      "Because string fuses become mandatory above a certain array power",
      "Because a five string array needs a combiner box, and a combiner box always contains fuses",
    ],
    0,
    "Hard",
    "Fuses",
    "A string fuse protects a string against current fed back into it by the other strings sitting on the same busbar. With two strings the worst back feed is one string's current, which is below the maximum series fuse rating printed on the module datasheet, so there is nothing for a fuse to interrupt and adding one only adds a failure point. The threshold comes from that datasheet rating set against the number of parallel strings, not from a kW figure, which is why the third option is wrong even though it sounds like a rule. The second option swaps current for voltage: strings in parallel share a voltage and add their currents, and current is exactly what this question is about.",
  ),
  mcq(
    311,
    15,
    "On the AC side of a rooftop plant, what is the RCCB doing that the MCB is not?",
    [
      "Limiting the current the inverter is allowed to export",
      "Protecting the inverter against an overvoltage on the grid",
      "Opening when current leaks to earth instead of returning through the neutral, which is what protects a person from a shock",
      "Disconnecting the plant when the grid fails",
    ],
    2,
    "Medium",
    "RCCB",
    "The MCB is looking after the cable. It trips on an overload or a short circuit, and a leakage current passing through a person to earth is far below its trip rating, so it will let that continue indefinitely. The RCCB compares the current going out in the live with the current returning in the neutral and opens on the difference, at 30 mA where personal protection is intended. The tempting answer is overvoltage protection, which a rooftop plant genuinely needs, but that is handled by the inverter's own grid protection settings and, for surges, by a surge protective device. Disconnection on grid failure is anti islanding and it happens inside the inverter.",
  ),
  mcq(
    311,
    16,
    "The module frames and the mounting structure of a rooftop array are bonded together and connected to earth. What is that earthing primarily for?",
    [
      "To improve generation by draining static charge off the glass",
      "To give a fault current a low resistance path so that the protective device operates, and to hold every exposed metal part at the same potential as the surface a person is standing on",
      "To take a direct lightning strike safely into the ground",
      "Because the meter will not register export from an unearthed array",
    ],
    1,
    "Hard",
    "Earthing",
    "Earthing exists so that a live conductor touching a frame draws enough current to operate the protection instead of leaving the frame live and waiting for someone to touch it, and so that the frames, rails and enclosures a worker can reach at once are all at the same potential. The tempting answer is the lightning one, because the two systems are installed close together and a rooftop array is the most exposed metal on the building. Direct strikes are the job of an air termination and a down conductor sized for a strike current, on a separate path, bonded to the same earth. A protective earth conductor is not sized for that duty and must not be treated as if it were.",
  ),

  /* ---- Module 311006: commissioning, net metering and maintenance ---- */
  mcq(
    311,
    17,
    "What distinguishes net metering from gross metering for a rooftop plant?",
    [
      "Under net metering the output serves the house first and only the surplus is exported, with a bidirectional meter recording import and export separately",
      "Under net metering the whole output goes to the grid at a separately determined generation rate, and the house buys all of its consumption",
      "Under net metering one ordinary meter records what the house imports, and the export is estimated from the plant's rating",
      "Under net metering the export is credited in rupees at a determined rate rather than set off in units",
    ],
    0,
    "Easy",
    "Metering",
    "Net metering sets exported units off against imported units, so a unit you export is worth the retail unit you then do not have to buy, and the meter has to measure flow in both directions to do it. The tempting answer is the second, which describes gross metering: there the whole output is fed to the grid at a determined generation rate and the household buys everything it consumes, so self consumption plays no part. The fourth option describes net billing, where the export is valued in money rather than in units. Which arrangement applies to a given consumer, and how a surplus is carried forward, is set by the state regulator and is revised, so read the current regulation for the connection you are applying for rather than quoting a figure from memory.",
  ),
  mcq(
    311,
    18,
    "An insulation resistance test at commissioning on the DC side is made between which points, and with the system in what state?",
    [
      "Between the positive and the negative conductor, with the inverter running",
      "Between live and neutral on the AC side, with the DC isolator closed",
      "Between a module frame and the mounting structure, with a multimeter on the ohms range",
      "Between the array conductors and earth, with the array disconnected from the inverter and an insulation tester applying its specified test voltage",
    ],
    3,
    "Hard",
    "Insulation",
    "The question the test asks is whether the live parts of the array are still properly separated from earth, so the array is isolated from the inverter and each pole, or both poles shorted together, is tested against earth with an insulation tester at the voltage the standard and the equipment call for. A healthy array reads in megohms, and a low reading points to a cut or pinched cable, water in a connector or a damaged junction box, which you find before energising rather than after. The tempting answer is the frame to structure check, because continuity is measured at commissioning too. That is a continuity test looking for a very low resistance, the opposite of what an insulation test wants to see, and an ordinary multimeter cannot apply the test voltage that makes an insulation reading meaningful.",
  ),
];

export default BANK;
