"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Banknote,
  Leaf,
  Loader2,
  Plus,
  ScanSearch,
  TreePine,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";
import { ProjectService } from "@/lib/services/project-service";
import type { TRole } from "@/types/user.types";
import { AreaChart } from "./AreaChart";
import { GroupedBarChart } from "./BarChart";
import HeroSection from "./HeroSection";
import { StatCard } from "./StatCard";

// ─── Status badge helper ──────────────────────────────────────────────────────

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  active: "bg-[#2cc295]/10 text-[#178a74]",
  suspended: "bg-red-50 text-red-600",
  closed: "bg-slate-100 text-slate-500",
};

const stageStyle: Record<string, string> = {
  registration: "bg-amber-50 text-amber-700",
  active: "bg-blue-50 text-blue-700",
  verification: "bg-purple-50 text-purple-700",
  completed: "bg-[#2cc295]/10 text-[#178a74]",
};

const stagePct: Record<string, number> = {
  registration: 20,
  active: 55,
  verification: 80,
  completed: 100,
};

// ─── Chart mock data (stays mock for pilot — connected when MRV data flows) ──

const revenueData = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 0 },
  { label: "Mar", value: 0 },
  { label: "Apr", value: 0 },
  { label: "May", value: 0 },
  { label: "Jun", value: 0 },
  { label: "Jul", value: 0 },
  { label: "Aug", value: 0 },
  { label: "Sep", value: 0 },
  { label: "Oct", value: 0 },
  { label: "Nov", value: 0 },
  { label: "Dec", value: 0 },
];

const seqData = [
  { label: "Q1", a: 0, b: 0 },
  { label: "Q2", a: 0, b: 0 },
  { label: "Q3", a: 0, b: 0 },
  { label: "Q4", a: 0, b: 0 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectOwnerDashboard({
  userName,
  role,
}: {
  userName: string;
  role: TRole;
}) {
  const { data: session } = authClient.useSession();
  const userId = (session?.user as any)?.id;
  const router = useRouter();

  // Fetch real projects for this user
  const { data: projectsRes, isLoading: loadingProjects } = useQuery({
    queryKey: ["my-projects", userId],
    queryFn: () => ProjectService.getProjects({ createdBy: userId, limit: 10 }),
    enabled: !!userId,
  });

  const projects: any[] = projectsRes?.data ?? [];

  const activeProjects = projects.filter(
    (p) => p.projectStatus === "active",
  ).length;
  const draftProjects = projects.filter(
    (p) => p.projectStatus === "draft",
  ).length;

  return (
    <div className="space-y-8">
      <HeroSection role={role} userName={userName} />

      {/* KPI Stats */}
      <section className="mx-auto max-w-5xl">
        <SectionLabel label="Key Metrics" delay={0.05} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="My Projects"
            value={loadingProjects ? "—" : String(projects.length)}
            sub={`${activeProjects} active · ${draftProjects} draft`}
            icon={<Leaf />}
            accent="green"
            delay={0.1}
          />
          <StatCard
            label="Verified Credits"
            value="—"
            sub="Awaiting first MRV cycle"
            icon={<Banknote />}
            accent="green"
            delay={0.15}
          />
          <StatCard
            label="Total Land Area"
            value={
              loadingProjects
                ? "—"
                : projects.length
                  ? `${projects.reduce((a: number, p: any) => a + Number(p.totalAreaHectares ?? 0), 0).toFixed(1)} ha`
                  : "0 ha"
            }
            sub={`across ${projects.length} project${projects.length !== 1 ? "s" : ""}`}
            icon={<TreePine />}
            accent="blue"
            delay={0.2}
          />
          <StatCard
            label="Pending Verifications"
            value={
              loadingProjects
                ? "—"
                : String(
                    projects.filter(
                      (p: any) => p.projectStage === "verification",
                    ).length,
                  )
            }
            sub="awaiting MRV review"
            icon={<ScanSearch />}
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
            subtitle="Will populate after first credit sale"
            color="#2cc295"
            unit="$"
            delay={0.35}
          />
          <GroupedBarChart
            data={seqData}
            title="Sequestration Efficiency"
            subtitle="Will populate after first MRV verification"
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
          {loadingProjects ? (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading your projects…</span>
            </div>
          ) : projects.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-[#2cc295]" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-base">
                  No projects yet
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Register your first green project to get started on the Crevy
                  marketplace.
                </p>
              </div>
              <Link
                href="/new-project"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#2cc295] px-6 py-3 text-sm font-bold text-white hover:bg-[#178a74] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Register Your First Project
              </Link>
            </div>
          ) : (
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
                    Stage
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/projects/${p.id}`)}
                  >
                    <td className="px-5 py-4">
                      <span className="font-medium text-[#131927]">
                        {p.name ?? p.code}
                      </span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {p.region}, {p.country}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {(p.projectType as string)
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[p.projectStatus] ?? ""}`}
                      >
                        {p.projectStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${stageStyle[p.projectStage] ?? ""}`}
                      >
                        {p.projectStage}
                      </span>
                    </td>
                    <td className="px-5 py-4 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-[#2cc295] transition-all"
                            style={{
                              width: `${stagePct[p.projectStage] ?? 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {stagePct[p.projectStage] ?? 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3 text-center"
          >
            <Link
              href="/projects"
              className="text-xs font-semibold text-[#2cc295] hover:text-[#178a74] transition-colors"
            >
              View all projects →
            </Link>
          </motion.div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="mx-auto max-w-5xl pb-4">
        <SectionLabel label="Recent Activity" delay={0.65} />
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

const activityItems = [
  {
    icon: "🌱",
    title: "Account created — welcome to Crevy!",
    sub: "Get started by registering your first project.",
    color: "bg-emerald-50",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-2.5"
    >
      {activityItems.map((item, i) => (
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
