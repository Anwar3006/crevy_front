import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className=" bg-white p-6 rounded-xl mx-auto max-w-5xl shadow-sm flex justify-between">
      {/* Ready to make an impact */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to make an impact?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your green projects, earn carbon credits, and contribute to a
            sustainable future.
          </p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white mt-8 px-4! py-6! text-xs md:text-sm 2xl:text-base">
          <Rocket className="mr-2 size-3 md:size-6 xl:size-7" />
          Get started
        </Button>
      </div>

      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-emerald-500 p-6 text-white shadow-lg min-h-56 max-w-96">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold">Welcome to crevy</h3>
          <p className="mt-2 text-sm text-emerald-50">
            Take a quick tour to familiarize yourself with what crevy has for
            you.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Take a tour
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
};

export default HeroSection;
