import { canonicalGuidedDemoOpportunityId } from "@/lib/data";
import type { Language } from "@/lib/i18n";

/**
 * The guided sample journey, as a sequence of contextual hints.
 *
 * One hint at a time, anchored to the page the visitor is already on. Each step says what to do,
 * why the step matters, and where it leads. A step completes when the visitor actually reaches the
 * next page, so the walkthrough follows them rather than blocking them.
 */
export type WalkthroughStep = {
  id: string;
  stage: string;
  /** Routes this hint belongs on. First entry is where the step starts. */
  match: (pathname: string) => boolean;
  title: string;
  body: string;
  /** The action the visitor should take here. */
  action: string;
  /** Hindi copy sits beside the English so the two cannot drift apart. */
  hi: { stage: string; title: string; body: string; action: string };
  href?: string;
};

export function localiseStep(step: WalkthroughStep, language: Language) {
  return language === "hi"
    ? { stage: step.hi.stage, title: step.hi.title, body: step.hi.body, action: step.hi.action }
    : { stage: step.stage, title: step.title, body: step.body, action: step.action };
}

const assessHref = `/opportunities/${canonicalGuidedDemoOpportunityId}/assess`;

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "discover",
    stage: "Discover",
    match: (pathname) => pathname === "/demo" || pathname === "/opportunities" || pathname.startsWith("/opportunities/") === false && pathname === "/",
    title: "Start with what is worth her time",
    body: "Ananya could apply to dozens of schemes. Disha ranks them by whether they are actually worth preparing, not by how many exist.",
    action: "Open an opportunity to see whether it fits Ananya.",
    hi: { stage: "खोजें", title: "उसी से शुरू करें जो समय के लायक हो", body: "अनन्या दर्जनों योजनाओं में आवेदन कर सकती हैं। दिशा उन्हें इस आधार पर क्रमबद्ध करती है कि तैयारी करना वास्तव में सार्थक है या नहीं, न कि कितनी योजनाएँ मौजूद हैं।", action: "कोई अवसर खोलें और देखें कि वह अनन्या के लिए उपयुक्त है या नहीं।" },
    href: assessHref
  },
  {
    id: "assess",
    stage: "Assess",
    match: (pathname) => pathname.startsWith("/opportunities/") && pathname.endsWith("/assess"),
    title: "Eligibility and fit are different questions",
    body: "Eligibility comes from the scheme's published hard rules. Fit is about how competitive the application would be. Disha keeps them apart so a strong profile is never mistaken for an eligible one.",
    action: "Read the eligibility and fit panels, then continue to Prepare.",
    hi: { stage: "आकलन", title: "पात्रता और अनुकूलता अलग प्रश्न हैं", body: "पात्रता योजना के प्रकाशित कठोर नियमों से आती है। अनुकूलता बताती है कि आवेदन कितना प्रतिस्पर्धी होगा। दिशा दोनों को अलग रखती है।", action: "पात्रता और अनुकूलता के पैनल पढ़ें, फिर तैयारी पर जाएँ।" },
    href: "/preflight"
  },
  {
    id: "prepare",
    stage: "Prepare",
    match: (pathname) => pathname.startsWith("/preflight"),
    title: "See what is ready and what is missing",
    body: "Blockers do not clear because you clicked them. Provide the evidence, and it goes to whoever owns the check.",
    action: "Resolve a blocker, then start the application.",
    hi: { stage: "तैयारी", title: "देखें क्या तैयार है और क्या कमी है", body: "रुकावटें केवल क्लिक करने से दूर नहीं होतीं। प्रमाण दें, और वह उस व्यक्ति के पास जाता है जो जाँच का ज़िम्मेदार है।", action: "एक रुकावट हल करें, फिर आवेदन शुरू करें।" },
    href: "/apply"
  },
  {
    id: "apply",
    stage: "Apply",
    match: (pathname) => pathname.startsWith("/apply"),
    title: "Most of the form is already answered",
    body: "Everything Disha already holds is prefilled, so the application is a review rather than a retyping exercise.",
    action: "Review the prefilled application and submit.",
    hi: { stage: "आवेदन", title: "अधिकांश फ़ॉर्म पहले से भरा है", body: "दिशा के पास जो जानकारी पहले से है वह भर दी जाती है, इसलिए आवेदन दोबारा टाइप करने के बजाय समीक्षा बन जाता है।", action: "पहले से भरे आवेदन की समीक्षा करें और जमा करें।" },
    href: "/applications/pragati-readiness-2026"
  },
  {
    id: "verification",
    stage: "Verification",
    match: (pathname) => pathname.startsWith("/applications"),
    title: "Now it is somebody else's move",
    body: "After submission the application sits with the institution. The most common reason applicants give up here is not knowing that waiting is the correct state.",
    action: "Check who owns the next action, then follow the payment stage.",
    hi: { stage: "सत्यापन", title: "अब अगला कदम किसी और के पास है", body: "जमा करने के बाद आवेदन संस्थान के पास रहता है। यहाँ आवेदक अक्सर इसलिए हार मान लेते हैं क्योंकि उन्हें पता नहीं होता कि प्रतीक्षा करना ही सही स्थिति है।", action: "देखें कि अगला कदम किसके पास है, फिर भुगतान चरण पर जाएँ।" },
    href: "/payments/pragati-payment-2026"
  },
  {
    id: "payment",
    stage: "Payment",
    match: (pathname) => pathname.startsWith("/payments"),
    title: "Money stalls for boring reasons",
    body: "Most payment failures are name or account mismatches, not rejections. Disha names the mismatch instead of showing a generic pending state.",
    action: "See what is blocking payment and who can fix it.",
    hi: { stage: "भुगतान", title: "भुगतान मामूली कारणों से रुकता है", body: "अधिकतर भुगतान विफलताएँ नाम या खाते की असंगति होती हैं, अस्वीकृति नहीं। दिशा सामान्य 'लंबित' दिखाने के बजाय असंगति का नाम बताती है।", action: "देखें कि भुगतान क्या रोक रहा है और उसे कौन ठीक कर सकता है।" },
    href: "/renewal"
  },
  {
    id: "renewal",
    stage: "Renewal",
    match: (pathname) => pathname.startsWith("/renewal"),
    title: "Next year should not start from zero",
    body: "Evidence already verified carries forward. Only the genuinely new documents are asked for again.",
    action: "That is the full journey. You can exit the sample any time.",
    hi: { stage: "नवीनीकरण", title: "अगला वर्ष शून्य से शुरू नहीं होना चाहिए", body: "पहले से सत्यापित प्रमाण आगे बढ़ते हैं। केवल वास्तव में नए दस्तावेज़ दोबारा माँगे जाते हैं।", action: "यही पूरी यात्रा है। आप नमूना कभी भी बंद कर सकते हैं।" },
    href: undefined
  }
];

export function walkthroughStepForPath(pathname: string) {
  const index = walkthroughSteps.findIndex((step) => step.match(pathname));
  return index === -1 ? null : { step: walkthroughSteps[index], index };
}

export const walkthroughLength = walkthroughSteps.length;
