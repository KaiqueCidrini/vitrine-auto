import { BlobNotFoundError, del, head, list, put } from "@vercel/blob";

import { assertValidStorageKey, type FileStorage, type StoredFileInfo } from "./file-storage";

interface BlobCredentials {
  /** Definida pela Vercel quando o store é conectado ao projeto (autenticação via OIDC). */
  storeId?: string;
  /** Token no formato vercel_blob_rw_<storeId>_<segredo>. */
  readWriteToken?: string;
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/**
 * Descobre o id do store a partir das credenciais que a Vercel injeta.
 * É o mesmo cálculo que o SDK faz internamente para montar as URLs públicas.
 */
export function resolveBlobStoreId({ storeId, readWriteToken }: BlobCredentials): string {
  const explicitStoreId = storeId?.trim().replace(/^store_/, "");
  if (explicitStoreId) return explicitStoreId;

  const storeIdFromToken = readWriteToken?.trim().split("_")[3];
  if (storeIdFromToken) return storeIdFromToken;

  throw new Error(
    "Não foi possível identificar o Vercel Blob: defina BLOB_READ_WRITE_TOKEN ou BLOB_STORE_ID",
  );
}

export function buildBlobPublicBaseUrl(storeId: string): string {
  return `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
}

/**
 * Guarda as fotos no Vercel Blob (store público).
 * A autenticação fica por conta do SDK, que lê BLOB_READ_WRITE_TOKEN ou
 * BLOB_STORE_ID + token OIDC diretamente das variáveis de ambiente.
 */
export class VercelBlobFileStorage implements FileStorage {
  private readonly publicBaseUrl: string;

  constructor(credentials: BlobCredentials) {
    this.publicBaseUrl = buildBlobPublicBaseUrl(resolveBlobStoreId(credentials));
  }

  async save(key: string, content: Buffer, contentType: string): Promise<void> {
    assertValidStorageKey(key);
    await put(key, content, {
      access: "public",
      contentType,
      // A chave já é única (uuid); sem sufixo aleatório a URL pode ser calculada a partir dela.
      addRandomSuffix: false,
      // Se um reenvio acontecer depois de uma falha de rede, grava o mesmo arquivo de novo sem erro.
      allowOverwrite: true,
      cacheControlMaxAge: ONE_YEAR_IN_SECONDS,
    });
  }

  async delete(key: string): Promise<void> {
    assertValidStorageKey(key);
    await del(key);
  }

  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    assertValidStorageKey(key);
    try {
      await head(key);
      return true;
    } catch (error) {
      if (error instanceof BlobNotFoundError) return false;
      throw error;
    }
  }

  async list(prefix: string): Promise<StoredFileInfo[]> {
    const files: StoredFileInfo[] = [];
    let cursor: string | undefined;

    do {
      const page = await list({ prefix, cursor });
      for (const blob of page.blobs) {
        files.push({ key: blob.pathname, lastModified: blob.uploadedAt });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return files;
  }
}
