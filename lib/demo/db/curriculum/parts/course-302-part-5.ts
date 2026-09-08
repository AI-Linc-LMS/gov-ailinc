/**
 * Course 302: TGPSC Group-II & Group-III Foundation - part 5.
 *
 * Topics 30215, 30216, 30223 and 30224: the closing topic of the Constitution
 * and polity module, the opening topic of the society and public policy module,
 * and the second and third periods of the Telangana movement paper.
 *
 * Content rule for this course: syllabus structure, institutions and the
 * sequence of events are stable and safe to teach. Vacancy counts, cut-offs,
 * fees and year-specific figures are not, and none appear here. Where a
 * political characterisation is contested, the text states what happened and
 * attributes the characterisation rather than asserting it.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30215: {
    topicId: 30215,
    title: "Constitutional and statutory bodies you are asked about",
    summary:
      "The bodies the Constitution creates and the bodies an ordinary Act creates, taken as one unit because the paper builds almost every distractor by swapping one for the other. You learn the article number, who appoints and who removes, and whether what the body produces binds anybody or only advises.",
    concepts: [
      "Constitutional versus statutory bodies",
      "Election Commission of India",
      "Comptroller and Auditor General",
      "Union and State Public Service Commissions",
      "Commissions for Scheduled Castes, Scheduled Tribes and Backward Classes",
      "National Human Rights Commission and statutory watchdogs",
    ],
    glossary: {
      "Constitutional body":
        "A body created by the text of the Constitution itself. Its existence, composition or powers can be altered only by amending the Constitution, so an ordinary law cannot abolish it or take its function away.",
      "Statutory body":
        "A body created by an Act of a legislature. The same legislature can widen it, narrow it or wind it up by passing another Act, which is the practical difference from a constitutional body.",
      "Charged expenditure":
        "Expenditure that the Constitution charges on the Consolidated Fund. It may be discussed in the legislature but it is not put to a vote, which is how the salaries of the Comptroller and Auditor General and of judges are placed beyond a hostile vote.",
      "Proved misbehaviour":
        "The ground on which a judge of the Supreme Court, and by extension the Chief Election Commissioner and the Comptroller and Auditor General, may be removed. It requires a motion in each House, an enquiry and a special majority, so it is not an executive dismissal.",
      "Recommendatory power":
        "The power to enquire, report and advise without the power to compel obedience. A recommendation can still bite through publicity, through a report laid before a legislature and through a court that later relies on it.",
      "Model Code of Conduct":
        "The set of norms the Election Commission applies from the announcement of a poll until the result is declared. It was never enacted as a statute, so its force comes from the Commission's constitutional power over the conduct of the election.",
    },
    body: {
      Beginner: `<p>The Constitution does not only describe Parliament, the courts and the council of ministers. It also sets up a number of standing bodies with one job each: running elections, auditing public money, recruiting officers, and speaking for groups the Constitution names. This topic covers those, and the similar bodies that were created later by ordinary law.</p>
<h2>Two kinds of body, and a third</h2>
<p>A <strong>constitutional body</strong> is one the Constitution itself creates. The Election Commission, the Comptroller and Auditor General, the Public Service Commissions and the Finance Commission are examples. Parliament cannot abolish any of them by passing an ordinary law, because their existence is written into the Constitution.</p>
<p>A <strong>statutory body</strong> is created by an Act of a legislature. The National Human Rights Commission, the Central Information Commission and the Lokpal are examples. The legislature made them, and the same legislature can alter or end them by passing another Act.</p>
<p>There is a third kind, set up by a government resolution alone, with neither the Constitution nor an Act behind it. Working out which of the three a body belongs to answers a surprising share of the questions in this unit.</p>
<h2>The Election Commission</h2>
<p>Article 324 places elections to Parliament, to the state legislatures and to the offices of President and Vice-President with the Election Commission of India. Notice what is not on that list. Elections to a panchayat or a municipality are conducted by the <strong>State Election Commission</strong>, a separate body created by Articles 243K and 243ZA. Treating the two as one is the most common error here, and it is the error the paper is looking for.</p>
<h2>The Comptroller and Auditor General</h2>
<p>Article 148 creates the Comptroller and Auditor General, the officer who audits the accounts of the union and of every state. The work is checking that money was spent in the way the legislature permitted. Reports on union accounts go to the President, who lays them before Parliament. Reports on a state go to the Governor, who lays them before the state legislature. A committee of legislators called the Public Accounts Committee then examines what the reports found.</p>
<h2>The Public Service Commissions</h2>
<p>Articles 315 to 323 create the Union Public Service Commission and a Public Service Commission for each state. The commission that will conduct the examination you are preparing for is one of these. It recruits, and it advises the government on service matters such as promotions and disciplinary cases. That advice is advice: a government may depart from it, but it must then explain the departure in a report placed before the legislature. That obligation to explain is the safeguard, and it is examinable.</p>`,
      Intermediate: `<p>This unit is set as recall with a discrimination built into it. The paper seldom asks what a body does. It asks which article creates it, who appoints and who removes its head, whether its output binds anyone, and whether the body is constitutional, statutory or merely executive. Prepare it as four columns rather than as a set of descriptions.</p>
<h2>The classification that answers half the questions</h2>
<ul>
<li><strong>Constitutional.</strong> Election Commission (324), Comptroller and Auditor General (148), Union and State Public Service Commissions (315 to 323), Finance Commission (280), State Election Commission (243K), State Finance Commission (243-I), National Commissions for Scheduled Castes (338), Scheduled Tribes (338A) and Backward Classes (338B), Special Officer for Linguistic Minorities (350B), Attorney General (76), Advocate General of a state (165), Inter-State Council (263), Goods and Services Tax Council (279A).</li>
<li><strong>Statutory.</strong> The National Human Rights Commission and the State Human Rights Commissions under the Protection of Human Rights Act, 1993; the Central and State Information Commissions under the Right to Information Act, 2005; the Lokpal and the Lokayuktas under the Act of 2013; the Central Vigilance Commission, which ran as an executive body from 1964 and was given statutory footing in 2003; the National Commission for Women, 1990; the National Commission for Protection of Child Rights, 2005.</li>
<li><strong>Executive.</strong> Bodies created by a resolution of the government with neither the Constitution nor an Act behind them. The category exists mainly so that you do not put a policy think tank in the constitutional column.</li>
</ul>
<h2>Election Commission of India</h2>
<p>Article 324 vests superintendence, direction and control of the preparation of electoral rolls and the conduct of those elections in the Commission. It consists of the Chief Election Commissioner and such number of other Election Commissioners as the President may from time to time fix, and it has functioned as a multi-member body since 1993, deciding by majority where the members differ.</p>
<p>Security of tenure is deliberately asymmetric, and the asymmetry is examined. The Chief Election Commissioner may be removed only in the same manner and on the same grounds as a judge of the Supreme Court. Any other Election Commissioner is removed by the President on the recommendation of the Chief Election Commissioner. The method of appointment has itself been altered by law, so read the statute currently in force rather than a handout printed some years ago.</p>
<p>Two further points recur. The Model Code of Conduct is not an enactment; it runs from the announcement of a poll to the declaration of the result and draws its force from the Commission's power over the conduct of the election. And the Commission does not conduct local body elections, which belong to the State Election Commission appointed by the Governor.</p>
<h2>Comptroller and Auditor General</h2>
<p>Appointed by the President under Article 148, the Comptroller and Auditor General holds office for six years or until the age of sixty five, whichever comes first, is removable only in the manner of a Supreme Court judge, and is barred afterwards from any further office under the union or a state. The salary is charged on the Consolidated Fund and is therefore not put to a vote. Article 149 leaves the duties to be prescribed by Parliament, and Article 151 fixes the route the reports take.</p>
<p>The title misleads. In Britain the Comptroller controls the issue of money from the exchequer. In India there is no such control: money leaves the Consolidated Fund on executive authority and the Comptroller and Auditor General arrives afterwards, as an auditor. The separation of accounts from audit was completed in 1976, so the office now audits accounts that others keep.</p>
<h2>Public Service Commissions</h2>
<p>A member of the Union Public Service Commission holds office for six years or until sixty five; a member of a State Public Service Commission for six years or until sixty two. The chairman and members of a State Commission are appointed by the Governor, but they can be removed only by the President, on the ground of misbehaviour, after a reference to the Supreme Court and an enquiry by it. Article 323 requires an annual report, and every case in which the Commission's advice was not accepted must be explained in a memorandum laid before the legislature.</p>`,
      Advanced: `<p>You already hold the list. What separates a repeat attempter here is four distinctions the paper mines for distractors: appointment against removal, advice against direction, jurisdiction that has been carved out, and constitutional status against practical power.</p>
<h2>Appointment and removal do not travel together</h2>
<p>The examiner's favourite pairing in this unit is a State Public Service Commission member: appointed by the Governor, removable only by the President after a Supreme Court enquiry. The Governor may suspend a member pending that enquiry but cannot remove one. An option that has the Governor removing the member is wrong even though the Governor appointed them, and it is attractive precisely because the appointment half is right.</p>
<p>The same shape recurs elsewhere. An Election Commissioner other than the Chief is removed by the President, but only on the Chief Election Commissioner's recommendation, so the President acting alone is wrong. A judge of a High Court is appointed by the President but removed only through the parliamentary address route. Store each office as a pair, never as a single fact.</p>
<h2>Advice, direction and report</h2>
<p>Three different outputs get confused. A <strong>recommendation</strong> can be departed from, with or without an obligation to explain. A <strong>direction</strong> must be obeyed. A <strong>report</strong> is a finding that then travels to a legislature. The Public Service Commission recommends and the government must explain a departure. The Election Commission directs, and its directions during an election are enforceable. The Comptroller and Auditor General neither recommends nor directs; it reports, and the Public Accounts Committee does the pressing. The National Human Rights Commission enquires and recommends, including interim relief and prosecution, but it cannot itself punish or award compensation as a court would.</p>
<h2>Jurisdiction that is carved out</h2>
<ul>
<li>The National Human Rights Commission ordinarily will not entertain a complaint about an event more than a year old. In respect of the armed forces its power is limited to calling for a report from the central government and then making recommendations, on which the government must report back the action taken.</li>
<li>A State Human Rights Commission cannot enquire into a matter already enquired into by the national commission. Duplication is barred, which is a favourite two statement question.</li>
<li>Under the Right to Information Act, the security and intelligence organisations listed in the Second Schedule are exempt, with the important exception of information on allegations of corruption and human rights violations.</li>
<li>The proviso to Article 320(3) allows matters to be excluded from consultation with the Public Service Commission by regulation, and consultation is not required in respect of reservations for backward classes.</li>
</ul>
<h2>The Article 338 family, stated precisely</h2>
<p>Article 338 carries the National Commission for Scheduled Castes. Article 338A was inserted by the 89th Amendment in 2003, splitting a single earlier commission into separate bodies for Scheduled Castes and Scheduled Tribes. Article 338B was inserted by the 102nd Amendment in 2018, which gave the National Commission for Backward Classes constitutional status and also inserted Article 342A and Article 366(26C). The 105th Amendment in 2021 restored the power of a state to prepare and maintain its own list of socially and educationally backward classes. Article 338(10) extends the Scheduled Castes commission's remit, for the purposes of that article, to the Anglo-Indian community. Each of these commissions has the powers of a civil court while investigating and reports annually to the President.</p>
<h2>What examiners do with the Finance Commission</h2>
<p>Keep the institutional facts separate from the devolution formula, which belongs to the economy paper. Under Article 280 the President constitutes it every fifth year or earlier, Parliament prescribes the qualifications of its members, its recommendations are advisory, and they are laid before each House with a memorandum on the action taken. Its counterpart at the state level is the State Finance Commission constituted by the Governor under Article 243-I for the panchayats and under Article 243Y for the municipalities. A question that offers a planning or policy body as the constitutional recommender of tax devolution is testing whether you can tell a constitutional body from an executive one.</p>`,
      Expert: `<h2>One table, four columns</h2>
<table>
<tr><th>Body</th><th>Source</th><th>Head appointed by</th><th>Head removed by</th></tr>
<tr><td>Election Commission</td><td>Article 324</td><td>President, under the law in force</td><td>Chief only, as a Supreme Court judge</td></tr>
<tr><td>State Election Commission</td><td>Article 243K</td><td>Governor</td><td>As a High Court judge</td></tr>
<tr><td>Comptroller and Auditor General</td><td>Article 148</td><td>President</td><td>As a Supreme Court judge</td></tr>
<tr><td>Union Public Service Commission</td><td>Article 316</td><td>President</td><td>President, after Supreme Court enquiry</td></tr>
<tr><td>State Public Service Commission</td><td>Article 316</td><td>Governor</td><td>President, after Supreme Court enquiry</td></tr>
<tr><td>Finance Commission</td><td>Article 280</td><td>President, every fifth year or earlier</td><td>Term expires with the report</td></tr>
<tr><td>National Human Rights Commission</td><td>Act of 1993</td><td>President, on a selection committee's recommendation</td><td>President, on Supreme Court enquiry</td></tr>
</table>
<h2>Two line rules</h2>
<ul>
<li>Panchayat or municipal poll means State Election Commission, never the Election Commission of India.</li>
<li>State Public Service Commission: Governor appoints, President removes. Governor may only suspend.</li>
<li>The Comptroller and Auditor General audits after the fact and controls no issue of money. Auditor, not comptroller.</li>
<li>Human Rights Commission, Information Commission, Lokpal, Vigilance Commission, Commission for Women: all statutory.</li>
<li>338 Scheduled Castes, 338A Scheduled Tribes by the 89th Amendment, 338B Backward Classes by the 102nd.</li>
<li>Model Code of Conduct is not a statute. It runs from announcement of the poll to declaration of the result.</li>
</ul>
<h2>Edge cases that surface every few cycles</h2>
<ul>
<li>Article 76 Attorney General: right to speak in either House and its committees, no vote, holds office during the pleasure of the President, may take private practice but may not advise against the Government of India.</li>
<li>Article 350B Special Officer for Linguistic Minorities, inserted by the 7th Amendment in 1956, appointed by the President.</li>
<li>Article 263 Inter-State Council: the Constitution permits it, a presidential order established it in 1990 on the Sarkaria Commission's recommendation.</li>
<li>Article 279A Goods and Services Tax Council, inserted by the 101st Amendment in 2016, chaired by the Union Finance Minister.</li>
<li>The Central Vigilance Commission began in 1964 on the Santhanam Committee's recommendation and became statutory only in 2003. It is the standard example of a body changing category.</li>
<li>A retiring Comptroller and Auditor General is barred from further office under the union or a state; a retiring State Public Service Commission chairman may still go to the Union Public Service Commission.</li>
</ul>
<h2>Final week drill</h2>
<p>Reproduce the table above from memory, then add a fifth column for what the body produces: a direction, a recommendation or a report. Any row where you hesitate over the fifth column is a row the paper can take a mark from, because the distractors in this unit are written by moving one word between those three.</p>`,
    },
    questions: [
      {
        n: 1,
        question: "Elections to a municipal corporation in Telangana are conducted by which authority?",
        options: [
          "The Election Commission of India under Article 324",
          "The State Election Commission under Articles 243K and 243ZA",
          "The Municipal Administration department of the state government",
          "The Governor, acting on the advice of the council of ministers",
        ],
        answer: 1,
        explanation:
          "Superintendence of panchayat and municipal elections rests with the State Election Commission created by Articles 243K and 243ZA, whose commissioner is appointed by the Governor. The Election Commission of India is the attractive wrong answer because it is the body everyone associates with elections, but Article 324 confines it to Parliament, the state legislatures and the offices of President and Vice-President.",
        difficulty: "Easy",
        skill: "Election Commission of India",
      },
      {
        n: 2,
        question: "How may a member of a State Public Service Commission be removed from office?",
        options: [
          "By the Governor who appointed the member, on the advice of the council of ministers",
          "By a resolution of the state legislative assembly passed by a special majority",
          "By the President, on the ground of misbehaviour, after an enquiry by the Supreme Court",
          "By the chairman of the Union Public Service Commission after a departmental enquiry",
        ],
        answer: 2,
        explanation:
          "Appointment and removal are deliberately split: the Governor appoints, but only the President can remove, and only for misbehaviour after the matter has been referred to and enquired into by the Supreme Court. The Governor option is tempting because the Governor made the appointment and may also suspend a member pending the enquiry, but suspension is not removal and the removal power was placed outside the state on purpose.",
        difficulty: "Medium",
        skill: "Union and State Public Service Commissions",
      },
      {
        n: 3,
        question: "Why is the Comptroller and Auditor General described as an auditor rather than a comptroller in the Indian arrangement?",
        options: [
          "Because the office has no control over the issue of money from the Consolidated Fund and examines expenditure only after it has been incurred",
          "Because it audits only state accounts and not union accounts",
          "Because its reports go to the executive and are never placed before a legislature",
          "Because it maintains the accounts of every department and therefore cannot audit them",
        ],
        answer: 0,
        explanation:
          "Money leaves the Consolidated Fund on executive authority, and the office comes afterwards to test whether it was spent as the legislature permitted, which is auditing and not controlling. The option about maintaining accounts is attractive because that was once part of the work, but the separation of accounts from audit was completed in 1976, and in any case keeping accounts would be a reason to call the office an accountant rather than an auditor.",
        difficulty: "Medium",
        skill: "Comptroller and Auditor General",
      },
      {
        n: 4,
        question: "Which amendment gave the National Commission for Backward Classes constitutional status, and under which article?",
        options: [
          "The 89th Amendment of 2003, under Article 338A",
          "The 102nd Amendment of 2018, under Article 338B",
          "The 105th Amendment of 2021, under Article 342A",
          "The 93rd Amendment of 2005, under Article 15(5)",
        ],
        answer: 1,
        explanation:
          "The 102nd Amendment inserted Article 338B for the Backward Classes commission and also brought in Articles 342A and 366(26C). The 89th Amendment is the strong distractor because it did exactly the same kind of thing five years earlier, but what it created under Article 338A was the separate National Commission for Scheduled Tribes.",
        difficulty: "Hard",
        skill: "Commissions for Scheduled Castes, Scheduled Tribes and Backward Classes",
      },
      {
        n: 5,
        question: "Which of the following is a statutory body and not a constitutional one?",
        options: [
          "The Finance Commission",
          "The Union Public Service Commission",
          "The Central Vigilance Commission",
          "The Special Officer for Linguistic Minorities",
        ],
        answer: 2,
        explanation:
          "The Central Vigilance Commission was set up by an executive resolution in 1964 and given a statutory footing by an Act in 2003, so it has never been a creature of the Constitution. The Special Officer for Linguistic Minorities is the tempting choice because the office is obscure and sounds administrative, but it is provided for by Article 350B, inserted by the 7th Amendment in 1956.",
        difficulty: "Medium",
        skill: "Constitutional versus statutory bodies",
      },
      {
        n: 6,
        question: "Which statement about the National Human Rights Commission is correct?",
        options: [
          "It can convict a public servant found responsible for a violation and award punishment",
          "It enquires and recommends, including interim relief and prosecution, but cannot itself punish",
          "It has no jurisdiction in any matter touching the armed forces and cannot even seek information",
          "It replaces the High Court's writ jurisdiction in matters of personal liberty",
        ],
        answer: 1,
        explanation:
          "The Commission's powers are those of a civil court while enquiring, and its output is a recommendation that the authority concerned must respond to, not a sentence. The armed forces option overstates a real limitation: the Commission's power there is confined to calling for a report from the central government and making recommendations on it, which is narrower than its ordinary power but is not an absence of jurisdiction.",
        difficulty: "Medium",
        skill: "National Human Rights Commission and statutory watchdogs",
      },
      {
        n: 7,
        question: "Which statement about the Model Code of Conduct is correct?",
        options: [
          "It is a schedule to the Representation of the People Act and is enforced by criminal prosecution alone",
          "It applies from the day the term of a House expires until a new House is constituted",
          "It is not an enactment; it operates from the announcement of a poll to the declaration of the result and rests on the Commission's power over the conduct of elections",
          "It is issued by the Union Home Ministry and the Election Commission merely monitors compliance",
        ],
        answer: 2,
        explanation:
          "The Code evolved by consensus among parties and has never been enacted, so its enforcement flows from Article 324 and from the Commission's control over the electoral process during the announced period. The first option is attractive because several electoral offences are indeed statutory, but those are separate provisions of law and are not what the Code itself is.",
        difficulty: "Hard",
        skill: "Election Commission of India",
      },
    ],
  },
};

export default PART;
