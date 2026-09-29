import "server-only";

import { AttemptLimiter } from "@/shared/lib/attempt-limiter";

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

/** Protege uma conta contra tentativas de senha vindas de vários IPs. */
const failuresByEmail = new AttemptLimiter({ maxFailures: 10, windowInMs: FIFTEEN_MINUTES_IN_MS });
/** Protege contra um mesmo IP testando várias contas. */
const failuresByIp = new AttemptLimiter({ maxFailures: 30, windowInMs: FIFTEEN_MINUTES_IN_MS });

/**
 * IP do visitante. Atrás do Caddy o cabeçalho X-Forwarded-For é preenchido pelo proxy;
 * usamos o último valor, que é o adicionado pelo proxy (o visitante não consegue forjá-lo).
 */
export function getClientIp(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const lastForwardedIp = forwardedFor?.split(",").at(-1)?.trim();
  return lastForwardedIp || requestHeaders.get("x-real-ip") || "desconhecido";
}

export function isLoginBlocked(email: string, ip: string): boolean {
  return failuresByEmail.isBlocked(email) || failuresByIp.isBlocked(ip);
}

export function registerFailedLogin(email: string, ip: string): void {
  failuresByEmail.registerFailure(email);
  failuresByIp.registerFailure(ip);
}

export function registerSuccessfulLogin(email: string): void {
  failuresByEmail.reset(email);
}
