"use client";

import { Globe, Key, Loader2, Phone, ShieldCheck, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { axiosClient } from "@/lib/axiosClient";
import { cn } from "@/lib/utils";

function AdminSetupTerminal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [assignedEmail, setAssignedEmail] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    countryOfOperation: "",
    password: "",
    confirmPassword: "",
  });

  // Verify the token and fetch the email BEFORE allowing password setup
  useEffect(() => {
    if (!token) {
      toast.error("Missing provisioning token.");
      setVerifying(false);
      return;
    }

    axiosClient
      .get(`/auth/invite/verify/${token}`)
      .then((res) => setAssignedEmail(res.data.data.email))
      .catch(() => toast.error("Invalid or expired provisioning token."))
      .finally(() => setVerifying(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedEmail) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Cryptographic mismatch. Passwords must align.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Security policy requires at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user identity via better-auth
      const { data: signUpData, error: signUpError } =
        await authClient.signUp.email({
          email: assignedEmail,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileCompleted: true,
          countryOfOperation: formData.countryOfOperation || undefined,
        } as any);

      if (signUpError || !signUpData?.user) {
        throw new Error(signUpError?.message || "Identity anchor failed.");
      }

      const userId = signUpData.user.id;

      // 2. Provision institutional access (Complete invitation)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/register/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.message || "Institutional provisioning failed.",
        );
      }

      toast.success("Credential anchored. Terminal access granted.");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("[AdminSetupTerminal] Error:", error);
      toast.error(
        error.message || "A systemic error occurred during provisioning.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-border border-t-slate-900 rounded-none animate-spin" />
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Verifying Identity Token...
        </p>
      </div>
    );
  }

  if (!assignedEmail) {
    return (
      <div className="max-w-md w-full border border-rose-200 bg-white p-8 text-center">
        <ShieldCheck className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-2xl font-sans text-foreground mb-2">
          Access Denied.
        </h2>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8">
          Token invalid or expired.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="bg-secondary text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors w-full"
        >
          Return to Authenticator
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full border border-slate-900 bg-white shadow-2xl rounded-none overflow-hidden my-12">
      {/* Terminal Header */}
      <div className="bg-secondary p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={20} className="text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Governance Provisioning
          </span>
        </div>
        <h2 className="text-3xl font-sans tracking-tight leading-none mb-2">
          Anchor Credential.
        </h2>
        <p className="text-muted-foreground font-light text-sm">
          Initialize your administrative access key and identity.
        </p>
      </div>

      <div className="p-8 bg-muted border-b border-border">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Assigned Identity
        </p>
        <p className="font-mono text-sm font-bold text-foreground tracking-widest">
          {assignedEmail}
        </p>
      </div>

      {/* Terminal Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label
              htmlFor="firstName"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-3">
            <label
              htmlFor="lastName"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label
              htmlFor="contactNumber"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
                placeholder="+1..."
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-3">
            <label
              htmlFor="countryOfOperation"
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
                placeholder="United Kingdom"
                value={formData.countryOfOperation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    countryOfOperation: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="password"
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
          >
            Cryptographic Key (Password)
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="confirmPassword"
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
          >
            Verify Key
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-4 bg-muted border-0 border-b-2 border-border font-mono text-sm text-foreground focus:ring-0 focus:border-slate-900 transition-colors rounded-none placeholder:text-slate-300"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-secondary hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-[10px] py-6 transition-colors flex items-center justify-center gap-2 mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" /> Anchoring...
            </>
          ) : (
            "Initialize Terminal Access"
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 selection:bg-secondary selection:text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-border border-t-slate-900 rounded-none animate-spin" />
          </div>
        }
      >
        <AdminSetupTerminal />
      </Suspense>
    </div>
  );
}
