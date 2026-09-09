/**
 * Course 316: Start Your Rural Micro-Enterprise, part 3.
 *
 * Topics 31609 to 31612: the legal form the unit trades under, the food,
 * weights and effluent rules a small manufacturing unit genuinely has to meet,
 * and the two habits that decide whether a lender can read the business at all,
 * namely keeping business money apart from household money and writing three
 * simple books by hand.
 *
 * Written for a first time owner who has never signed a deed or kept a ledger.
 * Worked examples use enterprises that exist in these districts, a millet
 * processing unit, a tailoring unit, a dairy and a small food unit. Every rupee
 * figure is illustrative and is there only to make a method visible. Statutory
 * structures are taught by their shape, never by a current fee, threshold,
 * subsidy or rate, because those move and a learner who memorises one of them
 * has learned the wrong thing.
 */

import type { AuthoredTopic } from "../types";

const PART: Record<number, AuthoredTopic> = {
  31609: {
    topicId: 31609,
    title: "Proprietorship, partnership and joining a producer body",
    summary:
      "The legal form your unit trades under decides who owns its assets, who pays when it cannot, and what a bank can lend against, and a first time owner usually picks it by accident rather than by decision. You compare a sole proprietorship, a partnership firm with a written deed and membership of a collective such as a self help group or a producer company, and learn what changes when you want to move from one to another.",
    concepts: [
      "Sole proprietorship",
      "Unlimited liability",
      "Partnership deed",
      "Firm registration",
      "Producer collective membership",
      "Changing the form later",
    ],
    glossary: {
      "Sole proprietorship":
        "A business owned by one person with no legal existence apart from that person, so the owner's own PAN, income and property stand behind everything the unit does. Nothing is filed to create it; you simply begin trading in a business name.",
      "Unlimited liability":
        "The position in which a creditor of the business may be paid out of the owner's personal assets once the business assets are exhausted, because in law there is no boundary between the two.",
      "Partnership deed":
        "The written agreement between partners recording capital brought in, the profit sharing ratio, the work each partner does, who may sign for the firm, and what happens when a partner joins, leaves or dies.",
      "Registered firm":
        "A partnership entered in the state Registrar of Firms record. Registration neither creates the firm nor limits liability; it decides whether the firm and its partners can enforce their rights through a civil court.",
      "Joint and several liability":
        "The rule that each partner is answerable for the whole of the firm's debt and not merely for a share of it, so a creditor may recover the full amount from whichever partner can pay.",
      "Producer company":
        "A body owned by primary producers, in which membership is tied to producing rather than to investing, voting is one member one vote regardless of shares held, and surplus is returned largely in proportion to the business each member does with it.",
    },
    body: {
      Beginner: `<p>Before you put a name on a signboard you have to decide what the enterprise is in the eyes of the law. For a first unit in a mandal town there are three practical answers. You run it alone. You run it with somebody else. Or you stay a member of a group, such as a self help group or a producer company, and part of your buying and selling happens through that group.</p>
<h2>Running it alone</h2>
<p>A <strong>sole proprietorship</strong> is not a separate body created by any office. Nothing is filed to bring it into existence. You begin trading under a business name, and the law treats you and the unit as one person. Your own PAN is the unit's PAN, the unit's income is your income, and every registration the unit takes stands in your name with the trade name written beside it.</p>
<p>The advantage is that you can start this week. The price is <strong>unlimited liability</strong>, which means that if the unit cannot pay a supplier, the supplier is entitled to be paid out of your personal savings, and in principle out of your other property as well. There is no wall between the shed and the household.</p>
<h2>Running it with somebody</h2>
<p>Two or more people who agree to run a business together and share its profit are a <strong>partnership</strong>. What they sign is a <strong>deed</strong>: a written paper saying who put in how much money, who does which work, how profit is divided, and what happens if one of them wants to leave. A partnership can exist with nothing written at all, and that is exactly the danger. Two brothers who start a dairy on an understanding are partners in law from the first day, and have nothing on paper the day they stop agreeing.</p>
<p>In a partnership each partner stands behind the whole debt of the firm, not a share of it. If your partner buys forty bags of grain in the firm's name and then withdraws from the work, the grain merchant may recover the entire amount from you.</p>
<h2>Being a member of a group</h2>
<p>Belonging to a self help group, a joint liability group or a producer company is not a substitute for deciding the form of your own unit. The group is a separate body with its own members, its own rules and its own accounts. You may save through it, borrow through it, buy inputs through it and sell produce through it, and your tailoring unit is still a proprietorship that has to keep its own records and pay its own dues.</p>
<h2>How to choose for a first unit</h2>
<ol>
<li>Your own money, your own skill, nobody else involved: proprietorship.</li>
<li>Money or daily work genuinely shared with another person: a partnership, with the deed written before the first purchase and not after the first quarrel.</li>
<li>Inputs cheaper or output better sold as a group: join the collective, and keep your unit's own form separate from it.</li>
</ol>`,
      Intermediate: `<p>Decide the form on four questions. Who owns the assets. Who pays when the unit cannot. What a bank can lend against. How hard it is to change later. Everything else about the three forms follows from those four.</p>
<h2>What each form requires</h2>
<table>
<thead><tr><th>Form</th><th>What brings it into existence</th><th>What a branch asks to see</th><th>Liability</th></tr></thead>
<tbody>
<tr><td>Sole proprietorship</td><td>Nothing. You begin trading in a business name</td><td>Your own KYC, plus documents in the business name such as the Udyam certificate, the trade licence or a tax registration</td><td>Unlimited, personal</td></tr>
<tr><td>Partnership firm</td><td>An agreement between the partners, normally a stamped written deed</td><td>The deed, the firm's own PAN, KYC of every partner, and a letter saying who may operate the account</td><td>Unlimited, joint and several</td></tr>
<tr><td>Limited liability partnership</td><td>Incorporation with the Registrar of Companies</td><td>Incorporation certificate, the LLP agreement, partner KYC, and the annual filings</td><td>Limited to the agreed contribution, with statutory exceptions</td></tr>
<tr><td>Producer company or cooperative society</td><td>Registration under the relevant law with the required number of producer members</td><td>Registration certificate, bye-laws and a board resolution</td><td>Member's liability limited to shares held</td></tr>
</tbody>
</table>
<h2>What belongs in a partnership deed</h2>
<p>The deed is worth an afternoon and a stamp paper, and a unit that skips it is not saving money, it is postponing a dispute. Put in every one of these:</p>
<ul>
<li>The firm's name, the business it will carry on and the place it works from.</li>
<li>Capital brought in by each partner, in money and in kind, with the kind valued in figures.</li>
<li>The profit and loss sharing ratio, and whether losses follow the same ratio.</li>
<li>Any salary to a working partner and any interest on capital, both stated as amounts or rates you have agreed between yourselves.</li>
<li>Who signs cheques, who may borrow, and the limit above which both signatures are needed.</li>
<li>The working hours or duties each partner owes, so that a partner who stops working can be dealt with.</li>
<li>Admission of a new partner, retirement of an existing one, and what happens on death.</li>
<li>How the assets are to be valued when somebody leaves, and how long the firm has to pay them out.</li>
<li>How a dispute is settled and where.</li>
</ul>
<h2>Registration decides what you can enforce</h2>
<p>A partnership firm may be entered in the register kept by the state Registrar of Firms. Registration does not create the firm and does not put any ceiling on liability. What it decides is enforcement. An unregistered firm cannot file a suit to enforce a contract against an outsider, and a partner of an unregistered firm cannot sue the firm or the other partners to enforce a right arising out of the deed. The careful deed then becomes difficult to use at the precise moment you need it.</p>
<h2>Where the collectives fit</h2>
<ul>
<li><strong>Self help group.</strong> Members save regularly, lend to each other from the pool, and the group as a whole is linked to a bank. Credit reaches you as a member of the group, and the group's own discipline decides how much reaches you.</li>
<li><strong>Joint liability group.</strong> A small group of people in a similar activity who guarantee each other's individual loans, so that the borrowing stays yours while the comfort is shared.</li>
<li><strong>Producer company.</strong> Members are producers, voting is one member one vote whatever the shareholding, and the surplus comes back mainly in proportion to the business each member did with the company. It buys inputs, aggregates output and sells at a scale no single member reaches.</li>
</ul>
<p>None of the three converts your unit into something else. They change what you can buy and where you can sell, and your own form still has to be decided.</p>`,
      Advanced: `<p>Almost nobody chooses badly between the three forms in the first month. The damage comes later, from clauses that were left out, from a form that quietly changed without anybody filing anything, and from a conversion done in the wrong order.</p>
<h2>The family partnership that nobody wrote down</h2>
<p>A dairy in Nalgonda is started by two brothers. One buys the animals, the other builds the shed on land in his own name and runs the collection. There is no deed. Three years on the unit is profitable, and every question that matters has no answer. Is the shed a firm asset or one brother's property. Is profit shared equally when the work is not. Is the second brother's son now a partner because he has been paid from the firm for two years. In law they are partners by conduct, and their rights come from a document that does not exist. Write the deed even when the partner is your brother, and especially when an asset stands in one partner's name while the firm uses it. Record such an asset either as capital brought in or as property let to the firm at a stated rent, and never leave it undescribed.</p>
<h2>Liability keeps running after you leave</h2>
<p>A retiring partner stays liable for what the firm did before he left, and remains exposed to later dealings as well unless the retirement has been made public and every regular supplier has been told in writing. Two steps close it: a public notice of retirement, and a written intimation to each supplier, banker and customer the firm dealt with. A partner who simply stops attending has changed nothing at all in law.</p>
<h2>Other traps worth naming</h2>
<ul>
<li><strong>The sleeping partner who is only sleeping in the deed.</strong> A partner who takes no part in the work is liable exactly like the rest. Investors who want a return without exposure should be lending to the firm on a written loan, not joining it.</li>
<li><strong>A minor made a partner.</strong> A minor may be admitted to the benefits of a partnership but cannot be made a full partner, and on attaining majority must decide within the prescribed period whether to stay in. Deeds drawn up to accommodate a son's share routinely get this wrong.</li>
<li><strong>Death of a partner.</strong> Unless the deed provides that the firm continues, the death of a partner dissolves the firm, which can interrupt the bank limit and the licences at the worst possible time.</li>
<li><strong>Two units under one PAN.</strong> A proprietor running a tailoring unit and a grain trading counter has one taxable person, one set of books that must reconcile, and one credit history. That can be an advantage or an exposure; it is never a separation.</li>
</ul>
<h2>Conversion is a sequence, not a form</h2>
<p>Adding a partner to a working proprietorship, or moving a partnership into a producer body, is a chain of steps and skipping one leaves the unit trading on paperwork that no longer describes it:</p>
<ol>
<li>Execute the deed or the incorporation first, because everything downstream quotes it.</li>
<li>Obtain the new entity's PAN. The proprietor's PAN does not carry across.</li>
<li>Open the new bank account and stop using the old one for business receipts.</li>
<li>Amend or re-apply for each registration. Registrations tied to a person, including tax registration and most licences, do not transfer to a firm by themselves.</li>
<li>Transfer the assets and stock formally, with a valuation and an entry in the books of both sides.</li>
<li>Tell the lender before, not after. A change of constitution usually requires a fresh sanction, fresh documents and fresh guarantees.</li>
<li>Check every scheme benefit you hold. Where a benefit was granted to a class of owner, eligibility is decided by ownership share and control, so a new profit sharing ratio can change your standing under it, and some assistance carries a condition against changing the unit's constitution within a lock-in period.</li>
</ol>
<p>Do this before a peak season, never during one. Conversions taken up in the middle of an order book are where units lose a limit for a month and pay for the material out of borrowed money.</p>`,
      Expert: `<p>Recall sheet on legal form. The comparison first, then the rules, then the sequence to run before signing anything.</p>
<h2>Form at a glance</h2>
<table>
<thead><tr><th>Line</th><th>Proprietorship</th><th>Partnership firm</th><th>Producer company or cooperative</th></tr></thead>
<tbody>
<tr><td>Separate legal person</td><td>No</td><td>No, though the firm holds a PAN</td><td>Yes</td></tr>
<tr><td>Created by</td><td>Trading</td><td>Agreement, normally a deed</td><td>Registration</td></tr>
<tr><td>Liability</td><td>Unlimited, personal</td><td>Unlimited, joint and several</td><td>Limited to shares held</td></tr>
<tr><td>Who decides</td><td>You</td><td>Deed, else equal say</td><td>One member one vote</td></tr>
<tr><td>Cost of running it</td><td>Almost nil</td><td>Low</td><td>Board, audit, filings</td></tr>
<tr><td>Continues after death</td><td>No</td><td>Only if the deed says so</td><td>Yes</td></tr>
<tr><td>Usual credit route</td><td>Loan on the owner</td><td>All partners as co-borrowers</td><td>Institutional, against the body</td></tr>
</tbody>
</table>
<h2>Two line rules</h2>
<ul>
<li>A partnership exists the moment two people share profit from a joint business. The deed does not create it, it only proves the terms.</li>
<li>Registration of a firm buys enforcement, not protection. Liability stays unlimited either way.</li>
<li>Every partner is liable for the whole debt. A share of profit is not a share of liability.</li>
<li>Membership of a collective is not a form of ownership for your own unit.</li>
<li>Retirement without public notice and written intimation to suppliers leaves the liability running.</li>
<li>Conversion order: deed, PAN, bank account, registrations, asset transfer, lender.</li>
</ul>
<h2>Edge cases</h2>
<ul>
<li><strong>Asset in one partner's name.</strong> Record it as capital introduced or as rented property with a rent figure. An undescribed asset becomes the dispute.</li>
<li><strong>Working partner's salary.</strong> Allowed only if the deed provides for it, so a partner drawing a salary under a silent deed is drawing profit in advance.</li>
<li><strong>Loss sharing.</strong> Where the deed is silent on losses, they follow the profit ratio. Say it anyway.</li>
<li><strong>Same trade name, two owners.</strong> A name is not protected by Udyam or a trade licence. If the name matters, that is a trade mark question and it is separate.</li>
<li><strong>Group loan and personal loan together.</strong> A member borrowing both through a self help group and directly is judged on the total repayment record, not on each in isolation.</li>
</ul>
<h2>Before you sign</h2>
<ol>
<li>Form chosen on liability and on who will actually work, not on which sounds bigger.</li>
<li>Deed drafted with capital, ratio, signing authority, exit, death and valuation clauses present.</li>
<li>Firm registration position understood and decided in writing.</li>
<li>Assets used by the firm described in the deed by name and value.</li>
<li>Bank told the constitution before the first transaction, not after.</li>
<li>Every registration in the name that matches the form you have chosen.</li>
</ol>`,
    },
    questions: [
      {
        n: 1,
        question:
          "A proprietor's millet unit cannot pay a grain merchant ₹80,000 and the unit's own stock and cash come to ₹30,000. What can the merchant do?",
        options: [
          "Recover only the ₹30,000, because the debt belongs to the business and not to the owner",
          "Recover the balance from the owner personally, because a proprietorship has no legal existence apart from the owner",
          "Recover the balance only if the unit holds a Udyam registration",
          "Recover nothing further, because the loss is the merchant's risk of trading",
        ],
        answer: 1,
        explanation:
          "In a sole proprietorship the owner and the business are one person in law, so the merchant's claim runs against the owner's personal assets once the business assets are gone, which is what unlimited liability means. The first option is the tempting one because owners think of the shop as a separate thing, but nothing was ever created to make it separate, and no registration changes that.",
        difficulty: "Easy",
        skill: "Unlimited liability",
      },
      {
        n: 2,
        question:
          "Two brothers have run a dairy together for three years, sharing the profit equally, with nothing written down. What is their position in law?",
        options: [
          "They are not partners at all, because a partnership needs a written deed",
          "They are partners by their conduct, but with no deed the terms between them are very hard to prove",
          "They are automatically a registered firm after three years of trading",
          "They are each running a separate proprietorship on the same premises",
        ],
        answer: 1,
        explanation:
          "A partnership comes into existence from an agreement to share the profit of a jointly run business, and that agreement can be oral or inferred from conduct, so they have been partners since the first day. Saying that no deed means no partnership is the attractive error: it gets the liability exactly backwards, because they carry a partner's full liability while having nothing on paper to enforce against each other.",
        difficulty: "Medium",
        skill: "Partnership deed",
      },
      {
        n: 3,
        question: "What does registering a partnership firm with the Registrar of Firms change?",
        options: [
          "It limits each partner's liability to the capital that partner brought in",
          "It creates the firm, which does not exist until the entry is made",
          "It allows the firm and its partners to enforce their rights through a civil court, which an unregistered firm largely cannot",
          "It removes the need for a written deed between the partners",
        ],
        answer: 2,
        explanation:
          "Registration is about enforcement: an unregistered firm cannot sue an outsider on a contract and a partner cannot sue the firm or co-partners on the deed, and registration lifts that bar. Believing it limits liability is the common and expensive mistake, because a registered partnership carries exactly the same unlimited, joint and several liability as an unregistered one.",
        difficulty: "Medium",
        skill: "Firm registration",
      },
      {
        n: 4,
        question:
          "One partner buys forty bags of grain in the firm's name for the firm's business and then stops attending. The supplier is unpaid. Who can be made to pay?",
        options: [
          "Only the partner who placed the order, since he acted alone",
          "Each partner up to his profit sharing ratio and no further",
          "Any partner, for the whole amount, because liability in a firm is joint and several",
          "Nobody, until the firm is dissolved and its assets are sold",
        ],
        answer: 2,
        explanation:
          "For an act done in the ordinary course of the firm's business, every partner is answerable for the entire debt, so the supplier may recover the whole amount from whichever partner can pay, leaving that partner to settle internally. Splitting the debt by profit ratio is the intuitive answer and is wrong, because the ratio governs sharing between partners and has no effect on what an outside creditor may claim.",
        difficulty: "Medium",
        skill: "Unlimited liability",
      },
      {
        n: 5,
        question:
          "A tailoring unit owner in Suryapet is an active member of her self help group and takes a loan through it. What is the position of her unit?",
        options: [
          "The unit is now owned by the group, since the group borrowed for it",
          "The unit becomes a cooperative once the group loan is disbursed",
          "The unit is still her own proprietorship, and group membership changes where she can borrow, buy and sell but not who owns the unit",
          "She no longer needs to keep separate records for the unit, as the group keeps them",
        ],
        answer: 2,
        explanation:
          "A self help group is a separate body with its own members and accounts, so borrowing or buying through it does not transfer the ownership of her unit or its obligation to keep records. The idea that the group now owns the unit is tempting because the credit arrived through the group, but the group lends to a member and the member's business form is untouched.",
        difficulty: "Easy",
        skill: "Producer collective membership",
      },
      {
        n: 6,
        question:
          "Which statement describes a producer company correctly, as against a partnership firm?",
        options: [
          "Voting is one member one vote regardless of shares held, and surplus comes back largely in proportion to the business each member does with it",
          "Voting power follows the size of each member's shareholding, as in any company",
          "Members carry unlimited liability for the company's debts",
          "It can be formed by any two persons irrespective of whether they are producers",
        ],
        answer: 0,
        explanation:
          "A producer company ties membership to producing rather than to investing, which is why each member has one vote whatever the shareholding and why the surplus returns mainly as a patronage-based distribution. Voting by shareholding is the tempting answer because it is how an ordinary company works, and it is precisely the feature a producer body is designed not to have.",
        difficulty: "Hard",
        skill: "Producer collective membership",
      },
      {
        n: 7,
        question:
          "A proprietor takes in a partner and signs a deed. Which of these must be done before the firm starts trading in the new form?",
        options: [
          "Nothing, since the deed by itself covers the bank, the tax registration and the licences",
          "Obtain the firm's own PAN, open a bank account in the firm's name, amend or re-apply for the registrations, and inform the lender of the change of constitution",
          "Only inform the lender, because the other papers can be updated at the next renewal",
          "Surrender the Udyam registration and trade without one until the firm is registered",
        ],
        answer: 1,
        explanation:
          "The firm is a new taxable person with its own PAN, and registrations and licences granted to an individual do not travel to a firm on their own, while a change of constitution normally requires a fresh sanction from the lender. Assuming the deed covers everything is the usual failure, and it leaves the unit trading on documents that describe an owner who no longer runs it alone.",
        difficulty: "Hard",
        skill: "Changing the form later",
      },
    ],
  },
};

export default PART;
