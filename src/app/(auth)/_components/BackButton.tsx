"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * Shared back-navigation link used across the (auth) route group's
 * top headers (login, register, register-interest). Kept as a small
 * standalone component since each page's header has slightly different
 * surrounding markup/spacing — this just standardizes the back link itself.
 */
export default function BackButton({
  href,
  label = "Back",
  className,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors",
        className,
      )}
    >
      <ArrowLeft className="w-3 h-3" />
      {label}
    </Link>
  );
}
