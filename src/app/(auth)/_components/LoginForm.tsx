"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as zod from "zod";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { signInSchema, type TSignInInput } from "@/types/user.types";

const LoginForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<zod.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSubmit = async (data: TSignInInput) => {
    setLoading(true);

    const signInMethod = authClient.signIn.email; // Fallback to email for both in better-auth unless configured otherwise

    const signInData =
      loginType === "email"
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password };

    await signInMethod({
      ...signInData,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Cryptographic handshake successful.");
          router.refresh();
          router.push("/dashboard");
        },
        onError: (ctx: any) => {
          toast.error("Protocol Error", {
            description: ctx.error.message || "Invalid credentials.",
          });
          form.setError("root", { message: ctx.error.message });
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    } as any);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* ── Institutional Toggle ── */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setLoginType("email")}
          className={cn(
            "flex-1 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2",
            loginType === "email"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "border-b-2 border-transparent text-slate-400 hover:text-slate-700",
          )}
        >
          <Mail size={14} /> Email Identity
        </button>
        <button
          type="button"
          onClick={() => setLoginType("phone")}
          className={cn(
            "flex-1 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2",
            loginType === "phone"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "border-b-2 border-transparent text-slate-400 hover:text-slate-700",
          )}
        >
          <Phone size={14} /> Mobile Vector
        </button>
      </div>

      {/* ── Form Payload ── */}
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
        {...props}
      >
        {/* Identifier Input */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
            {loginType === "email" ? "Email Address" : "Phone Number"}
            {form.formState.errors.identifier && (
              <span className="text-red-500">
                {form.formState.errors.identifier.message}
              </span>
            )}
          </div>
          <input
            {...form.register("identifier")}
            type={loginType === "email" ? "email" : "text"}
            placeholder={
              loginType === "email" ? "operative@institution.com" : "+233 50..."
            }
            disabled={loading}
            className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-slate-900 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <label
              htmlFor="password"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Access Cipher
            </label>
            <Link
              href="/forgot-password"
              className="text-[9px] font-mono text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Reset Cipher?
            </Link>
          </div>
          <input
            {...form.register("password")}
            type="password"
            placeholder="••••••••••••"
            disabled={loading}
            className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 p-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-slate-900 transition-colors disabled:opacity-50"
          />
          {form.formState.errors.password && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-2">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-none bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] py-5 hover:bg-emerald-900 transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Authenticating...
            </>
          ) : (
            "Grant Access"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
