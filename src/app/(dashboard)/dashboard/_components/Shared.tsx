"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── FORMAT HELPERS ───
export function formatNumber(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "0";
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatCurrency(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function timeAgo(date: string | Date | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── DASHBOARD STATE (loading / error) ───
export function DashboardState({
  isLoading,
  isError,
  error,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Loading dashboard data…
        </p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="max-w-[1400px] mx-auto py-24 px-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 mb-6" />
        <p className="text-sm font-bold text-foreground mb-2">
          Couldn't load dashboard data
        </p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-6 max-w-md">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-foreground text-white hover:bg-brand transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  return null;
}

// ─── SECTION LABEL ───
export function SectionLabel({
  label,
  delay = 0,
  action,
}: {
  label: string;
  delay?: number;
  action?: { label: string; href: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex justify-between items-end border-b-2 border-slate-900 pb-3 mb-8"
    >
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-600 rounded-none shrink-0" />
        {label}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-foreground transition-colors flex items-center gap-1"
        >
          {action.label} <ArrowRight size={12} />
        </Link>
      )}
    </motion.div>
  );
}

// ─── ALERT STRIP ───
export function AlertStrip({
  count,
  message,
  type = "warning",
  delay = 0,
}: {
  count: number;
  message: string;
  type?: "warning" | "info" | "error";
  delay?: number;
}) {
  const config = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: AlertCircle,
    },
    error: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-800",
      icon: Info,
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: CheckCircle2,
    },
  };
  const theme = config[type];
  const Icon = theme.icon;

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "p-4 border-l-4 font-mono text-xs flex items-center gap-4 mb-8",
        theme.bg,
        theme.border,
        theme.text,
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span>
        <strong className="font-black">[{count}] SYSTEM NOTICES:</strong>{" "}
        {message}
      </span>
    </motion.div>
  );
}

// ─── STAT CARD ───
export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  delay = 0,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white p-8 flex flex-col justify-between group hover:bg-muted transition-colors border border-border"
    >
      <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        {Icon && <Icon size={16} className="text-foreground" />}
      </div>
      <div>
        <h4 className="text-3xl md:text-4xl font-mono font-bold text-foreground tracking-tight mb-1">
          {value}
          <span className="text-base text-muted-foreground ml-1 font-sans font-normal">
            {unit}
          </span>
        </h4>
        {trend && (
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── MRV PIPELINE STEPPER ───
export function MrvPipelineStepper({
  stages,
}: {
  stages: Array<{ key: string; label: string; count: number; href: string }>;
}) {
  return (
    <div className="flex items-center justify-between w-full h-full pb-4 overflow-x-auto scrollbar-hide">
      {stages.map((stage, idx) => (
        <div key={stage.key} className="flex items-center">
          <Link
            href={stage.href}
            className="flex flex-col items-center group min-w-[72px]"
          >
            <div className="w-12 h-12 border border-slate-900 flex items-center justify-center font-mono font-bold text-foreground bg-muted group-hover:bg-secondary group-hover:text-white transition-colors mb-4 relative">
              {stage.count}
              {stage.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-none border border-white" />
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground text-center">
              {stage.label}
            </span>
          </Link>
          {idx < stages.length - 1 && (
            <div className="w-6 md:w-12 h-[1px] bg-slate-200 mx-2 md:mx-4 -mt-8 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
