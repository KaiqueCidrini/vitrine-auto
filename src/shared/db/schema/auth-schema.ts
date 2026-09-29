/**
 * Tabelas exigidas pelo Better Auth (com o plugin admin).
 * Os nomes das propriedades seguem o que a biblioteca espera; no banco
 * as colunas ficam em snake_case por causa do `casing: "snake_case"`.
 */
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  role: text().notNull().default("seller"),
  banned: boolean().default(false),
  banReason: text(),
  banExpires: timestamp({ withTimezone: true }),
  ...timestamps,
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    token: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    impersonatedBy: text(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid().primaryKey().defaultRandom(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    ...timestamps,
  },
  (table) => [index().on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index().on(table.identifier)],
);
