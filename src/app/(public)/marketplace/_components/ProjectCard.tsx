"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

// ─── Types & Configuration (Cards) ──────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string }> = {
  regenerative_agriculture: { label: "Regen. Agriculture" },
  reforestation: { label: "Reforestation" },
  renewable_energy: { label: "Renewable Energy" },
  biochar: { label: "Biochar" },
  blue_carbon: { label: "Blue Carbon" },
  waste_management: { label: "Waste Management" },
};

const DEFAULT_IMAGES: Record<string, string> = {
  regenerative_agriculture:
    "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800",
  reforestation:
    "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=800",
  renewable_energy:
    "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800",
  biochar:
    "https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&cs=tinysrgb&w=800",
  blue_carbon:
    "https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800",
  waste_management:
    "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=800",
  default:
    "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; style: string; dot: string }
> = {
  approved: {
    label: "Verified",
    style: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  submitted: {
    label: "Pending",
    style: "border-slate-200 bg-white text-slate-600",
    dot: "bg-slate-400",
  },
  active: {
    label: "Observation",
    style: "border-blue-200 bg-blue-50 text-blue-800",
    dot: "bg-blue-500 animate-pulse",
  },
  verified: {
    label: "Verified",
    style: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
};

// ─── Project Card Component ───────────────────────────────────────────────────

export const ProjectCard = memo(function ProjectCard({
  project,
}: {
  project: Record<string, any>;
}) {
  const typeConfig = useMemo(
    () =>
      TYPE_CONFIG[project.projectType] ?? TYPE_CONFIG.regenerative_agriculture,
    [project.projectType],
  );
  const statusConfig = useMemo(
    () => STATUS_CONFIG[project.status] ?? STATUS_CONFIG.submitted,
    [project.status],
  );
  const imageUrl = useMemo(
    () =>
      project.imageUrl ||
      DEFAULT_IMAGES[project.projectType] ||
      DEFAULT_IMAGES.default,
    [project.imageUrl, project.projectType],
  );

  const price = useMemo(
    () =>
      parseFloat(
        project.pricePerCredit || project.pricePerTonne || "0",
      ).toFixed(2),
    [project.pricePerCredit, project.pricePerTonne],
  );
  const volume = useMemo(
    () => parseFloat(project.availableCredits || "0").toLocaleString(),
    [project.availableCredits],
  );

  return (
    <Link
      href={`/marketplace/project/${project.slug}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
    >
      <article className="bg-white border border-slate-200 hover:border-slate-900 transition-colors duration-500 h-full flex flex-col relative">
        {/* ── Editorial Image Header ─────────────────────────────────────── */}
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            <span className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border border-slate-700">
              {typeConfig.label}
            </span>
            <span
              className={cn(
                "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 shadow-sm",
                statusConfig.style,
              )}
            >
              <span
                className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)}
              ></span>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* ── Data Dossier ──────────────────────────────────────────────── */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-6 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {project.region || project.location || "Africa Region"}
            </div>
            <h3 className="font-serif text-2xl text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-emerald-800 transition-colors">
              {project.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-sans">
              {project.description ||
                "High-integrity carbon sequestration executing verified nature-based methodology."}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 mb-6">
            <div className="bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Available Vol.
              </p>
              <p className="font-mono text-slate-900 font-bold">
                {volume}{" "}
                <span className="text-xs text-slate-500 font-normal">
                  tCO₂e
                </span>
              </p>
            </div>
            <div className="bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Hectares
              </p>
              <p className="font-mono text-slate-900 font-bold">
                {Number(project.totalAreaHectares || 0).toLocaleString()}{" "}
                <span className="text-xs text-slate-500 font-normal">ha</span>
              </p>
            </div>
          </div>

          {/* Acquisition Footer */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 mt-auto">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Asset Price
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono text-slate-900 font-bold">
                  ${price}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  / Tonne
                </span>
              </div>
            </div>

            <button
              type="button"
              tabIndex={-1}
              className={cn(
                "px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                project.status === "approved" || project.status === "verified"
                  ? "bg-slate-900 text-white hover:bg-emerald-900"
                  : "bg-white border border-slate-200 text-slate-900 hover:border-slate-900",
              )}
            >
              {project.status === "approved" || project.status === "verified"
                ? "Acquire Asset"
                : "View Prospectus"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
});
