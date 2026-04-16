"use client";

import { motion } from "framer-motion";
import { Banknote, Leaf, Plus, ScanSearch, TreePine } from "lucide-react";
import Link from "next/link";
import { AreaChart } from "./AreaChart";
import { GroupedBarChart } from "./BarChart";
import HeroSection from "./HeroSection";
import { StatCard } from "./StatCard";

// ─── Mock data ────────────────────────────────────────────────────────────────
const revenueData = [
  { label: "Jan", value: 1800 },
  { label: "Feb", value: 2400 },
  { label: "Mar", value: 2100 },
  { label: "Apr", value: 3200 },
  { label: "May", value: 2900 },
  { label: "Jun", value: 4100 },
  { label: "Jul", value: 3800 },
  { label: "Aug", value: 5200 },
  { label: "Sep", value: 4700 },
  { label: "Oct", value: 6100 },
  { label: "Nov", value: 5800 },
  { label: "Dec", value: 7400 },
];

const seqData = [
  { label: "Q1", a: 420, b: 390 },
  { label: "Q2", a: 610, b: 580 },
  { label: "Q3", a: 540, b: 500 },
  { label: "Q4", a: 780, b: 720 },
];

const projects = [
  {
    name: "Volta Basin Reforestation",
    type: "Reforestation",
    status: "Verified",
    credits: 1240,
    pct: 92,
  },
  {
    name: "Brong-Ahafo Agroforestry",
    type: "Regen-Ag",
    status: "In Review",
    credits: 680,
    pct: 61,
  },
  {
    name: "Coastal Mangrove Restore",
    type: "Blue Carbon",
    status: "Pending",
    credits: 0,
    pct: 18,
  },
];

const statusStyle: Record<string, string> = {
  Verified: "bg-[#2cc295]/10 text-[#178a74]",
  "In Review": "bg-amber-50 text-amber-700",
  Pending: "bg-gray-100 text-gray-500",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectOwnerDashboard({
  userName,
}: {
  userName: string;
}) {
  return (
    <div className="space-y-8">
      <HeroSection userType="ProjectOwner" userName={userName} />

      {/* KPI Stats */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Key Metrics" delay={0.05} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Credits Issued"
            value="1,920"
            sub="tCO₂e verified"
            icon={<Leaf />}
            trend={{ value: "14%", up: true }}
            accent="green"
            delay={0.1}
          />
          <StatCard
            label="Total Revenue"
            value="$38,400"
            sub="from credit sales"
            icon={<Banknote />}
            trend={{ value: "22%", up: true }}
            accent="green"
            delay={0.15}
          />
          <StatCard
            label="Active Land Area"
            value="847 ha"
            sub="across 3 projects"
            icon={<TreePine />}
            accent="blue"
            delay={0.2}
          />
          <StatCard
            label="Pending Verifications"
            value="2"
            sub="audits scheduled"
            icon={<ScanSearch />}
            trend={{ value: "1 overdue", up: false }}
            accent="amber"
            delay={0.25}
          />
        </div>
      </section>

      {/* Charts */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Analytics" delay={0.3} />
        <div className="grid gap-4 md:grid-cols-2">
          <AreaChart
            data={revenueData}
            title="Revenue Growth"
            subtitle="Monthly income from credit sales (USD)"
            color="#2cc295"
            unit="$"
            delay={0.35}
          />
          <GroupedBarChart
            data={seqData}
            title="Sequestration Efficiency"
            subtitle="Actual vs. Estimated tCO₂e removed"
            labelA="Actual"
            labelB="Estimated"
            colorA="#2cc295"
            colorB="#131927"
            unit=""
            delay={0.4}
          />
        </div>
      </section>

      {/* Projects table */}
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel label="My Projects" delay={0.45} inline />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/new-project"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2cc295] px-4 py-2 text-xs font-semibold text-white hover:bg-[#178a74] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Register New Project
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Project
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Credits
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-[#131927]">{p.name}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{p.type}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#131927]">
                    {p.credits > 0 ? p.credits.toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-4 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[#2cc295] transition-all"
                          style={{ width: `${p.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {p.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-5xl pb-4">
        <SectionLabel label="Recent Activity" delay={0.55} />
        <RecentActivity />
      </section>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

export function SectionLabel({
  label,
  delay = 0,
  inline = false,
}: {
  label: string;
  delay?: number;
  inline?: boolean;
}) {
  return (
    <motion.h3
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`text-base font-semibold text-[#131927] ${inline ? "" : "mb-3"}`}
      style={{ fontFamily: "var(--font-syne)" }}
    >
      {label}
    </motion.h3>
  );
}

const activityItems: Record<
  "ProjectOwner" | "Company" | "Admin",
  { icon: string; title: string; sub: string; color: string }[]
> = {
  ProjectOwner: [
    {
      icon: "✅",
      title: "Volta Basin verification approved",
      sub: "2 hours ago",
      color: "bg-[#2cc295]/10",
    },
    {
      icon: "📄",
      title: "Q3 sequestration report uploaded",
      sub: "1 day ago",
      color: "bg-amber-50",
    },
    {
      icon: "🌱",
      title: "Coastal Mangrove project registered",
      sub: "3 days ago",
      color: "bg-blue-50",
    },
  ],
  Company: [
    {
      icon: "💰",
      title: "Purchased 400 tCO₂e from Green Valley",
      sub: "1 hour ago",
      color: "bg-[#2cc295]/10",
    },
    {
      icon: "📊",
      title: "ESG report generated — Q3 2024",
      sub: "2 days ago",
      color: "bg-blue-50",
    },
    {
      icon: "🤝",
      title: "New project investment: Blue Carbon GH",
      sub: "5 days ago",
      color: "bg-amber-50",
    },
  ],
  Admin: [
    {
      icon: "🔍",
      title: "Site visit completed — Brong Farm",
      sub: "30 min ago",
      color: "bg-[#2cc295]/10",
    },
    {
      icon: "⏳",
      title: "Verification pending: 3 new submissions",
      sub: "4 hours ago",
      color: "bg-amber-50",
    },
    {
      icon: "✅",
      title: "User approved: Mensah Farms Ltd.",
      sub: "Yesterday",
      color: "bg-blue-50",
    },
  ],
};

export function RecentActivity({
  role = "ProjectOwner",
}: {
  role?: "ProjectOwner" | "Company" | "Admin";
} = {}) {
  const items = activityItems[role];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-2.5"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm hover:border-gray-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${item.color}`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-[#131927]">{item.title}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-[#2cc295] hover:text-[#178a74] transition-colors"
          >
            View →
          </button>
        </div>
      ))}
    </motion.div>
  );
}
