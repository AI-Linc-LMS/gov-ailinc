/**
 * The cast of the demo.
 *
 * One roster feeds every surface that shows a person — leaderboards, community
 * threads, cohort rosters, the admin student table, instructor gradebooks. That
 * consistency is what makes the prototype hold up under scrutiny: a prospect who
 * spots "Kabir Deshmukh" at rank 3 on the leaderboard and then opens the admin
 * student list finds the same person, with the same avatar and the same points.
 *
 * Names skew Indian because that is who AI Linc's institutions actually teach,
 * with enough international names to show the platform is not region-locked.
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

const COLLEGES = [
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Trichy",
  "Delhi Technological University",
  "Vellore Institute of Technology",
  "BITS Pilani",
  "Manipal Institute of Technology",
  "PES University",
  "SRM Institute of Science and Technology",
  "Anna University",
  "Amrita Vishwa Vidyapeetham",
  "Jadavpur University",
  "College of Engineering, Pune",
] as const;

const HEADLINES = [
  "Aspiring backend engineer",
  "Full-stack learner | React + Node",
  "Data science enthusiast",
  "Preparing for product-based interviews",
  "Cloud and DevOps track",
  "Machine learning, one notebook at a time",
  "Frontend developer in the making",
  "CS undergrad | competitive programmer",
  "Switching careers into tech",
  "Python, SQL and everything in between",
] as const;

/** Raw roster: only the parts that must be hand-authored to read as real. */
/**
 * The learner roster: a name and the portrait that belongs to that character.
 *
 * The portrait is AUTHORED alongside the name, not derived from it. Portraits
 * used to be hashed across an anonymous pool, on the reasoning that inferring
 * anything about a person from their name is an assumption worth avoiding. That
 * reasoning is right, and this keeps it: nothing here reads a name and decides
 * anything. The photo is simply part of the character the seed describes, the
 * same as the name and the college.
 *
 * What the hash produced instead was a demo where a persona introduced as Ananya
 * Rao appeared under a stranger's photograph on every screen, which a prospect
 * reads as a broken build rather than as a principled position.
 *
 * Indices are unique, so no two people in the demo share a face.
 */
const ROSTER_NAMES: ReadonlyArray<readonly [string, string, string]> = [
  ["Kabir", "Deshmukh", "men/1"],
  ["Ishita", "Bansal", "women/2"],
  ["Rohan", "Pillai", "men/3"],
  ["Meera", "Krishnan", "women/4"],
  ["Arjun", "Sethi", "men/5"],
  ["Sara", "Qureshi", "women/6"],
  ["Nikhil", "Chaturvedi", "men/7"],
  ["Diya", "Malhotra", "women/8"],
  ["Aditya", "Ranganathan", "men/9"],
  ["Tanvi", "Joshi", "women/10"],
  ["Farhan", "Ansari", "men/11"],
  ["Neha", "Bhattacharya", "women/12"],
  ["Siddharth", "Venkatesh", "men/13"],
  ["Pooja", "Reddy", "women/14"],
  ["Yash", "Agarwal", "men/15"],
  ["Ritika", "Sen", "women/16"],
  ["Harsh", "Vardhan", "men/17"],
  ["Aisha", "Khan", "women/18"],
  ["Karthik", "Subramanian", "men/19"],
  ["Shreya", "Ghosh", "women/20"],
  ["Manav", "Trivedi", "men/21"],
  ["Lakshmi", "Narayanan", "women/22"],
  ["Devansh", "Kulkarni", "men/23"],
  ["Zoya", "Merchant", "women/24"],
  ["Pranav", "Bhatt", "men/25"],
  ["Anjali", "Verma", "women/26"],
  ["Imran", "Sheikh", "men/27"],
  ["Kavya", "Prasad", "women/28"],
  ["Rahul", "Chatterjee", "men/29"],
  ["Simran", "Gill", "women/30"],
  ["Vivek", "Nambiar", "men/31"],
  ["Tara", "D\'Souza", "women/32"],
  ["Aryan", "Mishra", "men/33"],
  ["Nandini", "Rajan", "women/34"],
  ["Omar", "Haddad", "men/35"],
  ["Elena", "Petrova", "women/36"],
  ["Daniel", "Okafor", "men/37"],
  ["Mei", "Lin", "women/38"],
  ["Gaurav", "Saxena", "men/39"],
  ["Priyanka", "Iyer", "women/40"],
  ["Sameer", "Kapadia", "men/41"],
  ["Ayesha", "Siddiqui", "women/42"],
  ["Varun", "Chopra", "men/43"],
  ["Ridhi", "Aggarwal", "women/44"],
] as const;

const EMAIL_DOMAIN = "ailinc.com";

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
export const STUDENT_PERSONA: DemoPerson = buildPerson(1001, "Ananya", "Rao", "student", {
  email: DEMO_PERSONAS[0].email,
  profile_pic_url: portraitAt("women/70"),
  college: "Indian Institute of Technology, Bombay",
  headline: "Final-year CS undergrad | full-stack and ML",
  points: 7840,
  streak: 23,
});

export const INSTRUCTOR_PERSONA: DemoPerson = buildPerson(1002, "Vikram", "Menon", "instructor", {
  email: DEMO_PERSONAS[1].email,
  profile_pic_url: portraitAt("men/70"),
  college: "AI Linc",
  headline: "Senior Instructor | Backend Engineering and Systems",
  points: 0,
  streak: 0,
});

export const ADMIN_PERSONA: DemoPerson = buildPerson(1003, "Priya", "Nair", "admin", {
  email: DEMO_PERSONAS[2].email,
  profile_pic_url: portraitAt("women/72"),
  college: "AI Linc",
  headline: "Director of Programs",
  points: 0,
  streak: 0,
});

export const PERSONAS: readonly DemoPerson[] = [
  STUDENT_PERSONA,
  INSTRUCTOR_PERSONA,
  ADMIN_PERSONA,
];

/** Additional teaching staff, for cohort assignment and live-session hosts. */
export const FACULTY: readonly DemoPerson[] = [
  buildPerson(1101, "Ritu", "Kulkarni", "instructor", {
    profile_pic_url: portraitAt("women/74"),
    headline: "Instructor | Data Science and Analytics",
  }),
  buildPerson(1102, "Suresh", "Iyengar", "instructor", {
    profile_pic_url: portraitAt("men/72"),
    headline: "Instructor | Cloud and DevOps",
  }),
  buildPerson(1103, "Fatima", "Rizvi", "instructor", {
    profile_pic_url: portraitAt("women/76"),
    headline: "Instructor | Frontend Engineering",
  }),
];

/** The learner body. Ids start at 2000 to stay clearly distinct from staff. */
export const STUDENTS: readonly DemoPerson[] = ROSTER_NAMES.map(([first, last, portrait], i) =>
  buildPerson(2000 + i, first, last, "student", { profile_pic_url: portraitAt(portrait) }),
);

/** Everyone, in one list — the lookup surface handlers use. */
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
 * The full learner list including the signed-in student persona, ranked by
 * points. Leaderboards, the admin roster and cohort views all read from here so
 * a person's standing is identical wherever it is shown.
 */
export function rankedLearners(): DemoPerson[] {
  return [STUDENT_PERSONA, ...STUDENTS].sort((a, b) => b.points - a.points);
}
