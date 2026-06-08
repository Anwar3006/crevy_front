"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Clock,
  DollarSign,
  Layers,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import {
  AlertStrip,
  MrvPipelineStepper,
  SectionLabel,
  StatCard,
} from "./Shared";

export default function SuperAdminDashboard({
  userName,
}: {
  userName: string;
}) {
  // MOCK DATA - To be replaced by APIs
  const pendingProjectsCount = 4;
  const pendingUsersCount = 12;
  const totalPending = pendingProjectsCount + pendingUsersCount;

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10 font-sans selection:bg-slate-900 selection:text-white bg-slate-50 min-h-screen">
      {/* ── 1. Hero Dossier ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-12 gap-px bg-slate-200 border border-slate-200 mb-8"
      >
        <div className="md:col-span-8 bg-white p-10 md:p-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4">
            Super Admin · Platform Registry
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-6">
            Carbon Registry{" "}
            <span className="italic text-slate-500">Command Centre.</span>
          </h1>
          <p className="text-slate-500 font-light leading-relaxed max-w-xl mb-10">
            Monitor credit issuance, approve registrations, and ensure the
            cryptographic integrity of the global offset pipeline.
          </p>
          <Link
            href="/compliance"
            className="inline-flex bg-slate-900 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors"
          >
            Audit Ledger
          </Link>
        </div>

        <div className="md:col-span-4 bg-slate-950 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-serif text-2xl mb-8">Operative: {userName}</p>
            <ul className="space-y-4 font-mono text-xs text-slate-400">
              <li className="flex items-center gap-3">
                <span className="text-emerald-500">→</span>{" "}
                {pendingProjectsCount} Project reviews pending
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-500">→</span> {pendingUsersCount}{" "}
                KYC audits pending
              </li>
              <li className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800 text-slate-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-none shrink-0 animate-pulse" />{" "}
                All services operational
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Alert Strip ── */}
      <AlertStrip
        count={totalPending}
        message={`${pendingProjectsCount} asset submissions and ${pendingUsersCount} identity registrations require immediate governance review.`}
        delay={0.1}
      />

      {/* ── 3. KPI Matrix ── */}
      <div className="mb-16">
        <SectionLabel label="Registry Liquidity Overview" delay={0.15} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          <StatCard
            label="Total Credits Issued"
            value="42,840"
            unit="tCO₂e"
            icon={Leaf}
            accent="emerald"
            trend="+12% WoW"
            delay={0.2}
          />
          <StatCard
            label="Gross Registry Value"
            value="$856,800"
            unit="USD"
            icon={DollarSign}
            accent="blue"
            trend="+8% WoW"
            delay={0.25}
          />
          <StatCard
            label="Active Projects"
            value="204"
            unit="Nodes"
            icon={Layers}
            accent="emerald"
            trend="+3 Nodes"
            delay={0.3}
          />
          <StatCard
            label="Pending Governance"
            value={totalPending.toString()}
            unit="Actions"
            icon={Clock}
            accent="amber"
            trend="-2 vs last week"
            delay={0.35}
          />
        </div>
      </div>

      {/* ── 4. Financial Overview ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <SectionLabel label="Financial Settlement Vectors" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Platform Revenue (MTD)
              </p>
              <h4 className="text-4xl font-mono font-bold text-slate-900 mb-2">
                $24,600
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <ArrowUpRight size={12} /> 18% vs last month
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Payout Queue
              </p>
              <h4 className="text-4xl font-mono font-bold text-slate-900 mb-2">
                12{" "}
                <span className="text-base text-slate-400 font-sans">
                  Pending
                </span>
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                $38,240 outstanding
              </p>
            </div>
            <Link
              href="/financials/payouts"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 self-start mt-6 hover:text-emerald-700 hover:border-emerald-700 transition-colors"
            >
              Manage Payouts
            </Link>
          </div>
          <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                Credits Acquired (MTD)
              </p>
              <h4 className="text-4xl font-mono font-bold text-slate-900 mb-2">
                2,840{" "}
                <span className="text-base text-slate-400 font-sans">
                  tCO₂e
                </span>
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Value: $56,800
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 5. Analytics Terminal ── */}
      <div className="mb-16">
        <SectionLabel label="Market Telemetry" delay={0.45} />
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white border border-slate-200 p-8 h-[350px]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                User Acquisition Trajectory
              </h3>
              <div className="w-full h-[250px] flex items-center justify-center bg-slate-50 text-slate-400 font-mono text-xs border border-dashed border-slate-200">
                [MultiLineChart Component Renders Here]
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-8 h-[350px]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                Credit Market Liquidity
              </h3>
              <div className="w-full h-[250px] flex items-center justify-center bg-slate-50 text-slate-400 font-mono text-xs border border-dashed border-slate-200">
                [GroupedBarChart Component Renders Here]
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 p-8 h-[350px] overflow-x-hidden">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">
                MRV Pipeline Flow
              </h3>
              <MrvPipelineStepper
                stages={[
                  { key: "ingest", label: "Ingest", count: 14, href: "#" },
                  { key: "verify", label: "Verify", count: 6, href: "#" },
                  { key: "anchor", label: "Anchor", count: 3, href: "#" },
                  { key: "issue", label: "Issue", count: 28, href: "#" },
                ]}
              />
            </div>
            <div className="bg-slate-900 border border-slate-900 p-8 h-[350px] text-white">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-800 pb-2">
                System Diagnostics
              </h3>
              <ul className="space-y-5 font-mono text-xs">
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Registry Uptime</span>
                  <span className="text-emerald-400">99.97%</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Polygon Anchoring</span>
                  <span className="text-emerald-400">142ms avg</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Double-Count DB</span>
                  <span className="text-emerald-400">Clean</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Pending KYC</span>
                  <span className="text-amber-400">
                    {pendingUsersCount} Items
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Data Tables ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-16"
      >
        {/* Project Vetting Queue */}
        <div>
          <SectionLabel
            label="Project Vetting Ledger"
            action={{ label: "View All Projects", href: "/projects" }}
          />
          <div className="bg-white border border-slate-200 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b-2 border-slate-900">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Project Reference
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Originator
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Methodology
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-slate-900">
                    PRJ-GH-2026-081
                  </td>
                  <td className="px-6 py-4 font-serif text-sm">Kwame Ofori</td>
                  <td className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Agroforestry
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-rose-200 bg-rose-50 text-rose-700">
                      High
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-800 transition-colors"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* User Vetting Queue */}
        <div>
          <SectionLabel
            label="Identity Verification Ledger"
            action={{ label: "Manage Directory", href: "/user-management" }}
          />
          <div className="bg-white border border-slate-200 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b-2 border-slate-900">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Identity Reference
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Entity Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Role Request
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    KYC Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-slate-900">
                    USR-GH-9921
                  </td>
                  <td className="px-6 py-4 font-serif text-sm">
                    EcoFarm Consortium
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Project Owner
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest border border-amber-200 bg-amber-50 text-amber-700">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                      Audit
                    </button>
                    <button
                      type="button"
                      className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-800 transition-colors"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <SectionLabel label="System Ledger Feed" />
          <div className="bg-white border border-slate-200 p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-700 shrink-0">
                  <Leaf size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    1,200 tCO₂e Issued to PRJ-GH-2026-001
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                    Today, 14:32 UTC
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-700 shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Payout $14,200 executed for EcoLogic Systems
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                    Today, 11:15 UTC
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 text-slate-700 shrink-0">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    System maintenance completed successfully
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                    Yesterday, 02:00 UTC
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
