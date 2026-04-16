import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

const FEATURES = [
  {
    icon: "🌱",
    title: "Carbon Calculator",
    desc: "Estimate your project's tCO₂e potential instantly.",
  },
  {
    icon: "✅",
    title: "Verified Certification",
    desc: "Get verified under VCS, Gold Standard or Plan Vivo.",
  },
  {
    icon: "💰",
    title: "Direct Revenue",
    desc: "List credits and get paid within 30 days of a sale.",
  },
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    desc: "Track impact, income, and ESG compliance in one place.",
  },
];

const RegisterPage = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* ── Left: Immersive Image Panel ────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[44%] relative overflow-hidden order-first h-full">
        {/* Full-bleed background image — aerial solar + green field */}
        <Image
          src="https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg"
          alt="Sustainable green energy landscape"
          fill
          priority
          className="object-cover scale-105"
          sizes="44vw"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3d2e]/90 via-[#131927]/55 to-[#131927]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d2e]/50 to-transparent" />

        {/* Glow */}
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full bg-[#2CC295]/15 blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Image
              src="/icons/Crevy.png"
              alt="Crevy"
              width={100}
              height={28}
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>

          {/* Main copy */}
          <div className="space-y-8 max-w-sm">
            <div>
              <div className="w-10 h-1 bg-[#2CC295] rounded-full mb-5" />
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-[1.15] tracking-tight">
                Join Africa&apos;s fastest-growing{" "}
                <span className="text-[#2CC295] italic">
                  green marketplace.
                </span>
              </h2>
              <p className="mt-4 text-white/60 text-base leading-relaxed">
                Register your project in minutes. Our team handles verification,
                certification, and buyer matching — so you can focus on impact.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3.5"
                >
                  <span className="text-lg shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-white/30 text-xs font-medium">
            © {new Date().getFullYear()} Foovante Global Ltd · Accra, Ghana
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────────────────────────── */}
      <div className="relative flex flex-col w-full lg:w-[52%] xl:w-[56%] bg-white px-8 md:px-14 py-10 h-full overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex items-center justify-between mb-10 shrink-0 lg:justify-end">
          <Link href="/" className="lg:hidden">
            <Image
              src="/icons/Crevy.png"
              alt="Crevy"
              width={88}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-500 hover:text-[#2CC295] transition-colors"
          >
            Already have an account?{" "}
            <span className="text-[#2CC295] underline underline-offset-2">
              Log in
            </span>
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          {/* Eyebrow */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-[#2CC295]/10 text-[#2CC295] text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2CC295] animate-pulse" />
              Free to Join
            </span>
            <h1 className="text-3xl font-extrabold text-[#131927] tracking-tight leading-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Start earning from your green project. Registration takes less
              than 3 minutes.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-[#2CC295] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2CC295] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
