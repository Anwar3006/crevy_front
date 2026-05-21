"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRightLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Leaf,
  Loader2,
  MapPin,
  Radio,
  Ruler,
  ShieldCheck,
  Tag,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectService } from "@/lib/services/project-service";
import { StorageService } from "@/lib/services/storage-service";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusPill: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  active: "bg-myGreen/10 text-myDarkGreen",
  suspended: "bg-red-50 text-red-600",
  closed: "bg-slate-100 text-slate-500",
};

const stagePill: Record<string, string> = {
  registration: "bg-amber-50 text-amber-700",
  active: "bg-blue-50 text-blue-700",
  verification: "bg-purple-50 text-purple-700",
  completed: "bg-myGreen/10 text-myDarkGreen",
};

const pipelineSteps = [
  { key: "registration", label: "Registered", desc: "Project profile created" },
  { key: "active", label: "Active", desc: "Sensors deployed on land" },
  { key: "verification", label: "Verification", desc: "MRV data under review" },
  { key: "completed", label: "Completed", desc: "Credits issued & listed" },
];

const stageIndex: Record<string, number> = {
  registration: 0,
  active: 1,
  verification: 2,
  completed: 3,
};

const verificationStatusColor: Record<string, string> = {
  success: "bg-myGreen/10 text-myDarkGreen",
  flagged: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
};

const docTypeLabelMap: Record<string, string> = {
  land_ownership: "Land Ownership Proof",
  community_consent: "Community Consent Form",
  site_access_authorization: "Site Access Authorization",
  national_id: "National ID / Business Registration",
  site_photos: "Site Photographs",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { mutate: simulate, isPending: isSimulating } = useMutation({
    mutationFn: () => ProjectService.simulateMrv(id as string),
    onSuccess: () => {
      toast.success("MRV Pipeline simulation successful!");
      queryClient.invalidateQueries({
        queryKey: ["project-verifications", id],
      });
      queryClient.invalidateQueries({ queryKey: ["project-anchors", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Simulation failed.");
    },
  });

  const { data: projectRes, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: () => ProjectService.getProject(id),
    enabled: !!id,
  });

  const { data: docsRes, isLoading: loadingDocs } = useQuery({
    queryKey: ["project-docs", id],
    queryFn: () => ProjectService.listDocuments(id),
    enabled: !!id && activeTab === "documents",
  });

  const { data: verifRes, isLoading: loadingVerif } = useQuery({
    queryKey: ["project-verifications", id],
    queryFn: () => ProjectService.getProjectVerifications(id),
    enabled: !!id,
  });

  const { data: txRes, isLoading: loadingTx } = useQuery({
    queryKey: ["project-transactions", id],
    queryFn: () => ProjectService.getProjectTransactions(id),
    enabled: !!id && activeTab === "history",
  });

  const { data: anchorRes, isLoading: loadingAnchors } = useQuery({
    queryKey: ["project-anchors", id],
    queryFn: () => ProjectService.getProjectAnchors(id),
    enabled: !!id,
  });

  const project = projectRes?.data;
  const documents = docsRes?.data ?? [];
  const verifications = verifRes?.data ?? [];
  const anchors = anchorRes?.data ?? [];
  const transactions = txRes?.data ?? [];

  const totalSequestration = verifications
    .filter(
      (v: any) =>
        v.verificationStatus?.toLowerCase() === "success" &&
        v.netCreditsIssued != null,
    )
    .reduce((sum: number, v: any) => sum + Number(v.netCreditsIssued), 0);

  const formatSeq = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toFixed(1);
  };

  const hasAnchors = anchors.length > 0;
  const hasVerifications = verifications.length > 0;

  let auditPhaseCode = "P0";
  let auditPhaseStatus = "Pending";
  let auditPhaseDesc = "Awaiting Data";

  if (hasAnchors) {
    auditPhaseCode = "P2";
    auditPhaseStatus = "Verified";
    auditPhaseDesc = "On-Chain Anchor";
  } else if (hasVerifications) {
    auditPhaseCode = "P1";
    auditPhaseStatus = "Verified";
    auditPhaseDesc = "MRV Evaluated";
  }

  const methodology =
    verifications[0]?.methodologyApplied?.split(" - ")[0] || "VM0042";

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center gap-3 min-h-[60vh] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading project…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-slate-500">
        <p className="text-lg font-semibold">Project not found.</p>
        <Link
          href="/projects"
          className="text-sm text-myGreen mt-2 block hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const currentStageIdx = stageIndex[project.projectStage] ?? 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-myGreen transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        All Projects
      </Link>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#131927] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-white shadow-[0_30px_60px_-15px_rgba(19,25,39,0.3)]"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2CC295]/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2CC295]/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-[#2CC295]/20 border border-[#2CC295]/30 text-[#2CC295] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                  {project.sector?.replace(/_/g, " ")}
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2CC295] shadow-[0_0_8px_#2CC295]" />
                  <span className="text-white/60 font-mono text-[10px] tracking-widest">
                    {project.code}
                  </span>
                </div>
              </div>

              <h1
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                {project.name ?? project.code}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Activity className="w-5 h-5 text-[#2CC295]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                      Platform Status
                    </p>
                    <p className="text-sm font-bold uppercase tracking-wider text-[#2CC295]">
                      {project.projectStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-[#2CC295]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                      Verification Stage
                    </p>
                    <p className="text-sm font-bold uppercase tracking-wider">
                      {project.projectStage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:items-end">
              <div className="lg:text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 flex items-center lg:justify-end gap-2">
                  <MapPin className="w-3 h-3" />
                  Primary Location
                </p>
                <p
                  className="text-3xl font-extrabold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {project.region}
                  <span className="text-[#2CC295]/50 mx-2">/</span>
                  {project.country}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 min-w-[140px] backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Impact Area
                  </p>
                  <p className="text-2xl font-black">
                    {project.totalAreaHectares}{" "}
                    <span className="text-xs font-medium text-white/30">
                      HA
                    </span>
                  </p>
                </div>
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 min-w-[140px] backdrop-blur-sm group hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                    Issue Vintage
                  </p>
                  <p className="text-2xl font-black">
                    {anchors?.vintage ?? 2026}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Verification pipeline */}
      <div className="mt-8 pt-6 border-t border-slate-50">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
          Verification Pipeline
        </p>
        <div className="relative flex items-start">
          {/* connector line */}
          <div className="absolute left-4 top-4 h-0.5 w-[calc(100%-2rem)] bg-slate-100" />

          {pipelineSteps.map((step, idx) => {
            const done = idx < currentStageIdx;
            const current = idx === currentStageIdx;

            return (
              <div
                key={step.key}
                className="relative z-10 flex-1 flex flex-col items-center text-center gap-2 px-1"
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all",
                    done
                      ? "border-myGreen bg-myGreen text-white"
                      : current
                        ? "border-myGreen bg-emerald-50 text-myGreen"
                        : "border-slate-200 bg-white text-slate-400",
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide",
                    current
                      ? "text-myGreen"
                      : done
                        ? "text-slate-600"
                        : "text-slate-300",
                  )}
                >
                  {step.label}
                </span>
                <span className="hidden sm:block text-[9px] text-slate-400 leading-tight">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white border border-gray-100 rounded-2xl p-1 h-auto flex-wrap gap-1">
          {[
            { value: "overview", label: "Overview", icon: Layers },
            { value: "documents", label: "Documents", icon: FileText },
            { value: "mrv", label: "MRV Data", icon: Radio },
            { value: "history", label: "Credit History", icon: ArrowRightLeft },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-myGreen data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 pt-2">
          {/* Key Metric Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-myGreen" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Sequestration
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-black text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {formatSeq(totalSequestration)}
                </span>
                <span className="text-xs font-bold text-gray-400">tCO₂e</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p
                  className={cn(
                    "text-[10px] font-bold",
                    totalSequestration > 0 ? "text-[#178a74]" : "text-gray-400",
                  )}
                >
                  {totalSequestration > 0
                    ? "+ Verified"
                    : "Awaiting validation"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Permanence
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-black text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  A+
                </span>
                <span className="text-xs font-bold text-gray-400">Rating</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-blue-600">
                  High Integrity
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-amber-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Protocol
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xl font-black text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {methodology}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-amber-600">
                  {methodology === "VM0042"
                    ? "Verra Standard"
                    : "Gold Standard"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                Audit Phase
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-3xl font-black text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {auditPhaseCode}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {auditPhaseStatus}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-purple-600">
                  {auditPhaseDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">
                Project Description
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Practices + SDGs */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Practices */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-myGreen" />
                Practices Applied
              </h3>
              {project.projectTags?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.projectTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 border border-emerald-100 text-myDarkGreen text-xs font-semibold px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No practices added yet.
                </p>
              )}
            </div>

            {/* SDGs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-myGreen" />
                SDG Alignment
              </h3>
              {project.sdgs?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.sdgs.map((sdg: string) => (
                    <span
                      key={sdg}
                      className="rounded-full bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1"
                    >
                      SDG {sdg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No SDGs selected.</p>
              )}
            </div>
          </div>

          {/* Project details table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Project Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: "Project Code", value: project.code },
                {
                  label: "Project Type",
                  value: (project.projectType as string).replace(/_/g, " "),
                },
                {
                  label: "Sector",
                  value: (project.sector as string).replace(/_/g, " "),
                },
                { label: "Country", value: project.country },
                { label: "Region", value: project.region },
                { label: "GPS", value: project.gpsCoordinates ?? "—" },
                {
                  label: "Start Date",
                  value: new Date(project.startDate).toLocaleDateString(
                    "en-GB",
                  ),
                },
                {
                  label: "End Date",
                  value: project.endDate
                    ? new Date(project.endDate).toLocaleDateString("en-GB")
                    : "Open-ended",
                },
                {
                  label: "Land Area",
                  value: project.totalAreaHectares
                    ? `${Number(project.totalAreaHectares).toFixed(2)} ha`
                    : "—",
                },
                {
                  label: "Created",
                  value: new Date(project.createdAt).toLocaleDateString(
                    "en-GB",
                  ),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-slate-700 capitalize">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>

        {/* ── Documents ────────────────────────────────────────────────────── */}
        <TabsContent value="documents">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">
                Document Checklist
              </h3>
              <span className="text-xs text-slate-400">
                {documents.filter((d: any) => d.isVerified).length} /{" "}
                {documents.length} verified
              </span>
            </div>

            {loadingDocs ? (
              <div className="flex items-center gap-3 py-10 justify-center text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading documents…</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-6 text-center">
                <p className="text-sm font-medium text-amber-800">
                  No documents uploaded yet.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Please upload your required documents to proceed with
                  verification.
                </p>
                <Link
                  href={`/new-project`}
                  className="inline-block mt-3 text-xs font-bold text-amber-700 underline"
                >
                  Upload Documents
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 transition-all",
                      doc.isVerified
                        ? "border-myGreen/30 bg-emerald-50/40"
                        : "border-slate-100 bg-white",
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        doc.isVerified ? "bg-myGreen/20" : "bg-slate-100",
                      )}
                    >
                      {doc.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-myDarkGreen" />
                      ) : (
                        <FileText className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {docTypeLabelMap[doc.documentType] ?? doc.documentType}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {doc.fileName}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          doc.isVerified
                            ? "bg-myGreen/10 text-myDarkGreen"
                            : "bg-amber-50 text-amber-600",
                        )}
                      >
                        {doc.isVerified ? "Verified" : "Pending"}
                      </span>
                      {doc.fileUrl && doc.fileUrl !== "/pending" && (
                        <a
                          href={
                            StorageService.resolveUrl(doc.fileUrl) as string
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-myGreen transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── MRV Data ─────────────────────────────────────────────────────── */}
        <TabsContent value="mrv" className="space-y-4">
          {/* Verification results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-myGreen" />
              Verification Results
            </h3>

            {loadingVerif ? (
              <div className="flex items-center gap-3 py-8 justify-center text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading MRV data…</span>
              </div>
            ) : verifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-10 text-center"
              >
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Radio className="h-8 w-8 text-myGreen animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Awaiting Sensor Telemetry
                </h4>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  The dMRV pipeline is ready. In production, verification data
                  flows automatically from on-site IoT sensors. For this demo,
                  you can trigger a full pipeline simulation.
                </p>

                <Button
                  onClick={() => simulate()}
                  disabled={isSimulating}
                  className="mt-6 bg-myGreen hover:bg-myDarkGreen text-white rounded-xl px-6 py-6 h-auto font-bold shadow-lg shadow-myGreen/20 transition-all active:scale-95"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Simulating Pipeline...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5 fill-current" />
                      Simulate MRV Pipeline
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {verifications.map((v: any) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-slate-100 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-mono text-slate-400 truncate max-w-65">
                        {v.verificationEventId}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                          verificationStatusColor[
                            v.verificationStatus?.toLowerCase()
                          ] ?? "",
                        )}
                      >
                        {v.verificationStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Net Credits",
                          value:
                            v.netCreditsIssued != null
                              ? `${parseFloat(v.netCreditsIssued).toFixed(6)} tCO₂e`
                              : "—",
                        },
                        {
                          label: "AI Confidence",
                          value:
                            v.aiConfidenceScore != null
                              ? `${(parseFloat(v.aiConfidenceScore) * 100).toFixed(1)}%`
                              : "—",
                        },
                        { label: "Geo-fence", value: v.geoFenceStatus ?? "—" },
                        {
                          label: "Methodology",
                          value: v.methodologyApplied?.split(" - ") ?? "—",
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {v.isAnomalous && (
                      <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700 font-medium">
                        ⚠️ Anomaly detected — sensor may require maintenance.
                        Contact CraftedClimate support.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain anchors */}
          {anchors.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">
                Blockchain Proofs
              </h3>
              <div className="space-y-3">
                {anchors.map((a: any) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-100 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Batch {a.batchId} · Vintage {a.vintage}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        {a.network}
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          Transaction Hash
                        </p>
                        <p className="text-xs font-mono text-slate-600 truncate mt-0.5">
                          {a.transactionHash}
                        </p>
                      </div>
                      {a.auditUri && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400">
                            Audit URI (IPFS)
                          </p>
                          <a
                            href={a.auditUri.replace(
                              "ipfs://",
                              "https://ipfs.io/ipfs/",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-myGreen hover:underline truncate block mt-0.5"
                          >
                            {a.auditUri}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Credit History ────────────────────────────────────────────────── */}
        <TabsContent value="history" className="space-y-6 pt-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3
                  className="text-lg font-bold text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Transaction Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full chain of custody for credits issued by this project.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-emerald-50 text-[#178a74] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100/50">
                  Immutable
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Reference
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Entity
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Amount
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Date
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTx ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-myGreen mb-3" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Loading ledger...
                        </p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="max-w-xs mx-auto">
                          <p className="text-sm font-bold text-slate-400 mb-1">
                            No transactions recorded.
                          </p>
                          <p className="text-xs text-slate-400">
                            Issued credits will appear here once they are
                            purchased or transferred.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <span className="text-xs font-mono font-bold text-slate-600 tracking-tight">
                            {tx.transactionRef}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-slate-800">
                              {tx.buyerName}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                              Buyer
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-[#131927]">
                              {parseFloat(tx.quantity).toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              tCO₂e
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            @{tx.pricePerCredit} {tx.currencyCode}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-medium text-slate-500">
                            {format(
                              new Date(tx.transactionDate),
                              "MMM d, yyyy",
                            )}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                              tx.transactionStatus === "completed"
                                ? "bg-emerald-50 text-[#178a74]"
                                : "bg-amber-50 text-amber-700",
                            )}
                          >
                            <div
                              className={cn(
                                "w-1 h-1 rounded-full",
                                tx.transactionStatus === "completed"
                                  ? "bg-[#178a74]"
                                  : "bg-amber-600",
                              )}
                            />
                            {tx.transactionStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                End of verifiable ledger
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
