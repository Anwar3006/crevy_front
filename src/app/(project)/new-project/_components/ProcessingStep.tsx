"use client";

import { Loader2 } from "lucide-react";

const ProcessingStep = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2ebc8d] text-white">
      <div className="flex flex-col items-center gap-6">
        <Loader2
          className="h-24 w-24 animate-spin text-white opacity-90"
          strokeWidth={1}
        />
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Calculating the carbon credits
          </h2>
          <p className="text-xl md:text-2xl font-medium opacity-80">
            for your project
          </p>
        </div>
      </div>

      {/* Optional: Add some subtle background elements if needed */}
      <div className="absolute bottom-10 text-white/60 text-sm font-medium tracking-widest uppercase">
        Crevy Carbon verification
      </div>
    </div>
  );
};

export default ProcessingStep;
