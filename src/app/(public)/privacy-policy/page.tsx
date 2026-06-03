"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Cookie,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  Shield,
  Trash2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── POLICY SECTIONS DATA ────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "data-collected", label: "Data We Collect", icon: Database },
  { id: "how-we-use", label: "How We Use Data", icon: Eye },
  { id: "legal-basis", label: "Legal Basis", icon: UserCheck },
  { id: "data-sharing", label: "Data Sharing", icon: Globe },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "your-rights", label: "Your Rights", icon: Lock },
  { id: "data-retention", label: "Data Retention", icon: Trash2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "children", label: "Children's Privacy", icon: Bell },
  { id: "changes", label: "Policy Changes", icon: Bell },
  { id: "contact", label: "Contact Us", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="animate-in fade-in duration-700">
      <PrivacyHero />
      <PrivacyContent
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}

function PrivacyHero() {
  return (
    <section className="bg-myBlue pt-32 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(44,194,149,0.08) 0%, transparent 60%)",
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
            <Shield size={14} className="text-myGreen" />
            <span className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase">
              Legal · GDPR Compliant · Ghana Data Protection Act
            </span>
          </div>

          <h1
            className="font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl">
            Foovante Global Ltd (&quot;Crevy&quot;, &quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;) is committed to protecting and
            respecting your privacy. This policy explains how we collect, use,
            store, and protect personal data when you use the Crevy platform.
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

function PrivacyContent({
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
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </p>
              <nav className="space-y-1" aria-label="Privacy policy sections">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                        activeSection === section.id
                          ? "bg-myGreen/10 text-myGreen"
                          : "text-gray-500 hover:text-myBlue hover:bg-gray-50",
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      {section.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-lg max-w-none space-y-16">
              {/* 1. Overview */}
              <PolicySection
                id="overview"
                title="1. Overview & Data Controller"
              >
                <p>
                  This Privacy Policy applies to all users of the Crevy
                  platform, accessible at{" "}
                  <Link
                    href="https://crevy.app"
                    className="text-myGreen hover:underline"
                  >
                    crevy.app
                  </Link>{" "}
                  and operated by:
                </p>
                <InfoBox>
                  <strong>Foovante Global Ltd</strong>
                  <br />
                  Accra, Greater Accra, Ghana
                </InfoBox>
              </PolicySection>

              <PolicySection
                id="data-collected"
                title="2. Personal Data We Collect"
              >
                <p>
                  We collect essential data to provide our services and ensure
                  compliance.
                </p>
              </PolicySection>

              {/* Add more sections as needed or placeholders */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PolicySection({
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
        <div className="h-[3px] w-10 bg-myGreen rounded-full" />
        <h2
          className="font-bold text-2xl md:text-3xl text-myBlue"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
    </motion.div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-myBlue/5 border border-myBlue/10 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed mt-4">
      {children}
    </div>
  );
}
