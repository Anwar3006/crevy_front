"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { TRole } from "@/types/user.types";
import { GroupedBarChart } from "./BarChart";
import HeroSection from "./HeroSection";
import { MultiLineChart } from "./LineChart";
import OnboardingFlow from "./OnboardingFlow";
import { SectionLabel } from "./ProjectOwnerDashboard";
import { StatCard } from "./StatCard";
import SystemHealth from "./SystemHealth";

// ─── Mock data ────────────────────────────────────────────────────────────────
const userGrowthData = [
  { label: "Jan", a: 12, b: 5 },
  { label: "Feb", a: 19, b: 9 },
  { label: "Mar", a: 28, b: 14 },
  { label: "Apr", a: 35, b: 18 },
  { label: "May", a: 42, b: 22 },
  { label: "Jun", a: 51, b: 28 },
  { label: "Jul", a: 63, b: 34 },
  { label: "Aug", a: 74, b: 40 },
  { label: "Sep", a: 88, b: 49 },
  { label: "Oct", a: 102, b: 57 },
  { label: "Nov", a: 118, b: 64 },
  { label: "Dec", a: 134, b: 72 },
];

const liquidityData = [
  { label: "Q1", a: 1200, b: 840 },
  { label: "Q2", a: 1850, b: 1420 },
  { label: "Q3", a: 2100, b: 1680 },
  { label: "Q4", a: 2760, b: 2290 },
];

const pendingProjects = [
  {
    name: "Northern Savanna Wind Farm",
    owner: "Mensah Farms Ltd.",
    type: "Renewable Energy",
    submitted: "2 days ago",
    priority: "High",
  },
  {
    name: "Oti River Wetland Restore",
    owner: "Green Volta Co.",
    type: "Blue Carbon",
    submitted: "4 days ago",
    priority: "Medium",
  },
  {
    name: "Eastern Corridor Reforest.",
    owner: "Asante Land Trust",
    type: "Reforestation",
    submitted: "6 days ago",
    priority: "Medium",
  },
  {
    name: "Upper West Regen-Ag Hub",
    owner: "Bolgatanga Farmers Coop",
    type: "Regen-Ag",
    submitted: "1 week ago",
    priority: "Low",
  },
];

const pendingUsers = [
  {
    name: "Abena Twumasi",
    org: "EcoGhana Ltd.",
    type: "financial_admin",
    since: "Today",
  },
  {
    name: "Kwame Boateng",
    org: "Solo Farmer",
    type: "project_owner",
    since: "Yesterday",
  },
  {
    name: "Dr. Yaa Mensah",
    org: "Climate Africa",
    type: "super_admin",
    since: "2 days ago",
  },
];

const priorityStyle: Record<string, string> = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-gray-100 text-gray-500",
};

const roleStyle: Record<string, string> = {
  financial_admin: "bg-blue-50 text-blue-600",
  project_owner: "bg-[#2cc295]/10 text-[#178a74]",
  super_admin: "bg-purple-50 text-purple-600",
  mrv_admin: "bg-amber-50 text-amber-600",
  project_manager: "bg-emerald-50 text-emerald-600",
};

// ─── Approve / Reject modal ───────────────────────────────────────────────────
function VerifyModal({
  item,
  onClose,
  type,
}: {
  item: { name: string } | null;
  onClose: () => void;
  type: "project" | "user";
}) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2cc295]/10">
            <ShieldCheck className="h-5 w-5 text-[#178a74]" />
          </div>
          <h3
            className="mt-3 text-base font-bold text-[#131927]"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {type === "project" ? "Verify Project" : "Approve User"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to approve{" "}
            <span className="font-semibold text-[#131927]">{item.name}</span>?
            This action will be logged.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-[#2cc295] py-2.5 text-sm font-semibold text-white hover:bg-[#178a74] transition-colors"
            >
              Approve
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Alerts strip ─────────────────────────────────────────────────────────────
function AlertStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.28 }}
      className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <p className="text-sm text-amber-700">
        <span className="font-semibold">5 items</span> require your attention —
        3 project submissions and 2 new user registrations are pending review.
      </p>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const adminActivityItems = [
  {
    icon: "🛡️",
    title: "New Super Admin assigned",
    sub: "Dr. Yaa Mensah was granted elevated privileges.",
    color: "bg-purple-50",
  },
  {
    icon: "✅",
    title: "Project Verified: Northern Savanna",
    sub: "Technical review completed by MRV Admin.",
    color: "bg-emerald-50",
  },
  {
    icon: "⚠️",
    title: "Unusual login detected",
    sub: "IP mismatch for user Abena Twumasi.",
    color: "bg-amber-50",
  },
  {
    icon: "📄",
    title: "New registration: Green Volta Co.",
    sub: "Pending KYC and document verification.",
    color: "bg-blue-50",
  },
];

export function AdminRecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-2.5"
    >
      {adminActivityItems.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm"
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
        </div>
      ))}
    </motion.div>
  );
}

export default function AdminDashboard({
  userName,
  role,
}: {
  userName: string;
  role: TRole;
}) {
  const [projectModal, setProjectModal] = useState<{ name: string } | null>(
    null,
  );
  const [userModal, setUserModal] = useState<{ name: string } | null>(null);

  return (
    <div className="space-y-8">
      <HeroSection role={role} userName={userName} />

      {/* Alert strip */}
      <div className="mx-auto max-w-5xl">
        <AlertStrip />
      </div>

      {/* KPIs */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Platform Overview" delay={0.05} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Platform Volume"
            value="6,420 t"
            sub="$128,400 total value"
            icon={<Activity />}
            trend={{ value: "24%", up: true }}
            accent="green"
            delay={0.1}
          />
          <StatCard
            label="New Users (Weekly)"
            value="+34"
            sub="22 owners · 12 companies"
            icon={<Users />}
            trend={{ value: "8%", up: true }}
            accent="blue"
            delay={0.15}
          />
          <StatCard
            label="Pending Approvals"
            value="5"
            sub="3 projects · 2 users"
            icon={<Clock />}
            trend={{ value: "2 urgent", up: false }}
            accent="amber"
            delay={0.2}
          />
          <StatCard
            label="System Alerts"
            value="2"
            sub="1 critical · 1 warning"
            icon={<AlertTriangle />}
            trend={{ value: "resolved: 4", up: true }}
            accent="rose"
            delay={0.25}
          />
        </div>
      </section>

      {/* Charts + Onboarding */}
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <SectionLabel label="Platform Analytics" delay={0.3} />
            <div className="grid gap-4 md:grid-cols-2">
              <MultiLineChart
                data={userGrowthData}
                title="User Growth"
                subtitle="Monthly onboarding"
                labelA="Owners"
                labelB="Companies"
                colorA="#2cc295"
                colorB="#131927"
                delay={0.35}
              />
              <GroupedBarChart
                data={liquidityData}
                title="Liquidity"
                subtitle="Credits (tCO₂e)"
                labelA="Listed"
                labelB="Purchased"
                colorA="#2cc295"
                colorB="#131927"
                delay={0.4}
              />
            </div>
          </div>
          <div className="space-y-4">
            <SectionLabel label="Lifecycle Watch" delay={0.3} />
            <OnboardingFlow />
            <SectionLabel label="Operations" delay={0.35} />
            <SystemHealth />
          </div>
        </div>
      </section>

      {/* Project Vetting Queue */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Project Vetting Queue" delay={0.45} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {[
                  "Project",
                  "Owner",
                  "Type",
                  "Submitted",
                  "Priority",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingProjects.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium text-[#131927] max-w-[160px] truncate">
                    {p.name}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {p.owner}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {p.type}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {p.submitted}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityStyle[p.priority]}`}
                    >
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProjectModal({ name: p.name })}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#2cc295]/10 px-2.5 py-1 text-xs font-semibold text-[#178a74] hover:bg-[#2cc295]/20 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" /> Verify
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-100 transition-colors"
                      >
                        <XCircle className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* User Management */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Pending User Registrations" delay={0.55} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {["Name", "Organisation", "Role", "Applied", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-[#131927]">
                    {u.name}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{u.org}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleStyle[u.type]}`}
                    >
                      {u.type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{u.since}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setUserModal({ name: u.name })}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#2cc295]/10 px-2.5 py-1 text-xs font-semibold text-[#178a74] hover:bg-[#2cc295]/20 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3" /> Approve
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-100 transition-colors"
                      >
                        <XCircle className="h-3 w-3" /> Decline
                      </button>
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
        <SectionLabel label="Recent Activity" delay={0.65} />
        <AdminRecentActivity />
      </section>

      {/* Modals */}
      <VerifyModal
        item={projectModal}
        onClose={() => setProjectModal(null)}
        type="project"
      />
      <VerifyModal
        item={userModal}
        onClose={() => setUserModal(null)}
        type="user"
      />
    </div>
  );
}
