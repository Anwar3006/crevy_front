"use client";

import {
  Briefcase,
  Globe,
  LayoutDashboard,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import type { UserType } from "@/constants/sidebar-items";
import { authClient } from "@/lib/auth";
import HeroSection from "./_components/HeroSection";
import QuickActions from "./_components/QuickActions";
import RecentActivities from "./_components/RecentActivities";

const Dashboard = () => {
  const { data: session } = authClient.useSession();
  const userType =
    ((session?.user as any)?.userType as UserType) || "ProjectOwner";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection userType={userType} userName={session?.user?.name || ""} />

      {/* Quick Actions */}
      <QuickActions userType={userType} />

      {/* Project Overview / Stats */}
      <div className="mx-auto max-w-5xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {userType === "Company"
            ? "Investment Overview"
            : userType === "Admin"
              ? "Management Overview"
              : "Project Overview"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="relative h-16 w-16">
                {userType === "Company" ? (
                  <Globe
                    className="h-full w-full text-blue-500"
                    strokeWidth={1.5}
                  />
                ) : (
                  <LayoutDashboard
                    className="h-full w-full text-emerald-500"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {userType === "Company"
                ? "Market Projects"
                : userType === "Admin"
                  ? "Assigned Businesses"
                  : "Active Projects"}
            </p>
            <p className="text-center text-2xl font-bold mt-1">
              {userType === "Company"
                ? "124"
                : userType === "Admin"
                  ? "8"
                  : "3"}
            </p>
          </div>

          {/* Stat 2 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  {userType === "Company" ? "4.2k" : "1,245"}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {userType === "Company"
                ? "Total Offset (tons)"
                : "Carbon Credits Earned"}
            </p>
          </div>

          {/* Stat 3 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  {userType === "Company" ? "12" : "892"}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    {userType === "Company" ? (
                      <Briefcase className="h-4 w-4 text-white" />
                    ) : (
                      <Leaf className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {userType === "Company"
                ? "Active Investments"
                : "CO₂ Savings (tons)"}
            </p>
          </div>

          {/* Stat 4 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  {userType === "Admin" ? "14" : "67%"}
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              {userType === "Admin"
                ? "Pending Verifications"
                : "Verification Progress"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
