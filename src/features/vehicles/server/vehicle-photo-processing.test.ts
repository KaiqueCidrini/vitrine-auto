import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { InvalidPhotoError, processVehiclePhoto } from "./vehicle-photo-processing";

async function createJpeg(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: "#3366aa" } })
    .jpeg()
    .withExif({ IFD0: { Make: "CameraDeTeste" } })
    .toBuffer();
}

describe("processVehiclePhoto", () => {
  it("reduz fotos grandes, converte para WebP e remove metadados", async () => {
    const result = await processVehiclePhoto(await createJpeg(3000, 2000));
    const metadata = await sharp(result.content).metadata();

    expect(metadata.format).toBe("webp");
    expect([result.width, result.height]).toEqual([1600, 1067]);
    expect(metadata.exif).toBeUndefined();
  });

  it("não amplia fotos pequenas", async () => {
    const result = await processVehiclePhoto(await createJpeg(800, 600));
    expect(result.width).toBe(800);
  });

  it("recusa arquivos que não são imagem", async () => {
    await expect(processVehiclePhoto(Buffer.from("não sou uma imagem"))).rejects.toBeInstanceOf(
      InvalidPhotoError,
    );
  });
});
