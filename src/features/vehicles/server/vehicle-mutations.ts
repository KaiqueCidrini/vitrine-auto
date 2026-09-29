import "server-only";

import { randomUUID } from "node:crypto";

import { count, eq, inArray } from "drizzle-orm";

import { getDatabase, type Database } from "@/shared/db/database";
import { vehiclePhotos, vehicles } from "@/shared/db/schema";
import { getFileStorage } from "@/shared/storage/get-file-storage";

import { buildVehicleSlug } from "../domain/build-vehicle-slug";
import type { VehicleStatus } from "../domain/vehicle-attributes";
import type { VehicleFormData, VehiclePhotoInput } from "../domain/vehicle-form-schema";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

/** A foto enviada não existe mais ou já pertence a outro anúncio (ex.: formulário aberto há muito tempo). */
export class UnavailablePhotoError extends Error {}

/**
 * As chaves das fotos chegam do navegador: antes de ligar uma foto nova ao anúncio,
 * confirma que o arquivo existe e que não está em uso por outro veículo.
 */
async function assertNewPhotosAreAvailable(
  transaction: Transaction,
  photos: VehiclePhotoInput[],
  keysAlreadyInVehicle: ReadonlySet<string>,
): Promise<void> {
  const newKeys = photos
    .map((photo) => photo.storageKey)
    .filter((key) => !keysAlreadyInVehicle.has(key));
  if (newKeys.length === 0) return;

  const [{ total: keysInUse }] = await transaction
    .select({ total: count() })
    .from(vehiclePhotos)
    .where(inArray(vehiclePhotos.storageKey, newKeys));
  if (keysInUse > 0) throw new UnavailablePhotoError("Foto já usada em outro anúncio.");

  const storage = getFileStorage();
  const existence = await Promise.all(newKeys.map((key) => storage.exists(key)));
  if (existence.includes(false)) throw new UnavailablePhotoError("Arquivo da foto não encontrado.");
}

function toVehicleColumns(input: VehicleFormData) {
  const { photos: _photos, ...columns } = input;
  return columns;
}

/** Registra a data da primeira publicação; vendido mantém a data original. */
function resolvePublishedAt(status: VehicleStatus, currentPublishedAt: Date | null): Date | null {
  if (status === "draft") return currentPublishedAt;
  return currentPublishedAt ?? new Date();
}

async function replacePhotos(
  transaction: Transaction,
  vehicleId: string,
  photos: VehiclePhotoInput[],
) {
  await transaction.delete(vehiclePhotos).where(eq(vehiclePhotos.vehicleId, vehicleId));
  if (photos.length === 0) return;

  await transaction
    .insert(vehiclePhotos)
    .values(photos.map((photo, position) => ({ vehicleId, position, ...photo })));
}

export async function createVehicle(
  input: VehicleFormData,
  createdById: string | null,
): Promise<{ id: string; slug: string }> {
  const id = randomUUID();
  const slug = buildVehicleSlug({ id, ...input });

  await getDatabase().transaction(async (transaction) => {
    await assertNewPhotosAreAvailable(transaction, input.photos, new Set());
    await transaction.insert(vehicles).values({
      id,
      slug,
      createdById,
      publishedAt: resolvePublishedAt(input.status, null),
      ...toVehicleColumns(input),
    });
    await replacePhotos(transaction, id, input.photos);
  });

  return { id, slug };
}

/**
 * Atualiza os dados e a lista de fotos. Retorna as fotos que saíram do anúncio,
 * para que o arquivo seja apagado do storage depois que a transação confirmar.
 */
export async function updateVehicle(
  id: string,
  input: VehicleFormData,
): Promise<{ slug: string; removedStorageKeys: string[] } | null> {
  return getDatabase().transaction(async (transaction) => {
    const current = await transaction.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
      columns: { publishedAt: true },
      with: { photos: { columns: { storageKey: true } } },
    });
    if (!current) return null;

    const currentKeys = new Set(current.photos.map((photo) => photo.storageKey));
    await assertNewPhotosAreAvailable(transaction, input.photos, currentKeys);

    const slug = buildVehicleSlug({ id, ...input });
    await transaction
      .update(vehicles)
      .set({
        slug,
        publishedAt: resolvePublishedAt(input.status, current.publishedAt),
        ...toVehicleColumns(input),
      })
      .where(eq(vehicles.id, id));
    await replacePhotos(transaction, id, input.photos);

    const keptKeys = new Set(input.photos.map((photo) => photo.storageKey));
    const removedStorageKeys = [...currentKeys].filter((key) => !keptKeys.has(key));

    return { slug, removedStorageKeys };
  });
}

export type StatusChangeResult = "updated" | "not-found" | "missing-photos";

export async function updateVehicleStatus(
  id: string,
  status: VehicleStatus,
): Promise<StatusChangeResult> {
  return getDatabase().transaction(async (transaction) => {
    const current = await transaction.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
      columns: { publishedAt: true },
      with: { photos: { columns: { id: true }, limit: 1 } },
    });
    if (!current) return "not-found";
    // Mesma regra do formulário: anúncio público precisa de pelo menos uma foto.
    if (status !== "draft" && current.photos.length === 0) return "missing-photos";

    await transaction
      .update(vehicles)
      .set({ status, publishedAt: resolvePublishedAt(status, current.publishedAt) })
      .where(eq(vehicles.id, id));
    return "updated";
  });
}

/** Exclui o anúncio (as fotos saem junto por ON DELETE CASCADE) e devolve as chaves dos arquivos. */
export async function deleteVehicle(id: string): Promise<string[] | null> {
  return getDatabase().transaction(async (transaction) => {
    const photos = await transaction
      .select({ storageKey: vehiclePhotos.storageKey })
      .from(vehiclePhotos)
      .where(eq(vehiclePhotos.vehicleId, id));

    const deleted = await transaction
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id });
    if (deleted.length === 0) return null;

    return photos.map((photo) => photo.storageKey);
  });
}
