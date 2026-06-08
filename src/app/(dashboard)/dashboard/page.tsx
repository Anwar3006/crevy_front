"use client";

import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth";
import type { TRole } from "@/types/user.types";
import AdminDashboard from "./_components/AdminDashboard";
import OrgAdminDashboard from "./_components/OrgAdminDashboard";
import ProjectOwnerDashboard from "./_components/ProjectOwnerDashboard";
import SuperAdminDashboard from "./_components/SuperAdminDashboard";

export default function DashboardRouter() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-none animate-spin" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
            Initializing Secure Terminal...
          </p>
        </div>
      </div>
    );
  }

  const role: TRole = (session?.user as any)?.role || "project_owner";
  const userName = session?.user?.name || "Operative";

  switch (role) {
    case "super_admin":
      return <SuperAdminDashboard userName={userName} />;
    case "project_manager":
    case "mrv_admin":
    case "financial_admin":
      return <AdminDashboard userName={userName} role={role} />;
    case "org_admin":
    case "sustainability_manager":
    case "org_auditor":
      return <OrgAdminDashboard userName={userName} role={role} />;
    default:
      return <ProjectOwnerDashboard userName={userName} role={role} />;
  }
}
