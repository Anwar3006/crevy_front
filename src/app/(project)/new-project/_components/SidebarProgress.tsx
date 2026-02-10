"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProgressProps {
  currentStep: number;
  steps: string[];
}

const SidebarProgress = ({ currentStep, steps }: SidebarProgressProps) => {
  return (
    <div className="relative flex flex-col gap-8">
      {/* The Vertical Connector Line */}
      <div className="absolute left-[18px] top-2 h-[calc(100%-16px)] w-[2px] bg-slate-100" />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step} className="relative z-10 flex items-center gap-4">
            {/* Circle Indicator */}
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                isCompleted
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                    ? "border-emerald-400 bg-emerald-100 text-emerald-600 font-bold"
                    : "border-slate-200 bg-slate-100 text-slate-400 font-medium",
              )}
            >
              {isCompleted ? (
                <Check className="h-5 w-5 stroke-[3px]" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <span
              className={cn(
                "text-xs xl:text-sm font-medium transition-colors",
                isActive
                  ? "text-emerald-600 font-bold"
                  : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400",
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarProgress;
