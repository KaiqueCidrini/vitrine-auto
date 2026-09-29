import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes condicionalmente e resolve conflitos do Tailwind (ex.: p-2 + p-4). */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
