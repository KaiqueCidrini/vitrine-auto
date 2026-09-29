import type { VehicleSummary } from "../domain/vehicle-models";
import { VehicleCard } from "./vehicle-card";

const PRIORITY_IMAGE_COUNT = 3;

export function VehicleGrid({ vehicles }: { vehicles: VehicleSummary[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle, index) => (
        <li key={vehicle.id} className="flex">
          <VehicleCard vehicle={vehicle} prioritizeImage={index < PRIORITY_IMAGE_COUNT} />
        </li>
      ))}
    </ul>
  );
}
