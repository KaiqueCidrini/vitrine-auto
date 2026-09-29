import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { tenantConfigSchema } from "./tenant-config-schema";
import { tenantRegistry } from "./tenant-registry";

describe.each(Object.entries(tenantRegistry))("tenant %s", (registryKey, tenant) => {
  it("segue o contrato de configuração", () => {
    const result = tenantConfigSchema.safeParse(tenant);
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("está registrado com o mesmo slug da configuração", () => {
    expect(tenant.slug).toBe(registryKey);
  });

  it("tem o logo em /public", () => {
    expect(existsSync(path.join("public", tenant.logo.src))).toBe(true);
  });
});
