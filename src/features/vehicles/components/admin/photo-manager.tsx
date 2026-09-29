"use client";

import { ArrowLeft, ArrowRight, Loader2, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState, type ChangeEvent, type DragEvent } from "react";

import { cn } from "@/shared/lib/cn";

import { uploadVehiclePhotoAction } from "../../actions/vehicle-actions";
import { preparePhotoForUpload } from "../../client/prepare-photo-for-upload";
import { MAX_PHOTOS_PER_VEHICLE } from "../../domain/vehicle-attributes";
import type { VehiclePhotoInput } from "../../domain/vehicle-form-schema";

export type ManagedPhoto = VehiclePhotoInput & { url: string };

interface PendingUpload {
  id: string;
  previewUrl: string;
}

interface PhotoManagerProps {
  initialPhotos: ManagedPhoto[];
  errors?: string[];
  /** Avisa o formulário para bloquear o botão de salvar enquanto há envios em andamento. */
  onUploadingChange?: (isUploading: boolean) => void;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const reordered = [...items];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return reordered;
}

/**
 * Envia as fotos assim que são escolhidas (uma por vez) e mantém a ordem definida
 * pelo funcionário. A lista final vai para o formulário num campo oculto "photos".
 */
export function PhotoManager({ initialPhotos, errors, onUploadingChange }: PhotoManagerProps) {
  const inputId = useId();
  const [photos, setPhotos] = useState<ManagedPhoto[]>(initialPhotos);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const hasPendingUploads = pendingUploads.length > 0;
  useEffect(() => {
    onUploadingChange?.(hasPendingUploads);
  }, [hasPendingUploads, onUploadingChange]);

  const remainingSlots = MAX_PHOTOS_PER_VEHICLE - photos.length - pendingUploads.length;

  async function uploadFiles(files: File[]) {
    const acceptedFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, remainingSlots));
    if (acceptedFiles.length === 0) return;

    setUploadErrors([]);
    const uploads = acceptedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingUploads((current) => [
      ...current,
      ...uploads.map(({ id, previewUrl }) => ({ id, previewUrl })),
    ]);

    for (const upload of uploads) {
      try {
        const formData = new FormData();
        formData.append("photo", await preparePhotoForUpload(upload.file));
        const result = await uploadVehiclePhotoAction(formData);
        if (result.status === "success") {
          setPhotos((current) => [...current, result.photo]);
        } else {
          setUploadErrors((current) => [...current, result.message]);
        }
      } catch {
        setUploadErrors((current) => [
          ...current,
          `${upload.file.name}: falha no envio. Verifique a conexão e tente novamente.`,
        ]);
      } finally {
        URL.revokeObjectURL(upload.previewUrl);
        setPendingUploads((current) => current.filter((pending) => pending.id !== upload.id));
      }
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    void uploadFiles(Array.from(event.dataTransfer.files));
  }

  const movePhoto = (fromIndex: number, toIndex: number) =>
    setPhotos((current) => moveItem(current, fromIndex, toIndex));
  const removePhoto = (storageKey: string) =>
    setPhotos((current) => current.filter((photo) => photo.storageKey !== storageKey));

  const serializedPhotos = JSON.stringify(
    photos.map(({ storageKey, width, height }) => ({ storageKey, width, height })),
  );
  const allErrors = [...uploadErrors, ...(errors ?? [])];

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="photos" value={serializedPhotos} />

      {remainingSlots > 0 && (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={cn(
            "border-border flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition",
            isDraggingOver ? "border-primary bg-primary/5" : "hover:border-primary/60",
          )}
        >
          <Upload className="text-muted-foreground size-8" aria-hidden />
          <span className="font-semibold">Arraste as fotos aqui ou clique para escolher</span>
          <span className="text-muted-foreground text-xs">
            JPG, PNG ou WebP · até 10 MB cada · faltam {remainingSlots} de {MAX_PHOTOS_PER_VEHICLE}
          </span>
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={handleFileSelection}
          />
        </label>
      )}

      {allErrors.length > 0 && (
        <ul
          role="alert"
          className="bg-danger/10 text-danger flex flex-col gap-1 rounded-md px-3 py-2 text-sm"
        >
          {allErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {(photos.length > 0 || pendingUploads.length > 0) && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <li
              key={photo.storageKey}
              className="group border-border bg-surface relative overflow-hidden rounded-md border"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-sm px-2 py-0.5 text-xs font-bold">
                    Capa
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex gap-1">
                  <PhotoActionButton
                    label="Mover para a esquerda"
                    disabled={index === 0}
                    onClick={() => movePhoto(index, index - 1)}
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                  </PhotoActionButton>
                  <PhotoActionButton
                    label="Mover para a direita"
                    disabled={index === photos.length - 1}
                    onClick={() => movePhoto(index, index + 1)}
                  >
                    <ArrowRight className="size-4" aria-hidden />
                  </PhotoActionButton>
                  <PhotoActionButton
                    label="Usar como capa"
                    disabled={index === 0}
                    onClick={() => movePhoto(index, 0)}
                  >
                    <Star className="size-4" aria-hidden />
                  </PhotoActionButton>
                </div>
                <PhotoActionButton
                  label="Remover foto"
                  onClick={() => removePhoto(photo.storageKey)}
                >
                  <Trash2 className="text-danger size-4" aria-hidden />
                </PhotoActionButton>
              </div>
            </li>
          ))}

          {pendingUploads.map((upload) => (
            <li
              key={upload.id}
              className="border-border relative overflow-hidden rounded-md border"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={upload.previewUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2
                    className="text-primary size-8 animate-spin"
                    aria-label="Enviando foto"
                  />
                </div>
              </div>
              <p className="text-muted-foreground p-2 text-center text-xs">Enviando...</p>
            </li>
          ))}
        </ul>
      )}

      {pendingUploads.length > 0 && (
        <p aria-live="polite" className="text-muted-foreground text-sm">
          Aguarde o envio das fotos antes de salvar.
        </p>
      )}
    </div>
  );
}

interface PhotoActionButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PhotoActionButton({ label, disabled, onClick, children }: PhotoActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="hover:bg-foreground/5 flex size-8 items-center justify-center rounded-sm disabled:opacity-30"
    >
      {children}
    </button>
  );
}
