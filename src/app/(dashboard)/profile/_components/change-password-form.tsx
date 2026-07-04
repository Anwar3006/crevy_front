"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "Min 8 chars"),
    confirmPassword: z.string().min(8, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hashes mismatch",
    path: ["confirmPassword"],
  });

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });
      if (error) throw error;
      toast.success("Cryptographic access key updated.");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to update access key.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-border bg-white">
      <div className="p-6 border-b border-border bg-muted flex items-center gap-4">
        <Lock className="w-5 h-5 text-muted-foreground" />
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
            Access Credentials
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Manage cryptographic keys
          </p>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Active Cipher Key
          </Label>
          <Input
            type="password"
            {...form.register("currentPassword")}
            className="rounded-none border-0 border-b-2 border-border bg-muted px-4 py-6 font-mono text-sm focus-visible:ring-0 focus-visible:border-slate-900"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            New Cipher Key
          </Label>
          <Input
            type="password"
            {...form.register("newPassword")}
            className="rounded-none border-0 border-b-2 border-border bg-muted px-4 py-6 font-mono text-sm focus-visible:ring-0 focus-visible:border-slate-900"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Verify New Cipher Key
          </Label>
          <Input
            type="password"
            {...form.register("confirmPassword")}
            className="rounded-none border-0 border-b-2 border-border bg-muted px-4 py-6 font-mono text-sm focus-visible:ring-0 focus-visible:border-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-none bg-secondary hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] h-12 transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}{" "}
          Submit Key Rotation
        </Button>
      </form>
    </div>
  );
}
