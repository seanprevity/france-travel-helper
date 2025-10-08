import { relations } from "drizzle-orm/relations";
import { cities, ratings, users, regions, departments, descriptions, towns, bookmarks } from "./schema";

export const ratingsRelations = relations(ratings, ({one}) => ({
	city: one(cities, {
		fields: [ratings.inseeCode],
		references: [cities.codeInsee]
	}),
	user: one(users, {
		fields: [ratings.userId],
		references: [users.userId]
	}),
}));

export const citiesRelations = relations(cities, ({many}) => ({
	ratings: many(ratings),
	descriptions: many(descriptions),
	bookmarks: many(bookmarks),
}));

export const usersRelations = relations(users, ({many}) => ({
	ratings: many(ratings),
	bookmarks: many(bookmarks),
}));

export const departmentsRelations = relations(departments, ({one, many}) => ({
	region: one(regions, {
		fields: [departments.region],
		references: [regions.code]
	}),
	towns: many(towns),
}));

export const regionsRelations = relations(regions, ({many}) => ({
	departments: many(departments),
}));

export const descriptionsRelations = relations(descriptions, ({one}) => ({
	city: one(cities, {
		fields: [descriptions.inseeCode],
		references: [cities.codeInsee]
	}),
}));

export const townsRelations = relations(towns, ({one}) => ({
	department: one(departments, {
		fields: [towns.department],
		references: [departments.code]
	}),
}));

export const bookmarksRelations = relations(bookmarks, ({one}) => ({
	city: one(cities, {
		fields: [bookmarks.inseeCode],
		references: [cities.codeInsee]
	}),
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.userId]
	}),
}));