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
  return (
    <div className="bg-white border border-slate-200 rounded-none p-8 shadow-sm group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Market Value Index
          </h3>
          <p className="text-[9px] font-mono text-slate-500 uppercase mt-1">
            Average trade price per tCO2e (12M)
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono font-bold text-slate-900 leading-none tabular-nums">
            $52.00
          </p>
          <p className="text-[9px] font-mono font-bold text-brand uppercase mt-1">
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
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#64748b" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#64748b" }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0px",
                backgroundColor: "#020617",
                color: "#ffffff",
                border: "1px solid #1e293b",
                fontSize: "10px",
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
              cursor={{ stroke: "#f59e0b", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#020617" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1200}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
