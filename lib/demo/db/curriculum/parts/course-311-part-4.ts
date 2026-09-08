/**
 * Course 311: Solar PV Installer & Rooftop Technician, part 4.
 *
 * Topic 31114 only: the work-at-height discipline that closes module 311004,
 * "Structure and mechanical installation". Parts 1 to 3 carry the rest of the
 * course; this file exists so that the one topic left unwritten by an
 * interrupted run has an owner and no topic id is claimed twice.
 *
 * Height is taught here the way the rest of this course teaches electrical
 * work: as a sequence with numbers in it. The clearance sum, the ladder set-out
 * and the drop calculation are all arithmetic a supervisor does on site before
 * anybody climbs. The roof is a fall hazard and a live DC hazard at the same
 * time, all day, because there is no switch that turns the sun off.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31114: {
    topicId: 31114,
    title: "Working at height: harness, ladder and roof discipline",
    summary:
      "Every other error in this trade can be undone, and a fall cannot, so height is planned as a system of anchor, harness, connector and rescue rather than as a piece of kit issued at the gate. You learn the order of controls, the clearance sum that decides whether a lanyard is usable at all, the four to one ladder set-out, and the discipline that keeps the ground below the work safe.",
    concepts: [
      "Hierarchy of fall control",
      "Fall restraint and fall arrest",
      "Anchor point selection",
      "Fall clearance calculation",
      "Ladder discipline and the four to one rule",
      "Dropped objects and exclusion zone",
    ],
    glossary: {
      "Fall restraint":
        "An arrangement in which the connector is adjusted short enough that the worker physically cannot reach the fall hazard. No fall occurs, so no arrest force is generated and no clearance below is needed.",
      "Fall arrest":
        "An arrangement that accepts the fall and stops it once it has begun. It generates a large force for a fraction of a second and needs clear space below, so it is the last resort rather than the default.",
      "Energy absorber":
        "A stitched pack built into a lanyard that tears progressively as it takes load, stretching the stopping distance so the peak force passed to the body is capped, commonly at about 6 kN. It only works if it has room to deploy.",
      "Anchor point":
        "The structural point a connector is attached to. It has to hold the arrest force with a margin, which runs into the tonnes, so it is a tested device or a proven structural member, never a convenient pipe.",
      "Fall clearance":
        "The vertical distance that must be free of obstruction below the anchor, made up of the connector length, the absorber deployment, the worker's own height below the attachment ring, and a safety margin.",
      "Three points of contact":
        "The climbing rule that two hands and one foot, or two feet and one hand, are on the ladder at every moment. It means both hands must be free, so nothing is carried up a ladder.",
    },
    body: {
      Beginner: `<p>Most mistakes in this trade can be put right. A wrong cable is replaced, a badly made string is rewired, a wrong inverter setting is changed in a minute. A fall from a roof is the one mistake with no repair, which is why this comes before the first module goes up.</p>
<h2>Three ways to deal with an edge</h2>
<p>There is an order to them, and you work down the list rather than jumping to the bottom of it.</p>
<ul>
<li><strong>Do not go near it.</strong> Plan the layout so the array, the walking route and the tools all sit well back from the edge. An edge you never approach cannot hurt anyone.</li>
<li><strong>Put something solid in the way.</strong> A parapet of decent height, a guard rail or a barrier protects every person on the roof, including the one who forgets.</li>
<li><strong>Wear a harness.</strong> This is last, because it protects only the person wearing it, and only for as long as it is clipped to something that will hold.</li>
</ul>
<h2>What the harness actually is</h2>
<p>A full body harness is a set of webbing straps over the shoulders and around the thighs, with a metal D ring between the shoulder blades. A short rope called a <strong>lanyard</strong> joins that ring to a fixed anchor on the building. A waist belt on its own is not a harness and will injure you if it ever has to take a fall.</p>
<p>There are two ways to use the same equipment. Adjust the lanyard short enough that you cannot reach the edge and you are in <strong>restraint</strong>, so the fall never happens. Leave it long enough that you could go over and you are in <strong>arrest</strong>, so the fall happens and the gear stops it. On a flat rooftop, restraint is usually achievable, and it is the better of the two every time.</p>
<h2>The ladder</h2>
<p>Set the foot of the ladder one unit out for every four units of height. For a parapet 3.6 m up, that is 0.9 m out from the wall. Tie the top off, or have a second person stand on the bottom rung. Let the ladder run at least 1 m past the point where you step off, so there is something to hold while you transfer.</p>
<p>Climb with three points of contact: two hands and one foot, or two feet and one hand. That leaves nothing for carrying. Modules, rails, bolts and tool bags go up on a rope or a hoist, never under an arm.</p>
<h2>What goes over the parapet</h2>
<p>A spanner dropped from 10 m reaches the ground at about 14 metres a second, which is close to 50 kilometres an hour. Fence off the ground under the work, keep the helmet chin strap done up, and keep tools in a closed bag instead of resting on the parapet.</p>
<h2>The thing that is true all day</h2>
<p>The modules start generating the moment there is light on the glass, and no switch stops that. So you are managing a height hazard and a live electrical hazard at the same time, on the same roof, from sunrise.</p>`,
      Intermediate: `<p>Work at height on a rooftop plant is managed as a system, not as an item of kit. The system has four parts and it fails completely if any one of them is missing: an anchor that will hold the force, a body holding device that spreads that force across the body safely, a connector of the right length, and a rescue that can be carried out within minutes. A crew wearing harnesses on a roof with nothing rated to clip to has none of the system, only the appearance of it.</p>
<h2>The order of control</h2>
<ol>
<li><strong>Eliminate the exposure.</strong> Assemble rails and clamp sets on the ground, set the array back from the edge at design stage, and raise material by hoist so nobody makes a trip they did not need to make.</li>
<li><strong>Protect everyone collectively.</strong> An existing parapet of adequate height, a temporary guard rail along the working edge, or covers fixed over skylights and openings. Collective protection needs no decision from the worker to function.</li>
<li><strong>Restrain the individual.</strong> Harness plus a connector adjusted so the edge cannot be reached.</li>
<li><strong>Arrest the fall.</strong> Only where the task genuinely requires reaching the edge, and only with the clearance worked out first.</li>
</ol>
<p>Alongside these sit the paper controls: a method statement naming the access route, the anchors, the exclusion zone and the rescue, and a briefing that every person on the roof has actually received rather than signed.</p>
<h2>Fall clearance, worked</h2>
<p>Take a common arrangement: the anchor at roof level near the worker's feet, and a 2 m lanyard with an energy absorber. Add the four terms:</p>
<ul>
<li>Lanyard length, 2.0 m.</li>
<li>Energy absorber deployment when it tears out fully, 1.75 m.</li>
<li>Distance from the dorsal D ring down to the soles of the boots, 1.5 m.</li>
<li>Safety margin below the feet, 1.0 m.</li>
</ul>
<p>Total required clearance is 6.25 m below the anchor. On a two storey building with 7 m to the ground the arrangement works. On a single storey shed roof 3.5 m up it does not: the person reaches the ground while the absorber is still tearing. The answers are to raise the anchor overhead so there is no free fall, to use a self retracting lifeline that locks within a fraction of a metre, or to design the task as restraint so the sum never applies.</p>
<h2>The ladder, worked</h2>
<p>Parapet 3.6 m above the standing ground. Base offset is 3.6 divided by 4, which is 0.9 m. Length along the stiles to the top bearing point is the square root of 3.6 squared plus 0.9 squared, which is about 3.71 m. Add roughly 1 m projecting past the landing and you need about 4.7 m of ladder, so the 4 m ladder in the van is the wrong ladder for this roof.</p>
<p>Then: level and firm footing, both stiles bearing, top tied to a fixing rather than leaned against a gutter, and no work from the top three rungs. Keep your belt buckle inside the stiles, which is a quick way of saying do not overreach.</p>
<h2>Roof discipline</h2>
<ul>
<li>One marked access route from the ladder to the work area, so foot traffic does not wander across fragile areas or over cable runs.</li>
<li>An exclusion zone at ground level directly below the work, barriered and signed, kept clear while material is being lifted.</li>
<li>Tools tethered or bagged. Nothing rests on the parapet, ever.</li>
<li>A stated wind speed at which module handling stops, written into the method statement. A module of about 2 square metres is a sail, and a gust turns it into a lever with a person on the end of it.</li>
<li>Work stops in rain and in lightning. A wet roof is a slip hazard and a conductive one, and the array is live.</li>
</ul>
<h2>Sequencing around live DC</h2>
<p>Because the array cannot be switched off, order the day so that the mechanical work in the most exposed positions is finished before the strings are made up. Once modules are connected, every rail run has energised cable on it, and a person recovering their balance grabs whatever is nearest.</p>`,
      Advanced: `<p>Site experience narrows the failures down to a short list, and almost none of them are about the quality of the harness. They are about anchors, clearance, the last hour of the day, and the gap between the method statement and what the crew actually did.</p>
<h2>The harness worn but never clipped</h2>
<p>The commonest finding on a rooftop audit is a full harness worn correctly with both connector hooks clipped to the harness itself. It happens because there is nothing within reach to clip to, or because clipping means unclipping again eight times an hour. The control is not more briefing, it is anchor density: a permanent line or enough rated points that a person can move along the array without ever being unclipped. If your anchor plan requires discipline that nobody has sustained on any previous job, it is not a plan.</p>
<h2>What is and is not an anchor</h2>
<p>An arrested fall develops forces of the order of a tonne at the anchor. The energy absorber caps what reaches the body at roughly 6 kN, which is about six hundred kilograms force, and the anchor has to take that plus a margin. Against that number:</p>
<ul>
<li><strong>The array rail you have just fitted is not an anchor.</strong> It is designed for a distributed uplift shared across many feet, not a point load of several kilonewtons at one clamp, and nobody has tested it that way.</li>
<li><strong>A coping stone, a vent pipe, a solar water heater frame and a tank leg are not anchors.</strong> Coping is frequently bedded in mortar alone and lifts off in one piece.</li>
<li><strong>A lightning down conductor is never an anchor</strong>, for two separate reasons.</li>
<li>What qualifies is a tested anchor device installed to its instructions, or a structural member confirmed by someone competent to confirm it.</li>
</ul>
<h2>Traps in the clearance sum</h2>
<ul>
<li><strong>Swing fall.</strong> The sum assumes you fall vertically below the anchor. Anchored well to one side, you pendulum, and you strike whatever is in the arc at speed. Keep the connector close to the vertical, commonly within about thirty degrees.</li>
<li><strong>Sharp edges.</strong> A line dragged over a parapet corner under arrest loading can be cut. Where the line may pass over an edge, it has to be an edge-tested type, or the edge has to be protected.</li>
<li><strong>Self retracting lifelines used the wrong way.</strong> Many are rated for overhead anchorage only. Anchored at foot level they permit a free fall the device was never assessed for.</li>
<li><strong>Standing on a roof less than the clearance high.</strong> On a low shed the honest answer is that arrest is unusable and the job is redesigned as restraint or as work from a mobile platform.</li>
</ul>
<h2>The part most crews have not planned</h2>
<p>A person hanging in an arrested fall, conscious and uninjured, is on a clock. Leg straps compress the veins and blood pools in the legs, so suspension becomes dangerous within minutes. A rescue plan that reads "call the emergency services" is not a rescue plan for that clock. What works is a planned means of getting to the casualty and lowering them, rehearsed, with the equipment on the vehicle and a named person who has done it.</p>
<h2>Ladder failures worth naming</h2>
<ul>
<li>Overreaching sideways instead of moving the ladder, which is what takes the base out.</li>
<li>The base on loose gravel, wet mud or a sloping apron, which is the standard monsoon incident.</li>
<li>An aluminium ladder raised close to a service line. Look up before you raise, and again while raising.</li>
<li>A ladder tied at the rungs rather than the stiles, so the tie does nothing when the stile moves.</li>
</ul>
<h2>When incidents cluster</h2>
<p>Two windows account for a large share of rooftop incidents. The first hour, when access is set up and the anchors are not yet in. The last hour, when anchors and guard rails are stripped first because they went up first, and there is still material to bring down. Reverse the order deliberately: fall protection is the first thing installed and the last thing removed, and the debrief at the end of the day is when someone walks the roof to check nothing has been left on a parapet.</p>
<h2>The assessment marks</h2>
<p>Trainees lose marks by naming personal protective equipment first when asked how they would control a fall risk. The expected answer starts with eliminating the exposure and with collective protection, and reaches the harness fourth.</p>`,
      Expert: `<h2>The order of control, in one table</h2>
<table>
<tr><td><strong>Rung</strong></td><td><strong>On a rooftop plant</strong></td><td><strong>Fails when</strong></td></tr>
<tr><td>Eliminate</td><td>Ground assembly, hoisted material, array set back from the edge</td><td>The layout was drawn without a setback</td></tr>
<tr><td>Collective</td><td>Parapet, temporary guard rail, covers over skylights and openings</td><td>Nobody costed it into the quotation</td></tr>
<tr><td>Restraint</td><td>Connector short enough that the edge cannot be reached</td><td>Someone lengthens it to reach one clamp</td></tr>
<tr><td>Arrest</td><td>Harness, absorber lanyard or retractable line, rated anchor</td><td>The clearance was never calculated</td></tr>
</table>
<h2>The clearance sum</h2>
<table>
<tr><td><strong>Term</strong></td><td><strong>Typical value</strong></td></tr>
<tr><td>Lanyard length</td><td>2.0 m</td></tr>
<tr><td>Absorber deployment</td><td>1.75 m</td></tr>
<tr><td>D ring to boot soles</td><td>1.5 m</td></tr>
<tr><td>Safety margin</td><td>1.0 m</td></tr>
<tr><td><strong>Required below the anchor</strong></td><td><strong>6.25 m</strong></td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Restraint if you can, arrest only if you must, and never arrest without the sum.</li>
<li>Ladder base one out for four up, tied at the stiles, 1 m past the landing.</li>
<li>Three points of contact means nothing in your hands. Material goes up on a rope.</li>
<li>An anchor holds tonnes. A pipe, a coping stone and a new array rail hold none of it.</li>
<li>Keep the connector within about thirty degrees of vertical or plan for the swing.</li>
<li>Fall protection goes up first and comes down last.</li>
<li>A harness with no rescue behind it is half a system.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Shed roof under the clearance height.</strong> Arrest is arithmetically unusable. Restraint, a platform, or ground-mounted structure instead.</li>
<li><strong>Single technician on a service call.</strong> No lone arrest work, because nobody can perform the rescue. Restraint only, and a check-in call.</li>
<li><strong>Module handling in gusty conditions.</strong> Two hands on a sail, at an edge, is the situation the wind stop-work limit exists to prevent.</li>
<li><strong>Roof already carrying an array.</strong> The existing strings are live and the existing structure is not an anchor plan.</li>
</ul>
<h2>Before anybody climbs</h2>
<ol>
<li>Access route and ladder set-out agreed, ladder length checked against the parapet height.</li>
<li>Anchors identified and rated, with the clearance sum written down for each position.</li>
<li>Exclusion zone barriered at ground level, directly below the work.</li>
<li>Wind and weather stop-work limits stated, and someone named to call it.</li>
<li>Rescue means present on the vehicle, and the person who will perform it named.</li>
<li>Tools tethered or bagged, and a walk of the roof planned for the end of the day.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "You are planning work along the open edge of a flat roof. Which control do you decide on first?",
        options: [
          "Issue every member of the crew a full body harness before they go up",
          "Set the array back from the edge and fit a temporary guard rail, so nobody depends on remembering anything",
          "Mark the edge with paint and brief the crew about it at the morning meeting",
          "Restrict the edge work to the cooler part of the morning",
        ],
        answer: 1,
        explanation:
          "The order of control runs eliminate, then collective protection, then restraint, then arrest, so a setback and a guard rail are decided before any personal equipment is considered. Issuing harnesses feels like the safety measure because it is the visible one, but it protects only the person wearing it and only while it is clipped to something rated.",
        difficulty: "Easy",
        skill: "Hierarchy of fall control",
      },
      {
        n: 2,
        question:
          "An anchor sits at roof level beside the worker. The lanyard is 2.0 m, its absorber deploys up to 1.75 m, the D ring is 1.5 m above the boots and the margin used is 1.0 m. The roof is 5 m above the ground. What does the calculation tell you?",
        options: [
          "The system is adequate, because the lanyard is much shorter than the 5 m drop",
          "The required clearance is 6.25 m against 5 m available, so the person would strike the ground and this arrangement must not be used",
          "The absorber shortens the fall, so only about 2 m of clearance is actually needed",
          "It is acceptable provided the harness straps are pulled tight before starting",
        ],
        answer: 1,
        explanation:
          "Adding 2.0 plus 1.75 plus 1.5 plus 1.0 gives 6.25 m of clear space needed below the anchor, which the roof height does not provide, so the task is redesigned as restraint or given an overhead anchor or a retractable line. Comparing the lanyard length alone with the drop is the tempting error, and it ignores the absorber deployment and the worker's own height below the ring, which together add more than the lanyard does.",
        difficulty: "Hard",
        skill: "Fall clearance calculation",
      },
      {
        n: 3,
        question:
          "A ladder rests against a parapet 3.6 m above the standing ground. Where should the base sit?",
        options: [
          "About 0.45 m from the wall",
          "About 0.9 m from the wall",
          "About 1.8 m from the wall",
          "About 3.6 m from the wall",
        ],
        answer: 1,
        explanation:
          "The four to one rule puts the base one unit out for every four units of height, so 3.6 divided by 4 gives 0.9 m and an angle near 75 degrees. Setting it at 1.8 m halves the ratio and leaves a shallow ladder whose base slides out under load, while 0.45 m is too steep and tips backwards as you step off at the top.",
        difficulty: "Easy",
        skill: "Ladder discipline and the four to one rule",
      },
      {
        n: 4,
        question:
          "You need somewhere to clip a fall arrest lanyard on a roof where the array has just been mounted. Which is acceptable?",
        options: [
          "The mounting rail you have just fitted, since it is bolted to the roof",
          "A tested anchor device installed to its instructions, or a structural member confirmed by a competent person",
          "The coping stone along the parapet, which is heavy and continuous",
          "The lightning protection down conductor, which is securely fixed for its own purpose",
        ],
        answer: 1,
        explanation:
          "An arrested fall applies a force of the order of a tonne at a single point, so the anchor must be a device tested for that or a member somebody competent has checked. The new mounting rail is the tempting choice because it is right there and clearly well fixed, but it is designed for distributed wind uplift shared over many feet, not a multi-kilonewton point load at one clamp.",
        difficulty: "Medium",
        skill: "Anchor point selection",
      },
      {
        n: 5,
        question:
          "You adjust the connector so that at full extension you cannot reach the roof edge. What have you built?",
        options: [
          "A fall arrest system, because the lanyard would stop you if you went over",
          "A fall restraint system, which prevents the fall happening and therefore needs no clearance below",
          "A work positioning system, intended for leaning out over the edge",
          "Nothing useful, because a system without an energy absorber cannot protect anyone",
        ],
        answer: 1,
        explanation:
          "Restraint keeps you away from the hazard, so no fall occurs, no arrest force is developed and the clearance sum never applies, which is why it is preferred wherever the task allows it. Calling it arrest is the trap, since the harness and the anchor are the same hardware and only the connector length differs, but arrest accepts the fall and restraint refuses it.",
        difficulty: "Medium",
        skill: "Fall restraint and fall arrest",
      },
      {
        n: 6,
        question:
          "A spanner of about half a kilogram is knocked off a roof 10 m above the ground. Roughly how fast is it travelling when it lands?",
        options: [
          "About 4.4 metres per second",
          "About 9.8 metres per second",
          "About 14 metres per second",
          "About 98 metres per second",
        ],
        answer: 2,
        explanation:
          "Speed on landing is the square root of two times g times the height, so the square root of 2 times 9.81 times 10 gives about 14 metres per second, close to 50 kilometres an hour, which is why the ground below the work is barriered and helmets are strapped. The figure of 98 comes from multiplying g by the height, but that product is a velocity squared and not a velocity, so it is out by more than a factor of seven.",
        difficulty: "Hard",
        skill: "Dropped objects and exclusion zone",
      },
      {
        n: 7,
        question:
          "A technician's fall is arrested and they are left hanging in the harness, conscious and unhurt. What must the method statement already have provided for?",
        options: [
          "Nothing further, because the arrest has done its job and recovery can be taken calmly",
          "A rescue that can be carried out within minutes, with the equipment on site and a named person to do it",
          "A call to the emergency services, who will bring the correct rescue equipment",
          "Cutting the lanyard so that the casualty drops clear of the structure",
        ],
        answer: 1,
        explanation:
          "Hanging in a harness compresses the veins in the legs and blood pools there, so suspension becomes dangerous within minutes and the rescue has to be planned, equipped and rehearsed in advance. Relying on the emergency services is the common answer on paper, but the response time is measured against a clock the casualty does not control.",
        difficulty: "Medium",
        skill: "Fall restraint and fall arrest",
      },
      {
        n: 8,
        question:
          "A module of about 25 kg and 2 square metres has to reach a roof 3.6 m up. What is the correct method?",
        options: [
          "Carry it up the ladder yourself, keeping one hand on the stile throughout",
          "Two people carry it up the same ladder together, one above and one below",
          "Raise it by rope, hoist or mechanical lift, so that nobody climbs with their hands occupied",
          "Pass it up from partway along the ladder to a person leaning over the parapet",
        ],
        answer: 2,
        explanation:
          "Climbing requires three points of contact, so both hands must be free, and a module of that area behaves as a sail that a gust turns into a lever. Two people on one ladder is the tempting answer because the load feels shared, but it puts two climbers and an unsecured sail on a ladder rated for one person and removes every hand hold at the same time.",
        difficulty: "Medium",
        skill: "Ladder discipline and the four to one rule",
      },
    ],
  },
};

export default PART;
