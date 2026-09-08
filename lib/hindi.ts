import type { Language } from "@/lib/i18n";

/**
 * Hindi for the guided journey's content strings.
 *
 * The demo's narrative lives in `lib/data`, so translating it at every render site would mean
 * touching every screen. Instead this is a string catalogue applied at the data boundary: a page
 * passes the object it is about to render through `localise`, and every string inside it that has
 * a translation is swapped.
 *
 * Proper nouns are deliberately absent from the catalogue, so scheme names, institutions, people
 * and systems such as PFMS pass through untouched.
 */
const catalogue: Record<string, string> = {
  "Start with the scholarship most worth preparing.": "उस छात्रवृत्ति से शुरू करें जिसकी तैयारी सबसे अधिक सार्थक है।",
  "Institute verification · Day 2": "संस्थान सत्यापन · दिन 2",
  "Why this status?": "यह स्थिति क्यों?",
  "Most details are filled from your saved profile. Review each section before submission.": "अधिकांश विवरण आपकी सहेजी गई प्रोफ़ाइल से भरे गए हैं। जमा करने से पहले हर अनुभाग की समीक्षा करें।",
  "Review the saved profile values before continuing.": "आगे बढ़ने से पहले सहेजे गए मान देखें।",
  "From your profile": "आपकी प्रोफ़ाइल से",
  "Application submitted": "आवेदन जमा हो गया",
  "Application ID": "आवेदन आईडी",
  "Who acts next": "अगला कदम किसका",
  "Track application": "आवेदन ट्रैक करें",
  "Current status": "वर्तमान स्थिति",
  "Renewal preparation incomplete": "नवीनीकरण की तैयारी अधूरी",
  "Carried forward evidence": "आगे बढ़ाया गया प्रमाण",
  "New evidence required": "नया प्रमाण आवश्यक",
  "Institute": "संस्थान",
  "Programme": "कार्यक्रम",
  "Study level": "अध्ययन स्तर",
  "Class 12 score": "कक्षा 12 अंक",
  "Bank account": "बैंक खाता",
  "Submit application": "आवेदन जमा करें",
  "Institution status": "संस्थान की स्थिति",
  "You need to do anything?": "क्या आपको कुछ करना है?",
  "Your institute needs to act next": "अगला कदम आपके संस्थान का है",
  "Research internship": "शोध इंटर्नशिप",
  "Final-year project": "अंतिम वर्ष परियोजना",
  "Scholarships": "छात्रवृत्तियाँ",
  "Startup Funding": "स्टार्टअप फंडिंग",
  "Research Grants": "अनुसंधान अनुदान",
  "Fellowships": "फ़ेलोशिप",
  "Government Schemes": "सरकारी योजनाएँ",
  "Useful context, but not the main guided path.": "उपयोगी संदर्भ, पर मुख्य निर्देशित मार्ग नहीं।",
  "Her final-year project and research internship create a credible innovation story, but the application needs stronger independent evidence.": "उनकी अंतिम वर्ष परियोजना और शोध इंटर्नशिप एक विश्वसनीय नवाचार कहानी बनाती हैं, पर आवेदन को अधिक मज़बूत स्वतंत्र प्रमाण चाहिए।",
  "This route is intended for SC students in notified institutions. Ananya's current profile does not show that eligibility requirement.": "यह मार्ग अधिसूचित संस्थानों के अनुसूचित जाति के छात्रों के लिए है। अनन्या की वर्तमान प्रोफ़ाइल वह पात्रता नहीं दिखाती।",
  "Add marksheet": "अंकपत्र जोड़ें",
  "Upload latest marksheet.": "नवीनतम अंकपत्र अपलोड करें।",
  "Upload latest marksheet": "नवीनतम अंकपत्र अपलोड करें",
  "Action needed": "कार्रवाई आवश्यक",
  "Not started": "शुरू नहीं हुआ",
  "Latest marksheet missing · student owns the next action": "नवीनतम अंकपत्र अनुपलब्ध · अगला कदम छात्र के पास",
  "Renewal ownership": "नवीनीकरण की ज़िम्मेदारी",
  "Your renewal": "आपका नवीनीकरण",
  "Submission blocked until marksheet": "अंकपत्र तक जमा करना रुका है",
  "Latest marksheet required": "नवीनतम अंकपत्र आवश्यक",
  "Your institution": "आपका संस्थान",
  "Scheme authority waiting": "योजना प्राधिकरण प्रतीक्षारत",
  "Scheme / verification authority": "योजना / सत्यापन प्राधिकरण",
  "Waiting for institution verification": "संस्थान सत्यापन की प्रतीक्षा",
  "Renewal payment not started": "नवीनीकरण भुगतान शुरू नहीं हुआ",
  "You own this action.": "यह कार्य आपके पास है।",
  "Application submitted · enrolment proof attached · institute verification pending": "आवेदन जमा · नामांकन प्रमाण संलग्न · संस्थान सत्यापन लंबित",
  "Ananya submitted the AICTE Pragati Scholarship application. The scholarship cell is reviewing enrolment and submitted documents.": "अनन्या ने AICTE Pragati Scholarship का आवेदन जमा किया। छात्रवृत्ति प्रकोष्ठ नामांकन और जमा दस्तावेज़ों की समीक्षा कर रहा है।",
  "AICTE approved Ananya's Pragati scholarship and sent it for payment validation. A beneficiary name mismatch is stopping the credit.": "AICTE ने अनन्या की Pragati छात्रवृत्ति स्वीकृत कर भुगतान सत्यापन के लिए भेजी। लाभार्थी नाम की असंगति भुगतान रोक रही है।",
  "Application name Ananya R. does not match bank record Ananya Rao": "आवेदन का नाम Ananya R. बैंक रिकॉर्ड Ananya Rao से मेल नहीं खाता",
  "If this step clears, ownership moves to AICTE verification.": "यह चरण पूरा होने पर ज़िम्मेदारी AICTE सत्यापन के पास जाएगी।",
  "AICTE verification": "AICTE सत्यापन",
  "This is discovery with judgment.": "यह विवेक के साथ खोज है।",
  "Strongly pursue": "अवश्य आगे बढ़ें",
  "Worth pursuing": "आगे बढ़ाने योग्य",
  "Pursue after improving": "सुधार के बाद आगे बढ़ें",
  "Low priority": "कम प्राथमिकता",
  "Verify eligibility": "पात्रता जाँचें",
  "Do not apply": "आवेदन न करें",
  "Insufficient information": "अपर्याप्त जानकारी",
  "Confidence:": "विश्वास:",
  "High": "उच्च",
  "Medium": "मध्यम",
  "Low": "निम्न",
  "Prepare packet": "पैकेट तैयार करें",
  "Update assessment": "आकलन अद्यतन करें",
  "Ask Disha": "दिशा से पूछें",
  "Decision": "निर्णय",
  "Language": "भाषा",
  "assessment": "आकलन",
  "Eligibility": "पात्रता",
  "Confidence": "विश्वास",
  "Recommendation": "अनुशंसा",
  "Competitive fit": "प्रतिस्पर्धी अनुकूलता",
  "Initial fit": "प्रारंभिक अनुकूलता",
  "Back to opportunity": "अवसर पर वापस",
  "Effort": "प्रयास",
  "Moderate": "मध्यम",
  "Strong": "मज़बूत",
  "Weak": "कमज़ोर",
  "eligible": "पात्र",
  "uncertain": "अनिश्चित",
  "ineligible": "पात्र नहीं",
  // Discover
  "Meet Ananya": "अनन्या से मिलिए",
  "Final-year engineering student · 8.3 CGPA · research internship · final-year project":
    "अंतिम वर्ष की इंजीनियरिंग छात्रा · 8.3 CGPA · शोध इंटर्नशिप · अंतिम वर्ष परियोजना",
  "Recommended next step": "अनुशंसित अगला कदम",
  "Eligibility looks aligned": "पात्रता उपयुक्त दिखती है",
  "Academic record is strong": "शैक्षणिक रिकॉर्ड मज़बूत है",
  "One document should be refreshed before applying": "आवेदन से पहले एक दस्तावेज़ अद्यतन करना चाहिए",
  "See why": "कारण देखें",
  "Other matches Disha considered": "दिशा द्वारा विचारे गए अन्य विकल्प",
  Promising: "संभावनाशील",
  "Has gaps": "कमियाँ हैं",
  "Not a fit": "उपयुक्त नहीं",
  "Hard eligibility issue": "कठोर पात्रता की समस्या",
  "Why not?": "क्यों नहीं?",
  "Disha narrows the field before asking a student to invest time in an application.":
    "दिशा विकल्पों को सीमित करती है, इससे पहले कि छात्र किसी आवेदन में समय लगाए।",
  "Browse all opportunities": "सभी अवसर देखें",

  // Apply
  "Personal details": "व्यक्तिगत विवरण",
  Education: "शिक्षा",
  "Bank details": "बैंक विवरण",
  "Documents & review": "दस्तावेज़ और समीक्षा",
  "Full name": "पूरा नाम",
  Email: "ईमेल",
  Phone: "फ़ोन",
  Location: "स्थान",
  Back: "पीछे",
  "Save and continue": "सहेजें और जारी रखें",

  // Verification
  "Back to applications": "आवेदनों पर वापस",
  Scholarship: "छात्रवृत्ति",
  "Nothing required from you right now.": "अभी आपसे कुछ अपेक्षित नहीं है।",
  "Current owner": "वर्तमान ज़िम्मेदार",
  Student: "छात्र",
  Submitted: "जमा किया गया",
  Reviewing: "समीक्षा जारी",
  Next: "आगे",
  Waiting: "प्रतीक्षारत",
  Bank: "बैंक",
  "Application packet": "आवेदन पैकेट",
  "Admission proof": "प्रवेश प्रमाण",
  "Income certificate": "आय प्रमाणपत्र",
  "Institution record": "संस्थान रिकॉर्ड",
  "Enrolment proof": "नामांकन प्रमाण",
  "What happens next?": "आगे क्या होगा?",
  "View evidence": "प्रमाण देखें",
  "Why this is with them": "यह उनके पास क्यों है",

  // Payment
  "Bank validation failed": "बैंक सत्यापन विफल",
  "Correct beneficiary name.": "लाभार्थी का नाम सुधारें।",
  "Fix name": "नाम ठीक करें",
  Verified: "सत्यापित",
  Approved: "स्वीकृत",
  Blocked: "अवरुद्ध",
  "Beneficiary name doesn't match": "लाभार्थी का नाम मेल नहीं खाता",
  "Correct the beneficiary name to restart validation.": "सत्यापन दोबारा शुरू करने के लिए लाभार्थी का नाम सुधारें।",
  Application: "आवेदन",
  "Bank record": "बैंक रिकॉर्ड",
  "Current action": "वर्तमान कार्य",
  "You own the next action": "अगला कदम आपके पास है",
  "Review the beneficiary field and save the corrected name.": "लाभार्थी फ़ील्ड की समीक्षा करें और सुधारा हुआ नाम सहेजें।",
  "Review details": "विवरण देखें",

  // Renewal
  "Carried forward": "आगे बढ़ाया गया",
  "Needs updating": "अद्यतन आवश्यक",

  // Shared status vocabulary
  Assess: "आकलन",
  Prepare: "तैयारी",
  Apply: "आवेदन",
  Discover: "खोजें",
  Verification: "सत्यापन",
  Payment: "भुगतान",
  Renewal: "नवीनीकरण"
};

export function hindi(text: string) {
  return catalogue[text] ?? text;
}

/**
 * Returns the value with every translatable string inside it replaced. Shape is preserved, so a
 * page can localise a whole data object in one call and render it exactly as before.
 */
export function localise<T>(value: T, language: Language): T {
  if (language !== "hi") return value;
  return walk(value) as T;
}

function walk(value: unknown): unknown {
  if (typeof value === "string") return hindi(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, walk(item)]));
  }
  return value;
}

/** Exposed for tests: how much of a page's visible copy the catalogue covers. */
export function translatableCount() {
  return Object.keys(catalogue).length;
}

/**
 * For literal strings written directly in a component, where there is no data object to pass
 * through `localise`. Returns the text unchanged in English.
 */
export function localiser(language: Language) {
  return (text: string) => (language === "hi" ? hindi(text) : text);
}
