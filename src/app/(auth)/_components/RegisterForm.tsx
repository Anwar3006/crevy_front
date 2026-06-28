"use client";

import { ArrowRight, Loader2, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { axiosClient } from "@/lib/axiosClient";
import { cn } from "@/lib/utils";

type EntityType = "organization" | "project_owner";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [entityType, setEntityType] = useState<EntityType>("organization");
  const [loading, setLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgName: "", // For Organization
    taxResidence: "", // For Organization
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      return toast.error("Cryptographic mismatch. Passwords must align.");
    }
    if (formData.password.length < 8) {
      return toast.error("Security policy requires at least 8 characters.");
    }

    setLoading(true);

    try {
      // 1. Create Base User Auth Entity
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileCompleted: true,
      } as any);

      if (error) throw error;

      // 2. Hydrate Organization Database Tables.
      // NOTE: project_owner no longer self-registers here — they're routed
      // to /register-interest instead. See the early return below.
      await axiosClient.post("/auth/register/organization", {
        userId: data.user.id,
        orgName: formData.orgName,
        taxResidence: formData.taxResidence,
      });

      toast.success("Entity initialization complete. Welcome to the registry.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Initialization failed. Review system logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      {/* ── Entity Selection Tabs ── */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          type="button"
          onClick={() => setEntityType("organization")}
          className={cn(
            "flex-1 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
            entityType === "organization"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          Institutional Buyer
        </button>

        {/* Project Owner self-registration is routed through the waitlist —
            see /register-interest. We don't let project owners create an
            account directly here; a rep reaches out after reviewing their
            waitlist submission. */}
        <button
          type="button"
          onClick={() => setEntityType("project_owner")}
          className={cn(
            "flex-1 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
            entityType === "project_owner"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          Project Owner
        </button>
      </div>

      {entityType === "project_owner" ? (
        <div className="space-y-8 py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 border border-emerald-200">
            <Sprout className="w-5 h-5 text-emerald-700" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <p className="font-serif text-2xl text-slate-900 leading-snug">
              Project owner accounts aren't self-service.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Onboarding a project involves a short conversation with our team
              to align on methodology, verification requirements, and registry
              setup. Register your interest below and a representative will
              follow up by email or phone to get you started.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/register-interest")}
            className="w-full bg-emerald-700 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] py-6 transition-colors flex items-center justify-center gap-2"
          >
            Register Your Interest <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label
                htmlFor="firstName"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                First Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-serif text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label
                htmlFor="lastName"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-serif text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="email"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Work Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          {/* Security Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Verify Password
              </label>
              <input
                type="password"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Organization Fields */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Corporate Identity
            </p>

            <div className="space-y-3">
              <label
                htmlFor="orgName"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Registered Organization Name
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-serif text-sm text-slate-900 focus:ring-0 focus:border-slate-900 transition-colors"
                value={formData.orgName}
                onChange={(e) =>
                  setFormData({ ...formData, orgName: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label
                htmlFor="taxResidence"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              >
                Primary Tax Jurisdiction(Country of Operation)
              </label>
              <input
                type="text"
                placeholder="e.g. US, UK, GH"
                className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 uppercase focus:ring-0 focus:border-slate-900 transition-colors"
                value={formData.taxResidence}
                onChange={(e) =>
                  setFormData({ ...formData, taxResidence: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] py-6 mt-4 transition-colors flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Processing...
              </>
            ) : (
              "Initialize Entity Record"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
