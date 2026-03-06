"use client";

import {
  ChevronDown,
  Filter,
  HelpCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PROJECT_TYPES, SDGS } from "@/constants/new-project";
import { useMarketplace } from "@/hooks/use-marketplace";
import { ProjectCard } from "./_components/ProjectCard";

// ... (SDGS constant remains the same)

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    region: "All Regions",
    projectType: "All Types",
    status: "All Status",
    search: "",
    sdgs: [] as string[],
  });

  const { data: projects, isLoading } = useMarketplace({
    region: filters.region === "All Regions" ? undefined : filters.region,
    projectType:
      filters.projectType === "All Types" ? undefined : filters.projectType,
    status:
      filters.status === "All Status"
        ? undefined
        : filters.status.toLowerCase().replace(" ", "-"),
    search: filters.search.trim() !== "" ? filters.search.trim() : undefined,
    sdgs: filters.sdgs.length > 0 ? filters.sdgs.join(",") : undefined,
  });

  const resetFilters = () => {
    setFilters({
      region: "All Regions",
      projectType: "All Types",
      status: "All Status",
      search: "",
      sdgs: [],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner (Optimized for mobile) */}
      <div className="bg-[#2ebc8d]/5 py-8 md:py-12 px-6 border-b border-[#2ebc8d]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[#2ebc8d] font-semibold text-sm mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Back arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base">
            Discover and purchase verified carbon credits from sustainable
            projects across Africa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Responsive Container: Column on mobile, Row on Large screens */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Sidebar: Transforms into a horizontal grid on medium screens */}
          <aside className="w-full xl:w-72 shrink-0">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Filter className="w-4 h-4 text-[#2ebc8d]" />
                    <span>Filters</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-slate-400 hover:text-[#2ebc8d] transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Filter Sections: Grid on medium, Column on large/small */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-x-8 gap-y-6">
                  {/* Region */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Region
                    </h3>
                    <RadioGroup
                      value={filters.region}
                      onValueChange={(v) =>
                        setFilters((f) => ({ ...f, region: v }))
                      }
                      className="space-y-3"
                    >
                      {["All Regions", "Africa"].map((r) => (
                        <div key={r} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={r}
                            id={`region-${r}`}
                            className="text-[#2ebc8d]"
                          />
                          <Label
                            htmlFor={`region-${r}`}
                            className="text-sm text-slate-600 font-medium cursor-pointer"
                          >
                            {r}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Project Type */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Project Type
                    </h3>
                    <div className="relative">
                      <select
                        value={filters.projectType}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            projectType: e.target.value,
                          }))
                        }
                        className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-[#2ebc8d]/20 outline-none"
                      >
                        <option>All Types</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* SDGs */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      SDGs
                    </h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {SDGS.map((sdg) => (
                        <div
                          key={sdg.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`sdg-${sdg.id}`}
                            checked={filters.sdgs.includes(sdg.id)}
                            onCheckedChange={(checked) =>
                              setFilters((f) => ({
                                ...f,
                                sdgs: checked
                                  ? [...f.sdgs, sdg.id]
                                  : f.sdgs.filter((i) => i !== sdg.id),
                              }))
                            }
                          />
                          <Label
                            htmlFor={`sdg-${sdg.id}`}
                            className="text-sm text-slate-600 font-medium truncate cursor-pointer"
                          >
                            #{sdg.id} {sdg.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Verification
                    </h3>
                    <RadioGroup
                      value={filters.status}
                      onValueChange={(v) =>
                        setFilters((f) => ({ ...f, status: v }))
                      }
                      className="space-y-3"
                    >
                      {["All Status", "Verified", "Pending"].map((s) => (
                        <div key={s} className="flex items-center space-x-2">
                          <RadioGroupItem value={s} id={`status-${s}`} />
                          <Label
                            htmlFor={`status-${s}`}
                            className="text-sm text-slate-600 font-medium cursor-pointer"
                          >
                            {s}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <Button className="w-full bg-[#2ebc8d] hover:bg-[#27a37b] text-white rounded-xl py-6 font-bold shadow-lg shadow-[#2ebc8d]/20 transition-all">
                    Apply Filters
                  </Button>
                </div>
              </div>

              {/* Help Box - Hidden on medium to save space, visible on large/small */}
              <div className="hidden lg:block bg-[#2ebc8d]/5 border border-[#2ebc8d]/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="relative z-10">
                  <HelpCircle className="w-6 h-6 text-[#2ebc8d] mb-3" />
                  <h4 className="font-bold text-slate-900 mb-1 italic">
                    Need Help?
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                    Questions about verification? Our team is here to help.
                  </p>
                  <button
                    type="button"
                    className="text-[#2ebc8d] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Get Support <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6 md:space-y-8">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2ebc8d] transition-colors" />
              <input
                type="text"
                placeholder="Search the marketplace..."
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-16 text-sm focus:ring-4 focus:ring-[#2ebc8d]/10 focus:border-[#2ebc8d]/20 transition-all placeholder:text-slate-400 shadow-sm"
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2ebc8d] text-white rounded-xl shadow-md hover:bg-[#27a37b] transition-all font-bold text-xs"
              >
                Search
              </button>
            </div>

            {/* Results Grid: 1 col on mobile, 2 on tablet/desktop */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[400px] bg-slate-100 rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {projects.map((p: Record<string, unknown>) => (
                  <ProjectCard key={p.id as string} project={p} />
                ))}
              </div>
            ) : (
              /* ... (Empty state remains the same) */
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
                <Search className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium">
                  No projects found matching those filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
