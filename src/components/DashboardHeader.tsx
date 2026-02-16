"use client";

import {
  Bell,
  Home,
  Phone,
  Settings,
  ShieldCheck,
  Store,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import type { TBetterAuthUser } from "@/types";
import { Separator } from "./ui/separator";

const navigationTabs = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Submit project",
    href: "/new-project",
    icon: Upload,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
  {
    title: "Verification",
    href: "/verification",
    icon: ShieldCheck,
  },
  {
    title: "Contact us",
    href: "/contact",
    icon: Phone,
  },
];

interface DashboardHeaderProps {
  user?: TBetterAuthUser | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

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
    <div className="space-y-6">
      {/* Welcome Section with Actions */}
      <div className="flex items-start justify-between mt-4">
        <div>
          <h1 className="text-2xl font-light text-emerald-500">
            Welcome, {user?.name || "John"}!
          </h1>
          <p className="mt-1 text-xs md:text-sm 2xl:text-base text-gray-500">
            Your digital tool for carbon credit management and green project
            verification
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold text-sm">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 mb-4">
        {navigationTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                "hover:text-emerald-600",
                isActive
                  ? "text-emerald-600 bg-emerald-100 border border-emerald-400 px-4 py-2 rounded-full"
                  : "text-gray-600",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs md:text-sm 2xl:text-base">
                {tab.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
