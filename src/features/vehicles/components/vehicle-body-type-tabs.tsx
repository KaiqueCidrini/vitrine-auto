import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import { BODY_TYPE_LABELS, type BodyType } from "../domain/vehicle-attributes";
import { buildVehicleSearchHref, type VehicleSearchFilters } from "../domain/vehicle-search-params";

interface VehicleBodyTypeTabsProps {
  filters: VehicleSearchFilters;
  bodyTypeCounts: { bodyType: BodyType; total: number }[];
}

/** Atalhos por carroceria no topo do estoque; mantém os outros filtros escolhidos. */
export function VehicleBodyTypeTabs({ filters, bodyTypeCounts }: VehicleBodyTypeTabsProps) {
  if (bodyTypeCounts.length < 2) return null;

  const tabs = [
    { key: "all", label: "Todos", bodyType: undefined },
    ...bodyTypeCounts.map(({ bodyType, total }) => ({
      key: bodyType,
      label: `${BODY_TYPE_LABELS[bodyType]} (${total})`,
      bodyType,
    })),
  ];

  return (
    <nav aria-label="Filtrar por carroceria" className="-mx-4 scrollbar-none overflow-x-auto px-4">
      <ul className="flex w-max gap-2">
        {tabs.map((tab) => {
          const isActive = filters.bodyType === tab.bodyType;
          return (
            <li key={tab.key}>
              <Link
                href={buildVehicleSearchHref({ ...filters, bodyType: tab.bodyType, page: 1 })}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-button ease-premium inline-flex h-10 items-center border px-5 text-sm font-medium whitespace-nowrap transition duration-300",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/40",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
