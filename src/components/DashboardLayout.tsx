"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { TBetterAuthUser } from "@/types";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: TBetterAuthUser | null;
}

export const DashboardLayoutClient = ({
  children,
  user,
}: DashboardLayoutClientProps) => {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar user={user as TBetterAuthUser} />

      {/* Main Container */}
      <SidebarInset className="flex min-h-screen flex-col bg-gray-50">
        {/* Mobile Sidebar Trigger */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-white px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h2 className="text-sm font-semibold">Crevy</h2>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col">
          {/* Dashboard Header */}
          <div className="mb-6 px-4 md:px-6 shadow-lg shadow-gray-200">
            <DashboardHeader user={user} />
          </div>

          {/* Content Container with max-width */}
          <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6 md:py-8">
            {/* Page Content */}
            <div className="flex-1">{children}</div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-4">
            <div className="mx-auto max-w-[1400px] px-4 md:px-6">
              <p className="text-center text-[0.65rem] font-medium uppercase tracking-widest text-gray-400">
                COPYRIGHT © {new Date().getFullYear()} CREVY. ALL RIGHTS
                RESERVED
              </p>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
