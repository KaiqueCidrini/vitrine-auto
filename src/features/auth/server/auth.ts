import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";

import { getServerEnv } from "@/shared/config/server-env";
import { getDatabase } from "@/shared/db/database";
import * as schema from "@/shared/db/schema";

import { DEFAULT_EMPLOYEE_ROLE } from "../domain/employee-role";
import { accessControl, employeeRoles } from "./access-control";

const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const MIN_PASSWORD_LENGTH = 8;

function createAuth() {
  const env = getServerEnv();

  return betterAuth({
    appName: "Vitrine Auto",
    baseURL: env.APP_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDatabase(), { provider: "pg", schema, usePlural: true }),
    emailAndPassword: {
      enabled: true,
      // Não existe cadastro público: contas são criadas pelo gerente.
      disableSignUp: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
    },
    session: {
      expiresIn: SESSION_DURATION_IN_SECONDS,
    },
    advanced: {
      database: { generateId: "uuid" },
    },
    plugins: [
      admin({
        ac: accessControl,
        roles: employeeRoles,
        adminRoles: ["admin"],
        defaultRole: DEFAULT_EMPLOYEE_ROLE,
      }),
      // Precisa ser o último plugin: grava os cookies de sessão nas Server Actions.
      nextCookies(),
    ],
  });
}

type Auth = ReturnType<typeof createAuth>;

let authInstance: Auth | undefined;

/** Instância criada sob demanda para não exigir variáveis de ambiente no build. */
export function getAuth(): Auth {
  authInstance ??= createAuth();
  return authInstance;
}

export { MIN_PASSWORD_LENGTH };
