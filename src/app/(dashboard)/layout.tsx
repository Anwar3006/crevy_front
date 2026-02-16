import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { DashboardLayoutClient } from "@/components/DashboardLayout";
import { authClient } from "@/lib/auth";
import type { TBetterAuthUser } from "@/types";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // 1. Pass headers to BetterAuth so it can read the cookies
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  // 2. Gatekeeping: Server-side redirect is instant
  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient user={session.user as TBetterAuthUser}>
      <div className="flex-1">{children}</div>
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
