import type { HomeSection, TenantConfig } from "@/tenants/tenant-config-schema";

import { BenefitsSection } from "./sections/benefits-section";
import { BodyTypeShortcutsSection } from "./sections/body-type-shortcuts-section";
import { ContactCtaSection } from "./sections/contact-cta-section";
import { FeaturedVehiclesSection } from "./sections/featured-vehicles-section";
import { HeroSection } from "./sections/hero-section";

function renderSection(section: HomeSection, tenant: TenantConfig) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} tenant={tenant} />;
    case "featured-vehicles":
      return <FeaturedVehiclesSection section={section} />;
    case "body-type-shortcuts":
      return <BodyTypeShortcutsSection section={section} />;
    case "benefits":
      return <BenefitsSection section={section} />;
    case "contact-cta":
      return <ContactCtaSection section={section} tenant={tenant} />;
    default: {
      // Se um novo tipo de seção for criado sem componente, o TypeScript acusa aqui.
      const unhandledSection: never = section;
      return unhandledSection;
    }
  }
}

/** Monta a home na ordem definida na configuração da concessionária. */
export function HomeSections({ tenant }: { tenant: TenantConfig }) {
  return tenant.home.sections.map((section, index) => (
    <div key={`${section.type}-${index}`}>{renderSection(section, tenant)}</div>
  ));
}
