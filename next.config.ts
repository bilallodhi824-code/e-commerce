import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.trycloudflare.com",
    "localhost:3001",
    "127.0.0.1:3001",
    "192.168.10.33:3001"
  ]
};

export default nextConfig;
