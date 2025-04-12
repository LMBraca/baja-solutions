import City from "../models/city.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.js";

// Get all cities
export const getCities = async (req, res, next) => {
  try {
    const cities = await City.find().sort({ state: 1, name: 1 });
    res.status(200).json(cities);
  } catch (error) {
    next(errorHandler(500, "Failed to get cities: " + error.message));
  }
};

// Get a single city by ID
export const getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return next(errorHandler(404, "City not found"));
    }
    res.status(200).json(city);
  } catch (error) {
    next(errorHandler(500, "Failed to get city: " + error.message));
  }
};

// Create a new city
export const createCity = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.state) {
      return next(errorHandler(400, "Name and state are required"));
    }

    // Check if city already exists
    const existingCity = await City.findOne({
      name: req.body.name,
      state: req.body.state,
    });

    if (existingCity) {
      return next(errorHandler(400, "City already exists"));
    }

    const newCity = new City({
      name: req.body.name,
      state: req.body.state,
      active: req.body.active !== undefined ? req.body.active : true,
    });

    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    next(errorHandler(500, "Failed to create city: " + error.message));
  }
};

// Update a city
export const updateCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return next(errorHandler(404, "City not found"));
    }

    if (req.body.name === "" || req.body.state === "") {
      return next(errorHandler(400, "Name and state cannot be empty"));
    }

    // Check if updated city would duplicate an existing one
    if (req.body.name || req.body.state) {
      const duplicateCity = await City.findOne({
        name: req.body.name || city.name,
        state: req.body.state || city.state,
        _id: { $ne: req.params.id },
      });

      if (duplicateCity) {
        return next(errorHandler(400, "City already exists"));
      }
    }

    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name || city.name,
          state: req.body.state || city.state,
          active: req.body.active !== undefined ? req.body.active : city.active,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedCity);
  } catch (error) {
    next(errorHandler(500, "Failed to update city: " + error.message));
  }
};

// Delete a city
export const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return next(errorHandler(404, "City not found"));
    }

    // Check if there are any listings using this city
    const listingsUsingCity = await Listing.find({ cityRef: req.params.id });
    if (listingsUsingCity.length > 0) {
      return next(
        errorHandler(
          400,
          "No se puede eliminar la ciudad porque hay publicaciones que la están usando"
        )
      );
    }

    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Failed to delete city: " + error.message));
  }
};
