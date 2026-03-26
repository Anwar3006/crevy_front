import axios from "axios";

export const axiosClient = axios.create({
  // Use the frontend's OWN domain so the proxy handles the request
  // and browser sends the frontend-scoped cookies automatically.
  baseURL: "/api/v1",
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
