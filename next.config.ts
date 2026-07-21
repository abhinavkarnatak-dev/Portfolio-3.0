import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in a parent folder confuses inference.
  turbopack: { root: path.join(__dirname) },
  // Next blocks cross-origin requests to dev assets by default, which silently breaks
  // client hydration (stuck scroll-reveal animations) when previewing over the LAN IP
  // from a phone instead of localhost. Dev-only - has no effect on production builds.
  allowedDevOrigins: ["192.168.29.84"],
};

export default nextConfig;
