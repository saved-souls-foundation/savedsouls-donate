"use client";

import { useEffect } from "react";

/** Zelfde key als homepage (`app/[locale]/page.tsx`). */
const THEME_KEY = "savedsouls-theme";

function getThemeFromTime(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const hour = new Date().getHours();
  return hour >= 6 && hour < 20 ? "light" : "dark";
}

export default function ThemeRoot() {
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    const theme =
      stored === "dark" || stored === "light" ? stored : getThemeFromTime();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return null;
}
