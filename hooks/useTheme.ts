"use client";

import { useEffect, useState } from "react";

/**
 * Default appearance follows system preference via CSS (@media prefers-color-scheme)
 * with zero JS/FOUC. The "dark"/"light" classes are only added when the user
 * explicitly overrides the system preference.
 */
export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    if (document.documentElement.classList.contains("dark")) return true;
    if (document.documentElement.classList.contains("light")) return false;
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    // Must use isDark (includes system fallback), not `stored === "dark"` —
    // otherwise Tailwind's class-scoped `dark:` utilities never activate for
    // users relying on system dark mode, even though the CSS vars still do.
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return { dark, toggle };
}
