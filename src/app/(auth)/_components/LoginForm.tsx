"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type * as zod from "zod";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { signInSchema, type TSignInInput } from "@/types/user.types";

const LoginForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const form = useForm<zod.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: TSignInInput) => {
    setLoading(true);

    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Log in successful!");

          // ─── IMPORTANT ─────────────────────────────────────────────────
          // router.refresh() MUST come before router.push().
          //
          // refresh() tells Next.js to invalidate its server-component cache
          // so that when DashboardLayout renders it calls getServerSession
          // fresh — not a stale cached version that still has no session.
          //
          // If push() fires first, the dashboard layout runs immediately
          // against the un-refreshed cache, finds no session, and redirects
          // back to /login before refresh() even has a chance to run.
          // ────────────────────────────────────────────────────────────────
          router.refresh();
          router.push("/dashboard");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login failed!");
          form.setError("root", { message: ctx.error.message });
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login</h1>

            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to log in to your account
            </p>
          </div>

          {/* Email */}
          <CustomInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="rebecca@gmail.com"
            control={form.control}
            description="Use the email address you used to sign up"
            disabled={false}
            readOnly={false}
          />

          {/* Password */}
          <CustomInput
            type="password"
            name="password"
            label="Password"
            placeholder="***********"
            control={form.control}
            disabled={false}
            readOnly={false}
          />

          <Field>
            <Button
              type="submit"
              className="py-5 bg-[#2CC295]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Account"}
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-emerald-600">
                Sign Up
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default LoginForm;
