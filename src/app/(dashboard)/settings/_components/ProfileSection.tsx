"use client";

import { Save } from "lucide-react";

export function ProfileSection({ isCorporate }: { isCorporate: boolean }) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-border pb-8">
        <h2 className="text-3xl font-sans text-foreground mb-2">
          {isCorporate ? "Entity Profile." : "Identity Details."}
        </h2>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
          Legal registration and jurisdictional metadata.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isCorporate ? "Registered Entity Name" : "Legal Name"}
            </div>
            <input
              defaultValue={isCorporate ? "EcoLogic Systems SA" : "Kwame Ofori"}
              className="w-full bg-muted border-0 border-b-2 border-border p-4 font-sans text-lg font-bold text-foreground focus:ring-0 focus:border-slate-900"
            />
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Primary Jurisdiction
            </div>
            <input
              defaultValue="ACCRA, GHANA"
              className="w-full bg-muted border-0 border-b-2 border-border p-4 font-mono text-sm font-bold text-foreground uppercase tracking-widest focus:ring-0 focus:border-slate-900"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            System Identifier (Read-Only)
          </div>
          <div className="p-4 bg-slate-100 border border-border font-mono text-xs text-muted-foreground tracking-widest select-all">
            {isCorporate ? "ORG-GH-2026-0042" : "USR-ADM-8492"}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex justify-end">
        <button
          type="button"
          className="bg-secondary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors flex items-center gap-3"
        >
          Anchor Profile Edits <Save size={14} />
        </button>
      </div>
    </div>
  );
}
