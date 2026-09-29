import { z } from "zod";

import {
  BODY_TYPES,
  FUEL_TYPES,
  MAX_PHOTOS_PER_VEHICLE,
  MIN_VEHICLE_YEAR,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
} from "./vehicle-attributes";
import { parsePriceToCents } from "./vehicle-formatters";

/** Opcionais mais comuns, exibidos como caixas de seleção no cadastro. */
export const COMMON_FEATURES = [
  "Ar-condicionado",
  "Direção elétrica",
  "Vidros elétricos",
  "Travas elétricas",
  "Airbags",
  "Freios ABS",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Central multimídia",
  "Android Auto / Apple CarPlay",
  "Piloto automático",
  "Bancos de couro",
  "Rodas de liga leve",
  "Teto solar",
  "Chave presencial",
  "Carregador por indução",
] as const;

export const vehiclePhotoInputSchema = z.object({
  storageKey: z.string().regex(/^vehicles\/[a-f0-9-]+\.webp$/, "Foto inválida"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type VehiclePhotoInput = z.infer<typeof vehiclePhotoInputSchema>;

const latestAcceptedYear = () => new Date().getFullYear() + 1;

const yearField = (label: string) =>
  z.coerce
    .number({ message: `Informe o ${label}` })
    .int(`Informe o ${label}`)
    .min(MIN_VEHICLE_YEAR, `Informe o ${label}`)
    .refine((year) => year <= latestAcceptedYear(), `${label} inválido`);

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Use no máximo ${maxLength} caracteres`)
    .transform((value) => value || null);

export const vehicleFormSchema = z
  .object({
    brand: z.string().trim().min(2, "Informe a marca").max(60),
    model: z.string().trim().min(1, "Informe o modelo").max(80),
    version: optionalText(120),
    manufactureYear: yearField("ano de fabricação"),
    modelYear: yearField("ano do modelo"),
    mileageKm: z.coerce
      .number({ message: "Informe a quilometragem" })
      .int("Use apenas números")
      .min(0, "Quilometragem inválida")
      .max(2_000_000, "Quilometragem inválida"),
    priceInCents: z
      .string()
      .transform((value) => parsePriceToCents(value))
      .pipe(
        z.number({ message: "Informe um preço válido. Ex.: 89.900" }).positive("Informe o preço"),
      ),
    transmission: z.enum(TRANSMISSIONS, { message: "Escolha o câmbio" }),
    fuelType: z.enum(FUEL_TYPES, { message: "Escolha o combustível" }),
    bodyType: z.enum(BODY_TYPES, { message: "Escolha a carroceria" }),
    color: z.string().trim().min(2, "Informe a cor").max(40),
    doors: z
      .string()
      .transform((value) => (value ? Number(value) : null))
      .pipe(z.number().int().min(2).max(5).nullable()),
    description: optionalText(5000),
    features: z.array(z.string().trim().min(1).max(60)).max(40),
    status: z.enum(VEHICLE_STATUSES),
    isFeatured: z.boolean(),
    photos: z
      .array(vehiclePhotoInputSchema)
      .max(MAX_PHOTOS_PER_VEHICLE, "Fotos demais")
      .refine(
        (photos) => new Set(photos.map((photo) => photo.storageKey)).size === photos.length,
        "A mesma foto foi adicionada duas vezes",
      ),
  })
  .refine(
    (data) => data.modelYear >= data.manufactureYear && data.modelYear <= data.manufactureYear + 1,
    {
      path: ["modelYear"],
      message: "O ano do modelo deve ser igual ou 1 ano após o de fabricação",
    },
  )
  .refine((data) => data.status === "draft" || data.photos.length > 0, {
    path: ["photos"],
    message: "Adicione ao menos uma foto para publicar o anúncio",
  });

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

/** Separa opcionais digitados por vírgula ou quebra de linha e remove repetidos. */
export function mergeFeatures(selected: string[], extraText: string): string[] {
  const extras = extraText.split(/[,\n]/).map((feature) => feature.trim());
  return [...new Set([...selected, ...extras].filter(Boolean))];
}

function readPhotos(rawValue: FormDataEntryValue | null): unknown {
  if (typeof rawValue !== "string" || rawValue === "") return [];
  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

/** Converte o FormData do formulário no objeto que o schema valida. */
export function readVehicleFormData(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");
  const selectedFeatures = formData.getAll("features").map(String);

  return {
    brand: text("brand"),
    model: text("model"),
    version: text("version"),
    manufactureYear: text("manufactureYear"),
    modelYear: text("modelYear"),
    mileageKm: text("mileageKm").replace(/\D/g, ""),
    priceInCents: text("price"),
    transmission: text("transmission"),
    fuelType: text("fuelType"),
    bodyType: text("bodyType"),
    color: text("color"),
    doors: text("doors"),
    description: text("description"),
    features: mergeFeatures(selectedFeatures, text("extraFeatures")),
    status: text("status"),
    isFeatured: formData.get("isFeatured") === "on",
    photos: readPhotos(formData.get("photos")),
  };
}
