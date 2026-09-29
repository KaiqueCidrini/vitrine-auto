import type { StoredFileInfo } from "@/shared/storage/file-storage";

/**
 * Fotos enviadas mas nunca salvas num anúncio (ex.: o funcionário fechou a aba).
 * A margem de tempo evita apagar uma foto que acabou de ser enviada e ainda
 * está no formulário esperando o "Salvar".
 */
export function findOrphanPhotos(
  storedFiles: StoredFileInfo[],
  referencedKeys: ReadonlySet<string>,
  olderThan: Date,
): string[] {
  return storedFiles
    .filter((file) => !referencedKeys.has(file.key) && file.lastModified < olderThan)
    .map((file) => file.key);
}
