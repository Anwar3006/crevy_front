"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AssignmentCheckModal } from "@/components/AssignmentCheckModal";
import { Button } from "@/components/ui/button";
import {
  createProjectDefaultValues,
  createProjectInputSchema,
  type TCreateProject,
} from "@/constants/new-project";
import { authClient } from "@/lib/auth";
import { ProjectService } from "@/lib/services/project-service";
import { StorageService } from "@/lib/services/storage-service";
import type { TRole } from "@/types/user.types";
import ProcessingStep from "./_components/ProcessingStep";
import SidebarProgress from "./_components/SidebarProgress";
import Step1_ProjectProfile from "./_components/Step1_ProjectProfile";
import Step2_PracticesContext from "./_components/Step2_PracticesContext";
import Step3_Documents from "./_components/Step3_Documents";

const STEPS = ["Project Profile", "Practices & Context", "Documents"];

const NewProject = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as any)?.role as TRole;

  console.log("Role: ", session?.user);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const methods = useForm<TCreateProject>({
    resolver: zodResolver(createProjectInputSchema) as any,
    defaultValues: createProjectDefaultValues,
    mode: "onTouched",
  });

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-slate-500 text-sm font-medium">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: TCreateProject) => {
    setIsSubmitting(true);
    try {
      // 1. Create the project record
      const projectRes = await ProjectService.createProject(data);
      const projectId: string = projectRes?.data?.id;

      if (!projectId) throw new Error("Project creation did not return an ID");

      // 2. Upload each document that the user selected
      //    Each document is uploaded individually with its type.
      //    We fire all uploads concurrently but don't block on failures —
      //    documents can be re-uploaded from the project profile page.
      const documentEntries = Object.entries(data.documents ?? {}).filter(
        ([, file]) => file != null,
      );

      if (documentEntries.length > 0) {
        const projectCode = projectRes?.data?.code || projectId;
        const uploadResults = await Promise.allSettled(
          documentEntries.flatMap(([documentType, fileOrFiles]) => {
            const files = Array.isArray(fileOrFiles)
              ? fileOrFiles
              : [fileOrFiles as File];
            return files.map(async (file: File) => {
              // 1. Upload to Object Store
              const storagePath = `project_doc/${projectCode}/`;
              const objectKey = await StorageService.uploadFile(
                file,
                storagePath,
              );
              const _fullUrl = StorageService.resolveUrl(objectKey) as string;

              // 2. Register metadata on backend
              return ProjectService.uploadDocument(projectId, {
                documentType,
                fileName: file.name,
                fileUrl: objectKey,
                fileSize: file.size,
                mimeType: file.type,
              });
            });
          }),
        );

        const failed = uploadResults.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          console.warn(
            `${failed.length} document(s) failed to upload — they can be retried.`,
          );
          toast.warning(
            `Project created but ${failed.length} document upload(s) failed. You can retry from your project page.`,
          );
        }
      }

      // 3. Trigger MRV simulation (async, non-blocking)
      try {
        await ProjectService.simulateMrv(projectId);
      } catch (simError) {
        console.warn("MRV simulation failed to trigger:", simError);
      }

      toast.success("Project registered successfully!");
      router.push(`/projects/${projectId}`);
    } catch (error: any) {
      console.error("Error registering project:", error);
      toast.error(
        error?.response?.data?.message ??
          "Failed to register project. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {isSubmitting && <ProcessingStep />}

      <AssignmentCheckModal
        isOpen={isModalOpen}
        role={role}
        onProceed={(projectOwnerId, assignedAdminId) => {
          methods.setValue("projectOwnerId", projectOwnerId);
          if (assignedAdminId) {
            methods.setValue("assignedAdminId", assignedAdminId);
          }
          setIsModalOpen(false);
        }}
      />

      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Register New Project
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Complete the 3-step form to register your green project on Crevy.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 xl:gap-8">
        {/* Progress sidebar */}
        <div className="bg-white rounded-2xl p-5 xl:p-8 shadow-sm h-fit lg:sticky top-10">
          <h3 className="font-bold text-base mb-6">Your Progress</h3>
          <SidebarProgress currentStep={currentStep} steps={STEPS} />

          <div className="mt-10 bg-emerald-50 p-5 rounded-xl border border-emerald-100">
            <p className="text-emerald-700 font-semibold text-sm">Need Help?</p>
            <p className="text-xs text-slate-500 mt-1">
              Our team is happy to help you through registration.
            </p>
            <Button
              variant="link"
              className="text-emerald-600 p-0 h-auto text-xs mt-2"
              onClick={() => router.push("/support")}
            >
              Contact Support →
            </Button>
          </div>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-3xl p-6 xl:p-12 shadow-sm border border-slate-100">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              {currentStep === 0 && (
                <Step1_ProjectProfile
                  onNext={nextStep}
                  onPrev={() => router.push("/dashboard")}
                />
              )}
              {currentStep === 1 && (
                <Step2_PracticesContext onNext={nextStep} onPrev={prevStep} />
              )}
              {currentStep === 2 && (
                <Step3_Documents
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
