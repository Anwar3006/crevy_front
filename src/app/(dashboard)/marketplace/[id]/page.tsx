"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  FlaskConical,
  Globe,
  Info,
  Layers,
  Leaf,
  MapPin,
  Scale,
  Shield,
  Sprout,
  TreePine,
  TrendingUp,
  Waves,
  Wind,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SDGS } from "@/constants/new-project";
import { ProjectService } from "@/lib/services/project-service";
import {
  calculateProjectMetrics,
  parsePostgresArray,
} from "@/lib/utils/carbon-math";

// ─── Project type visual config ─────────────────────────────────────────────
const PROJECT_VISUAL: Record<
  string,
  {
    icon: string;
    gradientFrom: string;
    gradientTo: string;
    accent: string;
    lightBg: string;
  }
> = {
  regenerative_agriculture: {
    icon: "/icons/3d-leaf.png",
    gradientFrom: "#052e16",
    gradientTo: "#166534",
    accent: "#16a34a",
    lightBg: "#f0fdf4",
  },
  waste_management: {
    icon: "/icons/3d-waste.png",
    gradientFrom: "#0f172a",
    gradientTo: "#334155",
    accent: "#64748b",
    lightBg: "#f8fafc",
  },
  renewable_energy: {
    icon: "/icons/3d-renewable.png",
    gradientFrom: "#451a03",
    gradientTo: "#92400e",
    accent: "#d97706",
    lightBg: "#fffbeb",
  },
  biochar: {
    icon: "/icons/biochar.png",
    gradientFrom: "#1c1917",
    gradientTo: "#44403c",
    accent: "#78716c",
    lightBg: "#fafaf9",
  },
  reforestation: {
    icon: "/icons/reforestation.png",
    gradientFrom: "#052e16",
    gradientTo: "#065f46",
    accent: "#059669",
    lightBg: "#ecfdf5",
  },
  blue_carbon: {
    icon: "/icons/blue-carbon.png",
    gradientFrom: "#0c1a4e",
    gradientTo: "#1e40af",
    accent: "#3b82f6",
    lightBg: "#eff6ff",
  },
};

const DEFAULT_VISUAL = PROJECT_VISUAL.regenerative_agriculture;

// SDG hex colors (extracted from SDGS constant)
const SDG_HEX: Record<string, string> = {
  "1": "#E5243B",
  "2": "#DDA63A",
  "3": "#4C9F38",
  "4": "#C5192D",
  "5": "#FF3A21",
  "6": "#26BDE2",
  "7": "#FCC30B",
  "8": "#A21942",
  "9": "#FD6925",
  "10": "#DD1367",
  "11": "#FD9D24",
  "12": "#BF8B2E",
  "13": "#3F7E44",
  "14": "#0A97D9",
  "15": "#56C02B",
  "16": "#00689D",
  "17": "#19486A",
};

type Tab = "overview" | "technical" | "sustainability";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [investSheetOpen, setInvestSheetOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await ProjectService.getProject(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <ProjectLoadingSkeleton />;
  if (!project) return <ProjectNotFoundState />;

  const metrics = calculateProjectMetrics(project);
  const sdgs = parsePostgresArray(project.sdgs);
  const visual = PROJECT_VISUAL[project.projectType] || DEFAULT_VISUAL;
  const projectTypeLabel = project.projectType.replace(/_/g, " ");
  const projectYears = Math.floor(project.durationMonths / 12);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${visual.gradientFrom} 0%, ${visual.gradientTo} 100%)`,
        }}
      >
        {/* Atmospheric texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.2)_0%,transparent_70%)] pointer-events-none" />

        {/* Nav bar inside hero */}
        <nav className="relative z-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-full group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:block">
              Marketplace
            </span>
          </button>

          <div className="flex items-center gap-3">
            <Badge className="hidden sm:flex bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-3 py-1 font-semibold text-xs capitalize">
              {project.status}
            </Badge>
            {/* Desktop invest button */}
            <Button
              className="hidden md:flex bg-white text-slate-900 hover:bg-white/90 rounded-xl px-5 h-9 font-bold text-sm transition-all active:scale-95"
              style={{ color: visual.gradientTo }}
            >
              Participate in Round
            </Button>
          </div>
        </nav>

        {/* Hero body */}
        <div className="relative z-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            {/* Left: identity */}
            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {visual.icon && (
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                    <Image
                      src={visual.icon}
                      alt={projectTypeLabel}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                )}
                <Badge className="bg-white/15 text-white border-none hover:bg-white/20 rounded-lg px-3 py-1 text-xs font-bold capitalize">
                  {projectTypeLabel}
                </Badge>
                <div className="flex items-center gap-1.5 text-white/60 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {project.region}, {project.location}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
                {project.name}
              </h1>

              <p className="text-white/65 text-sm xl:text-base leading-relaxed max-w-2xl font-medium">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {projectYears} year{projectYears !== 1 ? "s" : ""} duration
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">
                    Verified Stage 1
                  </span>
                </div>
              </div>
            </div>

            {/* Right: hero stat chips (desktop only) */}
            <div className="hidden lg:flex flex-col gap-3 shrink-0">
              <HeroStat
                label="Carbon Potential"
                value={`${Number(project.estimatedTotalTco2e).toLocaleString()} tCO₂e`}
              />
              <HeroStat
                label="Annual Yield"
                value={`${metrics.estimatedYield} tCO₂e/yr`}
              />
              <HeroStat
                label="Area Managed"
                value={`${Number(project.totalAreaHectares).toLocaleString()} Ha`}
              />
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
          <svg
            viewBox="0 0 1440 32"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden="true"
          >
            <title>Wave divider</title>
            <path
              d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </div>

      {/* ─── Mobile quick stats (below hero on small screens) ─────────────── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 -mt-2 mb-2">
        <div className="grid grid-cols-3 gap-2 py-4">
          <MobileStatChip
            label="Potential"
            value={`${(Number(project.estimatedTotalTco2e) / 1000).toFixed(1)}k`}
            unit="tCO₂e"
          />
          <MobileStatChip
            label="Yield/yr"
            value={metrics.estimatedYield.split(",")[0]}
            unit="tCO₂e"
          />
          <MobileStatChip
            label="Area"
            value={Number(project.totalAreaHectares).toLocaleString()}
            unit="Ha"
          />
        </div>
      </div>

      {/* ─── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* ── Left: tabbed narrative content ── */}
          <section className="space-y-0">
            {/* Tab nav */}
            <div className="flex gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm mb-8">
              {(
                [
                  {
                    key: "overview" as Tab,
                    label: "Overview",
                    icon: <Sprout className="w-4 h-4" />,
                  },
                  {
                    key: "technical" as Tab,
                    label: "Technical",
                    icon: <FlaskConical className="w-4 h-4" />,
                  },
                  {
                    key: "sustainability" as Tab,
                    label: "SDGs & Impact",
                    icon: <Globe className="w-4 h-4" />,
                  },
                ] as const
              ).map(({ key, label, icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === key
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={
                      activeTab === key ? "text-white" : "text-slate-400"
                    }
                  >
                    {icon}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden text-xs">
                    {label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Impact metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard
                    label="Carbon Potential"
                    value={Number(project.estimatedTotalTco2e).toLocaleString()}
                    unit="tCO₂e"
                    subtext={`${metrics.treesEquivalent.toLocaleString()} trees equivalent`}
                    icon={<Leaf className="w-5 h-5" />}
                    accentColor={visual.accent}
                    lightBg={visual.lightBg}
                  />
                  <MetricCard
                    label="Annual Yield"
                    value={metrics.estimatedYield}
                    unit="tCO₂e/yr"
                    subtext={`Over ${projectYears} year project`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    accentColor="#3b82f6"
                    lightBg="#eff6ff"
                  />
                  <MetricCard
                    label="Area Managed"
                    value={Number(project.totalAreaHectares).toLocaleString()}
                    unit="Ha"
                    subtext={`${metrics.tco2ePerHectare} tCO₂e per hectare`}
                    icon={<Layers className="w-5 h-5" />}
                    accentColor="#f59e0b"
                    lightBg="#fffbeb"
                  />
                </div>

                {/* Project timeline */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900">
                      Project Phases
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      ID: {project.id?.split("-")[0] || "—"}
                    </span>
                  </div>
                  <div className="px-6 pb-6 mt-4 space-y-3">
                    {[
                      {
                        phase: "Baseline Assessment",
                        status: "done",
                        label: "Complete",
                      },
                      {
                        phase: "Methodology Verification",
                        status: "done",
                        label: "Stage 1 Verified",
                      },
                      {
                        phase: "Issuance Round 1",
                        status: "active",
                        label: "In Progress — 75%",
                      },
                      {
                        phase: "Annual Monitoring",
                        status: "upcoming",
                        label: "Scheduled",
                      },
                      {
                        phase: "Full Certification",
                        status: "upcoming",
                        label: `Est. Year ${projectYears}`,
                      },
                    ].map(({ phase, status, label }) => (
                      <div key={phase} className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                            status === "done"
                              ? "bg-emerald-100"
                              : status === "active"
                                ? "bg-blue-100"
                                : "bg-slate-100"
                          }`}
                        >
                          {status === "done" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : status === "active" ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span
                            className={`text-sm font-semibold truncate ${
                              status === "done"
                                ? "text-slate-700"
                                : status === "active"
                                  ? "text-blue-700"
                                  : "text-slate-400"
                            }`}
                          >
                            {phase}
                          </span>
                          <span
                            className={`text-xs font-bold ml-4 shrink-0 ${
                              status === "done"
                                ? "text-emerald-600"
                                : status === "active"
                                  ? "text-blue-600"
                                  : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applied practices */}
                {project.projectPractices?.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Applied Practices
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.projectPractices.map(
                        (p: Record<string, any>) => (
                          <div
                            key={`${p.intensity}-${p.impactFactorAtSigning}`}
                            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                          >
                            <Sprout className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-sm font-semibold text-slate-700">
                              {p.intensity}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">
                              {p.impactFactorAtSigning}× factor
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Technical */}
            {activeTab === "technical" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Technical attributes grid */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Soil & Land Profile
                    </h3>
                    <p className="text-sm text-slate-500">
                      Baseline conditions and measurement parameters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <TechnicalDetail
                      icon={<FlaskConical className="w-4 h-4" />}
                      label="Soil Type"
                      value={project.soilType}
                    />
                    <TechnicalDetail
                      icon={<BarChart3 className="w-4 h-4" />}
                      label="Initial Carbon"
                      value={
                        project.initialSoilCarbonContent
                          ? `${project.initialSoilCarbonContent}%`
                          : null
                      }
                    />
                    <TechnicalDetail
                      icon={<Layers className="w-4 h-4" />}
                      label="Baseline Land Use"
                      value={project.baselineLandUse}
                    />
                    <TechnicalDetail
                      icon={<Shield className="w-4 h-4" />}
                      label="Permanence"
                      value={metrics.permanenceScore}
                    />
                  </div>

                  {/* Carbon headroom insight */}
                  <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-blue-900">
                        Sequestration Headroom
                      </p>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        Baseline soil carbon at{" "}
                        <strong>{project.initialSoilCarbonContent}%</strong>{" "}
                        signals significant potential for accumulation. Projects
                        below 3% typically yield 2–4× the carbon uplift of
                        higher-baseline sites.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Co-benefit flags */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    Environmental Co-Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Droplets className="w-4 h-4" />,
                        label: "Water Management",
                        active: project.supportsWaterManagement === "yes",
                        desc: "Improved watershed & infiltration",
                      },
                      {
                        icon: <TreePine className="w-4 h-4" />,
                        label: "Biodiversity",
                        active: project.supportsBiodiversity === "yes",
                        desc: "Native habitat enhancement",
                      },
                      {
                        icon: <Waves className="w-4 h-4" />,
                        label: "Practice Expansion",
                        active: project.planToExpandPractices === "yes",
                        desc: "Planned scale-up program",
                      },
                      {
                        icon: <Scale className="w-4 h-4" />,
                        label: "Social & Economic",
                        active: !!project.socialEconomicBenefits,
                        desc:
                          project.socialEconomicBenefits ||
                          "Community development",
                      },
                    ].map(({ icon, label, active, desc }) => (
                      <div
                        key={label}
                        className={`flex items-start gap-3 p-4 rounded-2xl border ${active ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}
                        >
                          {icon}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${active ? "text-emerald-900" : "text-slate-400"}`}
                          >
                            {label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 leading-snug ${active ? "text-emerald-700" : "text-slate-400"}`}
                          >
                            {desc}
                          </p>
                        </div>
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-auto mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Sustainability / SDGs */}
            {activeTab === "sustainability" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      UN Sustainable Development Goals
                    </h3>
                    <p className="text-sm text-slate-500">
                      This project directly advances {sdgs.length} of the 17
                      global goals.
                    </p>
                  </div>

                  {sdgs.length === 0 ? (
                    <p className="text-slate-400 text-sm">
                      No SDGs mapped yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sdgs.map((sdgId: string) => {
                        const goal = SDGS.find((g) => g.id === sdgId);
                        const hex = SDG_HEX[sdgId] || "#94a3b8";
                        if (!goal) return null;
                        return (
                          <div
                            key={sdgId}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white"
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                              style={{ backgroundColor: hex }}
                            >
                              {sdgId}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                                SDG {sdgId}
                              </p>
                              <p className="text-sm font-bold text-slate-800 leading-snug">
                                {goal.title}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Expected outcomes */}
                {project.expectedOutcomes && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Expected Outcomes
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.expectedOutcomes}
                    </p>
                  </div>
                )}

                {/* Implementation plan */}
                {project.implementationPlan && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Implementation Plan
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.implementationPlan}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Right: Investment terminal (desktop sticky) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <InvestmentPanel
                project={project}
                metrics={metrics}
                // visual={visual}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* ─── Mobile: sticky bottom investment bar ────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Acquisition Floor
            </p>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              $45.00{" "}
              <span className="text-sm font-bold text-slate-400">/ tonne</span>
            </p>
          </div>
          <Sheet open={investSheetOpen} onOpenChange={setInvestSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="rounded-xl px-6 h-12 font-bold text-sm text-white transition-all active:scale-95"
                style={{ backgroundColor: visual.accent }}
              >
                Invest Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-8">
              <div className="pt-6">
                <InvestmentPanel
                  project={project}
                  metrics={metrics}
                  // visual={visual}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

// ─── Investment Panel ────────────────────────────────────────────────────────
function InvestmentPanel({
  project,
  metrics,
}: {
  project: Record<string, unknown>;
  metrics: Record<string, unknown>;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)] p-6 space-y-6">
      {/* Price */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
          Acquisition Floor
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900">$45.00</span>
          <span className="text-base font-bold text-slate-400">/ tonne</span>
        </div>
      </div>

      {/* Issuance progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
              Issuance Progress
            </span>
            <span className="text-sm font-black text-emerald-600">
              Verified Stage 1
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold">75%</span>
          </div>
        </div>
        <Progress
          value={75}
          className="h-2.5 bg-slate-100"
          indicatorClassName="bg-emerald-500 rounded-full"
        />
        <div className="flex justify-between text-xs text-slate-400 font-semibold">
          <span>0 tCO₂e</span>
          <span>
            {Number(project.estimatedTotalTco2e).toLocaleString()} tCO₂e
          </span>
        </div>
      </div>

      {/* Key investment stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Permanence
          </p>
          <p className="text-sm font-bold text-slate-900">
            {metrics.permanenceScore as any}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Duration
          </p>
          <p className="text-sm font-bold text-slate-900">
            {Math.floor((project.durationMonths as any) / 12)} Years
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <Button
          className="w-full h-14 rounded-2xl font-bold text-base text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
          style={{ backgroundColor: "#0f172a" }}
        >
          Commit Capital
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2.5"
        >
          <Shield className="w-4 h-4 text-emerald-500" />
          View Verification Chain
        </Button>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          Baseline carbon at{" "}
          <strong>{project.initialSoilCarbonContent as any}%</strong> indicates
          high sequestration headroom relative to regional benchmarks.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-sm min-w-[200px]">
      <div className="w-1.5 h-8 rounded-full bg-white/40" />
      <div>
        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-base font-black text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function MobileStatChip({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-lg font-black text-slate-900">{value}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
        {unit}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  subtext,
  icon,
  accentColor,
  lightBg,
}: {
  label: string;
  value: string | number;
  unit: string;
  subtext: string;
  icon: React.ReactNode;
  accentColor: string;
  lightBg: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: lightBg, color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase">
            {unit}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">{subtext}</p>
      </div>
    </div>
  );
}

function TechnicalDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-slate-900 font-bold text-sm">{value || "—"}</p>
    </div>
  );
}

// ─── Skeleton & Error States ─────────────────────────────────────────────────

function ProjectLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-64 bg-slate-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}

function ProjectNotFoundState() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Wind className="w-9 h-9 text-slate-300" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">
        Project Not Found
      </h1>
      <p className="text-slate-500 mb-8 max-w-xs text-sm leading-relaxed">
        This project may have been archived or the link is no longer valid.
      </p>
      <Button
        onClick={() => router.back()}
        className="rounded-2xl px-8 h-12 bg-slate-900 text-white font-bold hover:bg-black"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>
    </div>
  );
}
