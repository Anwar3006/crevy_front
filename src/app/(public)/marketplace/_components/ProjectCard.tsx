"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Leaf,
  MapPin,
  Ruler,
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

  const _durationYears = useMemo(
    () => Math.floor((project.durationMonths || 12) / 12),
    [project.durationMonths],
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-[#2CC295] rounded-3xl"
    >
      <motion.article
        // whileHover={{ y: -6, shadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-3xl overflow-hidden border border-gray-100/80 shadow-sm hover:border-[#2CC295]/30 transition-all duration-300"
      >
        {/* ── Image block ──────────────────────────────────────────────── */}
        <div className="relative h-60 overflow-hidden">
          <Image
            src={imageUrl}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131927] via-[#131927]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Top badges row */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {/* Type pill */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-md border border-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              <Leaf className="w-3 h-3 text-[#2CC295]" />
              {typeConfig.label}
            </span>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border backdrop-blur-md shadow-sm ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
              />
              {statusConfig.label}
            </span>
          </div>

          {/* Bottom overlay — project name + location */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <motion.h3
              className="font-extrabold text-white text-xl leading-tight line-clamp-2 mb-2 group-hover:text-[#2CC295] transition-colors"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {project.name}
            </motion.h3>
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#2CC295]" />
              <span className="truncate uppercase tracking-wider">
                {project.region || project.location || "Africa"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-5 min-h-[2.5rem] font-medium">
            {project.description ||
              "High-integrity carbon sequestration through verified nature-based solutions and community empowerment."}
          </p>

          {/* Three key stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatChip
              label="Removal"
              value={co2Formatted}
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              color="#2CC295"
              bg="#2CC29508"
              textColor="#178a74"
            />
            <StatChip
              label="Hectares"
              value={areaFormatted}
              icon={<Ruler className="w-3.5 h-3.5" />}
              color="#131927"
              bg="#f8fafc"
              textColor="#334155"
            />
            <StatChip
              label="Vintage"
              value="2024"
              icon={<Clock className="w-3.5 h-3.5" />}
              color="#131927"
              bg="#f8fafc"
              textColor="#334155"
            />
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                Market Price
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl font-black text-[#131927] leading-none"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  $
                  {project.pricePerCredit
                    ? parseFloat(project.pricePerCredit).toFixed(2)
                    : "0.00"}
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  / tCO₂e
                </span>
              </div>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter italic mt-1">
                Vol:{" "}
                {project.availableCredits
                  ? parseFloat(project.availableCredits).toLocaleString()
                  : "0"}{" "}
                t
              </p>
            </div>

            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] text-white transition-all duration-500 group-hover:gap-3"
              style={{
                backgroundColor: "#131927",
                boxShadow: "0 10px 20px -5px rgba(19,25,39,0.2)",
              }}
            >
              {project.status === "approved" ||
              project.status === "verified" ? (
                <>
                  <BadgeCheck className="w-4 h-4 text-[#2CC295]" />
                  Invest Now
                </>
              ) : (
                <>
                  View Project
                  <ArrowUpRight className="w-4 h-4 text-[#2CC295] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </div>
          </div>
        </div>
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
