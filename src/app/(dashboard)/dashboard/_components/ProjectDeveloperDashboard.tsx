"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectDeveloperDashboard({ userName }) {
  return (
    <div className="p-8 space-y-8 font-sans">
      <div className="bg-foreground p-12 text-background">
        <h1 className="font-sans font-extrabold text-5xl tracking-tighter mb-6">WELCOME, <span className="text-brand">{userName.toUpperCase()}</span></h1>
        <Card className="rounded-none border-brand bg-background/5 inline-block min-w-[300px]">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Project Switcher</p>
            <select className="w-full bg-transparent border-b-2 border-brand py-2 text-lg font-bold text-background focus:outline-none">
              <option className="bg-foreground text-background">COCOA WASTE PILOT</option>
            </select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
