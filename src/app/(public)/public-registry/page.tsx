"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  FileText,
  Globe2,
  LockKeyhole,
  Search,
} from "lucide-react";

export default function PublicRegistryPage() {
  const records = [
    {
      id: "CRV-82401",
      beneficiary: "Apex Financial Group",
      project: "Volta Basin Reforestation",
      vintage: "2025",
      volume: "1,200 tCO₂e",
      date: "May 12, 2026",
      hash: "0x824...f01",
      methodology: "VM0042",
    },
    {
      id: "CRV-82399",
      beneficiary: "TechNova Logistics",
      project: "Northern Ghana Soil Carbon",
      vintage: "2026",
      volume: "850 tCO₂e",
      date: "April 28, 2026",
      hash: "0x7b2...a42",
      methodology: "VM0042",
    },
    {
      id: "CRV-82392",
      beneficiary: "Lumière Fashion House",
      project: "Coastal Mangrove Protection",
      vintage: "2024",
      volume: "420 tCO₂e",
      date: "March 15, 2026",
      hash: "0x1d4...e98",
      methodology: "AR-ACM0003",
    },
    {
      id: "CRV-82381",
      beneficiary: "Global Airways PLC",
      project: "Ashanti Agroforestry",
      vintage: "2025",
      volume: "2,100 tCO₂e",
      date: "Feb 10, 2026",
      hash: "0x9a1...c33",
      methodology: "VM0042",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-slate-900 selection:text-white">
      <RegistryHero />
      <LedgerMetrics />

      <section className="py-20 container mx-auto px-6 max-w-7xl">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-slate-900 pb-6">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="ledger-search"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block"
            >
              Query the Ledger
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5" />
              <input
                id="ledger-search"
                placeholder="Search beneficiaries, serial numbers, or project names..."
                className="w-full pl-8 pr-4 py-2 border-none border-b-2 border-transparent hover:border-slate-200 focus:border-slate-900 outline-none font-medium text-lg lg:text-xl transition-all bg-transparent placeholder:text-slate-300 rounded-none"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select className="px-4 py-2 bg-transparent border border-slate-300 text-sm font-medium outline-none hover:border-slate-900 cursor-pointer transition-colors w-full md:w-auto">
              <option>All Vintages</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <select className="px-4 py-2 bg-transparent border border-slate-300 text-sm font-medium outline-none hover:border-slate-900 cursor-pointer transition-colors w-full md:w-auto">
              <option>All Projects</option>
              <option>Volta Basin</option>
              <option>Ashanti Agroforestry</option>
            </select>
          </div>
        </div>

        {/* Editorial Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-slate-900 whitespace-nowrap">
                  Retirement ID
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Beneficiary
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Origin Project
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Vintage
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-slate-900 text-right">
                  Volume
                </th>
                <th className="py-4 pl-6 text-[11px] font-bold uppercase tracking-widest text-slate-900 text-right">
                  Immutability
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  {/* ID & Date */}
                  <td className="py-6 pr-6 align-top">
                    <div className="font-mono text-sm font-semibold text-slate-900">
                      {r.id}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={10} /> {r.date}
                    </div>
                  </td>

                  {/* Beneficiary */}
                  <td className="py-6 pr-6 align-top">
                    <div className="font-serif text-lg font-medium text-slate-900">
                      {r.beneficiary}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 flex items-center gap-1">
                      <Building2 size={10} /> ESG Compliance Retiree
                    </div>
                  </td>

                  {/* Project & Methodology */}
                  <td className="py-6 pr-6 align-top">
                    <div className="font-medium text-slate-900">
                      {r.project}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 flex items-center gap-1">
                      <FileText size={10} /> Method: {r.methodology}
                    </div>
                  </td>

                  {/* Vintage */}
                  <td className="py-6 pr-6 align-top">
                    <div className="font-mono text-sm text-slate-600">
                      {r.vintage}
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="py-6 pr-6 align-top text-right">
                    <div className="font-mono text-lg font-bold text-emerald-800">
                      {r.volume}
                    </div>
                  </td>

                  {/* On-Chain Proof */}
                  <td className="py-6 pl-6 align-top text-right">
                    <div className="flex flex-col items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 border border-slate-200 px-2 py-1 bg-white text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        <LockKeyhole size={10} /> Retired
                      </span>
                      <a
                        href={`#tx-${r.hash}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-emerald-700 transition-colors group-hover:underline underline-offset-4"
                      >
                        Tx: {r.hash} <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination / Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-serif italic">
            Displaying the 4 most recent immutable retirements.
          </p>
          <div className="flex gap-2 font-mono text-sm">
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 hover:border-slate-900 transition-colors text-slate-400 hover:text-slate-900"
            >
              PREV
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-slate-900 text-white border border-slate-900"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 hover:border-slate-900 transition-colors text-slate-600"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 hover:border-slate-900 transition-colors text-slate-600"
            >
              3
            </button>
            <button
              type="button"
              className="px-3 py-1 border border-slate-200 hover:border-slate-900 transition-colors text-slate-400 hover:text-slate-900"
            >
              NEXT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RegistryHero() {
  return (
    <section className="bg-white pt-32 pb-16 relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-12 h-[1px] bg-slate-900"></div>
          <span className="text-slate-900 text-xs font-bold uppercase tracking-[0.2em]">
            The Immutability Ledger
          </span>
          <div className="w-12 h-[1px] bg-slate-900"></div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 tracking-tight leading-[1] mb-8">
          Proof of <span className="italic text-slate-500">Impact.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl font-light leading-relaxed">
          The permanent, cryptographically secured record of climate action.
          Every metric tonne listed here has been verified by dMRV sensors,
          permanently retired from circulation, and claimed by a global climate
          leader.
        </p>
      </div>
    </section>
  );
}

function LedgerMetrics() {
  return (
    <div className="border-y border-slate-200 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-center">
          <div className="py-8 px-4 flex flex-col items-center justify-center">
            <Award
              className="text-emerald-700 mb-3"
              size={24}
              strokeWidth={1.5}
            />
            <p className="text-4xl font-serif text-slate-900 mb-1">124,500</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Total Tonnes Retired
            </p>
          </div>
          <div className="py-8 px-4 flex flex-col items-center justify-center">
            <Globe2
              className="text-emerald-700 mb-3"
              size={24}
              strokeWidth={1.5}
            />
            <p className="text-4xl font-serif text-slate-900 mb-1">14</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Active Global Projects
            </p>
          </div>
          <div className="py-8 px-4 flex flex-col items-center justify-center">
            <Building2
              className="text-emerald-700 mb-3"
              size={24}
              strokeWidth={1.5}
            />
            <p className="text-4xl font-serif text-slate-900 mb-1">86</p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Corporate Beneficiaries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
