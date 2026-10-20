import type { NextConfig } from "next";

function r2ImageHostname(): string | undefined {
  const explicit = process.env.R2_PUBLIC_HOSTNAME?.trim();
  if (explicit) return explicit;
  const base = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!base) return undefined;
  try {
    return new URL(base).hostname;
  } catch {
    return undefined;
  }
}

const r2Hostname = r2ImageHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Cloudflare R2 public bucket URLs (*.r2.dev)
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      ...(r2Hostname && !r2Hostname.endsWith(".r2.dev")
        ? [
            {
              protocol: "https" as const,
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
