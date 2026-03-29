"use client";

import {
  BookOpen,
  ChevronLeft,
  FileQuestion,
  HelpCircle,
  MessageCircle,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  const router = useRouter();

  const faqs = [
    {
      question: "How do I calculate my carbon credits?",
      answer:
        "Use our integrated Carbon Calculator on the dashboard to input your project details and get an estimate.",
    },
    {
      question: "What documents are required for submission?",
      answer:
        "Typically, you'll need project design documents, land use permits, and baseline environmental assessments.",
    },
    {
      question: "How long does the certification process take?",
      answer:
        "Certification usually takes between 3-6 months depending on the project type and complexity.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 hover:text-emerald-600"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Support Center</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-lg text-slate-500">
            Find everything you need to know about submitting your green
            projects and earning carbon credits.
          </p>
        </div>

        {/* Video Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              How to Submit a Project
            </h3>
          </div>

          <Card className="overflow-hidden border-none shadow-2xl bg-slate-900 aspect-video relative group">
            <video
              controls
              className="w-full h-full object-cover opacity-80"
              poster="https://images.unsplash.com/photo-1466611653911-95281bbb3576?q=80&w=2070&auto=format&fit=crop"
            >
              <source
                src="https://res.cloudinary.com/demo/video/upload/dog.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/path-to-your-captions.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
          </Card>
          <div className="flex flex-col md:flex-row justify-between gap-4 py-4">
            <p className="text-slate-500 max-w-xl">
              This comprehensive video guide walks you through every step of our
              submission flow, from choosing your project type to uploading
              supporting verification documents.
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 font-bold rounded-xl"
              onClick={() => router.push("/new-project")}
            >
              Start Your Submission
            </Button>
          </div>
        </section>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Documentation",
              desc: "Detailed guides on carbon methodologies.",
            },
            {
              icon: HelpCircle,
              title: "FAQ",
              desc: "Quick answers to common questions.",
            },
            {
              icon: MessageCircle,
              title: "Direct Support",
              desc: "Chat with our team of climate experts.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="hover:border-emerald-200 transition-colors cursor-pointer group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-slate-100 rounded-xl w-fit group-hover:bg-emerald-50 transition-colors">
                  <item.icon className="w-6 h-6 text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="space-y-6 pt-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileQuestion className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-slate-100">
                <CardHeader>
                  <CardTitle className="text-base font-bold">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <Card className="bg-slate-900 text-white border-none p-8 md:p-12 text-center rounded-3xl">
          <CardContent className="space-y-6 max-w-2xl mx-auto p-0">
            <h3 className="text-2xl md:text-3xl font-bold">
              Still have questions?
            </h3>
            <p className="text-slate-400">
              Our team is here to help you maximize your environmental impact.
              Reach out today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 h-12 px-8 rounded-xl font-bold">
                Contact Us
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 h-12 px-8 rounded-xl font-bold"
              >
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <p className="font-bold text-slate-900 text-xl">Crevy Support</p>
          <p className="text-slate-500 text-sm">
            © 2024 Foovante. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
