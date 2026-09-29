import { describe, expect, it } from "vitest";

import { findOrphanPhotos } from "./find-orphan-photos";

describe("findOrphanPhotos", () => {
  const cutoff = new Date("2026-01-02T00:00:00Z");
  const old = new Date("2026-01-01T00:00:00Z");
  const recent = new Date("2026-01-03T00:00:00Z");

  it("só retorna arquivos antigos que nenhum anúncio usa", () => {
    const files = [
      { key: "vehicles/em-uso.webp", lastModified: old },
      { key: "vehicles/orfa-antiga.webp", lastModified: old },
      { key: "vehicles/orfa-recente.webp", lastModified: recent },
    ];
    expect(findOrphanPhotos(files, new Set(["vehicles/em-uso.webp"]), cutoff)).toEqual([
      "vehicles/orfa-antiga.webp",
    ]);
  });
});
