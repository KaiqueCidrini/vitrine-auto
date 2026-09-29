import type { BodyType, FuelType, Transmission, VehicleStatus } from "./vehicle-attributes";

/** Formatos de leitura entregues às telas (já com URLs das fotos resolvidas). */

export interface VehiclePhotoView {
  storageKey: string;
  url: string;
  width: number;
  height: number;
}

export interface VehicleSummary {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  manufactureYear: number;
  modelYear: number;
  mileageKm: number;
  priceInCents: number;
  transmission: Transmission;
  fuelType: FuelType;
  status: VehicleStatus;
  isFeatured: boolean;
  coverPhoto: VehiclePhotoView | null;
}

export interface VehicleDetails extends VehicleSummary {
  bodyType: BodyType;
  color: string;
  doors: number | null;
  description: string | null;
  features: string[];
  photos: VehiclePhotoView[];
  publishedAt: Date | null;
  updatedAt: Date;
}

export interface AdminVehicleListItem extends VehicleSummary {
  updatedAt: Date;
  photoCount: number;
}

export interface PaginatedResult<TItem> {
  items: TItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
