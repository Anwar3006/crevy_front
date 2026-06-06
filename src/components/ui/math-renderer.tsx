"use client";

import katex from "katex";
import { useEffect, useRef } from "react";

interface MathRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function MathRenderer({
  formula,
  displayMode = false,
  className = "",
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
        });
      } catch (err) {
        console.error("Error rendering KaTeX: ", err);
      }
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={className} />;
}
