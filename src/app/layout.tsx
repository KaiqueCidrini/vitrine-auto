import type { Metadata, Viewport } from "next";

import { getFontVariableClassName } from "@/shared/theme/fonts";
import { buildThemeStyle } from "@/shared/theme/build-theme-style";
import { getTenant } from "@/tenants/tenant-registry";

import "./globals.css";

export function generateMetadata(): Metadata {
  const tenant = getTenant();

  return {
    metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
    title: { default: tenant.seo.title, template: `%s | ${tenant.name}` },
    description: tenant.seo.description,
    openGraph: { siteName: tenant.name, locale: "pt_BR", type: "website" },
  };
}

export function generateViewport(): Viewport {
  return { themeColor: getTenant().theme.colors.headerBackground };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const tenant = getTenant();

  return (
    <html
      lang="pt-BR"
      style={buildThemeStyle(tenant.theme)}
      className={`${getFontVariableClassName(tenant.theme.font)} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
