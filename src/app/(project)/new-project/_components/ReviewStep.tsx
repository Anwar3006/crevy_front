"use client";

import { format } from "date-fns";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { TCreateProject } from "@/constants/new-project";
import { PROJECT_TYPES, SDGS } from "@/constants/new-project";
import { useRegenerativePractices } from "@/hooks/use-regenerative-practices";

type ReviewStepProps = {
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

const ReviewStep = ({ onPrev, onSubmit, isSubmitting }: ReviewStepProps) => {
  const { getValues } = useFormContext<TCreateProject>();
  const formData = getValues();
  const { data: practices } = useRegenerativePractices();

  const projectType = PROJECT_TYPES.find(
    (type) => type.id === formData.projectType,
  );

  const practiceNames = formData.regenerativePractices
    ?.map((id) => {
      const practice = practices?.find((p: any) => p.id === id);
      return practice ? practice.name : id;
    })
    .join(", ");

  const sdgNames = formData.sdgs
    ?.map((id) => {
      const sdg = SDGS.find((s) => s.id === id);
      return sdg ? sdg.title : id;
    })
    .join(", ");

  console.log("isSubmitting: ", isSubmitting);

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | boolean | undefined;
  }) => {
    if (value === undefined || value === "" || value === null) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-b border-slate-100">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-900 sm:col-span-2">
          {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
        </dd>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Review & Submit</h2>
        <p className="text-slate-400 text-sm md:text-base">
          Please review your project details before submitting.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-emerald-900 text-sm md:text-base">
              Almost there!
            </h3>
            <p className="text-emerald-700 text-xs md:text-sm mt-1">
              Review your information carefully. You can go back to edit any
              section if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Project Type Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
          Project Type
        </h3>
        <dl className="divide-y divide-slate-100">
          <InfoRow
            label="Category"
            value={projectType?.title || formData.projectType}
          />
        </dl>
      </div>

      {/* Project Overview Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
          Project Overview
        </h3>
        <dl className="divide-y divide-slate-100">
          <InfoRow label="Project Name" value={formData.name} />
          <InfoRow
            label="Start Date"
            value={
              formData.startDate
                ? format(new Date(formData.startDate), "PPP")
                : ""
            }
          />
          <InfoRow
            label="Duration"
            value={`${formData.durationMonths} months`}
          />
          <InfoRow label="Location" value={formData.location} />
          <InfoRow label="GPS Coordinates" value={formData.gpsCoordinates} />
          <InfoRow
            label="Total Area"
            value={`${formData.totalAreaHectares} hectares`}
          />
          <InfoRow label="Current Status" value={formData.currentStatus} />
        </dl>
      </div>

      {/* Supporting Documents Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
          Supporting Documents ({formData.documents?.length || 0})
        </h3>
        {formData.documents && formData.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.documents.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50/50"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-slate-400 ml-auto whitespace-nowrap">
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            No documents uploaded.
          </p>
        )}
      </div>

      {/* Project Details Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
          Project Details
        </h3>
        <dl className="divide-y divide-slate-100">
          <div className="py-3 border-b border-slate-100">
            <dt className="text-sm font-medium text-slate-500 mb-2">
              Description
            </dt>
            <dd className="text-sm text-slate-900 whitespace-pre-wrap">
              {formData.description}
            </dd>
          </div>

          {formData.implementationPlan && (
            <div className="py-3 border-b border-slate-100">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Implementation Plan
              </dt>
              <dd className="text-sm text-slate-900 whitespace-pre-wrap">
                {formData.implementationPlan}
              </dd>
            </div>
          )}

          {formData.expectedOutcomes && (
            <div className="py-3 border-b border-slate-100">
              <dt className="text-sm font-medium text-slate-500 mb-2">
                Expected Outcomes
              </dt>
              <dd className="text-sm text-slate-900 whitespace-pre-wrap">
                {formData.expectedOutcomes}
              </dd>
            </div>
          )}

          <InfoRow label="Baseline Land Use" value={formData.baselineLandUse} />
          <InfoRow label="Soil Type" value={formData.soilType} />
          <InfoRow
            label="Initial Soil Carbon Content"
            value={
              formData.initialSoilCarbonContent
                ? `${formData.initialSoilCarbonContent}%`
                : undefined
            }
          />
          <InfoRow label="Regenerative Practices" value={practiceNames} />
          <InfoRow
            label="Crop/Livestock Types"
            value={formData.cropLivestockTypes}
          />
          <InfoRow
            label="Organic Amendments"
            value={formData.organicAmendments}
          />
        </dl>
      </div>

      {/* Project Characteristics */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
          Project Characteristics
        </h3>
        <dl className="divide-y divide-slate-100">
          <InfoRow
            label="Uses Synthetic Fertilizers"
            value={formData.usesSyntheticFertilizers}
          />
          <InfoRow
            label="Uses Synthetic Pesticides"
            value={formData.usesSyntheticPesticides}
          />
          <InfoRow
            label="Supports Biodiversity Conservation"
            value={formData.supportsBiodiversityConservation}
          />
          <InfoRow
            label="Supports Water Management"
            value={formData.supportsWaterManagement}
          />
          <InfoRow label="SDGs" value={sdgNames} />
        </dl>
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
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#2ebc8d] hover:bg-[#27a37b] px-8 py-3 md:px-12 md:py-4 xl:py-6 text-sm md:text-base xl:text-lg rounded-xl font-bold transition-all order-1 sm:order-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Submit Project"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
