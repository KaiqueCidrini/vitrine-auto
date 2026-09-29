import { ExternalLink, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EMPLOYEE_ROLE_LABELS } from "@/features/auth/domain/employee-role";
import { signOutAction } from "@/features/auth/actions/sign-out-action";
import type { Employee } from "@/features/auth/server/current-employee";
import type { TenantConfig } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

import { AdminNavigation } from "./admin-navigation";

export function AdminHeader({ tenant, employee }: { tenant: TenantConfig; employee: Employee }) {
  return (
    <header className="border-border bg-surface border-b">
      <Container className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/admin/veiculos" className="shrink-0">
            <Image
              src={tenant.logo.src}
              alt={tenant.logo.alt}
              width={tenant.logo.width}
              height={tenant.logo.height}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:block">
            <AdminNavigation isAdmin={employee.role === "admin"} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="leading-tight">
            <p className="font-semibold">{employee.name}</p>
            <p className="text-muted-foreground text-xs">{EMPLOYEE_ROLE_LABELS[employee.role]}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="text-muted-foreground hover:bg-foreground/5 hover:text-foreground flex items-center gap-1.5 rounded-md px-3 py-2"
            >
              <ExternalLink className="size-4" aria-hidden /> Ver site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-muted-foreground hover:bg-foreground/5 hover:text-foreground flex items-center gap-1.5 rounded-md px-3 py-2"
              >
                <LogOut className="size-4" aria-hidden /> Sair
              </button>
            </form>
          </div>
        </div>

        <div className="md:hidden">
          <AdminNavigation isAdmin={employee.role === "admin"} />
        </div>
      </Container>
    </header>
  );
}
