import { Rocket, Sparkles, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/constants/sidebar-items";

interface HeroSectionProps {
  userType: UserType;
  userName: string;
}

const HeroSection = ({ userType, userName }: HeroSectionProps) => {
  const router = useRouter();

  const getContent = () => {
    switch (userType) {
      case "Company":
        return {
          title: "Maximize Your Environmental Impact",
          description:
            "Discover verified green projects, invest in high-quality carbon offsets, and achieve your sustainability goals with ease.",
          cta: "Explore Marketplace",
          url: "/marketplace",
          icon: <Sparkles className="mr-2 h-5 w-5" />,
        };
      case "Admin":
        return {
          title: "Streamline Site Verification",
          description:
            "Manage your assigned businesses, schedule site visits, and collect field data efficiently to accelerate the verification process.",
          cta: "View Assignments",
          url: "/assigned-businesses",
          icon: <Target className="mr-2 h-5 w-5" />,
        };
      default:
        return {
          title: "Ready to make an impact?",
          description:
            "Track your green projects, earn carbon credits, and contribute to a sustainable future.",
          cta: "Register Project",
          url: "/new-project",
          icon: <Rocket className="mr-2 h-5 w-5" />,
        };
    }
  };

  const content = getContent();

  return (
    <div className="bg-white p-6 rounded-xl mx-auto max-w-5xl shadow-sm flex flex-col md:flex-row justify-between gap-6">
      {/* Dynamic Content */}
      <div className="space-y-4 flex-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md">
            {content.description}
          </p>
        </div>
        <Button
          onClick={() => router.push(content.url)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white mt-4 h-12 px-6 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          {content.icon}
          {content.cta}
        </Button>
      </div>

      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-emerald-500 p-6 text-white shadow-lg min-h-48 md:min-h-56 max-w-sm w-full">
        <div className="relative z-10">
          <h3 className="text-xl font-semibold">
            Welcome back, {userName.split(" ")[0] || "User"}
          </h3>
          <p className="mt-2 text-sm text-emerald-50 opacity-90">
            {userType === "Admin"
              ? "Check your schedule for today's site visits and data verification tasks."
              : "Take a quick tour to familiarize yourself with the latest updates on Crevy."}
          </p>
          <Button
            onClick={() => router.push("/support")}
            variant="outline"
            className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-10 px-4 text-xs font-medium"
          >
            <Zap className="mr-2 h-3.5 w-3.5" />
            Learn More
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
