import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

import { getServerEnv } from "@/shared/config/server-env";

import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

const isServerless = Boolean(process.env.VERCEL);

/**
 * Servidor comum (VPS/Docker): um processo fica ligado e reaproveita até 10 conexões.
 * Serverless (Vercel): várias instâncias sobem ao mesmo tempo, então cada uma usa
 * poucas conexões e fecha as ociosas rápido para não esgotar o limite do banco.
 */
const POOL_CONFIG: PoolConfig = isServerless
  ? { max: 5, idleTimeoutMillis: 5_000 }
  : { max: 10, idleTimeoutMillis: 30_000 };

/**
 * Em desenvolvimento o hot reload recria os módulos; guardar o pool no
 * escopo global evita abrir uma conexão nova a cada alteração de arquivo.
 */
const globalForDatabase = globalThis as unknown as { database?: Database };

function createDatabase(): Database {
  const pool = new Pool({ connectionString: getServerEnv().DATABASE_URL, ...POOL_CONFIG });
  // Na Vercel, fecha as conexões ociosas antes de a instância ser suspensa. Fora dela não faz nada.
  attachDatabasePool(pool);
  return drizzle({ client: pool, schema, casing: "snake_case" });
}

export function getDatabase(): Database {
  globalForDatabase.database ??= createDatabase();
  return globalForDatabase.database;
}
