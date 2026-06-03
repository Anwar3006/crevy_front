"use client";

import { useReducedMotion } from "framer-motion";
import {
  FeaturedProjectsSection,
  FinalCTASection,
  TestimonialsSection,
} from "@/components/public/landing/FeaturedProjectsSection";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { HowItWorksSection } from "@/components/public/landing/HowItWorksSection";
import { ProjectTypesSection } from "@/components/public/landing/ProjectTypesSection";
import {
  ScrollingMarquee,
  WhyCrevySection,
} from "@/components/public/landing/WhyCrevySection";

/**
 * Main Landing Page component.
 * Assembles all landing page sections into a cohesive whole.
 *
 * @returns {JSX.Element} The rendered LandingPage.
 */
export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion() as boolean;

  return (
    <div className="animate-in fade-in duration-700">
      <HeroSection shouldReduceMotion={shouldReduceMotion} />
      <HowItWorksSection shouldReduceMotion={shouldReduceMotion} />
      <ProjectTypesSection shouldReduceMotion={shouldReduceMotion} />
      <WhyCrevySection shouldReduceMotion={shouldReduceMotion} />
      <ScrollingMarquee />
      <FeaturedProjectsSection shouldReduceMotion={shouldReduceMotion} />
      <TestimonialsSection shouldReduceMotion={shouldReduceMotion} />
      <FinalCTASection shouldReduceMotion={shouldReduceMotion} />
    </div>
  );
}
