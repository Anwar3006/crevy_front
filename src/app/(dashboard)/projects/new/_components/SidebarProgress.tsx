"use client";

import { cn } from "@/lib/utils";

interface SidebarProgressProps {
  currentStep: number;
  steps: string[];
}

const SidebarProgress = ({ currentStep, steps }: SidebarProgressProps) => {
  return (
    <div className="flex flex-col gap-0 border-l-2 border-slate-100">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={step}
            className={cn(
              "relative pl-6 py-4 transition-all duration-300",
              isActive ? "border-l-2 border-slate-900 -ml-[2px]" : "",
            )}
          >
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-widest",
                  isActive
                    ? "text-slate-900 font-bold"
                    : isCompleted
                      ? "text-emerald-600"
                      : "text-slate-400",
                )}
              >
                Phase 0{index + 1} {isCompleted && "✓"}
              </span>
              <span
                className={cn(
                  "text-sm tracking-wide",
                  isActive
                    ? "text-slate-900 font-bold font-serif"
                    : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400",
                )}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarProgress;
