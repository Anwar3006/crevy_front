"use client";

import { Info, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SubmissionResultProps = {
  data: any;
};

const SubmissionResult = ({ data }: SubmissionResultProps) => {
  const router = useRouter();

  // Mock results based on the image, we can use real data from the API response if available
  const estimatedImpact = data?.impact?.totalLifetimeEstimate || 4.7;

  return (
    <div className="space-y-0 -m-6 xl:-m-12 overflow-hidden rounded-3xl">
      {/* Header Banner */}
      <div className="bg-[#2ebc8d] py-6 px-12 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight">
          Calculation Results
        </h2>
      </div>

      <div className="p-6 xl:p-12 space-y-12 bg-white">
        <div>
          <h3 className="text-slate-500 font-medium mb-8">
            Your Estimated Carbon Footprint:
          </h3>

          <div className="bg-[#e2f9f0] p-8 rounded-2xl w-fit min-w-[300px] border border-emerald-50">
            <div className="flex items-center gap-2 text-[#2ebc8d] mb-2">
              <Leaf className="h-5 w-5 fill-current" />
              <span className="font-semibold text-lg">Annual CO₂ emmited</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#268c6a]">
                {estimatedImpact}
              </span>
              <span className="text-3xl font-bold text-[#268c6a]">tonnes</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-6">
            <h3 className="text-xl font-bold text-slate-700">
              Environmental Impact
            </h3>
            <Info className="h-5 w-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-slate-500 text-sm">Equivalent to</p>
              <p className="text-2xl font-bold text-slate-800">
                120 Trees planted
              </p>
              <p className="text-slate-400 text-xs">
                carbon sequestration over 1 year
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 text-sm">Offsetting</p>
              <p className="text-2xl font-bold text-slate-800">
                3 Long-haul flights
              </p>
              <p className="text-slate-400 text-xs">
                Based on average emissions per passenger
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 h-14 rounded-xl font-bold text-lg"
          >
            Go to Project Profile
          </Button>
          <Button
            onClick={() => router.push("/marketplace")}
            className="flex-1 bg-[#2ebc8d] hover:bg-[#27a37b] h-14 rounded-xl font-bold text-lg"
          >
            Explore Marketplace
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-white border-2 border-[#2ebc8d] text-[#2ebc8d] hover:bg-emerald-50 h-14 rounded-xl font-bold text-lg"
          >
            View Carbon Credits
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
