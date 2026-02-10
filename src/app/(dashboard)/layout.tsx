import type React from "react";
import { DashboardLayoutClient } from "@/components/DashboardLayout";
import type { TBetterAuthUser } from "@/types";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // 1. Pass headers to BetterAuth so it can read the cookies
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // 2. Gatekeeping: Server-side redirect is instant
  // if (!session) {
  //   redirect("/login");
  // }

  // Mock user for development - replace with actual auth
  const mockUser: TBetterAuthUser = {
    id: "1",
    name: "John Doe",
    email: "john.doe@crevy.com",
  };

  return (
    <DashboardLayoutClient user={mockUser}>
      <div className="flex-1">{children}</div>
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
