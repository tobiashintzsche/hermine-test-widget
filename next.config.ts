import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Für Widget-Embedding auf externen Seiten
  async headers() {
    return [
      {
        source: "/widget.js",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
