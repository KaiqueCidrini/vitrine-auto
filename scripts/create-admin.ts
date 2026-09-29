/**
 * Cria o primeiro gerente da concessionária (quem depois cadastra a equipe pelo painel).
 *
 * Uso interativo (pergunta nome, e-mail e senha; funciona igual no Windows, Mac e Linux):
 *   npm run admin:create
 *
 * Uso direto (útil em scripts de deploy):
 *   npm run admin:create -- --name "Maria Silva" --email maria@loja.com.br --password "senhaForte123"
 */
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";

import { getAuth, MIN_PASSWORD_LENGTH } from "@/features/auth/server/auth";
import { describeDatabaseError } from "@/shared/db/describe-database-error";

interface AdminData {
  name: string;
  email: string;
  password: string;
}

async function askForMissingData(partial: Partial<AdminData>): Promise<AdminData> {
  if (partial.name && partial.email && partial.password) return partial as AdminData;

  // Lê linha a linha pelo iterador: funciona digitando no terminal e também com entrada via pipe.
  const terminal = createInterface({ input: process.stdin });
  const lines = terminal[Symbol.asyncIterator]();
  const ask = async (question: string): Promise<string> => {
    process.stdout.write(question);
    const { value } = await lines.next();
    return typeof value === "string" ? value : "";
  };

  try {
    const name = partial.name || (await ask("Nome do gerente: "));
    const email = partial.email || (await ask("E-mail de acesso: "));
    const password =
      partial.password || (await ask(`Senha (mínimo ${MIN_PASSWORD_LENGTH} caracteres): `));
    return { name: name.trim(), email: email.trim(), password };
  } finally {
    terminal.close();
  }
}

async function createAdmin(): Promise<void> {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  });

  const admin = await askForMissingData(values);
  if (!admin.name || !admin.email) throw new Error("Nome e e-mail são obrigatórios.");
  if (admin.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`A senha precisa de pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const { user } = await getAuth().api.createUser({ body: { ...admin, role: "admin" } });
  console.log(`Gerente criado: ${user.name} <${user.email}>`);
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(`Não foi possível criar o gerente: ${describeDatabaseError(error)}`);
    process.exit(1);
  });
