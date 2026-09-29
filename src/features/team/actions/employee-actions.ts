"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { EMPLOYEE_ROLES } from "@/features/auth/domain/employee-role";
import { getAuth, MIN_PASSWORD_LENGTH } from "@/features/auth/server/auth";
import { requireAdmin } from "@/features/auth/server/current-employee";
import {
  actionError,
  actionSuccess,
  actionValidationError,
  type ActionState,
} from "@/shared/lib/action-result";

const TEAM_PATH = "/admin/equipe";

const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome"),
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido")),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `A senha precisa de pelo menos ${MIN_PASSWORD_LENGTH} caracteres`),
  role: z.enum(EMPLOYEE_ROLES, { message: "Escolha um perfil" }),
});

export async function createEmployeeAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createEmployeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return actionValidationError(parsed.error);

  try {
    await getAuth().api.createUser({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      return actionError("Já existe um funcionário com este e-mail.", {
        email: ["E-mail já cadastrado"],
      });
    }
    throw error;
  }

  revalidatePath(TEAM_PATH);
  return actionSuccess(`${parsed.data.name} já pode acessar o painel.`);
}

export async function removeEmployeeAction(employeeId: string): Promise<ActionState> {
  const currentAdmin = await requireAdmin();

  if (employeeId === currentAdmin.id) {
    return actionError("Você não pode remover a própria conta.");
  }

  // Anúncios criados por ele continuam no ar: a FK usa ON DELETE SET NULL.
  await getAuth().api.removeUser({ body: { userId: employeeId }, headers: await headers() });

  revalidatePath(TEAM_PATH);
  return actionSuccess("Funcionário removido.");
}
