import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/ui/reveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow text-muted-foreground mb-4">{eyebrow}</p>}
        <h2 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
