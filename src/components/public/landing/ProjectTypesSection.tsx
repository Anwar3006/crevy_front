"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Recycle,
  Sprout,
  Sun,
  Trees,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// ─── DATA & METADATA DICTIONARY ──────────────────────────────────────────────
const projectTypes = [
  {
    title: "Regenerative Agriculture",
    icon: Sprout,
    desc: "Soil-building farming practices that sequester CO₂ directly into the earth while restoring biodiversity.",
    classId: "REG-AGR-01",
    permanence: "High (100+ Yrs)",
    standard: "Gold Standard / VCS",
  },
  {
    title: "Reforestation",
    icon: Trees,
    desc: "Planting native forests to restore damaged ecosystems and create massive, long-term carbon sinks.",
    classId: "FOR-REF-02",
    permanence: "High (100+ Yrs)",
    standard: "Verra ARR / CCB",
  },
  {
    title: "Renewable Energy",
    icon: Sun,
    desc: "Utility-scale solar, wind, and hydro installations actively displacing fossil fuel reliance in developing grids.",
    classId: "TEC-REN-03",
    permanence: "Permanent Avoidance",
    standard: "CDM / Gold Standard",
  },
  {
    title: "Biochar",
    icon: Flame,
    desc: "Converting organic agricultural waste into highly stable, carbon-rich soil amendments through pyrolysis.",
    classId: "TEC-BCH-04",
    permanence: "Extreme (1000+ Yrs)",
    standard: "Puro.earth / VCS",
  },
  {
    title: "Blue Carbon",
    icon: Waves,
    desc: "Mangrove and coastal wetland restoration that locks up to 4x more carbon per hectare than terrestrial forests.",
    classId: "NAT-BLU-05",
    permanence: "High (100+ Yrs)",
    standard: "Verra / Blue Carbon",
  },
  {
    title: "Waste Management",
    icon: Recycle,
    desc: "Advanced methane capture and waste diversion protocols to prevent catastrophic greenhouse gas emissions.",
    classId: "IND-WST-06",
    permanence: "Permanent Avoidance",
    standard: "Gold Standard / CDM",
  },
];

export function ProjectTypesSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.333333%"]);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "#064e3b", // Emerald 900
      "#14532d", // Green 900
      "#451a03", // Amber 950
      "#0f172a", // Slate 900
      "#082f49", // Sky 900
      "#134e4a", // Teal 900
    ],
  );

  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "#34d399", // Emerald 400
      "#4ade80", // Green 400
      "#fbbf24", // Amber 400
      "#94a3b8", // Slate 400
      "#38bdf8", // Sky 400
      "#2dd4bf", // Teal 400
    ],
  );

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-slate-950">
      <motion.div
        style={shouldReduceMotion ? undefined : { backgroundColor }}
        className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col"
      >
        {/* ── FIXED OVERLAY HEADER (Optimized for Mobile) ── */}
        <div className="absolute top-0 left-0 w-full px-6 lg:px-10 pt-20 lg:pt-32 pb-4 z-50 pointer-events-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-xl">
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-none mb-1 lg:mb-2">
              Eligible Asset{" "}
              <motion.span
                style={{ color: accentColor }}
                className="italic font-light"
              >
                Classes.
              </motion.span>
            </h2>
            <p className="text-white/60 text-[10px] md:text-sm font-mono uppercase tracking-widest hidden sm:block">
              Institutional-grade methodologies only.
            </p>
          </div>
          <div className="pointer-events-auto shrink-0">
            <Link
              href="/methodology"
              className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 border-b border-white/30 pb-1 hover:text-white transition-colors"
            >
              Review Standards
            </Link>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLL TRACK ── */}
        <motion.div
          style={shouldReduceMotion ? undefined : { x }}
          className="flex h-full w-[600vw]"
        >
          {projectTypes.map((type, idx) => (
            <div
              key={type.title}
              // Adjusted paddings to center content beautifully in the safe area below the header
              className="w-screen h-full shrink-0 flex items-center justify-center px-6 lg:px-20 pt-28 pb-12 lg:pt-32 lg:pb-16 relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full max-w-[1400px] mx-auto h-full lg:h-auto items-center">
                {/* 1. Huge Watermark Number (Desktop Only - Excised from mobile for clarity) */}
                <div className="hidden lg:flex lg:col-span-3 items-start justify-center h-full select-none">
                  <span className="font-serif text-[14rem] leading-none text-white/5 font-bold tracking-tighter">
                    0{idx + 1}
                  </span>
                </div>

                {/* 2. Core Narrative (Flex-1 ensures it pushes metadata down appropriately on mobile) */}
                <div className="lg:col-span-6 flex flex-col justify-center flex-1 lg:border-l-2 lg:border-white/20 lg:pl-16 relative pt-12">
                  <type.icon
                    className="w-8 h-8 md:w-12 md:h-12 text-white mb-6 md:mb-12"
                    strokeWidth={1}
                  />

                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white tracking-tight leading-[1.05] mb-4 md:mb-6">
                    {type.title}
                  </h3>

                  <p className="font-light text-sm sm:text-base md:text-xl text-white/70 leading-relaxed mb-8 md:mb-12 max-w-xl">
                    {type.desc}
                  </p>

                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white border border-white/30 px-6 py-4 hover:bg-white hover:text-slate-900 transition-all duration-300 w-full sm:w-fit backdrop-blur-sm group"
                  >
                    Apply for Listing{" "}
                    <ArrowRight
                      size={14}
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>

                {/* 3. Terminal Metadata (Converted to a compact grid for mobile) */}
                <div className="lg:col-span-3 flex flex-col justify-end lg:justify-center mt-auto lg:mt-0 font-mono text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest lg:pl-12 border-t border-white/10 lg:border-t-0 pt-6 lg:pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-x-4 gap-y-6 lg:gap-8">
                    <div className="border-b lg:border-white/10 border-transparent pb-0 lg:pb-3">
                      <span className="block text-white/30 mb-1 lg:mb-2">
                        Class ID
                      </span>
                      <span className="text-white font-bold">
                        {type.classId}
                      </span>
                    </div>

                    <div className="border-b lg:border-white/10 border-transparent pb-0 lg:pb-3">
                      <span className="block text-white/30 mb-1 lg:mb-2">
                        Permanence
                      </span>
                      <span className="text-white font-bold">
                        {type.permanence}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 border-b lg:border-white/10 border-transparent pb-0 lg:pb-3">
                      <span className="block text-white/30 mb-1 lg:mb-2">
                        Standard
                      </span>
                      <span className="text-white font-bold">
                        {type.standard}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── SCROLL PROGRESS BAR ── */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
            className="h-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
