"use client";

import {
  ArrowRight,
  ArrowUpRight,
  FileSignature,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function FinancialsDashboard() {
  return (
    <div className="animate-in fade-in duration-700 pb-24">
      {/* ── Editorial Header ── */}
      <div className="bg-white border-b border-border pt-12 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-secondary"></div>
            <span className="text-foreground text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-700" />
              Institutional Financial Governance
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-sans text-foreground tracking-tight leading-none mb-6">
            Financial <span className="italic text-muted-foreground">Control.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-2xl">
            Centralized oversight of all capital disbursements, framework
            contracts, and institutional liquidity connected to verified
            environmental assets.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        {/* ── Executive Metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-border mb-12">
          <div className="bg-white p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Total Volume Locked
            </p>
            <h2 className="text-4xl font-mono text-foreground font-bold tracking-tight">
              142,500
              <span className="text-base text-muted-foreground ml-2 font-sans font-normal">
                tCO₂e
              </span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-4">
              +12% Active Yield
            </p>
          </div>
          <div className="bg-white p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Capital Deployed (FY26)
            </p>
            <h2 className="text-4xl font-mono text-foreground font-bold tracking-tight">
              <span className="text-muted-foreground font-sans mr-1">$</span>2.4M
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
              Settled via Payouts
            </p>
          </div>
          <div className="bg-secondary p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                Pending Liquidity
              </p>
              <h2 className="text-4xl font-mono text-white font-bold tracking-tight">
                <span className="text-emerald-500 font-sans mr-1">$</span>42,150
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-4">
                Awaiting Disbursement
              </p>
            </div>
            <div className="absolute right-0 bottom-0 p-4 opacity-10">
              <Landmark size={120} />
            </div>
          </div>
        </div>

        {/* ── Routing Modules ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/financials/payouts"
            className="group border border-border bg-white hover:border-slate-900 transition-colors flex flex-col justify-between p-10 min-h-[320px]"
          >
            <div>
              <div className="w-14 h-14 bg-muted border border-border flex items-center justify-center text-foreground mb-8 group-hover:bg-secondary group-hover:text-white transition-colors">
                <Landmark size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-sans text-foreground tracking-tight mb-4 group-hover:text-emerald-800 transition-colors">
                Payout Ledger
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Audit and execute capital disbursements to originators. Track
                mobile money and institutional transfers mapped to completed
                credit transactions.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground">
              Access Ledger{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>

          <Link
            href="/financials/contracts"
            className="group border border-border bg-white hover:border-slate-900 transition-colors flex flex-col justify-between p-10 min-h-[320px]"
          >
            <div>
              <div className="w-14 h-14 bg-muted border border-border flex items-center justify-center text-foreground mb-8 group-hover:bg-secondary group-hover:text-white transition-colors">
                <FileSignature size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-sans text-foreground tracking-tight mb-4 group-hover:text-emerald-800 transition-colors">
                Contract Registry
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Manage legal artifacts, project offtakes, and forward-carbon
                positions. Monitor committed credits against estimated delivery
                volumes.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground">
              Access Registry{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
