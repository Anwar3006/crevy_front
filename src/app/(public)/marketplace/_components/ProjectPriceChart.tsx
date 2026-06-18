"use client";

import {
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PricePoint {
  month: string;
  price: number;
}

export default function ProjectPriceChart({ data }: { data: PricePoint[] }) {
  // Use clinical styling for the institutional chart
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm group">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
            Market Value Index
          </h3>
          <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
            Average trade price per tCO2e (12M)
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-900 leading-none">
            $52.00
          </p>
          <p className="text-[9px] font-black text-emerald-500 uppercase mt-1">
            +4.2% YOY
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: "#94a3b8" }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
              cursor={{ stroke: "#10b981", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
