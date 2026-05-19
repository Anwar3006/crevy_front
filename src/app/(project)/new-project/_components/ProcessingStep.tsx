"use client";

import { Leaf, Loader2 } from "lucide-react";

const ProcessingStep = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#131927] text-white">
      <div className="flex flex-col items-center gap-8 max-w-md text-center px-6">
        <div className="relative">
          <Loader2
            className="h-20 w-20 animate-spin text-[#2ebc8d] opacity-90"
            strokeWidth={1}
          />
          <Leaf className="absolute inset-0 m-auto h-8 w-8 text-[#2ebc8d]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Registering your project
          </h2>
          <p className="text-lg font-medium text-white/70">
            Uploading your documents and creating your project profile…
          </p>
        </div>
        <p className="text-sm text-white/40 font-medium tracking-widest uppercase">
          Crevy Platform
        </p>
      </div>
    </div>
  );
};

export default ProcessingStep;
