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
}

/**
 * AssignmentCheckModal
 *
 * A premium multi-step soft-gate modal for Admin/Manager roles to ensure they have onboarded
 * a Project Owner before registering a project.
 */
export function AssignmentCheckModal({
  isOpen,
  role,
  onProceed,
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
        agentId: role === "super_admin" ? selectedAdminId : undefined,
        cursor: pageParam,
        limit: 20,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isOpen && step === 2,
  });

  const owners = ownerData?.pages.flatMap((page: any) => page.data) ?? [];

  // 2. Fetch Admins (Only for Super Admin)
  const { data: adminData, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["admins-dropdown"],
    queryFn: () => UserService.listUsers({ role: "project_manager" }),
    enabled: isOpen && step === 2 && role === "super_admin",
  });

  const admins = (adminData as any)?.data ?? [];

  React.useEffect(() => {
    // Project Owners bypass this completely.
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

  const selectedOwner = Array.isArray(owners)
    ? owners.find((o: any) => o.id === selectedOwnerId)
    : null;
  const selectedAdmin = Array.isArray(admins)
    ? admins.find((a: any) => a.id === selectedAdminId)
    : null;

  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl border border-emerald-100 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                  <Users className="w-8 h-8" />
                </div>

                <div className="space-y-2 text-center">
                  <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Project Owner Verification
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                    Before registering a new project, please ensure the
                    associated Project Owner profile has been onboarded onto the
                    Crevy platform.
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Compliance Rule
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    All assets require a valid Project Owner assignment to
                    enable automated dMRV monitoring and carbon credit issuance.
                  </p>
                </div>
              </div>

              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full py-6 rounded-2xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-bold text-sm tracking-tight order-last sm:order-first transition-all"
                >
                  Yes, Owner is Registered
                </Button>
                <Button
                  type="button"
                  onClick={handleOnboardRedirect}
                  className="w-full py-6 rounded-2xl bg-[#2CC295] hover:bg-[#25a37d] text-white font-extrabold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2CC295]/20 hover:shadow-[#2CC295]/30"
                >
                  No, Onboard Owner First
                  <ArrowRight className="w-4 h-4" />
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
              <DialogHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#131927] border border-slate-800 flex items-center justify-center text-white shadow-sm">
                  <UserSquare className="w-8 h-8" />
                </div>

                <div className="space-y-2 text-center">
                  <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Associate Project Owner
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                    {role === "super_admin"
                      ? "Select an Admin and the associated Project Owner to link with this new project."
                      : "Select the Project Owner profile you wish to link with this new project."}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-4 my-8">
                {role === "super_admin" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="Assigned Admin (Manager)"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                    >
                      Assigned Admin (Manager)
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
                          className="w-full justify-between h-14 rounded-2xl border-slate-200 px-4 font-bold text-slate-700 hover:bg-slate-50"
                        >
                          {selectedAdmin
                            ? `${selectedAdmin.firstName} ${selectedAdmin.lastName}`
                            : "Select an Admin..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 rounded-2xl overflow-hidden">
                        <Command className="border-none">
                          <CommandInput placeholder="Search admins..." />
                          <CommandList>
                            <CommandEmpty>No admins found.</CommandEmpty>
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
                                  className="flex items-center gap-2 py-3 px-4 cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedAdminId === admin.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-bold">
                                      {admin.firstName} {admin.lastName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
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
                    htmlFor="Project Owner"
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >
                    Project Owner
                  </label>
                  <Popover
                    open={isOwnerPopoverOpen}
                    onOpenChange={setIsOwnerPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={role === "super_admin" && !selectedAdminId}
                        className={cn(
                          "w-full justify-between h-14 rounded-2xl border-slate-200 px-4 font-bold text-slate-700 hover:bg-slate-50",
                          !selectedOwnerId && "text-slate-400 font-medium",
                        )}
                      >
                        {selectedOwner
                          ? `${selectedOwner.firstName} ${selectedOwner.lastName} (${selectedOwner.code})`
                          : "Select Project Owner..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-100">
                      <Command shouldFilter={false} className="border-none">
                        <div className="flex items-center border-b px-3">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search by name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <CommandList className="max-h-[300px]">
                          {isLoadingOwners ? (
                            <div className="p-4 text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-500" />
                            </div>
                          ) : owners.length === 0 ? (
                            <CommandEmpty className="p-8 text-center">
                              <p className="text-sm font-bold text-slate-900 mb-1">
                                No project owners found
                              </p>
                              <p className="text-xs text-slate-500 mb-4">
                                {role === "super_admin" && !selectedAdminId
                                  ? "Please select an admin first."
                                  : "The project owner must be onboarded first."}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleOnboardRedirect}
                                className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                              >
                                Onboard Owner Now
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
                                  className="flex items-center gap-2 py-3 px-4 cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 text-emerald-500",
                                      selectedOwnerId === owner.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-bold">
                                      {owner.firstName} {owner.lastName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                                      {owner.code}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                              {hasMoreOwners && (
                                <div className="p-2 border-t border-slate-50">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400"
                                    onClick={() => fetchNextOwners()}
                                    disabled={isFetchingMoreOwners}
                                  >
                                    {isFetchingMoreOwners ? (
                                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                    ) : (
                                      "Load More"
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

              <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full py-6 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm tracking-tight order-last sm:order-first transition-all"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={!selectedOwnerId}
                  onClick={handleFinalProceed}
                  className="w-full py-6 rounded-2xl bg-[#131927] hover:bg-slate-800 text-white font-extrabold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  Confirm & Proceed
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
