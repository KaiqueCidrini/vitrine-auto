import { ArrowRight } from "lucide-react";

import { BUTTON_ARROW_CLASS_NAME, ButtonLink } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

export default function PublicNotFound() {
  return (
    <Container className="animate-fade-up flex flex-col items-center py-32 text-center">
      <p className="eyebrow text-muted-foreground">Erro 404</p>
      <h1 className="font-display mt-6 text-5xl text-balance sm:text-6xl">
        Não encontramos esta página
      </h1>
      <p className="text-muted-foreground mt-5 max-w-md text-lg">
        O veículo pode ter saído do estoque ou o endereço está incorreto.
      </p>
      <ButtonLink href="/veiculos" size="lg" className="mt-10">
        Ver veículos disponíveis <ArrowRight className={BUTTON_ARROW_CLASS_NAME} aria-hidden />
      </ButtonLink>
    </Container>
  );
}
