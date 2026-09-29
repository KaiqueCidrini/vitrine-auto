"use client";

import { CarFront, KeyRound, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/admin/veiculos", label: "Anúncios", icon: CarFront },
  { href: "/admin/equipe", label: "Equipe", icon: Users, adminOnly: true },
  { href: "/admin/conta", label: "Minha conta", icon: KeyRound },
];

export function AdminNavigation({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const visibleItems = NAVIGATION_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav aria-label="Painel" className="flex gap-1 overflow-x-auto">
      {visibleItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
