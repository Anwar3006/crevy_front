"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  Clock,
  Home,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth";
import {
  type ProjectOwnerFilters,
  type ProjectOwnerRecord,
  ProjectOwnerService,
} from "@/lib/services/project-owner-service";
import { cn } from "@/lib/utils";
import type { TRole } from "@/types/user.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const verificationBadge: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50  text-amber-700 border-amber-200",
    icon: Clock,
  },
  verified: {
    label: "Verified",
    className: "bg-[#2cc295]/10 text-[#178a74] border-[#2cc295]/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50    text-red-600   border-red-200",
    icon: XCircle,
  },
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const getAvatarColor = (code: string) => {
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
  ];
  const idx = code.charCodeAt(code.length - 1) % colors.length;
  return colors[idx];
};

// ─── Cursor pagination stack ──────────────────────────────────────────────────
// We maintain a stack of cursors so "previous page" is O(1).
// cursorStack[0] is always undefined (first page).
// cursorStack[N] is the cursor for page N.

function useCursorPagination() {
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const currentPage = cursorStack.length - 1;
  const currentCursor = cursorStack[currentPage];

  const goNext = useCallback((nextCursor: string) => {
    setCursorStack((s) => [...s, nextCursor]);
  }, []);

  const goPrev = useCallback(() => {
    setCursorStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const resetToFirst = useCallback(() => {
    setCursorStack([undefined]);
  }, []);

  return {
    currentPage,
    currentCursor,
    goNext,
    goPrev,
    resetToFirst,
    canGoPrev: currentPage > 0,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectOwnersPage() {
  const { data: session } = authClient.useSession();
  const role = (session?.user as any)?.role as TRole | undefined;
  const isSuperAdmin = role === "super_admin";

  const PAGE_SIZE = 12;

  // ── Filter state ────────────────────────────────────────────────────────────
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState("");

  // ── Pagination ──────────────────────────────────────────────────────────────
  const {
    currentPage,
    currentCursor,
    goNext,
    goPrev,
    resetToFirst,
    canGoPrev,
  } = useCursorPagination();

  // Reset to first page whenever filters change
  const applySearch = () => {
    resetToFirst();
    setSearch(searchDraft);
  };

  const clearFilters = () => {
    setSearchDraft("");
    setSearch("");
    setStatusFilter("");
    setCountryFilter("");
    resetToFirst();
  };

  const hasActiveFilters = search || statusFilter || countryFilter;

  // ── Query ────────────────────────────────────────────────────────────────────
  const _queryClient = useQueryClient();

  const filters: ProjectOwnerFilters = useMemo(
    () => ({
      cursor: currentCursor,
      limit: PAGE_SIZE,
      verificationStatus: (statusFilter as any) || undefined,
      country: countryFilter || undefined,
      search: search || undefined,
    }),
    [currentCursor, statusFilter, countryFilter, search],
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["project-owners", filters],
    queryFn: () => ProjectOwnerService.listProjectOwners(filters),
    staleTime: 30_000,
  });

  const owners: ProjectOwnerRecord[] = data?.data ?? [];
  const nextCursor: string | null = data?.nextCursor ?? null;
  const total: number = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
            <Link
              href="/dashboard"
              className="hover:text-[#2CC295] transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#131927] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Project Owners
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#131927] tracking-tight">
                Project Owners
              </h1>
              <p className="text-gray-400 mt-1 text-sm">
                {isSuperAdmin
                  ? "All registered project owners across the platform."
                  : "Project owners assigned to you."}
              </p>
            </div>

            {/* Only admins who can manage can register new ones */}
            {(isSuperAdmin || role === "project_manager") && (
              <Link href="/project-owners/register">
                <Button
                  type="button"
                  className="bg-[#2CC295] hover:bg-[#178a74] text-white font-bold rounded-xl px-5 py-2.5 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Onboard Project Owner
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Filter bar ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search by name, email or code…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applySearch()}
                  className="pl-9 rounded-xl border-gray-200 text-sm h-10"
                />
              </div>
              <Button
                type="button"
                onClick={applySearch}
                variant="outline"
                className="rounded-xl h-10 px-4 text-sm font-semibold border-gray-200"
              >
                Search
              </Button>
            </div>

            {/* Status filter */}
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) => {
                setStatusFilter(v === "all" ? "" : v);
                resetToFirst();
              }}
            >
              <SelectTrigger className="w-40 rounded-xl h-10 text-sm border-gray-200">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-gray-400 shrink-0" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Country filter */}
            <Input
              placeholder="Country…"
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                resetToFirst();
              }}
              className="w-36 rounded-xl h-10 text-sm border-gray-200"
            />

            {/* Clear + Refresh */}
            <div className="flex gap-2 shrink-0">
              {hasActiveFilters && (
                <Button
                  type="button"
                  onClick={clearFilters}
                  variant="ghost"
                  className="rounded-xl h-10 text-xs text-gray-500 hover:text-red-500 px-3"
                >
                  Clear
                </Button>
              )}
              <Button
                type="button"
                onClick={() => refetch()}
                variant="outline"
                size="icon"
                className="rounded-xl h-10 w-10 border-gray-200 shrink-0"
                disabled={isFetching}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 text-gray-500",
                    isFetching && "animate-spin",
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold px-3 py-1">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSearchDraft("");
                      resetToFirst();
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold px-3 py-1 border",
                    verificationBadge[statusFilter]?.className,
                  )}
                >
                  {verificationBadge[statusFilter]?.label}
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      resetToFirst();
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {countryFilter && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold px-3 py-1">
                  <MapPin className="h-3 w-3" /> {countryFilter}
                  <button
                    type="button"
                    onClick={() => {
                      setCountryFilter("");
                      resetToFirst();
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        {!isLoading && data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total",
                value: total,
                icon: Users,
                color: "text-[#131927]",
              },
              {
                label: "Verified",
                value: owners.filter((o) => o.verificationStatus === "verified")
                  .length,
                icon: CheckCircle2,
                color: "text-[#178a74]",
              },
              {
                label: "Pending",
                value: owners.filter((o) => o.verificationStatus === "pending")
                  .length,
                icon: Clock,
                color: "text-amber-600",
              },
              {
                label: "Rejected",
                value: owners.filter((o) => o.verificationStatus === "rejected")
                  .length,
                icon: XCircle,
                color: "text-red-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
              >
                <Icon className={cn("h-5 w-5 shrink-0", color)} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {label}
                  </p>
                  <p className="text-xl font-bold text-[#131927]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading project owners…</span>
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-10 text-center">
            <XCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-semibold text-sm">
              Failed to load project owners.
            </p>
            <Button
              type="button"
              onClick={() => refetch()}
              variant="outline"
              className="mt-4 rounded-xl text-sm"
            >
              Try Again
            </Button>
          </div>
        ) : owners.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-[#2CC295]" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-base">
                {hasActiveFilters
                  ? "No project owners match your filters."
                  : "No project owners registered yet."}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria."
                  : "Onboard your first project owner to get started."}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button
                type="button"
                onClick={clearFilters}
                variant="outline"
                className="rounded-xl text-sm"
              >
                Clear Filters
              </Button>
            ) : (
              <Link href="/project-owners/register">
                <Button
                  type="button"
                  className="bg-[#2CC295] hover:bg-[#178a74] text-white font-bold rounded-xl px-6 py-3 text-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Onboard Project Owner
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owners.map((owner) => (
              <ProjectOwnerCard key={owner.id} owner={owner} />
            ))}
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────────────────── */}
        {owners.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400 font-medium">
              Page {currentPage + 1} · Showing {owners.length} result
              {owners.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetToFirst}
                disabled={!canGoPrev || isFetching}
                className="rounded-lg border-gray-200 text-xs gap-1"
              >
                <ChevronsLeft className="h-3.5 w-3.5" /> First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={!canGoPrev || isFetching}
                className="rounded-lg border-gray-200 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => nextCursor && goNext(nextCursor)}
                disabled={!nextCursor || isFetching}
                className="rounded-lg border-gray-200 text-xs gap-1"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Project Owner Card ───────────────────────────────────────────────────────

function ProjectOwnerCard({ owner }: { owner: ProjectOwnerRecord }) {
  const badge =
    verificationBadge[owner.verificationStatus] ?? verificationBadge.pending;
  const BadgeIcon = badge.icon;
  const avatarColor = getAvatarColor(owner.code);

  return (
    <Link
      href={`/project-owners/${owner.userId}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#2cc295]/40 hover:shadow-md transition-all group"
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Avatar */}
          <div
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
              avatarColor,
            )}
          >
            {getInitials(owner.firstName, owner.lastName)}
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wide",
              badge.className,
            )}
          >
            <BadgeIcon className="h-3 w-3" />
            {badge.label}
          </span>
        </div>

        {/* Name */}
        <p className="font-bold text-[#131927] text-base leading-tight group-hover:text-[#2CC295] transition-colors">
          {owner.firstName} {owner.lastName}
        </p>

        {/* Code */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
          {owner.code}
        </p>

        {/* Meta */}
        <div className="mt-3 space-y-1.5">
          {owner.email && (
            <p className="text-xs text-slate-500 truncate">✉ {owner.email}</p>
          )}
          {owner.contactNumber && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Phone className="h-3 w-3 shrink-0" />
              {owner.contactNumber}
            </p>
          )}
          {owner.countryOfOperation && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {owner.countryOfOperation}
            </p>
          )}
        </div>

        {/* Payment method chips */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
          {owner.momoDetails && (
            <span className="rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 border border-blue-100">
              MoMo · {owner.momoDetails.network}
            </span>
          )}
          {owner.bankDetails && (
            <span className="rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1">
              Bank
            </span>
          )}
          {!owner.momoDetails && !owner.bankDetails && (
            <span className="text-[10px] text-slate-400 italic">
              No payment method
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
