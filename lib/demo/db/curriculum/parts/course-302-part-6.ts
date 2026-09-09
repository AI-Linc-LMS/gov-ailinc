/**
 * Course 302: TGPSC Group-II & Group-III Foundation - part 6.
 *
 * Topics 30214, 30216, 30223 and 30224: the judiciary topic of the Constitution
 * and polity module, the opening topic of the society and public policy module,
 * and the second and third periods of the Telangana movement paper.
 *
 * Content rule for this course: syllabus structure, institutions, statutes and
 * the sequence of events are stable and safe to teach. Vacancy counts,
 * cut-offs, fees and year-specific figures are not, and none appear here.
 * Where a political or social characterisation is contested, the text states
 * what happened and attributes the characterisation rather than asserting it.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30214: {
    topicId: 30214,
    title: "Judiciary, judicial review and public interest litigation",
    summary:
      "The court system taken as a set of jurisdictions rather than as a list of courts, because the paper asks which court can order what and under which article. You also learn how the power of judicial review was built, how the basic structure doctrine arrived, and what changed procedurally when public interest litigation relaxed the rule on who may approach a court.",
    concepts: [
      "Integrated judiciary and court hierarchy",
      "Jurisdictions of the Supreme Court",
      "High Court writ jurisdiction under Article 226",
      "Judicial review and the basic structure doctrine",
      "Public interest litigation and relaxed locus standi",
      "Judicial independence and appointment of judges",
    ],
    glossary: {
      "Court of record":
        "A court whose proceedings are recorded as evidence of themselves and may be cited as precedent, and which carries an inherent power to punish contempt of itself. Article 129 gives the status to the Supreme Court and Article 215 to every High Court.",
      "Locus standi":
        "The standing a person needs before a court will hear the complaint, ordinarily proof that the person's own legal right has been affected. Public interest litigation works by loosening this requirement, not by removing the need for a legal wrong.",
      "Special leave petition":
        "A petition under Article 136 asking the Supreme Court to grant leave to appeal from the order of any court or tribunal other than a court martial. Leave is discretionary, so the Court may refuse without deciding the merits.",
      "Judicial review":
        "The power of a court to examine whether a law or an executive act conforms to the Constitution and to declare it void if it does not. It is not conferred by one article; it is built from Article 13, from Articles 32 and 226 and from the scheme of a written Constitution.",
      "Epistolary jurisdiction":
        "The practice of treating a letter addressed to a judge or to the court as a writ petition, developed so that a person in custody or in bonded labour could set the process in motion without a lawyer or a formal petition.",
      "Curative petition":
        "The last remedy against a final order, entertained after a review petition has already been dismissed, on narrow grounds such as a violation of natural justice. The Supreme Court devised it in 2002, so it comes from a judgment and not from the text of the Constitution.",
    },
    body: {
      Beginner: `<p>India has a single chain of courts. The same courts decide cases under central law and under state law, and each court answers to the one above it. That is different from countries that run a separate set of national courts alongside the state courts.</p>
<h2>The three levels</h2>
<p>At the base sit the <strong>subordinate courts</strong> in each district: the district judge on the civil side, the sessions judge on the criminal side, and below them junior civil judges and magistrates. Most cases begin here.</p>
<p>Above them in each state sits the <strong>High Court</strong>. Telangana shared a High Court with Andhra Pradesh until a separate High Court for the State of Telangana began functioning at Hyderabad on 1 January 2019. A High Court hears appeals from the district courts, and it also hears some matters directly.</p>
<p>At the top is the <strong>Supreme Court</strong> at New Delhi. It hears appeals from every High Court, it decides disputes between governments, and what it lays down binds every court in the country.</p>
<h2>What judicial review means</h2>
<p>A legislature makes laws and the government carries them out. A court can then examine whether a law or an order breaks the Constitution, and if it does, the court can declare it invalid. That power is called <strong>judicial review</strong>. It is what makes a fundamental right worth having, because a right that no one can enforce anywhere is only a promise.</p>
<h2>Public interest litigation</h2>
<p>The ordinary rule is that only the person who has been wronged may come to court. That rule leaves out an undertrial who has been in jail for years without a hearing, a bonded labourer, or a child working in a quarry, because such a person cannot reach a court and cannot pay for one. From the late 1970s the Supreme Court began to relax the rule. A person acting in good faith could bring the case on behalf of someone else, and the Court accepted even a letter as a petition. This is <strong>public interest litigation</strong>.</p>
<h2>Why judges are hard to remove</h2>
<p>A judge who can be dismissed by a minister cannot safely decide against that minister. So the Constitution fixes the salary, charges it on the Consolidated Fund so that it is not voted on every year, and permits removal only through a long parliamentary process on proved misbehaviour or incapacity. No judge of the Supreme Court or of a High Court has so far been removed by that route.</p>
<h2>What to carry away</h2>
<p>One hierarchy, three levels. One power of review that runs through all of it. One procedural change, public interest litigation, that decided who is allowed to ask.</p>`,
      Intermediate: `<p>Paper-II Section-II sets this unit as article number recall with a functional twist. The question is not only which article, but which court, and what that court can actually order. Learn the judiciary as a set of jurisdictions.</p>
<h2>The Supreme Court, by article</h2>
<ul>
<li><strong>Article 124.</strong> Establishes the Court. The original strength was the Chief Justice and seven other judges, with Parliament free to increase it, and the sanctioned strength now stands at the Chief Justice and thirty three others. A judge holds office until the age of sixty five.</li>
<li><strong>Qualification.</strong> A citizen of India who has been a High Court judge for five years, or a High Court advocate for ten years, or is a distinguished jurist in the opinion of the President. No minimum age is prescribed.</li>
<li><strong>Article 129.</strong> A court of record with power to punish for its contempt.</li>
<li><strong>Article 131.</strong> Exclusive original jurisdiction in disputes between the Government of India and one or more states, or between states, where a question of legal right is involved. A private party cannot bring a suit under this article.</li>
<li><strong>Articles 132, 133 and 134.</strong> Appeals in constitutional, civil and criminal matters, ordinarily on a certificate granted by the High Court under Article 134A. A criminal appeal lies as of right where a High Court has reversed an acquittal and imposed a sentence of death.</li>
<li><strong>Article 136.</strong> Special leave to appeal from any judgment of any court or tribunal except a court martial. It is discretionary, and it is the route by which most matters actually arrive.</li>
<li><strong>Article 137.</strong> Power to review its own judgment, subject to law and to the rules made by the Court.</li>
<li><strong>Article 141.</strong> The law declared by the Supreme Court binds all courts within the territory of India.</li>
<li><strong>Article 142.</strong> Power to pass any decree needed to do complete justice in a cause before it.</li>
<li><strong>Article 143.</strong> Advisory jurisdiction. The President may refer a question of law or fact of public importance, and the Court reports an opinion that does not bind.</li>
</ul>
<h2>High Courts</h2>
<p>Article 214 gives every state a High Court and Article 231 permits a common High Court for two or more states, which is how Telangana and Andhra Pradesh shared one until 1 January 2019. A High Court judge retires at sixty two. The qualification is ten years in judicial office or ten years as an advocate of a High Court, and there is no distinguished jurist route at this level.</p>
<p>Article 226 is the working provision. A High Court may issue writs and any other direction or order for the enforcement of a fundamental right and, in the words of the article, for any other purpose. Article 227 gives it superintendence over all courts and tribunals within its territory, other than those relating to the armed forces.</p>
<h2>Subordinate courts</h2>
<p>Articles 233 to 237 place the appointment of district judges with the Governor, in consultation with the High Court, while control over the district judiciary, including posting, promotion and leave, rests with the High Court. Appointment sits with the executive, control sits with the judiciary, and the split is examined directly.</p>
<h2>Judicial review and the basic structure</h2>
<p>Article 13 declares void any law inconsistent with a fundamental right, and Articles 32 and 226 supply the remedy. On the amending power itself, Kesavananda Bharati in 1973 settled the position that Parliament may amend any provision of the Constitution but may not damage its basic structure. Every later question on the limits of amendment traces back to that judgment.</p>
<h2>Public interest litigation</h2>
<p>The change was procedural rather than substantive. Once the Court accepted that a member of the public acting in good faith could move it for persons unable to approach it themselves, the class of possible petitioners widened and a letter could be treated as a petition. Hussainara Khatoon in 1979 on undertrial prisoners and S P Gupta in 1981 on standing are the usual citations, and Justices V R Krishna Iyer and P N Bhagwati are the judges associated with the development. Article 39A, a Directive Principle inserted in 1976, and the Legal Services Authorities Act of 1993 sit alongside it as the legal aid arm of the same idea.</p>`,
      Advanced: `<p>You already hold the article numbers. The marks sit in four places: the boundary between Article 32 and Article 226, the order of the amendment cases, what a tribunal may not displace, and writing about appointments and public interest litigation without taking a side.</p>
<h2>Article 32 against Article 226, stated precisely</h2>
<ul>
<li><strong>Status.</strong> Article 32 is itself a fundamental right, sitting inside Part III. Article 226 is a constitutional power of the High Court and is not a fundamental right.</li>
<li><strong>Scope.</strong> Article 32 lies only to enforce a fundamental right. Article 226 lies for that and for any other purpose, so a statutory right or an administrative excess is within it.</li>
<li><strong>Territory.</strong> The Supreme Court reaches the whole country. A High Court reaches authorities within its territory, and under Article 226(2) also an authority outside it where the cause of action arose wholly or in part inside.</li>
<li><strong>Discretion.</strong> A High Court may refuse relief for delay, for conduct or because an alternative remedy exists. A petition under Article 32 cannot be turned away once infringement is shown, although petitioners are often sent to the High Court first.</li>
<li><strong>Suspension.</strong> Under Article 359 the President may suspend the right to move a court for the enforcement of specified rights while a national emergency operates. After the 44th Amendment, Articles 20 and 21 stand outside that power.</li>
</ul>
<h2>The amendment cases in order</h2>
<ol>
<li><strong>Shankari Prasad, 1951</strong> and <strong>Sajjan Singh, 1965</strong>: an amendment is not law within Article 13, so it may abridge a fundamental right.</li>
<li><strong>Golak Nath, 1967</strong>: reversed, holding that fundamental rights cannot be abridged by amendment. The 24th Amendment of 1971 was enacted in response.</li>
<li><strong>Kesavananda Bharati, 1973</strong>: thirteen judges upheld the amending power but subjected it to the basic structure.</li>
<li><strong>Indira Nehru Gandhi v Raj Narain, 1975</strong>: the doctrine applied for the first time to strike down an amendment.</li>
<li><strong>42nd Amendment, 1976</strong>, which declared the amending power unlimited, and <strong>Minerva Mills, 1980</strong>, which struck those clauses down because a limited amending power is itself a basic feature.</li>
<li><strong>Waman Rao, 1981</strong> and <strong>I R Coelho, 2007</strong>: laws put into the Ninth Schedule after 24 April 1973 remain open to challenge on basic structure grounds.</li>
</ol>
<p>The date 24 April 1973 is the most useful fact in that list, because a Ninth Schedule question turns on it.</p>
<h2>Tribunals do not replace the High Court</h2>
<p>Articles 323A and 323B were inserted by the 42nd Amendment to permit administrative and other tribunals, and the original scheme sought to exclude the High Courts. In L Chandra Kumar in 1997 a seven judge bench held that review under Articles 226 and 227 and under Article 32 is part of the basic structure, so a tribunal is supplemental and its orders remain open to a division bench of the High Court in whose jurisdiction it sits.</p>
<h2>Appointments: give the sequence, not a verdict</h2>
<p>Article 124 speaks only of consultation. The First Judges case in 1981 read that as not requiring the Chief Justice's view to prevail. The Second Judges case in 1993 reversed it and located primacy in the judiciary, producing the collegium, and the Third Judges case in 1998, on a reference under Article 143, settled its composition as the Chief Justice with the four seniormost judges. The 99th Amendment and the commission Act of 2014 replaced the collegium, and in 2015 the Court struck both down as violating the independence of the judiciary. Whether that was desirable is argued on both sides, and the paper wants the sequence.</p>
<h2>Public interest litigation: the criticism, attributed</h2>
<p>Set out both halves. The Court's reasoning was that a right without an accessible remedy is not a right, so standing had to yield where the affected person could not come. Critics, including judges writing extra-judicially and several academic commentators, have argued that the jurisdiction draws courts into administration and that the label attracts petitions filed for publicity. The Court has answered with guidelines on which letters are entertained and by imposing costs on frivolous petitions. Write it as that exchange.</p>`,
      Expert: `<h2>Article map</h2>
<table>
<tr><th>Article</th><th>Provision</th></tr>
<tr><td>124</td><td>Supreme Court, appointment, tenure to sixty five, removal on address</td></tr>
<tr><td>129 and 215</td><td>Court of record and contempt, Supreme Court and High Court</td></tr>
<tr><td>131</td><td>Exclusive original jurisdiction, federal disputes only</td></tr>
<tr><td>132 to 134A</td><td>Appeals on certificate, constitutional, civil, criminal</td></tr>
<tr><td>136</td><td>Special leave, discretionary, not from a court martial</td></tr>
<tr><td>137, 141, 142, 143</td><td>Review, binding precedent, complete justice, advisory opinion</td></tr>
<tr><td>214, 217, 231</td><td>High Court for a state, tenure to sixty two, common High Court</td></tr>
<tr><td>222</td><td>Transfer of a High Court judge by the President after consultation with the Chief Justice</td></tr>
<tr><td>226 and 227</td><td>Writs for rights and any other purpose, superintendence</td></tr>
<tr><td>233 to 237</td><td>District judiciary, Governor appoints, High Court controls</td></tr>
<tr><td>323A and 323B</td><td>Administrative and other tribunals, inserted by the 42nd Amendment</td></tr>
</table>
<h2>Thirty two against two twenty six</h2>
<table>
<tr><th>Test</th><th>Article 32</th><th>Article 226</th></tr>
<tr><td>Is it a fundamental right</td><td>Yes</td><td>No</td></tr>
<tr><td>Grounds</td><td>Fundamental rights only</td><td>Rights and any other purpose</td></tr>
<tr><td>Reach</td><td>All India</td><td>Own territory, plus cause of action</td></tr>
<tr><td>Discretion to refuse</td><td>Very limited</td><td>Yes, alternative remedy or delay</td></tr>
<tr><td>Effect of Article 359</td><td>Can be suspended, not for 20 and 21</td><td>Not a Part III right</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>Article 226 is wider in subject matter, Article 32 is stronger in status. Both halves must appear in your answer.</li>
<li>Ninth Schedule: added after 24 April 1973 means open to challenge. Before that date, protected.</li>
<li>Distinguished jurist is a route to the Supreme Court only, never to a High Court.</li>
<li>Article 143 opinion does not bind, and the Court may decline a reference made under clause one.</li>
<li>A tribunal supplements the High Court. L Chandra Kumar, 1997, is the citation.</li>
<li>Collegium comes from judgments of 1993 and 1998, not from the text of Article 124.</li>
</ul>
<h2>Final week drill</h2>
<p>Write the amendment cases from Shankari Prasad to I R Coelho on one line each, with the year and the holding. Then take any three of them and state which article the holding turns on. If you cannot name the article, you will lose the two statement question, because that is where the wrong statement is planted.</p>`,
    },
    questions: [
      {
        n: 1,
        question: "Which statement correctly compares Article 32 with Article 226?",
        options: [
          "Article 32 is wider in subject matter because the Supreme Court stands above the High Courts",
          "Article 226 is wider in subject matter because it lies for the enforcement of fundamental rights and for any other purpose, while Article 32 is itself a fundamental right",
          "Both lie only for the enforcement of fundamental rights, and the difference is only the court approached",
          "Article 226 lies only against state authorities while Article 32 lies against private persons as well",
        ],
        answer: 1,
        explanation:
          "The two provisions differ on two axes at once: Article 226 covers more subject matter because of the words for any other purpose, while Article 32 has the higher status because it sits inside Part III as a right in itself. The first option is tempting because the Supreme Court is indeed the higher court, but seniority of the court does not widen the grounds on which a petition may be brought.",
        difficulty: "Easy",
        skill: "High Court writ jurisdiction under Article 226",
      },
      {
        n: 2,
        question: "Which dispute falls within the exclusive original jurisdiction of the Supreme Court under Article 131?",
        options: [
          "A dispute between the Government of India and a state over the interpretation of a constitutional provision affecting a legal right",
          "A petition by a citizen alleging that a state government has violated a fundamental right",
          "An appeal against the conviction of an accused by a High Court",
          "A dispute between two companies incorporated in different states",
        ],
        answer: 0,
        explanation:
          "Article 131 covers disputes between the union and states or between states where a question of legal right arises, and no other court may hear such a dispute. The fundamental rights petition is the attractive wrong answer because it too begins in the Supreme Court, but that is Article 32, which is original and concurrent with the High Court rather than exclusive, and it is open to a private citizen, which Article 131 is not.",
        difficulty: "Medium",
        skill: "Jurisdictions of the Supreme Court",
      },
      {
        n: 3,
        question: "Which judgment established that Parliament may amend any provision of the Constitution but may not damage its basic structure?",
        options: [
          "Golak Nath, 1967",
          "Kesavananda Bharati, 1973",
          "Minerva Mills, 1980",
          "I R Coelho, 2007",
        ],
        answer: 1,
        explanation:
          "Kesavananda Bharati in 1973 upheld the amending power while subjecting it to the basic structure, and 24 April 1973 became the cut off date for Ninth Schedule protection. Golak Nath is the strong distractor because it also concerned the amendment of fundamental rights, but it went further and held that Parliament could not abridge them at all, a position that Kesavananda replaced.",
        difficulty: "Medium",
        skill: "Judicial review and the basic structure doctrine",
      },
      {
        n: 4,
        question: "What exactly did public interest litigation change in the procedure of the higher courts?",
        options: [
          "It removed the requirement that the petition disclose the violation of any legal right",
          "It relaxed the rule that only a person whose own right is affected may approach the court, so that a person acting in good faith may move it for someone unable to come",
          "It transferred jurisdiction over social welfare matters from the High Courts to the Supreme Court",
          "It made the advisory opinion of the Supreme Court binding on the government",
        ],
        answer: 1,
        explanation:
          "The change was to standing: the class of persons who may set the process in motion widened, and a letter could be treated as a petition, which is why it is called epistolary jurisdiction. The first option overstates it, because a petition must still show a legal wrong to someone; what was relaxed was who may complain of that wrong, not whether a wrong is needed.",
        difficulty: "Medium",
        skill: "Public interest litigation and relaxed locus standi",
      },
      {
        n: 5,
        question: "On what ground did the Supreme Court strike down the 99th Amendment and the National Judicial Appointments Commission Act in 2015?",
        options: [
          "That the amendment had not been ratified by the legislatures of one half of the states",
          "That the amendment was passed without the prior recommendation of the President",
          "That the new arrangement violated the independence of the judiciary, which is part of the basic structure",
          "That Parliament lacks legislative competence over appointments to the higher judiciary",
        ],
        answer: 2,
        explanation:
          "The Court applied the basic structure doctrine, holding that the composition of the commission compromised the independence of the judiciary and the primacy the earlier judgments had located in it. The ratification option is designed to catch candidates who remember only the amendment procedure, but the amendment had in fact been ratified by state legislatures, so the defect found was substantive and not procedural.",
        difficulty: "Hard",
        skill: "Judicial independence and appointment of judges",
      },
      {
        n: 6,
        question: "Which article permits a single High Court to exercise jurisdiction over two or more states?",
        options: [
          "Article 214",
          "Article 226",
          "Article 230",
          "Article 231",
        ],
        answer: 3,
        explanation:
          "Article 231 allows Parliament to establish a common High Court for two or more states, which is the provision under which Telangana and Andhra Pradesh shared a court until a separate High Court for Telangana began work at Hyderabad on 1 January 2019. Article 230 is the close distractor because it also extends a High Court's reach, but it does so to a Union territory rather than to another state.",
        difficulty: "Hard",
        skill: "Integrated judiciary and court hierarchy",
      },
      {
        n: 7,
        question: "Which statement about the advisory jurisdiction under Article 143 is correct?",
        options: [
          "The opinion given is binding on all courts under Article 141",
          "The opinion is advisory, and on a reference under clause one the Court may decline to answer",
          "The Governor of a state may make a reference on a question of state law",
          "The Court must deliver the opinion within a period fixed by the Constitution",
        ],
        answer: 1,
        explanation:
          "A reference under Article 143 produces a report of the Court's opinion, which does not bind, and the Court has on occasion declined to answer a reference made under the first clause. The Article 141 option is attractive because such opinions are cited and followed in practice, but Article 141 speaks of law declared in the exercise of judicial functions, and an advisory opinion is not a judgment between parties.",
        difficulty: "Medium",
        skill: "Jurisdictions of the Supreme Court",
      },
    ],
  },
  30216: {
    topicId: 30216,
    title: "Caste, tribe and gender in the Telangana context",
    summary:
      "The social structure section, taken with the legal instruments that act on it rather than as description alone, because the paper asks which article, which regulation and which judgment. You learn caste as graded inequality, the Fifth Schedule regime that governs the Scheduled Areas of this state, the reservation framework as the courts have shaped it, and how to read a gender indicator without over reading it.",
    concepts: [
      "Caste as graded inequality",
      "Reservation and its constitutional basis",
      "Scheduled Tribes and the Fifth Schedule",
      "Land alienation in Scheduled Areas",
      "Gender indicators and women's work",
      "Tribal assertion and forest rights",
    ],
    glossary: {
      "Graded inequality":
        "The description of caste as a ladder rather than as two opposed groups, in which almost every rank has one group above it and one below. B R Ambedkar used the phrase to argue that the grading is what makes the system durable, because a group with someone below it has something to defend.",
      "Scheduled Areas":
        "Tracts notified under Article 244(1) and the Fifth Schedule, where the Governor may modify the application of a law, a Tribes Advisory Council exists, and special land and governance rules apply. The notification attaches to territory, so a benefit under it depends on where the land is, not only on who holds it.",
      "Creamy layer":
        "The better placed section of a backward class, excluded from the benefit of reservation by an income and status test so that the benefit reaches those still disadvantaged. It was required for backward classes in 1992 and later extended to promotions for Scheduled Castes and Scheduled Tribes.",
      "Child sex ratio":
        "The number of girls per thousand boys in the zero to six age group. It is read separately from the overall sex ratio because it is unaffected by adult migration and adult mortality, so a fall in it points to discrimination before birth or in early childhood.",
      "Work participation rate":
        "The share of the total population recorded as workers, counting main and marginal workers. Women's work is systematically under-recorded in it, because unpaid labour on a family holding or in a household enterprise is often not reported as work at all.",
      "Community forest resource right":
        "The right of a forest dwelling community, recognised under the forest rights law of 2006, to protect, regenerate and manage the forest it has traditionally used. It is a collective right vested in the gram sabha, which distinguishes it from an individual title over cultivated forest land.",
    },
    body: {
      Beginner: `<p>Society in this state, as elsewhere in India, is organised partly by caste, partly by tribe and partly by rules about what women may do. This unit asks you to describe those structures accurately before you argue about them.</p>
<h2>Caste</h2>
<p>Caste is a system in which a person is born into a group, ordinarily marries within it, and finds that the group carries an inherited rank. What makes it hard to describe is that it is not two groups facing each other. It is a long ladder, and almost every group has one above it and one below. B R Ambedkar called this <strong>graded inequality</strong>, and he argued that the grading is what keeps the system stable, because a group with someone below it has something of its own to defend.</p>
<p>The Constitution names groups for special protection. <strong>Scheduled Castes</strong> are communities listed for a state under Article 341, historically subjected to untouchability. <strong>Scheduled Tribes</strong> are communities listed under Article 342, ordinarily living in hill and forest tracts with their own social organisation. Other Backward Classes form a third category, identified as socially and educationally backward.</p>
<h2>Tribe and the Scheduled Areas</h2>
<p>Parts of this state are declared <strong>Scheduled Areas</strong>, meaning tracts in the districts along the Godavari and in the Nallamala forest belt where a special administrative regime applies under the Fifth Schedule of the Constitution. Gond, Koya, Lambada, Chenchu, Kolam and Konda Reddi are among the communities of the state, and some of them, the Chenchu for instance, are classed as particularly vulnerable because their numbers are small and their livelihood depends closely on the forest.</p>
<p>The recurring problem in these tracts is land. The law in this state has for decades barred the transfer of land inside a Scheduled Area from a tribal person to a person who is not, precisely because such transfers were the ordinary route by which families lost their fields.</p>
<h2>Gender</h2>
<p>Two numbers are used to describe the position of women. The <strong>sex ratio</strong> is the number of females for every thousand males. The <strong>work participation rate</strong> is the share of people counted as workers. Both mislead if you read them carelessly. A great deal of women's work is unpaid work on the family holding, and it is often not reported as work at all, so a low figure may be a recording failure rather than an absence of labour.</p>
<p>Reservation of seats for women in panchayats and municipalities is written into the Constitution. It is the one place where the number of women holding public office was changed by law rather than by persuasion, and that makes it a favourite question.</p>`,
      Intermediate: `<p>Paper-II Section-III sets this unit and Paper-III returns to it under issues of development. The questions come in two shapes: an exact one naming an article, an Act or a regulation, and a descriptive one asking you to connect a social structure to a policy. Learn the legal architecture first and hang the state material on it.</p>
<h2>How the categories are made</h2>
<ul>
<li><strong>Articles 341 and 342.</strong> The President specifies, by public notification in relation to a state and after consulting the Governor, the castes and tribes to be treated as Scheduled for that state. Once notified, only Parliament may include or exclude a community by law. The list is therefore state specific, and a community may be Scheduled in one state and not in the next.</li>
<li><strong>Article 342A</strong>, inserted in 2018, provides for a central list of socially and educationally backward classes, and the amendment of 2021 restored the power of a state to prepare and maintain its own list.</li>
<li><strong>Articles 15(4), 15(5) and 16(4).</strong> These are enabling provisions and not mandates. The state may make special provision, and no court will order it to.</li>
<li><strong>Articles 330, 332, 243D and 243T.</strong> Reserved seats for Scheduled Castes and Scheduled Tribes in the Lok Sabha and the state assemblies, and reserved seats in panchayats and municipalities where not less than one third go to women. A state legislature may set a higher share, and several have.</li>
<li><strong>Article 335.</strong> Claims of Scheduled Castes and Scheduled Tribes to be taken into consideration consistently with the maintenance of efficiency of administration.</li>
</ul>
<h2>The Fifth Schedule regime</h2>
<p>Article 244(1) applies the Fifth Schedule to Scheduled Areas in states other than the four north eastern states, which are governed by the Sixth Schedule. Under it the Governor reports annually to the President on the administration of those areas, a Tribes Advisory Council drawn largely from Scheduled Tribe legislators advises on welfare, and the Governor may direct that an Act of Parliament or of the state legislature shall not apply to a Scheduled Area or shall apply with modifications. That last power is the substantive one, and it is the one candidates forget.</p>
<p>Two instruments do the work on the ground. The Land Transfer Regulation as amended in 1970, spoken of as the 1/70 Regulation, bars transfer of immovable property in the Scheduled Areas of this state to a person who is not a member of a Scheduled Tribe, and raises a presumption that land in the possession of a non-tribal was acquired in contravention. The Panchayats (Extension to the Scheduled Areas) Act of 1996, known as PESA, gives the gram sabha ownership of minor forest produce, the power to prevent land alienation and to restore alienated land, and a right to be consulted before land is acquired for a project.</p>
<h2>Reservation as the courts have shaped it</h2>
<p>Indra Sawhney in 1992 upheld reservation for backward classes, required the exclusion of a creamy layer, fixed a ceiling of fifty per cent in ordinary circumstances, and held reservation in promotion impermissible. The 77th Amendment then inserted Article 16(4A) to allow promotion reservation for Scheduled Castes and Scheduled Tribes, and the judgments of 2006 and 2018 set the conditions on which it may operate, including the application of the creamy layer test. The 103rd Amendment of 2019 added a reservation for economically weaker sections, upheld in 2022 against the argument that it breached the ceiling.</p>
<h2>Gender, in law and in the data</h2>
<p>The legal side is easy to list: reserved seats in local bodies, the domestic violence law of 2005, the workplace harassment law of 2013, the amendment of 2005 making a daughter a coparcener in a joint Hindu family on the same terms as a son, and the constitutional amendment of 2023 reserving seats for women in the Lok Sabha and in state assemblies, which takes effect after a census and a delimitation exercise. The state added a law of 1988 prohibiting the dedication of women to a deity, the practice known locally as the jogini system, and enforcement of that law rather than its text is what a question will probe.</p>
<p>The data side needs care. Female literacy, the child sex ratio and the work participation rate move for different reasons, so read them one at a time.</p>`,
      Advanced: `<p>A repeat attempter loses marks here in three ways: by naming the wrong instrument, by asserting a contested social claim as fact, and by over reading a social indicator. Fix all three deliberately.</p>
<h2>Fifth Schedule against Sixth Schedule</h2>
<p>The Sixth Schedule, under Article 244(2), applies to the tribal areas of Assam, Meghalaya, Tripura and Mizoram and creates autonomous district councils with power to make laws on land, forests, inheritance and village administration. The Fifth Schedule, under Article 244(1), applies everywhere else and creates no legislative body at all: it gives the Governor a power to modify the application of laws, and an advisory council. Any option that puts an autonomous district council in a Scheduled Area of this state is wrong on the schedule, and it is attractive because both schedules are about tribal areas.</p>
<h2>The list is a state list</h2>
<p>Because Articles 341 and 342 work in relation to a state, a community may be Scheduled in one state and not in another, and even in a part of a state. Two consequences are examined. A person who migrates from a state where the community is listed does not carry the status into the state of destination for the purpose of employment or education there. And Parliament alone can add or remove a community, so an executive order or a state notification purporting to do so has no effect.</p>
<h2>Contested ground, stated neutrally</h2>
<p>Within the tribal population of this state there is a long running dispute about the effect of listing a numerically large community alongside smaller forest dwelling communities. Adivasi organisations in the agency tracts have contended that the presence of the Lambada community in the Scheduled Tribe list reduces the share of reserved posts and seats actually reaching Gond, Koya and Kolam households. Lambada organisations dispute that account and point to their own historical listing and disadvantage. The examiner is not asking you to settle it. Write that each side contends what it contends, that the list is a matter for Parliament under Article 342, and that successive committees have looked at the question.</p>
<h2>Consultation is not consent</h2>
<p>PESA requires that the gram sabha be consulted before land in a Scheduled Area is acquired for a project. Consultation is not a veto, and the distinction carries a mark. Stronger protections come from elsewhere: the Samatha judgment of 1997 held that government and tribal land in a Scheduled Area could not be leased to a non-tribal or to a private company for mining, and the forest rights law of 2006 makes the gram sabha the authority that initiates determination of claims and recognises a community forest resource right. The land acquisition law of 2013 adds consent requirements in defined situations. Learn which instrument gives which strength of protection, because the distractors are built by swapping them.</p>
<h2>Reading gender data without over reading it</h2>
<ul>
<li>The overall sex ratio moves with adult male out migration, so a district that sends men out for work can show a favourable ratio for a reason that has nothing to do with the treatment of girls. The child sex ratio removes that effect, which is why the two are read together.</li>
<li>A rise in the female work participation rate is not automatically progress. It rises in distress, when a household needs a second earner, and it falls when incomes rise and women withdraw from wage labour. State the direction and the likely cause together.</li>
<li>Literacy is measured over age seven and upwards and therefore lags policy by years. Use enrolment or attendance to speak about the present and literacy to speak about the past.</li>
</ul>
<h2>Answer plan for a fifteen mark question</h2>
<p>Open with the structure, caste as graded inequality and tribe as a territorially anchored category. Take the constitutional apparatus in one paragraph with article numbers. Take the Scheduled Areas apparatus in a second, naming the Fifth Schedule, the 1/70 Regulation, PESA and the forest rights law. Take gender in a third, separating law from indicator. Close by naming one live dispute and attributing both positions. That structure gives the examiner every heading in the syllabus in the order the syllabus sets them.</p>`,
      Expert: `<h2>Instrument, source and what it actually gives</h2>
<table>
<tr><th>Instrument</th><th>Source</th><th>Effect</th></tr>
<tr><td>Fifth Schedule</td><td>Article 244(1)</td><td>Governor may modify application of a law; Tribes Advisory Council; annual report</td></tr>
<tr><td>Sixth Schedule</td><td>Article 244(2)</td><td>Autonomous district councils with law making power; four north eastern states only</td></tr>
<tr><td>1/70 Regulation</td><td>State regulation, 1970</td><td>Bars transfer to a non-tribal; presumption against non-tribal possession</td></tr>
<tr><td>PESA, 1996</td><td>Central Act</td><td>Gram sabha powers; consultation before acquisition, not consent</td></tr>
<tr><td>Samatha, 1997</td><td>Supreme Court</td><td>No mining lease of Scheduled Area land to a non-tribal or a private company</td></tr>
<tr><td>Forest rights law, 2006</td><td>Central Act</td><td>Individual and community rights; gram sabha determines claims</td></tr>
</table>
<h2>Reservation milestones on one line each</h2>
<ul>
<li>Indra Sawhney, 1992: backward class reservation upheld, creamy layer required, fifty per cent ceiling, no promotion reservation.</li>
<li>77th Amendment: Article 16(4A) restores promotion reservation for Scheduled Castes and Scheduled Tribes.</li>
<li>2006 and 2018 judgments: conditions on promotion reservation, creamy layer applied to it.</li>
<li>102nd Amendment, 2018: Article 342A and a central backward class list. 105th Amendment, 2021: state lists restored.</li>
<li>103rd Amendment, 2019: economically weaker section reservation, upheld in 2022.</li>
</ul>
<h2>Two line rules</h2>
<ul>
<li>Fifth Schedule for this state. Sixth Schedule only for Assam, Meghalaya, Tripura and Mizoram.</li>
<li>Articles 341 and 342 lists are state specific, and only Parliament can alter them.</li>
<li>PESA gives consultation. Consent comes from the land acquisition law, not from PESA.</li>
<li>Child sex ratio is zero to six and ignores migration. Overall sex ratio does not.</li>
<li>Rising female work participation can mean distress. Never read it as progress on its own.</li>
<li>Attribute every claim about the effect of a community's listing to the organisation making it.</li>
</ul>
<h2>Final week drill</h2>
<p>Take the instrument table and cover the third column. If you cannot say in one sentence what each instrument actually gives a household in an agency village, you will lose the two statement question, because that column is exactly where the wrong statement is planted.</p>`,
    },
    questions: [
      {
        n: 1,
        question: "Which schedule of the Constitution governs the Scheduled Areas of Telangana, and under which article?",
        options: [
          "The Fifth Schedule, under Article 244(1)",
          "The Sixth Schedule, under Article 244(2)",
          "The Ninth Schedule, under Article 31B",
          "The Eleventh Schedule, under Article 243G",
        ],
        answer: 0,
        explanation:
          "The Fifth Schedule applies under Article 244(1) to Scheduled Areas in states other than the four north eastern states, and it works through the Governor's power to modify the application of laws and through a Tribes Advisory Council. The Sixth Schedule is the tempting choice because it also deals with tribal areas, but it operates only in Assam, Meghalaya, Tripura and Mizoram, and it creates autonomous district councils that have no counterpart here.",
        difficulty: "Easy",
        skill: "Scheduled Tribes and the Fifth Schedule",
      },
      {
        n: 2,
        question: "What is the effect of the Land Transfer Regulation as amended in 1970, commonly called the 1/70 Regulation?",
        options: [
          "It prohibits all sale of agricultural land inside a Scheduled Area, including a sale between two tribal families",
          "It bars transfer of immovable property in a Scheduled Area to a person who is not a member of a Scheduled Tribe, and presumes that land held by a non-tribal was acquired in contravention",
          "It fixes a ceiling on the extent of land a household may hold inside a Scheduled Area",
          "It transfers ownership of all forest land in a Scheduled Area to the gram sabha",
        ],
        answer: 1,
        explanation:
          "The regulation works in one direction, blocking transfer out of tribal hands, and it shifts the burden of proof by presuming that a non-tribal in possession acquired the land unlawfully. The first option is attractive because the regulation is often described loosely as a ban on land transfer, but a transfer between tribal parties is not what it was written to stop.",
        difficulty: "Medium",
        skill: "Land alienation in Scheduled Areas",
      },
      {
        n: 3,
        question: "Which of the following did the Indra Sawhney judgment of 1992 hold?",
        options: [
          "That reservation for backward classes in public employment is unconstitutional",
          "That reservation in promotion for Scheduled Castes and Scheduled Tribes is expressly permitted by Article 16(4A)",
          "That reservation for backward classes is valid, subject to exclusion of a creamy layer and a ceiling of fifty per cent in ordinary circumstances, and that reservation in promotion is not permissible",
          "That the creamy layer test applies to Scheduled Castes and Scheduled Tribes but not to other backward classes",
        ],
        answer: 2,
        explanation:
          "The judgment upheld backward class reservation while imposing the creamy layer exclusion and the fifty per cent ceiling, and it ruled out reservation in promotion. The Article 16(4A) option is the trap for candidates who compress the history, because that clause was inserted afterwards by the 77th Amendment precisely to undo the promotion part of this judgment.",
        difficulty: "Medium",
        skill: "Reservation and its constitutional basis",
      },
      {
        n: 4,
        question: "Why is the child sex ratio read separately from the overall sex ratio?",
        options: [
          "Because children are enumerated more accurately than adults in a census",
          "Because it covers the zero to six age group and is therefore unaffected by adult migration and adult mortality, so it isolates discrimination before birth and in early childhood",
          "Because it is collected by a sample survey while the overall ratio comes from the census",
          "Because it counts boys per thousand girls rather than girls per thousand boys",
        ],
        answer: 1,
        explanation:
          "Restricting the count to the zero to six group removes the two adult effects, out migration of working age men and differential adult mortality, that move the overall ratio for reasons unconnected with the treatment of girls. The accuracy option sounds plausible but is not the reason, and it would not explain why the two ratios are read together rather than one replacing the other.",
        difficulty: "Medium",
        skill: "Gender indicators and women's work",
      },
      {
        n: 5,
        question: "What does the description of caste as a system of graded inequality emphasise?",
        options: [
          "That income is unequally distributed across occupational groups",
          "That the hierarchy is a ladder in which almost every group has one above it and one below, so the sense of grievance is dispersed rather than concentrated in a single opposition",
          "That inequality between castes has been reduced in graded stages by successive legislation",
          "That castes are ranked only in ritual matters and not in economic ones",
        ],
        answer: 1,
        explanation:
          "The point of the phrase is structural: because ranking is continuous rather than binary, most groups hold a position they can defend, which is the argument for why the system proved durable. The income option describes ordinary economic inequality, which exists in every society and would not explain why caste is treated as a distinct form of stratification.",
        difficulty: "Medium",
        skill: "Caste as graded inequality",
      },
      {
        n: 6,
        question: "Under PESA, 1996, what is the gram sabha's position when land in a Scheduled Area is to be acquired for a project?",
        options: [
          "It must be consulted before the acquisition is made",
          "Its written consent is required and the acquisition cannot proceed without it",
          "It has no role, the matter being reserved to the Tribes Advisory Council",
          "It may acquire the land itself and lease it to the project developer",
        ],
        answer: 0,
        explanation:
          "PESA requires consultation with the gram sabha before acquisition, which is a right to be heard and not a veto over the decision. The consent option is attractive because consent requirements do exist in Indian land law, but they come from the acquisition statute of 2013 in defined situations rather than from PESA, and mixing the two is the standard error in this unit.",
        difficulty: "Hard",
        skill: "Scheduled Tribes and the Fifth Schedule",
      },
      {
        n: 7,
        question: "The Samatha judgment of 1997 is cited for which proposition?",
        options: [
          "That the Fifth Schedule does not apply to mining operations",
          "That government and tribal land in a Scheduled Area cannot be leased to a non-tribal person or to a private company for mining",
          "That a Scheduled Tribe certificate issued in one state is valid in every other state",
          "That the Tribes Advisory Council may veto a state law applying to a Scheduled Area",
        ],
        answer: 1,
        explanation:
          "The judgment read the transfer prohibition as covering leases of Scheduled Area land, including by the government, to non-tribals and to companies for mining, which is why it is the strongest of the land protections. The option about the Fifth Schedule not applying to mining is the inversion of the holding, and it attracts candidates who remember only that the case was about mining leases.",
        difficulty: "Hard",
        skill: "Land alienation in Scheduled Areas",
      },
      {
        n: 8,
        question: "Komaram Bheem is remembered chiefly in connection with:",
        options: [
          "The Adi Hindu movement in the city of Hyderabad",
          "Gond resistance in the Adilabad forest tracts in the 1930s, associated with the demand summarised as jal, jangal, zameen",
          "The formation of a regional political party after the 1969 agitation",
          "The drafting of the land transfer regulation for the Scheduled Areas",
        ],
        answer: 1,
        explanation:
          "He led Gond resistance in the Adilabad forests against the administration of the time over rights to cultivate and to use forest land, and the phrase jal, jangal, zameen, meaning water, forest and land, is the demand attached to his memory. The Adi Hindu option belongs to a different strand entirely, the urban movement against untouchability, which ran in the same decades and is examined in the reform movements topic.",
        difficulty: "Medium",
        skill: "Tribal assertion and forest rights",
      },
    ],
  },
  30223: {
    topicId: 30223,
    title: "1971 to 2001: Six Point Formula, GO 610 and political churn",
    summary:
      "The three decades in which the grievance moved from agitation into administrative law and then stalled there, which is why this period is examined through documents rather than through events. You learn the Six Point Formula, the constitutional provision and the Presidential Order that carried it, the government order of 1985 that tried to enforce it, and the political changes that carried the demand back into public life in the 1990s.",
    concepts: [
      "Jai Andhra agitation and the Mulki judgment",
      "Six Point Formula and Article 371D",
      "Presidential Order and local cadres",
      "GO 610 and its implementation",
      "Political churn of the 1980s",
      "Revival of the statehood demand in the 1990s",
    ],
    glossary: {
      "Six Point Formula":
        "The settlement announced in September 1973 and accepted by leaders of both regions, which replaced the Mulki rules and the Regional Committee with an employment scheme based on local areas, a service tribunal, a planning arrangement for backward areas and a central university.",
      "Article 371D":
        "The special provision for this state inserted by the Thirty-second Amendment, which empowers the President to provide by order for equitable opportunities in public employment and education for people of different parts of the state, to organise local cadres and to establish an Administrative Tribunal.",
      "Local cadre":
        "A unit of the public service defined by area rather than by department, so that a post belongs to a district, a zone or the state as a whole. Recruitment, seniority and posting are then worked within that unit, which is what makes an area based entitlement enforceable at all.",
      "Local candidate":
        "A person who satisfies the study or residence test laid down in the Presidential Order for the area concerned, the usual test being four consecutive academic years of study in the local area ending with the qualifying examination, with a residence test where there has been no such study.",
      "GO 610":
        "Government Order Ms No. 610 of 30 December 1985, which directed that employees appointed or posted in breach of the Presidential Order be repatriated to their own local areas and the resulting vacancies filled by local candidates.",
      "Girglani Commission":
        "The one-man commission appointed in 2001 under J M Girglani to examine how far the Presidential Order and GO 610 had been implemented. It reported in 2004 and its finding of continuing non-compliance became a central document of the later movement.",
    },
    body: {
      Beginner: `<p>The previous period ended with an agitation in Telangana and a political settlement. This period begins with an agitation on the other side, and it ends with the demand for a separate state coming back after thirty years.</p>
<h2>The Andhra agitation of 1972</h2>
<p>The Mulki rules, which reserved government posts for local people, had been in dispute for years. In October 1972 the Supreme Court held that those rules were valid and still in force. That decision alarmed people in the coastal Andhra and Rayalaseema regions, who feared losing access to posts in the capital, and an agitation began there demanding a separate Andhra state. It is remembered as the Jai Andhra agitation. The state government could not continue, and the state was placed under President's rule in January 1973.</p>
<h2>The Six Point Formula</h2>
<p>In September 1973 leaders of both regions accepted a settlement of six points. The Mulki rules were to go, and so was the Telangana Regional Committee. In their place came a different idea. Instead of protecting one region, the state would be divided into <strong>local areas</strong> for the purpose of government jobs, and each area would keep most of its own recruitment for candidates who had studied there.</p>
<p>To give this legal force, Parliament amended the Constitution in 1973 and inserted <strong>Article 371D</strong>. The President then issued an order in 1975 setting out the local areas, defining who counted as a local candidate, and fixing the share of posts reserved for them. A separate tribunal was created to hear service complaints, and a central university was set up at Hyderabad.</p>
<h2>GO 610</h2>
<p>Complaints continued that people who were not local were being appointed and posted in Telangana areas anyway. A commission looked at this and, on 30 December 1985, the state government issued <strong>Government Order Ms No. 610</strong>. It directed that employees appointed or posted in breach of the Presidential Order be sent back to their own areas and the posts filled by local candidates. Very little of this was carried out, and the number 610 became shorthand for a promise not kept.</p>
<h2>The demand returns</h2>
<p>Through the 1980s and 1990s the politics of the state changed a great deal, and Hyderabad grew rapidly as a business and technology centre. Organisations in Telangana argued that the growth stayed in the capital while the interior districts did not share it. In 2000 three new states were created elsewhere in India without any language reason, which showed that a new state did not need a linguistic case. In 2001 a fresh commission was appointed to examine how far the Presidential Order had been implemented, and a new regional party was formed. The next unit takes up what followed.</p>`,
      Intermediate: `<p>Paper-IV Section-II covers this period. The questions are documentary, as in the previous section, but the documents are now administrative rather than political: an amendment, a presidential order, a government order and a commission report. Learn what each instrument does before you learn what happened around it.</p>
<h2>The chain of events</h2>
<ol>
<li><strong>October 1972.</strong> The Supreme Court holds the Mulki rules valid and in force, reversing the assumption on which appointments had been made.</li>
<li><strong>Late 1972 into 1973.</strong> The Jai Andhra agitation in the coastal Andhra and Rayalaseema regions demands a separate Andhra state. The Chief Minister resigns and President's rule is imposed in January 1973.</li>
<li><strong>September 1973.</strong> The Six Point Formula is announced and accepted by leaders of both regions. The Mulki rules are repealed by an Act of Parliament and the Regional Committee goes with them.</li>
<li><strong>1973 and 1974.</strong> The Constitution (Thirty-second Amendment) Act inserts Articles 371D and 371E, and comes into force in 1974. Article 371E provides for a central university, which is established at Hyderabad.</li>
<li><strong>1975.</strong> The Presidential Order on public employment organises local cadres, defines the local candidate and fixes the share of direct recruitment reserved for local candidates. The Administrative Tribunal for service matters follows.</li>
<li><strong>1985.</strong> A one-man commission under Jayabharat Reddy examines the working of the Order and finds appointments made in breach of it. GO Ms No. 610 is issued on 30 December 1985.</li>
<li><strong>2001.</strong> The Girglani Commission is appointed to examine implementation of the Order and of GO 610, and reports in 2004.</li>
</ol>
<h2>What the Six Point Formula actually contained</h2>
<ul>
<li>Accelerated development of the backward areas of the state through a planning arrangement, with a board for the purpose.</li>
<li>Preference to local candidates in admission to educational institutions, and the organisation of public employment into local cadres with a defined share of direct recruitment reserved for local candidates.</li>
<li>An Administrative Tribunal with jurisdiction over service matters, so that a grievance about the scheme had a forum, which the previous settlement had lacked.</li>
<li>Abolition of the Mulki rules and of the Regional Committee, the two institutions inherited from 1956.</li>
<li>A constitutional amendment to place the scheme beyond ordinary challenge, and a central university in the state.</li>
</ul>
<h2>How the Presidential Order works</h2>
<p>This is the part candidates skip, and it decides several questions. The Order divides the state into local areas: districts for some categories of post and zones for others, with the state as the unit for the highest categories. A <strong>local candidate</strong> is defined by four consecutive academic years of study in the local area ending with the qualifying examination, with a residence test applied where there has been no such study. A stated share of direct recruitment in each local cadre, eighty per cent as originally fixed for the categories covered, goes to local candidates. Note the reach: the entitlement attaches to <strong>direct recruitment</strong>, and the Order regulates transfer, deputation and posting far less tightly. That gap is where the later disputes lived.</p>
<h2>Political churn</h2>
<p>The period covers a rapid turnover of governments and the arrival of a state based party. The Telugu Desam Party was founded in 1982 and formed the government after the election of January 1983. The dismissal of that government by the Governor in August 1984 and its restoration a month later is examined as an episode in the use of the Governor's power. The state Legislative Council was abolished with effect from 1985 under Article 169, and revived only in 2007. GO 610 was issued by the government of the day at the end of 1985.</p>
<h2>Why the demand revived</h2>
<p>Three strands are usually identified. First, the record of non-implementation, which the Girglani Commission was appointed to examine. Second, the pattern of growth in the 1990s, with Hyderabad developing rapidly as a services and information technology centre while organisations in the interior districts argued that the gains did not travel outward. Third, the creation of Chhattisgarh, Uttaranchal, now Uttarakhand, and Jharkhand in 2000, which showed that a new state could be formed without a linguistic case and removed an argument that had been used against the demand since 1956.</p>`,
      Advanced: `<p>The examiner's questions in this section are about mechanism. Why did a settlement with a constitutional amendment behind it work no better than a political understanding had? Answer that properly and the descriptive questions in this section are all answerable from the same material.</p>
<h2>Four defects that made the scheme leak</h2>
<ol>
<li><strong>It covered recruitment, not the service.</strong> The entitlement attaches to direct recruitment into a local cadre. Once a person is inside the service, transfer, deputation, promotion and posting move them, and those movements were governed far more loosely. A large part of what was later alleged as violation happened this way rather than at the point of appointment.</li>
<li><strong>The unit of the cadre could be enlarged.</strong> Whether a post sits in a district cadre, a zonal cadre or the state cadre determines who may compete for it. Reclassifying a category upward moves it out of the local pool without breaking any rule, so the classification itself became contested.</li>
<li><strong>The test is documentary.</strong> A local candidate proves the claim by a study certificate, and a certificate is issued by an administration. A rule enforced through documents produces disputes about documents rather than about the rule.</li>
<li><strong>The remedy was individual.</strong> The Administrative Tribunal hears the case of an aggrieved person. It was not designed to audit whether an entire cadre had been filled correctly, which is why a separate commission had to be appointed in 2001 to do exactly that.</li>
</ol>
<h2>The instruments, kept apart</h2>
<p>Candidates blur four things that are separate. The <strong>Six Point Formula</strong> is a political agreement of 1973. <strong>Article 371D</strong> is the constitutional provision that authorises presidential orders on employment and education and the tribunal. The <strong>Presidential Order of 1975</strong> is the instrument that actually creates local cadres and the local candidate test. <strong>GO 610</strong> is an executive order of the state government of 1985 directing repatriation of employees appointed or posted in breach of that Order. An option that makes GO 610 a constitutional provision, or the Formula an enactment, is wrong on status alone, and status is the easiest half mark in this section.</p>
<h2>Writing the contested parts</h2>
<p>Two claims in this period carry political weight and should be attributed rather than asserted. The first is the extent of non-implementation. Write that the Girglani Commission, appointed by the state government itself, reported continuing non-compliance in specified departments and cadres, that movement organisations treated the report as vindication, and that the state government of the day contested particular findings and cited administrative difficulty. The second is the reading of Hyderabad's growth. Write that organisations in the Telangana districts argued the gains of the 1990s concentrated in the capital, that others argued the capital's growth drew investment and employment from across the state, and that both positions were made in public. Neither sentence takes a side, and each is defensible from the record.</p>
<h2>Marginal marks</h2>
<ul>
<li>The 1972 trigger is a judgment upholding the Mulki rules, not their repeal. The repeal came the next year as part of the settlement.</li>
<li>Articles 371D and 371E are different: employment and education under the first, a central university under the second.</li>
<li>GO 610 is dated 30 December 1985. Candidates place it in 1969 or in 1975 because it feels like part of either settlement.</li>
<li>The Girglani Commission was appointed in 2001 and reported in 2004. Do not confuse it with the enquiry of 1969 into the surplus, which was a different question in a different period.</li>
<li>The Six Point Formula abolished the Regional Committee. A candidate who writes that the Committee continued into the 1980s has lost the logic of the whole section, since the absence of a regional forum is the reason the grievance had to travel through the Presidential Order.</li>
</ul>
<h2>Answer plan for a fifteen mark question</h2>
<p>Open with the 1972 judgment as the trigger and the Jai Andhra agitation as the response. Set out the Formula as five substantive points. Take the amendment, the Order and the Tribunal as the legal machinery in one paragraph. Give GO 610 its date and its direction. Then use the four defects above as your analytical section. Close with the Girglani appointment and the three strands of revival, which is the hinge into the next period.</p>`,
      Expert: `<h2>Sequence</h2>
<table>
<tr><td><strong>October 1972</strong></td><td>Supreme Court upholds the validity of the Mulki rules</td></tr>
<tr><td><strong>1972 to 1973</strong></td><td>Jai Andhra agitation; President's rule from January 1973</td></tr>
<tr><td><strong>September 1973</strong></td><td>Six Point Formula accepted; Mulki rules repealed by Act of Parliament</td></tr>
<tr><td><strong>1973, in force 1974</strong></td><td>Thirty-second Amendment inserts Articles 371D and 371E</td></tr>
<tr><td><strong>1974</strong></td><td>Central university established at Hyderabad under Article 371E</td></tr>
<tr><td><strong>1975</strong></td><td>Presidential Order on local cadres and direct recruitment; Administrative Tribunal follows</td></tr>
<tr><td><strong>1982 and 1983</strong></td><td>A state based party is founded and forms the government</td></tr>
<tr><td><strong>August 1984</strong></td><td>Government dismissed by the Governor and restored a month later</td></tr>
<tr><td><strong>1985</strong></td><td>Legislative Council abolished under Article 169; Jayabharat Reddy commission reports</td></tr>
<tr><td><strong>30 December 1985</strong></td><td>GO Ms No. 610 issued</td></tr>
<tr><td><strong>2000</strong></td><td>Chhattisgarh, Uttaranchal and Jharkhand created without a linguistic basis</td></tr>
<tr><td><strong>2001</strong></td><td>Girglani Commission appointed; it reports in 2004</td></tr>
</table>
<h2>Status of each instrument</h2>
<table>
<tr><th>Instrument</th><th>Status</th><th>What it does</th></tr>
<tr><td>Six Point Formula</td><td>Political agreement, 1973</td><td>Sets the scheme, abolishes Mulki rules and Regional Committee</td></tr>
<tr><td>Article 371D</td><td>Constitutional provision</td><td>Authorises presidential orders and the Administrative Tribunal</td></tr>
<tr><td>Presidential Order, 1975</td><td>Order under Article 371D</td><td>Local areas, local candidate test, share of direct recruitment</td></tr>
<tr><td>GO 610, 1985</td><td>State executive order</td><td>Repatriation of employees appointed or posted in breach</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>1972 is a judgment upholding the Mulki rules. 1973 is their repeal. Do not reverse them.</li>
<li>371D employment and education, 371E central university. One letter, two subjects.</li>
<li>The Order protects direct recruitment. Transfer and deputation are the leak.</li>
<li>GO 610: 30 December 1985, repatriation, largely not carried out.</li>
<li>Girglani appointed 2001, reported 2004, on implementation. Bhargava 1969, on the surplus.</li>
<li>The 2000 states removed the linguistic argument. That is why they matter to this syllabus.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question: "What triggered the Jai Andhra agitation of 1972 and 1973?",
        options: [
          "The issue of Government Order Ms No. 610",
          "The Supreme Court judgment of October 1972 holding the Mulki rules valid and in force",
          "The insertion of Article 371D into the Constitution",
          "The abolition of the Telangana Regional Committee",
        ],
        answer: 1,
        explanation:
          "The judgment restored the Mulki rules as operative law, and the prospect of a residence based restriction on posts in the capital produced the agitation in the coastal Andhra and Rayalaseema regions. GO 610 is the strong distractor because it is the other famous document in this unit, but it was issued in December 1985, more than a decade later, and it moved in the opposite direction.",
        difficulty: "Medium",
        skill: "Jai Andhra agitation and the Mulki judgment",
      },
      {
        n: 2,
        question: "Article 371D, inserted by the Thirty-second Amendment, empowers the President to do which of the following?",
        options: [
          "Establish a central university in the state",
          "Constitute a Regional Committee of legislators for the Telangana region",
          "Provide for equitable opportunities in public employment and education by organising local cadres, and to establish an Administrative Tribunal",
          "Reserve seats in the state legislative assembly for candidates from backward areas",
        ],
        answer: 2,
        explanation:
          "Article 371D is the employment and education provision, and it is the authority for both the Presidential Order on local cadres and the service tribunal. The central university option is the designed trap, because that provision does exist but it is Article 371E, inserted by the same amendment, and pairing the right amendment with the wrong article is the commonest way to lose this mark.",
        difficulty: "Medium",
        skill: "Six Point Formula and Article 371D",
      },
      {
        n: 3,
        question: "Which of the following was NOT part of the Six Point Formula of 1973?",
        options: [
          "Abolition of the Mulki rules",
          "Abolition of the Telangana Regional Committee",
          "An Administrative Tribunal for service matters",
          "A separate High Court for the Telangana region",
        ],
        answer: 3,
        explanation:
          "The Formula abolished the two institutions inherited from 1956 and created a tribunal and a local cadre scheme in their place, but it said nothing about a separate High Court. That option is attractive because a separate High Court for Telangana does exist, and candidates who know that fact place it in the wrong decade, since it came only in 2019 after the state was formed.",
        difficulty: "Easy",
        skill: "Six Point Formula and Article 371D",
      },
      {
        n: 4,
        question: "What did Government Order Ms No. 610 of 30 December 1985 direct?",
        options: [
          "That all posts in the city of Hyderabad be reserved for candidates from the Telangana region",
          "That employees appointed or posted in breach of the Presidential Order be repatriated to their own local areas and the resulting vacancies filled by local candidates",
          "That the Mulki rules be revived for the Telangana districts",
          "That a Regional Development Board be constituted for each region of the state",
        ],
        answer: 1,
        explanation:
          "The order was corrective rather than fresh policy: it accepted that appointments and postings had been made in breach of the Presidential Order and directed repatriation and replacement by local candidates. The option about reserving all posts in Hyderabad is attractive because the capital was the focus of the dispute, but the Order works through local cadres and shares of direct recruitment, not through a blanket reservation of a city.",
        difficulty: "Medium",
        skill: "GO 610 and its implementation",
      },
      {
        n: 5,
        question: "Under the Presidential Order of 1975, the entitlement of a local candidate attaches principally to:",
        options: [
          "Direct recruitment to specified categories of posts within a local cadre",
          "Every appointment, promotion, transfer and deputation within the state service",
          "Admission to professional educational institutions alone",
          "Posts in the secretariat departments at the state capital alone",
        ],
        answer: 0,
        explanation:
          "The Order organises local cadres and reserves a share of direct recruitment within them for candidates who satisfy the study or residence test. The second option is the instructive wrong answer, because a great deal of what was later alleged as violation happened through transfer, deputation and posting, which the Order regulates far less tightly, and that gap is the reason a commission on implementation had to be appointed at all.",
        difficulty: "Hard",
        skill: "Presidential Order and local cadres",
      },
      {
        n: 6,
        question: "The commission appointed in 2001 under J M Girglani was asked to examine:",
        options: [
          "The amount of the Telangana surplus revenues",
          "The implementation of the Presidential Order on public employment and of GO 610",
          "The sharing of Krishna and Godavari waters between the regions",
          "The redrawing of zones following the creation of new districts",
        ],
        answer: 1,
        explanation:
          "Its subject was compliance, that is how far the local cadre scheme and the repatriation order of 1985 had actually been carried out, and it reported in 2004 that non-compliance continued in specified departments. The surplus option belongs to the earlier period, when a 1969 enquiry was appointed to measure the surplus, and mixing the two enquiries is the usual error in this section.",
        difficulty: "Hard",
        skill: "GO 610 and its implementation",
      },
      {
        n: 7,
        question: "Why did the creation of Chhattisgarh, Uttaranchal and Jharkhand in 2000 matter to the Telangana demand?",
        options: [
          "Because those states were created by referendum, which set a precedent for holding one here",
          "Because they were carved out of larger states without any linguistic basis, which removed the argument that reorganisation must follow language",
          "Because Parliament amended Article 3 in order to create them",
          "Because each of them was given a special provision on the model of Article 371D",
        ],
        answer: 1,
        explanation:
          "All three were formed within a single language area, so the reorganisation principle of 1956 was no longer the only basis on which a state could be made, and that removed a standing objection to the Telangana demand. The referendum option is wrong on the facts, since each was created by an ordinary Act of Parliament under Article 3 with no popular vote, and that is precisely the procedure the next period turns on.",
        difficulty: "Medium",
        skill: "Revival of the statehood demand in the 1990s",
      },
    ],
  },
};

export default PART;
