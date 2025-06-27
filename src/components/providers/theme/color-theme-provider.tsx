"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme =
  | "blue"
  | "red"
  | "rose"
  | "orange"
  | "green"
  | "violet";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(
  undefined
);

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}

interface ColorThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ColorTheme;
}

export function ColorThemeProvider({
  children,
  defaultTheme = "blue",
}: ColorThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem("color-theme") as ColorTheme;
    if (
      stored &&
      ["blue", "red", "rose", "orange", "green", "violet"].includes(stored)
    ) {
      setColorTheme(stored);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and save to localStorage
    const root = document.documentElement;

    // Remove existing color theme classes
    root.classList.remove(
      "theme-blue",
      "theme-red",
      "theme-rose",
      "theme-orange",
      "theme-green",
      "theme-violet"
    );

    // Add new color theme class
    root.classList.add(`theme-${colorTheme}`);

    // Save to localStorage
    localStorage.setItem("color-theme", colorTheme);
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}
