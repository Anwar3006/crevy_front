"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Filter,
  History,
  Loader2,
  ShieldCheck,
  TrendingUp,
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
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            ESG Impact Registry
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Institutional carbon offset tracking and compliance reporting.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
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
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "overview" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          Portfolio Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "history" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          Report History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* ── Stats ── */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      Total Carbon Offset
                    </p>
                    <h2 className="text-5xl font-black leading-none">
                      2,840
                      <span className="text-xl text-slate-500 ml-2">tCO2e</span>
                    </h2>
                    <div className="mt-8 flex items-center gap-2 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="text-emerald-400 text-[10px] font-black uppercase">
                        +12.4% vs last year
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    Active Impact Projects
                  </p>
                  <h2 className="text-5xl font-black text-slate-900">14</h2>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Reforestation", "Regen Ag", "Blue Carbon"].map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 text-slate-600 text-[9px] font-black uppercase px-3 py-1 rounded-lg border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Trend Chart ── */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Offset Acquisition Trend
                  </h3>
                  <select className="bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase px-3 py-1 text-slate-600 outline-none">
                    <option>Last 12 Months</option>
                  </select>
                </div>
                <div className="h-[240px] w-full">
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
                            stopOpacity={0.1}
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
                          fontWeight: 700,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontSize: "10px",
                          fontWeight: "900",
                          textTransform: "uppercase",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ── Breakdown Sidebar ── */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm h-full flex flex-col">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                  Scope Distribution
                </h3>
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                  <ResponsiveContainer width="100%" height={240}>
                    <RePieChart>
                      <Pie
                        data={scopeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
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
                  <div className="w-full mt-4 space-y-3">
                    {scopeData.map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-slate-900">
                          {item.value} t
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Report Reference
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Period
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Total Offset
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[11px] font-bold text-slate-700">
                {[
                  {
                    ref: "ESG-2026-Q1",
                    period: "Jan - Mar 2026",
                    amount: "1,240 tCO2e",
                    date: "April 02, 2026",
                  },
                  {
                    ref: "ESG-2025-FY",
                    period: "Jan - Dec 2025",
                    amount: "4,800 tCO2e",
                    date: "Jan 10, 2026",
                  },
                  {
                    ref: "ESG-2025-Q4",
                    period: "Oct - Dec 2025",
                    amount: "1,100 tCO2e",
                    date: "Oct 05, 2025",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight">
                            {row.ref}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase mt-0.5">
                            Generated: {row.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 uppercase tracking-wider">
                      {row.period}
                    </td>
                    <td className="px-8 py-6 text-slate-900 font-black">
                      {row.amount}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-all inline-flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"
                      >
                        Download PDF <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-8 bg-slate-50 flex justify-center border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> All
                reports are cryptographically signed and stored in immutable R2
                storage.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
