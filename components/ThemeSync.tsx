"use client";

import { useTheme } from "@/hooks/useTheme";

/** Mounts once at the root so the .dark/.light class stays in sync on every page. */
export function ThemeSync() {
  useTheme();
  return null;
}
