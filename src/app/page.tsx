"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Flame,
  MapPin,
  Menu,
  Quote,
  Recycle,
  Search,
  ShieldCheck,
  Sprout,
  Star,
  Sun,
  Trees,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { Syne } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { PublicFooter } from "@/components/public/public-footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

// --- Components ---

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion() as boolean;

  return (
    <div className={cn(syne.variable, "font-sans selection:bg-myGreen/30")}>
      <Navbar />
      <main>
        <HeroSection shouldReduceMotion={shouldReduceMotion} />
        <HowItWorksSection shouldReduceMotion={shouldReduceMotion} />
        <ProjectTypesSection shouldReduceMotion={shouldReduceMotion} />
        <WhyCrevySection shouldReduceMotion={shouldReduceMotion} />
        <ScrollingMarquee />
        <FeaturedProjectsSection shouldReduceMotion={shouldReduceMotion} />
        <TestimonialsSection shouldReduceMotion={shouldReduceMotion} />
        <FinalCTASection shouldReduceMotion={shouldReduceMotion} />
      </main>
      <PublicFooter />
    </div>
  );
}

// --- Sub-components ---

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-myBlue/90 backdrop-blur-md border-b border-myGreen/20 py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-[family-name:var(--font-syne)] font-bold text-2xl transition-colors",
            isScrolled ? "text-myGreen" : "text-white",
          )}
        >
          Crevy
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", href: "/" },
            { name: "Marketplace", href: "/marketplace" },
            { name: "How It Works", href: "/#how-it-works" },
            { name: "About", href: "/#about" },
            { name: "Support", href: "/support" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-myGreen transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            asChild
            className="text-white border border-white/30 hover:bg-white/10 hover:text-white"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-myGreen text-white hover:bg-myDarkGreen border-none"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 right-0 h-screen w-full bg-myBlue z-50 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-[family-name:var(--font-syne)] font-bold text-2xl text-myGreen">
                Crevy
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white"
              >
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6">
              {[
                { name: "Home", href: "/" },
                { name: "Marketplace", href: "/marketplace" },
                { name: "How It Works", href: "/#how-it-works" },
                { name: "About", href: "/#about" },
                { name: "Support", href: "/support" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-[family-name:var(--font-syne)] font-bold text-white/90 hover:text-myGreen transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col space-y-4">
              <Button
                variant="outline"
                asChild
                size="lg"
                className="w-full text-white border-white/30 hover:bg-white/10"
              >
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full bg-myGreen text-white hover:bg-myDarkGreen border-none"
              >
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  const fadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-slate-950">
      {/* 1. Background Layer - Keep z-0 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105" // Slight scale prevents white edges
          poster="/img/img/background.jpg"
        >
          <source
            src="https://videos.pexels.com/video-files/4629597/4629597-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Enhanced Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-myBlue/90" />
      </div>

      {/* 2. Main Content - Using flex-grow to push Stats to bottom */}
      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col items-center justify-center pt-20 pb-20">
        {/* Badge */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-6 md:mb-10"
        >
          <span className="animate-pulse">🌿</span>
          <span className="text-white/90 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Africa's Verified Green Marketplace
          </span>
        </motion.div>

        {/* Headline - Improved Leading/Kerning */}
        <div className="text-center mb-8">
          <motion.h1
            className="font-[family-name:var(--font-syne)] font-extrabold text-4xl md:text-6xl lg:text-8xl text-white leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Turn Green Projects <br className="hidden md:block" />
            <span className="text-myGreen italic">Into Climate Impact</span>
          </motion.h1>
        </div>

        {/* Sub-heading - Reduced max-width for better scanning */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-xl mx-auto text-base md:text-lg text-white/70 mb-10 text-center leading-relaxed font-medium"
        >
          Connect with sustainable farmers and energy operators to offset your
          carbon footprint —
          <span className="text-white">
            {" "}
            transparently, verifiably, and profitably.
          </span>
        </motion.p>

        {/* CTA Buttons - High Friction UI Improvements */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            asChild
            className="bg-myGreen text-white hover:bg-myGreen/90 hover:scale-105 transition-all duration-300 border-none px-10 py-7 text-lg rounded-2xl shadow-xl shadow-myGreen/20 w-full sm:w-auto"
          >
            <Link href="/register">Get Started Free</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-black border-white/20 backdrop-blur-md hover:bg-white/10 hover:text-gray-400 px-10 py-7 text-lg rounded-2xl w-full sm:w-auto"
          >
            <Link href="/marketplace">Explore Marketplace →</Link>
          </Button>
        </motion.div>
      </div>

      {/* 3. Footer Stats Section - Use 'relative' or 'sticky' to stay visible */}
      <div className="relative z-20 w-full pb-12 mt-auto">
        <div className="container mx-auto px-6">
          <StatsStrip shouldReduceMotion={shouldReduceMotion} />
        </div>
      </div>

      {/* Scroll indicator - Hidden on very small heights */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 hidden lg:block"
        >
          <ChevronDown size={28} />
        </motion.div>
      )}
    </section>
  );
}

function StatsStrip({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  const stats = [
    { label: "Active Projects", value: 200, suffix: "+" },
    { label: "Carbon Offset", value: 50000, suffix: "+ tCO₂e" },
    { label: "Company Partners", value: 80, suffix: "+" },
    { label: "Project Categories", value: 6, suffix: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
      // Fixed height/min-height prevents the hero section from shifting
      className="max-w-5xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 min-h-[140px]"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="font-[family-name:var(--font-syne)] font-bold text-2xl md:text-4xl text-white tracking-tight mb-2">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-myGreen opacity-90">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000;
    let frameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutExpo for a more professional "weighted" feel
      const easeOutExpo = 1 - 2 ** (-10 * progress);
      const currentCount = Math.floor(easeOutExpo * value);

      setCount(currentCount);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId); // Essential cleanup
  }, [isInView, value]);

  return (
    <span
      ref={ref}
      className="tabular-nums inline-block min-w-[1ch]"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {count.toLocaleString()}
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
}

function HowItWorksSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"owner" | "company">("owner");

  const ownerSteps = [
    {
      icon: <Calculator className="text-myGreen" size={32} />,
      title: "Calculate Your Potential",
      desc: "Use our carbon calculator to estimate your project's sequestration capacity in tCO₂e.",
    },
    {
      icon: <CheckCircle2 className="text-myGreen" size={32} />,
      title: "Register Your Project",
      desc: "Submit your project details — location, land type, practices, and supporting documents.",
    },
    {
      icon: <ShieldCheck className="text-myGreen" size={32} />,
      title: "Get Verified",
      desc: "Our auditors visit your site, confirm your data, and issue a verified carbon credit certificate.",
    },
    {
      icon: <Zap className="text-myGreen" size={32} />,
      title: "Earn Revenue",
      desc: "List your credits on the Crevy Marketplace and get paid when companies purchase them.",
    },
  ];

  const companySteps = [
    {
      icon: <Search className="text-myGreen" size={32} />,
      title: "Explore the Marketplace",
      desc: "Browse verified green projects across Africa filtered by type, region, and impact.",
    },
    {
      icon: <Calculator className="text-myGreen" size={32} />,
      title: "Assess Your Footprint",
      desc: "Use our carbon calculator to understand your company's emission baseline.",
    },
    {
      icon: <CheckCircle2 className="text-myGreen" size={32} />,
      title: "Invest in Projects",
      desc: "Purchase carbon credits directly from verified project owners.",
    },
    {
      icon: <Zap className="text-myGreen" size={32} />,
      title: "Track & Report Compliance",
      desc: "Get real-time analytics and compliance-ready reports for ESG goals.",
    },
  ];

  const steps = activeTab === "owner" ? ownerSteps : companySteps;

  return (
    <section id="how-it-works" className="py-24 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-myBlue mb-4">
            How Crevy Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you're a project owner or a corporate buyer, Crevy gives you
            a clear path to climate impact.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 p-1 rounded-full border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("owner")}
              className={cn(
                "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === "owner"
                  ? "bg-myGreen text-white shadow-lg shadow-myGreen/20"
                  : "text-gray-500 hover:text-myBlue cursor-pointer",
              )}
            >
              I'm a Project Owner
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={cn(
                "px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === "company"
                  ? "bg-myGreen text-white shadow-lg shadow-myGreen/20"
                  : "text-gray-500 hover:text-myBlue cursor-pointer",
              )}
            >
              I'm a Company
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={`${activeTab}-${idx}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="relative mb-6">
                <span className="absolute -top-4 -left-4 font-[family-name:var(--font-syne)] font-bold text-6xl text-myGreen/10 group-hover:text-myGreen/20 transition-colors">
                  {idx + 1}
                </span>
                <div className="relative z-10">{step.icon}</div>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-myBlue mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const projectTypes = [
  {
    title: "Regenerative Agriculture",
    icon: Sprout,
    desc: "Soil-building farming practices that pull CO₂ into the earth.",
    baseColor: "#ecfdf5", // emerald-50
    activeColor: "#059669", // emerald-600
    accent: "text-emerald-600",
  },
  {
    title: "Reforestation",
    icon: Trees,
    desc: "Planting native forests to restore ecosystems and sequester carbon.",
    baseColor: "#f0fdf4", // green-50
    activeColor: "#16a34a", // green-600
    accent: "text-green-600",
  },
  {
    title: "Renewable Energy",
    icon: Sun,
    desc: "Solar, wind, and hydro installations replacing fossil fuels.",
    baseColor: "#fefce8", // yellow-50
    activeColor: "#ca8a04", // yellow-600
    accent: "text-yellow-600",
  },
  {
    title: "Biochar",
    icon: Flame,
    desc: "Converting organic waste into stable carbon-rich soil amendments.",
    baseColor: "#f4f4f5", // zinc-100
    activeColor: "#3f3f46", // zinc-700
    accent: "text-black/80",
  },
  {
    title: "Blue Carbon",
    icon: Waves,
    desc: "Mangrove and wetland restoration that locks carbon in coastal ecosystems.",
    baseColor: "#f0f9ff", // sky-50
    activeColor: "#00bcff", // sky-500
    accent: "text-sky-600",
  },
  {
    title: "Waste Management",
    icon: Recycle,
    desc: "Methane capture and waste diversion from landfills.",
    baseColor: "#f0fdfa", // teal-50
    activeColor: "#0d9488", // teal-600
    accent: "text-teal-600",
  },
];

function ProjectTypesSection({
  shouldReduceMotion = false,
}: {
  shouldReduceMotion?: boolean;
}) {
  return (
    <section className="pt-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <header className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl text-slate-900 mb-6 text-zinc-"
          >
            Green Projects We Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            From regenerative farms to blue-carbon coastlines — every project
            type you can register on Crevy.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectTypes.map((type, idx) => (
            <ProjectCard
              key={type.title}
              type={type}
              index={idx}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ type, index, shouldReduceMotion }: any) {
  const Icon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={shouldReduceMotion ? {} : { y: -8 }}
      className="group relative p-10 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden cursor-pointer isolate"
      style={{ backgroundColor: type.baseColor }}
    >
      {/* ─── SMOOTH HOVER OVERLAY ─── */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out -z-10"
        style={{ backgroundColor: type.activeColor }}
      />

      {/* ─── ICON CONTAINER ─── */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
        <div className="relative p-6 rounded-3xl bg-white shadow-sm group-hover:shadow-xl group-hover:bg-transparent group-hover:text-white transition-all duration-500">
          <Icon
            size={42}
            strokeWidth={1.5}
            className={cn(
              "transition-colors duration-500",
              type.accent,
              "group-hover:text-white",
            )}
          />
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <h3 className="font-[family-name:var(--font-syne)] font-bold text-2xl text-slate-900 group-hover:text-white transition-colors duration-300 mb-4">
        {type.title}
      </h3>

      <p className="text-slate-600 group-hover:text-white/90 transition-colors duration-300 mb-10 text-base leading-relaxed">
        {type.desc}
      </p>

      {/* ─── CTA ─── */}
      <Link
        href="/register"
        className="mt-auto inline-flex items-center font-bold text-xs tracking-[0.15em] uppercase text-slate-900 group-hover:text-white transition-colors duration-300"
      >
        <span>Register This Type</span>
        <div className="ml-3 p-2 rounded-full border border-slate-200 group-hover:border-white/30 transition-colors">
          <ArrowRight
            className="group-hover:translate-x-1 transition-transform duration-300"
            size={14}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function WhyCrevySection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const reasons = [
    {
      title: "Science-Backed Verification",
      desc: "Every credit is verified by certified auditors using internationally recognised standards (VCS, Gold Standard).",
      icon: <ShieldCheck className="text-myGreen" size={24} />,
    },
    {
      title: "Real-Time Impact Tracking",
      desc: "Dashboard analytics let companies monitor their offset portfolio and generate compliance-ready ESG reports instantly.",
      icon: <Zap className="text-myGreen" size={24} />,
    },
    {
      title: "Direct Project Investment",
      desc: "No brokers, no opaque fees. Your investment reaches project owners directly, ensuring maximum climate and community impact.",
      icon: <Users className="text-myGreen" size={24} />,
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-myBlue relative overflow-hidden mt-5"
    >
      {/* Background Glow */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(44,194,149,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              Why leading African companies choose Crevy to reach their net-zero
              goals.
            </h2>
            <p className="text-white/60 text-lg mb-12 leading-relaxed max-w-xl">
              "We've built the infrastructure that makes voluntary carbon
              markets accessible, transparent, and rewarding — for both project
              owners and corporate buyers."
            </p>
            <Link
              href="/#about"
              className="text-myGreen font-bold text-lg inline-flex items-center group"
            >
              Learn More
              <span className="ml-2 w-8 h-[2px] bg-myGreen origin-left group-hover:scale-x-150 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-6"
          >
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="bg-white/5 border-4 rounded-2xl p-8 backdrop-blur-sm  border-myGreen/45"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {reason.icon}
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-xl text-white">
                    {reason.title}
                  </h3>
                </div>
                <p className="text-white/70 leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ScrollingMarquee() {
  return (
    <div className="bg-myGreen py-6 overflow-hidden relative">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-container {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
      `}</style>
      <div className="marquee-container">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-8 px-4">
            <span className="text-myBlue font-[family-name:var(--font-syne)] font-bold text-xl uppercase whitespace-nowrap">
              Carbon Credits ✦ Verified Projects ✦ Green Africa ✦ Climate Impact
              ✦ Net Zero ✦ Regenerative Agriculture ✦ Blue Carbon ✦
              Reforestation ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedProjectsSection({
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
    <section id="projects" className="py-28 bg-[#F9FBF9]">
      <div className="container mx-auto px-6">
        {/* Header: More editorial feel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] w-8 bg-myGreen" />
              <span className="text-myGreen font-bold tracking-[0.2em] text-[10px] uppercase">
                Marketplace
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-syne)] font-bold text-4xl md:text-6xl text-myBlue leading-tight">
              Live Green <br />
              Investments
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-lg leading-relaxed border-l border-gray-200 pl-6">
            Directly funding verified African projects with measurable carbon
            sequestration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {projects.map((project, idx) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "circOut" }}
              className="group relative bg-white border border-gray-200 p-8 rounded-sm hover:border-myGreen/50 transition-colors duration-500"
            >
              {/* Subtle status indicator - Replaces the thick top bar */}
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

              <div className="mb-8">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  {project.type}
                </span>
                <h3 className="font-[family-name:var(--font-syne)] font-bold text-2xl text-myBlue leading-snug">
                  {project.name}
                </h3>
              </div>

              {/* Data Grid: Scientific look */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 mb-8">
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

function TestimonialsSection({
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
    <section className="py-24 bg-white">
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
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
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

function FinalCTASection({
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
          initial={{ x: shouldReduceMotion ? 0 : -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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

const FOOTER_LINKS = {
  platform: [
    { title: "Marketplace", href: "/marketplace" },
    { title: "Carbon Calculator", href: "/carbon-calculator" },
    { title: "How It Works", href: "/#how-it-works" },
    { title: "Register a Project", href: "/new-project" },
    { title: "Login", href: "/login" },
  ],
  company: [
    { title: "About Us", href: "/#about" },
    { title: "Support", href: "/support" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
  ],
  socials: [
    { icon: FaXTwitter, href: "https://twitter.com/crevy", label: "Twitter" },
    {
      icon: FaLinkedin,
      href: "https://linkedin.com/company/crevy",
      label: "LinkedIn",
    },
    { icon: FaFacebook, href: "https://facebook.com/crevy", label: "Facebook" },
  ],
  contact: [
    { icon: MapPin, text: "Accra, Greater Accra, Ghana" },
    { icon: Zap, text: "+(233) 504-609989" },
    { icon: CheckCircle2, text: "info@foovante-global.com" },
  ],
};

function Footer() {
  return (
    <footer className="bg-myBlue pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        {/* Top Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-16 border-b border-white/10 mb-16">
          <h2 className="font-[family-name:var(--font-syne)] font-bold text-3xl md:text-4xl text-white mb-8 md:mb-0">
            Let's Build a Greener Africa Together.
          </h2>
          <Link
            href="/support"
            className="text-myGreen font-bold text-xl inline-flex items-center hover:translate-x-2 transition-transform"
          >
            Get in Touch <ArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Main Footer Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <div className="font-[family-name:var(--font-syne)] font-bold text-3xl text-white mb-1">
                Crevy
              </div>
              <div className="text-white/40 text-xs font-medium uppercase tracking-widest">
                by Foovante Global
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Connecting African green projects with global climate capital.
              Empowering local communities through sustainable impact.
            </p>
            <div className="flex space-x-4">
              {FOOTER_LINKS.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-myGreen hover:text-white transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-8">
              Platform
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-myGreen transition-colors text-sm font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-8">
              Company
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-myGreen transition-colors text-sm font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-8">
              Contact
            </h4>
            <ul className="space-y-6">
              {FOOTER_LINKS.contact.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <item.icon
                    size={18}
                    className="text-myGreen mr-4 mt-1 shrink-0"
                  />
                  <span className="text-white/60 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-xs mb-4 md:mb-0">
            Copyright © Foovante Global {new Date().getFullYear()}. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-white/40 hover:text-white transition-colors text-xs"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white transition-colors text-xs"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
