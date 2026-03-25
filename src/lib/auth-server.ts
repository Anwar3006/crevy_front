import { headers } from "next/headers";

export const getServerSession = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[getServerSession] NEXT_PUBLIC_API_URL is not defined");
    return null;
  }

  // ─── IMPORTANT ─────────────────────────────────────────────────────────────
  // Only forward the `cookie` header — NOT the full headers() object.
  //
  // Forwarding all headers previously included the incoming `host` header
  // (crevy-frontend.netlify.app), which caused BetterAuth on the backend to
  // see a mismatched host and silently return null for the session.
  //
  // We also add `cache: "no-store"` so Next.js never caches the session check
  // between requests — without this, a logged-out state can be cached and
  // served to a freshly logged-in user, causing an immediate redirect back
  // to /login.
  // ───────────────────────────────────────────────────────────────────────────
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  try {
    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        cookie,
        // Tell BetterAuth where the request is originating from
        origin: process.env.NEXT_PUBLIC_SITE_URL ?? apiUrl,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[getServerSession] Backend responded with ${response.status}`,
      );
      return null;
    }

    const data = await response.json();

    // BetterAuth returns { session: null, user: null } (not a 4xx) when no
    // session exists — treat that as "not logged in"
    if (!data?.session) return null;

    return data;
  } catch (err) {
    console.error("[getServerSession] Fetch failed:", err);
    return null;
  }
};
