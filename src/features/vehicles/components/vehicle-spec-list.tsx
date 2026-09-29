import { Calendar, CarFront, Cog, DoorOpen, Fuel, Gauge, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  BODY_TYPE_LABELS,
  FUEL_TYPE_LABELS,
  TRANSMISSION_LABELS,
} from "../domain/vehicle-attributes";
import { formatMileage, formatYears } from "../domain/vehicle-formatters";
import type { VehicleDetails } from "../domain/vehicle-models";

interface Spec {
  icon: LucideIcon;
  label: string;
  value: string;
}

function buildSpecs(vehicle: VehicleDetails): Spec[] {
  const specs: Spec[] = [
    {
      icon: Calendar,
      label: "Ano",
      value: formatYears(vehicle.manufactureYear, vehicle.modelYear),
    },
    { icon: Gauge, label: "Quilometragem", value: formatMileage(vehicle.mileageKm) },
    { icon: Cog, label: "Câmbio", value: TRANSMISSION_LABELS[vehicle.transmission] },
    { icon: Fuel, label: "Combustível", value: FUEL_TYPE_LABELS[vehicle.fuelType] },
    { icon: CarFront, label: "Carroceria", value: BODY_TYPE_LABELS[vehicle.bodyType] },
    { icon: Palette, label: "Cor", value: vehicle.color },
  ];
  if (vehicle.doors) specs.push({ icon: DoorOpen, label: "Portas", value: String(vehicle.doors) });
  return specs;
}

export function VehicleSpecList({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {buildSpecs(vehicle).map(({ icon: Icon, label, value }) => (
        <div key={label} className="border-border bg-surface rounded-md border p-3.5">
          <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Icon className="size-3.5" aria-hidden /> {label}
          </dt>
          <dd className="mt-1 font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
