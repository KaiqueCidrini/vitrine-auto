import { ButtonLink } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

export default function PublicNotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="text-primary text-sm font-semibold">Erro 404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Não encontramos esta página</h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        O veículo pode ter saído do estoque ou o endereço está incorreto.
      </p>
      <ButtonLink href="/veiculos" className="mt-8">
        Ver veículos disponíveis
      </ButtonLink>
    </Container>
  );
}
