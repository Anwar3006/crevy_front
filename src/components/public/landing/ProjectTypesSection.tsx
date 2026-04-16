"use client";

import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";

const projectTypes = [
  {
    title: "Regenerative Agriculture",
    icon: Sprout,
    desc: "Soil-building farming practices that pull CO₂ into the earth.",
    baseColor: "#ecfdf5", // emerald-50
    activeColor: "#059669", // emerald-600
    accent: "text-emerald-600",
  },
  {
    title: "Reforestation",
    icon: Trees,
    desc: "Planting native forests to restore ecosystems and sequester carbon.",
    baseColor: "#f0fdf4", // green-50
    activeColor: "#16a34a", // green-600
    accent: "text-green-600",
  },
  {
    title: "Renewable Energy",
    icon: Sun,
    desc: "Solar, wind, and hydro installations replacing fossil fuels.",
    baseColor: "#fefce8", // yellow-50
    activeColor: "#ca8a04", // yellow-600
    accent: "text-yellow-600",
  },
  {
    title: "Biochar",
    icon: Flame,
    desc: "Converting organic waste into stable carbon-rich soil amendments.",
    baseColor: "#f4f4f5", // zinc-100
    activeColor: "#3f3f46", // zinc-700
    accent: "text-black/80",
  },
  {
    title: "Blue Carbon",
    icon: Waves,
    desc: "Mangrove and wetland restoration that locks carbon in coastal ecosystems.",
    baseColor: "#f0f9ff", // sky-50
    activeColor: "#00bcff", // sky-500
    accent: "text-sky-600",
  },
  {
    title: "Waste Management",
    icon: Recycle,
    desc: "Methane capture and waste diversion from landfills.",
    baseColor: "#f0fdfa", // teal-50
    activeColor: "#0d9488", // teal-600
    accent: "text-teal-600",
  },
];

/**
 * Individual project type card.
 *
 * @param {object} props - Component props.
 * @param {any} props.type - The project type data.
 * @param {number} props.index - The index for animation delay.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered ProjectCard component.
 */
function ProjectCard({ type, index, shouldReduceMotion }: any) {
  const Icon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={shouldReduceMotion ? {} : { y: -8 }}
      className="group relative p-10 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden cursor-pointer isolate"
      style={{ backgroundColor: type.baseColor }}
    >
      {/* SMOOTH HOVER OVERLAY */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out -z-10"
        style={{ backgroundColor: type.activeColor }}
      />

      {/* ICON CONTAINER */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
        <div className="relative p-6 rounded-3xl bg-white shadow-sm group-hover:shadow-xl group-hover:bg-transparent group-hover:text-white transition-all duration-500">
          <Icon
            size={42}
            strokeWidth={1.5}
            className={cn(
              "transition-colors duration-500",
              type.accent,
              "group-hover:text-white",
            )}
          />
        </div>
      </div>

      {/* CONTENT */}
      <h3 className="font-[family-name:var(--font-syne)] font-bold text-2xl text-slate-900 group-hover:text-white transition-colors duration-300 mb-4">
        {type.title}
      </h3>

      <p className="text-slate-600 group-hover:text-white/90 transition-colors duration-300 mb-10 text-base leading-relaxed">
        {type.desc}
      </p>

      {/* CTA */}
      <Link
        href="/register"
        className="mt-auto inline-flex items-center font-bold text-xs tracking-[0.15em] uppercase text-slate-900 group-hover:text-white transition-colors duration-300"
      >
        <span>Register This Type</span>
        <div className="ml-3 p-2 rounded-full border border-slate-200 group-hover:border-white/30 transition-colors">
          <ArrowRight
            className="group-hover:translate-x-1 transition-transform duration-300"
            size={14}
          />
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * ProjectTypesSection showcasing the different green projects supported.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered ProjectTypesSection component.
 */
export function ProjectTypesSection({
  shouldReduceMotion = false,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="pt-24 pb-4 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <header className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-slate-900 mb-6"
          >
            Green Projects We Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            From regenerative farms to blue-carbon coastlines — every project
            type you can register on Crevy.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectTypes.map((type, idx) => (
            <ProjectCard
              key={type.title}
              type={type}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
