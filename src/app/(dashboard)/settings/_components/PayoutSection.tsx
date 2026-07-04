"use client";

import { Building2, Landmark, Smartphone } from "lucide-react";

export function PayoutSection({ isCorporate }: { isCorporate: boolean }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-border pb-8">
        <h2 className="text-3xl font-sans text-foreground mb-2">
          {isCorporate ? "Settlement & Billing." : "Payout Vectors."}
        </h2>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
          {isCorporate
            ? "Manage fiat and stablecoin acquisition channels."
            : "Institutional disbursement channels for climate yield."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Fiat Vector */}
        <div className="p-8 border border-border bg-white">
          <Building2 className="mb-6 text-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Primary Banking Instruction
          </p>
          <div className="p-4 bg-muted border border-border font-mono text-sm font-bold text-foreground mb-6 tracking-widest">
            ECOBANK
          </div>
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors border-b border-emerald-700 pb-0.5"
          >
            Modify Fiat Vector
          </button>
        </div>

        {/* Digital Vector */}
        <div className="p-8 border border-border bg-white">
          <Smartphone className="mb-6 text-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            {isCorporate ? "USDC Treasury Wallet" : "Mobile Money Provider"}
          </p>
          <div className="p-4 bg-muted border border-border font-mono text-[11px] font-bold text-foreground mb-6 break-all">
            {isCorporate ? "0x71C...976F" : "MTN GHANA // *** 5678"}
          </div>
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors border-b border-emerald-700 pb-0.5"
          >
            Modify Digital Vector
          </button>
        </div>
      </div>
    </div>
  );
}
