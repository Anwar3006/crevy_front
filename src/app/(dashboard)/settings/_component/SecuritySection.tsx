"use client";

import { Key, LogOut, ShieldCheck } from "lucide-react";

export function SecuritySection() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-2xl font-serif text-slate-900 mb-2">
          Access & Security.
        </h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
          Manage cryptographic sessions and authentication protocols.
        </p>
      </div>

      <div className="grid gap-6">
        {/* MFA Status */}
        <div className="p-8 border border-slate-200 bg-white flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Multi-Factor Authentication
            </h4>
            <p className="text-xs text-slate-500">
              Security protocol anchored via TOTP.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest">
            Enabled
          </span>
        </div>

        {/* Sessions */}
        <div className="p-8 border border-slate-200 bg-white">
          <h4 className="text-sm font-bold text-slate-900 mb-6">
            Active Cryptographic Sessions
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-slate-100">
              <div className="font-mono text-[11px] text-slate-900">
                Chrome / macOS / Accra, GH
              </div>
              <button
                type="button"
                className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-600"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
