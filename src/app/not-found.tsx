import { ButtonLink } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-primary text-sm font-semibold">Erro 404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Página não encontrada</h1>
      <ButtonLink href="/" className="mt-8">
        Ir para o início
      </ButtonLink>
    </main>
  );
}
