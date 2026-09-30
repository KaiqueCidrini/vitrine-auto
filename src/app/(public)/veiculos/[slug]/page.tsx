import { ArrowLeft, Check, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import { cache, type ReactNode } from "react";

import { fillMessageTemplate } from "@/features/contact/build-whatsapp-link";
import { WhatsAppLinkButton } from "@/features/contact/components/whatsapp-link-button";
import { VehicleGallery } from "@/features/vehicles/components/vehicle-gallery";
import { VehicleGrid } from "@/features/vehicles/components/vehicle-grid";
import { VehicleSpecList } from "@/features/vehicles/components/vehicle-spec-list";
import { VehicleStructuredData } from "@/features/vehicles/components/vehicle-structured-data";
import {
  buildVehicleTitle,
  formatMileage,
  formatPrice,
  formatYears,
} from "@/features/vehicles/domain/vehicle-formatters";
import {
  findPublicVehicleBySlug,
  findPublicVehicleSlugByIdPrefix,
  findSimilarVehicles,
} from "@/features/vehicles/server/vehicle-queries";
import { Badge } from "@/shared/ui/badge";
import { Container } from "@/shared/ui/container";
import { Reveal } from "@/shared/ui/reveal";
import { getTenant } from "@/tenants/tenant-registry";

// generateMetadata e a página pedem o mesmo veículo: o cache evita a consulta duplicada.
const getVehicle = cache(findPublicVehicleBySlug);

function toAbsoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, process.env.APP_URL ?? "http://localhost:3000").toString();
}

/** Link antigo (o anúncio foi editado e ganhou outro slug): redireciona para o endereço atual. */
async function redirectFromOutdatedSlug(outdatedSlug: string): Promise<never> {
  const idPrefix = outdatedSlug.split("-").at(-1) ?? "";
  const currentSlug = await findPublicVehicleSlugByIdPrefix(idPrefix);
  if (currentSlug && currentSlug !== outdatedSlug) permanentRedirect(`/veiculos/${currentSlug}`);
  notFound();
}

export async function generateMetadata({
  params,
}: PageProps<"/veiculos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) return { title: "Veículo não encontrado" };

  const title = `${buildVehicleTitle(vehicle)} ${formatYears(vehicle.manufactureYear, vehicle.modelYear)}`;
  const description = `${title} com ${formatMileage(vehicle.mileageKm)} por ${formatPrice(vehicle.priceInCents)}. Agende sua visita.`;

  return {
    title,
    description,
    alternates: { canonical: `/veiculos/${vehicle.slug}` },
    openGraph: {
      title,
      description,
      images: vehicle.coverPhoto
        ? [
            {
              url: vehicle.coverPhoto.url,
              width: vehicle.coverPhoto.width,
              height: vehicle.coverPhoto.height,
            },
          ]
        : [],
    },
  };
}

export default async function VehicleDetailsPage({ params }: PageProps<"/veiculos/[slug]">) {
  await connection();

  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) return redirectFromOutdatedSlug(slug);

  const tenant = getTenant();
  const similarVehicles = await findSimilarVehicles(vehicle);
  const title = buildVehicleTitle({ brand: vehicle.brand, model: vehicle.model });
  const fullTitle = buildVehicleTitle(vehicle);
  const vehicleUrl = toAbsoluteUrl(`/veiculos/${vehicle.slug}`);
  const isSold = vehicle.status === "sold";

  const interestMessage = fillMessageTemplate(tenant.whatsappMessages.vehicleInterest, {
    vehicle: `${fullTitle} ${formatYears(vehicle.manufactureYear, vehicle.modelYear)}`,
    price: formatPrice(vehicle.priceInCents),
    url: vehicleUrl,
  });

  return (
    <>
      <VehicleStructuredData
        vehicle={vehicle}
        vehicleUrl={vehicleUrl}
        tenant={tenant}
        absolutePhotoUrls={vehicle.photos.map((photo) => toAbsoluteUrl(photo.url))}
      />

      <Container className="py-8 lg:py-12">
        <nav aria-label="Você está em" className="animate-fade-up mb-8">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link
                href="/veiculos"
                className="hover:text-foreground group inline-flex items-center gap-2 font-medium transition"
              >
                <ArrowLeft
                  className="ease-premium size-4 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden
                />
                Estoque
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground truncate">
              {title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div className="animate-fade-up flex min-w-0 flex-col gap-16 [animation-delay:100ms]">
            <VehicleGallery photos={vehicle.photos} vehicleTitle={fullTitle} />

            <Reveal>
              <section aria-labelledby="specs-title">
                <DetailSectionTitle id="specs-title">Ficha do veículo</DetailSectionTitle>
                <VehicleSpecList vehicle={vehicle} />
              </section>
            </Reveal>

            {vehicle.features.length > 0 && (
              <Reveal>
                <section aria-labelledby="features-title">
                  <DetailSectionTitle id="features-title">Opcionais</DetailSectionTitle>
                  <ul className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <li
                        key={feature}
                        className="border-border rounded-button inline-flex items-center gap-2 border px-4 py-2 text-sm"
                      >
                        <Check className="text-primary size-4 shrink-0" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {vehicle.description && (
              <Reveal>
                <section aria-labelledby="description-title">
                  <DetailSectionTitle id="description-title">Sobre este carro</DetailSectionTitle>
                  <p className="text-muted-foreground max-w-prose text-lg leading-relaxed break-words whitespace-pre-line">
                    {vehicle.description}
                  </p>
                </section>
              </Reveal>
            )}
          </div>

          <aside className="animate-fade-up [animation-delay:200ms] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <div className="border-border bg-surface rounded-lg border p-7 shadow-xl shadow-black/5">
              {isSold && (
                <Badge tone="danger" className="mb-4">
                  Vendido
                </Badge>
              )}
              <p className="eyebrow text-muted-foreground">{vehicle.brand}</p>
              <h1 className="font-display mt-3 text-4xl leading-[1.05] sm:text-5xl">
                <span className="sr-only">{vehicle.brand} </span>
                {vehicle.model}
              </h1>
              {vehicle.version && (
                <p className="text-muted-foreground mt-2 text-lg">{vehicle.version}</p>
              )}
              <p className="text-muted-foreground mt-4 text-sm">
                {formatYears(vehicle.manufactureYear, vehicle.modelYear)} ·{" "}
                {formatMileage(vehicle.mileageKm)}
              </p>

              <div className="border-border mt-6 border-t pt-6">
                <p className="text-muted-foreground text-sm">Preço</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight">
                  {formatPrice(vehicle.priceInCents)}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {isSold ? (
                  <p className="bg-foreground/5 rounded-md p-4 text-sm">
                    Este veículo já foi vendido. Confira outras opções parecidas abaixo ou fale com
                    a gente.
                  </p>
                ) : (
                  <WhatsAppLinkButton
                    phoneNumber={tenant.contact.whatsappNumber}
                    message={interestMessage}
                    label="Agendar visita pelo WhatsApp"
                    size="lg"
                    className="w-full"
                  />
                )}
                <p className="text-muted-foreground text-center text-xs">
                  Atendimento direto com um vendedor · {tenant.contact.phoneDisplay}
                </p>
              </div>

              <div className="border-border text-muted-foreground mt-6 flex gap-3 border-t pt-5 text-sm">
                <MapPin className="text-foreground mt-0.5 size-4 shrink-0" aria-hidden />
                <div>
                  <p className="text-foreground font-semibold">{tenant.name}</p>
                  <p>
                    {tenant.contact.address.street} · {tenant.contact.address.city}/
                    {tenant.contact.address.state}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {similarVehicles.length > 0 && (
          <section aria-labelledby="similar-title" className="border-border mt-24 border-t pt-16">
            <Reveal>
              <p className="eyebrow text-muted-foreground">Continue explorando</p>
              <h2 id="similar-title" className="font-display mt-4 mb-10 text-4xl sm:text-5xl">
                Você também pode gostar
              </h2>
            </Reveal>
            <VehicleGrid vehicles={similarVehicles} />
          </section>
        )}
      </Container>

      {/* Barra fixa no celular: o botão de contato fica sempre ao alcance do polegar. */}
      {!isSold && (
        <div
          data-sticky-contact-bar
          className="border-border bg-surface fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t p-3 shadow-[0_-10px_30px_-18px_rgb(0_0_0_/_0.35)] lg:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-xs">{fullTitle}</p>
            <p className="text-lg font-semibold tracking-tight">
              {formatPrice(vehicle.priceInCents)}
            </p>
          </div>
          <WhatsAppLinkButton
            phoneNumber={tenant.contact.whatsappNumber}
            message={interestMessage}
            label="Agendar visita"
          />
        </div>
      )}
    </>
  );
}

function DetailSectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display mb-6 text-3xl">
      {children}
    </h2>
  );
}
