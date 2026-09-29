import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

const TONE_CLASSES = {
  neutral: "bg-foreground/8 text-foreground",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
} as const;

export type BadgeTone = keyof typeof TONE_CLASSES;

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
