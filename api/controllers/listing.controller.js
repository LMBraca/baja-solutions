import Listing from "../models/listing.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.js";

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

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
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
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sell"] };
    }

    const listings = await Listing.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
      offer,
      furnished,
      parking,
      type,
    })
      .limit(limit)
      .skip(startIndex)
      .sort({ [sort]: order });

    return res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(400, "Failed to get user listings" + error.message));
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
