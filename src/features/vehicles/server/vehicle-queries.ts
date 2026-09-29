import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { getDatabase } from "@/shared/db/database";
import { vehiclePhotos, vehicles } from "@/shared/db/schema";
import { getFileStorage } from "@/shared/storage/get-file-storage";

import {
  PUBLICLY_VISIBLE_STATUSES,
  type BodyType,
  type VehicleStatus,
} from "../domain/vehicle-attributes";
import type {
  AdminVehicleListItem,
  PaginatedResult,
  VehicleDetails,
  VehiclePhotoView,
  VehicleSummary,
} from "../domain/vehicle-models";
import {
  VEHICLES_PER_PAGE,
  type VehicleSearchFilters,
  type VehicleSortOption,
} from "../domain/vehicle-search-params";

type VehicleRow = typeof vehicles.$inferSelect;
type PhotoRow = typeof vehiclePhotos.$inferSelect;

/** Fotos na ordem definida pelo funcionário (a primeira é a capa). */
function photosInOrder(limit?: number) {
  return { orderBy: [asc(vehiclePhotos.position)], limit };
}

function toPhotoView(photo: PhotoRow): VehiclePhotoView {
  return {
    storageKey: photo.storageKey,
    url: getFileStorage().getPublicUrl(photo.storageKey),
    width: photo.width,
    height: photo.height,
  };
}

function toVehicleSummary(row: VehicleRow & { photos: PhotoRow[] }): VehicleSummary {
  const [cover] = row.photos;
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    version: row.version,
    manufactureYear: row.manufactureYear,
    modelYear: row.modelYear,
    mileageKm: row.mileageKm,
    priceInCents: row.priceInCents,
    transmission: row.transmission,
    fuelType: row.fuelType,
    status: row.status,
    isFeatured: row.isFeatured,
    coverPhoto: cover ? toPhotoView(cover) : null,
  };
}

function toVehicleDetails(row: VehicleRow & { photos: PhotoRow[] }): VehicleDetails {
  return {
    ...toVehicleSummary(row),
    bodyType: row.bodyType,
    color: row.color,
    doors: row.doors,
    description: row.description,
    features: row.features,
    photos: row.photos.map(toPhotoView),
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  };
}

/** Escapa % e _ para que o texto digitado seja buscado literalmente no ILIKE. */
function containsText(text: string): string {
  return `%${text.replace(/[\\%_]/g, (character) => `\\${character}`)}%`;
}

function buildPublicFilterConditions(filters: VehicleSearchFilters): SQL | undefined {
  const conditions: (SQL | undefined)[] = [eq(vehicles.status, "published")];

  if (filters.search) {
    const pattern = containsText(filters.search);
    conditions.push(
      or(
        ilike(vehicles.brand, pattern),
        ilike(vehicles.model, pattern),
        ilike(vehicles.version, pattern),
      ),
    );
  }
  if (filters.brand) conditions.push(ilike(vehicles.brand, filters.brand));
  if (filters.bodyType) conditions.push(eq(vehicles.bodyType, filters.bodyType));
  if (filters.transmission) conditions.push(eq(vehicles.transmission, filters.transmission));
  if (filters.maxPriceInCents) conditions.push(lte(vehicles.priceInCents, filters.maxPriceInCents));
  if (filters.minYear) conditions.push(gte(vehicles.modelYear, filters.minYear));

  return and(...conditions);
}

const SORT_ORDER: Record<VehicleSortOption, SQL[]> = {
  recent: [desc(vehicles.publishedAt), desc(vehicles.createdAt)],
  "price-asc": [asc(vehicles.priceInCents)],
  "price-desc": [desc(vehicles.priceInCents)],
  "mileage-asc": [asc(vehicles.mileageKm)],
};

export async function searchPublishedVehicles(
  filters: VehicleSearchFilters,
): Promise<PaginatedResult<VehicleSummary>> {
  const database = getDatabase();
  const where = buildPublicFilterConditions(filters);

  const totalItems = await database.$count(vehicles, where);
  const totalPages = Math.max(1, Math.ceil(totalItems / VEHICLES_PER_PAGE));
  const currentPage = Math.min(filters.page, totalPages);

  const rows = await database.query.vehicles.findMany({
    where,
    orderBy: SORT_ORDER[filters.sort],
    limit: VEHICLES_PER_PAGE,
    offset: (currentPage - 1) * VEHICLES_PER_PAGE,
    with: { photos: photosInOrder(1) },
  });

  return { items: rows.map(toVehicleSummary), totalItems, totalPages, currentPage };
}

/** Destaques marcados pela equipe; completa com os mais recentes se faltar. */
export async function findFeaturedVehicles(limit: number): Promise<VehicleSummary[]> {
  const rows = await getDatabase().query.vehicles.findMany({
    where: eq(vehicles.status, "published"),
    orderBy: [desc(vehicles.isFeatured), desc(vehicles.publishedAt)],
    limit,
    with: { photos: photosInOrder(1) },
  });
  return rows.map(toVehicleSummary);
}

export async function findPublicVehicleBySlug(slug: string): Promise<VehicleDetails | null> {
  const row = await getDatabase().query.vehicles.findFirst({
    where: and(eq(vehicles.slug, slug), inArray(vehicles.status, [...PUBLICLY_VISIBLE_STATUSES])),
    with: { photos: photosInOrder() },
  });
  return row ? toVehicleDetails(row) : null;
}

export async function findSimilarVehicles(
  vehicle: VehicleDetails,
  limit = 3,
): Promise<VehicleSummary[]> {
  const rows = await getDatabase().query.vehicles.findMany({
    where: and(
      eq(vehicles.status, "published"),
      sql`${vehicles.id} <> ${vehicle.id}`,
      or(eq(vehicles.bodyType, vehicle.bodyType), eq(vehicles.brand, vehicle.brand)),
    ),
    orderBy: [sql`abs(${vehicles.priceInCents} - ${vehicle.priceInCents})`],
    limit,
    with: { photos: photosInOrder(1) },
  });
  return rows.map(toVehicleSummary);
}

/** Marcas com carros publicados, para o filtro da listagem. */
export async function listPublishedBrands(): Promise<string[]> {
  const rows = await getDatabase()
    .selectDistinct({ brand: vehicles.brand })
    .from(vehicles)
    .where(eq(vehicles.status, "published"))
    .orderBy(asc(vehicles.brand));
  return rows.map((row) => row.brand);
}

export async function findVehicleForEditing(id: string): Promise<VehicleDetails | null> {
  const row = await getDatabase().query.vehicles.findFirst({
    where: eq(vehicles.id, id),
    with: { photos: photosInOrder() },
  });
  return row ? toVehicleDetails(row) : null;
}

export async function listVehiclesForAdmin(filters: {
  status?: VehicleStatus;
  search?: string;
}): Promise<AdminVehicleListItem[]> {
  const conditions: (SQL | undefined)[] = [];
  if (filters.status) conditions.push(eq(vehicles.status, filters.status));
  if (filters.search) {
    const pattern = containsText(filters.search);
    conditions.push(or(ilike(vehicles.brand, pattern), ilike(vehicles.model, pattern)));
  }

  const rows = await getDatabase().query.vehicles.findMany({
    where: and(...conditions),
    orderBy: [desc(vehicles.updatedAt)],
    with: { photos: photosInOrder() },
  });

  return rows.map((row) => ({
    ...toVehicleSummary(row),
    updatedAt: row.updatedAt,
    photoCount: row.photos.length,
  }));
}

/** Quantidade de carros publicados por carroceria (só as que têm estoque). */
export async function countPublishedVehiclesByBodyType(): Promise<
  { bodyType: BodyType; total: number }[]
> {
  return getDatabase()
    .select({ bodyType: vehicles.bodyType, total: count() })
    .from(vehicles)
    .where(eq(vehicles.status, "published"))
    .groupBy(vehicles.bodyType)
    .orderBy(desc(count()));
}

/**
 * O slug muda quando o funcionário corrige marca, modelo, versão ou ano, mas termina
 * sempre com o início do id. Isso permite achar o anúncio a partir de um link antigo.
 */
export async function findPublicVehicleSlugByIdPrefix(idPrefix: string): Promise<string | null> {
  if (!/^[0-9a-f]{6}$/.test(idPrefix)) return null;

  const rows = await getDatabase()
    .select({ slug: vehicles.slug })
    .from(vehicles)
    .where(
      and(
        sql`${vehicles.id}::text like ${`${idPrefix}%`}`,
        inArray(vehicles.status, [...PUBLICLY_VISIBLE_STATUSES]),
      ),
    )
    .limit(2);
  // Dois anúncios com o mesmo prefixo (raríssimo): na dúvida, não redireciona.
  return rows.length === 1 ? rows[0].slug : null;
}
