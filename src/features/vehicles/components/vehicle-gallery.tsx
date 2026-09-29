"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

import { cn } from "@/shared/lib/cn";

import type { VehiclePhotoView } from "../domain/vehicle-models";
import { VehiclePhotoPlaceholder } from "./vehicle-photo-placeholder";

interface VehicleGalleryProps {
  photos: VehiclePhotoView[];
  vehicleTitle: string;
}

export function VehicleGallery({ photos, vehicleTitle }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const photoCount = photos.length;

  if (photoCount === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-lg">
        <VehiclePhotoPlaceholder />
      </div>
    );
  }

  const activePhoto = photos[activeIndex];
  const showPhoto = (index: number) => setActiveIndex((index + photoCount) % photoCount);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group bg-foreground/5 relative aspect-[4/3] overflow-hidden rounded-lg"
        role="region"
        aria-roledescription="galeria"
        aria-label={`Fotos do ${vehicleTitle}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Image
          key={activePhoto.storageKey}
          src={activePhoto.url}
          alt={`${vehicleTitle} - foto ${activeIndex + 1} de ${photoCount}`}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />

        {photoCount > 1 && (
          <>
            <GalleryArrow direction="previous" onClick={() => showPhoto(activeIndex - 1)} />
            <GalleryArrow direction="next" onClick={() => showPhoto(activeIndex + 1)} />
            <span className="absolute right-3 bottom-3 rounded-sm bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {photoCount}
            </span>
          </>
        )}
      </div>

      {photoCount > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {photos.map((photo, index) => (
            <li key={photo.storageKey}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-sm border-2 transition",
                  index === activeIndex
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={photo.url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Foto anterior" : "Próxima foto"}
      className={cn(
        "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}
