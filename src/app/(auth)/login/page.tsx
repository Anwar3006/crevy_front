import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../_components/BackButton";
import LoginForm from "../_components/LoginForm";

const STATS = [
  { value: "200+", label: "Verified Assets" },
  { value: "50K+", label: "tCO₂e Sequestered" },
  { value: "80+", label: "Institutional Partners" },
];

const LoginPage = () => {
  return (
    <div className="w-full flex font-sans bg-white selection:bg-brand selection:text-white lg:h-screen lg:overflow-hidden">
      {/* ── Left: Authentication Terminal ────────────────────────────────────── */}
      <div className="relative flex flex-col w-full lg:w-[45%] xl:w-[40%] bg-white px-8 md:px-16 py-12 lg:h-full overflow-y-auto border-r border-border z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-16 shrink-0 border-b border-slate-900 pb-6">
          <Link
            href="/"
            className="font-sans font-bold text-3xl tracking-tight text-foreground hover:text-brand transition-colors"
          >
            Crevy.
          </Link>
          <Link
            href="/register"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            No clearance?{" "}
            <span className="text-brand border-b border-brand pb-0.5 ml-1">
              Sign Up
            </span>
          </Link>
        </div>

        <BackButton
          href="/register"
          label="Back to Register"
          className="mb-8 -mt-4"
        />

        {/* Form Container */}
        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          {/* Institutional Eyebrow */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-brand rounded-none animate-pulse shrink-0" />
              <span className="text-foreground text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
                Authentication Protocol
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-sans text-foreground tracking-tight leading-none mb-4">
              Access{" "}
              <span className="italic text-muted-foreground">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">
              Provide credentials to access the registry, manage carbon assets,
              and audit institutional yield.
            </p>
          </div>

          <LoginForm />

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-border text-left">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-relaxed">
              By authenticating, you bind yourself to the{" "}
              <Link
                href="/terms-of-service"
                className="text-foreground hover:text-brand transition-colors border-b border-slate-300 hover:border-brand"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-foreground hover:text-brand transition-colors border-b border-slate-300 hover:border-brand"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-auto shrink-0 pt-8">
          <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} Foovante Global · Accra, GH
          </p>
        </div>
      </div>

      {/* ── Right: Institutional Imagery ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative bg-foreground p-6 lg:p-10">
        {/* Strict Image Frame */}
        <div className="relative w-full h-full border border-slate-800 overflow-hidden group">
          <Image
            src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
            alt="Ecological Asset Landscape"
            fill
            priority
            className="object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[10s] ease-out"
            sizes="60vw"
          />

          {/* Institutional Grid Overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Content Ledger */}
          <div className="absolute z-10 bottom-0 left-0 w-full p-12 xl:p-16 flex flex-col justify-end h-full">
            <div className="mb-auto mt-8">
              <Globe
                size={48}
                className="text-brand animate-pulse"
                strokeWidth={2}
              />
            </div>

            <div className="max-w-2xl border-l-2 border-brand pl-8 mb-16">
              <h2 className="text-4xl xl:text-6xl font-sans text-white leading-[1.05] tracking-tight mb-6">
                Turn ecological assets into verified{" "}
                <span className="italic text-brand">institutional yield.</span>
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed max-w-xl">
                Join originators already earning from cryptographically
                certified carbon credits — transparent, immutable, and strictly
                audited.
              </p>
            </div>

            {/* Telemetry Strip */}
            <div className="grid grid-cols-3 gap-px bg-slate-800 border border-slate-800">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-foreground/70 p-6 flex flex-col justify-center hover:bg-brand/50 transition-colors"
                >
                  <p className="text-white font-mono font-bold text-3xl xl:text-4xl leading-none mb-2 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-white text-[9px] font-bold uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
