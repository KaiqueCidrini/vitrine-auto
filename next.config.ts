import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const MAX_PHOTO_UPLOAD_SIZE = "12mb";

/**
 * Quando as fotos ficam num bucket S3/R2 público, o next/image precisa
 * saber que pode otimizar imagens vindas desse domínio.
 */
function buildRemoteImagePatterns(): RemotePattern[] {
  const publicStorageUrl = process.env.S3_PUBLIC_URL;
  if (!publicStorageUrl) return [];

  const { protocol, hostname, port, pathname } = new URL(publicStorageUrl);
  return [
    {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port,
      pathname: `${pathname.replace(/\/$/, "")}/**`,
    },
  ];
}

const nextConfig: NextConfig = {
  // "standalone" gera o servidor enxuto usado no Docker; a Vercel faz o próprio empacotamento.
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: buildRemoteImagePatterns(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: MAX_PHOTO_UPLOAD_SIZE,
    },
    proxyClientMaxBodySize: MAX_PHOTO_UPLOAD_SIZE,
  },
};

export default nextConfig;
