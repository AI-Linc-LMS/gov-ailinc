/**
 * Account and roster actions: the write side of the people modules, the
 * reference lists every form depends on, and the two file exports.
 *
 * Four jobs live here because they share one thing: they are the endpoints a
 * page needs before it can let anyone *do* anything.
 *
 *  1. Reference data (colleges, countries, currencies, features). A dropdown
 *     backed by nothing is not an empty dropdown, it is a form that cannot be
 *     completed. These lists are deliberately long: a country picker missing
 *     Kenya reads as a prototype, and the profile validator on the real backend
 *     is fed from the same module, so short lists here would be wrong anyway.
 *  2. Resumes, for the learner, the admin viewer and the job-apply flow. The
 *     PDF is generated in-process (see `simplePdf`) because there is no network
 *     and no file to serve, and `responseType: "blob"` callers call
 *     `URL.createObjectURL` on whatever they are handed, which throws on a
 *     plain object.
 *  3. Student CRUD: create, edit, activate, deactivate, delete, enroll, reset.
 *     Every one of these writes to the overlay, because a delete that leaves the
 *     row in the table on the next refresh is a worse lie than an error.
 *  4. Scorecard configuration (badges and skills). Both pages previously fell
 *     through to the adapter's empty-collection default, and their empty states
 *     tell the reader to "run python manage.py migrate scorecard", which is Django
 *     operations instructions, printed at a prospect.
 */

import { defineRoutes } from "../router";
import { badRequest, notFound } from "../types";
import {
  ADMIN_PERSONA,
  ALL_PEOPLE,
  STUDENTS,
  STUDENT_PERSONA,
  personById,
  rankedLearners,
  type DemoPerson,
} from "../../db/people";
import { profileFor } from "../../db/profiles";
import {
  UPLOADED_RESUMES_KEY,
  addSavedResume,
  personaResumeUrl,
  savedResumes,
} from "../../db/resumes";
import type { SavedResume } from "@/lib/services/resume.service";
import { portraitFor } from "../../db/avatar";
import { COURSES, courseById } from "../../db/courses";
import { overlay, nextDemoId } from "../../db/overlay";
import { DEMO_CLIENT_ID, DEMO_TENANT } from "../../config";
import { iso, isoDaysAgo, nowMs, ymd, daysAgo } from "../../clock";
import { seededBool, seededInt, seededPick, seededSample } from "../../random";

const MODULE = "account-actions";

// ───────────────────────────── PDF and CSV ─────────────────────────────────

/**
 * Escape a string for a PDF literal, and drop anything outside printable ASCII.
 *
 * The dropping is load-bearing, not tidiness: object offsets in the xref table
 * below are computed with `String.length`, which counts UTF-16 units, while the
 * file is read as bytes. One em dash in a heading shifted every offset after it and
 * produced a PDF that Chrome's viewer refused to open.
 */
function pdfEscape(text: string): string {
  return text.replace(/[^\x20-\x7e]/g, " ").replace(/([\\()])/g, "\\$1");
}

interface PdfLine {
  text: string;
  bold?: boolean;
  size?: number;
  /** Extra vertical space before this line, in points. */
  gap?: number;
}

/**
 * A one-page PDF built by hand.
 *
 * No library, because the demo may not reach the network and adding a bundled
 * PDF renderer to ship two download buttons is not a trade worth making. Only
 * the base-14 Helvetica fonts are used, so nothing has to be embedded.
 */
function simplePdf(title: string, lines: PdfLine[]): Blob {
  const ops: string[] = ["BT"];
  let y = 800;
  for (const line of lines) {
    const size = line.size ?? 10.5;
    y -= size + 6 + (line.gap ?? 0);
    ops.push(`/${line.bold ? "F2" : "F1"} ${size} Tf`);
    ops.push(`1 0 0 1 54 ${Math.round(y)} Tm`);
    ops.push(`(${pdfEscape(line.text)}) Tj`);
  }
  ops.push("ET");
  const stream = ops.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    `<< /Title (${pdfEscape(title)}) /Producer (${pdfEscape(DEMO_TENANT.name)}) >>`,
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefAt = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) body += `${String(off).padStart(10, "0")} 00000 n \n`;
  body +=
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\n` +
    `startxref\n${xrefAt}\n%%EOF\n`;

  return new Blob([body], { type: "application/pdf" });
}

/** One CSV row, with the quoting rules a spreadsheet actually needs. */
function csvRow(cells: Array<string | number | null>): string {
  return cells
    .map((cell) => {
      const s = cell == null ? "" : String(cell);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

// ─────────────────────────── Reference data ────────────────────────────────

/**
 * Institution and skill-centre master data.
 *
 * The profile stores the institution NAME as free text, so this list is only a
 * source of suggestions. It still has to be long and real: every one of the
 * twenty-two names `db/people.ts` draws from is in here, spelled identically, so
 * a trainee whose seeded institution is "Government ITI, Khammam" finds it when
 * they open the picker rather than appearing to have typed something the mission
 * does not recognise. If a name is added there, add it here too.
 *
 * The field on `DemoPerson` is still called `college`, and this endpoint is still
 * `/accounts/colleges/`, because both are read in a dozen places and renamed in
 * none of them. What the list HOLDS is whatever an aspirant is attached to: a
 * university, a government degree college, a polytechnic, an ITI, a sector
 * training institute or one of the mission's own district skill centres. A
 * catalogue of engineering colleges would have quietly told every officer reading
 * it that this platform is built for a different kind of candidate.
 */
const COLLEGES: ReadonlyArray<readonly [string, string, string]> = [
  // The twenty-two institutions `db/people.ts` draws from, spelled exactly as it
  // spells them.
  ["Osmania University, Hyderabad", "Hyderabad", "Telangana"],
  ["Kakatiya University, Warangal", "Warangal", "Telangana"],
  ["Telangana University, Nizamabad", "Nizamabad", "Telangana"],
  ["Satavahana University, Karimnagar", "Karimnagar", "Telangana"],
  ["Mahatma Gandhi University, Nalgonda", "Nalgonda", "Telangana"],
  ["Palamuru University, Mahbubnagar", "Mahbubnagar", "Telangana"],
  ["Government Polytechnic, Warangal", "Warangal", "Telangana"],
  ["Government Polytechnic, Karimnagar", "Karimnagar", "Telangana"],
  ["Government Polytechnic, Mancherial", "Mancherial", "Telangana"],
  ["Government Polytechnic, Nirmal", "Nirmal", "Telangana"],
  ["Government ITI, Nizamabad", "Nizamabad", "Telangana"],
  ["Government ITI, Khammam", "Khammam", "Telangana"],
  ["Government ITI, Adilabad", "Adilabad", "Telangana"],
  ["Government Degree College, Siddipet", "Siddipet", "Telangana"],
  ["Government Degree College, Wanaparthy", "Wanaparthy", "Telangana"],
  ["Government Degree College for Women, Jagtial", "Jagtial", "Telangana"],
  ["TSEM Skill Centre, Khammam", "Khammam", "Telangana"],
  ["TSEM Skill Centre, Suryapet", "Suryapet", "Telangana"],
  ["TSEM Skill Centre, Vikarabad", "Vikarabad", "Telangana"],
  ["TSEM Skill Centre, Sangareddy", "Sangareddy", "Telangana"],
  ["TSEM Skill Centre, Rangareddy", "Rangareddy", "Telangana"],
  ["TSEM Skill Centre, Bhadradri Kothagudem", "Kothagudem", "Telangana"],
  // The mission itself, and the centre the faculty persona teaches at.
  ["Telangana Skills & Employment Mission", "Hyderabad", "Telangana"],
  ["TSEM Skill Centre, Warangal", "Warangal", "Telangana"],
  // The rest of the centre network, one per district the mission reports on.
  ["TSEM Skill Centre, Hyderabad", "Hyderabad", "Telangana"],
  ["TSEM Skill Centre, Adilabad", "Adilabad", "Telangana"],
  ["TSEM Skill Centre, Jagtial", "Jagtial", "Telangana"],
  ["TSEM Skill Centre, Karimnagar", "Karimnagar", "Telangana"],
  ["TSEM Skill Centre, Mahbubnagar", "Mahbubnagar", "Telangana"],
  ["TSEM Skill Centre, Mancherial", "Mancherial", "Telangana"],
  ["TSEM Skill Centre, Nalgonda", "Nalgonda", "Telangana"],
  ["TSEM Skill Centre, Nirmal", "Nirmal", "Telangana"],
  ["TSEM Skill Centre, Nizamabad", "Nizamabad", "Telangana"],
  ["TSEM Skill Centre, Siddipet", "Siddipet", "Telangana"],
  ["TSEM Skill Centre, Wanaparthy", "Wanaparthy", "Telangana"],
  // State and open universities, where most aspirants took their degree. The two
  // open universities matter more than they look: a large share of candidates
  // sitting a state recruitment graduated through distance education.
  ["University of Hyderabad", "Hyderabad", "Telangana"],
  ["Dr. B.R. Ambedkar Open University", "Hyderabad", "Telangana"],
  ["Indira Gandhi National Open University", "New Delhi", "Delhi"],
  ["Maulana Azad National Urdu University", "Hyderabad", "Telangana"],
  ["English and Foreign Languages University", "Hyderabad", "Telangana"],
  ["Professor Jayashankar Telangana Agricultural University", "Hyderabad", "Telangana"],
  ["Sri Konda Laxman Telangana Horticultural University", "Hyderabad", "Telangana"],
  ["Kaloji Narayana Rao University of Health Sciences", "Warangal", "Telangana"],
  ["Rajiv Gandhi University of Knowledge Technologies, Basar", "Nirmal", "Telangana"],
  ["Jawaharlal Nehru Technological University, Hyderabad", "Hyderabad", "Telangana"],
  ["Jawaharlal Nehru Architecture and Fine Arts University", "Hyderabad", "Telangana"],
  // Government degree colleges across the districts.
  ["Nizam College, Hyderabad", "Hyderabad", "Telangana"],
  ["Government City College, Hyderabad", "Hyderabad", "Telangana"],
  ["University College for Women, Koti", "Hyderabad", "Telangana"],
  ["Government Degree College, Adilabad", "Adilabad", "Telangana"],
  ["Government Degree College, Bhadrachalam", "Bhadradri Kothagudem", "Telangana"],
  ["Government Degree College, Khammam", "Khammam", "Telangana"],
  ["Government Degree College, Mahbubnagar", "Mahbubnagar", "Telangana"],
  ["Government Degree College, Nirmal", "Nirmal", "Telangana"],
  ["Government Degree College, Sangareddy", "Sangareddy", "Telangana"],
  ["Government Degree College, Suryapet", "Suryapet", "Telangana"],
  ["Government Degree College, Vikarabad", "Vikarabad", "Telangana"],
  ["Government Degree College for Women, Karimnagar", "Karimnagar", "Telangana"],
  ["Government Degree College for Women, Nizamabad", "Nizamabad", "Telangana"],
  ["Telangana Social Welfare Residential Degree College, Karimnagar", "Karimnagar", "Telangana"],
  ["Telangana Tribal Welfare Residential Degree College, Bhadrachalam", "Bhadradri Kothagudem", "Telangana"],
  // Polytechnics and industrial training institutes, which is where the trade
  // courses recruit from.
  ["Government Polytechnic, Masab Tank", "Hyderabad", "Telangana"],
  ["Government Polytechnic, Nalgonda", "Nalgonda", "Telangana"],
  ["Government Polytechnic, Nizamabad", "Nizamabad", "Telangana"],
  ["Government Polytechnic, Adilabad", "Adilabad", "Telangana"],
  ["Government Polytechnic for Women, Hyderabad", "Hyderabad", "Telangana"],
  ["Government ITI, Hyderabad", "Hyderabad", "Telangana"],
  ["Government ITI, Warangal", "Warangal", "Telangana"],
  ["Government ITI, Karimnagar", "Karimnagar", "Telangana"],
  ["Government ITI, Nalgonda", "Nalgonda", "Telangana"],
  ["Government ITI, Mahbubnagar", "Mahbubnagar", "Telangana"],
  ["Government ITI for Women, Hyderabad", "Hyderabad", "Telangana"],
  // Engineering colleges, for the GATE and PSU track.
  ["National Institute of Technology, Warangal", "Warangal", "Telangana"],
  ["Indian Institute of Technology, Hyderabad", "Sangareddy", "Telangana"],
  ["International Institute of Information Technology, Hyderabad", "Hyderabad", "Telangana"],
  ["Chaitanya Bharathi Institute of Technology", "Hyderabad", "Telangana"],
  ["Vasavi College of Engineering", "Hyderabad", "Telangana"],
  ["Kakatiya Institute of Technology and Science", "Warangal", "Telangana"],
  ["Osmania University College of Engineering", "Hyderabad", "Telangana"],
  // Sector training institutes the vocational courses map onto.
  ["National Institute of Solar Energy", "Gurugram", "Haryana"],
  ["National Institute of Electronics and Information Technology, Hyderabad", "Hyderabad", "Telangana"],
  ["Central Institute of Tool Design, Hyderabad", "Hyderabad", "Telangana"],
  ["National Academy of Construction, Hyderabad", "Hyderabad", "Telangana"],
  ["National Institute of Fashion Technology, Hyderabad", "Hyderabad", "Telangana"],
  ["Apparel Training and Design Centre, Hyderabad", "Hyderabad", "Telangana"],
  ["National Institute of Rural Development and Panchayati Raj", "Hyderabad", "Telangana"],
  ["Entrepreneurship Development Institute of India", "Ahmedabad", "Gujarat"],
  ["Rural Self Employment Training Institute, Karimnagar", "Karimnagar", "Telangana"],
  ["Rural Self Employment Training Institute, Nalgonda", "Nalgonda", "Telangana"],
  // Neighbouring-state universities that turn up on a Telangana roster.
  ["Andhra University College of Engineering", "Visakhapatnam", "Andhra Pradesh"],
  ["Acharya Nagarjuna University", "Guntur", "Andhra Pradesh"],
  ["Sri Venkateswara University", "Tirupati", "Andhra Pradesh"],
  ["Sri Krishnadevaraya University", "Anantapur", "Andhra Pradesh"],
  ["Gulbarga University", "Kalaburagi", "Karnataka"],
  ["Dr. Babasaheb Ambedkar Marathwada University", "Chhatrapati Sambhajinagar", "Maharashtra"],
];
/**
 * ISO 3166-1: alpha-2, alpha-3, English short name.
 *
 * Packed as lines rather than object literals purely for size. The picker
 * fetches this once and filters in the browser, so the whole list ships in one
 * response and there is no keystroke round trip.
 */
const COUNTRY_TABLE = `
AF|AFG|Afghanistan
AL|ALB|Albania
DZ|DZA|Algeria
AD|AND|Andorra
AO|AGO|Angola
AG|ATG|Antigua and Barbuda
AR|ARG|Argentina
AM|ARM|Armenia
AU|AUS|Australia
AT|AUT|Austria
AZ|AZE|Azerbaijan
BS|BHS|Bahamas
BH|BHR|Bahrain
BD|BGD|Bangladesh
BB|BRB|Barbados
BY|BLR|Belarus
BE|BEL|Belgium
BZ|BLZ|Belize
BJ|BEN|Benin
BT|BTN|Bhutan
BO|BOL|Bolivia
BA|BIH|Bosnia and Herzegovina
BW|BWA|Botswana
BR|BRA|Brazil
BN|BRN|Brunei Darussalam
BG|BGR|Bulgaria
BF|BFA|Burkina Faso
BI|BDI|Burundi
KH|KHM|Cambodia
CM|CMR|Cameroon
CA|CAN|Canada
CV|CPV|Cabo Verde
CF|CAF|Central African Republic
TD|TCD|Chad
CL|CHL|Chile
CN|CHN|China
CO|COL|Colombia
KM|COM|Comoros
CG|COG|Congo
CD|COD|Congo, Democratic Republic of the
CR|CRI|Costa Rica
CI|CIV|Cote d'Ivoire
HR|HRV|Croatia
CU|CUB|Cuba
CY|CYP|Cyprus
CZ|CZE|Czechia
DK|DNK|Denmark
DJ|DJI|Djibouti
DM|DMA|Dominica
DO|DOM|Dominican Republic
EC|ECU|Ecuador
EG|EGY|Egypt
SV|SLV|El Salvador
GQ|GNQ|Equatorial Guinea
ER|ERI|Eritrea
EE|EST|Estonia
SZ|SWZ|Eswatini
ET|ETH|Ethiopia
FJ|FJI|Fiji
FI|FIN|Finland
FR|FRA|France
GA|GAB|Gabon
GM|GMB|Gambia
GE|GEO|Georgia
DE|DEU|Germany
GH|GHA|Ghana
GR|GRC|Greece
GD|GRD|Grenada
GT|GTM|Guatemala
GN|GIN|Guinea
GW|GNB|Guinea-Bissau
GY|GUY|Guyana
HT|HTI|Haiti
HN|HND|Honduras
HK|HKG|Hong Kong
HU|HUN|Hungary
IS|ISL|Iceland
IN|IND|India
ID|IDN|Indonesia
IR|IRN|Iran
IQ|IRQ|Iraq
IE|IRL|Ireland
IL|ISR|Israel
IT|ITA|Italy
JM|JAM|Jamaica
JP|JPN|Japan
JO|JOR|Jordan
KZ|KAZ|Kazakhstan
KE|KEN|Kenya
KI|KIR|Kiribati
KW|KWT|Kuwait
KG|KGZ|Kyrgyzstan
LA|LAO|Lao People's Democratic Republic
LV|LVA|Latvia
LB|LBN|Lebanon
LS|LSO|Lesotho
LR|LBR|Liberia
LY|LBY|Libya
LI|LIE|Liechtenstein
LT|LTU|Lithuania
LU|LUX|Luxembourg
MO|MAC|Macao
MG|MDG|Madagascar
MW|MWI|Malawi
MY|MYS|Malaysia
MV|MDV|Maldives
ML|MLI|Mali
MT|MLT|Malta
MH|MHL|Marshall Islands
MR|MRT|Mauritania
MU|MUS|Mauritius
MX|MEX|Mexico
FM|FSM|Micronesia
MD|MDA|Moldova
MC|MCO|Monaco
MN|MNG|Mongolia
ME|MNE|Montenegro
MA|MAR|Morocco
MZ|MOZ|Mozambique
MM|MMR|Myanmar
NA|NAM|Namibia
NR|NRU|Nauru
NP|NPL|Nepal
NL|NLD|Netherlands
NZ|NZL|New Zealand
NI|NIC|Nicaragua
NE|NER|Niger
NG|NGA|Nigeria
KP|PRK|North Korea
MK|MKD|North Macedonia
NO|NOR|Norway
OM|OMN|Oman
PK|PAK|Pakistan
PW|PLW|Palau
PS|PSE|Palestine, State of
PA|PAN|Panama
PG|PNG|Papua New Guinea
PY|PRY|Paraguay
PE|PER|Peru
PH|PHL|Philippines
PL|POL|Poland
PT|PRT|Portugal
QA|QAT|Qatar
RO|ROU|Romania
RU|RUS|Russian Federation
RW|RWA|Rwanda
KN|KNA|Saint Kitts and Nevis
LC|LCA|Saint Lucia
VC|VCT|Saint Vincent and the Grenadines
WS|WSM|Samoa
SM|SMR|San Marino
ST|STP|Sao Tome and Principe
SA|SAU|Saudi Arabia
SN|SEN|Senegal
RS|SRB|Serbia
SC|SYC|Seychelles
SL|SLE|Sierra Leone
SG|SGP|Singapore
SK|SVK|Slovakia
SI|SVN|Slovenia
SB|SLB|Solomon Islands
SO|SOM|Somalia
ZA|ZAF|South Africa
KR|KOR|South Korea
SS|SSD|South Sudan
ES|ESP|Spain
LK|LKA|Sri Lanka
SD|SDN|Sudan
SR|SUR|Suriname
SE|SWE|Sweden
CH|CHE|Switzerland
SY|SYR|Syrian Arab Republic
TW|TWN|Taiwan
TJ|TJK|Tajikistan
TZ|TZA|Tanzania
TH|THA|Thailand
TL|TLS|Timor-Leste
TG|TGO|Togo
TO|TON|Tonga
TT|TTO|Trinidad and Tobago
TN|TUN|Tunisia
TR|TUR|Turkiye
TM|TKM|Turkmenistan
TV|TUV|Tuvalu
UG|UGA|Uganda
UA|UKR|Ukraine
AE|ARE|United Arab Emirates
GB|GBR|United Kingdom
US|USA|United States of America
UY|URY|Uruguay
UZ|UZB|Uzbekistan
VU|VUT|Vanuatu
VA|VAT|Holy See
VE|VEN|Venezuela
VN|VNM|Viet Nam
YE|YEM|Yemen
ZM|ZMB|Zambia
ZW|ZWE|Zimbabwe
`;

const COUNTRIES = COUNTRY_TABLE.trim()
  .split("\n")
  .map((line) => {
    const [code, code3, name] = line.split("|");
    return { code, code3, name };
  });

/**
 * Currencies a course may be priced in.
 *
 * `decimals` is the minor-unit width and is not decoration: the pricing form
 * rounds to it, so a wrong value here prices a course in the wrong order of
 * magnitude. Zero for the yen-likes, three for the Gulf dinars, two otherwise.
 */
const CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", decimals: 2 },
  { code: "USD", name: "United States Dollar", symbol: "$", decimals: 2 },
  { code: "EUR", name: "Euro", symbol: "€", decimals: 2 },
  { code: "GBP", name: "Pound Sterling", symbol: "£", decimals: 2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", decimals: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", decimals: 2 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", decimals: 2 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", decimals: 3 },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", decimals: 3 },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", decimals: 3 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", decimals: 2 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", decimals: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", decimals: 2 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", decimals: 2 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", decimals: 2 },
  { code: "DKK", name: "Danish Krone", symbol: "kr", decimals: 2 },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", decimals: 2 },
  { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimals: 2 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", decimals: 2 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", decimals: 2 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimals: 0 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", decimals: 0 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", decimals: 2 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", decimals: 2 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", decimals: 2 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", decimals: 2 },
  { code: "THB", name: "Thai Baht", symbol: "฿", decimals: 2 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", decimals: 0 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", decimals: 2 },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", decimals: 2 },
  { code: "NPR", name: "Nepalese Rupee", symbol: "Rs", decimals: 2 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", decimals: 2 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", decimals: 2 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", decimals: 2 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", decimals: 2 },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", decimals: 2 },
];

/**
 * `AppFeatures` rows, matched by NAME against `lib/setup/featureCatalogue.ts`.
 *
 * The wizard renders a card only when the backend exposes a row whose name
 * equals the catalogue key exactly, so this list is the catalogue's key column
 * and nothing else. A typo here does not throw, it silently removes a feature
 * card from the setup wizard, which is why the two are kept in the same order.
 */
const FEATURE_NAMES = [
  "course",
  "assessment",
  "scorecard",
  "live_sessions",
  "community_forum",
  "mock_interview",
  "proctoring",
  "ai_tutor",
  "jobs_v2",
  "admin_dashboard",
  "admin_manage_students",
  "admin_manage_instructors",
  "admin_assessment",
  "admin_mock_interview",
  "admin_scorecard",
  "admin_jobs_v2",
  "admin_live_sessions",
  "admin_notifications",
  "admin_emails",
  "admin_certificates",
  "admin_branding",
  "admin_pending_instructors",
];

// ──────────────────────────── Roster overlay ───────────────────────────────

/**
 * Edits the visitor has made to a person on the roster.
 *
 * `removed` rather than deleting the seed entry: the seed is regenerated on
 * every load (dates must stay relative), so the only durable way to express
 * "this student is gone" is a tombstone in the overlay.
 */
interface RosterEdit {
  is_active?: boolean;
  removed?: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

/** A student the visitor created through quick-enroll or a CSV job. */
interface AddedStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

function rosterEdits(): Record<string, RosterEdit> {
  return overlay.get<Record<string, RosterEdit>>("roster:edits", {});
}

function editRoster(id: number, patch: RosterEdit): void {
  overlay.update<Record<string, RosterEdit>>("roster:edits", {}, (current) => ({
    ...current,
    [String(id)]: { ...(current[String(id)] ?? {}), ...patch },
  }));
}

function addedStudents(): AddedStudent[] {
  return overlay.get<AddedStudent[]>("roster:added", []);
}

/** Project a visitor-created account into the same shape as the seeded cast. */
function toPerson(a: AddedStudent): DemoPerson {
  const fullName = `${a.first_name} ${a.last_name}`.trim();
  return {
    id: a.id,
    first_name: a.first_name,
    last_name: a.last_name,
    full_name: fullName,
    user_name: fullName,
    email: a.email,
    phone: a.phone,
    role: "student",
    profile_pic_url: portraitFor(fullName || a.email),
    // Blank rather than a plausible college: this account was created two
    // seconds ago by an administrator typing a name and an email, and inventing
    // an alma mater for it would be the one detail that does not survive being
    // read closely.
    college: "",
    points: 0,
    streak: 0,
    linkedin_url: "",
    headline: "Newly enrolled",
  };
}

/** Apply the visitor's edits to one person. */
function withEdits(p: DemoPerson): DemoPerson {
  const e = rosterEdits()[String(p.id)];
  if (!e) return p;
  const first = e.first_name ?? p.first_name;
  const last = e.last_name ?? p.last_name;
  return {
    ...p,
    first_name: first,
    last_name: last,
    full_name: `${first} ${last}`.trim(),
    email: e.email ?? p.email,
  };
}

/**
 * The roster as the visitor has left it: seeded people minus anyone deleted,
 * plus anyone they created, with name and email edits applied.
 *
 * Exported because the manage-students LIST lives in `admin.ts` and the student
 * DETAIL in `details.ts`. A create the list never shows, or a delete the list
 * ignores, reads as the button having done nothing.
 */
export function applyRoster(people: readonly DemoPerson[]): DemoPerson[] {
  const edits = rosterEdits();
  return [...people, ...addedStudents().map(toPerson)]
    .filter((p) => !edits[String(p.id)]?.removed)
    .map(withEdits);
}

/** Whether this account is still active. Deactivation is reversible. */
export function isRosterActive(id: number): boolean {
  return rosterEdits()[String(id)]?.is_active !== false;
}

/** Look a person up including accounts the visitor created this session. */
export function rosterPerson(id: number): DemoPerson | undefined {
  return applyRoster(ALL_PEOPLE).find((p) => p.id === id);
}

// ───────────────────────────────── Resumes ─────────────────────────────────

/**
 * Blobs the visitor uploaded, for this tab only.
 *
 * Deliberately NOT in the overlay: a 5MB PDF base64'd into localStorage would
 * blow the quota and take the whole overlay down with it. The consequence is
 * that after a reload an uploaded resume previews as the generated document
 * instead of the original file, which is the right way round: the metadata (the
 * thing every list renders) survives, only the bytes do not.
 */
const uploadedBlobs = new Map<number, Blob>();

/**
 * Ids the visitor deleted.
 *
 * A tombstone rather than a removal, because the two seeded resumes in
 * `db/resumes.ts` are regenerated on every load and cannot be deleted out of a
 * list. Without this, a delete undid itself on the next reload.
 */
function deletedResumes(): number[] {
  return overlay.get<number[]>("resumes:deleted", []);
}

/**
 * The persona's shelf.
 *
 * Reads `savedResumes()` rather than keeping a second list: the job-apply
 * picker is built from that same function, and two lists would eventually
 * disagree about which resume the learner has.
 */
function myResumes(): SavedResume[] {
  const gone = new Set(deletedResumes());
  return savedResumes().filter((r) => !gone.has(r.id));
}

/** A real one-page CV, rendered from the same profile the profile page shows. */
function resumePdfFor(person: DemoPerson): Blob {
  const p = profileFor(person);
  const lines: PdfLine[] = [
    { text: person.full_name, bold: true, size: 20 },
    { text: p.headline ?? person.headline, size: 11 },
    {
      text: [person.email, p.phone_number, [p.city, p.state].filter(Boolean).join(", ")]
        .filter(Boolean)
        .join("  |  "),
      size: 9.5,
    },
  ];

  if (p.bio) {
    lines.push({ text: "PROFILE", bold: true, size: 11, gap: 12 });
    for (const chunk of wrap(p.bio, 96)) lines.push({ text: chunk, size: 10 });
  }

  if (p.skills?.length) {
    lines.push({ text: "SKILLS", bold: true, size: 11, gap: 12 });
    for (const chunk of wrap(p.skills.map((s) => s.name).join(", "), 96)) {
      lines.push({ text: chunk, size: 10 });
    }
  }

  if (p.experience?.length) {
    lines.push({ text: "EXPERIENCE", bold: true, size: 11, gap: 12 });
    for (const e of p.experience) {
      lines.push({ text: `${e.position}, ${e.company}`, bold: true, size: 10.5, gap: 4 });
      lines.push({
        text: `${e.start_date ?? ""} to ${e.current ? "present" : e.end_date ?? ""}${
          e.location ? `  |  ${e.location}` : ""
        }`,
        size: 9,
      });
      for (const chunk of wrap(e.description ?? "", 96)) lines.push({ text: chunk, size: 10 });
    }
  }

  if (p.education?.length) {
    lines.push({ text: "EDUCATION", bold: true, size: 11, gap: 12 });
    for (const e of p.education) {
      lines.push({ text: `${e.degree}, ${e.field_of_study}`, bold: true, size: 10.5, gap: 4 });
      lines.push({ text: `${e.institution}${e.gpa ? `  |  ${e.gpa}` : ""}`, size: 10 });
    }
  }

  if (p.projects?.length) {
    lines.push({ text: "PROJECTS", bold: true, size: 11, gap: 12 });
    for (const pr of p.projects.slice(0, 3)) {
      lines.push({ text: pr.name, bold: true, size: 10.5, gap: 4 });
      for (const chunk of wrap(pr.description ?? "", 96)) lines.push({ text: chunk, size: 10 });
    }
  }

  // Only the three personas have a hand-written profile; everyone else on the
  // roster gets the generated baseline, which carries no skills, experience or
  // projects. Without this the admin resume viewer opened on a nearly blank
  // page for 44 of the 45 people on the roster, which reads as the preview being
  // broken rather than the aspirant being new.
  if (!p.skills?.length && !p.experience?.length && !p.education?.length) {
    const institution = person.college || DEMO_TENANT.name;

    lines.push({ text: "EDUCATION", bold: true, size: 11, gap: 12 });
    lines.push({ text: qualificationFor(person, institution), bold: true, size: 10.5, gap: 4 });
    // Completed in the PAST. The software fork wrote "class of <next year>",
    // which described a final-year undergraduate; almost nobody on a state
    // mission roster is one. An aspirant sitting a recruitment exam has already
    // finished the qualification the notification asks for, and a trade trainee
    // finished school some years before they walked into a district centre.
    lines.push({
      text: `${institution}, completed ${
        new Date(nowMs()).getUTCFullYear() - seededInt(`resume:year:${person.id}`, 1, 7)
      }`,
      size: 10,
    });

    lines.push({ text: "SKILLS", bold: true, size: 11, gap: 12 });
    const tags = seededSample(
      `resume:skills:${person.id}`,
      COURSES.flatMap((c) => c.tags),
      8,
    );
    for (const chunk of wrap(tags.join(", "), 96)) lines.push({ text: chunk, size: 10 });

    lines.push({ text: "PROGRAMME", bold: true, size: 11, gap: 12 });
    const course = seededPick(`resume:course:${person.id}`, COURSES);
    for (const chunk of wrap(
      `Enrolled on ${course.title} at ${DEMO_TENANT.name}, taught by ${course.instructor.full_name}. ` +
        `${course.subtitle} Coursework covers ${course.modules
          .slice(0, 3)
          .map((m) => m.title)
          .join(", ")}.`,
      96,
    )) {
      lines.push({ text: chunk, size: 10 });
    }

    // What the two sections of the catalogue actually produce as evidence. An
    // exam candidate has a record of timed papers and an error log; a trade
    // trainee has practical hours signed off at a centre. Printing "course
    // capstone" and "weekly coding practice" at both, as the software fork did,
    // described work nobody on this instance has ever done.
    lines.push({ text: "PREPARATION RECORD", bold: true, size: 11, gap: 12 });
    if (course.section === "govt-jobs") {
      lines.push({
        text: `Sectional tests and full-length papers taken through ${DEMO_TENANT.shortName}, timed to the pattern of the examination.`,
        size: 10,
      });
      lines.push({
        text: "Previous years' question papers worked through with an error log kept per section.",
        size: 10,
      });
    } else {
      lines.push({
        text: `Practical work completed at ${institution} under a mission trainer, with the workshop log signed off.`,
        size: 10,
      });
      lines.push({
        text: "Assessed on the trade's standard practical tasks at the end of each module.",
        size: 10,
      });
    }
  }

  return simplePdf(`${person.full_name} - Resume`, lines);
}

/**
 * The qualification line on a generated resume.
 *
 * Read off the institution rather than fixed, because this roster is not one
 * kind of person: a name attached to an ITI did a trade certificate, a name
 * attached to a polytechnic did a diploma, a name attached to a mission skill
 * centre most likely finished school and came for the trade, and a name attached
 * to a university took a degree. Handing all four the same line is what made the
 * software fork's resumes read as one template with the name swapped.
 *
 * Seeded on the person's id, so the same resume prints the same qualification
 * after a reload.
 */
function qualificationFor(person: DemoPerson, institution: string): string {
  const key = `resume:qual:${person.id}`;
  if (/\bITI\b/.test(institution)) {
    return seededPick(key, [
      "ITI, Electrician trade",
      "ITI, Fitter trade",
      "ITI, Electronics Mechanic trade",
      "ITI, Sewing Technology trade",
    ]);
  }
  if (/Polytechnic/.test(institution)) {
    return seededPick(key, [
      "Diploma, Electrical and Electronics Engineering",
      "Diploma, Mechanical Engineering",
      "Diploma, Civil Engineering",
      "Diploma, Electronics and Communication Engineering",
    ]);
  }
  if (/Skill Centre/.test(institution)) {
    return seededPick(key, [
      "Intermediate, Commerce",
      "Intermediate, Maths, Physics and Chemistry",
      "Tenth standard",
      "Intermediate, Arts",
    ]);
  }
  return seededPick(key, [
    "B.A., Political Science",
    "B.A., History",
    "B.Com",
    "B.Sc., Mathematics",
    "B.Tech, Electrical and Electronics Engineering",
    "B.Tech, Civil Engineering",
    "B.Sc., Agriculture",
  ]);
}

/** Greedy word wrap. Helvetica is proportional, so this is approximate on purpose. */
function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && line.length + 1 + w.length > width) {
      out.push(line);
      line = w;
    } else {
      line = line ? `${line} ${w}` : w;
    }
  }
  if (line) out.push(line);
  return out;
}

function resumeBlob(resumeId: number, ownerId: number): Blob {
  const live = uploadedBlobs.get(resumeId);
  if (live) return live;
  const owner = rosterPerson(ownerId) ?? STUDENT_PERSONA;
  return resumePdfFor(owner);
}

/** A resume row in the API's shape, for the learner's own shelf. */
function toApiResume(r: SavedResume) {
  return { id: r.id, display_name: r.display_name, file_url: r.file_url, created_at: r.created_at };
}

// ───────────────────────── Progress reset bookkeeping ──────────────────────

interface ResetRecord {
  id: number;
  performed_at: string;
  performed_by: string;
  scope: string;
  deleted_counts: Record<string, number>;
  total: number;
  note: string;
}

function resetHistory(studentId: number): ResetRecord[] {
  return overlay.get<ResetRecord[]>(`reset:history:${studentId}`, []);
}

/** Which scopes have already been wiped, so a second preview honestly says zero. */
function resetScopes(studentId: number): string[] {
  return overlay.get<string[]>(`reset:scopes:${studentId}`, []);
}

/**
 * What a reset would delete, per scope.
 *
 * Counts are derived from the student's own points and streak rather than
 * invented, so a learner with 7,840 points is shown a bigger number than one
 * with 500. The keys are the API's, because the dialog maps them through its
 * own label table and an unrecognised key renders as raw snake_case.
 */
function resetCounts(p: DemoPerson, adaptive: boolean, assessments: boolean) {
  const done = resetScopes(p.id);
  const counts: Record<string, number> = {};

  if (adaptive && !done.includes("adaptive")) {
    const activity = Math.max(6, Math.round(p.points / 40));
    counts.score_events = activity;
    counts.journey_nodes = seededInt(`rst:jn:${p.id}`, 8, 44);
    counts.points_wallets = 1;
    counts.ability_models = seededInt(`rst:am:${p.id}`, 2, 9);
    counts.quiz_sessions = seededInt(`rst:qs:${p.id}`, 3, 26);
    // No `coding_sessions` row. `ResetProgressCard` has a label for it, and the
    // software fork sent one, but this tenant's catalogue has no coding topic at
    // all (see the header of `db/coding-bank.ts`), so the dialog would have been
    // promising to delete work that cannot exist. A confirmation dialog is the
    // last screen that may exaggerate.
    counts.certificates = seededInt(`rst:ct:${p.id}`, 0, 2);
    counts.streaks = p.streak > 0 ? 1 : 0;
    counts.activity_log = seededInt(`rst:al:${p.id}`, 20, 240);
    counts.time_tracking = seededInt(`rst:tt:${p.id}`, 5, 60);
  }
  if (assessments && !done.includes("assessments")) {
    counts.assessment_submissions = seededInt(`rst:as:${p.id}`, 0, 5);
    counts.mock_interviews = seededInt(`rst:mi:${p.id}`, 0, 3);
    counts.retake_grants_restored = seededInt(`rst:rg:${p.id}`, 0, 2);
  }

  // A zero row on a confirmation dialog is noise: it reads as something that
  // will be deleted until you notice the number.
  for (const key of Object.keys(counts)) if (counts[key] === 0) delete counts[key];
  return counts;
}

function scopeLabel(adaptive: boolean, assessments: boolean): string {
  if (adaptive && assessments) return "Course progress and assessments";
  if (adaptive) return "Course progress only";
  if (assessments) return "Assessments only";
  return "Nothing selected";
}

const PRESERVED = [
  "Account and login",
  "Course and cohort enrolments",
  "Profile, resumes and saved jobs",
  "Support tickets",
  "Community posts",
];

// ───────────────────────── Enrollment jobs ─────────────────────────────────

interface EnrollmentJobSeed {
  id: number;
  task_id: string;
  students: Array<{ name: string; email: string; phone?: string }>;
  course_ids: number[];
  created_ms: number;
  created_at: string;
}

function enrollmentJobSeeds(): EnrollmentJobSeed[] {
  return overlay.get<EnrollmentJobSeed[]>("enrollment:jobs", []);
}

/**
 * Project a stored job into the API shape, deriving status from elapsed time.
 *
 * `nowMs()` rather than a seeded value on purpose: this is the one place in the
 * demo where a value is *meant* to change between renders. The dialog polls
 * every three seconds and shows a spinner until the job reports COMPLETED, so a
 * job that was born COMPLETED would never show the progress state that is the
 * whole point of the screen.
 */
function toEnrollmentJob(job: EnrollmentJobSeed) {
  const elapsed = nowMs() - job.created_ms;
  const finished = elapsed > 4000;
  const userLabels: Record<string, string> = {};
  const createdIds: number[] = [];
  const enrolled: Array<{ user_id: number; course_id: number }> = [];

  job.students.forEach((s, i) => {
    const userId = job.id * 100 + i;
    createdIds.push(userId);
    userLabels[String(userId)] = s.name;
    for (const courseId of job.course_ids) enrolled.push({ user_id: userId, course_id: courseId });
  });

  return {
    id: job.id,
    task_id: job.task_id,
    client: DEMO_CLIENT_ID,
    students: job.students,
    course_ids: job.course_ids,
    created_accounts: finished ? createdIds : [],
    enrolled_students: finished ? enrolled : [],
    skipped_accounts: [] as number[],
    skipped_enrollments: [] as Array<{ user_id: number; course_id: number }>,
    failed_students: [] as Array<{ student: { name: string; email: string }; error: string }>,
    status: finished ? ("COMPLETED" as const) : ("IN_PROGRESS" as const),
    notes: finished
      ? `Created ${createdIds.length} account${createdIds.length === 1 ? "" : "s"} and enrolled them into ${
          job.course_ids.length
        } course${job.course_ids.length === 1 ? "" : "s"}.`
      : "Creating accounts and sending welcome mail.",
    error_details: {} as Record<string, unknown>,
    created_at: job.created_at,
    updated_at: iso(new Date(nowMs())),
    completed_at: finished ? iso(new Date(job.created_ms + 4000)) : null,
    user_labels: userLabels,
  };
}

/** Every enrollment job the visitor has started, newest first. */
export function enrollmentJobs() {
  return [...enrollmentJobSeeds()].reverse().map(toEnrollmentJob);
}

// ───────────────────────────── Badges and skills ───────────────────────────

interface BadgeSeed {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_slug: string;
  criteria_json: Record<string, unknown>;
  points: number;
  is_active: boolean;
  /** Share of the roster that has earned it, 0-1. Drives `awarded_count`. */
  reach: number;
  createdDaysAgo: number;
}

/**
 * The badge catalogue.
 *
 * Criteria are real: each `criteria_json` uses a `type` the badges page knows
 * how to summarise, with the parameter fields that type declares. A badge whose
 * criteria the page cannot read renders as a bare "-" in the Criteria column,
 * which makes the whole table look unconfigured. The seven usable types are
 * listed in `CRITERIA_TYPES` in app/admin/scorecard/badges/page.tsx.
 *
 * Two of them point at other seeds and must be kept in step by hand. The
 * `skill_score` badge names `skill_id: 701`, which is the first row of
 * `SKILL_SEEDS` below, and the `course_complete` badge names `course_id: 302`,
 * which is TGPSC Group-II and Group-III Foundation in `db/courses.ts`. Both were
 * pointed at rows that no longer exist after the re-content (skill 701 was React
 * and course 201 was Full-Stack Web Development), and a criteria row aimed at a
 * missing id is invisible: the page prints the raw JSON and no learner can ever
 * earn it.
 *
 * `reach` descends deliberately. The first-submission badge is near-universal
 * and the 30-day streak is rare, which is what an award distribution looks like
 * in a mission that has been running batches for a couple of terms.
 */
const BADGE_SEEDS: BadgeSeed[] = [
  {
    id: 601,
    name: "First Steps",
    slug: "first-steps",
    description: "Submitted their first assessment.",
    icon_slug: "mdi:flag-checkered",
    criteria_json: { type: "first_submission" },
    points: 10,
    is_active: true,
    reach: 0.86,
    createdDaysAgo: 210,
  },
  {
    id: 602,
    name: "Week One Done",
    slug: "week-one-done",
    description: "Seven days in a row with recorded activity.",
    icon_slug: "mdi:fire",
    criteria_json: { type: "streak", days: 7 },
    points: 25,
    is_active: true,
    reach: 0.52,
    createdDaysAgo: 210,
  },
  {
    id: 603,
    name: "Five Papers In",
    slug: "five-papers-in",
    description: "Completed five assessments across any courses.",
    icon_slug: "mdi:clipboard-check-outline",
    criteria_json: { type: "assessments_completed", count: 5 },
    points: 40,
    is_active: true,
    reach: 0.31,
    createdDaysAgo: 186,
  },
  {
    id: 604,
    name: "Interview Ready",
    slug: "interview-ready",
    description: "Finished a full mock interview and received a score.",
    icon_slug: "mdi:account-tie-voice-outline",
    criteria_json: { type: "mock_interviews", count: 1 },
    points: 50,
    is_active: true,
    reach: 0.24,
    createdDaysAgo: 152,
  },
  {
    id: 605,
    name: "Grounded in General Studies",
    slug: "grounded-in-general-studies",
    description: "Reached 75% proficiency on the General Studies skill.",
    icon_slug: "mdi:book-open-variant",
    criteria_json: { type: "skill_score", skill_id: 701, min: 75 },
    points: 60,
    is_active: true,
    reach: 0.18,
    createdDaysAgo: 120,
  },
  {
    id: 606,
    name: "Group-II Foundation Complete",
    slug: "group-2-foundation-complete",
    description: "Completed every item in TGPSC Group-II and Group-III Foundation.",
    icon_slug: "mdi:school-outline",
    criteria_json: { type: "course_complete", course_id: 302 },
    points: 150,
    is_active: true,
    reach: 0.11,
    createdDaysAgo: 120,
  },
  {
    id: 607,
    name: "Top of the Batch",
    slug: "top-of-the-batch",
    description: "Overall performance score of 85% or better.",
    icon_slug: "mdi:trophy-outline",
    criteria_json: { type: "overall_score", min: 85 },
    points: 120,
    is_active: true,
    reach: 0.07,
    createdDaysAgo: 96,
  },
  {
    id: 608,
    name: "Thirty Day Streak",
    slug: "thirty-day-streak",
    description: "A full month without missing a day.",
    icon_slug: "mdi:calendar-star",
    criteria_json: { type: "streak", days: 30 },
    points: 200,
    is_active: true,
    reach: 0.04,
    createdDaysAgo: 96,
  },
  {
    id: 609,
    name: "Pilot Batch",
    slug: "pilot-batch",
    description: "Retired after the pilot batch. Kept for the trainees who hold it.",
    icon_slug: "mdi:archive-outline",
    criteria_json: { type: "first_submission" },
    points: 5,
    is_active: false,
    reach: 0.09,
    createdDaysAgo: 320,
  },
];

interface BadgeEdit {
  name?: string;
  description?: string;
  icon_slug?: string;
  criteria_json?: Record<string, unknown>;
  points?: number;
  is_active?: boolean;
  deleted?: boolean;
}

function badgeEdits(): Record<string, BadgeEdit> {
  return overlay.get<Record<string, BadgeEdit>>("badges:edits", {});
}

function createdBadges(): BadgeSeed[] {
  return overlay.get<BadgeSeed[]>("badges:created", []);
}

function rosterSize(): number {
  return applyRoster([STUDENT_PERSONA, ...STUDENTS]).length;
}

function toApiBadge(b: BadgeSeed) {
  const e = badgeEdits()[String(b.id)] ?? {};
  return {
    id: b.id,
    name: e.name ?? b.name,
    slug: b.slug,
    description: e.description ?? b.description,
    icon_slug: e.icon_slug ?? b.icon_slug,
    criteria_json: e.criteria_json ?? b.criteria_json,
    points: e.points ?? b.points,
    is_active: e.is_active ?? b.is_active,
    awarded_count: Math.round(rosterSize() * b.reach),
    created_at: isoDaysAgo(b.createdDaysAgo, 11, 20),
    updated_at: isoDaysAgo(Math.max(0, b.createdDaysAgo - 30), 16, 45),
  };
}

function allBadges() {
  const edits = badgeEdits();
  return [...createdBadges(), ...BADGE_SEEDS]
    .filter((b) => !edits[String(b.id)]?.deleted)
    .map(toApiBadge);
}

interface SkillSeed {
  id: number;
  name: string;
  category: string;
  description: string;
}

/**
 * The skill catalogue.
 *
 * The bulk of it is the tag set the nineteen courses carry, spelled
 * identically, because the learner scorecard derives its skill rows from those
 * same tags. If the two lists disagreed, an administrator would be configuring
 * skills that no learner's scorecard has ever mentioned, and `mappingCount`
 * below would report no tagged content for a skill half the catalogue teaches.
 *
 * The rest are the finer-grained skills a real catalogue accumulates once people
 * start tagging individual questions: sectional time management, negative
 * marking, letter drafting. Those deliberately match no course tag, because an
 * untagged skill is exactly what the page's amber "Untagged" tile exists to
 * surface, and a catalogue where every row happened to be tagged left that tile
 * permanently at zero with nothing to act on.
 *
 * Id 701 is load-bearing. The `skill_score` badge in `BADGE_SEEDS` above names
 * `skill_id: 701`, so the first row here has to stay General Studies or that
 * badge points at nothing and no aspirant can earn it. The software fork this
 * repository was cut from had React at 701, which is how the mismatch got in.
 */
const SKILL_SEEDS: SkillSeed[] = [
  // General studies, the ground every exam course in section one stands on.
  { id: 701, name: "General Studies", category: "General Studies", description: "Polity, history, geography and economy as a general paper asks them together." },
  { id: 702, name: "Telangana Movement", category: "General Studies", description: "The agitations, the accords that followed them, and state formation." },
  { id: 703, name: "Indian Polity", category: "General Studies", description: "The Constitution, the amendment procedure and Centre-State relations." },
  { id: 704, name: "General Science", category: "General Studies", description: "Everyday physics, chemistry and biology at the level a recruitment paper asks." },
  { id: 705, name: "Current Affairs", category: "General Studies", description: "National and state developments, filed under a syllabus heading and not a date." },
  { id: 706, name: "Telangana Geography", category: "General Studies", description: "Rivers, irrigation projects, soils, minerals and the district profiles." },

  // Aptitude, which decides the prelims of almost every notification here.
  { id: 707, name: "Quantitative Aptitude", category: "Aptitude", description: "Arithmetic, algebra and mensuration, with the shortcuts that survive a clock." },
  { id: 708, name: "Reasoning", category: "Aptitude", description: "Puzzles, seating arrangement, syllogism, series and coding-decoding." },
  { id: 709, name: "Arithmetic", category: "Aptitude", description: "Percentage, ratio, time and work, and the sums a constable paper repeats." },
  { id: 710, name: "Data Interpretation", category: "Aptitude", description: "Reading a table, a bar set or a caselet without recomputing all of it." },
  { id: 711, name: "Data Analysis", category: "Aptitude", description: "Comparing data sets and drawing the one conclusion the question asked for." },
  { id: 712, name: "Engineering Mathematics", category: "Aptitude", description: "Linear algebra, calculus, probability and transforms at GATE level." },
  { id: 713, name: "General Aptitude", category: "Aptitude", description: "Verbal and numerical ability as the GATE common section sets it." },
  { id: 714, name: "Mental Calculation", category: "Aptitude", description: "Tables, squares and approximation, so the pencil becomes a last resort." },

  // Language, which is a separate skill from knowing the material.
  { id: 715, name: "English", category: "Language", description: "Grammar, error spotting, cloze and comprehension under a sectional clock." },
  { id: 716, name: "Mains Answer Writing", category: "Language", description: "Answering what was asked, with a specific anchor under every point." },
  { id: 717, name: "Descriptive Paper", category: "Language", description: "Essay, precis and letter, written to a word count and a time limit." },
  { id: 718, name: "Report and Letter Drafting", category: "Language", description: "Official formats: the parts, the order and the register each one uses." },

  // Banking and economy, for the whole of the banking category.
  { id: 719, name: "Banking Awareness", category: "Banking & Economy", description: "Products, regulators and the vocabulary a branch counter actually uses." },
  { id: 720, name: "Indian Economy", category: "Banking & Economy", description: "Budget, monetary policy, growth, and the terms that recur every cycle." },
  { id: 721, name: "Financial Inclusion", category: "Banking & Economy", description: "Accounts, credit and insurance reaching households that had none." },
  { id: 722, name: "Economic and Social Issues", category: "Banking & Economy", description: "Growth, poverty, demography and social policy, as the RBI paper frames them." },
  { id: 723, name: "Finance and Management", category: "Banking & Economy", description: "Financial markets, risk, and the management theory the paper names." },

  // Exam craft: what separates a second attempt from a third.
  { id: 724, name: "Sectional Time Management", category: "Exam Craft", description: "Spending a section's minutes on the questions that will actually fall." },
  { id: 725, name: "Physical Efficiency Test", category: "Exam Craft", description: "Preparing for the running, jumping and endurance events a notification sets." },
  { id: 726, name: "Technical Interview", category: "Exam Craft", description: "Defending your branch subjects and your project in front of a panel." },
  { id: 727, name: "Group Exercise", category: "Exam Craft", description: "Making a point, conceding one, and moving a group discussion forward." },
  { id: 728, name: "Negative Marking Strategy", category: "Exam Craft", description: "When a guess is worth the risk, and when it is only worth the time." },

  // The electrical trades, where the assessment is a practical task.
  { id: 729, name: "Solar PV", category: "Electrical Trades", description: "Modules, strings, inverters and how a rooftop array is sized." },
  { id: 730, name: "Net Metering", category: "Electrical Trades", description: "The application, the bidirectional meter, and how export is settled." },
  { id: 731, name: "Electrical Safety", category: "Electrical Trades", description: "Isolation, prove-test-prove, and the practices that keep a person alive." },
  { id: 732, name: "Earthing", category: "Electrical Trades", description: "Electrodes and conductors, and why an earth that measures badly protects nobody." },
  { id: 733, name: "Domestic Wiring", category: "Electrical Trades", description: "Circuits, cable sizing, protection and the layout of a house board." },
  { id: 734, name: "Motor Control", category: "Electrical Trades", description: "Starters, contactors, overload protection and single-phase preventers." },
  { id: 735, name: "Installation", category: "Electrical Trades", description: "Mounting, routing, terminating and commissioning without a return visit." },
  { id: 736, name: "Rooftop", category: "Electrical Trades", description: "Reading a roof before quoting for it: shade, orientation, condition, cable route." },

  // Garment and electronics trades.
  { id: 737, name: "Tailoring", category: "Trade Skills", description: "Measurement, cutting, stitching and finishing to one customer's fit." },
  { id: 738, name: "Pattern Drafting", category: "Trade Skills", description: "Turning a measurement set into a paper pattern that repeats." },
  { id: 739, name: "Garment Making", category: "Trade Skills", description: "Assembly order, seams, linings, and the finishing that decides the price." },
  { id: 740, name: "Costing", category: "Trade Skills", description: "Material, labour and overhead on a sheet, before a price is quoted." },
  { id: 741, name: "Boutique", category: "Trade Skills", description: "Samples, an order book, delivery dates, and the customer who comes back." },
  { id: 742, name: "Mobile Repair", category: "Trade Skills", description: "Fault finding on handsets, from the reported symptom to the component." },
  { id: 743, name: "Soldering", category: "Trade Skills", description: "Temperature, flux and wetting, and rework that does not lift a pad." },
  { id: 744, name: "Board Level Repair", category: "Trade Skills", description: "Reading a schematic, tracing a rail, replacing what actually failed." },
  { id: 745, name: "Diagnostics", category: "Trade Skills", description: "Narrowing a fault by measurement rather than by replacing parts in turn." },
  { id: 746, name: "Service Counter", category: "Trade Skills", description: "Taking a job in, quoting it, and handing it back with a written record." },

  // Digital services, which is both a trade and the counter half the state runs on.
  { id: 747, name: "Digital Literacy", category: "Digital Services", description: "Files, forms, email and a browser, for someone starting from a phone." },
  { id: 748, name: "Common Service Centre", category: "Digital Services", description: "Running a counter: services offered, records kept and money handled." },
  { id: 749, name: "UPI", category: "Digital Services", description: "Collect and pay flows, what a failure means, and what to tell the customer." },
  { id: 750, name: "AePS", category: "Digital Services", description: "Aadhaar-enabled withdrawal and deposit at a counter, and where its limits are." },
  { id: 751, name: "Citizen Services", category: "Digital Services", description: "Certificates, pensions and applications, and the documents each one needs." },
  { id: 752, name: "Digital Marketing", category: "Digital Services", description: "Listings, photographs and pricing that reach buyers outside the mandal." },
  { id: 753, name: "ONDC", category: "Digital Services", description: "Selling on an open network: catalogue, orders, logistics and settlement." },
  { id: 754, name: "WhatsApp Business", category: "Digital Services", description: "Catalogue, broadcast, and the discipline of replying the same day." },
  { id: 755, name: "Online Selling", category: "Digital Services", description: "Packing, dispatch, returns, and what each of them costs you." },

  // Enterprise, credit and the collective forms rural businesses take.
  { id: 756, name: "Micro-Enterprise", category: "Enterprise & Finance", description: "Running a one-person or family unit, from the idea to the first repeat order." },
  { id: 757, name: "Business Plan", category: "Enterprise & Finance", description: "What you sell, to whom, at what cost, and what happens if half of it sells." },
  { id: 758, name: "Break-even", category: "Enterprise & Finance", description: "Fixed cost, contribution, and the volume at which a unit stops losing money." },
  { id: 759, name: "Bookkeeping", category: "Enterprise & Finance", description: "Cash book, ledger and stock, kept daily rather than reconstructed later." },
  { id: 760, name: "Udyam", category: "Enterprise & Finance", description: "MSME registration, what it is used for, and what it does not by itself get you." },
  { id: 761, name: "MUDRA", category: "Enterprise & Finance", description: "The loan categories, what a branch looks for, and where applications stall." },
  { id: 762, name: "SHG Bank Linkage", category: "Enterprise & Finance", description: "Grading, the group's own books, and the resolution a branch asks to see." },
  { id: 763, name: "Project Report", category: "Enterprise & Finance", description: "The document a bank actually reads: costing, cash flow and repayment." },
  { id: 764, name: "CGTMSE", category: "Enterprise & Finance", description: "Credit guarantee behind collateral-free lending, and what it covers." },
  { id: 765, name: "PMEGP", category: "Enterprise & Finance", description: "The margin money route: eligibility, the sponsoring agency and the sequence." },
  { id: 766, name: "FPO", category: "Enterprise & Finance", description: "Forming a producer organisation: promoters, members, share capital, business plan." },
  { id: 767, name: "Producer Company", category: "Enterprise & Finance", description: "The legal form an FPO takes, its members, its board and its statutory duties." },
  { id: 768, name: "Aggregation", category: "Enterprise & Finance", description: "Collecting, grading and pooling produce so a small holding gets a better price." },
  { id: 769, name: "eNAM", category: "Enterprise & Finance", description: "Selling through the national market platform: lots, assaying and payment." },
  { id: 770, name: "Governance", category: "Enterprise & Finance", description: "Meetings, minutes, accounts and audit, in a body that answers to its members." },

];

interface SkillEdit {
  name?: string;
  category?: string;
  description?: string;
  is_active?: boolean;
  deleted?: boolean;
}

function skillEdits(): Record<string, SkillEdit> {
  return overlay.get<Record<string, SkillEdit>>("skills:edits", {});
}

function createdSkills(): SkillSeed[] {
  return overlay.get<SkillSeed[]>("skills:created", []);
}

/**
 * How many content rows carry this skill.
 *
 * Derived from the catalogue rather than drawn at random: a skill that is a tag
 * on two courses has roughly twice the tagged content of one that tags a single
 * course, and a skill no course claims may legitimately have none at all. That
 * last case is the point of the page's amber "Untagged" tile, and a catalogue
 * where every row happened to be tagged left the tile permanently at zero with
 * nothing to act on.
 */
function mappingCount(s: SkillSeed): number {
  const courses = COURSES.filter((c) => c.tags.includes(s.name)).length;
  if (courses > 0) return courses * seededInt(`skillmap:${s.id}:${s.name}`, 7, 26);
  return seededBool(`skillmap:tagged:${s.id}`, 0.55)
    ? seededInt(`skillmap:loose:${s.id}`, 2, 14)
    : 0;
}

function toApiSkill(s: SkillSeed) {
  const e = skillEdits()[String(s.id)] ?? {};
  return {
    id: s.id,
    name: e.name ?? s.name,
    slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    category: e.category ?? s.category,
    description: e.description ?? s.description,
    is_active: e.is_active ?? true,
    mapping_count: mappingCount(s),
    created_at: isoDaysAgo(seededInt(`skillcreated:${s.id}`, 60, 240), 10, 0),
    updated_at: isoDaysAgo(seededInt(`skillupdated:${s.id}`, 0, 55), 15, 30),
  };
}

function allSkills() {
  const edits = skillEdits();
  return [...createdSkills(), ...SKILL_SEEDS]
    .filter((s) => !edits[String(s.id)]?.deleted)
    .map(toApiSkill);
}

// ─────────────────────────────── Routes ────────────────────────────────────

defineRoutes(MODULE, {
  // ── Reference data ──────────────────────────────────────────────────────
  /** `{ colleges }`, not a bare array: the service reads `data?.colleges ?? []`. */
  "GET /accounts/colleges/": (req) => {
    const search = (req.query.get("search") ?? "").trim().toLowerCase();
    const limit = Number(req.query.get("limit") ?? 20);
    const matched = COLLEGES.filter(
      ([name, city, state]) =>
        !search ||
        name.toLowerCase().includes(search) ||
        city.toLowerCase().includes(search) ||
        state.toLowerCase().includes(search),
    );
    return {
      count: matched.length,
      colleges: matched.slice(0, Math.max(1, limit)).map(([name, city, state], i) => ({
        id: 3000 + i,
        name,
        city,
        state,
      })),
    };
  },

  "GET /accounts/countries/": () => ({ count: COUNTRIES.length, countries: COUNTRIES }),

  "GET /payment-gateway/api/currencies/": () => ({ currencies: CURRENCIES }),

  /**
   * A bare array of `{ id, name }`. The wizard accepts either this or
   * `{ features }`, and the real endpoint returns the array.
   */
  "GET /accounts/features/": () =>
    FEATURE_NAMES.map((name, i) => ({ id: i + 1, name, is_active: true })),

  // ── Learner resumes ─────────────────────────────────────────────────────
  "GET /accounts/clients/:clientId/user-profile/resumes/": () => myResumes().map(toApiResume),

  /**
   * Multipart upload. The body arrives as FormData, not JSON, so this reads
   * `.get(...)` rather than property access; an earlier version read
   * `body.display_name` off the FormData object and saved every resume as
   * "undefined".
   */
  "POST /accounts/clients/:clientId/user-profile/resumes/": (req) => {
    const body = req.body;
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    const entry = isForm ? body.get("file") : null;
    // Blob, not File: jsdom and some browsers hand back a Blob-alike, and the
    // only members used below are `name` and `size`.
    const file =
      entry && typeof entry === "object" && "size" in entry
        ? (entry as Blob & { name?: string })
        : null;
    const typed = isForm ? String(body.get("display_name") ?? "") : String(body?.display_name ?? "");

    if (myResumes().length >= 10) {
      throw badRequest({ error: "You can keep up to 10 resumes. Delete one to upload another." });
    }
    if (file && file.size > 5 * 1024 * 1024) {
      throw badRequest({ error: "That file is over the 5MB limit." });
    }

    const record: SavedResume = {
      id: nextDemoId("resume"),
      display_name: typed.trim() || file?.name || "Resume.pdf",
      // The persona document, not a path to the uploaded bytes. The job-apply
      // flow drops this straight into an application record that the admin
      // pipeline renders in an iframe, and the uploaded file does not survive a
      // reload, so a link to it would break the moment the tab was refreshed.
      file_url: personaResumeUrl(),
      created_at: iso(new Date(nowMs())),
    };
    if (file) uploadedBlobs.set(record.id, file);
    addSavedResume(record);
    return toApiResume(record);
  },

  "DELETE /accounts/clients/:clientId/user-profile/resumes/:resumeId/": (req) => {
    const id = Number(req.params.resumeId);
    if (!myResumes().some((r) => r.id === id)) throw notFound("Resume not found");
    uploadedBlobs.delete(id);
    overlay.update<SavedResume[]>(UPLOADED_RESUMES_KEY, [], (list) =>
      list.filter((r) => r.id !== id),
    );
    overlay.push("resumes:deleted", id);
    return { detail: "Resume deleted." };
  },

  /**
   * Streams the PDF. Returns a real Blob because the caller passes
   * `responseType: "blob"` and hands the result straight to
   * `URL.createObjectURL`, which throws on a plain object.
   */
  "GET /accounts/clients/:clientId/user-profile/resumes/:resumeId/view/": (req) => {
    const id = Number(req.params.resumeId);
    if (!myResumes().some((r) => r.id === id)) throw notFound("Resume not found");
    return resumeBlob(id, STUDENT_PERSONA.id);
  },

  "GET /accounts/clients/:clientId/user-profile/resumes/:resumeId/download/": (req) => {
    const id = Number(req.params.resumeId);
    if (!myResumes().some((r) => r.id === id)) throw notFound("Resume not found");
    return resumeBlob(id, STUDENT_PERSONA.id);
  },

  // ── Admin view of a student ─────────────────────────────────────────────
  /**
   * `UserProfile & { id }`. The admin profile page renders the same
   * `PublicProfileView` the learner sees, so a partial profile does not degrade,
   * it renders a page of empty sections.
   */
  "GET /admin-dashboard/api/clients/:clientId/student-profile/:studentId/": (req) => {
    const p = rosterPerson(Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    return { id: p.id, ...profileFor(p) };
  },

  /**
   * Every student has at least one resume on file.
   *
   * Deliberate: the admin resume viewer is one of the screens a prospect is
   * most likely to open at random, and an empty shelf on every student makes
   * the feature look unbuilt rather than unused.
   */
  "GET /admin-dashboard/api/clients/:clientId/student-profile/:studentId/resumes/": (req) => {
    const id = Number(req.params.studentId);
    const p = rosterPerson(id);
    if (!p) throw notFound("Student not found");
    if (id === STUDENT_PERSONA.id) return myResumes().map(toApiResume);
    const resumeId = 5200 + (id % 1000);
    return [
      {
        id: resumeId,
        display_name: `${p.full_name} - Resume.pdf`,
        file_url: `/admin-dashboard/api/clients/${DEMO_CLIENT_ID}/student-profile/${id}/resumes/${resumeId}/view/`,
        created_at: isoDaysAgo(seededInt(`res:${id}`, 3, 120), 19, 15),
      },
    ];
  },

  "GET /admin-dashboard/api/clients/:clientId/student-profile/:studentId/resumes/:resumeId/view/": (
    req,
  ) => {
    const p = rosterPerson(Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    return resumeBlob(Number(req.params.resumeId), p.id);
  },

  // ── Student record: edit, activate, delete ──────────────────────────────
  "PATCH /admin-dashboard/api/clients/:clientId/manage-student/:studentId/": (req) => {
    const id = Number(req.params.studentId);
    const p = rosterPerson(id);
    if (!p) throw notFound("Student not found");
    const body = (req.body ?? {}) as Record<string, unknown>;

    const patch: RosterEdit = {};
    if (typeof body.first_name === "string") patch.first_name = body.first_name;
    if (typeof body.last_name === "string") patch.last_name = body.last_name;
    if (typeof body.email === "string") patch.email = body.email;
    if (typeof body.role === "string") patch.role = body.role;
    if (typeof body.is_active === "boolean") patch.is_active = body.is_active;
    editRoster(id, patch);

    const updated = rosterPerson(id)!;
    return {
      id: updated.id,
      user_id: updated.id,
      first_name: updated.first_name,
      last_name: updated.last_name,
      name: updated.full_name,
      email: updated.email,
      role: patch.role ?? updated.role,
      is_active: isRosterActive(id),
      detail: "Student updated.",
    };
  },

  /**
   * The action endpoint: activate, enroll, unenroll, reset.
   *
   * One POST with an `action` discriminator rather than four routes, because
   * that is what the service sends. Anything unrecognised is rejected instead of
   * silently reporting success, which is the failure that makes a demo look
   * fine and behave wrongly.
   */
  "POST /admin-dashboard/api/clients/:clientId/manage-student/:studentId/": (req) => {
    const id = Number(req.params.studentId);
    const p = rosterPerson(id);
    if (!p) throw notFound("Student not found");
    const action = String(req.body?.action ?? "");
    const courseId = req.body?.course_id != null ? Number(req.body.course_id) : null;
    const course = courseId != null ? courseById(courseId) : null;

    switch (action) {
      case "activate":
        editRoster(id, { is_active: true });
        return { detail: `${p.full_name} can sign in again.`, is_active: true };
      case "deactivate":
        editRoster(id, { is_active: false });
        return { detail: `${p.full_name} can no longer sign in.`, is_active: false };
      case "enroll_course":
        if (!course) throw badRequest({ error: "Pick a course to enroll into." });
        return { detail: `${p.full_name} enrolled into ${course.title}.`, course_id: course.id };
      case "unenroll_course":
        if (!course) throw badRequest({ error: "Pick a course to remove." });
        return { detail: `${p.full_name} removed from ${course.title}.`, course_id: course.id };
      case "reset_progress": {
        const counts = resetCounts(p, true, true);
        const total = Object.values(counts).reduce((s, n) => s + n, 0);
        recordReset(p, counts, total, scopeLabel(true, true), "");
        return { detail: `Reset ${total} records for ${p.full_name}.`, total };
      }
      default:
        throw badRequest({ error: `Unknown action "${action}".` });
    }
  },

  /**
   * Deactivate, or hard-delete when `?hard=true`.
   *
   * Both write to the overlay so the row really does change on the next refresh.
   * A delete that leaves the student in the table is the one outcome an
   * administrator will notice immediately.
   */
  "DELETE /admin-dashboard/api/clients/:clientId/manage-student/:studentId/": (req) => {
    const id = Number(req.params.studentId);
    const p = rosterPerson(id);
    if (!p) throw notFound("Student not found");

    if (req.query.get("hard") === "true") {
      editRoster(id, { removed: true });
      return {
        detail: `${p.full_name} was removed from ${DEMO_TENANT.name}.`,
        hard_deleted: true,
      };
    }
    editRoster(id, { is_active: false });
    return { detail: `${p.full_name} was deactivated.`, hard_deleted: false };
  },

  // ── Progress reset ──────────────────────────────────────────────────────
  /**
   * The preview the confirmation dialog opens on.
   *
   * `adaptive` and `assessments` only appear in the query when they are FALSE
   * (the service omits them when true), so the default for a missing param has
   * to be true, not false. Reading them the other way round showed "nothing to
   * reset" on every student.
   */
  "GET /admin-dashboard/api/clients/:clientId/manage-student/:studentId/reset-progress/": (req) => {
    const p = rosterPerson(Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    const adaptive = req.query.get("adaptive") !== "false";
    const assessments = req.query.get("assessments") !== "false";
    const counts = resetCounts(p, adaptive, assessments);

    return {
      counts,
      total: Object.values(counts).reduce((s, n) => s + n, 0),
      scope: scopeLabel(adaptive, assessments),
      preserved: PRESERVED,
      student: { id: p.id, email: p.email, name: p.full_name },
      confirmation_required: p.email,
    };
  },

  "POST /admin-dashboard/api/clients/:clientId/manage-student/:studentId/reset-progress/": (req) => {
    const p = rosterPerson(Number(req.params.studentId));
    if (!p) throw notFound("Student not found");
    const body = (req.body ?? {}) as Record<string, unknown>;
    const confirm = String(body.confirm_email ?? "").trim().toLowerCase();

    // The server check exists in the real product too. Keeping it means the
    // dialog's guard is a convenience rather than the only thing standing
    // between an administrator and the wrong student.
    if (confirm !== p.email.toLowerCase()) {
      throw badRequest({
        detail: "That is not this student's email address. Nothing was changed.",
      });
    }

    const adaptive = body.adaptive !== false;
    const assessments = body.assessments !== false;
    const counts = resetCounts(p, adaptive, assessments);
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    const scope = scopeLabel(adaptive, assessments);
    const record = recordReset(p, counts, total, scope, String(body.note ?? ""), adaptive, assessments);

    return {
      reset_id: record.id,
      performed_at: record.performed_at,
      counts,
      total,
      scope,
    };
  },

  "GET /admin-dashboard/api/clients/:clientId/manage-student/:studentId/reset-history/": (req) => ({
    results: resetHistory(Number(req.params.studentId)),
  }),

  // ── Enrollment ──────────────────────────────────────────────────────────
  /**
   * Bulk enroll or unenroll existing students. Synchronous in the real product
   * too, so there is no job to poll here.
   */
  "POST /admin-dashboard/api/clients/:clientId/students/bulk-course-action/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const action = String(body.action ?? "enroll");
    const studentIds = Array.isArray(body.student_ids) ? (body.student_ids as number[]) : [];
    const courseIds = Array.isArray(body.course_ids) ? (body.course_ids as number[]) : [];
    const adaptiveIds = Array.isArray(body.adaptive_course_ids)
      ? (body.adaptive_course_ids as number[])
      : [];

    const results: Array<{
      student_id: number;
      course_id?: number | null;
      adaptive_course_id?: number | null;
      status: string;
      detail?: string;
    }> = [];

    for (const studentId of studentIds) {
      for (const courseId of courseIds) {
        results.push({
          student_id: studentId,
          course_id: courseId,
          adaptive_course_id: null,
          status: action === "enroll" ? "enrolled" : "unenrolled",
        });
      }
      for (const courseId of adaptiveIds) {
        results.push({
          student_id: studentId,
          course_id: null,
          adaptive_course_id: courseId,
          status: action === "enroll" ? "enrolled" : "unenrolled",
        });
      }
    }

    return {
      action,
      succeeded: results.length,
      failed: 0,
      results,
    };
  },

  /**
   * Quick-enroll one student. Creates the account when the email is new, and is
   * idempotent when it is not, which is why the response separates "enrolled"
   * from "already enrolled": re-running it must not report zero.
   */
  "POST /admin-dashboard/api/clients/:clientId/students/enroll-single/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    if (!name || !email) throw badRequest({ error: "A name and an email address are required." });

    const legacyIds = parseIdList(body.course_ids);
    const adaptiveIds = parseIdList(body.adaptive_course_ids);

    const existing = applyRoster(ALL_PEOPLE).find(
      (p) => p.email.toLowerCase() === email.toLowerCase(),
    );

    if (existing) {
      return {
        email: existing.email,
        user_id: existing.id,
        profile_id: existing.id,
        created_account: false,
        created_profile: false,
        legacy_enrolled: [] as number[],
        legacy_already_enrolled: legacyIds,
        adaptive_enrolled: 0,
        adaptive_already_enrolled: adaptiveIds.length,
      };
    }

    const [first, ...rest] = name.split(/\s+/);
    const created: AddedStudent = {
      id: nextDemoId("student"),
      first_name: first,
      last_name: rest.join(" "),
      email,
      phone: String(body.phone ?? "").trim(),
      created_at: iso(new Date(nowMs())),
    };
    overlay.push("roster:added", created);

    return {
      email,
      user_id: created.id,
      profile_id: created.id,
      created_account: true,
      created_profile: true,
      legacy_enrolled: legacyIds,
      legacy_already_enrolled: [] as number[],
      adaptive_enrolled: adaptiveIds.length,
      adaptive_already_enrolled: 0,
    };
  },

  /** Start a CSV enrollment job. The status endpoint below reports its progress. */
  "POST /admin-dashboard/api/clients/:clientId/student-enrollment-jobs/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const students = Array.isArray(body.students)
      ? (body.students as Array<{ name: string; email: string; phone?: string }>)
      : [];
    if (students.length === 0) {
      throw badRequest({ error: "The uploaded file had no usable rows." });
    }

    const id = nextDemoId("enrollment-job");
    const seed: EnrollmentJobSeed = {
      id,
      task_id: `enroll-${id}`,
      students,
      course_ids: [...parseIdList(body.course_ids), ...parseIdList(body.adaptive_course_ids)],
      created_ms: nowMs(),
      created_at: iso(new Date(nowMs())),
    };
    overlay.push("enrollment:jobs", seed);

    // Every student in the file also joins the roster, so the manage-students
    // table reflects the upload once the job finishes.
    for (const s of students) {
      const email = String(s.email ?? "").trim();
      if (!email) continue;
      if (applyRoster(ALL_PEOPLE).some((p) => p.email.toLowerCase() === email.toLowerCase())) {
        continue;
      }
      const [first, ...rest] = String(s.name ?? email).trim().split(/\s+/);
      overlay.push("roster:added", {
        id: nextDemoId("student"),
        first_name: first,
        last_name: rest.join(" "),
        email,
        phone: String(s.phone ?? ""),
        created_at: iso(new Date(nowMs())),
      } satisfies AddedStudent);
    }

    return toEnrollmentJob(seed);
  },

  "GET /admin-dashboard/api/clients/:clientId/student-enrollment-jobs/:taskId/": (req) => {
    const wanted = String(req.params.taskId);
    const found = enrollmentJobSeeds().find(
      (j) => j.task_id === wanted || String(j.id) === wanted,
    );
    if (!found) throw notFound("Enrollment job not found");
    return toEnrollmentJob(found);
  },

  // ── Instructor approvals ────────────────────────────────────────────────
  /**
   * Approve an applicant from the pending-instructors queue.
   *
   * Writes the SAME overlay key and shape `admin.ts` uses for its own approve
   * route (`instructors:decisions`), so the row moves out of Pending no matter
   * which of the two screens the click came from. Duplicating the key rather
   * than importing keeps the two handler modules independent; if that key ever
   * changes, both must change together.
   */
  "POST /admin-dashboard/api/clients/:clientId/pending-instructors/:profileId/approve/": (req) => {
    const id = Number(req.params.profileId);
    overlay.update<Record<string, { status: string; reason: string | null }>>(
      "instructors:decisions",
      {},
      (current) => ({ ...current, [String(id)]: { status: "approved", reason: null } }),
    );
    // Applicants are not on the seeded cast (they have signed up but nobody has
    // let them in), so the name is only available for staff who already teach
    // here. The fallback stays specific about what approval GRANTS rather than
    // padding a generic sentence with a name it does not have.
    const person = personById(id);
    return {
      detail: person
        ? `${person.full_name} can now teach on ${DEMO_TENANT.name}.`
        : "Approved. They can now be assigned courses and cohorts.",
      profile: person
        ? { id: person.id, email: person.email, full_name: person.full_name, pending_status: "approved" }
        : { id, pending_status: "approved" },
    };
  },

  // ── Scorecard configuration: badges ─────────────────────────────────────
  /** `{ badges }`. The service reads `data?.badges ?? []`. */
  "GET /admin-dashboard/api/clients/:clientId/badges/": (req) => {
    const includeInactive = req.query.get("include_inactive") === "1";
    const rows = allBadges().filter((b) => includeInactive || b.is_active);
    return { badges: rows, count: rows.length };
  },

  "POST /admin-dashboard/api/clients/:clientId/badges/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) throw badRequest({ error: "Give the badge a name." });

    const seed: BadgeSeed = {
      id: nextDemoId("badge"),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: String(body.description ?? ""),
      icon_slug: String(body.icon_slug ?? "mdi:trophy-outline"),
      criteria_json: (body.criteria_json ?? {}) as Record<string, unknown>,
      points: Number(body.points ?? 10),
      is_active: true,
      // Nobody has earned it yet, and showing an award count on a badge created
      // ten seconds ago would be the detail that gives the demo away.
      reach: 0,
      createdDaysAgo: 0,
    };
    overlay.unshift("badges:created", seed);
    return toApiBadge(seed);
  },

  "PATCH /admin-dashboard/api/clients/:clientId/badges/:badgeId/": (req) => {
    const id = Number(req.params.badgeId);
    const current = allBadges().find((b) => b.id === id);
    if (!current) throw notFound("Badge not found");
    const body = (req.body ?? {}) as Record<string, unknown>;

    const patch: BadgeEdit = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.icon_slug === "string") patch.icon_slug = body.icon_slug;
    if (body.criteria_json != null) patch.criteria_json = body.criteria_json as Record<string, unknown>;
    if (body.points != null) patch.points = Number(body.points);
    if (typeof body.is_active === "boolean") patch.is_active = body.is_active;

    overlay.update<Record<string, BadgeEdit>>("badges:edits", {}, (edits) => ({
      ...edits,
      [String(id)]: { ...(edits[String(id)] ?? {}), ...patch },
    }));

    return allBadges().find((b) => b.id === id) ?? { ...current, ...patch };
  },

  "DELETE /admin-dashboard/api/clients/:clientId/badges/:badgeId/": (req) => {
    const id = Number(req.params.badgeId);
    if (!allBadges().some((b) => b.id === id)) throw notFound("Badge not found");
    overlay.update<Record<string, BadgeEdit>>("badges:edits", {}, (edits) => ({
      ...edits,
      [String(id)]: { ...(edits[String(id)] ?? {}), deleted: true },
    }));
    return { detail: "Badge deleted." };
  },

  // ── Scorecard configuration: skills ─────────────────────────────────────
  /** `{ skills }`. The service reads `data?.skills ?? []`. */
  "GET /admin-dashboard/api/clients/:clientId/skills/": (req) => {
    const search = (req.query.get("search") ?? "").trim().toLowerCase();
    const category = (req.query.get("category") ?? "").trim();
    const includeInactive = req.query.get("include_inactive") === "1";
    const rows = allSkills().filter((s) => {
      if (!includeInactive && !s.is_active) return false;
      if (category && s.category !== category) return false;
      if (search && !s.name.toLowerCase().includes(search) && !s.category.toLowerCase().includes(search)) {
        return false;
      }
      return true;
    });
    return { skills: rows, count: rows.length };
  },

  "POST /admin-dashboard/api/clients/:clientId/skills/": (req) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) throw badRequest({ error: "Give the skill a name." });
    if (allSkills().some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      throw badRequest({ error: `"${name}" already exists in the catalogue.` });
    }

    const seed: SkillSeed = {
      id: nextDemoId("skill"),
      name,
      category: String(body.category ?? "").trim(),
      description: String(body.description ?? "").trim(),
    };
    overlay.unshift("skills:created", seed);
    // A brand-new skill is tagged to nothing, so its mapping count must be 0
    // rather than the seeded value `toApiSkill` would otherwise invent.
    return { ...toApiSkill(seed), mapping_count: 0 };
  },

  "PATCH /admin-dashboard/api/clients/:clientId/skills/:skillId/": (req) => {
    const id = Number(req.params.skillId);
    const current = allSkills().find((s) => s.id === id);
    if (!current) throw notFound("Skill not found");
    const body = (req.body ?? {}) as Record<string, unknown>;

    const patch: SkillEdit = {};
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.category === "string") patch.category = body.category;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.is_active === "boolean") patch.is_active = body.is_active;

    overlay.update<Record<string, SkillEdit>>("skills:edits", {}, (edits) => ({
      ...edits,
      [String(id)]: { ...(edits[String(id)] ?? {}), ...patch },
    }));
    return allSkills().find((s) => s.id === id) ?? { ...current, ...patch };
  },

  /** Soft delete: the page's own confirm text promises existing mappings survive. */
  "DELETE /admin-dashboard/api/clients/:clientId/skills/:skillId/": (req) => {
    const id = Number(req.params.skillId);
    if (!allSkills().some((s) => s.id === id)) throw notFound("Skill not found");
    overlay.update<Record<string, SkillEdit>>("skills:edits", {}, (edits) => ({
      ...edits,
      [String(id)]: { ...(edits[String(id)] ?? {}), deleted: true },
    }));
    return { detail: "Skill deactivated. Existing mappings were kept." };
  },

  // ── File exports ────────────────────────────────────────────────────────
  /**
   * The whole insights dashboard as one CSV.
   *
   * The figures are recomputed from the same seeds the dashboard endpoints use
   * (`pulse:items`, `lbact:<id>`, the course completion formula), so the export
   * an administrator opens in Excel matches the screen they took it from. That
   * is the entire point of an export, and the fastest way to lose trust in one.
   */
  "GET /admin-dashboard/api/clients/:clientId/insights/export/": (req) => {
    const range = req.query.get("range") ?? "30d";
    const courseId = req.query.get("course_id");
    const scoped = courseId ? courseById(Number(courseId)) : null;
    const students = applyRoster([STUDENT_PERSONA, ...STUDENTS]);
    const courses = scoped ? [scoped] : COURSES;

    const rows: string[] = [];
    rows.push(csvRow([`${DEMO_TENANT.name} - learning insights`]));
    rows.push(csvRow(["Exported", ymd(daysAgo(0))]));
    rows.push(csvRow(["Range", range]));
    rows.push(csvRow(["Course filter", scoped ? scoped.title : "All courses"]));
    rows.push("");

    rows.push(csvRow(["Pulse"]));
    rows.push(csvRow(["Metric", "Value", "Definition"]));
    rows.push(
      csvRow([
        "Active students",
        Math.round(students.length * 0.72),
        "Distinct students with at least one recorded activity in the range.",
      ]),
    );
    rows.push(
      csvRow([
        "Items completed",
        seededInt("pulse:items", 640, 980),
        "Lessons, quizzes and assignments marked complete in the range.",
      ]),
    );
    rows.push(
      csvRow(["Median minutes per active day", 38, "Median, not mean, so one outlier cannot move it."]),
    );
    rows.push(csvRow(["Stale tickets", 3, "Open for more than 72 hours with no staff reply."]));
    rows.push("");

    rows.push(csvRow(["Courses"]));
    rows.push(
      csvRow(["Course", "Enrolled", "Started", "Never started", "Items", "Completion %", "Activation %"]),
    );
    for (const c of courses) {
      const enrolled = c.enrolledCount;
      const started = Math.round(enrolled * (c.enrolled ? 0.82 : 0.34));
      const nodes = c.modules.reduce((s, m) => s + m.topics.length, 0);
      rows.push(
        csvRow([
          c.title,
          enrolled,
          started,
          enrolled - started,
          nodes,
          c.completion,
          Math.round((started / Math.max(1, enrolled)) * 100),
        ]),
      );
    }
    rows.push("");

    rows.push(csvRow(["Leaderboard"]));
    rows.push(csvRow(["Rank", "Student", "Email", "Points", "Activities"]));
    rankedLearners()
      .slice(0, 20)
      .forEach((p, i) => {
        rows.push(
          csvRow([i + 1, p.full_name, p.email, p.points, seededInt(`lbact:${p.id}`, 40, 260)]),
        );
      });

    return new Blob([rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  },

  /**
   * The learner's scorecard as a PDF.
   *
   * Skill scores use the SAME seed keys as the on-screen scorecard
   * (`scskill:<tag>` in `dashboard.ts`), and course completion comes from the
   * shared course records, so the download cannot contradict the page it was
   * taken from.
   */
  "GET /api/scorecard/clients/:clientId/student/scorecard/export/pdf/": () => {
    const me = STUDENT_PERSONA;
    const enrolled = COURSES.filter((c) => c.enrolled);
    const rank = rankedLearners().findIndex((p) => p.id === me.id) + 1;

    const lines: PdfLine[] = [
      { text: `${DEMO_TENANT.name}`, bold: true, size: 12 },
      { text: "Learner scorecard", bold: true, size: 22 },
      { text: `${me.full_name}  |  ${me.email}`, size: 11 },
      { text: `Generated ${ymd(daysAgo(0))}`, size: 9.5 },

      { text: "SUMMARY", bold: true, size: 11, gap: 14 },
      { text: `Total points: ${me.points.toLocaleString()}`, size: 10.5 },
      { text: `Leaderboard rank: ${rank} of ${rankedLearners().length}`, size: 10.5 },
      { text: `Current streak: ${me.streak} days`, size: 10.5 },
      { text: `Courses enrolled: ${enrolled.length}`, size: 10.5 },

      { text: "COURSE PROGRESS", bold: true, size: 11, gap: 14 },
    ];

    for (const c of enrolled) {
      const items = c.modules.reduce((s, m) => s + m.topics.length, 0);
      lines.push({
        text: `${c.title} - ${c.completion}% complete, ${items} items, taught by ${c.instructor.full_name}`,
        size: 10,
      });
    }

    lines.push({ text: "SKILLS", bold: true, size: 11, gap: 14 });
    const tags = enrolled.flatMap((c) => c.tags.slice(0, 4)).filter((t, i, a) => a.indexOf(t) === i);
    for (const tag of tags.slice(0, 10)) {
      const score = seededInt(`scskill:${tag}`, 38, 92);
      const band = score >= 75 ? "strong" : score >= 50 ? "developing" : "needs work";
      lines.push({ text: `${tag}: ${score}% (${band})`, size: 10 });
    }

    lines.push({ text: "NEXT STEPS", bold: true, size: 11, gap: 14 });
    const weakest = [...tags]
      .sort((a, b) => seededInt(`scskill:${a}`, 38, 92) - seededInt(`scskill:${b}`, 38, 92))
      .slice(0, 3);
    for (const tag of weakest) {
      lines.push({
        text: `Two focused sessions on ${tag} would move this more than another pass over material already covered.`,
        size: 10,
      });
    }

    return simplePdf(`${me.full_name} - Scorecard`, lines);
  },
});

// ─────────────────────────────── Helpers ───────────────────────────────────

/** Persist a reset so the history list and the next preview both reflect it. */
function recordReset(
  p: DemoPerson,
  counts: Record<string, number>,
  total: number,
  scope: string,
  note: string,
  adaptive = true,
  assessments = true,
): ResetRecord {
  const record: ResetRecord = {
    id: nextDemoId("progress-reset"),
    performed_at: iso(new Date(nowMs())),
    performed_by: ADMIN_PERSONA.full_name,
    scope,
    deleted_counts: counts,
    total,
    note: note.trim(),
  };
  overlay.unshift(`reset:history:${p.id}`, record);
  overlay.update<string[]>(`reset:scopes:${p.id}`, [], (done) => {
    const next = new Set(done);
    if (adaptive) next.add("adaptive");
    if (assessments) next.add("assessments");
    return [...next];
  });
  return record;
}

/** "360,361" or [360, 361] or "" -> number[]. The CSV form sends the string. */
function parseIdList(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter((n) => Number.isFinite(n));
  return String(value ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}
