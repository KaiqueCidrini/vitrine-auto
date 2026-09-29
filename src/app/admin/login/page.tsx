import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { ADMIN_HOME_PATH, getCurrentEmployee } from "@/features/auth/server/current-employee";
import { getTenant } from "@/tenants/tenant-registry";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getCurrentEmployee()) redirect(ADMIN_HOME_PATH);

  const tenant = getTenant();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={tenant.logo.src}
            alt={tenant.logo.alt}
            width={tenant.logo.width}
            height={tenant.logo.height}
            className="h-10 w-auto"
          />
          <h1 className="mt-6 text-2xl font-extrabold">Painel da equipe</h1>
          <p className="text-muted-foreground mt-1 text-sm">Acesso restrito a funcionários.</p>
        </div>

        <div className="border-border bg-surface rounded-lg border p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Esqueceu a senha? Peça ao gerente para redefinir.
          <br />
          <Link href="/" className="hover:text-foreground mt-3 inline-block font-medium">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
