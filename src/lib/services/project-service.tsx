// src/lib/services/project-service.tsx

import { format } from "date-fns";
import type { TCreateProject } from "@/constants/new-project";
import { axiosClient } from "../axiosClient";

export const ProjectService = {
  // ─── Projects ──────────────────────────────────────────────────────────────

  createProject: async (data: TCreateProject) => {
    const payload = {
      projectType: data.projectType,
      sector: data.sector,
      name: data.name,
      country: data.country,
      region: data.region,
      gpsCoordinates: data.gpsCoordinates || undefined,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : undefined,
      totalAreaHectares: data.totalAreaHectares,
      currency: data.currency, // Pass the {code, name} object
      projectTags: data.projectTags,
      description: data.description,
      sdgs: data.sdgs,
    };
    const response = await axiosClient.post("/projects", payload);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<TCreateProject>) => {
    const response = await axiosClient.put(`/projects/${id}`, data);
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },

  getProjects: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/projects", { params });
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  },

  getMarketplaceProjects: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/projects", {
      params: { projectStatus: "active", projectStage: "completed", ...params },
    });
    return response.data;
  },

  // ─── Documents ─────────────────────────────────────────────────────────────

  /**
   * Upload a single project document.
   * The file is first uploaded to Supabase/S3 by the caller to obtain a URL,
   * then this method stores the metadata on Crevy's backend.
   *
   * Storage is now wired via StorageService — pass the resolved public URL.
   *
   */
  uploadDocument: async (
    projectId: string,
    payload: {
      documentType: string;
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType?: string;
    },
  ) => {
    const response = await axiosClient.post(
      `/projects/${projectId}/documents`,
      payload,
    );
    return response.data;
  },

  listDocuments: async (projectId: string) => {
    const response = await axiosClient.get(`/projects/${projectId}/documents`);
    return response.data;
  },

  // ─── Currencies ────────────────────────────────────────────────────────────

  getCurrencies: async () => {
    const response = await axiosClient.get("/currencies");
    return response.data;
  },

  // ─── MRV ───────────────────────────────────────────────────────────────────

  getProjectVerifications: async (projectId: string) => {
    const response = await axiosClient.get(
      `/mrv/verifications/project/${projectId}`,
    );
    return response.data;
  },

  getProjectAnchors: async (projectId: string) => {
    const response = await axiosClient.get(`/mrv/anchors/project/${projectId}`);
    return response.data;
  },

  getProjectIngestions: async (projectId: string) => {
    const response = await axiosClient.get(
      `/mrv/ingestions/project/${projectId}`,
    );
    return response.data;
  },

  getProjectTransactions: async (projectId: string) => {
    const response = await axiosClient.get("/credits/transactions", {
      params: { projectId },
    });
    return response.data;
  },

  simulateMrv: async (projectId: string) => {
    const response = await axiosClient.post(`/mrv/simulate/${projectId}`);
    return response.data;
  },
};
