"use client";

import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TCreateProject } from "@/constants/new-project";

type SoilBiomassStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const SoilBiomassStep = ({ onNext, onPrev }: SoilBiomassStepProps) => {
  const { control, watch, setValue } = useFormContext<TCreateProject>();
  const projectType = watch("projectType") || "Regenerative Agriculture";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-1">Soil & Biomass</h2>
        <p className="text-emerald-500 font-medium mb-4">
          {projectType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>

        <div className="flex items-center gap-4 mb-2">
          <Progress
            value={40}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            40%
          </span>
        </div>
        <p className="text-slate-400 text-sm">2 of 6 complete</p>
      </div>

      <div className="space-y-6">
        <CustomInput
          control={control}
          name="soilType"
          type="text"
          label="Soil type (if known)"
          placeholder="e.g., clay, loam, sandy"
        />

        <CustomInput
          control={control}
          name="initialSoilCarbonContent"
          type="number"
          label="Initial soil organic carbon content (if available)"
          placeholder="Can be optional"
        />

        <CustomInput
          control={control}
          name="expectedBiomassIncrease"
          type="text"
          label="Expected biomass increase or vegetation type changes"
          placeholder="e.g., shrubs, trees, perennial grasses"
        />

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xl font-bold mb-6">Productivity & Inputs</h3>

          <div className="space-y-6">
            <CustomInput
              control={control}
              name="cropLivestockTypes"
              type="text"
              label="Crop/livestock types currently managed"
              placeholder="e.g., shrubs, trees, perennial grasses"
            />

            <div className="space-y-3">
              <Label className="text-slate-500 text-sm">
                Use of synthetic fertilizers or pesticides
              </Label>
              <RadioGroup
                defaultValue={watch("usesSyntheticFertilizers") ? "yes" : "no"}
                onValueChange={(val: string) => {
                  const boolVal = val === "yes";
                  setValue("usesSyntheticFertilizers", boolVal);
                  setValue("usesSyntheticPesticides", boolVal);
                }}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="yes"
                    className="border-emerald-500 text-emerald-500"
                  />
                  <Label
                    htmlFor="yes"
                    className="text-slate-600 font-medium cursor-pointer"
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="no"
                    className="border-emerald-500 text-emerald-500"
                  />
                  <Label
                    htmlFor="no"
                    className="text-slate-600 font-medium cursor-pointer"
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <CustomInput
              control={control}
              name="organicAmendments"
              type="text"
              label="Use of organic soil amendments"
              placeholder="e.g., manure, compost, biochar"
            />
          </div>
        </div>
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

export default SoilBiomassStep;
