"use client";

import type { UserType } from "@/constants/sidebar-items";
import { authClient } from "@/lib/auth";
import AdminDashboard from "./_components/AdminDashboard";
import CompanyDashboard from "./_components/CompanyDashboard";
import ProjectOwnerDashboard from "./_components/ProjectOwnerDashboard";

const Dashboard = () => {
  const { data: session } = authClient.useSession();
  const userType =
    ((session?.user as any)?.userType as UserType) || "ProjectOwner";
  const userName = session?.user?.name || "User";

  switch (userType) {
    case "Company":
      return <CompanyDashboard userName={userName} />;
    case "Admin":
      return <AdminDashboard userName={userName} />;
    default:
      return <ProjectOwnerDashboard userName={userName} />;
  }
};

export default Dashboard;
