import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
    ],
  },

  async rewrites() {
    return [
      // better-auth session routes — unchanged
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
      },
      // v1 — kept until v1 is fully deprecated
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
      // v2 — all new frontend code targets this
      {
        source: "/api/v2/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
