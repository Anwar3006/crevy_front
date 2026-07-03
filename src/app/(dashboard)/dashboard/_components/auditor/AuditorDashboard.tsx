"use client";
import React from "react";
import { Shield, Map as MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditorDashboard() {
  return (
    <div className="p-8 space-y-8 font-sans">
      <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-foreground">Auditor <span className="text-brand">Portal</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-none border-foreground">
          <CardHeader><CardTitle className="font-mono text-xs uppercase tracking-widest flex items-center gap-2"><MapIcon className="w-4 h-4 text-brand"/> Immutable Assets</CardTitle></CardHeader>
          <CardContent className="h-64 bg-muted flex items-center justify-center font-mono text-[10px] uppercase">Live Satellite Telemetry // Sentinel-2</CardContent>
        </Card>
      </div>
    </div>
  );
}
