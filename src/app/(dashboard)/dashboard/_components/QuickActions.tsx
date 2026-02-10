import { Calculator, FileUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

const QuickActions = () => {
  return (
    <div className="mx-auto max-w-5xl">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Quick Actions
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Start a new project */}
        <Link
          href="/new-project"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#3B82F6] transition-colors group-hover:bg-[#3B82F6]">
            <FileUp className="h-6 w-6 stroke-white" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            Start a new project
          </h4>
          <p className="text-sm text-gray-600">
            Submit your green project for carbon credit estimation
          </p>
        </Link>

        {/* View Carbon Calculator */}
        <Link
          href="/carbon-calculator"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2CC295] transition-colors group-hover:bg-[#2CC295]">
            <Calculator className="h-6 w-6 stroke-white" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            View Carbon Calculator
          </h4>
          <p className="text-sm text-gray-600">
            Estimate potential CO₂ savings for your project
          </p>
        </Link>

        {/* Track My Verification */}
        <Link
          href="/track-verification"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#E39F40] transition-colors group-hover:bg-[#E39F40]">
            <ShieldCheck className="h-6 w-6 stroke-white" />
          </div>
          <h4 className="mb-2 font-semibold text-gray-900">
            Track My Verification
          </h4>
          <p className="text-sm text-gray-600">
            Monitor your project certification progress
          </p>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
