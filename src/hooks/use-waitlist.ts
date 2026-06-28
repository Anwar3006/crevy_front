// src/hooks/use-waitlist.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TWaitlistRegistration } from "@/constants/waitlist";
import { WaitlistService } from "@/lib/services/waitlist-service";

export interface WaitlistFilters {
  status?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

/**
 * Public — submit a new waitlist registration.
 * Used by the /register-interest form. No auth required on this mutation.
 */
export function useCreateWaitlistRegistration() {
  return useMutation({
    mutationFn: (data: TWaitlistRegistration) =>
      WaitlistService.createRegistration(data),
  });
}

/**
 * Admin — cursor-paginated list of registrations, optionally filtered by
 * status or a free-text search across name/email/organization.
 */
export function useWaitlistRegistrations(filters: WaitlistFilters = {}) {
  return useQuery({
    queryKey: ["waitlist-registrations", filters],
    queryFn: () => WaitlistService.listRegistrations(filters),
  });
}

/**
 * Admin — fetch a single registration by id.
 */
export function useWaitlistRegistration(id: string | undefined) {
  return useQuery({
    queryKey: ["waitlist-registration", id],
    queryFn: () => WaitlistService.getRegistrationById(id as string),
    enabled: !!id,
  });
}

/**
 * Admin — partial update (status, review notes, corrections).
 * Invalidates both the list and the single-record cache on success.
 */
export function useUpdateWaitlistRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      WaitlistService.updateRegistration(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-registrations"] });
      queryClient.invalidateQueries({
        queryKey: ["waitlist-registration", variables.id],
      });
    },
  });
}
