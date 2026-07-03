// src/lib/services/dashboard-service.ts
import { axiosClient } from "../axiosClient";

export const DashboardService = {
  getSuperAdminDashboard: async () => {
    const response = await axiosClient.get("/dashboards/super-admin");
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await axiosClient.get("/dashboards/admin");
    return response.data;
  },

  getOrganizationDashboard: async () => {
    const response = await axiosClient.get("/dashboards/organization");
    return response.data;
  },

  getProjectDeveloperDashboard: async () => {
    const response = await axiosClient.get("/dashboards/project-developer");
    return response.data;
  },

  getAuditorDashboard: async () => {
    const response = await axiosClient.get("/dashboards/auditor");
    return response.data;
  },
};
