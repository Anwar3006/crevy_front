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
    <div className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden bg-slate-900 group">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={visual.heroImage}
          alt={project.name}
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.2] transition-transform duration-[3000ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      {/* ── Content Layer ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-20 p-8 lg:grid-cols-2 lg:p-20">
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md">
              {project.projectType?.replace("_", " ")}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Registry: VERRA
            </span>
          </div>

          <h1 className="text-6xl font-black italic uppercase leading-none tracking-tighter text-white lg:text-8xl">
            {project.name.split(" ").map((word: string, i: number) => (
              <span key={i} className={i === 0 ? "text-emerald-500" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <div className="flex flex-wrap items-center gap-8 border-l-4 border-emerald-500 pl-8">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Geography
              </p>
              <p className="flex items-center gap-1.5 font-bold text-white">
                <MapPin size={14} className="text-emerald-500" />{" "}
                {project.region}, {project.country}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Vintage
              </p>
              <p className="flex items-center gap-1.5 font-bold text-white">
                <Clock size={14} className="text-emerald-500" /> 2024
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Status
              </p>
              <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-400">
                <ShieldCheck size={14} /> Institutionally Verified
              </p>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          <div className="relative space-y-10 overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-2xl group/card">
            <div className="absolute right-0 top-0 -rotate-12 p-8 opacity-10 transition-transform duration-700 group-hover/card:rotate-0">
              <Zap size={100} className="text-emerald-400" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                  Market Price
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-6xl font-black tracking-tighter text-white">
                    $52.00
                  </h3>
                  <span className="font-bold text-slate-500">USD</span>
                </div>
                <p className="mt-1 text-[11px] font-medium italic uppercase text-slate-400">
                  per verified tCO2e reduction
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 text-[9px] font-black uppercase text-slate-500">
                  Available Supply
                </p>
                <p className="text-xl font-black text-white tracking-tight">
                  28,420 t
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="mb-1 text-[9px] font-black uppercase text-slate-500">
                  Project Yield
                </p>
                <p className="text-xl font-black text-white tracking-tight">
                  4,800 t/yr
                </p>
              </div>
            </div>

            <Link
              href={`/marketplace/checkout?projectId=${project.id}`}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-[1.5rem] bg-emerald-600 font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-900/20 transition-all active:scale-95 hover:bg-emerald-500 group/btn"
            >
              Initiate Credit Acquisition
              <ArrowUpRight
                size={20}
                className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
              />
            </Link>

            <p className="flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <Info size={12} className="text-emerald-500" /> Transactions
              anchored on Polygon Mainnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
