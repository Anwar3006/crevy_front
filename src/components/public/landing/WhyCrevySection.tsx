"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Zap } from "lucide-react";
import Link from "next/link";

/**
 * WhyCrevySection highlighting the benefits of the platform.
 *
 * @param {object} props - Component props.
 * @param {boolean} [props.shouldReduceMotion] - Whether to reduce animations.
 * @returns {JSX.Element} The rendered WhyCrevySection component.
 */
export function WhyCrevySection({
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
      className="py-14 md:py-20 bg-myBlue relative overflow-hidden mt-5"
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
        <div className="grid lg:grid-cols-2 gap-8 md:gap-14 items-center">
          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
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
            initial={{ x: shouldReduceMotion ? 0 : 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="flex flex-col space-y-6"
          >
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-myGreen/30 rounded-2xl p-8 backdrop-blur-sm hover:border-myGreen/60 transition-colors"
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

/**
 * ScrollingMarquee component for the landing page.
 * Reduced text size on mobile for better UI.
 *
 * @returns {JSX.Element} The rendered ScrollingMarquee component.
 */
export function ScrollingMarquee() {
  return (
    <div className="bg-myGreen py-4 md:py-6 overflow-hidden relative">
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
          <div
            key={i}
            className="flex items-center space-x-4 md:space-x-8 px-4"
          >
            <span className="text-myBlue font-syne font-bold text-[0.6rem] md:text-xl uppercase whitespace-nowrap">
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
