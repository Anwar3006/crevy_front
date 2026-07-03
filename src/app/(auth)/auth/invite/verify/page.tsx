"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function InviteVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Redirect to the actual setup page with the token
      router.replace(`/admins/setup-account?token=${token}`);
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
          Verifying Invitation...
        </p>
      </div>
    </div>
  );
}

export default function InviteVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <InviteVerifyContent />
    </Suspense>
  );
}
