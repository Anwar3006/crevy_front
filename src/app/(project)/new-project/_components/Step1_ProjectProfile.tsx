"use client";

import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CurrencySelect } from "@/components/CurrencySelect";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Progress } from "@/components/ui/progress";
import { PROJECT_TYPES, type TCreateProject } from "@/constants/new-project";

const Step1_ProjectProfile = ({
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

  const selectedType = watch("projectType");
  const currency = watch("currency");

  const handleTypeSelect = (
    typeId: string,
    sector: string,
    pilotEnabled: boolean,
  ) => {
    if (!pilotEnabled) return;
    setValue("projectType", typeId, { shouldTouch: true });
    setValue("sector", sector, { shouldTouch: true });
  };

  const handleNext = async () => {
    const valid = await trigger([
      "projectType",
      "name",
      "country",
      "region",
      "startDate",
      "totalAreaHectares",
      "currency",
    ]);
    if (valid) onNext();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1">Project Profile</h2>
        <p className="text-slate-400 text-sm">Tell us about your project.</p>
        <div className="flex items-center gap-4 mt-4 mb-1">
          <Progress
            value={33}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            Step 1 of 3
          </span>
        </div>
      </div>

      {/* Project Type */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Project Type <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {PROJECT_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            const disabled = !type.pilotEnabled;

            return (
              <button
                key={type.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  handleTypeSelect(type.id, type.sector, type.pilotEnabled)
                }
                className={[
                  "relative p-5 rounded-2xl border-2 text-left transition-all",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/60"
                    : disabled
                      ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                      : "border-slate-100 hover:border-emerald-200 cursor-pointer",
                ].join(" ")}
              >
                {disabled && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                <p className="font-bold text-slate-800 text-sm mt-1">
                  {type.title}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
        {errors.projectType && (
          <p className="text-red-500 text-xs mt-2">
            {errors.projectType.message}
          </p>
        )}
      </div>

      {/* Core fields */}
      <div className="space-y-5">
        <CustomInput
          control={control}
          name="name"
          type="text"
          label="Project Name *"
          placeholder="e.g. Volta Basin Regeneration Initiative"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* CountryDropdown stores alpha3 codes (e.g. "GHA") — default "GHA" */}
          <CountryDropdown
            control={control}
            name="country"
            label="Country *"
            placeholder="Select country"
          />
          <CustomInput
            control={control}
            name="region"
            type="text"
            label="Region / Area *"
            placeholder="e.g. Ashanti Region"
          />
        </div>

        <CustomInput
          control={control}
          name="gpsCoordinates"
          type="text"
          label="GPS Coordinates"
          placeholder="lat, lng — e.g. 6.5244, -1.3792"
        />

        <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 border border-emerald-100">
          <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 font-medium">
            Precise GPS coordinates help our dMRV partner's field team locate
            your land for sensor deployment. Open Google Maps, right-click your
            land, and copy the coordinates shown.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CustomDatePicker
            control={control}
            name="startDate"
            label="Project Start Date *"
            enableFutureDates
          />
          <CustomDatePicker
            control={control}
            name="endDate"
            label="Project End Date (Optional)"
            enableFutureDates
          />
        </div>

        <CustomInput
          control={control}
          name="totalAreaHectares"
          type="number"
          label="Total Land Area (hectares) *"
          placeholder="e.g. 50"
        />

        {/* Currency */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="currency"
          >
            Preferred Currency *
          </label>

          <CurrencySelect
            value={currency}
            onChange={(val) =>
              setValue("currency", val, {
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder="Select project currency"
            className="w-full"
          />

          {errors.currency && (
            <p className="text-red-500 text-xs">{errors.currency.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
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
          Next: Practices &amp; Context
        </Button>
      </div>
    </div>
  );
};

export default Step1_ProjectProfile;
