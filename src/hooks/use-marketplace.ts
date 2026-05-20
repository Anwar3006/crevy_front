import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/services/project-service";

export interface MarketplaceFilters {
  page?: number;
  limit?: number;
  status?: string;
  projectType?: string;
  region?: string;
  sdgs?: string;
  search?: string;
}

export function useMarketplace(filters: MarketplaceFilters = {}) {
  return useQuery({
    queryKey: ["marketplace-projects", filters],
    queryFn: async () => {
      const response = await ProjectService.getMarketplaceProjects(
        filters as Record<string, unknown>,
      );
      return response.data;
    },
  });
}
