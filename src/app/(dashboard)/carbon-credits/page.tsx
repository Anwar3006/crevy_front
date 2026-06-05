"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Activity,
  ArrowRightLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  Info,
  Layers,
  Leaf,
  Loader2,
  Search,
  ShieldCheck,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { CreditService } from "@/lib/services/credit-service";
import { cn } from "@/lib/utils";

export default function CarbonCreditsLedgerPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["carbon-credits-ledger", statusFilter],
    queryFn: () =>
      CreditService.getCarbonCredits({
        creditStatus:
          statusFilter === "all" ? undefined : (statusFilter as any),
        limit: 50,
      }),
  });

  const credits = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
        <div className="max-w-2xl">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Activity size={14} /> Immutable Impact Ledger
          </p>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
            Carbon <br /> Credits
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-6 leading-relaxed">
            Detailed tracking of individual carbon credit serial numbers,
            issuance batches, and ownership history.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search serial numbers, batches, or projects..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-slate-200 focus:ring-emerald-500/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 h-12 rounded-2xl border-slate-200 bg-white font-bold text-xs">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent h-16">
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Serial Number
                </TableHead>
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Batch ID
                </TableHead>
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Vintage
                </TableHead>
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Amount (t)
                </TableHead>
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </TableHead>
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Accessing Ledger Data...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : credits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <p className="text-sm font-bold text-slate-400">
                      No records found.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                credits.map((c: any) => (
                  <TableRow
                    key={c.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="px-8 py-6 font-mono text-[11px] font-bold text-slate-600">
                      {c.serialNumber || `SN-${c.id.slice(0, 8)}`}
                    </TableCell>
                    <TableCell className="px-8 py-6 font-mono text-[11px] text-slate-400">
                      {c.mrv_batch_id.slice(0, 12)}...
                    </TableCell>
                    <TableCell className="px-8 py-6 font-black text-slate-900 text-sm">
                      {c.creditVintage}
                    </TableCell>
                    <TableCell className="px-8 py-6 font-black text-emerald-600 text-lg italic">
                      {parseFloat(c.availableAmount).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border-none",
                          c.creditStatus === "available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700",
                        )}
                      >
                        {c.creditStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-slate-400 hover:text-slate-900"
                        asChild
                      >
                        <Link href={`/portfolio/retire/${c.id}`}>
                          <ArrowRightLeft size={16} />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Institutional Proof-of-Ownership Guaranteed
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-10 px-4 border-slate-200"
              >
                <ChevronLeft size={16} className="mr-2" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-10 px-4 border-slate-200"
              >
                Next <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
