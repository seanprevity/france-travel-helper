import { Request, Response } from "express";
import {
  getCitiesService,
  getCityService,
  findNearestCityService,
  getSearchedCitiesService,
  getRandomCityService,
} from "../services/cityServices";

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await getCitiesService(req.query);
    res.json(cities);
  } catch (error: any) {
    console.error("❌ Error retrieving cities: ", error);
    res.status(500).json({
      message: `Error retrieving cities: ${error.message}`,
    });
  }
};

export const getCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codeInsee } = req.params;
    const city = await getCityService(codeInsee);
    res.json(city);
  } catch (error: any) {
    console.error("❌ Error retrieving city: ", error);
    res.status(500).json({
      message: `Error retrieving city: ${error.message}`,
    });
  }
};

export const getNearestCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { lat, lng } = req.params;
  if (!lat || !lng) {
    res.status(400).json({ error: "Latitude and longitude are required." });
    return;
  }
  try {
    const city = await findNearestCityService(lat, lng);
    if (!city) {
      res.status(404).json({ message: "No nearby city found." });
      return;
    }
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getSearchedCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { input } = req.params;
    if (!input) {
      res.status(400).json({ error: "Input is required."})
    }
    const cities = await getSearchedCitiesService(input);
    res.json(cities);
  } catch (error: any) {
    res.status(500).json({ message: `Error finding searched cities: ${error.message}`});
  }
}

export const getRandomCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await getRandomCityService();
    res.json(city);
  } catch (err: any) {
    res.status(500).json({ message: `Error fetching a random city: ${err.message}`});
  }
}