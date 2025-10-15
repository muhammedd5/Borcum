import React, { useCallback, useEffect, useMemo, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";

export type ThemeMode = "light" | "dark" | "system";

export type AppStateValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  hasCompletedOnboarding: boolean;
  setCompletedOnboarding: (done: boolean) => void;
};

export const [AppStateProvider, useAppState] = createContextHook<AppStateValue>(() => {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  useEffect(() => {
    console.log("[AppState] Initialized", { theme, hasCompletedOnboarding });
  }, [theme, hasCompletedOnboarding]);

  const setTheme = useCallback((mode: ThemeMode) => {
    console.log("[AppState] setTheme", mode);
    setThemeState(mode);
  }, []);

  const setCompletedOnboarding = useCallback((done: boolean) => {
    console.log("[AppState] setCompletedOnboarding", done);
    setHasCompletedOnboarding(done);
  }, []);

  return useMemo<AppStateValue>(() => ({
    theme,
    setTheme,
    hasCompletedOnboarding,
    setCompletedOnboarding,
  }), [theme, hasCompletedOnboarding, setTheme, setCompletedOnboarding]);
});
