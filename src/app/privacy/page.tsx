"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Cookie,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  Shield,
  Trash2,
  UserCheck,
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

// ─── POLICY SECTIONS DATA ────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "data-collected", label: "Data We Collect", icon: Database },
  { id: "how-we-use", label: "How We Use Data", icon: Eye },
  { id: "legal-basis", label: "Legal Basis", icon: UserCheck },
  { id: "data-sharing", label: "Data Sharing", icon: Globe },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "your-rights", label: "Your Rights", icon: Lock },
  { id: "data-retention", label: "Data Retention", icon: Trash2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "children", label: "Children's Privacy", icon: Bell },
  { id: "changes", label: "Policy Changes", icon: Bell },
  { id: "contact", label: "Contact Us", icon: Mail },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className={cn(syne.variable, "font-sans selection:bg-myGreen/30")}>
      <PublicNavbar />
      <main>
        <PrivacyHero />
        <PrivacyContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </main>
      <PublicFooter />
    </div>
  );
}

function PrivacyHero() {
  return (
    <section className="bg-myBlue pt-32 pb-16 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(44,194,149,0.08) 0%, transparent 60%)",
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
            <Shield size={14} className="text-myGreen" />
            <span className="text-myGreen text-xs font-bold tracking-[0.2em] uppercase">
              Legal · GDPR Compliant · Ghana Data Protection Act
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-syne)] font-extrabold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl">
            Foovante Global Ltd (&quot;Crevy&quot;, &quot;we&quot;,
            &quot;us&quot;, &quot;our&quot;) is committed to protecting and
            respecting your privacy. This policy explains how we collect, use,
            store, and protect personal data when you use the Crevy platform.
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
              <span className="text-white font-medium">Governing Law:</span>{" "}
              Republic of Ghana & GDPR
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PrivacyContent({
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
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Contents
              </p>
              <nav className="space-y-1" aria-label="Privacy policy sections">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                        activeSection === section.id
                          ? "bg-myGreen/10 text-myGreen"
                          : "text-gray-500 hover:text-myBlue hover:bg-gray-50",
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
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
                  Privacy Questions?
                </h4>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Contact our Data Protection Officer for any privacy-related
                  enquiries.
                </p>
                <a
                  href="mailto:privacy@foovante-global.com"
                  className="text-myGreen text-xs font-bold hover:underline"
                >
                  privacy@foovante-global.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-lg max-w-none space-y-16">
              {/* 1. Overview */}
              <PolicySection
                id="overview"
                title="1. Overview & Data Controller"
              >
                <p>
                  This Privacy Policy applies to all users of the Crevy
                  platform, accessible at{" "}
                  <Link
                    href="https://crevy.app"
                    className="text-myGreen hover:underline"
                  >
                    crevy.app
                  </Link>{" "}
                  and operated by:
                </p>
                <InfoBox>
                  <strong>Foovante Global Ltd</strong>
                  <br />
                  Accra, Greater Accra, Ghana
                  <br />
                  Email: info@foovante-global.com
                  <br />
                  Phone: +(233) 504-609989
                  <br />
                  Company Registration No.: [GH-REG-XXXXXX]
                </InfoBox>
                <p>
                  Foovante Global Ltd is the <strong>Data Controller</strong>{" "}
                  for personal data processed through the Crevy platform. We are
                  committed to compliance with the{" "}
                  <strong>Ghana Data Protection Act 2012 (Act 843)</strong>, the{" "}
                  <strong>EU General Data Protection Regulation (GDPR)</strong>{" "}
                  where applicable, and other applicable data protection laws.
                </p>
                <p>
                  By registering for or using the Crevy platform, you
                  acknowledge that you have read and understood this Privacy
                  Policy and consent to the processing of your personal data as
                  described herein.
                </p>
              </PolicySection>

              {/* 2. Data Collected */}
              <PolicySection
                id="data-collected"
                title="2. Personal Data We Collect"
              >
                <p>
                  We collect personal data when you interact with our platform
                  in the following categories:
                </p>

                <DataCategory
                  title="Account & Identity Data"
                  items={[
                    "Full name, email address, phone number",
                    "Organisation name and registration number (for corporate accounts)",
                    "Country of residence and billing address",
                    "Password (stored in hashed form — never in plaintext)",
                    "Profile photograph (optional)",
                  ]}
                />

                <DataCategory
                  title="Project Data (Project Owners)"
                  items={[
                    "Project name, location (GPS coordinates and region), and land area",
                    "Project type (e.g. reforestation, regenerative agriculture)",
                    "Supporting documents (land title, farmer registration, audit reports)",
                    "Bank account details for credit payment disbursements",
                    "Carbon sequestration data, soil samples, and monitoring data",
                  ]}
                />

                <DataCategory
                  title="Transaction & Financial Data"
                  items={[
                    "Carbon credit purchase and sale records",
                    "Invoice and payment history",
                    "Payment method details (processed and encrypted by our payment processor — we do not store raw card numbers)",
                    "Wallet addresses (for any blockchain-based credit tokenisation features)",
                  ]}
                />

                <DataCategory
                  title="Usage & Technical Data"
                  items={[
                    "IP address, browser type, device type and operating system",
                    "Pages visited, features used, session duration, and click events",
                    "Search queries and filter preferences on the Marketplace",
                    "Error logs and crash reports for platform stability",
                  ]}
                />

                <DataCategory
                  title="Communications Data"
                  items={[
                    "Emails, chat messages, and support tickets sent to our team",
                    "Survey responses and feedback submissions",
                    "Marketing preferences and email engagement data",
                  ]}
                />
              </PolicySection>

              {/* 3. How We Use Data */}
              <PolicySection id="how-we-use" title="3. How We Use Your Data">
                <p>We use personal data for the following purposes:</p>
                <ul className="space-y-3">
                  {[
                    "To register and manage your Crevy account",
                    "To facilitate carbon credit verification, listing, and transactions on the Marketplace",
                    "To process payments and disbursements to project owners",
                    "To send you transactional emails (registration confirmations, payment receipts, project status updates)",
                    "To send marketing communications where you have opted in (you may opt out at any time)",
                    "To provide customer support and respond to your enquiries",
                    "To improve platform performance, detect bugs, and optimise the user experience",
                    "To generate anonymised analytics and climate impact reports",
                    "To comply with our legal and regulatory obligations, including anti-money laundering (AML) and Know Your Customer (KYC) requirements",
                    "To detect, prevent, and investigate fraud or misuse of our platform",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-myGreen shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </PolicySection>

              {/* 4. Legal Basis */}
              <PolicySection
                id="legal-basis"
                title="4. Legal Basis for Processing (GDPR)"
              >
                <p>
                  For users in the European Economic Area (EEA) and where GDPR
                  applies, we process personal data under the following legal
                  bases:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      basis: "Contractual Necessity (Art. 6(1)(b))",
                      desc: "Processing necessary to perform our contract with you — including account registration, project verification, credit transactions, and payment processing.",
                    },
                    {
                      basis: "Legitimate Interests (Art. 6(1)(f))",
                      desc: "Processing necessary for our legitimate business interests, including fraud prevention, platform security, product analytics, and improving our services.",
                    },
                    {
                      basis: "Legal Obligation (Art. 6(1)(c))",
                      desc: "Processing required to comply with applicable law, including AML regulations, tax obligations, and responding to lawful requests by public authorities.",
                    },
                    {
                      basis: "Consent (Art. 6(1)(a))",
                      desc: "Where you have freely given consent — for example, to receive marketing communications or to process non-essential cookies. You may withdraw consent at any time.",
                    },
                  ].map((item) => (
                    <div
                      key={item.basis}
                      className="border-l-4 border-myGreen pl-6 py-2"
                    >
                      <h4 className="font-semibold text-myBlue mb-1">
                        {item.basis}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  For users in Ghana, processing is governed by the{" "}
                  <strong>Data Protection Act 2012 (Act 843)</strong>, and we
                  are registered with the Data Protection Commission of Ghana
                  (DPC).
                </p>
              </PolicySection>

              {/* 5. Data Sharing */}
              <PolicySection
                id="data-sharing"
                title="5. Data Sharing & Third Parties"
              >
                <p>
                  We do not sell your personal data. We may share your data with
                  trusted third parties only in the circumstances described
                  below:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      party: "Carbon Verification Auditors",
                      desc: "Certified third-party auditors who verify project data. They receive project-level data (not personal account data) under strict confidentiality agreements.",
                    },
                    {
                      party: "Payment Processors",
                      desc: "Secure payment platforms (e.g. Paystack, Stripe) that process transactions on our behalf. These processors are PCI-DSS compliant and bound by their own privacy policies.",
                    },
                    {
                      party: "Cloud Infrastructure Providers",
                      desc: "We use reputable cloud providers (e.g. AWS, Vercel) to host and operate the platform. Data may be processed in data centres within the EU, US, or Africa with appropriate safeguards.",
                    },
                    {
                      party: "Analytics & Monitoring Services",
                      desc: "We may use analytics tools to understand platform usage. These receive anonymised or pseudonymised data and are contractually prohibited from using your data for their own purposes.",
                    },
                    {
                      party: "Legal & Regulatory Authorities",
                      desc: "Where required by law, court order, or at the request of government bodies — we may disclose data to law enforcement, tax authorities, or regulators.",
                    },
                    {
                      party: "Business Transfers",
                      desc: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity, subject to the same privacy protections.",
                    },
                  ].map((item) => (
                    <div key={item.party} className="bg-gray-50 rounded-xl p-5">
                      <h4 className="font-semibold text-myBlue mb-1 text-sm">
                        {item.party}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </PolicySection>

              {/* 6. Cookies */}
              <PolicySection
                id="cookies"
                title="6. Cookies & Tracking Technologies"
              >
                <p>
                  We use cookies and similar technologies to operate and improve
                  the Crevy platform. By using our platform, you consent to our
                  use of cookies in accordance with this policy.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 pr-4 font-bold text-myBlue">
                          Type
                        </th>
                        <th className="py-3 pr-4 font-bold text-myBlue">
                          Purpose
                        </th>
                        <th className="py-3 font-bold text-myBlue">
                          Consent Required
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        {
                          type: "Essential",
                          purpose:
                            "Login sessions, security tokens, CSRF protection",
                          consent: "No",
                        },
                        {
                          type: "Functional",
                          purpose: "User preferences, language settings, theme",
                          consent: "No",
                        },
                        {
                          type: "Analytics",
                          purpose:
                            "Anonymous usage data to improve the platform",
                          consent: "Yes",
                        },
                        {
                          type: "Marketing",
                          purpose:
                            "Personalised content and advertising (if applicable)",
                          consent: "Yes",
                        },
                      ].map((row) => (
                        <tr key={row.type}>
                          <td className="py-3 pr-4 font-medium text-gray-800">
                            {row.type}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {row.purpose}
                          </td>
                          <td
                            className={cn(
                              "py-3 font-bold text-sm",
                              row.consent === "Yes"
                                ? "text-amber-600"
                                : "text-myGreen",
                            )}
                          >
                            {row.consent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  You can manage your cookie preferences at any time through
                  your browser settings or our in-platform cookie preference
                  centre. Note that disabling essential cookies may affect
                  platform functionality.
                </p>
              </PolicySection>

              {/* 7. Your Rights */}
              <PolicySection id="your-rights" title="7. Your Data Rights">
                <p>
                  Depending on your jurisdiction, you have the following rights
                  regarding your personal data:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      right: "Right of Access",
                      desc: "Request a copy of all personal data we hold about you.",
                    },
                    {
                      right: "Right to Rectification",
                      desc: "Request correction of inaccurate or incomplete data.",
                    },
                    {
                      right: "Right to Erasure",
                      desc: "Request deletion of your data ('right to be forgotten'), subject to legal obligations.",
                    },
                    {
                      right: "Right to Restrict Processing",
                      desc: "Request that we limit how we use your data in certain circumstances.",
                    },
                    {
                      right: "Right to Data Portability",
                      desc: "Receive your data in a structured, machine-readable format.",
                    },
                    {
                      right: "Right to Object",
                      desc: "Object to processing based on legitimate interests or for direct marketing.",
                    },
                    {
                      right: "Right to Withdraw Consent",
                      desc: "Withdraw consent at any time where processing is consent-based.",
                    },
                    {
                      right: "Right to Lodge a Complaint",
                      desc: "Complain to the Ghana Data Protection Commission or relevant supervisory authority.",
                    },
                  ].map((item) => (
                    <div
                      key={item.right}
                      className="bg-myGreen/5 border border-myGreen/10 rounded-xl p-5"
                    >
                      <h4 className="font-[family-name:var(--font-syne)] font-bold text-myBlue text-sm mb-1">
                        {item.right}
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <InfoBox>
                  To exercise any of these rights, please email{" "}
                  <a
                    href="mailto:privacy@foovante-global.com"
                    className="text-myGreen font-semibold hover:underline"
                  >
                    privacy@foovante-global.com
                  </a>
                  . We will respond within <strong>30 days</strong>. You may be
                  required to verify your identity before we can action your
                  request.
                </InfoBox>
              </PolicySection>

              {/* 8. Data Retention */}
              <PolicySection id="data-retention" title="8. Data Retention">
                <p>
                  We retain personal data for as long as necessary to fulfil the
                  purposes described in this policy and to comply with our legal
                  obligations:
                </p>
                <ul className="space-y-3">
                  {[
                    "Account data: Retained for the duration of your account and up to 7 years after account closure (for legal and audit purposes).",
                    "Project and transaction data: Retained for a minimum of 10 years to support carbon credit integrity and regulatory compliance.",
                    "Communication records: Retained for up to 3 years from the date of communication.",
                    "Usage and analytics data: Anonymised and retained indefinitely; identifiable usage logs are deleted after 12 months.",
                    "Marketing data: Retained until you withdraw consent or unsubscribe.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-myGreen shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </PolicySection>

              {/* 9. Security */}
              <PolicySection id="security" title="9. Data Security">
                <p>
                  We implement industry-standard technical and organisational
                  measures to protect your personal data against unauthorised
                  access, disclosure, alteration, or destruction. These include:
                </p>
                <ul className="space-y-2">
                  {[
                    "TLS/HTTPS encryption for all data in transit",
                    "AES-256 encryption for sensitive data at rest",
                    "Password hashing using bcrypt with per-user salts",
                    "Regular security audits and penetration testing",
                    "Role-based access controls limiting internal data access",
                    "Multi-factor authentication (MFA) available for all accounts",
                    "Incident response plan with breach notification procedures compliant with Act 843",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-myGreen shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  In the event of a data breach that is likely to result in a
                  high risk to your rights, we will notify you and the relevant
                  supervisory authority within <strong>72 hours</strong> where
                  required by law.
                </p>
              </PolicySection>

              {/* 10. Children */}
              <PolicySection id="children" title="10. Children's Privacy">
                <p>
                  The Crevy platform is intended for use by individuals aged{" "}
                  <strong>18 and over</strong>. We do not knowingly collect
                  personal data from children under 18. If you believe a minor
                  has provided us with personal data, please contact us at{" "}
                  <a
                    href="mailto:privacy@foovante-global.com"
                    className="text-myGreen hover:underline"
                  >
                    privacy@foovante-global.com
                  </a>{" "}
                  and we will promptly delete such data.
                </p>
              </PolicySection>

              {/* 11. Changes */}
              <PolicySection id="changes" title="11. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, technology, legal requirements, or
                  other factors. When we make material changes, we will:
                </p>
                <ul className="space-y-2">
                  {[
                    "Update the 'Last Updated' date at the top of this policy",
                    "Send an email notification to all registered users",
                    "Display a prominent notice on the Crevy platform for at least 14 days",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm"
                    >
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-myGreen shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Your continued use of the platform after any changes
                  constitutes your acceptance of the revised policy. If you do
                  not agree to the updated policy, please discontinue use of the
                  platform and contact us to request account deletion.
                </p>
              </PolicySection>

              {/* 12. Contact */}
              <PolicySection
                id="contact"
                title="12. Contact & Supervisory Authority"
              >
                <p>
                  For all privacy-related enquiries, requests, or complaints,
                  please contact our Data Protection Officer:
                </p>
                <InfoBox>
                  <strong>Data Protection Officer</strong>
                  <br />
                  Foovante Global Ltd
                  <br />
                  Accra, Greater Accra, Ghana
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:privacy@foovante-global.com"
                    className="text-myGreen hover:underline"
                  >
                    privacy@foovante-global.com
                  </a>
                  <br />
                  Phone: +(233) 504-609989
                </InfoBox>
                <p className="text-sm text-gray-600 mt-4">
                  If you are not satisfied with our response, you have the right
                  to lodge a complaint with:
                </p>
                <ul className="space-y-2 mt-2">
                  <li className="text-sm text-gray-700">
                    <strong>Ghana:</strong> Data Protection Commission of Ghana
                    (DPC) —{" "}
                    <a
                      href="https://www.dataprotection.org.gh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-myGreen hover:underline"
                    >
                      www.dataprotection.org.gh
                    </a>
                  </li>
                  <li className="text-sm text-gray-700">
                    <strong>EU/EEA:</strong> Your local data protection
                    supervisory authority (e.g. ICO in the UK, CNIL in France)
                  </li>
                </ul>
              </PolicySection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function PolicySection({
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
        <div className="h-[3px] w-10 bg-myGreen rounded-full" />
        <h2 className="font-[family-name:var(--font-syne)] font-bold text-2xl md:text-3xl text-myBlue">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
    </motion.div>
  );
}

function DataCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 mt-4">
      <h4 className="font-[family-name:var(--font-syne)] font-bold text-myBlue mb-3 text-sm uppercase tracking-wide">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-myGreen shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-myBlue/5 border border-myBlue/10 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed mt-4">
      {children}
    </div>
  );
}
