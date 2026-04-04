"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Globe,
  Heart,
  Leaf,
  Lightbulb,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Syne } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicNavbar } from "@/components/public/public-navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

// ─── DATA ────────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  {
    name: "Kwame Ofori",
    role: "CEO & Co-Founder",
    bio: "Former climate policy advisor with 12 years in African carbon markets. Kwame built Crevy to democratise access to green finance for smallholder farmers and local project developers.",
    initials: "KO",
    color: "from-myGreen/30 to-myGreen/10",
    accentColor: "text-myGreen",
    linkedIn: "#",
  },
  {
    name: "Abena Darko",
    role: "CTO & Co-Founder",
    bio: "Full-stack engineer and data scientist previously at a London-based climate tech startup. Abena leads Crevy's platform architecture and our carbon calculation engine.",
    initials: "AD",
    color: "from-blue-500/30 to-blue-500/10",
    accentColor: "text-blue-400",
    linkedIn: "#",
  },
  {
    name: "Emmanuel Asiedu",
    role: "Head of Carbon Verification",
    bio: "Certified carbon auditor trained under VCS and Gold Standard methodologies. Emmanuel oversees all project audits and ensures every credit issued on Crevy meets international standards.",
    initials: "EA",
    color: "from-emerald-500/30 to-emerald-500/10",
    accentColor: "text-emerald-400",
    linkedIn: "#",
  },
  {
    name: "Naomi Sarpong",
    role: "Head of Partnerships",
    bio: "Sustainability strategist with deep experience in corporate ESG programmes across West Africa. Naomi bridges the gap between project owners and the companies that invest in them.",
    initials: "NS",
    color: "from-purple-500/30 to-purple-500/10",
    accentColor: "text-purple-400",
    linkedIn: "#",
  },
];

const CORE_VALUES = [
  {
    icon: Shield,
    title: "Integrity Above All",
    description:
      "Every carbon credit on Crevy is verified by independent auditors. We never compromise on scientific accuracy, no matter the commercial pressure.",
  },
  {
    icon: Leaf,
    title: "Climate-First Thinking",
    description:
      "Our platform decisions start with one question: does this create genuine climate impact? Revenue follows purpose, not the other way around.",
  },
  {
    icon: Users,
    title: "Community Empowerment",
    description:
      "We believe African farmers and project developers deserve equitable access to global carbon markets. Crevy removes every barrier we can.",
  },
  {
    icon: Lightbulb,
    title: "Radical Transparency",
    description:
      "Full audit trails, real-time data, and open methodologies. Buyers and sellers on Crevy always know exactly what they're getting.",
  },
  {
    icon: Globe,
    title: "Pan-African Vision",
    description:
      "We start in Ghana but build for the continent. Our platform is designed to scale across all 54 African nations and their unique ecosystems.",
  },
  {
    icon: Heart,
    title: "People over Profit",
    description:
      "Before we optimize for margins, we optimize for the wellbeing of project communities, the health of local ecosystems, and long-term sustainability.",
  },
];

const IMPACT_STATS = [
  { value: "200+", label: "Verified Projects" },
  { value: "50K+", label: "tCO₂e Offset" },
  { value: "80+", label: "Corporate Partners" },
  { value: "6", label: "Project Categories" },
  { value: "Ghana", label: "Headquartered In" },
  { value: "2022", label: "Founded" },
];

const MILESTONES = [
  {
    year: "2022",
    title: "Foovante Global is founded in Accra",
    desc: "Kwame and Abena identify the massive gap between African green projects and international carbon markets. The first Crevy prototype goes live.",
  },
  {
    year: "2023",
    title: "First 50 projects verified",
    desc: "Crevy verifies its first cohort of regenerative agriculture and reforestation projects in Ghana, issuing over 8,000 tCO₂e in credits.",
  },
  {
    year: "2024",
    title: "Marketplace launches publicly",
    desc: "The Crevy Marketplace opens to corporate buyers. First international company offsets its Scope 3 emissions through a Volta Basin reforestation project.",
  },
  {
    year: "2025",
    title: "200+ active projects and 80 company partners",
    desc: "Crevy reaches its first major milestone, with projects spanning 6 categories and partners across Ghana, Nigeria, and Côte d'Ivoire.",
  },
  {
    year: "2026",
    title: "Continental expansion begins",
    desc: "Crevy launches its pan-African roadmap, beginning with pilot programmes in Kenya, Rwanda, and Senegal.",
  },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion() as boolean;

  return (
    <div className={cn(syne.variable, "font-sans selection:bg-myGreen/30")}>
      <PublicNavbar />
      <main>
        <AboutHero shouldReduceMotion={shouldReduceMotion} />
        <MissionVisionSection shouldReduceMotion={shouldReduceMotion} />
        <StorySection shouldReduceMotion={shouldReduceMotion} />
        <CoreValuesSection shouldReduceMotion={shouldReduceMotion} />
        <ImpactSection shouldReduceMotion={shouldReduceMotion} />
        <TeamSection shouldReduceMotion={shouldReduceMotion} />
        <MilestonesSection shouldReduceMotion={shouldReduceMotion} />
        <AboutCTA shouldReduceMotion={shouldReduceMotion} />
      </main>
      <PublicFooter />
    </div>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function AboutHero({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-myBlue pt-20">
      {/* Background texture */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
          alt="Lush green African landscape"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-myBlue/80 via-myBlue/60 to-myBlue" />
      </div>

      {/* Decorative green orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-myGreen/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-myGreen/10 backdrop-blur-md border border-myGreen/20 px-4 py-2 rounded-full mb-8"
        >
          <Leaf size={14} className="text-myGreen" />
          <span className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase">
            Our Story · Our Mission · Our People
          </span>
        </motion.div>

        <motion.h1
          className="font-[family-name:var(--font-syne)] font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're Building Africa's
          <br />
          <span className="text-myGreen italic">Green Economy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-white/70 text-lg md:text-xl leading-relaxed mb-12"
        >
          Crevy, by Foovante Global, is the platform that turns Africa's most
          important climate projects into verified carbon credits — giving
          project owners fair income and companies a credible path to net zero.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 z-10"
        >
          <Button
            size="lg"
            asChild
            className="bg-myGreen text-white hover:bg-myDarkGreen border-none px-10 py-6 text-base rounded-2xl"
          >
            <Link href="/register">Join the Platform</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-black border-white/30 hover:bg-white/10 hover:text-gray-400 px-10 py-6 text-base rounded-2xl"
          >
            <Link href="/marketplace">View Marketplace</Link>
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-8" />
    </section>
  );
}

function MissionVisionSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-myBlue rounded-3xl p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-myGreen/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-myGreen/10 rounded-2xl mb-6">
                <Target size={28} className="text-myGreen" />
              </div>
              <p className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Our Mission
              </p>
              <h2 className="font-[family-name:var(--font-syne)] font-bold text-2xl md:text-3xl text-white mb-6 leading-tight">
                Make voluntary carbon markets work for African communities
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                We exist to remove every barrier standing between Africa's most
                impactful green projects and the global capital they deserve.
                From scientific verification to seamless credit trading — Crevy
                handles it all.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-myGreen rounded-3xl p-10 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-6">
                <Zap size={28} className="text-white" />
              </div>
              <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Our Vision
              </p>
              <h2 className="font-[family-name:var(--font-syne)] font-bold text-2xl md:text-3xl text-white mb-6 leading-tight">
                A continent where every green project earns what it's worth
              </h2>
              <p className="text-white/80 text-base leading-relaxed">
                By 2030, we envision a pan-African green marketplace where
                10,000+ projects generate sustainable income, companies achieve
                verified net-zero goals, and millions of rural livelihoods are
                transformed by climate finance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StorySection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="py-24 bg-[#F9FBF9]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-8 bg-myGreen" />
              <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
                How It Started
              </span>
              <div className="h-[1px] w-8 bg-myGreen" />
            </div>
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-8">
              The Crevy Story
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <Image
                  src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
                  alt="African green project landscape"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-myBlue/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <p className="text-white font-[family-name:var(--font-syne)] font-bold text-xl mb-1">
                      "We asked ourselves: why is it so hard for an African
                      farmer to earn from carbon credits?"
                    </p>
                    <p className="text-white/60 text-sm">— Kwame Ofori, CEO</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-gray-700 text-lg leading-relaxed">
                In 2022, Foovante Global was founded in Accra with a single
                observation: Africa generates over{" "}
                <span className="text-myGreen font-semibold">
                  30% of the world's carbon sequestration potential
                </span>{" "}
                through its forests, wetlands, and farmlands — yet receives less
                than 2% of global voluntary carbon market revenue.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                The barriers were everywhere. Certification costs ran into tens
                of thousands of dollars. Verification processes took years.
                Smallholder farmers had no way to prove the climate impact of
                their regenerative practices. Corporate buyers had no way to
                trust what they were buying.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Crevy was built to dismantle all of that — one verified credit
                at a time. We combined local field expertise with international
                audit standards and a transparent digital marketplace to create
                something that had never existed before: a{" "}
                <span className="text-myGreen font-semibold">
                  fully integrated carbon credit platform designed for Africa
                </span>
                .
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-[2px] w-12 bg-myGreen" />
                <span className="text-myGreen font-bold text-sm uppercase tracking-widest">
                  Foovante Global · Est. 2022 · Accra, Ghana
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreValuesSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-myGreen" />
            <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
              What We Stand For
            </span>
            <div className="h-[1px] w-8 bg-myGreen" />
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Six principles that guide every decision we make at Crevy — from
            product features to the projects we accept.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {CORE_VALUES.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-myGreen/20"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-myGreen/10 rounded-xl mb-6 group-hover:bg-myGreen/20 transition-colors">
                  <Icon size={22} className="text-myGreen" />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-myBlue mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImpactSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="py-24 bg-myBlue relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 80% 50%, rgba(44,194,149,0.2) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-myGreen" />
            <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
              The Numbers
            </span>
            <div className="h-[1px] w-8 bg-myGreen" />
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-white mb-4">
            Our Impact So Far
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {IMPACT_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="font-[family-name:var(--font-syne)] font-bold text-3xl text-myGreen mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications / Standards */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-6">
            Aligned with international standards
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "VCS (Verra)",
              "Gold Standard",
              "CDM (UNFCCC)",
              "Plan Vivo",
              "GHGP Protocol",
              "ISO 14064",
            ].map((standard) => (
              <span
                key={standard}
                className="bg-white/5 border border-white/10 text-white/70 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Award size={12} className="text-myGreen" />
                {standard}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TeamSection({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  return (
    <section className="py-24 bg-[#F9FBF9]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-myGreen" />
            <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
              The People Behind Crevy
            </span>
            <div className="h-[1px] w-8 bg-myGreen" />
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Climate scientists, technologists, and market builders united by a
            single goal: a greener, fairer Africa.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center font-[family-name:var(--font-syne)] font-bold text-xl mb-6",
                  member.color,
                  member.accentColor,
                )}
              >
                {member.initials}
              </div>

              <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-myBlue mb-1">
                {member.name}
              </h3>
              <p className={cn("text-sm font-bold mb-4", member.accentColor)}>
                {member.role}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {member.bio}
              </p>
              <a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex items-center text-xs font-bold text-myBlue/60 hover:text-myGreen transition-colors gap-1"
              >
                LinkedIn <ArrowRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MilestonesSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-myGreen" />
            <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
              Our Journey
            </span>
            <div className="h-[1px] w-8 bg-myGreen" />
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-4">
            Milestones
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-myGreen via-myGreen/30 to-transparent" />

          <div className="space-y-12">
            {MILESTONES.map((milestone, idx) => (
              <motion.div
                key={milestone.year}
                initial={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : idx % 2 === 0 ? -40 : 40,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={cn(
                  "relative flex items-start gap-8",
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse",
                )}
              >
                {/* Year marker */}
                <div className="relative z-10 shrink-0 flex flex-col items-center ml-0 md:ml-0">
                  <div className="w-16 h-16 rounded-2xl bg-myBlue border-4 border-myGreen flex items-center justify-center font-[family-name:var(--font-syne)] font-bold text-myGreen text-sm">
                    {milestone.year}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "bg-[#F9FBF9] border border-gray-100 rounded-2xl p-6 flex-1",
                    idx % 2 === 0 ? "md:mr-8" : "md:ml-8",
                  )}
                >
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-lg text-myBlue mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCTA({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
          alt="Green African nature background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-myBlue/97 via-myBlue/85 to-myBlue/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-block bg-myGreen/20 backdrop-blur-md border border-myGreen/30 text-myGreen px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Be Part of the Change
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Ready to Build Africa's Green Future?
          </h2>
          <p className="text-white/70 text-xl mb-10 leading-relaxed">
            Whether you're a project owner looking to monetise your climate
            impact, or a company building its sustainability credentials — Crevy
            has a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              asChild
              className="bg-myGreen text-white hover:bg-myDarkGreen border-none px-8 py-6 text-base rounded-xl"
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-black border-white/30 hover:bg-white/10 hover:text-gray-400 px-8 py-6 text-base rounded-xl"
            >
              <Link href="/support">Talk to Our Team</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
