const SLUG_ID_LENGTH = 6;

interface VehicleSlugParts {
  id: string;
  brand: string;
  model: string;
  version?: string | null;
  modelYear: number;
}

/** "Onix LT 1.0 Turbo" → "onix-lt-1-0-turbo" (sem acentos, só letras, números e hífen). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Gera a URL amigável do anúncio, ex.: "chevrolet-onix-lt-1-0-2023-3f9a1c".
 * O trecho final do id garante unicidade entre carros iguais no estoque.
 */
export function buildVehicleSlug({
  id,
  brand,
  model,
  version,
  modelYear,
}: VehicleSlugParts): string {
  const idSuffix = id.replace(/-/g, "").slice(0, SLUG_ID_LENGTH);
  return slugify([brand, model, version, modelYear, idSuffix].filter(Boolean).join(" "));
}
