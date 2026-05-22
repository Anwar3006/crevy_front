"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Lock,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  UserCheck,
  UserCircle,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth";
import { RBACService } from "@/lib/services/rbac-service";
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

interface Permission {
  id: number;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string | null;
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

  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <SectionLabel label="Administrative Control" delay={0.05} />
          <h1
            className="text-4xl font-extrabold text-[#131927] tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Access & Identity
          </h1>
          <p className="mt-2 text-slate-500 text-sm max-w-md">
            Manage platform participants, define high-integrity roles, and
            configure granular permissions for the carbon ecosystem.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-slate-100/50 p-1 rounded-xl w-full sm:w-auto h-auto">
          <TabsTrigger
            value="users"
            className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider"
          >
            <UserCircle className="w-3.5 h-3.5 mr-2" /> Admins & Users
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger
              value="rbac"
              className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider"
            >
              <Key className="w-3.5 h-3.5 mr-2" /> IAM
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UsersTab />
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="rbac" className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-bold text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Platform Permissions
                </h2>
                <AddPermissionModal
                  onSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["permissions"] })
                  }
                />
              </div>
              <PermissionsTable />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <h2
                  className="text-xl font-bold text-[#131927]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Security Roles
                </h2>
                <AddRoleModal
                  onSuccess={() =>
                    queryClient.invalidateQueries({ queryKey: ["roles"] })
                  }
                />
              </div>
              <RolesTable />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ─── Users Tab ───────────────────────────────────────────────────────────────

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

// ─── RBAC Components ─────────────────────────────────────────────────────────

function PermissionsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: RBACService.getPermissions,
  });

  const permissions = useMemo(() => {
    const raw = data?.data || [];
    const unique = new Map();
    for (const p of raw) {
      const key = `${p.resource}:${p.action}`;
      if (!unique.has(key)) {
        unique.set(key, p);
      }
    }
    return Array.from(unique.values()) as Permission[];
  }, [data]);

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      {
        accessorKey: "resource",
        header: "Resource",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700">
              {row.getValue("resource")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 font-mono text-[10px]"
          >
            {row.getValue("action")}
          </Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 truncate max-w-xs block">
            {row.getValue("description") || "No description provided."}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 h-12"
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
                className="h-32 text-center text-xs text-slate-400"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : permissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-xs text-slate-400"
              >
                No permissions found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function RolesTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: RBACService.getRoles,
  });

  const roles = data?.data || [];

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700 capitalize">
              {(row.getValue("name") as string).toString().replace(/_/g, " ")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {row.getValue("description")}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 h-12"
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
                className="h-32 text-center text-xs text-slate-400"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-xs text-slate-400"
              >
                No roles found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Modals ──────────────────────────────────────────────────────────────────

function AddPermissionModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: RBACService.createPermission,
    onSuccess: () => {
      toast.success("Permission created successfully");
      onSuccess();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create permission");
    },
    onSettled: () => setLoading(false),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      resource: formData.get("resource") as string,
      action: formData.get("action") as string,
      description: (formData.get("description") as string) || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 font-bold gap-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add Permission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-[#131927] p-8 text-white">
          <div className="h-12 w-12 rounded-2xl bg-[#2cc295]/20 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#2cc295]" />
          </div>
          <DialogTitle
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Create Permission
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Define a new platform resource and authorized action.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="resource"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Resource Name
              </Label>
              <Input
                id="resource"
                name="resource"
                placeholder="e.g. project, credit, user"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="action"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Action Type
              </Label>
              <Input
                id="action"
                name="action"
                placeholder="e.g. create, edit, delete, manage"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this permission allows..."
                className="rounded-xl resize-none h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2cc295] hover:bg-[#178a74] rounded-xl font-bold"
            >
              {loading ? "Creating..." : "Save Permission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddRoleModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: RBACService.createRole,
    onSuccess: () => {
      toast.success("Role created successfully");
      onSuccess();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create role");
    },
    onSettled: () => setLoading(false),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 font-bold gap-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add New Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-[#131927] p-8 text-white">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <DialogTitle
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Define New Role
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Create a security identity that can be assigned to platform users.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Internal Key (Snake Case)
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. regional_manager"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Purpose & Responsibilities
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What is this role responsible for?"
                required
                className="rounded-xl resize-none h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
            >
              {loading ? "Creating..." : "Save Role Definition"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
