/**
 * The placement module: postings, the screening-question bank, and applications.
 *
 * Lifted out of `handlers/jobs.ts` because four surfaces read these rows and
 * three of them can write: the learner board, the learner's applications list,
 * the admin job list (handlers/admin.ts) and the admin job detail
 * (handlers/details.ts). While each kept its own literal they disagreed - the
 * admin list showed four of the six jobs the learner could see, every row read
 * "Draft" because `is_published` was missing, and a job created through the
 * admin form appeared nowhere at all. One record, several projections, and every
 * mutation through the overlay so a create, an edit or a delete survives a
 * reload.
 *
 * For this tenant the board is a GOVERNMENT JOB NOTIFICATION board carrying the
 * vocational openings the skill centres feed into. Two kinds of posting sit side
 * by side and they behave differently on purpose:
 *
 *  - A recruitment notification (TGPSC, TGLPRB, SCCL, SSC, RRB, IBPS, SBI, RBI,
 *    BHEL) carries the recruiting body's own portal in `apply_link`, because the
 *    portal is where the government actually takes the application. The app
 *    records the application as `applying` and asks the aspirant to confirm they
 *    finished, which is the confirm-applied flow. These postings are shaped like
 *    a notification: pay as a pay-level or pay-scale band rather than a CTC, an
 *    age limit with the relaxation categories named generically, the
 *    qualification, and the selection stages spelled out in `role_process`.
 *  - A vocational opening (a solar EPC firm, a garment unit, a repair franchise,
 *    a farmer producer company, a Common Service Centre) is an ordinary employer
 *    job with no `apply_link`, so it runs the in-app apply wizard and the
 *    screening questions below. Ordinary salary and skills shape, no pay level.
 *
 * Nothing here is a live advertisement. Notification numbers, vacancy counts and
 * both dates are generated from the seeded PRNG and the demo clock, so they stay
 * stable across a reload, move with the calendar, and can never be read as a
 * real vacancy count or a real closing date for a real recruitment. What IS
 * accurate is the stable published structure of each recruitment: the papers and
 * their marks, the pay band of the grade, the selection stages, the trade skills
 * a vocational employer tests. Every posting says so in its own description.
 */

import { companyLogoFor } from "./avatar";
import { courseById } from "./courses";
import { overlay, nextDemoId } from "./overlay";
import { personById, STUDENTS, STUDENT_PERSONA, type DemoPerson } from "./people";
import { personaResumeUrl, resumeDocumentUrl } from "./resumes";
import { iso, isoDaysAgo, nowMs, todayStart, ymdDaysAgo, ymdDaysAhead } from "../clock";
import { seededInt, seededPick, seededSample } from "../random";

export type JobStatus = "active" | "inactive" | "closed" | "completed" | "on_hold";

export type ApplicationStatus =
  | "applying"
  | "applied"
  | "shortlisted"
  | "interview_stage"
  | "rejected"
  | "selected";

export interface JobQuestion {
  id: number;
  question_text: string;
  question_type: "text" | "textarea" | "choice" | "multichoice" | "yes_no";
  is_required: boolean;
  order: number;
  options?: string[];
  created_at?: string;
}

export interface CollegeMapping {
  id?: number;
  college_name: string;
  department?: string;
  batch?: string;
}

/**
 * A posting as the API stores it: dates already absolute, ids already resolved.
 *
 * Deliberately not the wire shape. `courses` / `assigned_students` / `questions`
 * are expanded per endpoint (the learner board must never receive the curated
 * student list) so the record keeps only ids.
 */
export interface JobRecord {
  id: number;
  job_title: string;
  company_name: string;
  company_logo: string;
  company_info: string;
  job_description: string;
  role_process: string;
  mandatory_skills: string[];
  key_skills: string[];
  industry_type: string;
  department: string;
  employment_type: string;
  role_category: string;
  education: string;
  ug_requirements: string;
  pg_requirements: string;
  location: string;
  years_of_experience: string;
  salary: string;
  apply_link: string;
  job_type: string;
  status: JobStatus;
  /** DateField: `YYYY-MM-DD`, never a timestamp. The edit form slices it. */
  application_deadline: string | null;
  jd_file_url?: string;
  number_of_openings: number | null;
  applicable_passout_year: string | null;
  min_10th_percentage: number | null;
  min_12th_percentage: number | null;
  min_graduation_percentage: number | null;
  tags: string[];
  created_at: string;
  is_published: boolean;
  favorites_count: number;
  course_ids: number[];
  adaptive_course_ids: number[];
  college_mappings: CollegeMapping[];
  assigned_student_ids: number[];
  question_ids: number[];
}

export interface JobApplicationRecord {
  id: number;
  job: number;
  job_title: string;
  company_name: string;
  student: number;
  student_name: string;
  student_email: string;
  student_profile_pic_url: string | null;
  student_phone: string;
  student_college: string;
  student_degree: string;
  student_batch: string;
  student_yop: number | null;
  student_location: string;
  student_skills: string;
  student_experience: string;
  status: ApplicationStatus;
  resume_url: string;
  drive: string;
  internal_shortlisting: string;
  reason_not_shortlisted: string;
  shortlisted_by_hr: string;
  round_1: string;
  round_2: string;
  round_3: string;
  round_4: string;
  offered: string;
  applied_at: string;
  updated_at: string;
}

const CURRENT_YEAR = todayStart().getUTCFullYear();

// ── Screening questions ────────────────────────────────────────────────────

/**
 * The shared question bank.
 *
 * A job carries ids into this list rather than its own copies, which is what the
 * admin form assumes: it loads the bank once and ticks the ones a posting uses.
 *
 * These are the questions a recruiting body or a skill centre placement cell
 * actually asks, not the ones a software company asks: the category certificate
 * the candidate holds, the district they claim local candidature in, whether
 * they will take a posting anywhere in the state, how many attempts they have
 * already made, the ITI trade certificate, the driving licence. They are worth
 * getting right because the apply wizard shows them word for word.
 *
 * All five question types are represented. A bank that is all `text` renders as
 * five identical boxes and hides half of what the form can do.
 */
const SEED_QUESTIONS: readonly JobQuestion[] = [
  {
    id: 5001,
    question_text: "Which category certificate do you hold?",
    question_type: "choice",
    is_required: true,
    order: 1,
    options: ["Open category, no certificate", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST", "EWS"],
  },
  {
    id: 5002,
    question_text: "Which district do you claim local candidature in?",
    question_type: "text",
    is_required: true,
    order: 2,
  },
  {
    id: 5003,
    question_text: "Are you willing to be posted anywhere in Telangana, including a district other than your own?",
    question_type: "yes_no",
    is_required: true,
    order: 3,
    options: ["Yes", "No"],
  },
  {
    id: 5004,
    question_text: "How many times have you appeared for this recruitment before?",
    question_type: "choice",
    is_required: false,
    order: 4,
    options: ["First attempt", "Second attempt", "Third attempt", "More than three attempts"],
  },
  {
    id: 5005,
    question_text:
      "If you hold an ITI National Trade Certificate, enter the trade and the certificate number.",
    question_type: "text",
    is_required: false,
    order: 5,
  },
  {
    id: 5006,
    question_text: "Which driving licence do you hold?",
    question_type: "choice",
    is_required: false,
    order: 6,
    options: [
      "None",
      "Two wheeler (MCWG)",
      "Light motor vehicle (LMV)",
      "Two wheeler and LMV",
      "Heavy vehicle (HMV)",
    ],
  },
  {
    id: 5007,
    question_text: "Which skill centre or institution are you enrolled at, and in which batch?",
    question_type: "text",
    is_required: false,
    order: 7,
  },
  {
    id: 5008,
    question_text: "How soon could you join if you are selected?",
    question_type: "choice",
    is_required: true,
    order: 8,
    options: ["Immediately", "Within 15 days", "Within 30 days", "After my current batch ends"],
  },
  {
    id: 5009,
    question_text: "Can you read, write and speak Telugu?",
    question_type: "yes_no",
    is_required: false,
    order: 9,
    options: ["Yes", "No"],
  },
  {
    id: 5010,
    question_text:
      "Describe the work you have done in this trade so far, including any on the job training or apprenticeship.",
    question_type: "textarea",
    is_required: false,
    order: 10,
  },
  {
    id: 5011,
    question_text: "Which of these do you have for field work?",
    question_type: "multichoice",
    is_required: false,
    order: 11,
    options: [
      "Own two wheeler",
      "Smartphone with internet",
      "Laptop or desktop",
      "Printer or scanner",
      "Own premises or a shop",
    ],
  },
  {
    id: 5012,
    question_text: "Are you willing to work in shifts, including a night shift?",
    question_type: "yes_no",
    is_required: false,
    order: 12,
    options: ["Yes", "No"],
  },
];

const QUESTIONS_KEY = "jobs:questions";

/** The bank, with anything the admin added this session appended in order. */
export function allQuestions(): JobQuestion[] {
  const added = overlay.get<JobQuestion[]>(QUESTIONS_KEY, []);
  return [...SEED_QUESTIONS, ...added].sort((a, b) => a.order - b.order || a.id - b.id);
}

export function questionsByIds(ids: readonly number[]): JobQuestion[] {
  const bank = allQuestions();
  return ids
    .map((id) => bank.find((q) => q.id === id))
    .filter((q): q is JobQuestion => Boolean(q))
    .sort((a, b) => a.order - b.order);
}

export function addQuestion(input: {
  question_text: string;
  question_type?: string;
  is_required?: boolean;
  order?: number;
  options?: string[];
}): JobQuestion {
  const bank = allQuestions();
  const question: JobQuestion = {
    id: nextDemoId("job-question"),
    question_text: input.question_text,
    question_type: (input.question_type ?? "text") as JobQuestion["question_type"],
    is_required: input.is_required ?? false,
    order: input.order ?? bank.length + 1,
    options: input.options && input.options.length > 0 ? input.options : undefined,
    created_at: iso(new Date(nowMs())),
  };
  overlay.push(QUESTIONS_KEY, question);
  return question;
}

// ── Postings ───────────────────────────────────────────────────────────────

interface JobSeed {
  id: number;
  job_title: string;
  company_name: string;
  company_info: string;
  job_description: string;
  role_process: string;
  location: string;
  years_of_experience: string;
  salary: string;
  employment_type: string;
  industry_type: string;
  department: string;
  role_category: string;
  education: string;
  ug_requirements: string;
  pg_requirements: string;
  skills: string[];
  number_of_openings: number;
  status: JobStatus;
  is_published: boolean;
  createdDaysAgo: number;
  /** Days from today until applications close. Negative for a posting already shut. */
  deadlineInDays: number;
  /**
   * The recruiting body's own portal, or "" for a posting applied to in the app.
   *
   * A notification always carries one. The government takes the application on
   * its own portal and this board only tracks it, so the learner is sent there
   * and then asked to confirm they finished. A vocational opening carries "" and
   * runs the in-app wizard with the screening questions instead.
   */
  applyLink: string;
  /**
   * Year of passing the posting is restricted to, or null.
   *
   * Null on every notification, and that is the accurate answer: a recruitment
   * notification prescribes a qualification held by the cut-off date, never a
   * passing year. A skill centre batch drive does target a batch, which is what
   * the vocational postings carry.
   */
  applicablePassoutYear: string | null;
  courseIds: number[];
  colleges: CollegeMapping[];
  questionIds: number[];
  /**
   * Aggregate percentage prescribed at degree level, or null.
   *
   * Null almost everywhere, again because that is what is true: a state or
   * central notification asks for a degree, not for a percentage. The two here
   * that do prescribe one (BHEL through GATE, RBI Grade-B) also repeat it in
   * `ug_requirements`, where the relaxation that goes with it can be stated.
   */
  minGraduationPercentage: number | null;
}

/**
 * A demo notification serial, printed in the shape each body uses.
 *
 * The serial comes from the seeded PRNG and the year from the demo clock, so it
 * is stable across a reload, moves with the calendar, and can never be mistaken
 * for an advertisement in circulation today. `number_of_openings` below is
 * seeded for the same reason: a vacancy count copied from a real notification
 * would be read as this year's vacancy count six months from now.
 */
function notificationNo(seedKey: string): string {
  return String(seededInt(`jobs:notification:${seedKey}`, 3, 48)).padStart(2, "0");
}

/** The line every notification carries, so nobody reads a demo figure as fact. */
const DEMO_FIGURES_NOTE =
  "The notification number, vacancy count and closing date shown here are demo values generated for this preview. The notification published on the official portal is the authority.";

/** The same line for a vocational opening, which has no notification number. */
const DEMO_OPENING_NOTE =
  "The number of openings and the closing date shown here are demo values generated for this preview.";

/**
 * The board.
 *
 * Ten recruitment notifications and five vocational openings, which is the mix
 * an aspirant in a district actually sees: state posts through TGPSC and the
 * police board, a state coal corporation, the central examinations, the banks,
 * a PSU through GATE, and the openings the skill centres place their trainees
 * into. Statuses are spread the way a real board is: most open, one closed with
 * the window already past, one held back pending the next order cycle.
 */
const SEED_JOBS: readonly JobSeed[] = [
  {
    id: 601,
    job_title: "Group-II Services: Assistant Section Officer and allied posts",
    company_name: "Telangana Public Service Commission (TGPSC)",
    company_info:
      "TGPSC is the state's recruiting body for civil posts under the Government of Telangana. It notifies the vacancies indented by departments, conducts the written examination at centres across the districts, and publishes the merit list and the post allocation.",
    job_description:
      "Group-II Services covers executive and non-executive posts across the Secretariat, revenue, municipal administration, commercial taxes and labour departments. The examination is a single written stage of four papers, with document verification and post allocation on merit. There is no interview.\n\n" +
      `Notification No. ${notificationNo("601")}/${CURRENT_YEAR}, Group-II Services.\n\n` +
      "Age as on the date fixed in the notification: 18 to 44 years, with the relaxations available to SC, ST, BC, ex-servicemen and persons with benchmark disabilities under the rules.\n\n" +
      "Posts are zonal and multi-zonal under the Presidential Order, so the district you claim local candidature in decides the zone you are considered against. Read the zone table in the notification before you record your preferences.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Paper-I: General Studies and General Abilities, 150 marks.\n" +
      "2. Paper-II: History, Polity and Society of India and Telangana, 150 marks.\n" +
      "3. Paper-III: Economy and Development of India and Telangana, 150 marks.\n" +
      "4. Paper-IV: Telangana Movement and State Formation, 150 marks.\n" +
      "5. Document verification for candidates called in the ratio fixed by the Commission, then post allocation on merit and the web options recorded.",
    location: "Telangana, zonal and multi-zonal postings",
    years_of_experience: "No experience required",
    salary: "Pay Scale ₹42,300 to ₹1,15,270 (Telangana RPS 2020), plus DA and HRA",
    employment_type: "Full-time",
    industry_type: "State Government",
    department: "Multiple departments, recruited through TGPSC",
    role_category: "State Government Recruitment",
    education: "Any degree from a recognised university",
    ug_requirements:
      "A bachelor's degree in any discipline from a university recognised by the UGC. The degree must be held by the cut-off date fixed in the notification, so a final year candidate applies at their own risk.",
    pg_requirements:
      "Not required. A few non-executive posts prescribe a specific subject at degree level, listed post by post in the notification.",
    skills: [
      "General Studies",
      "Telangana Movement and State Formation",
      "Indian Polity",
      "Economy and Development",
      "Mental Ability",
    ],
    number_of_openings: seededInt("jobs:vacancies:601", 620, 840),
    status: "active",
    is_published: true,
    createdDaysAgo: 12,
    deadlineInDays: 21,
    applyLink: "https://www.tgpsc.gov.in/",
    applicablePassoutYear: null,
    courseIds: [302],
    colleges: [
      { id: 1, college_name: "Osmania University", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 2, college_name: "Kakatiya University, Warangal", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 3, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 602,
    job_title: "Assistant Engineer (Civil), Panchayat Raj Engineering Department",
    company_name: "Telangana Public Service Commission (TGPSC)",
    company_info:
      "The Commission recruits engineering cadres for the state's works departments. An Assistant Engineer in Panchayat Raj works out of a mandal or division office on rural roads, buildings, water supply works and the estimates and measurement books that go with them.",
    job_description:
      "You supervise rural works at mandal level: taking levels and quantities, preparing estimates, checking the measurement book against what was actually built, and certifying the running account bills of the agency doing the work.\n\n" +
      `Notification No. ${notificationNo("602")}/${CURRENT_YEAR}, Assistant Engineer (Civil).\n\n` +
      "Age as on the date fixed in the notification: 18 to 44 years, with the relaxations available to SC, ST, BC, ex-servicemen and persons with benchmark disabilities under the rules.\n\n" +
      "The written examination is at degree standard in civil engineering, so the preparation is technical rather than general. Candidates already working on a contract basis in the department should read the clause on service weightage before applying.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Paper-I: General Studies and General Abilities, 150 marks.\n" +
      "2. Paper-II: Civil Engineering at degree standard, 300 marks.\n" +
      "3. Document verification for candidates called in the ratio fixed by the Commission.\n" +
      "4. Final merit from the written examination alone. There is no interview for this post.",
    location: "Mandal and divisional engineering offices across Telangana",
    years_of_experience: "No experience required",
    salary: "Pay Scale ₹42,300 to ₹1,15,270 (Telangana RPS 2020), plus DA and HRA",
    employment_type: "Full-time",
    industry_type: "State Government",
    department: "Panchayat Raj and Rural Development",
    role_category: "State Government Recruitment",
    education: "B.E. or B.Tech in Civil Engineering",
    ug_requirements:
      "A degree in Civil Engineering from a recognised university, or an equivalent qualification recognised by the Government for this post.",
    pg_requirements: "Not required.",
    skills: [
      "Civil Engineering",
      "Estimation and Costing",
      "Surveying",
      "Rural Water Supply",
      "General Studies",
    ],
    number_of_openings: seededInt("jobs:vacancies:602", 120, 240),
    status: "active",
    is_published: true,
    createdDaysAgo: 20,
    deadlineInDays: 18,
    applyLink: "https://www.tgpsc.gov.in/",
    applicablePassoutYear: null,
    courseIds: [302],
    colleges: [
      { id: 4, college_name: "Osmania University", department: "Civil Engineering", batch: String(CURRENT_YEAR) },
      { id: 5, college_name: "Kakatiya University, Warangal", department: "Civil Engineering", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5003],
    minGraduationPercentage: null,
  },
  {
    id: 603,
    job_title: "Police Constable (Civil) in the Police Department",
    company_name: "Telangana Police Recruitment Board (TGLPRB)",
    company_info:
      "The recruitment board conducts the constable and sub-inspector recruitments for the police department, the special police battalions and the transport wing. It runs the written tests, the physical measurement and efficiency tests, and the medical examination.",
    job_description:
      "A civil constable works in a police station or an armed reserve unit: beat duty, law and order bandobast, summons and warrant service, and station records. Recruitment is by open competition and the physical standards are part of the selection, not a formality.\n\n" +
      `Notification No. ${notificationNo("603")}/${CURRENT_YEAR}, Police Constable (Civil) and equivalent posts.\n\n` +
      "Age as on the date fixed in the notification: 18 to 22 years, with the relaxations notified for SC, ST, BC, ex-servicemen and other eligible categories.\n\n" +
      "Start the endurance preparation before the preliminary result, not after it. The gap between the preliminary written test and the physical events is short, and candidates lose the recruitment at the events rather than at the paper.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Preliminary written test: objective, covering arithmetic, reasoning and general studies. Qualifying, and used to shortlist for the physical events.\n" +
      "2. Physical Measurement Test: height 167.6 cm for men and 152.5 cm for women, with the chest measurement and expansion prescribed for men.\n" +
      "3. Physical Efficiency Test: the running, long jump, shot put and 100 metre events, at the standards notified for each category.\n" +
      "4. Final written examination, taken by candidates who clear the physical events.\n" +
      "5. Medical examination and verification of character and antecedents.",
    location: "District police units and armed reserve battalions across Telangana",
    years_of_experience: "No experience required",
    salary: "Pay Scale ₹26,900 to ₹77,030 (Telangana RPS 2020), plus DA, HRA and uniform allowance",
    employment_type: "Full-time",
    industry_type: "State Government",
    department: "Home Department, Telangana Police",
    role_category: "State Government Recruitment",
    education: "Intermediate (10+2) or an equivalent qualification",
    ug_requirements:
      "Intermediate or its equivalent is the qualifying examination. A degree is not required and carries no additional weight for this post.",
    pg_requirements: "Not required.",
    skills: [
      "Arithmetic",
      "Reasoning",
      "General Studies",
      "Physical Efficiency",
      "Telangana Current Affairs",
    ],
    number_of_openings: seededInt("jobs:vacancies:603", 3800, 6200),
    status: "active",
    is_published: true,
    createdDaysAgo: 5,
    deadlineInDays: 26,
    applyLink: "https://www.tglprb.in/",
    applicablePassoutYear: null,
    courseIds: [305],
    colleges: [
      { id: 6, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 7, college_name: "Government Polytechnic, Warangal", department: "Any diploma", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 604,
    job_title: "Junior Mining Engineer (Trainee)",
    company_name: "Singareni Collieries Company Limited (SCCL)",
    company_info:
      "Singareni Collieries is a coal producer owned jointly by the Government of Telangana and the Government of India, working underground and opencast mines in the Godavari valley. It recruits its own technical and non-technical cadres and trains them at the company's training institutes.",
    job_description:
      "A Junior Mining Engineer works a shift at the face or on the surface under a statutory supervisor: production and support, ventilation checks, the dust and gas readings the log demands, and the shift report. The post is a statutory one, so the certificate of competency matters as much as the diploma.\n\n" +
      `Employment Notification No. ${notificationNo("604")}/${CURRENT_YEAR}, Junior Mining Engineer (Trainee).\n\n` +
      "Age as on the date fixed in the notification: 18 to 30 years, with the relaxations notified for SC, ST, BC and other eligible categories.\n\n" +
      "Selection is against the areas named in the notification and posting follows the vacancy, so a candidate from any district may be posted to Kothagudem, Ramagundam, Bhupalpally, Mandamarri or Manuguru.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Written test in mining engineering at diploma standard, with a section on general studies and arithmetic.\n" +
      "2. Verification of the diploma and of the certificate of competency issued under the Mines Act and the regulations made under it.\n" +
      "3. Medical examination for underground fitness at a company hospital, including the vision and hearing standards for statutory duty.\n" +
      "4. Appointment as a trainee, with confirmation after the training period stated in the notification.",
    location: "Kothagudem, Ramagundam, Bhupalpally, Mandamarri and Manuguru areas",
    years_of_experience: "No experience required",
    salary: "NCWA pay structure, Technical and Supervisory grade, with underground allowance and quarters",
    employment_type: "Full-time",
    industry_type: "State Public Sector Undertaking",
    department: "Underground and Opencast Mining",
    role_category: "Public Sector Recruitment",
    education: "Diploma in Mining Engineering with a valid certificate of competency",
    ug_requirements:
      "A three year Diploma in Mining Engineering from a recognised institution, with the Mining Sirdar or Overman certificate of competency and a valid gas testing certificate as prescribed for the post.",
    pg_requirements: "Not required.",
    skills: [
      "Mining Engineering",
      "Mine Safety and Statutory Rules",
      "Ventilation and Support",
      "Shift Reporting",
      "General Studies",
    ],
    number_of_openings: seededInt("jobs:vacancies:604", 90, 190),
    status: "active",
    is_published: true,
    createdDaysAgo: 16,
    deadlineInDays: 12,
    applyLink: "https://www.scclmines.com/",
    applicablePassoutYear: null,
    courseIds: [302],
    colleges: [
      { id: 8, college_name: "Government Polytechnic, Warangal", department: "Mining Engineering", batch: String(CURRENT_YEAR) },
      { id: 9, college_name: "Government Polytechnic, Warangal", department: "Civil Engineering", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5005, 5012],
    minGraduationPercentage: null,
  },
  {
    id: 605,
    job_title: "Combined Graduate Level: Assistant Section Officer, Inspector and allied posts",
    company_name: "Staff Selection Commission (SSC)",
    company_info:
      "The Staff Selection Commission recruits for Group-B and Group-C posts in the ministries, departments and subordinate offices of the Government of India. Candidates from Telangana are examined under the Southern Region, with centres at Hyderabad, Warangal, Karimnagar and Nizamabad.",
    job_description:
      "The Combined Graduate Level examination fills Assistant Section Officer posts in the ministries, Inspector and Sub-Inspector posts in the revenue and enforcement departments, and auditor, accountant and tax assistant posts in the subordinate offices. One examination, one merit list, and post allocation on the preferences you record.\n\n" +
      `Notice No. HQ-PPI-${notificationNo("605")}/${CURRENT_YEAR}, Combined Graduate Level Examination.\n\n` +
      "Age as on the date fixed in the notice: 18 to 27 years for most posts, with 18 to 30 and 20 to 30 bands for specific posts, and the relaxations notified for SC, ST, OBC, ex-servicemen and persons with benchmark disabilities.\n\n" +
      "This notice is closed. It is kept on the board because the papers, the marking scheme and the post list repeat from cycle to cycle, and because candidates preparing for the next cycle read the closed one.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Tier-I computer based examination: 100 questions, 200 marks, 60 minutes, with a penalty of 0.50 marks for each wrong answer.\n" +
      "2. Tier-II computer based examination in the papers prescribed for the post applied for, including the module on computer knowledge and the data entry speed test where the post requires it.\n" +
      "3. Document verification, and a medical examination for the posts that prescribe one.\n" +
      "4. Post allocation on merit and on the preferences recorded in the application.",
    location: "Posts across India, with Hyderabad and Secunderabad among the allocations",
    years_of_experience: "No experience required",
    salary: "Pay Level-7, ₹44,900 to ₹1,42,400, with the other posts from Level-4 to Level-8",
    employment_type: "Full-time",
    industry_type: "Central Government",
    department: "Ministries and subordinate offices, Government of India",
    role_category: "Central Government Recruitment",
    education: "Any degree from a recognised university",
    ug_requirements:
      "A bachelor's degree in any discipline. Junior Statistical Officer requires Statistics at 10+2 or degree level, and Assistant Audit Officer requires the additional qualification listed against that post.",
    pg_requirements: "Not required.",
    skills: [
      "Quantitative Aptitude",
      "General Intelligence and Reasoning",
      "English Comprehension",
      "General Awareness",
      "Computer Knowledge",
    ],
    number_of_openings: seededInt("jobs:vacancies:605", 11000, 17000),
    status: "closed",
    is_published: true,
    createdDaysAgo: 46,
    deadlineInDays: -6,
    applyLink: "https://ssc.gov.in/",
    applicablePassoutYear: null,
    courseIds: [303],
    colleges: [
      { id: 10, college_name: "Osmania University", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 11, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 606,
    job_title: "NTPC Graduate Level: Station Master, Goods Train Manager and Senior Clerk cum Typist",
    company_name: "Railway Recruitment Board, Secunderabad",
    company_info:
      "The Railway Recruitment Board at Secunderabad conducts recruitment for South Central Railway and the other railway units in its jurisdiction, from the computer based tests through the skill tests to document verification and the medical examination.",
    job_description:
      "Non-Technical Popular Categories at graduate level covers the operating and commercial cadres: Station Master, Goods Train Manager, Senior Clerk cum Typist and Junior Account Assistant cum Typist. Work is round the clock at stations and control offices, and the medical standard for the operating posts is strict on vision.\n\n" +
      `Centralised Employment Notice No. ${notificationNo("606")}/${CURRENT_YEAR}, NTPC Graduate Level.\n\n` +
      "Age as on the date fixed in the notice: 18 to 33 years, with the relaxations notified for SC, ST, OBC, ex-servicemen and persons with benchmark disabilities.\n\n" +
      "Candidates who apply for Station Master take an aptitude test after the second stage, and the clerical posts take a typing skill test instead. Both are qualifying, so prepare for the one your post requires.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. CBT-1: 100 questions, 100 marks, 90 minutes, common to all graduate level posts and used to shortlist for the next stage.\n" +
      "2. CBT-2: 120 questions, 120 marks, 90 minutes, at the standard of the post applied for.\n" +
      "3. Computer Based Aptitude Test for Station Master, or a Typing Skill Test on a personal computer for the clerical posts.\n" +
      "4. Document verification and a medical examination in the category prescribed for the post.",
    location: "South Central Railway divisions, including Secunderabad, Hyderabad and Nanded",
    years_of_experience: "No experience required",
    salary: "Level-6, ₹35,400 to ₹1,12,400 for Station Master, Level-5, ₹29,200 to ₹92,300 for the rest",
    employment_type: "Full-time",
    industry_type: "Central Government",
    department: "Operating and Commercial, Indian Railways",
    role_category: "Central Government Recruitment",
    education: "Any degree from a recognised university",
    ug_requirements:
      "A bachelor's degree in any discipline. The clerical posts additionally require typing proficiency in English or Hindi on a personal computer, tested at the skill test stage.",
    pg_requirements: "Not required.",
    skills: [
      "General Awareness",
      "Mathematics",
      "General Intelligence and Reasoning",
      "Typing",
      "Railway Operations",
    ],
    number_of_openings: seededInt("jobs:vacancies:606", 2400, 4300),
    status: "active",
    is_published: true,
    createdDaysAgo: 8,
    deadlineInDays: 30,
    applyLink: "https://rrbsecunderabad.gov.in/",
    applicablePassoutYear: null,
    courseIds: [304],
    colleges: [
      { id: 12, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 13, college_name: "Kakatiya University, Warangal", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 607,
    job_title: "Probationary Officer and Management Trainee (CRP PO/MT)",
    company_name: "Institute of Banking Personnel Selection (IBPS)",
    company_info:
      "IBPS conducts the common recruitment process for the participating public sector banks. A candidate who clears the process is provisionally allotted to one of those banks, on merit and on the preferences recorded in the application.",
    job_description:
      "A Probationary Officer joins on probation and is put through branch banking first: account opening and KYC, cash and clearing, retail and MSME loan appraisal, and the branch's own recovery and audit follow-up. Posting is anywhere in India, and the bank you are allotted to is decided by the merit list, not by choice alone.\n\n" +
      `Common Recruitment Process Advertisement No. ${notificationNo("607")}/${CURRENT_YEAR}, CRP PO/MT.\n\n` +
      "Age as on the date fixed in the advertisement: 20 to 30 years, with the relaxations notified for SC, ST, OBC, persons with benchmark disabilities and ex-servicemen.\n\n" +
      "The preliminary paper is sectionally timed, so speed in a weak section cannot be borrowed from a strong one. Candidates who prepare only the total marks and not the sections lose the paper here.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Preliminary examination: 100 marks in 60 minutes, with sectional timing of 20 minutes each for English Language, Quantitative Aptitude and Reasoning Ability. Qualifying only.\n" +
      "2. Main examination: objective papers of 200 marks, with a descriptive paper of 25 marks in 30 minutes for letter and essay writing.\n" +
      "3. Interview of 100 marks, conducted by the participating banks and coordinated by the nodal bank in the state.\n" +
      "4. Final merit in the ratio of 80 for the main examination and 20 for the interview, followed by provisional allotment.",
    location: "Participating public sector banks, with allotment across India",
    years_of_experience: "No experience required",
    salary: "Junior Management Grade Scale-I, basic pay ₹48,480 in the scale ₹48,480 to ₹85,920, plus DA and HRA",
    employment_type: "Full-time",
    industry_type: "Banking and Financial Services",
    department: "General Banking",
    role_category: "Banking Recruitment",
    education: "Any degree from a recognised university",
    ug_requirements:
      "A bachelor's degree in any discipline from a university recognised by the UGC, held on the date stated in the advertisement. Computer literacy is required and is verified at the time of joining.",
    pg_requirements: "Not required.",
    skills: [
      "Quantitative Aptitude",
      "Reasoning Ability",
      "English Language",
      "Banking Awareness",
      "Data Interpretation",
    ],
    number_of_openings: seededInt("jobs:vacancies:607", 2800, 5200),
    status: "active",
    is_published: true,
    createdDaysAgo: 3,
    deadlineInDays: 16,
    applyLink: "https://www.ibps.in/",
    applicablePassoutYear: null,
    courseIds: [307, 310],
    colleges: [
      { id: 14, college_name: "Osmania University", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 15, college_name: "Kakatiya University, Warangal", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 608,
    job_title: "Junior Associate (Customer Support and Sales), Hyderabad Circle",
    company_name: "State Bank of India",
    company_info:
      "State Bank of India recruits Junior Associates circle by circle. The Hyderabad Circle covers Telangana, and a candidate applies against the vacancies of one circle only, whose local language they must be able to read, write and speak.",
    job_description:
      "A Junior Associate is the branch's counter: cash receipt and payment, passbook and cheque work, account opening, government scheme enrolments and the day's balancing. It is the post that meets the customer, so language and patience matter as much as speed.\n\n" +
      `Advertisement No. CRPD/CR/${CURRENT_YEAR}-${notificationNo("608")}, Junior Associate (Customer Support and Sales).\n\n` +
      "Age as on the date fixed in the advertisement: 20 to 28 years, with the relaxations notified for SC, ST, OBC, persons with benchmark disabilities and ex-servicemen.\n\n" +
      "A candidate who did not study Telugu at 10th standard takes a test of the local language after selection. Failing it means the offer does not stand, so do not apply to a circle whose language you cannot use at a counter.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Preliminary examination: 100 questions, 100 marks, 60 minutes, with sectional timing for English Language, Numerical Ability and Reasoning Ability.\n" +
      "2. Main examination: 190 questions, 200 marks, 2 hours 40 minutes, covering General and Financial Awareness, General English, Quantitative Aptitude, and Reasoning Ability with Computer Aptitude.\n" +
      "3. Test of the specified local language for candidates who did not study it at 10th standard.\n" +
      "4. Provisional allotment to a branch within the circle, subject to medical fitness and verification.",
    location: "Branches across Telangana, SBI Hyderabad Circle",
    years_of_experience: "No experience required",
    salary: "Clerical cadre scale ₹24,050 to ₹64,480, plus DA, HRA and other allowances",
    employment_type: "Full-time",
    industry_type: "Banking and Financial Services",
    department: "Branch Banking",
    role_category: "Banking Recruitment",
    education: "Any degree from a recognised university",
    ug_requirements:
      "A bachelor's degree in any discipline from a recognised university, held by the date stated in the advertisement. Integrated dual degree holders apply on the date of the final degree.",
    pg_requirements: "Not required.",
    skills: [
      "Numerical Ability",
      "Reasoning Ability",
      "English Language",
      "General and Financial Awareness",
      "Computer Aptitude",
    ],
    number_of_openings: seededInt("jobs:vacancies:608", 900, 1700),
    status: "active",
    is_published: true,
    createdDaysAgo: 25,
    deadlineInDays: 9,
    applyLink: "https://sbi.co.in/web/careers",
    applicablePassoutYear: null,
    courseIds: [308, 310],
    colleges: [
      { id: 16, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
      { id: 17, college_name: "Osmania University", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5002, 5004, 5009],
    minGraduationPercentage: null,
  },
  {
    id: 609,
    job_title: "Officer in Grade-B (Direct Recruitment), General",
    company_name: "Reserve Bank of India",
    company_info:
      "The Reserve Bank recruits officers in Grade-B through a three phase examination. Officers work on regulation and supervision, monetary policy operations, currency management and financial inclusion, at the central office and at the regional offices, including Hyderabad.",
    job_description:
      "Grade-B is the Bank's entry level officer cadre and the written stage is a reading examination rather than a speed examination: Economic and Social Issues, an English paper marked on writing, and Finance and Management. The interview carries real weight in the final merit.\n\n" +
      `Advertisement No. ${notificationNo("609")}A/${CURRENT_YEAR}-${(CURRENT_YEAR + 1) % 100}, Officer in Grade-B (DR), General.\n\n` +
      "Age as on the date fixed in the advertisement: 21 to 30 years, with the relaxations notified for SC, ST, OBC, persons with benchmark disabilities and candidates with the prescribed experience.\n\n" +
      "Phase-II is answered partly by typing, so practise writing full answers on a keyboard against the clock. Candidates who have only written by hand lose marks to the format, not to the syllabus.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. Phase-I: objective examination of 200 marks in 120 minutes, qualifying for Phase-II.\n" +
      "2. Phase-II: three papers, Economic and Social Issues, English writing skills, and Finance and Management.\n" +
      "3. Interview of 75 marks, which a candidate may take in Hindi or in English.\n" +
      "4. Final merit from the aggregate of Phase-II and the interview.",
    location: "Reserve Bank offices across India, including the Hyderabad regional office",
    years_of_experience: "No experience required",
    salary: "Basic pay ₹55,200 per month in the scale ₹55,200 to ₹99,750, plus allowances as applicable",
    employment_type: "Full-time",
    industry_type: "Banking and Financial Services",
    department: "Regulation, Supervision and Monetary Policy",
    role_category: "Banking Recruitment",
    education: "A bachelor's degree with a minimum of 60% marks in the aggregate",
    ug_requirements:
      "A bachelor's degree in any discipline with a minimum of 60% marks in the aggregate, relaxed to 50% for SC, ST and persons with benchmark disabilities. A master's degree carries the same percentage requirement where it is offered as the qualifying degree.",
    pg_requirements:
      "Not required for the General stream. The specialised streams prescribe their own postgraduate qualification.",
    skills: [
      "Economic and Social Issues",
      "Finance and Management",
      "English Writing Skills",
      "General Awareness",
      "Quantitative Aptitude",
    ],
    number_of_openings: seededInt("jobs:vacancies:609", 90, 200),
    status: "active",
    is_published: true,
    createdDaysAgo: 30,
    deadlineInDays: 24,
    applyLink: "https://www.rbi.org.in/",
    applicablePassoutYear: null,
    courseIds: [309, 310],
    colleges: [
      { id: 18, college_name: "Osmania University", department: "Economics", batch: String(CURRENT_YEAR) },
      { id: 19, college_name: "Kakatiya University, Warangal", department: "Commerce", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5003, 5004],
    minGraduationPercentage: 60,
  },
  {
    id: 610,
    job_title: "Engineer Trainee (Mechanical and Electrical) through GATE",
    company_name: "Bharat Heavy Electricals Limited (BHEL), Hyderabad",
    company_info:
      "The BHEL unit at Ramachandrapuram, Hyderabad, manufactures compressors, pumps, turbines, heat exchangers and oil field equipment. Engineer Trainees are selected on the GATE score of the year named in the advertisement, followed by an interview at the unit.",
    job_description:
      "An Engineer Trainee joins the shop floor and the design and planning offices in turn: process planning, quality, maintenance and project execution, with a structured training period before confirmation. The unit builds to order, so the work is closer to heavy engineering than to volume manufacturing.\n\n" +
      `Advertisement No. ${notificationNo("610")}/${CURRENT_YEAR}, Engineer Trainee through GATE.\n\n` +
      "Age as on the date fixed in the advertisement: up to 28 years for the unreserved category, with the relaxations notified for SC, ST, OBC and persons with benchmark disabilities.\n\n" +
      "Only the GATE paper named in the advertisement counts, and the score of that year only. A score from an earlier year is not carried forward however high it is.\n\n" +
      DEMO_FIGURES_NOTE,
    role_process:
      "1. A valid GATE score in the paper and the year stated in the advertisement.\n" +
      "2. Shortlisting on the GATE score, by discipline and category, in the ratio the advertisement fixes.\n" +
      "3. Personal interview at the unit.\n" +
      "4. Final merit from the GATE score and the interview in the weightage stated in the advertisement, followed by a medical examination.",
    location: "Ramachandrapuram, Hyderabad",
    years_of_experience: "No experience required",
    salary: "E-2 grade, pay scale ₹40,000 to ₹1,40,000, on the industrial dearness allowance pattern",
    employment_type: "Full-time",
    industry_type: "Central Public Sector Undertaking",
    department: "Manufacturing and Engineering",
    role_category: "Public Sector Recruitment",
    education: "B.E. or B.Tech in Mechanical or Electrical Engineering with at least 60% marks",
    ug_requirements:
      "A full time degree in Mechanical or Electrical Engineering from a recognised university, with a minimum of 60% marks in the aggregate, relaxed to a pass class for SC, ST and persons with benchmark disabilities.",
    pg_requirements: "Not required, and a postgraduate qualification carries no additional weight.",
    skills: [
      "GATE",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Engineering Mathematics",
      "Manufacturing Processes",
    ],
    number_of_openings: seededInt("jobs:vacancies:610", 60, 150),
    status: "active",
    is_published: true,
    createdDaysAgo: 10,
    deadlineInDays: 34,
    applyLink: "https://www.bhel.com/career",
    applicablePassoutYear: null,
    courseIds: [306],
    colleges: [
      { id: 20, college_name: "Osmania University", department: "Mechanical Engineering", batch: String(CURRENT_YEAR) },
      { id: 21, college_name: "Kakatiya University, Warangal", department: "Electrical Engineering", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5001, 5003, 5008],
    minGraduationPercentage: 60,
  },
  {
    id: 611,
    job_title: "Rooftop Solar Installation Technician",
    company_name: "Suryatej Renewables Private Limited",
    company_info:
      "Suryatej Renewables is an EPC contractor empanelled with the discom for rooftop solar work in the northern districts. It installs and maintains systems for households, schools and small industrial units, and takes a batch of trainees from the skill centres every quarter.",
    job_description:
      "You install rooftop photovoltaic systems for households and small units in and around Warangal: mounting structure, module strings, DC and AC cabling, inverter, earthing and the meter connection, then commissioning with the discom's inspection.\n\n" +
      "Work is field based across Warangal, Hanamkonda and Jangaon, with a vehicle for the team and two to three sites a week. Safety training for work at height is given in the first week and is compulsory before you go on a roof.\n\n" +
      "A technician who can also read a string design and check the open circuit voltage against the inverter window moves to the commissioning team in the second year, which pays better and travels less.\n\n" +
      DEMO_OPENING_NOTE,
    role_process:
      "1. Application through the skill centre placement cell.\n" +
      "2. Trade test at the centre: terminate a DC cable, wire a small string, and read an inverter display and fault code.\n" +
      "3. Interview with the site supervisor, covering safety at height and the tools you have used.\n" +
      "4. Medical fitness for work at height, then a two week induction before you are put on a site.",
    location: "Warangal, Hanamkonda and Jangaon districts",
    years_of_experience: "0 to 2 years",
    salary: "₹18,000 to ₹24,000 per month, with a site allowance, ESI and EPF",
    employment_type: "Full-time",
    industry_type: "Renewable Energy",
    department: "Installation and Commissioning",
    role_category: "Skilled Trade",
    education: "ITI in Electrician, Wireman or Solar Technician, or a Solar PV Installer certificate",
    ug_requirements:
      "Not required. A 10th standard pass with an ITI or skill centre certificate in the relevant trade is enough for this post.",
    pg_requirements: "Not required.",
    skills: [
      "Solar PV Installation",
      "DC and AC Wiring",
      "Module Mounting",
      "Earthing and Lightning Protection",
      "Inverter Commissioning",
    ],
    number_of_openings: seededInt("jobs:vacancies:611", 10, 26),
    status: "active",
    is_published: true,
    createdDaysAgo: 6,
    deadlineInDays: 11,
    applyLink: "",
    applicablePassoutYear: String(CURRENT_YEAR),
    courseIds: [311, 312],
    colleges: [
      { id: 22, college_name: "TSEM Skill Centre, Warangal", department: "Solar PV Installer", batch: String(CURRENT_YEAR) },
      { id: 23, college_name: "Government Polytechnic, Warangal", department: "Electrical Engineering", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5005, 5006, 5007, 5008],
    minGraduationPercentage: null,
  },
  {
    id: 612,
    job_title: "Sewing Machine Operator (Single Needle and Overlock)",
    company_name: "Kakatiya Apparels Private Limited",
    company_info:
      "Kakatiya Apparels runs a knitwear unit in the apparel park at Warangal, stitching for domestic brands. The unit works two shifts and takes trained operators from the tailoring batches at the district skill centres.",
    job_description:
      "You work a single needle lock stitch or overlock machine on a line producing knitwear. Output is counted against an hourly target set for the style, and the line supervisor checks the first piece of every bundle before the bundle runs.\n\n" +
      "Trainees join on the day shift for the first month with a stipend, and move to the monthly wage with a piece rate incentive once they hold the target. Transport is provided on the Warangal and Hanamkonda routes.\n\n" +
      "Intake is on hold until the next order cycle. Applications received now are held for the following batch rather than rejected, so a trainee finishing this quarter should still apply.\n\n" +
      DEMO_OPENING_NOTE,
    role_process:
      "1. Application through the skill centre placement cell.\n" +
      "2. Machine test at the unit: a set number of seams on a single needle machine and on an overlock machine, judged on stitch quality and time.\n" +
      "3. Interview with the production supervisor.\n" +
      "4. One month on the training line before you are placed on a production line.",
    location: "Apparel park, Warangal",
    years_of_experience: "Freshers with a trade certificate",
    salary: "₹12,000 to ₹16,000 per month, with a piece rate incentive, ESI and EPF",
    employment_type: "Full-time",
    industry_type: "Textiles and Apparel",
    department: "Production",
    role_category: "Skilled Trade",
    education: "10th standard pass, with a tailoring or sewing machine operator certificate",
    ug_requirements: "Not required. The trade certificate and the machine test decide the selection.",
    pg_requirements: "Not required.",
    skills: [
      "Single Needle Lock Stitch",
      "Overlock",
      "Fabric Handling",
      "Quality Checking",
      "Line Production",
    ],
    number_of_openings: seededInt("jobs:vacancies:612", 25, 60),
    status: "on_hold",
    is_published: true,
    createdDaysAgo: 22,
    deadlineInDays: 20,
    applyLink: "",
    applicablePassoutYear: String(CURRENT_YEAR),
    courseIds: [313],
    colleges: [
      { id: 24, college_name: "TSEM Skill Centre, Warangal", department: "Tailoring and Garment Making", batch: String(CURRENT_YEAR) },
      { id: 25, college_name: "TSEM Skill Centre, Khammam", department: "Tailoring and Garment Making", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5007, 5008, 5012],
    minGraduationPercentage: null,
  },
  {
    id: 613,
    job_title: "Mobile Phone Repair Technician",
    company_name: "Deccan Mobile Care Services",
    company_info:
      "Deccan Mobile Care is a service franchise running authorised repair counters at Nizamabad, Kamareddy and Nirmal. It handles walk-in repairs for several handset brands and carries the spares, tools and anti static bench each counter needs.",
    job_description:
      "You take walk-in repairs at a service counter: fault diagnosis, display and battery replacement, charging port and connector work, software flashing, and water damage recovery. Every job is logged with a job sheet, a warranty status and a turnaround commitment.\n\n" +
      "The counter deals with the customer directly, so you explain the fault and the cost in plain language before the work starts and you do not open a handset before the estimate is accepted.\n\n" +
      "Board level work is taught on the job to technicians who are steady with a soldering station. Tools, spares and the bench are provided, and you are accountable for the spares issued against your job sheets.\n\n" +
      DEMO_OPENING_NOTE,
    role_process:
      "1. Application through the skill centre placement cell or directly at a counter.\n" +
      "2. Practical test: diagnose a dead handset, replace a display assembly, and flash a device to a given firmware.\n" +
      "3. Interview with the counter in charge on customer handling and on how you would explain a chargeable repair.\n" +
      "4. Two weeks alongside a senior technician before you take your own job sheets.",
    location: "Nizamabad, Kamareddy and Nirmal",
    years_of_experience: "0 to 2 years",
    salary: "₹14,000 to ₹19,000 per month, with an incentive on chargeable repairs",
    employment_type: "Full-time",
    industry_type: "Consumer Electronics Services",
    department: "Service Counter",
    role_category: "Skilled Trade",
    education: "ITI or a certificate course in mobile phone repair or consumer electronics",
    ug_requirements: "Not required. The practical test decides the selection.",
    pg_requirements: "Not required.",
    skills: [
      "Fault Diagnosis",
      "Display and Battery Replacement",
      "Board Level Repair",
      "Software Flashing",
      "Customer Handling",
    ],
    number_of_openings: seededInt("jobs:vacancies:613", 6, 16),
    status: "active",
    is_published: true,
    createdDaysAgo: 14,
    deadlineInDays: 7,
    applyLink: "",
    applicablePassoutYear: String(CURRENT_YEAR),
    courseIds: [314],
    colleges: [
      { id: 26, college_name: "ITI Nizamabad", department: "Electronics Mechanic", batch: String(CURRENT_YEAR) },
      { id: 27, college_name: "TSEM Skill Centre, Khammam", department: "Mobile Repair", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5005, 5007, 5008, 5010],
    minGraduationPercentage: null,
  },
  {
    id: 614,
    job_title: "Procurement Assistant (Millets and Pulses)",
    company_name: "Palamuru Millet Producer Company Limited",
    company_info:
      "The producer company is owned by about 1,200 smallholder members across Wanaparthy and Mahbubnagar. It aggregates millets, red gram and groundnut from its members, cleans and grades them at the village collection centres, and sells to processors and to institutional buyers.",
    job_description:
      "You run procurement at a village collection centre through the season: weighing, moisture testing, grading against the buyer's specification, issuing the purchase slip to the member, and recording every lot in the stock register and in the accounting software the same day.\n\n" +
      "Outside the season you work with the board on member registration, input supply, and the paperwork for licences, statutory returns and the annual audit.\n\n" +
      "The post suits someone from a farming household who can read a weighbridge slip, hold a grading standard under pressure from a seller, and talk to members in their own village. Appointment is for one year and is renewed on performance.\n\n" +
      DEMO_OPENING_NOTE,
    role_process:
      "1. Application to the chief executive of the producer company through the skill centre or directly.\n" +
      "2. A written exercise: compute the payable amount for a lot after a moisture deduction, and record it in a stock register format.\n" +
      "3. Interview with the chief executive and a director from the board.\n" +
      "4. Reference check in the village and a field day at a collection centre before the appointment is confirmed.",
    location: "Wanaparthy and Mahbubnagar districts",
    years_of_experience: "0 to 3 years",
    salary: "₹15,000 to ₹20,000 per month, with a seasonal incentive on volume procured",
    employment_type: "Contract",
    industry_type: "Agriculture and Allied",
    department: "Procurement and Operations",
    role_category: "Agri Business",
    education: "A degree or diploma in agriculture, commerce or any discipline, with basic computer skills",
    ug_requirements:
      "Any degree or a three year diploma. A background in agriculture, agri business or commerce helps, and so does having worked a season at a market yard or a collection centre.",
    pg_requirements: "Not required.",
    skills: [
      "Procurement",
      "Grading and Moisture Testing",
      "Stock and Weighment Records",
      "Member Relations",
      "Spreadsheet and Tally Entry",
    ],
    number_of_openings: seededInt("jobs:vacancies:614", 3, 9),
    status: "active",
    is_published: true,
    createdDaysAgo: 9,
    deadlineInDays: 28,
    applyLink: "",
    applicablePassoutYear: String(CURRENT_YEAR),
    courseIds: [318, 317],
    colleges: [
      { id: 28, college_name: "TSEM Skill Centre, Khammam", department: "Agri Business", batch: String(CURRENT_YEAR) },
      { id: 29, college_name: "Government Degree College, Siddipet", department: "Commerce", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5002, 5006, 5008, 5010],
    minGraduationPercentage: null,
  },
  {
    id: 615,
    job_title: "Common Service Centre Operator (Digital Seva Counter)",
    company_name: "Sri Sai Digital Seva Kendra, Siddipet",
    company_info:
      "The kendra is a village level entrepreneur's own centre, running the Digital Seva counter for Siddipet town and the mandals around it. It is hiring a second operator so the counter can stay open through the day and on scheme deadline days.",
    job_description:
      "You run the service counter: certificate and scheme applications, pension enrolment, land record extracts, Aadhaar linked cash withdrawals, bill payments, ticketing and printing. Every transaction is completed on the portal with the citizen present, and a receipt is issued for the service charge collected.\n\n" +
      "The counter is busiest on the last days of a scheme window, so you manage a queue, check the documents before an application is submitted rather than after it is rejected, and keep the day book and the cash reconciliation clean.\n\n" +
      "You are trusted with a citizen's documents all day. Anything scanned at the counter is used for that application and for nothing else, and the operator who cannot hold that line is not kept.\n\n" +
      DEMO_OPENING_NOTE,
    role_process:
      "1. Application through the skill centre placement cell or in person at the kendra.\n" +
      "2. Practical test at the counter: complete a mock application on the portal, scan and upload the documents, and issue a receipt.\n" +
      "3. A typing check in English and in Telugu.\n" +
      "4. Interview with the centre operator, followed by a fortnight of supervised counter work.",
    location: "Siddipet town and the surrounding mandals",
    years_of_experience: "Freshers welcome",
    salary: "₹11,000 to ₹15,000 per month, with a share of the service charges collected",
    employment_type: "Full-time",
    industry_type: "Citizen Services",
    department: "Service Counter",
    role_category: "Citizen Services",
    education: "Intermediate (10+2) pass, with a computer certificate or a digital literacy course",
    ug_requirements:
      "Not required. Intermediate with a computer course is enough, and a candidate who has worked at any service counter is preferred.",
    pg_requirements: "Not required.",
    skills: [
      "Digital Seva Portal",
      "Data Entry in Telugu and English",
      "Document Verification",
      "Cash Handling",
      "Citizen Service",
    ],
    number_of_openings: seededInt("jobs:vacancies:615", 2, 6),
    status: "active",
    is_published: true,
    createdDaysAgo: 18,
    deadlineInDays: 15,
    applyLink: "",
    applicablePassoutYear: String(CURRENT_YEAR),
    courseIds: [315, 319],
    colleges: [
      { id: 30, college_name: "TSEM Skill Centre, Khammam", department: "Digital Literacy", batch: String(CURRENT_YEAR) },
      { id: 31, college_name: "Government Degree College, Siddipet", department: "Any degree", batch: String(CURRENT_YEAR) },
    ],
    questionIds: [5002, 5007, 5008, 5011],
    minGraduationPercentage: null,
  },
];

function seedToRecord(seed: JobSeed): JobRecord {
  return {
    id: seed.id,
    job_title: seed.job_title,
    company_name: seed.company_name,
    company_logo: companyLogoFor(seed.company_name),
    company_info: seed.company_info,
    job_description: seed.job_description,
    role_process: seed.role_process,
    mandatory_skills: seed.skills.slice(0, 2),
    key_skills: seed.skills,
    industry_type: seed.industry_type,
    department: seed.department,
    employment_type: seed.employment_type,
    role_category: seed.role_category,
    education: seed.education,
    ug_requirements: seed.ug_requirements,
    pg_requirements: seed.pg_requirements,
    location: seed.location,
    years_of_experience: seed.years_of_experience,
    salary: seed.salary,
    apply_link: seed.applyLink,
    job_type: seed.employment_type,
    status: seed.status,
    application_deadline:
      seed.deadlineInDays >= 0
        ? ymdDaysAhead(seed.deadlineInDays)
        : ymdDaysAgo(Math.abs(seed.deadlineInDays)),
    number_of_openings: seed.number_of_openings,
    applicable_passout_year: seed.applicablePassoutYear,
    // Left null on purpose rather than derived from the degree percentage. No
    // notification on this board prescribes a 10th or 12th aggregate, and a
    // number printed under "Min 10th %" is read as an eligibility rule by the
    // programme officer checking the posting.
    min_10th_percentage: null,
    min_12th_percentage: null,
    min_graduation_percentage: seed.minGraduationPercentage,
    tags: seed.skills.slice(0, 3),
    created_at: isoDaysAgo(seed.createdDaysAgo, 11, 30),
    is_published: seed.is_published,
    favorites_count: seededInt(`jobs:fav:${seed.id}`, 12, 64),
    course_ids: seed.courseIds,
    adaptive_course_ids: seed.courseIds,
    college_mappings: seed.colleges,
    assigned_student_ids: [],
    question_ids: seed.questionIds,
  };
}

const CREATED_KEY = "jobs:created";
const PATCHES_KEY = "jobs:patches";
const DELETED_KEY = "jobs:deleted";

/**
 * JD uploads, held in memory rather than the overlay.
 *
 * `uploadJobJd` hands us a File. The only URL that renders it with no network is
 * an object URL, and those die with the page, so persisting one would leave a
 * "View JD" button pointing at a revoked blob after a reload. A link that is
 * absent is honest; a link that 404s is not.
 */
const jdUploads = new Map<number, string>();

/** Every posting: seed, minus deletions, plus creations, with edits applied. */
export function allJobs(): JobRecord[] {
  const deleted = new Set(overlay.get<number[]>(DELETED_KEY, []));
  const patches = overlay.get<Record<string, Partial<JobRecord>>>(PATCHES_KEY, {});
  const created = overlay.get<JobRecord[]>(CREATED_KEY, []);

  return [...created, ...SEED_JOBS.map(seedToRecord)]
    .filter((job) => !deleted.has(job.id))
    .map((job) => {
      const jd = jdUploads.get(job.id);
      return { ...job, ...(patches[String(job.id)] ?? {}), ...(jd ? { jd_file_url: jd } : {}) };
    });
}

export function jobById(id: number): JobRecord | undefined {
  return allJobs().find((job) => job.id === id);
}

/** Fields a create or update may set. Anything else is ignored. */
export interface JobWritePayload {
  job_title?: string;
  company_name?: string;
  company_logo?: string;
  company_info?: string;
  job_description?: string;
  role_process?: string;
  mandatory_skills?: string[];
  key_skills?: string[];
  industry_type?: string;
  department?: string;
  employment_type?: string;
  role_category?: string;
  education?: string;
  ug_requirements?: string;
  pg_requirements?: string;
  location?: string;
  years_of_experience?: string;
  salary?: string;
  apply_link?: string;
  job_type?: string;
  is_published?: boolean;
  status?: JobStatus;
  application_deadline?: string | null;
  number_of_openings?: number | null;
  applicable_passout_year?: string | number | null;
  min_10th_percentage?: number | null;
  min_12th_percentage?: number | null;
  min_graduation_percentage?: number | null;
  college_mappings?: CollegeMapping[];
  course_ids?: number[];
  adaptive_course_ids?: number[];
  assigned_student_ids?: number[];
  question_ids?: number[];
}

/**
 * Narrow the form payload onto the record.
 *
 * Every field is optional and only copied when present, because the edit form
 * PUTs a partial: writing `undefined` over a seeded value blanked the company
 * description the moment anyone changed the job status from the list page.
 */
function applyWrite(base: JobRecord, payload: JobWritePayload): JobRecord {
  const next: JobRecord = { ...base };
  const put = <K extends keyof JobRecord>(key: K, value: JobRecord[K] | undefined) => {
    if (value !== undefined) next[key] = value;
  };

  put("job_title", payload.job_title);
  put("company_name", payload.company_name);
  put("company_info", payload.company_info);
  put("job_description", payload.job_description);
  put("role_process", payload.role_process);
  put("mandatory_skills", payload.mandatory_skills);
  put("key_skills", payload.key_skills);
  put("industry_type", payload.industry_type);
  put("department", payload.department);
  put("employment_type", payload.employment_type);
  put("role_category", payload.role_category);
  put("education", payload.education);
  put("ug_requirements", payload.ug_requirements);
  put("pg_requirements", payload.pg_requirements);
  put("location", payload.location);
  put("years_of_experience", payload.years_of_experience);
  put("salary", payload.salary);
  put("apply_link", payload.apply_link);
  put("job_type", payload.job_type);
  put("status", payload.status);
  put("is_published", payload.is_published);
  // Passed through raw, null included: clearing the openings field is a real
  // edit, so a null must overwrite rather than be treated as "unchanged".
  put("number_of_openings", payload.number_of_openings);
  put("min_10th_percentage", payload.min_10th_percentage);
  put("min_12th_percentage", payload.min_12th_percentage);
  put("min_graduation_percentage", payload.min_graduation_percentage);
  put("college_mappings", payload.college_mappings);
  put("course_ids", payload.course_ids);
  put("adaptive_course_ids", payload.adaptive_course_ids);
  put("assigned_student_ids", payload.assigned_student_ids);
  put("question_ids", payload.question_ids);

  // The logo field is required by the form but a visitor may paste anything;
  // fall back to the generated mark so a card never renders a broken image.
  const logo = payload.company_logo?.trim();
  next.company_logo = logo && /^(https?:|data:|\/)/.test(logo)
    ? logo
    : companyLogoFor(next.company_name);

  if (payload.application_deadline !== undefined) {
    const raw = payload.application_deadline;
    next.application_deadline = raw ? String(raw).slice(0, 10) : null;
  }
  if (payload.applicable_passout_year !== undefined) {
    const year = payload.applicable_passout_year;
    next.applicable_passout_year = year == null || String(year).trim() === "" ? null : String(year);
  }
  if (payload.key_skills !== undefined && payload.mandatory_skills === undefined) {
    next.mandatory_skills = (payload.key_skills ?? []).slice(0, 2);
  }
  next.tags = (next.key_skills ?? []).slice(0, 3);
  return next;
}

export function createJob(payload: JobWritePayload): JobRecord {
  const blank: JobRecord = {
    id: nextDemoId("job"),
    job_title: "Untitled role",
    company_name: "Company",
    company_logo: "",
    company_info: "",
    job_description: "",
    role_process: "",
    mandatory_skills: [],
    key_skills: [],
    industry_type: "",
    department: "",
    employment_type: "Full-time",
    role_category: "",
    education: "",
    ug_requirements: "",
    pg_requirements: "",
    location: "",
    years_of_experience: "",
    salary: "",
    apply_link: "",
    job_type: "Full-time",
    status: "active",
    application_deadline: null,
    number_of_openings: null,
    applicable_passout_year: null,
    min_10th_percentage: null,
    min_12th_percentage: null,
    min_graduation_percentage: null,
    tags: [],
    created_at: iso(new Date(nowMs())),
    is_published: false,
    favorites_count: 0,
    course_ids: [],
    adaptive_course_ids: [],
    college_mappings: [],
    assigned_student_ids: [],
    question_ids: [],
  };
  const job = applyWrite(blank, payload);
  overlay.unshift(CREATED_KEY, job);
  return job;
}

export function updateJob(id: number, payload: JobWritePayload): JobRecord | undefined {
  const current = jobById(id);
  if (!current) return undefined;
  const next = applyWrite(current, payload);

  // A posting the visitor created lives in its own list; patching it there keeps
  // one copy of the truth instead of a create plus a patch that can disagree.
  const created = overlay.get<JobRecord[]>(CREATED_KEY, []);
  if (created.some((job) => job.id === id)) {
    overlay.set(
      CREATED_KEY,
      created.map((job) => (job.id === id ? next : job)),
    );
    return next;
  }

  // Store only what actually changed. Writing the whole record would freeze
  // `created_at` into the overlay, and a seeded date that stops moving is how a
  // demo starts rotting: three weeks later the job was "posted" in the past.
  const diff: Record<string, unknown> = {};
  for (const key of Object.keys(next) as Array<keyof JobRecord>) {
    if (JSON.stringify(next[key]) !== JSON.stringify(current[key])) diff[key] = next[key];
  }
  overlay.update<Record<string, Partial<JobRecord>>>(PATCHES_KEY, {}, (patches) => ({
    ...patches,
    [String(id)]: { ...(patches[String(id)] ?? {}), ...(diff as Partial<JobRecord>) },
  }));
  return next;
}

export function deleteJob(id: number): boolean {
  if (!jobById(id)) return false;
  overlay.set(
    CREATED_KEY,
    overlay.get<JobRecord[]>(CREATED_KEY, []).filter((job) => job.id !== id),
  );
  overlay.update<number[]>(DELETED_KEY, [], (ids) =>
    ids.includes(id) ? ids : [...ids, id],
  );
  return true;
}

/** Attach an uploaded job description for the rest of this session. */
export function attachJobDescription(id: number, file: Blob): string | undefined {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") return undefined;
  const previous = jdUploads.get(id);
  if (previous) URL.revokeObjectURL(previous);
  const url = URL.createObjectURL(file);
  jdUploads.set(id, url);
  return url;
}

// ── Applications ───────────────────────────────────────────────────────────

const APPLICATIONS_KEY = "jobs:applications";
const APPLICATION_PATCHES_KEY = "jobs:application-patches";

/**
 * What an applicant row carries.
 *
 * One roster feeds both halves of this board, so the pools have to read for a
 * degree holder sitting Group-II and for an ITI trainee applying to a solar
 * firm. Keeping the skills employability-wide rather than trade-specific is what
 * makes that work: the trade skill belongs to the posting, and a seeded sample
 * that handed a police aspirant "overlock stitching" would read as noise.
 *
 * Index 0 of DEGREES and LOCATIONS is the persona's own, so it is chosen rather
 * than sampled.
 */
const DEGREES = [
  "B.A., Political Science",
  "B.Com., Computer Applications",
  "B.Sc., Mathematics",
  "B.Tech., Civil Engineering",
  "Diploma in Electrical Engineering",
  "ITI, Electrician",
] as const;

const LOCATIONS = [
  "Warangal, Telangana",
  "Hyderabad, Telangana",
  "Karimnagar, Telangana",
  "Khammam, Telangana",
  "Nizamabad, Telangana",
  "Nalgonda, Telangana",
  "Mahbubnagar, Telangana",
  "Siddipet, Telangana",
] as const;

const SKILL_POOL = [
  "General Studies",
  "Quantitative Aptitude",
  "Reasoning",
  "English Communication",
  "Telugu and English typing",
  "MS Office",
  "Tally",
  "Data entry",
  "Customer handling",
  "Basic accounting",
  "Computer basics",
  "Record keeping",
] as const;

const EXPERIENCE = [
  "Fresher. Completed a skill centre course with a workshop attachment at the end of it.",
  "One year at a district service centre, handling citizen applications at the counter.",
  "Two seasons of work at a rice mill while preparing for the written examination.",
  "Apprenticeship at an ITI attached workshop, six months on the shop floor.",
  "Fresher. Second attempt at a state recruitment examination, with a full mock test record.",
] as const;

function applicantFields(person: DemoPerson) {
  const gradYear = CURRENT_YEAR + seededInt(`jobs:yop:${person.id}`, 0, 1);
  const skills = seededSample(`jobs:skills:${person.id}`, SKILL_POOL, 5).join(", ");
  const isPersona = person.id === STUDENT_PERSONA.id;
  return {
    student: person.id,
    student_name: person.full_name,
    student_email: person.email,
    student_profile_pic_url: person.profile_pic_url,
    student_phone: person.phone,
    student_college: person.college,
    student_degree: isPersona
      ? DEGREES[0]
      : seededPick(`jobs:degree:${person.id}`, DEGREES),
    student_batch: `${gradYear - 4} to ${gradYear}`,
    student_yop: gradYear,
    student_location: isPersona
      ? LOCATIONS[0]
      : seededPick(`jobs:loc:${person.id}`, LOCATIONS),
    student_skills: skills,
    student_experience: seededPick(`jobs:exp:${person.id}`, EXPERIENCE),
    resume_url: isPersona
      ? personaResumeUrl()
      : resumeDocumentUrl(person, {
          headline: person.headline,
          college: person.college,
          degree: seededPick(`jobs:degree:${person.id}`, DEGREES),
          gradYear,
          location: seededPick(`jobs:loc:${person.id}`, LOCATIONS),
          phone: person.phone,
          email: person.email,
          skills,
          experience: seededPick(`jobs:exp:${person.id}`, EXPERIENCE),
        }),
  };
}

interface ApplicationInput {
  id: number;
  job: JobRecord;
  person: DemoPerson;
  status: ApplicationStatus;
  appliedDaysAgo: number;
  updatedDaysAgo?: number;
  pipeline?: Partial<
    Pick<
      JobApplicationRecord,
      | "drive"
      | "internal_shortlisting"
      | "reason_not_shortlisted"
      | "shortlisted_by_hr"
      | "round_1"
      | "round_2"
      | "round_3"
      | "round_4"
      | "offered"
    >
  >;
}

function buildApplication(input: ApplicationInput): JobApplicationRecord {
  return {
    id: input.id,
    job: input.job.id,
    job_title: input.job.job_title,
    company_name: input.job.company_name,
    ...applicantFields(input.person),
    status: input.status,
    drive: "",
    internal_shortlisting: "",
    reason_not_shortlisted: "",
    shortlisted_by_hr: "",
    round_1: "",
    round_2: "",
    round_3: "",
    round_4: "",
    offered: "",
    ...input.pipeline,
    applied_at: isoDaysAgo(input.appliedDaysAgo, 14, 20),
    updated_at: isoDaysAgo(input.updatedDaysAgo ?? Math.max(0, input.appliedDaysAgo - 2), 16, 45),
  };
}

/**
 * How a real pipeline looks partway through: mostly applied, a few moving, a
 * couple closed out. A queue where every row says "Applied" hides the stage
 * management an institution is buying.
 */
const PIPELINE_SPREAD: readonly ApplicationStatus[] = [
  "shortlisted",
  "applied",
  "interview_stage",
  "applied",
  "rejected",
  "applied",
  "shortlisted",
  "applied",
  "selected",
  "applied",
  "rejected",
  "interview_stage",
  "applied",
];

/**
 * The persona's own applications, spread across the pipeline so their list reads.
 *
 * The story is the one the mission exists to produce: an arts graduate preparing
 * for Group-II and the banking examinations, who also finished the solar course
 * at the Warangal centre and was placed through it. So the vocational posting is
 * the one that ends in an offer, the two live examinations are mid-pipeline, and
 * the closed central notification is the attempt that did not come off.
 *
 * The pipeline values are not free text. Each one is an option in the admin
 * queue's dropdowns (`ROUND_1_OPTIONS` and the rest), and a value outside that
 * list renders as an empty select that an administrator cannot save.
 */
const PERSONA_APPLICATIONS: ReadonlyArray<{
  jobId: number;
  status: ApplicationStatus;
  appliedDaysAgo: number;
  pipeline?: ApplicationInput["pipeline"];
}> = [
  {
    jobId: 611,
    status: "selected",
    appliedDaysAgo: 17,
    pipeline: {
      drive: "TSEM Skill Centre Placement Drive, Warangal",
      internal_shortlisting: "ops shortlisted",
      shortlisted_by_hr: "hr selected",
      round_1: "technical interview select",
      round_2: "manager round select",
      offered: "offer accepted",
    },
  },
  {
    jobId: 607,
    status: "interview_stage",
    appliedDaysAgo: 11,
    pipeline: {
      drive: "TSEM Banking Notification Support Drive",
      internal_shortlisting: "ops shortlisted",
      shortlisted_by_hr: "in process",
      round_1: "test select",
    },
  },
  {
    jobId: 601,
    status: "shortlisted",
    appliedDaysAgo: 7,
    pipeline: {
      drive: "TSEM Group-II Notification Drive",
      internal_shortlisting: "ops shortlisted",
    },
  },
  {
    jobId: 605,
    status: "rejected",
    appliedDaysAgo: 27,
    pipeline: {
      drive: "TSEM Central Notification Drive",
      round_1: "test reject",
      reason_not_shortlisted:
        "Did not qualify in the Tier-I examination held for this notification. Eligible to apply again in the next cycle.",
    },
  },
];

/**
 * Seeded rows are cached per posting.
 *
 * Building them is not free (every applicant carries a generated resume
 * document), and `toStudentJob` asks for the applicant count, so a six-card
 * board was rebuilding several hundred of them per request. Keyed on the fields
 * an application copies, so an edited job title still refreshes the rows.
 */
const seededApplicationCache = new Map<string, JobApplicationRecord[]>();

function seededApplicationsFor(job: JobRecord): JobApplicationRecord[] {
  const cacheKey = `${job.id}|${job.job_title}|${job.company_name}`;
  const cached = seededApplicationCache.get(cacheKey);
  if (cached) return cached;

  const rows: JobApplicationRecord[] = [];

  const persona = PERSONA_APPLICATIONS.find((entry) => entry.jobId === job.id);
  if (persona) {
    rows.push(
      buildApplication({
        // Reserved slot 90 so a persona row can never collide with a seeded one.
        id: job.id * 100 + 90,
        job,
        person: STUDENT_PERSONA,
        status: persona.status,
        appliedDaysAgo: persona.appliedDaysAgo,
        pipeline: persona.pipeline,
      }),
    );
  }

  const count = seededInt(`jobs:applicants:${job.id}`, 5, 13);
  const people = seededSample(`jobs:who:${job.id}`, STUDENTS, count);
  people.forEach((person, index) => {
    rows.push(
      buildApplication({
        id: job.id * 100 + index,
        job,
        person,
        status: PIPELINE_SPREAD[(job.id + index) % PIPELINE_SPREAD.length],
        appliedDaysAgo: Math.max(1, seededInt(`jobs:when:${job.id}:${person.id}`, 1, 18)),
      }),
    );
  });

  seededApplicationCache.set(cacheKey, rows);
  return rows;
}

const SEED_JOB_IDS = new Set(SEED_JOBS.map((seed) => seed.id));

/** Applications the visitor submitted this session. */
function visitorApplications(): JobApplicationRecord[] {
  return overlay.get<JobApplicationRecord[]>(APPLICATIONS_KEY, []);
}

function applicationPatches(): Record<string, Partial<JobApplicationRecord>> {
  return overlay.get<Record<string, Partial<JobApplicationRecord>>>(APPLICATION_PATCHES_KEY, {});
}

/**
 * Every application across every posting.
 *
 * Seeded rows are regenerated per call (they carry relative dates), the
 * visitor's own submissions come from the overlay, and admin edits are a patch
 * layer on top so a status change sticks for either kind of row.
 */
export function allApplications(): JobApplicationRecord[] {
  const patches = applicationPatches();
  // Only the seeded postings come with a queue. A job the visitor created a
  // minute ago must show "No applications yet", not eight invented applicants.
  const seeded = allJobs().filter((job) => SEED_JOB_IDS.has(job.id)).flatMap(seededApplicationsFor);
  return [...visitorApplications(), ...seeded].map((row) => ({
    ...row,
    ...(patches[String(row.id)] ?? {}),
  }));
}

export function applicationsForJob(jobId: number): JobApplicationRecord[] {
  return allApplications()
    .filter((row) => row.job === jobId)
    .sort((a, b) => b.applied_at.localeCompare(a.applied_at));
}

export function applicationById(id: number): JobApplicationRecord | undefined {
  return allApplications().find((row) => row.id === id);
}

/** The signed-in learner's applications, newest first. */
export function myApplications(): JobApplicationRecord[] {
  return allApplications()
    .filter((row) => row.student === STUDENT_PERSONA.id)
    .sort((a, b) => b.applied_at.localeCompare(a.applied_at));
}

export function hasApplied(jobId: number): boolean {
  return myApplications().some((row) => row.job === jobId);
}

export function applicationCountFor(jobId: number): number {
  return applicationsForJob(jobId).length;
}

/** Record a learner's application. Returns the existing one if they already applied. */
export function createApplication(input: {
  jobId: number;
  status: ApplicationStatus;
  resumeUrl?: string;
}): JobApplicationRecord | undefined {
  const job = jobById(input.jobId);
  if (!job) return undefined;

  const existing = myApplications().find((row) => row.job === input.jobId);
  if (existing) return existing;

  const row = buildApplication({
    id: nextDemoId("job-application"),
    job,
    person: STUDENT_PERSONA,
    status: input.status,
    appliedDaysAgo: 0,
  });
  const now = iso(new Date(nowMs()));
  const record: JobApplicationRecord = {
    ...row,
    resume_url: input.resumeUrl?.trim() ? input.resumeUrl : row.resume_url,
    applied_at: now,
    updated_at: now,
  };
  overlay.unshift(APPLICATIONS_KEY, record);
  return record;
}

/** Apply an admin edit (or the learner's own confirm) to one application. */
export function patchApplication(
  id: number,
  patch: Partial<JobApplicationRecord>,
): JobApplicationRecord | undefined {
  const current = applicationById(id);
  if (!current) return undefined;
  const next = { ...current, ...patch, updated_at: iso(new Date(nowMs())) };

  const submitted = visitorApplications();
  if (submitted.some((row) => row.id === id)) {
    overlay.set(
      APPLICATIONS_KEY,
      submitted.map((row) => (row.id === id ? next : row)),
    );
    return next;
  }

  overlay.update<Record<string, Partial<JobApplicationRecord>>>(
    APPLICATION_PATCHES_KEY,
    {},
    (patches) => ({ ...patches, [String(id)]: { ...(patches[String(id)] ?? {}), ...patch, updated_at: next.updated_at } }),
  );
  return next;
}

// ── Projections ────────────────────────────────────────────────────────────

const FAVOURITES_KEY = "jobs:favourites";

export function favouriteIds(): number[] {
  return overlay.get<number[]>(FAVOURITES_KEY, []);
}

export function toggleFavourite(jobId: number): boolean {
  const current = favouriteIds();
  const next = current.includes(jobId)
    ? current.filter((id) => id !== jobId)
    : [...current, jobId];
  overlay.set(FAVOURITES_KEY, next);
  return next.includes(jobId);
}

function courseRefs(ids: readonly number[]) {
  return ids
    .map((id) => courseById(id))
    .filter((course): course is NonNullable<ReturnType<typeof courseById>> => Boolean(course))
    .map((course) => ({ id: course.id, title: course.title }));
}

/**
 * The learner's view of a posting.
 *
 * Carries `questions`, because the apply wizard reads them off the job detail
 * rather than fetching them, and deliberately omits `assigned_students`: the
 * real backend never sends a learner the curated list of who else was targeted.
 */
export function toStudentJob(job: JobRecord) {
  return {
    id: job.id,
    job_title: job.job_title,
    company_name: job.company_name,
    company_logo: job.company_logo,
    company_info: job.company_info,
    job_description: job.job_description,
    role_process: job.role_process,
    mandatory_skills: job.mandatory_skills,
    key_skills: job.key_skills,
    industry_type: job.industry_type,
    department: job.department,
    employment_type: job.employment_type,
    role_category: job.role_category,
    education: job.education,
    ug_requirements: job.ug_requirements,
    pg_requirements: job.pg_requirements,
    location: job.location,
    years_of_experience: job.years_of_experience,
    salary: job.salary,
    apply_link: job.apply_link,
    job_type: job.job_type,
    status: job.status,
    application_deadline: job.application_deadline ?? undefined,
    jd_file_url: job.jd_file_url,
    number_of_openings: job.number_of_openings,
    applicable_passout_year: job.applicable_passout_year,
    min_10th_percentage: job.min_10th_percentage,
    min_12th_percentage: job.min_12th_percentage,
    min_graduation_percentage: job.min_graduation_percentage,
    tags: job.tags,
    created_at: job.created_at,
    is_published: job.is_published,
    eligible_to_apply: job.status === "active",
    is_favourited: favouriteIds().includes(job.id),
    has_applied: hasApplied(job.id),
    favorites_count: job.favorites_count + (favouriteIds().includes(job.id) ? 1 : 0),
    applications_count: applicationCountFor(job.id),
    courses: courseRefs(job.course_ids),
    questions: questionsByIds(job.question_ids),
  };
}

/** The admin's view: everything the learner sees plus the targeting detail. */
export function toAdminJob(job: JobRecord) {
  return {
    ...toStudentJob(job),
    college_mappings: job.college_mappings,
    adaptive_courses: courseRefs(job.adaptive_course_ids),
    assigned_students: job.assigned_student_ids
      .map((id) => personById(id))
      .filter((person): person is DemoPerson => Boolean(person))
      .map((person) => ({ id: person.id, name: person.full_name, email: person.email })),
    question_ids: job.question_ids,
  };
}
