import localFont from "next/font/local";

import type { FontOption, HeadingFontOption, TenantTheme } from "@/tenants/tenant-config-schema";

/**
 * Fontes servidas pelo próprio site (pacotes @fontsource), sem depender do
 * Google Fonts no build nem no navegador do visitante.
 * Para adicionar uma fonte: instale o pacote, declare aqui e inclua em FONT_OPTIONS
 * (texto) ou HEADING_FONT_OPTIONS (títulos).
 */
const inter = localFont({
  src: "../../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-brand",
  display: "swap",
  weight: "100 900",
  preload: false,
});

const montserrat = localFont({
  src: "../../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  variable: "--font-brand",
  display: "swap",
  weight: "100 900",
  preload: false,
});

const outfit = localFont({
  src: "../../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  variable: "--font-brand",
  display: "swap",
  weight: "100 900",
  preload: false,
});

const playfairDisplay = localFont({
  src: "../../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-heading-face",
  display: "swap",
  weight: "400 900",
  preload: false,
});

const cormorantGaramond = localFont({
  src: "../../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
  variable: "--font-heading-face",
  display: "swap",
  weight: "300 700",
  preload: false,
});

const fraunces = localFont({
  src: "../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  variable: "--font-heading-face",
  display: "swap",
  weight: "100 900",
  preload: false,
});

const fontsByOption: Record<FontOption, { variable: string }> = { inter, montserrat, outfit };

const headingFontsByOption: Record<HeadingFontOption, { variable: string }> = {
  "playfair-display": playfairDisplay,
  "cormorant-garamond": cormorantGaramond,
  fraunces,
};

/** Classes que registram as variáveis de fonte do tema (texto e, se houver, títulos). */
export function getFontVariableClassNames(
  theme: Pick<TenantTheme, "font" | "headingFont">,
): string {
  const classNames = [fontsByOption[theme.font].variable];
  if (theme.headingFont) classNames.push(headingFontsByOption[theme.headingFont].variable);
  return classNames.join(" ");
}
