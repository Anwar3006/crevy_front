"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Leaf,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

// ─── Type config ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; accent: string; lightText: string }
> = {
  regenerative_agriculture: {
    label: "Regen. Agriculture",
    color: "#16a34a",
    accent: "#dcfce7",
    lightText: "#15803d",
  },
  reforestation: {
    label: "Reforestation",
    color: "#059669",
    accent: "#d1fae5",
    lightText: "#047857",
  },
  renewable_energy: {
    label: "Renewable Energy",
    color: "#d97706",
    accent: "#fef3c7",
    lightText: "#b45309",
  },
  biochar: {
    label: "Biochar",
    color: "#78716c",
    accent: "#f5f5f4",
    lightText: "#57534e",
  },
  blue_carbon: {
    label: "Blue Carbon",
    color: "#2563eb",
    accent: "#dbeafe",
    lightText: "#1d4ed8",
  },
  waste_management: {
    label: "Waste Management",
    color: "#0d9488",
    accent: "#ccfbf1",
    lightText: "#0f766e",
  },
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
  { label: string; dot: string; bg: string; text: string }
> = {
  approved: {
    label: "Verified",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-400/30",
    text: "text-emerald-300",
  },
  submitted: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-500/20 border-amber-400/30",
    text: "text-amber-300",
  },
  active: {
    label: "Pre-Verified",
    dot: "bg-blue-400 animate-pulse",
    bg: "bg-blue-500/20 border-blue-400/30",
    text: "text-blue-300",
  },
  verified: {
    label: "Verified",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-400/30",
    text: "text-emerald-300",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-500/20 border-amber-400/30",
    text: "text-amber-300",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

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

  const co2Formatted = useMemo(
    () => Number(project.estimatedTotalTco2e || 0).toLocaleString(),
    [project.estimatedTotalTco2e],
  );

  const areaFormatted = useMemo(
    () => Number(project.totalAreaHectares || 0).toLocaleString(),
    [project.totalAreaHectares],
  );

  const durationYears = useMemo(
    () => Math.floor((project.durationMonths || 12) / 12),
    [project.durationMonths],
  );

  return (
    <Link
      href={`/marketplace/${project.id}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#2CC295] rounded-3xl"
    >
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#2CC295]/8 hover:border-[#2CC295]/20 transition-all duration-300 cursor-pointer"
      >
        {/* ── Image block ──────────────────────────────────────────────── */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={imageUrl}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient overlay — reveals stats on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Top badges row */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
            {/* Type pill */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20"
              style={{
                backgroundColor: `${typeConfig.color}33`,
                color: "white",
              }}
            >
              <Leaf className="w-2.5 h-2.5" />
              {typeConfig.label}
            </span>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
              />
              {statusConfig.label}
            </span>
          </div>

          {/* Bottom overlay — project name + location */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-extrabold text-white text-lg leading-tight line-clamp-2 mb-1">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {project.region || project.location || "Africa"}
              </span>
            </div>
          </div>

          {/* Arrow icon — visible on hover */}
          <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-1 group-hover:translate-y-0">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <ArrowUpRight className="w-4 h-4 text-[#131927]" />
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="p-5">
          {/* Description */}
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
            {project.description ||
              "Transforming landscapes through science-backed, community-driven carbon sequestration."}
          </p>

          {/* Three key stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatChip
              label="tCO₂e"
              value={co2Formatted}
              icon={<TrendingUp className="w-3 h-3" />}
              color={typeConfig.color}
              bg={typeConfig.accent}
              textColor={typeConfig.lightText}
            />
            <StatChip
              label="Hectares"
              value={areaFormatted}
              icon={<Leaf className="w-3 h-3" />}
              color="#131927"
              bg="#f1f5f9"
              textColor="#334155"
            />
            <StatChip
              label="Duration"
              value={`${durationYears}yr`}
              icon={<Clock className="w-3 h-3" />}
              color="#131927"
              bg="#f1f5f9"
              textColor="#334155"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-4" />

          {/* Price + CTA row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                Price / Tonne
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#131927] leading-none">
                  $52
                </span>
                <span className="text-xs font-bold text-gray-400">tCO₂e</span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide text-white transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.03]"
              style={{
                backgroundColor: typeConfig.color,
                boxShadow: `0 4px 14px ${typeConfig.color}30`,
              }}
            >
              {project.status === "approved" ||
              project.status === "verified" ? (
                <>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Invest Now
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  View Details
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom accent line ────────────────────────────────────────── */}
        <div
          className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ backgroundColor: typeConfig.color }}
        />
      </motion.article>
    </Link>
  );
});

// ─── Stat Chip ────────────────────────────────────────────────────────────────

const StatChip = memo(function StatChip({
  label,
  value,
  icon,
  color,
  bg,
  textColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  textColor: string;
}) {
  return (
    <div
      className="rounded-xl px-2.5 py-2.5 text-center"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <p
        className="font-extrabold text-sm leading-none mb-0.5"
        style={{ color: textColor }}
      >
        {value}
      </p>
      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
});
