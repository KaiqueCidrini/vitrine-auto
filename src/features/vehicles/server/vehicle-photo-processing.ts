import "server-only";

import sharp from "sharp";

export const MAX_PHOTO_SIZE_IN_BYTES = 10 * 1024 * 1024;
const MAX_PHOTO_WIDTH = 1600;
const WEBP_QUALITY = 80;
// O sharp identifica AVIF como "heif". HEIC (iPhone) também cai aqui, mas a leitura falha
// e o funcionário recebe a mensagem pedindo JPG ou PNG.
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "heif"]);

export interface ProcessedPhoto {
  content: Buffer;
  width: number;
  height: number;
}

export class InvalidPhotoError extends Error {}

/**
 * Padroniza a foto enviada pelo funcionário:
 * - confere o formato real do arquivo (não confia na extensão);
 * - corrige a rotação de fotos tiradas no celular;
 * - reduz para no máximo 1600px de largura e converte para WebP;
 * - remove metadados EXIF, que podem conter a localização GPS de quem tirou a foto.
 */
export async function processVehiclePhoto(input: Buffer): Promise<ProcessedPhoto> {
  const metadata = await sharp(input)
    .metadata()
    .catch(() => {
      throw new InvalidPhotoError("Arquivo não é uma imagem válida.");
    });

  if (!metadata.format || !ACCEPTED_FORMATS.has(metadata.format)) {
    throw new InvalidPhotoError("Use fotos em JPG, PNG ou WebP.");
  }

  try {
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: MAX_PHOTO_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });

    return { content: data, width: info.width, height: info.height };
  } catch {
    throw new InvalidPhotoError("Não foi possível ler esta imagem. Envie em JPG ou PNG.");
  }
}
