import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

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
        <Link
          href="/veiculos"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="size-4" aria-hidden /> Voltar para o estoque
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex flex-col gap-10">
            <VehicleGallery photos={vehicle.photos} vehicleTitle={fullTitle} />

            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className="mb-4 text-xl font-bold">
                Ficha do veículo
              </h2>
              <VehicleSpecList vehicle={vehicle} />
            </section>

            {vehicle.features.length > 0 && (
              <section aria-labelledby="features-title">
                <h2 id="features-title" className="mb-4 text-xl font-bold">
                  Opcionais
                </h2>
                <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="text-primary size-4 shrink-0" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {vehicle.description && (
              <section aria-labelledby="description-title">
                <h2 id="description-title" className="mb-4 text-xl font-bold">
                  Sobre este carro
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-border bg-surface rounded-lg border p-6 shadow-sm">
              {isSold && (
                <Badge tone="danger" className="mb-3">
                  Vendido
                </Badge>
              )}
              <h1 className="text-2xl leading-tight font-extrabold sm:text-3xl">{title}</h1>
              {vehicle.version && <p className="text-muted-foreground mt-1">{vehicle.version}</p>}
              <p className="text-muted-foreground mt-2 text-sm">
                {formatYears(vehicle.manufactureYear, vehicle.modelYear)} ·{" "}
                {formatMileage(vehicle.mileageKm)}
              </p>

              <p className="text-muted-foreground mt-6 text-sm">Preço</p>
              <p className="text-primary text-4xl font-extrabold tracking-tight">
                {formatPrice(vehicle.priceInCents)}
              </p>

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

              <div className="border-border text-muted-foreground mt-6 border-t pt-5 text-sm">
                <p className="text-foreground font-semibold">{tenant.name}</p>
                <p>
                  {tenant.contact.address.street} · {tenant.contact.address.city}/
                  {tenant.contact.address.state}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {similarVehicles.length > 0 && (
          <section aria-labelledby="similar-title" className="mt-16">
            <h2 id="similar-title" className="mb-6 text-2xl font-bold">
              Você também pode gostar
            </h2>
            <VehicleGrid vehicles={similarVehicles} />
          </section>
        )}
      </Container>

      {/* Barra fixa no celular: o botão de contato fica sempre ao alcance do polegar. */}
      {!isSold && (
        <div
          data-sticky-contact-bar
          className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t p-3 backdrop-blur lg:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-xs">{fullTitle}</p>
            <p className="text-primary text-lg font-extrabold">
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
