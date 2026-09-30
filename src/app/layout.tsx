import type { Metadata, Viewport } from "next";

import { getFontVariableClassNames } from "@/shared/theme/fonts";
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

/**
 * Marca o <html> assim que a página começa a carregar, antes do React.
 * As animações de "aparecer ao rolar" só escondem conteúdo quando essa marca existe,
 * então quem navega sem JavaScript vê tudo normalmente.
 */
const ENABLE_MOTION_SCRIPT = "document.documentElement.dataset.motion='on'";

export default function RootLayout({ children }: LayoutProps<"/">) {
  const tenant = getTenant();

  return (
    <html
      lang="pt-BR"
      style={buildThemeStyle(tenant.theme)}
      className={`${getFontVariableClassNames(tenant.theme)} h-full antialiased`}
      // O script abaixo adiciona data-motion antes da hidratação; a diferença é esperada.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: ENABLE_MOTION_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
