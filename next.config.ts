import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mcogksyzirekpzpsdtym.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;