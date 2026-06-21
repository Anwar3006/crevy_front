// src/lib/services/organization-service.ts
import { axiosClient } from "../axiosClient";

export const OrganizationService = {
  listOrganizations: async () => {
    const response = await axiosClient.get("/organizations");
    return response.data;
  },

  getOrganizationById: async (id: string) => {
    const response = await axiosClient.get(`/organizations/${id}`);
    return response.data;
  },

  createOrganization: async (payload: {
    name: string;
    registrationId?: string;
    taxResidence?: string;
    carbonNeutralityTargets?: Record<string, unknown>;
    status?: string;
  }) => {
    const response = await axiosClient.post("/organizations", payload);
    return response.data;
  },

  updateOrganization: async (
    id: string,
    payload: {
      name?: string;
      registrationId?: string;
      taxResidence?: string;
      carbonNeutralityTargets?: Record<string, unknown>;
      status?: string;
    },
  ) => {
    const response = await axiosClient.patch(`/organizations/${id}`, payload);
    return response.data;
  },

  deleteOrganization: async (id: string) => {
    const response = await axiosClient.delete(`/organizations/${id}`);
    return response.data;
  },
};
