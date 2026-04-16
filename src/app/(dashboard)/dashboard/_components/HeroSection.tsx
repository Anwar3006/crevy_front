"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/constants/sidebar-items";

interface HeroSectionProps {
  userType: UserType;
  userName: string;
}

const configs = {
  ProjectOwner: {
    title: "Build your carbon legacy",
    description:
      "Register projects, track sequestration, and earn verified carbon credits with full transparency.",
    cta: { label: "Register New Project", url: "/new-project", icon: Rocket },
    badge: {
      text: "3 Active Projects",
      color: "bg-[#2cc295]/10 text-[#178a74]",
    },
    nextSteps: [
      { icon: Clock, text: "Verification audit scheduled in 3 days" },
      { icon: AlertTriangle, text: "2 documents pending upload" },
    ],
    gradFrom: "#2cc295",
    gradTo: "#178a74",
  },
  Company: {
    title: "Maximize your ESG impact",
    description:
      "Invest in verified green projects, track your offset portfolio, and generate compliance-ready reports.",
    cta: { label: "Explore Marketplace", url: "/marketplace", icon: Sparkles },
    badge: { text: "12 Active Investments", color: "bg-blue-50 text-blue-700" },
    nextSteps: [
      { icon: Clock, text: "ESG report due in 14 days" },
      { icon: AlertTriangle, text: "3 portfolio projects need renewal" },
    ],
    gradFrom: "#131927",
    gradTo: "#1e2d42",
  },
  Admin: {
    title: "Streamline site verification",
    description:
      "Manage assigned businesses, schedule field visits, and process the verification queue efficiently.",
    cta: {
      label: "View Assignments",
      url: "/assigned-businesses",
      icon: Target,
    },
    badge: { text: "5 Pending Approvals", color: "bg-amber-50 text-amber-700" },
    nextSteps: [
      { icon: Clock, text: "Site visit at Green Valley Farm — Tomorrow 9 AM" },
      { icon: AlertTriangle, text: "14 pending verification documents" },
    ],
    gradFrom: "#178a74",
    gradTo: "#131927",
  },
};

const HeroSection = ({ userType, userName }: HeroSectionProps) => {
  const router = useRouter();
  const c = configs[userType];
  const Cta = c.cta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-5xl"
    >
      <div className="grid gap-4 md:grid-cols-5">
        {/* Left: Main CTA panel */}
        <div className="md:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${c.badge.color} mb-4`}
          >
            {c.badge.text}
          </span>
          <h2
            className="text-2xl font-bold leading-tight text-[#131927]"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {c.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-sm">
            {c.description}
          </p>
          <button
            type="button"
            onClick={() => router.push(c.cta.url)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${c.gradFrom}, ${c.gradTo})`,
            }}
          >
            <Cta className="h-4 w-4" />
            {c.cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right: Welcome + Next Steps */}
        <div
          className="md:col-span-2 relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
          style={{
            background: `linear-gradient(145deg, ${c.gradFrom}, ${c.gradTo})`,
          }}
        >
          {/* BG decoration */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/8 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/6 blur-2xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Welcome back
            </p>
            <h3
              className="mt-1 text-xl font-bold"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {userName.split(" ")[0] || "User"} 👋
            </h3>

            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Next Steps
              </p>
              {c.nextSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/70" />
                    <p className="text-xs leading-snug text-white/90">
                      {step.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
