import type { CSSProperties } from "react";

import type { TenantTheme } from "@/tenants/tenant-config-schema";

/** Luminância relativa (WCAG) para decidir se o fundo do tema é escuro. */
export function isDarkColor(hexColor: string): boolean {
  const channels = [1, 3, 5].map((start) => parseInt(hexColor.slice(start, start + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return luminance < 0.4;
}

const PILL_RADIUS = "9999px";

/**
 * Títulos serifados ficam elegantes em peso normal; títulos na fonte do texto
 * precisam de negrito para ter presença.
 */
function buildHeadingTypography(theme: TenantTheme) {
  return theme.headingFont
    ? { weight: "400", tracking: "-0.01em" }
    : { weight: "700", tracking: "-0.03em" };
}

/**
 * Converte o tema da concessionária em variáveis CSS aplicadas no <html>.
 * O Tailwind lê essas variáveis (veja globals.css), então nenhum componente
 * precisa conhecer as cores de um cliente específico.
 */
export function buildThemeStyle(theme: TenantTheme): CSSProperties {
  const { colors } = theme;
  const radius = theme.radius === "0" ? "0px" : theme.radius;
  const heading = buildHeadingTypography(theme);

  return {
    colorScheme: isDarkColor(colors.background) ? "dark" : "light",
    "--brand-primary": colors.primary,
    "--brand-primary-foreground": colors.primaryForeground,
    "--brand-accent": colors.accent,
    "--brand-accent-foreground": colors.accentForeground,
    "--brand-background": colors.background,
    "--brand-surface": colors.surface,
    "--brand-foreground": colors.foreground,
    "--brand-muted-foreground": colors.mutedForeground,
    "--brand-border": colors.border,
    "--brand-header-background": colors.headerBackground,
    "--brand-header-foreground": colors.headerForeground,
    "--brand-footer-background": colors.footerBackground,
    "--brand-footer-foreground": colors.footerForeground,
    "--brand-radius": radius,
    "--brand-button-radius": theme.buttonShape === "pill" ? PILL_RADIUS : radius,
    "--brand-heading-weight": heading.weight,
    "--brand-heading-tracking": heading.tracking,
  } as CSSProperties;
}
