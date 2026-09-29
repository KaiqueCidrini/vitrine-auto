"use client";

import { useRef } from "react";

import { useActionForm } from "@/shared/lib/use-action-form";
import { Button } from "@/shared/ui/button";
import { fieldErrorProps, FormField, Input } from "@/shared/ui/form-controls";
import { FormMessage } from "@/shared/ui/form-message";

import { changePasswordAction } from "../actions/change-password-action";

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, fieldErrors, isPending, handleSubmit } = useActionForm(
    async (previousState, formData) => {
      const result = await changePasswordAction(previousState, formData);
      if (result.status === "success") formRef.current?.reset();
      return result;
    },
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <FormField
        label="Senha atual"
        htmlFor="currentPassword"
        errors={fieldErrors?.currentPassword}
      >
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          {...fieldErrorProps("currentPassword", fieldErrors?.currentPassword)}
        />
      </FormField>
      <FormField label="Nova senha" htmlFor="newPassword" errors={fieldErrors?.newPassword}>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          {...fieldErrorProps("newPassword", fieldErrors?.newPassword)}
        />
      </FormField>
      <FormField
        label="Confirme a nova senha"
        htmlFor="confirmPassword"
        errors={fieldErrors?.confirmPassword}
      >
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...fieldErrorProps("confirmPassword", fieldErrors?.confirmPassword)}
        />
      </FormField>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Alterar senha"}
      </Button>
    </form>
  );
}
