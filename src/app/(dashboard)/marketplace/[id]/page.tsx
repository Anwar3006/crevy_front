"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Bird,
  Calendar,
  Droplets,
  Globe,
  Info,
  Leaf,
  MapPin,
  Navigation,
  Shield,
  Trees,
  Wind,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProjectService } from "@/lib/services/project-service";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await ProjectService.getProject(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Project Not Found
          </h1>
          <p className="text-slate-500">
            The project you are looking for does not exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/marketplace")}
            className="rounded-xl px-8"
          >
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const estimatedImpact = Number(project.estimatedTotalTco2e || 0);
  const treesEquivalent = Math.round(estimatedImpact * 25); // Roughly 25 trees per tonne/year
  const flightsEquivalent = Math.round(estimatedImpact * 1.5); // Roughly 1.5 flights per tonne

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/marketplace")}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Marketplace</span>
          </button>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-primary"
            >
              <Shield className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6">
              Invest Now
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Project Hero */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 uppercase text-[10px] tracking-widest font-bold">
                  {project.status === "approved" ? "Verified" : "Pre-Verified"}
                </Badge>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.location}</span>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {project.name}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl relative overflow-hidden group">
                <Leaf className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/10 transition-transform group-hover:scale-110" />
                <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                  Lifetime Sequestration
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-emerald-900">
                    {estimatedImpact.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-emerald-700">
                    tCO2e
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl relative overflow-hidden group">
                <Trees className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/10 transition-transform group-hover:scale-110" />
                <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                  Tree Equivalent
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-blue-900">
                    {treesEquivalent.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-blue-700">Trees</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl relative overflow-hidden group">
                <Wind className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/10 transition-transform group-hover:scale-110" />
                <p className="text-amber-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                  Flights Offset
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-900">
                    {flightsEquivalent.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-amber-700">
                    Flights
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery Placeholder */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={
                  project.imageUrl ||
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                }
                alt={project.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Co-benefits Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <BadgeCheck className="w-6 h-6 text-primary" />
                Co-benefits & Sustainability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <Bird className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Biodiversity</h4>
                    <p className="text-xs text-slate-500">
                      Supports native flora and fauna habitats.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      Water Management
                    </h4>
                    <p className="text-xs text-slate-500">
                      Improved soil moisture and runoff control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Details */}
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Project Implementation
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Soil Type
                  </p>
                  <p className="text-slate-700 font-medium">
                    {project.soilType || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Baseline Land Use
                  </p>
                  <p className="text-slate-700 font-medium">
                    {project.baselineLandUse || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Total Area
                  </p>
                  <p className="text-slate-700 font-medium">
                    {project.totalAreaHectares} Hectares
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-slate-700 font-medium">
                    {project.durationMonths / 12} Years
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <h4 className="font-bold text-slate-900 mb-4">
                  Expected Outcomes
                </h4>
                <p className="text-slate-500 leading-relaxed italic">
                  {project.expectedOutcomes ||
                    "This project focuses on long-term ecological restoration while ensuring sustainable livelihoods for local communities."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Investment Card */}
          <aside className="space-y-8 h-fit lg:sticky top-24">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
              <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                    Price per Tonne
                  </p>
                  <p className="text-4xl font-black text-primary">$45.00</p>
                </div>
                <Badge className="bg-emerald-500 text-white border-0 py-1.5 px-4 rounded-full font-bold">
                  High Impact
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Available Credits</span>
                  <span className="font-bold text-slate-900">
                    {estimatedImpact.toLocaleString()} tCO2e
                  </span>
                </div>
                <Progress
                  value={75}
                  className="h-2 bg-slate-100"
                  indicatorClassName="bg-primary"
                />
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                  75% Percentage Sold
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button className="w-full bg-primary hover:bg-primary/95 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0">
                  Secure Credits Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Download PDD Folder
                </Button>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Since 2024
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Global Std
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Navigation className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Tracked
                  </span>
                </div>
              </div>
            </div>

            {/* Investor Quick Note */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
              <Info className="absolute -right-2 -top-2 w-20 h-20 text-white/5" />
              <h4 className="text-xl font-bold mb-4">Investor Insight</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                This project utilizes <strong>Biochar</strong> and{" "}
                <strong>Agroforestry</strong>, providing some of the highest
                permanence ratios in nature-based solutions.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary font-bold text-sm"
              >
                Full Methodology Report →
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
