"use client";

import { Save, Settings, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GovernanceSection({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!isSuperAdmin) {
      toast.error("Protocol Violation", {
        description: "Insufficient clearance to alter registry physics.",
      });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Governance parameters cryptographically anchored.");
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <div className="border-b border-border pb-8">
        <h2 className="text-3xl font-sans text-foreground mb-2">
          Registry Governance.
        </h2>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
          High-integrity thresholds for dMRV verification & project lifecycle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Threshold Control */}
        <div className="p-8 border border-border bg-white">
          <div className="flex items-center gap-3 mb-8">
            <Settings size={16} className="text-foreground" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
              dMRV Sensitivity
            </h3>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
            AI Confidence Score Threshold (%)
          </div>
          <input
            type="number"
            defaultValue={85}
            disabled={!isSuperAdmin}
            className="w-full bg-muted border-0 border-b-2 border-border p-4 font-mono text-foreground font-bold mb-8 focus:ring-0 focus:border-slate-900 disabled:opacity-50"
          />

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
            Maximum Buffer Deduction (%)
          </div>
          <input
            type="number"
            defaultValue={20}
            disabled={!isSuperAdmin}
            className="w-full bg-muted border-0 border-b-2 border-border p-4 font-mono text-foreground font-bold focus:ring-0 focus:border-slate-900 disabled:opacity-50"
          />
        </div>

        {/* Protocol Alert */}
        <div className="p-8 border border-amber-200 bg-amber-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={16} className="text-amber-700" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900">
                System Protocol Warning
              </h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-light mb-6 font-mono">
              Modifying systemic parameters alters verification logic for all
              originators currently in the `registry_pending` state. Actions are
              irrevocably logged.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white border border-amber-200">
            <div className="w-2 h-2 rounded-none bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-900">
              Integrity Lock:{" "}
              {isSuperAdmin ? "UNLOCKED (DANGEROUS)" : "SECURED"}
            </span>
          </div>
        </div>
      </div>

      {isSuperAdmin && (
        <div className="flex justify-end pt-8 border-t border-border">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-secondary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-900 transition-colors disabled:opacity-70"
          >
            {isSaving ? "Anchoring Protocol..." : "Anchor Configuration"}
            {!isSaving && <Save size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
