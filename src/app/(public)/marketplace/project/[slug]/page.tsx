"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Globe2,
  Info,
  Leaf,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";

/**
 * Marketplace Project Detail Page (Public Sales View)
 *
 * Siloed discovery interface designed for institutional buyers.
 * Anonymizes owner data and regionalizes spatial data to prevent disintermediation.
 */
export default function MarketplaceProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: projectRes, isLoading } = useQuery({
    queryKey: ["marketplace-project", slug],
    queryFn: () => ProjectService.getProjectBySlug(slug!),
    enabled: !!slug,
  });

  const project = projectRes?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-4xl font-serif text-slate-900 mb-4">
          Project Not Located
        </h1>
        <p className="text-slate-500 mb-8">
          The requested asset registry record could not be found.
        </p>
        <Button
          onClick={() => router.push("/marketplace")}
          className="bg-slate-900 text-white rounded-none uppercase font-bold tracking-widest text-xs px-10 h-14"
        >
          Return to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans selection:bg-slate-900 selection:text-white pb-32">
      {/* ── 1. CINEMATIC HERO SECTION ───────────────────────────────────────── */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              project.imageUrl ||
              "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1200"
            }
            alt={project.name}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-60 grayscale-[0.2] transition-transform duration-[5s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                {project.projectType?.replace(/_/g, " ")}
              </span>
              <span className="bg-white/5 backdrop-blur-md border border-white/10 text-white/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                Registry:{" "}
                {project.registryStatus?.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85] uppercase italic">
              {project.name.split(" ").map((word: string, i: number) => (
                <span key={i} className={i === 0 ? "text-emerald-500" : ""}>
                  {word}
                  <br className="hidden lg:block" />
                </span>
              ))}
            </h1>

            <div className="flex flex-wrap items-center gap-12 pt-8 border-l-2 border-emerald-500 pl-8">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Regional Context
                </p>
                <p className="text-white font-black uppercase tracking-tight flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" />{" "}
                  {project.region}, {project.country}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Institutional Status
                </p>
                <p className="text-emerald-400 font-black uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck size={14} /> Technology Verified
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. ACQUISITION TERMINAL ────────────────────────────────────────── */}
      <section className="container mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scientific Proof & Narrative */}
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white border border-slate-200 p-12 lg:p-20 shadow-2xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-10 border-b border-slate-100 pb-4">
                Impact Narrative
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-3xl font-serif text-slate-900 leading-tight mb-8">
                  Transforming the {project.region} through high-fidelity{" "}
                  {project.projectType?.replace(/_/g, " ")} protocols.
                </p>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  {project.description ||
                    "This project implements rigorous ecological restoration and monitoring. Utilizing the CraftedClimate dMRV framework, we ensure that every metric tonne sequestered is backed by immutable telemetry and cryptographic signatures."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                {[
                  {
                    label: "Total Area",
                    val: project.totalAreaHectares,
                    unit: "HA",
                  },
                  { label: "Annual Yield", val: "4,200", unit: "tCO2e" },
                  { label: "Vintage", val: "2024", unit: "EST" },
                  { label: "SDG Tags", val: "13, 15", unit: "#" },
                ].map((m, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {m.label}
                    </p>
                    <p className="text-2xl font-mono font-black text-slate-900 tracking-tighter">
                      {m.val}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">
                        {m.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific Trust Module */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <Cpu
                    className="text-emerald-600"
                    size={32}
                    strokeWidth={1.5}
                  />
                  <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                    99.8% Conf.
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  AI Verification Proof
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  CraftedClimate Worker 2 has validated this batch against
                  historical baselines with extreme certainty.
                </p>
              </div>
              <div className="bg-slate-900 p-10 space-y-6 text-white shadow-2xl">
                <div className="flex justify-between items-start">
                  <Lock
                    className="text-emerald-400"
                    size={32}
                    strokeWidth={1.5}
                  />
                  <span className="px-3 py-1 border border-emerald-400/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                    SECURE
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Hardware Integrity
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Cryptographic hardware signatures confirm raw telemetry
                  originated from verified on-site NDIR sensors.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Pricing & Acquisition */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-slate-950 p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                <Globe2 size={200} />
              </div>

              <div className="relative z-10 space-y-2">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Institutional Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-mono font-black tracking-tighter italic">
                    $52.00
                  </span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    USD
                  </span>
                </div>
                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest italic">
                  Per verified carbon unit (tCO2e)
                </p>
              </div>

              <div className="relative z-10 pt-10 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Inventory Status</span>
                  <span className="text-emerald-400">● Liquid</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Available units</span>
                  <span className="font-mono">28,420 t</span>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <Button
                  asChild
                  className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-95 group/btn"
                >
                  <Link href={`/marketplace/checkout?projectId=${project.id}`}>
                    Initiate Acquisition
                    <ArrowUpRight
                      size={20}
                      className="ml-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                    />
                  </Link>
                </Button>
                <p className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest leading-relaxed">
                  Transactions executed via smart-contracts and anchored on
                  Polygon PoS.
                </p>
              </div>
            </div>

            {/* Anonymized Originator */}
            <div className="mt-8 p-8 border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Asset Originator
                </p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                  Originator {project.code?.split("-")[1] || "GH"}-
                  {project.id.slice(0, 4).toUpperCase()}
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border border-slate-100 italic font-serif text-sm">
                ?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SPATIAL OBFUSCATION (Regional Map) ────────────────────────────── */}
      <section className="container mx-auto px-6 py-32 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-4">
              Spatial Context
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 italic uppercase tracking-tighter leading-none">
              Deployment <br /> Region.
            </h3>
          </div>
          <p className="text-slate-500 max-w-sm text-sm font-light leading-relaxed">
            To preserve supply-side security and prevent disintermediation,
            precise plot coordinates are restricted to institutional
            administrators. Registry participants receive regionalized spatial
            data.
          </p>
        </div>

        <div className="h-[500px] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center group">
          {/* Visual Placeholder for regionalized map */}
          <div className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-[2s]">
            <Image
              src="https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Regional Context"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 w-64 h-64 border-4 border-emerald-500/50 rounded-full bg-emerald-500/10 backdrop-blur-3xl flex items-center justify-center animate-pulse">
            <div className="text-center">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Active Capture Zone
              </p>
              <p className="text-2xl font-serif text-slate-900 font-bold italic">
                {project.region}
              </p>
            </div>
          </div>
          <div className="absolute bottom-10 left-10 z-10 bg-white p-6 shadow-2xl border border-slate-200 space-y-2">
            <p className="text-[9px] font-black uppercase text-slate-400">
              Telemetry Proof
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 uppercase">
                Live dMRV Stream Active
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
