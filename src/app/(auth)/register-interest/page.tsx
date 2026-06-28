import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "../_components/BackButton";
import RegisterInterestForm from "../_components/RegisterInterestForm";

export const metadata: Metadata = {
  title: "Register Interest — Crevy",
  description:
    "Join the Crevy waitlist as a project owner, investor, or carbon credit buyer.",
};

export default function RegisterInterestPage() {
  return (
    <main className="min-h-screen w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
          <Link
            href="/"
            className="font-serif font-bold text-3xl text-slate-900 tracking-tight hover:text-emerald-700 transition-colors"
          >
            Crevy.
          </Link>
          <BackButton href="/register" label="Back to Register" />
        </div>
      </div>

      <RegisterInterestForm />
    </main>
  );
}
