import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 312, Electrician & Domestic Wiring (ITI-aligned).
 *
 * Every `skill` below is a single word lifted from a topic title in course 312, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by splitting
 * its title into at most four words, and `bankForTopic` matches this skill against that list
 * case-insensitively. A word that is not among the first four concepts of some topic matches
 * nothing and sinks to the bottom of every pile, so each skill here was checked against the
 * concepts the handler actually produces for this course.
 *
 * Skills used, module by module:
 *   1 Ohm, Phase, Energy              4 RCCB, Earthing, Fault
 *   2 Wire, Test, Isolation           5 Induction, Overload, Pump
 *   3 Conduit, Wiring, Way, Fan       6 Material, Load
 *
 * The correct option is spread across all four positions (A x4, B x5, C x5, D x4), so a
 * candidate cannot read the key off the screen without knowing the trade.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 312001: electrical fundamentals ---- */
  mcq(
    312,
    1,
    "A heating element on a 230 V supply draws 5 A. What is its resistance?",
    ["46 ohms", "1,150 ohms", "0.02 ohms", "4.6 ohms"],
    0,
    "Easy",
    "Ohm",
    "Ohm's law rearranges to R = V / I, so 230 divided by 5 gives 46 ohms. The figure of 1,150 is the tempting one, because it is what you get by multiplying instead of dividing, and it is not a meaningless number: 230 multiplied by 5 is 1,150 watts, which is the power the element consumes. Reading it as a resistance is the mistake. The value 0.02 is the current divided by the voltage, which gives conductance and not resistance, and 4.6 is the right calculation with the decimal point moved one place.",
  ),
  mcq(
    312,
    2,
    "A three phase four wire supply measures 415 V between any two lines. What voltage will you measure between one line and the neutral?",
    ["415 V", "240 V", "207 V", "718 V"],
    1,
    "Medium",
    "Phase",
    "The three phases are 120 degrees apart in time, not opposite to each other, so the line to line voltage is the phase voltage multiplied by the square root of three. Working backwards, 415 divided by 1.732 is about 240 V, which is why a house tapped off one line and the neutral of a three phase distribution sees the familiar single phase supply. The value 207 is the tempting answer, and it comes from simply halving 415, which would be correct only if the two lines were 180 degrees apart as in a centre tapped system. The figure 718 multiplies where you should divide.",
  ),
  mcq(
    312,
    3,
    "A 1.5 kW storage geyser is used for 2 hours every day. How many units does it consume in 30 days?",
    ["45 units", "3 units", "90 units", "180 units"],
    2,
    "Easy",
    "Energy",
    "A unit on the meter is one kilowatt hour, that is one kilowatt drawn for one hour. The geyser draws 1.5 kW for 2 hours, which is 3 units a day, and over 30 days that is 90 units. The tempting answer is 45, which comes from multiplying the rating by the number of days and forgetting the running hours altogether; that would be the right figure only if the geyser ran for one hour a day. The figure of 3 units is the daily consumption quoted as though it were the monthly one, which is the slip that makes a consumer think a geyser is cheap to run.",
  ),

  /* ---- Module 312002: tools, materials and safety ---- */
  mcq(
    312,
    4,
    "Lighting points in a house are wired in 1.5 sq mm copper while socket circuits use 2.5 sq mm or larger. What decides that difference?",
    [
      "The number of points connected to the circuit, since every extra outlet needs its own share of copper",
      "The colour coding laid down for phase, neutral and earth conductors",
      "The height at which the cable is run above floor level",
      "The design current of the circuit, because a socket circuit protected at 16 A needs more copper than a lighting circuit protected at 6 A to carry that current without overheating or excessive voltage drop",
    ],
    3,
    "Easy",
    "Wire",
    "Conductor size follows the current the circuit is designed to carry, along with the length of the run, which decides the voltage drop at the far end. Counting points is the tempting answer, and it is how a quotation is priced, so it feels like the working rule of the trade. It is not what heats a cable. Ten LED lamps of 9 W each draw less than half an amp between them, while a single 1,500 W kettle plugged into one socket draws about 6.5 A on its own. The current decides the size, not the number of outlets.",
  ),
  mcq(
    312,
    5,
    "Why is a neon test screwdriver not accepted as proof that a circuit is dead before you start work on it?",
    [
      "It contains a battery that can go flat without any warning",
      "It can glow from voltage induced by a cable running alongside, and it can fail to glow on a genuinely live conductor when your body is not making a good enough path to earth, so neither reading is proof",
      "It works only on three phase supplies",
      "It responds to current rather than to voltage",
    ],
    1,
    "Medium",
    "Test",
    "The neon lights because a very small current passes through it and through you to earth. Stand on a dry insulated floor or wear rubber footwear and a live conductor can read dead. Capacitive coupling from an adjacent cable can make a dead conductor read live. Either way the tool is telling you about the path through your body as much as about the conductor. The safe sequence is to switch off, lock the isolator and tag it, then prove the circuit dead with a voltage tester you have checked on a known live supply immediately before and immediately after. The flat battery answer is tempting because it is true of the non contact pen type, but a plain neon screwdriver has no battery at all.",
  ),
  mcq(
    312,
    6,
    "You find a person unconscious and still in contact with a live conductor. What do you do first?",
    [
      "Pull the person clear by the hand or the arm",
      "Begin chest compressions at once, because seconds decide the outcome",
      "Switch off the supply at the switch or isolator feeding that circuit, and only if it cannot be reached, push the person clear with a dry wooden or plastic implement while standing on dry insulating material",
      "Pour water over the person to cool the burn",
    ],
    2,
    "Easy",
    "Isolation",
    "Until the contact is broken the casualty is part of the circuit, and anyone who touches them joins it. Isolating the supply is the fastest and the surest way to break that contact, which is why the location of the isolator is something you establish before work starts and not during an accident. Starting compressions at once is the tempting answer, because resuscitation genuinely is urgent and every first aid poster says so, but performed on a casualty who is still in contact it puts the rescuer across the same fault and turns one casualty into two. Compressions come immediately after the contact is broken, not before.",
  ),

  /* ---- Module 312003: domestic wiring practice ---- */
  mcq(
    312,
    7,
    "Why must the phase and the neutral of one single phase circuit be drawn through the same steel conduit rather than through two separate steel conduits?",
    [
      "Because the two currents are equal and opposite, so separating them leaves a net current enclosed by each conduit, and the alternating field then drives eddy currents that heat the steel",
      "Because a conduit may carry no more than one conductor of each colour",
      "Because the two wires would otherwise be difficult to identify at the far end",
      "Because separate conduits would increase the resistance of the circuit",
    ],
    0,
    "Hard",
    "Conduit",
    "Steel is a magnetic material. When the phase and the neutral share a conduit their magnetic fields cancel, because at every instant the current going out equals the current coming back and the conduit encloses a net of zero. Put them in separate ferrous conduits and each one encloses a full alternating current, which drives eddy current and hysteresis losses in the steel, heating the conduit and wasting energy. Identification is the tempting answer because it sounds like sound practice, and split routes really are a nuisance to trace later, but that is a convenience argument for what is actually a heating problem. The same reasoning is why a single core cable is never taken alone through a ferrous gland plate.",
  ),
  mcq(
    312,
    8,
    "In a light point, the switch is connected in the phase conductor and never in the neutral. What is the reason?",
    [
      "The lamp gives less light if the neutral is switched",
      "A switch placed in the neutral carries more current and would overheat",
      "The energy meter would not record the consumption correctly",
      "With the switch open, the lampholder and the wiring beyond it are cut off from the phase, so the person changing the lamp does not meet a live contact",
    ],
    3,
    "Easy",
    "Wiring",
    "Switch the neutral instead and the lamp still goes off, because the return path is broken. What it does not do is make the holder safe: the centre contact stays connected to the phase all the time, and the person who unscrews the lamp with the switch off discovers that through their fingers. The overheating answer is tempting because it assumes something must be electrically different about the two legs, but in a single phase circuit the same current flows in both, and a switch works equally well in either. The choice is settled by safety, not by function, which is why an inspector looks for exactly this fault.",
  ),
  mcq(
    312,
    9,
    "A staircase light is controlled from the top and the bottom of the stairs using two single pole two way switches. How many conductors run between the two switches themselves?",
    ["One", "Two", "Three", "Four"],
    1,
    "Medium",
    "Way",
    "Each two way switch has a common terminal and two travellers. The phase goes to the common of the first switch, the two travellers of that switch are joined to the two travellers of the second by a pair of strapping wires, and the common of the second switch carries on to the lamp. So the run between the two switch boxes carries two conductors. Three is the tempting answer, because three wires do land on each switch, but the third one is the incoming phase at one end and the switch wire to the lamp at the other, and neither of them makes the journey along the staircase between the boxes.",
  ),
  mcq(
    312,
    10,
    "An electronic fan regulator saves energy at low speed while the older resistance type does not. What is the reason?",
    [
      "The electronic type lowers the frequency of the supply, and a fan motor draws less current at a lower frequency",
      "The electronic type disconnects one of the motor windings at low speed",
      "The resistance type lowers the fan's voltage by dropping the surplus across a resistance, which turns it into heat, so the power is still drawn from the supply, while the electronic type switches the waveform on and off so that the surplus is never drawn at all",
      "The electronic type runs the motor on direct current",
    ],
    2,
    "Medium",
    "Fan",
    "A ceiling fan is speed controlled by varying the voltage applied to it. The old regulator does that with a tapped resistance in series, so the fan takes less power at low speed but the regulator itself burns most of the difference, which is why that box on the wall gets warm. An electronic regulator uses a triac that conducts for only part of each half cycle, so the energy that never reaches the motor is never taken from the supply either. Frequency is the tempting answer, because the speed of an induction motor genuinely does follow the supply frequency, but no domestic regulator alters the frequency, which stays at 50 Hz.",
  ),

  /* ---- Module 312004: protection and earthing ---- */
  mcq(
    312,
    11,
    "A person touches the metal body of a faulty appliance and roughly 100 mA flows through them to earth. Which device is meant to disconnect the supply for that fault?",
    [
      "The RCCB, because it compares the current going out in the phase with the current returning in the neutral and trips on the difference, which is exactly what an earth leakage is",
      "The 16 A MCB, because 100 mA passing outside the circuit is an overload for it",
      "Both trip together, since they are connected in series",
      "Neither, because a leakage this small cannot be detected by any protective device",
    ],
    0,
    "Hard",
    "RCCB",
    "A 16 A MCB is doing its job while it carries 16 A, so a tenth of an amp means nothing to it, and yet that current across a person's chest can be fatal. An RCCB works on a different principle: everything that leaves by the phase should return by the neutral, and a 30 mA device trips within milliseconds once that much goes missing, which is what happens when the missing current returns through a person or through damp masonry instead. Naming the MCB is the common mistake, because in everyday speech it is simply called the trip. Keep the two roles apart. The MCB protects the cable against overload and short circuit, the RCCB protects people against shock, and an installation needs both.",
  ),
  mcq(
    312,
    12,
    "Why is water poured through the funnel of a pipe earth electrode during the dry months?",
    [
      "To cool the electrode, which heats up while carrying the earth current",
      "To wash out the salt and charcoal, which would otherwise corrode the pipe",
      "To stop the buried pipe from rusting",
      "To keep the soil around the electrode moist, because earth resistance rises sharply as the soil dries out",
    ],
    3,
    "Easy",
    "Earthing",
    "The resistance of an earth electrode is mostly the resistance of the soil immediately around it, and that depends on moisture and on the salts dissolved in it. Let it dry and the resistance can rise several times over, so a fault can no longer drive enough current to operate the protective device, and the earthed metalwork sits at a dangerous voltage instead of being cleared. The same reasoning explains the alternate layers of salt and charcoal packed around the electrode, which hold moisture and keep the surroundings conductive. Cooling is the tempting answer because the electrode does carry fault current, but a fault lasts a fraction of a second and cannot warm a buried pipe.",
  ),
  mcq(
    312,
    13,
    "The supply is isolated, every lamp is out of its holder and every switch on the lighting circuit is left on. You measure the resistance between the phase and the neutral conductors of that circuit at the distribution board, and the meter reads close to zero ohms. What have you found?",
    [
      "A healthy circuit, since the reading proves the conductors are continuous from end to end",
      "A short circuit between the phase and the neutral somewhere in the wiring, because with the lamps removed there should be no path between them at all",
      "An open circuit in the neutral conductor",
      "An earth fault, which is what this test is designed to reveal",
    ],
    1,
    "Hard",
    "Fault",
    "With the lamps out of their holders nothing should join the phase to the neutral, so the expected reading is an open circuit. A reading near zero means the two conductors are connected somewhere they should not be: a nail driven through a cable, a crushed conduit run, or a stray strand left in a box touching the other terminal. The first option is the tempting one, because continuity testing is drilled in as low reading means good, and that is true when you are checking a single conductor end to end. Between two conductors that must stay apart, continuity is the fault itself. An earth fault shows as a low reading from a conductor to earth, which is a different test taken to the earth terminal.",
  ),

  /* ---- Module 312005: motors and household equipment ---- */
  mcq(
    312,
    14,
    "A capacitor start single phase induction motor hums but does not turn when switched on. Spin the shaft by hand and it picks up and runs normally. Where is the fault most likely to be?",
    [
      "In the running winding, which has gone open circuit",
      "In the bearings, which have seized",
      "In the starting circuit: an open starting winding, a failed capacitor or a centrifugal switch stuck open, so the motor has no rotating field of its own to start with",
      "In the supply, which is at too high a voltage",
    ],
    2,
    "Hard",
    "Induction",
    "A single winding on a single phase supply produces a field that pulses along one axis rather than rotating, so the motor develops no starting torque by itself. The starting winding, with a capacitor in series, carries a current shifted in phase, and the two windings together produce the rotating field that gets the rotor moving. Once it is turning, the centrifugal switch drops the starting winding out and the running winding alone keeps it going. That it runs after a push proves the running winding and the supply are healthy, which rules out an open running winding, because that motor would not run at all. Seized bearings are the tempting answer, since a humming motor often is a mechanical problem, but a seized shaft does not turn under your hand either.",
  ),
  mcq(
    312,
    15,
    "A motor starter carries an overload relay even though there is already a fuse or an MCB upstream. Why are both fitted?",
    [
      "The overload relay trips on a modest excess current sustained over a period, matched to the way the winding heats, while the fuse or MCB is set higher and acts fast to clear a short circuit",
      "They do the same job, and the second is a spare in case the first fails to operate",
      "The overload relay operates faster than the fuse for every kind of fault",
      "The overload relay protects the cable while the fuse protects the motor",
    ],
    0,
    "Medium",
    "Overload",
    "A motor draws several times its full load current for the first seconds of starting, so a single device set close to full load and acting instantly would trip on every start. The two functions are therefore split. Short circuit protection is set well above the starting current and clears a fault in a fraction of a second. Overload protection is set near the motor's full load current and takes a deliberate time to operate, so the starting surge passes while a motor running twenty per cent overloaded, slowly cooking its insulation, is still disconnected. The answer that reverses the two, giving the relay the cable and the fuse the motor, is the mix-up worth guarding against: the relay is matched to the motor, the upstream device to the circuit.",
  ),
  mcq(
    312,
    16,
    "A float switch on an overhead tank starts and stops a single phase pump that runs through a contactor starter. Where does the float switch belong in the wiring?",
    [
      "In the motor circuit, in series with the pump supply, so that the float switch makes and breaks the motor current itself",
      "Across the motor terminals, in parallel with the winding",
      "Between the neutral and the earth terminal of the starter panel",
      "In the control circuit, in series with the contactor coil, so that the float contact carries only the small coil current while the contactor switches the motor",
    ],
    3,
    "Hard",
    "Pump",
    "The float contact is a light mechanical contact sitting on a tank at the end of a long cable, and it is rated for a fraction of an amp. A contactor exists precisely so that a small, remote, low current signal can command a large one: the coil pulls in the main contacts, and those contacts carry the motor. Wiring the float straight into the motor line is the tempting answer, because it is the simplest circuit a trainee draws and it does work for a few weeks. Then the contact burns or welds shut on the switching arc, and a welded float switch runs the pump on into a dry sump. It also carries full line current up to the tank, where the joint sits in the rain.",
  ),

  /* ---- Module 312006: estimation, records and the trade test ---- */
  mcq(
    312,
    17,
    "The conduit route from the distribution board to a switch box measures 9 metres. Why does the material estimate allow more than 9 metres for each conductor in that run?",
    [
      "Because wire is sold only in coils of a fixed length",
      "Because the route has bends, and a tail has to be left in each box so the connection can be made and remade later, so a wastage and termination allowance is added to the measured length",
      "Because the wire stretches while it is being pulled through the conduit",
      "Because the circuit needs a phase, a neutral and an earth, which is three times the length",
    ],
    1,
    "Medium",
    "Material",
    "The measured route is the shortest path the wire could take, and the wire never takes it. It follows every bend, it needs slack at each draw box, and a tail of roughly 100 to 150 mm is left inside a box so the termination can be made now and remade later without pulling the whole run again. Estimators therefore add an allowance over the measured route and round up. The phase, neutral and earth answer is the tempting one, because that count genuinely is part of the estimate, but it multiplies the number of conductors rather than lengthening any one of them, and the question asks about the length of each conductor. Coil length affects what you buy, not what the job needs.",
  ),
  mcq(
    312,
    18,
    "A shop's load list totals 3,450 W on a single phase 230 V supply, and you may treat the power factor as unity. What is the design current, and what is the smallest standard MCB rating that will carry it?",
    [
      "3.45 A, so a 6 A MCB",
      "8.3 A, so a 10 A MCB",
      "15 A, so a 16 A MCB",
      "15 A, so a 10 A MCB",
    ],
    2,
    "Hard",
    "Load",
    "At unity power factor the current is the power divided by the voltage, so 3,450 divided by 230 gives 15 A. The protective device must be rated at or above the design current, and the standard sizes run 6, 10, 16, 20 and 25 A, so the next size up is 16 A, and the cable then has to be able to carry that 16 A continuously. Rounding down to 10 A is the tempting answer, since 15 sits between two standard sizes, but a device rated below the working load trips during normal trading and the shopkeeper will simply replace it with something far larger and unprotected. The figure of 8.3 A comes from dividing by 415 V, which is the voltage between two lines of a three phase supply, not the voltage a single phase load sees.",
  ),
];

export default BANK;
