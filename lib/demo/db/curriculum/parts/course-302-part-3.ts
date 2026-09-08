/**
 * Course 302, part 3 of 3: topics 30217 to 30224.
 *
 * Covers the tail of the society and public policy module, the whole of the
 * economy and development module, and the three period topics of the Telangana
 * movement paper. Written to the paper as TGPSC actually sets it, so every
 * topic names the paper and section it belongs to and the question form it
 * takes there.
 *
 * On the movement topics: the sequence of events and the institutions are
 * stated as fact, and every characterisation of a party, a leader or a
 * government is attributed to whoever made it. That is both the honest way to
 * teach a contested period and the way the paper rewards, because the paper
 * asks what happened and when, not who was right.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30217: {
    topicId: 30217,
    title: "Welfare policy: education, health and social security",
    summary:
      "Welfare policy is the part of the society section that carries a scheme name in almost every question, so you learn the delivery architecture first and hang the schemes on it. You take education, health and social security as three systems with their own legal basis, their own field staff and their own well documented failure points.",
    concepts: [
      "Rights based welfare legislation",
      "Three tier rural health system",
      "Social insurance and social assistance",
      "Targeting versus universal provision",
      "Delivery, exclusion and leakage",
      "Residential schooling model",
    ],
    glossary: {
      "Social assistance":
        "A benefit paid from tax revenue to a person who has contributed nothing towards it, granted on the basis of a condition such as age, widowhood or disability. Old age pension is the standard example.",
      "Social insurance":
        "A benefit funded by contributions from the worker, the employer or both, drawn on when a defined risk occurs. Provident fund and employees state insurance work this way, which is why they cover formal employment and little else.",
      "Sub-centre":
        "The first contact point of the public health system in a rural area, staffed by an auxiliary nurse midwife and covering a few thousand people. It does antenatal care, immunisation and referral, not inpatient treatment.",
      Targeting:
        "Restricting a benefit to an identified group instead of offering it to everyone. It lowers the bill and creates two errors at once: eligible people wrongly left out, and ineligible people wrongly included.",
      "Exclusion error":
        "A person who satisfies the eligibility rule but does not receive the benefit, usually because of a document, a name mismatch or a list that was never updated. Distinct from a person who was never eligible.",
      "Gross enrolment ratio":
        "Enrolment at a level of schooling as a percentage of the population in the official age group for that level. It can exceed one hundred because over-age and under-age pupils are counted in the numerator but not the denominator.",
    },
    body: {
      Beginner: `<p>Welfare policy is what a government does so that a citizen who has very little is not left with nothing. In this paper it appears under three headings: schooling, health care and income support. Each has a law behind it, an office that runs it and a worker who delivers it in your village or your ward.</p>
<h2>Education</h2>
<p>The Constitution was amended in 2002 to insert Article 21A, which makes free and compulsory education for children aged six to fourteen a fundamental right. The Right of Children to Free and Compulsory Education Act, 2009 gives that right its working rules: a neighbourhood school, no child held back or expelled up to class eight, no screening at admission, and a share of seats in unaided private schools for children from weaker sections.</p>
<p>Alongside the law sit the programmes. A cooked midday meal is served in government schools, which raises attendance and is the reason many parents send a child on a day they might not have. Residential schools run by the state welfare societies take children from scheduled caste, scheduled tribe, backward class and minority families and board them for the full year, which removes the daily travel and the household work that otherwise pull a child out.</p>
<h2>Health</h2>
<p>The public health system in rural areas is built in three steps. A <strong>sub-centre</strong> serves a few thousand people and is where an auxiliary nurse midwife handles immunisation and antenatal care. A primary health centre above it has a doctor and a few beds. A community health centre above that has specialists and is the first place a surgery can happen. Beyond it lie the district hospital and the teaching hospital.</p>
<p>An accredited social health activist, called an ASHA, is a woman from the village who links households to that system. She is not a government employee on a salary; she is paid for tasks completed, and that payment design shapes what actually gets done.</p>
<h2>Income support</h2>
<p>If you work in a factory or an office, part of your wage goes into a provident fund and you are covered for medical care through employees state insurance. Most workers in India are not in such jobs, so a second system exists: monthly pensions for the aged, for widows and for persons with disability, paid from tax revenue rather than from contributions. Subsidised foodgrain through the ration shop and a hundred days of guaranteed wage work in a rural household complete the picture.</p>
<p>Learn the ladder, the law and the field worker for each of the three. Almost every question in this unit is testing one of those three things.</p>`,
      Intermediate: `<p>This topic sits in Paper-II, Section-III, social structure, issues and public policies, and it also supplies half the scheme based questions in Paper-I general studies. The examiner is not asking you to praise a scheme. The question is almost always structural: which law creates the entitlement, which tier of the administration delivers it, and which population it misses.</p>
<h2>Education: the entitlement and the machinery</h2>
<p>The Eighty-sixth Amendment, 2002 inserted Article 21A, altered Article 45 to cover early childhood care up to age six, and added the parental duty in Article 51A(k). The Right of Children to Free and Compulsory Education Act, 2009 operationalised it from April 2010 with provisions you should be able to list: neighbourhood schools within a defined distance, no capitation fee and no screening, no detention and no expulsion till class eight, a pupil teacher ratio and infrastructure norms, a School Management Committee with a parent majority, and reservation of a share of entry level seats in unaided schools with reimbursement.</p>
<p>The delivery side is an integrated centrally sponsored scheme covering pre-school to class twelve, a midday meal programme, and hostels and residential schools. Telangana runs an unusually large residential schooling network through separate societies for scheduled caste, scheduled tribe, backward class and minority students. The teaching point is that the residential model attacks a specific cause of dropout, the distance and the domestic labour claim on a child's day, rather than the classroom itself.</p>
<h2>Health: tiers, mission and insurance</h2>
<p>The rural chain runs sub-centre, primary health centre, community health centre, sub-district or area hospital, district hospital, with population norms that differ for plain and tribal areas. The National Health Mission funds the system through a state programme implementation plan and put the ASHA in place as a community level link worker on performance based incentives.</p>
<p>Two distinct instruments then sit on top. Health and wellness centres upgrade the sub-centre into a comprehensive primary care unit that also handles hypertension, diabetes and screening rather than only maternal and child health. A publicly funded health insurance scheme instead buys secondary and tertiary treatment from empanelled hospitals, including private ones, against a defined package list. Telangana has run a state health insurance scheme for listed high cost procedures since the undivided state, and it operates alongside the national scheme rather than being replaced by it.</p>
<h2>Social security: two designs that answer different questions</h2>
<p>Contributory <strong>social insurance</strong> covers formal employment through provident fund and employees state insurance. Non-contributory <strong>social assistance</strong> covers the rest through the National Social Assistance Programme, whose components are old age pension, widow pension, disability pension, a lump sum family benefit on the death of a breadwinner, and a food component. States top up the central rate, and Telangana pays its pensions as a single consolidated state scheme covering several categories.</p>
<p>Three more instruments belong in the same answer. The National Food Security Act, 2013 converts subsidised foodgrain into a legal entitlement for a defined share of the rural and urban population. The employment guarantee gives a rural household a right to a hundred days of unskilled wage work with an unemployment allowance if work is not provided. The Code on Social Security, 2020 is the attempt to extend cover to gig, platform and unorganised workers, and you should know it as an attempt whose registration and financing details are still being worked out.</p>`,
      Advanced: `<p>Repeat attempters lose marks here in a predictable way. They write the scheme name, the launch year and the objective, which is the part every candidate has, and they never reach the analytical sentence the examiner is looking for. The marks sit in the design question: why this instrument rather than the alternative, and what does the choice cost.</p>
<h2>Targeting versus universal provision</h2>
<p>Every welfare instrument makes one of two bets. A universal instrument accepts that some benefit will reach people who did not need it, in exchange for near zero exclusion and almost no administrative machinery. A targeted instrument accepts an identification exercise, and with it two errors. An <strong>exclusion error</strong> keeps out a person who qualifies. An inclusion error lets in a person who does not.</p>
<p>The point that earns marks is that the two errors are not symmetric in their consequences. An inclusion error costs money. An exclusion error costs the person the entitlement, and it falls hardest on exactly the households with the weakest documentation, the most mobility and the least ability to appeal. That is why the midday meal and the cooked meal at the anganwadi are universal within the institution, while a pension needs a list.</p>
<h2>Where each system actually breaks</h2>
<ul>
<li><strong>Education.</strong> Enrolment is close to universal at the primary stage, so enrolment statistics no longer discriminate between states. The live problems are retention at the upper primary to secondary transition, the learning level gap that annual surveys keep reporting, teacher vacancy and single teacher schools, and the fact that the no detention provision was amended in 2019 to permit a regular examination in classes five and eight with re-examination. Know that amendment; a question on it separates candidates who read the Act from candidates who read a summary of it.</li>
<li><strong>Health.</strong> Vacancies at the specialist level in community health centres, the pull of the private sector, and out of pocket expenditure that remains a large share of total health spending. On insurance, the recurring criticisms are the package rate versus actual cost, empanelment concentrated in cities, and the fact that an insurance scheme buys hospitalisation and therefore does nothing for outpatient care, which is where most household spending happens.</li>
<li><strong>Social security.</strong> Pension rates that erode in real terms unless indexed, dormant accounts, and the exclusion produced by biometric authentication failure and by name and spelling mismatches between the ration card, the bank account and the identity record.</li>
</ul>
<h2>The Telangana specific material examiners reward</h2>
<p>Use state examples rather than generic ones. The residential school societies for scheduled caste, scheduled tribe, backward class and minority students. The state health insurance scheme for listed procedures. The consolidated state pension scheme covering old age, widows, persons with disability, weavers, toddy tappers, single women and a filaria and HIV category. Urban basic health clinics in Hyderabad. Piped drinking water as a public health intervention rather than a water supply project, since the health argument is fluorosis prevention in the affected districts.</p>
<h2>Answer shape for ten marks</h2>
<ol>
<li>Name the legal basis in one line, article or Act, and get the year right.</li>
<li>Describe the delivery tier and the frontline worker, because that is the part most answers omit.</li>
<li>State one design choice and its trade-off, targeting against universality, insurance against provision, cash against kind.</li>
<li>Close with one documented weakness and one measurable indicator, not with an adjective.</li>
</ol>
<p>A caution that matters in this unit. Rates, coverage numbers and beneficiary counts are revised, and quoting a stale figure damages an answer more than omitting it. Write the mechanism, and give a number only when you are certain of it and of its year.</p>`,
      Expert: `<p>Last month drill. This is a recall sheet, not a lesson.</p>
<h2>Legal anchors, one line each</h2>
<table>
<tr><td><strong>Article 21A</strong></td><td>Free and compulsory education, ages 6 to 14, inserted by the 86th Amendment, 2002</td></tr>
<tr><td><strong>Article 45</strong></td><td>Post amendment: early childhood care and education below age 6</td></tr>
<tr><td><strong>Article 51A(k)</strong></td><td>Parental duty to provide education, added by the same amendment</td></tr>
<tr><td><strong>RTE Act, 2009</strong></td><td>In force April 2010; no screening, no capitation, no detention to class 8, SMC with parent majority, private school seat share</td></tr>
<tr><td><strong>NFSA, 2013</strong></td><td>Foodgrain as an entitlement, priority households and Antyodaya, maternity benefit, grievance officers</td></tr>
<tr><td><strong>MGNREGA, 2005</strong></td><td>100 days of unskilled wage work per rural household, unemployment allowance, social audit</td></tr>
<tr><td><strong>Code on Social Security, 2020</strong></td><td>Consolidates nine labour laws, extends cover to gig and platform workers</td></tr>
</table>
<h2>Health tiers and what changes at each</h2>
<table>
<tr><td><strong>Sub-centre</strong></td><td>ANM, no doctor, antenatal care and immunisation, referral only</td></tr>
<tr><td><strong>PHC</strong></td><td>Medical officer, small inpatient capacity, first referral for the sub-centres under it</td></tr>
<tr><td><strong>CHC</strong></td><td>Specialists, operation theatre, first place surgery and emergency obstetric care exist</td></tr>
<tr><td><strong>District hospital</strong></td><td>Full secondary care, the referral ceiling before a teaching hospital</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Insurance buys hospitalisation. Outpatient spending is where the household actually bleeds, so an insurance answer that claims to solve out of pocket expenditure is wrong.</li>
<li>Contributory equals formal employment. If the question mentions unorganised workers and you have written provident fund, you have answered the wrong system.</li>
<li>Gross enrolment ratio above one hundred is not an error. Over-age and under-age pupils sit in the numerator only.</li>
<li>Exclusion error and inclusion error are not two words for the same mistake. Say which one the scheme design produces.</li>
</ul>
<h2>Edge cases that appear as the fourth option</h2>
<ul>
<li>The no detention provision was amended in 2019, so classes five and eight may hold a regular examination with re-examination. An option asserting no detention up to class eight without qualification is dated.</li>
<li>The RTE private school seat share is reimbursed by the state, so it is a purchase of service, not a charitable obligation.</li>
<li>The ASHA is an incentive paid activist, not a salaried employee, and that is the point of most questions about her.</li>
<li>NSAP is central. State pensions are state funded top-ups on top of it, so a question about the pension amount is a state question.</li>
</ul>
<p>Rule for the number you are tempted to quote: if you cannot also state its year and source, leave it out and write the mechanism instead.</p>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Which constitutional amendment inserted Article 21A and made elementary education a fundamental right?",
        options: [
          "The Seventy-third Amendment, 1992",
          "The Eighty-sixth Amendment, 2002",
          "The Forty-second Amendment, 1976",
          "The Ninety-third Amendment, 2005",
        ],
        answer: 1,
        explanation:
          "The Eighty-sixth Amendment, 2002 inserted Article 21A, recast Article 45 as early childhood care below age six and added the parental duty in Article 51A(k). The Forty-second Amendment is the tempting choice because it did move education to the Concurrent List, but moving a subject between lists is not the same as creating a fundamental right.",
        difficulty: "Easy",
        skill: "Rights based welfare legislation",
      },
      {
        n: 2,
        question:
          "In the rural public health system, which is the lowest tier at which surgery and emergency obstetric care are expected to be available?",
        options: [
          "Sub-centre",
          "Primary health centre",
          "Community health centre",
          "District hospital",
        ],
        answer: 2,
        explanation:
          "The community health centre is the first tier with specialists and an operation theatre, which is exactly why referral pathways are drawn to it. The primary health centre is the tempting answer because it does have a medical officer and beds, but a single medical officer without specialists cannot provide surgical or emergency obstetric care.",
        difficulty: "Medium",
        skill: "Three tier rural health system",
      },
      {
        n: 3,
        question:
          "A pension is paid from tax revenue to every woman above a stated age who is widowed, with no contribution ever collected from her. This instrument is best classified as:",
        options: [
          "Social insurance",
          "Social assistance",
          "A contributory annuity",
          "An employer liability scheme",
        ],
        answer: 1,
        explanation:
          "Social assistance is non-contributory and is granted on a demographic or status condition, which is precisely the design described. Social insurance is the attractive wrong answer because both pay out on a life event, but insurance requires contributions from the worker or the employer and therefore reaches only formal employment.",
        difficulty: "Easy",
        skill: "Social insurance and social assistance",
      },
      {
        n: 4,
        question:
          "A state replaces a universal cooked school meal with a meal restricted to children whose household holds a priority ration card. Which consequence follows most directly from the design change?",
        options: [
          "Learning outcomes rise because resources are concentrated",
          "Exclusion errors appear among eligible children whose household documents are incomplete",
          "The gross enrolment ratio can no longer exceed one hundred",
          "The scheme becomes contributory",
        ],
        answer: 1,
        explanation:
          "Introducing an eligibility list introduces identification, and identification produces exclusion errors that fall hardest on households with weak or mismatched documents. Concentrating resources sounds plausible, but nothing in the change increases spend per child, and a targeted meal in a shared classroom also creates a visibility problem the universal design avoided.",
        difficulty: "Hard",
        skill: "Targeting versus universal provision",
      },
      {
        n: 5,
        question:
          "Which statement about publicly funded health insurance is correct as a matter of scheme design?",
        options: [
          "It reimburses outpatient consultation and medicines, which is where most household health spending occurs",
          "It purchases listed secondary and tertiary treatment packages from empanelled hospitals, including private ones",
          "It replaces the sub-centre and primary health centre network",
          "It is financed by contributions deducted from beneficiary wages",
        ],
        answer: 1,
        explanation:
          "These schemes buy defined treatment packages from an empanelled network, which is why hospitalisation is covered and empanelment geography matters so much. The outpatient option is the tempting one because that is where households actually spend most, and the fact that insurance does not cover it is the standard criticism rather than a feature.",
        difficulty: "Medium",
        skill: "Delivery, exclusion and leakage",
      },
      {
        n: 6,
        question:
          "Why does the residential school model run by the state welfare societies target dropout more directly than an ordinary day school?",
        options: [
          "It shortens the syllabus so weaker pupils can complete it",
          "It removes daily travel and the household work claim on the child's day",
          "It is exempt from the Right to Education Act norms",
          "It admits pupils only after a screening test",
        ],
        answer: 1,
        explanation:
          "Boarding removes two of the documented causes of dropout at once, the distance to school and the domestic or wage labour a child is pulled into after school hours. Shortening the syllabus is the tempting answer because it sounds remedial, but these schools follow the regular curriculum and many prepare pupils for competitive entrance examinations.",
        difficulty: "Medium",
        skill: "Residential schooling model",
      },
      {
        n: 7,
        question: "The ASHA in the National Health Mission is best described as:",
        options: [
          "A salaried government employee posted at the sub-centre",
          "A contractual staff nurse at the primary health centre",
          "A community level woman volunteer paid task based incentives",
          "A supervisory officer for a block of anganwadi centres",
        ],
        answer: 2,
        explanation:
          "The ASHA is drawn from the village she serves and is paid performance linked incentives for defined tasks, which is why her workload follows whatever activity currently carries an incentive. Calling her a salaried employee is the common error, and it matters because the whole critique of her working conditions rests on the fact that she is not one.",
        difficulty: "Easy",
        skill: "Three tier rural health system",
      },
    ],
  },
  30218: {
    topicId: 30218,
    title: "Poverty, migration and urbanisation",
    summary:
      "Poverty, migration and urbanisation are one chain rather than three topics, because the same household appears in all three as it moves from a dry village to a construction site in a city. You learn how each is measured, which committee changed the measure and why, and how the Telangana pattern differs from the all India one.",
    concepts: [
      "Poverty line and headcount ratio",
      "Multidimensional poverty",
      "Migration streams and determinants",
      "Circular and seasonal migration",
      "Census town and urban agglomeration",
      "Primate city and regional disparity",
    ],
    glossary: {
      "Headcount ratio":
        "The share of a population living below the poverty line. It counts how many are poor and says nothing about how far below the line they are, which is why it can fall while the poorest get poorer.",
      "Poverty gap":
        "The average shortfall of poor households below the poverty line, expressed as a fraction of that line. It measures depth of poverty and is the figure a transfer programme should be judged against.",
      "Census town":
        "A settlement that meets the Census criteria for urban character, a minimum population, a minimum density and a minimum share of male main workers outside agriculture, but that still has a village panchayat rather than a municipality.",
      "Urban agglomeration":
        "A continuous urban spread made of a town and its adjoining outgrowths and towns, treated as one unit for the Census because the built-up area does not stop at the municipal boundary.",
      "Circular migration":
        "Repeated movement between a home place and a work place, with the household base never shifting. The worker is counted in neither place properly, which is why circular migrants are the group most often missed by welfare lists.",
      "Primate city":
        "A city so much larger than the second city of its region that it dominates the settlement pattern, absorbing most investment, migration and services. Hyderabad plays this role in Telangana.",
    },
    body: {
      Beginner: `<p>Three things in this topic are connected. A household that cannot make ends meet in the village sends someone out to work. Where that someone goes decides how a city grows. So you should read poverty, migration and urbanisation as one story told in three chapters.</p>
<h2>How poverty is counted</h2>
<p>A government cannot help the poor without first deciding who is poor. The oldest method draws a <strong>poverty line</strong>, a level of monthly spending per person below which a household is called poor. Different expert committees have drawn that line differently, and each time the line moves the number of poor people moves with it, even though nobody's life has changed.</p>
<p>The share of people below the line is called the <strong>headcount ratio</strong>. Notice what it hides. If a very poor family becomes slightly less poor but stays below the line, the headcount does not move at all. That is why a second measure, the poverty gap, asks how far below the line people are, not just how many.</p>
<p>A newer approach stops asking about money alone. It asks whether the household has a toilet, cooking fuel, electricity, a pucca house, school years completed by an adult, a child in school, and adequate nutrition. A household short on several of these is called multidimensionally poor. It is a useful idea because a family can have cash income and still have no drinking water.</p>
<h2>Why people move</h2>
<p>People migrate for two kinds of reasons. Push reasons drive them out: a failed crop, no work after the harvest, debt. Pull reasons draw them in: a wage on a building site, a job in a hotel, a relative already in the city.</p>
<p>Much migration is not permanent. A worker leaves after the harvest, works for four or five months and returns for the next sowing. This is <strong>circular migration</strong>, and it creates a specific problem: the worker is not on any list in the city and has stopped being present in the village, so schemes miss him in both places.</p>
<p>In Telangana you can see three patterns at once. People come into Hyderabad from every district. People from the drier southern districts go to construction sites in other states. And from several northern districts, workers go abroad to the Gulf, sending money home.</p>
<h2>How towns become cities</h2>
<p>A place is urban in the Census if it has a municipality, or if it crosses a population, density and non-farm work test. The second kind, a census town, still has a village panchayat, so it looks like a town and is governed like a village.</p>
<p>Telangana is among the more urbanised states in the country, but the urban population is concentrated heavily in Hyderabad and the districts around it. One very large city and many small towns is a different problem from many medium cities, and it is the pattern you should describe when a question asks about urbanisation in the state.</p>`,
      Intermediate: `<p>This unit belongs to Paper-II Section-III and reappears in Paper-III Section-III on issues of development and change. Questions come in two shapes: a factual one naming a committee or a Census definition, and an analytical one asking you to connect rural distress to urban growth. Both need the measurement history, so learn that first.</p>
<h2>The measurement history, committee by committee</h2>
<ul>
<li><strong>Task Force, 1979.</strong> Anchored the line to a calorie norm, higher for rural work than urban, and converted the norm into a spending level using consumption survey data.</li>
<li><strong>Lakdawala Committee, 1993.</strong> Kept the calorie anchor but built state specific lines and updated them using price indices for industrial workers and agricultural labourers rather than by re-pricing the basket.</li>
<li><strong>Tendulkar Committee, 2009.</strong> Moved away from a pure calorie anchor to a basket that included education and health spending, adopted a mixed recall period for the survey, and used the all India urban line as the reference from which state lines were derived.</li>
<li><strong>Rangarajan Committee, 2014.</strong> Revisited the basket, reinstated separate nutritional anchors alongside normative spending on rent, education and transport, and produced higher lines and therefore a higher count. Its recommendations were not adopted as the official basis.</li>
</ul>
<p>Beside the money metric sits the <strong>multidimensional</strong> approach. The national index follows the Alkire and Foster method: choose indicators, set a deprivation cut-off for each, weight them, and call a household poor if its weighted deprivation score crosses a second cut-off. Health, education and standard of living are the three dimensions, and the national version adds indicators such as maternal health and bank account to the global set.</p>
<h2>Measures you must be able to distinguish</h2>
<p>Headcount ratio counts the poor. Poverty gap measures how deep the shortfall is. The squared gap weights the deepest shortfalls most, so it responds to inequality among the poor. A transfer that lifts the near-poor above the line improves the headcount most; a transfer to the poorest improves the squared gap most. Examiners like this because it explains why two schemes can both be defended on evidence.</p>
<h2>Migration: the Census categories</h2>
<p>The Census identifies a migrant by place of birth or by place of last residence, the latter being the more useful because it captures repeat moves. Streams are rural to rural, rural to urban, urban to urban and urban to rural. Rural to rural has historically been the largest stream in India and is dominated by marriage migration of women, a point that trips up candidates who assume rural to urban must be the biggest.</p>
<p>Determinants are conventionally split into push and pull, and the standard models sharpen that. The Lewis model treats migration as labour moving out of a surplus labour agricultural sector into industry. The Harris and Todaro model explains why migration continues even when urban unemployment is visible: the migrant compares the rural wage with the urban wage multiplied by the probability of getting it, so a high urban wage keeps attracting people despite the queue.</p>
<h2>Urbanisation and its definitions</h2>
<p>A statutory town has a municipal body. A census town satisfies three tests together: population above five thousand, density above four hundred persons per square kilometre, and at least three quarters of the male main workforce in non-agricultural work. An urban agglomeration groups a town with its outgrowths so the built-up reality is measured rather than the boundary.</p>
<p>Telangana's urban share is above the national average and is dominated by the Hyderabad agglomeration, which makes the state a textbook case of a <strong>primate city</strong> pattern. The consequences to write about are concrete: land and housing pressure, water supply drawn from distant reservoirs, urban flooding where lake beds and drains were built over, solid waste, and a district level disparity in per capita income that a state average conceals.</p>`,
      Advanced: `<p>The examiner's real question in this unit is whether you can hold measurement and mechanism together. Candidates who only know committee names write a list; candidates who only know the sociology write an essay with no anchor. Marks sit with the answer that says what was measured, how the measure changed, and what the change did to the conclusion.</p>
<h2>Why the poverty count is contested, precisely</h2>
<ul>
<li><strong>Survey design changed under the measure.</strong> Consumption is captured with different recall periods for different item groups, and a change of recall period alone shifts reported consumption. Comparing two rounds that used different designs is not a like for like comparison, which is the technical core of most disputes about poverty trends.</li>
<li><strong>Survey aggregates diverge from national accounts.</strong> Consumption estimated from household surveys has run persistently below the private final consumption expenditure in the national accounts, and the gap has widened. Whichever series you use changes the answer, and neither is obviously wrong.</li>
<li><strong>The line is not a subsistence claim.</strong> A poverty line is a statistical threshold for counting, not a statement that a person above it is comfortable. Answers that treat the line as an adequacy standard invite the obvious rebuttal.</li>
<li><strong>Multidimensional and monetary poverty do not select the same households.</strong> Overlap is partial, so a state can improve on one and stall on the other. Say which measure you are using before you state a trend.</li>
</ul>
<h2>Migration: what the standard answer misses</h2>
<p>Three points lift an answer above the push and pull list.</p>
<ol>
<li><strong>Circular migrants are statistically invisible.</strong> A Census or survey based on usual residence records a short duration seasonal worker in neither location correctly, so both the origin district and the destination city under-count him. Every entitlement anchored to residence, from the ration card to school admission to a construction worker welfare board registration, then fails for exactly this group. Portable entitlements are the policy response, and portability of foodgrain is the working example.</li>
<li><strong>Remittances change the origin economy, not only the household.</strong> Land prices, house construction, private school fees and dowry all move in districts with heavy overseas migration. The Gulf migration corridor from north Telangana is the state example, and the associated issues are recruitment agent debt, contract substitution at destination, and repatriation in distress.</li>
<li><strong>The migrant is often not the poorest.</strong> Migration requires a fare, a contact and a period without earnings, so the very poorest household frequently cannot send anyone. This is why migration rates are not a proxy for poverty rates and why answers that treat them as one are marked down.</li>
</ol>
<h2>Urbanisation traps in the paper</h2>
<ul>
<li>Growth of the urban population has three sources: natural increase, net migration, and reclassification when a village crosses the census town test or a boundary is extended. Reclassification has contributed a substantial share of measured urban growth, so an answer attributing all urban growth to migration is factually wrong.</li>
<li>Census towns are governed by panchayats, so they receive rural scheme funds and rural staffing while carrying urban service loads. That mismatch, not migration, is the sharpest governance point available on this topic.</li>
<li>A high state urbanisation figure driven by a single agglomeration says little about the districts. Use the district disparity sentence rather than the state average when writing about Telangana.</li>
<li>Urban flooding is a drainage and land use failure before it is a rainfall event. Encroached tank beds and built-over storm water channels are the mechanism to name.</li>
</ul>
<h2>Assignment style question you should be able to attempt</h2>
<p>Take a dry mandal in southern Telangana and trace one household across the three chapters: what a failed borewell does to income, who leaves and for how long, which entitlements break at the moment of leaving, and what the destination city has to absorb. Four hundred words with one measurement term used correctly in each chapter is a full mark answer, and it is far stronger than a survey of every scheme in the unit.</p>`,
      Expert: `<p>Recall sheet. Committees, definitions, and the four options that are designed to catch you.</p>
<h2>Poverty committees at a glance</h2>
<table>
<tr><td><strong>Task Force, 1979</strong></td><td>Calorie anchored line, separate rural and urban norms</td></tr>
<tr><td><strong>Lakdawala, 1993</strong></td><td>State specific lines, updated by price indices, calorie anchor retained</td></tr>
<tr><td><strong>Tendulkar, 2009</strong></td><td>Broke from the pure calorie anchor, included education and health, mixed recall period</td></tr>
<tr><td><strong>Rangarajan, 2014</strong></td><td>Higher lines, normative rent, education and transport added; not adopted officially</td></tr>
</table>
<h2>Measure to meaning</h2>
<table>
<tr><td><strong>Headcount ratio</strong></td><td>How many are poor. Blind to depth.</td></tr>
<tr><td><strong>Poverty gap</strong></td><td>How far below the line, on average. Judges transfers.</td></tr>
<tr><td><strong>Squared poverty gap</strong></td><td>Weights the deepest shortfalls. Sensitive to inequality among the poor.</td></tr>
<tr><td><strong>Multidimensional index</strong></td><td>Alkire and Foster; deprivation cut-off then poverty cut-off; health, education, living standard</td></tr>
</table>
<h2>Census definitions to state verbatim</h2>
<ul>
<li>Statutory town: has a municipality, corporation, cantonment board or notified town area committee.</li>
<li>Census town: population above five thousand, density above four hundred per square kilometre, and at least seventy five per cent of male main workers in non-agricultural pursuits. All three, together.</li>
<li>Urban agglomeration: a town plus its contiguous outgrowths, treated as one unit.</li>
<li>Migrant: identified by place of birth or by place of last residence. Last residence captures repeat moves; place of birth does not.</li>
</ul>
<h2>Two-line rules</h2>
<ul>
<li>Largest migration stream in India by volume is rural to rural, driven by marriage migration of women. Rural to urban is the tempting wrong answer.</li>
<li>Urban growth equals natural increase plus net migration plus reclassification. Forgetting the third term is the single most common error in this unit.</li>
<li>Harris and Todaro: the migrant weighs the urban wage by the probability of getting it, which is why migration persists alongside urban unemployment.</li>
<li>Migration needs a fare and a contact, so the poorest often do not migrate. Migration rate is not a poverty proxy.</li>
<li>A census town has urban form and rural government. Name that mismatch whenever local governance is asked.</li>
</ul>
<h2>Telangana specifics worth one line each</h2>
<ul>
<li>Urban share above the national average, concentrated in the Hyderabad agglomeration, a primate city pattern.</li>
<li>Out-migration for construction work from the southern dry districts; overseas migration to the Gulf from several northern districts.</li>
<li>District level income disparity is concealed by the state average, so quote the pattern, not the mean.</li>
<li>Urban flooding in Hyderabad is a lake bed and storm water drain question, not a rainfall record question.</li>
</ul>`,
    },
  },
  30219: {
    topicId: 30219,
    title: "Growth, planning and the structure of the Indian economy",
    summary:
      "This is the entry point to Paper-III, and it is examined as definitions plus sequence: how national income is measured, which plan carried which model, and how the sectoral shares moved. You work the arithmetic of gross value added, deflators and sector shares by hand, because the paper sets small calculations rather than essays here.",
    concepts: [
      "National income accounting",
      "Gross value added and GDP at market prices",
      "Five year plans and their models",
      "Structural change across sectors",
      "Liberalisation of 1991",
      "From Planning Commission to NITI Aayog",
    ],
    glossary: {
      "Gross value added":
        "The value a producer adds, output minus the inputs bought from other producers. Summing it across all producers avoids counting the same steel twice, once in the mill and again in the car.",
      "GDP at market prices":
        "Gross value added at basic prices plus taxes on products and minus subsidies on products. It is what the buyer pays; gross value added is what the producer receives.",
      "GDP deflator":
        "The ratio of nominal to real output, expressed as an index. Dividing nominal output by the deflator strips out price change and leaves the change in quantity.",
      "Base year":
        "The year whose prices and structure a real series is measured against. Revising it updates the weights to current production patterns, which is why growth rates can change without any new activity.",
      "Structural change":
        "The shift of output and employment between primary, secondary and tertiary sectors as an economy develops. India is unusual because the output shift ran ahead of the employment shift by a wide margin.",
      Disinvestment:
        "The sale by government of part of its shareholding in a public sector undertaking. Minority sale raises money and keeps control; strategic sale transfers management as well.",
    },
    body: {
      Beginner: `<p>Before you can say whether an economy is growing, you have to agree on what you are adding up. This topic is that agreement, plus the story of how India planned its economy for forty years and then changed course.</p>
<h2>Adding up without double counting</h2>
<p>Suppose a farmer sells cotton to a mill for one hundred rupees. The mill makes cloth and sells it for two hundred and fifty. A tailor makes a shirt and sells it for four hundred. If you add the three sale values you get seven hundred and fifty, but the cotton has been counted three times.</p>
<p>The fix is to count only what each producer adds. The farmer adds one hundred. The mill adds one hundred and fifty. The tailor adds one hundred and fifty. Total <strong>gross value added</strong> is four hundred, which is exactly the price of the final shirt. That is the idea behind national income.</p>
<h2>Growth in money and growth in things</h2>
<p>If national income rises from one hundred to one hundred and ten, that looks like ten per cent growth. But if prices also rose, part of that rise is only the price tag changing. Removing the price effect gives you real growth, and real growth is the number that matters, because it tells you whether more was actually produced.</p>
<h2>The three sectors</h2>
<p>Economists group all production into three baskets. The primary sector grows or extracts: farming, fishing, mining. The secondary sector makes things: factories, construction, electricity. The tertiary sector serves: transport, trade, banking, software, teaching, government.</p>
<p>As a country develops, the primary share of output usually shrinks and the other two grow. India did this in an unusual way. Its services sector grew very large while manufacturing stayed modest, and farming still employs a much larger share of workers than its share of output. That mismatch is the single most examined fact in this unit.</p>
<h2>Planning, and then not planning</h2>
<p>From 1951 India ran five year plans. A Planning Commission set targets, and the plans had different emphases: agriculture first, then heavy industry, then self reliance, then poverty removal.</p>
<p>In 1991 the country faced a foreign exchange crisis and changed direction. Industrial licensing was largely removed, trade was opened, and private and foreign investment were allowed into areas previously closed. In 2015 the Planning Commission was replaced by NITI Aayog, which advises and does not allocate plan funds. The Twelfth Plan, which ended in 2017, was the last one.</p>`,
      Intermediate: `<p>Paper-III Section-I opens here. The examiner sets short definitional questions, a sequence question on the plans, and small numerical items. Treat this as a topic to be worked with a pen rather than read.</p>
<h2>The measurement chain</h2>
<p>Start at the producer and walk outwards.</p>
<ul>
<li><strong>Gross value added at basic prices</strong> is output minus intermediate consumption, summed over producers.</li>
<li><strong>GDP at market prices</strong> equals gross value added plus product taxes minus product subsidies.</li>
<li><strong>Net domestic product</strong> subtracts consumption of fixed capital, that is, depreciation.</li>
<li><strong>Gross national income</strong> adds net factor income from abroad to GDP. For India this term is usually negative, because outflows on foreign investment exceed inflows of factor income.</li>
</ul>
<p>Worked example. Gross value added at basic prices is 260 lakh crore rupees, product taxes are 24 lakh crore and product subsidies are 4 lakh crore. GDP at market prices is 260 plus 24 minus 4, that is 280 lakh crore.</p>
<p>Now strip prices. Nominal GDP rises from 280 to 310 lakh crore while the deflator rises from 100 to 105. Real GDP in the second year is 310 divided by 1.05, which is 295.24. Real growth is 295.24 minus 280, divided by 280, which is 5.44 per cent. Nominal growth was 10.71 per cent, so inflation accounted for roughly five percentage points of it. Being able to separate those two numbers is the whole skill.</p>
<h2>The history of the estimate</h2>
<p>Early estimates were individual efforts. Dadabhai Naoroji made the first well known attempt in the nineteenth century as part of his argument about the drain of wealth. The first estimate on modern lines was made by V K R V Rao. After independence a National Income Committee was set up in 1949 under P C Mahalanobis, with D R Gadgil and V K R V Rao as members, and official estimation followed from it. The base year of the series is revised periodically to keep the weights current.</p>
<h2>The plans, and what each was for</h2>
<ol>
<li><strong>First, 1951 to 1956.</strong> Agriculture and irrigation, framed on a Harrod and Domar style growth arithmetic linking saving, capital output ratio and growth.</li>
<li><strong>Second, 1956 to 1961.</strong> The Mahalanobis model, heavy and basic industry, aligned with the Industrial Policy Resolution of 1956 that reserved core sectors for the state.</li>
<li><strong>Third, 1961 to 1966.</strong> A self reliant and self generating economy, disrupted by war and drought.</li>
<li><strong>Plan holiday, 1966 to 1969.</strong> Three annual plans; devaluation in 1966; the green revolution package begins.</li>
<li><strong>Fourth, 1969 to 1974.</strong> Growth with stability and progressive self reliance.</li>
<li><strong>Fifth, 1974 to 1979.</strong> Poverty removal and the Minimum Needs Programme; terminated a year early.</li>
<li><strong>Rolling plan, 1978 to 1980.</strong> An annual plan revised each year rather than a fixed five year frame.</li>
<li><strong>Sixth to Seventh, 1980 to 1990.</strong> Modernisation, then food, work and productivity.</li>
<li><strong>Eighth, 1992 to 1997.</strong> The first plan after liberalisation, with human development and a changed role for the state; preceded by two annual plans during the crisis years.</li>
<li><strong>Ninth to Twelfth, 1997 to 2017.</strong> Growth with social justice, then inclusive growth, then faster, more inclusive and sustainable growth.</li>
</ol>
<h2>1991 and after</h2>
<p>The immediate trigger was a balance of payments crisis with foreign exchange reserves down to a few weeks of imports. The response had three strands. Liberalisation removed industrial licensing for most industries and dismantled much of the restrictive trade practices regime. Privatisation began the sale of government shareholding in public undertakings. Globalisation cut tariffs, moved the rupee towards a market determined rate and opened sectors to foreign direct investment. The Planning Commission was replaced on 1 January 2015 by NITI Aayog, which produces strategy documents and does not allocate plan assistance to states.</p>`,
      Advanced: `<p>The mark difference in this unit is rarely the plan list, which everyone has. It is whether you can handle the accounting identities under pressure and whether you know which structural claims about India are actually supported.</p>
<h2>Identities you will be asked to invert</h2>
<ul>
<li>GDP at market prices equals gross value added at basic prices plus product taxes minus product subsidies. If a question gives you GDP and asks for gross value added, you subtract the net product taxes rather than adding them, and that reversal is where candidates lose the mark.</li>
<li>Basic prices already include production taxes such as land revenue and stamp duty, which are levied on the producer regardless of output. Product taxes such as excise and the goods and services tax on the item are the ones excluded from basic prices. Mixing the two is the standard trap.</li>
<li>Gross national income equals GDP plus net factor income from abroad. Remittances from workers abroad are compensation of employees and do enter factor income; a transfer from a relative does not, it enters current transfers in the balance of payments. Expect at least one option built on that distinction.</li>
<li>Real growth equals nominal growth minus inflation only as an approximation. The exact form divides the nominal index by the deflator index. At single digit rates the approximation is close; at high inflation it is not, and a numerical question can be set precisely where the gap shows.</li>
</ul>
<h2>Structural change: state it accurately</h2>
<p>The careless sentence is that India moved from agriculture to services and skipped industry. The accurate version has three parts, and each is separately examinable.</p>
<ol>
<li><strong>Output.</strong> The primary share of gross value added fell steadily and the tertiary share rose to become the largest. The secondary share rose modestly and then flattened, so manufacturing never reached the share seen in the east Asian transitions.</li>
<li><strong>Employment.</strong> The agricultural share of the workforce fell far more slowly than its output share, so value added per worker in agriculture stayed far below the other sectors. That gap is the arithmetic behind rural distress and behind out-migration.</li>
<li><strong>Composition of services.</strong> The services share is not uniformly modern. It contains high productivity finance, telecommunications and software alongside very low productivity petty trade and personal services that absorb workers leaving agriculture. Answers that treat the services share as a proxy for modernisation are marked down.</li>
</ol>
<p>A related caution. Recent years have shown some reversal of the fall in the agricultural employment share, so a flat assertion that the share falls every year is unsafe. Describe the long run direction and note that the annual series is not monotonic.</p>
<h2>Reading a base year revision correctly</h2>
<p>When the base year is revised, the coverage of enterprises, the data sources and the weights all change together. A revised series can therefore show a different level and a different growth rate for the same past years. The correct examination answer says that the revision updates weights to a more representative structure and improves coverage, and that comparisons across the revision boundary require a back-cast series. The wrong answer treats the revision as either a correction of error or a manipulation.</p>
<h2>Where planning ended, and what replaced it</h2>
<p>The change in 2015 was not cosmetic. The Planning Commission allocated plan assistance to states and therefore had leverage over state expenditure. NITI Aayog has no such allocation power; transfers to states now run through the Finance Commission devolution and through centrally sponsored schemes. That shift, plus the ending of the plan and non-plan expenditure distinction from 2017 to 2018, is the institutional answer to a question about cooperative federalism in fiscal terms. Learn it as a transfer of leverage, not as a renaming.</p>`,
      Expert: `<p>Formula and sequence sheet.</p>
<h2>Aggregates in one column</h2>
<table>
<tr><td><strong>GVA at basic prices</strong></td><td>Output minus intermediate consumption</td></tr>
<tr><td><strong>GDP at market prices</strong></td><td>GVA + product taxes - product subsidies</td></tr>
<tr><td><strong>NDP</strong></td><td>GDP - consumption of fixed capital</td></tr>
<tr><td><strong>GNI</strong></td><td>GDP + net factor income from abroad</td></tr>
<tr><td><strong>Real GDP</strong></td><td>Nominal GDP divided by the deflator index, times 100</td></tr>
<tr><td><strong>Deflator</strong></td><td>Nominal divided by real, times 100</td></tr>
</table>
<h2>Plans, model and slogan</h2>
<table>
<tr><td><strong>First 1951-56</strong></td><td>Harrod and Domar arithmetic, agriculture and irrigation</td></tr>
<tr><td><strong>Second 1956-61</strong></td><td>Mahalanobis, heavy industry, IPR 1956</td></tr>
<tr><td><strong>Third 1961-66</strong></td><td>Self reliant, self generating economy</td></tr>
<tr><td><strong>1966-69</strong></td><td>Plan holiday, three annual plans, devaluation 1966</td></tr>
<tr><td><strong>Fourth 1969-74</strong></td><td>Growth with stability</td></tr>
<tr><td><strong>Fifth 1974-79</strong></td><td>Poverty removal, Minimum Needs Programme, ended early</td></tr>
<tr><td><strong>1978-80</strong></td><td>Rolling plan</td></tr>
<tr><td><strong>Eighth 1992-97</strong></td><td>First post-reform plan; two annual plans preceded it</td></tr>
<tr><td><strong>Twelfth 2012-17</strong></td><td>Faster, more inclusive and sustainable growth; the last plan</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Basic prices include production taxes, exclude product taxes. That one sentence answers most accounting options.</li>
<li>Worker remittances are factor income and enter GNI. A gift transfer does not.</li>
<li>Output share moved before employment share. The gap is the whole rural distress argument.</li>
<li>Planning Commission allocated funds; NITI Aayog advises. The lost lever is the answer.</li>
<li>Plan and non-plan classification of expenditure was discontinued from 2017 to 2018. Revenue and capital is the surviving split.</li>
</ul>
<h2>Numbers to be able to produce cold</h2>
<ul>
<li>GVA 260, product taxes 24, product subsidies 4. GDP equals 280.</li>
<li>Nominal 280 to 310, deflator 100 to 105. Real growth 5.44 per cent, nominal 10.71 per cent.</li>
<li>Harrod and Domar: growth equals savings rate divided by capital output ratio. Savings 24 per cent, ratio 4, growth 6 per cent.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Gross value added at basic prices is 260 lakh crore rupees, product taxes are 24 lakh crore and product subsidies are 4 lakh crore. What is GDP at market prices?",
        options: [
          "232 lakh crore",
          "240 lakh crore",
          "280 lakh crore",
          "288 lakh crore",
        ],
        answer: 2,
        explanation:
          "GDP at market prices is gross value added plus product taxes minus product subsidies, so 260 plus 24 minus 4 gives 280 lakh crore. The 232 option comes from subtracting the taxes instead of adding them, which is the reversal to watch for when the question gives you GDP and asks for gross value added.",
        difficulty: "Medium",
        skill: "Gross value added and GDP at market prices",
      },
      {
        n: 2,
        question:
          "Nominal GDP rises by 10.71 per cent while the GDP deflator rises from 100 to 105. Real growth is closest to:",
        options: ["4.00 per cent", "5.44 per cent", "10.71 per cent", "15.71 per cent"],
        answer: 1,
        explanation:
          "Divide the nominal index by the deflator ratio: 110.71 divided by 1.05 is 105.44, so real growth is about 5.44 per cent. The 4.00 option is what you get from an over-crude subtraction, and the exercise exists precisely to show that nominal growth minus inflation is an approximation rather than the identity.",
        difficulty: "Hard",
        skill: "National income accounting",
      },
      {
        n: 3,
        question: "The Second Five Year Plan is associated with which emphasis and model?",
        options: [
          "Agriculture and irrigation, on Harrod and Domar arithmetic",
          "Heavy and basic industry, on the Mahalanobis model",
          "Poverty removal and the Minimum Needs Programme",
          "Human development after liberalisation",
        ],
        answer: 1,
        explanation:
          "The Second Plan built the capital goods sector on the Mahalanobis framework and was matched by the Industrial Policy Resolution of 1956 reserving core industries for the state. Agriculture and irrigation on Harrod and Domar arithmetic describes the First Plan, which is the option most often chosen by candidates who remember the model but not its plan.",
        difficulty: "Easy",
        skill: "Five year plans and their models",
      },
      {
        n: 4,
        question:
          "Which statement most accurately describes India's structural change since 1950?",
        options: [
          "Both the output share and the employment share of agriculture fell at similar rates",
          "The output share of agriculture fell much faster than its employment share",
          "The employment share of agriculture fell faster than its output share",
          "Manufacturing overtook services in share of gross value added",
        ],
        answer: 1,
        explanation:
          "Agriculture's share of output fell steeply while its share of workers fell far more slowly, which is why value added per worker in agriculture stayed well below the other sectors and why rural distress persists. The first option is attractive because it sounds like orderly development, but it describes a transition India did not have.",
        difficulty: "Medium",
        skill: "Structural change across sectors",
      },
      {
        n: 5,
        question: "The immediate trigger for the reforms announced in 1991 was:",
        options: [
          "A collapse in agricultural output following successive droughts",
          "A balance of payments crisis with foreign exchange reserves down to a few weeks of imports",
          "A recommendation of the Planning Commission in the Eighth Plan document",
          "The recommendations of the Tenth Finance Commission",
        ],
        answer: 1,
        explanation:
          "Reserves fell to a level covering only a few weeks of imports, which forced the stabilisation and reform package of that year. The Eighth Plan option is tempting because that plan is described as the first post-reform plan, but it followed the reforms and did not cause them, and two annual plans covered the crisis years in between.",
        difficulty: "Easy",
        skill: "Liberalisation of 1991",
      },
      {
        n: 6,
        question:
          "Which is the most accurate institutional difference between the Planning Commission and NITI Aayog?",
        options: [
          "NITI Aayog allocates plan assistance to states while the Planning Commission only advised",
          "The Planning Commission allocated plan assistance to states; NITI Aayog has no such allocation power",
          "NITI Aayog is a constitutional body while the Planning Commission was statutory",
          "NITI Aayog prepares five year plans on a rolling basis",
        ],
        answer: 1,
        explanation:
          "The Planning Commission's leverage over states came from allocating plan assistance, and NITI Aayog was created without that power, so transfers now run through Finance Commission devolution and centrally sponsored schemes. The constitutional body option is wrong on both halves: neither was created by the Constitution and neither was set up by an Act of Parliament.",
        difficulty: "Medium",
        skill: "From Planning Commission to NITI Aayog",
      },
      {
        n: 7,
        question:
          "If the savings rate is 24 per cent of national income and the incremental capital output ratio is 4, the Harrod and Domar growth rate is:",
        options: ["4 per cent", "6 per cent", "20 per cent", "96 per cent"],
        answer: 1,
        explanation:
          "Growth equals the savings rate divided by the capital output ratio, so 24 divided by 4 gives 6 per cent. The 4 per cent option comes from reading the ratio itself as the answer, and the model is worth knowing because the First Plan was framed on exactly this arithmetic.",
        difficulty: "Medium",
        skill: "Five year plans and their models",
      },
    ],
  },
  30220: {
    topicId: 30220,
    title: "Telangana economy: agriculture, industry and services",
    summary:
      "Paper-III Section-II is entirely about this state, and it rewards specifics: which crop sits on which soil, which project lifts water from which river, which industry clusters in which district. You learn the physical base first, then the policy layer, then the arithmetic of cropping intensity and irrigation shares that the paper likes to set as a small calculation.",
    concepts: [
      "Cropping pattern and soil base",
      "Irrigation sources and lift schemes",
      "Cropping intensity arithmetic",
      "Industrial clusters and mineral base",
      "Single window industrial approval",
      "Regional disparity within the state",
    ],
    glossary: {
      "Net sown area":
        "The land actually sown at least once in an agricultural year, counted only once however many times it is cropped. It measures land, not effort.",
      "Gross cropped area":
        "The total area sown across all seasons, counting a field sown twice as two. The difference between it and net sown area is the area sown more than once.",
      "Cropping intensity":
        "Gross cropped area divided by net sown area, times one hundred. A figure of 140 means that for every hundred acres of land, one hundred and forty acres worth of sowing happened across the year.",
      Ayacut:
        "The command area of an irrigation project, that is, the land the project is designed to water. Stabilised ayacut means land already irrigated that the project now supplies more reliably, which is not new area.",
      "Lift irrigation":
        "A scheme that pumps water uphill from a river or reservoir to a command area above it, instead of letting gravity carry it through a canal. It buys command area at the cost of a permanent electricity bill.",
      "Deemed approval":
        "A clearance that is treated as granted because the department did not decide within the time limit fixed by law. It shifts the cost of delay from the applicant to the department.",
    },
    body: {
      Beginner: `<p>Telangana sits on the Deccan plateau. That single fact explains most of its economy. The land is high, the rock is hard, the rainfall arrives mainly with the south west monsoon between June and September, and the two big rivers, the Godavari in the north and the Krishna in the south, run in deep valleys well below the fields.</p>
<h2>Farming</h2>
<p>Most of the state has red sandy soil, called chalka locally, which drains fast and holds little water. Black cotton soil, heavier and moisture retaining, is found in parts of the north and east. Soil decides crop. Cotton and red gram do well on the heavier soils. Paddy needs assured water, so it follows irrigation.</p>
<p>Water comes from three places. Rain fed fields depend on the monsoon alone. Tanks, the traditional stone and earth bunds built centuries ago, store runoff for a village. Borewells pump groundwater. Over the last few decades borewells became the largest single source, and that is why falling water tables are a farming problem here rather than only an environmental one.</p>
<p>Because the rivers run low and the fields are high, much of the new irrigation is <strong>lift irrigation</strong>. Instead of a canal carrying water downhill, pumps push water uphill into reservoirs. It works, and it means the irrigation system now needs a great deal of electricity every season.</p>
<h2>Industry</h2>
<p>Industry in the state is clustered rather than spread. Hyderabad and the districts around it hold medicines, information technology, defence and aerospace work. Coal is mined in the Godavari valley in the north east and burnt in thermal power stations nearby. Limestone in the south supports cement plants. Warangal and Sircilla have textiles, Karimnagar has granite and silver work, Nizamabad has turmeric and beedi work.</p>
<p>The state also has famous handloom clusters. Pochampally ikat, Gadwal and Narayanpet sarees, Nirmal paintings and toys, Cherial scrolls. These matter for the exam because they are asked as location questions, so learn the craft with its district.</p>
<h2>Services</h2>
<p>Services are the largest part of the state economy, and most of that is in Hyderabad. This creates the one problem you should always mention: the state average looks good while districts far from the capital look very different. When a question asks about the Telangana economy, describe the gap, not the average.</p>`,
      Intermediate: `<p>Paper-III Section-II is set on this material, and Paper-I general studies borrows from it for state current affairs. Questions are specific and factual. Learn the physical base, then the projects, then the policy layer, and be able to do the small arithmetic without a calculator.</p>
<h2>The physical base</h2>
<p>The state lies on the Deccan plateau, largely in the Godavari basin with the southern districts in the Krishna basin. The Godavari is joined within or along the state by the Pranahita, Manjira, Manair and Kinnerasani. The Musi, which flows through Hyderabad, joins the Krishna. Rainfall is monsoon dependent and declines from the north east towards the south west, which is why the Palamuru region is the drier part of the state.</p>
<p>Soils fall into four working groups. Red sandy soils, locally chalka, cover the largest area and are light and low in moisture retention. Black cotton or regur soils occur in parts of the north and east and hold moisture well. Laterite occurs in patches, and alluvial soils lie along the river courses.</p>
<h2>Cropping pattern and the arithmetic</h2>
<p>Rice dominates the irrigated area in both kharif and rabi and its share rose as irrigation expanded. Cotton occupies a very large kharif area on the heavier soils. Maize, red gram, groundnut, chilli, turmeric, soyabean and sugarcane fill out the pattern, with turmeric associated with Nizamabad and Jagtial, and chilli with Khammam and the eastern districts.</p>
<p>Worked example. Suppose net sown area is 50 lakh hectares and gross cropped area is 70 lakh hectares. Cropping intensity is 70 divided by 50, times one hundred, which is 140 per cent. The area sown more than once is 70 minus 50, that is 20 lakh hectares. Now suppose net irrigated area is 24 lakh hectares. The irrigation ratio is 24 divided by 50, which is 48 per cent of the net sown area. If borewells account for 14 of those 24 lakh hectares, groundwater serves 58.3 per cent of the irrigated area. These three ratios, intensity, irrigation ratio and source share, are the calculations this section actually sets.</p>
<h2>Irrigation projects worth naming</h2>
<ul>
<li><strong>Godavari basin.</strong> Sri Ram Sagar at Pochampad, Nizam Sagar and Singur on the Manjira, Kadem, the Devadula lift scheme serving Warangal, and the Kaleshwaram lift project which pumps Godavari water from the Medigadda barrage upward through a chain of reservoirs and pump houses.</li>
<li><strong>Krishna basin.</strong> Nagarjuna Sagar and Srisailam as the large storages, Jurala in the south, and the Palamuru and Rangareddy lift scheme designed to carry Krishna water to the dry southern districts.</li>
<li><strong>Tanks.</strong> A dedicated programme desilted and restored minor irrigation tanks, on the argument that restored tanks recharge groundwater and reduce dependence on deeper borewells.</li>
<li><strong>Drinking water.</strong> A statewide piped drinking water mission draws from the same river sources. Treat it as a public health intervention, since the health argument is fluoride affected groundwater in several districts.</li>
</ul>
<h2>Industry, minerals and policy</h2>
<p>Coal comes from the Godavari valley coalfield worked by the state coal undertaking, with thermal stations at Ramagundam and elsewhere. Limestone in the southern districts supports cement, granite and dolerite in the north support a stone processing industry, and there are iron ore and manganese occurrences in the east and north.</p>
<p>Manufacturing and services are concentrated in and around Hyderabad: bulk drugs and formulations with a dedicated life sciences cluster, information technology and business services, aerospace and defence manufacturing on the southern edge of the city, and electronics. Outside the capital, the large textile park near Warangal and the powerloom cluster at Sircilla are the industrial names to know.</p>
<p>The policy layer is a single window clearance system with self certification by the promoter and a fixed decision window, after which approval is <strong>deemed</strong> granted. Around it sit an incubator for technology startups, a separate incubator for women led enterprises, a skills body linking colleges to employers, and incentive packages with additional support for scheduled caste and scheduled tribe entrepreneurs.</p>`,
      Advanced: `<p>Two failure modes cost marks in this section. The first is writing about India when the question says Telangana. The second is quoting a figure that has since changed. Both are avoidable, and the fix is the same: anchor every claim to a place, a mechanism or a ratio rather than to a number.</p>
<h2>The paddy question, argued properly</h2>
<p>Expansion of assured irrigation shifted large areas into rice, including in the rabi season on land that previously grew dryland crops. The examination-worthy analysis has four strands, and a strong answer holds them together rather than picking one.</p>
<ol>
<li><strong>Water.</strong> Rice has a high water requirement per unit of output, so shifting to it raises consumptive use on a system that is partly lift based and therefore energy intensive as well.</li>
<li><strong>Power.</strong> Free or heavily subsidised agricultural power plus lift schemes makes electricity a recurring fiscal commitment tied to the cropping choice, not just to the project.</li>
<li><strong>Procurement.</strong> Assured purchase at a support price sustains the shift, so a change in procurement policy transmits directly into the cropping pattern within one season.</li>
<li><strong>Diversification.</strong> Pulses, oilseeds and horticulture need water assurance too, but they also need a market, cold chain and grading. Recommending diversification without the market side is the incomplete answer examiners see most often.</li>
</ol>
<h2>Lift irrigation, evaluated rather than described</h2>
<p>A lift scheme converts a capital problem into an operating problem. Gravity canals cost more land and less power; lift schemes cost more power and less land, and they can command higher ground that no canal could reach. The evaluation questions are therefore about the operating side: pumping cost per unit of water delivered, the reliability of power supply at the pump houses, the share of designed <strong>ayacut</strong> actually irrigated as against stabilised, and silt management at the barrages. Distinguish new ayacut from stabilised ayacut in any answer about project performance, because a project can be delivering water while creating no new irrigated area.</p>
<h2>Industrial concentration and what would change it</h2>
<ul>
<li>Concentration around Hyderabad is a location decision by firms, driven by airport connectivity, skilled labour and buyer proximity, so it does not reverse because a policy says it should. Industrial corridors, a park with plug and play sheds, and a trained local workforce are the instruments that have moved units in practice.</li>
<li>A single window with <strong>deemed approval</strong> reduces one specific cost, the discretionary delay. It cannot supply land, power or a workforce, so answers that credit it with the whole investment record overstate it.</li>
<li>Mineral based industry is location bound: cement follows limestone, thermal power follows coal, stone processing follows the quarry. That is why these are the industries actually present outside the capital, and it is the strongest argument available on regional dispersal.</li>
<li>Textiles, food processing and poultry are the labour absorbing sectors with a district level presence, so use them when a question asks for employment intensive options rather than naming information technology.</li>
</ul>
<h2>Regional disparity, stated with the right units</h2>
<p>State per capita income is pulled upward by Hyderabad and its neighbouring district, which host a disproportionate share of services output. A district level comparison is therefore more informative than the state mean, and the honest framing is that Telangana has one metropolitan economy and several agrarian district economies inside one boundary. This is also the link back to the previous topic: out-migration from the drier southern districts and in-migration to the capital are two sides of that gap.</p>
<h2>Handling numbers safely</h2>
<p>Support rates, project costs, ayacut figures and output ranks are revised. In an answer, write the mechanism and the direction, and give a number only with its year attached. In a multiple choice paper, expect the ranking questions to be about relative position, which is stable, rather than about absolute levels, which are not.</p>`,
      Expert: `<p>Location and mechanism recall.</p>
<h2>Project to river to purpose</h2>
<table>
<tr><td><strong>Sri Ram Sagar, Pochampad</strong></td><td>Godavari, storage, north Telangana command</td></tr>
<tr><td><strong>Nizam Sagar, Singur</strong></td><td>Manjira, storage and drinking water for the capital region</td></tr>
<tr><td><strong>Kaleshwaram</strong></td><td>Godavari, lift from the Medigadda barrage through pump houses and reservoirs</td></tr>
<tr><td><strong>Devadula</strong></td><td>Godavari, lift, Warangal region</td></tr>
<tr><td><strong>Nagarjuna Sagar, Srisailam</strong></td><td>Krishna, storage shared with the neighbouring state</td></tr>
<tr><td><strong>Jurala</strong></td><td>Krishna, southern districts</td></tr>
<tr><td><strong>Palamuru and Rangareddy</strong></td><td>Krishna, lift, designed for the dry south</td></tr>
</table>
<h2>Craft and cluster to district</h2>
<table>
<tr><td><strong>Pochampally ikat</strong></td><td>Yadadri Bhuvanagiri region</td></tr>
<tr><td><strong>Gadwal, Narayanpet sarees</strong></td><td>Southern Telangana</td></tr>
<tr><td><strong>Nirmal paintings and toys</strong></td><td>Nirmal</td></tr>
<tr><td><strong>Cherial scrolls</strong></td><td>Siddipet region</td></tr>
<tr><td><strong>Silver filigree</strong></td><td>Karimnagar</td></tr>
<tr><td><strong>Powerlooms</strong></td><td>Sircilla</td></tr>
<tr><td><strong>Coal and thermal power</strong></td><td>Godavari valley, Ramagundam and Bhadradri Kothagudem belt</td></tr>
<tr><td><strong>Cement</strong></td><td>Limestone belt of the southern districts</td></tr>
</table>
<h2>Formulas to write without thinking</h2>
<ul>
<li>Cropping intensity equals gross cropped area over net sown area, times one hundred. 70 over 50 gives 140 per cent.</li>
<li>Area sown more than once equals gross cropped area minus net sown area. 70 minus 50 gives 20.</li>
<li>Irrigation ratio equals net irrigated area over net sown area. 24 over 50 gives 48 per cent.</li>
<li>Source share equals source area over net irrigated area. 14 over 24 gives 58.3 per cent.</li>
</ul>
<h2>Two-line rules</h2>
<ul>
<li>Chalka is red sandy and drains fast. Regur is black cotton and holds moisture. Crop follows soil.</li>
<li>Lift converts capital cost into a permanent power bill. Every evaluation question is really about that bill.</li>
<li>New ayacut and stabilised ayacut are different claims. Say which one a figure refers to.</li>
<li>Groundwater, not canals, is the largest irrigation source in the state. Answers that assume canal dominance are wrong.</li>
<li>Services lead the state economy and are concentrated in one agglomeration. Quote the disparity, never the mean alone.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Net sown area is 50 lakh hectares and gross cropped area is 70 lakh hectares. What is the cropping intensity, and what is the area sown more than once?",
        options: [
          "71 per cent and 20 lakh hectares",
          "140 per cent and 20 lakh hectares",
          "140 per cent and 70 lakh hectares",
          "40 per cent and 50 lakh hectares",
        ],
        answer: 1,
        explanation:
          "Cropping intensity is gross cropped area over net sown area times one hundred, so 70 over 50 gives 140 per cent, and the area sown more than once is the difference, 20 lakh hectares. The 71 per cent option comes from inverting the ratio, which is the error to guard against when the question states the two areas in the reverse order.",
        difficulty: "Medium",
        skill: "Cropping intensity arithmetic",
      },
      {
        n: 2,
        question:
          "Which soil type covers the largest area in Telangana and explains why so much of the state needs assured irrigation?",
        options: [
          "Black cotton, or regur, which retains moisture well",
          "Red sandy soil, locally called chalka, which drains fast and retains little moisture",
          "Alluvial soil deposited by the Godavari and the Krishna",
          "Laterite soil formed under heavy leaching",
        ],
        answer: 1,
        explanation:
          "Red sandy chalka soils cover the largest area and hold little moisture, so a break in the monsoon hurts quickly and irrigation matters more than it would on a retentive soil. Black cotton soil is the tempting answer because it is the more famous Deccan soil, but it occupies parts of the north and east rather than the bulk of the state.",
        difficulty: "Medium",
        skill: "Cropping pattern and soil base",
      },
      {
        n: 3,
        question: "The Kaleshwaram project is best described as:",
        options: [
          "A gravity canal system drawing from the Krishna",
          "A lift scheme pumping Godavari water upward through a chain of barrages, pump houses and reservoirs",
          "A minor irrigation tank restoration programme",
          "A drinking water grid independent of the irrigation network",
        ],
        answer: 1,
        explanation:
          "It lifts water from the Godavari and moves it upward in stages, which is why its operating cost is dominated by power rather than by canal maintenance. Calling it a gravity system on the Krishna gets both the river and the mechanism wrong, and the mechanism is the part every evaluation question turns on.",
        difficulty: "Easy",
        skill: "Irrigation sources and lift schemes",
      },
      {
        n: 4,
        question:
          "Net sown area is 50 lakh hectares, net irrigated area is 24 lakh hectares and borewells account for 14 lakh hectares of that irrigated area. What share of the irrigated area is served by groundwater?",
        options: ["28.0 per cent", "48.0 per cent", "58.3 per cent", "70.0 per cent"],
        answer: 2,
        explanation:
          "The source share is measured against the irrigated area, so 14 divided by 24 gives 58.3 per cent. The 48 per cent option is the irrigation ratio, 24 over 50, which answers a different question and is the distractor placed there for candidates who grab the first two numbers in the stem.",
        difficulty: "Hard",
        skill: "Cropping intensity arithmetic",
      },
      {
        n: 5,
        question:
          "Under a single window industrial clearance system with a statutory decision window, what does deemed approval mean?",
        options: [
          "The department may extend the deadline once on written reasons",
          "The clearance is treated as granted if the department does not decide within the fixed period",
          "The promoter certifies compliance and no clearance is required at all",
          "The application is rejected automatically if the deadline passes",
        ],
        answer: 1,
        explanation:
          "Deemed approval treats silence as consent once the statutory period lapses, which moves the cost of delay from the applicant to the department. The self certification option is tempting because these systems do rely on promoter declarations, but self certification is about how compliance is verified, not about what happens when a deadline passes.",
        difficulty: "Medium",
        skill: "Single window industrial approval",
      },
      {
        n: 6,
        question:
          "Which pairing of industry and its locational reason is correct for Telangana?",
        options: [
          "Cement in the southern districts because of the limestone belt",
          "Bulk drug manufacture in Adilabad because of proximity to coal",
          "Powerloom weaving at Ramagundam because of the thermal station",
          "Granite processing in Khammam because of the port link",
        ],
        answer: 0,
        explanation:
          "Cement is a weight losing industry that locates on its raw material, and the limestone belt of the southern districts is exactly why the plants are there. The Adilabad option is designed to catch candidates who assume all heavy industry follows coal, whereas bulk drug manufacture follows skilled labour, effluent infrastructure and buyer proximity, which is why it clustered near the capital.",
        difficulty: "Medium",
        skill: "Industrial clusters and mineral base",
      },
      {
        n: 7,
        question:
          "Why is the state per capita income figure a weak answer to a question on the Telangana economy?",
        options: [
          "It is calculated at current prices and therefore includes inflation",
          "It is pulled upward by the services output concentrated in the capital region and hides district level differences",
          "It excludes the agricultural sector entirely",
          "It is published only for the state as a whole and never by district",
        ],
        answer: 1,
        explanation:
          "One metropolitan economy sits inside the state boundary alongside several agrarian district economies, so the mean describes neither, and the district comparison is the informative statement. The current prices option is a real caveat about any income figure, but it applies equally to every state and does not explain why this particular average misleads.",
        difficulty: "Medium",
        skill: "Regional disparity within the state",
      },
    ],
  },
  30221: {
    topicId: 30221,
    title: "State budget, revenue sources and public expenditure",
    summary:
      "A state budget is a constitutional procedure before it is an accounting document, so you learn the articles and the funds first and the numbers second. You then work the three deficit measures by hand from a small set of figures, because that is exactly the form the question takes in Paper-III.",
    concepts: [
      "Annual financial statement and the state funds",
      "Revenue and capital classification",
      "Own tax revenue and central transfers",
      "Deficit measures and their arithmetic",
      "Finance Commission devolution",
      "Borrowing limits and off-budget liabilities",
    ],
    glossary: {
      "Consolidated Fund of the State":
        "The account into which all revenues, loans raised and repayments received by the state flow. Nothing can be spent out of it except under an appropriation made by law, which is what makes the budget a legal instrument.",
      "Contingency Fund":
        "A standing sum placed at the Governor's disposal for urgent unforeseen expenditure, spent first and regularised afterwards by a legislated appropriation that restores the fund.",
      "Appropriation Bill":
        "The Bill that authorises withdrawal from the Consolidated Fund for the grants voted and the expenditure charged on the fund. No amendment can alter a voted grant at this stage.",
      "Vote on account":
        "An advance grant covering expenditure for part of the year, taken when the full budget cannot be passed in time. It authorises spending, not new policy.",
      "Revenue deficit":
        "Revenue expenditure minus revenue receipts. It means the state is borrowing to pay for consumption such as salaries and interest rather than for assets.",
      "Contingent liability":
        "An obligation that falls on the state only if something else fails, such as a guarantee on a corporation's loan. It sits outside the budget until the day it becomes real.",
    },
    body: {
      Beginner: `<p>A state government cannot spend a rupee simply because it wants to. Every rupee has to be voted by the legislature first. The budget is how that permission is asked for and given.</p>
<h2>Where the money sits</h2>
<p>Money the state receives goes into the <strong>Consolidated Fund of the State</strong>. Taxes, loans taken, loans repaid to the state, all of it. Nothing comes out of that fund unless a law says it may. That law is the Appropriation Act, passed every year with the budget.</p>
<p>There are two other accounts. The Contingency Fund is a small standing amount kept with the Governor for an emergency that could not have been foreseen, spent at once and regularised by the legislature later. The Public Account holds money the state is only holding for someone else, such as provident fund deposits, so it does not need a vote to be paid back.</p>
<h2>Where the money comes from</h2>
<ul>
<li><strong>The state's own taxes.</strong> The state share of the goods and services tax, excise duty on liquor, stamp duty when you register a document or a sale of land, motor vehicle tax, tax on petrol and diesel, electricity duty.</li>
<li><strong>The state's own non-tax income.</strong> Royalty from mines, interest on loans it has given, dividends from state undertakings, fees for services.</li>
<li><strong>Money from the Centre.</strong> A share of central taxes, decided by the Finance Commission, plus grants for particular purposes.</li>
<li><strong>Borrowing.</strong> Loans raised in the market and from institutions. This is not income; it has to be repaid with interest.</li>
</ul>
<h2>Where the money goes</h2>
<p>Spending is split into two kinds, and this split is the most examined idea in the topic. Revenue expenditure keeps things running: salaries, pensions, interest on past loans, subsidies, repairs. Nothing is left at the end of the year. Capital expenditure builds something that lasts: a road, a canal, a hospital block.</p>
<h2>The gaps</h2>
<p>If routine spending exceeds routine income, that gap is the <strong>revenue deficit</strong>, and it means the state is borrowing to meet daily costs. If total spending exceeds all income other than borrowing, that gap is the fiscal deficit, and it is exactly how much the state has to borrow this year. If you take the fiscal deficit and remove the interest paid on old loans, what is left is the primary deficit, which shows the gap created by this year's decisions alone.</p>`,
      Intermediate: `<p>This topic sits in Paper-III and overlaps with the polity paper, because the budget procedure is constitutional. Expect a factual question on an article, a definitional question on a deficit, and a small calculation. Handle all three by learning the procedure, the classification and the formulas in that order.</p>
<h2>The constitutional procedure</h2>
<ul>
<li><strong>Article 202.</strong> The Governor causes the annual financial statement, the estimated receipts and expenditure for the year, to be laid before the legislature. The statement must show separately the sums charged on the Consolidated Fund and the sums proposed as expenditure from it.</li>
<li><strong>Article 203.</strong> Expenditure charged on the fund, such as the Governor's emoluments, the salaries of High Court judges and debt charges, is not submitted to the vote of the Assembly, though it may be discussed. The rest is submitted as demands for grants.</li>
<li><strong>Article 204.</strong> After grants are made, an Appropriation Bill authorises withdrawal from the fund, and no amendment may vary the amount or destination of a voted grant.</li>
<li><strong>Article 205.</strong> Supplementary, additional or excess grants where the voted amount proves insufficient or where money was spent in excess of it.</li>
<li><strong>Article 206.</strong> Vote on account, vote of credit and exceptional grant.</li>
<li><strong>Article 207.</strong> A financial Bill making provision for expenditure or taxation may be introduced only on the Governor's recommendation, and only in the Assembly.</li>
<li><strong>Article 266 and 267(2).</strong> Consolidated Fund and Public Account of the State, and the Contingency Fund of the State.</li>
<li><strong>Article 151(2).</strong> The Comptroller and Auditor General's report on the state accounts goes to the Governor, who lays it before the legislature, where the Public Accounts Committee takes it up.</li>
</ul>
<h2>The two classifications you must never mix</h2>
<p>Receipts are revenue or capital. Revenue receipts do not create a liability and do not reduce an asset: taxes, fees, royalties, grants. Capital receipts do one or the other: borrowings create a liability, recovery of loans and disinvestment proceeds reduce an asset.</p>
<p>Expenditure is revenue or capital on the same logic. Salaries, pensions, interest and subsidies are revenue; a bridge or a new building is capital. A loan given by the state to a corporation is capital expenditure even though no asset is built by the state itself, because it creates a claim.</p>
<h2>The deficits, worked</h2>
<p>Take an illustrative state with these figures in crore rupees. Revenue receipts 1,60,000. Revenue expenditure 1,72,000. Capital expenditure 28,000. Non-debt capital receipts 2,000. Interest payments 18,000. Gross state domestic product 12,00,000.</p>
<ol>
<li>Revenue deficit equals 1,72,000 minus 1,60,000, that is 12,000 crore.</li>
<li>Total expenditure equals 1,72,000 plus 28,000, that is 2,00,000 crore.</li>
<li>Fiscal deficit equals total expenditure minus revenue receipts minus non-debt capital receipts, that is 2,00,000 minus 1,62,000, which is 38,000 crore. This is the borrowing requirement for the year.</li>
<li>Primary deficit equals fiscal deficit minus interest payments, that is 38,000 minus 18,000, which is 20,000 crore.</li>
<li>As a ratio, the fiscal deficit is 38,000 divided by 12,00,000, which is 3.17 per cent of gross state domestic product.</li>
</ol>
<p>Notice what the last two lines tell you. The primary deficit is smaller than the fiscal deficit by exactly the interest bill, so a state with a large accumulated debt can run a small primary deficit and still borrow heavily, simply to service the past.</p>
<h2>Transfers and limits</h2>
<p>The Finance Commission, appointed under Article 280, recommends the share of central taxes going to states as a whole and the formula distributing it among them. The Fifteenth Finance Commission recommended forty one per cent of the divisible pool for states for the period from 2021 to 2026, distributed on income distance, population as of 2011, area, forest and ecology, demographic performance and tax and fiscal effort. Beyond that share come grants in aid and centrally sponsored schemes with a state matching share.</p>
<p>On borrowing, Article 293 allows a state to borrow within India on the security of its Consolidated Fund, but requires the consent of the Union while any loan from the Union remains outstanding. That consent is where the annual net borrowing ceiling is set, and a state's own fiscal responsibility legislation fixes deficit and debt targets alongside it.</p>`,
      Advanced: `<p>Beyond the formulas, this section is examined on judgement: whether you can read a budget as a set of commitments rather than a set of intentions. That is also the practitioner's view, and it turns on three things, the quality of the deficit, the rigidity of the expenditure and the liabilities that are not in the document.</p>
<h2>Quality of the deficit</h2>
<p>Two states with the same fiscal deficit ratio can be in very different positions. Take the illustration above, 38,000 crore of borrowing with a revenue deficit of 12,000 crore. That means 12,000 crore of the borrowing financed consumption and only 26,000 crore financed asset creation. The ratio of revenue deficit to fiscal deficit is therefore the single most informative line in a state budget, and an answer that quotes only the fiscal deficit ratio has skipped it.</p>
<p>The corollary is that a state can improve its headline deficit by cutting capital expenditure, because capital spending is discretionary within the year and salaries are not. Compression of capital expenditure to meet a target is the most common form of adjustment, and it shows up as an under-spend against the budget estimate rather than as a policy announcement.</p>
<h2>Rigidity: what cannot be cut</h2>
<ul>
<li><strong>Committed expenditure</strong> is salaries, pensions and interest. It recurs, it grows, and it is legally or contractually fixed. Its share of revenue receipts is the measure of how much room the government actually has.</li>
<li>Interest is the compounding item. A state that borrows to meet a revenue deficit adds to next year's interest bill, which enlarges next year's revenue deficit. This is the debt trap mechanism, and you should be able to state it in one sentence.</li>
<li>Pension liability grows with longevity and with pay revision, and the shift of newer recruits to a contributory scheme changes the profile slowly rather than quickly, because existing pensioners remain on the old basis.</li>
</ul>
<h2>Off-budget liabilities and guarantees</h2>
<p>A state can keep borrowing out of its own budget by having a corporation borrow instead, against a state guarantee, with the repayment met from budgetary support in later years. The activity is real, the asset is real, and the debt is real, but only the guarantee appears in the budget documents, as a <strong>contingent liability</strong>. Three consequences follow, and each is examinable.</p>
<ol>
<li>The reported fiscal deficit understates the state's actual borrowing for that year.</li>
<li>The future budget carries a servicing obligation that was never voted as expenditure when it was incurred.</li>
<li>The Union has responded by counting some such borrowings against the state's net borrowing ceiling under Article 293, which converts the practice into a reduction in permitted market borrowing later.</li>
</ol>
<p>Guarantee ceilings in state fiscal responsibility legislation exist for exactly this reason, and the audit reports of the Comptroller and Auditor General are the standard source for the numbers.</p>
<h2>The revenue side, read critically</h2>
<ul>
<li>The goods and services tax moved a large part of state taxation into a shared, Council determined regime, so the state's discretion over rates shrank. What remains fully within state control is excise on liquor, stamps and registration, motor vehicle tax, tax on petroleum products outside the goods and services tax, and land revenue. Those are the levers a state actually pulls in a shortfall year.</li>
<li>Stamps and registration receipts move with the property market, so they are the most cyclical major head and the most likely to miss a budget estimate.</li>
<li>Tax devolution is a share of a pool the state does not control, so a shortfall in central collections transmits directly into state receipts regardless of the state's own effort.</li>
<li>Cesses and surcharges levied by the Union are outside the divisible pool, so a rise in their share of central revenue reduces what is available for devolution. This is the standard fiscal federalism argument raised by states, and it should be attributed as an argument advanced by states rather than asserted as a settled conclusion.</li>
</ul>
<h2>Examination technique</h2>
<p>For a calculation, write the four formulas down first and then substitute; most lost marks come from adding capital receipts into the revenue side. For a descriptive answer, structure it as receipts, expenditure, deficit, debt, and finish with one sentence on off-budget liabilities. That last sentence is what separates a prepared answer from a textbook one.</p>`,
      Expert: `<p>Formula card and article card.</p>
<h2>Deficits</h2>
<table>
<tr><td><strong>Revenue deficit</strong></td><td>Revenue expenditure - revenue receipts</td></tr>
<tr><td><strong>Fiscal deficit</strong></td><td>Total expenditure - (revenue receipts + non-debt capital receipts)</td></tr>
<tr><td><strong>Primary deficit</strong></td><td>Fiscal deficit - interest payments</td></tr>
<tr><td><strong>Effective revenue deficit</strong></td><td>Revenue deficit - grants for creation of capital assets</td></tr>
</table>
<p>Worked set to have memorised: revenue receipts 1,60,000; revenue expenditure 1,72,000; capital expenditure 28,000; non-debt capital receipts 2,000; interest 18,000. Revenue deficit 12,000. Fiscal deficit 38,000. Primary deficit 20,000. On a state product of 12,00,000, the fiscal deficit ratio is 3.17 per cent.</p>
<h2>Articles</h2>
<table>
<tr><td><strong>199</strong></td><td>Money Bill, state</td></tr>
<tr><td><strong>202</strong></td><td>Annual financial statement</td></tr>
<tr><td><strong>203</strong></td><td>Charged expenditure not voted; demands for grants</td></tr>
<tr><td><strong>204</strong></td><td>Appropriation Bill</td></tr>
<tr><td><strong>205</strong></td><td>Supplementary, additional and excess grants</td></tr>
<tr><td><strong>206</strong></td><td>Vote on account, vote of credit, exceptional grant</td></tr>
<tr><td><strong>207</strong></td><td>Financial Bills require the Governor's recommendation</td></tr>
<tr><td><strong>266, 267(2)</strong></td><td>Consolidated Fund and Public Account; Contingency Fund of the State</td></tr>
<tr><td><strong>280</strong></td><td>Finance Commission</td></tr>
<tr><td><strong>293</strong></td><td>State borrowing; Union consent while a Union loan is outstanding</td></tr>
<tr><td><strong>151(2)</strong></td><td>CAG report on state accounts, laid before the legislature</td></tr>
</table>
<h2>Two-line rules</h2>
<ul>
<li>Borrowing is a capital receipt, never revenue. Putting it on the revenue side breaks every deficit in the question.</li>
<li>Charged expenditure is discussed but not voted. Voted grants cannot be amended at the Appropriation Bill stage.</li>
<li>Revenue deficit over fiscal deficit tells you how much borrowing went into consumption. Quote that ratio.</li>
<li>Cutting capital expenditure is the easiest way to meet a deficit target and the most common one.</li>
<li>A guarantee is a contingent liability, invisible in the deficit until it is invoked.</li>
<li>Cesses and surcharges sit outside the divisible pool. States argue this shrinks devolution; state it as their argument.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "Revenue receipts are 1,60,000 crore, revenue expenditure 1,72,000 crore, capital expenditure 28,000 crore and non-debt capital receipts 2,000 crore. What is the fiscal deficit?",
        options: ["12,000 crore", "28,000 crore", "38,000 crore", "40,000 crore"],
        answer: 2,
        explanation:
          "Total expenditure is 2,00,000 crore and receipts other than borrowing are 1,62,000 crore, so the fiscal deficit is 38,000 crore, which is the year's borrowing requirement. The 12,000 crore option is the revenue deficit, and choosing it is the classic error of answering the deficit you calculated first rather than the one asked for.",
        difficulty: "Medium",
        skill: "Deficit measures and their arithmetic",
      },
      {
        n: 2,
        question:
          "On the same figures, with interest payments of 18,000 crore, the primary deficit is:",
        options: ["18,000 crore", "20,000 crore", "38,000 crore", "56,000 crore"],
        answer: 1,
        explanation:
          "Primary deficit is fiscal deficit minus interest payments, so 38,000 minus 18,000 gives 20,000 crore, and it isolates the gap created by this year's decisions from the cost of past borrowing. The 56,000 crore option comes from adding interest instead of subtracting it, which reverses the whole meaning of the measure.",
        difficulty: "Medium",
        skill: "Deficit measures and their arithmetic",
      },
      {
        n: 3,
        question:
          "Under Article 203, which category of expenditure is laid before the state legislature but not submitted to its vote?",
        options: [
          "Expenditure on centrally sponsored schemes",
          "Expenditure charged on the Consolidated Fund of the State",
          "Capital expenditure on new projects",
          "Expenditure met from the Contingency Fund",
        ],
        answer: 1,
        explanation:
          "Charged expenditure, which includes the Governor's emoluments, High Court judges' salaries and debt charges, may be discussed but is not voted, precisely so that these obligations do not depend on a majority. Contingency Fund expenditure is the tempting option because it also escapes prior voting, but it is regularised afterwards by a voted appropriation, so the legislature does vote on it in the end.",
        difficulty: "Hard",
        skill: "Annual financial statement and the state funds",
      },
      {
        n: 4,
        question: "Which of the following is a capital receipt of a state government?",
        options: [
          "Royalty received from mining leases",
          "Stamp duty on registration of a sale deed",
          "Recovery of a loan given earlier to a state corporation",
          "Grant in aid received from the Union for a scheme",
        ],
        answer: 2,
        explanation:
          "Recovery of a loan reduces a financial asset the state holds, which is exactly what makes a receipt capital rather than revenue. Royalty and stamp duty are current earnings that create no liability and reduce no asset, so both belong on the revenue side however large they are.",
        difficulty: "Medium",
        skill: "Revenue and capital classification",
      },
      {
        n: 5,
        question:
          "The Fifteenth Finance Commission recommended what share of the divisible pool of central taxes for the states for the period 2021 to 2026?",
        options: ["Thirty two per cent", "Forty one per cent", "Forty two per cent", "Fifty per cent"],
        answer: 1,
        explanation:
          "The recommendation was forty one per cent, and the reduction from the forty two per cent of the previous commission was on account of the reorganisation of Jammu and Kashmir into union territories. Forty two per cent is therefore the deliberately placed distractor, and remembering which commission recommended which share is the whole point of the question.",
        difficulty: "Medium",
        skill: "Finance Commission devolution",
      },
      {
        n: 6,
        question:
          "A state corporation borrows from a bank against a state guarantee, and the loan is to be repaid from budget support in later years. What is the immediate effect on the state's accounts?",
        options: [
          "The fiscal deficit rises by the amount borrowed in the year of borrowing",
          "The borrowing appears as revenue expenditure in the year it is spent",
          "Only a contingent liability is disclosed, so the reported fiscal deficit understates actual borrowing",
          "The loan is treated as a capital receipt of the state",
        ],
        answer: 2,
        explanation:
          "The borrowing sits on the corporation's books and the state discloses only the guarantee, so the year's reported deficit does not capture it even though the servicing obligation is real. Treating it as a state capital receipt is the tempting answer because the money funds state work, but the state is not the borrower, which is the entire purpose of routing it this way.",
        difficulty: "Hard",
        skill: "Borrowing limits and off-budget liabilities",
      },
      {
        n: 7,
        question:
          "Under Article 293, when does a state need the consent of the Government of India to raise a loan within India?",
        options: [
          "Whenever the loan exceeds the limit fixed by the state legislature",
          "Whenever any part of a loan made to the state by the Union remains outstanding",
          "Only when the loan is raised from a foreign source",
          "Only when the state has a revenue deficit in the preceding year",
        ],
        answer: 1,
        explanation:
          "Article 293 makes Union consent necessary so long as any Union loan to the state remains outstanding, and in practice this is where the annual net borrowing ceiling is fixed. The foreign source option is wrong for a different reason: states cannot borrow abroad at all, so consent does not arise there.",
        difficulty: "Hard",
        skill: "Borrowing limits and off-budget liabilities",
      },
    ],
  },
  30222: {
    topicId: 30222,
    title: "1948 to 1970: Mulki rules, Gentlemen's Agreement and 1969",
    summary:
      "Paper-IV opens with the period from the end of Hyderabad State to the agitation of 1969, and it is examined as a sequence of documents: a firman, a commission report, an agreement and a set of central formulas. You learn the dates and the institutions in order, and you learn to state contested claims as the claims of the people who made them.",
    concepts: [
      "Mulki rules and local employment",
      "Police Action and the merger of Hyderabad State",
      "States Reorganisation Commission recommendation",
      "Gentlemen's Agreement safeguards",
      "Telangana Regional Committee",
      "The 1969 agitation",
    ],
    glossary: {
      Mulki: "A local person, under rules first framed in the Nizam's administration, defined by a minimum period of residence in the dominions together with a declaration of permanent settlement. The word matters because government employment was tied to it.",
      "Police Action":
        "The military operation of September 1948 by which the Government of India took over Hyderabad State. It is also referred to as Operation Polo, and it ended the Nizam's separate rule.",
      Vishalandhra:
        "The proposal for a single large state for all Telugu speakers, combining the Telugu districts of the former Madras Presidency with the Telugu districts of Hyderabad State. It was the alternative to keeping Telangana separate.",
      "Regional Committee":
        "A committee of legislators from the Telangana region, created after 1956 to examine legislation and development proposals affecting the region. It could recommend, and the state government was expected to consult it.",
      "Telangana surpluses":
        "The claim that revenues raised in the Telangana region exceeded the expenditure incurred there, and that the difference was required by agreement to be spent in the region. The size of the surplus was itself the subject of enquiry.",
      "Non-Gazetted Officers":
        "State government employees below gazetted rank. Their union in Telangana was an organised body with a direct interest in the employment safeguards, and it became one of the principal actors in 1969.",
    },
    body: {
      Beginner: `<p>This period explains why Telangana became a separate state much later. It begins with a princely state ending, moves through an agreement between leaders, and ends with a large public agitation.</p>
<h2>The end of Hyderabad State</h2>
<p>Until 1948 the region was part of Hyderabad State, ruled by the Nizam. In September 1948 the Government of India carried out a military operation, usually called the <strong>Police Action</strong>, and Hyderabad State joined India. A military governor administered it, then a civil administrator, and in 1952 the state held its first elections and got an elected Chief Minister.</p>
<h2>The Mulki question</h2>
<p>Long before this, the Nizam's government had made rules saying that government jobs in the state should go to <strong>mulkis</strong>, that is, local people, defined by a minimum number of years of residence. After 1948 many people from outside came into government service. In 1952 students in Hyderabad protested about this, and the protest was put down by police firing. Employment for local people was therefore already a live issue years before any state was formed.</p>
<h2>How Andhra Pradesh was formed</h2>
<p>In 1953 a separate Andhra State was created out of the Telugu districts of Madras State. To settle boundaries across the whole country, the government appointed the States Reorganisation Commission. Its report, in 1955, said Telangana should stay a separate state for the time being, and that a merger with Andhra could be considered after the 1961 elections if the Telangana legislature agreed by a two thirds majority.</p>
<p>The merger happened sooner. In February 1956 leaders from both regions signed what became known as the <strong>Gentlemen's Agreement</strong>, a set of safeguards for Telangana in jobs, education, spending of its revenues and share in the cabinet. On 1 November 1956 Andhra Pradesh was formed.</p>
<h2>1969</h2>
<p>Over the following years many people in Telangana said the safeguards were not being honoured, particularly on jobs and on spending the region's surplus revenues in the region. In January 1969 students began a hunger strike in Khammam demanding implementation, and the protest spread across the region through that year. Students, government employees and political leaders took part. Hundreds of people died in police firing.</p>
<p>A political party, the Telangana Praja Samithi, was formed during the agitation and led by Marri Chenna Reddy. The central government announced plans to address the grievances. In the 1971 parliamentary election the party won most of the Telangana seats, and soon afterwards it merged with the Congress.</p>`,
      Intermediate: `<p>Paper-IV Section-I covers this period, and the questions are documentary. They ask which body said what, in which year, and what a named agreement provided. Learn the chain in order, because almost every question is a link in it.</p>
<h2>From Hyderabad State to Andhra Pradesh</h2>
<ol>
<li><strong>September 1948.</strong> The Police Action, also called Operation Polo, ends the Nizam's separate rule. A military administration under Major General J N Chaudhuri is followed by a civil administration under M K Vellodi.</li>
<li><strong>1952.</strong> The first general election in Hyderabad State makes Burgula Ramakrishna Rao Chief Minister. The same year sees the Mulki agitation in Hyderabad city over the appointment of non-locals in government service, put down by police firing.</li>
<li><strong>1 October 1953.</strong> Andhra State is formed from the Telugu districts of Madras State, with its capital at Kurnool, following the death of Potti Sriramulu on fast the previous December.</li>
<li><strong>December 1953.</strong> The States Reorganisation Commission is appointed under Fazl Ali, with K M Panikkar and H N Kunzru as members. It reports in September 1955.</li>
<li><strong>The recommendation.</strong> The Commission recorded the strength of feeling for a united Telugu state but recommended that the Telangana area remain a separate state for the time being, with the question of unification taken up after the general election of 1961, and then only if a two thirds majority of the Telangana legislature favoured it.</li>
<li><strong>20 February 1956.</strong> The Gentlemen's Agreement is concluded in Delhi between leaders of the two regions.</li>
<li><strong>1 November 1956.</strong> Andhra Pradesh is formed under the States Reorganisation Act. Hyderabad State is divided, its Marathi districts going to Bombay State and its Kannada districts to Mysore. Neelam Sanjiva Reddy becomes Chief Minister.</li>
</ol>
<h2>What the Gentlemen's Agreement actually provided</h2>
<ul>
<li>Revenues raised in Telangana, to the extent they exceeded expenditure in the region, to be reserved for expenditure on Telangana's development.</li>
<li>A residence requirement for recruitment to posts in the Telangana region, expressed as a minimum period of residence within the region.</li>
<li>Admissions to educational institutions in Telangana to be reserved for candidates of the region on a stated basis.</li>
<li>A Regional Standing Committee of Telangana legislators to consider legislation and development matters concerning the region.</li>
<li>If the Chief Minister came from one region, the Deputy Chief Minister was to come from the other, with an agreed proportion between the regions in the council of ministers.</li>
</ul>
<p>The <strong>Regional Committee</strong> for Telangana was set up in 1958 under a Presidential Order made in exercise of the power then available in Article 371. It is important to see what the Agreement was and was not. It was a political understanding between leaders, not a statute, and only parts of it were later given legal form. That distinction is the heart of the disagreement that followed, and examiners set it directly.</p>
<h2>The road to 1969</h2>
<p>Through the 1960s, leaders and employee organisations from Telangana argued that the employment safeguards were being circumvented and that the region's surplus revenues had not been spent in the region. Those arguing on the other side held that the figures were disputed and that appointments had followed rules as they were understood at the time. A committee under Justice Vashishta Bhargava was appointed in 1969 to determine the amount of the Telangana surplus, which tells you that the size of the claim itself was contested rather than agreed.</p>
<p>The agitation began in January 1969 with a hunger strike by students at Khammam demanding implementation of the safeguards, and spread through the region over the following months. Students, the Non-Gazetted Officers' association and political leaders were all involved. The Telangana Praja Samithi was formed during the agitation, with Marri Chenna Reddy emerging as its leader. Hundreds of people, many of them students, died in police firing, a toll the movement's own accounts place above three hundred.</p>
<p>The central response came as an accord in early 1969 and then as an eight point and later a five point set of measures dealing with employment, surpluses and administrative arrangements. In the parliamentary election of 1971 the Telangana Praja Samithi won ten of the fourteen seats in the region. Later that year the party merged with the Congress, and P V Narasimha Rao became the first Chief Minister of Andhra Pradesh from the Telangana region.</p>`,
      Advanced: `<p>A repeat attempter usually knows this sequence. The marks come from three things beyond it: precision about what a document said, neutrality about contested claims, and the ability to explain why the settlement of 1956 was structurally unstable rather than simply badly implemented.</p>
<h2>Read the Commission's recommendation carefully</h2>
<p>Candidates paraphrase the States Reorganisation Commission as having opposed a united state. That is not what the report did. It recorded that a united Telugu state was an aspiration held strongly in both regions, set out the case for it, and then set out the case for keeping Telangana separate for a period, resting on the region's different administrative history, its lower level of development in some respects, and the apprehension in Telangana about competition in employment and education. Its recommendation was conditional and sequenced: a separate state now, a decision after 1961, and a two thirds majority of the Telangana legislature as the test. An answer that reproduces the conditionality is stronger than one that reports a verdict the report did not give.</p>
<h2>The structural weakness of the 1956 settlement</h2>
<ol>
<li><strong>Status.</strong> The Gentlemen's Agreement was an understanding between political leaders. Some of its content was carried into executive orders and into the Regional Committee, but it was not a single enforceable instrument, so a dispute about compliance had no forum in which it could be decided.</li>
<li><strong>Measurement.</strong> The surplus safeguard required a figure that nobody had agreed on. Revenue and expenditure had to be attributed to a region within a single state budget, and attribution depends on the method chosen. The appointment of an enquiry in 1969 to determine the surplus is the evidence that the safeguard was written before the measurement problem was solved.</li>
<li><strong>Definition.</strong> The employment safeguard turned on residence, and residence is provable only through documents that the administration itself issues. A safeguard whose enforcement depends on certificates is a safeguard whose failure is difficult to demonstrate and easy to allege.</li>
<li><strong>Remedy.</strong> The Regional Committee could recommend. It could not appropriate money, appoint officers or veto a Bill. A body with recommendatory power is a channel for grievance, not a check.</li>
</ol>
<h2>Writing about contested claims</h2>
<p>This period carries live political disagreement, and the paper does not reward taking a side. The technique is to attribute. Write that the Telangana Non-Gazetted Officers' association and the Praja Samithi contended that appointments had been made in disregard of the residence requirement, that the state government of the day disputed the extent of the violation, and that the Bhargava enquiry was appointed because the surplus figure itself was in dispute. Each of those sentences is defensible from the record. A sentence beginning with an adjective about either side is not.</p>
<h2>Marginal marks in this section</h2>
<ul>
<li>Get the two 1952 events distinct: the first elected government of Hyderabad State, and the Mulki agitation in the city. Candidates merge them.</li>
<li>Do not confuse the formation of Andhra State in 1953 with the formation of Andhra Pradesh in 1956. They are separate events with separate causes, and questions are set on the gap between them.</li>
<li>Hyderabad State was divided three ways in 1956, not two. The Marathi speaking districts went to Bombay State and the Kannada speaking districts to Mysore. Options that describe a straight merger of Hyderabad State into Andhra are wrong on this point alone.</li>
<li>The 1969 agitation did not begin as a demand by a political party. It began with student action and employee organisations, and the party was formed during it. Sequence questions test exactly this.</li>
<li>The Mulki rules did not originate in 1956 or in 1969. They originate in the Nizam's administration, which is why they could be litigated later as pre-existing law.</li>
</ul>
<h2>Answer plan for a fifteen mark question</h2>
<p>Open with the constitutional and administrative starting point in 1948. Take the Commission's recommendation in its conditional form. Set out the Agreement as five safeguards in one list. Explain the three defects in status, measurement and remedy. Narrate 1969 as trigger, spread, actors, response. Close on 1971 with the electoral result and the merger of the Praja Samithi into the Congress, which is what carries the story into the next period.</p>`,
      Expert: `<p>Date and document recall.</p>
<h2>Sequence</h2>
<table>
<tr><td><strong>September 1948</strong></td><td>Police Action, also called Operation Polo; Hyderabad State comes under the Government of India</td></tr>
<tr><td><strong>1949</strong></td><td>Civil administration under M K Vellodi replaces the military governor</td></tr>
<tr><td><strong>1952</strong></td><td>First elected government of Hyderabad State, Burgula Ramakrishna Rao; separately, the Mulki agitation in Hyderabad city</td></tr>
<tr><td><strong>1 October 1953</strong></td><td>Andhra State formed from Madras State, capital Kurnool</td></tr>
<tr><td><strong>December 1953</strong></td><td>States Reorganisation Commission appointed: Fazl Ali, K M Panikkar, H N Kunzru</td></tr>
<tr><td><strong>September 1955</strong></td><td>Report submitted; separate Telangana for the time being, review after 1961, two thirds majority test</td></tr>
<tr><td><strong>20 February 1956</strong></td><td>Gentlemen's Agreement</td></tr>
<tr><td><strong>1 November 1956</strong></td><td>Andhra Pradesh formed; Hyderabad State divided three ways; Neelam Sanjiva Reddy Chief Minister</td></tr>
<tr><td><strong>1958</strong></td><td>Telangana Regional Committee constituted by Presidential Order under Article 371 as it then stood</td></tr>
<tr><td><strong>January 1969</strong></td><td>Student hunger strike at Khammam; agitation spreads</td></tr>
<tr><td><strong>1969</strong></td><td>Telangana Praja Samithi formed; Marri Chenna Reddy leads it; Bhargava enquiry into the surplus</td></tr>
<tr><td><strong>1971</strong></td><td>Praja Samithi wins ten of fourteen Lok Sabha seats in the region; merges with the Congress; P V Narasimha Rao becomes Chief Minister</td></tr>
</table>
<h2>The five safeguards, in one line each</h2>
<ul>
<li>Telangana surpluses reserved for expenditure in Telangana.</li>
<li>Residence requirement for recruitment to posts in the region.</li>
<li>Reservation of educational admissions for candidates of the region.</li>
<li>A Regional Standing Committee of Telangana legislators.</li>
<li>Deputy Chief Minister from the region not holding the chief ministership, with an agreed cabinet proportion.</li>
</ul>
<h2>Two-line rules</h2>
<ul>
<li>Andhra State 1953, Andhra Pradesh 1956. Two events, two causes.</li>
<li>Hyderabad State split three ways in 1956. Marathwada to Bombay, Kannada districts to Mysore, Telangana to Andhra Pradesh.</li>
<li>The Commission recommendation was conditional, not a verdict against a united state.</li>
<li>The Agreement was a political understanding, not a statute. No forum, therefore no remedy.</li>
<li>Mulki rules predate 1956 and come from the Nizam's administration. That is why they were litigable later.</li>
<li>1969 began with students and employees. The party came out of the agitation, not before it.</li>
<li>Attribute every claim about violation of the safeguards to the side that made it.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "What did the States Reorganisation Commission recommend in 1955 regarding the Telangana region?",
        options: [
          "Immediate merger with Andhra State to form a single Telugu speaking state",
          "That it remain a separate state for the time being, with unification considered after the 1961 election and only on a two thirds majority of the Telangana legislature",
          "That it be divided between Bombay State and Mysore State",
          "That it continue as a centrally administered area until a referendum was held",
        ],
        answer: 1,
        explanation:
          "The recommendation was conditional and sequenced: separate for the present, a review after the general election of 1961, and a two thirds majority of the Telangana legislature as the test for merger. The immediate merger option is tempting because the merger did happen in 1956, but it happened through a political agreement rather than on the Commission's recommendation, and reproducing that distinction is what the question is checking.",
        difficulty: "Medium",
        skill: "States Reorganisation Commission recommendation",
      },
      {
        n: 2,
        question:
          "Which of the following was NOT among the safeguards recorded in the Gentlemen's Agreement of February 1956?",
        options: [
          "Reservation of Telangana surplus revenues for expenditure in the region",
          "A residence requirement for recruitment to posts in the Telangana region",
          "A Regional Standing Committee of Telangana legislators",
          "A statutory right of the Telangana legislature to secede after ten years",
        ],
        answer: 3,
        explanation:
          "No right of secession appears anywhere in the Agreement, which dealt with revenues, employment, education, a Regional Committee and the composition of the ministry. The option is designed to attract candidates who blend the Agreement with the Commission's two thirds majority condition, which concerned a merger decision and not a later separation.",
        difficulty: "Medium",
        skill: "Gentlemen's Agreement safeguards",
      },
      {
        n: 3,
        question: "The Mulki rules are best described as:",
        options: [
          "Employment rules originating in the Nizam's administration that tied government posts to a minimum period of local residence",
          "Rules framed by the Andhra Pradesh government in 1956 to implement the Gentlemen's Agreement",
          "Land tenure rules governing jagir and inam holdings in Hyderabad State",
          "Rules issued in 1969 following the central government's eight point plan",
        ],
        answer: 0,
        explanation:
          "They originate in the Nizam's administration and define a local person by residence, which is why they existed as pre-existing law that could later be litigated. The 1956 option is attractive because residence based recruitment does appear in the Agreement, but the Agreement drew on rules that already existed rather than creating them.",
        difficulty: "Easy",
        skill: "Mulki rules and local employment",
      },
      {
        n: 4,
        question:
          "When Hyderabad State was reorganised on 1 November 1956, what happened to its territory?",
        options: [
          "It merged in its entirety with Andhra State to form Andhra Pradesh",
          "Its Telangana districts joined Andhra State, its Marathi districts went to Bombay State and its Kannada districts to Mysore",
          "It was retained as a separate state until the 1961 general election",
          "It was placed under President's rule pending a decision on unification",
        ],
        answer: 1,
        explanation:
          "Hyderabad State was divided on linguistic lines three ways, so only the Telangana districts went into the new Andhra Pradesh. The entire merger option is the most common error in this unit, and it matters because it misstates both the territory of the new state and the logic of linguistic reorganisation.",
        difficulty: "Medium",
        skill: "Police Action and the merger of Hyderabad State",
      },
      {
        n: 5,
        question:
          "Which statement about the Telangana Regional Committee constituted in 1958 is correct?",
        options: [
          "It could veto legislation of the state assembly relating to the region",
          "It was a committee of regional legislators with power to consider and recommend on matters affecting the region",
          "It was a body of civil servants appointed by the Governor",
          "It controlled the appropriation of the Telangana surplus revenues",
        ],
        answer: 1,
        explanation:
          "It was composed of legislators from the region and its powers were deliberative and recommendatory, which is exactly why grievances about non-implementation had no forum for decision. The veto option is tempting because a safeguard body sounds like a check, but a recommendatory body cannot block a Bill or appropriate money.",
        difficulty: "Hard",
        skill: "Telangana Regional Committee",
      },
      {
        n: 6,
        question: "How did the agitation of 1969 begin?",
        options: [
          "With a resolution of the Telangana Regional Committee",
          "With the formation of the Telangana Praja Samithi as a political party",
          "With a student hunger strike at Khammam demanding implementation of the safeguards",
          "With a strike by the state transport workers over wage arrears",
        ],
        answer: 2,
        explanation:
          "The agitation began with student action at Khammam in January 1969 and spread as employee organisations and political leaders joined it. The Praja Samithi option is the strong distractor because that party became the movement's political face, but it was formed during the agitation rather than starting it, and the sequence is exactly what is being tested.",
        difficulty: "Medium",
        skill: "The 1969 agitation",
      },
      {
        n: 7,
        question:
          "A committee under Justice Vashishta Bhargava was appointed in 1969. Its subject was:",
        options: [
          "Determining the amount of the Telangana surplus revenues",
          "Enquiring into the police firings during the agitation",
          "Recommending a formula for sharing river waters between the regions",
          "Reviewing the working of the Mulki rules in the city of Hyderabad",
        ],
        answer: 0,
        explanation:
          "The enquiry was into the size of the surplus, and its very appointment shows that the safeguard had been written before anyone had agreed how to measure the figure it depended on. The firings option is plausible in tone but describes a different kind of enquiry, and choosing it loses the analytical point about an unmeasurable safeguard.",
        difficulty: "Hard",
        skill: "Gentlemen's Agreement safeguards",
      },
    ],
  },
};

export default PART;
