import { createAuthClient } from "better-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
  baseURL: `${apiUrl}/api/auth`,
  fetchOptions: {
    credentials: "include", // Send cookies cross-origin to the Express server
  },
});
