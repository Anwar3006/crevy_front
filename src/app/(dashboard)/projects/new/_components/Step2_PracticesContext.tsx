"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PRACTICES_BY_TYPE,
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
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="border-b-2 border-slate-900 pb-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-2">
          Phase 02 / 03
        </p>
        <h2 className="text-2xl font-sans text-foreground tracking-tight">
          Operational Context
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-2">
          Class: {projectType.replace(/_/g, " ").toUpperCase()}
        </p>
      </div>

      {practices.length > 0 && (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
              Applied Methodologies
            </p>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Select all active operational practices.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-border">
            {practices.map((practice) => (
              <div
                key={practice}
                className="flex items-start gap-3 p-4 bg-white hover:bg-muted transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={selectedTags.includes(practice)}
                  onCheckedChange={(checked) => toggleTag(practice, !!checked)}
                  className="mt-0.5 rounded-none border-slate-300 data-[state=checked]:bg-secondary data-[state=checked]:border-slate-900"
                />
                <span className="text-sm text-slate-700 font-medium">
                  {practice}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground mb-1">
          Sustainable Development Goals (SDGs)
        </p>
        <p className="text-xs text-muted-foreground font-light mb-4">
          Optional co-benefit tracking for institutional buyers.
        </p>
        <SDGSelection />
      </div>

      <div>
        <CustomInput
          control={control}
          name="description"
          type="textarea"
          label="Asset Thesis *"
          placeholder="Detail the operational mechanics, baseline scenario, and projected impact."
        />
        {errors.description && (
          <p className="text-red-500 text-xs font-mono mt-2">
            {errors.description.message}
          </p>
        )}
        <p className="text-right text-[10px] font-mono text-muted-foreground mt-2">
          {watch("description")?.length ?? 0} / 1000 BYTES
        </p>
      </div>

      <div className="flex gap-4 pt-8 border-t border-border">
        <button
          type="button"
          onClick={onPrev}
          className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-slate-400 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} /> Retreat
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-secondary hover:bg-emerald-700 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
        >
          Commit & Proceed <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Step2_PracticesContext;
