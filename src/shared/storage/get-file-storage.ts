import "server-only";

import { getServerEnv } from "@/shared/config/server-env";

import type { FileStorage } from "./file-storage";
import { LocalFileStorage } from "./local-file-storage";
import { S3FileStorage } from "./s3-file-storage";
import { VercelBlobFileStorage } from "./vercel-blob-file-storage";

let storageInstance: FileStorage | undefined;

function createFileStorage(): FileStorage {
  const env = getServerEnv();

  if (env.STORAGE_DRIVER === "s3") {
    // Os campos obrigatórios já foram validados em getServerEnv().
    return new S3FileStorage({
      bucket: env.S3_BUCKET!,
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT,
      accessKeyId: env.S3_ACCESS_KEY_ID!,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      publicUrl: env.S3_PUBLIC_URL!,
      forcePathStyle: env.S3_FORCE_PATH_STYLE,
    });
  }

  if (env.STORAGE_DRIVER === "vercel-blob") {
    return new VercelBlobFileStorage({
      storeId: env.BLOB_STORE_ID,
      readWriteToken: env.BLOB_READ_WRITE_TOKEN,
    });
  }

  return new LocalFileStorage(env.STORAGE_LOCAL_DIR);
}

export function getFileStorage(): FileStorage {
  storageInstance ??= createFileStorage();
  return storageInstance;
}
