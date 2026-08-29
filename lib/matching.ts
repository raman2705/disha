import { Scholarship, scholarships } from "@/lib/data";

export type MatchProfile = {
  education?: string;
  domicile?: string;
  income?: string;
  score?: string;
  institution?: string;
  institutionType?: string;
  course?: string;
  yearOfStudy?: string;
  category?: string;
  gender?: string;
  disability?: string;
  minority?: string;
  hosteller?: string;
  existingScholarship?: string;
  renewalStatus?: string;
};

export type MatchEvidence = {
  label: string;
  value: string;
  requirement: string;
  result: "pass" | "warning" | "fail";
};

export type MatchResult = {
  scholarship: Scholarship;
  state: "recommended" | "could" | "ineligible";
  evidence: MatchEvidence[];
  missing: string[];
  failed: string[];
};

const fieldLabels: Record<string, string> = {
  category: "Category",
  course: "Course / discipline",
  disability: "Disability status",
  gender: "Gender",
  hosteller: "Hosteller / day scholar",
  institution: "Institution",
  institutionType: "Institution type",
  minority: "Minority/community criterion",
  renewalStatus: "Renewal status",
  yearOfStudy: "Year of study"
};

export function isCoreProfileComplete(profile: MatchProfile) {
  return Boolean(profile.education && profile.domicile && profile.income && profile.score);
}

export function evaluateScholarship(scholarship: Scholarship, profile: MatchProfile): MatchResult {
  const evidence: MatchEvidence[] = [];
  const missing = new Set<string>();
  const failed: string[] = [];
  const rules = scholarship.rules;

  if (rules.education?.length && profile.education) {
    const pass = rules.education.includes(profile.education as never);
    evidence.push({
      label: "Your education",
      value: profile.education,
      requirement: `Requirement: ${rules.education.join(", ")}`,
      result: pass ? "pass" : "fail"
    });
    if (!pass) failed.push("education");
  }

  if (rules.states?.length && profile.domicile) {
    const pass = rules.states.includes(profile.domicile);
    evidence.push({
      label: "Your domicile",
      value: profile.domicile,
      requirement: `Requirement: ${rules.states.join(", ")}`,
      result: pass ? "pass" : "fail"
    });
    if (!pass) failed.push("domicile");
  }

  if (rules.incomeMaxLakh && profile.income) {
    const pass = incomeBandPasses(profile.income, rules.incomeMaxLakh);
    evidence.push({
      label: "Your household income",
      value: profile.income,
      requirement: `Requirement: ${incomeRequirement(rules.incomeMaxLakh)}`,
      result: pass ? "pass" : "fail"
    });
    if (!pass) failed.push("income");
  }

  if (rules.scoreMin && profile.score) {
    const pass = scoreBandPasses(profile.score, rules.scoreMin);
    evidence.push({
      label: scoreLabel(profile.education),
      value: profile.score,
      requirement: `Requirement: ${rules.scoreMin}%+`,
      result: pass ? "pass" : "fail"
    });
    if (!pass) failed.push("score");
  }

  if (rules.categories?.length) {
    evaluateOptionalList("category", "Your category", rules.categories, profile.category, evidence, missing, failed);
  }

  if (rules.genders?.length) {
    evaluateOptionalList("gender", "Your gender", rules.genders, profile.gender, evidence, missing, failed);
  }

  if (rules.institutionTypes?.length) {
    evaluateOptionalList("institutionType", "Your institution type", rules.institutionTypes, profile.institutionType, evidence, missing, failed);
  }

  if (rules.courses?.length) {
    evaluateOptionalList("course", "Your course / discipline", rules.courses, profile.course, evidence, missing, failed);
  }

  if (rules.disabilityRequired) {
    evaluateOptionalBoolean("disability", "Disability status", profile.disability, evidence, missing, failed);
  }

  if (rules.minorityRequired) {
    evaluateOptionalBoolean("minority", "Minority/community criterion", profile.minority, evidence, missing, failed);
  }

  scholarship.requiredProfileFields.forEach((field) => {
    if (!profile[field as keyof MatchProfile]) missing.add(field);
  });

  const missingList = Array.from(missing);
  const state: MatchResult["state"] = failed.length > 0 ? "ineligible" : missingList.length > 0 ? "could" : "recommended";

  missingList.forEach((field) => {
    evidence.push({
      label: `${fieldLabels[field] ?? field} needed`,
      value: "Not provided",
      requirement: "Needed to confirm fit",
      result: "warning"
    });
  });

  return { scholarship, state, evidence, missing: missingList, failed };
}

export function evaluateScholarships(profile: MatchProfile) {
  return scholarships.map((scholarship) => evaluateScholarship(scholarship, profile));
}

export function sampleEligibilityProfile(): MatchProfile {
  return {
    education: "Undergraduate",
    domicile: "Delhi",
    income: "₹3.2 lakh",
    score: "80-89%",
    institution: "ABC College",
    institutionType: "Government / aided",
    course: "Economics",
    yearOfStudy: "Year 1",
    gender: "Female",
    disability: "No",
    minority: "No",
    hosteller: "Day scholar",
    existingScholarship: "No",
    renewalStatus: "Fresh"
  };
}

export function sortMatches(results: MatchResult[], sort: "Best fit" | "Deadline" | "Amount") {
  const order = { recommended: 0, could: 1, ineligible: 2 } as const;
  const ranked = [...results].sort((a, b) => order[a.state] - order[b.state]);

  if (sort === "Deadline") {
    return ranked.sort((a, b) => deadlineRank(a.scholarship.deadline) - deadlineRank(b.scholarship.deadline));
  }

  if (sort === "Amount") {
    return ranked.sort((a, b) => amountRank(b.scholarship.amount) - amountRank(a.scholarship.amount));
  }

  return ranked;
}

function evaluateOptionalList(
  field: string,
  label: string,
  allowed: string[],
  value: string | undefined,
  evidence: MatchEvidence[],
  missing: Set<string>,
  failed: string[]
) {
  if (!value) {
    missing.add(field);
    return;
  }
  const pass = allowed.includes(value);
  evidence.push({
    label,
    value,
    requirement: `Requirement: ${allowed.join(", ")}`,
    result: pass ? "pass" : "fail"
  });
  if (!pass) failed.push(field);
}

function evaluateOptionalBoolean(
  field: string,
  label: string,
  value: string | undefined,
  evidence: MatchEvidence[],
  missing: Set<string>,
  failed: string[]
) {
  if (!value) {
    missing.add(field);
    return;
  }
  const pass = value === "Yes";
  evidence.push({
    label,
    value,
    requirement: "Requirement: Yes",
    result: pass ? "pass" : "fail"
  });
  if (!pass) failed.push(field);
}

function incomeBandPasses(value: string, maxLakh: number) {
  const range = incomeRange(value);
  if (!range) return false;
  return range.min < maxLakh && range.max <= maxLakh;
}

function incomeRange(value: string) {
  const ranges: Record<string, { min: number; max: number }> = {
    "Below ₹1 lakh": { min: 0, max: 1 },
    "₹1-2.5 lakh": { min: 1, max: 2.5 },
    "₹2.5-4.5 lakh": { min: 2.5, max: 4.5 },
    "₹4.5-6 lakh": { min: 4.5, max: 6 },
    "₹6-8 lakh": { min: 6, max: 8 },
    "Above ₹8 lakh": { min: 8, max: Number.POSITIVE_INFINITY }
  };
  if (ranges[value]) return ranges[value];

  const exact = value.match(/₹?([0-9]+(?:\.[0-9]+)?)\s*lakh/i);
  if (exact) {
    const amount = Number(exact[1]);
    return { min: amount, max: amount };
  }

  return undefined;
}

function incomeRequirement(maxLakh: number) {
  if (maxLakh === 2.5) return "below ₹2.5 lakh";
  return `up to ₹${maxLakh} lakh`;
}

function scoreBandPasses(value: string, minimum: number) {
  if (value === "90%+") return minimum <= 90;
  if (value === "80-89%") return minimum <= 80;
  if (value === "70-79%") return minimum <= 70;
  if (value === "60-69%") return minimum <= 60;
  return false;
}

function scoreLabel(education?: string) {
  if (education === "Postgraduate" || education === "Research / PhD") return "Your latest academic score";
  return "Your Class 12 score";
}

function deadlineRank(deadline: string) {
  const day = Number.parseInt(deadline, 10);
  if (Number.isNaN(day)) return 99;
  return day;
}

function amountRank(amount: string) {
  const values = amount.match(/[0-9,]+/g)?.map((value) => Number(value.replace(/,/g, ""))) ?? [0];
  return Math.max(...values);
}
