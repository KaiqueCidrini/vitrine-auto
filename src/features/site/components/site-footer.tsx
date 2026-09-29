import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import type { TenantConfig } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

const SOCIAL_LABELS: Record<keyof TenantConfig["social"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function SiteFooter({ tenant }: { tenant: TenantConfig }) {
  const { address, openingHours } = tenant.contact;
  const socialLinks = Object.entries(tenant.social).filter(([, url]) => Boolean(url)) as [
    keyof TenantConfig["social"],
    string,
  ][];

  return (
    <footer id="contato" className="bg-footer text-footer-foreground mt-auto">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-bold">{tenant.name}</p>
          <p className="mt-2 text-sm opacity-75">{tenant.tagline}</p>
          {socialLinks.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-4 text-sm">
              {socialLinks.map(([network, url]) => (
                <li key={network}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {SOCIAL_LABELS[network]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterBlock title="Endereço" icon={<MapPin className="size-4" aria-hidden />}>
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
              className="mt-2 inline-block underline"
            >
              Ver no mapa
            </a>
          )}
        </FooterBlock>

        <FooterBlock title="Horário" icon={<Clock className="size-4" aria-hidden />}>
          <ul className="space-y-1">
            {openingHours.map((period) => (
              <li key={period.days}>
                <span className="opacity-75">{period.days}:</span> {period.hours}
              </li>
            ))}
          </ul>
        </FooterBlock>

        <FooterBlock title="Contato" icon={<Phone className="size-4" aria-hidden />}>
          <p>{tenant.contact.phoneDisplay}</p>
          {tenant.contact.email && (
            <a
              href={`mailto:${tenant.contact.email}`}
              className="mt-1 flex items-center gap-2 break-all hover:underline"
            >
              <Mail className="size-4 shrink-0" aria-hidden /> {tenant.contact.email}
            </a>
          )}
        </FooterBlock>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs opacity-60 sm:flex-row sm:justify-between">
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

function FooterBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <p className="mb-3 flex items-center gap-2 font-semibold tracking-wide uppercase">
        {icon}
        {title}
      </p>
      <div className="leading-relaxed opacity-85">{children}</div>
    </div>
  );
}
