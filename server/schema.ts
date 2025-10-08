import {
  pgTable,
  foreignKey,
  unique,
  serial,
  varchar,
  text,
  doublePrecision,
  index,
  check,
  integer,
  smallint,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const departments = pgTable(
  "departments",
  {
    id: serial().notNull(),
    code: varchar({ length: 4 }).notNull(),
    capital: varchar({ length: 10 }).notNull(),
    region: varchar({ length: 4 }).notNull(),
    name: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.region],
      foreignColumns: [regions.code],
      name: "departments_region_fkey",
    }),
    unique("departments_code_key").on(table.code),
    unique("departments_capital_key").on(table.capital),
    unique("departments_name_key").on(table.name),
  ]
);

export const towns = pgTable(
  "towns",
  {
    id: serial().notNull(),
    code: varchar({ length: 10 }).notNull(),
    article: text(),
    name: text().notNull(),
    department: varchar({ length: 4 }).notNull(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    population: integer().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.department],
      foreignColumns: [departments.code],
      name: "towns_department_fkey",
    }),
    unique("unique_code_department").on(table.code, table.department),
  ]
);

export const regions = pgTable(
  "regions",
  {
    id: serial().notNull(),
    code: varchar({ length: 4 }).notNull(),
    capital: varchar({ length: 10 }).notNull(),
    name: text().notNull(),
  },
  (table) => [unique("regions_code_key").on(table.code)]
);

export const users = pgTable(
  "users",
  {
    userId: serial("user_id").primaryKey().notNull(),
    username: text().notNull(),
    email: text().notNull(),
    cognitoId: text().notNull(),
  },
  (table) => [
    unique("users_username_key").on(table.username),
    unique("users_email_key").on(table.email),
  ]
);

export const ratings = pgTable(
  "ratings",
  {
    id: serial().primaryKey().notNull(),
    townCode: varchar("town_code", { length: 10 }).notNull(),
    userId: integer("user_id").notNull(),
    rating: smallint().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    department: varchar({ length: 4 }).default("").notNull(),
  },
  (table) => [
    index("idx_ratings_town_code").using(
      "btree",
      table.townCode.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.userId],
      name: "ratings_user_id_fkey",
    }),
    unique("ratings_town_department_user_unique").on(
      table.townCode,
      table.userId,
      table.department
    ),
    check("ratings_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
  ]
);

export const descriptions = pgTable(
  "descriptions",
  {
    id: serial().primaryKey().notNull(),
    townCode: varchar("town_code", { length: 10 }).notNull(),
    department: varchar({ length: 4 }).notNull(),
    language: varchar({ length: 2 }).notNull(),
    description: text().notNull(),
  },
  (table) => [
    unique("descriptions_town_code_department_language_key").on(
      table.townCode,
      table.department,
      table.language
    ),
  ]
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    townName: text("town_name").notNull(),
    departmentCode: varchar("department_code", { length: 4 }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.userId],
      name: "bookmarks_user_id_fkey",
    }).onDelete("cascade"),
    unique("bookmarks_user_id_town_name_key").on(table.userId, table.townName),
  ]
);
