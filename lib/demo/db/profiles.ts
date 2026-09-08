/**
 * Full profiles for aspirants, trainees and staff.
 *
 * The signed-in personas are scored 100% complete on purpose. Profile completion
 * is a real gate in this product: `ProfileCompletion.locked_modules` locks the
 * resume, jobs and interview modules until five fields are filled, and anyone
 * who lands on a locked module has been shown a wall instead of a feature.
 * Everyone exploring the demo should reach every screen.
 */

import type { ProfileCompletion, UserProfile } from "@/lib/services/profile.service";
import { ADMIN_PERSONA, INSTRUCTOR_PERSONA, STUDENT_PERSONA, type DemoPerson } from "./people";
import { ymd, daysAgo, todayStart } from "../clock";

/** A fully satisfied completion payload: nothing locked, nothing nagging. */
function completeProfile(): ProfileCompletion {
  const fields = [
    { field: "phone_number", label: "Phone number" },
    { field: "college_name", label: "Institution" },
    { field: "graduation_year", label: "Graduation year" },
    { field: "city", label: "City" },
    { field: "skills", label: "Skills" },
  ];
  return {
    percentage: 100,
    is_complete: true,
    exempt: false,
    required_fields: fields.map((f) => ({ ...f, filled: true })),
    missing_fields: [],
    locked_modules: [],
  };
}

/** Baseline profile derived from a roster entry, used for everyone but the personas. */
function baseProfile(person: DemoPerson): UserProfile {
  // The district is read off the institution rather than picked separately, so a
  // trainee at "Government ITI, Khammam" is never shown as living in another
  // district. Staff postings carry no comma ("Telangana Skills & Employment
  // Mission"), and those sit at the state office in Hyderabad.
  const parts = person.college.split(", ");
  const district = parts.length > 1 ? parts[parts.length - 1] : "Hyderabad";
  return {
    profile_completion: completeProfile(),
    first_name: person.first_name,
    last_name: person.last_name,
    email: person.email,
    username: person.user_name,
    profile_picture: person.profile_pic_url,
    phone_number: person.phone,
    bio: null,
    social_links: { linkedin: person.linkedin_url },
    date_of_birth: null,
    gender: null,
    country: "India",
    role: person.role,
    headline: person.headline,
    cover_photo_url: null,
    college_name: person.college,
    degree_type: "B.A.",
    branch: "History, Economics and Political Science",
    // todayStart(), not `new Date()`: seeds must not read the wall clock
    // directly, or two renders a millisecond apart can disagree.
    graduation_year: String(todayStart().getUTCFullYear() - 1),
    city: district,
    state: "Telangana",
    portfolio_website_url: null,
    leetcode_url: null,
    hackerrank_url: null,
    kaggle_url: null,
    medium_url: null,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    achievements: [],
  };
}

/**
 * The aspirant a visitor signs in as.
 *
 * Written out in full rather than generated: this is the profile that gets
 * projected on a screen, opened in the resume builder and exported to PDF, so
 * every line has to survive being read closely.
 *
 * The four enrolments in `courses.ts` hang together on this record. She is a
 * commerce graduate sitting the state and banking exams, she keeps the books for
 * a rooftop solar contractor, which is why the solar PV trade course is hers,
 * and she is doing the paperwork for a self-help group unit, which is why the
 * micro-enterprise course is too.
 */
const STUDENT_PROFILE: UserProfile = {
  ...baseProfile(STUDENT_PERSONA),
  bio:
    "B.Com graduate from Kakatiya University, Warangal. I keep the accounts for a rooftop " +
    "solar contractor and I am preparing for TGPSC Group-II and the IBPS officer and " +
    "clerical exams. I also handle the paperwork for my mother's self-help group, which is " +
    "registering a tailoring unit.",
  headline: "TGPSC Group-II aspirant, second attempt | Warangal",
  date_of_birth: "2001-06-12",
  city: "Warangal",
  state: "Telangana",
  degree_type: "B.Com",
  branch: "Computer Applications",
  graduation_year: String(todayStart().getUTCFullYear() - 4),
  skills: [
    "Quantitative Aptitude",
    "Logical Reasoning",
    "General English",
    "Data Interpretation",
    "Indian Polity",
    "Indian Economy",
    "Telangana Movement and State Formation",
    "Current Affairs",
    "Banking Awareness",
    "Book-keeping and Tally",
    "MS Excel",
    "Descriptive Writing",
  ].map((name, i) => ({ id: `sk-${i + 1}`, name })),
  projects: [
    {
      id: "pr-1",
      name: "3 kW rooftop solar survey, Hanamkonda",
      description:
        "Shadow survey, roof load check and string layout for a residential rooftop, sized " +
        "against the inverter's MPPT voltage window and submitted as the site-survey " +
        "assignment for the solar PV installer course.",
      technologies: ["Site survey", "String sizing", "Structure layout", "Single-line diagram"],
      start_date: ymd(daysAgo(150)),
      end_date: ymd(daysAgo(96)),
      current: false,
    },
    {
      id: "pr-2",
      name: "Tailoring unit project report, Warangal SHG",
      description:
        "Machine and fixture costing, monthly break-even and a working-capital note for a " +
        "four-machine tailoring unit run by a self-help group, written in the format a bank " +
        "branch asks for on a MUDRA Kishore application.",
      technologies: ["Unit costing", "Break-even analysis", "Working capital", "MUDRA Kishore"],
      start_date: ymd(daysAgo(70)),
      current: true,
    },
    {
      id: "pr-3",
      name: "Group-II Paper-III answer bank",
      description:
        "Ninety model answers on economy and development, each written to the word limit " +
        "and checked against the question pattern of the last five papers.",
      technologies: ["Answer writing", "Telangana economy", "Revision notes"],
      start_date: ymd(daysAgo(210)),
      current: true,
    },
  ],
  experience: [
    {
      id: "ex-1",
      company: "Suryodaya Solar Solutions",
      position: "Accounts Assistant",
      location: "Warangal, Telangana",
      start_date: ymd(daysAgo(520)),
      current: true,
      description:
        "Raise invoices, maintain the GST ledger and follow up net-metering paperwork with " +
        "the DISCOM for rooftop installations across Warangal and Hanamkonda.",
    },
    {
      id: "ex-2",
      company: "Common Service Centre, Hanamkonda",
      position: "Data Entry Operator, part-time",
      location: "Hanamkonda, Warangal",
      start_date: ymd(daysAgo(1490)),
      end_date: ymd(daysAgo(540)),
      current: false,
      description:
        "Filed citizen applications for certificates, pensions and land records, and ran " +
        "Aadhaar-based verification for walk-in applicants.",
    },
  ],
  // The dates across education and experience are one continuous life: MEC at a
  // government junior college, a three-year B.Com, a Common Service Centre job
  // taken straight after it, and the solar contractor since. Move one and the
  // others have to move with it.
  education: [
    {
      id: "ed-1",
      institution: "Kakatiya University, Warangal",
      degree: "B.Com (Computer Applications)",
      field_of_study: "Commerce",
      start_date: ymd(daysAgo(2620)),
      end_date: ymd(daysAgo(1550)),
      gpa: "72%",
      description:
        "Coursework: Financial Accounting, Cost Accounting, Business Statistics, Income Tax, " +
        "Computerised Accounting.",
    },
    {
      id: "ed-2",
      institution: "Government Junior College, Hanamkonda",
      degree: "Intermediate (MEC)",
      field_of_study: "Mathematics, Economics and Commerce",
      start_date: ymd(daysAgo(3440)),
      end_date: ymd(daysAgo(2710)),
      gpa: "78%",
    },
  ],
  certifications: [
    {
      id: "ce-1",
      name: "Solar PV Installer (Suryamitra), NSQF Level 4",
      issuing_organization: "Skill Council for Green Jobs",
      issue_date: ymd(daysAgo(84)),
      credential_id: "SCGJ-SPI-0117348",
    },
    {
      id: "ce-2",
      name: "Book-keeping and Accounting with Tally",
      issuing_organization: "Telangana Skills & Employment Mission",
      issue_date: ymd(daysAgo(240)),
      credential_id: "TSEM-BKT-1184",
    },
  ],
  achievements: [
    {
      id: "ac-1",
      title: "Rank 34, Group-II mock test series",
      description:
        "Placed 34th of 4,180 candidates on the aggregate of the best eight of twelve tests " +
        "in the mission's Group-II series.",
      date: ymd(daysAgo(45)),
      organization: "Telangana Skills & Employment Mission",
    },
    {
      id: "ac-2",
      title: "Best unit plan, district enterprise workshop",
      description:
        "Chosen from 62 plans at the Warangal workshop for self-help group members moving " +
        "into manufacturing.",
      date: ymd(daysAgo(120)),
      organization: "District Rural Development Agency, Warangal",
    },
  ],
};

const INSTRUCTOR_PROFILE: UserProfile = {
  ...baseProfile(INSTRUCTOR_PERSONA),
  headline: "Senior Faculty | General Studies and exam strategy",
  bio:
    "Eighteen years teaching General Studies to state and central recruitment aspirants, ten " +
    "of them at coaching centres in Warangal and Karimnagar. I run the Group-I and Group-II " +
    "mentoring track and the weekly current affairs clinic.",
  degree_type: "M.A.",
  branch: "History",
  graduation_year: "2004",
  city: "Hyderabad",
  state: "Telangana",
  college_name: "Osmania University, Hyderabad",
  skills: [
    "Telangana Movement and State Formation",
    "Indian Polity",
    "Indian Economy",
    "Answer Writing",
    "Current Affairs",
    "Mentoring",
  ].map((name, i) => ({ id: `isk-${i + 1}`, name })),
  experience: [
    {
      id: "iex-1",
      company: "Telangana Skills & Employment Mission",
      position: "Senior Faculty, General Studies",
      location: "Hyderabad, Telangana",
      start_date: ymd(daysAgo(1460)),
      current: true,
      description:
        "Owns the General Studies curriculum across the government-jobs catalogue and chairs " +
        "the Group-I mock interview panel.",
    },
  ],
};

const ADMIN_PROFILE: UserProfile = {
  ...baseProfile(ADMIN_PERSONA),
  headline: "Programme Officer | Skilling and placement",
  bio:
    "Responsible for centre operations, batch planning, employer linkage and the monthly " +
    "outcome report across every district the mission works in.",
  degree_type: "M.A.",
  branch: "Rural Development",
  graduation_year: "2007",
  city: "Hyderabad",
  state: "Telangana",
  college_name: "Osmania University, Hyderabad",
  skills: [
    "Programme Design",
    "Centre Operations",
    "Batch Planning",
    "Employer Linkage",
    "Monitoring and Evaluation",
    "Scheme Convergence",
  ].map((name, i) => ({ id: `ask-${i + 1}`, name })),
};

const BY_ID: Record<number, UserProfile> = {
  [STUDENT_PERSONA.id]: STUDENT_PROFILE,
  [INSTRUCTOR_PERSONA.id]: INSTRUCTOR_PROFILE,
  [ADMIN_PERSONA.id]: ADMIN_PROFILE,
};

/** The seeded profile for a person, generated for roster members. */
export function profileFor(person: DemoPerson): UserProfile {
  return BY_ID[person.id] ?? baseProfile(person);
}
