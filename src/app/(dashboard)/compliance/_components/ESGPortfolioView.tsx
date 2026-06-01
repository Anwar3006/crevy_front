"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  History,
  Info,
  Loader2,
  MoreVertical,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Design Philosophy: Institutional Accountability ───────────────────────
// We use a stark, high-contrast palette (Slate-900, Emerald-500, White).
// Spacing is generous to convey "Monolithic Integrity".
// Typography uses bold, uppercase labels for structural anchors.

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

export default function ESGPortfolioView() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "audit">(
    "overview",
  );
  const [isGenerating, setIsPending] = useState(false);

  // Mock data for the demonstration of international grade UI
  const scopeData = [
    { name: "Scope 1", value: 400 },
    { name: "Scope 2", value: 300 },
    { name: "Scope 3", value: 300 },
    { name: "Removal", value: 200 },
  ];

  const trendData = [
    { month: "Jan", amount: 45 },
    { month: "Feb", amount: 52 },
    { month: "Mar", amount: 48 },
    { month: "Apr", amount: 61 },
    { month: "May", amount: 55 },
    { month: "Jun", amount: 67 },
  ];

  const handleGenerate = async () => {
    setIsPending(true);
    // Simulate API delay
    setTimeout(() => setIsPending(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest italic">
            Institutional Impact Registry
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">
            Global ESG Protocol & Asset Permanence Audit
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Generate Compliance Report
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex border-b border-slate-200">
        {[
          { id: "overview", label: "Portfolio Overview" },
          { id: "history", label: "Report History" },
          { id: "audit", label: "Audit Trail" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab.id ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* ── Stats ── */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      Institutional Offset Portfolio
                    </p>
                    <h2 className="text-6xl font-black leading-none tracking-tighter italic">
                      2,840
                      <span className="text-xl text-slate-500 ml-3">tCO2e</span>
                    </h2>
                    <div className="mt-12 flex items-center gap-2 bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-emerald-500/20">
                      <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        +12.4% Net Performance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      Certified Impact Assets
                    </p>
                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
                      14
                    </h2>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Reforestation", "Regen Ag", "Blue Carbon"].map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 text-slate-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-xl border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Trend Chart ── */}
              <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Offset Acquisition Index
                  </h3>
                  <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>Last 12 Months</option>
                  </select>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient
                          id="colorAmount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                          fontSize: "10px",
                          fontWeight: "900",
                          textTransform: "uppercase",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ── Breakdown Sidebar ── */}
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm h-full flex flex-col">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">
                  Institutional Allocation
                </h3>
                <div className="flex-1 flex flex-col items-center justify-center min-h-[350px]">
                  <ResponsiveContainer width="100%" height={260}>
                    <RePieChart>
                      <Pie
                        data={scopeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {scopeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="w-full mt-10 space-y-4">
                    {scopeData.map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[12px] font-black text-slate-900 tracking-tighter">
                          {item.value} t
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Registry Reference
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Reporting Window
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Institutional Impact
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    ref: "ESG-PROTOCOL-2026-Q1",
                    period: "January 2026 - March 2026",
                    amount: "1,240 tCO2e",
                    date: "April 02, 2026",
                  },
                  {
                    ref: "ESG-PROTOCOL-2025-FY",
                    period: "Fiscal Year 2025",
                    amount: "4,800 tCO2e",
                    date: "Jan 10, 2026",
                  },
                  {
                    ref: "ESG-PROTOCOL-2025-Q4",
                    period: "October 2025 - December 2025",
                    amount: "1,100 tCO2e",
                    date: "Oct 05, 2025",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tighter uppercase italic">
                            {row.ref}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">
                            Published: {row.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 uppercase tracking-[0.15em] font-bold text-slate-500 text-[10px]">
                      {row.period}
                    </td>
                    <td className="px-10 py-8 text-slate-900 font-black tracking-tight">
                      {row.amount}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button
                        type="button"
                        className="bg-slate-900 text-white hover:bg-emerald-600 px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
                      >
                        Download Artifact <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-10 bg-slate-50 flex justify-center border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" /> All
                artifacts are cryptographically hashed and anchored to Polygon
                Mainnet.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm"
          >
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                  Institutional Protocol Ledger
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
                  Permanent record of all state-changing institutional
                  operations
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Audit Filter <Filter size={16} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  actor: "Automated System",
                  action: "CERTIFICATE_GENERATION",
                  resource: "RETIREMENT_ARTIFACT",
                  time: "2 mins ago",
                  details: "CERT-2026-X8842 finalized",
                },
                {
                  actor: "Admin Lead",
                  action: "STATUS_MODIFICATION",
                  resource: "PROJECT_LIFECYCLE",
                  time: "1 hour ago",
                  details: "Project Registry B marked as VERIFIED",
                },
                {
                  actor: "Sustainability Lead",
                  action: "REPORT_INITIATION",
                  resource: "ESG_PROTOCOL",
                  time: "3 hours ago",
                  details: "Q1 Impact Analysis triggered",
                },
                {
                  actor: "Automated System",
                  action: "ASSET_ISSUANCE",
                  resource: "CARBON_CREDIT_POOL",
                  time: "5 hours ago",
                  details: "Batch: POLY-PROTOCOL-42 anchored",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-2 h-10 bg-slate-100 rounded-full group-hover:bg-emerald-500 transition-colors shadow-inner" />
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">
                        {log.actor} executed {log.action.replace("_", " ")}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-3 tracking-widest italic">
                        {log.details}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-slate-900 text-emerald-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/10">
                      {log.resource}
                    </span>
                    <p className="text-[9px] font-black text-slate-300 uppercase mt-4 tracking-tighter">
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-12 bg-slate-50 flex justify-center border-t border-slate-100 italic">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                End of active institutional ledger. Historical cold-storage
                archives accessible via administrative protocol.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
