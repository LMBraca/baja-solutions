import express from "express";
import {
  getCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
} from "../controllers/city.controller.js";

const router = express.Router();

// Get all cities (public access)
router.get("/", getCities);

// Get a single city (public access)
router.get("/:id", getCity);

// Create, update, and delete operations require admin privileges
router.post("/create", createCity);
router.put("/update/:id", updateCity);
router.delete("/delete/:id", deleteCity);

export default router;
