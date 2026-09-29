import localFont from "next/font/local";

import type { FontOption } from "@/tenants/tenant-config-schema";

/**
 * Fontes servidas pelo próprio site (pacotes @fontsource), sem depender do
 * Google Fonts no build nem no navegador do visitante.
 * Para adicionar uma fonte: instale o pacote, declare aqui e inclua em FONT_OPTIONS.
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

const fontsByOption: Record<FontOption, { variable: string }> = { inter, montserrat, outfit };

export function getFontVariableClassName(font: FontOption): string {
  return fontsByOption[font].variable;
}
