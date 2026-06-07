"use client";

import {
  Building2,
  CreditCard,
  FileText,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Component Registry ──

import { useUser } from "@/hooks/use-user";
import { GovernanceSection } from "./_component/GovernanceSection";
import { PayoutSection } from "./_component/PayoutSection";
import { ProfileSection } from "./_component/ProfileSection";
import { SecuritySection } from "./_component/SecuritySection";

export default function SettingsPage() {
  const { user } = useUser(); // Returns { role: 'super_admin' | 'admin' | 'buyer' }
  const [activeTab, setActiveTab] = useState("profile");

  const TABS = [
    { id: "profile", label: "Identity Profile", icon: User },
    { id: "security", label: "Access & Security", icon: Lock },
    ...(user?.role !== "org_admin"
      ? [{ id: "governance", label: "Governance & Registry", icon: Shield }]
      : []),
    { id: "financials", label: "Financial Routing", icon: CreditCard },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6">
      <div className="border-b border-slate-200 pb-12 mb-12">
        <h1 className="text-4xl font-serif text-slate-900 tracking-tight">
          System Configuration.
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-mono uppercase tracking-widest">
          {user?.role?.replace("_", " ")}
        </p>
      </div>

      <div className="grid md:grid-cols-[240px,1fr] gap-12">
        {/* ── Side Nav ── */}
        <nav className="space-y-1">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors",
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-900",
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Content Terminal ── */}
        <div className="min-h-[500px] border border-slate-200 bg-white p-12">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "governance" && user?.role !== "org_admin" && (
            <GovernanceSection />
          )}
          {activeTab === "financials" && <PayoutSection />}
        </div>
      </div>
    </div>
  );
}
