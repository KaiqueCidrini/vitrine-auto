import { getFileStorage } from "@/shared/storage/get-file-storage";
import { isValidStorageKey } from "@/shared/storage/file-storage";
import { LocalFileStorage } from "@/shared/storage/local-file-storage";

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  png: "image/png",
};

/** Entrega as fotos salvas em disco quando STORAGE_DRIVER=local. */
export async function GET(_request: Request, context: RouteContext<"/media/[...key]">) {
  const { key: keySegments } = await context.params;
  const key = keySegments.join("/");
  const storage = getFileStorage();

  if (!(storage instanceof LocalFileStorage) || !isValidStorageKey(key)) {
    return new Response("Não encontrado", { status: 404 });
  }

  const file = await storage.read(key);
  if (!file) return new Response("Não encontrado", { status: 404 });

  const extension = key.split(".").pop() ?? "";
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
