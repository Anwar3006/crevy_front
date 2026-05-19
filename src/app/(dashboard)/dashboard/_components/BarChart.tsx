"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GroupedBarData {
  label: string;
  a: number;
  b: number;
}

interface GroupedBarChartProps {
  data: GroupedBarData[];
  title: string;
  subtitle?: string;
  labelA: string;
  labelB: string;
  colorA?: string;
  colorB?: string;
  unit?: string;
  delay?: number;
}

export const GroupedBarChart = ({
  data,
  title,
  subtitle,
  labelA,
  labelB,
  colorA = "#2cc295",
  colorB = "#131927",
  unit = "",
  delay = 0,
}: GroupedBarChartProps) => {
  const [hovered, setHovered] = useState<{
    i: number;
    which: "a" | "b";
  } | null>(null);

  const W = 520;
  const H = 180;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const rawMax = Math.max(...data.flatMap((d) => [d.a, d.b]));
  const maxVal = rawMax > 0 ? rawMax * 1.15 : 100;

  const groupW = data.length > 0 ? chartW / data.length : chartW;
  const barW = Math.max((groupW - 8) / 2, 0);

  const yScale = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;
  const barH = (v: number) => (v / maxVal) * chartH;

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
        {/* Legend */}
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: colorA }}
            />
            {labelA}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
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

        {data.map((d, i) => {
          const groupX = PAD.left + i * groupW + 4;
          const xA = groupX;
          const xB = groupX + barW + 2;
          const hA = barH(d.a);
          const hB = barH(d.b);
          const isHovA = hovered?.i === i && hovered.which === "a";
          const isHovB = hovered?.i === i && hovered.which === "b";

          return (
            <g key={i}>
              {/* Bar A */}
              <rect
                x={xA}
                y={yScale(d.a)}
                width={barW}
                height={hA}
                rx="3"
                fill={colorA}
                opacity={isHovA ? 1 : 0.85}
                onMouseEnter={() => setHovered({ i, which: "a" })}
                className="cursor-pointer transition-opacity"
                // biome-ignore lint/a11y/useSemanticElements: SVG elements cannot be buttons
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setHovered({ i, which: "a" })
                }
                aria-label={`${labelA}: ${d.a}`}
              />
              {/* Bar B */}
              <rect
                x={xB}
                y={yScale(d.b)}
                width={barW}
                height={hB}
                rx="3"
                fill={colorB}
                opacity={isHovB ? 0.7 : 0.35}
                onMouseEnter={() => setHovered({ i, which: "b" })}
                className="cursor-pointer transition-opacity"
                // biome-ignore lint/a11y/useSemanticElements: SVG elements cannot be buttons
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setHovered({ i, which: "b" })
                }
                aria-label={`${labelB}: ${d.b}`}
              />
              {/* Tooltip */}
              {(isHovA || isHovB) && (
                <>
                  <rect
                    x={Math.min(isHovA ? xA : xB, W - PAD.right - 60) - 2}
                    y={yScale(isHovA ? d.a : d.b) - 26}
                    width="60"
                    height="20"
                    rx="4"
                    fill="#131927"
                  />
                  <text
                    x={Math.min(isHovA ? xA : xB, W - PAD.right - 60) + 28}
                    y={yScale(isHovA ? d.a : d.b) - 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill="white"
                    fontWeight="600"
                  >
                    {unit}
                    {(isHovA ? d.a : d.b).toLocaleString()}
                  </text>
                </>
              )}
              {/* X label */}
              <text
                x={groupX + barW}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fill="#9ca3af"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};
