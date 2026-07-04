"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterInterestSuccessPage() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 border border-emerald-200 mb-8">
          <CheckCircle2
            className="w-7 h-7 text-emerald-700"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="font-sans text-3xl md:text-4xl text-foreground tracking-tight leading-none mb-4">
          You're on the <span className="italic text-muted-foreground">list.</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-10">
          Thank you for registering your interest. A member of our team will
          review your submission and reach out by email or phone to discuss next
          steps.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-secondary hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] px-8 py-4 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
