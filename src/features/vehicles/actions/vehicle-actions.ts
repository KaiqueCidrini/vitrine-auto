"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireEmployee } from "@/features/auth/server/current-employee";
import { actionError, actionValidationError, type ActionState } from "@/shared/lib/action-result";
import { getFileStorage } from "@/shared/storage/get-file-storage";

import { VEHICLE_STATUSES } from "../domain/vehicle-attributes";
import {
  readVehicleFormData,
  vehicleFormSchema,
  type VehiclePhotoInput,
} from "../domain/vehicle-form-schema";
import {
  createVehicle,
  deleteVehicle,
  UnavailablePhotoError,
  updateVehicle,
  updateVehicleStatus,
} from "../server/vehicle-mutations";
import {
  InvalidPhotoError,
  MAX_PHOTO_SIZE_IN_BYTES,
  processVehiclePhoto,
} from "../server/vehicle-photo-processing";

const ADMIN_VEHICLES_PATH = "/admin/veiculos";
const vehicleIdSchema = z.uuid();

/** Apaga arquivos que saíram do anúncio. Falhas aqui não devem desfazer o que já foi salvo. */
async function deleteStoredFiles(storageKeys: string[]): Promise<void> {
  const storage = getFileStorage();
  const results = await Promise.allSettled(storageKeys.map((key) => storage.delete(key)));
  results
    .filter((result) => result.status === "rejected")
    .forEach((result) => console.error("Falha ao apagar arquivo do storage:", result.reason));
}

const UNAVAILABLE_PHOTO_STATE = actionError("Uma das fotos não está mais disponível.", {
  photos: ["Remova as fotos com problema ou recarregue a página e envie de novo."],
});

/** As páginas públicas são renderizadas a cada acesso; aqui limpamos o cache de navegação do cliente. */
function refreshVehiclePages(): void {
  revalidatePath("/", "layout");
}

export async function createVehicleAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const employee = await requireEmployee();

  const parsed = vehicleFormSchema.safeParse(readVehicleFormData(formData));
  if (!parsed.success) return actionValidationError(parsed.error);

  try {
    await createVehicle(parsed.data, employee.id);
  } catch (error) {
    if (error instanceof UnavailablePhotoError) return UNAVAILABLE_PHOTO_STATE;
    throw error;
  }

  refreshVehiclePages();
  redirect(`${ADMIN_VEHICLES_PATH}?aviso=criado`);
}

export async function updateVehicleAction(
  vehicleId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireEmployee();
  if (!vehicleIdSchema.safeParse(vehicleId).success) return actionError("Anúncio inválido.");

  const parsed = vehicleFormSchema.safeParse(readVehicleFormData(formData));
  if (!parsed.success) return actionValidationError(parsed.error);

  let result: Awaited<ReturnType<typeof updateVehicle>>;
  try {
    result = await updateVehicle(vehicleId, parsed.data);
  } catch (error) {
    if (error instanceof UnavailablePhotoError) return UNAVAILABLE_PHOTO_STATE;
    throw error;
  }
  if (!result) return actionError("Este anúncio não existe mais.");

  await deleteStoredFiles(result.removedStorageKeys);

  refreshVehiclePages();
  redirect(`${ADMIN_VEHICLES_PATH}?aviso=atualizado`);
}

export async function changeVehicleStatusAction(
  vehicleId: string,
  status: string,
): Promise<ActionState> {
  await requireEmployee();

  const parsedStatus = z.enum(VEHICLE_STATUSES).safeParse(status);
  if (!vehicleIdSchema.safeParse(vehicleId).success || !parsedStatus.success) {
    return actionError("Dados inválidos.");
  }

  const result = await updateVehicleStatus(vehicleId, parsedStatus.data);
  if (result === "not-found") return actionError("Este anúncio não existe mais.");
  if (result === "missing-photos")
    return actionError("Adicione ao menos uma foto antes de publicar.");

  refreshVehiclePages();
  return { status: "success", message: "Status atualizado." };
}

export async function deleteVehicleAction(vehicleId: string): Promise<ActionState> {
  await requireEmployee();
  if (!vehicleIdSchema.safeParse(vehicleId).success) return actionError("Anúncio inválido.");

  const storageKeys = await deleteVehicle(vehicleId);
  if (!storageKeys) return actionError("Este anúncio não existe mais.");

  await deleteStoredFiles(storageKeys);

  refreshVehiclePages();
  return { status: "success", message: "Anúncio excluído." };
}

export type UploadPhotoResult =
  | { status: "success"; photo: VehiclePhotoInput & { url: string } }
  | { status: "error"; message: string };

/**
 * Recebe uma foto por vez (o formulário envia em paralelo), processa e salva.
 * Assim nenhum envio fica grande demais e o funcionário vê o progresso foto a foto.
 */
export async function uploadVehiclePhotoAction(formData: FormData): Promise<UploadPhotoResult> {
  await requireEmployee();

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecione uma foto." };
  }
  if (file.size > MAX_PHOTO_SIZE_IN_BYTES) {
    return { status: "error", message: `${file.name}: a foto deve ter no máximo 10 MB.` };
  }

  try {
    const processed = await processVehiclePhoto(Buffer.from(await file.arrayBuffer()));
    const storageKey = `vehicles/${randomUUID()}.webp`;
    await getFileStorage().save(storageKey, processed.content, "image/webp");

    return {
      status: "success",
      photo: {
        storageKey,
        width: processed.width,
        height: processed.height,
        url: getFileStorage().getPublicUrl(storageKey),
      },
    };
  } catch (error) {
    if (error instanceof InvalidPhotoError) {
      return { status: "error", message: `${file.name}: ${error.message}` };
    }
    throw error;
  }
}
