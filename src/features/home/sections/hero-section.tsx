import { Search } from "lucide-react";
import Image from "next/image";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import { SEARCH_PARAM_NAMES } from "@/features/vehicles/domain/vehicle-search-params";
import type { HomeSection, TenantConfig } from "@/tenants/tenant-config-schema";
import { cn } from "@/shared/lib/cn";
import { buttonClassName } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

type HeroSectionConfig = Extract<HomeSection, { type: "hero" }>;

const TONE_CLASSES = {
  primary: { section: "bg-primary text-primary-foreground", ctaVariant: "accent" },
  surface: { section: "border-b border-border bg-surface text-foreground", ctaVariant: "primary" },
} as const;

export function HeroSection({
  section,
  tenant,
}: {
  section: HeroSectionConfig;
  tenant: TenantConfig;
}) {
  const tone = TONE_CLASSES[section.tone];

  return (
    <section className={cn("relative isolate overflow-hidden", tone.section)}>
      {section.backgroundImage ? (
        <>
          <Image
            src={section.backgroundImage}
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,var(--color-accent)_0%,transparent_45%),linear-gradient(135deg,transparent_40%,rgb(0_0_0/0.35))] opacity-50"
        />
      )}

      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          {section.eyebrow && (
            <p className="mb-4 inline-block rounded-full bg-current/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur">
              {section.eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            {section.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-85">{section.subtitle}</p>

          <form
            action="/veiculos"
            method="get"
            className="mt-8 flex max-w-lg flex-col gap-2 rounded-lg bg-current/10 p-2 backdrop-blur sm:flex-row"
          >
            <label className="relative flex-1">
              <span className="sr-only">Buscar por marca ou modelo</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 opacity-70"
                aria-hidden
              />
              <input
                type="search"
                name={SEARCH_PARAM_NAMES.search}
                placeholder="Qual carro você procura?"
                className="h-12 w-full rounded-md bg-transparent pr-3 pl-10 text-base placeholder:text-current placeholder:opacity-60 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className={buttonClassName({ variant: tone.ctaVariant, size: "lg" })}
            >
              {section.primaryCtaLabel}
            </button>
          </form>

          {section.secondaryCtaLabel && (
            <WhatsAppLinkButton
              phoneNumber={tenant.contact.whatsappNumber}
              message={tenant.whatsappMessages.general}
              label={section.secondaryCtaLabel}
              className="mt-4"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
