"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Loader2,
  Search,
  ShieldAlert,
  UserSquare,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectOwnerService } from "@/lib/services/project-owner-service";
import { UserService } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";
import type { TRole } from "@/types/user.types";

interface AssignmentCheckModalProps {
  isOpen: boolean;
  role?: TRole;
  onProceed: (projectOwnerId: string, assignedAdminId?: string) => void;
  onClose?: () => void; // Optional: If not provided, closing aborts to dashboard
}

export function AssignmentCheckModal({
  isOpen,
  role,
  onProceed,
  onClose,
}: AssignmentCheckModalProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [search, setSearch] = React.useState("");
  const [selectedOwnerId, setSelectedOwnerId] = React.useState<string>("");
  const [selectedAdminId, setSelectedAdminId] = React.useState<string>("");

  const [isOwnerPopoverOpen, setIsOwnerPopoverOpen] = React.useState(false);
  const [isAdminPopoverOpen, setIsAdminPopoverOpen] = React.useState(false);

  // 1. Fetch Project Owners (Paginated + Searchable)
  const {
    data: ownerData,
    fetchNextPage: fetchNextOwners,
    hasNextPage: hasMoreOwners,
    isFetchingNextPage: isFetchingMoreOwners,
    isLoading: isLoadingOwners,
  } = useInfiniteQuery({
    queryKey: ["project-owners-dropdown", search, selectedAdminId],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      ProjectOwnerService.listProjectOwners({
        search,
        agentId: role === "super_admin" ? undefined : selectedAdminId,
        cursor: pageParam,
        limit: 20,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isOpen && step === 2,
  });

  const owners = ownerData?.pages.flatMap((page: any) => page.data) ?? [];

  // 2. Fetch Admins (Only for Super Admin)
  const { data: adminData } = useQuery({
    queryKey: ["admins-dropdown"],
    queryFn: () => UserService.listUsers({ role: "project_manager" }),
    enabled: isOpen && step === 2 && role === "super_admin",
  });

  const admins = (adminData as any)?.data ?? [];

  console.log("Selected AdminId: ", selectedAdminId);

  React.useEffect(() => {
    // Project Owners bypass this gate completely.
    if (role === "project_owner" && isOpen) {
      onProceed("");
    }
  }, [role, isOpen, onProceed]);

  if (!role || role === "project_owner") return null;

  const handleOnboardRedirect = () => {
    router.push("/project-owners/register");
  };

  const handleFinalProceed = () => {
    if (!selectedOwnerId) return;
    onProceed(selectedOwnerId, selectedAdminId || undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the user clicks outside or hits Escape, safely abort.
      if (onClose) onClose();
      else router.push("/dashboard");
    }
  };

  const selectedOwner = Array.isArray(owners)
    ? owners.find((o: any) => o.id === selectedOwnerId)
    : null;
  const selectedAdmin = Array.isArray(admins)
    ? admins.find((a: any) => a.id === selectedAdminId)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl border-2 border-slate-900 bg-white rounded-none shadow-none p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-4 mb-6">
                <div className="w-12 h-12 border border-slate-900 bg-slate-50 flex items-center justify-center text-slate-900">
                  <Users className="w-6 h-6" />
                </div>

                <div className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    Originator Verification
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 text-sm font-light leading-relaxed">
                    Prior to initializing a new asset ledger, ensure the
                    associated Originator (Project Owner) profile has been fully
                    authenticated on the registry.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="my-8 p-5 bg-amber-50 border-l-2 border-amber-500 flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">
                    Protocol Requirement
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed font-mono">
                    Assets require a linked Originator to execute automated dMRV
                    telemetry and cryptographic credit issuance.
                  </p>
                </div>
              </div>

              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full py-6 rounded-none border-slate-300 hover:border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-[10px] uppercase tracking-widest order-last sm:order-first transition-all"
                >
                  Originator is Registered
                </Button>
                <Button
                  type="button"
                  onClick={handleOnboardRedirect}
                  className="w-full py-6 rounded-none bg-slate-900 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  Onboard Originator <ArrowRight className="w-4 h-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-4 mb-6">
                <div className="w-12 h-12 border border-slate-900 bg-slate-900 flex items-center justify-center text-white">
                  <UserSquare className="w-6 h-6" />
                </div>

                <div className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    Link Originator Profile
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 text-sm font-light leading-relaxed">
                    {role === "super_admin"
                      ? "Select the managing Operative (Admin) and their associated Originator to link with this payload."
                      : "Select the Originator profile you wish to securely link with this new asset."}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-6 my-8">
                {role === "super_admin" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="admin"
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900"
                    >
                      Assigned Operative (Manager)
                    </label>
                    <Popover
                      open={isAdminPopoverOpen}
                      onOpenChange={setIsAdminPopoverOpen}
                      modal
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between h-14 rounded-none border-slate-300 px-4 font-mono text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-900 transition-colors"
                        >
                          {selectedAdmin
                            ? `${selectedAdmin.firstName} ${selectedAdmin.lastName}`
                            : "Select an Operative..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-none border border-slate-900 shadow-xl">
                        <Command className="border-none rounded-none">
                          <CommandInput
                            placeholder="Search operative directory..."
                            className="font-mono text-xs"
                          />
                          <CommandList>
                            <CommandEmpty className="py-6 text-center text-xs font-mono text-slate-500">
                              No operatives found.
                            </CommandEmpty>
                            <CommandGroup>
                              {admins.map((admin: any) => (
                                <CommandItem
                                  key={admin.id}
                                  value={admin.id}
                                  onSelect={() => {
                                    setSelectedAdminId(admin.id);
                                    setSelectedOwnerId("");
                                    setIsAdminPopoverOpen(false);
                                  }}
                                  className="flex items-center gap-3 py-3 px-4 cursor-pointer rounded-none hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4 text-slate-900",
                                      selectedAdminId === admin.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-serif font-bold text-slate-900">
                                      {admin.firstName} {admin.lastName}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {admin.email}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="owner"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900"
                  >
                    Originator Entity (Project Owner)
                  </label>
                  <Popover
                    open={isOwnerPopoverOpen}
                    onOpenChange={setIsOwnerPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between h-14 rounded-none border-slate-300 px-4 font-mono text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-900 transition-colors",
                          !selectedOwnerId && "text-slate-400",
                        )}
                      >
                        {selectedOwner
                          ? `${selectedOwner.firstName} ${selectedOwner.lastName} (${selectedOwner.code})`
                          : "Select Originator..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-none border border-slate-900 shadow-xl">
                      <Command
                        shouldFilter={false}
                        className="border-none rounded-none"
                      >
                        <div className="flex items-center border-b border-slate-200 px-3">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-900" />
                          <input
                            className="flex h-11 w-full rounded-none bg-transparent py-3 text-xs font-mono outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search by exact name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <CommandList className="max-h-[300px]">
                          {isLoadingOwners ? (
                            <div className="p-6 text-center">
                              <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-900" />
                            </div>
                          ) : owners.length === 0 ? (
                            <CommandEmpty className="p-8 text-center">
                              <p className="text-sm font-serif font-bold text-slate-900 mb-1">
                                No entities found.
                              </p>
                              <p className="text-xs text-slate-500 font-light mb-6">
                                {role === "super_admin" && !selectedAdminId
                                  ? "Acknowledge an operative first."
                                  : "The originator must be onboarded to the registry first."}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleOnboardRedirect}
                                className="rounded-none border-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                              >
                                Onboard Now
                              </Button>
                            </CommandEmpty>
                          ) : (
                            <CommandGroup>
                              {owners.map((owner) => (
                                <CommandItem
                                  key={owner.id}
                                  value={owner.id}
                                  onSelect={() => {
                                    setSelectedOwnerId(owner.id);
                                    setIsOwnerPopoverOpen(false);
                                  }}
                                  className="flex items-center gap-3 py-3 px-4 cursor-pointer rounded-none hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4 text-emerald-600",
                                      selectedOwnerId === owner.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-serif font-bold text-slate-900">
                                      {owner.firstName} {owner.lastName}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                                      {owner.code}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                              {hasMoreOwners && (
                                <div className="p-2 border-t border-slate-200">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-none"
                                    onClick={() => fetchNextOwners()}
                                    disabled={isFetchingMoreOwners}
                                  >
                                    {isFetchingMoreOwners ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                    ) : (
                                      "Load More Entries"
                                    )}
                                  </Button>
                                </div>
                              )}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full py-6 rounded-none border-slate-300 hover:border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-[10px] uppercase tracking-widest order-last sm:order-first transition-all"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Retreat
                </Button>
                <Button
                  type="button"
                  disabled={!selectedOwnerId}
                  onClick={handleFinalProceed}
                  className="w-full py-6 rounded-none bg-slate-900 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & Proceed
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
