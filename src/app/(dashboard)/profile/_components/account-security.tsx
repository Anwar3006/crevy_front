"use client";

import { AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth";
import { UserService } from "@/lib/services/user-service";

interface AccountSecurityProps {
  user: any;
}

export function AccountSecurity({ user }: AccountSecurityProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await UserService.deleteUserProfile(user.id);
      await authClient.signOut();
      toast.success("Account deleted successfully");
      router.push("/register");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-100 shadow-sm border">
      <CardHeader className="border-b bg-red-50/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-red-900">
              Advanced Settings
            </CardTitle>
            <CardDescription className="text-red-700/70">
              Critical account actions and safety settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg h-fit">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-slate-500">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 pointer-events-none opacity-50"
            >
              Coming Soon
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/20">
            <div className="flex gap-4">
              <div className="p-2 bg-red-100 rounded-lg h-fit">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-950">Delete Account</p>
                <p className="text-sm text-red-700/70">
                  Permanently remove your account and all associated data.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
