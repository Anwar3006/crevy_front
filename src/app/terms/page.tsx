"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Gavel,
  Globe,
  HelpCircle,
  Leaf,
  Lock,
  Mail,
  Scale,
  ShieldAlert,
  UserCheck,
  Wallet,
} from "lucide-react";
import { Syne } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicNavbar } from "@/components/public/public-navbar";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

// ─── SIDEBAR SECTIONS ────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of Terms", icon: BadgeCheck },
  { id: "definitions", label: "Definitions", icon: BookOpen },
  { id: "eligibility", label: "Eligibility", icon: UserCheck },
  { id: "account", label: "Account Registration", icon: Lock },
  { id: "platform-use", label: "Platform Use", icon: Globe },
  { id: "prohibited", label: "Prohibited Activities", icon: Ban },
  { id: "carbon-credits", label: "Carbon Credit Terms", icon: Leaf },
  { id: "project-owners", label: "Project Owner Obligations", icon: Briefcase },
  { id: "corporate-buyers", label: "Corporate Buyer Terms", icon: Building2 },
  { id: "payments", label: "Payments & Fees", icon: Wallet },
  { id: "ip", label: "Intellectual Property", icon: FileText },
  { id: "warranties", label: "Disclaimer of Warranties", icon: AlertTriangle },
  { id: "liability", label: "Limitation of Liability", icon: ShieldAlert },
  { id: "indemnification", label: "Indemnification", icon: Scale },
  { id: "governing-law", label: "Governing Law", icon: Gavel },
  { id: "disputes", label: "Dispute Resolution", icon: Scale },
  { id: "changes", label: "Changes to Terms", icon: HelpCircle },
  { id: "contact", label: "Contact Us", icon: Mail },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  return (
    <div className={cn(syne.variable, "font-sans selection:bg-myGreen/30")}>
      <PublicNavbar />
      <main>
        <TermsHero />
        <TermsContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </main>
      <PublicFooter />
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function TermsHero() {
  return (
    <section className="bg-myBlue pt-32 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(44,194,149,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-myGreen/10 border border-myGreen/20 px-4 py-2 rounded-full mb-8">
            <Gavel size={14} className="text-myGreen" />
            <span className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase">
              Legal · Governed by the Laws of Ghana
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-syne)] font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl">
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Crevy platform, operated by{" "}
            <strong className="text-white">Foovante Global Ltd</strong>. Please
            read them carefully before using our services. By accessing or using
            Crevy, you agree to be bound by these Terms.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
              <span className="text-white font-medium">Last Updated:</span> 3
              April 2026
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
              <span className="text-white font-medium">Effective:</span> 3 April
              2026
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 text-sm">
              <span className="text-white font-medium">Jurisdiction:</span>{" "}
              Republic of Ghana
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTENT ─────────────────────────────────────────────────────────────────

function TermsContent({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (id: string) => void;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          {/* ── Sticky Sidebar ── */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </p>
              <nav
                className="space-y-1 max-h-[70vh] overflow-y-auto pr-1"
                aria-label="Terms of service sections"
              >
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                        activeSection === section.id
                          ? "bg-myGreen/10 text-myGreen"
                          : "text-gray-500 hover:text-myBlue hover:bg-gray-50",
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      {section.label}
                    </a>
                  );
                })}
              </nav>

              {/* Quick Info Box */}
              <div className="mt-8 bg-myBlue rounded-2xl p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-myGreen/20 rounded-xl mb-4">
                  <Mail size={18} className="text-myGreen" />
                </div>
                <h4 className="font-[family-name:var(--font-syne)] font-bold text-white text-sm mb-2">
                  Legal Enquiries
                </h4>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  For legal or compliance questions about these Terms, contact
                  our legal team.
                </p>
                <a
                  href="mailto:legal@foovante-global.com"
                  className="text-myGreen text-xs font-bold hover:underline"
                >
                  legal@foovante-global.com
                </a>
              </div>

              {/* Related Links */}
              <div className="mt-4 bg-gray-50 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Related
                </p>
                <div className="space-y-2">
                  <Link
                    href="/privacy"
                    className="block text-sm text-gray-600 hover:text-myGreen transition-colors font-medium"
                  >
                    → Privacy Policy
                  </Link>
                  <Link
                    href="/support"
                    className="block text-sm text-gray-600 hover:text-myGreen transition-colors font-medium"
                  >
                    → Support Centre
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            <div className="space-y-16">
              {/* 1. Acceptance */}
              <TermsSection id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing, browsing, or registering an account on the Crevy
                  platform (&quot;Platform&quot;), you confirm that you have
                  read, understood, and agree to be legally bound by these Terms
                  of Service and all policies incorporated by reference,
                  including our{" "}
                  <Link
                    href="/privacy"
                    className="text-myGreen hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p>
                  If you are accessing the Platform on behalf of a company or
                  other legal entity, you represent and warrant that you have
                  the authority to bind that entity to these Terms. In such
                  cases, &quot;you&quot; and &quot;your&quot; shall refer to
                  that entity.
                </p>
                <p>
                  If you do not agree to these Terms in their entirety, you must
                  not use the Platform. We reserve the right to modify these
                  Terms at any time, subject to the notice provisions in Section
                  17.
                </p>
              </TermsSection>

              {/* 2. Definitions */}
              <TermsSection id="definitions" title="2. Definitions">
                <p>
                  In these Terms, the following capitalised terms have the
                  meanings given below:
                </p>
                <div className="space-y-3 mt-4">
                  {[
                    {
                      term: '"Crevy" / "Platform"',
                      def: "The digital platform and associated services operated by Foovante Global Ltd, accessible at crevy.app.",
                    },
                    {
                      term: '"Foovante Global" / "we" / "us" / "our"',
                      def: "Foovante Global Ltd, a company registered in Ghana, the operator of the Crevy platform.",
                    },
                    {
                      term: '"User" / "you"',
                      def: "Any individual or legal entity that registers for or uses the Platform, including Project Owners and Corporate Buyers.",
                    },
                    {
                      term: '"Project Owner"',
                      def: "A User who registers one or more green projects on the Platform with the intention of generating and selling carbon credits.",
                    },
                    {
                      term: '"Corporate Buyer" / "Buyer"',
                      def: "A User (typically a company or organisation) that purchases carbon credits through the Marketplace to offset emissions.",
                    },
                    {
                      term: '"Carbon Credit"',
                      def: "A verified certificate representing the reduction or removal of one metric tonne of CO₂-equivalent (tCO₂e) from the atmosphere, issued following verification under an accepted standard.",
                    },
                    {
                      term: '"Marketplace"',
                      def: "The online exchange within the Platform where verified carbon credits are listed for sale by Project Owners and purchased by Corporate Buyers.",
                    },
                    {
                      term: '"Verification Standard"',
                      def: "An internationally recognised carbon accounting methodology used to verify carbon credits, including but not limited to VCS (Verra), Gold Standard, and Plan Vivo.",
                    },
                    {
                      term: '"KYC / KYB"',
                      def: "Know Your Customer / Know Your Business — identity and compliance verification procedures required before transacting on the Platform.",
                    },
                    {
                      term: '"Content"',
                      def: "All text, data, images, documents, reports, and other materials submitted to or displayed on the Platform.",
                    },
                  ].map((item) => (
                    <div
                      key={item.term}
                      className="bg-gray-50 rounded-xl px-5 py-4"
                    >
                      <span className="font-[family-name:var(--font-syne)] font-bold text-myBlue text-sm">
                        {item.term}
                      </span>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        {item.def}
                      </p>
                    </div>
                  ))}
                </div>
              </TermsSection>

              {/* 3. Eligibility */}
              <TermsSection id="eligibility" title="3. Eligibility">
                <p>To use the Crevy Platform, you must:</p>
                <BulletList
                  items={[
                    "Be at least 18 years of age, or the age of legal majority in your jurisdiction (whichever is higher);",
                    "Have the legal capacity to enter into binding contracts under applicable law;",
                    "Not be located in, organised under, or a citizen or resident of a country or territory subject to comprehensive international sanctions;",
                    "Not have been previously suspended or removed from the Platform by Foovante Global;",
                    "If acting on behalf of a legal entity — be duly authorised to represent that entity.",
                  ]}
                />
                <p>
                  We reserve the right to verify eligibility at any time and to
                  suspend or terminate accounts where eligibility requirements
                  are not met. Providing false information during registration
                  is grounds for immediate account termination.
                </p>
              </TermsSection>

              {/* 4. Account */}
              <TermsSection
                id="account"
                title="4. Account Registration & Security"
              >
                <p>
                  To access most features of the Platform, you must register for
                  an account. When registering, you agree to:
                </p>
                <BulletList
                  items={[
                    "Provide accurate, current, and complete information as prompted by the registration form;",
                    "Maintain and promptly update your account information to keep it accurate and complete;",
                    "Keep your login credentials confidential and not share them with third parties;",
                    "Notify us immediately at info@foovante-global.com of any unauthorised use of your account or any security breach;",
                    "Accept responsibility for all activities that occur under your account, whether authorised or not.",
                  ]}
                />
                <InfoBox>
                  Foovante Global will never ask for your password by email,
                  phone, or chat. If you receive such a request, do not comply
                  and report it immediately to{" "}
                  <a
                    href="mailto:security@foovante-global.com"
                    className="text-myGreen font-semibold hover:underline"
                  >
                    security@foovante-global.com
                  </a>
                  .
                </InfoBox>
                <p>
                  We may require you to complete KYC or KYB verification before
                  enabling full transactional access. You consent to us
                  collecting and processing the information necessary for these
                  checks in accordance with our{" "}
                  <Link
                    href="/privacy"
                    className="text-myGreen hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </TermsSection>

              {/* 5. Platform Use */}
              <TermsSection id="platform-use" title="5. Platform Use">
                <p>
                  Subject to your compliance with these Terms, Foovante Global
                  grants you a limited, non-exclusive, non-transferable,
                  revocable licence to access and use the Platform for its
                  intended purposes, which are:
                </p>
                <BulletList
                  items={[
                    "For Project Owners: registering green projects, submitting data for verification, listing verified carbon credits on the Marketplace, and receiving proceeds from credit sales;",
                    "For Corporate Buyers: browsing the Marketplace, purchasing verified carbon credits for the purpose of offsetting emissions, and accessing compliance and reporting tools;",
                    "For all Users: accessing educational resources, support materials, and analytics related to carbon credits and climate impact.",
                  ]}
                />
                <p>
                  This licence is granted solely for lawful purposes in
                  accordance with these Terms. Any use of the Platform not
                  expressly authorised by these Terms is strictly prohibited.
                </p>
              </TermsSection>

              {/* 6. Prohibited */}
              <TermsSection id="prohibited" title="6. Prohibited Activities">
                <p>
                  You agree that you will not, and will not permit any third
                  party to:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {[
                    "Submit false, misleading, or fraudulent project data or documentation",
                    "Misrepresent the volume, type, or verification status of carbon credits",
                    "Attempt to circumvent, disable, or interfere with the Platform's security features",
                    "Use automated tools, bots, or scrapers to access the Platform without written permission",
                    "Engage in market manipulation, price-fixing, or coordinated trading practices",
                    "Launder money or engage in any financial crime using the Platform",
                    "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
                    "Harass, abuse, threaten, or intimidate other Users or Foovante Global staff",
                    "Upload malware, viruses, or any destructive code to the Platform",
                    "Access another User's account without authorisation",
                    "Use the Platform for any purpose that is unlawful under Ghanaian law or international law",
                    "Reproduce, duplicate, sell, or commercially exploit any part of the Platform without express written consent",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4"
                    >
                      <Ban size={16} className="text-red-400 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Violation of these prohibitions may result in immediate
                  account suspension, termination, and legal action. We reserve
                  the right to report suspected criminal activity to the
                  appropriate authorities.
                </p>
              </TermsSection>

              {/* 7. Carbon Credits */}
              <TermsSection id="carbon-credits" title="7. Carbon Credit Terms">
                <p>
                  Carbon credits listed and traded on the Crevy Marketplace are
                  subject to the following terms:
                </p>

                <SubSection title="7.1 Verification Requirement">
                  <p>
                    Only carbon credits that have been verified by a Foovante
                    Global-approved auditor under a recognised Verification
                    Standard may be listed on the Marketplace. Foovante Global
                    does not issue carbon credits itself — it facilitates the
                    process of independent verification and the subsequent
                    listing and trading of verified credits.
                  </p>
                </SubSection>

                <SubSection title="7.2 Credit Integrity">
                  <p>
                    Each carbon credit listed on Crevy represents a genuine,
                    additional, permanent, and independently verified reduction
                    or removal of one tCO₂e. Foovante Global implements measures
                    to prevent the double-counting or re-sale of credits,
                    including credit registry integration and unique serial
                    number assignment.
                  </p>
                </SubSection>

                <SubSection title="7.3 No Investment Advice">
                  <p>
                    Nothing on the Platform constitutes financial, investment,
                    tax, or legal advice. The purchase of carbon credits is not
                    a guaranteed investment. The price and availability of
                    carbon credits may fluctuate. You are responsible for
                    conducting your own due diligence before transacting.
                  </p>
                </SubSection>

                <SubSection title="7.4 Retirement of Credits">
                  <p>
                    Upon purchase, Corporate Buyers may elect to
                    &quot;retire&quot; carbon credits, permanently removing them
                    from circulation to claim an offset against emissions.
                    Retired credits cannot be re-sold or transferred. Foovante
                    Global will issue a retirement certificate confirming the
                    offset.
                  </p>
                </SubSection>

                <SubSection title="7.5 Market Conditions">
                  <p>
                    Foovante Global does not guarantee the availability of
                    specific credits, pricing levels, or market liquidity. The
                    Marketplace operates on a first-come, first-served basis and
                    prices are set by Project Owners subject to Platform pricing
                    guidelines.
                  </p>
                </SubSection>
              </TermsSection>

              {/* 8. Project Owners */}
              <TermsSection
                id="project-owners"
                title="8. Project Owner Obligations"
              >
                <p>
                  If you register as a Project Owner, you agree to the following
                  additional obligations:
                </p>
                <BulletList
                  items={[
                    "Submit only accurate, complete, and truthful project data, documentation, and supporting evidence;",
                    "Ensure you hold all necessary legal rights, permits, and approvals for your project (including land title or authorised usage rights);",
                    "Cooperate fully with Foovante Global's appointed auditors during site visits, data verification, and ongoing monitoring;",
                    "Notify Foovante Global immediately if your project undergoes any material change that could affect its carbon sequestration capacity or verification status (e.g. land sale, natural disaster, change in farming practices);",
                    "Not list credits on any other platform or marketplace without first notifying Foovante Global;",
                    "Comply with the specific Verification Standard under which your project is certified, including ongoing monitoring, reporting, and verification (MRV) obligations;",
                    "Accept that credits may be placed in a buffer pool or reversed if the underlying project fails to maintain verified carbon sequestration;",
                    "Provide accurate bank account details for payment disbursements and maintain compliance with applicable tax laws in your jurisdiction.",
                  ]}
                />
                <HighlightBox color="green">
                  Project Owners retain ownership of their projects at all
                  times. Listing a project on Crevy grants Foovante Global a
                  non-exclusive licence to display, promote, and facilitate the
                  sale of associated carbon credits on your behalf. You may
                  delist a project at any time, subject to any outstanding
                  verified credit obligations.
                </HighlightBox>
              </TermsSection>

              {/* 9. Corporate Buyers */}
              <TermsSection
                id="corporate-buyers"
                title="9. Corporate Buyer Terms"
              >
                <p>
                  Corporate Buyers accessing the Marketplace agree to the
                  following:
                </p>
                <BulletList
                  items={[
                    "Carbon credits purchased on Crevy are for the purpose of genuine emissions offsetting, ESG compliance, or voluntary sustainability commitments — not for speculative re-sale unless expressly permitted;",
                    "You will not make false or misleading public claims about your emissions offsetting activities based on credits purchased on Crevy;",
                    "You are responsible for ensuring that the credits you purchase are appropriate for your regulatory and reporting requirements — Foovante Global does not provide compliance advice;",
                    "All purchases are final once a transaction is confirmed, subject to the refund provisions in Section 10;",
                    "You will complete KYB verification before exceeding applicable transaction thresholds.",
                  ]}
                />
                <p>
                  Foovante Global will provide Corporate Buyers with a
                  transaction record and, upon request, a detailed impact report
                  for ESG reporting purposes. Such reports are provided in good
                  faith based on available data but do not constitute a
                  regulatory compliance certification.
                </p>
              </TermsSection>

              {/* 10. Payments */}
              <TermsSection id="payments" title="10. Payments & Fees">
                <SubSection title="10.1 Pricing">
                  <p>
                    Carbon credit prices on the Marketplace are set by Project
                    Owners in accordance with Platform guidelines. All prices
                    are displayed exclusive of applicable taxes unless stated
                    otherwise. Foovante Global reserves the right to impose
                    minimum and maximum pricing thresholds.
                  </p>
                </SubSection>

                <SubSection title="10.2 Platform Fees">
                  <p>
                    Foovante Global charges a platform service fee on each
                    completed transaction. The current fee schedule is displayed
                    within your account dashboard and may be updated with 30
                    days&apos; notice. By completing a transaction, you agree to
                    the applicable fees at the time of purchase.
                  </p>
                </SubSection>

                <SubSection title="10.3 Payment Processing">
                  <p>
                    All payments are processed through our authorised payment
                    service providers. Foovante Global does not store raw
                    payment card data. By making a payment, you agree to the
                    terms of the relevant payment processor. In the event of a
                    payment failure, the transaction will not be completed and
                    no credit transfer will occur.
                  </p>
                </SubSection>

                <SubSection title="10.4 Refunds">
                  <p>
                    All carbon credit transactions are final upon confirmation.
                    Refunds will only be issued in the following circumstances:
                  </p>
                  <BulletList
                    items={[
                      "A technical error on the Platform caused a duplicate or erroneous transaction;",
                      "A verified credit is subsequently found to have been fraudulently listed;",
                      "Foovante Global, at its sole discretion, determines that a refund is warranted.",
                    ]}
                  />
                  <p>
                    Refund requests must be submitted in writing to{" "}
                    <a
                      href="mailto:support@foovante-global.com"
                      className="text-myGreen hover:underline"
                    >
                      support@foovante-global.com
                    </a>{" "}
                    within 14 days of the transaction date.
                  </p>
                </SubSection>

                <SubSection title="10.5 Taxes">
                  <p>
                    You are solely responsible for determining, collecting,
                    reporting, and remitting any taxes applicable to your
                    transactions on the Platform, including VAT, income tax, or
                    withholding tax. Foovante Global may issue tax documentation
                    as required by Ghanaian law but does not provide tax advice.
                  </p>
                </SubSection>
              </TermsSection>

              {/* 11. IP */}
              <TermsSection id="ip" title="11. Intellectual Property">
                <p>
                  All intellectual property rights in the Platform, including
                  its design, software, algorithms, branding, logos, text,
                  graphics, and carbon calculation methodologies (&quot;Foovante
                  IP&quot;), are owned by or licensed to Foovante Global Ltd.
                  Nothing in these Terms transfers any ownership of Foovante IP
                  to you.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-sublicensable
                  licence to use the Platform for its intended purposes. You
                  must not:
                </p>
                <BulletList
                  items={[
                    "Copy, reproduce, or distribute any part of the Platform without express written consent;",
                    "Reverse-engineer, decompile, or disassemble the Platform's software;",
                    "Use Foovante Global or Crevy trademarks without prior written authorisation;",
                    "Remove or alter any copyright, trademark, or proprietary rights notices.",
                  ]}
                />
                <p>
                  By submitting Content to the Platform (such as project data,
                  photos, or reports), you grant Foovante Global a worldwide,
                  royalty-free, non-exclusive licence to use, reproduce,
                  display, and distribute such Content for the purposes of
                  operating the Platform and promoting verified projects. You
                  retain ownership of your Content and may request its removal
                  subject to legal retention obligations.
                </p>
              </TermsSection>

              {/* 12. Warranties */}
              <TermsSection
                id="warranties"
                title="12. Disclaimer of Warranties"
              >
                <WarningBox>
                  The Platform is provided &quot;as is&quot; and &quot;as
                  available&quot; without warranties of any kind, whether
                  express or implied. To the fullest extent permitted by
                  applicable law, Foovante Global expressly disclaims all
                  warranties.
                </WarningBox>
                <p>
                  Without limiting the foregoing, Foovante Global does not
                  warrant that:
                </p>
                <BulletList
                  items={[
                    "The Platform will be uninterrupted, error-free, or free from viruses or harmful components;",
                    "Information on the Platform is complete, accurate, or up to date;",
                    "Any specific outcome will result from using the Platform, including the successful verification of a project or the sale of carbon credits at any given price;",
                    "Carbon credits purchased on the Platform will satisfy any specific regulatory, voluntary, or contractual emission reduction obligation.",
                  ]}
                />
                <p>
                  We make reasonable efforts to maintain Platform availability
                  and data accuracy but cannot guarantee 100% uptime or the
                  absence of errors. Planned maintenance will be communicated in
                  advance where practicable.
                </p>
              </TermsSection>

              {/* 13. Liability */}
              <TermsSection id="liability" title="13. Limitation of Liability">
                <p>
                  To the maximum extent permitted by the laws of Ghana and any
                  other applicable jurisdiction, Foovante Global and its
                  directors, officers, employees, agents, and partners shall not
                  be liable for:
                </p>
                <BulletList
                  items={[
                    "Any indirect, incidental, special, consequential, or punitive damages;",
                    "Loss of profits, revenue, data, goodwill, or business opportunities;",
                    "Any damages resulting from your reliance on information or services obtained through the Platform;",
                    "Any unauthorised access to, or alteration of, your data or transmissions;",
                    "Losses arising from events beyond our reasonable control (force majeure), including natural disasters, acts of government, or internet outages.",
                  ]}
                />
                <HighlightBox color="neutral">
                  In any event, Foovante Global&apos;s total aggregate liability
                  to you for all claims arising out of or relating to these
                  Terms or your use of the Platform shall not exceed the greater
                  of: (a) the total fees paid by you to Foovante Global in the
                  12-month period immediately preceding the event giving rise to
                  the claim, or (b) GHS 1,000 (one thousand Ghana Cedis).
                </HighlightBox>
                <p>
                  Some jurisdictions do not allow the exclusion of certain
                  warranties or the limitation of liability for consequential or
                  incidental damages. In such jurisdictions, our liability is
                  limited to the greatest extent permitted by law.
                </p>
              </TermsSection>

              {/* 14. Indemnification */}
              <TermsSection id="indemnification" title="14. Indemnification">
                <p>
                  You agree to indemnify, defend, and hold harmless Foovante
                  Global Ltd and its officers, directors, employees, agents,
                  licensors, and service providers from and against any and all
                  claims, liabilities, damages, judgements, awards, losses,
                  costs, and expenses (including reasonable legal fees) arising
                  out of or relating to:
                </p>
                <BulletList
                  items={[
                    "Your use of the Platform in violation of these Terms;",
                    "Your violation of any applicable law, rule, or regulation;",
                    "Any Content you submit, post, or transmit through the Platform;",
                    "Your infringement of any intellectual property or other rights of any person or entity;",
                    "Any claim by a third party arising from your use of carbon credits purchased on the Platform.",
                  ]}
                />
                <p>
                  Foovante Global reserves the right to assume the exclusive
                  defence and control of any matter subject to indemnification
                  by you, in which case you agree to cooperate fully.
                </p>
              </TermsSection>

              {/* 15. Governing Law */}
              <TermsSection id="governing-law" title="15. Governing Law">
                <p>
                  These Terms and any dispute or claim arising out of or in
                  connection with them (including non-contractual disputes or
                  claims) shall be governed by and construed in accordance with
                  the laws of the <strong>Republic of Ghana</strong>, without
                  regard to its conflict of law provisions.
                </p>
                <InfoBox>
                  You agree that the courts of Ghana shall have exclusive
                  jurisdiction to settle any dispute or claim arising out of or
                  in connection with these Terms or their subject matter or
                  formation, subject to the arbitration provisions in Section
                  16.
                </InfoBox>
                <p>Applicable laws include, but are not limited to:</p>
                <BulletList
                  items={[
                    "The Companies Act, 2019 (Act 992) — Republic of Ghana",
                    "The Electronic Transactions Act, 2008 (Act 772) — Republic of Ghana",
                    "The Data Protection Act, 2012 (Act 843) — Republic of Ghana",
                    "The Payment Systems and Services Act, 2019 (Act 987) — Republic of Ghana",
                    "Any applicable ECOWAS regional regulations",
                  ]}
                />
              </TermsSection>

              {/* 16. Disputes */}
              <TermsSection id="disputes" title="16. Dispute Resolution">
                <SubSection title="16.1 Informal Resolution">
                  <p>
                    Before initiating formal proceedings, you agree to attempt
                    to resolve any dispute with Foovante Global informally by
                    contacting us at{" "}
                    <a
                      href="mailto:legal@foovante-global.com"
                      className="text-myGreen hover:underline"
                    >
                      legal@foovante-global.com
                    </a>
                    . We will endeavour to respond and resolve your concern
                    within 30 days.
                  </p>
                </SubSection>

                <SubSection title="16.2 Mediation">
                  <p>
                    If informal resolution fails within 30 days, either party
                    may refer the dispute to mediation administered by the{" "}
                    <strong>Ghana Arbitration Centre (GAC)</strong> in
                    accordance with its Mediation Rules. Both parties agree to
                    participate in good faith.
                  </p>
                </SubSection>

                <SubSection title="16.3 Arbitration">
                  <p>
                    Any dispute that cannot be resolved by mediation shall be
                    finally and conclusively resolved by binding arbitration
                    administered by the{" "}
                    <strong>Ghana Arbitration Centre</strong> in accordance with
                    its Arbitration Rules. The seat of arbitration shall be
                    Accra, Ghana. The language of arbitration shall be English.
                    The arbitral award shall be final and binding and may be
                    enforced in any court of competent jurisdiction.
                  </p>
                </SubSection>

                <SubSection title="16.4 Exceptions">
                  <p>
                    Nothing in this section prevents either party from seeking
                    urgent interim or injunctive relief from a competent court
                    to prevent imminent harm, including in connection with
                    intellectual property infringement or fraud.
                  </p>
                </SubSection>
              </TermsSection>

              {/* 17. Changes */}
              <TermsSection id="changes" title="17. Changes to These Terms">
                <p>
                  Foovante Global reserves the right to modify these Terms at
                  any time. When we make material changes, we will:
                </p>
                <BulletList
                  items={[
                    "Update the 'Last Updated' date at the top of this document;",
                    "Provide at least 30 days' advance written notice to all registered Users by email;",
                    "Display a prominent notice on the Platform for at least 14 days prior to changes taking effect.",
                  ]}
                />
                <p>
                  Your continued use of the Platform after the effective date of
                  any changes constitutes your acceptance of the revised Terms.
                  If you do not agree to the revised Terms, you must stop using
                  the Platform and may request account deletion by contacting us
                  at{" "}
                  <a
                    href="mailto:support@foovante-global.com"
                    className="text-myGreen hover:underline"
                  >
                    support@foovante-global.com
                  </a>
                  .
                </p>
                <p>
                  Non-material changes (such as corrections of typographical
                  errors, clarification of existing provisions, or updates to
                  contact information) may be made without advance notice and
                  will take effect immediately upon posting.
                </p>
              </TermsSection>

              {/* 18. Contact */}
              <TermsSection id="contact" title="18. Contact Information">
                <p>
                  If you have any questions, concerns, or requests relating to
                  these Terms of Service, please contact us at:
                </p>
                <InfoBox>
                  <strong>Foovante Global Ltd — Legal Team</strong>
                  <br />
                  Accra, Greater Accra, Ghana
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:legal@foovante-global.com"
                    className="text-myGreen font-semibold hover:underline"
                  >
                    legal@foovante-global.com
                  </a>
                  <br />
                  General Enquiries:{" "}
                  <a
                    href="mailto:info@foovante-global.com"
                    className="text-myGreen font-semibold hover:underline"
                  >
                    info@foovante-global.com
                  </a>
                  <br />
                  Phone: +(233) 504-609989
                  <br />
                  Support:{" "}
                  <Link
                    href="/support"
                    className="text-myGreen font-semibold hover:underline"
                  >
                    crevy.app/support
                  </Link>
                </InfoBox>

                {/* Final acknowledgement */}
                <div className="mt-8 bg-myGreen/5 border border-myGreen/20 rounded-2xl p-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    By using the Crevy platform, you acknowledge that you have
                    read these Terms of Service in their entirety, that you
                    understand them, and that you agree to be bound by all of
                    their provisions. These Terms, together with the{" "}
                    <Link
                      href="/privacy"
                      className="text-myGreen hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    , constitute the entire agreement between you and Foovante
                    Global with respect to your use of the Platform and
                    supersede all prior agreements, representations, and
                    understandings.
                  </p>
                </div>
              </TermsSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function TermsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-[3px] w-10 bg-myGreen rounded-full shrink-0" />
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-2xl md:text-3xl text-myBlue leading-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
        {children}
      </div>
    </motion.div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h3 className="font-[family-name:var(--font-syne)] font-bold text-lg text-myBlue mb-3">
        {title}
      </h3>
      <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 mt-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-gray-700 text-[15px]"
        >
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-myGreen shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-myBlue/5 border border-myBlue/10 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed mt-3">
      {children}
    </div>
  );
}

function HighlightBox({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: "green" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 text-sm leading-relaxed mt-3 border-l-4",
        color === "green"
          ? "bg-myGreen/5 border-myGreen text-gray-700"
          : "bg-gray-50 border-gray-300 text-gray-700",
      )}
    >
      {children}
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed mt-3 flex gap-4">
      <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}
