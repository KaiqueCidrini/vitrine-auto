import { relations, sql, type SQL } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
  type BodyType,
  type FuelType,
  type Transmission,
  type VehicleStatus,
} from "@/features/vehicles/domain/vehicle-attributes";

import { users } from "./auth-schema";

/**
 * Usamos texto + CHECK em vez de enum nativo do Postgres:
 * adicionar um novo valor vira uma migration simples, sem ALTER TYPE.
 */
function isOneOf(column: SQL, allowedValues: readonly string[]): SQL {
  const quotedValues = allowedValues.map((value) => `'${value}'`).join(", ");
  return sql`${column} in (${sql.raw(quotedValues)})`;
}

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: varchar({ length: 180 }).notNull().unique(),
    brand: varchar({ length: 60 }).notNull(),
    model: varchar({ length: 80 }).notNull(),
    version: varchar({ length: 120 }),
    manufactureYear: smallint().notNull(),
    modelYear: smallint().notNull(),
    mileageKm: integer().notNull(),
    /** Preço em centavos: evita erros de arredondamento com dinheiro. */
    priceInCents: bigint({ mode: "number" }).notNull(),
    transmission: varchar({ length: 20 }).$type<Transmission>().notNull(),
    fuelType: varchar({ length: 20 }).$type<FuelType>().notNull(),
    bodyType: varchar({ length: 20 }).$type<BodyType>().notNull(),
    color: varchar({ length: 40 }).notNull(),
    doors: smallint(),
    description: text(),
    features: text()
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    status: varchar({ length: 20 }).$type<VehicleStatus>().notNull().default("draft"),
    isFeatured: boolean().notNull().default(false),
    publishedAt: timestamp({ withTimezone: true }),
    createdById: uuid().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index().on(table.status, table.publishedAt),
    index().on(table.brand),
    check("vehicles_transmission_check", isOneOf(sql`${table.transmission}`, TRANSMISSIONS)),
    check("vehicles_fuel_type_check", isOneOf(sql`${table.fuelType}`, FUEL_TYPES)),
    check("vehicles_body_type_check", isOneOf(sql`${table.bodyType}`, BODY_TYPES)),
    check("vehicles_status_check", isOneOf(sql`${table.status}`, VEHICLE_STATUSES)),
    check("vehicles_mileage_check", sql`${table.mileageKm} >= 0`),
    check("vehicles_price_check", sql`${table.priceInCents} > 0`),
    check("vehicles_year_check", sql`${table.modelYear} >= ${table.manufactureYear}`),
  ],
);

export const vehiclePhotos = pgTable(
  "vehicle_photos",
  {
    id: uuid().primaryKey().defaultRandom(),
    vehicleId: uuid()
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    storageKey: varchar({ length: 255 }).notNull(),
    position: smallint().notNull(),
    width: integer().notNull(),
    height: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.vehicleId, table.position)],
);

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  photos: many(vehiclePhotos),
}));

export const vehiclePhotosRelations = relations(vehiclePhotos, ({ one }) => ({
  vehicle: one(vehicles, { fields: [vehiclePhotos.vehicleId], references: [vehicles.id] }),
}));
