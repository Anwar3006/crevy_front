"use client";

import { motion } from "framer-motion";
import { BarChart2, DollarSign, Globe, Target } from "lucide-react";
import Link from "next/link";
import { useOrganizationDashboard } from "@/hooks/use-dashboard";
import { DashboardState, formatNumber, SectionLabel, StatCard } from "./Shared";

// ─── REUSABLE GAUGE (Institutional) ───
function NetZeroGauge({
  pct,
  goal,
  current,
  unit,
}: {
  pct: number;
  goal: number;
  current: number;
  unit: string;
}) {
  const color = pct < 50 ? "#f59e0b" : pct < 80 ? "#2cc295" : "#178a74";
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-border h-full">
      <div className="relative w-48 h-24 overflow-hidden mb-8 mt-4">
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[1px] border-border border-dashed" />
        <div className="absolute top-2 left-2 w-44 h-44 rounded-full border-[8px] border-border" />
        <div
          className="absolute top-2 left-2 w-44 h-44 rounded-full border-[8px] border-transparent transition-all duration-1000 ease-out"
          style={{
            borderColor: color,
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            transform: `rotate(${pct * 1.8 - 90}deg)`,
          }}
        />
        <div className="absolute bottom-0 left-0 w-full text-center pb-0">
          <span className="font-mono text-4xl font-bold text-foreground tracking-tight">
            {pct}%
          </span>
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">
        <span className="text-foreground">{current.toLocaleString()}</span> of{" "}
        {goal.toLocaleString()} {unit} neutralized
      </p>
    </div>
  );
}

export default function OrgAdminDashboard({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const { data, isLoading, isError, error, refetch } =
    useOrganizationDashboard();

  const isAuditor = role === "org_auditor";

  if (isLoading || isError) {
    return (
      <DashboardState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }
  if (!data) return null;

  // No organization membership yet — mid-onboarding shell
  if (!data.organization) {
    return (
      <div className="max-w-[1400px] mx-auto py-24 px-6 flex flex-col items-center justify-center text-center min-h-screen bg-muted">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          No Organization Linked
        </p>
        <h1 className="text-3xl font-sans text-foreground mb-4">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground font-light max-w-md mb-8">
          You aren't yet a member of an organization. Complete onboarding to
          unlock your ESG portfolio.
        </p>
        <Link
          href="/onboarding"
          className="bg-secondary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors"
        >
          Complete Onboarding
        </Link>
      </div>
    );
  }

  const { organization, creditHoldings, netZero, scope3Liability, portfolio } =
    data;
  const holdings = creditHoldings?.[0] ?? {
    totalPurchased: 0,
    totalRetired: 0,
  };

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10 font-sans selection:bg-secondary selection:text-white bg-muted min-h-screen">
      {/* ── 1. Corporate Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-border p-10 md:p-14 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
      >
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {isAuditor
              ? "Compliance Auditor · Read Only"
              : `${organization.name ?? "Institutional"} · ESG Centre`}
          </p>
          <h1 className="text-4xl md:text-5xl font-sans text-foreground tracking-tight leading-none mb-4">
            Corporate Carbon{" "}
            <span className="italic text-muted-foreground">Portfolio.</span>
          </h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            Manage your organization's carbon exposure, track progress toward
            net-zero obligations, and generate compliant ESG reporting
            artifacts.
          </p>
        </div>
        {!isAuditor && (
          <Link
            href="/marketplace"
            className="shrink-0 bg-secondary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors"
          >
            Acquire Verified Yield
          </Link>
        )}
      </motion.div>

      {/* ── 2. ESG Portfolio KPIs ── */}
      <div className="mb-16">
        <SectionLabel label="Exposure & Compliance Metrics" delay={0.1} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-border">
          <StatCard
            label="Total CO₂e Retired"
            value={formatNumber(holdings.totalRetired)}
            unit="t"
            icon={Globe}
            trend={`${organization.memberCount} team members`}
            delay={0.15}
          />
          <StatCard
            label="Total CO₂e Purchased"
            value={formatNumber(holdings.totalPurchased)}
            unit="t"
            icon={DollarSign}
            trend="Lifetime acquisitions"
            delay={0.2}
          />
          <StatCard
            label="Portfolio Projects"
            value={formatNumber(portfolio?.length ?? 0)}
            unit="Projects"
            icon={BarChart2}
            trend="Active in portfolio"
            delay={0.25}
          />
          <StatCard
            label="Net-Zero Trajectory"
            value={netZero.percentage}
            unit="%"
            icon={Target}
            trend={`Goal: ${formatNumber(netZero.goal)} ${netZero.unit}`}
            delay={0.3}
          />
        </div>
      </div>

      {/* ── 3. Impact Analytics ── */}
      <div className="mb-16">
        <SectionLabel label="Impact & Trajectory Analytics" delay={0.35} />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white border border-border p-8 h-[300px]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 border-b border-border pb-2">
              Asset Distribution
            </h3>
            <div className="h-full overflow-y-auto">
              {(!portfolio || portfolio.length === 0) && (
                <div className="h-full flex items-center justify-center font-mono text-xs text-muted-foreground border border-dashed border-border bg-muted">
                  No portfolio assets yet
                </div>
              )}
              <ul className="space-y-3">
                {portfolio?.slice(0, 6).map((p: any) => (
                  <li
                    key={p.id}
                    className="flex justify-between items-center text-xs font-mono border-b border-border pb-2"
                  >
                    <span className="text-foreground font-bold truncate max-w-[140px]">
                      {p.name}
                    </span>
                    <span className="text-muted-foreground uppercase">
                      {p.sector}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white border border-border p-8 h-[300px]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 border-b border-border pb-2">
              Monthly Acquisition Velocity
            </h3>
            <div className="h-full flex items-center justify-center font-mono text-xs text-muted-foreground border border-dashed border-border bg-muted">
              [AreaChart Component]
            </div>
          </div>
        </div>

        {/* Gauge & Actions Row */}
        <div className="grid md:grid-cols-3 gap-8">
          <NetZeroGauge
            pct={netZero.percentage}
            current={netZero.current}
            goal={netZero.goal}
            unit={netZero.unit}
          />

          <div className="bg-white border border-border p-8 flex flex-col justify-center text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Scope 3 Liability
            </h3>
            <p className="font-sans text-4xl text-foreground mb-2">
              {formatNumber(scope3Liability.remaining)}{" "}
              <span className="text-xl text-muted-foreground">
                {scope3Liability.unit}
              </span>
            </p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Remaining gap to target
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/marketplace"
              className="flex-1 bg-secondary text-white flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors"
            >
              Explore Spot Market
            </Link>
            <button
              type="button"
              className="flex-1 bg-white border border-border text-foreground flex items-center justify-center text-[10px] font-bold uppercase tracking-widest hover:border-slate-900 transition-colors"
            >
              Generate ESRS Compliance PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
