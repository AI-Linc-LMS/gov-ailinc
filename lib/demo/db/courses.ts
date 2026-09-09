/**
 * The course catalogue.
 *
 * One definition per course, projected into whichever shape an endpoint needs:
 * the legacy `lms/.../courses/` list, the adaptive dashboard card, the catalogue
 * page, the journey board. An aspirant who sees "62% complete" on the dashboard
 * and then opens the course must find 62% there too, and the only way to
 * guarantee that is for both to be computed from the same record.
 *
 * Content is a real syllabus rather than lorem: the fastest way to lose a room
 * of programme officers is a course card reading "Module 1 / Module 2".
 *
 * This is the government instance (Telangana Skills & Employment Mission), so
 * the catalogue is 19 courses in two sections: recruitment-exam preparation on
 * one side, vocational trades and rural enterprise on the other. Course ids
 * 301-319 are fixed by docs/GOVERNMENT-BUILD-BRIEF.md and are quoted by the
 * curriculum files, the quiz bank, the jobs module and the seed rosters, so
 * they are not renumbered.
 */

import { avatarFor } from "./avatar";
import { INSTRUCTOR_PERSONA, FACULTY, type DemoPerson } from "./people";
import { daysAhead, isoDaysAgo, isoDaysAhead } from "../clock";
import { seededInt } from "../random";

/* ------------------------------------------------------------------ *
 * Taxonomy: two sections, two categories each.
 * ------------------------------------------------------------------ */

export type CourseSectionSlug = "govt-jobs" | "skills-entrepreneurship";

export type CourseCategorySlug =
  | "state-central-psu"
  | "banking"
  | "rural-employment-vocational"
  | "rural-entrepreneurship";

export interface CourseCategory {
  slug: CourseCategorySlug;
  /** Shown as the category heading on the catalogue page. */
  title: string;
  /** One line under that heading. */
  blurb: string;
  /** Iconify name, from the locally bundled set. No network icon lookups. */
  icon: string;
  section: CourseSectionSlug;
}

export interface CourseSection {
  slug: CourseSectionSlug;
  title: string;
  blurb: string;
  icon: string;
  /** Hex, used for the section rule and the section chip. */
  accent: string;
}

export const COURSE_SECTIONS: readonly CourseSection[] = [
  {
    slug: "govt-jobs",
    title: "Government Job Related Courses",
    blurb:
      "Structured preparation for state, central, railway, police, public undertaking and " +
      "banking recruitment, from the notification to the interview board.",
    icon: "mdi:office-building-outline",
    accent: "#1b4f8a",
  },
  {
    slug: "skills-entrepreneurship",
    title: "Skill Development & Entrepreneurship",
    blurb:
      "Trade training and enterprise support delivered through district skill centres, built " +
      "around work that already exists in the mandal.",
    icon: "mdi:sprout-outline",
    accent: "#0e7a3c",
  },
];

/**
 * Categories, keyed by slug.
 *
 * Written as a keyed record rather than a plain array so that adding a slug to
 * `CourseCategorySlug` without describing it is a compile error, and so
 * `categoryOf` is total by construction: it is called as `categoryOf(x).title`
 * on the list endpoint, and an undefined there would blank the catalogue.
 */
const CATEGORY_INDEX: Record<CourseCategorySlug, CourseCategory> = {
  "state-central-psu": {
    slug: "state-central-psu",
    title: "State (Telangana), Central & PSU Jobs",
    blurb:
      "TGPSC, SSC, railway, police and public undertaking recruitment, taken syllabus by " +
      "syllabus rather than as one general studies course.",
    icon: "mdi:bank-outline",
    section: "govt-jobs",
  },
  banking: {
    slug: "banking",
    title: "Banking & Financial Sector Jobs",
    blurb:
      "IBPS, SBI, RBI and NABARD preparation, with the awareness paper treated as a subject " +
      "in its own right instead of a monthly digest.",
    icon: "mdi:cash-multiple",
    section: "govt-jobs",
  },
  "rural-employment-vocational": {
    slug: "rural-employment-vocational",
    title: "Rural Employment Generation",
    blurb:
      "Vocational trades chosen because a trained hand is hired for them inside the district, " +
      "taught to the standard a site or a service counter holds you to.",
    icon: "mdi:hammer-wrench",
    section: "skills-entrepreneurship",
  },
  "rural-entrepreneurship": {
    slug: "rural-entrepreneurship",
    title: "Rural Entrepreneurship & Development",
    blurb:
      "Starting, financing and running an enterprise that a village economy can actually " +
      "support, including the credit and compliance that decide whether it survives.",
    icon: "mdi:store-outline",
    section: "skills-entrepreneurship",
  },
};

/** Display order for the catalogue page. */
const CATEGORY_ORDER: readonly CourseCategorySlug[] = [
  "state-central-psu",
  "banking",
  "rural-employment-vocational",
  "rural-entrepreneurship",
];

export const COURSE_CATEGORIES: readonly CourseCategory[] = CATEGORY_ORDER.map(
  (slug) => CATEGORY_INDEX[slug],
);

/** The category record for a slug. Total: every slug in the union has an entry. */
export function categoryOf(slug: CourseCategorySlug): CourseCategory {
  return CATEGORY_INDEX[slug];
}

/* ------------------------------------------------------------------ *
 * Course shapes.
 * ------------------------------------------------------------------ */

export interface DemoTopic {
  id: number;
  title: string;
  /**
   * Learning content types this topic contains, in order.
   *
   * Only "article", "quiz" and "assignment" are used by this catalogue.
   *
   * "video" is supported everywhere (handlers, points, journey counts) but is
   * deliberately UNUSED by the seed. The player is a Vimeo iframe, and this demo
   * is required to run with no network at all, so a video step could only ever
   * render as a dead embed, which is worse than not offering it.
   *
   * "coding" is supported for the same reason and is also unused here, but on
   * different grounds: this product line has no code judge, and a coding card on
   * a tailoring or a police recruitment course is the single most obvious way to
   * reveal that the content was ported from a software LMS.
   *
   * To turn video back on: drop an MP4 into /public and point the companion at
   * it, switch the player from the Vimeo iframe to a <video> element, then add
   * "video" back to whichever topics should have it. Everything downstream
   * already handles it.
   */
  kinds: Array<"article" | "video" | "quiz" | "coding" | "assignment">;
  /** 0-100. 100 = finished, 0 = untouched. */
  progress: number;
}

export interface DemoModule {
  id: number;
  title: string;
  summary: string;
  topics: DemoTopic[];
}

export interface DemoCourse {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  /** Which of the two headline sections this course sits in. */
  section: CourseSectionSlug;
  /** Which category inside that section. Exactly one, never derived elsewhere. */
  category: CourseCategorySlug;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  tags: string[];
  instructor: DemoPerson;
  /** Whether the signed-in aspirant persona is enrolled. */
  enrolled: boolean;
  /**
   * Overall completion for the enrolled aspirant, 0-100.
   *
   * DERIVED from the topics below, never hand-set. When it was a literal, the
   * journey board reported "62% complete" beside "9 / 21 steps done", which is
   * 43%, because the two came from different places. Computing it from the
   * topics means the course card, the readiness ring, the progress bar and the
   * step count are all the same number by construction.
   */
  completion: number;
  /** Accent used for the generated card art. */
  accent: [string, string];
  modules: DemoModule[];
  /**
   * Days from today until the current week's work is due. Null = self-paced.
   *
   * Null on every course, deliberately. The journey board runs unlocked
   * (`contentLocked: false`), whose banner reads "no due dates, no late
   * penalties", so a dashboard card promising "Due Aug 10, 4 days left" for the
   * same course contradicted it two clicks away. The mission runs open batches
   * that a trainee joins mid-cycle; deadlines are worth demonstrating on the
   * admin side, where a programme officer sets them, rather than faked on the
   * learner side.
   *
   * The field stays because the shape is real and an admin-side demo may set it.
   */
  dueInDays: number | null;
  certificateThreshold: number;
  enrolledCount: number;
  rating: number;
  ratingCount: number;
}

/**
 * Cover photographs, one per course.
 *
 * Every one was fetched and LOOKED AT before being written down, not picked by
 * guessing at a photo id: the rooftop shot really is a technician laying a
 * module, the platform shot really is a railway platform. A cover that turns out
 * to be a beach is worse than the gradient it replaced, and on a catalogue this
 * literal (a solar array, a sewing floor, a grain field) a wrong photo is read
 * as a wrong course.
 *
 * Unsplash's permanent `images.unsplash.com/photo-<id>` form, not the retired
 * `source.unsplash.com` redirector, and sized down at the CDN so a card pulls
 * roughly 30KB rather than a full-resolution original.
 *
 * A course with no verified photo gets no entry here and falls back to the
 * generated gradient, which is an acceptable outcome and better than a guess.
 *
 * These are the only remote images in the product besides the roster portraits.
 * `courseArt` below stays as the fallback and every consumer must use it on
 * error, so a blocked network degrades to the gradient rather than a broken
 * image frame.
 */
const COVERS: Record<number, string> = {
  // Aspirants at study desks on a library floor, seen from the gallery above.
  301: "photo-1680534240478-08c865dc608f",
  // A candidate working alone at a long library desk under reading lamps.
  302: "photo-1741699428220-65f37f3fbbcb",
  // A row of young men writing at desks in a classroom, pens on answer sheets.
  303: "photo-1686624386665-4cd01b96d0f6",
  // An Indian railway platform: passengers with bedrolls walking beside a train.
  304: "photo-1757841239542-c29c68d4b130",
  // Police personnel in khaki on parade, shoulder insignia in frame.
  305: "photo-1615482317463-44b35bbbd678",
  // The interior of a heavy plant: gantry crane, girders and furnace light.
  306: "photo-1496247749665-49cf5b1022e9",
  // A hand entering a PIN at an ATM keypad, receipt and cash slots visible.
  307: "photo-1710149459994-480e2b5c3b16",
  // Indian hundred rupee notes fanned out around a ten rupee coin.
  308: "photo-1565374392032-8007fb37c26e",
  // Trading and yield charts across two monitors.
  309: "photo-1560221328-12fe60f83ab8",
  // Folded newspapers, the business section on top.
  310: "photo-1504711434969-e33886168f5c",
  // A technician laying a solar module onto a pitched roof array.
  311: "photo-1624397640148-949b1732bb0a",
  // Gloved hands testing a DIN rail board of miniature circuit breakers.
  312: "photo-1758101755915-462eddc23f57",
  // Hands guiding striped fabric under an industrial sewing machine needle.
  313: "photo-1673201229733-69d19c5c4a87",
  // A technician working on an opened smartphone board with a bench of parts.
  314: "photo-1550041473-d296a3a8a18a",
  // A full computer lab: rows of desktops with students at every terminal.
  315: "photo-1569653402334-2e98fbaa80ee",
  // Customers at a small roadside shop counter, stock stacked to the ceiling.
  316: "photo-1771694583823-57e21a49aabe",
  // Rural women seated together on the ground outside a house, in a meeting.
  317: "photo-1708593337380-6f97a307696f",
  // Women working a green leafy vegetable plot, transplanting by hand.
  318: "photo-1707721690626-10e5f0366bcb",
  // A seller checking an online order on a phone beside parcels and a laptop.
  319: "photo-1770013413878-2530e2c3d82b",
};

/** The cover photo for a course, or "" when none is mapped. */
export function courseCover(courseId: number, width = 800): string {
  const id = COVERS[courseId];
  return id ? `https://images.unsplash.com/${id}?w=${width}&q=70&fm=jpg&fit=crop` : "";
}

/** Generated card art: a gradient plate with the course initials. Keeps the repo light and offline. */
export function courseArt(course: { title: string; accent: [string, string] }): string {
  const [from, to] = course.accent;
  // Stopwords are dropped so "Access to Finance" reads "AF", not "AT".
  const STOPWORDS = new Set(["for", "and", "of", "with", "the", "to", "in", "on", "a", "an"]);
  const initials = course.title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !STOPWORDS.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const id = `ca${initials}${from.replace("#", "")}`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="480" height="270">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#${id})"/>
      <circle cx="410" cy="46" r="120" fill="#ffffff" opacity="0.07"/>
      <circle cx="70" cy="240" r="90" fill="#ffffff" opacity="0.06"/>
      <text x="40" y="168" font-family="Satoshi, 'Segoe UI', Helvetica, Arial, sans-serif"
            font-size="96" font-weight="700" fill="#ffffff" opacity="0.92">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

/**
 * Topic and module ids are written out at the call site, not auto-incremented.
 *
 * The rule, from the build brief:
 *   topic id  = courseId * 100 + n, n counting 1-based across the WHOLE course
 *               in module order (course 301 runs 30101, 30102, ... 30128)
 *   module id = courseId * 1000 + moduleIndex, 1-based (301001, 301002, ...)
 *
 * An auto-incrementing sequence was what this file used when it held five
 * software courses and one person owned all of them. It cannot survive here.
 * Seventeen curriculum files under db/curriculum/ and every quiz bank entry are
 * keyed by topic id and are authored by different people in parallel, so two
 * properties matter more than brevity: an author must be able to read a topic id
 * off this file without counting from the top, and inserting a module into
 * course 305 must not silently renumber course 306 and orphan its content.
 * Explicit ids give both. The trade is that a mistyped id is possible, which is
 * why the ids are asserted unique at module load below.
 */
function topic(
  id: number,
  title: string,
  kinds: DemoTopic["kinds"],
  progress: number,
): DemoTopic {
  return { id, title, kinds, progress };
}

function courseModule(
  id: number,
  title: string,
  summary: string,
  topics: DemoTopic[],
): DemoModule {
  return { id, title, summary, topics };
}

/**
 * Teaching staff for the catalogue.
 *
 * `people.ts` is authored separately and its roster length is not this file's
 * business, so faculty are read through this helper rather than indexed
 * directly. A shortened roster then costs a course its named trainer instead of
 * handing it an undefined instructor, which would take out every card that
 * renders a teacher avatar.
 *
 * The catalogue uses INSTRUCTOR_PERSONA and FACULTY[0] to FACULTY[4], and
 * assigns by subject: general studies and the state examinations to the signed
 * in faculty persona, aptitude and banking to one subject faculty, the
 * vocational trades to a skill centre trainer, and the whole entrepreneurship
 * category to the enterprise trainer. A course whose card, live sessions and
 * doubts all name a plausible teacher is the point.
 */
function faculty(index: number): DemoPerson {
  return FACULTY[index] ?? INSTRUCTOR_PERSONA;
}

/** A course as authored: everything except the completion we compute from it. */
type CourseSeed = Omit<DemoCourse, "completion">;

const COURSE_SEEDS: readonly CourseSeed[] = [
  /* ---------------------------------------------------------------- *
   * Section 1, category: State (Telangana), Central & PSU Jobs
   * ---------------------------------------------------------------- */
  {
    id: 301,
    title: "TGPSC Group-I: Prelims, Mains & Interview",
    subtitle: "One prelims paper, six mains papers, one interview board",
    description:
      "Group-I is decided in the mains papers and not in prelims, so this course is built that " +
      "way. You cover the Telangana movement, history, polity, economy, geography and science " +
      "at the depth a 150 mark paper asks for, and you start writing answers in the second " +
      "month rather than the ninth. The interview module works from the detailed application " +
      "form you will actually submit, because that is what the board reads before you sit down.",
    slug: "tgpsc-group-1",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Advanced",
    durationHours: 132,
    tags: ["TGPSC", "Group-I", "Mains Answer Writing", "Telangana Movement", "General Studies"],
    instructor: INSTRUCTOR_PERSONA,
    enrolled: false,
    accent: ["#1b4f8a", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 1240,
    rating: 4.7,
    ratingCount: 312,
    modules: [
      courseModule(
        301001,
        "Reading the notification and planning the year",
        "What the three stages actually test, and how to plan backwards from the mains papers.",
        [
          topic(30101, "Prelims, mains and interview: how the three stages count", ["article", "quiz"], 0),
          topic(30102, "The syllabus as a checklist: six mains papers, paper by paper", ["article"], 0),
          topic(30103, "A twelve month plan with three revision cycles", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        301002,
        "Telangana movement and state formation",
        "The paper that separates a Telangana aspirant from a general studies reader.",
        [
          topic(30104, "Idea of Telangana: 1948 to the Gentlemen's Agreement", ["article", "quiz"], 0),
          topic(30105, "Telangana movement: 1969 agitation to the Mulki rules verdict", ["article", "quiz"], 0),
          topic(30106, "Six Point Formula, GO 610 and the years in between", ["article"], 0),
          topic(30107, "2001 to 2014: renewed agitation, Srikrishna Committee, Reorganisation Act", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        301003,
        "History, culture and heritage",
        "Indian history with the Deccan and Hyderabad State given the weight the paper gives them.",
        [
          topic(30108, "Indus valley to Mauryan and Gupta administration", ["article", "quiz"], 0),
          topic(30109, "Kakatiya and Qutb Shahi Telangana: tanks, temples and towns", ["article", "quiz"], 0),
          topic(30110, "Asaf Jahi rule, the Nizam's administration and 1948", ["article", "quiz"], 0),
          topic(30111, "Modern India: 1857 to the transfer of power", ["article"], 0),
        ],
      ),
      courseModule(
        301004,
        "Polity, governance and public administration",
        "The Constitution as a working document, then the machinery that runs a state.",
        [
          topic(30112, "Constitution: making, preamble and the basic structure doctrine", ["article", "quiz"], 0),
          topic(30113, "Union and state executive, legislature and judiciary", ["article", "quiz"], 0),
          topic(30114, "Federalism, the Finance Commission and centre-state finance", ["article", "quiz"], 0),
          topic(30115, "Panchayati Raj, urban bodies and grievance redress in Telangana", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        301005,
        "Economy and development",
        "National accounts and public finance, then the same ideas applied to the state.",
        [
          topic(30116, "National income, the budget and fiscal policy", ["article", "quiz"], 0),
          topic(30117, "Agriculture, irrigation and the Telangana farm economy", ["article", "quiz"], 0),
          topic(30118, "Human development indicators and state welfare spending", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        301006,
        "Geography, environment and disaster management",
        "Physical geography read through the river basins the state argues about.",
        [
          topic(30119, "Deccan physiography and the Godavari and Krishna basins", ["article", "quiz"], 0),
          topic(30120, "Monsoon, drought and water management in a semi-arid state", ["article", "quiz"], 0),
          topic(30121, "Environmental law, biodiversity and pollution control boards", ["article"], 0),
        ],
      ),
      courseModule(
        301007,
        "Science, technology and current affairs",
        "The applied science the paper sets, plus a repeatable way to build current affairs notes.",
        [
          topic(30122, "Science and technology: national missions and their applications", ["article", "quiz"], 0),
          topic(30123, "Data interpretation for the science and data paper", ["article", "quiz"], 0),
          topic(30124, "Building current affairs notes from one newspaper", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        301008,
        "Answer writing, essay and the interview",
        "Where the marks are lost: structure, time per answer and the personality test.",
        [
          topic(30125, "Structuring a 15 mark answer in eight minutes", ["article", "assignment"], 0),
          topic(30126, "Essay paper: argument, evidence and a closing that lands", ["article", "assignment"], 0),
          topic(30127, "Detailed application form: what the board will ask you about", ["article"], 0),
          topic(30128, "Full length prelims mock under exam conditions", ["quiz", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 302,
    title: "TGPSC Group-II & Group-III Foundation",
    subtitle: "One foundation, two notifications",
    description:
      "Group-II and Group-III share most of their syllabus, so you prepare once and sit for " +
      "both. The course follows the paper structure: general studies and general abilities, " +
      "history and polity and society, economy and development, and the Telangana movement. " +
      "Each module closes with a paper-shaped test rather than a topic quiz, because the marks " +
      "you lose are usually to the paper and not to the topic.",
    slug: "tgpsc-group-2-3",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Intermediate",
    durationHours: 96,
    tags: ["TGPSC", "Group-II", "Group-III", "Telangana Movement", "General Studies"],
    instructor: INSTRUCTOR_PERSONA,
    enrolled: true,
    accent: ["#12365f", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 2140,
    rating: 4.6,
    ratingCount: 486,
    modules: [
      courseModule(
        302001,
        "How Group-II and Group-III are scored",
        "The papers, the marks they carry and the overlap that lets one plan serve both.",
        [
          topic(30201, "Four papers for Group-II, three for Group-III", ["article", "quiz"], 100),
          topic(30202, "Marks, negative marking and the qualifying stages", ["article"], 100),
          topic(30203, "A six month plan that covers both notifications", ["article", "assignment"], 100),
        ],
      ),
      courseModule(
        302002,
        "General studies and general abilities",
        "The first paper, where a wide reader beats a deep one.",
        [
          topic(30204, "Current affairs: state, national and international", ["article", "quiz"], 100),
          topic(30205, "General science and its everyday applications", ["article", "quiz"], 100),
          topic(30206, "Mental ability, data interpretation and basic numeracy", ["article", "quiz"], 100),
          topic(30207, "Disaster management, environment and sustainable development", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        302003,
        "Socio-cultural history of India and Telangana",
        "History as the paper sets it: society and culture ahead of dynastic lists.",
        [
          topic(30208, "Ancient and medieval India, weighted by marks carried", ["article", "quiz"], 100),
          topic(30209, "Satavahana, Kakatiya and Qutb Shahi Telangana", ["article", "quiz"], 100),
          topic(30210, "Social and religious reform movements", ["article", "quiz"], 100),
          topic(30211, "Freedom struggle and the merger of Hyderabad State", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        302004,
        "Indian Constitution and polity",
        "The constitutional provisions this paper returns to every cycle.",
        [
          topic(30212, "Preamble, fundamental rights and directive principles", ["article", "quiz"], 100),
          topic(30213, "Parliament, state legislature and the law making process", ["article", "quiz"], 90),
          topic(30214, "Judiciary, judicial review and public interest litigation", ["article", "quiz"], 75),
          topic(30215, "Constitutional and statutory bodies you are asked about", ["article", "quiz"], 55),
        ],
      ),
      courseModule(
        302005,
        "Society, social issues and public policy",
        "The social structure section, taken with Telangana examples rather than generic ones.",
        [
          topic(30216, "Caste, tribe and gender in the Telangana context", ["article", "quiz"], 45),
          topic(30217, "Welfare policy: education, health and social security", ["article", "quiz"], 25),
          topic(30218, "Poverty, migration and urbanisation", ["article"], 0),
        ],
      ),
      courseModule(
        302006,
        "Indian and Telangana economy",
        "Economic structure first, then the state budget that pays for the schemes you quote.",
        [
          topic(30219, "Growth, planning and the structure of the Indian economy", ["article", "quiz"], 0),
          topic(30220, "Telangana economy: agriculture, industry and services", ["article", "quiz"], 0),
          topic(30221, "State budget, revenue sources and public expenditure", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        302007,
        "Telangana movement and state formation",
        "The dedicated paper, taken in three periods so the sequence stays straight.",
        [
          topic(30222, "1948 to 1970: Mulki rules, Gentlemen's Agreement and 1969", ["article", "quiz"], 0),
          topic(30223, "1971 to 2001: Six Point Formula, GO 610 and political churn", ["article", "quiz"], 0),
          topic(30224, "2001 to 2014: statehood movement and the Reorganisation Act", ["article", "quiz"], 0),
        ],
      ),
    ],
  },
  {
    id: 303,
    title: "SSC CGL & CHSL: Tier-I and Tier-II",
    subtitle: "Tier-I speed, Tier-II depth",
    description:
      "SSC fills posts in ministries, offices and field formations across the country, and the " +
      "paper rewards accuracy at speed above everything else. You build arithmetic, advanced " +
      "maths, reasoning, English and general awareness to the Tier-I standard, then move to the " +
      "longer Tier-II modules including computer knowledge and the data entry speed test. " +
      "Negative marking is treated as a subject of its own, because that is where a good " +
      "candidate usually loses the post.",
    slug: "ssc-cgl-chsl",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Intermediate",
    durationHours: 88,
    tags: ["SSC", "CGL", "CHSL", "Quantitative Aptitude", "Reasoning", "English"],
    instructor: faculty(0),
    enrolled: false,
    accent: ["#1b4f8a", "#3f8f9e"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 1860,
    rating: 4.5,
    ratingCount: 402,
    modules: [
      courseModule(
        303001,
        "The SSC map",
        "Which examination leads to which post, and what each tier is actually testing.",
        [
          topic(30301, "CGL and CHSL: posts, tiers and the selection route", ["article", "quiz"], 0),
          topic(30302, "Tier-I: four sections, sixty minutes, negative marking", ["article"], 0),
          topic(30303, "Choosing post preferences before you start preparing", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        303002,
        "Quantitative aptitude: the arithmetic core",
        "The arithmetic that carries most of the quantitative section in both tiers.",
        [
          topic(30304, "Percentage, profit and loss, discount", ["article", "quiz"], 0),
          topic(30305, "Ratio, proportion, mixture and alligation", ["article", "quiz"], 0),
          topic(30306, "Time and work, time speed and distance", ["article", "quiz"], 0),
          topic(30307, "Simple interest, compound interest and instalments", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303003,
        "Advanced maths for Tier-II",
        "The four areas that decide the mathematical abilities module.",
        [
          topic(30308, "Algebra: the identities SSC reuses every year", ["article", "quiz"], 0),
          topic(30309, "Geometry: triangles, circles and coordinate basics", ["article", "quiz"], 0),
          topic(30310, "Trigonometry, heights and distances", ["article", "quiz"], 0),
          topic(30311, "Mensuration and data interpretation sets", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303004,
        "General intelligence and reasoning",
        "Verbal and non-verbal reasoning, practised to the point of pattern recognition.",
        [
          topic(30312, "Series, analogy and classification", ["article", "quiz"], 0),
          topic(30313, "Coding and decoding, direction sense, blood relations", ["article", "quiz"], 0),
          topic(30314, "Syllogism, statement and conclusion", ["article", "quiz"], 0),
          topic(30315, "Non-verbal: paper folding, mirror images and figure completion", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303005,
        "English comprehension",
        "The English section as SSC sets it, which is grammar and vocabulary before literature.",
        [
          topic(30316, "The grammar errors SSC sets again and again", ["article", "quiz"], 0),
          topic(30317, "Synonyms, antonyms, idioms and one word substitution", ["article", "quiz"], 0),
          topic(30318, "Cloze test and para jumbles", ["article", "quiz"], 0),
          topic(30319, "Reading comprehension inside a four minute limit", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303006,
        "General awareness and static GK",
        "The section that costs the least time per mark if you revise it in passes.",
        [
          topic(30320, "Polity, history and geography as SSC asks them", ["article", "quiz"], 0),
          topic(30321, "General science: physics, chemistry and biology recall", ["article", "quiz"], 0),
          topic(30322, "Current affairs, schemes, sports and awards", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303007,
        "Tier-II specific modules",
        "The parts of Tier-II that candidates discover too late to prepare.",
        [
          topic(30323, "Computer knowledge module: hardware, software and internet", ["article", "quiz"], 0),
          topic(30324, "Data entry speed test: building to the required words per minute", ["article", "assignment"], 0),
          topic(30325, "The statistics paper and who needs to write it", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        303008,
        "Speed, accuracy and exam day",
        "Attempt strategy treated as a skill, with the arithmetic of guessing worked out.",
        [
          topic(30326, "Attempt order: which section first and when to leave a question", ["article"], 0),
          topic(30327, "Negative marking: the guess that is worth making", ["article", "quiz"], 0),
          topic(30328, "Full length Tier-I mock and an error log you keep", ["quiz", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 304,
    title: "RRB NTPC & Group-D: Railway Recruitment",
    subtitle: "One preparation for the computer based test and the ground",
    description:
      "Railway recruitment takes in more candidates than any other public employer reaching " +
      "this state, and the computer based test has the same shape for most posts. You cover " +
      "mathematics, reasoning, general science and general awareness at the level the CBT asks, " +
      "then prepare for the physical efficiency test and the medical standards that decide " +
      "Group-D selection. The course assumes no earlier exam experience and starts from the " +
      "notification itself.",
    slug: "rrb-ntpc-group-d",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Beginner",
    durationHours: 62,
    tags: ["RRB", "NTPC", "Group-D", "General Science", "Physical Efficiency Test"],
    instructor: INSTRUCTOR_PERSONA,
    enrolled: false,
    accent: ["#0b5260", "#0f6b7a"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 2480,
    rating: 4.4,
    ratingCount: 517,
    modules: [
      courseModule(
        304001,
        "The railway recruitment map",
        "How a notification turns into a post, and what each stage removes candidates for.",
        [
          topic(30401, "NTPC, Group-D and the level-wise posts", ["article", "quiz"], 0),
          topic(30402, "CBT stages, document verification and the medical", ["article"], 0),
          topic(30403, "Reading a Railway Recruitment Board notification", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        304002,
        "Mathematics for the CBT",
        "School arithmetic rebuilt for speed, starting from the number system.",
        [
          topic(30404, "Number system, LCM, HCF and simplification", ["article", "quiz"], 0),
          topic(30405, "Percentage, ratio and average", ["article", "quiz"], 0),
          topic(30406, "Time and work, time and distance", ["article", "quiz"], 0),
          topic(30407, "Mensuration, geometry and elementary statistics", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        304003,
        "General intelligence and reasoning",
        "The reasoning types the railway papers repeat across shifts.",
        [
          topic(30408, "Analogy, series and odd one out", ["article", "quiz"], 0),
          topic(30409, "Coding and decoding, mathematical operations", ["article", "quiz"], 0),
          topic(30410, "Venn diagrams, syllogism, statement and conclusion", ["article", "quiz"], 0),
          topic(30411, "Direction sense, ranking and puzzle sets", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        304004,
        "General science",
        "Tenth standard science, taught towards the one-mark questions the CBT sets.",
        [
          topic(30412, "Physics: motion, work, light and electricity", ["article", "quiz"], 0),
          topic(30413, "Chemistry: everyday substances, reactions and uses", ["article", "quiz"], 0),
          topic(30414, "Biology: human body, nutrition and common diseases", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        304005,
        "General awareness and current affairs",
        "Static awareness plus the railway-specific questions candidates skip.",
        [
          topic(30415, "Indian polity, history and geography for the CBT", ["article", "quiz"], 0),
          topic(30416, "Indian Railways: zones, history and organisation", ["article", "quiz"], 0),
          topic(30417, "Current affairs, government schemes and sports", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        304006,
        "Physical efficiency and medical standards",
        "The ground stage, planned over eight weeks instead of the last fortnight.",
        [
          topic(30418, "PET events and the standard for each category", ["article"], 0),
          topic(30419, "Eight week training plan for the running and lifting events", ["article", "assignment"], 0),
          topic(30420, "Medical standards, vision categories and what disqualifies", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        304007,
        "Mocks, normalisation and verification",
        "Why two candidates with the same score are ranked differently, and how to close out.",
        [
          topic(30421, "Normalisation across shifts, explained without the algebra", ["article"], 0),
          topic(30422, "Full length CBT mock with negative marking", ["quiz", "assignment"], 0),
          topic(30423, "Document verification: the certificates to keep ready", ["article"], 0),
        ],
      ),
    ],
  },
  {
    id: 305,
    title: "Telangana Police: Constable & SI (TGLPRB)",
    subtitle: "Written test, physical events and the final written",
    description:
      "Constable and Sub-Inspector selection runs in three stages, and a candidate can be " +
      "strong in the classroom and still fall at the ground. This course prepares arithmetic, " +
      "reasoning and general studies for the written stages, and it builds the running, jumping " +
      "and throwing standards over an eight week plan you can follow at a district ground. " +
      "Telangana specific general studies is a separate module because it is where local " +
      "candidates gain the marks.",
    slug: "telangana-police-constable-si",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Intermediate",
    durationHours: 74,
    tags: ["TGLPRB", "Constable", "Sub-Inspector", "Physical Efficiency Test", "Arithmetic"],
    instructor: INSTRUCTOR_PERSONA,
    enrolled: false,
    accent: ["#334155", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 1975,
    rating: 4.6,
    ratingCount: 388,
    modules: [
      courseModule(
        305001,
        "The selection process",
        "Three stages, two tracks and the eligibility that decides which one you can sit for.",
        [
          topic(30501, "Preliminary written test, measurement, efficiency and final written", ["article", "quiz"], 0),
          topic(30502, "Constable and Sub-Inspector: where the two tracks differ", ["article"], 0),
          topic(30503, "Eligibility, physical measurement and event standards by category", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        305002,
        "Arithmetic",
        "The quantitative half of the written papers, from the number system upwards.",
        [
          topic(30504, "Number system, simplification and averages", ["article", "quiz"], 0),
          topic(30505, "Percentage, profit and loss, interest", ["article", "quiz"], 0),
          topic(30506, "Time and work, speed and distance", ["article", "quiz"], 0),
          topic(30507, "Data interpretation from tables and bar charts", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        305003,
        "Reasoning and mental ability",
        "The reasoning set the police papers favour, including the figure questions.",
        [
          topic(30508, "Series, analogy and classification", ["article", "quiz"], 0),
          topic(30509, "Coding and decoding, direction sense, blood relations", ["article", "quiz"], 0),
          topic(30510, "Seating arrangement and puzzles", ["article", "quiz"], 0),
          topic(30511, "Non-verbal reasoning and figure series", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        305004,
        "General studies and Telangana",
        "General studies taught towards the state questions rather than away from them.",
        [
          topic(30512, "Indian polity and the rights a police officer must know", ["article", "quiz"], 0),
          topic(30513, "History and culture of Telangana", ["article", "quiz"], 0),
          topic(30514, "Geography, districts and administrative divisions of Telangana", ["article", "quiz"], 0),
          topic(30515, "Current affairs, schemes and state initiatives", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        305005,
        "English for the final written",
        "The English paper that the Sub-Inspector track adds.",
        [
          topic(30516, "Grammar and error correction", ["article", "quiz"], 0),
          topic(30517, "Vocabulary and comprehension passages", ["article", "quiz"], 0),
          topic(30518, "Sentence improvement and paragraph completion", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        305006,
        "Physical efficiency",
        "The events, the standards and a training plan that does not injure you in week two.",
        [
          topic(30519, "The events: sprint, long run, long jump and shot put", ["article"], 0),
          topic(30520, "Eight week ground plan with rest and injury prevention", ["article", "assignment"], 0),
          topic(30521, "Diet, hydration and recovery on a trainee budget", ["article"], 0),
        ],
      ),
      courseModule(
        305007,
        "Mocks and the last month",
        "Turning practice papers into a revision list, then closing the file.",
        [
          topic(30522, "Full length preliminary written mock", ["quiz", "assignment"], 0),
          topic(30523, "Turning a mock into a revision list", ["article", "assignment"], 0),
          topic(30524, "Certificate verification and the medical examination", ["article"], 0),
        ],
      ),
    ],
  },
  {
    id: 306,
    title: "PSU Recruitment through GATE",
    subtitle: "A score in one paper, and what a public undertaking does with it",
    description:
      "Public undertakings recruit engineer and management trainees from GATE scores, so a " +
      "shortlist is decided by a number you produce in a single three hour paper. You revise " +
      "engineering mathematics and general aptitude, work your core branch through previous " +
      "papers, and practise the three question types with their different risk. The last module " +
      "covers what candidates prepare least: the group discussion, the technical interview and " +
      "the training bond you sign.",
    slug: "psu-recruitment-gate",
    section: "govt-jobs",
    category: "state-central-psu",
    difficulty: "Advanced",
    durationHours: 68,
    tags: ["GATE", "PSU Recruitment", "Engineering Mathematics", "General Aptitude", "Technical Interview"],
    instructor: faculty(1),
    enrolled: false,
    accent: ["#14406f", "#12365f"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 640,
    rating: 4.5,
    ratingCount: 148,
    modules: [
      courseModule(
        306001,
        "How a public undertaking uses a GATE score",
        "Score against marks, the recruitment calendar and how to read an advertisement.",
        [
          topic(30601, "GATE marks, score and normalisation, explained plainly", ["article", "quiz"], 0),
          topic(30602, "Which undertakings recruit through GATE, and on what cycle", ["article"], 0),
          topic(30603, "Reading an advertisement: posts, pay scale, bond and reservation", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        306002,
        "Engineering mathematics",
        "The common paper section every branch is examined on.",
        [
          topic(30604, "Linear algebra: rank, eigenvalues and systems of equations", ["article", "quiz"], 0),
          topic(30605, "Calculus and ordinary differential equations", ["article", "quiz"], 0),
          topic(30606, "Probability and statistics as GATE sets them", ["article", "quiz"], 0),
          topic(30607, "Numerical methods and complex variables", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        306003,
        "General aptitude",
        "Fifteen marks that cost ten minutes if you have practised them.",
        [
          topic(30608, "Quantitative aptitude in ten minutes of the paper", ["article", "quiz"], 0),
          topic(30609, "Verbal ability and critical reasoning", ["article", "quiz"], 0),
          topic(30610, "Data interpretation and set based logic", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        306004,
        "Core subject strategy by branch",
        "Where the marks sit in each of the four branches most undertakings hire from.",
        [
          topic(30611, "Mechanical: thermodynamics, strength of materials, manufacturing", ["article", "quiz"], 0),
          topic(30612, "Electrical: machines, power systems and control", ["article", "quiz"], 0),
          topic(30613, "Civil: structures, geotechnical and transportation", ["article", "quiz"], 0),
          topic(30614, "Electronics: networks, signals and digital circuits", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        306005,
        "Solving the paper",
        "Three question types with three different penalties, and the tools you are given.",
        [
          topic(30615, "MCQ, MSQ and numerical answer type: three risk profiles", ["article", "quiz"], 0),
          topic(30616, "The virtual calculator and rough work discipline", ["article"], 0),
          topic(30617, "Two hour partial papers and an error log", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        306006,
        "Previous papers and revision",
        "Mining old papers for the ideas that repeat, then compressing them.",
        [
          topic(30618, "Ten years of papers, read for repeated ideas", ["article", "assignment"], 0),
          topic(30619, "A formula sheet you can revise in one hour", ["article"], 0),
          topic(30620, "Full length mock under exam conditions", ["quiz", "assignment"], 0),
        ],
      ),
      courseModule(
        306007,
        "Selection after the score",
        "The stages between a good score and a joining letter.",
        [
          topic(30621, "Application windows, shortlists and past cut-off patterns", ["article"], 0),
          topic(30622, "Group discussion: structure, marks and the quiet candidate", ["article", "assignment"], 0),
          topic(30623, "Technical interview: your project and your core subject", ["article", "assignment"], 0),
          topic(30624, "Documents, medical standards and the training bond", ["article", "quiz"], 0),
        ],
      ),
    ],
  },

  /* ---------------------------------------------------------------- *
   * Section 1, category: Banking & Financial Sector Jobs
   * ---------------------------------------------------------------- */
  {
    id: 307,
    title: "IBPS PO & Clerk: Prelims and Mains",
    subtitle: "Sectional timing, mains depth and the interview",
    description:
      "IBPS runs one recruitment for the public sector banks, and the officer and clerical " +
      "cadres start from the same prelims skills. You build quantitative aptitude, reasoning " +
      "and English to prelims speed, then take on data interpretation, computer aptitude, the " +
      "descriptive paper and banking awareness for mains. Sectional timing is practised from " +
      "the first week, because a section left unfinished cannot be repaired later in the paper.",
    slug: "ibps-po-clerk",
    section: "govt-jobs",
    category: "banking",
    difficulty: "Intermediate",
    durationHours: 84,
    tags: ["IBPS", "Probationary Officer", "Clerk", "Data Interpretation", "Banking Awareness"],
    instructor: faculty(1),
    enrolled: true,
    accent: ["#0B6232", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 2760,
    rating: 4.7,
    ratingCount: 611,
    modules: [
      courseModule(
        307001,
        "The IBPS map",
        "Two cadres, three stages and where the final merit actually comes from.",
        [
          topic(30701, "Prelims, mains and interview: marks and weightage", ["article", "quiz"], 100),
          topic(30702, "Sectional timing in prelims and what it changes", ["article"], 100),
          topic(30703, "A four month plan from prelims to mains", ["article", "assignment"], 100),
        ],
      ),
      courseModule(
        307002,
        "Quantitative aptitude for prelims",
        "Twenty minutes, thirty five questions: calculation speed before technique.",
        [
          topic(30704, "Simplification and approximation at speed", ["article", "quiz"], 100),
          topic(30705, "Number series: missing term and wrong term", ["article", "quiz"], 100),
          topic(30706, "The arithmetic word problems that repeat every cycle", ["article", "quiz"], 100),
          topic(30707, "Quadratic comparison and quantity questions", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        307003,
        "Data interpretation and data analysis",
        "The mains section that decides the officer merit list.",
        [
          topic(30708, "Tables, bar graphs and line graphs", ["article", "quiz"], 100),
          topic(30709, "Caselet and missing data interpretation", ["article", "quiz"], 85),
          topic(30710, "Data sufficiency and mixed sets for mains", ["article", "quiz"], 60),
        ],
      ),
      courseModule(
        307004,
        "Reasoning",
        "Puzzles and arrangement, which is most of the reasoning section by marks.",
        [
          topic(30711, "Puzzles: floors, boxes and scheduling", ["article", "quiz"], 50),
          topic(30712, "Seating arrangement: linear and circular", ["article", "quiz"], 30),
          topic(30713, "Syllogism, inequality and coding decoding", ["article", "quiz"], 0),
          topic(30714, "Input output and logical reasoning for mains", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        307005,
        "English language",
        "Comprehension and grammar taught to the question types the paper uses.",
        [
          topic(30715, "Reading comprehension and its question types", ["article", "quiz"], 0),
          topic(30716, "Error spotting and sentence correction", ["article", "quiz"], 0),
          topic(30717, "Cloze test, fillers and para jumbles", ["article", "quiz"], 0),
          topic(30718, "Vocabulary in context rather than in lists", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        307006,
        "Banking, economy and general awareness",
        "The highest marks per hour of study in the whole examination.",
        [
          topic(30719, "Banking terms, RBI functions and monetary policy", ["article", "quiz"], 0),
          topic(30720, "Financial awareness, schemes and budget headlines", ["article", "quiz"], 0),
          topic(30721, "Six months of current affairs, revised in three passes", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        307007,
        "Computer aptitude and the descriptive paper",
        "Two small sections that are easy to score and easy to ignore.",
        [
          topic(30722, "Computer awareness for the mains section", ["article", "quiz"], 0),
          topic(30723, "Letter writing: formal, informal and the marking scheme", ["article", "assignment"], 0),
          topic(30724, "Essay writing in 200 words under time", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        307008,
        "Mocks and the interview",
        "Full papers under timing, then the board.",
        [
          topic(30725, "Full length prelims mock with sectional timing", ["quiz", "assignment"], 0),
          topic(30726, "Mains mock and attempt analysis", ["quiz", "assignment"], 0),
          topic(30727, "Interview: certificates, current affairs and your own district", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 308,
    title: "SBI PO & SBI Clerk",
    subtitle: "A harder paper, and a selection that does not end at the written",
    description:
      "The State Bank sets its own paper and it runs harder than the common written " +
      "examination, particularly in data analysis and high level reasoning. You work prelims " +
      "and mains at that level, write the descriptive paper to a marking scheme, and prepare " +
      "for the psychometric test, the group exercise and the interview that follow. The " +
      "clerical track adds the local language requirement, which is covered separately.",
    slug: "sbi-po-clerk",
    section: "govt-jobs",
    category: "banking",
    difficulty: "Intermediate",
    durationHours: 78,
    tags: ["SBI", "Probationary Officer", "Junior Associate", "Data Analysis", "Group Exercise"],
    instructor: faculty(1),
    enrolled: false,
    accent: ["#0b5260", "#3f8f9e"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 2310,
    rating: 4.6,
    ratingCount: 524,
    modules: [
      courseModule(
        308001,
        "How SBI recruitment differs",
        "The same syllabus at a different difficulty, plus stages the common examination has not.",
        [
          topic(30801, "Probationary Officer and Junior Associate: stages and marks", ["article", "quiz"], 0),
          topic(30802, "What SBI sets harder, section by section", ["article"], 0),
          topic(30803, "Local language requirement and the documents it needs", ["article"], 0),
        ],
      ),
      courseModule(
        308002,
        "Quantitative aptitude and speed maths",
        "Calculation rebuilt so that a mains data set is arithmetic you already own.",
        [
          topic(30804, "Tables, squares, cubes and percentage fractions by memory", ["article", "quiz"], 0),
          topic(30805, "Simplification, approximation and number series", ["article", "quiz"], 0),
          topic(30806, "Arithmetic: time, work, mixtures and boats", ["article", "quiz"], 0),
          topic(30807, "Permutation, combination and probability", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        308003,
        "Data analysis and interpretation",
        "The SBI mains section that most candidates leave incomplete.",
        [
          topic(30808, "Bar, line, pie and mixed graph sets", ["article", "quiz"], 0),
          topic(30809, "Caselet DI and arithmetic based sets", ["article", "quiz"], 0),
          topic(30810, "Missing data and data sufficiency", ["article", "quiz"], 0),
          topic(30811, "Choosing which set to leave, and when", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        308004,
        "High level reasoning",
        "Reasoning at the difficulty SBI sets, where a wrong assumption costs a whole set.",
        [
          topic(30812, "Complex puzzles: three variable arrangements", ["article", "quiz"], 0),
          topic(30813, "Seating, scheduling and box based puzzles", ["article", "quiz"], 0),
          topic(30814, "Machine input output and logical order", ["article", "quiz"], 0),
          topic(30815, "Critical reasoning: assumption, inference and conclusion", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        308005,
        "English and the descriptive paper",
        "Objective English for prelims, then the letter and essay that carry separate marks.",
        [
          topic(30816, "Reading comprehension and vocabulary in context", ["article", "quiz"], 0),
          topic(30817, "Error spotting, sentence rearrangement and connectors", ["article", "quiz"], 0),
          topic(30818, "Descriptive paper: letter and essay to the marking scheme", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        308006,
        "Banking and financial awareness",
        "Awareness with the financial detail SBI mains expects.",
        [
          topic(30819, "Banking structure, RBI and monetary policy tools", ["article", "quiz"], 0),
          topic(30820, "Financial markets, insurance and mutual funds basics", ["article", "quiz"], 0),
          topic(30821, "Schemes, budget and six months of current affairs", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        308007,
        "Psychometric test, group exercise and interview",
        "The last stage, where a well prepared written candidate can still be dropped.",
        [
          topic(30822, "Psychometric test: what it is for and how to answer honestly", ["article"], 0),
          topic(30823, "Group exercise: contribution, not domination", ["article", "assignment"], 0),
          topic(30824, "Interview: your background, your district and your banking view", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 309,
    title: "RBI Grade-B & NABARD Grade-A",
    subtitle: "Economic and social issues, finance, and rural development",
    description:
      "Grade-B and Grade-A share a phase one paper and a large part of the economics, so a " +
      "single preparation can carry you to both boards. You study economic and social issues, " +
      "finance and management, and the agriculture and rural development material NABARD " +
      "examines, then write the descriptive papers to length. Current affairs is drawn from the " +
      "two institutions' own publications rather than from a coaching digest, because that is " +
      "where the questions come from.",
    slug: "rbi-grade-b-nabard",
    section: "govt-jobs",
    category: "banking",
    difficulty: "Advanced",
    durationHours: 92,
    tags: ["RBI Grade-B", "NABARD", "Economic and Social Issues", "Finance and Management", "Descriptive Paper"],
    instructor: faculty(0),
    enrolled: false,
    accent: ["#12365f", "#14406f"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 720,
    rating: 4.8,
    ratingCount: 196,
    modules: [
      courseModule(
        309001,
        "Two examinations, one preparation",
        "Where the two syllabi overlap, and the parts you cannot share.",
        [
          topic(30901, "Grade-B and Grade-A: phases, papers and marks", ["article", "quiz"], 0),
          topic(30902, "Mapping the shared syllabus and the separate papers", ["article"], 0),
          topic(30903, "A five month plan across both notifications", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        309002,
        "Phase one objective paper",
        "The screening paper: general awareness carries it, the rest must not cost time.",
        [
          topic(30904, "General awareness with an economy and banking bias", ["article", "quiz"], 0),
          topic(30905, "Quantitative aptitude and data interpretation", ["article", "quiz"], 0),
          topic(30906, "Reasoning: puzzles and critical reasoning", ["article", "quiz"], 0),
          topic(30907, "English for the objective paper", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        309003,
        "Economic and social issues",
        "The economics paper, taught from growth and development through to social sectors.",
        [
          topic(30908, "Growth and development: measurement and Indian experience", ["article", "quiz"], 0),
          topic(30909, "Poverty, inequality, employment and social sector spending", ["article", "quiz"], 0),
          topic(30910, "Money, banking, inflation and monetary policy", ["article", "quiz"], 0),
          topic(30911, "External sector, trade policy and globalisation", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        309004,
        "Finance and management",
        "The Grade-B paper that assumes no commerce degree but expects precision.",
        [
          topic(30912, "Financial system, regulators and financial markets", ["article", "quiz"], 0),
          topic(30913, "Risk management, Basel norms and capital adequacy", ["article", "quiz"], 0),
          topic(30914, "Corporate finance basics and derivatives", ["article", "quiz"], 0),
          topic(30915, "Management: motivation, leadership, ethics and communication", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        309005,
        "Agriculture and rural development",
        "The NABARD specific paper, which is where most banking aspirants are weakest.",
        [
          topic(30916, "Indian agriculture: cropping systems, irrigation and inputs", ["article", "quiz"], 0),
          topic(30917, "Agricultural credit, priority sector and refinance", ["article", "quiz"], 0),
          topic(30918, "Rural development programmes and institutions", ["article", "quiz"], 0),
          topic(30919, "Allied sectors: dairy, fisheries and food processing", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        309006,
        "Descriptive English",
        "Writing to length, to structure and to the marking scheme.",
        [
          topic(30920, "Precis: cutting a passage to a third without losing the argument", ["article", "assignment"], 0),
          topic(30921, "Essay on an economic issue, with data you can defend", ["article", "assignment"], 0),
          topic(30922, "Report and business correspondence", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        309007,
        "Reading the source documents",
        "Current affairs taken from the institutions themselves.",
        [
          topic(30923, "Monetary Policy Statement: what to extract and what to skip", ["article", "quiz"], 0),
          topic(30924, "Annual Report and Trend and Progress of Banking in India", ["article", "quiz"], 0),
          topic(30925, "Economic Survey and Budget documents for the papers", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        309008,
        "Mocks and the interview board",
        "Full phases under timing, then a board that asks about your own answers.",
        [
          topic(30926, "Phase one mock and section timing", ["quiz", "assignment"], 0),
          topic(30927, "Phase two mock: three papers in sequence", ["quiz", "assignment"], 0),
          topic(30928, "Interview: your subject, your work and the economy this quarter", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 310,
    title: "Banking Awareness, Economy & Current Affairs",
    subtitle: "The awareness paper, treated as a subject",
    description:
      "Banking awareness returns more marks per hour of study than any other section, and it is " +
      "the section most candidates read casually. You start from what a bank actually does, " +
      "move through the regulators, the products and the schemes, and finish with a method for " +
      "reading a newspaper that produces revision notes instead of highlighted paper. It suits " +
      "a first attempt at any banking examination.",
    slug: "banking-awareness-economy",
    section: "govt-jobs",
    category: "banking",
    difficulty: "Beginner",
    durationHours: 40,
    tags: ["Banking Awareness", "Indian Economy", "Current Affairs", "RBI", "Financial Inclusion"],
    instructor: faculty(0),
    enrolled: false,
    accent: ["#b7791f", "#b32020"],
    dueInDays: null,
    certificateThreshold: 70,
    enrolledCount: 3120,
    rating: 4.5,
    ratingCount: 705,
    modules: [
      courseModule(
        310001,
        "Money, banking and the RBI",
        "What a bank does with a deposit, and who supervises it.",
        [
          topic(31001, "Money, deposits and how credit is created", ["article", "quiz"], 0),
          topic(31002, "The Reserve Bank: functions and instruments", ["article", "quiz"], 0),
          topic(31003, "Repo, reverse repo, CRR and SLR in plain terms", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        310002,
        "Banking products and the customer",
        "The counter view: accounts, loans and the rules that protect a customer.",
        [
          topic(31004, "Deposit and loan products, and who each one is for", ["article", "quiz"], 0),
          topic(31005, "KYC, nomination, lockers and the banking ombudsman", ["article", "quiz"], 0),
          topic(31006, "NPA, provisioning and recovery, without the jargon", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        310003,
        "Financial markets and regulators",
        "Who regulates what, which is a question set in every paper.",
        [
          topic(31007, "Money market and capital market instruments", ["article", "quiz"], 0),
          topic(31008, "SEBI, IRDAI, PFRDA and their jurisdictions", ["article", "quiz"], 0),
          topic(31009, "Payment systems: NEFT, RTGS, IMPS and UPI", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        310004,
        "Indian economy basics",
        "The macro vocabulary the awareness section assumes you already have.",
        [
          topic(31010, "GDP, inflation indices and the fiscal deficit", ["article", "quiz"], 0),
          topic(31011, "Budget, taxation and the GST structure", ["article", "quiz"], 0),
          topic(31012, "Balance of payments, foreign exchange reserves and the rupee", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        310005,
        "Schemes and financial inclusion",
        "The scheme questions, grouped so you remember them as a family.",
        [
          topic(31013, "Jan Dhan, Mudra, Stand-Up India and the inclusion push", ["article", "quiz"], 0),
          topic(31014, "Insurance and pension schemes: PMJJBY, PMSBY, APY", ["article", "quiz"], 0),
          topic(31015, "Priority sector lending and regional rural banks", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        310006,
        "Reading current affairs for a banking paper",
        "A method that produces notes you will actually revise.",
        [
          topic(31016, "One newspaper, twenty minutes, five notes", ["article", "assignment"], 0),
          topic(31017, "Monthly compilation and three pass revision", ["article", "assignment"], 0),
          topic(31018, "Awareness mock: fifty questions in fifteen minutes", ["quiz"], 0),
        ],
      ),
    ],
  },

  /* ---------------------------------------------------------------- *
   * Section 2, category: Rural Employment Generation (vocational)
   * ---------------------------------------------------------------- */
  {
    id: 311,
    title: "Solar PV Installer & Rooftop Technician",
    subtitle: "Survey, size, install and commission a rooftop plant",
    description:
      "Rooftop solar work is paid by the installation, and an installer who can size a string, " +
      "mount a structure safely and close a net metering file is hired in any district. You " +
      "work from the site survey through to commissioning, with the electrical detail a " +
      "technician is actually held to on site. Safety at height and correct earthing are taught " +
      "as trade skills rather than as a briefing at the start of the day.",
    slug: "solar-pv-installer",
    section: "skills-entrepreneurship",
    category: "rural-employment-vocational",
    difficulty: "Beginner",
    durationHours: 46,
    tags: ["Solar PV", "Rooftop", "Net Metering", "Electrical Safety", "Installation"],
    instructor: faculty(2),
    enrolled: true,
    accent: ["#b7791f", "#b45309"],
    dueInDays: null,
    certificateThreshold: 60,
    enrolledCount: 860,
    rating: 4.7,
    ratingCount: 214,
    modules: [
      courseModule(
        311001,
        "Solar basics and the site survey",
        "How a rooftop plant makes and delivers power, and what to measure before quoting.",
        [
          topic(31101, "How a rooftop system makes power and where it goes", ["article", "quiz"], 100),
          topic(31102, "Site survey: roof area, orientation and shading", ["article", "assignment"], 100),
          topic(31103, "Reading an electricity bill to size a system", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        311002,
        "Modules, inverters and balance of system",
        "Every component you will unbox, and what its nameplate is telling you.",
        [
          topic(31104, "PV module construction, ratings and the nameplate", ["article", "quiz"], 100),
          topic(31105, "String inverters, microinverters and hybrid inverters", ["article", "quiz"], 100),
          topic(31106, "Rails, cables, connectors and the combiner box", ["article", "quiz"], 100),
          topic(31107, "Batteries, and when a rural site actually needs them", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        311003,
        "Sizing and stringing the array",
        "The calculations that decide whether the plant runs or trips.",
        [
          topic(31108, "String sizing against the inverter MPPT window", ["article", "quiz"], 100),
          topic(31109, "Temperature correction of open circuit voltage", ["article", "quiz"], 100),
          topic(31110, "DC to AC ratio and inverter loading", ["article", "quiz"], 100),
          topic(31111, "Drawing the single line diagram for a 5 kW plant", ["article", "assignment"], 100),
        ],
      ),
      courseModule(
        311004,
        "Structure and mechanical installation",
        "Mounting that survives a storm, and working at height without an incident.",
        [
          topic(31112, "Roof types, ballasted mounts and penetrating mounts", ["article", "quiz"], 100),
          topic(31113, "Structure loading, wind speed and tilt angle", ["article", "quiz"], 100),
          topic(31114, "Working at height: harness, ladder and roof discipline", ["article", "quiz"], 100),
        ],
      ),
      courseModule(
        311005,
        "Wiring, protection and earthing",
        "The DC and AC sides done to code, including the part inspectors check first.",
        [
          topic(31115, "DC side: string fuses, surge protection and isolators", ["article", "quiz"], 100),
          topic(31116, "AC side: MCB, RCCB and the connection to the meter", ["article", "quiz"], 100),
          topic(31117, "Earthing and lightning protection for a rooftop array", ["article", "quiz"], 80),
        ],
      ),
      courseModule(
        311006,
        "Commissioning, net metering and maintenance",
        "Handing over a plant with test results, paperwork and a service plan.",
        [
          topic(31118, "Commissioning tests: polarity, insulation resistance and output", ["article", "assignment"], 0),
          topic(31119, "Net metering application and the DISCOM inspection", ["article", "quiz"], 0),
          topic(31120, "Cleaning, hot spots and a maintenance log the owner keeps", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 312,
    title: "Electrician & Domestic Wiring (ITI-aligned)",
    subtitle: "House wiring, protection, motors and the trade test",
    description:
      "The course follows the ITI electrician trade practicals that a wireman licence and most " +
      "site jobs are built on. You wire light points, two way circuits, socket lines and a " +
      "distribution board, earth them correctly, and find faults with a multimeter rather than " +
      "by guesswork. The last module costs a small job end to end, so you can quote work and " +
      "not only carry it out.",
    slug: "electrician-domestic-wiring",
    section: "skills-entrepreneurship",
    category: "rural-employment-vocational",
    difficulty: "Beginner",
    durationHours: 52,
    tags: ["Electrician", "ITI", "Domestic Wiring", "Earthing", "Motor Control"],
    instructor: faculty(2),
    enrolled: false,
    accent: ["#eab308", "#b45309"],
    dueInDays: null,
    certificateThreshold: 60,
    enrolledCount: 1180,
    rating: 4.6,
    ratingCount: 268,
    modules: [
      courseModule(
        312001,
        "Electrical fundamentals",
        "The quantities you will measure, explained on the bench rather than on paper.",
        [
          topic(31201, "Voltage, current, resistance and Ohm's law on the bench", ["article", "quiz"], 0),
          topic(31202, "AC supply, frequency, single phase and three phase", ["article", "quiz"], 0),
          topic(31203, "Power, energy and reading a household meter", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        312002,
        "Tools, materials and safety",
        "What goes in the bag, and the habits that keep you working.",
        [
          topic(31204, "Hand tools, test lamp and multimeter", ["article", "quiz"], 0),
          topic(31205, "Wire sizes, insulation and current carrying capacity", ["article", "quiz"], 0),
          topic(31206, "Isolation, lockout and first aid for electric shock", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        312003,
        "Domestic wiring practice",
        "The circuits a house is made of, wired one at a time.",
        [
          topic(31207, "Conduit, casing capping and concealed wiring", ["article", "assignment"], 0),
          topic(31208, "Wiring a light point with a one way switch", ["article", "assignment"], 0),
          topic(31209, "Two way and staircase wiring", ["article", "assignment"], 0),
          topic(31210, "Socket circuits, ceiling fan and regulator", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        312004,
        "Protection and earthing",
        "The parts that decide whether a fault trips a breaker or kills someone.",
        [
          topic(31211, "MCB, RCCB and laying out a distribution board", ["article", "quiz"], 0),
          topic(31212, "Earthing methods: pipe, plate and maintaining the earth pit", ["article", "quiz"], 0),
          topic(31213, "Fault finding: open circuit, short circuit and leakage", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        312005,
        "Motors and household equipment",
        "The repair work that pays between wiring jobs.",
        [
          topic(31214, "Single phase induction motor: starting and running", ["article", "quiz"], 0),
          topic(31215, "Starters, overload relays and motor protection", ["article", "quiz"], 0),
          topic(31216, "Repairing a ceiling fan, mixer and iron", ["article", "assignment"], 0),
          topic(31217, "Water pump control: float switch and starter panel", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        312006,
        "Estimation, records and the trade test",
        "Turning trade skill into a quotation and a licence.",
        [
          topic(31218, "Estimating material for a two bedroom house", ["article", "assignment"], 0),
          topic(31219, "Wiring a small shop: load list and bill of quantities", ["article", "assignment"], 0),
          topic(31220, "Trade test practice and the wireman licence application", ["article", "quiz"], 0),
        ],
      ),
    ],
  },
  {
    id: 313,
    title: "Tailoring, Garment Making & Boutique Skills",
    subtitle: "From the machine to a paying order book",
    description:
      "Stitching skill earns nothing on its own, so this course pairs the trade with " +
      "measurement, finishing and costing. You learn the machine, take measurements that fit, " +
      "and make the garments a district actually orders, from a school uniform to a blouse. The " +
      "final module covers job work for a garment unit and running a boutique from home, " +
      "including what to charge.",
    slug: "tailoring-garment-making",
    section: "skills-entrepreneurship",
    category: "rural-employment-vocational",
    difficulty: "Beginner",
    durationHours: 42,
    tags: ["Tailoring", "Garment Making", "Pattern Drafting", "Costing", "Boutique"],
    instructor: faculty(2),
    enrolled: false,
    accent: ["#0f6b7a", "#b32020"],
    dueInDays: null,
    certificateThreshold: 60,
    enrolledCount: 1420,
    rating: 4.7,
    ratingCount: 331,
    modules: [
      courseModule(
        313001,
        "Machines, tools and the workspace",
        "The machine as equipment you maintain, not a box you sit at.",
        [
          topic(31301, "Machine parts, threading and tension setting", ["article", "quiz"], 0),
          topic(31302, "Maintenance and the common stitching faults", ["article", "quiz"], 0),
          topic(31303, "Cutting table, tools and laying out the workspace", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        313002,
        "Fabric and measurement",
        "Why a garment fits: fabric behaviour and measurements taken correctly.",
        [
          topic(31304, "Fabric types, grain, shrinkage and pre-washing", ["article", "quiz"], 0),
          topic(31305, "Taking body measurements accurately", ["article", "assignment"], 0),
          topic(31306, "Reading and drafting a basic block", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        313003,
        "Basic stitching skills",
        "The stitches and closures every garment in the next module is built from.",
        [
          topic(31307, "Seams, seam finishes and hems", ["article", "assignment"], 0),
          topic(31308, "Darts, pleats and gathers", ["article", "assignment"], 0),
          topic(31309, "Zips, plackets and buttonholes", ["article", "assignment"], 0),
          topic(31310, "Necklines, collars and sleeve attachment", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        313004,
        "Making garments",
        "Four garments that make up most of the local order book.",
        [
          topic(31311, "Petticoat and blouse: drafting to finishing", ["article", "assignment"], 0),
          topic(31312, "Salwar kameez: cutting and assembly", ["article", "assignment"], 0),
          topic(31313, "Children's frock and school uniform", ["article", "assignment"], 0),
          topic(31314, "Kurta and a simple men's shirt", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        313005,
        "Finishing, quality and costing",
        "The difference between a stitched garment and one a customer returns for.",
        [
          topic(31315, "Pressing, finishing and a quality check list", ["article", "quiz"], 0),
          topic(31316, "Costing a garment: fabric, trims, labour and margin", ["article", "assignment"], 0),
          topic(31317, "Alteration work and the repeat customer", ["article"], 0),
        ],
      ),
      courseModule(
        313006,
        "Running a boutique or job-work unit",
        "Two ways to earn from the trade, and what each one demands of you.",
        [
          topic(31318, "Setting up at home: machines, space and working capital", ["article", "assignment"], 0),
          topic(31319, "Job work for a garment unit against your own customers", ["article", "quiz"], 0),
          topic(31320, "Photographing and pricing your work for local orders", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 314,
    title: "Mobile Phone & Consumer Electronics Repair",
    subtitle: "Handset faults, board level work and a repair counter",
    description:
      "A repair counter earns from the jobs other shops send away, and those jobs are at board " +
      "level. You start with components and measurement, work through display, charging and " +
      "water damage repairs, then move to tracing a schematic and hunting a short circuit. The " +
      "course also covers when a board is not worth repairing, which is the judgement that " +
      "protects your margin.",
    slug: "mobile-electronics-repair",
    section: "skills-entrepreneurship",
    category: "rural-employment-vocational",
    difficulty: "Beginner",
    durationHours: 44,
    tags: ["Mobile Repair", "Soldering", "Board Level Repair", "Diagnostics", "Service Counter"],
    instructor: faculty(2),
    enrolled: false,
    accent: ["#0f6b7a", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 60,
    enrolledCount: 990,
    rating: 4.5,
    ratingCount: 207,
    modules: [
      courseModule(
        314001,
        "Electronics fundamentals for repair",
        "Only the electronics you need to measure and replace with confidence.",
        [
          topic(31401, "Components you will meet: resistor, capacitor, diode, IC", ["article", "quiz"], 0),
          topic(31402, "Using a multimeter and a bench power supply", ["article", "assignment"], 0),
          topic(31403, "The block diagram of a smartphone", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        314002,
        "Tools and the workbench",
        "Setting up a bench that does not damage the device you were paid to fix.",
        [
          topic(31404, "Soldering iron, hot air station and flux", ["article", "assignment"], 0),
          topic(31405, "Anti-static handling and screen-safe disassembly", ["article", "quiz"], 0),
          topic(31406, "Opening a handset without breaking clips or ribbon cables", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        314003,
        "Common hardware faults",
        "The four jobs that pay the rent at a counter.",
        [
          topic(31407, "Display and touch panel replacement", ["article", "assignment"], 0),
          topic(31408, "Charging port, battery and power faults", ["article", "assignment"], 0),
          topic(31409, "Speaker, microphone and camera modules", ["article", "assignment"], 0),
          topic(31410, "Water damaged handsets: cleaning and salvage", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        314004,
        "Board level work",
        "Where the margin is, and where the guesswork has to stop.",
        [
          topic(31411, "Reading a schematic and following the power rail", ["article", "quiz"], 0),
          topic(31412, "Hunting a short circuit with a bench supply", ["article", "assignment"], 0),
          topic(31413, "Reflow and reballing: when it is worth attempting", ["article", "quiz"], 0),
          topic(31414, "Deciding a board is not economic to repair", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        314005,
        "Software, data and the customer",
        "Half the jobs at a counter are not hardware at all.",
        [
          topic(31415, "Firmware flashing, backup and factory reset", ["article", "assignment"], 0),
          topic(31416, "Customer data, privacy and taking consent", ["article", "quiz"], 0),
          topic(31417, "Diagnosing software faults before opening the phone", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        314006,
        "Running a repair counter",
        "Parts, quotations and the second trade that fills a slow week.",
        [
          topic(31418, "Spare parts sourcing and the quality grades", ["article", "quiz"], 0),
          topic(31419, "Quoting a job, warranty claims and the job card", ["article", "assignment"], 0),
          topic(31420, "Extending to television, mixer and small appliance repair", ["article"], 0),
        ],
      ),
    ],
  },
  {
    id: 315,
    title: "Digital Literacy & Common Service Centre Operator",
    subtitle: "Computer basics to running a service counter",
    description:
      "A Common Service Centre operator handles a citizen's documents, money and identity " +
      "inside the same ten minutes, and each of those needs a different kind of care. You build " +
      "computer and internet skills, learn the forms and portals a centre files every day, " +
      "handle digital payments and daily cash reconciliation, and learn the fraud patterns that " +
      "target rural users. It assumes you have never used a computer.",
    slug: "digital-literacy-csc-operator",
    section: "skills-entrepreneurship",
    category: "rural-employment-vocational",
    difficulty: "Beginner",
    durationHours: 36,
    tags: ["Digital Literacy", "Common Service Centre", "UPI", "AePS", "Citizen Services"],
    instructor: faculty(4),
    enrolled: false,
    accent: ["#4a7fbb", "#4a7fbb"],
    dueInDays: null,
    certificateThreshold: 60,
    enrolledCount: 1650,
    rating: 4.4,
    ratingCount: 289,
    modules: [
      courseModule(
        315001,
        "Computer and internet basics",
        "Starting from the power button, without assuming any earlier use.",
        [
          topic(31501, "Parts of a computer, the operating system and files", ["article", "quiz"], 0),
          topic(31502, "Typing, keyboard shortcuts and organising folders", ["article", "assignment"], 0),
          topic(31503, "Internet, browser and searching for the right page", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        315002,
        "Documents and records",
        "The three tools a counter uses all day.",
        [
          topic(31504, "Word processing for applications and letters", ["article", "assignment"], 0),
          topic(31505, "Spreadsheets for a daily register", ["article", "assignment"], 0),
          topic(31506, "Scanning, PDF and printing at a service counter", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        315003,
        "Digital identity and citizen services",
        "The services citizens come to a centre for, and the documents each one needs.",
        [
          topic(31507, "Aadhaar, PAN and the documents a citizen brings", ["article", "quiz"], 0),
          topic(31508, "Filling an online application form without a rejection", ["article", "assignment"], 0),
          topic(31509, "Certificates, pensions and grievance portals", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        315004,
        "Digital payments",
        "Money handled through a machine, and the record that proves it.",
        [
          topic(31510, "UPI, wallets and QR codes", ["article", "quiz"], 0),
          topic(31511, "AePS and micro-ATM cash withdrawal", ["article", "quiz"], 0),
          topic(31512, "Reconciling a day of transactions against cash in hand", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        315005,
        "Safety and trust",
        "The operator is the last line between a villager and a fraud.",
        [
          topic(31513, "Passwords, OTP fraud and phishing calls", ["article", "quiz"], 0),
          topic(31514, "Handling citizen data responsibly", ["article", "quiz"], 0),
          topic(31515, "Backups, power cuts and what to do when a portal fails", ["article"], 0),
        ],
      ),
      courseModule(
        315006,
        "Running a Common Service Centre",
        "The centre as a small business with a queue outside it.",
        [
          topic(31516, "Services, commissions and daily cash management", ["article", "assignment"], 0),
          topic(31517, "Queue, records and giving a receipt every time", ["article", "quiz"], 0),
          topic(31518, "Telling the village what the centre can do", ["article", "assignment"], 0),
        ],
      ),
    ],
  },

  /* ---------------------------------------------------------------- *
   * Section 2, category: Rural Entrepreneurship & Development
   * ---------------------------------------------------------------- */
  {
    id: 316,
    title: "Start Your Rural Micro-Enterprise",
    subtitle: "From an idea in your mandal to a unit that pays for itself",
    description:
      "Most rural enterprises fail on working capital and on pricing rather than on the idea. " +
      "This course makes you test demand before you spend, cost one unit of your product, and " +
      "keep books a bank will accept. You finish with a one page plan, a break-even number and " +
      "a first month of records that you wrote yourself.",
    slug: "rural-micro-enterprise",
    section: "skills-entrepreneurship",
    category: "rural-entrepreneurship",
    difficulty: "Beginner",
    durationHours: 38,
    tags: ["Micro-Enterprise", "Business Plan", "Break-even", "Udyam", "Bookkeeping"],
    instructor: faculty(3),
    enrolled: true,
    accent: ["#0e7a3c", "#84cc16"],
    dueInDays: null,
    certificateThreshold: 65,
    enrolledCount: 1340,
    rating: 4.6,
    ratingCount: 245,
    modules: [
      courseModule(
        316001,
        "Finding a business worth starting",
        "Demand in your own mandal, checked before any money is spent.",
        [
          topic(31601, "Spotting a demand where you already live", ["article", "quiz"], 100),
          topic(31602, "Ten enterprises that work in a village economy", ["article", "quiz"], 100),
          topic(31603, "Talking to twenty possible customers first", ["article", "assignment"], 55),
          topic(31604, "Choosing between service, trading and manufacturing", ["article", "quiz"], 20),
        ],
      ),
      courseModule(
        316002,
        "Testing the idea on paper",
        "The three numbers that decide whether the idea survives contact with cost.",
        [
          topic(31605, "Costing one unit of your product or service", ["article", "assignment"], 25),
          topic(31606, "Break-even: how many units pay your fixed costs", ["article", "quiz"], 0),
          topic(31607, "A one page plan you can show a banker", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        316003,
        "Registration and compliance",
        "The registrations a small unit actually needs, and the ones it does not.",
        [
          topic(31608, "Udyam registration, shop licence and the GST threshold", ["article", "quiz"], 0),
          topic(31609, "Proprietorship, partnership and joining a producer body", ["article", "quiz"], 0),
          topic(31610, "Food, weights and pollution rules for small units", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        316004,
        "Money and records",
        "Keeping books simple enough that you will keep them.",
        [
          topic(31611, "Separating business money from household money", ["article", "quiz"], 0),
          topic(31612, "Cash book, stock register and bill book", ["article", "assignment"], 0),
          topic(31613, "Working capital: the cash gap nobody plans for", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        316005,
        "Customers and selling",
        "Price, place and the credit sales that quietly sink small units.",
        [
          topic(31614, "Pricing that survives a competitor down the road", ["article", "quiz"], 0),
          topic(31615, "Selling locally: haat, WhatsApp and shop tie-ups", ["article", "assignment"], 0),
          topic(31616, "Quality, packaging and the repeat purchase", ["article", "quiz"], 0),
          topic(31617, "Handling credit sales without sinking the business", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        316006,
        "Growing and surviving",
        "The decisions of the second year: people, risk and reinvestment.",
        [
          topic(31618, "Hiring your first helper and paying them properly", ["article", "quiz"], 0),
          topic(31619, "Risk: weather, breakdown and what insurance covers", ["article", "quiz"], 0),
          topic(31620, "Reinvesting profit and the second machine decision", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 317,
    title: "Access to Finance: MUDRA, SHG Linkage & Subsidies",
    subtitle: "Getting credit, and getting the second loan",
    description:
      "Credit is available to a rural enterprise and most applications still fail on the " +
      "paperwork and on the repayment record behind it. You learn how a self help group grades " +
      "itself for bank linkage, which MUDRA category fits your unit, and what a branch manager " +
      "reads first in a project report. The course also covers rejection: why it happens, and " +
      "what makes the second application succeed.",
    slug: "access-to-finance-mudra-shg",
    section: "skills-entrepreneurship",
    category: "rural-entrepreneurship",
    difficulty: "Intermediate",
    durationHours: 34,
    tags: ["MUDRA", "SHG Bank Linkage", "PMEGP", "Project Report", "CGTMSE"],
    instructor: faculty(3),
    enrolled: false,
    accent: ["#0b6232", "#1b4f8a"],
    dueInDays: null,
    certificateThreshold: 65,
    enrolledCount: 1080,
    rating: 4.5,
    ratingCount: 226,
    modules: [
      courseModule(
        317001,
        "The rural credit map",
        "Who lends in a village, on what terms, and what makes you bankable.",
        [
          topic(31701, "Bank, SHG, microfinance and the moneylender compared", ["article", "quiz"], 0),
          topic(31702, "Priority sector lending, and why it matters to you", ["article", "quiz"], 0),
          topic(31703, "Credit history, credit score and being bankable", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        317002,
        "Self help group and joint liability linkage",
        "The route most rural women's enterprises are financed through.",
        [
          topic(31704, "How a group forms, saves and grades itself", ["article", "quiz"], 0),
          topic(31705, "Bank linkage: cash credit limit and repayment discipline", ["article", "quiz"], 0),
          topic(31706, "Joint liability groups for tenant farmers", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        317003,
        "MUDRA and enterprise loans",
        "Matching the loan product to what the money is actually for.",
        [
          topic(31707, "Shishu, Kishore and Tarun: which one fits your unit", ["article", "quiz"], 0),
          topic(31708, "The documents a branch will ask for", ["article", "assignment"], 0),
          topic(31709, "Term loan against working capital: matching loan to need", ["article", "quiz"], 0),
          topic(31710, "Reading a sanction letter and a repayment schedule", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        317004,
        "Subsidy-linked schemes",
        "The schemes worth applying to, and what each one expects in return.",
        [
          topic(31711, "PMEGP: margin money, own contribution and the project report", ["article", "quiz"], 0),
          topic(31712, "PMFME for a food processing unit", ["article", "quiz"], 0),
          topic(31713, "Stand-Up India and the dedicated entrepreneur windows", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        317005,
        "Making the application succeed",
        "Writing the file the way the person appraising it reads it.",
        [
          topic(31714, "A project report a branch manager can approve", ["article", "assignment"], 0),
          topic(31715, "Collateral, guarantee cover and loans without security", ["article", "quiz"], 0),
          topic(31716, "When an application is rejected, and what to change", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        317006,
        "Repayment and what follows",
        "The record that decides the size of your next loan.",
        [
          topic(31717, "Repayment behaviour and the second loan", ["article", "quiz"], 0),
          topic(31718, "Insurance and pension cover for a small borrower", ["article", "quiz"], 0),
          topic(31719, "Digital records that shorten the next appraisal", ["article", "assignment"], 0),
        ],
      ),
    ],
  },
  {
    id: 318,
    title: "Farmer Producer Organisations: Formation & Management",
    subtitle: "Forming a producer company and running it as a business",
    description:
      "An FPO is a company owned by farmers, and it fails when it is run as a scheme instead of " +
      "as a business. You cover mobilisation, registration, governance and the business plan, " +
      "then the operating detail: procurement, grading, storage, input licences and market " +
      "linkage. The last module is the compliance and the monthly reporting that a board needs " +
      "in front of it to make a decision.",
    slug: "fpo-formation-management",
    section: "skills-entrepreneurship",
    category: "rural-entrepreneurship",
    difficulty: "Intermediate",
    durationHours: 40,
    tags: ["FPO", "Producer Company", "Aggregation", "eNAM", "Governance"],
    instructor: faculty(3),
    enrolled: false,
    accent: ["#65a30d", "#0e7a3c"],
    dueInDays: null,
    certificateThreshold: 65,
    enrolledCount: 610,
    rating: 4.6,
    ratingCount: 132,
    modules: [
      courseModule(
        318001,
        "Why an FPO",
        "The small holder problem, and the three legal forms that answer it.",
        [
          topic(31801, "The problem a producer organisation is meant to solve", ["article", "quiz"], 0),
          topic(31802, "Cooperative, society and producer company compared", ["article", "quiz"], 0),
          topic(31803, "One FPO that worked and one that did not", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        318002,
        "Mobilisation and formation",
        "From farmer interest groups to a registered company with members.",
        [
          topic(31804, "Farmer interest groups and the baseline survey", ["article", "assignment"], 0),
          topic(31805, "Registering a producer company and its documents", ["article", "quiz"], 0),
          topic(31806, "Share capital, membership and the first board", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        318003,
        "Governance",
        "Who decides what, recorded in a way that stands up to an audit.",
        [
          topic(31807, "Board, chief executive and the annual general meeting", ["article", "quiz"], 0),
          topic(31808, "Bylaws, resolutions and statutory records", ["article", "quiz"], 0),
          topic(31809, "Conflict of interest and keeping member trust", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        318004,
        "Business planning",
        "Choosing a business line and finding the working capital it needs.",
        [
          topic(31810, "Input supply, aggregation or processing: choosing one", ["article", "quiz"], 0),
          topic(31811, "Business plan and the working capital cycle", ["article", "assignment"], 0),
          topic(31812, "Equity grant, credit guarantee and matching support", ["article", "quiz"], 0),
          topic(31813, "Costing an aggregation centre", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        318005,
        "Operations",
        "The day to day work at the collection centre, where margins are made or lost.",
        [
          topic(31814, "Licences for seed, fertiliser and pesticide sale", ["article", "quiz"], 0),
          topic(31815, "Procurement, grading and weighment at the centre", ["article", "assignment"], 0),
          topic(31816, "Storage, moisture and post-harvest losses", ["article", "quiz"], 0),
          topic(31817, "Running a custom hiring centre for machinery", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        318006,
        "Markets",
        "Getting a better price than the member would get alone.",
        [
          topic(31818, "Mandi, eNAM and direct buyer contracts", ["article", "quiz"], 0),
          topic(31819, "Contract terms, quality parameters and payment cycles", ["article", "quiz"], 0),
          topic(31820, "Value addition: cleaning, grading and packaging", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        318007,
        "Compliance and accounts",
        "What the registrar, the auditor and the members each need to see.",
        [
          topic(31821, "Audit, annual filings and GST for an FPO", ["article", "quiz"], 0),
          topic(31822, "Five numbers the board should see every month", ["article", "assignment"], 0),
          topic(31823, "Dividend, patronage bonus and reserves", ["article", "quiz"], 0),
        ],
      ),
    ],
  },
  {
    id: 319,
    title: "Digital Marketing & ONDC for Rural Businesses",
    subtitle: "Being found, listed and paid online",
    description:
      "A rural unit does not need an advertising budget, it needs to be findable and easy to " +
      "buy from. You set up a business profile, photograph and describe products properly, sell " +
      "through WhatsApp and through an ONDC seller application, and handle payments, packing " +
      "and returns. The last module gives you a weekly routine that a one person shop can " +
      "actually keep to.",
    slug: "digital-marketing-ondc",
    section: "skills-entrepreneurship",
    category: "rural-entrepreneurship",
    difficulty: "Beginner",
    durationHours: 36,
    tags: ["Digital Marketing", "ONDC", "WhatsApp Business", "UPI", "Online Selling"],
    instructor: faculty(3),
    enrolled: false,
    accent: ["#1b4f8a", "#0f6b7a"],
    dueInDays: null,
    certificateThreshold: 65,
    enrolledCount: 1490,
    rating: 4.5,
    ratingCount: 278,
    modules: [
      courseModule(
        319001,
        "Getting your business found",
        "The free listing and the photographs that decide whether anyone calls.",
        [
          topic(31901, "A business profile for a village shop", ["article", "assignment"], 0),
          topic(31902, "Photographs that make a product look sellable", ["article", "assignment"], 0),
          topic(31903, "A product description that answers the buyer's questions", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        319002,
        "WhatsApp and social selling",
        "The channel your customers are already on, used without becoming spam.",
        [
          topic(31904, "WhatsApp Business: catalogue, labels and quick replies", ["article", "assignment"], 0),
          topic(31905, "Broadcast lists and groups, and where the line is", ["article", "quiz"], 0),
          topic(31906, "Instagram and Facebook for a small unit", ["article", "quiz"], 0),
          topic(31907, "Short video: one product in thirty seconds", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        319003,
        "Selling online",
        "Three routes to a buyer, and what an open network changes.",
        [
          topic(31908, "Marketplace, own store and ONDC compared", ["article", "quiz"], 0),
          topic(31909, "What ONDC is: buyer app, seller app and the network", ["article", "quiz"], 0),
          topic(31910, "Listing on a seller app: catalogue, price and stock", ["article", "assignment"], 0),
          topic(31911, "Order to delivery: packing, logistics and returns", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        319004,
        "Payments and money",
        "Getting paid, and pricing so that the margin survives the commission.",
        [
          topic(31912, "UPI collection, payment links and settlement time", ["article", "quiz"], 0),
          topic(31913, "Pricing for online: margin, commission and delivery", ["article", "assignment"], 0),
          topic(31914, "GST, invoices and the basics of an e-way bill", ["article", "quiz"], 0),
        ],
      ),
      courseModule(
        319005,
        "Getting the first hundred orders",
        "Local demand first, because that is where the repeat buyer lives.",
        [
          topic(31915, "Local search, hyperlocal delivery and repeat buyers", ["article", "quiz"], 0),
          topic(31916, "Ratings, reviews and handling a complaint in public", ["article", "quiz"], 0),
          topic(31917, "A small advertising budget spent carefully", ["article", "assignment"], 0),
        ],
      ),
      courseModule(
        319006,
        "Measuring and improving",
        "The few numbers worth watching, on a routine you can keep.",
        [
          topic(31918, "Views, orders and conversion, read once a week", ["article", "quiz"], 0),
          topic(31919, "A weekly routine for a one person shop", ["article", "assignment"], 0),
          topic(31920, "When to add a second product line", ["article", "quiz"], 0),
        ],
      ),
    ],
  },
];

/**
 * Mean progress across a course's topics.
 *
 * A plain average over topics (rather than weighting by item count) is what the
 * step counter on the journey board also counts, so the headline percentage and
 * "N of M steps" move together.
 */
function deriveCompletion(course: CourseSeed): number {
  const topics = course.modules.flatMap((m) => m.topics);
  if (topics.length === 0) return 0;
  return Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length);
}

export const COURSES: readonly DemoCourse[] = COURSE_SEEDS.map((course) => ({
  ...course,
  completion: deriveCompletion(course),
}));

/**
 * Ids are hand-written, so they are checked once at module load.
 *
 * A duplicated topic id is not a visible bug: `topicById` returns the first
 * match, so the second topic silently serves the first one's article, quiz and
 * progress. That is exactly the failure a curriculum author would spend an
 * afternoon on. In development this throws at import; in production it logs,
 * because a mistyped id must not take the catalogue down in front of a room.
 */
function assertUniqueIds(): void {
  const topicIds = new Set<number>();
  const moduleIds = new Set<number>();
  const clashes: string[] = [];
  for (const course of COURSES) {
    for (const m of course.modules) {
      if (moduleIds.has(m.id)) clashes.push(`module ${m.id} (${m.title})`);
      moduleIds.add(m.id);
      for (const t of m.topics) {
        if (topicIds.has(t.id)) clashes.push(`topic ${t.id} (${t.title})`);
        topicIds.add(t.id);
      }
    }
  }
  if (clashes.length === 0) return;
  const message = `courses.ts: duplicate ids: ${clashes.join(", ")}`;
  if (process.env.NODE_ENV !== "production") throw new Error(message);
  console.error(message);
}

assertUniqueIds();

export function courseById(id: number): DemoCourse | undefined {
  return COURSES.find((c) => c.id === id);
}

export function enrolledCourses(): DemoCourse[] {
  return COURSES.filter((c) => c.enrolled);
}

/** Flattened topic list for a course, in order. */
export function topicsOf(course: DemoCourse): DemoTopic[] {
  return course.modules.flatMap((m) => m.topics);
}

/** Total learning items across a course, used for card stats. */
export function itemCounts(course: DemoCourse) {
  const counts = { video: 0, quiz: 0, article: 0, assignment: 0, coding_problem: 0 };
  for (const t of topicsOf(course)) {
    for (const kind of t.kinds) {
      if (kind === "video") counts.video++;
      else if (kind === "quiz") counts.quiz++;
      else if (kind === "article") counts.article++;
      else if (kind === "assignment") counts.assignment++;
      else if (kind === "coding") counts.coding_problem++;
    }
  }
  return counts;
}

/**
 * The first unfinished topic, which "Resume" and "Up next" both point at.
 * Returning the same record to both is what stops the dashboard promising one
 * lesson and the course opening another.
 */
export function nextTopic(course: DemoCourse): { module: DemoModule; topic: DemoTopic } | null {
  for (const m of course.modules) {
    for (const t of m.topics) {
      if (t.progress < 100) return { module: m, topic: t };
    }
  }
  return null;
}

/** Due date for the course's current week, or null when self-paced. */
export function courseDueAt(course: DemoCourse): string | null {
  return course.dueInDays == null ? null : isoDaysAhead(course.dueInDays, 23, 59);
}

/** Stable per-course enrolment date, used on certificates and progress copy. */
export function enrolledAt(course: DemoCourse): string {
  return isoDaysAgo(seededInt(`enrolled:${course.id}`, 40, 150));
}

export { daysAhead };

/** Avatar helper re-exported so course consumers do not import two modules. */
export { avatarFor };

/** Find a topic (submodule) by id, with the course and module that contain it. */
export function topicById(
  id: number,
): { course: DemoCourse; module: DemoModule; topic: DemoTopic } | null {
  for (const course of COURSES) {
    for (const m of course.modules) {
      for (const t of m.topics) {
        if (t.id === id) return { course, module: m, topic: t };
      }
    }
  }
  return null;
}
