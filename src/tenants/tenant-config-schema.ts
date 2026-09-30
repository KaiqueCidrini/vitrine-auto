import { z } from "zod";

/**
 * Contrato de configuração de uma concessionária.
 * Tudo que muda de um cliente para outro deve estar aqui, e não espalhado pelos componentes.
 */

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use cor hexadecimal no formato #RRGGBB");

export const FONT_OPTIONS = ["inter", "montserrat", "outfit"] as const;
/** Fontes serifadas para títulos (visual editorial, estilo montadoras premium). */
export const HEADING_FONT_OPTIONS = ["playfair-display", "cormorant-garamond", "fraunces"] as const;
/** "pill": botões totalmente arredondados. "rounded": seguem o arredondamento base do tema. */
export const BUTTON_SHAPES = ["pill", "rounded"] as const;
export const BENEFIT_ICONS = [
  "shield-check",
  "badge-percent",
  "wrench",
  "file-check",
  "handshake",
  "car",
  "clock",
  "star",
] as const;

const themeSchema = z.object({
  font: z.enum(FONT_OPTIONS),
  /** Fonte dos títulos. Sem ela, os títulos usam a fonte principal em negrito. */
  headingFont: z.enum(HEADING_FONT_OPTIONS).optional(),
  buttonShape: z.enum(BUTTON_SHAPES).default("pill"),
  /** Arredondamento base dos cantos (ex.: "0.75rem"; "0" para visual reto). */
  radius: z.string().regex(/^\d+(\.\d+)?(rem|px)?$/),
  colors: z.object({
    primary: hexColor,
    primaryForeground: hexColor,
    accent: hexColor,
    accentForeground: hexColor,
    background: hexColor,
    surface: hexColor,
    foreground: hexColor,
    mutedForeground: hexColor,
    border: hexColor,
    headerBackground: hexColor,
    headerForeground: hexColor,
    footerBackground: hexColor,
    footerForeground: hexColor,
  }),
});

const heroSectionSchema = z.object({
  type: z.literal("hero"),
  /** "primary": fundo na cor da marca. "surface": fundo neutro do tema, com botão na cor da marca. */
  tone: z.enum(["primary", "surface"]).default("primary"),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1).optional(),
  /** Imagem em /public (ex.: "/tenants/demo/hero.jpg"). Sem imagem, usa um gradiente das cores do tema. */
  backgroundImage: z.string().startsWith("/").optional(),
});

const featuredVehiclesSectionSchema = z.object({
  type: z.literal("featured-vehicles"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  limit: z.number().int().min(1).max(12),
});

const bodyTypeShortcutsSectionSchema = z.object({
  type: z.literal("body-type-shortcuts"),
  title: z.string().min(1),
});

const benefitsSectionSchema = z.object({
  type: z.literal("benefits"),
  title: z.string().min(1),
  items: z
    .array(
      z.object({
        icon: z.enum(BENEFIT_ICONS),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1)
    .max(6),
});

const contactCtaSectionSchema = z.object({
  type: z.literal("contact-cta"),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

export const homeSectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  featuredVehiclesSectionSchema,
  bodyTypeShortcutsSectionSchema,
  benefitsSectionSchema,
  contactCtaSectionSchema,
]);

export const tenantConfigSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tagline: z.string().min(1),
  logo: z.object({
    src: z.string().startsWith("/"),
    /** Versão clara do logo, usada no cabeçalho transparente sobre o banner. Sem ela, usa `src`. */
    srcOnDark: z.string().startsWith("/").optional(),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  theme: themeSchema,
  contact: z.object({
    /** Somente dígitos, com código do país e DDD. Ex.: 5531999998888 */
    whatsappNumber: z.string().regex(/^55\d{10,11}$/, "Use 55 + DDD + número, só dígitos"),
    phoneDisplay: z.string().min(1),
    email: z.email().optional(),
    address: z.object({
      street: z.string().min(1),
      district: z.string().min(1),
      city: z.string().min(1),
      state: z.string().length(2),
      zipCode: z.string().regex(/^\d{5}-\d{3}$/),
    }),
    mapsUrl: z.url().optional(),
    openingHours: z.array(z.object({ days: z.string().min(1), hours: z.string().min(1) })).min(1),
  }),
  social: z.object({
    instagram: z.url().optional(),
    facebook: z.url().optional(),
    youtube: z.url().optional(),
    tiktok: z.url().optional(),
  }),
  whatsappMessages: z.object({
    general: z.string().min(1),
    /** Aceita os marcadores {vehicle}, {price} e {url}. */
    vehicleInterest: z.string().includes("{vehicle}"),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(200),
  }),
  home: z.object({
    sections: z.array(homeSectionSchema).min(1),
  }),
});

/** Formato escrito nos arquivos de configuração (campos com valor padrão são opcionais). */
export type TenantConfigInput = z.input<typeof tenantConfigSchema>;
export type TenantConfig = z.infer<typeof tenantConfigSchema>;
export type TenantTheme = TenantConfig["theme"];
export type HomeSection = z.infer<typeof homeSectionSchema>;
export type BenefitIcon = (typeof BENEFIT_ICONS)[number];
export type FontOption = (typeof FONT_OPTIONS)[number];
export type HeadingFontOption = (typeof HEADING_FONT_OPTIONS)[number];
