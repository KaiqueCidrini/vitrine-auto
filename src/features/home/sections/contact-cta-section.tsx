import { MapPin } from "lucide-react";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import type { HomeSection, TenantConfig } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

type ContactCtaSectionConfig = Extract<HomeSection, { type: "contact-cta" }>;

export function ContactCtaSection({
  section,
  tenant,
}: {
  section: ContactCtaSectionConfig;
  tenant: TenantConfig;
}) {
  const { address } = tenant.contact;

  return (
    <section className="pb-16 lg:pb-20">
      <Container>
        <div className="bg-primary text-primary-foreground flex flex-col items-start gap-8 rounded-xl p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight">{section.title}</h2>
            <p className="mt-3 opacity-85">{section.subtitle}</p>
            <p className="mt-4 flex items-center gap-2 text-sm opacity-75">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {address.street}, {address.district} · {address.city}/{address.state}
            </p>
          </div>
          <WhatsAppLinkButton
            phoneNumber={tenant.contact.whatsappNumber}
            message={tenant.whatsappMessages.general}
            label="Agendar pelo WhatsApp"
            size="lg"
          />
        </div>
      </Container>
    </section>
  );
}
