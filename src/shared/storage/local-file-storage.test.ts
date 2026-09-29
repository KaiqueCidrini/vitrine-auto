import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LocalFileStorage } from "./local-file-storage";

describe("LocalFileStorage", () => {
  let directory: string;
  let storage: LocalFileStorage;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "storage-test-"));
    storage = new LocalFileStorage(directory);
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("salva, lê e apaga um arquivo", async () => {
    await storage.save("vehicles/abc-123.webp", Buffer.from("foto"));
    expect((await storage.read("vehicles/abc-123.webp"))?.toString()).toBe("foto");

    expect(await storage.exists("vehicles/abc-123.webp")).toBe(true);

    await storage.delete("vehicles/abc-123.webp");
    expect(await storage.read("vehicles/abc-123.webp")).toBeNull();
    expect(await storage.exists("vehicles/abc-123.webp")).toBe(false);
  });

  it("lista os arquivos de uma pasta", async () => {
    await storage.save("vehicles/a.webp", Buffer.from("1"));
    await storage.save("vehicles/b.webp", Buffer.from("2"));
    const keys = (await storage.list("vehicles")).map((file) => file.key).sort();
    expect(keys).toEqual(["vehicles/a.webp", "vehicles/b.webp"]);
    expect(await storage.list("inexistente")).toEqual([]);
  });

  it("gera a URL pública da rota de mídia", () => {
    expect(storage.getPublicUrl("vehicles/abc.webp")).toBe("/media/vehicles/abc.webp");
  });

  it.each(["../segredo.webp", "vehicles/../../etc.webp", "/etc/passwd", "Vehicles/A.webp"])(
    "recusa a chave insegura %s",
    async (key) => {
      await expect(storage.save(key, Buffer.from("x"))).rejects.toThrow();
    },
  );
});
