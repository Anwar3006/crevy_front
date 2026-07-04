"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Filter, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { CreditService } from "@/lib/services/credit-service";
import { cn } from "@/lib/utils";

export default function PlatformCreditsLedgerPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["platform-credits-ledger", statusFilter],
    queryFn: () =>
      CreditService.getCarbonCredits({
        creditStatus:
          statusFilter === "all" ? undefined : (statusFilter as any),
        limit: 100,
      }),
  });

  const credits = data?.data || [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-secondary selection:text-white">
      {/* Editorial Header */}
      <div className="bg-white pt-20 pb-12 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-secondary"></div>
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              Global Supply Oversight
            </span>
            <div className="w-8 h-[1px] bg-secondary"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans text-foreground tracking-tight mb-4 leading-none">
            Platform <span className="italic text-muted-foreground">Ledger.</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed mt-6 italic">
            The master administrative record of all carbon credits generated
            across the Crevy ecosystem. This ledger provides a comprehensive
            audit trail of every cryptographic serial number, ensuring
            supply-side integrity and preventing double-counting.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="global-registry-search"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block"
            >
              Search Global Registry
            </label>
            <div className="relative border-b-2 border-border hover:border-slate-900 transition-colors">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground w-5 h-5" />
              <input
                id="global-registry-search"
                placeholder="Query serial numbers, batches, or project codes..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-none outline-none font-medium text-lg placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-slate-300 text-sm font-medium outline-none hover:border-slate-900 cursor-pointer appearance-none transition-colors"
              >
                <option value="all">Total Supply</option>
                <option value="available">Active Registry</option>
                <option value="retired">Permanently Retired</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-foreground">
                  Cryptographic Serial
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-foreground">
                  Project Context
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-foreground">
                  Vintage
                </th>
                <th className="py-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-foreground text-right">
                  Volume (tCO₂e)
                </th>
                <th className="py-4 pl-6 text-[11px] font-bold uppercase tracking-widest text-foreground text-right">
                  System Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest"
                  >
                    Synchronizing Registry Data...
                  </td>
                </tr>
              ) : credits.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-muted-foreground font-sans text-lg"
                  >
                    No registry records matched your query.
                  </td>
                </tr>
              ) : (
                credits.map((c: any) => (
                  <tr
                    key={c.id}
                    className="group hover:bg-muted transition-colors"
                  >
                    {/* Serial Number */}
                    <td className="py-6 pr-6 align-top">
                      <div className="font-mono text-sm font-semibold text-foreground">
                        {c.serialNumber || `SN-${c.id.slice(0, 12)}`}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-6 pr-6 align-top">
                      <div className="font-bold text-slate-800 text-sm">
                        {c.project?.name || "Global Program"}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">
                        {c.project?.code || c.mrv_batch_id?.slice(0, 8)}
                      </div>
                    </td>

                    {/* Vintage */}
                    <td className="py-6 pr-6 align-top">
                      <div className="font-mono text-sm text-foreground">
                        {c.creditVintage}
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-6 pr-6 align-top text-right">
                      <div className="font-mono text-lg font-bold text-emerald-800">
                        {parseFloat(c.availableAmount).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 },
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-6 pl-6 align-top text-right">
                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                            c.creditStatus === "available"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-border bg-white text-muted-foreground",
                          )}
                        >
                          {c.creditStatus === "available" ? (
                            <Activity size={10} />
                          ) : (
                            <ShieldCheck size={10} />
                          )}
                          {c.creditStatus === "available"
                            ? "Active Registry"
                            : "Retired Asset"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
