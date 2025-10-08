import { cities } from "../../drizzle/schema";
import { and, eq, gte, lte, sql, ilike } from "drizzle-orm";
import { db } from "../lib/db";

export const setCityFilters = (query: any) => {
  const {
    location,
    populationMin,
    populationMax,
    altitudeMin,
    altitudeMax,
    densityMin,
    densityMax,
    region,
    department,
    academie,
    latitude,
    longitude,
    insee,
  } = query;

  const whereConditions: (ReturnType<typeof sql> | undefined)[] = [];

  if (insee && insee !== "any") {
    whereConditions.push(eq(cities.codeInsee, insee));
    return whereConditions.length > 0 ? and(...whereConditions) : undefined;
  }
  // finds places with location (not case-sensitive)
  if (location && location !== "") {
    whereConditions.push(ilike(cities.nomStandard, location));
  }

  if (populationMin) {
    whereConditions.push(gte(cities.population, Number(populationMin)));
  }

  if (populationMax && populationMax !== "800000") {
    whereConditions.push(lte(cities.population, Number(populationMax)));
  }

  if (altitudeMin) {
    whereConditions.push(gte(cities.altitudeMoyenne, Number(altitudeMin)));
  }

  if (altitudeMax && altitudeMax !== "1600") {
    whereConditions.push(lte(cities.altitudeMoyenne, Number(altitudeMax)));
  }

  if (densityMin) {
    whereConditions.push(gte(cities.densite, Number(densityMin)));
  }

  if (densityMax && densityMax !== "20000") {
    whereConditions.push(lte(cities.densite, Number(densityMax)));
  }

  // latitude and longitude will return all cities within 10 miles
  if (latitude && longitude) {
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusInMiles = 10;
    const radiusInMeters = radiusInMiles * 1609.34;

    whereConditions.push(
      sql`
      ST_DWithin(
        ST_SetSRID(ST_MakePoint(${cities.longitudeMairie}, ${cities.latitudeMairie}), 4326)::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusInMeters}
      )
    `
    );
  }

  if (region && region !== "any") {
    whereConditions.push(eq(cities.regNom, region));
  }

  if (department && department !== "any") {
    whereConditions.push(eq(cities.depNom, department));
  }

  if (academie && academie !== "any") {
    whereConditions.push(eq(cities.academieNom, academie));
  }

  const combinedWhere =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  return combinedWhere;
};

export const getCitiesService = async (query: any) => {
  const whereConditions = setCityFilters(query);
  if (!whereConditions) {
    return await db
      .select()
      .from(cities)
      .where(eq(cities.nomStandard, "Paris"));
  }
  return await db.select().from(cities).where(whereConditions);
};

export const getCityService = async (inseeCode: string) => {
  return await db.query.cities.findFirst({
    where: eq(cities.codeInsee, inseeCode),
  });
};

export const findNearestCityService = async (lat: string, lng: string) => {
  const maxD2 = 0.25;
  const distanceExpr = sql<number>`(((${cities.latitudeMairie} - ${lat}::float)^2) + ((${cities.longitudeMairie} - ${lng}::float)^2))`;

  const nearest = await db
    .select()
    .from(cities)
    .where(sql`${distanceExpr} <= ${maxD2}`)
    .orderBy(distanceExpr)
    .limit(1);

  return nearest[0] ?? null;
};

// returns suggestions, sorts by startswith first then the rest after
export const getSearchedCitiesService = async (input: string) => {
  const sanitizedInput = input.replace(/[%_]/g, "\\$&");
  const contains = `%${sanitizedInput}%`;
  const startsWith = `${sanitizedInput}%`;
  return await db
    .select()
    .from(cities)
    .where(ilike(cities.nomStandard, contains))
    .orderBy(
      sql`CASE WHEN ${cities.nomStandard} ILIKE ${startsWith} THEN 0 ELSE 1 END`,
      sql`${cities.population} DESC`
    )
    .limit(15);
};

export  const getRandomCityService = async () => {
  const randInt = Math.floor(Math.random() * 34935);
  const res = await db.select().from(cities).offset(randInt).limit(1);
  return res[0];
};