"use client";

import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TCreateProject } from "@/constants/new-project";

type CommunityStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const CommunityStep = ({ onNext, onPrev }: CommunityStepProps) => {
  const { control, watch, setValue } = useFormContext<TCreateProject>();
  const projectType = watch("projectType") || "Regenerative Agriculture";

  return (
    <div className="space-y-8">
      <div className="relative">
        <button
          className="absolute top-0 right-0 text-emerald-500 font-bold cursor-pointer hover:underline"
          type="button"
          onClick={onNext}
        >
          Skip
        </button>
        <h2 className="text-3xl font-bold mb-1">Community & Co-benefits</h2>
        <p className="text-emerald-500 font-medium mb-1">
          {projectType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
        <p className="text-slate-400 text-xs mb-4">
          (This section is optional but useful for carbon methodology)
        </p>

        <div className="flex items-center gap-4 mb-2">
          <Progress
            value={80}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            80%
          </span>
        </div>
        <p className="text-slate-400 text-sm">5 of 6 complete</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-slate-500 text-sm">
            Are there social or economic benefits from the project?
          </Label>
          <CustomInput
            control={control}
            name="socialEconomicBenefits"
            type="text"
            label=""
            placeholder="e.g., jobs, food security, women's inclusion, indigenous leadership"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-slate-500 text-sm">
            Does the project support biodiversity conservation or water
            management?
          </Label>
          <RadioGroup
            defaultValue={watch("supportsBiodiversity")}
            onValueChange={(val: string) => {
              setValue("supportsBiodiversity", val);
              setValue("supportsWaterManagement", val);
            }}
            className="flex gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="bio-yes"
                className="border-emerald-500 text-emerald-500"
              />
              <Label
                htmlFor="bio-yes"
                className="text-slate-600 font-medium cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="bio-no"
                className="border-emerald-500 text-emerald-500"
              />
              <Label
                htmlFor="bio-no"
                className="text-slate-600 font-medium cursor-pointer"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-500 text-sm">
            Do you plan to expand the regenerative practices to other areas in
            the future?
          </Label>
          <RadioGroup
            defaultValue={watch("planToExpandPractices")}
            onValueChange={(val: string) =>
              setValue("planToExpandPractices", val)
            }
            className="flex gap-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="exp-yes"
                className="border-emerald-500 text-emerald-500"
              />
              <Label
                htmlFor="exp-yes"
                className="text-slate-600 font-medium cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="exp-no"
                className="border-emerald-500 text-emerald-500"
              />
              <Label
                htmlFor="exp-no"
                className="text-slate-600 font-medium cursor-pointer"
              >
                No
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="maybe"
                id="exp-maybe"
                className="border-emerald-500 text-emerald-500"
              />
              <Label
                htmlFor="exp-maybe"
                className="text-slate-600 font-medium cursor-pointer"
              >
                Maybe
              </Label>
            </div>
          </RadioGroup>
        </div>

        <CustomInput
          control={control}
          name="description"
          type="textarea"
          label="Project Description"
          placeholder="Provide a detailed description of your project, implementation plan, and expected outcomes..."
        />
        <p className="text-right text-xs text-slate-400 -mt-4">
          0/500 characters
        </p>
      </div>

      <div className="mt-12 flex gap-4">
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

export default CommunityStep;
