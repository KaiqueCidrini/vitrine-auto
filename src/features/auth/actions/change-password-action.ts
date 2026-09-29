"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

import {
  actionError,
  actionSuccess,
  actionValidationError,
  type ActionState,
} from "@/shared/lib/action-result";

import { getAuth, MIN_PASSWORD_LENGTH } from "../server/auth";
import { requireEmployee } from "../server/current-employee";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `A nova senha precisa de pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

export async function changePasswordAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireEmployee();

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return actionValidationError(parsed.error);

  try {
    await getAuth().api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) return actionError("Senha atual incorreta.");
    throw error;
  }

  return actionSuccess("Senha alterada. Outras sessões abertas foram encerradas.");
}
