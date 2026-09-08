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
 * Employers and roles are real and current for Indian campus hiring, because the
 * placement module is the one a prospect reads word for word.
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
 */
const SEED_QUESTIONS: readonly JobQuestion[] = [
  {
    id: 5001,
    question_text: "How soon could you join if you receive an offer?",
    question_type: "choice",
    is_required: true,
    order: 1,
    options: ["Immediately", "Within 30 days", "Within 60 days", "After my final semester"],
  },
  {
    id: 5002,
    question_text: "Are you willing to relocate for this role?",
    question_type: "yes_no",
    is_required: true,
    order: 2,
    options: ["Yes", "No"],
  },
  {
    id: 5003,
    question_text:
      "Describe one project you took from an empty repository to something people used.",
    question_type: "textarea",
    is_required: true,
    order: 3,
  },
  {
    id: 5004,
    question_text: "Which of these have you worked with in a real project?",
    question_type: "multichoice",
    is_required: false,
    order: 4,
    options: ["Git and code review", "Automated tests", "CI pipelines", "Cloud deployment", "On-call or production support"],
  },
  {
    id: 5005,
    question_text: "What annual compensation are you expecting?",
    question_type: "text",
    is_required: false,
    order: 5,
  },
  {
    id: 5006,
    question_text: "Do you hold any other offer at the moment?",
    question_type: "yes_no",
    is_required: false,
    order: 6,
    options: ["Yes", "No"],
  },
  {
    id: 5007,
    question_text: "Share a link to your GitHub, portfolio or published work.",
    question_type: "text",
    is_required: false,
    order: 7,
  },
  {
    id: 5008,
    question_text: "Which working pattern suits you best?",
    question_type: "choice",
    is_required: false,
    order: 8,
    options: ["Fully on-site", "Hybrid, three days in office", "Remote first"],
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
  courseIds: number[];
  colleges: CollegeMapping[];
  questionIds: number[];
  minGraduationPercentage: number | null;
}

const SEED_JOBS: readonly JobSeed[] = [
  {
    id: 601,
    job_title: "Software Engineer I (Backend)",
    company_name: "Razorpay",
    company_info:
      "Razorpay builds the payments infrastructure used by more than ten million Indian businesses. The backend group hires two campus cohorts a year and pairs every joiner with a senior engineer for their first two quarters.",
    job_description:
      "Join the payments core team building the services that move money for 10M+ businesses. " +
      "You will own a service end to end, from schema to on-call, with a senior engineer paired " +
      "with you for the first two quarters.",
    role_process:
      "Online assessment, then a technical round on data structures and system design, then a discussion with the hiring manager.",
    location: "Bengaluru (Hybrid)",
    years_of_experience: "0-2 years",
    salary: "₹18-24 LPA",
    employment_type: "Full-time",
    industry_type: "Financial Technology",
    department: "Engineering",
    role_category: "Software Development",
    education: "B.Tech / B.E. / MCA",
    ug_requirements: "B.Tech or B.E. in Computer Science, IT or a related branch",
    pg_requirements: "MCA or M.Tech accepted, not required",
    skills: ["Go", "PostgreSQL", "REST", "System Design"],
    number_of_openings: 6,
    status: "active",
    is_published: true,
    createdDaysAgo: 9,
    deadlineInDays: 12,
    courseIds: [201, 205],
    colleges: [
      { id: 1, college_name: "Indian Institute of Technology, Bombay", department: "Computer Science", batch: "2026" },
      { id: 2, college_name: "National Institute of Technology, Trichy", department: "Computer Science", batch: "2026" },
    ],
    questionIds: [5001, 5002, 5003],
    minGraduationPercentage: 60,
  },
  {
    id: 602,
    job_title: "Frontend Engineer",
    company_name: "Zerodha",
    company_info:
      "Zerodha runs India's largest retail broking platform with a famously small engineering team. Everything is built in house and shipped without a marketing budget.",
    job_description:
      "Work on Kite, used by millions of traders where a 200ms delay is a real cost. Strong bias " +
      "toward small bundles, no unnecessary dependencies, and measuring before optimising.",
    role_process:
      "Take-home build, then a code walkthrough with two engineers, then a conversation with the team lead.",
    location: "Bengaluru (On-site)",
    years_of_experience: "0-3 years",
    salary: "₹16-22 LPA",
    employment_type: "Full-time",
    industry_type: "Financial Services",
    department: "Engineering",
    role_category: "Frontend Development",
    education: "B.Tech / B.E. / BCA",
    ug_requirements: "Any engineering branch, with a portfolio of shipped interfaces",
    pg_requirements: "Not required",
    skills: ["React", "TypeScript", "Performance", "Accessibility"],
    number_of_openings: 3,
    status: "active",
    is_published: true,
    createdDaysAgo: 14,
    deadlineInDays: 20,
    courseIds: [201],
    colleges: [
      { id: 3, college_name: "Delhi Technological University", department: "Information Technology", batch: "2026" },
    ],
    questionIds: [5002, 5007],
    minGraduationPercentage: 60,
  },
  {
    id: 603,
    job_title: "Data Analyst, Growth",
    company_name: "Swiggy",
    company_info:
      "Swiggy's growth analytics group sits between marketing and product, and owns the experiments that decide what gets built next quarter.",
    job_description:
      "Sit with the growth team and answer questions that change what gets built: which offers " +
      "actually retain, which cities behave differently, and which experiments were underpowered.",
    role_process:
      "SQL and case assessment, then an analytics round, then a panel with the growth and product leads.",
    location: "Bengaluru (Hybrid)",
    years_of_experience: "0-2 years",
    salary: "₹12-18 LPA",
    employment_type: "Full-time",
    industry_type: "Consumer Internet",
    department: "Analytics",
    role_category: "Data and Analytics",
    education: "Any graduate with strong quantitative coursework",
    ug_requirements: "B.Tech, B.Sc. Statistics, Economics or equivalent",
    pg_requirements: "M.Sc. or MBA welcome, not required",
    skills: ["SQL", "Python", "Experimentation", "Dashboards"],
    number_of_openings: 4,
    status: "active",
    is_published: true,
    createdDaysAgo: 4,
    deadlineInDays: 8,
    courseIds: [202, 205],
    colleges: [
      { id: 4, college_name: "Vellore Institute of Technology", department: "Computer Science", batch: "2026" },
      { id: 5, college_name: "Anna University", department: "Statistics", batch: "2026" },
    ],
    questionIds: [5001, 5005],
    minGraduationPercentage: 65,
  },
  {
    id: 604,
    job_title: "Machine Learning Intern",
    company_name: "Freshworks",
    company_info:
      "Freshworks builds customer software from Chennai for a global market. The applied ML team converts most of its interns to full-time offers.",
    job_description:
      "Six-month internship on the applied ML team working on ticket classification and " +
      "summarisation. Converts to a full-time offer for most interns.",
    role_process:
      "Screening call, then a machine learning fundamentals round, then a project discussion with the team.",
    location: "Chennai (On-site)",
    years_of_experience: "Internship",
    salary: "₹60,000 / month",
    employment_type: "Internship",
    industry_type: "Software Products",
    department: "Machine Learning",
    role_category: "Data Science",
    education: "Pre-final or final year, any engineering branch",
    ug_requirements: "Coursework in linear algebra, probability and machine learning",
    pg_requirements: "Not required",
    skills: ["Python", "PyTorch", "NLP", "Evaluation"],
    number_of_openings: 8,
    status: "active",
    is_published: true,
    createdDaysAgo: 6,
    deadlineInDays: 5,
    courseIds: [202],
    colleges: [
      { id: 6, college_name: "SRM Institute of Science and Technology", department: "Computer Science", batch: "2027" },
    ],
    questionIds: [5001, 5003, 5004],
    minGraduationPercentage: null,
  },
  {
    id: 605,
    job_title: "Platform Engineer (Cloud)",
    company_name: "Postman",
    company_info:
      "Postman's platform group owns the infrastructure the rest of engineering builds on, and runs fully distributed across India.",
    job_description:
      "Own the infrastructure other engineers build on: deployment pipelines, environment " +
      "provisioning, and the cost of running it all.",
    role_process:
      "Technical screen, then an infrastructure design round, then a working session with the platform team.",
    location: "Remote (India)",
    years_of_experience: "1-3 years",
    salary: "₹20-28 LPA",
    employment_type: "Full-time",
    industry_type: "Developer Tools",
    department: "Platform Engineering",
    role_category: "Infrastructure",
    education: "B.Tech / B.E.",
    ug_requirements: "Any branch, with demonstrable cloud or systems work",
    pg_requirements: "Not required",
    skills: ["AWS", "Kubernetes", "Terraform", "Observability"],
    number_of_openings: 2,
    status: "active",
    is_published: true,
    createdDaysAgo: 21,
    deadlineInDays: 16,
    courseIds: [204],
    colleges: [
      { id: 7, college_name: "BITS Pilani", department: "Computer Science", batch: "2026" },
    ],
    questionIds: [5002, 5004, 5008],
    minGraduationPercentage: 60,
  },
  {
    id: 606,
    job_title: "Associate Software Engineer",
    company_name: "Atlassian",
    company_info:
      "Atlassian's Bengaluru site runs a structured graduate programme: two team rotations in the first year, a dedicated mentor, and a capstone shipped to customers.",
    job_description:
      "Graduate programme with a structured first year: rotations across two teams, a dedicated " +
      "mentor, and a capstone shipped to production.",
    role_process:
      "Online assessment, then two technical rounds, then a values and collaboration interview.",
    location: "Bengaluru (Hybrid)",
    years_of_experience: "0-1 years",
    salary: "₹22-30 LPA",
    employment_type: "Full-time",
    industry_type: "Software Products",
    department: "Engineering",
    role_category: "Software Development",
    education: "B.Tech / B.E. / MCA",
    ug_requirements: "Computer Science or allied branch, 2026 passout",
    pg_requirements: "Not required",
    skills: ["Java", "Distributed Systems", "Testing"],
    number_of_openings: 10,
    status: "closed",
    is_published: true,
    createdDaysAgo: 40,
    deadlineInDays: -4,
    courseIds: [203],
    colleges: [
      { id: 8, college_name: "Indian Institute of Technology, Bombay", department: "Computer Science", batch: "2026" },
      { id: 9, college_name: "PES University", department: "Computer Science", batch: "2026" },
    ],
    questionIds: [5001, 5006],
    minGraduationPercentage: 70,
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
    apply_link: "",
    job_type: seed.employment_type,
    status: seed.status,
    application_deadline:
      seed.deadlineInDays >= 0
        ? ymdDaysAhead(seed.deadlineInDays)
        : ymdDaysAgo(Math.abs(seed.deadlineInDays)),
    number_of_openings: seed.number_of_openings,
    applicable_passout_year: String(CURRENT_YEAR + 1),
    min_10th_percentage: seed.minGraduationPercentage === null ? null : 60,
    min_12th_percentage: seed.minGraduationPercentage === null ? null : 60,
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

const DEGREES = [
  "B.Tech, Computer Science and Engineering",
  "B.E., Information Technology",
  "B.Tech, Electronics and Communication",
  "B.Sc., Statistics",
  "MCA",
] as const;

const LOCATIONS = [
  "Bengaluru, Karnataka",
  "Pune, Maharashtra",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Noida, Uttar Pradesh",
  "Kochi, Kerala",
] as const;

const SKILL_POOL = [
  "Python",
  "SQL",
  "React",
  "TypeScript",
  "Java",
  "Node.js",
  "AWS",
  "Docker",
  "pandas",
  "Git",
  "REST APIs",
  "PostgreSQL",
] as const;

const EXPERIENCE = [
  "Six-month internship at a product startup, working on the reporting service.",
  "Fresher. Two capstone projects and a semester of teaching assistance.",
  "Freelance web work for two local businesses alongside coursework.",
  "Summer research assistant on an applied machine learning project.",
  "Part-time support engineer at the campus computing centre.",
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

/** The persona's own applications, spread across the pipeline so their list reads. */
const PERSONA_APPLICATIONS: ReadonlyArray<{
  jobId: number;
  status: ApplicationStatus;
  appliedDaysAgo: number;
  pipeline?: ApplicationInput["pipeline"];
}> = [
  {
    jobId: 605,
    status: "selected",
    appliedDaysAgo: 18,
    pipeline: {
      drive: "AI Linc Placement Drive, Spring",
      internal_shortlisting: "ops shortlisted",
      shortlisted_by_hr: "hr selected",
      round_1: "technical interview select",
      round_2: "manager round select",
      offered: "offer accepted",
    },
  },
  {
    jobId: 602,
    status: "interview_stage",
    appliedDaysAgo: 12,
    pipeline: {
      drive: "AI Linc Placement Drive, Spring",
      internal_shortlisting: "ops shortlisted",
      shortlisted_by_hr: "in process",
      round_1: "resume shortlisted",
    },
  },
  { jobId: 603, status: "shortlisted", appliedDaysAgo: 6, pipeline: { internal_shortlisting: "ops shortlisted" } },
  {
    jobId: 606,
    status: "rejected",
    appliedDaysAgo: 26,
    pipeline: {
      round_1: "test reject",
      reason_not_shortlisted: "Did not clear the online assessment cut-off for this drive.",
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
