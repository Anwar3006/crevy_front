"use client";

import {
  ChevronRight,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      q: "How do I register my project?",
      a: "You can start by clicking the 'Register' button and selecting 'Project Owner'.",
    },
    {
      q: "What is dMRV?",
      a: "digital Monitoring, Reporting, and Verification is our core science framework for credit integrity.",
    },
    {
      q: "How long does verification take?",
      a: "Typically between 2 to 6 weeks depending on project multimodal data availability.",
    },
  ];

  return (
    <div className="animate-in fade-in duration-700 bg-white">
      <SupportHero />

      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: MessageCircle,
              label: "Live Chat",
              desc: "Average response time: 2 mins",
              color: "text-emerald-600",
            },
            {
              icon: Mail,
              label: "Email Support",
              desc: "support@crevy.app",
              color: "text-blue-600",
            },
            {
              icon: Phone,
              label: "Institutional Hotline",
              desc: "+233 504-609989",
              color: "text-slate-900",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50 text-center"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <c.icon size={28} className={c.color} />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">{c.label}</h3>
              <p className="text-slate-500 text-sm font-medium">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black uppercase text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{f.q}</h4>
                  <ChevronRight
                    size={18}
                    className="text-slate-400 group-hover:text-emerald-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SupportHero() {
  return (
    <section className="bg-myBlue pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <LifeBuoy size={48} className="mx-auto text-emerald-400 mb-8" />
        <h1
          className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          How Can We <br />
          <span className="text-emerald-400">Help?</span>
        </h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            placeholder="Search help articles, methodologies, or technical guides..."
            className="w-full pl-16 pr-6 h-18 bg-white rounded-3xl border-none outline-none font-medium text-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
