import Image from "next/image";
import Link from "next/link";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import type { TenantConfig } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

const NAVIGATION_LINKS = [
  { href: "/", label: "Início" },
  { href: "/veiculos", label: "Estoque" },
  { href: "/#contato", label: "Contato" },
];

export function SiteHeader({ tenant }: { tenant: TenantConfig }) {
  return (
    <header className="border-border bg-header/95 text-header-foreground sticky top-0 z-30 border-b backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label={`${tenant.name} - página inicial`}>
          <Image
            src={tenant.logo.src}
            alt={tenant.logo.alt}
            width={tenant.logo.width}
            height={tenant.logo.height}
            preload
            className="h-9 w-auto"
          />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-8 text-sm font-medium md:flex"
        >
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="opacity-80 transition hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/veiculos" className="px-3 text-sm font-semibold md:hidden">
            Estoque
          </Link>
          <WhatsAppLinkButton
            phoneNumber={tenant.contact.whatsappNumber}
            message={tenant.whatsappMessages.general}
            label="WhatsApp"
            size="sm"
          />
        </div>
      </Container>
    </header>
  );
}
