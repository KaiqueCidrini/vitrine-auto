import "server-only";

import { z } from "zod";

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.url({ message: "DATABASE_URL deve ser uma URL do Postgres" }),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET precisa de pelo menos 32 caracteres"),
    APP_URL: z.url({ message: "APP_URL deve ser a URL pública do site" }),
    TENANT: z.string().min(1).default("demo"),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
    STORAGE_LOCAL_DIR: z.string().min(1).default("./storage"),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().default("auto"),
    S3_ENDPOINT: z.url().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_PUBLIC_URL: z.url().optional(),
    S3_FORCE_PATH_STYLE: z.stringbool().default(false),
    /** Definida automaticamente pela Vercel em todo deploy. */
    VERCEL: z.string().optional(),
  })
  .superRefine((env, context) => {
    // Na Vercel o disco é temporário: fotos salvas localmente sumiriam no próximo deploy.
    if (env.VERCEL && env.STORAGE_DRIVER === "local") {
      context.addIssue({
        code: "custom",
        path: ["STORAGE_DRIVER"],
        message:
          "Na Vercel use STORAGE_DRIVER=s3 (ex.: Cloudflare R2); o disco dela não guarda arquivos",
      });
    }

    if (env.STORAGE_DRIVER !== "s3") return;

    const requiredS3Keys = [
      "S3_BUCKET",
      "S3_ACCESS_KEY_ID",
      "S3_SECRET_ACCESS_KEY",
      "S3_PUBLIC_URL",
    ] as const;

    for (const key of requiredS3Keys) {
      if (!env[key]) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: `${key} é obrigatório quando STORAGE_DRIVER=s3`,
        });
      }
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | undefined;

/**
 * Lê e valida as variáveis de ambiente na primeira chamada.
 * A leitura é preguiçosa para que o `next build` funcione sem o .env de produção.
 */
export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}
