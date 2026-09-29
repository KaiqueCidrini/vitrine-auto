import { CarFront } from "lucide-react";

import { cn } from "@/shared/lib/cn";

export function VehiclePhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-foreground/5 text-muted-foreground flex h-full w-full items-center justify-center",
        className,
      )}
      role="img"
      aria-label="Foto indisponível"
    >
      <CarFront className="size-12 opacity-40" aria-hidden />
    </div>
  );
}
