"use client";

import { useRef } from "react";

import { EMPLOYEE_ROLE_LABELS, EMPLOYEE_ROLES } from "@/features/auth/domain/employee-role";
import { useActionForm } from "@/shared/lib/use-action-form";
import { Button } from "@/shared/ui/button";
import { fieldErrorProps, FormField, Input, Select } from "@/shared/ui/form-controls";
import { FormMessage } from "@/shared/ui/form-message";

import { createEmployeeAction } from "../actions/employee-actions";

export function CreateEmployeeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { state, fieldErrors, isPending, handleSubmit } = useActionForm(
    async (previousState, formData) => {
      const result = await createEmployeeAction(previousState, formData);
      if (result.status === "success") formRef.current?.reset();
      return result;
    },
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <FormMessage state={state} />
      <FormField label="Nome" htmlFor="name" errors={fieldErrors?.name}>
        <Input
          id="name"
          name="name"
          autoComplete="off"
          {...fieldErrorProps("name", fieldErrors?.name)}
        />
      </FormField>
      <FormField label="E-mail" htmlFor="email" errors={fieldErrors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          {...fieldErrorProps("email", fieldErrors?.email)}
        />
      </FormField>
      <FormField
        label="Senha provisória"
        htmlFor="password"
        errors={fieldErrors?.password}
        hint="Peça para trocar no primeiro acesso, em Minha conta."
      >
        <Input
          id="password"
          name="password"
          type="text"
          autoComplete="new-password"
          {...fieldErrorProps("password", fieldErrors?.password)}
        />
      </FormField>
      <FormField label="Perfil" htmlFor="role" errors={fieldErrors?.role}>
        <Select id="role" name="role" defaultValue="seller">
          {EMPLOYEE_ROLES.map((role) => (
            <option key={role} value={role}>
              {EMPLOYEE_ROLE_LABELS[role]}
            </option>
          ))}
        </Select>
      </FormField>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Cadastrando..." : "Cadastrar funcionário"}
      </Button>
    </form>
  );
}
