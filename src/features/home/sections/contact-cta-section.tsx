import { ArrowUpRight, MapPin } from "lucide-react";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import type { HomeSection, TenantConfig } from "@/tenants/tenant-config-schema";
import { BUTTON_ARROW_CLASS_NAME, buttonClassName } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Reveal } from "@/shared/ui/reveal";

type ContactCtaSectionConfig = Extract<HomeSection, { type: "contact-cta" }>;

export function ContactCtaSection({
  section,
  tenant,
}: {
  section: ContactCtaSectionConfig;
  tenant: TenantConfig;
}) {
  const { address, mapsUrl } = tenant.contact;

  return (
    <section className="bg-footer text-footer-foreground relative isolate overflow-hidden py-24 lg:py-36">
      {/* Luz suave na cor da marca, que some antes das bordas da seção (sem cortes visíveis). */}
      <div
        aria-hidden
        className="animate-drift absolute -inset-1/4 -z-10 bg-[radial-gradient(ellipse_45%_55%_at_80%_50%,var(--color-primary),transparent_70%)] opacity-40"
      />

      <Container>
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 opacity-90">Agende sua visita</p>
            <h2 className="font-display text-5xl leading-[1] text-balance sm:text-6xl lg:text-7xl">
              {section.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-90">{section.subtitle}</p>
            <p className="mt-8 flex items-center gap-2 text-sm opacity-90">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {address.street}, {address.district} · {address.city}/{address.state}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <WhatsAppLinkButton
              phoneNumber={tenant.contact.whatsappNumber}
              message={tenant.whatsappMessages.general}
              label="Agendar pelo WhatsApp"
              size="lg"
            />
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName({ variant: "overlay", size: "lg" })}
              >
                Como chegar <ArrowUpRight className={BUTTON_ARROW_CLASS_NAME} aria-hidden />
              </a>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
