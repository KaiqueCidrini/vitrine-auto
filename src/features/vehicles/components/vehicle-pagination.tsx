import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import { buildVehicleSearchHref, type VehicleSearchFilters } from "../domain/vehicle-search-params";

interface VehiclePaginationProps {
  filters: VehicleSearchFilters;
  currentPage: number;
  totalPages: number;
}

export function VehiclePagination({ filters, currentPage, totalPages }: VehiclePaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => buildVehicleSearchHref({ ...filters, page });
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginação" className="mt-16 flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="hover:bg-foreground/5 flex size-10 items-center justify-center rounded-full"
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "flex size-10 items-center justify-center rounded-full text-sm font-semibold",
            page === currentPage ? "bg-foreground text-background" : "hover:bg-foreground/5",
          )}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="hover:bg-foreground/5 flex size-10 items-center justify-center rounded-full"
          aria-label="Próxima página"
        >
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
