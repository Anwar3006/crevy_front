// src/lib/services/waitlist-service.ts
import { axiosClient } from "../axiosClient";

export const WaitlistService = {
  /**
   * Public — submit the register-interest form. No auth required.
   */
  createRegistration: async (data: Record<string, unknown>) => {
    const response = await axiosClient.post("/waitlist", data);
    return response.data;
  },

  /**
   * Admin — fetch a single registration by id.
   */
  getRegistrationById: async (id: string) => {
    const response = await axiosClient.get(`/waitlist/${id}`);
    return response.data;
  },

  /**
   * Admin — cursor-paginated list, optionally filtered by status/search.
   */
  listRegistrations: async (
    filter: {
      status?: string;
      cursor?: string;
      limit?: number;
      search?: string;
    } = {},
  ) => {
    const response = await axiosClient.get("/waitlist", { params: filter });
    return response.data;
  },

  /**
   * Admin — partial update (status, review notes, corrections).
   */
  updateRegistration: async (id: string, data: Record<string, unknown>) => {
    const response = await axiosClient.patch(`/waitlist/${id}`, data);
    return response.data;
  },
};
