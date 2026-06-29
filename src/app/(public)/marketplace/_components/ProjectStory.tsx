"use client";

import {
  BadgeCheck,
  ExternalLink,
  Globe,
  Layers,
  Shield,
  Sprout,
  Target,
} from "lucide-react";

interface ProjectStoryProps {
  project: any;
}

export default function ProjectStory({ project }: ProjectStoryProps) {
  const sdgs = [
    { id: 13, name: "Climate Action", color: "#3F7E44" },
    { id: 15, name: "Life on Land", color: "#56C02B" },
    { id: 8, name: "Decent Work", color: "#A21942" },
  ];

  const practices = [
    "Direct Air Capture Integration",
    "Satellite-Based Biomass Verification",
    "Community-Led Seed Harvesting",
    "Verified Permanence (>100 Years)",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 py-20 px-6 lg:px-20 max-w-7xl mx-auto">
      {/* ── Left: Project Narrative ── */}
      <div className="lg:col-span-2 space-y-16">
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-6 flex items-center gap-3">
            <Globe size={14} /> Global Impact Narrative
          </h3>
          <p className="text-2xl font-extrabold text-slate-900 leading-relaxed italic border-l-4 border-brand pl-8">
            "
            {project.description ||
              "Transforming degraded landscapes into high-integrity carbon sinks through community-led reforestation and AI-driven telemetry."}
            "
          </p>
          <div className="mt-8 text-slate-600 font-light text-lg leading-relaxed space-y-6">
            <p>
              This initiative represents the frontier of nature-based solutions.
              By integrating high-resolution satellite imagery with ground-level
              IoT sensors, we provide institutional buyers with unprecedented
              visibility into the sequestration lifecycle.
            </p>
            <p>
              Our methodology (VM0047) is anchored in additionality, ensuring
              that every credit purchased represents a genuine, permanent
              reduction in atmospheric CO2 that would not have occurred without
              institutional investment.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-8 flex items-center gap-3">
            <Layers size={14} /> Regenerative Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practices.map((practice, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 p-6 rounded-none flex items-center gap-4 group hover:border-slate-900 transition-colors"
              >
                <div className="w-10 h-10 bg-slate-950 rounded-none flex items-center justify-center text-brand shrink-0">
                  <Sprout size={18} />
                </div>
                <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                  {practice}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Right: Compliance & Proof Cards ── */}
      <div className="space-y-12">
        <section className="bg-white border border-slate-200 rounded-none p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-5 group-hover:scale-105 transition-transform duration-700">
            <Target size={120} />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            SDG Contribution
          </h3>
          <div className="flex flex-wrap gap-4">
            {sdgs.map((sdg) => (
              <div
                key={sdg.id}
                className="w-16 h-16 rounded-none flex flex-col items-center justify-center text-white shadow-sm cursor-help"
                style={{ backgroundColor: sdg.color }}
              >
                <span className="text-xl font-mono font-bold">{sdg.id}</span>
                <span className="text-[7px] font-bold uppercase text-center px-1 leading-tight">
                  {sdg.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 rounded-none p-8 text-white shadow-xl relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Shield size={60} className="text-brand" />
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-8">
            Verification Audit
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                dMRV Status
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-brand flex items-center gap-2">
                <BadgeCheck size={14} /> Continuous
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Inference Confidence
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-white tabular-nums">
                98.4%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Audit Ledger
              </span>
              <button
                type="button"
                onClick={() => alert("View Explorer")}
                className="text-[10px] font-mono font-bold uppercase text-brand flex items-center gap-2 hover:underline"
              >
                View Explorer <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
