import Listing from "../models/listing.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(errorHandler(400, "Failed to create listing" + error.message));
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(401, "You are not authorized to delete this listing")
      );
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(errorHandler(400, "Failed to delete listing" + error.message));
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef) {
      return next(
        errorHandler(401, "You are not authorized to update this listing")
      );
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(errorHandler(400, "Failed to update listing" + error.message));
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(400, "Failed to get listing" + error.message));
  }
};
