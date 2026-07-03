"use client";

import { Bell, Command, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { TBetterAuthUser } from "@/types";

interface DashboardHeaderProps {
  user?: TBetterAuthUser | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Generate a sophisticated breadcrumb/context based on the route
  const getContext = () => {
    if (pathname === "/dashboard") return "Executive Overview";
    const path = pathname.split("/").filter(Boolean)[0];
    return path ? path.replace("-", " ") : "Terminal";
  };

  return (
    <div className="flex items-center justify-between py-4 bg-transparent px-6 lg:px-12">
      {/* ── Left: Context & Greeting ── */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            System Context / {getContext()}
          </p>
          <h1 className="text-xl font-sans text-foreground leading-none">
            Welcome, {user?.name?.split(" ")[0] || "User"}.
          </h1>
        </div>
      </div>

      {/* ── Right: Utilities & Profile ── */}
      <div className="flex items-center gap-4">
        {/* Command Search Simulation */}
        <button
          type="button"
          className="hidden md:flex items-center gap-12 px-4 py-2 border border-border bg-white text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Global Search
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono group-hover:text-foreground">
            <Command className="w-3 h-3" /> K
          </div>
        </button>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <Link
            href="/notifications"
            className="relative rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Avatar className="h-9 w-9 rounded-none border border-border ml-2">
            <AvatarImage
              src={user?.image || user?.avatar}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-none bg-foreground text-white font-mono text-[10px]">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
