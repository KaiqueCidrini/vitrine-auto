import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { assertValidStorageKey, type FileStorage, type StoredFileInfo } from "./file-storage";

interface S3FileStorageOptions {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** URL pública do bucket ou CDN. Ex.: https://fotos.minhaloja.com.br */
  publicUrl: string;
  /** MinIO e alguns provedores exigem o bucket no caminho da URL em vez do subdomínio. */
  forcePathStyle?: boolean;
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Compatível com AWS S3, Cloudflare R2, MinIO e DigitalOcean Spaces. */
export class S3FileStorage implements FileStorage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(options: S3FileStorageOptions) {
    this.bucket = options.bucket;
    this.publicUrl = options.publicUrl.replace(/\/$/, "");
    this.client = new S3Client({
      region: options.region,
      endpoint: options.endpoint,
      forcePathStyle: options.forcePathStyle ?? false,
      // Só envia checksums quando a operação exige: evita incompatibilidade com
      // provedores S3-compatíveis que não aceitam os checksums padrão do SDK.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  async save(key: string, content: Buffer, contentType: string): Promise<void> {
    assertValidStorageKey(key);
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ContentType: contentType,
        // As chaves são únicas (uuid), então o arquivo nunca muda: pode ficar em cache por muito tempo.
        CacheControl: `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    assertValidStorageKey(key);
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    assertValidStorageKey(key);
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch (error) {
      if ((error as { name?: string }).name === "NotFound") return false;
      throw error;
    }
  }

  async list(prefix: string): Promise<StoredFileInfo[]> {
    const files: StoredFileInfo[] = [];
    let continuationToken: string | undefined;

    do {
      const page = await this.client.send(
        new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix, ContinuationToken: continuationToken }),
      );
      for (const object of page.Contents ?? []) {
        if (object.Key) files.push({ key: object.Key, lastModified: object.LastModified ?? new Date() });
      }
      continuationToken = page.NextContinuationToken;
    } while (continuationToken);

    return files;
  }
}
