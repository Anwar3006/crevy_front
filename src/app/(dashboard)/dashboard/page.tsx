"use client";

import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth";
import type { TRole } from "@/types/user.types";
import AdminDashboard from "./_components/AdminDashboard";
import CompanyDashboard from "./_components/CompanyDashboard";
import ProjectOwnerDashboard from "./_components/ProjectOwnerDashboard";

const Dashboard = () => {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user as any;

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#2ebc8d]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const role: TRole = sessionUser?.role || "project_owner";
  const userName = session?.user?.name || "User";

  switch (role) {
    case "financial_admin":
      return <CompanyDashboard userName={userName} role={role} />;
    case "super_admin":
    case "mrv_admin":
    case "project_manager":
      return <AdminDashboard userName={userName} role={role} />;
    default:
      return <ProjectOwnerDashboard userName={userName} role={role} />;
  }
};

export default Dashboard;
