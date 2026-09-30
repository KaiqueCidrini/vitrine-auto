import { ArrowRight } from "lucide-react";

import { VehicleCard } from "@/features/vehicles/components/vehicle-card";
import { findFeaturedVehicles } from "@/features/vehicles/server/vehicle-queries";
import type { HomeSection } from "@/tenants/tenant-config-schema";
import { BUTTON_ARROW_CLASS_NAME, ButtonLink } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Reveal } from "@/shared/ui/reveal";
import { ScrollCarousel } from "@/shared/ui/scroll-carousel";

import { SectionHeading } from "./section-heading";

type FeaturedVehiclesSectionConfig = Extract<HomeSection, { type: "featured-vehicles" }>;

const PRIORITY_IMAGE_COUNT = 2;

export async function FeaturedVehiclesSection({
  section,
}: {
  section: FeaturedVehiclesSectionConfig;
}) {
  const vehicles = await findFeaturedVehicles(section.limit);
  if (vehicles.length === 0) return null;

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Estoque selecionado"
          title={section.title}
          subtitle={section.subtitle}
          action={
            <ButtonLink href="/veiculos" variant="outline">
              Ver estoque completo <ArrowRight className={BUTTON_ARROW_CLASS_NAME} aria-hidden />
            </ButtonLink>
          }
        />
        <Reveal delay={150}>
          <ScrollCarousel label={section.title}>
            {vehicles.map((vehicle, index) => (
              <li
                key={vehicle.id}
                className="flex w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <VehicleCard vehicle={vehicle} prioritizeImage={index < PRIORITY_IMAGE_COUNT} />
              </li>
            ))}
          </ScrollCarousel>
        </Reveal>
      </Container>
    </section>
  );
}
