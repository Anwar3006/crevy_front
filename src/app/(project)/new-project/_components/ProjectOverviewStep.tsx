"use client";

import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TCreateProject } from "@/constants/new-project";

type ProjectOverviewStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const LOCATION_OPTIONS = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "south_africa", label: "South Africa" },
  { value: "usa", label: "USA" },
  { value: "other", label: "Other" },
];

const DURATION_OPTIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
  { value: "60", label: "60 months" },
];

const ProjectOverviewStep = ({ onNext, onPrev }: ProjectOverviewStepProps) => {
  const { control, watch } = useFormContext<TCreateProject>();
  const projectType = watch("projectType") || "Regenerative Agriculture";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-1">Project Overview</h2>
        <p className="text-emerald-500 font-medium mb-4">
          {projectType
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>

        <div className="flex items-center gap-4 mb-2">
          <Progress
            value={5}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            5%
          </span>
        </div>
        <p className="text-slate-400 text-sm">0 of 6 complete</p>
      </div>

      <div className="space-y-6">
        <CustomInput
          control={control}
          name="name"
          type="text"
          label="Project Name*"
          placeholder="Project Wave"
        />

        <CustomInput
          control={control}
          name="gpsCoordinates"
          type="text"
          label="GPS Coordinates (Optional)"
          placeholder="e.g., 6.5244, 3.3792"
        />

        <CustomDatePicker
          control={control}
          name="startDate"
          label="Project Start Date*"
          enableFutureDates={true}
        />

        <CustomSelect
          control={control}
          name="location"
          label="Project Location*"
          placeholder="Select region/country"
          options={LOCATION_OPTIONS}
        />

        <CustomSelect
          control={control}
          name="durationMonths"
          label="Project Duration*"
          placeholder="Select duration"
          options={DURATION_OPTIONS}
        />

        <CustomInput
          control={control}
          name="currentStatus"
          type="text"
          label="Current project status"
          placeholder="Enter current status"
        />

        <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 border border-emerald-100">
          <Info className="h-5 w-5 text-emerald-500 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-900 leading-none">
              Location Tips
            </h4>
            <p className="text-xs text-emerald-700 font-medium">
              Precise GPS coordinates help with verification. If unavailable,
              provide the nearest city or landmark.
            </p>
          </div>
        </div>
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

export default ProjectOverviewStep;
