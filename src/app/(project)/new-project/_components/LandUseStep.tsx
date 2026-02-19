"use client";

import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { TCreateProject } from "@/constants/new-project";

type LandUseStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const PRACTICE_OPTIONS = [
  { id: "cover_cropping", label: "Cover cropping" },
  { id: "agroforestry", label: "Agroforestry" },
  { id: "no_low_tillage", label: "No/low tillage" },
  { id: "managed_grazing", label: "Managed grazing" },
  { id: "compost_application", label: "Compost application" },
  { id: "biochar_use", label: "Biochar use" },
  { id: "crop_rotation", label: "Crop rotation" },
  { id: "others", label: "Others (specify)" },
];

const LandUseStep = ({ onNext, onPrev }: LandUseStepProps) => {
  const { control, watch, setValue } = useFormContext<TCreateProject>();

  const selectedPractices = watch("regenerativePractices") || [];
  const projectType = watch("projectType") || "Regenerative Agriculture";

  const togglePractice = (id: string, checked: boolean) => {
    if (checked) {
      setValue("regenerativePractices", [...selectedPractices, id]);
    } else {
      setValue(
        "regenerativePractices",
        selectedPractices.filter((p) => p !== id),
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-1">Land Use & Practices</h2>
        <p className="text-emerald-500 font-medium mb-4">
          {projectType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>

        <div className="flex items-center gap-4 mb-2">
          <Progress
            value={20}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            20%
          </span>
        </div>
        <p className="text-slate-400 text-sm">1 of 6 complete</p>
      </div>

      <div className="space-y-6">
        <CustomInput
          control={control}
          name="totalAreaHectares"
          type="number"
          label="Total land area under regeneration (in hectares or acres)*"
          placeholder="e.g. 50"
          readOnly={false}
        />

        <CustomInput
          control={control}
          name="baselineLandUse"
          type="text"
          label="Baseline land use before regeneration"
          placeholder="(e.g. degraded pasture, conventional monocropping)"
          readOnly={false}
        />

        <div className="space-y-4">
          <Label className="text-slate-500 text-sm">
            Current regenerative practices being applied
            <span className="block text-emerald-500 text-xs mt-1">
              (Select all that apply):
            </span>
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRACTICE_OPTIONS.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedPractices.includes(option.id)}
                  onCheckedChange={(checked) =>
                    togglePractice(option.id, !!checked)
                  }
                  className="w-5 h-5 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Label
                  htmlFor={option.id}
                  className="text-slate-600 font-medium cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {selectedPractices.includes("others") && (
          <CustomInput
            control={control}
            name="otherPractice"
            type="text"
            label="Specify others"
            placeholder="Please specify other practices"
          />
        )}
      </div>

      <div className="mt-12">
        <Button
          type="button"
          onClick={onNext}
          className="w-full bg-[#2ebc8d] hover:bg-[#27a37b] py-6 text-lg rounded-xl font-bold transition-all"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LandUseStep;
