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

// Request Interceptor: Attach real User-Agent and IP when running on the server
axiosClient.interceptors.request.use(async (config) => {
  // Check if this request is being fired from the server (Cloudflare Workers / Node)
  if (typeof window === "undefined") {
    try {
      // Dynamically import next/headers so it doesn't break Client Components
      const { headers } = await import("next/headers");

      // In Next.js 15+, headers() is asynchronous
      const headersList = await headers();

      // 1. Forward the real User-Agent
      const userAgent = headersList.get("user-agent");
      if (userAgent) {
        config.headers["User-Agent"] = userAgent;
      }

      // 2. Forward the real Client IP
      // Cloudflare sets 'cf-connecting-ip', fallback to 'x-forwarded-for'
      const clientIp =
        headersList.get("cf-connecting-ip") ||
        headersList.get("x-forwarded-for");

      if (clientIp) {
        config.headers["X-Forwarded-For"] = clientIp;
      }
    } catch (error) {
      // Fails safely if called outside of a Next.js request context (e.g., static generation)
      console.warn("Could not attach server headers:", error);
    }
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  },
);
