import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { isEmployeeRole, type EmployeeRole } from "../domain/employee-role";
import { getAuth } from "./auth";

export const LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin/veiculos";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
}

/**
 * Lê a sessão do funcionário logado. O `cache` do React garante uma única
 * consulta por requisição, mesmo que várias partes da página chamem a função.
 */
export const getCurrentEmployee = cache(async (): Promise<Employee | null> => {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session || session.user.banned) return null;

  const { id, name, email, role } = session.user;
  if (!isEmployeeRole(role)) return null;

  return { id, name, email, role };
});

/** Use no topo de páginas e Server Actions que exigem login. */
export async function requireEmployee(): Promise<Employee> {
  const employee = await getCurrentEmployee();
  if (!employee) redirect(LOGIN_PATH);
  return employee;
}

/** Use em telas e ações que só o gerente pode acessar. */
export async function requireAdmin(): Promise<Employee> {
  const employee = await requireEmployee();
  if (employee.role !== "admin") redirect(ADMIN_HOME_PATH);
  return employee;
}
