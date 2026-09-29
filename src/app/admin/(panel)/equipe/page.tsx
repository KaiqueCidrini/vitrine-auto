import type { Metadata } from "next";

import { EMPLOYEE_ROLE_LABELS } from "@/features/auth/domain/employee-role";
import { requireAdmin } from "@/features/auth/server/current-employee";
import { CreateEmployeeForm } from "@/features/team/components/create-employee-form";
import { RemoveEmployeeButton } from "@/features/team/components/remove-employee-button";
import { listEmployees } from "@/features/team/server/employee-queries";
import { Badge } from "@/shared/ui/badge";
import { Container } from "@/shared/ui/container";

export const metadata: Metadata = { title: "Equipe" };

export default async function TeamPage() {
  const currentAdmin = await requireAdmin();
  const employees = await listEmployees();

  return (
    <Container className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Equipe</h1>
        <p className="text-muted-foreground text-sm">
          Vendedores gerenciam anúncios. Gerentes também cadastram e removem funcionários.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ul className="divide-border border-border bg-surface divide-y self-start overflow-hidden rounded-lg border">
          {employees.map((employee) => (
            <li key={employee.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {employee.name}
                  <Badge tone={employee.role === "admin" ? "primary" : "neutral"}>
                    {EMPLOYEE_ROLE_LABELS[employee.role]}
                  </Badge>
                  {employee.id === currentAdmin.id && (
                    <span className="text-muted-foreground text-xs font-normal">(você)</span>
                  )}
                </p>
                <p className="text-muted-foreground truncate text-sm">{employee.email}</p>
              </div>
              {employee.id !== currentAdmin.id && (
                <RemoveEmployeeButton employeeId={employee.id} employeeName={employee.name} />
              )}
            </li>
          ))}
        </ul>

        <section className="border-border bg-surface self-start rounded-lg border p-5">
          <h2 className="mb-4 font-bold">Novo funcionário</h2>
          <CreateEmployeeForm />
        </section>
      </div>
    </Container>
  );
}
