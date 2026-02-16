"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// import ProjectOverviewStep from "./steps/ProjectOverviewStep";
// import SidebarProgress from "./SidebarProgress";
import {
  createProjectDefaultValues,
  createProjectInputSchema,
  type TCreateProject,
} from "@/constants/new-project";
import { ProjectService } from "@/lib/services/project-service";
import ProjectDetailsStep from "./_components/ProjectDetailsStep";
import ProjectOverviewStep from "./_components/ProjectOverviewStep";
// Internal Components (To be created)
import ProjectTypeStep from "./_components/ProjectTypeStep";
import ReviewStep from "./_components/ReviewStep";
import SidebarProgress from "./_components/SidebarProgress";

const STEPS = ["Project Type", "Overview", "Details", "Review & Submit"];

const NewProject = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<TCreateProject>({
    resolver: zodResolver(createProjectInputSchema) as any,
    defaultValues: createProjectDefaultValues,
    mode: "onTouched",
  });

  const nextStep = async () => {
    const stepFields: Record<number, (keyof TCreateProject)[]> = {
      0: ["projectType"],
      1: [
        "name",
        "startDate",
        "location",
        "durationMonths",
        "gpsCoordinates",
        "totalAreaHectares",
      ],
      2: ["description", "implementationPlan", "expectedOutcomes"],
    };

    const isValid = await methods.trigger(stepFields[currentStep] as any);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (data: TCreateProject) => {
    setIsSubmitting(true);
    try {
      console.log("Final Project Data:", data);
      // TODO: Replace with actual API call
      await ProjectService.createProject(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard after success
      // setTimeout(() => {
      //   router.push("/dashboard");
      // }, 2000);

      toast.success("Project submitted successfully.");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold text-slate-900">
          Submit New Project
        </h1>
        <p className="text-slate-500 mt-2">
          Complete the guided flow to submit your green project.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 xl:gap-8">
        {/* Progress Sidebar */}
        <div className="bg-white rounded-2xl p-4 xl:p-8 shadow-sm h-fit block lg:sticky top-10">
          <h3 className="font-bold text-lg mb-6">Progress</h3>
          <SidebarProgress currentStep={currentStep} steps={STEPS} />

          <div className="mt-12 bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <p className="text-emerald-700 font-semibold text-sm">Need Help?</p>
            <p className="text-xs text-slate-500 mt-1">
              Contact our support team for guidance.
            </p>
            <Button
              variant="link"
              className="text-emerald-600 p-0 h-auto text-xs mt-2"
            >
              Get Support →
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl p-6 xl:p-12 shadow-sm border border-slate-100">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {currentStep === 0 && <ProjectTypeStep onNext={nextStep} />}
              {currentStep === 1 && (
                <ProjectOverviewStep onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 2 && (
                <ProjectDetailsStep onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  onPrev={prevStep}
                  isSubmitting={isSubmitting}
                  onSubmit={() => methods.handleSubmit(onSubmit)()}
                />
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
