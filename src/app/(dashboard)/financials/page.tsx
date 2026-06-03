"use client";

// Consolidated all icons into lucide-react to prevent package errors
import {
  ArrowRight,
  FileSignature,
  Landmark,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function FinancialsDashboard() {
  const cards = [
    {
      title: "Payout Ledger",
      desc: "Track institutional disbursements, project yield settlements, and registry fees.",
      // Replaced with Lucide equivalent
      icon: Landmark,
      url: "/financials/payouts",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Contract Registry",
      desc: "Manage legal artifacts, purchase agreements, and framework contracts.",
      // Replaced with Lucide equivalent
      icon: FileSignature,
      url: "/financials/contracts",
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <div className="max-w-2xl border-b border-slate-200 pb-12">
        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <ShieldCheck size={14} /> Institutional Financial Governance
        </p>
        <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
          Financial <br /> Control Center
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, i) => {
          // Extract the icon component so React treats it as a component
          const Icon = card.icon;

          return (
            <Link
              key={i}
              href={card.url}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-12 hover:shadow-2xl hover:border-emerald-500/30 transition-all group cursor-pointer block outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <div
                className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}
              >
                {/* Render the extracted component */}
                <Icon size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                {card.title}
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                {card.desc}
              </p>
              <div className="p-0 text-slate-900 font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all inline-flex items-center">
                Enter Module <ArrowRight size={16} className="ml-2" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Summary Stats ── */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <Zap size={140} className="text-emerald-400" />
        </div>
        <div className="space-y-4 text-center lg:text-left relative z-10">
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em]">
            Settlement Efficiency
          </p>
          <h3 className="text-4xl font-black italic uppercase leading-none tracking-tight">
            Real-Time <br /> Registry Liquidity
          </h3>
        </div>
        <div className="flex gap-20 relative z-10">
          <div className="text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase mb-2">
              Total Managed
            </p>
            <p className="text-4xl font-black">$2.4M</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-[10px] font-black uppercase mb-2">
              Yield Index
            </p>
            <p className="text-4xl font-black text-emerald-400">+12%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
