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

export const scholarships = [
  {
    id: "central-sector-scholarship",
    title: "Central Sector Scholarship",
    amount: "₹12,000/year",
    deadline: "31 October",
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
    institutionAction: "ABC College must confirm your enrolment before the scholarship can proceed."
  },
  {
    id: "post-matric-scholarship",
    title: "Post-Matric Scholarship",
    amount: "₹10,000-₹15,000/year",
    deadline: "18 November",
    status: "Needs information",
    match: "Likely match",
    explanation:
      "Your profile appears eligible, but your income certificate needs to be checked before eligibility can be confirmed.",
    cta: "Check eligibility",
    criteria: ["Post-matric enrolment", "Income certificate review", "Institute endorsement"],
    evidence: [
      { label: "Your education", value: "Undergraduate", requirement: "Requirement: post-matric study", result: "pass" },
      { label: "Missing check", value: "Income certificate", requirement: "Needs document review", result: "warning" }
    ],
    institutionAction: "ABC College may need to endorse your enrolment after your certificate is checked."
  },
  {
    id: "merit-cum-means-scholarship",
    title: "Merit-cum-Means Scholarship",
    amount: "₹20,000/year",
    deadline: "5 December",
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
    institutionAction: "Institute confirmation is only required if the income criterion is met."
  }
];

export const readyChecklist = [
  "Aadhaar verified",
  "Academic details complete",
  "Bank account added",
  "Income certificate validity risk",
  "Institute enrolment proof missing"
];

export const applicationId = "NSP-CSS-2026-10482";
