"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    queryFn: () => UserService.getUserProfile(session?.user?.id as string),
    enabled: !!session?.user?.id,
  });

  if (isSessionPending || isUserLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (sessionError || !session?.user) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {sessionError?.message ||
              "Failed to load profile. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <EditProfileForm user={user} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ChangePasswordForm />
        </div>
      </div>

      {/* Full Width Security Section */}
      <AccountSecurity user={user} />
    </div>
  );
}
