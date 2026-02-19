"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createProjectDefaultValues,
  createProjectInputSchema,
  type TCreateProject,
} from "@/constants/new-project";
import { ProjectService } from "@/lib/services/project-service";
import CommunityStep from "./_components/CommunityStep";
import LandUseStep from "./_components/LandUseStep";
import ProcessingStep from "./_components/ProcessingStep";
import ProjectOverviewStep from "./_components/ProjectOverviewStep";
import ProjectTypeStep from "./_components/ProjectTypeStep";
import ReviewStep from "./_components/ReviewStep";
import SidebarProgress from "./_components/SidebarProgress";
import SoilBiomassStep from "./_components/SoilBiomassStep";
import SubmissionResult from "./_components/SubmissionResult";
import SupportingDocumentsStep from "./_components/SupportingDocumentsStep";

const STEPS = ["Project Type", "Questionnaire", "Documents", "Review & Submit"];

const NewProject = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Project Type, 1: Questionnaire, 2: Documents, 3: Review
  const [questionnaireSubStep, setQuestionnaireSubStep] = useState(0); // 0: Overview, 1: Land Use, 2: Soil, 3: Community
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const router = useRouter();

  const methods = useForm<TCreateProject>({
    resolver: zodResolver(createProjectInputSchema) as any,
    defaultValues: createProjectDefaultValues,
    mode: "onTouched",
  });

  const nextStep = async () => {
    const questionnaireFields: Record<number, (keyof TCreateProject)[]> = {
      0: ["name", "startDate", "location", "durationMonths", "currentStatus"],
      1: ["totalAreaHectares", "baselineLandUse", "regenerativePractices"],
      2: [
        "soilType",
        "initialSoilCarbonContent",
        "expectedBiomassIncrease",
        "cropLivestockTypes",
        "usesSyntheticFertilizers",
        "usesSyntheticPesticides",
        "organicAmendments",
      ],
      3: [
        "socialEconomicBenefits",
        "supportsBiodiversity",
        "supportsWaterManagement",
        "planToExpandPractices",
        "description",
      ],
    };

    if (currentStep === 0) {
      const isValid = await methods.trigger(["projectType"]);
      if (isValid) setCurrentStep(1);
    } else if (currentStep === 1) {
      const isValid = await methods.trigger(
        questionnaireFields[questionnaireSubStep] as any,
      );
      if (isValid) {
        if (questionnaireSubStep < 3) {
          setQuestionnaireSubStep((prev) => prev + 1);
        } else {
          setCurrentStep(2);
        }
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep === 1) {
      if (questionnaireSubStep > 0) {
        setQuestionnaireSubStep((prev) => prev - 1);
      } else {
        setCurrentStep(0);
      }
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (currentStep === 2) setQuestionnaireSubStep(3);
    }
  };

  const onSubmit = async (data: TCreateProject) => {
    setIsSubmitting(true);
    try {
      console.log("Final Project Data:", data);

      // Transform data for API
      const apiData = {
        ...data,
        usesSyntheticFertilizers: data.usesSyntheticFertilizers === "yes",
        usesSyntheticPesticides: data.usesSyntheticPesticides === "yes",
        supportsBiodiversityConservation: data.supportsBiodiversity === "yes",
        supportsWaterManagement: data.supportsWaterManagement === "yes",
        regenerativePractices: data.regenerativePractices.join(","),
        durationMonths: Number(data.durationMonths),
        region: data.region,
        sdgs: data.sdgs.join(","),
      };

      const response = await ProjectService.createProject(apiData);
      setSubmissionData(response);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setShowResult(true);
      toast.success("Project submitted successfully.");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <SubmissionResult data={submissionData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {isSubmitting && <ProcessingStep />}

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

              {currentStep === 1 && questionnaireSubStep === 0 && (
                <ProjectOverviewStep onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 1 && questionnaireSubStep === 1 && (
                <LandUseStep onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 1 && questionnaireSubStep === 2 && (
                <SoilBiomassStep onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 1 && questionnaireSubStep === 3 && (
                <CommunityStep onNext={nextStep} onPrev={prevStep} />
              )}

              {currentStep === 2 && (
                <SupportingDocumentsStep onNext={nextStep} onPrev={prevStep} />
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
