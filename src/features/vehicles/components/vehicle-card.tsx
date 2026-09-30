import { ArrowUpRight } from "lucide-react";
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
  const specs = [
    formatYears(vehicle.manufactureYear, vehicle.modelYear),
    formatMileage(vehicle.mileageKm),
    TRANSMISSION_LABELS[vehicle.transmission],
  ];

  return (
    <article className="group relative flex w-full flex-col">
      <div className="bg-foreground/5 relative aspect-[4/3] overflow-hidden rounded-lg">
        {vehicle.coverPhoto ? (
          <Image
            src={vehicle.coverPhoto.url}
            alt={`${title} ${vehicle.version ?? ""}`.trim()}
            fill
            sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 90vw"
            className="ease-premium object-cover transition duration-1000 group-hover:scale-[1.06]"
            loading={prioritizeImage ? "eager" : "lazy"}
            fetchPriority={prioritizeImage ? "high" : "auto"}
          />
        ) : (
          <VehiclePhotoPlaceholder />
        )}
        <div
          aria-hidden
          className="ease-premium absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-700 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.status === "sold" && (
            <Badge tone="danger" className="bg-danger text-white">
              Vendido
            </Badge>
          )}
          {vehicle.isFeatured && vehicle.status === "published" && (
            <Badge tone="accent">Destaque</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-muted-foreground">{vehicle.brand}</p>
        <h3 className="font-display mt-2 text-2xl leading-tight">
          {/* O link cobre o card inteiro (::after), mantendo um único alvo acessível. */}
          <Link
            href={`/veiculos/${vehicle.slug}`}
            className="focus-visible:after:outline-primary after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-4"
          >
            <span className="sr-only">{vehicle.brand} </span>
            {vehicle.model}
          </Link>
        </h3>
        {vehicle.version && (
          <p className="text-muted-foreground mt-1 truncate text-sm">{vehicle.version}</p>
        )}

        <ul className="text-muted-foreground mt-4 mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {specs.map((spec, index) => (
            <li key={spec} className="flex items-center gap-2">
              {index > 0 && <span className="size-1 rounded-full bg-current/40" aria-hidden />}
              {spec}
            </li>
          ))}
        </ul>

        <div className="border-border mt-auto flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-2xl font-semibold tracking-tight">
            {formatPrice(vehicle.priceInCents)}
          </p>
          <span
            aria-hidden
            className="border-border ease-premium group-hover:bg-primary group-hover:text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full border transition duration-500 group-hover:rotate-45 group-hover:border-transparent"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
