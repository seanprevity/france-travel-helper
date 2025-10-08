import { Request, Response } from "express";
import {
  getDescriptionService,
  getImagesService,
  getWeatherService,
} from "../services/descriptionService";
import { getCityService } from "../services/cityServices";

export const getDescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { insee, lang } = req.query;
    if (
      !insee ||
      typeof insee !== "string" ||
      !lang ||
      typeof lang !== "string"
    ) {
      res
        .status(400)
        .json({
          message:
            "Missing or invalid insee/lang query params for fetching descriptions.",
        });
      return;
    }
    const city = await getCityService(insee);
    if (!city) {
      res.status(400).json({ message: "Missing or invalid city." });
      return;
    }
    const description = await getDescriptionService(
      city.nomStandard,
      city.depNom,
      city.regNom,
      lang,
      insee
    );
    res.json(description);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving description: ${error.message}` });
  }
};

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { insee } = req.query;
    if (!insee || typeof insee !== "string") {
      res
        .status(400)
        .json({
          message: "Missing or invalid insee query params for fetching images.",
        });
      return;
    }
    const city = await getCityService(insee);
    if (!city) {
      res.status(400).json({ message: "Missing or invalid city." });
      return;
    }
    const images = await getImagesService(city.nomStandard, city.depNom);
    res.json(images);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving images: ${error.message}` });
  }
};

export const getWeather = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng } = req.query;
    if (!lat || typeof lat !== "string" || !lng || typeof lng !== "string") {
      res
        .status(400)
        .json({ message: "Missing or invalid insee/lang query params." });
      return;
    }
    const weather = await getWeatherService(lat, lng);
    res.json(weather);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving weather: ${error.message}` });
  }
};
