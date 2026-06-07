"use client";

import { User } from "lucide-react";

export function ProfileSection() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-2xl font-serif text-slate-900 mb-2">
          Entity Profile.
        </h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
          Legal registration and jurisdictional metadata.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Legal Entity Name
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 font-serif text-lg font-bold">
            EcoLogic Systems
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Jurisdiction
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 font-mono text-sm font-bold">
            ACCRA
          </div>
        </div>
      </div>

      <button
        type="button"
        className="bg-slate-900 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors"
      >
        Anchor Profile Changes
      </button>
    </div>
  );
}
