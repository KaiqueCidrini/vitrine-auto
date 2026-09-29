import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { assertValidStorageKey, type FileStorage, type StoredFileInfo } from "./file-storage";

export const LOCAL_MEDIA_ROUTE = "/media";

/** Guarda os arquivos numa pasta do servidor (em produção, um volume do Docker). */
export class LocalFileStorage implements FileStorage {
  private readonly baseDirectory: string;

  constructor(baseDirectory: string) {
    this.baseDirectory = path.resolve(baseDirectory);
  }

  async save(key: string, content: Buffer): Promise<void> {
    const filePath = this.resolveFilePath(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolveFilePath(key), { force: true });
  }

  async read(key: string): Promise<Buffer | null> {
    try {
      return await readFile(this.resolveFilePath(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  getPublicUrl(key: string): string {
    return `${LOCAL_MEDIA_ROUTE}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    return stat(this.resolveFilePath(key)).then(
      () => true,
      () => false,
    );
  }

  async list(prefix: string): Promise<StoredFileInfo[]> {
    const directory = path.join(this.baseDirectory, prefix);
    const fileNames = await readdir(directory).catch(() => [] as string[]);

    return Promise.all(
      fileNames.map(async (fileName) => ({
        key: path.posix.join(prefix, fileName),
        lastModified: (await stat(path.join(directory, fileName))).mtime,
      })),
    );
  }

  /** Valida a chave e garante que o caminho final não escape da pasta base. */
  private resolveFilePath(key: string): string {
    assertValidStorageKey(key);
    const filePath = path.resolve(this.baseDirectory, key);
    if (!filePath.startsWith(this.baseDirectory + path.sep)) {
      throw new Error(`Caminho fora da pasta de armazenamento: ${key}`);
    }
    return filePath;
  }
}
