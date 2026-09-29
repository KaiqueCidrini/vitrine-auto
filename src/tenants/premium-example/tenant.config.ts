import type { TenantConfigInput } from "../tenant-config-schema";

/**
 * Segundo exemplo, com identidade bem diferente (escura, dourada, cantos retos),
 * para mostrar que o mesmo código atende perfis distintos de concessionária.
 * Ative com TENANT=premium-example.
 */
export const premiumExampleTenant: TenantConfigInput = {
  slug: "premium-example",
  name: "Nobre Motors",
  tagline: "Veículos premium selecionados.",
  logo: { src: "/tenants/premium-example/logo.svg", alt: "Nobre Motors", width: 170, height: 40 },
  theme: {
    font: "montserrat",
    radius: "0",
    colors: {
      primary: "#C8A45D",
      primaryForeground: "#141109",
      accent: "#C8A45D",
      accentForeground: "#141109",
      background: "#0E0E10",
      surface: "#17171A",
      foreground: "#F4F4F5",
      mutedForeground: "#A1A1AA",
      border: "#2A2A2F",
      headerBackground: "#0E0E10",
      headerForeground: "#F4F4F5",
      footerBackground: "#08080A",
      footerForeground: "#C9C9CF",
    },
  },
  contact: {
    whatsappNumber: "5511988887777",
    phoneDisplay: "(11) 98888-7777",
    address: {
      street: "Rua Oscar Freire, 500",
      district: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01426-000",
    },
    openingHours: [
      { days: "Segunda a sexta", hours: "9h às 19h" },
      { days: "Sábado", hours: "10h às 16h" },
    ],
  },
  social: {
    instagram: "https://instagram.com/",
  },
  whatsappMessages: {
    general: "Olá! Gostaria de falar com um consultor.",
    vehicleInterest: "Olá! Gostaria de agendar uma visita para conhecer o {vehicle}. {url}",
  },
  seo: {
    title: "Nobre Motors | Veículos premium em São Paulo",
    description: "Seleção de veículos premium nos Jardins. Agende uma visita com um consultor.",
  },
  home: {
    sections: [
      {
        type: "hero",
        tone: "surface",
        eyebrow: "Jardins · São Paulo",
        title: "Performance e exclusividade",
        subtitle:
          "Uma curadoria de veículos premium com histórico completo e atendimento personalizado.",
        primaryCtaLabel: "Conhecer a coleção",
      },
      {
        type: "benefits",
        title: "Experiência Nobre",
        items: [
          {
            icon: "star",
            title: "Curadoria",
            description: "Apenas veículos com baixa quilometragem e revisões na concessionária.",
          },
          {
            icon: "clock",
            title: "Atendimento com hora marcada",
            description: "Um consultor dedicado durante toda a sua visita.",
          },
          {
            icon: "wrench",
            title: "Revisão completa",
            description: "Inspeção de mais de 150 itens antes da entrega.",
          },
        ],
      },
      { type: "featured-vehicles", title: "Coleção atual", limit: 3 },
      {
        type: "contact-cta",
        title: "Agende sua visita privativa",
        subtitle: "Nosso consultor prepara o veículo para você conhecer com calma.",
      },
    ],
  },
};
