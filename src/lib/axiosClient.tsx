// src/lib/axiosClient.tsx
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v2";

export const axiosClient = axios.create({
  baseURL: `${backendUrl}/api/${apiVersion}`,
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
