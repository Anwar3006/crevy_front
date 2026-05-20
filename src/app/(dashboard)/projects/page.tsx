"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth";
import { ProjectService } from "@/lib/services/project-service";

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  active: "bg-[#2cc295]/10 text-[#178a74]",
  suspended: "bg-red-50 text-red-600",
  closed: "bg-slate-100 text-slate-500",
};

const stageStyle: Record<string, string> = {
  registration: "bg-amber-50 text-amber-700",
  active: "bg-blue-50 text-blue-700",
  verification: "bg-purple-50 text-purple-700",
  completed: "bg-[#2cc295]/10 text-[#178a74]",
};

const sectorLabel: Record<string, string> = {
  green_economy: "🌿 Green Economy",
  brown_economy: "🏭 Brown Economy",
  blue_economy: "🌊 Blue Economy",
};

export default function ProjectProfilePage() {
  const { data: session } = authClient.useSession();
  const userId = (session?.user as any)?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-projects", userId],
    queryFn: () => ProjectService.getProjects({ createdBy: userId, limit: 50 }),
    enabled: !!userId,
  });

  const projects: any[] = data?.data ?? [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#131927]">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            All your registered green projects.
          </p>
        </div>
        <Link
          href="/new-project"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2cc295] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#178a74] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading projects…</span>
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
          <p className="text-red-600 font-medium text-sm">
            Failed to load projects. Please refresh the page.
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">
            🌱
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              No projects registered yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Register your first green project to appear on the Crevy
              marketplace.
            </p>
          </div>
          <Link
            href="/new-project"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#2cc295] px-6 py-3 text-sm font-bold text-white hover:bg-[#178a74] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Register a Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
            >
              {/* Sector pill */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sectorLabel[p.sector] ?? p.sector}
              </span>

              {/* Name */}
              <p className="font-bold text-[#131927] mt-2 text-base leading-snug">
                {p.name ?? p.code}
              </p>

              {/* Location */}
              <p className="text-xs text-slate-400 mt-1">
                {p.region}, {p.country}
              </p>

              {/* Type */}
              <p className="text-xs text-slate-500 mt-3 capitalize">
                {(p.projectType as string).replace(/_/g, " ")}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-2 mt-4">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[p.projectStatus] ?? ""}`}
                >
                  {p.projectStatus}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stageStyle[p.projectStage] ?? ""}`}
                >
                  {p.projectStage}
                </span>
              </div>

              {/* Area */}
              {p.totalAreaHectares && (
                <p className="text-xs text-slate-400 mt-3 border-t border-slate-50 pt-3">
                  {Number(p.totalAreaHectares).toFixed(1)} ha · started{" "}
                  {new Date(p.startDate).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
