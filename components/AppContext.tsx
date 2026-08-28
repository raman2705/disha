"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DemoState } from "@/lib/data";

type AppContextValue = {
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [demoState, setDemoStateValue] = useState<DemoState>("apply");

  useEffect(() => {
    const saved = window.localStorage.getItem("nsp-demo-state") as DemoState | null;
    if (saved === "apply" || saved === "verification" || saved === "payment") {
      setDemoStateValue(saved);
    }
  }, []);

  const setDemoState = (state: DemoState) => {
    setDemoStateValue(state);
    window.localStorage.setItem("nsp-demo-state", state);
  };

  const value = useMemo(() => ({ demoState, setDemoState }), [demoState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return value;
}
