"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTransition } from "@/context/TransitionContext";
import type { TBetterAuthUser } from "@/types";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: TBetterAuthUser | null;
}

export const DashboardLayoutClient = ({
  children,
  user,
}: DashboardLayoutClientProps) => {
  const pathname = usePathname();
  const { finishTransition } = useTransition();

  useEffect(() => {
    finishTransition();
  }, [finishTransition]);

  return (
    <SidebarProvider>
      {/* Sidebar - Dynamic Based on Role */}
      <AppSidebar user={user as TBetterAuthUser} />

      {/* Main Container */}
      <SidebarInset className="flex min-h-screen flex-col bg-white">
        {/* Mobile Sidebar Trigger */}
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-white px-4 md:hidden">
          <SidebarTrigger className="-ml-1 text-foreground" />
          <Separator orientation="vertical" className="h-4 bg-slate-300" />
          <h2 className="text-sm font-sans font-bold text-foreground tracking-tight">
            Crevy.
          </h2>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col">
          {/* Dashboard Header - Hidden on deep-dive management and asset pages */}
          {!pathname.startsWith("/projects") &&
            !pathname.startsWith("/financials") &&
            !pathname.startsWith("/portfolio") &&
            !pathname.startsWith("/compliance") &&
            !pathname.startsWith("/track-verification") &&
            !pathname.startsWith("/project-developers") &&
            !pathname.startsWith("/user-management") &&
            !pathname.startsWith("/credits-ledger") &&
            !pathname.startsWith("/organizations") && (
              <div className="border-b border-border bg-muted">
                <DashboardHeader user={user} />
              </div>
            )}
          {/* Content Container */}
          <div className="mx-auto w-full max-w-[1400px] flex-1 px-6 lg:px-12 py-10">
            {/* Page Content */}
            <div className="flex-1 w-full">{children}</div>
          </div>

          {/* Institutional Footer */}
          <footer className="border-t border-border bg-white py-6 mt-auto">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                CREVY REGISTRY NETWORK © {new Date().getFullYear()}
              </p>
              <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Privacy Policy
                </span>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </div>
            </div>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
