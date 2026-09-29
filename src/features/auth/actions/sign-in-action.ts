"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { actionError, actionValidationError, type ActionState } from "@/shared/lib/action-result";

import { getAuth } from "../server/auth";
import { ADMIN_HOME_PATH } from "../server/current-employee";
import {
  getClientIp,
  isLoginBlocked,
  registerFailedLogin,
  registerSuccessfulLogin,
} from "../server/login-attempts";

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido")),
  password: z.string().min(1, "Informe a senha"),
});

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return actionValidationError(parsed.error);

  const requestHeaders = await headers();
  const { email } = parsed.data;
  const clientIp = getClientIp(requestHeaders);

  if (isLoginBlocked(email, clientIp)) {
    return actionError("Muitas tentativas. Aguarde 15 minutos e tente novamente.");
  }

  try {
    await getAuth().api.signInEmail({ body: parsed.data, headers: requestHeaders });
  } catch (error) {
    if (error instanceof APIError) {
      registerFailedLogin(email, clientIp);
      return actionError("E-mail ou senha inválidos.");
    }
    throw error;
  }

  registerSuccessfulLogin(email);
  // Fora do try: redirect() funciona lançando uma exceção interna do Next.
  redirect(ADMIN_HOME_PATH);
}
