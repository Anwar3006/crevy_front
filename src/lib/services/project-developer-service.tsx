// src/lib/services/project-developer-service.tsx
import { axiosClient } from "../axiosClient";

export type ProjectDeveloperFilters = {
  cursor?: string;
  limit?: number;
  verificationStatus?: "pending" | "verified" | "rejected";
  country?: string;
  search?: string;
  // Only used by super_admin drilling into a specific manager's portfolio
  agentId?: string;
};

export type ProjectDeveloperRecord = {
  id: string;
  userId: string;
  code: string;
  verificationStatus: "pending" | "verified" | "rejected";
  onboardedBy: string | null;
  onboardedAt: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  } | null;
  momoDetails: { network: string; number: string; accountName?: string } | null;
  createdAt: string;
  updatedAt: string;
  // Joined from user table
  firstName: string;
  lastName: string;
  email: string | null;
  contactNumber: string | null;
  countryOfOperation: string | null;
};

export type ProjectDeveloperListResponse = {
  success: boolean;
  data: ProjectDeveloperRecord[];
  nextCursor: string | null;
  total: number;
};

export type ProjectDeveloperOnboardPayload = {
  firstName: string;
  lastName: string;
  email?: string | null;
  contactNumber: string;
  password: string;
  countryOfOperation: string;
  partnerId?: number | null;
  assignedAdminId?: string | null;
  assignmentType?: "primary" | "secondary";
  isB2cAssignment?: boolean;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName?: string | null;
  } | null;
  momoDetails?: {
    network: string;
    number: string;
    accountName?: string | null;
  } | null;
  farmPlot?: {
    region: string;
    village?: string | null;
    centroid: { lat: number; lng: number };
    areaHectares: number;
  } | null;
};

export const ProjectDeveloperService = {
  /**
   * List project owners.
   * The backend injects role-based filtering:
   *   - super_admin: sees all
   *   - project_manager: sees only their assigned owners
   * The frontend passes filters but never controls the scope boundary.
   */
  listProjectDevelopers: async (
    filters: ProjectDeveloperFilters = {},
  ): Promise<ProjectDeveloperListResponse> => {
    // Strip undefined values so axios doesn't send empty params
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""),
    );
    const response = await axiosClient.get("/project-developers", { params });
    return response.data;
  },

  /**
   * Onboard a new project owner (admin / field-agent only).
   * The backend creates the Better Auth user, project owner profile,
   * farm plot, and assignment in a single atomic transaction.
   */
  onboardProjectDeveloper: async (
    payload: ProjectDeveloperOnboardPayload,
  ): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await axiosClient.post("/project-developers/onboard", payload);
    return response.data;
  },

  getProjectDeveloper: async (
    userId: string,
  ): Promise<{ success: boolean; data: ProjectDeveloperRecord }> => {
    const response = await axiosClient.get(`/project-developers/${userId}`);
    return response.data;
  },
};
