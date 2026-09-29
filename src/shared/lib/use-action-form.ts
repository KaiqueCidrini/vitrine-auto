"use client";

import { startTransition, useActionState, type FormEvent } from "react";

import { IDLE_ACTION_STATE, type ActionState } from "./action-result";

type FormAction = (previousState: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Igual ao useActionState, mas sem limpar os campos quando a validação falha.
 * (Com <form action={...}>, o React 19 reseta o formulário após cada envio,
 * o que faria o funcionário perder tudo que digitou por causa de um erro.)
 */
export function useActionForm(action: FormAction) {
  const [state, formAction, isPending] = useActionState(action, IDLE_ACTION_STATE);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return { state, fieldErrors, isPending, formAction, handleSubmit };
}
