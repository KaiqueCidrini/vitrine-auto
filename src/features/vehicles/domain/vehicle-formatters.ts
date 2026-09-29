const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("pt-BR");

/** 8990000 → "R$ 89.900" (Intl usa espaço não separável entre R$ e o valor). */
export function formatPrice(priceInCents: number): string {
  return priceFormatter.format(priceInCents / 100);
}

/** 45000 → "45.000 km" */
export function formatMileage(mileageKm: number): string {
  return mileageKm === 0 ? "0 km" : `${integerFormatter.format(mileageKm)} km`;
}

/** 2022, 2023 → "2022/2023" */
export function formatYears(manufactureYear: number, modelYear: number): string {
  return `${manufactureYear}/${modelYear}`;
}

interface VehicleNameParts {
  brand: string;
  model: string;
  version?: string | null;
}

/** "Chevrolet", "Onix", "LT 1.0" → "Chevrolet Onix LT 1.0" */
export function buildVehicleTitle({ brand, model, version }: VehicleNameParts): string {
  return [brand, model, version].filter(Boolean).join(" ");
}

/**
 * Converte o preço digitado pelo funcionário para centavos.
 * Aceita "R$ 89.900,50", "89.900", "89900" ou "89900,5". Retorna null se não for um valor válido.
 */
export function parsePriceToCents(input: string): number | null {
  const normalized = input
    .replace(/R\$\s?/i, "")
    .replace(/\s/g, "")
    .trim();
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(normalized)) return null;

  const [integerPart, decimalPart = ""] = normalized.replace(/\./g, "").split(",");
  const cents = Number(integerPart) * 100 + Number(decimalPart.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

/** 8990050 → "89.900,50" (formato usado para preencher o campo de edição). */
export function formatCentsForInput(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(priceInCents / 100);
}
