"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  CheckCircle2,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * HowItWorksSection component explaining the process for both project owners and companies.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered HowItWorksSection component.
 */
export function HowItWorksSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"owner" | "company">("owner");

  const ownerSteps = [
    {
      icon: <Calculator className="text-myGreen" size={32} />,
      title: "Calculate Your Potential",
      desc: "Use our carbon calculator to estimate your project's sequestration capacity in tCO₂e.",
    },
    {
      icon: <CheckCircle2 className="text-myGreen" size={32} />,
      title: "Register Your Project",
      desc: "Submit your project details — location, land type, practices, and supporting documents.",
    },
    {
      icon: <ShieldCheck className="text-myGreen" size={32} />,
      title: "Get Verified",
      desc: "Our auditors visit your site, confirm your data, and issue a verified carbon credit certificate.",
    },
    {
      icon: <Zap className="text-myGreen" size={32} />,
      title: "Earn Revenue",
      desc: "List your credits on the Crevy Marketplace and get paid when companies purchase them.",
    },
  ];

  const companySteps = [
    {
      icon: <Search className="text-myGreen" size={32} />,
      title: "Explore the Marketplace",
      desc: "Browse verified green projects across Africa filtered by type, region, and impact.",
    },
    {
      icon: <Calculator className="text-myGreen" size={32} />,
      title: "Assess Your Footprint",
      desc: "Use our carbon calculator to understand your company's emission baseline.",
    },
    {
      icon: <CheckCircle2 className="text-myGreen" size={32} />,
      title: "Invest in Projects",
      desc: "Purchase carbon credits directly from verified project owners.",
    },
    {
      icon: <Zap className="text-myGreen" size={32} />,
      title: "Track & Report Compliance",
      desc: "Get real-time analytics and compliance-ready reports for ESG goals.",
    },
  ];

  const steps = activeTab === "owner" ? ownerSteps : companySteps;

  return (
    <section id="how-it-works" className="py-14 md:pt-20 md:pb-10 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-myBlue mb-4">
            How Crevy Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you're a project owner or a corporate buyer, Crevy gives you
            a clear path to climate impact.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 p-1 rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("owner")}
              className={cn(
                "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === "owner"
                  ? "bg-myGreen text-white shadow-lg shadow-myGreen/20"
                  : "text-gray-500 hover:text-myBlue cursor-pointer",
              )}
            >
              I'm a Project Developer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={cn(
                "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === "company"
                  ? "bg-myGreen text-white shadow-lg shadow-myGreen/20"
                  : "text-gray-500 hover:text-myBlue cursor-pointer",
              )}
            >
              I'm a Company
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={`${activeTab}-${idx}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 font-[family-name:var(--font-syne)] font-bold text-6xl text-myGreen/10 group-hover:text-myGreen/20 transition-colors">
                  {idx + 1}
                </span>
                <div className="relative z-10">{step.icon}</div>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-myBlue mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
