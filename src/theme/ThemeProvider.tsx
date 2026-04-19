import React, { createContext, useMemo, useState } from "react";
import { darkColors, lightColors, ThemeColors, ThemeMode } from "./colors";

export type ThemeContextType = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = mode === "light" ? lightColors : darkColors;

  const value = useMemo(
    () => ({
      mode,
      colors,
      toggleTheme,
      setTheme: setMode,
    }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}