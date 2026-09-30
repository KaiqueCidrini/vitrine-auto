import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const VARIANT_CLASSES = {
  primary: "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-lg",
  accent: "bg-accent text-accent-foreground hover:brightness-105 hover:shadow-lg",
  outline: "border border-border bg-surface text-foreground hover:border-foreground/40",
  ghost: "text-foreground hover:bg-foreground/5",
  danger: "bg-danger text-white hover:brightness-110",
  whatsapp: "bg-whatsapp text-whatsapp-foreground hover:brightness-105 hover:shadow-lg",
  /** Contorno na cor do texto ao redor: serve sobre banners, fotos ou blocos coloridos. */
  overlay: "border border-current/40 text-current hover:border-current hover:bg-current/10",
} as const;

const SIZE_CLASSES = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-base gap-2.5",
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;
export type ButtonSize = keyof typeof SIZE_CLASSES;

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "group/button inline-flex shrink-0 items-center justify-center rounded-button font-semibold whitespace-nowrap",
    "transition duration-300 ease-premium active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & ButtonStyleOptions;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, className })} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleOptions;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, className })} {...props} />;
}

/** Classe para ícones de seta dentro de botões: deslizam um pouco no hover. */
export const BUTTON_ARROW_CLASS_NAME =
  "size-4 transition-transform duration-300 ease-premium group-hover/button:translate-x-1";
