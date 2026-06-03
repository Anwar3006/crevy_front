"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  History,
  Info,
  Link2,
  Lock,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function PublicRegistryPage() {
  const records = [
    {
      id: "REG-82401",
      project: "Volta Basin Reforestation",
      volume: "1,200 t",
      status: "Retired",
      date: "May 12, 2026",
      hash: "0x824...f01",
    },
    {
      id: "REG-82399",
      project: "Northern Ghana Soil Carbon",
      volume: "850 t",
      status: "Retired",
      date: "April 28, 2026",
      hash: "0x7b2...a42",
    },
    {
      id: "REG-82392",
      project: "Coastal Mangrove Protection",
      volume: "420 t",
      status: "Retired",
      date: "March 15, 2026",
      hash: "0x1d4...e98",
    },
    {
      id: "REG-82381",
      project: "Ashanti Agroforestry",
      volume: "2,100 t",
      status: "Retired",
      date: "Feb 10, 2026",
      hash: "0x9a1...c33",
    },
  ];

  return (
    <div className="animate-in fade-in duration-700 bg-white">
      <RegistryHero />

      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-wrap gap-4 items-center mb-12">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              placeholder="Search serial numbers, project names, or blockchain hashes..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-sm transition-all shadow-sm"
            />
          </div>
          <button
            type="button"
            className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:bg-black transition-all"
          >
            Filter Records
          </button>
        </div>

        <div className="rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Registry ID
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Impact Project
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Volume (tCO2e)
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Retirement Date
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  On-Chain Proof
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-10 py-8 font-black text-slate-900 text-sm tracking-tighter">
                    {r.id}
                  </td>
                  <td className="px-10 py-8">
                    <div className="font-bold text-slate-800">{r.project}</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Ghana Ecosystem
                    </div>
                  </td>
                  <td className="px-10 py-8 font-black text-emerald-600 text-lg italic">
                    {r.volume}
                  </td>
                  <td className="px-10 py-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                      <Lock size={10} /> {r.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-slate-500 font-medium text-sm">
                    {r.date}
                  </td>
                  <td className="px-10 py-8">
                    <a
                      href="hash"
                      className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <code className="text-xs font-mono">{r.hash}</code>
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-slate-50 px-10 py-8 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium italic">
              Showing current verified retirements from the Crevy Registry.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400"
              >
                &larr;
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <Link2 size={48} className="mx-auto text-emerald-400 mb-8" />
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6">
            Immutable Proof of Impact
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed mb-12">
            Every retired credit on the Crevy Public Registry is
            cryptographically hashed and linked to its original dMRV report.
            This ensures that no credit is ever double-counted or
            misrepresented.
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
            <Info size={18} className="text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Live Registry Node Status:{" "}
              <span className="text-emerald-400 font-black tracking-normal ml-2">
                ● ONLINE
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function RegistryHero() {
  return (
    <section className="bg-slate-50 pt-32 pb-20 border-b border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-emerald-100/50 border border-emerald-200 px-4 py-2 rounded-full mb-8"
        >
          <ShieldCheck size={14} className="text-emerald-700" />
          <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">
            Public Accountability Protocol
          </span>
        </motion.div>
        <h1
          className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-8 italic"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Transparency <br /> in Motion
        </h1>
        <p className="max-w-xl mx-auto text-slate-500 text-lg font-medium leading-relaxed">
          Explore the world&apos;s most transparent carbon credit registry.
          Access full audit trails and blockchain verification for every retired
          metric tonne.
        </p>
      </div>
    </section>
  );
}
