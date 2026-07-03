"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  FileText,
  Filter,
  Loader2,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Design Philosophy: Institutional Accountability ───────────────────────
// We use a stark, high-contrast palette. Spacing is architectural.
// Typography relies on font-sans for narrative and font-mono for data.

const ALLOCATION_COLORS = ["#0f172a", "#059669", "#64748b", "#cbd5e1"];

export default function ESGPortfolioView() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "audit">(
    "overview",
  );
  const [isGenerating, setIsPending] = useState(false);

  // ─── Mock Data for High-End Visualization ───

  // Net Zero Trajectory (Emissions vs Offsets over Quarters)
  const netZeroData = [
    { period: "Q1 '25", emissions: 1200, offsets: 200 },
    { period: "Q2 '25", emissions: 1150, offsets: 350 },
    { period: "Q3 '25", emissions: 1080, offsets: 500 },
    { period: "Q4 '25", emissions: 980, offsets: 750 },
    { period: "Q1 '26", emissions: 920, offsets: 880 },
    { period: "Q2 '26", emissions: 850, offsets: 920 }, // Projected cross-over
  ];

  // Portfolio Methodology Allocation
  const allocationData = [
    { name: "Reforestation (AR)", value: 45 },
    { name: "Soil Carbon (ALM)", value: 30 },
    { name: "Biochar (BC)", value: 15 },
    { name: "Blue Carbon", value: 10 },
  ];

  const handleGenerate = async () => {
    setIsPending(true);
    setTimeout(() => setIsPending(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* ── Editorial Header ── */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-secondary"></div>
                <span className="text-foreground text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Corporate Compliance Protocol
                </span>
                <div className="w-8 h-[1px] bg-secondary"></div>
              </div>

              <h1 className="text-5xl md:text-7xl font-sans text-foreground tracking-tight leading-[1.05] mb-6">
                ESG Impact{" "}
                <span className="italic text-muted-foreground">Registry.</span>
              </h1>

              <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-2xl">
                The definitive, immutable record of your organization's
                environmental liabilities, verified carbon removals, and
                cryptographic audit artifacts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-secondary hover:bg-emerald-900 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-3 disabled:opacity-50 shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {isGenerating
                ? "Compiling Audit..."
                : "Generate Compliance Artifact"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Architectural Navigation ── */}
      <div className="border-b border-border bg-muted sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex overflow-x-auto custom-scrollbar">
          {[
            { id: "overview", label: "Net Zero Dashboard" },
            { id: "history", label: "Reporting Archives" },
            { id: "audit", label: "Immutable Ledger" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap border-b-2",
                activeTab === tab.id
                  ? "border-slate-900 text-foreground bg-white"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 pb-24">
        <AnimatePresence mode="wait">
          {/* ── TAB: OVERVIEW ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Left Column: Trajectory & Stats */}
              <div className="lg:col-span-8 space-y-8">
                {/* Metric Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-border">
                  <div className="bg-white p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Total Verified Retirements
                      </p>
                      <h2 className="text-5xl font-mono text-foreground font-bold tracking-tight">
                        2,840
                        <span className="text-xl text-muted-foreground ml-2 font-sans font-normal">
                          tCO₂e
                        </span>
                      </h2>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-emerald-200">
                        ISO 14064 Compliant
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Net Zero Gap
                      </p>
                      <h2 className="text-5xl font-mono text-foreground font-bold tracking-tight">
                        -70
                        <span className="text-xl text-muted-foreground ml-2 font-sans font-normal">
                          tCO₂e
                        </span>
                      </h2>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      <TrendingDown size={14} /> Deficit Shrinking (YoY)
                    </div>
                  </div>
                </div>

                {/* Net Zero Trajectory Chart */}
                <div className="bg-white border border-border p-8 md:p-10">
                  <div className="flex justify-between items-end mb-10 border-b border-border pb-6">
                    <div>
                      <h3 className="text-2xl font-sans text-foreground">
                        Emissions vs. Offsets
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Corporate trajectory toward Net Zero parity.
                      </p>
                    </div>
                    <div className="hidden md:flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <div className="w-3 h-3 bg-slate-200"></div> Gross
                        Emissions
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <div className="w-3 h-1 bg-emerald-600"></div> Verified
                        Removals
                      </span>
                    </div>
                  </div>

                  <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={netZeroData}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="period"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            fill: "#64748b",
                          }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            fill: "#64748b",
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "0",
                            border: "1px solid #cbd5e1",
                            boxShadow: "none",
                            fontFamily: "monospace",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="emissions"
                          name="Gross Emissions"
                          fill="#e2e8f0"
                          barSize={40}
                        />
                        <Line
                          type="monotone"
                          dataKey="offsets"
                          name="Verified Removals"
                          stroke="#059669"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column: Allocation & Demographics */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-muted border border-border p-8 md:p-10 h-full flex flex-col">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground border-b border-border pb-4 mb-8">
                    Asset Diversification
                  </h3>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {allocationData.map((_entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ALLOCATION_COLORS[
                                    index % ALLOCATION_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "0",
                              border: "1px solid #cbd5e1",
                              fontFamily: "monospace",
                              fontSize: "11px",
                            }}
                            itemStyle={{ color: "#0f172a" }}
                          />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full mt-8 border-t border-border pt-6">
                      {allocationData.map((item, i) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2 h-2"
                              style={{
                                backgroundColor:
                                  ALLOCATION_COLORS[
                                    i % ALLOCATION_COLORS.length
                                  ],
                              }}
                            />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-foreground">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB: HISTORY ── */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="border border-border bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-muted">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                        Protocol Reference
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                        Reporting Window
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                        Impact Claim
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground text-right">
                        Artifact
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      {
                        ref: "ESG-AUDIT-26Q1",
                        period: "JAN 2026 — MAR 2026",
                        amount: "1,240",
                        date: "APR 02, 2026",
                      },
                      {
                        ref: "ESG-AUDIT-25FY",
                        period: "JAN 2025 — DEC 2025",
                        amount: "4,800",
                        date: "JAN 10, 2026",
                      },
                      {
                        ref: "ESG-AUDIT-25Q4",
                        period: "OCT 2025 — DEC 2025",
                        amount: "1,100",
                        date: "JAN 05, 2026",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-muted transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="font-mono text-sm font-bold text-foreground">
                            {row.ref}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            Published: {row.date}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1">
                            {row.period}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-mono text-lg font-bold text-emerald-800">
                            {row.amount}{" "}
                            <span className="text-xs text-muted-foreground font-normal">
                              tCO₂e
                            </span>
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 border border-border text-foreground hover:border-slate-900 hover:bg-secondary hover:text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                          >
                            <Download size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600" />{" "}
                  Cryptographically anchored
                </p>
              </div>
            </motion.div>
          )}

          {/* ── TAB: AUDIT LEDGER ── */}
          {activeTab === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-border bg-white"
            >
              <div className="p-8 border-b-2 border-slate-900 flex justify-between items-center bg-muted">
                <div>
                  <h3 className="text-xl font-sans text-foreground">
                    Immutable Event Ledger
                  </h3>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1 tracking-widest">
                    SYSTEM ROOT / PROTOCOL_LOGS
                  </p>
                </div>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Filter size={18} />
                </button>
              </div>

              <div className="divide-y divide-slate-100 font-mono text-sm">
                {[
                  {
                    actor: "sys_admin",
                    action: "CERTIFICATE_MINT",
                    resource: "RETIREMENT_ARTIFACT",
                    time: "2026-06-06 14:32:11",
                    hash: "0x8f...1c",
                  },
                  {
                    actor: "auditor_ext",
                    action: "STATUS_VERIFY",
                    resource: "PROJECT_REGISTRY",
                    time: "2026-06-06 11:15:40",
                    hash: "0x2a...9b",
                  },
                  {
                    actor: "usr_sust_lead",
                    action: "REPORT_INIT",
                    resource: "ESG_PROTOCOL",
                    time: "2026-06-05 09:00:22",
                    hash: "0x4c...8e",
                  },
                  {
                    actor: "sys_contract",
                    action: "ASSET_BURN",
                    resource: "CARBON_POOL_01",
                    time: "2026-06-04 16:45:01",
                    hash: "0x91...3f",
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-6">
                      <div className="text-muted-foreground text-xs">[{log.time}]</div>
                      <div>
                        <span className="text-emerald-700 font-bold">
                          {log.actor}
                        </span>
                        <span className="text-muted-foreground mx-2">executed</span>
                        <span className="text-foreground font-bold">
                          {log.action}
                        </span>
                        <span className="text-muted-foreground mx-2">on</span>
                        <span className="bg-slate-100 border border-border px-2 py-0.5 text-xs text-slate-600">
                          {log.resource}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      Tx:{" "}
                      <span className="text-blue-600 font-mono">
                        {log.hash}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-secondary flex justify-center text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
                <span className="animate-pulse mr-2">█</span> End of active
                protocol ledger.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
