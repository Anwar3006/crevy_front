"use client";
import React from "react";
export default function TrackVerificationPage() {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-foreground">Verification <span className="text-brand">Pipeline</span></h1>
      <div className="grid grid-cols-4 gap-6 mt-12">
        {["Submission", "Methodology Review", "Audit", "Registry Submission"].map(s => (
          <div key={s} className="border-b-2 border-foreground pb-2"><h2 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">{s}</h2></div>
        ))}
      </div>
    </div>
  );
}
