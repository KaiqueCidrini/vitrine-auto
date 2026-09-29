import type { Metadata } from "next";

import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { EMPLOYEE_ROLE_LABELS } from "@/features/auth/domain/employee-role";
import { requireEmployee } from "@/features/auth/server/current-employee";
import { Container } from "@/shared/ui/container";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const employee = await requireEmployee();

  return (
    <Container className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Minha conta</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {employee.name} · {employee.email} · {EMPLOYEE_ROLE_LABELS[employee.role]}
      </p>

      <section className="border-border bg-surface mt-6 rounded-lg border p-5">
        <h2 className="mb-4 font-bold">Alterar senha</h2>
        <ChangePasswordForm />
      </section>
    </Container>
  );
}
