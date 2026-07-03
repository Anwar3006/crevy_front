"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Flame,
  Globe2,
  Loader2,
  ShieldAlert,
  Wallet,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { CreditService } from "@/lib/services/credit-service";

function CreditRetirementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "mobile_money" | "wire"
  >("card");
  const [formData, setFormData] = useState({
    amount: 0,
    beneficiary: "",
    reason: "",
  });

  const { data: creditRes, isLoading } = useQuery({
    queryKey: ["credit-batch", batchId],
    queryFn: () => CreditService.getCarbonCredits({ id: batchId! }),
    enabled: !!batchId,
  });

  const credit = creditRes?.data?.[0];

  const handleCheckoutAndRetire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !batchId ||
      formData.amount <= 0 ||
      formData.amount > parseFloat(credit?.availableAmount || "0")
    ) {
      return toast.error("Invalid retirement volume specified.");
    }

    setIsProcessing(true);
    try {
      await CreditService.retireCredits(batchId as string, {
        quantity: formData.amount,
        reason: `${formData.beneficiary} - ${formData.reason}`,
      });

      toast.success("Transaction verified. Assets successfully burned.");
      router.push("/portfolio");
    } catch (err: any) {
      toast.error(
        err.message || "Protocol execution failed. No funds captured.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm uppercase tracking-widest text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Initiating Checkout Session...
      </div>
    );
  }

  if (!credit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-sm uppercase tracking-widest text-red-500">
        <XCircle className="w-10 h-10 mb-4" />
        Asset Batch Not Found.
      </div>
    );
  }

  // Simulated Pricing for the UI
  const networkFeePerTon = 1.5;
  const totalFee = formData.amount * networkFeePerTon;

  return (
    <div className="min-h-screen bg-muted font-sans">
      {/* Top Navigation */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Cancel & Return
          </button>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Globe2 size={12} /> SECURE CHECKOUT
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* ── LEFT: The Form & Payment ── */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h1 className="text-3xl font-sans text-foreground tracking-tight mb-2">
                Execution Details
              </h1>
              <p className="text-muted-foreground text-sm">
                Specify the retirement parameters and complete payment for the
                network execution fees.
              </p>
            </div>

            <form
              id="retirement-form"
              onSubmit={handleCheckoutAndRetire}
              className="space-y-8"
            >
              {/* Volume Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-900 pb-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                    Retirement Volume
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    MAX AVAILABLE: {credit.availableAmount} tCO₂e
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-transparent text-5xl font-mono text-foreground placeholder:text-slate-200 outline-none"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute right-0 bottom-2 text-xl font-sans text-muted-foreground">
                    tCO₂e
                  </span>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label
                    htmlFor="corporate-beneficiary"
                    className="text-[11px] font-bold uppercase tracking-widest text-foreground"
                  >
                    Corporate Beneficiary
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="corporate-beneficiary"
                      type="text"
                      placeholder="e.g. Acme Corporation PLC"
                      value={formData.beneficiary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          beneficiary: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-none outline-none focus:border-slate-900 transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                    Public Retirement Reason
                  </div>
                  <textarea
                    placeholder="e.g. Offsetting 2025 Scope 1 & 2 Logistics Emissions."
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full p-4 bg-white border border-border rounded-none outline-none focus:border-slate-900 transition-colors text-sm min-h-24 resize-none"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Order Summary / Context ── */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border p-8 sticky top-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-6 border-b border-border pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 font-mono text-sm text-slate-600 mb-8">
                <div className="flex justify-between">
                  <span>Target Asset Batch</span>
                  <span
                    className="text-foreground truncate ml-4"
                    title={batchId || ""}
                  >
                    {batchId ? `${batchId.slice(0, 12)}...` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vintage</span>
                  <span className="text-foreground">{credit.creditVintage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Requested</span>
                  <span className="text-foreground">
                    {formData.amount || 0} tCO₂e
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fee ($1.50/t)</span>
                  <span>${totalFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-y border-border py-4 mb-8 flex justify-between items-center">
                <span className="text-sm font-sans text-foreground">
                  Total Due Today
                </span>
                <span className="text-3xl font-mono font-bold text-foreground">
                  ${totalFee.toFixed(2)}
                </span>
              </div>

              {/* Financial Disclosure / Warning */}
              <div className="bg-muted p-4 border-l-2 border-slate-400 mb-8">
                <div className="flex gap-3">
                  <ShieldAlert
                    className="text-muted-foreground shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-[10px] text-slate-600 leading-relaxed font-sans italic">
                    By confirming this transaction, you authorize the permanent
                    cryptographic burn of these assets. This action is immutable
                    and cannot be reversed. A public ESG certificate will be
                    minted to the blockchain.
                  </p>
                </div>
              </div>

              <button
                form="retirement-form"
                type="submit"
                disabled={isProcessing || formData.amount <= 0}
                className="w-full flex items-center justify-between px-6 py-4 bg-secondary text-white font-bold uppercase tracking-widest text-[11px] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>
                  {isProcessing ? "Processing Payment..." : "Pay & Execute"}
                </span>
                {isProcessing ? (
                  <Flame size={16} className="animate-pulse" />
                ) : (
                  <ArrowLeft size={16} className="rotate-180" />
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <CheckCircle2 size={12} /> Encrypted & Secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreditRetirementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-10 h-10 text-foreground animate-spin" />
        </div>
      }
    >
      <CreditRetirementContent />
    </Suspense>
  );
}
