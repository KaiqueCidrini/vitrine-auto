import type { TenantConfig } from "@/tenants/tenant-config-schema";

import { FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "../domain/vehicle-attributes";
import { buildVehicleTitle } from "../domain/vehicle-formatters";
import type { VehicleDetails } from "../domain/vehicle-models";

interface VehicleStructuredDataProps {
  vehicle: VehicleDetails;
  vehicleUrl: string;
  tenant: TenantConfig;
  absolutePhotoUrls: string[];
}

/** Dados estruturados (schema.org/Car) para o Google exibir preço e fotos nos resultados. */
export function VehicleStructuredData({
  vehicle,
  vehicleUrl,
  tenant,
  absolutePhotoUrls,
}: VehicleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: buildVehicleTitle(vehicle),
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.modelYear),
    productionDate: String(vehicle.manufactureYear),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileageKm,
      unitCode: "KMT",
    },
    vehicleTransmission: TRANSMISSION_LABELS[vehicle.transmission],
    fuelType: FUEL_TYPE_LABELS[vehicle.fuelType],
    color: vehicle.color,
    image: absolutePhotoUrls,
    url: vehicleUrl,
    offers: {
      "@type": "Offer",
      price: (vehicle.priceInCents / 100).toFixed(2),
      priceCurrency: "BRL",
      availability:
        vehicle.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@type": "AutoDealer", name: tenant.name, telephone: tenant.contact.phoneDisplay },
    },
  };

  return (
    <script
      type="application/ld+json"
      // Escapa "<" para impedir que um texto do anúncio feche a tag <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
  );
}
