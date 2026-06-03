"use client";

import { motion } from "framer-motion";
import {
  Beaker,
  CheckCircle2,
  Cpu,
  FileSearch,
  Layers,
  LineChart,
  Microscope,
  ShieldCheck,
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <MethodologyHero />
      <ScientificFoundation />
      <DMRVWorkflow />
      <StandardCompliance />
    </div>
  );
}

function MethodologyHero() {
  return (
    <section className="bg-myBlue pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8"
        >
          <Beaker size={14} className="text-emerald-400" />
          <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
            Scientific Protocol v2.4
          </span>
        </motion.div>
        <h1
          className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          The Science of <br />
          <span className="text-emerald-400">Integrity</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
          Deep dive into Crevy&apos;s proprietary dMRV (digital Monitoring,
          Reporting, and Verification) framework. We combine satellite imagery,
          AI, and ground-truth sensors.
        </p>
      </div>
    </section>
  );
}

function ScientificFoundation() {
  const pillars = [
    {
      icon: Layers,
      title: "Multimodal Data",
      desc: "We ingest data from Sentinel-2, LiDAR, and local IoT sensors.",
    },
    {
      icon: Cpu,
      title: "AI Verification",
      desc: "Neural networks detect biomass changes and verify land usage.",
    },
    {
      icon: Microscope,
      title: "Peer Reviewed",
      desc: "All methodologies are validated by independent climate scientists.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {pillars.map((p, i) => (
            <div key={i} className="space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100 shadow-inner">
                <p.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {p.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DMRVWorkflow() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-16 text-center">
          Continuous Verification Loop
        </h2>
        <div className="space-y-8">
          {[
            {
              step: "01",
              label: "Baseline Establishment",
              desc: "GPS mapping and historical biomass analysis.",
            },
            {
              step: "02",
              label: "Real-time Monitoring",
              desc: "Monthly satellite sweeps and sensor updates.",
            },
            {
              step: "03",
              label: "Automated Reporting",
              desc: "Issuance of dMRV reports on the blockchain.",
            },
            {
              step: "04",
              label: "Credit Minting",
              desc: "Issuance of verified credits only after successful audit.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <span className="text-4xl font-black text-emerald-500/20 italic">
                {s.step}
              </span>
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-wider mb-1">
                  {s.label}
                </h4>
                <p className="text-slate-500 text-sm font-medium">{s.desc}</p>
              </div>
              <CheckCircle2 className="ml-auto text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StandardCompliance() {
  return (
    <section className="py-24 bg-myBlue text-white text-center">
      <div className="container mx-auto px-6">
        <ShieldCheck size={64} className="mx-auto text-emerald-400 mb-8" />
        <h2 className="text-4xl font-black uppercase mb-6 italic">
          Built for Global Standards
        </h2>
        <p className="max-w-xl mx-auto text-slate-400 font-medium mb-12">
          Compliant with VCS (Verra), Gold Standard, and ISO 14064. We ensure
          every credit issued meets the highest liquidity and trust
          requirements.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest">
            ISO 14064
          </span>
          <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest">
            VCS Verra
          </span>
          <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest">
            GHG Protocol
          </span>
        </div>
      </div>
    </section>
  );
}
