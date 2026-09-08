"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { canonicalGuidedDemoOpportunityId, DemoState, normalizeDemoState, primaryProfileId } from "@/lib/data";
import { Language } from "@/lib/i18n";
import { defaultNormalAssessment, hydrateNormalAssessment, type NormalAssessmentDraft } from "@/lib/normalAssessment";
export type { NormalAssessmentDraft } from "@/lib/normalAssessment";

type AppContextValue = {
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  normalAssessment: NormalAssessmentDraft;
  setNormalAssessment: (draft: NormalAssessmentDraft) => void;
  guidedDemoActive: boolean;
  guidedDemoCollapsed: boolean;
  walkthroughDismissed: boolean;
  dismissWalkthrough: () => void;
  guidedDemoOpportunityId: string;
  setGuidedDemoOpportunityId: (opportunityId: string) => void;
  setGuidedDemoCollapsed: (collapsed: boolean) => void;
  startGuidedDemo: () => void;
  stopGuidedDemo: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [demoState, setDemoStateValue] = useState<DemoState>("assess");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [normalAssessment, setNormalAssessmentValue] = useState<NormalAssessmentDraft>(defaultNormalAssessment);
  const [guidedDemoActive, setGuidedDemoActive] = useState(false);
  const [guidedDemoCollapsed, setGuidedDemoCollapsedValue] = useState(false);
  const [walkthroughDismissed, setWalkthroughDismissed] = useState(false);
  const [guidedDemoOpportunityId, setGuidedDemoOpportunityIdValue] = useState(canonicalGuidedDemoOpportunityId);
  const [language, setLanguageValue] = useState<Language>("en");

  useEffect(() => {
    setDemoStateValue(normalizeDemoState(window.sessionStorage.getItem("nsp-demo-state")));
    setGuidedDemoActive(window.sessionStorage.getItem("disha-guided-demo") === "true");
    setGuidedDemoCollapsedValue(window.sessionStorage.getItem("disha-guided-demo-collapsed") === "true");
    setWalkthroughDismissed(window.sessionStorage.getItem("disha-walkthrough-dismissed") === "true");
    setGuidedDemoOpportunityIdValue(window.sessionStorage.getItem("disha-guided-demo-opportunity") ?? canonicalGuidedDemoOpportunityId);
    const savedNormalAssessment = window.localStorage.getItem("disha-normal-assessment");
    if (savedNormalAssessment) {
      try {
        const hydrated = hydrateNormalAssessment(JSON.parse(savedNormalAssessment));
        setNormalAssessmentValue(hydrated);
        // Write the migrated draft back so the stale payload is replaced once, not re-migrated on every load.
        window.localStorage.setItem("disha-normal-assessment", JSON.stringify(hydrated));
      } catch {
        window.localStorage.removeItem("disha-normal-assessment");
      }
    }
    const savedLanguage = window.localStorage.getItem("disha-language") as Language | null;
    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguageValue(savedLanguage);
    }
  }, []);

  const setDemoState = useCallback((state: DemoState) => {
    setDemoStateValue(state);
    window.sessionStorage.setItem("nsp-demo-state", state);
  }, []);

  const setNormalAssessment = useCallback((draft: NormalAssessmentDraft) => {
    setNormalAssessmentValue(draft);
    window.localStorage.setItem("disha-normal-assessment", JSON.stringify(draft));
  }, []);

  const dismissWalkthrough = useCallback(() => {
    setWalkthroughDismissed(true);
    window.sessionStorage.setItem("disha-walkthrough-dismissed", "true");
  }, []);

  const startGuidedDemo = useCallback(() => {
    setGuidedDemoActive(true);
    setWalkthroughDismissed(false);
    window.sessionStorage.removeItem("disha-walkthrough-dismissed");
    setGuidedDemoCollapsedValue(false);
    setGuidedDemoOpportunityIdValue(canonicalGuidedDemoOpportunityId);
    setDemoStateValue("discover");
    window.sessionStorage.setItem("disha-guided-demo", "true");
    window.sessionStorage.removeItem("disha-guided-demo-collapsed");
    window.sessionStorage.setItem("disha-guided-demo-opportunity", canonicalGuidedDemoOpportunityId);
    window.localStorage.removeItem(`disha-assessment-${canonicalGuidedDemoOpportunityId}`);
    window.sessionStorage.setItem("nsp-demo-state", "discover");
    window.localStorage.setItem("disha-demo-profile", primaryProfileId);
  }, []);

  const stopGuidedDemo = useCallback(() => {
    setGuidedDemoActive(false);
    setGuidedDemoCollapsedValue(false);
    setDemoStateValue("assess");
    window.sessionStorage.removeItem("disha-guided-demo");
    window.sessionStorage.removeItem("disha-guided-demo-collapsed");
    window.sessionStorage.removeItem("disha-guided-demo-opportunity");
    window.sessionStorage.removeItem("nsp-demo-state");
    window.localStorage.removeItem("disha-guided-demo");
    window.localStorage.removeItem("disha-guided-demo-collapsed");
    window.localStorage.removeItem("disha-guided-demo-opportunity");
  }, []);

  const setGuidedDemoOpportunityId = useCallback((opportunityId: string) => {
    setGuidedDemoOpportunityIdValue(opportunityId);
    window.sessionStorage.setItem("disha-guided-demo-opportunity", opportunityId);
    window.localStorage.removeItem(`disha-assessment-${opportunityId}`);
  }, []);

  const setGuidedDemoCollapsed = useCallback((collapsed: boolean) => {
      setGuidedDemoCollapsedValue(collapsed);
    if (collapsed) {
      window.sessionStorage.setItem("disha-guided-demo-collapsed", "true");
    } else {
      window.sessionStorage.removeItem("disha-guided-demo-collapsed");
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageValue(nextLanguage);
    window.localStorage.setItem("disha-language", nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const value = useMemo(
    () => ({
      demoState,
      setDemoState,
      assistantOpen,
      setAssistantOpen,
      normalAssessment,
      setNormalAssessment,
      guidedDemoActive,
      guidedDemoCollapsed,
      walkthroughDismissed,
      dismissWalkthrough,
      guidedDemoOpportunityId,
      setGuidedDemoOpportunityId,
      setGuidedDemoCollapsed,
      startGuidedDemo,
      stopGuidedDemo,
      language,
      setLanguage
    }),
    [demoState, assistantOpen, normalAssessment, guidedDemoActive, guidedDemoCollapsed, walkthroughDismissed, guidedDemoOpportunityId, language]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return value;
}
