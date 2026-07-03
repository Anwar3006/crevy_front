"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTransition } from "@/context/TransitionContext";
import { cn } from "@/lib/utils";

/**
 * FastTransitionLoader
 * Speed-optimized fullscreen overlay for route transitions.
 * Completes in ~350ms instead of 1.1s for snappier navigation.
 */
function FastTransitionLoader() {
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { isTransitioning } = useTransition();

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Faster increment: 8% per tick at 16ms → ~200ms to 100%
        return prev + 8;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [isTransitioning]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-foreground flex flex-col items-center justify-center overflow-hidden"
      exit={shouldReduceMotion ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Architectural guide lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-px h-full bg-border/30" />
        <div className="w-px h-full bg-border/30 mx-[25vw]" />
        <div className="w-px h-full bg-border/30 mx-[25vw]" />
      </div>

      {/* Wordmark */}
      <motion.h1
        initial={shouldReduceMotion ? { opacity: 0 } : { y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0.15 }
            : { type: "spring", damping: 28, stiffness: 120 }
        }
        className="font-sans text-5xl md:text-7xl text-white tracking-tight relative z-10"
      >
        Crevy
      </motion.h1>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="absolute bottom-16 w-48 flex flex-col items-center gap-3"
      >
        <div className="w-full h-px bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-brand"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand" />
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase tabular-nums">
            {progress}%
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * NavLink
 * Drop-in replacement for Next.js <Link> that shows the CrevyLoader transition.
 * Works for any route, not just /dashboard.
 */
export function NavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const router = useRouter();
  const { isTransitioning, startTransition } = useTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick?.();
      startTransition();
      router.push(href);
    },
    [href, onClick, router, startTransition],
  );

  return (
    <>
      <AnimatePresence>
        {isTransitioning && <FastTransitionLoader />}
      </AnimatePresence>
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    </>
  );
}

/**
 * DashboardTransitionLink
 * Speed-optimized "Access Dashboard" button.
 * Preloads /dashboard on mount and uses a faster transition animation.
 */
export function DashboardTransitionLink({
  className,
  children,
  onClick: externalOnClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const router = useRouter();
  const { isTransitioning, startTransition } = useTransition();

  // Preload the dashboard route on mount for instant navigation
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const handleClick = () => {
    externalOnClick?.();
    startTransition();
    router.push("/dashboard");
  };

  return (
    <>
      <AnimatePresence>
        {isTransitioning && <FastTransitionLoader />}
      </AnimatePresence>
      <button type="button" className={className} onClick={handleClick}>
        {children}
      </button>
    </>
  );
}

/**
 * Pre-built desktop "Access Dashboard" button.
 */
export function AccessDashboardButton({ isNavSolid }: { isNavSolid: boolean }) {
  return (
    <DashboardTransitionLink
      className={cn(
        "inline-flex items-center rounded-none font-bold uppercase tracking-widest text-[10px] px-6 h-10 transition-colors",
        isNavSolid
          ? "bg-foreground hover:bg-brand text-white"
          : "bg-white hover:bg-brand text-foreground hover:text-white",
      )}
    >
      Access Dashboard <LayoutDashboard className="w-3.5 h-3.5 ml-2" />
    </DashboardTransitionLink>
  );
}

/**
 * Pre-built mobile "Access Dashboard" button.
 */
export function AccessDashboardMobileButton({
  onMenuClose,
}: {
  onMenuClose: () => void;
}) {
  return (
    <DashboardTransitionLink
      className="w-full inline-flex items-center justify-center rounded-none bg-brand hover:bg-brand/80 text-white font-bold uppercase tracking-widest text-[10px] h-12 transition-colors"
      onClick={onMenuClose}
    >
      Access Dashboard <LayoutDashboard className="w-4 h-4 ml-2" />
    </DashboardTransitionLink>
  );
}
