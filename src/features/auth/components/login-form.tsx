"use client";

import { useActionForm } from "@/shared/lib/use-action-form";
import { Button } from "@/shared/ui/button";
import { fieldErrorProps, FormField, Input } from "@/shared/ui/form-controls";
import { FormMessage } from "@/shared/ui/form-message";

import { signInAction } from "../actions/sign-in-action";

export function LoginForm() {
  const { state, fieldErrors, isPending, formAction, handleSubmit } = useActionForm(signInAction);

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormMessage state={state} />

      <FormField label="E-mail" htmlFor="email" errors={fieldErrors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          {...fieldErrorProps("email", fieldErrors?.email)}
        />
      </FormField>

      <FormField label="Senha" htmlFor="password" errors={fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          {...fieldErrorProps("password", fieldErrors?.password)}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="mt-2 w-full">
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
