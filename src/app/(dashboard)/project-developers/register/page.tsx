import { ChevronRight, Home, Users } from "lucide-react";
import Link from "next/link";
import ProjectDeveloperOnboardingForm from "@/components/forms/ProjectDeveloperOnboardingForm";

export default function ProjectDeveloperRegisterPage() {
  return (
    <div className="min-h-screen bg-muted font-sans selection:bg-secondary selection:text-white pb-24">
      {/* ── Editorial Header ── */}
      <div className="bg-white border-b border-border pt-12 pb-12">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/project-developers"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" /> Directory
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Entity Onboarding</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-6 h-[1px] bg-secondary"></div>
                <span className="text-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
                  Registration Protocol
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-sans text-foreground tracking-tight leading-none mb-4">
                Onboard <span className="italic text-muted-foreground">Entity.</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                Systematically register new originators, configure payout
                vectors, and map primary spatial assets to initiate the KYC
                verification lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Section ── */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 mt-12">
        <ProjectDeveloperOnboardingForm />
      </div>
    </div>
  );
}
