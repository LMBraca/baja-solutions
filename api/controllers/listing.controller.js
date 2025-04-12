import Listing from "../models/listing.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import City from "../models/city.js";

export const createListing = async (req, res, next) => {
  try {
    // Check if categoryRef is provided but not category
    if (req.body.categoryRef && !req.body.category) {
      const category = await Category.findById(req.body.categoryRef);
      if (category) {
        req.body.category = category.name;
      }
    }

    // Check if cityRef is provided
    if (req.body.cityRef) {
      const city = await City.findById(req.body.cityRef);
      if (city) {
        req.body.city = `${city.name}, ${city.state}`;
      }
    }

    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(errorHandler(400, "Failed to create listing: " + error.message));
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

    // Check if categoryRef is provided but not category
    if (req.body.categoryRef && !req.body.category) {
      const category = await Category.findById(req.body.categoryRef);
      if (category) {
        req.body.category = category.name;
      }
    }

    // Check if cityRef is provided
    if (req.body.cityRef) {
      const city = await City.findById(req.body.cityRef);
      if (city) {
        req.body.city = `${city.name}, ${city.state}`;
      }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(errorHandler(400, "Failed to update listing: " + error.message));
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

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let garden = req.query.garden;
    let pets = req.query.pets;
    let squareMeters = req.query.squareMeters;
    let type = req.query.type;
    let currency = req.query.currency;
    let bedrooms = req.query.bedrooms;
    let bathrooms = req.query.bathrooms;
    let category = req.query.category;
    let categoryRef = req.query.categoryRef;
    let cityRef = req.query.cityRef;
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    if (garden === undefined || garden === "false") {
      garden = { $in: [false, true] };
    }
    if (pets === undefined || pets === "false") {
      pets = { $in: [false, true] };
    }
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sell"] };
    }
    if (currency === undefined || currency === "all") {
      currency = { $in: ["USD", "MXN"] };
    }

    // Build the query object
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
      offer,
      furnished,
      parking,
      garden,
      pets,
      type,
      currency,
    };

    // Handle category filtering
    if (categoryRef) {
      // If categoryRef is provided, filter by reference ID
      query.categoryRef = categoryRef;
    } else if (category && category !== "all") {
      // Otherwise, use the category name if provided
      query.category = category;
    }

    // Handle city filtering
    if (cityRef) {
      query.cityRef = cityRef;
    }

    // Add bedrooms filter if provided
    if (bedrooms) {
      query.bedrooms = { $gte: parseFloat(bedrooms) };
    }

    // Add bathrooms filter if provided
    if (bathrooms) {
      query.bathrooms = { $gte: parseFloat(bathrooms) };
    }

    // Add square meters filter if provided
    if (squareMeters) {
      query.squareMeters = { $gte: parseFloat(squareMeters) };
    }

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(400, "Failed to get listings: " + error.message));
  }
};

export const getListingUser = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    const user = await User.findById(listing.userRef);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Only send non-sensitive user information
    const { password: pass, ...userInfo } = user._doc;

    res.status(200).json(userInfo);
  } catch (error) {
    next(errorHandler(400, "Failed to get listing user" + error.message));
  }
};
