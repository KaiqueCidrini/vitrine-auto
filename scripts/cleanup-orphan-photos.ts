/**
 * Apaga fotos enviadas há mais de 24h que não pertencem a nenhum anúncio.
 * Uso: npm run photos:cleanup   (agende no cron do servidor, ex.: 1x por dia)
 */
import { getDatabase } from "@/shared/db/database";
import { describeDatabaseError } from "@/shared/db/describe-database-error";
import { vehiclePhotos } from "@/shared/db/schema";
import { getFileStorage } from "@/shared/storage/get-file-storage";

import { findOrphanPhotos } from "@/features/vehicles/domain/find-orphan-photos";

const GRACE_PERIOD_IN_MS = 24 * 60 * 60 * 1000;
const PHOTOS_PREFIX = "vehicles";

async function cleanupOrphanPhotos(): Promise<void> {
  const storage = getFileStorage();
  const referencedRows = await getDatabase()
    .select({ storageKey: vehiclePhotos.storageKey })
    .from(vehiclePhotos);
  const referencedKeys = new Set(referencedRows.map((row) => row.storageKey));

  const orphanKeys = findOrphanPhotos(
    await storage.list(PHOTOS_PREFIX),
    referencedKeys,
    new Date(Date.now() - GRACE_PERIOD_IN_MS),
  );

  for (const key of orphanKeys) {
    await storage.delete(key);
  }
  console.log(`${orphanKeys.length} foto(s) órfã(s) removida(s).`);
}

cleanupOrphanPhotos()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(`Falha na limpeza de fotos: ${describeDatabaseError(error)}`);
    process.exit(1);
  });
