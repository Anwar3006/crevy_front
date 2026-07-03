"use client";

import { motion } from "framer-motion";
import { Database, FileLock, UserCheck } from "lucide-react";

export default function DataProcessingAgreementPage() {
  return (
    <div className="animate-in fade-in duration-700 bg-white">
      <DPAHero />
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="prose prose-slate max-w-none space-y-12">
          <div className="p-8 bg-muted rounded-3xl border border-border italic text-muted-foreground text-sm">
            Note: This Data Processing Agreement (DPA) is designed to meet the
            requirements of the Ghana Data Protection Act (Act 843) and the EU
            General Data Protection Regulation (GDPR).
          </div>

          <section>
            <h2 className="text-2xl font-black uppercase text-foreground mb-4">
              1. Scope and Applicability
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This DPA applies where and only to the extent that Foovante Global
              processes Personal Data on behalf of the Customer in the course of
              providing the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-foreground mb-4">
              2. Roles and Responsibilities
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The parties acknowledge and agree that with regard to the
              processing of Personal Data, Customer is the Data Controller and
              Foovante Global is the Data Processor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-foreground mb-4">
              3. Security Measures
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Foovante Global shall implement appropriate technical and
              organisational measures to ensure a level of security appropriate
              to the risk.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="p-8 border border-border rounded-3xl">
              <FileLock className="text-emerald-600 mb-4" />
              <h4 className="font-black text-slate-800 uppercase mb-2 text-sm">
                Encryption
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                All institutional data is encrypted at rest using AES-256 and in
                transit via TLS 1.3.
              </p>
            </div>
            <div className="p-8 border border-border rounded-3xl">
              <UserCheck className="text-emerald-600 mb-4" />
              <h4 className="font-black text-slate-800 uppercase mb-2 text-sm">
                Access Control
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Strict role-based access controls (RBAC) ensure only authorised
                personnel handle sensitive data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DPAHero() {
  return (
    <section className="bg-myBlue pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <Database size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
              Enterprise Compliance
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Data Processing <br />
            <span className="text-emerald-400">Agreement</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Standard contractual clauses for enterprise ESG clients and
            institutional partners. Ensuring highest standards of data
            governance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
