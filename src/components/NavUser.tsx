"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  Loader2,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth";
import type { TBetterAuthUser } from "@/types";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts}${parts[1]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export const NavUser = ({
  user,
  isCollapsed,
}: {
  user: TBetterAuthUser | null;
  isCollapsed?: boolean;
}) => {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const avatarUrl = user?.image ?? user?.avatar;

  const handleLogOut = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      toast.error(`Log out failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`
                bg-slate-900/50 hover:bg-slate-800 text-white border border-slate-800 transition-colors
                data-[state=open]:bg-slate-800
                ${isCollapsed ? "justify-center !p-0 h-10 w-10 mx-auto" : ""}
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                </div>
              ) : (
                <>
                  <Avatar className="h-7 w-7 rounded-md shrink-0">
                    <AvatarImage src={avatarUrl} alt={user?.name} />
                    <AvatarFallback className="rounded-md bg-emerald-900 text-emerald-400 font-bold text-[10px]">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                        <span className="truncate font-bold text-slate-200">
                          {user?.name || "User"}
                        </span>
                        <span className="truncate text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                          {user?.role?.replace("_", " ") || "Member"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-500 shrink-0" />
                    </>
                  )}
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-900 border-slate-800 text-slate-300 shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={16}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-md">
                  <AvatarImage src={avatarUrl} alt={user?.name} />
                  <AvatarFallback className="rounded-md bg-emerald-900 text-emerald-400 font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-white">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-[10px] font-mono text-slate-500">
                    {user?.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="focus:bg-slate-800 focus:text-white cursor-pointer py-2"
              >
                <UserCircle className="h-4 w-4 mr-3 text-slate-400" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="focus:bg-slate-800 focus:text-white cursor-pointer py-2"
              >
                <BadgeCheck className="h-4 w-4 mr-3 text-slate-400" />
                System Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem
              onClick={handleLogOut}
              disabled={loading}
              className="focus:bg-red-900/30 focus:text-red-400 cursor-pointer py-2 text-red-500"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-3" />
              ) : (
                <LogOut className="h-4 w-4 mr-3" />
              )}
              Log out securely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
