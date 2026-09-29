import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { VehicleGrid } from "@/features/vehicles/components/vehicle-grid";
import { VehiclePagination } from "@/features/vehicles/components/vehicle-pagination";
import { VehicleSearchFilters } from "@/features/vehicles/components/vehicle-search-filters";
import { parseVehicleSearchParams } from "@/features/vehicles/domain/vehicle-search-params";
import {
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
  const [result, brands] = await Promise.all([
    searchPublishedVehicles(filters),
    listPublishedBrands(),
  ]);

  return (
    <Container className="py-10 lg:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Nosso estoque</h1>
        <p className="text-muted-foreground mt-2">
          {result.totalItems === 1
            ? "1 veículo encontrado"
            : `${result.totalItems} veículos encontrados`}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="group lg:hidden" open={false}>
            <summary className="border-border bg-surface mb-4 cursor-pointer list-none rounded-md border px-4 py-3 text-sm font-semibold">
              Filtros e ordenação
            </summary>
            <VehicleSearchFilters filters={filters} brands={brands} />
          </details>
          <div className="hidden lg:block">
            <VehicleSearchFilters filters={filters} brands={brands} />
          </div>
        </aside>

        <section aria-label="Resultados">
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
            <div className="border-border bg-surface rounded-lg border border-dashed px-6 py-16 text-center">
              <p className="text-lg font-semibold">Nenhum veículo encontrado com esses filtros.</p>
              <p className="text-muted-foreground mt-2">
                Tente ampliar a busca ou{" "}
                <Link href="/veiculos" className="text-primary font-semibold underline">
                  veja todo o estoque
                </Link>
                .
              </p>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
