"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Container } from "@/shared/ui/container";

import { isNavigationLinkActive, type SiteNavigationLink } from "../site-navigation";

/** A partir de quantos pixels rolados o cabeçalho ganha fundo. */
const SCROLL_THRESHOLD_PX = 24;

interface SiteHeaderFrameProps {
  logo: ReactNode;
  links: SiteNavigationLink[];
  /** Botões do lado direito (ex.: WhatsApp). */
  actions: ReactNode;
  /** Conteúdo extra no rodapé do menu do celular (ex.: telefone, endereço). */
  mobileMenuFooter?: ReactNode;
}

function useHasScrolled(): boolean {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHasScrolled = () => setHasScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    updateHasScrolled();
    window.addEventListener("scroll", updateHasScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateHasScrolled);
  }, []);

  return hasScrolled;
}

/**
 * Parte interativa do cabeçalho: fundo ao rolar, link ativo e menu do celular.
 * O visual transparente sobre o banner fica no globals.css (.site-header).
 */
export function SiteHeaderFrame({ logo, links, actions, mobileMenuFooter }: SiteHeaderFrameProps) {
  const pathname = usePathname();
  const hasScrolled = useHasScrolled();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  // Trocou de página (ex.: tocou num link do menu): fecha o menu.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        id="topo"
        data-scrolled={hasScrolled || undefined}
        data-menu-open={isMenuOpen || undefined}
        className="site-header border-border bg-header/90 text-header-foreground data-menu-open:bg-header sticky top-0 z-30 border-b backdrop-blur-xl"
      >
        <Container className="flex h-(--header-height) items-center justify-between gap-6">
          {logo}

          <nav aria-label="Principal" className="hidden items-center gap-10 text-sm md:flex">
            {links.map((link) => (
              <DesktopNavigationLink
                key={link.href}
                link={link}
                isActive={isNavigationLinkActive(link.href, pathname)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-celular"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="-mr-2 flex size-11 items-center justify-center rounded-full transition hover:bg-current/10 md:hidden"
            >
              {isMenuOpen ? (
                <X className="size-6" aria-hidden />
              ) : (
                <Menu className="size-6" aria-hidden />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Fora do <header>: o desfoque do cabeçalho mudaria a referência do "position: fixed". */}
      <MobileMenu
        isOpen={isMenuOpen}
        links={links}
        pathname={pathname}
        footer={mobileMenuFooter}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </>
  );
}

function DesktopNavigationLink({
  link,
  isActive,
}: {
  link: SiteNavigationLink;
  isActive: boolean;
}) {
  return (
    <Link
      href={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative py-2 font-medium transition-opacity duration-300 hover:opacity-100",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-current",
        "after:ease-premium after:transition-transform after:duration-500 hover:after:scale-x-100",
        isActive ? "opacity-100 after:scale-x-100" : "opacity-75 after:scale-x-0",
      )}
    >
      {link.label}
    </Link>
  );
}

function MobileMenu({
  isOpen,
  links,
  pathname,
  footer,
  onNavigate,
}: {
  isOpen: boolean;
  links: SiteNavigationLink[];
  pathname: string;
  footer?: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <div
      id="menu-celular"
      inert={!isOpen}
      className={cn(
        "bg-header text-header-foreground fixed inset-x-0 top-(--header-height) bottom-0 z-30 flex flex-col md:hidden",
        "ease-premium transition-[opacity,visibility] duration-500",
        isOpen ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <Container className="flex flex-1 flex-col justify-between py-10">
        <nav aria-label="Menu do celular">
          <ul className="flex flex-col gap-2">
            {links.map((link, index) => (
              <li
                key={link.href}
                className={cn(
                  "ease-premium transition duration-700",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: isOpen ? `${120 + index * 70}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={isNavigationLinkActive(link.href, pathname) ? "page" : undefined}
                  className="font-display flex items-center justify-between py-3 text-4xl aria-[current=page]:opacity-100 [&:not([aria-current])]:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {footer && (
          <div className="border-t border-current/15 pt-6 text-sm opacity-80">{footer}</div>
        )}
      </Container>
    </div>
  );
}
