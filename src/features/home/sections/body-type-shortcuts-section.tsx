import { CarFront } from "lucide-react";
import Link from "next/link";

import { BODY_TYPE_LABELS } from "@/features/vehicles/domain/vehicle-attributes";
import { buildVehicleSearchHref } from "@/features/vehicles/domain/vehicle-search-params";
import { countPublishedVehiclesByBodyType } from "@/features/vehicles/server/vehicle-queries";
import type { HomeSection } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

import { SectionHeading } from "./section-heading";

type BodyTypeShortcutsSectionConfig = Extract<HomeSection, { type: "body-type-shortcuts" }>;

export async function BodyTypeShortcutsSection({
  section,
}: {
  section: BodyTypeShortcutsSectionConfig;
}) {
  const bodyTypeCounts = await countPublishedVehiclesByBodyType();
  if (bodyTypeCounts.length < 2) return null;

  return (
    <section className="border-border bg-surface border-y py-16">
      <Container>
        <SectionHeading title={section.title} />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {bodyTypeCounts.map(({ bodyType, total }) => (
            <li key={bodyType}>
              <Link
                href={buildVehicleSearchHref({ bodyType })}
                className="border-border bg-background hover:border-primary flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition hover:shadow-md"
              >
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                  <CarFront className="size-6" aria-hidden />
                </span>
                <span className="font-bold">{BODY_TYPE_LABELS[bodyType]}</span>
                <span className="text-muted-foreground text-xs">
                  {total} {total === 1 ? "veículo" : "veículos"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
