import { getSession } from "better-auth/api";
import { redirect } from "next/navigation";
import type React from "react";
import { DashboardLayoutClient } from "@/components/DashboardLayout";
import { getServerSession } from "@/lib/auth-server";
import type { TBetterAuthUser } from "@/types";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  const session2 = getSession();

  console.log("Session2:", session2);

  if (!session) {
    console.log("No session found");
    redirect("/login");
  }

  return (
    <DashboardLayoutClient user={session.user as TBetterAuthUser}>
      <div className="flex-1">{children}</div>
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
