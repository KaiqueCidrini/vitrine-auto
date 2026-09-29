import { demoTenant } from "./demo/tenant.config";
import { premiumExampleTenant } from "./premium-example/tenant.config";
import {
  tenantConfigSchema,
  type TenantConfig,
  type TenantConfigInput,
} from "./tenant-config-schema";

/**
 * Toda concessionária nova precisa ser registrada aqui.
 * A escolha de qual usar no deploy é feita pela variável de ambiente TENANT.
 */
export const tenantRegistry = {
  demo: demoTenant,
  "premium-example": premiumExampleTenant,
} satisfies Record<string, TenantConfigInput>;

export type TenantSlug = keyof typeof tenantRegistry;

const DEFAULT_TENANT: TenantSlug = "demo";

/** Configurações já validadas, para não repetir o parse a cada requisição. */
const parsedTenants: Partial<Record<TenantSlug, TenantConfig>> = {};

function isTenantSlug(value: string): value is TenantSlug {
  return value in tenantRegistry;
}

export function getTenant(): TenantConfig {
  const requestedTenant = process.env.TENANT ?? DEFAULT_TENANT;

  if (!isTenantSlug(requestedTenant)) {
    const available = Object.keys(tenantRegistry).join(", ");
    throw new Error(`TENANT "${requestedTenant}" não existe. Disponíveis: ${available}`);
  }

  // Valida e aplica os valores padrão: um erro de configuração aparece na hora, com o campo exato.
  parsedTenants[requestedTenant] ??= tenantConfigSchema.parse(tenantRegistry[requestedTenant]);
  return parsedTenants[requestedTenant];
}
