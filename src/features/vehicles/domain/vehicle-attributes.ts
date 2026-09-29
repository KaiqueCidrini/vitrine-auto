/**
 * Valores fixos que descrevem um veículo. Ficam fora do schema do banco
 * para poderem ser usados também em componentes do navegador.
 */

export const TRANSMISSIONS = ["manual", "automatic", "cvt", "automated"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  manual: "Manual",
  automatic: "Automático",
  cvt: "CVT",
  automated: "Automatizado",
};

export const FUEL_TYPES = ["flex", "gasoline", "ethanol", "diesel", "hybrid", "electric"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  flex: "Flex",
  gasoline: "Gasolina",
  ethanol: "Etanol",
  diesel: "Diesel",
  hybrid: "Híbrido",
  electric: "Elétrico",
};

export const BODY_TYPES = [
  "hatch",
  "sedan",
  "suv",
  "pickup",
  "van",
  "coupe",
  "convertible",
  "wagon",
] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  hatch: "Hatch",
  sedan: "Sedã",
  suv: "SUV",
  pickup: "Picape",
  van: "Van",
  coupe: "Cupê",
  convertible: "Conversível",
  wagon: "Perua",
};

export const VEHICLE_STATUSES = ["draft", "published", "sold"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  sold: "Vendido",
};

/** Status visíveis para o público (um vendido continua acessível pelo link). */
export const PUBLICLY_VISIBLE_STATUSES: readonly VehicleStatus[] = ["published", "sold"];

export const MAX_PHOTOS_PER_VEHICLE = 20;
export const MIN_VEHICLE_YEAR = 1950;
