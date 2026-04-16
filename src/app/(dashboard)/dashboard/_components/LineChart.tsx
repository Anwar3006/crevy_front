"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface LineDataPoint {
  label: string;
  a: number;
  b: number;
}

interface MultiLineChartProps {
  data: LineDataPoint[];
  title: string;
  subtitle?: string;
  labelA: string;
  labelB: string;
  colorA?: string;
  colorB?: string;
  delay?: number;
}

export const MultiLineChart = ({
  data,
  title,
  subtitle,
  labelA,
  labelB,
  colorA = "#2cc295",
  colorB = "#131927",
  delay = 0,
}: MultiLineChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 520;
  const H = 180;
  const PAD = { top: 16, right: 16, bottom: 28, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.1;

  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const pointsA = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.a),
    v: d.a,
    label: d.label,
  }));
  const pointsB = data.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.b),
    v: d.b,
    label: d.label,
  }));

  const pathA = pointsA
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const pathB = pointsB
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD.top + chartH * (1 - t),
    label: `${Math.round(maxVal * t)}`,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4
            className="text-sm font-semibold text-[#131927]"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {title}
          </h4>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="inline-block h-0.5 w-5 rounded"
              style={{ backgroundColor: colorA }}
            />
            {labelA}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="inline-block h-0.5 w-5 rounded"
              style={{ backgroundColor: colorB, opacity: 0.5 }}
            />
            {labelB}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        onMouseLeave={() => setHovered(null)}
        role="img"
        aria-label={title}
      >
        {/* Grid */}
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

        {/* Line B (behind) */}
        <path
          d={pathB}
          fill="none"
          stroke={colorB}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="4 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Line A */}
        <path
          d={pathA}
          fill="none"
          stroke={colorA}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover zones */}
        {pointsA.map((pA, i) => {
          const pB = pointsB[i];
          const isHov = hovered === i;
          return (
            <g key={i}>
              <rect
                x={pA.x - chartW / data.length / 2}
                y={PAD.top}
                width={chartW / data.length}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                // biome-ignore lint/a11y/useSemanticElements: SVG elements cannot be buttons
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setHovered(i)}
                aria-label={`View details for ${pA.label}`}
              />
              {i % 2 === 0 && (
                <text
                  x={pA.x}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#9ca3af"
                >
                  {pA.label}
                </text>
              )}
              {isHov && (
                <>
                  <line
                    x1={pA.x}
                    y1={PAD.top}
                    x2={pA.x}
                    y2={PAD.top + chartH}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  {/* Dot A */}
                  <circle cx={pA.x} cy={pA.y} r="4" fill={colorA} />
                  <circle
                    cx={pA.x}
                    cy={pA.y}
                    r="7"
                    fill={colorA}
                    opacity="0.15"
                  />
                  {/* Dot B */}
                  <circle
                    cx={pB.x}
                    cy={pB.y}
                    r="3.5"
                    fill={colorB}
                    opacity="0.5"
                  />
                  {/* Tooltip */}
                  <rect
                    x={Math.min(pA.x + 8, W - PAD.right - 70)}
                    y={pA.y - 30}
                    width="68"
                    height="36"
                    rx="5"
                    fill="#131927"
                  />
                  <text
                    x={Math.min(pA.x + 42, W - PAD.right - 36)}
                    y={pA.y - 17}
                    textAnchor="middle"
                    fontSize="8"
                    fill={colorA}
                    fontWeight="700"
                  >
                    {labelA}: {pA.v}
                  </text>
                  <text
                    x={Math.min(pA.x + 42, W - PAD.right - 36)}
                    y={pA.y - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                    opacity="0.7"
                  >
                    {labelB}: {pB.v}
                  </text>
                </>
              )}
              {!isHov && (
                <>
                  <circle
                    cx={pA.x}
                    cy={pA.y}
                    r="2.5"
                    fill={colorA}
                    opacity="0.6"
                  />
                  <circle
                    cx={pB.x}
                    cy={pB.y}
                    r="2"
                    fill={colorB}
                    opacity="0.3"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};
