"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { ActionState } from "@/shared/lib/action-result";
import { useActionForm } from "@/shared/lib/use-action-form";
import { Button, buttonClassName } from "@/shared/ui/button";
import { fieldErrorProps, FormField, Input, Select, Textarea } from "@/shared/ui/form-controls";
import { FormMessage } from "@/shared/ui/form-message";

import {
  BODY_TYPE_LABELS,
  BODY_TYPES,
  FUEL_TYPE_LABELS,
  FUEL_TYPES,
  TRANSMISSION_LABELS,
  TRANSMISSIONS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUSES,
  type VehicleStatus,
} from "../../domain/vehicle-attributes";
import { COMMON_FEATURES } from "../../domain/vehicle-form-schema";
import { formatCentsForInput } from "../../domain/vehicle-formatters";
import type { VehicleDetails } from "../../domain/vehicle-models";
import { PhotoManager } from "./photo-manager";

const COMMON_BRANDS = [
  "Audi",
  "BMW",
  "BYD",
  "Caoa Chery",
  "Chevrolet",
  "Citroën",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Renault",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const STATUS_DESCRIPTIONS: Record<VehicleStatus, string> = {
  draft: "Só a equipe vê. Use enquanto prepara o anúncio.",
  published: "Aparece no site para todos os visitantes.",
  sold: "Sai da listagem, mas o link continua abrindo com o selo de vendido.",
};

interface VehicleFormProps {
  action: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
  vehicle?: VehicleDetails;
}

export function VehicleForm({ action, vehicle }: VehicleFormProps) {
  const { state, fieldErrors, isPending, handleSubmit } = useActionForm(action);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const customFeatures =
    vehicle?.features.filter(
      (feature) => !(COMMON_FEATURES as readonly string[]).includes(feature),
    ) ?? [];
  const errorsFor = (field: string) => fieldErrors?.[field];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <FormMessage state={state} />

      <FormSection
        title="Identificação"
        description="Como o carro vai aparecer no título do anúncio."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Marca" htmlFor="brand" errors={errorsFor("brand")}>
            <Input
              id="brand"
              name="brand"
              list="brand-options"
              defaultValue={vehicle?.brand}
              required
              {...fieldErrorProps("brand", errorsFor("brand"))}
            />
            <datalist id="brand-options">
              {COMMON_BRANDS.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </FormField>
          <FormField label="Modelo" htmlFor="model" errors={errorsFor("model")}>
            <Input
              id="model"
              name="model"
              defaultValue={vehicle?.model}
              placeholder="Ex.: Onix"
              required
              {...fieldErrorProps("model", errorsFor("model"))}
            />
          </FormField>
          <FormField label="Versão" htmlFor="version" errors={errorsFor("version")} hint="Opcional">
            <Input
              id="version"
              name="version"
              defaultValue={vehicle?.version ?? ""}
              placeholder="Ex.: LT 1.0 Turbo"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Ano, quilometragem e preço">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField
            label="Ano de fabricação"
            htmlFor="manufactureYear"
            errors={errorsFor("manufactureYear")}
          >
            <Input
              id="manufactureYear"
              name="manufactureYear"
              type="number"
              inputMode="numeric"
              defaultValue={vehicle?.manufactureYear}
              required
              {...fieldErrorProps("manufactureYear", errorsFor("manufactureYear"))}
            />
          </FormField>
          <FormField label="Ano do modelo" htmlFor="modelYear" errors={errorsFor("modelYear")}>
            <Input
              id="modelYear"
              name="modelYear"
              type="number"
              inputMode="numeric"
              defaultValue={vehicle?.modelYear}
              required
              {...fieldErrorProps("modelYear", errorsFor("modelYear"))}
            />
          </FormField>
          <FormField label="Quilometragem (km)" htmlFor="mileageKm" errors={errorsFor("mileageKm")}>
            <Input
              id="mileageKm"
              name="mileageKm"
              inputMode="numeric"
              defaultValue={vehicle?.mileageKm}
              placeholder="Ex.: 45000"
              required
              {...fieldErrorProps("mileageKm", errorsFor("mileageKm"))}
            />
          </FormField>
          <FormField label="Preço (R$)" htmlFor="price" errors={errorsFor("priceInCents")}>
            <Input
              id="price"
              name="price"
              inputMode="decimal"
              defaultValue={vehicle ? formatCentsForInput(vehicle.priceInCents) : ""}
              placeholder="Ex.: 89.900"
              required
              {...fieldErrorProps("price", errorsFor("priceInCents"))}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Características">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <FormField label="Câmbio" htmlFor="transmission" errors={errorsFor("transmission")}>
            <Select
              id="transmission"
              name="transmission"
              defaultValue={vehicle?.transmission ?? ""}
              {...fieldErrorProps("transmission", errorsFor("transmission"))}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TRANSMISSIONS.map((value) => (
                <option key={value} value={value}>
                  {TRANSMISSION_LABELS[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Combustível" htmlFor="fuelType" errors={errorsFor("fuelType")}>
            <Select
              id="fuelType"
              name="fuelType"
              defaultValue={vehicle?.fuelType ?? "flex"}
              {...fieldErrorProps("fuelType", errorsFor("fuelType"))}
            >
              {FUEL_TYPES.map((value) => (
                <option key={value} value={value}>
                  {FUEL_TYPE_LABELS[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Carroceria" htmlFor="bodyType" errors={errorsFor("bodyType")}>
            <Select
              id="bodyType"
              name="bodyType"
              defaultValue={vehicle?.bodyType ?? ""}
              {...fieldErrorProps("bodyType", errorsFor("bodyType"))}
            >
              <option value="" disabled>
                Selecione
              </option>
              {BODY_TYPES.map((value) => (
                <option key={value} value={value}>
                  {BODY_TYPE_LABELS[value]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Cor" htmlFor="color" errors={errorsFor("color")}>
            <Input
              id="color"
              name="color"
              defaultValue={vehicle?.color}
              placeholder="Ex.: Prata"
              required
              {...fieldErrorProps("color", errorsFor("color"))}
            />
          </FormField>
          <FormField label="Portas" htmlFor="doors" errors={errorsFor("doors")}>
            <Select
              id="doors"
              name="doors"
              defaultValue={vehicle?.doors ? String(vehicle.doors) : "4"}
            >
              <option value="">Não informar</option>
              {[2, 3, 4, 5].map((doors) => (
                <option key={doors} value={doors}>
                  {doors}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Opcionais">
        <fieldset className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <legend className="sr-only">Opcionais do veículo</legend>
          {COMMON_FEATURES.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="features"
                value={feature}
                defaultChecked={vehicle?.features.includes(feature)}
                className="size-4 accent-[var(--color-primary)]"
              />
              {feature}
            </label>
          ))}
        </fieldset>
        <FormField
          label="Outros opcionais"
          htmlFor="extraFeatures"
          hint="Separe por vírgula. Ex.: Engate, Película"
          className="mt-5"
        >
          <Input id="extraFeatures" name="extraFeatures" defaultValue={customFeatures.join(", ")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Descrição"
        description="Conte o histórico: único dono, revisões, garantia, estado de conservação."
      >
        <FormField
          label="Texto do anúncio"
          htmlFor="description"
          errors={errorsFor("description")}
          hint="Opcional"
        >
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={vehicle?.description ?? ""}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Fotos"
        description="A primeira foto é a capa do anúncio. Fotos na horizontal ficam melhores."
      >
        <PhotoManager
          initialPhotos={vehicle?.photos ?? []}
          errors={errorsFor("photos")}
          onUploadingChange={setIsUploadingPhotos}
        />
      </FormSection>

      <FormSection title="Publicação">
        <fieldset className="grid gap-3 sm:grid-cols-3">
          <legend className="sr-only">Status do anúncio</legend>
          {VEHICLE_STATUSES.map((status) => (
            <label
              key={status}
              className="border-border has-checked:border-primary has-checked:bg-primary/5 flex cursor-pointer gap-3 rounded-md border p-4"
            >
              <input
                type="radio"
                name="status"
                value={status}
                defaultChecked={(vehicle?.status ?? "published") === status}
                className="mt-0.5 size-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block text-sm font-semibold">{VEHICLE_STATUS_LABELS[status]}</span>
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {STATUS_DESCRIPTIONS[status]}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={vehicle?.isFeatured}
            className="size-4 accent-[var(--color-primary)]"
          />
          Mostrar nos destaques da página inicial
        </label>
      </FormSection>

      <div className="border-border bg-background/95 sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-6">
        {state.status === "error" && (
          <p className="text-danger mr-auto text-sm font-medium">{state.message}</p>
        )}
        <Link href="/admin/veiculos" className={buttonClassName({ variant: "ghost" })}>
          Cancelar
        </Link>
        <Button type="submit" disabled={isPending || isUploadingPhotos}>
          {isPending ? "Salvando..." : isUploadingPhotos ? "Enviando fotos..." : "Salvar anúncio"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-surface rounded-lg border p-5 sm:p-6">
      <h2 className="text-base font-bold">{title}</h2>
      {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
