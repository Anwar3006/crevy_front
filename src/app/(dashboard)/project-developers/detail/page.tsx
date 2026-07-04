"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import {
  type ProjectDeveloperRecord,
  ProjectDeveloperService,
} from "@/lib/services/project-developer-service";
import { cn } from "@/lib/utils";

// ─── Editorial Configs ────────────────────────────────────────────────────────

const verificationConfig: Record<
  string,
  { label: string; className: string; bg: string; dot: string }
> = {
  pending: {
    label: "Pending KYC",
    className: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  verified: {
    label: "Verified Entity",
    className: "text-emerald-800",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "KYC Failed",
    className: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

const getInitials = (first?: string, last?: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "PO";

// Editorial Mono-spaced Info Row
function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
      <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
        {label}
      </div>
      <div
        className={cn(
          "col-span-8 text-sm font-semibold text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Main Content Component ──────────────────────────────────────────────────

function ProjectDeveloperDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-developer", userId],
    queryFn: () => ProjectDeveloperService.getProjectDeveloper(userId!),
    enabled: !!userId,
  });

  const owner: ProjectDeveloperRecord | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
          Extracting KYC Details...
        </span>
      </div>
    );
  }

  if (isError || !owner) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center text-center">
        <XCircle className="h-10 w-10 text-red-500 mb-4" />
        <p className="font-sans text-xl text-foreground mb-2">
          Details Retrieval Failed
        </p>
        <Link
          href="/project-developers"
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground border-b border-slate-900 pb-0.5"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const vc =
    verificationConfig[owner.verificationStatus] ?? verificationConfig.pending;

  return (
    <div className="animate-in fade-in duration-700 pb-24">
      {/* ── Editorial Header ── */}
      <div className="bg-white border-b border-border pt-12 pb-12">
        <div className="max-w-250 mx-auto px-6 lg:px-10">
          <button
            type="button"
            onClick={() => router.push("/project-developers")}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Personnel Roster
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-secondary text-white flex items-center justify-center text-2xl font-sans">
                {getInitials(owner.firstName, owner.lastName)}
              </div>
              <div>
                <h1 className="text-4xl font-sans text-foreground tracking-tight leading-none mb-3">
                  {owner.firstName} {owner.lastName}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                    ID: {owner.code}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border",
                      vc.bg,
                      vc.className,
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", vc.dot)}
                    ></span>
                    {vc.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ... (rest of the page body) */}
    </div>
  );
}

export default function ProjectDeveloperDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-10 h-10 text-foreground animate-spin" />
        </div>
      }
    >
      <ProjectDeveloperDetailContent />
    </Suspense>
  );
}
