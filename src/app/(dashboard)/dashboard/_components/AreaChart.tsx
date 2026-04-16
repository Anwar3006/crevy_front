"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: string;
  unit?: string;
  delay?: number;
}

export const AreaChart = ({
  data,
  title,
  subtitle,
  color = "#2cc295",
  unit = "",
  delay = 0,
}: AreaChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 520;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 28, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1;
  const minVal = 0;

  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) =>
    PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const points = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.value),
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${PAD.top + chartH} L ${points[0].x} ${PAD.top + chartH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD.top + chartH * (1 - t),
    label: `${Math.round(minVal + (maxVal - minVal) * t)}${unit}`,
  }));

  const gradId = `area-grad-${title.replace(/\s/g, "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h4
          className="text-sm font-semibold text-[#131927]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {title}
        </h4>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={g.y}
              x2={W - PAD.right}
              y2={g.y}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 6}
              y={g.y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#9ca3af"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* X-axis labels — show every 2nd */}
        {points.map((p, i) =>
          i % 2 === 0 ? (
            <text
              key={i}
              x={p.x}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#9ca3af"
            >
              {p.label}
            </text>
          ) : null,
        )}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover interaction areas + dots */}
        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - chartW / data.length / 2}
              y={PAD.top}
              width={chartW / data.length}
              height={chartH}
              fill="transparent"
              // Add these to satisfy a11y
              // biome-ignore lint/a11y/useSemanticElements: SVG elements cannot be buttons
              role="button"
              tabIndex={0}
              aria-label={`View data for ${p.label}`}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onBlur={() => setHovered(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setHovered(i);
                }
              }}
              className="outline-none cursor-pointer"
            />
            {hovered === i && (
              <>
                <line
                  x1={p.x}
                  y1={PAD.top}
                  x2={p.x}
                  y2={PAD.top + chartH}
                  stroke={color}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <circle cx={p.x} cy={p.y} r="4" fill={color} />
                <circle cx={p.x} cy={p.y} r="7" fill={color} opacity="0.2" />
                {/* Tooltip */}
                <rect
                  x={Math.min(p.x - 28, W - PAD.right - 56)}
                  y={p.y - 28}
                  width="56"
                  height="20"
                  rx="4"
                  fill="#131927"
                />
                <text
                  x={Math.min(p.x, W - PAD.right - 28)}
                  y={p.y - 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="600"
                >
                  {unit}
                  {p.value.toLocaleString()}
                </text>
              </>
            )}
            {hovered !== i && (
              <circle cx={p.x} cy={p.y} r="2.5" fill={color} opacity="0.5" />
            )}
          </g>
        ))}
      </svg>
    </motion.div>
  );
};
