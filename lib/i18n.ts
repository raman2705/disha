export type Language = "en" | "hi";

export const languageLabels: Record<Language, string> = {
  en: "EN",
  hi: "हिंदी"
};

export const translations = {
  en: {
    nav: {
      opportunities: "Opportunities",
      applications: "My Applications",
      path: "My Path",
      resources: "Resources",
      search: "Search",
      assistant: "Disha Assistant"
    },
    home: {
      eyebrow: "EXPLORE • ASSESS • APPLY • GROW",
      headline: "Where do you want to go next?",
      body: "Disha helps you find, assess and navigate scholarships, grants, fellowships and government opportunities.",
      searchPlaceholder: "Tell Disha what you're looking for...",
      try: "Try:",
      opportunitiesForYou: "Opportunities for you",
      curated: "Curated from Indian programs across scholarships, grants, fellowships, startup funding and public schemes.",
      viewAll: "View all opportunities",
      continue: "Continue with Disha",
      continueBody: "Pick up where you left off",
      assistantTitle: "Meet Disha Assistant",
      assistantBody: "Ask questions, get clarity, and take the next step.",
      footerLine: "Same opportunities. A brighter tomorrow.",
      records: "records",
      completeAssessment: "Complete your assessment",
      applicationsAttention: "3 applications need attention",
      reviewNeeded: "Scholarship, research and startup updates",
      researchPathway: "Your research funding pathway",
      profileInterests: "Based on your profile and interests"
    },
    categories: {
      Scholarships: "Scholarships",
      "Research Grants": "Research Grants",
      Fellowships: "Fellowships",
      "Startup Funding": "Startup Funding",
      "Government Schemes": "Government Schemes"
    },
    assessment: {
      assess: "Assess with Disha",
      access: "Access",
      eligibility: "Eligibility",
      competitiveness: "Competitiveness",
      readiness: "Readiness",
      evaluatorLens: "Evaluator Lens",
      biggestGap: "Your biggest gap",
      strengthen: "What would strengthen this application?",
      pass: "Pass",
      fail: "Fail",
      unknown: "Unknown",
      strong: "Strong",
      moderate: "Moderate",
      weak: "Weak",
      missing: "Missing",
      source: "Source",
      evidence: "Evidence",
      gap: "Gap",
      action: "Recommended action"
    },
    assistant: {
      title: "Disha Assistant",
      placeholder: "Ask Disha anything...",
      send: "Ask",
      sampleAnswer:
        "Disha is using your current evidence, the opportunity criteria, and application state. It will point to the next useful action instead of giving a generic answer."
    },
    statuses: {
      waitingOnInstitution: "Waiting on institution",
      bankValidationFailed: "Bank validation failed",
      studentAction: "Student action needed",
      nothingRequired: "Nothing required from you"
    }
  },
  hi: {
    nav: {
      opportunities: "अवसर",
      applications: "मेरे आवेदन",
      path: "मेरा पथ",
      resources: "संसाधन",
      search: "खोजें",
      assistant: "दिशा सहायक"
    },
    home: {
      eyebrow: "खोजें • आकलन करें • आवेदन करें • आगे बढ़ें",
      headline: "आप आगे कहां जाना चाहते हैं?",
      body: "दिशा छात्रवृत्ति, अनुदान, फेलोशिप और सरकारी अवसर खोजने, समझने और आगे बढ़ाने में मदद करता है।",
      searchPlaceholder: "दिशा को बताएं कि आप क्या खोज रहे हैं...",
      try: "आजमाएं:",
      opportunitiesForYou: "आपके लिए अवसर",
      curated: "भारत के छात्रवृत्ति, अनुदान, फेलोशिप, स्टार्टअप फंडिंग और सार्वजनिक योजनाओं से चुने गए अवसर।",
      viewAll: "सभी अवसर देखें",
      continue: "दिशा के साथ जारी रखें",
      continueBody: "जहां छोड़ा था वहां से आगे बढ़ें",
      assistantTitle: "दिशा सहायक से मिलें",
      assistantBody: "प्रश्न पूछें, स्पष्टता पाएं और अगला कदम लें।",
      footerLine: "वही अवसर। बेहतर कल।",
      records: "रिकॉर्ड",
      completeAssessment: "अपना आकलन पूरा करें",
      applicationsAttention: "3 आवेदनों पर ध्यान चाहिए",
      reviewNeeded: "छात्रवृत्ति, शोध और स्टार्टअप अपडेट",
      researchPathway: "आपका शोध फंडिंग पथ",
      profileInterests: "आपकी प्रोफाइल और रुचियों के आधार पर"
    },
    categories: {
      Scholarships: "छात्रवृत्ति",
      "Research Grants": "शोध अनुदान",
      Fellowships: "फेलोशिप",
      "Startup Funding": "स्टार्टअप फंडिंग",
      "Government Schemes": "सरकारी योजनाएं"
    },
    assessment: {
      assess: "दिशा से आकलन करें",
      access: "प्रवेश",
      eligibility: "पात्रता",
      competitiveness: "प्रतिस्पर्धात्मकता",
      readiness: "तैयारी",
      evaluatorLens: "मूल्यांकन दृष्टि",
      biggestGap: "आपकी सबसे बड़ी कमी",
      strengthen: "इस आवेदन को क्या मजबूत करेगा?",
      pass: "पास",
      fail: "असफल",
      unknown: "अज्ञात",
      strong: "मजबूत",
      moderate: "मध्यम",
      weak: "कमजोर",
      missing: "अनुपलब्ध",
      source: "स्रोत",
      evidence: "साक्ष्य",
      gap: "कमी",
      action: "सुझाया कदम"
    },
    assistant: {
      title: "दिशा सहायक",
      placeholder: "दिशा से कुछ भी पूछें...",
      send: "पूछें",
      sampleAnswer:
        "दिशा आपके मौजूदा साक्ष्य, अवसर के मानदंड और आवेदन स्थिति देखकर अगला उपयोगी कदम बताता है।"
    },
    statuses: {
      waitingOnInstitution: "संस्थान पर प्रतीक्षा",
      bankValidationFailed: "बैंक सत्यापन असफल",
      studentAction: "छात्र को कार्रवाई करनी है",
      nothingRequired: "आपसे अभी कोई कार्रवाई नहीं चाहिए"
    }
  }
} as const;
