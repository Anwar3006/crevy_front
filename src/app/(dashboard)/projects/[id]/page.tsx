"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Activity,
  ChevronLeft,
  Clock,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  History,
  Info,
  Layers,
  Leaf,
  Loader2,
  Lock,
  Map as MapIcon,
  MapPin,
  MoreVertical,
  Radio,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/use-user";
import { ProjectService } from "@/lib/services/project-service";

// ─── Administrative Oversight Visual System ──────────────────────────────────

export default function ProjectAdministrativeDossier() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isPending } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. RBAC Guard: Strictly Administrative
  const isAuthorized =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "mrv_admin";

  const { data: projectRes, isLoading: loadingProject } = useQuery({
    queryKey: ["admin-project-detail", id],
    queryFn: () => ProjectService.getProject(id as string),
    enabled: !!id && !!user,
  });

  const { data: verifRes } = useQuery({
    queryKey: ["project-telemetry", id],
    queryFn: () => ProjectService.getProjectVerifications(id as string),
    enabled: !!id,
  });

  const project = projectRes?.data;
  const verifications = verifRes?.data ?? [];

  // Redirect if not authorized
  useEffect(() => {
    if (!isPending && !isAuthorized) {
      router.push("/dashboard");
      toast.error("Access Restricted", {
        description:
          "You do not have administrative clearance for this dossier.",
      });
    }
  }, [isAuthorized, isPending, router]);

  if (loadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-slate-950 selection:text-white pb-32">
      {/* ── 1. MEDIA & GIS CONTROL CENTER (Split Screen) ────────────────────── */}
      <section className="h-[70vh] w-full grid grid-cols-1 lg:grid-cols-2 border-b border-slate-200">
        {/* Left: High-Res Visual Ledger */}
        <div className="relative bg-slate-100 overflow-hidden border-r border-slate-200 group">
          <div className="absolute top-8 left-8 z-20">
            <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Visual Proof: Active
              </span>
            </div>
          </div>
          <Image
            src={
              project.imageUrl ||
              "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1200"
            }
            alt="On-ground proof"
            fill
            className="object-cover transition-transform duration-[10s] group-hover:scale-110"
          />
        </div>

        {/* Right: Precise GIS Control (Satellite) */}
        <div className="relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950 opacity-40 mix-blend-multiply pointer-events-none" />
          <div className="absolute top-8 right-8 z-20 space-y-4">
            <div className="bg-slate-950/90 border border-white/10 px-6 py-4 space-y-2">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                Pinpoint Coordinates
              </p>
              <p className="text-xs font-mono text-white/70">
                {project.gpsCoordinates || "Lat: 6.1245, Lng: -0.3421"}
              </p>
            </div>
          </div>

          {/* Placeholder for Map component with precise polygons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 border border-emerald-500/30 rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin
                  className="text-emerald-500"
                  size={48}
                  strokeWidth={1}
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 z-20 flex gap-2">
            <button
              type="button"
              className="px-6 py-2 bg-white text-slate-900 font-black uppercase tracking-widest text-[9px]"
            >
              Satellite View
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-slate-950 text-white/40 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors"
            >
              Boundary Layer
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. IDENTITY & CORE METRICS ──────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-10 py-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <Link
                href="/projects"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft size={12} /> Back to Asset Registry
              </Link>
              <h1 className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tighter leading-none italic uppercase">
                Administrative <br /> Dossier.
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-200 pt-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <UserCheck size={14} className="text-emerald-600" />{" "}
                  Originator Unmasked
                </p>
                <div className="bg-slate-50 p-6 space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">
                      Legal Name
                    </p>
                    <p className="font-bold text-slate-900 uppercase">
                      Emmanuel Osei-Wusu
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">
                      Contact Terminal
                    </p>
                    <p className="text-sm font-mono text-slate-600 font-bold">
                      +233 24 556 0991
                    </p>
                    <p className="text-sm font-mono text-slate-600">
                      emmanuel.osei@originate.gh
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-none text-[9px] font-black uppercase tracking-widest rounded-none">
                    KYC: Verified
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600" />{" "}
                  Registry Parameters
                </p>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Registry Status
                    </span>
                    <span className="text-[10px] font-black text-slate-900 uppercase">
                      {project.registryStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Lifecycle Stage
                    </span>
                    <span className="text-[10px] font-black text-slate-900 uppercase">
                      {project.projectStage}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      System Integrity
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">
                      Secure
                    </span>
                  </div>
                  <Button className="w-full h-12 rounded-none bg-slate-900 text-white font-black uppercase tracking-widest text-[9px]">
                    Modify Metadata
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats Cards */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-slate-950 p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity size={120} />
              </div>
              <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-6">
                Net Credits Issued
              </p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-mono font-black tracking-tighter italic">
                  2.84k
                </span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  tCO2e
                </span>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500 italic">Settlement Delta</span>
                <span className="text-emerald-400">+14% Growth</span>
              </div>
            </div>

            <div className="p-8 border-2 border-slate-100 space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Scientific Confidence
              </p>
              <div className="flex items-center gap-4">
                <div className="h-2 flex-1 bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: "96.2%" }}
                  />
                </div>
                <span className="text-[11px] font-black text-slate-900 font-mono italic">
                  96.2%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                Verification protocol anchored against historical biomass
                baseline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. RAW TELEMETRY MATRIX ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-32">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-slate-900 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Radio className="text-emerald-600" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                  Real-Time Integrity Stream
                </span>
              </div>
              <h2 className="text-4xl font-serif text-slate-900 italic uppercase tracking-tighter leading-none">
                Telemetry <br /> Matrix.
              </h2>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="rounded-none border-slate-300 bg-white text-[10px] font-black uppercase h-12 px-8"
              >
                Export Sensor Logs
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white border border-slate-200 p-12 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10 italic">
                Biomass Density Ingestion (12 Month Interval)
              </p>
              <div className="h-[400px] w-full">
                {isMounted && (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minHeight={400}
                  >
                    <AreaChart
                      data={[
                        { month: "Jan", val: 420 },
                        { month: "Feb", val: 450 },
                        { month: "Mar", val: 510 },
                        { month: "Apr", val: 480 },
                        { month: "May", val: 540 },
                        { month: "Jun", val: 620 },
                        { month: "Jul", val: 680 },
                        { month: "Aug", val: 710 },
                        { month: "Sep", val: 690 },
                        { month: "Oct", val: 740 },
                        { month: "Nov", val: 820 },
                        { month: "Dec", val: 860 },
                      ]}
                    >
                      <defs>
                        <linearGradient
                          id="colorOversight"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#020617"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#020617"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fontWeight: 900,
                          fill: "#94a3b8",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0px",
                          border: "1px solid #e2e8f0",
                          fontFamily: "monospace",
                          fontSize: "10px",
                          textTransform: "uppercase",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#020617"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorOversight)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-950 p-10 text-white shadow-2xl">
                <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-6">
                  Hardware Integrity
                </p>
                <div className="space-y-6">
                  {[
                    { label: "Sensor ID", val: "CC-GH-082-A" },
                    { label: "Firmware", val: "v3.1.2-stable" },
                    { label: "Signal Strength", val: "-84 dBm" },
                    { label: "Battery Status", val: "Optimal (4.2V)" },
                  ].map((i, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-white/5 pb-2"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {i.label}
                      </span>
                      <span className="text-[10px] font-black font-mono">
                        {i.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 border border-slate-200 bg-white">
                <ShieldAlert className="text-slate-900 mb-6" size={24} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-4">
                  Anomaly Detection
                </p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  The AI engine currently reports zero critical deviations.
                  Baseline consistency is within 1.2% tolerance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. IMMUTABLE AUDIT LOG ──────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-10 py-32">
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <History className="text-slate-400" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Chronological System Integrity
              </span>
            </div>
            <h2 className="text-4xl font-serif text-slate-900 italic uppercase tracking-tighter leading-none">
              Administrative <br /> History.
            </h2>
          </div>
          <p className="text-slate-500 text-sm italic font-medium">
            Full audit trail of institutional actions.
          </p>
        </div>

        <div className="space-y-12 max-w-4xl">
          {[
            {
              actor: "Kwame Ofori",
              action: "Updated Project Status",
              date: "May 20, 2026",
              details: "DRAFT → ACTIVE",
              icon: Activity,
            },
            {
              actor: "System Protocol",
              action: "dMRV Payload Ingested",
              date: "May 18, 2026",
              details: "Verified 1,200 tCO2e",
              icon: Database,
            },
            {
              actor: "Abena Darko",
              action: "Modified Metadata",
              date: "May 15, 2026",
              details: "Revised methodology to VM0042",
              icon: FileText,
            },
            {
              actor: "Emmanuel Asiedu",
              action: "Authorized Onboarding",
              date: "May 12, 2026",
              details: "KYC Finalized",
              icon: ShieldCheck,
            },
          ].map((log, i) => (
            <div key={i} className="flex gap-12 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                  <log.icon size={18} />
                </div>
                {i < 3 && <div className="w-[1px] h-20 bg-slate-100 mt-2" />}
              </div>
              <div className="flex-1 space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">
                    {log.action}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                    {log.date}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase bg-slate-50 p-4 border border-slate-100 inline-block">
                  {log.details}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Executed by:{" "}
                  <span className="text-slate-900">{log.actor}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
