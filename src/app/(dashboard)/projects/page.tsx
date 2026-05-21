"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Leaf,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectService } from "@/lib/services/project-service";
import { cn } from "@/lib/utils";
import { SectionLabel } from "../dashboard/_components/ProjectOwnerDashboard";

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

// ─── Styles ──────────────────────────────────────────────────────────────────

const statusPill: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-slate-50 text-slate-600 border-slate-100",
  suspended: "bg-red-50 text-red-700 border-red-100",
  closed: "bg-gray-50 text-gray-500 border-gray-100",
};

const stagePill: Record<string, string> = {
  registration: "bg-amber-50 text-amber-700 border-amber-100",
  active: "bg-blue-50 text-blue-700 border-blue-100",
  verification: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllProjectsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["all-projects", statusFilter, globalFilter, cursor],
    queryFn: () =>
      ProjectService.getProjects({
        projectStatus: statusFilter === "all" ? undefined : statusFilter,
        name: globalFilter || undefined,
        cursor: cursor || undefined,
        limit: 10,
      }),
  });

  const projects = data?.data || [];
  const nextCursor = data?.nextCursor;

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Project Detail",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-tight">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest mt-0.5">
                  {p.code}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "projectType",
        header: "Type & Sector",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700 capitalize">
              {(row.getValue("projectType") as string).replace(/_/g, " ")}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {row.original.sector.replace(/_/g, " ")}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "projectStatus",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("projectStatus") as string;
          return (
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg font-bold text-[9px] uppercase tracking-wider px-2 py-0.5",
                statusPill[status],
              )}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "projectStage",
        header: "Stage",
        cell: ({ row }) => {
          const stage = row.getValue("projectStage") as string;
          return (
            <Badge
              variant="outline"
              className={cn(
                "rounded-lg font-bold text-[9px] uppercase tracking-wider px-2 py-0.5",
                stagePill[stage],
              )}
            >
              {stage}
            </Badge>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <MapPin className="h-3 w-3 text-[#2cc295]" />
            {row.original.region}, {row.original.country}
          </div>
        ),
      },
      {
        accessorKey: "totalAreaHectares",
        header: "Area (HA)",
        cell: ({ row }) => (
          <div className="text-xs font-bold text-slate-800">
            {Number(row.getValue("totalAreaHectares")).toFixed(2)}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl text-[#131927]"
            >
              <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest px-3 py-2 font-black">
                Project Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/project-profile/${row.original.id}`)
                }
                className="gap-2 rounded-lg cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 text-slate-400" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <Activity className="h-4 w-4 text-slate-400" /> MRV Telemetry
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-myGreen rounded-lg cursor-pointer font-bold">
                <ShieldCheck className="h-4 w-4" /> Verify Assets
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
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <SectionLabel label="Asset Oversight" delay={0.05} />
          <h1
            className="text-4xl font-extrabold text-[#131927] tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Project Registry
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-md">
            Complete inventory of carbon sequestration assets. Monitor
            verification stages and approve projects for marketplace listing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2cc295] transition-colors" />
            <Input
              placeholder="Search by project name..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setCursor(null); // Reset pagination on search
              }}
              className="w-full md:w-64 pl-10 rounded-xl border-slate-200 focus:border-[#2cc295] focus:ring-1 focus:ring-[#2cc295] transition-all bg-white"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCursor(null);
            }}
          >
            <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push("/new-project")}
            className="rounded-xl bg-[#131927] hover:bg-[#1e2d42] font-bold gap-2"
          >
            <Plus className="h-4 w-4" /> Register Project
          </Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 h-14 text-center first:text-left"
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 rounded-full border-2 border-emerald-50 border-t-emerald-500 animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Compiling registry records...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : projects.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-4 text-center first:text-left"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Leaf className="h-10 w-10 text-slate-200" />
                    <p className="font-bold text-slate-400">
                      No projects found.
                    </p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your filters or register a new asset.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium tracking-tight">
            Showing{" "}
            <span className="font-bold text-slate-900">{projects.length}</span>{" "}
            assets
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-8 w-8 p-0 border-slate-200"
              disabled={!cursor}
              onClick={() => {
                // For simplicity in cursor pagination without back-pointers,
                // we just reset to start or you'd need a stack of cursors.
                setCursor(null);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-8 w-8 p-0 border-slate-200"
              disabled={!nextCursor}
              onClick={() => setCursor(nextCursor)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
