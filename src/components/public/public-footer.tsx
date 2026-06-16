"use client";

import { ArrowRight, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

// ─── INSTITUTIONAL DIRECTORY ──────────────────────────────────────────────────

const FOOTER_LINKS = {
  platform: [
    { title: "Marketplace Trading", href: "/marketplace" },
    { title: "Public Asset Registry", href: "/public-registry" },
    { title: "dMRV Methodology", href: "/methodology" },
    { title: "Yield Calculator", href: "/carbon-calculator" },
    { title: "Entity Registration", href: "/register" },
  ],
  governance: [
    { title: "Corporate Overview", href: "/about-us" },
    { title: "Institutional Support", href: "/support" },
    { title: "Terms of Service", href: "/terms-of-service" },
    { title: "Privacy Protocol", href: "/privacy-policy" },
    { title: "Data Processing Agreement", href: "/data-processing-agreement" },
  ],
  network: [
    { label: "X (Twitter) /", href: "https://twitter.com/crevy" },
    { label: "LinkedIn /", href: "https://linkedin.com/company/crevy" },
    { label: "Facebook /", href: "https://facebook.com/crevy" },
  ],
};

export function PublicFooter() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const user = session?.user as any;

  const handleRegisterProjectClick = (e: React.MouseEvent) => {
    if (!session) return;

    const allowedRoles = ["project_owner", "super_admin", "admin"];
    const userRole = user?.role || "";

    if (!allowedRoles.includes(userRole)) {
      e.preventDefault();
      toast.error("Protocol Access Denied", {
        description:
          "Your current clearance level does not permit asset registration. Please contact the governance team.",
      });
      return;
    }

    e.preventDefault();
    router.push("/new-project");
  };

  return (
    <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-800 selection:bg-emerald-900 selection:text-white relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute -right-24 -bottom-24 text-slate-900/50 pointer-events-none">
        <Globe size={400} strokeWidth={0.5} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        {/* ── Editorial Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-slate-800 mb-16 gap-8">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-[1.1] mb-6">
              Engineering the{" "}
              <span className="italic text-slate-500">financial layer</span> of
              Africa's climate future.
            </h2>
          </div>
          <Link
            href="/support"
            className="group flex items-center gap-4 bg-white hover:bg-emerald-600 text-slate-900 hover:text-white px-8 py-4 font-bold text-[10px] uppercase tracking-widest transition-colors shrink-0"
          >
            Initiate Contact{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* ── Directory Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <div className="font-serif text-4xl text-white mb-2 tracking-tight">
                Crevy.
              </div>
              <div className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">
                Operated by Foovante Global
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
              Bridging African ecological assets with global institutional
              capital through cryptographic verification and transparent
              liquidity pipelines.
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                <MapPin size={14} className="text-emerald-600" /> Accra, Greater
                Accra, GH
              </div>
              {/* <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                <span className="w-3.5 h-3.5 border border-emerald-600 rounded-none flex items-center justify-center text-[8px] text-emerald-600">
                  @
                </span>
                info@foovante-global.com
              </div> */}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Platform Links */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-3">
              Platform Architecture
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    onClick={
                      link.title === "Entity Registration"
                        ? handleRegisterProjectClick
                        : undefined
                    }
                    className="text-slate-500 hover:text-emerald-500 transition-colors text-sm font-mono tracking-tight flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-800 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance Links */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 border-b border-slate-800 pb-3">
              Corporate Governance
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.governance.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-slate-500 hover:text-emerald-500 transition-colors text-sm font-mono tracking-tight flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-800 group-hover:bg-emerald-500 transition-colors"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Footer Bottom ── */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            <span className="text-slate-300">© {new Date().getFullYear()}</span>
            <span>Operated by Foovante Technologies</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mr-2">
              Network:
            </span>
            {FOOTER_LINKS.network.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-500 transition-colors text-[10px] font-mono font-bold tracking-widest uppercase"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
