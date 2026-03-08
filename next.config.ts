import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置（用于 APK）
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
