"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

/**
 * Navbar component for the public landing page.
 * Includes sticky behavior, mobile menu drawer, and responsive layout.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export function Navbar({ solid = false }: { solid?: boolean }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pages that sit on white background and need a solid/dark navbar by default
  const forceSolid =
    solid ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/public-registry") ||
    pathname.startsWith("/about-us") ||
    pathname.startsWith("/methodology") ||
    pathname.startsWith("/support");

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Public Registry", href: "/public-registry" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Methodology", href: "/methodology" },
    { name: "About", href: "/about-us" },
    { name: "Support", href: "/support" },
  ];

  const isNavSolid = isScrolled || forceSolid;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isNavSolid
          ? "bg-myBlue/95 backdrop-blur-md border-b border-myGreen/20 py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-[family-name:var(--font-syne)] font-bold text-2xl transition-colors",
            "text-white hover:text-myGreen",
          )}
        >
          Crevy
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                "text-white/80 hover:text-myGreen",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA / Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {!isPending && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    <Avatar className="h-7 w-7 border border-myGreen/30">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-myGreen text-white text-[10px] font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider leading-none">
                      {user.name.split(" ")[0]}
                    </span>
                  </div>
                  <Button
                    asChild
                    className="bg-myGreen text-white hover:bg-myDarkGreen border-none font-bold uppercase tracking-widest text-[10px] px-6"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </>
          )}
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
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 top-0 right-0 h-screen w-full bg-myBlue z-50 flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-[family-name:var(--font-syne)] font-bold text-2xl text-myGreen">
                Crevy
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
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
              {!isPending && (
                <>
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <Avatar className="h-10 w-10 border border-myGreen/30">
                          <AvatarImage
                            src={user.image || undefined}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-myGreen text-white font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-bold leading-none">
                            {user.name}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-myGreen text-white hover:bg-myDarkGreen border-none font-bold uppercase tracking-widest text-xs"
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Back to Dashboard
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        asChild
                        size="lg"
                        className="w-full text-white border border-white/30 hover:bg-white/10"
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
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
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
