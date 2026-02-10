"use client";

import { useFormContext } from "react-hook-form";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import type { TCreateProject } from "@/constants/new-project";

type ProjectOverviewStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const ProjectOverviewStep = ({ onNext, onPrev }: ProjectOverviewStepProps) => {
  const { control } = useFormContext<TCreateProject>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Project Overview
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          Provide the basic details of your project.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        <CustomInput
          control={control}
          name="name"
          type="text"
          label="Project Name"
          placeholder="Enter a descriptive name"
          description="Give your project a unique and recognizable name."
          readOnly={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <CustomDatePicker
            control={control}
            name="startDate"
            label="Start Date"
            placeholder="Select start date"
            enableFutureDates={true}
          />

          <CustomInput
            control={control}
            name="durationMonths"
            type="number"
            label="Duration (Months)"
            placeholder="e.g. 12"
            readOnly={false}
          />
        </div>

        <CustomInput
          control={control}
          name="location"
          type="text"
          label="Location"
          placeholder="Region, Country"
          description="Where is the project primarily located?"
          readOnly={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <CustomInput
            control={control}
            name="gpsCoordinates"
            type="text"
            label="GPS Coordinates"
            placeholder="lat, lng"
            description="e.g. 34.0522, -118.2437"
            readOnly={false}
          />

          <CustomInput
            control={control}
            name="totalAreaHectares"
            type="number"
            label="Total Area (Hectares)"
            placeholder="e.g. 50"
            readOnly={false}
          />
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

export default ProjectOverviewStep;
