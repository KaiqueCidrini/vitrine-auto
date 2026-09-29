import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const VARIANT_CLASSES = {
  primary: "bg-primary text-primary-foreground hover:brightness-110",
  accent: "bg-accent text-accent-foreground hover:brightness-105",
  outline: "border border-border bg-surface text-foreground hover:bg-background",
  ghost: "text-foreground hover:bg-foreground/5",
  danger: "bg-danger text-white hover:brightness-110",
  whatsapp: "bg-whatsapp text-whatsapp-foreground hover:brightness-105",
} as const;

const SIZE_CLASSES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
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
    "inline-flex shrink-0 items-center justify-center rounded-md font-semibold whitespace-nowrap transition",
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
