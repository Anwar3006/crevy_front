"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Download,
  ExternalLink,
  FileText,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

// ─── Design Philosophy: High-End Legal Protocol ────────────────────────────
// Monolithic structure with emphasis on document permanence.

export default function ContractsPage() {
  const [_isCreating, _setIsCreating] = useState(false);

  const contracts = [
    {
      id: "CON-001",
      type: "Purchase Agreement",
      party: "EcoLogic Systems",
      status: "Active",
      date: "Jan 12, 2026",
      volume: "500 t",
    },
    {
      id: "CON-002",
      type: "Framework Contract",
      party: "GreenGrowth SA",
      status: "Pending Signature",
      date: "May 05, 2026",
      volume: "1,200 t",
    },
    {
      id: "CON-003",
      type: "Retirement Deed",
      party: "Crevy Institutional",
      status: "Executed",
      date: "April 20, 2026",
      volume: "250 t",
    },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
        <div className="max-w-2xl">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Legal Artifact Registry
          </p>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
            Contract <br /> Management
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-6 leading-relaxed">
            Centralized governance of all institutional agreements, emissions
            rights, and credit deeds.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl"
        >
          <Plus size={16} /> New Agreement
        </button>
      </div>
      {/* ── Active Matrix ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contracts.map((con, i) => (
          <motion.div
            key={con.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <FileText size={22} />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${con.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
              >
                {con.status}
              </span>
            </div>

            <div className="space-y-1 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {con.id}
              </p>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {con.type}
              </h3>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-400 italic">Counterparty</span>
                <span className="text-slate-900">{con.party}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-400 italic">Volume</span>
                <span className="text-slate-900">{con.volume}</span>
              </div>
            </div>

            <div className="mt-10 flex gap-2">
              <button
                type="button"
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Review <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
              >
                <Download size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-50 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <h3 className="text-2xl font-black text-emerald-900 uppercase italic mb-4 tracking-tighter">
            Automated Deeds
          </h3>
          <p className="text-emerald-700 font-medium">
            All carbon credit retirements automatically generate a legal deed of
            permanence anchored to the Polygon mainnet for auditing.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-sm hover:shadow-md transition-all"
          >
            View Deeds
          </button>
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
            <BadgeCheck size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
