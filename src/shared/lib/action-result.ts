import type { z } from "zod";

/** Formato único de retorno das Server Actions usadas com useActionState. */
export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[] | undefined> };

export const IDLE_ACTION_STATE: ActionState = { status: "idle" };

export function actionSuccess(message: string): ActionState {
  return { status: "success", message };
}

export function actionError(
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionState {
  return { status: "error", message, fieldErrors };
}

export function actionValidationError(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }
  return actionError("Revise os campos destacados.", fieldErrors);
}
