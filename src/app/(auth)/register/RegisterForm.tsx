"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";
import { axiosClient } from "@/lib/axiosClient";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    orgName: "",
    registrationId: "",
    taxResidence: "",
  });

  useEffect(() => {
    if (token) {
      setLoading(true);
      axiosClient
        .get(`/auth/invite/verify/${token}`)
        .then((res) => {
          setFormData((prev) => ({ ...prev, email: res.data.data.email }));
        })
        .catch(() => toast.error("Invalid or expired invitation"))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up via BetterAuth
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        // Adjusting based on standard schema: BetterAuth often requires these in root
        // for configured additional fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileCompleted: true,
      } as any);

      if (error) throw error;

      // 2. Register Org or finalize invitation
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

      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {token ? "Join Organization" : "Create Organization"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <Input
              placeholder="Last Name"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>
          <Input
            type="email"
            value={formData.email}
            disabled={!!token}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {!token && (
            <>
              <Input
                placeholder="Organization Name"
                onChange={(e) =>
                  setFormData({ ...formData, orgName: e.target.value })
                }
                required
              />
              <Input
                placeholder="Registration ID (Optional)"
                onChange={(e) =>
                  setFormData({ ...formData, registrationId: e.target.value })
                }
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : token ? "Join" : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
