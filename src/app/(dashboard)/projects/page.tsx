"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/hooks/use-user";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  code: string;
  name: string;
  projectType: string;
  projectStage: string;
  projectStatus: string;
  sector: string;
  region: string;
  country: string;
  totalAreaHectares: string | number;
  createdAt: string;
}

// ─── Editorial Styles ────────────────────────────────────────────────────────

const statusConfig: Record<string, { color: string; bg: string }> = {
  active: { color: "text-emerald-700", bg: "bg-emerald-500" },
  draft: { color: "text-slate-500", bg: "bg-slate-400" },
  suspended: { color: "text-red-700", bg: "bg-red-500" },
  closed: { color: "text-slate-400", bg: "bg-slate-300" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllProjectsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);

  // ── Role-Based Oversight Logic ──
  const isSuperAdmin = user?.role === "super_admin";

  const { data, isLoading } = useQuery({
    queryKey: [
      "all-projects",
      statusFilter,
      globalFilter,
      cursor,
      user?.id,
      viewType,
    ],
    queryFn: () =>
      ProjectService.getProjects({
        projectStatus: statusFilter === "all" ? undefined : statusFilter,
        name: globalFilter || undefined,
        cursor: cursor || undefined,
        limit: viewType === "grid" ? 12 : 10,
        // If not super_admin, strictly limit query to projects managed by this user
        managerId: isSuperAdmin ? undefined : user?.id,
      }),
    enabled: !!user, // Wait for user context
  });

  const projects = data?.data || [];
  const nextCursor = data?.nextCursor;

  // ── List View Columns ──
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Asset Registry Details",
        cell: ({ row }) => {
          const p = row.original;
          const status = p.projectStatus || "draft";
          const config = statusConfig[status] || statusConfig.draft;
          return (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", config.bg)}
                ></span>
                <div className="font-serif text-lg text-slate-900 leading-none">
                  {p.name}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] ml-3.5">
                {p.code || `PRJ-${p.id.slice(0, 8)}`}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "projectType",
        header: "Methodology",
        cell: ({ row }) => (
          <div>
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
              {(row.getValue("projectType") as string).replace(/_/g, " ")}
            </div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
              {row.original.sector.replace(/_/g, " ")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "projectStage",
        header: "Lifecycle Stage",
        cell: ({ row }) => {
          const stage = row.getValue("projectStage") as string;
          return (
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600 bg-slate-100 px-2 py-1 border border-slate-200">
              {stage}
            </span>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Coordinates",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <MapPin className="h-3 w-3 text-slate-400" />
            {row.original.region}, {row.original.country}
          </div>
        ),
      },
      {
        accessorKey: "totalAreaHectares",
        header: "Scale (HA)",
        cell: ({ row }) => (
          <div className="text-sm font-mono font-bold text-slate-900">
            {Number(row.getValue("totalAreaHectares") || 0).toLocaleString()}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-none hover:bg-slate-100 text-slate-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-none border border-slate-200 shadow-xl"
            >
              <DropdownMenuLabel className="text-[9px] text-slate-400 uppercase tracking-[0.2em] px-3 py-2 font-bold">
                Asset Operations
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${row.original.id}`)}
                className="text-xs font-bold uppercase tracking-widest cursor-pointer py-2.5"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-2 text-slate-400" />{" "}
                View Dossier
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest cursor-pointer py-2.5">
                <Activity className="h-3.5 w-3.5 mr-2 text-slate-400" />{" "}
                Telemetry Data
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800 cursor-pointer py-2.5">
                <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Verify Protocol
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="animate-in fade-in duration-700 pb-24">
      {/* ── Editorial Header ── */}
      <div className="border-b border-slate-200 bg-white pt-12 pb-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-6 h-[1px] bg-slate-900"></div>
                <span className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {isSuperAdmin ? "Global Registry" : "Managed Portfolio"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-4">
                Asset <span className="italic text-slate-500">Oversight.</span>
              </h1>
              <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                Complete inventory of carbon sequestration assets under
                management. Monitor lifecycle stages, review telemetry, and
                approve methodologies for market listing.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                className="rounded-none border-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 text-slate-900"
              >
                <Download className="w-4 h-4 mr-2" /> Export Roster
              </Button>
              <Button
                onClick={() => router.push("/new-project")}
                className="rounded-none bg-slate-900 hover:bg-emerald-900 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Register Asset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* ── Control Bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative group w-full md:w-72">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
              <input
                placeholder="Query by asset name or code..."
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setCursor(null);
                }}
                className="w-full bg-transparent border-none border-b-2 border-slate-200 pl-7 pr-4 py-2 text-sm font-serif text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-slate-900 transition-colors rounded-none"
              />
            </div>

            {/* Native Select for strict styling */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCursor(null);
              }}
              className="appearance-none bg-transparent border-none border-b-2 border-slate-200 py-2 pl-2 pr-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 focus:outline-none focus:border-slate-900 focus:text-slate-900 cursor-pointer transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewType("list")}
              className={cn(
                "p-1.5 transition-colors",
                viewType === "list"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-900",
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewType("grid")}
              className={cn(
                "p-1.5 transition-colors",
                viewType === "grid"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-900",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Content Area ── */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center border border-slate-200 bg-white">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Querying distributed ledger...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-slate-200 bg-slate-50">
            <ShieldCheck
              className="h-10 w-10 text-slate-300 mb-4"
              strokeWidth={1}
            />
            <p className="text-xl font-serif text-slate-900 mb-1">
              No Assets Located
            </p>
            <p className="text-xs text-slate-500 max-w-sm text-center">
              The query returned zero results. Adjust filtering parameters or
              register a new project to populate the registry.
            </p>
          </div>
        ) : viewType === "list" ? (
          /* List View */
          <div className="border border-slate-200 bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b-2 border-slate-900 hover:bg-slate-50"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 h-14"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-5 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((p: Project) => {
              const status = p.projectStatus || "draft";
              const config = statusConfig[status] || statusConfig.draft;

              return (
                <div
                  key={p.id}
                  className="group border border-slate-200 bg-white hover:border-slate-900 transition-colors flex flex-col h-full"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        {p.code || `PRJ-${p.id.slice(0, 8)}`}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-1 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                          config.color,
                          `bg-${config.bg}/10`,
                        )}
                      >
                        <span
                          className={cn("w-1.5 h-1.5 rounded-full", config.bg)}
                        ></span>
                        {status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-slate-900 leading-tight mb-2 group-hover:text-emerald-800 transition-colors">
                      {p.name}
                    </h3>

                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
                      {p.projectType.replace(/_/g, " ")}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-auto">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Scale
                        </p>
                        <p className="font-mono text-slate-900 font-bold">
                          {Number(p.totalAreaHectares || 0).toLocaleString()}{" "}
                          <span className="font-sans text-xs font-normal text-slate-500">
                            HA
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Location
                        </p>
                        <p
                          className="text-xs font-medium text-slate-900 truncate"
                          title={`${p.region}, ${p.country}`}
                        >
                          {p.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 grid grid-cols-2 divide-x divide-slate-200">
                    <button
                      type="button"
                      onClick={() => router.push(`/projects/${p.id}`)}
                      className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Dossier
                    </button>
                    <button
                      type="button"
                      className="py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-white hover:bg-emerald-800 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination Footer ── */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Ledger Returns:{" "}
            <span className="text-slate-900">{projects.length} Assets</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900"
              disabled={!cursor}
              onClick={() => setCursor(null)} // Reset to beginning for simplicity
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900"
              disabled={!nextCursor}
              onClick={() => setCursor(nextCursor)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
