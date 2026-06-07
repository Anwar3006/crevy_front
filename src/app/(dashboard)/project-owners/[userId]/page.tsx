"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ChevronLeft,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type ProjectOwnerRecord,
  ProjectOwnerService,
} from "@/lib/services/project-owner-service";
import { cn } from "@/lib/utils";

// ─── Editorial Configs ────────────────────────────────────────────────────────

const verificationConfig: Record<
  string,
  { label: string; className: string; bg: string; dot: string }
> = {
  pending: {
    label: "Pending KYC",
    className: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  verified: {
    label: "Verified Entity",
    className: "text-emerald-800",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "KYC Failed",
    className: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

const getInitials = (first?: string, last?: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "PO";

// Editorial Mono-spaced Info Row
function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-200 last:border-0">
      <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center">
        {label}
      </div>
      <div
        className={cn(
          "col-span-8 text-sm font-semibold text-slate-900",
          mono && "font-mono",
        )}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ProjectOwnerDetailPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project-owner", userId],
    queryFn: () => ProjectOwnerService.getProjectOwner(userId),
    enabled: !!userId,
  });

  const owner: ProjectOwnerRecord | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
          Extracting KYC Dossier...
        </span>
      </div>
    );
  }

  if (isError || !owner) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center text-center">
        <XCircle className="h-10 w-10 text-red-500 mb-4" />
        <p className="font-serif text-xl text-slate-900 mb-2">
          Dossier Retrieval Failed
        </p>
        <Link
          href="/project-owners"
          className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 border-b border-slate-900 pb-0.5"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const vc =
    verificationConfig[owner.verificationStatus] ?? verificationConfig.pending;

  return (
    <div className="animate-in fade-in duration-700 pb-24">
      {/* ── Editorial Header ── */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-12">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          <Link
            href="/project-owners"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8"
          >
            <ChevronLeft className="w-3 h-3" /> Personnel Roster
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center text-2xl font-serif">
                {getInitials(owner.firstName, owner.lastName)}
              </div>
              <div>
                <h1 className="text-4xl font-serif text-slate-900 tracking-tight leading-none mb-3">
                  {owner.firstName} {owner.lastName}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                    ID: {owner.code}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border",
                      vc.bg,
                      vc.className,
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", vc.dot)}
                    ></span>
                    {vc.label}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/project-owners/${userId}/projects`}
              className="shrink-0 bg-slate-900 text-white hover:bg-emerald-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              View Asset Portfolio <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid md:grid-cols-12 gap-12">
          {/* ── Left Column: Core Data ── */}
          <div className="md:col-span-8 space-y-12">
            {/* Identity Register */}
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-3 mb-6">
                Identity & Contact Register
              </h2>
              <div className="bg-white border border-slate-200 px-8 py-2">
                <InfoRow
                  label="Legal Name"
                  value={`${owner.firstName} ${owner.lastName}`}
                />
                <InfoRow label="Email Address" value={owner.email} mono />
                <InfoRow
                  label="Primary Phone"
                  value={owner.contactNumber}
                  mono
                />
                <InfoRow
                  label="Jurisdiction"
                  value={owner.countryOfOperation}
                />
                <InfoRow
                  label="Registry Entry"
                  value={new Date(owner.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  mono
                />
              </div>
            </section>

            {/* Financial Routing */}
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-3 mb-6">
                Financial Routing Instructions
              </h2>

              {!owner.momoDetails && !owner.bankDetails && (
                <div className="border border-slate-200 bg-slate-50 p-8 text-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  No payout vectors established.
                </div>
              )}

              {owner.momoDetails && (
                <div className="bg-white border border-slate-200 p-8 mb-6 relative">
                  <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    Mobile Money Vector
                  </div>
                  <div className="grid grid-cols-2 gap-8 mt-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Network Provider
                      </p>
                      <p className="font-mono text-slate-900 font-bold text-sm">
                        {owner.momoDetails.network}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Routing Number
                      </p>
                      <p className="font-mono text-slate-900 font-bold text-sm">
                        {owner.momoDetails.number}
                      </p>
                    </div>
                    {owner.momoDetails.accountName && (
                      <div className="col-span-2 pt-4 border-t border-slate-100">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Registered Account Name
                        </p>
                        <p className="font-serif text-slate-900 text-lg">
                          {owner.momoDetails.accountName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {owner.bankDetails && (
                <div className="bg-white border border-slate-200 p-8 relative">
                  <div className="absolute top-0 right-0 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    Institution Transfer Vector
                  </div>
                  <div className="grid grid-cols-2 gap-8 mt-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Bank Name
                      </p>
                      <p className="font-mono text-slate-900 font-bold text-sm">
                        {owner.bankDetails.bankName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Account Hash
                      </p>
                      <p className="font-mono text-slate-900 font-bold text-sm">
                        {owner.bankDetails.accountNumber}
                      </p>
                    </div>
                    {owner.bankDetails.accountName && (
                      <div className="col-span-2 pt-4 border-t border-slate-100">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Beneficiary Name
                        </p>
                        <p className="font-serif text-slate-900 text-lg">
                          {owner.bankDetails.accountName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column: Ledger Meta ── */}
          <div className="md:col-span-4 space-y-8">
            {/* Status Panel */}
            <div className={cn("border p-6", vc.bg)}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-3 border-b border-slate-900/10 pb-2">
                Compliance Status
              </p>
              <p className={cn("font-serif text-xl mb-2", vc.className)}>
                {vc.label}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                {owner.verificationStatus === "pending" &&
                  "Entity is currently under review by compliance officers. Awaiting manual KYC approval."}
                {owner.verificationStatus === "verified" &&
                  "Entity identity and operational jurisdictions have been fully verified and cryptographic proofs anchored."}
                {owner.verificationStatus === "rejected" &&
                  "Entity failed compliance checks. Discrepancies found in provided documentation."}
              </p>
            </div>

            {/* System Metadata */}
            <div className="bg-slate-50 border border-slate-200 p-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-200 pb-3 mb-4">
                System Identifiers
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Entity UUID
                  </p>
                  <p className="font-mono text-[11px] text-slate-900 bg-white border border-slate-200 p-2 break-all">
                    {owner.id}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Account Hash
                  </p>
                  <p className="font-mono text-[11px] text-slate-900 bg-white border border-slate-200 p-2 break-all">
                    {owner.userId}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <Link
                href={`/projects?createdBy=${userId}`}
                className="block border border-slate-200 bg-white hover:border-slate-900 transition-colors p-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                    View Active Profile
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
