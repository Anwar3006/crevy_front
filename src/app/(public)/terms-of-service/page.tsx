"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Gavel,
  Globe,
  HelpCircle,
  Leaf,
  Lock,
  Mail,
  Scale,
  ShieldAlert,
  UserCheck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── SIDEBAR SECTIONS ────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of Terms", icon: BadgeCheck },
  { id: "definitions", label: "Definitions", icon: BookOpen },
  { id: "eligibility", label: "Eligibility", icon: UserCheck },
  { id: "account", label: "Account Registration", icon: Lock },
  { id: "platform-use", label: "Platform Use", icon: Globe },
  { id: "prohibited", label: "Prohibited Activities", icon: ShieldAlert },
  { id: "carbon-credits", label: "Carbon Credit Terms", icon: Leaf },
  { id: "project-owners", label: "Project Owner Obligations", icon: Briefcase },
  { id: "corporate-buyers", label: "Corporate Buyer Terms", icon: Building2 },
  { id: "payments", label: "Payments & Fees", icon: Wallet },
  { id: "ip", label: "Intellectual Property", icon: FileText },
  { id: "governing-law", label: "Governing Law", icon: Gavel },
  { id: "disputes", label: "Dispute Resolution", icon: Scale },
  { id: "changes", label: "Changes to Terms", icon: HelpCircle },
  { id: "contact", label: "Contact Us", icon: Mail },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  return (
    <div className="animate-in fade-in duration-700">
      <TermsHero />
      <TermsContent
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}

function TermsHero() {
  return (
    <section className="bg-myBlue pt-32 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(44,194,149,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-myGreen/10 border border-myGreen/20 px-4 py-2 rounded-full mb-8">
            <Gavel size={14} className="text-myGreen" />
            <span className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase">
              Legal · Governed by the Laws of Ghana
            </span>
          </div>

          <h1
            className="font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Terms of Service
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl">
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Crevy platform, operated by{" "}
            <strong className="text-white">Foovante Global Ltd</strong>.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
              <span className="text-white font-medium">Last Updated:</span> 3
              April 2026
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
              <span className="text-white font-medium">Effective:</span> 3 April
              2026
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TermsContent({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (id: string) => void;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </p>
              <nav className="space-y-1" aria-label="Terms of service sections">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                      activeSection === section.id
                        ? "bg-myGreen/10 text-myGreen"
                        : "text-gray-500 hover:text-myBlue hover:bg-gray-50",
                    )}
                  >
                    <section.icon size={15} className="shrink-0" />
                    {section.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-16">
            <TermsSection id="acceptance" title="1. Acceptance of Terms">
              <p>
                By accessing or using the Crevy Platform, you agree to be bound
                by these Terms.
              </p>
            </TermsSection>

            <TermsSection id="definitions" title="2. Definitions">
              <p>Definition of key terms used throughout this document.</p>
            </TermsSection>
          </div>
        </div>
      </div>
    </section>
  );
}

function TermsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-[3px] w-10 bg-myGreen rounded-full shrink-0" />
        <h2
          className="font-bold text-2xl md:text-3xl text-myBlue leading-tight"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
        {children}
      </div>
    </motion.div>
  );
}
