"use client";

import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Animated counter component for statistics.
 *
 * @param {object} props - Component props.
 * @param {number} props.value - The target value to count to.
 * @param {string} [props.suffix] - Optional suffix (e.g., "+").
 * @returns {JSX.Element} The rendered Counter component.
 */
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

      // Easing: easeOutExpo
      const easeOutExpo = 1 - 2 ** (-10 * progress);
      const currentCount = Math.floor(easeOutExpo * value);

      setCount(currentCount);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
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

/**
 * Statistics strip component.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered StatsStrip component.
 */
function StatsStrip({ shouldReduceMotion }: { shouldReduceMotion?: boolean }) {
  const stats = [
    { label: "Active Projects", value: 200, suffix: "+" },
    { label: "Carbon Offset", value: 50000, suffix: "+ tCO₂e" },
    { label: "Company Partners", value: 80, suffix: "+" },
    { label: "Project Categories", value: 6, suffix: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
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

/**
 * Hero section component for the landing page.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered HeroSection component.
 */
export function HeroSection({
  shouldReduceMotion,
}: {
  shouldReduceMotion?: boolean;
}) {
  const fadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-slate-950">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-105"
          poster="/img/img/background.jpg"
        >
          <source
            src="https://videos.pexels.com/video-files/4629597/4629597-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-myBlue/90" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col items-center justify-center pt-20 pb-20">
        {/* Badge */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-6 md:mb-10"
        >
          <span className="animate-pulse">🌿</span>
          <span className="text-white/90 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Africa's Verified Green Marketplace
          </span>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-8">
          <motion.h1
            className="font-[family-name:var(--font-syne)] font-extrabold text-4xl md:text-6xl lg:text-8xl text-white leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Turn Green Projects <br className="hidden md:block" />
            <span className="text-myGreen italic">Into Climate Impact</span>
          </motion.h1>
        </div>

        {/* Sub-heading */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-xl mx-auto text-base md:text-lg text-white mb-10 text-center leading-relaxed font-medium"
        >
          Connect with sustainable farmers and energy operators to offset your
          carbon footprint —
          <span className="text-white">
            {" "}
            transparently, verifiably, and profitably.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.7, delay: 0.4 }}
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

      {/* Footer Stats Section */}
      <div className="relative z-20 w-full pb-12 mt-auto">
        <div className="container mx-auto px-6">
          <StatsStrip shouldReduceMotion={shouldReduceMotion} />
        </div>
      </div>

      {/* Scroll indicator */}
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
