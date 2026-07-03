"use client";

import {
  ArrowRightIcon,
  CheckCircle,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../_components/BackButton";
import RegisterForm from "../_components/RegisterForm";

const VALUE_PROPS = [
  { value: "100%", label: "dMRV Verified", icon: ShieldCheck },
  { value: "Polygon", label: "Immutable Ledger", icon: LinkIcon },
  { value: "Direct", label: "Originator Liquidity", icon: CheckCircle },
];

const RegisterPage = () => {
  return (
    <div className="w-full flex bg-white font-sans selection:bg-secondary selection:text-white lg:h-screen lg:overflow-hidden">
      {/* ── Left: Editorial Media Panel ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[58%] relative overflow-hidden bg-background">
        <Image
          src="https://images.pexels.com/photos/418831/pexels-photo-418831.jpeg"
          alt="Aerial view of lush green forest"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity"
          sizes="58vw"
        />

        {/* Strict Editorial Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-20 h-full border-r border-slate-800">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-[1px] bg-emerald-500"></div>
            <span className="text-emerald-500 text-[10px] font-bold tracking-[0.2em] uppercase">
              Global Carbon Infrastructure
            </span>
          </div>

          <div className="space-y-8 max-w-2xl mt-auto mb-16">
            <h2 className="text-5xl xl:text-7xl font-sans text-white leading-[1.05] tracking-tight">
              Turn net-zero obligations into{" "}
              <span className="text-emerald-500 italic">
                mathematical proof.
              </span>
            </h2>
            <p className="text-muted-foreground font-light text-lg xl:text-xl leading-relaxed max-w-xl">
              Access the only carbon liquidity pool that fuses digital
              Measurement, Reporting, and Verification (dMRV) with permanent
              cryptographic anchoring.
            </p>
          </div>

          {/* Terminal Stats Strip */}
          <div className="grid grid-cols-3 gap-px bg-slate-800 border border-slate-800">
            {VALUE_PROPS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-background p-6 flex flex-col justify-between h-32 group"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-white font-mono font-bold text-2xl leading-none">
                      {stat.value}
                    </p>
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────────────────────────── */}
      <div className="relative flex flex-col w-full lg:w-[46%] xl:w-[42%] bg-white px-8 md:px-16 py-12 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-16 shrink-0 border-b border-border pb-6">
          <Link
            href="/"
            className="font-sans font-bold text-3xl text-foreground tracking-tight"
          >
            Crevy.
          </Link>
          <Link
            href="/login"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            Authenticate Existing <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <BackButton href="/" label="Back to Home" className="mb-8 -mt-8" />

        <div className="flex flex-1 flex-col max-w-md w-full">
          <div className="mb-10">
            <h1 className="text-4xl font-sans text-foreground tracking-tight leading-none mb-3">
              Register Entity.
            </h1>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Register your organization to access the verified carbon registry
              and act on it&apos;s behalf.
            </p>
          </div>

          <RegisterForm />

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-relaxed">
              By initializing, you accept the{" "}
              <Link
                href="/terms"
                className="text-foreground hover:text-emerald-700 underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-foreground hover:text-emerald-700 underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
