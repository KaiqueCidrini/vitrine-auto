import {
  BadgePercent,
  Car,
  Clock,
  FileCheck,
  Handshake,
  ShieldCheck,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";
import type { BenefitIcon, HomeSection } from "@/tenants/tenant-config-schema";
import { Container } from "@/shared/ui/container";

import { SectionHeading } from "./section-heading";

type BenefitsSectionConfig = Extract<HomeSection, { type: "benefits" }>;

const BENEFIT_ICON_COMPONENTS: Record<BenefitIcon, LucideIcon> = {
  "shield-check": ShieldCheck,
  "badge-percent": BadgePercent,
  wrench: Wrench,
  "file-check": FileCheck,
  handshake: Handshake,
  car: Car,
  clock: Clock,
  star: Star,
};

/** Evita colunas vazias: 3 benefícios ocupam 3 colunas, 4 ocupam 4, e assim por diante. */
const DESKTOP_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-3",
  6: "lg:grid-cols-3",
};

export function BenefitsSection({ section }: { section: BenefitsSectionConfig }) {
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <SectionHeading title={section.title} />
        <ul className={cn("grid gap-6 sm:grid-cols-2", DESKTOP_COLUMNS[section.items.length])}>
          {section.items.map((item) => {
            const Icon = BENEFIT_ICON_COMPONENTS[item.icon];
            return (
              <li key={item.title} className="border-border bg-surface rounded-lg border p-6">
                <span className="bg-accent text-accent-foreground flex size-12 items-center justify-center rounded-md">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
