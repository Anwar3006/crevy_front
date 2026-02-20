"use client";

import { Filter, HelpCircle, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PROJECT_TYPES } from "@/constants/new-project";
import { useMarketplace } from "@/hooks/use-marketplace";
import { ProjectCard } from "./_components/ProjectCard";

const SDGS = [
  { id: "1", name: "No Poverty" },
  { id: "2", name: "Zero Hunger" },
  { id: "3", name: "Good Health" },
  { id: "5", name: "Gender Equality" },
  { id: "7", name: "Affordable Energy" },
  { id: "13", name: "Climate Action" },
];

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
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Banner */}
      <div className="bg-primary/5 py-12 px-6 border-b border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Discover and purchase verified carbon credits from sustainable
            projects across Africa.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Region */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">
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
                      <RadioGroupItem value={r} id={`region-${r}`} />
                      <Label
                        htmlFor={`region-${r}`}
                        className="text-sm text-slate-600 font-normal"
                      >
                        {r}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Project Type */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">
                  Project Type
                </h3>
                <div className="space-y-2">
                  <select
                    value={filters.projectType}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, projectType: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>All Types</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SDGs */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">
                  SDGs
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {SDGS.map((sdg) => (
                    <div key={sdg.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sdg-${sdg.id}`}
                        checked={filters.sdgs.includes(sdg.id)}
                        onCheckedChange={(checked) => {
                          setFilters((f) => ({
                            ...f,
                            sdgs: checked
                              ? [...f.sdgs, sdg.id]
                              : f.sdgs.filter((i) => i !== sdg.id),
                          }));
                        }}
                      />
                      <Label
                        htmlFor={`sdg-${sdg.id}`}
                        className="text-sm text-slate-600 font-normal truncate"
                      >
                        #{sdg.id} {sdg.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">
                  Verification Status
                </h3>
                <RadioGroup
                  value={filters.status}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, status: v }))
                  }
                  className="space-y-3"
                >
                  {["All Status", "Verified", "Pre-Verified", "Pending"].map(
                    (s) => (
                      <div key={s} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={`status-${s}`} />
                        <Label
                          htmlFor={`status-${s}`}
                          className="text-sm text-slate-600 font-normal"
                        >
                          {s}
                        </Label>
                      </div>
                    ),
                  )}
                </RadioGroup>
              </div>

              <Button className="w-full rounded-xl py-6 font-semibold shadow-lg shadow-primary/20">
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2 text-slate-400 font-normal h-12"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>

            {/* Help Box */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <HelpCircle className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-slate-900 mb-1">
                  Need Help?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Contact our support team for guidance on project submission.
                </p>
                <button
                  type="button"
                  className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Get Support <span>→</span>
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search the marketplace for a specific project"
                className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all placeholder:text-slate-400 shadow-sm"
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[450px] bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {projects.map((p: any) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No projects found
                </h3>
                <p className="text-slate-500 max-w-xs px-4">
                  We couldn't find any projects matching your current filters.
                  Try adjusting them to see more results.
                </p>
                <Button
                  variant="outline"
                  className="mt-8 rounded-xl border-slate-200"
                  onClick={resetFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
