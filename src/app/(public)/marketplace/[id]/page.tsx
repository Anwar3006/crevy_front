"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
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
import { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SDGS } from "@/constants/new-project";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";
import {
  calculateProjectMetrics,
  parsePostgresArray,
} from "@/lib/utils/carbon-math";

// ─── Visual Config ────────────────────────────────────────────────────────────

const PROJECT_VISUAL: Record<
  string,
  {
    icon: string;
    gradFrom: string;
    gradTo: string;
    accent: string;
    lightBg: string;
    heroImage: string;
  }
> = {
  regenerative_agriculture: {
    icon: "/icons/3d-leaf.png",
    gradFrom: "#052e16",
    gradTo: "#166534",
    accent: "#16a34a",
    lightBg: "#f0fdf4",
    heroImage:
      "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  waste_management: {
    icon: "/icons/3d-waste.png",
    gradFrom: "#0f172a",
    gradTo: "#334155",
    accent: "#64748b",
    lightBg: "#f8fafc",
    heroImage:
      "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  renewable_energy: {
    icon: "/icons/3d-renewable.png",
    gradFrom: "#451a03",
    gradTo: "#92400e",
    accent: "#d97706",
    lightBg: "#fffbeb",
    heroImage:
      "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  biochar: {
    icon: "/icons/biochar.png",
    gradFrom: "#1c1917",
    gradTo: "#44403c",
    accent: "#78716c",
    lightBg: "#fafaf9",
    heroImage:
      "https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  reforestation: {
    icon: "/icons/reforestation.png",
    gradFrom: "#052e16",
    gradTo: "#065f46",
    accent: "#059669",
    lightBg: "#ecfdf5",
    heroImage:
      "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  blue_carbon: {
    icon: "/icons/blue-carbon.png",
    gradFrom: "#0c1a4e",
    gradTo: "#1e40af",
    accent: "#3b82f6",
    lightBg: "#eff6ff",
    heroImage:
      "https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

const DEFAULT_VISUAL = PROJECT_VISUAL.regenerative_agriculture;

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

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const visual = useMemo(
    () =>
      project
        ? (PROJECT_VISUAL[project.projectType] ?? DEFAULT_VISUAL)
        : DEFAULT_VISUAL,
    [project],
  );

  const metrics = useMemo(
    () => (project ? calculateProjectMetrics(project) : null),
    [project],
  );

  const sdgs = useMemo(
    () => (project ? parsePostgresArray(project.sdgs) : []),
    [project],
  );

  const projectYears = useMemo(
    () => (project ? Math.floor(project.durationMonths / 12) : 0),
    [project],
  );

  if (isLoading) return <ProjectLoadingSkeleton />;
  if (!project || !metrics) return <ProjectNotFoundState />;

  const typeLabel = project.projectType.replace(/_/g, " ");

  return (
    <div className="min-h-screen bg-[#F4F7F4] selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Full-bleed Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[88vh] min-h-[560px] max-h-[780px] overflow-hidden">
        {/* Hero photo */}
        <Image
          src={project.imageUrl || visual.heroImage}
          alt={project.name}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />

        {/* Layered gradient overlays for editorial depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, ${visual.gradFrom}CC 0%, transparent 60%)`,
          }}
        />

        {/* Nav bar */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-2.5 text-white/60 hover:text-white transition-colors"
            aria-label="Back to marketplace"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold hidden md:block">
              Marketplace
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  project.status === "approved" || project.status === "verified"
                    ? "bg-emerald-400"
                    : "bg-amber-400 animate-pulse",
                )}
              />
              {project.status === "approved" ? "Verified" : project.status}
            </span>
            {/* Desktop CTA */}
            <Button
              className="hidden md:flex h-9 px-5 rounded-xl font-bold text-sm text-white border-none shadow-lg"
              style={{ backgroundColor: visual.accent }}
            >
              Invest Now
            </Button>
          </div>
        </nav>

        {/* Hero content — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto px-6 pb-10 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            {/* Type + location row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {visual.icon && (
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={visual.icon}
                    alt={typeLabel}
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
              )}
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white border border-white/20"
                style={{ backgroundColor: `${visual.accent}40` }}
              >
                {typeLabel}
              </span>
              <div className="flex items-center gap-1.5 text-white/50 text-sm font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {project.region}, {project.location}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-4">
              {project.name}
            </h1>

            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
              {project.description}
            </p>

            {/* Inline key metrics */}
            <div className="flex flex-wrap gap-3">
              <HeroPill
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="Carbon Potential"
                value={`${Number(project.estimatedTotalTco2e).toLocaleString()} tCO₂e`}
                accent={visual.accent}
              />
              <HeroPill
                icon={<Leaf className="w-3.5 h-3.5" />}
                label="Area"
                value={`${Number(project.totalAreaHectares).toLocaleString()} Ha`}
                accent={visual.accent}
              />
              <HeroPill
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Duration"
                value={`${projectYears} Years`}
                accent={visual.accent}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28 lg:pb-16 -mt-4 relative z-10">
        {/* Magazine-style two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-10">
          {/* ── Left: Content ── */}
          <section className="space-y-6">
            {/* Tab nav */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm p-1 flex gap-1">
              {(
                [
                  {
                    key: "overview" as Tab,
                    label: "Overview",
                    icon: <Sprout className="w-4 h-4" />,
                  },
                  {
                    key: "technical" as Tab,
                    label: "Technical Data",
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
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === key
                      ? "bg-[#131927] text-white shadow-md"
                      : "text-gray-500 hover:text-[#131927] hover:bg-gray-50",
                  )}
                >
                  <span
                    className={
                      activeTab === key ? "text-white" : "text-gray-400"
                    }
                  >
                    {icon}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* ── Tab: Overview ── */}
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Impact cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MagazineMetricCard
                      label="Carbon Potential"
                      value={Number(
                        project.estimatedTotalTco2e,
                      ).toLocaleString()}
                      unit="tCO₂e"
                      sub={`≈ ${metrics.treesEquivalent.toLocaleString()} trees`}
                      icon={<Leaf className="w-5 h-5" />}
                      accent={visual.accent}
                      bg={visual.lightBg}
                    />
                    <MagazineMetricCard
                      label="Annual Yield"
                      value={metrics.estimatedYield}
                      unit="tCO₂e/yr"
                      sub={`${projectYears}-year project`}
                      icon={<TrendingUp className="w-5 h-5" />}
                      accent="#3b82f6"
                      bg="#eff6ff"
                    />
                    <MagazineMetricCard
                      label="Area Managed"
                      value={Number(project.totalAreaHectares).toLocaleString()}
                      unit="Ha"
                      sub={`${metrics.tco2ePerHectare} tCO₂e/Ha`}
                      icon={<Layers className="w-5 h-5" />}
                      accent="#f59e0b"
                      bg="#fffbeb"
                    />
                  </div>

                  {/* Project phases — magazine timeline */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 pt-6 pb-3 border-b border-gray-50">
                      <h2 className="font-extrabold text-[#131927] text-lg">
                        Project Phases
                      </h2>
                      <p className="text-gray-400 text-sm mt-0.5">
                        Verification & issuance milestones
                      </p>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        {
                          phase: "Baseline Assessment",
                          status: "done",
                          label: "Completed",
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
                            className={cn(
                              "w-9 h-9 rounded-full shrink-0 flex items-center justify-center border-2",
                              status === "done"
                                ? "bg-emerald-50 border-emerald-200"
                                : status === "active"
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200",
                            )}
                          >
                            {status === "done" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : status === "active" ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span
                              className={cn(
                                "text-sm font-bold truncate",
                                status === "done"
                                  ? "text-gray-700"
                                  : status === "active"
                                    ? "text-blue-700"
                                    : "text-gray-400",
                              )}
                            >
                              {phase}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-extrabold ml-4 shrink-0",
                                status === "done"
                                  ? "text-emerald-600"
                                  : status === "active"
                                    ? "text-blue-600"
                                    : "text-gray-400",
                              )}
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
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-extrabold text-[#131927] text-lg mb-4">
                        Applied Practices
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {project.projectPractices.map(
                          (p: Record<string, any>) => (
                            <div
                              key={`${p.intensity}-${p.impactFactorAtSigning}`}
                              className="inline-flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2"
                              style={{ backgroundColor: visual.lightBg }}
                            >
                              <Sprout
                                className="w-3.5 h-3.5 shrink-0"
                                style={{ color: visual.accent }}
                              />
                              <span className="text-sm font-bold text-gray-700">
                                {p.intensity}
                              </span>
                              <span className="text-xs text-gray-400 font-bold">
                                {p.impactFactorAtSigning}× factor
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Tab: Technical ── */}
              {activeTab === "technical" && (
                <motion.div
                  key="technical"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <h2 className="font-extrabold text-[#131927] text-xl mb-1">
                      Soil & Land Profile
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                      Baseline conditions and measurement parameters
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                      {[
                        {
                          icon: <FlaskConical className="w-4 h-4" />,
                          label: "Soil Type",
                          value: project.soilType,
                        },
                        {
                          icon: <BarChart3 className="w-4 h-4" />,
                          label: "Initial Carbon",
                          value: project.initialSoilCarbonContent
                            ? `${project.initialSoilCarbonContent}%`
                            : null,
                        },
                        {
                          icon: <Layers className="w-4 h-4" />,
                          label: "Baseline Land Use",
                          value: project.baselineLandUse,
                        },
                        {
                          icon: <Shield className="w-4 h-4" />,
                          label: "Permanence",
                          value: metrics.permanenceScore,
                        },
                      ].map(({ icon, label, value }) => (
                        <div key={label} className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            {icon} {label}
                          </div>
                          <p className="text-[#131927] font-extrabold text-sm">
                            {value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Insight box */}
                    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-blue-900 mb-1">
                          Sequestration Headroom
                        </p>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          Baseline soil carbon at{" "}
                          <strong>{project.initialSoilCarbonContent}%</strong>{" "}
                          signals significant potential. Sites below 3%
                          typically yield 2–4× the carbon uplift.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Co-benefits */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <h2 className="font-extrabold text-[#131927] text-xl mb-6">
                      Environmental Co-Benefits
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-2xl border",
                            active
                              ? "bg-emerald-50 border-emerald-100"
                              : "bg-gray-50 border-gray-100",
                          )}
                        >
                          <div
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                              active
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-200 text-gray-400",
                            )}
                          >
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-extrabold",
                                active ? "text-emerald-900" : "text-gray-400",
                              )}
                            >
                              {label}
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-0.5 leading-snug",
                                active ? "text-emerald-700" : "text-gray-400",
                              )}
                            >
                              {desc}
                            </p>
                          </div>
                          {active && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Tab: Sustainability ── */}
              {activeTab === "sustainability" && (
                <motion.div
                  key="sustainability"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="font-extrabold text-[#131927] text-xl mb-1">
                          UN SDGs Aligned
                        </h2>
                        <p className="text-gray-400 text-sm">
                          This project advances{" "}
                          <strong className="text-[#131927]">
                            {sdgs.length}
                          </strong>{" "}
                          of the 17 global goals.
                        </p>
                      </div>
                      <div className="bg-[#131927] text-white rounded-2xl px-4 py-2 text-center shrink-0">
                        <p className="text-2xl font-black leading-none">
                          {sdgs.length}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mt-0.5">
                          SDGs
                        </p>
                      </div>
                    </div>

                    {sdgs.length === 0 ? (
                      <p className="text-gray-400 text-sm">
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
                              className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white group"
                            >
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                                style={{ backgroundColor: hex }}
                              >
                                {sdgId}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                                  SDG {sdgId}
                                </p>
                                <p className="text-sm font-extrabold text-[#131927] leading-snug">
                                  {goal.title}
                                </p>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto shrink-0 transition-colors" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {project.expectedOutcomes && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                      <h2 className="font-extrabold text-[#131927] text-xl mb-3">
                        Expected Outcomes
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {project.expectedOutcomes}
                      </p>
                    </div>
                  )}

                  {project.implementationPlan && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                      <h2 className="font-extrabold text-[#131927] text-xl mb-3">
                        Implementation Plan
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {project.implementationPlan}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Right: Investment Terminal ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <InvestmentTerminal
                project={project}
                metrics={metrics}
                visual={visual}
                projectYears={projectYears}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* ── Mobile sticky investment bar ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Floor Price
            </p>
            <p className="text-xl font-black text-[#131927]">
              $45.00{" "}
              <span className="text-sm font-bold text-gray-400">/ tCO₂e</span>
            </p>
          </div>
          <Sheet open={investSheetOpen} onOpenChange={setInvestSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="rounded-xl px-6 h-12 font-bold text-sm text-white border-none"
                style={{ backgroundColor: visual.accent }}
              >
                Invest Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-8">
              <div className="pt-6">
                <InvestmentTerminal
                  project={project}
                  metrics={metrics}
                  visual={visual}
                  projectYears={projectYears}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

// ─── Investment Terminal ──────────────────────────────────────────────────────

const InvestmentTerminal = memo(function InvestmentTerminal({
  project,
  metrics,
  visual,
  projectYears,
}: {
  project: Record<string, any>;
  metrics: Record<string, any>;
  visual: (typeof PROJECT_VISUAL)[string];
  projectYears: number;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] overflow-hidden">
      {/* Top accent */}
      <div className="h-1 w-full" style={{ backgroundColor: visual.accent }} />

      <div className="p-6 space-y-6">
        {/* Price block */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
            Acquisition Floor
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#131927] tracking-tight">
              $45
            </span>
            <span className="text-lg font-bold text-gray-400">/ tCO₂e</span>
          </div>
          <div
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${visual.accent}15`,
              color: visual.accent,
            }}
          >
            <TrendingUp className="w-3 h-3" />
            +12% vs. global avg.
          </div>
        </div>

        {/* Issuance progress */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">
              Round 1 Issuance
            </span>
            <span
              className="text-xs font-black"
              style={{ color: visual.accent }}
            >
              75%
            </span>
          </div>
          <Progress
            value={75}
            className="h-2.5 bg-gray-100"
            indicatorClassName="rounded-full"
            style={{ "--progress-indicator-color": visual.accent } as any}
          />
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            <span>0 tCO₂e</span>
            <span>
              {Number(project.estimatedTotalTco2e).toLocaleString()} tCO₂e
            </span>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Permanence", value: metrics.permanenceScore },
            { label: "Duration", value: `${projectYears} Years` },
            { label: "Annual Yield", value: `${metrics.estimatedYield} tCO₂e` },
            { label: "Verified", value: "Stage 1" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="text-sm font-extrabold text-[#131927]">{value}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2">
          {["VCS Eligible", "Gold Standard", "ISO 14064"].map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full"
            >
              <Award className="w-2.5 h-2.5 text-[#2CC295]" />
              {cert}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-2.5">
          <Button
            className="w-full h-14 rounded-2xl font-extrabold text-base text-white border-none shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
            style={{
              backgroundColor: visual.accent,
              boxShadow: `0 8px 24px ${visual.accent}40`,
            }}
          >
            Commit Capital
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50 gap-2"
          >
            <Shield className="w-4 h-4 text-[#2CC295]" />
            View Verification Chain
          </Button>
        </div>

        {/* Insight note */}
        <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Soil carbon at <strong>{project.initialSoilCarbonContent}%</strong>{" "}
            indicates high sequestration headroom vs. regional benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
});

// ─── Small helpers ────────────────────────────────────────────────────────────

function HeroPill({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
      <span style={{ color: accent }}>{icon}</span>
      <div>
        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-sm font-extrabold text-white leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

const MagazineMetricCard = memo(function MagazineMetricCard({
  label,
  value,
  unit,
  sub,
  icon,
  accent,
  bg,
}: {
  label: string;
  value: string | number;
  unit: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bg, color: accent }}
      >
        {icon}
      </div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl font-black text-[#131927] tracking-tight">
          {value}
        </span>
        <span className="text-xs font-bold text-gray-400 uppercase">
          {unit}
        </span>
      </div>
      <p className="text-xs text-gray-400 font-medium">{sub}</p>
    </div>
  );
});

// ─── Skeletons & Error ────────────────────────────────────────────────────────

function ProjectLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F7F4]">
      <div className="h-[88vh] bg-gray-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="h-12 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

function ProjectNotFoundState() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Wind className="w-9 h-9 text-gray-300" />
      </div>
      <h1 className="text-2xl font-black text-[#131927] mb-2">
        Project Not Found
      </h1>
      <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
        This project may have been archived or the link is no longer valid.
      </p>
      <Button
        onClick={() => router.back()}
        className="rounded-2xl px-8 h-12 bg-[#131927] text-white font-bold hover:bg-black"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>
    </div>
  );
}
