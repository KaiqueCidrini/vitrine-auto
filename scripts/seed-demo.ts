/**
 * Popula o banco com um estoque fictício e fotos ilustrativas, para demonstração.
 * Uso: npm run demo:seed            (só roda com o banco sem veículos)
 *      npm run demo:seed -- --force (adiciona mesmo que já existam veículos)
 */
import { randomUUID } from "node:crypto";
import { parseArgs } from "node:util";

import { asc } from "drizzle-orm";

import { createVehicle } from "@/features/vehicles/server/vehicle-mutations";
import { getDatabase } from "@/shared/db/database";
import { describeDatabaseError } from "@/shared/db/describe-database-error";
import { users, vehicles } from "@/shared/db/schema";
import { getFileStorage } from "@/shared/storage/get-file-storage";

import { DEMO_VEHICLES } from "./demo/demo-vehicles";
import { renderDemoPhoto } from "./demo/render-demo-photo";

const PHOTOS_PER_VEHICLE = 3;

async function seedDemo(): Promise<void> {
  const { values } = parseArgs({ options: { force: { type: "boolean", default: false } } });
  const database = getDatabase();

  const existingVehicles = await database.$count(vehicles);
  if (existingVehicles > 0 && !values.force) {
    console.log(
      `O banco já tem ${existingVehicles} veículo(s). Use --force para adicionar a demonstração mesmo assim.`,
    );
    return;
  }

  const [author] = await database
    .select({ id: users.id })
    .from(users)
    .orderBy(asc(users.createdAt))
    .limit(1);
  const storage = getFileStorage();

  for (const { colorHex, ...vehicleData } of DEMO_VEHICLES) {
    const photos = [];
    for (let variant = 0; variant < PHOTOS_PER_VEHICLE; variant++) {
      const photo = await renderDemoPhoto(vehicleData.bodyType, colorHex, variant);
      const storageKey = `vehicles/${randomUUID()}.webp`;
      await storage.save(storageKey, photo.content, "image/webp");
      photos.push({ storageKey, width: photo.width, height: photo.height });
    }

    const { slug } = await createVehicle({ ...vehicleData, photos }, author?.id ?? null);
    console.log(`  + ${slug}`);
  }

  console.log(`${DEMO_VEHICLES.length} veículos de demonstração criados.`);
}

seedDemo()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(`Falha ao criar a demonstração: ${describeDatabaseError(error)}`);
    process.exit(1);
  });
