// src/lib/services/credit-service.ts
import { axiosClient } from "../axiosClient";

export const CreditService = {
  getCarbonCredits: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/credits/carbon-credits", {
      params,
    });
    return response.data;
  },

  getCarbonCreditById: async (id: string) => {
    const response = await axiosClient.get(`/credits/carbon-credits/${id}`);
    return response.data;
  },

  purchaseCredits: async (
    id: string,
    payload: {
      quantity: number;
      pricePerCredit: number;
      currencyId: number;
      notes?: string;
    },
  ) => {
    const response = await axiosClient.post(
      `/credits/carbon-credits/${id}/purchase`,
      payload,
    );
    return response.data;
  },

  retireCredits: async (
    id: string,
    payload: { quantity: number; reason?: string },
  ) => {
    const response = await axiosClient.post(
      `/credits/carbon-credits/${id}/retire`,
      payload,
    );
    return response.data;
  },

  getTransactions: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/credits/transactions", { params });
    return response.data;
  },

  getVerifications: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/credits/verifications", {
      params,
    });
    return response.data;
  },
};
