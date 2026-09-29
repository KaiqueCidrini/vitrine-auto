import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";

/**
 * Checagem otimista: só confere se existe cookie de sessão para evitar
 * renderizar o painel à toa. A validação real acontece em requireEmployee().
 */
export function proxy(request: NextRequest): NextResponse {
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (!isLoginPage && !hasSessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
