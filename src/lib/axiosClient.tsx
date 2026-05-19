// src/lib/axiosClient.tsx
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  },
);
