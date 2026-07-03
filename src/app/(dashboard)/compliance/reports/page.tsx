"use client";

import { Download, FileText, Filter, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComplianceReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const reports = [
    {
      ref: "ESG-PROTOCOL-2026-Q1",
      period: "January 2026 - March 2026",
      amount: "1,240 tCO2e",
      date: "April 02, 2026",
      status: "Verified",
    },
    {
      ref: "ESG-PROTOCOL-2025-FY",
      period: "Fiscal Year 2025",
      amount: "4,800 tCO2e",
      date: "Jan 10, 2026",
      status: "Verified",
    },
    {
      ref: "ESG-PROTOCOL-2025-Q4",
      period: "October 2025 - December 2025",
      amount: "1,100 tCO2e",
      date: "Oct 05, 2025",
      status: "Verified",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-12">
        <div className="max-w-2xl">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <FileText size={14} /> Institutional Compliance Artifacts
          </p>
          <h1 className="text-5xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic">
            Compliance <br /> Reports
          </h1>
          <p className="text-muted-foreground font-medium text-lg mt-6 leading-relaxed">
            Access and manage all generated ESG disclosure reports and impact
            assessments.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or reporting window..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-border focus:ring-emerald-500/20"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl border-border font-bold text-xs gap-2"
          >
            <Filter size={16} /> Filter Results
          </Button>
        </div>

        <div className="bg-white border border-border rounded-[3rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Registry Reference
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Reporting Window
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Institutional Impact
                </th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/50 transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-black text-foreground tracking-tighter uppercase italic">
                          {row.ref}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">
                          Published: {row.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 uppercase tracking-[0.15em] font-bold text-muted-foreground text-[10px]">
                    {row.period}
                  </td>
                  <td className="px-10 py-8 text-foreground font-black tracking-tight">
                    {row.amount}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Button
                      variant="outline"
                      className="border-border text-slate-600 hover:bg-emerald-600 hover:text-white px-6 py-2.5 h-auto rounded-xl transition-all font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
                    >
                      Download Artifact <Download size={14} className="ml-2" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-10 bg-muted flex justify-center border-t border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-3">
              <ShieldCheck size={16} className="text-emerald-500" /> All
              artifacts are cryptographically hashed and anchored to Polygon
              Mainnet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
