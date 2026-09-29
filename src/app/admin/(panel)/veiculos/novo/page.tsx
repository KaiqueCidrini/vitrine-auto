import type { Metadata } from "next";

import { createVehicleAction } from "@/features/vehicles/actions/vehicle-actions";
import { VehicleForm } from "@/features/vehicles/components/admin/vehicle-form";
import { Container } from "@/shared/ui/container";

export const metadata: Metadata = { title: "Novo anúncio" };

export default function NewVehiclePage() {
  return (
    <Container className="max-w-5xl">
      <h1 className="mb-6 text-2xl font-extrabold">Novo anúncio</h1>
      <VehicleForm action={createVehicleAction} />
    </Container>
  );
}
