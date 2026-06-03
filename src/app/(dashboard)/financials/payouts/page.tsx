"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Download,
  MoreVertical,
  Search,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Design Philosophy: Institutional Accountability ───────────────────────
// Stark palette, clinical grid, and monumental typography.

export default function PayoutsPage() {
  const data = [
    { name: "JAN", amount: 4000 },
    { name: "FEB", amount: 3000 },
    { name: "MAR", amount: 5000 },
    { name: "APR", amount: 2000 },
    { name: "MAY", amount: 4500 },
    { name: "JUN", amount: 6000 },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-12">
        <div className="max-w-2xl">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Wallet size={14} /> Disbursement Registry
          </p>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
            Payout <br /> History
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-6 leading-relaxed">
            Institutional tracking of all project disbursements and registry
            settlements.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-900 rounded-3xl p-8 text-white min-w-[240px] shadow-xl">
            <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1">
              Total Disbursed
            </p>
            <h2 className="text-4xl font-black tracking-tighter">$148,240</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-4">
              2026 Fiscal Year
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Chart Section ── */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Monthly Yield Disbursement
            </h3>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#0f172a"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Summary Sidebar ── */}
        <div className="space-y-6">
          <div className="bg-emerald-600 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <CheckCircle2 size={80} />
            </div>
            <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest mb-1">
              Next Scheduled Payout
            </p>
            <h3 className="text-3xl font-black tracking-tight">
              July 15, 2026
            </h3>
            <div className="mt-8 pt-8 border-t border-white/20 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-emerald-200/60 uppercase">
                  Estimated
                </p>
                <p className="text-2xl font-black">$4,200</p>
              </div>
              <button
                type="button"
                className="bg-white text-emerald-600 p-3 rounded-xl hover:bg-emerald-50 transition-all"
              >
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Recent Ledger Entries
            </h3>
            <div className="space-y-6">
              {[
                {
                  name: "Amazon Reforestation",
                  date: "June 01",
                  amount: "$1,200",
                  status: "Completed",
                },
                {
                  name: "Nairobi Biochar",
                  date: "May 28",
                  amount: "$850",
                  status: "Completed",
                },
                {
                  name: "Guanacaste Regen",
                  date: "May 15",
                  amount: "$2,400",
                  status: "Completed",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                      {item.date}
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900">
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Transaction Table ── */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Institutional Payout Registry
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                placeholder="Search References"
                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase"
              />
            </div>
            <button
              type="button"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
            >
              Export CSV <Download size={14} />
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Reference
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Project Context
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">
                Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-8 py-6 text-[11px] font-black text-slate-900 tracking-tight">
                  PAY-2026-00{i}
                </td>
                <td className="px-8 py-6">
                  <p className="text-[11px] font-black text-slate-700 uppercase">
                    Regenerative Agriculture Project B
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                    ID: 019e7409-d5dc-752e
                  </p>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                    Settled
                  </span>
                </td>
                <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  May 24, 2026
                </td>
                <td className="px-8 py-6 text-right text-[12px] font-black text-slate-900">
                  $1,420.00
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
