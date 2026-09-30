import { Reveal } from "@/shared/ui/reveal";

import type { VehicleSummary } from "../domain/vehicle-models";
import { VehicleCard } from "./vehicle-card";

const PRIORITY_IMAGE_COUNT = 3;
const COLUMNS_ON_DESKTOP = 3;
const STAGGER_DELAY_MS = 90;

export function VehicleGrid({ vehicles }: { vehicles: VehicleSummary[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle, index) => (
        <li key={vehicle.id} className="flex">
          {/* Escalona por coluna: cada linha nova começa sem atraso acumulado. */}
          <Reveal delay={(index % COLUMNS_ON_DESKTOP) * STAGGER_DELAY_MS} className="flex w-full">
            <VehicleCard vehicle={vehicle} prioritizeImage={index < PRIORITY_IMAGE_COUNT} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
