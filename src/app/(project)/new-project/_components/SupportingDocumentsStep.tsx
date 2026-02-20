"use client";

import { CheckCircle2, FileText, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TCreateProject } from "@/constants/new-project";

type SupportingDocumentsStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const RECOMMENDED_DOCS = [
  "Project design document",
  "Environmental impact assessment",
  "Site photographs",
  "Technical specifications",
  "Community consent forms",
];

const SupportingDocumentsStep = ({
  onNext,
  onPrev,
}: SupportingDocumentsStepProps) => {
  const { watch, setValue } = useFormContext<TCreateProject>();
  const projectType = watch("projectType") || "Regenerative Agriculture";
  const documents = watch("documents") || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const _router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      }));
      setValue("documents", [...documents, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setValue("documents", updatedDocs);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-1">Supporting Documents</h2>
        <p className="text-emerald-500 font-medium mb-4 uppercase text-xs tracking-wider">
          {projectType.replace(/_/g, " ")}
        </p>

        <div className="flex items-center gap-4 mb-2">
          <Progress
            value={100}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            100%
          </span>
        </div>
        <p className="text-slate-400 text-sm">6 of 6 complete</p>
      </div>

      <p className="text-slate-500 text-sm">
        Upload relevant documents to support your project submission
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <button
          type="button" // Critical to prevent form submission
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-emerald-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-emerald-50/20 cursor-pointer hover:bg-emerald-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="bg-[#2ebc8d] p-3 rounded-lg mb-4">
            <UploadCloud className="h-6 w-6 text-white" />
          </div>
          <p className="text-slate-700 font-bold mb-1 text-center">
            Project Documents
          </p>
          <p className="text-slate-400 text-sm font-medium mb-1 text-center">
            Drag your file(s) to start uploading
          </p>
          <p className="text-slate-300 text-xs mb-4">OR</p>
          <Button
            type="button"
            variant="outline"
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 font-bold px-8"
          >
            Browse files
          </Button>
        </button>

        <button
          type="button" // Critical to prevent form submission
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-emerald-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-emerald-50/20 cursor-pointer hover:bg-emerald-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <div className="bg-[#2ebc8d] p-3 rounded-lg mb-4">
            <UploadCloud className="h-6 w-6 text-white" />
          </div>
          <p className="text-slate-700 font-bold mb-1 text-center">
            Facility Image
          </p>
          <p className="text-slate-400 text-sm font-medium mb-1 text-center">
            Drag your image to start uploading
          </p>
          <p className="text-slate-300 text-xs mb-4">OR</p>
          <Button
            type="button"
            variant="outline"
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 font-bold px-8"
          >
            Browse images
          </Button>
        </button>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 text-sm">
            Uploaded Files ({documents.length})
          </h3>
          <div className="space-y-3">
            {documents.map((file: any, index: number) => (
              <div
                key={file}
                className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-white group"
              >
                <div className="bg-amber-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <span className="block text-[8px] font-black text-amber-600 text-center uppercase -mt-1">
                    {file.type}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium tracking-tight">
                    {" "}
                    {file.size}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  type="button"
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex gap-4">
        <Button
          type="button"
          onClick={onPrev}
          className="w-[20%] bg-black hover:bg-black/80 py-6 text-lg rounded-xl font-bold transition-all uppercase"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex-1 bg-[#2ebc8d] hover:bg-[#27a37b] py-6 text-lg rounded-xl font-bold transition-all uppercase"
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default SupportingDocumentsStep;
