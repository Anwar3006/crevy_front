"use client";

import PortfolioOverview from "./_components/PortfolioOverview";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-muted font-sans selection:bg-secondary selection:text-white">
      <PortfolioOverview />
    </main>
  );
}
