"use client";

import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Reset link sent to your email");
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-none text-center p-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">
            Check your email
          </h2>
          <p className="text-muted-foreground mb-8 font-medium">
            We have sent a password reset link to your email address.
          </p>
          <Link
            href="/login"
            className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:underline"
          >
            Back to Login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-4">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-emerald-600 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <CardTitle className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            No worries, it happens. Enter your email and we&apos;ll send you a
            recovery link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-12 h-14 rounded-2xl border-border"
                  required
                />
              </div>
            </div>
            <Button
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
