import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeading({ title, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
