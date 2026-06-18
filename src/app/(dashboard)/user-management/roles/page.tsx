"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, Key, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";

export const runtime = "edge";

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
  const [activeTab, setActiveTab] = useState<"permissions" | "roles">(
    "permissions",
  );
  const queryClient = useQueryClient();

  return (
    <div className="animate-in fade-in duration-700 pb-24 bg-slate-50 min-h-screen">
      {/* ── Editorial Header ── */}
      <div className="border-b border-slate-200 bg-white pt-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Link
            href="/user-management"
            className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-8 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Identity Ledger
          </Link>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-slate-900"></div>
            <span className="text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Key size={14} className="text-emerald-700" /> IAM & Security
              Protocol
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-12">
            System <span className="italic text-slate-500">Governance.</span>
          </h1>

          {/* ── Tabs ── */}
          <div className="flex gap-8 border-b border-slate-200 mt-8">
            <button
              type="button"
              onClick={() => setActiveTab("permissions")}
              className={cn(
                "pb-4 text-[10px] font-bold uppercase tracking-widest transition-colors",
                activeTab === "permissions"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700",
              )}
            >
              Resource Permissions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roles")}
              className={cn(
                "pb-4 text-[10px] font-bold uppercase tracking-widest transition-colors",
                activeTab === "roles"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700",
              )}
            >
              Identity Roles
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        {activeTab === "permissions" ? (
          <PermissionsGrid
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["permissions"] })
            }
          />
        ) : (
          <RolesTable
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["roles"] })
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── PERMISSIONS GRID (Resource Clustered) ───────────────────────────────────

function PermissionsGrid({ onSuccess }: { onSuccess: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: RBACService.getPermissions,
  });

  const groupedPermissions = useMemo(() => {
    const raw = data?.data || [];
    const map = new Map<string, Permission[]>();
    for (const p of raw) {
      if (!map.has(p.resource)) map.set(p.resource, []);
      map.get(p.resource)!.push(p);
    }
    return Array.from(map.entries());
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Resource Matrix
        </h2>
        <AddPermissionModal onSuccess={onSuccess} />
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center border border-slate-200 bg-white">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
            Compiling Security Matrix...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedPermissions.map(([resource, perms]) => (
            <div
              key={resource}
              className="bg-white border border-slate-200 flex flex-col hover:border-slate-900 transition-colors"
            >
              <div className="p-6 border-b border-slate-100 flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-emerald-500 rounded-none shrink-0" />
                  <h3 className="font-serif text-2xl text-slate-900 capitalize tracking-tight">
                    {resource}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {perms.map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700"
                    >
                      {p.action}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200">
                <AddPermissionModal
                  defaultResource={resource}
                  onSuccess={onSuccess}
                  variant="inline"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROLES TABLE ─────────────────────────────────────────────────────────────

function RolesTable({ onSuccess }: { onSuccess: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: RBACService.getRoles,
  });
  const roles = data?.data || [];

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Identity Key",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-widest">
            {(row.getValue("name") as string).replace(/_/g, " ")}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Purpose / Description",
        cell: ({ row }) => (
          <span className="text-sm text-slate-500 font-light">
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Clearance Levels
        </h2>
        <AddRoleModal onSuccess={onSuccess} />
      </div>

      <div className="border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-b-2 border-slate-900 hover:bg-slate-50"
              >
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 h-14 px-6"
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
                <TableCell colSpan={2} className="h-64 text-center">
                  <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                    Mapping Identities...
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── RBAC Modals (Institutional Redesign) ────────────────────────────────────

function AddPermissionModal({
  onSuccess,
  defaultResource = "",
  variant = "default",
}: {
  onSuccess: () => void;
  defaultResource?: string;
  variant?: "default" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await RBACService.createPermission({
        resource: formData.get("resource") as string,
        action: formData.get("action") as string,
        description: (formData.get("description") as string) || null,
      });
      toast.success("Security instruction anchored.");
      onSuccess();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Protocol Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "inline" ? (
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 w-full justify-center py-2"
          >
            <Plus size={12} /> Bind New Action
          </button>
        ) : (
          <Button className="rounded-none bg-slate-900 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6 transition-colors">
            <Plus size={14} className="mr-2" /> Define Global Permission
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 rounded-none border border-slate-900 shadow-2xl gap-0 bg-white">
        <DialogHeader className="p-8 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Security Configuration
            </span>
          </div>
          <DialogTitle className="text-3xl font-serif text-slate-900 tracking-tight leading-none mb-2">
            Bind Permission.
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-light text-sm">
            Define a specific operational action for a target system resource.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Target Resource
              </Label>
              <Input
                name="resource"
                defaultValue={defaultResource}
                placeholder="e.g. project, ledger"
                required
                readOnly={!!defaultResource}
                className={cn(
                  "rounded-none border-0 border-b-2 border-slate-200 bg-slate-50 px-4 py-6 font-mono text-sm focus-visible:ring-0 focus-visible:border-slate-900 transition-colors",
                  defaultResource ? "text-slate-500" : "text-slate-900",
                )}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Allowable Action
              </Label>
              <Input
                name="action"
                placeholder="e.g. read, approve, delete"
                required
                className="rounded-none border-0 border-b-2 border-slate-200 bg-slate-50 px-4 py-6 font-mono text-sm text-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description (Optional)
              </Label>
              <Textarea
                name="description"
                placeholder="Documentation for this instruction..."
                className="rounded-none border-2 border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm text-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 transition-colors resize-none h-24"
              />
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-none text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-none bg-slate-900 hover:bg-emerald-900 text-white px-8 py-6 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              {loading ? "Anchoring..." : "Save Instruction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddRoleModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await RBACService.createRole({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      });
      toast.success("Identity role formulated.");
      onSuccess();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Formulation Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-none bg-slate-900 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6 transition-colors">
          <Plus size={14} className="mr-2" /> Formulate New Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 rounded-none border border-slate-900 shadow-2xl gap-0 bg-white">
        <DialogHeader className="p-8 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={20} className="text-slate-900" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Security Configuration
            </span>
          </div>
          <DialogTitle className="text-3xl font-serif text-slate-900 tracking-tight leading-none mb-2">
            Formulate Identity.
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-light text-sm">
            Define a new clearance level to map to system actors.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Clearance Key (Snake_Case)
              </Label>
              <Input
                name="name"
                placeholder="e.g. regional_auditor"
                required
                className="rounded-none border-0 border-b-2 border-slate-200 bg-slate-50 px-4 py-6 font-mono text-sm text-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Purpose / Scope
              </Label>
              <Textarea
                name="description"
                placeholder="Responsibilities and limits of this clearance level..."
                required
                className="rounded-none border-2 border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm text-slate-900 focus-visible:ring-0 focus-visible:border-slate-900 transition-colors resize-none h-24"
              />
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-none text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-none bg-slate-900 hover:bg-emerald-900 text-white px-8 py-6 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              {loading ? "Formulating..." : "Initialize Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
