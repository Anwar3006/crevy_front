import { headers } from "next/headers";

export const getServerSession = async () => {
  // We point to our OWN server's rewrite path, not the Render URL
  // Better Auth's own session endpoint is /api/auth/get-session
  const proxyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/get-session`;

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  if (!cookie) return null; // Save a network call if no cookie exists

  try {
    const response = await fetch(proxyUrl, {
      headers: { cookie },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    // Better Auth returns session/user object
    return data?.session ? data : null;
  } catch (err) {
    console.error("[getServerSession] Proxy fetch failed:", err);
    return null;
  }
};
