"use client";

import { BadgeCheck, ChevronsUpDown, Loader2, LogOut } from "lucide-react";
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
import type { TBetterAuthUser } from "@/types";

export const NavUser = ({ user }: { user: TBetterAuthUser | null }) => {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    try {
      setLoading(true);
      // await authClient.signOut();
      router.push("/login");
    } catch (error) {
      toast.error(`Log out failed! : ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 data-[state=open]:bg-white/20 group-data-[collapsible=icon]:!p-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg bg-emerald-600 text-white font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="text-[11px] font-medium text-white/80">
                      Welcome back 👋
                    </span>
                    <span className="truncate font-semibold text-white">
                      {user?.name || "User"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-white/60 group-data-[collapsible=icon]:hidden" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheck className="h-4 w-4" />
                My Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogOut} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
