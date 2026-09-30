import Image from "next/image";
import Link from "next/link";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import type { TenantConfig } from "@/tenants/tenant-config-schema";

import { SITE_NAVIGATION_LINKS } from "../site-navigation";
import { SiteHeaderFrame } from "./site-header-frame";

function SiteLogo({ logo, name }: { logo: TenantConfig["logo"]; name: string }) {
  const imageSize = { width: logo.width, height: logo.height };

  return (
    <Link
      href="/"
      className="shrink-0"
      aria-label={`${name} - página inicial`}
      // "dual": o CSS troca para a versão clara quando o cabeçalho está sobre um banner escuro.
      data-logo-set={logo.srcOnDark ? "dual" : "single"}
    >
      <Image
        {...imageSize}
        src={logo.src}
        alt={logo.alt}
        preload
        data-logo="default"
        className="h-9 w-auto"
      />
      {logo.srcOnDark && (
        <Image
          {...imageSize}
          src={logo.srcOnDark}
          alt={logo.alt}
          data-logo="on-dark"
          className="h-9 w-auto"
        />
      )}
    </Link>
  );
}

export function SiteHeader({ tenant }: { tenant: TenantConfig }) {
  return (
    <SiteHeaderFrame
      logo={<SiteLogo logo={tenant.logo} name={tenant.name} />}
      links={SITE_NAVIGATION_LINKS}
      actions={
        <WhatsAppLinkButton
          phoneNumber={tenant.contact.whatsappNumber}
          message={tenant.whatsappMessages.general}
          label="WhatsApp"
          size="sm"
        />
      }
      mobileMenuFooter={
        <>
          <p className="font-semibold">{tenant.name}</p>
          <p className="mt-1">
            {tenant.contact.address.street} · {tenant.contact.address.city}/
            {tenant.contact.address.state}
          </p>
          <p className="mt-1">{tenant.contact.phoneDisplay}</p>
        </>
      }
    />
  );
}
