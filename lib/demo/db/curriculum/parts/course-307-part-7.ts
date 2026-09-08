/**
 * Course 307: IBPS PO & Clerk, Prelims and Mains. Part 7.
 *
 * Topics 30719 to 30722: the banking, economy and general awareness module in
 * full, and the computer awareness topic that opens the module on computer
 * aptitude and the descriptive paper.
 *
 * These are the sections a candidate can finish in seconds once the system is
 * in their head, which is why they are taught as structures rather than as
 * lists. No policy rate, scheme outlay, premium, insurance ceiling, budget
 * figure or examination date is stated as a current fact anywhere in this file:
 * the policy statement, the notification or the scheme guideline is always
 * named as the authority instead. Every worked figure has been checked to
 * produce the number it claims.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  30719: {
    topicId: 30719,
    title: "Banking terms, RBI functions and monetary policy",
    summary:
      "The awareness section rewards the candidate who can place a term inside a system, not the one who has memorised a list of definitions. You build the Reserve Bank's statutory roles, the shape of the policy rate corridor, the reserve ratios and the vocabulary of asset quality that every banking question is written in.",
    concepts: [
      "Reserve Bank statutory functions",
      "Policy rate corridor",
      "Monetary Policy Committee",
      "Reserve requirements",
      "Monetary aggregates",
      "Asset quality and capital vocabulary",
    ],
    glossary: {
      "Liquidity Adjustment Facility":
        "The standing window through which the Reserve Bank lends to banks against government securities and absorbs their surplus funds, so that the overnight money market rate is held inside the band policy has chosen for it.",
      "Basis point":
        "One hundredth of one percentage point. A rate moved by twenty five basis points has moved by a quarter of one percent, and policy is announced in these units because at the size banks lend a quarter point is a large sum of money.",
      "Cash Reserve Ratio":
        "The share of a bank's net demand and time liabilities that it must keep as a balance with the Reserve Bank itself, earning nothing, so that raising it removes lendable money from the system altogether.",
      "Statutory Liquidity Ratio":
        "The share of net demand and time liabilities a bank must hold in cash, gold or approved securities on its own books. The money stays with the bank and keeps earning, which is why it is a solvency cushion rather than a withdrawal of liquidity.",
      "Non-performing asset":
        "A loan on which interest or principal has remained overdue beyond ninety days. From that point the bank must stop taking the income into its profit and must set aside a provision against the expected loss.",
      "Broad money":
        "Currency held by the public, plus demand deposits, plus the time deposits of the banking system. It is the aggregate policy watches, because it counts money that can be spent now and money that will be spent later.",
    },
    body: {
      Beginner: `<p>A commercial bank takes your deposit and lends it to somebody else. The <strong>Reserve Bank of India</strong>, written RBI, is not that kind of bank. It is the country's central bank. It issues the notes, it keeps the government's account, and it writes the rules every other bank has to follow. You will never open a savings account there.</p>
<h2>What the Reserve Bank does, in plain words</h2>
<ul>
<li><strong>Issues currency.</strong> Notes of two rupees and above carry the Governor's signature. The one rupee note and all coins are issued by the Government of India, although the Reserve Bank puts them into circulation.</li>
<li><strong>Banks the government.</strong> The central government and the state governments keep their accounts with it and borrow through it.</li>
<li><strong>Banks the banks.</strong> Every bank keeps a balance with the Reserve Bank and can borrow from it overnight when it is short of funds.</li>
<li><strong>Regulates and supervises.</strong> It licenses banks, inspects them and can act against one that is being run badly.</li>
<li><strong>Manages the rupee abroad.</strong> It holds the country's foreign exchange reserves and administers the exchange control law.</li>
</ul>
<h2>The rate you keep hearing about</h2>
<p>The <strong>repo rate</strong> is the rate at which the Reserve Bank lends to banks for a short period against government securities. When it rises, banks pay more for money and charge you more on a loan. When it falls, borrowing gets cheaper. That is the whole idea: one rate at the top, pushed down through the banking system into the loans ordinary people take.</p>
<p>Two more words you will need. <strong>Inflation</strong> is the general rise in prices over time. A <strong>basis point</strong> is one hundredth of one percent, so twenty five basis points is a quarter of a percent.</p>
<h2>Two ratios every bank must keep</h2>
<p>Out of everything a bank owes its depositors, it must park a small share with the Reserve Bank as a plain balance. That is the <strong>Cash Reserve Ratio</strong>, CRR. It must hold a second share in cash, gold or government securities on its own books. That is the <strong>Statutory Liquidity Ratio</strong>, SLR. Raise either one and the bank has less left to lend.</p>
<h2>When a loan goes bad</h2>
<p>If a borrower has not paid interest or an instalment for more than ninety days, the loan becomes a <strong>non-performing asset</strong>, an NPA. The bank must stop counting that interest as income and must keep money aside against the loss. Fix the ninety days now, because this word returns in question after question.</p>
<h2>How to study this section</h2>
<p>Do not learn the terms as a list. Learn where each one sits: who sets it, what it acts on, and what moves when it changes. A question that asks which rate forms the ceiling of the corridor is unanswerable from a list and easy from a picture.</p>`,
      Intermediate: `<p>In the officer main examination this section sets forty questions for forty marks and gives you thirty five minutes, with no calculation anywhere in it. That makes it the fastest scoring on the paper for a candidate who carries the system in their head, and the slowest for one who is trying to recover a definition. So build the system, and let the definitions hang off it.</p>
<h2>The roles, and the statute behind each</h2>
<table>
<thead><tr><th>Role</th><th>What it means in practice</th><th>Source</th></tr></thead>
<tbody>
<tr><td>Monetary authority</td><td>Sets the policy rate and the reserve ratios to hold inflation near the notified target</td><td>RBI Act 1934, as amended in 2016</td></tr>
<tr><td>Issuer of currency</td><td>Issues notes of two rupees and above; the one rupee note and all coins are issued by the central government</td><td>Section 22, RBI Act</td></tr>
<tr><td>Banker to government</td><td>Keeps the accounts of the centre and the states and manages their market borrowing</td><td>Sections 20 and 21, RBI Act</td></tr>
<tr><td>Banker to banks</td><td>Holds their reserve balances and lends to them against securities</td><td>Section 42, RBI Act</td></tr>
<tr><td>Regulator and supervisor</td><td>Licenses, inspects, issues directions and may supersede a bank board</td><td>Banking Regulation Act 1949</td></tr>
<tr><td>Manager of foreign exchange</td><td>Administers the exchange law and holds the reserves</td><td>FEMA 1999</td></tr>
<tr><td>Regulator of payment systems</td><td>Authorises and supervises the systems the rupee actually settles on</td><td>Payment and Settlement Systems Act 2007</td></tr>
</tbody>
</table>
<h2>The corridor</h2>
<p>Hold one narrow band in your head. In the middle of it sits the <strong>policy repo rate</strong>, at which the Reserve Bank lends to banks against government securities. Below it sits the <strong>Standing Deposit Facility</strong>, the floor, at which a bank parks surplus funds with the Reserve Bank and receives no collateral in return. Above it sits the <strong>Marginal Standing Facility</strong>, the ceiling, at which a bank borrows overnight and is permitted to dip into its own statutory securities to do so. The <strong>Bank Rate</strong> is aligned with that ceiling and moves with it.</p>
<p>The overnight money market rate is expected to stay inside the band, because no bank will lend to another below the floor it can already get, or borrow above the ceiling at which the Reserve Bank will lend to it. Learn the shape of the corridor and the fact that it is symmetric about the repo. The level on any given day belongs to the policy statement and changes; the shape does not.</p>
<h2>Who decides, and against what</h2>
<p>The <strong>Monetary Policy Committee</strong> has six members: the Governor, the Deputy Governor in charge of monetary policy and one officer nominated by the Bank, together with three external members appointed by the central government. It decides by majority and the Governor holds a second, casting vote when the votes are tied. It must meet at least four times a year and in practice meets once every two months. The inflation target and the tolerance band on either side of it are notified by the central government in consultation with the Bank, once in five years, and the target is set on headline consumer price inflation.</p>
<h2>The two reserve ratios, side by side</h2>
<table>
<thead><tr><th>Feature</th><th>Cash Reserve Ratio</th><th>Statutory Liquidity Ratio</th></tr></thead>
<tbody>
<tr><td>Held as</td><td>A balance with the Reserve Bank</td><td>Cash, gold or approved securities on the bank's own books</td></tr>
<tr><td>Computed on</td><td>Net demand and time liabilities</td><td>Net demand and time liabilities</td></tr>
<tr><td>Earns the bank</td><td>Nothing</td><td>The return on the securities it holds</td></tr>
<tr><td>Statute</td><td>Section 42, RBI Act 1934</td><td>Section 24, Banking Regulation Act 1949</td></tr>
<tr><td>Statutory ceiling</td><td>Removed by the 2006 amendment</td><td>Forty percent</td></tr>
</tbody>
</table>
<h2>Money, counted three ways</h2>
<p>M0, reserve money, is the Reserve Bank's own liability: currency in circulation plus bankers' deposits with it plus other deposits with it. M1, narrow money, is currency with the public plus demand deposits plus other deposits with the Reserve Bank. M3, broad money, is M1 plus time deposits with the banking system. When a paper asks which aggregate expanded, it is almost always asking about M3.</p>
<h2>Answer the placement, not the term</h2>
<p>Read an awareness question as three parts: who is the actor, what is the instrument, and what does the instrument act on. A stem that asks which of four items is not a quantitative tool becomes trivial once you have sorted tools into those that change the price or the quantity of money for everyone, and those that direct credit towards a chosen sector.</p>`,
      Advanced: `<p>A second attempt is rarely lost on coverage in this section. It is lost on distinctions, and the distinctions below are each set as a single option inside a four option elimination, which is exactly where a candidate who half knows the area gives the mark away.</p>
<h2>The floor changed, and the old instrument survived</h2>
<p>The floor of the corridor was once the fixed reverse repo rate, at which the Reserve Bank absorbed funds and handed over government securities as collateral. The Standing Deposit Facility now performs that job and takes the money without giving collateral, which releases the Bank's stock of securities for other operations. The fixed reverse repo has not been abolished; it remains available as an instrument. So read the stem carefully: a question about what forms the floor of the corridor and a question about what instruments exist have different answers.</p>
<h2>Bank Rate is not an independent lever</h2>
<p>The Bank Rate is the rate at which the Reserve Bank buys or rediscounts eligible bills, and it is kept aligned with the Marginal Standing Facility rate, so it moves whenever the ceiling moves. It survives because other provisions refer to it, notably the penalty a bank pays on a shortfall in its reserve requirement. A candidate who has learnt it as a fourth, separate policy rate answers a corridor question wrongly and never sees why.</p>
<h2>Quantitative against qualitative tools</h2>
<table>
<thead><tr><th>Quantitative, acts on everyone</th><th>Qualitative, acts on a chosen use of credit</th></tr></thead>
<tbody>
<tr><td>Policy repo rate and the standing facilities</td><td>Margin requirements on a secured advance</td></tr>
<tr><td>Cash Reserve Ratio and Statutory Liquidity Ratio</td><td>Selective credit control on a sensitive commodity</td></tr>
<tr><td>Open market operations in government securities</td><td>Consumer credit regulation</td></tr>
<tr><td>Market Stabilisation Scheme securities</td><td>Moral suasion and, at the limit, direct action</td></tr>
</tbody>
</table>
<h2>Failure of the target has a definition</h2>
<p>Flexible inflation targeting is not a slogan. The Act defines what counts as a failure: average inflation above the upper tolerance level for three consecutive quarters, or below the lower tolerance level for three consecutive quarters. On failure the Bank must report to the central government stating the reasons, the remedial action it proposes and an estimate of the time within which the target will be met. Options that offer a single quarter, or a single month's headline print, are testing whether you know that the measurement is an average over three quarters.</p>
<h2>Transmission is where policy actually fails</h2>
<p>A cut in the repo rate does not become a cut in a borrower's rate by itself. Floating rate retail loans and loans to micro and small enterprises are linked to an external benchmark and must be reset at least once in three months, so they follow the policy rate quickly in both directions. Older loans priced off the marginal cost of funds based lending rate follow slowly, because the cost of funds only falls as term deposits mature and are replaced. Deposits reprice slower than externally benchmarked loans, which is why a rate cutting cycle squeezes the margin and a rate raising cycle widens it. On the job this asymmetry is the entire agenda of an asset liability committee.</p>
<h2>Asset quality, in the right order</h2>
<p>Before the ninety day line an account sits in a special mention bucket: SMA-0 for one to thirty days overdue, SMA-1 for thirty one to sixty, SMA-2 for sixty one to ninety. Cross ninety days and it is a non-performing asset, classified <strong>substandard</strong>. Remain a non-performing asset for twelve months and it becomes <strong>doubtful</strong>. A <strong>loss asset</strong> is one where the loss has been identified but the amount has not yet been written off. The trap is in the second step: doubtful is defined by twelve months of having been a non-performing asset, not by twelve months of being overdue.</p>
<h2>The Indian capital minimum is not the Basel minimum</h2>
<p>Basel III sets a minimum total capital to risk weighted assets of eight percent. The Reserve Bank requires nine percent of banks in India, with the capital conservation buffer held on top of that. An option offering eight percent is not a misprint, it is the global floor, and the question is asking which one binds here.</p>
<h2>What goes wrong at a branch</h2>
<ul>
<li>Reserve maintenance is on a fortnightly average with a daily minimum, so a branch that runs its balance down late in the fortnight can breach the daily floor while the average still looks satisfied.</li>
<li>An account is classified by the record of recovery, not by the borrower's promise, so a part payment made to dress up a quarter end does not reset the ninety days.</li>
<li>Periodic updation of customer records is a supervisory obligation with a timetable, and a dormant account revived without it is a compliance finding waiting to happen.</li>
</ul>`,
      Expert: `<p>Recall sheet for the last month. Everything here is either a structural fact you should be able to state without opening a book, or a two line rule that settles an option pair.</p>
<h2>The corridor, top to bottom</h2>
<table>
<thead><tr><th>Level</th><th>Rate</th><th>Direction</th><th>Collateral</th></tr></thead>
<tbody>
<tr><td>Ceiling</td><td>Marginal Standing Facility, Bank Rate aligned to it</td><td>Bank borrows overnight</td><td>Yes, may dip into statutory securities</td></tr>
<tr><td>Centre</td><td>Policy repo rate</td><td>Bank borrows</td><td>Yes, government securities</td></tr>
<tr><td>Floor</td><td>Standing Deposit Facility</td><td>Bank parks surplus</td><td>None given</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>CRR sits with the Reserve Bank and earns nothing. SLR sits with the bank and keeps earning.</li>
<li>CRR has no statutory ceiling since 2006. SLR has a statutory ceiling of forty percent.</li>
<li>Repo injects liquidity. The Standing Deposit Facility absorbs it, and gives no security in exchange.</li>
<li>Notes of two rupees and above are the Reserve Bank's. The one rupee note and every coin are the central government's.</li>
<li>Ninety days makes a loan a non-performing asset. Twelve months as a non-performing asset makes it doubtful.</li>
<li>Basel minimum eight percent, Indian minimum nine percent, buffer on top of both.</li>
</ul>
<h2>Monetary Policy Committee, at a glance</h2>
<ul>
<li>Six members: three from the Reserve Bank, three appointed by the central government.</li>
<li>Majority decision, Governor holds the casting vote in a tie.</li>
<li>At least four meetings a year, in practice one every two months.</li>
<li>Target notified once in five years, on headline consumer price inflation, with a tolerance band either side.</li>
<li>Failure means the average is outside a tolerance level for three consecutive quarters, and triggers a report to the central government.</li>
</ul>
<h2>Aggregates</h2>
<ul>
<li>M0, reserve money: currency in circulation plus bankers' deposits with the Reserve Bank plus other deposits with it.</li>
<li>M1, narrow money: currency with the public plus demand deposits plus other deposits with the Reserve Bank.</li>
<li>M3, broad money: M1 plus time deposits with the banking system.</li>
</ul>
<h2>Checklist for the week the policy statement is released</h2>
<ol>
<li>Note the decision and the vote split, not only the rate.</li>
<li>Note the stance in the exact word used for it, because the stance is asked separately from the rate.</li>
<li>Note the projections for inflation and growth as directions of revision, upward or downward, rather than as decimals.</li>
<li>Note every developmental and regulatory measure announced alongside, because that annexure is where most of the year's banking awareness questions are quietly born.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question: "Which of the following is not done by the Reserve Bank of India?",
        options: [
          "Issuing currency notes of two rupees and above",
          "Keeping the accounts of the central and state governments",
          "Issuing the one rupee note and the coins in circulation",
          "Authorising and supervising payment and settlement systems",
        ],
        answer: 2,
        explanation:
          "The one rupee note and all coins are issued by the Government of India, and the Reserve Bank only distributes them, whereas notes of two rupees and above are issued by the Bank itself. The payment systems option tempts because the work feels governmental, but it is squarely the Bank's under the Payment and Settlement Systems Act 2007.",
        difficulty: "Easy",
        skill: "Reserve Bank statutory functions",
      },
      {
        n: 2,
        question:
          "In the liquidity adjustment corridor, which rate forms the ceiling, above the policy repo rate?",
        options: [
          "The Standing Deposit Facility rate",
          "The Marginal Standing Facility rate",
          "The Cash Reserve Ratio",
          "The Statutory Liquidity Ratio",
        ],
        answer: 1,
        explanation:
          "The Marginal Standing Facility is the rate at which a bank may borrow overnight from the Reserve Bank, dipping into its own statutory securities to do so, and it sits above the repo as the ceiling of the corridor. The Standing Deposit Facility is the attractive wrong answer because it is the other standing facility, but it absorbs funds and therefore forms the floor, not the ceiling.",
        difficulty: "Medium",
        skill: "Policy rate corridor",
      },
      {
        n: 3,
        question: "How is the Monetary Policy Committee constituted?",
        options: [
          "Six members, three from the Reserve Bank and three appointed by the central government, with the Governor holding a casting vote",
          "Six members, all appointed by the central government, with decisions taken unanimously",
          "Four members, all from the Reserve Bank, chaired by the Governor",
          "Six members nominated by the Reserve Bank, with the Finance Secretary voting",
        ],
        answer: 0,
        explanation:
          "The committee is six strong and deliberately balanced, three from the Bank and three external members appointed by the central government, deciding by majority with the Governor casting the deciding vote if the six are split. The all government option is tempting because the inflation target itself is notified by the central government, but the target and the committee are separate matters and the committee's composition is halved by design.",
        difficulty: "Medium",
        skill: "Monetary Policy Committee",
      },
      {
        n: 4,
        question:
          "A bank has net demand and time liabilities of ₹80,000 crore. If the Cash Reserve Ratio is raised by 50 basis points, how much additional balance must it maintain with the Reserve Bank?",
        options: ["₹40 crore", "₹400 crore", "₹4,000 crore", "₹800 crore"],
        answer: 1,
        explanation:
          "Fifty basis points is half of one percent, so the extra requirement is 0.005 x 80,000 = ₹400 crore. The ₹4,000 crore option comes from reading fifty basis points as five percent, which is the single most common slip with this unit: one basis point is one hundredth of a percentage point, not one tenth.",
        difficulty: "Medium",
        skill: "Reserve requirements",
      },
      {
        n: 5,
        question: "How is the Statutory Liquidity Ratio held by a bank?",
        options: [
          "As an interest free balance with the Reserve Bank of India",
          "In cash, gold or approved securities on the bank's own books",
          "As a deposit with the Deposit Insurance and Credit Guarantee Corporation",
          "As a refinance line kept open with NABARD",
        ],
        answer: 1,
        explanation:
          "SLR assets stay with the bank in the form of cash, gold or approved securities, so the bank continues to earn on them, and the requirement acts as a solvency cushion under Section 24 of the Banking Regulation Act. The first option is the classic confusion with CRR, which really is an interest free balance parked with the Reserve Bank and therefore does withdraw money from the system.",
        difficulty: "Medium",
        skill: "Reserve requirements",
      },
      {
        n: 6,
        question: "Which monetary aggregate is described as broad money?",
        options: ["M0", "M1", "M2", "M3"],
        answer: 3,
        explanation:
          "M3 is broad money: narrow money M1 together with the time deposits of the banking system, which is why it is the aggregate quoted when money supply growth is discussed. M1 is the tempting choice because it contains the money people actually spend, but it excludes time deposits and is called narrow money for exactly that reason.",
        difficulty: "Easy",
        skill: "Monetary aggregates",
      },
      {
        n: 7,
        question:
          "Interest on a term loan account has stayed overdue for 100 days and nothing else is wrong with the account. How is it classified?",
        options: [
          "Standard asset in the SMA-2 bucket",
          "Non-performing asset, classified substandard",
          "Non-performing asset, classified doubtful",
          "Loss asset",
        ],
        answer: 1,
        explanation:
          "Beyond ninety days overdue the account crosses into non-performing territory and begins life there as substandard. Doubtful is the attractive wrong answer, but that classification arrives only after the account has been a non-performing asset for twelve months, and SMA-2 stops at ninety days, so it cannot cover a hundred.",
        difficulty: "Hard",
        skill: "Asset quality and capital vocabulary",
      },
      {
        n: 8,
        question:
          "Under the flexible inflation targeting framework, what amounts to a failure to maintain the inflation target?",
        options: [
          "Headline inflation crossing the upper tolerance level in any single month",
          "Average inflation staying outside a tolerance level for three consecutive quarters",
          "Core inflation staying above the central target for two consecutive quarters",
          "Any deviation of headline inflation from the central target during a financial year",
        ],
        answer: 1,
        explanation:
          "Failure is defined statutorily as average inflation above the upper tolerance level for three consecutive quarters or below the lower tolerance level for three consecutive quarters, at which point the Bank must report to the central government with reasons and remedial action. The single month option is tempting because monthly prints are what the news reports, but the framework is deliberately built on an average across quarters so that one volatile month cannot trigger it.",
        difficulty: "Hard",
        skill: "Monetary Policy Committee",
      },
    ],
  },
  30720: {
    topicId: 30720,
    title: "Financial awareness, schemes and budget headlines",
    summary:
      "Financial awareness is the half of this section that is not about the Reserve Bank: the inclusion architecture, the social security schemes that ride on it, the regulators of the non-banking financial world and the vocabulary of the union budget. You learn a reading method that turns any new scheme into four facts and any budget headline into a deficit you can compute.",
    concepts: [
      "Financial inclusion architecture",
      "Social security scheme design",
      "Budget documents and constitutional provisions",
      "Deficit definitions",
      "Regulator mapping",
      "Reading a scheme for the exam",
    ],
    glossary: {
      "Fiscal deficit":
        "The gap between everything the government spends in a year and everything it receives other than by borrowing. It is therefore the amount it has to borrow that year, and it is quoted as a share of gross domestic product so that years of different sizes can be compared.",
      "Annual Financial Statement":
        "The statement of estimated receipts and expenditure that Article 112 of the Constitution requires to be laid before Parliament for each financial year. The word budget appears nowhere in the Constitution; this document is what the word means.",
      "Consolidated Fund of India":
        "The account into which all revenues, all loans raised and all repayments received by the central government flow, and out of which no rupee may be drawn except under an authority given by Parliament.",
      "Direct benefit transfer":
        "Payment of a benefit into the beneficiary's own bank account rather than through a chain of offices or in kind, which is why a bank account, an identity number and a mobile number together became the pre-condition for most current schemes.",
      "Priority sector lending":
        "The obligation on a bank to place a notified share of its adjusted net bank credit with sectors identified as under-served, agriculture and small enterprise among them, so that credit reaches borrowers whom a purely commercial allocation would skip.",
      "Vote on account":
        "A grant that lets the government draw from the Consolidated Fund for part of a year before the full budget has been passed, used when the annual exercise cannot be completed in time.",
    },
    body: {
      Beginner: `<p>Financial awareness asks about the money system outside the Reserve Bank: who runs a scheme, who regulates an industry, and what the words in a budget report mean. None of it needs mathematics beyond subtraction. It needs you to know where things sit.</p>
<h2>Bank accounts came first</h2>
<p>Most welfare payments now reach a person by going straight into their own bank account. That is called a <strong>direct benefit transfer</strong>. It only works if the person has three things: a bank account, an identity number and a mobile number. Getting all three into the hands of almost everybody was the point of the national financial inclusion drive, and the basic no frills account opened under it carries no minimum balance requirement.</p>
<h2>Small insurance and small pension</h2>
<p>Once a person has an account, small products can be attached to it and the premium taken by auto debit. Three schemes are asked about again and again.</p>
<ul>
<li>A <strong>life cover</strong> scheme, open to account holders in a defined younger age band, paying out on death from any cause during the year of cover.</li>
<li>An <strong>accident cover</strong> scheme, open across a wider age band, paying out only on death or disability caused by an accident.</li>
<li>A <strong>guaranteed pension</strong> scheme for workers in the unorganised sector, where you choose a pension slab, contribute monthly until sixty, and the contribution is smaller the earlier you join.</li>
</ul>
<p>Learn what each covers and who can join. The premium and the payout are revised by the government from time to time, so take those from the current scheme guideline rather than from a coaching handout.</p>
<h2>Who regulates whom</h2>
<table>
<thead><tr><th>Industry</th><th>Regulator</th></tr></thead>
<tbody>
<tr><td>Banks and payment systems</td><td>Reserve Bank of India</td></tr>
<tr><td>Stock market, mutual funds</td><td>Securities and Exchange Board of India</td></tr>
<tr><td>Insurance companies</td><td>Insurance Regulatory and Development Authority of India</td></tr>
<tr><td>Pension funds, National Pension System</td><td>Pension Fund Regulatory and Development Authority</td></tr>
</tbody>
</table>
<h2>Three budget words</h2>
<p><strong>Revenue receipts</strong> are what the government earns and does not have to give back, mainly taxes. <strong>Capital expenditure</strong> is money spent on something that lasts, such as a road. The <strong>fiscal deficit</strong> is the amount the government must borrow because its spending is larger than its receipts. If you know only those three, most budget headlines become readable.</p>
<h2>What to do with a new scheme</h2>
<p>When you meet a scheme in the news, write four things and nothing else: the ministry that runs it, the group it is meant for, how the benefit reaches that group, and the year it began. Those four are what gets asked. The outlay in rupees is what gets forgotten.</p>`,
      Intermediate: `<p>This half of the awareness section is a map, not a memory test. Three maps, in fact: the inclusion architecture, the regulator grid and the budget vocabulary. Draw each one properly and almost every question you meet is a lookup on a map you already hold.</p>
<h2>The inclusion architecture, in the order it was built</h2>
<ol>
<li><strong>An account for every household.</strong> The national financial inclusion mission opened basic savings bank deposit accounts with no minimum balance requirement, a debit card on the domestic card network, and a small overdraft available after the account has been operated satisfactorily for a period.</li>
<li><strong>An identity to address it to.</strong> A unique identity number, seeded into the account, allows a payment to be sent to a person rather than to a branch and account number the department has to maintain.</li>
<li><strong>A mobile number to confirm it.</strong> The phone carries the alert, the one time password and, through the unified payments interface, the ability to spend the balance without visiting anybody.</li>
</ol>
<p>Those three together are what is meant when a paper refers to the trinity of account, identity and mobile. Its purpose is a single rail: the government credits a subsidy or a pension into the account and the intermediate offices that used to handle it are removed from the path.</p>
<h2>Social security riding on the account</h2>
<table>
<thead><tr><th>Scheme type</th><th>Covers</th><th>Age band</th><th>How the premium is paid</th></tr></thead>
<tbody>
<tr><td>Life insurance scheme</td><td>Death from any cause, one year renewable term</td><td>Younger band, with cover continuing to a stated exit age</td><td>Annual auto debit from the savings account</td></tr>
<tr><td>Accident insurance scheme</td><td>Accidental death, and permanent total or partial disability</td><td>A wider band, up to a higher exit age</td><td>Annual auto debit from the savings account</td></tr>
<tr><td>Guaranteed pension scheme</td><td>A fixed monthly pension from sixty, to the subscriber and then the spouse</td><td>Working age entry, contribution until sixty</td><td>Monthly, quarterly or half yearly auto debit</td></tr>
</tbody>
</table>
<p>The distinctions the paper actually tests are these: any cause of death against accident only, the age band, and the fact that a subscriber may hold one such cover through one account even if several accounts exist. Premiums and sums assured are revised by notification, so take them from the current scheme guideline.</p>
<h2>Credit schemes, kept apart</h2>
<p>Do not merge the credit schemes into one list. A micro enterprise refinance scheme lends to a non-farm income generating activity through banks and microfinance institutions in graded categories by loan size. A collateral free credit guarantee scheme covers the lender's loss on a small enterprise loan rather than lending anything itself. A self help group linkage programme lends to a group whose members have already saved together and lent internally, and the group's own record is the credit history. Each answers a different question: who lends, who bears the risk, and who is the borrower.</p>
<h2>The budget, as documents</h2>
<ul>
<li>The <strong>Annual Financial Statement</strong> is required by Article 112. It is the budget in constitutional language.</li>
<li>The <strong>Demands for Grants</strong> are voted by the Lok Sabha, which may reduce or reject but not increase a demand.</li>
<li>The <strong>Finance Bill</strong> gives effect to the tax proposals and is a Money Bill under Article 110.</li>
<li>The <strong>Appropriation Bill</strong> authorises withdrawal from the Consolidated Fund once the demands are voted.</li>
<li>Three funds sit behind all of it: the Consolidated Fund, the Contingency Fund at the disposal of the President for unforeseen expenditure, and the Public Account, which holds money the government merely keeps for others.</li>
</ul>
<h2>The deficits, computed once</h2>
<p>Take these figures as illustrative rather than as any actual budget. Revenue receipts ₹30,00,000 crore, non-debt capital receipts ₹80,000 crore, total expenditure ₹48,00,000 crore, of which revenue expenditure is ₹37,00,000 crore, interest payments are ₹11,60,000 crore and grants for creation of capital assets are ₹3,50,000 crore.</p>
<ul>
<li><strong>Fiscal deficit</strong> is total expenditure minus receipts other than borrowing: 48,00,000 minus 30,80,000, which is ₹17,20,000 crore.</li>
<li><strong>Revenue deficit</strong> is revenue expenditure minus revenue receipts: 37,00,000 minus 30,00,000, which is ₹7,00,000 crore.</li>
<li><strong>Primary deficit</strong> is fiscal deficit minus interest payments: 17,20,000 minus 11,60,000, which is ₹5,60,000 crore.</li>
<li><strong>Effective revenue deficit</strong> is revenue deficit minus grants for creation of capital assets: 7,00,000 minus 3,50,000, which is ₹3,50,000 crore.</li>
</ul>
<p>Check the arithmetic once and the four definitions stop needing memory. Capital expenditure here is 48,00,000 minus 37,00,000, which is ₹11,00,000 crore, and it is worth recomputing that as a habit because a stem often gives you the pieces in a different order.</p>`,
      Advanced: `<p>Scheme questions are set from the design of a scheme, which is stable, and almost never from its outlay, which is not. So the useful preparation is a set of discriminations sharp enough to survive four similar looking options.</p>
<h2>The four discriminations that decide scheme questions</h2>
<table>
<thead><tr><th>Ask</th><th>Why it separates options</th></tr></thead>
<tbody>
<tr><td>Which ministry runs it</td><td>Rural livelihood, urban livelihood, skill development and micro enterprise schemes look alike in a headline and sit under different ministries</td></tr>
<tr><td>Who is the beneficiary</td><td>A landholding farmer, a landless labourer, a self help group member and a registered micro enterprise are four different target groups</td></tr>
<tr><td>Is it credit, subsidy, insurance or guarantee</td><td>A guarantee scheme lends nothing, and a refinance scheme lends to the lender rather than to the borrower</td></tr>
<tr><td>Who bears the loss</td><td>This is the question a banking paper prefers, because it is the one a bank officer must answer at a desk</td></tr>
</tbody>
</table>
<h2>Guarantee against refinance, the pair that is most often confused</h2>
<p>A credit guarantee scheme charges the lender a fee and, if a covered loan fails, pays the lender an agreed share of the loss. No money reaches the borrower from the scheme, and the loan remains the bank's own asset. A refinance scheme instead supplies funds to the lending institution against a portfolio it has already created, so the borrower's terms are affected but the risk usually stays with the lender. If an option says a guarantee scheme provides collateral free loans, read it again: what it provides is cover that makes a collateral free loan possible.</p>
<h2>Priority sector, where the marks actually are</h2>
<p>The obligation is a share of adjusted net bank credit, or of the credit equivalent of off balance sheet exposure, whichever is higher. Within the overall obligation there are sub targets, notably for agriculture, for small and marginal farmers, for micro enterprises and for the weaker sections. Two mechanisms then exist for a bank that cannot originate enough of it: priority sector lending certificates, which trade the obligation between banks without transferring the underlying loan, and contributions to designated funds where a shortfall persists. A question that asks how a shortfall is handled is testing whether you know that the loan and the obligation can be separated.</p>
<h2>Budget traps set for a candidate who half remembers</h2>
<ul>
<li><strong>Revenue deficit is not fiscal deficit minus interest.</strong> That is the primary deficit. Revenue deficit compares revenue expenditure with revenue receipts and ignores the capital account entirely.</li>
<li><strong>Non-debt capital receipts are receipts.</strong> Recovery of loans and disinvestment proceeds reduce the fiscal deficit; fresh borrowing does not, because borrowing is what the deficit measures.</li>
<li><strong>The Lok Sabha may reduce a demand, never raise it.</strong> Cut motions come in three forms: policy cut, economy cut and token cut.</li>
<li><strong>The Contingency Fund is at the disposal of the President</strong> and is recouped afterwards by parliamentary authorisation; the Public Account holds money the government owes back, so provident fund balances and small savings sit there rather than in the Consolidated Fund.</li>
<li><strong>A vote on account authorises expenditure, not taxation.</strong> Tax proposals still require the Finance Bill.</li>
</ul>
<h2>Regulators, at their boundaries</h2>
<p>The boundaries are where the questions live. A mutual fund is with the securities regulator even when a bank sponsors it. A bank's insurance subsidiary is regulated for insurance by the insurance regulator, while the bank's exposure to it is a Reserve Bank matter. The National Pension System is with the pension regulator, but the older statutory provident fund for organised sector employees is administered by its own organisation under a different ministry. Insolvency of a corporate borrower is with the insolvency board and its adjudicating tribunal, not with the lender's regulator, and that is exactly the option a candidate gets wrong under time.</p>
<h2>What goes wrong on the job</h2>
<p>At a branch the failure is rarely ignorance of a scheme's name. It is enrolling a customer in an insurance cover through a second account so that two premiums are debited for one life that can only be covered once, or classifying a loan under a priority sector category it does not qualify for, which the audit reverses at the year end and which pulls the branch below its sub target after the reporting date has passed.</p>`,
      Expert: `<p>Last month sheet. Structures, boundaries and one arithmetic strip.</p>
<h2>Deficit formulas, in the order they are asked</h2>
<table>
<thead><tr><th>Deficit</th><th>Formula</th><th>What it tells you</th></tr></thead>
<tbody>
<tr><td>Fiscal</td><td>Total expenditure minus receipts other than borrowing</td><td>How much must be borrowed this year</td></tr>
<tr><td>Revenue</td><td>Revenue expenditure minus revenue receipts</td><td>Borrowing that funds consumption rather than assets</td></tr>
<tr><td>Primary</td><td>Fiscal deficit minus interest payments</td><td>The deficit excluding the cost of past borrowing</td></tr>
<tr><td>Effective revenue</td><td>Revenue deficit minus grants for creation of capital assets</td><td>Revenue deficit after allowing for grants that do build assets</td></tr>
</tbody>
</table>
<h2>Constitutional hooks</h2>
<ul>
<li>Article 112, Annual Financial Statement. Article 110, Money Bill and the Finance Bill.</li>
<li>Article 266, Consolidated Fund and Public Account. Article 267, Contingency Fund.</li>
<li>Article 265, no tax may be levied or collected except by authority of law.</li>
<li>Demands for Grants are voted only by the Lok Sabha and may be reduced, never increased.</li>
</ul>
<h2>Regulator grid</h2>
<ul>
<li>Reserve Bank: banks, non-banking financial companies, payment systems, foreign exchange, government debt.</li>
<li>Securities regulator: exchanges, listed companies, mutual funds, alternative investment funds.</li>
<li>Insurance regulator: insurers, intermediaries, policyholder protection.</li>
<li>Pension regulator: National Pension System and the guaranteed pension scheme for the unorganised sector.</li>
<li>Insolvency board: insolvency professionals and the process, adjudicated by the company law tribunal.</li>
</ul>
<h2>Scheme recall, four fields only</h2>
<p>For every scheme in your file, be able to state: the ministry, the target group, the instrument, and whether the benefit is credit, subsidy, insurance or a guarantee. If you cannot state all four, the entry is not yet revision ready. Do not carry outlays.</p>
<h2>Two line rules</h2>
<ul>
<li>Guarantee schemes pay the lender. Refinance schemes fund the lender. Neither pays the borrower.</li>
<li>Disinvestment proceeds cut the fiscal deficit. Borrowing does not, because borrowing is the deficit.</li>
<li>One person, one cover, one account, however many accounts they hold.</li>
<li>Priority sector obligation can be traded through a certificate; the loan itself stays where it was made.</li>
</ul>`,
    },
    questions: [
      {
        n: 1,
        question:
          "In an illustrative budget, total expenditure is ₹40,00,000 crore, revenue receipts are ₹25,00,000 crore, non-debt capital receipts are ₹1,00,000 crore and interest payments are ₹9,00,000 crore. What is the primary deficit?",
        options: ["₹14,00,000 crore", "₹5,00,000 crore", "₹15,00,000 crore", "₹23,00,000 crore"],
        answer: 1,
        explanation:
          "Fiscal deficit is 40,00,000 minus (25,00,000 plus 1,00,000), that is ₹14,00,000 crore, and the primary deficit is that figure minus interest payments, 14,00,000 minus 9,00,000, giving ₹5,00,000 crore. The ₹14,00,000 crore option is the fiscal deficit itself, chosen by a candidate who stops one step early and forgets that primary deficit strips out the cost of past borrowing.",
        difficulty: "Hard",
        skill: "Deficit definitions",
      },
      {
        n: 2,
        question:
          "Which article of the Constitution requires the Annual Financial Statement to be laid before Parliament?",
        options: ["Article 110", "Article 112", "Article 265", "Article 267"],
        answer: 1,
        explanation:
          "Article 112 requires a statement of estimated receipts and expenditure for each financial year, and that statement is what the word budget refers to. Article 110 is the attractive wrong answer because it is a budget related article, but it defines a Money Bill, which is the character of the Finance Bill rather than the budget statement itself.",
        difficulty: "Medium",
        skill: "Budget documents and constitutional provisions",
      },
      {
        n: 3,
        question:
          "Which of these is the correct trinity that made large scale direct benefit transfer workable?",
        options: [
          "A bank account, a unique identity number and a mobile number",
          "A bank account, a ration card and a mobile number",
          "A unique identity number, a rural employment card and a post office account",
          "A bank account, a permanent account number and a passbook",
        ],
        answer: 0,
        explanation:
          "The account receives the payment, the identity number makes the payment addressable to a person rather than to a branch record, and the mobile confirms and mobilises the balance, so all three are needed for a transfer to reach the intended person. The ration card option is tempting because ration entitlements are indeed delivered through this rail, but the card identifies a household entitlement and cannot receive a credit.",
        difficulty: "Easy",
        skill: "Financial inclusion architecture",
      },
      {
        n: 4,
        question:
          "What distinguishes a basic savings bank deposit account opened under the national financial inclusion mission?",
        options: [
          "It requires a minimum balance fixed by each bank",
          "It carries no minimum balance requirement and a limited number of free withdrawals in a month",
          "It may be opened only at a rural branch",
          "It cannot be converted into an ordinary savings account later",
        ],
        answer: 1,
        explanation:
          "The account is deliberately a no frills product: no minimum balance is required, a debit card is issued, and free services are capped at a stated number of withdrawals a month so that the bank can carry the account economically. The minimum balance option is what most savings accounts do require, which is exactly why it is the tempting distractor, and it is the one condition the design removes.",
        difficulty: "Medium",
        skill: "Financial inclusion architecture",
      },
      {
        n: 5,
        question:
          "One of the government backed insurance schemes attached to a savings account pays out only for death or disability caused by an accident. Which type of cover is that?",
        options: [
          "The life insurance scheme covering death from any cause",
          "The accident insurance scheme",
          "The guaranteed pension scheme for the unorganised sector",
          "The micro enterprise refinance scheme",
        ],
        answer: 1,
        explanation:
          "The accident scheme covers accidental death and permanent disability only, and it is offered across a wider age band because the risk it covers is not age driven in the same way. The life scheme is the tempting answer because both are auto debit covers on the same account, but it pays out on death from any cause and runs in a narrower age band.",
        difficulty: "Easy",
        skill: "Social security scheme design",
      },
      {
        n: 6,
        question: "Which body regulates the National Pension System?",
        options: [
          "The Insurance Regulatory and Development Authority of India",
          "The Securities and Exchange Board of India",
          "The Pension Fund Regulatory and Development Authority",
          "The Reserve Bank of India",
        ],
        answer: 2,
        explanation:
          "The pension regulator was created specifically for the National Pension System and the pension schemes built on it, and it supervises the pension fund managers and the central record keeping agency. The securities regulator is a tempting choice because the corpus is invested in market instruments, but regulating the investment products is not the same as regulating the pension scheme that buys them.",
        difficulty: "Medium",
        skill: "Regulator mapping",
      },
      {
        n: 7,
        question:
          "How does a credit guarantee scheme for small enterprise lending actually work?",
        options: [
          "It lends directly to the enterprise at a concessional rate",
          "It supplies funds to the bank against loans the bank has already made",
          "It charges the lender a fee and reimburses an agreed share of the loss if a covered loan fails",
          "It provides the collateral that the enterprise is unable to offer",
        ],
        answer: 2,
        explanation:
          "A guarantee scheme lends nothing at all; it takes a fee from the lender and pays a stated proportion of the loss when a covered loan turns bad, which is what makes a collateral free loan commercially possible. Option two describes refinance, a different instrument that funds the lender rather than covering its risk, and mixing the two is the most common error in this area.",
        difficulty: "Hard",
        skill: "Reading a scheme for the exam",
      },
      {
        n: 8,
        question:
          "You meet an unfamiliar scheme in a news roundup two months before the paper. Which detail is most worth recording?",
        options: [
          "The exact outlay announced for it in rupees",
          "The ministry that runs it and the group it targets",
          "The district in which it was formally launched",
          "The name of the official who announced it",
        ],
        answer: 1,
        explanation:
          "Questions are built from a scheme's design, so the ministry and the target group identify it uniquely and survive every later revision of its terms. The outlay is the tempting entry because it looks like a hard fact, but outlays are revised at every budget and a figure learnt from a roundup is the item most likely to be stale on the day of the paper.",
        difficulty: "Medium",
        skill: "Reading a scheme for the exam",
      },
    ],
  },
};

export default PART;
