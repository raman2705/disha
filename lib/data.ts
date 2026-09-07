export type Stage = "Discover" | "Assess" | "Prepare" | "Apply" | "Verification" | "Payment" | "Renewal";
export type DemoState = "discover" | "assess" | "prepare" | "apply" | "verification" | "payment" | "payment-blocker" | "payment-corrected" | "renewal";

export const brand = {
  name: "Disha",
  tagline: "Opportunities, with a clearer way forward."
};

export type ProfileEvidence = {
  id: string;
  label: string;
  summary: string;
  source: "profile" | "document" | "activity" | "self-reported";
};

export type DemoProfile = {
  id: string;
  name: string;
  initials: string;
  role: string;
  college: string;
  institutionType: string;
  location: string;
  domicile: string;
  programme: string;
  course: string;
  year: string;
  cgpa: string;
  class12: string;
  income: string;
  phone: string;
  email: string;
  aadhaar: string;
  bank: string;
  gender: string;
  disability: string;
  minority: string;
  category: string;
  interests: string[];
  strengths: string[];
  gaps: string[];
  evidence: ProfileEvidence[];
};

export const profiles: DemoProfile[] = [
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    initials: "AR",
    role: "Final-year engineering student",
    college: "Bengaluru Institute of Technology",
    institutionType: "AICTE-approved",
    location: "Bengaluru, Karnataka",
    domicile: "Karnataka",
    programme: "B.Tech Computer Science and Engineering",
    course: "Computer Science",
    year: "Undergraduate, final year",
    cgpa: "8.3 CGPA",
    class12: "86%",
    income: "₹3.2 lakh/year",
    phone: "+91 98xxxxxx42",
    email: "ananya.rao@example.com",
    aadhaar: "Verified",
    bank: "Added",
    gender: "Female",
    disability: "No",
    minority: "No",
    category: "General",
    interests: ["research internships", "fellowships", "AI for public services", "student innovation funding"],
    strengths: [
      "8.3 CGPA in a technical degree",
      "Research internship on AI-assisted public service workflows",
      "Final-year college project with a working prototype",
      "Volunteer lead for a campus financial-aid helpdesk"
    ],
    gaps: [
      "Recommendation letters are not final",
      "Pilot evidence is promising but still small",
      "Some applications need fresher income and institution documents"
    ],
    evidence: [
      { id: "cgpa", label: "Academic record", summary: "8.3 CGPA and 86% in Class 12", source: "document" },
      { id: "research-internship", label: "Research internship", summary: "Worked on responsible AI workflows for student services", source: "activity" },
      { id: "project", label: "College project", summary: "Prototype tested with classmates and scholarship cell volunteers", source: "activity" },
      { id: "leadership", label: "Leadership", summary: "Led volunteer support for first-generation applicants during scholarship season", source: "self-reported" }
    ]
  },
  {
    id: "rohan-menon",
    name: "Rohan Menon",
    initials: "RM",
    role: "First-year postgraduate student",
    college: "National Institute of Design",
    institutionType: "Government / aided",
    location: "Ahmedabad, Gujarat",
    domicile: "Gujarat",
    programme: "M.Des Interaction Design",
    course: "Design",
    year: "Postgraduate, year 1",
    cgpa: "7.9 CGPA",
    class12: "88%",
    income: "₹5.4 lakh/year",
    phone: "+91 98xxxxxx84",
    email: "rohan.menon@example.com",
    aadhaar: "Verified",
    bank: "Added",
    gender: "Male",
    disability: "No",
    minority: "No",
    category: "General",
    interests: ["design fellowships", "public-interest technology", "innovation challenges"],
    strengths: ["Portfolio shows public-service design work", "Strong Class 12 record", "Mentor feedback available"],
    gaps: ["Income limit may block some scholarships", "Research publication evidence is limited"],
    evidence: [
      { id: "portfolio", label: "Portfolio", summary: "Public-service interaction design case studies", source: "activity" },
      { id: "mentor", label: "Mentor note", summary: "Faculty mentor feedback available but not formal recommendation", source: "self-reported" }
    ]
  }
];

export const primaryProfileId = "ananya-rao";
export const profile = profiles.find((item) => item.id === primaryProfileId) ?? profiles[0];
export const canonicalGuidedDemoOpportunityId = "aicte-pragati-scholarship";

export const journey: Stage[] = ["Discover", "Assess", "Prepare", "Apply", "Verification", "Payment", "Renewal"];

export const demoStates: Record<DemoState, { label: string; stage: Stage; headline: string; action: string; href: string }> = {
  discover: {
    label: "Discover",
    stage: "Discover",
    headline: "Shortlist AICTE Pragati",
    action: "Explore opportunity",
    href: "/demo"
  },
  assess: {
    label: "Assess",
    stage: "Assess",
    headline: "Review Disha's evidence-backed assessment",
    action: "Open assessment",
    href: "/opportunities/aicte-pragati-scholarship/assess"
  },
  prepare: {
    label: "Prepare",
    stage: "Prepare",
    headline: "Refresh the critical document",
    action: "Prepare packet",
    href: "/preflight"
  },
  apply: {
    label: "Apply",
    stage: "Apply",
    headline: "Submit the application",
    action: "Continue application",
    href: "/apply"
  },
  verification: {
    label: "Verification delay",
    stage: "Verification",
    headline: "Your institute needs to act next",
    action: "Track verification",
    href: "/applications/pragati-readiness-2026"
  },
  payment: {
    label: "Payment issue",
    stage: "Payment",
    headline: "Your bank details need attention",
    action: "Review payment",
    href: "/payments/pragati-payment-2026"
  },
  "payment-blocker": {
    label: "Payment blocker",
    stage: "Payment",
    headline: "You own the payment correction",
    action: "Fix payment",
    href: "/payments/pragati-payment-2026"
  },
  "payment-corrected": {
    label: "Payment revalidation",
    stage: "Payment",
    headline: "PFMS owns the next validation",
    action: "Review payment",
    href: "/payments/pragati-payment-2026"
  },
  renewal: {
    label: "Renewal",
    stage: "Renewal",
    headline: "Renewal is the active next step",
    action: "Open renewal",
    href: "/renewal"
  }
};

export const institution = {
  name: "Bengaluru Institute of Technology",
  cell: "BIT Scholarship and Research Cell",
  linked: "Yes",
  enrolmentConfirmed: "Yes",
  requiredAction: "Scholarship verification pending",
  completedDate: "26 August"
};

export type EvidenceFreshness = "current" | "stale" | "expiring" | "not-applicable";
export type EvidenceStatus = "verified" | "available" | "action-required" | "missing";

export type EvidenceRecord = {
  id: string;
  domain: "identity" | "education" | "financial" | "bank" | "document";
  label: string;
  value: string;
  status: EvidenceStatus;
  source: "Profile" | "Document upload" | "Institution record" | "Bank/PFMS record" | "Self-declared";
  freshness: EvidenceFreshness;
  verifiedBy?: string;
  note: string;
};

export type EvidencePassport = {
  applicantId: string;
  identity: {
    legalName: string;
    applicationName: string;
    identityConsistency: EvidenceStatus;
  };
  records: EvidenceRecord[];
};

export const ananyaEvidencePassport: EvidencePassport = {
  applicantId: primaryProfileId,
  identity: {
    legalName: "Ananya Rao",
    applicationName: "Ananya Rao",
    identityConsistency: "verified"
  },
  records: [
    {
      id: "legal-name",
      domain: "identity",
      label: "Legal name evidence",
      value: "Ananya Rao",
      status: "verified",
      source: "Document upload",
      freshness: "current",
      verifiedBy: "Aadhaar profile",
      note: "Legal name is consistent with the application profile."
    },
    {
      id: "institution-enrolment",
      domain: "education",
      label: "Current engineering enrolment",
      value: "Final-year B.Tech CSE at Bengaluru Institute of Technology",
      status: "verified",
      source: "Institution record",
      freshness: "current",
      verifiedBy: institution.cell,
      note: "BIT is recorded as an AICTE-approved technical institution for the demo profile."
    },
    {
      id: "academic-record",
      domain: "education",
      label: "Academic record",
      value: "8.3 CGPA; Class 12 score 86%",
      status: "available",
      source: "Document upload",
      freshness: "current",
      note: "Marksheet evidence is available and supports academic/institution verification."
    },
    {
      id: "family-income",
      domain: "financial",
      label: "Family income information",
      value: "Rs 3.2 lakh/year",
      status: "available",
      source: "Profile",
      freshness: "current",
      note: "Recorded income appears within the Pragati threshold."
    },
    {
      id: "income-certificate",
      domain: "financial",
      label: "Income certificate",
      value: "Income certificate uploaded, but not current enough for submission",
      status: "action-required",
      source: "Document upload",
      freshness: "stale",
      note: "Underlying income condition appears satisfied, but submission readiness depends on refreshing this proof."
    },
    {
      id: "bank-account",
      domain: "bank",
      label: "Bank account details",
      value: "State Bank of India account ending 2042",
      status: "verified",
      source: "Bank/PFMS record",
      freshness: "current",
      verifiedBy: "Bank validation",
      note: "Account exists and can be used for benefit transfer after name consistency checks."
    },
    {
      id: "beneficiary-name",
      domain: "bank",
      label: "Beneficiary name consistency",
      value: "Bank record: Ananya Rao",
      status: "available",
      source: "Bank/PFMS record",
      freshness: "current",
      note: "The correct bank record is available; a demo payment state shows what happens if application name is shortened."
    },
    {
      id: "submission-packet",
      domain: "document",
      label: "Application document packet",
      value: "Admission proof, academic record, income proof, bank details",
      status: "action-required",
      source: "Document upload",
      freshness: "expiring",
      note: "Most documents are present; the income certificate should be refreshed before final submission."
    }
  ]
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
    institutionAction: `${institution.name} must confirm your enrolment before the scholarship can proceed.`,
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
    title: "Karnataka higher education merit support",
    provider: "Karnataka Government",
    level: ["Undergraduate", "Postgraduate"],
    schemeType: ["Merit-based", "Need-based"],
    scope: "State",
    amount: "Fee reimbursement support",
    deadline: "22 November",
    applicability: "Karnataka",
    cycle: "Fresh and renewal",
    availability: "open",
    status: "Eligible",
    match: "State match",
    explanation: "A representative Karnataka higher education scheme for students meeting simplified merit and income checks.",
    cta: "View details",
    criteria: ["Karnataka domicile", "Higher education enrolment", "Household income up to ₹6 lakh"],
    evidence: [],
    institutionAction: "Institution verifies enrolment and fee details.",
    requiredProfileFields: [],
    rules: { education: ["Undergraduate", "Postgraduate", "Professional / Technical degree"], levels: ["Undergraduate", "Postgraduate"], states: ["Karnataka"], incomeMaxLakh: 6, scoreMin: 60 }
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

export type OwnershipRailState = "completed" | "current" | "waiting" | "blocked" | "student-action";

export type OwnershipStage = {
  id: string;
  actor: string;
  state: OwnershipRailState;
  detail: string;
};

export type OwnershipSnapshot = {
  id: string;
  label: string;
  status: string;
  currentOwner: string;
  applicantAction: string;
  summary: string;
  evidence: string;
  expectedBy?: string;
  lastUpdated?: string;
  blockerReason?: string;
  nextExpectedOwner?: string;
  rail: OwnershipStage[];
};

export type DemoApplication = {
  id: string;
  referenceId?: string;
  opportunityId: string;
  title: string;
  category: string;
  provider: string;
  status: string;
  owner: string;
  nextStep: string;
  benefit: string;
  href: string;
  tone: "active" | "warning" | "danger" | "success" | "neutral";
  canonicalStage: Stage;
  documents: string[];
  ownership: {
    defaultSnapshot: string;
    snapshots: Record<string, OwnershipSnapshot>;
  };
};

export const demoApplications: DemoApplication[] = [
  {
    id: "pragati-readiness-2026",
    referenceId: "NSP-PRAGATI-2026-20418",
    opportunityId: "aicte-pragati-scholarship",
    title: "AICTE Pragati Scholarship",
    category: "Scholarship",
    provider: "AICTE",
    status: "Institute verification",
    owner: institution.cell,
    nextStep: `${institution.name} is reviewing Ananya's submitted AICTE Pragati application.`,
    benefit: "Rs 50,000/year",
    href: "/applications/pragati-readiness-2026",
    tone: "active",
    canonicalStage: "Verification",
    documents: ["Admission proof", "Income certificate", "Bank details", "Institution record", "Enrolment proof"],
    ownership: {
      defaultSnapshot: "institution-review",
      snapshots: {
        strengthen: {
          id: "strengthen",
          label: "Readiness blocker",
          status: "Action required from student",
          currentOwner: "Student",
          applicantAction: "Replace income certificate and attach enrolment proof.",
          summary: "Disha is still strengthening the application packet before submission.",
          evidence: "Income certificate validity risk · enrolment proof not attached",
          blockerReason: "Student-controlled evidence is incomplete.",
          nextExpectedOwner: institution.cell,
          rail: [
            { id: "student", actor: "Student", state: "student-action", detail: "Action needed" },
            { id: "institution", actor: institution.name, state: "waiting", detail: "Waiting" },
            { id: "scheme", actor: "Scheme", state: "waiting", detail: "Waiting" }
          ]
        },
        "institution-review": {
          id: "institution-review",
          label: "Waiting on institution",
          status: "Institute verification · Day 2",
          currentOwner: institution.cell,
          applicantAction: "Nothing required from you right now.",
          summary: "Ananya submitted the AICTE Pragati Scholarship application. The scholarship cell is reviewing enrolment and submitted documents.",
          evidence: "Application submitted · enrolment proof attached · institute verification pending",
          expectedBy: "5 November",
          lastUpdated: "1 November",
          nextExpectedOwner: "AICTE verification",
          rail: [
            { id: "student", actor: "Student", state: "completed", detail: "Submitted" },
            { id: "institution", actor: institution.name, state: "current", detail: "Reviewing" },
            { id: "verification", actor: "AICTE verification", state: "waiting", detail: "Next" },
            { id: "pfms", actor: "PFMS", state: "waiting", detail: "Waiting" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Waiting" }
          ]
        }
      }
    }
  },
  {
    id: "css-2026",
    opportunityId: "pm-usp-csss",
    title: "PM-USP Central Sector Scholarship",
    category: "Scholarship",
    provider: "Department of Higher Education",
    status: "Institute verification",
    owner: institution.cell,
    nextStep: `${institution.name} is reviewing enrolment and submitted documents.`,
    benefit: "Rs 12,000",
    href: "/applications/css-2026",
    tone: "active",
    canonicalStage: "Verification",
    documents: ["Aadhaar verification record", "Income certificate", "Bank account details", "Institute enrolment proof"],
    ownership: {
      defaultSnapshot: "institution-review",
      snapshots: {
        "institution-review": {
          id: "institution-review",
          label: "Waiting on institution",
          status: "Institute verification · Day 6",
          currentOwner: institution.cell,
          applicantAction: "Nothing required from you right now.",
          summary: "Your scholarship cell is reviewing your enrolment and submitted documents.",
          evidence: "Institute verification pending · updated 27 Aug",
          expectedBy: "2 September",
          lastUpdated: "27 Aug",
          nextExpectedOwner: "Verification Authority",
          rail: [
            { id: "student", actor: "Student", state: "completed", detail: "Done" },
            { id: "institution", actor: institution.name, state: "current", detail: "Reviewing" },
            { id: "verification", actor: "Verification Authority", state: "waiting", detail: "Next" },
            { id: "scheme", actor: "Scheme Authority", state: "waiting", detail: "Waiting" },
            { id: "pfms", actor: "PFMS", state: "waiting", detail: "Waiting" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Waiting" }
          ]
        }
      }
    }
  },
  {
    id: "anrf-arg-2026",
    opportunityId: "anrf-advanced-research-grant",
    title: "ANRF Advanced Research Grant",
    category: "Research Grant",
    provider: "Anusandhan National Research Foundation",
    status: "Scientific review",
    owner: "ANRF review panel",
    nextStep: "Peer review is checking novelty, method and expected outcomes.",
    benefit: "Project grant support",
    href: "/applications/anrf-arg-2026",
    tone: "active",
    canonicalStage: "Verification",
    documents: ["Research proposal", "Host institution endorsement", "Budget statement", "PI CV and publication list"],
    ownership: {
      defaultSnapshot: "review-panel",
      snapshots: {
        "review-panel": {
          id: "review-panel",
          label: "Verification in progress",
          status: "Scientific review · Week 3",
          currentOwner: "ANRF review panel",
          applicantAction: "Nothing required unless the panel asks for a clarification.",
          summary: "The ANRF desk has completed administrative screening. Reviewers are checking novelty, methodology, investigator record and expected outcomes.",
          evidence: "Host endorsement and budget uploaded · review panel assigned",
          nextExpectedOwner: "Funding decision",
          rail: [
            { id: "applicant", actor: "Applicant", state: "completed", detail: "Submitted" },
            { id: "host", actor: "Host institution", state: "completed", detail: "Endorsed" },
            { id: "desk", actor: "ANRF desk", state: "completed", detail: "Screened" },
            { id: "review", actor: "Review panel", state: "current", detail: "Reviewing" },
            { id: "decision", actor: "Funding decision", state: "waiting", detail: "Next" }
          ]
        }
      }
    }
  },
  {
    id: "sisfs-2026",
    opportunityId: "startup-india-seed-fund",
    title: "Startup India Seed Fund Scheme",
    category: "Startup Funding",
    provider: "DPIIT / partner incubator",
    status: "Incubator screening",
    owner: "Partner incubator",
    nextStep: "Pitch deck accepted; budget milestones need one clarification.",
    benefit: "Up to Rs 50 lakh",
    href: "/applications/sisfs-2026",
    tone: "warning",
    canonicalStage: "Verification",
    documents: ["Pitch deck", "Prototype note", "DPIIT recognition draft", "Milestone budget clarification"],
    ownership: {
      defaultSnapshot: "incubator-clarification",
      snapshots: {
        "incubator-clarification": {
          id: "incubator-clarification",
          label: "Action required from student",
          status: "Incubator screening · Action needed",
          currentOwner: "Partner incubator",
          applicantAction: "Clarify the fund-utilisation milestone table.",
          summary: "The application passed initial fit screening. The incubator needs the seed-fund use split into milestone costs before pitch review.",
          evidence: "Pitch deck accepted · fund-use clarification requested",
          blockerReason: "Budget milestones are not specific enough for pitch review.",
          nextExpectedOwner: "Pitch panel",
          rail: [
            { id: "founder", actor: "Founder", state: "completed", detail: "Applied" },
            { id: "incubator", actor: "Incubator", state: "student-action", detail: "Clarification" },
            { id: "pitch", actor: "Pitch panel", state: "waiting", detail: "Next" },
            { id: "dpiit", actor: "DPIIT", state: "waiting", detail: "Waiting" },
            { id: "release", actor: "Milestone release", state: "waiting", detail: "Waiting" }
          ]
        }
      }
    }
  },
  {
    id: "css-payment-2026",
    opportunityId: "pm-usp-csss",
    title: "PM-USP Central Sector Scholarship",
    category: "Scholarship",
    provider: "Department of Higher Education",
    status: "Payment blocker",
    owner: "Student",
    nextStep: "Beneficiary name mismatch must be corrected before PFMS and bank validation can continue.",
    benefit: "Rs 12,000",
    href: "/payments/css-2026",
    tone: "danger",
    canonicalStage: "Payment",
    documents: ["Sanction order", "PFMS beneficiary record", "Bank account details"],
    ownership: {
      defaultSnapshot: "bank-blocker",
      snapshots: {
        "bank-blocker": {
          id: "bank-blocker",
          label: "Payment blocker",
          status: "Bank validation failed",
          currentOwner: "Student",
          applicantAction: "Correct beneficiary name.",
          summary: "The scholarship has been approved and sent to PFMS. A beneficiary name mismatch is stopping payment credit.",
          evidence: "Beneficiary name mismatch · updated 27 Aug",
          blockerReason: "Application beneficiary name does not match the bank record.",
          nextExpectedOwner: "PFMS and Bank",
          rail: [
            { id: "authority", actor: "Scheme Authority", state: "completed", detail: "Done" },
            { id: "pfms", actor: "PFMS", state: "completed", detail: "Done" },
            { id: "student", actor: "Student", state: "student-action", detail: "Action needed" },
            { id: "bank", actor: "Bank", state: "blocked", detail: "Blocked" }
          ]
        },
        revalidation: {
          id: "revalidation",
          label: "Blocker resolved",
          status: "Revalidation pending",
          currentOwner: "PFMS and bank",
          applicantAction: "Nothing else required from you.",
          summary: "Your payment is back with PFMS and your bank for validation.",
          evidence: "Beneficiary name updated · revalidation requested",
          nextExpectedOwner: "Bank",
          rail: [
            { id: "authority", actor: "Scheme Authority", state: "completed", detail: "Done" },
            { id: "student", actor: "Student", state: "completed", detail: "Done" },
            { id: "pfms", actor: "PFMS", state: "current", detail: "Revalidating" },
            { id: "bank", actor: "Bank", state: "current", detail: "Checking" }
          ]
        }
      }
    }
  },
  {
    id: "pragati-payment-2026",
    referenceId: "NSP-PRAGATI-2026-20418",
    opportunityId: "aicte-pragati-scholarship",
    title: "AICTE Pragati Scholarship",
    category: "Scholarship",
    provider: "AICTE",
    status: "Payment blocker",
    owner: "Student",
    nextStep: "Correct the beneficiary name so PFMS and bank validation can continue.",
    benefit: "Rs 50,000/year",
    href: "/payments/pragati-payment-2026",
    tone: "danger",
    canonicalStage: "Payment",
    documents: ["Sanction order", "PFMS beneficiary record", "Bank account details", "AICTE scholarship record"],
    ownership: {
      defaultSnapshot: "bank-blocker",
      snapshots: {
        "bank-blocker": {
          id: "bank-blocker",
          label: "Payment blocker",
          status: "Bank validation failed",
          currentOwner: "Student",
          applicantAction: "Correct beneficiary name.",
          summary: "AICTE approved Ananya's Pragati scholarship and sent it for payment validation. A beneficiary name mismatch is stopping the credit.",
          evidence: "Application name Ananya R. does not match bank record Ananya Rao",
          blockerReason: "The scholarship record and bank record must match before PFMS can complete payment validation.",
          nextExpectedOwner: "PFMS and Bank",
          rail: [
            { id: "student", actor: "Student", state: "student-action", detail: "Fix name" },
            { id: "institution", actor: institution.name, state: "completed", detail: "Verified" },
            { id: "authority", actor: "AICTE", state: "completed", detail: "Approved" },
            { id: "pfms", actor: "PFMS", state: "blocked", detail: "Blocked" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Waiting" }
          ]
        },
        revalidation: {
          id: "revalidation",
          label: "Name corrected",
          status: "Revalidation pending",
          currentOwner: "PFMS and bank",
          applicantAction: "Nothing else required from you.",
          summary: "Name corrected. The payment is now back with PFMS and Ananya's bank for validation.",
          evidence: "Beneficiary name corrected · revalidation requested",
          nextExpectedOwner: "Bank",
          rail: [
            { id: "student", actor: "Student", state: "completed", detail: "Name corrected" },
            { id: "institution", actor: institution.name, state: "completed", detail: "Verified" },
            { id: "authority", actor: "AICTE", state: "completed", detail: "Approved" },
            { id: "pfms", actor: "PFMS", state: "current", detail: "Revalidating" },
            { id: "bank", actor: "Bank", state: "current", detail: "Checking" }
          ]
        }
      }
    }
  },
  {
    id: "pragati-renewal-2027",
    referenceId: "NSP-PRAGATI-2027-20418",
    opportunityId: "aicte-pragati-scholarship",
    title: "AICTE Pragati Scholarship",
    category: "Scholarship",
    provider: "AICTE",
    status: "Renewal upcoming",
    owner: "Student",
    nextStep: "Latest marksheet is needed before renewal can be submitted.",
    benefit: "Rs 50,000 renewal",
    href: "/renewal",
    tone: "warning",
    canonicalStage: "Renewal",
    documents: ["Latest marksheet", "Continuation certificate", "Bank details", "Institution renewal record"],
    ownership: {
      defaultSnapshot: "needs-marksheet",
      snapshots: {
        "needs-marksheet": {
          id: "needs-marksheet",
          label: "Renewal handoff",
          status: "Latest marksheet required",
          currentOwner: "Student",
          applicantAction: "Upload latest marksheet.",
          summary: "Ananya needs to add the latest marksheet before the AICTE Pragati renewal can move to institution verification.",
          evidence: "Latest marksheet missing · student owns the next action",
          blockerReason: "Renewal packet is incomplete.",
          nextExpectedOwner: institution.cell,
          rail: [
            { id: "student", actor: "Student", state: "student-action", detail: "Action needed" },
            { id: "institution", actor: institution.name, state: "waiting", detail: "Waiting" },
            { id: "authority", actor: "AICTE", state: "waiting", detail: "Waiting" },
            { id: "pfms", actor: "PFMS", state: "waiting", detail: "Not started" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Not started" }
          ]
        },
        "ready-to-submit": {
          id: "ready-to-submit",
          label: "Renewal ready",
          status: "Ready to submit",
          currentOwner: "Student",
          applicantAction: "Submit renewal application.",
          summary: "The latest marksheet is attached. Submit the renewal application to hand it to the institution.",
          evidence: "Latest marksheet added · renewal application ready to submit",
          nextExpectedOwner: institution.cell,
          rail: [
            { id: "student", actor: "Student", state: "current", detail: "Submit" },
            { id: "institution", actor: institution.name, state: "waiting", detail: "Waiting" },
            { id: "authority", actor: "AICTE", state: "waiting", detail: "Waiting" },
            { id: "pfms", actor: "PFMS", state: "waiting", detail: "Not started" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Not started" }
          ]
        },
        submitted: {
          id: "submitted",
          label: "Renewal submitted",
          status: `Waiting on ${institution.name}`,
          currentOwner: institution.cell,
          applicantAction: "Your part is complete.",
          summary: `Ananya's AICTE Pragati renewal is now with ${institution.name} for renewal verification.`,
          evidence: `Renewal submitted · institution verification pending with ${institution.name}`,
          nextExpectedOwner: "AICTE",
          rail: [
            { id: "student", actor: "Student", state: "completed", detail: "Done" },
            { id: "institution", actor: institution.name, state: "current", detail: "Reviewing" },
            { id: "authority", actor: "AICTE", state: "waiting", detail: "Next" },
            { id: "pfms", actor: "PFMS", state: "waiting", detail: "Waiting" },
            { id: "bank", actor: "Bank", state: "waiting", detail: "Waiting" }
          ]
        }
      }
    }
  },
  {
    id: "css-renewal-2027",
    opportunityId: "pm-usp-csss",
    title: "PM-USP Central Sector Scholarship",
    category: "Scholarship",
    provider: "Department of Higher Education",
    status: "Renewal upcoming",
    owner: "Student",
    nextStep: "Latest marksheet is needed before renewal can be submitted.",
    benefit: "Rs 20,000 renewal",
    href: "/renewal",
    tone: "warning",
    canonicalStage: "Renewal",
    documents: ["Latest marksheet", "Continuation certificate", "Bank details"],
    ownership: {
      defaultSnapshot: "needs-marksheet",
      snapshots: {
        "needs-marksheet": {
          id: "needs-marksheet",
          label: "Renewal handoff",
          status: "Latest marksheet required",
          currentOwner: "Student",
          applicantAction: "Upload latest marksheet.",
          summary: "Your marksheet is required before the renewal application can be submitted.",
          evidence: "Latest marksheet missing · student owns the next action",
          blockerReason: "Renewal packet is incomplete.",
          nextExpectedOwner: institution.cell,
          rail: [
            { id: "student", actor: "Student", state: "student-action", detail: "Action needed" },
            { id: "institution", actor: institution.name, state: "waiting", detail: "Waiting" },
            { id: "scheme", actor: "Scheme Authority", state: "waiting", detail: "Waiting" },
            { id: "payment", actor: "Payment", state: "waiting", detail: "Not started" }
          ]
        },
        "ready-to-submit": {
          id: "ready-to-submit",
          label: "Renewal ready",
          status: "Ready to submit",
          currentOwner: "Student",
          applicantAction: "Submit renewal application.",
          summary: "Your marksheet is added. Submit the renewal application to hand it to your institution.",
          evidence: "Latest marksheet added · renewal application ready to submit",
          nextExpectedOwner: institution.cell,
          rail: [
            { id: "student", actor: "Student", state: "current", detail: "Submit" },
            { id: "institution", actor: institution.name, state: "waiting", detail: "Waiting" },
            { id: "scheme", actor: "Scheme Authority", state: "waiting", detail: "Waiting" },
            { id: "payment", actor: "Payment", state: "waiting", detail: "Not started" }
          ]
        },
        submitted: {
          id: "submitted",
          label: "Renewal submitted",
          status: `Waiting on ${institution.name}`,
          currentOwner: institution.cell,
          applicantAction: "Your part is complete.",
          summary: `Your renewal is now with ${institution.name} for institution verification.`,
          evidence: `Renewal submitted · institution verification pending with ${institution.name}`,
          nextExpectedOwner: "Scheme Authority",
          rail: [
            { id: "student", actor: "Student", state: "completed", detail: "Done" },
            { id: "institution", actor: institution.name, state: "current", detail: "Reviewing" },
            { id: "scheme", actor: "Scheme Authority", state: "waiting", detail: "Waiting" },
            { id: "payment", actor: "Payment", state: "waiting", detail: "Not started" }
          ]
        }
      }
    }
  }
];

export function getDemoApplication(id: string) {
  return demoApplications.find((application) => application.id === id);
}

export function getDemoApplicationByOpportunityId(opportunityId: string) {
  return demoApplications.find((application) => application.opportunityId === opportunityId && application.canonicalStage === "Verification");
}

export function getGuidedDemoApplication(opportunityId = canonicalGuidedDemoOpportunityId) {
  return getDemoApplicationByOpportunityId(opportunityId) ?? getDemoApplicationByOpportunityId(canonicalGuidedDemoOpportunityId);
}

export function getGuidedDemoPaymentApplication(opportunityId = canonicalGuidedDemoOpportunityId) {
  return (
    demoApplications.find((application) => application.opportunityId === opportunityId && application.canonicalStage === "Payment") ??
    demoApplications.find((application) => application.opportunityId === canonicalGuidedDemoOpportunityId && application.canonicalStage === "Payment")
  );
}

export function getGuidedDemoRenewalApplication(opportunityId = canonicalGuidedDemoOpportunityId) {
  return (
    demoApplications.find((application) => application.opportunityId === opportunityId && application.canonicalStage === "Renewal") ??
    demoApplications.find((application) => application.opportunityId === canonicalGuidedDemoOpportunityId && application.canonicalStage === "Renewal")
  );
}

export function normalizeDemoState(value: string | null | undefined): DemoState {
  if (
    value === "discover" ||
    value === "assess" ||
    value === "prepare" ||
    value === "apply" ||
    value === "verification" ||
    value === "payment" ||
    value === "payment-blocker" ||
    value === "payment-corrected" ||
    value === "renewal"
  ) {
    return value;
  }
  return "assess";
}

export function stageForDemoState(state: DemoState): Stage {
  return demoStates[state].stage;
}

export function getCanonicalApplicationForDemoState(state: DemoState, opportunityId = canonicalGuidedDemoOpportunityId): DemoApplication {
  const verificationApplication = getGuidedDemoApplication(opportunityId) ?? demoApplications[0];
  const paymentApplication = getGuidedDemoPaymentApplication(opportunityId);
  const renewalApplication = getGuidedDemoRenewalApplication(opportunityId);

  if (state === "payment" || state === "payment-blocker") {
    return {
      ...verificationApplication,
      status: paymentApplication?.status ?? "Payment blocker",
      owner: "Student",
      nextStep: paymentApplication?.nextStep ?? "Correct the beneficiary name so PFMS and bank validation can continue.",
      href: paymentApplication?.href ?? "/payments/pragati-payment-2026",
      tone: "danger",
      canonicalStage: "Payment",
      documents: paymentApplication?.documents ?? verificationApplication.documents,
      ownership: paymentApplication?.ownership ?? verificationApplication.ownership
    };
  }

  if (state === "payment-corrected") {
    const paymentOwnership = paymentApplication?.ownership ?? verificationApplication.ownership;
    return {
      ...verificationApplication,
      status: "Revalidation pending",
      owner: "PFMS and bank",
      nextStep: "Beneficiary name is corrected. PFMS and the bank now own validation.",
      href: paymentApplication?.href ?? "/payments/pragati-payment-2026",
      tone: "active",
      canonicalStage: "Payment",
      documents: paymentApplication?.documents ?? verificationApplication.documents,
      ownership: { ...paymentOwnership, defaultSnapshot: "revalidation" }
    };
  }

  if (state === "renewal") {
    return {
      ...verificationApplication,
      status: renewalApplication?.status ?? "Renewal upcoming",
      owner: "Student",
      nextStep: renewalApplication?.nextStep ?? "Latest marksheet is needed before renewal can be submitted.",
      href: renewalApplication?.href ?? "/renewal",
      tone: "warning",
      canonicalStage: "Renewal",
      documents: renewalApplication?.documents ?? verificationApplication.documents,
      ownership: renewalApplication?.ownership ?? verificationApplication.ownership
    };
  }

  if (state === "discover" || state === "assess" || state === "prepare" || state === "apply") {
    const statusByState: Record<DemoState, string> = {
      discover: "Not submitted",
      assess: "Assessment ready",
      prepare: "Strengthening evidence",
      apply: "Ready to submit",
      verification: verificationApplication.status,
      payment: "Payment blocker",
      "payment-blocker": "Payment blocker",
      "payment-corrected": "Revalidation pending",
      renewal: "Renewal upcoming"
    };
    const ownerByState: Record<DemoState, string> = {
      discover: "Student",
      assess: "Disha assessment",
      prepare: "Student",
      apply: "Student",
      verification: verificationApplication.owner,
      payment: "Student",
      "payment-blocker": "Student",
      "payment-corrected": "PFMS and bank",
      renewal: "Student"
    };
    return {
      ...verificationApplication,
      status: statusByState[state],
      owner: ownerByState[state],
      nextStep:
        state === "discover"
          ? "No submitted application yet. Open the assessment before starting the packet."
          : state === "assess"
            ? "Review Disha's evidence-backed assessment before preparing the packet."
            : state === "prepare"
              ? "Refresh the current income proof before final submission."
              : "Submit the application when the packet is reviewed.",
      href:
        state === "discover" || state === "assess"
          ? `/opportunities/${opportunityId}/assess`
          : state === "prepare"
            ? "/preflight"
            : "/apply",
      tone: state === "prepare" ? "warning" : "active",
      canonicalStage: demoStates[state].stage,
      ownership: {
        ...verificationApplication.ownership,
        defaultSnapshot: state === "prepare" ? "strengthen" : verificationApplication.ownership.defaultSnapshot
      }
    };
  }

  return verificationApplication;
}

export function getApplicationReference(application: DemoApplication) {
  return application.referenceId ?? applicationId;
}

export function getApplicationOwnership(application: DemoApplication, snapshotId = application.ownership.defaultSnapshot) {
  return application.ownership.snapshots[snapshotId] ?? application.ownership.snapshots[application.ownership.defaultSnapshot];
}
