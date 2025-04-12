import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: { type: Array, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    parkingSpaces: { type: Number, required: false, default: 1 },
    garden: { type: Boolean, required: true, default: false },
    pets: { type: Boolean, required: false, default: false },
    constructionArea: { type: Number, required: true, default: 0 },
    landArea: { type: Number, required: true, default: 0 },
    type: { type: String, required: true },
    offer: { type: Boolean, required: true },
    userRef: { type: String, required: true },
    currency: { type: String, required: true, default: "USD" },
    mxnPrice: { type: Number, required: false },
    usdPrice: { type: Number, required: false },
    category: { type: String, required: true },
    customCharacteristics: { type: Array, required: false, default: [] },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    cityRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: false,
    },
    city: { type: String, required: false },
    sold: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
