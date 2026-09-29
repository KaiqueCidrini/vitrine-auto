import type { ActionState } from "@/shared/lib/action-result";
import { cn } from "@/shared/lib/cn";

/** Mensagem geral de sucesso/erro de um formulário, anunciada por leitores de tela. */
export function FormMessage({ state, className }: { state: ActionState; className?: string }) {
  if (state.status === "idle") return <p aria-live="polite" className="sr-only" />;

  return (
    <p
      aria-live="polite"
      role={state.status === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium",
        state.status === "error" ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
        className,
      )}
    >
      {state.message}
    </p>
  );
}
