import { createAuthClient } from "better-auth/react";

const _apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
  // Point to your frontend's own rewrite path
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL,
});
