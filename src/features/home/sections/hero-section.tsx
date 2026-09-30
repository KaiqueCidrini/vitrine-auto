import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";

import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import { SEARCH_PARAM_NAMES } from "@/features/vehicles/domain/vehicle-search-params";
import { countPublishedVehicles } from "@/features/vehicles/server/vehicle-queries";
import type { HomeSection, TenantConfig } from "@/tenants/tenant-config-schema";
import { cn } from "@/shared/lib/cn";
import { isDarkColor } from "@/shared/theme/build-theme-style";
import { BUTTON_ARROW_CLASS_NAME, buttonClassName } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

type HeroSectionConfig = Extract<HomeSection, { type: "hero" }>;
type HeroOverlay = "image" | HeroSectionConfig["tone"];

const OVERLAY_CLASSES: Record<HeroOverlay, { section: string; ctaVariant: "primary" | "accent" }> =
  {
    image: { section: "bg-foreground text-white", ctaVariant: "primary" },
    primary: { section: "bg-primary text-primary-foreground", ctaVariant: "accent" },
    surface: { section: "bg-surface text-foreground", ctaVariant: "primary" },
  };

/** Atraso de entrada de cada linha do banner, para o texto "subir" em sequência. */
const ENTRANCE_DELAYS = [
  "[animation-delay:150ms]",
  "[animation-delay:300ms]",
  "[animation-delay:450ms]",
  "[animation-delay:600ms]",
];

function resolveOverlay(section: HeroSectionConfig): HeroOverlay {
  return section.backgroundImage ? "image" : section.tone;
}

/** Diz ao cabeçalho se o banner é escuro, para ele usar o logo claro. */
function resolveContrast(overlay: HeroOverlay, colors: TenantConfig["theme"]["colors"]) {
  if (overlay === "image") return "dark";
  const background = overlay === "primary" ? colors.primary : colors.surface;
  return isDarkColor(background) ? "dark" : "light";
}

export async function HeroSection({
  section,
  tenant,
}: {
  section: HeroSectionConfig;
  tenant: TenantConfig;
}) {
  const overlay = resolveOverlay(section);
  const { section: sectionClassName, ctaVariant } = OVERLAY_CLASSES[overlay];
  // Sem foto, o banner fica com espaço de sobra: um número real do estoque preenche esse lugar.
  const vehicleCount = section.backgroundImage ? null : await countPublishedVehicles();

  return (
    <section
      data-hero-overlay={overlay}
      data-hero-contrast={resolveContrast(overlay, tenant.theme.colors)}
      className={cn(
        "relative isolate -mt-(--header-height) flex min-h-[70svh] flex-col overflow-hidden sm:min-h-[80svh] lg:min-h-[94svh]",
        sectionClassName,
      )}
    >
      {section.backgroundImage ? (
        <HeroPhotoBackdrop src={section.backgroundImage} />
      ) : (
        <HeroAmbientBackdrop />
      )}

      <Container className="flex flex-1 flex-col justify-end pt-[calc(var(--header-height)+4rem)] pb-16 sm:pb-24">
        <div className="max-w-3xl">
          {section.eyebrow && (
            <p className={cn("eyebrow animate-fade-up mb-6 opacity-80", ENTRANCE_DELAYS[0])}>
              {section.eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "font-display animate-fade-up text-5xl leading-[0.98] text-balance sm:text-7xl lg:text-8xl",
              ENTRANCE_DELAYS[1],
            )}
          >
            {section.title}
          </h1>
          <p
            className={cn(
              "animate-fade-up mt-6 max-w-xl text-lg leading-relaxed opacity-80 sm:text-xl",
              ENTRANCE_DELAYS[2],
            )}
          >
            {section.subtitle}
          </p>

          <div
            className={cn(
              "animate-fade-up mt-10 flex flex-col items-start gap-4",
              ENTRANCE_DELAYS[3],
            )}
          >
            <HeroSearchForm ctaLabel={section.primaryCtaLabel} ctaVariant={ctaVariant} />
            {section.secondaryCtaLabel && (
              <WhatsAppLinkButton
                phoneNumber={tenant.contact.whatsappNumber}
                message={tenant.whatsappMessages.general}
                label={section.secondaryCtaLabel}
                variant="overlay"
                size="lg"
              />
            )}
          </div>

          {vehicleCount !== null && vehicleCount > 0 && (
            <p
              className={cn(
                "animate-fade-up mt-6 flex items-center gap-2 text-sm opacity-90",
                ENTRANCE_DELAYS[3],
              )}
            >
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-current" />
              </span>
              <strong className="font-semibold">{vehicleCount}</strong>{" "}
              {vehicleCount === 1 ? "veículo disponível agora" : "veículos disponíveis agora"}
            </p>
          )}
        </div>
      </Container>

      <ScrollCue />
    </section>
  );
}

function HeroSearchForm({
  ctaLabel,
  ctaVariant,
}: {
  ctaLabel: string;
  ctaVariant: "primary" | "accent";
}) {
  return (
    <form
      action="/veiculos"
      method="get"
      className="rounded-button flex w-full max-w-lg items-center gap-1 bg-current/10 p-1.5 ring-1 ring-current/20 backdrop-blur-md transition focus-within:bg-current/15 focus-within:ring-current/40"
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Buscar por marca ou modelo</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 opacity-70"
          aria-hidden
        />
        <input
          type="search"
          name={SEARCH_PARAM_NAMES.search}
          placeholder="Qual carro você procura?"
          className="h-12 w-full bg-transparent pr-3 pl-12 text-base placeholder:text-current placeholder:opacity-60 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className={buttonClassName({ variant: ctaVariant, size: "md", className: "h-12" })}
      >
        <span className="hidden sm:inline">{ctaLabel}</span>
        <span className="sr-only sm:hidden">{ctaLabel}</span>
        <ArrowRight className={BUTTON_ARROW_CLASS_NAME} aria-hidden />
      </button>
    </form>
  );
}

function HeroPhotoBackdrop({ src }: { src: string }) {
  return (
    <>
      <div data-parallax className="absolute inset-0 -z-20">
        <Image
          src={src}
          alt=""
          fill
          preload
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
      </div>
      {/* Escurece o topo (legibilidade do cabeçalho) e a base (legibilidade do texto). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/35 to-black/50"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/60 via-transparent to-transparent"
      />
    </>
  );
}

/** Sem foto: luzes suaves nas cores do tema, em movimento lento. */
function HeroAmbientBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="animate-drift absolute -top-1/3 -right-1/4 size-[70vmax] rounded-full bg-current opacity-[0.13] blur-[120px]" />
      <div className="animate-drift absolute -bottom-1/2 -left-1/4 size-[60vmax] rounded-full bg-black opacity-30 blur-[120px] [animation-delay:-9s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_70%_30%,black,transparent_70%)] bg-size-[88px_88px] opacity-[0.06]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/25 to-transparent" />
    </div>
  );
}

function ScrollCue() {
  return (
    <div
      aria-hidden
      className="animate-fade-up absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 [animation-delay:900ms] lg:flex"
    >
      <span className="eyebrow text-[0.65rem] opacity-60">Role</span>
      <span className="relative h-12 w-px overflow-hidden bg-current/20">
        <span className="animate-scroll-cue absolute inset-0 bg-current" />
      </span>
    </div>
  );
}
