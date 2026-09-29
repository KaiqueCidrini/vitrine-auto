/**
 * Regras de tamanho das fotos enviadas pelo painel.
 *
 * O navegador reduz a foto antes do envio: o upload fica mais rápido no celular e
 * cabe no limite de 4,5 MB por requisição de plataformas serverless (ex.: Vercel).
 * O servidor ainda reduz para 1600px ao salvar, então 2000px aqui não perde qualidade.
 */

export const MAX_UPLOAD_DIMENSION = 2000;
/** Abaixo do limite de 4,5 MB da Vercel, com folga para os dados extras do envio. */
export const MAX_UPLOAD_SIZE_IN_BYTES = 4 * 1024 * 1024;

export interface ImageDimensions {
  width: number;
  height: number;
}

/** Mantém a proporção e limita o maior lado. Imagens menores ficam como estão. */
export function calculateResizedDimensions(
  { width, height }: ImageDimensions,
  maxDimension = MAX_UPLOAD_DIMENSION,
): ImageDimensions {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxDimension) return { width, height };

  const scale = maxDimension / largestSide;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

/** Só vale reprocessar no navegador se a foto for grande em pixels ou em bytes. */
export function needsResizeBeforeUpload(dimensions: ImageDimensions, sizeInBytes: number): boolean {
  const largestSide = Math.max(dimensions.width, dimensions.height);
  return largestSide > MAX_UPLOAD_DIMENSION || sizeInBytes > MAX_UPLOAD_SIZE_IN_BYTES;
}
