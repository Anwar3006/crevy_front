"use client";

import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  PRACTICES_BY_TYPE,
  SDGS,
  type TCreateProject,
} from "@/constants/new-project";
import { SDGSelection } from "./SDGSelection";

const Step2_PracticesContext = ({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) => {
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<TCreateProject>();

  const projectType = watch("projectType");
  const selectedTags = watch("projectTags") ?? [];
  const practices = PRACTICES_BY_TYPE[projectType] ?? [];

  const toggleTag = (tag: string, checked: boolean) => {
    setValue(
      "projectTags",
      checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag),
      { shouldTouch: true },
    );
  };

  const handleNext = async () => {
    const valid = await trigger(["description"]);
    if (valid) onNext();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1">
          Practices & Context
        </h2>
        <p className="text-emerald-500 font-medium text-sm mb-3">
          {projectType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
        <div className="flex items-center gap-4 mb-1">
          <Progress
            value={66}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            Step 2 of 3
          </span>
        </div>
      </div>

      {/* Practices */}
      {practices.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">
            What practices are you applying?
            <span className="block text-xs text-slate-400 font-normal mt-0.5">
              Select all that apply. This helps describe your project on the
              marketplace.
            </span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {practices.map((practice) => (
              <label
                key={practice}
                htmlFor={practice}
                className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={selectedTags.includes(practice)}
                  onCheckedChange={(checked) => toggleTag(practice, !!checked)}
                  className="w-5 h-5 border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {practice}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SDGs */}
      <div>
        <Label className="text-sm font-semibold text-slate-700 block mb-3">
          Which SDGs does your project support?
          <span className="block text-xs text-slate-400 font-normal mt-0.5">
            Optional — adds co-benefit visibility on the marketplace.
          </span>
        </Label>
        <SDGSelection />
      </div>

      {/* Description */}
      <div>
        <CustomInput
          control={control}
          name="description"
          type="textarea"
          label="Project Description *"
          placeholder="Describe what you're doing on this land, why it matters, and what you hope to achieve for your community and the environment."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
        <p className="text-right text-xs text-slate-400 mt-1">
          {watch("description")?.length ?? 0} / 1000
        </p>
      </div>

      {/* Nav */}
      <div className="flex gap-4 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="px-8 py-3 text-slate-400 font-bold"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-[#2ebc8d] hover:bg-[#27a37b] py-6 text-lg rounded-xl font-bold transition-all"
        >
          Next: Documents
        </Button>
      </div>
    </div>
  );
};

export default Step2_PracticesContext;
