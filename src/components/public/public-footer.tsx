"use client";

import { ArrowRight, CheckCircle2, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

const FOOTER_LINKS = {
  platform: [
    { title: "Marketplace", href: "/marketplace" },
    { title: "Public Registry", href: "/public-registry" },
    { title: "Methodology", href: "/methodology" },
    { title: "Carbon Calculator", href: "/carbon-calculator" },
    { title: "Register a Project", href: "/register" },
  ],
  company: [
    { title: "About Us", href: "/about-us" },
    { title: "Support", href: "/support" },
    { title: "Terms of Service", href: "/terms-of-service" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Data Processing Agreement", href: "/data-processing-agreement" },
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

export function PublicFooter() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const user = session?.user as any;

  const handleRegisterProjectClick = (e: React.MouseEvent) => {
    // 1. Check for session
    if (!session) {
      // Not logged in, proceed to standard registration
      return;
    }

    // 2. Check role (Privilege Escalation Prevention)
    const allowedRoles = ["project_owner", "super_admin", "admin"];
    const userRole = user?.role || "";

    if (!allowedRoles.includes(userRole)) {
      e.preventDefault();
      toast.error("Unauthorized Access", {
        description:
          "Your current account role does not have permission to register new projects. Please contact support if you believe this is an error.",
      });
      return;
    }

    // If authorized and logged in, redirect to new project creation
    e.preventDefault();
    router.push("/new-project");
  };

  return (
    <footer className="bg-myBlue pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
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
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-myGreen hover:text-white transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-8">
              Platform
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    onClick={
                      link.title === "Register a Project"
                        ? handleRegisterProjectClick
                        : undefined
                    }
                    className="text-white/60 hover:text-myGreen transition-colors text-sm font-medium"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-xs mb-4 md:mb-0">
            Copyright © Foovante Global {new Date().getFullYear()}. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/terms-of-service"
              className="text-white/40 hover:text-white transition-colors text-xs"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
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
