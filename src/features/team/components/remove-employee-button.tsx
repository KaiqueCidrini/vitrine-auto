"use client";

import { useState, useTransition } from "react";

import { Button } from "@/shared/ui/button";

import { removeEmployeeAction } from "../actions/employee-actions";

export function RemoveEmployeeButton({
  employeeId,
  employeeName,
}: {
  employeeId: string;
  employeeName: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function removeEmployee() {
    startTransition(async () => {
      const result = await removeEmployeeAction(employeeId);
      if (result.status === "error") setErrorMessage(result.message);
    });
  }

  if (!isConfirming) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-danger"
        onClick={() => setIsConfirming(true)}
      >
        Remover
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="danger"
          disabled={isPending}
          onClick={removeEmployee}
          aria-label={`Confirmar remoção de ${employeeName}`}
        >
          Confirmar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => setIsConfirming(false)}
        >
          Cancelar
        </Button>
      </div>
      {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}
    </div>
  );
}
