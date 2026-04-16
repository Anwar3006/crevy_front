"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  trend?: { value: string; up: boolean };
  accent?: "green" | "blue" | "amber" | "rose";
  delay?: number;
}

const accentMap = {
  green: {
    bg: "from-[#2cc295]/10 to-[#178a74]/5",
    border: "border-[#2cc295]/20",
    iconBg: "bg-[#2cc295]/15",
    iconColor: "text-[#178a74]",
    trendUp: "text-[#178a74] bg-[#2cc295]/10",
    trendDown: "text-rose-600 bg-rose-50",
  },
  blue: {
    bg: "from-[#131927]/5 to-[#131927]/0",
    border: "border-[#131927]/10",
    iconBg: "bg-[#131927]/8",
    iconColor: "text-[#131927]",
    trendUp: "text-[#178a74] bg-[#2cc295]/10",
    trendDown: "text-rose-600 bg-rose-50",
  },
  amber: {
    bg: "from-amber-500/8 to-amber-400/0",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    trendUp: "text-[#178a74] bg-[#2cc295]/10",
    trendDown: "text-rose-600 bg-rose-50",
  },
  rose: {
    bg: "from-rose-500/8 to-rose-400/0",
    border: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    trendUp: "text-[#178a74] bg-[#2cc295]/10",
    trendDown: "text-rose-600 bg-rose-50",
  },
};

export const StatCard = ({
  label,
  value,
  sub,
  icon,
  trend,
  accent = "green",
  delay = 0,
}: StatCardProps) => {
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${a.bg} ${a.border} p-5 backdrop-blur-sm`}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${a.iconBg}`}>
          <span className={`block [&_svg]:h-5 [&_svg]:w-5 ${a.iconColor}`}>
            {icon}
          </span>
        </div>
        {trend && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trend.up ? a.trendUp : a.trendDown}`}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p
          className="font-syne text-2xl font-bold tracking-tight text-[#131927]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {value}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-500">{label}</p>
        {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
      </div>
    </motion.div>
  );
};
