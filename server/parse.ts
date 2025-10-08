import fs from "fs/promises";
import path from "path";

async function loadCitiesData() {
  const filePath = path.resolve(__dirname, "data/cities.json"); // adjust path as needed
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}
