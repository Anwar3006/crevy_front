import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { DashboardLayoutClient } from "@/components/DashboardLayout";
import { getServerSession } from "@/lib/auth-server";
import type { TBetterAuthUser } from "@/types";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as TBetterAuthUser;

  // Fetch role if missing (v2 rbac)
  if (!user.role) {
    try {
      const headersList = await headers();
      const cookie = headersList.get("cookie") ?? "";

      const roleResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/rbac/me/role`,
        {
          headers: { cookie },
          cache: "no-store",
        },
      );

      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        user.role = roleData.data.role;
      }
    } catch (err) {
      console.error("[DashboardLayout] Failed to fetch user role:", err);
    }
  }

  return (
    <DashboardLayoutClient user={user}>
      <div className="flex-1">{children}</div>
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
