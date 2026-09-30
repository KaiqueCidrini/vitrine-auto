"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ScrollCarouselProps {
  /** Nome do carrossel para leitores de tela (ex.: "Veículos em destaque"). */
  label: string;
  /** Itens já envolvidos em <li>, com a largura definida por quem usa. */
  children: ReactNode;
  className?: string;
}

interface ScrollState {
  canScrollBack: boolean;
  canScrollForward: boolean;
  progress: number;
}

const INITIAL_SCROLL_STATE: ScrollState = {
  canScrollBack: false,
  canScrollForward: true,
  progress: 0,
};

/** Folga para arredondamentos de subpixel ao detectar início/fim da rolagem. */
const EDGE_TOLERANCE_PX = 4;

function readScrollState(track: HTMLElement): ScrollState {
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= EDGE_TOLERANCE_PX) {
    return { canScrollBack: false, canScrollForward: false, progress: 1 };
  }
  return {
    canScrollBack: track.scrollLeft > EDGE_TOLERANCE_PX,
    canScrollForward: track.scrollLeft < maxScroll - EDGE_TOLERANCE_PX,
    progress: track.scrollLeft / maxScroll,
  };
}

/**
 * Faixa horizontal com rolagem por "encaixe" (scroll-snap): funciona com o dedo no
 * celular, trackpad e setas no desktop, e mostra o progresso numa barra fina.
 */
export function ScrollCarousel({ label, children, className }: ScrollCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [scrollState, setScrollState] = useState(INITIAL_SCROLL_STATE);

  const updateScrollState = useCallback(() => {
    if (trackRef.current) setScrollState(readScrollState(trackRef.current));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [updateScrollState]);

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  }

  const hasOverflow = scrollState.canScrollBack || scrollState.canScrollForward;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <ul
        ref={trackRef}
        onScroll={updateScrollState}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {children}
      </ul>

      {hasOverflow && (
        <div className="flex items-center gap-6">
          <div className="bg-foreground/10 relative h-px flex-1 overflow-hidden" aria-hidden>
            <div
              className="bg-foreground absolute inset-y-0 left-0 w-full origin-left transition-transform duration-300"
              style={{ transform: `scaleX(${Math.max(scrollState.progress, 0.08)})` }}
            />
          </div>
          <div className="flex gap-2">
            <CarouselArrow
              direction="previous"
              disabled={!scrollState.canScrollBack}
              onClick={() => scrollByPage(-1)}
            />
            <CarouselArrow
              direction="next"
              disabled={!scrollState.canScrollForward}
              onClick={() => scrollByPage(1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "previous" ? "Itens anteriores" : "Próximos itens"}
      className="border-foreground/20 hover:bg-foreground hover:text-background flex size-11 items-center justify-center rounded-full border transition duration-300 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
