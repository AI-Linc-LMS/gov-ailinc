/**
 * Course 302: TGPSC Group-II and Group-III Foundation. Part 4 of 4.
 *
 * Topics 30207, 30208 and 30214: the environment and disaster management unit
 * of Paper-I, the opening ancient and medieval survey of the socio-cultural
 * history section of Paper-II, and the judiciary unit of the polity section.
 *
 * These three sit in modules whose other topics are authored in parts 1 to 3.
 * Structure, statute and institutional design are taught as fact because they
 * are stable. No vacancy count, fee, cut-off, exam date or year specific figure
 * is stated as current fact anywhere in this file, and where a characterisation
 * is politically contested it is attributed rather than asserted.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30207: {
    topicId: 30207,
    title: "Disaster management, environment and sustainable development",
    summary:
      "One Paper-I unit holds three subjects that are usually studied separately, and the paper asks them in a single, factual, low ambiguity form. You learn the hazard and vulnerability framework, the statutory machinery the Disaster Management Act created, the protected area and convention lists that carry the recall marks, and the sustainable development vocabulary the paper now expects.",
    concepts: [
      "Hazard, vulnerability and risk",
      "Disaster management cycle",
      "Disaster Management Act institutions",
      "Protected areas and biodiversity",
      "International environmental conventions",
      "Sustainable Development Goals",
    ],
    glossary: {
      Hazard:
        "An event or condition with the potential to cause harm, such as an earthquake, a flood, a heat wave or an industrial gas release. A hazard is a property of nature or of a process, not of a population, so a hazard exists whether or not anybody is standing in its path.",
      Vulnerability:
        "The set of conditions that make an exposed population likely to suffer when a hazard arrives: weak construction, no savings, no warning, no route out. It is the term that explains why the same rainfall kills in one settlement and inconveniences another.",
      Mitigation:
        "Action taken before an event to reduce the damage the hazard can do, by changing the physical or regulatory environment. A seismic building code, an embankment and a zoning rule that keeps construction off a floodplain are all mitigation, and none of them is preparedness.",
      Preparedness:
        "Action taken before an event on the assumption that the damage will occur anyway: warning systems, evacuation plans, drills, stockpiles and trained teams. Mitigation reduces the loss, preparedness reduces the confusion.",
      "Biosphere reserve":
        "A large area recognised for conserving a whole landscape along with the people who live in it, organised as a strictly protected core, a buffer where limited use is allowed, and a transition zone of ordinary settlement and cultivation. Recognition under the international programme is separate from the domestic legal notification of any park or sanctuary inside it.",
      "Nationally Determined Contribution":
        "The climate pledge a country files under the Paris Agreement, setting out what it will do and by when. It is self determined and periodically updated rather than assigned by a treaty body, which is the structural difference between the Paris Agreement and the protocol that preceded it.",
    },
    body: {
      Beginner: `<p>A <strong>hazard</strong> is an event that can do harm: an earthquake, a flood, a cyclone, a heat wave, a gas leak at a factory. A hazard on its own is not a disaster. It becomes a <strong>disaster</strong> only when it reaches people who are exposed to it and who cannot cope with it. A landslide in an empty forest damages nobody. The same landslide above a hillside settlement kills.</p>
<p>That one distinction is the basis of the whole unit. You cannot prevent an earthquake. You can decide how houses are built, where a colony is allowed to come up, and whether a warning reaches a village in time. Those decisions change the loss even though the hazard itself has not changed at all.</p>
<h2>The cycle of work</h2>
<p>Disaster work is described as a cycle with two halves. Before the event come <strong>prevention</strong> and <strong>mitigation</strong>, which means reducing the damage the hazard can do, and <strong>preparedness</strong>, which means being ready to act. After the event come <strong>response</strong> and relief, then recovery, rehabilitation and reconstruction. Building an embankment is mitigation. Holding an evacuation drill is preparedness. Running a relief camp is response. Rebuilding a road on a safer alignment is recovery.</p>
<h2>Who is responsible in India</h2>
<p>The Disaster Management Act was passed in 2005, after the Indian Ocean tsunami of December 2004. It created a structure at three levels:</p>
<ul>
<li>The <strong>National Disaster Management Authority</strong>, chaired by the Prime Minister.</li>
<li>A <strong>State Disaster Management Authority</strong> in each state, chaired by the Chief Minister.</li>
<li>A <strong>District Disaster Management Authority</strong> in each district, chaired by the District Collector.</li>
</ul>
<p>The National Disaster Response Force is the trained force moved to a site when one is needed. The National Institute of Disaster Management trains officials and prepares the guidance the authorities issue.</p>
<h2>Environment words you will need</h2>
<p>An <strong>ecosystem</strong> is a community of living things together with the soil, water and air they live in. <strong>Biodiversity</strong> is the variety of living things in a place. A <strong>national park</strong> and a <strong>wildlife sanctuary</strong> are both areas protected by law under the Wildlife (Protection) Act of 1972, and a national park is the stricter of the two.</p>
<h2>Sustainable development</h2>
<p>Sustainable development means development that meets the needs of the present without taking away the ability of future generations to meet their own needs. That wording comes from a United Nations commission report published in 1987. In 2015 the United Nations adopted seventeen <strong>Sustainable Development Goals</strong> with a target year of 2030.</p>
<h2>What Telangana actually faces</h2>
<p>Learn your own state's hazard profile, because the paper asks about it. Telangana is landlocked, so a cyclone never makes landfall here, although the rain from a weakening Bay of Bengal system does reach the districts. The hazards that matter are drought, summer heat waves, flash flooding in the built up parts of Hyderabad, and lightning. Earthquake risk across most of the state is low.</p>`,
      Intermediate: `<p>This unit is examined in Paper-I and it is one of the most predictable blocks in the whole scheme. The questions are short, factual and rarely ambiguous: an institution and who heads it, a convention and its subject, a protected area and its district, a goal count and a target year. That predictability is the reason to prepare it properly rather than leaving it to general awareness.</p>
<h2>The framework the answers are built on</h2>
<p>Disaster risk is treated as the product of three things. Risk rises with the <strong>hazard</strong> that a place is exposed to, rises with the <strong>vulnerability</strong> of the people exposed, and falls with the <strong>capacity</strong> available to them. Write it as risk equals hazard multiplied by vulnerability and divided by capacity. It is a conceptual relation and not an equation anybody computes, but it decides how every policy question in this unit is answered: the hazard is fixed, so a state acts on vulnerability and on capacity.</p>
<p>Hazards are classified by origin, and the classification is worth holding because the paper uses it as a matching set. Geophysical hazards are earthquakes and landslides. Hydrological hazards are floods. Meteorological hazards are cyclones, heat waves and lightning. Climatological hazards are drought and forest fire. Biological hazards are epidemics and pest infestations. Industrial and chemical accidents are grouped as human induced.</p>
<h2>The statutory machinery, in the order it is asked</h2>
<table>
<tr><th>Body</th><th>Headed by</th><th>Function</th></tr>
<tr><td>National Disaster Management Authority</td><td>Prime Minister</td><td>Lays down policy and issues national guidelines</td></tr>
<tr><td>National Executive Committee</td><td>Union Home Secretary</td><td>Prepares and monitors the national plan</td></tr>
<tr><td>State Disaster Management Authority</td><td>Chief Minister</td><td>State policy and the state plan</td></tr>
<tr><td>State Executive Committee</td><td>Chief Secretary</td><td>Implementation and coordination in the state</td></tr>
<tr><td>District Disaster Management Authority</td><td>District Collector</td><td>The district plan and the actual response on the ground</td></tr>
<tr><td>National Disaster Response Force</td><td>A Director General</td><td>Specialist response, drawn from the central armed police forces</td></tr>
</table>
<p>The financing side is a separate list and is asked separately. The Act provides for a National Disaster Response Fund and a National Disaster Mitigation Fund, with corresponding funds at state and district level. Response money pays for relief after an event; mitigation money pays for work done before one, and the distinction between the two funds is a favourite two statement question.</p>
<h2>The international architecture</h2>
<p>The <strong>Sendai Framework for Disaster Risk Reduction</strong> was adopted in 2015 for the period to 2030, and it replaced the Hyogo Framework for Action of 2005 to 2015. Sendai is organised as four priorities for action, understanding risk, strengthening governance, investing in resilience, and enhancing preparedness for a better recovery, together with seven global targets. Notice the shift the framework itself claims: from managing disasters to managing risk.</p>
<h2>Environment law and protected areas</h2>
<ul>
<li><strong>Wildlife (Protection) Act, 1972</strong>: national parks, wildlife sanctuaries, conservation reserves and community reserves, all notified by the state government, with schedules that decide the level of protection given to species.</li>
<li><strong>Water Act, 1974</strong> and <strong>Air Act, 1981</strong>: the pollution control boards at the centre and in each state, with consent to establish and consent to operate as the main instrument.</li>
<li><strong>Forest (Conservation) Act, 1980</strong>: prior central approval before forest land is put to non-forest use.</li>
<li><strong>Environment (Protection) Act, 1986</strong>: the umbrella law passed after the Bhopal gas disaster of 1984, under which the environmental impact assessment rules are made.</li>
<li><strong>Biological Diversity Act, 2002</strong>: the National Biodiversity Authority, state boards and the biodiversity management committees at local body level.</li>
<li><strong>National Green Tribunal Act, 2010</strong>: a specialised tribunal for environmental cases, with appeal to the Supreme Court.</li>
</ul>
<p>For Telangana, learn Amrabad and Kawal as the tiger reserves, and Eturnagaram, Pakhal, Kinnerasani, Pocharam and Manjeera as sanctuaries with the district each sits in. A district name attached to a sanctuary is the exact form the state specific question takes.</p>
<h2>Climate and the goals</h2>
<p>Keep the treaties in two families. The ozone family runs from the Vienna Convention of 1985 to the Montreal Protocol of 1987 on ozone depleting substances, extended by the Kigali Amendment of 2016 to cover hydrofluorocarbons. The climate family runs from the United Nations Framework Convention on Climate Change agreed at Rio in 1992, through the Kyoto Protocol of 1997 with its binding targets for developed countries, to the Paris Agreement of 2015 in which every country files its own nationally determined contribution. The Sustainable Development Goals, seventeen goals and one hundred and sixty nine targets adopted in 2015 for the period to 2030, replaced the eight Millennium Development Goals that ran from 2000 to 2015.</p>`,
      Advanced: `<p>You are not short of information in this unit. What costs marks here is a set of confusions that survive several readings because each of the confused items is individually familiar. Work on the pairs, not on the lists.</p>
<h2>The six confusions that decide the marks</h2>
<ul>
<li><strong>Mitigation against preparedness.</strong> Anything that reduces the damage the hazard can do is mitigation. Anything that improves your readiness once the damage occurs is preparedness. A retrofitted school building is mitigation, a drill in that school is preparedness, and the paper sets exactly this pair.</li>
<li><strong>Chairs and heads.</strong> The authority at each level is chaired by the political head, the executive committee at each level by the administrative head. Prime Minister and Home Secretary at the centre, Chief Minister and Chief Secretary in the state. The District Collector is the exception that breaks the pattern, because at district level the same officer chairs the authority.</li>
<li><strong>Response fund against mitigation fund.</strong> Response is post event relief, mitigation is pre event works. Money cannot be moved between the two by an administrative decision, which is why the distinction is real and not merely nominal.</li>
<li><strong>Montreal against Kyoto.</strong> Montreal is ozone, Kyoto is greenhouse gases. The pair is set every cycle, and it is made harder by the fact that hydrofluorocarbons, which are greenhouse gases, are controlled under the Kigali Amendment to Montreal rather than under the climate treaties, because that is where the industrial machinery to control them already existed.</li>
<li><strong>National park against wildlife sanctuary.</strong> Both are notified by the state government. The difference lies in the treatment of rights inside: a sanctuary can permit certain rights and activities at the discretion of the authority, a national park ordinarily cannot. The distractor is always the claim that one is notified by the Union government.</li>
<li><strong>Biosphere reserve against tiger reserve.</strong> A biosphere reserve is a landscape recognition with a core, buffer and transition structure. A tiger reserve is created under the Wildlife (Protection) Act with a core or critical tiger habitat and a buffer, and it is administered under the National Tiger Conservation Authority. They can overlap on the map and still be different legal objects.</li>
</ul>
<h2>Where the state specific marks are</h2>
<p>The Telangana portion of this unit is small, precisely defined and consistently under-prepared, which makes it the best value block here. Four things carry it. First, the hazard profile: drought across the drier southern and western districts, heat waves that peak in April and May, urban flooding where storm drains in Hyderabad have been built over, and lightning deaths that are individually small events but large in aggregate. Second, the protected areas with their districts. Third, the state pollution control board and the state biodiversity board as institutions. Fourth, the state's own large programmes in water and forestry, which you should be able to describe by design and objective without quoting an expenditure figure or a completion percentage.</p>
<p>That last discipline matters in an interview as much as in the paper. State what a programme is meant to do and how it is structured. Do not quote a coverage number you cannot source, because a coverage number is exactly what a board member will ask you to justify.</p>
<h2>Answering the policy flavoured question</h2>
<p>A few questions in this unit are not recall. They give a short situation and ask which action is appropriate. Read them through the risk relation. If the option acts on the hazard, it is usually wrong, because hazards are rarely controllable. If it reduces exposure or vulnerability, or raises capacity, it is usually right. A question about repeated flooding in a growing town is answered by drainage and by land use control, not by a proposal to alter the rainfall.</p>
<h2>Marginal marks in the last fortnight</h2>
<ol>
<li>Write the six treaties on one card with year and subject. Recite it until the year comes before the subject does.</li>
<li>Write the institutional table from memory twice, once for the national level and once for the state and district level.</li>
<li>List the Telangana protected areas with districts. Five minutes a day for a week fixes them.</li>
<li>Learn the four Sendai priorities in order. The order itself is asked, because a question can give three of the four and ask for the missing one.</li>
<li>Learn the goal counts as a set: seventeen goals and one hundred and sixty nine targets from 2015, replacing eight goals that ran from 2000.</li>
</ol>
<p>One habit to unlearn: reading news reports on climate negotiations as though they were syllabus. A negotiation round produces a decision text that is examined, if at all, as a single line about what was agreed. The structure of the agreements underneath is what carries the marks every year.</p>`,
      Expert: `<p>Last month. This unit is pure recall, so the only useful work left is compression and a check on the pairs you keep swapping.</p>
<h2>Institutions</h2>
<table>
<tr><th>Level</th><th>Authority chair</th><th>Executive committee chair</th></tr>
<tr><td>National</td><td>Prime Minister</td><td>Union Home Secretary</td></tr>
<tr><td>State</td><td>Chief Minister</td><td>Chief Secretary</td></tr>
<tr><td>District</td><td>District Collector</td><td>No separate committee at this level</td></tr>
</table>
<h2>Treaties, year and subject</h2>
<table>
<tr><th>Instrument</th><th>Year</th><th>Subject</th></tr>
<tr><td>Ramsar Convention</td><td>1971</td><td>Wetlands of international importance</td></tr>
<tr><td>CITES</td><td>1973</td><td>Trade in endangered species</td></tr>
<tr><td>Vienna Convention</td><td>1985</td><td>Framework for protecting the ozone layer</td></tr>
<tr><td>Montreal Protocol</td><td>1987</td><td>Ozone depleting substances</td></tr>
<tr><td>UNFCCC and CBD</td><td>1992</td><td>Climate change; biological diversity</td></tr>
<tr><td>UNCCD</td><td>1994</td><td>Desertification</td></tr>
<tr><td>Kyoto Protocol</td><td>1997</td><td>Binding targets for developed countries</td></tr>
<tr><td>Paris Agreement</td><td>2015</td><td>Self determined national contributions</td></tr>
<tr><td>Kigali Amendment</td><td>2016</td><td>Hydrofluorocarbons, under Montreal</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>Hazard is the event, vulnerability is the condition of the people, risk is what the two produce together. Policy acts on the second.</li>
<li>Mitigation is before and structural. Preparedness is before and organisational. Response is after.</li>
<li>Montreal is ozone. Kyoto is carbon. Kigali is a refrigerant gas sitting inside the ozone treaty.</li>
<li>Park and sanctuary are both state notified. Only the treatment of rights inside separates them.</li>
<li>Sendai has four priorities and seven targets, runs 2015 to 2030, and replaced Hyogo.</li>
<li>Seventeen goals, one hundred and sixty nine targets, 2015 to 2030, replacing eight goals from 2000 to 2015.</li>
</ul>
<h2>Checklist before the paper</h2>
<ol>
<li>Recite the institutional table cold, then the funds: response is relief, mitigation is prevention works.</li>
<li>Recite the treaty table by year, then again by subject, because the paper matches in both directions.</li>
<li>Run the Telangana list: tiger reserves, sanctuaries, their districts, the state hazard profile.</li>
<li>Check the environmental Acts by year: 1972 wildlife, 1974 water, 1980 forest conservation, 1981 air, 1986 environment protection, 2002 biological diversity, 2010 green tribunal.</li>
<li>Fix one rule for the situation question: the correct option reduces exposure or vulnerability, or builds capacity. It does not attempt to control the hazard.</li>
</ol>
<h2>Edge cases</h2>
<ul>
<li>A heat wave is declared against a departure from the normal maximum for that station, not against a single national temperature, so a lower absolute temperature can still be a heat wave in a cooler district.</li>
<li>A biosphere reserve carries international recognition but no separate legal power of its own; the enforceable protection inside it comes from the park or sanctuary notification.</li>
<li>India's nationally determined contribution is expressed as a reduction in the emissions intensity of gross domestic product and as a share of non-fossil installed capacity, not as an absolute cap on emissions. State it in that form and the distinction is safe.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A severe cyclone crosses an uninhabited stretch of coast and causes no casualties or property loss. How is the event best classified?",
        options: [
          "A disaster of low magnitude, because the damage was small",
          "A hazard that did not become a disaster, because no exposed and vulnerable population was present",
          "Neither a hazard nor a disaster, because nothing was affected",
          "A disaster averted by mitigation works along the coast",
        ],
        answer: 1,
        explanation:
          "The cyclone is a hazard whether or not anybody stands in its path; it becomes a disaster only when it meets an exposed and vulnerable population. Calling it a small disaster is the natural reading and it is wrong, because it makes the loss the definition, whereas the loss is the outcome of vulnerability meeting the hazard.",
        difficulty: "Easy",
        skill: "Hazard, vulnerability and risk",
      },
      {
        n: 2,
        question:
          "A district enforces an earthquake resistant building code on all new construction. Which phase of the disaster management cycle does this belong to?",
        options: ["Preparedness", "Mitigation", "Response", "Rehabilitation"],
        answer: 1,
        explanation:
          "Mitigation is action taken beforehand to reduce the damage a hazard can do by changing the physical or regulatory environment, and a building code is exactly that. Preparedness is tempting because it also happens before the event, but preparedness assumes the damage will occur and works on readiness instead: drills, warning systems, stockpiles and evacuation plans.",
        difficulty: "Easy",
        skill: "Disaster management cycle",
      },
      {
        n: 3,
        question: "Who chairs the State Disaster Management Authority?",
        options: [
          "The Chief Secretary of the state",
          "The Governor of the state",
          "The Chief Minister of the state",
          "The Principal Secretary of the revenue department",
        ],
        answer: 2,
        explanation:
          "At each level the authority is chaired by the political head and the executive committee by the administrative head, so the Chief Minister chairs the State Disaster Management Authority. The Chief Secretary is the attractive wrong answer because that officer does chair the State Executive Committee, which prepares and implements the state plan.",
        difficulty: "Medium",
        skill: "Disaster Management Act institutions",
      },
      {
        n: 4,
        question:
          "What is the correct distinction between a national park and a wildlife sanctuary in India?",
        options: [
          "A national park is notified by the Union government and a sanctuary by the state government",
          "A national park protects a single flagship species and a sanctuary protects many",
          "Both are notified by the state government, but a sanctuary may permit certain rights and activities inside it that a national park ordinarily does not",
          "A sanctuary is created for a fixed term and a national park is permanent",
        ],
        answer: 2,
        explanation:
          "Both categories are notified by the state government under the Wildlife (Protection) Act, 1972, and what separates them is the degree of protection, in particular the treatment of grazing and other rights inside the boundary. The option about the notifying authority is the standard distractor and it is wrong in both halves, since the Union government does not notify either category.",
        difficulty: "Medium",
        skill: "Protected areas and biodiversity",
      },
      {
        n: 5,
        question:
          "Which international agreement controls substances that deplete the stratospheric ozone layer?",
        options: [
          "The Kyoto Protocol",
          "The Montreal Protocol",
          "The Basel Convention",
          "The Stockholm Convention",
        ],
        answer: 1,
        explanation:
          "The Montreal Protocol of 1987, made under the Vienna Convention of 1985, is the ozone instrument and it phases out chlorofluorocarbons and related compounds. Kyoto is the tempting confusion because both are protocols concerned with the atmosphere, but Kyoto sits under the climate convention and deals with greenhouse gas emissions rather than ozone depletion.",
        difficulty: "Easy",
        skill: "International environmental conventions",
      },
      {
        n: 6,
        question:
          "The Kigali Amendment of 2016 brought which class of substances under the control of the Montreal Protocol?",
        options: [
          "Chlorofluorocarbons",
          "Carbon dioxide from thermal power generation",
          "Hydrofluorocarbons",
          "Persistent organic pollutants",
        ],
        answer: 2,
        explanation:
          "Hydrofluorocarbons were adopted as replacements for the earlier refrigerant gases, and although they do not deplete ozone they are potent greenhouse gases, so Kigali placed them under the treaty that already had the machinery to phase a refrigerant out. Chlorofluorocarbons are the tempting answer because they are what the protocol is famous for, but they were controlled from the original text of 1987.",
        difficulty: "Hard",
        skill: "International environmental conventions",
      },
      {
        n: 7,
        question: "The Sustainable Development Goals adopted in 2015 replaced which earlier set?",
        options: [
          "The eight Millennium Development Goals, which ran from 2000 to 2015",
          "The Hyogo Framework for Action, which ran from 2005 to 2015",
          "The seventeen targets of the Rio Declaration of 1992",
          "The Brundtland Commission objectives of 1987",
        ],
        answer: 0,
        explanation:
          "Seventeen goals with one hundred and sixty nine targets replaced the eight Millennium Development Goals of 2000 to 2015, with a target year of 2030. Hyogo is the attractive distractor because it also ended in 2015 and was also replaced that year, but its successor is the Sendai Framework for Disaster Risk Reduction and it belongs to the disaster stream, not the development stream.",
        difficulty: "Medium",
        skill: "Sustainable Development Goals",
      },
      {
        n: 8,
        question:
          "Which pair best describes the hazards that dominate Telangana's own risk profile?",
        options: [
          "Cyclone landfall and coastal storm surge",
          "Drought and summer heat waves",
          "Major earthquakes and landslides",
          "Tsunami and coastal erosion",
        ],
        answer: 1,
        explanation:
          "Telangana is landlocked and sits on stable ground, so its recurring hazards are drought, heat waves, urban flash flooding and lightning. Cyclone landfall is the tempting option because Bay of Bengal systems do bring heavy rain into the districts, but the system has already weakened over the coastal states by then, and landfall by definition happens on the coast.",
        difficulty: "Medium",
        skill: "Hazard, vulnerability and risk",
      },
    ],
  },

  30208: {
    topicId: 30208,
    title: "Ancient and medieval India, weighted by marks carried",
    summary:
      "The whole sweep from the Harappan cities to the Mughal empire, allocated by what the paper actually asks rather than by what a textbook devotes pages to. The section is titled socio-cultural history, so religion, language, art, architecture and the organisation of society carry the marks, and dynastic sequence is the scaffolding you hang them on.",
    concepts: [
      "Harappan urbanism",
      "Vedic society and the later Vedic change",
      "Heterodox sects and Ashokan dhamma",
      "Gupta classical culture and land grants",
      "Bhakti and Sufi devotion",
      "Sultanate and Mughal institutions",
    ],
    glossary: {
      "Socio-cultural history":
        "The study of how a society lived, believed, produced and built, rather than of the order in which its rulers succeeded one another. The Commission uses this exact wording for the section, and the question paper follows it, so a candidate who prepares only king lists is preparing the smaller half.",
      Dhamma:
        "The code of ethical conduct that Ashoka proclaimed in his edicts: respect for elders, restraint in speech, non-injury to living beings, care of servants and generosity to ascetics of every sect. It is a public ethic addressed to all subjects, and it is not the same thing as the doctrinal content of Buddhism.",
      Agrahara:
        "A village or a share of its revenue granted to brahmans, ordinarily free of tax and recorded on a copper plate. The spread of such grants from the Gupta centuries onward is the principal evidence historians use for agrarian expansion into forest and for the growth of local landed power.",
      "Nirguna bhakti":
        "Devotion addressed to a divine without form or attributes, and therefore without image worship and without incarnation. Kabir and Guru Nanak are placed here. Saguna devotion, by contrast, is addressed to a divine with form, most often Rama or Krishna.",
      Iqta:
        "The Delhi Sultanate arrangement by which the revenue of a defined territory was assigned to an officer, who met his own salary and maintained a stipulated body of troops from it. It was in principle transferable and revocable rather than hereditary, which is what separates it from a permanent proprietary grant.",
      Zabti:
        "The Mughal revenue method associated with Todar Mal, also called the dahsala system, in which the cultivated area was measured and the demand fixed in cash for each unit of area on the basis of a ten year average of produce and prices. It replaced a seasonal share of the actual harvest with a known figure announced in advance.",
    },
    body: {
      Beginner: `<p>This section covers a very long stretch of time, from the first Indian cities down to the Mughal empire. Nobody memorises all of it. What you learn is a small number of periods, and for each one, four things: who ruled, how people lived, what they believed, and what they built.</p>
<h2>The first cities</h2>
<p>Around four and a half thousand years ago, cities appeared along the Indus river and its neighbours. Harappa and Mohenjo-daro are the best known; Dholavira and Lothal in Gujarat, Kalibangan in Rajasthan and Rakhigarhi in Haryana are in present day India. They had streets meeting at right angles, houses of standard sized baked bricks, covered drains running under the streets, and standardised stone weights. Their writing has never been read, so we know them through their objects and not through their records. No building has been identified with certainty as a temple or a royal tomb.</p>
<h2>The Vedic period</h2>
<p>The oldest Indian text is the <strong>Rig Veda</strong>. The people it describes lived mainly in the north west, kept cattle, and were organised in tribes whose chiefs were checked by assemblies. Over the following centuries, settlement moved east into the Ganga valley, iron came into use, farming produced larger surpluses, and small tribal groups grew into kingdoms. The four <strong>varnas</strong>, the ranked social order, hardened during this later stage.</p>
<h2>New religions and the first empire</h2>
<p>In about the sixth century before the common era, teachers questioned ritual and sacrifice. The Buddha and Mahavira are the two whose followings lasted. Not long afterwards the Mauryan empire was founded by Chandragupta Maurya. His grandson <strong>Ashoka</strong> fought a war in Kalinga, turned against the killing, and had messages carved on rocks and pillars across the subcontinent. Those messages set out <strong>dhamma</strong>, a code of good conduct for everyone, whatever their religion.</p>
<h2>The Gupta centuries</h2>
<p>From about the fourth century of the common era, the Guptas ruled much of north India. This period gave the mathematician Aryabhata, the astronomer Varahamihira, Sanskrit poetry and drama, and the earliest surviving stone temples. Kings began granting whole villages to brahmans and to temples, written on copper plates.</p>
<h2>Devotion, sultans and emperors</h2>
<p>From roughly the seventh century, poets across India began writing hymns in their own spoken languages instead of Sanskrit. That is the <strong>bhakti</strong> movement. From the eleventh century, Sufi teachers of Islam settled in India and taught a devotional path of their own. In 1206 the Delhi Sultanate was founded, and in 1526 Babur defeated the last Sultan at Panipat and founded the Mughal empire, which Akbar built into a working administration.</p>
<p>Keep one anchor per period. Cities and drains. Cattle and assemblies. Edicts and dhamma. Temples and land grants. Hymns in the spoken language. A revenue system in cash.</p>`,
      Intermediate: `<p>The section is called socio-cultural history of India, and that title is an instruction about where the marks are. The paper prefers questions on religion, language, literature, art, architecture, trade and the organisation of society over questions on who succeeded whom. You still need the sequence, because ordering questions appear, but treat chronology as the frame and culture as the content.</p>
<h2>Allocate your hours the way the paper allocates its questions</h2>
<table>
<tr><th>Block</th><th>Share of your hours</th><th>What is actually asked</th></tr>
<tr><td>Harappan civilisation</td><td>Low</td><td>Site with modern state, town planning features, the undeciphered script, what is absent from the record</td></tr>
<tr><td>Vedic period</td><td>Low to medium</td><td>Rig Vedic against later Vedic contrasts, texts and their order, the varna order</td></tr>
<tr><td>Heterodox sects and the Mauryas</td><td>High</td><td>Buddhist and Jain doctrine and councils, the edicts, dhamma, Mauryan administration and sources</td></tr>
<tr><td>Post-Mauryan and Gupta</td><td>High</td><td>Art schools, temple beginnings, science and literature, land grants</td></tr>
<tr><td>Early medieval and the south</td><td>Medium</td><td>Bhakti in the Tamil country, Chola local assemblies, bronze and temple form</td></tr>
<tr><td>Sultanate</td><td>Medium to high</td><td>Iqta, market regulations, architecture, Sufi orders</td></tr>
<tr><td>Mughal</td><td>High</td><td>Mansabdari, revenue, religious policy, painting and building</td></tr>
</table>
<h2>The Harappan record, and its silences</h2>
<p>Mature Harappan urbanism runs roughly from 2600 to 1900 before the common era. What the paper asks is concrete: grid planning with streets meeting at right angles, a covered drainage system reaching individual houses, burnt bricks in a fixed ratio of dimensions, granaries and the Great Bath at Mohenjo-daro, the dockyard at Lothal, water reservoirs at Dholavira, weights in a standard series, and seals carrying an undeciphered script written from right to left. Learn the absences with equal care: no confirmed temple, no royal burial, no evidence of a standing army.</p>
<h2>From the Rig Veda to the kingdoms</h2>
<p>Contrast the two Vedic stages directly. The Rig Vedic economy is pastoral and its wealth is counted in cattle; the later Vedic economy is agricultural, uses iron, and produces a surplus a king can tax. The Rig Vedic chief is checked by the sabha and the samiti; the later Vedic king performs the great sacrifices that assert a permanent territorial claim. By the sixth century before the common era there are sixteen mahajanapadas, and Magadha absorbs the rest through its position, its iron and its river.</p>
<h2>The heterodox turn and the Mauryas</h2>
<p>The Buddha and Mahavira both taught in the eastern Gangetic plain, both used a spoken language rather than Sanskrit, and both rejected the authority of sacrifice. Learn the Buddhist councils with their places and their patrons, and the Jain division into Digambara and Shvetambara. For the Mauryas, learn the sources before the events: the Arthashastra attributed to Kautilya, the fragments of Megasthenes, the Ashokan inscriptions themselves, and the Buddhist chronicles. The edicts are in Prakrit written in Brahmi across most of the subcontinent, in Kharosthi in the north west, and in Greek and Aramaic at Kandahar. Brahmi was deciphered by James Prinsep in 1837, which is why the edicts became usable evidence only in the nineteenth century.</p>
<h2>Gupta and after</h2>
<p>The fullest account of Samudragupta is the eulogy composed by Harisena and engraved on the Allahabad pillar. Chandragupta II is the reign in which the Chinese pilgrim Fa-Hien travelled. The period gives Aryabhata and Varahamihira, the earliest freestanding stone temples in the nagara idiom, and the mature Ajanta painting. The historically important change is quieter: tax free land grants to brahmans and temples spread, carrying settled cultivation into forest tracts and creating local powers between the king and the village.</p>
<h2>Devotion and the medieval state</h2>
<p>Bhakti begins in the Tamil country with the Alvars, devoted to Vishnu, and the Nayanars, devoted to Shiva, and moves north over several centuries. Distinguish nirguna devotion, addressed to a formless divine, from saguna devotion addressed to Rama or Krishna. Sufism arrives with organised orders, the Chishti and the Suhrawardi being the two to know, working from a khanqah and using music and assembly in the Chishti case. In Telugu, Annamacharya, Potana, Vemana and Ramadasu are the names this paper expects.</p>
<p>For the state, learn two devices and one contrast. The Sultanate ran on the iqta, an assignment of revenue in return for troops. The Mughals ran on the mansab, a numerical rank with a zat component fixing personal status and pay and a sawar component fixing the cavalry to be maintained. Akbar's revenue settlement fixed a cash demand per unit of measured area from a ten year average, which is a different instrument from taking a share of each harvest as it comes in.</p>`,
      Advanced: `<p>A second attempt in this section usually fails for one of two reasons. Either the candidate has read more history than the paper needs and still cannot place a name, or the candidate has memorised lists and cannot answer a question that asks what a piece of evidence shows. Both are fixed by changing what you practise, not by reading another book.</p>
<h2>Practise the four question forms the paper actually uses</h2>
<ol>
<li><strong>Matching.</strong> Site with modern state, text with author, edict with location, order with founder. This is where a weak candidate loses most, and it is the easiest to drill because the pairs are finite.</li>
<li><strong>Two statements with a reason.</strong> One statement is a fact and the second is offered as its explanation. The common trap is that both statements are individually true and the second does not explain the first, and that option exists in every such question.</li>
<li><strong>Chronological ordering.</strong> Four items to be placed in sequence. You do not need every date; you need the anchors: 1206, 1336 and 1347 for Vijayanagara and the Bahmani, 1526, 1556, 1707.</li>
<li><strong>Evidence to inference.</strong> Given a find or an inscription, what does it establish? This is the form that separates the top of the field, and it is trained by asking of every fact you learn, what would we not know if this object had not survived.</li>
</ol>
<h2>The confusions that cost marks to people who have read the material</h2>
<ul>
<li><strong>Gandhara against Mathura.</strong> Gandhara sculpture works in grey schist and carries Hellenistic modelling, wavy hair and heavy drapery. Mathura works in spotted red sandstone, and its figures are fuller and more indigenous in idiom. Both produced Buddha images in the same centuries, so a question that names only the material is answerable and a question that names only the subject is not.</li>
<li><strong>Dhamma against Buddhism.</strong> The edicts prescribe conduct and toleration, not doctrine. Ashoka was a lay Buddhist and sent missions, and both facts are true at once. An option that says he made Buddhism the state religion of the empire is wrong on the evidence of the edicts themselves.</li>
<li><strong>Iqta against jagir against inam.</strong> The iqta is a Sultanate revenue assignment tied to troops. The jagir is its Mughal successor, attached to a mansab rank and normally transferable. An inam or agrahara is a tax free grant, often religious or charitable, and not a service obligation.</li>
<li><strong>Zabti against crop sharing.</strong> Zabti measures the land and fixes cash in advance. Crop sharing takes a proportion of what is actually harvested. A question that describes a fixed cash demand per bigha is describing zabti even when it does not use the word.</li>
<li><strong>Nirguna against saguna.</strong> The test is whether the divine is worshipped with form. Kabir and Nanak are nirguna; Tulsidas, Surdas, Mirabai and Chaitanya are saguna. The distractor usually offers language or caste of the saint as the criterion, which is not the criterion.</li>
<li><strong>Councils and their patrons.</strong> The Buddhist councils are set as a matching item, and the patron is the part candidates drop.</li>
</ul>
<h2>Where the Telangana connection belongs</h2>
<p>The regional dynasties are examined in their own topic, so in this survey you keep only the joins: the Deccan is inside the Mauryan sphere, the post-Mauryan Deccan state grows on the Godavari, the Delhi Sultanate reaches Warangal in the early fourteenth century, and the Deccan sultanates emerge from the break-up of the Bahmani kingdom. If you can state those four joins in one sentence each, an ordering question that mixes an all India event with a regional one becomes safe.</p>
<h2>How to revise this section without rereading it</h2>
<p>Build four sheets and revise only from those. One sheet of matched pairs. One sheet of period contrasts, each written as two columns. One sheet of sources, arranged as text, author, period and what it tells us. One sheet of architecture, arranged as feature, period and one example. Every revision after the first is from the sheets. A candidate who rereads a textbook in the last month is buying comfort, not marks, because recall is what fails in the hall and rereading does not train recall.</p>
<p>One more discipline for interviews and for descriptive answers elsewhere. Where a historical characterisation is contested, say what happened and who said what about it. A religious policy, a temple destruction, a revenue burden: state the record, then attribute the interpretation to the historian or the tradition that offers it. That is both accurate and safe, and it is how the better answer reads.</p>`,
      Expert: `<p>Final month. Everything here is retrieval practice. Use the tables, close them, write them, then check.</p>
<h2>Sources, and what only they tell you</h2>
<table>
<tr><th>Source</th><th>Period</th><th>Uniquely gives</th></tr>
<tr><td>Arthashastra, attributed to Kautilya</td><td>Mauryan tradition</td><td>A theory of administration, espionage and revenue</td></tr>
<tr><td>Indica of Megasthenes, in fragments</td><td>Mauryan</td><td>An outsider's account of the capital and society</td></tr>
<tr><td>Ashokan edicts</td><td>Mauryan</td><td>A ruler's own words on conduct and policy</td></tr>
<tr><td>Allahabad pillar eulogy by Harisena</td><td>Gupta</td><td>The campaigns and titles of Samudragupta</td></tr>
<tr><td>Account of Fa-Hien</td><td>Gupta</td><td>Monastic life and travel conditions</td></tr>
<tr><td>Account of Xuanzang</td><td>Harsha</td><td>Nalanda, and the state of Buddhism</td></tr>
<tr><td>Uttaramerur inscriptions</td><td>Chola</td><td>The procedure of village assemblies</td></tr>
<tr><td>Ain-i-Akbari of Abul Fazl</td><td>Mughal</td><td>Administrative and statistical detail of the empire</td></tr>
</table>
<h2>Period contrasts on one line each</h2>
<ul>
<li>Rig Vedic pastoral and tribal; later Vedic agricultural, iron using and territorial.</li>
<li>Gandhara in grey schist with Hellenistic modelling; Mathura in spotted red sandstone.</li>
<li>Nagara temple with a curvilinear tower; dravida with a stepped pyramidal vimana and a gateway tower.</li>
<li>Iqta gives revenue for troops; jagir does the same under a mansab; inam and agrahara give revenue without service.</li>
<li>Zabti fixes cash on measured area; sharing takes a proportion of the standing crop.</li>
<li>Nirguna worships the formless; saguna worships Rama or Krishna with form.</li>
</ul>
<h2>Chronological anchors</h2>
<ul>
<li>Mature Harappan roughly 2600 to 1900 before the common era.</li>
<li>Mauryan empire founded in the late fourth century before the common era; Kalinga war in Ashoka's reign.</li>
<li>Gupta rule from about the fourth to the sixth century of the common era.</li>
<li>Delhi Sultanate from 1206 to 1526, in five dynasties: Mamluk, Khalji, Tughlaq, Sayyid, Lodi.</li>
<li>Vijayanagara founded 1336, the Bahmani kingdom 1347.</li>
<li>First battle of Panipat 1526; Akbar's accession 1556; death of Aurangzeb 1707.</li>
</ul>
<h2>Answering rules</h2>
<ol>
<li>In a two statement question, verify each statement alone first, then ask whether the second explains the first. Both true and unrelated is always an available option.</li>
<li>In an ordering question, place the two you are sure of, then use elimination on the options rather than dating the remaining two.</li>
<li>In an evidence question, prefer the option that the object could actually establish. A seal cannot establish a belief; a drainage plan cannot establish a form of government.</li>
<li>If a characterisation in the stem sounds like a judgment rather than a record, the safe option is the one that reports what was done and by whom.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which observation is the strongest evidence that the mature Harappan settlements were planned?",
        options: [
          "Streets meeting at right angles, standard sized burnt bricks and covered drains serving individual houses",
          "Large royal tombs placed at the centre of each city",
          "Administrative records on clay tablets listing grain issued to workers",
          "Temple complexes aligned to the cardinal directions",
        ],
        answer: 0,
        explanation:
          "Grid alignment, bricks in a fixed dimensional ratio and a covered drainage network reaching houses are the physical features excavation actually shows, and together they imply a common standard applied across a settlement. The record option is the tempting one because planned cities elsewhere left archives, but the Harappan script remains undeciphered, so no argument that depends on reading their documents can be made.",
        difficulty: "Easy",
        skill: "Harappan urbanism",
      },
      {
        n: 2,
        question:
          "Which statement best captures the change from the Rig Vedic to the later Vedic stage?",
        options: [
          "The varna order disappeared as territorial kingdoms took shape",
          "Settlement moved eastward into the Ganga valley, agriculture and iron use expanded, and territorial kingship grew at the expense of tribal assemblies",
          "A pastoral society replaced an earlier agricultural one and cattle became the main form of wealth",
          "Sanskrit was abandoned in favour of the spoken languages of the east",
        ],
        answer: 1,
        explanation:
          "The later Vedic texts show an eastward shift into the Ganga and Yamuna region, the use of iron, a taxable agricultural surplus and kings asserting permanent territorial claims through great sacrifices, while the sabha and samiti lose ground. The pastoral option reverses the direction of the change, which is the exact error the paper is testing: cattle wealth belongs to the earlier stage, not the later one.",
        difficulty: "Medium",
        skill: "Vedic society and the later Vedic change",
      },
      {
        n: 3,
        question: "Ashoka's dhamma, as set out in his edicts, is best described as",
        options: [
          "The doctrine of Buddhism declared to be the state religion of the empire",
          "A penal code prescribing punishments for offences against religion",
          "A code of ethical conduct addressed to all subjects, including respect for elders, non-injury and generosity to ascetics of every sect",
          "A body of ritual instruction composed in Sanskrit for the royal household",
        ],
        answer: 2,
        explanation:
          "The edicts prescribe conduct and toleration rather than doctrine, and they instruct officers called dhamma mahamatras to propagate that conduct among subjects of every persuasion. Making Buddhism the state religion is the attractive answer because Ashoka was himself a lay Buddhist and sent missions abroad, but the edicts nowhere require subjects to adopt Buddhism, and treating dhamma as doctrine is the error the question is built on.",
        difficulty: "Medium",
        skill: "Heterodox sects and Ashokan dhamma",
      },
      {
        n: 4,
        question: "The fullest surviving account of Samudragupta's reign comes from",
        options: [
          "The Arthashastra attributed to Kautilya",
          "The eulogy composed by Harisena and engraved on the Allahabad pillar",
          "The travel account of Fa-Hien",
          "The Rajatarangini of Kalhana",
        ],
        answer: 1,
        explanation:
          "Harisena's composition on the Allahabad pillar lists the campaigns, the submitting rulers and the titles, and it is the primary evidence for the reign. Fa-Hien is the tempting choice because he is the Chinese pilgrim associated with the Gupta period, but he travelled in the reign of Chandragupta II and wrote about monastic life and travel conditions rather than about Samudragupta's campaigns.",
        difficulty: "Medium",
        skill: "Gupta classical culture and land grants",
      },
      {
        n: 5,
        question: "Kabir and Guru Nanak are classified as nirguna saints because",
        options: [
          "They composed in Sanskrit rather than in the spoken languages of their regions",
          "They founded monastic orders modelled on the Sufi khanqah",
          "They addressed a divine without form or attributes, and therefore rejected image worship and incarnation",
          "They confined their teaching to a single community rather than addressing all listeners",
        ],
        answer: 2,
        explanation:
          "The nirguna and saguna division rests on whether the divine is conceived with form: nirguna devotion has no image and no incarnation, which is why Kabir and Nanak sit apart from Tulsidas, Surdas and Mirabai. The Sanskrit option is attractive because classification usually follows language elsewhere in the syllabus, but both saints used the spoken idiom of their region, and that is part of why their verse spread.",
        difficulty: "Medium",
        skill: "Bhakti and Sufi devotion",
      },
      {
        n: 6,
        question: "Which statement about the iqta of the Delhi Sultanate is correct?",
        options: [
          "It was a grant of land in permanent hereditary ownership, free of any obligation",
          "It was an assignment of the revenue of a territory to an officer who maintained troops from it, transferable and revocable in principle",
          "It was a tax free grant made to religious institutions and scholars",
          "It was a fixed cash salary paid from the central treasury in place of any assignment",
        ],
        answer: 1,
        explanation:
          "The iqta assigned revenue, not ownership, and it carried a service obligation to maintain a stipulated body of troops, with transfer and resumption available to the Sultan as a control on the holder. Hereditary ownership is the tempting reading because holders repeatedly tried to make their assignments permanent, but the attempt is evidence that the arrangement was not hereditary by design.",
        difficulty: "Hard",
        skill: "Sultanate and Mughal institutions",
      },
      {
        n: 7,
        question:
          "A revenue system measures the cultivated area and fixes a demand in cash for each unit of area, using an average of produce and prices over ten years. This describes",
        options: [
          "Crop sharing, in which the state takes a proportion of each harvest as it is reaped",
          "The zabti or dahsala settlement associated with Todar Mal",
          "The iqta assignment of the Sultanate period",
          "A tax free charitable grant of the inam type",
        ],
        answer: 1,
        explanation:
          "Measurement of area, a cash demand per unit and a ten year average of produce and prices are the defining features of the zabti settlement, and the point of it is that the cultivator knows the demand before the season begins. Crop sharing is the standard distractor because it is the other well known method, but it takes a proportion of the actual harvest and therefore cannot be announced in advance.",
        difficulty: "Hard",
        skill: "Sultanate and Mughal institutions",
      },
    ],
  },
};

export default PART;
