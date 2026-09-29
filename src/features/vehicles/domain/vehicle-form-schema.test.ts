import { describe, expect, it } from "vitest";

import { mergeFeatures, readVehicleFormData, vehicleFormSchema } from "./vehicle-form-schema";

function buildFormData(overrides: Record<string, string | string[]> = {}): FormData {
  const values: Record<string, string | string[]> = {
    brand: "Chevrolet",
    model: "Onix",
    version: "LT 1.0",
    manufactureYear: "2022",
    modelYear: "2023",
    mileageKm: "35.000",
    price: "79.900",
    transmission: "manual",
    fuelType: "flex",
    bodyType: "hatch",
    color: "Prata",
    doors: "4",
    description: "",
    features: ["Ar-condicionado", "Airbags"],
    extraFeatures: "Película, Airbags",
    status: "published",
    photos: JSON.stringify([{ storageKey: "vehicles/3f9a-11.webp", width: 1600, height: 1067 }]),
    ...overrides,
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    for (const item of [value].flat()) formData.append(key, item);
  }
  return formData;
}

function parse(overrides?: Record<string, string | string[]>) {
  return vehicleFormSchema.safeParse(readVehicleFormData(buildFormData(overrides)));
}

describe("vehicleFormSchema", () => {
  it("aceita um anúncio completo e normaliza os valores", () => {
    const result = parse();
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      mileageKm: 35_000,
      priceInCents: 7_990_000,
      doors: 4,
      description: null,
      isFeatured: false,
      features: ["Ar-condicionado", "Airbags", "Película"],
    });
  });

  it("exige foto para publicar, mas não para rascunho", () => {
    expect(parse({ photos: "[]" }).error?.issues[0]?.path).toEqual(["photos"]);
    expect(parse({ photos: "[]", status: "draft" }).success).toBe(true);
  });

  it("valida a relação entre ano de fabricação e ano do modelo", () => {
    expect(parse({ modelYear: "2021" }).error?.issues[0]?.path).toEqual(["modelYear"]);
    expect(parse({ modelYear: "2025" }).error?.issues[0]?.path).toEqual(["modelYear"]);
  });

  it("recusa preço inválido e chaves de foto forjadas", () => {
    expect(parse({ price: "abc" }).error?.issues[0]?.path).toEqual(["priceInCents"]);
    const forgedPhoto = JSON.stringify([{ storageKey: "../../etc/passwd", width: 1, height: 1 }]);
    expect(parse({ photos: forgedPhoto }).success).toBe(false);
  });
});

describe("mergeFeatures", () => {
  it("junta, limpa e remove repetidos", () => {
    expect(mergeFeatures(["ABS"], " Teto solar ,\nABS,, ")).toEqual(["ABS", "Teto solar"]);
  });
});
