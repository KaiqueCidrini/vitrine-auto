import { Calendar, Cog, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";

import { TRANSMISSION_LABELS } from "../domain/vehicle-attributes";
import {
  buildVehicleTitle,
  formatMileage,
  formatPrice,
  formatYears,
} from "../domain/vehicle-formatters";
import type { VehicleSummary } from "../domain/vehicle-models";
import { VehiclePhotoPlaceholder } from "./vehicle-photo-placeholder";

interface VehicleCardProps {
  vehicle: VehicleSummary;
  /** Marque true só nos primeiros cards visíveis, para carregar a imagem com prioridade. */
  prioritizeImage?: boolean;
}

export function VehicleCard({ vehicle, prioritizeImage = false }: VehicleCardProps) {
  const title = buildVehicleTitle({ brand: vehicle.brand, model: vehicle.model });

  return (
    <article className="group border-border bg-surface relative flex w-full flex-col overflow-hidden rounded-lg border transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5">
      <div className="bg-foreground/5 relative aspect-[4/3] overflow-hidden">
        {vehicle.coverPhoto ? (
          <Image
            src={vehicle.coverPhoto.url}
            alt={`${title} ${vehicle.version ?? ""}`.trim()}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            loading={prioritizeImage ? "eager" : "lazy"}
            fetchPriority={prioritizeImage ? "high" : "auto"}
          />
        ) : (
          <VehiclePhotoPlaceholder />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.status === "sold" && <Badge tone="danger">Vendido</Badge>}
          {vehicle.isFeatured && vehicle.status === "published" && (
            <Badge tone="accent">Destaque</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg leading-tight font-bold">
            {/* O link cobre o card inteiro (::after), mantendo um único alvo acessível. */}
            <Link href={`/veiculos/${vehicle.slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h3>
          {vehicle.version && (
            <p className="text-muted-foreground mt-1 truncate text-sm">{vehicle.version}</p>
          )}
        </div>

        <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <li className="flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden />
            {formatYears(vehicle.manufactureYear, vehicle.modelYear)}
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge className="size-3.5" aria-hidden />
            {formatMileage(vehicle.mileageKm)}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="size-3.5" aria-hidden />
            {TRANSMISSION_LABELS[vehicle.transmission]}
          </li>
        </ul>

        <p className="text-primary mt-auto pt-2 text-2xl font-extrabold tracking-tight">
          {formatPrice(vehicle.priceInCents)}
        </p>
      </div>
    </article>
  );
}
