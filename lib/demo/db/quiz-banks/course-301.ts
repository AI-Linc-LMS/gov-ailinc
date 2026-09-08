import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 301, TGPSC Group-I: Prelims, Mains & Interview.
 *
 * Every `skill` below is a single word taken from a topic title in course 301, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by splitting
 * its title into at most four capitalised words, and `bankForTopic` matches this skill against
 * that list case-insensitively. A multi-word skill, or a word that is not among the first four
 * concepts of some topic, matches nothing and sinks to the bottom of every pile.
 *
 * Skills used, module by module:
 *   1 Prelims, Mains                      5 Fiscal, Irrigation
 *   2 Agreement, Mulki, Formula,          6 Krishna, Monsoon
 *     Reorganisation                      7 Technology, Data
 *   3 Kakatiya, Nizam                     8 Answer
 *   4 Constitution, Legislature, Finance
 *
 * The correct option is spread across all four positions (A x5, B x4, C x5, D x4). An earlier
 * draft keyed seventeen of eighteen questions to B, which a repeat attempter reads off the
 * screen without knowing any of the subject.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 301001: reading the notification and planning the year ---- */
  mcq(
    301,
    1,
    "How do the marks you score in the Group-I prelims count towards the final merit list?",
    [
      "They are added to the total of the mains papers",
      "They are added to the interview score",
      "They do not count at all, because prelims only screens candidates for the mains",
      "They are used only to break a tie between candidates with equal mains marks",
    ],
    2,
    "Easy",
    "Prelims",
    "The prelims is an objective screening test in general studies and mental ability. It decides who is called to the mains and nothing further, so the merit list is built from the mains written papers and the interview. The tempting answer is that prelims marks are carried forward, and candidates who believe it spend months chasing a high prelims score. A candidate who scrapes through prelims and a candidate who tops it start the mains on exactly the same footing, which is why this course puts answer writing in the second month.",
  ),
  mcq(
    301,
    2,
    "In the Group-I mains, where is the Telangana movement and state formation examined?",
    [
      "As a paper of its own, separate from the history paper",
      "As one section inside the history, culture and geography paper",
      "Only through the general essay paper",
      "Only at the interview stage, from the application form",
    ],
    0,
    "Medium",
    "Mains",
    "The mains runs to six papers, and the Telangana movement and state formation is one of them in its own right, sitting alongside general essay, history and culture and geography, Indian society and constitution and governance, economy and development, and science and technology with data interpretation. The tempting answer is that it is a chapter of state history, which is how it is usually taught in a general studies class. An aspirant who reads it that way carries a few pages of notes into a paper that asks for the post-1956 political history in full, and loses the marks this exam is actually decided on.",
  ),

  /* ---- Module 301002: Telangana movement and state formation ---- */
  mcq(
    301,
    3,
    "The Gentlemen's Agreement of 1956 was arrived at in order to settle which question?",
    [
      "The sharing of Krishna and Godavari waters between the two regions",
      "Whether Hyderabad city should become a union territory",
      "The terms on which Hyderabad State would join the Indian Union",
      "Safeguards for Telangana in employment, education and finance inside the new Andhra Pradesh",
    ],
    3,
    "Easy",
    "Agreement",
    "The States Reorganisation Commission had recommended that Telangana remain a separate state at least until 1961. The Gentlemen's Agreement was the political understanding that made the merger acceptable instead: domicile rules for public employment, a proportionate share of expenditure, a regional council for Telangana, and a convention on how the chief minister and deputy chief minister posts would be shared. River water is the tempting answer because those disputes are real and long running, but they go to tribunals constituted under the Inter-State River Water Disputes Act, not to a political agreement between regional leaders.",
  ),
  mcq(
    301,
    4,
    "The Mulki rules, whose non-implementation drove the 1969 agitation, governed what?",
    [
      "Reservation of assembly seats for the Telangana districts",
      "A residence based qualification for appointment to public posts in the Hyderabad region",
      "The share of the state irrigation budget spent in Telangana",
      "The right to be taught in Telugu medium in the Hyderabad region",
    ],
    1,
    "Medium",
    "Mulki",
    "A mulki was a local, and the rules of the Nizam's administration required a period of residence in the dominions before a person could hold a public post there. They carried over into Andhra Pradesh, were repeatedly diluted in practice, and the Supreme Court upheld their validity in 1972. Legislative seats are the tempting answer because the Telangana Regional Committee was a real body created for the region, but that committee dealt with legislative oversight while the Mulki rules were an employment rule, and it was jobs, not seats, that the 1969 agitation was about.",
  ),
  mcq(
    301,
    5,
    "The Six Point Formula of 1973 and GO 610 of 1985 are studied together because",
    [
      "both were later struck down by the Supreme Court as discriminatory",
      "both dealt with the allocation of Godavari waters between the regions",
      "the Formula set up local cadres for public employment, and GO 610 was issued to undo appointments made in breach of those cadre rules",
      "both were recommendations of the Srikrishna Committee",
    ],
    2,
    "Hard",
    "Formula",
    "The Six Point Formula replaced the Mulki rules with a scheme of local cadres and zones for direct recruitment, and it was given constitutional cover by Article 371-D and the Presidential Order of 1975. GO 610, issued on the findings of the Jayabharath Reddy committee, directed that employees appointed in violation of those zonal rules be repatriated to their own zones. Its non-implementation, later documented by the Girglani Commission, became a standing grievance of the renewed movement. The tempting answer is that the scheme was struck down, but Article 371-D was inserted precisely to insulate it from challenge, so the failure lay in enforcement and not in law.",
  ),
  mcq(
    301,
    6,
    "Under the Andhra Pradesh Reorganisation Act, 2014, what provision was made for Hyderabad?",
    [
      "It was made a union territory administered by the centre",
      "It became the capital of Telangana alone from the appointed day",
      "It was constituted as a capital region to be jointly administered by both states permanently",
      "It was made the common capital of both successor states for a period not exceeding ten years",
    ],
    3,
    "Hard",
    "Reorganisation",
    "The Act made Hyderabad the common capital of Telangana and Andhra Pradesh for a period not exceeding ten years from the appointed day, after which it is the capital of Telangana alone, and it gave the Governor specific responsibilities for law and order and for the security of central institutions in that common capital. A union territory is the tempting answer because it was seriously canvassed in the public debate and a variant of it was examined by the Srikrishna Committee, but no such provision was enacted. Read the difference the way the exam does: what was proposed, and what the statute finally said.",
  ),

  /* ---- Module 301003: history, culture and heritage ---- */
  mcq(
    301,
    7,
    "The Kakatiya period tank irrigation of Telangana is best described as",
    [
      "chains of tanks in which the surplus of an upstream tank feeds the next tank downstream",
      "large masonry dams built across the main stem of the Godavari",
      "perennial canals drawn off the Krishna river",
      "open wells linked by a network of underground channels",
    ],
    0,
    "Easy",
    "Kakatiya",
    "On an undulating plateau with no perennial river running through the interior, the Kakatiyas harvested local runoff. A tank was sited at the foot of a small catchment, its surplus weir discharged into the tank below, and a chain of them stored and passed on the same water. Pakhal, Laknavaram and Ramappa are the well known examples, and the state's tank restoration programme took the Kakatiya name for exactly this reason. Dams on the Godavari are the tempting answer because that is what large irrigation looks like today, but river valley projects of that kind belong to the twentieth century.",
  ),
  mcq(
    301,
    8,
    "Hyderabad State's integration into the Indian Union in 1948 was preceded by which arrangement with the Government of India?",
    [
      "An Instrument of Accession signed in 1947, along with the other princely states",
      "A plebiscite held across the districts of Hyderabad State",
      "A Standstill Agreement of 1947 that held existing arrangements in place for a year while talks continued",
      "A treaty of subsidiary alliance renewed after independence",
    ],
    2,
    "Hard",
    "Nizam",
    "The Nizam did not accede in 1947. A Standstill Agreement signed in November 1947 kept the existing arrangements on communications, defence and external affairs in place for one year while negotiations went on, and when they failed the state was integrated by police action in September 1948. The Instrument of Accession is the tempting answer because that is the route almost every other princely state took, and that is exactly the point: Hyderabad, Junagadh and Kashmir are studied separately because each of them departed from it.",
  ),

  /* ---- Module 301004: polity, governance and public administration ---- */
  mcq(
    301,
    9,
    "The basic structure doctrine is a limit on which power?",
    [
      "The power of Parliament to make ordinary laws",
      "The power of Parliament to amend the Constitution",
      "The power of the President to promulgate ordinances",
      "The power of a state legislature to legislate on a concurrent list subject",
    ],
    1,
    "Easy",
    "Constitution",
    "Kesavananda Bharati held that Parliament may amend any part of the Constitution but may not alter its basic structure, which is how a constitutional amendment became reviewable at all. Ordinary laws are the tempting answer, and they are certainly reviewable, but on different grounds: an ordinary law is tested against the fundamental rights and the legislative lists, and the courts have declined to test one against the basic structure. The doctrine exists precisely because an amendment can otherwise place a law beyond an ordinary fundamental rights challenge.",
  ),
  mcq(
    301,
    10,
    "A money bill is passed by a state legislative assembly in a state that also has a legislative council. What can the council do with it?",
    [
      "Reject it, in which case the bill lapses",
      "Amend it, and the assembly is bound by the amendments",
      "Hold it for not more than fourteen days, after which it is deemed passed as the assembly sent it",
      "Return it once for reconsideration, and if the assembly passes it again the two houses sit jointly",
    ],
    2,
    "Hard",
    "Legislature",
    "A money bill goes to the council, which may make recommendations but must return the bill within fourteen days. The assembly may accept or reject those recommendations, and if the council does not return it in time the bill is deemed to have been passed by both houses in the form the assembly sent it. A joint sitting is the tempting answer because candidates carry the union procedure across, but there is no joint sitting mechanism for a state legislature at all, and even at the union level a joint sitting never arises on a money bill.",
  ),
  mcq(
    301,
    11,
    "What does the Finance Commission constituted under Article 280 principally recommend?",
    [
      "The distribution of the net proceeds of union taxes between the centre and the states, and the share of each state in it",
      "The allocation of centrally sponsored scheme funds among the states",
      "The borrowing ceiling of each state government for the coming year",
      "The budget allocation of each union ministry",
    ],
    0,
    "Medium",
    "Finance",
    "The Commission recommends how the net proceeds of taxes are divided between the union and the states and how the states' share is distributed among them, along with the principles governing grants in aid from the Consolidated Fund of India. Centrally sponsored schemes are the tempting answer because they are the money a state government argues about most publicly, but those are decided in the union budget by the line ministries and lie outside the Commission's award. Keep the two channels apart in an answer: one is a constitutional transfer, the other is discretionary.",
  ),

  /* ---- Module 301005: economy and development ---- */
  mcq(
    301,
    12,
    "A state closes the year with a revenue deficit of nil but a large fiscal deficit. What does that combination tell you?",
    [
      "The state is borrowing in order to pay salaries and pensions",
      "The state has no outstanding debt",
      "The state's own tax revenue has collapsed",
      "The state's borrowing is financing capital expenditure rather than current consumption",
    ],
    3,
    "Hard",
    "Fiscal",
    "Revenue deficit is the excess of revenue expenditure over revenue receipts, so nil means the running costs of government are fully met from current receipts. The fiscal deficit is the gap between total expenditure and total receipts other than borrowing, so what remains must be capital spending financed by borrowing, which creates an asset against the liability. Borrowing for salaries is the tempting answer and it is the genuinely worrying case, but that is precisely what a large revenue deficit would reveal, and here it is zero.",
  ),
  mcq(
    301,
    13,
    "In irrigation statistics, the gap between gross irrigated area and net irrigated area is explained by",
    [
      "land irrigated from groundwater rather than from canals",
      "area that is irrigated in more than one season of the same agricultural year",
      "area under projects that are still under construction",
      "fallow land lying inside an irrigated command",
    ],
    1,
    "Medium",
    "Irrigation",
    "Net irrigated area counts each parcel of land once, however often it is watered. Gross irrigated area counts it again for every season in which it is irrigated, so the gap between the two measures cropping intensity under irrigation, which is what a second and a third crop actually depend on. The source of water is the tempting answer, but a canal hectare and a borewell hectare both sit inside the net figure and inside the gross figure alike, so a source-wise split cannot produce the difference between them.",
  ),

  /* ---- Module 301006: geography, environment and disaster management ---- */
  mcq(
    301,
    14,
    "The Musi, which flows through Hyderabad, is a tributary of which river?",
    ["Krishna", "Godavari", "Manjira", "Tungabhadra"],
    0,
    "Easy",
    "Krishna",
    "The Musi rises in the hills of Vikarabad district, flows east through Hyderabad and joins the Krishna in Nalgonda district, which is why the city sits in the Krishna basin even though the state as a whole drains mostly to the Godavari. The Manjira is the tempting answer because it supplies a large part of the city's drinking water from the Singur and Manjira reservoirs, and candidates file it under Hyderabad for that reason. The Manjira is a Godavari tributary. Supplying a city and draining it are two different relationships.",
  ),
  mcq(
    301,
    15,
    "Telangana takes most of its rain from the south west monsoon. Which feature of that rainfall, rather than the seasonal total, does most to cause agricultural distress?",
    [
      "Most of the rain falling at night rather than in the day",
      "A large share of the year's rain arriving as winter rain",
      "Long dry spells falling between heavy spells within the same season",
      "Rain being distributed evenly across every district",
    ],
    2,
    "Medium",
    "Monsoon",
    "A season can deliver a near normal total and still lose the crop, because a break of two or three weeks at flowering or grain filling does damage that later rain cannot repair. That is why the state's response is protective irrigation, farm ponds, tank restoration and groundwater recharge rather than a target for total rainfall. Winter rain is the tempting answer because the north east monsoon does reach the state, but its share here is small and its failure is not what breaks a kharif crop.",
  ),

  /* ---- Module 301007: science, technology and current affairs ---- */
  mcq(
    301,
    16,
    "Why is a sun synchronous polar orbit preferred for an earth observation satellite used in land and crop survey?",
    [
      "It remains above the same point on the equator at all times",
      "It crosses a given latitude at roughly the same local solar time on every pass, so images taken on different dates are comparable",
      "It flies much higher than a geostationary satellite and so sees more ground",
      "It can image the whole earth in a single pass",
    ],
    1,
    "Hard",
    "Technology",
    "Holding the local solar time constant holds the sun angle nearly constant, so illumination and shadow are similar from one date to the next and a change between two images can be attributed to the ground rather than to the lighting. That is what makes change detection, crop acreage estimation and land record updating possible. Staying above one point is the tempting answer, but that describes a geostationary orbit, which is used for communication and weather watch and sits at roughly 36,000 km, far too high for the ground resolution a survey needs.",
  ),
  mcq(
    301,
    17,
    "Enrolment at a skill centre rises by 25 per cent in one year and then falls by 20 per cent in the next. Compared with where it started, enrolment after the two years is",
    ["up by 5 per cent", "down by 5 per cent", "up by 2 per cent", "unchanged"],
    3,
    "Medium",
    "Data",
    "Successive percentage changes multiply, they do not add. Take 100 as the starting figure: a rise of 25 per cent gives 125, and a fall of 20 per cent removes 25 of that, which returns you to exactly 100. Written as factors it is 1.25 multiplied by 0.80, which is 1.00. Up by 5 per cent is the tempting answer, and it comes from adding 25 and subtracting 20 as though both applied to the same base. The fall applies to the larger base of 125, so the smaller percentage removes the same absolute number.",
  ),

  /* ---- Module 301008: answer writing, essay and the interview ---- */
  mcq(
    301,
    18,
    "A mains question begins 'critically examine' rather than 'describe'. What does that change about the answer you write?",
    [
      "It asks for a judgement supported by both the merits and the limitations, not only an account of what happened",
      "It asks for a longer answer carrying more facts",
      "It requires a diagram in every case",
      "It requires quotations from official reports",
    ],
    0,
    "Easy",
    "Answer",
    "The directive word tells you what the examiner is marking. Describe asks for an accurate account. Critically examine asks you to weigh a claim on both sides and arrive at a position you can defend, and the marks that separate candidates sit in that judgement. More facts is the tempting answer because it feels like more work, but the word limit is the same either way, so an answer that only adds detail scores like a descriptive one while costing you the minutes you needed for the next question.",
  ),
];

export default BANK;
