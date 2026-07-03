"use client";

import {
  ArrowUpRight,
  Clock,
  Info,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectDetailProps {
  project: any;
  visual: any;
}

export default function ProjectHero({ project, visual }: ProjectDetailProps) {
  return (
    <div className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden bg-background group border-b border-slate-900">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={visual.heroImage}
          alt={project.name}
          fill
          priority
          className="object-cover mix-blend-luminosity opacity-50 transition-transform duration-[3000ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* ── Content Layer ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-16 p-8 lg:grid-cols-2 lg:p-20">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-slate-700 bg-secondary/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand backdrop-blur-md rounded-none">
              {project.projectType?.replace("_", " ")}
            </span>
            <span className="border border-slate-800 bg-background/80 px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md rounded-none">
              Registry: VERRA
            </span>
          </div>

          <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-white lg:text-7xl">
            {project.name.split(" ").map((word: string, i: number) => (
              <span key={i} className={i === 0 ? "text-brand" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <div className="flex flex-wrap items-center gap-8 border-l-2 border-brand pl-8">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Geography
              </p>
              <p className="flex items-center gap-2 font-bold text-white uppercase text-sm tracking-wide">
                <MapPin size={14} className="text-brand" /> {project.region},{" "}
                {project.country}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Vintage
              </p>
              <p className="flex items-center gap-2 font-mono font-bold text-white text-sm">
                <Clock size={14} className="text-brand" /> 2024
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </p>
              <p className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-brand">
                <ShieldCheck size={14} /> Institutionally Verified
              </p>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          <div className="relative space-y-8 overflow-hidden border border-slate-800 bg-secondary/90 p-10 shadow-2xl backdrop-blur-xl group/card rounded-none">
            <div className="absolute right-0 top-0 p-8 opacity-5 transition-transform duration-700 group-hover/card:rotate-6">
              <Zap size={120} className="text-brand" />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  Market Price
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-mono font-bold tracking-tight text-white tabular-nums">
                    $52.00
                  </h3>
                  <span className="font-mono font-bold text-muted-foreground text-sm">
                    USD
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  per verified tCO2e reduction
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="border border-slate-800 bg-background p-4 rounded-none">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Available Supply
                </p>
                <p className="text-lg font-mono font-bold text-white tracking-tight tabular-nums">
                  28,420 t
                </p>
              </div>
              <div className="border border-slate-800 bg-background p-4 rounded-none">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Project Yield
                </p>
                <p className="text-lg font-mono font-bold text-white tracking-tight tabular-nums">
                  4,800 t/yr
                </p>
              </div>
            </div>

            <Link
              href={`/marketplace/checkout?projectId=${project.id}`}
              className="flex h-16 w-full items-center justify-center gap-3 bg-brand font-bold uppercase tracking-[0.2em] text-foreground text-xs shadow-xl transition-colors hover:bg-white rounded-none group/btn relative z-10"
            >
              Initiate Credit Acquisition
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
              />
            </Link>

            <p className="flex items-center justify-center gap-2 text-center text-[9px] font-mono uppercase tracking-widest text-muted-foreground relative z-10">
              <Info size={12} className="text-brand" /> Transactions anchored on
              Polygon Mainnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
