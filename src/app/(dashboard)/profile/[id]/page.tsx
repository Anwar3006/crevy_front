"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth";
import { UserService } from "@/lib/services/user-service";
import { EditProfileForm } from "../_components/edit-profile-form";
import { ProfileHeader } from "../_components/profile-header";

export default function UserProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isOwnProfile = session?.user?.id === id;

  const {
    data: user,
    isLoading: isUserLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => UserService.getUserProfile(id as string),
    enabled: !!id,
  });

  if (isUserLoading) {
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
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile. This user may not exist or you lack
            permission.
          </AlertDescription>
        </Alert>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Main Content Grid */}
      <div className="max-w-3xl">
        <EditProfileForm user={user} readOnly={!isOwnProfile} />
      </div>
    </div>
  );
}
