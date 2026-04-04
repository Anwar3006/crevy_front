import Image from "next/image";
import Link from "next/link";
import LoginForm from "../_components/LoginForm";

const STATS = [
  { value: "200+", label: "Verified Projects" },
  { value: "50K+", label: "tCO₂e Offset" },
  { value: "80+", label: "Partners" },
];

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* ── Left: Form Panel ───────────────────────────────────────────────── */}
      <div className="relative flex flex-col w-full lg:w-[46%] xl:w-[42%] bg-white px-8 md:px-14 py-10 overflow-y-auto">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-12 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/icons/Crevy.png"
              alt="Crevy"
              width={96}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-gray-500 hover:text-[#2CC295] transition-colors"
          >
            No account?{" "}
            <span className="text-[#2CC295] underline underline-offset-2">
              Sign up
            </span>
          </Link>
        </div>

        {/* Form section */}
        <div className="flex flex-1 flex-col justify-center max-w-sm mx-auto w-full">
          {/* Eyebrow */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-[#2CC295]/10 text-[#2CC295] text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2CC295] animate-pulse" />
              Africa&apos;s Green Marketplace
            </span>
            <h1 className="text-3xl font-extrabold text-[#131927] tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Sign in to manage your carbon projects and track your climate
              impact.
            </p>
          </div>

          <LoginForm />

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            By signing in you agree to our{" "}
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

        {/* Bottom brand mark */}
        <div className="mt-10 shrink-0 text-center">
          <p className="text-xs text-gray-300 font-medium">
            © {new Date().getFullYear()} Foovante Global Ltd · Accra, Ghana
          </p>
        </div>
      </div>

      {/* ── Right: Immersive Image Panel ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[58%] relative overflow-hidden">
        {/* Full-bleed background image */}
        <Image
          src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
          alt="Lush African green landscape"
          fill
          priority
          className="object-cover scale-105"
          sizes="58vw"
        />

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#131927]/85 via-[#131927]/40 to-[#0a3d2e]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131927]/60 via-transparent to-transparent" />

        {/* Decorative green glow */}
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#2CC295]/10 blur-[100px] pointer-events-none" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 w-fit">
            <span className="text-[#2CC295] text-xs">🌿</span>
            <span className="text-white/80 text-xs font-bold tracking-[0.15em] uppercase">
              Verified Carbon Markets
            </span>
          </div>

          {/* Centre quote */}
          <div className="space-y-6 max-w-md">
            <div className="w-10 h-1 bg-[#2CC295] rounded-full" />
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-[1.15] tracking-tight">
              Turn your green project into{" "}
              <span className="text-[#2CC295] italic">verified revenue.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Join 200+ African project owners already earning from certified
              carbon credits — transparently, traceably, and profitably.
            </p>

            {/* Testimonial */}
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mt-4">
              <p className="text-white/80 text-sm leading-relaxed italic mb-3">
                &ldquo;Crevy made it possible to turn 15 years of regenerative
                farming into a verified income stream.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2CC295]/30 flex items-center justify-center text-[#2CC295] font-bold text-sm">
                  D
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Daniel Asante</p>
                  <p className="text-white/50 text-xs">
                    Regenerative Farmer · Brong-Ahafo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats strip */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-4 text-center"
              >
                <p className="text-[#2CC295] font-extrabold text-2xl leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
