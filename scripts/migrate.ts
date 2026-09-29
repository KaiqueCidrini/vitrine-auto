/**
 * Cria o banco (se ainda não existir) e aplica as migrations pendentes de database/migrations.
 * Uso: npm run db:migrate
 *
 * O Drizzle registra o que já foi aplicado na tabela drizzle.__drizzle_migrations,
 * então rodar várias vezes é seguro.
 *
 * Na Vercel roda automaticamente antes de cada build (ver vercel.json), mas só no
 * deploy de produção: um preview de outra branch não altera o banco de produção.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client, Pool } from "pg";

import { describeDatabaseError } from "@/shared/db/describe-database-error";

const MIGRATIONS_FOLDER = "./database/migrations";
const DATABASE_DOES_NOT_EXIST = "3D000";

/**
 * Num Postgres recém-instalado o banco do projeto ainda não existe. Nesse caso,
 * conecta no banco padrão "postgres" e cria o banco informado na DATABASE_URL.
 */
async function ensureDatabaseExists(connectionString: string): Promise<void> {
  const probe = new Client({ connectionString });
  try {
    await probe.connect();
    return;
  } catch (error) {
    if ((error as { code?: string }).code !== DATABASE_DOES_NOT_EXIST) throw error;
  } finally {
    await probe.end().catch(() => undefined);
  }

  const databaseUrl = new URL(connectionString);
  const databaseName = decodeURIComponent(databaseUrl.pathname.slice(1));
  databaseUrl.pathname = "/postgres";

  const admin = new Client({ connectionString: databaseUrl.toString() });
  await admin.connect();
  try {
    await admin.query(`CREATE DATABASE "${databaseName.replace(/"/g, '""')}"`);
    console.log(`Banco "${databaseName}" criado.`);
  } finally {
    await admin.end();
  }
}

function isVercelPreviewBuild(): boolean {
  return Boolean(process.env.VERCEL) && process.env.VERCEL_ENV !== "production";
}

/**
 * O Neon da Vercel também entrega DATABASE_URL_UNPOOLED (conexão direta, sem o pooler),
 * que é a recomendada para migrations. Fora da Vercel ela não existe e usamos a DATABASE_URL.
 */
function getMigrationConnectionString(): string {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não definida");
  }
  return connectionString;
}

async function runMigrations(): Promise<void> {
  if (isVercelPreviewBuild()) {
    console.log("Deploy de preview na Vercel: migrations ignoradas (só rodam em produção).");
    return;
  }

  const connectionString = getMigrationConnectionString();

  await ensureDatabaseExists(connectionString);

  const pool = new Pool({ connectionString, max: 1 });
  try {
    await migrate(drizzle({ client: pool }), { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("Migrations aplicadas com sucesso.");
  } finally {
    await pool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error(`Falha ao aplicar migrations: ${describeDatabaseError(error)}`);
  process.exit(1);
});
