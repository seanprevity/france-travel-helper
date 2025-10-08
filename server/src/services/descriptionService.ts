import axios from "axios";
import { db } from "../lib/db";
import { descriptions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

const api_key = process.env.WEATHER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const BLOCKLIST = [
  "armoiries",
  "blason",
  "logo",
  "drapeau",
  "flag",
  "coat_of_arms",
  "emblème",
  "symbol",
  "badge",
  "map",
  "carte",
  "plan",
  "banner",
  "coat",
  "textes",
  "texte",
  "allemands",
  "banc",
  "coupe",
  "graphique",
  "illustration",
];

const ALLOWLIST = [
  "eglise",
  "église",
  "chateau",
  "château",
  "jardin",
  "place",
  "rue",
  "pont",
  "mairie",
  "panorama",
  "vue",
  "paysage",
  "montagne",
  "plage",
  "rivière",
  "lac",
  "skyline",
  "aérien",
  "aerial",
  "panoramique",
  "ville",
  "tour",
  "historique",
  "centre-ville",
  "vieux",
  "vieille",
  "naturelle",
  "l'église",
  "halle",
  "monument",
  "statue",
  "tower",
  "arc",
  "champs",
  "louvre",
  "museum",
  "city",
];

export const deleteDescriptionService = async (
  inseeCode: string,
  lang: string
) => {
  try {
    await db
      .delete(descriptions)
      .where(
        and(
          eq(descriptions.inseeCode, inseeCode),
          eq(descriptions.language, lang)
        )
      );
  } catch (error: any) {
    console.error("Failed to delete description:", error.message);
    throw new Error("Could not delete city description.");
  }
};

export const getDescriptionService = async (
  city: string,
  dep: string,
  reg: string,
  lang: string,
  inseeCode: string
) => {
  const existing = await db
    .select()
    .from(descriptions)
    .where(
      and(
        eq(descriptions.inseeCode, inseeCode),
        eq(descriptions.language, lang)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const prompt =
    lang === "fr"
      ? `Fournis des informations détaillées sur ${city}, située dans le département de ${dep}, en région ${reg}, en France. Suis exactement la structure ci-dessous :
 
 DESCRIPTION:
 [Une présentation de 2 à 3 phrases décrivant ce qui rend cette ville unique, attrayante ou intrigante pour les visiteurs.]
 
 HISTORY:
 [Un résumé en 2 à 3 phrases des origines de la ville, de son histoire marquante ou d'événements notables qui la définissent.]
 
 ATTRACTIONS:
 [Indique entre 1 et 5 attractions selon l'importance réelle de la ville. Choisis uniquement les lieux vraiment remarquables.
 Pour les petits villages ou villes peu connues : 1 point d'intérêt majeur.
 Pour les villes moyennes : 2 attractions principales.
 Pour les grandes villes ou lieux à forte valeur historique : jusqu'à 5 attractions possibles.]
 1. [Nom] - [Brève description de son intérêt et de sa localisation]
 2. [Nom] - [Brève description de son intérêt et de sa localisation]
 (…poursuivre la numérotation jusqu'au nombre d'attractions retenu)`
      : `Provide detailed information about ${city}, located in the ${dep} department of the ${reg} region of France. Use the following structure exactly:
 
 DESCRIPTION:
 [2-3 sentence overview detailing the town's uniqueness and what makes it intriguing.]
 
 HISTORY:
 [2-3 sentences briefly outlining the town's background and notable past events that define the town.]
 
 ATTRACTIONS:
 [Choose between 1 and 5 attractions, based on how many truly notable sites the town has. Pick anything that the town offers that is unique or interesting.  
  Small villages or lesser-known towns: 1 key point of interest.  
  Mid-sized towns: 2 main attractions.  
  Major cities or historically rich locales: up to 5.]
 1. [Name] - [Short description of its significance and location]
 2. [Name] - [Short description of its significance and location]
 (…continue numbering up to the chosen count)`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  const body = {
    model: "gpt-4.1-nano",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0.1,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, body, { headers });
    const content = response.data.choices[0].message.content.trim();

    // 4. Insert into DB
    const inserted = await db
      .insert(descriptions)
      .values({
        inseeCode,
        language: lang,
        description: content,
      })
      .returning();

    return inserted[0];
  } catch (error: any) {
    console.error("OpenAI API error:", error?.response?.data || error.message);
    throw new Error("Failed to fetch city description.");
  }
};

const fetchWikiImages = async (
  title: string,
  token: string,
  thumbWidth: number = 1500,
  maxFetch: number = 100,
  extra: number = 7
) => {
  const API = `https://fr.wikipedia.org/w/api.php`;
  const results: {
    url: string;
    description?: string | null;
    primary: boolean;
  }[] = [];
  const seen = new Set<string>();

  try {
    // 1) Thumbnail from infobox
    const thumbRes = await axios.get(API, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: thumbWidth,
      },
    });

    const pages = thumbRes.data?.query?.pages || {};
    for (const page of Object.values(pages)) {
      const thumb = (page as any)?.thumbnail?.source;
      if (thumb && !seen.has(thumb)) {
        results.push({ url: thumb, description: null, primary: true });
        seen.add(thumb);
      }
      break;
    }
  } catch (err) {
    console.error("Infobox thumbnail error", err);
  }

  let titles: string[] = [];
  try {
    const titleRes = await axios.get(API, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "images",
        imlimit: maxFetch,
      },
    });
    const pageObj = Object.values(titleRes.data.query.pages)[0] as {
      images?: { title: string }[];
    };
    const images = pageObj?.images ?? [];
    titles = images
      .map((img: any) => img.title)
      .filter((t: string) => /\.(jpg|jpeg|png)$/i.test(t));
  } catch (err) {
    console.error("Image title fetch error", err);
  }

  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    try {
      const infoRes = await axios.get(API, {
        params: {
          action: "query",
          format: "json",
          titles: chunk.join("|"),
          prop: "imageinfo",
          iiprop: "url|thumburl|extmetadata",
          iiurlwidth: thumbWidth,
        },
      });

      const pages = infoRes.data?.query?.pages || {};
      for (const page of Object.values(pages)) {
        const pg: any = page;
        const ii = pg.imageinfo?.[0];
        const thumb = ii?.thumburl || ii?.url;
        const name = pg.title.toLowerCase().replace("file:", "");
        if (!thumb || seen.has(thumb)) continue;
        if (BLOCKLIST.some((bl) => name.includes(bl))) continue;
        if (
          !(name.includes(token) || ALLOWLIST.some((kw) => name.includes(kw)))
        )
          continue;

        const rawDesc = ii.extmetadata?.ImageDescription?.value || "";
        const cleanDesc = rawDesc.replace(/<[^>]+>/g, "").trim();
        if (BLOCKLIST.some((bl) => cleanDesc.toLowerCase().includes(bl)))
          continue;

        results.push({
          url: thumb,
          description: cleanDesc || null,
          primary: false,
        });
        seen.add(thumb);
      }
    } catch (err) {
      console.error("Image info error", err);
    }
  }

  const limit = extra + 5;
  const primaries = results.filter((r) => r.primary);
  const others = results.filter((r) => !r.primary);

  const chosen =
    results.length > limit
      ? [
          ...primaries,
          ...others
            .sort(() => 0.5 - Math.random())
            .slice(0, limit - primaries.length),
        ]
      : results;

  return chosen;
};

export const getImagesService = async (name: string, department: string) => {
  const token = name.toLowerCase().replace(/\s+/g, "_");

  let images = await fetchWikiImages(name, token);
  if (!images.length) {
    const fallback = `${name.replace(/\s+/g, "_")}_(${department.replace(
      /\s+/g,
      "_"
    )})`;
    console.info(`No images found under ${token}, retrying with ${fallback}`);
    images = await fetchWikiImages(fallback, token);
  }

  return { images };
};

export const getWeatherService = async (
  latitude: string,
  longitude: string
) => {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${latitude},${longitude}&days=3`;

    const response = await axios.get(url);
    const data = response.data;

    const forecast = data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      temp_min: day.day.mintemp_c,
      temp_max: day.day.maxtemp_c,
      description: day.day.condition.text,
      icon: day.day.condition.icon,
    }));

    return {
      location: data.location.name,
      region: data.location.region,
      country: data.location.country,
      forecast,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw new Error("Unable to fetch weather data");
  }
};
