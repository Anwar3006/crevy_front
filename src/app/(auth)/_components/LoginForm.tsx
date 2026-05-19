"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { signInSchema, type TSignInInput } from "@/types/user.types";

const LoginForm = ({ className, ...props }: React.ComponentProps<"form">) => {
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const form = useForm<zod.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: TSignInInput) => {
    setLoading(true);

    const signInMethod =
      loginType === "email"
        ? authClient.signIn.email
        : authClient.signIn.username;

    // For phone login, we treat the phone number as the username in BetterAuth
    const signInData =
      loginType === "email"
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password };

    await signInMethod({
      ...signInData,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Log in successful!");
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
    } as any);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Tabs
        defaultValue="email"
        onValueChange={(v) => setLoginType(v as "email" | "phone")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
            {...props}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center mb-2">
                <h1 className="text-xl font-bold tracking-tight">Login</h1>
                <p className="text-muted-foreground text-xs text-balance">
                  {loginType === "email"
                    ? "Enter your email address to access your account"
                    : "Enter your registered contact number to access your account"}
                </p>
              </div>

              <CustomInput
                type={loginType === "email" ? "email" : "text"}
                name="identifier"
                label={loginType === "email" ? "Email Address" : "Phone Number"}
                placeholder={
                  loginType === "email" ? "rebecca@gmail.com" : "+233..."
                }
                control={form.control}
                description={
                  loginType === "email"
                    ? "Use the email address you used to sign up"
                    : "Use your registered phone number"
                }
                disabled={loading}
              />

              <CustomInput
                type="password"
                name="password"
                label="Password"
                placeholder="***********"
                control={form.control}
                disabled={loading}
              />

              <Field>
                <Button
                  type="submit"
                  className="py-5 bg-[#2CC295] w-full text-white font-bold hover:bg-[#25a37d] transition-colors shadow-lg shadow-[#2CC295]/20"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Account"}
                </Button>
              </Field>

              <FieldSeparator className="text-xs text-gray-400">
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldDescription className="text-center text-xs">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="text-[#2CC295] font-semibold hover:underline"
                  >
                    Sign Up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default LoginForm;
