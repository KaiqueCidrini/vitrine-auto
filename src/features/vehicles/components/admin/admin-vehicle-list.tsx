import Image from "next/image";
import Link from "next/link";

import { Badge, type BadgeTone } from "@/shared/ui/badge";

import { VEHICLE_STATUS_LABELS, type VehicleStatus } from "../../domain/vehicle-attributes";
import {
  buildVehicleTitle,
  formatMileage,
  formatPrice,
  formatYears,
} from "../../domain/vehicle-formatters";
import type { AdminVehicleListItem } from "../../domain/vehicle-models";
import { VehiclePhotoPlaceholder } from "../vehicle-photo-placeholder";
import { VehicleRowActions } from "./vehicle-row-actions";

const STATUS_TONES: Record<VehicleStatus, BadgeTone> = {
  draft: "neutral",
  published: "success",
  sold: "danger",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function AdminVehicleList({ vehicles }: { vehicles: AdminVehicleListItem[] }) {
  return (
    <ul className="divide-border border-border bg-surface divide-y overflow-hidden rounded-lg border">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="bg-foreground/5 relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md sm:w-32">
            {vehicle.coverPhoto ? (
              <Image
                src={vehicle.coverPhoto.url}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <VehiclePhotoPlaceholder />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONES[vehicle.status]}>
                {VEHICLE_STATUS_LABELS[vehicle.status]}
              </Badge>
              {vehicle.isFeatured && <Badge tone="accent">Destaque</Badge>}
            </div>
            <p className="mt-1.5 truncate font-bold">
              {vehicle.status === "draft" ? (
                buildVehicleTitle(vehicle)
              ) : (
                <Link
                  href={`/veiculos/${vehicle.slug}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {buildVehicleTitle(vehicle)}
                </Link>
              )}
            </p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {formatYears(vehicle.manufactureYear, vehicle.modelYear)} ·{" "}
              {formatMileage(vehicle.mileageKm)} ·{" "}
              <span className="text-foreground font-semibold">
                {formatPrice(vehicle.priceInCents)}
              </span>
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {vehicle.photoCount} {vehicle.photoCount === 1 ? "foto" : "fotos"} · atualizado em{" "}
              {dateFormatter.format(vehicle.updatedAt)}
            </p>
          </div>

          <VehicleRowActions
            vehicleId={vehicle.id}
            status={vehicle.status}
            hasPhotos={vehicle.photoCount > 0}
          />
        </li>
      ))}
    </ul>
  );
}
