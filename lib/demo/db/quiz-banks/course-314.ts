import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 314, Mobile Phone & Consumer Electronics Repair.
 *
 * Every `skill` below is a single word lifted from a topic title in course 314, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts builds a topic's concepts from at most
 * four words of its title, and `bankForTopic` matches this skill against that list
 * case-insensitively. A word that is not among a topic's first four concepts matches nothing
 * and sinks the question to the bottom of every pile, so each skill here was checked against
 * the concepts the handler actually derives.
 *
 * Skills used, module by module:
 *   1 Capacitor, Multimeter, Smartphone   4 Schematic, Short, Reflow
 *   2 Soldering, Anti-static, Handset     5 Firmware, Privacy, Diagnosing
 *   3 Display, Charging, Water            6 Parts, Warranty, Television
 *
 * Three questions per module, one per topic across eighteen of the twenty topics, so a
 * learner who exhausts an authored set still gets questions from the unit they are sitting in.
 *
 * The correct option is spread across all four positions (A x5, B x4, C x5, D x4). A bank
 * keyed mostly to one letter is answered off the screen by a candidate who knows nothing.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 314001: electronics fundamentals for repair ---- */
  mcq(
    314,
    1,
    "A small ceramic capacitor sits between a supply rail and ground, right beside an IC on a handset board. What is it doing there?",
    [
      "Blocking the DC so that only the signal reaches the IC",
      "Limiting the current into the IC, the way a series resistor does",
      "Holding the rail steady when the IC draws a sudden burst, and passing noise to ground",
      "Storing enough charge to keep the phone running while the battery is changed",
    ],
    2,
    "Medium",
    "Capacitor",
    "This is a decoupling capacitor. An IC does not draw a smooth current, it draws in bursts as it switches, and the track back to the regulator has enough inductance that those bursts would otherwise pull the rail down and put noise on it. The capacitor sits close to the pin and supplies the burst locally. Blocking DC is the tempting answer because a capacitor genuinely does block DC and pass AC, but that is a capacitor placed in series with a signal line, which is a coupling capacitor. This one is across a rail, where blocking is meaningless and passing noise to ground is the whole point. It matters on the bench because a shorted decoupling capacitor is one of the commonest causes of a rail sitting at zero volts.",
  ),
  mcq(
    314,
    2,
    "You want to measure the current a handset is drawing while it charges. How is the multimeter connected?",
    [
      "In series in the supply line, so that all the current passes through the meter",
      "Across the battery terminals, with the meter on its current range",
      "Across the battery terminals, with the meter on its voltage range",
      "Between the positive terminal and ground, with the meter on continuity",
    ],
    0,
    "Easy",
    "Multimeter",
    "A meter on its current range is deliberately built to be almost a short circuit, so it has to be put into the path the current already takes, which means breaking the circuit and letting the current flow through the meter. Connecting it across the battery terminals on the current range is the classic beginner mistake and the tempting answer here, because that is how you connect the meter for voltage and the habit carries over. It places a near short across the source, which at best blows the meter fuse and at worst damages the board. The voltage range across the terminals is a valid measurement, but it tells you the voltage, not the current.",
  ),
  mcq(
    314,
    3,
    "On the block diagram of a smartphone, what is the job of the power management IC?",
    [
      "It stores the phone's firmware and boot code",
      "It amplifies the transmit signal on its way to the antenna",
      "It switches the phone between its 4G and 5G radios",
      "It makes the several regulated rails the other blocks need from the one battery voltage",
    ],
    3,
    "Medium",
    "Smartphone",
    "The battery gives one voltage that also sags as it discharges, while the processor core, the memory, the display and the radio each need their own regulated supply, brought up in a fixed order at boot. That is what the power management IC does, and it is why the schematic for a dead phone is read outward from it, rail by rail. The power amplifier is the tempting answer because both blocks have power in the name, but the amplifier sits on the radio chain and works on the transmit signal, not on the supply. Firmware lives in the flash memory, and the radio switching is done by the modem and the RF front end.",
  ),

  /* ---- Module 314002: tools and the workbench ---- */
  mcq(
    314,
    4,
    "Why is flux applied to a pad before a joint is soldered?",
    [
      "It lowers the melting point of the solder, so a cooler iron will do",
      "It strips the oxide off the pad and the lead so that molten solder can wet them",
      "It cools the joint so that nearby plastic parts are not damaged",
      "It holds the component in position until the solder has set",
    ],
    1,
    "Easy",
    "Soldering",
    "Every exposed metal surface carries a thin oxide film, and molten solder will not wet an oxidised surface. It sits on the pad as a ball instead of flowing into a shiny concave fillet. Flux removes that film chemically and keeps it from re-forming while the joint is hot. Lowering the melting point is the tempting answer, because a fluxed joint really does flow at a lower iron setting in practice, but that is better wetting and better heat transfer doing the work. The alloy melts at the temperature its composition dictates, and no amount of flux changes it. Clean the residue off afterwards, since some fluxes stay slightly conductive and corrosive.",
  ),
  mcq(
    314,
    5,
    "A board is handled with no anti-static precautions, the repaired phone passes every test at the counter, and it fails three weeks later. What is the most likely link between the two?",
    [
      "The charge picked up during the repair sat in the IC and leaked away over those weeks",
      "Nothing links them, since electrostatic damage always shows as a device that is dead at once",
      "A discharge can wound a junction without killing it, and the weakened part fails later",
      "Without an anti-static mat the bench stays damp, so the board took up moisture",
    ],
    2,
    "Medium",
    "Anti-static",
    "An electrostatic discharge either destroys a junction outright or punctures it partly, leaving a device that still meets its function but with a weakened oxide or a partly damaged gate. Normal use, heat and time finish the job, which is why latent failures show up days or weeks after the repair. The tempting answer is that there is no link at all, precisely because the phone was tested and worked, and that reasoning is why technicians stop bothering with a wrist strap and a mat. Latent damage is the reason the discipline is kept even on the days when nothing appears to go wrong. Charge does not sit inside an IC for weeks either, it equalises in moments through leakage.",
  ),
  mcq(
    314,
    6,
    "The back cover is off a handset and you are about to lift the display flex connector. What comes first?",
    [
      "Disconnect the battery, so that the board is not live while you work",
      "Switch the phone on, to confirm that the display still works before you touch it",
      "Warm the board with the hot air station so that the flex lifts easily",
      "Take out the motherboard screws so the board can lift with the flex still attached",
    ],
    0,
    "Easy",
    "Handset",
    "A phone that is switched off still has its battery across the board, so every rail the power management IC keeps alive is live. A slipped spudger or a metal tweezer bridging two pads then shorts a live rail and turns a display job into a board repair. Disconnecting the battery first, before any connector is touched, is the rule that prevents it. Powering the phone on to check the display is the tempting answer, and the check itself is right, but it belongs before the phone is opened, not with the case off and the board exposed. Hot air near a flex and its plastic connector deforms both, and a flex connector is a press fit that lifts straight up with a plastic tool.",
  ),

  /* ---- Module 314003: common hardware faults ---- */
  mcq(
    314,
    7,
    "A handset shows a perfect picture, but a band across the top of the screen does not respond to touch. A known good display fitted temporarily responds everywhere. On a current phone with a fused display, what does the repair involve?",
    [
      "Replace the front glass alone, since the touch layer sits on the glass",
      "Recalibrate touch from the settings menu",
      "Reflow the touch controller on the motherboard",
      "Replace the whole display assembly, since the touch layer is laminated to the panel",
    ],
    3,
    "Medium",
    "Display",
    "In a fused unit the outer glass, the touch layer and the panel are bonded together with optical adhesive, so the touch layer is not a separately available part and separating it needs a laminating and bonding setup that a counter does not have. Replacing the front glass is the tempting answer, because on older phones the digitiser really was a separate part above the LCD and parts sellers still list touch glass for those models. Prising the glass off a fused assembly cracks the panel underneath and turns a touch complaint into a display complaint. The swap test has already cleared the board, so the controller and a reflow of it are not in question.",
  ),
  mcq(
    314,
    8,
    "A customer says the phone charges only when the cable is pushed hard or held at an angle, and that same cable charges another phone normally. What do you check first?",
    [
      "The battery, since a worn cell takes charge only intermittently",
      "The charging socket on the phone, for packed lint, a loose fit or a cracked joint",
      "The charging IC on the board, which should be replaced",
      "The phone's software, by way of a factory reset",
    ],
    1,
    "Easy",
    "Charging",
    "The symptom is mechanical. It changes with the position of the plug, and the cable has already been cleared on another handset, so the suspicion falls on the connector at the phone end: pocket lint compressed into the socket so the plug cannot seat, a worn or spread contact, or shell and pin joints cracked by the cable being levered sideways. A great many of these jobs are finished by cleaning the socket out carefully with a wooden or plastic pick, before any quote for a port replacement is given. The battery is the tempting answer because a tired cell is the commonest charging complaint overall, but it presents as a fast drain or a phone that dies at a high percentage, and never as charging that depends on how the plug is held.",
  ),
  mcq(
    314,
    9,
    "A handset that fell into water was dried in rice by the customer and is working. Why do you still advise opening and cleaning the board?",
    [
      "Rice leaves starch dust inside the phone, and that dust shorts the board",
      "The water damage indicator has to be reset by hand or the phone will not charge",
      "Drying removes the water and leaves the dissolved salts, which go on corroding pads and pins",
      "Water trapped in the phone expands in cold weather and cracks the board",
    ],
    2,
    "Medium",
    "Water",
    "It is not the water that kills the board, it is what the water carried. Tap water, rain and drain water leave behind salts and minerals as a residue that is slightly conductive and draws moisture from the air, so tracks corrode, connector pins go high resistance and a rail slowly turns leaky. The phone works for days or weeks and then fails, often after the customer has stopped connecting it to the fall in the water. That is why the job is a full strip, a clean with isopropyl alcohol and a soft brush or an ultrasonic bath, with the battery disconnected first. The indicator sticker is the tempting answer because every technician does look at it, but it is only evidence for a warranty decision and it switches nothing on or off.",
  ),

  /* ---- Module 314004: board level work ---- */
  mcq(
    314,
    10,
    "A phone is dead. The schematic shows the rail feeding the audio codec coming from a regulator inside the power management IC, and you measure 0 V on that rail. What does that measurement on its own establish?",
    [
      "That the regulator has failed, so the power management IC is the part to replace",
      "That the codec on the rail is shorted and is pulling the rail down",
      "That a track between the power management IC and the codec has broken",
      "Only that the rail is down, which a dead regulator, a missing enable and a shorted load all produce",
    ],
    3,
    "Hard",
    "Schematic",
    "A rail at zero has three families of cause: the regulator was never told to turn on, because an enable line or an earlier rail in the power-on sequence is missing, or the regulator itself has failed, or something on the rail is holding it down. The measurement cannot tell them apart, and the next steps that can are cheap: resistance from the rail to ground with the power off, and a check of the rails that come earlier in the sequence. Replacing the power management IC is the tempting move, because the rail comes out of it and the part is easy to blame, and it is the most expensive way to be wrong. If a shorted load is holding the rail down, the newly fitted IC will sit at zero volts on that rail too.",
  ),
  mcq(
    314,
    11,
    "You put a dead board on a bench supply set to battery voltage with the current limit turned well down, and it immediately draws the full limit. What does the low limit buy you?",
    [
      "It caps the energy reaching the fault, so the shorted part warms enough to find without the board cooking",
      "It protects the bench supply, which a short would otherwise damage",
      "It makes the shorted part heat up faster, so you find it sooner",
      "It keeps the board's own protection fuses from blowing",
    ],
    0,
    "Hard",
    "Short",
    "In current limit the supply drops its output voltage to whatever holds the current at the set value, so the power going into the fault is small and controlled. The shorted part still warms a little, which is enough to be found with a thermal camera, with a drop of isopropyl alcohol that evaporates over it first, or with the back of a finger, while nothing else on the board is driven towards destruction. Heating it faster is the tempting answer, because you do want the faulty part to give itself away, and it is exactly backwards: a high limit finds it faster and often destroys the evidence and its neighbours with it. Protecting the supply sounds right in general, but a bench supply is designed to sit in current limit all day. The thing being protected here is the board.",
  ),
  mcq(
    314,
    12,
    "A phone comes in dead after a fall, and a technician proposes reflowing the processor with hot air. Why is a reflow at best a temporary repair for that fault?",
    [
      "Hot air cannot reach the temperature at which the solder melts",
      "Heating the board once weakens every other joint on it permanently",
      "It only re-melts a joint that has cracked and does nothing about why it cracked",
      "The processor is held down with underfill and cannot be heated at all",
    ],
    2,
    "Hard",
    "Reflow",
    "Reflow re-melts the solder that is already there, so a hairline crack under a ball closes and the phone comes back to life on the bench, which is why the trick is so popular. Nothing has been added and nothing has been strengthened. The joint cracked because the board flexed in a fall, or because that corner runs hot, and the same cause cracks it again, usually within weeks and usually after the customer has paid. Reballing, where the chip is lifted, the old balls are cleaned off and fresh ones are fitted, is the repair that actually replaces the joints. Underfill is the tempting answer because it is real and it does make lifting a chip much harder, but it is a reason reballing is difficult, not a reason heat cannot be used. This is also one of the places where you decide the board is not worth the attempt at all, and say so before taking the job.",
  ),

  /* ---- Module 314005: software, data and the customer ---- */
  mcq(
    314,
    13,
    "Before you flash firmware on a customer's phone, what has to happen?",
    [
      "Nothing in particular, because flashing leaves user data untouched",
      "Take a backup while the phone still allows it, and get consent in writing that data may be lost",
      "Charge the phone fully, which is what prevents data being lost during a flash",
      "Remove the SIM and the memory card, which is enough to protect the customer's data",
    ],
    1,
    "Easy",
    "Firmware",
    "A flash rewrites the device partitions and in most cases wipes user data, and even where a method claims to keep it, a flash that fails part way leaves nothing behind. So the order is fixed: pull off whatever backup the phone still permits, write on the job card that the customer was told data may be lost and that they agreed, and only then flash. Charging fully is the tempting answer, and it is genuinely good practice because a phone that loses power in the middle of a flash can be left unbootable, but a full battery protects the flash from failing. It does not protect the photographs. The SIM and the memory card hold almost nothing on a modern phone, where contacts, messages and photographs sit in internal storage.",
  ),
  mcq(
    314,
    14,
    "A customer leaves a phone for a display replacement and gives you the screen lock code so that touch can be tested after fitting. How should that code and the data on the phone be handled?",
    [
      "Use it only for the testing this job needs, note on the job card that it was taken, and keep nothing from the phone",
      "Save it in the customer register, since the phone may come back with a related complaint",
      "Change it to a standard shop code so that anyone at the bench can test phones quickly",
      "Refuse it and ask the customer to remove the lock, since a technician should never hold a code",
    ],
    0,
    "Medium",
    "Privacy",
    "The code was given for one purpose, and that purpose sets the limits: use it for the tests the job needs, record on the job card that it was taken so both sides know it was, open nothing that the repair does not require, and do not carry it beyond the job. Saving it in the register is the tempting answer because it is convenient and repeat visits do happen, and a book full of live phone codes is exactly what makes your counter the source of a leak and destroys the reputation the counter runs on. A standard shop code hands every person at the bench a stranger's photographs, messages and banking apps. Refusing the code sounds strict but leaves you unable to test touch across the lock screen, which is where a badly seated display shows itself.",
  ),
  mcq(
    314,
    15,
    "A phone restarts on its own every few minutes. Before opening it, which observation points most strongly at a software cause?",
    [
      "It restarts more often when it has become warm",
      "The restarts started after the phone was dropped",
      "It restarts even in recovery mode, with none of the user's apps running",
      "It stays up in safe mode, and the restarts come back on a normal boot",
    ],
    3,
    "Hard",
    "Diagnosing",
    "Safe mode boots the same system without third party applications, so a phone that is stable there and unstable on a normal boot has told you the trouble comes in with something the user installed or with a corrupted profile, and that is settled by uninstalling in reverse order of installation, or by a backup and a reset. Restarting in recovery is the tempting answer, because a phone rebooting with no apps running looks like a firmware problem, and a technician who reads it that way flashes the phone, charges for it and hands back a device that restarts exactly as before. Recovery runs a small separate image, so a restart that survives it points at the supply side instead: a battery that cannot hold voltage under load, the charging or power management IC, or a rail that dips. Warmth and a fall point at hardware as well.",
  ),

  /* ---- Module 314006: running a repair counter ---- */
  mcq(
    314,
    16,
    "A supplier lists display assemblies for one model as original, refurbished and copy. What does refurbished normally mean here?",
    [
      "A copy panel carrying an original brand sticker",
      "An original panel from a used phone, with the broken glass separated off and new glass laminated on",
      "A new original panel that the maker rejected at final inspection",
      "A copy panel that has been individually tested before dispatch",
    ],
    1,
    "Hard",
    "Parts",
    "In refurbishing, the original panel is kept and only the cracked front glass is removed and replaced on a laminating setup. So the colours, the brightness and the viewing angles are the original's, while the glass, the adhesive, the touch layer bonding and the quality of the lamination are only as good as the refurbisher. That is why refurbished units come back more often with touch that fails at the edges, with lifting, or with dust under the glass, and why the grade you fitted belongs on the job card and in the price you quote. Factory rejects are the tempting answer because those do reach the grey market, but they are sold as originals of a lower grade, not as refurbished, and the word refurbished specifically means work done on a used panel.",
  ),
  mcq(
    314,
    17,
    "A handset still inside the manufacturer's warranty period comes to your counter with a charging fault. What do you tell the customer?",
    [
      "That the warranty covers manufacturing defects only, so a charging fault is not covered",
      "That you can do the repair and the warranty will hold if the seals are refitted neatly",
      "That the authorised service centre should see it first, because opening it here voids the warranty",
      "That you will open it and diagnose it first, and then decide whether to send it onward",
    ],
    2,
    "Easy",
    "Warranty",
    "The warranty belongs to the customer and it is usually worth more than the job on your bench, so the honest advice is that an in-warranty phone goes to the authorised centre first. If the customer still wants the repair done at your counter, having heard that, then you note on the job card that they were told and that they agreed, and you proceed. Opening it to diagnose first is the tempting answer, because diagnosis normally does come before advice and it feels helpful, and it destroys the very thing you were protecting: the tamper evidence is gone the moment the case is off, and the centre can decline the claim on that alone. Saying the fault is not covered is not your decision to make, and a charging fault of unknown cause is often covered.",
  ),
  mcq(
    314,
    18,
    "You begin taking television and small appliance work alongside handsets. Why is the large capacitor in a television's power supply discharged before you work on the board?",
    [
      "It can stay charged at a few hundred volts long after the set is unplugged",
      "It holds the set's channel and picture settings, which must be cleared first",
      "It will discharge into the new part while you are fitting it and destroy it",
      "Its value cannot be read on a meter until it has been emptied",
    ],
    0,
    "Hard",
    "Television",
    "Mains powered equipment is a different class of risk from a handset that runs on a few volts. The bulk capacitor after the rectifier charges to the peak of the rectified mains, which is a few hundred volts, and if the bleeder resistor across it has failed or was never fitted it can hold that charge for a long time after the plug is pulled. You discharge it deliberately through a resistor, never by shorting it with a screwdriver, and then confirm with a meter that it has come down before touching anything. Damage to the new part is the tempting answer, and a charged capacitor can indeed take out a component during work, but the reason this rule exists is your own safety. Channel and picture settings live in non-volatile memory and survive being unplugged.",
  ),
];

export default BANK;
