/**
 * Traduz os erros mais comuns de conexão/consulta ao Postgres em mensagens com a solução.
 * O Drizzle embrulha o erro original ("Failed query: ...") e guarda a causa real em `cause`.
 */

interface ErrorWithCode {
  code?: string;
  message?: string;
  cause?: unknown;
}

const HINTS_BY_CODE: Record<string, string> = {
  "42P01": "As tabelas ainda não existem. Rode `npm run db:migrate` antes deste comando.",
  "3D000":
    "O banco informado no DATABASE_URL não existe. Rode `npm run db:migrate`, que cria o banco.",
  "28P01": "Usuário ou senha do Postgres incorretos. Confira o DATABASE_URL no arquivo .env.",
  "28000": "O Postgres recusou o usuário informado. Confira o DATABASE_URL no arquivo .env.",
  ECONNREFUSED:
    "Não foi possível conectar ao Postgres. Verifique se ele está rodando e se a porta no DATABASE_URL está certa (padrão 5432).",
  ENOTFOUND: "O endereço do banco no DATABASE_URL não foi encontrado. Confira o host.",
  ETIMEDOUT: "A conexão com o banco demorou demais. Verifique a rede e o host do DATABASE_URL.",
};

/** Percorre a cadeia de `cause` e devolve os erros do mais externo ao mais interno. */
function collectErrorChain(error: unknown): ErrorWithCode[] {
  const chain: ErrorWithCode[] = [];
  let current: unknown = error;
  while (current && typeof current === "object" && chain.length < 10) {
    chain.push(current as ErrorWithCode);
    current = (current as ErrorWithCode).cause;
  }
  return chain;
}

export function describeDatabaseError(error: unknown): string {
  const chain = collectErrorChain(error);
  if (chain.length === 0) return String(error);

  const rootCause = chain[chain.length - 1];
  const hint = chain.map((item) => item.code && HINTS_BY_CODE[item.code]).find(Boolean);
  const detail = rootCause.message ?? String(rootCause);

  return hint ? `${hint}\n  Detalhe técnico: ${detail}` : detail;
}
