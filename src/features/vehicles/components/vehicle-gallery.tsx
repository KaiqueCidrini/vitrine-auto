"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "@/shared/lib/cn";

import type { VehiclePhotoView } from "../domain/vehicle-models";
import { VehiclePhotoPlaceholder } from "./vehicle-photo-placeholder";

interface VehicleGalleryProps {
  photos: VehiclePhotoView[];
  vehicleTitle: string;
}

/** Distância mínima (px) de um arraste com o dedo para trocar de foto. */
const SWIPE_THRESHOLD_PX = 50;

/** Troca de foto por arraste lateral (celular) — ignora toques e arrastes curtos. */
function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const startXRef = useRef<number | null>(null);

  return {
    onPointerDown: (event: PointerEvent) => {
      startXRef.current = event.clientX;
    },
    onPointerUp: (event: PointerEvent) => {
      if (startXRef.current === null) return;
      const deltaX = event.clientX - startXRef.current;
      startXRef.current = null;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) onSwipe(deltaX < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      startXRef.current = null;
    },
  };
}

export function VehicleGallery({ photos, vehicleTitle }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const fullscreenDialogRef = useRef<HTMLDialogElement>(null);
  const photoCount = photos.length;

  const showPhoto = (index: number) => setActiveIndex((index + photoCount) % photoCount);
  const showSibling = (direction: 1 | -1) => showPhoto(activeIndex + direction);
  const swipeHandlers = useSwipe(showSibling);

  if (photoCount === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-lg">
        <VehiclePhotoPlaceholder />
      </div>
    );
  }

  const activePhoto = photos[activeIndex];
  const activePhotoAlt = `${vehicleTitle} - foto ${activeIndex + 1} de ${photoCount}`;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") showSibling(1);
    if (event.key === "ArrowLeft") showSibling(-1);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group bg-foreground/5 relative aspect-[4/3] touch-pan-y overflow-hidden rounded-lg select-none"
        role="region"
        aria-roledescription="galeria"
        aria-label={`Fotos do ${vehicleTitle}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...swipeHandlers}
      >
        <Image
          key={activePhoto.storageKey}
          src={activePhoto.url}
          alt={activePhotoAlt}
          fill
          fetchPriority="high"
          loading="eager"
          draggable={false}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="animate-fade-in object-cover"
        />

        <button
          type="button"
          onClick={() => fullscreenDialogRef.current?.showModal()}
          aria-label="Ver foto em tela cheia"
          className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur transition hover:bg-black/70 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
        >
          <Expand className="size-5" aria-hidden />
        </button>

        {photoCount > 1 && (
          <>
            <GalleryArrow direction="previous" onClick={() => showSibling(-1)} />
            <GalleryArrow direction="next" onClick={() => showSibling(1)} />
            <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white tabular-nums backdrop-blur">
              {activeIndex + 1} / {photoCount}
            </span>
          </>
        )}
      </div>

      {photoCount > 1 && (
        <ul className="-m-1 flex scrollbar-none gap-2 overflow-x-auto p-1">
          {photos.map((photo, index) => (
            <li key={photo.storageKey} className="w-[18%] min-w-20 shrink-0 sm:w-[15%]">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-sm transition duration-300",
                  index === activeIndex
                    ? "ring-foreground ring-2 ring-offset-2 ring-offset-(--color-background)"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={photo.url} alt="" fill sizes="140px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={fullscreenDialogRef}
        aria-label={`Fotos do ${vehicleTitle} em tela cheia`}
        onKeyDown={handleKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between p-4 text-sm">
          <span className="tabular-nums opacity-70">
            {activeIndex + 1} / {photoCount}
          </span>
          <button
            type="button"
            onClick={() => fullscreenDialogRef.current?.close()}
            aria-label="Fechar tela cheia"
            className="flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="relative flex-1 touch-pan-y select-none" {...swipeHandlers}>
          <Image
            key={`fullscreen-${activePhoto.storageKey}`}
            src={activePhoto.url}
            alt={activePhotoAlt}
            fill
            draggable={false}
            sizes="100vw"
            className="animate-fade-in object-contain"
          />
          {photoCount > 1 && (
            <>
              <GalleryArrow direction="previous" onClick={() => showSibling(-1)} />
              <GalleryArrow direction="next" onClick={() => showSibling(1)} />
            </>
          )}
        </div>
      </dialog>
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
        "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition duration-300 hover:scale-105 hover:bg-black/70",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}
