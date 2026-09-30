import { SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { VehicleBodyTypeTabs } from "@/features/vehicles/components/vehicle-body-type-tabs";
import { VehicleGrid } from "@/features/vehicles/components/vehicle-grid";
import { VehiclePagination } from "@/features/vehicles/components/vehicle-pagination";
import { VehicleSearchFilters } from "@/features/vehicles/components/vehicle-search-filters";
import { parseVehicleSearchParams } from "@/features/vehicles/domain/vehicle-search-params";
import {
  countPublishedVehiclesByBodyType,
  listPublishedBrands,
  searchPublishedVehicles,
} from "@/features/vehicles/server/vehicle-queries";
import { Container } from "@/shared/ui/container";

export const metadata: Metadata = {
  title: "Estoque de veículos",
  description:
    "Veja todos os carros disponíveis, filtre por marca, preço e ano e agende sua visita.",
};

export default async function VehiclesPage({ searchParams }: PageProps<"/veiculos">) {
  // O estoque muda a todo momento: renderiza a cada acesso, direto do banco.
  await connection();

  const filters = parseVehicleSearchParams(await searchParams);
  const [result, brands, bodyTypeCounts] = await Promise.all([
    searchPublishedVehicles(filters),
    listPublishedBrands(),
    countPublishedVehiclesByBodyType(),
  ]);

  return (
    <>
      <header className="border-border bg-surface border-b">
        <Container className="flex flex-col gap-8 pt-14 pb-8 lg:pt-20">
          <div className="animate-fade-up">
            <p className="eyebrow text-muted-foreground">Estoque</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-5xl leading-none sm:text-6xl">Nosso estoque</h1>
              <p className="text-muted-foreground" aria-live="polite">
                {result.totalItems === 1
                  ? "1 veículo encontrado"
                  : `${result.totalItems} veículos encontrados`}
              </p>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:150ms]">
            <VehicleBodyTypeTabs filters={filters} bodyTypeCounts={bodyTypeCounts} />
          </div>
        </Container>
      </header>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <details className="group lg:hidden">
              <summary className="border-border bg-surface rounded-button mb-4 flex h-12 cursor-pointer list-none items-center justify-center gap-2 border text-sm font-semibold">
                <SlidersHorizontal className="size-4" aria-hidden /> Filtros e ordenação
              </summary>
              <VehicleSearchFilters filters={filters} brands={brands} />
            </details>
            <div className="hidden lg:block">
              <VehicleSearchFilters filters={filters} brands={brands} />
            </div>
          </aside>

          <section aria-labelledby="resultados-title">
            <h2 id="resultados-title" className="sr-only">
              Resultados
            </h2>
            {result.items.length > 0 ? (
              <>
                <VehicleGrid vehicles={result.items} />
                <VehiclePagination
                  filters={filters}
                  currentPage={result.currentPage}
                  totalPages={result.totalPages}
                />
              </>
            ) : (
              <div className="border-border bg-surface rounded-lg border border-dashed px-6 py-20 text-center">
                <p className="font-display text-3xl">Nenhum veículo encontrado</p>
                <p className="text-muted-foreground mt-3">
                  Tente ampliar a busca ou{" "}
                  <Link href="/veiculos" className="text-foreground font-semibold underline">
                    veja todo o estoque
                  </Link>
                  .
                </p>
              </div>
            )}
          </section>
        </div>
      </Container>
    </>
  );
}
