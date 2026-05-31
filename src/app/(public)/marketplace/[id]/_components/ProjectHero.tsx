"use client";

import {
  ArrowUpRight,
  ChevronRight,
  Clock,
  Info,
  Leaf,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProjectDetailProps {
  project: any;
  visual: any;
}

export default function ProjectHero({ project, visual }: ProjectDetailProps) {
  return (
    <div className="relative min-h-[90vh] bg-slate-900 overflow-hidden flex flex-col justify-end group">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={visual.heroImage}
          alt={project.name}
          fill
          priority
          className="object-cover opacity-60 grayscale-[0.2] group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      {/* ── Content Layer ── */}
      <div className="relative z-10 p-8 lg:p-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
              {project.projectType?.replace("_", " ")}
            </span>
            <span className="bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
              Registry: VERRA
            </span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter uppercase italic">
            {project.name.split(" ").map((word: string, i: number) => (
              <span key={i} className={i === 0 ? "text-emerald-500" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          <div className="flex flex-wrap items-center gap-8 border-l-4 border-emerald-500 pl-8">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                Geography
              </p>
              <p className="text-white font-bold flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-500" />{" "}
                {project.region}, {project.country}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                Vintage
              </p>
              <p className="text-white font-bold flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-500" /> 2024
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-emerald-400 font-black uppercase tracking-widest text-[11px] flex items-center gap-1.5">
                <ShieldCheck size={14} /> Institutionally Verified
              </p>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group/card">
            <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 group-hover/card:rotate-0 transition-transform duration-700">
              <Zap size={100} className="text-emerald-400" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  Market Price
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-6xl font-black text-white tracking-tighter">
                    $52.00
                  </h3>
                  <span className="text-slate-500 font-bold">USD</span>
                </div>
                <p className="text-slate-400 text-[11px] font-medium mt-1 uppercase italic">
                  per verified tCO2e reduction
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-slate-500 text-[9px] font-black uppercase mb-1">
                  Available Supply
                </p>
                <p className="text-xl font-black text-white tracking-tight">
                  28,420 t
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-slate-500 text-[9px] font-black uppercase mb-1">
                  Project Yield
                </p>
                <p className="text-xl font-black text-white tracking-tight">
                  4,800 t/yr
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-16 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group/btn shadow-xl shadow-emerald-900/20 active:scale-95"
            >
              Initiate Credit Acquisition
              <ArrowUpRight
                size={20}
                className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
              />
            </button>

            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Info size={12} className="text-emerald-500" /> Transactions
              anchored on Polygon Mainnet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
