"use client";

import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TCreateProject } from "@/constants/new-project";

type ProjectDetailsStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const ProjectDetailsStep = ({ onNext, onPrev }: ProjectDetailsStepProps) => {
  const { control, watch, setValue } = useFormContext<TCreateProject>();

  const usesSyntheticFertilizers = watch("usesSyntheticFertilizers");
  const usesSyntheticPesticides = watch("usesSyntheticPesticides");
  const supportsBiodiversityConservation = watch(
    "supportsBiodiversityConservation",
  );
  const supportsWaterManagement = watch("supportsWaterManagement");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Project Details</h2>
        <p className="text-slate-400 text-sm md:text-base">
          Provide detailed information about your project implementation and
          goals.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {/* Required Fields */}
        <CustomInput
          control={control}
          name="description"
          type="textarea"
          label="Project Description"
          placeholder="Describe your project in detail..."
          description="Minimum 20 characters"
          readOnly={false}
        />

        <CustomInput
          control={control}
          name="implementationPlan"
          type="textarea"
          label="Implementation Plan (Optional)"
          placeholder="How will you implement this project?..."
          readOnly={false}
        />

        <CustomInput
          control={control}
          name="expectedOutcomes"
          type="textarea"
          label="Expected Outcomes (Optional)"
          placeholder="What outcomes do you expect from this project?..."
          readOnly={false}
        />

        {/* Optional Fields */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-700">
            Additional Information (Optional)
          </h3>

          <div className="grid gap-4 md:gap-6">
            <CustomInput
              control={control}
              name="baselineLandUse"
              type="textarea"
              label="Baseline Land Use"
              placeholder="Describe current land use..."
              readOnly={false}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <CustomInput
                control={control}
                name="baselineEmissionsYearly"
                type="number"
                label="Baseline Emissions (Yearly)"
                placeholder="e.g. 1000"
                description="In tonnes CO2e/year"
                readOnly={false}
              />

              <CustomInput
                control={control}
                name="soilType"
                type="text"
                label="Soil Type"
                placeholder="e.g. Clay, Sandy, Loam"
                readOnly={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <CustomInput
                control={control}
                name="initialSoilCarbonContent"
                type="number"
                label="Initial Soil Carbon Content (%)"
                placeholder="e.g. 2.5"
                description="Percentage (0-100)"
                readOnly={false}
              />

              <CustomInput
                control={control}
                name="cropLivestockTypes"
                type="text"
                label="Crop/Livestock Types"
                placeholder="e.g. Wheat, Cattle"
                readOnly={false}
              />
            </div>

            <CustomInput
              control={control}
              name="organicAmendments"
              type="text"
              label="Organic Amendments"
              placeholder="e.g. Compost, Manure"
              readOnly={false}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-700">
            Project Characteristics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="usesSyntheticFertilizers"
                checked={usesSyntheticFertilizers}
                onCheckedChange={(checked: boolean) =>
                  setValue("usesSyntheticFertilizers", checked, {
                    shouldTouch: true,
                  })
                }
              />
              <Label
                htmlFor="usesSyntheticFertilizers"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Uses Synthetic Fertilizers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="usesSyntheticPesticides"
                checked={usesSyntheticPesticides}
                onCheckedChange={(checked: boolean) =>
                  setValue("usesSyntheticPesticides", checked, {
                    shouldTouch: true,
                  })
                }
              />
              <Label
                htmlFor="usesSyntheticPesticides"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Uses Synthetic Pesticides
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="supportsBiodiversityConservation"
                checked={supportsBiodiversityConservation}
                onCheckedChange={(checked: boolean) =>
                  setValue("supportsBiodiversityConservation", checked, {
                    shouldTouch: true,
                  })
                }
              />
              <Label
                htmlFor="supportsBiodiversityConservation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Supports Biodiversity Conservation
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="supportsWaterManagement"
                checked={supportsWaterManagement}
                onCheckedChange={(checked: boolean) =>
                  setValue("supportsWaterManagement", checked, {
                    shouldTouch: true,
                  })
                }
              />
              <Label
                htmlFor="supportsWaterManagement"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Supports Water Management
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="px-6 md:px-8 py-3 md:py-4 text-slate-400 font-bold text-sm md:text-base order-2 sm:order-1"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-[#2ebc8d] hover:bg-[#27a37b] px-8 py-3 md:px-12 md:py-4 xl:py-6 text-sm md:text-base xl:text-lg rounded-xl font-bold transition-all order-1 sm:order-2"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;
