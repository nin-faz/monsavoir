"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { BookDiveTransition } from "@/components/transitions/BookDiveTransition";

interface TransitionContextValue {
  startDive: () => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}

/**
 * Mounted once at the root, above the router. The dive transition renders
 * here rather than inside the auth page so it survives the /auth → /dashboard
 * navigation instead of being torn down mid-fade when the auth page unmounts.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [diving, setDiving] = useState(false);

  return (
    <TransitionContext.Provider value={{ startDive: () => setDiving(true) }}>
      {children}
      {diving && <BookDiveTransition onDone={() => setDiving(false)} />}
    </TransitionContext.Provider>
  );
}
