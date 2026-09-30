import { ArrowUpRight, ChevronUp } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { TenantConfig } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

import { SITE_NAVIGATION_LINKS } from "../site-navigation";

const SOCIAL_LABELS: Record<keyof TenantConfig["social"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

function listSocialLinks(social: TenantConfig["social"]) {
  return Object.entries(social).filter(([, url]) => Boolean(url)) as [
    keyof TenantConfig["social"],
    string,
  ][];
}

export function SiteFooter({ tenant }: { tenant: TenantConfig }) {
  const { address, openingHours } = tenant.contact;
  const socialLinks = listSocialLinks(tenant.social);

  return (
    <footer id="contato" className="bg-footer text-footer-foreground mt-auto">
      <div className="border-b border-current/10">
        <Container className="flex justify-center">
          <a
            href="#topo"
            className="group flex flex-col items-center gap-1 py-6 text-xs opacity-90 transition hover:opacity-100"
          >
            <ChevronUp
              className="ease-premium size-5 transition-transform duration-500 group-hover:-translate-y-1"
              aria-hidden
            />
            Voltar ao topo
          </a>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl leading-tight">{tenant.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-90">{tenant.tagline}</p>
          {socialLinks.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {socialLinks.map(([network, url]) => (
                <li key={network}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-button inline-flex items-center gap-1 border border-current/20 px-4 py-2 transition hover:border-current/60"
                  >
                    {SOCIAL_LABELS[network]}
                    <ArrowUpRight className="size-3.5 opacity-60" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterBlock title="Visite a loja">
          <address className="not-italic">
            {address.street}
            <br />
            {address.district} · {address.city}/{address.state}
            <br />
            CEP {address.zipCode}
          </address>
          {tenant.contact.mapsUrl && (
            <a
              href={tenant.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 underline-offset-4 hover:underline"
            >
              Ver no mapa <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          )}
        </FooterBlock>

        <FooterBlock title="Horário">
          <ul className="space-y-2">
            {openingHours.map((period) => (
              <li key={period.days}>
                <span className="block opacity-90">{period.days}</span>
                {period.hours}
              </li>
            ))}
          </ul>
        </FooterBlock>

        <FooterBlock title="Fale com a gente">
          <p>{tenant.contact.phoneDisplay}</p>
          {tenant.contact.email && (
            <a
              href={`mailto:${tenant.contact.email}`}
              className="mt-1 block break-all underline-offset-4 hover:underline"
            >
              {tenant.contact.email}
            </a>
          )}
          <ul className="mt-6 space-y-2">
            {SITE_NAVIGATION_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterBlock>
      </Container>

      <div className="border-t border-current/10">
        <Container className="flex flex-col gap-2 py-6 text-xs opacity-90 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.
          </p>
          <Link href="/admin/login" className="hover:underline">
            Área do funcionário
          </Link>
        </Container>
      </div>
    </footer>
  );
}

function FooterBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <p className="eyebrow mb-5 opacity-90">{title}</p>
      <div className="leading-relaxed opacity-90">{children}</div>
    </div>
  );
}
