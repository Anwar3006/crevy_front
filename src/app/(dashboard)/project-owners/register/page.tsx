import { ChevronRight, Home, Users } from "lucide-react";
import Link from "next/link";
import ProjectOwnerOnboardingForm from "@/components/forms/ProjectOwnerOnboardingForm";

export default function ProjectOwnerRegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header / Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
            <Link
              href="/dashboard"
              className="hover:text-[#2CC295] transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/project-owners"
              className="hover:text-[#2CC295] transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Project Owners
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#131927]">New Onboarding</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#131927] tracking-tight">
                Onboard Project Owner
              </h1>
              <p className="text-gray-500 mt-2 text-sm max-w-lg leading-relaxed">
                Systematically register new project owners and map their primary
                land assets for carbon verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ProjectOwnerOnboardingForm />
      </div>
    </div>
  );
}
