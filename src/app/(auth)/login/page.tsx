import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "../_components/LoginForm";

const STATS = [
  { value: "200+", label: "Verified Assets" },
  { value: "50K+", label: "tCO₂e Sequestered" },
  { value: "80+", label: "Institutional Partners" },
];

const LoginPage = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden font-sans bg-white selection:bg-emerald-900 selection:text-white">
      {/* ── Left: Authentication Terminal ────────────────────────────────────── */}
      <div className="relative flex flex-col w-full lg:w-[45%] xl:w-[40%] bg-white px-8 md:px-16 py-12 h-full overflow-y-auto border-r border-slate-200 z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-16 shrink-0 border-b border-slate-900 pb-6">
          <Link
            href="/"
            className="font-serif font-bold text-3xl tracking-tight text-slate-900 hover:text-emerald-700 transition-colors"
          >
            Crevy.
          </Link>
          <Link
            href="/register"
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
          >
            No clearance?{" "}
            <span className="text-emerald-700 border-b border-emerald-700 pb-0.5 ml-1">
              Initialize
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          {/* Institutional Eyebrow */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-none animate-pulse shrink-0" />
              <span className="text-slate-900 text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
                Authentication Protocol
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-4">
              Terminal <span className="italic text-slate-500">Access.</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-light leading-relaxed">
              Provide cryptographic credentials to access the registry, manage
              carbon assets, and audit institutional yield.
            </p>
          </div>

          <LoginForm />

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-slate-100 text-left">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
              By authenticating, you bind yourself to the{" "}
              <Link
                href="/terms"
                className="text-slate-900 hover:text-emerald-700 transition-colors border-b border-slate-300 hover:border-emerald-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-slate-900 hover:text-emerald-700 transition-colors border-b border-slate-300 hover:border-emerald-700"
              >
                Privacy Protocol
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-auto shrink-0 pt-8">
          <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
            © {new Date().getFullYear()} Foovante Global · Accra, GH
          </p>
        </div>
      </div>

      {/* ── Right: Institutional Imagery ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative bg-slate-950 p-6 lg:p-10">
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
              <Globe size={48} className="text-slate-800" strokeWidth={1} />
            </div>

            <div className="max-w-2xl border-l-2 border-emerald-700 pl-8 mb-16">
              <h2 className="text-4xl xl:text-6xl font-serif text-white leading-[1.05] tracking-tight mb-6">
                Turn ecological assets into verified{" "}
                <span className="italic text-slate-500">
                  institutional yield.
                </span>
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">
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
                  className="bg-slate-950 p-6 flex flex-col justify-center hover:bg-slate-900 transition-colors"
                >
                  <p className="text-white font-mono font-bold text-3xl xl:text-4xl leading-none mb-2 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">
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
