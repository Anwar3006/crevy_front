"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, Radio } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";

// ─── Pipeline configuration ───────────────────────────────────────────────────

const PIPELINE = [
  {
    key: "registration",
    label: "Registered",
    desc: "Profile created and documents submitted.",
    icon: "📋",
  },
  {
    key: "active",
    label: "Active",
    desc: "Sensors deployed. Live MRV data flowing.",
    icon: "📡",
  },
  {
    key: "verification",
    label: "Under Verification",
    desc: "CraftedClimate reviewing MRV batch data.",
    icon: "🔬",
  },
  {
    key: "completed",
    label: "Completed",
    desc: "Credits issued and listed on marketplace.",
    icon: "✅",
  },
];

const stageOrder: Record<string, number> = {
  registration: 0,
  active: 1,
  verification: 2,
  completed: 3,
};

const statusColor: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  active: "bg-[#2cc295]/10 text-[#178a74]",
  suspended: "bg-red-50 text-red-600",
  closed: "bg-slate-100 text-slate-500",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackVerificationPage() {
  const { data: session } = authClient.useSession();
  const userId = (session?.user as any)?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["my-projects-verification", userId],
    queryFn: () => ProjectService.getProjects({ createdBy: userId, limit: 50 }),
    enabled: !!userId,
  });

  const projects: any[] = data?.data ?? [];

  // Group projects by pipeline stage
  const grouped = PIPELINE.reduce<Record<string, any[]>>((acc, stage) => {
    acc[stage.key] = projects.filter((p) => p.projectStage === stage.key);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#131927]">
          Track Verification
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Follow your projects through each stage of the Crevy verification
          pipeline.
        </p>
      </div>

      {/* Pipeline legend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
          Verification Pipeline
        </p>
        <div className="relative flex items-start overflow-x-auto">
          <div className="absolute left-4 top-4 h-0.5 w-[calc(100%-2rem)] bg-slate-100 min-w-[300px]" />
          {PIPELINE.map((stage, idx) => (
            <div
              key={stage.key}
              className="relative z-10 flex-1 flex flex-col items-center text-center gap-2 px-2 min-w-[100px]"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 text-sm",
                  "border-slate-200 bg-white text-slate-400",
                )}
              >
                {idx + 1}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {stage.label}
              </span>
              <span className="hidden sm:block text-[9px] text-slate-400 leading-tight px-1">
                {stage.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading projects…</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
            📋
          </div>
          <div>
            <p className="font-semibold text-slate-700">
              No projects to track yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Register your first project to begin the verification journey.
            </p>
          </div>
          <Link
            href="/new-project"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#2cc295] px-6 py-3 text-sm font-bold text-white hover:bg-[#178a74] transition-colors"
          >
            Register a Project
          </Link>
        </div>
      )}

      {/* Kanban columns */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PIPELINE.map((stage) => {
            const stageProjects = grouped[stage.key] ?? [];

            return (
              <div key={stage.key} className="space-y-3">
                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{stage.icon}</span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {stage.label}
                    </span>
                  </div>
                  {stageProjects.length > 0 && (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
                      {stageProjects.length}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {stageProjects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                      <p className="text-xs text-slate-400">No projects here</p>
                    </div>
                  ) : (
                    stageProjects.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/project-profile/${p.id}`}
                        className="block rounded-xl border border-gray-100 bg-white shadow-sm p-4 hover:border-emerald-200 hover:shadow-md transition-all"
                      >
                        {/* Project name */}
                        <p className="text-sm font-bold text-[#131927] leading-snug">
                          {p.name ?? p.code}
                        </p>

                        {/* Type */}
                        <p className="text-xs text-slate-400 mt-1 capitalize">
                          {(p.projectType as string).replace(/_/g, " ")}
                        </p>

                        {/* Location */}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {p.region}, {p.country}
                        </p>

                        {/* Status + area */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                              statusColor[p.projectStatus] ?? "",
                            )}
                          >
                            {p.projectStatus}
                          </span>
                          {p.totalAreaHectares && (
                            <span className="text-[10px] text-slate-400">
                              {Number(p.totalAreaHectares).toFixed(1)} ha
                            </span>
                          )}
                        </div>

                        {/* Stage-specific context */}
                        {stage.key === "verification" && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-600 font-medium">
                            <Radio className="h-3 w-3" />
                            MRV data under review
                          </div>
                        )}
                        {stage.key === "active" && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-600 font-medium">
                            <Clock className="h-3 w-3" />
                            Awaiting sensor deployment
                          </div>
                        )}
                        {stage.key === "completed" && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#178a74] font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Credits issued
                          </div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
