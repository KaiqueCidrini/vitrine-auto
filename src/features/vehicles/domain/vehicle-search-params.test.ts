import { describe, expect, it } from "vitest";

import { buildVehicleSearchHref, parseVehicleSearchParams } from "./vehicle-search-params";

describe("parseVehicleSearchParams", () => {
  it("lê os filtros da URL", () => {
    expect(
      parseVehicleSearchParams({
        busca: " onix ",
        marca: "Chevrolet",
        carroceria: "suv",
        cambio: "automatic",
        precoMax: "80000",
        anoMin: "2020",
        ordem: "price-asc",
        pagina: "2",
      }),
    ).toEqual({
      search: "onix",
      brand: "Chevrolet",
      bodyType: "suv",
      transmission: "automatic",
      maxPriceInCents: 8_000_000,
      minYear: 2020,
      sort: "price-asc",
      page: 2,
    });
  });

  it("ignora valores inválidos em vez de falhar", () => {
    expect(
      parseVehicleSearchParams({
        carroceria: "foguete",
        precoMax: "abc",
        ordem: "x",
        pagina: "-3",
      }),
    ).toEqual({
      search: undefined,
      brand: undefined,
      bodyType: undefined,
      transmission: undefined,
      maxPriceInCents: undefined,
      minYear: undefined,
      sort: "recent",
      page: 1,
    });
  });

  it("usa o primeiro valor quando o parâmetro se repete", () => {
    expect(parseVehicleSearchParams({ marca: ["Fiat", "Ford"] }).brand).toBe("Fiat");
  });
});

describe("buildVehicleSearchHref", () => {
  it("omite valores padrão", () => {
    expect(buildVehicleSearchHref({ sort: "recent", page: 1 })).toBe("/veiculos");
  });

  it("gera a URL com os filtros em português", () => {
    expect(buildVehicleSearchHref({ brand: "Fiat", maxPriceInCents: 5_000_000, page: 3 })).toBe(
      "/veiculos?marca=Fiat&precoMax=50000&pagina=3",
    );
  });
});
