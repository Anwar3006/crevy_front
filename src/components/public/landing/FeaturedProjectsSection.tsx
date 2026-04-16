"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  MapPin,
  Quote,
  Star,
  Trees,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * FeaturedProjectsSection showcasing live green investments.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered FeaturedProjectsSection component.
 */
export function FeaturedProjectsSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const projects = [
    {
      type: "Regenerative Agriculture",
      name: "Kumasi Regenerative Farm",
      location: "Ashanti Region, Ghana 🇬🇭",
      area: "240 ha",
      impact: "1,200 tCO₂e / yr",
      status: "Active",
      color: "from-green-500 to-emerald-600",
    },
    {
      type: "Reforestation",
      name: "Volta Basin Reforestation",
      location: "Volta Region, Ghana 🇬🇭",
      area: "500 ha",
      impact: "3,500 tCO₂e / yr",
      status: "Under Review",
      color: "from-emerald-500 to-teal-600",
    },
    {
      type: "Renewable Energy",
      name: "Tema Solar Initiative",
      location: "Greater Accra, Ghana 🇬🇭",
      area: "15 ha",
      impact: "800 tCO₂e / yr",
      status: "Active",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <section id="projects" className="py-14 md:py-18 bg-[#F9FBF9]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] w-8 bg-myGreen" />
              <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
                Marketplace
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-6xl text-myBlue leading-tight">
              Live <br />
              Investments
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-lg leading-relaxed border-l border-gray-200 pl-6">
            Directly funding verified African projects with measurable carbon
            sequestration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {projects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: idx * 0.05,
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group relative bg-white border border-gray-200 p-8 rounded-sm hover:border-myGreen/50 transition-colors duration-500"
            >
              <div className="flex justify-between items-center mb-10">
                <div
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border",
                    project.status === "Active"
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                      : "border-gray-200 text-gray-500 bg-gray-50",
                  )}
                >
                  ● {project.status}
                </div>
                <Activity
                  size={16}
                  className="text-gray-300 group-hover:text-myGreen transition-colors"
                />
              </div>

              <div className="mb-5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  {project.type}
                </span>
                <h3 className="font-[family-name:var(--font-syne)] font-bold text-2xl text-myBlue leading-snug">
                  {project.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 mb-5">
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block mb-1">
                    Location
                  </span>
                  <div className="flex items-center text-xs font-bold text-myBlue">
                    <MapPin size={12} className="mr-1 text-myGreen" />
                    {project.location.split(",")[0]}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block mb-1">
                    Scale
                  </span>
                  <div className="flex items-center text-xs font-bold text-myBlue">
                    <Trees size={12} className="mr-1 text-myGreen" />
                    {project.area}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div
                    className={cn(
                      "text-3xl font-black tracking-tighter transition-colors",
                      project.status === "Active"
                        ? "text-emerald-600"
                        : "text-gray-400",
                    )}
                  >
                    {project.impact.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                    tCO₂e / yr Impact
                  </div>
                </div>

                <Link
                  href={`/marketplace/${idx}`}
                  className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-myBlue group-hover:text-white group-hover:border-myBlue transition-all duration-300"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/marketplace"
            className="group flex items-center gap-4 text-myBlue font-bold text-sm tracking-widest uppercase"
          >
            Explore all opportunities
            <span className="h-10 w-10 rounded-full bg-myBlue text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * TestimonialsSection highlighting user stories.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered TestimonialsSection component.
 */
export function TestimonialsSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const testimonials = [
    {
      name: "Daniel Asante",
      role: "Project Owner, Regenerative Farmer",
      location: "Brong-Ahafo, Ghana",
      quote:
        "Crevy made it possible for me to turn 15 years of sustainable farming into a verified income stream. The verification process was thorough but fair — and I got paid within 30 days of my first credit sale.",
    },
    {
      name: "Abena Mensah-Quartey",
      role: "Sustainability Director, FMCG Company",
      location: "Accra, Ghana",
      quote:
        "We needed a credible way to offset our Scope 3 emissions. Crevy gave us direct access to local African projects with full audit trails. Our ESG report practically writes itself now.",
    },
    {
      name: "Kofi Amponsah",
      role: "Project Owner, Reforestation Lead",
      location: "Volta Region, Ghana",
      quote:
        "Before Crevy, I had no idea my tree-planting work could generate revenue. Now I have 3 verified projects on the marketplace and a growing portfolio of corporate buyers.",
    },
  ];

  return (
    <section className="py-14 md:py-18 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-4">
            Real Impact, Real People
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from project owners and companies already using Crevy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: idx * 0.05,
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm relative group hover:shadow-xl transition-all"
            >
              <Quote
                size={48}
                className="text-myGreen/10 absolute top-8 right-8"
              />
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-8 text-lg">
                "{t.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-myGreen/10 flex items-center justify-center text-myGreen font-bold text-xl mr-4">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-syne)] font-bold text-myBlue">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                  <p className="text-[10px] text-myGreen font-bold uppercase mt-1">
                    {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * FinalCTASection for the bottom of the landing page.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered FinalCTASection component.
 */
export function FinalCTASection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="relative min-h-[60vh] flex items-center py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
          alt="Lush green nature background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-myBlue/95 via-myBlue/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ x: shouldReduceMotion ? 0 : -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="max-w-2xl"
        >
          <div className="inline-block bg-myGreen/20 backdrop-blur-md border border-myGreen/30 text-myGreen px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Join the Movement
          </div>
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
            Start Your Carbon Journey Today
          </h2>
          <p className="text-white/70 text-xl mb-12 leading-relaxed">
            Whether you own a green project or run a company with a climate
            commitment, Crevy gives you the tools, the market, and the
            verification to make it real.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              size="lg"
              asChild
              className="bg-myGreen text-white hover:bg-myDarkGreen border-none px-8 py-6 text-lg"
            >
              <Link href="/register">Register a Project</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-black border-white/40 hover:bg-white/10 hover:text-gray-400 px-8 py-6 text-lg"
            >
              <Link href="/register">Offset My Emissions</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
