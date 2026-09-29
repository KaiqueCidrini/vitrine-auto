"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button, buttonClassName } from "@/shared/ui/button";

import { changeVehicleStatusAction, deleteVehicleAction } from "../../actions/vehicle-actions";
import type { VehicleStatus } from "../../domain/vehicle-attributes";

interface VehicleRowActionsProps {
  vehicleId: string;
  status: VehicleStatus;
  hasPhotos: boolean;
}

const QUICK_STATUS_ACTIONS: Record<
  VehicleStatus,
  { label: string; nextStatus: VehicleStatus } | null
> = {
  draft: { label: "Publicar", nextStatus: "published" },
  published: { label: "Marcar vendido", nextStatus: "sold" },
  sold: { label: "Republicar", nextStatus: "published" },
};

export function VehicleRowActions({ vehicleId, status, hasPhotos }: VehicleRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickAction = QUICK_STATUS_ACTIONS[status];
  const canRunQuickAction = quickAction && (quickAction.nextStatus !== "published" || hasPhotos);

  function runAction(action: () => Promise<{ status: string; message?: string }>) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.status === "error")
        setErrorMessage(result.message ?? "Não foi possível concluir.");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {canRunQuickAction && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              runAction(() => changeVehicleStatusAction(vehicleId, quickAction.nextStatus))
            }
          >
            {quickAction.label}
          </Button>
        )}
        <Link
          href={`/admin/veiculos/${vehicleId}/editar`}
          className={buttonClassName({ size: "sm", variant: "outline" })}
        >
          <Pencil className="size-3.5" aria-hidden /> Editar
        </Link>
        {isConfirmingDelete ? (
          <>
            <Button
              size="sm"
              variant="danger"
              disabled={isPending}
              onClick={() => runAction(() => deleteVehicleAction(vehicleId))}
            >
              Confirmar exclusão
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Excluir anúncio"
            onClick={() => setIsConfirmingDelete(true)}
          >
            <Trash2 className="text-danger size-4" aria-hidden />
          </Button>
        )}
      </div>
      {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}
    </div>
  );
}
