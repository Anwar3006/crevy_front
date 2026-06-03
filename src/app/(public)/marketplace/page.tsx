"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Filter,
  Leaf,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PROJECT_TYPES, SDGS } from "@/constants/new-project";
import { useMarketplace } from "@/hooks/use-marketplace";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./_components/ProjectCard";

// ─── Filter State ─────────────────────────────────────────────────────────────

interface FilterState {
  region: string;
  projectType: string;
  status: string;
  search: string;
  sdgs: string[];
}

type FilterAction =
  | { type: "SET"; key: keyof FilterState; value: string | string[] }
  | { type: "TOGGLE_SDG"; id: string }
  | { type: "RESET" };

const INITIAL_FILTERS: FilterState = {
  region: "",
  projectType: "",
  status: "",
  search: "",
  sdgs: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_SDG":
      return {
        ...state,
        sdgs: state.sdgs.includes(action.id)
          ? state.sdgs.filter((s) => s !== action.id)
          : [...state.sdgs, action.id],
      };
    case "RESET":
      return INITIAL_FILTERS;
    default:
      return state;
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const REGIONS = ["Africa", "West Africa", "East Africa", "Southern Africa"];
const STATUSES = [
  { value: "approved", label: "Verified" },
  { value: "submitted", label: "Pending Review" },
  { value: "active", label: "Pre-Verified" },
];

const HERO_STATS = [
  { value: "200+", label: "Verified Projects", icon: "🌱" },
  { value: "$52", label: "Avg. Price / tCO₂e", icon: "💹" },
  { value: "50K+", label: "tCO₂e Available", icon: "🌍" },
  { value: "6", label: "Project Categories", icon: "📋" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "impact" | "price">("newest");
  const searchRef = useRef<HTMLInputElement>(null);

  // Defer the search input so typing never blocks the UI
  const deferredSearch = useDeferredValue(filters.search);

  // Build query params for API — memoised so reference is stable
  const queryFilters = useMemo(
    () => ({
      region: filters.region || undefined,
      projectType: filters.projectType || undefined,
      status: filters.status || undefined,
      search: deferredSearch.trim() || undefined,
      sdgs: filters.sdgs.length > 0 ? filters.sdgs.join(",") : undefined,
    }),
    [
      filters.region,
      filters.projectType,
      filters.status,
      deferredSearch,
      filters.sdgs,
    ],
  );

  const { data: projects, isLoading } = useMarketplace(queryFilters);

  // Sorted projects — memoised so we only re-sort when projects or sort changes
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    const clone = [...projects] as Record<string, any>[];
    if (sortBy === "impact") {
      clone.sort(
        (a, b) =>
          Number(b.estimatedTotalTco2e || 0) -
          Number(a.estimatedTotalTco2e || 0),
      );
    } else if (sortBy === "price") {
      clone.sort(
        (a, b) => Number(a.pricePerTonne || 52) - Number(b.pricePerTonne || 52),
      );
    }
    return clone;
  }, [projects, sortBy]);

  const activeFilterCount = useMemo(
    () =>
      (filters.region ? 1 : 0) +
      (filters.projectType ? 1 : 0) +
      (filters.status ? 1 : 0) +
      filters.sdgs.length,
    [filters.region, filters.projectType, filters.status, filters.sdgs],
  );

  // ── Stable callbacks ──────────────────────────────────────────────────────
  const setRegion = useCallback(
    (v: string) => dispatch({ type: "SET", key: "region", value: v }),
    [],
  );
  const setProjectType = useCallback(
    (v: string) => dispatch({ type: "SET", key: "projectType", value: v }),
    [],
  );
  const setStatus = useCallback(
    (v: string) => dispatch({ type: "SET", key: "status", value: v }),
    [],
  );
  const setSearch = useCallback(
    (v: string) => dispatch({ type: "SET", key: "search", value: v }),
    [],
  );
  const toggleSdg = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_SDG", id }),
    [],
  );
  const resetFilters = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <div className="min-h-screen bg-[#F4F7F4]">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#131927]">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Green glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#2CC295]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-14">
          {/* Breadcrumb */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-xs font-semibold transition-colors mb-6 group"
          >
            <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-[#2CC295]/15 border border-[#2CC295]/20 text-[#2CC295] text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">
                  <TrendingUp className="w-3 h-3" />
                  Live Carbon Marketplace
                </div>
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  Invest in Africa&apos;s
                  <br />
                  <span className="text-[#2CC295]">Green Future</span>
                </h1>
                <p className="text-white/50 max-w-xl text-sm md:text-base leading-relaxed">
                  Browse science-verified carbon credit projects across the
                  continent. Every credit is independently audited and traceable
                  to its source.
                </p>
              </motion.div>
            </div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-center min-w-[110px]"
                >
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <p className="text-[#2CC295] font-extrabold text-xl leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-8" /> */}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Mobile: search + filter toggle row */}
        <div className="flex gap-3 mb-6 xl:hidden">
          <SearchBar
            value={filters.search}
            onChange={setSearch}
            ref={searchRef}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#2CC295]/40 transition-colors shadow-sm shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2CC295] text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="hidden xl:block w-[260px] shrink-0">
            <FilterPanel
              filters={filters}
              activeFilterCount={activeFilterCount}
              onRegion={setRegion}
              onProjectType={setProjectType}
              onStatus={setStatus}
              onToggleSdg={toggleSdg}
              onReset={resetFilters}
            />
          </aside>

          {/* ── Main ────────────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Desktop search + sort bar */}
            <div className="hidden xl:flex items-center gap-4 mb-7">
              <SearchBar
                value={filters.search}
                onChange={setSearch}
                ref={searchRef}
                className="flex-1"
              />
              <SortSelector value={sortBy} onChange={setSortBy} />
            </div>

            {/* Mobile sort */}
            <div className="xl:hidden mb-5 flex justify-end">
              <SortSelector value={sortBy} onChange={setSortBy} />
            </div>

            {/* Result count */}
            {!isLoading && (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                {sortedProjects.length} project
                {sortedProjects.length !== 1 ? "s" : ""} found
              </p>
            )}

            {/* Grid */}
            {isLoading ? (
              <SkeletonGrid />
            ) : sortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                {sortedProjects.map((p, idx) => (
                  <motion.div
                    key={p.id as string}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(idx * 0.06, 0.4),
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                  >
                    <ProjectCard project={p} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                onReset={resetFilters}
                hasFilters={activeFilterCount > 0}
              />
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-extrabold text-[#131927]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <FilterPanel
                  filters={filters}
                  activeFilterCount={activeFilterCount}
                  onRegion={setRegion}
                  onProjectType={setProjectType}
                  onStatus={setStatus}
                  onToggleSdg={toggleSdg}
                  onReset={resetFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: FilterState;
  activeFilterCount: number;
  onRegion: (v: string) => void;
  onProjectType: (v: string) => void;
  onStatus: (v: string) => void;
  onToggleSdg: (id: string) => void;
  onReset: () => void;
}

function FilterPanel({
  filters,
  activeFilterCount,
  onRegion,
  onProjectType,
  onStatus,
  onToggleSdg,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="sticky top-6 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2CC295]" />
          <span className="font-extrabold text-[#131927] text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#2CC295] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-[#2CC295] transition-colors flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Region */}
      <FilterSection title="Region">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onRegion("")}
            className={cn(
              "w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
              !filters.region
                ? "bg-[#131927] text-white"
                : "text-gray-500 hover:bg-gray-50",
            )}
          >
            All Regions
          </button>
          {REGIONS.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => onRegion(r)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                filters.region === r
                  ? "bg-[#131927] text-white"
                  : "text-gray-500 hover:bg-gray-50",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Project Type */}
      <FilterSection title="Project Type">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onProjectType("")}
            className={cn(
              "w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
              !filters.projectType
                ? "bg-[#2CC295]/10 text-[#2CC295]"
                : "text-gray-500 hover:bg-gray-50",
            )}
          >
            All Types
          </button>
          {PROJECT_TYPES.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => onProjectType(t.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                filters.projectType === t.id
                  ? "bg-[#2CC295]/10 text-[#2CC295]"
                  : "text-gray-500 hover:bg-gray-50",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Verification */}
      <FilterSection title="Verification">
        <RadioGroup
          value={filters.status || "all"}
          onValueChange={(v) => onStatus(v === "all" ? "" : v)}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="status-all" />
            <Label
              htmlFor="status-all"
              className="text-sm font-semibold text-gray-600 cursor-pointer"
            >
              All Status
            </Label>
          </div>
          {STATUSES.map((s) => (
            <div key={s.value} className="flex items-center gap-2">
              <RadioGroupItem value={s.value} id={`status-${s.value}`} />
              <Label
                htmlFor={`status-${s.value}`}
                className="text-sm font-semibold text-gray-600 cursor-pointer"
              >
                {s.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      {/* SDGs */}
      <FilterSection title="SDGs">
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {SDGS.map((sdg) => (
            <div key={sdg.id} className="flex items-center gap-2">
              <Checkbox
                id={`sdg-${sdg.id}`}
                checked={filters.sdgs.includes(sdg.id)}
                onCheckedChange={() => onToggleSdg(sdg.id)}
              />
              <Label
                htmlFor={`sdg-${sdg.id}`}
                className="text-xs font-semibold text-gray-600 cursor-pointer leading-snug"
              >
                <span className="font-black text-gray-400">#{sdg.id}</span>{" "}
                {sdg.title}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Help block */}
      <div className="mt-3 bg-[#131927] rounded-2xl p-5">
        <Leaf className="w-5 h-5 text-[#2CC295] mb-2" />
        <p className="text-white font-bold text-sm mb-1">Need guidance?</p>
        <p className="text-white/50 text-xs leading-relaxed mb-3">
          Our experts can help you evaluate projects for your portfolio.
        </p>
        <Link
          href="/support"
          className="text-[#2CC295] text-xs font-bold hover:underline"
        >
          Talk to our team →
        </Link>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#131927] transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

const SearchBar = ({
  value,
  onChange,
  className,
  ref,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}) => (
  <div className={cn("relative group", className)}>
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2CC295] transition-colors pointer-events-none" />
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search projects, regions, types…"
      className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2CC295]/50 focus:ring-3 focus:ring-[#2CC295]/10 shadow-sm transition-all"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ─── Sort Selector ────────────────────────────────────────────────────────────

function SortSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "newest" | "impact" | "price") => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
        className="appearance-none h-12 bg-white border border-gray-200 rounded-xl pl-4 pr-8 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#2CC295]/50 shadow-sm cursor-pointer"
      >
        <option value="newest">Sort: Newest</option>
        <option value="impact">Sort: Highest Impact</option>
        <option value="price">Sort: Lowest Price</option>
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Skeleton Grid ────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[460px] bg-white rounded-3xl animate-pulse border border-gray-100"
        >
          <div className="h-56 bg-gray-100 rounded-t-3xl" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-1/3" />
            <div className="h-6 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 bg-gray-50 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Leaf className="w-9 h-9 text-gray-300" />
      </div>
      <h3 className="text-xl font-extrabold text-[#131927] mb-2">
        No projects found
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
        {hasFilters
          ? "Try adjusting your filters to find more projects."
          : "No projects are available at the moment. Check back soon."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#131927] text-white rounded-xl text-sm font-bold hover:bg-[#1e2d40] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </button>
      )}
    </div>
  );
}
