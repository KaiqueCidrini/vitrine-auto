import type { Metadata } from "next";

import { AdminHeader } from "@/features/admin/components/admin-header";
import { requireEmployee } from "@/features/auth/server/current-employee";
import { getTenant } from "@/tenants/tenant-registry";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel" },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const employee = await requireEmployee();

  return (
    <>
      <AdminHeader tenant={getTenant()} employee={employee} />
      <main className="flex-1 py-8">{children}</main>
    </>
  );
}
