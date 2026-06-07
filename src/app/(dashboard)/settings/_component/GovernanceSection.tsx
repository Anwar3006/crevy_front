"use client";

import { AlertCircle, Save, Settings, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GovernanceSection() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to registry-service
    setTimeout(() => {
      toast.success("Governance parameters anchored.");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      {/* ── Governance Header ── */}
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-2xl font-serif text-slate-900 mb-2">
          Registry Governance.
        </h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
          High-integrity thresholds for dMRV verification & project lifecycle.
        </p>
      </div>

      {/* ── Control Grid ── */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Threshold Control */}
        <div className="p-8 border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6">
            <Settings size={16} className="text-slate-900" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
              dMRV Sensitivity
            </h3>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
            AI Confidence Score Threshold (%)
          </div>
          <input
            type="number"
            defaultValue={85}
            className="w-full bg-white border border-slate-200 p-4 font-mono text-slate-900 font-bold mb-6"
          />

          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
            Max Buffer Buffer Deductions (%)
          </div>
          <input
            type="number"
            defaultValue={20}
            className="w-full bg-white border border-slate-200 p-4 font-mono text-slate-900 font-bold"
          />
        </div>

        {/* Protocol Alert */}
        <div className="p-8 border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert size={16} className="text-amber-700" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900">
              System Protocol Warning
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed font-light mb-6">
            Modifying these parameters will affect the verification status of
            all projects currently in the `registry_pending` state. Proceed with
            institutional authorization.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-900">
              Registry integrity status: LOCKED
            </span>
          </div>
        </div>
      </div>

      {/* ── Registry Action Footer ── */}
      <div className="flex justify-end pt-8 border-t border-slate-200">
        <button
          type="button"
          onClick={handleSave}
          className="bg-slate-900 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-900 transition-colors"
        >
          {isSaving ? "Updating Protocol..." : "Anchor Registry Configuration"}
          <Save size={14} />
        </button>
      </div>
    </div>
  );
}
