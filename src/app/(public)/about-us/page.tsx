"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Leaf, Lightbulb, Shield, Target, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

import { Globe, Users } from "lucide-react";

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

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion() as boolean;

  return (
    <div className="animate-in fade-in duration-700">
      <AboutHero shouldReduceMotion={shouldReduceMotion} />
      <MissionVisionSection shouldReduceMotion={shouldReduceMotion} />
      <StorySection shouldReduceMotion={shouldReduceMotion} />
      <CoreValuesSection shouldReduceMotion={shouldReduceMotion} />
      <ImpactSection shouldReduceMotion={shouldReduceMotion} />
      <TeamSection shouldReduceMotion={shouldReduceMotion} />
      <MilestonesSection shouldReduceMotion={shouldReduceMotion} />
      <AboutCTA shouldReduceMotion={shouldReduceMotion} />
    </div>
  );
}

function AboutHero({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-myBlue pt-20">
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
          className="font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-syne)" }}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're Building Africa's
          <br />
          <span className="text-myGreen italic">Green Economy</span>
        </motion.h1>
      </div>
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
          <div className="bg-myBlue rounded-3xl p-10 relative overflow-hidden group">
            <Target size={28} className="text-myGreen mb-6" />
            <h2 className="text-2xl md:text-3xl text-white mb-6 font-bold">
              Our Mission
            </h2>
            <p className="text-white/60">
              Make voluntary carbon markets work for African communities.
            </p>
          </div>
          <div className="bg-myGreen rounded-3xl p-10 relative overflow-hidden group">
            <Zap size={28} className="text-white mb-6" />
            <h2 className="text-2xl md:text-3xl text-white mb-6 font-bold">
              Our Vision
            </h2>
            <p className="text-white/80">
              A continent where every green project earns what it's worth.
            </p>
          </div>
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
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl text-myBlue mb-8 font-bold">
          The Crevy Story
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
          In 2022, Foovante Global was founded in Accra with a single
          observation: Africa generates over 30% of the world's carbon
          sequestration potential but receives less than 2% of global voluntary
          carbon market revenue.
        </p>
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
        <h2 className="text-4xl md:text-5xl text-myBlue mb-16 text-center font-bold">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {CORE_VALUES.map((value, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
            >
              <value.icon className="text-myGreen mb-6 w-8 h-8" />
              <h3 className="text-xl font-bold text-myBlue mb-3">
                {value.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="py-24 bg-myBlue">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl text-white mb-16 font-bold">
          Our Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {IMPACT_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="text-3xl font-bold text-myGreen mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  return (
    <section className="py-24 bg-[#F9FBF9]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl text-myBlue mb-16 text-center font-bold">
          Meet the Team
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-xl font-bold bg-gradient-to-br",
                  member.color,
                  member.accentColor,
                )}
              >
                {member.initials}
              </div>
              <h3 className="text-xl font-bold text-myBlue mb-1">
                {member.name}
              </h3>
              <p className={cn("text-sm font-bold mb-4", member.accentColor)}>
                {member.role}
              </p>
              <p className="text-gray-500 text-sm">{member.bio}</p>
            </div>
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl text-myBlue mb-16 font-bold">
          Our Journey
        </h2>
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          {MILESTONES.map((m, idx) => (
            <div key={idx} className="flex gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-myBlue border-4 border-myGreen flex items-center justify-center font-bold text-myGreen shrink-0">
                {m.year}
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl flex-1">
                <h3 className="font-bold text-lg text-myBlue mb-2">
                  {m.title}
                </h3>
                <p className="text-gray-500 text-sm">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  return (
    <section className="py-28 bg-myBlue text-center text-white">
      <h2 className="text-4xl md:text-6xl font-bold mb-8">
        Ready to Build Africa's Green Future?
      </h2>
      <Link href="/register">
        <Button className="bg-myGreen text-white px-10 py-6 rounded-2xl text-lg hover:scale-105 transition-transform">
          Join the Platform
        </Button>
      </Link>
    </section>
  );
}
