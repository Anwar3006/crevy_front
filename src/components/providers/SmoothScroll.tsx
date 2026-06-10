"use client";

import { ReactLenis } from "lenis/react";
import type React from "react";

/**
 * SmoothScroll Provider
 * Uses Lenis to create a premium, weighted scroll effect.
 * Because it operates on native scroll mechanics, position: sticky
 * and Framer Motion's useScroll() will work perfectly.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
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
