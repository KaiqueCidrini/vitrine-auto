import { ArrowRight } from "lucide-react";

import { VehicleGrid } from "@/features/vehicles/components/vehicle-grid";
import { findFeaturedVehicles } from "@/features/vehicles/server/vehicle-queries";
import type { HomeSection } from "@/tenants/tenant-config-schema";
import { ButtonLink } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

import { SectionHeading } from "./section-heading";

type FeaturedVehiclesSectionConfig = Extract<HomeSection, { type: "featured-vehicles" }>;

export async function FeaturedVehiclesSection({
  section,
}: {
  section: FeaturedVehiclesSectionConfig;
}) {
  const vehicles = await findFeaturedVehicles(section.limit);
  if (vehicles.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <SectionHeading
          title={section.title}
          subtitle={section.subtitle}
          action={
            <ButtonLink href="/veiculos" variant="outline">
              Ver estoque completo <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          }
        />
        <VehicleGrid vehicles={vehicles} />
      </Container>
    </section>
  );
}
