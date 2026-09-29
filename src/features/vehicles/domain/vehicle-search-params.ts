import { z } from "zod";

import { BODY_TYPES, TRANSMISSIONS, type BodyType, type Transmission } from "./vehicle-attributes";

export const VEHICLE_SORT_OPTIONS = ["recent", "price-asc", "price-desc", "mileage-asc"] as const;
export type VehicleSortOption = (typeof VEHICLE_SORT_OPTIONS)[number];

export const VEHICLE_SORT_LABELS: Record<VehicleSortOption, string> = {
  recent: "Mais recentes",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  "mileage-asc": "Menor quilometragem",
};

export const VEHICLES_PER_PAGE = 12;

export interface VehicleSearchFilters {
  search?: string;
  brand?: string;
  bodyType?: BodyType;
  transmission?: Transmission;
  maxPriceInCents?: number;
  minYear?: number;
  sort: VehicleSortOption;
  page: number;
}

/**
 * Os parâmetros da URL ficam em português (?marca=fiat&precoMax=80000) porque
 * aparecem para o visitante e no Google. Valores inválidos são ignorados, nunca geram erro.
 */
export const SEARCH_PARAM_NAMES = {
  search: "busca",
  brand: "marca",
  bodyType: "carroceria",
  transmission: "cambio",
  maxPrice: "precoMax",
  minYear: "anoMin",
  sort: "ordem",
  page: "pagina",
} as const;

const optionalText = z
  .string()
  .trim()
  .max(80)
  .optional()
  .catch(undefined)
  .transform((value) => value || undefined);

const optionalPositiveInt = z.coerce.number().int().positive().optional().catch(undefined);

const searchParamsSchema = z.object({
  [SEARCH_PARAM_NAMES.search]: optionalText,
  [SEARCH_PARAM_NAMES.brand]: optionalText,
  [SEARCH_PARAM_NAMES.bodyType]: z.enum(BODY_TYPES).optional().catch(undefined),
  [SEARCH_PARAM_NAMES.transmission]: z.enum(TRANSMISSIONS).optional().catch(undefined),
  [SEARCH_PARAM_NAMES.maxPrice]: optionalPositiveInt,
  [SEARCH_PARAM_NAMES.minYear]: optionalPositiveInt,
  [SEARCH_PARAM_NAMES.sort]: z.enum(VEHICLE_SORT_OPTIONS).catch("recent"),
  [SEARCH_PARAM_NAMES.page]: z.coerce.number().int().min(1).catch(1),
});

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseVehicleSearchParams(rawParams: RawSearchParams): VehicleSearchFilters {
  const flattened = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, firstValue(value)]),
  );
  const parsed = searchParamsSchema.parse(flattened);
  const maxPriceInReais = parsed[SEARCH_PARAM_NAMES.maxPrice];

  return {
    search: parsed[SEARCH_PARAM_NAMES.search],
    brand: parsed[SEARCH_PARAM_NAMES.brand],
    bodyType: parsed[SEARCH_PARAM_NAMES.bodyType],
    transmission: parsed[SEARCH_PARAM_NAMES.transmission],
    maxPriceInCents: maxPriceInReais ? maxPriceInReais * 100 : undefined,
    minYear: parsed[SEARCH_PARAM_NAMES.minYear],
    sort: parsed[SEARCH_PARAM_NAMES.sort],
    page: parsed[SEARCH_PARAM_NAMES.page],
  };
}

/** Monta a URL da listagem preservando os filtros atuais e trocando só o que for informado. */
export function buildVehicleSearchHref(
  filters: Partial<VehicleSearchFilters>,
  basePath = "/veiculos",
): string {
  const params = new URLSearchParams();
  const entries: [string, string | number | undefined][] = [
    [SEARCH_PARAM_NAMES.search, filters.search],
    [SEARCH_PARAM_NAMES.brand, filters.brand],
    [SEARCH_PARAM_NAMES.bodyType, filters.bodyType],
    [SEARCH_PARAM_NAMES.transmission, filters.transmission],
    [
      SEARCH_PARAM_NAMES.maxPrice,
      filters.maxPriceInCents ? filters.maxPriceInCents / 100 : undefined,
    ],
    [SEARCH_PARAM_NAMES.minYear, filters.minYear],
    [SEARCH_PARAM_NAMES.sort, filters.sort === "recent" ? undefined : filters.sort],
    [SEARCH_PARAM_NAMES.page, filters.page && filters.page > 1 ? filters.page : undefined],
  ];

  for (const [key, value] of entries) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
