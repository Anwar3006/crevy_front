"use client";

import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Flame,
  MoreVertical,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Data & Configuration ─────────────────────────────────────────────────────

// Injected 'fill' directly into the data object to avoid the deprecated <Cell> wrapper
const scopeData = [
  { name: "Scope 1", value: 45, fill: "#047857" }, // emerald-700
  { name: "Scope 2", value: 25, fill: "#0f172a" }, // slate-900
  { name: "Scope 3", value: 30, fill: "#94a3b8" }, // slate-400
];

const members = [
  {
    id: "USR-001",
    name: "Sarah Jenkins",
    role: "Sustainability Director",
    email: "s.jenkins@ecologic.com",
    status: "active",
  },
  {
    id: "USR-002",
    name: "Marcus Vane",
    role: "ESG Analyst",
    email: "m.vane@ecologic.com",
    status: "active",
  },
  {
    id: "USR-003",
    name: "Elena Rossi",
    role: "Financial Controller",
    email: "e.rossi@ecologic.com",
    status: "inactive",
  },
];

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="animate-in fade-in duration-700 pb-24 font-sans bg-slate-50 min-h-screen">
      {/* ── Editorial Header ── */}
      <div className="border-b border-slate-200 bg-white pt-12 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="text-left">
              <button
                type="button"
                onClick={() => router.push("/organizations")}
                className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-8 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Registry
              </button>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-slate-900"></div>
                <span className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Building2 size={14} className="text-emerald-700" />{" "}
                  Institutional Profile
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight leading-none mb-4">
                EcoLogic <span className="italic text-slate-500">Systems.</span>
              </h1>
              <p className="text-slate-500 text-sm max-w-xl leading-relaxed font-light">
                Strategic sustainability partner based in Accra, Ghana. Focused
                on Nature-Based Solutions and Regenerative Agriculture offsets.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                className="rounded-none border-slate-300 text-slate-500 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest h-12 px-8 transition-colors"
              >
                Suspend Entity
              </Button>
              <Button className="rounded-none bg-slate-900 hover:bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-widest h-12 px-8 transition-colors">
                Contact Org Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 space-y-12">
        {/* ── Stats Matrix ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {[
            {
              label: "Total Acquired",
              val: "12,450",
              unit: "tCO₂e",
              sub: "+12% MoM",
              icon: Zap,
              color: "text-emerald-700",
            },
            {
              label: "Permanently Retired",
              val: "4,820",
              unit: "tCO₂e",
              sub: "38% Utilization",
              icon: Flame,
              color: "text-slate-900",
            },
            {
              label: "Active Team",
              val: "12",
              unit: "Seats",
              sub: "Institutional Roster",
              icon: Users,
              color: "text-slate-900",
            },
            {
              label: "ESG Trust Score",
              val: "94",
              unit: "/100",
              sub: "KYB Verified",
              icon: ShieldCheck,
              color: "text-emerald-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-8 flex flex-col justify-between group hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </p>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div>
                <h4 className="text-4xl font-mono font-bold text-slate-900 tracking-tight mb-1">
                  {stat.val}
                  <span className="text-base text-slate-400 ml-1 font-sans font-normal">
                    {stat.unit}
                  </span>
                </h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Left Column: Team & Marketing ── */}
          <div className="lg:col-span-8 space-y-12">
            {/* Team Members */}
            <div className="bg-white border border-slate-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                  Institutional Roster
                </h3>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  + Invite Colleague
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                        ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                        Member Name
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                        Role
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((m) => (
                      <tr
                        key={m.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">
                          {m.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-serif text-sm text-slate-900 font-bold">
                            {m.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {m.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          {m.role}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2 py-1 text-[9px] font-bold uppercase tracking-widest border",
                              m.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-50 text-slate-500 border-slate-200",
                            )}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            className="text-slate-300 hover:text-slate-900 transition-colors p-1 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Acquisition Intelligence */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-900 pb-4 mb-6">
                Acquisition Intelligence & Targeting
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
                  <div className="mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                      Methodology Profile
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Reforestation", "Agroforestry", "Soil Carbon"].map(
                        (t) => (
                          <span
                            key={t}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-900"
                          >
                            {t}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Credit Intent
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="h-1.5 w-full bg-slate-100 flex">
                        <div
                          className="bg-slate-900 w-3/4 h-full"
                          title="Compliance: 75%"
                        />
                        <div
                          className="bg-slate-300 w-1/4 h-full"
                          title="Speculative: 25%"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
                        <span className="text-slate-900">75% Compliance</span>
                        <span>25% Vol.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-8 flex flex-col justify-between">
                  <div className="mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                      Jurisdictional Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["West Africa", "Ghana", "Côte d'Ivoire"].map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-900"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Buyer Persona
                    </p>
                    <p className="text-xs font-mono text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-200">
                      Institutional Aggregator. High sensitivity to dMRV data
                      integrity. Prefers large batches {">"}5,000t with
                      multi-year off-take frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Impact Analytics & Compliance ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-6">
                Emissions Scope Priority
              </h3>

              <div className="h-[200px] w-full mb-8">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scopeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "0",
                          border: "1px solid #cbd5e1",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                {scopeData.map((s) => (
                  <div
                    key={s.name}
                    className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2"
                        style={{ backgroundColor: s.fill }}
                      />
                      {s.name}
                    </div>
                    <span className="text-slate-900 font-black">
                      {s.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 border border-slate-900 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={120} className="text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-6">
                <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Institutional Verification
                </p>
                <h4 className="text-3xl font-serif text-white leading-tight">
                  Regulatory <br /> Alignment.
                </h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Entity is fully compliant with IFRS S2 climate-related
                  disclosures and ESRS framework standards.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-none border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 uppercase font-bold tracking-widest text-[10px] mt-2 transition-colors"
                >
                  Audit Compliance Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
