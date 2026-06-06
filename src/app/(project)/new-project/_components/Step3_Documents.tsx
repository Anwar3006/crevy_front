"use client";

import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DOCUMENT_TYPES,
  type DocumentTypeId,
  type TCreateProject,
} from "@/constants/new-project";
import { cn } from "@/lib/utils";

const Step3_Documents = ({
  onPrev,
  onSubmit,
  isSubmitting,
}: {
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => {
  const { watch, setValue } = useFormContext<TCreateProject>();
  const documents = watch("documents") ?? {};
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [_previews, setPreviews] = useState<Record<string, string>>({});

  // Count how many required slots are filled
  const requiredSlots = DOCUMENT_TYPES.filter((d) => d.required);
  const filledRequired = requiredSlots.filter((d) => {
    const val = documents[d.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  });
  const allRequiredFilled = filledRequired.length === requiredSlots.length;

  const handleFileChange = (
    docTypeId: DocumentTypeId,
    e: React.ChangeEvent<HTMLInputElement>,
    multiple: boolean,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    if (multiple) {
      // site_photos — store as array
      setValue(
        "documents",
        { ...documents, [docTypeId]: files },
        { shouldTouch: true },
      );
      // generate preview URLs for images
      const urls = files.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => ({ ...prev, [docTypeId]: urls[0] }));
    } else {
      setValue(
        "documents",
        { ...documents, [docTypeId]: files[0] },
        { shouldTouch: true },
      );
      if (files[0].type.startsWith("image/")) {
        setPreviews((prev) => ({
          ...prev,
          [docTypeId]: URL.createObjectURL(files[0]),
        }));
      }
    }
    // Reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  const removeFile = (docTypeId: DocumentTypeId) => {
    const updated = { ...documents };
    delete updated[docTypeId];
    setValue("documents", updated, { shouldTouch: true });
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[docTypeId];
      return next;
    });
  };

  const renderSlot = (doc: (typeof DOCUMENT_TYPES)[number]) => {
    const file = documents[doc.id];
    const hasFile =
      file != null && (Array.isArray(file) ? file.length > 0 : true);
    const fileName = hasFile
      ? Array.isArray(file)
        ? `${file.length} photo${file.length > 1 ? "s" : ""} selected`
        : (file as File).name
      : null;

    return (
      <div
        key={doc.id}
        className={cn(
          "rounded-2xl border-2 p-5 transition-all",
          hasFile
            ? "border-emerald-300 bg-emerald-50/40"
            : doc.required
              ? "border-slate-200 bg-white"
              : "border-dashed border-slate-200 bg-slate-50/50",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div
            className={cn(
              "mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0",
              hasFile ? "bg-emerald-500" : "bg-slate-200",
            )}
          >
            {hasFile ? (
              <CheckCircle2 className="h-4 w-4 text-white" />
            ) : (
              <span className="text-xs text-slate-500 font-bold">
                {doc.required ? "!" : "?"}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-800">{doc.label}</p>
              {doc.required ? (
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                  Required
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  Optional
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {doc.description}
            </p>

            {/* Uploaded file row */}
            {hasFile && fileName && (
              <div className="mt-3 flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-xl">
                <div className="bg-amber-100 p-1.5 rounded-lg shrink-0">
                  <FileText className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700 truncate flex-1">
                  {fileName}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(doc.id as DocumentTypeId)}
                  className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {/* Hidden file input */}
              <input
                type="file"
                ref={(el) => {
                  fileRefs.current[doc.id] = el;
                }}
                accept={doc.accept}
                multiple={"multiple" in doc ? doc.multiple : false}
                className="hidden"
                onChange={(e) =>
                  handleFileChange(
                    doc.id as DocumentTypeId,
                    e,
                    "multiple" in doc ? !!doc.multiple : false,
                  )
                }
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRefs.current[doc.id]?.click()}
                className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 text-xs font-bold"
              >
                <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
                {hasFile ? "Replace" : "Upload"}
              </Button>

              {"hasTemplate" in doc &&
                doc.hasTemplate &&
                "templateUrl" in doc && (
                  <a
                    href={doc.templateUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Template
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const required = DOCUMENT_TYPES.filter((d) => d.required);
  const optional = DOCUMENT_TYPES.filter((d) => !d.required);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1">
          Supporting Documents
        </h2>
        <p className="text-slate-400 text-sm mb-3">
          Upload the documents below to complete your project registration.
        </p>
        <div className="flex items-center gap-4 mb-1">
          <Progress
            value={100}
            className="h-2 bg-slate-100"
            indicatorClassName="bg-emerald-500"
          />
          <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
            Step 3 of 3
          </span>
        </div>

        {/* Completion indicator */}
        <p className="text-xs font-medium text-slate-500 mt-2">
          <span
            className={cn(
              "font-bold",
              allRequiredFilled ? "text-emerald-600" : "text-amber-600",
            )}
          >
            {filledRequired.length} of {requiredSlots.length}
          </span>{" "}
          required documents uploaded
        </p>
      </div>

      {/* Required slots */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Required Documents
        </p>
        <div className="space-y-4">
          {required.map((doc) => renderSlot(doc))}
        </div>
      </div>

      {/* Optional slots */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Optional Documents
        </p>
        <div className="space-y-4">
          {optional.map((doc) => renderSlot(doc))}
        </div>
      </div>

      {/* Submit note */}
      {!allRequiredFilled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-800">
            Please upload all required documents before submitting. Your project
            will be saved as a draft and you can complete the upload later from
            your dashboard.
          </p>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-4 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="px-8 py-3 text-slate-400 font-bold"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !allRequiredFilled}
          className="flex-1 bg-[#2ebc8d] hover:bg-[#27a37b] py-6 text-lg rounded-xl font-bold transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting…
            </span>
          ) : !allRequiredFilled ? (
            <span className="flex items-center gap-2">
              Missing Required Docs
            </span>
          ) : (
            "Submit Project"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step3_Documents;
