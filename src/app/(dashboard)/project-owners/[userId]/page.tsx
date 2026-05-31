"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type ProjectOwnerRecord,
  ProjectOwnerService,
} from "@/lib/services/project-owner-service";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const verificationConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType; bg: string }
> = {
  pending: {
    label: "Pending KYC",
    className: "text-amber-700",
    icon: Clock,
    bg: "bg-amber-50  border-amber-200",
  },
  verified: {
    label: "Verified",
    className: "text-[#178a74]",
    icon: CheckCircle2,
    bg: "bg-[#2cc295]/10 border-[#2cc295]/30",
  },
  rejected: {
    label: "Rejected",
    className: "text-red-600",
    icon: XCircle,
    bg: "bg-red-50    border-red-200",
  },
};

const getInitials = (first?: string, last?: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "PO";

const avatarColors = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100    text-blue-700",
  "bg-purple-100  text-purple-700",
  "bg-amber-100   text-amber-700",
  "bg-rose-100    text-rose-700",
  "bg-teal-100    text-teal-700",
];
const avatarColor = (code: string) =>
  avatarColors[code.charCodeAt(code.length - 1) % avatarColors.length];

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      <div className="flex items-center justify-center gap-3 min-h-[60vh] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading project owner…</span>
      </div>
    );
  }

  if (isError || !owner) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <XCircle className="h-10 w-10 text-red-400 mx-auto" />
        <p className="font-semibold text-slate-700">Project owner not found.</p>
        <Link
          href="/project-owners"
          className="text-sm text-[#2cc295] hover:underline"
        >
          ← Back to Project Owners
        </Link>
      </div>
    );
  }

  const vc =
    verificationConfig[owner.verificationStatus] ?? verificationConfig.pending;
  const VcIcon = vc.icon;
  const initials = getInitials(owner.firstName, owner.lastName);
  const color = avatarColor(owner.code);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
            <Link
              href="/dashboard"
              className="hover:text-[#2CC295] transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/project-owners"
              className="hover:text-[#2CC295] transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" /> Project Owners
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#131927]">
              {owner.firstName} {owner.lastName}
            </span>
          </nav>

          {/* Hero row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div
              className={cn(
                "h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm",
                color,
              )}
            >
              {initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-[#131927] tracking-tight">
                  {owner.firstName} {owner.lastName}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border",
                    vc.bg,
                    vc.className,
                  )}
                >
                  <VcIcon className="h-3.5 w-3.5" />
                  {vc.label}
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {owner.code}
              </p>
            </div>

            <Link
              href="/project-owners"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#2CC295] transition-colors shrink-0"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-5 md:grid-cols-5">
          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="md:col-span-3 space-y-5">
            {/* Identity card */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-[#2CC295]" /> Identity
              </h2>
              <InfoRow icon={Mail} label="Email" value={owner.email} />
              <InfoRow icon={Phone} label="Phone" value={owner.contactNumber} />
              <InfoRow
                icon={MapPin}
                label="Country"
                value={owner.countryOfOperation}
              />
              <InfoRow
                icon={User}
                label="Onboarded At"
                value={new Date(owner.onboardedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <InfoRow
                icon={User}
                label="Registered"
                value={new Date(owner.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </section>

            {/* Payment methods */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2CC295]" /> Payment Methods
              </h2>

              {!owner.momoDetails && !owner.bankDetails && (
                <p className="text-sm text-slate-400 italic">
                  No payment methods configured.
                </p>
              )}

              {owner.momoDetails && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Mobile Money
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                        Network
                      </dt>
                      <dd className="font-semibold text-slate-700 mt-0.5">
                        {owner.momoDetails.network}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                        Number
                      </dt>
                      <dd className="font-semibold text-slate-700 mt-0.5">
                        {owner.momoDetails.number}
                      </dd>
                    </div>
                    {owner.momoDetails.accountName && (
                      <div className="col-span-2">
                        <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                          Account Name
                        </dt>
                        <dd className="font-semibold text-slate-700 mt-0.5">
                          {owner.momoDetails.accountName}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {owner.bankDetails && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bank Transfer
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                        Bank
                      </dt>
                      <dd className="font-semibold text-slate-700 mt-0.5">
                        {owner.bankDetails.bankName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                        Account No.
                      </dt>
                      <dd className="font-semibold text-slate-700 mt-0.5">
                        {owner.bankDetails.accountNumber}
                      </dd>
                    </div>
                    {owner.bankDetails.accountName && (
                      <div className="col-span-2">
                        <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                          Account Name
                        </dt>
                        <dd className="font-semibold text-slate-700 mt-0.5">
                          {owner.bankDetails.accountName}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </section>
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div className="md:col-span-2 space-y-5">
            {/* Status card */}
            <section className={cn("rounded-2xl border p-5", vc.bg)}>
              <div className="flex items-center gap-3">
                <VcIcon className={cn("h-6 w-6 shrink-0", vc.className)} />
                <div>
                  <p className={cn("text-sm font-bold", vc.className)}>
                    {vc.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {owner.verificationStatus === "pending" &&
                      "Awaiting KYC document review by the admin team."}
                    {owner.verificationStatus === "verified" &&
                      "Identity and land rights have been verified."}
                    {owner.verificationStatus === "rejected" &&
                      "KYC check failed. Contact the owner for resubmission."}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quick Actions
              </h2>

              <Link
                href={`/project-owners/${userId}/projects`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 hover:border-[#2cc295]/40 hover:bg-emerald-50/30 transition-all group"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#2cc295] transition-colors">
                  View Projects
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2cc295]" />
              </Link>

              <Link
                href={`/projects?createdBy=${userId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 hover:border-[#2cc295]/40 hover:bg-emerald-50/30 transition-all group"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#2cc295] transition-colors">
                  View Project Profiles
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2cc295]" />
              </Link>
            </section>

            {/* Meta */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                System Info
              </h2>
              <dl className="space-y-2.5">
                {[
                  { label: "Project Owner ID", value: owner.id },
                  { label: "User ID", value: owner.userId },
                  { label: "Code", value: owner.code },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                      {label}
                    </dt>
                    <dd className="text-xs font-mono text-slate-600 truncate mt-0.5">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
