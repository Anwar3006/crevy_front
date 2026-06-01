// src/lib/services/financials-service.ts
import { axiosClient } from "../axiosClient";

export const FinancialsService = {
  getContracts: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/financials/contracts", { params });
    return response.data;
  },

  getContractById: async (id: string) => {
    const response = await axiosClient.get(`/financials/contracts/${id}`);
    return response.data;
  },

  createContract: async (payload: any) => {
    const response = await axiosClient.post("/financials/contracts", payload);
    return response.data;
  },

  getPayouts: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/financials/payouts", { params });
    return response.data;
  },

  getPayoutById: async (id: string) => {
    const response = await axiosClient.get(`/financials/payouts/${id}`);
    return response.data;
  },

  createPayout: async (payload: any) => {
    const response = await axiosClient.post("/financials/payouts", payload);
    return response.data;
  },

  getFinancialRecords: async (params?: Record<string, unknown>) => {
    const response = await axiosClient.get("/financials/records", { params });
    return response.data;
  },
};
