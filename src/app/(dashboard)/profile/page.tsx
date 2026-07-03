"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth";
import { UserService } from "@/lib/services/user-service";
import { AccountSecurity } from "./_components/account-security";
import { ChangePasswordForm } from "./_components/change-password-form";
import { EditProfileForm } from "./_components/edit-profile-form";
import { ProfileHeader } from "./_components/profile-header";

export default function ProfilePage() {
  const {
    data: session,
    isPending: isSessionPending,
    error: sessionError,
  } = authClient.useSession();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      const response = await UserService.getUserProfile(
        session?.user?.id as string,
      );
      return response?.data || response;
    },
    enabled: !!session?.user?.id,
  });

  if (isSessionPending || isUserLoading) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10 space-y-12">
        <div className="border border-border p-12 bg-white flex items-center gap-8 animate-pulse">
          <div className="h-24 w-24 bg-slate-100" />
          <div className="space-y-4 flex-1">
            <div className="h-8 w-64 bg-slate-100" />
            <div className="h-4 w-48 bg-slate-100" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-96 bg-muted border border-border animate-pulse" />
          <div className="h-96 bg-muted border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (sessionError || !session?.user) {
    return (
      <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10">
        <Alert
          variant="destructive"
          className="rounded-none border-2 border-red-500 bg-red-50"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-mono text-xs uppercase tracking-widest ml-2">
            {sessionError?.message ||
              "System Error: Failed to retrieve entity profile. Connection refused."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-6 lg:px-10 space-y-12 animate-in fade-in duration-700 font-sans">
      <ProfileHeader user={user} />
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7 space-y-12">
          <EditProfileForm user={user} />
        </div>
        <div className="md:col-span-5 space-y-12">
          <ChangePasswordForm />
          <AccountSecurity user={user} />
        </div>
      </div>
    </div>
  );
}
