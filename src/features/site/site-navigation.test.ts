import { describe, expect, it } from "vitest";

import { isNavigationLinkActive } from "./site-navigation";

describe("isNavigationLinkActive", () => {
  it("ativa o início só na própria home", () => {
    expect(isNavigationLinkActive("/", "/")).toBe(true);
    expect(isNavigationLinkActive("/", "/veiculos")).toBe(false);
  });

  it("ativa a seção nas páginas filhas", () => {
    expect(isNavigationLinkActive("/veiculos", "/veiculos")).toBe(true);
    expect(isNavigationLinkActive("/veiculos", "/veiculos/honda-civic-abc123")).toBe(true);
    expect(isNavigationLinkActive("/veiculos", "/veiculos-antigos")).toBe(false);
  });

  it("nunca ativa links de âncora", () => {
    expect(isNavigationLinkActive("/#contato", "/")).toBe(false);
  });
});
