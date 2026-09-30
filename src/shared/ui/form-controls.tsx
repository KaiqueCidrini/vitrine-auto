import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

const CONTROL_CLASSES = cn(
  "w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground transition duration-200",
  "placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
  "disabled:opacity-60 aria-invalid:border-danger",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL_CLASSES, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(CONTROL_CLASSES, "min-h-28 py-2.5", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(CONTROL_CLASSES, "h-11 pr-8", className)} {...props} />;
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  errors?: string[];
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Rótulo + controle + mensagem de erro, com os atributos de acessibilidade ligados. */
export function FormField({ label, htmlFor, errors, hint, className, children }: FormFieldProps) {
  const errorMessage = errors?.[0];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-foreground text-sm font-medium">
        {label}
      </label>
      {children}
      {errorMessage ? (
        <p id={`${htmlFor}-error`} className="text-danger text-xs font-medium">
          {errorMessage}
        </p>
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

/** Props de acessibilidade para ligar um controle à mensagem de erro do FormField. */
export function fieldErrorProps(fieldName: string, errors?: string[]) {
  const hasError = Boolean(errors?.length);
  return {
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? `${fieldName}-error` : undefined,
  };
}
