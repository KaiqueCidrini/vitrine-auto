import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const MAX_PHOTO_UPLOAD_SIZE = "12mb";

const VERCEL_BLOB_IMAGE_PATTERN: RemotePattern = {
  protocol: "https",
  hostname: "*.public.blob.vercel-storage.com",
  pathname: "/**",
};

function buildS3ImagePattern(publicStorageUrl: string): RemotePattern {
  const { protocol, hostname, port, pathname } = new URL(publicStorageUrl);
  return {
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port,
    pathname: `${pathname.replace(/\/$/, "")}/**`,
  };
}

/**
 * Quando as fotos ficam fora do servidor (Vercel Blob ou bucket S3/R2),
 * o next/image precisa saber que pode otimizar imagens vindas desse domínio.
 */
function buildRemoteImagePatterns(): RemotePattern[] {
  if (process.env.STORAGE_DRIVER === "vercel-blob") return [VERCEL_BLOB_IMAGE_PATTERN];

  const publicStorageUrl = process.env.S3_PUBLIC_URL;
  return publicStorageUrl ? [buildS3ImagePattern(publicStorageUrl)] : [];
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
