import { BlobNotFoundError, del, head, list, put } from "@vercel/blob";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildBlobPublicBaseUrl,
  resolveBlobStoreId,
  VercelBlobFileStorage,
} from "./vercel-blob-file-storage";

vi.mock("@vercel/blob", async (importOriginal) => {
  const original = await importOriginal<typeof import("@vercel/blob")>();
  return {
    BlobNotFoundError: original.BlobNotFoundError,
    put: vi.fn(),
    del: vi.fn(),
    head: vi.fn(),
    list: vi.fn(),
  };
});

const READ_WRITE_TOKEN = "vercel_blob_rw_AbC123xyz_segredoQualquer";

describe("resolveBlobStoreId", () => {
  it("extrai o id do store do token de leitura e escrita", () => {
    expect(resolveBlobStoreId({ readWriteToken: READ_WRITE_TOKEN })).toBe("AbC123xyz");
  });

  it("prefere BLOB_STORE_ID e remove o prefixo store_", () => {
    expect(
      resolveBlobStoreId({ storeId: "store_Outro456", readWriteToken: READ_WRITE_TOKEN }),
    ).toBe("Outro456");
  });

  it("falha com mensagem clara quando não há credenciais", () => {
    expect(() => resolveBlobStoreId({})).toThrow(/BLOB_READ_WRITE_TOKEN/);
  });
});

describe("VercelBlobFileStorage", () => {
  const storage = new VercelBlobFileStorage({ readWriteToken: READ_WRITE_TOKEN });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("monta a URL pública a partir da chave", () => {
    expect(buildBlobPublicBaseUrl("AbC123xyz")).toBe(
      "https://abc123xyz.public.blob.vercel-storage.com",
    );
    expect(storage.getPublicUrl("vehicles/foto.webp")).toBe(
      "https://abc123xyz.public.blob.vercel-storage.com/vehicles/foto.webp",
    );
  });

  it("salva como arquivo público, sem sufixo aleatório", async () => {
    const content = Buffer.from("imagem");
    await storage.save("vehicles/foto.webp", content, "image/webp");

    expect(put).toHaveBeenCalledWith(
      "vehicles/foto.webp",
      content,
      expect.objectContaining({
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      }),
    );
  });

  it("rejeita chaves inválidas antes de chamar o Blob", async () => {
    await expect(storage.save("../segredo.webp", Buffer.from(""), "image/webp")).rejects.toThrow();
    await expect(storage.delete("../segredo.webp")).rejects.toThrow();
    expect(put).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it("exists retorna false quando o arquivo não existe", async () => {
    vi.mocked(head).mockRejectedValueOnce(new BlobNotFoundError());
    await expect(storage.exists("vehicles/sumiu.webp")).resolves.toBe(false);

    vi.mocked(head).mockResolvedValueOnce({} as Awaited<ReturnType<typeof head>>);
    await expect(storage.exists("vehicles/existe.webp")).resolves.toBe(true);
  });

  it("exists repassa outros erros", async () => {
    vi.mocked(head).mockRejectedValueOnce(new Error("sem conexão"));
    await expect(storage.exists("vehicles/foto.webp")).rejects.toThrow("sem conexão");
  });

  it("lista todas as páginas de uma pasta", async () => {
    const firstUpload = new Date("2026-01-01");
    const secondUpload = new Date("2026-02-01");
    vi.mocked(list)
      .mockResolvedValueOnce({
        blobs: [{ pathname: "vehicles/a.webp", uploadedAt: firstUpload }],
        hasMore: true,
        cursor: "pagina-2",
      } as Awaited<ReturnType<typeof list>>)
      .mockResolvedValueOnce({
        blobs: [{ pathname: "vehicles/b.webp", uploadedAt: secondUpload }],
        hasMore: false,
      } as Awaited<ReturnType<typeof list>>);

    await expect(storage.list("vehicles/")).resolves.toEqual([
      { key: "vehicles/a.webp", lastModified: firstUpload },
      { key: "vehicles/b.webp", lastModified: secondUpload },
    ]);
    expect(list).toHaveBeenLastCalledWith({ prefix: "vehicles/", cursor: "pagina-2" });
  });
});
