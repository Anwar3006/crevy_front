"use client";
import React from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BuyerDashboard() {
  return (
    <div className="p-8 space-y-8 font-sans text-foreground">
      <h1 className="text-4xl font-extrabold uppercase tracking-tighter">Impact <span className="text-brand">Portfolio</span></h1>
      <div className="grid grid-cols-4 gap-4">
        <Card className="rounded-none border-foreground bg-background"><CardContent className="p-6">
          <Award className="w-5 h-5 text-brand mb-4"/>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Retired</p>
          <p className="font-mono text-3xl font-bold">12,450 tCO2e</p>
        </CardContent></Card>
      </div>
    </div>
  );
}
