import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { VehiclePhotoPlaceholder } from "@/features/vehicles/components/vehicle-photo-placeholder";
import { BODY_TYPE_LABELS } from "@/features/vehicles/domain/vehicle-attributes";
import type { BodyTypeShowcaseItem } from "@/features/vehicles/domain/vehicle-models";
import { buildVehicleSearchHref } from "@/features/vehicles/domain/vehicle-search-params";
import { listBodyTypeShowcase } from "@/features/vehicles/server/vehicle-queries";
import type { HomeSection } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";
import { Reveal } from "@/shared/ui/reveal";
import { ScrollCarousel } from "@/shared/ui/scroll-carousel";

import { SectionHeading } from "./section-heading";

type BodyTypeShortcutsSectionConfig = Extract<HomeSection, { type: "body-type-shortcuts" }>;

export async function BodyTypeShortcutsSection({
  section,
}: {
  section: BodyTypeShortcutsSectionConfig;
}) {
  const showcase = await listBodyTypeShowcase();
  if (showcase.length < 2) return null;

  return (
    <section className="bg-surface overflow-hidden py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Explore por categoria" title={section.title} />
        <Reveal delay={150}>
          <ScrollCarousel label={section.title}>
            {showcase.map((item) => (
              <li
                key={item.bodyType}
                className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <BodyTypeTile item={item} />
              </li>
            ))}
          </ScrollCarousel>
        </Reveal>
      </Container>
    </section>
  );
}

function BodyTypeTile({ item }: { item: BodyTypeShowcaseItem }) {
  const label = BODY_TYPE_LABELS[item.bodyType];

  return (
    <Link
      href={buildVehicleSearchHref({ bodyType: item.bodyType })}
      className="group bg-foreground/5 relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg p-6 text-white"
    >
      {item.coverPhoto ? (
        <Image
          src={item.coverPhoto.url}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
          className="ease-premium -z-20 object-cover transition duration-1000 group-hover:scale-110"
        />
      ) : (
        <VehiclePhotoPlaceholder className="absolute inset-0 -z-20" />
      )}
      <div
        aria-hidden
        className="ease-premium absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/25 to-transparent transition duration-700 group-hover:from-black/90"
      />

      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-3xl leading-none">{label}</h3>
        <span
          aria-hidden
          className="ease-premium flex size-10 shrink-0 -translate-x-2 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur transition duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
      <p className="mt-1 text-sm">
        {item.total} {item.total === 1 ? "veículo" : "veículos"}
      </p>
    </Link>
  );
}
