"use client";

import { motion } from "framer-motion";
import { type KeyboardEvent, useState } from "react";
import { cn } from "@/lib/utils";

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: PieSlice[];
  title: string;
  subtitle?: string;
  centerLabel?: string;
  delay?: number;
}

export const DonutChart = ({
  data,
  title,
  subtitle,
  centerLabel,
  delay = 0,
}: DonutChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 60;
  const r = 38;
  const cx = 80;
  const cy = 80;

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = total > 0 ? (d.value / total) * 2 * Math.PI : 0;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;

    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);

    const ix1 = cx + r * Math.cos(startAngle);
    const iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(endAngle);
    const iy2 = cy + r * Math.sin(endAngle);

    const large = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    return {
      ...d,
      path,
      pct: total > 0 ? Math.round((d.value / total) * 100) : 0,
      i,
    };
  });

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHovered(hovered === index ? null : index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-6">
        <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider">
          {title}
        </h4>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 lg:flex-row">
        {/* Donut Visual */}
        <div className="relative shrink-0">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            aria-label={`Interactive donut chart: ${title}`}
          >
            <title>{title}</title>
            {slices.map((s) => (
              /* Use a <g> tag with role="button" to satisfy a11y requirements */
              <g
                key={s.i}
                role="button"
                tabIndex={0}
                aria-label={`${s.label}: ${s.pct}%`}
                aria-pressed={hovered === s.i}
                onMouseEnter={() => setHovered(s.i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.i)}
                onBlur={() => setHovered(null)}
                onKeyDown={(e) => handleKeyDown(e, s.i)}
                className="cursor-pointer outline-none group"
              >
                <path
                  d={s.path}
                  fill={s.color}
                  opacity={hovered === null ? 1 : hovered === s.i ? 1 : 0.3}
                  className="transition-all duration-300 group-focus:stroke-white group-focus:stroke-2"
                />
              </g>
            ))}

            {/* Centered Labels */}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="fill-brand-primary font-black text-xl pointer-events-none"
            >
              {hovered !== null
                ? `${slices[hovered].pct}%`
                : (centerLabel ?? `${total}`)}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="fill-slate-400 font-bold uppercase text-[8px] tracking-widest pointer-events-none"
            >
              {hovered !== null ? slices[hovered].label : "Overall"}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap lg:flex-col gap-3 w-full lg:w-auto">
          {slices.map((s) => (
            <button
              key={s.i}
              type="button"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors w-fit lg:w-full border border-transparent",
                hovered === s.i
                  ? "bg-slate-50 border-slate-100"
                  : "bg-transparent",
              )}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s.i)}
              onBlur={() => setHovered(null)}
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                {s.label}
              </span>
              <span className="ml-auto text-[11px] font-black text-brand-primary pl-4">
                {s.pct}%
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
