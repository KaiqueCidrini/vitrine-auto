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
import { Reveal } from "@/shared/ui/reveal";

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

const STAGGER_DELAY_MS = 100;

export function BenefitsSection({ section }: { section: BenefitsSectionConfig }) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Nossos diferenciais" title={section.title} />
        <ul
          className={cn(
            "grid gap-x-8 gap-y-4 sm:grid-cols-2",
            DESKTOP_COLUMNS[section.items.length],
          )}
        >
          {section.items.map((item, index) => {
            const Icon = BENEFIT_ICON_COMPONENTS[item.icon];
            return (
              <li key={item.title}>
                <Reveal delay={index * STAGGER_DELAY_MS} className="h-full">
                  <article className="group border-border bg-surface ease-premium relative h-full overflow-hidden rounded-lg border p-8 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
                    <div className="flex items-start justify-between">
                      <span className="border-border text-primary ease-premium group-hover:bg-primary group-hover:text-primary-foreground flex size-14 items-center justify-center rounded-full border transition duration-500 group-hover:border-transparent">
                        <Icon className="size-6" aria-hidden />
                      </span>
                      <span className="text-muted-foreground font-display text-sm tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display mt-10 text-2xl leading-tight">{item.title}</h3>
                    <p className="text-muted-foreground mt-3 leading-relaxed">{item.description}</p>
                    <span
                      aria-hidden
                      className="bg-primary ease-premium absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition duration-700 group-hover:scale-x-100"
                    />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
