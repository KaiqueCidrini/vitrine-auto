import { describe, expect, it } from "vitest";

import { buildWhatsAppLink, fillMessageTemplate } from "./build-whatsapp-link";

describe("buildWhatsAppLink", () => {
  it("usa só os dígitos do telefone e codifica a mensagem", () => {
    expect(buildWhatsAppLink("+55 (31) 99999-0000", "Olá! Tenho interesse & quero visitar")).toBe(
      "https://wa.me/5531999990000?text=Ol%C3%A1!%20Tenho%20interesse%20%26%20quero%20visitar",
    );
  });
});

describe("fillMessageTemplate", () => {
  it("substitui os marcadores conhecidos", () => {
    const message = fillMessageTemplate("Quero o {vehicle} por {price}. {url}", {
      vehicle: "Onix LT",
      price: "R$ 80.000",
      url: "https://loja.com/veiculos/onix",
    });
    expect(message).toBe("Quero o Onix LT por R$ 80.000. https://loja.com/veiculos/onix");
  });

  it("remove marcadores sem valor sem deixar espaços sobrando", () => {
    expect(fillMessageTemplate("Quero o {vehicle} {url}", { vehicle: "Onix" })).toBe(
      "Quero o Onix",
    );
  });
});
