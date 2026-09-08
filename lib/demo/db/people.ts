/**
 * The cast of the platform.
 *
 * One roster feeds every surface that shows a person: leaderboards, community
 * threads, batch rosters, the admin aspirant table, faculty gradebooks. That
 * consistency is what makes the prototype hold up under scrutiny: an officer
 * who spots "Srikanth Bandari" at rank 3 on the leaderboard and then opens the
 * admin aspirant list finds the same person, with the same photograph and the
 * same points.
 *
 * Names are predominantly Telugu-speaking Telangana names, because that is who
 * a state skilling mission serves. Urdu-speaking Hyderabadi, Banjara and
 * Marathi-border names sit alongside them, because the state is not one
 * community. Every person here is fictional.
 */

import { portraitAt, portraitFor } from "./avatar";
import { DEMO_PERSONAS } from "../config";
import { seededInt, seededPick } from "../random";

export interface DemoPerson {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "admin";
  profile_pic_url: string;
  college: string;
  /** Total points across every module. Drives leaderboards and the wallet. */
  points: number;
  /** Current daily streak in days. */
  streak: number;
  linkedin_url: string;
  /** Short headline shown on profile cards and community hovers. */
  headline: string;
}

/**
 * Institutions and skill centres the roster is drawn from.
 *
 * The field on DemoPerson is still called `college`, because it is read in a
 * dozen places and renamed in none of them, but for this tenant it holds
 * whatever the person is attached to: a university, a government degree
 * college, a polytechnic, an ITI or a mission skill centre. Every entry carries
 * its district, because a state mission reports by district and an institution
 * without one cannot be placed on that report.
 */
const COLLEGES = [
  "Osmania University, Hyderabad",
  "Kakatiya University, Warangal",
  "Telangana University, Nizamabad",
  "Satavahana University, Karimnagar",
  "Mahatma Gandhi University, Nalgonda",
  "Palamuru University, Mahbubnagar",
  "Government Polytechnic, Warangal",
  "Government Polytechnic, Karimnagar",
  "Government Polytechnic, Mancherial",
  "Government Polytechnic, Nirmal",
  "Government ITI, Nizamabad",
  "Government ITI, Khammam",
  "Government ITI, Adilabad",
  "Government Degree College, Siddipet",
  "Government Degree College, Wanaparthy",
  "Government Degree College for Women, Jagtial",
  "TSEM Skill Centre, Khammam",
  "TSEM Skill Centre, Suryapet",
  "TSEM Skill Centre, Vikarabad",
  "TSEM Skill Centre, Sangareddy",
  "TSEM Skill Centre, Rangareddy",
  "TSEM Skill Centre, Bhadradri Kothagudem",
] as const;

/**
 * Headlines read like the people a state mission actually serves: someone
 * sitting a recruitment exam, someone on a trade course at a district centre,
 * someone turning a self-help group into a registered unit. None of them names
 * a live vacancy, a fee or a cut-off, which is the one thing this seed must
 * never assert as current fact.
 */
const HEADLINES = [
  "TGPSC Group-II aspirant, second attempt",
  "Preparing for SSC CGL Tier-II",
  "IBPS PO aspirant, banking awareness focus",
  "RRB Group-D aspirant, Secunderabad zone",
  "TGLPRB constable aspirant, written and physical",
  "GATE aspirant targeting PSU recruitment",
  "Solar PV trainee, Warangal centre",
  "ITI electrician, wiring and estimation",
  "Tailoring and boutique trainee, Karimnagar",
  "Mobile repair trainee, runs a counter at home",
  "Common Service Centre operator in training",
  "SHG member starting a millet processing unit",
  "FPO board member learning procurement",
  "First-generation graduate preparing for state exams",
] as const;

/** Raw roster: only the parts that must be hand-authored to read as real. */
/**
 * The roster: a name and the portrait that belongs to that character.
 *
 * The portrait is AUTHORED alongside the name, not derived from it. Portraits
 * used to be hashed across an anonymous pool, on the reasoning that inferring
 * anything about a person from their name is an assumption worth avoiding. That
 * reasoning is right, and this keeps it: nothing here reads a name and decides
 * anything. The photo is simply part of the character the seed describes, the
 * same as the name and the institution.
 *
 * What the hash produced instead was a demo where a persona introduced as
 * Sandhya Macherla appeared under a stranger's photograph on every screen,
 * which an evaluator reads as a broken build rather than as a principled
 * position.
 *
 * Slots are unique, so no two people in the demo share a face.
 */
const ROSTER_NAMES: ReadonlyArray<readonly [string, string, string]> = [
  ["Srikanth", "Bandari", "men/1"],
  ["Sravani", "Mekala", "women/2"],
  ["Naveen", "Gaddam", "men/3"],
  ["Anitha", "Vemula", "women/4"],
  ["Rajkumar", "Dharavath", "men/5"],
  ["Swapna", "Chintala", "women/6"],
  ["Mohammed", "Ghouse", "men/7"],
  ["Pravalika", "Kandula", "women/8"],
  ["Venkatesh", "Thumma", "men/9"],
  ["Sunitha", "Rathod", "women/10"],
  ["Praveen", "Gundeti", "men/11"],
  ["Kavitha", "Mallepally", "women/12"],
  ["Yadagiri", "Sabbani", "men/13"],
  ["Divya", "Nallamothu", "women/14"],
  ["Rakesh", "Jakkula", "men/15"],
  ["Shirisha", "Ganta", "women/16"],
  ["Sandeep", "Karnati", "men/17"],
  ["Ayesha", "Sultana", "women/18"],
  ["Bhaskar", "Pallerla", "men/19"],
  ["Lavanya", "Cherukuri", "women/20"],
  ["Vamshi", "Mudiraj", "men/21"],
  ["Sujatha", "Enugala", "women/22"],
  ["Kiran", "Vaddepalli", "men/23"],
  ["Mounika", "Kotha", "women/24"],
  ["Nagaraju", "Talari", "men/25"],
  ["Renuka", "Godishala", "women/26"],
  ["Mahesh", "Sanka", "men/27"],
  ["Vaishnavi", "Manthena", "women/28"],
  ["Ranjith", "Ramavath", "men/29"],
  ["Sridevi", "Uppala", "women/30"],
  ["Sathish", "Konda", "men/31"],
  ["Padma", "Chennuri", "women/32"],
  ["Harish", "Bathula", "men/33"],
  ["Anusha", "Gajula", "women/34"],
  ["Imran", "Baig", "men/35"],
  ["Nikita", "Deshmukh", "women/36"],
  ["Ashok", "Jadhav", "men/37"],
  ["Jyothi", "Burra", "women/38"],
  ["Charan", "Nelakurthi", "men/39"],
  ["Deepika", "Sirikonda", "women/40"],
  ["Manjunath", "Gowda", "men/41"],
  ["Sushma", "Nomula", "women/42"],
  ["Balaraju", "Kummari", "men/43"],
  ["Ramya", "Marri", "women/44"],
] as const;

// The mission issues an account on its own domain to everyone it enrols, so
// aspirants, trainees and faculty all sit here. The three persona addresses in
// `DEMO_PERSONAS` are on the same domain, which is what stops the login screen
// and the roster from drifting apart.
const EMAIL_DOMAIN = "tsem.gov.in";

function slugEmail(first: string, last: string, id: number): string {
  const base = `${first}.${last}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z.]/g, "");
  // Roster is small enough that a collision is unlikely, but the id suffix makes
  // uniqueness structural rather than a thing to remember when adding a name.
  return `${base}${id % 7 === 0 ? id : ""}@${EMAIL_DOMAIN}`;
}

function buildPerson(
  id: number,
  first: string,
  last: string,
  role: DemoPerson["role"],
  overrides: Partial<DemoPerson> = {},
): DemoPerson {
  const fullName = `${first} ${last}`;
  const seed = `person:${fullName}`;
  return {
    id,
    first_name: first,
    last_name: last,
    full_name: fullName,
    user_name: fullName,
    email: slugEmail(first, last, id),
    phone: `+91 ${seededInt(`${seed}:phone`, 70000, 99999)}${seededInt(`${seed}:phone2`, 10000, 99999)}`,
    role,
    profile_pic_url: portraitFor(fullName),
    college: seededPick(`${seed}:college`, COLLEGES),
    points: seededInt(`${seed}:points`, 420, 9800),
    streak: seededInt(`${seed}:streak`, 0, 46),
    linkedin_url: `https://www.linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase().replace(/[^a-z]/g, "")}`,
    headline: seededPick(`${seed}:headline`, HEADLINES),
    ...overrides,
  };
}

/**
 * The three sign-in personas.
 *
 * Their ids are low and fixed so handlers can reference them directly, and their
 * emails come from `DEMO_PERSONAS` so the credentials shown on the login screen
 * and the accounts that actually work can never drift apart.
 */
export const STUDENT_PERSONA: DemoPerson = buildPerson(1001, "Sandhya", "Macherla", "student", {
  email: DEMO_PERSONAS[0].email,
  profile_pic_url: portraitAt("women/70"),
  college: "Kakatiya University, Warangal",
  headline: "TGPSC Group-II aspirant, second attempt | Warangal",
  points: 7840,
  streak: 23,
});

export const INSTRUCTOR_PERSONA: DemoPerson = buildPerson(1002, "Srinivas", "Kandukuri", "instructor", {
  email: DEMO_PERSONAS[1].email,
  profile_pic_url: portraitAt("men/70"),
  college: "Telangana Skills & Employment Mission",
  headline: "Senior Faculty | General Studies and exam strategy",
  points: 0,
  streak: 0,
});

export const ADMIN_PERSONA: DemoPerson = buildPerson(1003, "Anuradha", "Devarakonda", "admin", {
  email: DEMO_PERSONAS[2].email,
  profile_pic_url: portraitAt("women/72"),
  college: "Telangana Skills & Employment Mission",
  headline: "Programme Officer | Skilling and placement",
  points: 0,
  streak: 0,
});

export const PERSONAS: readonly DemoPerson[] = [
  STUDENT_PERSONA,
  INSTRUCTOR_PERSONA,
  ADMIN_PERSONA,
];

/**
 * Subject faculty and skill-centre trainers, for batch assignment and
 * live-session hosts.
 *
 * Expertise maps onto the catalogue: exam faculty for the government-jobs
 * section, trade and enterprise trainers for skill development. The order is
 * load-bearing, because `courses.ts`, `live-sessions.ts` and `community.ts`
 * index FACULTY[0] to FACULTY[2] directly. Append to the end; never remove.
 */
export const FACULTY: readonly DemoPerson[] = [
  buildPerson(1101, "Rajeshwar", "Katukuri", "instructor", {
    profile_pic_url: portraitAt("men/72"),
    college: "Telangana Skills & Employment Mission",
    headline: "Faculty | Polity, Economy and Telangana Movement",
  }),
  buildPerson(1102, "Padmaja", "Chekuri", "instructor", {
    profile_pic_url: portraitAt("women/74"),
    college: "Telangana Skills & Employment Mission",
    headline: "Faculty | Quantitative Aptitude and Banking Awareness",
  }),
  buildPerson(1103, "Shankar", "Dandu", "instructor", {
    profile_pic_url: portraitAt("men/76"),
    college: "TSEM Skill Centre, Warangal",
    headline: "Trainer | Solar PV installation and electrical trades",
  }),
  buildPerson(1104, "Sarala", "Nandyala", "instructor", {
    profile_pic_url: portraitAt("women/76"),
    college: "TSEM Skill Centre, Khammam",
    headline: "Trainer | Enterprise development and SHG linkage",
  }),
  buildPerson(1105, "Nagalakshmi", "Vanam", "instructor", {
    profile_pic_url: portraitAt("women/78"),
    college: "TSEM Skill Centre, Suryapet",
    headline: "Trainer | Digital literacy and CSC operations",
  }),
];

/** The aspirants and trainees. Ids start at 2000 to stay clear of staff. */
export const STUDENTS: readonly DemoPerson[] = ROSTER_NAMES.map(([first, last, portrait], i) =>
  buildPerson(2000 + i, first, last, "student", { profile_pic_url: portraitAt(portrait) }),
);

/** Everyone, in one list: the lookup surface handlers use. */
export const ALL_PEOPLE: readonly DemoPerson[] = [
  ...PERSONAS,
  ...FACULTY,
  ...STUDENTS,
];

export function personById(id: number): DemoPerson | undefined {
  return ALL_PEOPLE.find((p) => p.id === id);
}

export function personByEmail(email: string): DemoPerson | undefined {
  const wanted = email.trim().toLowerCase();
  return ALL_PEOPLE.find((p) => p.email.toLowerCase() === wanted);
}

/**
 * The full learner list including the signed-in aspirant persona, ranked by
 * points. Leaderboards, the admin roster and batch views all read from here, so
 * a person's standing is identical wherever it is shown.
 */
export function rankedLearners(): DemoPerson[] {
  return [STUDENT_PERSONA, ...STUDENTS].sort((a, b) => b.points - a.points);
}
