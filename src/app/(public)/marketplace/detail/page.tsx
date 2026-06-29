"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectService } from "@/lib/services/project-service";
import MarketplaceSEO from "../_components/MarketplaceSEO";
import ProjectHero from "../_components/ProjectHero";
import ProjectPriceChart from "../_components/ProjectPriceChart";
import ProjectStory from "../_components/ProjectStory";

// ─── Visual Mapping ──────────────────────────────────────────────────────────
const PROJECT_VISUAL: Record<string, any> = {
  regenerative_agriculture: {
    heroImage:
      "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  waste_management: {
    heroImage:
      "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  renewable_energy: {
    heroImage:
      "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  reforestation: {
    heroImage:
      "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  default: {
    heroImage:
      "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

function MarketplaceProjectDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  // 1. Fetch Project Data
  const {
    data: projectRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project-marketplace-detail", projectId],
    queryFn: () => ProjectService.getProjectMarketplaceDetail(projectId!),
    enabled: !!projectId,
  });

  const project = projectRes?.data;
  const visual = useMemo(() => {
    return PROJECT_VISUAL[project?.projectType] || PROJECT_VISUAL.default;
  }, [project?.projectType]);

  // 2. Fetch Price History Data for Chart
  const { data: priceHistoryRes } = useQuery({
    queryKey: ["project-price-history", projectId],
    queryFn: () => ProjectService.getProjectPriceHistory(projectId!),
    enabled: !!projectRes,
  });

  // Mock price data if real history is unavailable for demo
  const priceData = useMemo(() => {
    if (priceHistoryRes?.data?.length > 0) return priceHistoryRes.data;
    return [
      { month: "Jul", price: 42.5 },
      { month: "Aug", price: 44.2 },
      { month: "Sep", price: 46.8 },
      { month: "Oct", price: 45.0 },
      { month: "Nov", price: 48.2 },
      { month: "Dec", price: 52.0 },
    ];
  }, [priceHistoryRes]);

  if (isLoading) return <ProjectLoadingSkeleton />;
  if (isError || !project) return <ProjectNotFoundState />;

  return (
    <div className="bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      {/* ── SEO & Meta ── */}
      <MarketplaceSEO
        title={project.name}
        description={project.description || ""}
        image={visual.heroImage}
        projectId={projectId!}
        price="52.00"
      />

      {/* ── Institutional Hero ── */}
      <ProjectHero project={project} visual={visual} />

      <main className="relative z-20 bg-white border-t border-slate-200">
        {/* ── Price Insight Section ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-16">
          <ProjectPriceChart data={priceData} />
        </div>

        {/* ── Impact Narrative & Compliance ── */}
        <ProjectStory project={project} />

        <div className="pb-32 flex justify-center">
          <Button
            onClick={() => router.push("/marketplace")}
            variant="ghost"
            className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-slate-900 rounded-none"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Marketplace Discovery
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ProjectMarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <Loader2 className="w-10 h-10 text-brand animate-spin" />
        </div>
      }
    >
      <MarketplaceProjectDetailContent />
    </Suspense>
  );
}

function ProjectLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="h-[90vh] bg-slate-900 animate-pulse" />
      <div className="max-w-7xl mx-auto px-20 py-20 space-y-12">
        <Skeleton className="h-[400px] rounded-none bg-slate-900" />
        <div className="grid grid-cols-3 gap-10">
          <Skeleton className="h-64 col-span-2 rounded-none bg-slate-900" />
          <Skeleton className="h-64 rounded-none bg-slate-900" />
        </div>
      </div>
    </div>
  );
}

function ProjectNotFoundState() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <h1 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-tight">
        Project Not Found
      </h1>
      <p className="text-slate-400 mb-8 max-w-md font-light">
        The asset registry record could not be located. It may have been
        archived or is restricted.
      </p>
      <Button
        onClick={() => router.back()}
        className="rounded-none h-14 px-10 bg-brand text-slate-900 hover:bg-white font-bold uppercase tracking-[0.2em] text-xs"
      >
        Return to Ledger
      </Button>
    </div>
  );
}
