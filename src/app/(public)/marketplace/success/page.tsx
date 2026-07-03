"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = searchParams.get("amount");
  const qty = searchParams.get("qty");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full text-center space-y-8"
    >
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-100/50">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl font-black text-foreground uppercase italic tracking-tighter">
          Acquisition <br /> Confirmed
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-sm mx-auto leading-relaxed">
          Your payment of{" "}
          <span className="text-foreground font-black">
            ${parseFloat(amount || "0").toLocaleString()}
          </span>{" "}
          for <span className="text-foreground font-black">{qty} tCO2e</span> has
          been successfully processed.
        </p>
      </div>

      <div className="bg-muted rounded-[2.5rem] p-10 border border-border space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Institutional Next Steps
        </p>
        <p className="text-sm text-slate-600 font-medium">
          Your assets are now visible in your private Registry Portfolio. You
          can choose to hold these credits or retire them immediately to claim
          climate offsets.
        </p>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => router.push("/portfolio")}
          className="h-14 px-10 bg-secondary hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          View Portfolio
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/marketplace")}
          className="h-14 px-10 border-border text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          <Search className="w-4 h-4 mr-2" />
          Browse More
        </Button>
      </div>

      <div className="pt-12">
        <Link
          href="/"
          className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-emerald-600 transition-colors"
        >
          Return to Landing Page
        </Link>
      </div>
    </motion.div>
  );
}

export default function MarketplaceSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
