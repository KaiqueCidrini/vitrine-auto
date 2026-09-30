export interface SiteNavigationLink {
  href: string;
  label: string;
}

export const SITE_NAVIGATION_LINKS: SiteNavigationLink[] = [
  { href: "/", label: "Início" },
  { href: "/veiculos", label: "Estoque" },
  { href: "/#contato", label: "Contato" },
];

/** "/veiculos/xyz" deixa "Estoque" ativo; âncoras ("/#contato") nunca ficam ativas. */
export function isNavigationLinkActive(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
