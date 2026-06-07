"use client";

import { Building2, Landmark, Smartphone } from "lucide-react";

export function PayoutSection() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-2xl font-serif text-slate-900 mb-2">
          Payout Vectors.
        </h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
          Institutional disbursement channels for climate yield.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Vector 1: MoMo */}
        <div className="p-8 border border-slate-200 bg-slate-50">
          <Smartphone className="mb-6 text-slate-900" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Mobile Money Provider
          </p>
          <p className="text-sm font-mono font-bold text-slate-900 mb-6">
            MTN GHANA
          </p>
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 underline underline-offset-4"
          >
            Update Vector
          </button>
        </div>

        {/* Vector 2: Bank */}
        <div className="p-8 border border-slate-200 bg-slate-50">
          <Building2 className="mb-6 text-slate-900" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Primary Bank Instruction
          </p>
          <p className="text-sm font-mono font-bold text-slate-900 mb-6">
            ECOBANK
          </p>
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 underline underline-offset-4"
          >
            Update Vector
          </button>
        </div>
      </div>
    </div>
  );
}
