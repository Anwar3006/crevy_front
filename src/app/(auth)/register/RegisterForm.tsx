"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { axiosClient } from "@/lib/axiosClient";
import { cn } from "@/lib/utils";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgName: "",
    registrationId: "",
    taxResidence: "",
  });

  // Verify invite token on mount
  useEffect(() => {
    if (token) {
      setLoading(true);
      axiosClient
        .get(`/auth/invite/verify/${token}`)
        .then((res) => {
          setFormData((prev) => ({ ...prev, email: res.data.data.email }));
        })
        .catch(() => toast.error("Invalid or expired invitation link"))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileCompleted: true,
      } as any);

      if (error) throw error;

      if (token) {
        await axiosClient.post("/auth/register/invite", {
          userId: data.user.id,
          token,
        });
      } else {
        await axiosClient.post("/auth/register/organization", {
          userId: data.user.id,
          orgName: formData.orgName,
          registrationId: formData.registrationId,
          taxResidence: formData.taxResidence,
        });
      }

      toast.success("Registration successful! Welcome to Crevy.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* Form Header */}
        <div className="flex flex-col items-center gap-1 text-center mb-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {token ? "Join your team" : "Create your account"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {token
              ? "Complete your profile to accept the invitation and access the platform."
              : "Fill in the form below to set up your corporate offsetting workspace."}
          </p>
        </div>

        {/* Personal Fields Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
              disabled={loading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
              disabled={loading}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Work Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={!!token || loading}
          />
          {token && (
            <FieldDescription>
              Your email is locked to this invitation.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            disabled={loading}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Field>

        {/* Organization Fields (Only render if NOT an invite token) */}
        {!token && (
          <>
            <FieldSeparator>Company Information</FieldSeparator>

            <Field>
              <FieldLabel htmlFor="orgName">Organization Name</FieldLabel>
              <Input
                id="orgName"
                type="text"
                value={formData.orgName}
                onChange={(e) =>
                  setFormData({ ...formData, orgName: e.target.value })
                }
                required
                disabled={loading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="taxResidence">Tax Residence</FieldLabel>
              <Input
                id="taxResidence"
                type="text"
                placeholder="e.g. US, UK, GH"
                value={formData.taxResidence}
                onChange={(e) =>
                  setFormData({ ...formData, taxResidence: e.target.value })
                }
                disabled={loading}
              />
              <FieldDescription>
                Optional. Used for generating your compliance reports.
              </FieldDescription>
            </Field>
          </>
        )}

        {/* Submit Action */}
        <Field className="mt-4">
          <Button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {token ? "Verifying..." : "Creating Account..."}
              </>
            ) : token ? (
              "Accept Invitation"
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        {/* Footer Link */}
        <FieldDescription className="text-center pt-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-700 hover:underline font-medium"
          >
            Sign in
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
