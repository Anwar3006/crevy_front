"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Download,
  ExternalLink,
  FileText,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

import { useUser } from "@/hooks/use-user";
import { CreditService } from "@/lib/services/credit-service";

export default function PortfolioOverview() {
  const { user } = useUser();

  // 1. Fetch Owned Credits
  const { data: creditsRes, isLoading } = useQuery({
    queryKey: ["portfolio-credits", user?.id],
    queryFn: () =>
      CreditService.getCarbonCredits({ currentOwnerId: user?.id, limit: 20 }),
    enabled: !!user?.id,
  });

  const credits = creditsRes?.data || [];
  const totalOwned = credits.reduce(
    (acc: number, curr: any) => acc + parseFloat(curr.availableAmount),
    0,
  );
  const netValue = totalOwned * 52; // Assuming market avg $52

  const handleRetire = async (id: string, amount: number) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently retire ${amount} tCO2e?`,
      )
    )
      return;

    try {
      await CreditService.retireCredits(id, { quantity: amount });
      toast.success("Credits retired and anchored on blockchain.");
    } catch (err: any) {
      toast.error(err.message || "Retirement failed");
    }
  };

  const valueTrend = [
    { day: "01", val: 4200 },
    { day: "05", val: 4500 },
    { day: "10", val: 4400 },
    { day: "15", val: 4800 },
    { day: "20", val: 5100 },
    { day: "25", val: 5350 },
    { day: "30", val: 5600 },
  ];

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse uppercase font-black tracking-[0.3em] text-slate-400">
        Syncing Registry Portfolio...
      </div>
    );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* ── Monolithic Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
        <div className="max-w-2xl">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <ShieldCheck size={14} /> Certified Institutional Portfolio
          </p>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
            Asset <br /> Registry
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-6 leading-relaxed">
            Immutable tracking of your carbon offset inventory. Every unit is
            backed by real-world telemetry and blockchain-anchored proofs of
            permanence.
          </p>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white min-w-[320px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
            <Zap size={80} className="text-emerald-400" />
          </div>
          <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-2">
            Portfolio Net Value
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black">
              ${netValue.toLocaleString()}
            </h2>
            <span className="text-slate-500 text-xs font-bold uppercase">
              USD
            </span>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400">
            <TrendingUp size={14} /> +8.2% Market Yield
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Credit Inventory (The Ledger) ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Active Credit Ledger
            </h3>
            <button
              type="button"
              className="text-[10px] font-black uppercase text-slate-900 border-b-2 border-slate-900"
            >
              View All Assets
            </button>
          </div>

          <div className="space-y-4">
            {credits.length === 0 && (
              <div className="p-12 text-center text-slate-400 uppercase font-black text-[10px] bg-slate-50 rounded-[2rem]">
                No active assets in registry.
              </div>
            )}
            {credits.map((credit: any, i: number) => (
              <motion.div
                key={credit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-[1.5rem] p-6 hover:shadow-xl hover:border-emerald-500/30 transition-all group flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Leaf size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-slate-900 truncate uppercase tracking-tight italic">
                      Carbon Unit Pool
                    </h4>
                    <BadgeCheck
                      size={14}
                      className="text-emerald-500 flex-shrink-0"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 truncate tracking-tighter">
                    BATCH: {credit.mrv_batch_id.slice(0, 12)}...
                  </p>
                </div>
                <div className="grid grid-cols-2 md:flex items-center gap-8 px-4">
                  <div className="text-center md:text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                      Volume
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {parseFloat(credit.availableAmount).toLocaleString()} t
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                      Vintage
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {credit.creditVintage}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button
                    type="button"
                    onClick={() =>
                      handleRetire(
                        credit.id,
                        parseFloat(credit.availableAmount),
                      )
                    }
                    className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    Retire
                  </button>
                  <a
                    href={`https://polygonscan.com/tx/${credit.blockchainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Proof"
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Impact Insights ── */}
        <div className="space-y-8">
          <div className="bg-emerald-50 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-50" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-700 mb-6">
              Market Performance
            </h3>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={valueTrend}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-emerald-600/60 uppercase">
                  Portfolio Alpha
                </p>
                <p className="text-2xl font-black text-emerald-900 leading-none">
                  1.24×
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-emerald-900 uppercase flex items-center gap-1">
                  <TrendingUp size={12} /> Outperforming
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Quick Exports
            </h3>
            <div className="space-y-4">
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-emerald-600" size={20} />
                  <span className="text-xs font-black text-slate-900 uppercase">
                    Q2 ESG Summary
                  </span>
                </div>
                <Download
                  size={16}
                  className="text-slate-300 group-hover:text-emerald-600 transition-colors"
                />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" size={20} />
                  <span className="text-xs font-black text-slate-900 uppercase">
                    Registry Proofs (ZIP)
                  </span>
                </div>
                <Download
                  size={16}
                  className="text-slate-300 group-hover:text-blue-600 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
