"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Crevy Loading Protocol
 * A weighted, architectural transition screen.
 */
export function CrevyLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Progress logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsExiting(true), 300); // Hold at 100%
          return 100;
        }
        return prev + 2; // Simulated speed
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const handleAnimationComplete = () => {
    if (isExiting && onComplete) onComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z- bg-secondary flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Architectural Guide Lines ── */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="w-px h-full bg-slate-800/50" />
            <div className="w-px h-full bg-slate-800/50 mx-[25vw]" />
            <div className="w-px h-full bg-slate-800/50 mx-[25vw]" />
          </div>

          {/* ── Crevy Wordmark ── */}
          <motion.h1
            initial={
              shouldReduceMotion ? { opacity: 0 } : { y: -100, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.3 }
                : { type: "spring", damping: 25, stiffness: 80 }
            }
            className="text-5xl md:text-7xl text-white tracking-tight relative z-10"
          >
            Crevy
          </motion.h1>

          {/* ── Percentage Telemetry ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-white" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
              {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
