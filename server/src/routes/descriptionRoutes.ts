import express from "express";
import {
  getDescription,
  getImages,
  getWeather,
} from "../controllers/descriptionController";

const router = express.Router();

router.get("/", getDescription);
router.get("/images", getImages);
router.get("/weather", getWeather);

export default router;
