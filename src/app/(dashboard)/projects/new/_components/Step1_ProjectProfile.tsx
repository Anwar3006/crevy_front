"use client";

import { ArrowRight, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CurrencySelect } from "@/components/CurrencySelect";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { PROJECT_TYPES, type TCreateProject } from "@/constants/new-project";
import { cn } from "@/lib/utils";

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
  const startDate = watch("startDate"); // Used to validate End Date

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
      "projectOwnerId",
    ]);
    if (valid) onNext();
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="hidden md:block border-b-2 border-slate-900 pb-4">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] mb-2">
          Phase 01 / 03
        </p>
        <h2 className="text-2xl font-serif text-slate-900 tracking-tight">
          Asset Telemetry
        </h2>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-4">
          Methodology Class <span className="text-emerald-600">*</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
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
                className={cn(
                  "relative p-5 md:p-6 text-left transition-all bg-white",
                  isSelected
                    ? "ring-2 ring-inset ring-slate-900 bg-slate-50"
                    : disabled
                      ? "opacity-50 cursor-not-allowed bg-slate-50"
                      : "hover:bg-slate-50",
                )}
              >
                {disabled && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-slate-200 text-slate-500 px-2 py-1">
                    Pending
                  </span>
                )}
                <p className="font-serif font-bold text-slate-900 text-base md:text-lg mb-2">
                  {type.title}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
        {errors.projectType && (
          <p className="text-red-500 text-xs mt-2 font-mono">
            {errors.projectType.message}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <CustomInput
          control={control}
          name="name"
          type="text"
          label="Project Name *"
          placeholder="e.g. Volta Basin Regeneration Initiative"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div data-lenis-prevent="true">
            <CountryDropdown
              control={control}
              name="country"
              label="Jurisdiction *"
              placeholder="Select country"
            />
          </div>
          <CustomInput
            control={control}
            name="region"
            type="text"
            label="Region *"
            placeholder="e.g. Ashanti Region"
          />
        </div>

        <CustomInput
          control={control}
          name="gpsCoordinates"
          type="text"
          label="Spatial Coordinates (GPS)"
          placeholder="lat, lng — e.g. 6.5244, -1.3792"
        />

        <div className="bg-slate-50 border-l-2 border-slate-900 p-4 flex flex-col sm:flex-row gap-3">
          <Info className="h-4 w-4 text-slate-900 shrink-0 sm:mt-0.5 hidden sm:block" />
          <p className="text-[11px] md:text-xs text-slate-600 font-mono leading-relaxed">
            <span className="font-bold uppercase text-slate-900">Note:</span>{" "}
            Precise GPS coordinates enable dMRV sensor mapping. Extract lat/lng
            directly from GIS software or Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Prevent historical dates */}
          <CustomDatePicker
            control={control}
            name="startDate"
            label="Implementation Start *"
            enableFutureDates
            minDate={new Date()}
          />
          {/* Prevent end date from occurring before start date */}
          <CustomDatePicker
            control={control}
            name="endDate"
            label="Projected End (Optional)"
            enableFutureDates
            minDate={startDate || new Date()}
          />
        </div>

        <CustomInput
          control={control}
          name="totalAreaHectares"
          type="number"
          label="Project Plot Scale (Hectares) *"
          placeholder="e.g. 50"
        />

        <div className="space-y-2 relative" data-lenis-prevent="true">
          <label
            htmlFor="currency"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900"
          >
            Settlement Currency *
          </label>
          <CurrencySelect
            value={currency}
            onChange={(val) =>
              setValue("currency", val, {
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder="Select protocol currency"
            className="w-full rounded-none border-slate-200"
          />
          {errors.currency && (
            <p className="text-red-500 text-xs font-mono">
              {errors.currency.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 transition-all text-center"
        >
          Abort
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:flex-1 bg-slate-900 hover:bg-emerald-700 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
        >
          Commit & Proceed <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Step1_ProjectProfile;
