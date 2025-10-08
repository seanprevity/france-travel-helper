import { db } from "./lib/db"; // adjust path as needed
import { cities } from "../drizzle/schema"; // adjust based on your schema location

async function extractAcademiesAndCantons() {
  try {
    // Get all cities
    const allCities = await db.select().from(cities);

    const cantonSet = new Set<string>();
    const deptSet = new Set<string>();

    for (const city of allCities) {
      if (city.cantonNom) cantonSet.add(city.cantonNom.trim());
      if (city.depNom) deptSet.add(city.depNom.trim());
    }
    const cantons = Array.from(cantonSet).sort();
    const departments = Array.from(deptSet).sort();

    //console.log("\n✅ Cantons:");
    //console.log(JSON.stringify(cantons, null, 2));
    console.log(JSON.stringify(departments, null, 2));
  } catch (err) {
    console.error("❌ Error fetching academies and cantons:", err);
  }
}

extractAcademiesAndCantons();
