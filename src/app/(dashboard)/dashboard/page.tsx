"use client";
import { useUser } from "@/hooks/use-user";
import DashboardLoading from "@/components/DashboardLoading";
import AuditorDashboard from "./_components/auditor/AuditorDashboard";
import BuyerDashboard from "./_components/buyer/BuyerDashboard";
import ProjectDeveloperDashboard from "./_components/ProjectDeveloperDashboard";
import SuperAdminDashboard from "./_components/SuperAdminDashboard";
import AdminDashboard from "./_components/AdminDashboard";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  if (isLoading) return <DashboardLoading />;
  if (!user) return null;
  const role = user.role;
  const userName = user.name || "User";
  switch (role) {
    case "super_admin": return <SuperAdminDashboard userName={userName} />;
    case "admin": return <AdminDashboard userName={userName} />;
    case "org_admin": return <BuyerDashboard />;
    case "org_auditor": return <AuditorDashboard />;
    default: return <ProjectDeveloperDashboard userName={userName} role={role} />;
  }
}
