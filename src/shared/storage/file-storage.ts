export interface StoredFileInfo {
  key: string;
  lastModified: Date;
}

/**
 * Contrato de armazenamento de arquivos (fotos dos veículos).
 * O restante do app só conhece esta interface, então trocar disco local
 * por S3/R2 é uma mudança de variável de ambiente, não de código.
 */
export interface FileStorage {
  save(key: string, content: Buffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  exists(key: string): Promise<boolean>;
  /** Lista os arquivos de uma pasta (usado pela limpeza de fotos órfãs). */
  list(prefix: string): Promise<StoredFileInfo[]>;
}

/** Chaves aceitas: pastas e nomes em minúsculas, sem "..", com extensão. Ex.: vehicles/3f9a.webp */
const STORAGE_KEY_PATTERN = /^[a-z0-9-]+(\/[a-z0-9-]+)*\.[a-z0-9]+$/;

export function assertValidStorageKey(key: string): void {
  if (!STORAGE_KEY_PATTERN.test(key)) {
    throw new Error(`Chave de armazenamento inválida: ${key}`);
  }
}

export function isValidStorageKey(key: string): boolean {
  return STORAGE_KEY_PATTERN.test(key);
}
