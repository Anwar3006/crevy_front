"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TCreateProject } from "@/constants/new-project";
import { SDGS } from "@/constants/new-project";

export const SDGSelection = () => {
  const { watch, setValue } = useFormContext<TCreateProject>();
  const selectedSdgs = watch("sdgs") || [];

  const toggleSdg = (id: string, checked: boolean) => {
    if (checked) {
      setValue("sdgs", [...selectedSdgs, id]);
    } else {
      setValue(
        "sdgs",
        selectedSdgs.filter((s) => s !== id),
      );
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-slate-700 font-bold">
        Sustainable Development Goals (SDGs)
        <span className="block text-slate-400 text-xs font-normal mt-1">
          Select the goals your project aligns with:
        </span>
      </Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SDGS.map((sdg) => (
          <button
            key={sdg.id}
            type="button" // Always specify type="button" to prevent form submission
            className={`flex items-start text-left space-x-3 p-3 border rounded-xl transition-all cursor-pointer hover:shadow-sm w-full
    ${selectedSdgs.includes(sdg.id) ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-white"}`}
            onClick={() => toggleSdg(sdg.id, !selectedSdgs.includes(sdg.id))}
          >
            <Checkbox
              id={`sdg-${sdg.id}`}
              checked={selectedSdgs.includes(sdg.id)}
              onCheckedChange={(checked) => toggleSdg(sdg.id, !!checked)}
              className="mt-1 w-5 h-5 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={`sdg-${sdg.id}`}
                className="text-xs font-bold text-slate-700 cursor-pointer block leading-tight"
                onClick={(e) => e.stopPropagation()}
              >
                {sdg.id}. {sdg.title}
              </Label>
              <div className={`h-1 w-8 mt-2 rounded-full ${sdg.color}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
