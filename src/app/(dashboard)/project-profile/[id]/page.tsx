"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  FileText,
  Layers,
  Leaf,
  Loader2,
  MapPin,
  Radio,
  Ruler,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusPill: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  active: "bg-[#2cc295]/10 text-[#178a74]",
  suspended: "bg-red-50 text-red-600",
  closed: "bg-slate-100 text-slate-500",
};

const stagePill: Record<string, string> = {
  registration: "bg-amber-50 text-amber-700",
  active: "bg-blue-50 text-blue-700",
  verification: "bg-purple-50 text-purple-700",
  completed: "bg-[#2cc295]/10 text-[#178a74]",
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
  success: "bg-[#2cc295]/10 text-[#178a74]",
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
    enabled: !!id && activeTab === "mrv",
  });

  const { data: anchorRes, isLoading: loadingAnchors } = useQuery({
    queryKey: ["project-anchors", id],
    queryFn: () => ProjectService.getProjectAnchors(id),
    enabled: !!id && activeTab === "mrv",
  });

  const project = projectRes?.data;
  const documents = docsRes?.data ?? [];
  const verifications = verifRes?.data ?? [];
  const anchors = anchorRes?.data ?? [];

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
          href="/project-profile"
          className="text-sm text-[#2cc295] mt-2 block hover:underline"
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
        href="/project-profile"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#2cc295] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        All Projects
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {project.sector?.replace(/_/g, " ")}
              </span>
              <span className="text-slate-200">·</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {project.code}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#131927]">
              {project.name ?? project.code}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-semibold",
                  statusPill[project.projectStatus] ?? "",
                )}
              >
                {project.projectStatus}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-semibold",
                  stagePill[project.projectStage] ?? "",
                )}
              >
                {project.projectStage}
              </span>
            </div>
          </div>

          {/* Quick meta */}
          <div className="flex flex-wrap sm:flex-col gap-3 sm:items-end text-sm text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#2cc295]" />
              {project.region}, {project.country}
            </span>
            {project.totalAreaHectares && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-[#2cc295]" />
                {Number(project.totalAreaHectares).toFixed(1)} ha
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#2cc295]" />
              Started{" "}
              {new Date(project.startDate).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

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
                        ? "border-[#2cc295] bg-[#2cc295] text-white"
                        : current
                          ? "border-[#2cc295] bg-emerald-50 text-[#2cc295]"
                          : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wide",
                      current
                        ? "text-[#2cc295]"
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
      </div>

      {/* Tabs */}
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
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-[#2cc295] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
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
                <Tag className="h-4 w-4 text-[#2cc295]" />
                Practices Applied
              </h3>
              {project.projectTags?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.projectTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 border border-emerald-100 text-[#178a74] text-xs font-semibold px-3 py-1"
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
                <Leaf className="h-4 w-4 text-[#2cc295]" />
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
                        ? "border-[#2cc295]/30 bg-emerald-50/40"
                        : "border-slate-100 bg-white",
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        doc.isVerified ? "bg-[#2cc295]/20" : "bg-slate-100",
                      )}
                    >
                      {doc.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-[#178a74]" />
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
                            ? "bg-[#2cc295]/10 text-[#178a74]"
                            : "bg-amber-50 text-amber-600",
                        )}
                      >
                        {doc.isVerified ? "Verified" : "Pending"}
                      </span>
                      {doc.fileUrl && doc.fileUrl !== "/pending" && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[#2cc295] transition-colors"
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
              <Radio className="h-4 w-4 text-[#2cc295]" />
              Verification Results
            </h3>

            {loadingVerif ? (
              <div className="flex items-center gap-3 py-8 justify-center text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading MRV data…</span>
              </div>
            ) : verifications.length === 0 ? (
              <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 text-center">
                <Radio className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">
                  Awaiting first sensor reading
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Verification data will appear here once our dMRV partner's
                  sensors begin transmitting from your land. This typically
                  starts within 24–48 hours of sensor deployment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {verifications.map((v: any) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-slate-100 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-mono text-slate-400 truncate max-w-[260px]">
                        {v.verificationEventId}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase",
                          verificationStatusColor[v.verificationStatus] ?? "",
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
                          value: v.methodologyApplied?.split(" - ")[0] ?? "—",
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
                            className="text-xs font-mono text-[#2cc295] hover:underline truncate block mt-0.5"
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
      </Tabs>
    </div>
  );
}
