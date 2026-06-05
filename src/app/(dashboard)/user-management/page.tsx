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
  ChevronLeft,
  ChevronRight,
  Filter,
  Key,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Shield,
  UserCheck,
  UserCircle,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { InviteAdminModal } from "@/components/InviteAdminModal";
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
import { authClient } from "@/lib/auth";
import { UserService } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";
import { SectionLabel } from "../dashboard/_components/ProjectOwnerDashboard";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string | null;
  countryOfOperation: string | null;
  role: string | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const roleBadgeStyles: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 border-purple-200",
  financial_admin: "bg-blue-100 text-blue-700 border-blue-200",
  mrv_admin: "bg-amber-100 text-amber-700 border-amber-200",
  project_manager: "bg-emerald-100 text-emerald-700 border-emerald-200",
  project_owner: "bg-slate-100 text-slate-700 border-slate-200",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user as any;
  const isSuperAdmin = sessionUser?.role === "super_admin";
  const router = useRouter();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // UsersTab moved inside UserManagementPage to share modal state
  function UsersTab() {
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [globalFilter, setGlobalFilter] = useState("");
    const router = useRouter();

    const { data, isLoading } = useQuery({
      queryKey: ["users", roleFilter],
      queryFn: () =>
        UserService.listUsers(
          roleFilter === "all" ? undefined : { role: roleFilter },
        ),
    });

    const users = data?.data || [];

    const columns = useMemo<ColumnDef<User>[]>(
      () => [
        {
          accessorKey: "name",
          header: "User",
          cell: ({ row }) => {
            const u = row.original;
            const initial = u.firstName.charAt(0).toUpperCase();
            return (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                  {initial}
                </div>
                <div>
                  <div className="font-bold text-slate-900 leading-none mb-1">
                    {u.firstName} {u.lastName}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {u.email}
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "role",
          header: "Role",
          cell: ({ row }) => {
            const role = (row.getValue("role") as string) || "No Role";
            const label = role
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            return (
              <Badge
                variant="outline"
                className={cn(
                  "rounded-lg font-bold text-[10px] uppercase tracking-wider px-2 py-0.5",
                  roleBadgeStyles[role] || "bg-gray-100 text-gray-700",
                )}
              >
                {label}
              </Badge>
            );
          },
        },
        {
          accessorKey: "contactNumber",
          header: "Contact",
          cell: ({ row }) => (
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-slate-400" />
              {row.getValue("contactNumber") || "N/A"}
            </div>
          ),
        },
        {
          accessorKey: "createdAt",
          header: "Joined",
          cell: ({ row }) => (
            <div className="text-xs text-slate-500">
              {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
            </div>
          ),
        },
        {
          accessorKey: "isActive",
          header: "Status",
          cell: ({ row }) => {
            const active = row.getValue("isActive") as boolean;
            return (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-red-400",
                  )}
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
            );
          },
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
                  Admin Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(`/profile/${row.original.id}`)}
                  className="gap-2 rounded-lg cursor-pointer"
                >
                  <UserCircle className="h-4 w-4 text-slate-400" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                  <Shield className="h-4 w-4 text-slate-400" /> Manage Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700 font-bold">
                  <UserX className="h-4 w-4" /> Deactivate User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ],
      [router.push],
    );

    const table = useReactTable({
      data: users,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        globalFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2cc295] transition-colors" />
            <Input
              placeholder="Search users..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full md:w-64 pl-10 rounded-xl border-slate-200 focus:border-[#2cc295] focus:ring-1 focus:ring-[#2cc295] transition-all bg-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48 rounded-xl border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="All Roles" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="financial_admin">Financial Admin</SelectItem>
              <SelectItem value="mrv_admin">MRV Admin</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
              <SelectItem value="project_owner">Project Owner</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 font-bold gap-2 text-xs"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <Mail className="h-3.5 w-3.5" /> Invite Admin
          </Button>
          <Button
            onClick={() => router.push("/project-owners/register")}
            className="rounded-xl bg-[#131927] hover:bg-[#1e2d42] font-bold gap-2"
          >
            <UserCheck className="h-4 w-4" /> Onboard Project Owner
          </Button>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 h-14"
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
                        Loading participant records...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
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
                      <UserX className="h-10 w-10 text-slate-200" />
                      <p className="font-bold text-slate-400">
                        No participants found.
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters or adding a new user.
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
              <span className="font-bold text-slate-900">
                {table.getRowModel().rows.length}
              </span>{" "}
              participants
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 w-8 p-0 border-slate-200"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 w-8 p-0 border-slate-200"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <SectionLabel label="Administrative Control" delay={0.05} />
          <h1
            className="text-4xl font-extrabold text-[#131927] tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Access & Identity
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-md font-medium leading-relaxed">
            Manage platform participants, define high-integrity roles, and
            configure granular permissions for the carbon ecosystem.
          </p>
        </div>
        <div className="flex gap-3">
          {isSuperAdmin && (
            <Button
              variant="outline"
              asChild
              className="rounded-xl border-slate-200 font-black uppercase tracking-widest text-[10px] h-12 px-6"
            >
              <Link href="/user-management/roles">
                <Key className="w-3.5 h-3.5 mr-2" /> Manage IAM Roles
              </Link>
            </Button>
          )}
        </div>
      </div>

      <UsersTab />
    </div>
  );
}
