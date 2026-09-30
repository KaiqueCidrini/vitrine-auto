import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Input, Select } from "@/shared/ui/form-controls";

import {
  BODY_TYPE_LABELS,
  BODY_TYPES,
  TRANSMISSION_LABELS,
  TRANSMISSIONS,
} from "../domain/vehicle-attributes";
import {
  SEARCH_PARAM_NAMES,
  VEHICLE_SORT_LABELS,
  VEHICLE_SORT_OPTIONS,
  type VehicleSearchFilters,
} from "../domain/vehicle-search-params";

interface VehicleSearchFiltersProps {
  filters: VehicleSearchFilters;
  brands: string[];
}

const PRICE_OPTIONS_IN_REAIS = [30_000, 50_000, 70_000, 100_000, 150_000, 200_000, 300_000];
const MIN_YEAR_OPTIONS = Array.from({ length: 12 }, (_, index) => new Date().getFullYear() - index);

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/**
 * Formulário GET comum: funciona sem JavaScript e gera URLs compartilháveis
 * (ex.: /veiculos?carroceria=suv&precoMax=100000).
 */
export function VehicleSearchFilters({ filters, brands }: VehicleSearchFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.brand ||
    filters.bodyType ||
    filters.transmission ||
    filters.maxPriceInCents ||
    filters.minYear,
  );

  return (
    <form
      action="/veiculos"
      method="get"
      className="border-border bg-surface rounded-lg border p-6"
    >
      <p className="eyebrow text-muted-foreground mb-5 flex items-center gap-2">
        <SlidersHorizontal className="size-3.5" aria-hidden /> Filtrar estoque
      </p>

      <div className="grid gap-4">
        <label className="relative block">
          <span className="sr-only">Buscar por marca ou modelo</span>
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            name={SEARCH_PARAM_NAMES.search}
            defaultValue={filters.search}
            placeholder="Marca ou modelo"
            className="pl-9"
            type="search"
          />
        </label>

        <FilterSelect
          label="Marca"
          name={SEARCH_PARAM_NAMES.brand}
          defaultValue={filters.brand}
          placeholder="Todas"
        >
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Carroceria"
          name={SEARCH_PARAM_NAMES.bodyType}
          defaultValue={filters.bodyType}
          placeholder="Todas"
        >
          {BODY_TYPES.map((bodyType) => (
            <option key={bodyType} value={bodyType}>
              {BODY_TYPE_LABELS[bodyType]}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Câmbio"
          name={SEARCH_PARAM_NAMES.transmission}
          defaultValue={filters.transmission}
          placeholder="Todos"
        >
          {TRANSMISSIONS.map((transmission) => (
            <option key={transmission} value={transmission}>
              {TRANSMISSION_LABELS[transmission]}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Preço até"
          name={SEARCH_PARAM_NAMES.maxPrice}
          defaultValue={filters.maxPriceInCents ? String(filters.maxPriceInCents / 100) : undefined}
          placeholder="Qualquer valor"
        >
          {PRICE_OPTIONS_IN_REAIS.map((price) => (
            <option key={price} value={price}>
              {priceFormatter.format(price)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Ano a partir de"
          name={SEARCH_PARAM_NAMES.minYear}
          defaultValue={filters.minYear ? String(filters.minYear) : undefined}
          placeholder="Qualquer ano"
        >
          {MIN_YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Ordenar por"
          name={SEARCH_PARAM_NAMES.sort}
          defaultValue={filters.sort}
        >
          {VEHICLE_SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {VEHICLE_SORT_LABELS[option]}
            </option>
          ))}
        </FilterSelect>

        <Button type="submit" className="w-full">
          Aplicar filtros
        </Button>
        {hasActiveFilters && (
          <Link
            href="/veiculos"
            className="text-muted-foreground hover:text-foreground text-center text-sm font-medium"
          >
            Limpar filtros
          </Link>
        )}
      </div>
    </form>
  );
}

interface FilterSelectProps {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  children: React.ReactNode;
}

function FilterSelect({ label, name, defaultValue, placeholder, children }: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <Select name={name} defaultValue={defaultValue ?? ""}>
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </Select>
    </label>
  );
}
