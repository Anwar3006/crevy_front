"use client";

import { motion } from "framer-motion";
import { BarChart2, FileBarChart, Globe, Leaf, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { TRole } from "@/types/user.types";
import { AreaChart } from "./AreaChart";
import HeroSection from "./HeroSection";
import { DonutChart } from "./PieChart";
import { RecentActivity, SectionLabel } from "./ProjectOwnerDashboard";
import { StatCard } from "./StatCard";

// ─── Mock data ─────────────────────────────────────────────────────────────
const portfolioPie = [
  { label: "Regen-Agriculture", value: 38, color: "#2cc295" },
  { label: "Blue Carbon", value: 22, color: "#178a74" },
  { label: "Reforestation", value: 28, color: "#131927" },
  { label: "Renewable Energy", value: 12, color: "#94a3b8" },
];

const offsetProgress = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 220 },
  { label: "Mar", value: 310 },
  { label: "Apr", value: 460 },
  { label: "May", value: 530 },
  { label: "Jun", value: 680 },
  { label: "Jul", value: 790 },
  { label: "Aug", value: 940 },
  { label: "Sep", value: 1100 },
  { label: "Oct", value: 1280 },
  { label: "Nov", value: 1420 },
  { label: "Dec", value: 1600 },
];

const investments = [
  {
    name: "Volta Basin Reforestation",
    type: "Reforestation",
    credits: 420,
    value: "$8,400",
    esg: 9.2,
  },
  {
    name: "Coastal Mangrove GH",
    type: "Blue Carbon",
    credits: 280,
    value: "$6,720",
    esg: 8.7,
  },
  {
    name: "Brong Agroforestry",
    type: "Regen-Ag",
    credits: 540,
    value: "$10,260",
    esg: 9.5,
  },
  {
    name: "Northern Savanna Wind",
    type: "Renewable Energy",
    credits: 160,
    value: "$3,200",
    esg: 7.9,
  },
];

// ─── Net-zero progress gauge ────────────────────────────────────────────────
function NetZeroGauge({ pct }: { pct: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const _filled = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg
        width="130"
        height="70"
        viewBox="0 0 130 70"
        role="img"
        aria-label="Net-zero progress gauge"
      >
        {/* Track arc — bottom half only, rotated */}
        <path
          d="M 10 65 A 55 55 0 0 1 120 65"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 65 A 55 55 0 0 1 120 65"
          fill="none"
          stroke="#2cc295"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 173} 200`}
        />
        <text
          x="65"
          y="62"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#131927"
        >
          {pct}%
        </text>
      </svg>
      <p className="text-xs text-gray-400 -mt-1">Net-Zero Progress</p>
    </div>
  );
}

// ─── ESG Score pill ──────────────────────────────────────────────────────────
function EsgScore({ score }: { score: number }) {
  const color = score >= 9 ? "#2cc295" : score >= 7.5 ? "#f59e0b" : "#ef4444";
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {score.toFixed(1)}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CompanyDashboard({
  userName,
  role,
}: {
  userName: string;
  role: TRole;
}) {
  return (
    <div className="space-y-8">
      <HeroSection role={role} userName={userName} />

      {/* KPIs */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Portfolio Overview" delay={0.05} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total CO₂e Offset"
            value="4,200 t"
            sub="cumulative verified"
            icon={<Globe />}
            trend={{ value: "18%", up: true }}
            accent="green"
            delay={0.1}
          />
          <StatCard
            label="Investment Value"
            value="$84,000"
            sub="across all projects"
            icon={<TrendingUp />}
            trend={{ value: "11%", up: true }}
            accent="blue"
            delay={0.15}
          />
          <StatCard
            label="ESG Score Contribution"
            value="9.1 / 10"
            sub="above industry avg."
            icon={<BarChart2 />}
            trend={{ value: "0.4 pts", up: true }}
            accent="green"
            delay={0.2}
          />
          <StatCard
            label="Supported Projects"
            value="12"
            sub="in 4 project types"
            icon={<Leaf />}
            accent="amber"
            delay={0.25}
          />
        </div>
      </section>

      {/* Charts + Gauge */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Impact Analytics" delay={0.3} />
        <div className="grid gap-4 md:grid-cols-3">
          {/* Portfolio Diversity Donut */}
          <DonutChart
            data={portfolioPie}
            title="Portfolio Diversity"
            subtitle="Breakdown by project type"
            centerLabel="4 types"
            delay={0.35}
          />

          {/* Offset Progress area chart — spans 2 cols */}
          <div className="md:col-span-2">
            <AreaChart
              data={offsetProgress}
              title="Monthly Offset Progress"
              subtitle="Cumulative tCO₂e offset toward net-zero goal (2,000 t)"
              color="#2cc295"
              unit=""
              delay={0.4}
            />
          </div>
        </div>

        {/* Net-zero + action row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col items-center justify-center">
            <NetZeroGauge pct={80} />
            <p className="mt-2 text-xs text-center text-gray-400">
              1,600 of 2,000 t goal reached
            </p>
          </div>
          <div className="md:col-span-2 grid gap-3 grid-cols-2">
            <ActionCard
              icon={<Globe className="h-5 w-5" />}
              label="Explore Marketplace"
              sub="Find new projects to invest in"
              href="/marketplace"
              color="bg-[#131927]"
              delay={0.5}
            />
            <ActionCard
              icon={<FileBarChart className="h-5 w-5" />}
              label="Generate ESG Report"
              sub="Export compliance-ready PDF"
              href="/compliance"
              color="bg-[#2cc295]"
              delay={0.55}
            />
          </div>
        </motion.div>
      </section>

      {/* Offset Portfolio table */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Offset Portfolio" delay={0.6} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {[
                  "Project",
                  "Type",
                  "Credits (tCO₂e)",
                  "Value",
                  "ESG Score",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {investments.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-[#131927]">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{p.type}</td>
                  <td className="px-5 py-4 font-semibold text-[#131927]">
                    {p.credits.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{p.value}</td>
                  <td className="px-5 py-4">
                    <EsgScore score={p.esg} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-5xl pb-4">
        <SectionLabel label="Recent Activity" delay={0.7} />
        <RecentActivity />
      </section>
    </div>
  );
}

// ─── Action card ──────────────────────────────────────────────────────────────
function ActionCard({
  icon,
  label,
  sub,
  href,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  href: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className={`group flex flex-col h-full rounded-2xl ${color} p-5 text-white hover:opacity-90 transition-opacity shadow-sm`}
      >
        <div className="mb-3 inline-block rounded-xl bg-white/15 p-2">
          {icon}
        </div>
        <p
          className="text-sm font-bold"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {label}
        </p>
        <p className="mt-1 text-xs text-white/70">{sub}</p>
      </Link>
    </motion.div>
  );
}
