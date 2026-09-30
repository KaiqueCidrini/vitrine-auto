import type { TenantConfigInput } from "../tenant-config-schema";

/**
 * Concessionária fictícia usada para demonstração e desenvolvimento.
 * Para um cliente novo, copie esta pasta e ajuste os valores (veja o README).
 */
export const demoTenant: TenantConfigInput = {
  slug: "demo",
  name: "Rota Prime Seminovos",
  tagline: "Seminovos revisados, com procedência e garantia.",
  logo: {
    src: "/tenants/demo/logo.svg",
    srcOnDark: "/tenants/demo/logo-on-dark.svg",
    alt: "Rota Prime Seminovos",
    width: 180,
    height: 40,
  },
  theme: {
    font: "inter",
    headingFont: "playfair-display",
    buttonShape: "pill",
    radius: "0.75rem",
    colors: {
      primary: "#0B3D91",
      primaryForeground: "#FFFFFF",
      accent: "#F59E0B",
      accentForeground: "#1F1300",
      background: "#F6F7F9",
      surface: "#FFFFFF",
      foreground: "#0F172A",
      mutedForeground: "#5B6474",
      border: "#E2E6EC",
      headerBackground: "#FFFFFF",
      headerForeground: "#0F172A",
      footerBackground: "#0A1A33",
      footerForeground: "#D8DEE8",
    },
  },
  contact: {
    whatsappNumber: "5531999990000",
    phoneDisplay: "(31) 99999-0000",
    email: "contato@rotaprime.exemplo.com.br",
    address: {
      street: "Av. do Contorno, 1000",
      district: "Funcionários",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30110-000",
    },
    openingHours: [
      { days: "Segunda a sexta", hours: "8h às 18h" },
      { days: "Sábado", hours: "8h às 13h" },
    ],
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
  whatsappMessages: {
    general: "Olá! Vim pelo site e gostaria de mais informações.",
    vehicleInterest:
      "Olá! Tenho interesse no {vehicle} anunciado por {price}. Gostaria de agendar uma visita. {url}",
  },
  seo: {
    title: "Rota Prime Seminovos | Carros seminovos em Belo Horizonte",
    description:
      "Seminovos revisados com procedência em Belo Horizonte. Veja o estoque e agende sua visita pelo WhatsApp.",
  },
  home: {
    sections: [
      {
        type: "hero",
        eyebrow: "Estoque atualizado toda semana",
        title: "Seu próximo carro está aqui",
        subtitle:
          "Seminovos revisados, laudo cautelar aprovado e atendimento direto com o vendedor pelo WhatsApp.",
        primaryCtaLabel: "Ver estoque",
        secondaryCtaLabel: "Falar com um vendedor",
      },
      {
        type: "featured-vehicles",
        title: "Destaques da semana",
        subtitle: "Selecionados pela nossa equipe",
        limit: 6,
      },
      { type: "body-type-shortcuts", title: "Encontre pelo tipo de carro" },
      {
        type: "benefits",
        title: "Por que comprar com a gente",
        items: [
          {
            icon: "file-check",
            title: "Laudo cautelar",
            description: "Todos os veículos passam por vistoria antes de entrar no estoque.",
          },
          {
            icon: "shield-check",
            title: "Garantia",
            description: "Garantia de motor e câmbio em todos os seminovos.",
          },
          {
            icon: "badge-percent",
            title: "Financiamento facilitado",
            description: "Trabalhamos com os principais bancos para aprovar seu crédito.",
          },
          {
            icon: "handshake",
            title: "Aceitamos seu usado",
            description: "Avaliação justa do seu carro como parte do pagamento.",
          },
        ],
      },
      {
        type: "contact-cta",
        title: "Venha fazer um test drive",
        subtitle: "Agende uma visita e conheça o carro pessoalmente, sem compromisso.",
      },
    ],
  },
};
