"use client";

import type React from "react";
import { useState } from "react";
import { CrevyLoader } from "@/components/CrevyLoader";
import { Navbar } from "@/components/public/landing/Navbar";
import { PublicFooter } from "@/components/public/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {isLoading && <CrevyLoader onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <Navbar />
          <main className="flex-1">{children}</main>
          <PublicFooter />
        </>
      )}
    </div>
  );
}
