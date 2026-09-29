import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { updateVehicleAction } from "@/features/vehicles/actions/vehicle-actions";
import { VehicleForm } from "@/features/vehicles/components/admin/vehicle-form";
import { buildVehicleTitle } from "@/features/vehicles/domain/vehicle-formatters";
import { findVehicleForEditing } from "@/features/vehicles/server/vehicle-queries";
import { Container } from "@/shared/ui/container";

export const metadata: Metadata = { title: "Editar anúncio" };

export default async function EditVehiclePage({
  params,
}: PageProps<"/admin/veiculos/[id]/editar">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const vehicle = await findVehicleForEditing(id);
  if (!vehicle) notFound();

  return (
    <Container className="max-w-5xl">
      <p className="text-muted-foreground text-sm">Editar anúncio</p>
      <h1 className="mb-6 text-2xl font-extrabold">{buildVehicleTitle(vehicle)}</h1>
      {/* bind passa o id do anúncio como primeiro argumento da action. */}
      <VehicleForm action={updateVehicleAction.bind(null, vehicle.id)} vehicle={vehicle} />
    </Container>
  );
}
