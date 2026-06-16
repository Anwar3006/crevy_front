"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getSidebarConfig } from "@/constants/sidebar-items";
import type { TBetterAuthUser } from "@/types";
import { NavUser } from "./NavUser";
import { Separator } from "./ui/separator";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: TBetterAuthUser & { activeOrganizationId?: string };
}) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state, toggleSidebar } = useSidebar();

  const role = user.role || "project_owner";
  const sidebarConfig = getSidebarConfig(role);

  const getSidebarTheme = (r: string) => {
    if (r === "super_admin" || r === "admin") return "bg-slate-950";
    if (
      r.startsWith("org_") ||
      r === "sustainability_manager" ||
      r === "financial_admin" ||
      r === "mrv_admin"
    )
      return "bg-[#064e3b]";
    return "bg-[#022c22]";
  };

  const themeClass = getSidebarTheme(role);

  return (
    <Sidebar
      {...props}
      className={`border-r-0 h-full ${themeClass}`}
      collapsible="icon"
    >
      <SidebarHeader className="pt-6 pb-4 shrink-0">
        {/* ... header content stays exactly the same ... */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link
              href="/"
              className="text-2xl font-serif text-white tracking-tight group-data-[collapsible=icon]:hidden"
            >
              Crevy.
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex text-white/50 hover:text-white hover:bg-white/10 shrink-0"
          >
            {state === "expanded" ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </Button>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="text-white hover:bg-white/10 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="px-5 mt-4 group-data-[collapsible=icon]:hidden">
          <Separator
            orientation="horizontal"
            className="border-b border-white/20"
          />
        </div>
      </SidebarHeader>

      {/* KEY FIXES: overflow-y-auto + data-lenis-prevent */}
      <SidebarContent className="px-3 overflow-y-auto" data-lenis-prevent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarConfig.topItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`
                        flex items-center gap-4 px-3 py-5 rounded-none transition-all border-l-2
                        ${
                          isActive
                            ? "bg-white/10 text-white border-white font-medium"
                            : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url}>
                        <HugeiconsIcon
                          icon={item.icon}
                          size={26}
                          color="currentColor"
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                        <span className="text-xs font-mono tracking-widest uppercase group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sidebarConfig.sections?.map((section, sectionIndex) => (
          <SidebarGroup key={section.title || sectionIndex} className="mt-4">
            {section.title && (
              <SidebarGroupLabel className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/70 mb-2 group-data-[collapsible=icon]:hidden">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`
                          flex items-center gap-4 px-3 py-5 rounded-none transition-all border-l-2
                          ${
                            isActive
                              ? "bg-white/10 text-white border-white font-medium"
                              : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >
                        <Link href={item.url}>
                          <HugeiconsIcon
                            icon={item.icon}
                            size={26}
                            color="currentColor"
                            strokeWidth={1.5}
                            className="shrink-0"
                          />
                          <span className="text-xs font-mono tracking-widest uppercase group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4 border-t border-white/10 shrink-0">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
