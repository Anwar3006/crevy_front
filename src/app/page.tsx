"use client";

import { useReducedMotion } from "framer-motion";
import { Syne } from "next/font/google";
import {
  FeaturedProjectsSection,
  FinalCTASection,
  TestimonialsSection,
} from "@/components/public/landing/FeaturedProjectsSection";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { HowItWorksSection } from "@/components/public/landing/HowItWorksSection";
import { Navbar } from "@/components/public/landing/Navbar";
import { ProjectTypesSection } from "@/components/public/landing/ProjectTypesSection";
import {
  ScrollingMarquee,
  WhyCrevySection,
} from "@/components/public/landing/WhyCrevySection";
import { PublicFooter } from "@/components/public/public-footer";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Main Landing Page component.
 * Assembles all landing page sections into a cohesive whole.
 *
 * @returns {JSX.Element} The rendered LandingPage.
 */
export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion() as boolean;

  return (
    <div className={cn(syne.variable, "font-sans selection:bg-myGreen/30")}>
      <Navbar />
      <main>
        <HeroSection shouldReduceMotion={shouldReduceMotion} />
        <HowItWorksSection shouldReduceMotion={shouldReduceMotion} />
        <ProjectTypesSection shouldReduceMotion={shouldReduceMotion} />
        <WhyCrevySection shouldReduceMotion={shouldReduceMotion} />
        <ScrollingMarquee />
        <FeaturedProjectsSection shouldReduceMotion={shouldReduceMotion} />
        <TestimonialsSection shouldReduceMotion={shouldReduceMotion} />
        <FinalCTASection shouldReduceMotion={shouldReduceMotion} />
      </main>
      <PublicFooter />
    </div>
  );
}
