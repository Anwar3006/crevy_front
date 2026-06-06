"use client";

import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl" />
        <AlertCircle
          className="w-24 h-24 text-emerald-600 relative z-10"
          strokeWidth={1.5}
        />
      </div>

      <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8 font-medium">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-black uppercase tracking-widest text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
