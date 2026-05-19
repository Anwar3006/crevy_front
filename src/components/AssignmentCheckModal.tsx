"use client";

import { ArrowRight, HelpCircle, ShieldAlert, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TRole } from "@/types/user.types";

interface AssignmentCheckModalProps {
  isOpen: boolean;
  role?: TRole;
  onProceed: () => void;
}

/**
 * AssignmentCheckModal
 *
 * A premium soft-gate modal for Admin/Manager roles to ensure they have onboarded
 * a Project Owner before registering a project. Project Owners bypass this check.
 */
export function AssignmentCheckModal({
  isOpen,
  role,
  onProceed,
}: AssignmentCheckModalProps) {
  const router = useRouter();

  React.useEffect(() => {
    // Only auto-proceed if the role is explicitly "project_owner".
    if (role === "project_owner" && isOpen) {
      onProceed();
    }
  }, [role, isOpen, onProceed]);

  // Wait for the session role to load before rendering anything.
  if (!role) return null;

  // Project owners bypass this check modal completely.
  if (role === "project_owner") return null;

  const handleOnboardRedirect = () => {
    router.push("/project-owners/register");
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl border border-emerald-100 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8"
      >
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm animate-pulse">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Project Owner Verification
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Before registering a new project, please ensure the associated
              Project Owner profile has been onboarded onto the Crevy platform.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Demo Guideline
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All sensors, carbon credits, and financials require a valid
              Project Owner assignment to enable automated dMRV monitoring.
            </p>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onProceed}
            className="w-full py-6 rounded-2xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-bold text-sm tracking-tight order-last sm:order-first transition-all"
          >
            Yes, Owner is Registered
          </Button>
          <Button
            type="button"
            onClick={handleOnboardRedirect}
            className="w-full py-6 rounded-2xl bg-[#2CC295] hover:bg-[#25a37d] text-white font-extrabold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2CC295]/20 hover:shadow-[#2CC295]/30 hover:scale-[1.01]"
          >
            No, Onboard Owner First
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
