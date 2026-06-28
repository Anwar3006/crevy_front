"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: () => void;
  finishTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => setIsTransitioning(true), []);
  const finishTransition = useCallback(() => setIsTransitioning(false), []);

  const value = useMemo(
    () => ({ isTransitioning, startTransition, finishTransition }),
    [isTransitioning, startTransition, finishTransition],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
