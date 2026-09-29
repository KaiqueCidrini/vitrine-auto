import { describe, expect, it } from "vitest";

import { buildVehicleSlug, slugify } from "./build-vehicle-slug";
import {
  buildVehicleTitle,
  formatCentsForInput,
  formatMileage,
  formatPrice,
  formatYears,
  parsePriceToCents,
} from "./vehicle-formatters";

describe("parsePriceToCents", () => {
  it.each([
    ["89900", 8_990_000],
    ["89.900", 8_990_000],
    ["89.900,50", 8_990_050],
    ["R$ 89.900,5", 8_990_050],
    ["1.250.000", 125_000_000],
  ])("converte %s", (input, expected) => {
    expect(parsePriceToCents(input)).toBe(expected);
  });

  it.each(["", "abc", "89,900.00", "1.2345", "-100"])("rejeita %s", (input) => {
    expect(parsePriceToCents(input)).toBeNull();
  });
});

describe("formatadores", () => {
  it("formata preço sem centavos", () => {
    expect(formatPrice(8_990_050).replace(/\s/g, " ")).toBe("R$ 89.901");
  });

  it("formata preço para o campo de edição", () => {
    expect(formatCentsForInput(8_990_050)).toBe("89.900,50");
  });

  it("formata quilometragem e anos", () => {
    expect(formatMileage(45_000)).toBe("45.000 km");
    expect(formatMileage(0)).toBe("0 km");
    expect(formatYears(2022, 2023)).toBe("2022/2023");
  });

  it("monta o título ignorando a versão vazia", () => {
    expect(buildVehicleTitle({ brand: "Fiat", model: "Pulse", version: null })).toBe("Fiat Pulse");
  });
});

describe("slug", () => {
  it("remove acentos e símbolos", () => {
    expect(slugify("Citroën C4 Cactus 1.6 Automático")).toBe("citroen-c4-cactus-1-6-automatico");
  });

  it("inclui o ano e um trecho do id", () => {
    expect(
      buildVehicleSlug({
        id: "3f9a1c2d-0000-4000-8000-000000000000",
        brand: "Chevrolet",
        model: "Onix",
        version: "LT 1.0",
        modelYear: 2023,
      }),
    ).toBe("chevrolet-onix-lt-1-0-2023-3f9a1c");
  });
});
