import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/lib/services/dashboard-service";

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "super-admin"],
    queryFn: async () => {
      const response = await DashboardService.getSuperAdminDashboard();
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: async () => {
      const response = await DashboardService.getAdminDashboard();
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useOrganizationDashboard() {
  return useQuery({
    queryKey: ["dashboard", "organization"],
    queryFn: async () => {
      const response = await DashboardService.getOrganizationDashboard();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useProjectDeveloperDashboard() {
  return useQuery({
    queryKey: ["dashboard", "project-developer"],
    queryFn: async () => {
      const response = await DashboardService.getProjectDeveloperDashboard();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useAuditorDashboard() {
  return useQuery({
    queryKey: ["dashboard", "auditor"],
    queryFn: async () => {
      const response = await DashboardService.getAuditorDashboard();
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
