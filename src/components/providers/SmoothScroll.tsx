"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import type React from "react";
import { useMemo } from "react";

/**
 * Routes where Lenis should be disabled.
 * Auth pages are typically viewport-locked (h-screen, centered cards)
 * and don't benefit from smooth scroll. Lenis on these pages often
 * traps wheel events because the document has no overflow.
 */
const DISABLED_PATHS = [
  "/login",
  "/register",
  "/register-interest",
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDisabled = useMemo(() => {
    if (!pathname) return false;
    return DISABLED_PATHS.some((path) => pathname.startsWith(path));
  }, [pathname]);

  // Render plain children on auth pages — no scroll hijacking
  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.02, // Lower = heavier, more cinematic momentum
        duration: 1.5, // Controls the "catch up" duration
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
