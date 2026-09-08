/**
 * Full learner/staff profiles.
 *
 * The signed-in personas are scored 100% complete on purpose. Profile completion
 * is a real gate in this product — `ProfileCompletion.locked_modules` locks the
 * resume, jobs and interview modules until five fields are filled — and a
 * prospect who lands on a locked module has been shown a wall instead of a
 * feature. Anyone exploring the demo should reach every screen.
 */

import type { ProfileCompletion, UserProfile } from "@/lib/services/profile.service";
import { ADMIN_PERSONA, INSTRUCTOR_PERSONA, STUDENT_PERSONA, type DemoPerson } from "./people";
import { ymd, daysAgo } from "../clock";

/** A fully satisfied completion payload — nothing locked, nothing nagging. */
function completeProfile(): ProfileCompletion {
  const fields = [
    { field: "phone_number", label: "Phone number" },
    { field: "college_name", label: "College" },
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

/** Baseline profile derived from a roster entry — used for everyone but the personas. */
function baseProfile(person: DemoPerson): UserProfile {
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
    degree_type: "B.Tech",
    branch: "Computer Science and Engineering",
    graduation_year: String(new Date().getUTCFullYear() + 1),
    city: "Bengaluru",
    state: "Karnataka",
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
 * The student a prospect signs in as.
 *
 * Written out in full rather than generated: this is the profile that gets
 * projected on a screen, opened in the resume builder and exported to PDF, so
 * every line has to survive being read closely.
 */
const STUDENT_PROFILE: UserProfile = {
  ...baseProfile(STUDENT_PERSONA),
  bio:
    "Final-year computer science student at IIT Bombay. I build full-stack products and " +
    "spend most weekends on machine-learning side projects. Currently preparing for " +
    "backend and applied-ML roles.",
  headline: "Final-year CS undergrad | Full-stack & ML | Open to SDE roles",
  date_of_birth: "2004-03-14",
  city: "Mumbai",
  state: "Maharashtra",
  portfolio_website_url: "https://ananyarao.dev",
  leetcode_url: "https://leetcode.com/ananyarao",
  hackerrank_url: "https://www.hackerrank.com/ananyarao",
  kaggle_url: "https://www.kaggle.com/ananyarao",
  medium_url: "https://medium.com/@ananyarao",
  social_links: {
    linkedin: STUDENT_PERSONA.linkedin_url,
    github: "https://github.com/ananyarao",
    twitter: "https://x.com/ananyarao",
  },
  skills: [
    "Python",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Django",
    "Docker",
    "AWS",
    "Pandas",
    "scikit-learn",
    "System Design",
    "Data Structures & Algorithms",
  ].map((name, i) => ({ id: `sk-${i + 1}`, name })),
  projects: [
    {
      id: "pr-1",
      name: "Sahayak - campus support assistant",
      description:
        "Retrieval-augmented assistant that answers student queries from 4,000+ pages of " +
        "institute circulars. Cut the helpdesk's repeat-question load by roughly 60%.",
      technologies: ["Python", "FastAPI", "pgvector", "React"],
      url: "https://github.com/ananyarao/sahayak",
      start_date: ymd(daysAgo(240)),
      end_date: ymd(daysAgo(90)),
      current: false,
    },
    {
      id: "pr-2",
      name: "Ledgerly - expense splitting for hostels",
      description:
        "Group expense tracker with settle-up optimisation that minimises the number of " +
        "transfers. Used by 300+ students across three hostels.",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "Prisma"],
      url: "https://github.com/ananyarao/ledgerly",
      start_date: ymd(daysAgo(400)),
      end_date: ymd(daysAgo(250)),
      current: false,
    },
    {
      id: "pr-3",
      name: "Signal - real-time crop disease detection",
      description:
        "Fine-tuned a vision model on 18k leaf images and shipped it as an offline-first " +
        "mobile app for low-connectivity areas. 91% top-1 accuracy on the held-out set.",
      technologies: ["PyTorch", "ONNX", "React Native"],
      start_date: ymd(daysAgo(120)),
      current: true,
    },
  ],
  experience: [
    {
      id: "ex-1",
      company: "Zensar Technologies",
      position: "Software Engineering Intern",
      location: "Pune, India",
      start_date: ymd(daysAgo(430)),
      end_date: ymd(daysAgo(340)),
      current: false,
      description:
        "Rebuilt the internal reporting pipeline on Airflow, taking a nightly job from " +
        "3.5 hours to 22 minutes. Wrote the migration runbook the team still uses.",
    },
    {
      id: "ex-2",
      company: "AI Linc",
      position: "Teaching Assistant - Data Structures",
      location: "Mumbai, India",
      start_date: ymd(daysAgo(300)),
      current: true,
      description:
        "Run weekly lab sessions for 60 second-year students and grade assignments. " +
        "Built an autograder that removed most of the manual marking.",
    },
  ],
  education: [
    {
      id: "ed-1",
      institution: "Indian Institute of Technology, Bombay",
      degree: "B.Tech",
      field_of_study: "Computer Science and Engineering",
      start_date: ymd(daysAgo(1200)),
      end_date: ymd(daysAgo(-200)),
      gpa: "8.7 / 10",
      description: "Coursework: Operating Systems, Distributed Systems, Machine Learning, Databases.",
    },
  ],
  certifications: [
    {
      id: "ce-1",
      name: "AWS Certified Cloud Practitioner",
      issuing_organization: "Amazon Web Services",
      issue_date: ymd(daysAgo(180)),
      credential_id: "AWS-CCP-4471902",
      credential_url: "https://aws.amazon.com/verification",
    },
    {
      id: "ce-2",
      name: "Full-Stack Web Development",
      issuing_organization: "AI Linc",
      issue_date: ymd(daysAgo(60)),
      credential_id: "MIT-FSWD-2291",
    },
  ],
  achievements: [
    {
      id: "ac-1",
      title: "Winner - AI Linc Annual Hackathon",
      description: "First place out of 84 teams for an offline-first disaster-relief coordination app.",
      date: ymd(daysAgo(75)),
      organization: "AI Linc",
    },
    {
      id: "ac-2",
      title: "Global rank 412 - ICPC Regionals qualifier",
      date: ymd(daysAgo(210)),
      organization: "ICPC",
    },
  ],
};

const INSTRUCTOR_PROFILE: UserProfile = {
  ...baseProfile(INSTRUCTOR_PERSONA),
  headline: "Senior Instructor | Backend Engineering & Systems",
  bio:
    "Twelve years building distributed systems before moving into teaching. I run the " +
    "backend engineering track and the systems-design interview clinic at AI Linc.",
  degree_type: "M.Tech",
  branch: "Computer Science",
  graduation_year: "2011",
  city: "Bengaluru",
  state: "Karnataka",
  college_name: "Indian Institute of Science, Bengaluru",
  skills: ["Distributed Systems", "Go", "Python", "Kubernetes", "System Design", "Mentoring"].map(
    (name, i) => ({ id: `isk-${i + 1}`, name }),
  ),
  experience: [
    {
      id: "iex-1",
      company: "AI Linc",
      position: "Senior Instructor",
      location: "Bengaluru, India",
      start_date: ymd(daysAgo(1100)),
      current: true,
      description: "Owns the backend engineering curriculum and the systems-design clinic.",
    },
  ],
};

const ADMIN_PROFILE: UserProfile = {
  ...baseProfile(ADMIN_PERSONA),
  headline: "Director of Programs",
  bio:
    "Responsible for programme design, outcomes and industry partnerships across every " +
    "cohort at AI Linc.",
  degree_type: "Ph.D.",
  branch: "Education Technology",
  graduation_year: "2009",
  city: "Mumbai",
  state: "Maharashtra",
  college_name: "Tata Institute of Social Sciences",
  skills: ["Programme Design", "Learning Outcomes", "Industry Partnerships", "Analytics"].map(
    (name, i) => ({ id: `ask-${i + 1}`, name }),
  ),
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
