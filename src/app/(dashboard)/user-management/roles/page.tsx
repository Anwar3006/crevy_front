"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, Key, Lock, Plus, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { RBACService } from "@/lib/services/rbac-service";

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

export default function RolesManagementPage() {
  const queryClient = useQueryClient();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
        <div className="max-w-2xl">
          <Link
            href="/user-management"
            className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-4 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to User Management
          </Link>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Key size={14} /> IAM & Access Control
          </p>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
            Security <br /> Roles
          </h1>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
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

        <div className="space-y-6 border-t border-slate-100 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              System Roles
            </h2>
            <AddRoleModal
              onSuccess={() =>
                queryClient.invalidateQueries({ queryKey: ["roles"] })
              }
            />
          </div>
          <RolesTable />
        </div>
      </div>
    </div>
  );
}

// ─── RBAC Tables ─────────────────────────────────────────────────────────────

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
      if (!unique.has(key)) unique.set(key, p);
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
            className="bg-slate-100 text-slate-700 font-mono text-[10px] rounded-lg"
          >
            {row.getValue("action")}
          </Badge>
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
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50 h-14">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-8"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-32 text-center text-xs font-bold text-slate-300 uppercase animate-pulse"
              >
                Synchronizing Permissions...
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-8 py-4">
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
        header: "Role Identity",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700 capitalize">
              {(row.getValue("name") as string).replace(/_/g, " ")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Purpose",
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
    <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50 h-14">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-8"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="h-32 text-center text-xs font-bold text-slate-300 uppercase animate-pulse"
              >
                Mapping Role Identities...
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-8 py-4">
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

// ─── RBAC Modals ─────────────────────────────────────────────────────────────

function AddPermissionModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: RBACService.createPermission,
    onSuccess: () => {
      toast.success("Permission anchored successfully");
      onSuccess();
      setOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to create permission"),
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
        <Button className="rounded-xl bg-slate-900 hover:bg-black font-bold gap-2 text-xs h-10 px-6">
          <Plus size={16} /> New Permission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-slate-900 p-8 text-white">
          <DialogTitle className="text-2xl font-black uppercase italic italic tracking-tighter">
            Create Permission
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium">
            Define a new platform resource and authorized action.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Resource Name
              </Label>
              <Input
                name="resource"
                placeholder="e.g. project, credit"
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Action Type
              </Label>
              <Input
                name="action"
                placeholder="e.g. create, delete"
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Description
              </Label>
              <Textarea
                name="description"
                placeholder="Purpose of this permission..."
                className="rounded-xl resize-none h-24"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/20"
          >
            {loading ? "Anchoring..." : "Save Permission"}
          </Button>
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
      toast.success("Role identity finalized");
      onSuccess();
      setOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to create role"),
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
        <Button className="rounded-xl bg-purple-600 hover:bg-purple-700 font-bold gap-2 text-xs h-10 px-6 shadow-lg shadow-purple-900/20">
          <Plus size={16} /> Define New Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-slate-900 p-8 text-white">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            New Security Identity
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium">
            Create a role that can be assigned to platform users.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Internal Key (Snake Case)
              </Label>
              <Input
                name="name"
                placeholder="e.g. regional_manager"
                required
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Purpose
              </Label>
              <Textarea
                name="description"
                placeholder="Responsibilities of this role..."
                required
                className="rounded-xl resize-none h-24"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-900/20"
          >
            {loading ? "Processing..." : "Finalize Role Definition"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
