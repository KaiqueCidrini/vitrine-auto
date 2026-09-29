import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { AdminVehicleList } from "@/features/vehicles/components/admin/admin-vehicle-list";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUSES,
} from "@/features/vehicles/domain/vehicle-attributes";
import { listVehiclesForAdmin } from "@/features/vehicles/server/vehicle-queries";
import { cn } from "@/shared/lib/cn";
import { ButtonLink } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Input } from "@/shared/ui/form-controls";

export const metadata: Metadata = { title: "Anúncios" };

const NOTICES: Record<string, string> = {
  criado: "Anúncio criado com sucesso.",
  atualizado: "Anúncio atualizado com sucesso.",
};

const adminListParamsSchema = z.object({
  status: z.enum(VEHICLE_STATUSES).optional().catch(undefined),
  busca: z.string().trim().max(80).optional().catch(undefined),
  aviso: z.string().optional().catch(undefined),
});

export default async function AdminVehiclesPage({ searchParams }: PageProps<"/admin/veiculos">) {
  const params = adminListParamsSchema.parse(await searchParams);
  const vehicles = await listVehiclesForAdmin({
    status: params.status,
    search: params.busca || undefined,
  });
  const notice = params.aviso ? NOTICES[params.aviso] : undefined;

  const statusTabs = [
    { value: undefined, label: "Todos" },
    ...VEHICLE_STATUSES.map((value) => ({ value, label: VEHICLE_STATUS_LABELS[value] })),
  ];

  return (
    <Container className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Anúncios</h1>
          <p className="text-muted-foreground text-sm">
            Cadastre, edite e acompanhe os veículos do site.
          </p>
        </div>
        <ButtonLink href="/admin/veiculos/novo">
          <Plus className="size-4" aria-hidden /> Novo anúncio
        </ButtonLink>
      </div>

      {notice && (
        <p
          role="status"
          className="bg-success/10 text-success rounded-md px-4 py-3 text-sm font-medium"
        >
          {notice}
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filtrar por status" className="flex gap-1 overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive = params.status === tab.value;
            const href = tab.value ? `/admin/veiculos?status=${tab.value}` : "/admin/veiculos";
            return (
              <Link
                key={tab.label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <form method="get" className="relative md:w-72">
          {params.status && <input type="hidden" name="status" value={params.status} />}
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            name="busca"
            defaultValue={params.busca}
            placeholder="Buscar marca ou modelo"
            aria-label="Buscar anúncios"
            className="h-10 pl-9"
          />
        </form>
      </div>

      {vehicles.length > 0 ? (
        <AdminVehicleList vehicles={vehicles} />
      ) : (
        <div className="border-border bg-surface rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="font-semibold">Nenhum anúncio encontrado.</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Clique em &quot;Novo anúncio&quot; para cadastrar o primeiro veículo.
          </p>
        </div>
      )}
    </Container>
  );
}
