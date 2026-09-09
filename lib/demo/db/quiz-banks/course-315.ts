import type { DemoMcq } from "../quiz-bank";
import { mcq } from "./helpers";

/**
 * Course 315, Digital Literacy & Common Service Centre Operator.
 *
 * Every `skill` below is a single word taken from a topic title in course 315, because
 * `conceptsFor` in http/handlers/adaptive-courses.ts derives a topic's concepts by splitting
 * its title into at most four capitalised words, and `bankForTopic` matches this skill against
 * that list case-insensitively. A multi-word skill, or a word that is not among the first four
 * concepts of some topic, matches nothing and sinks to the bottom of every pile.
 *
 * There is one question per topic and the skills are the eighteen distinct topic concepts, so
 * every submodule of the course has at least one bank question that lands on it rather than
 * arriving as filler:
 *   1 System, Organising, Browser        4 UPI, AePS, Reconciling
 *   2 Word, Spreadsheets, PDF            5 OTP, Data, Backups
 *   3 Aadhaar, Application, Pensions     6 Commissions, Receipt, Village
 *
 * This is a Beginner course for a reader who may never have used a computer, so the questions
 * are set at the counter rather than in the abstract: what the cash box should hold, what the
 * portal is actually comparing, what an OTP authorises. The correct option is spread across all
 * four positions (A x5, B x4, C x5, D x4), because a bank keyed mostly to one letter is read
 * off the screen by a learner who knows none of the subject.
 */
const BANK: DemoMcq[] = [
  /* ---- Module 315001: computer and internet basics ---- */
  mcq(
    315,
    1,
    "An application letter was typed for half an hour and never saved, and then the power went out. Why is the typing gone?",
    [
      "It was held only in the computer's RAM, which keeps what it holds only while the machine has power",
      "It was already written to the hard disk, but a file has to be opened once before it becomes permanent",
      "The operating system moved it to the recycle bin when the machine shut down suddenly",
      "The file exists but sits in a hidden folder that appears only after the next restart",
    ],
    0,
    "Easy",
    "System",
    "RAM is the working memory a program types into, and it holds its contents only while current is flowing. Saving is the act of writing them to the disk, which keeps them without power. The recycle bin is the tempting answer, because it is the first place an operator looks, but the bin holds files that once existed on the disk and were then deleted. Something never saved never became a file at all, so there is nothing there to restore. The habit that follows is to save the file with a proper name in the first minute and then type the body into it.",
  ),
  mcq(
    315,
    2,
    "A centre keeps a year of scanned documents in one folder, with names like scan1.pdf and new doc(3).pdf. Which change does most to make a citizen's paper findable a month later?",
    [
      "Sorting the folder by date modified whenever something has to be found",
      "One folder per service and per month, with each file named by the date, the service and the application number",
      "Keeping the files on the desktop instead, so that all of them are visible at once",
      "Renaming a file only when a citizen comes back and asks for it",
    ],
    1,
    "Medium",
    "Organising",
    "A name that carries the date, the service and the application number can be found by reading it, and it can be reached from either direction: from the register entry, or from the receipt the citizen is holding. Sorting by date is the tempting answer and it works on the day, but a month later you do not know the date, and the date is precisely what you are trying to recover. The desktop is the same single folder with a worse view of it, and it fills the screen the moment the folder is honest about its size.",
  ),
  mcq(
    315,
    3,
    "A citizen has been sent a link to a page that looks like a state pension portal, and asks whether it is genuine. Which check actually settles it?",
    [
      "The padlock shown before the address, since a fraudulent site cannot obtain one",
      "The page standing at the top of the search results for the scheme's name",
      "The domain, meaning the part of the address just before the first single slash, matched against the department's published address",
      "The emblem and the department's name printed across the top of the page",
    ],
    2,
    "Hard",
    "Browser",
    "Only the domain decides which machine is serving the page. Everything after the first single slash is chosen by that machine, so an official sounding name pushed after the slash proves nothing, and a look alike name in front of it is the whole trick. The padlock is the most tempting answer, because operators are taught to look for it, but it says only that the connection is encrypted, and a fraudulent site obtains that certificate in minutes. Search rankings can be paid for, and an emblem is an image that anyone can copy in a second.",
  ),

  /* ---- Module 315002: documents and records ---- */
  mcq(
    315,
    4,
    "The centre files the same land record application for many citizens, changing only the name, the survey number and the village. What is the sound way to handle it in a word processor?",
    [
      "Retype the letter for each citizen, so that no detail from the previous one survives",
      "Keep one master file, open it, save it under the citizen's name with Save As, and change only the three fields",
      "Keep one file and overwrite it for each citizen, since only the current application matters",
      "Keep the letter open all day, edit and print it for each citizen, and close it without saving at night",
    ],
    1,
    "Easy",
    "Word",
    "Save As leaves the master untouched and leaves one file per citizen, which is what you reach for when the citizen returns in a month or when the department asks what exactly was filed. Overwriting is the tempting shortcut, because it keeps the folder small and the screen tidy, and it destroys the one record you will later be asked to produce. Retyping is not wrong in principle, but entering a survey number by hand every time is where the errors that get an application rejected are born.",
  ),
  mcq(
    315,
    5,
    "The daily register is a spreadsheet, and the operator types the day's total into the cell below the amount column. Two more entries are added in the afternoon. What is the problem, and what avoids it?",
    [
      "Nothing goes wrong, because the total is refreshed each time the file is saved",
      "New rows cannot be added below a cell that already holds a total",
      "The spreadsheet marks a total in red once it has gone out of date",
      "The typed total stays at the old figure, so the register stops matching the cash; a SUM formula over the column recalculates as entries are added",
    ],
    3,
    "Easy",
    "Spreadsheets",
    "A typed number is only a number, and it has no relationship with the rows above it. A SUM formula holds that relationship, so the total moves the moment an entry is added or an amount is corrected, and the register can be counted against the cash box at close. Believing the file refreshes on save is the tempting answer, because a spreadsheet does recalculate constantly, but it recalculates formulas, and a typed total is not one. Leave the total one row clear of the last entry and insert new rows above it, so that they fall inside the range the formula covers.",
  ),
  mcq(
    315,
    6,
    "A portal accepts a certificate only as a single PDF. The scanner has produced three JPEG images, one for each page. What is the correct fix?",
    [
      "Combine the three images into one PDF in page order, using the scanner software or a PDF tool",
      "Rename each file from .jpg to .pdf, since the portal reads the extension",
      "Upload the first page alone, because a portal verifies only the first page",
      "Print the three pages and scan them again as three separate PDF files",
    ],
    0,
    "Medium",
    "PDF",
    "A PDF is a different internal format and not merely a different name, so combining the images is the only step that produces the file the portal asked for. Renaming is the tempting answer, and it does change what the machine displays, but the contents stay a JPEG. The upload is then either rejected at once or, worse, accepted as a file nobody downstream can open, and the rejection reaches the citizen weeks later. Rescanning to three PDFs fixes the format and still fails the requirement of a single file.",
  ),

  /* ---- Module 315003: digital identity and citizen services ---- */
  mcq(
    315,
    7,
    "A citizen places a finger on the scanner for an Aadhaar authentication. What does the system return to the centre?",
    [
      "The full Aadhaar record, including the address, the linked mobile number and the bank account",
      "A copy of the fingerprint, which the centre keeps as proof that the citizen was present",
      "In essence a yes or a no on whether the finger matches the Aadhaar number offered, with limited demographic details only where the service is entitled to them",
      "The Aadhaar number itself, worked out from the fingerprint",
    ],
    2,
    "Hard",
    "Aadhaar",
    "Authentication is a matching service. The operator supplies the number and the biometric, and the system answers whether the two belong together, which is exactly why a centre can verify a citizen without ever holding the citizen's record. Option A is the tempting one, because a name does appear on the screen during some services and operators conclude that the whole record is on view. The last option is the reverse of how the system is built: it does not search the population by a fingerprint to discover whose it is.",
  ),
  mcq(
    315,
    8,
    "An online application is rejected with the message that the details do not match. The citizen's name reads K. Ramesh on one document and Ramesh Kumar on the other. What should the operator do?",
    [
      "Enter the name the way the citizen says it at the counter",
      "Enter the shorter version, so that it fits the field the portal provides",
      "Enter initials in both places, so that the two documents agree with each other",
      "Enter the name exactly as it stands on the document the portal verifies against, and have the other document corrected before filing again",
    ],
    3,
    "Hard",
    "Application",
    "The portal is not reading the name, it is comparing your entry character by character against one named source, usually the Aadhaar record or the bank record. So the only entry that can pass is the one on that source, and the second document has to be corrected at the office that issued it or the mismatch returns at verification or at the first payment. Shortening the name to fit the field is the tempting move at a busy counter, and it creates a third version of the name, which means the next service for the same citizen fails as well.",
  ),
  mcq(
    315,
    9,
    "Why does a pension require a life certificate from the pensioner from time to time?",
    [
      "To check that the pensioner's bank account is still operative",
      "To confirm the pensioner is living, so that payment continues to a person and stops when it should, which a centre can file digitally with a biometric authentication",
      "To recalculate the pension for the coming year",
      "To place on record the nominee who will receive the pension later",
    ],
    1,
    "Medium",
    "Pensions",
    "A pension is paid into an account, and an account goes on receiving credits after its holder has died, so the scheme needs a periodic act by the living person. Filing it biometrically at a centre is what spares an elderly pensioner the journey to a treasury or a branch. The account check is the tempting answer, because a dormant account genuinely does block a credit and the two get confused, but a joint account or one operated by a family member stays perfectly active, and that is the very case the life certificate exists to catch.",
  ),

  /* ---- Module 315004: digital payments ---- */
  mcq(
    315,
    10,
    "A citizen has been asked on the phone to enter his UPI PIN so that ₹2,000 owed to him can be credited. What is the right advice?",
    [
      "Do not enter it, because the PIN authorises money leaving the account and is never needed to receive money",
      "Enter it, because a credit has to be authorised by the person receiving it as well",
      "Enter it once and change the PIN immediately afterwards",
      "Enter it only if the caller first sends a request that shows the amount on the screen",
    ],
    0,
    "Easy",
    "UPI",
    "Money arrives in a UPI account with no action at all by the receiver. The PIN is asked for only when the app is about to debit the account, so an approval screen that appears while a credit is expected is a collect request that will take the money out. The amount printed on that screen is what makes the last option so convincing, and it is the fraud itself. The rule to give a citizen is short enough to remember at the counter: receiving needs no PIN and no approval, only sending does.",
  ),
  mcq(
    315,
    11,
    "A woman with a passbook, no debit card and no smartphone wants to withdraw cash at the centre through AePS. What does the transaction need?",
    [
      "Her debit card and its PIN",
      "An OTP on her mobile, which stands in place of the fingerprint",
      "Her Aadhaar number, the name of the bank holding the account linked to that Aadhaar, and her fingerprint",
      "Her passbook and a withdrawal slip signed at the centre",
    ],
    2,
    "Medium",
    "AePS",
    "AePS authenticates the person on the biometric against the Aadhaar, and the bank is selected at the machine because the Aadhaar decides which account is debited. That is the entire design: a citizen with no card and no phone can still reach her own account, which is why the service means anything in a village. The OTP is the tempting answer, because almost every other digital payment ends with one, and it is precisely the requirement AePS removes for a customer who may not be carrying a phone at all.",
  ),
  mcq(
    315,
    12,
    "A centre opens the day with ₹15,000 in hand. It pays out ₹14,500 in cash on AePS withdrawals, accepts ₹6,000 in cash as AePS deposits into citizens' accounts, and collects ₹2,300 in cash as service charges. What should the cash in hand be at close?",
    ["₹2,800", "₹4,200", "₹6,500", "₹8,800"],
    3,
    "Hard",
    "Reconciling",
    "Work the cash box and not the screen. Cash leaves the box only on the withdrawals, and it comes in on both the deposits and the charges, so ₹15,000 less ₹14,500 plus ₹6,000 plus ₹2,300 is ₹8,800. ₹2,800 is what you get by forgetting that a deposit is money the citizen physically handed across, which is the commonest slip because the amount is thought of as gone the instant it shows in the citizen's account. ₹6,500 leaves the charges out and ₹4,200 treats them as an outflow. The settlement account moves the opposite way to the cash box on every one of these entries, which is why the two are reconciled separately and then compared.",
  ),

  /* ---- Module 315005: safety and trust ---- */
  mcq(
    315,
    13,
    "A caller tells a citizen he is from her bank, states her name and account number correctly, and asks for the OTP that has just arrived so that a fraudulent debit can be stopped. What is the correct action?",
    [
      "Give the OTP, since a caller who already knows the account number must be from the bank",
      "Give only the last three digits of the OTP",
      "End the call and ring the number printed on the passbook or the card, because an OTP completes a transaction and no bank staff member ever needs it",
      "Ask him to send a confirming SMS from the bank's number first, and give the OTP if it arrives",
    ],
    2,
    "Easy",
    "OTP",
    "An OTP is the second factor that finishes a debit, so reading it out authorises the very transaction he claims to be stopping, and the urgency of a fraud in progress is what makes the story work. Knowing the account number proves nothing, since it is printed on every cheque leaf and passbook. The confirming SMS is the tempting middle course, and it fails because a sender name on a message and a number on a caller display can both be forged, whereas a number the citizen dials herself from her own passbook cannot be.",
  ),
  mcq(
    315,
    14,
    "The centre's computer holds scanned Aadhaar copies, bank details and half filled forms for much of the village. Which practice is sound?",
    [
      "Remove or securely archive a citizen's documents once the service is filed and the acknowledgment handed over, lock the machine when it is unattended, and keep citizen documents off any personal phone",
      "Keep every scan permanently, because a citizen who comes back will need it again",
      "Keep the operator login open through the day, so that the queue moves faster",
      "Keep the scans in a folder shared with the photocopy shop next door, so that a citizen can collect a print there",
    ],
    0,
    "Hard",
    "Data",
    "The centre is handed those documents for one filing, and holding them past it turns a village computer into the most valuable target in the mandal, with the operator answerable for whatever leaves it. Keeping everything is the tempting answer because it feels like service, and the honest form of that service is to keep the acknowledgment number and the register entry, which is enough to track or refile, rather than the identity documents themselves. An open login and a shared folder each look like a small convenience and each hands the whole store to whoever is next at the desk.",
  ),
  mcq(
    315,
    15,
    "The centre wants a backup of the register, the receipt file and the pending scans. What makes the backup actually useful?",
    [
      "A second copy in another folder on the same hard disk",
      "A copy on an external drive or an online account, taken on a fixed schedule and tested once by restoring a file from it",
      "Keeping the computer on an inverter so that it never shuts down suddenly",
      "Printing the register at the end of every month and filing the sheets",
    ],
    1,
    "Medium",
    "Backups",
    "A backup earns the name only if it survives whatever destroys the original, which means another device or another place, and only if somebody has restored from it at least once, because an unreadable backup and no backup look identical until the morning you need one. The second folder is the tempting answer and it does cover deleting a file by mistake, which is the failure people picture; it covers nothing when the disk itself fails, the machine is stolen or a ransom program encrypts everything on it. An inverter guards against power cuts, which is a different risk with a different remedy.",
  ),

  /* ---- Module 315006: running a Common Service Centre ---- */
  mcq(
    315,
    16,
    "How does a Common Service Centre operator earn?",
    [
      "A monthly salary from the department, paid to every authorised centre",
      "A share of the value of the cash withdrawn through the centre, so income grows with the amount handled",
      "An annual grant fixed against the population of the village the centre serves",
      "A commission on each transaction, together with the charge the citizen pays for the service, so income follows the number of services delivered",
    ],
    3,
    "Hard",
    "Commissions",
    "The centre is a small business holding an authorisation and not a government post, and the money is earned service by service. That is why the mix of services and the daily footfall decide whether a centre survives, and why an operator counts transactions rather than rupees moved. The salary is the most tempting answer and the commonest belief in the village, and correcting it changes how an operator plans, because nobody is paying for the idle hour, the electricity or the printer paper. The second option is the other everyday assumption: it implies a large withdrawal earns more than a small one, when what a large withdrawal really costs the operator is more of the cash float he has to keep on hand.",
  ),
  mcq(
    315,
    17,
    "Why does the centre print a receipt for every service, including the smallest one?",
    [
      "Because the portal will not open the next application until the previous receipt is printed",
      "Because the receipt takes the place of the daily register",
      "Because it carries the date, the service and the transaction reference, which is the citizen's proof and the centre's answer when a payment is questioned later",
      "Because handing over a receipt moves responsibility for the application to the citizen",
    ],
    2,
    "Easy",
    "Receipt",
    "A month later, when a citizen says the money was taken and the certificate never came, the reference on the receipt and the matching line in the register settle it in seconds. Treating the receipt as the register is the tempting answer, because both carry the same details, and they are not interchangeable: the receipt is the citizen's copy that leaves the building, the register is the centre's serial record that the day's cash is counted against, and a dispute needs the two to agree. A receipt transfers responsibility to nobody.",
  ),
  mcq(
    315,
    18,
    "A centre is busy all day with ration and pension work, and nobody in the village uses it for the other services it is authorised for. What is the most effective step?",
    [
      "Tell each citizen already at the counter about the one or two other services that suit their household, and put up a board listing everything the centre is authorised for",
      "Reduce the charge on every service",
      "Wait, because word will spread on its own once a few people have used them",
      "Take an advertisement in the district newspaper",
    ],
    0,
    "Medium",
    "Village",
    "The queue in front of you is the cheapest channel there is, and the service that brought a household in already tells you something about what else it needs, so the suggestion can be specific rather than general. Cutting the charge is the tempting answer because price feels like the barrier, and it gives away income on services nobody is refusing on price, since they do not yet know the services exist. A newspaper reaches a whole district in order to sell to one village, and it cannot tell which household needs which service.",
  ),
];

export default BANK;
