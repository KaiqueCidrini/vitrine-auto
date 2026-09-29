import {
  calculateResizedDimensions,
  MAX_UPLOAD_SIZE_IN_BYTES,
  needsResizeBeforeUpload,
} from "../domain/photo-upload-sizing";

/** Qualidades tentadas em ordem, até a foto caber no limite de envio. */
const JPEG_QUALITY_STEPS = [0.88, 0.8, 0.7];

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function toJpegFileName(originalName: string): string {
  return `${originalName.replace(/\.[^.]+$/, "") || "foto"}.jpg`;
}

/**
 * Reduz a foto no navegador (maior lado com até 2000px, em JPEG) antes do envio.
 * Se o navegador não conseguir ler o arquivo, envia o original: o servidor
 * valida o formato e devolve a mensagem de erro adequada.
 */
export async function preparePhotoForUpload(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    // "from-image" aplica a rotação do EXIF (fotos de celular tiradas na vertical).
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }

  try {
    const original = { width: bitmap.width, height: bitmap.height };
    if (!needsResizeBeforeUpload(original, file.size)) return file;

    const target = calculateResizedDimensions(original);
    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, target.width, target.height);

    for (const quality of JPEG_QUALITY_STEPS) {
      const blob = await canvasToJpeg(canvas, quality);
      if (blob && blob.size <= MAX_UPLOAD_SIZE_IN_BYTES) {
        return new File([blob], toJpegFileName(file.name), { type: "image/jpeg" });
      }
    }
    return file;
  } finally {
    bitmap.close();
  }
}
