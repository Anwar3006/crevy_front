"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PROJECT_TYPES, SDGS } from "@/constants/new-project";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useMarketplace } from "@/hooks/use-marketplace";
import { cn } from "@/lib/utils";
import PrimaryMarketplaceHero from "./_components/PrimaryMarketplaceHero";
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
  | { type: "SET_ALL"; payload: FilterState }
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
    case "SET_ALL":
      return action.payload;
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

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "impact" | "price">("newest");
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce the free-text search so it doesn't trigger a fetch (or a URL
  // update) on every keystroke.
  const debouncedSearch = useDebouncedValue(filters.search, 400);

  // Prevents the "state -> URL" effect from firing as a reaction to the
  // "URL -> state" effect below, which otherwise causes the two effects to
  // ping-pong off each other (each triggering re-renders / refetches).
  const isSyncingFromUrl = useRef(false);

  // Sync state from URL query parameters on mount / external navigation
  useEffect(() => {
    const urlFilters = {
      region: searchParams.get("region") || "",
      projectType: searchParams.get("projectType") || "",
      status: searchParams.get("status") || "",
      search: searchParams.get("search") || "",
      sdgs: searchParams.get("sdgs")
        ? searchParams.get("sdgs")!.split(",")
        : [],
    };
    const urlSortBy = searchParams.get("sortBy") as any;

    isSyncingFromUrl.current = true;

    if (
      urlSortBy === "newest" ||
      urlSortBy === "impact" ||
      urlSortBy === "price"
    ) {
      setSortBy(urlSortBy);
    }
    dispatch({ type: "SET_ALL", payload: urlFilters });
  }, [searchParams]);

  // Sync state transformations to the URL parameter index for direct sharing.
  // Skips the write when it was the URL that produced this state change, and
  // skips it again when the resulting query string wouldn't actually change,
  // to avoid an infinite replace <-> parse loop.
  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filters.region) params.set("region", filters.region);
    if (filters.projectType) params.set("projectType", filters.projectType);
    if (filters.status) params.set("status", filters.status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.sdgs.length > 0) params.set("sdgs", filters.sdgs.join(","));
    if (sortBy !== "newest") params.set("sortBy", sortBy);

    const nextQuery = params.toString();
    if (nextQuery === searchParams.toString()) return;

    router.replace(`${pathname}?${nextQuery}`, { scroll: false });
  }, [
    filters.region,
    filters.projectType,
    filters.status,
    filters.sdgs,
    debouncedSearch,
    sortBy,
    pathname,
    router,
    searchParams,
  ]);

  const queryFilters = useMemo(
    () => ({
      region: filters.region || undefined,
      projectType: filters.projectType || undefined,
      status: filters.status || undefined,
      search: debouncedSearch.trim() || undefined,
      sdgs: filters.sdgs.length > 0 ? filters.sdgs.join(",") : undefined,
    }),
    [
      filters.region,
      filters.projectType,
      filters.status,
      debouncedSearch,
      filters.sdgs,
    ],
  );

  const { data: projects, isLoading } = useMarketplace(queryFilters);

  const sortedProjects = useMemo(() => {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const clone = [...safeProjects] as Record<string, any>[];

    if (sortBy === "impact") {
      clone.sort(
        (a, b) =>
          Number(b.estimatedTotalTco2e || 0) -
          Number(a.estimatedTotalTco2e || 0),
      );
    } else if (sortBy === "price") {
      clone.sort(
        (a, b) =>
          Number(a.pricePerCredit || a.pricePerTonne || 0) -
          Number(b.pricePerCredit || b.pricePerTonne || 0),
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
    <div className="min-h-screen bg-background font-sans text-white selection:bg-secondary selection:text-white">
      {/* ── Institutional Hero ───────────────────────────────────────────── */}
      <PrimaryMarketplaceHero />

      {/* ── Market Interface ───────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        {/* Mobile Filter Toggle */}
        <div className="flex gap-4 mb-8 xl:hidden">
          <SearchBar
            value={filters.search}
            onChange={setSearch}
            ref={searchRef}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="relative flex items-center gap-2 px-5 py-3 bg-brand text-foreground font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors shrink-0 rounded-none"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-brand text-[10px] font-black flex items-center justify-center rounded-none border border-brand">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-12 items-start">
          {/* ── Institutional Sidebar ───────────────────────────────────── */}
          {/* Note: Added h-fit to prevent layout box structural collapses or height stretches from content skeleton mutations */}
          <aside className="hidden xl:block w-[290px] shrink-0 sticky top-8 h-fit bg-foreground border border-slate-800 p-6">
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

          {/* ── Main Grid ───────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Desktop Toolbar */}
            <div className="hidden xl:flex items-center justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
              <div className="w-1/2">
                <SearchBar
                  value={filters.search}
                  onChange={setSearch}
                  ref={searchRef}
                />
              </div>
              <SortSelector value={sortBy} onChange={setSortBy} />
            </div>

            {/* Result count */}
            {!isLoading && (
              <p className="text-[10px] font-mono text-foreground uppercase tracking-[0.2em] mb-6">
                Query Returned:{" "}
                <span className="text-brand font-bold">
                  {sortedProjects.length}
                </span>{" "}
                verified assets
              </p>
            )}

            {/* Grid */}
            {isLoading ? (
              <SkeletonGrid />
            ) : sortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {sortedProjects.map((p, idx) => (
                  <motion.div
                    key={p.id as string}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(idx * 0.05, 0.3),
                      duration: 0.4,
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
              className="fixed inset-0 bg-background/80 z-40 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-[340px] bg-secondary z-50 shadow-2xl overflow-y-auto border-r border-slate-800 text-white"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-background">
                <h2 className="font-extrabold text-lg text-white uppercase tracking-wider">
                  Screener Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
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

// ─── Filter Panel ────────────────────────────────────────────────────────────

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
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-brand">
          Market Screener
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-foreground hover:text-white uppercase tracking-[0.2em] font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <FilterSection title="Geographic Region">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onRegion("")}
            className={cn(
              "w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors rounded-none",
              !filters.region
                ? "bg-brand text-foreground font-bold"
                : "text-white hover:bg-slate-800 hover:text-white",
            )}
          >
            Global Index
          </button>
          {REGIONS.map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => onRegion(r)}
              className={cn(
                "w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors rounded-none",
                filters.region === r
                  ? "bg-brand text-foreground font-bold"
                  : "text-white hover:bg-slate-800 hover:text-white",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Methodology Type">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onProjectType("")}
            className={cn(
              "w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors rounded-none",
              !filters.projectType
                ? "bg-brand text-foreground font-bold"
                : "text-white hover:bg-slate-800 hover:text-white",
            )}
          >
            All Methodologies
          </button>
          {PROJECT_TYPES.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => onProjectType(t.id)}
              className={cn(
                "w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors rounded-none",
                filters.projectType === t.id
                  ? "bg-brand text-foreground font-bold"
                  : "text-white hover:bg-slate-800 hover:text-white",
              )}
            >
              {t.title}[cite: 26]
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Audit Status">
        <RadioGroup
          value={filters.status || "all"}
          onValueChange={(v) => onStatus(v === "all" ? "" : v)}
          className="space-y-3 pt-2"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="all"
              id="status-all"
              className="border-slate-700 text-brand focus:ring-brand"
            />
            <Label
              htmlFor="status-all"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 cursor-pointer"
            >
              All Statuses
            </Label>
          </div>
          {STATUSES.map((s) => (
            <div key={s.value} className="flex items-center gap-3">
              <RadioGroupItem
                value={s.value}
                id={`status-${s.value}`}
                className="border-slate-700 text-brand focus:ring-brand"
              />
              <Label
                htmlFor={`status-${s.value}`}
                className="text-xs uppercase tracking-[0.2em] text-slate-300 cursor-pointer"
              >
                {s.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      <FilterSection title="UN SDGs">
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 pt-2 custom-scrollbar">
          {SDGS.map((sdg) => (
            <div key={sdg.id} className="flex items-start gap-3">
              <Checkbox
                id={`sdg-${sdg.id}`}
                checked={filters.sdgs.includes(sdg.id)}
                onCheckedChange={() => onToggleSdg(sdg.id)}
                className="mt-0.5 rounded-none border-slate-700 data-[state=checked]:bg-brand data-[state=checked]:text-foreground data-[state=checked]:border-brand"
              />
              <Label
                htmlFor={`sdg-${sdg.id}`}
                className="text-xs font-medium text-slate-300 cursor-pointer leading-tight"
              >
                <span className="font-mono font-bold text-brand mr-1">
                  #{sdg.id}
                </span>
                {sdg.title}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
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
    <div className="border-b border-slate-800 pb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-brand transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform text-muted-foreground",
            open ? "rotate-180" : "",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand transition-colors pointer-events-none" />
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Query by asset, region, or serial..."
      className="w-full bg-transparent border-none border-b-2 border-slate-800 pl-8 pr-8 py-2 text-base md:text-lg font-sans text-foreground placeholder:text-muted-foreground placeholder:font-sans placeholder:text-base focus:outline-none focus:border-brand transition-colors rounded-none"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
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
  value: "newest" | "impact" | "price";
  onChange: (v: "newest" | "impact" | "price") => void;
}) {
  const labelMap = {
    newest: "Sort: Newly Listed",
    impact: "Sort: Max Impact",
    price: "Sort: Lowest Price",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-between gap-4 bg-foreground border border-slate-800 rounded-none pl-4 pr-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white focus:outline-none focus:border-brand hover:border-slate-700 transition-colors cursor-pointer min-w-[210px]"
        >
          <span>{labelMap[value]}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-foreground border border-slate-800 rounded-none p-1 text-white min-w-[210px] z-50">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as any)}
        >
          <DropdownMenuRadioItem
            value="newest"
            className="text-[10px] font-bold uppercase tracking-[0.2em] rounded-none focus:bg-brand focus:text-foreground cursor-pointer py-2 px-3"
          >
            Sort: Newly Listed
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="impact"
            className="text-[10px] font-bold uppercase tracking-[0.2em] rounded-none focus:bg-brand focus:text-foreground cursor-pointer py-2 px-3"
          >
            Sort: Max Impact
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="price"
            className="text-[10px] font-bold uppercase tracking-[0.2em] rounded-none focus:bg-brand focus:text-foreground cursor-pointer py-2 px-3"
          >
            Sort: Lowest Price
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Skeleton Grid ────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[500px] border border-slate-900 bg-secondary/50 animate-pulse flex flex-col rounded-none"
        >
          <div className="h-56 bg-secondary" />
          <div className="p-6 flex-1 flex flex-col space-y-4">
            <div className="h-6 bg-secondary w-3/4" />
            <div className="h-4 bg-secondary w-1/2" />
            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="h-12 bg-background" />
              <div className="h-12 bg-background" />
            </div>
            <div className="h-12 bg-secondary w-full mt-4" />
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
    <div className="flex flex-col items-center justify-center py-32 text-center border border-slate-900 bg-secondary/40 rounded-none">
      <div className="w-16 h-16 border border-slate-800 flex items-center justify-center mb-6 bg-background">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-extrabold text-white mb-2 uppercase tracking-tight">
        No Assets Match Criteria
      </h3>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm font-light">
        {hasFilters
          ? "Adjust your screener parameters to view available inventory."
          : "The marketplace currently has no liquid inventory matching this query."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-4 bg-brand text-foreground text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors rounded-none"
        >
          Clear Screener Filters
        </button>
      )}
    </div>
  );
}
