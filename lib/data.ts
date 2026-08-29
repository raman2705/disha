export type Stage = "Discover" | "Prepare" | "Apply" | "Verify" | "Payment" | "Renewal";
export type DemoState = "apply" | "verification" | "payment";

export const brand = {
  name: "Disha",
  tagline: "Scholarships, with a clearer way forward."
};

export const profile = {
  name: "Aditi Sharma",
  initials: "AS",
  college: "ABC College",
  location: "Delhi",
  programme: "B.A. Economics",
  year: "Undergraduate, Year 1",
  income: "₹3.2 lakh/year",
  class12: "86%",
  phone: "+91 98xxxxxx42",
  email: "aditi.sharma@example.com",
  aadhaar: "Verified",
  bank: "Added"
};

export const journey: Stage[] = ["Discover", "Prepare", "Apply", "Verify", "Payment", "Renewal"];

export const demoStates: Record<DemoState, { label: string; stage: Stage; headline: string; action: string; href: string }> = {
  apply: {
    label: "Discover & Apply",
    stage: "Prepare",
    headline: "Resolve your readiness issues",
    action: "Continue application",
    href: "/preflight"
  },
  verification: {
    label: "Verification delay",
    stage: "Verify",
    headline: "Your institute needs to act next",
    action: "Track verification",
    href: "/applications/css-2026"
  },
  payment: {
    label: "Payment issue",
    stage: "Payment",
    headline: "Your bank details need attention",
    action: "Review payment",
    href: "/payments/css-2026"
  }
};

export const institution = {
  name: "ABC College",
  cell: "ABC College Scholarship Cell",
  linked: "Yes",
  enrolmentConfirmed: "Yes",
  requiredAction: "Scholarship verification pending",
  completedDate: "26 August"
};

export type EducationLevel =
  | "Class 9-10"
  | "Class 11-12"
  | "Diploma"
  | "Undergraduate"
  | "Postgraduate"
  | "Professional / Technical degree"
  | "Research / PhD";

export type ScholarshipLevel = "School" | "Diploma" | "Undergraduate" | "Postgraduate" | "Research";
export type SchemeScope = "Central" | "State";
export type SchemeStatus = "open" | "upcoming" | "renewal-only" | "closed";

export type ScholarshipRule = {
  education?: EducationLevel[];
  levels?: ScholarshipLevel[];
  states?: string[];
  regions?: string[];
  incomeMaxLakh?: number;
  scoreMin?: number;
  categories?: string[];
  genders?: string[];
  disabilityRequired?: boolean;
  minorityRequired?: boolean;
  hostellerRelevant?: boolean;
  institutionTypes?: string[];
  courses?: string[];
  renewalOnly?: boolean;
};

export type Scholarship = {
  id: string;
  title: string;
  provider: string;
  level: ScholarshipLevel[];
  schemeType: string[];
  scope: SchemeScope;
  amount: string;
  deadline: string;
  applicability: string;
  cycle: "Fresh" | "Renewal" | "Fresh and renewal";
  availability: SchemeStatus;
  status: "Eligible" | "Needs information" | "Not eligible";
  match: string;
  explanation: string;
  cta: string;
  criteria: string[];
  evidence: { label: string; value: string; requirement: string; result: "pass" | "warning" | "fail" }[];
  institutionAction: string;
  requiredProfileFields: string[];
  rules: ScholarshipRule;
};

export const scholarships = [
  {
    id: "central-sector-scholarship",
    title: "PM-USP Central Sector Scheme of Scholarship for College and University Students",
    provider: "Department of Higher Education",
    level: ["Undergraduate"],
    schemeType: ["Merit-based", "Need-based"],
    scope: "Central",
    amount: "₹12,000/year",
    deadline: "31 October",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Eligible",
    match: "Strong match",
    explanation:
      "You match because you are enrolled in an undergraduate programme, your Class 12 score is above the required threshold, and your household income is within the eligible range.",
    cta: "View details",
    criteria: ["Undergraduate programme", "Class 12 score of at least 80%", "Household income up to ₹4.5 lakh"],
    evidence: [
      { label: "Your score", value: "86%", requirement: "Requirement: >=80%", result: "pass" },
      { label: "Your income", value: "₹3.2 lakh", requirement: "Requirement: <=₹4.5 lakh", result: "pass" }
    ],
    institutionAction: "ABC College must confirm your enrolment before the scholarship can proceed.",
    requiredProfileFields: [],
    rules: { education: ["Undergraduate"], levels: ["Undergraduate"], incomeMaxLakh: 4.5, scoreMin: 80 }
  },
  {
    id: "aicte-pragati-degree",
    title: "AICTE Pragati Scholarship - Degree",
    provider: "AICTE",
    level: ["Undergraduate"],
    schemeType: ["Merit-based", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation:
      "This may fit women students in approved technical degree programmes. Disha needs gender and institution type to confirm.",
    cta: "Complete details",
    criteria: ["Woman student", "AICTE-approved degree institution", "Household income up to ₹8 lakh"],
    evidence: [
      { label: "Your education", value: "Undergraduate", requirement: "Requirement: degree study", result: "pass" },
      { label: "Missing detail", value: "Gender", requirement: "Gender needed to confirm", result: "warning" }
    ],
    institutionAction: "The institution may need to confirm AICTE approval and enrolment.",
    requiredProfileFields: ["gender", "institutionType"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], incomeMaxLakh: 8, genders: ["Female"], institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "merit-cum-means-scholarship",
    title: "Merit-cum-Means Scholarship",
    provider: "Minority Affairs",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Merit-based", "Need-based", "Minority/community criterion"],
    scope: "Central",
    amount: "₹20,000/year",
    deadline: "5 December",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Not eligible",
    match: "Criteria not met",
    explanation:
      "This scholarship requires a household income below ₹2.5 lakh/year. Your profile currently shows ₹3.2 lakh/year.",
    cta: "View criteria",
    criteria: ["Merit score above threshold", "Household income below ₹2.5 lakh/year", "Institute confirmation if shortlisted"],
    evidence: [
      { label: "Your income", value: "₹3.2 lakh", requirement: "Requirement: below ₹2.5 lakh", result: "fail" },
      { label: "Your score", value: "86%", requirement: "Merit requirement likely met", result: "pass" }
    ],
    institutionAction: "Institute confirmation is only required if the income criterion is met.",
    requiredProfileFields: ["minority"],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], incomeMaxLakh: 2.5, scoreMin: 50, minorityRequired: true }
  },
  {
    id: "aicte-pragati-diploma",
    title: "AICTE Pragati Scholarship - Diploma",
    provider: "AICTE",
    level: ["Diploma"],
    schemeType: ["Merit-based", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For women students in approved technical diploma programmes.",
    cta: "View criteria",
    criteria: ["Diploma study", "Woman student", "Household income up to ₹8 lakh"],
    evidence: [],
    institutionAction: "Institution verifies course and AICTE approval.",
    requiredProfileFields: ["gender", "institutionType"],
    rules: { education: ["Diploma"], levels: ["Diploma"], incomeMaxLakh: 8, genders: ["Female"], institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "aicte-saksham-degree",
    title: "AICTE Saksham Scholarship - Degree",
    provider: "AICTE",
    level: ["Undergraduate"],
    schemeType: ["Disability", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For students with disabilities in approved technical degree programmes.",
    cta: "View criteria",
    criteria: ["Technical degree", "Disability criterion", "Household income up to ₹8 lakh"],
    evidence: [],
    institutionAction: "Institution verifies course and enrolment.",
    requiredProfileFields: ["disability", "institutionType"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], incomeMaxLakh: 8, disabilityRequired: true, institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "aicte-saksham-diploma",
    title: "AICTE Saksham Scholarship - Diploma",
    provider: "AICTE",
    level: ["Diploma"],
    schemeType: ["Disability", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For students with disabilities in approved diploma programmes.",
    cta: "View criteria",
    criteria: ["Diploma study", "Disability criterion", "Household income up to ₹8 lakh"],
    evidence: [],
    institutionAction: "Institution verifies course and enrolment.",
    requiredProfileFields: ["disability", "institutionType"],
    rules: { education: ["Diploma"], levels: ["Diploma"], incomeMaxLakh: 8, disabilityRequired: true, institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "aicte-swanath-degree",
    title: "AICTE Swanath Scholarship - Degree",
    provider: "AICTE",
    level: ["Undergraduate"],
    schemeType: ["Special category", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible degree students from specified vulnerable categories.",
    cta: "View criteria",
    criteria: ["Technical degree", "Specified Swanath category", "Institution verification"],
    evidence: [],
    institutionAction: "Institution confirms programme and uploaded documents.",
    requiredProfileFields: ["category", "institutionType"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "aicte-swanath-diploma",
    title: "AICTE Swanath Scholarship - Diploma",
    provider: "AICTE",
    level: ["Diploma"],
    schemeType: ["Special category", "Need-based"],
    scope: "Central",
    amount: "₹50,000/year",
    deadline: "18 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible diploma students from specified vulnerable categories.",
    cta: "View criteria",
    criteria: ["Diploma study", "Specified Swanath category", "Institution verification"],
    evidence: [],
    institutionAction: "Institution confirms programme and uploaded documents.",
    requiredProfileFields: ["category", "institutionType"],
    rules: { education: ["Diploma"], levels: ["Diploma"], institutionTypes: ["AICTE-approved"] }
  },
  {
    id: "pmusp-jk-ladakh",
    title: "PM-USP Special Scholarship Scheme for Jammu & Kashmir and Ladakh",
    provider: "AICTE",
    level: ["Undergraduate"],
    schemeType: ["Regional", "Need-based"],
    scope: "Central",
    amount: "Tuition support plus maintenance",
    deadline: "20 November",
    applicability: "Jammu & Kashmir, Ladakh",
    cycle: "Fresh",
    availability: "upcoming",
    status: "Needs information",
    match: "Regional scheme",
    explanation: "For students domiciled in Jammu & Kashmir or Ladakh pursuing eligible higher education.",
    cta: "View criteria",
    criteria: ["J&K or Ladakh domicile", "Undergraduate study", "Income and document checks"],
    evidence: [],
    institutionAction: "Institution verifies admission and continuation.",
    requiredProfileFields: [],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], states: ["Jammu and Kashmir", "Ladakh"], incomeMaxLakh: 8 }
  },
  {
    id: "ishan-uday",
    title: "Ishan Uday Special Scholarship Scheme for North Eastern Region",
    provider: "UGC",
    level: ["Undergraduate"],
    schemeType: ["Regional", "Need-based"],
    scope: "Central",
    amount: "₹5,400-₹7,800/month",
    deadline: "31 October",
    applicability: "North Eastern states",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Regional scheme",
    explanation: "For eligible students from the North Eastern Region pursuing undergraduate study.",
    cta: "View criteria",
    criteria: ["North Eastern domicile", "Undergraduate study", "Household income up to ₹4.5 lakh"],
    evidence: [],
    institutionAction: "Institution verifies enrolment and continuation.",
    requiredProfileFields: [],
    rules: { education: ["Undergraduate"], levels: ["Undergraduate"], states: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"], incomeMaxLakh: 4.5 }
  },
  {
    id: "national-pg-scholarship",
    title: "National Scholarship for Post Graduate Studies",
    provider: "UGC",
    level: ["Postgraduate"],
    schemeType: ["Merit-based"],
    scope: "Central",
    amount: "₹15,000/month",
    deadline: "31 October",
    applicability: "All India",
    cycle: "Fresh",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For students entering eligible postgraduate programmes.",
    cta: "View criteria",
    criteria: ["Postgraduate study", "Merit-based selection", "Institution verification"],
    evidence: [],
    institutionAction: "Institution confirms admission and course details.",
    requiredProfileFields: [],
    rules: { education: ["Postgraduate"], levels: ["Postgraduate"], scoreMin: 60 }
  },
  {
    id: "pm-yasasvi-top-class-obc",
    title: "PM YASASVI Top Class Education in College for OBC, EBC and DNT Students",
    provider: "Social Justice and Empowerment",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Category-based", "Need-based"],
    scope: "Central",
    amount: "Tuition plus academic allowance",
    deadline: "15 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "Disha needs category to confirm fit for this top class education scheme.",
    cta: "Add category",
    criteria: ["OBC, EBC or DNT category", "Eligible institution", "Household income up to ₹2.5 lakh"],
    evidence: [],
    institutionAction: "Institution confirms admission and approved course status.",
    requiredProfileFields: ["category", "institutionType"],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], incomeMaxLakh: 2.5, categories: ["OBC", "EBC", "DNT"] }
  },
  {
    id: "top-class-sc",
    title: "Top Class Education Scheme for SC Students",
    provider: "Social Justice and Empowerment",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Category-based", "Need-based"],
    scope: "Central",
    amount: "Tuition plus living allowance",
    deadline: "15 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "Disha needs category and institution type to confirm this scheme.",
    cta: "Add category",
    criteria: ["SC category", "Approved institution", "Household income up to ₹8 lakh"],
    evidence: [],
    institutionAction: "Institution confirms admission and course status.",
    requiredProfileFields: ["category", "institutionType"],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], incomeMaxLakh: 8, categories: ["SC"] }
  },
  {
    id: "higher-education-st",
    title: "Scholarship for Higher Education of ST Students",
    provider: "Tribal Affairs",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Category-based", "Need-based"],
    scope: "Central",
    amount: "Tuition plus stipend",
    deadline: "12 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "Disha needs category to confirm this higher education scheme.",
    cta: "Add category",
    criteria: ["ST category", "Higher education enrolment", "Institution verification"],
    evidence: [],
    institutionAction: "Institution confirms enrolment and course status.",
    requiredProfileFields: ["category"],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], categories: ["ST"] }
  },
  {
    id: "post-matric-disabilities",
    title: "Post-Matric Scholarship for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities",
    level: ["School", "Diploma", "Undergraduate", "Postgraduate"],
    schemeType: ["Disability", "Need-based"],
    scope: "Central",
    amount: "Maintenance and fee support",
    deadline: "30 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For students with disabilities after Class 10.",
    cta: "View criteria",
    criteria: ["Post-Class 10 study", "Disability criterion", "Household income up to ₹2.5 lakh"],
    evidence: [],
    institutionAction: "Institution verifies enrolment.",
    requiredProfileFields: ["disability"],
    rules: { education: ["Class 11-12", "Diploma", "Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["School", "Diploma", "Undergraduate", "Postgraduate"], incomeMaxLakh: 2.5, disabilityRequired: true }
  },
  {
    id: "top-class-disabilities",
    title: "Top Class Education Scholarship for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Disability", "Need-based"],
    scope: "Central",
    amount: "Tuition plus maintenance allowance",
    deadline: "30 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For students with disabilities in notified top class institutions.",
    cta: "View criteria",
    criteria: ["Disability criterion", "Top class institution", "Higher education enrolment"],
    evidence: [],
    institutionAction: "Institution confirms notified status and enrolment.",
    requiredProfileFields: ["disability", "institutionType"],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], disabilityRequired: true }
  },
  {
    id: "nec-merit-scholarship",
    title: "NEC Merit Scholarship",
    provider: "North Eastern Council",
    level: ["Diploma", "Undergraduate", "Postgraduate", "Research"],
    schemeType: ["Merit-based", "Regional"],
    scope: "Central",
    amount: "₹20,000-₹30,000/year",
    deadline: "31 October",
    applicability: "North Eastern states",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Regional scheme",
    explanation: "For students from North Eastern states pursuing eligible diploma, degree, postgraduate or research study.",
    cta: "View criteria",
    criteria: ["North Eastern domicile", "Merit requirement", "Eligible course"],
    evidence: [],
    institutionAction: "Institution verifies course and continuation.",
    requiredProfileFields: ["course"],
    rules: { education: ["Diploma", "Undergraduate", "Postgraduate", "Research / PhD"], levels: ["Diploma", "Undergraduate", "Postgraduate", "Research"], states: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"], scoreMin: 60 }
  },
  {
    id: "pmss-capf",
    title: "Prime Minister's Scholarship Scheme for CAPF and Assam Rifles wards",
    provider: "Ministry of Home Affairs",
    level: ["Undergraduate"],
    schemeType: ["Ward / service category", "Merit-based"],
    scope: "Central",
    amount: "₹30,000-₹36,000/year",
    deadline: "30 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible wards of CAPF and Assam Rifles personnel.",
    cta: "View criteria",
    criteria: ["Eligible ward category", "Professional degree course", "Minimum 60%"],
    evidence: [],
    institutionAction: "Institution confirms professional course and continuation.",
    requiredProfileFields: ["category", "course"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], scoreMin: 60 }
  },
  {
    id: "pmss-police",
    title: "Prime Minister's Scholarship Scheme for wards of State and UT police personnel",
    provider: "Ministry of Home Affairs",
    level: ["Undergraduate"],
    schemeType: ["Ward / service category", "Merit-based"],
    scope: "Central",
    amount: "₹30,000-₹36,000/year",
    deadline: "30 November",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible wards of State and UT police personnel.",
    cta: "View criteria",
    criteria: ["Eligible ward category", "Professional degree course", "Minimum 60%"],
    evidence: [],
    institutionAction: "Institution confirms professional course and continuation.",
    requiredProfileFields: ["category", "course"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], scoreMin: 60 }
  },
  {
    id: "workers-wards-education",
    title: "Financial Assistance for Education of Beedi, Cine, IOMC and LSDM Workers' Wards",
    provider: "Ministry of Labour and Employment",
    level: ["School", "Diploma", "Undergraduate", "Postgraduate"],
    schemeType: ["Worker ward", "Need-based"],
    scope: "Central",
    amount: "₹1,000-₹25,000/year",
    deadline: "31 December",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible wards of specified worker groups.",
    cta: "View criteria",
    criteria: ["Eligible worker ward", "Study continuation", "Income and document checks"],
    evidence: [],
    institutionAction: "Institution verifies current study status.",
    requiredProfileFields: ["category"],
    rules: { education: ["Class 9-10", "Class 11-12", "Diploma", "Undergraduate", "Postgraduate"], levels: ["School", "Diploma", "Undergraduate", "Postgraduate"], incomeMaxLakh: 8 }
  },
  {
    id: "icar-national-talent-ug",
    title: "ICAR National Talent Scholarship - Undergraduate",
    provider: "ICAR",
    level: ["Undergraduate"],
    schemeType: ["Merit-based", "Course / discipline"],
    scope: "Central",
    amount: "₹3,000/month",
    deadline: "10 December",
    applicability: "All India",
    cycle: "Fresh and renewal",
    availability: "upcoming",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible undergraduate students in agricultural education streams.",
    cta: "View criteria",
    criteria: ["Agriculture or allied discipline", "Undergraduate study", "Institution verification"],
    evidence: [],
    institutionAction: "Institution confirms discipline and enrolment.",
    requiredProfileFields: ["course"],
    rules: { education: ["Undergraduate", "Professional / Technical degree"], levels: ["Undergraduate"], courses: ["Agriculture", "Veterinary", "Fisheries"] }
  },
  {
    id: "icar-pg-scholarship",
    title: "ICAR Post Graduate Scholarship",
    provider: "ICAR",
    level: ["Postgraduate"],
    schemeType: ["Merit-based", "Course / discipline"],
    scope: "Central",
    amount: "₹12,640/month",
    deadline: "10 December",
    applicability: "All India",
    cycle: "Fresh",
    availability: "upcoming",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible postgraduate students in agricultural education streams.",
    cta: "View criteria",
    criteria: ["Agriculture or allied discipline", "Postgraduate study", "Merit-based selection"],
    evidence: [],
    institutionAction: "Institution confirms discipline and enrolment.",
    requiredProfileFields: ["course"],
    rules: { education: ["Postgraduate"], levels: ["Postgraduate"], courses: ["Agriculture", "Veterinary", "Fisheries"], scoreMin: 60 }
  },
  {
    id: "icar-jrf-srf",
    title: "ICAR JRF / SRF",
    provider: "ICAR",
    level: ["Research"],
    schemeType: ["Research", "Merit-based"],
    scope: "Central",
    amount: "Fellowship support",
    deadline: "10 December",
    applicability: "All India",
    cycle: "Fresh",
    availability: "upcoming",
    status: "Needs information",
    match: "Could match",
    explanation: "For eligible research candidates in agricultural and allied disciplines.",
    cta: "View criteria",
    criteria: ["Research programme", "Agriculture or allied discipline", "Selection-based"],
    evidence: [],
    institutionAction: "Institution confirms research enrolment.",
    requiredProfileFields: ["course"],
    rules: { education: ["Research / PhD"], levels: ["Research"], courses: ["Agriculture", "Veterinary", "Fisheries"], scoreMin: 60 }
  },
  {
    id: "delhi-higher-education-merit",
    title: "Delhi Merit-cum-Means Scholarship for Higher Education",
    provider: "Delhi Government",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Merit-based", "Need-based"],
    scope: "State",
    amount: "Fee reimbursement support",
    deadline: "22 November",
    applicability: "Delhi",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Eligible",
    match: "State match",
    explanation: "A representative Delhi higher education scheme for students meeting simplified merit and income checks.",
    cta: "View details",
    criteria: ["Delhi domicile", "Higher education enrolment", "Household income up to ₹6 lakh"],
    evidence: [],
    institutionAction: "Institution verifies enrolment and fee details.",
    requiredProfileFields: [],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], states: ["Delhi"], incomeMaxLakh: 6, scoreMin: 60 }
  }
] satisfies Scholarship[];

export const readyChecklist = [
  "Aadhaar verified",
  "Academic details complete",
  "Bank account added",
  "Income certificate validity risk",
  "Institute enrolment proof missing"
];

export const applicationId = "NSP-CSS-2026-10482";
