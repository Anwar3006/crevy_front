"use client";

import { ShieldCheck } from "lucide-react";
import HeroSection from "./_components/HeroSection";
import QuickActions from "./_components/QuickActions";
import RecentActivities from "./_components/RecentActivities";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions */}
      <QuickActions />

      {/* Project Overview */}
      <div className="mx-auto max-w-5xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Project Overview
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Projects */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="relative h-16 w-16">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 100 100"
                  role="img"
                  aria-labelledby="svg-title"
                >
                  <title id="svg-title">Project Progress Indicator</title>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">
                  3
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              Active Projects
            </p>
          </div>

          {/* Carbon Credits Earned */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  1,245
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              Carbon Credits Earned
            </p>
          </div>

          {/* CO₂ Savings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">892</div>
                <div className="flex items-center justify-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-emerald-500" />
                  <div className="h-4 w-4 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              CO₂ Savings (tons)
            </p>
          </div>

          {/* Verification Progress */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-gray-900">67%</div>
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-600">
              Verification Progress
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
