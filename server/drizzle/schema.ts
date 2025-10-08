import { pgTable, unique, text, bigint, doublePrecision, index, foreignKey, check, serial, integer, smallint, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const cities = pgTable("cities", {
	codeInsee: text("code_insee").primaryKey().notNull(),
	nomStandard: text("nom_standard").notNull(),
	typecomTexte: text("typecom_texte"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	regCode: bigint("reg_code", { mode: "number" }).notNull(),
	regNom: text("reg_nom").notNull(),
	depCode: text("dep_code").notNull(),
	depNom: text("dep_nom").notNull(),
	cantonCode: text("canton_code"),
	cantonNom: text("canton_nom"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	academieCode: bigint("academie_code", { mode: "number" }),
	academieNom: text("academie_nom"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	superficieHectare: bigint("superficie_hectare", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	superficieKm2: bigint("superficie_km2", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	densite: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	altitudeMoyenne: bigint("altitude_moyenne", { mode: "number" }),
	altitudeMinimale: text("altitude_minimale"),
	altitudeMaximale: text("altitude_maximale"),
	latitudeMairie: doublePrecision("latitude_mairie"),
	longitudeMairie: doublePrecision("longitude_mairie"),
	latitudeCentre: doublePrecision("latitude_centre"),
	longitudeCentre: doublePrecision("longitude_centre"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	grilleDensite: bigint("grille_densite", { mode: "number" }),
	grilleDensiteTexte: text("grille_densite_texte"),
	urlWikipedia: text("url_wikipedia"),
	urlVilledereve: text("url_villedereve"),
}, (table) => [
	unique("cities_code_insee_key").on(table.codeInsee),
]);

export const ratings = pgTable("ratings", {
	id: serial().primaryKey().notNull(),
	inseeCode: text("insee_code").notNull(),
	userId: integer("user_id").notNull(),
	rating: smallint().notNull(),
}, (table) => [
	index("idx_ratings_town_code").using("btree", table.inseeCode.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.inseeCode],
			foreignColumns: [cities.codeInsee],
			name: "ratings_insee_code_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "ratings_user_id_fkey"
		}),
	check("ratings_rating_check", sql`(rating >= 1) AND (rating <= 5)`),
]);

export const departments = pgTable("departments", {
	id: serial().notNull(),
	code: varchar({ length: 4 }).notNull(),
	capital: varchar({ length: 10 }).notNull(),
	region: varchar({ length: 4 }).notNull(),
	name: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.region],
			foreignColumns: [regions.code],
			name: "departments_region_fkey"
		}),
	unique("departments_code_key").on(table.code),
	unique("departments_capital_key").on(table.capital),
	unique("departments_name_key").on(table.name),
]);

export const descriptions = pgTable("descriptions", {
	id: serial().primaryKey().notNull(),
	inseeCode: text("insee_code").notNull(),
	language: text().notNull(),
	description: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.inseeCode],
			foreignColumns: [cities.codeInsee],
			name: "descriptions_insee_code_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const regions = pgTable("regions", {
	id: serial().notNull(),
	code: varchar({ length: 4 }).notNull(),
	capital: varchar({ length: 10 }).notNull(),
	name: text().notNull(),
}, (table) => [
	unique("regions_code_key").on(table.code),
]);

export const towns = pgTable("towns", {
	id: serial().notNull(),
	code: varchar({ length: 10 }).notNull(),
	article: text(),
	name: text().notNull(),
	department: varchar({ length: 4 }).notNull(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	population: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.department],
			foreignColumns: [departments.code],
			name: "towns_department_fkey"
		}),
	unique("unique_code_department").on(table.code, table.department),
]);

export const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	username: text().notNull(),
	email: text().notNull(),
	cognitoId: text().notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),
	unique("users_email_key").on(table.email),
]);

export const bookmarks = pgTable("bookmarks", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	inseeCode: text("insee_code").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.inseeCode],
			foreignColumns: [cities.codeInsee],
			name: "bookmarks_insee_code_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "bookmarks_user_id_fkey"
		}).onDelete("cascade"),
]);
