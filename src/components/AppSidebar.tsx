"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { X } from "lucide-react";
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
import { SIDEBAR_CONFIG } from "@/constants/sidebar-items";
import type { TBetterAuthUser } from "@/types";
import { NavUser } from "./NavUser";
import { Separator } from "./ui/separator";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: TBetterAuthUser;
}) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  // The specific brand green from the image
  const brandGreen = "bg-[#2ebc8d]";

  return (
    <Sidebar
      {...props}
      className={`border-r-0 ${brandGreen}`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="pt-8 pb-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight group-data-[collapsible=icon]:hidden">
              Crevy
            </h1>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="px-5">
          <Separator
            orientation="horizontal"
            className="border-b border-white/30"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* Top-level items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_CONFIG.topItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        flex items-center gap-3 px-4 py-6 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-white text-[#2ebc8d] shadow-md font-medium hover:bg-white hover:text-[#2ebc8d]"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url}>
                        <HugeiconsIcon
                          //@ts-expect-error
                          icon={item.icon}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                          className="shrink-0"
                        />

                        <span className="text-sm group-data-[collapsible=icon]:hidden">
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

        {/* Grouped sections */}
        {SIDEBAR_CONFIG.sections.map((section, sectionIndex) => (
          <SidebarGroup key={section.title || sectionIndex} className="mt-4">
            {section.title && (
              <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 mb-2 group-data-[collapsible=icon]:hidden">
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
                        className={`
                          flex items-center gap-3 px-4 py-5 rounded-lg transition-all
                          ${
                            isActive
                              ? "bg-white text-[#2ebc8d] shadow-md font-medium hover:bg-white hover:text-[#2ebc8d]"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        <Link href={item.url}>
                          <HugeiconsIcon
                            //@ts-expect-error
                            icon={item.icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                            className="shrink-0"
                          />
                          <span className="flex-1 text-sm group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white group-data-[collapsible=icon]:hidden">
                              {item.badge}
                            </span>
                          )}
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

      {/* Footer Profile Section */}
      <SidebarFooter className="mt-auto p-4">
        <div className="rounded-xl bg-white/10 p-1 backdrop-blur-sm">
          <NavUser user={user} />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
