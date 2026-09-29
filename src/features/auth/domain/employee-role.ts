export const EMPLOYEE_ROLES = ["admin", "seller"] as const;
export type EmployeeRole = (typeof EMPLOYEE_ROLES)[number];

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  admin: "Gerente",
  seller: "Vendedor",
};

export const DEFAULT_EMPLOYEE_ROLE: EmployeeRole = "seller";

export function isEmployeeRole(value: unknown): value is EmployeeRole {
  return typeof value === "string" && (EMPLOYEE_ROLES as readonly string[]).includes(value);
}
