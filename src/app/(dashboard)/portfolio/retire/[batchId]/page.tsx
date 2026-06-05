"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditService } from "@/lib/services/credit-service";

export default function CreditRetirementPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const router = useRouter();
  const [isRetiring, setIsRetiring] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    reason: "",
  });

  // 1. Fetch the specific credit batch for context
  // Note: We use getCarbonCredits with ID filter as a proxy for getBatch
  const { data: creditRes, isLoading } = useQuery({
    queryKey: ["credit-batch", batchId],
    queryFn: () => CreditService.getCarbonCredits({ id: batchId }),
    enabled: !!batchId,
  });

  const credit = creditRes?.data?.[0];

  const handleRetire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.amount <= 0 ||
      formData.amount > parseFloat(credit?.availableAmount || "0")
    ) {
      toast.error("Invalid retirement amount");
      return;
    }

    setIsRetiring(true);
    try {
      await CreditService.retireCredits(batchId as string, {
        quantity: formData.amount,
        reason: formData.reason,
      });
      toast.success("Credits successfully retired.");
      router.push("/portfolio");
    } catch (err: any) {
      toast.error(err.message || "Retirement protocol failed");
    } finally {
      setIsRetiring(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse font-black uppercase text-slate-400">
        Loading Batch...
      </div>
    );
  if (!credit)
    return (
      <div className="p-20 text-center font-black uppercase text-red-500">
        Batch Not Found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Registry
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Retirement Flow
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Permanently burn carbon credits from the active registry to claim
              legitimate environmental offsets.
            </p>
          </div>

          <form
            onSubmit={handleRetire}
            className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm space-y-8"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Retirement Volume (tCO2e)
                </Label>
                <span className="text-[10px] font-bold text-emerald-600">
                  Available: {credit.availableAmount} t
                </span>
              </div>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="h-16 text-3xl font-black rounded-2xl border-slate-100"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Retirement Beneficiary / Reason
              </Label>
              <Textarea
                placeholder="e.g. Offsetting 2025 Scope 1 Logistics Emissions"
                className="rounded-2xl border-slate-100 min-h-32 resize-none p-6 font-medium"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4">
              <ShieldAlert className="text-red-500 shrink-0" size={20} />
              <p className="text-[11px] text-red-700 font-bold leading-relaxed uppercase italic">
                Warning: Retirement is irreversible. These credits will be
                removed from circulation and anchored as retired on the public
                ledger.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isRetiring}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-900/20"
            >
              {isRetiring ? "Executing Burn Protocol..." : "Execute Retirement"}{" "}
              <Flame size={16} className="ml-2" />
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={80} className="text-emerald-400" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8">
              Asset context
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">
                  Serial Batch
                </p>
                <p className="font-mono text-xs text-white/70 break-all">
                  {batchId}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">
                  Vintage
                </p>
                <p className="font-black text-white">{credit.creditVintage}</p>
              </div>
            </div>

            <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed flex items-start gap-3">
                <Info size={16} className="text-emerald-500 flex-shrink-0" />
                Retired assets generate an immutable certificate available in
                your ESG Reports section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
