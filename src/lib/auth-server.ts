import { headers } from "next/headers";

export const getServerSession = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[getServerSession] NEXT_PUBLIC_API_URL is not defined");
    return null;
  }
  // Use the Better Auth API directly or fetch your /api/auth/get-session endpoint
  const response = await fetch(`${apiUrl}/api/auth/get-session`, {
    headers: await headers(), // This forwards the browser's cookies to your Express backend
  });

  if (!response.ok) return null;
  return response.json();
};
